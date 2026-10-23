"""Build traceability inventory without promoting draft mappings to approval."""
import csv
import json
import re
from collections import Counter
from pathlib import Path

from verify_sources import ARCHIVE, ROOT, verify

OUTPUT = ROOT / 'requirements/registry.json'


def base(identifier, kind, module, source, line, authority):
    return dict(id=identifier, kind=kind, module=module, owner=module,
                source=source, source_line=line, authority=authority,
                priority='UNMAPPED', test=[], status='NOT_IMPLEMENTED',
                desktop='NOT_RUN', mobile='NOT_RUN')


def build():
    verified = verify()
    records = []
    acceptance_dir = ARCHIVE / 'Reviews/Acceptance'
    for kind, filename in [('decision', 'OUR_SPACE_DXX_TRACEABILITY_247_DRAFT_V1.0.csv'),
                           ('acceptance', 'OUR_SPACE_BRD_AC_TRACEABILITY_763_DRAFT_V1.0.csv')]:
        with (acceptance_dir / filename).open(encoding='utf-8-sig', newline='') as handle:
            for row in csv.DictReader(handle):
                identifier = (row['module'] + '-' + row['decision']) if kind == 'decision' else row['ac_id_canonical']
                source = ARCHIVE / 'Docs' / row['source_file']
                line = int(row['source_line'])
                source_lines = source.read_text(encoding='utf-8').splitlines()
                token = row['decision'] if kind == 'decision' else row['ac_id_as_in_brd']
                if token not in source_lines[line - 1]:
                    raise ValueError(f'Invalid source locator: {identifier}:{line}')
                item = base(identifier, kind, row['module'], source.relative_to(ROOT).as_posix(), line, 'APPROVED_SOURCE')
                item['inventory_source'] = (acceptance_dir / filename).relative_to(ROOT).as_posix()
                if kind == 'decision':
                    item['text'] = row['decision_text']
                    item['ac_reference'] = row['explicit_brd_ac_reference'] or None
                    item['mapping_status'] = 'DRAFT_REFERENCE_REQUIRES_REVIEW' if item['ac_reference'] else 'UNMAPPED'
                else:
                    item['condition'] = row['condition']
                    item['expected'] = row['expected']
                    item['scope_status'] = 'CHECK_ORIGINAL_BRD_P0_P1_P2'
                records.append(item)
    matrix = acceptance_dir / 'OUR_SPACE_MASTER_P0_ACCEPTANCE_MATRIX_DRAFT_V1.0.md'
    for line, text in enumerate(matrix.read_text(encoding='utf-8').splitlines(), 1):
        if not re.match(r'\| (?:P0-M\d\d-\d\d|E2E-\d\d) \|', text):
            continue
        cells = [cell.strip() for cell in text.strip('|').split('|')]
        identifier, title, expected, references = cells[:4]
        family = identifier.startswith('P0-')
        module = identifier.split('-')[1] if family else 'CROSS_MODULE'
        item = base(identifier, 'family' if family else 'e2e', module, matrix.relative_to(ROOT).as_posix(), line, 'DRAFT_SUPPORTING')
        item.update(title=title, expected=expected, references=references)
        if family:
            item.update(priority='P0', scope_status='DRAFT_FAMILY_VERIFY_AGAINST_BRD')
        records.append(item)
    policy = ARCHIVE / 'Docs/Policies/OUR_SPACE_APPROVED_POLICY_SUPPLEMENT_V1.0.md'
    for line, text in enumerate(policy.read_text(encoding='utf-8').splitlines(), 1):
        match = re.match(r'## (DEC-\d\d) ', text)
        if match:
            item = base(match[1], 'policy', 'CROSS_MODULE', policy.relative_to(ROOT).as_posix(), line, 'APPROVED_SOURCE')
            item['text'] = text.removeprefix('## ')
            records.append(item)
    counts = dict(Counter(item['kind'] for item in records))
    expected = dict(decision=247, acceptance=763, family=86, e2e=40, policy=7)
    if counts != expected or len({item['id'] for item in records}) != len(records):
        raise ValueError(f'Invalid inventory: {counts}')
    return dict(schema_version=1, sources=verified['approved_sources'], counts=counts,
                scope='Inventory only; no implementation or acceptance implied.', records=records)


if __name__ == '__main__':
    OUTPUT.parent.mkdir(exist_ok=True)
    data = build()
    OUTPUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(data['counts']))
