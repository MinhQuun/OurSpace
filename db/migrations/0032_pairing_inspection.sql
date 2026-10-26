-- M10 UC-03/04: inspect identities for consent, never email or capability hashes.
CREATE FUNCTION app_internal.inspect_pairing_invitation(p_session_hash text,p_id uuid,p_invite_hash text DEFAULT NULL)
RETURNS TABLE(id uuid,state text,expires_at timestamptz,version bigint,
  creator_id uuid,creator_name text,recipient_id uuid,recipient_name text,space_id uuid)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
  SELECT i.id,
    CASE WHEN i.state IN ('pending','awaiting_confirmation') AND i.expires_at<=statement_timestamp()
      THEN 'expired' ELSE i.state END,
    i.expires_at,i.version,i.creator_id,
    CASE WHEN creator.state='active' THEN cp.display_name END,
    i.accepted_by,CASE WHEN recipient.state='active' THEN rp.display_name END,s.id
  FROM m10.pairing_invitations i
  JOIN m10.accounts creator ON creator.id=i.creator_id
  LEFT JOIN m10.profiles cp ON cp.user_id=i.creator_id
  LEFT JOIN m10.accounts recipient ON recipient.id=i.accepted_by
  LEFT JOIN m10.profiles rp ON rp.user_id=i.accepted_by
  LEFT JOIN m10.couple_spaces s ON s.invitation_id=i.id
  CROSS JOIN LATERAL (SELECT app_internal.session_actor(p_session_hash) AS actor) caller
  WHERE i.id=p_id AND caller.actor IS NOT NULL AND (
    caller.actor IN (i.creator_id,i.accepted_by)
    OR (i.state='pending' AND i.expires_at>statement_timestamp()
      AND creator.state='active' AND i.token_hash=p_invite_hash));
$function$;
CREATE FUNCTION app_internal.list_pairing_invitations(p_session_hash text)
RETURNS TABLE(id uuid,state text,expires_at timestamptz,version bigint,
  creator_id uuid,creator_name text,recipient_id uuid,recipient_name text,space_id uuid)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
  SELECT inspected.* FROM (
    SELECT i.id FROM m10.pairing_invitations i
    WHERE app_internal.session_actor(p_session_hash) IN (i.creator_id,i.accepted_by)
    ORDER BY i.created_at DESC,i.id LIMIT 100
  ) own CROSS JOIN LATERAL app_internal.inspect_pairing_invitation(p_session_hash,own.id,NULL) inspected;
$function$;
REVOKE ALL ON FUNCTION app_internal.inspect_pairing_invitation(text,uuid,text),
  app_internal.list_pairing_invitations(text) FROM PUBLIC;
