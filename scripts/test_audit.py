import io
import unittest
import zipfile

from audit_repository import inspect
from verify_sources import verify


class BaselineTests(unittest.TestCase):
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
            archive.writestr('key.txt', '-----BEGIN PRIVATE KEY-----')
        findings = []
        inspect('fixture.zip', stream.getvalue(), findings, [])
        self.assertIn({'path': 'fixture.zip!key.txt', 'rule': 'private-key'}, findings)

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
