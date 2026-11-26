import { test, expect } from "@playwright/test";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { Pool } from "pg";
import sharp from "sharp";
import { localStorageToken } from "./support/local-storage";

test("Next upload HTTP stores real images and preserves private ownership",async({request})=>{
 const owner=new Pool({host:"127.0.0.1",port:55432,database:"ourspace",user:"ourspace_owner",password:readFileSync(".local/db-password","utf8").trim(),max:1});
 const users=[randomUUID(),randomUUID()], sessions=users.map(()=>randomUUID()),tokens=users.map(()=>randomBytes(32).toString("base64url"));
 const headers=(i=0)=>({Origin:"http://127.0.0.1:3103",Cookie:`ourspace_session=${sessions[i]}:${tokens[i]}`});
 const storageHeaders={Authorization:`Bearer ${localStorageToken()}`,"Content-Type":"application/json"};
 const uploads:string[]=[]; const endpoint="/api/media/upload";
 try {
  await request.post("http://127.0.0.1:55435/bucket",{headers:storageHeaders,data:{id:"media",name:"media",public:false}});
  const bucket=await request.get("http://127.0.0.1:55435/bucket/media",{headers:storageHeaders});
  expect(bucket.status()).toBe(200); expect((await bucket.json()).public).toBe(false);
  for(let i=0;i<2;i++) {
   await owner.query("INSERT INTO m10.accounts(id,state) VALUES ($1,'active')",[users[i]]);
   await owner.query("INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ($1,$2,$3,now()+interval '1 hour')",[sessions[i],users[i],createHash("sha256").update(tokens[i]).digest("hex")]);
  }
  for(const format of ["png","jpeg","webp"] as const) {
   const bytes=await sharp({create:{width:12,height:10,channels:3,background:"blue"}}).toFormat(format).toBuffer();
   const intent={commandId:randomUUID(),title:"Synthetic "+format,mimeType:`image/${format}`,byteSize:bytes.length,sha256:createHash("sha256").update(bytes).digest("hex")};
   expect((await request.post(endpoint,{data:intent})).status()).toBe(403);
   expect((await request.post(endpoint,{headers:{Origin:headers().Origin},data:intent})).status()).toBe(401);
   const started=await request.post(endpoint,{headers:headers(),data:intent});expect(started.status()).toBe(200);
   const result=await started.json(); uploads.push(result.uploadId);
   expect(await (await request.post(endpoint,{headers:headers(),data:intent})).json()).toEqual(result);
   const path=endpoint+"?uploadId="+result.uploadId;
   const pending=await (await request.get(endpoint,{headers:headers()})).json();
   expect(pending.items).toContainEqual({uploadId:result.uploadId,title:intent.title,mimeType:intent.mimeType,byteSize:bytes.length,sha256:intent.sha256});
   expect(JSON.stringify(pending)).not.toContain("object_key");
   expect(await (await request.get(endpoint,{headers:headers(1)})).json()).toEqual({items:[],nextCursor:null});
   expect((await request.get(endpoint+"?after=bad",{headers:headers()})).status()).toBe(400);

   expect(await (await request.get(path,{headers:headers()})).json()).toMatchObject({state:"pending",mediaId:null});
   expect((await request.get(path,{headers:headers(1)})).status()).toBe(403);
   expect((await request.get(path+"&uploadId="+result.uploadId,{headers:headers()})).status()).toBe(400);
   const put=(data:Buffer,i=0)=>request.put(path,{headers:{...headers(i),"Content-Type":"application/octet-stream"},data});
   expect((await put(bytes,1)).status()).toBe(403);
   expect((await put(Buffer.alloc(100001))).status()).toBe(413);
   expect((await put(Buffer.from("invalid"))).status()).toBe(400);
   const responses=await Promise.all([put(bytes),put(bytes)]);
   expect(responses.map(r=>r.status())).toEqual([200,200]);
   const completed=await responses[0].json();expect(await responses[1].json()).toEqual(completed);
   const status=await request.get(path,{headers:headers()});expect(status.headers()["cache-control"]).toBe("no-store");
   expect(await status.json()).toEqual({uploadId:result.uploadId,mediaId:completed.mediaId,state:"completed"});
   const binary=(await owner.query("SELECT object_key FROM app_internal.binary_objects WHERE resource_id=$1",[completed.mediaId])).rows[0];
   const stored=await request.get("http://127.0.0.1:55435/object/media/"+binary.object_key,{headers:storageHeaders});
   expect(await stored.body()).toEqual(bytes);
   expect((await (await request.get(endpoint,{headers:headers()})).json()).items).toEqual([]);

  }
  const extra=(await owner.query("SELECT app_internal.begin_media_upload($1,gen_random_uuid(),'Synthetic page '||n,'image/png',3,repeat('a',64)) AS id FROM generate_series(1,52) n",[createHash("sha256").update(tokens[0]).digest("hex")])).rows.map(row=>row.id);
  uploads.push(...extra);
  const page1=await (await request.get(endpoint,{headers:headers()})).json();
  expect(page1.items).toHaveLength(50);expect(page1.nextCursor).toBeTruthy();
  const page2=await (await request.get(endpoint+"?after="+page1.nextCursor,{headers:headers()})).json();
  expect(page2.items).toHaveLength(2);expect(page2.nextCursor).toBeNull();
  expect(new Set([...page1.items,...page2.items].map((row:{uploadId:string})=>row.uploadId))).toEqual(new Set(extra));
  await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE id=$1",[sessions[0]]);
  expect((await request.get(endpoint+"?uploadId="+uploads[0],{headers:headers()})).status()).toBe(401);
  expect((await request.get(endpoint,{headers:headers()})).status()).toBe(401);
 } finally {
  const keys=(await owner.query("SELECT object_key FROM m02.upload_items WHERE id=ANY($1::uuid[])",[uploads])).rows.map(r=>r.object_key);
  if(keys.length) expect((await request.delete("http://127.0.0.1:55435/object/media",{headers:storageHeaders,data:{prefixes:keys}})).status()).toBe(200);
  await owner.query("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id=ANY($1::uuid[]) AND revoked_at IS NULL",[users]);
  await owner.end();
 }
});
