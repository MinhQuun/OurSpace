-- Renew a lost prepare response only after another live-session AAL2 proof.
-- Preserves removal intent and replaces the prior capability atomically.
CREATE OR REPLACE FUNCTION app_internal.authorize_mfa_removal(
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
    OR enrollment.state NOT IN ('pending', 'verified', 'enabled', 'cancelling', 'disabling')
    OR enrollment.provider_factor_id IS NULL
    OR enrollment.version IS DISTINCT FROM p_expected_version THEN
    RAISE EXCEPTION 'Enrollment transition denied' USING ERRCODE = '23514';
  END IF;
  next_state := CASE WHEN enrollment.state IN ('enabled', 'disabling') THEN 'disabling' ELSE 'cancelling' END;
  UPDATE m10.mfa_enrollments SET state = next_state, removal_receipt_hash = p_receipt_hash,
    recovery_receipt_hash = NULL WHERE id = enrollment.id;
  RETURN next_state;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.authorize_mfa_removal(text,text,uuid,bigint,text) FROM PUBLIC;

