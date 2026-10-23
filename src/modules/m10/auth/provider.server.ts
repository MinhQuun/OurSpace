export class AuthProviderError extends Error {
  constructor(public readonly kind: 'invalid_input' | 'denied' | 'unavailable') {
    super(`Authentication ${kind}`);
    this.name = 'AuthProviderError';
  }
}

export type ProviderSession = Readonly<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}>;
export type VerifiedIdentity = Readonly<{ id: string; email: string }>;

/** Server transport only: never cache responses, log payloads or persist tokens
 * in browser storage. Application session revocation is a separate boundary.
 */
export class AuthProvider {
  private readonly base: string;
  constructor(url: string, private readonly publishableKey?: string) {
    const parsed = new URL(url);
    if (parsed.username || parsed.password || parsed.search || parsed.hash ||
        (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname)))) {
      throw new AuthProviderError('invalid_input');
    }
    this.base = url.replace(/\/$/, '');
  }

  private async request(path: string, body?: unknown, token?: string): Promise<Record<string, unknown>> {
    if (typeof window !== 'undefined') throw new AuthProviderError('denied');
    let response: Response;
    try {
      response = await fetch(this.base + path, {
        method: body === undefined ? 'GET' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.publishableKey ? { apikey: this.publishableKey } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new AuthProviderError('unavailable');
    }
    if (!response.ok) throw new AuthProviderError(response.status >= 500 ? 'unavailable' : 'denied');
    try {
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error();
      return data as Record<string, unknown>;
    } catch {
      throw new AuthProviderError('unavailable');
    }
  }

  private credentials(email: string, password: string) {
    const normalized = email.trim();
    if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ||
        password.length < 12 || password.length > 1024) throw new AuthProviderError('invalid_input');
    return { email: normalized, password };
  }

  async signUp(email: string, password: string): Promise<void> {
    const data = await this.request('/signup', this.credentials(email, password));
    // Fail closed if provider configuration silently bypasses email verification.
    if (data.access_token || data.email_confirmed_at) throw new AuthProviderError('denied');
    // Do not expose provider IDs/existence information for duplicate signups.
  }

  async signIn(email: string, password: string): Promise<ProviderSession> {
    const data = await this.request('/token?grant_type=password', this.credentials(email, password));
    if (typeof data.access_token !== 'string' || typeof data.refresh_token !== 'string' ||
        typeof data.expires_in !== 'number' || !Number.isFinite(data.expires_in) || data.expires_in <= 0) {
      throw new AuthProviderError('unavailable');
    }
    await this.identity(data.access_token);
    return { accessToken: data.access_token, refreshToken: data.refresh_token, expiresIn: data.expires_in };
  }

  async identity(token: string): Promise<VerifiedIdentity> {
    if (!token || token.length > 16384) throw new AuthProviderError('denied');
    const user = await this.request('/user', undefined, token);
    if (typeof user.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id) ||
        typeof user.email !== 'string' || typeof user.email_confirmed_at !== 'string' || !user.email_confirmed_at) {
      throw new AuthProviderError('denied');
    }
    return { id: user.id, email: user.email };
  }
}
