-- Advisory UI context only; update_media_metadata rechecks under locks.
CREATE FUNCTION app_internal.media_metadata_edit_context(p_session_hash text,p_media uuid)
RETURNS TABLE(space_id uuid)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 WITH target AS (
  SELECT r.*,app_internal.session_actor(p_session_hash) AS actor
  FROM m10.resources r JOIN m02.media m ON m.id=r.id
  WHERE r.id=p_media AND r.module='M02' AND r.kind='media'
   AND app_internal.can_read_resource(p_session_hash,r.id)
 ), choices AS (
  SELECT NULL::uuid AS space_id FROM target r
  WHERE r.owner_id=r.actor AND NOT EXISTS(SELECT 1 FROM m10.resource_grants g
    WHERE g.resource_id=r.id AND g.revoked_at IS NULL)
  UNION
  SELECT s.id FROM target r JOIN m10.resource_grants g ON g.resource_id=r.id AND g.revoked_at IS NULL
  JOIN m10.couple_spaces s ON s.id=g.space_id AND s.state='active'
  JOIN m10.couple_memberships own ON own.space_id=s.id AND own.account_id=r.owner_id
  JOIN m10.couple_memberships caller ON caller.space_id=s.id AND caller.account_id=r.actor
  WHERE r.actor=r.owner_id OR (g.grantee_id=r.actor AND g.role='editor')
 ) SELECT space_id FROM choices ORDER BY space_id NULLS FIRST LIMIT 1;
$fn$;
REVOKE ALL ON FUNCTION app_internal.media_metadata_edit_context(text,uuid) FROM PUBLIC;
