-- Forward repair of applied 0056; preserve legacy command receipts and text-only updates.
CREATE FUNCTION app_internal.update_my_profile(p_session_hash text,p_command uuid,p_version bigint,
  p_display_name text,p_nickname text,p_birthday date,p_bio text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; current_profile m10.profiles%ROWTYPE;
  prior app_internal.command_receipts%ROWTYPE; fingerprint text; revision bigint;
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
    p_birthday-DATE '2000-01-01',p_bio)::text,'UTF8')),'hex');
  SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
  IF FOUND THEN
    IF prior.module<>'M10' OR prior.action<>'profile.update' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  IF current_profile.version<>p_version THEN
    RAISE EXCEPTION 'profile conflict' USING ERRCODE='23505';
  END IF;
  UPDATE m10.profiles SET display_name=p_display_name,nickname=p_nickname,birthday=p_birthday,bio=p_bio
    WHERE user_id=actor RETURNING version INTO revision;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','profile.update',fingerprint,actor);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','profile.update',actor);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',actor,revision,'profile.updated');
  RETURN actor;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.update_my_profile(text,uuid,bigint,text,text,date,text) FROM PUBLIC;

CREATE OR REPLACE FUNCTION app_internal.update_my_profile(p_session_hash text,p_command uuid,p_version bigint,
  p_display_name text,p_nickname text,p_birthday date,p_bio text,p_avatar_ref uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; current_profile m10.profiles%ROWTYPE;
  prior app_internal.command_receipts%ROWTYPE; fingerprint text; revision bigint;
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
    IF prior.module<>'M10' OR prior.action<>'profile.avatar.update' OR prior.request_hash<>fingerprint THEN
      RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
    END IF;
    RETURN prior.result_ref;
  END IF;
  IF current_profile.version<>p_version THEN
    RAISE EXCEPTION 'version conflict' USING ERRCODE='23505';
  END IF;
  IF p_avatar_ref IS NOT NULL THEN
    PERFORM 1 FROM m10.resources WHERE id=p_avatar_ref AND module='M02' FOR SHARE;
    IF NOT FOUND OR NOT app_internal.can_read_resource(p_session_hash,p_avatar_ref) THEN
      RAISE EXCEPTION 'denied' USING ERRCODE='42501';
    END IF;
  END IF;
  UPDATE m10.profiles SET display_name=p_display_name,nickname=p_nickname,birthday=p_birthday,
    bio=p_bio,avatar_ref=p_avatar_ref WHERE user_id=actor RETURNING version INTO revision;
  INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
    VALUES(actor,p_command,'M10','profile.avatar.update',fingerprint,actor);
  INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
    VALUES(gen_random_uuid(),actor,p_command,'M10','profile.avatar.update',actor);
  INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
    VALUES(gen_random_uuid(),actor,p_command,'M10',actor,revision,'profile.updated');
  RETURN actor;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.update_my_profile(text,uuid,bigint,text,text,date,text,uuid) FROM PUBLIC;

CREATE OR REPLACE FUNCTION app_internal.read_my_profile(p_session_hash text)
RETURNS TABLE(user_id uuid,display_name text,nickname text,birthday date,bio text,avatar_ref uuid,version bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT p.user_id,p.display_name,p.nickname,p.birthday,p.bio,
   CASE WHEN app_internal.can_read_resource(p_session_hash,p.avatar_ref) THEN p.avatar_ref END,p.version
 FROM m10.profiles p WHERE p.user_id=app_internal.session_actor(p_session_hash);
$fn$;
REVOKE ALL ON FUNCTION app_internal.read_my_profile(text) FROM PUBLIC;
