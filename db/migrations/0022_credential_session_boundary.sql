-- Boundary for credential mutation orchestration; not a password reset endpoint.
ALTER TABLE m10.accounts ADD COLUMN credentials_invalid_before bigint;
ALTER TABLE m10.session_revocations DROP CONSTRAINT session_revocations_reason_check;
ALTER TABLE m10.session_revocations ADD CONSTRAINT session_revocations_reason_check
  CHECK (reason IN ('user_revoked', 'account_inactive', 'mfa_changed', 'credentials_invalidated'));
CREATE TABLE m10.credential_security_events (
  id uuid PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  invalid_before bigint NOT NULL
);
ALTER TABLE m10.credential_security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.credential_security_events FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.credential_security_events FROM PUBLIC;

CREATE FUNCTION app_internal.invalidate_credential_sessions(p_token text, p_event uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp AS $$
DECLARE claims jsonb; actor uuid; cutoff bigint;
BEGIN
  claims := app_internal.provider_claims(p_token);
  actor := (claims->>'sub')::uuid;
  PERFORM 1 FROM m10.accounts WHERE id = actor AND state = 'active' FOR UPDATE;
  IF NOT FOUND OR p_event IS NULL THEN RAISE EXCEPTION 'Credential operation denied'; END IF;
  IF EXISTS (SELECT 1 FROM m10.mfa_enrollments WHERE account_id = actor
      AND verified_at IS NOT NULL AND state NOT IN ('cancelled','disabled'))
      AND claims->>'aal' IS DISTINCT FROM 'aal2' THEN
    RAISE EXCEPTION 'Credential operation denied';
  END IF;
  IF EXISTS (SELECT 1 FROM m10.credential_security_events WHERE id = p_event AND account_id = actor) THEN
    RETURN false;
  END IF;
  cutoff := floor(extract(epoch FROM clock_timestamp()))::bigint;
  INSERT INTO m10.credential_security_events(id, account_id, invalid_before) VALUES (p_event, actor, cutoff);
  UPDATE m10.accounts SET credentials_invalid_before = greatest(coalesce(credentials_invalid_before, cutoff), cutoff),
    security_version = security_version + 1 WHERE id = actor;
  WITH changed AS (
    UPDATE m10.sessions SET revoked_at = greatest(created_at, clock_timestamp())
    WHERE account_id = actor AND revoked_at IS NULL RETURNING id, revoked_at
  ) INSERT INTO m10.session_revocations(session_id, actor_id, revoked_at, reason)
    SELECT id, actor, revoked_at, 'credentials_invalidated' FROM changed;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION app_internal.invalidate_credential_sessions(text,uuid) FROM PUBLIC;

CREATE OR REPLACE FUNCTION app_internal.issue_verified_session(
  p_provider_token text, p_display_name text, p_session_id uuid,
  p_token_hash text
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE account_state text; claims jsonb; p_account_id uuid; p_expires_at timestamptz;
BEGIN
  claims := app_internal.provider_claims(p_provider_token);
  p_account_id := (claims->>'sub')::uuid;
  p_expires_at := to_timestamp((claims->>'exp')::double precision);
  IF p_expires_at IS NULL OR p_expires_at <= clock_timestamp() THEN
    RAISE EXCEPTION 'Session issuance denied';
  END IF;
  INSERT INTO m10.accounts(id, state) VALUES (p_account_id, 'active')
    ON CONFLICT (id) DO NOTHING;
  SELECT state INTO account_state FROM m10.accounts
    WHERE id = p_account_id FOR UPDATE;
  IF EXISTS (SELECT 1 FROM m10.accounts WHERE id = p_account_id
      AND credentials_invalid_before IS NOT NULL
      AND (claims->>'iat')::numeric <= credentials_invalid_before) THEN
    RAISE EXCEPTION 'Session issuance denied' USING ERRCODE = '28000';
  END IF;
  IF account_state = 'pending_verification' THEN
    UPDATE m10.accounts SET state = 'active' WHERE id = p_account_id;
  ELSIF account_state IS DISTINCT FROM 'active' THEN
    RAISE EXCEPTION 'Session issuance denied';
  END IF;
  IF EXISTS (SELECT 1 FROM m10.mfa_enrollments
      WHERE account_id = p_account_id AND verified_at IS NOT NULL
        AND state NOT IN ('cancelled', 'disabled'))
      AND claims->>'aal' IS DISTINCT FROM 'aal2' THEN
    RAISE EXCEPTION 'Session issuance denied' USING ERRCODE = '28000';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM m10.profiles WHERE user_id = p_account_id) THEN
    INSERT INTO m10.profiles(user_id, display_name)
      VALUES (p_account_id, btrim(p_display_name));
  END IF;
  INSERT INTO m10.sessions(id, account_id, token_hash, expires_at)
    VALUES (p_session_id, p_account_id, p_token_hash, p_expires_at);
  RETURN p_session_id;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.issue_verified_session(text,text,uuid,text) FROM PUBLIC;
