-- M10 D33/D34: one immutable disconnect origin, independent of later disposition.
-- Command layer must insert this record and transition Space in one transaction.
CREATE TABLE m10.space_disconnects (
  space_id uuid PRIMARY KEY REFERENCES m10.couple_spaces(id) ON DELETE RESTRICT,
  initiated_by uuid NOT NULL,
  initiated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  processing_until timestamptz GENERATED ALWAYS AS (((initiated_at AT TIME ZONE 'UTC') + interval '30 days') AT TIME ZONE 'UTC') STORED,
  FOREIGN KEY (space_id,initiated_by) REFERENCES m10.couple_memberships(space_id,account_id) ON DELETE RESTRICT
);
ALTER TABLE m10.space_disconnects ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.space_disconnects FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.space_disconnects FROM PUBLIC;
CREATE FUNCTION app_internal.guard_disconnect_record()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp
AS $function$
BEGIN
  RAISE EXCEPTION 'immutable disconnect origin' USING ERRCODE='23514';
END;
$function$;
CREATE TRIGGER immutable_disconnect_origin BEFORE UPDATE OR DELETE ON m10.space_disconnects
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_disconnect_record();
CREATE FUNCTION app_internal.check_disconnect_state()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
BEGIN
  IF EXISTS (SELECT 1 FROM m10.couple_spaces WHERE id=NEW.space_id AND state='active') THEN
    RAISE EXCEPTION 'disconnect requires inactive space' USING ERRCODE='23514';
  END IF;
  RETURN NULL;
END;
$function$;
CREATE CONSTRAINT TRIGGER disconnect_requires_inactive_space AFTER INSERT ON m10.space_disconnects
DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION app_internal.check_disconnect_state();
REVOKE ALL ON FUNCTION app_internal.guard_disconnect_record(),app_internal.check_disconnect_state() FROM PUBLIC;
