import { NextRequest, NextResponse } from 'next/server';
import { authRuntime } from '../../../../server/auth-runtime.server';
import { AuthProviderError } from '../../../../modules/m10/auth/provider.server';
import type { SecondFactor } from '../../../../modules/m10/auth/session.server';

export const runtime = 'nodejs';
const cookieName = 'ourspace_session';
const json = (value: unknown, status = 200) => NextResponse.json(value, {
  status, headers: { 'Cache-Control': 'no-store', 'Vary': 'Cookie', 'X-Content-Type-Options': 'nosniff' },
});
type Context = { params: Promise<{ action: string }> };

function sessionCookie(request: NextRequest) {
  const value = request.cookies.get(cookieName)?.value ?? '';
  const match = /^([0-9a-f-]{36}):([A-Za-z0-9_-]{43})$/.exec(value);
  return match ? { id: match[1], token: match[2] } : null;
}

async function body(request: NextRequest): Promise<Record<string, unknown>> {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') throw new AuthProviderError('invalid_input');
  const reader = request.body?.getReader();
  if (!reader) throw new AuthProviderError('invalid_input');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.length;
      if (size > 4096) { await reader.cancel(); throw new AuthProviderError('invalid_input'); }
      chunks.push(part.value);
    }
    const result: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error();
    return result as Record<string, unknown>;
  } catch { throw new AuthProviderError('invalid_input'); }
  finally { reader.releaseLock(); }
}

export async function GET(request: NextRequest, context: Context) {
  const { action } = await context.params;
  if (!['session', 'sessions'].includes(action)) return json({ error: 'not_found' }, 404);
  try {
    const cookie = sessionCookie(request);
    const actor = cookie ? await authRuntime().sessions.actor(cookie.token) : null;
    if (!actor || !cookie) return json({ error: 'unauthenticated' }, 401);
    return action === 'sessions' ? json({ sessions: await authRuntime().sessions.list(cookie.token) }) : json({ accountId: actor });
  } catch { return json({ error: 'unavailable' }, 503); }
}

export async function POST(request: NextRequest, context: Context) {
  const { action } = await context.params;
  if (!['signup', 'login', 'logout', 'revoke-session', 'revoke-other-sessions'].includes(action)) return json({ error: 'not_found' }, 404);
  try {
    const auth = authRuntime();
    if (request.headers.get('origin') !== auth.origin || request.headers.get('sec-fetch-site') === 'cross-site') {
      return json({ error: 'forbidden' }, 403);
    }
    if (action === 'logout') {
      const cookie = sessionCookie(request);
      if (cookie) await auth.sessions.revoke(cookie.token, cookie.id);
      const response = json({ ok: true });
      response.cookies.set(cookieName, '', { httpOnly: true, secure: auth.secure, sameSite: 'strict', path: '/', maxAge: 0 });
      return response;
    }
    if (action === 'revoke-session' || action === 'revoke-other-sessions') {
      const cookie = sessionCookie(request);
      if (!cookie || !await auth.sessions.actor(cookie.token)) return json({ error: 'unauthenticated' }, 401);
      if (action === 'revoke-other-sessions') return json({ revoked: await auth.sessions.revokeOthers(cookie.token) });
      const input = await body(request);
      if (typeof input.sessionId !== 'string') throw new AuthProviderError('invalid_input');
      return json({ revoked: await auth.sessions.revoke(cookie.token, input.sessionId) });
    }
    const input = await body(request);
    if (typeof input.email !== 'string' || typeof input.password !== 'string') throw new AuthProviderError('invalid_input');
    if (action === 'signup') {
      if (typeof input.displayName !== 'string' || !input.displayName.trim()) throw new AuthProviderError('invalid_input');
      await auth.provider.signUp(input.email, input.password, input.displayName);
      return json({ verificationRequired: true }, 202);
    }
    let secondFactor: SecondFactor | undefined;
    if (input.secondFactor !== undefined) {
      const factor = input.secondFactor as Partial<SecondFactor> | null;
      if (!factor || typeof factor !== 'object' || !['totp', 'recovery'].includes(factor.method ?? '') ||
          typeof factor.code !== 'string' || (factor.factorId !== undefined && typeof factor.factorId !== 'string')) {
        throw new AuthProviderError('invalid_input');
      }
      secondFactor = factor as SecondFactor;
    }
    const session = await auth.sessions.login(input.email, input.password, undefined, secondFactor);
    const response = json({ ok: true });
    response.cookies.set(cookieName, `${session.id}:${session.token}`, {
      httpOnly: true, secure: auth.secure, sameSite: 'strict', path: '/', expires: session.expiresAt,
    });
    return response;
  } catch (error) {
    if (error instanceof AuthProviderError) {
      return json({ error: error.kind }, error.kind === 'invalid_input' ? 400 : error.kind === 'unavailable' ? 503 : 401);
    }
    return json({ error: 'unavailable' }, 503);
  }
}
