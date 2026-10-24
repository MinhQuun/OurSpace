ALTER TABLE m10.session_revocations DROP CONSTRAINT session_revocations_reason_check;
ALTER TABLE m10.session_revocations ADD CONSTRAINT session_revocations_reason_check
  CHECK (reason IN ('user_revoked', 'account_inactive', 'mfa_changed'));

-- Verification, activation and cleanup transitions change account security.
-- Revoke application sessions in the same transaction as the state change;
-- provider session revocation alone does not invalidate our opaque cookies.
CREATE FUNCTION app_internal.invalidate_mfa_sessions()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, pg_temp
AS $function$
BEGIN
  WITH changed AS (
    UPDATE m10.sessions SET revoked_at = greatest(created_at, clock_timestamp())
    WHERE account_id = NEW.account_id AND revoked_at IS NULL
    RETURNING id, account_id, revoked_at
  ) INSERT INTO m10.session_revocations(session_id, actor_id, revoked_at, reason)
    SELECT id, account_id, revoked_at, 'mfa_changed' FROM changed;
  RETURN NEW;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.invalidate_mfa_sessions() FROM PUBLIC;
CREATE TRIGGER mfa_session_invalidation AFTER UPDATE OF state ON m10.mfa_enrollments
FOR EACH ROW WHEN (NEW.state IS DISTINCT FROM OLD.state)
EXECUTE FUNCTION app_internal.invalidate_mfa_sessions();
