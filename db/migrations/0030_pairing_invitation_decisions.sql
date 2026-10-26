CREATE FUNCTION app_internal.decide_pairing_invitation(
  p_session_hash text,p_command uuid,p_id uuid,p_action text,p_invite_hash text)
RETURNS TABLE(id uuid,state text,version bigint)
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
DECLARE actor uuid; invitation m10.pairing_invitations%ROWTYPE;
  prior app_internal.command_receipts%ROWTYPE; fingerprint text; changed_version bigint;
BEGIN
  IF p_command IS NULL OR p_id IS NULL OR p_action IS NULL OR p_action NOT IN ('accept','reject','revoke')
    OR (p_action <> 'revoke' AND (p_invite_hash IS NULL OR p_invite_hash !~ '^[0-9a-f]{64}$')) THEN
    RAISE EXCEPTION 'invalid invitation input' USING ERRCODE='22023';
  END IF;
  actor:=app_internal.session_actor(p_session_hash);
  IF actor IS NULL THEN RAISE EXCEPTION 'invitation denied' USING ERRCODE='42501'; END IF;
  SELECT * INTO invitation FROM m10.pairing_invitations i WHERE i.id=p_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'invitation denied' USING ERRCODE='42501'; END IF;
  -- Stable global account lock order prevents crossed invitations deadlocking.
  PERFORM 1 FROM m10.accounts a WHERE a.id IN (actor,invitation.creator_id) ORDER BY a.id FOR UPDATE;
  IF NOT EXISTS (SELECT 1 FROM m10.accounts a WHERE a.id=actor AND a.state='active') THEN
    RAISE EXCEPTION 'invitation denied' USING ERRCODE='42501';
  END IF;
  PERFORM 1 FROM m10.sessions s WHERE s.token_hash=p_session_hash AND s.account_id=actor
    AND s.revoked_at IS NULL AND s.expires_at>clock_timestamp() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'invitation denied' USING ERRCODE='42501'; END IF;
  SELECT * INTO invitation FROM m10.pairing_invitations i WHERE i.id=p_id FOR UPDATE;
  IF (p_action='revoke' AND actor<>invitation.creator_id)
    OR (p_action<>'revoke' AND (actor=invitation.creator_id OR p_invite_hash<>invitation.token_hash)) THEN
    RAISE EXCEPTION 'invitation denied' USING ERRCODE='42501';
  END IF;
  fingerprint:=encode(sha256(convert_to(p_id::text || ':' || p_action || ':' || coalesce(p_invite_hash,''),'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts r WHERE r.actor_id=actor AND r.command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'pairing.'||p_action OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'invitation command conflict' USING ERRCODE='22023';
    END IF;
    RETURN QUERY SELECT i.id,i.state,i.version FROM m10.pairing_invitations i WHERE i.id=p_id;
    RETURN;
  END IF;
  IF invitation.state NOT IN ('pending','awaiting_confirmation') OR invitation.expires_at<=clock_timestamp()
    OR (p_action<>'revoke' AND invitation.accepted_by IS NOT NULL AND invitation.accepted_by<>actor) THEN
    RAISE EXCEPTION 'invitation denied' USING ERRCODE='42501';
  END IF;
  IF p_action='accept' THEN
    IF invitation.state<>'pending'
      OR NOT EXISTS (SELECT 1 FROM m10.accounts a WHERE a.id=invitation.creator_id AND a.state='active')
      OR EXISTS (SELECT 1 FROM m10.couple_memberships m WHERE m.account_id IN (actor,invitation.creator_id) AND m.space_state='active') THEN
      RAISE EXCEPTION 'invitation denied' USING ERRCODE='42501';
    END IF;
    UPDATE m10.pairing_invitations i SET state='awaiting_confirmation',accepted_by=actor,accepted_at=clock_timestamp()
      WHERE i.id=p_id RETURNING i.version INTO changed_version;
  ELSE
    UPDATE m10.pairing_invitations i SET state=CASE p_action WHEN 'revoke' THEN 'revoked' ELSE 'rejected' END,ended_at=clock_timestamp()
      WHERE i.id=p_id RETURNING i.version INTO changed_version;
  END IF;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','pairing.'||p_action,fingerprint,p_id);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','pairing.'||p_action,p_id);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',p_id,changed_version,'pairing.'||p_action);
  RETURN QUERY SELECT i.id,i.state,i.version FROM m10.pairing_invitations i WHERE i.id=p_id;
END
$function$;
REVOKE ALL ON FUNCTION app_internal.decide_pairing_invitation(text,uuid,uuid,text,text) FROM PUBLIC;
