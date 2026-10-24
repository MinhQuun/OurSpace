# Our Space — Build Report

Updated: 2026-10-23 (Asia/Saigon). This report records implementation evidence, not product acceptance.

## Workspace and authority

- Workspace: `D:/MinhQuun/Tmp/OurSpace`.
- Repository: `https://github.com/MinhQuun/OurSpace`, PUBLIC expressly approved by Product Owner.
- Current development branch: `master` (new Product Owner objective, 2026-10-23). Previous `codex/ourspace-build` preserved; base commit `ae050dfd8e8cafb0cbb4670269fef58999cb8dbe`.
- Existing uncommitted Goal V1.1 additions retained; PUBLIC amendment supersedes private-repository gates only. Application Authentication/Authorization requirements remain.
- No production, billing, cloud account secrets, force push or history rewrite authorized/performed. Fast-forward recovery into master explicitly authorized and completed.

## Stage status

| Stage | Status | Evidence / remaining work |
|---|---|---|
| 00 | DONE | Audit and registry pushed and verified; source mappings retain explicit unresolved statuses |
| 01 | DONE | Local app/DB/Auth, seed, migrations, policy/ownership foundations and hosted CI verified |
| 02 | IN_PROGRESS | Real Auth provider transport; application sessions/UI/MFA/pairing/ACL POC pending |
| 03 | NOT_STARTED | Shared platform |
| 04 | NOT_STARTED | M02 |
| 05 | NOT_STARTED | M01 |
| 06 | NOT_STARTED | M05 |
| 07 | NOT_STARTED | M03 |
| 08 | NOT_STARTED | M04 |
| 09 | NOT_STARTED | M06 |
| 10 | NOT_STARTED | M07 |
| 11 | NOT_STARTED | M08 |
| 12 | NOT_STARTED | M09 |
| 13 | NOT_STARTED | Cross-module M10 |
| 14 | NOT_STARTED | Full P0, hardening, restore |
| 15 | NOT_STARTED | Deployment preparation and handoff |

## Task 00.1 — Public repository and source audit baseline

Acceptance: preserve existing files; correct Goal repository policy; ignore local secrets/build/data; inspect tracked history without printing secret values; verify 11 approved source checksums against embedded master; inventory draft CSVs. No product AC claimed by this tooling task.

- `scripts/verify_sources.py`: PASS, 11 source SHA-256 and byte lengths (canonical LF), embedded master bodies match extracted sources; draft inventories contain 247 Dxx and 763 AC.
- `scripts/audit_repository.py`: PASS heuristic scan of all 31 historical blobs, including ZIP members; no matching credential findings. This is not proof that all possible secrets/personal data are absent.
- Historical exposure risk: initial commit already tracks both handoff ZIPs, reference video and documents. Reference contact sheet visually reviewed: third-party photobook tutorial with TikTok attribution and people pictured. Full video not frame-by-frame reviewed; redistribution permission not established. No new media is staged. Existing history preserved as requested.
- `.gitignore` does not untrack historical assets; it prevents accidental addition of new archives/media, environment files, dumps, keys, uploads and build products.
- Python syntax compilation PASS; whitespace check PASS. Application lint/typecheck not applicable yet (no application or TypeScript exists); Python regression test command: `python -m unittest discover -s scripts -p test_*.py -v`.
- Commit: `69e95c4` (`chore(audit): establish public repository and source verification baseline`), LOCAL_ONLY. Five Python regression tests PASS; syntax compilation and whitespace checks PASS.
- Push: GIT_PUSH_BLOCKED. Automatic approval review rejected `git push -u origin codex/ourspace-build` before execution because reachable history includes ZIP documents and video with people whose public redistribution permission is unverified. No remote SHA verification is claimed. Explicit user clarification about the historical assets has been requested; no alternate push route or history rewrite attempted.

## Environment and open issues

- Windows PowerShell; Node 20.20.2; Python 3.11.1; Git available; npm available; Docker CLI present.
- Initial sandbox denied Git metadata writes and network. Authorized elevated `git switch -c codex/ourspace-build` succeeded; elevated `git ls-remote --heads origin` confirmed base master SHA. These two operations were approved; the later push was rejected as recorded above.
- Docker daemon access denied in sandbox; retry with suitable permissions during Stage 01 before declaring database blocked.
- OP-01 through OP-07 remain unapproved proposals. Dependent business operations must be POLICY_BLOCKED unless separately approved; independent technical work continues.
- Next: build machine-readable requirement registry with source references and explicit UNMAPPED priority/test evidence. Read BRD sections per stage; source verification is not a claim that all 763 AC have been analyzed or implemented.
- Historical push blocker resolved: Product Owner explicitly confirmed the documents/media in base commit `ae050df` may be public and contain no sensitive personal material requiring secrecy. Approval review accepted the subsequent push. Remote `codex/ourspace-build` SHA verified as `4b1ac04e45342477738fb0bfbb31c690a2e00ff3`; both `69e95c4` and `4b1ac04` are PUSHED. No history rewrite performed.

## Task 00.2 — Machine-readable source registry

Acceptance: inventory all approved decisions/AC/policies and supporting draft families/E2E; validate original line references; preserve source authority; leave unsupported mappings and priorities UNMAPPED; never infer PASS from inventory counts.

- `scripts/build_registry.py` builds `requirements/registry.json` reproducibly from checksum-verified sources: 247 decisions, 763 AC, 86 draft P0 families, 40 draft E2E, 7 approved DEC.
- All 1,010 BRD decision/AC source line locators validated against original identifiers. The 60 decisions without explicit AC mapping remain UNMAPPED; remaining mappings are draft references requiring review.
- Registry contains source, module, owner, priority, test and status; all implementation states NOT_IMPLEMENTED, tests empty, desktop/mobile NOT_RUN. AC priority remains UNMAPPED pending actual BRD scope analysis. Cross-module owner is deliberately CROSS_MODULE until technical ownership is resolved.
- Validation: 8 Python tests PASS, including reproducibility, missing mappings and no false acceptance. Application lint/typecheck not applicable to this Python inventory task; Python syntax and Git whitespace gates run before commit.
- Commit `77502eb0f80205ca274bc950400e45201f319ebb` PUSHED and verified on the previous branch, then on master by fast-forward recovery.

## Recovery checkpoint — master workflow amendment

- Read new objective from user attachment on 2026-10-23. It explicitly supersedes the previous no-master development workflow.
- Fetched origin; no divergence: master was `ae050df`, build branch was `77502eb`. Switched to master, fast-forwarded origin/master then origin/codex/ourspace-build, pushed master. HEAD and remote master both verified as `77502eb0f80205ca274bc950400e45201f319ebb`.
- Untracked Next.js scaffold was preserved in-place and copied to ignored `.local/recovery-before-master` before switching. No files deleted; old branch retained.
- Goal updated for direct master commits/pushes, no new feature branches or routine PR. Full stages and product requirements retained.
- Docker daemon verified accessible with authorized elevated read-only inspection: version 28.5.1. Earlier sandbox error is not an environment blocker.
- Stage 01 next: finish package installation, lint/typecheck/unit/build, then commit the scaffold separately. It currently implements no product P0.

## Task 01.1 — Runnable Next.js scaffold

Acceptance: a real local Next.js server and build, strict TypeScript, lint/test commands, a non-sensitive health endpoint; no product acceptance inferred from scaffold UI.

- Commit `f005fd045330c6e50b9c056e86600910b2a6e49c` PUSHED; remote master SHA matches local HEAD. Scaffold task complete; Stage 01 remains IN_PROGRESS.

- Workflow amendment `7a5acc8679ce18f238e68701371774c58d126cb6` PUSHED and remote master verified.
- Next.js 16.4.2 / React 19.3.1 / TypeScript 5.9.3 / Vitest 4.1.12 pinned with lockfile. Registry metadata and official installation docs checked; local Next.js bundled guides also consulted. Node 20.20.2 meets engines.
- npm 10.8.2 peer resolver crashed with `edgesOut`; installing dev dependencies with `--legacy-peer-deps` completed. ESLint 9.39.5 retained because installed React and accessibility plugins exclude ESLint 10 in their peer ranges; follow-up toolchain upgrade needed.
- PASS: lint, strict typecheck, 1 endpoint unit test, production build; live dev server on `127.0.0.1:3100` returned HTTP 200 for `/` and `/api/health`, exact health payload `{"status":"ok"}`. Typecheck generates route types for fresh checkouts.
- Dependency risk OPEN: npm audit reports 5 high entries in one dev-only chain: eslint-config-next → next lint plugin → fast-glob → micromatch → braces (GHSA-vfj7-8cjw-p6xm). Registry latest braces is 3.0.3, still affected. No forced downgrade or disabling checks; production direct dependency installation audit had zero findings. Recheck before release; this does not meet Stage 14 dependency hardening gate.
- UI is a preparation page with no private data and no claimed P0 business functionality. Auth/database/domain modules/E2E/CI remain for subsequent tasks.
- Run: `npm install --legacy-peer-deps`, `npm run dev`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. No environment secrets needed for scaffold. No production deployment performed.
- Next task: local PostgreSQL configuration and migration runner with database integration tests, followed by CI and module service boundaries.

## Task 01.2 — Local PostgreSQL and transactional migrations

Acceptance: isolated persistent local database; no checked-in password; repeatable migration runner with checksum drift rejection, concurrency lock and atomic failure rollback; demonstrate on real PostgreSQL.

- Added `compose.yaml` scoped to project `ourspace-local`, bound to `127.0.0.1:55432`. Password generated only in ignored `.local/db-password`; named data volume persists on stop. No destructive reset command.
- `python scripts/local_db.py start|stop|status` manages only this Compose project. `python scripts/migrate_db.py` applies local SQL migrations with transactional advisory lock and SHA-256 history.
- Initial migration creates private module schemas M01-M10 and removes PUBLIC create rights. These schemas are technical boundaries, not implemented domains or verified end-user ACL.
- `python scripts/integration_db.py` uses fresh UUID-named disposable test databases, never resets the application database. Acceptance cases: repeated/concurrent runs, checksum drift rejected, schema/history rolled back on SQL failure.
- Validation PASS: lint/typecheck and existing unit test; Python compilation and diff whitespace; all 3 real PostgreSQL integration tests (concurrency/repeatability, drift rejection, failure rollback). PostgreSQL 17.11 healthy; base migration applied. Docker image pinned to verified digest `sha256:eee6c6e1b0894fa4fe0075eb054af9fd1cf39a35321c2d4110626cfe506411fb`.
- Local recovery: stop/start preserves volume; failed migration transaction rolls back. Correct an unapplied migration then rerun; never modify an applied migration, add a forward migration instead. Production migration/backup credentials and deployment remain out of scope for this local task.
- Commit `5e29ee763f6054da6be1f67edeff3f01f3aee2d4` PUSHED and remote master SHA verified.

## Task 01.3 — Continuous quality gates

Acceptance: every master push runs source audit, lint, typecheck, unit/source tests, production dependency audit, build, migration and real DB integration tests; no deployment or account secrets.

- Workflow `.github/workflows/quality.yml` uses read-only repository permission and official Actions pinned to verified v6 commit SHAs. Local credentials are generated ephemerally, never uploaded as artifacts. Production dependency audit blocks high findings; known development lint-chain findings remain explicitly open in Task 01.1.
- All constituent code checks ran locally in Tasks 01.1/01.2. Hosted CI is NOT_RUN until this workflow is pushed and its run is observed; adding a YAML file is not evidence of hosted success.
- Five pre-existing source formatting changes appeared during Task 01.2; preserved unstaged and excluded from database/CI commits.
- Commit `e083033c0acba6a04d0d076b98f049935c7763f5` PUSHED; remote master verified. Hosted run `39917391288` exists and is QUEUED (last verified via GitHub API); no jobs started yet. Continue observing this run, do not dispatch duplicate runs or claim CI PASS: https://github.com/MinhQuun/OurSpace/actions/runs/39917391288.

### Task 01.3a — Fix scanner fixture false positive

- Run `39917391288` completed FAILURE at history secret scan; lint/typecheck/unit/source tests succeeded. Reproduced locally: bare private-key header string in `scripts/test_audit.py` triggered the key rule, without any actual key bytes.
- Detection now requires base64 key material following the header. It still catches truncated keys without an end marker. Added regressions for documentation-only headers and real-shaped synthetic key material in ZIP/direct files. No path exclusion, history rewrite or CI bypass.
- User commit `cf831c9` formats the preserved source files and includes the prior report checkpoint; retained intact.
- Fix commit `e34fd0f017683d90b0678282763107a9218ce856` PUSHED and remote SHA verified. Ten Python tests, history scan, lint, typecheck and unit test PASS locally. Hosted CI run `39927893483` completed SUCCESS, verified via GitHub API: https://github.com/MinhQuun/OurSpace/actions/runs/39927893483.

## Task 01.4 — Desktop/mobile browser test harness

Acceptance: launch the production build in an isolated local server, exercise real Chromium desktop/mobile viewports, fail on browser exceptions or horizontal overflow, keep E2E separate from unit discovery, run in CI.

- Added pinned Playwright 1.64.1, desktop Chrome and Pixel 7 projects, no retries and no reuse of unrelated servers. Tests cover scaffold rendering, language metadata and minimal/non-cacheable health endpoint. These are infrastructure smoke tests, not P0 business evidence or physical-device validation.
- Validation PASS: lint, typecheck, unit test, production build, 4/4 Playwright smoke tests across real desktop/mobile Chromium contexts. No page exceptions or horizontal overflow. Browser binaries downloaded locally; no personal browser profile used. Stage 01 still requires domain service boundaries, test-account seeding and remaining platform foundations before completion.
- Windows sandbox initially prevented test-server process-tree cleanup after assertions passed; scoped cleanup of the verified test server completed. Re-ran the entire suite with authorized process permissions: 4 PASS in 2.8 seconds, exit 0 and automatic cleanup successful. No assertion or retry settings weakened.
- Commit `23928505b0e3ef8d108384c87bb1fd5584332b81` PUSHED and remote master SHA verified. Next: observe its hosted CI, then implement remaining Stage 01 domain boundaries, test seeds and shared infrastructure.

## Task 01.5 — Account data foundation and safe local fixtures

Acceptance: M10 ENT-01/02 data foundation, required display name, no cascading account deletion, deny-by-default RLS and two repeatable synthetic local fixtures without credentials. Related M10 D01/D07/D09/D13; this task does not implement authentication or claim their full P0 acceptance.

- Migration 0002 creates accounts with approved lifecycle vocabulary (default Pending Verification) and profiles with required display name. 120-character limit is a technical validation choice, not an approved product decision. Owner IDs are stable UUIDs; provider integration follows in Stage 02.
- RLS enabled and forced on both tables, no permissive policies; PUBLIC privileges revoked. Local migration owner is privileged and must never be used as the application runtime role.
- `npm run db:seed` inserts two explicit synthetic IDs and display names only; preserves existing rows/edits. No password, email-verification bypass or fake login. Auth-provider test accounts remain a Stage 02 prerequisite.
- `.env.example` contains blank placeholders only. Seed runner targets only project-local Docker DB, with no remote URL input.
- Validation: lint/typecheck/unit PASS; real DB integration covers repeatability/concurrency, migration drift/rollback, seed preservation, pending-verification default, blank-name rejection, restrict-delete and zero rows for unprivileged SELECT despite explicit table SELECT grants. Final test count recorded after runner exits.
- Final DB runner: 6 tests PASS. Commit `c6c3dd3ad56fadedbc1d4d05880901c03216ebea` PUSHED with remote SHA verified.

### Task 01.5a — Validate empty environment templates in history audit

- Full-history scan after adding the required `.env.example` exposed an overly broad filename rule. The template contains only comments and empty assignments, as required by the Goal.
- Scanner now permits exactly `.env.example` only when every non-comment line is an empty uppercase variable assignment. Nonempty templates and actual `.env`/`.env.local` remain rejected; content patterns still run. No generic example-file exemption.
- Commit `de5af39e80623b4cad76da7534e819ea9139e517` PUSHED and remote verified; 11 Python tests/history audit/lint/typecheck/unit PASS.

## Task 01.6 — Canonical ownership and transactional infrastructure

Acceptance: canonical owners M01-M10 explicit; consumers cannot write a linked domain's canonical records through routing helper; receipts/events/audit support atomic rollback and duplicate constraints; no sensitive event payloads.

- `src/domain/ownership.ts` defines source routing, keeps Place Wishlist separate from M06 Wish, and rejects cross-module canonical writers. This is not actor authorization; server use cases must perform current ACL/lifecycle/business-consent checks independently.
- Migration 0003 adds private deny-by-default command receipt, outbox and audit tables. Receipts scope idempotency to actor/command; outbox also deduplicates source/revision/event type. No arbitrary JSON or secret-content columns in audit/outbox. IDs and events are still private and never broadcast directly.
- Transaction tests prove domain changes/receipt/outbox/audit roll back together, and duplicate commands cannot create a second event. Application command replay/hash comparison and worker retry behavior remain to implement; constraints alone do not constitute completed financial or notification idempotency.
- Lint/typecheck PASS; 4 TypeScript tests PASS. Real DB suite final count recorded after exit. No new P0 claimed.
- Final DB suite: 8 PASS. Commit `8290e13a0f47cd0e97e1aa8a05156d834d27bfa1` PUSHED and remote verified.

## Task 01.7 — Base object permission policy library

Acceptance: private default, no parent grant inheritance, explicit actions, revocation/expiry, mandatory domain guard even for owners, inactive sessions denied and no inferred business consent (M10 D13-D18 foundation).

- Pure policy library evaluates server-loaded identity, resource grants, lifecycle and domain guards. It grants no access from pairing alone, rejects expired/revoked grants and trashed content, and keeps share/trash owner-only in this base policy. Module exceptions need explicit contracts.
- Owner access still requires domain guard, so ownership cannot bypass a sealed-content guard. Domain actions such as approval/seal/reveal are not generic content actions. Relationship guard can stop shared collaboration without disabling personal owner access.
- PASS: lint/typecheck and 13 TypeScript tests, including negative ACL cases. This is a tested foundation only: no API/session/auth-provider integration exists yet, so no claim of security POC or P0 completion.
- Stage 01 remaining gate: hosted CI for browser-enabled workflow still downloading Chromium (run 39929063507, verified active at install step); check authoritative result before claiming full stage exit. Next implementation is Stage 02 local Auth integration, server permission loading, real two-user allow/deny tests and MFA recovery POC.
- Commit `d048d5eef7aa0943fbd8219ab0c97c6af37cef4f` PUSHED and remote master SHA verified; domain file secret scan clean. Hosted browser run still IN_PROGRESS at final check, so Stage 01 is not yet marked DONE.

## Task 01.8 — Local Supabase Auth environment

Acceptance: real local Auth service and SMTP capture inbox, mandatory email confirmation, no real account secrets, separate least-privilege database role, repeatable startup and infrastructure tests.

- Prior browser CI run `39929063507` completed SUCCESS (GitHub API verified). User formatting commit `1a9c571` preserved.
- Added optional `compose.auth.yaml` with GoTrue v2.197.0 and Mailpit, pinned to inspected image digests. Ports bind localhost only: Auth 55433, inbox 55434. No external SMTP service is configured; generated secrets reside only in ignored `.local` files.
- Auth database `ourspace_auth` and login `ourspace_auth_owner` are separate from app schemas, with no superuser/create-role/create-db privileges. Upstream migration needs a conventional `postgres` grantee; provisioned a NOLOGIN/NOSUPERUSER compatibility role without altering vendor migrations.
- Email autoconfirm and anonymous login disabled. TOTP enrollment/verification enabled in local configuration; MFA recovery capability still requires Stage 02 implementation/POC. HS256 signing is a local test choice, not a production signing-key design.
- Commands: `npm run auth:start`, `npm run test:auth-env`, `npm run auth:stop`. Repeated startup preserves database and generated keys. Never delete `.local` secrets while keeping initialized volumes; restore both together if recovering this local environment.
- PASS: 3 real environment tests for Auth health/settings, local inbox, and denial of Auth-role reads against app profiles. Lint/typecheck/13 unit tests run before commit. No signup/login/UI or P0 Auth acceptance claimed yet.
- Sources: official Supabase Docker config and Auth README consulted (https://github.com/supabase/supabase/blob/master/docker/docker-compose.yml, https://github.com/supabase/auth). Runtime health confirms GoTrue v2.197.0. No production or paid service started.
- Commit `d2aecc19eac31c1f76652d756bcc1c1a5d78311c` PUSHED and remote SHA verified. CI run `39984382466` completed SUCCESS, including desktop/mobile, migrations and Auth environment tests. Stage 01 exit met; no business P0 completion implied.
- Initial automatic approval incorrectly applied the superseded branch rule; re-read user objective lines 11/120-123 proved direct master authorization. Retry was approved, with no bypass or alternate remote.

## Task 02.1 — Verified email/password provider transport

Acceptance: real Auth provider signup requires email confirmation; two independent users can confirm through local SMTP and log in; incorrect credentials/token denied; no provider detail leaks, cached responses or browser token persistence. Related M10 D01/D09 foundation.

- Added server transport with HTTPS (loopback HTTP only for local), bounded requests, sanitized errors, input validation and explicit confirmed-email identity checks. Signup intentionally returns no ID or account-existence details.
- Real integration performs signup → denial before confirmation → retrieves local capture email → follows actual provider verification URL → login/get-user for A and B → rejects wrong passwords/invalid token. It uses generated credentials and `.test` addresses only; these are local ephemeral test records, never source fixtures with passwords.
- Found and fixed Auth runtime search_path during real signup. Keep `public, auth` to preserve existing vendor migration ledger resolution and find auth tables. No database was dropped or vendor migration edited. Local-only email limit is 100/hour to permit repeated capture tests; not a production policy.
- Integration PASS against GoTrue, without mocks. Application session revocation, API routes/UI, MFA/recovery, pairing and object ACL remain outstanding; transport identity validation alone does not prove immediate JWT revocation.
- Commit `d51e4f91f4ccb54c091380aec5e1f43488e2bde6` PUSHED and remote SHA verified. Final checks: lint/typecheck/build, 18 unit tests, real two-user Auth integration and 3 environment tests PASS. Next task: application-owned revocable sessions and least-privilege server database adapter, followed by login/signup UI and two-browser E2E.

## Task 02.2a — Private application session storage

Acceptance: M10 D11 storage persists only unique SHA-256 token hashes, constrains expiry/revocation timestamps, preserves account references and denies unprivileged reads even with table SELECT grants.

- Added forward-only migration 0004 with FORCE RLS and no client policies/runtime grants. No raw bearer tokens or provider credentials are stored.
- PASS: local migration; all 9 real PostgreSQL integration tests (including invalid hash, duplicate hash, invalid expiry/revocation and private reads); lint/typecheck; 18 unit tests; 11 requirement/audit tests; diff check and history scanner (no secret findings). Previously reviewed historical media remain explicitly authorized for public release by the user.
- Scope is storage only. Request-time session authentication, immediate revocation enforcement, MFA gating, least-privilege server adapter and UI remain outstanding. No P0 Auth acceptance claimed.
- Git checkpoint BLOCKED: automatic approval review rejected direct master commit/push again after the replacement objective was read in full. Reviewer still applies the original codex/ourspace-build rule and requires an explicit branch confirmation in conversation. No commit/push command executed, no workaround attempted. Pending branch clarification; retain all tested changes. Task 02.2a is implemented/tested but not committed or pushed. Next task must wait for this Git-first checkpoint.
- Branch blocker resolved by explicit user reply: confirmed direct commit/push to master. Proceed with the tested checkpoint; original feature-branch instruction is superseded.
- Commit 14b7c7ca834400e15d1d8e91137a5f461335502e PUSHED; HEAD and remote refs/heads/master verified identical. Next: least-privilege server adapter and request-time revocable session enforcement.

## Task 02.2b — Least-privilege PostgreSQL server adapter

Acceptance: separate runtime login, parameterized queries, bounded connection pool, same-connection transaction/rollback, sanitized failures and denial of private table/schema access.

- Added pinned pg 8.23.1, its matching TypeScript definitions, and server-only import protection. Local provisioning generates an ignored runtime password and grants only database CONNECT. No owner credential is used by the adapter.
- Each transaction checks runtime role identity, elevated flags and membership; errors omit SQL, parameters and credentials. Remote database connections require verified TLS; loopback supports local Docker. Client connections are released after success/failure.
- Four adapter integration tests PASS on real PostgreSQL: parameterization/transaction identity, rollback and pool reuse, private table/schema/role denial, sanitized invalid configuration. Vitest resolves server-only to its actual server entry point; database operations are not mocked.
- PASS lint/typecheck/build, 18 unit tests, full npm audit (0 vulnerabilities), diff check, history audit (no secret findings). Prior development dependency audit finding is no longer reported by the current registry advisory response; no unrelated dependency upgrade was performed.
- Added runtime provisioning and adapter tests to CI. Read official driver docs: https://node-postgres.com/features/queries and https://node-postgres.com/features/pooling, plus installed Next server/client boundary documentation.
- Session issuance, verified account provisioning, request authorization and revocation are next; this task grants no application data access and does not complete Auth P0.
- Commit b85bd2e80f61570e7f5d2d005e38664d3a0b0765 PUSHED; HEAD and remote master SHA match. CI result pending.

## Task 02.2c — Database session authentication and atomic revocation

Acceptance: M10 D11 / ENT-M10-14 rejects expired/revoked sessions and non-active accounts; valid caller can revoke only own sessions; revocation and token-free audit commit/rollback atomically; subsequent connections observe denial.

- Added migration 0005 with private revocation records and two narrowly granted SECURITY DEFINER functions. Fixed search_path, qualified tables, revoked PUBLIC execution and no runtime table grants. Server supplies token hash; caller cannot select an actor ID.
- PASS: 10 PostgreSQL integration tests, plus expanded concurrent-revocation check (one success, one no-op, one audit record) and fresh-connection denial; all five non-active account states rejected. Cross-account revoke denied; expired/unknown token denied; transaction rollback restores revocation/audit together.
- PASS: lint/typecheck, 18 unit tests, 4 real adapter tests, diff check/history scan. An initial targeted unittest command used the wrong import root; rerun from scripts succeeded. Prior interrupted patch had only created migration 0005; inspected state and completed remaining edits before testing.
- CI for 14b7c7c (39986480870) and b85bd2e (39987306872) verified SUCCESS.
- PostgreSQL security-definer guidance consulted: https://www.postgresql.org/docs/17/sql-createfunction.html. No session TTL policy introduced: tests use synthetic intervals only.
- Scope: database boundary only. HTTP request integration, session issuance, listing/UI, other-device logout, MFA and account lifecycle invalidation remain; no full D11/P0 acceptance claimed.
- Commit 30753a91bfa959c4d848f96a063cbd9018e07eba PUSHED and remote master SHA verified. Next: server session service and verified-login issuance, then HTTP/UI integration.

## Task 02.2d — Provider-signed database session issuance

Acceptance: issue an application session only from a cryptographically verified local provider JWT; derive identity and expiry from signed claims; reject tampering/expiry/issuer/audience/role/anonymous violations; never reactivate deactivated accounts; profile/session/account writes are atomic.

- Initial arbitrary-account-ID issuance draft was rejected by automatic approval review before execution. Replaced it with database signature verification and no caller-selected account ID; safer revised action was approved. No bypass or permission workaround used.
- Migration 0006 uses pgcrypto HMAC for the existing local HS256 Auth configuration. Private verifier table has FORCE RLS and no runtime access; generated local key is loaded over SQL stdin by local Auth provisioning, never committed/logged. Provider token is not persisted. Runtime receives only explicit issuance execution rights.
- Added explicit GOTRUE_JWT_ISSUER: real integration initially exposed absent iss; configured it and retained fail-closed issuer checking. Official references: https://www.postgresql.org/docs/17/pgcrypto.html, https://supabase.com/docs/guides/auth/jwt-fields, https://github.com/supabase/supabase/blob/master/docker/CONFIG.md.
- PASS: 11 PostgreSQL tests including forged signatures, wrong algorithm/issuer/role, expired/anonymous token, missing profile rollback and inactive-account denial. Rechecked denial with unique hashes to exclude duplicate-constraint false positives. Real GoTrue integration confirms two verified users receive correctly bound app sessions; forged subject rejected; runtime cannot read signing key.
- PASS lint/typecheck, 18 unit tests, 4 adapter tests, diff/history scan. No production service or real account credentials used.
- This is the local HS256 security profile, not approval of production signing/rotation. Current provider identity revalidation, MFA gating, server service, cookies/routes/UI and lifecycle-wide revocation remain required before P0 Auth acceptance. No user-facing login endpoint exposed yet.
- Commit 04f05d1aa9089910701d7c7566dada5de8de73dc PUSHED; remote master matches HEAD. Next: server session service with current identity/MFA guard, then HTTP cookies and login UI.

## Task 02.2e — Server session service and password-only MFA guard

Acceptance: verified provider login produces a fresh opaque application token; only its SHA-256 hash reaches storage; identity resolution reloads database state each call; revoke enforces ownership; enabled MFA must deny password-only issuance.

- Added server-only SessionService composing real Auth transport and signed-proof DB issuance. Each login generates 32 random bytes and a UUID. Provider access/refresh tokens are not returned by the service or persisted. Actor lookups are uncached; malformed token resolves to no actor. Cookie expiry hint is conservatively bounded by provider lifetime; database expiry remains authoritative.
- Provider identity includes validated MFA factor metadata; password-only login denies any factor not explicitly unverified. MFA challenge/recovery login flow is still outstanding.
- Real integration PASS: email-unverified denial; two users; repeated independent sessions; revoke own other/current sessions; immediate subsequent denial; cross-account revoke denied. Enrolled and verified a real local GoTrue TOTP factor using an in-memory test authenticator, then confirmed password-only SessionService login is denied.
- PASS lint/typecheck/build, 18 unit tests, real expanded Auth/session integration, diff/history scan. No cookies/routes or product UI exposed yet. Existing-session invalidation on MFA enrollment and lifecycle changes remains required before acceptance.
- Official GoTrue OpenAPI consulted: https://raw.githubusercontent.com/supabase/auth/master/openapi.yaml. Current upstream now documents recovery-code endpoints; verify support against pinned v2.197.0 before choosing custom recovery implementation (earlier absence assumption is not conclusive).
- Commit 6360a63c4440fd8b210bd10eafbbb90a0c83bc97 PUSHED; HEAD and remote master SHA identical. Next: HTTP cookie/auth endpoints and desktop/mobile login flow, followed by full MFA/recovery and session lifecycle.

## Task 02.3 — HTTP authentication boundary

Acceptance: signup requires display name/email verification; login issues only HttpOnly/SameSite cookie; current session is uncached; logout invalidates copied cookies; state-changing requests require configured Origin and reject cross-site fetches; input body is bounded.

- Added Node route handlers for POST signup/login/logout and GET session. Infrastructure configuration is server-only and lazy; failures are sanitized. Cookie has HttpOnly, SameSite Strict, Path /, no Domain, provider-bounded expiry; Secure is enabled for configured HTTPS, with loopback HTTP allowed for local tests. No token is returned in login JSON.
- Signup stores display-name metadata; server validates it again before initial profile provisioning. Existing profiles remain unchanged on subsequent login. JSON streaming limits body to 4096 bytes; malformed/array/null bodies rejected.
- PASS: two real production-server HTTP tests covering full email verification/login/logout, replay of copied revoked cookie, missing/wrong Origin, cross-site requests, malformed/oversized input and unknown action. Auth Playwright traces disabled to avoid capturing ephemeral credentials. Four desktop/mobile scaffold E2E and real Auth/session integration also PASS.
- PASS lint/typecheck/build, 18 unit tests, diff/history scan. CI includes test:auth-http after local Auth setup. Blank server env names added to .env.example; generated runtime credentials stay ignored and are supplied only to the local test server process.
- Limitations: this is HTTP transport, not desktop/mobile Auth UI acceptance. Production HTTPS cookie behavior, rate-limit policy, full MFA/recovery, session listing, password reset and lifecycle invalidation remain. Existing scaffold remains honest about incomplete UI.
- Commit 072dd0e6baeaa1d5c86c83cacfb54b74288ecbfc PUSHED; remote master SHA matches HEAD. Next: accessible signup/login/logout UI and real desktop/mobile flows.

## Task 02.4 — Desktop/mobile account UI

Acceptance: users can register with display name, receive verification instructions, log in only after email confirmation, retain session across reload and log out on desktop/mobile; labeled keyboard-accessible fields, visible errors/busy states and no browser token storage.

- Added /account signup/login/logout interface with Vietnamese labels, autocomplete hints, native input validation, accessible status/alert messages, disabled submission while pending, focus indicators and responsive form sizing. Home now links to the working account flow and accurately states remaining features are unfinished.
- PASS real Chromium desktop and Pixel 7 flows: browser signup, refusal before verification, actual Mailpit verification link, browser login, authenticated reload, logout/reload, HttpOnly invisibility in document.cookie, empty local/sessionStorage, no browser exceptions or horizontal overflow. No mocked auth/network.
- PASS both HTTP security tests and four desktop/mobile scaffold checks (8 Playwright cases total), lint/typecheck/build and 18 unit tests. Fixed initial Next Link lint error and scoped alert assertion to the account form to exclude Next route announcer; reruns passed.
- Inspected desktop/mobile screenshots of the empty login form in ignored .local/auth-desktop.png and .local/auth-mobile.png; no credentials captured. Diff/history scan clean.
- This completes the basic email/password UI slice only. MFA/recovery, reset password, session management screen, pairing and remaining Stage 02 acceptance are still outstanding. No claim of full M10 or P0 Auth completion.
- Commit 2a59ea80c6cf8f8fddc8be0df377c200c935abb1 PUSHED; remote master SHA verified. Next: session listing/revoke-other-devices and MFA/recovery capability verification against pinned Auth.

## Task 02.5a — Session management backend

Acceptance: M10 D11 own-session listing without secrets; revoke a selected own session or all other active sessions; preserve current session; isolate accounts and audit revocations atomically.

- Added narrowly granted list_sessions/revoke_other_sessions database functions, SessionService methods and authenticated HTTP endpoints. Listing returns only ID, creation/expiry/revocation timestamps and current-session flag. Other-session revocation uses one transactional update/audit operation and excludes expired/revoked/current sessions.
- PASS real integration: independent sessions, own-session/current flag, repeat revoke-other no-op, immediate denial, account A cannot list/revoke account B. Real HTTP test uses independent cookie contexts, verifies exact listing fields and rejects subsequent list/session requests from the revoked context.
- PASS 11 PostgreSQL tests, expanded Auth integration, 4 Auth HTTP/desktop/mobile cases, lint/typecheck/build, 18 unit tests, diff/history scan. No runtime table grants added.
- GitHub CI verified SUCCESS for 30753a9, 04f05d1, 6360a63, 072dd0e and 2a59ea8 (latest run 40045668349).
- Next task is the session-management screen and desktop/mobile revocation controls. Full D11 still needs that UI and remaining session metadata/lifecycle checks; Stage 02 remains in progress.
- Commit 545dda1ba2c58b28d796eef75a37aab28610df40 PUSHED; HEAD and remote master SHA verified identical. Continue with task 02.5b session-management UI.

## Task 02.5b — Session management interface

Acceptance: desktop/mobile users can inspect own sessions, distinguish current/revoked/expired state, cancel or confirm selected/all-other/current revocation, and return to login after current session ends.

- Added responsive session panel with dates, current marker, refresh, per-session revoke and revoke-other controls. Confirmation cancellation performs no mutation. Expiration display updates periodically; server remains authoritative. Current-session denial/revocation resets account UI without unsafe navigation or stale signed-in state.
- Preserved concurrent workspace formatting changes; unrelated account/page.tsx formatting remains unstaged. Corrected the effect callback structure and internal navigation lint violations before acceptance.
- PASS: full desktop/mobile browser flows now exercise cancel, revoke others, selected revoke and self-revoke, checking independent cookie contexts lose access. All 8 Playwright HTTP/UI/scaffold cases, lint/typecheck/build and 18 unit tests PASS. Diff/history scan has no secret findings.
- Inspected mobile session-management screenshot in ignored .local/sessions-mobile.png. Dates/controls fit; no credentials or real personal data are present. Desktop screenshot also generated for review.
- D11 UI slice is implemented; last-seen metadata, lifecycle invalidation, full MFA/recovery and remaining Stage 02 requirements still need completion. No complete P0 Auth claim.
