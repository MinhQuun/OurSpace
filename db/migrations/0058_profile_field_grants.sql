-- M10 ST-02/ST-03, ENT-M10-02, BR-M10-14. No rows means no optional disclosure.
CREATE TABLE m10.profile_field_grants (
  id uuid PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES m10.profiles(user_id) ON DELETE RESTRICT,
  field text NOT NULL CHECK(field IN ('display_name','avatar_ref','nickname','birthday','bio')),
  grantee_id uuid NOT NULL,
  space_id uuid NOT NULL,
  granted_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  revoked_at timestamptz,
  FOREIGN KEY(space_id,profile_id) REFERENCES m10.couple_memberships(space_id,account_id) ON DELETE RESTRICT,
  FOREIGN KEY(space_id,grantee_id) REFERENCES m10.couple_memberships(space_id,account_id) ON DELETE RESTRICT,
  CHECK(profile_id<>grantee_id),
  CHECK(revoked_at IS NULL OR revoked_at>=granted_at)
);
CREATE UNIQUE INDEX one_live_profile_field_grant
  ON m10.profile_field_grants(profile_id,field,grantee_id,space_id) WHERE revoked_at IS NULL;
ALTER TABLE m10.profile_field_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.profile_field_grants FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.profile_field_grants FROM PUBLIC;
CREATE FUNCTION app_internal.guard_profile_field_grant()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
  IF TG_OP='DELETE' THEN RAISE EXCEPTION 'retain grant history' USING ERRCODE='23514'; END IF;
  IF (NEW.id,NEW.profile_id,NEW.field,NEW.grantee_id,NEW.space_id,NEW.granted_at)
    IS DISTINCT FROM (OLD.id,OLD.profile_id,OLD.field,OLD.grantee_id,OLD.space_id,OLD.granted_at)
    OR OLD.revoked_at IS NOT NULL OR NEW.revoked_at IS NULL THEN
    RAISE EXCEPTION 'immutable profile grant binding' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END;
$fn$;
CREATE TRIGGER guard_profile_field_grant BEFORE UPDATE OR DELETE ON m10.profile_field_grants
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_profile_field_grant();
REVOKE ALL ON FUNCTION app_internal.guard_profile_field_grant() FROM PUBLIC;
