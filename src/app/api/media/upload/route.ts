import { uploadRuntime } from "../../../../server/media-upload-runtime.server";
export const runtime="nodejs";
async function handle(request: Request) {
 try { return await uploadRuntime()(request); }
 catch { return Response.json({error:"unavailable"},{status:503,headers:{"Cache-Control":"no-store"}}); }
}
export const POST=handle;
export const GET=handle;
export const PUT=handle;
