"""Real database tests; creates/drops only a fresh randomly named test database."""
import subprocess
import tempfile
import unittest
import uuid
import base64
import hashlib
import hmac
import json
import secrets
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from local_db import ROOT, sql
from migrate_db import migrate
from seed_local import seed


class MigrationIntegrationTests(unittest.TestCase):
    def test_mfa_transitions_revoke_only_own_sessions_atomically(self):
        migrate(database=self.database)
        seed(self.database)
        sql("UPDATE m10.accounts SET state='active';", self.database)
        account = '10000000-0000-4000-8000-000000000001'
        other = '10000000-0000-4000-8000-000000000002'
        enrollment = str(uuid.uuid4())
        sql(f"INSERT INTO m10.mfa_enrollments(id,account_id) VALUES ('{enrollment}','{account}');", self.database)
        def add_session(owner, digest):
            sql(f"""INSERT INTO m10.sessions(id,account_id,token_hash,expires_at)
VALUES ('{uuid.uuid4()}','{owner}',repeat('{digest}',64),clock_timestamp()+interval '1 hour');""", self.database)
        add_session(account, 'a')
        add_session(account, 'b')
        add_session(other, 'c')
        verify = f"UPDATE m10.mfa_enrollments SET state='verified',provider_factor_id='{uuid.uuid4()}',verified_at=clock_timestamp();"
        with self.assertRaises(subprocess.CalledProcessError):
            sql('BEGIN;' + verify + 'SELECT 1/0; COMMIT;', self.database)
        self.assertEqual(sql('SELECT count(*) FROM m10.session_revocations;', self.database), '0')
        self.assertEqual(sql('SELECT state FROM m10.mfa_enrollments;', self.database), 'pending')
        self.assertEqual(sql("SELECT app_internal.session_actor(repeat('a',64));", self.database), account)
        sql(verify, self.database)
        self.assertEqual(sql("SELECT count(*) FROM m10.session_revocations WHERE reason='mfa_changed';", self.database), '2')
        for digest in ['a', 'b']:
            self.assertEqual(sql(f"SELECT app_internal.session_actor(repeat('{digest}',64)) IS NULL;", self.database), 't')
        self.assertEqual(sql("SELECT app_internal.session_actor(repeat('c',64));", self.database), other)
        add_session(account, 'd')
        sql("UPDATE m10.mfa_enrollments SET recovery_issued_at=clock_timestamp();", self.database)
        self.assertEqual(sql("SELECT app_internal.session_actor(repeat('d',64));", self.database), account)
        sql("UPDATE m10.mfa_enrollments SET recovery_acknowledged_at=clock_timestamp(),enabled_at=clock_timestamp(),state='enabled';", self.database)
        self.assertEqual(sql("SELECT app_internal.session_actor(repeat('d',64)) IS NULL;", self.database), 't')
        add_session(account, 'e')
        sql("UPDATE m10.mfa_enrollments SET state='disabling';", self.database)
        self.assertEqual(sql("SELECT app_internal.session_actor(repeat('e',64)) IS NULL;", self.database), 't')
        add_session(account, 'f')
        sql("UPDATE m10.mfa_enrollments SET state='disabled';", self.database)
        self.assertEqual(sql("SELECT app_internal.session_actor(repeat('f',64)) IS NULL;", self.database), 't')
        self.assertEqual(sql('SELECT count(*) FROM m10.session_revocations;', self.database), '5')
        self.assertEqual(sql("SELECT app_internal.session_actor(repeat('c',64));", self.database), other)

    def test_mfa_activation_requires_verification_and_recovery_acknowledgment(self):
        migrate(database=self.database)
        seed(self.database)
        account = '10000000-0000-4000-8000-000000000001'
        enrollment = str(uuid.uuid4())
        insert = f"INSERT INTO m10.mfa_enrollments(id, account_id) VALUES ('{enrollment}', '{account}');"
        sql(insert, self.database)
        for statement in [
            f"INSERT INTO m10.mfa_enrollments(id,account_id) VALUES ('{uuid.uuid4()}', '{account}');",
            "UPDATE m10.mfa_enrollments SET state='enabled';",
            "UPDATE m10.mfa_enrollments SET state='verified';",
            "UPDATE m10.mfa_enrollments SET recovery_acknowledged_at=clock_timestamp();",
        ]:
            with self.assertRaises(subprocess.CalledProcessError):
                sql(statement, self.database)
        sql(f"UPDATE m10.mfa_enrollments SET provider_factor_id='{uuid.uuid4()}', verified_at=clock_timestamp(), state='verified';", self.database)
        with self.assertRaises(subprocess.CalledProcessError):
            sql("UPDATE m10.mfa_enrollments SET enabled_at=clock_timestamp(),state='enabled';", self.database)
        sql("UPDATE m10.mfa_enrollments SET recovery_issued_at=clock_timestamp();", self.database)
        sql("UPDATE m10.mfa_enrollments SET recovery_acknowledged_at=clock_timestamp(),enabled_at=clock_timestamp(),state='enabled';", self.database)
        self.assertEqual(sql('SELECT state || chr(58) || version FROM m10.mfa_enrollments;', self.database), 'enabled:4')
        for statement in [
            "UPDATE m10.mfa_enrollments SET state='pending';",
            "UPDATE m10.mfa_enrollments SET recovery_acknowledged_at=NULL;",
            "UPDATE m10.mfa_enrollments SET account_id='10000000-0000-4000-8000-000000000002';",
        ]:
            with self.assertRaises(subprocess.CalledProcessError):
                sql(statement, self.database)
        role = 'probe_' + uuid.uuid4().hex
        self.assertEqual(sql(f'''BEGIN; CREATE ROLE {role} NOLOGIN;
GRANT USAGE ON SCHEMA m10 TO {role}; GRANT SELECT ON m10.mfa_enrollments TO {role};
SET LOCAL ROLE {role}; SELECT count(*) FROM m10.mfa_enrollments; ROLLBACK;''', self.database), '0')
        sql("UPDATE m10.mfa_enrollments SET state='disabling';", self.database)
        with self.assertRaises(subprocess.CalledProcessError):
            sql(f"INSERT INTO m10.mfa_enrollments(id,account_id) VALUES ('{uuid.uuid4()}', '{account}');", self.database)
        sql("UPDATE m10.mfa_enrollments SET state='disabled';", self.database)
        with self.assertRaises(subprocess.CalledProcessError):
            sql("UPDATE m10.mfa_enrollments SET state='enabled';", self.database)
        sql(f"INSERT INTO m10.mfa_enrollments(id,account_id) VALUES ('{uuid.uuid4()}', '{account}');", self.database)
        sql("UPDATE m10.mfa_enrollments SET state='cancelling' WHERE state='pending';", self.database)
        sql("UPDATE m10.mfa_enrollments SET state='cancelled' WHERE state='cancelling';", self.database)
        self.assertEqual(sql('SELECT count(*) FROM m10.mfa_enrollments;', self.database), '2')
        with ThreadPoolExecutor(max_workers=2) as pool:
            attempts = [pool.submit(sql,
                f"INSERT INTO m10.mfa_enrollments(id,account_id) VALUES ('{uuid.uuid4()}', '{account}');",
                self.database) for _ in range(2)]
            outcomes = []
            for attempt in attempts:
                try:
                    attempt.result()
                    outcomes.append(True)
                except subprocess.CalledProcessError:
                    outcomes.append(False)
        self.assertEqual(sorted(outcomes), [False, True])

    def setUp(self):
        self.database = 'ourspace_test_' + uuid.uuid4().hex
        sql(f'CREATE DATABASE {self.database};')

    def tearDown(self):
        sql(f'DROP DATABASE {self.database};')

    def test_repeatable_and_concurrent(self):
        with ThreadPoolExecutor(max_workers=2) as pool:
            results = [pool.submit(migrate, ROOT / 'db/migrations', self.database) for _ in range(2)]
            for result in results:
                result.result()
        migrate(database=self.database)
        self.assertEqual(sql('SELECT count(*) FROM app_migrations.history;', self.database), str(len(list((ROOT / 'db/migrations').glob('*.sql')))))
        self.assertEqual(sql("SELECT count(*) FROM pg_namespace WHERE nspname ~ '^m[0-9]{2}$';", self.database), '10')

    def test_changed_migration_rejected(self):
        migrate(database=self.database)
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, '0001_module_schemas.sql').write_text('SELECT 42;', encoding='utf-8')
            with self.assertRaises(subprocess.CalledProcessError):
                migrate(directory, self.database)
        self.assertEqual(sql('SELECT count(*) FROM app_migrations.history;', self.database), str(len(list((ROOT / 'db/migrations').glob('*.sql')))))

    def test_seed_repeatable_preserves_changes_and_pending_verification(self):
        migrate(database=self.database)
        seed(self.database)
        sql("UPDATE m10.profiles SET display_name = 'Edited fixture' WHERE user_id = '10000000-0000-4000-8000-000000000001';", self.database)
        seed(self.database)
        self.assertEqual(sql('SELECT count(*) FROM m10.accounts;', self.database), '2')
        self.assertEqual(sql("SELECT count(*) FROM m10.accounts WHERE state = 'pending_verification';", self.database), '2')
        self.assertEqual(sql("SELECT display_name FROM m10.profiles WHERE user_id = '10000000-0000-4000-8000-000000000001';", self.database), 'Edited fixture')

    def test_unprivileged_actor_cannot_read_seeded_accounts(self):
        migrate(database=self.database)
        seed(self.database)
        role = 'probe_' + uuid.uuid4().hex
        result = sql(f'''BEGIN;
CREATE ROLE {role} NOLOGIN;
GRANT USAGE ON SCHEMA m10 TO {role};
GRANT SELECT ON m10.accounts, m10.profiles TO {role};
SET LOCAL ROLE {role};
SELECT count(*) FROM m10.accounts;
SELECT count(*) FROM m10.profiles;
ROLLBACK;''', self.database)
        self.assertEqual(result.splitlines(), ['0', '0'])

    def test_profile_requires_name_and_account_deletion_does_not_cascade(self):
        migrate(database=self.database)
        seed(self.database)
        for statement in ["UPDATE m10.profiles SET display_name = ' ';", 'DELETE FROM m10.accounts;']:
            with self.assertRaises(subprocess.CalledProcessError):
                sql(statement, self.database)
        self.assertEqual(sql('SELECT count(*) FROM m10.profiles;', self.database), '2')

    def command_and_event(self):
        return """
INSERT INTO app_internal.command_receipts(actor_id, command_id, module, action, request_hash)
VALUES ('10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'M10', 'profile.updated', repeat('a',64));
INSERT INTO app_internal.outbox(event_id, actor_id, command_id, source_module, source_id, source_revision, event_type)
VALUES ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'M10', '10000000-0000-4000-8000-000000000001', 1, 'profile.updated');
INSERT INTO app_internal.audit_events(event_id, actor_id, command_id, module, action, resource_id)
VALUES ('40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'M10', 'profile.updated', '10000000-0000-4000-8000-000000000001');
"""

    def test_domain_write_receipt_outbox_audit_rollback_together(self):
        migrate(database=self.database)
        seed(self.database)
        with self.assertRaises(subprocess.CalledProcessError):
            sql("BEGIN; UPDATE m10.profiles SET display_name='Must roll back';" + self.command_and_event() + 'SELECT 1/0; COMMIT;', self.database)
        for table in ['command_receipts', 'outbox', 'audit_events']:
            self.assertEqual(sql(f'SELECT count(*) FROM app_internal.{table};', self.database), '0')
        self.assertEqual(sql("SELECT count(*) FROM m10.profiles WHERE display_name='Must roll back';", self.database), '0')

    def test_duplicate_command_cannot_create_second_event(self):
        migrate(database=self.database)
        seed(self.database)
        sql('BEGIN;' + self.command_and_event() + 'COMMIT;', self.database)
        with self.assertRaises(subprocess.CalledProcessError):
            sql('BEGIN;' + self.command_and_event() + 'COMMIT;', self.database)
        for table in ['command_receipts', 'outbox', 'audit_events']:
            self.assertEqual(sql(f'SELECT count(*) FROM app_internal.{table};', self.database), '1')

    def test_failure_rolls_back_schema_and_history(self):
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, '0001_failure.sql').write_text('CREATE SCHEMA rollback_probe; SELECT 1/0;', encoding='utf-8')
            with self.assertRaises(subprocess.CalledProcessError):
                migrate(directory, self.database)
        self.assertEqual(sql("SELECT count(*) FROM pg_namespace WHERE nspname IN ('rollback_probe', 'app_migrations');", self.database), '0')

    def test_session_authentication_and_revocation_boundaries(self):
        migrate(database=self.database)
        seed(self.database)
        sql('''UPDATE m10.accounts SET state = 'active';
INSERT INTO m10.sessions(id, account_id, token_hash, created_at, expires_at) VALUES
('50000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',repeat('a',64),now()-interval '1 minute',now()+interval '1 hour'),
('50000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002',repeat('b',64),now()-interval '1 minute',now()+interval '1 hour'),
('50000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000001',repeat('c',64),now()-interval '2 hours',now()-interval '1 hour');''', self.database)
        role = 'probe_' + uuid.uuid4().hex
        with self.assertRaises(subprocess.CalledProcessError):
            sql(f'''BEGIN; CREATE ROLE {role} NOLOGIN;
GRANT USAGE ON SCHEMA app_internal TO {role}; SET LOCAL ROLE {role};
SELECT app_internal.session_actor(repeat('a',64)); COMMIT;''', self.database)
        result = sql(f'''BEGIN; CREATE ROLE {role} NOLOGIN;
GRANT USAGE ON SCHEMA app_internal TO {role};
GRANT EXECUTE ON FUNCTION app_internal.session_actor(text), app_internal.revoke_session(text,uuid) TO {role};
SET LOCAL ROLE {role};
SELECT app_internal.session_actor(repeat('a',64));
SELECT app_internal.session_actor(repeat('c',64)) IS NULL;
SELECT app_internal.session_actor('invalid') IS NULL;
SELECT app_internal.revoke_session(repeat('a',64),'50000000-0000-4000-8000-000000000002');
SELECT app_internal.revoke_session(repeat('a',64),'50000000-0000-4000-8000-000000000001');
SELECT app_internal.session_actor(repeat('a',64)) IS NULL;
SELECT app_internal.session_actor(repeat('b',64));
SELECT app_internal.revoke_session(repeat('a',64),'50000000-0000-4000-8000-000000000001');
RESET ROLE;
SELECT count(*) FROM m10.session_revocations;
ROLLBACK;''', self.database)
        self.assertEqual(result.splitlines(), [
            '10000000-0000-4000-8000-000000000001', 't', 't', 'f', 't', 't',
            '10000000-0000-4000-8000-000000000002', 'f', '1'])
        self.assertEqual(sql('SELECT count(*) FROM m10.session_revocations;', self.database), '0')
        for state in ['pending_verification', 'deactivated', 'deletion_requested', 'deletion_processing', 'deleted']:
            self.assertEqual(sql(f"BEGIN; UPDATE m10.accounts SET state = '{state}'; SELECT app_internal.session_actor(repeat('a',64)) IS NULL; ROLLBACK;", self.database), 't')
        sql("UPDATE m10.accounts SET state = 'active';", self.database)
        revoke = "SELECT app_internal.revoke_session(repeat('a',64),'50000000-0000-4000-8000-000000000001');"
        with ThreadPoolExecutor(max_workers=2) as pool:
            attempts = [pool.submit(sql, revoke, self.database) for _ in range(2)]
            self.assertEqual(sorted(attempt.result() for attempt in attempts), ['f', 't'])
        # Fresh database connections observe committed revocation immediately.
        self.assertEqual(sql("SELECT app_internal.session_actor(repeat('a',64)) IS NULL;", self.database), 't')
        self.assertEqual(sql('SELECT count(*) FROM m10.session_revocations;', self.database), '1')

    def test_issuance_requires_signed_identity_and_preserves_account_state(self):
        migrate(database=self.database)
        key = secrets.token_urlsafe(48)
        sql(f"INSERT INTO app_internal.auth_verifier VALUES (true, 'https://auth.ourspace.test', '{key}');", self.database)
        account = str(uuid.uuid4())
        claims = dict(iss='https://auth.ourspace.test', aud='authenticated', role='authenticated',
                      sub=account, email='synthetic@ourspace.test', is_anonymous=False,
                      iat=int(time.time())-5, exp=int(time.time())+300)

        def token(payload, signing_key=key, algorithm='HS256'):
            def encode(value):
                return base64.urlsafe_b64encode(json.dumps(value).encode()).decode().rstrip('=')
            body = encode({'alg': algorithm, 'typ': 'JWT'}) + '.' + encode(payload)
            signature = base64.urlsafe_b64encode(hmac.new(signing_key.encode(), body.encode(), hashlib.sha256).digest()).decode().rstrip('=')
            return body + '.' + signature

        def issue(jwt, name='Synthetic user'):
            return sql(f"SELECT app_internal.issue_verified_session('{jwt}','{name}','{uuid.uuid4()}','{secrets.token_hex(32)}');", self.database)

        for invalid in [token(claims, secrets.token_urlsafe(48)), token(claims, algorithm='none'),
                        token({**claims, 'exp': 1}), token({**claims, 'iss': 'https://wrong.test'}),
                        token({**claims, 'role': 'service_role'}), token({**claims, 'is_anonymous': True}),
                        token({**claims, 'sub': str(uuid.uuid4())}, secrets.token_urlsafe(48))]:
            with self.assertRaises(subprocess.CalledProcessError):
                issue(invalid)
        self.assertEqual(sql('SELECT count(*) FROM m10.accounts;', self.database), '0')
        with self.assertRaises(subprocess.CalledProcessError):
            issue(token(claims), ' ')
        self.assertEqual(sql('SELECT count(*) FROM m10.accounts;', self.database), '0')
        issue(token(claims))
        self.assertEqual(sql('SELECT account_id FROM m10.sessions;', self.database), account)
        enrollment = str(uuid.uuid4())
        sql(f"INSERT INTO m10.mfa_enrollments(id,account_id) VALUES ('{enrollment}','{account}');", self.database)
        issue(token(claims))  # Unverified setup does not enable MFA.
        verify = f"UPDATE m10.mfa_enrollments SET provider_factor_id='{uuid.uuid4()}',verified_at=clock_timestamp(),state='verified';"
        # Both requests start independently. Either issuance wins and its session
        # is revoked by verification, or verification wins and issuance denies.
        with ThreadPoolExecutor(max_workers=2) as pool:
            changing = pool.submit(sql, verify, self.database)
            logging_in = pool.submit(issue, token(claims))
            changing.result()
            try:
                logging_in.result()
            except subprocess.CalledProcessError:
                pass
        self.assertEqual(sql('SELECT count(*) FROM m10.sessions WHERE revoked_at IS NULL;', self.database), '0')
        for assurance in [None, 'aal1', 'aal3', 'AAL2']:
            with self.assertRaises(subprocess.CalledProcessError):
                issue(token({**claims, 'aal': assurance}))
        issue(token({**claims, 'aal': 'aal2'}))
        sql("UPDATE m10.mfa_enrollments SET state='cancelling';", self.database)
        with self.assertRaises(subprocess.CalledProcessError):
            issue(token(claims))
        sql("UPDATE m10.mfa_enrollments SET state='cancelled';", self.database)
        issue(token(claims))
        self.assertEqual(sql('SELECT security_version FROM m10.accounts;', self.database), '4')
        sql("UPDATE m10.accounts SET state='deactivated';", self.database)
        with self.assertRaises(subprocess.CalledProcessError):
            issue(token(claims))
        self.assertEqual(sql('SELECT state FROM m10.accounts;', self.database), 'deactivated')

    def test_account_reactivation_cannot_resurrect_sessions(self):
        migrate(database=self.database)
        seed(self.database)
        sql('''UPDATE m10.accounts SET state='active';
INSERT INTO m10.sessions(id, account_id, token_hash, created_at, last_seen, expires_at)
VALUES ('50000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001',
repeat('a',64), now()-interval '1 hour', now()-interval '1 hour', now()+interval '1 hour');''', self.database)
        self.assertEqual(sql("SELECT app_internal.authenticate_session(repeat('a',64));", self.database), '10000000-0000-4000-8000-000000000001')
        self.assertEqual(sql('SELECT last_seen > created_at FROM m10.sessions;', self.database), 't')
        sql("UPDATE m10.accounts SET state='deactivated'; UPDATE m10.accounts SET state='active';", self.database)
        self.assertEqual(sql("SELECT app_internal.authenticate_session(repeat('a',64)) IS NULL;", self.database), 't')
        self.assertEqual(sql("SELECT count(*) FROM m10.session_revocations WHERE reason='account_inactive';", self.database), '1')
        sql("UPDATE m10.accounts SET state='deletion_requested';", self.database)
        self.assertEqual(sql('SELECT count(*) FROM m10.session_revocations;', self.database), '1')

    def test_session_constraints_and_private_storage(self):
        migrate(database=self.database)
        seed(self.database)
        insert = """INSERT INTO m10.sessions(id, account_id, token_hash, created_at, expires_at)
VALUES ('50000000-0000-4000-8000-000000000001',
'10000000-0000-4000-8000-000000000001', repeat('a',64),
'2026-01-01T00:00:00Z', '2026-01-02T00:00:00Z');"""
        sql(insert, self.database)
        for statement in [
            "UPDATE m10.sessions SET token_hash = 'raw-bearer-token';",
            "UPDATE m10.sessions SET expires_at = created_at;",
            "UPDATE m10.sessions SET revoked_at = created_at - interval '1 second';",
            insert.replace('50000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000002'),
        ]:
            with self.assertRaises(subprocess.CalledProcessError):
                sql(statement, self.database)
        role = 'probe_' + uuid.uuid4().hex
        result = sql(f'''BEGIN;
CREATE ROLE {role} NOLOGIN;
GRANT USAGE ON SCHEMA m10 TO {role};
GRANT SELECT ON m10.sessions TO {role};
SET LOCAL ROLE {role};
SELECT count(*) FROM m10.sessions;
ROLLBACK;''', self.database)
        self.assertEqual(result, '0')
        sql("UPDATE m10.sessions SET revoked_at = '2026-01-01T12:00:00Z';", self.database)
        self.assertEqual(sql('SELECT count(*) FROM m10.sessions WHERE revoked_at IS NOT NULL;', self.database), '1')


if __name__ == '__main__':
    unittest.main(verbosity=2)
