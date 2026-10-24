-- Server orchestration resolves the bound factor from private storage rather
-- than allowing a browser to choose which provider factor to verify.
CREATE FUNCTION app_internal.bound_mfa_factor(p_token_hash text, p_enrollment_id uuid)
RETURNS TABLE(provider_factor_id uuid, state text, version bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $function$
  SELECT e.provider_factor_id, e.state, e.version FROM m10.mfa_enrollments e
  WHERE e.id = p_enrollment_id
    AND e.account_id = app_internal.session_actor(p_token_hash)
    AND e.state NOT IN ('cancelled', 'disabled');
$function$;
REVOKE ALL ON FUNCTION app_internal.bound_mfa_factor(text,uuid) FROM PUBLIC;
