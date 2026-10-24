import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "../src/modules/m10/auth/provider.server";
import { localTotp } from "../integration/local-totp";

test("signup, verify, login, reload and logout work in the browser", async ({
  page,
  request,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const email = `ui-${randomUUID()}@ourspace.test`;
  const password = randomUUID() + "!Aa9";
  await page.goto("/account");
  await expect(
    page.getByRole("button", { name: "Chưa có tài khoản? Đăng ký" }),
  ).toBeVisible();
  await page.screenshot({
    path: `.local/auth-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Chưa có tài khoản? Đăng ký" })
    .click();
  await page.getByLabel("Tên hiển thị").fill("Người dùng thử nghiệm");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
  await page
    .getByRole("button", { name: "Tạo tài khoản", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("xác minh email");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page.locator(".account-card").getByRole("alert")).toContainText(
    "Không thể đăng nhập",
  );
  const inbox = await (
    await request.get("http://127.0.0.1:55434/api/v1/messages")
  ).json();
  const message = inbox.messages.find((m: { To: { Address: string }[] }) =>
    m.To.some((to) => to.Address === email),
  );
  expect(Boolean(message)).toBe(true);
  const detail = await (
    await request.get(`http://127.0.0.1:55434/api/v1/message/${message.ID}`)
  ).json();
  const link = String(detail.HTML)
    .match(/http:\/\/127\.0\.0\.1:55433\/verify[^"<>\s]+/)?.[0]
    .replaceAll("&amp;", "&");
  expect(Boolean(link)).toBe(true);
  expect((await request.get(link!, { maxRedirects: 0 })).status()).toBe(303);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tài khoản của bạn" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.cookie.includes("ourspace_session")),
  ).toBe(false);
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Tài khoản của bạn" }),
  ).toBeVisible();
  const origin = "http://127.0.0.1:3102";
  const loginOther = () =>
    request.post("/api/auth/login", {
      headers: { Origin: origin },
      data: { email, password },
    });
  expect((await loginOther()).status()).toBe(200);
  await page.getByRole("button", { name: "Làm mới danh sách" }).click();
  await expect(
    page.getByRole("button", { name: "Thu hồi phiên này", exact: true }),
  ).toBeVisible();
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Đăng xuất các phiên khác" }).click();
  expect((await request.get("/api/auth/session")).status()).toBe(200);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Đăng xuất các phiên khác" }).click();
  await expect(
    page.locator(".session-panel").getByRole("status"),
  ).toContainText("Đã đăng xuất");
  expect((await request.get("/api/auth/session")).status()).toBe(401);
  expect((await loginOther()).status()).toBe(200);
  await page.getByRole("button", { name: "Làm mới danh sách" }).click();
  await expect(
    page.getByRole("button", { name: "Thu hồi phiên này", exact: true }),
  ).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Thu hồi phiên này", exact: true })
    .click();
  await expect(
    page.locator(".session-panel").getByRole("status"),
  ).toContainText("Đã cập nhật");
  expect((await request.get("/api/auth/session")).status()).toBe(401);
  await page.screenshot({
    path: `.local/sessions-${testInfo.project.name}.png`,
    fullPage: true,
  });
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Thu hồi phiên hiện tại" }).click();
  await expect(
    page.getByRole("button", { name: "Đăng nhập", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tài khoản của bạn" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("đã đăng xuất");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Đăng nhập", exact: true }),
  ).toBeVisible();
  const provider = new AuthProvider("http://127.0.0.1:55433");
  const initial = await provider.signIn(email, password);
  const factor = await provider.enrollTotp(initial.accessToken);
  const challenge = await provider.challengeTotp(
    initial.accessToken,
    factor.id,
  );
  const elevated = await provider.verifyTotp(
    initial.accessToken,
    factor.id,
    challenge,
    localTotp(factor.secret),
  );
  const codes = await provider.generateRecoveryCodes(elevated.accessToken);
  const beginMfa = async () => {
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
    await expect(page.getByLabel("Mã xác thực 6 chữ số")).toBeVisible();
    expect(
      await page.evaluate(() => localStorage.length + sessionStorage.length),
    ).toBe(0);
  };
  await beginMfa();
  await page.getByLabel("Mã xác thực 6 chữ số").fill(localTotp(factor.secret));
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tài khoản của bạn" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await beginMfa();
  await page
    .getByRole("button", { name: "Dùng mã khôi phục", exact: true })
    .click();
  await page.getByLabel("Mã khôi phục", { exact: true }).fill(codes[0]);
  await page.getByRole("button", { name: "Dùng ứng dụng xác thực" }).click();
  await page
    .getByRole("button", { name: "Dùng mã khôi phục", exact: true })
    .click();
  expect(
    (await page.getByLabel("Mã khôi phục", { exact: true }).inputValue()) ===
      "",
  ).toBe(true);
  await page.getByLabel("Mã khôi phục", { exact: true }).fill(codes[0]);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Tài khoản của bạn" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Đăng xuất", exact: true }).click();
  await beginMfa();
  await page
    .getByRole("button", { name: "Dùng mã khôi phục", exact: true })
    .click();
  await page.getByLabel("Mã khôi phục", { exact: true }).fill(codes[0]);
  await page.getByRole("button", { name: "Đăng nhập", exact: true }).click();
  await expect(page.locator(".account-card").getByRole("alert")).toContainText(
    "Không thể đăng nhập",
  );
  expect(
    await page.evaluate(async () => (await fetch("/api/auth/session")).status),
  ).toBe(401);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByLabel("Email", { exact: true }).fill("");
  await page.getByLabel("Mật khẩu", { exact: true }).fill("");
  await page.getByLabel("Mã khôi phục", { exact: true }).fill("");
  await page.screenshot({
    path: `.local/mfa-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await page.reload();
  await expect(page.getByLabel("Mã khôi phục", { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});
