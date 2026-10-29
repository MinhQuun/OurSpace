-- Shared identity is readable only by an authenticated member in the allowed lifecycle.
CREATE FUNCTION app_internal.can_read_couple_profile(p_session_hash text,p_space uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT EXISTS(SELECT 1 FROM m10.couple_spaces s
 JOIN m10.couple_memberships m ON m.space_id=s.id
 LEFT JOIN m10.space_disconnects d ON d.space_id=s.id
 WHERE s.id=p_space AND m.account_id=app_internal.session_actor(p_session_hash)
 AND (s.state='active' OR (s.state IN ('disconnecting','frozen') AND d.processing_until>statement_timestamp())));
$fn$;
CREATE FUNCTION app_internal.read_couple_profile(p_session_hash text,p_space uuid)
RETURNS TABLE(space_id uuid,title text,version bigint,updated_by uuid,updated_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT s.id,p.title,coalesce(p.version,0),p.updated_by,p.updated_at
 FROM m10.couple_spaces s LEFT JOIN m10.couple_profiles p ON p.space_id=s.id
 WHERE s.id=p_space AND app_internal.can_read_couple_profile(p_session_hash,s.id);
$fn$;
-- Descending immutable version cursor; bounded pages without an expensive total count.
CREATE FUNCTION app_internal.read_couple_profile_history(p_session_hash text,p_space uuid,p_before bigint)
RETURNS TABLE(version bigint,title text,actor_id uuid,recorded_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT r.version,r.title,r.actor_id,r.recorded_at FROM m10.couple_profile_revisions r
 WHERE r.space_id=p_space AND (p_before IS NULL OR r.version<p_before)
 AND app_internal.can_read_couple_profile(p_session_hash,p_space)
 ORDER BY r.version DESC LIMIT 50;
$fn$;
REVOKE ALL ON FUNCTION app_internal.can_read_couple_profile(text,uuid),
 app_internal.read_couple_profile(text,uuid),app_internal.read_couple_profile_history(text,uuid,bigint) FROM PUBLIC;
