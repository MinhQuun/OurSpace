import { previewHeaders } from "../../../../server/media-preview-http.server";
import { previewRuntime } from "../../../../server/media-preview-runtime.server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    return await previewRuntime()(request);
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503, headers: previewHeaders() });
  }
}
