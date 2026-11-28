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
  async updateMetadata(session: string, mediaId: string, input: unknown) {
    const hash = digest(session);
    if (!uuid(mediaId) || !input || typeof input !== "object" || Array.isArray(input))
      throw new AuthProviderError("invalid_input");
    const value = input as Record<string, unknown>;
    if (Object.keys(value).sort().join(",") !== "commandId,description,spaceId,title,version" ||
      !uuid(value.commandId) || (value.spaceId !== null && !uuid(value.spaceId)) ||
      typeof value.version !== "string" || !/^[1-9][0-9]{0,18}$/.test(value.version) ||
      BigInt(value.version) >= 9223372036854775807n ||
      typeof value.title !== "string" || !value.title.trim() || Array.from(value.title.trim()).length > 200 ||
      (value.description !== null && typeof value.description !== "string"))
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.update_media_metadata($1,$2,$3,$4,$5,$6,$7) AS id",
      [hash, value.commandId, mediaId, value.spaceId, value.version, value.title, value.description]);
    return { mediaId: result.rows[0].id };
  }
  async updateMemoryDate(session: string, mediaId: string, input: unknown) {
    const hash = digest(session);
    if (!uuid(mediaId) || !input || typeof input !== "object" || Array.isArray(input))
      throw new AuthProviderError("invalid_input");
    const value = input as Record<string, unknown>;
    if (Object.keys(value).sort().join(",") !== "commandId,memoryDate,spaceId,version" ||
      !uuid(value.commandId) || (value.spaceId !== null && !uuid(value.spaceId)) ||
      typeof value.version !== "string" || !/^[1-9][0-9]{0,18}$/.test(value.version) ||
      BigInt(value.version) >= 9223372036854775807n)
      throw new AuthProviderError("invalid_input");
    if (value.memoryDate !== null) {
      if (typeof value.memoryDate !== "string" || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value.memoryDate))
        throw new AuthProviderError("invalid_input");
      const [year, month, day] = value.memoryDate.split("-").map(Number);
      const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1])
        throw new AuthProviderError("invalid_input");
    }
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.update_media_memory_date($1,$2,$3,$4,$5,$6) AS id",
      [hash, value.commandId, mediaId, value.spaceId, value.version, value.memoryDate]);
    return { mediaId: result.rows[0].id };
  }
  async setFavorite(session: string, mediaId: string, input: unknown) {
    const hash = digest(session);
    if (!uuid(mediaId) || !input || typeof input !== "object" || Array.isArray(input))
      throw new AuthProviderError("invalid_input");
    const value = input as Record<string, unknown>;
    if (Object.keys(value).sort().join(",") !== "commandId,favoriteVersion,favorited" ||
      !uuid(value.commandId) || typeof value.favorited !== "boolean" ||
      typeof value.favoriteVersion !== "string" || !/^(0|[1-9][0-9]{0,18})$/.test(value.favoriteVersion) ||
      BigInt(value.favoriteVersion) >= 9223372036854775807n)
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.set_media_favorite($1,$2,$3,$4,$5) AS id",
      [hash, value.commandId, mediaId, value.favoriteVersion, value.favorited]);
    return { mediaId: result.rows[0].id };
  }
  async updateTags(session: string, mediaId: string, input: unknown) {
    const hash = digest(session);
    if (!uuid(mediaId) || !input || typeof input !== "object" || Array.isArray(input))
      throw new AuthProviderError("invalid_input");
    const value = input as Record<string, unknown>;
    if (Object.keys(value).sort().join(",") !== "commandId,spaceId,tags,version" ||
      !uuid(value.commandId) || (value.spaceId !== null && !uuid(value.spaceId)) ||
      typeof value.version !== "string" || !/^[1-9][0-9]{0,18}$/.test(value.version) ||
      BigInt(value.version) >= 9223372036854775807n ||
      !Array.isArray(value.tags) || value.tags.some(tag => typeof tag !== "string" || !tag.trim() || tag !== tag.trim()) ||
      new Set(value.tags).size !== value.tags.length)
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.update_media_tags($1,$2,$3,$4,$5,$6) AS id",
      [hash, value.commandId, mediaId, value.spaceId, value.version, value.tags]);
    return { mediaId: result.rows[0].id };
  }
  async detail(session: string, mediaId: string) {
    const hash = digest(session);
    if (!uuid(mediaId)) throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{
      id: string; title: string; description: string | null; mime_type: string;
      created_at: Date; updated_at: Date; version: string; byte_size: string;
      edit: { spaceId: string | null } | null; memory_date: string | null;
      favorite: { favorited: boolean; version: string }; tags: { id: string; value: string }[];
    }>("SELECT d.*, (SELECT coalesce(json_agg(t ORDER BY t.value COLLATE \"C\",t.id),'[]'::json) FROM app_internal.read_media_tags($1,$2) t) AS tags, (SELECT json_build_object('favorited',f.favorited,'version',f.version::text) FROM app_internal.read_media_favorite($1,$2) f) AS favorite, (SELECT memory_date FROM app_internal.read_media_memory_date($1,$2)) AS memory_date, (SELECT json_build_object('spaceId',e.space_id) FROM app_internal.media_metadata_edit_context($1,$2) e) AS edit FROM app_internal.read_media_detail($1,$2) d", [hash, mediaId]);
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id, title: row.title, description: row.description, mimeType: row.mime_type,
      createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString(),
      version: row.version, byteSize: Number(row.byte_size), edit: row.edit, memoryDate: row.memory_date, favorite: row.favorite, tags: row.tags,
    };
  }
  async uploaders(session: string, after?: string) {
    const hash = digest(session);
    if (after !== undefined && !uuid(after)) throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{id:string;is_self:boolean;display_name:string|null}>(
      "SELECT * FROM app_internal.list_media_uploaders($1,$2)", [hash, after ?? null]);
    const rows = result.rows.slice(0,50);
    return { uploaders: rows.map(row => ({id:row.id,isSelf:row.is_self,displayName:row.display_name})),
      nextCursor: result.rows.length > 50 ? rows.at(-1)!.id : null };
  }
  async page(session: string, after?: string, favorites = false, query?: string, tag?: string, type?: string, uploader?: string, memoryFrom?: string, memoryTo?: string, uploadedFrom?: string, uploadedTo?: string, timezone?: string) {
    const hash=digest(session);
    const dated = memoryFrom !== undefined || memoryTo !== undefined;
    const uploaded = uploadedFrom !== undefined || uploadedTo !== undefined;
    if (uploaded !== (timezone !== undefined) || (timezone !== undefined && (!timezone.length || timezone.length>100))) throw new AuthProviderError("invalid_input");
    if (uploaded) {
      const zone = await this.db.query<{valid:boolean}>("SELECT EXISTS(SELECT 1 FROM pg_catalog.pg_timezone_names WHERE name=$1) AS valid",[timezone]);
      if (!zone.rows[0]?.valid) throw new AuthProviderError("invalid_input");
    }
    for (const date of [memoryFrom, memoryTo, uploadedFrom, uploadedTo]) {
      if (date === undefined) continue;
      if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) throw new AuthProviderError("invalid_input");
      const [year,month,day] = date.split("-").map(Number);
      const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
      const days = [31,leap?29:28,31,30,31,30,31,31,30,31,30,31];
      if (year<1 || month<1 || month>12 || day<1 || day>days[month-1]) throw new AuthProviderError("invalid_input");
    }
    if (memoryFrom && memoryTo && memoryFrom>memoryTo) throw new AuthProviderError("invalid_input");
    if (uploadedFrom && uploadedTo && uploadedFrom>uploadedTo) throw new AuthProviderError("invalid_input");
    const searching = uploaded || query !== undefined || tag !== undefined || type !== undefined || uploader !== undefined || dated;
    if (uploader !== undefined && !uuid(uploader)) throw new AuthProviderError("invalid_input");
    if (type !== undefined && type !== "photo" && type !== "video") throw new AuthProviderError("invalid_input");
    if ([query, tag].some(value => value !== undefined && (!value.trim() || value.includes(String.fromCharCode(0)))) || Buffer.byteLength(JSON.stringify([query, tag]), "utf8") > 16384)
      throw new AuthProviderError("invalid_input");
    const scope = searching ? createHash("sha256").update(JSON.stringify(uploaded ? [query ?? null, tag ?? null, favorites, type ?? null, uploader ?? null, memoryFrom ?? null, memoryTo ?? null, uploadedFrom ?? null, uploadedTo ?? null, timezone] : dated ? [query ?? null, tag ?? null, favorites, type ?? null, uploader ?? null, memoryFrom ?? null, memoryTo ?? null] : uploader ? [query ?? null, tag ?? null, favorites, type ?? null, uploader] : type ? [query ?? null, tag ?? null, favorites, type] : [query ?? null, tag ?? null, favorites])).digest("hex") : favorites ? "favorites" : null;
    let beforeTime:string|null=null,beforeId:string|null=null;
    if(after!==undefined){
      try{
        if(after.length>300||!after.length||!/^[A-Za-z0-9_-]+$/.test(after))throw new Error();
        const raw=Buffer.from(after,"base64url");if(raw.toString("base64url")!==after)throw new Error();
        const cursor=JSON.parse(raw.toString("utf8"));
        if(!Array.isArray(cursor)||cursor.length!==(scope?3:2)||(scope&&cursor[2]!==scope)||typeof cursor[0]!=="string"||!uuid(cursor[1])||
          !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{1,6})?[+-]\d{2}(?::\d{2})?$/.test(cursor[0])||!Number.isFinite(Date.parse(cursor[0])))throw new Error();
        [beforeTime,beforeId]=cursor;
      }catch{throw new AuthProviderError("invalid_input");}
    }
    const result=await this.db.query<{id:string;title:string;mime_type:string;created_at:string;byte_size:string}>(
      uploaded ? "SELECT * FROM app_internal.search_media_uploaded_page($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)" : dated ? "SELECT * FROM app_internal.search_media_memory_page($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)" : uploader ? "SELECT * FROM app_internal.search_media_uploader_page($1,$2,$3,$4,$5,$6,$7,$8)" : type ? "SELECT * FROM app_internal.search_media_type_page($1,$2,$3,$4,$5,$6,$7)" : searching ? "SELECT * FROM app_internal.search_media_page($1,$2,$3,$4,$5,$6)" : favorites ? "SELECT * FROM app_internal.list_favorite_media_page($1,$2,$3)" : "SELECT * FROM app_internal.list_media_page($1,$2,$3)",
      uploaded ? [hash,query ?? null,tag ?? null,favorites,type ?? null,uploader ?? null,memoryFrom ?? null,memoryTo ?? null,uploadedFrom ?? null,uploadedTo ?? null,timezone,beforeTime,beforeId] : dated ? [hash,query ?? null,tag ?? null,favorites,type ?? null,uploader ?? null,memoryFrom ?? null,memoryTo ?? null,beforeTime,beforeId] : uploader ? [hash,query ?? null,tag ?? null,favorites,type ?? null,uploader,beforeTime,beforeId] : type ? [hash,query ?? null,tag ?? null,favorites,type,beforeTime,beforeId] : searching ? [hash,query ?? null,tag ?? null,favorites,beforeTime,beforeId] : [hash,beforeTime,beforeId]);
    const rows=result.rows.slice(0,50),last=rows.at(-1);
    return {media:rows.map(row=>({id:row.id,title:row.title,mimeType:row.mime_type,createdAt:row.created_at,byteSize:Number(row.byte_size)})),
      nextCursor:result.rows.length>50&&last?Buffer.from(JSON.stringify(scope?[last.created_at,last.id,scope]:[last.created_at,last.id])).toString("base64url"):null};
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
