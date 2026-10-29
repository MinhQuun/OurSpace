import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProviderError } from "../auth/provider.server";

export type TrashedItem = {
  id: string;
  source_module: string;
  source_type: string;
  source_id: string;
  title_key: string;
  trashed_at: string;
  expires_at: string;
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

export class TrashService {
  constructor(private readonly db: ReturnType<typeof createDatabase>) {}

  async list(session: string): Promise<TrashedItem[]> {
    const hash = digest(session);
    const result = await this.db.query<TrashedItem>(
      "SELECT id,source_module,source_type,source_id,title_key,trashed_at,expires_at FROM app_internal.list_trashed_items($1)",
      [hash],
    );
    return result.rows;
  }

  async restore(
    session: string,
    commandId: string,
    itemId: string,
  ): Promise<string> {
    const hash = digest(session);
    if (!uuid(commandId) || !uuid(itemId))
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ restore_trashed_item: string }>(
      "SELECT app_internal.restore_trashed_item($1,$2,$3) AS restore_trashed_item",
      [hash, commandId, itemId],
    );
    return result.rows[0]?.restore_trashed_item;
  }

  async purge(
    session: string,
    commandId: string,
    itemId: string,
  ): Promise<string> {
    const hash = digest(session);
    if (!uuid(commandId) || !uuid(itemId))
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ purge_trashed_item: string }>(
      "SELECT app_internal.purge_trashed_item($1,$2,$3) AS purge_trashed_item",
      [hash, commandId, itemId],
    );
    return result.rows[0]?.purge_trashed_item;
  }

  async purgeExpired(session: string): Promise<number> {
    const hash = digest(session);
    const result = await this.db.query<{ purge_expired_trashed_items: string }>(
      "SELECT app_internal.purge_expired_trashed_items($1) AS purge_expired_trashed_items",
      [hash],
    );
    return Number(result.rows[0]?.purge_expired_trashed_items ?? "0");
  }
}
