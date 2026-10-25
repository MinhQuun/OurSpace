import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { localTotp } from "../integration/local-totp";

test("email recovery link and reload-safe reset work on each viewport", async ({
  page,
}, testInfo) => {
  const email = `reset-ui-${randomUUID()}@ourspace.test`;
  const password = randomUUID() + "!Aa9";
  const next = randomUUID() + "!Bb8";
  const request = page.request;
  const headers = { Origin: "http://127.0.0.1:3102" };
  const mailLink = async () => {
    const inbox = await (
      await request.get("http://127.0.0.1:55434/api/v1/messages")
    ).json();
    const mail = inbox.messages.find((m: { To: { Address: string }[] }) =>
      m.To.some((to) => to.Address === email),
    );
    expect(Boolean(mail)).toBe(true);
    const detail = await (
      await request.get(`http://127.0.0.1:55434/api/v1/message/${mail.ID}`)
    ).json();
    const link = String(detail.HTML)
      .match(
        /http:\/\/127\.0\.0\.1:(?:55433\/verify|3102\/account\/recovery-link)[^"<>\s]+/,
      )?.[0]
      .replaceAll("&amp;", "&");
    expect(Boolean(link)).toBe(true);
    return link!;
  };
  expect(
    (
      await request.post("/api/auth/signup", {
        headers,
        data: { email, password, displayName: "Synthetic reset UI" },
      })
    ).status(),
  ).toBe(202);
  expect(
    (await request.get(await mailLink(), { maxRedirects: 0 })).status(),
  ).toBe(303);
  await page.goto("/account");
  await page.getByRole("link", { name: "Quên mật khẩu?" }).click();
  await expect(page.getByRole("button", { name: /email/ })).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByRole("button", { name: "Gửi email phục hồi" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Nếu email đủ điều kiện",
  );
  await page.goto(await mailLink());
  await expect(
    page.getByRole("button", { name: "Tiếp tục phục hồi" }),
  ).toBeVisible();
  expect(
    new URL(page.url()).hash === "" && new URL(page.url()).search === "",
  ).toBe(true);
  await page.getByRole("button", { name: "Tiếp tục phục hồi" }).click();
  await expect(page.getByLabel("Mật khẩu mới", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByLabel("Mật khẩu mới", { exact: true }).fill(next);
  await page.getByLabel("Nhập lại mật khẩu", { exact: true }).fill(next);
  await page.getByRole("checkbox").check();
  const proofCookies = (
    await page.context().cookies("http://127.0.0.1:3102/api/auth")
  ).filter((cookie) => cookie.name === "ourspace_password_recovery");
  expect(proofCookies.length).toBe(1);
  // Simulate browser cookie expiry between rendering and submission, without mocking HTTP.
  await page.context().clearCookies({ name: "ourspace_password_recovery" });
  await page.getByRole("button", { name: "Lưu mật khẩu mới" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Chưa thể hoàn tất" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Mật khẩu mới", { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Đăng nhập lại", exact: true }),
  ).toHaveCount(0);
  expect(
    (
      await request.post("/api/auth/login", {
        headers,
        data: { email, password: next },
      })
    ).status(),
  ).toBe(401);
  // Restore the still-valid server proof to show the denied submission did not consume it.
  await page.context().addCookies(proofCookies);
  await page.reload();
  await page.getByLabel("Mật khẩu mới", { exact: true }).fill(next);
  await page.getByLabel("Nhập lại mật khẩu", { exact: true }).fill(next);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Lưu mật khẩu mới" }).click();
  await expect(
    page.getByRole("link", { name: "Đăng nhập lại", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
  expect(
    await page.evaluate(() =>
      document.cookie.includes("ourspace_password_recovery"),
    ),
  ).toBe(false);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: `.local/recovery-${testInfo.project.name}.png`,
    fullPage: true,
  });
  expect(
    (
      await request.post("/api/auth/login", {
        headers,
        data: { email, password },
      })
    ).status(),
  ).toBe(401);
  await new Promise((resolve) => setTimeout(resolve, 1100));
  expect(
    (
      await request.post("/api/auth/login", {
        headers,
        data: { email, password: next },
      })
    ).status(),
  ).toBe(200);
});

test("invalid and rejected recovery links offer a fresh request without success", async ({
  page,
}) => {
  await page.goto(
    "/account/recovery-link?type=recovery&token=bad&redirect_to=https://example.com",
  );
  await expect(
    page.getByRole("alert").filter({ hasText: "Link phục hồi không hợp lệ" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  expect(new URL(page.url()).origin).toBe("http://127.0.0.1:3102");
  expect(new URL(page.url()).hash).toBe("");
  await page.goto(
    `/account/recovery-link?type=recovery&token=${randomUUID().replaceAll("-", "")}`,
  );
  await page.getByRole("button", { name: "Tiếp tục phục hồi" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Chưa thể hoàn tất" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Mật khẩu mới", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("status")).toHaveCount(0);
});

for (const method of ["totp", "recovery", "missing"] as const) {
  test(`MFA password recovery enforces ${method} proof in browser`, async ({
    page,
  }) => {
    const email = `reset-mfa-${randomUUID()}@ourspace.test`;
    const password = randomUUID() + "!Aa9";
    const next = randomUUID() + "!Bb8";
    const headers = { Origin: "http://127.0.0.1:3102" };
    const post = (action: string, data: object = {}) =>
      page.request.post(`/api/auth/${action}`, {
        headers,
        data: { email, password, ...data },
      });
    const mailLink = async () => {
      const inbox = await (
        await page.request.get("http://127.0.0.1:55434/api/v1/messages")
      ).json();
      const mail = inbox.messages.find((m: { To: { Address: string }[] }) =>
        m.To.some((to) => to.Address === email),
      );
      expect(Boolean(mail)).toBe(true);
      const detail = await (
        await page.request.get(
          `http://127.0.0.1:55434/api/v1/message/${mail.ID}`,
        )
      ).json();
      const link = String(detail.HTML)
        .match(
          /http:\/\/127\.0\.0\.1:(?:55433\/verify|3102\/account\/recovery-link)[^"<>\s]+/,
        )?.[0]
        .replaceAll("&amp;", "&");
      expect(Boolean(link)).toBe(true);
      return link!;
    };
    expect(
      (
        await post("signup", { displayName: "Synthetic MFA recovery" })
      ).status(),
    ).toBe(202);
    expect(
      (await page.request.get(await mailLink(), { maxRedirects: 0 })).status(),
    ).toBe(303);
    expect((await post("login")).status()).toBe(200);
    const enrollmentId = randomUUID();
    const start = await post("mfa-start", { enrollmentId });
    expect(start.status()).toBe(200);
    const setup = await start.json();
    const verified = await post("mfa-verify", {
      enrollmentId,
      version: setup.version,
      code: localTotp(setup.secret),
    });
    expect(verified.status()).toBe(200);
    const issued = await post("mfa-recovery", {
      enrollmentId,
      version: (await verified.json()).version,
      code: localTotp(setup.secret),
    });
    expect(issued.status()).toBe(200);
    const recovery = await issued.json();
    expect(
      (
        await post("mfa-acknowledge", {
          enrollmentId,
          version: recovery.version,
          code: localTotp(setup.secret),
          confirmed: true,
        })
      ).status(),
    ).toBe(200);
    expect((await post("logout")).status()).toBe(200);
    expect((await post("password-recovery")).status()).toBe(202);
    const link = await mailLink();
    await page.goto(link);
    await expect(
      page.getByRole("button", { name: "Tiếp tục phục hồi" }),
    ).toBeVisible();
    if (method !== "missing") {
      await page.getByLabel("Loại mã").selectOption(method);
      await page
        .getByLabel("Mã xác thực")
        .fill(method === "totp" ? localTotp(setup.secret) : recovery.codes[0]);
    }
    await page.getByRole("button", { name: "Tiếp tục phục hồi" }).click();
    if (method === "missing") {
      await expect(
        page.getByRole("alert").filter({ hasText: "Chưa thể hoàn tất" }),
      ).toBeVisible();
      await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
      await expect(
        page.getByLabel("Mật khẩu mới", { exact: true }),
      ).toHaveCount(0);
      expect(
        (
          await post("password-prepare", {
            tokenHash: new URL(link).searchParams.get("token"),
            secondFactor: { method: "totp", code: localTotp(setup.secret) },
          })
        ).status(),
      ).toBe(401);
      expect(
        (
          await post("login", {
            secondFactor: { method: "totp", code: localTotp(setup.secret) },
          })
        ).status(),
      ).toBe(200);
      return;
    }
    await page.getByLabel("Mật khẩu mới", { exact: true }).fill(next);
    await page.getByLabel("Nhập lại mật khẩu", { exact: true }).fill(next);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Lưu mật khẩu mới" }).click();
    await expect(
      page.getByRole("link", { name: "Đăng nhập lại", exact: true }),
    ).toBeVisible();
    expect(
      (
        await post("login", {
          secondFactor: { method: "totp", code: localTotp(setup.secret) },
        })
      ).status(),
    ).toBe(401);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    expect((await post("login", { password: next })).status()).toBe(401);
    if (method === "recovery") {
      expect(
        (
          await post("login", {
            password: next,
            secondFactor: { method: "recovery", code: recovery.codes[0] },
          })
        ).status(),
      ).toBe(401);
    }
    expect(
      (
        await post("login", {
          password: next,
          secondFactor: { method: "totp", code: localTotp(setup.secret) },
        })
      ).status(),
    ).toBe(200);
    expect(
      (await (await page.request.get("/api/auth/mfa-status")).json()).enrollment
        .state,
    ).toBe("enabled");
  });
}
