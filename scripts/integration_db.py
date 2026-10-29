"""Real database tests; creates/drops only a fresh randomly named test database."""
import subprocess
import tempfile
import unittest
import uuid
import base64
import hashlib
import hmac
import json
import csv
import io
import secrets
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from local_db import ROOT, sql
from migrate_db import migrate
from seed_local import seed


class MigrationIntegrationTests(unittest.TestCase):
    def test_expired_export_cleanup_boundaries(self):
        migrate(database=self.database)
        seed(self.database)
        actor='10000000-0000-4000-8000-000000000001'
        before=sql('SELECT json_agg(p) FROM m10.profiles p;',self.database)
        sql(f"INSERT INTO m10.account_export_artifacts(account_id,section,payload,created_at,expires_at) SELECT '{actor}','m10.account_profile_preferences',convert_to('expired','UTF8'),now()-interval '2 hours',now()-interval '1 hour' FROM generate_series(1,7); INSERT INTO m10.account_export_artifacts(account_id,section,payload) VALUES ('{actor}','m10.account_profile_preferences',convert_to('live','UTF8'));",self.database)
        sql(f"INSERT INTO app_internal.command_receipts(actor_id,command_id,module,action,request_hash,result_ref) SELECT '{actor}',gen_random_uuid(),'M10','account.export.create',repeat('a',64),id FROM m10.account_export_artifacts WHERE expires_at<now();",self.database)
        history=sql('SELECT json_agg(r ORDER BY result_ref) FROM app_internal.command_receipts r;',self.database)
        role='cleanup_probe_'+uuid.uuid4().hex
        sql(f'CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role};',self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        with self.assertRaises(subprocess.CalledProcessError):
            sql(f'SET ROLE {role}; SELECT app_internal.purge_expired_account_export_artifacts(100);',self.database)
        for invalid in ['NULL','0','1001','-1']:
            with self.assertRaises(subprocess.CalledProcessError):
                sql(f'SELECT app_internal.purge_expired_account_export_artifacts({invalid});',self.database)
        self.assertEqual(sql('BEGIN; SELECT app_internal.purge_expired_account_export_artifacts(2); ROLLBACK;',self.database),'2')
        self.assertEqual(sql('SELECT count(*) FROM m10.account_export_artifacts;',self.database),'8')
        sql(f'GRANT EXECUTE ON FUNCTION app_internal.purge_expired_account_export_artifacts(integer) TO {role};',self.database)
        def purge():
            return int(sql(f'SET ROLE {role}; SELECT app_internal.purge_expired_account_export_artifacts(2);',self.database))
        with ThreadPoolExecutor(max_workers=4) as pool:
            counts=list(pool.map(lambda _: purge(),range(4)))
        self.assertEqual(sum(counts),7)
        self.assertTrue(all(0<=count<=2 for count in counts))
        self.assertEqual(purge(),0)
        self.assertEqual(sql('SELECT json_agg(r ORDER BY result_ref) FROM app_internal.command_receipts r;',self.database),history)
        self.assertEqual(sql("SELECT convert_from(payload,'UTF8') FROM m10.account_export_artifacts;",self.database),'live')
        self.assertEqual(sql('SELECT json_agg(p) FROM m10.profiles p;',self.database),before)

    def test_account_export_artifact_retry_bytes_and_access(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        sql("UPDATE m10.accounts SET state='active';", self.database)
        for actor,token in [(a,'a'),(b,'b')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');", self.database)
        role='artifact_'+uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.create_account_export_artifact(text,uuid),app_internal.read_account_export_artifact(text,uuid) TO {role};", self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        command=str(uuid.uuid4())
        def create(rollback=False):
            return sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT app_internal.create_account_export_artifact(repeat('a',64),'{command}'); {'ROLLBACK' if rollback else 'COMMIT'};",self.database)
        create(rollback=True)
        self.assertEqual(sql("SELECT count(*) FROM m10.account_export_artifacts;",self.database),'0')
        with ThreadPoolExecutor(max_workers=2) as pool:
            identifiers=list(pool.map(lambda _: create(),range(2)))
        self.assertEqual(identifiers[0],identifiers[1])
        artifact=identifiers[0]
        def read(token='a',identifier=artifact):
            return json.loads(sql(f"SET ROLE {role}; SELECT coalesce(json_agg(json_build_object('bytes',encode(payload,'hex'),'sha256',sha256)),'[]') FROM app_internal.read_account_export_artifact(repeat('{token}',64),'{identifier}');",self.database))
        result=read()[0]
        payload=bytes.fromhex(result['bytes'])
        self.assertEqual(hashlib.sha256(payload).hexdigest(),result['sha256'])
        self.assertEqual(json.loads(payload)['account_id'],a)
        self.assertEqual(json.loads(payload)['section'],'m10.account_profile_preferences')
        self.assertEqual(read('b'),[])
        self.assertEqual(read('c'),[])
        self.assertEqual(read(identifier=str(uuid.uuid4())),[])
        for statement in [f"UPDATE m10.account_export_artifacts SET payload=convert_to('changed','UTF8') WHERE id='{artifact}'", f"UPDATE m10.account_export_artifacts SET account_id='{b}' WHERE id='{artifact}'"]:
            with self.assertRaises(subprocess.CalledProcessError): sql(statement,self.database)
        sql(f"UPDATE m10.profiles SET bio='new profile version' WHERE user_id='{a}';",self.database)
        self.assertEqual(create(),artifact)
        self.assertEqual(read()[0],result)
        expired=str(uuid.uuid4())
        sql(f"INSERT INTO m10.account_export_artifacts(id,account_id,section,payload,created_at,expires_at) VALUES ('{expired}','{a}','m10.account_profile_preferences',convert_to('expired','UTF8'),now()-interval '2 hours',now()-interval '1 hour');",self.database)
        self.assertEqual(read(identifier=expired),[])
        with self.assertRaises(subprocess.CalledProcessError):
            sql(f"SET ROLE {role}; SELECT * FROM m10.account_export_artifacts;",self.database)
        for table in ['command_receipts','audit_events','outbox']:
            self.assertEqual(sql(f"SELECT count(*) FROM app_internal.{table};",self.database),'1')
        sql(f"UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id='{a}';",self.database)
        self.assertEqual(read(),[])
        with self.assertRaises(subprocess.CalledProcessError): create()
        self.assertEqual(sql("SELECT count(*) FROM m10.export_jobs;",self.database),'0')

    def test_account_export_section_live_owner_allowlist(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        sql("UPDATE m10.accounts SET state='active';", self.database)
        for actor,token in [(a,'a'),(b,'b')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');", self.database)
        sql(f"UPDATE m10.profiles SET display_name='Synthetic A',nickname='A only',birthday='2000-02-29',bio='Private A' WHERE user_id='{a}'; UPDATE m10.profiles SET bio='Private B sentinel' WHERE user_id='{b}'; INSERT INTO m10.personal_preferences(user_id,theme,font_scale) VALUES ('{a}','dark',1.25);", self.database)
        role='export_section_'+uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role};", self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        def read(token='a'):
            return json.loads(sql(f"SET ROLE {role}; SELECT app_internal.export_my_account_section(repeat('{token}',64));",self.database))
        with self.assertRaises(subprocess.CalledProcessError): read()
        sql(f"GRANT EXECUTE ON FUNCTION app_internal.export_my_account_section(text) TO {role};",self.database)
        section=read()
        self.assertEqual(set(section),{'schema_version','section','account_id','profile','personal_preferences'})
        self.assertEqual(section['account_id'],a)
        self.assertEqual(section['section'],'m10.account_profile_preferences')
        self.assertEqual(section['schema_version'],1)
        self.assertEqual(section['profile'],{'display_name':'Synthetic A','nickname':'A only','birthday':'2000-02-29','bio':'Private A','version':'2'})
        self.assertEqual(set(section['personal_preferences']),{'theme','language','timezone','date_format','hour_cycle','reduced_motion','font_scale','version'})
        self.assertEqual(section['personal_preferences']['font_scale'],'1.25')
        self.assertNotIn('Private B sentinel',json.dumps(section))
        self.assertEqual(read('b')['profile']['bio'],'Private B sentinel')
        self.assertIsNone(read('b')['personal_preferences'])
        with self.assertRaises(subprocess.CalledProcessError):
            sql(f"SET ROLE {role}; SELECT * FROM m10.profiles;",self.database)
        with self.assertRaises(subprocess.CalledProcessError): read('c')
        sql(f"UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id='{a}';",self.database)
        with self.assertRaises(subprocess.CalledProcessError): read()
        sql(f"UPDATE m10.sessions SET expires_at=now()-interval '1 second' WHERE account_id='{b}';",self.database)
        with self.assertRaises(subprocess.CalledProcessError): read('b')
        self.assertEqual(sql("SELECT count(*) FROM m10.export_jobs;",self.database),'0')
        self.assertEqual(sql("SELECT count(*) FROM app_internal.command_receipts;",self.database),'0')

    def test_unimplemented_jobs_cannot_report_completion(self):
        # Apply the historical migrations first to reproduce the false-success rows.
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory)
            for source in sorted((ROOT / 'db' / 'migrations').glob('*.sql')):
                if source.name < '0079':
                    (target / source.name).write_bytes(source.read_bytes())
            migrate(directory=target, database=self.database)
        seed(self.database)
        actor = '10000000-0000-4000-8000-000000000001'
        sql("UPDATE m10.accounts SET state='active';", self.database)
        sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('a',64),now()+interval '1 hour');", self.database)
        export = sql(f"SELECT app_internal.create_export_job(repeat('a',64),'{uuid.uuid4()}','personal');", self.database)
        backup = sql(f"SELECT app_internal.create_backup_job(repeat('a',64),'{uuid.uuid4()}','personal');", self.database)
        restore = sql(f"SELECT app_internal.create_restore_job(repeat('a',64),'{uuid.uuid4()}','full_system','{backup}');", self.database)
        migrate(database=self.database)
        for table, identifier in [('export_jobs',export),('backup_jobs',backup),('restore_jobs',restore)]:
            self.assertEqual(sql(f"SELECT status||':'||(result_ref IS NULL)::text||':'||(completed_at IS NULL)::text FROM m10.{table} WHERE id='{identifier}';", self.database), 'failed:true:true')
        before = sql("SELECT count(*) FROM app_internal.command_receipts;", self.database)
        role = 'jobs_probe_' + uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.create_export_job(text,uuid,text),app_internal.create_backup_job(text,uuid,text),app_internal.create_restore_job(text,uuid,text,uuid) TO {role};", self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        for function in ['create_export_job','create_backup_job','create_restore_job']:
            extra = f",'{backup}'" if function == 'create_restore_job' else ''
            with self.assertRaises(subprocess.CalledProcessError) as failure:
                sql(f"SET ROLE {role}; SELECT app_internal.{function}(repeat('a',64),'{uuid.uuid4()}','personal'{extra});", self.database)
            self.assertIn('not implemented', failure.exception.stderr)
        self.assertEqual(sql("SELECT count(*) FROM app_internal.command_receipts;", self.database), before)


    def test_personal_preference_commands_session_isolation_and_retry(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        sql("UPDATE m10.accounts SET state='active';",self.database)
        for actor,token in [(a,'a'),(b,'b'),(a,'c')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');",self.database)
        role='preference_commands_'+uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.read_personal_preferences(text),app_internal.update_personal_preferences(text,uuid,bigint,text,text,text,text,text,text,numeric) TO {role};",self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        def read(token='a'):
            return json.loads(sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT coalesce(json_agg(p),'[]') FROM app_internal.read_personal_preferences(repeat('{token}',64)) p; COMMIT;",self.database))
        def update(token='a',version=0,theme='dark',command=None,scale='1.5',rollback=False):
            return sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT app_internal.update_personal_preferences(repeat('{token}',64),'{command or uuid.uuid4()}',{version},'{theme}','vi-VN','UTC','yyyy-MM-dd','h12','reduce',{scale}); {'ROLLBACK' if rollback else 'COMMIT'};",self.database)
        initial=read()
        self.assertEqual(initial[0]['version'],0)
        self.assertEqual(read('b'),initial)
        self.assertEqual(read('d'),[])
        update(rollback=True)
        self.assertEqual(read(),initial)
        command=str(uuid.uuid4())
        with ThreadPoolExecutor(max_workers=2) as pool:
            self.assertEqual(list(pool.map(lambda _: update(command=command),range(2))),[a,a])
        self.assertEqual(update(command=command,scale='1.50'),a)
        self.assertEqual(read('c')[0]['version'],1)
        self.assertEqual(read('b'),initial)
        for args in [dict(command=command,theme='light'),dict(version=0),dict(token='d'),dict(version=1,scale='1.555'),dict(version=1,theme='invalid')]:
            with self.assertRaises(subprocess.CalledProcessError): update(**args)
        def compete(token):
            try: update(token=token,version=1); return True
            except subprocess.CalledProcessError: return False
        with ThreadPoolExecutor(max_workers=2) as pool:
            self.assertEqual(sum(pool.map(compete,['a','c'])),1)
        self.assertEqual(read()[0]['version'],2)
        for table in ['command_receipts','audit_events','outbox']:
            self.assertEqual(sql(f'SELECT count(*) FROM app_internal.{table};',self.database),'2')
        update(token='b')
        self.assertEqual(read()[0]['version'],2)
        sql(f"UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id='{a}';",self.database)
        self.assertEqual(read(),[])
        with self.assertRaises(subprocess.CalledProcessError): update(command=command)
        self.assertEqual(read('b')[0]['version'],1)

    def test_personal_preferences_constraints_identity_and_isolation(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        before=sql('SELECT json_agg(p ORDER BY user_id) FROM m10.profiles p;',self.database)
        sql(f"INSERT INTO m10.personal_preferences(user_id,version) VALUES ('{a}',99),('{b}',99);",self.database)
        def read(actor):
            return json.loads(sql(f"SELECT row_to_json(p) FROM m10.personal_preferences p WHERE user_id='{actor}';",self.database))
        initial=read(a)
        self.assertEqual(initial['version'],1)
        self.assertEqual(initial['theme'],'system')
        self.assertEqual(initial['language'],'vi-VN')
        self.assertEqual(initial['timezone'],'Asia/Ho_Chi_Minh')
        other=read(b)
        sql(f"UPDATE m10.personal_preferences SET theme='dark',timezone='America/New_York',date_format='yyyy-MM-dd',hour_cycle='h12',reduced_motion='reduce',font_scale=1.5,version=100 WHERE user_id='{a}';",self.database)
        self.assertEqual(read(a)['version'],2)
        self.assertEqual(read(a)['font_scale'],1.5)
        self.assertEqual(read(b),other)
        for field,value in [('theme',"'invalid'"),('language',"'unknown'"),('timezone',"'EST'"),('timezone',"'Not/AZone'"),('timezone',"'posix/UTC'"),('date_format',"'invalid'"),('hour_cycle',"'h25'"),('reduced_motion',"'force-animation'"),('font_scale','0.9'),('font_scale','2.1'),('user_id',f"'{uuid.uuid4()}'")]:
            with self.assertRaises(subprocess.CalledProcessError):
                sql(f"UPDATE m10.personal_preferences SET {field}={value} WHERE user_id='{a}';",self.database)
        sql(f"BEGIN; UPDATE m10.personal_preferences SET theme='light' WHERE user_id='{a}'; ROLLBACK;",self.database)
        self.assertEqual(read(a)['theme'],'dark')
        self.assertEqual(read(a)['version'],2)
        sql(f"UPDATE m10.personal_preferences SET timezone='UTC',font_scale=2 WHERE user_id='{a}';",self.database)
        self.assertEqual(read(a)['version'],3)
        self.assertEqual(sql('SELECT json_agg(p ORDER BY user_id) FROM m10.profiles p;',self.database),before)
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants;',self.database),'0')
        role='preferences_probe_'+uuid.uuid4().hex
        sql(f'CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA m10 TO {role}; GRANT SELECT ON m10.personal_preferences TO {role};',self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        self.assertEqual(sql(f'BEGIN; SET LOCAL ROLE {role}; SELECT count(*) FROM m10.personal_preferences; COMMIT;',self.database),'0')

    def test_partner_profile_projects_exact_fields_and_live_source_rights(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        invitation,space,grant=[str(uuid.uuid4()) for _ in range(3)]
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants;',self.database),'0')
        sql(f"""BEGIN;
INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{invitation}','{a}',repeat('a',64));
UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{invitation}';
UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{invitation}';
INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invitation}');
INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
COMMIT;""",self.database)
        sql("UPDATE m10.accounts SET state='active';",self.database)
        for actor,token in [(a,'a'),(b,'b')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');",self.database)
        sql(f"UPDATE m10.profiles SET nickname='Synthetic nickname',birthday='2000-02-29',bio='Synthetic private bio' WHERE user_id='{a}';",self.database)
        role='profile_read_probe_'+uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.read_partner_profile(text,uuid),app_internal.list_my_profile_field_grants(text) TO {role};",self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        def read(token='b',target=space):
            return json.loads(sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT app_internal.read_partner_profile(repeat('{token}',64),'{target}'); COMMIT;",self.database))
        def listing(token):
            return json.loads(sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT coalesce(json_agg(g),'[]') FROM app_internal.list_my_profile_field_grants(repeat('{token}',64)) g; COMMIT;",self.database))
        self.assertEqual(read(),{})
        for field in ['nickname','birthday','avatar_ref']:
            sql(f"INSERT INTO m10.profile_field_grants(id,profile_id,field,grantee_id,space_id) VALUES ('{uuid.uuid4()}','{a}','{field}','{b}','{space}');",self.database)
        expected={'nickname':'Synthetic nickname','birthday':'2000-02-29'}
        self.assertEqual(read(),expected)
        self.assertEqual(read('a'),{})
        self.assertEqual(read('c'),{})
        self.assertEqual(read(target=str(uuid.uuid4())),{})
        self.assertEqual(len(listing('a')),3)
        self.assertEqual(listing('b'),[])
        self.assertEqual(listing('c'),[])
        media,source_grant=str(uuid.uuid4()),str(uuid.uuid4())
        sql(f"INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ('{media}','M02','media','{a}'); UPDATE m10.profiles SET avatar_ref='{media}' WHERE user_id='{a}';",self.database)
        self.assertEqual(read(),expected)
        sql(f"INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role) VALUES ('{source_grant}','{media}','{a}','{b}','{space}','viewer');",self.database)
        self.assertEqual(read(),dict(expected,avatar_ref=media))
        sql(f"UPDATE m10.resource_grants SET revoked_at=clock_timestamp() WHERE id='{source_grant}';",self.database)
        self.assertEqual(read(),expected)
        sql("UPDATE m10.profile_field_grants SET revoked_at=clock_timestamp() WHERE field='birthday';",self.database)
        self.assertEqual(read(),{'nickname':'Synthetic nickname'})
        sql(f"UPDATE m10.profiles SET nickname=NULL WHERE user_id='{a}';",self.database)
        self.assertEqual(read(),{'nickname':None})
        sql(f"UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id='{b}';",self.database)
        self.assertEqual(read(),{})
        sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{b}',repeat('d',64),now()+interval '1 hour');",self.database)
        self.assertEqual(read('d'),{'nickname':None})
        sql(f"UPDATE m10.couple_spaces SET state='disconnecting' WHERE id='{space}'; UPDATE m10.couple_spaces SET state='frozen' WHERE id='{space}';",self.database)
        self.assertEqual(read('d'),{})  # No processing window authorizes this fixture.
        visible=json.loads(sql(f"BEGIN; INSERT INTO m10.space_disconnects(space_id,initiated_by) VALUES ('{space}','{a}'); SET LOCAL ROLE {role}; SELECT app_internal.read_partner_profile(repeat('d',64),'{space}'); ROLLBACK;",self.database))
        self.assertEqual(visible,{'nickname':None})
        sql(f"INSERT INTO m10.space_disconnects(space_id,initiated_by,initiated_at) VALUES ('{space}','{a}',clock_timestamp()-interval '31 days');",self.database)
        self.assertEqual(read('d'),{})
        self.assertEqual(len(listing('a')),3)  # Owner can still inspect/revoke history.

    def test_profile_field_revoke_owner_atomicity_and_frozen_space(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        invitation,space,grant=[str(uuid.uuid4()) for _ in range(3)]
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants;',self.database),'0')
        sql(f"""BEGIN;
INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{invitation}','{a}',repeat('a',64));
UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{invitation}';
UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{invitation}';
INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invitation}');
INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
COMMIT;""",self.database)
        sql("UPDATE m10.accounts SET state='active';",self.database)
        for actor,token in [(a,'a'),(b,'b')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');",self.database)
        grants=[str(uuid.uuid4()),str(uuid.uuid4())]
        for i,field in enumerate(['birthday','bio']):
            sql(f"INSERT INTO m10.profile_field_grants(id,profile_id,field,grantee_id,space_id) VALUES ('{grants[i]}','{a}','{field}','{b}','{space}');",self.database)
        role='profile_revoke_probe_'+uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.revoke_profile_field_grant(text,uuid,uuid,uuid,bigint,boolean) TO {role};",self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        command=str(uuid.uuid4())
        def revoke(token='a',cmd=command,profile=a,target=grants[0],version=1,confirmed='true',ending='COMMIT'):
            return sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT app_internal.revoke_profile_field_grant(repeat('{token}',64),'{cmd}','{profile}','{target}',{version},{confirmed}); {ending};",self.database)
        for args in [dict(token='b'),dict(token='c'),dict(profile=b),dict(target=str(uuid.uuid4())),dict(version=2),dict(confirmed='false'),dict(confirmed='NULL')]:
            with self.assertRaises(subprocess.CalledProcessError): revoke(**args)
        revoke(ending='ROLLBACK')
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants WHERE revoked_at IS NULL;',self.database),'2')
        with ThreadPoolExecutor(max_workers=2) as pool:
            self.assertEqual(list(pool.map(lambda _:revoke(),range(2))),[grants[0],grants[0]])
        for table in ['command_receipts','audit_events','outbox']:
            self.assertEqual(sql(f"SELECT count(*) FROM app_internal.{table} WHERE command_id='{command}';",self.database),'1')
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants WHERE revoked_at IS NULL;',self.database),'1')
        with self.assertRaises(subprocess.CalledProcessError): revoke(target=grants[1])
        with self.assertRaises(subprocess.CalledProcessError): revoke(cmd=str(uuid.uuid4()),version=2)
        sql(f"UPDATE m10.couple_spaces SET state='disconnecting' WHERE id='{space}'; UPDATE m10.couple_spaces SET state='frozen' WHERE id='{space}';",self.database)
        second=str(uuid.uuid4())
        self.assertEqual(revoke(cmd=second,target=grants[1],version=2),grants[1])
        self.assertEqual(revoke(),grants[0])
        self.assertEqual(sql(f"SELECT version FROM m10.profiles WHERE user_id='{a}';",self.database),'3')
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants WHERE revoked_at IS NULL;',self.database),'0')
        sql(f"UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id='{a}';",self.database)
        with self.assertRaises(subprocess.CalledProcessError): revoke()

    def test_profile_field_issue_confirmation_concurrency_and_lifecycle(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        invitation,space,grant=[str(uuid.uuid4()) for _ in range(3)]
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants;',self.database),'0')
        sql(f"""BEGIN;
INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{invitation}','{a}',repeat('a',64));
UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{invitation}';
UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{invitation}';
INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invitation}');
INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
COMMIT;""",self.database)
        sql("UPDATE m10.accounts SET state='active';",self.database)
        for actor,token in [(a,'a'),(b,'b')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');",self.database)
        role='profile_issue_probe_'+uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.issue_profile_field_grant(text,uuid,uuid,uuid,uuid,text,bigint,boolean) TO {role};",self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        command=str(uuid.uuid4())
        def issue(token='a',cmd=command,profile=a,recipient=b,field='birthday',version=1,confirmed='true',target_space=space,ending='COMMIT'):
            return sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT app_internal.issue_profile_field_grant(repeat('{token}',64),'{cmd}','{profile}','{target_space}','{recipient}','{field}',{version},{confirmed}); {ending};",self.database)
        for args in [dict(confirmed='false'),dict(confirmed='NULL'),dict(token='c'),dict(token='b'),dict(profile=b),dict(recipient=a),dict(recipient=str(uuid.uuid4())),dict(field='email'),dict(target_space=str(uuid.uuid4())),dict(version=2)]:
            with self.assertRaises(subprocess.CalledProcessError): issue(**args)
        issue(ending='ROLLBACK')
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants;',self.database),'0')
        with ThreadPoolExecutor(max_workers=2) as pool:
            results=list(pool.map(lambda _:issue(),range(2)))
        self.assertEqual(results[0],results[1])
        for table in ['command_receipts','audit_events','outbox']:
            self.assertEqual(sql(f"SELECT count(*) FROM app_internal.{table} WHERE command_id='{command}';",self.database),'1')
        self.assertEqual(sql(f"SELECT version FROM m10.profiles WHERE user_id='{a}';",self.database),'2')
        with self.assertRaises(subprocess.CalledProcessError): issue(field='bio')
        with self.assertRaises(subprocess.CalledProcessError): issue(cmd=str(uuid.uuid4()))
        sql('UPDATE m10.profile_field_grants SET revoked_at=clock_timestamp();',self.database)
        self.assertEqual(issue(),results[0])
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants WHERE revoked_at IS NULL;',self.database),'0')
        new_grant=issue(cmd=str(uuid.uuid4()),version=2)
        self.assertNotEqual(new_grant,results[0])
        sql(f"UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id='{a}';",self.database)
        with self.assertRaises(subprocess.CalledProcessError): issue()
        sql(f"UPDATE m10.couple_spaces SET state='disconnecting' WHERE id='{space}'; UPDATE m10.couple_spaces SET state='frozen' WHERE id='{space}';",self.database)
        with self.assertRaises(subprocess.CalledProcessError): issue(token='b',profile=b,recipient=a,cmd=str(uuid.uuid4()))

    def test_couple_profile_reads_history_and_disconnect_window(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        invitation,space,grant=[str(uuid.uuid4()) for _ in range(3)]
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants;',self.database),'0')
        sql(f"""BEGIN;
INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{invitation}','{a}',repeat('a',64));
UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{invitation}';
UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{invitation}';
INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invitation}');
INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
COMMIT;""",self.database)
        sql("UPDATE m10.accounts SET state='active';",self.database)
        for actor,token in [(a,'a'),(b,'b')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');",self.database)
        outsider=str(uuid.uuid4())
        sql(f"INSERT INTO m10.accounts(id,state) VALUES ('{outsider}','active'); INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{outsider}',repeat('c',64),now()+interval '1 hour');",self.database)
        role='couple_read_probe_'+uuid.uuid4().hex
        sql(f'CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.read_couple_profile(text,uuid),app_internal.read_couple_profile_history(text,uuid,bigint) TO {role};',self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        def read(token='a',history=False,before='NULL',target=space):
            call=f"app_internal.read_couple_profile_history(repeat('{token}',64),'{target}',{before})" if history else f"app_internal.read_couple_profile(repeat('{token}',64),'{target}')"
            return json.loads(sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT coalesce(json_agg(r),'[]') FROM {call} r; COMMIT;",self.database))
        self.assertEqual(read(),[dict(space_id=space,title=None,accent=None,version=0,updated_by=None,updated_at=None)])
        self.assertEqual(read(history=True),[])
        sql(f"INSERT INTO m10.couple_profiles(space_id,title,updated_by) VALUES ('{space}','Synthetic first title','{a}');",self.database)
        sql(f"DO $test$ BEGIN FOR i IN 2..52 LOOP UPDATE m10.couple_profiles SET title='Synthetic title '||i,updated_by='{b}' WHERE space_id='{space}'; END LOOP; END $test$;",self.database)
        self.assertEqual(read(),read('b'))
        self.assertEqual(read()[0]['version'],52)
        self.assertEqual(read()[0]['updated_by'],b)
        page=read(history=True)
        self.assertEqual([r['version'] for r in page],list(range(52,2,-1)))
        older=read('b',history=True,before=page[-1]['version'])
        self.assertEqual([r['version'] for r in older],[2,1])
        self.assertEqual(older[-1]['actor_id'],a)
        self.assertEqual(older[-1]['title'],'Synthetic first title')
        for history in [False,True]:
            self.assertEqual(read('c',history=history),[])  # Valid outsider session.
            self.assertEqual(read('d',history=history),[])
            self.assertEqual(read(history=history,target=str(uuid.uuid4())),[])
        sql(f"UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id='{a}';",self.database)
        self.assertEqual(read(),[])
        self.assertEqual(read(history=True),[])
        sql(f"UPDATE m10.couple_spaces SET state='disconnecting' WHERE id='{space}'; UPDATE m10.couple_spaces SET state='frozen' WHERE id='{space}';",self.database)
        self.assertEqual(read('b'),[])
        visible=json.loads(sql(f"BEGIN; INSERT INTO m10.space_disconnects(space_id,initiated_by) VALUES ('{space}','{b}'); SET LOCAL ROLE {role}; SELECT json_agg(r) FROM app_internal.read_couple_profile_history(repeat('b',64),'{space}',3) r; ROLLBACK;",self.database))
        self.assertEqual([r['version'] for r in visible],[2,1])
        sql(f"INSERT INTO m10.space_disconnects(space_id,initiated_by,initiated_at) VALUES ('{space}','{b}',clock_timestamp()-interval '31 days');",self.database)
        self.assertEqual(read('b'),[])
        self.assertEqual(read('b',history=True),[])

    def test_couple_profile_command_concurrency_and_lifecycle(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        invitation,space,grant=[str(uuid.uuid4()) for _ in range(3)]
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants;',self.database),'0')
        sql(f"""BEGIN;
INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{invitation}','{a}',repeat('a',64));
UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{invitation}';
UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{invitation}';
INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invitation}');
INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
COMMIT;""",self.database)
        sql("UPDATE m10.accounts SET state='active';",self.database)
        for actor,token in [(a,'a'),(b,'b')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');",self.database)
        role='couple_update_probe_'+uuid.uuid4().hex
        sql(f'CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.update_couple_profile(text,uuid,uuid,bigint,text,text) TO {role};',self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        def update(token='a',version=0,title='Synthetic title',accent='#1a2b3c',command=None,target=space,rollback=False):
            accent_sql='NULL' if accent is None else chr(39)+accent+chr(39)
            return sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT app_internal.update_couple_profile(repeat('{token}',64),'{command or uuid.uuid4()}','{target}',{version},{'NULL' if title is None else chr(39)+title+chr(39)},{accent_sql}); {'ROLLBACK' if rollback else 'COMMIT'};",self.database)
        for args in [dict(token='c'),dict(target=str(uuid.uuid4())),dict(version=-1),dict(title=' '),dict(title='x'*121),dict(accent='purple'),dict(accent='#12345')]:
            with self.assertRaises(subprocess.CalledProcessError): update(**args)
        update(rollback=True)
        self.assertEqual(sql('SELECT count(*) FROM m10.couple_profiles;',self.database),'0')
        command=str(uuid.uuid4())
        with ThreadPoolExecutor(max_workers=2) as pool:
            results=list(pool.map(lambda _: update(command=command),range(2)))
        self.assertEqual(results,[space,space])
        with self.assertRaises(subprocess.CalledProcessError): update(command=command,title='Changed replay')
        def competing(token):
            try:
                update(token=token,version=1,title='Edit by '+token)
                return token
            except subprocess.CalledProcessError:
                return None
        with ThreadPoolExecutor(max_workers=2) as pool:
            winners=[x for x in pool.map(competing,['a','b']) if x]
        self.assertEqual(len(winners),1)
        self.assertEqual(sql('SELECT version FROM m10.couple_profiles;',self.database),'2')
        self.assertEqual(sql('SELECT title FROM m10.couple_profiles;',self.database),'Edit by '+winners[0])
        self.assertEqual(sql('SELECT accent FROM m10.couple_profiles;',self.database),'#1a2b3c')
        update(token='b',version=2,title=None)
        self.assertEqual(sql('SELECT updated_by FROM m10.couple_profiles;',self.database),b)
        for table in ['command_receipts','audit_events','outbox']:
            self.assertEqual(sql(f'SELECT count(*) FROM app_internal.{table};',self.database),'3')
        self.assertEqual(sql('SELECT count(*) FROM m10.couple_profile_revisions;',self.database),'3')
        self.assertEqual(update(command=command),space)
        self.assertEqual(sql('SELECT version FROM m10.couple_profiles;',self.database),'3')
        sql(f"UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE account_id='{a}';",self.database)
        with self.assertRaises(subprocess.CalledProcessError): update(command=command)
        sql(f"UPDATE m10.couple_spaces SET state='disconnecting' WHERE id='{space}'; UPDATE m10.couple_spaces SET state='frozen' WHERE id='{space}';",self.database)
        with self.assertRaises(subprocess.CalledProcessError): update(token='b',version=3)
        self.assertEqual(sql('SELECT count(*) FROM m10.couple_profile_revisions;',self.database),'3')

    def test_couple_profile_revision_history_identity_and_privacy(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        invitation,space,grant=[str(uuid.uuid4()) for _ in range(3)]
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants;',self.database),'0')
        sql(f"""BEGIN;
INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{invitation}','{a}',repeat('a',64));
UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{invitation}';
UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{invitation}';
INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invitation}');
INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
COMMIT;""",self.database)
        sql(f"INSERT INTO m10.couple_profiles(space_id,title,updated_by,version) VALUES ('{space}','Synthetic shared title','{a}',99);",self.database)
        self.assertEqual(sql('SELECT version FROM m10.couple_profiles;',self.database),'1')
        self.assertEqual(sql('SELECT count(*) FROM m10.couple_profile_revisions;',self.database),'1')
        sql(f"BEGIN; UPDATE m10.couple_profiles SET title='Rolled back title',updated_by='{b}'; ROLLBACK;",self.database)
        self.assertEqual(sql('SELECT count(*) FROM m10.couple_profile_revisions;',self.database),'1')
        sql(f"UPDATE m10.couple_profiles SET title='Synthetic second title',updated_by='{b}',version=99;",self.database)
        rows=json.loads(sql('SELECT json_agg(r ORDER BY version) FROM (SELECT version,title,actor_id FROM m10.couple_profile_revisions) r;',self.database))
        self.assertEqual(rows,[{'version':1,'title':'Synthetic shared title','actor_id':a},{'version':2,'title':'Synthetic second title','actor_id':b}])
        for statement in ["UPDATE m10.couple_profiles SET title=' '","UPDATE m10.couple_profiles SET title=repeat('x',121)",f"UPDATE m10.couple_profiles SET updated_by='{uuid.uuid4()}'",f"UPDATE m10.couple_profiles SET space_id='{uuid.uuid4()}'",'DELETE FROM m10.couple_profiles',"UPDATE m10.couple_profile_revisions SET title='tampered'",'DELETE FROM m10.couple_profile_revisions']:
            with self.assertRaises(subprocess.CalledProcessError): sql(statement,self.database)
        role='couple_profile_probe_'+uuid.uuid4().hex
        sql(f'CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA m10 TO {role}; GRANT SELECT ON m10.couple_profiles,m10.couple_profile_revisions TO {role};',self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        for table in ['couple_profiles','couple_profile_revisions']:
            self.assertEqual(sql(f'BEGIN; SET LOCAL ROLE {role}; SELECT count(*) FROM m10.{table}; COMMIT;',self.database),'0')
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants;',self.database),'0')
        sql('UPDATE m10.couple_profiles SET title=NULL;',self.database)
        self.assertEqual(sql('SELECT version FROM m10.couple_profiles;',self.database),'3')

    def test_profile_field_grant_binding_and_irreversible_revocation(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        invitation,space,grant=[str(uuid.uuid4()) for _ in range(3)]
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants;',self.database),'0')
        sql(f"""BEGIN;
INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{invitation}','{a}',repeat('a',64));
UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{invitation}';
UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{invitation}';
INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invitation}');
INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
COMMIT;""",self.database)
        def insert(field='birthday',recipient=b,space_id=space,grant_id=None):
            return sql(f"INSERT INTO m10.profile_field_grants(id,profile_id,field,grantee_id,space_id) VALUES ('{grant_id or uuid.uuid4()}','{a}','{field}','{recipient}','{space_id}');",self.database)
        for args in [dict(field='email'),dict(field='*'),dict(recipient=a),dict(recipient=str(uuid.uuid4())),dict(space_id=str(uuid.uuid4()))]:
            with self.assertRaises(subprocess.CalledProcessError): insert(**args)
        insert(grant_id=grant)
        with self.assertRaises(subprocess.CalledProcessError): insert()
        for statement in ["UPDATE m10.profile_field_grants SET field='bio'",f"UPDATE m10.profile_field_grants SET profile_id='{b}'",'DELETE FROM m10.profile_field_grants']:
            with self.assertRaises(subprocess.CalledProcessError): sql(statement,self.database)
        role='profile_grant_probe_'+uuid.uuid4().hex
        sql(f'CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA m10 TO {role}; GRANT SELECT ON m10.profile_field_grants TO {role};',self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        self.assertEqual(sql(f'BEGIN; SET LOCAL ROLE {role}; SELECT count(*) FROM m10.profile_field_grants; COMMIT;',self.database),'0')
        sql('UPDATE m10.profile_field_grants SET revoked_at=clock_timestamp();',self.database)
        for statement in ['UPDATE m10.profile_field_grants SET revoked_at=NULL','UPDATE m10.profile_field_grants SET revoked_at=clock_timestamp()']:
            with self.assertRaises(subprocess.CalledProcessError): sql(statement,self.database)
        insert()  # New explicit grant is a new identity, never resurrection.
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants;',self.database),'2')
        self.assertEqual(sql('SELECT count(*) FROM m10.profile_field_grants WHERE revoked_at IS NULL;',self.database),'1')

    def test_own_profile_private_update_conflict_replay_and_atomicity(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        sql("UPDATE m10.accounts SET state='active';",self.database)
        for actor,token in [(a,'a'),(b,'b')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');",self.database)
        role='profile_probe_'+uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.read_my_profile(text),app_internal.update_my_profile(text,uuid,bigint,text,text,date,text) TO {role};",self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        def read(token):
            return json.loads(sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT coalesce(json_agg(row_to_json(p)),'[]'::json) FROM app_internal.read_my_profile(repeat('{token}',64)) p; COMMIT;",self.database))
        command=str(uuid.uuid4())
        def update(token='a',cmd=command,version=1,name="'Synthetic name'",nickname="'Synthetic nickname'",birthday="'2000-02-29'",bio="'Synthetic private bio'",ending='COMMIT'):
            return sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT app_internal.update_my_profile(repeat('{token}',64),'{cmd}',{version},{name},{nickname},{birthday}::date,{bio}); {ending};",self.database)
        self.assertEqual(read('a')[0]['user_id'],a)
        self.assertEqual(read('b')[0]['user_id'],b)
        self.assertIsNone(read('b')[0]['bio'])
        self.assertEqual(read('c'),[])
        for args in [dict(token='c'),dict(name="''"),dict(name="E'\\t'"),dict(birthday="'infinity'"),dict(birthday="'2001-02-29'"),dict(nickname="repeat('x',121)"),dict(bio="repeat('x',4001)"),dict(version=2)]:
            with self.assertRaises(subprocess.CalledProcessError): update(**args)
        update(ending='ROLLBACK')
        self.assertEqual(read('a')[0]['version'],1)
        self.assertEqual(sql(f"SELECT count(*) FROM app_internal.command_receipts WHERE command_id='{command}';",self.database),'0')
        with ThreadPoolExecutor(max_workers=2) as pool:
            self.assertEqual(list(pool.map(lambda _:update(),range(2))),[a,a])
        self.assertEqual(read('a')[0],{'user_id':a,'display_name':'Synthetic name','nickname':'Synthetic nickname','birthday':'2000-02-29','bio':'Synthetic private bio','avatar_ref':None,'version':2})
        self.assertIsNone(read('b')[0]['bio'])
        for table in ['command_receipts','audit_events','outbox']:
            self.assertEqual(sql(f"SELECT count(*) FROM app_internal.{table} WHERE command_id='{command}';",self.database),'1')
        with self.assertRaises(subprocess.CalledProcessError): update(name="'changed replay'")
        with self.assertRaises(subprocess.CalledProcessError): update(cmd=str(uuid.uuid4()))
        def competing(_):
            try: return update(cmd=str(uuid.uuid4()),version=2,name="'Next name'",nickname='NULL',birthday='NULL',bio='NULL')
            except subprocess.CalledProcessError: return 'conflict'
        with ThreadPoolExecutor(max_workers=2) as pool:
            self.assertCountEqual(list(pool.map(competing,range(2))),[a,'conflict'])
        self.assertEqual(read('a')[0]['version'],3)
        self.assertIsNone(read('a')[0]['bio'])
        self.assertEqual(update(),a)  # Replay old receipt never overwrites later profile.
        self.assertEqual(read('a')[0]['display_name'],'Next name')
        with self.assertRaises(subprocess.CalledProcessError):
            sql(f"UPDATE m10.profiles SET user_id='{uuid.uuid4()}' WHERE user_id='{a}';",self.database)
        with self.assertRaises(subprocess.CalledProcessError):
            sql(f'BEGIN; SET LOCAL ROLE {role}; SELECT * FROM m10.profiles; COMMIT;',self.database)
        sql("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE token_hash=repeat('a',64);",self.database)
        self.assertEqual(read('a'),[])
        with self.assertRaises(subprocess.CalledProcessError): update()
        self.assertEqual(read('b')[0]['user_id'],b)

    def test_object_registry_private_default_and_immutable_identity(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        resource=str(uuid.uuid4())
        sql(f"INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ('{resource}','M01','diary','{a}');",self.database)
        self.assertEqual(sql('SELECT count(*) FROM m10.resource_grants;',self.database),'0')
        self.assertEqual(sql('SELECT access_mode FROM m10.resources;',self.database),'standard')
        for statement in [f"UPDATE m10.resources SET owner_id='{b}';", "UPDATE m10.resources SET module='M02';", "UPDATE m10.resources SET kind='media';", f"INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role) VALUES ('{uuid.uuid4()}','{resource}','{b}','{a}','{uuid.uuid4()}','viewer');"]:
            with self.assertRaises(subprocess.CalledProcessError): sql(statement,self.database)
        sql("UPDATE m10.resources SET access_mode='conditional';",self.database)
        self.assertEqual(sql('SELECT version FROM m10.resources;',self.database),'2')
        invitation,space,grant=str(uuid.uuid4()),str(uuid.uuid4()),str(uuid.uuid4())
        sql(f"""BEGIN;
INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{invitation}','{a}',repeat('a',64));
UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{invitation}';
UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{invitation}';
INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invitation}');
INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role) VALUES ('{grant}','{resource}','{a}','{b}','{space}','viewer');
COMMIT;""",self.database)
        for statement in ["UPDATE m10.resource_grants SET role='editor';","DELETE FROM m10.resource_grants;",f"INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role) VALUES ('{uuid.uuid4()}','{resource}','{a}','{b}','{space}','editor');"]:
            with self.assertRaises(subprocess.CalledProcessError): sql(statement,self.database)
        sql('UPDATE m10.resource_grants SET revoked_at=clock_timestamp();',self.database)
        with self.assertRaises(subprocess.CalledProcessError): sql('UPDATE m10.resource_grants SET revoked_at=NULL;',self.database)
        sql(f"INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role) VALUES ('{uuid.uuid4()}','{resource}','{a}','{b}','{space}','editor');",self.database)
        self.assertEqual(sql('SELECT count(*) FROM m10.resource_grants;',self.database),'2')
        child=str(uuid.uuid4())
        sql(f"UPDATE m10.accounts SET state='active'; INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ('{child}','M02','media','{a}');",self.database)
        for actor,token in [(a,'a'),(b,'b')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');",self.database)
        def read(token,key=resource):
            return sql(f"SELECT app_internal.can_read_resource(repeat('{token}',64),'{key}');",self.database)
        inspector_role='inspector_probe_'+uuid.uuid4().hex
        sql(f'CREATE ROLE {inspector_role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {inspector_role}; GRANT EXECUTE ON FUNCTION app_internal.inspect_resource_access(text,uuid) TO {inspector_role};',self.database)
        def inspect(token,key=resource):
            return json.loads(sql(f"BEGIN; SET LOCAL ROLE {inspector_role}; SELECT coalesce(json_agg(row_to_json(x)),'[]'::json) FROM app_internal.inspect_resource_access(repeat('{token}',64),'{key}') x; COMMIT;",self.database))
        self.addCleanup(lambda: sql(f'DROP ROLE {inspector_role};'))
        sql(f'GRANT EXECUTE ON FUNCTION app_internal.resource_sharing_options(text,uuid) TO {inspector_role};',self.database)
        def options(token,key=resource):
            return json.loads(sql(f"BEGIN; SET LOCAL ROLE {inspector_role}; SELECT coalesce(json_agg(row_to_json(x)),'[]'::json) FROM app_internal.resource_sharing_options(repeat('{token}',64),'{key}') x; COMMIT;",self.database))
        self.assertEqual(options('a'),[])
        sql(f'GRANT EXECUTE ON FUNCTION app_internal.list_owned_resource_grants(text,uuid) TO {inspector_role};',self.database)
        def grants(token,key=resource):
            return json.loads(sql(f"BEGIN; SET LOCAL ROLE {inspector_role}; SELECT coalesce(json_agg(row_to_json(x)),'[]'::json) FROM app_internal.list_owned_resource_grants(repeat('{token}',64),'{key}') x; COMMIT;",self.database))
        owned_grants=grants('a')
        self.assertEqual(len(owned_grants),1)  # excludes the previously revoked viewer
        self.assertEqual(owned_grants[0]['role'],'editor')
        self.assertEqual(owned_grants[0]['grantee_id'],b)
        self.assertEqual(owned_grants[0]['space_id'],space)
        self.assertEqual(set(owned_grants[0]),{'grant_id','resource_version','grantee_id','space_id','role','granted_at'})
        self.assertEqual(grants('b'),[])
        self.assertEqual(grants('c'),[])
        self.assertEqual(grants('a',str(uuid.uuid4())),[])
        self.assertEqual(grants('a',child),[])
        self.assertEqual(inspect('a')[0]['read_reason'],'domain_conditions_required')
        self.assertEqual(inspect('a')[0]['base_read_allowed'],False)
        self.assertEqual(inspect('a')[0]['role'],'owner')
        self.assertEqual(inspect('b'),[])
        self.assertEqual(inspect('c'),[])
        self.assertEqual(inspect('b',str(uuid.uuid4())),[])
        self.assertEqual(read('a'),'f')  # conditional blocks even owner until domain rules exist
        self.assertEqual(read('b'),'f')
        sql("UPDATE m10.resources SET access_mode='standard';",self.database)
        self.assertEqual(read('a'),'t')
        self.assertEqual(read('b'),'t')
        self.assertEqual(inspect('b')[0]['role'],'editor')
        self.assertEqual(inspect('b')[0]['base_read_allowed'],True)
        self.assertEqual(set(inspect('b')[0]),{'resource_id','resource_version','role','base_read_allowed','read_reason'})
        self.assertEqual(inspect('b',child),[])
        self.assertEqual(read('b',child),'f')  # another resource never inherits the grant
        binary,preview=str(uuid.uuid4()),str(uuid.uuid4())
        sql(f"INSERT INTO app_internal.binary_objects(id,resource_id,purpose,bucket,byte_size,sha256) VALUES ('{binary}','{child}','original','ourspace-private',3,repeat('a',64)),('{preview}','{child}','preview','ourspace-private',2,repeat('b',64));",self.database)
        sql(f'GRANT EXECUTE ON FUNCTION app_internal.resolve_readable_binary(text,uuid) TO {inspector_role};',self.database)
        def resolve(token,key=binary):
            return json.loads(sql(f"BEGIN; SET LOCAL ROLE {inspector_role}; SELECT coalesce(json_agg(row_to_json(x)),'[]'::json) FROM app_internal.resolve_readable_binary(repeat('{token}',64),'{key}') x; COMMIT;",self.database))
        self.assertEqual(resolve('a')[0]['resource_id'],child)
        self.assertEqual(resolve('a')[0]['purpose'],'original')
        self.assertEqual(resolve('a',preview)[0]['purpose'],'preview')
        self.assertNotEqual(resolve('a')[0]['object_key'],resolve('a',preview)[0]['object_key'])
        self.assertEqual(resolve('b'),[])  # parent Editor never opens private child bytes
        self.assertEqual(resolve('b',preview),[])
        self.assertEqual(resolve('c'),[])
        self.assertEqual(resolve('a',str(uuid.uuid4())),[])
        with self.assertRaises(subprocess.CalledProcessError):
            sql(f"UPDATE app_internal.binary_objects SET resource_id='{resource}' WHERE id='{binary}';",self.database)
        with self.assertRaises(subprocess.CalledProcessError):
            sql(f'BEGIN; SET LOCAL ROLE {inspector_role}; SELECT * FROM app_internal.binary_objects; COMMIT;',self.database)
        # Disposable domain payload POC: real rows and an execute-only reader.
        # This is not a production domain model or a completed export feature.
        payload_role='payload_probe_'+uuid.uuid4().hex
        sql(f"""CREATE SCHEMA payload_poc;
CREATE TABLE payload_poc.documents(resource_id uuid PRIMARY KEY REFERENCES m10.resources(id), body text NOT NULL);
INSERT INTO payload_poc.documents VALUES ('{resource}','shared synthetic journal'),('{child}','private synthetic attachment');
REVOKE ALL ON SCHEMA payload_poc FROM PUBLIC;
REVOKE ALL ON payload_poc.documents FROM PUBLIC;
CREATE FUNCTION payload_poc.read_documents(token text, requested uuid DEFAULT NULL, query text DEFAULT '')
RETURNS TABLE(resource_id uuid, body text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
 SELECT d.resource_id,d.body FROM payload_poc.documents d
 WHERE app_internal.can_read_resource(token,d.resource_id)
 AND (requested IS NULL OR d.resource_id=requested)
 AND position(query in d.body)>0 ORDER BY d.resource_id
$fn$;
REVOKE ALL ON FUNCTION payload_poc.read_documents(text,uuid,text) FROM PUBLIC;
CREATE ROLE {payload_role} NOLOGIN;
GRANT USAGE ON SCHEMA payload_poc TO {payload_role};
GRANT EXECUTE ON FUNCTION payload_poc.read_documents(text,uuid,text) TO {payload_role};""",self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {payload_role};'))
        def payload(token,key=None,query=''):
            requested=f"'{key}'::uuid" if key else 'NULL::uuid'
            # All arguments here are fixed synthetic test values, never user input.
            return json.loads(sql(f"BEGIN; SET LOCAL ROLE {payload_role}; SELECT json_build_object('count',count(*),'rows',coalesce(json_agg(row_to_json(d)),'[]'::json)) FROM payload_poc.read_documents(repeat('{token}',64),{requested},'{query}') d; COMMIT;",self.database))
        self.assertEqual(payload('a')['count'],2)
        self.assertEqual(payload('b'),{'count':1,'rows':[{'resource_id':resource,'body':'shared synthetic journal'}]})
        empty={'count':0,'rows':[]}
        self.assertEqual(payload('b',child),empty)
        self.assertEqual(payload('b',str(uuid.uuid4())),empty)
        self.assertEqual(payload('b',query='private'),empty)
        self.assertEqual(payload('c'),empty)
        self.assertEqual(payload('b',query='journal')['count'],1)
        def aggregate(token):
            return int(sql(f"BEGIN; SET LOCAL ROLE {payload_role}; SELECT coalesce(sum(octet_length(body)),0) FROM payload_poc.read_documents(repeat('{token}',64)); COMMIT;",self.database))
        def export_payload(token, selected):
            # A saved selection is only a list of IDs, never a saved authorization.
            identifiers=','.join(f"'{uuid.UUID(key)}'::uuid" for key in selected)
            output=sql(f"BEGIN; SET LOCAL ROLE {payload_role}; COPY (SELECT resource_id,body FROM payload_poc.read_documents(repeat('{token}',64)) WHERE resource_id=ANY(ARRAY[{identifiers}])) TO STDOUT WITH CSV HEADER; COMMIT;",self.database)
            return list(csv.DictReader(io.StringIO(output)))
        selected=[resource,child]
        self.assertEqual(aggregate('b'),len('shared synthetic journal'))
        self.assertEqual(aggregate('a'),len('shared synthetic journal')+len('private synthetic attachment'))
        self.assertEqual(aggregate('c'),0)
        self.assertEqual(export_payload('b',selected),[{'resource_id':resource,'body':'shared synthetic journal'}])
        self.assertEqual(export_payload('b',[child]),[])
        self.assertEqual(export_payload('c',selected),[])
        edit_role='edit_probe_'+uuid.uuid4().hex
        sql(f"CREATE ROLE {edit_role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {edit_role}; GRANT EXECUTE ON FUNCTION app_internal.lock_shared_resource_edit(text,uuid,uuid) TO {edit_role};",self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {edit_role};'))
        sql(f"""CREATE FUNCTION payload_poc.edit_document(token text, space_id uuid, target uuid, content text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $fn$
BEGIN
 PERFORM app_internal.lock_shared_resource_edit(token,space_id,target);
 UPDATE payload_poc.documents SET body=content WHERE resource_id=target;
END;
$fn$;
REVOKE ALL ON FUNCTION payload_poc.edit_document(text,uuid,uuid,text) FROM PUBLIC;
GRANT USAGE ON SCHEMA payload_poc TO {edit_role};
GRANT EXECUTE ON FUNCTION payload_poc.edit_document(text,uuid,uuid,text) TO {edit_role};""",self.database)
        def write_statement(content):
            return f"SELECT payload_poc.edit_document(repeat('b',64),'{space}','{resource}','{content}');"
        def edit(token,key=resource,space_id=space):
            return sql(f"BEGIN; SET LOCAL ROLE {edit_role}; SELECT app_internal.lock_shared_resource_edit(repeat('{token}',64),'{space_id}','{key}'); COMMIT;",self.database)
        self.assertEqual(edit('a'),a)
        self.assertEqual(edit('b'),b)
        for args in [('b',child,space),('c',resource,space),('b',str(uuid.uuid4()),space),('b',resource,str(uuid.uuid4()))]:
            with self.assertRaises(subprocess.CalledProcessError): edit(*args)
        sql(f"UPDATE m10.resources SET access_mode='conditional' WHERE id='{resource}';",self.database)
        for token in ['a','b']:
            with self.assertRaises(subprocess.CalledProcessError): edit(token)
        sql(f"UPDATE m10.resources SET access_mode='standard' WHERE id='{resource}';",self.database)
        with self.assertRaises(subprocess.CalledProcessError):
            sql(f'BEGIN; SET LOCAL ROLE {payload_role}; SELECT * FROM payload_poc.documents; COMMIT;',self.database)
        sql(f"INSERT INTO m10.resource_links(source_id,target_id,relation) VALUES ('{resource}','{child}','attachment');",self.database)
        link_role='link_probe_'+uuid.uuid4().hex
        sql(f'CREATE ROLE {link_role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {link_role}; GRANT EXECUTE ON FUNCTION app_internal.visible_resource_links(text,uuid) TO {link_role};',self.database)
        try:
            def links(token,source=resource):
                return json.loads(sql(f"BEGIN; SET LOCAL ROLE {link_role}; SELECT coalesce(json_agg(row_to_json(x)),'[]'::json) FROM app_internal.visible_resource_links(repeat('{token}',64),'{source}') x; COMMIT;",self.database))
            self.assertEqual(links('b'),[])
            self.assertEqual(links('b',str(uuid.uuid4())),[])
            self.assertEqual(links('c'),[])
            self.assertEqual(links('a'),[dict(target_id=child,module='M02',kind='media',relation='attachment')])
            sql(f"INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role) VALUES ('{uuid.uuid4()}','{child}','{a}','{b}','{space}','viewer');",self.database)
            self.assertEqual(len(links('b')),1)
            self.assertEqual(resolve('b')[0]['binary_id'],binary)
            self.assertEqual(resolve('b',preview)[0]['binary_id'],preview)
            sql(f"UPDATE m10.resource_grants SET revoked_at=clock_timestamp() WHERE resource_id='{child}';",self.database)
            self.assertEqual(len(links('b')),0)
            self.assertEqual(resolve('b'),[])
            self.assertEqual(resolve('b',preview),[])
            with self.assertRaises(subprocess.CalledProcessError):
                sql(f'BEGIN; SET LOCAL ROLE {link_role}; SELECT * FROM m10.resource_links; COMMIT;',self.database)
            # Removing reference never cascades into either source object.
            sql(f"DELETE FROM m10.resource_links WHERE source_id='{resource}';",self.database)
            self.assertEqual(sql(f"SELECT count(*) FROM m10.resources WHERE id IN ('{resource}','{child}');",self.database),'2')
        finally: sql(f'DROP OWNED BY {link_role}; DROP ROLE {link_role};',self.database)

        self.assertEqual(read('a',child),'t')
        self.assertEqual(payload('b',child),empty)
        self.assertEqual(read('b',str(uuid.uuid4())),'f')
        self.assertEqual(read('c'),'f')
        revoke_role='revoke_probe_'+uuid.uuid4().hex
        live_grant=sql(f"SELECT id FROM m10.resource_grants WHERE resource_id='{resource}' AND revoked_at IS NULL;",self.database)
        revision=int(sql(f"SELECT version FROM m10.resources WHERE id='{resource}';",self.database))
        command=str(uuid.uuid4())
        sql(f'CREATE ROLE {revoke_role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {revoke_role}; GRANT EXECUTE ON FUNCTION app_internal.revoke_resource_grant(text,uuid,uuid,uuid,bigint,boolean) TO {revoke_role};',self.database)
        try:
            def revoke(token='a',version=revision,confirmed='true',ending='COMMIT'):
                return sql(f"BEGIN; SET LOCAL ROLE {revoke_role}; SELECT app_internal.revoke_resource_grant(repeat('{token}',64),'{command}','{resource}','{live_grant}',{version},{confirmed}); {ending};",self.database)
            for token,version,confirmed in [('b',revision,'true'),('c',revision,'true'),('a',revision+1,'true'),('a',revision,'false')]:
                with self.assertRaises(subprocess.CalledProcessError): revoke(token,version,confirmed)
            revoke(ending='ROLLBACK')
            self.assertEqual(read('b'),'t')
            # Hold a real authorized payload write open; observe revoke waiting
            # on this exact PostgreSQL backend before releasing the transaction.
            writer_name='acl_writer_'+uuid.uuid4().hex
            revoker_name='acl_revoker_'+uuid.uuid4().hex
            writer=subprocess.Popen(['docker','compose','-f',str(ROOT/'compose.yaml'),'exec','-T','db','psql','-X','-q','-A','-t','-v','ON_ERROR_STOP=1','-U','ourspace_owner','-d',self.database],cwd=ROOT,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,encoding='utf-8')
            def observed(query):
                deadline=time.monotonic()+15
                while time.monotonic()<deadline:
                    if sql(query,self.database)=='t': return
                    time.sleep(0.05)
                self.fail('Expected PostgreSQL concurrency state was not observed')
            try:
                writer.stdin.write(f"SET application_name='{writer_name}'; BEGIN; SET LOCAL ROLE {edit_role}; {write_statement('committed synthetic edit')}\n")
                writer.stdin.flush()
                observed(f"SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE application_name='{writer_name}' AND state='idle in transaction');")
                # Other connections still see the previously committed payload.
                self.assertEqual(payload('a',resource)['rows'][0]['body'],'shared synthetic journal')
                with ThreadPoolExecutor(max_workers=1) as pool:
                    pending=pool.submit(sql,f"SET application_name='{revoker_name}'; BEGIN; SET LOCAL ROLE {revoke_role}; SELECT app_internal.revoke_resource_grant(repeat('a',64),'{command}','{resource}','{live_grant}',{revision},true); COMMIT;",self.database)
                    try:
                        observed(f"SELECT EXISTS(SELECT 1 FROM pg_stat_activity r JOIN pg_stat_activity w ON w.pid=ANY(pg_blocking_pids(r.pid)) WHERE r.application_name='{revoker_name}' AND w.application_name='{writer_name}');")
                        self.assertFalse(pending.done())
                        output,error=writer.communicate('COMMIT;\n',timeout=15)
                        self.assertEqual(writer.returncode,0,error)
                    finally:
                        if writer.poll() is None: writer.communicate('ROLLBACK;\n',timeout=15)
                    self.assertEqual(pending.result(timeout=15),live_grant)
                self.assertEqual(payload('a',resource)['rows'][0]['body'],'committed synthetic edit')
                with self.assertRaises(subprocess.CalledProcessError):
                    sql(f"BEGIN; SET LOCAL ROLE {edit_role}; {write_statement('denied late edit')} COMMIT;",self.database)
                self.assertEqual(payload('a',resource)['rows'][0]['body'],'committed synthetic edit')
                with ThreadPoolExecutor(max_workers=2) as pool:
                    self.assertEqual(list(pool.map(lambda _: revoke(),range(2))),[live_grant,live_grant])
            finally:
                if writer.poll() is None: writer.communicate('ROLLBACK;\n',timeout=15)
            self.assertEqual(read('b'),'f')
            self.assertEqual(inspect('b'),[])
            self.assertEqual(grants('a'),[])
            self.assertEqual(payload('b'),empty)
            self.assertEqual(payload('b',resource),empty)
            self.assertEqual(payload('b',query='journal'),empty)
            self.assertEqual(aggregate('b'),0)
            self.assertEqual(export_payload('b',selected),[])
            self.assertEqual(len(export_payload('a',selected)),2)
            with self.assertRaises(subprocess.CalledProcessError): edit('b')
            for table in ['command_receipts','audit_events','outbox']:
                self.assertEqual(sql(f"SELECT count(*) FROM app_internal.{table} WHERE command_id='{command}';",self.database),'1')
            with self.assertRaises(subprocess.CalledProcessError): revoke(version=revision+1)
        finally: sql(f'DROP OWNED BY {revoke_role}; DROP ROLE {revoke_role};',self.database)
        sql("UPDATE m10.resource_grants SET revoked_at=clock_timestamp() WHERE revoked_at IS NULL;",self.database)
        self.assertEqual(read('b'),'f')
        issue_role='issue_probe_'+uuid.uuid4().hex
        issue_command=str(uuid.uuid4())
        issue_revision=int(sql(f"SELECT version FROM m10.resources WHERE id='{resource}';",self.database))
        sql(f'CREATE ROLE {issue_role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {issue_role}; GRANT EXECUTE ON FUNCTION app_internal.issue_resource_grant(text,uuid,uuid,uuid,uuid,text,bigint,boolean) TO {issue_role};',self.database)
        try:
            def issue(token='a',recipient=b,role='viewer',version=issue_revision,confirmed='true',ending='COMMIT'):
                return sql(f"BEGIN; SET LOCAL ROLE {issue_role}; SELECT app_internal.issue_resource_grant(repeat('{token}',64),'{issue_command}','{resource}','{space}','{recipient}','{role}',{version},{confirmed}); {ending};",self.database)
            with self.assertRaises(subprocess.CalledProcessError): issue()
            self.assertEqual(options('a'),[])  # no domain policy
            sql("INSERT INTO app_internal.resource_role_policies VALUES ('M01','diary','viewer');",self.database)
            choices=options('a')
            self.assertEqual(len(choices),1)
            self.assertEqual(choices[0]['recipient_id'],b)
            self.assertEqual(choices[0]['space_id'],space)
            self.assertEqual(choices[0]['role'],'viewer')
            self.assertEqual(choices[0]['resource_version'],issue_revision)
            self.assertEqual(set(choices[0]),{'resource_version','space_id','recipient_id','recipient_name','role'})
            for token,key in [('b',resource),('c',resource),('a',str(uuid.uuid4())),('a',child)]:
                self.assertEqual(options(token,key),[])
            self.assertEqual(sql(f"BEGIN; UPDATE m10.resources SET access_mode='conditional' WHERE id='{resource}'; SET LOCAL ROLE {inspector_role}; SELECT count(*) FROM app_internal.resource_sharing_options(repeat('a',64),'{resource}'); ROLLBACK;",self.database),'0')
            self.assertEqual(sql(f"BEGIN; UPDATE m10.accounts SET state='deactivated' WHERE id='{b}'; SET LOCAL ROLE {inspector_role}; SELECT count(*) FROM app_internal.resource_sharing_options(repeat('a',64),'{resource}'); ROLLBACK;",self.database),'0')
            for args in [dict(token='b'),dict(recipient=a),dict(recipient=str(uuid.uuid4())),dict(role='editor'),dict(version=issue_revision+1),dict(confirmed='false')]:
                with self.assertRaises(subprocess.CalledProcessError): issue(**args)
            issue(ending='ROLLBACK')
            self.assertEqual(read('b'),'f')
            with ThreadPoolExecutor(max_workers=2) as pool:
                results=list(pool.map(lambda _:issue(),range(2)))
            self.assertEqual(results[0],results[1])
            self.assertEqual(options('a'),[])  # existing live grant must be managed explicitly
            self.assertEqual(read('b'),'t')
            for table in ['command_receipts','audit_events','outbox']:
                self.assertEqual(sql(f"SELECT count(*) FROM app_internal.{table} WHERE command_id='{issue_command}';",self.database),'1')
        finally: sql(f'DROP OWNED BY {issue_role}; DROP ROLE {issue_role};',self.database)
        with self.assertRaises(subprocess.CalledProcessError): edit('b')  # viewer cannot edit
        sql(f"BEGIN; INSERT INTO m10.space_disconnects(space_id,initiated_by) VALUES ('{space}','{a}'); UPDATE m10.couple_spaces SET state='disconnecting' WHERE id='{space}'; UPDATE m10.couple_spaces SET state='frozen' WHERE id='{space}'; COMMIT;",self.database)
        self.assertEqual(read('b'),'t')  # existing read rights during processing, no write capability
        self.assertEqual(len(grants('a')),1)  # owner can still identify a grant to revoke
        self.assertEqual(grants('b'),[])
        self.assertEqual(options('a'),[])
        for token in ['a','b']:
            with self.assertRaises(subprocess.CalledProcessError): edit(token)
        sql(f"UPDATE m10.couple_spaces SET state='archived' WHERE id='{space}';",self.database)
        self.assertEqual(read('b'),'f')
        self.assertEqual(read('a'),'t')
        sql(f"UPDATE m10.resources SET deleted_at=clock_timestamp() WHERE id='{resource}';",self.database)
        self.assertEqual(read('a'),'f')
        sql("UPDATE m10.sessions SET revoked_at=clock_timestamp() WHERE token_hash=repeat('a',64);",self.database)
        self.assertEqual(read('a',child),'f')
        self.assertEqual(resolve('a'),[])
        role='resource_probe_'+uuid.uuid4().hex
        try:
            sql(f'CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA m10 TO {role}; GRANT SELECT ON m10.resources,m10.resource_grants TO {role};',self.database)
            self.assertEqual(sql(f'BEGIN; SET LOCAL ROLE {role}; SELECT count(*) FROM m10.resources; COMMIT;',self.database),'0')
        finally: sql(f'DROP OWNED BY {role}; DROP ROLE {role};',self.database)

    def test_disconnect_step_up_uses_signed_fresh_password_not_refresh_iat(self):
        migrate(database=self.database)
        seed(self.database)
        account='10000000-0000-4000-8000-000000000001'
        key=secrets.token_urlsafe(48)
        sql(f"INSERT INTO app_internal.auth_verifier VALUES (true,'https://auth.ourspace.test','{key}'); UPDATE m10.accounts SET state='active'; INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{account}',repeat('a',64),now()+interval '1 hour');",self.database)
        now=int(time.time())
        claims=dict(iss='https://auth.ourspace.test',aud='authenticated',role='authenticated',sub=account,email='synthetic@ourspace.test',is_anonymous=False,iat=now-1,exp=now+300,aal='aal1',amr=[dict(method='password',timestamp=now-1)])
        def proof(payload,signing_key=key):
            def encode(value): return base64.urlsafe_b64encode(json.dumps(value).encode()).decode().rstrip('=')
            body=encode(dict(alg='HS256',typ='JWT'))+'.'+encode(payload)
            return body+'.'+base64.urlsafe_b64encode(hmac.new(signing_key.encode(),body.encode(),hashlib.sha256).digest()).decode().rstrip('=')
        session_char="a"
        def check(payload,signing_key=key):
            return sql(f"SELECT app_internal.disconnect_actor(repeat('{session_char}',64),'{proof(payload,signing_key)}');",self.database)
        self.assertEqual(check(claims),account)
        for changed in [dict(amr=[]),dict(amr=None),dict(amr=[dict(method='password',timestamp=now-301)]),dict(amr=[dict(method='password',timestamp=now+300)]),dict(amr=[dict(method='token_refresh',timestamp=now-1)]),dict(sub=str(uuid.uuid4())),dict(exp=now-1)]:
            with self.assertRaises(subprocess.CalledProcessError): check({**claims,**changed})
        with self.assertRaises(subprocess.CalledProcessError): check(claims,secrets.token_urlsafe(48))
        enrollment=str(uuid.uuid4())
        sql(f"INSERT INTO m10.mfa_enrollments(id,account_id) VALUES ('{enrollment}','{account}'); UPDATE m10.mfa_enrollments SET state='verified',provider_factor_id='{uuid.uuid4()}',verified_at=clock_timestamp();",self.database)
        # MFA verification intentionally revokes old sessions; use a new AAL2 session fixture.
        session_char="b"
        sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{account}',repeat('b',64),now()+interval '1 hour');",self.database)
        with self.assertRaises(subprocess.CalledProcessError): check(claims)
        for amr in [claims['amr'],claims['amr']+[dict(method='totp',timestamp=now-301)]]:
            with self.assertRaises(subprocess.CalledProcessError): check({**claims,'aal':'aal2','amr':amr})
        self.assertEqual(check({**claims,'aal':'aal2','amr':claims['amr']+[dict(method='totp',timestamp=now-1)]}),account)
        sql("UPDATE m10.sessions SET revoked_at=now();",self.database)
        with self.assertRaises(subprocess.CalledProcessError): check(claims)

    def test_disconnect_origin_is_member_bound_immutable_and_thirty_days(self):
        migrate(database=self.database)
        seed(self.database)
        a = '10000000-0000-4000-8000-000000000001'
        b = '10000000-0000-4000-8000-000000000002'
        key, space = str(uuid.uuid4()), str(uuid.uuid4())
        sql(f"""BEGIN;
UPDATE m10.accounts SET state='active';
INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{key}','{a}',repeat('a',64));
UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{key}';
UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{key}';
INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{key}');
INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
COMMIT;""",self.database)
        insert=f"INSERT INTO m10.space_disconnects(space_id,initiated_by) VALUES ('{space}','{a}');"
        with self.assertRaises(subprocess.CalledProcessError): sql(insert,self.database)
        self.assertEqual(sql('SELECT count(*) FROM m10.space_disconnects;',self.database),'0')
        with self.assertRaises(subprocess.CalledProcessError):
            sql(f"BEGIN; UPDATE m10.couple_spaces SET state='disconnecting' WHERE id='{space}'; {insert.replace(a,str(uuid.uuid4()))} COMMIT;",self.database)
        self.assertEqual(sql(f"SELECT state FROM m10.couple_spaces WHERE id='{space}';",self.database),'active')
        sql(f"BEGIN; {insert} UPDATE m10.couple_spaces SET state='disconnecting' WHERE id='{space}'; UPDATE m10.couple_spaces SET state='frozen' WHERE id='{space}'; COMMIT;",self.database)
        self.assertEqual(sql("SET timezone='America/New_York'; SELECT extract(epoch FROM processing_until-initiated_at)::bigint FROM m10.space_disconnects;",self.database),str(30*86400))
        self.assertEqual(sql("SELECT count(*) FROM m10.couple_memberships WHERE space_state='frozen';",self.database),'2')
        for statement in [insert,'DELETE FROM m10.space_disconnects;',"UPDATE m10.space_disconnects SET initiated_at=now();",f"UPDATE m10.couple_spaces SET state='active' WHERE id='{space}';"]:
            with self.assertRaises(subprocess.CalledProcessError): sql(statement,self.database)
        role='disconnect_test_'+uuid.uuid4().hex
        try:
            sql(f'CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA m10 TO {role}; GRANT SELECT ON m10.space_disconnects TO {role};',self.database)
            self.assertEqual(sql(f'BEGIN; SET LOCAL ROLE {role}; SELECT count(*) FROM m10.space_disconnects; COMMIT;',self.database),'0')
        finally: sql(f'DROP OWNED BY {role}; DROP ROLE {role};',self.database)

    def test_pairing_request_budget_concurrency_identity_and_expiry(self):
        migrate(database=self.database)
        seed(self.database)
        a = '10000000-0000-4000-8000-000000000001'
        b = '10000000-0000-4000-8000-000000000002'
        role = 'budget_test_' + uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.consume_pairing_request(text,text) TO {role}; UPDATE m10.accounts SET state='active';",self.database)
        try:
            for account,token in [(a,'a'),(a,'b'),(b,'c')]:
                sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{account}',repeat('{token}',64),now()+interval '1 hour');",self.database)
            def consume(token='a',action='inspect'):
                return sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT allowed::text || ':' || retry_after::text FROM app_internal.consume_pairing_request(repeat('{token}',64),'{action}'); COMMIT;",self.database)
            with self.assertRaises(subprocess.CalledProcessError): consume()
            sql("INSERT INTO app_internal.pairing_request_policies VALUES ('inspect',3,60),('revoke',2,60);",self.database)
            with ThreadPoolExecutor(max_workers=8) as pool:
                results=list(pool.map(lambda i: consume('a' if i%2 else 'b'),range(8)))
            self.assertEqual(results.count('true:0'),3)
            self.assertEqual(sum(value.startswith('false:') for value in results),5)
            self.assertTrue(all(1 <= int(v.split(':')[1]) <= 60 for v in results if v.startswith('false:')))
            self.assertEqual(consume('c'),'true:0')
            self.assertEqual(consume('a','revoke'),'true:0')
            self.assertEqual(sql(f"SELECT requests FROM app_internal.pairing_request_budgets WHERE account_id='{a}' AND action='inspect';",self.database),'3')
            sql(f"UPDATE app_internal.pairing_request_budgets SET window_started_at=now()-interval '61 seconds' WHERE account_id='{a}';",self.database)
            self.assertEqual(consume(),'true:0')
            with self.assertRaises(subprocess.CalledProcessError): consume('d')
            with self.assertRaises(subprocess.CalledProcessError):
                sql(f'BEGIN; SET LOCAL ROLE {role}; SELECT * FROM app_internal.pairing_request_budgets; COMMIT;',self.database)
            sql("UPDATE m10.sessions SET revoked_at=now() WHERE token_hash=repeat('a',64);",self.database)
            with self.assertRaises(subprocess.CalledProcessError): consume()
        finally:
            sql(f'DROP OWNED BY {role}; DROP ROLE {role};',self.database)

    def test_pairing_identity_inspection_is_capability_and_participant_scoped(self):
        migrate(database=self.database)
        seed(self.database)
        a = '10000000-0000-4000-8000-000000000001'
        b = '10000000-0000-4000-8000-000000000002'
        c = str(uuid.uuid4())
        key = str(uuid.uuid4())
        role = 'inspect_test_' + uuid.uuid4().hex
        sql(f"CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.inspect_pairing_invitation(text,uuid,text),app_internal.list_pairing_invitations(text) TO {role}; INSERT INTO m10.accounts(id) VALUES ('{c}'); UPDATE m10.accounts SET state='active';",self.database)
        try:
            for account,token in [(a,'a'),(b,'b'),(c,'c')]:
                sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{account}',repeat('{token}',64),now()+interval '1 hour');",self.database)
            sql(f"INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{key}','{a}',repeat('d',64));",self.database)
            def inspect(actor,digest='e',columns='count(*)'):
                return sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT {columns} FROM app_internal.inspect_pairing_invitation(repeat('{actor}',64),'{key}',repeat('{digest}',64)); COMMIT;",self.database)
            def listing(actor):
                return sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT count(*) FROM app_internal.list_pairing_invitations(repeat('{actor}',64)); COMMIT;",self.database)
            self.assertEqual(inspect('a'),'1')
            self.assertEqual(inspect('b'),'0')
            self.assertEqual(inspect('e','d'),'0')
            self.assertEqual(inspect('b','d','creator_id'),a)
            self.assertEqual(inspect('b','d','recipient_id IS NULL'),'t')
            self.assertEqual(listing('b'),'0')
            sql(f"UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{key}';",self.database)
            self.assertEqual(inspect('c','d'),'0')
            self.assertEqual(inspect('b'),'1')
            self.assertEqual(listing('b'),'1')
            fields=json.loads(inspect('a',columns='row_to_json(inspect_pairing_invitation)'))
            self.assertEqual(set(fields),{'id','state','expires_at','version','creator_id','creator_name','recipient_id','recipient_name','space_id'})
            self.assertEqual(fields['recipient_id'],b)
            sql(f"UPDATE m10.accounts SET state='deactivated' WHERE id='{b}';",self.database)
            self.assertEqual(inspect('b'),'0')
            self.assertEqual(inspect('a',columns='recipient_name IS NULL'),'t')
            sql(f"UPDATE m10.pairing_invitations SET state='revoked',ended_at=clock_timestamp() WHERE id='{key}';",self.database)
            self.assertEqual(inspect('c','d'),'0')
            self.assertEqual(inspect('a',columns='state'),'revoked')
        finally:
            sql(f'DROP OWNED BY {role}; DROP ROLE {role};',self.database)

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

    def test_notification_list_and_count_hide_unreadable_sources(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        invitation,space,resource,private,grant=[str(uuid.uuid4()) for _ in range(5)]
        sql(f"""BEGIN;
        INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{invitation}','{a}',repeat('a',64));
        UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{invitation}';
        UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{invitation}';
        INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invitation}');
        INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
        INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ('{resource}','M01','diary','{a}');
        INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ('{private}','M02','media','{a}');
        INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role) VALUES ('{grant}','{resource}','{a}','{b}','{space}','viewer');
        COMMIT;""",self.database)
        sql("UPDATE m10.accounts SET state='active';",self.database)
        for actor,token in [(a,'a'),(b,'b')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');",self.database)
        shared_note,private_note,account_note,unknown_note=[str(uuid.uuid4()) for _ in range(4)]
        sql(f"""BEGIN;
        INSERT INTO m10.notifications(id,recipient_id,space_id,notification_type,source_module,source_id,title_key,body_key,priority)
        VALUES ('{shared_note}','{b}','{space}','shared','M01','{resource}','shared.title','shared.body','normal');
        INSERT INTO m10.notifications(id,recipient_id,space_id,notification_type,source_module,source_id,title_key,body_key,priority)
        VALUES ('{private_note}','{b}','{space}','private','M02','{private}','private.title','private.body','normal');
        INSERT INTO m10.notifications(id,recipient_id,space_id,notification_type,source_module,source_id,title_key,body_key,priority)
        VALUES ('{account_note}','{b}',NULL,'account',NULL,NULL,'account.title','account.body','normal');
        INSERT INTO m10.notifications(id,recipient_id,notification_type,source_module,source_id,title_key,body_key,priority)
        VALUES ('{unknown_note}','{b}','unknown','M99','{uuid.uuid4()}','unknown.title','unknown.body','normal');
        COMMIT;""",self.database)
        role='notification_probe_'+uuid.uuid4().hex
        sql(f'CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.read_notifications(text,integer,boolean),app_internal.unread_notification_count(text) TO {role};',self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        def list_notifications(token='b',limit=50,include_read='true'):
            return json.loads(sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT coalesce(json_agg(row_to_json(n)),'[]'::json) FROM app_internal.read_notifications(repeat('{token}',64),{limit},{include_read}) n; COMMIT;",self.database))
        def count_unread(token='b'):
            return int(sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT app_internal.unread_notification_count(repeat('{token}',64)); COMMIT;",self.database))
        visible=list_notifications()
        self.assertEqual(len(visible),2)
        self.assertEqual({n['id'] for n in visible},{shared_note,account_note})
        self.assertEqual(count_unread(),2)
        sql(f"UPDATE m10.resource_grants SET revoked_at=clock_timestamp() WHERE id='{grant}';",self.database)
        self.assertEqual(len(list_notifications()),1)
        self.assertEqual(count_unread(),1)
        self.assertEqual(list_notifications()[0]['id'],account_note)
        self.assertEqual(len(list_notifications()),1)
        self.assertEqual(count_unread(),1)
        own_note=str(uuid.uuid4())
        sql(f"""INSERT INTO m10.notifications(id,recipient_id,space_id,notification_type,source_module,source_id,title_key,body_key,priority)
        VALUES ('{own_note}','{a}','{space}','own','M02','{private}','own.title','own.body','normal');""",self.database)
        self.assertEqual(len(list_notifications(token='a')),1)
        self.assertEqual(count_unread(token='a'),1)
        sql(f"UPDATE m10.couple_spaces SET state='disconnecting' WHERE id='{space}'; UPDATE m10.couple_spaces SET state='frozen' WHERE id='{space}';",self.database)
        self.assertEqual(len(list_notifications(token='b')),1)
        self.assertEqual(count_unread(token='b'),1)
        sql(f"INSERT INTO m10.space_disconnects(space_id,initiated_by,initiated_at) VALUES ('{space}','{a}',clock_timestamp()-interval '31 days');",self.database)
        self.assertEqual(len(list_notifications(token='b')),1)
        self.assertEqual(count_unread(token='b'),1)
        self.assertEqual(list_notifications(token='b')[0]['id'],account_note)

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

    def test_m02_media_schema_private_by_default_and_versioned(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        resource,grant,space,invitation=[str(uuid.uuid4()) for _ in range(4)]
        sql(f"""BEGIN;
        INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{invitation}','{a}',repeat('a',64));
        UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{invitation}';
        UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{invitation}';
        INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invitation}');
        INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
        INSERT INTO m10.resources(id,module,kind,owner_id) VALUES ('{resource}','M02','media','{a}');
        INSERT INTO m02.media(id,title,mime_type,uploaded_by) VALUES ('{resource}','Synthetic media','image/png','{a}');
        COMMIT;""",self.database)
        sql("UPDATE m10.accounts SET state='active';",self.database)
        for actor,token in [(a,'a'),(b,'b')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');",self.database)
        role='media_probe_'+uuid.uuid4().hex
        sql(f'CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.can_read_resource(text,uuid) TO {role};',self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        def read(token,key=resource):
            return sql(f"SELECT app_internal.can_read_resource(repeat('{token}',64),'{key}');",self.database)
        self.assertEqual(read('a'),'t')
        self.assertEqual(read('b'),'f')
        sql(f"INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role) VALUES ('{grant}','{resource}','{a}','{b}','{space}','viewer');",self.database)
        self.assertEqual(read('b'),'t')
        self.assertEqual(sql(f"SELECT version FROM m02.media WHERE id='{resource}';",self.database),'1')
        sql(f"UPDATE m02.media SET title='Synthetic media updated' WHERE id='{resource}';",self.database)
        self.assertEqual(sql(f"SELECT version FROM m02.media WHERE id='{resource}';",self.database),'2')
        sql(f"UPDATE m10.resource_grants SET revoked_at=clock_timestamp() WHERE id='{grant}';",self.database)
        self.assertEqual(read('b'),'f')
        role2='media_direct_'+uuid.uuid4().hex
        sql(f'CREATE ROLE {role2} NOLOGIN; GRANT USAGE ON SCHEMA m02 TO {role2}; GRANT SELECT ON m02.media TO {role2};',self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role2};'))
        result=sql(f'''BEGIN; SET LOCAL ROLE {role2}; SELECT count(*) FROM m02.media; ROLLBACK;''',self.database)
        self.assertEqual(result,'0')
        self.assertEqual(read('a',str(uuid.uuid4())),'f')

    def test_m02_media_register_and_list_with_acl(self):
        migrate(database=self.database)
        seed(self.database)
        a='10000000-0000-4000-8000-000000000001'
        b='10000000-0000-4000-8000-000000000002'
        space,invitation=[str(uuid.uuid4()) for _ in range(2)]
        sql(f"""BEGIN;
        INSERT INTO m10.pairing_invitations(id,creator_id,token_hash) VALUES ('{invitation}','{a}',repeat('a',64));
        UPDATE m10.pairing_invitations SET state='awaiting_confirmation',accepted_by='{b}',accepted_at=clock_timestamp() WHERE id='{invitation}';
        UPDATE m10.pairing_invitations SET state='consumed',confirmed_at=clock_timestamp(),ended_at=clock_timestamp() WHERE id='{invitation}';
        INSERT INTO m10.couple_spaces(id,invitation_id) VALUES ('{space}','{invitation}');
        INSERT INTO m10.couple_memberships(space_id,account_id,slot) VALUES ('{space}','{a}',1),('{space}','{b}',2);
        COMMIT;""",self.database)
        sql("UPDATE m10.accounts SET state='active';",self.database)
        for actor,token in [(a,'a'),(b,'b')]:
            sql(f"INSERT INTO m10.sessions(id,account_id,token_hash,expires_at) VALUES ('{uuid.uuid4()}','{actor}',repeat('{token}',64),now()+interval '1 hour');",self.database)
        command=str(uuid.uuid4())
        object_key=str(uuid.uuid4())
        def register(token='a',cmd=command,title='Synthetic photo',mime='image/png',bucket='ourspace-private',okey=object_key,size=1024,sha_expr="repeat('a',64)"):
            return sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT app_internal.register_media(repeat('{token}',64),'{cmd}','{title}','{mime}','{bucket}','{okey}',{size},{sha_expr}); COMMIT;",self.database)
        role='media_reg_probe_'+uuid.uuid4().hex
        sql(f'CREATE ROLE {role} NOLOGIN; GRANT USAGE ON SCHEMA app_internal TO {role}; GRANT EXECUTE ON FUNCTION app_internal.register_media(text,uuid,text,text,text,uuid,bigint,text),app_internal.list_media(text,integer) TO {role};',self.database)
        self.addCleanup(lambda: sql(f'DROP ROLE {role};'))
        def set_role():
            sql(f"SET ROLE {role};",self.database)
        def list_media(token='b',limit=50):
            return json.loads(sql(f"BEGIN; SET LOCAL ROLE {role}; SELECT coalesce(json_agg(row_to_json(m)),'[]'::json) FROM app_internal.list_media(repeat('{token}',64),{limit}) m; COMMIT;",self.database))
        # A registers media
        media_id=register()
        self.assertEqual(sql(f"SELECT count(*) FROM m10.resources WHERE id='{media_id}' AND module='M02' AND kind='media';",self.database),'1')
        self.assertEqual(sql(f"SELECT count(*) FROM m02.media WHERE id='{media_id}' AND title='Synthetic photo';",self.database),'1')
        self.assertEqual(sql(f"SELECT count(*) FROM app_internal.binary_objects WHERE resource_id='{media_id}' AND purpose='original';",self.database),'1')
        # Idempotent retry returns same ID
        self.assertEqual(register(),media_id)
        # Changed payload with same commandId is denied
        with self.assertRaises(subprocess.CalledProcessError): register(title='Changed title')
        # B cannot list A's media (private by default)
        self.assertEqual(len(list_media()),0)
        # Grant B viewer access
        grant=str(uuid.uuid4())
        sql(f"INSERT INTO m10.resource_grants(id,resource_id,granted_by,grantee_id,space_id,role) VALUES ('{grant}','{media_id}','{a}','{b}','{space}','viewer');",self.database)
        # B can now list A's media
        visible=list_media()
        self.assertEqual(len(visible),1)
        self.assertEqual(visible[0]['id'],media_id)
        self.assertEqual(visible[0]['title'],'Synthetic photo')
        self.assertEqual(visible[0]['byte_size'],1024)
        # Revoke grant hides media again
        sql(f"UPDATE m10.resource_grants SET revoked_at=clock_timestamp() WHERE id='{grant}';",self.database)
        self.assertEqual(len(list_media()),0)
        # A can still list their own media
        visible_a=list_media(token='a')
        self.assertEqual(len(visible_a),1)
        self.assertEqual(visible_a[0]['id'],media_id)

    def setUp(self):
        self.database = 'ourspace_test_' + uuid.uuid4().hex
        sql(f'CREATE DATABASE {self.database};')


if __name__ == '__main__':
    unittest.main(verbosity=2)
