-- M10 ST-03: project only explicitly authorized values; no whole-profile JSON.
CREATE FUNCTION app_internal.read_partner_profile(p_session_hash text,p_space uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT coalesce(jsonb_object_agg(g.field, CASE g.field
   WHEN 'display_name' THEN to_jsonb(p.display_name)
   WHEN 'nickname' THEN to_jsonb(p.nickname)
   WHEN 'birthday' THEN to_jsonb(to_char(p.birthday,'YYYY-MM-DD'))
   WHEN 'bio' THEN to_jsonb(p.bio)
   WHEN 'avatar_ref' THEN to_jsonb(p.avatar_ref)
 END),'{}'::jsonb)
 FROM m10.profile_field_grants g
 JOIN m10.profiles p ON p.user_id=g.profile_id
 JOIN m10.accounts owner ON owner.id=p.user_id AND owner.state='active'
 JOIN m10.couple_spaces s ON s.id=g.space_id
 LEFT JOIN m10.space_disconnects d ON d.space_id=s.id
 WHERE g.space_id=p_space AND g.grantee_id=app_internal.session_actor(p_session_hash)
   AND g.revoked_at IS NULL
   AND (s.state='active' OR (s.state IN ('disconnecting','frozen') AND d.processing_until>statement_timestamp()))
   AND (g.field<>'avatar_ref' OR (p.avatar_ref IS NOT NULL
     AND app_internal.can_read_resource(p_session_hash,p.avatar_ref)));
$fn$;
CREATE FUNCTION app_internal.list_my_profile_field_grants(p_session_hash text)
RETURNS TABLE(id uuid,field text,grantee_id uuid,space_id uuid,granted_at timestamptz,revoked_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT g.id,g.field,g.grantee_id,g.space_id,g.granted_at,g.revoked_at
 FROM m10.profile_field_grants g WHERE g.profile_id=app_internal.session_actor(p_session_hash)
 ORDER BY g.granted_at,g.id;
$fn$;
REVOKE ALL ON FUNCTION app_internal.read_partner_profile(text,uuid),
 app_internal.list_my_profile_field_grants(text) FROM PUBLIC;
