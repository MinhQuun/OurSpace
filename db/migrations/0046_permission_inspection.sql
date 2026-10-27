-- Self inspection only; unauthorized and unknown resources both yield no rows.
-- Base ACL result is not a substitute for domain-specific permission checks.
CREATE FUNCTION app_internal.inspect_resource_access(p_session_hash text,p_resource uuid)
RETURNS TABLE(resource_id uuid,resource_version bigint,role text,base_read_allowed boolean,read_reason text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
  WITH caller AS (SELECT app_internal.session_actor(p_session_hash) AS actor),
  inspected AS (
    SELECT r.*,caller.actor,app_internal.can_read_resource(p_session_hash,r.id) AS readable
    FROM m10.resources r CROSS JOIN caller
    WHERE r.id=p_resource AND caller.actor IS NOT NULL
  )
  SELECT r.id,r.version,
    CASE WHEN r.owner_id=r.actor THEN 'owner' ELSE (
      SELECT g.role FROM m10.resource_grants g JOIN m10.couple_spaces s ON s.id=g.space_id
      LEFT JOIN m10.space_disconnects d ON d.space_id=s.id
      WHERE g.resource_id=r.id AND g.grantee_id=r.actor AND g.revoked_at IS NULL
        AND g.role IN ('editor','commenter','viewer')
        AND (s.state='active' OR (s.state IN ('disconnecting','frozen') AND d.processing_until>statement_timestamp()))
      ORDER BY CASE g.role WHEN 'editor' THEN 1 WHEN 'commenter' THEN 2 ELSE 3 END,g.id LIMIT 1
    ) END,
    r.readable,
    CASE WHEN r.deleted_at IS NOT NULL THEN 'source_deleted'
      WHEN r.access_mode='conditional' THEN 'domain_conditions_required'
      WHEN r.readable THEN 'base_acl_allowed' ELSE 'denied' END
  FROM inspected r WHERE r.owner_id=r.actor OR r.readable;
$function$;
REVOKE ALL ON FUNCTION app_internal.inspect_resource_access(text,uuid) FROM PUBLIC;
