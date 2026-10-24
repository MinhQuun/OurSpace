import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProvider, AuthProviderError } from "./provider.server";
import { SessionService } from "./session.server";

type Database = ReturnType<typeof createDatabase>;
type Credentials = { email: string; password: string };
function digest(token: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) throw new AuthProviderError("denied");
  return createHash("sha256").update(token).digest("hex");
}

/** No provider tokens survive a request. Public routes must never serialize
 * internal provider responses; only the explicit return shapes below are safe.
 */
export class MfaService {
  private readonly sessions: SessionService;
  constructor(
    private readonly db: Database,
    private readonly provider: AuthProvider,
  ) {
    this.sessions = new SessionService(db, provider);
  }

  private async reauthenticate(token: string, credentials: Credentials) {
    const actor = await this.sessions.actor(token);
    if (!actor) throw new AuthProviderError("denied");
    const session = await this.provider.signIn(
      credentials.email,
      credentials.password,
    );
    const identity = await this.provider.identity(session.accessToken);
    if (identity.id !== actor) throw new AuthProviderError("denied");
    return { session, identity };
  }

  async start(token: string, credentials: Credentials, enrollmentId: string) {
    const { session, identity } = await this.reauthenticate(token, credentials);
    if (identity.mfaRequired) throw new AuthProviderError("denied");
    const hash = digest(token);
    // Account lock prevents two application requests enrolling competing factors.
    // Provider operations are external: interrupted enrollments need reconciliation
    // before retry; no successful setup is reported if this transaction fails.
    return this.db.transaction(async (client) => {
      await client.query("SELECT app_internal.begin_mfa_enrollment($1,$2,$3)", [
        hash,
        session.accessToken,
        enrollmentId,
      ]);
      const current = (
        await client.query(
          "SELECT * FROM app_internal.bound_mfa_factor($1,$2)",
          [hash, enrollmentId],
        )
      ).rows[0];
      if (!current || current.state !== "pending" || current.provider_factor_id)
        throw new AuthProviderError("denied");
      const factor = await this.provider.enrollTotp(session.accessToken);
      const result = await client.query(
        "SELECT app_internal.record_mfa_factor($1,$2,$3,$4,$5,false) AS version",
        [hash, session.accessToken, enrollmentId, current.version, factor.id],
      );
      return {
        enrollmentId,
        version: String(result.rows[0].version),
        secret: factor.secret,
        uri: factor.uri,
      };
    });
  }

  async cancelPending(token: string, credentials: Credentials, enrollmentId: string, version: string) {
    const { session, identity } = await this.reauthenticate(token, credentials);
    if (identity.mfaRequired) throw new AuthProviderError('denied');
    const hash = digest(token);
    const replacement = { token: randomBytes(32).toString('base64url'), id: randomUUID(),
      expiresAt: new Date(Date.now() + session.expiresIn * 1000) };
    return this.db.transaction(async client => {
      // Existing pending-ID retry obtains the account lock before provider
      // mutation, serializing cancellation against application verification.
      await client.query('SELECT app_internal.begin_mfa_enrollment($1,$2,$3)', [hash, session.accessToken, enrollmentId]);
      const current = (await client.query('SELECT * FROM app_internal.bound_mfa_factor($1,$2)', [hash, enrollmentId])).rows[0];
      if (!current || current.state !== 'pending' || String(current.version) !== version) throw new AuthProviderError('denied');
      const latest = await this.provider.identity(session.accessToken);
      if (latest.id !== identity.id || latest.mfaRequired) throw new AuthProviderError('denied');
      if (current.provider_factor_id && latest.pendingTotpFactorIds.includes(current.provider_factor_id)) {
        await this.provider.unenrollFactor(session.accessToken, current.provider_factor_id);
      }
      // A missing factor is valid reconciliation after a previously completed
      // provider deletion whose DB transaction/response was interrupted.
      await client.query('SELECT app_internal.cancel_pending_mfa($1,$2,$3,$4)', [hash, session.accessToken, enrollmentId, version]);
      await client.query('SELECT app_internal.issue_verified_session($1,$2,$3,$4)',
        [session.accessToken, identity.displayName ?? null, replacement.id, digest(replacement.token)]);
      return { enrollmentId, state: 'cancelled' as const, session: replacement };
    });
  }

  private async recoveryProof(
    token: string,
    credentials: Credentials,
    enrollmentId: string,
    version: string,
    code: string,
  ) {
    const { session, identity } = await this.reauthenticate(token, credentials);
    const current = (
      await this.db.query(
        "SELECT * FROM app_internal.bound_mfa_factor($1,$2)",
        [digest(token), enrollmentId],
      )
    ).rows[0];
    if (
      !current ||
      current.state !== "verified" ||
      String(current.version) !== version ||
      !identity.totpFactorIds.includes(current.provider_factor_id)
    )
      throw new AuthProviderError("denied");
    const challenge = await this.provider.challengeTotp(
      session.accessToken,
      current.provider_factor_id,
    );
    const elevated = await this.provider.verifyTotp(
      session.accessToken,
      current.provider_factor_id,
      challenge,
      code,
    );
    return { elevated, identity };
  }

  async issueRecovery(
    token: string,
    credentials: Credentials,
    enrollmentId: string,
    version: string,
    code: string,
  ) {
    const { elevated } = await this.recoveryProof(
      token,
      credentials,
      enrollmentId,
      version,
      code,
    );
    const receipt = randomBytes(32).toString("base64url");
    return this.db.transaction(async (client) => {
      // Lock/version check precedes provider mutation. A competing request must
      // fail before it can create or replace a recovery set.
      const result = await client.query(
        "SELECT app_internal.record_mfa_recovery($1,$2,$3,$4,$5,false) AS version",
        [
          digest(token),
          elevated.accessToken,
          enrollmentId,
          version,
          digest(receipt),
        ],
      );
      const codes = await this.provider.generateRecoveryCodes(
        elevated.accessToken,
      );
      return {
        enrollmentId,
        version: String(result.rows[0].version),
        codes,
        receipt,
      };
    });
  }

  async acknowledgeRecovery(
    token: string,
    credentials: Credentials,
    enrollmentId: string,
    version: string,
    code: string,
    receipt: string,
  ) {
    const receiptHash = digest(receipt);
    const { elevated, identity } = await this.recoveryProof(
      token,
      credentials,
      enrollmentId,
      version,
      code,
    );
    const recovery = await this.provider.recoveryStatus(elevated.accessToken);
    if (recovery.remaining <= 0) throw new AuthProviderError("denied");
    const replacement = {
      token: randomBytes(32).toString("base64url"),
      id: randomUUID(),
      expiresAt: new Date(Date.now() + elevated.expiresIn * 1000),
    };
    return this.db.transaction(async (client) => {
      const result = await client.query(
        "SELECT app_internal.record_mfa_recovery($1,$2,$3,$4,$5,true) AS version",
        [
          digest(token),
          elevated.accessToken,
          enrollmentId,
          version,
          receiptHash,
        ],
      );
      await client.query(
        "SELECT app_internal.issue_verified_session($1,$2,$3,$4)",
        [
          elevated.accessToken,
          identity.displayName ?? null,
          replacement.id,
          digest(replacement.token),
        ],
      );
      return {
        enrollmentId,
        version: String(result.rows[0].version),
        session: replacement,
      };
    });
  }

  async status(token: string) {
    if (!(await this.sessions.actor(token)))
      throw new AuthProviderError("denied");
    return (
      (
        await this.db.query(
          "SELECT * FROM app_internal.current_mfa_enrollment($1)",
          [digest(token)],
        )
      ).rows[0] ?? null
    );
  }

  async replaceRecovery(
    token: string,
    credentials: Credentials,
    enrollmentId: string,
    version: string,
    code: string,
  ) {
    const { elevated } = await this.recoveryProof(
      token,
      credentials,
      enrollmentId,
      version,
      code,
    );
    const receipt = randomBytes(32).toString("base64url");
    const args = [
      digest(token),
      elevated.accessToken,
      enrollmentId,
      version,
      digest(receipt),
    ];
    // Commit invalidation first. Even if the following provider call fails,
    // an old displayed receipt can never acknowledge a possibly replaced set.
    const reserved = await this.db.query(
      "SELECT app_internal.replace_mfa_recovery_receipt($1,$2,$3,$4,$5) AS version",
      args,
    );
    const nextVersion = String(reserved.rows[0].version);
    return this.db.transaction(async (client) => {
      // Recheck and hold account lock during rotation. A newer reservation wins
      // before any stale request can mutate the provider's recovery set.
      await client.query(
        "SELECT app_internal.replace_mfa_recovery_receipt($1,$2,$3,$4,$5)",
        [args[0], args[1], enrollmentId, nextVersion, args[4]],
      );
      const existing = await this.provider.recoveryStatusIfEnrolled(
        elevated.accessToken,
      );
      const codes = await this.provider.generateRecoveryCodes(
        elevated.accessToken,
        existing !== null,
      );
      return { enrollmentId, version: nextVersion, codes, receipt };
    });
  }

  async verify(
    token: string,
    credentials: Credentials,
    enrollmentId: string,
    version: string,
    code: string,
  ) {
    const { session, identity } = await this.reauthenticate(token, credentials);
    const hash = digest(token);
    const current = (
      await this.db.query(
        "SELECT * FROM app_internal.bound_mfa_factor($1,$2)",
        [hash, enrollmentId],
      )
    ).rows[0];
    if (
      !current ||
      current.state !== "pending" ||
      String(current.version) !== version ||
      !current.provider_factor_id
    ) {
      throw new AuthProviderError("denied");
    }
    // Provider challenge enforces factor ownership; factor ID comes from DB.
    const challenge = await this.provider.challengeTotp(
      session.accessToken,
      current.provider_factor_id,
    );
    const elevated = await this.provider.verifyTotp(
      session.accessToken,
      current.provider_factor_id,
      challenge,
      code,
    );
    const verified = await this.provider.identity(elevated.accessToken);
    if (
      verified.id !== identity.id ||
      !verified.totpFactorIds.includes(current.provider_factor_id)
    ) {
      throw new AuthProviderError("denied");
    }
    const replacement = {
      token: randomBytes(32).toString("base64url"),
      id: randomUUID(),
      expiresAt: new Date(Date.now() + elevated.expiresIn * 1000),
    };
    return this.db.transaction(async (client) => {
      const result = await client.query(
        "SELECT app_internal.record_mfa_factor($1,$2,$3,$4,$5,true) AS version",
        [
          hash,
          elevated.accessToken,
          enrollmentId,
          version,
          current.provider_factor_id,
        ],
      );
      // The transition revokes old cookies. Replacement issuance commits with it
      // so the caller can continue recovery setup without a password-only window.
      await client.query(
        "SELECT app_internal.issue_verified_session($1,$2,$3,$4)",
        [
          elevated.accessToken,
          identity.displayName ?? null,
          replacement.id,
          digest(replacement.token),
        ],
      );
      return {
        enrollmentId,
        version: String(result.rows[0].version),
        session: replacement,
      };
    });
  }
}
