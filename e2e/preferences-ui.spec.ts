import { test, expect } from "@playwright/test";
import { randomUUID, randomBytes, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";

test("Preference settings render per account and survive conflicts", async ({
  page,
  context,
}) => {
  const owner = new Pool({
    host: "127.0.0.1",
    port: 55432,
    database: "ourspace",
    user: "ourspace_owner",
    password: readFileSync(".local/db-password", "utf8").trim(),
    max: 1,
  });
  const users = [randomUUID(), randomUUID()];
  const sessions = [randomUUID(), randomUUID(), randomUUID()];
  const tokens = [
    randomBytes(32).toString("base64url"),
    randomBytes(32).toString("base64url"),
    randomBytes(32).toString("base64url"),
  ];
  const sessionOwners = [users[0], users[0], users[1]];
  const cookie = (index: number) => ({
    name: "ourspace_session",
    value: `${sessions[index]}:${tokens[index]}`,
    url: "http://127.0.0.1:3102",
    httpOnly: true,
    sameSite: "Strict" as const,
  });
  const readPreferences = async (userId: string) =>
    (
      await owner.query(
        "SELECT theme,language,timezone,date_format,hour_cycle,reduced_motion,font_scale::text,version::text FROM m10.personal_preferences WHERE user_id=$1",
        [userId],
      )
    ).rows[0];
  try {
    for (const userId of users) {
      await owner.query(
        "INSERT INTO m10.accounts(id,state) VALUES ($1,'active')",
        [userId],
      );
    }
    for (let index = 0; index < sessions.length; index++) {
      await owner.query(
        "INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",
        [
          sessions[index],
          sessionOwners[index],
          createHash("sha256").update(tokens[index]).digest("hex"),
        ],
      );
    }
    await context.addCookies([cookie(0)]);
    await page.goto("/account/settings");

    const theme = page.getByRole("combobox", { name: /^Giao diện/ });
    const timezone = page.getByRole("combobox", { name: "Múi giờ" });
    const dateFormat = page.getByRole("combobox", { name: /^Định dạng ngày/ });
    const hourCycle = page.getByRole("combobox", { name: /^Định dạng giờ/ });
    const motion = page.getByRole("combobox", { name: /^Chuyển động/ });
    const fontScale = page.getByRole("slider");

    await expect(theme).toHaveValue("system");
    await expect(timezone).toHaveValue("Asia/Ho_Chi_Minh");
    await expect(dateFormat).toHaveValue("dd/MM/yyyy");
    await expect(hourCycle).toHaveValue("h23");
    await expect(motion).toHaveValue("system");
    await expect(fontScale).toHaveValue(/^1$/);
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme-preference",
      "system",
    );
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("html")).toHaveAttribute(
      "data-reduced-motion",
      "system",
    );
    await expect(page.getByText("03/01/2026 00:05")).toBeVisible();

    await theme.selectOption("dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await timezone.fill("UTC");
    await dateFormat.selectOption("yyyy-MM-dd");
    await hourCycle.selectOption("h12");
    await motion.selectOption("reduce");
    await expect(page.locator("html")).toHaveAttribute(
      "data-reduced-motion",
      "reduce",
    );
    await expect(page.getByText("2026-01-02 05:05 CH")).toBeVisible();
    await fontScale.focus();
    for (let step = 0; step < 10; step++) await fontScale.press("ArrowRight");
    await expect(fontScale).toHaveValue(/^1\.5$/);
    await expect(page.getByText("Cỡ chữ (150%)")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute(
      "style",
      /--font-scale:\s*1\.50/,
    );

    await page.getByRole("button", { name: "Lưu cài đặt" }).click();
    await expect(page.getByText("Đã lưu cài đặt hiển thị.")).toBeVisible();
    expect(await readPreferences(users[0])).toEqual({
      theme: "dark",
      language: "vi-VN",
      timezone: "UTC",
      date_format: "yyyy-MM-dd",
      hour_cycle: "h12",
      reduced_motion: "reduce",
      font_scale: "1.50",
      version: "1",
    });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).toHaveAttribute(
      "style",
      /--font-scale:\s*1\.50/,
    );

    // The same account keeps the preference in another session.
    await context.addCookies([cookie(1)]);
    await page.reload();
    await expect(theme).toHaveValue("dark");
    await expect(fontScale).toHaveValue(/^1\.5$/);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // A different account remains on its own defaults.
    await context.addCookies([cookie(2)]);
    await page.reload();
    await expect(theme).toHaveValue("system");
    await expect(timezone).toHaveValue("Asia/Ho_Chi_Minh");
    await expect(fontScale).toHaveValue(/^1$/);
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme-preference",
      "system",
    );
    expect(
      (
        await owner.query(
          "SELECT count(*)::int AS count FROM m10.personal_preferences WHERE user_id=$1",
          [users[1]],
        )
      ).rows[0].count,
    ).toBe(0);
    expect((await readPreferences(users[0])).theme).toBe("dark");

    // Stale settings are rejected instead of overwriting the other session.
    await context.addCookies([cookie(1)]);
    await page.reload();
    await expect(theme).toHaveValue("dark");
    await owner.query(
      "UPDATE m10.personal_preferences SET font_scale=1.25 WHERE user_id=$1",
      [users[0]],
    );
    await theme.selectOption("light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: "Lưu cài đặt" }).click();
    await expect(
      page.getByText(
        "Cài đặt đã thay đổi ở một phiên khác. Tải lại và xem xét giá trị mới trước khi lưu.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Lưu cài đặt" }),
    ).toBeDisabled();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await readPreferences(users[0])).toEqual({
      theme: "dark",
      language: "vi-VN",
      timezone: "UTC",
      date_format: "yyyy-MM-dd",
      hour_cycle: "h12",
      reduced_motion: "reduce",
      font_scale: "1.25",
      version: "2",
    });

    await page.getByRole("button", { name: "Tải lại cài đặt" }).click();
    await expect(theme).toHaveValue("dark");
    await expect(fontScale).toHaveValue(/^1\.25$/);
    await expect(page.locator("html")).toHaveAttribute(
      "style",
      /--font-scale:\s*1\.25/,
    );
    await theme.selectOption("light");
    await page.getByRole("button", { name: "Lưu cài đặt" }).click();
    await expect(page.getByText("Đã lưu cài đặt hiển thị.")).toBeVisible();
    expect(await readPreferences(users[0])).toEqual({
      theme: "light",
      language: "vi-VN",
      timezone: "UTC",
      date_format: "yyyy-MM-dd",
      hour_cycle: "h12",
      reduced_motion: "reduce",
      font_scale: "1.25",
      version: "3",
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);

    await owner.query(
      "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1",
      [sessions[1]],
    );
    await page.getByRole("button", { name: "Tải lại cài đặt" }).click();
    await expect(
      page.getByRole("link", { name: "Đăng nhập lại" }),
    ).toBeVisible();
  } finally {
    await owner.query(
      "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=ANY($1::uuid[]) AND revoked_at IS NULL",
      [users],
    );
    await owner.end();
  }
});
