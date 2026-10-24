-- Called only by server orchestration after it has obtained/verified the factor
-- directly with the provider. JWT proves actor and assurance; factor ownership
-- must also be checked against the provider's current factor response.
CREATE FUNCTION app_internal.record_mfa_factor(
  p_token_hash text, p_provider_token text, p_enrollment_id uuid,
  p_expected_version bigint, p_factor_id uuid, p_verified boolean
) RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE actor uuid; claims jsonb; enrollment m10.mfa_enrollments%ROWTYPE;
  result_version bigint;
BEGIN
  actor := app_internal.session_actor(p_token_hash);
  claims := app_internal.provider_claims(p_provider_token);
  IF actor IS NULL OR actor IS DISTINCT FROM (claims->>'sub')::uuid
    OR p_factor_id IS NULL OR p_verified IS NULL
    OR (p_verified AND claims->>'aal' IS DISTINCT FROM 'aal2') THEN
    RAISE EXCEPTION 'Authentication denied' USING ERRCODE = '28000';
  END IF;
  PERFORM 1 FROM m10.accounts WHERE id = actor FOR UPDATE;
  IF app_internal.session_actor(p_token_hash) IS DISTINCT FROM actor THEN
    RAISE EXCEPTION 'Authentication denied' USING ERRCODE = '28000';
  END IF;
  SELECT * INTO enrollment FROM m10.mfa_enrollments
    WHERE id = p_enrollment_id AND account_id = actor FOR UPDATE;
  IF NOT FOUND OR enrollment.state <> 'pending'
    OR enrollment.version IS DISTINCT FROM p_expected_version
    OR (enrollment.provider_factor_id IS NOT NULL AND enrollment.provider_factor_id <> p_factor_id)
    OR (p_verified AND enrollment.provider_factor_id IS NULL) THEN
    RAISE EXCEPTION 'Enrollment transition denied' USING ERRCODE = '23514';
  END IF;
  IF NOT p_verified AND enrollment.provider_factor_id = p_factor_id THEN
    RETURN enrollment.version;
  END IF;
  UPDATE m10.mfa_enrollments SET provider_factor_id = p_factor_id,
    state = CASE WHEN p_verified THEN 'verified' ELSE 'pending' END,
    verified_at = CASE WHEN p_verified THEN clock_timestamp() ELSE NULL END
    WHERE id = enrollment.id RETURNING version INTO result_version;
  RETURN result_version;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.record_mfa_factor(text,text,uuid,bigint,uuid,boolean) FROM PUBLIC;
