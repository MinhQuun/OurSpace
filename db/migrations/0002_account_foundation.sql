-- M10 ENT-01/02, D01/D07/D09. Authentication is supplied separately.
CREATE TABLE m10.accounts (
  id uuid PRIMARY KEY,
  state text NOT NULL DEFAULT 'pending_verification' CHECK (state IN (
    'pending_verification', 'active', 'deactivated',
    'deletion_requested', 'deletion_processing', 'deleted'
  )),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE TABLE m10.profiles (
  user_id uuid PRIMARY KEY REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  display_name text NOT NULL CHECK (length(btrim(display_name)) BETWEEN 1 AND 120),
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0)
);
ALTER TABLE m10.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.accounts FORCE ROW LEVEL SECURITY;
ALTER TABLE m10.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.profiles FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.accounts, m10.profiles FROM PUBLIC;
-- No permissive policy until authenticated actor/session enforcement is added.
