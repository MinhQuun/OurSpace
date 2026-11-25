-- Logical copies retain an immutable reference to physical bytes; the unique
-- storage binding remains intact. No recipient can choose or rebind a blob key.
CREATE TABLE m02.media_copy_sources (
 copy_id uuid PRIMARY KEY REFERENCES m02.media(id) ON DELETE RESTRICT,
 source_media_id uuid NOT NULL REFERENCES m02.media(id) ON DELETE RESTRICT,
 binary_id uuid NOT NULL REFERENCES app_internal.binary_objects(id) ON DELETE RESTRICT,
 created_by uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 CHECK(copy_id<>source_media_id)
);
ALTER TABLE m02.media_copy_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE m02.media_copy_sources FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m02.media_copy_sources FROM PUBLIC;
CREATE TRIGGER immutable_copy_source BEFORE UPDATE ON m02.media_copy_sources
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_binary_object_identity();

CREATE FUNCTION app_internal.share_media(p_session_hash text,p_command uuid,p_media_id uuid,
 p_grantee_id uuid,p_space_id uuid,p_mode text,p_version bigint,p_confirmed boolean)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; resource m10.resources%ROWTYPE; prior app_internal.command_receipts%ROWTYPE;
 fingerprint text; result uuid; source_binary uuid; revision bigint;
BEGIN
 IF p_command IS NULL OR p_media_id IS NULL OR p_grantee_id IS NULL OR p_space_id IS NULL
 OR p_mode IS NULL OR p_mode NOT IN ('private','share_existing','shared_copy')
 OR p_version IS NULL OR p_version<1 OR p_confirmed IS DISTINCT FROM true THEN
  RAISE EXCEPTION 'explicit sharing required' USING ERRCODE='22023';
 END IF;
 actor:=app_internal.lock_active_space_write(p_session_hash,p_space_id);
 IF actor=p_grantee_id OR NOT EXISTS(SELECT 1 FROM m10.couple_memberships m
 JOIN m10.accounts a ON a.id=m.account_id WHERE m.space_id=p_space_id
 AND m.account_id=p_grantee_id AND a.state='active') THEN
  RAISE EXCEPTION 'denied' USING ERRCODE='42501';
 END IF;
 SELECT * INTO resource FROM m10.resources WHERE id=p_media_id AND owner_id=actor
 AND module='M02' AND kind='media' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 fingerprint:=encode(sha256(convert_to(jsonb_build_array(p_media_id,p_grantee_id,p_space_id,p_mode,p_version)::text,'UTF8')),'hex');
 SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
 IF FOUND THEN
  IF prior.module<>'M02' OR prior.action<>'media.share' OR prior.request_hash<>fingerprint THEN
   RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
  END IF;
  RETURN prior.result_ref;
 END IF;
 IF resource.version<>p_version THEN RAISE EXCEPTION 'version conflict' USING ERRCODE='23505'; END IF;
 IF resource.deleted_at IS NOT NULL OR resource.access_mode<>'standard' THEN
  RAISE EXCEPTION 'denied' USING ERRCODE='42501';
 END IF;
 result:=p_media_id;
 IF p_mode='shared_copy' THEN
  SELECT b.id INTO source_binary FROM app_internal.binary_objects b
  WHERE b.resource_id=p_media_id AND b.purpose='original';
  IF source_binary IS NULL THEN
   SELECT s.binary_id INTO source_binary FROM m02.media_copy_sources s WHERE s.copy_id=p_media_id;
  END IF;
  IF source_binary IS NULL THEN RAISE EXCEPTION 'source unavailable' USING ERRCODE='42501'; END IF;
  result:=gen_random_uuid();
  INSERT INTO m10.resources(id,module,kind,owner_id) VALUES(result,'M02','media',actor);
  INSERT INTO m02.media(id,title,description,mime_type,uploaded_by)
   SELECT result,title,description,mime_type,actor FROM m02.media WHERE id=p_media_id;
  INSERT INTO m02.media_copy_sources(copy_id,source_media_id,binary_id,created_by)
   VALUES(result,p_media_id,source_binary,actor);
 END IF;
 IF p_mode<>'private' THEN
  INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role)
   VALUES(gen_random_uuid(),result,actor,p_grantee_id,p_space_id,'viewer');
  UPDATE m10.resources SET version=version+1 WHERE id=result RETURNING version INTO revision;
 ELSE
  -- Keep Private is a decision not to share; revocation is a separate explicit command.
  revision:=resource.version;
 END IF;
 INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
 VALUES(actor,p_command,'M02','media.share',fingerprint,result);
 INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
 VALUES(gen_random_uuid(),actor,p_command,'M02','media.share',result);
 INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
 VALUES(gen_random_uuid(),actor,p_command,'M02',result,revision,'media.sharing.decided');
 RETURN result;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.share_media(text,uuid,uuid,uuid,uuid,text,bigint,boolean) FROM PUBLIC;

CREATE OR REPLACE FUNCTION app_internal.resolve_readable_binary(p_session_hash text,p_binary uuid)
RETURNS TABLE(binary_id uuid,resource_id uuid,purpose text,bucket text,object_key uuid,byte_size bigint,sha256 text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT b.id,b.resource_id,b.purpose,b.bucket,b.object_key,b.byte_size,b.sha256
 FROM app_internal.binary_objects b WHERE b.id=p_binary AND app_internal.can_read_resource(p_session_hash,b.resource_id)
 UNION ALL
 SELECT s.copy_id,s.copy_id,b.purpose,b.bucket,b.object_key,b.byte_size,b.sha256
 FROM m02.media_copy_sources s JOIN app_internal.binary_objects b ON b.id=s.binary_id
 WHERE s.copy_id=p_binary AND app_internal.can_read_resource(p_session_hash,s.copy_id);
$fn$;
CREATE OR REPLACE FUNCTION app_internal.list_media(p_session_hash text,p_limit integer DEFAULT 50)
RETURNS TABLE(id uuid,title text,mime_type text,uploaded_by uuid,created_at timestamptz,byte_size bigint,sha256 text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT m.id,m.title,m.mime_type,m.uploaded_by,m.created_at,b.byte_size,b.sha256
 FROM m02.media m LEFT JOIN m02.media_copy_sources s ON s.copy_id=m.id
 JOIN app_internal.binary_objects b ON b.id=s.binary_id OR (s.copy_id IS NULL AND b.resource_id=m.id AND b.purpose='original')
 WHERE app_internal.can_read_resource(p_session_hash,m.id)
 ORDER BY m.created_at DESC,m.id DESC LIMIT GREATEST(1,LEAST(coalesce(p_limit,50),100));
$fn$;
