import "server-only";
import { createHash } from "node:crypto";
import type { createDatabase } from "../../../server/database.server";
import { AuthProviderError } from "../auth/provider.server";

export type BasePermissionInspection = {
  resource_id: string;
  resource_version: string;
  role: "owner" | "editor" | "commenter" | "viewer";
  base_read_allowed: boolean;
  read_reason:
    | "source_deleted"
    | "domain_conditions_required"
    | "base_acl_allowed"
    | "denied";
};

export type SharingOption = {
  resource_version: string;
  space_id: string;
  recipient_id: string;
  recipient_name: string | null;
  role: "viewer" | "commenter" | "editor";
};
export type ResourceGrant = {
  grant_id: string;
  resource_version: string;
  grantee_id: string;
  space_id: string;
  role: string;
  granted_at: Date;
};
type Mutation = {
  commandId: string;
  resourceId: string;
  version: number;
  confirmed: boolean;
};
function hash(token: string) {
  if (
    !/^[A-Za-z0-9_-]{43}$/.test(token) ||
    Buffer.from(token, "base64url").toString("base64url") !== token
  )
    throw new AuthProviderError("denied");
  return createHash("sha256").update(token).digest("hex");
}
function ids(...values: string[]) {
  if (
    values.some(
      (value) =>
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          value,
        ),
    )
  )
    throw new AuthProviderError("invalid_input");
}
function mutation(input: Mutation) {
  ids(input.commandId, input.resourceId);
  if (
    !Number.isSafeInteger(input.version) ||
    input.version < 1 ||
    input.confirmed !== true
  )
    throw new AuthProviderError("invalid_input");
}

/** Base ACL metadata only. Domain permissions must still be resolved separately. */
export class PermissionService {
  constructor(private readonly db: ReturnType<typeof createDatabase>) {}

  async inspect(
    token: string,
    resourceId: string,
  ): Promise<BasePermissionInspection | null> {
    const sessionHash = hash(token);
    ids(resourceId);
    // Session and object access are evaluated together in the database on every call.
    const result = await this.db.query<BasePermissionInspection>(
      "SELECT resource_id,resource_version,role,base_read_allowed,read_reason FROM app_internal.inspect_resource_access($1,$2)",
      [sessionHash, resourceId],
    );
    return result.rows[0] ?? null;
  }
  async grants(token: string, resourceId: string) {
    ids(resourceId);
    return (
      await this.db.query<ResourceGrant>(
        "SELECT grant_id,resource_version,grantee_id,space_id,role,granted_at FROM app_internal.list_owned_resource_grants($1,$2)",
        [hash(token), resourceId],
      )
    ).rows;
  }
  async grant(
    token: string,
    input: Mutation & {
      spaceId: string;
      recipientId: string;
      role: "viewer" | "commenter" | "editor";
    },
  ) {
    mutation(input);
    ids(input.spaceId, input.recipientId);
    if (!["viewer", "commenter", "editor"].includes(input.role))
      throw new AuthProviderError("invalid_input");
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.issue_resource_grant($1,$2,$3,$4,$5,$6,$7,$8) AS id",
      [
        hash(token),
        input.commandId,
        input.resourceId,
        input.spaceId,
        input.recipientId,
        input.role,
        input.version,
        input.confirmed,
      ],
    );
    if (!result.rows[0]?.id) throw new AuthProviderError("denied");
    return { grantId: result.rows[0].id };
  }
  async revoke(token: string, input: Mutation & { grantId: string }) {
    mutation(input);
    ids(input.grantId);
    const result = await this.db.query<{ id: string }>(
      "SELECT app_internal.revoke_resource_grant($1,$2,$3,$4,$5,$6) AS id",
      [
        hash(token),
        input.commandId,
        input.resourceId,
        input.grantId,
        input.version,
        input.confirmed,
      ],
    );
    if (!result.rows[0]?.id) throw new AuthProviderError("denied");
    return { grantId: result.rows[0].id };
  }

  async options(token: string, resourceId: string) {
    ids(resourceId);
    return (
      await this.db.query<SharingOption>(
        "SELECT resource_version,space_id,recipient_id,recipient_name,role FROM app_internal.resource_sharing_options($1,$2)",
        [hash(token), resourceId],
      )
    ).rows;
  }
}
