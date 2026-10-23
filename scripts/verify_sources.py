"""Verify approved source bytes against master and inventory draft traceability."""
import csv
import hashlib
import io
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / 'Docs/02_OURSPACE_SOURCE_ARCHIVE'


def verify():
    master = (ROOT / 'Docs/01_OURSPACE_MASTER_SPEC_APPROVED.md').read_bytes().replace(b'\r\n', b'\n')
    sources = re.findall(rb'<!-- BEGIN SOURCE (\d+) \| (.*?) \| sha256=([a-f0-9]+) \| bytes=(\d+) -->\n(.*?)\n<!-- END SOURCE', master, re.S)
    assert len(sources) == 11, 'Expected 11 approved sources'
    verified = []
    for number, name, expected, size, embedded in sources:
        path = ARCHIVE / name.decode()
        data = path.read_bytes().replace(b'\r\n', b'\n')
        assert hashlib.sha256(data).hexdigest() == expected.decode(), f'Checksum mismatch: {name!r}'
        assert len(data) == int(size), f'Size mismatch: {name!r}'
        assert embedded.rstrip(b'\n') == data.rstrip(b'\n'), f'Master mismatch: {name!r}'
        verified.append({'source': str(path.relative_to(ROOT)).replace('\\', '/'), 'sha256': expected.decode()})
    counts = {}
    for key, filename, expected_count in [
        ('decisions', 'OUR_SPACE_DXX_TRACEABILITY_247_DRAFT_V1.0.csv', 247),
        ('acceptance', 'OUR_SPACE_BRD_AC_TRACEABILITY_763_DRAFT_V1.0.csv', 763),
    ]:
        path = ARCHIVE / 'Reviews/Acceptance' / filename
        rows = list(csv.DictReader(io.StringIO(path.read_text(encoding='utf-8-sig'))))
        assert len(rows) == expected_count, f'{key} count mismatch'
        counts[key] = len(rows)
    return {'approved_sources': verified, 'draft_inventory': counts, 'status': 'SOURCE_VERIFIED_NOT_IMPLEMENTED'}


if __name__ == '__main__':
    print(json.dumps(verify(), indent=2))
