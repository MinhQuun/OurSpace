-- Intent is not a Ready media asset. Only the trusted upload verifier may finalize.
CREATE TABLE m02.upload_items (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 owner_id uuid NOT NULL REFERENCES m10.accounts(id) ON DELETE RESTRICT,
 title text NOT NULL CHECK(length(btrim(title)) BETWEEN 1 AND 200),
 mime_type text NOT NULL CHECK(mime_type IN ('image/jpeg','image/png','image/webp','image/heic','video/mp4','video/quicktime')),
 byte_size bigint NOT NULL CHECK(byte_size>0),
 sha256 text NOT NULL CHECK(sha256 ~ '^[a-f0-9]{64}$'),
 bucket text NOT NULL DEFAULT 'media' CHECK(bucket='media'),
 object_key uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
 finalize_command uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
 media_id uuid UNIQUE REFERENCES m02.media(id) ON DELETE RESTRICT,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 completed_at timestamptz,
 CHECK((media_id IS NULL)=(completed_at IS NULL))
);
ALTER TABLE m02.upload_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE m02.upload_items FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m02.upload_items FROM PUBLIC;
CREATE INDEX upload_items_owner ON m02.upload_items(owner_id,created_at,id);
CREATE FUNCTION app_internal.guard_upload_intent() RETURNS trigger
LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
 IF (to_jsonb(NEW)-'media_id'-'completed_at') IS DISTINCT FROM
    (to_jsonb(OLD)-'media_id'-'completed_at') OR OLD.media_id IS NOT NULL
    OR NEW.media_id IS NULL OR NEW.completed_at IS NULL THEN
  RAISE EXCEPTION 'immutable upload intent' USING ERRCODE='42501';
 END IF;
 RETURN NEW;
END;
$fn$;
CREATE TRIGGER immutable_upload_intent BEFORE UPDATE ON m02.upload_items
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_upload_intent();
REVOKE ALL ON FUNCTION app_internal.guard_upload_intent() FROM PUBLIC;

CREATE FUNCTION app_internal.begin_media_upload(p_session_hash text,p_command uuid,
 p_title text,p_mime text,p_size bigint,p_sha text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; prior app_internal.command_receipts%ROWTYPE; fingerprint text; result uuid;
BEGIN
 IF p_command IS NULL OR p_title IS NULL OR length(btrim(p_title)) NOT BETWEEN 1 AND 200
 OR p_mime IS NULL OR p_mime NOT IN ('image/jpeg','image/png','image/webp','image/heic','video/mp4','video/quicktime')
 OR p_size IS NULL OR p_size<=0 OR p_sha IS NULL OR p_sha !~ '^[a-f0-9]{64}$' THEN
  RAISE EXCEPTION 'invalid upload intent' USING ERRCODE='22023';
 END IF;
 actor:=app_internal.session_actor(p_session_hash);
 IF actor IS NULL THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.accounts WHERE id=actor AND state='active' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.sessions WHERE account_id=actor AND token_hash=p_session_hash
 AND revoked_at IS NULL AND expires_at>clock_timestamp() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 fingerprint:=encode(sha256(convert_to(jsonb_build_array(btrim(p_title),p_mime,p_size,p_sha)::text,'UTF8')),'hex');
 SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
 IF FOUND THEN
  IF prior.module<>'M02' OR prior.action<>'upload.begin' OR prior.request_hash<>fingerprint THEN
   RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
  END IF;
  RETURN prior.result_ref;
 END IF;
 INSERT INTO m02.upload_items(owner_id,title,mime_type,byte_size,sha256)
 VALUES(actor,btrim(p_title),p_mime,p_size,p_sha) RETURNING id INTO result;
 INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
 VALUES(actor,p_command,'M02','upload.begin',fingerprint,result);
 RETURN result;
END;
$fn$;

CREATE FUNCTION app_internal.read_media_upload(p_session_hash text,p_upload uuid)
RETURNS TABLE(id uuid,title text,mime_type text,byte_size bigint,sha256 text,bucket text,
 object_key uuid,media_id uuid,completed_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT u.id,u.title,u.mime_type,u.byte_size,u.sha256,u.bucket,u.object_key,u.media_id,u.completed_at
 FROM m02.upload_items u WHERE u.id=p_upload AND u.owner_id=app_internal.session_actor(p_session_hash);
$fn$;

-- Parameters must come from server-side media validation and Storage readback.
-- No browser/raw client registration grant is added by this migration.
CREATE FUNCTION app_internal.finalize_media_upload(p_session_hash text,p_upload uuid,
 p_verified_mime text,p_verified_size bigint,p_verified_sha text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; item m02.upload_items%ROWTYPE; result uuid;
BEGIN
 actor:=app_internal.session_actor(p_session_hash);
 IF actor IS NULL THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.accounts WHERE id=actor AND state='active' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.sessions WHERE account_id=actor AND token_hash=p_session_hash
 AND revoked_at IS NULL AND expires_at>clock_timestamp() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 SELECT * INTO item FROM m02.upload_items WHERE id=p_upload AND owner_id=actor FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 IF p_verified_mime IS DISTINCT FROM item.mime_type OR p_verified_size IS DISTINCT FROM item.byte_size
 OR p_verified_sha IS DISTINCT FROM item.sha256 THEN
  RAISE EXCEPTION 'upload integrity mismatch' USING ERRCODE='22023';
 END IF;
 IF item.media_id IS NOT NULL THEN RETURN item.media_id; END IF;
 result:=app_internal.register_media(p_session_hash,item.finalize_command,item.title,item.mime_type,
 item.bucket,item.object_key,item.byte_size,item.sha256);
 UPDATE m02.upload_items SET media_id=result,completed_at=clock_timestamp() WHERE id=item.id;
 RETURN result;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.begin_media_upload(text,uuid,text,text,bigint,text),
 app_internal.read_media_upload(text,uuid),app_internal.finalize_media_upload(text,uuid,text,bigint,text) FROM PUBLIC;
