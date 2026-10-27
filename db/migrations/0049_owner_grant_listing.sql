-- Owner-only management metadata. Grants are declarations, not effective access:
-- lifecycle/domain restrictions still apply independently. Revoked history is
-- deliberately excluded from this operational list.
CREATE FUNCTION app_internal.list_owned_resource_grants(p_session_hash text,p_resource uuid)
RETURNS TABLE(grant_id uuid,resource_version bigint,grantee_id uuid,space_id uuid,role text,granted_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
  SELECT g.id,r.version,g.grantee_id,g.space_id,g.role,g.granted_at
  FROM m10.resources r JOIN m10.resource_grants g ON g.resource_id=r.id
  WHERE r.id=p_resource AND r.owner_id=app_internal.session_actor(p_session_hash)
    AND g.revoked_at IS NULL
  ORDER BY g.granted_at,g.id;
$function$;
REVOKE ALL ON FUNCTION app_internal.list_owned_resource_grants(text,uuid) FROM PUBLIC;
