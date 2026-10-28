import { test, expect } from "@playwright/test";
import { randomUUID, randomBytes, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";

test("profile UI saves private fields and refreshes conflicting edits", async ({ page, context }) => {
  const owner = new Pool({ host: "127.0.0.1", port: 55432, database: "ourspace", user: "ourspace_owner",
    password: readFileSync(".local/db-password", "utf8").trim(), max: 1 });
  const actor = randomUUID(), session = randomUUID(), token = randomBytes(32).toString("base64url");
  try {
    await owner.query("INSERT INTO m10.accounts(id,state) VALUES ($1,'active')", [actor]);
    await owner.query("INSERT INTO m10.profiles(user_id,display_name) VALUES ($1,'Synthetic profile')", [actor]);
    await owner.query("INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",
      [session, actor, createHash("sha256").update(token).digest("hex")]);
    await context.addCookies([{ name: "ourspace_session", value: `${session}:${token}`, url: "http://127.0.0.1:3102", httpOnly: true, sameSite: "Strict" }]);
    await page.goto("/account");
    const name = page.locator('input[name="displayName"]');
    await expect(name).toHaveValue("Synthetic profile");
    await name.fill("Synthetic saved");
    await page.locator('input[name="nickname"]').fill("Synthetic nickname");
    await page.locator('input[name="birthday"]').fill("2000-02-29");
    await page.locator('textarea[name="bio"]').fill("Synthetic private bio");
    const save = page.getByRole("button", { name: "Lưu hồ sơ", exact: true });
    await save.click();
    await expect(page.getByText("Đã lưu hồ sơ.", { exact: true })).toBeVisible();
    await page.reload();
    await expect(name).toHaveValue("Synthetic saved");
    await expect(page.locator('input[name="birthday"]')).toHaveValue("2000-02-29");
    await expect(page.locator('textarea[name="bio"]')).toHaveValue("Synthetic private bio");
    await name.fill("Stale draft");
    await owner.query("UPDATE m10.profiles SET display_name='Concurrent saved' WHERE user_id=$1", [actor]);
    await save.click();
    await expect(page.locator(".account-card p[role=alert]")).toContainText("Hồ sơ đã thay đổi");
    await expect(name).toHaveValue("Concurrent saved");
    await name.fill("Reviewed new name");
    await save.click();
    await expect(page.getByText("Đã lưu hồ sơ.", { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1", [session]);
    await save.click();
    await expect(name).toHaveCount(0);
    await expect(page.getByText("Phiên đã kết thúc. Vui lòng đăng nhập lại.", { exact: true })).toBeVisible();
  } finally {
    await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1 AND revoked_at IS NULL", [session]);
    await owner.end();
  }
});
