import { test, expect } from "@playwright/test";
import { createHash, randomUUID, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";
import sharp from "sharp";
import { localStorageToken } from "./support/local-storage";

test("shared metadata respects viewer editor revoke and frozen Space", async ({ page, context, request }) => {
  test.setTimeout(60000);
  const db = new Pool({ host: "127.0.0.1", port: 55432, database: "ourspace", user: "ourspace_owner", password: readFileSync(".local/db-password", "utf8").trim(), max: 1 });
  const users = [randomUUID(), randomUUID()], sessions = [randomUUID(), randomUUID()];
  const tokens = [randomBytes(32).toString("base64url"), randomBytes(32).toString("base64url")];
  const invitation = randomUUID(), space = randomUUID();
  const storageHeaders = { Authorization: `Bearer ${localStorageToken()}`, "Content-Type": "application/json" };
  try {
    await request.post("http://127.0.0.1:55435/bucket", { headers: storageHeaders, data: { id: "media", name: "media", public: false } });
    for (let i = 0; i < 2; i++) {
      await db.query("INSERT INTO m10.accounts(id,state) VALUES ($1,'active')", [users[i]]);
      await db.query("INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')", [sessions[i], users[i], createHash("sha256").update(tokens[i]).digest("hex")]);
    }
    await db.query(`BEGIN;
      INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('${invitation}','${users[0]}','${createHash("sha256").update(randomBytes(32)).digest("hex")}');
      UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='${users[1]}',accepted_at=clock_timestamp() WHERE id='${invitation}';
      UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='${invitation}';
      INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('${space}','${invitation}');
      INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('${space}','${users[0]}',1),('${space}','${users[1]}',2);
      COMMIT;`);
    const bytes = await sharp({ create: { width: 16, height: 12, channels: 3, background: "purple" } }).png().toBuffer();
    const headers = { Origin: "http://127.0.0.1:3103", Cookie: `ourspace_session=${sessions[0]}:${tokens[0]}` };
    const begin = await request.post("/api/media/upload", { headers, data: { commandId: randomUUID(), title: "Shared fixture", mimeType: "image/png", byteSize: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") } });
    expect(begin.status()).toBe(200);
    const upload = await request.put("/api/media/upload?uploadId=" + (await begin.json()).uploadId, { headers: { ...headers, "Content-Type": "application/octet-stream" }, data: bytes });
    expect(upload.status()).toBe(200);
    const media = (await upload.json()).mediaId;
    await context.addCookies([{ name: "ourspace_session", value: `${sessions[1]}:${tokens[1]}`, url: "http://127.0.0.1:3103", httpOnly: true, sameSite: "Lax" }]);
    await page.goto("/media");
    await expect(page.getByText("Chưa có media. Tải ảnh đầu tiên để lưu kỷ niệm.")).toBeVisible();
    const grant = async (role: string) => {
      await db.query("INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role) VALUES ($1,$2,$3,$4,$5,$6)", [randomUUID(), media, users[0], users[1], space, role]);
    };
    const revoke = async () => { await db.query("UPDATE m10.resource_grants SET revoked_at=clock_timestamp() WHERE resource_id=$1 AND revoked_at IS NULL", [media]); };
    const open = async (title: string) => {
      await page.getByRole("button", { name: "Làm mới thư viện" }).click();
      await page.getByRole("button", { name: `Xem ${title}`, exact: true }).click();
      await expect(page.getByRole("dialog").getByRole("heading", { name: title, exact: true })).toBeVisible();
      await page.getByRole("dialog").getByText("Thông tin ảnh", { exact: true }).click();
    };
    await grant("viewer");
    await open("Shared fixture");
    await expect(page.getByRole("form", { name: "Chỉnh thông tin ảnh" })).toHaveCount(0);
    await page.getByRole("button", { name: "Đóng ảnh", exact: true }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await revoke(); await grant("editor");
    await open("Shared fixture");
    const editor = page.getByRole("form", { name: "Chỉnh thông tin ảnh" });
    await editor.getByLabel("Tiêu đề ảnh").fill("Edited by partner");
    await editor.getByLabel("Mô tả ảnh").fill("Allowed active Space edit");
    await editor.getByRole("button", { name: "Lưu thông tin", exact: true }).click();
    await expect(page.getByRole("dialog").getByRole("heading", { name: "Edited by partner" })).toBeVisible();
    expect((await db.query("SELECT description FROM m02.media WHERE id=$1", [media])).rows[0].description).toBe("Allowed active Space edit");
    await revoke();
    await editor.getByLabel("Mô tả ảnh").fill("Revoked edit must fail");
    await editor.getByRole("button", { name: "Lưu thông tin", exact: true }).click();
    await expect(page.locator("main").getByRole("alert")).toContainText("Media không còn khả dụng");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await grant("editor");
    await open("Edited by partner");
    await db.query("UPDATE m10.couple_spaces SET state='disconnecting' WHERE id=$1", [space]);
    await db.query("UPDATE m10.couple_spaces SET state='frozen' WHERE id=$1", [space]);
    await editor.getByLabel("Mô tả ảnh").fill("Frozen edit must fail");
    await editor.getByRole("button", { name: "Lưu thông tin", exact: true }).click();
    await expect(page.locator("main").getByRole("alert")).toContainText("Media không còn khả dụng");
    expect((await db.query("SELECT description,version::text FROM m02.media WHERE id=$1", [media])).rows[0]).toEqual({ description: "Allowed active Space edit", version: "2" });
  } finally {
    const keys = (await db.query("SELECT object_key FROM m02.upload_items WHERE owner_id=$1", [users[0]])).rows.map(row => row.object_key);
    if (keys.length) await request.delete("http://127.0.0.1:55435/object/media", { headers: storageHeaders, data: { prefixes: keys } });
    await db.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=ANY($1::uuid[]) AND revoked_at IS NULL", [users]);
    await db.end();
  }
});
