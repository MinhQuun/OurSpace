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
app_internal.current_mfa_enrollment(text) TO ourspace_runtime;''')
    print('Local runtime login provisioned; explicit auth functions only, no table grants.')


if __name__ == '__main__':
    provision()
