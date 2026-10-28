import { test, expect } from "@playwright/test";
import { randomUUID, randomBytes, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";
test("profile sharing UI confirms and revokes a single field", async ({ page, context }) => {
  const owner = new Pool({
    host: "127.0.0.1",
    port: 55432,
    database: "ourspace",
    user: "ourspace_owner",
    password: readFileSync(".local/db-password", "utf8").trim(),
    max: 1,
  });
  const users = [randomUUID(), randomUUID()],
    sessions = [randomUUID(), randomUUID()],
    tokens = [
      randomBytes(32).toString("base64url"),
      randomBytes(32).toString("base64url"),
    ];
  try {

    for (let i = 0; i < 2; i++) {
      await owner.query(
        "INSERT INTO m10.accounts(id,state) VALUES ($1,'active')",
        [users[i]],
      );
      await owner.query(
        "INSERT INTO m10.profiles(user_id,display_name) VALUES ($1,'Synthetic initial profile')",
        [users[i]],
      );
      await owner.query(
        "INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",
        [
          sessions[i],
          users[i],
          createHash("sha256").update(tokens[i]).digest("hex"),
        ],
      );
    }
    const invitation = randomUUID(), space = randomUUID();
    await owner.query("BEGIN");
    try {
      await owner.query("INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ($1,$2,$3)", [invitation, users[0], createHash("sha256").update(randomUUID()).digest("hex")]);
      await owner.query("UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by=$2,accepted_at=clock_timestamp() WHERE id=$1", [invitation, users[1]]);
      await owner.query("UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id=$1", [invitation]);
      await owner.query("INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ($1,$2)", [space, invitation]);
      await owner.query("INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ($1,$2,1),($1,$3,2)", [space, users[0], users[1]]);
      await owner.query("COMMIT");
    } catch (error) { await owner.query("ROLLBACK"); throw error; }
    await context.addCookies([{ name: "ourspace_session", value: `${sessions[0]}:${tokens[0]}`, url: "http://127.0.0.1:3102", httpOnly: true, sameSite: "Strict" }]);
    await page.goto("/account/profile-sharing");
    await expect(page.getByText("Chưa chia sẻ trường nào.")).toBeVisible();
    await page.getByRole("combobox", { name: "Trường hồ sơ", exact: true }).selectOption("birthday");
    await page.getByRole("button", { name: "Chia sẻ trường", exact: true }).click();
    expect((await owner.query("SELECT count(*)::int AS count FROM m10.profile_field_grants WHERE profile_id=$1", [users[0]])).rows[0].count).toBe(0);
    await page.getByLabel("Tôi xác nhận chia sẻ trường đã chọn với Partner này.").check();
    await page.getByRole("button", { name: "Chia sẻ trường", exact: true }).click();
    await expect(page.getByText("Đã chia sẻ trường hồ sơ đã chọn.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Thu hồi Ngày sinh", exact: true })).toBeVisible();
    expect((await owner.query("SELECT field FROM m10.profile_field_grants WHERE profile_id=$1 AND revoked_at IS NULL", [users[0]])).rows).toEqual([{ field: "birthday" }]);
    await page.getByLabel("Xác nhận thu hồi Ngày sinh").check();
    await page.getByRole("button", { name: "Thu hồi Ngày sinh", exact: true }).click();
    await expect(page.getByText("Đã thu hồi quyền xem trường hồ sơ.")).toBeVisible();
    await expect(page.getByText("Chưa chia sẻ trường nào.")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1", [sessions[0]]);
    await page.getByRole("button", { name: "Làm mới quyền hồ sơ" }).click();
    await expect(page.getByRole("link", { name: "Đăng nhập lại" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Trường hồ sơ", exact: true })).toHaveCount(0);
  } finally {
    await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=ANY($1::uuid[]) AND revoked_at IS NULL", [users]);
    await owner.end();
  }
});
