import "server-only";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";

export class PairingError extends Error {
  constructor(public readonly kind: "invalid_input" | "denied") {
    super(`Pairing ${kind}`);
    this.name = "PairingError";
  }
}
function uuid(value: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value))
    throw new PairingError("invalid_input");
  return value;
}
function digest(value: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(value) || Buffer.from(value,"base64url").toString("base64url") !== value)
    throw new PairingError("invalid_input");
  return createHash("sha256").update(value).digest("hex");
}
export type Invitation = {
  id: string; state: string; expires_at: Date; version: string;
  creator_id: string; creator_name: string | null;
  recipient_id: string | null; recipient_name: string | null; space_id: string | null;
};
/** No cached authorization. Opaque session and capability are hashed before SQL.
 * Keep a proposal only in request memory while retrying; never log/store its token.
 */
export class PairingService {
  constructor(private readonly db: ReturnType<typeof createDatabase>) {}
  proposal() { return { id: randomUUID(), token: randomBytes(32).toString("base64url") }; }
  async create(session: string, proposal = this.proposal()) {
    const result = await this.db.query<{ id: string; state: string; expires_at: Date; version: string }>(
      "SELECT * FROM app_internal.create_pairing_invitation($1,$2,$3)",
      [digest(session),uuid(proposal.id),digest(proposal.token)],
    );
    if (!result.rows[0]) throw new PairingError("denied");
    return { ...result.rows[0], token: proposal.token };
  }
  async list(session: string) {
    return (await this.db.query<Invitation>("SELECT * FROM app_internal.list_pairing_invitations($1)",[digest(session)])).rows;
  }
  async inspect(session: string,id: string,token?: string) {
    const result = await this.db.query<Invitation>("SELECT * FROM app_internal.inspect_pairing_invitation($1,$2,$3)",
      [digest(session),uuid(id),token === undefined ? null : digest(token)]);
    if (!result.rows[0]) throw new PairingError("denied");
    return result.rows[0];
  }
  async decide(session: string,command: string,id: string,action: "accept" | "reject" | "revoke",confirmed: boolean,token?: string) {
    if (confirmed !== true || !["accept","reject","revoke"].includes(action)) throw new PairingError("invalid_input");
    const capability = action === "revoke" ? null : digest(token ?? "");
    const result = await this.db.query<{ id: string; state: string; version: string }>(
      "SELECT * FROM app_internal.decide_pairing_invitation($1,$2,$3,$4,$5)",
      [digest(session),uuid(command),uuid(id),action,capability]);
    if (!result.rows[0]) throw new PairingError("denied");
    return result.rows[0];
  }
  async confirm(session: string,command: string,id: string,recipient: string,version: number,confirmed: boolean) {
    if (confirmed !== true || !Number.isSafeInteger(version) || version < 1) throw new PairingError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.confirm_pairing($1,$2,$3,$4,$5,$6) AS id",
      [digest(session),uuid(command),uuid(id),uuid(recipient),version,confirmed]);
    if (!result.rows[0]?.id) throw new PairingError("denied");
    return { spaceId: result.rows[0].id };
  }
}
