# Stage 02 security exit review

Scope: Goal section STAGE 02 is an architecture/security POC gate, not acceptance
of all M10 or domain P0. Stages 03–15 and the 763 business AC remain outstanding.
This review does not promote the requirement registry to implemented status.

| Required gate | Authoritative evidence | Scope and limits |
|---|---|---|
| Signup, email verification, login/logout, independent accounts | `integration/auth-provider.test.ts`; `e2e/auth-ui.spec.ts`; `e2e/auth-http.spec.ts` | Real local GoTrue, Mailpit and application sessions; copied logout cookie denied |
| TOTP and recovery codes, no bypass recovery | Auth integration; `e2e/mfa-ui.spec.ts`; `e2e/recovery-ui.spec.ts` | Real provider proofs, activation acknowledgment, session replacement, reset/replay negatives; desktop/mobile |
| Pairing with both parties' consent | Auth integration; `e2e/pairing-ui.spec.ts`; DB pairing tests | Verified accounts and explicit acceptance/confirmation; pairing creates no object grant |
| Disconnect/frozen foundation | DB disconnect/space gates; pairing browser tests | Fresh password/TOTP/recovery proof, atomic state/receipt/outbox, write freeze; domain-specific D35 retention/jobs still later |
| Private default, object ACL, Inspector | `scripts/integration_db.py` object registry test; `integration/database.test.ts`; permission HTTP/UI tests | Execute-only runtime, forced RLS, no parent inheritance, owner consent, stale-version conflict, grant/revoke |
| Private child via API/links/preview/storage | DB binary/link resolver negatives; `integration/storage.test.ts`; `scripts/integration_storage.py` | Original/preview identities differ; private buckets deny unprivileged access; real bytes verified by size/hash |
| Search, counts and aggregate | DB payload POC reader and sum of visible byte lengths | Real SQL rows under execute-only role; private payload never affects visible aggregate; not a production search/finance implementation |
| Export boundary | DB COPY CSV from authorized payload reader | Saved selection contains IDs only; re-query after revoke returns no rows; no completed export job, ZIP/PDF workflow or domain canDownload claim |
| Old URL / active delivery after revoke | Real HTTP binary service integration | Application proxy rechecks before returning bytes; backend signed URLs are never delivered to browsers. Direct signed URLs are not treated as immediately revocable capabilities |
| Active realtime channel | `integration/realtime.test.ts` | Real WebSocket + PostgreSQL: grant receives, revoke prevents next frame/reconnect, Private child denied, invalid session closed. Read-channel POC only; not M01 CRDT acceptance |

## Current regression results

- Production build, lint and typecheck: PASS.
- Auth provider integration: 17/17 PASS, 126.72 seconds test time.
- Runtime DB integration: 6/6 PASS.
- HTTP plus desktop/mobile browser E2E: 30/30 PASS, 2.1 minutes.
- Updated aggregate/export/object ACL fresh-DB test: PASS, 54.906 seconds.
- Private Storage HTTP/service integration: 3/3 PASS in task 02.11e.
- Active-channel integration: PASS in task 02.12a.
- Unit tests: 21/21 PASS; source/registry/audit regression: 11/11 PASS.
- Full DB migration/security suite: 24/24 PASS, 176.016 seconds.
- History heuristic audit: 569 blobs, no findings; approved historical binary caveat unchanged.

Exit decision: Stage 02 POC gate PASS. Proceed to Stage 03 in order. This does not
mark full M10/domain P0 or production readiness complete.

## Carried-forward requirements

Architecture A has working local Auth/DB/Storage evidence. Production secret
management, asymmetric JWT rotation, deployment rate thresholds, restore and
operational resilience remain later-stage requirements. No production deployment
or cloud account was used.

Module adapters must enforce their own actions and state transitions in addition
to base ACL. In particular View is not Download, a Contributor is not a whole-object
reader, conditional/Sealed content needs dedicated gates, and Frozen processing
rules are not replaced by generic ACL. No production allow-all adapter is enabled.

Storage and WebSocket boundaries are reusable POC implementations. Public domain
routes, upload processing, large-file streaming/ranges, export jobs, notifications,
M01 CRDT persistence/ack/undo and M08 seal/unlock remain unimplemented. They must
receive domain acceptance tests in the ordered stages; this gate does not waive them.
