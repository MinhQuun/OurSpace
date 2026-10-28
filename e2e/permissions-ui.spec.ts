import { test, expect } from "@playwright/test";
import { randomUUID, randomBytes, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";

test("permission Inspector UI refreshes current access without retaining stale results", async ({
  page,
  context,
}, info) => {
  const owner = new Pool({
    host: "127.0.0.1",
    port: 55432,
    database: "ourspace",
    user: "ourspace_owner",
    password: readFileSync(".local/db-password", "utf8").trim(),
    max: 1,
  });
  const actor = randomUUID(),
    other = randomUUID(),
    resource = randomUUID(),
    hidden = randomUUID(),
    session = randomUUID();
  const token = randomBytes(32).toString("base64url");
  try {
    await owner.query(
      "INSERT INTO m10.accounts(id,state) VALUES ($1,'active'),($2,'active')",
      [actor, other],
    );
    await owner.query(
      "INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",
      [session, actor, createHash("sha256").update(token).digest("hex")],
    );
    await owner.query(
      "INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ($1,'M01','diary',$2),($3,'M02','media',$4)",
      [resource, actor, hidden, other],
    );
    await context.addCookies([
      {
        name: "ourspace_session",
        value: `${session}:${token}`,
        url: "http://127.0.0.1:3102",
        httpOnly: true,
        sameSite: "Strict",
      },
    ]);
    await page.goto(`/account/permissions/${resource}`);
    await expect(
      page.getByRole("heading", { name: "Chủ sở hữu" }),
    ).toBeVisible();
    await expect(page.getByText("Quyền cơ bản cho phép xem.")).toBeVisible();
    await owner.query(
      "UPDATE m10.resources SET access_mode='conditional' WHERE id=$1",
      [resource],
    );
    await page.getByRole("button", { name: "Kiểm tra lại" }).click();
    await expect(
      page.getByText("Nội dung có điều kiện truy cập riêng;", { exact: false }),
    ).toBeVisible();
    await expect(page.getByText("Quyền cơ bản cho phép xem.")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `.local/permissions-${info.project.name}.png`,
      fullPage: true,
    });
    await page.goto(`/account/permissions/${hidden}`);
    await expect(page.getByRole("status")).toHaveText(
      "Không thể xem quyền của nội dung này.",
    );
    await expect(page.getByRole("heading", { name: "Chủ sở hữu" })).toHaveCount(
      0,
    );
    await page.goto(`/account/permissions/${randomUUID()}`);
    await expect(page.getByRole("status")).toHaveText(
      "Không thể xem quyền của nội dung này.",
    );
    await page.goto(`/account/permissions/${resource}`);
    await expect(
      page.getByRole("heading", { name: "Chủ sở hữu" }),
    ).toBeVisible();
    await owner.query(
      "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1",
      [session],
    );
    await page.getByRole("button", { name: "Kiểm tra lại" }).click();
    await expect(
      page.getByRole("link", { name: "Đăng nhập", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Chủ sở hữu" })).toHaveCount(
      0,
    );
    expect(
      await page.evaluate(() => [localStorage.length, sessionStorage.length]),
    ).toEqual([0, 0]);
  } finally {
    await owner.query("DELETE FROM m10.resources WHERE id=ANY($1::uuid[])", [
      [resource, hidden],
    ]);
    await owner.query(
      "DELETE FROM app_internal.pairing_request_budgets WHERE account_id=$1",
      [actor],
    );
    await owner.query("DELETE FROM m10.sessions WHERE id=$1", [session]);
    await owner.query("DELETE FROM m10.accounts WHERE id=ANY($1::uuid[])", [
      [actor, other],
    ]);
    await owner.end();
  }
});

test("owner sharing UI requires consent and revokes recipient access", async ({
  page,
  context,
  browser,
}, info) => {
  const owner = new Pool({
    host: "127.0.0.1",
    port: 55432,
    database: "ourspace",
    user: "ourspace_owner",
    password: readFileSync(".local/db-password", "utf8").trim(),
    max: 1,
  });
  const a = randomUUID(),
    b = randomUUID(),
    resource = randomUUID(),
    invitation = randomUUID(),
    space = randomUUID();
  const kind = "ui_" + randomUUID().replaceAll("-", "");
  const tokens = [
    randomBytes(32).toString("base64url"),
    randomBytes(32).toString("base64url"),
  ];
  const sessions = [randomUUID(), randomUUID()];
  const partner = await browser.newContext();
  try {
    await owner.query(
      "INSERT INTO m10.accounts(id,state) VALUES ($1,'active'),($2,'active')",
      [a, b],
    );
    await owner.query(
      "INSERT INTO m10.profiles(user_id,display_name) VALUES ($1,'Synthetic owner'),($2,'Synthetic partner')",
      [a, b],
    );
    for (let i = 0; i < 2; i++)
      await owner.query(
        "INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",
        [
          sessions[i],
          [a, b][i],
          createHash("sha256").update(tokens[i]).digest("hex"),
        ],
      );
    await owner.query("BEGIN");
    await owner.query(
      "INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ($1,$2,$3)",
      [invitation, a, createHash("sha256").update(randomUUID()).digest("hex")],
    );
    await owner.query(
      "UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by=$2,accepted_at=clock_timestamp() WHERE id=$1",
      [invitation, b],
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
      [space, a, b],
    );
    await owner.query("COMMIT");
    await owner.query(
      "INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ($1,'M01',$2,$3)",
      [resource, kind, a],
    );
    await owner.query(
      "INSERT INTO app_internal.resource_role_policies(module,kind,role) VALUES ('M01',$1,'viewer')",
      [kind],
    );
    for (const [index, ctx] of [context, partner].entries())
      await ctx.addCookies([
        {
          name: "ourspace_session",
          value: `${sessions[index]}:${tokens[index]}`,
          url: "http://127.0.0.1:3102",
          httpOnly: true,
          sameSite: "Strict",
        },
      ]);
    await page.goto(`/account/permissions/${resource}`);
    const grant = page.getByRole("button", { name: "Cấp quyền", exact: true });
    await expect(grant).toBeVisible();
    await grant.click();
    expect(
      (
        await owner.query(
          "SELECT count(*) FROM m10.resource_grants WHERE resource_id=$1",
          [resource],
        )
      ).rows[0].count,
    ).toBe("0");
    await page
      .getByLabel(
        "Tôi xác nhận chia sẻ nội dung với người này theo vai trò đã chọn.",
      )
      .check();
    await owner.query(
      "UPDATE m10.resources SET version=version+1 WHERE id=$1",
      [resource],
    );
    await grant.click();
    await expect(
      page.getByRole("region", { name: "Quản lý chia sẻ" }).getByRole("alert"),
    ).toHaveText("Quyền đã thay đổi. Hãy kiểm tra lại trước khi xác nhận.");
    expect(
      (
        await owner.query(
          "SELECT count(*) FROM m10.resource_grants WHERE resource_id=$1",
          [resource],
        )
      ).rows[0].count,
    ).toBe("0");
    await page.getByRole("button", { name: "Kiểm tra lại" }).click();
    await expect(grant).toBeVisible();
    await page
      .getByLabel(
        "Tôi xác nhận chia sẻ nội dung với người này theo vai trò đã chọn.",
      )
      .check();
    await grant.click();
    const revoke = page.getByRole("button", {
      name: "Thu hồi quyền",
      exact: true,
    });
    await expect(revoke).toBeVisible();
    await expect(grant).toHaveCount(0);
    const recipient = await partner.newPage();
    await recipient.goto(
      `http://127.0.0.1:3102/account/permissions/${resource}`,
    );
    await expect(
      recipient.getByRole("heading", { name: "Người xem", exact: true }),
    ).toBeVisible();
    await expect(
      recipient.getByRole("heading", { name: "Quản lý chia sẻ" }),
    ).toHaveCount(0);
    await revoke.click();
    expect(
      (
        await owner.query(
          "SELECT count(*) FROM m10.resource_grants WHERE resource_id=$1 AND revoked_at IS NULL",
          [resource],
        )
      ).rows[0].count,
    ).toBe("1");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `.local/sharing-${info.project.name}.png`,
      fullPage: true,
    });
    await page.getByLabel("Tôi xác nhận thu hồi quyền này.").check();
    await revoke.click();
    await expect(grant).toBeVisible();
    await recipient.getByRole("button", { name: "Kiểm tra lại" }).click();
    await expect(recipient.getByRole("status")).toHaveText(
      "Không thể xem quyền của nội dung này.",
    );
    expect(
      await page.evaluate(() => [localStorage.length, sessionStorage.length]),
    ).toEqual([0, 0]);
  } finally {
    await owner.query("ROLLBACK");
    await owner.query(
      "DELETE FROM app_internal.resource_role_policies WHERE module='M01' AND kind=$1",
      [kind],
    );
    await owner.query(
      "UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=ANY($1::uuid[]) AND revoked_at IS NULL",
      [sessions],
    );
    await partner.close();
    await owner.end();
  }
});
