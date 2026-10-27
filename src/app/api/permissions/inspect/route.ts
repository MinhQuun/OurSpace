import { NextRequest, NextResponse } from "next/server";
import { authRuntime } from "../../../../server/auth-runtime.server";
import { AuthProviderError } from "../../../../modules/m10/auth/provider.server";
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
export async function GET(request: NextRequest) {
  try {
    if (request.headers.get("sec-fetch-site") === "cross-site")
      return json({ error: "forbidden" }, 403);
    const auth = authRuntime();
    const match = /^([0-9a-f-]{36}):([A-Za-z0-9_-]{43})$/.exec(
      request.cookies.get("ourspace_session")?.value ?? "",
    );
    if (!match || !(await auth.sessions.actor(match[2])))
      return json({ error: "unauthenticated" }, 401);
    const budget = await auth.pairing.consumeRequest(
      match[2],
      "permission_inspect",
    );
    if (!budget.allowed) {
      const response = json(
        { error: "rate_limited", retryAfter: budget.retry_after },
        429,
      );
      response.headers.set("Retry-After", String(budget.retry_after));
      return response;
    }
    const query = request.nextUrl.searchParams;
    if (query.size !== 1 || !query.has("resourceId"))
      return json({ error: "invalid_input" }, 400);
    const inspection = await auth.permissions.inspect(
      match[2],
      query.get("resourceId")!,
    );
    return inspection
      ? json({ inspection })
      : json({ error: "not_found" }, 404);
  } catch (error) {
    if (error instanceof AuthProviderError && error.kind === "invalid_input")
      return json({ error: "invalid_input" }, 400);
    return json({ error: "unavailable" }, 503);
  }
}
