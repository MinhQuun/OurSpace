-- An actual downloadable section artifact, NOT a full personal/shared export job.
CREATE TABLE m10.account_export_artifacts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 account_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
 section text NOT NULL CHECK(section='m10.account_profile_preferences'),
 payload bytea NOT NULL CHECK(octet_length(payload) BETWEEN 1 AND 1048576),
 sha256 text GENERATED ALWAYS AS (encode(sha256(payload),'hex')) STORED,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 expires_at timestamptz NOT NULL DEFAULT (clock_timestamp()+interval '1 hour'),
 CHECK(expires_at>created_at)
);
ALTER TABLE m10.account_export_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.account_export_artifacts FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.account_export_artifacts FROM PUBLIC;
CREATE FUNCTION app_internal.guard_account_export_artifact()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN RAISE EXCEPTION 'immutable export artifact' USING ERRCODE='42501'; END;
$fn$;
CREATE TRIGGER immutable_account_export_artifact BEFORE UPDATE ON m10.account_export_artifacts
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_account_export_artifact();
REVOKE ALL ON FUNCTION app_internal.guard_account_export_artifact() FROM PUBLIC;

CREATE FUNCTION app_internal.create_account_export_artifact(p_session_hash text,p_command uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; prior app_internal.command_receipts%ROWTYPE; artifact uuid;
 fingerprint text := encode(sha256(convert_to('m10.account_profile_preferences:v1','UTF8')),'hex');
BEGIN
 IF p_command IS NULL THEN RAISE EXCEPTION 'invalid command' USING ERRCODE='22023'; END IF;
 actor:=app_internal.session_actor(p_session_hash);
 IF actor IS NULL THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.accounts WHERE id=actor AND state='active' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.sessions WHERE account_id=actor AND token_hash=p_session_hash
 AND revoked_at IS NULL AND expires_at>clock_timestamp() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
 IF FOUND THEN
  IF prior.module<>'M10' OR prior.action<>'account.export.create' OR prior.request_hash<>fingerprint THEN
   RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
  END IF;
  RETURN prior.result_ref;
 END IF;
 INSERT INTO m10.account_export_artifacts(account_id,section,payload)
 VALUES(actor,'m10.account_profile_preferences',convert_to(app_internal.export_my_account_section(p_session_hash)::text,'UTF8'))
 RETURNING id INTO artifact;
 INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
 VALUES(actor,p_command,'M10','account.export.create',fingerprint,artifact);
 INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
 VALUES(gen_random_uuid(),actor,p_command,'M10','account.export.create',artifact);
 INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
 VALUES(gen_random_uuid(),actor,p_command,'M10',artifact,1,'account.export.created');
 RETURN artifact;
END;
$fn$;
CREATE FUNCTION app_internal.read_account_export_artifact(p_session_hash text,p_artifact uuid)
RETURNS TABLE(payload bytea,sha256 text,expires_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT a.payload,a.sha256,a.expires_at FROM m10.account_export_artifacts a
 WHERE a.id=p_artifact AND a.account_id=app_internal.session_actor(p_session_hash)
 AND a.expires_at>clock_timestamp();
$fn$;
REVOKE ALL ON FUNCTION app_internal.create_account_export_artifact(text,uuid),
app_internal.read_account_export_artifact(text,uuid) FROM PUBLIC;
