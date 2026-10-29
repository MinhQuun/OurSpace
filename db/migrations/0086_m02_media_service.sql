-- M02 Media Library: media registration and listing with source ACL
CREATE OR REPLACE FUNCTION app_internal.register_media(
  p_session_hash text,
  p_command uuid,
  p_title text,
  p_mime_type text,
  p_bucket text,
  p_object_key uuid,
  p_byte_size bigint,
  p_sha256 text
)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $function$
DECLARE
  actor uuid;
  resource_id uuid;
  binary_id uuid;
  prior app_internal.command_receipts%ROWTYPE;
  fingerprint text;
  res uuid;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR p_command IS NULL OR p_title IS NULL OR p_mime_type IS NULL OR p_byte_size IS NULL OR p_sha256 IS NULL THEN
    RAISE EXCEPTION 'invalid media registration' USING ERRCODE='22023';
  END IF;
  IF length(btrim(p_title)) < 1 OR length(btrim(p_title)) > 200 THEN
    RAISE EXCEPTION 'invalid title' USING ERRCODE='22023';
  END IF;
  fingerprint := encode(sha256(convert_to(jsonb_build_array(p_command,p_title,p_mime_type,p_bucket,p_object_key,p_byte_size,p_sha256)::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M02' OR prior.action<>'media.register' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  resource_id := gen_random_uuid();
  INSERT INTO m10.resources(id,module,kind,owner_id,access_mode) VALUES (resource_id,'M02','media',actor,'standard');
  INSERT INTO m02.media(id,title,mime_type,uploaded_by) VALUES (resource_id,p_title,p_mime_type,actor);
  binary_id := gen_random_uuid();
  INSERT INTO app_internal.binary_objects(id,resource_id,purpose,bucket,object_key,byte_size,sha256)
    VALUES (binary_id,resource_id,'original',p_bucket,p_object_key,p_byte_size,p_sha256);
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M02','media.register',fingerprint,resource_id);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M02','media.register',resource_id);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M02',resource_id,1,'media.registered');
  RETURN resource_id;
END;
$function$;

CREATE OR REPLACE FUNCTION app_internal.list_media(
  p_session_hash text,
  p_limit integer DEFAULT 50
)
RETURNS TABLE(id uuid,title text,mime_type text,uploaded_by uuid,created_at timestamptz,byte_size bigint,sha256 text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $function$
  SELECT m.id,m.title,m.mime_type,m.uploaded_by,m.created_at,b.byte_size,b.sha256
  FROM m02.media m
  JOIN m10.resources r ON r.id=m.id
  JOIN app_internal.binary_objects b ON b.resource_id=m.id AND b.purpose='original'
  WHERE app_internal.session_actor(p_session_hash) IS NOT NULL
    AND app_internal.can_read_resource(p_session_hash,m.id)
    AND r.deleted_at IS NULL
  ORDER BY m.created_at DESC,m.id DESC
  LIMIT GREATEST(1,LEAST(coalesce(p_limit,50),100));
$function$;

REVOKE ALL ON FUNCTION app_internal.register_media(text,uuid,text,text,text,uuid,bigint,text),
  app_internal.list_media(text,integer) FROM PUBLIC;
