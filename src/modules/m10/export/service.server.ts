import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProviderError } from "../auth/provider.server";

export type ExportJob = {
  id: string;
  scope: string;
  status: string;
  result_ref: string | null;
  created_at: string;
  completed_at: string | null;
};

const uuid = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

function digest(session: string) {
  if (
    !/^[A-Za-z0-9_-]{43}$/.test(session) ||
    Buffer.from(session, "base64url").toString("base64url") !== session
  )
    throw new AuthProviderError("denied");
  return createHash("sha256").update(session).digest("hex");
}

export class ExportService {
  constructor(private readonly db: ReturnType<typeof createDatabase>) {}

  async createAccountSection(
    session: string,
    commandId: unknown,
  ): Promise<string> {
    const hash = digest(session);
    if (!uuid(commandId)) throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.create_account_export_artifact($1,$2) AS id",
      [hash, commandId],
    );
    if (!result.rows[0]) throw new AuthProviderError("unavailable");
    return result.rows[0].id;
  }

  async downloadAccountSection(session: string, artifactId: unknown) {
    const hash = digest(session);
    if (!uuid(artifactId)) throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{
      payload: Buffer;
      sha256: string;
      expires_at: Date;
    }>(
      "SELECT payload,sha256,expires_at FROM app_internal.read_account_export_artifact($1,$2)",
      [hash, artifactId],
    );
    const artifact = result.rows[0];
    if (!artifact) return null;
    if (
      !Buffer.isBuffer(artifact.payload) ||
      artifact.payload.length > 1048576 ||
      createHash("sha256").update(artifact.payload).digest("hex") !==
        artifact.sha256
    )
      throw new AuthProviderError("unavailable");
    return artifact;
  }

  async list(session: string): Promise<ExportJob[]> {
    const hash = digest(session);
    const result = await this.db.query<ExportJob>(
      "SELECT id,scope,status,result_ref,created_at,completed_at FROM app_internal.list_export_jobs($1)",
      [hash],
    );
    return result.rows;
  }

  async create(
    session: string,
    commandId: string,
    scope: string,
  ): Promise<string> {
    const hash = digest(session);
    if (!uuid(commandId) || !["personal", "shared"].includes(scope))
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ create_export_job: string }>(
      "SELECT app_internal.create_export_job($1,$2,$3) AS create_export_job",
      [hash, commandId, scope],
    );
    return result.rows[0]?.create_export_job;
  }
}
