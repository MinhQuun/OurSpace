---
document_id: OURSPACE-APPROVED-POLICY-SUPPLEMENT
project: Our Space
version: 1.0
approval_date: 2026-10-23
approval_timezone: Asia/Ho_Chi_Minh
status: APPROVED_PRODUCT_POLICY
approval_scope: DEC-01..DEC-07; OPTION_A; A1..A5; NO_EXCEPTIONS_DECLARED
supersedes: NONE
base_docket: OUR_SPACE_POLICY_DECISION_DOCKET_V1.0.md
base_docket_sha256: d01da207d80a926f91c43a616e2183325b553d87ebd18c67ee6ce28a3b428b41
base_review: OUR_SPACE_CROSS_BRD_CONSISTENCY_REVIEW_FINAL_V1.0.md
base_review_sha256: d2cf9ed84d359938ccd837e29ed05d75050efb30ad6a55d8c02a93456cb26a12
source_brd_status: 10/10 V1.0 APPROVED; 247/247 Dxx LOCKED
implementation_status: NOT_STARTED
---

# OUR SPACE — APPROVED POLICY SUPPLEMENT V1.0

**Loại:** Phụ lục chính sách nghiệp vụ đã được Product Owner phê duyệt  
**Ngày phê duyệt:** 23/10/2026 (theo ngày phiên làm việc, múi giờ Asia/Ho_Chi_Minh; không khẳng định giờ/phút cụ thể)  
**Trạng thái:** `APPROVED_PRODUCT_POLICY`  
**Nguồn phê duyệt:** Xác nhận trực tiếp của Product Owner trong cuộc trò chuyện:  
> Tôi phê duyệt phương án A cho DEC-01 đến DEC-07 theo Policy Decision Docket V1.0.

**Phạm vi:** Toàn bộ nhánh A, gồm **A1–A5 của từng DEC-01 đến DEC-07**, không có ngoại lệ được nêu trong lời phê duyệt. Không diễn giải thành phê duyệt phương án B/C hoặc các thông số Docket chủ động để ngỏ.

> **Tính chính thức:** Văn bản này ghi lại chính sách mới được chấp thuận bởi Product Owner. Không ghi đè nội dung lịch sử của Docket V1.0 (vốn có trạng thái pending tại thời điểm soạn), Review Final V1.0 hoặc 10 BRD V1.0. Khi có bất đồng giữa phụ lục và Dxx, phải lập Change Request và trình duyệt; không tự sửa Dxx.

## 1. Biên bản phê duyệt và nguồn chuẩn

| Thuộc tính | Ghi nhận |
|---|---|
| Đối tượng duyệt | DEC-01–DEC-07, phương án A (A1–A5 mỗi DEC) |
| Hình thức | Lời xác nhận trực tiếp của Product Owner trong cuộc trò chuyện này |
| Ngày | 2026-10-23 |
| Ngoại lệ/chỉnh sửa kèm phê duyệt | Không được nêu |
| Docket nền | `OUR_SPACE_POLICY_DECISION_DOCKET_V1.0.md` |
| SHA-256 Docket | `d01da207d80a926f91c43a616e2183325b553d87ebd18c67ee6ce28a3b428b41` |
| Cross-BRD Review nền | `OUR_SPACE_CROSS_BRD_CONSISTENCY_REVIEW_FINAL_V1.0.md` |
| SHA-256 Review | `d2cf9ed84d359938ccd837e29ed05d75050efb30ad6a55d8c02a93456cb26a12` |
| 10 BRD và 247 Dxx | **Giữ nguyên**, không thay Dxx |
| Code/Tech stack/Architecture | **Chưa bắt đầu** |

**Quy tắc ưu tiên giải thích:** 10 BRD approved là baseline đã khóa; bản Supplement được duyệt bổ sung đúng các khoảng trống mà Docket V1.0 trình ra. Nếu khi chi tiết hóa phát hiện trái Dxx đã khóa, không mặc định lấy Supplement ghi đè: cần Change Request có truy vết và PO duyệt.

## 2. Approval Register — kết quả chính thức

| Decision | Phương án PO duyệt | Trạng thái | CR được mở khóa chính sách |
|---|---|---|---|
| DEC-01 | A1–A5 | `APPROVED_AS_PROPOSED` | CR-002, CR-003, CR-021 |
| DEC-02 | A1–A5 | `APPROVED_AS_PROPOSED` | CR-004, CR-018 |
| DEC-03 | A1–A5 | `APPROVED_AS_PROPOSED` | CR-005, CR-006 |
| DEC-04 | A1–A5 | `APPROVED_AS_PROPOSED` | CR-008, CR-009 |
| DEC-05 | A1–A5 | `APPROVED_AS_PROPOSED` | CR-013, CR-014 |
| DEC-06 | A1–A5 | `APPROVED_AS_PROPOSED` | CR-015 |
| DEC-07 | A1–A5 | `APPROVED_AS_PROPOSED` | CR-020 |

**7/7 DEC:** `APPROVED_AS_PROPOSED`. **13/13 CR thuộc nhóm lựa chọn chính sách:** đổi từ `POLICY_PENDING` sang `POLICY_APPROVED__CONTRACT_TO_SPECIFY` trong bảng theo dõi cập nhật; **không đổi** thành `RESOLVED` hay `QA_PASSED`.

## 3. Nội dung chính sách được duyệt — sao chép nguyên văn phương án A

Nội dung của mỗi DEC bên dưới được trích **nguyên văn** từ đoạn `Phương án A` của Docket V1.0; tiêu đề trạng thái và chú giải nguồn là phần quản trị tài liệu bổ sung. Đây là nội dung có hiệu lực cho thiết kế nghiệp vụ tiếp theo.

## DEC-01 — Published/Sealed Snapshot và quyền xóa Media

**Trạng thái:** `APPROVED_AS_PROPOSED` · **Áp dụng:** M01, M02, M08, M10; M09 liên quan · **CR liên quan:** CR-002, CR-003, CR-021.

**Đối chiếu:** Docket V1.0 §2.3; nội dung phương án A bên dưới được sao chép nguyên văn từ bản đề xuất đã được phê duyệt.

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

**Định danh bất biến của đoạn duyệt (SHA-256, UTF-8):** `86f7a9a2d2d0da50f5f47f4b13d9923cc53f9185e36f933d9ca6b96e36fa0180`

---

## DEC-02 — Unrevealed khi Disconnect, Reconnect và M09 Interaction

**Trạng thái:** `APPROVED_AS_PROPOSED` · **Áp dụng:** M08, M09, M10; M05 liên quan · **CR liên quan:** CR-004, CR-018.

**Đối chiếu:** Docket V1.0 §3.2; nội dung phương án A bên dưới được sao chép nguyên văn từ bản đề xuất đã được phê duyệt.

**DEC-02.A1 — Sau cửa sổ 30 ngày.** Khi Space chuyển Closed/Archived, phần unrevealed vẫn ở trạng thái *không được phép trao/mở* nếu chưa có căn cứ quyền mới. Hệ thống không tự gửi dồn hay coi hết 30 ngày là hạn Reveal. Dữ liệu còn lưu hay được xóa phải tuân theo DEC-01 và lifecycle/retention được phê duyệt, **không phải lưu vô hạn**.

**DEC-02.A2 — Reconnect.** Kết nối lại không hồi sinh grants cũ, không phát thư/capsule theo queue cũ. Mỗi nội dung chờ khôi phục cần một hành động xác nhận mới hợp lệ theo loại: đối với nội dung đơn tác giả, chủ sở hữu có quyền quyết định tiếp tục gửi nhưng quyền nhận/xem của recipient vẫn phải hợp lệ; đối với Collaborative Capsule, cần đủ xác nhận của những người có quyền trong chính phiên bản đã Seal. Không chỉnh snapshot hay ngày Seal để “gửi lại”. Nếu không thể bảo đảm đủ consent, vẫn Paused.

**DEC-02.A3 — Eligibility trong lúc Paused.** `now ≥ original_unlock_at` có thể đúng nhưng Reveal vẫn Denied khi paused; khi đủ phép mới cho người nhận mở **không trước** timestamp đã Seal. Notification đến muộn không làm thay đổi thời điểm Eligible và không tự ghi Opened.

**DEC-02.A4 — M09 Interaction Gate.** Người nhận chưa thực sự `Opened` không thấy comment/reaction/mention/count chứa metadata của nội dung bên trong Capsule; quyền comment/react trên *nội dung đã mở* chỉ cấp cho người đã Opened và còn source permission. Nếu A Opened mà B chưa, A có thể tương tác theo quyền của A, nhưng B không nhận preview/feed/notification có khả năng tiết lộ cho tới khi B được phép mở. Đối với Delivered Letter hoặc Revealed Surprise, dùng delivery/reveal + recipient permission đúng đối tượng, không thay bằng notification read state.

**DEC-02.A5 — Tranh chấp, hủy, lỗi gửi.** Actor được phép yêu cầu hủy/thu hồi trước Reveal theo quy trình M08; khi tranh chấp, trạng thái và quyền được nêu rõ cho từng recipient, không đơn phương đọc Secret của partner. Retry của scheduled job phải idempotent, không gửi trùng khi kết nối lại.

**Định danh bất biến của đoạn duyệt (SHA-256, UTF-8):** `8896a41fc832137ba7c4e1fb4f0b75bcad79f7a22198c570e46ec5c43122edda`

---

## DEC-03 — Công nợ còn tồn tại và Export sau Disconnect

**Trạng thái:** `APPROVED_AS_PROPOSED` · **Áp dụng:** M07, M10, M01, M04, M06 · **CR liên quan:** CR-005, CR-006.

**Đối chiếu:** Docket V1.0 §4.2; nội dung phương án A bên dưới được sao chép nguyên văn từ bản đề xuất đã được phê duyệt.

**DEC-03.A1 — Allowlist hậu Disconnect, không tạo nghĩa vụ mới.** Trong cửa sổ 30 ngày, chỉ cho thao tác đối soát trên nghĩa vụ đã Confirmed **trước lúc Frozen**, với kiểm quyền riêng và audit: xem lịch sử/khoản outstanding, đề xuất thanh toán, xác nhận đã nhận, cung cấp bằng chứng cho khoản cũ (theo quyền), yêu cầu đối chiếu/chỉnh sai đã có căn cứ, và export hợp lệ. Chặn create shared Expense, new Split obligation, new Savings commitment và new shared collaboration.

**DEC-03.A2 — Hai bên không còn hợp tác.** Không ép một người Confirmed khi người ấy offline hoặc phản đối; khoản chưa có xác nhận vẫn Pending/Disputed, không tự trừ nợ. Tạo hành vi `Proposed → Confirmed/Rejected/Disputed` cho nghiệp vụ hậu kỳ nhưng không sửa dòng gốc. Mọi Correction/Refund phát sinh từ lịch sử phải đi theo DEC-04 và quy trình quyền M07.

**DEC-03.A3 — Sau cửa sổ 30 ngày.** Giữ lối **đọc/xuất theo quyền hiện hành** đối với chứng cứ lịch sử và, nếu còn nghĩa vụ Confirmed chưa đối soát, cho một lối xử lý **giới hạn đúng khoản nợ cũ** (không mở lại Space/cộng tác mới). Đây là *đề xuất mới cần PO phê duyệt*; không mặc nhiên áp dụng nếu luật/quy định lưu giữ buộc phải xử lý khác. Nếu tài khoản đã Delete theo yêu cầu hợp lệ hoặc hết quyền, hành động không có quyền phải từ chối rõ.

**DEC-03.A4 — Shared works export.** Với Book/Trip/Goal đồng sáng tạo, mỗi người được xuất các phần họ có quyền `Export` tại **thời điểm tạo và giao tệp xuất**, bao gồm nội dung Shared hợp lệ; không được dùng quyền đồng tạo để xuất toàn bộ asset/Diary/receipt Private của partner. File có tham chiếu bị thu hồi cần redaction an toàn và lời giải thích trung tính; không lấy lại asset quyền đã hết chỉ vì lúc sáng tác từng thấy.

**DEC-03.A5 — Offline và tranh chấp.** Nếu partner offline, yêu cầu được lưu ở Pending/Disputed, không tự xác nhận và không tự xóa quyền truy vết. Quyền export cá nhân không phụ thuộc partner online nếu dữ liệu exportable và actor được phép; export phần đồng sở hữu đang tranh chấp phải thu hẹp đúng quyền thay vì dùng full-dump.

**Định danh bất biến của đoạn duyệt (SHA-256, UTF-8):** `1ee486a76298a84874254e5e48407386aa374f4aedf33c00b015f85d131053fd`

---

## DEC-04 — Refund/Adjustment, Partial Settlement và đa ngoại tệ

**Trạng thái:** `APPROVED_AS_PROPOSED` · **Áp dụng:** M07, M10; M03/M04/M06 là consumer · **CR liên quan:** CR-008, CR-009.

**Đối chiếu:** Docket V1.0 §5.2; nội dung phương án A bên dưới được sao chép nguyên văn từ bản đề xuất đã được phê duyệt.

**DEC-04.A1 — Event correction thay vì sửa tiền gốc.** Refund, chargeback, fee adjustment hoặc corrected settlement sau Confirmed tạo một bản ghi tham chiếu gốc, có actor, reason, amount/currency, thời điểm, chứng từ trong quyền và approval/version phù hợp. Bản Confirmed gốc giữ nguyên để truy vết; dashboard hiện **current balance** và lịch sử `Original → Adjustment/Refund → Settlement/Correction` rõ ràng.

**DEC-04.A2 — Refund sau khi nợ đã được settle.** Refund làm phát sinh chênh nghĩa vụ mới (có thể hoàn ngược lại người vừa nhận tiền), nhưng **chỉ trở thành confirmed adjustment/debt sau khi người bị ảnh hưởng chấp thuận theo chính sách M07**. Nếu không đồng ý, đánh dấu Pending/Disputed, không tự đảo chiều confirmed settlement trước đó.

**DEC-04.A3 — Settlement khác currency.** Form phải cho hai người xem và xác nhận tối thiểu: outstanding currency/amount; currency và amount **thực trả**; currency và amount **thực nhận**; tỷ giá sử dụng hoặc phương pháp quy đổi; ngày hiệu lực, người xác nhận và phần dư/rounding. Nếu chưa đủ hai bên đồng thuận hoặc missing rate, vẫn Pending, không tự áp tỷ giá thị trường ngầm. Chênh tỷ giá/fees thể hiện rõ, không xóa outstanding khác đồng tiền bằng phép cộng số học sai.

**DEC-04.A4 — Partial settlement.** Từng lần hoàn trả theo currency được ghi nhận riêng, cộng dồn vào phần đã Confirmed; outstanding còn lại là lượng nghĩa vụ được đối soát sau các lần hợp lệ, **không** dựa trên lần Sender tự đánh dấu. Rounding theo minor unit từng currency và remainder phải có quy tắc xác định/được thấy trước xác nhận.

**DEC-04.A5 — Kỳ báo cáo.** Khoản tiền gốc giữ ở kỳ phát sinh ban đầu; Refund/Adjustment có ngày phát sinh riêng và liên kết về giao dịch nguồn. Báo cáo cho phép đọc `original`, `period adjustments`, `current net` minh bạch; không thay số báo cáo đã công bố bằng cách ghi đè lịch sử.

**Định danh bất biến của đoạn duyệt (SHA-256, UTF-8):** `28d0b906b47407a6337398a686f98d4759737557714dccc220348c71090970e3`

---

## DEC-05 — M03/M04 và M05 Event, Cancel, Unlink, Recurrence

**Trạng thái:** `APPROVED_AS_PROPOSED` · **Áp dụng:** M03, M04, M05, M09, M10 · **CR liên quan:** CR-013, CR-014.

**Đối chiếu:** Docket V1.0 §6.2; nội dung phương án A bên dưới được sao chép nguyên văn từ bản đề xuất đã được phê duyệt.

**DEC-05.A1 — Cancel Date Plan/Activity có linked Event.** UI yêu cầu người có quyền chọn rõ:

1. `Cancel source only; keep Event and unlink`: giữ Event là lịch độc lập, bỏ link, cảnh báo Event sẽ còn trên Calendar (được khuyến nghị làm **lựa chọn mặc định hiển thị**, nhưng không tự thực thi trước xác nhận).
2. `Cancel source and request Cancel Event`: thực hiện từng hành động có quyền, báo trạng thái của cả hai; lỗi một bên không được báo cả hai đã thành công.
3. `Keep source; Cancel Event only` nếu nghiệp vụ và quyền của actor cho phép.

Không tự delete Event hoặc Booking khi chỉ Cancel source. Nếu Event Private/khác owner, actor không được ép thay đổi Event không có quyền; lúc đó chỉ Unlink/mark unavailable ở source.

**DEC-05.A2 — Reschedule.** Khi linked, sửa giờ từ M03/M04 hay M05 đều thông qua Event M05; khi source lưu và Event update chưa thành công, hiển thị `Pending Sync/Conflict` rõ. Không silent `last write wins`. M03/M04 giữ business state, không tự đánh dấu Visit/Trip completed.

**DEC-05.A3 — Recurrence identity.** Mọi link vào chuỗi lịch phải ghi *scope intent*: toàn series hoặc một occurrence có định danh ổn định; sửa `This and following` giữ history của trước ranh giới; comments/RSVP/Linked Activity gắn occurrence không tự dịch sang ngày khác. Nếu split làm thay đổi identity tham chiếu, hệ thống phải ghi mapping/audit, phát cảnh báo và không tự chuyển comments vào buổi khác.

**DEC-05.A4 — Restore/Re-link.** Restore Source/Event hoặc link lại không tự sinh Event mới nếu link/purpose cũ còn hợp lệ; khi một phía đã purge/revoke, phải hiện unavailable và yêu cầu actor đủ quyền chọn re-link. Khôi phục không tự khôi phục grant đã bị thu hồi và không phát lại reminder cũ.

**DEC-05.A5 — Quyền và Secret.** Event Shared không tiết lộ Place/Booking/Document/Expense Private của source; event title/description/notification phải có safe projection dựa trên quyền mỗi người.

**Định danh bất biến của đoạn duyệt (SHA-256, UTF-8):** `ad5e59751daa2a2a568c43e74dae2f5cfaf9f6d62e24ec18090d30eca3a4d67f`

---

## DEC-06 — Date precision, birthday thiếu năm và recurrence đặc biệt

**Trạng thái:** `APPROVED_AS_PROPOSED` · **Áp dụng:** M05, M08, M07, M10 · **CR liên quan:** CR-015.

**Đối chiếu:** Docket V1.0 §7.2; nội dung phương án A bên dưới được sao chép nguyên văn từ bản đề xuất đã được phê duyệt.

**DEC-06.A1 — Date precision.** Đặc tả bốn nghĩa nghiệp vụ khác nhau: `date-only`, `local timed + timezone`, `exact instant`, `month/day without origin year`. Không convert date-only theo device timezone để đổi ngày; với M08 Sealed, exact instant giữ nguyên sau Seal.

**DEC-06.A2 — Birthday không biết năm.** Cho lưu **lời nhắc/lịch lặp hằng năm theo tháng/ngày không có thuộc tính năm sinh** (nếu cần gắn loại Birthday), nhưng không gán tuổi hoặc `Days Together`/anniversary year count và **không giả tạo ngày gốc**. Nếu người dùng muốn Anniversary có counter phụ thuộc năm, phải có ngày gốc thật. Đây là bổ sung hành vi phân loại cần duyệt; không mở rộng thành hồ sơ thông tin ngày sinh đầy đủ.

**DEC-06.A3 — Monthly nth weekday không xuất hiện trong tháng.** Bỏ qua tháng đó; rule gốc vẫn giữ nguyên, preview ít nhất các lần đủ điều kiện kế tiếp và ghi chú “Không có lần xảy ra trong kỳ này”. Không tự dời sang tuần thứ tư/cuối tháng. Cho người dùng chọn rule khác nếu thích.

**DEC-06.A4 — Timed Event chỉ có Start.** Trong V1.0 với loại Event yêu cầu time range để xét conflict/reminder, **yêu cầu người dùng chọn End hợp lệ**. Không tự gán End bằng duration mặc định giả. Nếu có use case riêng chỉ cần một thời điểm (reminder/alarm), phải được mô tả là loại hành động/thời điểm khác, không dùng Event duration ảo.

**DEC-06.A5 — Date/time safety.** Mọi UI nhập timed schedule phải ghi timezone rõ. Giờ địa phương rơi vào DST gap thì không nhận lén; yêu cầu chọn giờ hợp lệ. DST fold có hai instant phải xác định rõ; khi M05 Anniversary đổi rule, M08 Sealed timestamp vẫn không thay.

**Định danh bất biến của đoạn duyệt (SHA-256, UTF-8):** `9630fabeb9d5a69134fb4610d3192cf6d5ab6031d672a26efade7ecc24afceac`

---

## DEC-07 — Notification, Quiet Hours, dedup và stale

**Trạng thái:** `APPROVED_AS_PROPOSED` · **Áp dụng:** M10 sở hữu Notification Center; M01–M09 phát loại thông báo · **CR liên quan:** CR-020.

**Đối chiếu:** Docket V1.0 §8.2; nội dung phương án A bên dưới được sao chép nguyên văn từ bản đề xuất đã được phê duyệt.

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

**Định danh bất biến của đoạn duyệt (SHA-256, UTF-8):** `62121fb593031db92371e76d8f0d5c001c20dbb2e251d22d168da31ffaf6844b`

## 4. Phạm vi chưa được tự động phê duyệt — Open Controls

**Đã duyệt nguyên tắc, chưa chốt mọi tham số triển khai.** Các điểm sau phải được chốt trong hợp đồng/UX/vận hành có trách nhiệm rõ, theo giới hạn đã ghi trong phương án A; không được mặc định là PO vừa duyệt một con số hay kênh cụ thể:

| OPEN ID | Chủ đề còn định lượng/chốt triển khai | Ranh giới đã duyệt | Gate tiếp theo |
|---|---|---|---|
| OP-01 | Thời hạn áp dụng và ngoại lệ pháp lý đối với full deletion, derivative, backup purge | DEC-01.A4 không đặt thời hạn lưu mới; bảo đảm xử lý đúng quyền và chứng cứ | CT-07 và Privacy/Retention Operations Review |
| OP-02 | Chi tiết vai trò/căn cứ xác nhận hủy Capsule đồng sở hữu khi một bên không phản hồi | DEC-01.A5 không sửa Seal, không xóa cả tác phẩm một cách đơn phương | CT-05 + CT-07; review trường hợp tranh chấp |
| OP-03 | Bộ quyền và quy trình đọc/xuất/hậu kỳ nợ cũ sau Closed/Delete | DEC-03.A3 chỉ mở lối xử lý hạn chế Confirmed outstanding, không mở cộng tác hoặc tự xác nhận | CT-04 + CT-07 |
| OP-04 | Quy ước làm tròn/minor units, độ chính xác FX và cách thể hiện remainder | DEC-04.A3–A4 đòi công khai trước xác nhận; không tự định FX provider | CT-04 và financial acceptance tests |
| OP-05 | Contract `Series/Occurrence` qua split/re-link, định danh và cập nhật Pending Sync | DEC-05.A1–A5 đã khóa hành vi, chưa chọn cấu trúc dữ liệu/API | CT-02 + CT-03 |
| OP-06 | UX cụ thể cho trường hợp DST fold/gap; nhắc birthday chỉ tháng/ngày | DEC-06.A1–A5 cấm time/date giả | CT-03, UX test |
| OP-07 | Thời lượng gộp reactions/mentions, stale thresholds, kênh push/email, quy tắc lock screen | DEC-07.A3 chưa chốt ngưỡng phút; không thêm push/email vào P0 | CT-06 + UX Decision Log (trình PO trước triển khai) |

**Quy tắc phê duyệt bổ sung:** Những thông số thực sự làm thay đổi trải nghiệm hoặc quyền lưu trữ cần được trình phê duyệt riêng; thông số triển khai kỹ thuật thuần túy được quy định trong contract và kiểm thử nhưng không được vượt ngoài A đã duyệt.

## 5. CR Register sau phê duyệt

13 CR đã được mở khóa chính sách, vẫn phải có contract và test:  
- **DEC-01:** CR-002, CR-003, CR-021 → `POLICY_APPROVED__CONTRACT_TO_SPECIFY`
- **DEC-02:** CR-004, CR-018 → `POLICY_APPROVED__CONTRACT_TO_SPECIFY`
- **DEC-03:** CR-005, CR-006 → `POLICY_APPROVED__CONTRACT_TO_SPECIFY`
- **DEC-04:** CR-008, CR-009 → `POLICY_APPROVED__CONTRACT_TO_SPECIFY`
- **DEC-05:** CR-013, CR-014 → `POLICY_APPROVED__CONTRACT_TO_SPECIFY`
- **DEC-06:** CR-015 → `POLICY_APPROVED__CONTRACT_TO_SPECIFY`
- **DEC-07:** CR-020 → `POLICY_APPROVED__CONTRACT_TO_SPECIFY`

9 CR trước đó đã có chính sách đủ, cần contract/QA (giữ nguyên trạng thái `CONTRACT_TO_SPECIFY`):  
**CR-001, CR-007, CR-010, CR-011, CR-012, CR-017, CR-022, CR-023, CR-024**.

2 CR đã thống nhất cách diễn giải (giữ `INTERPRETATION_RESOLVED`): **CR-016, CR-019**.

**Tổng:** 13 + 9 + 2 = **24**. **Không kết luận có CR nào đã qua kiểm thử** chỉ vì một policy được phê duyệt.

## 6. Các bất biến tiếp tục có hiệu lực

1. V1.0 chỉ hoàn tất khi P0 của cả 10 module đều có và đạt acceptance trên mobile **và** desktop.
2. Private mặc định; kiểm quyền theo object/field/linked resource, cả search, thumbnail, counts, export, PDF và notification.
3. M05 sở hữu Calendar Event; M07 sở hữu Expense, Budget, Savings và các nghiệp vụ xác nhận tài chính; M08 sở hữu Time Capsule/Sealed; M10 sở hữu Identity/Space/Permission/Notification Center; M09 là lớp Comments/Reactions, không phải chat độc lập.
4. Không cascade-delete dữ liệu giữa các phân hệ. Trash thông thường 30 ngày; Export, Backup, Restore và phân quyền restore tiếp tục là yêu cầu nền.
5. M01 có Simple và Advanced Editor với realtime co-edit hai người; Publication bất biến theo điều khoản đã duyệt.
6. M08 không Reveal trước `unlock_at`, không thay đổi Seal/recipient/snapshot đã Seal; M10 D35 pause nội dung chưa Reveal khi Disconnect và không auto unpause/Reconnect.
7. Không tự xác nhận nghĩa vụ tài chính, không tự áp tỷ giá chưa được xác nhận, không hồi sinh permission đã revoke.

## 7. Handoff để chuyển sang nghiệp vụ tích hợp và QA

Theo báo cáo Cross-BRD Final §6, bước kế tiếp là hoàn thiện **8 hợp đồng nghiệp vụ CT-01–CT-08**:

| ID | Contract cần đặc tả | Nhận chính sách từ |
|---|---|---|
| CT-01 | Object/Field/Linked-resource Permission & Safe Projection | DEC-01, DEC-02, DEC-03, DEC-05, DEC-07 + BRD Dxx |
| CT-02 | Reference, Identity, Ownership & Idempotency | DEC-01, DEC-04, DEC-05 + Dxx |
| CT-03 | State & Time Dictionary | DEC-02, DEC-04, DEC-05, DEC-06 |
| CT-04 | Financial Ledger, Approval & Reports | DEC-03, DEC-04 |
| CT-05 | Sealed, Delivery, Reveal, Interaction & Disconnect | DEC-01, DEC-02, DEC-03, DEC-06 |
| CT-06 | Shared Notifications | DEC-02, DEC-05, DEC-06, DEC-07 |
| CT-07 | Delete, Trash, Restore, Backup & Export | DEC-01, DEC-02, DEC-03, DEC-05 |
| CT-08 | M01 Realtime Co-edit & Publish | DEC-01, DEC-03 + M01 Dxx |

Tiếp theo, xây **Master P0 Acceptance Matrix** truy vết từng Dxx/BRD AC cho M01–M10; mỗi testcase phải có cột `desktop` và `mobile` và negative/security/E2E tests. Không kết luận `Release Ready` khi chưa có triển khai và kết quả nghiệm thu. **Chưa chọn tech stack, chưa thiết kế kiến trúc, chưa code.**

## 8. Quản lý version và thay đổi

- Docket V1.0 giữ nguyên là **bản đề xuất lịch sử**, kể cả nơi có chữ `PENDING`.
- Cross-BRD Final V1.0 giữ nguyên là **bản kết quả rà soát tại thời điểm soạn**.
- Supplement V1.0 này là **bản ghi phê duyệt chính thức** dựa trên xác nhận ngày 23/10/2026.
- Mọi thay đổi về sau đối với A1–A5 cần số CR/DEC amendment mới, truy vết nguồn và PO phê duyệt trước khi có hiệu lực.
- Chỉ tạo BRD V1.1/V2.0 khi có quyết định quản trị tài liệu riêng; **không viết đè 10 BRD V1.0**.

**END OF APPROVED POLICY SUPPLEMENT V1.0**
