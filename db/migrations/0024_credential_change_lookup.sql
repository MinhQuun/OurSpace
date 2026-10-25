-- Validate and lock capability before external mutation. Caller retains this
-- transaction through provider verification and finalization.
CREATE FUNCTION app_internal.pending_credential_change(p_token text, p_id uuid, p_receipt text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE claims jsonb; actor uuid; change_id uuid;
BEGIN
  claims := app_internal.provider_claims(p_token);
  actor := (claims->>'sub')::uuid;
  PERFORM 1 FROM m10.accounts WHERE id = actor AND state = 'active' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Credential change denied'; END IF;
  IF EXISTS (SELECT 1 FROM m10.mfa_enrollments WHERE account_id = actor
      AND verified_at IS NOT NULL AND state NOT IN ('cancelled','disabled'))
      AND claims->>'aal' IS DISTINCT FROM 'aal2' THEN
    RAISE EXCEPTION 'Credential change denied';
  END IF;
  SELECT id INTO change_id FROM m10.credential_changes
    WHERE id = p_id AND account_id = actor AND receipt_hash = p_receipt AND completed_at IS NULL FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Credential change denied'; END IF;
  RETURN change_id;
END;
$$;
REVOKE ALL ON FUNCTION app_internal.pending_credential_change(text,uuid,text) FROM PUBLIC;
