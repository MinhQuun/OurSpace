-- Mandatory internal lifecycle gate for future shared-domain mutations.
-- Call inside the same transaction as object ACL checks and the actual write.
-- This gate does NOT confer object permission or permit reading private content.
CREATE FUNCTION app_internal.lock_active_space_write(p_session_hash text,p_space uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
DECLARE actor uuid; current_state text;
BEGIN
  actor:=app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR NOT EXISTS(SELECT 1 FROM m10.couple_memberships
    WHERE space_id=p_space AND account_id=actor) THEN
    RAISE EXCEPTION 'shared write denied' USING ERRCODE='42501';
  END IF;
  -- Order matches disconnect/pairing; locks live until surrounding transaction ends.
  PERFORM 1 FROM m10.accounts WHERE id IN
    (SELECT account_id FROM m10.couple_memberships WHERE space_id=p_space) ORDER BY id FOR SHARE;
  IF app_internal.session_actor(p_session_hash) IS DISTINCT FROM actor THEN
    RAISE EXCEPTION 'shared write denied' USING ERRCODE='42501';
  END IF;
  PERFORM 1 FROM m10.sessions WHERE account_id=actor AND token_hash=p_session_hash
    AND revoked_at IS NULL AND expires_at>clock_timestamp() FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'shared write denied' USING ERRCODE='42501'; END IF;
  SELECT state INTO current_state FROM m10.couple_spaces WHERE id=p_space FOR SHARE;
  IF current_state IS DISTINCT FROM 'active' THEN
    RAISE EXCEPTION 'shared write denied' USING ERRCODE='42501';
  END IF;
  RETURN actor;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.lock_active_space_write(text,uuid) FROM PUBLIC;
