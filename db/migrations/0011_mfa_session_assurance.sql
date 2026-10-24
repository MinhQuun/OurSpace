-- Serialize MFA changes with issuance through the existing account row lock.
-- A real row update also forces a serialization failure for stale snapshots
-- under REPEATABLE READ, rather than accepting a stale assurance policy.
ALTER TABLE m10.accounts ADD COLUMN security_version bigint NOT NULL DEFAULT 1
  CHECK (security_version > 0);
CREATE FUNCTION app_internal.lock_mfa_account()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
BEGIN
  UPDATE m10.accounts SET security_version = security_version + 1
    WHERE id = NEW.account_id;
  RETURN NEW;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.lock_mfa_account() FROM PUBLIC;
CREATE TRIGGER mfa_account_serialization BEFORE UPDATE OF state ON m10.mfa_enrollments
FOR EACH ROW WHEN (NEW.state IS DISTINCT FROM OLD.state)
EXECUTE FUNCTION app_internal.lock_mfa_account();

-- Same signature preserves the runtime role's existing grant. Signature-checked
-- AAL2 is required while a verified enrollment is active or being cleaned up.
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
