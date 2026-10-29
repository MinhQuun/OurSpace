import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProviderError } from "../../m10/auth/provider.server";

export type AlbumItem = {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  created_at: Date;
  version: number;
};
export type AlbumCreateInput = {
  commandId: string;
  title: string;
  description?: string | null;
};
export type AlbumMediaInput = {
  commandId: string;
  albumId: string;
  mediaId: string;
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
export class AlbumService {
  constructor(private readonly db: ReturnType<typeof createDatabase>) {}
  async create(session: string, input: AlbumCreateInput): Promise<{ id: string }> {
    const hash = digest(session);
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      Object.keys(input).some(
        (key) => !["commandId", "title", "description"].includes(key),
      ) ||
      !uuid(input.commandId) ||
      typeof input.title !== "string" ||
      !input.title.trim() ||
      input.title.trim().length > 200 ||
      (input.description !== undefined &&
        input.description !== null &&
        typeof input.description !== "string")
    )
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.register_album($1,$2,$3,$4,$5) AS id",
      [hash, input.commandId, input.title.trim(), input.description ?? null],
    );
    if (!result.rows[0]?.id) throw new AuthProviderError("denied");
    return { id: result.rows[0].id };
  }
  async list(session: string): Promise<AlbumItem[]> {
    const hash = digest(session);
    const result = await this.db.query<AlbumItem>(
      "SELECT id,title,description,created_by,created_at,version FROM app_internal.list_albums($1)",
      [hash],
    );
    return result.rows;
  }
  async addMedia(session: string, input: AlbumMediaInput): Promise<void> {
    const hash = digest(session);
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      Object.keys(input).some(
        (key) => !["commandId", "albumId", "mediaId"].includes(key),
      ) ||
      !uuid(input.commandId) ||
      !uuid(input.albumId) ||
      !uuid(input.mediaId)
    )
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ ok: boolean }>(
      "SELECT app_internal.add_media_to_album($1,$2,$3,$4) AS ok",
      [hash, input.commandId, input.albumId, input.mediaId],
    );
    if (!result.rows[0]?.ok) throw new AuthProviderError("denied");
  }
  async removeMedia(session: string, input: AlbumMediaInput): Promise<void> {
    const hash = digest(session);
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      Object.keys(input).some(
        (key) => !["commandId", "albumId", "mediaId"].includes(key),
      ) ||
      !uuid(input.commandId) ||
      !uuid(input.albumId) ||
      !uuid(input.mediaId)
    )
      throw new AuthProviderError("invalid_input");
    await this.db.query(
      "SELECT app_internal.remove_media_from_album($1,$2,$3,$4)",
      [hash, input.commandId, input.albumId, input.mediaId],
    );
  }
}
