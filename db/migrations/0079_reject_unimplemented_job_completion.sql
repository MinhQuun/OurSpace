-- Correct false completion in 0075/0077. No artifact writer or restore executor
-- exists yet. Preserve job/audit history, but never report these as successful.
UPDATE m10.export_jobs SET status='failed',result_ref=NULL,completed_at=NULL
WHERE status='completed' AND result_ref=id::text;
UPDATE m10.restore_jobs SET status='failed',result_ref=NULL,completed_at=NULL
WHERE status='completed' AND result_ref=id::text;
UPDATE m10.backup_jobs SET status='failed',result_ref=NULL,completed_at=NULL
WHERE status='completed' AND result_ref=id::text;

CREATE OR REPLACE FUNCTION app_internal.create_export_job(p_session_hash text, p_command uuid, p_scope text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
  RAISE EXCEPTION 'export artifact execution not implemented' USING ERRCODE='0A000';
END;
$fn$;
CREATE OR REPLACE FUNCTION app_internal.create_backup_job(p_session_hash text, p_command uuid, p_scope text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
  RAISE EXCEPTION 'backup artifact execution not implemented' USING ERRCODE='0A000';
END;
$fn$;
CREATE OR REPLACE FUNCTION app_internal.create_restore_job(p_session_hash text, p_command uuid, p_scope text, p_source_job uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
  RAISE EXCEPTION 'validated restore execution not implemented' USING ERRCODE='0A000';
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.create_export_job(text,uuid,text),
app_internal.create_backup_job(text,uuid,text),
app_internal.create_restore_job(text,uuid,text,uuid) FROM PUBLIC;
