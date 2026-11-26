CREATE FUNCTION app_internal.read_media_upload_decision(p_session_hash text,p_upload uuid)
RETURNS TABLE(id uuid,title text,mime_type text,byte_size bigint,sha256 text,bucket text,
 object_key uuid,media_id uuid,completed_at timestamptz,cancelled_at timestamptz,reused boolean,separate boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT u.id,u.title,u.mime_type,u.byte_size,u.sha256,u.bucket,u.object_key,u.media_id,u.completed_at,u.cancelled_at,u.reused,EXISTS(SELECT 1 FROM m02.upload_separate_decisions d WHERE d.upload_id=u.id)
 FROM m02.upload_items u WHERE u.id=p_upload AND u.owner_id=app_internal.session_actor(p_session_hash);
$fn$;
REVOKE ALL ON FUNCTION app_internal.read_media_upload_decision(text,uuid) FROM PUBLIC;
