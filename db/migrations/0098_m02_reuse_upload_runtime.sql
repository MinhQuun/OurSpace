ALTER TABLE app_internal.pairing_request_policies DROP CONSTRAINT pairing_request_policies_action_check;
ALTER TABLE app_internal.pairing_request_policies ADD CONSTRAINT pairing_request_policies_action_check
CHECK(action IN ('list','create','inspect','accept','reject','revoke','confirm','spaces_list','disconnect','permission_inspect','permission_list','permission_grant','permission_revoke','binary_download','profile_read','profile_update','profile_partner','profile_grants','profile_share','profile_revoke','profile_couple','profile_couple_history','profile_couple_update','profile_preferences','profile_preferences_update','notifications_list','notifications_count','notifications_read','notifications_hide','notifications_read_all','notifications_preferences','notifications_preferences_update','trash_list','trash_restore','trash_purge','trash_purge_expired','export_jobs_create','export_jobs_list','backup_jobs_create','backup_jobs_list','restore_jobs_create','restore_jobs_list','export_account_create','export_account_download','media_share','media_upload_begin','media_upload_status','media_upload_bytes','media_upload_cancel','media_upload_reuse'));

CREATE FUNCTION app_internal.read_media_upload_resolution(p_session_hash text,p_upload uuid)
RETURNS TABLE(id uuid,title text,mime_type text,byte_size bigint,sha256 text,bucket text,
 object_key uuid,media_id uuid,completed_at timestamptz,cancelled_at timestamptz,reused boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT u.id,u.title,u.mime_type,u.byte_size,u.sha256,u.bucket,u.object_key,u.media_id,u.completed_at,u.cancelled_at,u.reused
 FROM m02.upload_items u WHERE u.id=p_upload AND u.owner_id=app_internal.session_actor(p_session_hash);
$fn$;
REVOKE ALL ON FUNCTION app_internal.read_media_upload_resolution(text,uuid) FROM PUBLIC;
