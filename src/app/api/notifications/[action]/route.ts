import { NextRequest, NextResponse } from "next/server";
import { authRuntime } from "../../../../server/auth-runtime.server";
import { AuthProviderError } from "../../../../modules/m10/auth/provider.server";
import { DatabaseUnavailableError } from "../../../../server/database.server";
import type { NotificationPreferencesUpdate } from "../../../../modules/m10/notifications/service.server";
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
    if (
      ![
        "list",
        "count",
        "read",
        "read_all",
        "hide",
        "preferences",
        "preferences_update",
      ].includes(action)
    )
      return json({ error: "not_found" }, 404);
    if (
      write !==
      ["read", "read_all", "hide", "preferences_update"].includes(action)
    )
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
      action === "read"
        ? "notifications_read"
        : action === "read_all"
          ? "notifications_read_all"
          : action === "hide"
            ? "notifications_hide"
            : action === "list"
              ? "notifications_list"
              : action === "count"
                ? "notifications_count"
                : action === "preferences"
                  ? "notifications_preferences"
                  : "notifications_preferences_update";
    const budget = await auth.pairing.consumeRequest(match[1], budgetAction);
    if (!budget.allowed) {
      const response = json(
        { error: "rate_limited", retryAfter: budget.retry_after },
        429,
      );
      response.headers.set("Retry-After", String(budget.retry_after));
      return response;
    }
    if (action === "list") {
      const params = request.nextUrl.searchParams;
      const keys = [...params.keys()];
      if (keys.some((key) => !["limit", "includeRead"].includes(key)))
        return json({ error: "invalid_input" }, 400);
      const limit = params.get("limit");
      if (limit !== null && !/^[1-9][0-9]{0,2}$/.test(limit))
        return json({ error: "invalid_input" }, 400);
      const includeRead = params.get("includeRead");
      if (
        includeRead !== null &&
        includeRead !== "true" &&
        includeRead !== "false"
      )
        return json({ error: "invalid_input" }, 400);
      return json({
        notifications: await auth.notifications.list(
          match[1],
          limit ? Number(limit) : 50,
          includeRead === "false" ? false : true,
        ),
      });
    }
    if (action === "count")
      return json({ unread: await auth.notifications.count(match[1]) });
    if (action === "preferences")
      return json({
        preferences: await auth.notifications.preferences(match[1]),
      });
    if (request.nextUrl.search) return json({ error: "invalid_input" }, 400);
    const input = await body(request);
    if (action === "read_all") {
      return json({ updated: await auth.notifications.markAllRead(match[1]) });
    }
    const record = input as Record<string, unknown>;
    if (action === "read")
      return json({
        updated: await auth.notifications.markRead(
          match[1],
          record.notificationId as string,
        ),
      });
    if (action === "hide")
      return json({
        updated: await auth.notifications.hide(
          match[1],
          record.notificationId as string,
        ),
      });
    return json(
      await auth.notifications.updatePreferences(
        match[1],
        input as NotificationPreferencesUpdate,
      ),
    );
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
