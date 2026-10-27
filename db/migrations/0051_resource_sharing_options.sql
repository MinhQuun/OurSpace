-- Advisory UI choices, never an authorization ticket. Issuance rechecks all
-- conditions under locks. Private/unknown/nonowner objects reveal no choices.
CREATE FUNCTION app_internal.resource_sharing_options(p_session_hash text,p_resource uuid)
RETURNS TABLE(resource_version bigint,space_id uuid,recipient_id uuid,recipient_name text,role text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
  SELECT r.version,s.id,recipient.account_id,p.display_name,policy.role
  FROM m10.resources r
  JOIN m10.couple_memberships own ON own.account_id=r.owner_id
  JOIN m10.couple_spaces s ON s.id=own.space_id AND s.state='active'
  JOIN m10.couple_memberships recipient ON recipient.space_id=s.id AND recipient.account_id<>r.owner_id
  JOIN m10.accounts account ON account.id=recipient.account_id AND account.state='active'
  LEFT JOIN m10.profiles p ON p.user_id=recipient.account_id
  JOIN app_internal.resource_role_policies policy ON policy.module=r.module AND policy.kind=r.kind
  WHERE r.id=p_resource AND r.owner_id=app_internal.session_actor(p_session_hash)
    AND r.deleted_at IS NULL AND r.access_mode='standard'
    AND NOT EXISTS(SELECT 1 FROM m10.resource_grants g WHERE g.resource_id=r.id
      AND g.space_id=s.id AND g.grantee_id=recipient.account_id AND g.revoked_at IS NULL)
  ORDER BY s.id,recipient.account_id,policy.role;
$function$;
REVOKE ALL ON FUNCTION app_internal.resource_sharing_options(text,uuid) FROM PUBLIC;
