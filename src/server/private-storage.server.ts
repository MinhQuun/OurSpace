import "server-only";
import { createHash } from "node:crypto";

export class StorageUnavailableError extends Error {
  constructor() { super("Storage operation unavailable"); }
}

export type BinaryLocation = {
  bucket: string; object_key: string; byte_size: number; sha256: string;
};

/** Transport only. Callers must authorize the source object on every request.
 * Location/integrity metadata and credential supplier are trusted server inputs.
 * No backend URL, credentials, headers or error body leave this adapter.
 */
export class PrivateStorage {
  private readonly base: string;
  constructor(base: string, private readonly credential: () => Promise<string>,
              private readonly maxBytes: number) {
    try {
      const url = new URL(base);
      if (url.username || url.password || url.search || url.hash ||
          !["", "/", "/storage/v1", "/storage/v1/"].includes(url.pathname) ||
          !(url.protocol === "https:" || (url.protocol === "http:" &&
            ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname))) ||
          !Number.isSafeInteger(maxBytes) || maxBytes < 1) throw new Error();
      this.base = url.href.replace(/\/$/, "");
    } catch { throw new StorageUnavailableError(); }
  }

  async read(location: BinaryLocation, signal?: AbortSignal): Promise<Buffer> {
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    try {
      if (!/^[a-z][a-z0-9-]{0,62}$/.test(location.bucket) ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(location.object_key) ||
          !Number.isSafeInteger(location.byte_size) || location.byte_size < 0 ||
          location.byte_size > this.maxBytes || !/^[a-f0-9]{64}$/.test(location.sha256))
        throw new Error();
      const abort = signal ? AbortSignal.any([signal, AbortSignal.timeout(30_000)])
        : AbortSignal.timeout(30_000);
      const credential = await this.credential();
      if (!credential || /[\r\n]/.test(credential)) throw new Error();
      const response = await fetch(`${this.base}/object/${location.bucket}/${location.object_key}`, {
        headers: { Authorization: `Bearer ${credential}` },
        cache: "no-store", redirect: "error", signal: abort,
      });
      reader = response.body?.getReader();
      if (response.status !== 200 || !reader) throw new Error();
      const length = response.headers.get("content-length");
      if (length !== null && (!/^\d+$/.test(length) || Number(length) !== location.byte_size))
        throw new Error();
      const chunks: Uint8Array[] = [];
      let received = 0;
      const hash = createHash("sha256");
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > location.byte_size || received > this.maxBytes) throw new Error();
        hash.update(value); chunks.push(value);
      }
      if (received !== location.byte_size || hash.digest("hex") !== location.sha256) throw new Error();
      return Buffer.concat(chunks, received);
    } catch { throw new StorageUnavailableError(); }
    finally { await reader?.cancel().catch(() => undefined); }
  }
}
