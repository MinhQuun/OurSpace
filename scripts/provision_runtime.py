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
app_internal.list_sessions(text), app_internal.revoke_other_sessions(text) TO ourspace_runtime;''')
    print('Local runtime login provisioned; explicit session functions only, no table grants.')


if __name__ == '__main__':
    provision()
