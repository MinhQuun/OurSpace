-- M10 D30 / BR-M10-73..75. One explicit section for export assembly;
-- not a complete personal export, artifact, or completed job.
CREATE FUNCTION app_internal.export_my_account_section(p_session_hash text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path=pg_catalog,pg_temp AS $fn$
DECLARE actor uuid; profile_data jsonb; preference_data jsonb;
BEGIN
  actor := app_internal.session_actor(p_session_hash);
  IF actor IS NULL THEN RAISE EXCEPTION 'denied' USING ERRCODE='42501'; END IF;
  -- Explicit fields prevent future credential/internal columns entering exports.
  -- Avatar bytes/references belong to the separately authorized M02 adapter.
  SELECT jsonb_build_object('display_name',p.display_name,'nickname',p.nickname,
    'birthday',to_char(p.birthday,'YYYY-MM-DD'),'bio',p.bio,'version',p.version::text)
    INTO profile_data FROM m10.profiles p WHERE p.user_id=actor;
  SELECT jsonb_build_object('theme',p.theme,'language',p.language,'timezone',p.timezone,
    'date_format',p.date_format,'hour_cycle',p.hour_cycle,'reduced_motion',p.reduced_motion,
    'font_scale',p.font_scale::text,'version',p.version::text)
    INTO preference_data FROM m10.personal_preferences p WHERE p.user_id=actor;
  RETURN jsonb_build_object('schema_version',1,'section','m10.account_profile_preferences',
    'account_id',actor,'profile',profile_data,'personal_preferences',preference_data);
END;
$fn$;
REVOKE ALL ON FUNCTION app_internal.export_my_account_section(text) FROM PUBLIC;
