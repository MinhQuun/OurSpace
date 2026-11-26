import "server-only";
import type { MediaUploadService } from "../modules/m02/media/upload.server";
import { InvalidMediaError } from "../modules/m02/media/validate-image";
import { AuthProviderError } from "../modules/m10/auth/provider.server";
import { DatabaseUnavailableError } from "./database.server";
import type { SessionService } from "../modules/m10/auth/session.server";
import type { PairingService } from "../modules/m10/pairing/service.server";
export function mediaUploadHandler(d: { origin: string; maxBytes: number; uploads: MediaUploadService;
 sessions: Pick<SessionService,"actor">; budgets: Pick<PairingService,"consumeRequest"> }) {
 if (new URL(d.origin).origin !== d.origin || !Number.isSafeInteger(d.maxBytes) || d.maxBytes < 1) throw new Error("Invalid upload config");
 return async (request: Request): Promise<Response> => {
  const headers = new Headers({"Cache-Control":"no-store",Vary:"Cookie","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer"});
  const json = (value: unknown,status=200) => Response.json(value,{status,headers});
  try {
   const method=request.method;
   if (!["POST","GET","PUT"].includes(method)) { headers.set("Allow","GET, POST, PUT"); return json({error:"method_not_allowed"},405); }
   const origin=request.headers.get("origin");
   if (request.headers.get("sec-fetch-site")==="cross-site" || (method!=="GET" ? origin!==d.origin : origin!==null && origin!==d.origin)) return json({error:"forbidden"},403);
   const cookies=(request.headers.get("cookie")??"").split(";").map(s=>s.trim()).filter(s=>s.startsWith("ourspace_session="));
   const match=cookies.length===1 ? /^ourspace_session=[0-9a-f-]{36}:([A-Za-z0-9_-]{43})$/.exec(cookies[0]) : null;
   if (!match || !(await d.sessions.actor(match[1]))) return json({error:"unauthenticated"},401);
   const action=method==="POST" ? "media_upload_begin" : method==="GET" ? "media_upload_status" : "media_upload_bytes";
   const budget=await d.budgets.consumeRequest(match[1],action);
   if (!budget.allowed) { headers.set("Retry-After",String(budget.retry_after)); return json({error:"rate_limited"},429); }
   const url=new URL(request.url), ids=url.searchParams.getAll("uploadId");
   if (method==="POST" ? !!url.search : ids.length!==1 || [...url.searchParams.keys()].some(k=>k!=="uploadId")) return json({error:"invalid_input"},400);
   if (method==="GET") return json(await d.uploads.status(match[1],ids[0]));
   if (request.headers.get("content-type")?.split(";")[0].trim() !== (method==="POST" ? "application/json" : "application/octet-stream")) return json({error:"invalid_input"},400);
   if (method==="PUT") await d.uploads.status(match[1],ids[0]);
   const limit=method==="POST" ? 4096 : d.maxBytes;
   const length=request.headers.get("content-length");
   if (length!==null && (!/^\d+$/.test(length) || Number(length)>limit)) return json({error:"too_large"},413);
   const reader=request.body?.getReader(); if (!reader) return json({error:"invalid_input"},400);
   const chunks: Uint8Array[]=[]; let size=0;
   try { for (;;) { const part=await reader.read(); if (part.done) break; size+=part.value.length;
    if (size>limit) { await reader.cancel(); return json({error:"too_large"},413); } chunks.push(part.value); }
   } finally { reader.releaseLock(); }
   const bytes=Buffer.concat(chunks,size);
   if (method==="PUT") return json(await d.uploads.upload(match[1],ids[0],bytes,request.signal));
   let input: unknown; try { input=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes)); } catch { return json({error:"invalid_input"},400); }
   return json(await d.uploads.begin(match[1],input as Parameters<MediaUploadService["begin"]>[1]));
  } catch (error) {
   const reason=error instanceof InvalidMediaError ? "invalid_input" : error instanceof AuthProviderError ? error.kind : error instanceof DatabaseUnavailableError ? error.reason : "unavailable";
   return json({error:reason},reason==="invalid_input" ? 400 : reason==="denied" ? 403 : reason==="conflict" ? 409 : 503);
  }
 };
}
