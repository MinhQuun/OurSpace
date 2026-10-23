---
document_id: OURSPACE-OP-CLOSURE-PROPOSAL
version: 1.0
date: 2026-10-23
status: PROPOSAL_FOR_REVIEW__NOT_APPROVED
project: Our Space
baseline: 10 BRD V1.0; 247 Dxx approved; DEC-01..DEC-07 option A approved
scope: OP-01..OP-07; CT-01..CT-08; Master P0 Acceptance Matrix
change_to_original_brd: NONE
tech_stack_selected: NO
code_written: NO
---

# OUR SPACE — OP-01–OP-07 CLOSURE PROPOSAL V1.0

**Loại tài liệu:** Hồ sơ xử lý *Open Controls* trước kiến trúc. Đây là **phương án đề xuất, chưa phải phụ lục chính sách đã duyệt**, không thay đổi bất cứ BRD V1.0 hoặc Dxx nào. Các quy tắc DEC-01–DEC-07/A1–A5 trong `OUR_SPACE_APPROVED_POLICY_SUPPLEMENT_V1.0.md` **đã được duyệt**, không đưa ra biểu quyết lại.

**Nguồn ưu tiên:** (1) 10 BRD M01–M10 V1.0; (2) Approved Policy Supplement V1.0; (3) Cross-Module Contracts CT-01–CT-08 (draft); (4) Pre-Architecture Readiness Review V1.0. Tài liệu này không phải nguồn thay thế BRD. Trường hợp thấy bất đồng với nguồn (1)–(2) phải lập Change Request, không áp dụng suy diễn của bản đề xuất.

## 0. Kết luận điều hành

- **07/07 OP được phân tích và có phương án/tiêu chí đóng.** Không có nghĩa 07/07 đã được phê duyệt hoặc vận hành.
- **OP-01–OP-04: policy/financial gate**: cần xác nhận của Product Owner và, tùy vấn đề, người rà soát privacy/legal/operations hoặc financial business rule trước khi đóng.
- **OP-05–OP-07: contract/UX gate**: có thể chốt nguyên tắc thiết kế và test oracle phù hợp với DEC đã duyệt; mọi ngưỡng hoặc hành vi product mới vẫn cần PO phê duyệt.
- **Chưa thể tuyên bố `READY_TO_FREEZE_ARCHITECTURE`:** OP còn open, CT và Master P0 còn draft; 60 Dxx thiếu mapping AC trực tiếp, 187 mapping cần semantic validation, 763 AC chưa được phân lớp P0 chính thức.
- **Có thể chuẩn bị tiêu chí so sánh kiến trúc ở mức trung lập công nghệ**, không chọn tech stack/code trong tài liệu này.

### 0.1. Bảng đăng ký quyết định

| OP | Đề xuất | Điều gì cần phê duyệt/chốt | Gate | Trạng thái |
|---|---|---|---|---|
| OP-01 | A: Data-deletion ledger theo scope và nguyên tắc backup-safe restore | Căn cứ pháp lý áp dụng; retention/purge SLA cụ thể; ngoại lệ audit/backups sau xác minh | Hard | `PROPOSED; NUMERIC_RETENTION_OPEN` |
| OP-02 | A: Dual-consent cho Cancel toàn bộ sealed collaborative capsule, với quy trình tranh chấp riêng | Ai được tạm giữ delivery trong tranh chấp, khi nào và ai được giải quyết | Hard | `PROPOSED; DISPUTE_AUTHORITY_OPEN` |
| OP-03 | A: Hậu Closed chỉ giải quyết confirmed old outstanding theo quyền xác thực hiện hành | Cơ chế đủ điều kiện và phạm vi hành động sau Closed/Delete | Hard | `PROPOSED; AUTHORITY_OPEN` |
| OP-04 | A: Minor-unit exactness và largest-remainder allocation, FX có snapshot đồng thuận | Thứ tự tie-break, negative correction, rate precision và hiển thị phép tính | Hard | `PROPOSED; MONEY_ORACLE_OPEN` |
| OP-05 | A: Series/occurrence stable identity, transition intent và safe relink | UX branch/failure/conflict và mapping contract được review | Soft/Medium | `PROPOSED; CONTRACT_VALIDATION_OPEN` |
| OP-06 | A: Explicit timezone/DST resolution, month/day không gán năm | Xử lý 29/2 không năm và UI fold; kiểm thử timezone | Soft/Medium | `PROPOSED; UX_VALIDATION_OPEN` |
| OP-07 | A: In-app P0 privacy-first, grouping chỉ reaction/mention, stale by business event | Group window, preview, stale policy và channel scope | Soft/Medium | `PROPOSED; UX_PARAMETER_OPEN` |

> **Cách hiểu nhãn:** “Hard/Soft” thể hiện điều kiện **đóng quy tắc thiết kế tương ứng**, không phủ định khả năng tiếp tục nghiên cứu kiến trúc có điều kiện.

---

## 1. OP-01 — Full deletion, originals/derivatives và backup retention

**Nguồn:** M01 D13, M02 D13/D19, M07 OPEN-M07-07, M08 Sealed lifecycle, M10 §13/§14 + OPEN-M10-04/05, **DEC-01.A1–A5**. **CT liên quan:** CT-01, CT-07, CT-08. **Tác động:** quyền riêng tư, điều kiện xóa hợp lệ, Restore, immutable publication/capsule. **Severity:** Critical.

### 1.1. Ranh giới đã khóa

1. Trash **ít nhất 30 ngày** cho các dữ liệu áp dụng; **không** lấy 30 ngày làm cam kết rằng mọi bản backup đã bị purge ở ngày thứ 30.
2. Dữ liệu Published/Sealed có thể giữ *cấu trúc lịch sử* mà không giữ mãi quyền phục vụ content bytes trái quyền. Việc xóa original, bản sao đã chia sẻ hợp lệ, derivatives, exported copy và backup phải đánh giá **phạm vi từng đối tượng**.
3. Không được xóa dây chuyền Book/Capsule/Expense hay dữ liệu thuộc quyền hợp lệ của người còn lại. Không mặc nhiên giữ bytes vô hạn với lý do “immutable”.
4. Khôi phục từ backup phải áp lại các tombstone, revoke và deletion authorization đã có; không hồi sinh Private content, quyền đã thu hồi hay sealed content bị xử lý xóa hợp lệ.

### 1.2. Phương án A khuyến nghị (phần mới, CHƯA PHÊ DUYỆT)

- **OP01-A1 — Deletion case register:** mọi yêu cầu full deletion có case ID, requester, scope cụ thể (`original`, `variant`, `shared copy`, `embedded snapshot`, `search index/thumbnail`, `audit`, `backup`), grounds, reviewer, consent/ownership, decision và evidence. Trạng thái theo DEC-01.A4, không báo Completed khi mới Processing.
- **OP01-A2 — Domain-specific eligibility:** nhánh `Trash/Restore` độc lập với nhánh `Full deletion`. Khi yêu cầu xóa được chấp thuận, không trả nội dung thuộc scope xóa qua Reader/PDF/search/export/cache/notification, dù việc loại bỏ khỏi các bản backup chưa hoàn thành.
- **OP01-A3 — Backup control:** phải có chính sách xoay vòng/purge hoặc biện pháp thay thế đã kiểm chứng; khôi phục phải chạy deletion/revocation reconciliation trước khi cho người dùng truy cập. Không để backup trở thành đường hồi sinh đã xóa.
- **OP01-A4 — Retention matrix:** lập bảng theo class (`original`, `shared copy`, `published derivative`, `sealed derivative`, `financial confirmed history`, `security audit`, `trash`, `backup`, `deletion proof`): retention trigger, căn cứ, owner, tối thiểu/tối đa, ngoại lệ, deadline, xử lý khi hết hạn và khả năng kiểm chứng. Chỉ **Trash baseline ≥30 ngày** đã có số ngày được duyệt.
- **OP01-A5 — Notice/privacy:** người dùng được biết tình trạng xử lý (`requested`, `processing`, `completed/partially completed/rejected`), loại dữ liệu còn phải giữ và lý do ở mức có quyền xem, không rò rỉ nội dung của partner.

**Chưa được điền:** quốc gia/căn cứ pháp lý, retention tối đa của backup, chính sách retention audit tài chính, thời hạn full-deletion processing, các ngoại lệ được phép, xử lý backup vật lý, RPO/RTO; không dùng con số giả.

### 1.3. Lựa chọn đối chiếu / không nên áp dụng

- B — “Sau 30 ngày xóa ngay mọi thứ, kể cả shared work/financial audit”: có nguy cơ cascade, mất quyền hợp lệ và làm sai M07.
- C — “Giữ mọi derivative và backup vĩnh viễn”: trái nguyên tắc quyền xóa và DEC-01.
- D — “Đã xóa ở live thì không cần đối soát Restore”: có nguy cơ phục hồi dữ liệu bị xóa.

### 1.4. Tình huống và test oracle

- **OP01-T01:** A full-delete original, B có Book Shared Published → Book vẫn có version/history, bản xem mới không thể tải bytes phải xóa; placeholder không lộ tên file hay requester.
- **OP01-T02:** A xóa original nhưng có copy Shared độc lập → từng copy được đánh giá theo quyền và scope, không auto xóa hoặc auto giữ vô hạn.
- **OP01-T03:** Restore từ backup trước lúc revoke/purge → tombstone và quyền mới được áp lại trước khi phục vụ bất kỳ media bytes nào.
- **OP01-T04:** Deletion case đang `Processing` → UI không báo `Completed`.
- **OP01-T05:** Trash hết mốc giữ tối thiểu → chỉ xử lý purge khi eligibility đã được xác minh; không lấy TTL Trash làm luật giữ mọi dữ liệu.

**Điều kiện đóng:** (i) bảng retention theo từng class có nguồn pháp lý/operational review; (ii) xử lý multi-owner/derivative; (iii) backup restore safety được đặc tả; (iv) PO chấp thuận policy mới; (v) tạo test mapping CT-07 + P0. **Chưa đóng OP-01 ở V1.0.**

---

## 2. OP-02 — Hủy/Xóa Sealed Capsule đồng sở hữu khi offline hoặc tranh chấp

**Nguồn:** M08 UC-M08-20, AC-M08-64/81, M10 lifecycle, **DEC-01.A5, DEC-02.A2/A5**. **CT:** CT-05, CT-07. **Severity:** Critical.

### 2.1. Ranh giới đã khóa

- Capsule đã Seal không được thay snapshot/manifest/`original_unlock_at` hoặc mở sớm.
- Việc Cancel **toàn bộ** Capsule đồng sở hữu không được một người tự thực hiện trái quyền của người còn lại; trường hợp yêu cầu xóa dữ liệu cá nhân hợp lệ phải được xét **riêng scope**, không đồng nhất với quyền hủy cả tác phẩm chung.
- Disconnect/Reconnect không tự Reveal, không unpause, không thay consent trên capsule.

### 2.2. Phương án A khuyến nghị (CHƯA PHÊ DUYỆT)

- **OP02-A1 — Hai luồng riêng:** `CancelWholeCollaborativeCapsule` cần các chủ thể có quyền liên quan xác nhận; `RemoveMyPersonalContribution` đi vào OP-01 full-deletion review, không tự coi là hủy cả Capsule.
- **OP02-A2 — Quyền không phản hồi:** nếu partner offline/không phản hồi, không coi im lặng là đồng ý; request `PendingConsent` có audit. Không tự đặt deadline auto-approve.
- **OP02-A3 — Tranh chấp:** khi xuất hiện khiếu nại có căn cứ về quyền riêng tư hoặc yêu cầu xóa hợp lệ, cho trạng thái `UnderReview` với *serving/delivery hold có phạm vi* nếu việc tiếp tục cung cấp sẽ xâm phạm quyền. **Ai có thẩm quyền đặt/bỏ hold và căn cứ nào là câu hỏi chính sách cần phê duyệt**, không cho một người lợi dụng nút Cancel để khóa dữ liệu B vô hạn. Hold không sửa Seal hoặc `unlock_at`.
- **OP02-A4 — Nếu đến thời điểm Unlock khi chờ xác minh:** `eligible_by_time` có thể đúng, nhưng Reveal phải kiểm quyền, pause/hold chính thức và consent; không tự Reveal khi bị chặn hợp lệ. Khi không có hold có hiệu lực, vận hành theo DEC-02 đã duyệt; không tạo một quy tắc cấm mở mới cho mọi tranh chấp chưa xác minh.
- **OP02-A5 — Audit và thông báo:** request/status/decision cho từng actor theo quyền, không cho họ xem Secret nội dung của người kia hoặc tiết lộ bằng notification/counter.

### 2.3. Lựa chọn đối chiếu

- B — Một owner Cancel/Purge toàn bộ ngay: nhanh nhưng xâm phạm quyền người còn lại.
- C — Không bao giờ cho hold cho đến khi đủ hai người đồng ý: có thể không bảo vệ được yêu cầu xóa/riêng tư hợp lệ.
- D — Partner im lặng một thời gian thì tự chấp thuận: tạo consent giả, trái nguyên tắc.

### 2.4. Test oracle

- **OP02-T01:** A yêu cầu Cancel Whole, B offline → `PendingConsent`, không ghi Cancelled thành công.
- **OP02-T02:** A yêu cầu xóa đóng góp riêng có căn cứ → không xóa cả Capsule B; nguồn/derivative được đánh giá phạm vi.
- **OP02-T03:** Có hold hợp lệ và thời điểm `original_unlock_at` tới → không Reveal trong khi hold, nhưng Seal timestamp bất biến.
- **OP02-T04:** Hold được giải quyết, recipient tiếp tục theo authorization hiện hành; không replay scheduled message hoặc comment Secret.
- **OP02-T05:** Một người Reconnect nhưng B chưa tái xác nhận → không được tự mở Capsule đồng sở hữu đang Paused.

**Điều kiện đóng:** PO xác nhận **thẩm quyền và trigger của hold**, consent/cancel toàn Capsule, process giải quyết bất đồng và các trường hợp offline; CT-05/07 ghi cùng semantics; QA có cả case không hold và có hold. **Chưa đóng OP-02.**

---

## 3. OP-03 — Khoản nợ cũ sau 30 ngày Disconnect/Closed/Delete

**Nguồn:** M07 Expense/Settlement lifecycle §5/§8, M10 §14.2–14.5, **DEC-03.A1–A5**. **CT:** CT-01, CT-04, CT-07. **Severity:** Critical.

### 3.1. Ranh giới đã khóa

- Trong cửa sổ 30 ngày, chỉ cho xử lý **nghĩa vụ Confirmed trước Frozen**; không tạo shared Expense, Split, Savings commitment mới.
- Sau 30 ngày, theo DEC-03.A3 **đã được phê duyệt bằng lời chọn phương án A**, có thể có lối giới hạn để đọc/xuất dữ liệu có quyền và hoàn tất nợ cũ đã Confirmed, không tái mở Space hay grants cũ. Câu “cần PO phê duyệt” nằm trong *nguyên văn đề xuất tiền phê duyệt*; **phê duyệt bao trùm A1–A5 ngày 23/10/2026 đã thực hiện**, không yêu cầu phê duyệt lại chính A3.
- Sender đánh dấu đã trả **không đủ** tạo confirmed settlement; receiver phải xác nhận hợp lệ. Delete Account không phải quyền truy cập vô hạn.

### 3.2. Phương án A khuyến nghị (chi tiết mới CHƯA PHÊ DUYỆT)

- **OP03-A1 — Eligibility:** chỉ các `confirmed_obligation_id` có trạng thái Confirmed trước `frozen_at` và còn `outstanding > 0` sau các settlement đã Confirmed; không tạo expense/debt mới. Refund/Correction phải theo DEC-04 approval.
- **OP03-A2 — Actor/auth:** mỗi bên đăng nhập bằng tài khoản đang hợp lệ; có bước kiểm tra lại danh tính tương xứng cho hành động xác nhận thanh toán hoặc export nhạy cảm. Không cấp login cho tài khoản đã Delete; không tự hồi sinh identity, Space membership hoặc quyền đã revoke.
- **OP03-A3 — Allowlist hậu Closed:** `ViewMyAuthorizedHistoricalLedger`, `ExportAuthorizedHistory`, `ProposeOldDebtSettlement`, `Confirm/Reject/DisputeSpecificSettlement`, `AttachEvidenceWithPermission`, `RequestCorrectionOfOldConfirmedRecord`. Các thao tác khác từ chối, kể cả `CreateNewExpense`, `CreateNewSplit`, `EditOldConfirmedAmountInPlace`, `ReadPartnerPrivateReceipt`.
- **OP03-A4 — Consent ledger:** `Proposal → Confirmed/Rejected/Disputed` có actor, time, old obligation reference; correction/refund thành event riêng, không sửa confirmed transaction nguồn.
- **OP03-A5 — Account deletion:** nếu một bên đã xóa tài khoản hợp lệ, không giả lập confirmation từ tài khoản đó; người còn lại chỉ xem/xuất những phần vẫn có căn cứ quyền. Cách xử lý khoản nợ chưa tất toán khi một bên không còn account hoạt động cần quy trình ngoại lệ riêng, không được tự ghi `Settled` hay giữ dữ liệu Private vô hạn.

### 3.3. Lựa chọn đối chiếu

- B — Hết 30 ngày đóng tất cả khoản Confirmed còn nợ → mất khả năng giải quyết nghĩa vụ cũ, không phù hợp A3 đã duyệt.
- C — Reopen Space để settle → mở lại chức năng Shared không được phép.
- D — Tự xác nhận khi B offline/Delete → tạo thanh toán giả và rủi ro tài chính.

### 3.4. Test oracle

- **OP03-T01:** Expense Confirmed trước Frozen, còn outstanding sau Closed → actor đủ quyền được xem và đề xuất settlement theo đúng ID.
- **OP03-T02:** A đề xuất đã trả/B offline → vẫn Proposed/Pending, không giảm outstanding.
- **OP03-T03:** A tạo expense mới sau Closed → Denied; Old-debt lane không có hành vi create shared.
- **OP03-T04:** A và B tranh chấp refund cũ → Pending/Disputed, không overwrite lịch sử.
- **OP03-T05:** Xóa tài khoản B hợp lệ → A không được impersonate B để confirm và không xem receipt Private của B.

**Điều kiện đóng:** PO xác nhận ranh giới quyền/hậu Delete (không phải tái duyệt DEC-03.A3); owner tài chính xác nhận state transitions; CT-04/07 và AC bổ sung có test oracle đầy đủ. **Chưa đóng OP-03.**

---

## 4. OP-04 — Minor units, Split remainder, FX và partial settlement

**Nguồn:** M07 Dxx Split/Settlement, M07 OPEN-M07-02/05/12/13, **DEC-04.A1–A5**. **CT:** CT-04. **Severity:** Critical (sai 1 đơn vị tiền vẫn là sai ledger).

### 4.1. Ranh giới đã khóa

- Một khoản Expense có **nguyên tệ**; không cộng số VND, JPY, USD trực tiếp. Multi-payer, allocation và pending/confirmed phải phân biệt.
- Tiền và Split phải bảo toàn tổng theo minor unit; preview phần dư trước xác nhận. Tỷ giá/phương pháp quy đổi phải được **hai người xác nhận** cho settlement khác đồng tiền; không tự gọi FX market provider trong V1.0.
- Refund/correction sau Confirmed là event mới, không overwrite original; cần approval từ người bị ảnh hưởng trước khi tạo nợ điều chỉnh Confirmed.

### 4.2. Phương án A khuyến nghị (CHƯA PHÊ DUYỆT)

- **OP04-A1 — Amount exactness:** nhập/lưu/xuất từng amount theo `currency code + integer minor unit` về mặt **quy tắc nghiệp vụ**. Trong hợp đồng tính toán dùng lượng nhỏ nhất của từng currency; tuyệt đối không coi display string hoặc số floating point nhị phân là nguồn tiền chính thức. Cách lưu vật lý để giai đoạn thiết kế kỹ thuật quyết định.
- **OP04-A2 — Reconcile shares:** với Equal/Percentage/Weighted, tính raw share theo tỷ lệ xác nhận, lấy đơn vị nhỏ nhất không vượt số tính toán, rồi phân phối remainder theo **largest fractional remainder**; trường hợp bằng phần lẻ, dùng thứ tự participant cố định được hiển thị và snapshot tại thời điểm Confirmed. Fixed Amount cần tổng phần cấp đúng Expense amount hoặc báo lỗi; không âm thầm tự bù vào một bên.
- **OP04-A3 — Negative correction:** Refund/Adjustment là một event mới có dấu, provenance, amount/currency, approval; phần dư của correction phải tính/reconcile riêng theo rule snapshot, không sửa Split Confirmed gốc. Nếu adjustment ảnh hưởng nghĩa vụ, trạng thái Pending/Disputed cho tới khi được xác nhận.
- **OP04-A4 — FX settlement snapshot:** hai người phải nhìn thấy outstanding currency/amount, sent currency/amount, received currency/amount, rate hoặc method đã thống nhất, effective date, fees, remainder, confirmation actor. Không đủ dữ liệu/consent ⇒ Pending. Độ chính xác của *nhập tỷ giá* và cách trình bày còn cần rule business xác nhận; không tự đặt số decimal tùy tiện trong bản approved.
- **OP04-A5 — Preview & test oracle:** cả desktop/mobile cùng công thức, cùng participant tie-break snapshot, cùng round-trip export/import nếu có. Chấp nhận sai lệch bằng **0 minor unit** giữa Expense amount và tổng allocation đã Confirmed trong cùng currency.

### 4.3. Ví dụ có kết quả kiểm toán

1. **101.001 VND Equal hai người:** raw share mỗi người `50.500,5`; một người `50.501 VND`, người kia `50.500 VND`; ai nhận 1 VND dư theo tie-break snapshot đang trình duyệt. Tổng đúng `101.001 VND`.
2. **10,01 USD Equal hai người:** allocation `5,01 + 5,00 USD` theo tie-break snapshot; tổng đúng `10,01 USD`. Không mở rộng Our Space quá hai tài khoản.
3. **Nợ JPY, hoàn bằng VND:** nếu rate chưa được hai bên xác nhận, tuyệt đối không hạch toán nợ JPY đã thanh toán chỉ vì một bên nhập số VND; hiển thị Pending cùng cả hai amount và currency.
4. **Refund sau Settlement:** khoản gốc và settlement đã Confirmed còn history; refund/corrective obligation mới chỉ Confirmed sau approval, không tự đảo dấu giao dịch nguồn.

### 4.4. Lựa chọn khác

- B — Chia bằng round từng người độc lập mà không reconcile: có thể thừa/thiếu minor unit.
- C — Tự dùng live FX khi gửi xác nhận: hai người có thể xác nhận hai tỷ giá khác nhau; trái DEC-04.
- D — Ưu tiên payer tự động nhận remainder không hiển thị: khó giải trình khi payer/beneficiary khác nhau.

### 4.5. Test oracle

- **OP04-T01:** 101.001 VND Equal 50/50: tổng allocation đúng, residue và người nhận residue hiển thị trước Confirm.
- **OP04-T02:** Percentage 33/67 với amount lẻ: không có mất/nhân tiền.
- **OP04-T03:** Fixed shares thiếu/thừa so với Expense: không âm thầm Confirm sai tổng.
- **OP04-T04:** FX settlement thiếu rate/consent: Pending, outstanding chưa giảm.
- **OP04-T05:** Refund sau confirmed settlement: audit liên kết original; Pending adjustment không tạo confirmed debt mới.
- **OP04-T06:** Retry confirm và Restore: không nhân đôi settlement hoặc làm mất remainder snapshot.

**Điều kiện đóng:** PO/finance owner xác nhận tie-break/correction/FX presentation; CT-04 ghi rõ công thức bằng quy tắc nghiệp vụ có thể tính tay; các AC/negative tests được review. **Chưa đóng OP-04.**

---

## 5. OP-05 — Calendar Series/Occurrence identity, Pending Sync và Re-link

**Nguồn:** M03 Date Plan, M04 Activity, M05 recurrence & link, M09 occurrence target; **DEC-05.A1–A5**. **CT:** CT-02, CT-03. **Severity:** High.

### 5.1. Đã khóa

- **M05 sở hữu Calendar Event**; M03/M04 sở hữu Date Plan/Trip Activity. `Cancel source` không auto Delete Event. Phương án UI mặc định đã duyệt là **hiển thị** `Cancel source only; keep Event and unlink`, nhưng hành động luôn cần xác nhận.
- Link phải xác định toàn series hay occurrence. `This and following` không tự chuyển comments, RSVP, activity ở quá khứ sang occurrence khác.
- Pending Sync/Conflict phải hiển thị, không silent last-write-wins. Restore/relink không tạo Event trùng nếu còn link hợp lệ.

### 5.2. Phương án A khuyến nghị (không phải database/API)

- **OP05-A1 — Reference identity:** mọi liên kết có `source_type`, `source_id`, `event_id`, `scope_intent` (`series` hoặc `occurrence`), `occurrence_anchor`, `link_revision`, `status`; link revision dùng để phát hiện thao tác cũ. Đây là **contract field logic**, tên trường có thể đổi khi thiết kế.
- **OP05-A2 — Split:** khi sửa `this and following`, lịch sử occurrence trước split giữ nguyên identity; link vào occurrence cụ thể không tự bám sang một occurrence có ngày giống nhưng ID khác. Với occurrence bị huỷ, link còn dấu vết `Cancelled/Unavailable`, không copy comment.
- **OP05-A3 — Two-phase UI:** lưu source và cập nhật Event là hai kết quả độc lập có thể thất bại; UI phải trình bày `Source Saved; Event Pending Sync` hoặc `Event Updated; Source Conflict` đúng thực tế. Chỉ báo full success nếu cả hai đã xác nhận.
- **OP05-A4 — Re-link:** nếu target đã revoke/purge, không auto link Event mới; đòi quyền và xác nhận phạm vi. Retry có idempotency key logic, không tạo lịch trùng.
- **OP05-A5 — Notification:** event cancel/reschedule phải khiến notification cũ stale; không tự thay RSVP, không lộ Trip Expense/Booking Private.

### 5.3. Ví dụ kiểm thử

- **OP05-T01:** Series gồm 5 occurrence, chọn `this and following` từ occurrence thứ 3 → hai occurrence đầu giữ comment/RSVP cũ, ba occurrence sau có lineage/mapping; không dời comment từ thứ 2 sang thứ 3.
- **OP05-T02:** A cancel M03 Date Plan, B có quyền giữ Event → UI đề xuất keep/unlink (không tự thực thi); sau xác nhận Event còn nguyên trong M05.
- **OP05-T03:** Source update thành công nhưng Event update offline → `Pending Sync`, retry một lần không tạo Event thứ hai.
- **OP05-T04:** Restore source sau khi Event bị purge → báo thiếu tham chiếu và cho phép re-link theo quyền, không tự tạo event giả.

**Điều kiện đóng:** domain owners M03/M04/M05/M09 duyệt contract logic, bảng failure/state, UX acceptance; nếu tất cả trong biên DEC-05 thì **không cần mở lại Dxx/DEC**. **Chưa đóng OP-05.**

---

## 6. OP-06 — Timezone, DST fold/gap và Birthday thiếu năm

**Nguồn:** M05 Calendar/Anniversary, M08 Seal time, M10 locale/timezone, **DEC-06.A1–A5**. **CT:** CT-03, CT-05. **Severity:** High.

### 6.1. Đã khóa

- `date-only`, `local timed + timezone`, `exact instant`, `month/day without origin year` là 4 nghĩa khác nhau. Không đổi ngày date-only vì device timezone; M08 Sealed exact instant không sửa.
- Birthday chỉ biết tháng/ngày không tự tạo năm sinh hoặc tuổi. Monthly nth weekday không có trong tháng thì bỏ qua tháng đó. Timed Event cần time range phải có End hợp lệ. DST gap phải báo lỗi; fold phải phân biệt được hai instant.

### 6.2. Phương án A khuyến nghị (CHƯA PHÊ DUYỆT cho phần lựa chọn UX mới)

- **OP06-A1 — Date-only display:** giữ nguyên ngày mà người dùng nhập ở mọi thiết bị và timezone; không mô phỏng event midnight bằng instant để làm đổi ngày.
- **OP06-A2 — DST gap:** khi user chọn local time không tồn tại ở event timezone, từ chối lưu và đề nghị chọn giờ hợp lệ; không tự cộng một giờ.
- **OP06-A3 — DST fold:** khi local clock chỉ cùng `02:30` hai lần ở cùng timezone, UI hiển thị hai lựa chọn phân biệt (offset hoặc lần đầu/lần sau); lưu exact instant do user chọn. Khi người dùng đổi timezone của profile, không sửa instant Sealed của M08.
- **OP06-A4 — Yearless 29/2:** đề xuất mặc định **chỉ có occurrence đúng ngày 29/2 của năm nhuận**, những năm khác thông báo “không có occurrence năm nay”; nếu muốn nhắc 28/2 hoặc 1/3, cần hành vi tùy chọn do người dùng quyết định và PO chấp thuận, không mặc định giả ngày. Đây là **lựa chọn policy mới chưa được phê duyệt**, không có trong DEC-06.A2.
- **OP06-A5 — Preview:** recurrence editor hiển thị ít nhất một số occurrence kế tiếp đủ điều kiện, cùng timezone, case invalid và skip; không giả ngày sinh năm gốc.

### 6.3. Ví dụ cụ thể

- Event date-only `2026-01-01` phải giữ 01/01/2026 khi A ở Việt Nam còn B dùng device timezone khác.
- Với timezone `Europe/Berlin`, local `2026-03-29 02:30` không tồn tại (gap), phải yêu cầu sửa; `2026-10-25 02:30` có 2 lần (fold), user phải chọn một lần rõ.
- Birthday `29/02` không có năm sinh: trong năm không nhuận không được tự gán ngày 28/02 nếu chưa có quy tắc được duyệt.
- Monthly `5th Monday`: tháng không có lần thứ năm được skip, không dịch về thứ Hai cuối cùng.

### 6.4. Test oracle

- **OP06-T01:** Date-only không nhảy ngày theo device timezone.
- **OP06-T02:** DST gap báo không hợp lệ, không lưu lén.
- **OP06-T03:** DST fold bắt buộc chọn instant và giữ đúng sau reopen.
- **OP06-T04:** Yearless birthday không sinh year/age giả; 29/02 theo rule được duyệt.
- **OP06-T05:** Thay Anniversary rule không đổi `unlock_at` của Capsule đã Seal.

**Điều kiện đóng:** PO duyệt cách nhắc 29/02 yearless và UX fold; domain M05/M08 xác nhận fixtures; không thay đổi 4 time semantics đã duyệt. **Chưa đóng OP-06.**

---

## 7. OP-07 — Notification coalescing, stale action, preview và channel

**Nguồn:** M05/M08/M09 notification events, M10 §12, **DEC-07.A1–A5**. **CT:** CT-01, CT-06. **Severity:** High.

### 7.1. Đã khóa

- **Một** in-app Notification Center thuộc M10 là P0. M09 chỉ phát comment/reaction/mention-related events, không phải app chat.
- Quiet Hours không làm đổi thời điểm Event/Approval/Seal/Reveal; record notification và read state độc lập domain source. Mỗi user có preferences riêng.
- Event identity/revision chống retry trùng. Không gộp các approval/settlement/security action độc lập thành một hành động không thể phân biệt.
- Reauthorize trước preview/deep-link, không lộ Secret/Private qua count/preview hoặc push/lockscreen.
- Push/email **không tự thành P0** do OP-07; chỉ thêm bằng quyết định scope riêng.

### 7.2. Phương án A khuyến nghị (CHƯA PHÊ DUYỆT những tham số UX)

- **OP07-A1 — Category policy:** Security/account action và finance approval là item logic riêng; reaction/comment có thể gộp có kiểm soát theo `target + recipient + category` sau ACL filtering; không gộp khác target hoặc khác quyền.
- **OP07-A2 — Coalescing window:** đề xuất **15 phút** cho reaction/comment cùng nhóm, tính từ event đầu của nhóm và không kéo dài vô hạn; đây là **mốc UX đề xuất cần PO review**, không phải DEC-07 đã duyệt. Nếu không muốn cố định số phút trước usability test, đánh dấu parameter `TBD` và không tuyên bố `OP07 CLOSED`.
- **OP07-A3 — Stale semantics:** Event Cancelled ⇒ notification action `Outdated` ngay khi nguồn bị hủy; Event đã hoàn thành hoặc quá khung thời gian hữu ích ⇒ không đưa ra lời nhắc hành động cũ. Không chọn timeout phút cố định thay cho business state khi business state đủ phân loại.
- **OP07-A4 — Preview security:** in-app preview phải ACL-safe; khi thiết bị khóa hoặc kênh ngoài ứng dụng chưa có đảm bảo quyền, mặc định chỉ nội dung trung tính (“Bạn có thông báo mới”) hoặc không hiển thị theo cài đặt user; không chứa Secret, thumbnail Private, nội dung tranh chấp hay số tiền riêng tư.
- **OP07-A5 — Channel scope:** in-app P0; email phục vụ identity/security như đã yêu cầu trong M10 không đồng nghĩa notification email digest P0; push/social alerts ở outside P0 cho tới khi có phê duyệt scope độc lập.

### 7.3. Test oracle

- **OP07-T01:** 20 reactions đến cùng target/recipient trong 15 phút (nếu được duyệt) → grouping đúng, không mất item bảo mật/tài chính.
- **OP07-T02:** 2 Approval độc lập → 2 hành động xác nhận riêng, retry cùng event → 1 notification logic.
- **OP07-T03:** B mất quyền xem nguồn sau khi có notification → detail, preview, deep-link đều bị chặn/redacted.
- **OP07-T04:** Event bị cancel trong Quiet Hours → notification không được báo là reminder mới còn hiệu lực khi Quiet Hours kết thúc.
- **OP07-T05:** Capsule B chưa Opened → feed/count/lockscreen không được tiết lộ Secret; notification read không tự set Opened.

**Điều kiện đóng:** PO/UX chốt group window và privacy presentation, domain owners chốt stale semantics; không mở push/email P0. **Chưa đóng OP-07.**

---

## 8. Ma trận ảnh hưởng và thứ tự thực hiện

| OP | Domain chính | CT cần đồng bộ khi duyệt | P0/QA cần bổ sung | Phải sửa Dxx gốc? |
|---|---|---|---|---|
| OP-01 | M01, M02, M07, M08, M10 | CT-01, CT-07, CT-08 | Full deletion/backup/restore/export | Không đề xuất |
| OP-02 | M08, M10, M09 | CT-05, CT-07 | Dual consent/offline/hold/reveal | Không đề xuất |
| OP-03 | M07, M10, M01/M04/M06 export | CT-01, CT-04, CT-07 | Closed-state debt/confirmed settlements | Không đề xuất |
| OP-04 | M07 | CT-04 | Minor-unit reconciliation/FX/refund | Không đề xuất |
| OP-05 | M03, M04, M05, M09 | CT-02, CT-03, CT-06 | Series/occurrence/sync/restore | Không đề xuất |
| OP-06 | M05, M08, M10 | CT-03, CT-05 | Date-only/DST/yearless/leap | Không đề xuất |
| OP-07 | M10, M05, M08, M09 | CT-01, CT-06 | Notification ACL/dedupe/stale | Không đề xuất |

**Trình tự hợp lý:** xử lý OP-01–04 theo thẩm quyền → xác nhận OP-05–07 tại UX/business review → cập nhật CT draft bằng addenda được dẫn nguồn → hoàn thiện Dxx→AC semantic traceability và phân lớp 763 AC → nghiệm thu tài liệu/P0 gate → mới khóa kiến trúc. Có thể làm các bước chuẩn bị độc lập song song ở mức phân tích, không tạo false sign-off.

## 9. Sổ phê duyệt và quy tắc version

| Nội dung | Trạng thái tại V1.0 | Hành động tiếp theo |
|---|---|---|
| 247 Dxx (10 BRD) | APPROVED_UNCHANGED | Giữ nguyên |
| DEC-01–DEC-07 phương án A1–A5 | APPROVED_UNCHANGED | Giữ nguyên; không phê duyệt lại |
| OP-01 | OPEN — proposed, numeric retention/legal review pending | Quyết định retention và review legal/ops |
| OP-02 | OPEN — proposed, hold/dispute authority pending | Quyết định consent/hold |
| OP-03 | OPEN — proposed, post-Closed identity/delete exception pending | Quyết định access model |
| OP-04 | OPEN — proposed, rounding/FX exact rule pending | Quyết định financial oracle |
| OP-05 | OPEN — proposed, UX/contract validation pending | Review domain M03–05/M09 |
| OP-06 | OPEN — proposed, leap-day/DST UI pending | Review M05/M08 UX |
| OP-07 | OPEN — proposed, 15-minute window and preview pending | Review M10 UX |
| CT-01–CT-08 | WORKING_DRAFT | Không tự đánh dấu Approved |
| Master P0 Matrix | WORKING_DRAFT, QA NOT_RUN | Chưa có release pass |

**Mẫu phê duyệt hợp lệ cho vòng sau:** ghi rõ phiên bản tài liệu, từng OP được duyệt theo các điều khoản nào; nếu một OP có mục chưa xác minh (đặc biệt OP-01 retention/legal/backup) thì phê duyệt phương án *không đồng nghĩa* đã chốt các tham số còn mở. Tạo `OUR_SPACE_APPROVED_OP_POLICY_SUPPLEMENT_Vx.y.md` riêng khi có quyết định; **không sửa** Supplement DEC V1.0 hoặc BRD gốc.

**Không được tự biến các phương án trong tài liệu này thành luật nghiệp vụ:** `PROPOSED` khác `APPROVED`; `AC specified` khác `QA PASSED`; `research conditionally allowed` khác `architecture frozen`.

## 10. Các cổng còn chặn thiết kế/triển khai

1. **G-OP:** chính sách OP-01–04 có căn cứ/decision; OP-05–07 có UX/contract chốt rõ những tham số ảnh hưởng hành vi.
2. **G-CT:** 8 contract reviewed/signed-off, không conflict với 247 Dxx và 7 DEC đã duyệt.
3. **G-TRACE:** 60 Dxx thiếu link trực tiếp có supplemental trace evidence; 187 explicit mapping semantic validated; 763 AC phân lớp scope đúng; có positive/negative E2E cho mobile/desktop.
4. **G-ARCH:** chỉ bắt đầu freeze architecture khi các gate trước đủ hoặc exception được PO xác nhận cụ thể; chọn công nghệ là nhiệm vụ khác, chưa thực hiện.
5. **G-RELEASE:** phải có P0 tất cả M01–M10, test thực chạy và pass, backup/restore drill, permission/financial/Sealed tests, parity mobile/desktop.

## 11. Nguồn đối chiếu

- `Docs/OUR_SPACE_M01_..._BRD_V1.0.md` đến `Docs/OUR_SPACE_M10_..._BRD_V1.0.md` (tên đầy đủ có trong Handoff V2.0).
- `Docs/Policies/OUR_SPACE_APPROVED_POLICY_SUPPLEMENT_V1.0.md` (phương án A1–A5 của DEC-01–DEC-07 được duyệt 23/10/2026).
- `Reviews/Contracts/OUR_SPACE_CROSS_MODULE_CONTRACTS_CT01_CT08_DRAFT_V1.0.md`.
- `Reviews/Acceptance/OUR_SPACE_MASTER_P0_ACCEPTANCE_MATRIX_DRAFT_V1.0.md`.
- `Reviews/Readiness/OUR_SPACE_PRE_ARCHITECTURE_READINESS_REVIEW_V1.0.md`.

**Bàn giao:** đặt tài liệu **đúng một file** vào `OurSpace/Reviews/Readiness/OUR_SPACE_OP01_OP07_CLOSURE_PROPOSAL_V1.0.md`. Đừng đặt trong `Docs/Policies/` khi chưa có sign-off và đừng giải nén vào thư mục package lồng nhau.
