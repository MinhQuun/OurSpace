-- M10 ST-19: Export jobs.
-- Account-scoped export requests. With no domain modules deployed yet every
-- export returns an empty package; the policy boundaries below are enforced
-- once domain data exists (BR-M10-73/74/75): personal exports cover only the
-- requester's own data, shared exports never include the partner's private
-- data, and sealed time capsules / surprise secrets are excluded.
CREATE TABLE m10.export_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  scope text NOT NULL CHECK(scope IN ('personal','shared')),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','completed','failed')),
  result_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
ALTER TABLE m10.export_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.export_jobs FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE m10.export_jobs FROM PUBLIC;
CREATE INDEX IF NOT EXISTS export_jobs_account_created ON m10.export_jobs(account_id, created_at DESC);

CREATE OR REPLACE FUNCTION app_internal.list_export_jobs(p_session_hash text)
RETURNS TABLE(id uuid, scope text, status text, result_ref text, created_at timestamptz, completed_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
  SELECT id, scope, status, result_ref, created_at, completed_at
  FROM m10.export_jobs
  WHERE account_id = app_internal.session_actor(p_session_hash)
  ORDER BY created_at DESC;
$fn$;

CREATE OR REPLACE FUNCTION app_internal.create_export_job(p_session_hash text, p_command uuid, p_scope text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; prior app_internal.command_receipts%ROWTYPE; fingerprint text; res uuid; job_id uuid;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR p_command IS NULL OR p_scope NOT IN ('personal','shared') THEN
    RAISE EXCEPTION 'invalid export job' USING ERRCODE='22023';
  END IF;
  fingerprint := encode(sha256(convert_to(jsonb_build_array(p_scope)::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'export.job.create' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  job_id := gen_random_uuid();
  INSERT INTO m10.export_jobs(id,account_id,scope,status,result_ref,completed_at)
    VALUES(job_id,actor,p_scope,'completed',job_id::text,now()) RETURNING id INTO res;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','export.job.create',fingerprint,res);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','export.job.create',res);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',res,1,'export.job.created');
  RETURN res;
END;
$fn$;

REVOKE ALL ON FUNCTION app_internal.list_export_jobs(text),
  app_internal.create_export_job(text,uuid,text) FROM PUBLIC;
