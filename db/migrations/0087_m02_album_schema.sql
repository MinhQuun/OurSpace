-- M02 Media Library: album schema
-- Albums are M10 resources (module='M02', kind='album') linking media items.
-- No cascade delete across modules.
CREATE TABLE m02.album (
  id uuid PRIMARY KEY REFERENCES m10.resources(id) ON DELETE RESTRICT,
  title text NOT NULL CHECK(length(btrim(title)) BETWEEN 1 AND 200),
  description text,
  created_by uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  version bigint NOT NULL DEFAULT 1 CHECK(version>0)
);

CREATE TABLE m02.media_album (
  media_id uuid NOT NULL REFERENCES m10.resources(id) ON DELETE RESTRICT,
  album_id uuid NOT NULL REFERENCES m10.resources(id) ON DELETE RESTRICT,
  added_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (media_id, album_id)
);

ALTER TABLE m02.album ENABLE ROW LEVEL SECURITY;
ALTER TABLE m02.album FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m02.album FROM PUBLIC;

ALTER TABLE m02.media_album ENABLE ROW LEVEL SECURITY;
ALTER TABLE m02.media_album FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m02.media_album FROM PUBLIC;

CREATE INDEX IF NOT EXISTS m02_album_created_by ON m02.album(created_by, created_at DESC);
CREATE INDEX IF NOT EXISTS m02_media_album_album ON m02.media_album(album_id, added_at DESC);
CREATE INDEX IF NOT EXISTS m02_media_album_media ON m02.media_album(media_id);

CREATE OR REPLACE FUNCTION m02.guard_album_version()
RETURNS trigger LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $function$
BEGIN
  NEW.version := OLD.version + 1;
  NEW.updated_at := clock_timestamp();
  RETURN NEW;
END;
$function$;
CREATE TRIGGER album_version_trigger BEFORE UPDATE ON m02.album
FOR EACH ROW EXECUTE FUNCTION m02.guard_album_version();
REVOKE ALL ON FUNCTION m02.guard_album_version() FROM PUBLIC;
