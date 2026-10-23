---
document_id: OURSPACE-M07-BRD
project: Our Space
module_id: M07
module_name: Budget & Savings
version: 1.0
status: APPROVED_BUSINESS_REQUIREMENTS__IMPLEMENTATION_NOT_STARTED
language: vi-VN
approved_on: 2026-10-22
file_name: OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md
intended_audience: [Product Owner, UX Designer, Codex, Developer, QA]
related_documents:
  - OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md
  - OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md
  - OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md
  - OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md
  - OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md
  - OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md
next_module: M08 — Special Moments
---

# OUR SPACE — M07: BUDGET & SAVINGS
## Business Requirements & Functional Specification — V1.0

> **TRẠNG THÁI CHÍNH THỨC — ĐÃ DUYỆT NGHIỆP VỤ.** Chủ dự án đã nói “Tôi chốt toàn bộ đề xuất M07” vào ngày 22/10/2026; tất cả **D01–D30** bên dưới đã được phê duyệt. Tài liệu đặt tại `OurSpace/Docs/OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md`. Dành cho Product Owner, Designer, Codex, Developer và QA. **Chưa viết code, chưa quyết định công nghệ, kiến trúc, API, cơ sở dữ liệu hoặc nhà cung cấp.**
>
> **Quy ước Our Space:** website riêng tư cho hai tài khoản A/B; Private mặc định; phân quyền theo nội dung; desktop và mobile ngang nhau; giữ an toàn dữ liệu, lịch sử, Trash ≥30 ngày và backup/restore. Chỉ đưa Our Space V1.0 vào sử dụng khi **P0 của cả 10 phân hệ** hoàn thành và được nghiệm thu. Không cắt M07 thành một MVP chỉ hiển thị chi tiêu mà thiếu chia/hoàn tiền, tiết kiệm, bảo mật hoặc tích hợp.
>
> **Hướng dẫn Codex:** phải đọc đủ 30 decisions, 20 screens `FN-01`–`FN-20`, 30 domain entities, 76 rules `BR-M07-01`–`BR-M07-76`, 22 use cases `UC-M07-01`–`UC-M07-22`, 50 exceptions `EX-M07-01`–`EX-M07-50`, 85 acceptance criteria `AC-M07-01`–`AC-M07-85`, integration contracts, trạng thái, privacy, DoD và open dependencies. Những gì chưa có quyết định cụ thể **không được tự phán đoán và coi là đã duyệt**.
>
> **Ưu tiên:** P0 bắt buộc V1.0; P1 nâng cao; P2 tương lai. M07 là ứng dụng **ghi chép và đối soát theo khai báo**, không phải ngân hàng/ví điện tử, không thực hiện chuyển tiền, không xác minh số dư thực ở ngân hàng.

---

# 1. Tầm nhìn, mục tiêu, phạm vi và giới hạn

## 1.1. Sứ mệnh nghiệp vụ

M07 tên hiển thị đề xuất **Our Money**; cho phép hai người quản lý tiền riêng và chi tiêu chung, phân biệt rõ **ai thực trả tiền (payer)** với **ai có trách nhiệm chịu chi phí (allocation)**, chấp thuận nghĩa vụ trước khi ghi nợ chính thức, theo dõi hoàn tiền nội bộ (**settlement**) và tiền nhà cung cấp hoàn (**refund**), lập budgets, theo dõi savings. Đích đến không phải giám sát lẫn nhau, mà là có một nơi ghi nhận tiền minh bạch theo phạm vi quyền và giải thích được từng con số.

Các câu hỏi M07 phải trả lời: (1) khoản nào đã chi, chi thực tế bao nhiêu? (2) ai trả trước/ai chịu chi? (3) khoản được chia đã được người kia đồng ý chưa? (4) còn nợ hay cần hoàn ai, theo đồng tiền nào? (5) ngân sách đã dùng bao nhiêu, còn bao nhiêu? (6) mỗi quỹ đã thực góp/rút bao nhiêu? (7) báo cáo và dữ liệu từ M03/M04/M06 có khớp hay không?

## 1.2. Phạm vi P0 được duyệt

- **Money Spaces:** Personal và Shared; Private by default; không dùng số liệu tổng hợp để rò rỉ dữ liệu riêng tư.
- **Expenses:** sổ chi, tạo/sửa/chi tiết, nhiều người trả, phân loại, chứng từ, xác nhận; Shared Expense có bước duyệt phần trách nhiệm của người bị phân bổ.
- **Split:** Equal, Fixed Amount, Percentage, Weighted; xác định rounding, payer/payment so với allocation, net balance, phần chờ chấp thuận.
- **Settlement:** người chuyển/người nhận, pending/confirmed, hoàn từng phần, đối soát và audit; không tự chuyển khoản.
- **Refund/Adjustment:** hoàn toàn phần, một phần, điều chỉnh expense đã chốt, không ghi đè/xóa lịch sử settlement.
- **Budgets:** Monthly, Category, Trip, Custom; kỳ lịch, ngưỡng 80/100/vượt 100, không mặc định rollover, cảnh báo nhưng không chặn chi hợp lệ.
- **Savings Goals:** personal/shared, target, contribution, withdrawal, adjustment, xác nhận, không suy ra quyền sở hữu từ tỷ lệ góp, không dùng số dư như số dư ngân hàng.
- **Recurring Expenses:** kỳ dự kiến/pending, không tự coi đã trả.
- **Multi-currency:** lưu tiền gốc, tỷ giá do người dùng nhập/xác nhận, quy đổi rõ ràng, không trộn các đơn vị tiền.
- **Search/Reports/Export:** lọc theo quyền, chi phí ròng, báo cáo/CSV dữ liệu cấu trúc, audit; backup/restore; Trash ≥30 ngày.
- **Cross-module:** M07 làm single source of truth cho Expense/Split/Settlement/Budget/Savings; M03/M04/M05/M06 tiêu thụ liên kết, không copy ledger.
- **Cộng tác & Parity:** chống xung đột/sửa khi mất quyền; nghiệp vụ P0 đầy đủ desktop/mobile.

## 1.3. Ngoài P0 / giới hạn bản chất

- P1: tỷ giá tự động, rollover, báo cáo PDF được trình bày, nhập CSV thông minh, đối soát sao kê thủ công nâng cao, quỹ sở hữu theo phần, phân tích xu hướng chuyên sâu, thông báo bổ sung.
- P2: ngân hàng và giao dịch tự động, thanh toán trực tiếp, AI OCR hóa đơn/phân loại/chống bất thường, dự báo nâng cao.
- M07 không yêu cầu lưu số thẻ, PIN, mật khẩu ngân hàng, OTP, thông tin thanh toán đủ để truy cập tài khoản. Mọi payment/settlement chỉ là **khai báo** cho đến khi các bên được yêu cầu xác nhận.
- M07 không làm kế toán pháp lý hoặc quyết toán thuế; quyền sở hữu quỹ chung chưa tự phát sinh từ bản ghi Contribution. Không tự cam kết đáp ứng bất kỳ quy định pháp luật cụ thể nào khi chưa có scope pháp lý riêng.
- Không tự chọn ngân hàng, dịch vụ tỷ giá, file storage, quota, thuật toán database hay SLA. Ghi OPEN-ISSUE nếu cần quyết định thêm.

## 1.4. Các bất biến tuyệt đối

1. **Expense ≠ Split ≠ Settlement ≠ Refund ≠ Budget ≠ Savings Contribution ≠ Savings Withdrawal.** Những nghiệp vụ khác nhau không được cộng như một loại chi phí.
2. **Payer Payment ≠ Allocation:** người trả trước không mặc định là người chịu cuối cùng.
3. Khi một khoản Shared khiến người kia chịu nghĩa vụ, **người chịu phải chấp thuận trước khi nghĩa vụ ấy là confirmed**; người tạo không thể tự xác nhận thay.
4. **Tổng payment và tổng allocation bằng giá trị chi** trong đồng tiền gốc; rounding có quy tắc rõ ràng.
5. **Settlement không phải Expense**; **Contribution/Withdrawal không phải Expense**; dùng tiền tiết kiệm mua vé phải phân biệt giảm quỹ với chi phí mua vé.
6. Truy vết sau điều chỉnh: không tự ghi đè lịch sử giao dịch đã chốt, nhất là khi đã settlement/refund.
7. Không cộng ngoại tệ trực tiếp; không tự phát minh tỷ giá; transaction giữ original amount/currency và snapshot tỷ giá được dùng.
8. Quyền truy cập áp cả lên số tổng hợp, report, search, notification, file endpoint, export và lịch sử; liên kết Shared không tự share file Private.
9. M07 giữ **một source of truth** cho tiền, các phân hệ khác chỉ tham chiếu; thao tác tạo qua nhiều nguồn phải chống trùng.
10. Lưu/duyệt/hoàn trả chỉ báo thành công khi thật sự được ghi nhận; lỗi mạng không báo đã lưu/đã nhận tiền.

---

# 2. 30 quyết định nghiệp vụ đã phê duyệt

**Nguồn:** Người dùng xác nhận toàn bộ đề xuất M07 ngày 22/10/2026. Không còn mục D01–D30 nào ở trạng thái chờ phê duyệt.

| Mã | Chủ đề | Quyết định chính thức | Hệ quả/điểm kiểm thử |
|---|---|---|---|
| D01 | Không gian tài chính | Private Money và Shared Money | Giữ phạm vi riêng từng người; không hiển thị dữ liệu người kia nếu chưa được chia sẻ. |
| D02 | Quyền mặc định | Private; chia sẻ có chủ đích | Mọi đối tượng mới mặc định chưa chia sẻ. |
| D03 | Nhập giao dịch | Thủ công V1.0; không kết nối ngân hàng | Không tự tuyên bố có đối soát ngân hàng. |
| D04 | Expense | Tách payer/payment và beneficiary/allocation | Xem được ai trả và ai phải chịu. |
| D05 | Nhiều Payer | Một Expense được nhiều người trả | Không nhân Expense cho mỗi payer. |
| D06 | Split Methods | Equal, Fixed, Percentage, Weighted | Tổng allocation chính xác. |
| D07 | Split mặc định | Equal 50/50 khi A/B cùng chịu | Sửa được trước xác nhận. |
| D08 | Duyệt nghĩa vụ | Bên bị phân bổ phải chấp thuận trước khi ghi nợ chính thức | Pending/Rejected không thành confirmed debt. |
| D09 | Expense Status | Draft, Pending, Confirmed, Rejected, Voided; Refund theo trạng thái riêng | Không trộn trạng thái chi/hoàn tiền. |
| D10 | Shared Balances | Net balance và đối soát chi tiết | Có thể lần theo từng Expense/Settlement. |
| D11 | Settlement | Từng phần, cần người nhận xác nhận | Pending không mặc định giảm nợ. |
| D12 | Settlement đã xác nhận | Điều chỉnh có lịch sử, không xóa âm thầm | Không mất dấu vết chuyển tiền đã được xác nhận. |
| D13 | Refund | Riêng, có hoàn từng phần và phân bổ lại | Expense và Settlement gốc tồn tại. |
| D14 | Budgets | Monthly, Category, Trip, Custom | Có phạm vi và kỳ rõ ràng. |
| D15 | Budget Alerts | 80%, 100%, >100% mặc định | Ngưỡng có thể tùy chỉnh, không phải cảnh báo bắt buộc với từng người. |
| D16 | Kỳ Budget | Tháng lịch, chưa rollover V1.0 | Không tự chuyển tiền chưa dùng sang kỳ sau. |
| D17 | Vượt ngân sách | Cảnh báo, không chặn Expense hợp lệ | Expense và Budget là hai nghiệp vụ độc lập. |
| D18 | Savings | Quỹ cá nhân và quỹ chung | Private mặc định, xác nhận biến động phù hợp. |
| D19 | Savings Transactions | Contribution, Withdrawal, Adjustment | Số dư từ các biến động đã xác nhận. |
| D20 | Target Reached | Không auto Completed khi đạt 100% | Cần xác nhận đóng quỹ. |
| D21 | Contribution vs Ownership | Chỉ theo dõi đóng góp, không suy ra ownership | Chưa có quy tắc chia quyền sở hữu tiền chung. |
| D22 | Bản chất số dư | Số dư được khai báo, không xác minh ngân hàng | UI phải có nhãn tránh hiểu sai. |
| D23 | Recurring Expense | Kỳ dự kiến/pending, không auto coi đã thanh toán | Chống double record cho cùng kỳ. |
| D24 | Đa tiền tệ | Có trong V1.0, giữ nguyên original currency | Không cộng tiền không cùng loại. |
| D25 | Exchange Rate | Người dùng nhập/xác nhận V1.0; tự động P1 | Rate source/date lưu kèm khi quy đổi. |
| D26 | Cross-module | M07 sở hữu chi phí/tiết kiệm; M03/M04/M06 liên kết | Không có ledger hoặc balance thứ hai. |
| D27 | Bảo mật tài chính | Shared không tự lộ chứng từ/khoản Private | Kiểm quyền asset và dữ liệu nguồn độc lập. |
| D28 | Reports/Export | Báo cáo và CSV/structured data P0; PDF đẹp P1 | Metadata về tiền tệ/quyền trong bản xuất. |
| D29 | Audit/Recovery | Change history, Trash ≥30 ngày, restore, backup | Không phá đối soát khi xóa/restore. |
| D30 | Collaboration/Devices | Bảo vệ xung đột; desktop/mobile parity; không cần live cursor | Chặn stale updates và sửa vượt quyền. |

## 2.1. Quy ước khi gặp khác biệt với BRD khác

- **M01** sở hữu Diary/Photobook; **M02** sở hữu ảnh/video gốc và quyền Media; **M03** Place/Visit/Date Plan; **M04** Trip/Activity/Booking; **M05** Calendar Event/Reminder; **M06** Wish/Goal/Achievement; **M07** Expense/Split/Settlement/Budget/Savings.
- M04 và M03 đã yêu cầu hỗ trợ chi phí nhưng chỉ bằng **liên kết tới M07**, không có ledger độc lập. M06 đã chốt Savings Goal do M07 sở hữu.
- Nếu phần phụ thuộc từ M08–M10 hoặc chi tiết BRD cũ chưa khớp, ghi `OPEN-CROSS-MODULE-ISSUE` với tình huống và quyết định cần chủ dự án xử lý; không tự làm yếu nguyên tắc xác nhận và riêng tư của M07.
- Mọi ví dụ tiền dưới đây chỉ là dữ liệu minh họa; không sử dụng làm dữ liệu thực của hai người.

---

# 3. Tác nhân, từ điển, quyền và hành trình

## 3.1. Actors

| Actor | Phạm vi | Kiểm soát đặc thù |
|---|---|---|
| Person A / Person B | Hai tài khoản đăng nhập độc lập | Tài khoản nào cũng có thể sở hữu dữ liệu riêng hoặc tham gia nội dung chung |
| Expense Creator | Khởi tạo bản ghi | Không có quyền tự duyệt khoản chịu chi của người còn lại |
| Payer | Người đã chi tiền thực tế | Phải phân biệt với beneficiary và người tạo |
| Beneficiary / Allocated Person | Người chịu chi phí theo thỏa thuận | Có quyền approve/reject phần nghĩa vụ của chính mình |
| Settlement Sender | Người khai đã hoàn tiền | Không tự xác nhận người nhận đã nhận |
| Settlement Receiver | Người được hoàn tiền | Xác nhận receipt cho settlement |
| Savings Contributor | Người khai góp quỹ | Quyền góp/duyệt theo thiết lập quỹ, không tự xác lập ownership |
| Fund Manager | Người được cấp quyền quản lý quỹ | Không mặc định có quyền đọc tài chính Private khác |
| Owner / Editor / Contributor / Viewer | Vai trò theo đối tượng | Quyền tác động đến dữ liệu tài chính được kiểm tra từng thao tác |
| Linked Module | M03/M04/M05/M06/M01/M02/M08/M09/M10 | Không thể bypass quyền hoặc tạo sổ tài chính riêng |

## 3.2. Từ điển cốt lõi

- **Expense:** số tiền chi gốc trong đồng tiền đã chọn, có trạng thái và chứng từ tùy chọn.
- **Expense Payment:** ai thực trả bao nhiêu (một hoặc hai tài khoản).
- **Expense Allocation:** ai có trách nhiệm chịu bao nhiêu; không tự khẳng định nợ nếu người bị phân bổ chưa duyệt.
- **Split Method:** quy tắc chia được chọn và snapshot cách tính.
- **Payable/Receivable/Net Balance:** nghĩa vụ phải trả/phải thu và phần bù trừ giữa hai người, từ khoản confirmed.
- **Settlement:** ghi nhận chuyển tiền hoàn trả nội bộ; confirmation của người nhận quyết định hiệu lực khấu trừ.
- **Refund:** nhà cung cấp hoàn lại một phần hoặc toàn bộ Expense; **không** phải Settlement giữa A/B.
- **Adjustment:** thay đổi có vết dẫn tới số tài chính mới, không viết đè giao dịch xác nhận cũ.
- **Budget:** số hạn mức hoặc kế hoạch chi trong một kỳ/phạm vi; không phải tiền thực còn trong ngân hàng.
- **Savings Goal:** quỹ tích lũy do hai người tự ghi nhận; Contribution tăng, Withdrawal giảm, Adjustment điều chỉnh.
- **Money Space:** ranh giới riêng/chung và tập quyền, không phải tài khoản ngân hàng được đồng bộ.
- **FX Snapshot:** tỷ giá do người dùng nhập/xác nhận theo một ngày/phương pháp, áp cho báo cáo có liên quan.

## 3.3. Hành trình ví dụ từ địa điểm đến quyết toán

1. M03 ghi nhận Visit → người có quyền tạo Expense tại M07, liên kết Visit ID.
2. Tổng bill 600.000 VND; A đã trả 600.000; Equal Split A/B 300.000 mỗi người.
3. B duyệt phần 300.000 của mình → nghĩa vụ confirmed `B → A 300.000`.
4. B ghi Settlement 200.000 cho A; A xác nhận đã nhận → còn 100.000.
5. B ghi Settlement 100.000; A xác nhận → số dư nghĩa vụ này = 0.
6. Một khoản Refund 100.000 về A được ghi sau đó; nếu hai người chốt hoàn theo tỷ lệ gốc, nghĩa vụ mới là `A → B 50.000` (hoặc bù trừ theo chính sách hợp lệ). **Không** xóa các settlement lịch sử.
7. M04/M05 có thể hiển thị Expense liên kết nhưng **không tự tạo hoặc nhân đôi Expense**.

---

# 4. Mô hình miền — 30 đối tượng nghiệp vụ

| Mã | Đối tượng | Mục đích | Thuộc tính nghiệp vụ điển hình |
|---|---|---|---|
| ENT-M07-01 | Money Space | Phạm vi tài chính Private/Shared | ID; owner; visibility; members; status |
| ENT-M07-02 | Expense | Chi phí được khai báo | amount_original; currency; expense_date; status; category; space |
| ENT-M07-03 | Expense Payment | Tiền từng payer thực trả | expense_ref; payer; paid_amount; proof/status |
| ENT-M07-04 | Expense Allocation | Trách nhiệm chịu khoản chi | expense_ref; beneficiary; share_amount; approval |
| ENT-M07-05 | Split Rule | Phương pháp chia | method; parameters; rounding_policy_snapshot |
| ENT-M07-06 | Expense Approval | Duyệt/từ chối nghĩa vụ | beneficiary; decision; expense_version; timestamp |
| ENT-M07-07 | Expense Adjustment | Điều chỉnh đã có dấu vết | before/after/delta; reason; approved_by |
| ENT-M07-08 | Refund | Nhà cung cấp hoàn tiền | expense_ref; amount; allocation_effect; status |
| ENT-M07-09 | Reimbursement Balance | Kết quả đối soát được suy ra | party_pair; currency; confirmed_debt; settlements |
| ENT-M07-10 | Settlement | Khoản hoàn nội bộ | sender; receiver; amount; currency; status; debt_link |
| ENT-M07-11 | Settlement Confirmation | Xác nhận người nhận | receiver; decision; timestamp; settlement_version |
| ENT-M07-12 | Budget | Kế hoạch/hạn mức chi | amount; currency; scope; status; owner |
| ENT-M07-13 | Budget Period | Kỳ ngân sách | start; end; timezone; closed_status |
| ENT-M07-14 | Budget Scope | Tiêu chí chọn expense | category/trip/space filters; inclusion rule |
| ENT-M07-15 | Savings Goal | Quỹ tiết kiệm | target; currency; confirmed_balance; participants; status |
| ENT-M07-16 | Savings Contribution | Góp quỹ | contributor; amount; timestamp; status |
| ENT-M07-17 | Savings Withdrawal | Rút quỹ | requester; amount; approval; related_expense |
| ENT-M07-18 | Savings Adjustment | Sửa số dư khai báo | amount_delta; reason; approval; audit |
| ENT-M07-19 | Savings Participation | Vai trò trong quỹ | person; permission; contribution tracking only |
| ENT-M07-20 | Recurring Expense Rule | Mẫu chi phí lặp | period; next_due; template; status |
| ENT-M07-21 | Currency | Đơn vị tiền | code; minor unit; rounding configuration |
| ENT-M07-22 | Exchange Rate Snapshot | Tỷ giá tại thời điểm sử dụng | base; quote; rate; date; source; confirmer |
| ENT-M07-23 | Financial Category | Nhóm phân loại | label; parent; archived; owner |
| ENT-M07-24 | Receipt / Document Link | Chứng từ theo quyền | asset/document ID; permission; purpose |
| ENT-M07-25 | Cross-module Link | Quan hệ nguồn tài chính | module; source_type; source_id; usage_role |
| ENT-M07-26 | Financial Permission | ACL nội dung | principal; role; field/resource restrictions |
| ENT-M07-27 | Audit History | Lịch sử các thay đổi quan trọng | actor; action; before/after; timestamp |
| ENT-M07-28 | Trash Record | Xóa mềm và khôi phục | deleted_at; retention; dependent state |
| ENT-M07-29 | Export Request | Xuất dữ liệu có kiểm quyền | scope; format; permission_snapshot; delivery check |
| ENT-M07-30 | Notification Reference | Liên kết thông báo/lịch | M05 event/reminder ref; privacy-safe payload |

## 4.1. Quan hệ và nguồn dữ liệu

- Money Space có nhiều Expense, Budget, Savings Goal; tư cách thành viên Money Space không mặc định phá quyền nội dung con.
- Expense có từ một đến nhiều Payment; từ một đến nhiều Allocation nếu Shared; có Refund/Adjustment; có thể link nhiều Place, Visit, Trip, Booking, Activity hoặc Event. **Không tạo expense phụ tương ứng từng link.**
- Split Rule là nguồn mô tả cách tính Allocation tại một phiên bản; Approval gắn phiên bản được duyệt, nếu số tiền/phương pháp thay đổi thì phải xử lý chấp thuận lại.
- Reimbursement Balance là **kết quả suy ra** theo đồng tiền và các confirmed obligations/settlements, không phải giao dịch độc lập tùy tiện có thể sửa tay.
- Budget có phạm vi/danh mục/kỳ, ánh xạ nhiều Expense; nhiều Budget có thể đọc cùng một Expense theo những phép tổng hợp khác nhau.
- Savings Goal có Contributions, Withdrawals, Adjustments và Participation; tổng số dư là kết quả từ các biến động hợp lệ, không phải con số do M06 tự duy trì.
- Export/Trash/Audit phải giữ quan hệ đủ để giải thích được số dư và nguồn tiền sau phục hồi.

## 4.2. Các dữ liệu bắt buộc theo loại đối tượng

### Expense

| Thuộc tính | Bắt buộc | Quy tắc |
|---|---|---|
| Title | Có | Chuỗi không trống, có giới hạn ở thiết kế phi chức năng |
| Total amount & Currency | Có | Amount > 0 theo precision đồng tiền; lưu original |
| Expense date | Có | Ngày phát sinh, không nhầm ngày tạo; múi giờ phù hợp |
| Category | Có | Danh mục người dùng được phép chọn |
| Money space & Visibility | Có | Private mặc định; Shared cần cấp quyền rõ |
| Payment(s) & Payer(s) | Có trước confirmed | Tổng Payment khớp Expense |
| Allocation(s)/Split Rule | Có khi Shared | Tổng allocation khớp Expense; approval của affected person |
| Status | Có | Draft/Pending/Confirmed/Rejected/Voided |
| Receipt, Notes, Linked Source | Tùy chọn | File và nguồn được kiểm quyền riêng |
| Created/Updated/Version/Audit | Tự ghi | Giúp replay, conflict resolution, truy vết |

### Settlement

| Thuộc tính | Bắt buộc | Quy tắc |
|---|---|---|
| Amount + Currency | Có | Amount > 0; tránh trộn currencies |
| Sender / Receiver | Có | Khác người; chỉ 2 tài khoản có quyền liên quan |
| Date + Method | Có | Ngày thực hiện/method khai báo |
| Debt / Net Balance Reference | Có khi đối soát | Không trừ nhầm nghĩa vụ khác |
| Receiver confirmation | Có để confirmed | Pending không trừ nợ |
| Evidence / Note | Tùy chọn | Không hiển thị chứng từ ngoài quyền |
| Revision and Audit | Tự ghi | Không sửa/xóa silently khi confirmed |

### Savings Goal & Movement

| Thuộc tính | Bắt buộc | Quy tắc |
|---|---|---|
| Name, Target, Currency | Có | Target hợp lệ; currency xác định |
| Personal/Shared & permissions | Có | Private mặc định |
| Starting amount | Tùy chọn | Nhập theo xác nhận, có audit; không coi là bank-verified |
| Participant / contributor | Với quỹ chung | Có thể ghi nhiều contributor, không suy ownership |
| Movement amount, date, status | Mỗi biến động | Contribution +; Withdrawal -; Adjustment ±; confirmed only |
| Target date, M06/M04 links | Tùy chọn | Không biến quỹ thành Goal/Trip mới |

## 4.3. Những gì không định nghĩa ở bước BRD

Không chốt bảng SQL, thư viện decimal, giao thức transaction, exact identifier length, size/quota file, dịch vụ FX, notification provider hay API contract kỹ thuật. Tuy vậy, **kết quả nghiệp vụ bắt buộc chính xác tới minor units của đồng tiền, atomic khi cập nhật tiền và chống double processing**. QA phải có bằng chứng kiểm thử cho các yêu cầu này.

---

# 5. Trạng thái, phép tính và định nghĩa số liệu

## 5.1. State machine — Expense và nghĩa vụ

| Trạng thái | Vào trạng thái | Thoát trạng thái | Tác động báo cáo |
|---|---|---|---|
| Draft | Người dùng lưu dữ liệu chưa hoàn tất | Pending hoặc hủy Draft | Không tính là expense confirmed |
| Pending | Đủ chi tiết, còn cần xác nhận bên chịu nghĩa vụ | Confirmed / Rejected / chỉnh sửa lại Pending | Hiển thị riêng là pending, không gộp confirmed debt |
| Confirmed | Payment/Allocation hợp lệ, nghĩa vụ liên quan được duyệt | Adjustment, Refund, Voided theo quy trình | Tính chi và balances theo phần hợp lệ |
| Rejected | Một affected person từ chối | Chủ tạo sửa và gửi duyệt lại, hoặc Void | Không tự tạo nợ chính thức |
| Voided | Bản ghi bị hủy theo quyền và audit | Khôi phục/chỉnh bằng quy trình | Loại khỏi số tổng hiện hành nhưng giữ lịch sử |

- `Refunded`/`Partially Refunded` là **tình trạng hoàn tiền bổ sung**, được suy ra từ Refund hợp lệ, không nhất thiết thay thế `Confirmed` của Expense gốc.
- Khi có phần được một người duyệt và phần khác chưa duyệt, UI phải cho thấy **phạm vi đã được duyệt**; không được phát biểu “tổng khoản này đều confirmed” khi chưa đủ điều kiện. Quy tắc ghi debt chính thức vẫn theo D08.
- Tác giả không thể giả mạo approval người kia; mọi lần yêu cầu duyệt phải chỉ tới một phiên bản Expense cụ thể.
- Tạo các khoản dự kiến từ Recurring Rule là Pending, không tự coi được thanh toán.

## 5.2. State machine — Settlement

`Pending → Confirmed` khi **người nhận** xác nhận đã nhận; `Pending → Cancelled` khi hợp lệ; `Confirmed → Reversed/Corrected` qua một nghiệp vụ có audit và tính lại balances. Đừng thay confirmation bằng thao tác Sender tự click “Đã chuyển”. Không tính các settlement pending như đã hoàn khi hiển thị outstanding confirmed balance.

## 5.3. State machine — Savings Goal và movements

Savings Goal: `Draft → Active ↔ Paused → Target Reached → Completed`, có thể `Cancelled`, `Archived` theo quyền. Đạt target là trạng thái chỉ báo đạt mức tiền, nhưng không tự chốt `Completed`. Nếu withdrawal làm saldo xuống dưới target, UI phải phản ánh lại trạng thái tiền đạt/không đạt; mọi xác nhận Completed trong lịch sử phải còn dấu vết.

Contribution/Withdrawal/Adjustment: `Pending → Confirmed` hoặc `Rejected/Cancelled`, và `Confirmed → Corrected/Reversed` bằng bản ghi sửa sai có audit. Quỹ chung phải có chính sách xác nhận tương ứng quyền; không cần người khác xác nhận mỗi chuyển động cá nhân nếu chính sách quỹ không đòi hỏi, nhưng không cho giả mạo contributor của họ.

## 5.4. Quy tắc tính tiền và điều kiện bất biến

Giả sử một Expense E có tổng nguyên bản `T` trong currency C:

- `SUM(Payment_i) == T` trước khi Expense được xác nhận đã thanh toán.
- `SUM(Allocation_i) == T` trước khi Split được xác nhận; khi refund có thể quản lý **giá trị gốc và chi phí ròng** qua chuỗi adjustment/refund riêng, không phá lịch sử xác nhận gốc.
- Với mỗi người `p`, excess = `confirmed_payment(p) − confirmed_net_allocated_share(p)`; dương là đã ứng trước nhiều hơn phần chịu, âm là cần hoàn; cách netting chỉ tính nghĩa vụ đã duyệt, luôn giữ dòng gốc chi tiết.
- Settlement Confirmed làm giảm nghĩa vụ tương ứng; Settlement Pending không làm giảm. Refund có thể tạo nghĩa vụ hoàn ngược sau khi đã settle.
- `NET_EXPENSE = ORIGINAL_EXPENSE + VALID_EXPENSE_ADJUSTMENTS − CONFIRMED_REFUNDS` trong currency gốc, giới hạn theo khả năng hoàn hợp lệ.
- `SAVINGS_BALANCE = CONFIRMED_STARTING_BALANCE + SUM(CONFIRMED_CONTRIBUTIONS) − SUM(CONFIRMED_WITHDRAWALS) + SUM(CONFIRMED_ADJUSTMENTS)` (trong currency của quỹ / theo quy tắc quy đổi được duyệt).
- `BUDGET_USAGE = SUM(NET_EXPENSES thuộc scope/kỳ/quyền)` sau dedup theo expense identity; không cộng Settlement, Contribution hoặc Withdrawal.
- `PROGRESS = confirmed_balance / target` khi target > 0; số thực có thể >100%, thanh hiển thị đạt 100% nhưng không cắt giá trị gốc.
- Không được ghi dữ liệu tiền bằng biểu diễn khiến `0.1 + 0.2 != 0.3` dẫn tới sai nghĩa vụ; lựa chọn cách lưu chính xác ở thiết kế kỹ thuật, kiểm thử các số lẻ/minor units là P0.

## 5.5. Rounding và multiple payer

- Với Equal/Percentage/Weighted split, phân bổ theo minor units của từng currency, xử lý phần dư bằng quy tắc xác định được và hiển thị trước phê duyệt.
- Ví dụ 101.001 VND chia đôi: có thể tạo 50.501/50.500 VND theo quy tắc phân dư nhất quán, **không** tạo 50.500,5 VND chưa làm tròn rồi âm thầm mất 1 VND.
- Fixed split: tổng các phần do người dùng nhập phải bằng T, nếu không thì không Confirmed.
- Multiple payers: A trả 700.000, B trả 300.000, mỗi người chịu 500.000 → B hoàn A 200.000, **không** tạo 2 expense 700.000/300.000.
- Nếu payer share hoặc allocation được sửa khi Expense đã Confirmed, phải kiểm lại mọi approval và settlement liên quan.

## 5.6. FX và kỳ ngày

- Original amount/currency không sửa vì biến động tỷ giá về sau. Rate Snapshot ghi base, quote, date, rate, phương pháp/nguồn, người xác nhận; người dùng được phép điều chỉnh báo cáo theo quy tắc nhưng phải có audit.
- Không có tỷ giá hợp lệ thì chia số tiền riêng theo currency gốc, báo cáo hợp nhất hiển thị **chưa đủ dữ liệu**, không ẩn khoản có FX missing.
- Budget theo tháng lịch, phạm vi ngày và múi giờ phải rõ; timezone thay đổi trên thiết bị không được tự đẩy Expense sang kỳ khác. Recurring Expense tương tự giữ intended local due date.
- Settlement khác currency cần lượng tiền gốc, tiền nhận và phương pháp quy đổi mà **cả hai bên xác nhận**.

---

# 6. Sitemap & 20 màn hình chức năng

| Mã | Màn hình | Mục đích chính |
|---|---|---|
| FN-01 | Our Money Home | Home tổng quan tiền được phép xem |
| FN-02 | Expense Ledger | Sổ chi các khoản đã có quyền |
| FN-03 | Add / Edit Expense | Form ghi hóa đơn |
| FN-04 | Expense Detail | Nguồn giải thích một Expense |
| FN-05 | Split Expense | Thiết lập chia chi phí |
| FN-06 | Shared Balances | Ai phải hoàn ai và vì sao |
| FN-07 | Settlements | Lịch sử hoàn trả nội bộ |
| FN-08 | Money Spaces | Quản lý phạm vi tài chính |
| FN-09 | Budgets Overview | Danh sách kế hoạch chi |
| FN-10 | Budget Detail | Phân tích ngân sách theo kỳ/scope |
| FN-11 | Savings Dashboard | Tổng quan các quỹ tiết kiệm |
| FN-12 | Create / Edit Savings Goal | Form cấu hình quỹ |
| FN-13 | Savings Goal Detail | Nguồn giải thích số dư quỹ |
| FN-14 | Contributions & Withdrawals | Sổ biến động tiết kiệm |
| FN-15 | Recurring Expenses | Mẫu chi phí có lịch lặp |
| FN-16 | Categories & Rules | Quản lý danh mục |
| FN-17 | Search & Filters | Tìm kiếm tài chính có quyền |
| FN-18 | Reports & Insights | Báo cáo chi/tiết kiệm |
| FN-19 | Linked Expenses | Xem các quan hệ tài chính ngoài M07 |
| FN-20 | Permissions, Audit, Trash & Export | Quyền và khả năng khôi phục |

## 6.1. Quy ước UX dùng chung

- Dùng định dạng số và tiền phù hợp locale; luôn hiển thị **currency** và nhãn trạng thái xác nhận. Không chỉ dùng màu để biểu thị tài chính.
- Với số liệu chưa xác minh, hiển thị rõ “Dữ liệu được ghi nhận trong Our Space, không phải số dư ngân hàng”.
- Các biểu đồ phải có dữ liệu dạng text/table tương đương trên desktop/mobile, không cản quyền truy cập người dùng.
- Khi để trống, cung cấp hành động tạo Expense/Budget/Goal đầu tiên; khi không đủ quyền, không gọi đó là danh sách trống.
- Mọi Save/Approve/Reject/Confirm có feedback thật và giải thích người nào bị ảnh hưởng; không báo thành công nếu server từ chối, thiếu xác nhận hoặc kết nối lỗi.
- Khi sửa khoản confirmed, hiển thị preview trước/sau, người cần xác nhận lại, hậu quả đối với settlement/refund và một đường dẫn tới audit.
- Không bắt buộc live cursor; đồng thời thêm khoản độc lập không mất nhau, sửa cùng khoản phải có quản lý conflict.

## 6.2. Đặc tả màn hình chi tiết FN-01–FN-20

### FN-01 — Our Money Home

**Mục tiêu:** Home tổng quan tiền được phép xem.

**Nội dung hiển thị & dữ liệu:** My/Shared/Combined Visible, chi phí tháng, ngân sách, saved progress, pending approvals, net settlement, activity. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Nhấn Add Expense / Add Contribution / xem detail. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Không trộn Private của partner vào thống kê; nhãn phạm vi số liệu; trống thì có quick actions. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: summary cards theo chiều dọc, số liệu không cắt, nút tạo dễ bấm. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-02 — Expense Ledger

**Mục tiêu:** Sổ chi các khoản đã có quyền.

**Nội dung hiển thị & dữ liệu:** Bộ lọc date/category/payer/currency/space/status, group theo tháng, total hợp lệ. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Mở chi tiết; tạo/sửa/void/export danh sách theo quyền. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Pending và Confirmed khác nhau; không double count từ links; không leak qua result count. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: danh sách card + filter sheet, desktop: bảng có sortable headers. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-03 — Add / Edit Expense

**Mục tiêu:** Form ghi hóa đơn.

**Nội dung hiển thị & dữ liệu:** Title, >0 amount, currency, expense date, category, payments, split, source, receipt, visibility. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Save Draft, Request Approval, Confirm theo quyền, Link Existing. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Validate sum payment và allocations; xác nhận lại khi sửa giá/ảnh hưởng người khác. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: wizard từng phần; desktop: side panel/form lớn; cảnh báo chưa lưu. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-04 — Expense Detail

**Mục tiêu:** Nguồn giải thích một Expense.

**Nội dung hiển thị & dữ liệu:** Original/net amount, payers, allocation, approvals, refund, settlements, links, audit. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Approve/Reject own share; adjust; add refund; void; open visit/trip. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Ẩn chứng từ Private khi không đủ quyền; view frozen confirmed state + amendments. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: sections/tab; không làm mất đường tới audit và trạng thái. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-05 — Split Expense

**Mục tiêu:** Thiết lập chia chi phí.

**Nội dung hiển thị & dữ liệu:** Equal/Fixed/Percentage/Weighted, người tham gia, calculated shares, rounding residue. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Preview và áp dụng split, gửi duyệt. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Sum allocations đúng tổng; hiển thị rõ payer vs beneficiary; không auto debt. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: số tiền/percent input có xác nhận, desktop: so sánh hai bên. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-06 — Shared Balances

**Mục tiêu:** Ai phải hoàn ai và vì sao.

**Nội dung hiển thị & dữ liệu:** Confirmed debt by currency, paid/remaining, net figure, pending separate, itemized reconciliation. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Mở Expense, initiate Settlement, filter unsettled. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Net balance không thay thế chứng từ; không net khác currency; phần chờ không là nợ chính thức. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: bảng A/B và danh sách phân rã dễ đọc. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-07 — Settlements

**Mục tiêu:** Lịch sử hoàn trả nội bộ.

**Nội dung hiển thị & dữ liệu:** Sender, receiver, amount, currency, date, status, linked debt, proof. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Record partial/full, receiver confirm, cancel pending, correct confirmed. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Receiver phải xác nhận; idempotent; overpay phát cảnh báo; không ghi Expense mới. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: quick settlement + xác nhận rõ hiệu lực đối soát. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-08 — Money Spaces

**Mục tiêu:** Quản lý phạm vi tài chính.

**Nội dung hiển thị & dữ liệu:** Personal/Shared, membership, visibility, access scope. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Create/view/manage share and permissions. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Không tự chia sẻ expense cũ khi đổi space; chuyển Private→Shared phải review. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: bộ chuyển My/Our rõ ràng. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-09 — Budgets Overview

**Mục tiêu:** Danh sách kế hoạch chi.

**Nội dung hiển thị & dữ liệu:** Monthly/Category/Trip/Custom; kỳ; amount/currency; usage/remaining; alerts. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Create, filter, archive, open Budget Detail. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Không coi budget là bank balance; chỉ tính chi phí phù hợp quyền. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: cards với thanh tiến độ; desktop: so sánh các budget. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-10 — Budget Detail

**Mục tiêu:** Phân tích ngân sách theo kỳ/scope.

**Nội dung hiển thị & dữ liệu:** Amount, period, scope, categories, linked trip, net expenses, alerts, audit. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Edit amount/rules, open participating expenses, close period. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** One Expense counted once per aggregate; refunds giảm net; no rollover P0. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: drilldown expense, cảnh báo âm/vượt. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-11 — Savings Dashboard

**Mục tiêu:** Tổng quan các quỹ tiết kiệm.

**Nội dung hiển thị & dữ liệu:** Personal/shared funds, active/paused/target reached, progress, contributions. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Create goal, select fund, filter status. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Balance là số ghi nhận; không công khai quỹ Private. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: goal cards + quick contribute. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-12 — Create / Edit Savings Goal

**Mục tiêu:** Form cấu hình quỹ.

**Nội dung hiển thị & dữ liệu:** Name, target>0, currency, optional date/starting, participants, visibility, confirmation rules. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Save Draft, Activate, edit target, archive. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** No ownership inference; target history; approvals for changes affecting contributors. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: từng bước; desktop: form chi tiết. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-13 — Savings Goal Detail

**Mục tiêu:** Nguồn giải thích số dư quỹ.

**Nội dung hiển thị & dữ liệu:** Target, confirmed balance, movements, contributors, withdrawals, links, status/history. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Contribute, withdraw, correct, pause, mark completed. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Target reached not auto Completed; breakdown confirmed/pending; confidential contributions. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: biểu đồ + movement list; tránh thông tin mập mờ. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-14 — Contributions & Withdrawals

**Mục tiêu:** Sổ biến động tiết kiệm.

**Nội dung hiển thị & dữ liệu:** Movement type, contributor/requester, currency, amount, date, status, related expense. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Submit, approve, reject, reverse/correct, link payment. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Withdrawal≠Expense; avoid negative balance; no double count; confirmation as configured. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: ghi nhận nhanh và review trước lưu. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-15 — Recurring Expenses

**Mục tiêu:** Mẫu chi phí có lịch lặp.

**Nội dung hiển thị & dữ liệu:** Template, period, local due date, default split, next pending, status. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Create/edit/pause/end rule, confirm occurrence. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Due ≠ paid, past confirmed unchanged, one occurrence id per period. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: list upcoming + confirm; no infinite repeated data. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-16 — Categories & Rules

**Mục tiêu:** Quản lý danh mục.

**Nội dung hiển thị & dữ liệu:** Built-in categories, personal additions, archived, optional child category. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Add, rename, archive, remap with consent. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Không xóa category đã dùng làm orphan expense. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: simple list, desktop: edit panel. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-17 — Search & Filters

**Mục tiêu:** Tìm kiếm tài chính có quyền.

**Nội dung hiển thị & dữ liệu:** Title, date, amount, currency, payer, beneficiary, trip, category, approval, settlement. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Combine filters, save view optionally, open result. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Không lộ Private qua autocomplete, counts, filter options hoặc URL. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: filter drawer; desktop advanced filter row. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-18 — Reports & Insights

**Mục tiêu:** Báo cáo chi/tiết kiệm.

**Nội dung hiển thị & dữ liệu:** Monthly spend, budget vs actual, by category/trip, who paid, debt, fund progress. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Filter, inspect components, export data. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Label pending/confirmed, net/refund, FX coverage, visible scope. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: chart kèm text table; desktop charts and export. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-19 — Linked Expenses

**Mục tiêu:** Xem các quan hệ tài chính ngoài M07.

**Nội dung hiển thị & dữ liệu:** M03 Visit, M04 Trip/Activity/Booking, M05 Event, M06 Goal. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Link existing, open source, unlink relation theo quyền. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Unlink không xóa Expense; source access riêng; idempotent creation. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: grouped links + create/link quick action. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

### FN-20 — Permissions, Audit, Trash & Export

**Mục tiêu:** Quyền và khả năng khôi phục.

**Nội dung hiển thị & dữ liệu:** ACL details, approval history, deleted records, export jobs, audit trails. Mọi thông tin đều xác định phạm vi tài khoản/Space, trạng thái Confirmed/Pending và currency trước khi cộng hoặc trình bày; những đối tượng liên kết luôn có thông báo khi nguồn không còn quyền.

**Hành động và quyền:** Grant/revoke, view change, restore, export, confirm correction. Các thao tác ghi dữ liệu đều phải kiểm tra quyền tại lúc thực hiện; thao tác ảnh hưởng nghĩa vụ hoặc quỹ Shared phải yêu cầu người phù hợp xác nhận, không chỉ dựa trên quyền Editor chung.

**Kiểm tra / quy tắc hiển thị:** Không tự xóa vết confirmed obligations; recheck permission at delivery, restore integrity. Nội dung không đủ quyền bị ẩn cả ở giá trị, count, autocomplete, endpoint file và bản xuất. Khi không có dữ liệu, hiển thị trạng thái rỗng và đường dẫn thao tác phù hợp; khi có lỗi tải hoặc chưa đồng bộ, hiển thị rõ, không thay giá trị thật bằng 0.

**Desktop/Mobile:** Mobile: tab bảo mật và kiểm tra, đủ chức năng xuất/khôi phục. Người dùng phải hoàn thành đầy đủ nghiệp vụ P0, kể cả duyệt khoản chia, xác nhận tiền đã nhận, hoàn tiền, rút quỹ, khôi phục và export trên cả hai nhóm thiết bị.

**Điều kiện kiểm thử đặc biệt:** Tải trang bằng tài khoản A/B với rights khác nhau; thay đổi quyền giữa lúc mở form; sửa đồng thời; reload sau hành động; mở URL trực tiếp; mất kết nối giữa hai bước xác nhận; đánh giá con số khi có refund/FX hoặc pending.

# 7. Luồng thao tác và kiểm soát tổng hợp

## 7.1. Add Expense từ Private đến Shared

1. Người dùng tạo Expense tối thiểu tên, số tiền hợp lệ, Currency, Expense date, category, payer/payment và space. Mặc định Private.
2. Nếu chuyển Shared: chọn đối tượng được chia sẻ, xác nhận phát lộ những trường có liên quan; chọn người chịu chi.
3. Chọn Equal 50/50 mặc định cho A/B hoặc Fixed/Percentage/Weighted, xem preview rounding và Payment/Allocation.
4. Nếu tổng Payment/Allocation chưa khớp, chỉ lưu Draft hoặc báo lỗi; không Confirmed.
5. Gửi yêu cầu cho affected person để xác nhận đúng phiên bản. `Pending Approval` được hiển thị riêng.
6. A/B có thể approve hoặc reject phần nghĩa vụ của mình theo quyền; bên đã đồng ý không bị thay số tiền âm thầm.
7. Khi đáp ứng đủ điều kiện, Expense trở thành Confirmed; ngân sách/report dùng net expense; balances tính phần nghĩa vụ đã được duyệt.
8. Sau chỉnh sửa trọng yếu (amount, payer, split/currency) phải invalid/reconfirm approval liên quan, bảo vệ lịch sử và các settlement trước đó.

## 7.2. Ledger vs netting

Ledger vẫn thể hiện nguyên vẹn chi phí và mọi thanh toán, hoàn tiền, phân bổ. `Who owes whom` có thể bù trừ nghĩa vụ hai chiều **trong cùng đồng tiền** nhưng người dùng có thể drill down để thấy các khoản cấu thành. Net figure chưa bao gồm Pending Approvals, Pending Settlements hay khoản thiếu FX. Không một nút “Settle all” nào được phép tự tuyên bố đã nhận tiền mà không có xác nhận người nhận.

## 7.3. Refund khi đã settlement

Khi refund ghi sau settlement, tính lại net allocations theo phương án được duyệt và tạo điều chỉnh nghĩa vụ tương ứng; *không xóa* settlement đã confirmed. Ví dụ hóa đơn 600.000 VND trả bởi A, chia 50/50, B đã hoàn A 300.000; refund 100.000 về A; sau khi hai bên chốt phân bổ refund 50/50, A phải hoàn B 50.000 hoặc được bù trừ với nghĩa vụ khác. Phải nhìn thấy đầy đủ timeline của các bước.

## 7.4. Withdrawal vs Expense cho quỹ chung

Quỹ 30 triệu được rút 5 triệu thanh toán vé: **Withdrawal 5 triệu giảm balance quỹ**; **Expense vé 5 triệu ghi chi phí thực** nếu được xác nhận. Quỹ không bị cộng như một Expense thứ hai. Có thể link Withdraw↔Expense để giải thích nguồn tài trợ, nhưng không yêu cầu tự tạo expense khi rút (vì rút có thể chỉ chuyển tiền nơi giữ quỹ).

## 7.5. Recurring expense và kỳ chưa xác nhận

Mẫu có schedule và người/chia mặc định. Khi đến kỳ, sinh `candidate/pending occurrence` có định danh duy nhất per rule+period, không nhân confirmed expense. Khi nhận được bằng chứng đã chi hoặc người dùng xác nhận, mới thực hiện quy trình Expense phù hợp. Chỉnh mẫu chỉ ảnh hưởng kỳ tương lai, không tự sửa khoản confirmed quá khứ; pause/end ngăn kỳ mới.

## 7.6. Budget báo cáo theo kỳ

- Tính dựa trên confirmed net expenses thuộc scope; Pending/dự toán báo trong phần riêng.
- Một Expense có thể hiện trong budget Trip và budget ăn uống theo danh mục, nhưng khi tổng hợp toàn bộ chuyến đi chỉ đếm một Expense identity.
- Mức threshold 80/100/>100 mặc định, người dùng chỉnh được; cảnh báo không phải lệnh ngăn chi.
- Không mặc định rollover tiền còn lại sang kỳ tháng sau; không mặc định ngân sách là số tiền mặt có thật.

---

# 8. Phân quyền tài chính và sự chấp thuận của hai người

## 8.1. Phân biệt quyền nội dung và quyền xác nhận nghĩa vụ

| Hành động | Owner | Editor | Contributor | Viewer | Điều kiện đặc biệt |
|---|---|---|---|---|---|
| Xem đối tượng được phép | Có | Có | Có | Có | Kiểm field-level/file-level nếu nhạy cảm |
| Tạo Expense | Có | Theo quyền | Theo quyền | Không | Tạo mới Private mặc định |
| Sửa Draft Expense | Có | Theo quyền | Theo quyền | Không | Không tự sửa phần của người khác |
| Sửa Confirmed Expense | Qua adjustment | Qua quyền cụ thể | Không mặc định | Không | Approval affected person cho nghĩa vụ bị đổi |
| Approve/Reject allocation của B | Không thể thay B | Không thể thay B | Không thể thay B | Không thể thay B | **Chỉ B** hoặc cơ chế ủy quyền riêng chưa được chốt |
| Ghi settlement gửi | Theo quyền | Theo quyền | Theo quyền | Không | Chỉ khai nhận đã gửi, chưa tự confirmed |
| Confirm nhận settlement | Không mặc định | Không mặc định | Không mặc định | Không mặc định | **Người nhận** xác nhận |
| Contribution | Có | Theo quyền quỹ | Theo quyền quỹ | Không | Ghi đúng contributor, không giả mạo |
| Withdrawal | Theo quyền quỹ | Theo quyền quỹ | Theo quyền quỹ | Không | Confirmation policy được chốt trên quỹ |
| Quản lý ACL | Có | Chỉ nếu được ủy quyền | Không | Không | Không tự share chứng từ Private |
| Permanent deletion | Chỉ theo quy trình an toàn | Không mặc định | Không | Không | Không phá financial audit/balances |

**Mặc định:** một người có vai trò Owner của Expense không có quyền **giả xác nhận** khoản nợ do người kia phải chịu hoặc **giả xác nhận** người kia đã nhận tiền. Đây là quyền nghiệp vụ theo đúng vai trò thực tế, không thay bằng một checkbox chung `can_edit`.

## 8.2. Bảo vệ dữ liệu theo Space và tài nguyên

- Private Expenses/Savings/Budgets của A: B không thể xem title, amount, existence, count, receipt, balance hay tỷ lệ tổng hợp gián tiếp.
- Shared Expense: B được hiển thị đủ số liệu liên quan đến nghĩa vụ cần chấp thuận; nguồn phát sinh như ảnh hóa đơn, mô tả nhạy cảm cần quyền riêng và thông báo nếu không thể xem.
- Chia sẻ một Expense không được chia sẻ toàn bộ các expense khác cùng category, trip hoặc một tài liệu M02 Private.
- Kết quả Search, Chart, Export, Notification, Context Menu, URL và History phải áp ACL; không chỉ ẩn nút ở UI.
- Khi chuyển Private→Shared, preview chính xác các trường được công bố; khi thu hồi quyền, chặn truy cập tiếp theo kể cả tab đang mở và file download chưa hoàn tất nếu policy yêu cầu kiểm quyền lúc giao.
- `Our Money` hiển thị Shared data theo quyền; số liệu `Combined Visible` chỉ là tổng những gì người xem có quyền, **không** đại diện tổng tài sản của cả hai người.

## 8.3. Kiểm soát cộng tác và xung đột

- Hai người tạo Expense/Contribution độc lập: mỗi thao tác lưu riêng không ghi đè.
- Hai người sửa amount/split/payer của **cùng Expense**: kiểm tra phiên bản; bắt người dùng đọc lại sau xung đột, hiển thị old/new và reapproval khi phù hợp.
- Hai người cùng xử lý một approval/settlement: yêu cầu idempotency. Một lần chuyển tiền không được trừ balance hai lần.
- Mất kết nối: không thông báo lưu thành công, không tự xác nhận người kia đã duyệt; cho người dùng giữ nội dung form và thử lại an toàn.
- Không bắt buộc live cursor. Có thể hiển thị updated-by/last-updated để giải thích dữ liệu hiện tại.

## 8.4. Trạng thái và cảnh báo quyền trong báo cáo

- Báo cáo phải gắn trạng thái `Confirmed / Pending / Missing FX / Visible Scope`.
- Nếu không được phép xem một khoản trong tổng, không sử dụng khoản đó để suy ra tổng qua hiệu số; nếu nghiệp vụ muốn chia sẻ một **aggregated-only number**, cần quyền và chính sách riêng chưa được phê duyệt, không tự mặc định.
- Doanh số/chi phí chưa quy đổi và currency khác nhau phải được thể hiện riêng, không cho một tổng sai nghĩa.

---

# 9. Hợp đồng tích hợp xuyên phân hệ

## 9.1. M01 — Photobook & Diary

M01 có thể lưu liên kết Expense/Budget trong nhật ký hoặc sách kỷ niệm nhưng **không tự embed số tiền Private vào snapshot Shared**. Người dùng chỉ chèn dữ liệu được phép. Published Photobook của M01 có phiên bản/snapshot riêng, không được âm thầm thay trang đã xuất bản khi khoản chi M07 được điều chỉnh. Xóa Expense không tự xóa Diary/Photobook; nếu link không còn hợp lệ, hiển thị trạng thái tham chiếu an toàn.

## 9.2. M02 — Memories & Media Library

Ảnh hóa đơn/chứng từ ảnh liên kết tài sản từ M02, giữ một nguồn file, ACL asset độc lập. M02 đã quy định album Shared không tự share ảnh Private, tương tự Expense Shared không tự share hóa đơn Private. M02 chủ yếu hỗ trợ ảnh/video; PDF hóa đơn/booking cần giải pháp tài liệu chung như dependency M04 đã ghi, **không** giả định M02 mặc định hỗ trợ PDF.

## 9.3. M03 — Food & Places

- Một Place có nhiều Visit; một Visit có thể có nhiều Expense (hóa đơn ăn, phí gửi xe...). M07 chủ Expense, M03 chỉ có Expense Reference.
- Workflow `Add Expense` từ Visit: kiểm quyền, tìm/link existing hoặc tạo mới với source ID; trả Expense ID. Retry không tạo trùng.
- Chi phí của Visit tổng hợp theo Expense đã confirmed/hợp lệ và visibility của người xem. Delete Visit không cascade Expense.
- Rating hoặc số lần Visit không ảnh hưởng tự động tới Expense.

## 9.4. M04 — Travel & Trip Planner

- Trip Budget/Trip Spending đọc M07, không có sổ chi thứ hai; một Expense link nhiều Activity, Transport, Accommodation, Booking nhưng vẫn count một lần trong Trip tổng.
- Booking Cost estimate ≠ Expense Paid. Đặt cọc 500.000 cho booking 2.000.000 là giao dịch thực 500.000; phần còn lại là dự kiến/chưa thanh toán, không tự Expense 2.000.000.
- Chuyển ngày Trip hoặc hủy Booking không tự làm void Expense đã Confirmed; cần Refund/Adjustment khi thực tế phù hợp.
- Trip có thể dùng nhiều currency; rate snapshots nằm ở M07, không tự quy đổi lại theo rate hiện tại nếu không có quy tắc.

## 9.5. M05 — Couple Calendar

- Deadline đóng góp, hạn Settlement hoặc ngày đánh giá Budget có thể liên kết Calendar Event/Reminder tại M05 theo quyền. M05 là chủ Event/Reminder và bảo vệ Event Private.
- Tạo Deadline không tự tạo Payment/Contribution/Settlement thực tế; xóa Event không xóa Expense/Budget/Savings.
- Không gửi tên/số tiền Private trong notification Shared hoặc time capsule ngoài thời điểm được phép.
- M05 phải tránh Event trùng từ recurring expense rule khi sync yêu cầu được gửi lại.

## 9.6. M06 — Bucket List & Goals

- Savings Goal thuộc M07; M06 chỉ hiển thị target, confirmed balance, progress và status có quyền. Không nhập lại số dư ở M06.
- Goal `Chuẩn bị du lịch` có thể link Trip M04 và Savings Goal M07; Goal Completed của M06 không tự đóng quỹ/hoàn ngân sách; quỹ target reached không auto Completed M06.
- Nếu M07 balance thay đổi do Withdrawal/Adjustment, M06 refresh theo nguồn phù hợp và báo trạng thái stale nếu chưa đồng bộ.

## 9.7. M08 — Special Moments (chưa chốt BRD)

Ghi yêu cầu hợp đồng: quà/chi phí bất ngờ có thể là Expense Private, Special Moment được công bố về sau **không** được rò tiền qua Calendar/notification/report. Không tự tạo shared expense từ nội dung quà bất ngờ. Đợi BRD M08 chốt chi tiết Reveal/Time Capsule.

## 9.8. M09 — Couple Interaction (chưa chốt BRD)

Bình luận/tương tác gắn với Shared Expense hoặc Shared Savings có thể hữu ích để giải thích khoản chi, nhưng không tự coi reaction/comment là approval tài chính. Chỉ hành động approve/reject được thiết kế riêng mới làm thay đổi nghĩa vụ. Bình luận kế thừa quyền nội dung, không rò số liệu riêng.

## 9.9. M10 — Personalization & Settings (chưa chốt BRD)

Tiền tệ hiển thị, format ngày/tiền, quyền thông báo, timezone, bảo mật và quyền tài khoản có thể quản lý ở M10. Thay locale hoặc display currency không tự chỉnh original amount/currency. Cần xác định nơi lưu preferences và cách kiểm soát truy cập theo BRD M10 tương lai.

## 9.10. Hợp đồng Idempotency / quyền / lỗi dùng chung

1. Mỗi thao tác “Create Expense from Visit/Booking/Trip” có source identity và hành động có thể xác định, kiểm tra đã có link để `Link Existing` hoặc tránh duplication sau retry.
2. M07 là nguồn dữ liệu tài chính; caller chỉ nhận ID, summary theo quyền, state/sync result; caller không ghi số dư chính thức song song.
3. `Unlink` không `Delete`. Khi nguồn bị xóa/Private, giữ Expense và audit nhưng không hiển thị metadata nguồn nếu mất quyền.
4. Nếu đồng bộ thất bại, phía gọi và M07 phải thể hiện `not yet synced/failed`, không cùng báo thành công trái ngược.
5. Restore/backup kiểm toàn vẹn expense→allocation→approval→settlement→refund và savings movements; không chạy lại tác vụ tạo tiền như giao dịch mới.

---

# 10. 76 Business Rules đã phê duyệt

Các BR có mã ổn định để đưa vào test management; phần quy trình ở mục 5–9 là diễn giải chi tiết và không được hiểu là thêm quyết định ngược D01–D30.

## 10.1. Scope, quyền và bảo mật

| Rule ID | Yêu cầu bất biến/điều kiện | Ý tưởng kiểm thử bắt buộc |
|---|---|---|
| BR-M07-01 | Private mặc định cho Expense, Budget, Savings Goal và đối tượng tài chính mới. | Kiểm bằng dữ liệu A/B có quyền khác nhau và case số tiền/currency phù hợp. |
| BR-M07-02 | Shared Expense cần lộ đủ phần cần thiết để bên được phân bổ kiểm và xác nhận. | Kiểm bằng dữ liệu A/B có quyền khác nhau và case số tiền/currency phù hợp. |
| BR-M07-03 | Chia sẻ Expense không tự chia sẻ Expense khác cùng category/space. | Kiểm bằng dữ liệu A/B có quyền khác nhau và case số tiền/currency phù hợp. |
| BR-M07-04 | Quyền Expense, Budget, Savings Goal, chứng từ/file được kiểm tra theo từng tài nguyên. | Kiểm bằng dữ liệu A/B có quyền khác nhau và case số tiền/currency phù hợp. |
| BR-M07-05 | Không được suy ra/tiết lộ tiền Private thông qua tổng hợp hoặc báo cáo. | Kiểm bằng dữ liệu A/B có quyền khác nhau và case số tiền/currency phù hợp. |
| BR-M07-06 | Không suy ra số dư ngân hàng thật từ các giao dịch khai báo. | Kiểm bằng dữ liệu A/B có quyền khác nhau và case số tiền/currency phù hợp. |

## 10.2. Expense, Split và Approval

| Rule ID | Yêu cầu bất biến/điều kiện | Ý tưởng kiểm thử bắt buộc |
|---|---|---|
| BR-M07-07 | Tổng Expense Payment phải bằng tổng Expense đã ghi nhận là được trả. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-08 | Tổng Expense Allocation phải bằng Expense tương ứng trong currency gốc. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-09 | Payer không bắt buộc là người chịu phần chi cuối. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-10 | Một Expense có thể link nhiều đối tượng nhưng chỉ count một lần ở tổng phù hợp. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-11 | Sửa Expense confirmed phải bảo vệ history và settlement liên quan. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-12 | Bên bị ảnh hưởng phải chấp thuận nghĩa vụ Shared trước khi là confirmed debt. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-13 | Expense Rejected không tự tạo nghĩa vụ chính thức. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-14 | Expense bình thường không dùng amount âm để mô tả Refund. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-15 | Void/Delete Expense không cascade Visit/Trip/Event/tài sản liên kết. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-16 | Tổng Split Allocation bằng tổng chi trong currency gốc. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-17 | Rounding residue phải được phân bổ minh bạch và xác định. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-18 | Sửa Split phải giữ lịch sử Payment và approval liên quan. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-19 | Không tăng nợ confirmed nếu bên chịu khoản chia chưa approve. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |
| BR-M07-20 | Phân biệt Amount paid và Amount owed trong UI và report. | Kiểm bản Draft/Pending/Confirmed với cả payer/beneficiary và thao tác sửa sau approval. |

## 10.3. Settlement & Refund

| Rule ID | Yêu cầu bất biến/điều kiện | Ý tưởng kiểm thử bắt buộc |
|---|---|---|
| BR-M07-21 | Settlement không phải Expense mới và không cộng tổng chi. | Kiểm partial/full, pending/confirmed, correction và ledger nguyên bản. |
| BR-M07-22 | Settlement chưa được receiver confirmed không tự giảm nghĩa vụ. | Kiểm partial/full, pending/confirmed, correction và ledger nguyên bản. |
| BR-M07-23 | Cho phép Settlement từng phần. | Kiểm partial/full, pending/confirmed, correction và ledger nguyên bản. |
| BR-M07-24 | Idempotency: không trừ debt hai lần cho một Settlement. | Kiểm partial/full, pending/confirmed, correction và ledger nguyên bản. |
| BR-M07-25 | Settlement confirmed cần quy trình correction/reversal có audit. | Kiểm partial/full, pending/confirmed, correction và ledger nguyên bản. |
| BR-M07-26 | Net Balance không thay thế đối soát theo từng giao dịch. | Kiểm partial/full, pending/confirmed, correction và ledger nguyên bản. |
| BR-M07-27 | Không net trực tiếp khác currency nếu chưa có conversion/approval. | Kiểm partial/full, pending/confirmed, correction và ledger nguyên bản. |
| BR-M07-28 | Refund phải link Expense gốc. | Kiểm partial/full, pending/confirmed, correction và ledger nguyên bản. |
| BR-M07-29 | Tổng Refund không vượt giá trị có thể hoàn nếu không có điều chỉnh đặc biệt hợp lệ. | Kiểm partial/full, pending/confirmed, correction và ledger nguyên bản. |
| BR-M07-30 | Refund không xóa Expense hoặc settlement lịch sử. | Kiểm partial/full, pending/confirmed, correction và ledger nguyên bản. |
| BR-M07-31 | Partial Refund phải xác định allocation tới affected persons. | Kiểm partial/full, pending/confirmed, correction và ledger nguyên bản. |
| BR-M07-32 | Chi phí ròng lấy từ Expense, Refund và Adjustment hợp lệ, tránh double count. | Kiểm partial/full, pending/confirmed, correction và ledger nguyên bản. |

## 10.4. Budgets

| Rule ID | Yêu cầu bất biến/điều kiện | Ý tưởng kiểm thử bắt buộc |
|---|---|---|
| BR-M07-33 | Budget là hạn mức/dự toán chứ không là tài khoản tiền thực. | Kiểm đúng scope, period, kỳ đã đóng, refund và FX. |
| BR-M07-34 | Expense có thể thuộc nhiều Budget nhưng khi tổng hợp không nhân đôi. | Kiểm đúng scope, period, kỳ đã đóng, refund và FX. |
| BR-M07-35 | Estimate không tự thành Expense đã thanh toán. | Kiểm đúng scope, period, kỳ đã đóng, refund và FX. |
| BR-M07-36 | Budget vượt ngưỡng chỉ cảnh báo, không tự chặn Expense hợp lệ. | Kiểm đúng scope, period, kỳ đã đóng, refund và FX. |
| BR-M07-37 | Kỳ Budget có start/end/timezone/ranh giới ngày rõ. | Kiểm đúng scope, period, kỳ đã đóng, refund và FX. |
| BR-M07-38 | Sửa Budget không sửa Expense gốc hoặc settlement. | Kiểm đúng scope, period, kỳ đã đóng, refund và FX. |
| BR-M07-39 | Không đưa Expense Private vào số liệu Budget Shared để lộ quyền. | Kiểm đúng scope, period, kỳ đã đóng, refund và FX. |
| BR-M07-40 | Chốt kỳ Budget phải giữ lịch sử số và correction. | Kiểm đúng scope, period, kỳ đã đóng, refund và FX. |

## 10.5. Savings

| Rule ID | Yêu cầu bất biến/điều kiện | Ý tưởng kiểm thử bắt buộc |
|---|---|---|
| BR-M07-41 | Savings Goal có thể có hoặc không có deadline. | Kiểm contributions/withdrawals/adjustments, confirmation, quyền và balance. |
| BR-M07-42 | Target Amount có currency và giá trị hợp lệ. | Kiểm contributions/withdrawals/adjustments, confirmation, quyền và balance. |
| BR-M07-43 | Savings balance tính từ starting, contributions, withdrawals, adjustments confirmed. | Kiểm contributions/withdrawals/adjustments, confirmation, quyền và balance. |
| BR-M07-44 | Pending Contribution không được coi là saldo confirmed. | Kiểm contributions/withdrawals/adjustments, confirmation, quyền và balance. |
| BR-M07-45 | Withdrawal tuân thủ quyền và approval, đặc biệt quỹ Shared. | Kiểm contributions/withdrawals/adjustments, confirmation, quyền và balance. |
| BR-M07-46 | Contribution và Withdrawal không tự thành Expense. | Kiểm contributions/withdrawals/adjustments, confirmation, quyền và balance. |
| BR-M07-47 | Savings Goal link M06/M04 không tạo số dư thứ hai. | Kiểm contributions/withdrawals/adjustments, confirmation, quyền và balance. |
| BR-M07-48 | Target reached không tự Completed/quỹ đóng. | Kiểm contributions/withdrawals/adjustments, confirmation, quyền và balance. |
| BR-M07-49 | Đổi target cần lưu vết target cũ. | Kiểm contributions/withdrawals/adjustments, confirmation, quyền và balance. |
| BR-M07-50 | Contribution history không tự biểu thị quyền sở hữu tài sản. | Kiểm contributions/withdrawals/adjustments, confirmation, quyền và balance. |
| BR-M07-51 | Withdrawal không vượt số dư có thể rút trừ khi có adjustment policy đặc biệt. | Kiểm contributions/withdrawals/adjustments, confirmation, quyền và balance. |
| BR-M07-52 | Số dư tiết kiệm không được giới thiệu là bank-verified. | Kiểm contributions/withdrawals/adjustments, confirmation, quyền và balance. |

## 10.6. Recurring & FX

| Rule ID | Yêu cầu bất biến/điều kiện | Ý tưởng kiểm thử bắt buộc |
|---|---|---|
| BR-M07-53 | Recurring Rule không tự xác nhận Expense đã trả. | Kiểm xử lý lặp/retry hoặc conversion/missing rates và dữ liệu gốc. |
| BR-M07-54 | Mỗi occurrence có id ổn định, không sinh trùng khi retry. | Kiểm xử lý lặp/retry hoặc conversion/missing rates và dữ liệu gốc. |
| BR-M07-55 | Sửa template không sửa Expense confirmed quá khứ. | Kiểm xử lý lặp/retry hoặc conversion/missing rates và dữ liệu gốc. |
| BR-M07-56 | Pause/End recurring rule ngăn tạo future occurrences không hợp lệ. | Kiểm xử lý lặp/retry hoặc conversion/missing rates và dữ liệu gốc. |
| BR-M07-57 | Mỗi Amount chính thức có Currency. | Kiểm xử lý lặp/retry hoặc conversion/missing rates và dữ liệu gốc. |
| BR-M07-58 | Không cộng trực tiếp Amount khác currency. | Kiểm xử lý lặp/retry hoặc conversion/missing rates và dữ liệu gốc. |
| BR-M07-59 | FX rate snapshot ghi phương pháp/nguồn và ngày. | Kiểm xử lý lặp/retry hoặc conversion/missing rates và dữ liệu gốc. |
| BR-M07-60 | Original amount/currency không biến mất sau conversion. | Kiểm xử lý lặp/retry hoặc conversion/missing rates và dữ liệu gốc. |
| BR-M07-61 | Missing FX làm báo cáo chưa đủ dữ liệu, không âm thầm loại khoản chi. | Kiểm xử lý lặp/retry hoặc conversion/missing rates và dữ liệu gốc. |
| BR-M07-62 | Settlement khác currency phải có conversion đồng thuận hai bên. | Kiểm xử lý lặp/retry hoặc conversion/missing rates và dữ liệu gốc. |

## 10.7. Cross-module & Audit

| Rule ID | Yêu cầu bất biến/điều kiện | Ý tưởng kiểm thử bắt buộc |
|---|---|---|
| BR-M07-63 | M07 sở hữu Expense/Split/Settlement/Budget/Savings làm nguồn tiền chính thức. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-64 | M03/M04/M06 không tạo sổ chi hoặc balance độc lập. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-65 | Không nhân đôi Expense dù có nhiều cross-module links. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-66 | Xóa đối tượng nguồn không tự xóa Expense confirmed. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-67 | Shared linked item không tự cho xem tài chính Private. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-68 | Cross-module creation có identity/chống retry duplicate. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-69 | Dữ liệu confirmed có audit trail đủ để trace. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-70 | Không đơn phương xóa dấu vết debt hoặc Settlement đã confirmed. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-71 | Revocation ngăn truy cập mới kể cả form đang mở. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-72 | Trash và Export kiểm quyền đầy đủ. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-73 | Restore không duplicate Expense/Settlement/Contribution. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-74 | Report phân biệt confirmed/pending/estimate/missing FX. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-75 | Lưu/approve/settle phải phản hồi đúng trạng thái, không false success. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |
| BR-M07-76 | Cập nhật ảnh hưởng nghĩa vụ người kia phải xử lý conflict và approval cũ. | Kiểm cross-link, rò quyền, idempotency, audit, restore và trạng thái lỗi. |

## 10.8. Ưu tiên giải quyết va chạm quy tắc

Trước khi triển khai, nếu thấy thiếu quy trình xác nhận cụ thể (ví dụ một Refund làm thay đổi nghĩa vụ đã settle) hoặc giới hạn công nghệ khiến không giữ được tính toàn vẹn, phải đưa vào issue cho Product Owner. Không giảm mức kiểm soát còn thiếu bằng cách tự coi thao tác từ Owner là chấp thuận của Partner. Nếu một đoạn mô tả UX dường như khác BR được duyệt, lấy D/BR và ví dụ đối soát làm nguồn kiểm chứng, báo lại xung đột.

---

# 11. 22 Use Cases có thể triển khai và nghiệm thu

| ID | Use Case | Mục tiêu/đầu ra |
|---|---|---|
| UC-M07-01 | Create Private Expense | Một Expense confirmed; B không tìm thấy, không biết tổng/số tiền; không tạo allocation B |
| UC-M07-02 | Create Shared Expense | Expense confirmed một lần; B→A 300.000 confirmed; total spend 600.000 |
| UC-M07-03 | Split Expense Equally | Allocation nguyên đồng tổng đúng 101.001, ví dụ 50.501+50.500; payer independent |
| UC-M07-04 | Split Expense Unequally | Mỗi cách đều cho đúng tổng 1.000.000; sửa cách chia không phá payment đã nhập |
| UC-M07-05 | Multiple Payers | Chỉ một Expense 1 triệu, B→A 200.000 sau duyệt |
| UC-M07-06 | Approve or Reject Allocation | Không xuất hiện confirmed debt khi B từ chối; chỉ duyệt phiên bản mới |
| UC-M07-07 | View Shared Balance | Net chính xác, vẫn xem original obligations, không cộng pending/FX khác loại |
| UC-M07-08 | Record Partial Settlement | Balance confirmed vẫn 500.000 trước receiver confirm; hiển thị pending settlement 200.000 riêng |
| UC-M07-09 | Confirm Settlement | Remaining 300.000; ledger expense gốc không thay; lần confirm thứ hai không trừ lại |
| UC-M07-10 | Record Partial Refund | Chi ròng 500.000; A→B 50.000 nếu settlement gốc đã đủ; giữ lịch sử 600.000 và 300.000 |
| UC-M07-11 | Adjust Confirmed Expense | History before/after/actor/reason; approval old không tái dùng sai |
| UC-M07-12 | Create Monthly Budget | Usage đúng net expenses, có nhãn pending; không coi 4 triệu là tiền có sẵn |
| UC-M07-13 | Create Trip Budget | Một nguồn số tổng M07; Expense link booking+activity cùng Trip chỉ count một lần |
| UC-M07-14 | Create Savings Goal | Quỹ hiển thị 0 hoặc starting balance đã khai báo, không có kết nối ngân hàng |
| UC-M07-15 | Contribute to Savings | Confirmed balance +2 triệu đúng một lần; M06 linked progress refresh |
| UC-M07-16 | Withdraw from Savings | Một Withdrawal giảm savings 5 triệu, một Expense ghi chi phí vé 5 triệu nếu có; không đếm thành 10 triệu expense |
| UC-M07-17 | Link Savings Goal to M06 | M06 không tạo second savings balance; rút tiền đổi số liệu trên M06 |
| UC-M07-18 | Create Recurring Expense | Chỉ một candidate/kỳ; Confirmed mới là Expense thực; đổi rule không sửa kỳ đã confirmed |
| UC-M07-19 | Record Multi-currency Expense | Original JPY giữ nguyên; tỷ giá/date/source rõ; tổng báo cáo không lẫn VND và JPY |
| UC-M07-20 | Link Expense to Visit/Trip | Một Expense ID dù nhiều links; tổng chi Trip và global không nhân đôi |
| UC-M07-21 | Export & Restore Financial Data | Số Expense/Refund/Settlement/Contribution và net balances trước/sau khớp; không duplicate |
| UC-M07-22 | Concurrent Financial Edits | Không ghi đè silent; sum payment/allocation hợp lệ; B chỉ approve nghĩa vụ phiên bản đúng |

## 11.1. Đặc tả kịch bản chi tiết

### UC-M07-01 — Create Private Expense

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** A có quyền tạo Expense cá nhân; chưa ghi khoản tương tự.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. A mở FN-03.
  2. Điền “Taxi”, 120.000 VND, ngày, category, payer A.
  3. Giữ Private.
  4. Chọn Confirm.
  5. Mở Ledger và Report cá nhân.
- **Hậu điều kiện:** Một Expense confirmed; B không tìm thấy, không biết tổng/số tiền; không tạo allocation B.
- **Ngoại lệ/nhánh:** Thiếu currency/số tiền hoặc save lỗi → không xác nhận..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-02 — Create Shared Expense

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** A trả 600.000 VND bữa tối, cả A/B chia đều.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. A nhập expense, Payer A 600.000.
  2. Chuyển Shared có xác nhận chia sẻ.
  3. Chọn Equal A/B.
  4. Preview allocation 300.000 mỗi bên.
  5. Gửi B duyệt.
  6. B approve phiên bản này.
- **Hậu điều kiện:** Expense confirmed một lần; B→A 300.000 confirmed; total spend 600.000.
- **Ngoại lệ/nhánh:** B Reject hoặc sửa amount trước approve → Pending/Rejected, không debt confirmed..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-03 — Split Expense Equally

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** Expense có 2 beneficiary và total hợp lệ.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. Chọn Equal trên hóa đơn 101.001 VND.
  2. Áp policy phần dư.
  3. Xem preview.
  4. Hai bên duyệt khi cần.
- **Hậu điều kiện:** Allocation nguyên đồng tổng đúng 101.001, ví dụ 50.501+50.500; payer independent.
- **Ngoại lệ/nhánh:** Thiếu payer/precision không hợp lệ → chưa confirm..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-04 — Split Expense Unequally

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** Expense shared có total 1.000.000 VND.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. Lần lượt thử Fixed 700.000/300.000.
  2. Percentage 70/30.
  3. Weighted 7:3.
  4. Xem allocated value và rounding.
  5. Duyệt theo phiên bản.
- **Hậu điều kiện:** Mỗi cách đều cho đúng tổng 1.000.000; sửa cách chia không phá payment đã nhập.
- **Ngoại lệ/nhánh:** Tỷ lệ không đủ 100, fixed không khớp, weight 0/0 → cảnh báo..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-05 — Multiple Payers

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** Hóa đơn 1 triệu, A/B cùng chi.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. A nhập payment A 700.000, B 300.000.
  2. Chọn allocation A/B mỗi người 500.000.
  3. Gửi confirmation liên quan.
- **Hậu điều kiện:** Chỉ một Expense 1 triệu, B→A 200.000 sau duyệt.
- **Ngoại lệ/nhánh:** Payment totals lệch Expense → chặn confirmed..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-06 — Approve or Reject Allocation

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** B được gán obligation trên Shared Expense.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. B xem chi tiết amount, người trả, share.
  2. Chọn Reject có lý do.
  3. A thay đúng amount và gửi lại.
  4. B Approve phiên bản mới.
- **Hậu điều kiện:** Không xuất hiện confirmed debt khi B từ chối; chỉ duyệt phiên bản mới.
- **Ngoại lệ/nhánh:** Người tạo A không thể approve thay B; stale approval bị từ chối..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-07 — View Shared Balance

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** Có nhiều Expense/Settlement confirmed cùng currency.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. A mở FN-06.
  2. Hệ thống tính B→A 300.000 và A→B 100.000.
  3. Net B→A 200.000.
  4. Drill down từng nguồn.
- **Hậu điều kiện:** Net chính xác, vẫn xem original obligations, không cộng pending/FX khác loại.
- **Ngoại lệ/nhánh:** Thiếu quyền khoản Private: không lộ khoản đó hoặc qua hiệu số..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-08 — Record Partial Settlement

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** B phải hoàn A 500.000 confirmed.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. B ghi chuyển A 200.000 qua phương thức đã chọn.
  2. Chọn link nghĩa vụ.
  3. Submit Pending.
- **Hậu điều kiện:** Balance confirmed vẫn 500.000 trước receiver confirm; hiển thị pending settlement 200.000 riêng.
- **Ngoại lệ/nhánh:** Lưu lại form cùng id → không nhân settlement..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-09 — Confirm Settlement

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** Có Pending Settlement 200.000 B→A.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. A mở FN-07, kiểm giao dịch, Confirm Received.
  2. Trạng thái confirmed.
  3. Đối soát cập nhật.
- **Hậu điều kiện:** Remaining 300.000; ledger expense gốc không thay; lần confirm thứ hai không trừ lại.
- **Ngoại lệ/nhánh:** A báo không nhận → không xác nhận, dispute/correction giữ audit..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-10 — Record Partial Refund

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** A trả 600.000 shared và B đã settle phần 300.000.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. A ghi Refund 100.000 nhận từ nhà hàng.
  2. Chọn allocation 50/50, gửi confirm nếu ảnh hưởng B.
  3. Sau duyệt refresh net balances.
- **Hậu điều kiện:** Chi ròng 500.000; A→B 50.000 nếu settlement gốc đã đủ; giữ lịch sử 600.000 và 300.000.
- **Ngoại lệ/nhánh:** Refund > refundable amount, missing approval → chưa effective..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-11 — Adjust Confirmed Expense

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** Một Expense Confirmed có Split và Settlement.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. Owner mở Edit → Request Adjustment.
  2. Preview trước/sau amount/payer/allocations.
  3. Giữ settlement gốc.
  4. Gửi involved person xác nhận.
  5. Chốt lại balance.
- **Hậu điều kiện:** History before/after/actor/reason; approval old không tái dùng sai.
- **Ngoại lệ/nhánh:** Dữ liệu stale hoặc contributor từ chối → không silently replace confirmed record..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-12 — Create Monthly Budget

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** A muốn hạn mức date nights 4 triệu trong tháng.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. Tạo Budget Monthly VND, scope category/space, start/end theo tháng lịch, alert 80/100.
  2. Gắn Expense đã confirm.
  3. Xem usage.
- **Hậu điều kiện:** Usage đúng net expenses, có nhãn pending; không coi 4 triệu là tiền có sẵn.
- **Ngoại lệ/nhánh:** Tháng mới không tự rollover số còn; missing currency không thể tổng hợp..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-13 — Create Trip Budget

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** M04 đã có Trip Đà Lạt.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. Từ M04 hoặc FN-09 tạo Trip Budget 8 triệu.
  2. Chọn Trip ref.
  3. Thêm/link expense khách sạn, ăn uống, booking.
  4. Refresh M04.
- **Hậu điều kiện:** Một nguồn số tổng M07; Expense link booking+activity cùng Trip chỉ count một lần.
- **Ngoại lệ/nhánh:** Trip bị xóa/hủy: không tự void expense; nguồn link báo unavailable..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-14 — Create Savings Goal

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** A tạo quỹ Nhật 30 triệu VND.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. Điền name/target/currency, cho date tùy chọn.
  2. Chọn Private hoặc chia B.
  3. Rule contributions/withdrawals.
  4. Active.
- **Hậu điều kiện:** Quỹ hiển thị 0 hoặc starting balance đã khai báo, không có kết nối ngân hàng.
- **Ngoại lệ/nhánh:** Target 0/negative → không Active; Private vẫn riêng..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-15 — Contribute to Savings

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** Quỹ Shared Active, A muốn ghi góp 2 triệu.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. A chọn Contribute, nhập amount/currency/date/method.
  2. Ghi đúng contributor.
  3. Theo policy quỹ submit/confirm.
- **Hậu điều kiện:** Confirmed balance +2 triệu đúng một lần; M06 linked progress refresh.
- **Ngoại lệ/nhánh:** Pending không tăng confirmed; submit retry không nhân tiền..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-16 — Withdraw from Savings

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** Quỹ VND có balance confirmed 30 triệu.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. A request withdraw 5 triệu, nhập reason.
  2. Người có quyền confirm.
  3. Balance còn 25 triệu.
  4. Tùy chọn link Expense vé 5 triệu.
- **Hậu điều kiện:** Một Withdrawal giảm savings 5 triệu, một Expense ghi chi phí vé 5 triệu nếu có; không đếm thành 10 triệu expense.
- **Ngoại lệ/nhánh:** Rút > available balance → chặn; thiếu approval Shared → pending..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-17 — Link Savings Goal to M06

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** M06 có Goal chuẩn bị chuyến Nhật.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. Người có quyền chọn Link Existing Savings Goal.
  2. Cấp/kiểm quyền đúng.
  3. M06 hiển thị target, progress và currency từ M07.
- **Hậu điều kiện:** M06 không tạo second savings balance; rút tiền đổi số liệu trên M06.
- **Ngoại lệ/nhánh:** M06 user không được xem quỹ → không hiển thị số dư qua link..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-18 — Create Recurring Expense

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** Hai người có phí dịch vụ định kỳ mỗi tháng.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. Tạo rule 200.000 VND/ngày 5 hàng tháng.
  2. Kỳ đầu đến hạn hiển thị Pending Candidate.
  3. Người dùng xác nhận có chi.
  4. Lần sau xử lý lại rule.
- **Hậu điều kiện:** Chỉ một candidate/kỳ; Confirmed mới là Expense thực; đổi rule không sửa kỳ đã confirmed.
- **Ngoại lệ/nhánh:** Người dùng pause/end rule → không có candidate tương lai chưa hợp lệ..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-19 — Record Multi-currency Expense

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** Trip M04 ở nước ngoài, Expense 10.000 JPY.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. Nhập original JPY, liên kết Trip.
  2. Thêm rate snapshot do người dùng xác nhận khi cần report VND.
  3. Xem báo cáo trong source currency và converted.
- **Hậu điều kiện:** Original JPY giữ nguyên; tỷ giá/date/source rõ; tổng báo cáo không lẫn VND và JPY.
- **Ngoại lệ/nhánh:** Missing FX → cảnh báo incomplete, không tự lấy tỷ giá tưởng tượng..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-20 — Link Expense to Visit/Trip

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** Visit M03 và Trip M04 tham chiếu cùng bữa tối.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. Từ M03 tạo Expense một lần.
  2. M04 chọn Link Existing cho Booking/Activity.
  3. Mở FN-19 xem các nguồn.
- **Hậu điều kiện:** Một Expense ID dù nhiều links; tổng chi Trip và global không nhân đôi.
- **Ngoại lệ/nhánh:** Source bị xóa/Private → giữ Expense nhưng không lộ nội dung..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-21 — Export & Restore Financial Data

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** A yêu cầu xuất và thử phục hồi bộ dữ liệu test.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. Chọn kỳ và scope theo quyền.
  2. Export CSV/structured với original currencies/rates/status/audit.
  3. Backup test.
  4. Restore.
  5. Reconcile balances và links.
- **Hậu điều kiện:** Số Expense/Refund/Settlement/Contribution và net balances trước/sau khớp; không duplicate.
- **Ngoại lệ/nhánh:** Nếu thiếu dữ liệu linked, báo partial restore; không tiết lộ Partner Private..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

### UC-M07-22 — Concurrent Financial Edits

- **Tác nhân:** Tài khoản A và/hoặc B có quyền với Expense/Budget/Savings/Settlement tương ứng; người bị tác động xác nhận bằng tài khoản riêng.
- **Tiền điều kiện:** A/B cùng sửa shared confirmed expense.
- **Trigger:** Người dùng mở đúng màn hình M07 hoặc chức năng liên kết từ M03/M04/M06 và thực hiện thao tác.
- **Luồng chính:**
  1. A đổi total, B đổi weighted split từ version cũ.
  2. Server xử lý version conflict, preview reallocation và reset approvals cần thiết.
- **Hậu điều kiện:** Không ghi đè silent; sum payment/allocation hợp lệ; B chỉ approve nghĩa vụ phiên bản đúng.
- **Ngoại lệ/nhánh:** Mất mạng hoặc revoke editor → báo chưa lưu/không đủ quyền; dữ liệu confirmed cũ không hỏng..
- **Dữ liệu cần QA kiểm tra:** amount/currency gốc; confirmed và pending tách biệt; người được quyền approve; timestamps và lịch sử; thao tác retry/reload; không double count trong report; hai tài khoản và cả desktop/mobile.

# 12. 50 trường hợp ngoại lệ (Exception Catalogue)

| ID | Tình huống | Hành vi bắt buộc |
|---|---|---|
| EX-M07-01 | Expense thiếu tên | Validate bắt buộc; giữ draft form chưa hợp lệ, không confirmed. |
| EX-M07-02 | Expense amount 0 hoặc âm | Không tạo Expense thường; gợi ý đúng Refund/Adjustment. |
| EX-M07-03 | Thiếu Currency | Yêu cầu chọn trước khi Confirm; không mặc định âm thầm. |
| EX-M07-04 | Không rõ người đã trả | Không cho confirmed Payment; có thể lưu Draft. |
| EX-M07-05 | Tổng Payment khác tổng hóa đơn | Highlight chênh lệch và không chốt. |
| EX-M07-06 | Tổng Allocation khác tổng | Không được confirm split; giữ giá trị đã nhập để sửa. |
| EX-M07-07 | Equal Split tạo phần dư | Phân bổ minor units xác định và cho xem trước. |
| EX-M07-08 | Partner chưa duyệt | Pending, không cộng confirmed debt. |
| EX-M07-09 | Partner từ chối | Rejected, ghi lý do nếu có; không chốt nghĩa vụ. |
| EX-M07-10 | Expense đang Pending | Hiển thị riêng trong báo cáo và không mập mờ confirmed. |
| EX-M07-11 | Sửa amount sau khi split | Recalculate và yêu cầu approve lại affected persons. |
| EX-M07-12 | Đổi Payer sau Settlement | Giữ Settlement lịch sử, tạo adjustment hợp lệ. |
| EX-M07-13 | Một Expense có hai Payer | Kiểm sum payments, xác định net nghĩa vụ đúng. |
| EX-M07-14 | Một người chịu 100%, người khác trả | Xác định reimbursement đầy đủ sau approve. |
| EX-M07-15 | Gửi lại request tạo Expense | Idempotent, không tạo bản thứ hai. |
| EX-M07-16 | Hai Expense có vẻ trùng | Cảnh báo hợp lý, không tự gộp khi không chắc. |
| EX-M07-17 | Settlement Pending | Không tự giảm confirmed balance. |
| EX-M07-18 | Settlement trả một phần | Còn đúng số unpaid, status partial. |
| EX-M07-19 | Settlement vượt số nợ | Cảnh báo và yêu cầu cách xử lý/điều chỉnh hợp lệ. |
| EX-M07-20 | Settlement confirm nhầm | Correction/reversal có audit, tính lại debt. |
| EX-M07-21 | Một chuyển khoản được ghi hai Settlement | Phát hiện nghi trùng, không auto deduct lần hai. |
| EX-M07-22 | Refund vượt amount có thể hoàn | Không Confirm, chỉ nhận adjustment có chính sách duyệt. |
| EX-M07-23 | Refund sau khi đã settle | Tạo obligation điều chỉnh, không xóa settlement cũ. |
| EX-M07-24 | Phí hủy đã nằm trong số không hoàn | Không thêm phí lần nữa vào Expense. |
| EX-M07-25 | Expense thuộc nhiều Budget | Một Expense identity trong tổng tương ứng, không nhân đôi. |
| EX-M07-26 | Budget vượt giới hạn | Cảnh báo nhưng vẫn cho expense hợp lệ. |
| EX-M07-27 | Expense cuối tháng | Áp đúng kỳ theo ngày/timezone đã cấu hình. |
| EX-M07-28 | Điều chỉnh Budget kỳ đã chốt | Version và audit, không rewrite lịch sử silently. |
| EX-M07-29 | Trip nguồn bị xóa | Expense confirmed vẫn tồn tại; link cảnh báo. |
| EX-M07-30 | Visit nguồn bị xóa | Expense vẫn được bảo vệ, không leak source Private. |
| EX-M07-31 | Savings target 0 hoặc âm | Không cho Active; cho chỉnh Draft. |
| EX-M07-32 | Contribution Pending | Không cộng confirmed balance. |
| EX-M07-33 | Contribution retry/trùng | Không tăng quỹ lần thứ hai. |
| EX-M07-34 | Withdrawal vượt available balance | Chặn/trả lỗi hợp lý theo policy quỹ. |
| EX-M07-35 | Withdrawal để mua vé | Không tự tính thành expense thứ hai. |
| EX-M07-36 | Quỹ đạt target | Target Reached, không tự Completed. |
| EX-M07-37 | Đổi target sau nhiều Contribution | Giữ movements và version target. |
| EX-M07-38 | Xóa Savings Goal có movement | Không phá audit hoặc số dư cần đối soát. |
| EX-M07-39 | Recurring candidate chưa thực trả | Pending, không vào actual spending. |
| EX-M07-40 | Recurring được xử lý nhiều lần | Một candidate/period, no duplicates. |
| EX-M07-41 | Expense ngoại tệ thiếu FX | Giữ original, báo tổng converted chưa đủ. |
| EX-M07-42 | Tỷ giá thay đổi | Original preserved, rate snapshot traceable. |
| EX-M07-43 | Settlement bằng currency khác | Không auto reconcile khi chưa có approved conversion. |
| EX-M07-44 | Shared Expense có Private Receipt | Không tự share chứng từ; báo rõ giới hạn quyền. |
| EX-M07-45 | Search/Reports có dữ liệu Private | Không lộ title/amount/count/aggregate. |
| EX-M07-46 | Thu hồi quyền khi tab còn mở | Chặn write mới và download khi recheck. |
| EX-M07-47 | A/B cùng sửa Split | Conflict guard, không chốt inconsistent sums. |
| EX-M07-48 | Mất mạng khi đang Save | Không báo success giả; giữ form/retry an toàn. |
| EX-M07-49 | Restore Expense/Settlement cùng quan hệ | Không duplicate hoặc lệch balances. |
| EX-M07-50 | Export nhiều rights/currencies | Phạm vi chính xác, metadata đầy đủ, không trộn tiền. |

## 12.1. Mẫu xử lý lỗi chung

1. Xác định lỗi validation/quyền/đồng bộ/xung đột số liệu/dữ liệu ngoài phạm vi.
2. Không commit trạng thái Confirmed, Settlement Received hoặc Movement Confirmed khi không đáp ứng điều kiện.
3. Hiển thị giá trị gây lỗi, cách sửa và bản dữ liệu đã ghi được nếu có; tuyệt đối không tuyên bố “Đã lưu” khi chưa kiểm chứng.
4. Với thao tác có thể retry: giữ transaction identity và kiểm tra có xử lý trước đó chưa, để không tạo double expense/settlement/contribution.
5. Với dữ liệu tài chính Shared: chỉ đưa vào báo cáo nghĩa vụ confirmed sau khi quyền, phiên bản và confirmation hợp lệ; log audit theo đúng người.
6. Khi tham chiếu M03/M04/M05/M06 thiếu: giữ bản ghi tài chính gốc và ghi nhận link unavailable, không tự truy cập bằng quyền liên kết.

---

# 13. 85 Acceptance Criteria — kết quả kiểm chứng được

**Chuẩn chung:** Given một tài khoản A/B và dữ liệu đầu vào/ACL đã biết; When thực hiện thao tác ghi hoặc đọc; Then đối chiếu số tiền, trạng thái, quyền, nguồn link, audit và kết quả sau reload. Mỗi AC chạy ít nhất trên desktop/mobile cho nghiệp vụ P0 và negative case khi đặc biệt nhạy cảm.

## 13.1. Expense Management

| Mã | Given / When: tình huống | Then: kết quả bắt buộc | Thiết lập kiểm thử |
|---|---|---|---|
| AC-M07-01 | Create Private Expense | Khi A tạo Expense đủ dữ liệu, record lưu Private; B không thấy ở Ledger/Search/Reports. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-02 | Expense thiếu tên | Không xác nhận; chỉ ra title cần nhập. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-03 | Expense amount 0/âm | Từ chối Expense thường; không coi đó là Refund. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-04 | Original Currency | Giữ đúng mã tiền gốc ở ledger, detail, report/export. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-05 | Một Payer | Payment phản ánh đúng A hoặc B trả toàn bộ, không đồng nhất với beneficiary. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-06 | Hai Payer | Cho nhập A/B, tổng payment khớp Expense, không nhân bản. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-07 | Receipt M02 | Liên kết đúng media asset; không upload original lần nữa; có ACL file. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-08 | M03 Visit link | Expense ID hiện đúng ở Visit Detail theo quyền; delete link không xóa Expense. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-09 | M04 Trip link | Trip đọc summary cùng Expense ID; không tạo ledger M04. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-10 | Nhiều nguồn link | Một Expense dù liên kết nhiều Activity/Visit/Trip vẫn chỉ count một lần ở tổng. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-11 | Shared Expense B chưa approve | Không xuất hiện như confirmed debt của B. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-12 | B Reject | Pending/Rejected có dấu vết, không ghi nợ accepted. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-13 | Edit Confirmed Expense | Hiển thị before/after và lấy lại approvals bị ảnh hưởng; settlement lịch sử nguyên vẹn. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-14 | Void Expense | Không nằm ở actual spend hiện hành nhưng có audit; không cascade Place/Visit. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |

## 13.2. Split & Settlement

| Mã | Given / When: tình huống | Then: kết quả bắt buộc | Thiết lập kiểm thử |
|---|---|---|---|
| AC-M07-15 | Equal Split | Allocation tổng chính xác theo minor units, 50/50 với residue có rule. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-16 | Fixed Amount | Chặn nếu tổng từng phần không bằng Expense; khi hợp lệ giữ đúng số đã phân bổ. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-17 | Percentage Split | Tính % đúng; tổng phải 100%; rounding minh bạch. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-18 | Weighted Split | Tính tỷ lệ theo shares dương, tổng bằng Expense. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-19 | Rounding residue | Ví dụ 101.001 VND chia đôi không mất 1 VND; có preview. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-20 | A trả hộ B | Sau approval, nghĩa vụ đúng chiều và đúng tổng. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-21 | A/B cùng trả | 700.000/300.000 paid và 500.000/500.000 allocations dẫn tới B→A 200.000. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-22 | Netting ngược chiều | Hai nghĩa vụ cùng currency đối chiều được net chính xác, vẫn drill down khoản gốc. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-23 | Partial Settlement | Receiver confirm 200.000 của debt 500.000 → còn 300.000. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-24 | Pending Settlement | Không làm giảm confirmed debt cho tới khi receiver confirm. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-25 | Receiver confirmation | Chỉ tài khoản người nhận hợp lệ được xác nhận đã nhận. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-26 | Settlement idempotency | Gửi lại cùng settlement/confirmation không trừ debt hai lần. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-27 | Correct Confirmed Settlement | Correction có audit, balance tính lại; không xóa lịch sử. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-28 | Partial Refund | Net expense giảm theo refund đã confirmed; allocation effect đúng theo đồng thuận. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-29 | Refund after Settlement | Giữ settlement gốc, tính nghĩa vụ hoàn ngược nếu phù hợp. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |
| AC-M07-30 | Cancellation fee | Phần không hoàn là net cost; không sinh fee expense trùng. | Chuẩn bị 2 tài khoản và currency/amount khác nhau; chạy thao tác rồi kiểm chứng sau reload. |

## 13.3. Budgets & Reports

| Mã | Given / When: tình huống | Then: kết quả bắt buộc | Thiết lập kiểm thử |
|---|---|---|---|
| AC-M07-31 | Monthly Budget | Lưu kỳ tháng lịch/amount/currency và scope, usage từ Expense confirmed. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-32 | Category Budget | Chọn đúng category; không kéo expense ngoài scope. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-33 | Trip Budget | Liên kết Trip M04, số hiển thị cùng nguồn M07. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-34 | One Expense in many Budgets | Trong tổng hợp riêng một scope chỉ count Expense một lần. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-35 | 80% budget alert | Khi vượt ngưỡng tùy chọn, hiển thị cảnh báo đúng (không chặn ghi chi). | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-36 | 100%/>100% alert | Hiển thị đã tới/vượt giới hạn và giá trị còn lại/vượt chính xác. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-37 | Expense over Budget | Nếu Expense hợp lệ vẫn ghi nhận, chỉ cảnh báo. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-38 | Estimate vs Expense | M04 estimate hoặc Budget không tự biến thành khoản đã thanh toán. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-39 | Close Budget period | Giữ lịch sử kỳ, corrections được kiểm soát, không rollover mặc định. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-40 | Refund affects Budget | Budget dùng net expense phù hợp, giảm sử dụng khi refund confirmed. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-41 | Category Spending report | Tổng từng category khớp unique confirmed net expenses theo quyền. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-42 | Trip Spending report | Một Expense liên kết Booking+Activity cùng Trip chỉ count một lần. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-43 | Missing FX report | Báo tổng currency converted chưa đầy đủ, không cộng lẫn currency gốc. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |
| AC-M07-44 | B reporting vs A Private | Không tiết lộ Expense Private của A bằng số/đếm/search/aggregate. | Kiểm thử cả Pending/Confirmed/Refund và các phạm vi report/currency khác nhau. |

## 13.4. Savings & Contributions

| Mã | Given / When: tình huống | Then: kết quả bắt buộc | Thiết lập kiểm thử |
|---|---|---|---|
| AC-M07-45 | Create Personal Savings | Quỹ mới Private, target/currency hợp lệ và không bank-verified. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-46 | Create Shared Savings | A/B được cấp đúng quyền với quỹ chung, không lộ quỹ cá nhân khác. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-47 | Invalid Target | Target 0/âm không Active, không chia cho 0 khi tính progress. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-48 | Confirmed Contribution | Balance tăng đúng amount sau confirmation policy. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-49 | Pending Contribution | Balance confirmed chưa tăng; trạng thái pending tách riêng. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-50 | Idempotent Contribution | Submit/confirm retry chỉ tăng balance một lần. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-51 | Confirmed Withdrawal | Balance giảm chính xác theo amount/currency. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-52 | Excess Withdrawal | Chặn vượt available balance theo rule đã duyệt. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-53 | Withdrawal funds Expense | Có link và hai nghiệp vụ; total spending chỉ tính Expense thực. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-54 | Savings over target | Hiển thị >100% giá trị thực, thanh progress có thể đầy. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-55 | Target Reached | Không tự Completed nếu chưa xác nhận hoàn thành. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-56 | Change Target | Giữ target trước đó trong history, không sửa movement. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-57 | Track A/B contributions | Contributions gắn đúng contributor; không tự suy ownership. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-58 | Link M06 Goal | M06 hiển thị balance từ M07 mà không duy trì số dư riêng. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-59 | Link M04 Trip | Không tạo quỹ trùng khi link vào Trip. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |
| AC-M07-60 | Archive Savings | Lịch sử Contribution/Withdrawal và balance còn truy vết đúng. | Kiểm status pending/confirmed, audit movement và hạn mức, gồm nguồn M06/M04 khi có. |

## 13.5. Multi-currency & Recurring

| Mã | Given / When: tình huống | Then: kết quả bắt buộc | Thiết lập kiểm thử |
|---|---|---|---|
| AC-M07-61 | Expense by JPY | Ghi 10.000 JPY gốc, không lẫn VND. | Kiểm original currency, missing FX, candidate recurring và thao tác retry. |
| AC-M07-62 | JPY→VND conversion | Có rate snapshot source/date/confirmer và phương pháp rõ. | Kiểm original currency, missing FX, candidate recurring và thao tác retry. |
| AC-M07-63 | No FX rate | Không cộng JPY vào VND; báo thiếu tỷ giá. | Kiểm original currency, missing FX, candidate recurring và thao tác retry. |
| AC-M07-64 | Multiple currencies report | Giữ số gốc lẫn converted, nhãn unit và completeness. | Kiểm original currency, missing FX, candidate recurring và thao tác retry. |
| AC-M07-65 | Cross-currency settlement | Không reconcile nếu chưa đủ tỷ giá/số nhận/đồng thuận. | Kiểm original currency, missing FX, candidate recurring và thao tác retry. |
| AC-M07-66 | Create Recurring Rule | Lưu cycle, due date, amount, payer/split template. | Kiểm original currency, missing FX, candidate recurring và thao tác retry. |
| AC-M07-67 | Recurring due candidate | Kỳ đến hạn vẫn pending, không tăng actual spending tự động. | Kiểm original currency, missing FX, candidate recurring và thao tác retry. |
| AC-M07-68 | Recurring retry | Một candidate/period; xử lý lại không tạo Expense trùng. | Kiểm original currency, missing FX, candidate recurring và thao tác retry. |
| AC-M07-69 | Stop recurring | Không sinh candidate future ngoài policy sau pause/end. | Kiểm original currency, missing FX, candidate recurring và thao tác retry. |

## 13.6. Privacy, Audit, Recovery & Devices

| Mã | Given / When: tình huống | Then: kết quả bắt buộc | Thiết lập kiểm thử |
|---|---|---|---|
| AC-M07-70 | Create Private Money Space | B không xem được expenses/balances của A Private. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-71 | Share one Expense | Chỉ các field/rights được chấp thuận; không mở toàn bộ Space. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-72 | Private Receipt in Shared Expense | B không mở được Receipt Private nếu chưa share asset độc lập. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-73 | Revoke Access | URL/tab/form đã mở cũng không cho write/read mới vượt quyền. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-74 | Concurrent Expense Edit | Không silent overwrite, nhất là amount/split/payment; approval invalidated khi cần. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-75 | No forged confirmation | A không thay B approve obligation; B không giả A receiver confirmation. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-76 | Audit of Money Adjustment | Có who/when/before/after/reason và related approvals. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-77 | Trash Expense | Delete đưa Trash đúng quyền, không làm sai reconciliation current view. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-78 | Cannot erase settled debt | Không xóa âm thầm Expense đã được đối soát/đã settle. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-79 | Restore within 30 days | Restore không làm duplicate Expense/Settlement/Contribution. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-80 | Personal export | A chỉ xuất dữ liệu có quyền, metadata currency/status đầy đủ. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-81 | Shared export | Export theo quyền hiện hành, không xuất partner Private/chứng từ hạn chế. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-82 | Backup/restore consistency | Balances, allocations, approvals, settlements và cross-links trước/sau đối chiếu được. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-83 | Mobile Expense CRUD | Trên mobile tạo/sửa/approve/split, gắn chứng từ và xem đối soát thực hiện được. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-84 | Desktop Budget/Savings | Trên desktop thực hiện đầy đủ tạo, chỉnh, góp/rút/confirm/export. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |
| AC-M07-85 | Save under network failure | Khi mất mạng không hiện false success; retry an toàn không tạo giao dịch trùng. | Kiểm A/B có quyền khác nhau, stale form, network failure, export/recovery và mobile/desktop. |

## 13.7. Golden datasets dùng khi kiểm thử số liệu

| Dataset | Dữ liệu | Kết quả bắt buộc |
|---|---|---|
| GS-01: Equal split | 600.000 VND, A pay 600.000, A/B owe 300.000 mỗi người | B→A 300.000 confirmed chỉ sau B approve |
| GS-02: Multiple payer | 1.000.000 VND; A pay 700.000, B pay 300.000; A/B owe 500.000 | B→A 200.000 |
| GS-03: Offset two directions | B→A 300.000; A→B 100.000 cùng VND | Net B→A 200.000; ledger 2 rows |
| GS-04: Partial settle | B→A debt 500.000; Confirmed Settlement 200.000 | Remaining 300.000, spending unchanged |
| GS-05: Refund after settle | 600.000 shared 50/50, B settled 300.000; refund 100.000 về A | Net expense 500.000; A→B 50.000 (sau duyệt allocation refund), settlement cũ giữ |
| GS-06: Save + spend | Quỹ 30.000.000, rút 5.000.000, ghi Expense mua vé 5.000.000 | Savings balance 25.000.000, actual spending 5.000.000 |
| GS-07: Rounding | Expense 101.001 VND Equal A/B | Allocation total 101.001 VND, không có 0,5đ thất lạc |
| GS-08: FX absent | 1.000.000 VND + 10.000 JPY không có rate | Báo cáo không trả tổng số tiền 1.010.000 giả, cảnh báo FX incomplete |
| GS-09: Multi-budget | Expense 600.000 link Trip và Food Budget | Trip tổng chỉ ghi 600.000 cho Expense đó, mỗi view riêng đúng scope |
| GS-10: Retry | Gửi cùng Create Expense/Settlement/Contribution 2 lần | Chỉ có một tác động tài chính chính thức |
| GS-11: Privacy | A Private expense 400.000, B Shared expense 600.000 | B chỉ thấy số liệu phù hợp shared; không suy A private qua total/count |
| GS-12: Unconfirmed split | A ghi expense và phân B 2.000.000, B chưa approve | Không tự biến thành confirmed B debt |

**Đối soát QA:** kiểm A/B, currency, kỳ, thời điểm, trạng thái approval, balances trước/sau, chứng từ, cross-module references, request retry và Audit History. Mọi kết quả phải nhất quán sau reload và backup/restore.

---

# 14. P0/P1/P2 và phạm vi bàn giao

## 14.1. P0 — Bắt buộc Our Space V1.0

1. Personal/Shared Money Spaces; quyền theo đối tượng và approval của người bị ảnh hưởng.
2. Expense CRUD, Ledger, Detail, categories, receipt/link, nhiều payer; split Equal/Fixed/Percent/Weighted, rounding chính xác.
3. Approval/Reject, Shared Balances, netting cùng currency; settlement từng phần, receiver confirmation, audit/reversal.
4. Refund toàn phần/một phần, Expense adjustment, void/delete có kiểm soát; báo cáo net chi đúng.
5. Budgets Monthly/Category/Trip/Custom; ngưỡng 80/100/over; báo cáo actual vs planned theo kỳ tháng không rollover.
6. Savings Goal cá nhân/chung; contribution/withdrawal/adjustment; balance confirmed và target; không tự suy ownership.
7. Recurring Expense Candidates; không tự xác nhận paid.
8. Đa tiền tệ; original amount + rate snapshot thủ công; missing FX báo thiếu; không trộn currency.
9. Search, Reports, CSV/structured export, privacy, audit, 30-day Trash, Restore, backup/recovery.
10. Cross-module links với M03/M04/M05/M06, tuân thủ M01/M02 quyền content và chuẩn M08–M10 khi chốt sau.
11. Desktop/mobile parity, idempotency, conflict handling, no false save, no data leaks.

## 14.2. P1 — Nâng cao ngoài phạm vi P0

- Tỷ giá tự động từ provider tin cậy và cơ chế source/audit tương ứng.
- Monthly Budget Rollover, PDF báo cáo trình bày đẹp, CSV import có dedup và reconciliation.
- Báo cáo nâng cao nhiều kỳ; quỹ với quy tắc ownership shares chi tiết; cảnh báo ngoài ứng dụng.
- Đối soát sao kê thủ công nâng cao; phân bổ theo nhiều tầng hoặc phân tích financial plans mở rộng.

## 14.3. P2 — Tương lai

- Kết nối tài khoản ngân hàng/đồng bộ giao dịch khi có điều kiện pháp lý và kỹ thuật phù hợp.
- Chuyển tiền/thanh toán thực qua đối tác được phép; AI OCR hóa đơn, AI auto category, phát hiện bất thường, dự báo tiết kiệm.

**Quan trọng:** M07 P0 phải xây/test cùng 9 module P0 khác trước khi Our Space V1.0 được sử dụng. Việc phát triển theo thứ tự nội bộ không cho phép bỏ qua nghiệm thu toàn hệ thống.

---

# 15. Definition of Done và quality gates

## 15.1. Nghiệm thu nghiệp vụ cuối cùng

- [ ] D01–D30 đã được map vào màn hình, business rules, use cases, acceptance criteria tương ứng; không thực thi nhầm P1/P2 như P0.
- [ ] FN-01–FN-20 hoàn thành luồng P0 trên **mobile và desktop**; cùng một dữ liệu có cùng ý nghĩa và quyền.
- [ ] UC-M07-01–22 thực hiện được; UX hiển thị rõ Private/Shared, amount/currency, payer vs allocated, pending/confirmed, source links.
- [ ] BR-M07-01–76 và AC-M07-01–85 có bằng chứng pass, không chỉ check nút hiển thị.
- [ ] EX-M07-01–50 được thử hoặc có test có thể tái hiện, nhất là retry, netting, refund sau settlement, điều chỉnh sau confirmed, FX, privacy.
- [ ] Split 4 phương pháp, multi-payer và rounding bảo toàn tổng; không false debt trước approval.
- [ ] Settlement không tăng Expense, Pending không trừ debt; Refund không phá lịch sử Settlement; Withdrawal không tự thành Expense.
- [ ] Budget usage dựa trên unique confirmed net Expense, không từ estimate hoặc Settlement.
- [ ] Savings confirmed balance trace được từ movements và starting balance; Target Reached không tự Completed; quỹ không giả làm bank balance.
- [ ] Missing FX và multi-currency không tạo tổng giả; FX snapshot/original preserved, export giải thích được.
- [ ] Search/Charts/Notifications/Export/Files/History kiểm quyền, không rò qua count/aggregate hoặc link URL.
- [ ] M03/M04/M06 không duy trì tiền riêng, M05 chỉ quản reminder; refresh/mất đồng bộ có trạng thái hợp lệ; tạo từ source retry không duplicate.
- [ ] Đã kiểm trường hợp quyền bị thu hồi lúc tab mở, pending approval khi cùng sửa, B từ chối split, receiver deny Settlement.
- [ ] Trash ≥30 ngày, Restore và Backup/Restore kiểm đúng 100% các tham chiếu/giá trị tài chính của golden datasets; không duplicate.
- [ ] Audit trace rõ who/when/what/before/after/why cho tiền đã confirmed và quyền; không silent destruction.
- [ ] V1.0 không chứa ngân hàng tự động/AI/transfer thật nếu chưa có yêu cầu riêng được phê duyệt.

## 15.2. Những tiêu chí phi chức năng phải định lượng sau này

- Độ chính xác tài chính tới minor units, consistency/atomicity/idempotency trong tình huống lỗi hoặc concurrent.
- Thời gian tải Ledger/Search/Reports với dữ liệu lớn, phân trang, responsiveness mobile.
- Quy trình mã hóa/bảo vệ dữ liệu nhạy cảm, kiểm quyền ở file delivery và xuất dữ liệu.
- Thời hạn retention và recovery của audit, trash ≥30 ngày, backup frequency, RPO/RTO được chốt khi thiết kế hệ thống.
- Mức giới hạn resource (expenses, receipts, contributions, export jobs), timeout và offline/retry chưa tự đặt.
- Chỉ tiêu QA bảo mật, hiệu năng và khả năng dùng được trên mobile/desktop cần có test matrix cụ thể; tài liệu này không tự áp SLA giả.

## 15.3. Checklist riêng sau khi hoàn thành M07

1. **Sau M07, bước product tiếp theo M08 — Special Moments**, chưa bắt đầu code hay chọn tech stack.
2. Cập nhật project handoff và ma trận ownership để M08–M10 không tự tạo ledger tài chính hoặc rò chi phí quà bất ngờ.
3. Khi tất cả BRD M01–M10 được chốt, review chéo system-wide integrity/privacy trước thiết kế chi tiết, rồi bắt đầu công việc code theo yêu cầu riêng của chủ dự án.

---

# 16. Traceability D01–D30 → đặc tả → nghiệm thu

Bảng này giúp Codex và QA tìm nơi kiểm chứng một quyết định, không thay thế việc đọc nội dung chi tiết.

| Quyết định | Diễn giải ở mục | AC kiểm tra |
|---|---|---|
| D01 | 8.1–8.2 | AC-70–AC-72 |
| D02 | 8.2 | AC-01, AC-45 |
| D03 | 1.3, 7 | AC-01–AC-14 |
| D04 | 4.2, 5.4 | AC-05–AC-06, AC-20–AC-21 |
| D05 | 4.2, 5.5 | AC-06, AC-21 |
| D06 | 5.5, 6 FN-05 | AC-15–AC-18 |
| D07 | 7.1, 6 FN-05 | AC-15 |
| D08 | 5.1, 8.1 | AC-11–AC-12 |
| D09 | 5.1 | AC-11–AC-14 |
| D10 | 5.4, 7.2 | AC-21–AC-22 |
| D11 | 5.2, 7.2 | AC-23–AC-26 |
| D12 | 5.2, 8.4 | AC-27 |
| D13 | 7.3, 5.4 | AC-28–AC-30 |
| D14 | 7.6, 6 FN-09–10 | AC-31–AC-34 |
| D15 | 7.6 | AC-35–AC-36 |
| D16 | 7.6 | AC-39 |
| D17 | 7.6 | AC-37 |
| D18 | 5.3, FN-11–14 | AC-45–AC-46 |
| D19 | 5.3, 7.4 | AC-48–AC-53 |
| D20 | 5.3 | AC-55 |
| D21 | 8.1, FN-13 | AC-57 |
| D22 | 1.3, FN-13 | AC-45–AC-46 |
| D23 | 7.5 | AC-66–AC-69 |
| D24 | 5.6 | AC-61–AC-65 |
| D25 | 5.6 | AC-62–AC-65 |
| D26 | 9.3–9.6 | AC-08–AC-10, AC-42–AC-43, AC-58–AC-59 |
| D27 | 8.2, 9.2 | AC-72 |
| D28 | FN-18, FN-20 | AC-80–AC-81 |
| D29 | 8.4, FN-20 | AC-76–AC-82 |
| D30 | 8.3, 15 | AC-74, AC-83–AC-85 |

# 17. Dependency / Open Issues — chỉ những gì chưa được phê duyệt

Những mục dưới đây **không sửa quyết định D01–D30** mà chỉ chỉ ra thông số/chính sách cần xác định khi triển khai hoặc chờ BRD chủ sở hữu.

| ID | Phụ thuộc | Mức độ | Hướng xử lý / câu hỏi còn mở |
|---|---|---|---|
| OPEN-M07-01 | Cơ chế file chung | Cross-module M02/M04 | PDF hóa đơn/booking cần nơi lưu phù hợp; không ép M02 thành kho PDF khi BRD M02 chưa có |
| OPEN-M07-02 | Quy tắc lưu tiền chính xác | Thiết kế kỹ thuật | Lựa chọn money representation, precision, minor units, rounding deterministic và khả năng replay có test |
| OPEN-M07-03 | Chênh thời gian / date boundary | Thiết kế kỹ thuật cùng M05 | Quy tắc timezone ghi nhận Expense date, budget period và lịch recurring |
| OPEN-M07-04 | Quỹ Ownership Shares | P1 | Nếu muốn ownership shares, phải chốt thỏa thuận và xử lý withdrawal/refund riêng |
| OPEN-M07-05 | FX provider | P1 | V1.0 rate do người dùng xác nhận; provider tự động và fallback chưa chốt |
| OPEN-M07-06 | Lưu trữ/chỉ số hiệu năng | NFR | Quota, volume, pagination target, batch sizes, performance SLA |
| OPEN-M07-07 | Retention nâng cao | NFR / chính sách | Trash ít nhất 30 ngày đã chốt; audit retention, giới hạn xóa vĩnh viễn cần thiết kế an toàn |
| OPEN-M07-08 | M08 gifts/Time Capsules | Chờ BRD M08 | Expense chuẩn bị bất ngờ Private không lộ ra lịch chung/recap trước thời điểm cho phép |
| OPEN-M07-09 | M09 Comments | Chờ BRD M09 | Bình luận không thay thế thao tác approval/settlement confirmation |
| OPEN-M07-10 | M10 Permissions/Settings | Chờ BRD M10 | Cấu hình tiền tệ hiển thị, in-app notification, logs, role exceptions |
| OPEN-M07-11 | CSV field mapping | Thiết kế export | Định dạng dữ liệu, encoding, trace IDs và permission-at-download |
| OPEN-M07-12 | Multi-currency balances | Chính sách chi tiết | Mặc định không net khác loại; nếu B hoàn VND cho nợ JPY cần các bên đồng thuận FX và lượng tiền thực nhận |
| OPEN-M07-13 | Adjustment dispute | Thiết kế UX nghiệp vụ | Cách hiển thị tranh chấp sau confirmed và outstanding được phân tách; không được tự bỏ qua quyền B |

**Escalation rule:** Nếu câu hỏi mở ảnh hưởng đến tính đúng của một P0 rule, Codex phải ghi rõ điểm cần Product Owner xác nhận trước khi code nhánh đó; không tự tạo giả định tài chính, pháp lý hoặc bảo mật.

---

# 18. Quy ước lưu, trích dẫn và sử dụng với Codex

- Lưu đúng tên `Docs/OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md`, không đổi thành tóm tắt hoặc rút gọn.
- Xem D01–D30 là quyết định chính thức, BR/UC/EX/AC là hợp đồng nghiệm thu P0. Trên các phần chưa có BRD của M08–M10 chỉ ghi dependency.
- Để triển khai, ưu tiên thứ tự: quyền + single source of truth → model money integrity → expense/allocations/approval → balances/settlement/refund → savings → budget → FX/report → integration → recovery.
- Ghi test evidence cho Golden Datasets GS-01–GS-12 và các test boundary về tiền/riêng tư/concurrent.
- Không tạo automatic bank access, AI receipt extraction, payment processing hay timezone/rate/provider tùy tiện.

**Kết luận nghiệp vụ:** M07 là nơi ghi nhận số tiền khai báo và cơ chế phối hợp giữa hai người, không phải ngân hàng. Tính đúng số, sự chấp thuận của người có nghĩa vụ, kiểm soát quyền Private và việc không tạo giao dịch trùng là các điều kiện **không được cắt khỏi V1.0**.

