-- Logical-object metadata only: never expose storage coordinates, source identity,
-- EXIF/GPS or account profile fields through the detail contract.
CREATE FUNCTION app_internal.read_media_detail(p_session_hash text,p_media uuid)
RETURNS TABLE(id uuid,title text,description text,mime_type text,created_at timestamptz,
 updated_at timestamptz,version bigint,byte_size bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT m.id,m.title,m.description,m.mime_type,m.created_at,m.updated_at,m.version,b.byte_size
 FROM m02.media m LEFT JOIN m02.media_copy_sources s ON s.copy_id=m.id
 JOIN app_internal.binary_objects b ON b.id=s.binary_id
   OR (s.copy_id IS NULL AND b.resource_id=m.id AND b.purpose='original')
 WHERE m.id=p_media AND app_internal.can_read_resource(p_session_hash,m.id);
$fn$;
REVOKE ALL ON FUNCTION app_internal.read_media_detail(text,uuid) FROM PUBLIC;
