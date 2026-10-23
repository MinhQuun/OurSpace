"""Real database tests; creates/drops only a fresh randomly named test database."""
import subprocess
import tempfile
import unittest
import uuid
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from local_db import ROOT, sql
from migrate_db import migrate


class MigrationIntegrationTests(unittest.TestCase):
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
        self.assertEqual(sql('SELECT count(*) FROM app_migrations.history;', self.database), '1')
        self.assertEqual(sql("SELECT count(*) FROM pg_namespace WHERE nspname ~ '^m[0-9]{2}$';", self.database), '10')

    def test_changed_migration_rejected(self):
        migrate(database=self.database)
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, '0001_module_schemas.sql').write_text('SELECT 42;', encoding='utf-8')
            with self.assertRaises(subprocess.CalledProcessError):
                migrate(directory, self.database)
        self.assertEqual(sql('SELECT count(*) FROM app_migrations.history;', self.database), '1')

    def test_failure_rolls_back_schema_and_history(self):
        with tempfile.TemporaryDirectory() as directory:
            Path(directory, '0001_failure.sql').write_text('CREATE SCHEMA rollback_probe; SELECT 1/0;', encoding='utf-8')
            with self.assertRaises(subprocess.CalledProcessError):
                migrate(directory, self.database)
        self.assertEqual(sql("SELECT count(*) FROM pg_namespace WHERE nspname IN ('rollback_probe', 'app_migrations');", self.database), '0')


if __name__ == '__main__':
    unittest.main(verbosity=2)
