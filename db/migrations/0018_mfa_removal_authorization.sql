ALTER TABLE m10.mfa_enrollments ADD COLUMN removal_receipt_hash text
  CHECK (removal_receipt_hash ~ '^[0-9a-f]{64}$');

CREATE FUNCTION app_internal.authorize_mfa_removal(
  p_token_hash text, p_provider_token text, p_enrollment_id uuid,
  p_expected_version bigint, p_receipt_hash text
) RETURNS text LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE actor uuid; claims jsonb; enrollment m10.mfa_enrollments%ROWTYPE; next_state text;
BEGIN
  actor := app_internal.session_actor(p_token_hash);
  claims := app_internal.provider_claims(p_provider_token);
  IF actor IS NULL OR actor IS DISTINCT FROM (claims->>'sub')::uuid
    OR claims->>'aal' IS DISTINCT FROM 'aal2' OR p_receipt_hash IS NULL
    OR p_receipt_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Authentication denied' USING ERRCODE = '28000';
  END IF;
  PERFORM 1 FROM m10.accounts WHERE id = actor FOR UPDATE;
  SELECT * INTO enrollment FROM m10.mfa_enrollments
    WHERE id = p_enrollment_id AND account_id = actor FOR UPDATE;
  IF NOT FOUND OR app_internal.session_actor(p_token_hash) IS DISTINCT FROM actor
    OR enrollment.state NOT IN ('pending', 'verified', 'enabled')
    OR enrollment.provider_factor_id IS NULL
    OR enrollment.version IS DISTINCT FROM p_expected_version THEN
    RAISE EXCEPTION 'Enrollment transition denied' USING ERRCODE = '23514';
  END IF;
  next_state := CASE WHEN enrollment.state = 'enabled' THEN 'disabling' ELSE 'cancelling' END;
  UPDATE m10.mfa_enrollments SET state = next_state, removal_receipt_hash = p_receipt_hash,
    recovery_receipt_hash = NULL WHERE id = enrollment.id;
  RETURN next_state;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.authorize_mfa_removal(text,text,uuid,bigint,text) FROM PUBLIC;

-- Resume requires fresh signed identity AND the random capability issued only
-- after AAL2 authorization. This remains usable after provider factor removal,
-- when another TOTP challenge is impossible. Server must confirm cleanup first.
CREATE FUNCTION app_internal.finish_mfa_removal(
  p_provider_token text, p_enrollment_id uuid, p_receipt_hash text
) RETURNS text LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE claims jsonb; actor uuid; account_state text;
  enrollment m10.mfa_enrollments%ROWTYPE; final_state text;
BEGIN
  claims := app_internal.provider_claims(p_provider_token);
  actor := (claims->>'sub')::uuid;
  SELECT state INTO account_state FROM m10.accounts WHERE id = actor FOR UPDATE;
  IF account_state IS DISTINCT FROM 'active' OR p_receipt_hash IS NULL THEN
    RAISE EXCEPTION 'Authentication denied' USING ERRCODE = '28000';
  END IF;
  SELECT * INTO enrollment FROM m10.mfa_enrollments
    WHERE id = p_enrollment_id AND account_id = actor FOR UPDATE;
  IF NOT FOUND OR enrollment.state NOT IN ('cancelling', 'disabling')
    OR enrollment.removal_receipt_hash IS DISTINCT FROM p_receipt_hash THEN
    RAISE EXCEPTION 'Removal authorization denied' USING ERRCODE = '28000';
  END IF;
  final_state := CASE WHEN enrollment.state = 'disabling' THEN 'disabled' ELSE 'cancelled' END;
  UPDATE m10.mfa_enrollments SET state = final_state, removal_receipt_hash = NULL
    WHERE id = enrollment.id;
  RETURN final_state;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.finish_mfa_removal(text,uuid,text) FROM PUBLIC;
