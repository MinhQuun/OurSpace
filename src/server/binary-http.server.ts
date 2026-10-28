import "server-only";
import type { SessionService } from "../modules/m10/auth/session.server";
import type { PairingService } from "../modules/m10/pairing/service.server";
import type { BinaryDownloadService } from "./binary-download.server";

/** Bind to a domain's authorized BinaryDownloadService; never bypass its policy. */
export function binaryDownloadHandler(dependencies: {
  origin: string;
  sessions: Pick<SessionService, "actor">;
  budgets: Pick<PairingService, "consumeRequest">;
  downloads: BinaryDownloadService;
}) {
  const origin = new URL(dependencies.origin);
  if (origin.origin !== dependencies.origin) throw new Error("Invalid download origin");
  return async (request: Request, binaryId: string): Promise<Response> => {
    const headers = new Headers({
      "Cache-Control": "private, no-store, max-age=0",
      Vary: "Cookie", "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer", "Cross-Origin-Resource-Policy": "same-origin",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    });
    const error = (status: number, code: string) => Response.json({error:code},{status,headers});
    try {
      if (request.method !== "GET") {
        headers.set("Allow","GET"); return error(405,"method_not_allowed");
      }
      if (request.headers.get("sec-fetch-site") === "cross-site" ||
          (request.headers.has("origin") && request.headers.get("origin") !== origin.origin))
        return error(403,"forbidden");
      const cookies = (request.headers.get("cookie") ?? "").split(";")
        .map(value=>value.trim()).filter(value=>value.startsWith("ourspace_session="));
      const match = cookies.length === 1
        ? /^ourspace_session=[0-9a-f-]{36}:([A-Za-z0-9_-]{43})$/.exec(cookies[0]) : null;
      if (!match || !(await dependencies.sessions.actor(match[1]))) return error(401,"unauthenticated");
      const budget = await dependencies.budgets.consumeRequest(match[1],"binary_download");
      if (!budget.allowed) {
        headers.set("Retry-After",String(budget.retry_after)); return error(429,"rate_limited");
      }
      if (new URL(request.url).search || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(binaryId))
        return error(400,"invalid_input");
      // Range delivery needs its own domain/streaming gate; do not leak file size.
      if (request.headers.has("range")) return error(416,"range_not_supported");
      const bytes = await dependencies.downloads.read(match[1],binaryId,request.signal);
      if (!bytes) return error(404,"not_found");
      headers.set("Content-Type","application/octet-stream");
      headers.set("Content-Disposition",'attachment; filename="download.bin"');
      headers.set("Content-Length",String(bytes.length));
      return new Response(new Uint8Array(bytes),{status:200,headers});
    } catch { return error(503,"unavailable"); }
  };
}
