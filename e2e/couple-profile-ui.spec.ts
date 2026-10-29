import { test, expect } from "@playwright/test";
import { randomUUID, randomBytes, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";
test("Couple Profile UI saves history and reviews conflicts", async ({ page, context }) => {
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
    await page.goto("/account/couple");
    const field = page.getByRole("textbox", { name: "Tên không gian chung" });
    await field.fill("Synthetic shared title");
    await page.getByRole("button", { name: "Lưu tên chung" }).click();
    await expect(page.getByText("Đã lưu hồ sơ chung.")).toBeVisible();
    await expect(page.locator("li strong")).toHaveText(["Synthetic shared title"]);
    await owner.query("UPDATE m10.couple_profiles SET title='Synthetic Partner edit',updated_by=$2 WHERE space_id=$1", [space, users[1]]);
    await field.fill("Stale edit");
    await page.getByRole("button", { name: "Lưu tên chung" }).click();
    await expect(page.getByText("Hồ sơ đã thay đổi. Tải lại và xem xét tên mới trước khi lưu.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Lưu tên chung" })).toBeDisabled();
    expect((await owner.query("SELECT title FROM m10.couple_profiles WHERE space_id=$1", [space])).rows[0].title).toBe("Synthetic Partner edit");
    await page.getByRole("button", { name: "Tải lại hồ sơ chung" }).click();
    await expect(field).toHaveValue("Synthetic Partner edit");
    await field.fill("Reviewed title");
    await page.getByRole("button", { name: "Lưu tên chung" }).click();
    await expect(page.locator("li strong")).toHaveText(["Reviewed title", "Synthetic Partner edit", "Synthetic shared title"]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await owner.query("UPDATE m10.couple_spaces SET state='disconnecting' WHERE id=$1", [space]);
    await owner.query("UPDATE m10.couple_spaces SET state='frozen' WHERE id=$1", [space]);
    await owner.query("INSERT INTO m10.space_disconnects(space_id,initiated_by) VALUES ($1,$2)", [space, users[1]]);
    await page.getByRole("button", { name: "Tải lại hồ sơ chung" }).click();
    await expect(page.getByText("Liên kết đã đóng băng. Tên chung: Reviewed title")).toBeVisible();
    await expect(field).toHaveCount(0);
    await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1", [sessions[0]]);
    await page.getByRole("button", { name: "Tải lại hồ sơ chung" }).click();
    await expect(page.getByRole("link", { name: "Đăng nhập lại" })).toBeVisible();
  } finally {
    await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=ANY($1::uuid[]) AND revoked_at IS NULL", [users]);
    await owner.end();
  }
});
