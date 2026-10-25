-- Fresh recovery proof may renew a lost/expired pending receipt without opening the gate.
CREATE OR REPLACE FUNCTION app_internal.begin_credential_change(p_token text, p_id uuid, p_receipt text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE actor uuid; existing_id uuid;
BEGIN
  actor := (app_internal.provider_claims(p_token)->>'sub')::uuid;
  PERFORM 1 FROM m10.accounts WHERE id = actor AND state = 'active' FOR UPDATE;
  IF NOT FOUND OR p_id IS NULL OR p_receipt IS NULL OR p_receipt !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Credential change denied';
  END IF;
  PERFORM app_internal.invalidate_credential_sessions(p_token, p_id);
  SELECT id INTO existing_id FROM m10.credential_changes
    WHERE account_id = actor AND completed_at IS NULL FOR UPDATE;
  IF FOUND THEN
    UPDATE m10.credential_changes SET receipt_hash = p_receipt WHERE id = existing_id;
    RETURN existing_id;
  END IF;
  INSERT INTO m10.credential_changes(id, account_id, receipt_hash) VALUES (p_id, actor, p_receipt);
  RETURN p_id;
END;
$$;
REVOKE ALL ON FUNCTION app_internal.begin_credential_change(text,uuid,text) FROM PUBLIC;
