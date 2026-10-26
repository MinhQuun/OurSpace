-- Verified against local GoTrue 2.197.0: recovery AMR is mfa/recovery_code.
CREATE OR REPLACE FUNCTION app_internal.disconnect_actor(p_session_hash text,p_provider_token text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
DECLARE actor uuid; claims jsonb; now_epoch numeric; requires_mfa boolean;
BEGIN
  actor:=app_internal.session_actor(p_session_hash);
  claims:=app_internal.provider_claims(p_provider_token);
  IF actor IS NULL OR actor IS DISTINCT FROM (claims->>'sub')::uuid THEN
    RAISE EXCEPTION 'disconnect denied' USING ERRCODE='42501';
  END IF;
  PERFORM 1 FROM m10.accounts WHERE id=actor AND state='active' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'disconnect denied' USING ERRCODE='42501'; END IF;
  PERFORM 1 FROM m10.sessions WHERE token_hash=p_session_hash AND account_id=actor
    AND revoked_at IS NULL AND expires_at>clock_timestamp() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'disconnect denied' USING ERRCODE='42501'; END IF;
  now_epoch:=extract(epoch FROM clock_timestamp());
  IF jsonb_typeof(claims->'amr') IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'reauthentication required' USING ERRCODE='42501';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements(claims->'amr') method
    WHERE method->>'method'='password' AND jsonb_typeof(method->'timestamp')='number'
      AND (method->>'timestamp')::numeric BETWEEN now_epoch-300 AND now_epoch) THEN
    RAISE EXCEPTION 'reauthentication required' USING ERRCODE='42501';
  END IF;
  SELECT EXISTS(SELECT 1 FROM m10.mfa_enrollments WHERE account_id=actor
    AND verified_at IS NOT NULL AND state NOT IN ('cancelled','disabled')) INTO requires_mfa;
  IF requires_mfa AND (claims->>'aal' IS DISTINCT FROM 'aal2' OR NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(claims->'amr') method
    WHERE method->>'method' IN ('totp','mfa/recovery_code') AND jsonb_typeof(method->'timestamp')='number'
      AND (method->>'timestamp')::numeric BETWEEN now_epoch-300 AND now_epoch)) THEN
    RAISE EXCEPTION 'fresh MFA required' USING ERRCODE='42501';
  END IF;
  RETURN actor;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.disconnect_actor(text,text) FROM PUBLIC;
