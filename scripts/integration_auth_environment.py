"""Local Auth infrastructure checks; no credentials or user content printed."""
import json
import subprocess
import unittest
from urllib.request import urlopen

from local_db import sql


class AuthEnvironmentTests(unittest.TestCase):
    def test_auth_health_and_email_confirmation_required(self):
        with urlopen('http://127.0.0.1:55433/health', timeout=10) as response:
            self.assertEqual(response.status, 200)
        with urlopen('http://127.0.0.1:55433/settings', timeout=10) as response:
            settings = json.load(response)
        self.assertTrue(settings['external']['email'])
        self.assertFalse(settings['mailer_autoconfirm'])
        self.assertFalse(settings['external']['anonymous_users'])

    def test_capture_inbox_is_local_and_accessible(self):
        with urlopen('http://127.0.0.1:55434/api/v1/messages', timeout=10) as response:
            self.assertEqual(response.status, 200)

    def test_auth_role_cannot_read_application_profiles(self):
        self.assertEqual(sql("SELECT rolsuper OR rolcreatedb OR rolcreaterole FROM pg_roles WHERE rolname='ourspace_auth_owner';"), 'f')
        with self.assertRaises(subprocess.CalledProcessError):
            sql('BEGIN; SET LOCAL ROLE ourspace_auth_owner; SELECT * FROM m10.profiles; ROLLBACK;')


if __name__ == '__main__':
    unittest.main(verbosity=2)
