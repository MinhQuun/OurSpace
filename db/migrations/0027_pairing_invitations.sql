-- M10 D04-D05, UC-M10-03..05: capability metadata, never plaintext tokens.
-- No runtime grants: actor checks and atomic Space activation follow separately.
CREATE TABLE m10.pairing_invitations (
  id uuid PRIMARY KEY,
  creator_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  token_hash text NOT NULL UNIQUE CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  state text NOT NULL DEFAULT 'pending' CHECK (state IN
    ('pending','awaiting_confirmation','consumed','rejected','revoked','expired')),
  created_at timestamptz NOT NULL DEFAULT transaction_timestamp(),
  expires_at timestamptz NOT NULL DEFAULT transaction_timestamp() + interval '48 hours',
  accepted_by uuid REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  accepted_at timestamptz,
  confirmed_at timestamptz,
  ended_at timestamptz,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  CHECK (expires_at = created_at + interval '48 hours'),
  CHECK (accepted_by IS NULL OR accepted_by <> creator_id),
  CHECK ((accepted_by IS NULL) = (accepted_at IS NULL)),
  CHECK (accepted_at IS NULL OR (accepted_at >= created_at AND accepted_at < expires_at)),
  CHECK (confirmed_at IS NULL OR
    (accepted_at IS NOT NULL AND confirmed_at >= accepted_at AND confirmed_at < expires_at)),
  CHECK (state <> 'pending' OR accepted_by IS NULL),
  CHECK (state NOT IN ('awaiting_confirmation','consumed') OR accepted_by IS NOT NULL),
  CHECK ((state = 'consumed') = (confirmed_at IS NOT NULL)),
  CHECK ((state IN ('consumed','rejected','revoked','expired')) = (ended_at IS NOT NULL)),
  CHECK (ended_at IS NULL OR ended_at >= created_at)
);
CREATE INDEX pairing_invitations_creator ON m10.pairing_invitations(creator_id, created_at DESC);
CREATE INDEX pairing_invitations_recipient ON m10.pairing_invitations(accepted_by)
  WHERE accepted_by IS NOT NULL;
ALTER TABLE m10.pairing_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.pairing_invitations FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.pairing_invitations FROM PUBLIC;

CREATE FUNCTION app_internal.guard_pairing_invitation()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog, pg_temp
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.state <> 'pending' OR NEW.version <> 1 THEN
      RAISE EXCEPTION 'invalid invitation initial state' USING ERRCODE = '23514';
    END IF;
    RETURN NEW;
  END IF;
  IF (NEW.id,NEW.creator_id,NEW.token_hash,NEW.created_at,NEW.expires_at)
    IS DISTINCT FROM (OLD.id,OLD.creator_id,OLD.token_hash,OLD.created_at,OLD.expires_at)
    OR OLD.state IN ('consumed','rejected','revoked','expired')
    OR (OLD.accepted_by IS NOT NULL AND
      (NEW.accepted_by,NEW.accepted_at) IS DISTINCT FROM (OLD.accepted_by,OLD.accepted_at)) THEN
    RAISE EXCEPTION 'immutable invitation' USING ERRCODE = '23514';
  END IF;
  IF NOT ((OLD.state = 'pending' AND NEW.state IN ('awaiting_confirmation','rejected','revoked','expired'))
    OR (OLD.state = 'awaiting_confirmation' AND NEW.state IN ('consumed','rejected','revoked','expired'))) THEN
    RAISE EXCEPTION 'invalid invitation transition' USING ERRCODE = '23514';
  END IF;
  IF (NEW.state IN ('awaiting_confirmation','consumed') AND clock_timestamp() >= OLD.expires_at)
    OR (NEW.state = 'expired' AND clock_timestamp() < OLD.expires_at) THEN
    RAISE EXCEPTION 'invalid invitation expiry' USING ERRCODE = '23514';
  END IF;
  NEW.version := OLD.version + 1;
  RETURN NEW;
END
$function$;
CREATE TRIGGER guard_pairing_invitation BEFORE INSERT OR UPDATE
  ON m10.pairing_invitations FOR EACH ROW EXECUTE FUNCTION app_internal.guard_pairing_invitation();
REVOKE ALL ON FUNCTION app_internal.guard_pairing_invitation() FROM PUBLIC;
