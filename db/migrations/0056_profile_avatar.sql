-- M10 D07, BR-M10-13. Avatar references M02 media and must respect source permissions.
ALTER TABLE m10.profiles
  ADD COLUMN IF NOT EXISTS avatar_ref uuid;

DROP FUNCTION IF EXISTS app_internal.read_my_profile(text);
CREATE FUNCTION app_internal.read_my_profile(p_session_hash text)
RETURNS TABLE(user_id uuid,display_name text,nickname text,birthday date,bio text,avatar_ref uuid,version bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
  SELECT p.user_id,p.display_name,p.nickname,p.birthday,p.bio,p.avatar_ref,p.version
  FROM m10.profiles p WHERE p.user_id=app_internal.session_actor(p_session_hash);
$fn$;
REVOKE ALL ON FUNCTION app_internal.read_my_profile(text) FROM PUBLIC;

DROP FUNCTION IF EXISTS app_internal.update_my_profile(text,uuid,bigint,text,text,date,text);
DROP FUNCTION IF EXISTS app_internal.update_my_profile(text,uuid,bigint,text,text,date,text,uuid);
CREATE FUNCTION app_internal.update_my_profile(p_session_hash text,p_command uuid,p_version bigint,
  p_display_name text,p_nickname text,p_birthday date,p_bio text,p_avatar_ref uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; current_profile m10.profiles%ROWTYPE;
  prior app_internal.command_receipts%ROWTYPE; fingerprint text;
BEGIN
  p_display_name:=btrim(p_display_name);
  p_nickname:=nullif(btrim(p_nickname),'');
  p_bio:=nullif(p_bio,'');
  IF p_command IS NULL OR p_version IS NULL OR p_version<1 OR p_display_name IS NULL
    OR length(p_display_name) NOT BETWEEN 1 AND 120 OR p_display_name ~ '^[[:space:]]*$'
    OR length(p_nickname)>120 OR length(p_bio)>4000
    OR (p_birthday IS NOT NULL AND NOT isfinite(p_birthday)) THEN
    RAISE EXCEPTION 'invalid profile' USING ERRCODE='22023';
  END IF;
  actor:=app_internal.session_actor(p_session_hash);
  IF actor IS NULL THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  PERFORM 1 FROM m10.accounts WHERE id=actor AND state='active' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  PERFORM 1 FROM m10.sessions WHERE token_hash=p_session_hash AND account_id=actor
    AND revoked_at IS NULL AND expires_at>clock_timestamp() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  SELECT * INTO current_profile FROM m10.profiles WHERE user_id=actor FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  fingerprint:=encode(sha256(convert_to(jsonb_build_array(p_version,p_display_name,p_nickname,
    p_birthday-DATE '2000-01-01',p_bio,p_avatar_ref)::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'profile.update' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  IF current_profile.version<>p_version THEN
    RAISE EXCEPTION 'version conflict' USING ERRCODE='40001';
  END IF;
  UPDATE m10.profiles SET display_name=p_display_name,nickname=p_nickname,birthday=p_birthday,
    bio=p_bio,avatar_ref=p_avatar_ref WHERE user_id=actor;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','profile.update',fingerprint,actor);
  INSERT INTO app_internal.command_audit(actor_id,module,action,resource_type,resource_id)
    VALUES(actor,'M10','profile.update','profile',actor);
  INSERT INTO app_internal.outbox(event_type,payload) VALUES('profile.updated',jsonb_build_object('userId',actor));
  RETURN actor;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.update_my_profile(text,uuid,bigint,text,text,date,text,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_internal.update_my_profile(text,uuid,bigint,text,text,date,text,uuid) TO ourspace_runtime;
