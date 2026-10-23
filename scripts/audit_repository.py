"""Read-only history audit. Reports locations, never credential values."""
import io
import json
import re
import subprocess
import zipfile


def git(*args):
    return subprocess.check_output(['git', *args])


PATTERNS = {
    'private-key': rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',
    'github-token': rb'gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}',
    'aws-access-key': rb'AKIA[0-9A-Z]{16}',
    'jwt': rb'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}',
    'credential-assignment': rb'(?i)(?:password|api_key|secret_key|access_token)\s*[=:]\s*[\x22\x27][A-Za-z0-9_+/=-]{16,}[\x22\x27]',
}


def inspect(path, data, findings, binaries, depth=0):
    for label, pattern in PATTERNS.items():
        if re.search(pattern, data):
            findings.append({'path': path, 'rule': label})
    if path.lower().endswith('.zip'):
        if depth >= 3:
            binaries.append(path + ' (nested archive limit)')
            return
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            for entry in archive.infolist():
                if not entry.is_dir():
                    if entry.file_size > 50_000_000:
                        binaries.append(path + '!' + entry.filename)
                    else:
                        inspect(path + '!' + entry.filename, archive.read(entry), findings, binaries, depth + 1)
    elif path.lower().endswith(('.mp4', '.png', '.jpg', '.pdf')):
        binaries.append(path)


def main():
    findings, binaries = [], []
    blobs = 0
    for line in git('rev-list', '--objects', '--all').decode().splitlines():
        oid, _, path = line.partition(' ')
        if git('cat-file', '-t', oid).strip() != b'blob':
            continue
        blobs += 1
        if re.search(r'(^|/)\.env(?:\.|$)|\.(pem|key)$', path):
            findings.append({'path': path, 'rule': 'sensitive-filename'})
        inspect(path, git('cat-file', 'blob', oid), findings, binaries)
    print(json.dumps({'history_blobs': blobs, 'findings': findings, 'manual_binary_review': sorted(set(binaries)), 'limitation': 'Heuristic scan; no guarantee of absence of personal data or unknown secret formats.'}, indent=2))
    return bool(findings)


if __name__ == '__main__':
    raise SystemExit(main())
