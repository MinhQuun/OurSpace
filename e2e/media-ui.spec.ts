import { test, expect } from "@playwright/test";
import { createHash,randomUUID,randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";
import sharp from "sharp";
import { localStorageToken } from "./support/local-storage";
test("upload queue isolates bad files and retry preserves completed images",async({page,context,request})=>{
 const owner=new Pool({host:"127.0.0.1",port:55432,database:"ourspace",user:"ourspace_owner",password:readFileSync(".local/db-password","utf8").trim(),max:1});
 const user=randomUUID(),session=randomUUID(),token=randomBytes(32).toString("base64url");
 const headers={Authorization:`Bearer ${localStorageToken()}`,"Content-Type":"application/json"};
 try {
  await request.post("http://127.0.0.1:55435/bucket",{headers,data:{id:"media",name:"media",public:false}});
  await owner.query("INSERT INTO m10.accounts(id,state) VALUES ($1,'active')",[user]);
  await owner.query("INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",[session,user,createHash("sha256").update(token).digest("hex")]);
  await context.addCookies([{name:"ourspace_session",value:session+":"+token,url:"http://127.0.0.1:3103",httpOnly:true,sameSite:"Lax"}]);
  await page.goto("/media/upload");
  const png=await sharp({create:{width:10,height:8,channels:3,background:"red"}}).png().toBuffer();
  const jpg=await sharp({create:{width:9,height:7,channels:3,background:"blue"}}).jpeg().toBuffer();
  await page.getByLabel("Chọn ảnh").setInputFiles([{name:"first.png",mimeType:"image/png",buffer:png},{name:"broken.png",mimeType:"image/png",buffer:Buffer.from("bad")},{name:"last.jpg",mimeType:"image/jpeg",buffer:jpg}]);
  let releaseFirst!:()=>void,firstReached!:()=>void;
  const held=new Promise<void>(resolve=>{releaseFirst=resolve;});
  const reached=new Promise<void>(resolve=>{firstReached=resolve;});
  let first=true;
  await page.route("**/api/media/upload?uploadId=*",async route=>{
   if(route.request().method()==="PUT"&&first){first=false;firstReached();await held;}
   await route.continue();
  });
  await page.getByRole("button",{name:"Tải các ảnh đang chờ"}).click();
  await reached;
  try{await page.getByRole("button",{name:"Tạm dừng sau file hiện tại"}).click();}finally{releaseFirst();}
  await expect(page.getByText("Đã dừng hàng đợi. Chọn tải các ảnh đang chờ để tiếp tục.",{exact:true})).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("1 đã lưu · 0 lỗi · 2 đang chờ");
  expect((await owner.query("SELECT count(*)::int AS n FROM m02.upload_items WHERE owner_id=$1",[user])).rows[0].n).toBe(1);
  await page.getByRole("button",{name:"Tải các ảnh đang chờ"}).click();
  await expect(page.getByRole("status")).toHaveText("2 đã lưu · 1 lỗi · 0 đang chờ");
  await page.getByRole("button",{name:"Thử lại"}).click();
  await expect(page.getByRole("button",{name:"Thử lại"})).toBeEnabled();
  await expect(page.getByRole("status")).toHaveText("2 đã lưu · 1 lỗi · 0 đang chờ");
  await page.getByRole("button",{name:"Hủy upload",exact:true}).click();
  await expect(page.getByText("Đã hủy",{exact:true})).toBeVisible();
  expect((await owner.query("SELECT cancelled_at FROM m02.upload_items WHERE owner_id=$1 AND title='broken.png'",[user])).rows[0].cancelled_at).toBeTruthy();
  const rows=(await owner.query("SELECT m.title,b.object_key FROM m02.media m JOIN app_internal.binary_objects b ON b.resource_id=m.id WHERE m.uploaded_by=$1",[user])).rows;
  expect(rows).toHaveLength(2);
  for(const row of rows){const stored=await request.get("http://127.0.0.1:55435/object/media/"+row.object_key,{headers});expect(await stored.body()).toEqual(row.title==="first.png"?png:jpg);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  const intent={commandId:randomUUID(),title:"recover.png",mimeType:"image/png",byteSize:png.length,sha256:createHash("sha256").update(png).digest("hex")};
  const reserved=await context.request.post("/api/media/upload",{headers:{Origin:"http://127.0.0.1:3103"},data:intent});
  expect(reserved.status()).toBe(200);const uploadId=(await reserved.json()).uploadId;
  const discard=await context.request.post("/api/media/upload",{headers:{Origin:"http://127.0.0.1:3103"},data:{...intent,commandId:randomUUID(),title:"discard.png"}});
  const discardId=(await discard.json()).uploadId;

  page.on("dialog",dialog=>dialog.accept());
  await page.reload();
  await page.getByRole("button",{name:"Tìm upload chưa hoàn tất"}).click();
  const recovery=page.getByRole("region",{name:"Phục hồi upload"});
  await page.getByRole("button",{name:"Hủy phiên discard.png",exact:true}).click();
  await expect(recovery.getByRole("status")).toHaveText("Đã hủy phiên upload.");
  expect((await owner.query("SELECT cancelled_at FROM m02.upload_items WHERE id=$1",[discardId])).rows[0].cancelled_at).toBeTruthy();
  await expect(page.getByLabel("Chọn lại discard.png",{exact:true})).toHaveCount(0);

  await expect(recovery.getByText("first.png",{exact:true})).toHaveCount(0);
  const wrong=Buffer.from(png);wrong[wrong.length-1]^=1;
  await page.getByLabel("Chọn lại recover.png",{exact:true}).setInputFiles({name:"wrong.png",mimeType:"image/png",buffer:wrong});
  await expect(recovery.getByRole("status")).toHaveText("File đã chọn không khớp bản đang phục hồi.");
  await page.getByLabel("Chọn lại recover.png",{exact:true}).setInputFiles({name:"recover.png",mimeType:"image/png",buffer:png});
  await expect(recovery.getByRole("status")).toContainText("Đã thêm vào hàng đợi");
  await page.getByRole("button",{name:"Tải các ảnh đang chờ"}).click();
  await expect(page.getByText("1 đã lưu · 0 lỗi · 0 đang chờ",{exact:true})).toBeVisible();
  const completed=(await owner.query("SELECT media_id FROM m02.upload_items WHERE id=$1",[uploadId])).rows[0].media_id;
  expect(completed).toBeTruthy();
  expect((await owner.query("SELECT count(*)::integer n FROM m02.media WHERE uploaded_by=$1",[user])).rows[0].n).toBe(3);
  await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1",[session]);
  await page.getByLabel("Chọn ảnh").setInputFiles({name:"again.png",mimeType:"image/png",buffer:png});
  await page.getByRole("button",{name:"Tải các ảnh đang chờ"}).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Phiên đăng nhập đã kết thúc");
  await expect(page.getByText("first.png",{exact:true})).toHaveCount(0);
 }finally{
  const keys=(await owner.query("SELECT object_key FROM m02.upload_items WHERE owner_id=$1",[user])).rows.map(r=>r.object_key);
  if(keys.length)await request.delete("http://127.0.0.1:55435/object/media",{headers,data:{prefixes:keys}});
  await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1 AND revoked_at IS NULL",[session]);await owner.end();
 }
});
