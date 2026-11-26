-- Server-only preview input. Never return these storage coordinates to clients.
CREATE FUNCTION app_internal.read_media_preview_source(p_session_hash text,p_media uuid)
RETURNS TABLE(media_id uuid,mime_type text,bucket text,object_key uuid,byte_size bigint,sha256 text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT m.id,m.mime_type,b.bucket,b.object_key,b.byte_size,b.sha256
 FROM m02.media m LEFT JOIN m02.media_copy_sources s ON s.copy_id=m.id
 JOIN app_internal.binary_objects b ON b.id=s.binary_id
   OR (s.copy_id IS NULL AND b.resource_id=m.id AND b.purpose='original')
 WHERE m.id=p_media AND m.mime_type IN ('image/jpeg','image/png','image/webp')
   AND app_internal.can_read_resource(p_session_hash,m.id);
$fn$;
REVOKE ALL ON FUNCTION app_internal.read_media_preview_source(text,uuid) FROM PUBLIC;
