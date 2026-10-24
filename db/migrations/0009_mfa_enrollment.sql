-- M10 D10 / UC-M10-10. Provider verification and product activation are
-- separate states: acknowledgment of recovery storage completes activation.
-- Only metadata is stored here, never TOTP secrets, recovery codes or tokens.
CREATE TABLE m10.mfa_enrollments (
  id uuid PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  factor_type text NOT NULL DEFAULT 'totp' CHECK (factor_type = 'totp'),
  provider_factor_id uuid UNIQUE,
  state text NOT NULL DEFAULT 'pending' CHECK (state IN (
    'pending', 'verified', 'enabled', 'cancelling', 'cancelled', 'disabling', 'disabled'
  )),
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  verified_at timestamptz,
  recovery_issued_at timestamptz,
  recovery_acknowledged_at timestamptz,
  enabled_at timestamptz,
  CHECK (updated_at >= created_at),
  CHECK (verified_at IS NULL OR (provider_factor_id IS NOT NULL AND verified_at >= created_at)),
  CHECK (recovery_issued_at IS NULL OR (verified_at IS NOT NULL AND recovery_issued_at >= verified_at)),
  CHECK (recovery_acknowledged_at IS NULL OR
    (recovery_issued_at IS NOT NULL AND recovery_acknowledged_at >= recovery_issued_at)),
  CHECK (enabled_at IS NULL OR
    (recovery_acknowledged_at IS NOT NULL AND enabled_at >= recovery_acknowledged_at)),
  CHECK (state <> 'pending' OR verified_at IS NULL),
  CHECK (state <> 'verified' OR (verified_at IS NOT NULL AND enabled_at IS NULL)),
  CHECK (state NOT IN ('enabled', 'disabling', 'disabled') OR enabled_at IS NOT NULL),
  CHECK (state NOT IN ('pending', 'verified', 'cancelling', 'cancelled') OR enabled_at IS NULL)
);
-- An interrupted cancellation/disable remains active until provider cleanup
-- succeeds, preventing a competing enrollment from hiding unfinished work.
CREATE UNIQUE INDEX mfa_one_live_enrollment ON m10.mfa_enrollments(account_id)
  WHERE state NOT IN ('cancelled', 'disabled');
ALTER TABLE m10.mfa_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.mfa_enrollments FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.mfa_enrollments FROM PUBLIC;

CREATE FUNCTION app_internal.guard_mfa_enrollment()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog, pg_temp
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.state <> 'pending' OR NEW.version <> 1 THEN
      RAISE EXCEPTION 'Invalid MFA enrollment transition' USING ERRCODE = '23514';
    END IF;
  ELSE
    IF NEW.id IS DISTINCT FROM OLD.id OR NEW.account_id IS DISTINCT FROM OLD.account_id
      OR NEW.created_at IS DISTINCT FROM OLD.created_at
      OR (OLD.provider_factor_id IS NOT NULL AND NEW.provider_factor_id IS DISTINCT FROM OLD.provider_factor_id)
      OR (OLD.verified_at IS NOT NULL AND NEW.verified_at IS DISTINCT FROM OLD.verified_at)
      OR (OLD.recovery_issued_at IS NOT NULL AND NEW.recovery_issued_at IS DISTINCT FROM OLD.recovery_issued_at)
      OR (OLD.recovery_acknowledged_at IS NOT NULL AND NEW.recovery_acknowledged_at IS DISTINCT FROM OLD.recovery_acknowledged_at)
      OR (OLD.enabled_at IS NOT NULL AND NEW.enabled_at IS DISTINCT FROM OLD.enabled_at)
      OR OLD.state IN ('cancelled', 'disabled')
      OR NOT (NEW.state = OLD.state
        OR (OLD.state = 'pending' AND NEW.state IN ('verified', 'cancelling'))
        OR (OLD.state = 'verified' AND NEW.state IN ('enabled', 'cancelling'))
        OR (OLD.state = 'enabled' AND NEW.state = 'disabling')
        OR (OLD.state = 'cancelling' AND NEW.state = 'cancelled')
        OR (OLD.state = 'disabling' AND NEW.state = 'disabled')) THEN
      RAISE EXCEPTION 'Invalid MFA enrollment transition' USING ERRCODE = '23514';
    END IF;
    NEW.version := OLD.version + 1;
    NEW.updated_at := greatest(OLD.updated_at, clock_timestamp());
  END IF;
  RETURN NEW;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.guard_mfa_enrollment() FROM PUBLIC;
CREATE TRIGGER mfa_enrollment_transition BEFORE INSERT OR UPDATE ON m10.mfa_enrollments
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_mfa_enrollment();
-- No runtime grants until authenticated orchestration validates provider proof.
