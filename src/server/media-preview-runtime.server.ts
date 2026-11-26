import "server-only";
import { MediaPreviewService } from "../modules/m02/media/preview.server";
import { authRuntime } from "./auth-runtime.server";
import { createDatabase } from "./database.server";
import { mediaPreviewHandler } from "./media-preview-http.server";
import { PrivateStorage } from "./private-storage.server";

let handler: ReturnType<typeof mediaPreviewHandler> | undefined;

export function previewRuntime() {
  if (handler) return handler;
  const auth = authRuntime();
  const limits = {
    maxBytes: Number(process.env.MEDIA_MAX_UPLOAD_BYTES),
    maxPixels: Number(process.env.MEDIA_MAX_IMAGE_PIXELS),
    timeoutSeconds: Number(process.env.MEDIA_DECODE_TIMEOUT_SECONDS),
  };
  const storage = new PrivateStorage(
    process.env.SUPABASE_STORAGE_URL ?? "",
    async () => process.env.SUPABASE_STORAGE_SERVER_TOKEN ?? "",
    limits.maxBytes,
  );
  handler = mediaPreviewHandler({
    origin: auth.origin,
    sessions: auth.sessions,
    budgets: auth.pairing,
    previews: new MediaPreviewService(createDatabase(process.env.DATABASE_URL ?? ""), storage, limits, Number(process.env.MEDIA_PREVIEW_MAX_EDGE)),
  });
  return handler;
}
