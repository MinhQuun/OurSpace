# OUR SPACE — CROSS-BRD CONSISTENCY REVIEW

**Bản làm việc:** REVIEW V0.1 · 23/10/2026 · **Trạng thái:** DRAFT REVIEW / NOT APPROVED AMENDMENT  
**Phạm vi:** `OUR_SPACE_PROJECT_HANDOFF_V2.0.md` và 10 BRD M01–M10 V1.0.  
**Nguyên tắc:** Không sửa BRD; không mở lại 247 quyết định Dxx; không chọn công nghệ; không hạ P0.

## 1. Kiểm chứng nguồn

Đã mở gói `OUR_SPACE_COMPLETE_HANDOFF_WITH_REFERENCES_2026-10-23(1).zip`. Gói có 12 tệp Markdown trong `Docs/`: 1 Handoff, 1 Restart Prompt và 10 BRD. Có thêm `References/photobook.mp4` và `References/photobook_contact_ourspace.jpg`; hai tài nguyên hình/video được xác nhận có mặt, không dùng để suy ra yêu cầu nghiệp vụ mới. Cả **12/12 Markdown khớp SHA-256** theo `MANIFEST_SHA256.txt` khi chạy kiểm tra từ thư mục `Docs/`. Số lượng Dxx phân biệt trong 10 BRD: **15 + 20 + 20 + 22 + 22 + 24 + 30 + 30 + 24 + 40 = 247**; từng dãy liên tục từ D01 đến mã cuối module.

Các nguồn viện dẫn sau dùng ký hiệu `Mxx §n`, `Mxx Dnn`, hoặc `OPEN-*`. Người đọc tra lại đúng tệp `Docs/OUR_SPACE_Mxx_..._BRD_V1.0.md` tương ứng. Handoff là nguồn định hướng/tổng hợp; nếu xung đột nội dung nghiệp vụ, đối chiếu BRD gốc rồi lập issue, không lấy tệp viết sau để tự ý ghi đè.

## 2. Kết luận kiểm toán sơ bộ

- **Không tìm thấy một cặp Dxx trọng yếu nào chắc chắn bất khả đồng thời thực hiện** qua các chủ đề được đối chiếu. Hai mối tưởng là xung đột đã có lời giải nghiệp vụ: M05 là canonical Calendar Event sau khi link (`M05 §1.4, §12`); M08 bất biến của Seal và M10 D35 cùng tồn tại theo các trục thời gian/quyền riêng (`M10 §14.4`).
- **24 vấn đề CR-001–CR-024** sau đây chủ yếu là *cross-BRD contract gaps* cần đặc tả chung trước code; một số là nguy cơ chồng nhiệm vụ/thuật ngữ trong tài liệu. Severity phản ánh **hậu quả nếu triển khai không có lời giải**, không có nghĩa BRD hiện tại chưa được phê duyệt.
- **P0 không giảm:** 10/10 modules, privacy per-item, M01 realtime co-edit, M05 event, M07 finance, M08 Seal, M09 chỉ interaction, M10 lifecycle/backup, mobile/desktop parity.
- Quy ước cột **PO = Có**: lựa chọn mới có hậu quả về quyền/tài sản/tiền/khả năng reveal, cần Product Owner phê duyệt chính sách hoặc Change Request trước triển khai nhánh đó. **PO = Không**: có thể làm contract/test dựa trên Dxx hiện có, không được tự đổi Dxx. **PO = Điều kiện**: chỉ cần khi giải pháp cụ thể thay đổi quyền/nghiệp vụ đã duyệt.

## 3. Source-of-Truth và write boundary

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

## 4. Conflict / Gap Register

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

## 5. Ma trận cross-module trọng điểm

| Luồng E2E | Phân hệ | Điều kiện P0/Negative test quan trọng | CR |
|---|---|---|---|
| Private Diary/Media → Shared Book → PDF | M01/M02/M09/M10 | Reader, thumbnail, export, comments không vượt linked ACL; immutable publish | 001,002,023 |
| Album/Asset Private → Shared Moment/Surprise | M02/M08/M09/M10 | Không leak asset/title/count/GPS/preview | 001,003,010,018 |
| Place Wishlist → Date Plan → Event → Visit | M03/M05/M06/M09 | Không đồng nhất M03 Wishlist với M06 Wish; one Event; không auto Visit | 013,014,016 |
| Trip Activity ↔ Event ↔ Booking docs | M04/M05/M02/M10 | Time owner, recurrence link, noncascade, docs permission | 012,013,014,015 |
| Trip/Visit/Booking → Expense/Refund → Report | M03/M04/M07/M10 | Same Expense ID, deposit ≠ total, approval/FX, no private inference | 005,007–013 |
| Savings Goal M07 → Linked Goal M06 | M06/M07/M10 | Confirmed balance only; no hidden source inference; goal 100%≠Completed | 010,017 |
| Anniversary/Event → Scheduled Letter/Capsule | M05/M08/M10 | Delivery independent notification; no early unlock; DST/quiet | 004,015,020 |
| M09 Comment/Reaction trên 8 module | M01–M10 | Stable target IDs, source ACL, Reveal gates, no action equivalence | 001,014,018,019 |
| Disconnect / 30 days / Reconnect / Delete | M01–M10 | No new shared writes, paused unrevealed, shared exports, settlement exceptions | 003–006,021–023 |
| Backup/restore entire Space | M01–M10 | No replay, no ACL resurrection, financial invariants, true file restore | 002–005,021,022 |

## 6. Quyết định mới cần PO chốt *một đợt* (không hỏi lại Dxx)

Các lựa chọn sau là **đề xuất**, chưa phải baseline:

1. **DEC-01 (CR-002/003/021):** Ma trận quyền giữ, xem, export và full purge đối với Media đã nằm trong Published Book hoặc Sealed Snapshot; cách xử lý khi original bị revoke/deleted và co-owned Capsule cần hủy. Đề xuất tách immutable layout/manifest với entitlement to access bytes; không lưu vĩnh viễn chỉ vì có reference.
2. **DEC-02 (CR-004/018):** Disposition sau 30 ngày Disconnect và quy trình unpause khi Reconnect, bao gồm Time Capsule đã quá `unlock_at` trong lúc Frozen; lựa chọn interaction trước/sau individual Opened. Đề xuất không auto release, giữ original Seal time.
3. **DEC-03 (CR-005/006):** Quyền xử lý hậu kỳ debt/settlement/refund và xuất đóng góp chung trong/sau 30 ngày; yêu cầu step-up và per-object eligible rights. Đề xuất chỉ cho khép nghĩa vụ đã duyệt, không sinh nợ mới.
4. **DEC-04 (CR-008/009):** Chính sách settlement khác currency, dispute sau confirmed, tỷ giá khi hoàn tiền và cách tính nghĩa vụ hồi tố. Đề xuất history immutable, FX snapshot được A/B xác nhận ở mỗi nghĩa vụ quy đổi.
5. **DEC-05 (CR-013/014):** Defaults khi Cancel/Delete/Unlink một Date Plan/Activity có Event linked; quy ước comment/RSVP ở occurrence khi split series. Đề xuất không cascade nguồn và không chọn entire series ngầm.
6. **DEC-06 (CR-015):** Birthday thiếu năm, nth-weekday recurrence không có occurrence trong kỳ, timed Event chỉ có start; yêu cầu không tạo ngày/năm giả.
7. **DEC-07 (CR-020):** Notification category delivery policy với Quiet Hours, stale reminders, category priority, coalescing threshold, safe preview. Không làm chậm domain delivery/reveal chỉ để tôn trọng Quiet Hours.

Tất cả các đề xuất trên phải trở thành **Decision/Change Request** với: affected Dxx, before/after, affected BRDs, P0 effect, privacy/finance/Seal effect, acceptance tests và approval timestamp **chỉ sau khi PO chốt**. Không sửa BRD V1.0 gốc trước bước đó.

## 7. Hành động chuẩn bị không cần PO chốt nghiệp vụ cũ

- Viết **Cross-module Permission Matrix**, bao phủ linked child ACL, field-level/thumbnail/count/search/export/download/notifications.
- Viết **Reference & Identity Contract**: source ID, relation/purpose, canonical owner, version, tombstone, idempotency; tránh duplicate Expense/Event/Comment và lẫn Wish.
- Viết **Unified State & Time Contract**: calendar date-only vs timed, event series/occurrence, letter/capsule temporal axes, expense period, approval/confirmation events.
- Viết **Lifecycle & Recovery Matrix**: Archive/Trash/Restore/Cancel/Delete/Revoke/Disconnect/Full Purge/Backup; single-source links và no cascade.
- Viết **M07 Golden Ledger Test Corpus**: partial approval, multi payer, split 101001 VND, refund after settlement, cross-currency, pending recurring, private aggregate.
- Viết **M01 Realtime Contract & QA Corpus**, bao phủ Simple↔Advanced, personal undo, multi-session, permission revoke, loss/reconnect, publish immutability và Page-linked M09 comments.
- Viết **Global P0 E2E Acceptance Map** trên mobile và desktop; đánh dấu `BLOCKED_BY_CROSS_CONTRACT` cho các luồng chưa thể QA, không coi chúng là đã pass.

## 8. Release gates (điều kiện không thể bỏ)

1. **P0 của cả M01–M10** phải được nghiệm thu, đúng phân loại P0/P1/P2; không có module nào “đã làm gần xong” được coi là đủ.
2. Không có lỗi leak Private/Secret/Sealed qua direct URL, search, preview, count, shared linked resource, report, notification, export, backup extraction hoặc cross-account session.
3. Không có double Expense, sai split/rounding, settlement lặp, refund bỏ lịch sử, FX mix hoặc nợ do partner chưa approve.
4. Không có Capsule early unlock, đổi Sealed timestamp, reveal sau Disconnect, Delivered Letter edit hoặc notification đọc thay Opened.
5. Không có confirmed save bị mất trong M01 realtime, hoặc quyền vừa bị revoke vẫn ghi thành công; không có Published revision bị mutate.
6. Backup/restore *thực tế* được kiểm thử trên dataset đủ 10 module, gồm file bytes, source references, current ACL, sealed state, finance ledger, notification non-replay.
7. Mọi nghiệp vụ P0 ở desktop và mobile đủ thao tác, không chỉ khả năng đọc.

## 9. Kết quả, giới hạn và change control

Bản V0.1 này là **audit finding register**, không phải phê duyệt chính sách mới hoặc Technical Architecture. Những `OPEN-*` trong BRD gốc phần nhiều ghi rõ chỉ là open architecture/NFR; không được tự nâng chúng thành xung đột Dxx. Ngược lại, một open policy tác động tới privacy, finances, Seal, Disconnect hoặc deletion phải chặn triển khai nhánh liên quan cho tới khi có người quyết định hợp lệ. Mọi tài liệu BRD V1.0 đã giao vẫn giữ nguyên.
