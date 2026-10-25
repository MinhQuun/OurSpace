import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProvider, AuthProviderError } from "./provider.server";
import type { SecondFactor } from "./session.server";

/** Internal proof exchange only. Never serialize provider sessions to clients.
 * Password mutation still needs recovery intent, MFA, revocation and audit.
 */
export class RecoveryService {
  constructor(
    private readonly db: ReturnType<typeof createDatabase>,
    private readonly provider: AuthProvider,
  ) {}

  async exchange(tokenHash: string) {
    if (!/^[a-zA-Z0-9_-]{32,256}$/.test(tokenHash))
      throw new AuthProviderError("invalid_input");
    const digest = createHash("sha256").update(tokenHash).digest("hex");
    // This transaction commits before the external call. Never roll back the
    // consumption after a timeout: Auth may already have redeemed the proof.
    const result = await this.db.query<{ consumed: boolean }>(
      "SELECT app_internal.consume_password_recovery($1) AS consumed",
      [digest],
    );
    if (result.rows[0]?.consumed !== true)
      throw new AuthProviderError("denied");
    return this.provider.verifyPasswordRecovery(tokenHash);
  }

  /** Internal return includes provider proof: route must seal it, never JSON it. */
  async prepare(tokenHash: string, secondFactor?: SecondFactor) {
    let session = await this.exchange(tokenHash);
    const identity = await this.provider.identity(session.accessToken);
    if (identity.mfaRequired) {
      if (!secondFactor) throw new AuthProviderError("mfa_required");
      if (secondFactor.method === "recovery") {
        session = await this.provider.verifyRecoveryCode(
          session.accessToken,
          secondFactor.code,
        );
      } else {
        const factor = secondFactor.factorId ?? identity.totpFactorIds[0];
        if (!factor || !identity.totpFactorIds.includes(factor))
          throw new AuthProviderError("denied");
        session = await this.provider.verifyTotp(
          session.accessToken,
          factor,
          await this.provider.challengeTotp(session.accessToken, factor),
          secondFactor.code,
        );
      }
    }
    if ((await this.provider.identity(session.accessToken)).id !== identity.id)
      throw new AuthProviderError("denied");
    const id = randomUUID();
    const receipt = randomBytes(32).toString("base64url");
    await this.db.query(
      "SELECT app_internal.begin_credential_change($1,$2,$3)",
      [
        session.accessToken,
        id,
        createHash("sha256").update(receipt).digest("hex"),
      ],
    );
    return {
      id,
      receipt,
      accessToken: session.accessToken,
      expiresIn: session.expiresIn,
    };
  }

  async complete(
    accessToken: string,
    id: string,
    receipt: string,
    password: string,
  ) {
    if (
      !/^[A-Za-z0-9_-]{43}$/.test(receipt) ||
      password.length < 12 ||
      password.length > 1024
    )
      throw new AuthProviderError("invalid_input");
    const hash = createHash("sha256").update(receipt).digest("hex");
    const identity = await this.provider.identity(accessToken);
    await this.db.transaction(async (client) => {
      await client.query(
        "SELECT app_internal.pending_credential_change($1,$2,$3)",
        [accessToken, id, hash],
      );
      try {
        await this.provider.updatePassword(accessToken, password);
      } catch (error) {
        // A prior attempt may have updated Auth before its DB transaction failed.
        // Never accept an error as success: prove the chosen password below.
        if (!(error instanceof AuthProviderError) || error.kind !== "denied")
          throw error;
      }
      const proof = await this.provider.signIn(identity.email, password);
      if ((await this.provider.identity(proof.accessToken)).id !== identity.id)
        throw new AuthProviderError("denied");
      await client.query(
        "SELECT app_internal.finish_credential_change($1,$2,$3)",
        [accessToken, id, hash],
      );
    });
  }
}
