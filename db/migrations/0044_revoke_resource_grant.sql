-- Owner revocation remains available after disconnect; it never broadens rights.
CREATE FUNCTION app_internal.revoke_resource_grant(p_session_hash text,p_command uuid,
  p_resource uuid,p_grant uuid,p_version bigint,p_confirmed boolean)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
DECLARE actor uuid; resource m10.resources%ROWTYPE; grant_row m10.resource_grants%ROWTYPE;
  prior app_internal.command_receipts%ROWTYPE; fingerprint text; revision bigint;
BEGIN
  IF p_command IS NULL OR p_resource IS NULL OR p_grant IS NULL OR p_version IS NULL
    OR p_version<1 OR p_confirmed IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'explicit revocation required' USING ERRCODE='22023';
  END IF;
  actor:=app_internal.session_actor(p_session_hash);
  IF actor IS NULL THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  PERFORM 1 FROM m10.accounts WHERE id=actor AND state='active' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  PERFORM 1 FROM m10.sessions WHERE token_hash=p_session_hash AND account_id=actor
    AND revoked_at IS NULL AND expires_at>clock_timestamp() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  SELECT * INTO resource FROM m10.resources WHERE id=p_resource AND owner_id=actor FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  fingerprint:=encode(sha256(convert_to(p_resource::text||':'||p_grant::text||':'||p_version::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'permission.revoke' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  SELECT * INTO grant_row FROM m10.resource_grants WHERE id=p_grant AND resource_id=p_resource FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  IF resource.version<>p_version OR grant_row.revoked_at IS NOT NULL THEN
    RAISE EXCEPTION 'permission conflict' USING ERRCODE='23505';
  END IF;
  UPDATE m10.resource_grants SET revoked_at=clock_timestamp() WHERE id=p_grant;
  UPDATE m10.resources SET version=version+1 WHERE id=p_resource RETURNING version INTO revision;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','permission.revoke',fingerprint,p_grant);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','permission.revoke',p_resource);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',p_resource,revision,'permission.revoked');
  RETURN p_grant;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.revoke_resource_grant(text,uuid,uuid,uuid,bigint,boolean) FROM PUBLIC;
