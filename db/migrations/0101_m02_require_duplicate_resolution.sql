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
 IF NOT EXISTS(SELECT 1 FROM m02.upload_separate_decisions WHERE upload_id=p_upload)
 AND EXISTS(SELECT 1 FROM app_internal.find_media_duplicates(p_session_hash,item.sha256,item.byte_size,NULL)) THEN
  RAISE EXCEPTION 'duplicate resolution required' USING ERRCODE='23505';
 END IF;
 result:=app_internal.register_media(p_session_hash,item.finalize_command,item.title,item.mime_type,
 item.bucket,item.object_key,item.byte_size,item.sha256);
 UPDATE m02.upload_items SET media_id=result,completed_at=clock_timestamp() WHERE id=item.id;
 RETURN result;
END;
$fn$;
