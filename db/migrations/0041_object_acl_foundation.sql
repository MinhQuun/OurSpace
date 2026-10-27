-- M10 D13-D18: no grant means Private; registry contains no domain content.
CREATE TABLE m10.resources (
  id uuid PRIMARY KEY,
  module text NOT NULL CHECK(module ~ '^M0[1-9]$'),
  kind text NOT NULL CHECK(kind ~ '^[a-z][a-z0-9_]{0,63}$'),
  owner_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  access_mode text NOT NULL DEFAULT 'standard' CHECK(access_mode IN ('standard','conditional')),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  deleted_at timestamptz,
  version bigint NOT NULL DEFAULT 1 CHECK(version>0),
  UNIQUE(id,owner_id),
  CHECK(deleted_at IS NULL OR deleted_at>=created_at)
);
CREATE TABLE m10.resource_grants (
  id uuid PRIMARY KEY,
  resource_id uuid NOT NULL,
  granted_by uuid NOT NULL,
  grantee_id uuid NOT NULL,
  space_id uuid NOT NULL,
  role text NOT NULL CHECK(role IN ('editor','contributor','commenter','viewer')),
  granted_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  revoked_at timestamptz,
  FOREIGN KEY(resource_id,granted_by) REFERENCES m10.resources(id,owner_id) ON DELETE RESTRICT,
  FOREIGN KEY(space_id,granted_by) REFERENCES m10.couple_memberships(space_id,account_id) ON DELETE RESTRICT,
  FOREIGN KEY(space_id,grantee_id) REFERENCES m10.couple_memberships(space_id,account_id) ON DELETE RESTRICT,
  CHECK(granted_by<>grantee_id),
  CHECK(revoked_at IS NULL OR revoked_at>=granted_at)
);
CREATE UNIQUE INDEX one_live_resource_grant ON m10.resource_grants(resource_id,grantee_id,space_id) WHERE revoked_at IS NULL;
ALTER TABLE m10.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.resources FORCE ROW LEVEL SECURITY;
ALTER TABLE m10.resource_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.resource_grants FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.resources,m10.resource_grants FROM PUBLIC;
CREATE FUNCTION app_internal.guard_resource_identity()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp
AS $function$
BEGIN
  IF (NEW.id,NEW.module,NEW.kind,NEW.owner_id,NEW.created_at) IS DISTINCT FROM
     (OLD.id,OLD.module,OLD.kind,OLD.owner_id,OLD.created_at) THEN
    RAISE EXCEPTION 'immutable resource identity' USING ERRCODE='23514';
  END IF;
  NEW.version:=OLD.version+1;
  RETURN NEW;
END;
$function$;
CREATE TRIGGER guard_resource_identity BEFORE UPDATE ON m10.resources
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_resource_identity();
CREATE FUNCTION app_internal.guard_resource_grant()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp
AS $function$
BEGIN
  IF TG_OP='DELETE' THEN RAISE EXCEPTION 'retain grant history' USING ERRCODE='23514'; END IF;
  IF (NEW.id,NEW.resource_id,NEW.granted_by,NEW.grantee_id,NEW.space_id,NEW.role,NEW.granted_at)
     IS DISTINCT FROM (OLD.id,OLD.resource_id,OLD.granted_by,OLD.grantee_id,OLD.space_id,OLD.role,OLD.granted_at)
     OR OLD.revoked_at IS NOT NULL OR NEW.revoked_at IS NULL THEN
    RAISE EXCEPTION 'immutable grant binding' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END;
$function$;
CREATE TRIGGER guard_resource_grant BEFORE UPDATE OR DELETE ON m10.resource_grants
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_resource_grant();
REVOKE ALL ON FUNCTION app_internal.guard_resource_identity(),app_internal.guard_resource_grant() FROM PUBLIC;
