ALTER TABLE m02.upload_items ADD COLUMN reused boolean NOT NULL DEFAULT false;
ALTER TABLE m02.upload_items ADD CONSTRAINT reused_upload_completed CHECK(NOT reused OR media_id IS NOT NULL);
ALTER TABLE m02.upload_items DROP CONSTRAINT upload_items_media_id_key;
CREATE UNIQUE INDEX upload_created_media ON m02.upload_items(media_id) WHERE NOT reused;
CREATE OR REPLACE FUNCTION app_internal.guard_upload_intent() RETURNS trigger
LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
 IF (to_jsonb(NEW)-'media_id'-'completed_at'-'cancelled_at'-'reused') IS DISTINCT FROM
    (to_jsonb(OLD)-'media_id'-'completed_at'-'cancelled_at'-'reused') OR OLD.media_id IS NOT NULL OR OLD.cancelled_at IS NOT NULL
    OR NOT ((NEW.media_id IS NOT NULL AND NEW.completed_at IS NOT NULL AND NEW.cancelled_at IS NULL)
       OR (NEW.media_id IS NULL AND NEW.completed_at IS NULL AND NEW.cancelled_at IS NOT NULL AND NOT NEW.reused)) THEN
  RAISE EXCEPTION 'immutable upload intent' USING ERRCODE='42501';
 END IF;
 RETURN NEW;
END;
$fn$;
CREATE FUNCTION app_internal.reuse_media_upload(p_session_hash text,p_upload uuid,p_media uuid,p_confirmed boolean)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; item m02.upload_items%ROWTYPE;
BEGIN
 IF p_confirmed IS DISTINCT FROM true OR p_upload IS NULL OR p_media IS NULL THEN
  RAISE EXCEPTION 'explicit reuse required' USING ERRCODE='22023';
 END IF;
 actor:=app_internal.session_actor(p_session_hash);
 IF actor IS NULL THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.accounts WHERE id=actor AND state='active' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.sessions WHERE account_id=actor AND token_hash=p_session_hash
 AND revoked_at IS NULL AND expires_at>clock_timestamp() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 SELECT * INTO item FROM m02.upload_items WHERE id=p_upload AND owner_id=actor FOR UPDATE;
 IF NOT FOUND OR item.cancelled_at IS NOT NULL THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.resources WHERE id=p_media FOR SHARE;
 IF NOT app_internal.can_read_resource(p_session_hash,p_media) OR NOT EXISTS (
  SELECT 1 FROM m02.media m LEFT JOIN m02.media_copy_sources s ON s.copy_id=m.id
  JOIN app_internal.binary_objects b ON b.id=s.binary_id OR (s.copy_id IS NULL AND b.resource_id=m.id AND b.purpose='original')
  WHERE m.id=p_media AND b.sha256=item.sha256 AND b.byte_size=item.byte_size AND m.mime_type=item.mime_type
 ) THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 IF item.media_id IS NOT NULL THEN
  IF item.reused AND item.media_id=p_media THEN RETURN p_media; END IF;
  RAISE EXCEPTION 'already resolved' USING ERRCODE='23505';
 END IF;
 UPDATE m02.upload_items SET reused=true,media_id=p_media,completed_at=clock_timestamp() WHERE id=p_upload;
 INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
 VALUES(actor,item.finalize_command,'M02','upload.reuse',encode(sha256(convert_to(jsonb_build_array(p_upload,p_media)::text,'UTF8')),'hex'),p_media);
 INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
 VALUES(gen_random_uuid(),actor,item.finalize_command,'M02','upload.reuse',p_media);
 RETURN p_media;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.reuse_media_upload(text,uuid,uuid,boolean) FROM PUBLIC;

CREATE OR REPLACE FUNCTION app_internal.finalize_media_upload(p_session_hash text,p_upload uuid,
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
 IF item.cancelled_at IS NOT NULL THEN RAISE EXCEPTION 'cancelled upload' USING ERRCODE='42501'; END IF;
 IF p_verified_mime IS DISTINCT FROM item.mime_type OR p_verified_size IS DISTINCT FROM item.byte_size
 OR p_verified_sha IS DISTINCT FROM item.sha256 THEN
  RAISE EXCEPTION 'upload integrity mismatch' USING ERRCODE='22023';
 END IF;
 IF item.reused THEN RAISE EXCEPTION 'already reused' USING ERRCODE='23505'; END IF;
 IF item.media_id IS NOT NULL THEN RETURN item.media_id; END IF;
 result:=app_internal.register_media(p_session_hash,item.finalize_command,item.title,item.mime_type,
 item.bucket,item.object_key,item.byte_size,item.sha256);
 UPDATE m02.upload_items SET media_id=result,completed_at=clock_timestamp() WHERE id=item.id;
 RETURN result;
END;
$fn$;
