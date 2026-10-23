---
document_id: OURSPACE-CROSS-BRD-REVIEW-FINAL
project: Our Space
review_version: 1.0
review_date: 2026-10-23
review_status: COMPLETED_WITH_RECORDED_OPEN_DECISIONS
baseline_business_requirements: M01-M10 BRD V1.0 APPROVED_UNCHANGED
implementation_status: NOT_STARTED
scope_change_authorized: false
language: vi-VN
---

# OUR SPACE — CROSS-BRD CONSISTENCY REVIEW
## Báo cáo rà soát hoàn tất V1.0 — 10 BRD, 247 quyết định

> **Quan trọng về trạng thái:** `REVIEW COMPLETED` nghĩa là đã hoàn tất việc lập kết luận, phân loại và quy tắc đề xuất trên bộ tài liệu bàn giao ngày 23/10/2026. **Không** có nghĩa 13 vấn đề chờ quyết định đã được Product Owner phê duyệt, không có nghĩa QA đã chạy, và không có nghĩa dự án được phép lập trình ngay những nhánh chính sách đang bị khóa.
>
> Báo cáo là **tài liệu kiểm toán nghiệp vụ và đề xuất tích hợp**, không thay thế 10 BRD gốc. **Không sửa D01–Dnn; không chọn tech stack, không thiết kế schema/API, không viết code.**

## 1. Tóm tắt điều hành

- Bộ tài liệu: 10 BRD chính thức M01–M10, Project Handoff V2.0, Next Chat Prompt V2.0; **12/12 tệp Markdown khớp manifest SHA-256**. Video ảnh minh họa Photobook có trong gói nhưng **không** được dùng để suy ra yêu cầu nghiệp vụ mới.
- **247 Dxx** có dãy đầy đủ: M01=15, M02=20, M03=20, M04=22, M05=22, M06=24, M07=30, M08=30, M09=24, M10=40.
- **24 CR:** 7 Critical / 15 High / 2 Medium. Đây là mức hậu quả **nếu triển khai sai**, không phải số BRD bị từ chối hoặc số xung đột cứng giữa Dxx.
- **Không xác định được cặp Dxx không thể đồng thời tuân thủ** trong phạm vi các giao điểm đã được rà soát. Các trường hợp tưởng xung đột như M05 Event ownership và M08 Seal vs M10 D35 đã có quy tắc nhất quán trong BRD gốc.
- Sau rà soát: **09 CR** đủ căn cứ lập hợp đồng/kiểm thử không thay đổi chính sách; **13 CR** chứa lựa chọn chính sách chưa được phê duyệt, gom thành **07 quyết định DEC-01–DEC-07**; **02 CR** là trùng cách gọi/trách nhiệm đã làm rõ qua tài liệu nguồn.
- Không có việc thay đổi phạm vi P0. Điều kiện V1.0: **toàn bộ P0 của cả 10/10 phân hệ trên mobile và desktop**, cùng với negative security tests, finance integrity, Seal, Trash/Export/Backup/Restore.

### 1.1. Ý nghĩa của các trạng thái trong báo cáo

| Trạng thái | Ý nghĩa | Có thể triển khai không? |
|---|---|---|
| `ANALYSIS_COMPLETE / CONTRACT_TO_SPECIFY` | Có đủ nguyên tắc trong BRD, cần hợp đồng chính xác và kiểm thử | Chỉ sau khi contract được đặc tả; không tự sáng tạo chính sách |
| `ANALYSIS_COMPLETE / POLICY_PENDING` | Đã mô tả gap, tác động và phương án; còn quyền/quy trình/thời điểm/phạm vi cần PO chốt | **Chặn nhánh nghiệp vụ liên quan**, không được coi phương án là đã duyệt |
| `INTERPRETATION_RESOLVED` | Nội dung đã phù hợp và có thể chuẩn hóa bằng cách diễn giải/trách nhiệm | Có thể đưa vào glossary/contract, không sửa Dxx |
| `QA_NOT_STARTED` | Chưa có phần mềm, chưa thể đo hay pass AC | Không gọi CR là kiểm thử Passed |

### 1.2. Phân phối theo nhóm kết quả

| Nhóm | CR IDs | Số lượng | Điều kiện đóng |
|---|---|---:|---|
| Hợp đồng triển khai/QA | 001, 007, 010, 011, 012, 017, 022, 023, 024 | 9 | Chốt contract theo Dxx + trace/QA plan; pass tests khi có hệ thống |
| Chờ quyết định Product Owner | 002, 003, 004, 005, 006, 008, 009, 013, 014, 015, 018, 020, 021 | 13 | PO chốt policy mới, ghi quyết định có phiên bản; sau đó contract/QA |
| Chuẩn hóa diễn giải | 016, 019 | 2 | Ghi glossary và ma trận ownership chung; không tạo source trùng |

### 1.3. Các bất biến đã khóa, không đem ra chọn lại

1. Private mặc định và quyền từng object; Shared parent không tự mở child Private; không có superadmin Space xem mọi Private.
2. Một nguồn dữ liệu chính thức cho mỗi miền; reference không tạo bản sao nghiệp vụ gốc.
3. Không cascade delete xuyên module; Trash tối thiểu 30 ngày cho xóa thông thường; export, backup và **restore thực tế**.
4. M01: Simple/Advanced Editor trên cùng cấu trúc, realtime co-edit hai người, version, immutable Publication, PDF P0.
5. M05 là nguồn Event và Anniversary; M07 là Expense/Split/Settlement/Budget/Savings; M09 là lớp tương tác, không phải chat độc lập.
6. M08 Time Capsule Seal bất biến, không mở sớm; unlock eligibility không bằng Opened; M10 D35 pause unrevealed sau Disconnect và **không đổi** Sealed `unlock_at`.
7. P0 của 10 module trên mobile **và** desktop mới đủ điều kiện V1.0; không nâng các P1/P2 tùy tiện.

## 2. Phương pháp, mức bảo đảm và giới hạn

1. Kiểm kê 12 Markdown, kiểm tra checksum theo manifest trong ZIP. Kiểm đếm code Dxx từng file, dãy D01–Dnn liên tục.
2. Đối chiếu handoff với BRD gốc; lập ma trận canonical ownership/read/write và các luồng liên kết.
3. Rà theo 10 chiều: data owner; quyền/Privacy; links; state/timing; Trash/Restore; Seal/Disconnect; finance; Notifications; backup/export; P0 + mobile/desktop.
4. Mỗi phát hiện có ID, tài liệu nguồn, severity, tác động, đề xuất, mức độ cần PO; kiểm tra lại các giao điểm trong mục lục và Business Rules / Acceptance Criteria có liên quan.
5. Chưa kiểm thử app, chưa đánh giá hạ tầng, chưa phân tích mọi luật pháp từng quốc gia, chưa chọn thuật toán/stack. Những việc này không được ngầm xem là hoàn thành bởi review giấy tờ.

**Quy tắc chứng cứ:** Đối với mỗi CR, dùng tên Mxx và mã section/Dxx/OPEN-* trích trong Register; Mục 9 tạo locator `tên tệp:line` để tra cứu nguồn. Những lựa chọn chỉ có trong phần DEC là **đề xuất mới**, không phải phát biểu rằng BRD đã duyệt chúng.

## 3. Ma trận nguồn dữ liệu chính thức và write boundary

| Owner | Canonical objects / write authority | Consumers / đọc-tham chiếu | Không được viết ngược/tự sinh |
|---|---|---|---|
| M01 | Diary, Book, Page, Element, Publication, Snapshot Diary in Book | M03 Visit, M04 Trip recap, M02 Media, M08 Moment, M09 | Không thay original media, không sửa Diary qua snapshot, không mutate Published |
| M02 | Original Media, variants, Albums, media ACL | M01/03/04/08, M10 cover/avatar | Album Shared không tự share asset Private; không xóa source theo consumer |
| M03 | Place, Wishlist Entry, Date Plan, Visit, per-Visit Review | M04 itinerary, M05 Event, M06 Goals, M07 Expense | Không sinh canonical Event/Expense/Visit từ lịch hoặc trip status |
| M04 | Trip, Activity, Accommodation, Transport, Booking, Booking Documents | M03 Place, M05 Event, M07 costs, M01 recap | Không lập Places/Calendar ledger/Expense thứ hai |
| M05 | Event, Anniversary, recurrence, occurrence, RSVP, reminder domain | M03/04/06/08 + M10 notification | Không thay Visit/Trip/Goal/Special Moment status |
| M06 | Wish (khác M03 Wishlist Entry), Goal, Task, Milestone, Progress, Achievement | M03/04/05/07/08 | Không tạo bản sao Savings balance/Expense/Trip |
| M07 | Expense, Payments, Allocations, Approval, Settlement, Refund, Budget, Savings/movements, FX snapshot | M03/04/05/06/08 | Không dùng dự toán thay confirmed amount; không tạo financial shadow store |
| M08 | Moment, Milestone, Letter, Surprise, Capsule, Sealed Snapshot, reveal/delivery/open states | M01/02/05/06/07/09/10 | Không tự thay thời gian sealed, không làm lộ Secret |
| M09 | Comments, Replies, Reactions, Mentions, Interaction Feed projection | Targets hợp lệ M01–M08; M10 notification | Không làm chat tổng quát; không thay RSVP, review, approval |
| M10 | User/Space/Pairing/Auth, effective permission policy, in-app Notification Center, lifecycle/export/backup governance | Tất cả phân hệ | Không chiếm quyền đọc Private/Sealed hoặc mutate business source |

*Cross-data contract chung cần có trước thiết kế kỹ thuật chi tiết:* stable identity + source module/type/id + canonical revision/state + actor/ownership + privacy/visibility + per-operation grants + linked resource grants + source live status + correlation/idempotency identity + safe placeholder khi không được phép + deletion tombstone/restoration + audit. Đây là danh mục kết quả cần đặc tả, không áp đặt bảng/API/công nghệ.

## 4. Conflict / Gap Register — 24 CR (chi tiết: nguồn, mức độ, tác động, xử lý)

### CR-001 — Parent Shared, linked child Private và trường dữ liệu riêng
**Loại:** Contract gap · **Severity: CRITICAL** · **PO: Điều kiện**.  
**Nguồn:** M01 D06/D08, §4.7, §13.5; M02 D02/D12, §15 (BR-M02-006–011); M04 D13, §18.1; M07 D27/§8.2; M10 D13–D17, §11.1–11.3.  
**Vấn đề:** Shared Book/Trip/Album/Event/Goal/Moment không tự mở Page, Diary, receipt, asset hoặc Expense Private. BRD đồng thuận nguyên tắc nhưng chưa có **ma trận chuẩn** xác định field/preview/aggregate/action cụ thể cho mọi cặp cha–con và nơi export.  
**Tác động:** Rò nội dung qua thumbnail, PDF, search, feed, count, money summary hoặc download; cũng có thể làm shared experience bị thiếu nội dung khó hiểu.  
**Xử lý đề xuất:** Contract `can_view`, `can_export`, `can_download`, projection-safe, placeholder không leak; quyền nguồn liên kết phải được đánh giá riêng. UI khi share thông báo chính xác child có được chia sẻ hay không. Tạo negative test theo từng consumer. Không cần thay Dxx nếu chỉ hiện thực quyền đã chốt.

### CR-002 — Bất biến Published Photobook vs chỉnh/xóa/revoke Media gốc
**Loại:** Lifecycle gap · **Severity: CRITICAL** · **PO: Có**.  
**Nguồn:** M01 D05/D10, §4.5–4.7, §12.4; M02 D08/D13, BR-M02-027–033, §20.2; M08 §12.1; M10 §13.4–13.5/OPEN-M10-05.  
**Vấn đề:** Bản Published của M01 phải bất biến; M02 không được giữ asset mãi trái full deletion hoặc tự cho quyền xem khi original bị revoke. Chưa ấn định áp dụng placeholder, pinned derivative, hay bộ quyền lịch sử đối với phiên bản xuất bản trong các trường hợp khác nhau.  
**Tác động:** PDF/Reader thay đổi ngoài ý muốn, mất lịch sử, hoặc vi phạm quyền xóa/riêng tư.  
**Xử lý:** Phân biệt *immutability of authored layout/reference* và *entitlement to view bytes*. Ma trận: source edit / revoke / Trash / valid purge / restored source × live draft / published snapshot / previously downloaded PDF. Chỉ lựa chọn giữ byte/ảnh độc lập có quyền tồn tại sau full deletion khi PO duyệt rõ.

### CR-003 — Sealed Capsule snapshot vs full deletion và hủy đồng sở hữu
**Loại:** High-risk policy gap · **Severity: CRITICAL** · **PO: Có**.  
**Nguồn:** M08 D16–D21/D27–D28, §5.4–5.6, §13.3, OPEN-M08-01/07; M02 §15; M10 D30/D32/D36/D38, §13.4–13.5, OPEN-M10-05.  
**Vấn đề:** `Sealed` không được sửa hay mở sớm, nhưng full deletion có thể hợp lệ. Chưa có quyền quyết định hủy/tiêu hủy một capsule cùng tạo khi A đồng ý và B phản đối/offline.  
**Tác động:** Mất dữ liệu của bên còn quyền hoặc giữ dữ liệu ngoài nguyện vọng hợp lệ; khôi phục gây mở sớm.  
**Xử lý:** Phân biệt Cancel, Hide, Revoke, Delete Request, Purge; trạng thái yêu cầu xử lý và phần quyền từng bên. Seal manifest/timestamp bất biến; mọi xóa hợp lệ chỉ xử lý qua lifecycle riêng và audit. Phê duyệt rule về đồng thuận/ngoại lệ trước code.

### CR-004 — Disconnect D35: xử lý sau 30 ngày, Reconnect và delayed delivery
**Loại:** Policy completion gap · **Severity: CRITICAL** · **PO: Có**.  
**Nguồn:** M08 §5.2–5.6, §13.4, OPEN-M08-02; M10 D33–D37, §14.2–14.4, OPEN-M10-07/08.  
**Điều đã giải quyết:** Disconnect pause quyền delivery/reveal nhưng **không đổi** `original_unlock_at`, recipients hay Sealed content. `time_eligibility` có thể true nhưng `reveal_permission` false.  
**Chưa rõ:** Sau 30 ngày vẫn không Reconnect thì pending Letter, Surprise, Capsule thành loại trạng thái nào? Có được cấp quyền truy cập lại khi hai người reconnect nhưng không cùng chấp thuận unpause?  
**Tác động:** Tiết lộ sai thời điểm, giữ bí mật vô hạn hoặc mất quyền đã từng chờ; race scheduled job.  
**Xử lý:** Một disposition matrix cho các trường hợp end-of-30-day, Reconnect both-consent, one-party refusal, clock elapsed while paused. Phương án bảo thủ đề xuất: vẫn Paused, không auto reveal/unpause; xử lý tiếp theo bằng consent rõ từng loại; phải chốt quy trình cuối cùng.

### CR-005 — Frozen Space vs xử lý dư nợ/Settlement còn hiệu lực
**Loại:** Financial–lifecycle gap · **Severity: CRITICAL** · **PO: Có**.  
**Nguồn:** M07 D08/D11–D13, §5.1–5.4, §8; M10 D33–D36, §14.2–14.3, OPEN-M10-06.  
**Vấn đề:** M10 cấm shared write mới trong Frozen, nhưng cho phép đối soát hậu kỳ khi được định nghĩa; M07 yêu cầu người nhận xác nhận, có partial settlement/refund/reversal. Chưa có danh sách loại thao tác được phép trong cửa sổ xử lý.  
**Tác động:** Không thể tất toán công nợ chính đáng hoặc lợi dụng Frozen để tạo nghĩa vụ mới.  
**Xử lý:** Allowlist nghiệp vụ có xác thực: confirm khoản đã tồn tại, settle nghĩa vụ đã duyệt, refund/correction có audit, export đúng quyền; deny tạo khoản nợ mới, split mới hoặc tự duyệt thay. Chốt ai có quyền trong/sau 30 ngày và cách xử lý bất đồng.

### CR-006 — Export quyền đối với tác phẩm đồng sáng tạo sau Disconnect/Delete
**Loại:** Ownership/data-rights gap · **Severity: HIGH** · **PO: Có**.  
**Nguồn:** M01 §4.7, §16.3; M04 §18; M08 §5.5; M09 §13.4; M10 D30–D37, §13.1/§14.3/OPEN-M10-06.  
**Vấn đề:** Shared Book/Page, Trip, Goal, Comment thread được cả A/B tạo; quyền xem, tải, xuất sau Disconnect/Delete khác với quyền sở hữu tác giả của từng item.  
**Tác động:** Xuất quá rộng, mất đóng góp của người còn lại, hoặc cản xuất dữ liệu hợp lệ của mình.  
**Xử lý:** Per-object exportable scope, per-contribution ownership, separate export permission, preservation of authorship; không tự dump toàn Space. Chốt xử lý đóng góp chung, export version Published và tài nguyên Private linked.

### CR-007 — Confirmed Expense với split duyệt một phần
**Loại:** State/aggregate gap · **Severity: HIGH** · **PO: Điều kiện**.  
**Nguồn:** M07 D04–D11, §5.1, §5.4–5.5, §8.1–8.4; M10 D18, §11.1.  
**Vấn đề:** BRD không cho nợ của B thành Confirmed nếu B chưa duyệt, nhưng cũng thừa nhận phần phân bổ đã duyệt và chưa duyệt có thể cùng tồn tại. Cần hợp đồng tính đúng trong dashboard và budgets cho state hỗn hợp.  
**Tác động:** Tổng nợ, ngân sách và alerts sai; A vô tình ghi nợ B.  
**Xử lý:** Phân biệt expense payment fact, allocation approval state, debt ledger portion; dashboard riêng confirmed vs pending; revision of split invalidates approvals liên quan. Golden test 2 payer + one pending allocation.

### CR-008 — Refund/Adjustment sau Settlement đã xác nhận
**Loại:** Financial state gap · **Severity: HIGH** · **PO: Có nếu chọn chính sách mặc định mới**.  
**Nguồn:** M07 D11–D13, §5.2–5.5, §9.3–9.4, OPEN-M07-13; M03 D16; M04 D15–D16.  
**Vấn đề:** Có yêu cầu sửa chi phí ròng mà giữ audit, nhưng còn thiếu decision tree khi refund sau tất toán dẫn tới B/A có nghĩa vụ hoàn lại; dispute pending vẫn chưa phân xử.  
**Tác động:** Net balance âm sai, double-settlement, historical reports bị sửa hồi tố.  
**Xử lý:** Adjustment/Refund immutable events có source/beneficiary, status, ledger effective date và audit; tạo obligation correction hợp lệ, không viết lại settlement cũ; thống nhất ảnh hưởng budget period, thông báo và trường hợp tranh chấp.

### CR-009 — Settlement khác ngoại tệ, FX và đối soát đa tiền tệ
**Loại:** Financial policy gap · **Severity: HIGH** · **PO: Có**.  
**Nguồn:** M07 D24–D25, §5.5–5.6, OPEN-M07-02/12; M04 D16, OPEN-M04-05; M10 D23.  
**Vấn đề:** BRD đã cấm cộng khác currency và yêu cầu hai bên xác nhận FX trong cross-currency settlement, nhưng chưa định nghĩa xử lý thiếu FX, phần thanh toán, dư chênh hay sửa rate sau confirmed.  
**Tác động:** Sai công nợ hoặc hình thành nghĩa vụ chưa được A/B đồng ý.  
**Xử lý:** Chốt trường hợp rate missing/expired/disputed, currency of obligation vs received currency, snapshot bất biến khi confirmed; không ghi `settled` nếu thiếu cả hai xác nhận về số tiền thực nhận/quy đổi.

### CR-010 — Quyền tổng hợp finance/Goal/Trip và inference từ số tiền
**Loại:** Privacy aggregate gap · **Severity: CRITICAL** · **PO: Không nếu tuân theo Dxx**.  
**Nguồn:** M07 D01/D27–D28, §8.2–8.4/§9.4/§9.6; M04 §18; M06 §4.2/§21; M10 D15/§11.2.  
**Vấn đề:** Shared Trip/Goal/Budget có thể tham chiếu Private Expense hoặc Savings Balance. Nếu summary tính cả khoản Private nhưng che chi tiết thì người xem vẫn suy đoán amount qua hiệu số.  
**Tác động:** Lộ bí mật tài chính, quà Surprise, lịch sử chi tiêu.  
**Xử lý:** All aggregates must be computed on actor-visible source set; gắn nhãn `visible scope`, `pending`, `missing FX`; không cho inferred total từ hidden amounts. Share aggregate-only phải được phê duyệt riêng nếu từng muốn thêm.

### CR-011 — Một Expense dùng trong nhiều module, Booking deposit vs total
**Loại:** Identity/synchronization gap · **Severity: HIGH** · **PO: Không**.  
**Nguồn:** M03 D16, §4.7; M04 D15–D16, §21.2; M07 D05/D26, §9.3–9.4/§9.10.  
**Vấn đề:** Nút Add Expense trên Visit/Trip/Booking có thể retry hoặc nhiều source cùng trỏ về một bill; Booking total gồm deposit/planned balance không đồng nghĩa expense paid.  
**Tác động:** Nhân đôi chi phí hoặc báo đã trả 100% khi thực tế mới đặt cọc.  
**Xử lý:** Stable Expense ID + purpose-specific source links + idempotent create/link existing + separate estimate/paid/pending; report dedup by Expense ID in the relevant aggregation scope.

### CR-012 — Kho PDF/vé/chứng từ dùng chung vượt phạm vi M02
**Loại:** Capability boundary gap · **Severity: HIGH** · **PO: Điều kiện đối với quota/retention mới**.  
**Nguồn:** M02 D01, §1.4/§19.5; M04 D13, OPEN-M04-01/02; M07 §9.2, OPEN-M07-01; M10 D30–D32, §13.  
**Vấn đề:** M02 P0 tập trung ảnh/video, trong khi PDF Booking/tickets và receipts là P0 ở nơi sử dụng. Không được kết luận rằng M02 tự nhiên nhận PDF hoặc bỏ chứng từ.  
**Tác động:** P0 booking/financial receipts không có lưu trữ/ACL/export/restore an toàn.  
**Xử lý:** Định nghĩa shared File/Document capability nghiệp vụ với per-file permission, source owner, validation, reference, quarantine/preview policy, export, Trash, backup. Không phát minh module thứ 11 hoặc thay scope M02 khi chưa cần.

### CR-013 — M03 Date Plan, M04 Activity và M05 Event sync/cancel
**Loại:** Cross-domain write contract gap · **Severity: HIGH** · **PO: Có ở những hành động mặc định mới**.  
**Nguồn:** M03 D07, §4.5, TD-M03-04; M04 D08/D17, OPEN-M04-04; M05 D19, §1.4, §12.2–12.4.  
**Điều đã chốt:** Khi đã liên kết, **M05 giữ current Calendar Event time**, M03/M04 giữ business state; không copy Event song song.  
**Chưa rõ:** Cancel/Delete source sẽ Cancel Event, Unlink hay giữ lịch sử theo default nào; thay thời gian cùng lúc; quyền actor khi Event Shared nhưng source Private.  
**Tác động:** Duplicate Event, hủy nhầm booking, hở Place Private, notification sai.  
**Xử lý:** Direction-specific action table: Create/Link/Reschedule/Cancel/Delete/Unlink/Restore, source revision, sync pending/failed, conflict resolution; không cascade source, không auto RSVP/Visit/Complete.

### CR-014 — Recurrence occurrence identity qua M03/M04/M09
**Loại:** Reference granularity gap · **Severity: HIGH** · **PO: Có nếu thay đổi semantics tương tác**.  
**Nguồn:** M05 §4.5, §12, §25 OPEN-M05-14; M09 §2.2, OI-M09-07; M03 Date Plan; M04 Activity.  
**Vấn đề:** Một comment hoặc Date Plan link vào Event Series hay occurrence cụ thể? Khi `this and following` split series, comment/reminder/linked Activity phải được quy về occurrence ổn định.  
**Tác động:** Comment/RSVP/lịch gắn sai buổi, event duplicate hoặc lost link sau sửa recurrence.  
**Xử lý:** Define stable Series ID + occurrence identity + exception relation; migration mapping khi split; không reparent comment âm thầm; require user-visible scope warnings.

### CR-015 — Timezone, all-day, Feb-29, Year-unknown birthday và DST
**Loại:** Temporal policy/data contract gap · **Severity: HIGH** · **PO: Có riêng trường hợp năm sinh không biết và nth-weekday**.  
**Nguồn:** M05 §4.5, OPEN-M05-07/08/09; M03 §4.7/TD-M03-11; M04 OPEN-M04-03; M07 §5.6; M08 §4.3, OPEN-M08-14; M10 D23.  
**Điều đã chốt:** Date-only không timezone shift; timed event có source timezone; Monthly day 31 clamp; Feb-29 anniversary Feb-28 default hoặc Mar-01 tùy chỉnh; DST gap phải được xử lý.  
**Chưa rõ:** Birthday month/day no year, nth-weekday absent, timed-only start no end, expense month boundary, remnant timed schedule after Disconnect.  
**Tác động:** Lệch ngày kỷ niệm, mở Capsule sai giờ, nhắc sai hoặc tính chi sai kỳ.  
**Xử lý:** Cross-module temporal type matrix (date-only, local timed+zone, instant, precision-unknown), temporal golden fixtures và rule rõ cho 3 open cases; tuyệt đối không gán ngày/năm giả.

### CR-016 — Wishlist Entry M03 và Wish M06 là hai đối tượng khác nhau
**Loại:** Semantic integration gap · **Severity: MEDIUM** · **PO: Không, trừ khi tự động chuyển đổi**.  
**Nguồn:** M03 D05, §3.4/§4.1; M06 D01/D06/D18–D19, §4.2; M10 §10 có dòng diễn đạt `M03 — Place, Wish, Visit`.  
**Vấn đề:** Want-to-visit một Place (M03 Wishlist Entry) khác ước mơ tổng quát (M06 Wish). M10 dùng chữ Wish ở M03 dễ làm người triển khai hiểu một đối tượng trùng owner.  
**Tác động:** Double source of truth, xóa/fulfill nhầm wish.  
**Xử lý:** Tạo glossary và link explicit, không auto merge; đề xuất errata diễn đạt `M03 Place/Wishlist Entry/Visit`, giữ `M06 Wish` là canonical Wish.

### CR-017 — Linked Goal progress đọc source đã mất quyền/stale/zero
**Loại:** Progress contract gap · **Severity: HIGH** · **PO: Điều kiện**.  
**Nguồn:** M06 §4.2–4.4, §5.4–5.5, §21; M07 §5.4/§9.6; M03 §4.5; M04 §4.4; M10 D15–D18.  
**Vấn đề:** Goal shared có thể link Savings Private, Place/Visit count; khi source bị revoke/deleted/reopened/adjusted, số progress cũ hoặc trend có thể tiết lộ nội dung Private hay tự completed.  
**Tác động:** Progress sai, Completion/Achievement trái quyền, inference thông tin tài chính.  
**Xử lý:** Metric dictionary by source with counted unit, identity, visibility, stale/error state, no hidden-source aggregate; freeze only a confirmed Achievement record, không tự Completed từ 100%.

### CR-018 — M08 Capsule Eligible, Opened và target interaction M09
**Loại:** Conditional access gap · **Severity: HIGH** · **PO: Có**.  
**Nguồn:** M08 §5.4, §12.2/OPEN-M08-09; M09 §2.2–2.3, §12.1; M10 D17/§14.4.  
**Vấn đề:** `Unlock Eligible` khác `Opened`; M09 viết target `Unlocked Capsule` eligible+access to opened content, chưa quy định rõ reaction/comment trước khi recipient mở lần đầu hay sau khi đã Opened, nhất là khi A opened còn B chưa.  
**Tác động:** Interaction/count làm lộ nội dung/metadata trước lượt mở của người nhận.  
**Xử lý:** Define per-recipient interaction gate: pre-unlock deny; after eligible but not opened chỉ action phù hợp rõ; after actual opened mới comment/react content nếu quyền cho phép; trong PausedDueToDisconnect luôn deny. Quy tắc sau Eligible cần PO phê duyệt.

### CR-019 — Notification Center ownership và hành vi đa module
**Loại:** Responsibility/documentation overlap · **Severity: MEDIUM** · **PO: Không**.  
**Nguồn:** M09 CI-09/CI-10, §11; M10 D26–D29, ST-16/ST-17, §12; M05 §11/§25.  
**Vấn đề:** M09 gọi CI-09 là Notifications Center, M10 cũng có ST-16; tuy M09 nói rõ dùng center chung, nếu coi chúng là hai app/hub sẽ vi phạm D26.  
**Tác động:** Hai inbox, hai read states/preferences, thông báo trùng.  
**Xử lý:** M10 owns one inbox/preferences/quiet hours; M09 supplies interaction event types, filter/tab/component. CI-09/ST-16 là views trên cùng nghiệp vụ, không tạo hai nguồn Notification.

### CR-020 — Quiet Hours, notification dedupe, secrecy và scheduled actions
**Loại:** Notification policy gap · **Severity: HIGH** · **PO: Có nếu bổ sung mức ưu tiên/ngưỡng mặc định**.  
**Nguồn:** M05 §4.5, OPEN-M05-05/06; M07 D15/§9.5; M08 §5.2/§13.4; M09 §11, OI-M09-02; M10 D26–D29, §12.  
**Vấn đề:** Dời hoặc gộp in-app notifications không được dời domain action. Chưa có ma trận loại cảnh báo nào được delay/coalesce, stale reminders, retry sau quyền thu hồi, bao lâu gộp reaction, tiêu đề an toàn.  
**Tác động:** Missed reminder, spam, tiết lộ Surprise/Expense, hiển thị Delivered/Opened sai.  
**Xử lý:** One delivery-state contract and category matrix, per-user quiet hours, safe previews, per-source dynamic reauthorization, dedupe identity, expiry/stale handling. Các ngưỡng/ưu tiên mang ý nghĩa sản phẩm phải duyệt, không tự bịa.

### CR-021 — Delete/Trash/Restore phụ thuộc xuyên miền và quyền xóa
**Loại:** Global data lifecycle gap · **Severity: HIGH** · **PO: Có đối với ngoại lệ quyền giữ/xóa**.  
**Nguồn:** M01 D13/§4.5; M02 BR-M02-029–033; M03 D18; M04 §21.2; M07 D29; M08 §5.5; M09 §13; M10 D30–D32/D36, §13.  
**Vấn đề:** Trash 30 ngày không đồng nghĩa purge ngay; một source bị soft-deleted vẫn có nhiều consumer; Restore không được hồi sinh quyền cũ hay gửi sự kiện lại. Hết hạn Trash, shared contribution và audit/sealed snapshot cần quy tắc purge riêng.  
**Tác động:** Cascade deletion, dangling errors, unauthorized resurrection, không tuân thủ full deletion, sai ledger.  
**Xử lý:** Lifecycle matrix per object with action ownership, retention eligibility, reference behavior, access during Trash, restore constraints, supported snapshot exception, audit/tombstone rules. Validate related links instead of cascading deletes.

### CR-022 — System Backup/Restore và replay của nghiệp vụ đã chốt
**Loại:** Recovery integrity gap · **Severity: CRITICAL** · **PO: Điều kiện về RPO/RTO và quyền restore**.  
**Nguồn:** M01 §12.4/§16.3; M02 D19/§17.5; M05 §25; M07 §9.10/§13; M08 §5.6/§13.4; M09 §13.5; M10 D31, §13.2–13.3.  
**Vấn đề:** Restore snapshot có thể vô tình replay scheduled Letter, duplicate Expense/Settlement, re-display deleted secret, open Capsule, revive revoked ACL.  
**Tác động:** Sai tiền, rò dữ liệu, sai Seal và quyền, P0 không được nghiệm thu.  
**Xử lý:** Controlled restore runbook; stable IDs, idempotent event processing, checkpoint on domain side effects, no replay of delivered/confirmed actions; tombstone and rights reconciliation; QA restores genuine files and transactions. Không cấp nút rollback toàn Space cho một người.

### CR-023 — M01 realtime collaboration, Permission Revoke, Session/Revision và M09 identity
**Loại:** Concurrency/access contract gap · **Severity: HIGH** · **PO: Không nếu không thay Dxx**.  
**Nguồn:** M01 D07/D08/D15, §4.4–4.7, §13.4, §16.3; M09 §2.2, §3.5; M10 D11/D14–D18, §11.2/§14.2.  
**Vấn đề:** Hai người sửa Page realtime, trong khi chủ Book revoke edit/Disconnect hoặc đổi Page Private; published version và comments vẫn phải gắn đúng stable ID. Undo cá nhân có thể đụng edit của B; client stale không được ghi sau revoke.  
**Tác động:** Mất dữ liệu, lộ Page/Diary Private, publication thay đổi, comment gắn nhầm.  
**Xử lý:** Document session-level rights revalidation, causal/version ownership, per-user undo semantics, save acknowledgement, reconnect/rebase, stable page/element IDs, publish checkpoint, test A/B nhiều tab cả mobile/desktop. Deep realtime P0 chỉ ở M01.

### CR-024 — Release P0 matrix và định nghĩa “full mobile/desktop”
**Loại:** Acceptance coverage gap · **Severity: HIGH** · **PO: Không nếu giữ P0**.  
**Nguồn:** Handoff §A/F/H; M01 §16.3, M02 §18–19, M03 D20, M04 D21–D22, M05 P0/AC, M06 §18–19, M07 D30/§14–15, M08 §14–15, M09 §17–18, M10 D40/§18–19.  
**Vấn đề:** BRD có acceptance lists độc lập, P0 module-specific và global; chưa có một master matrix xác nhận luồng liên hoàn và mobile parity. Dễ nhầm M04 pretty PDF itinerary P1 với M01 Photobook PDF P0, hoặc đẩy M01 advanced editor/mobile sang P1.  
**Tác động:** Phát hành khi module riêng pass nhưng 10/10 chưa đạt; thiếu bảo mật/khả năng dùng thực tế trên mobile.  
**Xử lý:** Gate có 10 module × P0 features × web mobile/desktop × privacy negative tests × offline/retry × backup/restore × integrated E2E. Không nâng P1 thành P0 và không cắt P0.

## 5. Tình trạng từng CR sau khi hoàn tất phân tích

> Cột `Đề xuất xử lý` là **disposition cho bước sau**, không phải nghiệm thu đã pass. Không có CR nào được phép bị xóa khỏi nhật ký chỉ vì đã viết contract đề xuất.

| ID | Severity | Kết luận phân tích | Nhóm xử lý | Chặn phần việc nào trước khi chốt? |
|---|---|---|---|---|
| CR-001 — Parent Shared / child Private | CRITICAL | ANALYSIS COMPLETE | `CONTRACT_TO_SPECIFY` | Chờ contract và QA; Ma trận ACL và negative tests |
| CR-002 — Published Book / Media revoke-delete | CRITICAL | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-01 + lifecycle contract |
| CR-003 — Sealed Capsule / quyền xóa | CRITICAL | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-01 + consent/deletion contract |
| CR-004 — Disconnect sau 30 ngày / unpause | CRITICAL | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-02 + reveal gating |
| CR-005 — Frozen Space / còn nợ Settlement | CRITICAL | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-03 + finance permission |
| CR-006 — Export đồng sáng tạo sau ngừng liên kết | HIGH | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-03 + export contract |
| CR-007 — Duyệt Split một phần | HIGH | ANALYSIS COMPLETE | `CONTRACT_TO_SPECIFY` | Chờ contract và QA; Financial state contract + tests |
| CR-008 — Refund sau Settlement | HIGH | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-04 + audit ledger |
| CR-009 — Cross-currency Settlement | HIGH | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-04 + FX tests |
| CR-010 — Tổng hợp tài chính lộ Private | CRITICAL | ANALYSIS COMPLETE | `CONTRACT_TO_SPECIFY` | Chờ contract và QA; Actor-visible aggregate contract |
| CR-011 — Expense trùng giữa module | HIGH | ANALYSIS COMPLETE | `CONTRACT_TO_SPECIFY` | Chờ contract và QA; Reference/idempotency contract |
| CR-012 — PDF vé và receipt ngoài M02 | HIGH | ANALYSIS COMPLETE | `CONTRACT_TO_SPECIFY` | Chờ contract và QA; File/document capability contract |
| CR-013 — Date Plan/Trip ↔ Event | HIGH | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-05 + sync contract |
| CR-014 — Series / Occurrence ID | HIGH | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-05 + reference contract |
| CR-015 — Timezone/DST/date precision | HIGH | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-06 + temporal contract |
| CR-016 — M03 Wishlist Entry vs M06 Wish | MEDIUM | ANALYSIS COMPLETE | `INTERPRETATION_RESOLVED` | Không mở lại Dxx; Glossary: 2 đối tượng khác |
| CR-017 — Linked Goal và nguồn mất quyền | HIGH | ANALYSIS COMPLETE | `CONTRACT_TO_SPECIFY` | Chờ contract và QA; Metric/ACL contract + tests |
| CR-018 — Capsule Eligible/Opened ↔ M09 | HIGH | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-02 + interaction gate |
| CR-019 — M09 CI-09 vs M10 ST-16 | MEDIUM | ANALYSIS COMPLETE | `INTERPRETATION_RESOLVED` | Không mở lại Dxx; 1 notification center do M10 sở hữu |
| CR-020 — Quiet Hours và scheduled actions | HIGH | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-07 + notification contract |
| CR-021 — Trash/Restore xuyên module | HIGH | ANALYSIS COMPLETE | `POLICY_PENDING` | Cần chính sách được PO duyệt; DEC-01 + lifecycle contract |
| CR-022 — System restore/replay trạng thái | CRITICAL | ANALYSIS COMPLETE | `CONTRACT_TO_SPECIFY` | Chờ contract và QA; Recovery contract + restore drill |
| CR-023 — Realtime M01 và revoke | HIGH | ANALYSIS COMPLETE | `CONTRACT_TO_SPECIFY` | Chờ contract và QA; Coedit concurrency/ACL contract |
| CR-024 — Global P0 mobile/desktop gate | HIGH | ANALYSIS COMPLETE | `CONTRACT_TO_SPECIFY` | Chờ contract và QA; Master P0 acceptance matrix |



## 6. Bộ hợp đồng nghiệp vụ thống nhất đề xuất (KHÔNG phải thiết kế công nghệ)

### CT-01 — Object/Field/Linked-resource Permission & Safe Projection

**Nguồn:** M01 D06/D08, §9; M02 D02/D12, §8.5/§10; M07 D27/§8; M09 §5; M10 D13–D18/§11.

- Input kiểm tra: actor, Space lifecycle, object owner/source, grant còn hiệu lực, child visibility, action-specific permission, source state, secret/reveal policy, purpose và phiên bản liên quan.
- Quyền hiệu lực **không được cao hơn** quyền của nguồn và các điều kiện của tính năng đích. `View ≠ Edit ≠ Download ≠ Export ≠ Share ≠ Approve ≠ Reveal`; M09 Comment/Reaction chỉ được thu hẹp quyền, không thay hành động nghiệp vụ.
- Các ngõ ra đều phải kiểm quyền: detail, thumbnail, cover, metadata/title, count, search, feed, recommendation, analytics, total amount, attachment, direct URL, PDF, export, share link và notification/deep link.
- Không hiển thị count/tên/placeholder nêu rõ secret/private target nếu ngay cả sự tồn tại của nó chưa được phép tiết lộ. Nếu đã được phép biết có liên kết nhưng không được xem bytes, có thể hiển thị trạng thái an toàn theo chính sách riêng.
- Asset Private dùng trong Book Shared có đúng ba cách M02 đã chốt: Keep Private, Share Existing có xác nhận, Create Shared Copy độc lập. Snapshot Diary khi chèn vào Page phải được người dùng xác nhận quyền của bản sao đích mà không mở Diary gốc.
- Không thể cam kết thu hồi những file người dùng đã tải về trước khi revoke; phải chặn **lần truy cập mới** và không dùng cache/token để vòng qua ACL.
- QA negative test chạy với A/B độc lập, nhiều tab, desktop/mobile và link sâu lưu từ trước.

### CT-02 — Reference, Identity, Ownership và Idempotency

**Nguồn:** M03 §3.4/§12; M04 §13; M05 §12; M06 §11; M07 D26/§9; M09 §2/§10; M10 §10.1.

Mỗi quan hệ chéo cần mô tả các thuộc tính **nghiệp vụ**, không quy định loại database: (1) owner module; (2) source object type/ID; (3) consumer type/ID; (4) mục đích liên kết; (5) quyền và current state; (6) event/occurrence scope nếu có; (7) revision/chỉnh sửa có điều kiện; (8) actor và consent; (9) liên kết đã mất nguồn/Trashed/Restored; (10) khóa chống lặp thao tác.

- `M05 Event` khác `M03 Date Plan` và `M04 Trip Activity`; một Event không được tạo lần hai khi retry hoặc bấm lại Link.
- Một M07 Expense liên kết Trip/Visit/Booking/Goal vẫn là **một Expense**, không dùng `link-existing` như `create-new`.
- Receipt/Booking document là tài nguyên có lifecycle/ACL riêng; M02 photo/video asset không ngầm làm kho PDF.
- `M03 Wishlist Entry (muốn tới một Place)` **khác** `M06 Wish (mong ước tổng quát)`; không đồng nhất để dedup hoặc chuyển đổi không có thao tác người dùng.
- M09 comment trên Book/Page/Media/Expense/Calendar occurrence phải giữ đúng target ID khi reorder, rename, split recurrence hoặc restore.

### CT-03 — State & Time Dictionary

| Loại | Nguồn canonical | Các trạng thái phải tách | Không được làm |
|---|---|---|---|
| Photobook | M01 | Draft, Published Publication, Revision Draft, Archived, Trashed | Save Draft sửa ngầm Publication |
| Media | M02 | original/variant; active/trashed/purged; linked grants | Revoke gốc nhưng cho reader/export vòng quyền |
| Calendar | M05 | date-only; zoned local datetime; instant; Series/Occurrence/Exception | Shift all-day date qua timezone hoặc sinh Event duplicate |
| Expense | M07 | paid fact; split/approval; debt; settlement; refund/adjustment | Pending thành Confirmed chỉ vì tổng khớp |
| Savings/Goal | M07/M06 | confirmed movement/balance vs linked progress/achievement | 100% tự Completed hoặc ghi balance thứ hai |
| Letter | M08 | Draft/Scheduled/Delivered và recipient Opened tách riêng | Thông báo read thành Letter Opened |
| Capsule | M08+M10 | immutable Sealed; time eligibility; reveal policy; each recipient opened | Đổi `unlock_at`, reveal trong Frozen, mở trước giờ |
| Notification | M10 | queued/displayed/read/expired, khác domain state | Quiet Hours làm thay thời điểm domain action |
| Trash/Restore | Owner M01–M09 + M10 governance | active/trashed/restorable/purged, ACL hiện hành | Restore hồi sinh revoked permission hoặc tạo object mới |

**Các trường hợp thời gian đã chốt:** Feb-29 anniversary mặc định 28/02 năm không nhuận (cho chọn 01/03); day-31 monthly clamp; thời điểm DST không tồn tại phải được xử lý; date-only không tự dời ngày. Các trường hợp chưa chốt như birthday chỉ biết month/day, nth weekday vắng kỳ, timed event thiếu end thuộc DEC-06; không tự đặt mặc định.

### CT-04 — Financial Ledger, Approval & Reports

**Nguồn:** M07 D04–D13, D18–D29; §5/§8/§9; M03/M04/M06 consumer.

1. `Expense` không phải `Settlement`, `Refund`, `Contribution`, `Withdrawal` hoặc `Budget estimate`.
2. Một Expense nhiều payer: tổng confirmed payment bằng amount của Expense khi đánh dấu đã thanh toán; tổng confirmed allocations khớp theo phương pháp split đã duyệt; phần pending approval không thành confirmed debt.
3. Split/FX khác hoặc thay đổi sau khi chốt phải có revision và xét hiệu lực approval; không sửa audit trail ngầm.
4. Settlement Pending không giảm nợ; Confirmed cần người nhận xác nhận, partial được phép; reverse/correct là lịch sử độc lập, không xóa giao dịch cũ.
5. Refund làm giảm net expense theo bản ghi có quan hệ; có thể tạo reverse obligation sau settlement; không dùng Expense âm thay Refund.
6. Budget và báo cáo dựa trên tập dữ liệu actor có quyền xem, dedup theo Expense ID; nhiều currency không được cộng khi thiếu FX đã chấp thuận.
7. Savings Balance xuất phát từ confirmed movements, không biến thành con số ngân hàng đã xác minh; M06 Linked Goal chỉ sử dụng metric hợp lệ, không được tự Completed.
8. Nếu A/B chưa thống nhất FX của nghĩa vụ cross-currency, **không được** đánh dấu nghĩa vụ đổi tiền đã Confirmed. Chính sách tình huống cụ thể nằm trong DEC-04.

**Golden fixtures bắt buộc:** 101.001 VND split Equal cho 2 người (dư 1 VND được xử lý nhất quán); A trả 700.000/B trả 300.000, mỗi người chịu 500.000 thì B hoàn A 200.000; approval hỗn hợp; refund sau settlement; JPY/VND thiếu FX; duplicated linking; private expense trong shared trip; split revision sau confirmation; pending recurring expense.

### CT-05 — Sealed, Delivery, Reveal, Interaction và Disconnect

**Nguồn:** M08 §5/§12/§13, M09 §2.2, M10 D33–D37/§14.2–14.4.

`can_open_capsule(actor)` phải đồng thời thỏa: đúng recipient + source permission + Space/lifecycle policy được phép + `now >= original_unlock_at` theo thời gian có thẩm quyền + không cancelled/deleted + không Paused. `recipient_opened` chỉ sau thao tác mở hợp lệ từng người.

- Khi Disconnect, dừng delivery/reveal của nội dung M08 chưa trao; original scheduled/unlock timestamp và Sealed Snapshot **không đổi**.
- `Unlock Eligible` không tự `Opened`. Comment/Reaction M09 không làm người nhận thấy content qua feed/count trước reveal và không đổi trạng thái Opened.
- Scheduled Letter Delivered phải bất biến; Notification Center read không tự xác lập Letter/Capsule Opened.
- Tiến trình sau 30 ngày, after reconnect, xóa một snapshot co-created và quyền interaction giữa eligible/not-opened là **POLICY_PENDING**, xem DEC-01/DEC-02; không lấy phương án bảo thủ bên dưới làm quy tắc đã duyệt.

### CT-06 — Shared Notifications (M10 owns, M09 contributes types)

**Nguồn:** M09 CI-09/CI-10, §11; M10 D26–D29/§12; M05 reminders.

- Một Notification Center, read state và preferences theo mỗi người, do M10 quản trị. M09 cung cấp comment/mention/reaction feed và type-specific UI.
- Nguồn module phát domain event chính thức; thông báo dựa trên **trạng thái đã được xác nhận**, có retry/dedupe và revalidate ACL khi hiển thị/mở.
- Preview `Full/Private/Hidden` chỉ được **giảm** độ lộ so với quyền nguồn. Secret Surprise và expense Private không được tiết lộ title/amount qua ngõ khác.
- Quiet Hours và grouping trì hoãn/gộp bản ghi thông báo thông thường, không dời domain event như due date, scheduled Letter, eligible Capsule, Settlement approval.
- Ngưỡng grouping, category priority và rule quá hạn vẫn cần DEC-07; không tự chọn số phút/giờ.

### CT-07 — Delete, Trash, Restore, Backup & Export

**Nguồn:** M02 §12–13; M07 D29/§13; M08 §13; M09 §13; M10 D30–D36/§13–14.

| Action | Baseline có thể suy ra từ BRD | Bảo vệ bất biến |
|---|---|---|
| Archive | Đổi khả năng hiển thị/điều hướng theo module | Không purge file, không làm mất lịch sử |
| Soft delete / Trash | Xóa thông thường vào Trash tối thiểu 30 ngày | Không cascade child/consumer xuyên module |
| Restore item | Chỉ trước purge, đúng quyền hiện hành, tái liên kết hợp lệ | Không hồi sinh grant bị revoke, không duplicate ID/Event/Expense |
| Purge / delete account | Có yêu cầu và kiểm quyền riêng; ngoại lệ bản Published/Sealed/audit phải có policy | Không giữ mãi dữ liệu trái quyền xóa hợp lệ, không âm thầm xóa đóng góp của người khác |
| My Data export | Chỉ các object + linked resource actor có quyền export | Không dump toàn Couple Space, không bypass Sealed |
| Shared export | Có quyền riêng theo shared item / contribution | Không reveal Secret hoặc Private linked resource |
| System backup | Bản phục hồi hệ thống có thể chứa nội dung nhạy cảm được bảo vệ | Không biến backup thành tải tự do cho partner |
| System restore | Quy trình có kiểm soát, điều hòa ACL/consent/tombstone và event history | Không replay Letter/Settlement, không mở Capsule, không khôi phục quyền đã hủy |

**Cần PO chốt trước:** xử lý quyền giữ bản Published/Sealed so với full deletion, đóng góp chung khi Disconnect, trạng thái sau 30 ngày, đồng sở hữu cùng đòi hủy (DEC-01/02/03). Chỉ khi đã có policy mới viết test `expected` cho những nhánh này.

### CT-08 — M01 Realtime Co-edit và trạng thái Publish

**Nguồn:** M01 D05–D10/D15; §6–9/§13.4; M09 stable target; M10 current permissions.

- Simple ↔ Advanced thay giao diện, không xóa layer/element. Co-edit hai người trên cùng text, object và page phải hội tụ; presence riêng mỗi session/tab/device.
- Chỉ xác nhận saved khi thay đổi đã được lưu hợp lệ; mất mạng cho phép retry/reconcile, không mất acknowledged edits.
- Undo của A không được xóa sửa đổi sau đó của B; xuất bản tạo checkpoint bất biến và không trộn concurrent Draft chưa xác nhận.
- Quyền phải được tái đánh giá sau revoke/Page override/Disconnect; thao tác đang gửi chỉ được chấp nhận nếu tại thời điểm commit vẫn được phép, trạng thái UI không được nói đã lưu khi server từ chối.
- M09 comments gắn Stable Book/Page identity, không gắn theo thứ tự trang hiện tại.
- Realtime cursor của module khác **không** được tự coi là P0 vì M01 đã chốt đặc thù này.



## 7. Decision Docket — 07 chính sách trình PO (tất cả CHƯA PHÊ DUYỆT)

> Đây là đề xuất kèm khuyến nghị phân tích; không có quyền tự chuyển sang Approved. Nếu PO chưa trả lời, **giữ nguyên BRD**, chỉ đặc tả/kiểm thử những nhánh đã chắc chắn theo Dxx. Khi duyệt cần ghi ID, lựa chọn, ảnh hưởng trước/sau, người phê duyệt, ngày hiệu lực và các AC bị ảnh hưởng.

### DEC-01 — Immutable Published/Sealed × Media Revocation, Trash, Full Purge (CR-002/003/021)

- **Nguồn:** M01 D05/D10/§4.5–4.7; M02 BR-M02-027–033/§12; M08 D16–D21/D27–D28; M10 D30–D32/§13.4–13.5/OPEN-M10-05.
- **A — Khuyến nghị thận trọng:** Giữ cấu trúc/manifest/historical metadata của bản Published/Sealed bất biến; cấp quyền truy cập bytes độc lập và có thể từ chối khi revoke; xử lý full purge qua một yêu cầu có trạng thái, kiểm ownership/đồng tác giả và mọi ngoại lệ lưu giữ. Khi cần redaction/placeholder phải mô tả trung thực rằng bản xem/export mới đã bị lược theo quyền, không viết lại original authored history.
- **B — Không nên tự động:** Xem mọi bản Published/Sealed như quyền giữ một bản byte vĩnh viễn, bất kể yêu cầu xóa hợp lệ; vi phạm nguyên tắc deletion.
- **C — Không nên tự động:** Xóa Media gây xóa liên hoàn Book/Diary/Capsule hay thay Seal manifest; vi phạm bất biến và no cascade.
- **Còn phải được PO xác nhận:** ai quyết định full purge của bản đóng góp chung, giới hạn retention/backup, quyền recipient vs sender, chính xác Reader/PDF hiển thị gì khi media biến mất. **Không thể tự cho phép phá Seal hoặc giữ file vĩnh viễn.**

### DEC-02 — Sau Disconnect và quyền M08 interaction trước/sau recipient Opened (CR-004/018)

- **Nguồn:** M10 D33–D37/§14.2–14.4/OPEN-M10-07; M08 §5/OPEN-M08-09; M09 §2.2.
- **A — Khuyến nghị bảo thủ:** Không tự unpause sau 30 ngày hoặc ngay khi reconnect; yêu cầu xác nhận đủ quyền theo loại nội dung. Capsule tới hạn trong thời gian Frozen vẫn giữ original unlock time và chỉ có thể Eligible-to-open khi chính sách Reveal được cho phép; M09 chỉ comment/react content sau khi recipient có quyền mở/xem thật sự.
- **B — Cần xét nếu muốn:** Tự giải phóng pending content khi tái kết nối hoặc khi hết 30 ngày; rủi ro lộ Secret nếu không có consent.
- **Cần PO xác nhận:** nội dung scheduled chưa Delivered tồn tại ở trạng thái nào sau khi Space Closed, điều kiện đồng ý unpause, ai được phản đối/hủy, xử lý A opened còn B chưa, lịch sử audit và quyền export theo mỗi recipient.

### DEC-03 — Nghĩa vụ hậu Disconnect và quyền xuất tài sản đồng sáng tạo (CR-005/006)

- **Nguồn:** M07 D08/D11–D13; M10 D33–D36/§13.1/§14.2–14.3/OPEN-M10-06.
- **A — Khuyến nghị:** Frozen chặn shared write tạo nghĩa vụ mới; có luồng xử lý hạn chế cho nghĩa vụ **đã xác nhận** trước đó (partial settlement, recipient confirmation, receipt của khoản cũ, correction/refund có audit), với xác thực phù hợp; export theo object và phần đóng góp mà người đó có quyền xuất.
- **B — Không nên:** Cho tất cả thao tác tài chính và full-Space export trong Frozen; tạo nguy cơ ép nợ và lấy dữ liệu Private của partner.
- **C — Không nên:** Khóa toàn bộ đối soát và export ngay tức thì mà không có cơ chế tất toán nghĩa vụ cũ đã chốt.
- **Cần PO xác nhận:** chính xác thao tác allowlist trong/sau cửa sổ 30 ngày, người được confirm, quy trình tranh chấp, quyền export Book/Trip/Goal có đóng góp cả hai, hành vi khi một người offline.

### DEC-04 — Refund/Adjustment sau Settlement, chênh currency (CR-008/009)

- **Nguồn:** M07 D11–D13/D24–D25; §5.2/§5.4–5.6; OPEN-M07-12/13.
- **A — Khuyến nghị:** Bất biến lịch sử Settlement/Expense gốc, tạo Refund/Adjustment có trạng thái và quan hệ; nghĩa vụ chênh lệch được xác nhận riêng. Nếu Settlement khác currency, cần A/B xác nhận amount trả, amount nhận, cặp currency, FX rate snapshot/method/date, rounding; thiếu xác nhận thì vẫn Pending.
- **B — Không nên:** Sửa số tiền kỳ trước, tự điền tỷ giá hoặc tự đảo người nhận tiền mà không tạo lịch sử/consent.
- **Cần PO xác nhận:** cách định tuyến refund về ai, xử lý dispute sau Confirmed, FX rounding/partial settlement cross-currency, kỳ báo cáo của các correction có quan hệ với kỳ gốc.

### DEC-05 — Date Plan/Activity ↔ M05 Event; Series/Occurrence semantics (CR-013/014)

- **Nguồn:** M03 §12.4; M04 D17/OPEN-M04-04; M05 §12.2–12.4/OPEN-M05-14; M09 OI-M09-07.
- **A — Khuyến nghị:** Source M03/M04 giữ business state; M05 giữ Event; Cancel/Delete/Unlink không cascade bên kia. Nếu một hành động ảnh hưởng người xem/shared occurrence, yêu cầu UI xác nhận phạm vi (single occurrence, this/future, series, source only/event only) và xử lý link/revision/idempotency.
- **B — Không nên:** Xóa Date Plan/Trip đồng thời xóa Event/booking/Comment hoặc áp sửa entire series khi người dùng chỉ chỉnh occurrence.
- **Cần PO xác nhận:** mặc định khi Cancel source có Event link, chính sách `Unlink vs Cancel Event`, re-link và restore, comment/RSVP mapping khi split series.

### DEC-06 — Date precision & Calendar nonstandard recurrence (CR-015)

- **Nguồn:** M05 §4.5/§8.3/OPEN-M05-07/08/09; M07 §5.6; M08 §4.3.
- **A — Khuyến nghị:** Phân loại `date-only`, `local datetime + zone`, `instant`, `month/day no year` một cách minh bạch; birthday thiếu năm không được gán năm giả; recurring nth-weekday không tồn tại có một xử lý rõ (đề xuất skip kỳ đó, trừ khi người dùng chọn lại); timed event không có end cần rule rõ và cảnh báo.
- **B — Không nên:** Sử dụng UTC shift cho date-only, tự chế năm sinh, tự dời Sealed unlock hoặc tự áp quy tắc tháng 31 sang mọi loại recurrence.
- **Không xin duyệt lại:** Feb-29 anniversary và monthly 31-day clamp đã chốt trong M05.
- **Cần PO xác nhận:** các trường hợp chưa chốt cụ thể trong OPEN M05, không thay đổi rule ngày đã duyệt.

### DEC-07 — Notification class priority, grouping, Quiet Hours và stale handling (CR-020)

- **Nguồn:** M05 reminder; M08 scheduled state; M09 §11; M10 D26–D29/§12.
- **A — Khuyến nghị:** Một inbox M10; safe preview theo source; Quiet Hours trì hoãn/gộp notification thông thường nhưng không dời nghiệp vụ; retry+dedupe; security alert riêng; stale reminder không được hiển thị như sự kiện hiện hành.
- **B — Không nên:** Mỗi module có inbox/read state độc lập, hoặc notification read tự cập nhật M08 Opened/M07 Approval.
- **Cần PO xác nhận:** category nào trì hoãn/ngoại lệ, cách ưu tiên, ngưỡng grouping/dedupe, thời điểm hết giá trị của reminders và preview tiêu chuẩn từng nhóm; không tự chọn minutes/hours.

### DEC — Biểu mẫu phê duyệt để sử dụng sau khi chủ dự án thực sự lựa chọn

| Trường | Quy tắc ghi |
|---|---|
| Decision ID | DEC-01…DEC-07 hoặc mã phụ nếu cần chia nhỏ |
| Trạng thái hiện tại | **PENDING_PO_APPROVAL** |
| Tùy chọn chọn | A/B/C hoặc policy viết rõ, không dùng im lặng là đồng ý |
| BRD và Dxx ảnh hưởng | Ghi danh sách chính xác, có thể là `NO_DXX_CHANGE` nếu chỉ bổ sung điều khoản |
| Tác động P0 | Không được tự làm giảm P0, ghi thêm nghiệm thu cần thiết |
| Chuyển tiếp | Sau approval: amendment/new supplemental decision, trace AC, chốt contract, test; BRD V1.0 gốc giữ làm baseline lịch sử |



## 8. Master P0 Release Coverage — Baseline và kiểm thử xuyên phân hệ

**Chú ý:** Đây là **ma trận bao phủ ở cấp miền** để lập Master Acceptance sau review, **không** thay thế từng AC chi tiết trong BRD và **không** khẳng định QA Passed. Mỗi dòng phải có AC gốc và cặp desktop/mobile trước khi phát hành.

| Module | Nguồn kiểm chứng chính | Nghiệp vụ P0 tuyệt đối không được cắt | Negative/Integration bắt buộc |
|---|---|---|---|
| M01 | D01–D15, §2.4/§13/§16.3 | Library/Reader, Simple+Advanced, Page/Element, realtime 2 người, snapshots Diary, Publish/version, PDF, Trash/Restore | Page ACL, media revoke, same-text race, undo, publish in-flight, mobile authoring |
| M02 | D01–D20, §2.1/§10–13 | Photos/Videos, upload/retry/dedup, Albums/Smart Collection, Viewer/Edit ảnh, share/copy, search, trash/export/backup | EXIF/GPS, asset/album ACL, used-media deletion, token access, mobile upload |
| M03 | D01–D20, §2.1/§12/§17 | Place, Wishlist Entry, Collection, Date Plan, Visit/Review, favorites/revisit, picker/insights, history, export/trash | One Visit≠Trip Completed, no duplicate Event/Expense, privacy, mobile flows |
| M04 | D01–D22, §2/§13/AC | Trip/Quick+Full Planner, itinerary/activity, booking/transport/accommodation, documents, map/timezone, collaboration, structured export | Private document, linked M05 Event, actual cost M07, retries, mobile editing |
| M05 | D01–D22, §1.2/§12/§20/§22 | Month/Week/Day/Agenda, Event/Anniversary, RSVP, reminders, recurrence, timezone, permissions, history/trash/export | Feb-29, day-31, DST, per-user reminder, linked Event identity, mobile edits |
| M06 | D01–D24, §1.2/§11/§18 | Wish/Collections, Goals/Tasks/Milestones, confirmations/Achievement, Linked progress, Inspire Board, rights/history/export | 100%≠Completed, source revoked/stale, private Savings, no duplicate ledger |
| M07 | D01–D30, §1.2/§5/§13–15 | Expense/Split/approval, partial Settlement, refunds, Budgets, Savings, recurring pending, multi-FX, Reports/Export, recovery | Split rounding, approval consent, FX missing, refund after settle, 2 payer, no private inference |
| M08 | D01–D30, §1.2/§5/§10/§14 | Moments/Milestones, Letters, Surprise, Capsule builder/seal/reveal, scheduling, history/export | No early open, Secret leak, Delivered≠Opened, per-recipient state, D35 pause |
| M09 | D01–D24, §1.2/§9/§17–18 | Reaction (1 active/target), threaded comments, mentions, feed, views/permissions, notifications, delete/export | Source ACL, targets stable, reveal-gated M08, comment≠RSVP/approval, no chat |
| M10 | D01–D40, §2/§9/§18–19 | 2 accounts/pairing, security/session/MFA optional P0, per-item permission, accessibility/themes/locale, Notification Center, export/backup/restore, Trash, Disconnect | No admin bypass, no ACL resurrection, lifecycle 30 ngày, private content, mobile parity |

**Các ranh giới P0/P1 đã được BRD quy định rõ, không được trộn:** M01 PDF P0 nhưng video/nhạc nhúng trong trang không mặc định P0; M04 structured export P0 và beautifully laid-out itinerary PDF P1; M05 in-app reminders P0, email/push P1, 2-way Google/Outlook sync P2; M07 manual FX P0, automatic FX P1; M09 comment không mở chat P0 mới.

### 8.1. E2E Negative / Golden Test Matrix

| Test | Kịch bản và dữ liệu | Kỳ vọng bắt buộc | CR |
|---|---|---|---|
| E2E-01 | A/B Pairing sau khi A có Private Diary và ảnh | Pairing không tự chia sẻ dữ liệu cũ | 001,021 |
| E2E-02 | A chia sẻ Album chứa Private Media | B không được suy ra ảnh qua thumbnail/count/metadata | 001 |
| E2E-03 | A tạo Shared Copy rồi revoke original | B chỉ truy cập copy có quyền; original Private | 001,002 |
| E2E-04 | Shared Book có Page Private | Reader, search, export PDF của B chỉ có nội dung được phép | 001,002 |
| E2E-05 | Diary Private được Copy as Snapshot vào Shared Book | Grant của snapshot được xác nhận; Diary gốc không mở quyền | 001,002 |
| E2E-06 | Media original bị edit/revoke/Trashed sau Publish | Bản Publication authored bất biến; truy cập bytes theo source policy, không cascade | 002,021 |
| E2E-07 | Hai account cùng gõ một text box M01, 2 devices/account | Kết quả hội tụ; không mất acknowledged saves; Undo an toàn | 023 |
| E2E-08 | Revoke Edit quyền A/B đang mở editor + reconnect | Không ghi mới trái quyền, không báo save giả | 001,023 |
| E2E-09 | Trip Shared liên kết Booking PDF Private | Không tiết lộ tên file/ticket/preview qua Trip hoặc M09 | 001,012 |
| E2E-10 | Date Plan M03 → M05 Event, mạng retry 3 lần | Chỉ 1 canonical Event, link ổn định, không auto Visit | 013 |
| E2E-11 | Activity M04 ↔ Event; Cancel/Unlink/Restore | Không xóa cascade; hành vi cụ thể chỉ pass khi DEC-05 được duyệt | 013 |
| E2E-12 | Recurring M05 split this-and-future, có comment/RSVP | Mọi target giữ đúng occurrence ID; không trôi sang kỳ khác | 014 |
| E2E-13 | 29/02, monthly 31, DST gap và all-day timezone change | Theo các rule đã duyệt; không shift date-only; open case chưa duyệt bị chặn | 015 |
| E2E-14 | Booking deposit + Trip expense + Visit link cùng bill | Một Expense ID; dự toán, deposit và đã trả được phân biệt | 011 |
| E2E-15 | Expense 101.001 VND Equal split A/B | Allocation integer minor units, không thất thoát 1 VND | 007 |
| E2E-16 | Multi payer: A 700.000/B 300.000, chịu 500.000/người | Nghĩa vụ ròng B hoàn A 200.000, 1 Expense | 007,011 |
| E2E-17 | Expense có 1 phần allocation đã duyệt, 1 phần pending | Confirmed vs pending rõ, không tự ép nợ | 007 |
| E2E-18 | Confirmed Settlement rồi partial Refund | Không xóa lịch sử; ghi adjustment/reversal có xác nhận phù hợp | 008 |
| E2E-19 | Nợ JPY, trả VND nhưng chưa đồng ý FX | Không auto settled; hiển thị missing/disputed conversion | 009 |
| E2E-20 | Private Expense nằm trong Shared Trip/Goal report | Totals không tính hidden amount hoặc làm lộ qua hiệu số | 010,017 |
| E2E-21 | M06 Linked Goal sử dụng M07 Savings rồi mất quyền | Không tiết lộ balance; tiến độ stale; không auto Completed | 010,017 |
| E2E-22 | Surprise M08 Secret có ảnh, Task và Expense liên kết | Không lộ sự tồn tại/metadata qua Home/Search/Counts/Notifications | 001,010,018,020 |
| E2E-23 | Capsule Seal T+30d, người dùng sửa đồng hồ thiết bị | Không mở trước trusted time; sealed manifest bất biến | 003,004 |
| E2E-24 | Đến unlock time trong Space Frozen; sau đó reconnect | Không reveal tự động; không đổi timestamp; nhánh sau reconnect chờ DEC-02 | 004,018 |
| E2E-25 | A mở Capsule nhưng B chưa opened, B nhận mention | Không lộ content của B qua comment/count/notification | 018,020 |
| E2E-26 | Quiet Hours có Scheduled Letter | Letter domain Delivered theo rule, Notification có thể chờ; Read≠Opened | 020 |
| E2E-27 | Delete/Restore Media/Book/Comment cross-module trong 30d | Không cascade; restore chỉ grant còn hiệu lực; không duplicate objects | 021 |
| E2E-28 | Account Disconnect khi còn debt, shared Book và pending Capsule | Chặn new shared writes, bảo vệ shared contributions, pause M08; phần hậu kỳ chờ DEC-01/03 | 003–006,021 |
| E2E-29 | System restore từ backup thật sau delete/revoke/delivery/settlement | Không resend, không double-settle, không ACL resurrection, không early reveal | 022 |
| E2E-30 | Từng luồng P0 M01–M10 trên mobile và desktop với hai account | Create/view/edit/approve/export/restore phù hợp domain; không chỉ read-only mobile | 024 |

### 8.2. Tiêu chí RELEASE BLOCKER

1. Bất kỳ P0 nào thiếu trên **một trong 10 module** hoặc chỉ có desktop mà không có mobile.
2. Có leak Private/Secret/Sealed qua linked resource, count, notification, direct URL, PDF, export hoặc backup cấp sai quyền.
3. Có duplicate hoặc sai confirmed debt/Settlement/FX, hoặc một người bị áp nợ khi chưa approve.
4. Capsule bị mở sớm, Sealed timestamp bị sửa, hoặc unrevealed bị phát trong Disconnect.
5. M01 có acknowledged edit bị mất, stale client ghi sau revoke, undo làm mất sửa đổi của partner, hoặc Published bị mutate.
6. Backup chỉ tồn tại trên giấy mà chưa restore được nội dung cả 10 module và kiểm tra state/ACL/finance.
7. Có 1 trong 13 CR `POLICY_PENDING` nhưng nhóm tính năng phụ thuộc chính sách đó được triển khai bằng mặc định do người lập trình tự chọn.



## 9. Evidence Locator — địa chỉ tới BRD gốc theo CR

**Cách đọc:** `M07:L289` nghĩa là dòng 289 tính từ đầu file `OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md`. Đây là các điểm tra cứu **được tìm trong file gốc**, không phải toàn bộ bằng chứng. Nội dung diễn giải/gợi ý chính nằm trong CR Register; khi tạo amendment phải đọc cả section lân cận và Acceptance Criteria.

| CR | Locator trong source file đã xác minh |
|---|---|
| CR-001 | M01:L838 (`## 9.2. Kế thừa quyền`); M02:L451 (`## 8.5. Album share`); M10:L1545 (`## 11.2. Chính sách`) |
| CR-002 | M01:L261 (`## 4.5. Trạng thái Photobook`); M02:L949 (`BR-M02-027`); M02:L955 (`BR-M02-033`); M10:L1616 (`## 13.5.`) |
| CR-003 | M08:L237 (`## 5.4. Time Capsule`); M08:L1232 (`## 13.3. Snapshot`); M10:L1913 (`OPEN-M10-05`) |
| CR-004 | M10:L1635 (`## 14.2. Luồng Disconnect`); M10:L1661 (`## 14.4.`); M10:L1915 (`OPEN-M10-07`) |
| CR-005 | M07:L279 (`## 5.2. State machine — Settlement`); M10:L1646 (`## 14.3. Domain-specific`) |
| CR-006 | M10:L1598 (`## 13.1. My Data Export`); M10:L1914 (`OPEN-M10-06`); M01:L285 (`## 4.7.`) |
| CR-007 | M07:L264 (`## 5.1. State machine`); M07:L289 (`## 5.4. Quy tắc tính`) |
| CR-008 | M07:L279 (`## 5.2. State machine`); M07:L1563 (`OPEN-M07-13`) |
| CR-009 | M07:L311 (`## 5.6. FX`); M07:L1562 (`OPEN-M07-12`) |
| CR-010 | M07:L712 (`## 8.4.`); M10:L1545 (`## 11.2.`); M06:L681 (`## 11.`) |
| CR-011 | M07:L769 (`## 9.10.`); M03:L1005 (`## 12.10.`); M04:L752 (`## 13.5.`) |
| CR-012 | M04:L524 (`## 8.3.`); M07:L1551 (`OPEN-M07-01`); M02:L82 (`## 1.4.`) |
| CR-013 | M05:L624 (`## 12.2.`); M03:L965 (`## 12.4.`); M04:L1395 (`OPEN-M04-04`) |
| CR-014 | M05:L1455 (`OPEN-M05-14`); M09:L1707 (`OI-M09-07`) |
| CR-015 | M05:L491 (`## 8.3.`); M05:L1448 (`OPEN-M05-07`); M07:L311 (`## 5.6.`) |
| CR-016 | M03:L93 (`Wishlist Entry`); M06:L180 (`## 4.2.`); M10:L1509 (`## 10.1.`) |
| CR-017 | M06:L681 (`## 11.`); M07:L751 (`## 9.6.`); M06:L234 (`## 5.`) |
| CR-018 | M09:L137 (`Unlocked Capsule`); M08:L1371 (`OPEN-M08-09`) |
| CR-019 | M09:L321 (`## CI-09`); M10:L469 (`## 5.16.`) |
| CR-020 | M10:L1584 (`## 12.3.`); M10:L1592 (`## 12.5.`); M09:L1456 (`## 11.3.`) |
| CR-021 | M02:L655 (`## 12.2.`); M10:L1612 (`## 13.4.`); M09:L1515 (`## 13.2.`) |
| CR-022 | M10:L1606 (`## 13.3.`); M07:L769 (`## 9.10.`); M09:L1529 (`## 13.5.`) |
| CR-023 | M01:L724 (`## 8.4.`); M01:L846 (`## 9.3.`); M10:L1545 (`## 11.2.`) |
| CR-024 | M01:L1461 (`## 16.3.`); M07:L1440 (`## 14.1.`); M10:L1851 (`## 18.4.`) |

### 9.1. Danh sách tệp được đọc/kiểm tra tính toàn vẹn

| Tệp | Số dòng | SHA-256 |
|---|---:|---|
| `OUR_SPACE_PROJECT_HANDOFF_V2.0.md` | 656 | `bc6ece4b0e74db3531c8a4202895928017afabaf66b8f5cb4a161b0a7775bd55` |
| `OUR_SPACE_NEXT_CHAT_PROMPT_V2.0.md` | 35 | `33754828298f241211716768a537dd0b5c5ba662840182a7f85b66006fd31107` |
| `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md` | 1523 | `746eb5ec8c9ea4ba1e9dc07da5ffc67153882585aad291d55ed923ba51fb0428` |
| `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md` | 1370 | `d5c92c0ab60e05e4cc36d84beaef315327460c28c3de0c5885aaa318e5c17530` |
| `OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md` | 1732 | `fc8805ed7c082f66d2356edb0c6ed7087762637666909cb8887b837a198bc620` |
| `OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md` | 1443 | `94531050bcaaf84467360b7f4617c73dfa13e9f7db38cc4bde7264686c3d5f7d` |
| `OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md` | 1478 | `10a991b293b5a200d8d3cb7b14b02fa673d8b44f6300f90aa3ccb289a260e819` |
| `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md` | 1477 | `75771d5d129ef9c7fae9cfd8902b69718675219945d5c05a365ae7880a8ce823` |
| `OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md` | 1578 | `c687d52817ae253fac44bd21abdf20eaab55bb370be762c61446b4f5d75773fa` |
| `OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md` | 1392 | `cbacbad47ddab5d7f878a67b15860853c28d4e28e63add4417c0ae6df5365b23` |
| `OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md` | 1749 | `c7804a3a8c3e089b02cdd41c98cc1a91934abbdf26c0adc308a55e16a650bbfd` |
| `OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md` | 1949 | `3209bc0b2c4821e145e34847bf117845e4f300357691823efa5b163e6a108706` |

**Bản gốc không bị thay đổi:** Gói ZIP và thư mục `Docs` là nguồn tham chiếu nghiệp vụ. Bản V0.1 giữ lại làm audit trail; bản V1.0 là kết quả phân tích hoàn tất. `References/photobook.mp4` và `photobook_contact_ourspace.jpg` được kiểm kê tồn tại, không được dùng để suy ra các chức năng chưa duyệt.

## 10. Quy trình xử lý sau Review — không phụ thuộc vào việc hỏi lại Dxx

1. **Giữ nguyên** 10 BRD V1.0 trong `OurSpace/Docs/` và report V0.1 trong `OurSpace/Reviews/`.
2. Lưu báo cáo V1.0 này vào `OurSpace/Reviews/` như artifact phân tích chính. Không viết lại BRD gốc thành V1.1 khi chưa có quyết định nghiệp vụ mới được phê duyệt.
3. Dùng nhóm `INTERPRETATION_RESOLVED` (CR-016/019) làm glossary/ownership ngay; dùng 09 `CONTRACT_TO_SPECIFY` để chuẩn bị hợp đồng và test dựa trên Dxx hiện hành.
4. Trước khi triển khai hành vi gây hậu quả chính sách, lấy **một lần phê duyệt** cho 07 DEC với các nhánh đã liệt kê; mỗi điều được phê duyệt phải có evidence/audit riêng, không hiểu sự im lặng là đồng ý.
5. Sau đó xây cross-domain contracts chính thức + Master P0 AC-by-AC + negative test corpus. **Chưa phải bước chọn tech stack hoặc viết code** trong tài liệu hiện tại.
6. Khi bắt đầu triển khai thật và chạy QA, cập nhật từng CR với test evidence, trạng thái Passed/Failed/Blocked. Chỉ đóng toàn bộ release gate sau khi **10/10 P0 mobile + desktop** và restore drill đạt.

### 10.1. Sơ đồ điều kiện chuyển trạng thái (nghiệp vụ, không phải timeline lập trình)

`BRD V1.0 APPROVED` → `CROSS-BRD REVIEW COMPLETE / OPEN DECISIONS RECORDED` → `NEW POLICY DECISIONS APPROVED WHERE NECESSARY` → `CROSS-MODULE CONTRACTS BASELINED` → `MASTER P0 ACCEPTANCE MATRIX COMPLETE` → `TECHNICAL DESIGN / IMPLEMENTATION` → `QA & RESTORE DRILLS` → `10/10 P0 VERIFIED`.

**Điểm dừng bắt buộc:** Review xong **không tự động** cho phép bất kỳ ai (bao gồm AI/Codex) chọn một chính sách mới về quyền Private, sở hữu bản chung, bù trừ nợ, FX settlement, xóa Sealed hoặc tự Reveal. Không được áp một phương án DEC vào sản phẩm nếu chủ dự án chưa phê duyệt.

## 11. Ghi nhận các kết luận KHÔNG phải Conflict

- M05 sở hữu Calendar Event, M03 Date Plan và M04 Activity giữ nghiệp vụ riêng; liên kết không làm đổi owner.
- M08 Seal bất biến và M10 D35 pause unrevealed cùng đúng, vì `time eligibility` tách khỏi `reveal permission`.
- M07 Savings Balance chính thức; M06 linked Goal chỉ đọc progress hợp lệ, đạt target không tự Completed.
- M09 Comments/Reactions khác M03 Review, M05 RSVP, M06 Completion, M07 Financial Approval/Settlement.
- M01 realtime sâu là P0 riêng của Photobook; không áp realtime cursors P0 sang toàn bộ ứng dụng.
- M03 Wishlist Entry khác M06 Wish; hai View CI-09 của M09 và ST-16 của M10 cùng dùng một Notification Center.

---

**END OF REVIEW V1.0 — REVIEW COMPLETED; 247 Dxx PRESERVED; 13 POLICY ISSUES PENDING PO APPROVAL; CODE/TECH STACK NOT STARTED.**
