-- Candidate discovery never exposes storage coordinates or inaccessible originals.
CREATE INDEX binary_original_content ON app_internal.binary_objects(sha256,byte_size) WHERE purpose='original';
CREATE FUNCTION app_internal.find_media_duplicates(p_session_hash text,p_sha256 text,p_byte_size bigint,p_after uuid DEFAULT NULL)
RETURNS TABLE(id uuid,title text,mime_type text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT m.id,m.title,m.mime_type
 FROM m02.media m LEFT JOIN m02.media_copy_sources s ON s.copy_id=m.id
 JOIN app_internal.binary_objects b ON b.id=s.binary_id
   OR (s.copy_id IS NULL AND b.resource_id=m.id AND b.purpose='original')
 WHERE p_sha256 ~ '^[a-f0-9]{64}$' AND p_byte_size>0
   AND b.sha256=p_sha256 AND b.byte_size=p_byte_size
   AND app_internal.can_read_resource(p_session_hash,m.id)
   AND (p_after IS NULL OR m.id<p_after)
 ORDER BY m.id DESC LIMIT 51;
$fn$;
REVOKE ALL ON FUNCTION app_internal.find_media_duplicates(text,text,bigint,uuid) FROM PUBLIC;
