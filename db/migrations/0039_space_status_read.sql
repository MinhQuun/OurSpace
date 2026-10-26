-- Membership-scoped lifecycle metadata only; no object access is conferred.
CREATE FUNCTION app_internal.list_my_spaces(p_session_hash text)
RETURNS TABLE(id uuid,state text,version bigint,created_at timestamptz,
  partner_id uuid,partner_name text,disconnected_at timestamptz,processing_until timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
  SELECT s.id,s.state,s.version,s.created_at,partner.account_id,
    CASE WHEN account.state='active' THEN profile.display_name END,
    d.initiated_at,d.processing_until
  FROM m10.couple_memberships own
  JOIN m10.couple_spaces s ON s.id=own.space_id
  JOIN m10.couple_memberships partner ON partner.space_id=s.id AND partner.account_id<>own.account_id
  JOIN m10.accounts account ON account.id=partner.account_id
  LEFT JOIN m10.profiles profile ON profile.user_id=partner.account_id
  LEFT JOIN m10.space_disconnects d ON d.space_id=s.id
  WHERE own.account_id=app_internal.session_actor(p_session_hash)
  ORDER BY s.created_at DESC,s.id
  LIMIT 100;
$function$;
REVOKE ALL ON FUNCTION app_internal.list_my_spaces(text) FROM PUBLIC;
