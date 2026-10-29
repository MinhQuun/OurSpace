import { NextRequest, NextResponse } from "next/server";
import { authRuntime } from "../../../../server/auth-runtime.server";
import { AuthProviderError } from "../../../../modules/m10/auth/provider.server";
import { DatabaseUnavailableError } from "../../../../server/database.server";
import type { ShareProfileField, RevokeProfileField, CoupleProfileUpdate } from "../../../../modules/m10/profile/service.server";
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
    // The service validates all keys and primitives; no target user can be passed.
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
    if (!["partner", "grants", "share", "revoke", "couple", "couple_history", "couple_update"].includes(action)) return json({ error: "not_found" }, 404);
    if (write !== ["share", "revoke", "couple_update"].includes(action)) return json({ error: "method_not_allowed" }, 405);
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
    const budget = await auth.pairing.consumeRequest(
      match[1],
      `profile_${action}`,
    );
    if (!budget.allowed) {
      const response = json(
        { error: "rate_limited", retryAfter: budget.retry_after },
        429,
      );
      response.headers.set("Retry-After", String(budget.retry_after));
      return response;
    }
    if (action === "couple" || action === "couple_history") {
      const params = request.nextUrl.searchParams;
      const allowed = action === "couple" ? ["spaceId"] : ["spaceId", "before"];
      if (params.getAll("spaceId").length !== 1 || params.getAll("before").length > 1 ||
        [...params.keys()].some(key => !allowed.includes(key))) return json({ error: "invalid_input" }, 400);
      const spaceId = params.get("spaceId")!;
      const cursor = params.get("before");
      if (cursor !== null && !/^[1-9][0-9]*$/.test(cursor)) return json({ error: "invalid_input" }, 400);
      if (action === "couple") return json({ profile: await auth.profile.couple(match[1], spaceId) });
      return json({ revisions: await auth.profile.coupleHistory(match[1], spaceId, cursor === null ? null : Number(cursor)) });
    }
    if (action === "partner") {
      const entries = [...request.nextUrl.searchParams.entries()];
      if (entries.length !== 1 || entries[0][0] !== "spaceId") return json({ error: "invalid_input" }, 400);
      return json({ profile: await auth.profile.partner(match[1], entries[0][1]) });
    }
    if (request.nextUrl.search) return json({ error: "invalid_input" }, 400);
    if (action === "grants") return json({ grants: await auth.profile.grants(match[1]) });
    const input = await body(request);
    if (action === "couple_update") return json(await auth.profile.updateCouple(match[1], input as CoupleProfileUpdate));
    return json(action === "share"
      ? await auth.profile.shareField(match[1], input as ShareProfileField)
      : await auth.profile.revokeField(match[1], input as RevokeProfileField));
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
export const GET = (request: NextRequest, context: Context) => handle(request, context, false);
export const POST = (request: NextRequest, context: Context) => handle(request, context, true);
