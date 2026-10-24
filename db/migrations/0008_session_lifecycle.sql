ALTER TABLE m10.sessions ADD COLUMN last_seen timestamptz;
UPDATE m10.sessions SET last_seen = created_at;
ALTER TABLE m10.sessions ALTER COLUMN last_seen SET NOT NULL;
ALTER TABLE m10.sessions ALTER COLUMN last_seen SET DEFAULT clock_timestamp();
ALTER TABLE m10.sessions ADD CONSTRAINT sessions_last_seen_valid CHECK (last_seen >= created_at);

CREATE FUNCTION app_internal.authenticate_session(p_token_hash text)
RETURNS uuid LANGUAGE sql VOLATILE SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
  UPDATE m10.sessions s SET last_seen = greatest(s.last_seen, clock_timestamp())
  FROM m10.accounts a
  WHERE s.account_id = a.id AND a.state = 'active'
    AND s.token_hash = p_token_hash AND s.revoked_at IS NULL
    AND s.created_at <= statement_timestamp() AND s.expires_at > statement_timestamp()
  RETURNING s.account_id;
$function$;
REVOKE ALL ON FUNCTION app_internal.authenticate_session(text) FROM PUBLIC;

-- Return shape changes; only this function definition/grants are replaced.
DROP FUNCTION app_internal.list_sessions(text);
CREATE FUNCTION app_internal.list_sessions(p_token_hash text)
RETURNS TABLE(id uuid, created_at timestamptz, expires_at timestamptz,
  revoked_at timestamptz, is_current boolean, last_seen timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $function$
  SELECT s.id, s.created_at, s.expires_at, s.revoked_at, s.token_hash = p_token_hash, s.last_seen
  FROM m10.sessions s WHERE s.account_id = app_internal.session_actor(p_token_hash)
  ORDER BY s.created_at DESC, s.id;
$function$;
REVOKE ALL ON FUNCTION app_internal.list_sessions(text) FROM PUBLIC;

ALTER TABLE m10.session_revocations DROP CONSTRAINT session_revocations_reason_check;
ALTER TABLE m10.session_revocations ADD CONSTRAINT session_revocations_reason_check
  CHECK (reason IN ('user_revoked', 'account_inactive'));
CREATE FUNCTION app_internal.invalidate_inactive_account_sessions()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
BEGIN
  WITH changed AS (
    UPDATE m10.sessions SET revoked_at = greatest(created_at, clock_timestamp())
    WHERE account_id = NEW.id AND revoked_at IS NULL
    RETURNING id, account_id, revoked_at
  ) INSERT INTO m10.session_revocations(session_id, actor_id, revoked_at, reason)
    SELECT id, account_id, revoked_at, 'account_inactive' FROM changed;
  RETURN NEW;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.invalidate_inactive_account_sessions() FROM PUBLIC;
CREATE TRIGGER account_session_invalidation AFTER UPDATE OF state ON m10.accounts
FOR EACH ROW WHEN (NEW.state <> 'active' AND OLD.state IS DISTINCT FROM NEW.state)
EXECUTE FUNCTION app_internal.invalidate_inactive_account_sessions();
