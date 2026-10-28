-- M10 ST-02/03: owner-confirmed disclosure of one field to an exact active Partner.
CREATE FUNCTION app_internal.issue_profile_field_grant(p_session_hash text,p_command uuid,
  p_profile uuid,p_space uuid,p_recipient uuid,p_field text,p_version bigint,p_confirmed boolean)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
DECLARE actor uuid; profile m10.profiles%ROWTYPE; prior app_internal.command_receipts%ROWTYPE;
  fingerprint text; grant_id uuid; revision bigint;
BEGIN
  IF p_command IS NULL OR p_profile IS NULL OR p_space IS NULL OR p_recipient IS NULL
    OR p_field IS NULL OR p_field NOT IN ('display_name','avatar_ref','nickname','birthday','bio') OR p_version IS NULL
    OR p_version<1 OR p_confirmed IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'explicit grant required' USING ERRCODE='22023';
  END IF;
  actor:=app_internal.lock_active_space_write(p_session_hash,p_space);
  IF actor=p_recipient OR NOT EXISTS(SELECT 1 FROM m10.couple_memberships m
    JOIN m10.accounts a ON a.id=m.account_id WHERE m.space_id=p_space AND m.account_id=p_recipient AND a.state='active') THEN
    RAISE EXCEPTION 'permission denied' USING ERRCODE='42501';
  END IF;
  SELECT * INTO profile FROM m10.profiles WHERE user_id=p_profile AND user_id=actor FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'permission denied' USING ERRCODE='42501'; END IF;
  fingerprint:=encode(sha256(convert_to(p_profile::text||':'||p_space::text||':'||p_recipient::text||':'||p_field||':'||p_version::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'profile.field.grant' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  IF profile.version<>p_version THEN RAISE EXCEPTION 'permission conflict' USING ERRCODE='23505'; END IF;
  grant_id:=gen_random_uuid();
  INSERT INTO m10.profile_field_grants(id,profile_id,field,grantee_id,space_id)
    VALUES(grant_id,p_profile,p_field,p_recipient,p_space);
  UPDATE m10.profiles SET version=version+1 WHERE user_id=p_profile RETURNING version INTO revision;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','profile.field.grant',fingerprint,grant_id);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','profile.field.grant',p_profile);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',p_profile,revision,'profile.field.granted');
  RETURN grant_id;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.issue_profile_field_grant(text,uuid,uuid,uuid,uuid,text,bigint,boolean) FROM PUBLIC;
