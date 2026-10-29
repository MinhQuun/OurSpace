CREATE INDEX account_export_artifacts_expiry ON m10.account_export_artifacts(expires_at,id);
-- Operator-only maintenance; no caller-supplied cutoff, account, or artifact IDs.
CREATE FUNCTION app_internal.purge_expired_account_export_artifacts(p_limit integer DEFAULT 100)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE removed integer;
BEGIN
 IF p_limit IS NULL OR p_limit NOT BETWEEN 1 AND 1000 THEN
  RAISE EXCEPTION 'invalid cleanup batch' USING ERRCODE='22023';
 END IF;
 WITH candidates AS (
  SELECT id FROM m10.account_export_artifacts WHERE expires_at<=statement_timestamp()
  ORDER BY expires_at,id LIMIT p_limit FOR UPDATE SKIP LOCKED
 ), deleted AS (
  DELETE FROM m10.account_export_artifacts a USING candidates c WHERE a.id=c.id RETURNING a.id
 ) SELECT count(*) INTO removed FROM deleted;
 RETURN removed;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.purge_expired_account_export_artifacts(integer) FROM PUBLIC;
