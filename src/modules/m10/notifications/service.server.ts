import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProviderError } from "../auth/provider.server";

export type Notification = {
  id: string;
  notification_type: string;
  space_id: string | null;
  source_module: string | null;
  source_id: string | null;
  title_key: string | null;
  body_key: string | null;
  link_href: string | null;
  priority: string;
  is_essential: boolean;
  read_at: string | null;
  created_at: string;
};

export type NotificationPreferences = {
  version: string;
  enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_start_minutes: number;
  quiet_end_minutes: number;
  type_preferences: Record<string, boolean>;
};

export type NotificationPreferencesUpdate = {
  commandId: string;
  version: number;
  enabled: boolean;
  quietHoursEnabled: boolean;
  quietStartMinutes: number;
  quietEndMinutes: number;
  typePreferences: Record<string, boolean>;
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

export class NotificationService {
  constructor(private readonly db: ReturnType<typeof createDatabase>) {}

  async list(
    session: string,
    limit = 50,
    includeRead = true,
  ): Promise<Notification[]> {
    const hash = digest(session);
    const result = await this.db.query<Notification>(
      "SELECT id,notification_type,space_id,source_module,source_id,title_key,body_key,link_href,priority,is_essential,read_at,created_at FROM app_internal.read_notifications($1,$2,$3)",
      [hash, Math.max(1, Math.min(limit, 100)), includeRead],
    );
    return result.rows;
  }

  async count(session: string): Promise<number> {
    const hash = digest(session);
    const result = await this.db.query<{ unread_notification_count: string }>(
      "SELECT app_internal.unread_notification_count($1) AS unread_notification_count",
      [hash],
    );
    return Number(result.rows[0]?.unread_notification_count ?? "0");
  }

  async markRead(session: string, notificationId: string): Promise<boolean> {
    const hash = digest(session);
    if (!uuid(notificationId)) throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ mark_notification_read: boolean }>(
      "SELECT app_internal.mark_notification_read($1,$2) AS mark_notification_read",
      [hash, notificationId],
    );
    return result.rows[0]?.mark_notification_read ?? false;
  }

  async markAllRead(session: string): Promise<number> {
    const hash = digest(session);
    const result = await this.db.query<{ mark_all_notifications_read: string }>(
      "SELECT app_internal.mark_all_notifications_read($1) AS mark_all_notifications_read",
      [hash],
    );
    return Number(result.rows[0]?.mark_all_notifications_read ?? "0");
  }

  async hide(session: string, notificationId: string): Promise<boolean> {
    const hash = digest(session);
    if (!uuid(notificationId)) throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ hide_notification: boolean }>(
      "SELECT app_internal.hide_notification($1,$2) AS hide_notification",
      [hash, notificationId],
    );
    return result.rows[0]?.hide_notification ?? false;
  }

  async preferences(session: string): Promise<NotificationPreferences> {
    const hash = digest(session);
    const result = await this.db.query<NotificationPreferences>(
      "SELECT version,enabled,quiet_hours_enabled,quiet_start_minutes,quiet_end_minutes,type_preferences FROM app_internal.read_notification_preferences($1)",
      [hash],
    );
    return result.rows[0];
  }

  async updatePreferences(
    session: string,
    input: NotificationPreferencesUpdate,
  ) {
    const hash = digest(session);
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      Object.keys(input).some(
        (key) =>
          ![
            "commandId",
            "version",
            "enabled",
            "quietHoursEnabled",
            "quietStartMinutes",
            "quietEndMinutes",
            "typePreferences",
          ].includes(key),
      ) ||
      !uuid(input.commandId) ||
      !Number.isSafeInteger(input.version) ||
      input.version < 0 ||
      typeof input.enabled !== "boolean" ||
      typeof input.quietHoursEnabled !== "boolean" ||
      !Number.isSafeInteger(input.quietStartMinutes) ||
      input.quietStartMinutes < 0 ||
      input.quietStartMinutes > 1439 ||
      !Number.isSafeInteger(input.quietEndMinutes) ||
      input.quietEndMinutes < 0 ||
      input.quietEndMinutes > 1439 ||
      !input.typePreferences ||
      typeof input.typePreferences !== "object" ||
      Array.isArray(input.typePreferences)
    )
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{
      update_notification_preferences: string;
    }>(
      "SELECT app_internal.update_notification_preferences($1,$2,$3,$4,$5,$6,$7,$8) AS update_notification_preferences",
      [
        hash,
        input.commandId,
        input.version,
        input.enabled,
        input.quietHoursEnabled,
        input.quietStartMinutes,
        input.quietEndMinutes,
        JSON.stringify(input.typePreferences),
      ],
    );
    return { accountId: result.rows[0]?.update_notification_preferences };
  }
}
