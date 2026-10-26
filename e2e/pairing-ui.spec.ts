import { test, expect, type APIRequestContext } from "@playwright/test";
import { randomUUID } from "node:crypto";
test("two browsers pair only after identity checks and both consents", async ({
  page,
  browser,
}, testInfo) => {
  const other = await browser.newContext({ viewport: page.viewportSize()! });
  const partner = await other.newPage();
  const headers = { Origin: "http://127.0.0.1:3102" };
  async function account(request: APIRequestContext, name: string) {
    const email = `pair-ui-${randomUUID()}@ourspace.test`,
      password = randomUUID() + "!Aa9";
    expect(
      (
        await request.post("http://127.0.0.1:3102/api/auth/signup", {
          headers,
          data: { email, password, displayName: name },
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
        await request.post("http://127.0.0.1:3102/api/auth/login", {
          headers,
          data: { email, password },
        })
      ).status(),
    ).toBe(200);
    return {email,password};
  }
  try {
    const credentials = await account(page.request, "Synthetic Partner A");
    await account(partner.request, "Synthetic Partner B");
    await page.goto("/account/pairing");
    const create = page
      .locator("form")
      .filter({
        has: page.getByRole("button", { name: "Tạo lời mời", exact: true }),
      });
    await create.getByRole("button").click();
    await expect(page.getByLabel("Link mời", { exact: true })).toHaveCount(0);
    await create.getByRole("checkbox").check();
    await create.getByRole("button").click();
    const invitation = await page
      .getByLabel("Link mời", { exact: true })
      .inputValue();
    expect(new URL(invitation).search).toBe("");
    await partner.goto(invitation);
    await expect(
      partner.getByText("Synthetic Partner A", { exact: true }),
    ).toBeVisible();
    expect(new URL(partner.url()).hash).toBe("");
    const accept = partner
      .locator("form")
      .filter({
        has: partner.getByRole("button", {
          name: "Chấp nhận lời mời",
          exact: true,
        }),
      });
    await accept.getByRole("checkbox").check();
    await accept.getByRole("button").click();
    await expect(
      partner.getByRole("heading", { name: "Chờ người mời xác nhận" }),
    ).toBeVisible();
    await expect(
      partner.getByRole("heading", { name: "Đã ghép đôi", exact: true }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Làm mới trạng thái" }).click();
    await expect(
      page.getByText("Synthetic Partner B", { exact: true }),
    ).toBeVisible();
    const confirm = page
      .locator("form")
      .filter({
        has: page.getByRole("button", {
          name: "Xác nhận ghép đôi",
          exact: true,
        }),
      });
    await confirm.getByRole("button").click();
    await expect(
      page.getByRole("heading", { name: "Đã ghép đôi", exact: true }),
    ).toHaveCount(0);
    await confirm.getByRole("checkbox").check();
    await confirm.getByRole("button").click();
    await expect(
      page.getByRole("heading", { name: "Đã ghép đôi", exact: true }),
    ).toBeVisible();
    await partner.getByRole("button", { name: "Làm mới trạng thái" }).click();
    await expect(
      partner.getByRole("heading", { name: "Đã ghép đôi", exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Đã ghép đôi", exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel("Link mời", { exact: true })).toHaveCount(0);
    for (const current of [page, partner]) {
      expect(
        await current.evaluate(
          () => localStorage.length + sessionStorage.length,
        ),
      ).toBe(0);
      expect(
        await current.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    // Real account budget: initial successful creation used one of ten requests.
    for (let index = 0; index < 9; index++) {
      expect((await page.request.post("/api/pairing/create", {
        headers, data: { confirmed: false },
      })).status()).toBe(400);
    }
    await create.getByRole("checkbox").check();
    await create.getByRole("button").click();
    await expect(page.locator(".pairing-panel").getByRole("alert")).toContainText("Bạn thao tác quá nhanh. Hãy chờ");
    await expect(page.getByRole("heading", { name: "Đã ghép đôi", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Làm mới trạng thái" }).click();
    await expect(page.locator(".pairing-panel").getByRole("alert")).toHaveCount(0);
    await page.screenshot({
      path: `.local/pairing-${testInfo.project.name}.png`,
      fullPage: true,
    });
    await page.goto("/account/spaces");
    await expect(page.getByRole("heading",{name:"Đang liên kết",exact:true})).toBeVisible();
    await page.getByLabel("Email của bạn").fill(credentials.email);
    await page.getByLabel("Mật khẩu hiện tại").fill(credentials.password);
    await page.getByRole("button",{name:"Ngừng liên kết",exact:true}).click();
    await expect(page.getByRole("heading",{name:"Đang liên kết",exact:true})).toBeVisible();
    await page.getByRole("checkbox").check();
    await page.getByRole("button",{name:"Ngừng liên kết",exact:true}).click();
    await expect(page.getByRole("heading",{name:"Đã ngừng liên kết",exact:true})).toBeVisible();
    await expect(page.getByLabel("Mật khẩu hiện tại")).toHaveCount(0);
    await partner.goto("http://127.0.0.1:3102/account/spaces");
    await expect(partner.getByRole("heading",{name:"Đã ngừng liên kết",exact:true})).toBeVisible();
    await page.reload();
    await expect(page.getByText("Thời hạn xử lý:",{exact:false})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(await page.evaluate(()=>localStorage.length+sessionStorage.length)).toBe(0);
    await page.screenshot({path:`.local/spaces-${testInfo.project.name}.png`,fullPage:true});
  } finally {
    await other.close();
  }
});
