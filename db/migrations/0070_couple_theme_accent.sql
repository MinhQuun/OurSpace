-- M10 D20 / AC-M10-48: the Couple Theme accent belongs to the Space and its
-- revision history. It never writes any member's personal preferences.
ALTER TABLE m10.couple_profiles ADD COLUMN accent text
 CHECK(accent IS NULL OR accent ~ '^#[0-9a-f]{6}$');
ALTER TABLE m10.couple_profile_revisions ADD COLUMN accent text;
CREATE OR REPLACE FUNCTION app_internal.record_couple_profile_revision()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
 INSERT INTO m10.couple_profile_revisions(space_id,version,title,accent,actor_id,recorded_at)
 VALUES(NEW.space_id,NEW.version,NEW.title,NEW.accent,NEW.updated_by,NEW.updated_at);
 RETURN NEW;
END;
$fn$;
DROP FUNCTION app_internal.read_couple_profile(text,uuid);
CREATE FUNCTION app_internal.read_couple_profile(p_session_hash text,p_space uuid)
RETURNS TABLE(space_id uuid,title text,accent text,version bigint,updated_by uuid,updated_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT s.id,p.title,p.accent,coalesce(p.version,0),p.updated_by,p.updated_at
 FROM m10.couple_spaces s LEFT JOIN m10.couple_profiles p ON p.space_id=s.id
 WHERE s.id=p_space AND app_internal.can_read_couple_profile(p_session_hash,s.id);
$fn$;
DROP FUNCTION app_internal.read_couple_profile_history(text,uuid,bigint);
CREATE FUNCTION app_internal.read_couple_profile_history(p_session_hash text,p_space uuid,p_before bigint)
RETURNS TABLE(version bigint,title text,accent text,actor_id uuid,recorded_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT r.version,r.title,r.accent,r.actor_id,r.recorded_at FROM m10.couple_profile_revisions r
 WHERE r.space_id=p_space AND (p_before IS NULL OR r.version<p_before)
 AND app_internal.can_read_couple_profile(p_session_hash,p_space)
 ORDER BY r.version DESC LIMIT 50;
$fn$;
DROP FUNCTION app_internal.update_couple_profile(text,uuid,uuid,bigint,text);
CREATE FUNCTION app_internal.update_couple_profile(p_session_hash text,p_command uuid,
 p_space uuid,p_version bigint,p_title text,p_accent text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; current_version bigint; revision bigint;
 prior app_internal.command_receipts%ROWTYPE; fingerprint text;
BEGIN
 p_title:=btrim(p_title);
 p_accent:=lower(btrim(p_accent));
 IF p_command IS NULL OR p_space IS NULL OR p_version IS NULL OR p_version<0
   OR (p_title IS NOT NULL AND (length(p_title) NOT BETWEEN 1 AND 120 OR p_title ~ '^[[:space:]]*$'))
   OR (p_accent IS NOT NULL AND p_accent !~ '^#[0-9a-f]{6}$') THEN
   RAISE EXCEPTION 'invalid profile' USING ERRCODE='22023';
 END IF;
 -- Serializes initial creation as well as updates; version zero means absent profile.
 -- Acquire before lifecycle locks so waiting commands revalidate live authorization.
 PERFORM pg_advisory_xact_lock(hashtextextended('couple-profile:'||p_space::text,0));
 actor:=app_internal.lock_active_space_write(p_session_hash,p_space);
 fingerprint:=encode(sha256(convert_to(jsonb_build_array(p_space,p_version,p_title,p_accent)::text,'UTF8')),'hex');
 SELECT * INTO prior FROM app_internal.command_receipts WHERE actor_id=actor AND command_id=p_command;
 IF FOUND THEN
   IF prior.module<>'M10' OR prior.action<>'couple.profile.update' OR prior.request_hash<>fingerprint THEN
     RAISE EXCEPTION 'command conflict' USING ERRCODE='22023';
   END IF;
   RETURN prior.result_ref;
 END IF;
 SELECT version INTO current_version FROM m10.couple_profiles WHERE space_id=p_space FOR UPDATE;
 IF coalesce(current_version,0)<>p_version THEN
   RAISE EXCEPTION 'profile conflict' USING ERRCODE='23505';
 END IF;
 IF current_version IS NULL THEN
   INSERT INTO m10.couple_profiles(space_id,title,accent,updated_by) VALUES(p_space,p_title,p_accent,actor)
     RETURNING version INTO revision;
 ELSE
   UPDATE m10.couple_profiles SET title=p_title,accent=p_accent,updated_by=actor WHERE space_id=p_space
     RETURNING version INTO revision;
 END IF;
 INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref)
   VALUES(actor,p_command,'M10','couple.profile.update',fingerprint,p_space);
 INSERT INTO app_internal.audit_events(event_id,actor_id,command_id,module,action,resource_id)
   VALUES(gen_random_uuid(),actor,p_command,'M10','couple.profile.update',p_space);
 INSERT INTO app_internal.outbox(event_id,actor_id,command_id,source_module,source_id,source_revision,event_type)
   VALUES(gen_random_uuid(),actor,p_command,'M10',p_space,revision,'couple.profile.updated');
 RETURN p_space;
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.read_couple_profile(text,uuid),
 app_internal.read_couple_profile_history(text,uuid,bigint),
 app_internal.update_couple_profile(text,uuid,uuid,bigint,text,text) FROM PUBLIC;
