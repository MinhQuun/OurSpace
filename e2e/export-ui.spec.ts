import { test, expect } from "@playwright/test";
import { randomUUID, randomBytes, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";

test("Account export downloads own JSON and rejects revoked session", async ({ page, context }) => {
  const owner = new Pool({ host: "127.0.0.1", port: 55432, database: "ourspace", user: "ourspace_owner",
    password: readFileSync(".local/db-password", "utf8").trim(), max: 1 });
  const users = [randomUUID(), randomUUID()], sessions = [randomUUID(), randomUUID()];
  const tokens = users.map(() => randomBytes(32).toString("base64url"));
  const cookie = (i: number) => ({ name: "ourspace_session", value: `${sessions[i]}:${tokens[i]}`,
    url: "http://127.0.0.1:3102", httpOnly: true, sameSite: "Strict" as const });
  try {
    for (let i = 0; i < 2; i++) {
      await owner.query("INSERT INTO m10.accounts(id,state) VALUES ($1,'active')", [users[i]]);
      await owner.query("INSERT INTO m10.profiles(user_id,display_name,birthday,bio) VALUES ($1,$2,'2000-02-29',$3)", [users[i], "Synthetic " + i, "Private " + i]);
      await owner.query("INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')", [sessions[i],users[i],createHash("sha256").update(tokens[i]).digest("hex")]);
    }
    for (let i = 0; i < 2; i++) {
      await context.addCookies([cookie(i)]);
      await page.goto("/account/export");
      await expect(page.getByText("Xuất toàn bộ dữ liệu cá nhân và dữ liệu chia sẻ chưa khả dụng.")).toBeVisible();
      const pending = page.waitForEvent("download");
      await page.getByRole("button", { name: "Tải hồ sơ và thiết lập" }).click();
      const download = await pending;
      expect(download.suggestedFilename()).toBe("ourspace-profile-preferences.json");
      const path = await download.path();
      expect(path).not.toBeNull();
      const content = JSON.parse(readFileSync(path!, "utf8"));
      expect(content).toMatchObject({ account_id: users[i], section: "m10.account_profile_preferences",
        profile: { display_name: "Synthetic " + i, birthday: "2000-02-29", bio: "Private " + i } });
      expect(JSON.stringify(content)).not.toContain("Private " + (1-i));
      await expect(page.getByRole("status")).toHaveText("Đã chuyển tệp hồ sơ và thiết lập cho trình duyệt tải xuống.");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
    await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1", [sessions[1]]);
    await page.getByRole("button", { name: "Tải hồ sơ và thiết lập" }).click();
    await expect(page.getByRole("link", { name: "Đăng nhập lại" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tải hồ sơ và thiết lập" })).toHaveCount(0);
    expect((await owner.query("SELECT count(*)::int AS count FROM m10.account_export_artifacts WHERE account_id=ANY($1::uuid[])", [users])).rows[0].count).toBe(2);
  } finally {
    await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=ANY($1::uuid[]) AND revoked_at IS NULL", [users]);
    await owner.end();
  }
});
