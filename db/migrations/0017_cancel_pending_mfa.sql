CREATE FUNCTION app_internal.cancel_pending_mfa(
  p_token_hash text, p_provider_token text, p_enrollment_id uuid, p_expected_version bigint
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE actor uuid; claims jsonb; enrollment m10.mfa_enrollments%ROWTYPE;
BEGIN
  actor := app_internal.session_actor(p_token_hash);
  claims := app_internal.provider_claims(p_provider_token);
  IF actor IS NULL OR actor IS DISTINCT FROM (claims->>'sub')::uuid THEN
    RAISE EXCEPTION 'Authentication denied' USING ERRCODE = '28000';
  END IF;
  PERFORM 1 FROM m10.accounts WHERE id = actor FOR UPDATE;
  SELECT * INTO enrollment FROM m10.mfa_enrollments
    WHERE id = p_enrollment_id AND account_id = actor FOR UPDATE;
  IF app_internal.session_actor(p_token_hash) IS DISTINCT FROM actor
    OR NOT FOUND OR enrollment.state <> 'pending' OR enrollment.verified_at IS NOT NULL
    OR enrollment.version IS DISTINCT FROM p_expected_version THEN
    RAISE EXCEPTION 'Enrollment transition denied' USING ERRCODE = '23514';
  END IF;
  -- Caller has already removed the unverified provider factor under this same
  -- account lock. Two legal transitions retain terminal metadata and revoke
  -- old application sessions; no delete or resurrection of enrollment history.
  UPDATE m10.mfa_enrollments SET state = 'cancelling' WHERE id = enrollment.id;
  UPDATE m10.mfa_enrollments SET state = 'cancelled' WHERE id = enrollment.id;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.cancel_pending_mfa(text,text,uuid,bigint) FROM PUBLIC;
