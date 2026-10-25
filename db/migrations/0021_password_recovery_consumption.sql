-- Commit consumption before contacting Auth: provider redemption is not atomic
-- across simultaneous requests. Store only SHA-256 digests, never bearer proof.
CREATE TABLE app_internal.password_recovery_consumptions (
  token_digest text PRIMARY KEY CHECK (token_digest ~ '^[0-9a-f]{64}$'),
  consumed_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
ALTER TABLE app_internal.password_recovery_consumptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_internal.password_recovery_consumptions FORCE ROW LEVEL SECURITY;
REVOKE ALL ON app_internal.password_recovery_consumptions FROM PUBLIC;

CREATE FUNCTION app_internal.consume_password_recovery(p_digest text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, app_internal AS $$
DECLARE inserted integer;
BEGIN
  IF p_digest IS NULL OR p_digest !~ '^[0-9a-f]{64}$' THEN
    RAISE EXCEPTION 'Invalid recovery digest';
  END IF;
  INSERT INTO app_internal.password_recovery_consumptions(token_digest)
    VALUES (p_digest) ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS inserted = ROW_COUNT;
  RETURN inserted = 1;
END;
$$;
REVOKE ALL ON FUNCTION app_internal.consume_password_recovery(text) FROM PUBLIC;
