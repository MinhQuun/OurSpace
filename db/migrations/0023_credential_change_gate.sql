CREATE TABLE m10.credential_changes (
  id uuid PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  receipt_hash text NOT NULL CHECK (receipt_hash ~ '^[0-9a-f]{64}$'),
  started_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  completed_at timestamptz,
  CHECK (completed_at IS NULL OR completed_at >= started_at)
);
CREATE UNIQUE INDEX credential_change_pending ON m10.credential_changes(account_id) WHERE completed_at IS NULL;
ALTER TABLE m10.credential_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.credential_changes FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.credential_changes FROM PUBLIC;

-- Begin commits before external mutation; the random receipt must be delivered
-- before mutation. Only a same-identity proof + receipt may complete the gate.
CREATE FUNCTION app_internal.begin_credential_change(p_token text, p_id uuid, p_receipt text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE actor uuid;
BEGIN
  actor := (app_internal.provider_claims(p_token)->>'sub')::uuid;
  PERFORM 1 FROM m10.accounts WHERE id = actor AND state = 'active' FOR UPDATE;
  IF NOT FOUND OR p_id IS NULL OR p_receipt IS NULL OR p_receipt !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Credential change denied';
  END IF;
  PERFORM app_internal.invalidate_credential_sessions(p_token, p_id);
  INSERT INTO m10.credential_changes(id, account_id, receipt_hash) VALUES (p_id, actor, p_receipt);
  RETURN p_id;
END;
$$;
REVOKE ALL ON FUNCTION app_internal.begin_credential_change(text,uuid,text) FROM PUBLIC;

CREATE FUNCTION app_internal.finish_credential_change(p_token text, p_id uuid, p_receipt text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE actor uuid; change m10.credential_changes%ROWTYPE;
BEGIN
  actor := (app_internal.provider_claims(p_token)->>'sub')::uuid;
  PERFORM 1 FROM m10.accounts WHERE id = actor AND state = 'active' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Credential change denied'; END IF;
  SELECT * INTO change FROM m10.credential_changes WHERE id = p_id AND account_id = actor FOR UPDATE;
  IF NOT FOUND OR change.completed_at IS NOT NULL OR p_receipt IS DISTINCT FROM change.receipt_hash THEN
    RAISE EXCEPTION 'Credential change denied';
  END IF;
  -- Recheck signed assurance and advance cutoff after provider completion.
  PERFORM app_internal.invalidate_credential_sessions(p_token, gen_random_uuid());
  UPDATE m10.credential_changes SET completed_at = clock_timestamp() WHERE id = p_id;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION app_internal.finish_credential_change(text,uuid,text) FROM PUBLIC;

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
  IF EXISTS (SELECT 1 FROM m10.credential_changes WHERE account_id = p_account_id AND completed_at IS NULL) THEN
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
