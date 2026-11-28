CREATE FUNCTION app_internal.search_media_uploaded_page(p_session_hash text,p_query text,p_tag text,p_favorites boolean,p_type text,p_uploader uuid,p_memory_from date,p_memory_to date,p_uploaded_from date,p_uploaded_to date,p_timezone text,
 p_before_time timestamptz DEFAULT NULL,p_before_id uuid DEFAULT NULL)
RETURNS TABLE(id uuid,title text,mime_type text,created_at text,byte_size bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT m.id,m.title,m.mime_type,m.created_at::text,b.byte_size
 FROM m02.media m CROSS JOIN (SELECT name FROM pg_catalog.pg_timezone_names WHERE name=p_timezone) z LEFT JOIN m02.media_copy_sources s ON s.copy_id=m.id
 JOIN app_internal.binary_objects b ON b.id=s.binary_id
   OR (s.copy_id IS NULL AND b.resource_id=m.id AND b.purpose='original')
 WHERE app_internal.can_read_resource(p_session_hash,m.id)
 AND (p_uploaded_from IS NULL OR (p_uploaded_from BETWEEN DATE '0001-01-01' AND DATE '9999-12-31' AND (m.created_at AT TIME ZONE z.name)::date>=p_uploaded_from))
 AND (p_uploaded_to IS NULL OR (p_uploaded_to BETWEEN DATE '0001-01-01' AND DATE '9999-12-31' AND (m.created_at AT TIME ZONE z.name)::date<=p_uploaded_to))
 AND (p_uploaded_from IS NULL OR p_uploaded_to IS NULL OR p_uploaded_from<=p_uploaded_to)
 AND (p_memory_from IS NULL OR (p_memory_from BETWEEN DATE '0001-01-01' AND DATE '9999-12-31' AND m.memory_date>=p_memory_from))
 AND (p_memory_to IS NULL OR (p_memory_to BETWEEN DATE '0001-01-01' AND DATE '9999-12-31' AND m.memory_date<=p_memory_to))
 AND (p_memory_from IS NULL OR p_memory_to IS NULL OR p_memory_from<=p_memory_to)
 AND (p_uploader IS NULL OR m.uploaded_by=p_uploader)
 AND (p_type IS NULL OR (p_type='photo' AND m.mime_type LIKE 'image/%') OR (p_type='video' AND m.mime_type LIKE 'video/%'))
 AND (coalesce(p_query,'')='' OR strpos(lower(m.title),lower(p_query))>0
   OR strpos(lower(coalesce(m.description,'')),lower(p_query))>0
   OR EXISTS(SELECT 1 FROM m02.media_tags mt JOIN m02.tags t ON t.id=mt.tag_id
      WHERE mt.media_id=m.id AND strpos(lower(t.value),lower(p_query))>0))
 AND (p_tag IS NULL OR EXISTS(SELECT 1 FROM m02.media_tags mt JOIN m02.tags t ON t.id=mt.tag_id
      WHERE mt.media_id=m.id AND t.value=p_tag))
 AND (NOT coalesce(p_favorites,false) OR EXISTS(SELECT 1 FROM m02.media_favorites f
      WHERE f.media_id=m.id AND f.account_id=app_internal.session_actor(p_session_hash) AND f.favorited))
 AND ((p_before_time IS NULL AND p_before_id IS NULL)
   OR (p_before_time IS NOT NULL AND p_before_id IS NOT NULL AND (m.created_at,m.id)<(p_before_time,p_before_id)))
 ORDER BY m.created_at DESC,m.id DESC LIMIT 51;
$fn$;
REVOKE ALL ON FUNCTION app_internal.search_media_uploaded_page(text,text,text,boolean,text,uuid,date,date,date,date,text,timestamptz,uuid) FROM PUBLIC;




