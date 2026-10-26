-- M10 D33-D35: unilateral stop; no partner approval or partner active-session dependency.
CREATE FUNCTION app_internal.disconnect_space(p_session_hash text,p_provider_token text,
  p_command uuid,p_space uuid,p_version bigint,p_confirmed boolean)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
DECLARE actor uuid; current_space m10.couple_spaces%ROWTYPE;
  prior app_internal.command_receipts%ROWTYPE; fingerprint text; revision bigint;
BEGIN
  IF p_command IS NULL OR p_space IS NULL OR p_version IS NULL OR p_version<1
    OR p_confirmed IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'explicit disconnect confirmation required' USING ERRCODE='22023';
  END IF;
  actor:=app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR NOT EXISTS(SELECT 1 FROM m10.couple_memberships
    WHERE space_id=p_space AND account_id=actor) THEN
    RAISE EXCEPTION 'disconnect denied' USING ERRCODE='42501';
  END IF;
  -- Same account ordering as pairing, before session/Space/invitation locks.
  PERFORM 1 FROM m10.accounts WHERE id IN
    (SELECT account_id FROM m10.couple_memberships WHERE space_id=p_space) ORDER BY id FOR UPDATE;
  IF app_internal.disconnect_actor(p_session_hash,p_provider_token) IS DISTINCT FROM actor THEN
    RAISE EXCEPTION 'disconnect denied' USING ERRCODE='42501';
  END IF;
  SELECT * INTO current_space FROM m10.couple_spaces WHERE id=p_space FOR UPDATE;
  fingerprint:=encode(sha256(convert_to(p_space::text||':'||p_version::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'space.disconnect' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  IF current_space.state<>'active' OR current_space.version<>p_version THEN
    RAISE EXCEPTION 'disconnect conflict' USING ERRCODE='23505';
  END IF;
  INSERT INTO m10.space_disconnects(space_id,initiated_by) VALUES(p_space,actor);
  UPDATE m10.couple_spaces SET state='disconnecting' WHERE id=p_space;
  UPDATE m10.couple_spaces SET state='frozen' WHERE id=p_space RETURNING version INTO revision;
  UPDATE m10.pairing_invitations SET state='revoked',ended_at=clock_timestamp()
    WHERE state IN ('pending','awaiting_confirmation') AND
      (creator_id IN (SELECT account_id FROM m10.couple_memberships WHERE space_id=p_space)
      OR accepted_by IN (SELECT account_id FROM m10.couple_memberships WHERE space_id=p_space));
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','space.disconnect',fingerprint,p_space);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','space.disconnect',p_space);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',p_space,revision,'space.disconnected');
  RETURN p_space;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.disconnect_space(text,text,uuid,uuid,bigint,boolean) FROM PUBLIC;
