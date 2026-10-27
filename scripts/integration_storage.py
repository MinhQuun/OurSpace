"""Real local Storage bytes; no application ACL or domain completion claimed."""
import json
import unittest
import uuid
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from local_storage import token


def request(method, path, credential=None, data=None, content_type=None):
    headers = {}
    if credential:
        headers['Authorization'] = 'Bearer ' + credential
    if content_type:
        headers['Content-Type'] = content_type
    req = Request('http://127.0.0.1:55435' + path, data=data,
                  headers=headers, method=method)
    try:
        with urlopen(req, timeout=15) as response:
            return response.status, response.read()
    except HTTPError as error:
        return error.code, error.read()


class PrivateStorageTests(unittest.TestCase):
    def test_private_bytes_reject_direct_user_and_public_access(self):
        service = token('service_role')
        bucket = 'poc-' + uuid.uuid4().hex
        key = str(uuid.uuid4())
        payload = b'Our Space synthetic binary\x00\xff' + uuid.uuid4().bytes
        status, _ = request('POST', '/bucket', service,
                            json.dumps({'id': bucket, 'name': bucket,
                                        'public': False}).encode(), 'application/json')
        self.assertEqual(status, 200)
        try:
            status, body = request('GET', '/bucket/' + bucket, service)
            self.assertEqual(status, 200)
            self.assertFalse(json.loads(body)['public'])
            path = '/object/' + bucket + '/' + key
            status, _ = request('POST', path, service, payload, 'application/octet-stream')
            self.assertEqual(status, 200)
            status, body = request('GET', path, service)
            self.assertEqual(status, 200)
            self.assertEqual(body, payload)
            for credential in (None, token('anon'),
                               token('authenticated', str(uuid.uuid4()))):
                with self.subTest(credential_kind='unprivileged'):
                    for read_path in (path, '/object/public/' + bucket + '/' + key):
                        status, body = request('GET', read_path, credential)
                        self.assertIn(status, (400, 401, 403, 404))
                        self.assertNotIn(payload, body)
                    status, _ = request('POST', '/object/sign/' + bucket + '/' + key,
                                        credential, b'{"expiresIn":60}', 'application/json')
                    self.assertIn(status, (400, 401, 403, 404))
                    status, body = request('POST', '/object/list/' + bucket, credential,
                                           b'{"prefix":""}', 'application/json')
                    self.assertTrue(status in (400, 401, 403, 404) or
                                    (status == 200 and json.loads(body) == []))
                    status, _ = request('POST', '/object/' + bucket + '/' + str(uuid.uuid4()),
                                        credential, payload, 'application/octet-stream')
                    self.assertIn(status, (400, 401, 403, 404))
        finally:
            # Only this test's random bucket and synthetic bytes are removed.
            status, _ = request('POST', '/bucket/' + bucket + '/empty', service,
                                b'{}', 'application/json')
            self.assertEqual(status, 200)
            status, _ = request('DELETE', '/bucket/' + bucket, service)
            self.assertEqual(status, 200)


if __name__ == '__main__':
    unittest.main()
