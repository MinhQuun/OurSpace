import { test, expect } from "@playwright/test";
import { randomUUID, randomBytes, createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";

test("permission Inspector UI refreshes current access without retaining stale results", async ({page,context},info) => {
  const owner=new Pool({host:'127.0.0.1',port:55432,database:'ourspace',user:'ourspace_owner',password:readFileSync('.local/db-password','utf8').trim(),max:1});
  const actor=randomUUID(), other=randomUUID(), resource=randomUUID(), hidden=randomUUID(), session=randomUUID();
  const token=randomBytes(32).toString('base64url');
  try {
    await owner.query("INSERT INTO m10.accounts(id,state) VALUES ($1,'active'),($2,'active')",[actor,other]);
    await owner.query("INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",[session,actor,createHash('sha256').update(token).digest('hex')]);
    await owner.query("INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ($1,'M01','diary',$2),($3,'M02','media',$4)",[resource,actor,hidden,other]);
    await context.addCookies([{name:'ourspace_session',value:`${session}:${token}`,url:'http://127.0.0.1:3102',httpOnly:true,sameSite:'Strict'}]);
    await page.goto(`/account/permissions/${resource}`);
    await expect(page.getByRole('heading',{name:'Chủ sở hữu'})).toBeVisible();
    await expect(page.getByText('Quyền cơ bản cho phép xem.')).toBeVisible();
    await owner.query("UPDATE m10.resources SET access_mode='conditional' WHERE id=$1",[resource]);
    await page.getByRole('button',{name:'Kiểm tra lại'}).click();
    await expect(page.getByText('Nội dung có điều kiện truy cập riêng;', {exact:false})).toBeVisible();
    await expect(page.getByText('Quyền cơ bản cho phép xem.')).toHaveCount(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    await page.screenshot({path:`.local/permissions-${info.project.name}.png`,fullPage:true});
    await page.goto(`/account/permissions/${hidden}`);
    await expect(page.getByRole('status')).toHaveText('Không thể xem quyền của nội dung này.');
    await expect(page.getByRole('heading',{name:'Chủ sở hữu'})).toHaveCount(0);
    await page.goto(`/account/permissions/${randomUUID()}`);
    await expect(page.getByRole('status')).toHaveText('Không thể xem quyền của nội dung này.');
    await page.goto(`/account/permissions/${resource}`);
    await expect(page.getByRole('heading',{name:'Chủ sở hữu'})).toBeVisible();
    await owner.query('UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1',[session]);
    await page.getByRole('button',{name:'Kiểm tra lại'}).click();
    await expect(page.getByRole('link',{name:'Đăng nhập',exact:true})).toBeVisible();
    await expect(page.getByRole('heading',{name:'Chủ sở hữu'})).toHaveCount(0);
    expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
  } finally {
    await owner.query('DELETE FROM m10.resources WHERE id=ANY($1::uuid[])',[[resource,hidden]]);
    await owner.query('DELETE FROM app_internal.pairing_request_budgets WHERE account_id=$1',[actor]);
    await owner.query('DELETE FROM m10.sessions WHERE id=$1',[session]);
    await owner.query('DELETE FROM m10.accounts WHERE id=ANY($1::uuid[])',[[actor,other]]);
    await owner.end();
  }
});
