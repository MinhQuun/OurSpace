-- Deferred validation executes after the definer command returns: retain
-- private-table access in this trigger only, not in the calling runtime role.
ALTER FUNCTION app_internal.check_couple_membership() SECURITY DEFINER;
CREATE FUNCTION app_internal.confirm_pairing(
  p_session_hash text,p_command uuid,p_id uuid,p_recipient uuid,p_version bigint,p_confirmed boolean)
RETURNS uuid LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
DECLARE actor uuid; invitation m10.pairing_invitations%ROWTYPE;
  prior app_internal.command_receipts%ROWTYPE; fingerprint text; space uuid; revision bigint;
BEGIN
  IF p_command IS NULL OR p_id IS NULL OR p_recipient IS NULL OR p_version IS NULL
    OR p_version<1 OR p_confirmed IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'explicit pairing confirmation required' USING ERRCODE='22023';
  END IF;
  actor:=app_internal.session_actor(p_session_hash);
  IF actor IS NULL THEN RAISE EXCEPTION 'pairing denied' USING ERRCODE='42501'; END IF;
  SELECT * INTO invitation FROM m10.pairing_invitations i WHERE i.id=p_id;
  IF NOT FOUND OR invitation.creator_id<>actor OR invitation.accepted_by IS DISTINCT FROM p_recipient THEN
    RAISE EXCEPTION 'pairing denied' USING ERRCODE='42501';
  END IF;
  PERFORM 1 FROM m10.accounts a WHERE a.id IN (actor,p_recipient) ORDER BY a.id FOR UPDATE;
  IF (SELECT count(*) FROM m10.accounts a WHERE a.id IN (actor,p_recipient) AND a.state='active')<>2 THEN
    RAISE EXCEPTION 'pairing denied' USING ERRCODE='42501';
  END IF;
  PERFORM 1 FROM m10.sessions s WHERE s.token_hash=p_session_hash AND s.account_id=actor
    AND s.revoked_at IS NULL AND s.expires_at>clock_timestamp() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'pairing denied' USING ERRCODE='42501'; END IF;
  SELECT * INTO invitation FROM m10.pairing_invitations i WHERE i.id=p_id FOR UPDATE;
  fingerprint:=encode(sha256(convert_to(p_id::text||':'||p_recipient::text||':'||p_version::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts r WHERE r.actor_id=actor AND r.command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'pairing.confirm' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'pairing command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  IF invitation.state<>'awaiting_confirmation' OR invitation.version<>p_version
    OR invitation.expires_at<=clock_timestamp() OR invitation.accepted_by IS DISTINCT FROM p_recipient
    OR EXISTS (SELECT 1 FROM m10.couple_memberships m WHERE m.account_id IN (actor,p_recipient) AND m.space_state='active') THEN
    RAISE EXCEPTION 'pairing denied' USING ERRCODE='42501';
  END IF;
  UPDATE m10.pairing_invitations i SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp()
    WHERE i.id=p_id RETURNING i.version INTO revision;
  space:=gen_random_uuid();
  INSERT INTO m10.couple_spaces(id,invitation_id) VALUES(space,p_id);
  INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES(space,actor,1),(space,p_recipient,2);
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','pairing.confirm',fingerprint,space);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','pairing.confirm',space);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',p_id,revision,'pairing.confirmed');
  RETURN space;
END
$function$;
REVOKE ALL ON FUNCTION app_internal.confirm_pairing(text,uuid,uuid,uuid,bigint,boolean) FROM PUBLIC;
