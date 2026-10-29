-- M10 D08 / BR-M10-11,14,17. Couple-owned fields never copy personal profiles.
CREATE TABLE m10.couple_profiles (
 space_id uuid PRIMARY KEY REFERENCES m10.couple_spaces(id) ON DELETE RESTRICT,
 title text CHECK(title IS NULL OR (length(btrim(title)) BETWEEN 1 AND 120 AND title !~ '^[[:space:]]*$')),
 version bigint NOT NULL DEFAULT 1 CHECK(version>0),
 updated_by uuid NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 FOREIGN KEY(space_id,updated_by) REFERENCES m10.couple_memberships(space_id,account_id) ON DELETE RESTRICT
);
CREATE TABLE m10.couple_profile_revisions (
 space_id uuid NOT NULL REFERENCES m10.couple_profiles(space_id) ON DELETE RESTRICT,
 version bigint NOT NULL CHECK(version>0),
 title text,
 actor_id uuid NOT NULL,
 recorded_at timestamptz NOT NULL,
 PRIMARY KEY(space_id,version),
 FOREIGN KEY(space_id,actor_id) REFERENCES m10.couple_memberships(space_id,account_id) ON DELETE RESTRICT
);
ALTER TABLE m10.couple_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.couple_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE m10.couple_profile_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.couple_profile_revisions FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.couple_profiles,m10.couple_profile_revisions FROM PUBLIC;
CREATE FUNCTION app_internal.guard_couple_profile()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
 IF TG_OP='DELETE' THEN RAISE EXCEPTION 'retain profile history' USING ERRCODE='23514'; END IF;
 IF TG_OP='UPDATE' THEN
   IF NEW.space_id<>OLD.space_id THEN RAISE EXCEPTION 'immutable Space' USING ERRCODE='23514'; END IF;
   NEW.version:=OLD.version+1;
 ELSE NEW.version:=1;
 END IF;
 NEW.updated_at:=clock_timestamp();
 RETURN NEW;
END;
$fn$;
CREATE FUNCTION app_internal.record_couple_profile_revision()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
 INSERT INTO m10.couple_profile_revisions(space_id,version,title,actor_id,recorded_at)
 VALUES(NEW.space_id,NEW.version,NEW.title,NEW.updated_by,NEW.updated_at);
 RETURN NEW;
END;
$fn$;
CREATE FUNCTION app_internal.guard_couple_profile_revision()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
 RAISE EXCEPTION 'immutable profile revision' USING ERRCODE='23514';
END;
$fn$;
CREATE TRIGGER guard_couple_profile BEFORE INSERT OR UPDATE OR DELETE ON m10.couple_profiles
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_couple_profile();
CREATE TRIGGER record_couple_profile_revision AFTER INSERT OR UPDATE ON m10.couple_profiles
FOR EACH ROW EXECUTE FUNCTION app_internal.record_couple_profile_revision();
CREATE TRIGGER guard_couple_profile_revision BEFORE UPDATE OR DELETE ON m10.couple_profile_revisions
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_couple_profile_revision();
REVOKE ALL ON FUNCTION app_internal.guard_couple_profile(),app_internal.record_couple_profile_revision(),app_internal.guard_couple_profile_revision() FROM PUBLIC;
