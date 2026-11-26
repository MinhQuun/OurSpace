import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProviderError } from "../../m10/auth/provider.server";

export type MediaItem = {
  id: string;
  title: string;
  mime_type: string;
  uploaded_by: string;
  created_at: Date;
  byte_size: number;
  sha256: string;
};
export type MediaRegisterInput = {
  commandId: string;
  title: string;
  mimeType: string;
  bucket: string;
  objectKey: string;
  byteSize: number;
  sha256: string;
};
export type MediaShareInput = {
  commandId: string;
  mediaId: string;
  granteeId: string;
  spaceId: string;
  mode: "private" | "share_existing" | "shared_copy";
  version: number;
  confirmed: boolean;
};
const uuid = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
function digest(session: string) {
  if (
    !/^[A-Za-z0-9_-]{43}$/.test(session) ||
    Buffer.from(session, "base64url").toString("base64url") !== session
  )
    throw new AuthProviderError("denied");
  return createHash("sha256").update(session).digest("hex");
}
export class MediaService {
  constructor(private readonly db: ReturnType<typeof createDatabase>) {}
  async register(
    session: string,
    input: MediaRegisterInput,
  ): Promise<{ id: string }> {
    const hash = digest(session);
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      Object.keys(input).some(
        (key) =>
          ![
            "commandId",
            "title",
            "mimeType",
            "bucket",
            "objectKey",
            "byteSize",
            "sha256",
          ].includes(key),
      ) ||
      !uuid(input.commandId) ||
      typeof input.title !== "string" ||
      !input.title.trim() ||
      input.title.trim().length > 200 ||
      typeof input.mimeType !== "string" ||
      !input.mimeType.trim() ||
      typeof input.bucket !== "string" ||
      !/^[a-z][a-z0-9-]{0,62}$/.test(input.bucket) ||
      !uuid(input.objectKey) ||
      !Number.isSafeInteger(input.byteSize) ||
      input.byteSize < 0 ||
      typeof input.sha256 !== "string" ||
      !/^[a-f0-9]{64}$/.test(input.sha256)
    )
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.register_media($1,$2,$3,$4,$5,$6,$7,$8,$9) AS id",
      [
        hash,
        input.commandId,
        input.title.trim(),
        input.mimeType.trim(),
        input.bucket,
        input.objectKey,
        input.byteSize,
        input.sha256,
      ],
    );
    if (!result.rows[0]?.id) throw new AuthProviderError("denied");
    return { id: result.rows[0].id };
  }
  async page(session: string, after?: string) {
    const hash=digest(session);
    let beforeTime:string|null=null,beforeId:string|null=null;
    if(after!==undefined){
      try{
        if(after.length>300||!after.length||!/^[A-Za-z0-9_-]+$/.test(after))throw new Error();
        const raw=Buffer.from(after,"base64url");if(raw.toString("base64url")!==after)throw new Error();
        const cursor=JSON.parse(raw.toString("utf8"));
        if(!Array.isArray(cursor)||cursor.length!==2||typeof cursor[0]!=="string"||!uuid(cursor[1])||
          !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{1,6})?[+-]\d{2}(?::\d{2})?$/.test(cursor[0])||!Number.isFinite(Date.parse(cursor[0])))throw new Error();
        [beforeTime,beforeId]=cursor;
      }catch{throw new AuthProviderError("invalid_input");}
    }
    const result=await this.db.query<{id:string;title:string;mime_type:string;created_at:string;byte_size:string}>(
      "SELECT * FROM app_internal.list_media_page($1,$2,$3)",[hash,beforeTime,beforeId]);
    const rows=result.rows.slice(0,50),last=rows.at(-1);
    return {media:rows.map(row=>({id:row.id,title:row.title,mimeType:row.mime_type,createdAt:row.created_at,byteSize:Number(row.byte_size)})),
      nextCursor:result.rows.length>50&&last?Buffer.from(JSON.stringify([last.created_at,last.id])).toString("base64url"):null};
  }
  async list(session: string, limit = 50): Promise<MediaItem[]> {
    const hash = digest(session);
    const result = await this.db.query<MediaItem>(
      "SELECT id,title,mime_type,uploaded_by,created_at,byte_size,sha256 FROM app_internal.list_media($1,$2)",
      [hash, Math.max(1, Math.min(limit, 100))],
    );
    return result.rows;
  }
  async share(
    session: string,
    input: MediaShareInput,
  ): Promise<{ id: string }> {
    const hash = digest(session);
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      Object.keys(input).some(
        (key) =>
          ![
            "commandId",
            "mediaId",
            "granteeId",
            "spaceId",
            "mode",
            "version",
            "confirmed",
          ].includes(key),
      ) ||
      !uuid(input.commandId) ||
      !uuid(input.mediaId) ||
      !uuid(input.granteeId) ||
      !uuid(input.spaceId) ||
      !["private", "share_existing", "shared_copy"].includes(input.mode) ||
      !Number.isSafeInteger(input.version) ||
      input.version < 1 ||
      input.confirmed !== true
    )
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.share_media($1,$2,$3,$4,$5,$6,$7,$8) AS id",
      [
        hash,
        input.commandId,
        input.mediaId,
        input.granteeId,
        input.spaceId,
        input.mode,
        input.version,
        input.confirmed,
      ],
    );
    if (!result.rows[0]?.id) throw new AuthProviderError("denied");
    return { id: result.rows[0].id };
  }
}
