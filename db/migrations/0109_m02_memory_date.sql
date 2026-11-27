-- A user-assigned calendar day, never inferred from uploaded_at or file time.
ALTER TABLE m02.media ADD COLUMN memory_date date;
ALTER TABLE m02.media ADD COLUMN memory_date_set_by uuid REFERENCES m10.accounts(id) ON DELETE RESTRICT;
ALTER TABLE m02.media ADD COLUMN memory_date_set_at timestamptz;
ALTER TABLE m02.media ADD CONSTRAINT media_memory_date_provenance CHECK (
 (memory_date IS NULL OR (isfinite(memory_date) AND memory_date BETWEEN DATE '0001-01-01' AND DATE '9999-12-31' AND memory_date_set_by IS NOT NULL))
 AND ((memory_date_set_by IS NULL) = (memory_date_set_at IS NULL))
 AND (memory_date_set_at IS NULL OR isfinite(memory_date_set_at))
);

CREATE FUNCTION app_internal.read_media_memory_date(p_session_hash text,p_media uuid)
RETURNS TABLE(memory_date text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT to_char(m.memory_date,'YYYY-MM-DD') FROM m02.media m
 WHERE m.id=p_media AND app_internal.can_read_resource(p_session_hash,m.id);
$fn$;
REVOKE ALL ON FUNCTION app_internal.read_media_memory_date(text,uuid) FROM PUBLIC;

-- A logical copy snapshots user metadata; later source edits do not propagate.
CREATE FUNCTION app_internal.copy_media_memory_date()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
 UPDATE m02.media target SET memory_date=source.memory_date,
  memory_date_set_by=source.memory_date_set_by,memory_date_set_at=source.memory_date_set_at
 FROM m02.media source WHERE target.id=NEW.copy_id AND source.id=NEW.source_media_id
  AND source.memory_date_set_by IS NOT NULL;
 RETURN NEW;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.copy_media_memory_date() FROM PUBLIC;
CREATE TRIGGER copy_memory_date AFTER INSERT ON m02.media_copy_sources
FOR EACH ROW EXECUTE FUNCTION app_internal.copy_media_memory_date();
