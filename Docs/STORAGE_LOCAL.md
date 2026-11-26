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

The server-only TypeScript transport is `src/server/private-storage.server.ts`.
Run `npx vitest run --config vitest.storage.config.mjs` against the running local
Storage instance. It reads only validated registry locations, disables caching
and redirects, enforces a caller-configured byte ceiling and timeout, and checks
size/SHA-256 before returning bytes. Errors never include backend response bodies.
This buffered transport is suitable for bounded downloads; larger media streaming
and range support must be implemented and verified with the relevant domain limits.
It is not an authorization gate and is not yet exposed by an application route.


`PrivateStorage.write` now supports bounded immutable writes with `x-upsert: false`,
server-side payload length/SHA256 validation, and authenticated readback. A retry
succeeds only when the stored bytes match exactly; conflicting bytes never replace
an existing object. It snapshots payload and location before asynchronous work.
The caller must supply an authorized upload reservation and perform media format
validation; this transport alone does not make the M02 upload flow complete.


Upload HTTP: POST /api/media/upload accepts commandId/title/mimeType/byteSize/sha256;
GET ?uploadId= reads owner-only status; PUT ?uploadId= accepts application/octet-stream.
Writes require matching Origin and a live session cookie. Configure server-only
SUPABASE_STORAGE_URL, SUPABASE_STORAGE_SERVER_TOKEN and explicit positive integer
MEDIA_MAX_UPLOAD_BYTES, MEDIA_MAX_IMAGE_PIXELS, MEDIA_DECODE_TIMEOUT_SECONDS.
These are deployment limits, not approved business quotas. No runtime fallback
credentials or limits are assumed. Provision a private media bucket before use.
Never expose the Storage server token with NEXT_PUBLIC. The current validator
accepts JPEG/PNG/WebP; HEIC and video support is still required before M02 acceptance.
