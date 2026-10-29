"""Provision a local server login without granting application data access."""
import re
import secrets

from local_db import ROOT, sql


def provision():
    path = ROOT / '.local/runtime-db-password'
    path.parent.mkdir(exist_ok=True)
    if not path.exists():
        with path.open('x', encoding='utf-8') as handle:
            handle.write(secrets.token_urlsafe(48))
    password = path.read_text(encoding='utf-8').strip()
    if not re.fullmatch(r'[A-Za-z0-9_-]{40,}', password):
        raise ValueError('Invalid local runtime credential format')
    sql("""DO $$ BEGIN
IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ourspace_runtime') THEN
CREATE ROLE ourspace_runtime LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
END IF;
END $$;""")
    # Secret is passed on stdin, never printed or included in process arguments.
    sql(f"ALTER ROLE ourspace_runtime PASSWORD '{password}';")
    sql('GRANT CONNECT ON DATABASE ourspace TO ourspace_runtime;')
    sql('''GRANT USAGE ON SCHEMA app_internal TO ourspace_runtime;
GRANT EXECUTE ON FUNCTION app_internal.session_actor(text),
    app_internal.revoke_session(text, uuid),
    app_internal.issue_verified_session(text,text,uuid,text),
    app_internal.list_sessions(text), app_internal.revoke_other_sessions(text),
    app_internal.authenticate_session(text),
    app_internal.begin_mfa_enrollment(text,text,uuid),
    app_internal.record_mfa_factor(text,text,uuid,bigint,uuid,boolean),
    app_internal.record_mfa_recovery(text,text,uuid,bigint,text,boolean),
    app_internal.bound_mfa_factor(text,uuid),
    app_internal.replace_mfa_recovery_receipt(text,text,uuid,bigint,text),
    app_internal.cancel_pending_mfa(text,text,uuid,bigint),
    app_internal.authorize_mfa_removal(text,text,uuid,bigint,text),
    app_internal.finish_mfa_removal(text,uuid,text),
    app_internal.pending_mfa_removal(text,uuid,text),
    app_internal.consume_password_recovery(text),
    app_internal.invalidate_credential_sessions(text,uuid),
    app_internal.begin_credential_change(text,uuid,text),
    app_internal.finish_credential_change(text,uuid,text),
    app_internal.pending_credential_change(text,uuid,text),
    app_internal.create_pairing_invitation(text,uuid,text),
    app_internal.decide_pairing_invitation(text,uuid,uuid,text,text),
    app_internal.confirm_pairing(text,uuid,uuid,uuid,bigint,boolean),
    app_internal.inspect_pairing_invitation(text,uuid,text),
    app_internal.list_pairing_invitations(text),
    app_internal.consume_pairing_request(text,text),
    app_internal.disconnect_space(text,text,uuid,uuid,bigint,boolean),
    app_internal.list_my_spaces(text),
    app_internal.inspect_resource_access(text,uuid),
    app_internal.list_owned_resource_grants(text,uuid),
    app_internal.resource_sharing_options(text,uuid),
    app_internal.resolve_readable_binary(text,uuid),
    app_internal.read_my_profile(text),
    app_internal.read_personal_preferences(text),
    app_internal.update_personal_preferences(text,uuid,bigint,text,text,text,text,text,text,numeric),
    app_internal.read_couple_profile(text,uuid),
    app_internal.read_couple_profile_history(text,uuid,bigint),
    app_internal.update_couple_profile(text,uuid,uuid,bigint,text,text),
    app_internal.read_partner_profile(text,uuid),
    app_internal.list_my_profile_field_grants(text),
    app_internal.issue_profile_field_grant(text,uuid,uuid,uuid,uuid,text,bigint,boolean),
    app_internal.revoke_profile_field_grant(text,uuid,uuid,uuid,bigint,boolean),
    app_internal.issue_resource_grant(text,uuid,uuid,uuid,uuid,text,bigint,boolean),
    app_internal.revoke_resource_grant(text,uuid,uuid,uuid,bigint,boolean),
    app_internal.current_mfa_enrollment(text),
    app_internal.read_notifications(text,integer,boolean),
    app_internal.unread_notification_count(text),
    app_internal.mark_notification_read(text,uuid),
    app_internal.mark_all_notifications_read(text),
    app_internal.hide_notification(text,uuid),
    app_internal.read_notification_preferences(text),
    app_internal.update_notification_preferences(text,uuid,bigint,boolean,boolean,integer,integer,jsonb),
    app_internal.list_trashed_items(text),
    app_internal.restore_trashed_item(text,uuid,uuid),
    app_internal.purge_trashed_item(text,uuid,uuid),
    app_internal.purge_expired_trashed_items(text) TO ourspace_runtime;''')
    # Support both deployed profile command signatures during the avatar migration.
    # Resolve only this fixed allowlist; never grant all schema functions.
    sql("""DO $$ DECLARE signature text; target regprocedure; BEGIN
      FOREACH signature IN ARRAY ARRAY[
        'app_internal.update_my_profile(text,uuid,bigint,text,text,date,text)',
        'app_internal.update_my_profile(text,uuid,bigint,text,text,date,text,uuid)'
      ] LOOP
        target := to_regprocedure(signature);
        IF target IS NOT NULL THEN
          EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO ourspace_runtime', target);
        END IF;
      END LOOP;
    END $$;""")
    # Local evaluation defaults only; production thresholds require separate review.
    # Independent action windows keep inspection spam from exhausting revocation.
    sql("""INSERT INTO app_internal.pairing_request_policies(action,max_requests,window_seconds)
VALUES ('create',10,60),('inspect',30,60),('list',60,60),
('accept',10,60),('reject',10,60),('revoke',20,60),('confirm',10,60),
('spaces_list',60,60),('disconnect',10,60),('permission_inspect',60,60),
('permission_list',60,60),('permission_grant',20,60),('permission_revoke',20,60),('binary_download',30,60),
('profile_read',60,60),('profile_update',20,60),
('profile_preferences',60,60),('profile_preferences_update',20,60),
('profile_couple',60,60),('profile_couple_history',60,60),('profile_couple_update',20,60),
('profile_partner',60,60),('profile_grants',60,60),('profile_share',20,60),('profile_revoke',20,60),
('notifications_list',60,60),('notifications_count',120,60),('notifications_read',60,60),('notifications_hide',60,60),('notifications_read_all',30,60),('notifications_preferences',60,60),('notifications_preferences_update',20,60),
('trash_list',60,60),('trash_restore',20,60),('trash_purge',20,60),('trash_purge_expired',30,60)
ON CONFLICT(action) DO NOTHING;""")
    print('Local runtime login provisioned; explicit auth functions only, no table grants.')


if __name__ == '__main__':
    provision()
