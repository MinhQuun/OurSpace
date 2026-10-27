# Local private Storage

Run `python scripts/local_storage.py start`, then
`python scripts/integration_storage.py`. Use `python scripts/local_storage.py stop`
to stop containers without deleting either persistent volume.

The official Supabase Storage API runs at `http://127.0.0.1:55435` with its own
PostgreSQL container, internal database port, and separate metadata/byte volumes.
It receives no credentials for the application database. Generated local database
and JWT secrets live only in ignored `.local/`; do not copy them into Git or logs.
This configuration is for local development, not production deployment.

The integration test creates a random private bucket, uploads synthetic binary
content, checks exact bytes using a server service token, and checks denial of
public/direct reads, signing, listing and uploads for unprivileged requests.
It removes only its own temporary bucket and content afterward. Image transformations
and S3 protocol access are disabled in this foundation task.

Application downloads must go through a server proxy which validates the live
session and source-object/domain authorization on each request. Do not return
backend service tokens or signed backend URLs to browsers. This infrastructure
test alone does not validate application ACL revocation, domain upload rules,
backup/restore, or completion of M02.

Upstream configuration references:

- https://github.com/supabase/storage/blob/v1.81.0/src/config.ts
- https://github.com/supabase/storage/blob/v1.81.0/migrations/tenant/0002-storage-schema.sql
- https://supabase.com/docs/guides/storage/serving/downloads
