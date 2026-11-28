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
export const GET = async (request: NextRequest) => {
  try {
    const auth = authRuntime();
    const origin = request.headers.get("origin");
    if (
      request.headers.get("sec-fetch-site") === "cross-site" ||
      (origin !== null && origin !== auth.origin)
    )
      return json({ error: "forbidden" }, 403);
    const cookies=(request.headers.get("cookie")??"").split(";").map(value=>value.trim()).filter(value=>value.startsWith("ourspace_session="));
    const match=cookies.length===1 ? /^ourspace_session=[0-9a-f-]{36}:([A-Za-z0-9_-]{43})$/.exec(cookies[0]) : null;
    if (!match || !(await auth.sessions.actor(match[1])))
      return json({ error: "unauthenticated" }, 401);
    const budget = await auth.pairing.consumeRequest(match[1], "media_list");
    if (!budget.allowed) {
      const response = json(
        { error: "rate_limited", retryAfter: budget.retry_after },
        429,
      );
      response.headers.set("Retry-After", String(budget.retry_after));
      return response;
    }
    const params = request.nextUrl.searchParams;
    if([...params.keys()].some(key=>key!=="after")||params.getAll("after").length>1) return json({error:"invalid_input"},400);
    return json(await auth.media.uploaders(match[1],params.get("after")??undefined));
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
};

