CREATE FUNCTION app_internal.set_media_favorite(p_session_hash text,p_command uuid,p_media uuid,p_version bigint,p_favorited boolean)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; current_version bigint; fingerprint text; prior app_internal.command_receipts%ROWTYPE;
BEGIN
 IF p_command IS NULL OR p_media IS NULL OR p_version IS NULL OR p_version<0 OR p_version=9223372036854775807 OR p_favorited IS NULL THEN
  RAISE EXCEPTION 'invalid favorite' USING ERRCODE='22023';
 END IF;
 actor:=app_internal.session_actor(p_session_hash);
 IF actor IS NULL THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.accounts WHERE id=actor AND state='active' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.sessions WHERE account_id=actor AND token_hash=p_session_hash AND revoked_at IS NULL AND expires_at>clock_timestamp() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.resources WHERE id=p_media AND module='M02' AND kind='media' FOR UPDATE;
 IF NOT FOUND OR NOT app_internal.can_read_resource(p_session_hash,p_media) THEN
  RAISE EXCEPTION 'denied' USING ERRCODE='42501';
 END IF;
 fingerprint:=encode(sha256(convert_to(jsonb_build_array(p_media,p_version,p_favorited)::text,'UTF8')),'hex');
 SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
 IF FOUND THEN
  IF prior.module<>'M02' OR prior.action<>'media.favorite.set' OR prior.request_hash<>fingerprint THEN
   RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
  END IF;
  RETURN prior.result_ref;
 END IF;
 SELECT version INTO current_version FROM m02.media_favorites WHERE account_id=actor AND media_id=p_media FOR UPDATE;
 IF coalesce(current_version,0)<>p_version THEN RAISE EXCEPTION 'version conflict' USING ERRCODE='23505'; END IF;
 INSERT INTO m02.media_favorites(account_id,media_id,favorited,version)
 VALUES(actor,p_media,p_favorited,p_version+1)
 ON CONFLICT(account_id,media_id) DO UPDATE SET favorited=excluded.favorited,version=excluded.version,updated_at=clock_timestamp();
 INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
 VALUES(actor,p_command,'M02','media.favorite.set',fingerprint,p_media);
 INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
 VALUES(gen_random_uuid(),actor,p_command,'M02','media.favorite.set',p_media);
 -- Personal preference does not mutate shared media revision or emit shared activity.
 RETURN p_media;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.set_media_favorite(text,uuid,uuid,bigint,boolean) FROM PUBLIC;
