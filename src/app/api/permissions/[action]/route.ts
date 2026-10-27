import { NextRequest, NextResponse } from "next/server";
import { authRuntime } from "../../../../server/auth-runtime.server";
import { DatabaseUnavailableError } from "../../../../server/database.server";
import { AuthProviderError } from "../../../../modules/m10/auth/provider.server";
export const runtime = "nodejs";
type Context = { params: Promise<{ action: string }> };
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
function failure(error: unknown) {
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
      : reason === "denied" || reason === "mfa_required"
        ? 403
        : reason === "conflict"
          ? 409
          : 503,
  );
}
async function actor(request: NextRequest) {
  const auth = authRuntime();
  const match = /^([0-9a-f-]{36}):([A-Za-z0-9_-]{43})$/.exec(
    request.cookies.get("ourspace_session")?.value ?? "",
  );
  if (!match || !(await auth.sessions.actor(match[2]))) return null;
  return { auth, token: match[2] };
}
async function budget(
  session: NonNullable<Awaited<ReturnType<typeof actor>>>,
  action: string,
) {
  const result = await session.auth.pairing.consumeRequest(
    session.token,
    action,
  );
  if (result.allowed) return null;
  const response = json(
    { error: "rate_limited", retryAfter: result.retry_after },
    429,
  );
  response.headers.set("Retry-After", String(result.retry_after));
  return response;
}
async function body(request: NextRequest): Promise<Record<string, unknown>> {
  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  )
    throw new AuthProviderError("invalid_input");
  const reader = request.body?.getReader();
  if (!reader) throw new AuthProviderError("invalid_input");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.length;
      if (size > 4096) {
        await reader.cancel();
        throw new AuthProviderError("invalid_input");
      }
      chunks.push(part.value);
    }
    const value: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error();
    return value as Record<string, unknown>;
  } catch {
    throw new AuthProviderError("invalid_input");
  } finally {
    reader.releaseLock();
  }
}
function string(input: Record<string, unknown>, key: string) {
  if (typeof input[key] !== "string")
    throw new AuthProviderError("invalid_input");
  return input[key] as string;
}
export async function GET(request: NextRequest, context: Context) {
  if ((await context.params).action !== "grants")
    return json({ error: "not_found" }, 404);
  try {
    if (request.headers.get("sec-fetch-site") === "cross-site")
      return json({ error: "forbidden" }, 403);
    const session = await actor(request);
    if (!session) return json({ error: "unauthenticated" }, 401);
    const limited = await budget(session, "permission_list");
    if (limited) return limited;
    const query = request.nextUrl.searchParams;
    if (query.size !== 1 || !query.has("resourceId"))
      throw new AuthProviderError("invalid_input");
    return json({
      grants: await session.auth.permissions.grants(
        session.token,
        query.get("resourceId")!,
      ),
    });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: NextRequest, context: Context) {
  const { action } = await context.params;
  if (action !== "grant" && action !== "revoke")
    return json({ error: "not_found" }, 404);
  try {
    const auth = authRuntime();
    if (
      request.headers.get("origin") !== auth.origin ||
      request.headers.get("sec-fetch-site") === "cross-site"
    )
      return json({ error: "forbidden" }, 403);
    const session = await actor(request);
    if (!session) return json({ error: "unauthenticated" }, 401);
    const limited = await budget(session, `permission_${action}`);
    if (limited) return limited;
    const input = await body(request);
    if (typeof input.version !== "number")
      throw new AuthProviderError("invalid_input");
    const common = {
      commandId: string(input, "commandId"),
      resourceId: string(input, "resourceId"),
      version: input.version,
      confirmed: input.confirmed === true,
    };
    if (action === "revoke")
      return json(
        await auth.permissions.revoke(session.token, {
          ...common,
          grantId: string(input, "grantId"),
        }),
      );
    const role = string(input, "role");
    if (role !== "viewer" && role !== "commenter" && role !== "editor")
      throw new AuthProviderError("invalid_input");
    return json(
      await auth.permissions.grant(session.token, {
        ...common,
        spaceId: string(input, "spaceId"),
        recipientId: string(input, "recipientId"),
        role,
      }),
    );
  } catch (error) {
    return failure(error);
  }
}
