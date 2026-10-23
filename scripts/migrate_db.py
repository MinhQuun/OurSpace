"""Checksum-verified transactional migrations against local development DB."""
import hashlib
import re
from pathlib import Path

from local_db import ROOT, sql


def migration_sql(directory):
    parts = ["BEGIN; SET LOCAL lock_timeout = '15s';",
             'SELECT pg_advisory_xact_lock(60426901);',
             'CREATE SCHEMA IF NOT EXISTS app_migrations;',
             'REVOKE ALL ON SCHEMA app_migrations FROM PUBLIC;',
             '''CREATE TABLE IF NOT EXISTS app_migrations.history (
                 name text PRIMARY KEY, checksum text NOT NULL,
                 applied_at timestamptz NOT NULL DEFAULT clock_timestamp());''']
    files = sorted(Path(directory).glob('*.sql'))
    if not files:
        raise ValueError('No migrations found')
    for path in files:
        if not re.fullmatch(r'\d{4}_[a-z0-9_]+\.sql', path.name):
            raise ValueError('Invalid migration filename')
        body = path.read_text(encoding='utf-8').replace('\r\n', '\n')
        digest = hashlib.sha256(body.encode()).hexdigest()
        delimiter = '$migration_' + digest + '$'
        if delimiter in body:
            raise ValueError('Invalid SQL delimiter')
        parts.append(f'''DO $runner$
BEGIN
  IF EXISTS (SELECT 1 FROM app_migrations.history WHERE name = '{path.name}' AND checksum <> '{digest}') THEN
    RAISE EXCEPTION 'Applied migration checksum changed: {path.name}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM app_migrations.history WHERE name = '{path.name}') THEN
    EXECUTE {delimiter}{body}{delimiter};
    INSERT INTO app_migrations.history(name, checksum) VALUES ('{path.name}', '{digest}');
  END IF;
END;
$runner$;''')
    parts.append('COMMIT;')
    return '\n'.join(parts)


def migrate(directory=ROOT / 'db/migrations', database='ourspace'):
    sql(migration_sql(directory), database)


if __name__ == '__main__':
    migrate()
    print('Local migrations applied and checksums verified.')
