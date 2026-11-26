import "server-only";
import type { MediaPreviewService } from "../modules/m02/media/preview.server";
import type { SessionService } from "../modules/m10/auth/session.server";
import type { PairingService } from "../modules/m10/pairing/service.server";
import { DatabaseUnavailableError } from "./database.server";

const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const mediaIdPattern = new RegExp(`^${uuid}$`, "i");
const sessionPattern = new RegExp(`^ourspace_session=${uuid}:([A-Za-z0-9_-]{43})$`);

export function previewHeaders() {
  return new Headers({
    "Cache-Control": "no-store",
    Vary: "Cookie",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Cross-Origin-Resource-Policy": "same-origin",
  });
}

export function mediaPreviewHandler(d: {
  origin: string;
  sessions: Pick<SessionService, "actor">;
  budgets: Pick<PairingService, "consumeRequest">;
  previews: Pick<MediaPreviewService, "read">;
}) {
  return async (request: Request): Promise<Response> => {
    const headers = previewHeaders();
    const fail = (error: string, status: number) =>
      Response.json({ error }, { status, headers });
    try {
      const origin = request.headers.get("origin");
      const site = request.headers.get("sec-fetch-site");
      if (site === "cross-site" || site === "same-site" || (origin !== null && origin !== d.origin))
        return fail("forbidden", 403);

      const cookies = (request.headers.get("cookie") ?? "").split(";")
        .map((value) => value.trim()).filter((value) => value.startsWith("ourspace_session="));
      const session = cookies.length === 1 ? sessionPattern.exec(cookies[0])?.[1] : undefined;
      if (!session || !(await d.sessions.actor(session))) return fail("unauthenticated", 401);

      const params = new URL(request.url).searchParams;
      const ids = params.getAll("mediaId");
      if (ids.length !== 1 || !mediaIdPattern.test(ids[0]) || [...params.keys()].some((key) => key !== "mediaId"))
        return fail("invalid_input", 400);

      const budget = await d.budgets.consumeRequest(session, "media_preview");
      if (!budget.allowed) {
        headers.set("Retry-After", String(budget.retry_after));
        return fail("rate_limited", 429);
      }

      const bytes = await d.previews.read(session, ids[0], request.signal);
      // Indistinguishable for absent, inaccessible, unsupported, or no-longer-readable media.
      if (!bytes || request.signal.aborted) return fail("not_found", 404);
      headers.set("Content-Type", "image/webp");
      return new Response(Uint8Array.from(bytes), { headers });
    } catch (error) {
      if (error instanceof DatabaseUnavailableError && error.reason === "denied")
        return fail("unauthenticated", 401);
      return fail("unavailable", 503);
    }
  };
}
