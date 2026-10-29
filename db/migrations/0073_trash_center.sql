-- M10 ST-21: 30-day Trash Center.
-- Soft-delete references only. Source objects are owned by their domain modules
-- and are never cascade-deleted from here; this table only records a reference
-- the owner can restore or permanently drop within the 30-day retention window.
CREATE TABLE m10.trashed_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  space_id uuid REFERENCES m10.couple_spaces(id) ON DELETE RESTRICT,
  source_module text NOT NULL CHECK(length(source_module) BETWEEN 1 AND 20),
  source_type text NOT NULL CHECK(length(source_type) BETWEEN 1 AND 40),
  source_id uuid NOT NULL,
  title_key text NOT NULL CHECK(length(btrim(title_key)) BETWEEN 1 AND 200),
  trashed_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '30 days',
  state text NOT NULL DEFAULT 'trashed' CHECK(state IN ('trashed','restored','purged'))
);
ALTER TABLE m10.trashed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.trashed_items FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE m10.trashed_items FROM PUBLIC;
CREATE INDEX IF NOT EXISTS trashed_items_owner_state ON m10.trashed_items(owner_id, state, trashed_at DESC);
CREATE INDEX IF NOT EXISTS trashed_items_expires ON m10.trashed_items(expires_at) WHERE state='trashed';

CREATE OR REPLACE FUNCTION app_internal.list_trashed_items(p_session_hash text)
RETURNS TABLE(id uuid, source_module text, source_type text, source_id uuid, title_key text, trashed_at timestamptz, expires_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
  SELECT id, source_module, source_type, source_id, title_key, trashed_at, expires_at
  FROM m10.trashed_items
  WHERE owner_id = app_internal.session_actor(p_session_hash)
    AND state = 'trashed'
    AND expires_at > now()
  ORDER BY trashed_at DESC;
$fn$;

CREATE OR REPLACE FUNCTION app_internal.restore_trashed_item(p_session_hash text, p_command uuid, p_item uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; prior app_internal.command_receipts%ROWTYPE; fingerprint text; res uuid;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR p_command IS NULL OR p_item IS NULL THEN
    RAISE EXCEPTION 'invalid restore' USING ERRCODE='22023';
  END IF;
  fingerprint := encode(sha256(convert_to(jsonb_build_array(p_item)::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'trash.item.restore' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  UPDATE m10.trashed_items SET state='restored'
  WHERE id=p_item AND owner_id=actor AND state='trashed' AND expires_at>now()
  RETURNING id INTO res;
  IF res IS NULL THEN
    RAISE EXCEPTION 'item not available' USING ERRCODE='23505';
  END IF;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','trash.item.restore',fingerprint,res);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','trash.item.restore',res);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',res,1,'trash.item.restored');
  RETURN res;
END;
$fn$;

CREATE OR REPLACE FUNCTION app_internal.purge_trashed_item(p_session_hash text, p_command uuid, p_item uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; prior app_internal.command_receipts%ROWTYPE; fingerprint text; res uuid;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR p_command IS NULL OR p_item IS NULL THEN
    RAISE EXCEPTION 'invalid purge' USING ERRCODE='22023';
  END IF;
  fingerprint := encode(sha256(convert_to(jsonb_build_array(p_item)::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'trash.item.purge' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  UPDATE m10.trashed_items SET state='purged'
  WHERE id=p_item AND owner_id=actor AND state IN ('trashed','restored')
  RETURNING id INTO res;
  IF res IS NULL THEN
    RAISE EXCEPTION 'item not available' USING ERRCODE='23505';
  END IF;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','trash.item.purge',fingerprint,res);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','trash.item.purge',res);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',res,1,'trash.item.purged');
  RETURN res;
END;
$fn$;

CREATE OR REPLACE FUNCTION app_internal.purge_expired_trashed_items(p_session_hash text)
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; updated bigint;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL THEN RETURN 0; END IF;
  WITH up AS (
    UPDATE m10.trashed_items SET state='purged'
    WHERE owner_id=actor AND state='trashed' AND expires_at<=now()
    RETURNING id
  )
  SELECT count(*) INTO updated FROM up;
  RETURN updated;
END;
$fn$;

REVOKE ALL ON FUNCTION app_internal.list_trashed_items(text),
  app_internal.restore_trashed_item(text,uuid,uuid),
  app_internal.purge_trashed_item(text,uuid,uuid),
  app_internal.purge_expired_trashed_items(text) FROM PUBLIC;
