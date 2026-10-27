import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProviderError } from "../auth/provider.server";

export type BasePermissionInspection = {
  resource_id: string;
  resource_version: string;
  role: "owner" | "editor" | "commenter" | "viewer";
  base_read_allowed: boolean;
  read_reason: "source_deleted" | "domain_conditions_required" | "base_acl_allowed" | "denied";
};

/** Base ACL metadata only. Domain permissions must still be resolved separately. */
export class PermissionService {
  constructor(private readonly db: ReturnType<typeof createDatabase>) {}

  async inspect(token: string, resourceId: string): Promise<BasePermissionInspection | null> {
    if (!/^[A-Za-z0-9_-]{43}$/.test(token) || Buffer.from(token, "base64url").toString("base64url") !== token)
      throw new AuthProviderError("denied");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resourceId))
      throw new AuthProviderError("invalid_input");
    // Session and object access are evaluated together in the database on every call.
    const result = await this.db.query<BasePermissionInspection>(
      "SELECT resource_id,resource_version,role,base_read_allowed,read_reason FROM app_internal.inspect_resource_access($1,$2)",
      [createHash("sha256").update(token).digest("hex"), resourceId],
    );
    return result.rows[0] ?? null;
  }
}
