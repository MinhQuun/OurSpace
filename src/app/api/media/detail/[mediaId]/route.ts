import { authRuntime } from "../../../../../server/auth-runtime.server";
import { AuthProviderError } from "../../../../../modules/m10/auth/provider.server";
import { DatabaseUnavailableError } from "../../../../../server/database.server";

export const runtime = "nodejs";
const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const cookiePattern = new RegExp(`^ourspace_session=${uuid}:([A-Za-z0-9_-]{43})$`);

async function handle(request: Request, { params }: { params: Promise<{ mediaId: string }> }) {
  const headers = new Headers({
    "Cache-Control": "no-store", Vary: "Cookie", "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer", "Cross-Origin-Resource-Policy": "same-origin",
  });
  const json = (value: unknown, status = 200) => Response.json(value, { status, headers });
  try {
    const write = request.method === "PATCH";
    const auth = authRuntime();
    const origin = request.headers.get("origin");
    if (["cross-site", "same-site"].includes(request.headers.get("sec-fetch-site") ?? "") ||
      (write ? origin !== auth.origin : origin !== null && origin !== auth.origin)) return json({ error: "forbidden" }, 403);
    const cookies = (request.headers.get("cookie") ?? "").split(";").map(value => value.trim())
      .filter(value => value.startsWith("ourspace_session="));
    const session = cookies.length === 1 ? cookiePattern.exec(cookies[0])?.[1] : undefined;
    if (!session || !(await auth.sessions.actor(session))) return json({ error: "unauthenticated" }, 401);
    const { mediaId } = await params;
    if (new URL(request.url).search || !new RegExp(`^${uuid}$`, "i").test(mediaId))
      return json({ error: "invalid_input" }, 400);
    // Metadata reads share the bounded list budget; adding an endpoint must not multiply it.
    const budget = await auth.pairing.consumeRequest(session, write ? "media_share" : "media_list");
    if (!budget.allowed) {
      headers.set("Retry-After", String(budget.retry_after));
      return json({ error: "rate_limited" }, 429);
    }
    if (write) {
      // Transport allocation bound, not a business quota; enforce while streaming too.
      const limit = 16384;
      if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json")
        return json({ error: "invalid_input" }, 400);
      const length = request.headers.get("content-length");
      if (length !== null && (!/^[0-9]+$/.test(length) || Number(length) > limit))
        return json({ error: "too_large" }, 413);
      const reader = request.body?.getReader();
      if (!reader) return json({ error: "invalid_input" }, 400);
      const chunks: Uint8Array[] = []; let size = 0;
      try {
        for (;;) {
          const part = await reader.read(); if (part.done) break;
          size += part.value.byteLength;
          if (size > limit) { await reader.cancel(); return json({ error: "too_large" }, 413); }
          chunks.push(part.value);
        }
      } finally { reader.releaseLock(); }
      let input: unknown;
      try { input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks, size))); }
      catch { return json({ error: "invalid_input" }, 400); }
      return json(await auth.media.updateMetadata(session, mediaId, input));
    }
    const media = await auth.media.detail(session, mediaId);
    return media ? json({ media }) : json({ error: "not_found" }, 404);
  } catch (error) {
    const reason = error instanceof AuthProviderError ? error.kind : error instanceof DatabaseUnavailableError ? error.reason : "unavailable";
    if (reason === "invalid_input") return json({ error: "invalid_input" }, 400);
    if (reason === "conflict") return json({ error: "conflict" }, 409);
    if (request.method === "PATCH" && reason === "denied") return json({ error: "denied" }, 403);
    if ((error instanceof AuthProviderError && error.kind === "denied") ||
      (error instanceof DatabaseUnavailableError && error.reason === "denied")) return json({ error: "unauthenticated" }, 401);
    return json({ error: "unavailable" }, 503);
  }
}

export const GET = handle;
export const PATCH = handle;
