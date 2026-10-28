import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "./database.server";
import { PrivateStorage } from "./private-storage.server";

type Binding = {
  binary_id: string;
  resource_id: string;
  purpose: "original" | "preview" | "document";
  bucket: string;
  object_key: string;
  byte_size: string;
  sha256: string;
};
/** A domain must check its separate download/reveal/state rules. No default allow. */
export type AuthorizeBinaryDownload = (
  session: string,
  resource: string,
  purpose: Binding["purpose"],
) => Promise<boolean>;

export class BinaryDownloadService {
  constructor(
    private readonly db: ReturnType<typeof createDatabase>,
    private readonly storage: PrivateStorage,
    private readonly authorizeDomain: AuthorizeBinaryDownload,
  ) {}

  /** Null intentionally conflates nonexistent, private, revoked and domain-denied. */
  async read(
    session: string,
    binary: string,
    signal?: AbortSignal,
  ): Promise<Buffer | null> {
    if (
      !/^[A-Za-z0-9_-]{43}$/.test(session) ||
      Buffer.from(session, "base64url").toString("base64url") !== session ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        binary,
      )
    )
      return null;
    const hash = createHash("sha256").update(session).digest("hex");
    const resolve = async () =>
      (
        await this.db.query<Binding>(
          "SELECT binary_id,resource_id,purpose,bucket,object_key,byte_size,sha256 FROM app_internal.resolve_readable_binary($1,$2)",
          [hash, binary],
        )
      ).rows[0];
    const first = await resolve();
    if (
      !first ||
      (await this.authorizeDomain(
        session,
        first.resource_id,
        first.purpose,
      )) !== true
    )
      return null;
    const bytes = await this.storage.read(
      { ...first, byte_size: Number(first.byte_size) },
      signal,
    );
    // Never retain a capability from the beginning of a slow backend request.
    const current = await resolve();
    if (
      !current ||
      JSON.stringify(current) !== JSON.stringify(first) ||
      (await this.authorizeDomain(
        session,
        current.resource_id,
        current.purpose,
      )) !== true ||
      signal?.aborted
    )
      return null;
    return bytes;
  }
}
