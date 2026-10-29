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
    if (
      !["list", "create", "account_create", "account_download"].includes(action)
    )
      return json({ error: "not_found" }, 404);
    if (write !== (action === "create" || action === "account_create"))
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
      action === "account_create"
        ? "export_account_create"
        : action === "account_download"
          ? "export_account_download"
          : action === "list"
            ? "export_jobs_list"
            : "export_jobs_create";
    const budget = await auth.pairing.consumeRequest(match[1], budgetAction);
    if (!budget.allowed) {
      const response = json(
        { error: "rate_limited", retryAfter: budget.retry_after },
        429,
      );
      response.headers.set("Retry-After", String(budget.retry_after));
      return response;
    }
    if (action === "account_download") {
      const params = request.nextUrl.searchParams;
      if (
        params.getAll("artifactId").length !== 1 ||
        [...params.keys()].some((key) => key !== "artifactId")
      )
        return json({ error: "invalid_input" }, 400);
      const artifact = await auth.export.downloadAccountSection(
        match[1],
        params.get("artifactId"),
      );
      if (!artifact) return json({ error: "not_found" }, 404);
      if (!(await auth.sessions.actor(match[1])))
        return json({ error: "unauthenticated" }, 401);
      if (artifact.expires_at.getTime() <= Date.now())
        return json({ error: "not_found" }, 404);
      return new NextResponse(new Uint8Array(artifact.payload), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="ourspace-profile-preferences.json"',
          "Content-Length": String(artifact.payload.length),
          "Cache-Control": "no-store",
          Vary: "Cookie",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "no-referrer",
          "Content-Security-Policy": "sandbox",
        },
      });
    }
    if (request.nextUrl.search) return json({ error: "invalid_input" }, 400);
    if (action === "list")
      return json({ jobs: await auth.export.list(match[1]) });
    if (request.nextUrl.search) return json({ error: "invalid_input" }, 400);
    const input = await body(request);
    const record = input as Record<string, unknown>;
    if (action === "account_create") {
      if (
        Object.keys(record).length !== 1 ||
        !Object.hasOwn(record, "commandId")
      )
        return json({ error: "invalid_input" }, 400);
      return json({
        artifactId: await auth.export.createAccountSection(
          match[1],
          record.commandId,
        ),
        section: "m10.account_profile_preferences",
      });
    }
    const commandId = record.commandId as string;
    const scope = record.scope as string;
    if (action === "create")
      return json({
        job: await auth.export.create(match[1], commandId, scope),
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
