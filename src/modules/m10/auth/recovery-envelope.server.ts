import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export type RecoveryEnvelope = {
  id: string;
  receipt: string;
  accessToken: string;
  expiresAt: number;
};
export class RecoveryEnvelopeError extends Error {
  constructor() {
    super("Recovery proof unavailable");
  }
}

/** Authenticated encryption for an HttpOnly cookie, never an app session.
 * Database capability consumption and provider validation remain authoritative.
 */
export class RecoveryEnvelopeCodec {
  private readonly key: Buffer;
  private readonly context: Buffer;
  constructor(key: string, origin: string) {
    if (!/^[A-Za-z0-9_-]{43}$/.test(key)) throw new RecoveryEnvelopeError();
    this.key = Buffer.from(key, "base64url");
    if (this.key.length !== 32 || this.key.toString("base64url") !== key)
      throw new RecoveryEnvelopeError();
    const url = new URL(origin);
    if (url.origin !== origin) throw new RecoveryEnvelopeError();
    this.context = Buffer.from(`ourspace:password-recovery:v1:${origin}`);
  }

  private validate(value: unknown, now: number): RecoveryEnvelope {
    if (!value || typeof value !== "object") throw new RecoveryEnvelopeError();
    const data = value as RecoveryEnvelope;
    if (
      typeof data.id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        data.id,
      ) ||
      typeof data.receipt !== "string" ||
      !/^[A-Za-z0-9_-]{43}$/.test(data.receipt) ||
      typeof data.accessToken !== "string" ||
      data.accessToken.length > 2400 ||
      !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(
        data.accessToken,
      ) ||
      !Number.isSafeInteger(data.expiresAt) ||
      data.expiresAt <= now
    )
      throw new RecoveryEnvelopeError();
    return {
      id: data.id,
      receipt: data.receipt,
      accessToken: data.accessToken,
      expiresAt: data.expiresAt,
    };
  }

  seal(value: RecoveryEnvelope, now = Date.now()): string {
    const data = this.validate(value, now);
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    cipher.setAAD(this.context);
    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(data), "utf8"),
      cipher.final(),
    ]);
    const result = Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString(
      "base64url",
    );
    if (result.length > 3800) throw new RecoveryEnvelopeError();
    return result;
  }

  open(value: string, now = Date.now()): RecoveryEnvelope {
    try {
      if (!/^[A-Za-z0-9_-]{40,3800}$/.test(value))
        throw new RecoveryEnvelopeError();
      const bytes = Buffer.from(value, "base64url");
      if (bytes.toString("base64url") !== value)
        throw new RecoveryEnvelopeError();
      const decipher = createDecipheriv(
        "aes-256-gcm",
        this.key,
        bytes.subarray(0, 12),
      );
      decipher.setAAD(this.context);
      decipher.setAuthTag(bytes.subarray(12, 28));
      const decoded = Buffer.concat([
        decipher.update(bytes.subarray(28)),
        decipher.final(),
      ]);
      return this.validate(JSON.parse(decoded.toString("utf8")), now);
    } catch {
      throw new RecoveryEnvelopeError();
    }
  }
}
