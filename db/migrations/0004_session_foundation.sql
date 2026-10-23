-- M10 D11: application-owned sessions. Never persist the bearer token itself.
CREATE TABLE m10.sessions (
  id uuid PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  token_hash text NOT NULL UNIQUE CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  CHECK (expires_at > created_at),
  CHECK (revoked_at IS NULL OR revoked_at >= created_at)
);
CREATE INDEX sessions_account_active ON m10.sessions(account_id, expires_at)
  WHERE revoked_at IS NULL;
ALTER TABLE m10.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.sessions FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.sessions FROM PUBLIC;
-- No client policy or runtime grants: the server adapter must enforce verified
-- identity, account state, MFA, expiry and revocation before authorizing requests.
