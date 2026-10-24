-- Receipt binds acknowledgment to the response containing recovery codes.
-- Only its SHA-256 digest is persisted, never the receipt or recovery codes.
ALTER TABLE m10.mfa_enrollments ADD COLUMN recovery_receipt_hash text
  CHECK (recovery_receipt_hash ~ '^[0-9a-f]{64}$');
CREATE FUNCTION app_internal.record_mfa_recovery(
  p_token_hash text, p_provider_token text, p_enrollment_id uuid,
  p_expected_version bigint, p_receipt_hash text, p_acknowledge boolean
) RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE actor uuid; claims jsonb; enrollment m10.mfa_enrollments%ROWTYPE;
  result_version bigint;
BEGIN
  actor := app_internal.session_actor(p_token_hash);
  claims := app_internal.provider_claims(p_provider_token);
  IF actor IS NULL OR actor IS DISTINCT FROM (claims->>'sub')::uuid
    OR claims->>'aal' IS DISTINCT FROM 'aal2' OR p_acknowledge IS NULL
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
  IF p_acknowledge THEN
    IF enrollment.recovery_issued_at IS NULL
      OR enrollment.recovery_receipt_hash IS DISTINCT FROM p_receipt_hash THEN
      RAISE EXCEPTION 'Recovery acknowledgment denied' USING ERRCODE = '23514';
    END IF;
    UPDATE m10.mfa_enrollments SET recovery_acknowledged_at = clock_timestamp(),
      enabled_at = clock_timestamp(), state = 'enabled', recovery_receipt_hash = NULL
      WHERE id = enrollment.id RETURNING version INTO result_version;
  ELSE
    -- A same-receipt retry is harmless. A different issuance must first be
    -- reconciled/rotated by a separate authorized workflow, never overwritten.
    IF enrollment.recovery_issued_at IS NOT NULL THEN
      IF enrollment.recovery_receipt_hash = p_receipt_hash THEN RETURN enrollment.version; END IF;
      RAISE EXCEPTION 'Recovery already issued' USING ERRCODE = '23514';
    END IF;
    UPDATE m10.mfa_enrollments SET recovery_issued_at = clock_timestamp(),
      recovery_receipt_hash = p_receipt_hash
      WHERE id = enrollment.id RETURNING version INTO result_version;
  END IF;
  RETURN result_version;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.record_mfa_recovery(text,text,uuid,bigint,text,boolean) FROM PUBLIC;
