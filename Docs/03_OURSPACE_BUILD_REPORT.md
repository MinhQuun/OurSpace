# Our Space — Build Report

Updated: 2026-10-28 (Asia/Saigon). This report records implementation evidence, not product acceptance.

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
| 02 | DONE (POC gate) | Real Auth/MFA/pairing/ACL/storage/realtime security evidence and full regression; see STAGE02_SECURITY_REVIEW.md. Full M10/domain P0 remains later stages |
| 03 | IN_PROGRESS | Own-profile database commands; service/API/UI and remaining shared-platform journeys pending |
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
- Commit 182e9d7bc78e4e4887ffb35d9b83e3ea4c6ef462 PUSHED; remote master SHA matches HEAD. Next: last-seen/session lifecycle coverage and pinned-provider MFA/recovery capability verification.

## Task 02.5c — Last-seen and account-state session invalidation

Acceptance: ENT-M10-13 last-seen reflects successful session use; changing account to a non-active state revokes existing sessions atomically with audit; reactivation cannot resurrect old tokens.

- Added forward migration 0008: last_seen initialized from creation for existing sessions; authenticated lookups update it using trusted database time. Session listing/UI expose last-seen without adding token/hash fields.
- Account state-change trigger permanently revokes outstanding sessions and records account_inactive evidence in the same transaction. Returning state to active does not clear revocations. No account lifecycle UI or deletion workflow is claimed complete by this trigger.
- PASS 12 real PostgreSQL tests, including last-seen movement, deactivate/reactivate denial and no duplicate audit on later state changes; all non-active states still deny lookup. Expanded Auth integration, 4 HTTP/desktop/mobile session-management cases, lint/typecheck/build and 18 unit tests PASS. Diff/history scan clean.
- Function return-shape migration replaces only list_sessions definition, then local provisioning reapplies its explicit grant. No tables or user records dropped; migrations remain immutable after application. Unrelated account/page.tsx formatting preserved unstaged.
- Next: verify pinned-provider MFA/recovery support, implement complete MFA challenge/recovery and security lifecycle handling. Stage 02 remains incomplete.
- Commit 9c91653df64150f46666a40e7a06cb7545a0aa9e PUSHED; HEAD and remote master SHA match. Continue with MFA/recovery provider verification and implementation.

## Task 02.6a — Real TOTP provider transport

Acceptance: enroll a TOTP factor, create challenge, reject incorrect code, verify correct code with same identity and AAL2, reject replay; return sanitized failures and no token logging.

- Added enrollment/challenge/verification methods to AuthProvider with UUID/code/response validation, current identity checks and AAL2 verification after provider validation. Reused the server session response parser. No MFA browser endpoint or storage of provider tokens introduced.
- PASS real GoTrue integration: enrollment, incorrect code denial, correct verification, same user, replay denial and continued password-only application login denial. Lint/typecheck and 18 unit tests PASS; diff/history scan clean.
- Recovery evidence corrected: tagged v2.197.0 OpenAPI omits recovery-codes, but tagged source api.go includes status/generate/verify/regenerate/delete routes. Authenticated status returned 404 with error_code=mfa_factor_not_found, proving no enrolled factor rather than a missing route. Earlier absence inference must not drive a custom implementation.
- GitHub latest release is still v2.197.0 and its release notes explicitly include recovery endpoints. Next task: enable/verify native recovery configuration and test one-use/rotation behavior before integrating full MFA UI.
- Sources: https://raw.githubusercontent.com/supabase/auth/v2.197.0/internal/api/api.go and https://github.com/supabase/auth/releases/tag/v2.197.0. Full M10 D10 remains incomplete.
- Commit 3ccc5884527dceb136a245fdf1a7d5134276851d PUSHED; remote master matches HEAD. Next: native recovery generation/verification/rotation capability and full MFA orchestration.

## Task 02.6b — Native recovery-code provider transport

Acceptance: verified AAL2 required for code generation; status exposes counts only; codes are single-use, concurrency-safe, account-bound and invalidated by rotation; recovered session retains identity and AAL2.

- Enabled GoTrue native recovery enrollment/verification in localhost configuration. Kept provider defaults for count/length/lockout; these are local infrastructure defaults, not newly approved product policy. No custom recovery-code store or provider upgrade needed.
- Added generate/regenerate, status and redemption transport with bounded response/input validation and shared elevated-session identity/AAL2 checks. Plaintext codes live only in method results/test memory, are never logged or persisted by the application; status rejects any unexpected code payload.
- PASS actual pinned GoTrue: AAL1 generation denied; AAL2 generation succeeds; status count decreases on use; replay rejected; simultaneous redemption yields exactly one success; rotation rejects an old unused code and accepts a new code; account B cannot redeem A's code.
- PASS lint/typecheck, 18 unit tests, expanded real Auth/TOTP/recovery integration, diff/history scan. No browser recovery flow or full D10 acceptance claimed.
- Sources: tagged internal/api/recovery_codes.go and internal/conf/configuration.go under https://github.com/supabase/auth/tree/v2.197.0. Next: MFA enrollment/login orchestration with safe pending-state handling, recovery display/acknowledgment and existing-session invalidation.
- Commit fad2d06cec4af2af54971b11130b69ccbc77c483 PUSHED; remote master SHA verified identical. Continue with MFA/recovery application orchestration and UI.

## Task 02.6c — MFA-aware application login

Acceptance: password-only attempts on MFA accounts yield no app session; correct TOTP or unused recovery code yields an account-bound app session; wrong factor/replayed recovery denied; no provider credentials returned to browser.

- SessionService now reauthenticates email/password for each attempt, inspects verified provider factors, challenges an authorized TOTP factor or redeems native recovery, and only then passes the elevated provider proof to DB issuance. Optional factor selection is constrained to the user's verified TOTP IDs.
- HTTP login accepts a validated secondFactor object and returns mfa_required after successful password verification when needed. No pending provider-token cookie, client JWT or persistent password state was introduced; each request is self-contained.
- PASS real integration: missing factor denied, unauthorized factor ID denied, TOTP and recovery app sessions succeed, used recovery rejected. HTTP tests verify mfa_required leaves client unauthenticated, TOTP/recovery set working cookies, replay after logout leaves no valid session.
- PASS lint/typecheck/build, 18 unit tests, expanded Auth integration and all 4 Auth HTTP/desktop/mobile cases; diff/history scan clean. UI second-factor inputs and enrollment/recovery acknowledgment are next.
- Limits: application enrollment must still coordinate DB MFA policy and existing-session invalidation. Direct local provider enrollment in tests is a capability fixture, not a completed product enrollment flow. Full D10 remains incomplete.
- Commit f84134bb1ad2a8da12f79d4063e62f9ae39e963d PUSHED; remote master SHA matches HEAD. Next: second-factor login UI, then MFA enrollment with recovery acknowledgment and lifecycle invalidation.

## Task 02.6d — Desktop/mobile second-factor login

Acceptance: provider-required MFA reveals accessible TOTP/recovery inputs; either method can establish a real app session; used recovery codes remain denied; switching methods clears the code and no credentials persist in browser storage.

- Added progressive second-factor entry after the server's mfa_required response. Each attempt re-sends credentials to the existing server flow; no provider token or password is persisted. Numeric six-digit TOTP input and recovery input have labels, validation and one-time-code autocomplete. Method changes unmount the old code input.
- PASS lint, typecheck, production build and all 4 real Auth HTTP/desktop/mobile cases. Expanded browser tests cover TOTP success, recovery success, method-switch clearing, replay denial with unauthenticated session, no local/session storage and reload clearing. Desktop/mobile screenshots inspected after clearing all credentials; no horizontal overflow.
- Diff/history heuristic scan: no findings across 200 historical blobs. Historical media remains covered by the user's public-release authorization. Unrelated account/page.tsx formatting remains unstaged.
- Stage 02 remains IN_PROGRESS. Product MFA enrollment, recovery acknowledgment, database MFA policy and existing-session invalidation are still outstanding; this task completes only the login UI.
- Commit 525017faa842c116f66cf348cf78ac3ca2d3b1c7 PUSHED; HEAD and origin/master SHA verified identical. Next: MFA enrollment/recovery acknowledgment and database policy/session invalidation.

## Task 02.6e — MFA cancellation/removal provider boundary

Acceptance: cancel unverified enrollment without enabling MFA; removal of verified factors/recovery requires provider step-up; another account cannot remove a factor; removed factors/codes cannot authenticate.

- Added server transport for factor unenrollment and recovery deletion with response validation and existing sanitized error handling. No public application endpoint added before lifecycle coordination is ready.
- PASS lint/typecheck and 2 real provider integration scenarios: cancellation then re-enrollment; repeated cancellation denied; password-only removal denied for both TOTP/recovery; foreign-account removal denied; elevated removal succeeds; deleted recovery code and removed TOTP challenge rejected; fresh identity has no enabled factor.
- Diff/history audit: no findings across 203 blobs; previously authorized media unchanged. Unrelated account/page.tsx formatting remains unstaged.
- Native API behavior verified against pinned source: https://github.com/supabase/auth/blob/v2.197.0/internal/api/mfa.go and https://github.com/supabase/auth/blob/v2.197.0/internal/api/recovery_codes.go.
- UC-M10-10 still requires a durable pending enrollment and recovery acknowledgment before product activation. Provider verification activates its factor immediately, so orchestration must represent that intermediate state explicitly and recover safely after interruptions. App session invalidation is not implied by provider session downgrade. These remain next work; no complete D10 claim.
- Commit ae828a401fd13366fea4ec9f8ba01f95a718c0fb PUSHED; remote master SHA matches HEAD. Next: durable MFA enrollment transitions, recovery acknowledgment and application session invalidation.

## Task 02.6f — Durable MFA enrollment lifecycle schema

Acceptance: product activation requires verification and recovery acknowledgment; one live enrollment per account even under concurrent writes; cancellation/disable can remain resumable; terminal records cannot resurrect; metadata remains private.

- Migration 0009 adds m10.mfa_enrollments with pending/verified/enabled and two-phase cancelling/cancelled, disabling/disabled states. Stores provider factor identity and milestone timestamps only, never tokens, TOTP secrets or recovery values. Immutable identity/milestones and monotonically advancing version protect transition history.
- Database constraints require verified factor and issued/acknowledged recovery before enabling. Partial unique index includes interrupted cleanup states. Terminal records remain preserved; replacement enrollment gets a new ID. RLS FORCE, no policies/runtime grants; authenticated orchestration must supply validated provider proof in the next task.
- PASS 13 PostgreSQL integration cases, then targeted expanded MFA test with two concurrent inserts (exactly one accepted). Covered invalid activation, missing acknowledgment, identity/milestone tampering, RLS denial, blocked replacement during disabling, terminal replay and successful replacement after completion. Local migration applied and checksums verified. Lint/typecheck and diff/history audit PASS (206 historical blobs, no findings).
- Schema is foundational evidence only: provider reconciliation, signed-proof transition functions, session invalidation and desktop/mobile settings flow remain incomplete. Stage 02 stays IN_PROGRESS; no full D10 acceptance claimed.
- Commit 3ff2d16933f914f66884e1000d4233a5ee5bd49e PUSHED; HEAD and remote master SHA verified identical. Next: authenticated enrollment orchestration and app-session invalidation, followed by settings UI.

## Task 02.6g — Atomic application-session revocation on MFA transitions

Acceptance: changing enrollment security state permanently revokes that account's existing application sessions and records the reason atomically; another account remains unaffected; rollback preserves both prior state and sessions.

- Migration 0010 adds mfa_changed revocation evidence and a private trigger for enrollment state transitions. Already revoked sessions are not updated or audited twice. Metadata-only updates leave sessions unchanged. Provider session downgrade is not treated as application cookie revocation.
- PASS all 14 real PostgreSQL integration cases. New case covers forced rollback, two sessions revoked on verification, partner isolation, acknowledgment/activation revocation, disabling/disabled revocation and exact audit count. Lint/typecheck and diff/history audit PASS (209 blobs, no findings). Local migration applied and checksums verified.
- Scope: trigger handles existing session invalidation only. Signed-proof orchestration and issuance policy must still serialize concurrent login/MFA changes and enforce required assurance before the product MFA flow is exposed. No new runtime grants or browser endpoints; Stage 02 and D10 remain incomplete.
- Commit 773cdb5b449212dd27f88349adcf6315826e3b2a PUSHED; remote master SHA matches HEAD. Next: signed-proof enrollment functions and serialized MFA-aware session issuance.

## Task 02.6h — Database MFA assurance at session issuance

Acceptance: a verified live enrollment requires signature-validated AAL2 at database issuance; pending enrollment does not silently enable MFA; login racing verification cannot leave an active password-only session.

- Migration 0011 replaces issuance with the same function signature/grants, adding assurance checks against durable enrollment state. Verified cancellation/disable-in-progress retains the requirement until cleanup completes. Unknown/missing assurance fails closed. Existing provider signature/identity and account-state checks remain.
- Enrollment state transitions update account security_version, sharing the row lock already used by issuance. The transaction that follows verification observes its assurance requirement; issuance that precedes verification is revoked by the transition trigger.
- PASS 14 PostgreSQL cases including expanded signed-token assurance and concurrent login/verification; 2 real Auth provider scenarios after local migration; lint/typecheck and diff/history audit (212 blobs, no findings). Tested pending login, missing/aal1/unknown assurance denial, aal2 issuance, cancellation-in-progress denial and completed cancellation behavior.
- Scope remains local signed-provider profile. Authenticated enrollment mutation functions, safe provider reconciliation, recovery acknowledgment UI and production signing/rotation remain outstanding. Full D10/Stage 02 are not complete.
- Commit f66b68749f50c09cf633a3bf988cc9e6f449d394 PUSHED; HEAD and remote master SHA match. Next: authenticated enrollment mutation functions and provider orchestration.

## Task 02.6i — Authenticated enrollment initiation/status

Acceptance: enrollment initiation requires a valid application session and signed provider identity for the same account; retrying the same request is idempotent; competing enrollment is rejected; status exposes only the caller's metadata.

- Migration 0012 adds begin_mfa_enrollment and current_mfa_enrollment. Actor comes from the session, is compared to verified JWT subject and rechecked after acquiring account lock. A repeated pending enrollment ID returns the same record without version change; another live ID fails. Status omits provider factor identifiers and all secret material.
- Runtime provisioning grants only these two functions, without table access. Local migration and grants applied. PASS 2 expanded real-provider integration scenarios: cross-identity denial, concurrent same-ID retry, different-ID conflict, metadata-only result, revoked-session initiation/status denial and direct-table denial.
- PASS all 14 PostgreSQL migration/integration cases, lint/typecheck, diff/history audit (215 blobs, no findings). User account/page.tsx formatting preserved unstaged.
- No settings endpoint exposed yet. Next: provider-factor binding, verified transition with signed assurance, recovery issuance/acknowledgment orchestration and UI. Full D10 and Stage 02 remain incomplete.
- Commit 1391369f40a66adb69af570c69460136b0a0d60b PUSHED; HEAD and remote master SHA verified identical. Next: authenticated factor binding and verification/acknowledgment transitions.

## Task 02.6j — Versioned factor binding and signed verification transition

Acceptance: only the session's signed identity can bind a factor; bound identity cannot be replaced; verification requires signed AAL2 and current version; concurrent verification changes state once and revokes old application sessions.

- Migration 0013 adds a narrowly granted server function for pending factor binding/verification. Account lock precedes enrollment lock, session is rechecked, version is compared, and verification requires prior binding. Binding retry at current version is a no-op. Verification leaves product state verified, not enabled.
- PASS 3 real provider integration scenarios, including new enrollment/factor binding, stale-version rejection, factor substitution rejection, AAL1 denial, actual TOTP verification, concurrent transition (one success), old-cookie invalidation, fresh MFA login and status verified/version 3 with enabled_at null. Cross-identity mutation denial added and re-run PASS. Local migration/grants applied; lint/typecheck and diff/history scan PASS (219 blobs, no findings).
- Boundary: signed JWT proves identity/assurance, not a specific factor ID. Trusted server orchestration must source factor IDs from authenticated provider responses and check current factor ownership before invoking this function; no public endpoint accepts this mutation yet. Recovery issuance/acknowledgment and interrupted-operation handling remain next, so D10/Stage 02 remain incomplete.
- Commit c5557eb933a6616b05d010da5922cbeb3ad466dc PUSHED; HEAD and remote master SHA match. Next: recovery issuance/acknowledgment transitions and server orchestration.

## Task 02.6k — Recovery acknowledgment gates product activation

Acceptance: verified enrollment cannot activate before recovery issuance; acknowledgment requires the matching issuance receipt, live session, signed same-account AAL2 and current version; concurrent acknowledgment activates once and revokes existing sessions.

- Migration 0014 adds a private SHA-256 receipt digest and a narrowly granted recovery transition function. Issuance records only metadata; acknowledgment matches the digest, records timestamps, enables MFA and clears the digest in one transaction. Same-receipt issuance retry is a no-op. Different issuance is rejected pending an explicit rotation/reconciliation workflow.
- PASS 3 real Auth scenarios with expanded recovery lifecycle: pre-issuance acknowledgment denied, AAL1 denied, real provider code generation, stale version/wrong receipt denied, concurrent acknowledgment exactly one success, session revoked, recovery login succeeds and status reports enabled/version 5 without receipt digest.
- PASS 14 PostgreSQL migration/integration cases, lint/typecheck and diff/history audit (223 blobs, no findings). Local migration and least-privilege grants applied. No codes, JWTs or receipt plaintext written to source/database/report.
- Still required: server orchestration must generate receipt randomness, deliver it only alongside actual provider-generated codes, recheck provider ownership/status and reconcile interrupted delivery/rotation. No browser endpoint exposed yet; D10/Stage 02 remain incomplete.
- Commit f588fa62c2ec8ac2db94aae6274edd3ac3217cd0 PUSHED; HEAD and remote master SHA match. Earlier automatic approval review could not run due to usage limit; retry succeeded without bypassing review. Next: server MFA orchestration with safe resumption and recovery delivery.

## Task 02.6l — Server enrollment and verification orchestration

Acceptance: reauthenticate the current account before setup; resolve factor identity from private DB state; verify against provider; commit verified state and replacement app session together while old sessions are revoked.

- Added server-only MfaService.start/verify. Start serializes application enroll requests with account locking and returns only enrollment/version plus provider TOTP setup material. Verify rejects stale versions before provider mutation, resolves the bound factor internally and checks the verified factor belongs to the same provider identity.
- Migration 0015 provides a caller-scoped bound-factor lookup with an explicit runtime function grant, no table grant. Verification transition and replacement opaque session issuance share one DB transaction. Provider JWTs remain request-local and are not returned or persisted.
- PASS 4 real provider integration scenarios including service enrollment, stale verification rejection, TOTP verification, invalidation of both prior app sessions, valid replacement and revoked-session replay denial. Typecheck and diff/history scan PASS (227 blobs, no findings). Local migration/grants applied.
- Limits: provider side effects cannot roll back with a database transaction. Interrupted initial enrollment must be reconciled before retry; recovery generation/acknowledgment and cancellation are not yet wired into this service. No public route is exposed until these paths are handled. Stage 02 remains IN_PROGRESS.
- Lint completed successfully (exit 0); all task checks above passed.
- Commit 016c26a650cb9f67a27782c5c45ad1859ea23ad4 PUSHED; HEAD and remote master SHA match. Formatter also expanded the edited integration test/service layout. Next: recovery orchestration and interrupted setup reconciliation before settings routes/UI.

## Task 02.6m — Recovery issuance and acknowledgment service

Acceptance: require fresh password/TOTP proof and the bound verified factor; return real provider recovery codes with a random receipt; activate only with matching receipt/current version and replace revoked session atomically.

- Added MfaService.issueRecovery/acknowledgeRecovery. Issuance locks/checks DB state before calling provider, returns plaintext codes only in the explicit one-time result, and persists only receipt digest. Acknowledgment checks provider recovery availability, records activation and issues the replacement opaque session in one transaction.
- PASS 4 real Auth integration scenarios. Expanded service test covers complete start/verify/issue/acknowledge path, wrong receipt denial preserving the current session, successful activation invalidating it, working replacement and actual recovery-code login. Lint/typecheck and diff/history audit PASS (232 blobs, no findings).
- Recovery material/token payloads are not logged, cached or committed. Provider side effects and response delivery still require reconciliation after interruptions; no public endpoint/UI exposed yet. Next: recover safely from lost enrollment/recovery responses and allow cancellation before exposing setup. Stage 02/D10 remain incomplete.
- Commit 79e7a4a7ae141f67098b1433b25394e075b87ad5 PUSHED; HEAD and remote master SHA match. Next: interrupted recovery delivery reconciliation and setup cancellation.

## Task 02.6n — Recovery redelivery invalidates stale acknowledgment

Acceptance: after losing an issuance response, authenticated user can replace the recovery set; old receipt cannot acknowledge new codes; old codes no longer authenticate; current status provides the version needed to resume.

- Migration 0016 and MfaService.replaceRecovery reserve/commit a new receipt digest before provider rotation. A second transaction rechecks the reservation/version and holds the account lock during provider mutation. Thus an older receipt is already invalid even if rotation or delivery fails. Same reservation check is a no-op; stale versions fail before mutation.
- Added authenticated metadata-only service status. Original issuance timestamp is preserved; replacement advances version without falsely enabling MFA. No plaintext recovery store introduced.
- PASS 4 real Auth scenarios, including service issuance/replacement, status resume, old-receipt denial, old-code denial, new acknowledgment and new-code login. Lint/typecheck and diff/history audit PASS (235 blobs, no findings). Local migration and explicit function grant applied.
- Limits: this path replaces an existing provider recovery set. Recovery-set absence after a failed initial generation, interrupted TOTP enrollment, cancellation and full failure-injection coverage remain to be handled before public settings endpoints. Stage 02/D10 remain incomplete.
- Commit a048f475bcdeacbeb23c90dec18bfd8ba2768a77 PUSHED; HEAD and remote master SHA match. Next: provider recovery absence reconciliation and cancellation/resume of interrupted setup.

## Task 02.6o — Reconcile missing provider recovery sets

Acceptance: redelivery can recreate a missing provider set or rotate an existing set, while authentication/network errors remain failures and never imply absence.

- Provider transport recognizes only GET recovery status 404 with exact mfa_factor_not_found as absence. Added optional-status method; ordinary recoveryStatus retains failure behavior. No raw provider error text is propagated.
- Redelivery checks current provider status under its existing account lock/reservation before choosing generate or regenerate. The old receipt remains invalidated before either operation.
- PASS 4 real Auth scenarios: test removes the synthetic user's actual recovery set after app issuance, confirms absence, recreates through service, rotates again, rejects prior codes/receipt and completes activation/new-code login. Invalid token status remains denied. Lint/typecheck and diff/history audit PASS (240 blobs, no findings).
- Remaining before settings endpoints: interrupted TOTP setup reconciliation, cancellation/disable orchestration and broader failure/concurrency coverage. Stage 02/D10 remain incomplete.
- Commit 235b7fd278802c85e215391aa775bbfcd2ed2d9d PUSHED; HEAD and remote master SHA match. Edited service/provider/test files also received formatter layout changes. Next: interrupted TOTP setup and cancellation/disable orchestration.

## Task 02.6p — Cancel unverified TOTP setup

Acceptance: authenticated owner can cancel pending setup, remove only its bound unverified factor, terminate enrollment and replace revoked app session; verified factors cannot use this path; already-removed factor permits reconciliation.

- Added scoped cancellation function and MfaService.cancelPending. Account lock/version check precedes provider cleanup. Provider identity is refreshed under lock; any verified factor denies this low-assurance cancellation path. Terminal enrollment metadata is retained through cancelling/cancelled transitions; replacement app session commits with them.
- Provider identity now exposes validated unverified TOTP IDs to server orchestration. Missing bound factor is treated as completed cleanup after interruption; authentication/provider failures remain errors.
- PASS 5 real Auth scenarios, plus targeted re-run after adding verified-setup cancellation denial. New scenario covers cancellation, old-cookie revocation, empty active status, provider factor removal, fresh setup, external factor removal followed by reconciliation and stale-cookie replay denial. Lint/typecheck and diff/history scan PASS (244 blobs, no findings). Migration/grants applied locally.
- Remaining: orphan initial provider factors when DB binding never committed, cancellation of verified-but-not-enabled setup, full MFA disable and public settings UI. Stage 02/D10 remain incomplete.
- Commit 93d060f813dd695297dd848fa64dff572ba07059 PUSHED; HEAD and remote master SHA match. Next: reconcile orphan setup factors and implement elevated cancellation/disable.

## Task 02.6q — Reconcile orphan unverified TOTP factors

Acceptance: retry setup when provider factor creation succeeded but DB binding did not; remove only the authenticated user's unverified Our Space factors, preserving unrelated factors and refusing verified MFA.

- Provider identity exposes a separately filtered list for unverified TOTP factors with exact Our Space friendly name. Start refreshes identity under the account lock, denies verified MFA, cleans only those unbound factors and then generates/binds new setup material. Existing bound enrollments still require explicit cancellation rather than silent replacement.
- PASS 5 real Auth scenarios, plus targeted expanded test creating an actual orphan Our Space factor and a differently named factor. Retry removes the orphan (challenge denied), leaves the unrelated factor intact, supports cancellation/restart and reconciles missing bound factors. Lint/typecheck and diff/history audit PASS (250 blobs, no findings).
- Next: elevated cancellation/disable with safe recovery after provider-side deletion, then HTTP/settings UI and desktop/mobile evidence. Stage 02/D10 remain incomplete.
- Commit 60673e54939dcf57538199af4f6c1a8d7da63a46 PUSHED; HEAD and remote master SHA match. Next: elevated cancellation and disable, including interrupted provider cleanup.

## Task 02.6r — Authorized resumable MFA removal boundary

Acceptance: removal intent needs a live session plus same-account signed AAL2; finalization after provider cleanup requires signed active identity and the previously authorized random capability; wrong capability/replay fails and old sessions are revoked.

- Migration 0018 adds private removal receipt digest and authorize/finish functions. Authorization chooses cancelling or disabling, clears pending recovery acknowledgment and revokes sessions. Finalization checks active account, signed subject, transitional state and receipt, then clears the receipt and preserves terminal enrollment metadata.
- Finalization can use a fresh password-authenticated provider token plus capability because a deleted TOTP factor cannot supply another challenge. The capability must originate from AAL2 authorization; server orchestration must verify actual provider cleanup before finalizing. No public endpoint is exposed yet.
- PASS 5 real Auth scenarios, including AAL1 authorization denial, AAL2 removal intent, session revocation, wrong receipt denial, actual recovery/TOTP deletion, fresh identity completion, replay denial and subsequent password login. PASS 14 PostgreSQL migration/integration cases, lint/typecheck, diff/history audit (271 blobs, no findings). Local migration/grants applied.
- Preserved intervening user formatting commit d87aa8a. Next: server prepare/resume removal methods with cleanup checks and safe receipt delivery, then HTTP/settings UI. Stage 02/D10 remain incomplete.
- Commit 2452b43a16ea01d92a45bbe3890ff5c396149d3b PUSHED; HEAD and remote master SHA match. Next: server removal prepare/resume orchestration with provider cleanup verification.

## Task 02.6s — Server MFA removal prepare/resume

Acceptance: step-up authorizes removal before provider mutation; capability is checked before cleanup; resume handles already-removed factor; completion checks provider state and rejects wrong/replayed capability.

- Added prepareRemoval/resumeRemoval service methods and a private capability-scoped lookup that locks the account before external cleanup. Prepare accepts TOTP or recovery step-up and returns a random receipt without deleting factors. Resume requires password authentication, receipt and step-up while factors remain; after verified cleanup it finalizes the terminal state. New normal login is required afterward.
- Cleanup removes recovery set before the bound TOTP factor, then rereads identity/status to prove both absent. Provider failures roll back DB finalization; the previously committed capability remains available for retry. No raw provider token is persisted/returned.
- PASS 6 real Auth integration scenarios and a targeted expanded re-run covering enabled-MFA disable with recovery cleanup plus verified-setup cancellation resumed after external TOTP removal. Wrong receipt/replay denied, old sessions revoked, normal login works after completion. Lint/typecheck and diff/history audit PASS (275 blobs, no findings). Migration/grants applied locally.
- Remaining before HTTP/UI exposure: deliver removal receipt safely across requests and recover from losing the prepare response before provider mutation; complete error mapping and browser desktop/mobile flows. Stage 02/D10 remain incomplete.
- Commit 5cee3b3310264ab2ebbf5297ac7ff3bc1f6b5eae PUSHED; HEAD and remote master SHA match. Next: lost prepare-response recovery and safe removal receipt transport, then MFA settings routes/UI.

## Task 02.6t — Renew lost removal-prepare response

Acceptance: while provider factor remains, user can log in with MFA and reauthorize a pending cancellation/disable; a new receipt invalidates the old receipt and preserves intent/current-version checks.

- Migration 0020 permits AAL2-authorized receipt replacement in cancelling/disabling states. Service prepareRemoval supports those states after a fresh password/second-factor check. Same-state renewal preserves lifecycle intent and advances version; terminal states remain excluded.
- PASS 6 real Auth scenarios. Removal service test now loses/replaces the prepare capability for both cancellation and disable, proves old receipt denial, then completes with the new receipt (including cleanup already completed at provider). Lint/typecheck and diff/history audit PASS (280 blobs, no findings). Local migration applied; function signature/grant preserved.
- Scope: renewal requires the factor still available for step-up. The next HTTP task must deliver a durable HttpOnly removal receipt before initiating provider deletion; completed cleanup resumes via that receipt. Full browser workflows remain outstanding; Stage 02/D10 not complete.
- Commit 5f157d9c2c57d08c80235b763bd1012cf8931ff9 PUSHED; remote SHA matches HEAD. Diff check allowed only the existing extra EOF blank line in immutable applied migration 0020; other whitespace checks passed. Next: HTTP MFA actions and durable HttpOnly removal receipt.

## Task 02.6u — MFA HTTP actions and protected receipts

Acceptance: expose authenticated setup/verification/recovery/cancellation/removal actions with same-origin protection; provider tokens and app session tokens never appear in JSON; recovery/removal receipts are HttpOnly cookies and removal cleanup happens only on a subsequent request carrying the receipt.

- Wired MfaService into runtime and Auth route. Added caller-scoped status, setup/verify/issue/replace/acknowledge/cancel/prepare/resume actions, bounded input validation and explicit confirmation flags for acknowledgment/cancellation/removal. Existing origin checks and no-store headers apply throughout.
- Receipts are cookie-scoped to /api/auth, HttpOnly, SameSite Strict and Secure for HTTPS. Prepare delivers receipt and clears the app cookie; resume reads that cookie and clears it after completion. Setup secrets/codes are returned only where required for user enrollment; signed provider tokens and opaque app session tokens remain out of JSON.
- PASS production build, lint/typecheck, all 5 Auth HTTP/desktop/mobile cases. New real HTTP test enables and disables MFA, verifies safe response keys/cookie flags, rejects missing origin and missing confirmation, checks revoked session, resume marker, cleared receipt/replay denial and subsequent login. Diff/history audit clean (284 blobs).
- Receipt cookies currently use browser-session lifetime and survive reloads, not guaranteed browser data clearing/restart; persistent lifetime and recovery-proofing remain security review work. Removal-state GET is only a cookie-presence hint, never authorization. Database conflict failures still return sanitized unavailable pending refined UX handling. Settings UI and full D10 desktop/mobile acceptance remain next; Stage 02 incomplete.
- Commit c87ddc75a6858e22ed266b7b0f5ae9977b942e83 PUSHED; HEAD and remote master SHA match. Next: MFA settings UI, recovery/removal resumption UX and full desktop/mobile lifecycle tests.

## Task 02.6v — MFA settings on desktop and mobile

Acceptance: authenticated users can enroll and verify TOTP, view and acknowledge recovery codes, and prepare/resume MFA removal after reload; sensitive setup material stays out of browser storage and disappears after completion.

- Added /account/security with server-backed lifecycle status, reauthentication forms, explicit confirmation, transient setup key/recovery codes, cancellation/replacement controls and cookie-backed removal continuation. Account page links to security settings. Missing session clears displayed setup material.
- PASS lint, production build, typecheck and all 7 Auth HTTP/browser cases (3 HTTP, 2 desktop, 2 mobile). Real local Auth/browser tests enroll, verify, issue codes, reject acknowledgment without confirmation, enable MFA, prepare removal, reload, finish removal and log in again. Browser storage remains empty and HttpOnly receipts are not visible to JavaScript. Desktop/mobile screenshots inspected; no horizontal overflow.
- Diff check PASS; history/worktree audit scanned 288 blobs with no findings. Historical binary media remains manually reviewed under the owner's public-release authorization; heuristic scanning is not proof of absence of all sensitive content.
- Remaining: QR setup, expanded cancellation/recovery-replacement browser coverage, receipt lifetime/recovery review, refined failure UX and other Stage 02 requirements. This task does not complete D10 or Stage 02. Next: test interrupted setup/recovery replacement through the UI.
- Commit 3f3923e7b937b1ec49a97c2a6bf8f025a74dd506 PUSHED; remote master SHA matches HEAD. Next: interrupted setup/recovery replacement browser acceptance, then remaining Stage 02 work.

## Task 02.6w - Interrupted MFA setup browser acceptance

Acceptance: after reload loses transient setup material, a user can cancel/restart pending enrollment, replace undisplayed recovery codes and complete MFA. Replaced recovery codes must fail actual login.

- Expanded real browser lifecycle coverage on desktop and mobile: reload pending setup, cancel and restart, verify TOTP, issue codes, reload to hide codes/acknowledgment, replace codes, prove old recovery code rejected from an isolated browser context, then enable and disable normally.
- PASS both expanded browser cases (21 seconds), lint and typecheck. Existing production build used because this task changes only test coverage. Initial test failure was an encoding issue in newly inserted test strings, corrected before the successful run. No application failure observed in these scenarios.
- Stage 02 remains incomplete. Next: QR enrollment support and remaining security lifecycle requirements; preserve full Stage 00-15 scope.
- Diff/history audit PASS: 295 blobs, no findings; historical binary review limitations unchanged.
- Commit 26f0e2821fcb44f1f33e503d7fab0c7a81203198 PUSHED; remote master matches HEAD. Next: QR enrollment support and remaining Stage 02 security requirements.

## Task 02.6x - Local TOTP QR enrollment

Acceptance: render a scannable TOTP QR without external image services, retain manual setup key, and remove QR with transient setup material after reload/completion.

- Added client canvas QR rendering using pinned qrcode 1.5.4; no external QR request or persisted image. QR URI follows the same transient lifecycle as the manual secret. Canvas pixels clear on unmount; manual key remains usable if rendering fails. Library API reference: https://github.com/soldair/node-qrcode.
- PASS lint, build, typecheck and both expanded real desktop/mobile MFA browser scenarios. Independent jsQR decoder reads actual canvas pixels and proves otpauth TOTP payload matches the real provider secret; tests verify QR disappears after reload/completion and continue through recovery replacement, enable and disable. No QR secret was written to screenshots or logs.
- npm install audit reports zero vulnerabilities. Windows optional-package cleanup warnings did not prevent installation/build/tests. Diff reviewed; dependency lock changes correspond to QR encoder/types/test decoder.
- Stage 02 remains incomplete. Next: review remaining MFA recovery/rotation and password reset requirements against M10 before proceeding to pairing/security foundations.
- History/worktree heuristic audit PASS: 297 blobs, no findings; authorized historical binary review caveat unchanged.
- Commit 4700c60bbe212716016668492ad5fe47bf1dc01a PUSHED; remote master matches HEAD. Next: remaining M10 MFA recovery/rotation and password reset requirements.

## Task 02.7a - Password recovery provider transport and capability probe

Acceptance: request recovery without returning account metadata, exchange emailed recovery proof, update only the authenticated identity, reject invalid/later-used proof and old password. This is a server transport task, not completed reset-password P0.

- Added bounded recovery email/token validation and provider recover/verify/password-update methods. Password update has no caller-supplied target account ID and validates returned identity. No HTTP reset endpoint/UI is exposed yet. API reference: https://raw.githubusercontent.com/supabase/auth/v2.197.0/openapi.yaml.
- Real provider probe found a concurrency limitation: two simultaneous exchanges of the same recovery token both succeeded. Sequential replay is denied. Do not rely on provider redemption alone for BR-M10-22 / UC-M10-09. Next application boundary must serialize/consume a token digest before provider exchange and keep recovery intent separate from normal login.
- Targeted real test PASS for known/unknown-email request, invalid proof denial, password change on proven identity, old password rejection, other identity unchanged and later token replay denied. Concurrent probe records supported outcomes without claiming single-use concurrency acceptance. Lint/typecheck PASS.
- Remaining before exposure: application one-time/concurrency guard, expiration evidence, password-change session revocation/security audit, MFA step-up, durable recovery flow, generic response and desktop/mobile UI. Stage 02 and UC-M10-09 incomplete.
- Full Auth integration PASS: 7 scenarios (33.31 seconds). Diff/history heuristic audit PASS: 303 blobs, no findings; historical binary caveat unchanged.
- Commit 37f8fe3a1d814d41e110d3ef85853e19660fd1bf PUSHED; remote master matches HEAD. Next: application recovery token consumption/concurrency boundary before HTTP exposure.

## Task 02.7b - Application recovery token single-consumption boundary

Acceptance: concurrent redemption through separate application service instances permits exactly one provider exchange; replay is denied, consumption cannot be undone by runtime table access, raw proof is not stored.

- Migration 0021 adds a private RLS-forced digest ledger and a narrow SECURITY DEFINER insert-on-conflict function. Runtime receives execute only, no table grants. RecoveryService hashes the proof and commits consumption before calling Auth; no in-memory lock or provider race assumption.
- PASS targeted real PostgreSQL/Auth test: two service instances concurrently exchange one emailed proof, exactly one succeeds, subsequent replay is denied. Invalid provider proof remains consumed; runtime direct read/delete denied. Lint/typecheck PASS; migration and runtime grant applied locally.
- On timeout/failure after committed consumption, user must request a new email proof; this deliberately prevents ambiguous provider side effects from reopening the token. No endpoint/UI is exposed yet. Rate limiting/ledger retention and full recovery intent, expiry, MFA, password mutation revocation/audit remain required before complete reset acceptance.
- Next: credential-change revocation/security event boundary and recovery session orchestration. Stage 02 remains incomplete.
- PostgreSQL regression PASS: 14 tests (52.781 seconds). Diff/history heuristic audit PASS: 306 blobs, no findings; historical binary review caveat unchanged.
- Commit 8123fb4c6b2edd8d5f687ac26fb3a6300cedb77c PUSHED; remote master matches HEAD. Next: credential-change revocation/audit and recovery orchestration before HTTP exposure.

## Task 02.7c - Credential session invalidation boundary

Acceptance: signed identity invalidates only its own sessions, writes a private security event atomically, and pre-boundary provider tokens cannot issue a new application session. Retrying the same event is idempotent.

- Migration 0022 adds credential invalidation epoch, private security event table and a narrow signed-identity function. It locks the account, enforces AAL2 for active verified MFA, increments security version and revokes sessions with an explicit reason in one transaction. No target account ID is accepted. Same-account event retry is a no-op.
- Session issuance checks signed iat against the cutoff under the same account row lock. JWTs issued in the cutoff second are conservatively rejected; fresh login in a later second succeeds. Existing grants/signatures and MFA checks are preserved.
- PASS targeted real Auth/PostgreSQL test: own session denied on next request, other account unaffected, stale token issuance denied, event replay no-op, event table private and subsequent fresh login succeeds. Lint/typecheck PASS; migration/runtime grants applied locally.
- This primitive records credential session invalidation, not a claim that provider password mutation completed. The next orchestration must coordinate pre/post invalidation around provider mutation, handle failures and prevent refreshed old provider sessions from bypassing recovery policy. No reset HTTP endpoint/UI exists yet; UC-M10-09 and Stage 02 remain incomplete.
- Full Auth regression PASS: 9 real scenarios (35.98 seconds). Diff/history heuristic audit PASS: 311 blobs, no findings; historical binary review caveat unchanged.
- Commit f5bfacb416bde9a7469e32a96baf9ae37451c5c5 PUSHED; remote master matches HEAD. Next: coordinate provider password mutation, recovery proof/MFA and app-session invalidation before API/UI.

## Task 02.7d - Durable credential mutation gate

Acceptance: once credential mutation starts, fresh as well as old JWTs cannot create application sessions until same-account capability completion; wrong identity/receipt and terminal replay are rejected.

- Migration 0023 adds private pending/completed credential change records with one pending change per account. Begin locks account and atomically revokes sessions; session issuance checks the pending record under the same lock. Finish requires signed same identity, matching capability digest and active account, rechecks MFA assurance through invalidation and advances the cutoff before clearing the gate.
- PASS targeted real Auth/PostgreSQL scenario: old session revoked, later fresh password login blocked while pending, foreign identity/wrong receipt denied, actual provider password updated, completion accepted once, fresh new-password login succeeds and old password fails. Lint/typecheck PASS; migration/runtime grants applied locally.
- The database cannot itself prove external provider mutation; server orchestration must verify it before finish. Receipt delivery before mutation, lost-response renewal, MFA recovery and HTTP/UI remain next. No public reset endpoint is exposed. Stage 02/UC-M10-09 remain incomplete.
- Full Auth regression PASS: 10 real scenarios (40.35 seconds). Diff/history heuristic audit PASS: 315 blobs, no findings; historical binary caveat unchanged. Preserved editor formatting in existing integration tests.
- Commit 031e75de36ed7476d52127a4e649c809047a6cf5 PUSHED; remote master matches HEAD. AST comparison confirmed existing test behavior unchanged by formatting. Next: recovery prepare/resume service with receipt delivery before provider mutation.

## Task 02.7e - Recovery prepare/complete service

Acceptance: prepare revokes app sessions without changing provider password, complete validates/locks capability before mutation and verifies new credentials before clearing gate; wrong receipt/replay cause no password change; interrupted provider update is reconcilable.

- Added private pending-change lookup with account-first lock, active identity/capability checks and signed MFA assurance enforcement. RecoveryService.prepare exchanges one-time email proof, performs TOTP/recovery step-up if required, creates a random receipt and opens the durable gate. Internal provider proof must be sealed by the future HTTP transport, never serialized into JSON.
- Complete holds the account lock across provider update and same-account password verification, then finalizes the gate. A denied update (including already-set password after interruption) is not accepted alone: fresh sign-in using the chosen password must succeed for the same identity. Other errors leave the gate pending. No replacement app session is issued automatically.
- PASS real service scenarios: normal reset, recovery after provider was already changed, and TOTP-enabled account reset preserving MFA. Wrong receipt leaves old password intact; terminal replay fails; old app session revoked; normal login with new password (and MFA when enabled) succeeds after completion. Expanded targeted test 8.90 seconds; lint/typecheck/diff check PASS. Migration/runtime grant applied locally.
- Remaining before HTTP exposure: protected proof/receipt transport, expired/lost prepare response recovery, users not yet materialized in app DB, recovery throttling/expiry tests and desktop/mobile UI. Provider refresh-session policy also needs verification. Stage 02/UC-M10-09 incomplete.
- History/worktree heuristic audit PASS: 319 blobs, no findings; historical binary caveat unchanged.
- Commit 18c370dce1072c74fe15973c56a704b288c82ac1 PUSHED; remote master matches HEAD. Next: lost/expired prepare renewal, account materialization and protected reset transport.

## Task 02.7f - Renew a lost password-recovery prepare response

Acceptance: a new valid recovery email proof can replace a pending change receipt without opening the session gate; old receipt is invalidated and the renewed receipt can complete reset.

- Migration 0025 keeps the account lock/assurance checks, rotates receipt digest for the existing pending change and returns that stable ID. RecoveryService uses the returned ID rather than the newly proposed ID. Fresh email proof is still consumed once and MFA step-up remains required by prepare.
- Initial targeted run hit the real provider's recovery email cooldown. Test now respects 60-second cooldown rather than weakening provider configuration. Lint/typecheck/diff check PASS. Migration applied locally; existing grant preserved.
- Remaining: first-login account materialization, protected HTTP proof/receipt transport, token expiry and browser flows. Stage 02 and reset-password P0 remain incomplete.
- Targeted real renewal test PASS (63.71 seconds): distinct new emailed proof, stable change ID, changed receipt, old receipt denied, gate stays closed, old password unchanged until completion, new-password login succeeds afterward. History/worktree heuristic audit PASS: 324 blobs, no findings; historical binary caveat unchanged.
- Commit c7ace5f9ae263b9dea6a0fa52cfe7231440610b1 PUSHED; remote master matches HEAD. Next: recovery for verified accounts before first app login and protected reset HTTP transport.

## Task 02.7g - Recovery before first application login

Acceptance: verified provider identity can reset before an application account/profile has been materialized; existing inactive/deletion states remain unchanged and denied.

- Migration 0026 materializes the signed subject as an active account only when absent, or transitions pending_verification under the account lock. Existing inactive/deletion states fail and transaction rollback preserves them. Profile creation remains normal first-login behavior, using verified provider profile data; reset does not invent a display name or issue a session.
- PASS real Auth service reset before any app login, followed by first successful new-password login and old-password denial. PASS expanded PostgreSQL signed-identity test (12.161 seconds), including all four inactive/deletion states unchanged and zero credential changes created. Lint/typecheck/diff check PASS; migration applied locally.
- Next: protected HTTP proof/receipt transport, recovery expiry/throttling and full desktop/mobile reset flow. Stage 02/UC-M10-09 remain incomplete.
- History/worktree heuristic audit PASS: 328 blobs, no findings; historical binary caveat unchanged.
- Commit 3fda344ff33b30a7c8a4bf0006ee561dda3145f1 PUSHED; remote master matches HEAD. Next: protected HTTP recovery proof/receipt transport and browser reset flow.

## Task 02.7h - Authenticated recovery proof envelope

Acceptance: protect internal provider proof/receipt for future cookie transport, reject tampering/wrong key/wrong origin/expired envelopes and bound cookie payload size.

- Added server-only AES-256-GCM codec using Node crypto, random 96-bit nonce per seal and origin/purpose/version-bound authenticated context. Strict 32-byte base64url key, UUID/receipt/token/expiry validation, canonical encoding and 3800-character envelope bound. Errors never include proof data. This envelope is not an application session and does not replace DB capability checks.
- PASS all 21 unit tests, lint/typecheck/diff check. New tests cover randomized encryption, round trip without plaintext exposure, exact expiry boundary, nonce/tag/ciphertext modifications, cross-origin/wrong-key rejection, malformed/oversized input and invalid configuration. No live credential or persistent encryption key is created by this task.
- HTTP cookie flags/key configuration and expiry capped by actual signed provider expiry remain the next integration task. Current codec accepts explicit caller expiry; route must derive it from trusted provider proof, not client input. Production key rotation/secret management remains a readiness gate. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 332 blobs, no findings; historical binary review caveat unchanged.
- Commit 08e78f16d57d4e0608257dccc088aaa17a8654fc PUSHED; remote master matches HEAD. Next: reset HTTP actions with configured encryption key, signed-proof expiry and protected cookie transport.

## Task 02.7i - Password reset HTTP actions with sealed cookie

Acceptance: request/prepare/complete reset over same-origin bounded JSON requests, keep provider proof/receipt out of JSON, use authenticated encrypted HttpOnly cookie expiring with provider proof, require confirmation and reject missing/tampered cookie.

- Added password-recovery, password-prepare and password-complete actions. Known/unknown email and provider cooldown responses share accepted JSON. Configuration is checked before consuming proof. Prepare seals the internally validated provider token/receipt, uses actual signed JWT exp, sets HttpOnly/SameSite Strict/path-scoped cookie (Secure on HTTPS), and clears the app cookie. Complete requires confirmation and clears both cookies after successful service completion.
- Added server-only RECOVERY_COOKIE_KEY configuration placeholder; tests generate an ephemeral random key for the server process, not a committed secret. Missing/invalid configuration fails closed. No refresh token is stored in cookie; encrypted access token remains subject to DB/provider checks.
- PASS production build, lint/typecheck and targeted real HTTP reset test: CSRF denial, equal known/unknown request response, safe JSON keys/no-store, protected cookie flags/expiry, revoked app session, confirmation requirement, tampered cookie rejection, cleared receipt/replay denial, old password rejection and new password login.
- Remaining: email link landing/custom template and desktop/mobile reset UI, UX for MFA step-up errors, expiry/provider refresh invalidation and abuse controls. HTTP exposure here is local/development; production deployment remains unauthorized. Stage 02/UC-M10-09 incomplete.
- Full Auth HTTP/desktop/mobile regression PASS: 8 cases (47.3 seconds). Diff/history heuristic audit PASS: 335 blobs, no findings; historical binary caveat unchanged. Preserved editor formatting in Auth route.
- Commit 6e46fc6e48d63d2d1e66a84105a0ed523703bcd2 PUSHED; remote master matches HEAD. Next: email recovery landing/template, protected browser reset UI, then remaining Stage 02 security work.

## Task 02.7j - Email landing and browser password reset

Acceptance: scanner GET requests do not consume recovery proof; real email opens reset UI, prepare requires explicit submission, reload preserves the protected completion capability, and desktop/mobile can complete reset and log in with the new password.

- Local GoTrue recovery URL now targets the application landing route. It validates token shape/type and redirects only to a relative reset URL, moves proof into a fragment, and emits no-store/no-referrer. Browser removes the fragment and retains proof only in memory until explicit prepare; encrypted HttpOnly cookie supports reload after prepare. State endpoint exposes only a prepared boolean.
- Added Vietnamese request/prepare/complete/success UI with optional MFA proof, password confirmation and explicit session-revocation consent. No browser storage/provider token exposure. Account page links to recovery.
- PASS production build, lint/typecheck; targeted HTTP/browser checks 3/3; full real Auth HTTP and desktop/mobile regression 10/10 (53.0 seconds). Reviewed both completion screenshots, with no horizontal overflow. Initial UI failures were test navigation races (Email from old account form); test now waits for recovery form before filling.
- Remaining: MFA error/expiry browser paths, provider refresh invalidation, abuse controls and production ingress query redaction/key management. The email landing request still carries the emailed proof in its query; production logging must redact it. Stage 02 and full reset P0 remain incomplete.
- Real provider/service recovery regression PASS: 4 selected tests, 9 unrelated skipped (74.69 seconds), including concurrent consumption and receipt renewal. History/worktree heuristic audit: 341 blobs, no findings; historical binary caveat unchanged.
- Commit 68cd78263032f3673781d08f514ba1a6b4b5c9b1 PUSHED; remote master matches HEAD. Next: recovery error/expiry/MFA browser coverage and remaining Stage 02 security gates.

## Task 02.7k - Recovery rejection and lost-cookie UX

Acceptance: malformed/provider-rejected links explain failure and allow a new email request; missing recovery cookie during completion never reports success, removes password inputs and permits a fresh request.

- Invalid landing marker now displays an explicit error. Completion HTTP 401 clears form data and returns to the request form. Request-new-email control is a local button (disabled while saving), with stale messages cleared.
- PASS production build, final lint/typecheck/diff check. Real desktop/mobile cookie-loss tests PASS: missing cookie denies mutation, proposed password cannot log in, restored still-valid proof can complete. Invalid/rejected email link tests PASS 2/2 after correcting test navigation through the actual email landing URL (initial direct fragment-only navigation did not remount the page). No HTTP mocks used.
- History/worktree heuristic audit PASS: 352 blobs, no findings; historical binary caveat unchanged. Browser-cookie loss is simulated by removing the cookie; this does not claim real provider token-expiry testing. Remaining: timed provider expiry, MFA recovery browser paths, refresh-token invalidation and abuse controls. Stage 02 remains in progress.
- Commit a05df043860efaadb71ebe0942268d1114f27097 PUSHED; remote master matches HEAD. Next: real MFA reset browser flow and provider expiry/revocation checks.

## Task 02.7l - MFA password recovery browser acceptance

Acceptance: actual enabled MFA can reset using TOTP or a one-time recovery code on desktop/mobile; missing MFA cannot advance or replay the emailed token; reset preserves MFA and denies the old password/consumed code.

- Added six real browser cases, with synthetic accounts enrolled/verified/acknowledged through Auth HTTP endpoints before opening actual Mailpit recovery links. Browser selects and submits the second factor and completes password reset. No mocks, secrets, screenshots of codes or provider tokens are persisted.
- PASS 6/6 desktop/mobile cases (38.4 seconds): TOTP reset, recovery-code reset, missing-factor denial; consumed emailed proof rejected on retry; unchanged old password still works with MFA after denied prepare; completed reset requires new password plus MFA, rejects used recovery code and retains enabled enrollment.
- Lint/typecheck/diff check PASS. History/worktree heuristic audit PASS: 355 blobs, no findings; historical binary caveat unchanged. Preserved editor formatting in the test file. Application code/build unchanged in this test-only task.
- Remaining Stage 02 gates include actual provider expiry/refresh revocation and abuse controls. Missing-factor prepare currently consumes the email proof and requires a fresh email, as documented by the UI and tested here. Full Stage 02/P0 is not yet complete.
- Commit 4c6c6ba5fd197f4a990ab3611e35154f6bcdccfb PUSHED; remote master matches HEAD. Next: verify provider refresh revocation and real expiry, then remaining Stage 02 gates.

## Task 02.7m - Provider refresh-session revocation acceptance

Acceptance: completing password reset invalidates earlier provider refresh-token families, including a rotated family, while preserving another account and allowing a fresh login with the new password.

- Added a real Auth/RecoveryService integration case: two independent pre-reset logins, one rotation before reset, actual email proof/prepare/complete, then refresh attempts using original, rotated and second-session tokens. All three return 400; another account and a fresh new-password session still refresh successfully.
- Targeted integration PASS (1 selected, 13 unrelated skipped; 1.97 seconds). Lint/typecheck/diff check PASS. No application code change or production action. No tokens logged/persisted. Existing DB issuance cutoff and per-request application-session revocation remain separate enforcement boundaries; this test proves refresh denial, not immediate cryptographic invalidation of already-issued JWTs.
- Remaining: provider email proof expiry acceptance, abuse controls and other Stage 02 gates. Stage 02 remains in progress.
- History/worktree heuristic audit PASS: 357 blobs, no findings; historical binary caveat unchanged.
- Commit 7b8d3d33f7a6552cf2017af2a6e6e683152570bc PUSHED; remote master matches HEAD. Next: provider email-proof expiry acceptance.

## Task 02.7n - Expired provider recovery proof acceptance

Acceptance: a genuinely expired provider email proof cannot prepare/reset credentials; old credentials remain valid, and a newly issued email proof can complete reset.

- Added real provider integration with a tightly scoped fixture update (matching the fresh synthetic account UUID and email) to age recovery_sent_at by two days in local Auth DB. No clock changes, provider response mocks or runtime privileges added. Test-only connection reads the existing ignored local Auth owner credential and closes in finally.
- Targeted integration PASS (1 selected, 14 unrelated skipped; 2.22 seconds): expired proof denied, old password retained, proposed password denied, distinct fresh email proof succeeds, old password denied after completion. This verifies provider expiry evaluation using an aged persisted timestamp; it does not claim a wall-clock two-day wait or production policy approval.
- Stage 02 remains in progress: abuse controls, invitation/pairing, disconnected/frozen states and two-account object ACL/security POC remain required before Stage 03.
- Lint/typecheck/diff check PASS. History/worktree heuristic audit PASS: 359 blobs, no findings; historical binary caveat unchanged.
- Commit f0157c27accdf990a6a3870bb990c1b11a55f4ee PUSHED; remote master matches HEAD. Next: finish Auth abuse-control review and begin Stage 02 invitation/pairing foundation with D01-D06 invariants.

## Task 02.8a - Pairing invitation persistence and transition constraints

Acceptance: persist only hashed invitation capability; fixed default 48-hour expiry; different inviter/recipient; recipient acceptance precedes creator confirmation; expired and terminal invitations cannot be reused; deny direct runtime access.

- Migration 0027 adds private RLS-forced m10.pairing_invitations with restrictive account references, unique SHA-256 token digest, immutable identity/expiry/accepted-recipient bindings, consent timestamps and monotonically increasing version. Trigger rejects skipped transitions, self-pairing, early expiry and acceptance/confirmation after expiry. Terminal states cannot be reopened.
- Targeted real PostgreSQL test PASS (6.045 seconds), including state/version progression, denial of consumed-before-acceptance, self-pairing, early expiry, reopening consumed state, deleting referenced account and backdated acceptance of an expired invitation. Fresh test DB is isolated and removed afterward. Migration applied locally with checksum verification; lint/typecheck PASS.
- This task is persistence only, with no runtime table grants or public endpoints. Creator identity authorization, active-account/Space checks, audited commands, exact two-member Space activation and concurrency/idempotency are next tasks. A stored consumed state alone is not evidence that pairing P0 works. No data sharing or Space creation is added here; Stage 02 remains incomplete.
- Full PostgreSQL regression PASS: 15/15 (56.710 seconds). Diff check and history/worktree heuristic audit PASS: 361 blobs, no findings; historical binary caveat unchanged.
- Commit a676395a1fb2aafd26161f058467cd04bfcbda05 PUSHED; remote master matches HEAD. Next: Couple Space/membership invariants and atomic consent-based activation, followed by authenticated invitation commands.

## Task 02.8b - Couple Space and membership invariants

Acceptance: a committed Space has exactly two distinct identities matching a consumed invitation; each account belongs to at most one Active Space even under concurrent activation; memberships cannot disagree with parent state or silently replace identities.

- Migration 0028 adds private RLS-forced spaces/memberships with restrictive references, unique invitation binding, two numbered member slots without privileged roles, composite state FK with update cascade and partial unique active membership index. Deferred constraint triggers enforce exact two consenting identities at transaction commit. Identity bindings are immutable; state transitions preserve historical memberships and reject blind reactivation.
- Targeted real PostgreSQL test PASS (4.656 seconds): incomplete/wrong-recipient activation rolls back; two concurrent transactions competing for the same account yield one success and exactly one Space/two members; deletion, third slot and inconsistent state denied; parent disconnecting/frozen transitions synchronize memberships; blind return to active denied.
- Migration applied locally with checksums verified; lint/typecheck/diff check PASS. No runtime grants/API introduced. Actor consent verification and audited command orchestration must enforce account state/current sessions and atomically consume invitation with Space creation. The schema does not grant access to existing Private content, and does not implement disconnect/reconnect business workflows yet. Stage 02 remains incomplete.
- Full PostgreSQL regression PASS: 16/16 (60.825 seconds). History/worktree heuristic audit PASS: 364 blobs, no findings; historical binary caveat unchanged.
- Commit 70f8508ab3e7f8d6264e9893b047fb40c557d8ee PUSHED; remote master matches HEAD. Next: authenticated audited invitation commands and atomic final confirmation/Space activation using minimum-privilege runtime tests.

## Task 02.8c - Authenticated invitation creation command

Acceptance: execute-only runtime can create a 48-hour invitation for the current active session/account outside an Active Space; concurrent same-command retries create one result; audit/outbox/receipt commit or roll back together; no table/token disclosure.

- Migration 0029 adds security-definer create_pairing_invitation with fixed search path, account-before-session locks, live expiry/revocation recheck, active-membership denial and actor-scoped command receipt. Same ID/hash returns current invitation metadata; conflicting request hash fails. A single transaction writes invitation, receipt, redacted audit and outbox. No plaintext invite capability is accepted/stored; caller supplies its hash. Runtime receives only execute permission.
- Targeted PostgreSQL test PASS (5.620 seconds), using a fresh NOLOGIN role with schema usage/function execute only: unknown/pending-verification sessions denied, two concurrent identical calls return same ID, all four persisted counts equal one, table reads denied, mismatched replay rejected, forced failure rolls back and revoked session cannot replay.
- Added active-Space denial to full regression. Migration/runtime grants applied locally; lint/typecheck/diff check PASS. This is an internal command, not a complete invitation API/UI. Token generation/transport, rate limiting, list/revoke/accept/final-confirmation commands and minimum-privilege Space activation remain. Existing receipt replay returns metadata without creating a new invite or Space; Stage 02 remains incomplete.
- Full PostgreSQL regression PASS: 17/17 (66.661 seconds), including active-Space creation denial. History/worktree heuristic audit PASS: 367 blobs, no findings; historical binary caveat unchanged.
- Commit b4288aaa2260353a11505db4ba72eb74bee4b7ff PUSHED; remote master matches HEAD. Next: authenticated invitation inspect/accept/revoke and atomic final confirmation, then token-safe service/API/UI.

## Task 02.8d - Authenticated invitation accept/reject/revoke

Acceptance: only a valid non-creator capability holder may accept/reject; only creator may revoke; accepted recipient cannot be replaced; expired/terminal capabilities deny new actions; replay is idempotent and Accept/Revoke race has a valid terminal outcome.

- Migration 0030 adds execute-only decision command with ordered account locks, current session recheck and invitation row lock. Accept also checks active inviter and absence of Active memberships for both identities. It records recipient consent only, never creates a Space. Reject/revoke terminate the invitation. Actor-scoped command fingerprint, audit and outbox commit with each transition; replay returns current state without duplicating side effects.
- Targeted real PostgreSQL PASS (6.295 seconds): self-accept, non-owner revoke, wrong capability, third-person accept/reject after binding, expired accept and terminal reuse all denied; same receipt replay produces one audit; recipient rejection succeeds; concurrent accept/revoke ends revoked with zero Spaces. Test runs under a temporary execute-only role.
- Migration/runtime grant applied locally; lint/typecheck/diff check PASS. No HTTP/browser functionality claimed. Remaining: final creator confirmation bound to exact recipient, atomic Space activation under runtime, scoped identity inspection, token transport/rate limiting and UI. Stage 02 incomplete.
- Full PostgreSQL regression PASS: 18/18 (78.639 seconds). History/worktree heuristic audit PASS: 371 blobs, no findings; historical binary caveat unchanged.
- Commit 843e3e29079634a497f8c28dd4e3262ef4084dfb PUSHED; remote master matches HEAD. Next: final creator confirmation of exact accepted recipient and atomic runtime Space activation.

## Task 02.8e - Exact-recipient final confirmation and atomic Space activation

Acceptance: only invitation creator with a current session can explicitly confirm the exact accepted recipient/version; both accounts must be active and unpaired; invitation consumption, two-member Space, receipt, audit and outbox commit atomically; retries return the original Space and competing confirmations cannot double-pair a user.

- Migration 0031 adds confirm_pairing with ordered account/session/invitation locks, explicit true confirmation, recipient/version binding, active-account/membership checks and actor-scoped idempotency. It creates the two equal memberships only after recipient acceptance and creator confirmation. Deferred membership-validation trigger now runs with its owner's rights so execute-only runtime can commit without private-table grants; fixed search path and revoked function permissions remain.
- Targeted PostgreSQL PASS (6.679 seconds): wrong actor/recipient/version and missing confirmation denied, forced transaction failure rolls back consumed state/Space/audit, two competing creators sharing one recipient yield one Space, same-command retry returns original ID, one receipt/audit/outbox and two members persist, direct runtime table read remains denied.
- Full PostgreSQL regression PASS: 19/19 (82.259 seconds). Lint/typecheck/diff check PASS. Migration/runtime grant applied locally. History/worktree heuristic audit PASS: 375 blobs, no findings; historical binary caveat unchanged.
- Remaining: scoped identity inspection, service/API with token-safe transport and rate limiting, two-browser pairing UI, disconnect/frozen enforcement and object ACL POC. No browser pairing completion claimed; Stage 02 remains incomplete.
- Commit 599acafb5f6cc073691393871091ebc98275f060 PUSHED; remote master matches HEAD. Next: scoped invitation/partner identity inspection for authenticated service/API/UI.

## Task 02.8f - Scoped invitation and consent identity inspection

Acceptance: authenticated participants can inspect their invitation status; a nonparticipant requires the correct capability for an unexpired pending invitation; accepting binds visibility to participants; no email, token hash or unrelated profile fields are returned.

- Migration 0032 adds inspect/list functions with current session checks and explicit output columns (invitation metadata, participant IDs/display names, Space ID). Capability access ends when pending state ends; participant history remains scoped. Inactive participant display names are hidden; inactive caller cannot inspect. Expired pending states are reported as expired without mutating on read. List is bounded to the most recent 100 owned/accepted invitations; history pagination remains future work.
- Targeted real PostgreSQL test PASS (8.589 seconds), under a temporary execute-only role with three synthetic identities: wrong/absent session or capability denied, pending capability reveals only inviter, unrelated lists empty, accepted recipient visible to creator, third-party old capability denied, exact output-key allowlist, inactive caller denial/name redaction and revoked visibility restrictions.
- No browser/API completion claimed. Next: server service/API carrying invitation tokens safely, bounded request handling/rate controls and desktop/mobile consent flow. Stage 02 remains incomplete.
- Lint/typecheck/diff check PASS. Migration and explicit runtime grants applied locally. History/worktree heuristic audit PASS: 379 blobs, no findings; historical binary caveat unchanged.
- Commit 2a8de59d1074850e368765826bde165a2b501952 PUSHED; remote master matches HEAD. Next: pairing service/API and safe invitation token transport before browser consent workflow.

## Task 02.8g - Server pairing service with real Auth integration

Acceptance: server service hashes opaque sessions/invitation capabilities, validates identifiers and explicit consent, composes authenticated DB commands and completes pairing only after both identities consent; retries preserve result and unrelated/revoked sessions cannot inspect.

- Added server-only PairingService for proposal/create/list/inspect/accept/reject/revoke/confirm. Proposals use random UUID and 256-bit capability; only SHA-256 hashes enter SQL. A retained in-memory proposal enables idempotent creation retry; capability is returned only after DB commit. Decision/confirmation require explicit true consent; final confirmation uses safe integer version and exact recipient. No authorization cache or browser persistence added.
- Real Auth/runtime integration PASS (1 selected, 15 unrelated skipped; 1.89 seconds): three verified account sessions, create retry, private list/inspect denial, token preview, accept consent requirement/retry, third-party token denial after accept, recipient display name, no Space before creator confirmation, same Space on confirm retry, paired-account new-invite denial and revoked-session read denial. Lint/typecheck/diff check PASS.
- Remaining: HTTP transport/CSRF/no-store/body limits, stable client retry proposal handling without storage leakage, sanitized domain-error HTTP mapping, abuse controls and desktop/mobile UI. A lost create response currently requires finding/revoking the metadata-only invitation and creating a new capability; no claim of browser workflow completion. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 383 blobs, no findings; historical binary caveat unchanged.
- Commit e8d90cb5a84038bdb65c38afa37dca216a189417 PUSHED; remote master matches HEAD. Next: pairing HTTP endpoints with protected session/capability transport and meaningful error statuses, then browser UI.

## Task 02.8h - Pairing HTTP transport and sanitized error statuses

Acceptance: pairing routes require current HttpOnly session, same-origin POST and bounded JSON; capabilities are transmitted in POST bodies rather than query strings; consent and participant checks remain server-side; no-store responses and safe error categories.

- Added /api/pairing/{list,create,inspect,accept,reject,revoke,confirm}, composing PairingService from shared server runtime. Only list uses GET. POST enforces Origin/Sec-Fetch-Site, 4096-byte streaming limit, JSON object/type validation and explicit consent. Responses use no-store/Vary Cookie/nosniff/no-referrer. Create generates proposal server-side; lost create response is recoverable through list/revoke/new invitation, not automatic replay of creation.
- Database wrapper retains sanitized error text and adds a strict SQLSTATE category allowlist (denied/conflict/invalid_input; all others unavailable). Pairing returns 400/403/409/503 without SQL or raw provider details. Existing Auth routes keep their prior handling.
- PASS production build, final lint/typecheck/diff check, all 5 database adapter tests (including permission/input/unique-conflict/unavailable classification), targeted real HTTP pairing test (3.5 seconds). Test covers three verified sessions, origin/body/consent denial, capability preview, accepted-recipient scope, wrong confirmer, successful confirmation/replay, paired-account new invitation denial and logout invalidation.
- Preserved editor formatting in existing tests. Remaining: request abuse limits, desktop/mobile pairing UI, invitation history pagination and disconnect/ACL POC. These endpoints are local/development, no production deployment authorized or performed. Stage 02 remains incomplete.
- Full HTTP project regression PASS: 5/5 (13.8 seconds), covering Auth/MFA/reset/pairing. History/worktree heuristic audit PASS: 386 blobs, no findings; historical binary caveat unchanged.
- Commit 7a1975950e37b0f53e15ff7bc8c6e0fdfd95840d PUSHED; remote master matches HEAD. Next: desktop/mobile pairing UI with two-party identity confirmation and safe link handling, then abuse controls and remaining security POC.

## Task 02.8i - Desktop/mobile two-party pairing interface

Acceptance: authenticated users create/revoke invitations, recipients inspect inviter identity and accept/reject, and creator explicitly confirms the accepted recipient before Space creation; capabilities stay out of query strings and browser storage.

- Added /account/pairing with required consent checkboxes, participant names/IDs, invitation states, expiry and explicit refresh. Invitation link uses a fragment removed on opening; capability stays in memory, with lost-link guidance to revoke/recreate. Reload preserves server state, not capability. Account navigation links to pairing.
- PASS lint, production build, typecheck and diff check. Initial React lint findings (effect invocation and render-time ref access) corrected without suppressions. Real Auth/PostgreSQL browser tests PASS desktop/mobile 2/2 (6.6 seconds): independent sessions, consent gates, B acceptance alone does not create Space, A sees B identity and confirms, both see persisted paired state, fragment cleared, no browser storage and no horizontal overflow. Desktop/mobile screenshots inspected locally.
- Remaining: abuse controls, invitation history pagination, fuller negative-path browser coverage, disconnect/frozen workflow and object ACL security POC. UI requires explicit refresh; no realtime pairing claim. Stage 02 and overall P0 remain incomplete.
- History/worktree heuristic audit PASS: 392 blobs, no findings; authorized historical binary caveat unchanged.
- Commit b3dced72f7d42b4e1e745f401fedc36df2bee462 PUSHED; remote master matches HEAD. Next: pairing abuse controls and remaining Stage 02 disconnect/object ACL security POC.

## Task 02.8j - Atomic database pairing request budget

Acceptance: concurrent requests share an account/action budget across sessions and server processes; valid sessions only, bounded private storage, independent revocation budget and deterministic retry interval. Thresholds are deployment security configuration, not new BRD decisions (M10 section 1 / OPEN-M10 security parameters).

- Added migration 0033: private policy and budget tables, forced RLS, execute-only security-definer function with fixed search path. Account comes from session_actor, never caller-supplied identity. One row per account/action; denied requests do not grow rows/counters indefinitely. Missing policy fails closed. No thresholds seeded by migration.
- Real PostgreSQL targeted test PASS (8.167 seconds): eight concurrent calls across two sessions share exactly three allowed requests, separate actor/action remains available, denied retry interval bounded, elapsed window resets, missing policy/invalid/revoked session denied, runtime role cannot read budget table. Expiry uses synthetic aged DB state.
- Integration boundary: HTTP is not wired yet; caller must commit budget consumption before running protected commands so failed business operations still consume budget. Next task: local reviewed policy configuration, runtime grant/service and HTTP 429/Retry-After handling with regression tests. No production abuse protection claim. Stage 02 incomplete.
- Lint/typecheck/diff check PASS. History/worktree heuristic scan PASS: 399 blobs, no findings; authorized historical binary caveat unchanged.
- Commit 02959b206ec6bf5ef76cac2b72fa49cecafd21fc PUSHED; remote master matches HEAD. Next: wire committed request budgets into pairing HTTP with explicit local policy and 429 tests.

## Task 02.8k - Enforce pairing HTTP request budgets

Acceptance: all authenticated pairing actions consume a committed account/action budget before body validation or domain execution; exhausted budget returns no-store 429 with Retry-After, without starving unrelated actions/accounts.

- Added service consumption and route guard for GET list and all six POST actions. Consumption commits separately, so forbidden capability attempts and invalid bodies cannot refund budget. Existing origin/session checks precede budget; business authorization still rechecks session in its own transaction. Missing policy or database failure returns sanitized 503, never bypasses guard.
- Local provisioning grants only the narrow function and inserts evaluation policies if absent: per 60-second window create/accept/reject/confirm 10, inspect 30, list 60, revoke 20. These are local engineering trial values, not approved production thresholds; existing configured policies are preserved. Independent revocation budget avoids inspection exhaustion blocking revocation.
- Applied migration/runtime grants locally. PASS lint, typecheck, production build, diff check and real pairing HTTP + desktop/mobile regression 3/3 (9.9 seconds). HTTP exercises 30 denied inspect attempts followed by 429/positive Retry-After/no-store; same actor list and another actor inspection remain available. Existing consent, CSRF, body limits and logout checks pass.
- Remaining: UI-specific rate-limit messaging, anonymous/edge abuse protection and production threshold review; current account budget does not claim volumetric DDoS protection. Stage 02 disconnect/frozen/object ACL POC and later stages still pending.
- History/worktree heuristic audit PASS: 402 blobs, no findings; authorized historical binary caveat unchanged.
- Commit de53a62a29ea34a72d232a36837f23120bc7d8ce PUSHED; remote master matches HEAD. Editor formatting preserved. Next: rate-limit UI feedback then disconnect/frozen/object ACL foundation.

## Task 02.8l - Pairing rate-limit feedback

Acceptance: HTTP 429 shows a safe Vietnamese retry instruction instead of implying the invitation is invalid; other action budgets and paired state remain usable.

- Added bounded numeric Retry-After handling for POST actions and list, with generic wait fallback for malformed headers. Capability inspection preserves rate-limit errors instead of replacing them with invalid-link guidance. No automatic retries or capability persistence.
- Real desktop/mobile browser tests exhaust create budget using nine invalid requests after initial create, submit through UI, assert wait message and retained paired state, then refresh independently and clear message. PASS 2/2 (7.7 seconds). Initial test locator matched Next route announcer as well; corrected to scope pairing panel, no application suppression.
- PASS final lint/typecheck, production build and diff review. History/worktree heuristic audit: 407 blobs, no findings; authorized historical binary caveat unchanged.
- Stage 02 remains incomplete. Next: disconnect/frozen lifecycle and object ACL security POC; production abuse controls/threshold review remain open.
- Commit 098d79bb6a4259a2e370db228b5c0ba60e2d93fe PUSHED; remote master matches HEAD. Next: M10 disconnect/frozen lifecycle and object ACL foundation.

## Task 02.9a - Immutable disconnect origin and processing window

Acceptance: M10 D33/D34 foundation records the initiating member and authoritative time once, derives the 30-day processing deadline and cannot commit a disconnect record while Space remains Active. No deletion of partner data.

- Migration 0034 adds private forced-RLS space_disconnects with member/Space restrictive FKs, immutable origin trigger, UTC-derived generated deadline and deferred inactive-Space check. Existing lifecycle guard prevents blind reactivation; membership state cascades consistently. No runtime write grant or public endpoint introduced.
- Real PostgreSQL target PASS (4.967 seconds): active-Space insertion denied/rolled back, unrelated initiator denied with transition rollback, atomic record plus Disconnecting/Frozen succeeds, two memberships remain frozen, deadline exactly 30 days under non-UTC session, duplicate/update/delete/reactivation denied, RLS hides records from probe role.
- Initial generated expression using timestamptz arithmetic was rejected by PostgreSQL immutability requirements; corrected to explicit UTC conversion before interval addition. Final lint/typecheck/diff checks PASS.
- Not a completed disconnect workflow: next tasks must add step-up proof, atomic command/audit/outbox/invite invalidation, read scopes and API/UI; D35 scheduler enforcement requires domain implementation later. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 410 blobs, no findings; authorized historical binary caveat unchanged.
- Commit 378c9059c6953ee44b4e8dacdfd8988d203c7a19 PUSHED; remote master matches HEAD. Next: step-up-authorized atomic disconnect command and shared-write security boundary.

## Task 02.9b - Internal disconnect reauthentication guard

Acceptance: disconnect authority must bind a live app session to independently signature-verified provider identity and fresh password evidence, plus fresh MFA when enrollment requires it; refreshed token iat alone cannot prove reauthentication.

- Added internal, ungranted disconnect_actor helper. Locks active actor and live session through caller transaction, checks signed password AMR timestamp, checks AAL2 and fresh MFA AMR for verified nonterminal enrollments. Five-minute freshness is a local security profile requiring production review. No provider token storage. This is not an exposed disconnect command.
- Real PostgreSQL signed synthetic-proof matrix PASS (6.173 seconds): fresh password accepted; missing/old/future/refresh-only AMR, wrong identity/signature, expired proof, missing/stale MFA and revoked session denied; fresh signed TOTP AAL2 accepted. MFA fixture initially reused the session correctly revoked by enrollment verification; fixed fixture to create a fresh session without weakening revocation.
- Lint/typecheck and diff check PASS. Next: verify actual GoTrue AMR including recovery method, integrate atomic unilateral disconnect command/audit/outbox/invite invalidation, then service/API/UI. Synthetic proofs validate database enforcement only, not real provider interoperability. No P0 completion claim; Stage 02 incomplete.
- History/worktree heuristic audit PASS: 413 blobs, no findings; authorized historical binary caveat unchanged.
- Commit b83b102ce6c4ad27b814cdcdfbc5bc237eff44aa PUSHED; remote master matches HEAD. Next: real provider AMR verification before exposing disconnect command.

## Task 02.9c - Real provider disconnect proof compatibility

Acceptance: real local GoTrue password, TOTP and recovery-code proofs pass the internal disconnect guard; password-only proof with verified MFA and revoked app sessions fail.

- Added real provider integration using synthetic verified account and actual MFA enrollment, password login, TOTP challenge and one-time recovery code. Internal helper tested with owner connection without granting it to runtime; no provider proof or code is logged/stored in repository.
- Initial provider test found actual recovery AMR is mfa/recovery_code, not recovery_code. Added migration 0036 replacing helper allowlist using observed provider contract; preserved applied migration 0035. Applied locally and checksum verification passed.
- PASS real provider test (2.58 seconds; 16 unrelated skipped): password before MFA accepted, password-only after verification denied, fresh TOTP and recovery proofs accepted, revoked app session denied. Synthetic signed negative-case regression PASS (6.216 seconds); lint/typecheck/diff check PASS.
- Next: atomic disconnect command with unilateral consent, record/Space transition, invite invalidation, audit/outbox and concurrency tests, then service/API/UI. Stage 02 remains incomplete; no disconnect workflow completion claim.
- History/worktree heuristic audit PASS: 416 blobs, no findings; authorized historical binary caveat unchanged.
- Commit 8d7071615e8f6f9969d937172f4660956c6f2e54 PUSHED; remote master matches HEAD. Next: atomic unilateral disconnect command and concurrency boundary.

## Task 02.9d - Atomic unilateral disconnect command

Acceptance: a current member with fresh signed reauthentication and explicit consent stops an Active Space without partner approval; version checks, processing origin, invitation invalidation, receipt, audit and outbox commit atomically and retries do not duplicate effects.

- Migration 0037 adds ungranted internal disconnect_space command. Locks both member accounts in deterministic pairing order, then reauth/session and Space. Does not require partner active session. Transitions through Disconnecting to Frozen, records immutable 30-day window, revokes pending/awaiting invitations involving either member, writes one audit/outbox event with no private content payload.
- Real Auth/PostgreSQL integration PASS (2.92 seconds, 16 unrelated skipped): real pair and MFA recovery proof, partner logout, false consent/stale version denied, transaction rollback retains Active and no disconnect origin, concurrent identical commands over two DB connections return same Space, Frozen state and stale invite revoked, exactly one audit/event, new conflicting command denied. Existing real password/TOTP/recovery proof checks remain passing.
- Applied migration locally, checksums verified. Lint/typecheck/diff review PASS. No runtime grant or HTTP endpoint yet. Next: execute-only runtime negative tests, shared-write serialization boundary and scoped read/service/API/UI. D35 queued-domain enforcement remains pending domain models/jobs; no full disconnect/P0 completion claim. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 419 blobs, no findings; authorized historical binary caveat unchanged.
- Commit d8a8ae13ca8b762c08dd718fce5791c85e3ffa54 PUSHED; remote master matches HEAD. Next: runtime command authorization/negative tests and shared-write boundary before API/UI.

## Task 02.9e - Execute-only disconnect runtime boundary

Acceptance: runtime can execute authorized disconnect with deferred private-table constraints, while false consent, mismatched proof, stale/revoked session, inaccessible Space and raw table/helper access fail safely.

- Local runtime provisioning grants only disconnect_space(text,text,uuid,uuid,bigint,boolean); disconnect_actor and tables remain ungranted. Existing private schema/RLS boundaries retained.
- Real Auth/runtime integration PASS (3.03 seconds; 16 unrelated skipped): successful concurrent duplicate disconnect now executes through createDatabase with actual restricted runtime login; deferred triggers and idempotency succeed. False consent, stale version, proof from partner, revoked partner session, random nonexistent Space, conflicting command reuse and revoked-session replay denied with sanitized categories. Direct reads of Space/disconnect/invitation/audit tables and direct helper call denied.
- Lint/typecheck/diff review PASS. Migration command rollback, state/invite and exactly-once audit/outbox assertions remain in same integration flow. No API exposure yet. Next: shared-write lifecycle serialization guard and scoped Space service/read/API/UI. Stage 02 and D35 domain integration remain incomplete.
- History/worktree heuristic audit PASS: 422 blobs, no findings; authorized historical binary caveat unchanged.
- Commit 108eda02d439cec25a83b0ba9bfe12422f83b07c PUSHED; remote master matches HEAD. Next: shared-write lifecycle serialization and scoped Space service/API/UI.

## Task 02.9f - Shared-write lifecycle serialization gate

Acceptance: an Active member's shared mutation can retain lifecycle authorization through its transaction; disconnect cannot overtake that transaction, and new writes after Frozen fail. This gate is not object ACL authorization.

- Migration 0038 adds internal lock_active_space_write with deterministic member account SHARE locks, current actor/session recheck and Space SHARE lock held through transaction completion. No public/runtime grant. Future domain commands must call it in the same transaction as object ACL and mutation; separate autocommit checks are insufficient.
- Real Auth/PostgreSQL integration PASS (3.06 seconds, 16 unrelated skipped): owner-side lifecycle probe transaction acquires gate, restricted runtime disconnect is observed actually blocked through pg_blocking_pids, probe commit releases it, disconnect completes and subsequent gate call is denied. Nonexistent Space and direct runtime helper call denied; concurrent disconnect retry/atomic assertions still pass.
- This is a lifecycle-lock POC, not proof that any unimplemented M01-M09 mutation is protected. Object permission, scheduled reveal and actual shared-domain writes still require integration and tests. Next: scoped Space read/service/API/UI and object ACL POC. Stage 02 incomplete.
- Lint/typecheck/diff check PASS; local migration/checksums PASS. History/worktree heuristic audit PASS: 425 blobs, no findings; authorized historical binary caveat unchanged.
- Commit f86382407ed123322d9152b80f5497c389495e08 PUSHED; remote master matches HEAD. Next: scoped Space read/service/API/UI and object ACL POC.

## Task 02.9g - Membership-scoped Space status reads

Acceptance: current members can inspect Active/Frozen lifecycle metadata and processing deadline without table grants or disclosure of private content; revoked/invalid sessions see no rows.

- Migration 0039 exposes explicit list_my_spaces output fields only: Space ID/state/version/created time, partner ID/display name and disconnect/deadline times. Membership and live session determine scope; inactive partner display name redacted. No email, disconnect initiator/reason, content, capability or grant details. Runtime receives only function EXECUTE.
- Real Auth/runtime integration PASS (3.27 seconds, 16 unrelated skipped): each member sees its counterpart and exact field allowlist, Active has null disconnect dates, Frozen has a 30-day window, revoked/invalid sessions return empty, fresh partner login retains Frozen metadata. Existing concurrent disconnect/lock/negative assertions remain passing. Local migration and provisioning applied successfully.
- List is bounded to 100 most recent Spaces; pagination remains future work. Status metadata confers no object read/export permission. Next: Space service and protected API/UI; Stage 02/object ACL POC remain incomplete.
- Lint/typecheck/diff check PASS. History/worktree heuristic audit PASS: 428 blobs, no findings; authorized historical binary caveat unchanged.
- Commit d30f600d7229a2be264a4beed787bde3f90bfecc PUSHED; remote master matches HEAD. Next: scoped Space service with credential/MFA reauthentication, then protected API/UI.

## Task 02.9h - Space service with request-scoped reauthentication

Acceptance: server service lists scoped status and invokes disconnect only after valid identifiers/version/consent, live app session, same-account password and required TOTP/recovery verification; provider proof is never returned.

- Added server-only SpaceService. Uses existing AuthProvider and SessionService, canonical session digest, current provider identity and owned factor validation. Database still independently checks signed freshness, membership and session at commit. Returns only spaceId; list uses explicit typed metadata. No runtime/API wiring yet.
- Real Auth/PostgreSQL integration PASS (4.48 seconds; 16 unrelated skipped): scoped list/revoked-session denial now exercises service, false consent/wrong-account/missing MFA denied, TOTP and fresh recovery-code service retries return exact committed Space ID. Existing atomic initial disconnect and lock-concurrency assertions continue to use runtime DB directly; initial service mutation/browser completion not claimed.
- Lint/typecheck PASS after correcting nullable timestamp test access; diff review PASS. Next: protected HTTP orchestration and direct first-mutation service coverage, then desktop/mobile disconnect UI. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 432 blobs, no findings; authorized historical binary caveat unchanged.
- Commit 600f6392c3a0580e838dfadb5c0c0b2abd8b7f4c PUSHED; remote master matches HEAD. Next: first-disconnect service/HTTP coverage and protected lifecycle API/UI.

## Task 02.9i - Protected Space lifecycle HTTP endpoints

Acceptance: current sessions can list only their Spaces; disconnect requires same-origin bounded JSON, explicit consent and credential/MFA reauthentication, with independent committed abuse budget and no secret response.

- Added GET /api/spaces/list and POST /api/spaces/disconnect; shared runtime now composes SpaceService. Session/Origin/Sec-Fetch-Site guards, 4096-byte body cap, typed factor input, no-store/Vary Cookie/nosniff/no-referrer and sanitized error statuses. Response is only spaceId; credentials/provider proofs are never serialized.
- Migration 0040 extends internal request-policy action allowlist. Local evaluation policies: spaces_list 60/minute and disconnect 10/minute; independent of pairing budgets. Production threshold review remains open. Applied migration/provisioning locally.
- Real HTTP test PASS (3.0 seconds, total 5.1): member Active status, unrelated list empty, origin/false consent/wrong-account/nonmember denial, partner logout, first successful service mutation to Frozen, identical retry, exact safe response, oversized body denial, exhausted budget returns 429/Retry-After while list still works, post-logout list 401. First run used stale production build and returned 404; rebuilt and reran successfully.
- Final lint/typecheck, production build and diff check PASS. History/worktree heuristic audit PASS: 435 blobs, no findings; authorized historical binary caveat unchanged. Next: desktop/mobile Space/disconnect interface and MFA HTTP coverage; object ACL POC and Stage 02 remain incomplete.
- Commit a54c91ede481fdee3fe92f4b1cf88dc68e4f104c PUSHED; remote master matches HEAD. Next: desktop/mobile disconnect UI and MFA HTTP coverage; Stage 02 ACL POC remains pending.

## Task 02.9j - Desktop/mobile Space and disconnect interface

Acceptance: users inspect counterpart/Space identity and lifecycle, explicitly consent and reauthenticate before unilateral disconnect, and both members observe persisted Frozen state and processing deadline.

- Added /account/spaces and account navigation. Displays member-scoped status, counterpart name/ID, Space ID and deadline. Active form explains unilateral stop vs account deletion, 30-day processing and invitation revocation; requires consent, email/password and optional TOTP/recovery input. Credentials are form-local and cleared after submission; command UUID retained in memory per Space/version for retry. Server result is refreshed rather than optimistic state mutation. Handles unauthenticated, no-Space, loading, failure, conflict, MFA-required and rate-limit messages.
- Real two-browser desktop/mobile tests PASS 2/2 (8.7 seconds): existing pairing flow followed by missing-consent no-op, actual password-authenticated disconnect, removed credential form, partner Frozen visibility, reload/deadline, no horizontal overflow and no browser storage. Local desktop/mobile screenshots inspected. MFA browser variants remain for next task; not claimed covered here.
- Lint/typecheck/production build/diff review PASS. Existing styling reused. No content inventory/export/disposition UI claimed; later domain integration and object ACL POC still pending. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 441 blobs, no findings; authorized historical binary caveat unchanged.
- Commit bca56741163f8f8319ec61d1e504fc5f35bed0b9 PUSHED; remote master matches HEAD. Next: MFA/negative-path disconnect browser coverage, then object ACL security POC.

## Task 02.9k - MFA disconnect browser matrix

Acceptance: desktop/mobile disconnect enforces actual account MFA, rejects missing/invalid proof without changing Active state, clears credentials after failure and supports TOTP/recovery completion.

- Parameterized real two-browser pairing/disconnect E2E for password, TOTP and recovery on both viewports. MFA is enabled through real HTTP enrollment, verification, recovery issuance and acknowledgment; no route mocks or fake provider responses.
- PASS 6/6 (33.6 seconds). Each MFA variant first submits without factor (specific MFA-required message), then invalid factor (generic denial), verifies Active remains and password/code fields clear, then submits valid TOTP or recovery code and observes Frozen/deadline in both browsers. Required consent, reload, storage and overflow assertions remain. Password-only path still passes.
- Lint/typecheck/diff check PASS. Production code unchanged; reused preceding production build. Stage 02 still needs object ACL/linked-private-data security POC; full domain D35/disposition work remains future integration. Next: begin object permission foundation against approved contracts.
- History/worktree heuristic audit PASS: 446 blobs, no findings; authorized historical binary caveat unchanged.
- Commit e6f9541191d30aec6c7f6a2f57a527de72d7fdad PUSHED; remote master matches HEAD. Editor formatting preserved. Next: approved object permission contracts and Stage 02 ACL security POC.

## Task 02.10a - Private-default object ACL registry

Acceptance: M10 D13-D18 / BR-M10-34-48 foundation represents object ownership separately from explicit grants, binds grants to actual Space participants, preserves revocation history and does not infer access from links or membership.

- Migration 0041 adds forced-RLS resources and resource_grants with no public/runtime grants. Resource identity/module/kind/owner immutable; new resources have no grants. Conditional mode is explicit metadata for later fail-closed domain checks, not an unlock override. Each role grant binds resource owner, recipient and exact Space through restrictive foreign keys. No content payload/parent inheritance/Space superadmin field.
- Grant roles are editor/contributor/commenter/viewer; owner comes from resource ownership. Role/binding immutable; revoke one-way, history deletion denied, a later explicit grant requires a new record. Active duplicate grant prevented. Domain-specific consent/actions are not modeled as role privileges.
- Real PostgreSQL test PASS (6.110 seconds): default zero grants, immutable owner/module/kind, invalid issuer/Space denial, metadata version increment, actual paired-member grant, role/delete/duplicate denial, no revoked-grant resurrection, explicit replacement retains both records, RLS-hidden resource under probe role.
- This is schema foundation only. No grant-creation command or effective-permission resolver yet; no claim of complete ACL enforcement across domains. Next: scoped read authorization and linked-private-resource POC, then permission mutations/inspector. Stage 02 incomplete.
- Lint/typecheck/diff review PASS. History/worktree heuristic audit PASS: 448 blobs, no findings; authorized historical binary caveat unchanged.
- Commit 49bcadf1d0ad495b22671e26d1338b3162b75c10 PUSHED; remote master matches HEAD. Next: effective read authorization, independent linked-resource checks and ACL security POC.

## Task 02.10b - Current-session object read gate

Acceptance: base read authorization resolves current actor and exact resource grant, denies unknown/private/conditional/deleted resources uniformly, does not inherit another resource's grant, and rechecks revoked sessions/grants.

- Migration 0042 adds internal can_read_resource boolean gate with no public/runtime grant. Standard nondeleted resource owner can read; explicit viewer/commenter/editor grants apply only in their bound Active Space or existing processing-window read scope. Archived/Closed/expired processing is denied by this base gate pending domain disposition rules. Contributor whole-object access is denied until scoped domain resolver exists. No domain action/approval/reveal permission inferred.
- Real PostgreSQL integration PASS (11.501 seconds): conditional owner/recipient denial, standard owner/grantee access, second Private resource stays denied, unknown resource/invalid session same false result, grant revocation immediate, valid Frozen processing read retained, Archived grantee denial while owner retained, deletion and session revocation deny.
- Test uses actual registry/grants/sessions/Space rows, but not a complete linked-resource API yet. Next: authorized payload/list/linked-preview POC with execute-only runtime and count/search leakage checks; grant commands and Permission Inspector remain pending. Conditional/Contributor domain support not claimed complete. Stage 02 incomplete.
- Lint/typecheck/diff review PASS.
- History/worktree heuristic audit PASS: 451 blobs, no findings; authorized historical binary caveat unchanged.
- Commit 88eab7ac126cdab0b2e21660ee1f12dbaeaacfde PUSHED; remote master matches HEAD. Next: execute-only authorized payload/linked-preview/count POC, then permission commands and inspector.

## Task 02.10c - Independently authorized resource references

Acceptance: M10 D15 / BR-M10-37/38/41/42 cross-resource reads require both source and target access, without target IDs/type metadata leaking from a shared parent, and unlink does not cascade-delete domain objects.

- Migration 0043 adds private forced-RLS resource_links with restrictive source/target foreign keys and no permission inheritance. visible_resource_links checks the current-session read gate for both endpoints and returns only authorized target ID/module/kind/relation. No hidden-count/placeholder/private metadata is returned. No public/runtime grant yet; future source-specific APIs must also apply domain restrictions.
- Real PostgreSQL integration PASS (14.953 seconds), using temporary execute-only role: Shared source plus Private target yields empty array like nonexistent source/invalid session; owner sees explicit allowlisted metadata; deliberate target grant exposes one link; revocation restores zero visible links; direct link table read denied. Unlink retains both resource rows. Existing ownership/read/session/lifecycle assertions remain passing.
- Lint/typecheck/diff check PASS. This covers reference metadata, not domain payload/search/export/storage/realtime integration. Next: authority-preserving permission mutations/inspector and payload/count security POC. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 454 blobs, no findings; authorized historical binary caveat unchanged.
- Commit 2b4a028479f1c9b5f3802fdc1747e318667b6b79 PUSHED; remote master matches HEAD. Next: permission mutations/inspector and authorized payload/count POC; Stage 02 remains incomplete.

## Task 02.10d - Atomic owner grant revocation

Acceptance: current owner explicitly revokes one grant with version check; recipients cannot act as owner; access change/receipt/audit/outbox commit together and retries do not duplicate effects.

- Migration 0044 adds internal revoke_resource_grant. Locks current active account/session, exact owned resource and grant, validates consent/version, revokes without deleting history and advances resource revision. Same command/fingerprint replays result; conflicting reuse denied. No public/runtime grant yet. Revocation does not require Active Space because it only narrows access.
- Real PostgreSQL test PASS (18.951 seconds): temporary execute-only role, recipient/invalid session/wrong version/false consent denial, rollback preserves recipient read access, two concurrent identical requests return same grant, read denied after commit, exactly one receipt/audit/outbox and changed-command fingerprint rejection. Prior private/link/lifecycle tests remain passing.
- Lint/typecheck/diff review PASS. No generic role delegation assumed; delegated editor grant management and domain-specific exceptions remain for scoped policy integration. Next: authenticated grant issuance/inspector and runtime/API security POC. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 457 blobs, no findings; authorized historical binary caveat unchanged.
- Commit 9e28f4064a170fff14883bc38a3214f33786a3ef PUSHED; remote master matches HEAD. Next: authenticated grant issuance, Permission Inspector and runtime/API ACL POC.

## Task 02.10e - Explicit domain-policy-controlled grant issuance

Acceptance: owner can grant a supported role to the other active Space member only after explicit consent/version validation; mutation participates in disconnect serialization and receipt/audit/outbox are atomic/idempotent.

- Migration 0045 adds private resource_role_policies and internal issue_resource_grant. Empty policy defaults deny issuance until a domain adapter declares supported whole-object roles. Contributor/conditional resources require dedicated scoped/domain paths; this generic command cannot bypass those constraints. It uses existing lifecycle locks, verifies recipient membership/active account and resource ownership, checks source version/deletion/mode, inserts a new grant and increments revision with audit/outbox.
- Real PostgreSQL integration PASS (25.521 seconds): execute-only probe, missing role policy denied; explicit test M01 diary viewer policy allows owner; recipient acting as owner, self/unrelated recipient, unsupported editor role, stale version and false consent denied; rollback does not grant read; concurrent identical requests return one grant and one receipt/audit/outbox. Earlier revoke/links/read/lifecycle assertions remain passing.
- Lint/typecheck/diff check PASS. No production domain policies or runtime grants seeded, no API exposed. Next: Permission Inspector and domain payload/read/write security POC; domain-specific Contributor and conditional permissions remain incomplete. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 460 blobs, no findings; authorized historical binary caveat unchanged.
- Commit c09200cde72dd9c25c11972494778c2b5e940e23 PUSHED; remote master matches HEAD. Next: scoped Permission Inspector and authorized payload/write/aggregate POC.

## Task 02.10f - Non-enumerating base Permission Inspector

Acceptance: actor can inspect its own base resource access, owner can see source-level denial reason, and unauthorized/private/nonexistent resources have identical empty responses without leaking another user's grants.

- Migration 0046 adds internal inspect_resource_access with explicit resource ID/version, own role, base_read_allowed and reason. It reuses current read gate; owner may inspect its conditional/deleted metadata, while nonowners require current read access. Grant role selection respects exact Space lifecycle/processing scope. No arbitrary subject parameter, content, recipient list or grant history exposed; no runtime/public grant yet.
- Execute-only PostgreSQL probe PASS within ACL integration (29.062 seconds): conditional owner reason with false read, unauthorized/invalid/unknown empty, standard editor role/true read and exact field allowlist, Private target hidden, revoked recipient inspector empty. Base result explicitly does not claim domain-specific action or final content authorization.
- Initial run passed functional assertions but failed cleanup after temporary database removal; corrected role cleanup to use maintenance connection and removed the exact leftover disposable role. Final lint/typecheck/diff check PASS.
- Next: payload/list/count and shared-write POC, then runtime/API/Inspector UI. Stage 02 incomplete; Contributor/conditional domain adapters remain required.
- History/worktree heuristic audit PASS: 463 blobs, no findings; authorized historical binary caveat unchanged.
- Commit ede03dc7cee0e2d502240d54aafacc6a32daa920 PUSHED; remote master matches HEAD. Next: payload/list/count and write security POC, runtime/API and Inspector UI.

## Task 02.10g - Real payload, search and count authorization POC

Acceptance: an execute-only database reader must return only authorized payload rows; private and unknown detail requests produce the same empty response; search/count cannot expose hidden payloads; new requests after revocation lose content immediately.

- Added disposable PostgreSQL payload schema and restricted reader fixture to the ACL integration test. Two synthetic stored documents exercise the production can_read_resource gate before detail/search/list/aggregate responses. Direct table access is denied. This fixture is a security POC, not a production domain model or completed export feature.
- Real PostgreSQL integration PASS (31.929 seconds): owner sees two rows, recipient only explicitly shared row; private detail/unknown/invalid session/private search return identical zero-count empty results; revoked child remains hidden; parent revocation immediately removes list, detail and search payloads. Existing grants, Inspector, lifecycle and link assertions also pass.
- Lint/typecheck/diff check PASS. Runtime/API authorization, Inspector UI, scoped writes, storage and realtime security remain pending. Stage 02 remains incomplete; no domain P0 completion claimed.
- History/worktree heuristic audit PASS: 466 blobs, no findings; historical binary review limitation remains covered by explicit publication authorization.
- Commit 44f07b8ecfe12599374f911dd51ccff31dfafc25 PUSHED; remote master matches HEAD. Next: scoped write authorization and revocation concurrency, then runtime/API/Inspector UI. Stage 02 incomplete.

## Task 02.10h - Transaction-scoped shared object edit guard

Acceptance: shared edits require a live session, Active exact Space, nondeleted standard object and current Owner/Editor role; Viewer, revoked grants, private children, invalid sessions and Frozen Space cannot edit.

- Migration 0047 adds internal lock_shared_resource_edit. It takes the lifecycle locks first, then locks the resource through the surrounding transaction, checks owner membership in the exact Space and the current exact-object Editor grant. No public/runtime execution grant. Domain commands must still enforce editable fields/state and domain-specific consent; this gate cannot authorize Seal, approval, reveal or export.
- PostgreSQL integration PASS (39.249 seconds): execute-only probe allows owner/editor; rejects private child, unknown object/Space, invalid session, conditional resource even for owner, revoked editor, viewer and frozen owner/recipient. Existing payload/read/Inspector/grant/lifecycle assertions pass.
- Lint/typecheck/diff check PASS. Next task must prove concurrent write/revoke serialization with observed blocking and actual payload mutation; this task verifies permission decisions, not the complete concurrency acceptance criterion. Runtime/API/Inspector UI and storage/realtime POC remain pending. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 468 blobs, no findings; approved historical binary caveat unchanged.
- Commit f362b09d35982c25d04ac56b9d60bf1b66ce4944 PUSHED; remote master matches HEAD. Next: observed concurrent payload write/revoke test, then runtime/API and Inspector UI.

## Task 02.10i - Observed payload write/revoke concurrency

Acceptance: an authorized write and grant revocation serialize through transaction end; a request after committed revocation cannot mutate payload; duplicate revocation remains idempotent.

- Extended the disposable PostgreSQL payload fixture with an execute-only edit function calling the production shared edit guard before updating stored content. A persistent psql transaction holds an actual recipient edit open while a second connection runs owner revocation.
- PostgreSQL integration PASS (39.858 seconds): pg_stat_activity confirms the writer is idle inside its transaction; another connection still sees old content; pg_blocking_pids confirms the revoker waits on that exact writer backend. Writer commit persists the edit, revocation then commits, and a subsequent edit fails without changing content. Concurrent replay still returns the original result with one receipt/audit/outbox.
- Lint/typecheck/diff check PASS. Fixture remains a security POC, not a completed M01 editor or production version-history implementation. Next: runtime ACL service/API and Inspector UI, followed by storage/realtime security POC. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 471 blobs, no findings; approved historical binary caveat unchanged.
- Commit 26f05115e823e385cd06149b59cad97b3ba3a8d5 PUSHED; remote master matches HEAD. Next: runtime ACL service/API and Inspector UI. Stage 02 incomplete.

## Task 02.10j - Runtime base Permission Inspector service

Acceptance: server service validates identifiers/session token format, queries current self-access with parameterized SQL, hides private/nonexistent targets identically, and runtime receives only the required inspection function privilege.

- Added server-only PermissionService.inspect and auth runtime wiring. Explicit response fields describe base ACL only; domain conditions remain separate. Canonical opaque tokens are hashed before database use, no cached actor/access result, no arbitrary subject argument.
- Local migrations through 0047 applied with checksum validation; runtime provision now grants inspect_resource_access only, without grants to raw ACL tables or internal read/edit gates.
- Real runtime database suite PASS: 6 tests, including synthetic owner/private outsider/unknown target/unknown session, malformed input rejection, current conditional state and version, revoked session immediately hidden, direct ACL table and internal gate access denied. Synthetic fixture rows cleaned up in finally.
- Lint/typecheck/diff check PASS. No HTTP endpoint or UI completed in this task. Next: authenticated Inspector endpoint and desktop/mobile UI with real HTTP tests. Stage 02 incomplete; domain effective permission resolution, storage/realtime POC remain pending.
- History/worktree heuristic audit PASS: 473 blobs, no findings; approved historical binary caveat unchanged.
- Commit a4ae2767f3f177bc8e36520eef1212be6b4e41ef PUSHED; remote master matches HEAD. Next: authenticated Inspector HTTP endpoint, then UI. Stage 02 incomplete.

## Task 02.10k - Authenticated Permission Inspector HTTP endpoint

Acceptance: current session required; only self-inspection; inaccessible and nonexistent objects have identical responses; sensitive responses are not cached; request budget applies before lookup.

- Added GET /api/permissions/inspect?resourceId=UUID with live session validation, explicit query shape, cross-site rejection, no-store/Vary Cookie headers, generic errors and base ACL response. No arbitrary subject parameter or payload exposure.
- Migration 0048 permits a separate permission_inspect request budget. Local provisioning configures 60 requests/60 seconds for evaluation; production threshold review remains pending. Local migration/checksum validation and runtime provisioning PASS.
- Real HTTP test against production build PASS (1 test, 2.7 seconds): anonymous/revoked 401, owner exact allowlisted metadata, Private/unknown identical 404, malformed/extra subject 400, cross-site 403, no-store and budget 429/Retry-After. Synthetic database fixture removed after test.
- Lint/typecheck/production build/diff check PASS. History/worktree heuristic audit: 478 blobs, no findings; approved historical binary limitation unchanged.
- Next: desktop/mobile Permission Inspector UI. Base ACL is not complete domain effective authorization; storage/realtime POC and further Stage 02 gates remain pending. Stage 02 incomplete.
- Checkpoint: concurrent user commit 29d8c98c99c4eff2615221bebc28a7b7be5aab0d (format code) captured the endpoint, migration and tests plus broader formatting. Preserved without rewriting history. Commit 4ee303a9653d501c2536775c3280866e2369765c contains this task report; PUSHED and remote master verified. Revalidated formatted HEAD: lint/typecheck/build PASS; Inspector HTTP 1/1 PASS (3.0s); heuristic audit 498 blobs, no findings. Next: Inspector UI; Stage 02 incomplete.

## Task 02.10l - Desktop/mobile base Permission Inspector UI

Acceptance: object-scoped UI loads current own role, distinguishes conditional/deleted states, hides inaccessible objects uniformly, clears stale results on refresh and shows login when session is revoked.

- Added /account/permissions/[resourceId] and reusable PermissionPanel using authenticated no-store endpoint. Pending requests are aborted on navigation; results are cleared before each refresh; no browser storage. Existing account styles reused. The object route is ready for links from future domain screens; no technical ID entry form added.
- Production build, lint/typecheck PASS. Real desktop/mobile browser tests 2/2 PASS (4.1 seconds): owner read metadata, transition to conditional state, refresh removes previous allowed result, private/unknown identical message, revoked session shows login and clears role, no horizontal overflow or local/session storage. Synthetic DB fixture cleaned up.
- Final desktop/mobile screenshots inspected in ignored .local/permissions-*.png. Base-role display does not claim complete domain effective authorization or completion of M10 D16; source-screen integration and detailed domain actions remain pending.
- Diff review PASS; heuristic history/worktree audit 498 blobs, no findings; approved historical binary caveat unchanged. Next: grant management runtime/API and security POC storage/realtime. Stage 02 incomplete.
- Commit f95cba0debb97821685afc20994194dde0621398 PUSHED; remote master matches HEAD. Next: permission grant management runtime/API and remaining security POC gates. Stage 02 incomplete.

## Task 02.10m - Owner-only grant management listing

Acceptance: only current authenticated owner can list unrevoked grants for an exact object; recipient/editor cannot enumerate management metadata; revoked history is omitted; owner can identify grants after disconnect for revocation.

- Migration 0049 adds internal list_owned_resource_grants, fixed search path and no public/runtime execution. Explicit fields: grant ID, current resource version, recipient ID, exact Space ID, role and granted time. These are grant declarations, not a claim of current effective domain access. No private content/profile data or revoked history returned.
- Real PostgreSQL integration PASS (45.650 seconds): execute-only owner sees exactly the current editor grant and field allowlist; revoked viewer excluded; editor/invalid session/unknown object/private child yield empty lists; committed revocation removes management row; Frozen owner can still list remaining grant while recipient cannot. Prior ACL/payload/concurrency tests remain passing.
- Lint/typecheck/diff review PASS. Next: wire owner listing and issue/revoke commands to restricted runtime service, then authenticated management API/UI. No delegated editor privilege inferred. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 503 blobs, no findings; approved historical binary caveat unchanged.
- Commit 7814f49f177a5ec3bec0084430af9d5a1d8cded9 PUSHED; remote master matches HEAD. Next: grant management runtime service/API. Stage 02 incomplete.

## Task 02.10n - Restricted runtime grant management service

Acceptance: server validates explicit consent/version/IDs/role and invokes atomic owner-only database commands; runtime has execution privileges only; no fallback policy or direct ACL table access.

- Extended PermissionService with grants/grant/revoke, canonical token hashing and shared ID/mutation validation. Parameterized functions enforce exact ownership, domain role policy, current session/Space and version. Runtime provisioning grants only owner listing and atomic issue/revoke commands; no ACL table/internal write-gate grants.
- Local migrations through 0049/checksums and runtime provisioning PASS. Real Auth/runtime integration PASS within disconnect test (final 5.82s run): missing domain policy denied; temporary synthetic policy permits viewer; recipient cannot grant/revoke; false consent rejected; grant retry returns same ID; recipient reads; owner list exact grant/version while recipient list empty; stale revoke conflicts; revoke retry idempotent; recipient read and owner list empty after revoke. Temporary policy removed in finally; immutable synthetic audit/grant history retained locally as existing Auth fixtures.
- Runtime database suite 6/6 PASS after shared validation refactor. Lint/typecheck/diff review PASS. Next: authenticated management HTTP routes with independent rate budgets/CSRF checks, then consent UI. Stage 02 incomplete; domain policies not seeded as production decisions.
- History/worktree heuristic audit PASS: 506 blobs, no findings; approved historical binary caveat unchanged.
- Commit 39c745acce83683405984120d30c01465ec4c74c PUSHED; remote master matches HEAD. Next: grant management HTTP and consent UI. Stage 02 incomplete.

## Task 02.10o - Authenticated grant management HTTP

Acceptance: current sessions and same-origin mutation requests required; consent, IDs, role and version validated; owner-only commands; bounded JSON; independent budgets; no-cache safe responses.

- Added /api/permissions/grants GET and grant/revoke POST using restricted runtime service. GET exposes only owner-scoped list; POST enforces Origin/Sec-Fetch-Site, JSON body <=4096 bytes, role allowlist, explicit confirmed boolean and version. Database error categories mapped to safe HTTP responses; no raw SQL/credentials returned.
- Migration 0050 adds permission_list/grant/revoke action budgets; local evaluation defaults 60/20/20 per minute, independent from Inspector and each other. Local migration checksum validation/provisioning PASS; production thresholds still require review.
- Extended real paired-account HTTP integration PASS (final 1 test, 5.9 seconds): missing origin 403, false consent/oversized JSON 400, recipient management 403, owner grant/replay, owner-only listing, recipient read, stale revoke 409, revoke removes read/list, rate limit 429 with Retry-After, grant exhaustion does not block revoke replay. Existing pairing/disconnect lifecycle checks still pass. Temporary test domain policy removed; synthetic immutable fixture history retained locally.
- Lint/typecheck/production build/diff review PASS. Next: owner consent UI with server-derived sharing choices; domain source integration and storage/realtime security POC remain pending. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 510 blobs, no findings; approved historical binary caveat unchanged.
- Commit 6c654257207bf3f7220cfade3a8a3e06952e3e49 PUSHED; remote master matches HEAD. Next: owner grant/revoke consent UI and server-derived available sharing options. Stage 02 incomplete.

## Task 02.10p - Server-derived sharing choices

Acceptance: owner receives only an active partner and domain-supported roles for standard undeleted objects without an existing live grant; unrelated actors and absent policy yield no choices. Choices are advisory and issuance must revalidate.

- Migration 0051 adds internal resource_sharing_options with explicit version/Space/recipient ID/display name/role projection. Exact owner session, Active Space, active recipient, standard nondeleted source, declared role policy and no existing live grant required. No public/runtime grant yet. No email or unrelated profile data returned.
- Real PostgreSQL integration PASS (46.013 seconds): execute-only owner receives exact viewer choice/version after policy exists; missing policy, recipient actor, invalid session, unknown object and unrelated child return empty; conditional source and deactivated recipient denied in rolled-back transactions; choices disappear after grant issuance and remain empty after disconnect. Earlier ACL/concurrency tests pass.
- Lint/typecheck/diff review PASS. Next: wire choices to runtime/API and implement owner grant/revoke consent UI. No production domain policy seeded. Stage 02 remains incomplete.
- History/worktree heuristic audit PASS: 515 blobs, no findings; approved historical binary caveat unchanged. Prior commit/push attempt was not executed because automatic approval review hit a usage limit; resuming the same tested task without bypassing review.
- Commit 4eaa521e3a83388daca41c011009d01d3c7303fe PUSHED; remote master matches HEAD. Approval-review interruption resolved on retry. Next: sharing options runtime/API and owner consent UI. Stage 02 incomplete.

## Task 02.10q - Sharing choices runtime and HTTP

Acceptance: authenticated owner can retrieve server-derived sharing choices via restricted runtime; nonowner/unknown targets yield empty choices; endpoint does not cache results and uses bounded account request budget.

- Added typed PermissionService.options and GET /api/permissions/options?resourceId=UUID. Uses existing permission_list budget (shared with grant-list reads), current session, cross-site rejection, strict query shape and no-store response. Runtime receives only resource_sharing_options execution, no table grant.
- Local migrations through 0051/checksums and runtime provisioning PASS. Real paired-account HTTP integration PASS (5.4 seconds): exact partner display name/ID, Space, role and version; recipient/unrelated user/unknown object empty; arbitrary subject rejected; existing grant hides choices; revoke restores choice with revision 3. Previous pairing/grant/revoke/disconnect assertions continue passing.
- Lint/typecheck/production build/diff review PASS. Next: owner grant/revoke consent UI on desktop/mobile. No production domain policies seeded; Stage 02 incomplete.
- History/worktree heuristic audit PASS: 518 blobs, no findings; approved historical binary caveat unchanged. Initial commit attempt was not executed due to approval-review usage limit; retry through the same review succeeded. Commit 6bdecb7e29af076a78f8a7b6f59de178e6c36db2 PUSHED; remote master matches HEAD. Next: owner consent UI. Stage 02 incomplete.

## Task 02.10r - Owner grant/revoke consent UI

Acceptance: owner manages exact-object grants using server choices, explicit confirmation required for each mutation, stale versions do not silently grant, recipient cannot see management controls, and revoke removes recipient access on new requests.

- Added SharingPanel to owner Inspector with server options/current grants and scoped partner display names, required grant/revoke checkboxes, independent attachment/privacy explanation and external-download revocation limitation. Mutation IDs retained in memory per action/target/version for retry; no browser storage or automatic resubmission. Success reloads current Inspector; conflict/denial/rate/network states are explicit; forms reset after attempts.
- Real desktop/mobile two-browser tests 4/4 PASS (6.9 seconds final): missing grant/revoke consent leaves DB unchanged; real source revision change returns conflict, refresh/new consent succeeds; owner sees granted recipient, recipient sees Viewer but no management controls, revoke removes recipient inspection; no horizontal overflow/storage. Existing Inspector session/conditional/privacy tests still pass.
- Initial new conflict assertion failed because generic alert locator matched Next route announcer too; scoped to management region and final suite passed. Final screenshots inspected; scoped checkbox layout corrected and verified. Synthetic immutable fixture history retained locally, sessions revoked and temporary role policy removed.
- Lint/typecheck/build/diff review PASS. History/worktree heuristic audit 523 blobs, no findings; approved historical binary caveat unchanged. No production domain policy seeded or full domain permission completion claimed. Next: remaining Stage 02 security POC for storage/download/realtime and exit-gate review. Stage 02 incomplete.
- Commit dadb1da2d0a5f14e8ed4f8f90295f55332127da8 PUSHED; remote master matches HEAD. Next: storage/download/realtime security POC and Stage 02 exit-gate review. Stage 02 incomplete.

## Task 02.11a - Private binary/source authorization bindings

Acceptance: binary identity binds immutably to its own source object; original/preview keys differ; parent access cannot resolve a Private child file; new resolution after revoke/session invalidation is denied.

- Migration 0052 adds deny-by-default binary_objects metadata (resource FK RESTRICT, purpose, private-backend bucket/key identifier, size/hash) and immutable-update guard. Internal resolve_readable_binary checks current source base ACL, returns no row for unauthorized/unknown binary, and has no public/runtime grant. Domain upload validation/finalization and domain permission checks remain mandatory adapters.
- Real PostgreSQL integration PASS (51.272 seconds): execute-only resolution, distinct original/preview keys, owner access, parent Editor denial, child grant allows both and revocation hides both, invalid/unknown denied, identity rebind denied, raw table denied, owner session revoke hides resolution. Existing ACL/security tests pass.
- Storage design verification: Supabase docs https://supabase.com/docs/guides/storage/serving/downloads describe signed URL revocation via support; direct signed URL delivery cannot serve as our immediate ACL-revocation gate. Retain private Supabase Storage behind an authenticated download proxy that rechecks access per request; never expose backend credentials or signed backend URLs to browsers.
- Lint/typecheck/diff review PASS. This task validates metadata authorization only: no actual byte upload/download or Supabase Storage deployment tested yet. Next: local private Storage adapter and real byte download/revocation POC, then realtime active-channel POC. Stage 02 incomplete.
- History/worktree heuristic audit PASS: 528 blobs, no findings; approved historical binary caveat unchanged.
- Commit 17ac66d4ee8b114698f1a5162dc2420f54060583 PUSHED; remote master matches HEAD. Next: real private Storage bytes and authenticated download proxy POC. Stage 02 incomplete.

## Task 02.11b - Local private Supabase Storage and real bytes

Acceptance: isolated local vendor Storage database, generated ignored credentials, pinned image, persistent bytes, successful server upload/download, denial of public and unprivileged direct access.

- Added compose.storage.yaml with Supabase Storage v1.81.0 pinned to verified digest, separate PostgreSQL/container/network and metadata/byte volumes, loopback-only API 55435. No app DB credentials or exposed database port. Local lifecycle script generates ignored secrets; no cloud services or real data used.
- Real Storage integration PASS (0.231 seconds final): random private bucket; exact binary bytes round trip with short-lived service token; anonymous, anon-role and authenticated-role requests denied direct/public read, signing and upload; listing denied or empty. Test cleans only its own bucket and synthetic bytes.
- First healthcheck resolved localhost to IPv6 while server listened IPv4; fixed to 127.0.0.1. Original waiting compose process ended when replaced; final pinned-image start returned healthy for both services and final integration passed.
- Lint/typecheck/Python compile/diff review PASS. Git history heuristic audit 531 blobs, no findings; new-file heuristic scan no findings; generated secret paths verified ignored. Historical binary approval/caveat unchanged.
- Added local operation instructions. This does not complete domain uploads or ACL-revocable downloads. Next: authenticated download proxy and real-byte revoke POC, then realtime active-channel POC. Stage 02 remains incomplete.
- Commit 031258f8ce3f299ef7e9be9d543cab90befaa808 PUSHED; remote master matches HEAD. Next: authenticated download proxy with real-byte revocation tests. Stage 02 incomplete.

## Task 02.11c - Server-only private Storage transport

Acceptance: actual private Storage bytes read through a trusted server configuration; bounded byte size and SHA-256 verified; unsafe locations/configuration, unauthorized access and cancellation fail closed without exposing provider details.

- Added PrivateStorage transport with server-only import, HTTPS (HTTP loopback only), fixed supported base paths, validated bucket/UUID keys, renewable server credential supplier, no-store fetch, redirect rejection and 30-second timeout. Reads enforce configured size ceiling, exact metadata length and SHA-256 before releasing the buffered result; safe generic errors and response cancellation.
- Real Supabase Storage tests 2/2 PASS (229ms test time): 8,193 random bytes round trip; wrong hash/shorter or longer expected size/over-limit/missing key/path traversal rejected; authenticated non-service credential denied; canceled request rejected; unsafe configuration errors sanitized. Temporary private bucket cleaned through Storage API.
- Lint/typecheck/diff review PASS; changed-file secret heuristic scan no findings. No user credentials, backend URLs or provider headers returned to browser. Local operation doc updated.
- Transport is deliberately not an authorization gate or HTTP endpoint. Next task must apply live source/domain checks around reads; larger-media streaming/range support remains unimplemented. Stage 02 incomplete. Transient next-env.d.ts dev-generation changes were not included.
- History heuristic audit PASS: 536 blobs, no findings; approved historical binary caveat unchanged.
- Commit bc42a67ce91bcd45b78f67db4b7a3c170c321e23 PUSHED; remote master matches HEAD. Next: authorized binary resolution/download proxy and real-byte revoke tests. Stage 02 incomplete.

## Task 02.11d - Live ACL around private binary reads

Acceptance: resolve binary only through current session/source ACL, require separate domain download authorization, recheck after backend read, and withhold bytes after committed grant/session revocation during the read.

- Added BinaryDownloadService with strict session/UUID validation, parameterized execute-only resolver, mandatory domain authorizer (no default allow), and repeat binding/ACL/domain checks after verified Storage bytes. Unauthorized/missing/domain-denied results are uniformly null; no backend identity leaves the service result.
- Runtime provisioning adds only resolve_readable_binary EXECUTE, not raw table privileges. Applied migration 0052 and provisioned local runtime successfully.
- Real PostgreSQL + Supabase Storage integration suite 3/3 PASS (482ms test time): owner bytes, private outsider/unknown denial without fetching, explicit domain denial, recipient grant bytes, actual revoke command committed between initial ACL check and Storage fetch prevents delivery, later recipient request denied, owner still allowed, session revoked during backend read prevents delivery, raw metadata table denied. Synthetic immutable fixture history retained locally; sessions revoked and test bucket/bytes removed.
- M02 BRD section 10 explicitly separates Download from View; mandatory domain authorizer preserves that distinction. Test's explicit POC adapter is not a production M02 canDownload implementation. HTTP endpoint, real domain policies, streaming/range and realtime active-channel proof remain pending; Stage 02 incomplete.
- Lint/typecheck/diff review PASS; changed-file heuristic secret scan no findings. Automatic formatting of transport/test files preserved. Historical scan evidence from preceding task remains applicable to existing history; no history rewrite.
- Commit 219c729d44685c3629b3f4e212662b6613f13516 PUSHED; remote master matches HEAD. Next: domain-aware download endpoint/security POC. Stage 02 incomplete.

## Task 02.11e - Authenticated binary HTTP boundary POC

Acceptance: real HTTP requests use live sessions, dedicated account budget and authorized binary service; no caching/backend URL leakage; unknown/private responses match; revoke and logout affect subsequent HTTP requests.

- Added reusable Web Request/Response binaryDownloadHandler for domain routes. Requires injected domain-authorized service, live SessionService and committed request budget. GET-only, cross-site/foreign Origin denial, single session cookie, strict UUID/no query, unsupported ranges rejected without size disclosure. Successful bounded downloads are octet-stream attachments with no-store, nosniff, same-origin CORP and sandbox CSP; backend response headers/errors never forwarded.
- Migration 0053 adds binary_download budget action; local provisioning sets evaluation default 30/minute without overriding existing policy. Local migrations/checksums and provisioning PASS.
- Real HTTP server + PostgreSQL + Supabase Storage suite 3/3 PASS (511ms): no-cookie401, cross-site/foreignOrigin403, forgedquery400, range416, private/unknown identical404, exact bytes200 even with conditional-cache header, no ETag/location/token/CORS exposure, granted recipient200 then revoked404, budget429 with Retry-After, revoked session401. Existing service mid-read revocation and transport integrity tests remain passing.
- Initial typecheck caught inferred UUID template type in test helper; explicit string annotation fixed it. Final lint/typecheck/diff review PASS; changed-file heuristic secret scan no findings.
- This is a real HTTP security POC and reusable handler, not a public catch-all Next route or complete M02 download workflow. Domain canDownload, large-file/range behavior and user-facing domain links remain for their stages. Next: active-channel realtime revocation POC and full Stage 02 exit-gate review. Stage 02 incomplete.
- Commit ab9a40397b7330d4509f2586d708fba27908c1f8 PUSHED; remote master matches HEAD. Next: realtime active-channel security POC and Stage 02 exit review. Stage 02 incomplete.

## Task 02.12a - Active WebSocket authorization POC

Acceptance: two independent account sessions on real sockets; Private join denied; granted recipient receives server frame; committed revoke blocks next delivery and reconnect; session invalidation closes active channel; parent grant does not authorize Private child.

- Added server-only AuthorizedChannel using pinned ws 8.22.0/types 8.18.2. Exact Origin/session cookie/path gate, required live domain authorization on join and every outbound frame, bounded payload/queue/backpressure, per-client send serialization, safe closure on denial/errors, lifecycle revalidation and 15-second idle authorization recheck. Client writes are explicitly rejected; no arbitrary echo, content polling or cached join capability.
- Real WebSocket + PostgreSQL integration PASS (186ms final): private/unknown/foreignOrigin denied, parent Viewer cannot join Private child, two accounts receive scoped frame, actual permission revoke prevents recipient receiving next frame (4403) while owner receives it, reconnect denied, client write closes1008, revoked owner session closes4403 and no subsequent delivery. Synthetic immutable fixtures remain local with revoked sessions.
- Added explicit guard after asynchronous join authorization for shutdown/capacity changes. Lint/typecheck/diff review PASS; changed-file secret heuristic no findings. npm install audit reported zero vulnerabilities; Windows optional dependency cleanup warnings did not prevent install or checks.
- Transport API verified against official https://github.com/websockets/ws documentation. This is Stage02 read-channel security evidence, not Yjs/Hocuspocus acceptance, CRDT persistence, collaboration writes, awareness or desktop/mobile M01 completion. Those remain Stage05 work. Production domain policy and deployment wiring remain pending.
- Unrelated automatic formatting changes in existing configs/tests are preserved outside this task commit. Next: Stage02 requirement-by-requirement exit review and remaining security gaps. Stage02 not yet marked complete.
- Commit a3687d4c3de391c29c5063c1bfe16574d0d85232 PUSHED; remote master matches HEAD. Next: Stage02 exit review and remaining gaps. Stage02 incomplete.


## Task 02.13 - Aggregate/export evidence and Stage 02 exit

- Extended execute-only fresh-DB payload POC with sum of visible byte lengths and actual COPY CSV output. Shared parent never includes Private child in sum/export; stale saved selection of IDs yields no rows after revoke; owner still exports own rows. This is security boundary evidence, not completed domain export jobs.
- These 19 test lines were captured by concurrent user/editor commit ed9e28016a102f533936aedf7cd15fd8d63eb728 (format code), already on origin/master. Preserved it without rewriting history or recreating the change.
- Final regression: object ACL/aggregate/export test PASS 54.906s; all DB migration/security tests 24/24 PASS 176.016s; Auth integration 17/17 PASS 126.72s; runtime DB 6/6 PASS; HTTP/desktop/mobile E2E 30/30 PASS 2.1m; unit 21/21 PASS; source/registry/audit regression 11/11 PASS. Build/lint/typecheck/Python compile PASS. Storage and active-channel proofs retain passing evidence from immediately preceding tasks.
- History heuristic audit: 569 blobs, no findings; approved historical binaries unchanged. No cloud/prod credentials or production deployment used.
- Added STAGE02_SECURITY_REVIEW.md with gate-by-gate authoritative tests and explicit limits. Stage 02 security POC exit PASS; architecture A remains viable for this scope. This does not accept complete M10, domain permission policies, export workflows, M01 realtime editing, M07 finance or M08 capsule.
- Next ordered stage: STAGE 03 shared platform/M10 journeys. First task: D07/ST-02 own profile fields, source validation and optimistic concurrency, followed by service/API/UI and desktop/mobile negative tests. Avatar/media integration must retain source permissions; no domain AC silently dropped.
- Commit 0b5a979c556e5615c2971c95e454ad0ea1d348de PUSHED; remote master matches HEAD. Stage02 POC gate complete; next task is Stage03 own-profile foundation. Overall M01–M10 P0 goal remains incomplete.


## Task 03.1a - Private own-profile data and atomic updates

Acceptance: M10 D07/ST-02/BR11,14,15: current account reads/updates only its own profile; required Display Name and optional Nickname/Birthday/Bio; stable identity, version conflicts, idempotency and atomic receipt/audit/outbox; no automatic Partner sharing.

- Migration0054 adds nullable nickname/birthday/bio to forced-RLS profiles, immutable user_id/version trigger, read_my_profile with no target-account argument, and update_my_profile bound to current active account/session under locks. Same command/payload replays without rewriting later edits; changed command payload denied; stale version conflicts. Audit/outbox contain identifiers only, not personal fields.
- Technical input ceilings: existing Display Name120, Nickname120, Bio4000 characters; empty optional text clears to null, valid finite date required. No inferred age restriction or sharing policy added. Date fingerprint uses integer days from a fixed date, independent of date formatting.
- Fresh DB tests 2/2 PASS 14.445s final: owner isolation/invalid session, missing/whitespace name, invalid/leap/infinite dates, oversize text, rollback no receipt, concurrent duplicate one result/event, competing versions one winner, old retry does not overwrite, identity immutability/raw-table denial, revoked session rejects replay, repeatable seed preserves data. Local migration0054/checksums PASS.
- Lint/typecheck/Python compile/diff review PASS; changed-file secret heuristic no findings. No runtime grants, API or UI yet; no full D07 completion claimed. Avatar source authorization and field-level sharing remain required tasks. Next: typed profile service/runtime grants with real DB integration, then authenticated API and desktop/mobile forms.
- Commit 094c54dbeef339a66f2fefb6ac56a2d67b7c58ca PUSHED; remote master matches HEAD. Next: profile service/runtime integration. Stage03 and overall P0 goal remain incomplete.

## Task 03.1b - Typed own-profile service and runtime access

Acceptance: service uses parameterized own-profile commands with no target user, date-only birthday serialization, strict mutation validation, safe conflict/retry behavior and execute-only runtime privileges.

- Added server-only ProfileService, wired authRuntime.profile, and granted runtime EXECUTE only on read_my_profile/update_my_profile. Canonical opaque session hashing, exact input key allowlist, UUID/version checks, Unicode code-point limits, real calendar/leap-date validation, trimmed name/nickname and nullable optional fields. Birthday reads are SQL-formatted date strings, not timezone-converted JS Date objects. Receipts return actor identity; current profile is fetched separately.
- Real runtime DB suite 7/7 PASS (260ms test time): independent own profiles, private optional fields, exact leap date, replay idempotency, malformed dates/oversize/blank input and forged userId rejected, stale-version and changed-replay conflicts, Unicode120 characters accepted, clear-to-null, old replay preserves newer version, raw-table access denied and revoked session denied without affecting second account. Synthetic command history retained locally with sessions revoked.
- Initial typecheck found duplicated ProfileService import/property/initializer in runtime; removed duplicate declarations, final lint/typecheck PASS. Runtime provisioning/diff review and changed-file heuristic secret scan PASS.
- API/UI, avatar linkage and field-sharing remain pending; no full D07/P0 completion claimed. Next: authenticated own-profile GET/update HTTP boundary with independent read/write budgets and negative HTTP tests.
- Commit 63bf085df78cdc843b5bb4cdacb045fc5c7042b4 PUSHED; remote master matches HEAD. Next: own-profile API. Stage03 and full P0 goal incomplete.


## Task 03.1c - Own-profile HTTP boundary and budgets
- Acceptance: authenticated GET/POST /api/profile, same-origin/CSRF guards, no target-user parameters, independent profile_read/profile_update budgets, replay/conflict/invalid input/idempotent updates, session revocation enforcement and no-store headers. Related M10 D07/ST-02.
- Migration 0055 adds profile_read/profile_update to request-policy budget actions. Runtime provisioning includes profile budgets; pairing budget consumption is reused by the route.
- Route: server validates session cookie, origin/sec-fetch-site, body size/content-type, rejects query parameters, enforces per-action budget before DB calls, maps errors to safe statuses (400/401/403/409/429/503) and returns `{ profile }` or `{ userId }` with no-store/Vary headers.
- Real HTTP/browser coverage present in e2e/auth-http.spec.ts: own read/update, cross-account isolation, invalid/leap dates, oversized bio, replay idempotency, changed replay conflict, stale version conflict, budget 429 with Retry-After, session revocation denial and foreign origin rejection.
- Lint/typecheck/build and existing Auth/HTTP regression targets unchanged in behavior; no production deployment. No full D07 completion claimed (UI/avatar/field sharing pending).
- Working tree contains the route (committed in acc8699) and migration 0055 committed (c9c3025); apply migrations before use. Next: own-profile UI and avatar/source permissions, then remaining Stage 03 shared-platform items.


## Task 03.1d - Own-profile UI panel
- Acceptance: authenticated account page shows private profile form (display name, nickname, birthday, bio) with client-side validation, loads via GET /api/profile, updates via POST with commandId/version/origin, handles 401/409/429/errors and refreshes on conflict; no target-user fields or browser token storage. Related M10 D07.
- Added profile-panel.tsx integrated into account-form for signed-in state; uses same-origin fetch, CSRF/header checks rely on server, clears state on expiry.
- Lint/typecheck PASS. No full D07 completion claimed (avatar/source permissions and broader sharing pending). Next: avatar linkage with source permissions and remaining Stage 03 shared-platform items.


## Stage03 recovery checkpoint - runtime profile grants
- Re-read objective and inspected authoritative HEAD 8bf4dbc. Prior build handle 75475 no longer exists; no build success inferred. API/UI commits already present; preserved them and uncommitted avatar work.
- Local migration runner applied pending 0056 and verified checksums. Provisioning then failed because 0056 removes the seven-argument profile function. Fixed provisioning to resolve only the two explicit profile signatures and grant those present; no schema-wide or table privileges.
- Provisioning PASS against current local DB; Python compile, lint, typecheck and diff check PASS. Runtime database regression 6/7 PASS, profile update FAIL (DatabaseUnavailableError). Inspection identifies 0056 references nonexistent command_audit and incompatible outbox columns, changes conflict SQLSTATE and does not yet enforce avatar source authorization. These remain repair work; avatar is NOT accepted. Applied migration must be repaired with a forward migration, not silently edited.
- Existing next-env.d.ts, profile service avatar edits and untracked 0056 are preserved outside this narrow provisioning repair. API HTTP and desktop/mobile profile acceptance need actual test runs after repair; prior UI/API report prose alone is not passing evidence. Stage03 remains IN_PROGRESS and overall M01-M10 P0 incomplete.
- Commit 7c43ff04c44400ac298332daab8b4da7ba861fc3 PUSHED; remote master SHA verified equal. Next: forward repair of applied avatar migration and profile regression, then HTTP/desktop/mobile acceptance.


## Task 03.1e - Forward repair of avatar/profile command foundation
- Preserved already-applied 0056 unchanged and added 0057 correcting audit/outbox schema and conflict SQLSTATE. Restored seven-argument text command with original receipt fingerprints; omitted avatar input preserves current avatar. Explicit avatar input uses a separate command action and atomic receipt/audit/outbox.
- Avatar reference requires an existing M02 resource with current base read authorization; unknown/foreign-module/Private-other/conditional/deleted sources denied. Profile reads mask inaccessible avatar references. No public media URL or bytes exposed. This is base reference protection, not complete M02 media reuse/image-type policy, upload, picker or field sharing acceptance; these remain required integration work.
- Added ordered role bootstrap before unchanged 0056 so fresh clusters do not require a pre-existing runtime role for its explicit grant. No password/table access/membership is introduced.
- Real runtime DB 7/7 PASS (360ms) including new source-denial matrix, one receipt/audit/outbox on duplicate, text update preserves avatar, source Trash masks reference, explicit clear; fresh DB profile concurrency/rollback/legacy replay PASS (12.053s). Lint/typecheck PASS. Prior 6/7 failure repaired. HTTP/mobile/desktop profile verification remains next.
- Commit f2ea255c82b60f5432cd00f0d6339b6f74c35e58 PUSHED; remote master SHA equals HEAD. Final fresh migration/profile concurrency rerun PASS 11.576s. Next: build and real HTTP plus desktop/mobile profile tests.


## Task 03.1f - Profile HTTP and desktop/mobile conflict recovery
- Acceptance: private own fields persist via real API; birthday stays date-only; concurrent edit rejects stale save and displays authoritative values before another save; revoked session removes private form; desktop/mobile do not overflow.
- Added profile-ui.spec.ts to both browser projects using synthetic PostgreSQL accounts/sessions, no mocked API. Initial test locator collided with Next route announcer; corrected scope. Then reproduced actual stale-input defect: after 409 fetch, input value remained Stale draft although new defaultValue/version had arrived. Keyed form by authoritative version and clarified conflict message; subsequent reviewed edits save correctly.
- Final production build, lint/typecheck PASS. Real profile HTTP + desktop Chrome + Pixel7 tests 3/3 PASS (5.4s): HTTP source/session isolation, validation, replay/conflicts/budgets; browser save/reload of private fields/leap birthday, conflict refresh, reviewed resave, session expiry, no horizontal overflow. Synthetic fixtures remain local with revoked sessions.
- This verifies current text-profile journeys only. Avatar picker/media-use policy, profile field sharing and other Stage03 work remain. Overall P0 goal incomplete.
- Commit 46ca7b8d3d8e77f8606a2a2eaf47b66e718b3f5f PUSHED; remote master SHA verified equal. Next: remaining Stage03 profile privacy and shared-platform acceptance; M02 avatar reuse remains an integration dependency.


## Task 03.2a - Profile field grant persistence
- Acceptance derived from ENT-M10-02, ST-02/ST-03 and BR-M10-14: private by default; explicit field/recipient/Space binding; no account secrets in field allowlist; irreversible revocation without resurrecting old permission records.
- Migration0058 adds forced-RLS profile_field_grants with exact profile-field-recipient-Space identity, restrictive membership/profile foreign keys, unique live grant and immutable historical binding. No runtime table access or permissive policy. This schema does not itself expose Partner data or grant sharing authority.
- Fresh PostgreSQL test PASS 7.950s: zero default grants, secret/wildcard/self/unknown-recipient/wrong-Space denied, duplicate active grant denied, changing field/owner and deleting history denied, RLS hides rows even with SELECT privilege, revoked records cannot be reopened or changed, new explicit grant has a new identity. Local migration/checksums PASS; Python compile/lint/typecheck PASS.
- Next: transactional owner-authorized share/revoke commands with current Space/session checks, exact Partner projection with per-field and avatar-source authorization, then API and desktop/mobile controls. No full field-sharing journey or Stage03 completion claimed.
- Commit 2a6f56ba4974a6bfa0f3a0394c0077d2e4a2d8f7 PUSHED; remote master SHA verified equal. Next: owner-only field share/revoke commands and exact Partner projection.


## Task 03.2b - Owner-confirmed profile field issuance
- Added0059 issue_profile_field_grant: explicit confirmation and exact field/profile/Space/recipient/version; locks active Space/session and own profile; validates active Partner membership; atomically records grant, revision, receipt, audit and outbox. PUBLIC execute revoked; runtime exposure deferred until service/API task.
- Fresh PostgreSQL execute-only test PASS10.264s: malformed/unconfirmed/foreign-owner/self/unknown-member/wrong-Space/stale version denied; rollback leaves no grant; concurrent duplicate yields one grant/event set; changed replay denied; old replay after revocation returns receipt without resurrecting permission; fresh explicit regrant has new identity; revoked session and frozen Space denied. Initial fixture incorrectly jumped active-to-frozen; corrected to real disconnecting-to-frozen state sequence, no production guard weakened.
- Local migration/checksums, lint/typecheck/diff review PASS. No personal values in audit/outbox. Next: owner-authorized revoke (including after disconnect), Partner per-field projection, then typed service/API/UI. Stage03 and full P0 incomplete.
- Commit 6fbcb39edaa5fe1331c236fef41f5871231f3205 PUSHED; remote master SHA equals HEAD. Next: profile field revocation and permission-filtered Partner projection.


## Task 03.2c - Owner-only profile field revocation
- Migration0060 adds confirmed, versioned revoke_profile_field_grant with current active account/session locks, own-profile authorization and exact grant/profile binding. Remains usable after Space disconnect/freeze because revocation only removes access. Atomic revision/receipt/audit/outbox; no profile values in events. Runtime/API exposure remains for subsequent service task.
- Fresh execute-only PostgreSQL test PASS9.502s: Partner/invalid session/foreign profile/unknown grant/unconfirmed/stale requests denied; rollback leaves both grants live; concurrent identical revoke yields one receipt/audit/outbox; changed replay rejected; second command cannot revoke same history again; only selected field revoked; remaining field revocable after frozen; old retry does not increment revision; revoked session cannot replay.
- Local migration/checksums, lint/typecheck and diff review PASS. Next: exact Partner field projection including source-media checks, then typed service/API/UI with two-account desktop/mobile verification. No end-to-end field-sharing completion claimed; Stage03 remains IN_PROGRESS.
- Commit 8a5ef95d773f21aa8d61e723ab47559b01ecf346 PUSHED; remote master SHA verified equal. Next: permission-filtered Partner profile projection and own grant listing.


## Task 03.2d - Permission-filtered Partner profile reads
- Migration0061 adds read_partner_profile(session,Space), constructing JSON only from exact live field grants for current actor. Hidden fields are absent, permitted empty fields remain null, birthday is date-only; no profile version, account secrets or implicit whole-profile serialization. Active owner and active/valid disconnect processing window required. Avatar reference additionally requires current source read permission; sharing profile never grants source access.
- Added own-only grant listing (no personal field values), preserving visibility of revocation history for the owner after freeze. Functions are PUBLIC-revoked, not yet exposed to runtime/HTTP.
- Fresh execute-only PostgreSQL test passes: empty default, exact nickname/birthday projection, foreign session/Space denial, own-only history, Private avatar omitted, independently authorized avatar shown then omitted on source revoke, field revoke immediate, empty nickname null, session revoke immediate, frozen-without-window denied. Extended test covers valid 30-day processing window and expired window; final result recorded below.
- Lint/typecheck PASS; local migration/checksum and final test checked before commit. Next: typed runtime service, HTTP budgets, and two-account desktop/mobile sharing controls. Full M02 media-use policy and avatar bytes remain separate domain integration; Stage03 incomplete.
- Final expanded fresh-DB projection test PASS 11.581s; local migration/checksums PASS; diff and changed-file heuristic secret scan clean.
- Commit bafe38a2bb640370803f0a33ff02cf9b5550c7c6 PUSHED; remote master SHA verified equal. Next: runtime profile-sharing service and integration tests.


## Task 03.2e - Typed profile sharing runtime service
- Extended existing ProfileService with partner, grants, shareField and revokeField. Parameterized SQL, canonical session hashing, UUID/positive-safe-version/explicit-confirmation validation and exact key allowlists. Mutation profile identity derives from session_actor in SQL; client cannot nominate another profile. Typed Partner projection preserves absent versus permitted-null values; grant history exposes identifiers/timestamps only.
- Runtime provisioning grants EXECUTE on exactly four new functions; no table privileges. Real runtime DB suite7/7 PASS (398ms test time): two synthetic paired accounts, empty default projection, birthday-only sharing, duplicate command replay, malformed/forged input denied, own-only history, Partner cannot revoke owner grant, stale version conflicts, owner revocation/replay clears projection, raw grant table denied. Existing profile/private-avatar tests remain passing.
- Lint/typecheck and provisioning PASS. No HTTP route or UI sharing controls yet. Next: same-origin authenticated profile-sharing HTTP endpoints with independent budgets and negative two-user HTTP tests, then desktop/mobile controls. Stage03/full P0 incomplete.
- Commit 8d76fe153952524b3c2ab0b73de745e24604c4eb PUSHED; remote master SHA verified equal. Next: profile sharing HTTP boundary and independent action budgets.


## Task 03.2f - Profile sharing HTTP boundary
- Added GET /api/profile/partner?spaceId= and /api/profile/grants, POST /api/profile/share and /api/profile/revoke. Live session, exact Origin/cross-site guards, strict query shape/no duplicate Space parameter, bounded4KB UTF-8 JSON object parsing, safe errors and no-store responses. Four independent committed budgets via0062; read/share abuse cannot consume revoke quota. Unknown actions/method mismatches rejected.
- Real production Next/PostgreSQL HTTP tests2/2 PASS: own-profile regression and two-account sharing flow, empty/default field projection, exact display-name disclosure, no other profile values, grant history isolation, replay/stale-version, missing Origin/cross-site/query duplication/forged user/secret field/unconfirmed/oversize input denial, Partner cannot revoke, share429 with Retry-After while owner revoke200, immediate empty projection and session revocation401.
- Lint/typecheck, migration/provisioning PASS. Initial sandbox build failed Windows junction creation (access denied); authorized escalated build PASS. No production deployment. Next: desktop/mobile profile-sharing controls and Partner profile view; Stage03 and overall P0 remain incomplete.
- Commit 61559b293aef3a181d898a4f3a9bed1a0c3dcf0a PUSHED; remote master SHA equals HEAD. HTTP final2/2 PASS3.0s. Next: desktop/mobile sharing and Partner profile UI.


## Task 03.2g - Desktop/mobile field-sharing controls
- Added /account/profile-sharing and account navigation. Loads current own version, exact active Partner options and grant history; explicit per-field confirmation and per-grant revoke confirmation, no automatic sharing. Retains command ID for unchanged retry payload, maps expiry/conflict/rate errors, allows owner revoke for prior Spaces, clears data on refresh/expiry. Four text fields selectable; avatar picker/media reuse remains M02-dependent, not claimed complete.
- Real desktop Chrome and Pixel7 tests2/2 PASS4.2s: unconfirmed click creates zero grants, chosen birthday only creates a real DB grant, explicit revoke removes it, no horizontal overflow, session revocation removes controls and offers login. Initial selector getByLabel included option text; switched to browser-observed accessible combobox name; no product behavior bypassed.
- Lint/typecheck/build PASS. Initial lint found synchronous effect state update; deferred initial async refresh consistently with existing panels. Next: Partner profile viewer, additional conflict/frozen-state UI tests and remaining Stage03 journeys. Stage03/full P0 remain incomplete.
- Commit d76442c10574cf90c81e82d768d1e5ca7fa21831 PUSHED; remote master SHA verified equal. Next: Partner profile UI and conflict/frozen-state coverage.


## Task 03.2h - Profile-sharing stale state and disconnect UI acceptance
- Extended real browser/DB coverage to concurrent profile edits and Space freeze while the page remains open. Stale-version submit creates zero grants and displays actionable conflict; refresh resets confirmation and requires a reviewed new selection. Server rejects stale active-Space sharing after freeze; refresh removes new-share controls while preserving owner revoke.
- Desktop Chrome/Pixel7 tests2/2 PASS5.0s, including explicit revoke after freeze, exact single-field persistence, expiry and mobile overflow. Lint/typecheck PASS. No product change needed: existing command/version/Space enforcement satisfies these cases. No mocks or real user data used.
- Next: Partner profile viewer, remaining Stage03 platform journeys. Avatar media integration still pending; full M10 and overall P0 not complete.
- Commit b2645fc2510fb53877ea5d72416ed319cc48f694 PUSHED; remote master SHA verified equal. Next: Partner profile viewer with live permission refresh.


## Task 03.2i - Partner text profile viewer
- Added /account/partner with account navigation, current/previous Space selector, permission-filtered text fields, permitted-null labels, empty/error/login states and no edit controls. No hidden-field placeholders, no use of Space partner_name to bypass field visibility, no browser persistence. Aborts superseded reads; clears values on refresh/background and revalidates on focus/pageshow/visibility return.
- Desktop Chrome/Pixel7 real API/PostgreSQL tests2/2 PASS4.2s: default empty, only granted nickname visible while private bio/birthday absent, revoke then focus revalidation clears nickname, revoked session presents login, no horizontal overflow. Lint/typecheck/production build PASS.
- Avatar image rendering remains M02 binary/media integration and is not claimed delivered. Active foreground revocation is enforced on each server read; this viewer has lifecycle/manual refresh, not a realtime invalidation subscription. Next: broader profile lifecycle regression and remaining Stage03 journeys (Couple Profile, preferences, Trash/export/notifications). Overall P0 incomplete.
- Commit 150ef02b50cd6d53dfa728afaa942788e6208def PUSHED; remote master SHA verified equal. Next: remaining Stage03 journeys and cross-profile regression.

## Task 03.3a - Couple Profile identity and revision history
- Migration0063 adds a Couple-owned nullable title with stable Space identity, member attribution, server-generated monotonic versions and atomic immutable revision snapshots. Forced RLS and no PUBLIC access on both tables; no personal-profile fields or field permissions copied.
- Fresh PostgreSQL integration test PASS (1 test, 8.819s): both member attributions, forced initial version and increment, transactional history rollback, invalid title/nonmember/identity mutation denied, history deletion/tampering denied, forced RLS hides both tables, no implicit personal sharing. Local migrations applied and checksums verified. Python compile, lint/typecheck and diff review PASS.
- Earlier database execution was NOT_RUN because automatic approval encountered a usage limit. Retry through the same approval mechanism succeeded; that blocker is resolved.
- This task is schema/history only. Authorized read/update commands, two-member concurrency, API/UI, cover/theme and M05 anniversary provenance remain pending. Stage03 and full P0 remain incomplete. Next: authorized Couple Profile commands with version conflicts and idempotent receipts.
- Commit d28576e629540c3b5313069d4cc0dbf262ba5741 PUSHED; remote master SHA verified equal. Next: authorized Couple Profile commands and concurrent update acceptance.

## Task 03.3b - Authorized Couple Profile update command
- Migration0064 adds update_couple_profile with current member/session and active Space lifecycle checks, normalized bounded nullable title, version zero for initial creation and explicit expected version for updates. Per-Space transaction advisory lock serializes creation/retries before revalidating authorization. Both members can edit; stale edits fail instead of silently overwriting.
- Profile snapshot, immutable revision, idempotent command receipt, audit and outbox commit atomically. Events contain identifiers/revision only. PUBLIC execution revoked; runtime service exposure remains next task.
- Fresh execute-only PostgreSQL integration PASS9.533s: invalid session/Space/input, rollback, concurrent identical initial requests yield one revision, altered replay denied, two competing member edits yield exactly one winner, Partner subsequent update succeeds, receipt/audit/outbox counts exactly match three revisions, old retry does not rewrite, revoked session and frozen Space denied. Lint/typecheck, Python compile, migration/checksums and diff review PASS.
- Next: permission-filtered Couple Profile reads/history, typed service and API/UI desktop/mobile. Cover/theme and M05 provenance remain pending. Stage03/full P0 incomplete.
- Commit 0f50497bd23b66caa860f2e8f7a472b7354a505d PUSHED; remote master SHA verified equal. Next: authorized Couple Profile reads/history and runtime service.

## Task 03.3c - Authorized Couple Profile reads and revision pages
- Migration0065 adds member/session/lifecycle-gated current profile and history reads. Authorized absent profile returns version0/null fields for initial editing; unauthorized requests return no rows. Shared profile projection contains only Space title/version/attribution/time, never personal fields or account credentials.
- History uses immutable descending version cursor and fixed50-row pages. Active Space or unexpired disconnect processing window required; no permission granted to outsiders. PUBLIC execution revoked; typed runtime/API exposure is subsequent work.
- Fresh PostgreSQL execute-only test PASS10.092s: absent profile, both members' equal current view,52 revisions across two ordered pages, preserved actor/title, valid outsider and invalid/revoked session denial, foreign Space denial, frozen without window denial, valid processing-window history read and expired-window denial. Lint/typecheck, Python compile, diff review and local migration/checksums PASS.
- Next: typed Couple Profile runtime service, HTTP boundary, desktop/mobile editor/history and conflict review. Cover/theme/M05 integration and remaining Stage03/full P0 still incomplete.
- Commit fd1a5329c5b2593940b8a3b494c9a74053a8b3dd PUSHED; remote master SHA verified equal. Next: typed Couple Profile runtime service and HTTP/UI integration.

## Task 03.3d - Typed Couple Profile runtime service
- Added ProfileService couple/coupleHistory/updateCouple with canonical session hashing, parameterized SQL, UUID/exact mutation key validation, safe nonnegative expected versions, bounded Unicode title and positive-safe history cursors. Nullable title preserved; current profile and revisions have explicit typed fields.
- Runtime receives exactly three additional EXECUTE permissions; no table privileges or generic policy-helper grant. Real runtime database suite7/7 PASS (458ms test time): absent profile, normalized title, idempotent retry, stale Partner edit conflict, changed replay denial, Partner update, exact history/attribution and cursor, malformed/forged input rejection, foreign Space empty, raw table denial and revoked session rejection.
- Initial run failed before tests because service declarations were duplicated; removed exact duplicates, then lint/typecheck and database suite passed. Provisioning, diff review and changed-file secret scan passed.
- Next: authenticated Couple Profile HTTP endpoints with independent budgets and production-server tests, then desktop/mobile editor/history. Stage03 and full M01-M10 P0 remain incomplete.
- Commit 0f3602bebc7e36a051cd66bbae50f39bd6b80d8d PUSHED; remote master SHA verified equal. Next: Couple Profile HTTP boundary and independent budgets.

## Task 03.3e - Couple Profile HTTP boundary
- Extended authenticated profile action route with GET couple?spaceId, GET couple_history?spaceId&before and POST couple_update. Live cookie/session, exact Origin/cross-site checks, strict unique query parameters and positive-safe cursor, bounded4KB strict UTF-8 JSON input, no-store responses and safe errors reuse existing boundary.
- Migration0066 and local provisioning add independent profile_couple/read-history/update budgets (60/60/20 per minute local defaults). Update exhaustion does not exhaust history reads.
- Production Next/local PostgreSQL HTTP test PASS1/1 (3.3s): no-session/cross-site/missing Origin denial, duplicate/unknown/malformed/unsafe cursor denial, forged user/invalid title/version/oversize body denial, idempotent save, stale Partner409, Partner read and subsequent update, history cursor,429/Retry-After and independent history200, revoked session401. Lint/typecheck/build/migration/checksum/provisioning PASS. Related profile-sharing regression run before commit.
- Next: desktop/mobile Couple Profile editor, history and reviewed conflict recovery. Cover/theme/M05 integration and overall Stage03/M01-M10 P0 remain incomplete.
- Related profile-sharing HTTP regression PASS1/1 (2.5s); changed-file secret scan and diff check clean.
- Commit 17819240ae3f08af806bd747fdd810242fd90d9e PUSHED; remote master SHA verified equal. Next: Couple Profile desktop/mobile editor/history with conflict recovery.

## Task 03.3f - Couple Profile desktop/mobile editor and history
- Added /account/couple and account navigation, current/prior Space selection, shared nullable-title editor, immutable history with actor IDs/timestamps and older-page control. Only active Spaces offer edits; frozen processing-window view remains read-only. Same-payload retries retain command ID.409 disables stale editing until explicit reload replaces input with current title for review; no silent merge/overwrite. No browser persistence.
- Real production Next/PostgreSQL Chrome/Pixel7 tests2/2 PASS: saved title and history, concurrent Partner edit rejects stale write without overwriting DB, explicit refresh displays new title, reviewed resave yields ordered three revisions, no horizontal overflow, frozen view removes editing, revoked session clears data and offers login. Final build/lint/typecheck PASS; initial effect-cleanup lint warning fixed before final build/test rerun.
- This UI currently refreshes on explicit user action and mutations; realtime/lifecycle invalidation remains broader integration work. History paging is implemented atop the tested cursor API; browser test currently covers three revisions, not a multi-page dataset. Cover/theme and M05 provenance remain pending. Next: additional Couple Profile lifecycle/paging acceptance and remaining Stage03 platform journeys; full P0 incomplete.
- Commit c6fee462bdea122d00532ed7cbf897a51b1967a7 PUSHED; remote master SHA verified equal. Final desktop/mobile tests2/2 PASS5.0s. Next: lifecycle/paging acceptance and remaining Stage03 journeys.

## Task 03.3g - Couple Profile paged history and nullable title acceptance
- Extended real desktop/mobile acceptance to clear the shared title and verify SQL NULL, then populate54 immutable revisions and navigate the50-row first page plus4-row older page. Asserts every version in exact descending order, no duplicates/missing revisions, earliest title retained and older-page button removed at exhaustion.
- Repeats history navigation after Space freeze within the allowed processing window; editor absent, history remains readable. Existing stale-conflict/reviewed-resave/session-revocation checks retained. Browser/real PostgreSQL tests2/2 PASS6.0s; lint/typecheck PASS. Product code unchanged; current production build reused.
- This closes the multi-page browser coverage gap recorded in03.3f. Cover/theme, M05 provenance, broader lifecycle invalidation and remaining Stage03 journeys are still pending. Next: remaining M10 preferences/shared personalization requirements, preserving approved accessibility and source-media policies. Overall M01-M10 P0 incomplete.
- Commit a74a96fbe788aecad231af6842a8bf305595ec37 PUSHED; remote master SHA verified equal. Next: remaining Stage03 personalization/preferences.

## Task 03.4a - Account-scoped presentation preference schema
- Migration0067 adds personal_preferences keyed by immutable account ID: Light/Dark/System, Vietnamese language, named timezone, date format,12/24-hour cycle, System/Reduce motion and font scaling1-2. Server-generated version/timestamp, forced RLS, PUBLIC revocation, no implicit sharing or source-data updates. Defaults are presentation fallbacks; English remains P1, not an implemented translation claim.
- Fresh PostgreSQL test PASS9.577s: defaults/forced version, independent A/B settings, invalid enums/timezone/scale/owner changes denied, rollback, valid UTC and named DST-zone storage, original profiles unchanged, no field grants, forced RLS hides rows even from SELECT-granted probe. Lint/typecheck/Python compile, local migration/checksums and diff review PASS.
- Schema only: authenticated read/update commands, runtime/API/settings UI and actual theme/locale/accessibility rendering are pending. No DST rendering or M05 all-day preservation end-to-end claim yet. Next: owner-only versioned preference commands with idempotency and live-session enforcement. Stage03 and full P0 remain incomplete.
- Commit 51f9670bf63258e84cbeff2823f0e8253bb0a1e6 PUSHED; remote master SHA verified equal. Next: authenticated preference read/update commands.

## Task 03.4b - Authenticated personal preference commands (Knowns OS-RCXJTX)
- Migration0068 adds own-only read defaults/version0 and update deriving actor exclusively from live session. Account/session locks serialize initial creation and concurrent versions; explicit input validation includes named timezones and exact two-decimal font scale. Canonical numeric fingerprint makes1.5/1.50 the same retry. Receipt/audit/outbox commit atomically; PUBLIC execution revoked, runtime/API exposure pending.
- Fresh PostgreSQL test PASS7.222s: own defaults, separate account isolation, same-account multi-session visibility, rollback, concurrent duplicate command, changed replay/stale write/invalid session/invalid scale denial, competing edits yield one success, exact event counts, revoked-session read/replay denial. Lint/typecheck, migration/checksum and diff review PASS. Earlier test could not execute because Docker engine was stopped; engine restarted and test rerun successfully.
- Knowns integrated with existing Goal: project OurSpace selected, no prior tasks found, created OS-RCXJTX from Git/Build Report checkpoint and recorded AC/plan. Build Report remains official evidence. Knowns Python code edit/diagnostics used; SQL language server unavailable, new SQL migration created through filesystem fallback and validated against real PostgreSQL.
- Handoff: Stage03 remains IN_PROGRESS; Stage04-15/full P0 incomplete. Next: preference runtime service/API and settings UI/rendering. Existing uncommitted setup files (.gitignore, AGENTS.md, .agents/.claude/.codex/.knowns, CLAUDE.md, OPENCODE.md, opencode.json, Docs/04 handoff) preserved and excluded from this functional commit; next-env.d.ts generated change excluded.
- Commit 4cd63410d57cea65dd539d5e1423bc893f5415b2 PUSHED; remote master SHA verified equal. Knowns OS-RCXJTX marked done with evidence; next task is runtime preference service/API.

## Task 03.4c - Typed preference runtime service (Knowns OS-BCNRN2)
- Extended server-only ProfileService with typed preferences/updatePreferences, canonical session hash, exact mutation key allowlist, safe nonnegative version, supported appearance/locale enums, timezone syntax and bounded exact two-decimal numeric font scale. PostgreSQL remains authoritative for named timezone validity and live owner authorization. Granted only two explicit EXECUTE functions to local runtime; no table grants.
- Real runtime database suite7/7 PASS579ms: defaults, account isolation, save/read, idempotent retry, stale conflict, changed replay, forged owner/invalid enum/version/scale/timezone denial, direct table denial and revoked session denial. Lint/typecheck and Knowns diagnostics PASS. Initial insertion was rejected for ambiguous matches then CRLF mismatch; exact insertion repaired missing test fixture before final passing checks.
- HTTP/settings UI and rendering still pending. Existing setup files and generated next-env.d.ts preserved/excluded. Next: authenticated preference HTTP endpoints and budgets, then desktop/mobile appearance/regional/accessibility rendering. Stage03/full P0 incomplete.
- Commit edda8d911cc09e1e2a7bfcb3436bfd42e2fc2329 PUSHED; remote master SHA verified equal. Knowns OS-BCNRN2 done; next preference HTTP/API task.

## Task 03.4d - Personal preference HTTP boundary (Knowns OS-184SV5)
- Added authenticated GET preferences and POST preferences_update through the existing strict Origin, live-session, 4KB JSON and no-store boundary. Rejects query parameters and wrong methods; owner remains derived from session. Migration0069/provisioning add independent read60/write20 local per-minute budgets.
- Production Next/PostgreSQL HTTP tests2/2 PASS3.1s (preferences plus Couple Profile regression): unpaired accounts isolated, defaults/read/save/retry, stale409, changed retry400, forged owner/invalid timezone/scale/version/oversize rejection, CSRF/session denial,429 Retry-After with reads unaffected, revoked-session read/write401. Lint/typecheck/build/migration/checksums/provisioning PASS. Initial new migration failed due to UTF-8 BOM; removed BOM before successful application.
- Next: preference settings UI and actual theme/locale/accessibility rendering. Stage03 and full M01-M10 P0 remain incomplete. Unrelated user setup files and generated next-env.d.ts preserved/excluded.
