import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProvider, AuthProviderError } from "../auth/provider.server";
import { SessionService, type SecondFactor } from "../auth/session.server";
export type SpaceStatus = {
  id: string;
  state: string;
  version: string;
  created_at: Date;
  partner_id: string;
  partner_name: string | null;
  disconnected_at: Date | null;
  processing_until: Date | null;
};
function digest(token: string) {
  if (
    !/^[A-Za-z0-9_-]{43}$/.test(token) ||
    Buffer.from(token, "base64url").toString("base64url") !== token
  )
    throw new AuthProviderError("denied");
  return createHash("sha256").update(token).digest("hex");
}
export class SpaceService {
  private readonly sessions: SessionService;
  constructor(
    private readonly db: ReturnType<typeof createDatabase>,
    private readonly provider: AuthProvider,
  ) {
    this.sessions = new SessionService(db, provider);
  }
  async list(token: string) {
    if (!(await this.sessions.actor(token)))
      throw new AuthProviderError("denied");
    return (
      await this.db.query<SpaceStatus>(
        "SELECT * FROM app_internal.list_my_spaces($1)",
        [digest(token)],
      )
    ).rows;
  }
  async disconnect(
    token: string,
    credentials: { email: string; password: string },
    commandId: string,
    spaceId: string,
    version: number,
    confirmed: boolean,
    factor?: SecondFactor,
  ) {
    const uuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (
      !uuid.test(commandId) ||
      !uuid.test(spaceId) ||
      !Number.isSafeInteger(version) ||
      version < 1 ||
      confirmed !== true
    )
      throw new AuthProviderError("invalid_input");
    const actor = await this.sessions.actor(token);
    if (!actor) throw new AuthProviderError("denied");
    let proof = await this.provider.signIn(
      credentials.email,
      credentials.password,
    );
    const identity = await this.provider.identity(proof.accessToken);
    if (identity.id !== actor) throw new AuthProviderError("denied");
    if (identity.mfaRequired) {
      if (!factor) throw new AuthProviderError("mfa_required");
      if (factor.method === "recovery") {
        proof = await this.provider.verifyRecoveryCode(
          proof.accessToken,
          factor.code,
        );
      } else {
        const id = factor.factorId ?? identity.totpFactorIds[0];
        if (!id || !identity.totpFactorIds.includes(id))
          throw new AuthProviderError("denied");
        const challenge = await this.provider.challengeTotp(
          proof.accessToken,
          id,
        );
        proof = await this.provider.verifyTotp(
          proof.accessToken,
          id,
          challenge,
          factor.code,
        );
      }
    }
    // Database rechecks session, signed freshness, membership, consent and version atomically.
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.disconnect_space($1,$2,$3,$4,$5,$6) AS id",
      [
        digest(token),
        proof.accessToken,
        commandId,
        spaceId,
        version,
        confirmed,
      ],
    );
    if (!result.rows[0]?.id) throw new AuthProviderError("denied");
    return { spaceId: result.rows[0].id };
  }
}
