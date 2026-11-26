import { previewHeaders } from "../../../../../server/media-preview-http.server";
import { previewRuntime } from "../../../../../server/media-preview-runtime.server";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ mediaId: string }> }) {
  try {
    return await previewRuntime("viewer")(request, (await params).mediaId);
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503, headers: previewHeaders() });
  }
}
