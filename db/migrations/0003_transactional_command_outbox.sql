-- Technical infrastructure: domain writes, receipts, events and audit must
-- commit in the same transaction. No job may approve a business action.
CREATE SCHEMA app_internal;
REVOKE ALL ON SCHEMA app_internal FROM PUBLIC;

CREATE TABLE app_internal.command_receipts (
  actor_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  command_id uuid NOT NULL,
  module text NOT NULL CHECK (module ~ '^M(0[1-9]|10)$'),
  action text NOT NULL CHECK (action ~ '^[a-z][a-z0-9_.]{0,99}$'),
  request_hash text NOT NULL CHECK (request_hash ~ '^[a-f0-9]{64}$'),
  result_ref uuid,
  committed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (actor_id, command_id)
);
CREATE TABLE app_internal.outbox (
  event_id uuid PRIMARY KEY,
  actor_id uuid NOT NULL,
  command_id uuid NOT NULL,
  source_module text NOT NULL CHECK (source_module ~ '^M(0[1-9]|10)$'),
  source_id uuid NOT NULL,
  source_revision bigint NOT NULL CHECK (source_revision > 0),
  event_type text NOT NULL CHECK (event_type ~ '^[a-z][a-z0-9_.]{0,99}$'),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  available_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  completed_at timestamptz,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  FOREIGN KEY (actor_id, command_id) REFERENCES app_internal.command_receipts(actor_id, command_id) ON DELETE RESTRICT,
  UNIQUE (source_module, source_id, source_revision, event_type)
);
CREATE INDEX outbox_pending ON app_internal.outbox(available_at, created_at) WHERE completed_at IS NULL;
CREATE TABLE app_internal.audit_events (
  event_id uuid PRIMARY KEY,
  actor_id uuid NOT NULL,
  command_id uuid NOT NULL,
  module text NOT NULL CHECK (module ~ '^M(0[1-9]|10)$'),
  action text NOT NULL CHECK (action ~ '^[a-z][a-z0-9_.]{0,99}$'),
  resource_id uuid NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  FOREIGN KEY (actor_id, command_id) REFERENCES app_internal.command_receipts(actor_id, command_id) ON DELETE RESTRICT
);
-- Deliberately no secret/user-content payload columns in audit or outbox.
ALTER TABLE app_internal.command_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_internal.command_receipts FORCE ROW LEVEL SECURITY;
ALTER TABLE app_internal.outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_internal.outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE app_internal.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_internal.audit_events FORCE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA app_internal FROM PUBLIC;
