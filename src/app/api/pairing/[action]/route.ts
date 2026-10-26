import { NextRequest, NextResponse } from "next/server";
import { authRuntime } from "../../../../server/auth-runtime.server";
import { DatabaseUnavailableError } from "../../../../server/database.server";
import { PairingError } from "../../../../modules/m10/pairing/service.server";
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
    error instanceof PairingError
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
    throw new PairingError("invalid_input");
  const reader = request.body?.getReader();
  if (!reader) throw new PairingError("invalid_input");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.length;
      if (size > 4096) {
        await reader.cancel();
        throw new PairingError("invalid_input");
      }
      chunks.push(part.value);
    }
    const value: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error();
    return value as Record<string, unknown>;
  } catch {
    throw new PairingError("invalid_input");
  } finally {
    reader.releaseLock();
  }
}
function string(input: Record<string, unknown>, key: string) {
  if (typeof input[key] !== "string") throw new PairingError("invalid_input");
  return input[key] as string;
}
export async function GET(request: NextRequest, context: Context) {
  if ((await context.params).action !== "list")
    return json({ error: "not_found" }, 404);
  try {
    const session = await actor(request);
    if (!session) return json({ error: "unauthenticated" }, 401);
    const limited = await budget(session, "list");
    if (limited) return limited;
    return json({
      invitations: await session.auth.pairing.list(session.token),
    });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: NextRequest, context: Context) {
  const { action } = await context.params;
  if (
    !["create", "inspect", "accept", "reject", "revoke", "confirm"].includes(
      action,
    )
  )
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
    const limited = await budget(session, action);
    if (limited) return limited;
    const input = await body(request);
    const pairing = auth.pairing;
    if (action === "create") {
      if (input.confirmed !== true) throw new PairingError("invalid_input");
      // Server-generated proposal; list/revoke remains available if response is lost.
      return json(await pairing.create(session.token), 201);
    }
    const id = string(input, "id");
    const capability =
      input.token === undefined ? undefined : string(input, "token");
    if (action === "inspect")
      return json(await pairing.inspect(session.token, id, capability));
    const command = string(input, "commandId");
    if (action === "confirm") {
      if (typeof input.version !== "number")
        throw new PairingError("invalid_input");
      return json(
        await pairing.confirm(
          session.token,
          command,
          id,
          string(input, "recipientId"),
          input.version,
          input.confirmed === true,
        ),
      );
    }
    return json(
      await pairing.decide(
        session.token,
        command,
        id,
        action as "accept" | "reject" | "revoke",
        input.confirmed === true,
        capability,
      ),
    );
  } catch (error) {
    return failure(error);
  }
}
