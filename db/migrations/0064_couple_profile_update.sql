-- M10 D08: both members edit with explicit optimistic concurrency, never silent overwrite.
CREATE FUNCTION app_internal.update_couple_profile(p_session_hash text,p_command uuid,
 p_space uuid,p_version bigint,p_title text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; current_version bigint; revision bigint;
 prior app_internal.command_receipts%ROWTYPE; fingerprint text;
BEGIN
 p_title:=btrim(p_title);
 IF p_command IS NULL OR p_space IS NULL OR p_version IS NULL OR p_version<0
   OR (p_title IS NOT NULL AND (length(p_title) NOT BETWEEN 1 AND 120 OR p_title ~ '^[[:space:]]*$')) THEN
   RAISE EXCEPTION 'invalid profile' USING ERRCODE='22023';
 END IF;
 -- Serializes initial creation as well as updates; version zero means absent profile.
 -- Acquire before lifecycle locks so waiting commands revalidate live authorization.
 PERFORM pg_advisory_xact_lock(hashtextextended('couple-profile:'||p_space::text,0));
 actor:=app_internal.lock_active_space_write(p_session_hash,p_space);
 fingerprint:=encode(sha256(convert_to(jsonb_build_array(p_space,p_version,p_title)::text,'UTF8')),'hex');
 SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
 IF FOUND THEN
   IF prior.module<>'M10' OR prior.action<>'couple.profile.update' OR prior.request_hash<>fingerprint THEN
     RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
   END IF;
   RETURN prior.result_ref;
 END IF;
 SELECT version INTO current_version FROM m10.couple_profiles WHERE space_id=p_space FOR UPDATE;
 IF coalesce(current_version,0)<>p_version THEN
   RAISE EXCEPTION 'profile conflict' USING ERRCODE='23505';
 END IF;
 IF current_version IS NULL THEN
   INSERT INTO m10.couple_profiles(space_id,title,updated_by) VALUES(p_space,p_title,actor)
     RETURNING version INTO revision;
 ELSE
   UPDATE m10.couple_profiles SET title=p_title,updated_by=actor WHERE space_id=p_space
     RETURNING version INTO revision;
 END IF;
 INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
   VALUES(actor,p_command,'M10','couple.profile.update',fingerprint,p_space);
 INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
   VALUES(gen_random_uuid(),actor,p_command,'M10','couple.profile.update',p_space);
 INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
   VALUES(gen_random_uuid(),actor,p_command,'M10',p_space,revision,'couple.profile.updated');
 RETURN p_space;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.update_couple_profile(text,uuid,uuid,bigint,text) FROM PUBLIC;
