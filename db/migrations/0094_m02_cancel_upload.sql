ALTER TABLE m02.upload_items ADD COLUMN cancelled_at timestamptz;
ALTER TABLE m02.upload_items ADD CONSTRAINT upload_single_terminal_state CHECK(media_id IS NULL OR cancelled_at IS NULL);
CREATE OR REPLACE FUNCTION app_internal.guard_upload_intent() RETURNS trigger
LANGUAGE plpgsql SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
 IF (to_jsonb(NEW)-'media_id'-'completed_at'-'cancelled_at') IS DISTINCT FROM
    (to_jsonb(OLD)-'media_id'-'completed_at'-'cancelled_at') OR OLD.media_id IS NOT NULL OR OLD.cancelled_at IS NOT NULL
    OR NOT ((NEW.media_id IS NOT NULL AND NEW.completed_at IS NOT NULL AND NEW.cancelled_at IS NULL)
       OR (NEW.media_id IS NULL AND NEW.completed_at IS NULL AND NEW.cancelled_at IS NOT NULL)) THEN
  RAISE EXCEPTION 'immutable upload intent' USING ERRCODE='42501';
 END IF;
 RETURN NEW;
END;
$fn$;
CREATE FUNCTION app_internal.cancel_media_upload(p_session_hash text,p_upload uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; item m02.upload_items%ROWTYPE; cancellation uuid:=gen_random_uuid();
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
 IF item.media_id IS NOT NULL THEN RAISE EXCEPTION 'already completed' USING ERRCODE='23505'; END IF;
 IF item.cancelled_at IS NOT NULL THEN RETURN; END IF;
 UPDATE m02.upload_items SET cancelled_at=clock_timestamp() WHERE id=p_upload;
 INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
 VALUES(actor,cancellation,'M02','upload.cancel',encode(sha256(convert_to(item.id::text,'UTF8')),'hex'),item.id);
 INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
 VALUES(gen_random_uuid(),actor,cancellation,'M02','upload.cancel',item.id);
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.cancel_media_upload(text,uuid) FROM PUBLIC;
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
 IF item.media_id IS NOT NULL THEN RETURN item.media_id; END IF;
 result:=app_internal.register_media(p_session_hash,item.finalize_command,item.title,item.mime_type,
 item.bucket,item.object_key,item.byte_size,item.sha256);
 UPDATE m02.upload_items SET media_id=result,completed_at=clock_timestamp() WHERE id=item.id;
 RETURN result;
END;
$fn$;
CREATE OR REPLACE FUNCTION app_internal.list_pending_media_uploads(p_session_hash text,p_after uuid DEFAULT NULL)
RETURNS TABLE(id uuid,title text,mime_type text,byte_size bigint,sha256 text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT u.id,u.title,u.mime_type,u.byte_size,u.sha256 FROM m02.upload_items u
 WHERE u.owner_id=app_internal.session_actor(p_session_hash) AND u.media_id IS NULL AND u.cancelled_at IS NULL
 AND (p_after IS NULL OR u.id<p_after)
 ORDER BY u.id DESC LIMIT 51;
$fn$;
REVOKE ALL ON FUNCTION app_internal.list_pending_media_uploads(text,uuid) FROM PUBLIC;
