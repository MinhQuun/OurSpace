import "server-only";
import { createHash } from "node:crypto";
import { DatabaseUnavailableError } from "../../../server/database.server";
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
  cancelled_at: Date | null;
  reused: boolean;
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
      "SELECT * FROM app_internal.read_media_upload_resolution($1,$2)",
      [token, uploadId],
    );
    if (!result.rows[0]) throw new AuthProviderError("denied");
    return { token, item: result.rows[0] };
  }
  async pending(session: string, after?: string) {
    const token = hash(session);
    if (after !== undefined && !uuid(after)) throw new AuthProviderError("invalid_input");
    const result = await this.db.query<Pick<Upload,"id"|"title"|"mime_type"|"byte_size"|"sha256">>(
      "SELECT * FROM app_internal.list_pending_media_uploads($1,$2)", [token,after ?? null]);
    const items = result.rows.slice(0,50).map(row => ({uploadId:row.id,title:row.title,mimeType:row.mime_type,
      byteSize:Number(row.byte_size),sha256:row.sha256}));
    return {items,nextCursor:result.rows.length>50 ? items[49].uploadId : null};
  }
  async duplicates(session: string, uploadId: string, after?: string) {
    if (after !== undefined && !uuid(after)) throw new AuthProviderError("invalid_input");
    const { token, item } = await this.owned(session, uploadId);
    const result = await this.db.query<{id:string;title:string;mime_type:string}>(
      "SELECT * FROM app_internal.find_media_duplicates($1,$2,$3,$4)",
      [token,item.sha256,item.byte_size,after ?? null]);
    const items=result.rows.slice(0,50).map(row=>({mediaId:row.id,title:row.title,mimeType:row.mime_type}));
    return {items,nextCursor:result.rows.length>50 ? items[49].mediaId : null};
  }
  async status(session: string, uploadId: string) {
    const { item } = await this.owned(session, uploadId);
    return {
      uploadId: item.id,
      mediaId: item.media_id,
      state: item.reused ? "reused" : item.cancelled_at ? "cancelled" : item.media_id ? "completed" : "pending",
    };
  }
  async reuse(session: string, uploadId: string, input: unknown) {
    const token=hash(session);
    if(!uuid(uploadId)||!input||typeof input!=="object"||Array.isArray(input)) throw new AuthProviderError("invalid_input");
    const value=input as Record<string,unknown>;
    if(Object.keys(value).some(k=>!["mediaId","confirmed"].includes(k))||!uuid(value.mediaId)||value.confirmed!==true) throw new AuthProviderError("invalid_input");
    const result=await this.db.query<{id:string}>("SELECT app_internal.reuse_media_upload($1,$2,$3,$4) AS id",[token,uploadId,value.mediaId,true]);
    return {uploadId,mediaId:result.rows[0].id,state:"reused"};
  }
  async cancel(session: string, uploadId: string) {
    const token=hash(session);
    if (!uuid(uploadId)) throw new AuthProviderError("invalid_input");
    await this.db.query("SELECT app_internal.cancel_media_upload($1,$2)",[token,uploadId]);
    return {uploadId,state:"cancelled"};
  }
  async upload(
    session: string,
    uploadId: string,
    input: Uint8Array,
    signal?: AbortSignal,
  ) {
    const { token, item } = await this.owned(session, uploadId);
    if (item.reused) throw new DatabaseUnavailableError("conflict");
    if (item.cancelled_at) throw new AuthProviderError("denied");
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
