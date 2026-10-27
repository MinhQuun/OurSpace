-- Private storage mapping; clients never choose bucket/key or parent ACL.
-- Domain upload/finalization adapters populate this registry after validation.
CREATE TABLE app_internal.binary_objects (
  id uuid PRIMARY KEY,
  resource_id uuid NOT NULL REFERENCES m10.resources(id) ON DELETE RESTRICT,
  purpose text NOT NULL CHECK(purpose IN ('original','preview','document')),
  bucket text NOT NULL CHECK(bucket ~ '^[a-z][a-z0-9-]{0,62}$'),
  object_key uuid NOT NULL DEFAULT gen_random_uuid(),
  byte_size bigint NOT NULL CHECK(byte_size>=0),
  sha256 text NOT NULL CHECK(sha256 ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  UNIQUE(bucket,object_key)
);
ALTER TABLE app_internal.binary_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_internal.binary_objects FORCE ROW LEVEL SECURITY;
REVOKE ALL ON app_internal.binary_objects FROM PUBLIC;
CREATE FUNCTION app_internal.guard_binary_object_identity()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp
AS $function$
BEGIN
  RAISE EXCEPTION 'immutable binary binding' USING ERRCODE='42501';
END;
$function$;
CREATE TRIGGER binary_object_identity BEFORE UPDATE ON app_internal.binary_objects
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_binary_object_identity();
REVOKE ALL ON FUNCTION app_internal.guard_binary_object_identity() FROM PUBLIC;
-- Internal base read only: the download adapter must additionally resolve domain
-- permission and stream bytes itself, never return storage credentials/URLs.
CREATE FUNCTION app_internal.resolve_readable_binary(p_session_hash text,p_binary uuid)
RETURNS TABLE(binary_id uuid,resource_id uuid,purpose text,bucket text,object_key uuid,byte_size bigint,sha256 text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp
AS $function$
  SELECT b.id,b.resource_id,b.purpose,b.bucket,b.object_key,b.byte_size,b.sha256
  FROM app_internal.binary_objects b
  WHERE b.id=p_binary AND app_internal.can_read_resource(p_session_hash,b.resource_id);
$function$;
REVOKE ALL ON FUNCTION app_internal.resolve_readable_binary(text,uuid) FROM PUBLIC;
