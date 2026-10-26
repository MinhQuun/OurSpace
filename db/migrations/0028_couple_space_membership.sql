-- M10 D01/D02/D05/D06: immutable paired identities, no privileged member role.
CREATE TABLE m10.couple_spaces (
  id uuid PRIMARY KEY,
  invitation_id uuid NOT NULL UNIQUE REFERENCES m10.pairing_invitations(id) ON DELETE RESTRICT,
  state text NOT NULL DEFAULT 'active' CHECK (state IN ('active','disconnecting','frozen','archived','closed')),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  UNIQUE (id,state)
);
CREATE TABLE m10.couple_memberships (
  space_id uuid NOT NULL,
  account_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  slot smallint NOT NULL CHECK (slot IN (1,2)),
  space_state text NOT NULL DEFAULT 'active',
  joined_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (space_id,account_id),
  UNIQUE (space_id,slot),
  FOREIGN KEY (space_id,space_state) REFERENCES m10.couple_spaces(id,state)
    ON UPDATE CASCADE ON DELETE RESTRICT
);
-- The FK keeps the indexed state consistent even during a parent transition.
CREATE UNIQUE INDEX one_active_couple_space_per_account
  ON m10.couple_memberships(account_id) WHERE space_state = 'active';
ALTER TABLE m10.couple_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.couple_spaces FORCE ROW LEVEL SECURITY;
ALTER TABLE m10.couple_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.couple_memberships FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.couple_spaces,m10.couple_memberships FROM PUBLIC;

CREATE FUNCTION app_internal.check_couple_membership()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE target uuid; invitation m10.pairing_invitations%ROWTYPE; total integer; matched integer;
BEGIN
  IF TG_TABLE_NAME = 'couple_spaces' THEN target := NEW.id;
  ELSIF TG_OP = 'DELETE' THEN target := OLD.space_id;
  ELSE target := NEW.space_id; END IF;
  SELECT i.* INTO invitation FROM m10.couple_spaces s
    JOIN m10.pairing_invitations i ON i.id=s.invitation_id WHERE s.id=target;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT count(*),count(*) FILTER (WHERE account_id IN (invitation.creator_id,invitation.accepted_by))
    INTO total,matched FROM m10.couple_memberships WHERE space_id=target;
  IF invitation.state <> 'consumed' OR total <> 2 OR matched <> 2 THEN
    RAISE EXCEPTION 'space requires exactly two consenting identities' USING ERRCODE='23514';
  END IF;
  RETURN NULL;
END
$function$;
CREATE CONSTRAINT TRIGGER couple_space_members_complete AFTER INSERT OR UPDATE ON m10.couple_spaces
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION app_internal.check_couple_membership();
CREATE CONSTRAINT TRIGGER couple_members_complete AFTER INSERT OR UPDATE OR DELETE ON m10.couple_memberships
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION app_internal.check_couple_membership();

CREATE FUNCTION app_internal.guard_couple_identity()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog, pg_temp
AS $function$
BEGIN
  IF TG_TABLE_NAME = 'couple_memberships' THEN
    IF (NEW.space_id,NEW.account_id,NEW.slot,NEW.joined_at)
      IS DISTINCT FROM (OLD.space_id,OLD.account_id,OLD.slot,OLD.joined_at) THEN
      RAISE EXCEPTION 'immutable couple membership' USING ERRCODE='23514';
    END IF;
  ELSE
    IF (NEW.id,NEW.invitation_id,NEW.created_at) IS DISTINCT FROM (OLD.id,OLD.invitation_id,OLD.created_at)
      OR NOT ((OLD.state='active' AND NEW.state='disconnecting')
        OR (OLD.state='disconnecting' AND NEW.state='frozen')
        OR (OLD.state='frozen' AND NEW.state IN ('archived','closed'))
        OR (OLD.state='archived' AND NEW.state='closed')) THEN
      RAISE EXCEPTION 'invalid couple space transition' USING ERRCODE='23514';
    END IF;
    NEW.version := OLD.version+1;
  END IF;
  RETURN NEW;
END
$function$;
CREATE TRIGGER guard_couple_identity BEFORE UPDATE ON m10.couple_spaces
  FOR EACH ROW EXECUTE FUNCTION app_internal.guard_couple_identity();
CREATE TRIGGER guard_couple_identity BEFORE UPDATE ON m10.couple_memberships
  FOR EACH ROW EXECUTE FUNCTION app_internal.guard_couple_identity();
REVOKE ALL ON FUNCTION app_internal.check_couple_membership(),app_internal.guard_couple_identity() FROM PUBLIC;
