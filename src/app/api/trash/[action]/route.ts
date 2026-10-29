import { NextRequest, NextResponse } from "next/server";
import { authRuntime } from "../../../../server/auth-runtime.server";
import { AuthProviderError } from "../../../../modules/m10/auth/provider.server";
import { DatabaseUnavailableError } from "../../../../server/database.server";
export const runtime = "nodejs";
const json = (value: unknown, status = 200) =>
  NextResponse.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      Vary: "Cookie",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
async function body(request: NextRequest): Promise<unknown> {
  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  )
    throw new AuthProviderError("invalid_input");
  const reader = request.body?.getReader();
  if (!reader) throw new AuthProviderError("invalid_input");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 4_000) {
        await reader.cancel();
        throw new Error();
      }
      chunks.push(part.value);
    }
    const value: unknown = JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)),
    );
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error();
    return value;
  } catch {
    throw new AuthProviderError("invalid_input");
  } finally {
    reader.releaseLock();
  }
}
type Context = { params: Promise<{ action: string }> };
async function handle(request: NextRequest, context: Context, write: boolean) {
  try {
    const { action } = await context.params;
    if (!["list", "restore", "purge", "purge_expired"].includes(action))
      return json({ error: "not_found" }, 404);
    if (write !== ["restore", "purge", "purge_expired"].includes(action))
      return json({ error: "method_not_allowed" }, 405);
    const auth = authRuntime();
    const origin = request.headers.get("origin");
    if (
      request.headers.get("sec-fetch-site") === "cross-site" ||
      (write
        ? origin !== auth.origin
        : origin !== null && origin !== auth.origin)
    )
      return json({ error: "forbidden" }, 403);
    const match = /^[0-9a-f-]{36}:([A-Za-z0-9_-]{43})$/.exec(
      request.cookies.get("ourspace_session")?.value ?? "",
    );
    if (!match || !(await auth.sessions.actor(match[1])))
      return json({ error: "unauthenticated" }, 401);
    const budgetAction =
      action === "list"
        ? "trash_list"
        : action === "restore"
          ? "trash_restore"
          : action === "purge"
            ? "trash_purge"
            : "trash_purge_expired";
    const budget = await auth.pairing.consumeRequest(match[1], budgetAction);
    if (!budget.allowed) {
      const response = json(
        { error: "rate_limited", retryAfter: budget.retry_after },
        429,
      );
      response.headers.set("Retry-After", String(budget.retry_after));
      return response;
    }
    if (action === "list")
      return json({ items: await auth.trash.list(match[1]) });
    if (request.nextUrl.search) return json({ error: "invalid_input" }, 400);
    const input = await body(request);
    const record = input as Record<string, unknown>;
    if (action === "purge_expired")
      return json({ purged: await auth.trash.purgeExpired(match[1]) });
    const commandId = record.commandId as string;
    const itemId = record.itemId as string;
    if (action === "restore")
      return json({
        restored: await auth.trash.restore(match[1], commandId, itemId),
      });
    return json({
      purged: await auth.trash.purge(match[1], commandId, itemId),
    });
  } catch (error) {
    const reason =
      error instanceof AuthProviderError
        ? error.kind
        : error instanceof DatabaseUnavailableError
          ? error.reason
          : "unavailable";
    return json(
      { error: reason },
      reason === "invalid_input"
        ? 400
        : reason === "denied"
          ? 403
          : reason === "conflict"
            ? 409
            : 503,
    );
  }
}
export const GET = (request: NextRequest, context: Context) =>
  handle(request, context, false);
export const POST = (request: NextRequest, context: Context) =>
  handle(request, context, true);
