import { test, expect } from "@playwright/test";
import { randomUUID, randomBytes, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";
test("Couple Profile UI saves history and reviews conflicts", async ({
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
    const invitation = randomUUID(),
      space = randomUUID();
    await owner.query("BEGIN");
    try {
      await owner.query(
        "INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ($1,$2,$3)",
        [
          invitation,
          users[0],
          createHash("sha256").update(randomUUID()).digest("hex"),
        ],
      );
      await owner.query(
        "UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by=$2,accepted_at=clock_timestamp() WHERE id=$1",
        [invitation, users[1]],
      );
      await owner.query(
        "UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id=$1",
        [invitation],
      );
      await owner.query(
        "INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ($1,$2)",
        [space, invitation],
      );
      await owner.query(
        "INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ($1,$2,1),($1,$3,2)",
        [space, users[0], users[1]],
      );
      await owner.query("COMMIT");
    } catch (error) {
      await owner.query("ROLLBACK");
      throw error;
    }
    await context.addCookies([
      {
        name: "ourspace_session",
        value: `${sessions[0]}:${tokens[0]}`,
        url: "http://127.0.0.1:3102",
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    await page.goto("/account/couple");
    const field = page.getByRole("textbox", { name: "Tên không gian chung" });
    const accentToggle = page.getByRole("checkbox", {
      name: /Dùng màu nhấn chung/,
    });
    const accentPicker = page.getByRole("textbox", { name: "Màu nhấn chung" });
    await field.fill("Synthetic shared title");
    await accentToggle.check();
    await accentPicker.fill("#336699");
    await page.getByRole("button", { name: "Lưu hồ sơ chung" }).click();
    await expect(page.getByText("Đã lưu hồ sơ chung.")).toBeVisible();
    await expect(page.locator("li strong")).toHaveText([
      "Synthetic shared title",
    ]);
    expect(
      (
        await owner.query(
          "SELECT title,accent FROM m10.couple_profiles WHERE space_id=$1",
          [space],
        )
      ).rows[0],
    ).toEqual({ title: "Synthetic shared title", accent: "#336699" });
    expect(
      (
        await owner.query(
          "SELECT count(*)::int AS count FROM m10.personal_preferences WHERE user_id=ANY($1::uuid[])",
          [users],
        )
      ).rows[0].count,
    ).toBe(0);
    await page.reload();
    await expect(accentPicker).toHaveValue("#336699");
    await expect(accentToggle).toBeChecked();
    await owner.query(
      "UPDATE m10.couple_profiles SET title='Synthetic Partner edit',updated_by=$2 WHERE space_id=$1",
      [space, users[1]],
    );
    await field.fill("Stale edit");
    await page.getByRole("button", { name: "Lưu hồ sơ chung" }).click();
    await expect(
      page.getByText(
        "Hồ sơ đã thay đổi. Tải lại và xem xét tên mới trước khi lưu.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Lưu hồ sơ chung" }),
    ).toBeDisabled();
    expect(
      (
        await owner.query(
          "SELECT title FROM m10.couple_profiles WHERE space_id=$1",
          [space],
        )
      ).rows[0].title,
    ).toBe("Synthetic Partner edit");
    await page.getByRole("button", { name: "Tải lại hồ sơ chung" }).click();
    await expect(field).toHaveValue("Synthetic Partner edit");
    await field.fill("Reviewed title");
    await page.getByRole("button", { name: "Lưu hồ sơ chung" }).click();
    await expect(page.locator("li strong")).toHaveText([
      "Reviewed title",
      "Synthetic Partner edit",
      "Synthetic shared title",
    ]);
    await field.fill("");
    await page.getByRole("button", { name: "Lưu hồ sơ chung" }).click();
    await expect(page.locator("li strong").first()).toHaveText("Chưa đặt tên");
    expect(
      (
        await owner.query(
          "SELECT title FROM m10.couple_profiles WHERE space_id=$1",
          [space],
        )
      ).rows[0].title,
    ).toBeNull();
    for (let revision = 5; revision <= 54; revision++) {
      await owner.query(
        "UPDATE m10.couple_profiles SET title=$2,updated_by=$3 WHERE space_id=$1",
        [space, `Synthetic revision ${revision}`, users[1]],
      );
    }
    await page.getByRole("button", { name: "Tải lại hồ sơ chung" }).click();
    await expect(page.locator("li strong")).toHaveCount(50);
    await expect(page.locator("li strong").first()).toHaveText(
      "Synthetic revision 54",
    );
    await expect(page.locator("li strong").last()).toHaveText(
      "Synthetic revision 5",
    );
    await page.getByRole("button", { name: "Xem lịch sử cũ hơn" }).click();
    await expect(page.locator("li strong")).toHaveCount(54);
    await expect(page.locator("li strong").last()).toHaveText(
      "Synthetic shared title",
    );
    await expect(
      page.getByRole("button", { name: "Xem lịch sử cũ hơn" }),
    ).toHaveCount(0);
    const versionLabels = await page
      .locator("li p:first-of-type")
      .allTextContents();
    expect(
      versionLabels.map((label) => Number(label.match(/Phiên bản (\d+)/)![1])),
    ).toEqual(Array.from({ length: 54 }, (_, index) => 54 - index));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await owner.query(
      "UPDATE m10.couple_spaces SET state='disconnecting' WHERE id=$1",
      [space],
    );
    await owner.query(
      "UPDATE m10.couple_spaces SET state='frozen' WHERE id=$1",
      [space],
    );
    await owner.query(
      "INSERT INTO m10.space_disconnects(space_id,initiated_by) VALUES ($1,$2)",
      [space, users[1]],
    );
    await page.getByRole("button", { name: "Tải lại hồ sơ chung" }).click();
    await expect(
      page.getByText("Liên kết đã đóng băng. Tên chung: Synthetic revision 54"),
    ).toBeVisible();
    await expect(field).toHaveCount(0);
    await expect(page.locator("li strong")).toHaveCount(50);
    await page.getByRole("button", { name: "Xem lịch sử cũ hơn" }).click();
    await expect(page.locator("li strong")).toHaveCount(54);
    await owner.query(
      "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1",
      [sessions[0]],
    );
    await page.getByRole("button", { name: "Tải lại hồ sơ chung" }).click();
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
