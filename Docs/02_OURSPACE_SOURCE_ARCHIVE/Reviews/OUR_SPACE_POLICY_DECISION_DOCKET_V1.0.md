---
document_id: OURSPACE-POLICY-DECISION-DOCKET
project: Our Space
version: 1.0
created: 2026-10-23
language: vi-VN
status: PROPOSED_PENDING_PRODUCT_OWNER_APPROVAL
baseline: 10 BRD V1.0 APPROVED; 247 Dxx LOCKED
inputs:
  - OUR_SPACE_PROJECT_HANDOFF_V2.0.md
  - OUR_SPACE_M01...M10...BRD_V1.0.md
  - OUR_SPACE_CROSS_BRD_CONSISTENCY_REVIEW_FINAL_V1.0.md
implementation_status: NOT_STARTED
---

# OUR SPACE — POLICY DECISION DOCKET V1.0
## Bộ đề xuất chính sách liên phân hệ DEC-01–DEC-07

**Ngày soạn:** 23/10/2026  
**Trạng thái toàn văn:** `PROPOSED / PENDING PO APPROVAL`  
**Người quyết định:** Product Owner (chủ dự án). AI chỉ phân tích và đề xuất; **không có quyền phê duyệt thay**.  
**Loại tài liệu:** Phụ lục trình quyết định nghiệp vụ, **không phải BRD thay thế, không phải thiết kế kỹ thuật**.

> **Cách đọc:** Mỗi DEC có phần (1) *Bất biến đã duyệt*, (2) *Khoảng trống thật sự*, (3) *Phương án A được khuyến nghị*, (4) *Phương án/ngoại lệ*, (5) *Quyết định để phê duyệt*, (6) *Kiểm thử và hệ quả*. Những điều nằm trong Phương án A **chưa phải chính sách chính thức**. Không sửa 247 Dxx hay thu hẹp P0 của M01–M10 khi áp dụng tài liệu này.

---

# 1. Ranh giới, tính toàn vẹn và quy trình ra quyết định

## 1.1. Nguồn bằng chứng

- `Docs/OUR_SPACE_PROJECT_HANDOFF_V2.0.md` và 10 tệp `Docs/OUR_SPACE_M01…M10_*_BRD_V1.0.md` là **nguồn nghiệp vụ chính thức**.
- `Reviews/OUR_SPACE_CROSS_BRD_CONSISTENCY_REVIEW_FINAL_V1.0.md` là phân tích nguồn dẫn xuất: 24 CR, 7 DEC, 8 nhóm contract. Không dùng tài liệu này để ghi đè BRD.
- Trong lượt lập Docket, các điều khoản liên quan của M01, M02, M05, M07, M08, M09, M10 được kiểm tra đối chiếu thêm bằng văn bản gốc. Bảng Locator cuối file cho đường dẫn và dòng để xác minh.
- Bộ bàn giao gốc có 12 tệp Markdown khớp manifest SHA-256 theo báo cáo Review; không thay đổi tài liệu nguồn.

## 1.2. Điều đã khóa — KHÔNG đem ra chọn lại

1. Private mặc định; mỗi object/field/linked resource tuân thủ quyền riêng; không tiết lộ Private bằng tổng hợp, preview, PDF hay export.
2. Single source of truth: M05 Event; M07 Expense/Budget/Savings và Settlement; M08 Sealed Snapshot; M10 quyền, Space lifecycle và một Notification Center; M09 chỉ Comments/Reactions, không chat độc lập.
3. Không xóa dây chuyền xuyên phân hệ; Trash tối thiểu 30 ngày đối với xóa thông thường; item restore/system restore, export/backup phải có và bảo vệ quyền.
4. M01 Simple/Advanced Editor, realtime hai người, Publication bất biến, PDF P0; mobile/desktop đầy đủ P0 của cả 10 module.
5. M08 Seal không sửa nội dung/recipient/`unlock_at` đã Seal, không mở trước giờ hợp lệ; `Unlock Eligible` khác `Opened`.
6. M10 D35: Disconnect do một người thực hiện sau step-up (không cần partner đồng ý), chuyển Frozen, tạm dừng nội dung chưa Delivery/Reveal; **không tự Reveal, không tự unpause khi Reconnect, không đổi Sealed timestamp**.
7. M05 đã chốt February 29 Anniversary mặc định February 28 (có lựa chọn March 1), Monthly day 31 clamp; khi sửa/xóa recurring occurrence phải hỏi phạm vi.
8. M07 Confirmed Settlement do **người nhận xác nhận**; Pending không giảm nợ; original currency/amount không thay vì biến động tỷ giá, hai bên xác nhận khi settle khác currency.

## 1.3. Phân loại tình trạng

| Mã trạng thái | Ý nghĩa |
|---|---|
| `PENDING_PO_APPROVAL` | Đề xuất rõ ràng nhưng chủ dự án **chưa duyệt** |
| `APPROVED_AS_PROPOSED` | PO xác nhận đầy đủ nhánh A và không có ngoại lệ |
| `APPROVED_WITH_EDITS` | PO chốt văn bản sửa, kèm version và nội dung sửa |
| `NEEDS_REVISION` | PO muốn phương án khác; chưa được triển khai |
| `SUPERSEDED` | Có quyết định mới được duyệt thay thế, có truy vết |

**Lưu ý:** `APPROVED` là trạng thái **chính sách**, không tương đương thiết kế kỹ thuật hoàn tất hay QA Passed. Các lựa chọn chưa duyệt không được mang vào code như default im lặng.

## 1.4. Bản đồ phạm vi đề xuất

| DEC | CR liên quan | Nội dung quyết định mới | Mức ảnh hưởng nếu xử lý sai | Trạng thái |
|---|---|---|---|---|
| DEC-01 | CR-002, CR-003, CR-021 | Media/Publication/Sealed: thu hồi, xóa, lưu giữ, bản xem | Critical | PENDING |
| DEC-02 | CR-004, CR-018 | Unrevealed sau Disconnect; Reconnect; tương tác trước Opened | Critical | PENDING |
| DEC-03 | CR-005, CR-006 | Nghĩa vụ đã Confirmed và export đồng sáng tạo sau Disconnect | Critical | PENDING |
| DEC-04 | CR-008, CR-009 | Refund/Adjustment hậu Settlement; settle khác currency | High | PENDING |
| DEC-05 | CR-013, CR-014 | Calendar cancel/unlink/restore; recurring occurrence links | High | PENDING |
| DEC-06 | CR-015 | Yearless birthday; recurrence kỳ trống; Event chỉ có Start | High | PENDING |
| DEC-07 | CR-020 | Quiet Hours, loại thông báo, grouping, stale/preview | High | PENDING |

**Không thay Dxx mặc định:** Nếu PO duyệt, tạo phụ lục chính sách được đánh số `POL-DEC-xx`, bổ sung acceptance tests và cập nhật trạng thái CR. Nếu kiểm tra tác động phát hiện mâu thuẫn trực tiếp với Dxx, phải tách Change Request riêng, **không** âm thầm sửa BRD V1.0.

---

# 2. DEC-01 — Published/Sealed Snapshot khi Media bị Revoke, Trash hoặc Full Purge

**Truy vết:** CR-002 / CR-003 / CR-021.  
**Nguồn:** M01 D05/D10, §4.5–4.7, §9.4; M02 BR-M02-027–034, §8.5/§12; M08 §5.4–5.5, OPEN-M08-01/07; M10 §13.4–13.5, OPEN-M10-05.

## 2.1. Đã chốt

- Publication đã chốt không bị thay nội dung chỉ vì bản Draft, ảnh gốc hay Media Editor thay đổi.
- M01 không được xuất PDF hoặc Reader chứa nội dung trái quyền; việc chèn nội dung Private vào Book Shared yêu cầu xác nhận chia sẻ bản sử dụng.
- M02 hỗ trợ `Keep Private`, `Share Existing`, `Create Shared Copy`; original và shared copy có tư cách quyền khác nhau.
- Xóa thông thường vào Trash 30 ngày; purge không xóa Book/Diary/Capsule liên quan theo dây chuyền và không được giữ bytes mãi trái yêu cầu xóa hợp lệ.
- M08 Sealed manifest/snapshot/recipient/`unlock_at` không bị sửa để xử lý quyền xóa; một yêu cầu Cancel/Delete là hành động lifecycle khác, có guard.

## 2.2. Khoảng trống cần quyết định

Trường hợp ảnh nằm trong một Published Book hoặc Sealed Capsule: việc chỉnh original, thu hồi quyền, soft delete và full deletion cần cho kết quả bản đọc/bản xuất khác nhau. Ai có quyền yêu cầu xóa bytes của tác phẩm đã đồng tạo, và có cần đồng thuận hay không, chưa có chính sách đầy đủ.

## 2.3. Phương án A — **Khuyến nghị**

**DEC-01.A1 — Tách bản ghi lịch sử khỏi quyền truy cập nội dung.** Bản Published/Sealed giữ version/reference/Seal timestamp đã xác lập; mỗi lần đọc/preview/export vẫn kiểm tra quyền hiện tại trên nội dung có thể đọc. Không coi “immutable” là “mọi người từng có quyền đều được tải bytes mãi mãi”.

**DEC-01.A2 — Ma trận khi source thay đổi.**

| Tình huống | Reader/PDF/Preview mới | Dữ liệu/đối tượng liên quan |
|---|---|---|
| Original M02 được sửa | Published không tự đổi phiên bản ảnh đã chốt; quyền truy cập bản được phép được kiểm tra | Original revision tiếp tục thuộc M02 |
| Quyền dùng/chia sẻ ảnh bị thu hồi | Che nội dung không còn quyền, không trả bytes qua direct link/cache/export | Giữ cấu trúc Book/Capsule và ghi lý do không khả dụng theo thông tin người xem được biết |
| Original vào Trash (soft delete) | Không phát mới nội dung vi phạm chính sách source/rights; có trạng thái `Unavailable` an toàn | Reference còn để có thể khôi phục; không auto xóa parent |
| Full Purge được xác nhận hợp lệ | Ngừng phục vụ bản bytes không còn căn cứ lưu giữ, bao gồm derivative/snapshot liên quan nếu nằm trong phạm vi xóa | Giữ record lịch sử tối thiểu, đã làm sạch metadata nhạy cảm nếu được phép; không giả vờ ảnh vẫn tồn tại |
| Restore trong điều kiện hợp lệ | Recheck quyền, visibility, lifecycle trước khi có thể hiện lại | Không tự restore ACL đã revoke hoặc tạo Published revision mới |
| Shared Copy độc lập đã được tạo hợp lệ | Đánh giá quyền/xóa của copy riêng, không mặc nhiên xóa theo original hoặc mặc nhiên tồn tại vô hạn | Provenance giữ theo phạm vi được phép hiển thị |

**DEC-01.A3 — Minh bạch về xuất bản.** Nếu PDF/Reader tạo mới phải che ảnh đã mất quyền, ghi nhãn trung tính: “Một phần nội dung không còn khả dụng cho bản xem/xuất này.” Không sửa trái phép snapshot lịch sử và không chèn tên file, lý do riêng tư hay danh tính người xóa mà người xem không có quyền biết. PDF đã được người dùng tải hợp lệ trước đó không thể thu hồi khỏi thiết bị của họ bằng phần mềm.

**DEC-01.A4 — Quy trình full deletion hợp lệ.** Yêu cầu được ghi nhận thành `Requested → Under Review → Approved/Rejected/Partially Approved → Processing → Completed/Failed`, theo phạm vi đối tượng/bản sao/backup. Chính sách phải cân nhắc sở hữu và quyền xóa của mỗi bên; yêu cầu của một người không mặc nhiên hủy mọi đóng góp của người kia; **nhưng** quyền của người kia cũng không cho phép lưu vĩnh viễn dữ liệu của người yêu cầu nếu không có căn cứ hợp lệ. Các ngoại lệ pháp lý và thời hạn backup phải được kiểm tra khi thiết kế vận hành — **không** tự đặt thời hạn lưu giữ mới ở Docket.

**DEC-01.A5 — Capsule có hai người đóng góp.** Cancel cả Capsule đã Seal yêu cầu xác nhận của các bên có quyền liên quan khi có thể; nếu một bên offline/phản đối, không âm thầm phá Seal hoặc Reveal sớm. Nếu xuất hiện yêu cầu xóa một phần dữ liệu cá nhân hợp lệ, đưa phần đó vào quy trình xử lý quyền/xóa riêng, có thể tạm chặn quyền phục vụ nội dung tranh chấp trong khi xác minh; không tự suy diễn thành quyền xóa toàn bộ tác phẩm chung.

## 2.4. Phương án B và đánh đổi

- **B1 — Giữ mọi snapshot/bytes vĩnh viễn:** Reader/PDF ổn định hơn, nhưng có nguy cơ xâm phạm quyền xóa và riêng tư; **không khuyến nghị**.
- **B2 — Xóa Media thì cascade xóa Book/Capsule:** đơn giản hóa việc xóa bytes, nhưng phá lịch sử và quy tắc không cascade; **không hợp lệ theo BRD đã duyệt**.
- **B3 — Cho một người đơn phương hủy toàn bộ Capsule đồng tác giả:** xử lý nhanh tranh chấp, nhưng tước quyền của bên còn lại; **không khuyến nghị**.

## 2.5. Nội dung chính xác trình PO

**Phê duyệt DEC-01.A1–A5** như chính sách mới về phân tách immutable record và access bytes, safe placeholder cho bản xuất mới, quy trình full deletion theo từng phần/quyền, và hủy Capsule đồng sở hữu phải có xử lý tranh chấp; các thời hạn/ngoại lệ lưu giữ chỉ được chốt sau đánh giá dữ liệu và vận hành.

**Nếu không chọn A:** PO cần chỉ rõ policy bản xem sau revoke, ai có quyền yêu cầu xóa bytes, cách xử lý khi người đồng tạo không đồng ý, và điều kiện backup purge. Không dùng im lặng làm câu trả lời.

## 2.6. Acceptance tests tối thiểu

- T1: A chỉnh original, Publication phiên bản cũ không tự đổi.
- T2: A revoke sau Publish, B refresh Reader/PDF mới không lấy được bytes trái quyền.
- T3: Trash original không xóa Book, comment hay Capsule; links báo unavailable.
- T4: Shared Copy độc lập được kiểm quyền/xóa theo copy, không theo original một cách mù quáng.
- T5: Full deletion sau xác nhận không còn phục vụ derivative thuộc phạm vi phải xóa; không làm lộ metadata trong placeholder.
- T6: Restore không thay Seal timestamp, không tái sinh ACL revoked và không auto Reveal.

**Ảnh hưởng:** M01/M02/M08/M10 (+ M09 linked interactions); không làm thay đổi phạm vi P0.  
**Trạng thái:** `PENDING_PO_APPROVAL`.

---

# 3. DEC-02 — Unrevealed sau Disconnect và quyền tương tác M09 trước/sau Opened

**Truy vết:** CR-004 / CR-018.  
**Nguồn:** M08 §5.2–5.6, OPEN-M08-02/09; M09 §2.2–2.3; M10 D35, §14.2–14.4, OPEN-M10-07.

## 3.1. Đã chốt

- Disconnect có cửa sổ xử lý 30 ngày và chặn new shared writes; Scheduled Letter, unrevealed Surprise, Sealed Capsule chưa Reveal **Paused**.
- Không auto unpause do thời gian trôi qua hay Reconnect; `unlock_at` Sealed không đổi; `Eligible` và `Opened` độc lập theo recipient.
- Delivered Letter không tự thành Draft; M09 không tương tác với bí mật chưa được mở theo quyền.

## 3.2. Phương án A — **Khuyến nghị**

**DEC-02.A1 — Sau cửa sổ 30 ngày.** Khi Space chuyển Closed/Archived, phần unrevealed vẫn ở trạng thái *không được phép trao/mở* nếu chưa có căn cứ quyền mới. Hệ thống không tự gửi dồn hay coi hết 30 ngày là hạn Reveal. Dữ liệu còn lưu hay được xóa phải tuân theo DEC-01 và lifecycle/retention được phê duyệt, **không phải lưu vô hạn**.

**DEC-02.A2 — Reconnect.** Kết nối lại không hồi sinh grants cũ, không phát thư/capsule theo queue cũ. Mỗi nội dung chờ khôi phục cần một hành động xác nhận mới hợp lệ theo loại: đối với nội dung đơn tác giả, chủ sở hữu có quyền quyết định tiếp tục gửi nhưng quyền nhận/xem của recipient vẫn phải hợp lệ; đối với Collaborative Capsule, cần đủ xác nhận của những người có quyền trong chính phiên bản đã Seal. Không chỉnh snapshot hay ngày Seal để “gửi lại”. Nếu không thể bảo đảm đủ consent, vẫn Paused.

**DEC-02.A3 — Eligibility trong lúc Paused.** `now ≥ original_unlock_at` có thể đúng nhưng Reveal vẫn Denied khi paused; khi đủ phép mới cho người nhận mở **không trước** timestamp đã Seal. Notification đến muộn không làm thay đổi thời điểm Eligible và không tự ghi Opened.

**DEC-02.A4 — M09 Interaction Gate.** Người nhận chưa thực sự `Opened` không thấy comment/reaction/mention/count chứa metadata của nội dung bên trong Capsule; quyền comment/react trên *nội dung đã mở* chỉ cấp cho người đã Opened và còn source permission. Nếu A Opened mà B chưa, A có thể tương tác theo quyền của A, nhưng B không nhận preview/feed/notification có khả năng tiết lộ cho tới khi B được phép mở. Đối với Delivered Letter hoặc Revealed Surprise, dùng delivery/reveal + recipient permission đúng đối tượng, không thay bằng notification read state.

**DEC-02.A5 — Tranh chấp, hủy, lỗi gửi.** Actor được phép yêu cầu hủy/thu hồi trước Reveal theo quy trình M08; khi tranh chấp, trạng thái và quyền được nêu rõ cho từng recipient, không đơn phương đọc Secret của partner. Retry của scheduled job phải idempotent, không gửi trùng khi kết nối lại.

## 3.3. Phương án B và đánh đổi

- **B — Auto Reveal sau 30 ngày hoặc khi Reconnect:** giảm thao tác xác nhận, nhưng có thể lộ nội dung chưa đủ quyền/đồng thuận và vi phạm nguyên tắc M10 §14.4; **không được chọn** nếu không đi qua Change Request chính thức.
- **C — Cho comment ngay khi Eligible dù chưa Opened:** mở tính tương tác sớm hơn nhưng dễ tiết lộ bí mật qua counter/feed; **không khuyến nghị**.

## 3.4. Nội dung trình PO

**Phê duyệt DEC-02.A1–A5**: giữ paused sau Closed cho tới khi có chính sách xử lý hợp lệ; Reconnect phải reauthorize từng nội dung; M09 content-interaction chỉ sau Opened theo từng recipient; không tự cấp quyền mới, không tự gửi bù, không đổi Seal timestamp.

## 3.5. Acceptance tests

- T1: Disconnect trước `unlock_at`, qua thời điểm unlock và qua mốc 30 ngày vẫn không Reveal.
- T2: Reconnect không auto unpause; khi đủ consent mới truy cập theo guard.
- T3: A Opened/B chưa: B không thấy comment preview/count/Secret từ M09.
- T4: Retry notification không tự set `Opened` hoặc `Delivered` lần hai.
- T5: Hủy hợp lệ đua với scheduled delivery không có hai trạng thái cuối trái nhau.

**Ảnh hưởng:** M08/M09/M10 (+ M05 notification/time); **trạng thái:** `PENDING_PO_APPROVAL`.

---

# 4. DEC-03 — Xử lý nghĩa vụ M07 và Export dữ liệu đồng sáng tạo sau Disconnect

**Truy vết:** CR-005 / CR-006.  
**Nguồn:** M07 D08/D11–D13/§5; M10 D33–D37, §13.1, §14.2–14.5, OPEN-M10-06; M01 §4.5/§9; M04 §11.

## 4.1. Đã chốt

- Một bên có quyền Disconnect sau step-up, không cần partner chấp thuận. Frozen/Disconnecting chặn shared write tạo nghĩa vụ mới; 30 ngày là cửa sổ xử lý.
- Expense/Settlement đã Confirmed có audit; Settlement chỉ Confirmed khi người nhận xác nhận; không tự xóa lịch sử tài chính.
- My Data Export khác Shared Export. Quyền export luôn xét theo object và linked resource; không dump toàn Space.

## 4.2. Phương án A — **Khuyến nghị**

**DEC-03.A1 — Allowlist hậu Disconnect, không tạo nghĩa vụ mới.** Trong cửa sổ 30 ngày, chỉ cho thao tác đối soát trên nghĩa vụ đã Confirmed **trước lúc Frozen**, với kiểm quyền riêng và audit: xem lịch sử/khoản outstanding, đề xuất thanh toán, xác nhận đã nhận, cung cấp bằng chứng cho khoản cũ (theo quyền), yêu cầu đối chiếu/chỉnh sai đã có căn cứ, và export hợp lệ. Chặn create shared Expense, new Split obligation, new Savings commitment và new shared collaboration.

**DEC-03.A2 — Hai bên không còn hợp tác.** Không ép một người Confirmed khi người ấy offline hoặc phản đối; khoản chưa có xác nhận vẫn Pending/Disputed, không tự trừ nợ. Tạo hành vi `Proposed → Confirmed/Rejected/Disputed` cho nghiệp vụ hậu kỳ nhưng không sửa dòng gốc. Mọi Correction/Refund phát sinh từ lịch sử phải đi theo DEC-04 và quy trình quyền M07.

**DEC-03.A3 — Sau cửa sổ 30 ngày.** Giữ lối **đọc/xuất theo quyền hiện hành** đối với chứng cứ lịch sử và, nếu còn nghĩa vụ Confirmed chưa đối soát, cho một lối xử lý **giới hạn đúng khoản nợ cũ** (không mở lại Space/cộng tác mới). Đây là *đề xuất mới cần PO phê duyệt*; không mặc nhiên áp dụng nếu luật/quy định lưu giữ buộc phải xử lý khác. Nếu tài khoản đã Delete theo yêu cầu hợp lệ hoặc hết quyền, hành động không có quyền phải từ chối rõ.

**DEC-03.A4 — Shared works export.** Với Book/Trip/Goal đồng sáng tạo, mỗi người được xuất các phần họ có quyền `Export` tại **thời điểm tạo và giao tệp xuất**, bao gồm nội dung Shared hợp lệ; không được dùng quyền đồng tạo để xuất toàn bộ asset/Diary/receipt Private của partner. File có tham chiếu bị thu hồi cần redaction an toàn và lời giải thích trung tính; không lấy lại asset quyền đã hết chỉ vì lúc sáng tác từng thấy.

**DEC-03.A5 — Offline và tranh chấp.** Nếu partner offline, yêu cầu được lưu ở Pending/Disputed, không tự xác nhận và không tự xóa quyền truy vết. Quyền export cá nhân không phụ thuộc partner online nếu dữ liệu exportable và actor được phép; export phần đồng sở hữu đang tranh chấp phải thu hẹp đúng quyền thay vì dùng full-dump.

## 4.3. Phương án B/C

- **B — Khóa tất cả tài chính/export khi Frozen:** giảm write nhưng ngăn đối soát nợ hợp lệ và lấy dữ liệu cá nhân; **không khuyến nghị**.
- **C — Mở lại tất cả thao tác tài chính trong Frozen:** tiện thao tác nhưng tạo nghĩa vụ mới trái nguyên tắc; **không hợp lệ**.
- **D — Hết 30 ngày thì mọi outstanding nợ tự được đánh dấu đã trả:** trái quy tắc Settlement confirmation và audit; **không hợp lệ**.

## 4.4. Nội dung trình PO

**Phê duyệt DEC-03.A1–A5**: allowlist xử lý nợ cũ, phần ngoại lệ sau 30 ngày dành riêng cho Confirmed outstanding, tranh chấp không tự giải, export đúng quyền từng phần; không tạo bất kỳ nghĩa vụ Shared mới khi Space Frozen/Closed.

## 4.5. Acceptance tests

- T1: A Disconnect, B không tạo được Expense chung mới.
- T2: A báo đã trả nợ cũ, B chưa confirm → Settlement vẫn Pending.
- T3: 30 ngày kết thúc, nợ đã Confirmed chưa tất toán vẫn có lịch sử và quy trình hạn chế nếu PO duyệt A3.
- T4: B export Trip Shared không thấy receipt Private của A.
- T5: Một người offline không tự chuyển request của người kia thành Confirmed.

**Ảnh hưởng:** M07/M10/M01/M04/M06; **trạng thái:** `PENDING_PO_APPROVAL`.

---

# 5. DEC-04 — Refund/Adjustment sau Settlement; thanh toán khác currency

**Truy vết:** CR-008 / CR-009.  
**Nguồn:** M07 D08/D11–D13/D24–D25, §5.1–5.6, OPEN-M07-12/13; M10 §14.3.

## 5.1. Đã chốt

- Expense gốc có currency và amount gốc, các approval gắn phiên bản; đã Confirmed không bị sửa ngầm.
- Refund có liên hệ đến gốc; Settlement Confirmed chỉ khi người nhận xác nhận và `Confirmed → Corrected/Reversed` phải có audit.
- Không net khác currency nếu thiếu FX hợp lệ. Settlement khác currency cần số tiền thực trả/nhận và phương pháp quy đổi **hai bên xác nhận**. FX provider tự động không phải P0 đã chốt.

## 5.2. Phương án A — **Khuyến nghị**

**DEC-04.A1 — Event correction thay vì sửa tiền gốc.** Refund, chargeback, fee adjustment hoặc corrected settlement sau Confirmed tạo một bản ghi tham chiếu gốc, có actor, reason, amount/currency, thời điểm, chứng từ trong quyền và approval/version phù hợp. Bản Confirmed gốc giữ nguyên để truy vết; dashboard hiện **current balance** và lịch sử `Original → Adjustment/Refund → Settlement/Correction` rõ ràng.

**DEC-04.A2 — Refund sau khi nợ đã được settle.** Refund làm phát sinh chênh nghĩa vụ mới (có thể hoàn ngược lại người vừa nhận tiền), nhưng **chỉ trở thành confirmed adjustment/debt sau khi người bị ảnh hưởng chấp thuận theo chính sách M07**. Nếu không đồng ý, đánh dấu Pending/Disputed, không tự đảo chiều confirmed settlement trước đó.

**DEC-04.A3 — Settlement khác currency.** Form phải cho hai người xem và xác nhận tối thiểu: outstanding currency/amount; currency và amount **thực trả**; currency và amount **thực nhận**; tỷ giá sử dụng hoặc phương pháp quy đổi; ngày hiệu lực, người xác nhận và phần dư/rounding. Nếu chưa đủ hai bên đồng thuận hoặc missing rate, vẫn Pending, không tự áp tỷ giá thị trường ngầm. Chênh tỷ giá/fees thể hiện rõ, không xóa outstanding khác đồng tiền bằng phép cộng số học sai.

**DEC-04.A4 — Partial settlement.** Từng lần hoàn trả theo currency được ghi nhận riêng, cộng dồn vào phần đã Confirmed; outstanding còn lại là lượng nghĩa vụ được đối soát sau các lần hợp lệ, **không** dựa trên lần Sender tự đánh dấu. Rounding theo minor unit từng currency và remainder phải có quy tắc xác định/được thấy trước xác nhận.

**DEC-04.A5 — Kỳ báo cáo.** Khoản tiền gốc giữ ở kỳ phát sinh ban đầu; Refund/Adjustment có ngày phát sinh riêng và liên kết về giao dịch nguồn. Báo cáo cho phép đọc `original`, `period adjustments`, `current net` minh bạch; không thay số báo cáo đã công bố bằng cách ghi đè lịch sử.

## 5.3. Phương án B

- **B1 — Tự ghi đè Expense/Settlement gốc:** dễ hiển thị một con số nhưng phá audit và consent; không khuyến nghị.
- **B2 — Tự đảo chiều Settlement ngay khi refund:** gây nợ không được duyệt; không khuyến nghị.
- **B3 — Tự lấy FX từ máy hoặc nguồn ngoài để Confirmed:** sai quy tắc đồng thuận đã chốt; không hợp lệ.

## 5.4. Nội dung trình PO

**Phê duyệt DEC-04.A1–A5**: ledger điều chỉnh append-only về mặt lịch sử nghiệp vụ, refund tạo nghĩa vụ có approval, partial/cross-currency settlement có xác nhận và rounding rõ, báo cáo tách ngày nguồn và ngày điều chỉnh. Cơ chế hạch toán kỹ thuật, FX provider, loại số học là bước thiết kế sau; không ấn định ở đây.

## 5.5. Acceptance tests

- T1: Refund sau Settlement không sửa dòng Expense/Settlement cũ.
- T2: Refund gây nghĩa vụ hoàn ngược: trước khi bên chịu nghĩa vụ xác nhận, outstanding Confirmed không bị cập nhật lén.
- T3: B trả VND cho khoản JPY, B xác nhận chuyển nhưng A chưa xác nhận thực nhận → Pending.
- T4: Multi-payment không duplicate và không double count; rounding không làm mất minor units.
- T5: Báo cáo mỗi kỳ và current net giải thích được từ các bản ghi nguồn.

**Ảnh hưởng:** M07/M10 và consumers M03/M04/M06; **trạng thái:** `PENDING_PO_APPROVAL`.

---

# 6. DEC-05 — M03/M04 liên kết M05 Event; Cancel/Unlink/Restore; Series/Occurrence

**Truy vết:** CR-013 / CR-014.  
**Nguồn:** M03 §12.4; M04 D17/OPEN-M04-04; M05 §9.2, §12.1–12.4, OPEN-M05-14; M09 OI-M09-07.

## 6.1. Đã chốt

- M05 là **Calendar Event source**, còn M03 Date Plan/M04 Activity giữ business status, không sinh Event shadow trong module nguồn.
- Link theo source module/type/id và purpose; retry không tạo Event trùng cùng purpose; hai Event khác purpose có thể cùng Trip.
- Recurring edit/delete phải chọn `This occurrence`, `This and following` hoặc `Entire series`; không ngầm Entire series.
- Cancel Plan/Trip không tự xóa Place, Booking, Visit, Expense, Comment hoặc những thành phần ở module khác.

## 6.2. Phương án A — **Khuyến nghị**

**DEC-05.A1 — Cancel Date Plan/Activity có linked Event.** UI yêu cầu người có quyền chọn rõ:

1. `Cancel source only; keep Event and unlink`: giữ Event là lịch độc lập, bỏ link, cảnh báo Event sẽ còn trên Calendar (được khuyến nghị làm **lựa chọn mặc định hiển thị**, nhưng không tự thực thi trước xác nhận).
2. `Cancel source and request Cancel Event`: thực hiện từng hành động có quyền, báo trạng thái của cả hai; lỗi một bên không được báo cả hai đã thành công.
3. `Keep source; Cancel Event only` nếu nghiệp vụ và quyền của actor cho phép.

Không tự delete Event hoặc Booking khi chỉ Cancel source. Nếu Event Private/khác owner, actor không được ép thay đổi Event không có quyền; lúc đó chỉ Unlink/mark unavailable ở source.

**DEC-05.A2 — Reschedule.** Khi linked, sửa giờ từ M03/M04 hay M05 đều thông qua Event M05; khi source lưu và Event update chưa thành công, hiển thị `Pending Sync/Conflict` rõ. Không silent `last write wins`. M03/M04 giữ business state, không tự đánh dấu Visit/Trip completed.

**DEC-05.A3 — Recurrence identity.** Mọi link vào chuỗi lịch phải ghi *scope intent*: toàn series hoặc một occurrence có định danh ổn định; sửa `This and following` giữ history của trước ranh giới; comments/RSVP/Linked Activity gắn occurrence không tự dịch sang ngày khác. Nếu split làm thay đổi identity tham chiếu, hệ thống phải ghi mapping/audit, phát cảnh báo và không tự chuyển comments vào buổi khác.

**DEC-05.A4 — Restore/Re-link.** Restore Source/Event hoặc link lại không tự sinh Event mới nếu link/purpose cũ còn hợp lệ; khi một phía đã purge/revoke, phải hiện unavailable và yêu cầu actor đủ quyền chọn re-link. Khôi phục không tự khôi phục grant đã bị thu hồi và không phát lại reminder cũ.

**DEC-05.A5 — Quyền và Secret.** Event Shared không tiết lộ Place/Booking/Document/Expense Private của source; event title/description/notification phải có safe projection dựa trên quyền mỗi người.

## 6.3. Phương án B

- **B — Cancel source mặc định xóa Event:** giảm số click nhưng làm mất lịch ngoài dự kiến, nguy cơ cascade và sai owner; không khuyến nghị.
- **C — Auto áp Entire series khi xóa một occurrence:** trái BRD M05; không hợp lệ.

## 6.4. Nội dung trình PO

**Phê duyệt DEC-05.A1–A5**, đặc biệt A1 chọn mặc định hiển thị `Cancel source only + keep Event/unlink` và mọi thao tác đa miền phải được người dùng xác nhận phạm vi; stable recurrence link không đổi history/comments âm thầm.

## 6.5. Acceptance tests

- T1: Cancel M03 Date Plan, Event giữ lại + Unlink nếu được chọn; Place/Visit/Expense vẫn nguyên.
- T2: Người dùng chọn Cancel cả hai nhưng thiếu quyền Event → chỉ source thay đổi được phép, kết quả cảnh báo rõ.
- T3: Sửa 1 occurrence không làm thay chuỗi hay comment khác.
- T4: This/following split giữ RSVP/comments lịch sử và link source phù hợp.
- T5: Restore retry 5 lần không sinh 5 Event trùng.

**Ảnh hưởng:** M03/M04/M05/M09/M10; **trạng thái:** `PENDING_PO_APPROVAL`.

---

# 7. DEC-06 — Ngày không biết năm, recurrence thiếu lần, Event chỉ Start

**Truy vết:** CR-015.  
**Nguồn:** M05 §8.1/§8.3/§9.1–9.2, OPEN-M05-07/08/09; M08 §4.3, OPEN-M08-14; M07 §5.6.

## 7.1. Đã chốt

- Anniversary theo ngày gốc, có tính Days Together; Feb-29 dùng Feb-28 mặc định/Mar-01 tùy chọn.
- `Monthly by date` với day 31 clamp ngày cuối tháng. DST nonexistent time phải được xử lý có cảnh báo; date-only không bị timezone shift.
- V1.0 không được tự bịa năm sinh, thời lượng Event hoặc ngày `unlock_at`.

## 7.2. Phương án A — **Khuyến nghị**

**DEC-06.A1 — Date precision.** Đặc tả bốn nghĩa nghiệp vụ khác nhau: `date-only`, `local timed + timezone`, `exact instant`, `month/day without origin year`. Không convert date-only theo device timezone để đổi ngày; với M08 Sealed, exact instant giữ nguyên sau Seal.

**DEC-06.A2 — Birthday không biết năm.** Cho lưu **lời nhắc/lịch lặp hằng năm theo tháng/ngày không có thuộc tính năm sinh** (nếu cần gắn loại Birthday), nhưng không gán tuổi hoặc `Days Together`/anniversary year count và **không giả tạo ngày gốc**. Nếu người dùng muốn Anniversary có counter phụ thuộc năm, phải có ngày gốc thật. Đây là bổ sung hành vi phân loại cần duyệt; không mở rộng thành hồ sơ thông tin ngày sinh đầy đủ.

**DEC-06.A3 — Monthly nth weekday không xuất hiện trong tháng.** Bỏ qua tháng đó; rule gốc vẫn giữ nguyên, preview ít nhất các lần đủ điều kiện kế tiếp và ghi chú “Không có lần xảy ra trong kỳ này”. Không tự dời sang tuần thứ tư/cuối tháng. Cho người dùng chọn rule khác nếu thích.

**DEC-06.A4 — Timed Event chỉ có Start.** Trong V1.0 với loại Event yêu cầu time range để xét conflict/reminder, **yêu cầu người dùng chọn End hợp lệ**. Không tự gán End bằng duration mặc định giả. Nếu có use case riêng chỉ cần một thời điểm (reminder/alarm), phải được mô tả là loại hành động/thời điểm khác, không dùng Event duration ảo.

**DEC-06.A5 — Date/time safety.** Mọi UI nhập timed schedule phải ghi timezone rõ. Giờ địa phương rơi vào DST gap thì không nhận lén; yêu cầu chọn giờ hợp lệ. DST fold có hai instant phải xác định rõ; khi M05 Anniversary đổi rule, M08 Sealed timestamp vẫn không thay.

## 7.3. Phương án B và đánh đổi

- **B1 — Cấm Birthday chỉ tháng/ngày:** phạm vi đơn giản hơn, nhưng không hỗ trợ nhu cầu lưu birthday khi không biết năm; giữ là một lựa chọn PO có thể chọn nếu tránh bổ sung UI.
- **B2 — Nth weekday thiếu lần thì lùi về tuần cuối tháng:** đủ lần xuất hiện hàng tháng hơn, nhưng thay ngày người dùng đã mô tả; chỉ hợp lệ nếu user chọn/PO duyệt rõ.
- **B3 — Auto End = Start + 1h:** thao tác nhanh nhưng tạo dữ liệu giả và mâu thuẫn với Open Issue; không khuyến nghị.

## 7.4. Nội dung trình PO

**Phê duyệt DEC-06.A1–A5:** birthday không biết năm là reminder/annual occurrence không có year-of-birth hoặc counters phụ thuộc year; nth weekday không tồn tại thì skip kỳ; Event timed cần End tường minh khi dùng chức năng time range. Các rule Feb-29/day31 đã chốt được giữ nguyên.

## 7.5. Acceptance tests

- T1: 29/02 Anniversary trong năm không nhuận chạy đúng Feb-28/Mar-01 đã chọn.
- T2: Monthly 31 quay lại ngày 31 khi tháng có 31, không bị rewrite thành 28.
- T3: Fifth Monday không có trong tháng → không tạo occurrence giả.
- T4: Birthday thiếu năm → không tính tuổi/elapsed-year, không xuất một năm sinh giả.
- T5: Timed Event thiếu End → UI yêu cầu nhập End, không âm thầm gán một giờ.
- T6: DST gap/fold và timezone change không sửa timestamp Capsule Sealed.

**Ảnh hưởng:** M05/M08/M07/M10; **trạng thái:** `PENDING_PO_APPROVAL`.

---

# 8. DEC-07 — Notification classes, Quiet Hours, nhóm trùng và cảnh báo hết hạn

**Truy vết:** CR-020 (không mở lại CR-019 vì đã làm rõ ownership).  
**Nguồn:** M05 reminder/OPEN-M05-05/06; M08 §5; M09 §11; M10 D26–D29, §12.1–12.5, OPEN-M10-09.

## 8.1. Đã chốt

- Chỉ có **một Notification Center thuộc M10**; M01–M09 cung cấp các loại thông báo.
- Quiet Hours thuộc preferences mỗi người, không dời action nghiệp vụ gốc, không đổi M08 Delivery/Opened, M07 Approval hoặc M05 RSVP.
- Notification preview phải kiểm quyền nguồn hiện tại; Secret chưa reveal không được hiển thị qua preview, badge, deep-link.
- Notification retries phải chống trùng; M10 không tự đặt nền tảng push/email thành P0 nếu các BRD chỉ yêu cầu in-app.

## 8.2. Phương án A — **Khuyến nghị**

**DEC-07.A1 — Các lớp ưu tiên hành vi.**

| Nhóm | Ví dụ | Trong Quiet Hours | Preview / bảo mật |
|---|---|---|---|
| Security / account action | Pairing confirmation, password/security event, export/delete status | In-app status ghi nhận ngay; cảnh báo bảo mật phù hợp **không bị gộp như reaction**. Kênh đẩy ngoài app chỉ nếu đã được cho phép | Không có token/code/Secret; tránh tiết lộ riêng tư qua thiết bị khóa |
| Time-sensitive personal | M05 reminder sắp đến, M07 approval due | Ghi nhận đúng sự kiện; phương thức *chủ động làm phiền* theo cài đặt riêng của người nhận, không sửa Event/Expense | Tối thiểu theo quyền và mục đích; khi stale phải hạ hiệu lực |
| M08 scheduled/secret | Love Letter Delivered, Capsule Eligible, Surprise | Domain action theo guard độc lập; notification có thể trì hoãn/gộp nếu chính sách kênh cho phép | Trước Reveal không có preview nội dung mật; không auto mark Opened |
| Normal collaboration | M01/M03/M04/M06 updates, M09 Mention/Comment | Quiet Hours giữ trong inbox và không chủ động làm phiền; có thể gộp | Safe title/counters theo source ACL |
| Low priority activity | Reactions, upload/media status | Gộp khi thích hợp, ưu tiên inbox yên tĩnh | Không tiết lộ media Private hoặc tên object thiếu quyền |

**DEC-07.A2 — Quiet Hours ưu tiên trên hành vi thông báo, không trên domain state.** Thông báo vẫn có record hợp lệ và read/unread state; thời điểm quiet chỉ điều chỉnh hình thức hiển thị/chủ động làm phiền theo preferences. Không phát “bão” các reminder đã quá hạn vào cuối Quiet Hours.

**DEC-07.A3 — Quy tắc gộp/dedupe.** Hai notification có **cùng một sự kiện nghiệp vụ** (same source + recipient + event identity/revision) chỉ tạo một thông báo logic dù retry. Reaction/comment khác sự kiện có thể gộp theo **cùng target, cùng recipient, cùng category**, nhưng không gộp các Approval/Settlement/Security alerts độc lập thành một mục mất khả năng hành động. Chưa ấn định số phút ở cấp product nếu không cần để xác định hành vi; ngưỡng coalescing cụ thể là UX/notification contract phải trình duyệt trước triển khai, không tự bịa là quyết định đã có.

**DEC-07.A4 — Stale/cancel/revoke.** Ngay trước khi trình bày thông báo hay mở deep-link, reauthorize source. Nếu Event đã hủy/đã qua thời điểm hữu ích, cập nhật sang `Outdated/No longer actionable` hoặc ẩn theo chính sách retention, không hiển thị như lời nhắc mới. Nếu quyền nguồn bị thu hồi, không giữ preview private cũ; notification read không làm thay đổi source open/approval state.

**DEC-07.A5 — Cài đặt từng user.** Có cấu hình Quiet Hours/timezone/category policy trên mỗi tài khoản. Cùng một M08 notification có thể hiện khác nhau giữa A và B dựa trên quyền, thời điểm mở riêng, preference riêng. Không làm lộ partner Private activity vì một người bật tổng hợp.

## 8.3. Phương án B và điểm còn phải xác định ở thiết kế UX

- **B — Tất cả thông báo gửi/làm phiền ngay, không phân nhóm:** dễ lập trình nhưng phá Quiet Hours, gây spam và rủi ro tiết lộ.
- **C — Đẩy lùi cả nghiệp vụ khi Quiet Hours:** tráo notification với delivery/approval state; trái BRD, không hợp lệ.
- **Thông số chưa được chọn bởi Docket:** số phút reaction coalescing, ngưỡng stale của từng reminder, sự hiện diện của push/email, quy tắc thiết bị bị khóa. Những con số/kênh này có thể ảnh hưởng trải nghiệm, phải đưa ra bảng lựa chọn nhỏ trong UX contract trước triển khai, **không mặc định do developer đặt**.

## 8.4. Nội dung trình PO

**Phê duyệt DEC-07.A1–A5** về lớp thông báo, nguyên tắc Quiet Hours, bảo vệ preview, idempotency/dedupe identity và stale behavior; giao các ngưỡng định lượng chưa thể chốt lúc này sang UX contract có bước duyệt rõ, không ngầm coi toàn bộ DEC-07 hoàn thành phần số đo.

## 8.5. Acceptance tests

- T1: M08 Letter Delivered vào Quiet Hours vẫn Delivered nhưng notification không tự mark `Opened`.
- T2: Nhận lại cùng event 5 lần không sinh 5 notification logic.
- T3: B mất quyền một Shared Page trong khi mention queued → không thấy tên/nội dung Page.
- T4: Event đã Cancel, reminder pending/late không hiển thị như “sắp xảy ra”.
- T5: Security alert không mang secret token, không bị gộp mất dấu vết.
- T6: Quiet Hours của A không làm đổi cài đặt của B hoặc thời điểm unlock Capsule.

**Ảnh hưởng:** M05/M07/M08/M09/M10 (+ mọi module phát thông báo); **trạng thái:** `PENDING_PO_APPROVAL`.

---

# 9. Ma trận tác động và điều kiện chuyển giao

## 9.1. Tác động theo phân hệ

| Module | DEC phải tham chiếu | Ảnh hưởng đặc biệt |
|---|---|---|
| M01 Photobook/Diary | 01, 03, 07 | Publication, source rights, coauthor export, comment previews |
| M02 Media Library | 01, 07 | Shared copy, original rights, purge, thumbnail |
| M03 Food/Places | 05, 07 | Date Plan cancellation; Event links |
| M04 Travel/Trip Planner | 03, 05, 07 | Shared Trip export; Activity ↔ Event |
| M05 Couple Calendar | 02, 05, 06, 07 | Source Event time, recurrence/timezone, reminders |
| M06 Bucket List/Goals | 03, 07 | Shared goal freeze/export, progress notification |
| M07 Budget/Savings | 03, 04, 07 | Confirmed liabilities, refunds, FX, overdue reminders |
| M08 Special Moments | 01, 02, 06, 07 | Seal, Reveal, Deleted/Cancelled, recipient state |
| M09 Couple Interaction | 01, 02, 05, 07 | M09 access gates, stable occurrence comments |
| M10 Accounts/Settings | 01, 02, 03, 05, 06, 07 | Global rights, lifecycle, export, notification ownership |

## 9.2. Thứ tự ra quyết định và đặc tả

1. **DEC-01, DEC-02, DEC-03 trước:** bảo mật/dữ liệu/Disconnect/Sealed/financial obligation; mọi nhánh policy được ghi phê duyệt trước kỹ thuật.
2. **DEC-04 kế tiếp:** tiền, refund/FX/settlement correctness trước khi lập M07 domain contract.
3. **DEC-05 và DEC-06:** Calendar link, recurrence, timezone/precision semantics.
4. **DEC-07:** notification rules và những hạn mức UX còn mở; không để notification điều khiển domain state.
5. Với quyết định đã duyệt, biên soạn phụ lục `POL-DEC-xx` và cập nhật CR `POLICY_APPROVED/CONTRACT_TO_SPECIFY`, không báo QA Passed.
6. Rồi thực hiện **CT-01–CT-08** trong Review Final và **Master P0 Acceptance Matrix** theo từng AC gốc + desktop/mobile + negative/E2E tests.
7. Chỉ tiếp theo mới đến đánh giá tech stack, architecture, schema/API, implementation và restore drill.

## 9.3. Không có automatic approval

Không được suy ra `APPROVED` từ một trong các hành vi: tải file, nói “tiếp tục”, lưu vào `Reviews`, đồng ý review tổng quan, chấp nhận phương án khuyến nghị về kỹ thuật, hoặc im lặng. Việc phê duyệt phải nêu rõ **DEC-ID và lựa chọn/chỉnh sửa**.

---

# 10. Phiếu phê duyệt gộp dành cho Product Owner

Mục đích là **một lượt duyệt**, không phải bảy cuộc hỏi đáp riêng. Có thể duyệt cả bộ A sau khi đọc tài liệu, hoặc sửa những mã bất kỳ.

| Decision ID | Phương án khuyến nghị | Kết quả PO | Ghi chú/ngoại lệ |
|---|---|---|---|
| DEC-01 | A1–A5 | **PENDING** | — |
| DEC-02 | A1–A5 | **PENDING** | — |
| DEC-03 | A1–A5 | **PENDING** | — |
| DEC-04 | A1–A5 | **PENDING** | — |
| DEC-05 | A1–A5 | **PENDING** | — |
| DEC-06 | A1–A5 | **PENDING** | — |
| DEC-07 | A1–A5 (ngưỡng UX sẽ duyệt sau) | **PENDING** | — |

**Ví dụ cú pháp phê duyệt một lần (chỉ là ví dụ, KHÔNG phải trạng thái hiện tại):**

> Tôi phê duyệt phương án A của DEC-01 đến DEC-07 theo Policy Decision Docket V1.0, ngoại trừ các sửa đổi sau: [ghi rõ nếu có]. Giữ nguyên 247 Dxx, không thay đổi BRD V1.0 gốc. Với thông số UX/retention còn mở, yêu cầu trình lại trước khi triển khai.

Nếu PO gửi câu trên và không nêu ngoại lệ, cập nhật approval log cho 7 mã dựa trên lời xác nhận thực tế; những ngưỡng UX hoặc retention **chưa được quyết định** vẫn mở đúng chỗ trong contract. Nếu có ngoại lệ, phản ánh chính xác và lập version phụ lục sau khi phê duyệt, không tự chỉnh một quyết định Dxx đã khóa.

## 10.1. Dữ liệu bắt buộc trong Approval Log (chưa điền)

| Trường | Giá trị hiện tại |
|---|---|
| Docket version | V1.0 |
| Quyết định được đề nghị | DEC-01…DEC-07 / A |
| PO phê duyệt | **CHƯA CÓ** |
| Văn bản đồng ý | **CHƯA CÓ** |
| Thời điểm phê duyệt | **CHƯA CÓ** |
| Hiệu lực | **CHƯA CÓ** |
| Dxx gốc thay đổi | **KHÔNG ĐỀ XUẤT** |
| QA/Implementation | **CHƯA BẮT ĐẦU** |

---

# 11. Bằng chứng chính và source locator

Dòng tính theo file Markdown đã giải nén của bộ bàn giao. Locator chỉ giúp truy dấu; cần đọc nguyên section và các mục `Dxx/AC/OPEN` khi soạn amendment.

| DEC | Nguồn có hiệu lực / bằng chứng quan trọng |
|---|---|
| DEC-01 | `M01` L261–290 (Published, invariants), L853–862 (Private embedded); `M02` L451–459 (3 lựa chọn share), L949–956 (media reference, Trash, Purge); `M08` L237–260 (Seal/Cancel/Delete), L1363/1369 (OPEN); `M10` L1612–1618, L1913 |
| DEC-02 | `M08` L226–269 (Letter/Surprise/Capsule states), L1371; `M09` L132–141 (Interaction targets); `M10` L1635–1672 (Frozen/D35 và hai chiều Reveal), L1915 |
| DEC-03 | `M07` L264–281 (Expense/Settlement), L289–301 (balance); `M10` L1598–1601 (export), L1635–1659 (Disconnect), L1914 |
| DEC-04 | `M07` L264–317 (Finance states/balances/FX), L1562–1565 (Open cross-currency/dispute) |
| DEC-05 | `M05` L517–525 (recurrence scope), L616–657 (linked Event semantics), L1455 (OPEN); `M09` OI-M09-07 |
| DEC-06 | `M05` L478–515 (Anniversary, Feb29, day31, nth weekday), L1448–1450 (OPEN); `M08` L212–214 (Seal time) |
| DEC-07 | `M10` L1570–1594 (Notification Center/Quiet Hours/Preview/retry); `M05` L1446–1447 (OPEN); `M09` §11 |

Các tên viết gọn `M01`…`M10` tương ứng chính xác với các tệp `Docs/OUR_SPACE_Mxx_*_BRD_V1.0.md` có trong bộ Handoff. Không sử dụng nguồn bên ngoài để sửa requirement đã chốt.

---

# 12. Kết luận và bàn giao

- **7/7 DEC có đề xuất A đầy đủ**, phương án đối chiếu, ảnh hưởng, test và phiếu phê duyệt gộp. **0/7 đã được Product Owner phê duyệt trong tài liệu này.**
- **247/247 Dxx không thay đổi.** Không sửa BRD M01–M10, không tự chọn tech stack, không viết code.
- Sau khi PO phê duyệt: tạo approved-policy supplement có audit/version; chốt CT-01–CT-08 và Master P0 Matrix. Các thông số vận hành/UX còn mở được lưu với người chịu trách nhiệm và gate riêng, **không coi im lặng là mặc định**.
- Không phát hành V1.0 khi thiếu bất kỳ P0 nào của M01–M10, thiếu mobile/desktop parity, thiếu Trash/Export/Backup/Restore hay chưa qua các test an toàn của M08/M07.

**END OF POLICY DECISION DOCKET V1.0 — PENDING PRODUCT OWNER APPROVAL.**
