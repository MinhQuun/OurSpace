CREATE TABLE m02.tags (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 owner_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
 value text NOT NULL CHECK(value=btrim(value) AND length(value)>0),
 UNIQUE(owner_id,value)
);
CREATE TABLE m02.media_tags (
 media_id uuid NOT NULL REFERENCES m02.media(id) ON DELETE RESTRICT,
 tag_id uuid NOT NULL REFERENCES m02.tags(id) ON DELETE RESTRICT,
 PRIMARY KEY(media_id,tag_id)
);
ALTER TABLE m02.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE m02.media_tags ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON m02.tags,m02.media_tags FROM PUBLIC;
CREATE FUNCTION app_internal.read_media_tags(p_session_hash text,p_media uuid)
RETURNS TABLE(id uuid,value text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT t.id,t.value FROM m02.media_tags mt JOIN m02.tags t ON t.id=mt.tag_id
 WHERE mt.media_id=p_media AND app_internal.can_read_resource(p_session_hash,p_media)
 ORDER BY t.value COLLATE "C",t.id;
$fn$;
REVOKE ALL ON FUNCTION app_internal.read_media_tags(text,uuid) FROM PUBLIC;
CREATE FUNCTION app_internal.copy_media_tags()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
 INSERT INTO m02.media_tags(media_id,tag_id)
 SELECT NEW.copy_id,tag_id FROM m02.media_tags WHERE media_id=NEW.source_media_id;
 RETURN NEW;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.copy_media_tags() FROM PUBLIC;
CREATE TRIGGER copy_tags AFTER INSERT ON m02.media_copy_sources
FOR EACH ROW EXECUTE FUNCTION app_internal.copy_media_tags();
