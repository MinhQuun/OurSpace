import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProviderError } from "../auth/provider.server";

export type PersonalPreferences = {
  theme: "light" | "dark" | "system"; language: "vi-VN"; timezone: string;
  date_format: "dd/MM/yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd"; hour_cycle: "h12" | "h23";
  reduced_motion: "system" | "reduce"; font_scale: string; version: string;
};
export type PreferenceUpdate = {
  commandId: string; version: number; theme: PersonalPreferences["theme"];
  language: "vi-VN"; timezone: string; dateFormat: PersonalPreferences["date_format"];
  hourCycle: PersonalPreferences["hour_cycle"]; reducedMotion: PersonalPreferences["reduced_motion"]; fontScale: number;
};
export type OwnProfile = {
  user_id: string;
  display_name: string;
  nickname: string | null;
  birthday: string | null;
  bio: string | null;
  avatar_ref: string | null;
  version: string;
};
export type CoupleProfile = {
  space_id: string; title: string | null; version: string;
  updated_by: string | null; updated_at: Date | null;
};
export type CoupleProfileRevision = {
  version: string; title: string | null; actor_id: string; recorded_at: Date;
};
export type CoupleProfileUpdate = {
  commandId: string; spaceId: string; version: number; title: string | null;
};
export type ProfileUpdate = {
  commandId: string;
  version: number;
  displayName: string;
  nickname: string | null;
  birthday: string | null;
  bio: string | null;
  avatarRef?: string | null;
};
export const profileFields = ["display_name", "avatar_ref", "nickname", "birthday", "bio"] as const;
export type ProfileField = (typeof profileFields)[number];
export type PartnerProfile = Partial<Record<ProfileField, string | null>>;
export type ProfileFieldGrant = {
  id: string; field: ProfileField; grantee_id: string; space_id: string;
  granted_at: Date; revoked_at: Date | null;
};
export type ShareProfileField = { commandId: string; spaceId: string; recipientId: string;
  field: ProfileField; version: number; confirmed: boolean };
export type RevokeProfileField = { commandId: string; grantId: string; version: number; confirmed: boolean };
const uuid = (value: unknown): value is string => typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
function command(input: unknown, keys: string[]): asserts input is Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input) ||
    Object.keys(input).some(key => !keys.includes(key))) throw new AuthProviderError("invalid_input");
  const value = input as Record<string, unknown>;
  if (!uuid(value.commandId) || !Number.isSafeInteger(value.version) ||
    (value.version as number) < 1 || value.confirmed !== true) throw new AuthProviderError("invalid_input");
}
function digest(session: string) {
  if (
    !/^[A-Za-z0-9_-]{43}$/.test(session) ||
    Buffer.from(session, "base64url").toString("base64url") !== session
  )
    throw new AuthProviderError("denied");
  return createHash("sha256").update(session).digest("hex");
}
function validBirthday(value: string | null) {
  if (value === null) return true;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const [year, month, day] = value.split("-").map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return (
    year >= 1 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <=
      [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]
  );
}
const length = (text: string) => Array.from(text).length;

export class ProfileService {
  constructor(private readonly db: ReturnType<typeof createDatabase>) {}
  async preferences(session: string): Promise<PersonalPreferences | null> {
    const result = await this.db.query<PersonalPreferences>(
      "SELECT theme,language,timezone,date_format,hour_cycle,reduced_motion,font_scale,version FROM app_internal.read_personal_preferences($1)", [digest(session)]);
    return result.rows[0] ?? null;
  }
  async updatePreferences(session: string, input: PreferenceUpdate) {
    const hash = digest(session);
    if (!input || typeof input !== "object" || Array.isArray(input) ||
      Object.keys(input).some(key => !["commandId","version","theme","language","timezone","dateFormat","hourCycle","reducedMotion","fontScale"].includes(key)) ||
      !uuid(input.commandId) || !Number.isSafeInteger(input.version) || input.version < 0 ||
      !["light","dark","system"].includes(input.theme) || input.language !== "vi-VN" ||
      typeof input.timezone !== "string" || input.timezone.length > 100 ||
      !(input.timezone === "UTC" || /^[A-Za-z_+-]+(?:\/[A-Za-z0-9_+-]+)+$/.test(input.timezone)) ||
      !["dd/MM/yyyy","MM/dd/yyyy","yyyy-MM-dd"].includes(input.dateFormat) ||
      !["h12","h23"].includes(input.hourCycle) || !["system","reduce"].includes(input.reducedMotion) ||
      typeof input.fontScale !== "number" || !Number.isFinite(input.fontScale) || input.fontScale < 1 || input.fontScale > 2 ||
      Number(input.fontScale.toFixed(2)) !== input.fontScale) throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.update_personal_preferences($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) AS id",
      [hash,input.commandId,input.version,input.theme,input.language,input.timezone,input.dateFormat,input.hourCycle,input.reducedMotion,input.fontScale]);
    return { userId: result.rows[0].id };
  }
  async couple(session: string, spaceId: string): Promise<CoupleProfile | null> {
    const hash = digest(session);
    if (!uuid(spaceId)) throw new AuthProviderError("invalid_input");
    const result = await this.db.query<CoupleProfile>(
      "SELECT space_id,title,version,updated_by,updated_at FROM app_internal.read_couple_profile($1,$2)",
      [hash, spaceId]);
    return result.rows[0] ?? null;
  }
  async coupleHistory(session: string, spaceId: string, before: number | null = null): Promise<CoupleProfileRevision[]> {
    const hash = digest(session);
    if (!uuid(spaceId) || (before !== null && (!Number.isSafeInteger(before) || before < 1)))
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<CoupleProfileRevision>(
      "SELECT version,title,actor_id,recorded_at FROM app_internal.read_couple_profile_history($1,$2,$3)",
      [hash, spaceId, before]);
    return result.rows;
  }
  async updateCouple(session: string, input: CoupleProfileUpdate) {
    const hash = digest(session);
    if (!input || typeof input !== "object" || Array.isArray(input) ||
      Object.keys(input).some(key => !["commandId", "spaceId", "version", "title"].includes(key)) ||
      !uuid(input.commandId) || !uuid(input.spaceId) || !Number.isSafeInteger(input.version) || input.version < 0 ||
      (input.title !== null && (typeof input.title !== "string" || !input.title.trim() || length(input.title.trim()) > 120)))
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.update_couple_profile($1,$2,$3,$4,$5) AS id",
      [hash, input.commandId, input.spaceId, input.version, input.title?.trim() ?? null]);
    if (!result.rows[0]?.id) throw new AuthProviderError("denied");
    return { spaceId: result.rows[0].id };
  }
  async read(session: string): Promise<OwnProfile | null> {
    const result = await this.db.query<OwnProfile>(
      "SELECT user_id,display_name,nickname,to_char(birthday,'YYYY-MM-DD') AS birthday,bio,avatar_ref,version FROM app_internal.read_my_profile($1)",
      [digest(session)],
    );
    return result.rows[0] ?? null;
  }
  async partner(session: string, spaceId: string): Promise<PartnerProfile> {
    const hash = digest(session);
    if (!uuid(spaceId)) throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ profile: PartnerProfile }>(
      "SELECT app_internal.read_partner_profile($1,$2) AS profile", [hash, spaceId]);
    return result.rows[0].profile;
  }
  async grants(session: string): Promise<ProfileFieldGrant[]> {
    const result = await this.db.query<ProfileFieldGrant>(
      "SELECT id,field,grantee_id,space_id,granted_at,revoked_at FROM app_internal.list_my_profile_field_grants($1)", [digest(session)]);
    return result.rows;
  }
  async shareField(session: string, input: ShareProfileField) {
    const hash = digest(session);
    command(input, ["commandId", "spaceId", "recipientId", "field", "version", "confirmed"]);
    if (!uuid(input.spaceId) || !uuid(input.recipientId) || !profileFields.includes(input.field))
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.issue_profile_field_grant($1,$2,app_internal.session_actor($1),$3,$4,$5,$6,$7) AS id",
      [hash, input.commandId, input.spaceId, input.recipientId, input.field, input.version, input.confirmed]);
    return { grantId: result.rows[0].id };
  }
  async revokeField(session: string, input: RevokeProfileField) {
    const hash = digest(session);
    command(input, ["commandId", "grantId", "version", "confirmed"]);
    if (!uuid(input.grantId)) throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.revoke_profile_field_grant($1,$2,app_internal.session_actor($1),$3,$4,$5) AS id",
      [hash, input.commandId, input.grantId, input.version, input.confirmed]);
    return { grantId: result.rows[0].id };
  }
  async update(session: string, input: ProfileUpdate) {
    const hash = digest(session);
    if (
      !input ||
      typeof input !== "object" ||
      Object.keys(input).some(
        (key) =>
          ![
            "commandId",
            "version",
            "displayName",
            "nickname",
            "birthday",
            "bio",
            "avatarRef",
          ].includes(key),
      ) ||
      typeof input.commandId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        input.commandId,
      ) ||
      !Number.isSafeInteger(input.version) ||
      input.version < 1 ||
      typeof input.displayName !== "string" ||
      !input.displayName.trim() ||
      length(input.displayName.trim()) > 120 ||
      (input.nickname !== null &&
        (typeof input.nickname !== "string" ||
          length(input.nickname.trim()) > 120)) ||
      (input.bio !== null &&
        (typeof input.bio !== "string" || length(input.bio) > 4000)) ||
      !validBirthday(input.birthday) ||
      (input.avatarRef !== undefined &&
        input.avatarRef !== null &&
        (typeof input.avatarRef !== "string" ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            input.avatarRef,
          )))
    )
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      input.avatarRef === undefined
        ? "SELECT app_internal.update_my_profile($1,$2,$3,$4,$5,$6::date,$7) AS id"
        : "SELECT app_internal.update_my_profile($1,$2,$3,$4,$5,$6::date,$7,$8::uuid) AS id",
      [
        hash,
        input.commandId,
        input.version,
        input.displayName.trim(),
        input.nickname?.trim() || null,
        input.birthday,
        input.bio || null,
        ...(input.avatarRef === undefined ? [] : [input.avatarRef]),
      ],
    );
    if (!result.rows[0]?.id) throw new AuthProviderError("denied");
    return { userId: result.rows[0].id };
  }
}
