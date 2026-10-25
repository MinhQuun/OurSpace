import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProvider, AuthProviderError } from "./provider.server";

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
      "SELECT app_internal.consume_password_recovery($1) AS consumed", [digest],
    );
    if (result.rows[0]?.consumed !== true) throw new AuthProviderError("denied");
    return this.provider.verifyPasswordRecovery(tokenHash);
  }
}
