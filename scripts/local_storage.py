"""Run isolated, loopback-only Supabase Storage with generated local credentials."""
import argparse
import base64
import hashlib
import hmac
import json
import subprocess
import time

from local_auth import local_secret
from local_db import ROOT


def compose_storage(*args, **kwargs):
    return subprocess.run(
        ['docker', 'compose', '-f', str(ROOT / 'compose.storage.yaml'), *args],
        cwd=ROOT, check=True, **kwargs)


def token(role, subject=None):
    """Short-lived test/server token, never an application user's credential."""
    def encode(value):
        return base64.urlsafe_b64encode(value).rstrip(b'=')

    now = int(time.time())
    payload = {'role': role, 'iat': now, 'exp': now + 900}
    if subject:
        payload['sub'] = subject
    data = b'.'.join(encode(json.dumps(value).encode()) for value in (
        {'alg': 'HS256', 'typ': 'JWT'}, payload))
    signature = hmac.new(local_secret('storage-jwt-secret').encode(), data,
                         hashlib.sha256).digest()
    return (data + b'.' + encode(signature)).decode()


def provision():
    password = local_secret('storage-db-password')
    signing_key = local_secret('storage-jwt-secret')
    # These secrets belong only to the isolated local Storage container.
    (ROOT / '.local/storage.env').write_text(
        'DATABASE_URL=postgres://postgres:' + password + '@storage-db:5432/storage\n'
        + 'AUTH_JWT_SECRET=' + signing_key + '\n', encoding='utf-8')
    compose_storage('up', '-d', '--wait')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['start', 'stop', 'status'])
    args = parser.parse_args()
    if args.command == 'start':
        provision()
    elif args.command == 'stop':
        compose_storage('stop')
    else:
        compose_storage('ps')
