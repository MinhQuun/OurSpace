import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProvider, AuthProviderError } from "./provider.server";

type Database = ReturnType<typeof createDatabase>;
export type SecondFactor = {
  method: "totp" | "recovery";
  code: string;
  factorId?: string;
};
export type SessionSummary = {
  id: string;
  created_at: Date;
  expires_at: Date;
  revoked_at: Date | null;
  is_current: boolean;
  last_seen: Date;
};
function digest(token: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new AuthProviderError("denied");
  return createHash("sha256").update(token).digest("hex");
}

/** Infrastructure may be shared; resolved identities must never be cached. */
export class SessionService {
  constructor(
    private readonly db: Database,
    private readonly provider: AuthProvider,
  ) {}

  async login(
    email: string,
    password: string,
    displayName?: string,
    secondFactor?: SecondFactor,
  ) {
    if (
      displayName !== undefined &&
      (!displayName.trim() || displayName.trim().length > 120)
    ) {
      throw new AuthProviderError("invalid_input");
    }
    const startedAt = Date.now();
    let providerSession = await this.provider.signIn(email, password);
    const identity = await this.provider.identity(providerSession.accessToken);
    if (identity.mfaRequired) {
      if (!secondFactor) throw new AuthProviderError("mfa_required");
      if (secondFactor.method === "recovery") {
        providerSession = await this.provider.verifyRecoveryCode(
          providerSession.accessToken,
          secondFactor.code,
        );
      } else {
        const factorId = secondFactor.factorId ?? identity.totpFactorIds[0];
        if (!factorId || !identity.totpFactorIds.includes(factorId))
          throw new AuthProviderError("denied");
        const challenge = await this.provider.challengeTotp(
          providerSession.accessToken,
          factorId,
        );
        providerSession = await this.provider.verifyTotp(
          providerSession.accessToken,
          factorId,
          challenge,
          secondFactor.code,
        );
      }
    }
    const expiresAt = new Date(startedAt + providerSession.expiresIn * 1000);
    if (
      !Number.isFinite(expiresAt.getTime()) ||
      expiresAt.getTime() <= Date.now()
    ) {
      throw new AuthProviderError("denied");
    }
    const token = randomBytes(32).toString("base64url");
    const id = randomUUID();
    await this.db.query(
      "SELECT app_internal.issue_verified_session($1,$2,$3,$4)",
      [
        providerSession.accessToken,
        displayName?.trim() ?? identity.displayName ?? null,
        id,
        digest(token),
      ],
    );
    return { token, id, expiresAt };
  }

  async actor(token: string): Promise<string | null> {
    let hash: string;
    try {
      hash = digest(token);
    } catch {
      return null;
    }
    const result = await this.db.query<{ actor: string | null }>(
      "SELECT app_internal.authenticate_session($1) AS actor",
      [hash],
    );
    return result.rows[0]?.actor ?? null;
  }

  async revoke(token: string, sessionId: string): Promise<boolean> {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        sessionId,
      )
    ) {
      throw new AuthProviderError("invalid_input");
    }
    const result = await this.db.query<{ revoked: boolean }>(
      "SELECT app_internal.revoke_session($1,$2) AS revoked",
      [digest(token), sessionId],
    );
    return result.rows[0]?.revoked === true;
  }

  async list(token: string): Promise<SessionSummary[]> {
    return (
      await this.db.query<SessionSummary>(
        "SELECT * FROM app_internal.list_sessions($1)",
        [digest(token)],
      )
    ).rows;
  }

  async revokeOthers(token: string): Promise<number> {
    return (
      await this.db.query<{ count: number }>(
        "SELECT app_internal.revoke_other_sessions($1) AS count",
        [digest(token)],
      )
    ).rows[0].count;
  }
}
