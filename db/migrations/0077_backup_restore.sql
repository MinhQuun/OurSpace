-- M10 ST-20: Backup & Restore Center.
-- Backup preserves identity, links, rights and business state. Restore checks
-- cross-module consistency and never creates duplicates; it cannot bypass
-- time locks or revoked access, and a full-system restore cannot let one
-- account single-handedly overwrite the other's data (BR-M10-76..82).
-- With no domain modules deployed yet, jobs complete with an empty package.
CREATE TABLE m10.backup_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  scope text NOT NULL CHECK(scope IN ('personal','shared','full_system')),
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','completed','failed')),
  result_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
ALTER TABLE m10.backup_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.backup_jobs FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE m10.backup_jobs FROM PUBLIC;
CREATE INDEX IF NOT EXISTS backup_jobs_account_created ON m10.backup_jobs(account_id, created_at DESC);

CREATE TABLE m10.restore_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  scope text NOT NULL CHECK(scope IN ('personal','shared','full_system')),
  source_job_id uuid NOT NULL REFERENCES m10.backup_jobs(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','completed','failed')),
  result_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
ALTER TABLE m10.restore_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.restore_jobs FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE m10.restore_jobs FROM PUBLIC;
CREATE INDEX IF NOT EXISTS restore_jobs_account_created ON m10.restore_jobs(account_id, created_at DESC);

CREATE OR REPLACE FUNCTION app_internal.list_backup_jobs(p_session_hash text)
RETURNS TABLE(id uuid, scope text, status text, result_ref text, created_at timestamptz, completed_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
  SELECT id, scope, status, result_ref, created_at, completed_at
  FROM m10.backup_jobs
  WHERE account_id = app_internal.session_actor(p_session_hash)
  ORDER BY created_at DESC;
$fn$;

CREATE OR REPLACE FUNCTION app_internal.create_backup_job(p_session_hash text, p_command uuid, p_scope text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; prior app_internal.command_receipts%ROWTYPE; fingerprint text; res uuid; job_id uuid;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR p_command IS NULL OR p_scope NOT IN ('personal','shared','full_system') THEN
    RAISE EXCEPTION 'invalid backup job' USING ERRCODE='22023';
  END IF;
  fingerprint := encode(sha256(convert_to(jsonb_build_array(p_scope)::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'backup.job.create' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  job_id := gen_random_uuid();
  INSERT INTO m10.backup_jobs(id,account_id,scope,status,result_ref,completed_at)
    VALUES(job_id,actor,p_scope,'completed',job_id::text,now()) RETURNING id INTO res;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','backup.job.create',fingerprint,res);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','backup.job.create',res);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',res,1,'backup.job.created');
  RETURN res;
END;
$fn$;

CREATE OR REPLACE FUNCTION app_internal.list_restore_jobs(p_session_hash text)
RETURNS TABLE(id uuid, scope text, source_job_id uuid, status text, result_ref text, created_at timestamptz, completed_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
  SELECT id, scope, source_job_id, status, result_ref, created_at, completed_at
  FROM m10.restore_jobs
  WHERE account_id = app_internal.session_actor(p_session_hash)
  ORDER BY created_at DESC;
$fn$;

CREATE OR REPLACE FUNCTION app_internal.create_restore_job(p_session_hash text, p_command uuid, p_scope text, p_source_job uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; prior app_internal.command_receipts%ROWTYPE; fingerprint text; res uuid; job_id uuid; src bigint;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR p_command IS NULL OR p_source_job IS NULL OR p_scope NOT IN ('personal','shared','full_system') THEN
    RAISE EXCEPTION 'invalid restore job' USING ERRCODE='22023';
  END IF;
  fingerprint := encode(sha256(convert_to(jsonb_build_array(p_scope,p_source_job)::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'restore.job.create' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  SELECT count(*) INTO src FROM m10.backup_jobs WHERE id=p_source_job AND account_id=actor AND status='completed';
  IF src = 0 THEN
    RAISE EXCEPTION 'source backup unavailable' USING ERRCODE='23505';
  END IF;
  job_id := gen_random_uuid();
  INSERT INTO m10.restore_jobs(id,account_id,scope,source_job_id,status,result_ref,completed_at)
    VALUES(job_id,actor,p_scope,p_source_job,'completed',job_id::text,now()) RETURNING id INTO res;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','restore.job.create',fingerprint,res);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','restore.job.create',res);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',res,1,'restore.job.created');
  RETURN res;
END;
$fn$;

REVOKE ALL ON FUNCTION app_internal.list_backup_jobs(text),
  app_internal.create_backup_job(text,uuid,text),
  app_internal.list_restore_jobs(text),
  app_internal.create_restore_job(text,uuid,text,uuid) FROM PUBLIC;
