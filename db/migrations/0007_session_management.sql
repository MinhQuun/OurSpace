CREATE FUNCTION app_internal.list_sessions(p_token_hash text)
RETURNS TABLE(id uuid, created_at timestamptz, expires_at timestamptz,
  revoked_at timestamptz, is_current boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $function$
  SELECT s.id, s.created_at, s.expires_at, s.revoked_at, s.token_hash = p_token_hash
  FROM m10.sessions s
  WHERE s.account_id = app_internal.session_actor(p_token_hash)
  ORDER BY s.created_at DESC, s.id;
$function$;
REVOKE ALL ON FUNCTION app_internal.list_sessions(text) FROM PUBLIC;

CREATE FUNCTION app_internal.revoke_other_sessions(p_token_hash text)
RETURNS integer LANGUAGE sql VOLATILE SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
  WITH changed AS (
    UPDATE m10.sessions SET revoked_at = statement_timestamp()
    WHERE account_id = app_internal.session_actor(p_token_hash)
      AND token_hash <> p_token_hash AND revoked_at IS NULL
      AND created_at <= statement_timestamp() AND expires_at > statement_timestamp()
    RETURNING id, account_id, revoked_at
  ), recorded AS (
    INSERT INTO m10.session_revocations(session_id, actor_id, revoked_at, reason)
    SELECT id, account_id, revoked_at, 'user_revoked' FROM changed
    RETURNING session_id
  ) SELECT count(*)::integer FROM recorded;
$function$;
REVOKE ALL ON FUNCTION app_internal.revoke_other_sessions(text) FROM PUBLIC;
