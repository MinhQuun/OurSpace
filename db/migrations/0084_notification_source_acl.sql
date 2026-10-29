-- M10 ST-16/ST-17: apply source ACL to notification list/count
-- Revoked, private or conditional sources must not leak through notification
-- list or unread count. Account-only notices (no source) remain visible.
CREATE OR REPLACE FUNCTION app_internal.read_notifications(p_session_hash text, p_limit integer DEFAULT 50, p_include_read boolean DEFAULT true)
RETURNS TABLE(id uuid, notification_type text, space_id uuid, source_module text, source_id uuid, title_key text, body_key text, link_href text, priority text, is_essential boolean, read_at timestamptz, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
  SELECT n.id, n.notification_type, n.space_id, n.source_module, n.source_id, n.title_key, n.body_key, n.link_href, n.priority, n.is_essential, n.read_at, n.created_at
  FROM m10.notifications n
  WHERE n.recipient_id = app_internal.session_actor(p_session_hash)
    AND n.hidden_at IS NULL
    AND (p_include_read OR n.read_at IS NULL)
    AND (n.expires_at IS NULL OR n.expires_at > now())
    AND (
      (n.source_module IS NULL AND n.source_id IS NULL)
      OR app_internal.can_read_resource(p_session_hash, n.source_id)
    )
  ORDER BY n.created_at DESC, n.id DESC
  LIMIT GREATEST(1, LEAST(coalesce(p_limit,50), 100));
$fn$;

CREATE OR REPLACE FUNCTION app_internal.unread_notification_count(p_session_hash text)
RETURNS bigint LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
  SELECT count(*) FROM m10.notifications n
  WHERE n.recipient_id = app_internal.session_actor(p_session_hash)
    AND n.hidden_at IS NULL AND n.read_at IS NULL
    AND (n.expires_at IS NULL OR n.expires_at > now())
    AND (
      (n.source_module IS NULL AND n.source_id IS NULL)
      OR app_internal.can_read_resource(p_session_hash, n.source_id)
    );
$fn$;

REVOKE ALL ON FUNCTION app_internal.read_notifications(text,integer,boolean),
  app_internal.unread_notification_count(text) FROM PUBLIC;
