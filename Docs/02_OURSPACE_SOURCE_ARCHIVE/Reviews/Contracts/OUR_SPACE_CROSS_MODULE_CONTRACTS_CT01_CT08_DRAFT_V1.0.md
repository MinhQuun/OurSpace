---
document_id: OURSPACE-CROSS-MODULE-BUSINESS-CONTRACTS
version: 1.0
status: WORKING_DRAFT_FOR_VALIDATION
created: 2026-10-23
scope: CT-01..CT-08
policy_source: OUR_SPACE_APPROVED_POLICY_SUPPLEMENT_V1.0.md
tech_stack: NOT_SELECTED
architecture: NOT_DESIGNED
code: NOT_STARTED
---

# OUR SPACE — CROSS-MODULE BUSINESS CONTRACTS CT-01–CT-08 V1.0

**Trạng thái:** `WORKING_DRAFT_FOR_VALIDATION` — văn bản đặc tả hành vi liên phân hệ dựa trên BRD V1.0 và DEC-01–DEC-07 phương án A **đã duyệt**. Không phải một lần phê duyệt mới đối với các lựa chọn OP-01–OP-07 đang mở. Không sửa đổi 247 Dxx; khi có xung đột thực chất phải lập Change Request.

**Bản chất:** Đây là *hợp đồng nghiệp vụ và acceptance*, không phải API, database schema, service boundary, framework, vận hành hạ tầng hay code. Các mã `CT-x.Ryy` và `CT-x.Tyy` do tài liệu này đặt để truy vết; **không phải Dxx mới**.

## 0. Quy ước chung và nguyên tắc kiểm chứng

- Nguồn ưu tiên: BRD chính thức M01–M10 + Approved Policy Supplement DEC-01–DEC-07 A1–A5; Review Final chỉ là bằng chứng phân tích. Không dùng tên phân hệ để giả định quyền admin chéo.
- Actor là một trong hai tài khoản độc lập. `Space lifecycle`, `source permission`, `effective item permission`, `resource permission`, `business state`, `actor intention/confirmation`, `time eligibility` phải được đánh giá tách biệt.
- `DENIED` nghĩa là từ chối và **không** tạo side effect trái quyền; `UNAVAILABLE` là nguồn không dùng được nhưng không đồng nghĩa quyền bị cấp; `PENDING` không được coi là `CONFIRMED`; `FAILED` không được báo `SUCCESS`.
- Các nghiệp vụ liên phân hệ cần ghi rõ: nguồn sở hữu, người có quyền, nội dung thay đổi, chứng cứ consent, kết quả thành công/thất bại, hành vi retry, chính sách khi target bị thu hồi/xóa, và kiểm thử trên mobile lẫn desktop.
- ID dạng `M05:Event` hay `M07:Expense` là **tên miền nghiệp vụ**, không áp đặt API hay kiểu khóa; khi triển khai phải giữ tham chiếu ổn định.
- Hợp đồng mô tả `effective visibility` và state machine khái niệm, không cấp quyền bằng việc đổi UI mode. Tất cả thao tác nhạy cảm phải được kiểm tra lại tại thời điểm thực sự ghi/phục vụ nội dung.

## 1. Ma trận nguồn dữ liệu và write boundary

| Module nguồn | Canonical objects / business ownership | Consumer / hạn chế tác động |
|---|---|---|
| M01 | Book, Page, Element, Diary, Diary Snapshot, Publication | M02 chứa Media gốc; M09 có Comment/Reaction; M01 không được sửa original Media khi chỉnh Page. |
| M02 | Media Original, Variant, Album, Asset Grant | M01/M03/M04/M08 tham chiếu Asset có quyền; không tự xây PDF-document vault dưới danh nghĩa photo/video. |
| M03 | Place, Wishlist Entry, Date Plan, Visit, Review, Dish/Drink | M05 giữ Calendar Event; M07 giữ Expense; M04 giữ Trip Stop. |
| M04 | Trip, Itinerary, Activity, Booking, Transport, Accommodation, Trip Document | M05 giữ Event, M07 giữ chi phí đã phát sinh; Booking estimate khác Expense thực tế. |
| M05 | Event, Series, Occurrence, Anniversary, RSVP, Reminders | Date Plan/Activity link tới Event; thời gian Event khi linked thuộc M05. |
| M06 | Wish, Goal, Task, Milestone, Achievement, Inspiration | `M03 Wishlist Entry` không đồng nhất `M06 Wish`; M07 Savings balance không copy sang Goal. |
| M07 | Expense, Payer/Allocation, Approval, Settlement, Refund, Adjustment, Budget, Savings, FX snapshot | Consumer chỉ lưu link/projection, không sở hữu bản ghi tiền. |
| M08 | Moment, Letter, Surprise, Time Capsule, Sealed Snapshot, Reveal/Opened | M10 chi phối lifecycle Space và quyền; M09 không thể thay hành động Reveal. |
| M09 | Comments, Replies, Reactions, Mentions, Interaction Feed | Không tạo chat độc lập; comment ≠ review, RSVP, confirmation hay financial approval. |
| M10 | Account, Couple Space, Membership, Permission, Notification Center, lifecycle, Export/Restore governance | Không có super-admin đọc mọi Private; notification read không thay domain state. |

## 2. CT-01 — Effective Permission, Field/Linked Resource & Safe Projection

**Chủ trách nhiệm chính sách:** M10. **Nguồn:** M10 D13–D18/§11; M01 D06/D08; M02 D02/D12; M07 D27; M08 D25–D26; M09 source ACL; **DEC-01, DEC-02, DEC-03, DEC-05, DEC-07**. **CR:** 001, 002, 006, 010, 018, 020, 023.

**Đầu vào tối thiểu:** actor; source object + owner; permission hiện hành theo object/field; linked source grants; Space lifecycle; purpose/action; state và secret/reveal eligibility; phiên bản tài nguyên và thời điểm cung cấp. **Đầu ra:** `ALLOW` hoặc `DENY` và payload đã lọc theo actor; không trả nội dung ẩn làm metadata phụ.

| Rule | Hợp đồng bắt buộc |
|---|---|
| CT-01.R01 | New object **Private mặc định**; Pairing không tự nâng ACL đối tượng đã tạo. |
| CT-01.R02 | Shared parent không nâng quyền asset, child page, Diary, receipt, Booking doc, Expense, Savings, Capsule. Actor phải có cả quyền trên nguồn và quyền hành động ở đích. |
| CT-01.R03 | View, Edit, Comment, React, Download, Export, Share, Approve, Seal, Reveal, Restore là hành động phân biệt; quyền của M09 chỉ thu hẹp, không tăng ACL nguồn. |
| CT-01.R04 | Check cả title, cover, count, aggregate, badges, suggestion, search, activity feed, URL, PDF, notification, export, attachment, download, historical preview. Không lộ sự tồn tại khi bản thân existence là Secret. |
| CT-01.R05 | M02 asset được dùng theo Keep Private / Share Existing có consent / Create Shared Copy độc lập; snapshot Diary có scope đích được xác nhận, không mở Diary gốc. |
| CT-01.R06 | Nếu quyền được revoke sau khi mở tab, yêu cầu đọc/ghi mới phải reauthorize; no false save/approval. Cache/direct link không được trả bytes trái quyền mới. |
| CT-01.R07 | `actor-visible aggregate`: lọc dữ liệu **trước** khi tính tổng, so sánh, phần trăm và count. Không đưa số tổng all-users rồi trừ khoản hidden để lộ private. |
| CT-01.R08 | Export kiểm quyền lúc tạo và giao tệp, điều chỉnh redaction đúng quyền; hệ thống không khẳng định thu hồi được file đã tải hợp lệ bên ngoài. |

**Fallback/denial:** Nếu actor không được biết object tồn tại, hiển thị empty/không có kết quả thay vì nhãn mô tả bí mật. Nếu actor biết link tồn tại nhưng bytes đã mất quyền, có thể trả nhãn trung tính `Unavailable`, không kèm filename/cause/private owner. Lỗi check quyền fail-closed.

**Acceptance cases:**
- `CT-01.T01` A tạo Diary/Media Private → Pairing B; B không thấy cả search/count; thử link trực tiếp.
- `CT-01.T02` Shared Book có Page Private và Media Private → B Reader/thumbnail/PDF cùng bị lọc.
- `CT-01.T03` Create Shared Copy rồi revoke original → B chỉ có quyền trên copy, không vào original.
- `CT-01.T04` Shared Trip/Goal có Expense/Savings Private → total/report không suy ra amount.
- `CT-01.T05` B đang sửa Page thì A thu hồi Edit → mutation kế tiếp DENIED, A/B UI không báo Saved.
- `CT-01.T06` Secret Surprise chưa Reveal → Home, mention, notification, search không lộ existence.

## 3. CT-02 — Canonical Reference, Identity, Ownership & Retry

**Chủ ownership từng đối tượng:** theo bảng §1; chính sách liên kết M10. **Nguồn:** M03 §12, M04 §13, M05 §12, M06 §11, M07 D26/§9, M09 §2, DEC-04/05. **CR:** 011–014, 016–017, 021, 023.

| Rule | Hợp đồng bắt buộc |
|---|---|
| CT-02.R01 | Mỗi liên kết có source module/type/ID, consumer module/type/ID, purpose, state và actor+consent. Consumer không clone canonical object để đóng vai nguồn. |
| CT-02.R02 | Link Existing Expense khác Create Expense: retry ba lần cùng một intent không tạo ba Expense; Expense có thể có nhiều links mà chỉ tính một lần. |
| CT-02.R03 | M03 Date Plan/M04 Activity liên kết M05 Event ID duy nhất theo intent; Retry/Restore/Re-link không sinh bản sao mới khi quan hệ cũ vẫn có hiệu lực. |
| CT-02.R04 | Series vs Occurrence là scope bắt buộc. Split `This and following` giữ mapping/history, không trôi RSVP, comment, task/link sang một buổi khác. |
| CT-02.R05 | M09 target ổn định theo object ID, không theo thứ tự Page, tên Place hay thời gian recurrence hiển thị. |
| CT-02.R06 | `M03:WishlistEntry` và `M06:Wish` là hai thực thể khác: conversion/link có chủ đích, không đồng nhất/dedup tự động. |
| CT-02.R07 | Linked source Trashed/Purged/Revoke cho consumer một trạng thái an toàn; parent không cascade-delete; restore phải reauthorize và không resurrect grant cũ. |
| CT-02.R08 | Tài liệu PDF/vé/hóa đơn cần vòng đời và ACL tài liệu; photo/video M02 không mặc nhiên chịu sở hữu nghiệp vụ của mọi document. Chi tiết kho tài liệu vẫn là thiết kế kiến trúc sau này. |

**Acceptance cases:** `CT-02.T01` link Date Plan Event rồi retry; `T02` Split recurrence có RSVP/comment; `T03` một receipt liên kết Trip + Visit + Expense không nhân nợ; `T04` media/document purged không kéo xóa parent; `T05` re-link sau restore không mở quyền cũ; `T06` Wishlist Entry ≠ Wish; `T07` comment Page sau reorder vẫn đúng Page.

## 4. CT-03 — State, Time Semantics & Transition Safety

**Chủ theo domain:** M01/M02/M05/M07/M08/M10. **Nguồn:** M05 D09–D12; M08 D16–D23; M07 D04–D13; M10 D33–D38; **DEC-02, DEC-04, DEC-05, DEC-06**. **CR:** 004, 007–009, 014–015, 018, 020–023.

| Object | Trạng thái phải phân biệt | Transition/guard cấm vi phạm |
|---|---|---|
| M01 Book | Draft, Publication(immutable), Revision Draft, Archived, Trashed | Sửa Draft không thay bản Published; Publish cần quyền riêng. |
| M02 Media | original, variant; available, trashed, purged; grant | Revoke không cho phép variant/cache bypass. |
| M05 Calendar | Event status, Series/Occurrence, per-recipient RSVP | `date-only` không bị đổi ngày khi timezone khác; sửa một occurrence không tự sửa cả series. |
| M07 Finance | expense paid fact, payer, split allocation approval, debt confirmed, Settlement pending/confirmed, Refund/Adjustment | Pending≠Confirmed; correction không ghi đè lịch sử. |
| M06 Goals | progress candidate, verified achievement, confirmed completion | 100% linked metric không tự Completed; stale khác zero. |
| M08 Letters | Draft, Scheduled, Delivered; recipient Opened tách riêng | Notification read không tương đương Opened. |
| M08 Capsule | Draft, Ready, Sealed snapshot, Unlock Eligible, Paused, per-recipient Opened, Cancelled | `unlock_at` đã Seal bất biến; eligibility không tự Reveal; Secret gate cả existence. |
| M10 Space | Unpaired, Active, Frozen/Disconnect, Closed/Archived và account lifecycle tương ứng | Tạm ngừng chia sẻ không xóa dây chuyền, không unpause M08 tự động. |
| M10 Notification | queued/inbox/read/stale/hidden theo quyền | Quiet Hours không đổi trạng thái nghiệp vụ. |

**Quy tắc State/Time bắt buộc:**

- `CT-03.R01`: Status của từng object phải giữ nguyên owner/domain; không dùng notification state để suy ra domain state.
- `CT-03.R02`: `Pending`, `Confirmed`, `Eligible`, `Delivered`, `Opened`, `Cancelled`, `Trashed` là các trạng thái khác nhau; không chuyển tự động nếu thiếu guard/chứng cứ nghiệp vụ.
- `CT-03.R03`: Bốn kiểu date/time phải giữ đúng semantic precision theo DEC-06; timezone của thiết bị không được biến đổi ngày all-day.
- `CT-03.R04`: Transition đổi occurrence của M05 phải giữ mapping lịch sử; transition restore không được replay hành động M07/M08/M10.

**Bốn kiểu ngày/giờ theo DEC-06.A1:** `date-only`, `local timed + timezone`, `exact instant`, `month/day no origin year`. Việc lưu/trình bày phải giữ **ngữ nghĩa loại**, không tự chuyển birthday thiếu năm thành có năm hay sinh tuổi/counter. M05 event có khoảng thời gian phải có End hợp lệ; không tự điền duration. Monthly nth-weekday không có occurrence thì bỏ qua tháng đó, không biến thành last-weekday. Feb-29 và day-31 tuân quy tắc M05 đã duyệt. DST gap yêu cầu chọn local time khác; DST fold phải làm rõ lựa chọn instant, không tự đoán. M08 Sealed giữ exact instant ban đầu, kể cả sau thay đổi M05 Anniversary rule.

**Acceptance cases:** `CT-03.T01` date-only qua timezone không đổi ngày; `T02` 29/02 năm không nhuận; `T03` ngày 31 recurrence; `T04` nth weekday vắng tháng; `T05` DST gap/fold; `T06` birthday thiếu năm không có age/year counter; `T07` timed Event Start-only bị yêu cầu End; `T08` Capsule đồng hồ thiết bị chỉnh không mở sớm; `T09` M07 pending approval không thành nợ; `T10` Quiet Hours không dời scheduled delivery.

## 5. CT-04 — Financial Ledger, Approval, Split, Refund, FX & Reporting

**Owner:** M07. **Nguồn:** M07 D04–D13/D18–D29, §5/§8/§9; M03/M04/M06 consumer; **DEC-03 và DEC-04**. **CR:** 005, 007–011, 017, 022.

| Rule | Hợp đồng bắt buộc |
|---|---|
| CT-04.R01 | Expense là một economic event; payer/payment, beneficiary/allocation, Split Approval, Debt, Settlement, Refund, Adjustment, Savings movements và Budget estimate có identity/trạng thái riêng. |
| CT-04.R02 | Một Expense nhiều payer không nhân thành nhiều Expense. Tổng confirmed payments và allocation phải đối soát theo số liệu và quy tắc rounding của currency (OP-04 còn cần specification). |
| CT-04.R03 | Allocations ở trạng thái Pending/Rejected/Disputed không biến thành confirmed debt; sửa Split cần revision + approvals hợp lệ, không âm thầm thay phần đã xác nhận. |
| CT-04.R04 | Settlement chỉ giảm nghĩa vụ sau Confirmed theo đúng policy M07, partial theo từng lần; chưa được xác nhận không thể tự đối soát xong. |
| CT-04.R05 | Refund/Adjustment sau Settlement tạo transaction/event chỉnh riêng và liên kết khoản gốc; nghĩa vụ mới cần xác nhận của bên bị ảnh hưởng; original settlement không bị ghi đè. |
| CT-04.R06 | Khác currency phải cho hai bên thấy outstanding, thực trả, thực nhận, conversion/date/method, fees, remainder trước Confirmed. Không lấy rate mặc định từ thị trường; missing/contested rate giữ Pending/Disputed. |
| CT-04.R07 | Report có original, period adjustment và current net; nguồn filter theo actor permissions trước aggregation; liên kết nhiều nơi không double-count. |
| CT-04.R08 | Shared Money sau Disconnect: chỉ xử lý confirmed obligations cũ theo allowlist DEC-03; không thêm shared debt, Savings commitment hoặc partner approvals giả. Hậu 30 ngày giới hạn exact old outstanding, theo quyền còn hiệu lực và OP-03. |
| CT-04.R09 | M06 Goal Linked Progress chỉ đọc metric được phép, phản ánh stale/permission-lost; không tự mutate Savings Ledger hoặc auto Complete Goal. |
| CT-04.R10 | Restore/Retry không được lặp confirmed Settlement, Refund hoặc khởi tạo lại recurring Expense dưới dạng paid. |

**Golden fixtures cần cùng kết quả mobile/desktop:**

1. `CT-04.T01` 101.001 VND chia Equal 2 người → tổng allocation đúng 101.001, 1 VND dư được thể hiện nhất quán (quy tắc actor nhận phần dư xem OP-04).
2. `CT-04.T02` A trả 700.000, B trả 300.000, mỗi người chịu 500.000 → B hoàn A 200.000, Expense ID duy nhất.
3. `CT-04.T03` Split 1 phần approved/1 phần pending → chỉ confirmed part thành nghĩa vụ.
4. `CT-04.T04` Settlement confirmed rồi refund 40% → lịch sử gốc giữ nguyên, điều chỉnh chờ approval mới đúng người.
5. `CT-04.T05` JPY outstanding và VND settlement thiếu rate/received amount → không Confirmed.
6. `CT-04.T06` Shared Trip có Expense Private → total visible khác full private; không suy ra số ẩn.
7. `CT-04.T07` Scheduled recurring Expense → pending item, không tự Paid.
8. `CT-04.T08` Frozen Space sau Disconnect → có thể xem/yêu cầu xử lý confirmed debt cũ; tạo shared debt mới bị chặn.
9. `CT-04.T09` Restore sau Settlement → confirmed balance chính xác, không nhân đôi.

## 6. CT-05 — Sealed Snapshot, Scheduled Delivery, Reveal, Interaction & Disconnect

**Owner:** M08; M10 lifecycle; M09 tương tác. **Nguồn:** M08 D16–D28, M10 D33–D38, M09 D20, **DEC-01/02/03/06**. **CR:** 003–004, 018, 020–022.

**Guard khái niệm của Capsule:** người mở có recipient permission + quyền nguồn hiện hành + content lifecycle cho phép + `trusted_now >= original_unlock_at` + không Cancelled/Deleted + không bị Paused theo Space/lifecycle. `eligible` không đồng nghĩa `revealed` và càng không đồng nghĩa `recipient_opened`.

| Rule | Hợp đồng bắt buộc |
|---|---|
| CT-05.R01 | Sealed version, recipient set và `unlock_at` đã Seal không thay; mọi correction phải giữ provenance/historical state và không làm mở sớm. |
| CT-05.R02 | Before Seal: collaborative consent theo M08. After Seal: không tự sửa snapshot bởi editor, notification hay restore. |
| CT-05.R03 | M10 D35 Disconnect → pause undelivered/unrevealed; khi hết 30 ngày không tự reveal/gửi dồn; Reconnect không hồi grant/unpause cũ, cần consent hợp lệ mới theo DEC-02. |
| CT-05.R04 | A và B Opened riêng. M09 comment/react/count không leak nội dung hoặc existence cho recipient chưa được mở, dù người còn lại đã mở. |
| CT-05.R05 | Letter Delivered khác Recipient Opened; scheduled action độc lập Quiet Hours/notification. Retry không gửi trùng và read notification không đánh dấu mở. |
| CT-05.R06 | Hủy Capsule đồng tạo và yêu cầu xóa/partial purge tuân DEC-01.A4–A5, không tự hủy tác phẩm chung khi một người yêu cầu nếu thiếu căn cứ; xử lý tranh chấp có thể temporarily withhold bytes. |
| CT-05.R07 | Full deletion hợp lệ có thể thu hồi bytes trong snapshot/derivative theo scope, nhưng không thay `sealed_at`/`unlock_at` để hợp thức hóa; history còn phải được redacted khi cần. |
| CT-05.R08 | Clock trên thiết bị không được quyết định early open. Restore/quyền thay đổi vẫn đánh giá lại điều kiện trước từng lần đọc. |

**Acceptance cases:** `CT-05.T01` cannot open T-1s; `T02` Eligible chưa Opened; `T03` A Opened và B chưa thì mention không leak; `T04` Disconnect khi letter scheduled; `T05` reconnect không auto dispatch; `T06` shared Capsule co-owner offline xin hủy; `T07` partial purge asset không thay seal; `T08` restore trước unlock không thể mở.

## 7. CT-06 — One Notification Center, Dedup, Quiet Hours & Stale Actions

**Owner:** M10. **Event producers:** M01–M09; M09 chỉ là producer comment/reaction/mention, không sở hữu notification center. **Nguồn:** M10 D26–D29/§12; M05 reminders, M08 delivery, M09 interactions; **DEC-02/05/06/07**. **CR:** 019–020, 022.

| Rule | Hợp đồng bắt buộc |
|---|---|
| CT-06.R01 | Một record logic per `(source event identity+revision, recipient, notification type)` cho retry cùng sự kiện; không gộp obligations/security alerts độc lập thành mất hành động. |
| CT-06.R02 | Tạo/phát notification dựa trên business state đã commit; thiếu notice không revert Delivery, Seal, Event hoặc Expense approval. |
| CT-06.R03 | Source ACL được kiểm tra lúc ghi nội dung projection và ngay trước display/open deep link; Secret không có preview, existence hay count trái quyền. |
| CT-06.R04 | Quiet Hours theo user timezone/category: điều chỉnh chủ động làm phiền, không đổi giờ domain action, không xả bão reminder cũ sau quiet. |
| CT-06.R05 | Category theo DEC-07: security, time-sensitive personal, M08 scheduled/secret, normal collaboration, low-priority; mỗi nhóm có policy riêng trong approved A. |
| CT-06.R06 | Cancel/revoke/expired → stale/non-actionable; không hiển thị CTA hợp lệ giả, không giữ preview lộ quyền cũ. |
| CT-06.R07 | In-app center là P0; push/email không tự được xem là P0. Time window nhóm gộp, stale threshold, lock-screen preview cần quyết định/UX spec riêng OP-07. |
| CT-06.R08 | Read/unread Notification không thay RSVP, Letter Opened, Capsule Opened, Settlement, Approval hoặc Completion. |

**Acceptance cases:** `CT-06.T01` duplicate retry cùng event → 1 notice; `T02` Quiet Hours letter gửi đúng state nhưng chỉ inbox; `T03` canceled Event stale deep link; `T04` revoke source removes preview; `T05` M09 10 reactions có grouping phù hợp nhưng không trộn approvals; `T06` một user Quiet Hours khác user kia; `T07` M08 secret notification no leak.

## 8. CT-07 — Archive, Trash, Delete, Export, Backup & Controlled Restore

**Owner:** từng module với object của mình, M10 governance. **Nguồn:** M02 §12–13, M07 D29, M08 D27–D28, M09 §13, M10 D30–D36/§13–14, **DEC-01/02/03/05**. **CR:** 002–006, 012, 021–022.

| Rule | Hợp đồng bắt buộc |
|---|---|
| CT-07.R01 | Archive ≠ Trash ≠ Full Purge; soft delete thông thường giữ Trash **30 ngày**; purge phải qua quyền và policy chuyên biệt, không tự động xóa parent/consumer xuyên module. |
| CT-07.R02 | Trashed target giữ reference/identity để liên kết thể hiện Unavailable hợp quyền; Restore trong kỳ hợp lệ không duplicate object hoặc kích hoạt quyền đã revoke. |
| CT-07.R03 | Published/Sealed immutable là bất biến nội dung lịch sử, **không** quyền lưu bytes vĩnh viễn; full-deletion workflow `Requested→Under Review→Approved/Rejected/Partially Approved→Processing→Completed/Failed`. |
| CT-07.R04 | Xóa original/copy/derivative/backup xem scope cụ thể theo DEC-01.A2–A5 và OP-01/OP-02; không suy diễn một người có quyền xóa toàn bộ đóng góp của người kia. |
| CT-07.R05 | My Data/Shared Export lọc đúng quyền ở lúc tạo **và giao** file, không include linked private/secret/receipt, giữ bản ghi cấu trúc/redaction thông minh mà không lộ metadata. |
| CT-07.R06 | Export không đồng nghĩa System Backup; backup phục vụ khôi phục có quyền kiểm soát, không phải file để partner duyệt đọc toàn bộ nội dung. |
| CT-07.R07 | Restore phải kiểm idempotent domain actions + restore current auth/consent/tombstones; không replay Settlement, Letter send, Surprise Reveal, reminders, grants, hoặc M05 events duplicate. |
| CT-07.R08 | Disconnect/Reconnect/Account Delete: các quyền hậu kỳ theo DEC-03; không tự restore share/grant khi xuất hiện lại account/couple connection. |
| CT-07.R09 | Lỗi purge/restore phải thể hiện Partial/Failed và audit trail phù hợp; không trả thông báo Completed nếu còn derivative cần xử lý. |

**Acceptance cases:** `CT-07.T01` soft delete Media used by Published Book; `T02` trash + restore before day30 no ACL resurrection; `T03` purge source redacts only authorized bytes while preserving history allowed; `T04` export Shared Book with Private Page; `T05` partner export after Disconnect; `T06` system restore from backup after Settlement/Letter/permission revoke; `T07` 30-day boundary and Closed Space; `T08` delete request partial rejection/approval; `T09` document receipt restore preserving access boundaries.

**Cần chốt trước production:** backup schedule/RPO/RTO, full deletion backup retention & compliance OP-01, co-owner dispute OP-02, post-30 debt authority OP-03 là **OPEN CONTROL**, không ghi thành thông số phê duyệt ở đây.

## 9. CT-08 — M01 Realtime Co-edit, Safe Undo & Immutable Publish

**Owner:** M01; M10 authorization, M02 linked Media, M09 stable interaction IDs. **Nguồn:** M01 D05–D10/D15, §6–9/§13–16; M10 §11; **DEC-01/03**. **CR:** 001–002, 023–024.

| Rule | Hợp đồng bắt buộc |
|---|---|
| CT-08.R01 | Simple/Advanced Editor là hai chế độ cùng một model nghiệp vụ, chuyển qua lại không xóa Page/layer/object/element. |
| CT-08.R02 | Hai tài khoản cùng chỉnh Text/Element/Page phải hội tụ; acknowledged edits không mất khi một người reconnect. Không silent last-write-wins làm mất nội dung đã xác nhận. |
| CT-08.R03 | Presence/cursor per session. Một tài khoản mở hai tab không được diễn giải thành hai thành viên độc lập; stale presence không khóa nội dung vĩnh viễn. |
| CT-08.R04 | Undo A chỉ hoàn tác những thay đổi A có quyền hoàn tác, không xóa sửa đổi độc lập vừa được B xác nhận; conflict cần giải thích minh bạch. |
| CT-08.R05 | Publish cần permission riêng, tạo immutable Publication checkpoint; Draft/Revision Draft sau đó không đổi Reader/PDF Published khi chưa tạo Publication mới. |
| CT-08.R06 | Revoke quyền/Page override/Disconnect khi phiên đang mở → mutation commit mới phải recheck; reject không được hiển thị Saved. |
| CT-08.R07 | Realtime co-edit phải dùng được trên mobile ở các nghiệp vụ P0, dù UI có thể khác desktop; giảm chuyển động/accessibility không làm mất chức năng. |
| CT-08.R08 | Media source/PDF của Publication được phục vụ theo CT-01/CT-07; comment gắn Book/Page identity bất biến qua reorder/version. |

**Acceptance cases:** `CT-08.T01` simultaneous same text; `T02` same object competing move; `T03` A offline while B adds sticker; `T04` A undo doesn't erase B; `T05` revoke mid-edit; `T06` publish while B has unacknowledged draft; `T07` PDF old publication same version; `T08` mobile Simple and Advanced editing; `T09` comments survive Page reorder.

## 10. Ma trận CT ↔ CR ↔ DEC và bàn giao kiểm thử

| CT | CR liên quan trọng tâm | DEC đã duyệt liên quan | Release evidence tối thiểu |
|---|---|---|---|
| CT-01 | 001,002,006,010,018,020,023 | 01,02,03,05,07 | ACL negative, 2 accounts, direct link, Reader/PDF/export, mobile/desktop |
| CT-02 | 011,012,013,014,016,017,021 | 01,04,05 | Stable ID, retry/relink/split, no duplicate event/expense |
| CT-03 | 004,007,009,014,015,018,020 | 02,04,05,06 | State transition/timezone/DST/invalid input |
| CT-04 | 005,007–011,017,022 | 03,04 | Ledger fixtures, FX consent, partial, Refund, actor-visible reports |
| CT-05 | 003,004,018,020,021,022 | 01,02,03,06 | Early-open negative, per-recipient opened, disconnect, purge |
| CT-06 | 019,020,022 | 02,05,06,07 | Retry/dedupe, stale, quiet hours, Secret projection |
| CT-07 | 002–006,012,021,022 | 01,02,03,05 | Trash 30d, export filtering, actual restore drill, no replay |
| CT-08 | 001,002,023,024 | 01,03 | Concurrent edits, mobile parity, publish immutability |

## 11. Open Controls — *không* tự suy diễn đã được PO duyệt

| ID | Khoảng trống sau khi viết Contract | Owner xử lý ở bước sau | Điều kiện không được vi phạm |
|---|---|---|---|
| OP-01 | Full deletion/derivative/backup purge retention pháp lý, thời gian và ngoại lệ | Privacy/Retention Review | DEC-01.A4; không vô hạn hóa lưu trữ |
| OP-02 | Thẩm quyền hủy Capsule đồng sở hữu khi có tranh chấp/offline | M08 Policy/Consent Review | DEC-01.A5; không mở sớm/phá Seal |
| OP-03 | Chính sách quyền cụ thể cho hậu-30-day confirmed debt/access/export | M07/M10 Lifecycle Review | DEC-03.A1–A5; không tạo nợ mới |
| OP-04 | Minor units/FX precision/remainder assignment/rounding | M07 Business Validation | DEC-04; phải thể hiện trước xác nhận |
| OP-05 | Mapping chi tiết series/occurrence, UX sync conflict | M05/M03/M04 Validation | DEC-05; không chuyển lịch sử nhầm occurrence |
| OP-06 | UX cho DST ambiguity, birthday không năm và optional birthday reminder | M05/M10 UX Review | DEC-06; không tạo ngày/tuổi giả |
| OP-07 | Grouping window, stale threshold, notification channel/lockscreen UX | M10 Notification UX Review | DEC-07; không thêm push/email vào P0 |

**Quy tắc:** Contract có thể hoàn thành ở mức đặc tả đã phù hợp Dxx/DEC trong khi OP vẫn mở; **không coi triển khai liên quan đã sẵn sàng** khi thiếu policy/UX/ops quyết định cần thiết.

## 12. Quy tắc nghiệm thu Contract

Mỗi CT phải có: (i) 2 tài khoản A/B, (ii) ít nhất một positive và một negative case trên cả desktop/mobile, (iii) expected outputs không vi phạm BRD/DEC, (iv) trạng thái `NOT_RUN` cho đến khi thật sự QA, (v) bằng chứng việc revoke/restore/retry không tạo lộ lọt hoặc nhân đôi, (vi) Owner và người duyệt kiểm thử. Nếu có thay đổi Dxx hoặc DEC đã duyệt, tạo CR và xin phê duyệt trước.

**Review hoàn thành ≠ Contract approved ≠ QA passed ≠ V1.0 releasable.** Không thay đổi BRD gốc, không chọn tech stack, không thiết kế kỹ thuật, không viết code.

## Phụ lục A — Fingerprints nguồn để đối chiếu

| Nguồn | SHA-256 |
|---|---|
| M01 `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md` | `746eb5ec8c9ea4ba1e9dc07da5ffc67153882585aad291d55ed923ba51fb0428` |
| M02 `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md` | `d5c92c0ab60e05e4cc36d84beaef315327460c28c3de0c5885aaa318e5c17530` |
| M03 `OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md` | `fc8805ed7c082f66d2356edb0c6ed7087762637666909cb8887b837a198bc620` |
| M04 `OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md` | `94531050bcaaf84467360b7f4617c73dfa13e9f7db38cc4bde7264686c3d5f7d` |
| M05 `OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md` | `10a991b293b5a200d8d3cb7b14b02fa673d8b44f6300f90aa3ccb289a260e819` |
| M06 `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md` | `75771d5d129ef9c7fae9cfd8902b69718675219945d5c05a365ae7880a8ce823` |
| M07 `OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md` | `c687d52817ae253fac44bd21abdf20eaab55bb370be762c61446b4f5d75773fa` |
| M08 `OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md` | `cbacbad47ddab5d7f878a67b15860853c28d4e28e63add4417c0ae6df5365b23` |
| M09 `OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md` | `c7804a3a8c3e089b02cdd41c98cc1a91934abbdf26c0adc308a55e16a650bbfd` |
| M10 `OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md` | `3209bc0b2c4821e145e34847bf117845e4f300357691823efa5b163e6a108706` |
| `OUR_SPACE_APPROVED_POLICY_SUPPLEMENT_V1.0.md` | `fc365c1b00e6d9e1b472de43a92171c74ec0d7ae03ac7960c8ebdef3ceb1ea09` |
| `OUR_SPACE_CROSS_BRD_CONSISTENCY_REVIEW_FINAL_V1.0.md` | `d2cf9ed84d359938ccd837e29ed05d75050efb30ad6a55d8c02a93456cb26a12` |
| `OUR_SPACE_POLICY_DECISION_DOCKET_V1.0.md` | `d01da207d80a926f91c43a616e2183325b553d87ebd18c67ee6ce28a3b428b41` |
