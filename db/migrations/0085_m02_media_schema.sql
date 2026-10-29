-- M02 Media Library schema foundation
-- Media items are M10 resources (module='M02', kind='media') carrying media-specific metadata.
-- Source objects are owned by M02 and are never cascade-deleted across modules.
CREATE SCHEMA IF NOT EXISTS m02;

CREATE TABLE m02.media (
  id uuid PRIMARY KEY REFERENCES m10.resources(id) ON DELETE RESTRICT,
  title text NOT NULL CHECK(length(btrim(title)) BETWEEN 1 AND 200),
  description text,
  mime_type text NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  version bigint NOT NULL DEFAULT 1 CHECK(version>0)
);

ALTER TABLE m02.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE m02.media FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m02.media FROM PUBLIC;

CREATE INDEX IF NOT EXISTS m02_media_uploaded_by ON m02.media(uploaded_by, created_at DESC);

-- Keep media metadata in sync with resource version on update.
CREATE OR REPLACE FUNCTION m02.guard_media_version()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $function$
BEGIN
  NEW.version := OLD.version + 1;
  NEW.updated_at := clock_timestamp();
  RETURN NEW;
END;
$function$;
CREATE TRIGGER media_version_trigger BEFORE UPDATE ON m02.media
FOR EACH ROW EXECUTE FUNCTION m02.guard_media_version();
REVOKE ALL ON FUNCTION m02.guard_media_version() FROM PUBLIC;
