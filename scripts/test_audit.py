import io
import unittest
import zipfile

from audit_repository import inspect, sensitive_filename
from verify_sources import verify


class BaselineTests(unittest.TestCase):
    def test_only_empty_env_template_is_allowed(self):
        self.assertFalse(sensitive_filename('.env.example', b'# local settings\nDATABASE_URL=\n'))
        self.assertTrue(sensitive_filename('.env.example', b'DATABASE_URL=some-value'))
        self.assertTrue(sensitive_filename('.env.local', b''))
        self.assertTrue(sensitive_filename('nested/.env', b''))

    def test_sources_match_master(self):
        self.assertEqual(len(verify()['approved_sources']), 11)

    def test_detects_token_without_outputting_value(self):
        findings = []
        value = b'ghp_' + b'a' * 36
        inspect('fixture.txt', value, findings, [])
        self.assertEqual(findings, [{'path': 'fixture.txt', 'rule': 'github-token'}])
        self.assertNotIn(value.decode(), str(findings))

    def test_checks_archive_contents(self):
        stream = io.BytesIO()
        with zipfile.ZipFile(stream, 'w') as archive:
            archive.writestr('key.txt', '-----BEGIN PRIVATE KEY-----\n' + 'QUFB' * 20)
        findings = []
        inspect('fixture.zip', stream.getvalue(), findings, [])
        self.assertIn({'path': 'fixture.zip!key.txt', 'rule': 'private-key'}, findings)

    def test_documentation_marker_is_not_key_material(self):
        findings = []
        inspect('example.py', b"marker = '-----BEGIN PRIVATE KEY-----'", findings, [])
        self.assertEqual(findings, [])

    def test_detects_truncated_private_key_material(self):
        findings = []
        inspect('key.txt', b'-----BEGIN RSA PRIVATE KEY-----\n' + b'QUFB' * 20, findings, [])
        self.assertEqual(findings, [{'path': 'key.txt', 'rule': 'private-key'}])

    def test_marks_video_for_manual_review(self):
        binaries = []
        inspect('reference.mp4', b'video', [], binaries)
        self.assertEqual(binaries, ['reference.mp4'])

    def test_plain_source_has_no_findings(self):
        findings = []
        inspect('example.ts', b'export const version = 1;', findings, [])
        self.assertEqual(findings, [])


if __name__ == '__main__':
    unittest.main()
