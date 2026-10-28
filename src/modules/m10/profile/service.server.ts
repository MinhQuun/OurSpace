import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProviderError } from "../auth/provider.server";

export type OwnProfile = {
  user_id: string;
  display_name: string;
  nickname: string | null;
  birthday: string | null;
  bio: string | null;
  version: string;
};
export type ProfileUpdate = {
  commandId: string;
  version: number;
  displayName: string;
  nickname: string | null;
  birthday: string | null;
  bio: string | null;
};
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
  async read(session: string): Promise<OwnProfile | null> {
    const result = await this.db.query<OwnProfile>(
      "SELECT user_id,display_name,nickname,to_char(birthday,'YYYY-MM-DD') AS birthday,bio,version FROM app_internal.read_my_profile($1)",
      [digest(session)],
    );
    return result.rows[0] ?? null;
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
      !validBirthday(input.birthday)
    )
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.update_my_profile($1,$2,$3,$4,$5,$6::date,$7) AS id",
      [
        hash,
        input.commandId,
        input.version,
        input.displayName.trim(),
        input.nickname?.trim() || null,
        input.birthday,
        input.bio || null,
      ],
    );
    if (!result.rows[0]?.id) throw new AuthProviderError("denied");
    // The receipt identifies the committed actor; callers fetch current profile separately.
    return { userId: result.rows[0].id };
  }
}
