-- UUID keyset pagination; pending intents only, never storage coordinates.
CREATE INDEX upload_items_pending_owner ON m02.upload_items(owner_id,id DESC) WHERE media_id IS NULL;
CREATE FUNCTION app_internal.list_pending_media_uploads(p_session_hash text,p_after uuid DEFAULT NULL)
RETURNS TABLE(id uuid,title text,mime_type text,byte_size bigint,sha256 text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT u.id,u.title,u.mime_type,u.byte_size,u.sha256 FROM m02.upload_items u
 WHERE u.owner_id=app_internal.session_actor(p_session_hash) AND u.media_id IS NULL
 AND (p_after IS NULL OR u.id<p_after)
 ORDER BY u.id DESC LIMIT 51;
$fn$;
REVOKE ALL ON FUNCTION app_internal.list_pending_media_uploads(text,uuid) FROM PUBLIC;
