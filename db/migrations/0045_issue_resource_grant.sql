-- Domain adapters explicitly declare supported whole-object roles.
-- No default policies: conditional/scoped Contributor grants require dedicated adapters.
CREATE TABLE app_internal.resource_role_policies (
  module text NOT NULL CHECK(module ~ '^M0[1-9]$'),
  kind text NOT NULL CHECK(kind ~ '^[a-z][a-z0-9_]{0,63}$'),
  role text NOT NULL CHECK(role IN ('viewer','commenter','editor')),
  PRIMARY KEY(module,kind,role)
);
ALTER TABLE app_internal.resource_role_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_internal.resource_role_policies FORCE ROW LEVEL SECURITY;
REVOKE ALL ON app_internal.resource_role_policies FROM PUBLIC;
CREATE FUNCTION app_internal.issue_resource_grant(p_session_hash text,p_command uuid,
  p_resource uuid,p_space uuid,p_recipient uuid,p_role text,p_version bigint,p_confirmed boolean)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
DECLARE actor uuid; resource m10.resources%ROWTYPE; prior app_internal.command_receipts%ROWTYPE;
  fingerprint text; grant_id uuid; revision bigint;
BEGIN
  IF p_command IS NULL OR p_resource IS NULL OR p_space IS NULL OR p_recipient IS NULL
    OR p_role IS NULL OR p_role NOT IN ('viewer','commenter','editor') OR p_version IS NULL
    OR p_version<1 OR p_confirmed IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'explicit grant required' USING ERRCODE='22023';
  END IF;
  actor:=app_internal.lock_active_space_write(p_session_hash,p_space);
  IF actor=p_recipient OR NOT EXISTS(SELECT 1 FROM m10.couple_memberships m
    JOIN m10.accounts a ON a.id=m.account_id WHERE m.space_id=p_space AND m.account_id=p_recipient AND a.state='active') THEN
    RAISE EXCEPTION 'permission denied' USING ERRCODE='42501';
  END IF;
  SELECT * INTO resource FROM m10.resources WHERE id=p_resource AND owner_id=actor FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'permission denied' USING ERRCODE='42501'; END IF;
  fingerprint:=encode(sha256(convert_to(p_resource::text||':'||p_space::text||':'||p_recipient::text||':'||p_role||':'||p_version::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'permission.grant' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  IF resource.version<>p_version THEN RAISE EXCEPTION 'permission conflict' USING ERRCODE='23505'; END IF;
  IF resource.deleted_at IS NOT NULL OR resource.access_mode<>'standard' OR NOT EXISTS(
    SELECT 1 FROM app_internal.resource_role_policies policy WHERE policy.module=resource.module
      AND policy.kind=resource.kind AND policy.role=p_role) THEN
    RAISE EXCEPTION 'permission denied' USING ERRCODE='42501';
  END IF;
  grant_id:=gen_random_uuid();
  INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role)
    VALUES(grant_id,p_resource,actor,p_recipient,p_space,p_role);
  UPDATE m10.resources SET version=version+1 WHERE id=p_resource RETURNING version INTO revision;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','permission.grant',fingerprint,grant_id);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','permission.grant',p_resource);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',p_resource,revision,'permission.granted');
  RETURN grant_id;
END;
$function$;
REVOKE ALL ON FUNCTION app_internal.issue_resource_grant(text,uuid,uuid,uuid,uuid,text,bigint,boolean) FROM PUBLIC;
