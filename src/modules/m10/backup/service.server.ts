import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProviderError } from "../auth/provider.server";

export type BackupJob = {
  id: string;
  scope: string;
  status: string;
  result_ref: string | null;
  created_at: string;
  completed_at: string | null;
};

export type RestoreJob = {
  id: string;
  scope: string;
  source_job_id: string;
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

export class BackupService {
  constructor(private readonly db: ReturnType<typeof createDatabase>) {}

  async listBackups(session: string): Promise<BackupJob[]> {
    const hash = digest(session);
    const result = await this.db.query<BackupJob>(
      "SELECT id,scope,status,result_ref,created_at,completed_at FROM app_internal.list_backup_jobs($1)",
      [hash],
    );
    return result.rows;
  }

  async createBackup(
    session: string,
    commandId: string,
    scope: string,
  ): Promise<string> {
    const hash = digest(session);
    if (
      !uuid(commandId) ||
      !["personal", "shared", "full_system"].includes(scope)
    )
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ create_backup_job: string }>(
      "SELECT app_internal.create_backup_job($1,$2,$3) AS create_backup_job",
      [hash, commandId, scope],
    );
    return result.rows[0]?.create_backup_job;
  }

  async listRestores(session: string): Promise<RestoreJob[]> {
    const hash = digest(session);
    const result = await this.db.query<RestoreJob>(
      "SELECT id,scope,source_job_id,status,result_ref,created_at,completed_at FROM app_internal.list_restore_jobs($1)",
      [hash],
    );
    return result.rows;
  }

  async createRestore(
    session: string,
    commandId: string,
    scope: string,
    sourceJobId: string,
  ): Promise<string> {
    const hash = digest(session);
    if (
      !uuid(commandId) ||
      !uuid(sourceJobId) ||
      !["personal", "shared", "full_system"].includes(scope)
    )
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ create_restore_job: string }>(
      "SELECT app_internal.create_restore_job($1,$2,$3,$4) AS create_restore_job",
      [hash, commandId, scope, sourceJobId],
    );
    return result.rows[0]?.create_restore_job;
  }
}
