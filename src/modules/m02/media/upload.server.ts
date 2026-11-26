import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import type { PrivateStorage } from "../../../server/private-storage.server";
import { AuthProviderError } from "../../m10/auth/provider.server";
import { validateImage, type ImageLimits } from "./validate-image";

type Intent = {
  commandId: string;
  title: string;
  mimeType: string;
  byteSize: number;
  sha256: string;
};
type Upload = {
  id: string;
  title: string;
  mime_type: string;
  byte_size: string;
  sha256: string;
  bucket: string;
  object_key: string;
  media_id: string | null;
};
const uuid = (v: unknown): v is string =>
  typeof v === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
function hash(session: string) {
  if (
    !/^[A-Za-z0-9_-]{43}$/.test(session) ||
    Buffer.from(session, "base64url").toString("base64url") !== session
  )
    throw new AuthProviderError("denied");
  return createHash("sha256").update(session).digest("hex");
}
export class MediaUploadService {
  constructor(
    private readonly db: ReturnType<typeof createDatabase>,
    private readonly storage: PrivateStorage,
    private readonly limits: ImageLimits,
  ) {
    if (
      ![limits.maxBytes, limits.maxPixels, limits.timeoutSeconds].every(
        (n) => Number.isSafeInteger(n) && n > 0,
      )
    )
      throw new AuthProviderError("unavailable");
    this.limits = Object.freeze({ ...limits });
  }
  async begin(session: string, input: Intent): Promise<{ uploadId: string }> {
    const token = hash(session);
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      Object.keys(input).some(
        (k) =>
          !["commandId", "title", "mimeType", "byteSize", "sha256"].includes(k),
      ) ||
      !uuid(input.commandId) ||
      typeof input.title !== "string" ||
      !input.title.trim() ||
      input.title.trim().length > 200 ||
      !["image/jpeg", "image/png", "image/webp"].includes(input.mimeType) ||
      !Number.isSafeInteger(input.byteSize) ||
      input.byteSize < 1 ||
      input.byteSize > this.limits.maxBytes ||
      typeof input.sha256 !== "string" ||
      !/^[a-f0-9]{64}$/.test(input.sha256)
    )
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.begin_media_upload($1,$2,$3,$4,$5,$6) AS id",
      [
        token,
        input.commandId,
        input.title.trim(),
        input.mimeType,
        input.byteSize,
        input.sha256,
      ],
    );
    return { uploadId: result.rows[0].id };
  }
  private async owned(session: string, uploadId: string) {
    const token = hash(session);
    if (!uuid(uploadId)) throw new AuthProviderError("invalid_input");
    const result = await this.db.query<Upload>(
      "SELECT * FROM app_internal.read_media_upload($1,$2)",
      [token, uploadId],
    );
    if (!result.rows[0]) throw new AuthProviderError("denied");
    return { token, item: result.rows[0] };
  }
  async status(session: string, uploadId: string) {
    const { item } = await this.owned(session, uploadId);
    return {
      uploadId: item.id,
      mediaId: item.media_id,
      state: item.media_id ? "completed" : "pending",
    };
  }
  async upload(
    session: string,
    uploadId: string,
    input: Uint8Array,
    signal?: AbortSignal,
  ) {
    const { token, item } = await this.owned(session, uploadId);
    const verified = await validateImage(input, item.mime_type, this.limits);
    if (
      verified.byteSize !== Number(item.byte_size) ||
      verified.sha256 !== item.sha256
    )
      throw new AuthProviderError("invalid_input");
    if (signal?.aborted) throw new AuthProviderError("unavailable");
    if (!item.media_id)
      await this.storage.write(
        {
          bucket: item.bucket,
          object_key: item.object_key,
          byte_size: verified.byteSize,
          sha256: verified.sha256,
        },
        verified.bytes,
        signal,
      );
    if (signal?.aborted) throw new AuthProviderError("unavailable");
    // Rechecks owner/session under DB locks after potentially slow I/O. A failed
    // finalize leaves only a private, unregistered blob; retry uses the same key.
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.finalize_media_upload($1,$2,$3,$4,$5) AS id",
      [token, uploadId, verified.mimeType, verified.byteSize, verified.sha256],
    );
    return { mediaId: result.rows[0].id };
  }
}
