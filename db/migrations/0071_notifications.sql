-- M10 ST-16/ST-17: in-app Notification Center with preferences and Quiet Hours
CREATE SCHEMA IF NOT EXISTS m10;

CREATE TABLE m10.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  space_id uuid REFERENCES m10.couple_spaces(id) ON DELETE RESTRICT,
  notification_type text NOT NULL,
  source_module text,
  source_id uuid,
  title_key text,
  body_key text,
  link_href text,
  priority text NOT NULL DEFAULT 'normal' CHECK(priority IN ('low','normal','high')),
  is_essential boolean NOT NULL DEFAULT false,
  read_at timestamptz,
  hidden_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  dedup_key text,
  CONSTRAINT notifications_link_href_safe CHECK(link_href IS NULL OR link_href ~ '^/[a-zA-Z0-9/_-]+$')
);

CREATE UNIQUE INDEX IF NOT EXISTS notifications_dedup ON m10.notifications(recipient_id, dedup_key) WHERE dedup_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS notifications_recipient_created ON m10.notifications(recipient_id, created_at DESC) WHERE hidden_at IS NULL;
CREATE INDEX IF NOT EXISTS notifications_unread ON m10.notifications(recipient_id, created_at DESC) WHERE read_at IS NULL AND hidden_at IS NULL;

ALTER TABLE m10.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.notifications FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE m10.notifications FROM PUBLIC;

CREATE TABLE m10.notification_preferences (
  account_id uuid PRIMARY KEY REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  version bigint NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  quiet_hours_enabled boolean NOT NULL DEFAULT false,
  quiet_start_minutes integer NOT NULL DEFAULT 1320 CHECK(quiet_start_minutes BETWEEN 0 AND 1439),
  quiet_end_minutes integer NOT NULL DEFAULT 360 CHECK(quiet_end_minutes BETWEEN 0 AND 1439),
  type_preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE m10.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.notification_preferences FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE m10.notification_preferences FROM PUBLIC;

CREATE TABLE m10.notification_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL,
  notification_id uuid,
  action text NOT NULL,
  space_id uuid,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE m10.notification_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.notification_audit FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE m10.notification_audit FROM PUBLIC;

CREATE OR REPLACE FUNCTION app_internal.read_notifications(p_session_hash text, p_limit integer DEFAULT 50, p_include_read boolean DEFAULT true)
RETURNS TABLE(id uuid, notification_type text, space_id uuid, source_module text, source_id uuid, title_key text, body_key text, link_href text, priority text, is_essential boolean, read_at timestamptz, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
  SELECT n.id, n.notification_type, n.space_id, n.source_module, n.source_id, n.title_key, n.body_key, n.link_href, n.priority, n.is_essential, n.read_at, n.created_at
  FROM m10.notifications n
  WHERE n.recipient_id = app_internal.session_actor(p_session_hash)
    AND n.hidden_at IS NULL
    AND (p_include_read OR n.read_at IS NULL)
    AND (n.expires_at IS NULL OR n.expires_at > now())
  ORDER BY n.created_at DESC, n.id DESC
  LIMIT GREATEST(1, LEAST(coalesce(p_limit,50), 100));
$fn$;

CREATE OR REPLACE FUNCTION app_internal.unread_notification_count(p_session_hash text)
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
  SELECT count(*) FROM m10.notifications n
  WHERE n.recipient_id = app_internal.session_actor(p_session_hash)
    AND n.hidden_at IS NULL AND n.read_at IS NULL
    AND (n.expires_at IS NULL OR n.expires_at > now());
$fn$;

CREATE OR REPLACE FUNCTION app_internal.mark_notification_read(p_session_hash text, p_notification uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; updated integer;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR p_notification IS NULL THEN RETURN false; END IF;
  UPDATE m10.notifications SET read_at = coalesce(read_at, now())
  WHERE id = p_notification AND recipient_id = actor AND hidden_at IS NULL;
  GET DIAGNOSTICS updated = ROW_COUNT;
  IF updated > 0 THEN
    INSERT INTO m10.notification_audit(actor_id, notification_id, action) VALUES(actor, p_notification, 'read');
  END IF;
  RETURN updated > 0;
END;
$fn$;

CREATE OR REPLACE FUNCTION app_internal.mark_all_notifications_read(p_session_hash text)
RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; updated bigint;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL THEN RETURN 0; END IF;
  WITH up AS (UPDATE m10.notifications SET read_at = now() WHERE recipient_id = actor AND hidden_at IS NULL AND read_at IS NULL RETURNING id)
  SELECT count(*) INTO updated FROM up;
  IF updated > 0 THEN
    INSERT INTO m10.notification_audit(actor_id, action) VALUES(actor, 'read_all');
  END IF;
  RETURN updated;
END;
$fn$;

CREATE OR REPLACE FUNCTION app_internal.hide_notification(p_session_hash text, p_notification uuid)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; updated integer;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR p_notification IS NULL THEN RETURN false; END IF;
  UPDATE m10.notifications SET hidden_at = coalesce(hidden_at, now())
  WHERE id = p_notification AND recipient_id = actor;
  GET DIAGNOSTICS updated = ROW_COUNT;
  IF updated > 0 THEN
    INSERT INTO m10.notification_audit(actor_id, notification_id, action) VALUES(actor, p_notification, 'hide');
  END IF;
  RETURN updated > 0;
END;
$fn$;

CREATE OR REPLACE FUNCTION app_internal.read_notification_preferences(p_session_hash text)
RETURNS TABLE(version bigint, enabled boolean, quiet_hours_enabled boolean, quiet_start_minutes integer, quiet_end_minutes integer, type_preferences jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
  SELECT p.version, p.enabled, p.quiet_hours_enabled, p.quiet_start_minutes, p.quiet_end_minutes, p.type_preferences
  FROM m10.notification_preferences p
  WHERE p.account_id = app_internal.session_actor(p_session_hash)
  UNION ALL
  SELECT 0::bigint, true, false, 1320, 360, '{}'::jsonb
  WHERE NOT EXISTS (SELECT 1 FROM m10.notification_preferences WHERE account_id = app_internal.session_actor(p_session_hash))
  LIMIT 1;
$fn$;

CREATE OR REPLACE FUNCTION app_internal.update_notification_preferences(p_session_hash text, p_command uuid, p_version bigint, p_enabled boolean, p_quiet_enabled boolean, p_quiet_start integer, p_quiet_end integer, p_type_preferences jsonb)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; cur_version bigint; prior app_internal.command_receipts%ROWTYPE; fingerprint text; res uuid;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL OR p_command IS NULL OR p_version IS NULL OR p_version < 0 OR p_quiet_start < 0 OR p_quiet_start > 1439 OR p_quiet_end < 0 OR p_quiet_end > 1439 OR p_type_preferences IS NULL THEN
    RAISE EXCEPTION 'invalid preferences' USING ERRCODE='22023';
  END IF;
  fingerprint := encode(sha256(convert_to(jsonb_build_array(p_version,p_enabled,p_quiet_enabled,p_quiet_start,p_quiet_end,p_type_preferences)::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id = actor AND command_id = p_command;
  IF FOUND THEN
    IF prior.module <> 'M10' OR prior.action <> 'notifications.preferences.update' OR prior.request_hash <> fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  SELECT version INTO cur_version FROM m10.notification_preferences WHERE account_id = actor FOR UPDATE;
  IF coalesce(cur_version,0) <> p_version THEN
    RAISE EXCEPTION 'preferences conflict' USING ERRCODE='23505';
  END IF;
  IF cur_version IS NULL THEN
    INSERT INTO m10.notification_preferences(account_id, version, enabled, quiet_hours_enabled, quiet_start_minutes, quiet_end_minutes, type_preferences, updated_at)
    VALUES(actor, 1, p_enabled, p_quiet_enabled, p_quiet_start, p_quiet_end, p_type_preferences, now()) RETURNING account_id INTO res;
  ELSE
    UPDATE m10.notification_preferences SET version = cur_version + 1, enabled = p_enabled, quiet_hours_enabled = p_quiet_enabled, quiet_start_minutes = p_quiet_start, quiet_end_minutes = p_quiet_end, type_preferences = p_type_preferences, updated_at = now()
    WHERE account_id = actor RETURNING account_id INTO res;
  END IF;
  INSERT INTO app_internal.command_receipts(actor_id, command_id, module, action, request_hash, result_ref)
  VALUES(actor, p_command, 'M10', 'notifications.preferences.update', fingerprint, res);
  INSERT INTO app_internal.audit_events(event_id, actor_id, command_id, module, action, resource_id)
  VALUES(gen_random_uuid(), actor, p_command, 'M10', 'notifications.preferences.update', res);
  INSERT INTO app_internal.outbox(event_id, actor_id, command_id, source_module, source_id, source_revision, event_type)
  VALUES(gen_random_uuid(), actor, p_command, 'M10', res, (SELECT version FROM m10.notification_preferences WHERE account_id = actor), 'notifications.preferences.updated');
  RETURN res;
END;
$fn$;

REVOKE ALL ON FUNCTION app_internal.read_notifications(text,integer,boolean),
  app_internal.unread_notification_count(text),
  app_internal.mark_notification_read(text,uuid),
  app_internal.mark_all_notifications_read(text),
  app_internal.hide_notification(text,uuid),
  app_internal.read_notification_preferences(text),
  app_internal.update_notification_preferences(text,uuid,bigint,boolean,boolean,integer,integer,jsonb) FROM PUBLIC;
