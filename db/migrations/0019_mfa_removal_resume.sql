-- Validate the removal capability before provider mutation and hold the same
-- account lock used by lifecycle/issuance until cleanup transaction completes.
CREATE FUNCTION app_internal.pending_mfa_removal(
  p_provider_token text, p_enrollment_id uuid, p_receipt_hash text
) RETURNS TABLE(provider_factor_id uuid, state text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE claims jsonb; actor uuid; account_state text;
BEGIN
  claims := app_internal.provider_claims(p_provider_token);
  actor := (claims->>'sub')::uuid;
  SELECT a.state INTO account_state FROM m10.accounts a WHERE a.id = actor FOR UPDATE;
  IF account_state IS DISTINCT FROM 'active' OR p_receipt_hash IS NULL THEN
    RAISE EXCEPTION 'Authentication denied' USING ERRCODE = '28000';
  END IF;
  RETURN QUERY SELECT e.provider_factor_id, e.state FROM m10.mfa_enrollments e
    WHERE e.id = p_enrollment_id AND e.account_id = actor
      AND e.state IN ('cancelling', 'disabling') AND e.removal_receipt_hash = p_receipt_hash
    FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Removal authorization denied' USING ERRCODE = '28000'; END IF;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.pending_mfa_removal(text,uuid,text) FROM PUBLIC;
