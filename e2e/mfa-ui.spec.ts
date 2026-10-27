import { test, expect } from "@playwright/test";
import jsQR from "jsqr";
import { randomUUID } from "node:crypto";
import { localTotp } from "../integration/local-totp";

test("MFA settings recovers interrupted setup and codes then enables and disables on each viewport", async ({
  page,
}, testInfo) => {
  const email = `mfa-ui-${randomUUID()}@ourspace.test`;
  const password = randomUUID() + "!Aa9";
  const request = page.request;
  const headers = { Origin: "http://127.0.0.1:3102" };
  expect(
    (
      await request.post("/api/auth/signup", {
        headers,
        data: { email, password, displayName: "Synthetic MFA UI" },
      })
    ).status(),
  ).toBe(202);
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
    .match(/http:\/\/127\.0\.0\.1:55433\/verify[^"<>\s]+/)?.[0]
    .replaceAll("&amp;", "&");
  expect(Boolean(link)).toBe(true);
  expect((await request.get(link!, { maxRedirects: 0 })).status()).toBe(303);
  expect(
    (
      await request.post("/api/auth/login", {
        headers,
        data: { email, password },
      })
    ).status(),
  ).toBe(200);
  await page.goto("/account/security");
  await expect(page.getByTestId("mfa-state")).toHaveText("Chưa bật MFA");
  const fill = async (code?: string, confirmed = false) => {
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
    if (code) await page.getByLabel("Mã TOTP", { exact: true }).fill(code);
    if (confirmed) await page.getByRole("checkbox").check();
  };
  await fill();
  await page.getByRole("button", { name: "Bắt đầu thiết lập TOTP" }).click();
  await expect(page.getByTestId("mfa-state")).toHaveText("Chờ xác minh TOTP");
  await page.reload();
  await expect(page.getByTestId("totp-secret")).toHaveCount(0);
  await expect(page.getByTestId("totp-qr")).toHaveCount(0);
  await fill(undefined, true);
  await page.locator('button[value="mfa-cancel"]').click();
  await expect(page.locator('button[value="mfa-start"]')).toBeVisible();
  await fill();
  await page.locator('button[value="mfa-start"]').click();
  await expect(page.getByTestId("totp-secret")).toBeVisible();
  const secret = (await page.getByTestId("totp-secret").textContent())!;
  const pixels = await page.getByTestId("totp-qr").evaluate((element) => {
    const canvas = element as HTMLCanvasElement;
    return {
      width: canvas.width,
      height: canvas.height,
      data: Array.from(
        canvas.getContext("2d")!.getImageData(0, 0, canvas.width, canvas.height)
          .data,
      ),
    };
  });
  const decoded = jsQR(
    new Uint8ClampedArray(pixels.data),
    pixels.width,
    pixels.height,
  );
  expect(Boolean(decoded)).toBe(true);
  const otp = new URL(decoded!.data);
  expect(otp.protocol === "otpauth:" && otp.hostname === "totp").toBe(true);
  expect(otp.searchParams.get("secret") === secret).toBe(true);

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await fill(localTotp(secret));
  await page
    .getByRole("button", { name: "Xác minh TOTP", exact: true })
    .click();
  await expect(page.getByTestId("mfa-state")).toHaveText(
    "Chờ lưu mã khôi phục",
  );
  await fill(localTotp(secret));
  await page.getByRole("button", { name: "Nhận mã khôi phục" }).click();
  await expect(
    page.getByRole("heading", { name: "Lưu mã khôi phục" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
  expect(
    await page.evaluate(() => document.cookie.includes("ourspace_mfa")),
  ).toBe(false);
  const oldCode = await page
    .locator(".mfa-settings li code")
    .first()
    .textContent();
  await page.reload();
  await expect(page.locator(".mfa-settings li code")).toHaveCount(0);
  await expect(page.locator('button[value="mfa-acknowledge"]')).toHaveCount(0);
  await fill(localTotp(secret));
  await page.locator('button[value="mfa-replace-recovery"]').click();
  await expect(page.locator(".mfa-settings li code").first()).toBeVisible();
  const newCodes = await page
    .locator(".mfa-settings li code")
    .allTextContents();
  expect(newCodes.includes(oldCode!)).toBe(false);
  const isolated = await page.context().browser()!.newContext();
  try {
    const rejected = await isolated.request.post(
      "http://127.0.0.1:3102/api/auth/login",
      {
        headers,
        data: {
          email,
          password,
          secondFactor: { method: "recovery", code: oldCode },
        },
      },
    );
    expect(rejected.status()).toBe(401);
  } finally {
    await isolated.close();
  }
  await fill(localTotp(secret));
  await page.getByRole("button", { name: "Đã lưu mã — bật MFA" }).click();
  await expect(page.locator(".mfa-settings").getByRole("alert")).toContainText(
    "đánh dấu xác nhận",
  );
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Đã lưu mã — bật MFA" }).click();
  await expect(page.getByTestId("mfa-state")).toHaveText("Đã bật MFA");
  await expect(
    page.getByRole("heading", { name: "Lưu mã khôi phục" }),
  ).toHaveCount(0);
  await expect(page.getByTestId("totp-secret")).toHaveCount(0);
  await expect(page.getByTestId("totp-qr")).toHaveCount(0);
  await page.screenshot({
    path: `.local/mfa-settings-${testInfo.project.name}.png`,
    fullPage: true,
  });
  await fill(localTotp(secret), true);
  await page.getByRole("button", { name: "Bắt đầu tắt MFA" }).click();
  await expect(page.getByTestId("mfa-state")).toContainText(
    "Đang chờ hoàn tất",
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Hoàn tất hủy/tắt MFA" }),
  ).toBeVisible();
  await fill(localTotp(secret));
  await page.getByRole("button", { name: "Hoàn tất hủy/tắt MFA" }).click();
  await expect(
    page.getByRole("link", { name: "Đăng nhập để tiếp tục" }),
  ).toBeVisible();
  expect(
    (
      await request.post("/api/auth/login", {
        headers,
        data: { email, password },
      })
    ).status(),
  ).toBe(200);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
