# OUR SPACE — CODEX GOAL: BUILD ALL P0 (M01–M10)

**Trạng thái:** LỆNH THỰC THI DÀNH CHO CODEX — không phải cam kết hệ thống đã lập trình.
**Goal version:** V1.1 + Product Owner PUBLIC amendment, 2026-10-23.
**Mốc nguồn:** OurSpace.zip cung cấp ngày 23/10/2026.
**Chế độ mong muốn:** Codex Goal/agent được quyền đọc, sửa code, chạy lệnh, test và lặp lại cho đến khi hoàn thành hoặc gặp chặn thật sự.
**Mục tiêu cao nhất:** Xây một website Our Space riêng tư cho đúng hai tài khoản, hoàn thiện **100% P0 của M01–M10** trên desktop và mobile, với khả năng triển khai, export, backup/restore và kiểm thử thực tế. Không thay P0 bằng mock/demo/screenshot.

> **BẮT ĐẦU LÀM NGAY.** Bạn (Codex) đang ở root dự án có thư mục `Docs/`. Đây là một work order dài hạn. Không chỉ tóm tắt kế hoạch, không tạo thêm 10 vòng tài liệu, không dừng sau scaffold hay POC đầu tiên. Hãy thi công theo các giai đoạn bên dưới; trong **mỗi giai đoạn phải chia thành nhiều phần nhỏ**, kiểm thử rồi **commit và push từng phần** lên nhánh triển khai riêng (khi đã xác minh remote PUBLIC và có quyền push), trước khi tiếp tục phần tiếp theo. Chỉ dừng nếu bị chặn bởi yếu tố không thể tự giải quyết an toàn (thiếu quyền/truy cập account, chính sách chưa được chủ dự án duyệt, hoặc rủi ro xóa dữ liệu không có backup). Không tuyên bố DONE nếu không có bằng chứng.

## A. File nền và cách khởi động

Tại thời điểm bàn giao, toàn bộ tài liệu gói mới nằm **cùng một thư mục `Docs`**:

- `Docs/00_OURSPACE_CODEX_GOAL_RUN_ALL.md` — file này, chỉ dẫn triển khai.
- `Docs/01_OURSPACE_MASTER_SPEC_APPROVED.md` — bản hợp nhất 10 BRD và phụ lục chính sách, giữ nguyên nội dung từng tệp.
- `Docs/02_OURSPACE_SOURCE_ARCHIVE.zip` — **bản nguyên trạng** `OurSpace.zip` do người dùng đưa, chứa BRD gốc, policy gốc, Reviews CSV/MD và video tham chiếu.

Chỉ `01_OURSPACE_MASTER_SPEC_APPROVED.md` và 11 tệp chính thức tương ứng trong archive mang tính **approved**. Các tài liệu `Reviews/**` có trạng thái DRAFT/PROPOSAL là tài liệu hỗ trợ, **không tự nâng thành chính sách**. Trong ZIP hiện tại **không có** `OUR_SPACE_PROJECT_HANDOFF_V2.0.md`; đừng bịa nguồn.

### Lệnh đầu tiên cho Codex

1. Xác nhận root workspace thực sự là Our Space, xem Git status, Git remote/branch và các file đang có. **Không ghi đè hoặc xóa dữ liệu cá nhân/untracked files.** Nếu root có tài liệu cũ, so SHA theo archive rồi giữ backup khi dọn; ưu tiên làm code bên ngoài `Docs/`.
2. Tạo `Docs/03_OURSPACE_BUILD_REPORT.md` **một file duy nhất** cập nhật liên tục: môi trường, các lựa chọn kỹ thuật, tiến độ từng stage **và từng commit/push**, AC/P0/E2E mapping, test evidence, blockers, tài liệu chạy local/deploy/restore. Không rải ra thêm các báo cáo Markdown lặp lại.
3. Mở `Docs/01_OURSPACE_MASTER_SPEC_APPROVED.md` theo từng module; trích riêng source từ `Docs/02_OURSPACE_SOURCE_ARCHIVE.zip` **khi cần** để tra cứu và so checksum. Không dùng tài liệu Review cũ có chữ `CHƯA CÓ` để phủ nhận Policy Supplement đã duyệt sau đó.
4. Ghi bảng trạng thái từ `NOT_STARTED` cho toàn bộ Stage 00–15. Tiếp tục thực thi tự động theo thứ tự phụ thuộc, không hỏi duyệt lại Dxx/DEC đã khóa.
5. Verify workspace, Git status, branch and origin https://github.com/MinhQuun/OurSpace. PUBLIC is approved by the Product Owner. Use codex/ourspace-build; verify push access before substantial implementation. Never force push or merge into master.
6. Nếu không có credentials Supabase/Vercel: dùng môi trường local phù hợp (ví dụ Supabase local CLI + Docker hoặc PostgreSQL local; dùng tài khoản test). Xây đầy đủ code, migrations và tests trước; ghi bước người dùng phải thao tác để triển khai cloud. **Không hard-code credentials, không commit .env.**

## B. Nguồn chính thức, phạm vi và những điều không thể thương lượng

**Nguồn phê duyệt:** 10 BRD M01–M10, 247 Dxx; `Docs/01...` có nguyên văn; 7 DEC (A1..A5) trong Approved Policy Supplement.
**Nguồn kiểm thử tham khảo:** `Reviews/Acceptance/OUR_SPACE_MASTER_P0_ACCEPTANCE_MATRIX_DRAFT_V1.0.md` (86 nhóm P0, 40 E2E, 763 AC), `...BRD_AC_TRACEABILITY_763...csv`, `...DXX_TRACEABILITY_247...csv` và `Reviews/Contracts/...CT01_CT08...md`, nằm trong archive.
**Nguồn chính sách chưa duyệt:** `Reviews/Readiness/OUR_SPACE_OP01_OP07_CLOSURE_PROPOSAL_V1.0.md`; cả 7 OP vẫn ở mức đề xuất.

Quy tắc bắt buộc:

- **Hai account độc lập**; mọi nội dung mặc định **Private**; phân quyền theo object và linked child; chống leak qua count, search, preview, deep link, export, notification, storage, realtime và các phép tính tổng.
- Một nguồn dữ liệu chính thức/owner cho mỗi nghiệp vụ. M05 sở hữu Calendar Event, M07 sở hữu Expense/Budget/Savings, M02 sở hữu Media, M09 chỉ comment/reaction trên nguồn, M10 sở hữu accounts, security, notifications và lifecycle.
- Không xóa cascade dữ liệu xuyên module; có Trash 30 ngày, Export, Backup/Restore thực tế, không hồi sinh quyền đã revoke.
- M01 có **Simple và Advanced Editor**, realtime đồng thời hai người, mobile canvas/undo/publish/PDF; Published immutable về bản ghi nhưng mỗi lần phục vụ media vẫn kiểm tra quyền.
- M08 giữ seal/snapshot và original unlock_at, **không mở sớm**; M10 D35 Pause khi Disconnect, không tự unpause/reveal khi Reconnect.
- M07 tính tiền bằng decimal/integer minor units và giao dịch an toàn, có consent, idempotency; không đánh tráo pending thành paid/confirmed.
- Notification và jobs không thay đổi trạng thái business thay cho hành động được phê duyệt; retry không gửi trùng hay double-settle.
- **P0 desktop + mobile đầy đủ**; không coi một giao diện mobile chỉ đọc là đạt.
- P1/P2 KHÔNG tự gộp vào gate phát hành. 763 AC tổng cộng không mặc nhiên toàn bộ là P0; phân loại theo BRD gốc, chứng minh từng AC P0.

### Bảo vệ quyết định chưa được duyệt

- OP-01..OP-07 chưa approved. Codex có thể xây cấu trúc linh hoạt/configurable, chạy test với dữ liệu thử, **nhưng không tự đặt retention/backup purge deadline, quyền hủy Capsule đồng sở hữu hoặc chính sách đối soát gây thay đổi quyền/nghĩa vụ thật**. Khi một nghiệp vụ đòi một quyết định OP chưa duyệt, đánh dấu `POLICY_BLOCKED`, khóa hoặc làm an toàn hành vi tương ứng trong bản phát hành, tiếp tục các phần độc lập. Ghi **một danh sách câu hỏi thật sự cần PO duyệt** tại cuối report; không âm thầm chọn A cho OP.
- Codex được quyền chọn **chi tiết kỹ thuật** (thư viện, cấu trúc code, schema, route, testing, Docker, caching) để hoàn thành baseline. Nếu thư viện đề xuất không đạt, đổi thành phần cụ thể và ghi lý do; không hạ nghiệp vụ xuống mức demo.
- Không phá cấu trúc repo, không đụng tới tài khoản cloud thực, hạ tầng có chi phí, dữ liệu thật hoặc triển khai production khi chưa có sự cho phép và quyền truy cập hợp lệ.

## C. Kiến trúc ứng viên (cần kiểm chứng, không phải áp đặt bất chấp bằng chứng)

- Frontend: **Next.js / React / TypeScript / Tailwind CSS**; giao diện responsive, accessible.
- Backend: **TypeScript modular monolith**, có tách domain M01..M10, service/data access rõ ràng; API/server actions kiểm quyền tại server.
- Database: **PostgreSQL** do Supabase quản lý khi triển khai; local Supabase nếu khả thi, RLS và transaction là bắt buộc khi dùng trực tiếp từ client. Không đưa service role key đến browser.
- Auth: Supabase Auth là ứng viên, **kiểm chứng MFA TOTP + recovery codes P0**. Nếu Supabase thiếu recovery codes, cần lớp recovery tự quản được security-test hoặc đổi riêng Auth, không loại D10.
- Storage: private object storage, original/variant/document tách định danh, download proxy/recheck ACL khi revoke quan trọng; backup bytes riêng với DB.
- M01: canvas/editor có thể dùng React Konva, Tiptap, Yjs/Hocuspocus; chỉ chọn sau POC về concurrent edits, undo per actor, reconnect và mobile.
- Jobs: transactional outbox/idempotency + scheduler/worker bảo đảm retry. M08 unlock không phụ thuộc device clock.
- Hosting: Vercel + Supabase ứng viên, WebSocket collaboration service có thể cần host riêng. **Không mặc định WebSocket giữ ổn định chỉ vì có tài liệu quảng bá**; POC thực tế.
- Trước khi pin versions / SDK APIs: kiểm tra version compatible hiện có, lockfile và official docs. Không bịa API hay biến môi trường.

## D. Quy trình tự thực thi của Goal mode

Mỗi stage đều theo vòng lặp **đọc yêu cầu đúng nguồn → thiết kế tối thiểu → code/migration/UI → tests → chạy thực tế local → sửa lỗi → ghi kết quả → stage kế**.

**Các tiêu chuẩn chung để stage được coi DONE:**

1. Có code chức năng thật, màn hình desktop/mobile, server-side permission, trạng thái lỗi/trống/loading, input validation và migration.
2. Có unit tests các nghiệp vụ chính, API/integration tests cả allow/deny, E2E thực với hai users ở kịch bản được liệt kê; kết quả PASS trong lần chạy hiện tại, không chỉ thêm file test.
3. Có lệnh build/lint/typecheck/tests thực thi và bằng chứng đầu ra, không ẩn failing tests, không dùng `skip` để đánh dấu DONE.
4. Các AC P0 thuộc stage có evidence; nếu chưa đủ, stage phải ở `IN_PROGRESS`/`BLOCKED` dù UI trông có vẻ xong. Những bước cần cloud user action đánh dấu `EXTERNAL_BLOCKED`, không giả hoàn thành.
5. Migrations có thể chạy nhiều lần an toàn; rollback/recovery có hướng dẫn; không mất dữ liệu và không tạo nguồn tiền/thời gian trùng.
6. Mọi thông số phải phân biệt `APPROVED`, `TECHNICAL_CHOICE`, `POLICY_BLOCKED`; không tự sửa 10 BRD hay Supplement.
7. Sau **mỗi lát cắt công việc**: cập nhật report, chạy kiểm thử tương ứng, commit có phạm vi rõ và push ngay nếu remote an toàn; xác minh remote SHA. Cuối mỗi stage tổng kết đầy đủ commit hash, trạng thái push, lệnh đã chạy, số test PASS/FAIL, blockers và bước kế. Giữ report là một nguồn trạng thái duy nhất.

Nếu lỗi môi trường (network package registry, Docker, thiếu Git/công cụ): khắc phục điều kiện kỹ thuật hoặc tiếp tục phần code/test không cần nó; ghi chính xác điều không chạy được và các bước tái lập. Không điền kết quả PASS giả.

## D.1. GIT-FIRST — COMMIT NHỎ & PUSH LIÊN TỤC (BẮT BUỘC, ƯU TIÊN CAO)

**Mục đích:** 16 stage là *nhóm công việc*, **không phải 16 commit**. Mỗi stage phải chia ra các thay đổi chức năng nhỏ, có thể đọc review, test và rollback riêng. **Không gom toàn bộ một module hay hàng nghìn dòng unrelated thành một commit khổng lồ.** Quy tắc này áp dụng từ STAGE 00 đến STAGE 15 và cao hơn các chỉ dẫn cũ nói chỉ commit cuối stage.

### D.1.1. Chuẩn bị repository và quyền push an toàn

1. PUBLIC repository is the official Product Owner choice. Audit tracked files and commit history before pushing. Never commit or push secrets, real user data, or sensitive personal documents. Report historical exposure risks without rewriting history. Application data remains protected by Authentication and Authorization.
2. Nếu workspace chưa có Git: tạo repo Git **trong đúng root** (không `git init` ở thư mục cha hoặc `Docs`); thiết lập `.gitignore` bao gồm `.env`, `.env.*` (ngoại trừ `*.example` không chứa secrets), `node_modules`, `.next`, logs, generated dumps, backups, local media và dữ liệu thực tế. Không xóa file người dùng; chỉ tạo `.gitignore` theo nguyên tắc an toàn.
3. Tạo hoặc chuyển sang **nhánh triển khai riêng** `codex/ourspace-build` từ trạng thái nền hợp lệ. Không push trực tiếp vào `main`/`master`; không tự merge/force-push/rebase-history, không xóa nhánh. Nếu đang ở repo có thay đổi do người dùng tạo, bảo toàn và xử lý cẩn thận trước khi tạo branch.
4. **Remote chưa cấu hình/không có quyền:** chỉ commit local các bước nền tảng an toàn, ghi `GIT_REMOTE_BLOCKED`, và dừng trước khi tích lũy khối lượng code lớn; người dùng cần cung cấp Git remote PUBLIC và xác thực qua công cụ Git/credential helper. Không bịa remote URL, không yêu cầu paste token/password trong chat, không tự public hóa tài liệu.
5. **Remote đã có và được xác minh PUBLIC:** push nhánh đầu tiên bằng `git push -u origin codex/ourspace-build`. Mỗi commit tiếp theo phải push ngay lên cùng nhánh. Chỉ mở PR khi có quyền/remote phù hợp; không tự merge PR hoặc triển khai production.

### D.1.2. Nhịp commit bắt buộc — một lát cắt logic, một commit

- **Trước khi code mỗi lát cắt:** liệt kê phạm vi file, yêu cầu Dxx/AC/P0 liên quan và tiêu chí test; tách công việc sao cho commit chỉ chứa **một thay đổi logic** (ví dụ `chore: init app`, `feat(auth): add login UI`, `feat(auth): deny private asset access`, `test(auth): add revoke regressions`, `feat(media): upload asset`, `fix(calendar): correct recurrence instance`). Có thể chia nhiều commit cho một P0 family; migrations/schema cần gắn cùng phần code phụ thuộc để mỗi commit không làm hỏng baseline.
- **Sau khi code:** kiểm tra diff và phạm vi bằng `git diff --check`, `git status --short`, `git diff --stat`; chỉ stage **file thuộc lát cắt** với `git add <path...>`, tránh `git add -A` vô điều kiện. Không stage `.env`, tokens, secret recovery codes, private data, database dumps, source ảnh/video thật, `node_modules` hoặc build artifacts. Chạy secret scan và kiểm tra Git tracked files; archive chỉ được push sau gate ki?m tra secrets v? d? li?u nh?y c?m.
- **Quality gate trước commit:** chạy ít nhất lint/typecheck và unit/integration tests liên quan; thay đổi schema thì chạy migration test; auth/ACL thì chạy negative security tests; finance/capsule/realtime thì chạy bộ regression tương ứng. `build` và E2E chạy ở những commit có ảnh hưởng hoặc khi kết thúc lát cắt/stage; không dùng tests giả, bỏ qua failing tests hay tự đổi expectations chỉ để pass. Nếu code chưa đạt thì sửa trước khi commit; đừng gộp nhiều nhiệm vụ đang lỗi vào commit sau.
- **Commit:** dùng Conventional Commits có scope, ví dụ `feat(m02): private media upload and permission tests`. Commit description chứa `Stage`, `Related: Mxx Dxx / P0-... / AC...` khi đã có chứng cứ nguồn. Nếu không có mapping chắc chắn ghi `unmapped` thay vì bịa.
- **Push ngay sau commit:** `git push origin codex/ourspace-build`. Sau đó xác minh upstream/remote SHA (`git rev-parse HEAD`, `git ls-remote --heads origin codex/ourspace-build` hoặc `git status -sb`). **Không báo PUSHED nếu chưa xác minh kết quả.** Ghi commit hash, files, test results, remote branch và PUSHED/LOCAL_ONLY/BLOCKED trong `Docs/03_OURSPACE_BUILD_REPORT.md`.
- **Báo cáo cũng phải nằm trong lịch sử Git:** cập nhật report trước khi chốt commit. Nếu cần thêm bằng chứng push sau commit, dùng **commit nhỏ riêng cho nhật ký** và push ngay, hoặc giữ trạng thái push dưới dạng thông tin tiến độ ngoài commit đang chuẩn bị; tránh vòng lặp tự tạo commit vô hạn mỗi lần cập nhật hash của chính commit đó.
- **Commit sạch và có thể quay lui:** không tự `git commit --amend` trên commit đã push, không squash liên tục khiến mất mốc tiến độ, không dùng `--force`/`--force-with-lease`, không reset cứng hoặc sửa lịch sử để che lỗi. Sửa bằng commit tiếp theo hoặc revert có kiểm chứng khi cần.

### D.1.3. Khi push lỗi, CI lỗi, hoặc Codex bị ngắt

- Nếu push thất bại vì network/auth/permission/non-fast-forward/remote không PUBLIC: tối đa thử lại an toàn sau khi kiểm tra nguyên nhân, **không dùng force push**; ghi `GIT_PUSH_BLOCKED` cùng stderr không chứa secrets. Không chuyển sang stage mới làm hàng loạt thay đổi không được sao lưu từ xa. Việc cần quyền truy cập phải hỏi người dùng một lần rõ ràng.
- Nếu remote CI phát hiện lỗi: ghi lại kết quả, tạo **commit sửa lỗi nhỏ tiếp theo**, chạy lại và push; stage không DONE cho đến khi các kiểm thử bắt buộc pass. Không tự vô hiệu hóa CI/tests.
- Nếu phiên Codex bị ngắt: lần sau đọc report, `git status -sb`, log các commit mới nhất và trạng thái upstream; tìm lát cắt chưa được push/test, tiếp tục từ đó. **Không scaffold lại, không reset, không tạo commit trùng.**
- **Push authorization:** The Product Owner authorizes safe source commits and pushes to origin/codex/ourspace-build on the PUBLIC repository. This does not authorize visibility changes, billing, production deployment, or publishing sensitive data.

### D.1.4. Mẫu chia nhỏ commit (hướng dẫn, không giới hạn số commit)

| Stage | Ví dụ lát cắt có thể commit/push độc lập |
|---|---|
| 00–01 | Git baseline → Next.js scaffold → lint/typecheck/test → Docker DB config → migrations → CI |
| 02–03 | Account models → login/logout → pairing → base ACL → revoke protection → MFA/recovery → lifecycle |
| 04 (M02) | Media schema → private upload → thumbnail/variants → gallery → share-copy ACL → trash/export |
| 05 (M01) | Book/page schema → Simple Editor → Canvas Advanced → media insertion → realtime CRDT → undo → Publish/PDF |
| 06–09 | Canonical M05 Event → recurrence → M03 Place → Date Plan links → M04 Trip → M06 Wish/Goal progress |
| 10 (M07) | Exact money primitives → Expense → splits/approval → settlement → refunds/FX → finance export/tests |
| 11–13 | M08 Seal → reveal gates → disconnect pause → M09 comments/reactions → M10 notification/settings |
| 14–15 | backup DB → backup storage → restore drill → E2E suites → staging configuration → handoff |

**Stage exit bổ sung:** Stage chỉ được `DONE` khi **tất cả lát cắt cần thiết đã có commit được push và xác minh trên remote PUBLIC**, các test tương ứng đã chạy đạt và report cập nhật đúng. Nếu push chưa thể thực hiện: giữ `BLOCKED`/`GIT_PUSH_BLOCKED`, không ghi `DONE` chỉ vì code local chạy.

## E. Giai đoạn thực thi chi tiết

### STAGE 00 — Audit workspace và dựng baseline truy vết

- Xác nhận đúng 11 approved sources bên trong master, checksum, 247 Dxx/763 AC (CSV draft để kiểm kê), 86 P0 families và 40 E2E; *không* coi những số đếm là nghiệm thu.
- Giải nén archive vào vùng staging tạm **chỉ khi cần** để đọc theo file, không copy tài liệu phân tán vào project lâu dài.
- Lập requirements registry machine-readable trong code/test với trường `source`, `module`, `P0/P1/P2`, `owner`, `test`, `status`. Map 60 Dxx chưa có bảng Dxx→AC trực tiếp bằng evidence mới hoặc đánh dấu `UNMAPPED`, không gán bừa.
- Tạo report hợp nhất, environment checklist, `.gitignore`; kiểm tra Git repo/remote PUBLIC/branch và bảo toàn file người dùng. Thiết lập chu kỳ commit nhỏ rồi push theo D.1 trước khi triển khai đáng kể.
- **Exit:** được truy vết yêu cầu, phân biệt approved vs draft, bootstrap repo sạch, không làm mất file.

### STAGE 01 — Skeleton, local environment và CI

- Scaffold Next.js TypeScript với cấu trúc domain modules M01..M10, routing, UI components, tests (unit, integration, E2E), format/lint/typecheck.
- Setup local PostgreSQL/Supabase, migration/seed cho hai users test; environment template không có secret; Docker/CLI/CI repeatable. Tách scaffold, môi trường, migration, test runner và CI thành các commit riêng có push.
- Thiết kế source-of-truth ownership và event/outbox, idempotency, audit trail, permission policy library trước khi làm UI hàng loạt.
- **Exit:** dev server chạy thật; DB migrations migrate/reset được; các lệnh lint/typecheck/test/build chạy; basic CI.

### STAGE 02 — POC bảo mật/M10 nền tảng (bắt buộc trước module khác)

- Auth signup/login/logout, email verification, 2 độc lập accounts, secure sessions, invitation/pairing, disconnected/frozen states, object ACL, permission inspector cơ bản.
- TOTP + **recovery codes** theo M10 D10; không chấp nhận recovery bằng backdoor. RLS deny-by-default, no direct-URL/storage/session/realtime leaks; test pair không tự share Private.
- Shared parent/private linked child: API, preview, search, aggregate, counts, download, export và revoked signed URL/active channel.
- **Exit:** chạy POC security deny/allow với hai account; nếu phương án Auth không đạt D10, đổi component hoặc đánh BLOCKED, không xóa yêu cầu.

### STAGE 03 — Shared platform, M10 nền tảng và lifecycle

- Account profile, locale/theme/appearance, personalized home, space settings, invitations/reconnect, Privacy/Permission Inspector, sessions, 30-day Trash Center, export jobs, safe notification infrastructure.
- Shared common services: identity, media refs, occurrence/ref IDs, outbox, audit, soft delete/restore semantics, anti-resurrection ACL.
- **Exit:** các user journeys P0-M10 có code thật; những nghiệp vụ cần modules sau tiếp tục tích hợp ở STAGE 13–14.

### STAGE 04 — M02 Media Library

- Multiple upload/retry/dedup, private original, variants non-destructive, album/smart basics, Gallery/Viewer/Search/favorites, sharing 3 ways (Keep Private, Share Existing, Shared Copy), usage references, trash/restore/export/storage dashboard.
- Không expose object storage trực tiếp trái ACL; media owner vẫn M02 khi đưa vào Photobook/Trip/Moment.
- **Exit:** 8 P0 families M02 chạy UI + API + 2-user permission tests, mobile tương đương.

### STAGE 05 — M01 Photobook & Diary (POC realtime quan trọng)

- Photobook/Page/Diary domain; Simple templates (đủ theo BRD), Advanced Canvas, text/media/stickers/layout, chuyển chế độ không mất layer, drag/resize/touch/keyboard, Reader.
- Collaboration với two independent sessions: simultaneous edits, same-object conflicts, reconnect, offline, per-user undo, ordered state, server-side reauthorization khi revoke/disconnect, immutable Published, revision/restore, PDF permission-filtered.
- POC xác minh lựa chọn Yjs/Hocuspocus hay thay thế; không giả realtime bằng polling hoặc optimistic UI đơn giản.
- **Exit:** 10 P0 families M01, chạy trình duyệt desktop lẫn viewport mobile; test xung đột và revoke khi đang sửa; PDF kiểm quyền.

### STAGE 06 — M05 Couple Calendar

- Calendar Month/Week/Day/Agenda, Event canonical, RSVP, recurrence series/occurrence/this-and-following, anniversary/date precision, Feb-29/day31/DST, reminder/Quiet Hours, conflicts và Busy/Free privacy.
- Calendar link API cho M03/M04, idempotent create/link/cancel/unlink, không clone event.
- **Exit:** 8 P0 families M05, timezone/DST tests, cancel/unlink không cascade.

### STAGE 07 — M03 Food & Places

- Place types/categories/branch, search/details/tags, personal/shared Place Wishlist (khác M06 Wish), Date Plans, Visits/Reviews, menu items optional, favorites/revisit/random picker/insights; links M02, M05 và M07.
- **Exit:** 8 P0 families M03, visible-scope analytics, date plan → canonical calendar Event và retry-safe.

### STAGE 08 — M04 Travel & Trip Planner

- Trips Dreaming/Quick/Full, itinerary & activities, booking/transport/accommodation documents, packing/preparation, collaboration, links tới Places, Calendar, Media, Finance và Diary, Recap/export.
- Phân biệt budget/estimated vs actual expense; Booking Document Private không rò qua Trip Shared.
- **Exit:** 8 P0 families M04, archive/restore không xóa nguồn xuyên module.

### STAGE 09 — M06 Bucket List & Goals

- Wish & collections, conversion Wish→Goal, checklist/numeric/outcome/linked goals, tasks/milestones/progress, approvals, achievement, inspiration board, liên kết financial metrics với ACL và stale state.
- **Exit:** 8 P0 families M06; không auto-complete Goal do metric đến 100% nếu BRD cần confirmation.

### STAGE 10 — M07 Budget & Savings (transaction-heavy)

- Expense multi-payer, split equal/fixed/percentage/weighted, partial approval, debts/settlements, partial payment, refunds/adjustments, budgets/alerts, savings contributions/withdrawals, recurring expenses, currencies/FX, privacy-safe reporting/export.
- PostgreSQL transactions, exact money representations, immutable-ish ledger/audit, idempotency/optimistic concurrency; migration and compensation for retry.
- **Exit:** 10 P0 families M07, race conditions, negative auth tests và 101001 VND/2 test. Những nét OP-03/04 vẫn chưa approved phải đánh POLICY_BLOCKED phần phụ thuộc; không tự chọn quy tắc tài chính thật.

### STAGE 11 — M08 Special Moments

- Moments/milestones, Love Letters, Secret Surprises, Collaborative Time Capsules, permissioned media snapshot, immutable Seal snapshot/time, trusted unlock, recipient-specific delivery/reveal/opened states, Disconnect D35 pause/reconnect explicit consent.
- Scheduler/retry chỉ xử lý giao nhận có quyền; access gate kiểm tại request-time; security tests fake device clock, signed URL, export and direct links.
- **Exit:** 8 P0 families M08, không early Reveal; no duplicate scheduled delivery; các trường hợp tranh chấp OP-02 còn mở phải được đánh đúng trạng thái.

### STAGE 12 — M09 Couple Interaction

- Reaction đúng 6 loại theo BRD, comments/replies, mentions/feed đúng nguồn và ACL, notifications link, source removal/revoke behavior, export/Trash/Restore.
- **Không** xây chat độc lập; M09 không được tạo/rewrite Expense, RSVP, Goal Completion hay Moment Reveal.
- **Exit:** 8 P0 families M09, Secret/Private không lộ qua comment count, mention, feed hoặc notification.

### STAGE 13 — Cross-cutting completion cho M10, notifications và lifecycle

- Hoàn thiện M10 P0 Home personalization, Privacy Inspector, Notification Center/Prefs/Quiet Hours, settings, pairing/disconnect/reconnect, center-wide export/trash và thao tác xuyên 10 module.
- Consolidate source ownership, CT01..CT08 contract tests; rà soát 24 CR và 7 DEC Approved; tất cả entrypoint UI/admin/job/backup/restore đều tuân thủ ACL.
- **Exit:** 10 P0 families M10 và cross-module journeys chạy thật trên cả mobile/desktop.

### STAGE 14 — Backup/Restore, hardening và kiểm thử đủ P0

- Automated backup database **và** media/files **và** trạng thái đồng bộ editor/jobs; restore drill bằng dataset thử có Two Users/Permissions/Finance/Capsule/Deleted items.
- Không replay lịch sử thành settlement/notification trùng, không hồi sinh revoked ACL, không thay `unlock_at`, không đưa Private vào export. Kiểm thử Trash ≥30 ngày, export ownership và quyền các bản sao.
- Xuất release report cho **86 P0 families + 763 AC có scope rõ + 40 E2E** với trạng thái real PASS/FAIL/BLOCKED và chứng cứ run thật, desktop/mobile.
- Test performance, accessibility, rate limiting, CSRF/XSS, injection, secrets, signed URL leak, reconnect/offline, concurrency, CI/dependency audit.
- **Exit:** chỉ khi mọi P0 của M01–M10 + critical security/finance/capsule/restore test pass và policy blockers được giải quyết hợp lệ mới được gắn `RELEASE_READY`.

### STAGE 15 — Staging/deploy & final handoff

- Chuẩn bị production/staging config, repeatable migrations, seed demo an toàn, backup scheduling/restore checklist, incident plan và chi phí rõ ràng; **không triển khai production hay bật billing không có user approval**.
- Staging deploy nếu có credentials/phê duyệt và môi trường phù hợp; verify trên thiết bị thực hoặc automation viewport, 2-user smoke tests, monitoring/logs không lộ dữ liệu.
- Report cuối ghi URL truy cập (chỉ nếu thật), test evidence, remaining blockers, hướng dẫn setup, rollback, restore; không tuyên bố V1.0 nếu chưa đạt 100% P0.

## F. 86 P0 families — checklist tối thiểu theo module

Bảng dưới là **index**, không thay thế 763 AC và phần P0 nguyên gốc của mỗi BRD. Khi làm từng stage, dùng file `Reviews/Acceptance/...MASTER_P0...` trong source ZIP để đọc expected cụ thể và source references. **Không tự tick PASS chỉ vì viết được UI.**

### M01 — 10 nhóm

- [ ] `P0-M01-01` — Photobook Library / Create / Overview / Reader (desktop + mobile + permission + test evidence).
- [ ] `P0-M01-02` — Page Manager / layouts (desktop + mobile + permission + test evidence).
- [ ] `P0-M01-03` — Simple Editor / templates (desktop + mobile + permission + test evidence).
- [ ] `P0-M01-04` — Advanced Editor (desktop + mobile + permission + test evidence).
- [ ] `P0-M01-05` — Realtime 2 accounts (desktop + mobile + permission + test evidence).
- [ ] `P0-M01-06` — Permissions Page/Book (desktop + mobile + permission + test evidence).
- [ ] `P0-M01-07` — Diary & Snapshot (desktop + mobile + permission + test evidence).
- [ ] `P0-M01-08` — Publish/Version/History (desktop + mobile + permission + test evidence).
- [ ] `P0-M01-09` — PDF Export (desktop + mobile + permission + test evidence).
- [ ] `P0-M01-10` — Archive/Trash 30d/Restore (desktop + mobile + permission + test evidence).

### M02 — 8 nhóm

- [ ] `P0-M02-01` — Upload batch/retry/dedup (desktop + mobile + permission + test evidence).
- [ ] `P0-M02-02` — Gallery / Viewer / Search (desktop + mobile + permission + test evidence).
- [ ] `P0-M02-03` — Manual Album / Smart basic (desktop + mobile + permission + test evidence).
- [ ] `P0-M02-04` — Photo Edit variants (desktop + mobile + permission + test evidence).
- [ ] `P0-M02-05` — Asset sharing/permissions (desktop + mobile + permission + test evidence).
- [ ] `P0-M02-06` — Cross-module Asset reuse (desktop + mobile + permission + test evidence).
- [ ] `P0-M02-07` — Trash/Restore/Export (desktop + mobile + permission + test evidence).
- [ ] `P0-M02-08` — Storage dashboard/Backup (desktop + mobile + permission + test evidence).

### M03 — 8 nhóm

- [ ] `P0-M03-01` — Place categories & branches (desktop + mobile + permission + test evidence).
- [ ] `P0-M03-02` — Place search/details/tags (desktop + mobile + permission + test evidence).
- [ ] `P0-M03-03` — Wishlist Entry / Collections (desktop + mobile + permission + test evidence).
- [ ] `P0-M03-04` — Date Plan lifecycle (desktop + mobile + permission + test evidence).
- [ ] `P0-M03-05` — Visit & Review (desktop + mobile + permission + test evidence).
- [ ] `P0-M03-06` — Dish/Drink/Favorites/Revisit (desktop + mobile + permission + test evidence).
- [ ] `P0-M03-07` — Random Picker & Insights (desktop + mobile + permission + test evidence).
- [ ] `P0-M03-08` — Link & Export/Trash (desktop + mobile + permission + test evidence).

### M04 — 8 nhóm

- [ ] `P0-M04-01` — Trip lifecycle (desktop + mobile + permission + test evidence).
- [ ] `P0-M04-02` — Itinerary Activities (desktop + mobile + permission + test evidence).
- [ ] `P0-M04-03` — Transport/Accommodation/Booking (desktop + mobile + permission + test evidence).
- [ ] `P0-M04-04` — Packing/Preparation (desktop + mobile + permission + test evidence).
- [ ] `P0-M04-05` — Cross-source link (desktop + mobile + permission + test evidence).
- [ ] `P0-M04-06` — Privacy/collaboration (desktop + mobile + permission + test evidence).
- [ ] `P0-M04-07` — Trip Recap & Export (desktop + mobile + permission + test evidence).
- [ ] `P0-M04-08` — Archive/Trash/Restore (desktop + mobile + permission + test evidence).

### M05 — 8 nhóm

- [ ] `P0-M05-01` — Month/Week/Day/Agenda (desktop + mobile + permission + test evidence).
- [ ] `P0-M05-02` — Event/RSVP (desktop + mobile + permission + test evidence).
- [ ] `P0-M05-03` — Anniversary/date precision (desktop + mobile + permission + test evidence).
- [ ] `P0-M05-04` — Recurrence/Exception (desktop + mobile + permission + test evidence).
- [ ] `P0-M05-05` — Reminders/Quiet Hours (desktop + mobile + permission + test evidence).
- [ ] `P0-M05-06` — Conflict & Busy/Free (desktop + mobile + permission + test evidence).
- [ ] `P0-M05-07` — M03/M04 sync links (desktop + mobile + permission + test evidence).
- [ ] `P0-M05-08` — Search/history/Trash/Export (desktop + mobile + permission + test evidence).

### M06 — 8 nhóm

- [ ] `P0-M06-01` — Wish & Collections (desktop + mobile + permission + test evidence).
- [ ] `P0-M06-02` — Wish-to-Goal conversion (desktop + mobile + permission + test evidence).
- [ ] `P0-M06-03` — Goal four types (desktop + mobile + permission + test evidence).
- [ ] `P0-M06-04` — Task/Milestone/Progress (desktop + mobile + permission + test evidence).
- [ ] `P0-M06-05` — Confirmation/Achievement (desktop + mobile + permission + test evidence).
- [ ] `P0-M06-06` — Linked Goal privacy (desktop + mobile + permission + test evidence).
- [ ] `P0-M06-07` — Inspiration Board (desktop + mobile + permission + test evidence).
- [ ] `P0-M06-08` — Search/Export/Trash/Restore (desktop + mobile + permission + test evidence).

### M07 — 10 nhóm

- [ ] `P0-M07-01` — Money Spaces & ACL (desktop + mobile + permission + test evidence).
- [ ] `P0-M07-02` — Expense & Payers (desktop + mobile + permission + test evidence).
- [ ] `P0-M07-03` — Split & Approval (desktop + mobile + permission + test evidence).
- [ ] `P0-M07-04` — Settlement partial (desktop + mobile + permission + test evidence).
- [ ] `P0-M07-05` — Refund/Adjustment (desktop + mobile + permission + test evidence).
- [ ] `P0-M07-06` — Budgets & alerts (desktop + mobile + permission + test evidence).
- [ ] `P0-M07-07` — Savings Goals (desktop + mobile + permission + test evidence).
- [ ] `P0-M07-08` — Recurring expenses (desktop + mobile + permission + test evidence).
- [ ] `P0-M07-09` — Multi-FX (desktop + mobile + permission + test evidence).
- [ ] `P0-M07-10` — Reports/export/recovery (desktop + mobile + permission + test evidence).

### M08 — 8 nhóm

- [ ] `P0-M08-01` — Moments/collections (desktop + mobile + permission + test evidence).
- [ ] `P0-M08-02` — Milestone ↔ Anniversary (desktop + mobile + permission + test evidence).
- [ ] `P0-M08-03` — Love Letters (desktop + mobile + permission + test evidence).
- [ ] `P0-M08-04` — Secret Surprise (desktop + mobile + permission + test evidence).
- [ ] `P0-M08-05` — Capsule build/seal (desktop + mobile + permission + test evidence).
- [ ] `P0-M08-06` — Unlock & recipient state (desktop + mobile + permission + test evidence).
- [ ] `P0-M08-07` — Disconnect/Reconnect (desktop + mobile + permission + test evidence).
- [ ] `P0-M08-08` — History/Trash/Export/Backup (desktop + mobile + permission + test evidence).

### M09 — 8 nhóm

- [ ] `P0-M09-01` — Reactions six types (desktop + mobile + permission + test evidence).
- [ ] `P0-M09-02` — Comments/replies (desktop + mobile + permission + test evidence).
- [ ] `P0-M09-03` — Mentions/feed (desktop + mobile + permission + test evidence).
- [ ] `P0-M09-04` — Interaction modes (desktop + mobile + permission + test evidence).
- [ ] `P0-M09-05` — Domain integrations (desktop + mobile + permission + test evidence).
- [ ] `P0-M09-06` — Notifications (desktop + mobile + permission + test evidence).
- [ ] `P0-M09-07` — Trash/Export/Restore (desktop + mobile + permission + test evidence).
- [ ] `P0-M09-08` — Concurrency/mobile parity (desktop + mobile + permission + test evidence).

### M10 — 10 nhóm

- [ ] `P0-M10-01` — 2 Accounts & Pairing (desktop + mobile + permission + test evidence).
- [ ] `P0-M10-02` — Security sessions/MFA (desktop + mobile + permission + test evidence).
- [ ] `P0-M10-03` — Permissions/Inspector (desktop + mobile + permission + test evidence).
- [ ] `P0-M10-04` — Profile/theme/locale (desktop + mobile + permission + test evidence).
- [ ] `P0-M10-05` — Home customization (desktop + mobile + permission + test evidence).
- [ ] `P0-M10-06` — Notification Center (desktop + mobile + permission + test evidence).
- [ ] `P0-M10-07` — Export & Trash Center (desktop + mobile + permission + test evidence).
- [ ] `P0-M10-08` — Automated backup & recovery (desktop + mobile + permission + test evidence).
- [ ] `P0-M10-09` — Disconnect/Space lifecycle (desktop + mobile + permission + test evidence).
- [ ] `P0-M10-10` — Mobile + Desktop parity (desktop + mobile + permission + test evidence).

## G. 40 Cross-module E2E — bắt buộc run, không chỉ mô tả

Dùng toàn bộ `E2E-01` đến `E2E-40` từ master P0 draft bên trong `02_OURSPACE_SOURCE_ARCHIVE.zip` làm index test. Ưu tiên kiểm thử:

- Pairing không share Private; Shared Album/Book/Trip chứa linked Private; PDF/preview/search/count/notifications bị lọc đúng quyền.
- Hai account realtime edit/undo/reconnect/revoke; `Saved` chỉ khi persist/ack hợp lệ.
- M03/M04 → canonical M05 Event, retry, cancel/unlink, recurrence IDs; Feb29/day31/DST.
- Split 101001 VND, partial approval, refund after settlement, partial cross-currency FX, report private leak.
- M08 sealed capsule fake device clock, paused on Disconnect, explicit reconnect, recipient-specific opened, M09 mentions không leak.
- Delete/Trash/Restore, real recovery không hồi sinh quyền hoặc double-settle/resend.
- 10/10 module full P0 trên mobile **và** desktop.

Nếu một E2E tham chiếu OP chưa approved, chỉ chạy được phần thuộc Dxx/DEC đã khóa; ghi `POLICY_BLOCKED` cho outcome chưa có quyết định, **không áp kết luận của tài liệu đề xuất thành policy**.

## H. Lệnh và kỷ luật hoàn tất

- Cấu hình các scripts nhất quán khi scaffold: `dev`, `lint`, `typecheck`, `test`, `test:integration`, `test:e2e`, `build`, `db:migrate`, `db:seed:demo`, `backup:verify`, `restore:drill`. Tên/script tương đương được chấp nhận nếu có lệnh chạy thực và ghi rõ trong report.
- Không tự động xoá/truncate database chưa được chứng minh chỉ chứa data thử. Không commit API keys, recovery codes, cookie secrets, private media của người dùng hay log dữ liệu nhạy cảm.
- Tài khoản demo chỉ dành cho local/staging và cần thay hoặc xoá trước production. Không bypass authorization để tests dễ qua.
- Mỗi lần tiếp tục goal, **đọc `Docs/03_OURSPACE_BUILD_REPORT.md` trước**, kiểm tra Git branch/upstream/remote SHA, lát cắt chưa push và tiếp tục từ stage gần nhất chưa đạt, không tạo project mới lại từ đầu.
- Trạng thái cuối cùng cho phép: `RELEASE_READY` nếu đủ bằng chứng, `IMPLEMENTED_BUT_POLICY_BLOCKED` nếu còn OP phụ thuộc, `ENVIRONMENT_BLOCKED` nếu thiếu credentials/hạ tầng, hoặc `IN_PROGRESS` nếu còn P0. **Không tự báo DONE sai sự thật**.

## I. Mẫu nội dung `Docs/03_OURSPACE_BUILD_REPORT.md` (Codex tự tạo)

```markdown
# Our Space — Build Report
- Baseline: 10 approved BRD + 7 approved DEC A1-A5; OP01-07 proposed only
- Status: IN_PROGRESS / IMPLEMENTED_BUT_POLICY_BLOCKED / ENVIRONMENT_BLOCKED / RELEASE_READY
- Environment: actual versions, OS, DB runtime, deployment
- Workspace / Git branch / public remote verified / upstream / last local SHA / last pushed SHA:
- Stages: STAGE 00..15, each NOT_STARTED / IN_PROGRESS / DONE / BLOCKED
- AC coverage: by module, each ID source/scope/test/result/evidence
- P0 families: 0/86 PASSED with desktop/mobile evidence
- E2E: 0/40 PASSED with real run evidence
- Latest commands: commands and exit codes
- Commit/push ledger: stage, slice, commit SHA, scope/files, checks PASS/FAIL, PUSHED/LOCAL_ONLY/BLOCKED, verified remote SHA
- Security / Finance / Capsule / Restore gates:
- Approved tech choices and tradeoffs (technical only):
- Open OP blockers: concrete behavior + source + PO approval needed
- External blockers: credentials, hosting, domain, billing, real-device access
- Start/stop instructions, demo credentials management (no secret values)
- Backup/restore drill evidence and rollback
- Next autonomous step:
```

---

**LỆNH KẾT:** Bắt đầu STAGE 00 ngay sau khi đọc tài liệu này. Sau đó **triển khai theo từng lát cắt, commit nhỏ và push ngay sau khi kiểm thử đạt** cho đến STAGE 15 trong phạm vi môi trường/ủy quyền cho phép. Nếu có blocker, tiếp tục mọi phần độc lập rồi báo trung thực chính xác những gì người dùng cần thực hiện để mở chặn. Không yêu cầu người dùng ngồi chờ trong chat; Codex phải làm việc trong workspace thật và tự ghi bằng chứng.
