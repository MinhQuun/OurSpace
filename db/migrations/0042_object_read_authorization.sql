-- Base read gate only; domain-specific restrictions remain mandatory.
-- Unknown, deleted, conditional and inaccessible resources all return false.
CREATE FUNCTION app_internal.can_read_resource(p_session_hash text,p_resource uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM m10.resources r
    CROSS JOIN LATERAL (SELECT app_internal.session_actor(p_session_hash) AS actor) caller
    WHERE r.id=p_resource AND caller.actor IS NOT NULL
      AND r.deleted_at IS NULL AND r.access_mode='standard'
      AND (r.owner_id=caller.actor OR EXISTS (
        SELECT 1 FROM m10.resource_grants g
        JOIN m10.couple_spaces s ON s.id=g.space_id
        LEFT JOIN m10.space_disconnects d ON d.space_id=s.id
        WHERE g.resource_id=r.id AND g.grantee_id=caller.actor AND g.revoked_at IS NULL
          -- Contributor scope requires a domain resolver; never assume whole-object read.
          AND g.role IN ('viewer','commenter','editor')
          AND (s.state='active' OR (s.state IN ('disconnecting','frozen')
            AND d.processing_until>statement_timestamp()))
      ))
  );
$function$;
REVOKE ALL ON FUNCTION app_internal.can_read_resource(text,uuid) FROM PUBLIC;
