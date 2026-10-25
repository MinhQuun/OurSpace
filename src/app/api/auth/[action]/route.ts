import { NextRequest, NextResponse } from "next/server";
import { authRuntime } from "../../../../server/auth-runtime.server";
import { AuthProviderError } from "../../../../modules/m10/auth/provider.server";
import type { SecondFactor } from "../../../../modules/m10/auth/session.server";

import {
  RecoveryEnvelopeCodec,
  RecoveryEnvelopeError,
} from "../../../../modules/m10/auth/recovery-envelope.server";

export const runtime = "nodejs";
const cookieName = "ourspace_session";
const mfaActions = [
  "mfa-start",
  "mfa-verify",
  "mfa-recovery",
  "mfa-replace-recovery",
  "mfa-acknowledge",
  "mfa-cancel",
  "mfa-prepare-removal",
  "mfa-resume-removal",
];
const recoveryCookie = "ourspace_mfa_recovery";
const removalCookie = "ourspace_mfa_removal";
function receiptCookie(request: NextRequest, name: string) {
  const match = /^([0-9a-f-]{36}):([A-Za-z0-9_-]{43})$/.exec(
    request.cookies.get(name)?.value ?? "",
  );
  return match ? { enrollmentId: match[1], receipt: match[2] } : null;
}
const json = (value: unknown, status = 200) =>
  NextResponse.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      Vary: "Cookie",
      "X-Content-Type-Options": "nosniff",
    },
  });
type Context = { params: Promise<{ action: string }> };

function sessionCookie(request: NextRequest) {
  const value = request.cookies.get(cookieName)?.value ?? "";
  const match = /^([0-9a-f-]{36}):([A-Za-z0-9_-]{43})$/.exec(value);
  return match ? { id: match[1], token: match[2] } : null;
}

async function body(request: NextRequest): Promise<Record<string, unknown>> {
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
    const result: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!result || typeof result !== "object" || Array.isArray(result))
      throw new Error();
    return result as Record<string, unknown>;
  } catch {
    throw new AuthProviderError("invalid_input");
  } finally {
    reader.releaseLock();
  }
}

export async function GET(request: NextRequest, context: Context) {
  const { action } = await context.params;
  if (
    !["session", "sessions", "mfa-status", "mfa-removal-state"].includes(action)
  )
    return json({ error: "not_found" }, 404);
  try {
    if (action === "mfa-removal-state")
      return json({ pending: Boolean(receiptCookie(request, removalCookie)) });
    const cookie = sessionCookie(request);
    const actor = cookie
      ? await authRuntime().sessions.actor(cookie.token)
      : null;
    if (!actor || !cookie) return json({ error: "unauthenticated" }, 401);
    if (action === "mfa-status")
      return json({ enrollment: await authRuntime().mfa.status(cookie.token) });
    return action === "sessions"
      ? json({ sessions: await authRuntime().sessions.list(cookie.token) })
      : json({ accountId: actor });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}

export async function POST(request: NextRequest, context: Context) {
  const { action } = await context.params;
  if (
    ![
      "signup",
      "login",
      "logout",
      "revoke-session",
      "revoke-other-sessions",
      ...mfaActions,
      "password-recovery",
      "password-prepare",
      "password-complete",
    ].includes(action)
  )
    return json({ error: "not_found" }, 404);
  try {
    const auth = authRuntime();
    if (
      request.headers.get("origin") !== auth.origin ||
      request.headers.get("sec-fetch-site") === "cross-site"
    ) {
      return json({ error: "forbidden" }, 403);
    }
    if (action === "logout") {
      const cookie = sessionCookie(request);
      if (cookie) await auth.sessions.revoke(cookie.token, cookie.id);
      const response = json({ ok: true });
      response.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: auth.secure,
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });
      return response;
    }
    if (action === "revoke-session" || action === "revoke-other-sessions") {
      const cookie = sessionCookie(request);
      if (!cookie || !(await auth.sessions.actor(cookie.token)))
        return json({ error: "unauthenticated" }, 401);
      if (action === "revoke-other-sessions")
        return json({
          revoked: await auth.sessions.revokeOthers(cookie.token),
        });
      const input = await body(request);
      if (typeof input.sessionId !== "string")
        throw new AuthProviderError("invalid_input");
      return json({
        revoked: await auth.sessions.revoke(cookie.token, input.sessionId),
      });
    }
    const input = await body(request);
    if (
      ["password-recovery", "password-prepare", "password-complete"].includes(
        action,
      )
    ) {
      // Validate configuration before consuming any one-time email proof.
      const codec = new RecoveryEnvelopeCodec(
        process.env.RECOVERY_COOKIE_KEY ?? "",
        auth.origin,
      );
      const options = {
        httpOnly: true,
        secure: auth.secure,
        sameSite: "strict" as const,
        path: "/api/auth",
      };
      const name = "ourspace_password_recovery";
      if (action === "password-recovery") {
        if (typeof input.email !== "string")
          throw new AuthProviderError("invalid_input");
        try {
          await auth.provider.requestPasswordRecovery(input.email);
        } catch (error) {
          // Hide account existence and per-address provider cooldown responses.
          if (!(error instanceof AuthProviderError) || error.kind !== "denied")
            throw error;
        }
        return json({ accepted: true }, 202);
      }
      if (action === "password-prepare") {
        if (typeof input.tokenHash !== "string")
          throw new AuthProviderError("invalid_input");
        const factor = input.secondFactor as Partial<SecondFactor> | undefined;
        if (
          factor !== undefined &&
          (!factor ||
            typeof factor !== "object" ||
            !["totp", "recovery"].includes(factor.method ?? "") ||
            typeof factor.code !== "string" ||
            (factor.factorId !== undefined &&
              typeof factor.factorId !== "string"))
        )
          throw new AuthProviderError("invalid_input");
        const prepared = await auth.recovery.prepare(
          input.tokenHash,
          factor as SecondFactor | undefined,
        );
        // This JWT came directly from validated provider exchange and was signature
        // checked by begin_credential_change. Never decode a request JWT for expiry.
        const claims = JSON.parse(
          Buffer.from(prepared.accessToken.split(".")[1], "base64url").toString(
            "utf8",
          ),
        );
        const expiresAt = claims.exp * 1000;
        const sealed = codec.seal({
          id: prepared.id,
          receipt: prepared.receipt,
          accessToken: prepared.accessToken,
          expiresAt,
        });
        const response = json({ prepared: true });
        response.cookies.set(name, sealed, {
          ...options,
          expires: new Date(expiresAt),
        });
        response.cookies.set(cookieName, "", {
          ...options,
          path: "/",
          maxAge: 0,
        });
        return response;
      }
      if (typeof input.password !== "string" || input.confirmed !== true)
        throw new AuthProviderError("invalid_input");
      let proof;
      try {
        proof = codec.open(request.cookies.get(name)?.value ?? "");
      } catch (error) {
        if (!(error instanceof RecoveryEnvelopeError)) throw error;
        const response = json({ error: "unauthenticated" }, 401);
        response.cookies.set(name, "", { ...options, maxAge: 0 });
        return response;
      }
      await auth.recovery.complete(
        proof.accessToken,
        proof.id,
        proof.receipt,
        input.password,
      );
      const response = json({ ok: true });
      response.cookies.set(name, "", { ...options, maxAge: 0 });
      response.cookies.set(cookieName, "", {
        ...options,
        path: "/",
        maxAge: 0,
      });
      return response;
    }
    if (typeof input.email !== "string" || typeof input.password !== "string")
      throw new AuthProviderError("invalid_input");
    if (action === "signup") {
      if (typeof input.displayName !== "string" || !input.displayName.trim())
        throw new AuthProviderError("invalid_input");
      await auth.provider.signUp(
        input.email,
        input.password,
        input.displayName,
      );
      return json({ verificationRequired: true }, 202);
    }
    let secondFactor: SecondFactor | undefined;
    if (input.secondFactor !== undefined) {
      const factor = input.secondFactor as Partial<SecondFactor> | null;
      if (
        !factor ||
        typeof factor !== "object" ||
        !["totp", "recovery"].includes(factor.method ?? "") ||
        typeof factor.code !== "string" ||
        (factor.factorId !== undefined && typeof factor.factorId !== "string")
      ) {
        throw new AuthProviderError("invalid_input");
      }
      secondFactor = factor as SecondFactor;
    }
    if (mfaActions.includes(action)) {
      const credentials = { email: input.email, password: input.password };
      const cookieOptions = {
        httpOnly: true,
        secure: auth.secure,
        sameSite: "strict" as const,
        path: "/api/auth",
      };
      if (action === "mfa-resume-removal") {
        const pending = receiptCookie(request, removalCookie);
        if (!pending) return json({ error: "unauthenticated" }, 401);
        const result = await auth.mfa.resumeRemoval(
          credentials,
          pending.enrollmentId,
          pending.receipt,
          secondFactor,
        );
        const response = json(result);
        response.cookies.set(removalCookie, "", {
          ...cookieOptions,
          maxAge: 0,
        });
        response.cookies.set(cookieName, "", {
          ...cookieOptions,
          path: "/",
          maxAge: 0,
        });
        return response;
      }
      const cookie = sessionCookie(request);
      if (!cookie || !(await auth.sessions.actor(cookie.token)))
        return json({ error: "unauthenticated" }, 401);
      const { enrollmentId, version, code } = input;
      if (
        typeof enrollmentId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          enrollmentId,
        )
      )
        throw new AuthProviderError("invalid_input");
      if (action === "mfa-start")
        return json(
          await auth.mfa.start(cookie.token, credentials, enrollmentId),
        );
      if (typeof version !== "string" || !/^[1-9][0-9]{0,17}$/.test(version))
        throw new AuthProviderError("invalid_input");
      if (action === "mfa-prepare-removal") {
        if (!secondFactor || input.confirmed !== true)
          throw new AuthProviderError("invalid_input");
        const result = await auth.mfa.prepareRemoval(
          cookie.token,
          credentials,
          enrollmentId,
          version,
          secondFactor,
        );
        const response = json({ enrollmentId, state: result.state });
        response.cookies.set(
          removalCookie,
          `${enrollmentId}:${result.receipt}`,
          cookieOptions,
        );
        response.cookies.set(cookieName, "", {
          ...cookieOptions,
          path: "/",
          maxAge: 0,
        });
        return response;
      }
      if (
        action !== "mfa-cancel" &&
        (typeof code !== "string" || !/^\d{6}$/.test(code))
      )
        throw new AuthProviderError("invalid_input");
      if (action === "mfa-recovery" || action === "mfa-replace-recovery") {
        const result =
          action === "mfa-recovery"
            ? await auth.mfa.issueRecovery(
                cookie.token,
                credentials,
                enrollmentId,
                version,
                code as string,
              )
            : await auth.mfa.replaceRecovery(
                cookie.token,
                credentials,
                enrollmentId,
                version,
                code as string,
              );
        const response = json({
          enrollmentId,
          version: result.version,
          codes: result.codes,
        });
        response.cookies.set(
          recoveryCookie,
          `${enrollmentId}:${result.receipt}`,
          cookieOptions,
        );
        return response;
      }
      const pending = receiptCookie(request, recoveryCookie);
      if (
        action === "mfa-acknowledge" &&
        (!pending ||
          pending.enrollmentId !== enrollmentId ||
          input.confirmed !== true)
      )
        throw new AuthProviderError("invalid_input");
      if (action === "mfa-cancel" && input.confirmed !== true)
        throw new AuthProviderError("invalid_input");
      const result =
        action === "mfa-verify"
          ? await auth.mfa.verify(
              cookie.token,
              credentials,
              enrollmentId,
              version,
              code as string,
            )
          : action === "mfa-cancel"
            ? await auth.mfa.cancelPending(
                cookie.token,
                credentials,
                enrollmentId,
                version,
              )
            : await auth.mfa.acknowledgeRecovery(
                cookie.token,
                credentials,
                enrollmentId,
                version,
                code as string,
                pending!.receipt,
              );
      const response = json({
        enrollmentId,
        ...("version" in result
          ? { version: result.version }
          : { state: result.state }),
      });
      response.cookies.set(
        cookieName,
        `${result.session.id}:${result.session.token}`,
        { ...cookieOptions, path: "/", expires: result.session.expiresAt },
      );
      if (action !== "mfa-verify")
        response.cookies.set(recoveryCookie, "", {
          ...cookieOptions,
          maxAge: 0,
        });
      return response;
    }
    const session = await auth.sessions.login(
      input.email,
      input.password,
      undefined,
      secondFactor,
    );
    const response = json({ ok: true });
    response.cookies.set(cookieName, `${session.id}:${session.token}`, {
      httpOnly: true,
      secure: auth.secure,
      sameSite: "strict",
      path: "/",
      expires: session.expiresAt,
    });
    return response;
  } catch (error) {
    if (error instanceof AuthProviderError) {
      return json(
        { error: error.kind },
        error.kind === "invalid_input"
          ? 400
          : error.kind === "unavailable"
            ? 503
            : 401,
      );
    }
    return json({ error: "unavailable" }, 503);
  }
}
