import json
import unittest

from build_registry import OUTPUT, build


class RegistryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.registry = build()

    def test_generated_file_matches_verified_sources(self):
        self.assertEqual(json.loads(OUTPUT.read_text(encoding='utf-8')), self.registry)

    def test_missing_decision_mappings_remain_explicit(self):
        unmapped = [r for r in self.registry['records'] if r['kind'] == 'decision' and r['mapping_status'] == 'UNMAPPED']
        self.assertEqual(len(unmapped), 60)

    def test_no_false_acceptance_or_scope_promotion(self):
        for record in self.registry['records']:
            self.assertEqual(record['status'], 'NOT_IMPLEMENTED')
            self.assertEqual(record['test'], [])
            self.assertEqual(record['desktop'], 'NOT_RUN')
            self.assertEqual(record['mobile'], 'NOT_RUN')
            if record['kind'] == 'acceptance':
                self.assertEqual(record['priority'], 'UNMAPPED')
            if record['kind'] in ('family', 'e2e'):
                self.assertEqual(record['authority'], 'DRAFT_SUPPORTING')


if __name__ == '__main__':
    unittest.main()
