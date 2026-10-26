-- Authenticated, idempotent creation. This does not create/share a Space.
CREATE FUNCTION app_internal.create_pairing_invitation(p_session_hash text, p_id uuid, p_invite_hash text)
RETURNS TABLE(id uuid, state text, expires_at timestamptz, version bigint)
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $function$
DECLARE actor uuid; prior app_internal.command_receipts%ROWTYPE;
BEGIN
  IF p_id IS NULL OR p_invite_hash IS NULL OR p_invite_hash !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'invalid invitation input' USING ERRCODE='22023';
  END IF;
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL THEN RAISE EXCEPTION 'invitation denied' USING ERRCODE='42501'; END IF;
  -- All pairing commands must lock accounts before invitations/memberships.
  PERFORM 1 FROM m10.accounts a WHERE a.id=actor AND a.state='active' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'invitation denied' USING ERRCODE='42501'; END IF;
  PERFORM 1 FROM m10.sessions s WHERE s.token_hash=p_session_hash AND s.account_id=actor
    AND s.revoked_at IS NULL AND s.expires_at > clock_timestamp() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'invitation denied' USING ERRCODE='42501'; END IF;
  SELECT * INTO prior FROM app_internal.command_receipts r WHERE r.actor_id=actor AND r.command_id=p_id;
  IF FOUND THEN
    IF prior.module <> 'M10' OR prior.action <> 'pairing.invite' OR prior.request_hash <> p_invite_hash THEN
      RAISE EXCEPTION 'invitation command conflict' USING ERRCODE='22023';
    END IF;
    RETURN QUERY SELECT i.id,i.state,i.expires_at,i.version FROM m10.pairing_invitations i
      WHERE i.id=prior.result_ref AND i.creator_id=actor;
    RETURN;
  END IF;
  IF EXISTS (SELECT 1 FROM m10.couple_memberships m WHERE m.account_id=actor AND m.space_state='active') THEN
    RAISE EXCEPTION 'invitation denied' USING ERRCODE='42501';
  END IF;
  INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES (p_id,actor,p_invite_hash);
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES (actor,p_id,'M10','pairing.invite',p_invite_hash,p_id);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES (gen_random_uuid(),actor,p_id,'M10','pairing.invite',p_id);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES (gen_random_uuid(),actor,p_id,'M10',p_id,1,'pairing.invited');
  RETURN QUERY SELECT i.id,i.state,i.expires_at,i.version FROM m10.pairing_invitations i WHERE i.id=p_id;
END
$function$;
REVOKE ALL ON FUNCTION app_internal.create_pairing_invitation(text,uuid,text) FROM PUBLIC;
