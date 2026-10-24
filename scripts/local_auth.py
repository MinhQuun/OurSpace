"""Provision isolated local Supabase Auth plus an SMTP capture inbox."""
import argparse
import secrets
import subprocess

from local_db import ROOT, sql, start


def compose_auth(*args):
    subprocess.run(['docker', 'compose', '-f', str(ROOT / 'compose.yaml'),
                    '-f', str(ROOT / 'compose.auth.yaml'), *args], cwd=ROOT, check=True)


def local_secret(name):
    path = ROOT / '.local' / name
    path.parent.mkdir(exist_ok=True)
    if not path.exists():
        with path.open('x', encoding='utf-8') as handle:
            handle.write(secrets.token_urlsafe(48))
    value = path.read_text(encoding='utf-8').strip()
    if not value or any(c not in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_' for c in value):
        raise ValueError('Invalid local secret format')
    return value


def provision():
    start()
    password = local_secret('auth-db-password')
    jwt_secret = local_secret('auth-jwt-secret')
    # Generated URL-safe values; never logged or passed as process arguments.
    sql(f"""DO $setup$ BEGIN
IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='ourspace_auth_owner') THEN
  CREATE ROLE ourspace_auth_owner LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
END IF;
IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='postgres') THEN
  -- Upstream GoTrue migrations grant SELECT to this conventional admin role.
  -- Compatibility role only; no login or superuser privileges are needed.
  CREATE ROLE postgres NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
END IF;
END $setup$;
ALTER ROLE ourspace_auth_owner PASSWORD '{password}';
SELECT 'CREATE DATABASE ourspace_auth OWNER ourspace_auth_owner'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname='ourspace_auth')
\\gexec
""")
    sql('CREATE SCHEMA IF NOT EXISTS auth AUTHORIZATION ourspace_auth_owner;', 'ourspace_auth')
    # Keep the existing migration ledger in public first; vendor business tables
    # are schema-qualified in auth. Both schemas are writable only by DB owners.
    sql('ALTER ROLE ourspace_auth_owner IN DATABASE ourspace_auth SET search_path TO public, auth;')
    (ROOT / '.local/auth.env').write_text(
        'GOTRUE_DB_DATABASE_URL=postgres://ourspace_auth_owner:' + password + '@db:5432/ourspace_auth\n'
        + 'GOTRUE_JWT_SECRET=' + jwt_secret + '\n', encoding='utf-8')
    compose_auth('up', '-d', '--wait', 'auth', 'mail')
    sql(f"""INSERT INTO app_internal.auth_verifier(singleton, issuer, signing_key)
VALUES (true, 'http://127.0.0.1:55433', '{jwt_secret}')
ON CONFLICT (singleton) DO UPDATE SET issuer = EXCLUDED.issuer, signing_key = EXCLUDED.signing_key;""")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['start', 'stop', 'status'])
    args = parser.parse_args()
    if args.command == 'start':
        provision()
    elif args.command == 'stop':
        compose_auth('stop', 'auth', 'mail')
    else:
        compose_auth('ps')
