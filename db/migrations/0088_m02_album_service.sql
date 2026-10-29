-- M02 Media Library: album registration, listing, and media linkage functions
CREATE OR REPLACE FUNCTION app_internal.register_album(
  p_session_hash text,
  p_command uuid,
  p_title text,
  p_description text
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $function$
DECLARE
  actor uuid;
  resource_id uuid;
  prior app_internal.command_receipts%ROWTYPE;
  fingerprint text;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR p_command IS NULL OR p_title IS NULL THEN
    RAISE EXCEPTION 'invalid album registration' USING ERRCODE='22023';
  END IF;
  IF length(btrim(p_title)) < 1 OR length(btrim(p_title)) > 200 THEN
    RAISE EXCEPTION 'invalid title' USING ERRCODE='22023';
  END IF;
  fingerprint := encode(sha256(convert_to(jsonb_build_array(p_command,p_title,p_description)::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M02' OR prior.action<>'album.register' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  resource_id := gen_random_uuid();
  INSERT INTO m10.resources(id,module,kind,owner_id,access_mode) VALUES (resource_id,'M02','album',actor,'standard');
  INSERT INTO m02.album(id,title,description,created_by) VALUES (resource_id,p_title,p_description,actor);
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M02','album.register',fingerprint,resource_id);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M02','album.register',resource_id);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M02',resource_id,1,'album.registered');
  RETURN resource_id;
END;
$function$;

CREATE OR REPLACE FUNCTION app_internal.list_albums(
  p_session_hash text
)
RETURNS TABLE(id uuid,title text,description text,created_by uuid,created_at timestamptz,version bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $function$
  SELECT a.id,a.title,a.description,a.created_by,a.created_at,a.version
  FROM m02.album a
  JOIN m10.resources r ON r.id=a.id
  WHERE app_internal.session_actor(p_session_hash) IS NOT NULL
    AND app_internal.can_read_resource(p_session_hash,a.id)
    AND r.deleted_at IS NULL
  ORDER BY a.created_at DESC,a.id DESC;
$function$;

CREATE OR REPLACE FUNCTION app_internal.add_media_to_album(
  p_session_hash text,
  p_command uuid,
  p_album_id uuid,
  p_media_id uuid
)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $function$
DECLARE
  actor uuid;
  prior app_internal.command_receipts%ROWTYPE;
  fingerprint text;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR p_command IS NULL OR p_album_id IS NULL OR p_media_id IS NULL THEN
    RAISE EXCEPTION 'invalid add media to album' USING ERRCODE='22023';
  END IF;
  IF NOT app_internal.can_read_resource(p_session_hash,p_album_id) THEN
    RAISE EXCEPTION 'album not readable' USING ERRCODE='42501';
  END IF;
  IF NOT app_internal.can_read_resource(p_session_hash,p_media_id) THEN
    RAISE EXCEPTION 'media not readable' USING ERRCODE='42501';
  END IF;
  fingerprint := encode(sha256(convert_to(jsonb_build_array(p_command,p_album_id,p_media_id)::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M02' OR prior.action<>'media.add_to_album' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN true;
  END IF;
  -- Only album creator may add media
  IF NOT EXISTS (
    SELECT 1 FROM m02.album WHERE id=p_album_id AND created_by=actor
  ) THEN
    RAISE EXCEPTION 'not album creator' USING ERRCODE='42501';
  END IF;
  INSERT INTO m02.media_album(media_id,album_id) VALUES (p_media_id,p_album_id)
    ON CONFLICT DO NOTHING;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M02','media.add_to_album',fingerprint,p_album_id);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M02','media.add_to_album',p_album_id);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M02',p_media_id,1,'media.added_to_album');
  RETURN true;
END;
$function$;

CREATE OR REPLACE FUNCTION app_internal.remove_media_from_album(
  p_session_hash text,
  p_command uuid,
  p_album_id uuid,
  p_media_id uuid
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $function$
DECLARE
  actor uuid;
  prior app_internal.command_receipts%ROWTYPE;
  fingerprint text;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR p_command IS NULL OR p_album_id IS NULL OR p_media_id IS NULL THEN
    RAISE EXCEPTION 'invalid remove media from album' USING ERRCODE='22023';
  END IF;
  IF NOT app_internal.can_read_resource(p_session_hash,p_album_id) THEN
    RAISE EXCEPTION 'album not readable' USING ERRCODE='42501';
  END IF;
  fingerprint := encode(sha256(convert_to(jsonb_build_array(p_command,p_album_id,p_media_id)::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M02' OR prior.action<>'media.remove_from_album' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN;
  END IF;
  -- Only album creator may remove media
  IF NOT EXISTS (
    SELECT 1 FROM m02.album WHERE id=p_album_id AND created_by=actor
  ) THEN
    RAISE EXCEPTION 'not album creator' USING ERRCODE='42501';
  END IF;
  DELETE FROM m02.media_album WHERE media_id=p_media_id AND album_id=p_album_id;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M02','media.remove_from_album',fingerprint,p_album_id);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M02','media.remove_from_album',p_album_id);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M02',p_media_id,1,'media.removed_from_album');
END;
$function$;

REVOKE ALL ON FUNCTION
  app_internal.register_album(text,uuid,text,text),
  app_internal.list_albums(text),
  app_internal.add_media_to_album(text,uuid,uuid,uuid),
  app_internal.remove_media_from_album(text,uuid,uuid,uuid) FROM PUBLIC;
