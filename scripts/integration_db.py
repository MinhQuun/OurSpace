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
    def test_final_pairing_confirmation_runtime_concurrency_and_rollback(self):
        migrate(database=self.database)
        seed(self.database)
        a = '10000000-0000-4000-8000-000000000001'
        b = '10000000-0000-4000-8000-000000000002'
        c = str(uuid.uuid4())
        role = 'confirm_test_' + uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.confirm_pairing(text,uuid,uuid,uuid,bigint,boolean) TO {role}; INSERT INTO m10.accounts(id) VALUES ('{c}'); UPDATE m10.accounts SET state='active';",self.database)
        try:
            for account,token in [(a,'a'),(b,'b'),(c,'c')]:
                sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{account}',repeat('{token}',64),now()+interval '1 hour');",self.database)
            def invite(creator):
                key=str(uuid.uuid4())
                sql(f"INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{key}','{creator}','{secrets.token_hex(32)}'); UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{key}';",self.database)
                return key
            first,second=invite(a),invite(c)
            def command(key=first,actor='a',recipient=b,version=2,confirmed='true',receipt=None,suffix=''):
                return f"BEGIN; SET LOCAL ROLE {role}; SELECT app_internal.confirm_pairing(repeat('{actor}',64),'{receipt or uuid.uuid4()}','{key}','{recipient}',{version},{confirmed}); {suffix} COMMIT;"
            def denied(statement):
                with self.assertRaises(subprocess.CalledProcessError): sql(statement,self.database)
            for statement in [command(actor='b'),command(recipient=c),command(version=1),command(confirmed='false'),command(suffix='SELECT 1/0;')]:
                denied(statement)
            self.assertEqual(sql('SELECT count(*) FROM m10.couple_spaces;',self.database),'0')
            self.assertEqual(sql('SELECT count(*) FROM app_internal.audit_events;',self.database),'0')
            self.assertEqual(sql(f"SELECT state FROM m10.pairing_invitations WHERE id='{first}';",self.database),'awaiting_confirmation')
            receipt1,receipt2=str(uuid.uuid4()),str(uuid.uuid4())
            statements=[command(receipt=receipt1),command(key=second,actor='c',receipt=receipt2)]
            def attempt(statement):
                try: return sql(statement,self.database)
                except subprocess.CalledProcessError: return 'denied'
            with ThreadPoolExecutor(max_workers=2) as pool:
                outcomes=list(pool.map(attempt,statements))
            self.assertEqual(outcomes.count('denied'),1)
            winner=0 if outcomes[0]!='denied' else 1
            self.assertEqual(sql(statements[winner],self.database),outcomes[winner])
            self.assertEqual(sql('SELECT count(*) FROM m10.couple_spaces;',self.database),'1')
            self.assertEqual(sql('SELECT count(*) FROM m10.couple_memberships;',self.database),'2')
            for table in ['command_receipts','audit_events','outbox']:
                self.assertEqual(sql(f'SELECT count(*) FROM app_internal.{table};',self.database),'1')
            denied(f'BEGIN; SET LOCAL ROLE {role}; SELECT * FROM m10.couple_memberships; COMMIT;')
            self.assertEqual(sql("SELECT count(*) FROM m10.pairing_invitations WHERE state='awaiting_confirmation';",self.database),'1')
        finally:
            sql(f'DROP OWNED BY {role}; DROP ROLE {role};',self.database)

    def test_invitation_decisions_authorization_race_and_replay(self):
        migrate(database=self.database)
        seed(self.database)
        a = '10000000-0000-4000-8000-000000000001'
        b = '10000000-0000-4000-8000-000000000002'
        c = str(uuid.uuid4())
        role = 'decision_test_' + uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.decide_pairing_invitation(text,uuid,uuid,text,text) TO {role}; INSERT INTO m10.accounts(id) VALUES ('{c}'); UPDATE m10.accounts SET state='active';",self.database)
        try:
            for account,token in [(a,'a'),(b,'b'),(c,'c')]:
                sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{account}',repeat('{token}',64),now()+interval '1 hour');",self.database)
            def invite(expired=False):
                key=str(uuid.uuid4())
                dates=",created_at,expires_at" if expired else ''
                values=",now()-interval '3 days',now()-interval '1 day'" if expired else ''
                sql(f"INSERT INTO m10.pairing_invitations(id,creator_id,token_hash{dates}) VALUES ('{key}','{a}','{hashlib.sha256(key.encode()).hexdigest()}'{values});",self.database)
                return key
            def command(key,actor,action,receipt=None,wrong=False):
                digest='0'*64 if wrong else hashlib.sha256(key.encode()).hexdigest()
                return f"BEGIN; SET LOCAL ROLE {role}; SELECT state FROM app_internal.decide_pairing_invitation(repeat('{actor}',64),'{receipt or uuid.uuid4()}','{key}','{action}','{digest}'); COMMIT;"
            def denied(statement):
                with self.assertRaises(subprocess.CalledProcessError): sql(statement,self.database)
            key=invite()
            denied(command(key,'a','accept'))
            denied(command(key,'b','revoke'))
            denied(command(key,'b','accept',wrong=True))
            receipt=str(uuid.uuid4())
            self.assertEqual(sql(command(key,'b','accept',receipt),self.database),'awaiting_confirmation')
            self.assertEqual(sql(command(key,'b','accept',receipt),self.database),'awaiting_confirmation')
            denied(command(key,'c','accept'))
            denied(command(key,'c','reject'))
            self.assertEqual(sql('SELECT count(*) FROM app_internal.audit_events;',self.database),'1')
            self.assertEqual(sql(command(key,'b','reject'),self.database),'rejected')
            denied(command(key,'b','accept'))
            denied(command(invite(True),'b','accept'))
            key=invite()
            def attempt(statement):
                try: return sql(statement,self.database)
                except subprocess.CalledProcessError: return 'denied'
            with ThreadPoolExecutor(max_workers=2) as pool:
                outcomes=list(pool.map(attempt,[command(key,'b','accept'),command(key,'a','revoke')]))
            self.assertIn('revoked',outcomes)
            self.assertEqual(sql(f"SELECT state FROM m10.pairing_invitations WHERE id='{key}';",self.database),'revoked')
            denied(command(key,'b','accept'))
            self.assertEqual(sql('SELECT count(*) FROM m10.couple_spaces;',self.database),'0')
        finally:
            sql(f'DROP OWNED BY {role}; DROP ROLE {role};',self.database)

    def test_create_invitation_runtime_authorization_idempotency_and_audit(self):
        migrate(database=self.database)
        seed(self.database)
        a = '10000000-0000-4000-8000-000000000001'
        b = '10000000-0000-4000-8000-000000000002'
        role = 'invite_test_' + uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.create_pairing_invitation(text,uuid,text) TO {role};",self.database)
        try:
            sql(f"UPDATE m10.accounts SET state='active' WHERE id='{a}'; INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{a}',repeat('a',64),now()+interval '1 hour'),('{uuid.uuid4()}','{b}',repeat('b',64),now()+interval '1 hour');",self.database)
            invitation = str(uuid.uuid4())
            def command(session='a', key=invitation, digest='c', suffix=''):
                return f"BEGIN; SET LOCAL ROLE {role}; SELECT id FROM app_internal.create_pairing_invitation(repeat('{session}',64),'{key}',repeat('{digest}',64)); {suffix} COMMIT;"
            for token in ['b','d']:
                with self.assertRaises(subprocess.CalledProcessError): sql(command(token),self.database)
            with ThreadPoolExecutor(max_workers=2) as pool:
                for result in pool.map(lambda _: sql(command(),self.database),range(2)):
                    self.assertEqual(result,invitation)
            for table in ['m10.pairing_invitations','app_internal.command_receipts','app_internal.audit_events','app_internal.outbox']:
                self.assertEqual(sql(f'SELECT count(*) FROM {table};',self.database),'1')
                with self.assertRaises(subprocess.CalledProcessError):
                    sql(f'BEGIN; SET LOCAL ROLE {role}; SELECT * FROM {table}; COMMIT;',self.database)
            with self.assertRaises(subprocess.CalledProcessError): sql(command(digest='e'),self.database)
            with self.assertRaises(subprocess.CalledProcessError): sql(command(key=str(uuid.uuid4()),digest='f',suffix='SELECT 1/0;'),self.database)
            self.assertEqual(sql('SELECT count(*) FROM m10.pairing_invitations;',self.database),'1')
            space = str(uuid.uuid4())
            sql(f"""BEGIN;
UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{invitation}';
UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{invitation}';
INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invitation}');
INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
COMMIT;""",self.database)
            with self.assertRaises(subprocess.CalledProcessError): sql(command(key=str(uuid.uuid4()),digest='e'),self.database)
            sql("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE token_hash=repeat('a',64);",self.database)
            with self.assertRaises(subprocess.CalledProcessError): sql(command(),self.database)
            self.assertEqual(sql('SELECT count(*) FROM m10.couple_spaces;',self.database),'1')
        finally:
            sql(f'DROP OWNED BY {role}; DROP ROLE {role};',self.database)

    def test_couple_space_exact_membership_and_competing_activation(self):
        migrate(database=self.database)
        seed(self.database)
        a = '10000000-0000-4000-8000-000000000001'
        b = '10000000-0000-4000-8000-000000000002'
        c = str(uuid.uuid4())
        sql(f"INSERT INTO m10.accounts(id,state) VALUES ('{c}','active');", self.database)
        def invitation(recipient):
            key = str(uuid.uuid4())
            sql(f"""INSERT INTO m10.pairing_invitations(id,creator_id,token_hash)
VALUES ('{key}','{a}','{secrets.token_hex(32)}');
UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{recipient}',accepted_at=clock_timestamp() WHERE id='{key}';
UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{key}';""", self.database)
            return key
        first, second = invitation(b), invitation(c)
        def activation(invite, recipient, incomplete=False):
            space = str(uuid.uuid4())
            statement = f"BEGIN; INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invite}'); INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1)"
            if not incomplete:
                statement += f",('{space}','{recipient}',2)"
            return statement + '; COMMIT;'
        for statement in [activation(first,b,True), activation(first,c)]:
            with self.assertRaises(subprocess.CalledProcessError):
                sql(statement, self.database)
        self.assertEqual(sql('SELECT count(*) FROM m10.couple_spaces;', self.database), '0')
        def attempt(statement):
            try:
                sql(statement,self.database)
                return True
            except subprocess.CalledProcessError:
                return False
        with ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(attempt,[activation(first,b),activation(second,c)]))
        self.assertEqual(sum(results),1)
        self.assertEqual(sql('SELECT count(*) FROM m10.couple_spaces;', self.database),'1')
        self.assertEqual(sql('SELECT count(*) FROM m10.couple_memberships;', self.database),'2')
        for statement in ["DELETE FROM m10.couple_memberships;", "UPDATE m10.couple_memberships SET slot=3;", "UPDATE m10.couple_memberships SET space_state='frozen';"]:
            with self.assertRaises(subprocess.CalledProcessError):
                sql(statement,self.database)
        sql("UPDATE m10.couple_spaces SET state='disconnecting'; UPDATE m10.couple_spaces SET state='frozen';",self.database)
        self.assertEqual(sql("SELECT count(*) FROM m10.couple_memberships WHERE space_state='frozen';",self.database),'2')
        with self.assertRaises(subprocess.CalledProcessError):
            sql("UPDATE m10.couple_spaces SET state='active';",self.database)

    def test_pairing_invitation_consent_expiry_and_immutability(self):
        migrate(database=self.database)
        seed(self.database)
        a = '10000000-0000-4000-8000-000000000001'
        b = '10000000-0000-4000-8000-000000000002'
        invitation = str(uuid.uuid4())
        sql(f"INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{invitation}','{a}',repeat('a',64));", self.database)
        self.assertEqual(sql("SELECT expires_at-created_at = interval '48 hours' FROM m10.pairing_invitations;", self.database), 't')
        def denied(statement):
            with self.assertRaises(subprocess.CalledProcessError):
                sql(statement, self.database)
        denied("UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp();")
        denied(f"UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{a}',accepted_at=clock_timestamp();")
        denied("UPDATE m10.pairing_invitations SET state='expired',ended_at=clock_timestamp();")
        sql(f"UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp();", self.database)
        self.assertEqual(sql("SELECT state || ':' || version FROM m10.pairing_invitations;", self.database), 'awaiting_confirmation:2')
        denied("UPDATE m10.pairing_invitations SET state='pending',accepted_by=NULL,accepted_at=NULL;")
        sql("UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp();", self.database)
        denied("UPDATE m10.pairing_invitations SET state='pending',confirmed_at=NULL,ended_at=NULL,accepted_by=NULL,accepted_at=NULL;")
        denied(f"DELETE FROM m10.accounts WHERE id='{a}';")
        expired = str(uuid.uuid4())
        sql(f"INSERT INTO m10.pairing_invitations(id,creator_id,token_hash,created_at,expires_at) VALUES ('{expired}','{a}',repeat('b',64),now()-interval '3 days',now()-interval '1 day');", self.database)
        denied(f"UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=created_at+interval '1 hour' WHERE id='{expired}';")
        sql(f"UPDATE m10.pairing_invitations SET state='expired',ended_at=clock_timestamp() WHERE id='{expired}';", self.database)
        self.assertEqual(sql("SELECT relrowsecurity AND relforcerowsecurity FROM pg_class WHERE oid='m10.pairing_invitations'::regclass;", self.database), 't')

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
        for state in ['deactivated', 'deletion_requested', 'deletion_processing', 'deleted']:
            sql(f"UPDATE m10.accounts SET state='{state}';", self.database)
            with self.assertRaises(subprocess.CalledProcessError):
                sql(f"SELECT app_internal.begin_credential_change('{token(claims)}','{uuid.uuid4()}','{secrets.token_hex(32)}');", self.database)
            self.assertEqual(sql('SELECT state FROM m10.accounts;', self.database), state)
        self.assertEqual(sql('SELECT count(*) FROM m10.credential_changes;', self.database), '0')


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
