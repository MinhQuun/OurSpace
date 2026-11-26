CREATE INDEX media_recent_page ON m02.media(created_at DESC,id DESC);
CREATE FUNCTION app_internal.list_media_page(p_session_hash text,p_before_time timestamptz DEFAULT NULL,p_before_id uuid DEFAULT NULL)
RETURNS TABLE(id uuid,title text,mime_type text,created_at text,byte_size bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT m.id,m.title,m.mime_type,m.created_at::text,b.byte_size
 FROM m02.media m LEFT JOIN m02.media_copy_sources s ON s.copy_id=m.id
 JOIN app_internal.binary_objects b ON b.id=s.binary_id
   OR (s.copy_id IS NULL AND b.resource_id=m.id AND b.purpose='original')
 WHERE app_internal.can_read_resource(p_session_hash,m.id)
   AND ((p_before_time IS NULL AND p_before_id IS NULL)
     OR (p_before_time IS NOT NULL AND p_before_id IS NOT NULL AND (m.created_at,m.id)<(p_before_time,p_before_id)))
 ORDER BY m.created_at DESC,m.id DESC LIMIT 51;
$fn$;
REVOKE ALL ON FUNCTION app_internal.list_media_page(text,timestamptz,uuid) FROM PUBLIC;
