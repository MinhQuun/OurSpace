CREATE FUNCTION app_internal.read_personal_preferences(p_session_hash text)
RETURNS TABLE(theme text,language text,timezone text,date_format text,hour_cycle text,
 reduced_motion text,font_scale numeric,version bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT coalesce(p.theme,'system'),coalesce(p.language,'vi-VN'),coalesce(p.timezone,'Asia/Ho_Chi_Minh'),
 coalesce(p.date_format,'dd/MM/yyyy'),coalesce(p.hour_cycle,'h23'),coalesce(p.reduced_motion,'system'),
 coalesce(p.font_scale,1),coalesce(p.version,0)
 FROM m10.accounts a LEFT JOIN m10.personal_preferences p ON p.user_id=a.id
 WHERE a.id=app_internal.session_actor(p_session_hash);
$fn$;
CREATE FUNCTION app_internal.update_personal_preferences(p_session_hash text,p_command uuid,p_version bigint,
 p_theme text,p_language text,p_timezone text,p_date_format text,p_hour_cycle text,p_reduced_motion text,p_font_scale numeric)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; current_version bigint; revision bigint; fingerprint text;
 prior app_internal.command_receipts%ROWTYPE;
BEGIN
 IF p_command IS NULL OR p_version IS NULL OR p_version<0
 OR p_theme IS NULL OR p_theme NOT IN ('light','dark','system')
 OR p_language IS DISTINCT FROM 'vi-VN'
 OR p_date_format IS NULL OR p_date_format NOT IN ('dd/MM/yyyy','MM/dd/yyyy','yyyy-MM-dd')
 OR p_hour_cycle IS NULL OR p_hour_cycle NOT IN ('h12','h23')
 OR p_reduced_motion IS NULL OR p_reduced_motion NOT IN ('system','reduce')
 OR p_font_scale IS NULL OR p_font_scale NOT BETWEEN 1 AND 2 OR p_font_scale<>round(p_font_scale,2)
 OR p_timezone IS NULL OR NOT EXISTS(SELECT 1 FROM pg_timezone_names WHERE name=p_timezone
   AND (name='UTC' OR name LIKE '%/%') AND name NOT LIKE 'posix/%' AND name NOT LIKE 'right/%') THEN
   RAISE EXCEPTION 'invalid preferences' USING ERRCODE='22023';
 END IF;
 actor:=app_internal.session_actor(p_session_hash);
 IF actor IS NULL THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.accounts WHERE id=actor AND state='active' FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 PERFORM 1 FROM m10.sessions WHERE account_id=actor AND token_hash=p_session_hash
   AND revoked_at IS NULL AND expires_at>clock_timestamp() FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
 fingerprint:=encode(sha256(convert_to(jsonb_build_array(p_version,p_theme,p_language,p_timezone,
   p_date_format,p_hour_cycle,p_reduced_motion,trim_scale(p_font_scale))::text,'UTF8')),'hex');
 SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
 IF FOUND THEN
   IF prior.module<>'M10' OR prior.action<>'preferences.update' OR prior.request_hash<>fingerprint THEN
     RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
   END IF;
   RETURN prior.result_ref;
 END IF;
 SELECT version INTO current_version FROM m10.personal_preferences WHERE user_id=actor FOR UPDATE;
 IF coalesce(current_version,0)<>p_version THEN RAISE EXCEPTION 'preference conflict' USING ERRCODE='23505'; END IF;
 INSERT INTO m10.personal_preferences(user_id,theme,language,timezone,date_format,hour_cycle,reduced_motion,font_scale)
 VALUES(actor,p_theme,p_language,p_timezone,p_date_format,p_hour_cycle,p_reduced_motion,p_font_scale)
 ON CONFLICT(user_id) DO UPDATE SET theme=EXCLUDED.theme,language=EXCLUDED.language,timezone=EXCLUDED.timezone,
 date_format=EXCLUDED.date_format,hour_cycle=EXCLUDED.hour_cycle,reduced_motion=EXCLUDED.reduced_motion,font_scale=EXCLUDED.font_scale
 RETURNING version INTO revision;
 INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
 VALUES(actor,p_command,'M10','preferences.update',fingerprint,actor);
 INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
 VALUES(gen_random_uuid(),actor,p_command,'M10','preferences.update',actor);
 INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
 VALUES(gen_random_uuid(),actor,p_command,'M10',actor,revision,'preferences.updated');
 RETURN actor;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.read_personal_preferences(text),
 app_internal.update_personal_preferences(text,uuid,bigint,text,text,text,text,text,text,numeric) FROM PUBLIC;
