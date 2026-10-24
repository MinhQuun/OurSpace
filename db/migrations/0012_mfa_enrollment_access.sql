-- Enrollment initiation needs both a live application session and signed
-- provider identity for the same account. No caller-supplied actor is trusted.
CREATE FUNCTION app_internal.begin_mfa_enrollment(
  p_token_hash text, p_provider_token text, p_enrollment_id uuid
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE actor uuid; claims jsonb; existing m10.mfa_enrollments%ROWTYPE;
BEGIN
  actor := app_internal.session_actor(p_token_hash);
  claims := app_internal.provider_claims(p_provider_token);
  IF actor IS NULL OR actor IS DISTINCT FROM (claims->>'sub')::uuid THEN
    RAISE EXCEPTION 'Authentication denied' USING ERRCODE = '28000';
  END IF;
  PERFORM 1 FROM m10.accounts WHERE id = actor FOR UPDATE;
  IF app_internal.session_actor(p_token_hash) IS DISTINCT FROM actor THEN
    RAISE EXCEPTION 'Authentication denied' USING ERRCODE = '28000';
  END IF;
  SELECT * INTO existing FROM m10.mfa_enrollments
    WHERE account_id = actor AND state NOT IN ('cancelled', 'disabled');
  IF FOUND THEN
    IF existing.id = p_enrollment_id AND existing.state = 'pending' THEN
      RETURN existing.id;
    END IF;
    RAISE EXCEPTION 'Enrollment already in progress' USING ERRCODE = '23514';
  END IF;
  INSERT INTO m10.mfa_enrollments(id, account_id) VALUES (p_enrollment_id, actor);
  RETURN p_enrollment_id;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.begin_mfa_enrollment(text,text,uuid) FROM PUBLIC;

CREATE FUNCTION app_internal.current_mfa_enrollment(p_token_hash text)
RETURNS TABLE(id uuid, state text, version bigint, created_at timestamptz,
  verified_at timestamptz, recovery_issued_at timestamptz,
  recovery_acknowledged_at timestamptz, enabled_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $function$
  SELECT e.id, e.state, e.version, e.created_at, e.verified_at,
    e.recovery_issued_at, e.recovery_acknowledged_at, e.enabled_at
  FROM m10.mfa_enrollments e
  WHERE e.account_id = app_internal.session_actor(p_token_hash)
    AND e.state NOT IN ('cancelled', 'disabled');
$function$;
REVOKE ALL ON FUNCTION app_internal.current_mfa_enrollment(text) FROM PUBLIC;
