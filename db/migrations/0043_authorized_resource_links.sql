-- Cross-module references do not confer ownership or permissions.
CREATE TABLE m10.resource_links (
  source_id uuid NOT NULL REFERENCES m10.resources(id) ON DELETE RESTRICT,
  target_id uuid NOT NULL REFERENCES m10.resources(id) ON DELETE RESTRICT,
  relation text NOT NULL CHECK(relation ~ '^[a-z][a-z0-9_]{0,63}$'),
  PRIMARY KEY(source_id,target_id,relation),
  CHECK(source_id<>target_id)
);
ALTER TABLE m10.resource_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE m10.resource_links FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m10.resource_links FROM PUBLIC;
CREATE FUNCTION app_internal.visible_resource_links(p_session_hash text,p_source uuid)
RETURNS TABLE(target_id uuid,module text,kind text,relation text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
  SELECT r.id,r.module,r.kind,l.relation
  FROM m10.resource_links l JOIN m10.resources r ON r.id=l.target_id
  WHERE l.source_id=p_source
    AND app_internal.can_read_resource(p_session_hash,p_source)
    AND app_internal.can_read_resource(p_session_hash,l.target_id)
  ORDER BY r.id,l.relation;
$function$;
REVOKE ALL ON FUNCTION app_internal.visible_resource_links(text,uuid) FROM PUBLIC;
