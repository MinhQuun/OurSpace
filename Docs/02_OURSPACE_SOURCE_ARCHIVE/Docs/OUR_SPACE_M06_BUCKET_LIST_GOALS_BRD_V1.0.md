---
document_id: OURSPACE-M06-BRD
project: Our Space
module_id: M06
module_name: Bucket List & Goals
version: 1.0
status: APPROVED_BUSINESS_REQUIREMENTS__IMPLEMENTATION_NOT_STARTED
language: vi-VN
approved_on: 2026-10-22
file_name: OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md
intended_audience: [Product Owner, UX Designer, Codex, Developer, QA]
related_documents:
  - OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md
  - OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md
  - OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md
  - OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md
  - OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md
next_module: M07 — Budget & Savings
---

# OUR SPACE — M06: BUCKET LIST & GOALS
## Business Requirements & Functional Specification — V1.0

> **TRẠNG THÁI: ĐÃ DUYỆT NGHIỆP VỤ.** Chủ dự án đã xác nhận **toàn bộ đề xuất M06, D01–D24** ngày 22/10/2026. Đây là BRD chính thức để lưu tại `OurSpace/Docs/`, làm đầu vào cho Codex thiết kế, phát triển và QA *sau này*. **Chưa viết code, chưa lựa chọn công nghệ, API, database hoặc giới hạn hạ tầng.**
>
> **QUY ƯỚC DỰ ÁN:** Our Space là website riêng tư dành cho hai tài khoản. Quyền theo từng nội dung, mặc định Private; hai người có thể chia sẻ theo chủ đích. Mobile/desktop đều hoàn thành nghiệp vụ P0. M01–M05 đã có BRD được chốt. Chỉ đưa Our Space V1.0 vào sử dụng khi **10/10 phân hệ đạt đầy đủ P0**. Không đề xuất phát hành một MVP chỉ có vài phân hệ.
>
> **ĐỌC CHO CODEX:** Đọc toàn bộ D01–D24, 18 màn hình BG-01–BG-18, vòng đời Wish/Goal/Task, mô hình 24 đối tượng, 74 business rules (`BR-M06-*`), 20 use cases (`UC-M06-*`), 45 exceptions (`EX-M06-*`), 75 acceptance criteria (`AC-M06-*`), hợp đồng liên phân hệ, bảo mật/khôi phục/DoD. Các điểm được ghi 'chưa chốt' không được tự giả định thành quyết định của Product Owner.
>
> **ƯU TIÊN:** P0 = phải nghiệm thu trong Our Space V1.0; P1 = nâng cao, không mặc định thuộc V1.0; P2 = tương lai. Đừng tự nâng P1/P2 thành P0.

---

# 1. Định vị, phạm vi và nguyên tắc

## 1.1. Tầm nhìn sản phẩm

M06 — **Bucket List & Goals** là nơi hai người lưu giữ những mong muốn, chọn điều muốn theo đuổi và biến nó thành hành động có thể kiểm chứng. Nó phải vừa đủ nhẹ nhàng để người dùng lưu một ý tưởng trong vài giây, vừa đủ sâu để quản lý những mục tiêu nhiều năm với milestones, task, tiến độ, quyền riêng tư và thành tựu. M06 *không* biến tình cảm thành bảng xếp hạng năng suất; thành tựu và cảm xúc quan trọng không kém phần trăm.

M06 giúp trả lời: (1) chúng ta muốn trải nghiệm điều gì? (2) mục tiêu nào đang thực hiện? (3) ai làm việc nào? (4) chúng ta đang tiến tới đâu và số liệu đến từ đâu? (5) điều gì thực sự đã đạt? (6) có thể đưa kết quả vào Diary, Photobook hoặc Special Moments thế nào?

## 1.2. Phạm vi P0

- Tạo/đọc/sửa/lưu trữ Wish theo đúng quyền; chỉ cần tên để lưu; Personal và Shared Bucket List.
- Wish Collections, categories, tags, ảnh/ghi chú/inspiration và trạng thái Wish riêng.
- Chuyển Wish thành Goal **mà không xóa Wish gốc**; theo dõi quan hệ nguồn và cảnh báo bản có thể trùng.
- Bốn Goal Types: Checklist, Numeric, Outcome, Linked; Draft trước Active; deadline là tùy chọn.
- Milestones, Tasks, phân công, theo dõi trạng thái, cập nhật tiến độ/lịch sử và điều kiện hoàn thành.
- Owner Confirmation hoặc Both Confirmation cho Goal chung; Achievement giữ thông tin đã đạt và minh chứng.
- Inspiration Board dùng tài nguyên M02, không sao chép original.
- Liên kết theo quyền với M01/M02/M03/M04/M05; chuẩn bị hợp đồng M07/M08/M09/M10; không tạo dữ liệu trùng.
- Search, filter, thống kê cơ bản, desktop/mobile tương đương nghiệp vụ; cộng tác có bảo vệ xung đột, không bắt buộc live cursor.
- Quyền theo từng Wish/Goal và nội dung con; Private mặc định; Archive/Trash tối thiểu 30 ngày/Restore/Export, backup/khôi phục theo chuẩn dự án.

## 1.3. Ngoài phạm vi P0

- Habit tracking theo ngày/chuỗi streak, Goals định kỳ, biểu đồ và dashboard phân tích nâng cao, nhiều tầng dependencies, template phong phú là P1.
- AI đề xuất mục tiêu, chia nhỏ nhiệm vụ, phân tích tiến độ, ảnh minh chứng tự nhận dạng, gamification phức tạp là P2.
- Không xây sổ thu chi, ví tiền hay giao dịch trong M06; **M07** sở hữu dữ liệu tài chính.
- Không xây Calendar Event hoặc reminder engine riêng; **M05** sở hữu sự kiện/lời nhắc.
- Không sở hữu Place/Visit của M03, Trip của M04, Media gốc M02, Diary/Photobook M01, Time Capsule M08.

## 1.4. Bất biến xuyên mô-đun

1. **Wish ≠ Goal ≠ Milestone ≠ Task ≠ Achievement.** Mỗi loại có định danh, trạng thái và trách nhiệm dữ liệu khác nhau.
2. Wish không bị coi là quá hạn/thất bại nếu chưa có kế hoạch. Goal Active phải có tiêu chí hoàn thành hợp lệ.
3. **Private by default**; tham chiếu/chèn vào danh sách chung không tự mở quyền dữ liệu nguồn. Các số tổng hợp phải áp dụng quyền.
4. **Single source of truth**: M03 sở hữu Place/Visit, M04 Trip, M05 Event, M07 Savings Goal/giao dịch, M02 Media, M01 Diary/Photobook, M08 Special Moments.
5. Không tạo Goal Completed hay Achievement chỉ vì biểu đồ chạm 100%; phải theo phương thức xác nhận đã chọn.
6. Dữ liệu đã hoàn thành có lịch sử; sửa target hoặc mở lại không hủy dấu vết thành tựu cũ.
7. Không ghi đè âm thầm khi hai tài khoản chỉnh cùng đối tượng; không xóa dây chuyền dữ liệu phân hệ khác.
8. Người dùng quyết định việc chia sẻ, ghi nhận thành tựu, thêm sự kiện và tạo photobook; hệ thống chỉ gợi ý hợp lý.
9. Lưu tự động hoặc thao tác Save phải thông báo đúng trạng thái; mất mạng/đồng bộ lỗi không báo sai đã lưu.
10. **Bản BRD** mô tả kết quả nghiệp vụ; cách triển khai kỹ thuật được quyết định ở giai đoạn sau.

# 2. 24 quyết định nghiệp vụ đã chốt

**Nguồn phê duyệt:** Người dùng xác nhận: “Tôi chốt toàn bộ đề xuất M06”. Các phương án sau là yêu cầu chính thức, không phải lựa chọn còn chờ duyệt.

| ID | Nội dung | Quyết định đã chốt | Hệ quả triển khai/nghiệm thu |
|---|---|---|---|
| D01 | Wish và Goal | Hai đối tượng nghiệp vụ riêng, liên kết được | Tách trạng thái, màn hình, quyền và phép đo. |
| D02 | Tạo Wish | Chỉ yêu cầu tên; không bắt buộc ngày/ngân sách | Add Wish có thể lưu ngay. |
| D03 | Quyền mặc định | Private; hỗ trợ Personal và Shared | Không được tự chia sẻ. |
| D04 | Wish Collections | Một Wish ở nhiều Collection | Gỡ membership không xóa Wish. |
| D05 | Phân loại | Category và Tag tùy chỉnh | Không khóa nội dung vào danh mục cứng. |
| D06 | Wish → Goal | Giữ Wish gốc và liên kết nguồn | Không thay thế hay xóa Wish khi chuyển. |
| D07 | Loại Goal | Checklist, Numeric, Outcome, Linked trong V1.0 | Một phương pháp đo tiến độ chính/Goal. |
| D08 | Deadline | Tùy chọn; quá hạn không auto Failed | Overdue là nhãn tính toán cho Active. |
| D09 | Goal Draft | Được lưu thiếu cấu hình; validate trước Active | Draft vẫn Private theo mặc định. |
| D10 | Milestones & Tasks | Cả hai và phân công từng người | Milestone khác Task, không auto hoàn thành Goal. |
| D11 | Progress | Tự nhập hoặc từ nguồn liên kết | Có lịch sử và quy tắc nguồn/đếm. |
| D12 | Đạt 100% | Không auto chốt khi phải xác nhận | Cho phép kiểm tra đủ điều kiện. |
| D13 | Goal chung | Owner Confirmation mặc định, Both Confirmation tùy chọn | Ghi nhận xác nhận đúng tài khoản và phiên bản. |
| D14 | Mở lại Goal | Được mở lại, giữ lịch sử/Achievement | Không xóa vết mục tiêu cũ. |
| D15 | Achievement | Ngày, ghi chú, ảnh, liên kết kỷ niệm | Không tự công khai minh chứng. |
| D16 | Inspiration | Inspiration Board P0, dùng M02 | Không copy original media. |
| D17 | Goal Calendar | Deadline/Milestone liên kết M05 | Không duy trì Event riêng. |
| D18 | Savings Goal | M07 là chủ dữ liệu tài chính | M06 không có ledger hoặc balance thứ hai. |
| D19 | Linked Goal | Phép đo rõ, chống trùng | Không suy diễn đếm Place = Visit. |
| D20 | Search & Insights | Tìm đa điều kiện/thống kê cơ bản P0 | Bắt buộc áp quyền tìm và tổng hợp. |
| D21 | Collaboration | Hai tài khoản, chống xung đột; không live cursor | Bảo vệ update đồng thời. |
| D22 | Archive & Trash | Trash ≥30 ngày; không xóa dây chuyền | Restore giữ quan hệ hợp lệ. |
| D23 | Repeat/Habit | Habit tracking và Goals lặp P1 | Không buộc vào V1.0. |
| D24 | Export & Device | Export cơ bản; mobile/desktop đầy đủ P0 | Không có luồng core chỉ chạy desktop. |

## 2.1. Quy tắc áp dụng khi tài liệu khác có vẻ mâu thuẫn

- Ưu tiên yêu cầu **đã được duyệt theo module sở hữu dữ liệu**. Ví dụ M06 không tự thiết kế ledger vì M07 mới sở hữu tiền; M05 sở hữu Calendar Event/reminder.
- Phần tích hợp M07–M10 mô tả **hợp đồng nhu cầu** chứ không tuyên bố các chi tiết M07–M10 đã chốt trước khi thảo luận.
- Nếu một yêu cầu tích hợp xung đột với BRD nguồn đã được phê duyệt, ghi `OPEN-CROSS-MODULE-ISSUE` và xin Product Owner giải quyết trước khi triển khai phạm vi bị ảnh hưởng.
- Trường `tùy chọn` nghĩa là không được đặt giá trị giả; màn hình cần trạng thái thiếu dữ liệu hữu ích, không hiểu null là 0/hết hạn.

# 3. Actors, ngôn ngữ nghiệp vụ, hành trình

## 3.1. Tác nhân và nhóm quyền

| Tác nhân | Mô tả | Điểm kiểm soát |
|---|---|---|
| Person A / Person B | Hai tài khoản đăng nhập độc lập | Không có đặc quyền tài khoản cố định trên tất cả Wish/Goal |
| Owner | Chủ nội dung cụ thể | Cấp/thu quyền, cấu hình mục tiêu, xác nhận theo mode |
| Editor | Được sửa theo quyền nội dung | Không mặc định quản trị quyền hay tài nguyên Private của nguồn |
| Contributor | Cập nhật task/tiến độ được giao/được phép | Không tự sửa target hoặc quyền Goal |
| Viewer | Chỉ xem nội dung được chia sẻ | Không tự ghi hay thay đổi xác nhận |
| Linked Source | Các đối tượng M03/M04/M05/M07... | Cung cấp dữ liệu theo đúng quyền và phiên bản |

## 3.2. Từ điển nghiệp vụ

- **Wish:** mong muốn chưa nhất thiết có tiêu chí đo; không đòi ngày, ngân sách hay Task.
- **Goal:** kết quả được xác định điều kiện hoàn thành; có thể Draft hoặc Active.
- **Milestone:** cột mốc đánh giá kết quả ở giai đoạn; có thể không có Task.
- **Task:** công việc hành động có người phụ trách, hạn tùy chọn.
- **Progress:** phép đo hợp lệ theo định nghĩa của Goal; không đánh đồng tiến độ chuẩn bị và đạt Outcome.
- **Achievement:** dấu mốc đã đạt, lưu thời điểm/phiên bản điều kiện và minh chứng.
- **Collection:** nhóm Wish theo chủ đề; membership không phải bản copy Wish.
- **Source Link:** quan hệ tới dữ liệu thuộc module khác, không phải bản dữ liệu gốc.
- **Owner Confirmation / Both Confirmation:** quy tắc phê duyệt Goal chung được áp dụng đúng phiên bản điều kiện.
- **Overdue:** chỉ là trạng thái hiển thị khi Active và quá hạn; không phải Failed.
- **Private/Shared:** phạm vi xem được của nội dung, không trùng với tình trạng Owner/Editor.

## 3.3. Hành trình điển hình

**Tích lũy ước mơ:** tạo Wish “Cùng đi Nhật” → thêm ảnh truyền cảm hứng M02 → chia sẻ với người kia → đưa vào Collection “Dream Destinations” → khi sẵn sàng, tạo Goal liên kết → tạo Dream Trip trong M04 → liên kết Savings Goal M07 → thêm deadline M05 → hai người chia Task → xác nhận hoàn thành → tạo Achievement → mở M01 tạo Diary/Photobook và gắn M08 Special Moment khi phù hợp.

**Trải nghiệm tự phát:** tạo Wish “Xem bình minh ở biển” → bất ngờ thực hiện trong kỳ nghỉ → đánh dấu Fulfilled với ngày và cảm nhận → liên kết Visit/ảnh/Trip nếu có → Wish vẫn tồn tại trong lịch sử, không đòi Goal trung gian.

**Mục tiêu cá nhân:** tạo Goal học một kỹ năng, để Private → cập nhật tiến độ → tự xác nhận hoàn thành → không xuất hiện trong Search, Insights hoặc Notification của người còn lại.

# 4. Mô hình miền và trường dữ liệu

## 4.1. 24 đối tượng nghiệp vụ

| Mã | Đối tượng | Nhiệm vụ / ràng buộc |
|---|---|---|
| ENT-M06-01 | Wish | Mong muốn độc lập; status Wish; tác giả và privacy. |
| ENT-M06-02 | Wish Collection | Nhóm Wish theo chủ đề, quyền và thứ tự. |
| ENT-M06-03 | Collection Membership | Liên kết Wish–Collection và thứ tự/ghi chú nếu có. |
| ENT-M06-04 | Goal | Mục tiêu với owner, status, scope, target/deadline tùy loại. |
| ENT-M06-05 | Goal Definition | Phiên bản kiểu đo và điều kiện đạt; phục vụ audit. |
| ENT-M06-06 | Goal Participant | Thành viên, vai trò, xác nhận nếu cần. |
| ENT-M06-07 | Milestone | Cột mốc thuộc Goal, điều kiện đạt, hạn tùy chọn. |
| ENT-M06-08 | Task | Việc cụ thể thuộc Goal/Milestone; trạng thái độc lập. |
| ENT-M06-09 | Task Assignment | Người được gán và quyền tác vụ. |
| ENT-M06-10 | Progress Record | Giá trị trước/sau, nguồn, ai cập nhật, thời gian. |
| ENT-M06-11 | Goal Metric | Đơn vị, target, giá trị hiện tại và quy tắc đo. |
| ENT-M06-12 | Goal Source Link | Nguồn chỉ số M03/M04/M07 và bộ lọc đếm. |
| ENT-M06-13 | Goal Calendar Link | Tham chiếu event deadline/milestone M05. |
| ENT-M06-14 | Goal Savings Link | Tham chiếu Savings Goal thuộc M07. |
| ENT-M06-15 | Inspiration Item | Ghi chú/link/media tham khảo; kiểm tra quyền M02. |
| ENT-M06-16 | Achievement | Kết quả hoàn thành, ngày, người tham gia, phiên bản. |
| ENT-M06-17 | Achievement Evidence | Ảnh, Visit, Trip, Diary hoặc bằng chứng theo quyền. |
| ENT-M06-18 | Completion Confirmation | Ai xác nhận, theo mode/phiên bản nào. |
| ENT-M06-19 | Wish/Goal Permission | Quyền per-content; không thay quyền của nguồn. |
| ENT-M06-20 | Change History | Dòng sự kiện sửa quan trọng, chính sách quyền. |
| ENT-M06-21 | Trash Record | Ngày xóa, chủ thể, hạn giữ và khả năng khôi phục. |
| ENT-M06-22 | Related Content Link | Liên kết đến M01–M10 có mục đích cụ thể. |
| ENT-M06-23 | Category & Tag | Phân loại tùy chỉnh và metadata. |
| ENT-M06-24 | Goal Template | Bản mẫu gợi ý nếu được sử dụng; không phải P0 thư viện lớn. |

## 4.2. Quan hệ và ownership

- Một **Wish** có thể thuộc 0..n Collections và có thể liên kết 0..n Goals. Một Goal có thể liên quan 0..n Wishes nếu người dùng chủ động tạo quan hệ hợp lệ; không tự suy đoán mọi Wish trong Collection là nguồn của Goal.
- Một **Goal** có 0..n Milestones, 0..n Tasks trực tiếp, 0..n Task dưới Milestone, 0..n Progress Records, 0..n Source Links. Một Milestone có thể không có Task. Task phải gắn đúng một Goal ngữ cảnh hoạt động để tránh nhân đôi nhiệm vụ; quan hệ gộp/hiển thị bên nơi khác được dùng link.
- **Progress** chỉ có một phương pháp chủ đạo ở một thời điểm; các chỉ số phụ là dữ liệu bổ sung và cần nhãn rõ. `Metric Definition`/`Goal Definition` phải giữ phiên bản đủ nhận biết việc sửa target/đơn vị/điều kiện hoàn thành.
- **Achievement** thuộc kết quả đã được xác nhận; có thể có nhiều evidence, nhưng mỗi evidence được phân quyền riêng. Khi Goal mở lại, Achievement trước vẫn hiện diện với ngữ cảnh phiên bản.
- M03 Place/Visit, M04 Trip, M05 Calendar Event, M07 Savings Goal và M02 Media *không trở thành* object owned bởi M06 chỉ vì được link.
- Một linked item có thể cấp số liệu đếm cho nhiều Goal khác nhau; điều này không tạo bản sao object nguồn, nhưng mỗi Goal phải có phép đo và phạm vi hợp lệ của riêng nó.

## 4.3. Field dictionary — Wish

| Trường | Điều kiện | Ý nghĩa / kiểm soát |
|---|---|---|
| Wish ID | Hệ thống | Định danh ổn định, không thay khi đổi tên/Collection |
| Title | Bắt buộc | Chuỗi tên không rỗng sau khi bỏ khoảng trắng thừa |
| Description / Why | Tùy chọn | Cảm xúc, lý do muốn làm |
| Category / Tags | Tùy chọn | Có thể tùy chỉnh; không phải lý do từ chối Wish hợp lệ |
| Cover Media | Tùy chọn | Tham chiếu M02, không sao chép original |
| Suggested Time | Tùy chọn | Có thể là khoảng/mùa, không cưỡng ép ngày giả |
| Priority | Tùy chọn | Mức độ quan tâm, không phải deadline |
| Visibility / Owner | Có | Mặc định Private theo tài khoản tạo |
| Status | Có | Wishlisted → Considering/Planned → Fulfilled hoặc Dropped; Archived độc lập |
| Related Goals/Content | Tùy chọn | Quan hệ có mục đích, đúng quyền |
| Fulfillment Date / Note | Khi Fulfilled nếu người dùng cung cấp | Không giả thời gian khi chưa rõ |
| Created/Updated/Deleted | Hệ thống | Lịch sử, phục hồi và dấu vết quản trị |

## 4.4. Field dictionary — Goal

| Trường | Điều kiện | Ý nghĩa / kiểm soát |
|---|---|---|
| Goal ID, Name | Bắt buộc khi tạo | Định danh riêng và tên hợp lệ |
| Type | Bắt buộc | Checklist / Numeric / Outcome / Linked |
| Description & Why | Tùy chọn | Động lực và ngữ cảnh |
| Definition/Completion Criteria | Bắt buộc trước Active | Rõ cho từng loại Goal, có phiên bản |
| Primary Progress Method | Bắt buộc trước Active | Không trộn 2 cách đo chính gây % mâu thuẫn |
| Target Value & Unit | Numeric cần có | Target > 0; kiểm tra kiểu dữ liệu/đơn vị |
| Current Value | Numeric cần có trước Active | Không ngầm coi null là 0; được giảm nếu hợp lệ, có lịch sử |
| Scope/Filter of Linked Metric | Linked cần có | Ví dụ Place distinct, Visit count, date range, permission scope |
| Start/Target Date | Tùy chọn | Deadline không bắt buộc; ngày kết thúc không tạo Failed |
| Owner / Contributors | Có owner | Có thể thêm người theo đúng quy trình chia sẻ |
| Completion Mode | Theo Goal chung | Owner Confirmation (mặc định) hoặc Both Confirmation |
| Status | Có | Draft, Active, Paused, Completed, Cancelled; Archive riêng |
| Linked Wish/M03/M04/M05/M07 | Tùy chọn | Chỉ lưu reference/relationship hợp lệ |
| Achievement, Confirmations | Khi hoàn thành | Lưu người xác nhận, thời điểm, phiên bản tiêu chí |
| Created/Updated/History | Hệ thống | Có thể truy vết sửa đổi quan trọng |

## 4.5. Field dictionary — Milestone / Task / Achievement

**Milestone:** ID, Goal ID, tên, tiêu chí đạt, thứ tự, người phụ trách tùy chọn, ngày dự kiến tùy chọn, trạng thái, ngày hoàn thành, ghi chú, liên kết Task/Event. **Task:** ID, Goal, Milestone tùy chọn, tên, mô tả, thứ tự, người phụ trách 0..2 người, deadline tùy chọn, priority, status To Do/In Progress/Done/Skipped/Cancelled, completed_at, liên kết và nhật ký sửa đổi. **Achievement:** ID, nguồn Wish/Goal, ngày đạt thực tế, các tài khoản đã xác nhận nếu cần, ghi chú, ảnh/evidence và version điều kiện hoàn thành; có chính sách quyền riêng.

Không dùng Achievement như ledger tài chính, không dùng Task như lịch cá nhân độc lập: Task có thể *link* Event M05, không tự sở hữu reminder.

# 5. State machines và phép đo tiến độ

## 5.1. Wish: vòng đời đề xuất

`Wishlisted → Considering → Planned → Fulfilled` là con đường phổ biến, **không phải luồng bắt buộc**. Wish có thể chuyển Wishlisted → Fulfilled trực tiếp khi trải nghiệm tự phát. `Dropped` nghĩa là không còn theo đuổi, không xóa lịch sử. `Archived` là cách lưu trữ độc lập, có thể áp lên nội dung đã Fulfilled hoặc Dropped. Việc Wish trở thành Planned **không đồng nghĩa** Goal tự Active; quan hệ và trạng thái vẫn được thể hiện riêng.

## 5.2. Goal: vòng đời đề xuất

`Draft → Active → Paused/Active → Completed`; từ Draft/Active/Paused có thể Cancelled khi đủ quyền; Archived giữ lịch sử. Khi tạo Draft có thể chưa có progress definition. Khi Active bắt buộc cấu hình đúng loại. Từ Paused trở lại Active giữ tiến độ. Goal Completed có thể Reopen/Extend sau khi có xác nhận, nhưng phải bảo toàn Achievement và phiên bản định nghĩa cũ. Quá deadline chỉ tạo nhãn `Overdue`, không tự set Failed/Cancelled/Completed.

## 5.3. Milestone và Task

Milestone: Not Started, In Progress, Completed, Skipped, Cancelled (nếu người dùng quản lý theo các trạng thái này); Task: To Do, In Progress, Done, Skipped, Cancelled. Hoàn thành toàn bộ Task *không tự động* xác nhận Outcome Goal hoặc Completed Milestone có tiêu chí riêng. Task Done có thể hoàn tác hợp lệ với lịch sử rõ.

## 5.4. Bốn phương pháp progress

1. **Numeric:** `progress_display = clamp(current/target*100, 0, 100)` khi target hợp lệ >0 và current hợp lệ. Giá trị thực `current` không bị clamp; nếu 14/12 thì hiện 14/12, thanh 100% và có thể hiển thị vượt chỉ tiêu. Không chia cho 0, không đồng nhất current=null với 0.
2. **Checklist:** mẫu số gồm các Task hợp lệ trong phạm vi đo đã định nghĩa; `Cancelled` loại khỏi mẫu số; `Skipped` vẫn tính trong mẫu số cho đến khi được xác nhận loại khỏi phạm vi; `Done` tính ở tử số; nếu mẫu số 0, hiển thị “Chưa có task” thay vì 0% hoặc 100% giả. Cấu hình khi sửa scope/loại task cần lịch sử.
3. **Outcome:** chỉ hiển thị trạng thái kết quả chưa đạt / chờ xác nhận / đã xác nhận. Tiến độ Task/Milestone chỉ là tiến độ chuẩn bị, không biến thành tỷ lệ thành công của Outcome.
4. **Linked:** chỉ số theo hợp đồng nguồn và bộ lọc được cấu hình rõ; M03 phải chọn `distinct Places` hay `Visit count`, M04 phải chọn `Trip status` hay đối tượng khác, M07 cung cấp tiết kiệm/tiền theo quyền. Có `last_updated`/trạng thái nguồn khi dữ liệu stale/unavailable; không giữ số cũ như dữ liệu thời gian thực không giải thích.

## 5.5. Quy tắc cộng tác và đóng Goal

- Mỗi Goal Active có **một điều kiện hoàn thành chính**, các bước phụ có thể tồn tại nhưng không làm sai con số.
- Owner Confirmation: chủ sở hữu hoặc người được ủy quyền theo quyền có thể chốt sau khi điều kiện đạt; cần recorded confirmation.
- Both Confirmation: nếu Goal chung yêu cầu A+B, mỗi người xác nhận cho chính mình; sau khi sửa điều kiện/target có ý nghĩa, hệ thống phải xác minh confirmation còn hiệu lực, không sử dụng xác nhận cũ sai phiên bản.
- Đã đạt giá trị target không đồng nghĩa tự Completed; nếu thiếu xác nhận, hiển thị sẵn sàng xác nhận hoặc chờ người còn lại.
- Mở lại Goal làm thay đổi current/target không được xóa confirmation/history đã xảy ra; Achievement cũ vẫn ghi phiên bản và thời điểm cũ.

## 5.6. Nguyên tắc ngày, giờ và số liệu

- Deadline là ngày lịch trừ khi người dùng đã đặt giờ cụ thể qua M05; không tự giả giờ 00:00 hay làm lệch ngày theo timezone thiết bị.
- Progress Record gồm thời gian ghi nhận và nếu cần `effective date` riêng, không hoán đổi hai khái niệm.
- Các chỉ số thống kê được tính theo người xem và quyền; nội dung Private không được suy ra qua số đếm, tiến độ, biểu đồ hoặc gợi ý.
- Numeric Goal có thể dùng nhiều đơn vị phi tiền khác nhau nhưng không tự cộng/đổi đơn vị không tương thích. Financial goals phải qua M07; phép quy đổi tiền tệ thuộc M07.

# 6. Sitemap và 18 màn hình nghiệp vụ

| ID | Giao diện | Mục đích |
|---|---|---|
| BG-01 | Dreams & Goals Home | Người dùng xem tổng quan Wish gần đây, Goal Active, các mốc sắp đến và Achievements. |
| BG-02 | Bucket List | Danh sách mong muốn dạng card/list theo bộ lọc, có sắp xếp và phân trang khi nhiều dữ liệu. |
| BG-03 | Add/Edit Wish | Tạo nhanh chỉ cần title; tùy chọn mô tả, ảnh M02, category, tag, priority, timeframe, owner/visibility. |
| BG-04 | Wish Detail | Đọc câu chuyện, nguồn gốc, ảnh, trạng thái, notes, Goal liên kết, lịch sử. |
| BG-05 | Wish Collections | Quản lý các collection cá nhân/chung với danh sách thành viên và thứ tự Wish. |
| BG-06 | Goals Dashboard | Xem các Goals theo status/priority/owner, tiến độ và các mốc cần chú ý. |
| BG-07 | Create/Edit Goal | Wizard hoặc form từng bước có Draft, xác định Goal Type, đo, quyền, thành viên, target và deadline. |
| BG-08 | Goal Detail | Trang điều phối Goal gồm header, tiến độ chính, milestone, task, contributor, links, lịch sử. |
| BG-09 | Milestones & Tasks | Danh sách phân cấp đơn giản cho Goal, thao tác theo quyền và người phụ trách. |
| BG-10 | Progress Tracker | Giao diện cập nhật tiến độ theo loại Goal, kèm lịch sử và nguyên nhân. |
| BG-11 | Personal & Shared | Bộ lọc nội dung cá nhân/chung, quản lý thành viên và phạm vi cộng tác. |
| BG-12 | Goal Calendar | Xem deadline và milestone ở ngữ cảnh Goal và liên kết tới M05. |
| BG-13 | Goal Budget | Hiển thị số liệu tiết kiệm/ngân sách đọc từ M07 trong phạm vi quyền. |
| BG-14 | Inspiration Board | Ghim ảnh/video M02, nguồn tham khảo, ghi chú và đối tượng M03/M04. |
| BG-15 | Achievements & Memories | Danh sách dấu mốc và chi tiết đạt thành tựu, dẫn tới M01/M08. |
| BG-16 | Search & Filters | Tìm Wish/Goal/Milestone/Task/Achievement tùy quyền và scope. |
| BG-17 | Insights & Statistics | Tổng hợp theo nhóm được phép xem, không xếp hạng con người. |
| BG-18 | Permissions, History & Trash | Quản lý quyền, lịch sử thay đổi, archive/trash/restore/export trong cùng ngữ cảnh. |

## 6.1. Chuẩn giao diện xuyên màn hình

- **Trạng thái:** loading, empty, error/retry, permission denied, deleted/archived, stale linked source, unsaved/sync pending, concurrent conflict, success verified. Không dùng “Đã lưu” nếu chưa xác nhận lưu.
- **Navigation:** M06 Home → Bucket List/Goals → Wish/Goal Detail → Task/Progress/Related Content. Mobile cho phép quay lại không mất dữ liệu đã nhập; desktop có panel và điều hướng bàn phím phù hợp.
- **M02 media:** chọn asset theo quyền; khi không đủ quyền thay bằng placeholder trung tính, không lộ thumbnail/filename.
- **Mutation feedback:** thêm/sửa/xóa/mời/xác nhận phải có phản hồi dễ hiểu và cách phục hồi khi có lỗi.
- **No fake dates:** thời gian không xác định phải hiển thị “Chưa xác định”, không điền ngày hôm nay mặc định như đã quyết định.
- **Accessibility:** tương phản, trạng thái không chỉ bằng màu, label cho nút/chọn, thông báo lỗi gần trường và điều hướng bàn phím.

## 6.2. Đặc tả chi tiết BG-01–BG-18

### BG-01 — Dreams & Goals Home

**Mục đích và phạm vi:** Người dùng xem tổng quan Wish gần đây, Goal Active, các mốc sắp đến và Achievements.

**Dữ liệu và thành phần hiển thị:** Thẻ Wish mới, Active Goal có tiến độ hợp lệ, upcoming milestones, achievements, tạo nhanh Wish/Goal, trạng thái trống.

**Tác vụ người dùng:** Mở Wish/Goal, lọc cá nhân/chung, bắt đầu tạo mới, chuyển sang thống kê.

**Quy tắc/kiểm soát bắt buộc:** Thẻ phản ánh quyền hiện hành; không hiển thị mục tiêu Private của người kia; không lấy expired progress làm giá trị hiện tại vô điều kiện.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Chưa có nội dung: lời mời tạo Wish đầu tiên; không có quyền: không hiện teaser Private; nguồn metric lỗi: nhãn chưa đồng bộ.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-02 — Bucket List

**Mục đích và phạm vi:** Danh sách mong muốn dạng card/list theo bộ lọc, có sắp xếp và phân trang khi nhiều dữ liệu.

**Dữ liệu và thành phần hiển thị:** Ảnh, title, category/tags, priority, status, tác giả trong phạm vi quyền, liên kết tới Goal/Collection.

**Tác vụ người dùng:** Tìm, lọc, chuyển chế độ card/list, chọn nhiều Wish thêm Collection nếu có quyền.

**Quy tắc/kiểm soát bắt buộc:** Wish có thể còn Wishlisted dù đã có liên kết; không tự xóa khỏi danh sách khi Planned/Fulfilled, bộ lọc quyết định hiển thị.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Không có kết quả, Wish bị archive, đồng thời thay quyền, media preview không có quyền.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-03 — Add/Edit Wish

**Mục đích và phạm vi:** Tạo nhanh chỉ cần title; tùy chọn mô tả, ảnh M02, category, tag, priority, timeframe, owner/visibility.

**Dữ liệu và thành phần hiển thị:** Form ngắn có Save, cancel, trạng thái lưu, gợi ý trùng không bắt buộc.

**Tác vụ người dùng:** Tạo, sửa, đính ảnh/ghi chú/link, chọn Private/Shared chủ đích.

**Quy tắc/kiểm soát bắt buộc:** Validate tên có nội dung; Private mặc định; đổi quyền phải kiểm tra liên kết/tài nguyên Private.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Link không tải được: vẫn lưu mô tả; trùng title: gợi ý, không auto merge; mạng mất: chưa lưu.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-04 — Wish Detail

**Mục đích và phạm vi:** Đọc câu chuyện, nguồn gốc, ảnh, trạng thái, notes, Goal liên kết, lịch sử.

**Dữ liệu và thành phần hiển thị:** Title/status, why, cover/inspiration, Collections, linked goals/content, actions.

**Tác vụ người dùng:** Edit, Share, Add to Collection, Create Goal, Mark Fulfilled, Drop, Archive, Trash.

**Quy tắc/kiểm soát bắt buộc:** Fulfilled trực tiếp hợp lệ; Create Goal không xóa Wish; các linked content có ACL riêng.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Goal đã có: cảnh báo tạo trùng; thiếu quyền link: hidden/restricted; Wish bị xóa trong tab khác.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-05 — Wish Collections

**Mục đích và phạm vi:** Quản lý các collection cá nhân/chung với danh sách thành viên và thứ tự Wish.

**Dữ liệu và thành phần hiển thị:** Collection title/cover, visibility, sort order, membership, notes và quyền.

**Tác vụ người dùng:** Create, rename, reorder, add/remove Wish, share collection, archive/delete.

**Quy tắc/kiểm soát bắt buộc:** Remove membership không xóa Wish; Shared Collection không auto grant Wish Private.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Wish bị thu hồi quyền: mất card; hai người cùng thêm Wish không ghi đè; collection xóa giữ Wish.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-06 — Goals Dashboard

**Mục đích và phạm vi:** Xem các Goals theo status/priority/owner, tiến độ và các mốc cần chú ý.

**Dữ liệu và thành phần hiển thị:** Draft/Active/Paused/Completed, các Goal có tiến độ, deadline/overdue, filter.

**Tác vụ người dùng:** Tạo Goal, mở chi tiết, tìm, lọc cá nhân/chung, chọn mục tiêu nổi bật.

**Quy tắc/kiểm soát bắt buộc:** Overdue là nhãn, không tự Failed; không hiển thị dữ liệu metric stale như mới nhất.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Không có Goal, số đo chưa có, source inaccessible, Goal chuyển trạng thái giữa 2 tab.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-07 — Create/Edit Goal

**Mục đích và phạm vi:** Wizard hoặc form từng bước có Draft, xác định Goal Type, đo, quyền, thành viên, target và deadline.

**Dữ liệu và thành phần hiển thị:** Name, why, type, completion criteria, metric definition, owner/contributors, privacy, links.

**Tác vụ người dùng:** Save Draft, validate & Activate, edit target, choose confirmation, link Wish, Cancel.

**Quy tắc/kiểm soát bắt buộc:** Mỗi type có điều kiện Active; thay definition phải ghi phiên bản; quyền mặc định Private.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Numeric target=0; source linked không đủ quyền; target đổi sau history; nhập nhầm đơn vị.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-08 — Goal Detail

**Mục đích và phạm vi:** Trang điều phối Goal gồm header, tiến độ chính, milestone, task, contributor, links, lịch sử.

**Dữ liệu và thành phần hiển thị:** Status/owner, progress value và nguồn, upcoming milestones, key tasks, evidence.

**Tác vụ người dùng:** Pause/Resume, Update Progress, Add Milestone/Task, Link Source, Confirm Complete, Edit, Share.

**Quy tắc/kiểm soát bắt buộc:** Không auto Completed 100%; dữ liệu nguồn và mức độ tin cậy phải rõ.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Hai người cùng sửa target; Goal Completed chờ cả hai confirm; source stale.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-09 — Milestones & Tasks

**Mục đích và phạm vi:** Danh sách phân cấp đơn giản cho Goal, thao tác theo quyền và người phụ trách.

**Dữ liệu và thành phần hiển thị:** Milestone với tiêu chí, Task có status, assignee, optional date, notes/order.

**Tác vụ người dùng:** Add/Edit/Reorder/Assign/Mark Done/Skip/Cancel, xem lịch sử task.

**Quy tắc/kiểm soát bắt buộc:** Done Task không auto Goal Complete; nếu xóa milestone có task cần chọn giải pháp xử lý.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Task bị delete giữa lúc edit; hai người cùng thêm task; người giao chưa đồng ý.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-10 — Progress Tracker

**Mục đích và phạm vi:** Giao diện cập nhật tiến độ theo loại Goal, kèm lịch sử và nguyên nhân.

**Dữ liệu và thành phần hiển thị:** Numeric value; Checklist numerator/denominator; Outcome trạng thái; Linked source status.

**Tác vụ người dùng:** Cập nhật current, ghi chú, xem lịch sử, xác nhận nếu đủ điều kiện.

**Quy tắc/kiểm soát bắt buộc:** Không chia 0; giữ 14/12 thực; không chỉnh trực tiếp linked finance số dư M07.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Giá trị nhập sai kiểu, quyền sửa mất, nguồn stale, cập nhật trùng được gửi lại.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-11 — Personal & Shared

**Mục đích và phạm vi:** Bộ lọc nội dung cá nhân/chung, quản lý thành viên và phạm vi cộng tác.

**Dữ liệu và thành phần hiển thị:** Wish/Goal Private/Shared, vai trò Owner/Editor/Contributor/Viewer.

**Tác vụ người dùng:** Share, revoke, chọn vai trò, xem trạng thái lời mời/phân công.

**Quy tắc/kiểm soát bắt buộc:** Không công khai Wish Private qua Goal Shared; contributor chỉ sửa phạm vi được cấp.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Bị thu hồi khi đang sửa; chuyển Private→Shared có evidence Private; hidden statistics.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-12 — Goal Calendar

**Mục đích và phạm vi:** Xem deadline và milestone ở ngữ cảnh Goal và liên kết tới M05.

**Dữ liệu và thành phần hiển thị:** Các mốc có ngày, trạng thái Event link, nhắc nhở do M05 sở hữu.

**Tác vụ người dùng:** Add to Calendar, Open Event, update deadline, unlink nếu được phép.

**Quy tắc/kiểm soát bắt buộc:** Không auto tạo trùng Event; delete Calendar Event không xóa Goal; mốc chưa có ngày không đặt giả.

**Trạng thái rỗng, lỗi và tình huống cạnh:** M05 sync failed; changed deadline concurrent; event không còn quyền.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-13 — Goal Budget

**Mục đích và phạm vi:** Hiển thị số liệu tiết kiệm/ngân sách đọc từ M07 trong phạm vi quyền.

**Dữ liệu và thành phần hiển thị:** Savings Goal linked, target/current, currency, update state, owned-by M07.

**Tác vụ người dùng:** Open in Budget, connect/unlink Savings Goal, refresh trạng thái.

**Quy tắc/kiểm soát bắt buộc:** Không sửa ledger tại M06; không cộng trùng nếu nhiều goals link một source.

**Trạng thái rỗng, lỗi và tình huống cạnh:** M07 chưa triển khai/không quyền; currency khác; stale cache; source deleted.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-14 — Inspiration Board

**Mục đích và phạm vi:** Ghim ảnh/video M02, nguồn tham khảo, ghi chú và đối tượng M03/M04.

**Dữ liệu và thành phần hiển thị:** Media refs, external URL, manual notes, ordering, permission.

**Tác vụ người dùng:** Add/remove/reorder, open media source, edit description/link.

**Quy tắc/kiểm soát bắt buộc:** Không clone M02; xóa Goal không xóa media; link ngoài không được tự trust.

**Trạng thái rỗng, lỗi và tình huống cạnh:** External URL dead; media in Trash; photo Private trong board Shared.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-15 — Achievements & Memories

**Mục đích và phạm vi:** Danh sách dấu mốc và chi tiết đạt thành tựu, dẫn tới M01/M08.

**Dữ liệu và thành phần hiển thị:** Ngày đạt, nguồn Wish/Goal, participants, evidence, notes, historical goal version.

**Tác vụ người dùng:** Create/view/edit allowed evidence, link Diary/Photobook/Special Moment, reopen Goal.

**Quy tắc/kiểm soát bắt buộc:** Không tạo achievement giả khi progress 100%; bảo toàn lịch sử sau reopen.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Evidence inaccessible, Goal deleted, target modified, source link missing.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-16 — Search & Filters

**Mục đích và phạm vi:** Tìm Wish/Goal/Milestone/Task/Achievement tùy quyền và scope.

**Dữ liệu và thành phần hiển thị:** Search title/tag/category, status, owner, year, linked module, progress.

**Tác vụ người dùng:** Apply/reset filters, sort, open content; pagination.

**Quy tắc/kiểm soát bắt buộc:** Kết quả/đếm/gợi ý chỉ từ nội dung có quyền; query không dò được Private ID.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Empty result, stale index, quyền thu hồi, thay status gần như đồng thời.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-17 — Insights & Statistics

**Mục đích và phạm vi:** Tổng hợp theo nhóm được phép xem, không xếp hạng con người.

**Dữ liệu và thành phần hiển thị:** Wishes, fulfilled, active/completed, milestones upcoming, overdue, categories, achievements.

**Tác vụ người dùng:** Filter personal/shared, period, category, open underlying list.

**Quy tắc/kiểm soát bắt buộc:** Không tính Private của người kia; distinct count đúng; thiếu metric không tính là 0.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Không có dữ liệu, inconsistent source, timezone period boundary, archived filters.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

### BG-18 — Permissions, History & Trash

**Mục đích và phạm vi:** Quản lý quyền, lịch sử thay đổi, archive/trash/restore/export trong cùng ngữ cảnh.

**Dữ liệu và thành phần hiển thị:** Audit entry, roles, Trash date/retention, related link warnings, export scope.

**Tác vụ người dùng:** Share/revoke, archive, soft delete, restore, request export, inspect history.

**Quy tắc/kiểm soát bắt buộc:** Trash ≥30 ngày; no cascading delete; sửa/xóa cấp dữ liệu phải check ACL.

**Trạng thái rỗng, lỗi và tình huống cạnh:** Linked data permanently gone, restore conflicts, export content no longer permitted.

**Acceptance tối thiểu:** Màn hình truy cập được trên desktop lẫn điện thoại; chỉ tải thông tin mà tài khoản có quyền, không có thao tác giả; đường chuyển sang nội dung nguồn hoạt động khi liên kết hợp lệ; sau mỗi cập nhật hiển thị trạng thái mới hoặc báo lỗi nhất quán. Trường hợp cộng tác từ phiên khác phải cập nhật hợp lệ hoặc thông báo phiên bản thay đổi trước khi lưu tiếp.

# 7. UX nghiệp vụ chi tiết: Wish, Collections và chuyển đổi

## 7.1. Quick Add Wish

- **Entry points:** M06 Home, Bucket List, từ link M03 Place, từ M04 Dream Trip nếu phân hệ nguồn có quyền tạo link. Entry từ phân hệ khác chỉ là gợi ý, không auto tạo Wish không có xác nhận.
- **Minimal form:** Title là bắt buộc duy nhất do người dùng nhập. Status Wishlisted và Private mặc định. Mô tả/why/tags/ảnh/priority là tùy chọn.
- **Duplicate handling:** so sánh bản ghi có quyền đọc theo title/links, hiển thị gợi ý khi có khả năng trùng; không từ chối mọi Wish cùng tên vì hai mong muốn có thể khác nghĩa.
- **Save states:** đang lưu, đã lưu, chưa lưu, lỗi; nếu tạo trùng vì gửi yêu cầu lại cần có bảo vệ ở mức nghiệp vụ, không tạo hai card âm thầm.
- **Share:** sau khi tạo Private, owner có thể chủ động cấp quyền; cảnh báo media/notes/links riêng tư đi kèm.

## 7.2. Collection lifecycle

- Collection cá nhân/chung, title, cover tùy chọn, mô tả, thứ tự, ACL, thành viên và ghi chú.
- Một Wish có thể ở nhiều Collection nhưng chỉ một bản gốc; membership có danh tính riêng để thêm/gỡ/idempotency mà không xóa Wish.
- Shared Collection không phải backdoor xem Wish Private. Card không có quyền phải ẩn hoàn toàn hoặc hiển thị thông báo chung không làm lộ tên/số lượng riêng tư (tùy thiết kế quyền đã chốt).
- Delete Collection phải cảnh báo: chỉ xóa danh sách/membership, không xóa Wish; có Trash/Restore phù hợp theo chính sách nền tảng.

## 7.3. Convert Wish to Goal

1. Chọn Create Goal from Wish; hiển thị thông tin có thể tái sử dụng: tên/why/cover/related links nhưng phải kiểm tra quyền ở thời điểm này.
2. Nếu Wish đã có Goal liên kết, hiện lựa chọn mở Goal hiện có hoặc tạo Goal khác và giải thích hệ quả.
3. Chọn type, tiêu chí hoàn thành, mode quyền, owner và các trường bắt buộc; cho Save Draft khi thiếu cấu hình.
4. Khi lưu, tạo Goal **độc lập** và mối liên kết provenance. Không xóa/ghi đè Wish. Quyền Goal mặc định Private, kể cả Wish gốc đang Shared, trừ khi người dùng cố ý chia sẻ.
5. Sau khi liên kết, có thể cập nhật Wish thành Planned khi người dùng chọn. Không tự đánh dấu Fulfilled.
6. Nếu tạo Goal thất bại, Wish phải còn nguyên; không được để UI báo đã chuyển thành công khi không có Goal hợp lệ.

## 7.4. Mark Wish Fulfilled trực tiếp

- Cho phép từ Wish Detail mà không cần Goal. Ngày thực hiện/ghi chú/ảnh/Visit/Trip là tùy chọn theo dữ liệu thực tế, không tạo bản giả.
- Có thể tạo Achievement/kỷ niệm theo hành động người dùng; không tự công khai hay tạo nội dung M08.
- Wish Fulfilled vẫn có thể còn trong Collections và hiện trong bộ lọc kỷ niệm.

# 8. Goal Creation, cấu hình và lịch sử phiên bản

## 8.1. Kích hoạt Goal theo kiểu

| Kiểu | Điều kiện tối thiểu trước Active | Tiến độ chính | Không được làm |
|---|---|---|---|
| Checklist | Định nghĩa rõ tập việc hợp lệ và cách loại Skipped/Cancelled; có thể có 0 task nhưng progress là chưa có cơ sở | Done/eligible | Tự 100% khi không có task |
| Numeric | Target > 0, current hợp lệ, đơn vị/cách ghi nhận nhất quán | current/target | Cắt current thật về target; chia 0 |
| Outcome | Tiêu chí kết quả và người xác nhận | trạng thái outcome | Tự tạo phần trăm outcome từ task preparation |
| Linked | Chọn loại nguồn, quyền đọc, scope/filter, phép đo và điều kiện hoàn thành | kết quả từ nguồn | Lấy sai bản ghi, đếm trùng, sửa số dư nguồn |

## 8.2. Thay đổi cấu hình có tác động

- Đổi tên/mô tả không nhất thiết thay progress definition.
- Đổi Target (12→20), Unit (km→m), Metric Type, lọc thời gian hay đếm distinct → Visit làm đổi ý nghĩa Progress: phải đánh dấu version mới và bảo toàn lịch sử. Với đổi đơn vị có phép quy đổi hợp lệ, thể hiện kết quả và xác nhận người dùng; nếu không có cách đổi phù hợp, không tự quy đổi.
- Với Goal Completed, Reopen/Extend là thao tác có chủ đích và cần lịch sử, bảo toàn Achievement 12/12 trước đó. Nếu thay đổi bản chất Goal quá nhiều, đề xuất tạo Goal mới và link nguồn.
- Không cho 2 tài khoản đồng thời ghi một định nghĩa mới mà không phát hiện conflict. Với thay đổi ở trường độc lập (mô tả và tag), có thể giữ cả hai khi có cơ chế merge an toàn.
- Một Goal có thể liên kết nhiều Wish/nguồn; mọi liên kết phải có kiểu và ý nghĩa, không được biến liên kết thành quyền chung.

## 8.3. Deadline và Overdue

- Deadline tùy chọn, ngày lịch có thể chưa xác định; khi quá hạn và Goal Active, hiển thị `Overdue`, không tự chuyển Failed/Cancelled.
- M05 quản lý Reminder/Calendar Event; thêm deadline trong M06 không nhất thiết tự tạo Event. Chọn Add to Calendar mới tạo/link theo quy trình M05.
- Thay deadline từ M06 khi Event đã liên kết phải đồng bộ theo hợp đồng thời gian M05; lỗi phải hiển thị trạng thái cần xử lý.

# 9. Milestones, Tasks, tiến độ và xác nhận

## 9.1. Milestone

Milestone có ID riêng, title, status, optional owner/target date, tiêu chí đạt và optional Tasks. Hệ thống có thể gợi ý hoàn thành khi các task Done, nhưng không tự coi Milestone Completed khi còn điều kiện riêng. Xóa Milestone có task phải đưa ra lựa chọn: chuyển task lên Goal, chuyển sang milestone khác hợp lệ, hoặc xóa cùng theo quyền và cảnh báo. Chuyển một task giữa milestones giữ danh tính và lịch sử.

## 9.2. Task

Task có thể không có ngày, có nhiều assignees, có ghi chú/ảnh/link. Người được assign không bị mặc định có quyền sửa cấu hình toàn Goal, không tự coi họ đã đồng ý. Done/Skipped/Cancelled phải có người cập nhật và mốc thời gian khi phù hợp; Undo Done theo quyền phải ghi dấu vết. Các Task độc lập thêm đồng thời cần tồn tại cùng nhau.

## 9.3. Numeric update

Khi cập nhật current, màn hình trình bày old → new, unit, reason tùy chọn, người ghi nhận, trạng thái lưu. Cho phép giảm giá trị khi hợp lệ, ví dụ sửa dữ liệu nhầm; lưu history không chỉ số sau cùng. `target > 0` là điều kiện active. Với linked progress, nút cập nhật dẫn đến module nguồn (ví dụ M07) thay vì chỉnh balance giả ở M06.

## 9.4. Checklist metric

Mẫu số gồm Task eligible theo định nghĩa; Cancelled loại khỏi tính; Skipped vẫn thuộc mẫu số trừ khi owner có quyền xác nhận loại ra khỏi scope; Task mới thêm làm mẫu số thay đổi. Nếu 0 task eligible: hiện “Chưa có công việc để tính tiến độ”. Không cần hiển thị 0% giả khi metric không xác định. Goal Completed vẫn cần xác nhận dù mọi Task Done.

## 9.5. Confirmation & Achievement

- Owner Confirmation là mặc định; Both Confirmation phải có A+B xác nhận riêng khi mục tiêu được chia sẻ theo cấu hình.
- Nếu sửa Goal Definition sau khi A đã xác nhận nhưng B chưa, phải kiểm tra các xác nhận cũ còn áp dụng đúng phiên bản hay không; không dùng lại xác nhận sai context.
- Khi đủ quyền + điều kiện, chuyển Completed, ghi ngày đạt/thời điểm xác nhận/nguồn; cho người dùng tạo Achievement và chọn evidence.
- Achievement không tự phát hành thành Special Moment M08 hoặc Photobook M01; người dùng chọn nội dung và quyền trước khi liên kết.
- Sau Reopen/Extend, giữ Achievement lịch sử, không tính nó như đã hoàn thành target mới.

# 10. Phân quyền chi tiết và an toàn dữ liệu

## 10.1. Ma trận quyền mặc định

| Hành vi | Owner | Editor | Contributor | Viewer |
|---|---|---|---|---|
| Xem Wish/Goal được cấp | Có | Có | Có | Có |
| Sửa title/why/configuration | Có | Có theo quyền | Không mặc định | Không |
| Tạo/sửa Milestone | Có | Có | Khi được ủy quyền | Không |
| Thêm Task | Có | Có | Trong phạm vi được cấp | Không |
| Đánh dấu Task được giao | Có | Có | Có nếu được cấp | Không |
| Sửa tiến độ thủ công | Có | Có | Nếu có quyền riêng | Không |
| Xác nhận Goal Completed | Theo mode | Khi được ủy quyền và theo mode | Theo mode chỉ khi vai trò đủ | Không |
| Chia sẻ / thu hồi quyền | Có | Chỉ khi được ủy quyền | Không | Không |
| Xóa mềm | Có | Theo quyền cụ thể | Không | Không |
| Xóa vĩnh viễn | Chủ có quyền và theo quy trình | Không mặc định | Không | Không |
| Xem tài nguyên liên kết riêng tư | Chỉ khi có quyền nguồn | Chỉ khi có quyền nguồn | Chỉ khi có quyền nguồn | Chỉ khi có quyền nguồn |

`Owner Confirmation` không nghĩa là mọi Editor tự được chốt; `Both Confirmation` không đồng nghĩa một người có thể xác nhận hộ. Phân quyền M06 không thay quyền M02/M03/M04/M05/M07/M08.

## 10.2. Kế thừa và ngoại lệ

- Một Goal Shared có Wish Private chỉ cho người xem thấy Goal và metadata hợp lệ; không được lộ title/preview/source của Wish Private.
- Collection Shared chỉ cấp quyền lên bản Collection/membership được phép xem, không auto-grant một Wish Private.
- Inspiration Board có Media Private: không dùng thumbnail, metadata, tên file, cover, số lượng ẩn để tiết lộ tài nguyên vượt quyền. Khi chia sẻ, chủ nội dung phải lựa chọn quyền file theo cơ chế M02.
- Participant có quyền xem Goal không đương nhiên được xem Savings transactions trong M07; có thể hiển thị tổng hợp được M07 cho phép.
- Quyền phải kiểm tra lại khi đọc, xuất, search, tạo notification, lấy media và mỗi mutation; UI-only hiding không đủ.
- Nội dung link nguồn bị thu hồi quyền: ẩn/ghi trạng thái không truy cập, không tự copy snapshot chứa dữ liệu nhạy cảm để lách quyền.

## 10.3. Cộng tác và ghi đè

- Các thao tác thêm mới độc lập (2 Tasks/2 Notes) phải cùng được lưu.
- Sửa cùng trường cấu hình (target/type/deadline) phải phát hiện conflict hoặc có cơ chế nhất quán được kiểm tra, không last-write-wins âm thầm.
- Sửa các trường không xung đột được phép merge an toàn, tránh mất dữ liệu.
- Thứ tự Task/Milestone khi thay đổi đồng thời phải nhất quán; không mất/nhân bản ID.
- Thu hồi quyền giữa phiên phải từ chối các mutation mới vượt quyền, thông báo trạng thái bản nháp chưa lưu.
- Không cần live cursor hay word-level realtime collab như M01; chỉ cần cộng tác an toàn theo D21.

## 10.4. Nhật ký và bảo mật

Ghi các thay đổi quan trọng: đổi target/unit/type/metric scope, update progress, status, role, source link, completion confirmation, archive/delete/restore. History và audit view vẫn theo quyền; nếu người không có quyền xem lịch sử của đối tượng, không dùng history endpoint để lộ dữ liệu. Không tự ghi giữ thông tin nhạy cảm hơn mức cần thiết trong notification/activity log.

# 11. Hợp đồng tích hợp xuyên phân hệ

## 11.1. M01 — Photobook & Diary

**Nguồn sở hữu:** M01 sở hữu Diary, page, book, snapshots và Published snapshots. M06 có thể tham chiếu nhật ký hành trình hoặc tạo Diary về Achievement theo hành động người dùng. Khi tạo Photobook hoặc Diary từ Goal, nội dung được đưa sang M01 theo quyền, không ghi đè Goal hoặc tự xuất bản. Link bị xóa/thu quyền phải được ẩn, nhưng Goal/Achievement còn nguyên. **P0:** mở liên kết, chọn nội dung có quyền, lưu quan hệ đúng; không phát triển Editor M01 riêng.

## 11.2. M02 — Memories & Media Library

**Nguồn sở hữu:** M02 giữ original JPEG/PNG/WebP/HEIC, MP4/MOV, variants, Album/Asset ACL, Trash và backup. M06 lưu media asset link cho cover, Inspiration Board, evidence, không tạo original mới nếu người dùng chọn ảnh có sẵn. Album Shared không tự grant Media Private. Khi media bị xóa hoặc hết quyền, dùng placeholder/restricted state; không copy public thumbnail sang M06 để lách ACL. Không tự xóa original nếu xóa Wish/Goal.

## 11.3. M03 — Food & Places

**Nguồn sở hữu:** M03 quản lý Place/Visit, wishlist, rating, món, favorites/revisit. M06 có thể:
- Link Wish “Thử quán A” tới Place; không tự tạo Visit.
- Numeric/Linked Goal “Khám phá 10 địa điểm mới” **chọn distinct Place IDs** có Visit hợp lệ trong phạm vi ngày, người tham gia, trạng thái/ACL đã cấu hình. Place B ghé 3 lần vẫn tính 1 Place nếu chọn distinct.
- Goal “Đi cafe 10 lần” có thể chọn **Visit count**, nghĩa khác với distinct Place count. Không đổi phép đo mà không tạo version/giải thích.
- Bỏ Visit/hạn chế quyền làm tiến độ được tính lại hoặc đánh dấu nguồn stale; không giữ số cũ mà không nhãn.
- Source data quyền riêng: nếu Goal Shared nhưng Visit thuộc một người Private, không xuất dữ liệu chi tiết hoặc số tổng hợp tiết lộ Visit Private ngoài hợp đồng quyền M03.

## 11.4. M04 — Travel & Trip Planner

**Nguồn sở hữu:** M04 sở hữu Trip trạng thái Dreaming/Planning/Ready/In Progress/Completed, Itinerary, Transport, Accommodation, Booking, checklist du lịch. M06 Goal có thể link Trip, đọc trạng thái, nhưng hoàn thành Trip **không tự Completed Goal** nếu còn điều kiện khác hoặc xác nhận chưa xong. Nếu Trip Cancelled/Archived/Deleted hoặc người xem không có quyền, hiện trạng thái nguồn thích hợp; không tự xóa Goal hoặc sửa Trip. Wish có thể link Dream Trip nhưng không ép ngày khởi hành.

## 11.5. M05 — Couple Calendar

**Nguồn sở hữu:** M05 sở hữu Calendar Event, recurrence, reminders, attendee, timezone và event-level ACL. M06 sở hữu Goal deadline/Milestone planned date. Thao tác “Add to Calendar” tạo hoặc link Event có ID duy nhất; retry/đổi deadline không sinh event trùng. Sửa ở M05 phải phản hồi về M06 theo hợp đồng đồng bộ đã chốt của M05. Event xóa không xóa Goal; lỗi sync không được hiển thị đã cập nhật cả hai thành công. Task chưa có ngày không tự tạo Event giờ giả. Reminder do M05 gửi, M06 không tạo lịch nhắc riêng.

## 11.6. M07 — Budget & Savings (chờ BRD M07)

**Hợp đồng yêu cầu của M06, chưa là phê duyệt chi tiết M07:** M07 quản lý Savings Goal, giao dịch, currency, target, actual, quyền chia sẻ, cách chia đóng góp và các quy tắc tài chính. M06 chỉ lưu Savings Goal ref và hiển thị số liệu được cấp theo quyền, có nhãn nguồn/trạng thái. Không lưu balance thứ hai, không chỉnh giao dịch từ Goal Progress tại M06, không cộng trùng khoản chi/số dư khi cùng Savings Goal được link ở nhiều nơi. Mọi chi tiết split/contribution/FX chốt ở M07 và đối chiếu BRD.

## 11.7. M08 — Special Moments (chờ BRD M08)

Achievement có thể liên kết Special Moment hoặc Time Capsule nhưng không tự tạo/đẩy công khai, đặc biệt với nội dung chờ mở theo lịch. Quyền tiết lộ nội dung đến thời điểm đã được phép do M08 sở hữu, M06 không tiết lộ qua cover, search, notification hoặc export trước hạn.

## 11.8. M09 — Couple Interaction (chờ BRD M09)

Bình luận/reaction cho Wish, Goal, Task hoặc Achievement nếu P0 M09 hỗ trợ đối tượng nguồn đó; nội dung interaction kế thừa quyền người xem đối tượng, không trở thành chat real-time độc lập trong M06. Xóa Goal không được tự xóa media gốc; việc xử lý comment/reference cụ thể chốt ở M09.

## 11.9. M10 — Personalization & Settings (chờ BRD M10)

Giao diện tùy chỉnh categories, ngôn ngữ/format, theme, privacy, notification preferences, security và permissions theo chuẩn toàn hệ thống. Global theme hiện đại, riêng sách M01 scrapbook. Cấu hình theme không làm thay đổi điều kiện Goal, status hoặc ACL.

## 11.10. Trình tự xử lý liên kết an toàn

1. **Before link:** kiểm tra quyền nguồn của người tạo, loại quan hệ và bản ghi nguồn hiện có; hiển thị mô tả rõ quyền được giữ.
2. **Link commit:** lưu quan hệ độc lập, không sao chép toàn bộ bản ghi nguồn; đảm bảo không tạo trùng link cùng mục đích do retry.
3. **Read:** kiểm tra cả quyền Goal và quyền nguồn trước khi hiển thị metadata và số liệu. Khi nguồn stale/unavailable/trashed, có trạng thái riêng, không khiến toàn Goal lỗi.
4. **Update:** nguồn sở hữu quyết định thao tác ở nguồn; M06 chỉ thay thông tin nó sở hữu. Thao tác nguồn → M06 có kiểm soát phiên bản/độ trễ.
5. **Unlink:** gỡ quan hệ không xóa source; có confirm nếu tác động đến progress hay definition.
6. **Delete/Restore:** kiểm tra phụ thuộc, không cascade; restore chỉ nối lại những reference còn hợp lệ.
7. **Export/Backup:** hỗ trợ xuất bản ghi/link hợp lệ trong phạm vi quyền; phục hồi thống nhất ID và tránh clone record nguồn.

# 12. 20 Use Cases chi tiết

| Mã | Use Case | Mục tiêu chính |
|---|---|---|
| UC-M06-01 | Create Private Wish | Wish hợp lệ được lưu, B không thấy qua Search, Home, Collections hoặc Insights. |
| UC-M06-02 | Share Wish | Chia sẻ có chủ đích, quyền nguồn giữ nguyên, thu hồi có hiệu lực cho truy cập mới. |
| UC-M06-03 | Create Wish Collection | Chỉ membership thay đổi; Wish gốc không xóa hoặc tự công khai. |
| UC-M06-04 | Convert Wish to Goal | Goal có ID riêng, giữ source Wish, không auto Fulfilled. |
| UC-M06-05 | Create Numeric Goal | Tiến độ tính đúng, không chia 0; mỗi update có nguồn/người/thời điểm. |
| UC-M06-06 | Create Outcome Goal | Outcome chưa Completed trước khi đủ điều kiện và xác nhận. |
| UC-M06-07 | Create Shared Goal | B chỉ thay đổi phạm vi được cấp; tất cả mutations có kiểm soát ACL. |
| UC-M06-08 | Add Milestones & Tasks | Cấu trúc hợp lệ, ID ổn định, không tự Completed Goal. |
| UC-M06-09 | Assign Task | Không tự coi B đã nhận việc hoặc Done khi mới được assign. |
| UC-M06-10 | Update Progress | Lưu đúng, giữ số thực, không tự Completed khi cần xác nhận. |
| UC-M06-11 | Pause / Resume Goal | State thay đổi hợp lệ và history có actor/timestamp. |
| UC-M06-12 | Link M03 Places | Đúng metric/filter/ACL; distinct không tính trùng. |
| UC-M06-13 | Link M04 Trip | Không tự Completed Goal chỉ vì Trip Completed. |
| UC-M06-14 | Link M07 Savings Goal | Không tạo balance thứ hai, không lộ giao dịch tài chính Private. |
| UC-M06-15 | Add Goal Deadline to M05 | Không event trùng; Goal giữ deadline; trạng thái đồng bộ minh bạch. |
| UC-M06-16 | Confirm Goal Completion | Không giả mạo confirmation và không auto chốt 100%. |
| UC-M06-17 | Create Achievement | Achievement có nguồn/ngày/phiên bản, không tự công khai. |
| UC-M06-18 | Reopen Completed Goal | History và achievement còn, progress target mới rõ ràng. |
| UC-M06-19 | Archive / Delete / Restore | Không cascade delete; phục hồi nội dung và link còn hợp lệ. |
| UC-M06-20 | Collaborative Goal Editing | Không blind overwrite; tiến độ sau cùng theo definition hợp lệ, đồng bộ cả hai thiết bị. |


## 12.1. Đặc tả theo luồng chính và ngoại lệ

### UC-M06-01 — Create Private Wish

**Tác nhân / tiền điều kiện:** A đã đăng nhập; có quyền tạo Wish

**Trigger và luồng chuẩn:** A nhấn Add Wish; nhập tên “Cùng ngắm cực quang”; tùy chọn ghi vì sao/ảnh; giữ mặc định Private; Save; Wish xuất hiện trong Bucket List của A.

**Nhánh ngoại lệ cần kiểm thử:** Tên rỗng báo lỗi; link/media thất bại không ép người dùng bỏ toàn bộ Wish.

**Hậu điều kiện thành công:** Wish hợp lệ được lưu, B không thấy qua Search, Home, Collections hoặc Insights.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-02 — Share Wish

**Tác nhân / tiền điều kiện:** A sở hữu Wish Private; B có tài khoản Our Space

**Trigger và luồng chuẩn:** A mở Share; chọn B và quyền; xem cảnh báo ảnh/links có ACL riêng; xác nhận; B được truy cập đúng Wish, không tự được xem media Private.

**Nhánh ngoại lệ cần kiểm thử:** Đổi quyền giữa phiên, B bị thu hồi hoặc file M02 chưa Shared.

**Hậu điều kiện thành công:** Chia sẻ có chủ đích, quyền nguồn giữ nguyên, thu hồi có hiệu lực cho truy cập mới.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-03 — Create Wish Collection

**Tác nhân / tiền điều kiện:** Có ít nhất một tài khoản có quyền tạo Collection

**Trigger và luồng chuẩn:** Tạo Collection “Small Joys”; chọn Private/Shared; thêm hai Wish bằng quan hệ; sắp xếp; B cùng thêm Wish khi được cấp quyền; gỡ một Wish khỏi Collection.

**Nhánh ngoại lệ cần kiểm thử:** Wish Private trong shared collection hoặc hai người thêm trùng cùng membership.

**Hậu điều kiện thành công:** Chỉ membership thay đổi; Wish gốc không xóa hoặc tự công khai.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-04 — Convert Wish to Goal

**Tác nhân / tiền điều kiện:** A có quyền xem Wish và tạo Goal

**Trigger và luồng chuẩn:** Từ Wish Detail nhấn Create Goal; xem Goals đã link; chọn tạo mới; chọn type, completion rule, quyền; Save Draft/Activate; xác minh linked provenance; Wish vẫn tồn tại.

**Nhánh ngoại lệ cần kiểm thử:** Thiếu định nghĩa Active; tạo thất bại; link trùng; nguồn Wish thu hồi quyền khi thao tác.

**Hậu điều kiện thành công:** Goal có ID riêng, giữ source Wish, không auto Fulfilled.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-05 — Create Numeric Goal

**Tác nhân / tiền điều kiện:** Có quyền tạo Goal

**Trigger và luồng chuẩn:** Chọn Numeric Goal “Đọc 12 cuốn sách”; target=12; unit=cuốn; current=0; nhập điều kiện hoàn thành; Active; cập nhật current=1; xem 1/12 và history.

**Nhánh ngoại lệ cần kiểm thử:** Target 0, giá trị không hợp lệ hoặc đổi unit giữa chừng.

**Hậu điều kiện thành công:** Tiến độ tính đúng, không chia 0; mỗi update có nguồn/người/thời điểm.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-06 — Create Outcome Goal

**Tác nhân / tiền điều kiện:** Có quyền tạo Goal

**Trigger và luồng chuẩn:** Tạo Goal “Ngắm cực quang”; thêm điều kiện quan sát thực tế và cách xác nhận; thêm các Task chuẩn bị; làm xong các Task; xác nhận outcome khi thực sự đạt.

**Nhánh ngoại lệ cần kiểm thử:** Tất cả Task Done nhưng chưa đạt outcome.

**Hậu điều kiện thành công:** Outcome chưa Completed trước khi đủ điều kiện và xác nhận.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-07 — Create Shared Goal

**Tác nhân / tiền điều kiện:** A có Goal Private và quyền Share

**Trigger và luồng chuẩn:** A cấp B Editor/Contributor; chọn Goal Shared; B truy cập, chỉnh Task được cấp; A thấy thay đổi; hình ảnh nguồn Private không tự mở quyền.

**Nhánh ngoại lệ cần kiểm thử:** B không đủ quyền sửa target hoặc A thu hồi quyền khi B đang thao tác.

**Hậu điều kiện thành công:** B chỉ thay đổi phạm vi được cấp; tất cả mutations có kiểm soát ACL.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-08 — Add Milestones & Tasks

**Tác nhân / tiền điều kiện:** Goal Draft/Active tồn tại

**Trigger và luồng chuẩn:** Tạo milestone “Chuẩn bị trước chuyến đi”; thêm Task “Tìm khách sạn”; thêm Task trực tiếp dưới Goal; sắp xếp; xem phần việc.

**Nhánh ngoại lệ cần kiểm thử:** Milestone không có task; xóa milestone có task đang chạy.

**Hậu điều kiện thành công:** Cấu trúc hợp lệ, ID ổn định, không tự Completed Goal.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-09 — Assign Task

**Tác nhân / tiền điều kiện:** Có quyền phân công

**Trigger và luồng chuẩn:** A mở task; gán cho B; đặt optional due date; lưu; B xem task được giao và đánh dấu In Progress/Done nếu có quyền.

**Nhánh ngoại lệ cần kiểm thử:** B không phản hồi hoặc mất quyền; cùng chỉnh assignment.

**Hậu điều kiện thành công:** Không tự coi B đã nhận việc hoặc Done khi mới được assign.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-10 — Update Progress

**Tác nhân / tiền điều kiện:** Goal Active có metric hợp lệ

**Trigger và luồng chuẩn:** Mở Progress Tracker; nhập current mới hoặc đánh dấu task; validate; xác nhận; ghi giá trị old/new và note; tính toán lại; nếu target đạt đề xuất xác nhận Goal.

**Nhánh ngoại lệ cần kiểm thử:** Network lost, hai updates trùng/đồng thời, current vượt target hoặc giảm số.

**Hậu điều kiện thành công:** Lưu đúng, giữ số thực, không tự Completed khi cần xác nhận.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-11 — Pause / Resume Goal

**Tác nhân / tiền điều kiện:** Goal Active/Paused và có quyền

**Trigger và luồng chuẩn:** Owner chọn Pause; Goal giữ metric và tasks; chọn Resume; trở lại Active, deadline không bị sửa ngầm.

**Nhánh ngoại lệ cần kiểm thử:** Một user khác Cancelled/Archived đồng thời.

**Hậu điều kiện thành công:** State thay đổi hợp lệ và history có actor/timestamp.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-12 — Link M03 Places

**Tác nhân / tiền điều kiện:** Goal Linked hoặc Numeric cấu hình nguồn M03

**Trigger và luồng chuẩn:** Chọn distinct Place count trong khoảng thời gian; link nguồn có quyền; hệ thống đếm 1 Place cho nhiều Visit; ghi Visit mới phù hợp; cập nhật metric.

**Nhánh ngoại lệ cần kiểm thử:** Visit bị xóa/Private; nguồn stale; cùng Place nhiều chi nhánh.

**Hậu điều kiện thành công:** Đúng metric/filter/ACL; distinct không tính trùng.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-13 — Link M04 Trip

**Tác nhân / tiền điều kiện:** Goal có quyền liên kết Trip

**Trigger và luồng chuẩn:** Mở Link Content; chọn Trip có quyền; chọn ý nghĩa Trip status; cập nhật progress khi Trip trạng thái thay đổi; người có quyền xác nhận goal khi đủ điều kiện.

**Nhánh ngoại lệ cần kiểm thử:** Trip Cancelled; linked goal có điều kiện bổ sung; Trip xoá/ACL đổi.

**Hậu điều kiện thành công:** Không tự Completed Goal chỉ vì Trip Completed.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-14 — Link M07 Savings Goal

**Tác nhân / tiền điều kiện:** M07 có Savings Goal được quyền truy cập khi triển khai

**Trigger và luồng chuẩn:** A link Savings Goal; M06 đọc target/current/currency từ M07; xem progress; khi đóng góp ở M07, màn hình M06 cập nhật hoặc đánh dấu đang đồng bộ.

**Nhánh ngoại lệ cần kiểm thử:** Thiếu quyền, multi-currency, source chưa sẵn sàng.

**Hậu điều kiện thành công:** Không tạo balance thứ hai, không lộ giao dịch tài chính Private.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-15 — Add Goal Deadline to M05

**Tác nhân / tiền điều kiện:** Goal có deadline và người dùng chọn Add to Calendar

**Trigger và luồng chuẩn:** Từ Goal mở deadline; chọn thêm Event; M05 create/link event duy nhất; đổi deadline; sự kiện liên kết cập nhật; unlink nếu cần.

**Nhánh ngoại lệ cần kiểm thử:** Retry request, sync fails, Event bị xóa hoặc người dùng hết quyền.

**Hậu điều kiện thành công:** Không event trùng; Goal giữ deadline; trạng thái đồng bộ minh bạch.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-16 — Confirm Goal Completion

**Tác nhân / tiền điều kiện:** Goal đáp ứng criteria; user đủ quyền

**Trigger và luồng chuẩn:** Hệ thống hiển thị ready-to-confirm; nếu Owner mode thì người có quyền xác nhận; nếu Both mode thì A và B xác nhận riêng; khi đủ mới set Completed và ghi version.

**Nhánh ngoại lệ cần kiểm thử:** Một người chưa xác nhận, criteria đổi giữa hai confirmations.

**Hậu điều kiện thành công:** Không giả mạo confirmation và không auto chốt 100%.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-17 — Create Achievement

**Tác nhân / tiền điều kiện:** Wish Fulfilled hoặc Goal Completed hợp lệ

**Trigger và luồng chuẩn:** Mở Create Achievement; gán achieved date, note và media/evidence có quyền; lưu; link Diary M01/Moment M08 nếu người dùng chọn.

**Nhánh ngoại lệ cần kiểm thử:** Evidence Private, M08 chưa cho phép reveal, media bị xóa.

**Hậu điều kiện thành công:** Achievement có nguồn/ngày/phiên bản, không tự công khai.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-18 — Reopen Completed Goal

**Tác nhân / tiền điều kiện:** Goal Completed có achievement và owner đủ quyền

**Trigger và luồng chuẩn:** Chọn Reopen/Extend; xem thông báo tác động; đổi target 12→20; ghi Goal Definition version; Active lại; giữ Achievement cũ ở phiên bản trước.

**Nhánh ngoại lệ cần kiểm thử:** B đã xác nhận ở phiên bản cũ; người đang xem cache cũ.

**Hậu điều kiện thành công:** History và achievement còn, progress target mới rõ ràng.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-19 — Archive / Delete / Restore

**Tác nhân / tiền điều kiện:** Người dùng có quyền trên Wish/Goal

**Trigger và luồng chuẩn:** Archive để ẩn khỏi hoạt động; Delete đưa vào Trash; trong 30 ngày chọn Restore; kiểm tra link/source; xác nhận.

**Nhánh ngoại lệ cần kiểm thử:** Media/Trip/Event nguồn đã bị xóa vĩnh viễn; delete Goal đang có achievement.

**Hậu điều kiện thành công:** Không cascade delete; phục hồi nội dung và link còn hợp lệ.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

### UC-M06-20 — Collaborative Goal Editing

**Tác nhân / tiền điều kiện:** A và B có Editor phù hợp

**Trigger và luồng chuẩn:** Hai người mở Goal; A sửa target, B sửa target từ bản cũ; hệ thống phát hiện conflict; hiển thị cập nhật mới; người dùng xem lại và xác nhận; thử cập nhật trường độc lập.

**Nhánh ngoại lệ cần kiểm thử:** Mất kết nối, B mất quyền giữa phiên, task reorder cạnh tranh.

**Hậu điều kiện thành công:** Không blind overwrite; tiến độ sau cùng theo definition hợp lệ, đồng bộ cả hai thiết bị.

**Tính toàn vẹn:** Nếu bất kỳ bước ghi dữ liệu/đồng bộ liên kết thất bại, chỉ những thay đổi đã thực sự xác nhận mới được hiển thị là hoàn thành; không được sinh bản duplicate do retry và không tự thay đổi bản ghi thuộc phân hệ khác. Log/hiển thị phải tuân thủ quyền ở thời điểm ghi và đọc.

# 13. 74 Business Rules — danh mục chuẩn

Mọi BR có mã bất biến để QA truy vết. Các đoạn văn ở những mục trước giải thích nghiệp vụ; bảng này là danh mục chuẩn áp dụng khi kiểm thử.

| BR-ID | Nhóm | Quy tắc bắt buộc | Cách xác minh |
|---|---|---|---|
| BR-M06-01 | Wish | Wish không bắt buộc có deadline, tiến độ hoặc Task. | Tạo Wish chỉ tên hợp lệ; không đòi trường Goal. |
| BR-M06-02 | Wish | Wish và Goal là hai loại nghiệp vụ riêng. | Lọc/trạng thái/định danh độc lập. |
| BR-M06-03 | Wish→Goal | Chuyển Wish sang Goal phải giữ quan hệ nguồn gốc. | Không xóa Wish, không tạo Goal mất provenance. |
| BR-M06-04 | Goal state | Pause Goal không xóa tiến độ hoặc Task. | Resume hiển thị dữ liệu trước khi pause. |
| BR-M06-05 | Goal state | Deadline đã qua không tự đặt Cancelled/Failed. | Overdue chỉ là nhãn khi Active. |
| BR-M06-06 | Goal state | 100% progress không mặc định tự set Completed. | Bắt buộc áp dụng confirmation mode. |
| BR-M06-07 | Achievement | Goal Completed có thể tiếp tục gắn ảnh/nhật ký. | Không khóa evidence sau ngày đạt. |
| BR-M06-08 | Archive | Archived giữ dữ liệu và lịch sử, không phải xóa. | Có thể tra cứu, restore theo quyền. |
| BR-M06-09 | Collections | Một Wish có thể thuộc nhiều Collection. | Quan hệ N:N, không copy Wish. |
| BR-M06-10 | Collections | Xóa Collection không xóa Wish. | Chỉ ảnh hưởng membership/collection. |
| BR-M06-11 | Privacy | Wish Private không tự chia sẻ vì nằm trong Shared Collection. | Kiểm tra ACL của Wish khi render. |
| BR-M06-12 | Links | Wish có thể liên kết nhiều đối tượng với mục đích rõ. | Typed links, không hiểu là quyền. |
| BR-M06-13 | Wish state | Có thể đánh dấu Wish Fulfilled mà không cần Goal. | Người dùng xác nhận, không tạo Goal giả. |
| BR-M06-14 | Media | Gỡ Wish khỏi Collection không xóa ảnh gốc/Diary. | Không cascade. |
| BR-M06-15 | Goal | Goal được phép không có deadline. | Active không đòi target date. |
| BR-M06-16 | Goal activation | Active Goal bắt buộc có tiêu chí hoàn thành hợp lệ. | Draft có thể thiếu cấu hình. |
| BR-M06-17 | Goal state | Không tự Completed khi đã qua ngày dự kiến. | Status không phụ thuộc đồng hồ đơn thuần. |
| BR-M06-18 | Goal definition | Sửa chỉ tiêu phải giữ history và cảnh báo thay đổi phép đo. | Định nghĩa/target có version. |
| BR-M06-19 | Provenance | Goal có thể liên kết Wish nhưng không tự sửa Wish. | Chỉ thao tác Wish riêng mới đổi Wish. |
| BR-M06-20 | Source ACL | Quyền Goal không cho sửa dữ liệu tài chính hay nguồn khác. | Thao tác nguồn theo ACL nguồn. |
| BR-M06-21 | Task | Task thuộc Goal hoặc Milestone dưới Goal, không trôi nổi. | Giữ parent phù hợp. |
| BR-M06-22 | Milestone | Xóa Milestone còn Task phải có lựa chọn xử lý. | Không mất Task âm thầm. |
| BR-M06-23 | Assignment | Gán Task cho B không tự coi B chấp nhận hoặc hoàn thành. | Hiện trạng thái được giao riêng. |
| BR-M06-24 | Concurrent add | Thêm Task đồng thời không được ghi đè. | Hai Task giữ ID riêng. |
| BR-M06-25 | Ordering | Đổi thứ tự Task không thay ID/state/history. | Test reorder trong hai phiên. |
| BR-M06-26 | Completion | Tất cả Task Done không auto Goal Completed. | Cần tiêu chí và xác nhận. |
| BR-M06-27 | Checklist metric | Task Cancelled loại khỏi mẫu số; Skipped giữ cho tới khi loại scope có chủ đích. | Kiểm tra numerator/denominator. |
| BR-M06-28 | Numeric | Không chia cho 0 khi tính tiến độ. | Target >0 trước Active. |
| BR-M06-29 | Unknown | Không coi tiến độ chưa biết bằng 0%. | Trạng thái unavailable/undefined. |
| BR-M06-30 | Display | Giữ current thực khi vượt target, chỉ thanh tiến độ tối đa 100%. | Ví dụ 14/12 vẫn hiển thị 14. |
| BR-M06-31 | Dedup metric | Không cộng trùng kết quả từ liên kết nguồn. | Distinct Place vs Visit count phân biệt. |
| BR-M06-32 | Linked metric | Progress từ nguồn phải có phạm vi, thời điểm và trạng thái. | Source/status/last update rõ. |
| BR-M06-33 | Source error | Nguồn không truy cập được thì báo chưa cập nhật, không coi cache là mới. | Không phơi dữ liệu quá quyền. |
| BR-M06-34 | Completion | Goal Completed cần criteria + quyền xác nhận. | Không chỉ % hoặc status nguồn. |
| BR-M06-35 | Sharing | Goal Shared không công khai Wish Private liên kết. | Ẩn source detail, preview, ID. |
| BR-M06-36 | Contributor | Contributor chỉ sửa phần được cấp. | Không mặc định sửa target/ACL. |
| BR-M06-37 | Concurrent add | Hai người thêm Task/note không làm mất nhau. | Merge các item độc lập. |
| BR-M06-38 | Concurrent edit | Sửa cùng trường Goal phải chống ghi đè âm thầm. | Cảnh báo phiên bản/conflict. |
| BR-M06-39 | Revocation | Thu hồi quyền chặn mutation mới. | Recheck server-side tại save. |
| BR-M06-40 | Confirmation | Không xác nhận hộ người khác khi không được ủy quyền. | Both Confirmation phải riêng từng tài khoản. |
| BR-M06-41 | Calendar | Deadline và Calendar Event là đối tượng riêng, liên kết đồng bộ. | Không xây event riêng trong M06. |
| BR-M06-42 | Calendar dedup | Thay đổi deadline không tạo Event trùng. | Retry/link giữ Event ID. |
| BR-M06-43 | Calendar delete | Xóa Event không xóa Goal. | Reference giải liên kết/mark missing. |
| BR-M06-44 | Calendar privacy | Event/Goal có quyền riêng, không tự grant lẫn nhau. | Search/notification cũng áp ACL. |
| BR-M06-45 | Overdue | Active quá hạn hiển thị Overdue, không auto Failed. | Khi completed/paused xử lý nhãn đúng. |
| BR-M06-46 | Finance | M06 không ghi giao dịch tài chính chính thức. | Ghi tiền ở M07. |
| BR-M06-47 | Finance link | Savings Goal liên kết mà không tạo balance thứ hai. | Một nguồn current/target. |
| BR-M06-48 | Finance empty | Không có dữ liệu M07 thì báo chưa liên kết/chưa có dữ liệu. | Không điền 0 đồng. |
| BR-M06-49 | Finance dedup | Một Savings Goal liên kết nhiều nơi không làm nhân đôi tiền. | Tránh cộng trùng ở các tổng hợp. |
| BR-M06-50 | Inspiration | Board tham chiếu M02, không tạo original duplicate. | Chọn media existing theo quyền. |
| BR-M06-51 | Inspiration | Một ảnh có thể ở nhiều Wish/Goal theo quyền. | Reference multi-use. |
| BR-M06-52 | Media deletion | Xóa Wish/Goal không xóa original Media. | No cascade. |
| BR-M06-53 | External URL | Nguồn ngoài không bảo đảm tồn tại; giữ mô tả do người dùng nhập. | Broken link không làm mất Wish. |
| BR-M06-54 | Media ACL | Share Goal không công khai media Private nếu thiếu quyền. | ACL M02 ở delivery. |
| BR-M06-55 | Achievement | Achievement gắn nguồn và thời điểm đạt rõ. | Lưu result/definition version. |
| BR-M06-56 | Achievement consent | Không auto tạo Achievement chỉ vì progress ≥100%. | Confirmation là điều kiện. |
| BR-M06-57 | Achievement delete | Xóa Achievement không xóa Goal/Wish/Media. | No cascade. |
| BR-M06-58 | Reopen | Reopen Goal phải giữ lịch sử đạt trước. | Không xóa Achievement cũ. |
| BR-M06-59 | Evidence ACL | Evidence tuân thủ ACL của Diary/Trip/Media. | Không thumbnail/metadata leak. |
| BR-M06-60 | M08 | Có thể liên kết Special Moment nhưng không auto public. | Tôn trọng scheduled reveal. |
| BR-M06-61 | Delete Goal | Xóa Goal không xóa Trip/Event/Place/Savings/Media. | Dependency-aware soft delete. |
| BR-M06-62 | Delete Wish | Xóa Wish không xóa Goal độc lập tạo từ Wish. | Provenance link graceful. |
| BR-M06-63 | Restore | Restore không tự tạo lại link đã xóa vĩnh viễn. | Chỉ restore quan hệ hợp lệ. |
| BR-M06-64 | Statistics | Số tổng hợp chỉ chứa nội dung viewer có quyền. | ACL before aggregate. |
| BR-M06-65 | Authorization | Mutation kiểm tra quyền thời điểm thực hiện. | Không dựa vào nút ẩn UI. |
| BR-M06-66 | History ACL | History/Trash/Export không trở thành đường truy cập vượt quyền. | Audit/exports ACL. |
| BR-M06-67 | Provenance | Một Wish có thể liên quan nhiều Goals theo chủ đích. | Không auto clone Goal. |
| BR-M06-68 | Goal relation | Goal có nhiều Milestones/Tasks độc lập. | Giữ cấu trúc tham chiếu. |
| BR-M06-69 | Milestone empty | Milestone không bắt buộc có Task. | Có thể tracking outcome riêng. |
| BR-M06-70 | Progress history | Progress Record phải ghi nguồn thay đổi. | Manual/linked/actor/timestamp. |
| BR-M06-71 | Ownership | Goal không thay chủ sở hữu dữ liệu liên kết. | Không có cascade mutation. |
| BR-M06-72 | Confirmation version | Confirmation gắn người được phép và version định nghĩa. | Sửa criteria phải revalidate. |
| BR-M06-73 | Evidence | Achievement có nhiều evidence nhưng evidence vẫn có ACL riêng. | Không inherit publish. |
| BR-M06-74 | Backup | Backup/restore phải bảo toàn status, progress, goal version và relationships hợp lệ. | Đảm bảo identity, không duplicate. |

## 13.1. Thứ tự ưu tiên xác thực

1. Kiểm tra identity/ACL và quyền của tài nguyên nguồn ở server/tầng dữ liệu.
2. Kiểm tra cấu trúc type, trạng thái và bất biến Wish/Goal/Task/Achievement.
3. Kiểm tra version cập nhật nếu có mutation đồng thời.
4. Áp dụng nghiệp vụ theo BR, chỉ sau đó ghi history/progress và phát event liên kết nếu được chọn.
5. Trả về trạng thái đã lưu chính xác; Search/Insights/Export nhìn vào dữ liệu hợp lệ và quyền.

Các ví dụ trong tài liệu không tạo hạn mức số Goal/Task/Collection; hạn mức kỹ thuật phải được phân tích riêng, không tự đưa vào BRD như quyết định của chủ dự án.

# 14. 45 Exception Cases — danh mục chuẩn

Mỗi ngoại lệ phải được kiểm tra cả kết quả hiển thị và tính toàn vẹn dữ liệu, bao gồm hệ quả đến nguồn ở M01–M05/M07/M08.

| EX-ID | Điều kiện ngoại lệ | Xử lý bắt buộc |
|---|---|---|
| EX-M06-01 | Tạo Wish thiếu tên | Chặn lưu, chỉ lỗi ngay trường title; không tạo bản ghi rỗng. |
| EX-M06-02 | Wish chưa có ngày | Cho lưu bình thường; không tự thêm ngày hôm nay. |
| EX-M06-03 | Wish chưa có ngân sách | Cho lưu bình thường; không tạo liên kết M07 giả. |
| EX-M06-04 | Hai tài khoản tạo Wish cùng tên | Gợi ý trùng nếu có quyền nhưng không tự gộp/suy đoán hai mong muốn là một. |
| EX-M06-05 | Wish ở nhiều Collections | Giữ một Wish và nhiều memberships; không sao chép bản gốc. |
| EX-M06-06 | Xóa Collection | Chỉ xóa/archived Collection theo chính sách, Wish giữ nguyên. |
| EX-M06-07 | Private Wish trong Shared Collection | Không lộ title, cover, metadata hoặc quyền qua membership/aggregate. |
| EX-M06-08 | Convert Wish → Goal | Giữ Wish; nếu tạo Goal lỗi, rollback/liệt kê tình trạng rõ. |
| EX-M06-09 | Convert cùng Wish nhiều lần | Gợi ý Goals liên quan; cho quyết định tạo mới theo ý định. |
| EX-M06-10 | Goal Draft chưa hoàn chỉnh | Save Draft được; validate và từ chối Activate khi thiếu điều kiện. |
| EX-M06-11 | Numeric target bằng 0 | Không cho Active; không chia cho 0; báo trường Target. |
| EX-M06-12 | Current > target | Giữ số thực; progress display tối đa 100%, có thể hiện exceeded. |
| EX-M06-13 | Nhập sai đơn vị đo | Validate; không tự đổi đơn vị, yêu cầu xác định lại. |
| EX-M06-14 | Goal không deadline | Active hợp lệ; UI không hiển thị hạn giả. |
| EX-M06-15 | Goal quá deadline | Overdue flag ở Active; không auto Failed/Cancelled. |
| EX-M06-16 | Goal Paused | Giữ progress, Task, links, history; Resume theo quyền. |
| EX-M06-17 | Goal 100% chưa xác nhận | Hiển thị chờ xác nhận, không tự Completed/Achievement. |
| EX-M06-18 | Both Confirmation thiếu B | Chưa Completed, không giả chữ ký/xác nhận B. |
| EX-M06-19 | Thay target sau history | Giữ old target, progress records, phiên bản mới và giải thích. |
| EX-M06-20 | Đổi unit giữa chừng | Yêu cầu xác nhận chuyển đổi hợp lệ; nếu không thì không tự tính. |
| EX-M06-21 | Hai người cùng thêm Task | Cùng xuất hiện, không mất update, không duplicate do retry. |
| EX-M06-22 | Hai người cùng sửa Task | Phát hiện conflict trên trường giao nhau, giữ thay đổi không xung đột. |
| EX-M06-23 | Task gán cho B chưa nhận | Hiện được giao, không coi B chấp nhận/Done. |
| EX-M06-24 | Xóa Milestone có Tasks | Hiện lựa chọn chuyển/giữ/xóa theo quyền; không âm thầm mất Task. |
| EX-M06-25 | Tất cả Task Done, outcome chưa đạt | Goal Outcome giữ chưa hoàn thành. |
| EX-M06-26 | Task Skipped/Cancelled | Áp đúng quy tắc mẫu số tiến độ đã chốt. |
| EX-M06-27 | Đếm Place khi Visit lặp | Nếu distinct Place thì không đếm mỗi Visit thành một Place. |
| EX-M06-28 | Một Visit bị xóa | Linked metric cập nhật khi xác thực nguồn; không giữ số sai mà không nhãn. |
| EX-M06-29 | Trip Cancelled | Goal liên kết không tự Completed; giữ quan hệ nguồn/historic. |
| EX-M06-30 | Trip Completed nhưng Goal có criteria khác | Chờ đủ các criteria và confirmation. |
| EX-M06-31 | Không có quyền đọc Savings Goal | Không hiển thị balance, transactions hoặc inferred value. |
| EX-M06-32 | Một giao dịch liên quan nhiều Goals | Không làm tăng tổng tiền nguồn hoặc ghi ledger trùng. |
| EX-M06-33 | Nguồn Linked Goal stale/unavailable | Báo chưa đồng bộ/không truy cập; không giả nguồn đã đồng bộ. |
| EX-M06-34 | Event deadline bị xóa ở M05 | Goal vẫn tồn tại, link được đánh dấu thiếu và xử lý lại có chủ đích. |
| EX-M06-35 | Đổi deadline nhưng M05 sync lỗi | Không thông báo cả hai đã lưu xong; có retry/state rõ. |
| EX-M06-36 | Ảnh M02 bị xóa | Placeholder/hướng dẫn khôi phục theo quyền; Goal còn hoạt động. |
| EX-M06-37 | Không có quyền media gắn Shared Goal | Không hiển thị thumb, URL, filename vượt quyền. |
| EX-M06-38 | Shared Goal liên kết Private Wish | Không lộ Wish hoặc preview qua Goal. |
| EX-M06-39 | Thu hồi quyền khi B đang chỉnh | Chặn mutation mới; giữ/trình bày bản thay đổi chưa lưu hợp lý. |
| EX-M06-40 | Xóa Goal có Achievement | Cảnh báo phụ thuộc, xử lý link/historic, không cascade media/Diary. |
| EX-M06-41 | Mở lại Completed Goal | Bảo toàn history/achievement phiên bản cũ. |
| EX-M06-42 | Restore Goal với nguồn đã xóa vĩnh viễn | Restore phần hợp lệ, đánh dấu link không khả dụng, không tái tạo nguồn. |
| EX-M06-43 | Export có link private | Chỉ xuất data trong scope cho phép; không leak content qua metadata. |
| EX-M06-44 | Mất mạng khi cập nhật progress | Không báo đã lưu sai; có trạng thái retry/chưa sync rõ. |
| EX-M06-45 | Quá nhiều Task/Milestone | Tải/phân trang và thao tác ổn định theo NFR kỹ thuật chốt sau, không hạn chế vô căn cứ. |

## 14.1. Hướng dẫn QA cho ngoại lệ

- Kiểm tra cả truy cập qua UI bình thường, URL trực tiếp, search index, thumbnail, exports và các bản tổng hợp; ẩn UI không đủ để bảo vệ Private.
- Thử đồng thời hai trình duyệt/tài khoản trên cùng Goal: thêm hai Task khác nhau, sửa cùng target, thu hồi Editor khi tab còn mở.
- Thử gián đoạn giữa từng bước khi create/update link M03/M04/M05/M07, khởi chạy lại request; không duplicate bản ghi.
- Với numeric progress: 0, null, âm (nếu rule không cho), over target, cực lớn, decimal/đơn vị khác, sửa target sau history.
- Với Goal Completed: một người xác nhận, hai người xác nhận, sửa definition giữa hai lần, reopen, archive, delete, restore.
- Với linked metric: cùng Place ghé 3 lần; 3 Places khác nhau; Visit bị xóa/Private; Trip Cancelled; M07 Savings inaccessible.

# 15. 75 Acceptance Criteria — danh mục chuẩn

Mỗi tiêu chí gồm điều kiện thử và kết quả phải quan sát được. QA phải lập test case trên **hai tài khoản**, cả mobile và desktop cho các flow cốt lõi; xác nhận dữ liệu ở nguồn chứ không chỉ screenshot UI.

| AC-ID | Given / When — Điều kiện thử | Then — Kết quả bắt buộc |
|---|---|---|
| AC-M06-01 | Tạo Wish chỉ có tên | Wish được tạo; Private và Wishlisted mặc định. |
| AC-M06-02 | Tạo Wish không có tên | Bị chặn lưu, báo lỗi trường bắt buộc. |
| AC-M06-03 | Tạo Wish không có ngày | Thành công; không phát sinh ngày giả. |
| AC-M06-04 | Wish mới | Private mặc định, chỉ owner xem. |
| AC-M06-05 | Share Wish | B được quyền xem/chỉnh đúng vai trò được cấp. |
| AC-M06-06 | Một Wish ở nhiều Collection | Không có bản Wish trùng. |
| AC-M06-07 | Gỡ Wish khỏi Collection | Wish vẫn tồn tại và ở những Collection khác. |
| AC-M06-08 | Xóa Collection | Không xóa Wish hoặc media. |
| AC-M06-09 | Wish Private trong Collection Shared | Không lộ title, cover, counts suy ra riêng tư. |
| AC-M06-10 | Convert Wish→Goal | Wish giữ nguyên, có Goal mới và provenance link. |
| AC-M06-11 | Wish Fulfilled trực tiếp | Không phải tạo Goal trung gian. |
| AC-M06-12 | Archive Wish | Có thể tìm trong archive/khôi phục theo quyền. |
| AC-M06-13 | Save Goal Draft chưa đủ thông tin | Draft được lưu mà chưa cần metric hợp lệ. |
| AC-M06-14 | Activate Goal thiếu dữ liệu bắt buộc | Chặn Active; chỉ rõ lỗi theo Goal Type. |
| AC-M06-15 | Numeric Goal hợp lệ | Current/target/unit và tỷ lệ hiển thị chính xác. |
| AC-M06-16 | Numeric target = 0 | Không chia 0; không Active khi không hợp lệ. |
| AC-M06-17 | Checklist Goal | Task eligible/Done và progress được tính đúng. |
| AC-M06-18 | Outcome Goal | Điều kiện đạt rõ; không tự % outcome từ task. |
| AC-M06-19 | Linked Goal | Có nguồn/filter và cảnh báo nếu stale/inaccessible. |
| AC-M06-20 | Goal không có deadline | Active hợp lệ; không xuất date giả. |
| AC-M06-21 | Active Goal quá hạn | Overdue nhưng không auto Failed. |
| AC-M06-22 | Pause Goal | Giữ metric/history/Task khi Resume. |
| AC-M06-23 | Đổi target | History và definition version được giữ. |
| AC-M06-24 | Xóa Goal | Không xóa linked sources. |
| AC-M06-25 | Thêm Milestone | Gắn đúng Goal, state hợp lệ. |
| AC-M06-26 | Thêm Task trực tiếp | Gắn đúng Goal, không cần Milestone. |
| AC-M06-27 | Thêm Task vào Milestone | Quan hệ Milestone-Task hợp lệ. |
| AC-M06-28 | Gán Task cho B | Đúng assignee; chưa tự chấp nhận hoặc Done. |
| AC-M06-29 | B hoàn thành Task được phép | Status lưu, người cập nhật được ghi nhận. |
| AC-M06-30 | A/B thêm Task cùng lúc | Cả hai Tasks còn nguyên, không duplicate. |
| AC-M06-31 | Sắp xếp Task | Thứ tự thay đổi, ID/data giữ nguyên. |
| AC-M06-32 | Xóa Milestone còn Task | Hiện lựa chọn an toàn, không mất Task âm thầm. |
| AC-M06-33 | Cancelled Task | Được loại mẫu số theo quy tắc. |
| AC-M06-34 | Skipped Task | Vẫn trong mẫu số cho tới khi xác nhận loại. |
| AC-M06-35 | Current > Target | Giữ current thật, thanh progress tối đa 100%. |
| AC-M06-36 | Cập nhật Progress | Có old/new, nguồn/actor/timestamp hợp lệ. |
| AC-M06-37 | Giảm Progress hợp lệ | Lưu giá trị mới, ghi history rõ. |
| AC-M06-38 | Outcome all Tasks Done | Không tự Completed nếu chưa đạt/confirm. |
| AC-M06-39 | Nguồn Linked Goal inaccessible | Không hiển thị số giả hoặc dữ liệu vượt quyền. |
| AC-M06-40 | Link Place M03 | Dùng Place hiện có, không clone. |
| AC-M06-41 | Đếm số Place duy nhất | Một Place nhiều Visits chỉ đếm một. |
| AC-M06-42 | Đếm số Visit | Nhiều Visits được đếm theo metric Visit count. |
| AC-M06-43 | Link Trip M04 | Tham chiếu đúng Trip, không clone. |
| AC-M06-44 | Trip Completed | Goal còn điều kiện thì chưa tự Completed. |
| AC-M06-45 | Link Savings Goal M07 | M06 không tạo balance thứ hai. |
| AC-M06-46 | M07 thay đổi số tiết kiệm | M06 hiển thị dữ liệu cập nhật/trạng thái sync đúng. |
| AC-M06-47 | M07 có giao dịch Private | Không lộ transaction/amount không được phép. |
| AC-M06-48 | Link deadline M05 | Tạo/link đúng Event khi chọn. |
| AC-M06-49 | Đổi deadline đã link | Không sinh Event trùng. |
| AC-M06-50 | Xóa Calendar Event | Goal vẫn tồn tại. |
| AC-M06-51 | Attach media M02 | Không upload bản sao original nếu asset có sẵn. |
| AC-M06-52 | Link Diary M01 | Giữ Diary gốc và quyền riêng. |
| AC-M06-53 | Link Achievement M08 | Không tự reveal/public nội dung. |
| AC-M06-54 | Linked source deleted | Goal vẫn tồn tại, reference cảnh báo đúng. |
| AC-M06-55 | Goal đạt target | Chờ confirmation theo mode; không tự chốt. |
| AC-M06-56 | Owner Confirmation | Người đủ quyền xác nhận hợp lệ và lưu dấu vết. |
| AC-M06-57 | Both Confirmation thiếu B | Không Completed và không giả xác nhận. |
| AC-M06-58 | Both Confirmation đủ A/B | Completed khi đủ criteria và quyền. |
| AC-M06-59 | Tạo Achievement | Có ngày, nguồn và condition version. |
| AC-M06-60 | Evidence photo | Chỉ đính tài nguyên có quyền, không công khai riêng tư. |
| AC-M06-61 | Reopen Completed Goal | Giữ history/Achievement đã đạt cũ. |
| AC-M06-62 | Sửa bản chất Goal | Thông báo và xử lý version/Goal mới đúng. |
| AC-M06-63 | Xóa Achievement | Không xóa Goal/Wish/Media. |
| AC-M06-64 | Shared Goal chứa Private Wish | Không lộ Wish Private qua UI/links/search. |
| AC-M06-65 | Contributor sửa ngoài quyền | Bị chặn tại nguồn dữ liệu. |
| AC-M06-66 | A/B sửa cùng target | Phát hiện conflict, không blind overwrite. |
| AC-M06-67 | Thu hồi quyền khi đang chỉnh | Mutation mới trái quyền bị chặn. |
| AC-M06-68 | Search Private content | Không lộ tên, metadata, kết quả hoặc count. |
| AC-M06-69 | Insight Private content | Không tính nội dung của người không có quyền. |
| AC-M06-70 | Delete Goal | Đưa vào Trash, không cascade. |
| AC-M06-71 | Restore trong 30 ngày | Khôi phục bản ghi/link còn hợp lệ. |
| AC-M06-72 | Export Goal/Wish | Chỉ dữ liệu đủ quyền, giữ type/progress/source link phù hợp. |
| AC-M06-73 | Tạo và sửa Wish trên mobile | Hoàn thành flow core với giao diện phù hợp. |
| AC-M06-74 | Quản lý Goal trên desktop | Hoàn thành flow core và không mất dữ liệu. |
| AC-M06-75 | Mất mạng lúc cập nhật | Không báo sai đã lưu; hiển thị chưa sync/retry. |

## 15.1. Bộ kịch bản smoke test tối thiểu

**S01 — Private → Shared mà không leak:** A tạo Wish Private và gắn ảnh Private M02; B tìm qua Search/Insight/URL trực tiếp không thấy. A share Wish nhưng không share ảnh: B thấy nội dung Wish được cấp, không thấy ảnh. A thu quyền: B mất quyền ngay tại mutation/refresh hợp lệ.

**S02 — Goal checklist không auto-Complete:** A tạo Checklist Goal Active có 3 Task; làm 3 Task Done; tiến độ 100% nhưng trạng thái Goal chờ người có quyền xác nhận. Nếu Goal Both Confirmation thì A xác nhận một mình vẫn chưa Completed. Sau B xác nhận và criteria còn hiệu lực, mới Completed.

**S03 — Linked M03 chống trùng:** Tạo M03 Places P1/P2, Visit P1 hai lần và P2 một lần; Goal distinct Place trong cùng kỳ phải hiện 2, Goal Visit Count hiện 3; xóa một Visit P1 thì distinct vẫn 2, Visit Count thành 2 theo chính sách cập nhật nguồn.

**S04 — Savings không có balance thứ hai:** M07 có Savings Goal 5 triệu target, 2 triệu saved; M06 link và hiển thị từ M07; M07 ghi thêm giao dịch 500k → M06 hiển thị 2.5 triệu hoặc trạng thái sync chờ, không tự có giao dịch M06; ACL hạn chế giao dịch không bị tiết lộ.

**S05 — Reopen có lịch sử:** Numeric 12/12 được owner xác nhận, tạo Achievement; đổi target lên 20 bằng Reopen/Extend; progress = 12/20, Achievement 12/12 trước vẫn tồn tại, ghi Goal Definition version.

**S06 — M05 calendar:** Tạo Goal deadline, chọn Add to Calendar, kiểm tra một Event. Dời deadline 2 lần, một event được cập nhật, không có event duplicate. Ngắt đồng bộ giữa chừng phải có trạng thái lỗi chính xác. Xóa Event không xóa Goal.

**S07 — Hai người cùng chỉnh:** A và B thêm Task khác nhau cùng lúc, cả hai còn; cùng đổi Target khác nhau, có conflict được xử lý; thu hồi Editor B khi đang mở edit, save mới của B bị từ chối.

**S08 — Trash/Restore có liên kết:** Goal liên kết Trip, media, Event và Savings; Delete Goal → nguồn khác còn nguyên. Restore trong hạn → Goal trở lại với links hợp lệ; link nào đã bị xóa vĩnh viễn ở nguồn thì hiện unavailable, không tái tạo nội dung nguồn.

# 16. Trạng thái hệ thống, đồng bộ và khôi phục

## 16.1. UI states dùng xuyên ứng dụng

| State | Giao diện cần thể hiện | Trách nhiệm dữ liệu |
|---|---|---|
| Loading | Skeleton/indicator có accessible label | Không dùng số 0 giả trong progress |
| Empty | Lời nhắc tạo Wish/Goal/Task phù hợp | Không tiết lộ sự tồn tại nội dung Private |
| Saving | Thông báo đang lưu, chặn duplicate nếu cần | Không xác nhận success sớm |
| Saved | Phản hồi thành công thực sự | Có object ID/version hợp lệ |
| Offline / Unsaved | Thông báo chưa lưu hoặc chờ đồng bộ | Không gộp thay đổi chưa lưu vào progress chính thức |
| Source Stale | Nhãn lần cập nhật cuối/trạng thái nguồn | Tránh trình bày dữ liệu cũ như mới |
| Conflict | Hiển thị dữ liệu hiện tại và thay đổi dự định | Người dùng chọn xử lý có ý thức |
| Access Revoked | Cảnh báo quyền thay đổi | Từ chối mutation trái quyền |
| Archived/Trashed | Nhãn và quyền restore thích hợp | Không xuất hiện như Active |
| External Link Broken | Cảnh báo link không khả dụng | Nội dung thủ công vẫn giữ |

## 16.2. Autosave & edit sessions

M01 đã xác định autosave và collaboration chuyên biệt với canvas; M06 chỉ cần save an toàn. Nếu triển khai autosave, phải có tín hiệu trạng thái, cơ chế chống ghi đè, quyền kiểm tra và recovery khi mất mạng. Nếu dùng nút Save, người dùng phải được cảnh báo khi rời trang với dữ liệu chưa lưu. Không bắt buộc offline editing P0; không được hứa giữ một thay đổi đã đóng tab nếu hệ thống chưa lưu.

## 16.3. Độ tin cậy của Linked Progress

Mỗi kết quả Linked Metric nên có: source type/ID (khi viewer có quyền), metric/filter definition, số đo đang hiển thị, đơn vị, nguồn thời điểm hoặc mốc cập nhật được xác định, source health/staleness và trạng thái permission. Nếu nguồn cập nhật chậm hoặc lỗi, hiển thị đúng trạng thái, không âm thầm chuyển `null` thành 0. Khi người xem không có quyền nguồn nhưng Goal Shared, cách hiển thị số aggregate phải do module nguồn cho phép; không tự tính từ hidden records để rồi suy lộ dữ liệu.

## 16.4. Soft Delete / Archive / Restore

- **Archive:** không xóa; ẩn khỏi Active Views, vẫn tra cứu theo quyền; không tự hủy Achievement/Diary/Media.
- **Trash:** lưu tối thiểu 30 ngày từ thời điểm xóa; item không còn xuất hiện ở danh sách hoạt động hoặc được tính như mục tiêu hiện hành, nhưng lịch sử/backup có chính sách rõ.
- **Restore:** chủ có quyền chọn khôi phục; links còn hợp lệ thì nối lại, links mất/xóa vĩnh viễn thì hiện unavailable. Không tự reset tiến độ, role, source definition hoặc tạo duplicate M05 Event.
- **Permanent Delete:** có xác nhận và kiểm tra quyền/retention/phụ thuộc; tác động lên data M06 đúng chính sách, **không cascade** lên Places/Visits/Trips/Calendar/Media/Savings.
- **Recovery:** cần thử tạo→cập nhật→complete→archive/delete→restore với Task, Progress Record, confirmation và Achievement; phải giữ identity, audit và ACL hợp lệ.

## 16.5. Export và backup

P0 cần xuất cấu trúc dữ liệu Wish/Goal/Collections/Tasks/Milestones/Progress/Achievements và links trong phạm vi quyền; phải cho thấy source link nào là reference, không bao gồm nguyên bản M02 hoặc số liệu riêng M07 ngoài quyền. Export được kiểm quyền tại thời điểm giao file, không chỉ lúc người dùng khởi tạo; link tạm chỉ hợp lệ theo cách hệ thống bảo mật. Backup/Restore toàn hệ thống là khả năng dùng chung, phải thử mất/chênh nguồn với M01–M05 và sau đó M07/M08. Export không thay thế backup.

# 17. Phi chức năng, mobile/desktop và khả năng tiếp cận

## 17.1. Nền tảng và responsive

Desktop và mobile đều là bề mặt chính: thêm Wish, tạo Goal, chia sẻ, giao Task, cập nhật progress, xác nhận Completion, liên kết/Unlink nguồn, mở history, export/restore theo quyền. Desktop có thể dùng nhiều cột/side panel và thao tác sắp xếp thuận tiện; mobile có thể dùng stacked cards/bottom sheet/stepper, nhưng không thiếu nghiệp vụ P0. Hỗ trợ thay đổi orientation, trình duyệt quay lại, refresh và nhiều phiên thiết bị theo các nguyên tắc M01–M05.

## 17.2. Khả năng tiếp cận

- Mọi nút, icon, action có nhãn; trạng thái không chỉ bằng màu; progress có text dạng “7/12” và mô tả nguồn.
- Kích thước chạm phù hợp, hỗ trợ bàn phím, thứ tự focus hợp lý, mô tả lỗi cụ thể.
- Tránh hiệu ứng thưởng/phạt, thông báo quá hạn gây áp lực; cung cấp ngôn ngữ trung tính: “Chưa hoàn thành/Đang tạm dừng/Quá hạn dự kiến” thay cho phán xét.
- Input số hỗ trợ định dạng ngôn ngữ và đơn vị mà không hiểu sai `1.000` hoặc `1,000` theo locale; trường tiền hiển thị từ M07.
- Media có alt/caption thay thế khi cần; các bảng dài có trình bày phù hợp trên điện thoại.

## 17.3. Security và privacy

- Kiểm tra ACL ở server/data/file, Search, Autocomplete, Linked Source, Timeline, Notifications, statistics và Export.
- Không tiết lộ Private Wish/Goal qua số lượng kết quả, title trùng, duplicate suggestion, activity feed hoặc liên kết liên module.
- Những trường mô tả/External URL do người dùng nhập được hiển thị an toàn, không được thực thi như code và không trở thành nguồn quyền.
- Audit/trash/version không được trở thành phương thức truy cập thông tin đã bị thu hồi quyền.
- Chia sẻ không tự mở quyền Media/Diary/Savings; có quy trình giải thích và cảnh báo tác động.

## 17.4. Reliability và hiệu năng

- Phân trang/tải theo nhu cầu cho nhiều Wish/Task/Progress Record, không buộc nạp toàn bộ lịch sử khi mở Dashboard.
- Tránh duplicated mutation khi retry, cạnh tranh nhiều tab, tạo Goal từ Wish lặp lại; có cơ chế giữ nhất quán ID/ordering và không mất updates.
- Các thay đổi ảnh hưởng report/chart phải phản ánh nguồn hợp lệ; các số liệu chờ đồng bộ có trạng thái rõ.
- Ngưỡng p95, kích thước dữ liệu tối đa, số yêu cầu đồng thời, giới hạn upload/link, retention log, backup RPO/RTO và cửa sổ retry **chưa chốt**; cần xác định cùng kiến trúc nền tảng trước giai đoạn test performance, không được tự cam kết con số.

## 17.5. Empty/error states và ngôn ngữ

- Khi chưa có Wish/Goal, UI giới thiệu hành động thiết thực; không hiển thị KPI 0 gây hiểu sai.
- Khi permission denied, không hiện tên hay thông tin nguồn bị hạn chế; lỗi cho người dùng không chứa dữ liệu nhạy cảm.
- Với Source Lost/Stale, cung cấp nhãn trung tính “Không thể cập nhật tiến độ từ nguồn này” và khả năng mở module nguồn khi được phép.
- Với Conflict, hiển thị phiên bản hiện tại/tác động sửa và lựa chọn rõ, không âm thầm ghi đè.

# 18. Ranh giới P0 / P1 / P2 và phụ thuộc triển khai

## 18.1. P0 — phải hoàn thành trong Our Space V1.0

- Wish nhanh, trạng thái Wish, Personal/Shared, Collections, categories/tags và quản lý quyền.
- Convert Wish→Goal giữ nguồn; bốn Goal types; Draft/Active/Pause/Complete/Cancel/Archive.
- Goal Detail/Goals Dashboard, Milestones, Tasks, assignment và các phương pháp progress đúng type.
- Confirmation theo Owner/Both, Achievements, evidence và Reopen/Extend giữ lịch sử.
- Inspiration Board gắn M02, links M01/M03/M04/M05 và hợp đồng M07/M08 khi module nguồn triển khai P0.
- Search, filters, stats cơ bản, những màn hình BG-01–BG-18 hoặc chức năng tương đương có thể gộp UX.
- Phân quyền, cộng tác an toàn, Trash 30 ngày, Restore, Export có cấu trúc, backup/restore được kiểm thử.
- Trải nghiệm core đồng đều trên mobile và desktop; accessible/error/empty/offline warning đúng.

## 18.2. P1 — không mặc định bắt buộc V1.0

- Thư viện Goal Templates theo nhiều nhóm, recurring goals và Habit Tracking/streaks.
- Advanced goal dependencies, nâng cao analytics/trend history, seasonal plans và nhóm mục tiêu phức tạp.
- Các gợi ý milestone, plan và lọc liên kết nâng cao (không phải AI bắt buộc P0).

## 18.3. P2 — tương lai

- AI đề xuất mục tiêu cho hai người, tách Goal thành milestone/task, phân tích progress, gợi ý kỷ niệm, phân tích ảnh tự động.
- Gamification sâu, động lực và thói quen theo cơ chế có thể tùy chọn; không đưa ranking áp lực vào core.

## 18.4. Phụ thuộc và gate nghiệm thu

| Phân hệ/phần dùng chung | Điều M06 cần để hoàn thành liên kết | Trạng thái hợp đồng |
|---|---|---|
| M01 | Liên kết Diary/Photobook/Achievement, không cascade | Đã có BRD được chốt |
| M02 | Asset picker, ACL, original reference, deleted media placeholder | Đã có BRD được chốt |
| M03 | Place/Visit metrics có phạm vi và ACL; dedup distinct | Đã có BRD được chốt |
| M04 | Trip states/ACL, không auto complete Goal | Đã có BRD được chốt |
| M05 | Calendar Event/Reminder source of truth; link/dedup/sync errors | Đã có BRD được chốt |
| M07 | Savings Goal read contract, multi-currency, per-transaction privacy, no ledger duplicate | **Chưa đặc tả M07**: sẽ đối chiếu sau khi chốt |
| M08 | Achievement→Special Moment/Time Capsule, scheduled reveal ACL | **Chưa đặc tả M08** |
| M09 | Comment/reaction trên Goal/Wish theo ACL nội dung | **Chưa đặc tả M09** |
| M10 | Notification/permissions/theme/settings toàn hệ thống | **Chưa đặc tả M10** |
| Shared File/Auth/Search/Backup | Thực thi rights, history, Trash, export, recovery | Thiết kế kỹ thuật dùng chung sau |

**Quy tắc:** M06 không tự lập trình thay M07–M10 trước khi nghiệp vụ của các phân hệ đó được chốt. Tuy nhiên, khi nghiệm thu Our Space V1.0, các integration thuộc P0 phải cùng hoạt động thật, không chỉ là nút placeholder.

# 19. Definition of Done và chiến lược QA

## 19.1. Definition of Done — M06 P0

- [ ] Đã đọc, hiểu và triển khai đầy đủ các quyết định D01–D24, không tự nâng P1/P2 vào P0.
- [ ] BG-01–BG-18 hoặc trải nghiệm tương đương có đủ entry/exit points, validation, empty/loading/error/stale states và quyền.
- [ ] Wish tạo chỉ tên, Private default; Collections multi-membership và không tự share Wish Private.
- [ ] Convert Wish→Goal giữ provenance; Goal Draft hợp lệ; bốn Goal Types có phương thức đo riêng.
- [ ] Task/Milestone có CRUD, assignment, trạng thái, thứ tự, history và không mất updates đồng thời.
- [ ] Numeric progress đúng; no divide-by-zero, preserve over-target value, no fake null=0; Checklist scope đúng.
- [ ] Outcome và Linked Goal không tự Completed trái confirmation; mode Owner/Both thực thi theo tài khoản và phiên bản.
- [ ] Achievement có timestamp/source/version và evidence đúng quyền; Reopen/Extend giữ lịch sử.
- [ ] M02 media không clone original; các links M03/M04/M05 đúng ownership, không duplicate; M07/M08 sau khi chốt tuân theo contract.
- [ ] Search/Insights/Export/Notifications không làm lộ Private, kể cả qua số đếm và preview.
- [ ] Xung đột hai người sửa cùng target được xử lý; edit độc lập không mất; thu hồi quyền có hiệu lực khi save.
- [ ] Archive/Trash ≥30 ngày/Restore/Backup/Export được kiểm thử với dữ liệu và links cross-module.
- [ ] Mobile và desktop thực hiện được đầy đủ các tác vụ P0; bàn phím/touch và các trạng thái có khả năng tiếp cận.
- [ ] Có test cases cho mọi `AC-M06-01..75` và cases đặc biệt ở `EX-M06-01..45`.
- [ ] Có kiểm thử end-to-end với hai tài khoản, dữ liệu riêng/chung và các nguồn liên kết thực tế khi sẵn sàng.
- [ ] Không đưa Our Space V1.0 vào sử dụng khi các P0 của những module khác chưa đạt và kiểm thử liên phân hệ chưa xong.

## 19.2. Test data gợi ý

- **A/B:** hai tài khoản riêng với một Wish A Private, một Wish B Private, một Shared Collection chứa các Wish có ACL khác nhau, một Shared Goal Both Confirmation.
- **Numeric:** target=12/current=7, current>target=14, target=0 invalid, history update 7→8→6, đổi target 12→20.
- **Checklist:** Task Done, In Progress, Skipped, Cancelled, Task list trống, xóa Milestone còn Tasks.
- **Linked M03:** Place P1 3 Visits, P2 1 Visit, P3 no Visit; source Visited Private và Shared.
- **Linked M04:** Dreaming, Completed, Cancelled Trips, một Trip bị xóa hoặc thu quyền.
- **Linked M05:** Deadline Event tạo từ Goal, đổi hai lần, retry request, sync timeout, Event bị xóa.
- **Linked M07:** Savings target/current trong nhiều currency, người B không quyền xem transaction, source stale.
- **Achievement:** Completed Goal phiên bản 1, Reopened Goal phiên bản 2 và evidence media Private.
- **Cross-device/concurrency:** cùng Goal mở trên mobile và desktop hai tài khoản, quyền thay đổi khi save, mất mạng trong thao tác.

## 19.3. Regression gates

Mọi thay đổi ở M06 phải không phá: M01 snapshot/Diary, M02 ACL/original, M03 Place/Visit history, M04 Trip status, M05 event dedup/recurrence/reminder và các contract tài chính M07 khi đã được chốt. Các test scenario S01–S08 tại mục 15 phải chạy lại sau mỗi thay đổi quan trọng ở các hợp đồng liên kết.

# 20. Traceability — D01–D24

Mỗi quyết định đã được ánh xạ tới khu vực đặc tả tương ứng. QA cần đảm bảo không bỏ một quyết định vì nó không nằm ở form chính.

| Quyết định | Chủ đề | Vị trí trong tài liệu/màn hình | Ưu tiên |
|---|---|---|---|
| D01 | Wish và Goal | §7; BG-02–BG-05; §10 | P0 |
| D02 | Tạo Wish | §7; BG-02–BG-05; §10 | P0 |
| D03 | Quyền mặc định | §7; BG-02–BG-05; §10 | P0 |
| D04 | Wish Collections | §7; BG-02–BG-05; §10 | P0 |
| D05 | Phân loại | §7; BG-02–BG-05; §10 | P0 |
| D06 | Wish → Goal | §7; BG-02–BG-05; §10 | P0 |
| D07 | Loại Goal | §5, §8; BG-07–BG-10 | P0 |
| D08 | Deadline | §5, §8; BG-07–BG-10 | P0 |
| D09 | Goal Draft | §5, §8; BG-07–BG-10 | P0 |
| D10 | Milestones & Tasks | §5, §9; BG-08–BG-10, BG-15 | P0 |
| D11 | Progress | §5, §9; BG-08–BG-10, BG-15 | P0 |
| D12 | Đạt 100% | §5, §9; BG-08–BG-10, BG-15 | P0 |
| D13 | Goal chung | §5, §9; BG-08–BG-10, BG-15 | P0 |
| D14 | Mở lại Goal | §5, §9; BG-08–BG-10, BG-15 | P0 |
| D15 | Achievement | §9, §11; BG-14–BG-15 | P0 |
| D16 | Inspiration | §9, §11; BG-14–BG-15 | P0 |
| D17 | Goal Calendar | §11; BG-12–BG-13 | P0 |
| D18 | Savings Goal | §11; BG-12–BG-13 | P0 |
| D19 | Linked Goal | §11; BG-12–BG-13 | P0 |
| D20 | Search & Insights | §10–§11, BG-16–BG-17 | P0 |
| D21 | Collaboration | §10–§11, BG-16–BG-17 | P0 |
| D22 | Archive & Trash | §16–§18; BG-18 | P0 |
| D23 | Repeat/Habit | §16–§18; BG-18 | P1 |
| D24 | Export & Device | §16–§18; BG-18 | P0 |

## 20.1. Các bộ mã phải được duy trì

- `BG-01..18`: giao diện chức năng.
- `ENT-M06-01..24`: đối tượng miền.
- `BR-M06-01..74`: business rules chính thức.
- `UC-M06-01..20`: use cases chi tiết.
- `EX-M06-01..45`: exception scenarios.
- `AC-M06-01..75`: acceptance criteria.

Khi thay đổi sau phê duyệt, tăng version và ghi quyết định/changelog; tránh renumber các mã đã được tham chiếu bởi QA/Codex khi không cần thiết.

# 21. Các điểm kỹ thuật/chính sách chưa chốt — không tự suy đoán

**Không phải câu hỏi yêu cầu chủ dự án trả lời ngay; các điểm dưới cần đưa vào backlog thiết kế sau khi nghiệp vụ đủ 10 module được duyệt.**

1. Hạn mức tối đa Wish/Goals/Tasks/Milestones/Collections, chiều dài title/description, dung lượng link/media; phải căn cứ NFR thực tế chứ không tự chặn nghiệp vụ.
2. Cơ chế/version protocol và conflict UX cụ thể cho hai tài khoản, semantics merge các trường độc lập, thứ tự Task dưới thao tác đồng thời.
3. Phân quyền chi tiết đối với Attachment/Notes/Task nếu khác với quyền kế thừa Goal; cần thống nhất với permission model toàn hệ thống và M10.
4. Các kỹ thuật đồng bộ source metric, độ trễ được phép, fallback khi offline/stale, phạm vi dữ liệu được phép aggregate từ private sources.
5. Danh sách metric Linked Goal P0 được hỗ trợ có thể mở rộng và đúng source: distinct Place, Visit count, Trip completion, Savings Goal; xác định từng hợp đồng rõ khi các module liên quan hoàn tất.
6. Cách xử lý Metric Type change, unit conversion và tiến độ thuộc phiên bản trước, đặc biệt khi Goal đã Completed.
7. Các chỉ số hiệu năng/backup retention/RPO/RTO, hạn thao tác đồng thời, thời gian đồng bộ, độ chính xác notification.
8. Định dạng export cấu trúc cụ thể, format version và quyền của dữ liệu/links khi giao file.
9. M07 Savings Goal: currency, contribution, balance, privacy của amount/transaction, cách quy đổi ngoại tệ và split chưa được chốt; M06 **không** định nghĩa thay.
10. M08 Special Moment/Time Capsule, M09 interaction và M10 toàn hệ thống còn chờ BRD riêng.
11. Các phạm vi test thị trường/trình duyệt, cách xử lý account deletion, disaster recovery toàn hệ thống cần thống nhất ở yêu cầu chung.

Nếu một vấn đề trên ảnh hưởng trực tiếp một P0 đã duyệt, gắn `BLOCKED_BY_DEPENDENCY` và giải quyết trong thiết kế/đặc tả phân hệ liên quan trước khi nghiệm thu, thay vì âm thầm giảm P0.

---

# 22. Change log, phê duyệt và hướng tiếp theo

| Phiên bản | Ngày | Trạng thái | Ghi chú |
|---|---|---|---|
| 0.1 (discussion) | 2026-10-22 | Đề xuất | Trình bày đầy đủ nghiệp vụ M06 và D01–D24 |
| 1.0 | 2026-10-22 | **APPROVED BUSINESS REQUIREMENTS** | Chủ dự án xác nhận “Tôi chốt toàn bộ đề xuất M06”; tổng hợp 18 screens, 24 entities, 20 UC, 74 BR, 45 EX, 75 AC |

**Thư mục khuyến nghị:** `OurSpace/Docs/OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md`.

**Đầu vào yêu cầu:** M01–M05 BRD V1.0 cùng tài liệu này; chưa triển khai code. **Phân hệ kế tiếp thảo luận:** **M07 — Budget & Savings**, với nội dung chi phí riêng/chung, Savings Goals, mục tiêu, quyền, contribution, split expenses, multi-currency và các hợp đồng liên kết M03/M04/M06. M07 cần chốt trước khi phần chi tiết tích hợp tài chính M06 được thiết kế kỹ thuật.

**Quy trình tiếp tục dự án:** Thảo luận toàn diện một module → Product Owner chốt → tạo BRD Markdown duy nhất theo tên thống nhất → Codex đọc toàn bộ BRD khi bắt đầu lập kế hoạch/triển khai sau này → chuyển module tiếp. V1.0 phải đạt P0 của đủ **10/10 module** trước khi sử dụng.

