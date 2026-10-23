---
document_id: OURSPACE-M08-BRD
project: Our Space
module_id: M08
module_name: Special Moments
version: 1.0
status: APPROVED_BUSINESS_REQUIREMENTS__IMPLEMENTATION_NOT_STARTED
language: vi-VN
approved_on: 2026-10-22
file_name: OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md
intended_audience: [Product Owner, UX Designer, Codex, Developer, QA]
related_documents:
  - OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md
  - OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md
  - OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md
  - OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md
  - OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md
  - OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md
  - OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md
next_module: M09 — Couple Interaction
---

# OUR SPACE — M08: SPECIAL MOMENTS
## Business Requirements & Functional Specification — V1.0

> **ĐÃ DUYỆT NGHIỆP VỤ.** Chủ dự án xác nhận “Tôi chốt toàn bộ đề xuất M08” ngày 22/10/2026, chấp thuận **D01–D30** như mục 2. Tài liệu độc lập để lưu tại `OurSpace/Docs/OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md`. **Chưa viết code, chưa chọn nền tảng, framework, cơ sở dữ liệu, API, dịch vụ gửi mail, cơ chế mã hóa hoặc nhà cung cấp storage.** Không coi đặc tả là tuyên bố rằng sản phẩm đã tồn tại.
>
> **BẮT BUỘC đọc đủ:** 30 quyết định; 20 màn hình `SM-01`–`SM-20`; 28 đối tượng; 82 quy tắc `BR-M08-01`–`82`; 22 use case `UC-M08-01`–`22`; 50 ngoại lệ `EX-M08-01`–`50`; 85 tiêu chí `AC-M08-01`–`85`; các hợp đồng liên kết M01–M10, privacy, state machine, QA và Definition of Done. P0 của **cả 10 module** phải được nghiệm thu trước Our Space V1.0.
>
> **Phân biệt bất biến:** `Delivered ≠ Opened`; `Reveal ≠ Read`; `Unlock Eligible ≠ Opened`; `Seal ≠ Draft Save`; `Moment ≠ M05 Event`; `Anniversary date` thuộc M05; `Media source` thuộc M02. `Sealed` là **kiểm soát quyền ở cấp ứng dụng và backend**; không đồng nghĩa đã được phê duyệt thiết kế mã hóa đầu cuối hoặc không có khả năng truy cập ở phía máy chủ.

---

# 1. Tầm nhìn, phạm vi, nguyên tắc và ranh giới

## 1.1. Sứ mệnh

M08 (tên hiển thị **Our Special Moments**) cho phép hai tài khoản A/B ghi lại những khoảnh khắc ý nghĩa, cột mốc tình cảm, trao Love Letters, lên lịch những Surprises riêng tư và giữ Time Capsules để mở trong tương lai. M08 hướng tới cảm xúc và tính bảo toàn lời hứa: người nhận không được thấy thông tin sớm; thư đã trao không bị sửa âm thầm; Capsule đã Seal giữ đúng phiên bản đã chọn. M08 không thay thế M01 Photobook/Diary, M02 Media, M05 Calendar, M06 Task/Goal, M07 Expense.

Mọi tính năng nghiệp vụ cốt lõi phải đạt **mobile/desktop parity**. Hai tài khoản sở hữu dữ liệu cá nhân riêng, được chia sẻ có chủ đích. **Private là trạng thái tạo mới mặc định**, kể cả người dùng đã truy cập Shared Collection hay từ một sự kiện trong Our Calendar. Việc có một liên kết không tự cấp quyền đọc dữ liệu nguồn hoặc đích.

## 1.2. P0 được duyệt

- Moments, Timelines, Gallery, Collections, riêng/chung, hai Personal Perspectives, ngày xảy ra khác ngày tạo.
- Relationship Milestones kết nối Anniversary M05; không tạo bộ đếm và recurrence riêng trong M08.
- Love Letters: Draft, Send Now, Schedule, Delivery status, Recipient Opened status, lưu giữ bản thư Delivered bất biến đối với sửa âm thầm.
- Surprises: Secret (default), Teaser được chọn rõ, lịch tiết lộ, bảo vệ sự tồn tại lẫn nội dung khỏi leak trên toàn Our Space.
- Time Capsules: Draft, Ready, Sealed, Unlock Eligible, Cancelled, Archived; text/photo/video, recipients A/B/both, timezone, snapshot lúc Seal, không cho đọc trước unlock qua giao diện và quyền truy cập thường, collaborative pre-Seal sign-off; recipient opening riêng.
- In-app notifications dựa trên hạ tầng chung, trạng thái reveal/delivery không phụ thuộc việc thông báo tới thành công.
- Quyền theo đối tượng, kiểm tra từng resource, audit, archive, Trash ≥30 ngày, restore, backup, export tuân thủ lock; chống idempotent duplicate, optimistic concurrency.
- Liên kết M01–M07, chuẩn bị hợp đồng M09/M10 mà không phát minh quyền nghiệp vụ cho các phân hệ chưa duyệt.

## 1.3. P1 / P2 và không thuộc phạm vi

P1: templates Love Letter, phong bì/hiệu ứng Capsule tinh xảo, thiệp, bộ sưu tập phong cách nâng cao, PDF ký ức, email/push theo kênh hỗ trợ, read receipts cho người gửi có opt-in, âm thanh/tài liệu mở rộng, trải nghiệm mở Capsule đồng thời. P2: AI gợi ý kỷ niệm, hỗ trợ viết thư chủ động, recap video, ý tưởng surprise, điều kiện mở Capsule phức tạp ngoài thời gian, tích hợp quà tặng ngoài. Không xây full chat (M09), không xây lịch Anniversary (M05), không chọn công nghệ mã hóa; không tự cam kết bảo mật tuyệt đối đối với ảnh đã tải về, cache hoặc bản chụp của người đã có quyền.

## 1.4. Điều kiện bất biến

1. `Access to existence` (biết có nội dung) tách khỏi `Access to metadata`, `Access to content` và `Access to attachment`; Secret mặc định chặn cả sự tồn tại đối với recipient chưa đến hạn.
2. **Letter Delivered** lưu nguyên phiên bản trao; trạng thái Delivered không nghĩa là recipient đã Opened. Người gửi không mặc định xem được read history của người nhận.
3. **Time Capsule Sealed** không có luồng đọc/sửa nội dung thông thường cho cả người tạo trước unlock; đi đến thời điểm chỉ *cho phép mở*, không tự đánh dấu đã đọc.
4. **Capsule Snapshot** không đổi theo chỉnh sửa Media hoặc Diary nguồn sau Seal; song không được chặn quy trình xóa dữ liệu hợp lệ được xác định ở M10.
5. **Thời gian cấp quyền** dựa trên hệ thống đáng tin cậy, không phải giờ trên client. Xác định timestamp + timezone; DST ambiguities cần phân giải.
6. Scheduled actions phải retry an toàn/idempotent; không báo trao/khóa/mở thành công nếu chưa thực sự được xác nhận; offline recipient vẫn mở sau hạn.
7. M05 là source of truth của Anniversary/date/repeat; M01 Diary/Photobook; M02 media; M03 Place/Visit; M04 Trip; M06 Goal/Achievement; M07 tài chính; M08 nội dung đặc biệt và khóa tiết lộ.
8. Private và quyền điều kiện áp cả Search, counters, notification, calendar, analytics, export, history, trash, direct URL, thumbnail và linked previews; không cho inference leak.
9. Xóa/Archive M08 không xóa dây chuyền dữ liệu độc lập thuộc phân hệ khác; restore phải giữ lock state, delivered state và quyền.
10. Nội dung sản phẩm V1.0 chỉ có hai tài khoản A/B; không tự thêm social/public sharing với bên ngoài.

# 2. Ba mươi quyết định đã được phê duyệt

**Nguồn duyệt:** Chủ dự án xác nhận *toàn bộ* D01–D30 ngày 22/10/2026. Không còn quyết định D nào chờ duyệt ở M08.

| Mã | Chủ đề | Quyết định chính thức | Ảnh hưởng triển khai/QA |
| --- | --- | --- | --- |
| D01 | Cấu trúc M08 | Moments, Milestones, Love Letters, Surprises, Time Capsules | Tách đối tượng và vòng đời riêng |
| D02 | Mặc định quyền | Private, chia sẻ theo từng nội dung | Không kế thừa public/share vô điều kiện |
| D03 | Moment độc lập | Không bắt buộc có Trip/Event/Diary | Có ngày xảy ra riêng |
| D04 | Personal Perspectives | Hai người có phần cảm nhận riêng P0 | Không ghi đè góc nhìn của nhau |
| D05 | Collections | Một Moment thuộc nhiều Collection | Không copy Moment |
| D06 | Anniversary | M05 ngày/recurrence/reminder; M08 nội dung | Không tạo 2 ngày gốc |
| D07 | Love Letter | Draft, gửi ngay, hẹn gửi P0 | Có người nhận và trạng thái trao |
| D08 | Delivered immutable | Không sửa âm thầm thư đã trao | Correction/follow-up tách biệt |
| D09 | Read receipts | Người nhận có Opened riêng; không mặc định báo người gửi | Privacy first |
| D10 | Surprise modes | Secret và Teaser; Secret mặc định | Không lộ cả sự tồn tại |
| D11 | Chuẩn bị Surprise | Liên kết M06 Task/Goal và M07 Expense Private | Không mở ACL liên kết |
| D12 | Capsule content | Text, ảnh, video và reference hợp lệ | Không bắt buộc audio/docs P0 |
| D13 | Unlock time | Có ngày, giờ, timezone rõ khi Seal | Server time kiểm tra |
| D14 | Recipients | Một hoặc cả hai người | Opening per recipient |
| D15 | Reveal mode | Secret/Visible Countdown; Secret default | Countdown chỉ metadata cho phép |
| D16 | Seal immutable | Sau Seal không trực tiếp sửa content/recipient/unlock | Hủy/tạo mới theo policy |
| D17 | Creator read sealed? | Không đọc trước unlock qua luồng ứng dụng thường | M08 app access control, không cam kết E2EE |
| D18 | Sealed snapshot | Phiên bản nội dung cố định, có quy trình xóa có chủ đích | Không thay đổi theo nguồn |
| D19 | Cancel sealed capsule | Có quy trình xác nhận, lưu audit, vô hiệu hóa tác vụ | Bảo vệ quyền chung |
| D20 | Open early | Không có mở sớm P0 | Không override bằng client clock |
| D21 | Collaborative seal | Cả hai xác nhận bản cuối trước Seal | Kiểm tra revision lúc Seal |
| D22 | Trusted time | Dựa server/system authoritative | DST/timezone xử lý |
| D23 | Unlock vs Opened | Đủ điều kiện mở khác đã mở; trạng thái mỗi recipient | Không mark read tự động |
| D24 | Notifications | In-app P0; Email/Push P1 | State không phụ thuộc notification |
| D25 | Asset permissions | Check nguồn/đính kèm riêng | Shared Moment không share ảnh Private tự động |
| D26 | Prevent leaks | Search, Calendar, Homepage, Analytics, Export, URL... | Không tồn tại nếu Secret trước reveal |
| D27 | Archive & delete | Trash 30 ngày; xử lý riêng delivered/sealed | Không cascade |
| D28 | Export & Backup | Export đúng quyền; Backup giữ lock/snapshot | Backup không làm bypass unlock |
| D29 | Collaboration | Optimistic conflict/revision; no live cursor P0 | Concurrent edit và seal safe |
| D30 | Device parity | P0 mobile/desktop; advanced effects P1 | Không có chức năng core chỉ trên desktop |

## 2.1. Điều gì chưa được quyết định?

Quyết định nghiệp vụ không tự quyết định framework, backend task scheduler, real-time protocol, quản lý khóa mã hóa, giới hạn dung lượng attachment, retention hệ thống sau xóa vĩnh viễn, thời gian giao thư cam kết SLA, nội dung thông báo qua email/push, chính sách tài khoản bị đóng hoặc cả hai không còn liên kết. Những nội dung này cần được ghi `OPEN-ISSUE`/quyết định kỹ thuật hoặc chờ M10, không được lấp khoảng trống bằng mặc định có thể làm lộ dữ liệu.

## 2.2. Quy tắc va chạm BRD

M08 phải tuân thủ ACL của các phân hệ M01–M07; khi có mâu thuẫn (ví dụ media snapshot sau user-requested full deletion hoặc anniversary M05 đổi ngày sau Seal), ghi nhận rõ và ưu tiên bảo toàn an toàn dữ liệu trước khi cho tính năng hoạt động sai. Không tự biến `Sealed` thành permission tuyệt đối với một loại file trong khi export/history vẫn đọc được.

# 3. Actors, thuật ngữ, mẫu tương tác

## 3.1. Actors

| Actor | Khả năng | Giới hạn |
|---|---|---|
| Person A/B | Hai tài khoản đăng nhập riêng | Không tự xem nội dung Private của người kia |
| Moment Owner | Sở hữu và quản lý Moment | Không vượt quyền của Diary/Media nguồn |
| Moment Contributor | Thêm góc nhìn/cập nhật phạm vi được cấp | Không tự thay tác giả của góc nhìn riêng |
| Letter Author | Viết/gửi/hẹn gửi thư | Không sửa âm thầm sau Delivered |
| Letter Recipient | Đọc thư sau Delivered | Không đọc Scheduled trước hạn |
| Surprise Creator | Soạn và tiết lộ nội dung bí mật | Không công khai bất ngờ qua linked objects |
| Capsule Creator | Tạo, seal/cancel theo quyền | Không đọc/edit Sealed trước unlock qua app |
| Capsule Collaborator | Cùng soạn và ký xác nhận trước seal | Không solo-seal khi chính sách đòi đủ 2 người |
| Capsule Recipient | Mở sau khi đủ điều kiện | Không tự truy cập thông qua URL trước hạn |
| Shared Notification Service | Hiển thị in-app alerts | Không quyết định nội dung đã delivered/unlocked |
| Linked M01–M10 Module | Cung cấp liên kết/tài nguyên theo contract | Không bypass M08 reveal/ACL |

## 3.2. Từ điển

- **Moment:** bản ghi khoảnh khắc với `occurred_on`, metadata, perspectives, media/reference; khác `created_at`.
- **Relationship Milestone:** một cột mốc cảm xúc; có thể link M05 Anniversary, không tự sở hữu recurrence.
- **Letter Draft:** bản chưa trao; **Scheduled Letter:** đã hẹn thời điểm, chưa trao; **Delivered:** bản được trao thành công, vẫn có thể chưa đọc.
- **Opened:** người nhận đã mở một nội dung được phép; quyền mở không đồng nghĩa opened.
- **Surprise:** kế hoạch/nội dung tiết lộ, `Secret` che cả sự tồn tại, `Teaser` chỉ hé lộ metadata chọn rõ.
- **Capsule:** container có recipient(s), contents, `unlock_at` và state; **Seal:** hành động khóa nội dung đã duyệt vào một manifest/snapshot ổn định.
- **Sealed Manifest:** danh mục/định danh các thành phần bất biến sau Seal. **Snapshot:** bản nội dung/phiên bản được khóa có chính sách xóa riêng.
- **Unlock Eligible:** trạng thái người nhận thỏa điều kiện thời gian/quyền; không có nghĩa đã xem.
- **Scheduled Action:** yêu cầu xử lý đến hạn có ID ổn định, retry-safe.
- **Reveal ACL:** quyền biết metadata/content phụ thuộc recipient, state và unlock timestamp.

## 3.3. Hành trình mẫu

**Từ buổi hẹn đến kỷ niệm:** M03 Visit hoặc M04 Trip đã được người dùng xác nhận → A chọn tạo Moment → M08 tạo 01 Moment có linked source → ảnh được chọn từ M02 theo ACL → A và B viết 2 góc nhìn → liên kết M01 Diary/Photobook hoặc M05 Anniversary nếu phù hợp → Moment lên Shared Timeline theo quyền. Không auto-create Moment từ mọi Activity/Visit.

**Từ ý tưởng bất ngờ đến giờ tiết lộ:** A tạo Private Secret Surprise → có thể liên kết Task M06 và Expense M07 đều Private → soạn Letter Scheduled hoặc Capsule → chọn recipient B và thời điểm → trước giờ B không có Search/Calendar/Notifications leak → tới hạn, M08 cập nhật eligible/delivered và in-app notification hợp lệ → B thực sự mở khi muốn.

**Hai người gửi lời nhắn tương lai:** A tạo Collaborative Capsule, B được cấp Draft editor; hai người thêm nội dung, xác nhận version cuối → Sealed → không đọc qua giao diện thường → đến giờ, mỗi người nhận mở riêng và trạng thái mở riêng; không tự đóng hay delete Capsule sau lần mở thứ nhất.

# 4. Mô hình miền — 28 đối tượng nghiệp vụ

| Mã | Đối tượng | Trách nhiệm |
| --- | --- | --- |
| ENT-M08-01 | Moment | Bản ghi ký ức, occurred date và metadata |
| ENT-M08-02 | Moment Perspective | Cảm nhận theo một tác giả và quyền |
| ENT-M08-03 | Moment Collection | Bộ sưu tập cùng chủ đề |
| ENT-M08-04 | Collection Membership | Quan hệ n-n Moment–Collection |
| ENT-M08-05 | Relationship Milestone | Cột mốc tình cảm |
| ENT-M08-06 | Anniversary Link | Tham chiếu Anniversary M05 |
| ENT-M08-07 | Love Letter | Nội dung và người gửi/nhận |
| ENT-M08-08 | Letter Revision | Phiên bản Draft, frozen delivered revision |
| ENT-M08-09 | Letter Delivery | Kết quả send/schedule/status |
| ENT-M08-10 | Letter Recipient State | Unread/Opened/Archived theo recipient |
| ENT-M08-11 | Surprise | Chuẩn bị món quà tinh thần |
| ENT-M08-12 | Surprise Reveal Rule | Secret/Teaser/schedule/allowed teaser fields |
| ENT-M08-13 | Time Capsule | Container, unlock schedule, trạng thái |
| ENT-M08-14 | Capsule Item | Phần tử thư/ảnh/video/link |
| ENT-M08-15 | Capsule Sealed Manifest | Danh mục item tại thời điểm Seal |
| ENT-M08-16 | Capsule Snapshot | Phiên bản nội dung được khóa |
| ENT-M08-17 | Capsule Recipient | Người nhận và ACL |
| ENT-M08-18 | Capsule Opening Record | Trạng thái mở cho từng người |
| ENT-M08-19 | Scheduled Action | Tác vụ giao/tiết lộ/mở có idempotency |
| ENT-M08-20 | Notification Reference | Thông báo liên kết, không là state source |
| ENT-M08-21 | Attachment Reference | Media hoặc document refs |
| ENT-M08-22 | Related Content Link | Quan hệ sang các module |
| ENT-M08-23 | Content Permission | Quyền object/view/edit |
| ENT-M08-24 | Reveal Access Rule | Biết tồn tại/metadata/content theo state/time |
| ENT-M08-25 | Change History | Audit theo quyền |
| ENT-M08-26 | Trash Record | Xóa mềm và restore |
| ENT-M08-27 | Export Request | Yêu cầu xuất tuân thủ ACL |
| ENT-M08-28 | Seal Confirmation | Xác nhận pre-seal, revision và signer |

## 4.1. Quan hệ đối tượng

- `Moment 1—N MomentPerspective`; một perspective có tác giả, lịch sử sửa và quyền, không nên dùng một field shared text có thể ghi đè.
- `Moment N—N MomentCollection` bằng Membership; Collection delete chỉ dọn Membership.
- `RelationshipMilestone N—0/1+ M05 AnniversaryLink`; lịch Anniversary và recurrence chỉ ở M05, cột mốc M08 có thể không gắn Anniversary.
- `LoveLetter 1—N revisions`; khi trao phải tham chiếu **delivered revision** và recipient identity bất biến theo quy trình; trạng thái recipient đọc tách riêng.
- `Surprise 0—N content links / scheduled reveal rule`; linked item không tự đổi ACL nguồn.
- `TimeCapsule 1—N CapsuleItems`, `1—N recipients`, `1—1 sealed manifest` sau seal, `1—N immutable snapshot refs`, `1—N per-recipient opening records`.
- ScheduledAction xác định liên kết object/desired transition/time/version, idempotency key; chính thức hóa trạng thái phải kiểm tra version/state/ACL trước mutation.
- `ContentPermission` và `RevealAccessRule` khác nhau: ACL thường cho phép quản trị không được bỏ qua khóa thời gian.
- `TrashRecord` giữ state snapshot metadata phù hợp; hoàn tác hủy phải xử lý các scheduled actions một cách an toàn, không tái kích hoạt lệnh cũ mù quáng.

## 4.2. Dữ liệu bắt buộc theo loại

| Loại | Tối thiểu trước khi tạo/lưu | Tối thiểu trước khi publish/deliver/seal | Thông tin bổ sung |
|---|---|---|---|
| Moment | Title, occurred date, Private default | Khi share cần explicit ACL + asset permission review | timezone nếu có clock time; collections, linked content |
| Milestone | Title, occurred/on date hoặc valid M05 reference | Cấp quyền nếu shared | linked anniversary không lưu nguồn ngày thứ 2 |
| Letter Draft | Owner và content draft identity; nội dung có thể chưa đủ | Recipient và body không rỗng; schedule hợp lệ nếu scheduled | revisions, exact Delivered snapshot, read state |
| Surprise Draft | Creator, Private, Secret | Reveal recipient/rule hợp lệ trước Scheduled | secret internal notes không nằm trong teaser |
| Capsule Draft | Creator và identity | Recipient(s), ≥1 content item, date+time+timezone, reveal mode, assets allowed/snapshotted, confirm version | immutable manifest, recipient opening state, cancellation policy |

## 4.3. Thời điểm và múi giờ

- `occurred_on` là ngày sự kiện trong bối cảnh có ý nghĩa; không đổi ngày chỉ vì màn hình dùng timezone khác.
- `scheduled_delivery_at`/`unlock_at`/`surprise_reveal_at` cần thời điểm tuyệt đối có thể so sánh, đồng thời giữ local datetime + timezone người tạo đã duyệt để hiển thị và audit.
- DST nonexistent local time: chặn và yêu cầu chọn thời điểm; ambiguous local time: xác định chính xác instance.
- M05 sửa ngày Anniversary không đổi `unlock_at` của Capsule đã Seal. Với Letter chưa trao, đổi giờ gửi qua quy trình draft/scheduled editor có quyền.

## 4.4. Phân biệt state, status và quyền

Thư: delivered state theo một phiên bản trao; recipient opened theo người. Surprise: revealed state không khẳng định read. Capsule: unlock eligible theo người và thời gian, opened theo người. URL có token hoặc cached metadata không thể thay thế kiểm tra quyền tại nguồn dữ liệu. Những ràng buộc này là yêu cầu hành vi; giải pháp lưu data và kiểm tra thời gian sẽ được chốt sau.

# 5. Trạng thái và máy chuyển trạng thái

## 5.1. Moment và Milestone

`Draft → Published → Archived`; từ Published có thể sửa theo quyền/lịch sử; Archive có thể khôi phục hiển thị; Delete gửi vào Trash ≥30 ngày. `Private`/`Shared` là chiều quyền độc lập với trạng thái. Moment Published không có nghĩa đã tự mở mọi asset đính kèm.

## 5.2. Love Letter

- `Draft → Processing → Delivered` khi Send Now; hoặc `Draft → Scheduled → Processing → Delivered` khi hẹn. `Processing → Failed` nếu chưa thực sự trao, có retry idempotent và kiểm tra trạng thái.
- `Scheduled → Draft/Cancelled` trước khi trao nếu người viết chọn sửa lịch/hủy hợp lệ. Race gửi/hủy phải cho một kết quả cuối nhất quán, không vừa là Cancelled vừa Delivered.
- `Delivered` là trạng thái trao; `RecipientState: Unread → Opened → Archived` tách riêng; người nhận ẩn/Archive không xóa bản delivered của người gửi.
- Không cho mutation âm thầm trên bản delivered; muốn đính chính tạo nội dung bổ sung có link rõ.

## 5.3. Surprise

`Draft → Preparing → Scheduled → Revealed → Archived`; `Cancelled` trước reveal theo quyền, hủy phải vô hiệu hóa reveal action. `Secret`/`Teaser` là reveal policy; `Revealed` không đồng nghĩa Opened. Không có implicit visibility từ trạng thái Preparing hoặc Scheduled.

## 5.4. Time Capsule

`Draft → Ready → Sealed → Unlock Eligible → Archived`, với `Cancelled` theo quy trình được duyệt; recipient opening là dimension riêng (`NotAvailableYet → AvailableToOpen → Opened → Archived`). Một Capsule được nhận bởi cả A và B có thể A Opened/B AvailableToOpen. `Sealed` *không* chuyển về Draft bằng sửa trực tiếp. Hủy/khôi phục phải tuân thủ lịch sử, chính sách quyền và thời gian; không dùng Restore để bypass unlock.

### Guard cho hành động Seal

1. Creator/editor được phép; capsule chưa sealed/cancelled; recipient(s) hợp lệ.
2. Nội dung ≥1 item, date+clock+timezone hợp lệ, `unlock_at` ở tương lai.
3. Version hiện hành và item permissions hợp lệ; snapshot/manifest có khả năng lưu và phục hồi; quyền xóa toàn diện cần được ghi rõ.
4. Nếu Collaborative: đủ **cả hai** confirmations cho **chính version** đang Seal, không chỉ xác nhận version cũ.
5. Snapshot + manifest + seal state + scheduled action được ghi nhận nhất quán; không báo thành công nếu mới chỉ chạy một nửa. Thao tác lặp không tạo capsule thứ hai.

### Guard cho hành động Open

- Authentication đúng recipient; capsule chưa cancelled/deleted theo chính sách; `trusted_now ≥ unlock_at`; quyền Reveal đang hợp lệ; snapshot/item permitted. Mọi điều kiện được kiểm tra ở nơi cung cấp nội dung, không chỉ ẩn nút mở trên UI.
- Opened ghi khi recipient thực sự mở được nội dung; thông báo, countdown hết số và lần render phần vỏ không tự ghi Opened.
- Nếu đến hạn nhưng hệ thống không thực thi scheduled action, việc yêu cầu xem sau hạn vẫn phải đánh giá điều kiện thực tế theo policy, không phụ thuộc notification.

## 5.5. Hành động Delete / Cancel / Archive

- Delete Moment/Letter Draft: Trash theo quyền; tài nguyên gốc không bị cascade delete.
- Letter Delivered: người nhận ẩn/Archive bản xem của mình, người gửi không xóa âm thầm bản delivered từ người nhận; xóa tài khoản và full deletion phải theo chính sách global chưa chốt M10.
- Capsule Sealed: thao tác **Cancel** với cảnh báo và điều kiện xác nhận; không đơn thuần sửa `unlock_at` về hôm nay; phải vô hiệu hóa scheduled actions và kiểm tra ownership/co-creator.
- Trash ≥30 ngày là soft-delete retention thông thường; xử lý delete toàn diện, bản backup và snapshot cần chính sách M10 về quyền xóa/retention và không được giả định kéo dài vĩnh viễn.

## 5.6. Các race tối thiểu phải kiểm thử

- Letter Scheduled Cancel đồng thời Delivery; cùng trạng thái cuối, không gửi thư sau cancel hợp lệ.
- Collaborative edits đồng thời Seal; version mismatch block seal và yêu cầu review.
- Capsule Cancel đồng thời Unlock Eligible; tuân thủ thứ tự authoritative và không mở lại bằng retry cũ.
- Capsule recipient revocation đồng thời Open; kiểm tra tại request; đã đọc/tải thì không thể retroactively revoke nội dung đã nhìn thấy.
- Restore sealed Capsule sau unlock date; không tự mark Opened; xử lý unlock eligibility sau kiểm tra trạng thái và quyền.
- Notification retry sau đã Delivered; không tạo thêm Letter/copy, chỉ xử lý thông báo idempotent nếu cần.

# 6. Sitemap & đặc tả 20 màn hình

| Mã | Màn hình | Vai trò chính |
| --- | --- | --- |
| SM-01 | Special Moments Home | Cửa vào nhẹ nhàng cho khoảnh khắc, thư và Capsule được phép xem |
| SM-02 | Our Timeline | Dòng thời gian dựa trên ngày xảy ra, không phải ngày tạo |
| SM-03 | Moments Gallery | Duyệt ký ức dạng thẻ ảnh và câu chuyện |
| SM-04 | Create / Edit Moment | Nhập một khoảnh khắc và chia sẻ có chủ đích |
| SM-05 | Moment Detail | Đọc khoảnh khắc và hai cảm nhận riêng |
| SM-06 | Milestones | Tổng hợp cột mốc tình cảm |
| SM-07 | Milestone Detail | Kể câu chuyện, tập hợp ký ức quanh mốc |
| SM-08 | Love Letters | Hộp thư riêng, chia theo của tôi và đã nhận |
| SM-09 | Letter Composer | Soạn, gửi ngay hoặc hẹn giờ trao thư |
| SM-10 | Letter Reader | Đọc phiên bản thư đã trao đúng người |
| SM-11 | Surprises | Quản lý kế hoạch bất ngờ theo quyền người tạo |
| SM-12 | Surprise Editor | Chuẩn bị quà/bất ngờ mà không làm lộ |
| SM-13 | Time Capsules Gallery | Danh sách Capsule creator/recipient được phép biết |
| SM-14 | Capsule Builder | Chuẩn bị Capsule trước khi Seal |
| SM-15 | Capsule Sealing | Kiểm tra và khóa một phiên bản chính xác |
| SM-16 | Locked Capsule View | Chỉ hiển thị phần cho phép trước unlock |
| SM-17 | Capsule Opening | Trao trải nghiệm mở khóa sau khi đủ điều kiện |
| SM-18 | Notifications & Scheduled Content | Xem trạng thái nội dung hẹn gửi/đến hạn và cảnh báo hợp lệ |
| SM-19 | Search, Filters & Collections | Tìm nội dung M08 trong giới hạn quyền và reveal |
| SM-20 | Permissions, History, Trash & Export | Quản lý nội dung và hồi phục không xuyên khóa |

## 6.1. UX dùng chung và Accessibility

- Mobile và desktop phải đi đủ các luồng P0, không dùng hover-only, cỡ vùng bấm thích hợp; form có nhãn, validation hiển thị bên cạnh trường liên quan, focus không bị mất sau lỗi.
- Trạng thái `Saving`, `Saved`, `Pending Delivery`, `Delivered`, `Sealed`, `Unlock Eligible`, `Opened`, `Cancelled`, `Failed`, `Restoring` phải phân biệt bằng chữ và biểu tượng; không dựa duy nhất vào màu hoặc animation.
- `Private` và `Secret` phải hiện rõ khi owner soạn nội dung; trước khi share/Teaser/Seal có summary hành động, người nhận và impact preview.
- Thời gian hiển thị bằng local date/time + timezone đã duyệt khi quan trọng. Countdown chỉ là chỉ báo UI; không sử dụng số đếm client để trao quyền.
- Empty state không tiết lộ hidden content; thông báo lỗi bảo mật không chứa tên/hình của Secret asset.
- Offline/slow network: draft có trạng thái chưa lưu, retry an toàn; không tuyên bố đã deliver/seal. Trạng thái này khác với offline P1 của Trip M04.
- Nút tạo nhanh không bypass quy trình xét quyền và version; không auto-publish media nguồn khi chọn thêm attachment.

## 6.2. Chi tiết SM-01–SM-20

### SM-01 — Special Moments Home

**Mục đích:** Cửa vào nhẹ nhàng cho khoảnh khắc, thư và Capsule được phép xem

- **Điểm vào và trạng thái ban đầu:** Người dùng mở module; lần đầu có empty state riêng, không kéo hidden secret counters
- **Nội dung hiển thị:** Moment được chọn, anniversary từ M05 khi đủ quyền, Letters được nhận, Capsules eligible và Countdown khi đã cho phép, shortcut tạo mới
- **Thao tác P0:** Mở Timeline/Gallery/Letters/Capsules, tạo Moment hoặc Letter, xem nội dung được phép, chuyển về Calendar
- **Ràng buộc dữ liệu/luồng:** Không khẳng định Letter Delivered nếu mới Scheduled; không biến elapsed countdown thành Opened
- **Quyền và chống lộ:** Ẩn hoàn toàn sự tồn tại Surprise/Capsule Secret trước hạn, kể cả số lượng badge
- **Lỗi/empty/khôi phục:** Lỗi tải một widget không được làm trang trắng; hiển thị trạng thái từng khu vực, retry và giữ các phần khác
- **Đối tượng & liên kết:** Moment, M05 Anniversary, LetterDelivery, CapsuleRecipient
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-02 — Our Timeline

**Mục đích:** Dòng thời gian dựa trên ngày xảy ra, không phải ngày tạo

- **Điểm vào và trạng thái ban đầu:** Từ Home/Gallery/Linked Trip; default chỉ tải vùng ngày gần nhất phù hợp quyền
- **Nội dung hiển thị:** Mốc năm/tháng, card có title/date/media permitted, markers milestone, empty dates
- **Thao tác P0:** Chọn phạm vi năm/tháng, filter loại, mở Moment, tạo Moment cho ngày chọn
- **Ràng buộc dữ liệu/luồng:** Ngày xảy ra có thể không có clock time; thứ tự cùng ngày ổn định; phân trang/seek để không tải vô hạn
- **Quyền và chống lộ:** Timeline scope ACL từng item; không hiện placeholder cho Secret hoặc Private của người khác
- **Lỗi/empty/khôi phục:** Link nguồn bị delete thì vẫn hiển thị Moment độc lập; no match và no permission không làm lộ số lượng
- **Đối tượng & liên kết:** Moment, Milestone, Collection, M03 Visit, M04 Trip
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-03 — Moments Gallery

**Mục đích:** Duyệt ký ức dạng thẻ ảnh và câu chuyện

- **Điểm vào và trạng thái ban đầu:** Từ Home hoặc Collections; hỗ trợ ảnh không có cover
- **Nội dung hiển thị:** Ảnh bìa permitted, title, occurred date, category, visible participants, status
- **Thao tác P0:** List/grid, filter, sort, search, mở chi tiết, bulk actions nếu phù hợp quyền
- **Ràng buộc dữ liệu/luồng:** Không tạo media copy; ảnh xem trước theo quyền của M02
- **Quyền và chống lộ:** Không đưa thumbnail từ Private media lên Shared card; không count hidden surprises
- **Lỗi/empty/khôi phục:** Media lỗi thì fallback có nhãn rõ; không tự xóa Moment khi ảnh mất
- **Đối tượng & liên kết:** Moment, AttachmentRef, M02
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-04 — Create / Edit Moment

**Mục đích:** Nhập một khoảnh khắc và chia sẻ có chủ đích

- **Điểm vào và trạng thái ban đầu:** Quick create hoặc edit có quyền; Private default kể cả mở từ Shared Collection
- **Nội dung hiển thị:** Title, occurred date, optional time/timezone, description, category, tags, cover/media, participants, references, visibility
- **Thao tác P0:** Lưu Draft/Published, thêm ảnh, chọn date, chọn nguồn, cấp quyền, xem preview
- **Ràng buộc dữ liệu/luồng:** Title+date bắt buộc; created_at khác occurred_on; optional time rõ; version guard khi cùng edit
- **Quyền và chống lộ:** Khi share preview liệt kê asset Private chưa được cấp quyền và yêu cầu lựa chọn; source ACL độc lập
- **Lỗi/empty/khôi phục:** Thiếu title/date báo field, mất mạng không giả vờ save; reject stale editor updates
- **Đối tượng & liên kết:** Moment, Perspectives, M02, M03, M04, M01
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-05 — Moment Detail

**Mục đích:** Đọc khoảnh khắc và hai cảm nhận riêng

- **Điểm vào và trạng thái ban đầu:** Mở từ Timeline, Gallery, Search hoặc deep link
- **Nội dung hiển thị:** Câu chuyện, hình ảnh hợp lệ, ngày, mỗi perspective với tác giả, linked contents có quyền
- **Thao tác P0:** Xem/sửa theo role, thêm Personal Perspective, bình luận M09 khi có, archive/delete
- **Ràng buộc dữ liệu/luồng:** Ngày gốc giữ đúng; mỗi perspective có owner/editor; version conflicts rõ
- **Quyền và chống lộ:** Không hiện mô tả hoặc thumbnail nguồn bị mất quyền; link click tái kiểm tra ACL
- **Lỗi/empty/khôi phục:** Nguồn M01/M02/M04 bị xóa thì hiển thị unavailable phù hợp; Moment vẫn tồn tại
- **Đối tượng & liên kết:** MomentPerspective, related content, M09 ACL
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-06 — Milestones

**Mục đích:** Tổng hợp cột mốc tình cảm

- **Điểm vào và trạng thái ban đầu:** Từ Home/Timeline hoặc M05 Anniversary
- **Nội dung hiển thị:** Milestones theo năm; anniversary countdown lấy M05; badges không tự suy đoán hoàn thành goal
- **Thao tác P0:** Tạo milestone độc lập, link/unlink Anniversary, mở chi tiết
- **Ràng buộc dữ liệu/luồng:** Không tái triển khai recurrence hoặc Days Together trong M08; chuyển ngày ở M05
- **Quyền và chống lộ:** Milestone Private không được tự hiển thị chung chỉ vì M05 là Shared
- **Lỗi/empty/khôi phục:** M05 reference không tồn tại thì báo missing link không tự sửa ngày giả
- **Đối tượng & liên kết:** RelationshipMilestone, M05 Anniversary
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-07 — Milestone Detail

**Mục đích:** Kể câu chuyện, tập hợp ký ức quanh mốc

- **Điểm vào và trạng thái ban đầu:** Mở từ Milestones hoặc linked M05 Event
- **Nội dung hiển thị:** Ngày từ authoritative M05 nếu linked, các Moment, Letter, media, perspectives có quyền
- **Thao tác P0:** Thêm chuyện, gắn nguồn, chuyển M05 để quản lý ngày/reminder
- **Ràng buộc dữ liệu/luồng:** Một milestone có thể không recurring; nếu đổi ngày nguồn, display cập nhật, không đổi Capsule sealed unlock
- **Quyền và chống lộ:** Không lộ Letter Scheduled hoặc Surprise bí mật qua related list
- **Lỗi/empty/khôi phục:** M05 không truy cập được thì hiển thị link unavailable; không hiển thị cached Private data
- **Đối tượng & liên kết:** Milestone, AnniversaryLink, Moments
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-08 — Love Letters

**Mục đích:** Hộp thư riêng, chia theo của tôi và đã nhận

- **Điểm vào và trạng thái ban đầu:** Từ M08 Home hoặc notification Delivered
- **Nội dung hiển thị:** Draft của bản thân, Scheduled của người gửi, Delivered mình có quyền, recipient archive state
- **Thao tác P0:** Soạn mới, lọc, mở thư, cancel scheduled theo quyền, archive bản xem
- **Ràng buộc dữ liệu/luồng:** Delivered và Opened tách biệt; không tự expose recipient read states tới author
- **Quyền và chống lộ:** Không hiển thị thư Draft/Scheduled người kia; không lộ subject/trích đoạn notification trước delivery
- **Lỗi/empty/khôi phục:** No letters empty state; scheduled processing phải phản ánh trạng thái chưa chắc thành công
- **Đối tượng & liên kết:** Letter, LetterDelivery, LetterRecipientState
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-09 — Letter Composer

**Mục đích:** Soạn, gửi ngay hoặc hẹn giờ trao thư

- **Điểm vào và trạng thái ban đầu:** Chọn New Letter; Draft chỉ tác giả được xem
- **Nội dung hiển thị:** Body, title optional, signature/theme, attachments, recipient, send mode, scheduled local time/timezone, linked M05
- **Thao tác P0:** Autosave/Save Draft, preview recipients, Send Now, Schedule, edit/cancel pre-delivery
- **Ràng buộc dữ liệu/luồng:** Body nonempty để trao; recipient hợp lệ; version freeze khi Delivered; email/push không cần để gửi thành công trong app
- **Quyền và chống lộ:** Mọi preview draft chỉ theo author/ủy quyền rõ; ảnh đính kèm phải có quyền phân phối đúng người
- **Lỗi/empty/khôi phục:** Network send uncertain không tạo duplicate; validate missing body/recipient/invalid future datetime
- **Đối tượng & liên kết:** LetterRevision, Delivery, M02, M05
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-10 — Letter Reader

**Mục đích:** Đọc phiên bản thư đã trao đúng người

- **Điểm vào và trạng thái ban đầu:** Recipient từ inbox/notification hoặc author mở bản delivered của mình
- **Nội dung hiển thị:** Frozen body, author, delivered timestamp, media permitted, optional linked anniversary/moment, archive status
- **Thao tác P0:** Đọc, archive cá nhân, reaction qua M09 nếu duyệt, xem linked content có quyền
- **Ràng buộc dữ liệu/luồng:** Opened chỉ khi nội dung thực sự mở thành công; không cho direct edit delivered content
- **Quyền và chống lộ:** Author không tự nhìn thấy read receipts recipient; sender chưa được mở các tương tác riêng không cấp
- **Lỗi/empty/khôi phục:** Media lỗi fallback, failed delivery không đưa thư vào recipient inbox
- **Đối tượng & liên kết:** LetterDelivery, RecipientState, M09
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-11 — Surprises

**Mục đích:** Quản lý kế hoạch bất ngờ theo quyền người tạo

- **Điểm vào và trạng thái ban đầu:** Owner nhìn thấy private plans, recipient chỉ thấy teaser đã bật hoặc reveal
- **Nội dung hiển thị:** Own draft/preparing/scheduled; revealed đã được phép; không count hidden recipient items
- **Thao tác P0:** Tạo/edit/cancel, chọn tiết lộ, mở nội dung Revealed, archive
- **Ràng buộc dữ liệu/luồng:** Secret default; reveal state không phải viewed; lúc đến giờ phải có reveal policy hợp lệ
- **Quyền và chống lộ:** Recipient trước hạn không được thấy secret name, number, thumbnail, search result
- **Lỗi/empty/khôi phục:** Lỗi load không reveal internals; missed reveal xử lý idempotently khi hệ thống hoạt động
- **Đối tượng & liên kết:** Surprise, RevealRule, M06 Task, M07 Expense
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-12 — Surprise Editor

**Mục đích:** Chuẩn bị quà/bất ngờ mà không làm lộ

- **Điểm vào và trạng thái ban đầu:** Owner/editor được cấp với default Secret
- **Nội dung hiển thị:** Internal title, private notes, recipient, reveal mode, sanitized teaser fields, date/time/timezone, linked Letter/Capsule
- **Thao tác P0:** Save Draft, schedule, preview-as-recipient, sửa trước reveal, cancel
- **Ràng buộc dữ liệu/luồng:** Tách metadata cho owner và teaser projection; linked private budgets/goals không đổi ACL
- **Quyền và chống lộ:** Không cho teaser preview vô tình chứa expense/title private; backend độc lập enforce reveal
- **Lỗi/empty/khôi phục:** Cập nhật đúng lúc reveal: conflict/retry safe, không cả cancelled và revealed
- **Đối tượng & liên kết:** Surprise, ScheduledAction, link M06/M07
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-13 — Time Capsules Gallery

**Mục đích:** Danh sách Capsule creator/recipient được phép biết

- **Điểm vào và trạng thái ban đầu:** Từ Home/Countdown/Notification; Secret recipient chưa hạn không trả entry
- **Nội dung hiển thị:** Creator metadata permitted; recipient countdown chỉ nếu mode countdown; eligible capsule, opened archive
- **Thao tác P0:** Tạo Capsule, mở card đủ quyền, chọn filtering own/received/opened
- **Ràng buộc dữ liệu/luồng:** Recipient trạng thái riêng; countdown không đồng nghĩa unlock; authentic datetime only
- **Quyền và chống lộ:** Secret capsule không xuất hiện trong result count, badges, empty text cho recipient
- **Lỗi/empty/khôi phục:** Nếu timeline service không tải, không lộ nội dung; card hiển thị not yet checked thay vì sai trạng thái
- **Đối tượng & liên kết:** TimeCapsule, Recipient, RevealAccessRule
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-14 — Capsule Builder

**Mục đích:** Chuẩn bị Capsule trước khi Seal

- **Điểm vào và trạng thái ban đầu:** Tạo Draft hoặc mở Draft mình có quyền, collaborative invited editor
- **Nội dung hiển thị:** Title, recipient(s), text/photo/video/link item, cover, reveal mode, unlock date/time/timezone, sort items, permission preview
- **Thao tác P0:** Thêm/sửa/xóa/reorder item, lưu Draft, đề xuất ready, mời collaborator, xem preview
- **Ràng buộc dữ liệu/luồng:** Cần item hợp lệ; recipient; ≥1 item; xác định timezone, asset permission; versioned concurrent saves
- **Quyền và chống lộ:** Private draft; shared collaborator xem đúng scope; không share M02 source globally
- **Lỗi/empty/khôi phục:** Upload item chưa xong không được Seal; xung đột file/revision báo để resolve
- **Đối tượng & liên kết:** CapsuleItem, Snapshot candidates, M02
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-15 — Capsule Sealing

**Mục đích:** Kiểm tra và khóa một phiên bản chính xác

- **Điểm vào và trạng thái ban đầu:** Chỉ từ Ready Draft; owner và collaborator confirmations
- **Nội dung hiển thị:** Final summary content, recipients, local datetime/timezone/absolute time, Secret/Countdown, irreversible warning, asset snapshot policy
- **Thao tác P0:** Review, add signatures, confirm Seal, trở lại sửa Draft khi chưa Seal
- **Ràng buộc dữ liệu/luồng:** Signer signatures bound to exact version; compare revision; snapshot+manifest+status+action consistency
- **Quyền và chống lộ:** Không hiện secret metadata cho recipient chưa có quyền; không cấp unlock sớm
- **Lỗi/empty/khôi phục:** Version stale, snapshot failure, invalid asset/clock => abort/keep draft; never false sealed
- **Đối tượng & liên kết:** SealConfirmation, SealedManifest, Snapshot, ScheduledAction
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-16 — Locked Capsule View

**Mục đích:** Chỉ hiển thị phần cho phép trước unlock

- **Điểm vào và trạng thái ban đầu:** Creator view own metadata; recipient countdown chỉ khi opted in
- **Nội dung hiển thị:** Title/clock/cover subset đã được author consent; Secret recipient thấy not found, not locked hint
- **Thao tác P0:** Creator xem status/cancel theo quyền; recipient xem countdown nếu allowed
- **Ràng buộc dữ liệu/luồng:** Không render content thumbnail, asset bytes, raw API metadata; server-based eligibility
- **Quyền và chống lộ:** Check identity/state/ACL/time on each request; source URL cannot bypass
- **Lỗi/empty/khôi phục:** Nếu server clock unknown, không tự allow; stale cache không làm unlock
- **Đối tượng & liên kết:** Capsule, RevealAccessRule, CapsuleRecipient
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-17 — Capsule Opening

**Mục đích:** Trao trải nghiệm mở khóa sau khi đủ điều kiện

- **Điểm vào và trạng thái ban đầu:** Recipient đã xác thực; now>=unlock_at; valid sealed/eligible
- **Nội dung hiển thị:** Snapshot contents, ordered manifest, timestamp, personal opened flag, optional associated Moment/Letter permitted
- **Thao tác P0:** Open, read/view permitted attachments, archive own opened view, navigate related items
- **Ràng buộc dữ liệu/luồng:** Mark Opened after successful content presentation; recipients individually tracked; no auto-delete
- **Quyền và chống lộ:** Backend checks auth+time+status+right; no pre-unlock raw media endpoints
- **Lỗi/empty/khôi phục:** Một asset lỗi không đánh dấu giả đã mở cả capsule khi nội dung không được trình bày; retry available
- **Đối tượng & liên kết:** OpeningRecord, Snapshot, recipient ACL
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-18 — Notifications & Scheduled Content

**Mục đích:** Xem trạng thái nội dung hẹn gửi/đến hạn và cảnh báo hợp lệ

- **Điểm vào và trạng thái ban đầu:** Owner quản lý scheduled, recipient xem delivered/eligible; in-app notice center shared
- **Nội dung hiển thị:** Upcoming own scheduled content, send success/failure, entitled new deliveries/eligible capsules
- **Thao tác P0:** Kiểm tra trạng thái, cancel/reschedule Letter, mở delivered letter/capsule
- **Ràng buộc dữ liệu/luồng:** Processing không Delivered; notification failed không revoke access; idempotency per action
- **Quyền và chống lộ:** Nội dung secret trước hạn không xuất hiện trong recipient notice, count/preview hoặc notification logs
- **Lỗi/empty/khôi phục:** Retry an toàn, permission revoked => no notice; không thông báo đã gửi khi failure
- **Đối tượng & liên kết:** ScheduledAction, NotificationReference, M05/M10
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-19 — Search, Filters & Collections

**Mục đích:** Tìm nội dung M08 trong giới hạn quyền và reveal

- **Điểm vào và trạng thái ban đầu:** Từ header/timeline; filter loại, ngày, collection, status
- **Nội dung hiển thị:** Moment/Milestone/Letter/Capsule subset permitted; tags, dates, source links as allowed
- **Thao tác P0:** Search text, lọc, sort, mở kết quả, lưu view preferences nếu M10 hỗ trợ
- **Ràng buộc dữ liệu/luồng:** Index không tự đẩy Secret into suggestions/facets; filtered counts after ACL
- **Quyền và chống lộ:** Cả existence, titles, cover, tag, autocomplete đều cần permission và reveal gating
- **Lỗi/empty/khôi phục:** Search không được dùng dữ liệu cache trước revocation; empty no-leak state
- **Đối tượng & liên kết:** Moment, Letter, Capsule, Collection, Permissions
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

### SM-20 — Permissions, History, Trash & Export

**Mục đích:** Quản lý nội dung và hồi phục không xuyên khóa

- **Điểm vào và trạng thái ban đầu:** Only owner/entitled party; menu quyền phù hợp theo object lifecycle
- **Nội dung hiển thị:** Role/recipient, reveal policy, audit view redacted, trash, export jobs, state history
- **Thao tác P0:** Share/revoke, archive, soft-delete, restore, export allowed, cancel sealed as policy
- **Ràng buộc dữ liệu/luồng:** Delivered recipient copy không xóa đơn phương; restore snapshots giữ lock; export denies unreadable sealed content
- **Quyền và chống lộ:** Audit/export/trash/backup not new bypass; attachment permission independent
- **Lỗi/empty/khôi phục:** Restore có missing source thì cảnh báo; scheduled old actions not reactivated blindly
- **Đối tượng & liên kết:** Permission, Audit, Trash, Export, all entities
- **Desktop/mobile:** Desktop có thể dùng danh sách + panel chi tiết; mobile phải có đường đi tương đương, thao tác chạm đủ rõ, không mất field. Không phụ thuộc hover, không dùng hiệu ứng hình ảnh làm điều kiện để thực hiện nghiệp vụ.

# 7. 82 Business Rules đã phê duyệt

**Quy ước:** mọi mã dưới đây là yêu cầu P0, trừ khi tên mục nêu rõ phần P1/P2. Nếu xảy ra mâu thuẫn với chỉ dẫn kỹ thuật, không được nới quyền hoặc thay đổi điều kiện seal/unlock.

## 7.1. Moments & Collections

- **BR-M08-01:** Moment là nội dung độc lập, không bắt buộc gắn Event hay Trip.
- **BR-M08-02:** Ngày xảy ra Moment có thể khác ngày tạo bản ghi.
- **BR-M08-03:** Timeline sắp xếp theo ngày xảy ra, có thứ tự ổn định khi nhiều Moment cùng ngày.
- **BR-M08-04:** Tạo Moment không tự tạo Visit, Expense, Trip hoặc Diary.
- **BR-M08-05:** Moment Private không tự xuất hiện trên Timeline của người còn lại.
- **BR-M08-06:** Một Moment có thể nằm trong nhiều Collection mà không nhân bản nội dung.
- **BR-M08-07:** Xóa Collection không tự xóa các Moment bên trong.
- **BR-M08-08:** Chia sẻ Collection không tự cấp quyền truy cập mọi ảnh hoặc Moment Private.
- **BR-M08-09:** Ảnh/video đính kèm phải tuân thủ quyền và quan hệ M02.
- **BR-M08-10:** Xóa/Archive Moment không xóa dây chuyền Place, Trip, Diary hoặc Media gốc.

## 7.2. Relationship Milestones

- **BR-M08-11:** Milestone tình cảm có thể liên kết Anniversary thuộc M05.
- **BR-M08-12:** Thay đổi ngày gốc Anniversary phải phản ánh ở M08, không tạo hai ngày gốc độc lập.
- **BR-M08-13:** Ghi Moment quá khứ không tự tạo Anniversary mới trong M05.
- **BR-M08-14:** Milestone có thể tồn tại mà không có recurrence hằng năm.
- **BR-M08-15:** Trip/Goal Completed không tự xác nhận Milestone M08; việc tạo nội dung phải theo hành động hợp lệ.

## 7.3. Love Letters

- **BR-M08-16:** Love Letter Draft mặc định chỉ tác giả đọc.
- **BR-M08-17:** Recipient không được thấy Scheduled Letter trước thời điểm trao hợp lệ.
- **BR-M08-18:** Gửi thư phải có đúng recipient, không suy luận từ Collection rights.
- **BR-M08-19:** Scheduled Letter có thời điểm và timezone xác định.
- **BR-M08-20:** Không sửa âm thầm nội dung Letter Delivered.
- **BR-M08-21:** Xử lý lại send không tạo nhiều bản Delivered trùng.
- **BR-M08-22:** Không báo đã gửi thành công trước khi có xác nhận delivery thực tế.
- **BR-M08-23:** Delivered khác Opened; lưu riêng.
- **BR-M08-24:** Người gửi không mặc định xem được read-history chi tiết của recipient.
- **BR-M08-25:** Recipient có thể archive/ẩn bản xem cá nhân mà không tự xóa bản lưu hợp lệ của author.

## 7.4. Surprises

- **BR-M08-26:** Surprise mới mặc định Private + Secret.
- **BR-M08-27:** Recipient không đọc được Surprise bí mật trước reveal.
- **BR-M08-28:** Teaser chỉ hiển thị trường tác giả đã cho phép.
- **BR-M08-29:** Link Surprise tới M05/M06/M07 không tự đổi quyền của nguồn.
- **BR-M08-30:** Đổi lịch reveal phải cập nhật quyền và scheduled notifications còn hợp lệ.
- **BR-M08-31:** Revealed không đồng nghĩa recipient đã xem.
- **BR-M08-32:** Hủy Surprise không tự xóa Letter, Capsule, Expense hoặc Task nguồn.
- **BR-M08-33:** Surprise Secret không lộ qua số lượng, search, recent activity, deep link.

## 7.5. Time Capsules

- **BR-M08-34:** Capsule Draft có thể sửa; Capsule Sealed không sửa trực tiếp nội dung/lịch mở.
- **BR-M08-35:** Seal phải hoàn tất lưu và khóa nhất quán trước khi chuyển trạng thái thành công.
- **BR-M08-36:** Nội dung Capsule Sealed không được đọc trước giờ mở qua quyền/giao diện thông thường.
- **BR-M08-37:** Recipient và unlock timestamp phải được xác định hợp lệ trước khi Seal.
- **BR-M08-38:** Quyền unlock dựa vào thời gian hệ thống đáng tin cậy và timezone xác định.
- **BR-M08-39:** Chỉnh giờ thiết bị không làm mở Capsule sớm.
- **BR-M08-40:** Đến giờ chỉ trao quyền mở, không auto mark Opened.
- **BR-M08-41:** Mỗi recipient có trạng thái mở riêng khi Capsule dành cho cả hai.
- **BR-M08-42:** Snapshot nội dung khi Seal ổn định theo chính sách lưu trữ đã duyệt.
- **BR-M08-43:** Chỉnh nguồn ảnh/Diary không âm thầm sửa Capsule đã khóa.
- **BR-M08-44:** Yêu cầu xóa nguồn phải có xử lý bản Snapshot rõ ràng và đúng quyền.
- **BR-M08-45:** Hủy Capsule ngăn mọi tác vụ reveal/open/notification tương lai không còn hợp lệ.
- **BR-M08-46:** Lỗi tải state không được tự mở khóa Capsule.
- **BR-M08-47:** Deep link/Search/Export/Preview không vượt trạng thái Sealed.
- **BR-M08-48:** Kiểm tra quyền unlock lại tại yêu cầu truy cập, không chỉ lúc tải danh sách.
- **BR-M08-49:** Người nhận offline có thể mở muộn hơn unlock time, không bị coi lỗi hoặc hết hạn.
- **BR-M08-50:** Không tự xóa Capsule sau lần mở nếu không có yêu cầu.

## 7.6. Scheduled Content & Notifications

- **BR-M08-51:** Notification không được là điều kiện duy nhất quyết định Delivered hoặc Unlock Eligible.
- **BR-M08-52:** Scheduled actions phải idempotent: không tạo delivery/open duplicate.
- **BR-M08-53:** Thư hẹn và Capsule hợp lệ phải tiếp tục đến hạn dù tác giả offline.
- **BR-M08-54:** Notification không lộ title/cover/excerpt bí mật trước giờ được phép.
- **BR-M08-55:** Hủy/thu hồi nội dung vô hiệu hóa notification tương lai khi phù hợp.
- **BR-M08-56:** Trạng thái chưa trao/đã trao/recipient đã mở phải tách biệt.
- **BR-M08-57:** Chỉnh M05 Anniversary không tự đổi lịch unlock của Capsule Sealed.
- **BR-M08-58:** Notification failure không làm mất quyền mở hợp lệ.

## 7.7. Access Control & Privacy

- **BR-M08-59:** Quyền biết tồn tại khác quyền đọc metadata/content.
- **BR-M08-60:** Secret không lộ qua Search, Analytics, Export, Notification, Activity Feed.
- **BR-M08-61:** Thu hồi quyền phải ngăn các truy cập mới, kể cả khi tab cũ còn mở.
- **BR-M08-62:** ACL M08 không tự thay thế ACL ảnh/Diary/Trip nguồn.
- **BR-M08-63:** Capsule được mở chỉ khi danh tính, thời gian và trạng thái đều hợp lệ.
- **BR-M08-64:** Thay đổi quyền sau Delivered không làm giả lịch sử đã trao.
- **BR-M08-65:** Không thể hứa thu hồi dữ liệu người đã xem/tải/copy; UI phải không tạo kỳ vọng sai.
- **BR-M08-66:** Nội dung Secret được bảo vệ mặc định, không phụ thuộc Shared Calendar/Collection.

## 7.8. Collaboration

- **BR-M08-67:** Cùng edit Moment không mất thay đổi âm thầm.
- **BR-M08-68:** Personal Perspective có tác giả và quyền riêng rõ.
- **BR-M08-69:** Collaborative Capsule cần xác nhận nội dung cuối trước Seal.
- **BR-M08-70:** Edit đồng thời Seal phải xử lý revision conflict trước khi khóa.
- **BR-M08-71:** Revoked editor không thể lưu thao tác trái quyền.
- **BR-M08-72:** M08 P0 không yêu cầu live cursor hoặc keystroke collaboration.

## 7.9. Cross-module

- **BR-M08-73:** M05 là nguồn Anniversary và recurrence duy nhất.
- **BR-M08-74:** M08 không tự copy Diary/Photobook chỉ vì có related link.
- **BR-M08-75:** M02 là nguồn media gốc; sealed snapshot là bản bảo vệ với chính sách xóa riêng.
- **BR-M08-76:** Trip/Goal Completed không tự tạo Moment/Letter công khai.
- **BR-M08-77:** Delete/Archive Moment không cascade delete đối tượng nguồn.
- **BR-M08-78:** M09 comment/reaction phải kế thừa quyền của nội dung M08 và reveal state.
- **BR-M08-79:** Link nguồn bị xóa/mất quyền phải được xử lý bằng unavailable/redaction hợp lệ.
- **BR-M08-80:** Cross-module synchronization phải tránh Moment/link trùng.

## 7.10. Audit, Trash, Backup/Export

- **BR-M08-81:** Trash/Restore/Export/Backup không thể bypass secrecy hoặc pre-unlock access.
- **BR-M08-82:** Restore phải giữ recipients, access, delivery/open state, unlock timestamp và snapshot hợp lệ.

# 8. Hai mươi hai Use Cases chi tiết

| Mã | Use Case | Actor |
| --- | --- | --- |
| UC-M08-01 | Create Private Moment | A — author |
| UC-M08-02 | Share Moment | A — Moment owner |
| UC-M08-03 | Add Personal Perspective | A và B |
| UC-M08-04 | Organize Moment Collection | A — owner |
| UC-M08-05 | Link Anniversary/Milestone | A hoặc B được cấp quyền |
| UC-M08-06 | Draft Love Letter | A — author |
| UC-M08-07 | Send Love Letter Now | A gửi cho B |
| UC-M08-08 | Schedule Love Letter | A gửi cho B |
| UC-M08-09 | Cancel Scheduled Letter | A — author |
| UC-M08-10 | Prepare Secret Surprise | A — creator |
| UC-M08-11 | Reveal Surprise | M08 scheduled service; B recipient |
| UC-M08-12 | Create Time Capsule | A — creator |
| UC-M08-13 | Add Capsule Contents | A/Collaborator |
| UC-M08-14 | Seal Time Capsule | A — owner |
| UC-M08-15 | Seal Collaborative Capsule | A và B — collaborators |
| UC-M08-16 | Unlock Eligible Capsule | Trusted scheduled process |
| UC-M08-17 | Open Time Capsule | B recipient (A nếu cả hai) |
| UC-M08-18 | Reject Early Access | B — recipient/unauthorized |
| UC-M08-19 | Update Permissions | A — owner, B editor đã cấp |
| UC-M08-20 | Cancel/Restore Capsule | A và co-owner khi cần |
| UC-M08-21 | Export Accessible Memories | A hoặc B — tài khoản có quyền |
| UC-M08-22 | Resolve Concurrent Changes | A và B editors |


## 8.1. Các luồng kiểm thử end-to-end

### UC-M08-01 — Create Private Moment

- **Actors:** A — author.
- **Tiền điều kiện:** A logged in; empty or existing timeline.
- **Luồng chính:** Mở Create Moment; nhập title/ngày quá khứ hoặc hiện tại; tùy chọn ảnh M02; giữ Private; lưu; mở detail và timeline.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Một Moment đúng occurred date, creator và Private ACL; B không nhận result/count.
- **Ngoại lệ / luồng thay thế:** Thiếu title/date không publish; offline ghi rõ unsaved, retry không nhân bản.
- **Màn hình liên quan:** SM-04, SM-05, SM-02. **Quy tắc:** BR-M08-01–10.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-02 — Share Moment

- **Actors:** A — Moment owner.
- **Tiền điều kiện:** Moment Private hợp lệ; B có tài khoản Our Space.
- **Luồng chính:** A mở Permissions; chọn B và role; rà soát ảnh/Diary nguồn đang Private; quyết định chia sẻ asset hợp lệ hoặc ẩn; xác nhận; B tải lại.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** B chỉ thấy Moment và asset đủ quyền; A giữ lịch sử thay đổi chia sẻ.
- **Ngoại lệ / luồng thay thế:** Asset nguồn từ chối quyền không auto share; thu hồi quyền block access mới.
- **Màn hình liên quan:** SM-05, SM-20. **Quy tắc:** BR-M08-05,08,09,59–66.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-03 — Add Personal Perspective

- **Actors:** A và B.
- **Tiền điều kiện:** Shared Moment; hai người được cấp quyền ghi góc nhìn riêng.
- **Luồng chính:** A mở perspective A và viết; B mở perspective B và viết; cả hai lưu gần như đồng thời; tải lại detail.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Hai text tách theo tác giả, không ghi đè; cùng một Moment.
- **Ngoại lệ / luồng thay thế:** Concurrent same perspective cần conflict/version handling; revoke khi đang edit block save.
- **Màn hình liên quan:** SM-05. **Quy tắc:** BR-M08-67–71.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-04 — Organize Moment Collection

- **Actors:** A — owner.
- **Tiền điều kiện:** Có Moment hợp lệ, quyền quản lý Collection.
- **Luồng chính:** Tạo Collection; gắn Moment X vào Collection 1 và 2; remove khỏi 1; xóa Collection 2; kiểm tra X.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** X vẫn tồn tại với cùng ID; Collection shared không thay ACL X.
- **Ngoại lệ / luồng thay thế:** Nguồn mất quyền phải ẩn nội dung; no duplicate memberships qua retry.
- **Màn hình liên quan:** SM-03, SM-19. **Quy tắc:** BR-M08-06–10.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-05 — Link Anniversary/Milestone

- **Actors:** A hoặc B được cấp quyền.
- **Tiền điều kiện:** M05 có Anniversary hoặc M08 tạo milestone độc lập.
- **Luồng chính:** Tạo Milestone; chọn link M05 Anniversary; thêm chuyện/ảnh; thay ngày tại M05 theo quyền; quay lại M08.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Ngày liên kết phản ánh M05; không tạo Anniversary duplicate; milestone độc lập vẫn hợp lệ.
- **Ngoại lệ / luồng thay thế:** M05 link xóa/mất quyền hiển thị unavailable; Capsule sealed date không bị đổi.
- **Màn hình liên quan:** SM-06, SM-07. **Quy tắc:** BR-M08-11–15,73.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-06 — Draft Love Letter

- **Actors:** A — author.
- **Tiền điều kiện:** A đăng nhập; B là recipient tiềm năng.
- **Luồng chính:** Mở Letter Composer; soạn một phần, chọn signature optional; lưu Draft trước khi chọn recipient; mở lại chỉnh.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Draft lưu được và chỉ author đọc, có revision identity.
- **Ngoại lệ / luồng thay thế:** Nếu autosave lỗi không báo Saved; recipient B không xem được qua inbox/search.
- **Màn hình liên quan:** SM-09, SM-08. **Quy tắc:** BR-M08-16–19.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-07 — Send Love Letter Now

- **Actors:** A gửi cho B.
- **Tiền điều kiện:** Draft body nonempty, recipient B hợp lệ.
- **Luồng chính:** A chọn Send Now; review người nhận; xác nhận; hệ thống chuyển Processing và Delivered khi thành công; B mở Inbox rồi Reader.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Một frozen delivered revision; B có quyền đọc; chưa Opened trước khi B đọc.
- **Ngoại lệ / luồng thay thế:** Double submit idempotent; lỗi mạng không báo success giả.
- **Màn hình liên quan:** SM-09, SM-10. **Quy tắc:** BR-M08-18,20–24.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-08 — Schedule Love Letter

- **Actors:** A gửi cho B.
- **Tiền điều kiện:** Draft hợp lệ, future time hợp lệ và timezone.
- **Luồng chính:** A chọn Scheduled; nhập ngày/giờ/timezone; review; xác nhận; A offline; tới hạn hệ thống deliver; B mở Inbox.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Không lộ trước hạn; delivery độc lập author online; trạng thái recipient ban đầu Unread.
- **Ngoại lệ / luồng thay thế:** Invalid DST/time/timezone block; scheduled job retry không tạo duplicate.
- **Màn hình liên quan:** SM-09, SM-18. **Quy tắc:** BR-M08-17–23,51–58.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-09 — Cancel Scheduled Letter

- **Actors:** A — author.
- **Tiền điều kiện:** Letter chưa Delivered.
- **Luồng chính:** A mở danh sách Scheduled; chọn Cancel; xem tác động; xác nhận; hệ thống ngăn action tới hạn; kiểm tra inbox B sau lịch cũ.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Không được Delivered sau Cancel hợp lệ, history rõ.
- **Ngoại lệ / luồng thay thế:** Race cancel vs delivery phải xử lý authoritative one final outcome; nếu đã Delivered không giả hủy.
- **Màn hình liên quan:** SM-08, SM-18. **Quy tắc:** BR-M08-19–22,52,55.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-10 — Prepare Secret Surprise

- **Actors:** A — creator.
- **Tiền điều kiện:** A có quyền tạo; B là recipient.
- **Luồng chính:** Tạo Surprise Secret; viết title nội bộ; link M06 Task Private và M07 Expense Private; thêm Letter/Capsule optional; set reveal date; save; B search/calendar/budget.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** B không thấy existence/counter/notifications trước reveal; các nguồn vẫn Private.
- **Ngoại lệ / luồng thay thế:** Teaser phải sanitized fields và explicit opt-in; deep link không reveal info.
- **Màn hình liên quan:** SM-11, SM-12. **Quy tắc:** BR-M08-26–33,59–66.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-11 — Reveal Surprise

- **Actors:** M08 scheduled service; B recipient.
- **Tiền điều kiện:** Surprise Scheduled và tới giờ hợp lệ.
- **Luồng chính:** Trusted time reached; hệ thống kiểm state/ACL; chuyển Revealed; có in-app notice hợp lệ; B mở nội dung nếu muốn.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Revealed cho đúng B, nhưng không tự coi B đã xem; A biết trạng thái xử lý.
- **Ngoại lệ / luồng thay thế:** Cancelled/permission revoked => không reveal; retry không duplicate.
- **Màn hình liên quan:** SM-11, SM-18. **Quy tắc:** BR-M08-30–33,51–58.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-12 — Create Time Capsule

- **Actors:** A — creator.
- **Tiền điều kiện:** A logged in; new Capsule Private Secret.
- **Luồng chính:** Mở Builder; tạo title; chọn recipient B; chọn Secret/Countdown; lưu Draft; tiếp tục nhập contents.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Draft có stable ID, metadata riêng, chưa bị coi Sealed hoặc có quyền xem cho B.
- **Ngoại lệ / luồng thay thế:** Không có recipients/content vẫn có thể lưu Draft nhưng Seal bị chặn.
- **Màn hình liên quan:** SM-14, SM-13. **Quy tắc:** BR-M08-34–38.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-13 — Add Capsule Contents

- **Actors:** A/Collaborator.
- **Tiền điều kiện:** Capsule còn Draft; source assets hợp lệ.
- **Luồng chính:** Thêm text, ảnh/video M02, sắp xếp item; chỉnh sửa text; chọn cover; kiểm tra quyền và snapshot availability.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Items xác định được và authoring revision cập nhật; ảnh/video không bị copy lung tung trước Seal.
- **Ngoại lệ / luồng thay thế:** Attachment upload lỗi/chưa đủ quyền không thể được Seal; cần xử lý deleted references.
- **Màn hình liên quan:** SM-14. **Quy tắc:** BR-M08-42–44,75.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-14 — Seal Time Capsule

- **Actors:** A — owner.
- **Tiền điều kiện:** Capsule Draft/Ready hợp lệ, recipient/time/contents đầy đủ.
- **Luồng chính:** Review final manifest; kiểm tra local time/timezone; xem cảnh báo irreversible; hệ thống validate asset/recipients; A xác nhận; snapshot+manifest+state+scheduled action được commit hợp lệ.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Chỉ báo Sealed sau khi toàn bộ thành công; không sửa trực tiếp; không ai đọc trước unlock qua app.
- **Ngoại lệ / luồng thay thế:** Version changed/snapshot fails => abort, vẫn chưa Sealed; retry idempotent.
- **Màn hình liên quan:** SM-15, SM-16. **Quy tắc:** BR-M08-34–50.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-15 — Seal Collaborative Capsule

- **Actors:** A và B — collaborators.
- **Tiền điều kiện:** Hai người được mời xem Draft và hiểu đây không phải surprise bí mật cho nhau.
- **Luồng chính:** A và B thêm contents; cùng xem version v; mỗi người xác nhận đúng v; server so version/current; Seal atomically.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Chỉ Seal khi cả hai xác nhận bản cuối đúng revision; không mất content.
- **Ngoại lệ / luồng thay thế:** B thêm ảnh sau A sign => sign invalidated, phải review/confirm lại.
- **Màn hình liên quan:** SM-14, SM-15. **Quy tắc:** BR-M08-67–72.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-16 — Unlock Eligible Capsule

- **Actors:** Trusted scheduled process.
- **Tiền điều kiện:** Capsule Sealed active và current trusted time tới unlock_at.
- **Luồng chính:** Hệ thống đánh giá đúng timestamp/timezone; kiểm tra chưa Cancelled; quyền mở hợp lệ; cập nhật eligibility/state idempotent; notification nếu được phép.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Recipient đủ quyền có thể Open; chưa auto Opened; notification failure không revoke access.
- **Ngoại lệ / luồng thay thế:** Client clock bị đổi không tác dụng; retry cũ cancelled không unlock; user offline không mất cơ hội.
- **Màn hình liên quan:** SM-16, SM-17, SM-18. **Quy tắc:** BR-M08-38–50,51–58.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-17 — Open Time Capsule

- **Actors:** B recipient (A nếu cả hai).
- **Tiền điều kiện:** B authenticated, Capsule eligible, proper reveal ACL.
- **Luồng chính:** B mở from gallery/notification; backend kiểm auth/time/status; render đúng sealed manifest và snapshot; B xác nhận mở qua hành động thực tế; ghi OpeningRecord.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** B Opened; nếu A là recipient còn Not Opened thì trạng thái A giữ nguyên; content giữ sau mở.
- **Ngoại lệ / luồng thay thế:** Partial load errors không fake read; missing snapshot phải cảnh báo và hỗ trợ recovery.
- **Màn hình liên quan:** SM-17. **Quy tắc:** BR-M08-40–43,48–50.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-18 — Reject Early Access

- **Actors:** B — recipient/unauthorized.
- **Tiền điều kiện:** Capsule Secret hoặc Countdown vẫn Sealed trước unlock.
- **Luồng chính:** B đoán direct URL/download endpoint, dùng search/export, đổi client clock; hệ thống kiểm quyền trực tiếp ở dữ liệu và media.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Không nhận nội dung hoặc metadata Secret; countdown chỉ projection được author cấp.
- **Ngoại lệ / luồng thay thế:** Không dùng 403 có embedded title; không tính Secret vào count; no client-only guard.
- **Màn hình liên quan:** SM-16, SM-19, SM-20. **Quy tắc:** BR-M08-36–39,47–48,59–66,81.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-19 — Update Permissions

- **Actors:** A — owner, B editor đã cấp.
- **Tiền điều kiện:** Moment/Letter/Surprise/Capsule với scope được phép thay đổi.
- **Luồng chính:** A thay đổi role; nếu share Moment có media Private thì review; B đang mở editor; A revoke; B thử save.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Thao tác trái quyền bị chặn ở server; không lộ dữ liệu nguồn; lịch sử thay quyền.
- **Ngoại lệ / luồng thay thế:** Không thay Delivered past fact; already downloaded cannot be retracted.
- **Màn hình liên quan:** SM-20. **Quy tắc:** BR-M08-59–71.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-20 — Cancel/Restore Capsule

- **Actors:** A và co-owner khi cần.
- **Tiền điều kiện:** Capsule Sealed chưa mở, policy cancel cho phép; hoặc Trash item trong hạn.
- **Luồng chính:** Hiển thị impact và co-owner confirmation; request Cancel; disable scheduled; soft-delete theo policy; nếu Restore, kiểm time/state/recipient/source refs.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Không tự unlock từ old job; phục hồi giữ seal snapshot và time đúng; không auto Opened.
- **Ngoại lệ / luồng thay thế:** Race cancel/unlock, restore after unlock time, deleted source require explicit handling.
- **Màn hình liên quan:** SM-20, SM-16. **Quy tắc:** BR-M08-44–50,81–82.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-21 — Export Accessible Memories

- **Actors:** A hoặc B — tài khoản có quyền.
- **Tiền điều kiện:** Có Moments/Letters/Capsules ở nhiều trạng thái và mức quyền.
- **Luồng chính:** Chọn export scope; server kiểm từng object/content/attachment; xuất Moment permitted, delivered Letters permitted, Capsule readable only if eligible; include metadata allowed.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Bản xuất không chứa Secret/unopened sealed contents, không có resource có quyền bị thiếu.
- **Ngoại lệ / luồng thay thế:** Export snapshot/backup leak test; read-only archive khác restore internal backup.
- **Màn hình liên quan:** SM-20, SM-19. **Quy tắc:** BR-M08-59–66,81–82.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

### UC-M08-22 — Resolve Concurrent Changes

- **Actors:** A và B editors.
- **Tiền điều kiện:** Shared Moment hoặc Collaborative Capsule cùng active editing.
- **Luồng chính:** A sửa field; B sửa cùng field hoặc add item; A Seal từ stale revision; server conflict; A/B review changes, re-confirm version; save/seal after validation.
- **Hậu điều kiện và dữ liệu cần kiểm tra:** Không loss update, không báo thành công cho stale revision; capsule seal đúng final reviewed version.
- **Ngoại lệ / luồng thay thế:** Network retry không duplicate/overwrite; revoked editor blocked.
- **Màn hình liên quan:** SM-04, SM-14, SM-15. **Quy tắc:** BR-M08-67–72.
- **Kiểm thử bắt buộc:** Thực hiện bằng tài khoản A và B riêng, thử refresh + truy cập direct link, lặp thao tác không chủ đích và so quyền dữ liệu nguồn. Nếu có trạng thái pending/error, client và backend phải thống nhất; mọi false-success đều là blocker P0.

# 9. Năm mươi ngoại lệ — Exception Catalogue

| Mã | Điều kiện / nguy cơ | Kết quả bắt buộc |
| --- | --- | --- |
| EX-M08-01 | Tạo Moment thiếu tên | Không tạo Published, field validation cho title |
| EX-M08-02 | Moment xảy ra trong quá khứ | Chấp nhận, Timeline theo occurred date không theo created_at |
| EX-M08-03 | Nhiều Moment cùng ngày | Stable ordering, không mất record |
| EX-M08-04 | Hai người cùng sửa Moment | Version guard, có conflict resolution |
| EX-M08-05 | Thu hồi quyền trong lúc đang sửa | Server chặn lưu mới trái quyền |
| EX-M08-06 | Private Moment vào Shared Collection | Không tự công khai |
| EX-M08-07 | Xóa Collection | Moment giữ nguyên ID/nội dung |
| EX-M08-08 | Ảnh Moment bị xóa tại M02 | Fallback/unavailable không tự delete Moment |
| EX-M08-09 | Ngày Anniversary M05 đổi | Dùng source updated, không duplicate |
| EX-M08-10 | Diary linked bị xóa | Moment vẫn tồn tại, link unavailable |
| EX-M08-11 | Draft Letter chưa có recipient | Cho lưu Draft, không cho Deliver |
| EX-M08-12 | Gửi Letter không body | Validate, không gửi |
| EX-M08-13 | Scheduled Letter có giờ không hợp lệ | Yêu cầu nhập đúng local time/timezone |
| EX-M08-14 | Author mất kết nối khi Send | Không false Delivered, retry idempotent |
| EX-M08-15 | Send duplicated | Một frozen delivered revision |
| EX-M08-16 | Recipient chưa mở thư | Giữ Unread, không tự Opened |
| EX-M08-17 | Author sửa Delivered Letter | Từ chối mutation bản trao; tạo correction riêng |
| EX-M08-18 | Cancel đúng lúc Delivery | Một final state authoritative, no inappropriate delivery |
| EX-M08-19 | Recipient ẩn Letter | Không xóa bản sender archive |
| EX-M08-20 | Surprise Secret link Calendar | Không tự tạo shared Event/metadata |
| EX-M08-21 | Surprise Secret link Expense | Không leak M07 payment/gift |
| EX-M08-22 | Recipient search Surprise trước reveal | Không content/title/count |
| EX-M08-23 | Teaser trước reveal | Chỉ projection đã được creator cho phép |
| EX-M08-24 | Surprise Cancel trước ngày reveal | Scheduled reveal invalidated |
| EX-M08-25 | Surprise Revealed nhưng chưa xem | Opened khác Revealed |
| EX-M08-26 | Capsule Draft thiếu recipient | Seal bị chặn |
| EX-M08-27 | Capsule Draft không content | Seal bị chặn |
| EX-M08-28 | Thiếu unlock date/time/timezone | Seal bị chặn |
| EX-M08-29 | Unlock thời điểm đã qua trước Seal | Chặn future-capsule Seal không hợp lệ |
| EX-M08-30 | DST nonexistent local time | Validate invalid local time |
| EX-M08-31 | DST ambiguous time | Phân giải đúng instance |
| EX-M08-32 | User chỉnh clock client sang tương lai | Không bypass server time |
| EX-M08-33 | Recipient đoán URL Capsule Secret | Không tiết lộ sự tồn tại/metadata |
| EX-M08-34 | Creator đọc Capsule Sealed trước hạn | Backend deny normal content access |
| EX-M08-35 | Ảnh nguồn sửa sau Seal | Frozen snapshot không thay đổi |
| EX-M08-36 | User yêu cầu xóa bản gốc và snapshot | Quy trình full-deletion có quyền, không giữ ngoài ý muốn |
| EX-M08-37 | Seal fail halfway | Atomic outcome, không false sealed |
| EX-M08-38 | B thêm item đúng lúc A Seal | Stale revision conflict, review |
| EX-M08-39 | Collaborative thiếu B sign-off | Không Seal |
| EX-M08-40 | Recipient offline khi unlock | Eligible khi quay lại, không tự expire |
| EX-M08-41 | Notification thất bại tại unlock | Content eligibility không mất |
| EX-M08-42 | Unlock scheduled task chạy lại | Không duplicate hoặc mở sai |
| EX-M08-43 | A Opened, B chưa | Per-recipient state |
| EX-M08-44 | Capsule Cancelled nhưng queued task tồn tại | Queued task không trao/mở |
| EX-M08-45 | Restore Sealed Capsule | Giữ original schedule/ACL/state |
| EX-M08-46 | Export trước unlock | Không có readable sealed contents |
| EX-M08-47 | Restore từ backup | Không tự mark Opened hoặc đổi unlock date |
| EX-M08-48 | Revocation với tab cũ | Check quyền on request |
| EX-M08-49 | Xóa linked source M01–M07 | Không cascade unrelated objects |
| EX-M08-50 | Mất mạng lúc save/open | Không false success, safe retry |

## 9.1. Quy trình chung xử lý ngoại lệ

1. **Validation:** phân biệt thiếu dữ liệu, ngày DST invalid, quyền không đủ, tài nguyên nguồn không còn, state/race và network lỗi. Form giữ dữ liệu nhập khi lỗi hợp lý.
2. **Security:** không phản hồi message chứa tên/ảnh/số lượng của Secret hoặc tài liệu Private; mọi đường phục vụ data cần gate ACL/state/unlock time.
3. **Consistency:** nếu save/seal/delivery/cancel/restore có nhiều bước, chỉ báo success khi mọi dữ liệu chính thức đã nhất quán; dùng stable intent/action identity để retry không tạo bản trùng.
4. **Recovery:** reload từ trạng thái authoritative và cung cấp retry hoặc conflict resolution phù hợp, không overwrite người còn lại khi stale.
5. **Observability:** lưu audit/diagnostics đủ để xem vì sao thao tác thất bại mà không đưa raw Sealed text/private data vào log có thể đọc ngoài quyền.

## 9.2. Tổ hợp lỗi phải kiểm thử

- Failure snapshot media + concurrent Seal: không được tạo Sealed với attachment thiếu.
- Cancellation of scheduled letter + sending worker retry: không giao thư khi Cancel đã có hiệu lực.
- Capsule restore + unlock timestamp already passed + revoked recipient: vẫn deny nếu quyền không hợp lệ, không tự mark Opened.
- Deletion request + immutable snapshot + backup replication: không khẳng định full deletion cho tới khi đáp ứng global deletion policy; phải cảnh báo OPEN-ISSUE nếu chưa quyết định M10.
- Secret Surprise teaser + search facet count + mobile push preview: không rò rỉ qua bất kỳ đường dữ liệu nào.
- Readable export initiated before unlock but completed after unlock: quyền và snapshot export cần policy evaluation được đặc tả kỹ (mặc định recheck tại thời điểm tạo dữ liệu) và không vô tình tiết lộ trước authorization.

# 10. Tám mươi lăm Acceptance Criteria — có thể kiểm chứng

**Cách kiểm thử chuẩn:** QA chuẩn bị hai tài khoản A/B khác nhau, quyền Private/Shared, resource M01/M02/M05, đồng hồ hệ thống kiểm thử có thể kiểm soát, network/worker failure, trạng thái Draft/Sealed/Delivered tương ứng. Mỗi AC phải có cả kiểm tra backend/data authorization và giao diện; một phần UI ẩn đúng không đủ nếu API/export/media URL còn truy cập được.

## 10.1. Moment & Milestone

| Mã | Given / When — điều kiện | Then — kết quả bắt buộc |
| --- | --- | --- |
| AC-M08-01 | Tạo Moment hợp lệ | Lưu được ID ổn định, ngày xảy ra và ACL |
| AC-M08-02 | Tạo Moment thiếu tên | Không lưu Published; chỉ rõ field invalid |
| AC-M08-03 | Moment ngày quá khứ | Timeline sắp theo occurred_on |
| AC-M08-04 | Moment mới không share | Private mặc định |
| AC-M08-05 | Share Moment với B | B xem phần được phép, audit quyền |
| AC-M08-06 | B không được share | Không xem được Moment, link, preview |
| AC-M08-07 | Hai Personal Perspectives | Tác giả riêng, không ghi đè |
| AC-M08-08 | Tạo Collection | Gắn được nhiều Moment |
| AC-M08-09 | Một Moment thuộc nhiều Collection | Không tạo bản sao Moment |
| AC-M08-10 | Xóa Collection | Moment nguồn tồn tại |
| AC-M08-11 | Liên kết M02 | Tái sử dụng media permitted và kiểm quyền |
| AC-M08-12 | Liên kết Diary M01 | Không tạo Diary trùng |
| AC-M08-13 | Liên kết Trip M04 | Tham chiếu đúng Trip và quyền |
| AC-M08-14 | Milestone gắn M05 | Dùng ngày Anniversary nguồn |
| AC-M08-15 | Timeline nhiều Moment | Sort/filter/pagination ổn định và theo ACL |

## 10.2. Love Letters

| Mã | Given / When — điều kiện | Then — kết quả bắt buộc |
| --- | --- | --- |
| AC-M08-16 | Tạo Draft Letter | Private author-only |
| AC-M08-17 | Draft chưa chọn recipient | Lưu draft hợp lệ, chưa deliver |
| AC-M08-18 | Send Letter body trống | Báo lỗi; không tạo Delivered |
| AC-M08-19 | Send Now | Đúng người nhận, frozen delivered revision |
| AC-M08-20 | Retry Send | Không tạo Delivered trùng |
| AC-M08-21 | Scheduled Letter | Lưu đúng date/time/timezone và future timestamp |
| AC-M08-22 | B truy cập trước giờ gửi | Không thấy Letter body/metadata ngoài quyền |
| AC-M08-23 | A offline khi đến giờ gửi | Được xử lý không cần author online |
| AC-M08-24 | Cancel Scheduled | Không giao từ action cũ khi cancel hợp lệ |
| AC-M08-25 | Author sửa Delivered | Không đổi nội dung đã trao |
| AC-M08-26 | B chưa đọc | Không auto Opened |
| AC-M08-27 | B mở Letter | Recipient state riêng thành Opened |
| AC-M08-28 | B Archive | Không xóa sender retained letter |
| AC-M08-29 | Letter link Anniversary | Không tạo Anniversary mới |
| AC-M08-30 | Thông báo thư Scheduled | Không leak trước khi Delivered |

## 10.3. Surprises & Secrecy

| Mã | Given / When — điều kiện | Then — kết quả bắt buộc |
| --- | --- | --- |
| AC-M08-31 | Tạo Surprise | Private+Secret mặc định |
| AC-M08-32 | B vào Home trước reveal | Không có Secret Surprise |
| AC-M08-33 | B Search | Không tìm được Secret |
| AC-M08-34 | B truy cập direct URL | Không leak metadata/exists |
| AC-M08-35 | B xem Activity Feed | Không leak preparing actions |
| AC-M08-36 | B xem counters | Không suy ra Secret counts |
| AC-M08-37 | Teaser chosen | Chỉ hiện sanctioned teaser fields |
| AC-M08-38 | Linked M06 Private Task | Không expose Task |
| AC-M08-39 | Linked M07 Private Expense | Không expose Expense |
| AC-M08-40 | Linked M02 Private asset | Không expose asset |
| AC-M08-41 | Surprise reveal time reached | Đúng recipient quyền Revealed |
| AC-M08-42 | Surprise Revealed chưa xem | Không auto marked Opened |
| AC-M08-43 | Cancel Surprise | Không reveal sau cancel từ action cũ |
| AC-M08-44 | Xóa Surprise | Không cascade delete Expense/Letter/Capsule |
| AC-M08-45 | Thay đổi quyền Surprise | Notification cũ/future không leak |

## 10.4. Time Capsules

| Mã | Given / When — điều kiện | Then — kết quả bắt buộc |
| --- | --- | --- |
| AC-M08-46 | Tạo Capsule Draft | Lưu được nội dung chưa hoàn thiện |
| AC-M08-47 | Capsule không item | Không Seal |
| AC-M08-48 | Capsule không recipient | Không Seal |
| AC-M08-49 | Thiếu date/time/timezone | Không Seal |
| AC-M08-50 | Seal hợp lệ | Snapshot, manifest, status, actions nhất quán |
| AC-M08-51 | Seal thất bại | Không báo Sealed success, retry an toàn |
| AC-M08-52 | Creator xem Sealed trước giờ | Bị deny content qua app |
| AC-M08-53 | Recipient xem Sealed trước giờ | Bị deny content qua app |
| AC-M08-54 | Recipient đổi device clock | Không mở trước system trusted time |
| AC-M08-55 | Secret capsule direct URL | Không leak even metadata/count |
| AC-M08-56 | Media nguồn sửa sau Seal | Sealed content không thay đổi |
| AC-M08-57 | Concurrent draft edits | Không mất nội dung hợp lệ |
| AC-M08-58 | Collab Seal thiếu B approval | Không Seal |
| AC-M08-59 | Draft đổi giữa verify/Seal | Conflict/version mismatch |
| AC-M08-60 | Đến unlock time | Eligible đúng recipient, chưa auto opened |
| AC-M08-61 | Offline at unlock | Recipient mở được sau này |
| AC-M08-62 | A Opened, B not opened | Trạng thái mỗi người riêng |
| AC-M08-63 | Retry unlock action | Không tạo duplicate/change state sai |
| AC-M08-64 | Cancel Capsule | Không unlock từ action cũ |
| AC-M08-65 | After capsule opened | Không tự xóa nội dung |

## 10.5. Cross-module & Notifications

| Mã | Given / When — điều kiện | Then — kết quả bắt buộc |
| --- | --- | --- |
| AC-M08-66 | M05 Anniversary date changes | M08 liên kết hiển thị ngày updated |
| AC-M08-67 | M05 date changes after Seal | Không đổi unlock_at đã khóa |
| AC-M08-68 | M04 Trip Completed | Không tự tạo Moment công khai |
| AC-M08-69 | M06 Goal Completed | Không tự tạo Moment public |
| AC-M08-70 | M02 media revoked | Không leak asset ngoài quyền |
| AC-M08-71 | M01 Diary Private linked | Không tự share Diary |
| AC-M08-72 | M09 reaction before capsule reveal | Không vượt state/ACL |
| AC-M08-73 | Notification failed at unlock | Eligible access vẫn đúng |
| AC-M08-74 | Secret Surprise notification | Không leak title/preview/cover |
| AC-M08-75 | Cross-module source multi-link | Không duplicate Moment/Letter records |

## 10.6. Security, History, Recovery & Device

| Mã | Given / When — điều kiện | Then — kết quả bắt buộc |
| --- | --- | --- |
| AC-M08-76 | Editor revoked while open | Server deny new saves |
| AC-M08-77 | Concurrent edit Moment | Không silently overwrite |
| AC-M08-78 | Audit read | Không lộ Sealed content |
| AC-M08-79 | Soft-delete Moment | Vào Trash ≥30 ngày |
| AC-M08-80 | Restore within 30 days | Dữ liệu hợp lệ không cascade sai |
| AC-M08-81 | Restore Sealed Capsule | Giữ unlock_at, manifest, snapshot, status |
| AC-M08-82 | Export before unlock | Không chứa sealed readable contents |
| AC-M08-83 | Backup/Restore | Giữ lock, ACL, recipient opening state |
| AC-M08-84 | P0 on mobile & desktop | Cả hai hoàn thành luồng chính |
| AC-M08-85 | Network loss save/open | Không false Saved/Sealed/Delivered/Opened |

# 11. Kịch bản kiểm thử mẫu, dữ liệu vàng và security regression

Các dữ liệu dưới đây là **fixtures giả lập**, không phải dữ liệu thật của người dùng. Trong bảng mọi thời điểm mở phải được xác định local time, timezone và derived authoritative instant tại môi trường test.

| QA-ID | Input và tác động | Kiểm tra kết quả / dữ liệu vàng |
|---|---|---|
| QA-M08-01 | A tạo Moment ngày quá khứ, nhập sau 2 năm | Timeline sort theo `occurred_on`, created_at không thay đổi |
| QA-M08-02 | Shared Moment, A/B cùng viết perspective | 2 perspective authors, no overwrite, quyền đúng |
| QA-M08-03 | Moment Private thuộc Shared Collection | B không nhận result/preview/count của Moment Private |
| QA-M08-04 | Letter A→B, send now bị double click và worker retry | 1 delivered frozen revision; B unread cho đến khi mở |
| QA-M08-05 | Letter hẹn gửi, B mở direct URL trước giờ | No content/metadata leakage; after actual delivery nhận đúng |
| QA-M08-06 | Cancel Letter cùng thời điểm delivery | 1 final authoritative state; nếu cancel valid thì không deliver |
| QA-M08-07 | A chuẩn bị Secret Surprise, link M06 Private Task/M07 Private Expense | B không thấy tên, ảnh, giá tiền, counter hoặc search facet |
| QA-M08-08 | A bật Teaser chọn 1 message vô hại | B chỉ thấy chính xác sanitized teaser fields, không thấy internal notes |
| QA-M08-09 | Capsule Draft không recipient/item/zone | Seal bị chặn, người tạo sửa được Draft |
| QA-M08-10 | Capsule có ảnh P1, ảnh được chỉnh sửa tại M02 sau Seal | Snapshot item P1 trong Capsule không thay đổi |
| QA-M08-11 | Capsule unlock ngày tương lai; B chỉnh đồng hồ thiết bị | API/asset từ chối, countdown UI không là nguồn quyền |
| QA-M08-12 | Collaborative Capsule v5 A confirm, B thêm ảnh => v6 | Seal v5 bị từ chối; cả hai phải confirm v6 |
| QA-M08-13 | Capsule A+B, đến giờ A Opened, B offline | A Opened/B AvailableToOpen; B mở sau đúng nội dung |
| QA-M08-14 | Capsule Cancelled trước hạn nhưng còn queued job | Queue retry không unlock/notify nội dung sai |
| QA-M08-15 | Restore capsule sealed từ backup | Chính xác manifest/hash-or-version identity, recipients, unlock timestamp; không auto opened |
| QA-M08-16 | Export của B khi Capsule Secret chưa đến hạn | Export không chứa blob, text, filenames, preview, metadata cho phép suy ra Secret |
| QA-M08-17 | Revoke B khi B giữ tab editor cũ | New write rejected; không báo saved false |
| QA-M08-18 | M05 Anniversary được dời sau Capsule sealed | Milestone hiển thị ngày M05 mới; capsule unlock lịch cũ đã khóa |
| QA-M08-19 | M02 source media bị xóa/xin xóa mọi phiên bản | Đánh giá chính sách full deletion cho snapshot; không lặng lẽ giữ dữ liệu trái quyền |
| QA-M08-20 | Send/Seal/Unlock/Restore bị mất mạng giữa các bước | Không partial state kỳ lạ, error visible, retry idempotent |

## 11.1. Phép thử bảo mật phủ nhiều đường

1. Dùng cùng object ID nhưng đổi tài khoản; thử query list, autocomplete, facet count, asset thumbnail, full-size media, raw export, linked preview, notification JSON, audit log và direct URL.
2. Với Secret Surprise/Capsule chưa mở, ngay cả message lỗi phải tránh từ ngữ mang tên, subject, ảnh bìa hoặc trạng thái bí mật có thể phân biệt từ nội dung không có quyền. Chính sách phản hồi kỹ thuật chi tiết sẽ chọn sau.
3. Đối với Countdown, fixture author bật mode và chọn allowed fields; xác nhận chỉ các fields đó được trả về trước unlock. Sau revocation, không còn new access.
4. Test backup restore trên bản có Letter Delivered, Letter Scheduled, Capsule Sealed, Capsule Eligible, Capsule Opened A-only; tất cả state tách riêng sau khôi phục.
5. Test media deleted + historical snapshot: phải có deterministic retention/deletion policy được phê duyệt M10; không tự cho phép lưu trữ vĩnh viễn vì ảnh đã bị khóa.
6. Không lưu secret text/attachments vào analytics/crash logs có phạm vi rộng hơn Content Permission.

## 11.2. Tiêu chuẩn cho mock dữ liệu

- Dùng hai tài khoản A/B giả và ít nhất ba Moment (1 Private A, 1 Private B, 1 Shared).
- Hai Letter Scheduled có cùng thời điểm nhưng recipient khác nhau và một Letter Cancelled để xác định job isolation.
- Hai Capsule: one Secret B-only, one Countdown shared A+B; một được Seal trước DST transition ở múi giờ áp dụng DST.
- Một media nguồn với multiple variants, một asset removed, một revoked, một file upload incomplete.
- M05 Anniversary có date đã sửa; M06 private task, M07 private gift expense cùng liên kết Surprise để thử leak.
- Đồng hồ và worker deterministic trong test; không dùng ngày giờ thực hoặc chờ nhiều năm để thực hiện QA.

# 12. Hợp đồng tích hợp M01–M10

| Module | Source of truth | M08 được thực hiện | M08 không được thực hiện | Trường hợp cần test |
|---|---|---|---|---|
| M01 Photobook & Diary | Books/Pages/Diary | Link Diary/Photobook, tạo entry theo yêu cầu người dùng | Auto copy/mutate Diary hoặc mở Private content | Diary nguồn bị xóa/revoked vẫn không hỏng Moment |
| M02 Media Library | Ảnh/video gốc, metadata, Media ACL/variants | Dùng media refs; đóng băng selected content at Seal theo policy | Auto share album/photo; chỉnh Media gốc sau Seal | Source edit/delete, private image in shared Moment, full deletion |
| M03 Food & Places | Place, Visit, Date Plan | Link một Moment với Place/Visit | Tự tạo Visit, review hoặc Expense | Xóa Place/Visit không cascade Moment |
| M04 Travel & Trip Planner | Trip, Activity, Recap, Booking | Link Trip/Activity hoặc tạo Moment có chủ đích sau trip | Auto create public Moment từ mọi completed Activity | Trip cancelled/archived, linked entity missing |
| M05 Couple Calendar | Anniversary date, recurrence, events, reminders | Link Anniversary, hiển thị relevant date; event reminder integration theo ACL | Sửa Date source ở M08 hoặc đổi Sealed unlock khi anniversary đổi | DST, shift Anniversary, hidden Surprise in calendar |
| M06 Bucket List & Goals | Wish/Goal/Task/Achievement | Link achievement Moment; Surprise Private planning task | Auto create public Moment từ Goal Completed; expose private task | B không thấy private surprise tasks |
| M07 Budget & Savings | Expense/Savings/Settlement | Link budget/expense only when permitted, giữ private gift costs | Auto share private gift expense hoặc ghi Expense duplicate | B không infer purchase/amount từ surprise |
| M08 Special Moments | Moment, Letter, Surprise, Capsule, Reveal/Opening | Là nguồn dữ liệu cho content lifecycle/delivery/unlock | Tự copy nguyên nội dung sang module khác trái ACL | Retry idempotent, version conflicts, no leak |
| M09 Couple Interaction | Comment/Reaction theo ACL (đang chờ BRD) | Giao điểm comment/reaction khi reveal permits | Comment vào content sealed chưa eligible | Reaction cannot leak Secret; role inheritance |
| M10 Personalization & Settings | Accounts, settings, system notifications, security (đang chờ BRD) | Dùng shared auth/security/notification/backup/delete policy | Tự quyết định crypto, retention, unlink account rights | Disable/delete account, full deletion snapshot |

## 12.1. Quy tắc hợp đồng

- Mỗi link có `source_module`, `source_id`, `purpose`, quyền kiểm tra tại thời điểm đọc; không lấy display text của linked Private object để phục vụ search chung.
- Mọi thao tác tạo từ linked module cần ổn định `source-entity + intended relationship` hoặc một idempotency identity để tránh content/link duplicate.
- Mất link không đồng nghĩa xóa nội dung M08; invalid link trạng thái unavailable, nội dung M08 độc lập có thể giữ.
- Khi permission của source bị revoke, các URL thumbnail/preview/download và màn hình M08 đều phải kiểm tra lại; không tự dùng cache như quyền mới.
- Sealed Snapshot được phép tồn tại ổn định trong phạm vi quyền và chính sách xóa đã duyệt, nhưng không được hiểu là vĩnh viễn hoặc miễn quyền full-delete.
- `M05 Anniversary change` có thể update Milestone display và future nonsealed references; **không modify immutable capsule timestamp**.
- Không đưa Secret surprise preparation vào shared notifications, shared activity feed hoặc calendar bằng cách tự động liên kết.

## 12.2. Cross-module OPEN dependencies

- M09: role của người phản ứng với Letter nhận được; phản ứng trên shared Moment; policy comment khi capsule vừa eligible chưa opened.
- M10: legal/data deletion, account termination, unlinking two accounts, access to delivered recipient copies, master notification consent, storage snapshots và backup retention.
- M01/M02: kỹ thuật tham chiếu media/version/Diary snapshot đủ để sealed capsule không đổi và vẫn tuân thủ full deletion.
- Hệ thống chung: local vs authoritative time, durable scheduler/idempotency, audit privacy và receipt status; định lượng vận hành ở design phase.

# 13. Phân quyền, bảo vệ dữ liệu và tác vụ hẹn

## 13.1. Permission matrix nghiệp vụ

| Năng lực | Creator/Owner | Collaborator Draft được cấp | Recipient trước hạn | Recipient sau entitlement |
|---|---|---|---|---|
| Đọc/sửa Moment | Theo ACL owner | Theo quyền được cấp | Không mặc định | Theo ACL đã cấp |
| Đọc Letter Draft | Author | Không mặc định | Không | Không áp dụng |
| Đọc Letter Delivered | Author xem bản đã trao | Không mặc định | Chưa có | Recipient có |
| Sửa Letter Delivered | Không âm thầm | Không | Không | Không |
| Chỉnh Capsule Draft | Có | Nếu được mời | Không mặc định | Không áp dụng |
| Seal Collaborative Capsule | Cần đầy đủ xác nhận version | Đồng xác nhận version | Không | Không |
| Đọc nội dung Capsule Sealed trước unlock | **Không qua app thường** | **Không** | **Không** | Chưa eligible nên không |
| Xem Countdown trước unlock | Creator metadata | Theo quyền Draft | Chỉ mode Countdown được bật | Không áp dụng |
| Mở Capsule sau unlock | Chỉ nếu là recipient hợp lệ | Chỉ nếu là recipient | Không | Có theo quyền/trạng thái |
| Hủy Capsule Sealed | Theo policy và co-owner consents | Không mặc định | Không | Theo policy |
| Export sealed content trước unlock | Không ở dạng đọc được | Không | Không | Chưa unlock thì không |

## 13.2. Lớp bảo vệ và threat model nghiệp vụ

- **Existence leak:** danh sách trả số lượng hidden item, counter hoặc log “B có 3 surprise” vẫn là tiết lộ; phải lọc trước count.
- **Metadata leak:** cover, thumbnail, tag, title, tên file, scheduled date và URL gợi ý có thể làm lộ bí mật; chỉ cho phép projection công khai có chủ đích ở mode Countdown/Teaser.
- **Content leak:** raw media/CDN/storage endpoint và export không được bypass quyền chỉ vì card đã ẩn; kiểm tra quyền phải ở dịch vụ cung cấp bytes.
- **Notification leak:** push/email/in-app preview trong môi trường chung; nội dung mô tả chỉ ở mức cho phép. P0 in-app; push/email P1 và phải review riêng.
- **Link leak:** Shared Moment không tự chuyển Private Diary, Trip, Expenses hoặc Media thành Shared.
- **History leak:** audit log hoặc field old/new values phải redacted theo state; sealed manifest không tiết lộ nội dung.
- **Time bypass:** client clock/route manipulation không nâng quyền; server-side trusted time gate.
- **Race/retry leak:** canceled job không deliver; stale version không seal; restore không tự mở.
- **Irreversibility limit:** khi một người đã tải/xem/copy dữ liệu hợp lệ, hệ thống không thể bảo đảm họ không còn bản sao. Không tuyên bố “thu hồi hoàn toàn” qua nút revoke.

## 13.3. Snapshot vs right to delete

Hai mục tiêu cùng được phê duyệt: (a) nội dung Capsule không bị sửa ngầm sau Seal; (b) khi người dùng có quyền yêu cầu xóa tất cả bản sao của mình, hệ thống có quy trình hợp lệ, minh bạch. Vì vậy `immutable snapshot` nghĩa là **không chỉnh sửa ngầm trong vòng đời hợp lệ**, không phải **không thể xóa**. Các quy trình full deletion/backup retention cần quyết định xuyên M02/M10, không được viết hardcode để bảo toàn Capsule vĩnh viễn bất kể yêu cầu xóa.

## 13.4. Scheduled work

- Delivery/reveal/unlock phải có stable intended action identity và kiểm trạng thái mới nhất khi chạy; queue retry không bypass Cancel/Revocation.
- Thời điểm đủ điều kiện nên có thể kiểm tra lại khi user request, không nhất thiết phụ thuộc queue đã gửi notification; nếu scheduled worker delayed thì user đã đủ thời gian vẫn có quyền khi truy cập.
- Trạng thái `Delivered`, `Eligible`, `Opened` và `Notification Sent` lưu riêng; không tự suy ra cái này từ cái kia.
- Không tự tạo một ngân hàng thông tin đọc trước trong analytics, backup export hoặc preview; trạng thái server phải authoritative.

# 14. Phân loại P0/P1/P2 và chặn cắt phạm vi

## 14.1. P0 bắt buộc Our Space V1.0

- Moment creation/edit/view, Gallery, Timeline, Collections, Personal Perspectives; correct historical occurred date và ACL.
- Milestones liên kết M05 Anniversary, không duplicate date/recurrence.
- Letter Draft, Send Now, Scheduled, Delivered frozen revision, recipient Unread/Opened/Archived riêng; in-app notice tương ứng.
- Secret Surprises, Teaser explicit; không leak existence/content through cross modules, search, export, counts.
- Capsule Draft/Builder, contents text/image/video, recipient A/B/both, exact future date/time/timezone, Secret/Countdown mode; Sealing with immutable snapshot; reliable unlock; per-recipient opening; Cancel/Restore safeguards; Collaborative version-bound confirmations.
- Permissions, conflict handling, idempotent scheduled actions, source media asset checks, not false-success, audit/history, Trash ≥30 days, backup/export đúng quyền.
- Integration M01–M07 và acceptance gate M09/M10 còn chờ BRD; mobile/desktop parity.

## 14.2. P1

Thiệp và Letter templates, phong bì/Capsule animations nâng cao, các thiết kế album/kỷ niệm phong phú, xuất PDF trình bày đẹp, email/web push với opt-in/khả năng thiết bị, read receipts gửi tới author khi recipient đồng ý, synchronous opening UX, audio và tài liệu tùy ý trong Capsule, collection visual customizations. P1 không được dùng làm điều kiện để hoàn thành P0.

## 14.3. P2

AI hỗ trợ tổng hợp kỷ niệm, giúp soạn thư khi người dùng chủ động, tạo video recap, gợi ý Surprise theo sở thích, Capsule unlock điều kiện phi thời gian, kết nối nhà cung cấp gửi quà thật, trải nghiệm interactive mở rộng. Không đưa AI vào sản phẩm P0 nếu không được chốt lại.

## 14.4. Không được nhầm phạm vi

- P0 **Time Capsule thực sự kiểm soát quyền mở**; chỉ có một nút countdown UI mà raw data vẫn tải được là không đạt.
- P0 **Scheduled Letter thực sự trao khi người viết offline** trong khả năng hệ thống; không phải một reminder yêu cầu người viết bấm Send lần nữa.
- P0 **Secret không lộ existence**, không chỉ ẩn body.
- P0 **Letter Delivered immutable** ở mức revision trao, không phải chỉ disable edit button.
- P0 **Snapshot không thay đổi theo M02**, đồng thời phải tôn trọng open deletion policy.

# 15. Definition of Done, quality gates và kiểm tra vận hành

## 15.1. Checklist DoD

- [ ] Hai tài khoản độc lập; toàn bộ nội dung mới Private default.
- [ ] SM-01–SM-20 cung cấp đầy đủ nghiệp vụ P0 trên cả điện thoại và desktop.
- [ ] Moment có occurred date, collections n-n, hai Personal Perspectives đúng tác giả và ACL.
- [ ] Milestones dùng đúng dữ liệu Anniversary M05, không tái tạo ngày gốc.
- [ ] Letter Draft, Scheduled, Send Now, Delivered revision immutable, separate recipient read state.
- [ ] Sending/cancel/error/retry hoạt động idempotently khi author offline.
- [ ] Secret Surprise không lộ existence qua homepage, cross-module, count, notifications, search, export và URLs.
- [ ] Teaser chỉ hiển thị subset metadata explicit.
- [ ] Capsule Draft có content từ text/photo/video, recipient và future date/time/timezone.
- [ ] Seal yêu cầu preflight, assets/snapshot/version/signatures hợp lệ và commit nhất quán.
- [ ] Người tạo/recipient không đọc được content qua normal access trước unlock, kể cả direct media API và export.
- [ ] Có trusted clock, DST handling, recipient-specific eligibility/opened, offline-late opening.
- [ ] Collaborative Capsule không Seal từ revision stale/thiếu sign-off.
- [ ] Hủy Capsule làm invalid future actions; restore giữ original locked state.
- [ ] Media source edits không đổi snapshot; deletion request xử lý theo policy đã được chốt.
- [ ] Tích hợp M01–M07 không copy/auto expose nội dung, không cascade delete.
- [ ] M09/M10 dependencies không bị giả định là đã duyệt.
- [ ] Audit redacted, Export theo quyền, backup restore đúng state, Trash ≥30 ngày.
- [ ] Pass 82 Business Rules, 22 UC, 50 EX, 85 AC và các golden QA scenarios; kết quả QA có evidence.
- [ ] Không có false success cho save, deliver, seal, unlock, cancel, restore.
- [ ] Toàn bộ P0 của M01–M10 hoàn thành trước Our Space V1.0 chính thức.

## 15.2. Non-functional requirements cần định lượng sau

| NFR | Ý định nghiệp vụ | Tình trạng |
|---|---|---|
| Delay giao Letter hẹn giờ | Giao đúng sau/ở lịch đã duyệt với chính sách retry | Chưa chốt SLA số giây/phút |
| Trễ Unlock Eligibility | Khi thời điểm hợp lệ đã tới, request phải có thể kiểm tra điều kiện thật | Chưa chọn scheduler/clock source |
| Data durability | Không mất frozen letter/capsule snapshots sau lỗi | Chưa chốt backup RPO/RTO/retention |
| Permission propagation | Revoke ngăn truy cập mới, không cache bypass | Chưa chốt topology/caching |
| File size/quota | Video và photo đủ dùng, không khiến builder treo | Chưa chốt giới hạn MB/capsule |
| Accessibility | Các luồng tạo/đọc/Seal đều dùng được mobile/desktop và tương tác keyboard/screen reader phù hợp | Chưa đo bộ tiêu chí chuẩn kỹ thuật |
| Observability | Có audit và monitoring mà không leak content | Chưa chọn log/retention policy |
| Concurrency | Không lost update/conflicting seal | Chưa chọn version storage/transaction design |
| Cryptographic trust | Không đưa ra cam kết E2EE, zero-knowledge khi chưa thiết kế/kiểm thử | Open với M10 Security |

## 15.3. Acceptance gates bảo mật

- Chỉ ẩn nút UI nhưng API/asset cho phép đọc trước Unlock: **BLOCKER**.
- B thấy số lượng Secret Surprise hoặc title dù không đọc body: **BLOCKER**.
- Author sửa Letter Delivered không tạo lịch sử/notice: **BLOCKER**.
- Seal thành công khi thiếu snapshot hoặc chưa đủ approvals: **BLOCKER**.
- Notification worker cancel/retry trao nội dung sai: **BLOCKER**.
- Restore mở khóa sớm hoặc mất state recipient: **BLOCKER**.
- Cross-module đọc dữ liệu Private do linked shared item: **BLOCKER**.
- Chưa giải quyết thiết kế full data deletion được chủ dự án yêu cầu: **BLOCKER** trước khả năng vận hành xóa tương ứng.

# 16. Ma trận truy vết 30 quyết định → thiết kế → kiểm thử

| Decision | Nội dung quyết định đã duyệt | Màn hình/nhóm liên quan | AC tham chiếu |
| --- | --- | --- | --- |
| D01 | Cấu trúc M08 | SM-01–20 | AC-01–85 |
| D02 | Mặc định quyền | SM-04,20 | AC-04–06,31,70 |
| D03 | Moment độc lập | SM-04,05 | AC-01–04 |
| D04 | Personal Perspectives | SM-05 | AC-07,77 |
| D05 | Collections | SM-03,19 | AC-08–10 |
| D06 | Anniversary | SM-06,07 | AC-14,66–67 |
| D07 | Love Letter | SM-08–10 | AC-16–24 |
| D08 | Delivered immutable | SM-10 | AC-25 |
| D09 | Read receipts | SM-08,10 | AC-26–28 |
| D10 | Surprise modes | SM-11,12 | AC-31–37 |
| D11 | Chuẩn bị Surprise | SM-12 | AC-38–40,74 |
| D12 | Capsule content | SM-14,15 | AC-46–50 |
| D13 | Unlock time | SM-15 | AC-49,60 |
| D14 | Recipients | SM-14,17 | AC-48,62 |
| D15 | Reveal mode | SM-13,16 | AC-31,55 |
| D16 | Seal immutable | SM-15,16 | AC-50–59 |
| D17 | Creator read sealed? | SM-16,17 | AC-52–54 |
| D18 | Sealed snapshot | SM-15,17 | AC-50,56,81–83 |
| D19 | Cancel sealed capsule | SM-20 | AC-64,81 |
| D20 | Open early | SM-16 | AC-52–55 |
| D21 | Collaborative seal | SM-14,15 | AC-57–59 |
| D22 | Trusted time | SM-16,17 | AC-54,60–61 |
| D23 | Unlock vs Opened | SM-17 | AC-60–65 |
| D24 | Notifications | SM-18 | AC-23,73–74 |
| D25 | Asset permissions | SM-04,14,20 | AC-11,40,70–71 |
| D26 | Prevent leaks | SM-01,11,19,20 | AC-31–45,82 |
| D27 | Archive & delete | SM-20 | AC-79–83 |
| D28 | Export & Backup | SM-20 | AC-81–83 |
| D29 | Collaboration | SM-04,14,15 | AC-57–59,76–77 |
| D30 | Device parity | SM-01–20 | AC-84–85 |

**Quy tắc ma trận:** liên kết ngắn này là hướng dẫn truy vết, không giới hạn phạm vi kiểm thử. Mọi D có thể được kiểm thêm trong BR/UC/EX/QA. Các cụm số `AC-xx–yy` trong bảng tương ứng với `AC-M08-xx`–`AC-M08-yy`.

# 17. Dependencies, Open Issues và các quyết định không được Codex tự đặt

| ID | Vấn đề chờ quyết định/thiết kế | Rủi ro nếu tự đoán | Chủ trì tương lai |
|---|---|---|---|
| OPEN-M08-01 | Quy trình full deletion sealed snapshots và ảnh nguồn | Giữ dữ liệu trái ý muốn hoặc xóa làm hỏng Capsule | M02 + M10 + Product Owner |
| OPEN-M08-02 | Tài khoản đóng, ngừng sử dụng hoặc unlink A/B | Không ai được mở Capsule hoặc sai quyền người nhận | M10 + Product Owner |
| OPEN-M08-03 | Retention backup của deleted/archived/delivered objects | Phục hồi sai dữ liệu đã có yêu cầu xóa | M10 + Backup policy |
| OPEN-M08-04 | Khóa và mã hóa, mức độ bảo đảm “người tạo không đọc được” | Ngộ nhận app access control là E2EE | Security design M10 |
| OPEN-M08-05 | Idempotency/scheduled task reliability và thời gian trễ SLA | Thư trễ, unlock action bị lặp, sai trạng thái | Architecture phase |
| OPEN-M08-06 | Video/ảnh snapshot storage, refs/versions, quota | Không freeze media hoặc tốn lưu trữ vượt kỳ vọng | M02 + Platform design |
| OPEN-M08-07 | Xử lý hủy Capsule đồng sở hữu đã Seal nhưng một người offline/không đồng ý | Xóa đơn phương nội dung có quyền lợi của cả hai | M10 + Owner review |
| OPEN-M08-08 | Recipient đã xem/tải nội dung rồi quyền bị thu hồi | Không thể thu hồi physical copies | M10 UX/security policy |
| OPEN-M08-09 | M09 reactions / comments trên Delivered Letter, Capsule Eligible/Opened | Lộ metadata bình luận trước unlock | M09 BRD |
| OPEN-M08-10 | Hạ tầng thông báo kèm quiet hours/email/push | Thông báo leak bí mật hoặc không tới | M10 + M05 |
| OPEN-M08-11 | Kho document khác ảnh/video hoặc audio cho Capsules P1 | Lạm dụng M02 vượt phạm vi media đã chốt | Future scope |
| OPEN-M08-12 | Timed export job / snapshot access check khi kết thúc sau thời điểm unlock | Export trước quyền hoặc metadata leak | Security/Export design |
| OPEN-M08-13 | UX/QA target accessibility và mobile video handling | P0 parity không thực chất | UX/NFR phase |
| OPEN-M08-14 | Quy tắc deadline precision với timezone và DST edge cases | Mở sai giờ quốc tế | Shared time service |

**Không hỏi lại những quyết định đã phê duyệt D01–D30.** Những mục OPEN là chi tiết chưa có câu trả lời chính thức: đưa ra giải pháp đề xuất khi đến giai đoạn tương ứng và chờ Product Owner chốt, không làm giảm P0 đã chốt. Không sử dụng “technically difficult” để tự đưa Capsule lock, privacy, recipient sign-off xuống P1.

# 18. Hướng dẫn sử dụng bởi Codex và điều kiện bàn giao

1. Đọc frontmatter, toàn bộ các mục 1–18 và các BRD M01–M07 tham chiếu trước khi đề xuất technical plan; không chỉ đọc phần D01–D30.
2. Giữ nguyên các tên định danh `SM`, `ENT`, `BR`, `UC`, `EX`, `AC` để yêu cầu–thiết kế–kiểm thử truy vết qua nhiều cuộc trò chuyện.
3. Không triển khai hoặc viết code nếu Product Owner vẫn đang ở giai đoạn thống nhất đặc tả cho cả 10 module; chờ chỉ định rõ bước sang triển khai.
4. Không tự đổi mô hình ACL hoặc thời gian mở; không khẳng định end-to-end encryption, tamperproof, guarantee delivery, permanent deletion khi chưa được duyệt và kiểm thử.
5. Thiết kế/kiểm thử tất cả P0 cho mobile/desktop; bảo đảm concurrency và background scheduled processing **không phụ thuộc client online**.
6. Nếu phát hiện mâu thuẫn giữa BRD các module, ghi thành `CROSS-MODULE DECISION REQUIRED` với tác động, không tạo duplicate owner data.
7. Phân biệt immutable delivered copy và immutable sealed snapshot với **retention/deletion policy**; không ghi đè hiện vật, không giữ forever ngoài policy.
8. Trước khi báo hoàn tất, có evidence cho mỗi nhóm 85 AC, 50 EX và 22 UC; có security regression test và golden data setup; chưa có QA thì không tự gọi “đã nghiệm thu”.

**Trạng thái sau BRD M08:** M01–M08 đã được Product Owner chốt nghiệp vụ và có tài liệu BRD V1.0. **Chưa viết code.** Phân hệ thảo luận tiếp theo là **M09 — Couple Interaction** (comments/reactions kế thừa quyền nội dung, không phải full chat V1.0), sau đó **M10 — Personalization & Settings**. Chỉ phát hành Our Space V1.0 khi **P0 của cả 10 phân hệ** đạt yêu cầu.

