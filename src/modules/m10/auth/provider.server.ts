export class AuthProviderError extends Error {
  constructor(
    public readonly kind:
      | "invalid_input"
      | "denied"
      | "unavailable"
      | "mfa_required",
    public readonly reason?: "recovery_not_enrolled",
  ) {
    super(`Authentication ${kind}`);
    this.name = "AuthProviderError";
  }
}

export type ProviderSession = Readonly<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}>;
export type VerifiedIdentity = Readonly<{
  id: string;
  email: string;
  mfaRequired: boolean;
  totpFactorIds: string[];
  pendingTotpFactorIds: string[];
  pendingOurSpaceTotpFactorIds: string[];
  displayName?: string;
}>;

/** Server transport only: never cache responses, log payloads or persist tokens
 * in browser storage. Application session revocation is a separate boundary.
 */
export class AuthProvider {
  private readonly base: string;
  constructor(
    url: string,
    private readonly publishableKey?: string,
  ) {
    const parsed = new URL(url);
    if (
      parsed.username ||
      parsed.password ||
      parsed.search ||
      parsed.hash ||
      (parsed.protocol !== "https:" &&
        !(
          parsed.protocol === "http:" &&
          ["localhost", "127.0.0.1"].includes(parsed.hostname)
        ))
    ) {
      throw new AuthProviderError("invalid_input");
    }
    this.base = url.replace(/\/$/, "");
  }

  private async request(
    path: string,
    body?: unknown,
    token?: string,
    method?: "DELETE" | "PUT",
  ): Promise<Record<string, unknown>> {
    if (typeof window !== "undefined") throw new AuthProviderError("denied");
    let response: Response;
    try {
      response = await fetch(this.base + path, {
        method: method ?? (body === undefined ? "GET" : "POST"),
        headers: {
          "Content-Type": "application/json",
          ...(this.publishableKey ? { apikey: this.publishableKey } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new AuthProviderError("unavailable");
    }
    if (!response.ok) {
      // Only this exact authenticated status response means no recovery set.
      // Network failures, invalid tokens and unrelated 404s must not trigger
      // fallback generation or be mistaken for empty state.
      if (
        response.status === 404 &&
        path === "/factors/recovery-codes" &&
        body === undefined &&
        method === undefined
      ) {
        const error = await response.json().catch(() => null);
        if (error?.error_code === "mfa_factor_not_found") {
          throw new AuthProviderError("denied", "recovery_not_enrolled");
        }
      }
      throw new AuthProviderError(
        response.status >= 500 ? "unavailable" : "denied",
      );
    }
    try {
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || Array.isArray(data))
        throw new Error();
      return data as Record<string, unknown>;
    } catch {
      throw new AuthProviderError("unavailable");
    }
  }

  private credentials(email: string, password: string) {
    const normalized = email.trim();
    if (
      normalized.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ||
      password.length < 12 ||
      password.length > 1024
    )
      throw new AuthProviderError("invalid_input");
    return { email: normalized, password };
  }

  async signUp(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<void> {
    if (
      displayName !== undefined &&
      (!displayName.trim() || displayName.trim().length > 120)
    )
      throw new AuthProviderError("invalid_input");
    const data = await this.request("/signup", {
      ...this.credentials(email, password),
      ...(displayName ? { data: { display_name: displayName.trim() } } : {}),
    });
    // Fail closed if provider configuration silently bypasses email verification.
    if (data.access_token || data.email_confirmed_at)
      throw new AuthProviderError("denied");
    // Do not expose provider IDs/existence information for duplicate signups.
  }

  async signIn(email: string, password: string): Promise<ProviderSession> {
    const data = await this.request(
      "/token?grant_type=password",
      this.credentials(email, password),
    );
    return this.session(data);
  }

  async requestPasswordRecovery(email: string): Promise<void> {
    const normalized = email.trim();
    if (
      normalized.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
    )
      throw new AuthProviderError("invalid_input");
    await this.request("/recover", { email: normalized });
  }

  /** Exchanges the emailed one-time capability; never accepts an account ID. */
  async verifyPasswordRecovery(tokenHash: string): Promise<ProviderSession> {
    if (!/^[a-zA-Z0-9_-]{32,256}$/.test(tokenHash))
      throw new AuthProviderError("invalid_input");
    return this.session(
      await this.request("/verify", {
        type: "recovery",
        token_hash: tokenHash,
      }),
    );
  }

  /** Transport primitive only. Caller must enforce recovery intent, MFA,
   * application session revocation and audit before exposing password reset. */
  async updatePassword(accessToken: string, password: string): Promise<void> {
    if (password.length < 12 || password.length > 1024)
      throw new AuthProviderError("invalid_input");
    const identity = await this.identity(accessToken);
    const result = await this.request(
      "/user",
      { password },
      accessToken,
      "PUT",
    );
    if (result.id !== identity.id) throw new AuthProviderError("denied");
  }

  private async session(
    data: Record<string, unknown>,
  ): Promise<ProviderSession> {
    if (
      typeof data.access_token !== "string" ||
      typeof data.refresh_token !== "string" ||
      typeof data.expires_in !== "number" ||
      !Number.isFinite(data.expires_in) ||
      data.expires_in <= 0
    ) {
      throw new AuthProviderError("unavailable");
    }
    await this.identity(data.access_token);
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }

  private factorId(value: string) {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value,
      )
    )
      throw new AuthProviderError("invalid_input");
    return value;
  }

  async enrollTotp(
    token: string,
  ): Promise<{ id: string; secret: string; uri: string }> {
    await this.identity(token);
    const data = await this.request(
      "/factors",
      { factor_type: "totp", friendly_name: "Our Space" },
      token,
    );
    const totp = data.totp as { secret?: unknown; uri?: unknown } | undefined;
    if (
      typeof data.id !== "string" ||
      typeof totp?.secret !== "string" ||
      !/^[A-Z2-7]+=*$/.test(totp.secret) ||
      typeof totp.uri !== "string" ||
      !totp.uri.startsWith("otpauth://totp/")
    ) {
      throw new AuthProviderError("unavailable");
    }
    return { id: this.factorId(data.id), secret: totp.secret, uri: totp.uri };
  }

  async challengeTotp(token: string, factorId: string): Promise<string> {
    const data = await this.request(
      `/factors/${this.factorId(factorId)}/challenge`,
      {},
      token,
    );
    if (typeof data.id !== "string") throw new AuthProviderError("unavailable");
    return this.factorId(data.id);
  }

  /** Cancel an unverified enrollment or remove a verified factor. The provider
   * enforces ownership and AAL2 for verified factors; callers must separately
   * coordinate application session invalidation and enrollment state.
   */
  async unenrollFactor(token: string, factorId: string): Promise<void> {
    const id = this.factorId(factorId);
    const data = await this.request(
      `/factors/${id}`,
      undefined,
      token,
      "DELETE",
    );
    if (data.id !== id) throw new AuthProviderError("unavailable");
  }

  async deleteRecoveryCodes(token: string): Promise<void> {
    const data = await this.request(
      "/factors/recovery-codes",
      undefined,
      token,
      "DELETE",
    );
    if (
      typeof data.id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        data.id,
      )
    ) {
      throw new AuthProviderError("unavailable");
    }
  }

  async verifyTotp(
    token: string,
    factorId: string,
    challengeId: string,
    code: string,
  ): Promise<ProviderSession> {
    if (!/^\d{6}$/.test(code)) throw new AuthProviderError("invalid_input");
    const before = await this.identity(token);
    const data = await this.request(
      `/factors/${this.factorId(factorId)}/verify`,
      {
        challenge_id: this.factorId(challengeId),
        code,
      },
      token,
    );
    return this.elevatedSession(data, before.id);
  }

  private async elevatedSession(
    data: Record<string, unknown>,
    expectedId: string,
  ): Promise<ProviderSession> {
    const session = await this.session(data);
    const after = await this.identity(session.accessToken);
    if (expectedId !== after.id) throw new AuthProviderError("denied");
    // This token came directly from authenticated provider verification and was
    // validated by /user. Never use unverified client JWT claims for assurance.
    try {
      const claims = JSON.parse(
        Buffer.from(session.accessToken.split(".")[1], "base64url").toString(
          "utf8",
        ),
      );
      if (claims.aal !== "aal2") throw new Error();
    } catch {
      throw new AuthProviderError("denied");
    }
    return session;
  }

  async generateRecoveryCodes(
    token: string,
    rotate = false,
  ): Promise<string[]> {
    const data = await this.request(
      `/factors/recovery-codes${rotate ? "/regenerate" : ""}`,
      {},
      token,
    );
    if (
      !Array.isArray(data.codes) ||
      data.codes.length < 4 ||
      data.codes.length > 16 ||
      data.codes.some(
        (code) =>
          typeof code !== "string" || !/^[A-Za-z0-9-]{13,64}$/.test(code),
      ) ||
      new Set(data.codes).size !== data.codes.length
    )
      throw new AuthProviderError("unavailable");
    return data.codes as string[];
  }

  async recoveryStatusIfEnrolled(
    token: string,
  ): Promise<{ total: number; remaining: number } | null> {
    try {
      return await this.recoveryStatus(token);
    } catch (error) {
      if (
        error instanceof AuthProviderError &&
        error.reason === "recovery_not_enrolled"
      )
        return null;
      throw error;
    }
  }

  async recoveryStatus(
    token: string,
  ): Promise<{ total: number; remaining: number }> {
    const data = await this.request(
      "/factors/recovery-codes",
      undefined,
      token,
    );
    if (
      data.codes !== undefined ||
      !Number.isInteger(data.total) ||
      !Number.isInteger(data.remaining) ||
      Number(data.remaining) < 0 ||
      Number(data.remaining) > Number(data.total)
    )
      throw new AuthProviderError("unavailable");
    return { total: Number(data.total), remaining: Number(data.remaining) };
  }

  async verifyRecoveryCode(
    token: string,
    code: string,
  ): Promise<ProviderSession> {
    if (!/^[A-Za-z0-9 -]{13,64}$/.test(code))
      throw new AuthProviderError("invalid_input");
    const identity = await this.identity(token);
    const data = await this.request(
      "/factors/recovery-codes/verify",
      { code },
      token,
    );
    return this.elevatedSession(data, identity.id);
  }

  async identity(token: string): Promise<VerifiedIdentity> {
    if (!token || token.length > 16384) throw new AuthProviderError("denied");
    const user = await this.request("/user", undefined, token);
    if (
      typeof user.id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        user.id,
      ) ||
      typeof user.email !== "string" ||
      typeof user.email_confirmed_at !== "string" ||
      !user.email_confirmed_at
    ) {
      throw new AuthProviderError("denied");
    }
    if (user.factors !== undefined && !Array.isArray(user.factors))
      throw new AuthProviderError("denied");
    const factors = (user.factors ?? []) as unknown[];
    if (factors.some((f) => !f || typeof f !== "object" || !("status" in f)))
      throw new AuthProviderError("denied");
    const metadata = user.user_metadata as
      | { display_name?: unknown }
      | undefined;
    const name = metadata?.display_name;
    const totpFactorIds = factors.flatMap((f) => {
      const factor = f as {
        id?: unknown;
        status?: unknown;
        factor_type?: unknown;
      };
      return factor.status === "verified" &&
        factor.factor_type === "totp" &&
        typeof factor.id === "string"
        ? [this.factorId(factor.id)]
        : [];
    });
    return {
      id: user.id,
      email: user.email,
      totpFactorIds,
      pendingOurSpaceTotpFactorIds: factors.flatMap((f) => {
        const factor = f as {
          id?: unknown;
          status?: unknown;
          factor_type?: unknown;
          friendly_name?: unknown;
        };
        return factor.status === "unverified" &&
          factor.factor_type === "totp" &&
          factor.friendly_name === "Our Space" &&
          typeof factor.id === "string"
          ? [this.factorId(factor.id)]
          : [];
      }),
      pendingTotpFactorIds: factors.flatMap((f) => {
        const factor = f as {
          id?: unknown;
          status?: unknown;
          factor_type?: unknown;
        };
        return factor.status === "unverified" &&
          factor.factor_type === "totp" &&
          typeof factor.id === "string"
          ? [this.factorId(factor.id)]
          : [];
      }),
      displayName:
        typeof name === "string" &&
        name.trim().length > 0 &&
        name.trim().length <= 120
          ? name.trim()
          : undefined,
      mfaRequired: factors.some(
        (f) => (f as { status: unknown }).status !== "unverified",
      ),
    };
  }
}
