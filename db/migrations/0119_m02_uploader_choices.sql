CREATE FUNCTION app_internal.list_media_uploaders(p_session_hash text,p_after uuid DEFAULT NULL)
RETURNS TABLE(id uuid,is_self boolean,display_name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 WITH actor AS (SELECT app_internal.session_actor(p_session_hash) AS id),
 candidates AS (
   SELECT DISTINCT m.uploaded_by AS id FROM m02.media m
   WHERE app_internal.can_read_resource(p_session_hash,m.id)
     AND (p_after IS NULL OR m.uploaded_by>p_after)
   ORDER BY m.uploaded_by LIMIT 51
 )
 SELECT c.id,c.id=a.id,
   CASE WHEN c.id=a.id THEN p.display_name ELSE (
     SELECT app_internal.read_partner_profile(p_session_hash,g.space_id)->>'display_name'
     FROM m10.profile_field_grants g
     WHERE g.profile_id=c.id AND g.grantee_id=a.id AND g.field='display_name'
       AND g.revoked_at IS NULL
       AND app_internal.read_partner_profile(p_session_hash,g.space_id)?'display_name'
     ORDER BY g.space_id LIMIT 1
   ) END
 FROM candidates c CROSS JOIN actor a LEFT JOIN m10.profiles p ON p.user_id=c.id
 ORDER BY c.id;
$fn$;
REVOKE ALL ON FUNCTION app_internal.list_media_uploaders(text,uuid) FROM PUBLIC;
