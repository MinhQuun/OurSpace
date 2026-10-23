---
document_id: OURSPACE-ARCHITECTURE-A-CANDIDATE-POC
project: Our Space
version: 0.1
status: CANDIDATE_FOR_TECHNICAL_VALIDATION_NOT_APPROVED
prepared_date: 2026-10-23
source_baseline: 10 BRD V1.0; 247 Dxx; Approved Policy Supplement DEC-01..DEC-07; CT-01..CT-08 DRAFT; OP-01..OP-07 PROPOSED
implementation_status: NOT_STARTED
---

# OUR SPACE — HƯỚNG A: KIẾN TRÚC ỨNG VIÊN VÀ KẾ HOẠCH PROOF OF CONCEPT

**Mục đích:** Đánh giá có căn cứ hướng A trước khi chọn công nghệ, không viết code, không cập nhật BRD. Đây **không** phải quyết định phê duyệt tech stack. CT vẫn là Draft và OP-01..OP-07 chưa được phê duyệt.

## 1. Ràng buộc không được giảm

- 10/10 phân hệ P0 đủ trên mobile và desktop mới hoàn thành Our Space V1.0.
- Hai tài khoản độc lập, có chức năng cá nhân trước Pairing, Private mặc định; quyền riêng cho từng object/page/media/source; không có super-admin ở cấp Couple Space.
- Một source of truth/domain: M01 Photobook/Diary; M02 originals/media; M03 Place/Visit; M04 Trip/Activity/Booking; M05 Calendar Event; M06 Goal/Wish; M07 Expense/Budget/Savings; M08 Letter/Moment/Capsule; M09 Comment/Reaction; M10 identity/space/permissions/notification/lifecycle.
- No cascade deletion giữa các module; Trash >=30 ngày, export đúng quyền, backup và system restore có thử nghiệm.
- M01 Simple + Advanced cùng mô hình dữ liệu, realtime hai người; cùng tài khoản nhiều phiên; undo an toàn; xuất PDF; Publication bất biến; page overrides.
- M07 audit, splits, approvals, balance, currencies; không nhân đôi/cộng sai.
- M08 Seal/snapshot/timestamp bất biến, server gate không mở sớm; M10 D35 Disconnect pause unrevealed, reconnect không tự phát lại.
- M09 không phải chat độc lập; in-app notification M10 P0, push/email P1.
- M10 D09 email/password/email verification P0; OAuth P1; D10 optional TOTP MFA + safe recovery codes P0; D11 sessions/revoke P0; D16 Permission Inspector P0; D40 mobile/desktop P0.

## 2. Hướng A kiến trúc logic

```
Mobile browser / Desktop browser
       | Next.js + React + TypeScript + Tailwind UI
       v
Next.js BFF / Application services (server-verified permissions & domain commands)
       |-- Auth/session via Supabase Auth
       |-- Domain modules M01 ... M10 (modular monolith)
       |-- Audit / command idempotency / transactional outbox
       |-- Typed read models / permission-filtered projections
       v
Supabase PostgreSQL (RLS defense-in-depth, domain state, audit, references, jobs)
       |-- Supabase private Storage (original, variant, document, export artifacts)
       |-- Supabase Realtime private Broadcast for light events/presence
       |-- Scheduled/queued workers for eligible reminders/retries/exports/purge
       `-- Controlled database + object backup and restore

Optional separate collaboration service for M01:
Yjs + Hocuspocus (or another compatible provider), durable binary Yjs updates and
checkpoints, strict live authorization. Host on Vercel WebSockets ONLY after POC;
otherwise dedicated lightweight long-running service. Editor rendering: React
Konva candidate + Tiptap text candidate (validate interaction), mobile equivalent.
```

**Kiến trúc tổ chức:** Một modular monolith về nghiệp vụ, không phải mười microservices. Các use case nhạy cảm chạy trên server trong transactions. Browser chỉ nhận projections đã lọc quyền. Không để client ghi trực tiếp M07 ledger, M08 sealed state, hay M10 grants bằng các cập nhật không kiểm soát.

## 3. Ranh giới bảo mật/ủy quyền

1. **Supabase Auth** xác thực người dùng; Couple Space membership là dữ liệu ứng dụng, không suy ra quyền đọc tất cả từ việc đã Pair.
2. **Permissions policy** kiểm quyền `actor + resource + action + current source ACL + lifecycle + conditional gate` cho mỗi read/write/export/download. UI/route không phải security boundary.
3. **Postgres RLS** bắt buộc với mọi bảng exposed, default deny; SELECT projection không có secret fields. Backend vẫn kiểm business actions/consent; service key có thể bypass RLS nên chỉ chạy server trong tối thiểu phạm vi quyền.
4. **Storage** toàn bộ bucket nghiệp vụ private. Signed URLs có thể tiếp tục hoạt động đến lúc hết hạn dù revoke JWT. Với Secret/Sealed/instant revoke, dùng authenticated proxy kiểm quyền *mỗi request* hoặc phương án không phát reusable signed URLs; không cam kết thu hồi bytes đã được người dùng tải.
5. **Realtime** private-channel authorization có cache trong lifetime connection; bắt buộc kick/re-auth/rotate token khi revoke, đổi membership, Disconnect; zero-sensitive-payload broadcast until server authorizes. Reconnect phải revalidate.
6. **MFA** Supabase TOTP APIs có sẵn nhưng tài liệu JavaScript ghi recovery codes **không được hỗ trợ trực tiếp**. M10 D10 là P0: phải thiết kế/quy trình thay thế có kiểm chứng (one-time hashed codes server side, rate limits, reset safeguards) hoặc đổi nhà cung cấp; không thể coi Supabase Auth mặc định là đủ.
7. **Caching** không public/static-cache dữ liệu user-specific; server/route/action phải có authorization tại điểm đọc/thao tác. Secret names, counts, notifications, search, thumbnail, PDFs phải qua cùng chính sách.
8. **Audit & privacy** lưu event an toàn không log payload Secret/TOTP/token, gồm grant/revoke, Seal, Delete, Restore, M07 approvals/adjustments.

## 4. Thiết kế dữ liệu khái niệm (không phải schema đã duyệt)

- Core: `users/auth identities`, `profiles`, `spaces`, `memberships`, `pairing_invites`, `resource_permissions`, `revocations`, `audit_events`, `domain_events/outbox`, `job_runs`, `trash_records`, `deletion_cases`.
- M01: `photobooks`, `pages`, `draft_revisions`, `publications`, `page ACL`, `editor snapshots/updates`; source M02 media chỉ bằng stable references + snapshot authorization.
- M02: `assets`, `asset_variants`, `shared_copies`, `albums`, `asset_usage`, `file_objects` (file bytes trong Storage).
- M03..M06: canonical riêng, links qua `source_module + source_type + source_id + consumer + purpose + state`; M05 owns `calendar_events/series/occurrence IDs`.
- M07: `expenses`, `payer_records`, `split_allocations`, `approvals`, `confirmed_obligations`, `settlements`, `refund_adjustments`, `budgets`, `savings_movements`, `exchange_rate_snapshots`. Money in exact numeric/minor units depending on currency and approved OP-04.
- M08: `letters`, `moments`, `capsule_seals`, `sealed_manifests`, `recipient_open_state`, `pause/hold`, `delivery_events`; seal immutable, content-gate at read.
- M09: `comments/reactions` referencing resource IDs + ACL checks; M10 `in_app_notifications`, Quiet Hours, Space lifecycle, exports/restore requests.
- **Rule:** reference to another module ≠ new owner of that module's canonical record; deleting a linked resource never cascades into unrelated canonical resource.

## 5. Workflows có tính quyết định

### M01 Editor và Realtime

- Create/modify Draft → one canonical page scene object model shared by Simple and Advanced.
- Editor is a visual renderer/editor, not the authority for ACL or Publication. Page, asset, and collaborator rights checked at write and at render/export.
- Compare (A) Supabase Realtime for simple presence/events + versioned operations versus (B) Yjs shared doc/Hocuspocus for rich co-edit. The choice is **open until POC**. Yjs handles data merge; it does **not** automatically resolve application-level semantics of resize/order/publish/ACL.
- Yjs binary updates + snapshots persist durably, undo scoped to local actor/origins; save acknowledgment only after durability criterion met; reconnect/offline merges must not resurrect revoked modifications.
- Publish makes new immutable publication manifest (not mutable draft); PDF generated server-side from authorized version and media; refresh/revoke/export never leak prohibited bytes.
- Mobile must include creation, editing, selection/drag/resize/text/undo/page flow, not only reader.

### M05 Calendar

- Event/series/occurrence IDs M05-owned. M03/M04/M06 links are references; edit scopes `only occurrence/whole series/this-and-following` explicit; timezone semantics `date-only`, `local time+zone`, `instant`, `month/day without year`.

### M07 Finance

- Server-side transactions, explicit approval state machine, idempotency key for every mutation, fixed-point/decimal sums, no floats in money, immutable corrections/settlements event-linked; refund never silently rewrites historical settlement; summaries filtered by visibility before aggregation.

### M08 Time Capsule

- Seal transaction stores original timestamp, canonical sealed manifest and hash/reference, consenting recipients. No content exposed via storage URLs, preview, search, comment or notification before authorized eligible/opened. Server time trusted; no early open if client clock changed. Jobs deliver reminders/notifications, not bypass reveal gate. Disconnect pause unrevealed and reconnect never auto-unpause; original times unchanged.

### Lifecycle / Recovery

- App Trash >=30 days; full deletion is separate review process, do not conflate with backup TTL. Backups include database + Storage original/variants + permission/revocation/consent state + collaboration binary snapshots. Supabase DB backups **do not include Storage objects**. Restore to isolated environment, reconcile deletions/revocations, validate finance/seals/ACL, then controlled cutover; no replay of notifications/settlements/reveals.

## 6. Các rủi ro cần thử nghiệm chứ không được giả định

| ID | Cần kiểm chứng | Nguyên nhân/rủi ro | Quy tắc quyết định |
|---|---|---|---|
| G01 | Supabase Auth vs M10 D10 recovery codes | Supabase JS docs không hỗ trợ sẵn | PASS only with safe tested recovery implementation/vendor alternative |
| G02 | RLS + source/child ACL + reports/search | Shared parent may leak Private child/count/sum | Zero unauthorized bytes/metadata under API, query, exports, direct links |
| G03 | Revoke active realtime & signed URL | Realtime authorization cached; URL valid until TTL | No further unauthorized operations/servable secret after revoke by designed gate |
| G04 | Realtime editor semantic merge | Concurrent object transforms/reorder/text, local undo | No lost confirmed edits or corrupt pages, stable reconnection |
| G05 | Editor parity on mobile | Touch gestures, keyboard, small screen | All M01 P0 primary workflows pass on mobile |
| G06 | Publication rendering/export | PDF snapshot/media revocation/per-page ACL | Export safe and deterministic to authorized projection |
| G07 | Finance transactional correctness | Partial approvals/refunds/fx/retry/restore | Exact conservation of amounts; no double-charge/settlement |
| G08 | M08 immutable seal under failures | Client time, retry, outage, Disconnect, reconnect | Cannot early reveal; no seal timestamp mutation or auto dispatch |
| G09 | Full backup including file bytes | Provider database backups omit object bytes | Isolated restoration with working original files + permission integrity |
| G10 | Recurrence/DST/links | Missing dates and occurrence identity | No duplicate event or phantom date; no wrong user timezone conversion |
| G11 | Notification and outbox retries | Event retry can duplicate messages/commands | One logical side effect; stale actions disabled; Quiet Hours not changing domain state |
| G12 | Deploying Yjs WS | Vercel WebSocket GA Oct 20 2026; older limits docs stale | Test sustained connections, durable state, reconnect, cold start, deployment interruption, billing |

## 7. Proof-of-concept test runs

### POC-A — Identity and permission (highest priority)
- Two independent email/password verified accounts, personal content pre-pair stays Private, invite expires/revokes, equal members, no super-admin read.
- TOTP MFA optional, recovery-code scenario exercised (lose authenticator and recover without partner override), sessions revoked on another device.
- B denied Private Page/asset/receipt even when parent Book/Trip Shared; forbidden via SQL/API URL/export/search/count/feed.
- Revoke Edit while B tab is open and while websocket is joined → next mutations rejected and socket denied/kicked; cached/signed resource exposure evaluated.

### POC-B — Photobook vertical slice
- Media original upload → 1 Shared Copy/permissioned reference → page; Simple ⇄ Advanced lossless with eight distinct templates as test data.
- A/B concurrently edit text, move/resize different and same objects, reorder pages, undo own edit while other works; multi-tab same account.
- Force network drop, offline queue, refresh/crash, publish during concurrent write, revoke Edit mid-session.
- Publication immutable, media revoke then regenerate authorized Reader/PDF; mobile touch and desktop mouse/keyboard both usable.

### POC-C — Finance
- 101001 VND split exactly two parts totaling 101001, multi-payer, pending approval vs debt, partial settlement, refund after confirmed, disputed FX; retry and restore no duplicate.
- Private expense in Shared Trip hidden from aggregates and reports.

### POC-D — Time Capsule, scheduling, notification
- Seal at T with original unlock instant, test T-minus/at/after; change local clock/timezone; reveal denied until authorized.
- Disconnect before unlock; 30-day boundary does not auto-send; reconnect with/without new consent.
- A opened/B unopened → no leak via M09 reaction/comment, feed or notification. Missed job or duplicate job cannot cause early/duplicate reveal.

### POC-E — Delete/backup/restore and deployment
- Trash (>=30d policy simulation), restore, authorized purge, object byte deletion, shared derivative rules; export with per-object ACL.
- Snapshot database + private Storage + Yjs binary, perform isolated restore; reconcile tombstones/grants; no duplicate finance/notification/reveal.
- Deploy Next.js+Supabase and test chosen editor collaboration transport; measure failure behavior, reconnect, monthly cost drivers and operational burden; repeat critical flows mobile.

**All POC tests are `NOT_RUN` at document creation.** Instrument real measured latency and cost; propose numeric performance/RPO/RTO thresholds for approval after measurement, not invent them in this document.

## 8. Quyết định sau POC (không phải trước)

| Nếu | Kết luận |
|---|---|
| All security, M01 realtime, M07, M08, recovery gates pass; data restore works | Recommend approve A with explicit realtime/backup implementation |
| MFA recovery codes cannot be implemented safely with Supabase | Keep Next.js/Postgres, swap auth component or add audited auth extension before architecture lock |
| Supabase Realtime insufficient for M01 editor | Use Yjs/Hocuspocus; evaluate Vercel WS GA vs standalone service; keep Supabase for other domains |
| WebSocket hosting fails persistence/operational tests | Deploy dedicated managed container WS or equivalent; do not replace CRDT requirements with weaker polling |
| Storage signed URLs violate immediate revoke requirement | Do not issue them for sensitive assets; use session-authenticated permission-checking file gateway |
| Restore including asset bytes/revocations cannot be demonstrated | No production launch; complete backup solution first |

**Architecture status:** `A_PREFERRED_NOT_LOCKED`. **Implementation status:** `NOT_STARTED`. **OP-01..OP-07:** `PROPOSED_NOT_APPROVED`.

## 9. Chi phí — không suy theo hai tài khoản mà theo dữ liệu

Ước lượng chi phí tương lai phải tính: Supabase plan/DB size, object GB (original+variants+copies+snapshots), traffic egress, transformations, realtime messages/connections, scheduled jobs/backup copy, Vercel Function/WS usage, domain/email. Supabase pricing public accessed 2026-10-23: Free $0 but storage 1GB and Free project may pause after inactivity; Pro from $25/month with quota, extra metered. Đây chỉ là giá nhà cung cấp, **không phải dự toán Our Space**. Chưa có số ảnh/video, dung lượng, số lần export, tốc độ tăng dữ liệu hoặc chính sách retention nên không thể chốt TCO.

## 10. Tài liệu chính thức tham khảo (truy cập 2026-10-23)

- Next.js Auth and authorization: https://nextjs.org/docs/app/guides/authentication
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase private Storage: https://supabase.com/docs/guides/storage/buckets/fundamentals
- Supabase signed URL revocation: https://supabase.com/docs/guides/storage/serving/downloads
- Supabase Realtime authorization caching: https://supabase.com/docs/guides/realtime/authorization
- Supabase Realtime subscription tradeoffs: https://supabase.com/docs/guides/realtime/subscribing-to-database-changes
- Supabase MFA TOTP and JS MFA reference: https://supabase.com/docs/guides/auth/auth-mfa/totp ; https://supabase.com/docs/reference/javascript/auth-mfa
- Supabase DB backup limitation: https://supabase.com/docs/guides/platform/backups
- Supabase scheduled jobs: https://supabase.com/docs/guides/cron
- Hocuspocus Yjs persistence: https://tiptap.dev/docs/hocuspocus/guides/persistence
- Vercel WebSocket GA 2026-10-20: https://vercel.com/changelog/websocket-support-is-now-generally-available
- Supabase pricing: https://supabase.com/pricing

## 11. Lưu trữ và quan hệ với BRD

Đề xuất lưu tài liệu này ở `OurSpace/Reviews/Architecture/OUR_SPACE_ARCHITECTURE_A_CANDIDATE_AND_POC_PLAN_V0.1.md`. **Không** lưu trong `Docs/Policies`, vì chưa được duyệt chính thức. Khi POC đạt mới soạn Architecture Decision Record (ADR) chính thức. Không sửa BRD hoặc các phụ lục Approved trong bước này.
