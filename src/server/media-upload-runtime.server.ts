import "server-only";
import { authRuntime } from "./auth-runtime.server";
import { createDatabase } from "./database.server";
import { PrivateStorage } from "./private-storage.server";
import { MediaUploadService } from "../modules/m02/media/upload.server";
import { mediaUploadHandler } from "./media-upload-http.server";
let handler: ReturnType<typeof mediaUploadHandler> | undefined;
export function uploadRuntime() {
 if (handler) return handler;
 const auth=authRuntime();
 const limits={maxBytes:Number(process.env.MEDIA_MAX_UPLOAD_BYTES),maxPixels:Number(process.env.MEDIA_MAX_IMAGE_PIXELS),timeoutSeconds:Number(process.env.MEDIA_DECODE_TIMEOUT_SECONDS)};
 const storage=new PrivateStorage(process.env.SUPABASE_STORAGE_URL??"",async()=>process.env.SUPABASE_STORAGE_SERVER_TOKEN??"",limits.maxBytes);
 handler=mediaUploadHandler({origin:auth.origin,maxBytes:limits.maxBytes,sessions:auth.sessions,budgets:auth.pairing,
 uploads:new MediaUploadService(createDatabase(process.env.DATABASE_URL??""),storage,limits)});
 return handler;
}
