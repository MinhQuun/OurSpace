"""Local-only Docker PostgreSQL lifecycle. No reset/delete command."""
import argparse
import secrets
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def compose(*args, **kwargs):
    return subprocess.run(['docker', 'compose', '-f', str(ROOT / 'compose.yaml'), *args],
                          cwd=ROOT, check=True, **kwargs)


def sql(statement, database='ourspace'):
    return compose('exec', '-T', 'db', 'psql', '-X', '-q', '-A', '-t',
                   '-v', 'ON_ERROR_STOP=1', '-U', 'ourspace_owner', '-d', database,
                   input=statement, text=True, encoding='utf-8', capture_output=True).stdout.strip()


def start():
    password_file = ROOT / '.local/db-password'
    password_file.parent.mkdir(exist_ok=True)
    if not password_file.exists():
        with password_file.open('x', encoding='utf-8') as handle:
            handle.write(secrets.token_urlsafe(36))
    compose('up', '-d', '--wait', 'db')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['start', 'stop', 'status'])
    args = parser.parse_args()
    if args.command == 'start':
        start()
    elif args.command == 'stop':
        compose('stop', 'db')
    else:
        compose('ps', 'db')
