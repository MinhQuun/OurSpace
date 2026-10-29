-- M10 D19,D22-D24: account-scoped presentation only; no source dates or Space ACL changes.
CREATE TABLE m10.personal_preferences (
 user_id uuid PRIMARY KEY REFERENCES m10.accounts(id) ON DELETE RESTRICT,
 theme text NOT NULL DEFAULT 'system' CHECK(theme IN ('light','dark','system')),
 language text NOT NULL DEFAULT 'vi-VN' CHECK(language IN ('vi-VN')),
 timezone text NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
 date_format text NOT NULL DEFAULT 'dd/MM/yyyy' CHECK(date_format IN ('dd/MM/yyyy','MM/dd/yyyy','yyyy-MM-dd')),
 hour_cycle text NOT NULL DEFAULT 'h23' CHECK(hour_cycle IN ('h12','h23')),
 reduced_motion text NOT NULL DEFAULT 'system' CHECK(reduced_motion IN ('system','reduce')),
 font_scale numeric(3,2) NOT NULL DEFAULT 1 CHECK(font_scale BETWEEN 1 AND 2),
 version bigint NOT NULL DEFAULT 1 CHECK(version>0),
 modified_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
ALTER TABLE m10.personal_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.personal_preferences FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.personal_preferences FROM PUBLIC;
CREATE FUNCTION app_internal.guard_personal_preferences()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
 IF TG_OP='UPDATE' AND NEW.user_id<>OLD.user_id THEN
   RAISE EXCEPTION 'immutable preference owner' USING ERRCODE='23514';
 END IF;
 -- Reject arbitrary offsets/abbreviations; use named database timezone identifiers.
 IF NEW.timezone IS NULL OR NOT EXISTS(SELECT 1 FROM pg_timezone_names WHERE name=NEW.timezone
   AND (name='UTC' OR name LIKE '%/%') AND name NOT LIKE 'posix/%' AND name NOT LIKE 'right/%') THEN
   RAISE EXCEPTION 'invalid timezone' USING ERRCODE='22023';
 END IF;
 NEW.version:=CASE WHEN TG_OP='INSERT' THEN 1 ELSE OLD.version+1 END;
 NEW.modified_at:=clock_timestamp();
 RETURN NEW;
END;
$fn$;
CREATE TRIGGER guard_personal_preferences BEFORE INSERT OR UPDATE ON m10.personal_preferences
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_personal_preferences();
REVOKE ALL ON FUNCTION app_internal.guard_personal_preferences() FROM PUBLIC;
