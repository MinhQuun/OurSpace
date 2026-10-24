-- Reserve a new acknowledgment receipt durably BEFORE provider rotation.
-- A failed/lost rotation cannot leave an older receipt eligible for activation.
CREATE FUNCTION app_internal.replace_mfa_recovery_receipt(
  p_token_hash text, p_provider_token text, p_enrollment_id uuid,
  p_expected_version bigint, p_receipt_hash text
) RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE actor uuid; claims jsonb; enrollment m10.mfa_enrollments%ROWTYPE;
  result_version bigint;
BEGIN
  actor := app_internal.session_actor(p_token_hash);
  claims := app_internal.provider_claims(p_provider_token);
  IF actor IS NULL OR actor IS DISTINCT FROM (claims->>'sub')::uuid
    OR claims->>'aal' IS DISTINCT FROM 'aal2'
    OR p_receipt_hash IS NULL OR p_receipt_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Authentication denied' USING ERRCODE = '28000';
  END IF;
  PERFORM 1 FROM m10.accounts WHERE id = actor FOR UPDATE;
  IF app_internal.session_actor(p_token_hash) IS DISTINCT FROM actor THEN
    RAISE EXCEPTION 'Authentication denied' USING ERRCODE = '28000';
  END IF;
  SELECT * INTO enrollment FROM m10.mfa_enrollments
    WHERE id = p_enrollment_id AND account_id = actor FOR UPDATE;
  IF NOT FOUND OR enrollment.state <> 'verified'
    OR enrollment.version IS DISTINCT FROM p_expected_version THEN
    RAISE EXCEPTION 'Enrollment transition denied' USING ERRCODE = '23514';
  END IF;
  IF enrollment.recovery_receipt_hash = p_receipt_hash THEN RETURN enrollment.version; END IF;
  UPDATE m10.mfa_enrollments SET recovery_receipt_hash = p_receipt_hash,
    recovery_issued_at = coalesce(recovery_issued_at, clock_timestamp())
    WHERE id = enrollment.id RETURNING version INTO result_version;
  RETURN result_version;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.replace_mfa_recovery_receipt(text,text,uuid,bigint,text) FROM PUBLIC;
