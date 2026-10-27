-- Base gate only: domain commands must check their own editable state/fields.
-- Shared writes require Active Space even for the owner; private owner writes
-- use a separate domain path and must not pass an unrelated active Space here.
CREATE FUNCTION app_internal.lock_shared_resource_edit(p_session_hash text,p_space uuid,p_resource uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
DECLARE actor uuid; resource m10.resources%ROWTYPE;
BEGIN
  actor:=app_internal.lock_active_space_write(p_session_hash,p_space);
  SELECT * INTO resource FROM m10.resources WHERE id=p_resource FOR UPDATE;
  IF NOT FOUND OR resource.deleted_at IS NOT NULL OR resource.access_mode<>'standard' THEN
    RAISE EXCEPTION 'edit denied' USING ERRCODE='42501';
  END IF;
  IF NOT EXISTS(SELECT 1 FROM m10.couple_memberships
    WHERE space_id=p_space AND account_id=resource.owner_id) THEN
    RAISE EXCEPTION 'edit denied' USING ERRCODE='42501';
  END IF;
  IF actor<>resource.owner_id AND NOT EXISTS(SELECT 1 FROM m10.resource_grants
    WHERE resource_id=p_resource AND space_id=p_space AND grantee_id=actor
      AND revoked_at IS NULL AND role='editor') THEN
    RAISE EXCEPTION 'edit denied' USING ERRCODE='42501';
  END IF;
  -- Serialize against grant/revoke and source-state mutations through commit.
  -- Does not authorize approval, seal, reveal, export or permission management.
  RETURN actor;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.lock_shared_resource_edit(text,uuid,uuid) FROM PUBLIC;
