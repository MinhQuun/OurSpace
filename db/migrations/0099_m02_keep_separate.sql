CREATE TABLE m02.upload_separate_decisions (
 upload_id uuid PRIMARY KEY REFERENCES m02.upload_items(id) ON DELETE RESTRICT,
 command_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
 confirmed_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
ALTER TABLE m02.upload_separate_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE m02.upload_separate_decisions FORCE ROW LEVEL SECURITY;
REVOKE ALL ON m02.upload_separate_decisions FROM PUBLIC;
CREATE TRIGGER immutable_separate_decision BEFORE UPDATE OR DELETE ON m02.upload_separate_decisions
FOR EACH ROW EXECUTE FUNCTION app_internal.guard_binary_object_identity();
CREATE FUNCTION app_internal.keep_upload_separate(p_session_hash text,p_upload uuid,p_confirmed boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; item m02.upload_items%ROWTYPE; decision uuid;
BEGIN
 IF p_confirmed IS DISTINCT FROM true OR p_upload IS NULL THEN
  RAISE EXCEPTION 'explicit separate decision required' USING ERRCODE='22023';
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
 IF item.reused THEN RAISE EXCEPTION 'already reused' USING ERRCODE='23505'; END IF;
 IF EXISTS(SELECT 1 FROM m02.upload_separate_decisions WHERE upload_id=p_upload) THEN RETURN; END IF;
 IF item.media_id IS NOT NULL THEN RAISE EXCEPTION 'already completed' USING ERRCODE='23505'; END IF;
 INSERT INTO m02.upload_separate_decisions(upload_id) VALUES(p_upload) RETURNING command_id INTO decision;
 INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
 VALUES(actor,decision,'M02','upload.keep_separate',encode(sha256(convert_to(p_upload::text,'UTF8')),'hex'),p_upload);
 INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
 VALUES(gen_random_uuid(),actor,decision,'M02','upload.keep_separate',p_upload);
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.keep_upload_separate(text,uuid,boolean) FROM PUBLIC;

CREATE OR REPLACE FUNCTION app_internal.reuse_media_upload(p_session_hash text,p_upload uuid,p_media uuid,p_confirmed boolean)
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
 IF EXISTS(SELECT 1 FROM m02.upload_separate_decisions WHERE upload_id=p_upload) THEN
  RAISE EXCEPTION 'separate decision already confirmed' USING ERRCODE='23505';
 END IF;
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

