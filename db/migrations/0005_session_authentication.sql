-- M10 D11 / ENT-M10-14: private, atomic revocation evidence without tokens.
CREATE TABLE m10.session_revocations (
  session_id uuid PRIMARY KEY REFERENCES m10.sessions(id) ON DELETE RESTRICT,
  actor_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  revoked_at timestamptz NOT NULL,
  reason text NOT NULL CHECK (reason = 'user_revoked')
);
ALTER TABLE m10.session_revocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.session_revocations FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.session_revocations FROM PUBLIC;

-- Only the server supplies a hash of an opaque bearer token. Never accept an
-- account identifier from the client as proof of identity. Fixed search paths
-- and qualified relation names prevent caller-created object substitution.
CREATE FUNCTION app_internal.session_actor(p_token_hash text)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
  SELECT s.account_id
  FROM m10.sessions s JOIN m10.accounts a ON a.id = s.account_id
  WHERE s.token_hash = p_token_hash AND s.revoked_at IS NULL
    AND s.created_at <= statement_timestamp()
    AND s.expires_at > statement_timestamp() AND a.state = 'active';
$function$;
REVOKE ALL ON FUNCTION app_internal.session_actor(text) FROM PUBLIC;

CREATE FUNCTION app_internal.revoke_session(p_token_hash text, p_session_id uuid)
RETURNS boolean LANGUAGE sql VOLATILE SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
  WITH changed AS (
    UPDATE m10.sessions SET revoked_at = statement_timestamp()
    WHERE id = p_session_id
      AND account_id = app_internal.session_actor(p_token_hash)
      AND revoked_at IS NULL
    RETURNING id, account_id, revoked_at
  ), recorded AS (
    INSERT INTO m10.session_revocations(session_id, actor_id, revoked_at, reason)
    SELECT id, account_id, revoked_at, 'user_revoked' FROM changed
    RETURNING session_id
  )
  SELECT EXISTS (SELECT 1 FROM recorded);
$function$;
REVOKE ALL ON FUNCTION app_internal.revoke_session(text, uuid) FROM PUBLIC;
