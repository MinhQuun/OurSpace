CREATE FUNCTION app_internal.update_media_memory_date(p_session_hash text,p_command uuid,p_media uuid,
 p_space uuid,p_version bigint,p_memory_date date)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; resource m10.resources%ROWTYPE; media m02.media%ROWTYPE;
 prior app_internal.command_receipts%ROWTYPE; fingerprint text; revision bigint;
BEGIN
 IF p_command IS NULL OR p_media IS NULL OR p_version IS NULL OR p_version<1
 OR (p_memory_date IS NOT NULL AND (NOT isfinite(p_memory_date) OR p_memory_date NOT BETWEEN DATE '0001-01-01' AND DATE '9999-12-31')) THEN
  RAISE EXCEPTION 'invalid memory date' USING ERRCODE='22023';
 END IF;
 IF p_space IS NOT NULL THEN
  actor:=app_internal.lock_shared_resource_edit(p_session_hash,p_space,p_media);
  IF NOT EXISTS(SELECT 1 FROM m10.resource_grants WHERE resource_id=p_media
    AND space_id=p_space AND revoked_at IS NULL) THEN
   RAISE EXCEPTION 'denied' USING ERRCODE='42501';
  END IF;
 ELSE
  actor:=app_internal.session_actor(p_session_hash);
  IF actor IS NULL THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  PERFORM 1 FROM m10.accounts WHERE id=actor AND state='active' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  PERFORM 1 FROM m10.sessions WHERE account_id=actor AND token_hash=p_session_hash
   AND revoked_at IS NULL AND expires_at>clock_timestamp() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 END IF;
 SELECT * INTO resource FROM m10.resources WHERE id=p_media FOR UPDATE;
 IF NOT FOUND OR resource.module<>'M02' OR resource.kind<>'media'
 OR resource.deleted_at IS NOT NULL OR resource.access_mode<>'standard' THEN
  RAISE EXCEPTION 'denied' USING ERRCODE='42501';
 END IF;
 IF p_space IS NULL AND (resource.owner_id<>actor OR EXISTS(
   SELECT 1 FROM m10.resource_grants WHERE resource_id=p_media AND revoked_at IS NULL)) THEN
  RAISE EXCEPTION 'shared write requires active context' USING ERRCODE='42501';
 END IF;
 SELECT * INTO media FROM m02.media WHERE id=p_media FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 fingerprint:=encode(sha256(convert_to(jsonb_build_array(p_media,p_space,p_version,p_memory_date)::text,'UTF8')),'hex');
 SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
 IF FOUND THEN
  IF prior.module<>'M02' OR prior.action<>'media.memory_date.update' OR prior.request_hash<>fingerprint THEN
   RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
  END IF;
  RETURN prior.result_ref;
 END IF;
 IF media.version<>p_version THEN RAISE EXCEPTION 'version conflict' USING ERRCODE='23505'; END IF;
 UPDATE m02.media SET memory_date=p_memory_date,memory_date_set_by=actor,memory_date_set_at=clock_timestamp() WHERE id=p_media;
 UPDATE m10.resources SET version=version+1 WHERE id=p_media RETURNING version INTO revision;
 INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
 VALUES(actor,p_command,'M02','media.memory_date.update',fingerprint,p_media);
 INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
 VALUES(gen_random_uuid(),actor,p_command,'M02','media.memory_date.update',p_media);
 INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
 VALUES(gen_random_uuid(),actor,p_command,'M02',p_media,revision,'media.memory_date.updated');
 RETURN p_media;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.update_media_memory_date(text,uuid,uuid,uuid,bigint,date) FROM PUBLIC;
