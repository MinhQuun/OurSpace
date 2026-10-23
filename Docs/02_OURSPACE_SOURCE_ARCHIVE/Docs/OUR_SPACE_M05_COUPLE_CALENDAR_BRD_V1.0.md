---
document_id: OURSPACE-M05-BRD
project: Our Space
module_id: M05
module_name: Couple Calendar
version: 1.0
status: APPROVED_BUSINESS_REQUIREMENTS__IMPLEMENTATION_NOT_STARTED
language: vi-VN
approved_on: 2026-10-22
file_name: OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md
intended_audience: [Product Owner, UX Designer, Codex, Developer, QA]
related_documents:
  - OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md
  - OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md
  - OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md
  - OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md
next_module: M06 — Bucket List & Goals
---

# OUR SPACE — M05: COUPLE CALENDAR
## Business Requirements & Functional Specification — V1.0

> **TRẠNG THÁI: ĐÃ DUYỆT NGHIỆP VỤ.** Chủ dự án đã xác nhận **toàn bộ D01–D22** ngày 22/10/2026. Tài liệu là nguồn yêu cầu nghiệp vụ chính thức của M05 để lưu tại `OurSpace/Docs/` cho Codex lập kế hoạch thiết kế/triển khai/kiểm thử sau này. **Đây không phải code, API contract, database schema hoặc quyết định về stack.**
>
> **BỐI CẢNH:** Our Space là website riêng tư lâu dài cho hai người/tài khoản riêng. Giao diện chung hiện đại; M01 Photobook mang phong cách scrapbook, có Simple/Advanced Editor và cộng tác thời gian thực. Desktop và mobile hoàn thành được cùng nghiệp vụ trọng tâm. **M01–M04 đã chốt** và có BRD chính thức; M05 là phân hệ thứ năm. V1.0 chỉ đưa vào sử dụng khi **10/10 phân hệ đều đạt P0**.
>
> **ƯU TIÊN:** `P0` = bắt buộc nghiệm thu Our Space V1.0; `P1` = ưu tiên cao nhưng không mặc định thuộc V1.0; `P2` = tương lai. **Không tự đẩy P1/P2 vào P0.**
>
> **LƯU Ý CHO CODEX:** Đọc toàn bộ các mục D01–D22, mô hình thời gian/recurrence/reminder, đặc tả 17 giao diện, hợp đồng liên phân hệ, `BR-M05-*`, `UC-M05-*`, `EX-M05-*`, `AC-M05-*`, Definition of Done. Các vấn đề còn mở được ghi rõ ở cuối; **không tự giả định đã được chủ dự án chốt**. Quyền truy cập phải kiểm tra tại lớp dữ liệu/tài nguyên, không chỉ ẩn nút UI.

---

## MỤC LỤC

1. [Định vị và phạm vi](#1-định-vị-và-phạm-vi)
2. [22 quyết định nghiệp vụ đã chốt](#2-22-quyết-định-nghiệp-vụ-đã-chốt)
3. [Tác nhân, thuật ngữ, hành trình người dùng](#3-tác-nhân-thuật-ngữ-hành-trình-người-dùng)
4. [Mô hình nghiệp vụ, trường dữ liệu và thời gian](#4-mô-hình-nghiệp-vụ-trường-dữ-liệu-và-thời-gian)
5. [Sitemap và tiêu chuẩn UI chung](#5-sitemap-và-tiêu-chuẩn-ui-chung)
6. [CC-01–CC-05: Các giao diện xem lịch](#6-cc-01cc-05-các-giao-diện-xem-lịch)
7. [CC-06–CC-08: Sự kiện, chi tiết, lịch cá nhân/chung](#7-cc-06cc-08-sự-kiện-chi-tiết-lịch-cá-nhânchung)
8. [CC-09: Anniversaries & Important Dates](#8-cc-09-anniversaries--important-dates)
9. [CC-10: Recurrence Manager](#9-cc-10-recurrence-manager)
10. [CC-11: Reminder Settings](#10-cc-11-reminder-settings)
11. [CC-12: Upcoming & Conflict Detection](#11-cc-12-upcoming--conflict-detection)
12. [CC-13: Linked Events và đồng bộ xuyên phân hệ](#12-cc-13-linked-events-và-đồng-bộ-xuyên-phân-hệ)
13. [CC-14–CC-17: Search, Permissions, Settings, History/Trash/Export](#13-cc-14cc-17-search-permissions-settings-historytrashexport)
14. [Vai trò, phân quyền và bảo mật](#14-vai-trò-phân-quyền-và-bảo-mật)
15. [Trạng thái, xung đột dữ liệu, tự lưu và đồng bộ](#15-trạng-thái-xung-đột-dữ-liệu-tự-lưu-và-đồng-bộ)
16. [Các hành trình nghiệp vụ end-to-end](#16-các-hành-trình-nghiệp-vụ-end-to-end)
17. [20 Use Cases chi tiết](#17-20-use-cases-chi-tiết)
18. [64 Business Rules — danh mục chuẩn](#18-64-business-rules--danh-mục-chuẩn)
19. [45 trường hợp ngoại lệ](#19-45-trường-hợp-ngoại-lệ)
20. [75 Acceptance Criteria](#20-75-acceptance-criteria)
21. [Yêu cầu phi chức năng, responsive và khả năng tiếp cận](#21-yêu-cầu-phi-chức-năng-responsive-và-khả-năng-tiếp-cận)
22. [Phạm vi, ranh giới P0/P1/P2 và phụ thuộc](#22-phạm-vi-ranh-giới-p0p1p2-và-phụ-thuộc)
23. [Definition of Done và chiến lược kiểm thử](#23-definition-of-done-và-chiến-lược-kiểm-thử)
24. [Traceability D01–D22 và xử lý bất đồng tài liệu](#24-traceability-d01d22-và-xử-lý-bất-đồng-tài-liệu)
25. [Thông số kỹ thuật chưa chốt và Change Log](#25-thông-số-kỹ-thuật-chưa-chốt-và-change-log)

---

# 1. Định vị và phạm vi

## 1.1. Mục tiêu sản phẩm

M05 — **Couple Calendar** là **trung tâm quản lý thời gian** của Our Space: quản lý lịch riêng/chung, lịch hẹn, ngày kỷ niệm, sự kiện lặp, người tham gia, nhắc nhở và lịch biểu được liên kết từ các phân hệ. M05 không chỉ là một lịch hiển thị trên Homepage. Sau nhiều năm, người dùng vẫn phải tìm lại được những lần hẹn, ngày kỷ niệm và liên kết tới kỷ niệm đã lưu.

Sáu mục tiêu:
1. **Shared Calendar:** hai tài khoản cùng xem/quản lý sự kiện được chia sẻ trong phạm vi được cấp.
2. **Personal Calendar:** cá nhân có lịch riêng, không vô tình bị tiết lộ qua giao diện hoặc API.
3. **Important Dates:** ngày kỷ niệm có ngày gốc, tính số năm/ngày và liên kết M08.
4. **Reminders:** nhắc đúng người, đúng sự kiện/occurrence và quyền, có khả năng chống trùng.
5. **Integration:** một Calendar Event có thể liên kết M03 Date Plan, M04 Activity, M06 Goal, M08 Special Moment, và nội dung M01/M02.
6. **Reliability:** xử lý chính xác all-day/timed events, timezone, recurring series, ngoại lệ, sửa đồng thời, Trash/Restore/Export.

## 1.2. Trong phạm vi M05 V1.0 (P0)

- Bốn chế độ xem Month, Week, Day, Agenda và màn hình Home.
- My Calendar và Our Calendar; ẩn/hiện theo lựa chọn giao diện; Event Private mặc định.
- Tạo/sửa/xem/hủy/khôi phục Event; trạng thái dự kiến/xác nhận/hoàn thành/hủy.
- Mời người kia; phản hồi Going, Maybe, Not Going, No Response.
- Anniversary riêng với ngày gốc, lặp theo năm, ngày 29/02, bộ đếm ngày.
- Lặp theo ngày/tuần/tháng/năm/chu kỳ tùy chỉnh; sửa một lần/từ lần này/toàn chuỗi.
- In-app reminders và tùy chọn thời điểm/quiet hours theo tài khoản; quản lý tránh gửi trùng.
- Cảnh báo trùng lịch trong phạm vi quyền hợp lệ; tùy chọn Busy/Free mặc định **tắt**.
- Liên kết và đồng bộ nhất quán với Date Plan M03, Activity/Trip M04; dự trù hợp đồng M06/M08.
- Tìm kiếm, lọc, cấu hình, lịch sử, Trash 30 ngày, export dữ liệu có cấu trúc.
- Cộng tác hai tài khoản an toàn, desktop/mobile đầy đủ nghiệp vụ P0.

## 1.3. Ngoài phạm vi M05 V1.0 mặc định

- Email reminders, browser/device push, SMS, tích hợp thông báo native nền: **không mặc định P0**. Email và push là P1; SMS chưa có trong V1.0.
- Đồng bộ hai chiều Google Calendar/Outlook; AI xếp lịch/gợi ý lịch; đặt chỗ trực tiếp: P2.
- Nhập từ `.ics`, xuất iCalendar chuẩn, kéo thả sự kiện trực tiếp trên Week View, widget nâng cao: P1.
- Tính thời gian di chuyển thực tế, giá dịch vụ, kiểm tra quán có mở cửa hay đặt bàn: ngoài trách nhiệm cốt lõi của M05.
- M05 không giữ file ảnh/video gốc (M02), Photobook/Diary (M01), Place/Visit (M03), Trip (M04), Goal (M06), Expense (M07) hoặc nội dung Time Capsule (M08).

## 1.4. Các nguyên tắc không được phá vỡ

- **Private by default:** tạo Event mới không làm người kia nhìn thấy nếu chủ sở hữu chưa chọn chia sẻ; kể cả khi người dùng đang ở màn hình Our Calendar, giao diện phải giải thích tác động khi chọn lịch chia sẻ.
- **One event, one authoritative record:** Event sau khi đã liên kết có một danh tính được M05 quản lý; không tạo bản Event song song tại M03/M04. Trước khi liên kết, phân hệ nguồn có thể giữ ngày giờ *dự kiến* riêng; sau khi liên kết, thời gian hiển thị lịch tuân theo M05.
- **Calendar owns time, origin owns business status:** M03 giữ Visit/Date Plan và trạng thái thực tế, M04 giữ Trip/Activity và Booking; đổi Calendar time không tự đánh dấu Visited/Completed hoặc đổi thành công Booking.
- **Private means private:** không lộ tên, thumbnail, địa chỉ, người tham gia, metadata, số lượng sự kiện private qua Search, Agenda, Busy/Free, Reminder, Export, URL trực tiếp hoặc thống kê.
- **No blind overwrite:** thao tác đồng thời phải không làm mất cập nhật hợp lệ mà không có dấu hiệu/xử lý.
- **No cascade delete:** xóa Event không tự xóa đối tượng nguồn hoặc file gốc.
- **Data longevity:** Trash 30 ngày, khôi phục an toàn, history và backup riêng biệt, export có cấu trúc.

---

# 2. 22 quyết định nghiệp vụ đã chốt

**Nguồn phê duyệt:** Người dùng xác nhận nguyên văn: “Tôi chốt toàn bộ đề xuất M05”. Bảng dưới là ràng buộc nghiệp vụ, không phải lựa chọn còn chờ duyệt.

| ID | Quyết định chính thức | Hệ quả bắt buộc |
|---|---|---|
| D01 | Month, Week, Day, Agenda trong V1.0 | Cả bốn chế độ truy cập được trên desktop/mobile |
| D02 | Có My Calendar và Our Calendar, phân quyền theo Event | Hỗ trợ lịch cá nhân, chung và bộ lọc hiển thị độc lập với quyền |
| D03 | All-day và Event có giờ, phải có ngày | Không tạo Event lịch không có ngày; ideas ở phân hệ nguồn |
| D04 | Couple Date, Anniversary, Birthday, Trip, Personal, Appointment, Custom | Phân loại có thể mở rộng; không dùng kiểu để tự suy ra quyền |
| D05 | Tentative, Confirmed, Completed, Cancelled | Không tự Completed khi qua ngày/giờ |
| D06 | Going, Maybe, Not Going, No Response | Phản hồi riêng từng participant |
| D07 | Trang Anniversaries riêng và bộ đếm ngày | Tạo/sửa ngày gốc, hiển thị số năm/ngày |
| D08 | Days Together mặc định số ngày đã trôi qua, hỗ trợ “ngày thứ N” | Cấu hình/hiển thị rõ phép đếm, không nhập nhằng |
| D09 | Kỷ niệm 29/02: mặc định 28/02 năm không nhuận, có tùy chọn 01/03 | Không sửa ngày gốc 29/02 |
| D10 | Daily, Weekly, Monthly, Yearly, Custom interval | Có recurrence và occurrence/exception |
| D11 | Sửa/xóa chỉ một occurrence, từ lần này về sau, hoặc toàn chuỗi | Có màn chọn phạm vi bắt buộc khi thao tác |
| D12 | Lặp ngày 31: mặc định ngày cuối tháng khi thiếu ngày 31 | Mô tả chính sách trong UI |
| D13 | Một Event có thể có nhiều Reminder | Lưu và xử lý từng mốc nhắc hợp lệ |
| D14 | In-app P0; Email/Push P1 | Không cam kết thông báo OS khi ứng dụng đóng trong P0 |
| D15 | A/B có lời nhắc cá nhân khác nhau cho cùng Event | Không ghi đè, không gửi sai người |
| D16 | Quiet hours cấu hình theo tài khoản với kênh chủ động | Rõ chính sách trì hoãn/bỏ qua quá hạn |
| D17 | Kiểm tra lịch trùng, cảnh báo nhưng không mặc định cấm lưu | Tôn trọng quyền kiểm tra busy/free |
| D18 | Busy/Free của Private Event tắt mặc định, tùy ý bật | Không suy lộ lịch riêng qua hệ thống gợi ý |
| D19 | M05 sở hữu Calendar Event liên kết M03/M04; hai bên đồng bộ | Đồng bộ có idempotency, conflict, trạng thái lỗi |
| D20 | M08 Special Moments/Scheduled Reveal được bảo vệ | Không lộ Time Capsule trước giờ mở |
| D21 | Structured export P0; iCalendar P1 | Export theo quyền và giữ timezone/recurrence |
| D22 | Không bắt buộc đồng bộ Google/Outlook V1.0 | Không lệ thuộc tài khoản lịch ngoài |

**Kế thừa M01–M04:** Tài khoản đôi, private mặc định, phân quyền theo nội dung, media gốc do M02 quản lý, địa điểm bởi M03, hoạt động chuyến đi bởi M04, Trash 30 ngày, cùng năng lực nghiệp vụ trên mobile/desktop. M01 là phân hệ bắt buộc **realtime coediting sâu**; M05 yêu cầu chống xung đột có hiệu lực, không bắt buộc live cursor.

---

# 3. Tác nhân, thuật ngữ, hành trình người dùng

## 3.1. Actors

| Actor | Mô tả | Trách nhiệm/quyền |
|---|---|---|
| User A | Tài khoản cá nhân thứ nhất | Tạo/nhận/xem/sửa sự kiện được cấp quyền |
| User B | Tài khoản cá nhân thứ hai | Tương tự A, không tự hưởng quyền private của A |
| Event Owner | Chủ Event | Chia sẻ, cấp quyền, xóa/khôi phục theo chính sách |
| Event Editor | Người được phép sửa | Chỉnh sửa nội dung/lịch theo quyền, không mặc định xóa vĩnh viễn |
| Commenter | Người có quyền bình luận | Có thể bình luận và phản hồi tham gia nếu được mời |
| Viewer | Người được xem | Xem nội dung cho phép; trả lời lời mời nếu được mời |
| Linked module | M03/M04/M06/M08 | Tạo hoặc sử dụng liên kết tới cùng Event theo hợp đồng nghiệp vụ |
| Reminder subsystem | Hệ thống nhắc | Lên lịch/xử lý trạng thái thông báo dựa trên quyền hiện hành |

M05 hướng tới **hai tài khoản** của một Our Space; không tự giả định có khách công khai hoặc nhóm lớn ở V1.0. Mô hình nghiệp vụ vẫn cần mã định danh chủ sở hữu để có thể mở rộng về sau.

## 3.2. Thuật ngữ phân biệt

| Khái niệm | Định nghĩa | Không đồng nhất với |
|---|---|---|
| Calendar | Bộ chứa/nhóm hiển thị sự kiện có quyền | Một Event |
| Calendar Event | Cuộc hẹn có ngày/giờ, trạng thái, thành viên | M03 Date Plan hoặc M04 Activity |
| All-day Event | Event theo ngày lịch, không bị dịch theo UTC | Timed Event lúc 00:00 |
| Timed Event | Event có thời điểm địa phương và timezone rõ | Ngày kỷ niệm chỉ có ngày |
| Recurring Series | Quy tắc gốc sinh các lần lặp | Hàng nghìn Event bản sao |
| Occurrence | Một lần cụ thể của chuỗi | Bản gốc Series |
| Exception | Lần lặp được dời/hủy/sửa riêng | Sửa toàn chuỗi |
| Anniversary | Cột mốc ngày gốc với quy tắc lặp/năm | Event thường đặt 12 tháng sau |
| Reminder Config | Mốc/kênh nhắc theo người | Đã gửi hoặc đã hiển thị |
| Delivery | Trạng thái xử lý một lần nhắc | Bằng chứng người dùng đã đọc |
| Participation | Phản hồi của người được mời | Quyền sửa Event |
| Busy/Free | Tín hiệu bận/rảnh được cho phép tiết lộ | Quyền xem nội dung lịch riêng |
| Linked Event | Calendar Event tham chiếu nghiệp vụ khác | Bản sao đầy đủ dữ liệu nguồn |
| Trash | Xóa mềm có hạn khôi phục | Archive hoặc Cancelled |

## 3.3. Hành trình người dùng điển hình

- **Từ M03:** lưu quán (Place) → lập Date Plan có giờ → chọn liên kết M05 → chia sẻ Event → nhận lời nhắc → đi chơi → tạo Visit tại M03 → kết nối Diary/Photobook qua M01.
- **Từ M04:** Dream Trip chưa có ngày → Planning → Activity có ngày giờ → chọn đưa lên Calendar → dời Trip có kiểm tra tác động → liên kết Event không nhân bản → xác nhận hoạt động thực tế tại M04/M03.
- **Kỷ niệm:** tạo Anniversary ngày gốc → chọn quy tắc năm nhuận → tạo Reminders riêng A/B → xem bộ đếm → liên kết Special Moment của M08 mà không tiết lộ Time Capsule quá sớm.
- **Lịch cá nhân:** tạo Event Private → người kia không thấy nội dung, không thấy tín hiệu bận khi chưa cho phép → chủ động bật Busy/Free để chia sẻ chỉ khoảng bận khi cần.

---

# 4. Mô hình nghiệp vụ, trường dữ liệu và thời gian

## 4.1. 22 đối tượng nghiệp vụ

| ID | Entity | Vai trò, phạm vi |
|---|---|---|
| ENT-M05-01 | Calendar | Lịch riêng/chung; tên, chủ và quyền mặc định |
| ENT-M05-02 | Calendar Membership | Ai có quyền dùng/xem lịch |
| ENT-M05-03 | Calendar Event | Sự kiện có định danh ổn định, trạng thái, thời gian |
| ENT-M05-04 | Event Participant | Quan hệ Event–người tham gia |
| ENT-M05-05 | Event Category | Loại phân nhóm có thể mở rộng |
| ENT-M05-06 | Event Location | Địa chỉ/tọa độ tham chiếu Place M03 nếu có |
| ENT-M05-07 | Recurrence Rule | Quy tắc lặp, chu kỳ, ngày kết thúc/số lần |
| ENT-M05-08 | Recurrence Exception | Dời/sửa/bỏ một occurrence cụ thể |
| ENT-M05-09 | Event Occurrence | Danh tính nghiệp vụ lần xuất hiện |
| ENT-M05-10 | Anniversary | Ngày gốc, kiểu đếm, quy tắc năm nhuận, link M08 |
| ENT-M05-11 | Reminder Configuration | Người nhận, offset, kênh, bật/tắt |
| ENT-M05-12 | Reminder Delivery | Trạng thái xử lý lời nhắc cho occurrence |
| ENT-M05-13 | Attendance Response | Going/Maybe/Not Going/No Response, người phản hồi |
| ENT-M05-14 | Busy/Free Preference | Người cho phép xem độ bận; phạm vi/trạng thái |
| ENT-M05-15 | Linked Content | Liên kết định danh M01/M02/M03/M04/M06/M08 |
| ENT-M05-16 | Event Attachment | Liên kết tài nguyên do module gốc quản lý |
| ENT-M05-17 | Calendar Permission | Quyền tổng quát trên lịch |
| ENT-M05-18 | Event Permission | Quyền cụ thể của một Event, có thể hạn chế hơn |
| ENT-M05-19 | Event Change History | Lịch sử thao tác và người thực hiện |
| ENT-M05-20 | Calendar Preference | Hiển thị, tuần bắt đầu, giờ, timezone, quiet hours |
| ENT-M05-21 | Trash Record | Ngày xóa, chủ thể, hạn khôi phục, trạng thái |
| ENT-M05-22 | Export Request | Yêu cầu xuất, phạm vi quyền, trạng thái |

**Cardinality bắt buộc:** một Calendar chứa nhiều Event; một Event có nhiều Participant và Reminder Config; một Series có nhiều Occurrence (có thể sinh theo yêu cầu) và Exception; một Event có thể có nhiều Linked Content nhưng mỗi liên kết chức năng phải duy nhất theo mục đích; Anniversary có thể liên kết một Series/Event đại diện nhưng không làm mất ngày gốc.

## 4.2. Trường nghiệp vụ của Calendar

| Trường | Mô tả/quy tắc |
|---|---|
| Name | Tên lịch; mặc định My Calendar và Our Calendar có tên rõ ràng |
| Type | Personal / Shared; không phải quyền duy nhất của Event |
| Owner | Tài khoản sở hữu/quản lý |
| Members | Danh sách được cấp quyền, không mặc định mọi đối tượng là shared |
| Appearance | Màu/ký hiệu được cấu hình, bảo đảm đọc được không phụ thuộc màu |
| Visibility in UI | Người dùng tự bật/tắt bộ lọc, **không ảnh hưởng dữ liệu/quyền** |
| Default reminders | Tùy chọn cá nhân; không cưỡng chế lên người kia |
| Created/Updated | Thời gian và tác nhân thay đổi |

## 4.3. Trường nghiệp vụ của Calendar Event (CC-06)

| Trường | Bắt buộc | Quy tắc |
|---|---|---|
| Stable Event ID | Tự sinh | Không đổi khi thay ngày/giờ/lịch |
| Title | Có | Không rỗng/không toàn khoảng trắng; độ dài tối đa cần cấu hình |
| Category | Có | D01–D04: Couple Date, Anniversary, Birthday, Trip, Personal, Appointment, Custom |
| Calendar | Có | Phải có quyền sử dụng lịch đích |
| All-day flag | Có | Quyết định kiểu thời gian |
| Start date | Có | Date-only local; không dùng ngày giả cho M03/M04 chưa có lịch |
| End date | Theo loại | Không trước start; sự kiện nhiều ngày hợp lệ |
| Start/end time | Timed Event | Giá trị giờ địa phương và timezone hợp lệ |
| Timezone | Timed Event | Múi giờ thuộc ngữ cảnh nơi diễn ra Event; đổi vùng hiển thị không đổi instant |
| Description | Không | Nội dung, kiểm tra quyền và chống XSS khi hiển thị |
| Location | Không | Địa chỉ tự nhập hoặc Place M03; không giả định tọa độ |
| Status | Có | Tentative/Confirmed/Completed/Cancelled |
| Visibility | Có | **Private mặc định**, chuyển Shared phải xác nhận |
| Owner/Editors | Có chủ | Các vai trò theo Event |
| Participants | Không | Chỉ phản hồi của chính người tham gia |
| Recurrence | Không | Liên kết Series nếu sự kiện lặp |
| Reminders | Không | Nhiều cấu hình độc lập theo người |
| Linked content | Không | Chỉ reference và bản hiển thị an toàn theo quyền |
| Revision / last updated | Tự ghi | Phục vụ phát hiện conflict và history |
| Created by/at | Tự ghi | Metadata kiểm toán |
| Deleted/archived flag | Theo thao tác | Trash tách Cancelled; không vô tình gửi reminder |

**Event all-day:** người dùng chọn một hoặc nhiều **ngày lịch**, không chuyển thành sự kiện timed 00:00 một cách ngầm định. Khi hiển thị trên múi giờ thiết bị khác, ngày all-day phải giữ ý nghĩa của ngày đã tạo.

**Event timed:** giữ được cả giờ địa phương trong timezone sự kiện và một thời điểm tuyệt đối nhất quán. Mỗi thao tác thay giờ/timezone phải chỉ rõ người dùng muốn *giữ thời điểm tuyệt đối* hay *giữ giờ địa phương* trong các trường hợp khác ngữ cảnh; không silently shift.

## 4.4. Trường Anniversary

| Trường | Quy tắc |
|---|---|
| Name & type | Bắt buộc, gắn loại kỷ niệm có thể mở rộng |
| Original date | Bắt buộc; giữ nguyên năm/tháng/ngày gốc; không bị ghi đè bởi recurrence |
| Reference timezone | Múi giờ quy chiếu để xét “hôm nay” của mốc (theo cài đặt phù hợp) |
| Yearly recurrence | Có thể bật; các lần kỷ niệm phát sinh theo năm |
| Feb 29 policy | Mặc định 28/02 năm không nhuận, tùy chọn 01/03; giữ ngày gốc 29/02 |
| Day counter mode | Days elapsed mặc định; hiển thị “ngày thứ N” khi được chọn |
| Cover / linked media | Tham chiếu M02, không lưu bản ảnh khác trong M05 |
| Linked Special Moment | M08 sở hữu nội dung, M05 chỉ lưu ref và quyền hiển thị |
| Reminders | Tùy tài khoản, không tự động lộ nội dung bất ngờ |

**Phép đếm:** `days_elapsed` là chênh lệch số ngày lịch từ original date đến ngày hiện tại theo timezone quy chiếu, ngày gốc = 0; `ordinal_day = days_elapsed + 1` khi người dùng chọn kiểu “ngày thứ N”. Không tính đơn thuần số giờ/24 vì DST/timezone. Nếu ngày hiện tại trước ngày gốc, UI thể hiện “còn N ngày tới mốc” hoặc không hiển thị counter số âm dưới dạng đã ở bên nhau. Số năm kỷ niệm là số lần anniversary theo quy tắc đã qua; không phải `floor(days/365)`.

## 4.5. Quy tắc thời gian và recurrence — tiêu chuẩn bắt buộc

1. **Date-only**: calendar date cho all-day/anniversary; không gán giờ 00:00 để tính theo UTC rồi dịch sang ngày khác.
2. **Timed**: thời gian bắt đầu/kết thúc với timezone IANA tương đương có thể nhận diện, phải quy về cùng trục thời gian khi so sánh conflict; tên timezone cụ thể thuộc thiết kế kỹ thuật.
3. **Local wall time recurrence**: lịch hẹn mỗi thứ Bảy lúc 19:00 giữ giờ địa phương tương ứng, kể cả khi DST thay đổi độ lệch UTC.
4. **DST nonexistent local time**: nếu chọn thời gian không tồn tại do chuyển DST thì yêu cầu chọn giờ hợp lệ; không im lặng dịch 02:30 thành 03:30.
5. **DST ambiguous local time**: khi cùng một giờ địa phương xuất hiện hai lần, phải xác định lựa chọn occurrence/time offset, không nhân đôi reminder ngoài ý muốn.
6. **Overnight**: Event qua nửa đêm hoặc nhiều ngày không được tự cắt sai thành những Event khác nhau.
7. **Monthly day 31**: mặc định dùng ngày cuối cùng của tháng trong tháng không có ngày 31, giữ rule gốc chọn 31.
8. **Feb 29 yearly anniversary**: mặc định 28/02 năm không nhuận, tùy chọn 01/03, không sửa original date.
9. **Recurrence scope**: this occurrence / this and following / entire series; chỉ tác động đúng phạm vi, bảo vệ exceptions.
10. **Series không có ngày kết thúc**: tạo các Occurrence theo cửa sổ đang xem hoặc cần nhắc, không tạo vô hạn bản ghi trước.
11. **Giờ thiết bị không tin cậy**: thứ tự cập nhật và xác nhận lưu không chỉ dựa đồng hồ trên client.
12. **Display timezone != source timezone**: thay đổi sở thích hiển thị không đổi instant của Event nguồn.

---

# 5. Sitemap và tiêu chuẩn UI chung

## 5.1. Sitemap logic của M05

```text
Our Space / Couple Calendar
├── CC-01 Calendar Home
├── Views
│   ├── CC-02 Month View
│   ├── CC-03 Week View
│   ├── CC-04 Day View
│   └── CC-05 Agenda View
├── Events
│   ├── CC-06 Create / Edit Event
│   ├── CC-07 Event Detail
│   ├── CC-10 Recurrence Manager (panel)
│   ├── CC-11 Reminder Settings (panel)
│   ├── CC-12 Upcoming & Conflicts
│   ├── CC-13 Linked Events
│   └── CC-15 Participants & Permissions
├── Calendars
│   └── CC-08 My & Shared Calendars
├── Special Dates
│   └── CC-09 Anniversaries & Important Dates
├── CC-14 Search & Filters
├── CC-16 Calendar Preferences
└── CC-17 History / Trash / Export
```

## 5.2. 17 giao diện chuẩn

| Screen ID | Tên | P0 chính | Điểm vào |
|---|---|---|---|
| CC-01 | Calendar Home | Tổng quan, quick create, upcoming | Main navigation |
| CC-02 | Month View | Tháng, ngày có Event, điều hướng | View toggle |
| CC-03 | Week View | Theo ngày và khung giờ, overlapping | View toggle |
| CC-04 | Day View | Danh sách/thời gian theo một ngày | Từ Month/Agenda |
| CC-05 | Agenda View | Sự kiện sắp tới dạng tuyến thời gian | View toggle |
| CC-06 | Create/Edit Event | Form, validation, save/cancel, link | Quick create hoặc Event Detail |
| CC-07 | Event Detail | Xem, sửa, phản hồi, chia sẻ | Click Event |
| CC-08 | My & Shared Calendars | Bật/tắt hiển thị, quyền lịch | Sidebar/preferences |
| CC-09 | Anniversaries & Important Dates | Kỷ niệm, counter, ngày gốc | Special Dates |
| CC-10 | Recurrence Manager | Rule + scope edit/delete | Editor |
| CC-11 | Reminder Settings | Nhiều reminder, theo người | Editor/Preferences |
| CC-12 | Upcoming & Conflicts | Danh sách sắp đến, cảnh báo xung đột | Home/Editor |
| CC-13 | Linked Events | Xem nguồn/đích và tình trạng sync | Event Detail |
| CC-14 | Search & Filters | Tìm theo quyền, lọc, search recurrence | Search |
| CC-15 | Participants & Permissions | Invite, attendance, roles | Event Detail/Editor |
| CC-16 | Calendar Preferences | Tuần, múi giờ, định dạng, quiet hours | Settings |
| CC-17 | History, Trash & Export | Audit, soft delete, restore, export | More/Settings |

## 5.3. UI states áp dụng cho mọi màn hình

- `Loading`: skeleton hoặc progress, không hiển thị dữ liệu giả như đã lưu.
- `Empty`: hướng dẫn tạo sự kiện/lịch/anniversary phù hợp.
- `Ready`: hiển thị dữ liệu trong quyền truy cập hiện hành.
- `Saving/Syncing`: có chỉ báo thao tác chưa được xác nhận.
- `Saved`: chỉ khi hệ thống đã xác nhận lưu và hợp đồng sync phù hợp được ghi nhận; sync phân hệ có thể có trạng thái riêng.
- `Offline/Connection Lost`: thông báo, giữ thay đổi cục bộ khi khả thi nhưng không hứa offline editing hoàn chỉnh.
- `Conflict`: chỉ rõ trường bị xung đột, bản hiện tại, bản người dùng đang sửa và thao tác xử lý.
- `Forbidden`: không hiển thị chi tiết Event hoặc metadata bị hạn chế.
- `Deleted/Cancelled`: phân biệt đã xóa mềm với hủy lịch hẹn.
- `Unsupported`: phương thức nhắc/định dạng không hỗ trợ, có phương án thay thế.

## 5.4. UX chuẩn

- Chuyển View không thay đổi dữ liệu hoặc quyền; nhớ ngày/ngữ cảnh đang xem khi hợp lý.
- Có đường dẫn rõ quay từ Event Detail về nơi mở (tháng/tuần/tìm kiếm/lịch hẹn).
- Tương tác bằng chạm trên mobile (touch target hợp lý, chọn ngày, modal/panel); desktop hỗ trợ bàn phím và thao tác chính.
- Hỗ trợ font tiếng Việt và nội dung dài; không chỉ dùng màu phân biệt lịch, trạng thái hoặc mức ưu tiên.
- Không yêu cầu kéo thả để hoàn thành nghiệp vụ P0: luôn có menu/form để đổi thời gian/ngày hoặc chuyển lịch.
- Cảnh báo trước các thao tác có tác động rộng (sửa cả chuỗi, hủy toàn bộ, xóa, chia sẻ Event có nội dung riêng tư).

---
# 6. CC-01–CC-05: Các giao diện xem lịch

## 6.1. CC-01 — Calendar Home

**Mục đích:** một điểm vào để thấy hôm nay, tuần này, những sự kiện sắp đến và ngày kỷ niệm quan trọng mà người dùng được phép biết.

**Bố cục đề xuất:** header `Our Calendar`, nút `Create Event`, date navigator, bộ chuyển Month/Week/Day/Agenda; dưới đó là calendar preview, `Upcoming`, `Next Anniversary`, `Pending Invitations`, và bộ lọc My/Our/Linked.

| Thành phần | Tác động khi thao tác | Quy tắc |
|---|---|---|
| `Today` | Di chuyển view đến ngày địa phương hiện tại | Tính theo múi giờ hiển thị, không nhầm timestamp server |
| `+ Event` | Mở CC-06, mặc định ngày đang chọn | Event mới Private cho đến khi chia sẻ có chủ đích |
| `Upcoming` | Mở CC-12 hoặc CC-07 | Chỉ hiện Event có quyền; loại Cancelled khỏi upcoming mặc định |
| `Next Anniversary` | Mở CC-09 hoặc CC-07 | Không lộ Scheduled Reveal của M08 |
| `Pending Invitations` | Mở sự kiện chưa phản hồi | Không tự nhận lời mời |
| Calendar filter | Ẩn/hiện bộ lịch hiện trong UI | Không thay đổi Event Permission |

**Empty state:** chưa có Event → hiển thị lời mời tạo lịch hẹn hoặc Anniversary đầu tiên; không hiển thị các card mẫu như nội dung thật. **Error state:** tải một phần dữ liệu lỗi → phần khác vẫn hoạt động khi có thể, cảnh báo rõ thiếu thông tin.

## 6.2. CC-02 — Month View

- Lưới ngày theo tháng; cột đầu tuần theo cài đặt của tài khoản.
- Mỗi ngày có dấu chỉ thị và/hoặc số lượng **chỉ dựa trên Event có quyền xem**, nhấn ngày mở danh sách; không tiết lộ số sự kiện Private của người kia.
- Có `Previous Month`, `Next Month`, `Today`, `Jump to Date`, `Create on Selected Date`.
- Trên desktop hiển thị nhãn sự kiện theo khoảng không gian; trên mobile ưu tiên dấu/số đếm và danh sách dưới ngày chọn.
- Event nhiều ngày được biểu diễn xuyên ngày theo khả năng bố cục; không sinh bản ghi trùng. All-day giữ ngày đã đặt dù người dùng đổi timezone hiển thị.
- Khi một ngày nhiều Event, hiển thị `+ N more` theo tập dữ liệu có quyền; nhấn để xem toàn bộ.
- Với chuỗi lặp, truy vấn occurrence trong khoảng tháng và phần ngày lân cận cần hiển thị, tránh sinh vô hạn.

## 6.3. CC-03 — Week View

- Lưới ngày–giờ hoặc dạng danh sách tuần tương đương trên màn hình nhỏ; khu vực all-day riêng với các Event có giờ.
- Timed Event đặt theo giờ hiển thị với rõ timezone/offset khi dễ nhầm; event xuyên ngày được cắt khúc **chỉ để hiển thị**, không tách nghiệp vụ.
- Hiển thị các Event chồng thời gian cạnh nhau hoặc theo dạng stack có thể mở; không âm thầm che mất.
- Nút chuyển tuần và truy cập Event Detail; tạo Event từ thời điểm được chọn bằng form khi cần (không yêu cầu drag-drop P0).
- Event thuộc nhiều loại lịch có ký hiệu/màu và tên nhãn truy cập được bằng bàn phím/screen reader; không chỉ phân biệt bằng màu sắc.

## 6.4. CC-04 — Day View

- Danh sách chronological với phân vùng `All-day`, `Timed`, `Events without end time` nếu kiểu dữ liệu cho phép; giữ Event qua nửa đêm ở ngày tương ứng.
- Dòng Event thể hiện tên, giờ, trạng thái, lịch, địa điểm có quyền và phản hồi tham gia khi cần.
- `Open`, `Edit`, `Respond`, `Add Reminder`, `Directions`, `Open Source` tùy quyền và có dữ liệu tương ứng.
- Không tính Event hẹn thành `Completed` chỉ vì thời điểm diễn ra đã trôi qua.

## 6.5. CC-05 — Agenda View

- Danh sách nhóm theo `Today`, `Tomorrow`, `This Week`, ngày cụ thể và khoảng tùy chọn; có phân trang/tải thêm nếu nhiều occurrence.
- Sắp xếp theo thời điểm thực tế trong timezone hiển thị; all-day trước hoặc nhóm riêng có chú giải nhất quán.
- Chỉ hiển thị từng occurrence hợp lệ của Series, không phải toàn bộ Series như một dòng nếu người dùng chọn phạm vi ngày.
- Có quick action phản hồi, mở Place/Activity liên kết, tạo Reminder nếu có quyền; không tiết lộ nguồn liên kết Private.
- Bộ lọc có thể lưu lựa chọn theo tài khoản và áp dụng trên các View để nhất quán trải nghiệm.

---

# 7. CC-06–CC-08: Sự kiện, chi tiết, lịch cá nhân/chung

## 7.1. CC-06 — Create/Edit Event

**Luồng tạo:** `Open form → Select category/calendar/date → Select all-day or timed → Enter details → Set participants/visibility → Set recurrence/reminders → Review → Save → Display Event Detail`.

**Cấu trúc form đề xuất:**

1. **Identity:** Title (required), Category (required), Description (optional).
2. **Timing:** Start Date required; all-day switch; nếu timed thì Start Time, End Time, End Date tùy trường hợp và Timezone; validate end sau start. Một Event chỉ có thời điểm bắt đầu vẫn có thể hỗ trợ nếu quy tắc đã được thiết kế rõ; không tự tạo end time giả.
3. **Context:** Place Picker chọn M03 hoặc text địa điểm, map link, attachment/link nguồn được phép.
4. **Sharing:** Calendar selector, Visibility Private/Shared, người được phép xem/sửa, invited participants. Nếu chọn Our Calendar để chia sẻ, UI buộc xác nhận chia sẻ; không “lén” đổi Private thành Shared.
5. **Advanced:** Recurrence (CC-10), Reminders (CC-11), liên kết M03/M04 khi đúng nguồn.
6. **Actions:** `Save`, `Cancel`, `Preview` (nếu hữu ích); khi sửa Series cần chọn phạm vi (single/future/all) trước khi lưu.

**Validation:** tiêu đề không rỗng; start date hợp lệ; timezone hợp lệ cho timed; nếu có end phải sau start (so sánh instant cho timed); calendar/event permission hợp lệ; recurrence với by-day/date hợp lệ; Reminder không trùng đúng cấu hình theo người; URL/link không tự tin tưởng; date precision bắt buộc là ngày cụ thể ở M05. Nội dung người dùng nhập được giữ trên form khi lỗi; lỗi nằm tại trường liên quan, không chỉ thông báo chung.

**Cancel** khi có thay đổi chưa lưu: phân biệt Cancel editing với Cancel Event. **Save** chỉ hiển thị thành công sau xác nhận; liên kết M03/M04 có thể cần trạng thái `Calendar saved / Source sync pending`, không tuyên bố cả hai đã đồng bộ nếu chưa hoàn tất.

**Concurrent update:** nếu form đang dựa trên phiên bản cũ, có cảnh báo/xung đột cho trường cùng sửa; không gửi toàn bản record cũ làm mất thay đổi mới của người kia. Sửa hai trường độc lập có thể bảo toàn cả hai.

## 7.2. CC-07 — Event Detail

**Hiển thị:** title, category, date/time + timezone, trạng thái, calendar, participants/attendance, location, descriptions, reminders của **chính người xem**, nguồn liên kết được phép, lịch sử khi có quyền.

**Actions theo quyền:** `Edit`, `Change Status`, `Respond`, `Add/Change My Reminder`, `Open in M03/M04`, `Share`, `Copy event reference` (không chia sẻ dữ liệu vượt quyền), `Cancel Event`, `Move to Trash`, `View History`. Với Event recurring, click ngày cụ thể phải biết người dùng đang chọn Occurrence nào.

**Trạng thái:** `Tentative`, `Confirmed`, `Completed`, `Cancelled`; **Cancelled ≠ Trashed**. Nếu đã Cancelled, Event vẫn có thể xem theo filter lịch sử, nhưng không tiếp tục gửi lời nhắc có tác dụng thông thường. Event không được tự Completed khi đã quá giờ; chỉ theo xác nhận/chủ thể nguồn được ủy quyền.

**Attachments/Linked Content:** danh sách hiển thị theo quyền từng tài nguyên. M02 media/private hoặc M04 Booking Document không tự hiện thumbnail nếu không đủ quyền.

## 7.3. CC-08 — My & Shared Calendars

**P0** bao gồm ít nhất **My Calendar** (private) và **Our Calendar** (shared) với tên rõ. Không cần tạo số lượng lịch tùy ý để được coi hoàn thành nếu chưa có nhu cầu; nhưng mô hình có thể mở rộng.

| Thao tác | Kết quả | Không được xảy ra |
|---|---|---|
| Switch display | Ẩn/hiện Event của lịch đó với tài khoản hiện tại | Xóa Event/chuyển quyền |
| Change calendar color | Chỉ đổi cách hiển thị | Thay đổi private/shared |
| Move Event to Our Calendar | Cho thấy và xác nhận thay đổi phạm vi chia sẻ (nếu có) | Tự lộ Event Private |
| Move Event to My Calendar | Kiểm tra participant/reminder liên quan | Giữ quyền Shared sai hoặc gửi nhắc cho người bị thu hồi |
| Manage membership | Áp dụng đúng quyền trên calendar và event riêng | Tự nâng quyền với Event có ngoại lệ |
| Turn off My Calendar in UI | Ẩn Event My Calendar của chính người đó | Tắt kiểm tra quyền hoặc xóa nhắc cá nhân |

**Busy/Free:** không mặc định cho B biết A bận; bật/tắt riêng bởi A trong preferences, chỉ cung cấp độ bận trong phạm vi cụ thể được đồng ý, không kèm title/location/count. Nếu người dùng không cho phép, conflict detection phải chỉ dựa trên dữ liệu chung hoặc có quyền. Không hiển thị thông báo ngụ ý có một Event bí mật.

---

# 8. CC-09: Anniversaries & Important Dates

## 8.1. Danh mục và form

- Nhóm: `Relationship Anniversary`, `First Date`, `First Meeting`, `Birthday`, `Personal Milestone`, `Couple Milestone`, `Custom Anniversary`.
- Trường: name, type, **original date**, timezone quy chiếu (nếu cần), visibility, description, cover ref M02, anniversary yearly option, Feb 29 behavior, reminders riêng, link M08/M01.
- Cho phép lưu Anniversary không liên kết media/diary/photobook; không bắt buộc khai báo năm nếu muốn một reminder chung? **Quy tắc P0 đã chốt ngày gốc**; việc hỗ trợ sự kiện birthday chỉ biết tháng/ngày nhưng không biết năm cần được làm rõ riêng ở technical design, không tự tạo năm giả.
- Xem danh sách theo ngày kỷ niệm gần nhất, loại, quyền; xem chi tiết lịch sử nhiều năm nếu có.
- `Create`, `Edit Original Date` (cảnh báo tác động counter và reminder), `Add Cover`, `Link Special Moment`, `Open on Calendar`.

## 8.2. Bộ đếm ngày bên nhau

- Mặc định **days elapsed**: ngày gốc = 0 ngày; có tùy chọn hiển thị **ordinal day**: ngày gốc = ngày thứ 1.
- Tính theo ngày lịch của reference timezone, không dùng số milliseconds/86,400,000 trong mọi trường hợp.
- Ngày đầu trong tương lai hiển thị countdown/Upcoming (không báo số ngày yêu nhau âm).
- Số năm kỷ niệm đếm qua các lần đúng quy tắc calendar, không `floor(day_count / 365)`; năm nhuận đúng theo rule riêng.
- Khi người dùng đổi reference timezone, hiển thị một ghi chú nếu ngày “hôm nay” thay đổi do múi giờ; không sửa original date.
- Hiển thị Days Together ở M05, và các vị trí khác qua liên kết dữ liệu; không duy trì nhiều bộ đếm độc lập.

## 8.3. Ngày 29/02

- Ngày gốc là 29/02/năm hợp lệ (không đổi).
- Năm không nhuận: mặc định occurrence ngày **28/02**; tùy chọn **01/03** nếu chủ sở hữu chọn.
- Năm nhuận kế tiếp: occurrence **29/02**.
- Lời nhắc căn cứ vào occurrence hiện hành của năm đó, không tính từ bản 29/02 không tồn tại.
- Nếu đổi rule 28/02 ↔ 01/03, phải cập nhật các lời nhắc **chưa gửi**, không phát lại những lời nhắc đã xử lý.

## 8.4. Quan hệ M08 và bí mật bất ngờ

M05 chỉ quản lý `date`, `reminder`, `visibility` và link mốc; **M08 sở hữu Letter/Time Capsule/Scheduled Reveal**. Dù Anniversary Shared, một Time Capsule Private hoặc chưa đến giờ mở vẫn không xuất hiện trong chi tiết Calendar/notifications/search/thumbnail. Đối với reminder liên quan mốc bí mật, chỉ được thông báo nội dung được phép thấy tại thời điểm phát thông báo.

---

# 9. CC-10: Recurrence Manager

## 9.1. Tạo Series

**P0 patterns:** `Daily`, `Weekly`, `Every N Weeks`, `Monthly by date`, `Monthly by weekday order`, `Yearly`, `Custom Interval` phù hợp. Người dùng chọn frequency, interval, weekdays/day of month, start, optional end date hoặc number of occurrences, timezone cho timed event, lý do/preview các lần sắp tới.

Không cần tạo tất cả occurrence bằng bản ghi vật lý. UI cần preview các lần tiếp theo trong phạm vi ngắn để người dùng kiểm tra trước khi lưu, nhất là rule 31 hoặc 29/02.

**Monthly day 31:** mặc định clamp ngày cuối tháng. Ví dụ lặp 31/01 sẽ có 28/02 hoặc 29/02 năm nhuận và 30/04, nhưng tháng 05 quay lại 31/05. **Không** biến rule gốc thành day 28 sau tháng 2.

**Monthly nth weekday:** ví dụ Chủ nhật thứ hai của tháng. Nếu rule không thể có occurrence trong một kỳ (ví dụ thứ Hai thứ năm không tồn tại trong một số tháng), cách xử lý kỳ không tồn tại cần được nêu rõ khi cấu hình (đề xuất bỏ qua kỳ đó thay vì tự chuyển thứ khác); chưa coi là đã chốt nếu người dùng chưa duyệt riêng.

## 9.2. Sửa/xóa Series và Occurrence

| Phạm vi | Ý nghĩa | Yêu cầu |
|---|---|---|
| `This occurrence` | Chỉ lần được chọn | Tạo exception hoặc hủy occurrence, không đổi các lần khác |
| `This and following` | Từ lần này trở đi | Chia ranh giới chuỗi / cập nhật rule tương lai, giữ lịch sử trước |
| `Entire series` | Tác động chuỗi phù hợp | Xử lý exceptions minh bạch, xác nhận tác động rộng |

**Bắt buộc hỏi phạm vi** khi sửa/xóa một occurrence thuộc series. Hành vi default không được âm thầm chọn `Entire series`. Với lựa chọn `This and following`, các occurrence lịch sử và phản hồi đã diễn ra phải giữ được. Với `Entire series`, phải cho biết điều gì xảy ra với các exceptions/occurrences đã chỉnh riêng và những liên kết M03/M04; không tự làm mất dữ liệu ngoại lệ mà không cảnh báo.

## 9.3. Recur + Reminders + Participants

- Reminder được xác định bằng `(series/occurrence identity, recipient, reminder configuration)` để chống nhắc trùng; sau khi dời một occurrence, reminder mới phải dựa trên thời điểm occurrence mới.
- Attendance có thể theo series mặc định hoặc theo occurrence khi được mời cho lần đó; phản hồi một occurrence không tự làm người đó Going cho cả series trừ khi có hành động rõ.
- Event linked M03/M04 có thể không có hỗ trợ recurrence ở đối tượng nguồn; nếu sửa series trong M05, hợp đồng liên kết phải biết có đồng bộ được hay không. Không xóa dữ liệu nguồn vì cấu hình calendar recurrence khác.
- Một lần lặp đã huỷ (`Cancelled occurrence`) không tự tái xuất hiện do rebuild view hoặc cache.
- Nếu khôi phục Series từ Trash, phải tái lập đủ rule + exceptions + quyền + reminders phù hợp mà không gửi lại thông báo quá hạn hoặc tạo trùng.

## 9.4. Các ca múi giờ

- Recurring event lúc 19:00 trong một múi giờ áp dụng DST vẫn xảy ra vào **19:00 giờ địa phương**, dù UTC offset đổi theo mùa.
- Với giờ không tồn tại do DST, yêu cầu người tạo chọn hành vi hợp lệ khi trường hợp xảy ra; không tự ý đổi giờ.
- Với giờ lặp do DST, không tạo hai occurrence không mong muốn cho một ngày do trùng wall-clock hour.
- M05 phải duy trì nhất quán giữa Preview, Calendar Views, Agenda, conflict checker và Reminders cho cùng occurrence.

---

# 10. CC-11: Reminder Settings

## 10.1. Kênh và thời điểm

**P0:** In-app Notification Center của Our Space, không mặc định cần OS push khi app đóng. **P1:** Email, Browser/Device Push khi điều kiện kỹ thuật và quyền thiết bị cho phép. SMS không thuộc V1.0.

**Mốc cấu hình khởi đầu:** at event time, 10 minutes, 1 hour, 1 day, 7 days, custom offset; có thể nhiều mốc/Event. Đề xuất bộ preset dễ dùng, không đóng cứng phạm vi lựa chọn nếu chưa xác định cấu hình kỹ thuật.

**Reminder theo người:** A và B có lịch nhắc riêng cho cùng Event. Không tự copy lịch nhắc của A sang B, trừ một default shared reminder được mô tả rõ và người nhận được quyền lựa chọn.

## 10.2. Hành vi một Reminder

1. Khi người dùng lưu reminder, hệ thống xác thực Event/occurrence còn tồn tại, quyền xem, kênh hỗ trợ, recipient hợp lệ và thời điểm nhắc.
2. Ghi cấu hình đúng người nhận, gắn với Event hoặc Series theo thiết kế nghiệp vụ.
3. Khi đến hạn, xử lý **đúng một notification logic** cho khóa identity của reminder occurrence và recipient; retry không nhân đôi.
4. Nếu Event bị dời/hủy/xóa, quyền bị thu hồi hoặc occurrence bị skip, những nhắc **chưa gửi** phải được cập nhật/vô hiệu.
5. Trạng thái `scheduled`, `pending`, `processed`, `failed`, `cancelled` hoặc tương đương thể hiện chính xác kết quả hệ thống biết; **đã xử lý ≠ đã hiện lên thiết bị ≠ đã đọc**.
6. Với in-app, khi người dùng vào Notification Center, chỉ hiển thị thông tin họ còn quyền xem tại thời điểm truy cập; khi quyền thay đổi, cache/preview cũng phải được bảo vệ.

## 10.3. Quiet Hours

- Cấu hình của **từng tài khoản**: bật/tắt, khoảng giờ địa phương, timezone quy chiếu và chính sách xử lý.
- Quiet hours áp dụng kênh gửi chủ động tương ứng (P0 nếu in-app có cơ chế bật thông báo chủ động trong hệ thống; Email/Push khi P1 được làm). Không ngăn bản ghi reminder được đưa vào Notification Center nếu quy tắc nghiệp vụ yêu cầu giữ lịch sử.
- Khi một reminder chạm quiet hours, giải pháp phải thông báo rõ `defer until permitted` hoặc `skip if stale` theo chính sách cấu hình; **chi tiết ngưỡng hết giá trị** là tham số TBD, không tự đặt con số bất kỳ.
- Event time đang diễn ra hoặc đã qua cần xử lý quá hạn hợp lý; không bắn dồn thông báo cũ sau khi mở app/trở lại mạng.

## 10.4. Riêng tư và scheduled reveal

- Không gửi tên/địa chỉ/content Event mà recipient không được phép xem.
- Ngày kỷ niệm Shared **không cho phép** gửi trước nội dung bí mật M08.
- Người nhận mất quyền trước giờ gửi → huỷ delivery hoặc giảm nội dung theo quyền nếu phù hợp và được cho phép.
- Không quảng cáo hoặc truyền bất kỳ nội dung nhạy cảm sang kênh ngoài khi chủ sở hữu chưa cấu hình.

---

# 11. CC-12: Upcoming & Conflict Detection

## 11.1. Upcoming

- Danh sách Event Confirmed/Tentative sắp đến theo timezone hiển thị và quyền.
- Nhóm theo Today/Tomorrow/This Week/Upcoming; không tự hiển thị Cancelled/Trashed trừ filter lịch sử.
- Với recurring event, hiện occurrence cụ thể tương ứng.
- Với sự kiện được liên kết M03/M04, có nút Open Source khi quyền cho phép; không hiển thị Place Private chỉ vì Event Shared.
- Có trang riêng cho Invitation chưa phản hồi, Anniversary gần tới, reminders sắp đến; có thể hợp nhất bằng tab/filter.

## 11.2. Conflict Checking

**Thuật toán nghiệp vụ:** so sánh các khoảng timed events thực sự giao nhau trên cùng trục thời gian sau khi xét timezone; không chỉ so sánh start time. Nếu một all-day Event có ý nghĩa `free`/informational, không tự coi nó chặn cả ngày; M05 có thể bổ sung thuộc tính `availability` (Busy/Free) do người dùng chọn để tránh hiểu sai.

- Khi tạo/chỉnh Event, hiển thị cảnh báo và số xung đột **chỉ trong phạm vi có quyền**.
- Với lịch riêng, chỉ tính Busy/Free nếu chủ sở hữu đã chủ động bật; **default OFF**.
- Cảnh báo có thể nhắc “Khoảng thời gian không phù hợp” chỉ khi người nhận được quyền thấy busy information; tuyệt đối không hiển thị tên, địa điểm, ghi chú, số cụ thể của Event Private nếu vượt quyền.
- Người dùng có thể chọn `Keep Both`/xác nhận lưu trùng lịch; không mặc định khóa lưu.
- Sau khi đổi thời gian/occurrence, tính lại xung đột và reminders.
- Không suy ra giờ mở cửa quán, giờ xuất phát hoặc ETA từ dữ liệu không có nguồn; M05 không phải công cụ navigation.

## 11.3. Tình huống tính xung đột

| Tình huống | Hành vi |
|---|---|
| 19:00–21:00 và 20:00–22:00 | Cảnh báo nếu hợp lệ theo quyền |
| 19:00–20:00 và 20:00–21:00 | Không mặc định coi giao nhau nếu đúng chạm biên và không có buffer |
| All-day anniversary, ngày có buổi hẹn | Không mặc định là xung đột nghiêm trọng nếu Event availability = Free |
| Lịch Private A vs Event Shared do B tạo | Không báo bí mật nếu A chưa chia sẻ Busy/Free |
| Overnight event vs sáng hôm sau | So sánh thời điểm tuyệt đối chính xác |
| Event Cancelled / Trashed | Không tính là Busy hoạt động |
| Recurring exception được dời | Dùng occurrence mới, không tính cả bản cũ |

---

# 12. CC-13: Linked Events và đồng bộ xuyên phân hệ

## 12.1. Nguyên tắc nguồn dữ liệu chính thức

**M05 sở hữu Calendar Event và biểu diễn thời gian khi đã liên kết.** M03 sở hữu Place/Date Plan/Visit, M04 sở hữu Trip/Itinerary Activity/Booking, M06 sở hữu Goal/Deadline, M08 sở hữu Special Moment/Reveal; các mô-đun không tạo Event M05 độc lập rồi giữ một bản sao giờ riêng không đồng bộ.

**Trước khi liên kết:** M03 Date Plan hoặc M04 Activity có thể có ngày/giờ dự kiến để lên kế hoạch. **Tại thời điểm link:** cần xác nhận mapping, timezone, permission, event identity. **Sau khi link:** Event M05 là nguồn thời gian lịch; phân hệ nguồn có thể giữ bản snapshot phục vụ lịch sử, nhưng UI thông tin hiện hành đọc đồng bộ từ Event liên kết hoặc hiển thị trạng thái chưa đồng bộ rõ ràng.

**Không phải tất cả Activity của Trip đều lên Couple Calendar tự động.** Người dùng chọn những hoạt động cần hiển thị; có thể tạo Event tổng quan Trip và các Event Activity khác mục đích, không coi là trùng.

## 12.2. Hợp đồng liên kết nghiệp vụ dùng chung

Một liên kết Event–đối tượng nguồn cần nhận biết:
- `source_module`, `source_entity_type`, `source_entity_id` và **purpose** (ví dụ `DATE_PLAN_SCHEDULE`, `TRIP_ACTIVITY_SCHEDULE`, `TRIP_SUMMARY`, `GOAL_DEADLINE`, `SPECIAL_MOMENT_DATE`).
- `calendar_event_id` duy nhất tương ứng với chức năng của liên kết khi quy tắc 1:1 được áp dụng; không dùng title/date để làm identity.
- `link_status`: linked/pending-sync/conflict/unavailable/removed hoặc trạng thái tương đương.
- `last_confirmed_revision`/thời điểm sync; tác nhân đổi, dữ liệu tác động và kết quả, để tránh vòng lặp M03→M05→M03 vô hạn.
- `permissions`: quyền xem/sửa Event độc lập với quyền nguồn; không suy ra toàn quyền từ việc biết ID.
- `safe_display`: nguồn không được phép xem → hide hoặc placeholder, không lộ tên qua thumbnail/search/notification/export.

**Idempotency:** thao tác tạo/đồng bộ được gửi lại do retry không được tạo Event thứ hai cùng vai trò cho cùng đối tượng nguồn. Hai Event khác mục đích (Trip Summary và Activity) là hợp lệ, phải có purpose riêng.

**Conflict:** nếu A sửa Event trong M05 và B sửa Date Plan/Activity cùng một trường từ phiên bản cũ, hệ thống phải phát hiện conflict và quyết định thông qua quy tắc hoặc người dùng, không im lặng “last write wins” cả bản ghi.

## 12.3. M03 — Food & Places (Date Plan)

| Tác động | Hành vi chính thức |
|---|---|
| Tạo Date Plan chưa có ngày | Không bắt buộc tạo Calendar Event giả |
| Có ngày/giờ và chọn Add to Calendar | Tạo/link Event (cần consent share nếu Event Shared) |
| Sửa giờ từ M03 | Thay đổi đúng Event liên kết; M05 xác nhận rồi M03 phản ánh |
| Sửa giờ từ M05 | M03 phản ánh thời gian Event; giữ tình trạng nghiệp vụ của Date Plan |
| Hủy Date Plan | Áp dụng quy tắc Cancelled/linked Event, không xóa Place/Wishlist |
| Hoàn thành Date Plan | Không tự tạo Visit; M03 cần xác nhận đã đi |
| Thu hồi quyền M03/M05 | Áp dụng quyền riêng tại từng miền; không tiết lộ Place Private |
| Retry thao tác Add to Calendar | Không tạo 2 Event cùng purpose |

## 12.4. M04 — Travel & Trip Planner

| Tác động | Hành vi chính thức |
|---|---|
| Trip ở Dreaming, chưa có ngày | Không tạo Event có ngày giả |
| Activity có thời gian, người dùng chọn đưa lên Calendar | Một linked Event cho Activity và purpose tương ứng |
| Trip Summary | Có thể là một Event nhiều ngày khác purpose với Activity Events |
| Dời ngày/giờ Activity | M05 cập nhật đúng Event; xử lý timezone và conflict |
| Dời cả Trip | M04 cảnh báo tác động, chỉ cập nhật phần được xác nhận |
| Booking đã đặt | Không sửa dữ liệu nhà cung cấp/chứng nhận booking chỉ vì Event đổi |
| Activity Completed/Skipped | M04 sở hữu status; M05 không tự tạo Visit M03 |
| Delete Activity hoặc Trip | Xử lý link/Cancel Event theo quyền, không xóa chuyền data M02/M03/M07 |

## 12.5. M06 — Goals (phụ thuộc BRD sau)

- M06 sở hữu Goal và milestone/deadline; người dùng **chọn** đưa deadline/milestone lên Calendar.
- Không tự tạo Event cho mọi Goal không có ngày. Goal Completed khác Event Completed.
- Quyền Event không làm lộ chi tiết mục tiêu Private.
- Mapping cụ thể của milestones phải chốt trong M06 BRD, tránh suy đoán khi Codex triển khai.

## 12.6. M08 — Special Moments (phụ thuộc BRD sau)

- M08 sở hữu nội dung cảm xúc, Letter, Time Capsule và Scheduled Reveal.
- M05 quản lý ngày/lời nhắc nhưng **không mở sớm nội dung**.
- Nếu Anniversary Shared liên kết capsule chưa reveal, M05 có thể hiển thị Anniversary hợp lệ nhưng **không** hiển thị title/preview/capsule metadata chưa được phép.
- Các quy tắc tiết lộ sau thời điểm mở sẽ chi tiết hóa trong M08 BRD.

## 12.7. M01/M02 — Diary, Photobook, Media

- Event có thể gắn ảnh/video từ M02 hoặc Diary/Photobook từ M01; lưu **reference**, không nhân bản file gốc.
- Nếu thumbnail/Diary/Book có quyền hẹp hơn Event, người xem Event không được xem tài nguyên bị hạn chế; giữ giao diện hợp lệ bằng placeholder nếu cần.
- Event Delete/Trash không xóa file gốc, Diary hoặc Photobook; ảnh gốc bị xóa/khôi phục theo M02.

## 12.8. M07/M09/M10 — các phụ thuộc mở

- M07: không phải nguồn giờ; Expense không thuộc M05 trừ khi có liên kết cần thiết được duyệt sau.
- M09: comments/reactions gắn Event theo quyền; M05 không tự tạo dịch vụ nhắn tin độc lập.
- M10: Notification Center, privacy, timezone preferences, user settings và authorization chung. Bất kỳ lựa chọn chi tiết nào của M05 phải nhất quán với M10 khi chốt; xung đột đưa vào danh mục change request.

---

# 13. CC-14–CC-17: Search, Permissions, Settings, History/Trash/Export

## 13.1. CC-14 — Search & Filters

**Tìm theo:** Title, date range, Calendar, category, participant, status, recurrence, Place/Location (khi có quyền), linked module (M03/M04/M06/M08), reminder, creator. Các filter kết hợp đồng thời. Kết quả search cho Series hiển thị occurrence trong date range; không sinh vô hạn hoặc bỏ exception.

**Quy tắc:** filter quyền thực thi trước khi phát nội dung và thống kê; không lộ Event qua auto-complete, số kết quả, link preview, fallback hay metadata. Kết quả từ link M03/M04 chỉ có tên nguồn nếu có quyền nguồn.

**UI:** search input, filter chips, calendar/date selectors, clear all, empty state, loading, detail navigation; mobile filter mở sheet thay vì sidebar cố định.

## 13.2. CC-15 — Participants & Permissions

**Actions:** `Invite A/B`, `Change Attendee Status`, `Remove Participant`, `Change Role`, `Set Shared/Private`, `See Permission Summary`, `Share event`, `Revoke Access`; điều khiển tương ứng vai trò và chính sách quyền; có xác nhận khi thu hồi quyền hoặc chuyển từ Private sang Shared.

| Role | Read | Edit time/details | Comment | RSVP nếu được mời | Manage share | Permanent delete |
|---|---|---|---|---|---|---|
| Owner | Có | Có | Có | Có | Có | Theo quy trình có xác nhận |
| Editor | Có | Có | Có | Có | Chỉ khi được ủy quyền | Không mặc định |
| Commenter | Có | Không | Có | Có | Không | Không |
| Viewer | Có | Không | Không | Có | Không | Không |
| No Access | Không | Không | Không | Không | Không | Không |

**Lưu ý:** quyền RSVP là quyền trả lời một lời mời đối với tài khoản của chính mình, không đồng nghĩa quyền sửa Event. Attendance do người khác không được tự thay đổi thay họ trừ luồng quản trị được định nghĩa riêng. Mô hình P0 là hai tài khoản; khách ngoài không bắt buộc.

## 13.3. CC-16 — Calendar Preferences

| Preference | Tùy chọn | Hệ quả |
|---|---|---|
| Week starts | Monday / Sunday | Chỉ đổi layout |
| Time format | 12h / 24h | Chỉ đổi hiển thị |
| Display timezone | Múi giờ người dùng chọn | Không tự đổi instant gốc |
| Default view | Month / Week / Day / Agenda | Mở vào view đã chọn |
| Visible calendars | Chọn lịch đang hiển thị | Không đổi quyền hoặc xóa Event |
| Default reminders | Tùy chọn mức mặc định cá nhân | Không áp dụng bắt buộc cho người kia |
| Quiet hours | Bật/tắt, giờ, timezone, policy | Chỉ tác động kênh chủ động hợp lệ |
| Busy/Free sharing | OFF mặc định | Quyền chia sẻ chỉ bận/rảnh riêng |
| Anniversary display | Hiện/ẩn counter hoặc các thông số khác | Không đổi ngày gốc |

## 13.4. CC-17 — History, Trash & Export

### History

Ghi ít nhất các thay đổi quan trọng: tạo Event, đổi ngày/giờ/timezone, trạng thái, participant/RSVP, quyền, recurrence/exception, cancellation, liên kết M03/M04, Trash/Restore. History phải có tác nhân, thời điểm được hệ thống xác nhận, loại thay đổi và ngữ cảnh đủ giải thích; không cần lưu mỗi ký tự nhập trong form. Không cho xem log tiết lộ dữ liệu từng private Event nếu không có quyền hiện hành phù hợp.

### Trash và Restore — 30 ngày

- `Cancelled` giữ Event ở lịch sử theo bộ lọc; `Trashed` ẩn khỏi các view hoạt động và ngừng lời nhắc.
- Xóa Event độc lập/Occurrence/Series phải hỏi đúng phạm vi; log ai xóa và thời hạn 30 ngày.
- Trong hạn, người có quyền Restore khôi phục Event/Series/Exception cùng quyền hợp lệ; xử lý những liên kết nguồn đã bị xóa/hết quyền.
- Không phát lại reminder quá hạn khi Restore; reminder tương lai được tính lại hợp lệ và không trùng.
- Permanent Delete sau kiểm tra liên kết và chính sách lưu giữ; không xóa dữ liệu gốc M01–M04/M06/M08.
- Khi hết 30 ngày: quy trình dọn theo retention và phụ thuộc, không tự xóa vật lý dữ liệu chung của phân hệ khác.

### Export P0

- Xuất theo khoảng ngày, calendar, loại và quyền; structured machine-readable với timezone, all-day date, Event stable IDs hoặc external reference an toàn, recurrence/exception, trạng thái, participant trong phạm vi được phép, link an toàn và metadata cần thiết.
- Export của người dùng **không bao gồm Event Private của người khác**, attachment Private hoặc secret metadata; quyền tải xuống của tài nguyên liên kết vẫn độc lập.
- Gói export đủ rõ để tái đọc hoặc dùng trong quy trình backup/di chuyển dữ liệu; loại/format cụ thể thuộc technical design. `.ics` tương thích dịch vụ ngoài = P1.
- Export không thay thế backup/restore toàn hệ thống. Backup M05 cần gồm recurrence rules, exceptions, reminders configs, permissions, links và Event IDs; phải thực hiện test restore.

---

# 14. Vai trò, phân quyền và bảo mật

## 14.1. Thứ tự kiểm tra quyền

1. **Authentication:** người dùng đã đăng nhập, ở đúng Our Space.
2. **Calendar access:** có quyền xem/sử dụng lịch liên quan, nếu quy tắc cần.
3. **Event access:** sự kiện có thể có quyền riêng và có thể **hạn chế hơn** lịch; không vì Event thuộc Our Calendar mà tự lộ hết chi tiết.
4. **Action permission:** quyền riêng cho edit/share/delete/RSVP/reminders của chính người xem.
5. **Linked resource permission:** phải kiểm tra tiếp quyền M01/M02/M03/M04/M06/M08 với thumbnail, metadata và file.
6. **Delivery permission:** mỗi lần gửi notification phải kiểm tra lại quyền hiện hành của recipient; xóa quyền thì ngừng nhắc tương lai.
7. **Query leakage:** search count, calendar dots, busy/free, previews, exports, statistics không chứa hoặc ngầm tiết lộ Event ngoài quyền.

## 14.2. Chuyển Private ↔ Shared

- Tạo Event từ My Calendar: Private mặc định.
- Người dùng chọn Our Calendar hoặc thêm B vào Event: có xác nhận cụ thể việc chia sẻ cùng phạm vi nội dung (title/time/location/attachments).
- Private Event chứa ảnh M02/Diary M01: chuyển Shared không tự nâng quyền của tài nguyên nguồn; có thể share bản sao/giữ placeholder khi hợp lệ theo BRD nguồn.
- Chuyển Shared → Private hoặc revoke B: ngắt khả năng xem/sửa Event của B theo quyền mới; reminder tương lai của B phải hủy; B đang mở tab sẽ không lưu thao tác tiếp.
- Busy/Free bật riêng và có thể tắt ngay; việc dùng kết quả cache trong conflict checker phải tuân thủ quyền mới.

## 14.3. Rủi ro cần kiểm thử bảo mật

- Truy cập URL/Event ID trực tiếp với quyền No Access.
- Tìm kiếm riêng tư qua autocomplete/đếm số Event.
- Preview notification xuất hiện sau khi quyền bị thu hồi.
- Invitation dựa trên lịch Private có tiêu đề bị lộ.
- Export chứa occurrence của Private Series bị lọt.
- Conflicts phát hiện lịch bí mật và khiến người kia suy ra giờ bận dù Busy/Free OFF.
- Ảnh riêng tư trong Event Shared bị lộ qua thumbnail CDN/cache hoặc alt/title.
- Time Capsule chưa reveal hiện trong anniversary card và reminder.
- Thay đổi quyền từ một tab nhưng tab thứ hai còn edit.
- Event có Calendar Shared nhưng Event Permission hạn chế hơn.

**Bảo vệ không chỉ ở UI:** server/data access phải thi hành kiểm tra cho mọi điểm truy cập và yêu cầu đồng bộ, gồm tài nguyên đã tạo trước khi thu hồi quyền; không cam kết ngăn mọi ảnh chụp màn hình/đọc dữ liệu đã thực sự tải về trên thiết bị ngoài quyền kiểm soát.

---

# 15. Trạng thái, xung đột dữ liệu, tự lưu và đồng bộ

## 15.1. Event lifecycle

```text
Create (Private by default)
    ├── Tentative ──> Confirmed ──> Completed (explicit)
    ├── Cancelled (explicit, reversible per permission)
    └── Trash (soft delete, 30 days) ──> Restore / Retention Delete
```

- Không tự Completed khi thời gian kết thúc qua.
- Cancelled không đồng nghĩa xóa, có thể xem trong History hoặc filter; không tiếp tục gửi nhắc của Event cancelled.
- Trashed khác Cancelled; không xuất hiện trong lịch active hoặc search thông thường.
- Completed có thể tiếp tục liên kết kỷ niệm hoặc note; không tự coi Visit đã xảy ra ở M03.
- Với recurring Event, thay đổi trạng thái một occurrence có thể không tác động Series còn lại; yêu cầu chọn phạm vi.

## 15.2. RSVP lifecycle

`No Response → Going / Maybe / Not Going`, có thể thay đổi phản hồi khi còn hợp lệ và có quyền. Người được mời không tự biến thành người có quyền edit. Chủ Event có thể xem phản hồi theo quyền; người khác không được sửa hộ khi chưa có luồng ủy quyền.

## 15.3. Save/Sync status

- **Draft in form:** người dùng chưa nhấn Save, dữ liệu có thể ở local state; tránh mất do đóng tab khi có thay đổi.
- **Saving:** thao tác đã gửi nhưng chưa được xác nhận; không báo đã lưu.
- **Saved in M05:** Calendar Event đã được xác nhận và phiên bản nhất quán.
- **Linked sync pending:** nếu đối tượng có M03/M04 link mà phía nguồn chưa xác nhận, phải có trạng thái riêng. Không tuyên bố “M03 đã cập nhật” khi mới lưu tại M05.
- **Conflict:** nhận ra dữ liệu người dùng sửa dựa trên phiên bản cũ; hiển thị các lựa chọn thích hợp, không âm thầm overwrite.
- **Offline:** hiển thị mất mạng, bảo vệ input chưa gửi khi có thể, không hứa chỉnh offline đầy đủ hoặc gửi nhắc OS nền trong P0.

## 15.4. Kịch bản cùng sửa

| Xung đột | Hành vi |
|---|---|
| A đổi Title, B đổi Start Time | Bảo toàn được cả hai nếu đều hợp lệ và độc lập |
| A đổi Start Time, B đổi Start Time từ bản cũ | Conflict có thể yêu cầu lựa chọn; không last-write-wins âm thầm |
| A Cancel Event, B đang sửa Description | B được cảnh báo trạng thái mới trước khi lưu |
| A thu hồi Editor, B vẫn mở form | Từ chối thao tác mới; không tuyên bố Saved |
| A sửa riêng occurrence, B sửa Series | Phải xác định phạm vi và chính sách ngoại lệ, không xóa riêng occurrence vô ý |
| A xóa Event, B sửa Event | Không hồi sinh Event ngoài quyền hoặc ghi đè thao tác xóa |
| Sync từ M03 và edit từ M05 cùng thay Time | Phát hiện conflict qua version/identity; không tạo vòng lặp sync |
| A thêm Reminder cá nhân, B sửa Reminder cá nhân | Hai cấu hình riêng, không ghi đè nhau |

M05 **không cần live cursor** hoặc cùng gõ một text box thời gian thực như M01. Tuy nhiên, an toàn chỉnh sửa và nhất quán sau tải lại là P0, kể cả khi hai người làm trên nhiều thiết bị.

---

# 16. Các hành trình nghiệp vụ end-to-end

## 16.1. Journey A — Buổi hẹn từ M03 sang lịch và kỷ niệm

`M03: Place → Date Plan có ngày giờ → Confirm Add to Calendar → M05: Event/Participant/Reminder → Reschedule ở M05 ↔ đồng bộ M03 → Ngày diễn ra → xác nhận Visit ở M03 → Media M02 → Diary M01 → Timeline/Photobook`.

**Điểm kiểm tra:** Không cần nhập lại Place, Date Plan không tự Completed, Event có một ID theo purpose, lời nhắc khi đổi giờ được cập nhật, quyền ảnh riêng không tự mở, không tạo Visit khi chưa xác nhận.

## 16.2. Journey B — Hoạt động du lịch

`M04: Trip / Activity → lựa chọn Add to Couple Calendar → M05: linked Activity Event → Trip dời ngày có kiểm tra booking → Calendar đổi giờ được ghi rõ → M04 xác nhận Activity thực hiện → M03 tạo Visit nếu được xác nhận → M01 Travel Photobook`.

**Điểm kiểm tra:** Trip Summary và Activity Event có purpose khác nhau nên hợp lệ; Calendar không tự sửa vé máy bay/khách sạn đã đặt; timezone chính xác với hành trình quốc tế.

## 16.3. Journey C — Kỷ niệm và nội dung bí mật

`CC-09: nhập original date 29/02 → chọn năm không nhuận mặc định 28/02 → cấu hình nhiều Reminder A/B → liên kết M08 Time Capsule → Notification đến hạn → chỉ tiết lộ nội dung được phép → sau reveal có thể mở M08`.

**Điểm kiểm tra:** original date không đổi; days counter không sai năm nhuận; không lộ nội dung capsule qua search/calendar/reminders.

## 16.4. Journey D — Lịch riêng và kiểm tra trùng

`A: Private Event 19:00–21:00, Busy/Free OFF → B tạo Shared Date 20:00–22:00 → B không biết A có Private Event → A chủ động bật Busy/Free theo phạm vi → conflict checker có thể hiển thị busy window cho B mà không tiết lộ chi tiết`.

**Điểm kiểm tra:** không suy ra Private data từ các thông báo/đếm số/chỉ thị lịch.

---
# 17. 20 Use Cases chi tiết

**Quy ước:** mỗi Use Case có mục tiêu, tiền điều kiện, luồng chính, nhánh lỗi/quyền và hậu điều kiện; các màn hình liên quan theo CC IDs. Use Case không tương đương một endpoint hay một bảng dữ liệu.

## UC-M05-01 — Create Personal Event

- **Actor / màn hình:** User A, CC-01/02/06.
- **Tiền điều kiện:** A đăng nhập, có My Calendar, quyền tạo Event.
- **Main flow:** (1) A chọn một ngày trong Month View; (2) nhấn Create Event; (3) nhập tên và Category Personal; (4) chọn all-day hoặc timed + timezone; (5) giữ Visibility Private; (6) Save; (7) mở Event Detail từ calendar.
- **Expected:** Event mới thuộc quyền A, có Event ID ổn định; B không thấy tên, thời gian, số lượng, location hoặc URL thông tin; A có thể sửa/khôi phục theo quyền.
- **Alternate/error:** thiếu title/ngày, time range sai, mất kết nối hoặc quyền hết hạn → không báo Saved; giữ input để người dùng sửa và retry hợp lệ.

## UC-M05-02 — Create Shared Event

- **Actors:** A và B, CC-06/07/08/15.
- **Preconditions:** hai tài khoản tồn tại, A được tạo/chia sẻ Event.
- **Main flow:** A tạo “Our Dinner Date” 19:00–21:00, chọn Our Calendar/chia sẻ B, xác nhận dữ liệu nào được chia sẻ và lưu; M05 lưu quyền; B nhìn thấy Event trong lịch và có thể mở Event Detail theo quyền.
- **Expected:** chỉ một Event; A và B có thể xem dữ liệu đã chia sẻ, không tự mở quyền media/private attachments có liên kết.
- **Alternate:** thao tác chia sẻ bị từ chối hoặc thất bại → không hiển thị B đã được chia sẻ; nếu người dùng hủy xác nhận share, giữ Private hoặc quay về lựa chọn trước.

## UC-M05-03 — Invite Participant

- **Actors:** A mời B, CC-07/15.
- **Main flow:** A mở Event Detail → `Invite` → chọn tài khoản B → gửi lời mời trong không gian chung → B nhận invitation hiển thị thông tin trong quyền hợp lệ → trạng thái ban đầu No Response.
- **Expected:** mời B không tự đặt Going, không tự cấp Editor nếu chưa chọn; mỗi Event–Participant có một relationship hợp lệ.
- **Alternate:** A không có quyền mời, B đã được mời hoặc Event Cancelled → cảnh báo, không tạo invitations trùng hoặc vượt quyền.

## UC-M05-04 — Respond to Event

- **Actor:** B được mời, CC-07/15.
- **Main flow:** B mở invitation → chọn Going, Maybe hoặc Not Going → lưu trạng thái của chính B → A thấy trạng thái phản hồi khi có quyền.
- **Expected:** B có thể đổi phản hồi hợp lệ; Event không tự xóa/hủy khi B chọn Not Going; B không sửa status của A.
- **Alternate:** lời mời bị rút, Event bị xóa/hết quyền → vô hiệu hóa RSVP và thông báo phù hợp.

## UC-M05-05 — Reschedule Event

- **Actors:** A editor, B participant, CC-06/07/11/12/13.
- **Main flow:** A mở Event 19:00 → đổi 20:00 đúng timezone → kiểm tra xung đột → A xác nhận (kể cả giữ trùng lịch khi được phép) → hệ thống lưu cùng Event ID → tính lại Reminder chưa gửi → nếu có Date Plan/Activity liên kết thì cập nhật đúng một đối tượng nguồn/ghi sync pending nếu chưa xong → B thấy giờ mới.
- **Expected:** không sinh Event mới, không gửi reminder theo giờ cũ khi đã được vô hiệu, không tuyên bố Booking ngoài hệ thống đã đổi thành công.
- **Alternate:** cùng lúc có editor khác sửa Time hoặc nguồn M03/M04 sửa Time → conflict; Save status nêu rõ.

## UC-M05-06 — Create Anniversary

- **Actor:** A, CC-09/10/11.
- **Main flow:** A tạo Anniversary, đặt original date, chọn share hoặc Private, chọn yearly rule, Feb 29 option nếu liên quan và reminders; lưu → Anniversary có occurrence trong Calendar; có thể liên kết Special Moment M08.
- **Expected:** original date không bị mất, số năm đúng, reminder theo từng account, M08 không tự lộ nội dung bí mật.
- **Alternate:** original date không tồn tại, quyền chia sẻ bị từ chối, linked M08 không đủ quyền → báo lỗi/ẩn nội dung tương ứng; không tạo ngày giả.

## UC-M05-07 — View Days Together

- **Actor:** A hoặc B có quyền, CC-09.
- **Main flow:** mở Anniversary gốc → xem `Days elapsed` theo reference timezone → chuyển cách nhìn `Ngày thứ N` nếu đã chọn → xem lần kỷ niệm tới và số năm.
- **Expected:** ngày gốc tính 0 cho elapsed/1 cho ordinal; năm nhuận chính xác; thay display timezone không sửa original date; người chưa có quyền không thấy counter private.
- **Alternate:** date in future → hiển thị countdown thay vì số ngày bên nhau âm.

## UC-M05-08 — Create Recurring Event

- **Actor:** A, CC-06/10.
- **Main flow:** A tạo Event “Weekly Date”, chọn Weekly Saturday 10:00 trong timezone, chọn `No End` hoặc end/count, xem preview occurrences, lưu Series → Week/Month/Agenda hiển thị occurrence thuộc phạm vi tương ứng.
- **Expected:** không tạo bản vô hạn; những lần sinh nhất quán giữa View và Reminders; Event/Series có danh tính ổn định.
- **Alternate:** rule không hợp lệ, ambiguous DST/local time, không đủ quyền → báo rõ; không âm thầm chuyển giờ.

## UC-M05-09 — Edit Single Occurrence

- **Actor:** A, CC-07/10.
- **Main flow:** chọn Saturday occurrence của Weekly Date → đổi 10:00 thành 15:00 → scope `This occurrence` → xác nhận → lưu Exception → xem tuần đó lúc 15:00, các tuần khác vẫn 10:00.
- **Expected:** chỉ occurrence mục tiêu đổi; reminder tương ứng được tính lại; exceptions còn sau khi reload.
- **Alternate:** occurrence bị người khác Cancelled hoặc Series được sửa trong lúc thao tác → conflict/scope review, không hồi sinh ngoài ý muốn.

## UC-M05-10 — Edit Future Occurrences

- **Actor:** Owner/Editor theo quyền, CC-10.
- **Main flow:** chọn một occurrence trong Series → sửa rule/giờ → chọn `This and following` → xem preview phạm vi ảnh hưởng → xác nhận → lịch sử trước mốc được giữ; future occurrences tuân theo rule mới và exceptions được xử lý có thông báo.
- **Expected:** những lần đã qua không bị đổi; không nhân đôi các kỳ ở ranh giới; RSVP/reminder/linked content của occurrence cũ được bảo vệ theo chính sách.
- **Alternate:** có future exceptions có thể bị ảnh hưởng → bắt buộc cảnh báo và phương án xử lý rõ, không xóa lặng lẽ.

## UC-M05-11 — Configure Reminders

- **Actors:** A/B, CC-11.
- **Main flow:** A chọn reminder 1 day before; B chọn 1 hour before cho cùng Event; hệ thống lưu hai Config riêng; khi đến các mốc, in-app Notification Center hiển thị cho đúng tài khoản trong quyền hợp lệ; khi Event dời/hủy, nhắc tương lai được cập nhật/hủy.
- **Expected:** không ghi đè Config của nhau, không phát duplicate do retry; Delivery status thể hiện đúng `processed` vs `read`.
- **Alternate:** recipient mất quyền, quiet hours, Event cancelled, một reminder đã quá hạn → xử lý theo quyền và chính sách, không gửi dữ liệu bí mật.

## UC-M05-12 — Detect Scheduling Conflict

- **Actors:** A/B, CC-06/12/16.
- **Main flow:** A có Private Event 19:00–21:00 và Busy/Free OFF; B tạo Shared Event 20:00–22:00 → B không nhận bất kỳ thông tin nào suy lộ private A; A có thể bật Busy/Free theo phạm vi → B lúc đó nhận cảnh báo khung bận không có title/location.
- **Expected:** conflict checker kiểm tra đúng overlap timezone, không bắt buộc chặn save, đảm bảo privacy even in search/summary.
- **Alternate:** overlapping all-day informational/Free Event → không coi là conflict cứng; event cancelled không tham gia busy interval.

## UC-M05-13 — Link M03 Date Plan

- **Actors:** M03, M05, A/B.
- **Main flow:** A tạo Date Plan có thời gian tại Place M03 → chọn Add to Calendar → xác nhận visibility/participants → tạo hoặc tra được Event tương ứng theo `(source M03, Date Plan ID, purpose)` → đổi giờ ở M05 → M03 hiển thị giờ mới sau sync confirmation.
- **Expected:** một nguồn lịch M05, một Date Plan nguồn M03; retry không nhân đôi; Place/Visit không bị sao chép/xóa; quyền liên kết kiểm tra riêng.
- **Alternate:** không sync được → link pending/error, người dùng nhìn thấy tình trạng, có retry an toàn.

## UC-M05-14 — Link M04 Activity

- **Actors:** M04, M05, A/B.
- **Main flow:** A chọn Activity có ngày giờ thuộc M04 Trip → `Add to Calendar` → tạo Event có purpose Activity Schedule → mở từ M05 dẫn về Activity → đổi giờ M04 và xác nhận cập nhật M05; Booking nếu có vẫn giữ trạng thái nhà cung cấp.
- **Expected:** không sinh 2 Event cho 1 Activity/purpose; không tự hoàn thành Activity/Visit hoặc đổi vé.
- **Alternate:** Activity chưa có ngày/giờ → yêu cầu bổ sung trước; M04 mất quyền → M05 không lộ dữ liệu nguồn.

## UC-M05-15 — Link M08 Special Moment

- **Actors:** A/B, M08, M05, CC-09/13.
- **Main flow:** A liên kết một Anniversary với Special Moment được phép; M05 hiển thị mốc ngày và reminder; nếu Special Moment là Time Capsule Scheduled Reveal chưa mở, M05 chỉ hiển thị dữ liệu allowed (có thể chỉ Anniversary), đến thời điểm mở mới cho xem nội dung do M08 xác thực.
- **Expected:** không tiết lộ premature reveal qua link text, preview, notification hoặc search; không tự chuyển content owner.
- **Alternate:** thời điểm reveal đổi, quyền bị thu hồi → linked preview/reminder cập nhật theo rule M08, không tự lộ.

## UC-M05-16 — Change Event Permissions

- **Actors:** A owner, B editor, CC-15.
- **Main flow:** B đang mở Event Editor; A thu hồi Editor/đổi B thành Viewer → hệ thống xác nhận → thao tác sửa mới của B bị từ chối; B được thông báo trạng thái quyền; reminder/lịch được điều chỉnh theo quyền còn lại.
- **Expected:** không thể chỉnh tiếp bằng tab cũ, không phát notification vượt quyền, không đánh dấu B Saved sai.
- **Alternate:** B có input chưa lưu → nếu bị từ chối lưu, hiển thị rõ nội dung chưa được áp dụng.

## UC-M05-17 — Search Calendar

- **Actor:** A, CC-14.
- **Main flow:** nhập từ khóa và date range, chọn Calendar/Category/Status/Linked Module → nhận Events/Occurrences trong quyền cho phép → mở Detail → trở lại search giữ filter.
- **Expected:** chính xác với recurrence/exceptions, không leak Event Private của B qua kết quả, count hoặc autocomplete.
- **Alternate:** không kết quả → empty state; quyền thu hồi khi đang xem → không hiện nội dung cached vượt quyền.

## UC-M05-18 — Cancel / Restore Event

- **Actor:** Owner/authorized Editor, CC-07/10/17.
- **Main flow:** chọn Cancel Event hoặc Move to Trash (phân biệt hai thao tác) → nếu recurring, chọn scope → khi Trash, tắt reminder hoạt động → trong 30 ngày chọn Restore → hệ thống khôi phục rule/exception/permissions hợp lệ, xem lại các link còn tồn tại.
- **Expected:** không xóa dữ liệu M03/M04/M01/M02/M08; không gửi reminder quá hạn; không tạo duplicate event.
- **Alternate:** hết 30 ngày hoặc quyền không đủ → không được Restore; link nguồn đã xóa → placeholder/cảnh báo.

## UC-M05-19 — Export Calendar Data

- **Actor:** A, CC-17.
- **Main flow:** chọn date range, calendar, bộ lọc → hệ thống kiểm tra quyền cho từng Event/Occurrence và linked asset → chuẩn bị structured export có timezone, recurrence, exceptions và trạng thái → tải gói khi hoàn tất.
- **Expected:** không có Private data của B hoặc attachment không có quyền download, có thể hiểu lại bằng công cụ thích hợp; không buộc export `.ics` ở P0.
- **Alternate:** export lỗi, tập dữ liệu quá lớn, một linked file không còn quyền → báo trạng thái, loại trừ dữ liệu không đủ quyền, không tự bỏ qua âm thầm.

## UC-M05-20 — Concurrent Event Updates

- **Actors:** A và B đều Editor, CC-06/07/13.
- **Main flow:** hai người mở Event cùng phiên bản → A sửa Title, B sửa Start Time → cập nhật độc lập được giữ; rồi cả hai sửa cùng Start Time từ phiên bản cũ → hệ thống phát hiện conflict, hiển thị lựa chọn xử lý hợp lệ → kết quả cuối nhất quán trên hai thiết bị và đồng bộ đối tượng M03/M04 nếu linked.
- **Expected:** không lost update, không infinite source-sync loop, trạng thái Saving/Saved/Conflict chính xác.
- **Alternate:** đang sửa thì B mất quyền hoặc Event bị Trash → mọi thao tác mới không hợp lệ bị từ chối.

---
# 18. 64 Business Rules — danh mục chuẩn

**Quy ước:** `BR-M05-NN` là ID chuẩn nghiệp vụ dùng để truy vết. Nội dung chi tiết/giải thích ở mục 4–17 phải nhất quán với danh mục dưới đây; danh mục này không được triển khai riêng lẻ khi bỏ qua bối cảnh privacy, timezone, permissions hoặc linked sync.

| ID | Business Rule bắt buộc | Nguồn quyết định/đối tượng |
|---|---|---|
| BR-M05-01 | Mỗi Event phải có tên và ngày bắt đầu hợp lệ. | D03, CC-06 |
| BR-M05-02 | Phân biệt All-day Event và Timed Event; không chuyển ngầm date-only thành midnight UTC. | D03, Time |
| BR-M05-03 | Timed Event có end phải kết thúc sau start theo thời điểm thực và timezone; hỗ trợ nhiều ngày hợp lệ. | CC-06 |
| BR-M05-04 | Không tạo Calendar Event giả cho Date Plan/Trip/Goal chưa có ngày cụ thể. | D19, Cross-module |
| BR-M05-05 | Event mới mặc định Private, chia sẻ chỉ sau hành động có chủ đích. | D02, Security |
| BR-M05-06 | Event ID ổn định dù thay giờ, ngày, trạng thái hoặc View. | Domain identity |
| BR-M05-07 | Đổi giờ/ngày/lịch không tự làm mất participants, reminder và link hợp lệ. | CC-06 |
| BR-M05-08 | Event từ M03/M04 được link vào Event chính thức tại M05, không tạo bản Event song song khi sửa/retry. | D19 |
| BR-M05-09 | Bật/tắt hiển thị My/Our Calendar chỉ đổi UI filter, không đổi dữ liệu/quyền. | D02, CC-08 |
| BR-M05-10 | Private Event không lộ thông tin qua Views, Search, Notification, URL, Export hoặc thống kê. | Security |
| BR-M05-11 | Shared Event có thể cùng hiển thị với Private Events mà người xem được phép truy cập, không làm Private thành Shared. | D02 |
| BR-M05-12 | Private→Shared phải được xác nhận rõ khi Event/attachment chứa thông tin riêng tư. | Security |
| BR-M05-13 | Anniversary giữ original date độc lập với những occurrence hằng năm. | D07 |
| BR-M05-14 | Anniversary tồn tại độc lập dù không có Diary/Photobook/Special Moment. | D07, M08 |
| BR-M05-15 | Chỉnh nội dung M08 không làm mất hoặc tự sửa Anniversary date tại M05. | D20 |
| BR-M05-16 | Days Together tính bằng ngày lịch theo reference timezone: days elapsed mặc định, có ordinal day; số năm theo lần anniversary. | D08 |
| BR-M05-17 | Anniversary gốc 29/02 mặc định 28/02 ở năm không nhuận; có option 01/03, không đổi original date. | D09 |
| BR-M05-18 | Không lộ hoặc mở Time Capsule/Scheduled Reveal chỉ vì đã link với Anniversary. | D20 |
| BR-M05-19 | Recurring Series và từng Occurrence có danh tính phân biệt; occurrence có thể có Exception. | D10 |
| BR-M05-20 | Sửa/xóa recurring Event phải hỗ trợ this occurrence / this-and-following / entire series. | D11 |
| BR-M05-21 | Sửa rule phải xử lý/cảnh báo exceptions đã tồn tại, không âm thầm ghi đè. | D11 |
| BR-M05-22 | Series không giới hạn kết thúc phải sinh occurrence theo phạm vi cần thiết, không tạo vô hạn. | D10 |
| BR-M05-23 | Occurrence/Series Cancelled hoặc Trashed không tiếp tục sinh reminder hợp lệ cho phần bị hủy. | D10/D13 |
| BR-M05-24 | Recurrence theo giờ địa phương, chính sách ngày 31 và DST phải nhất quán giữa Views/Reminder/Conflict. | D10/D12 |
| BR-M05-25 | Không gửi reminder cho tài khoản không còn quyền nhận biết Event/occurrence. | Security |
| BR-M05-26 | Notification không tiết lộ title/location/description của Event Private cho người ngoài quyền. | D14 |
| BR-M05-27 | Cùng một reminder config/recipient/occurrence không được tạo notification trùng vì retry. | D13 |
| BR-M05-28 | Khi Event đổi giờ/hủy, reminder chưa gửi phải được cập nhật hoặc hủy thích hợp. | D13 |
| BR-M05-29 | Thu hồi quyền phải vô hiệu reminder tương lai không còn hợp lệ. | Security |
| BR-M05-30 | Reminder có thể cấu hình theo từng tài khoản, không ghi đè hoặc gửi chéo người. | D15 |
| BR-M05-31 | Phân biệt reminder scheduled/processed/failed và delivered/read khi có dữ liệu; không khẳng định đã đọc khi chỉ xử lý. | D14 |
| BR-M05-32 | Reminder liên quan Scheduled Reveal chỉ hiển thị thông tin M08 cho phép tại thời điểm xử lý/xem. | D20 |
| BR-M05-33 | Conflict detection xét giao các khoảng thời gian hợp lệ, timezone, không chỉ start time. | D17 |
| BR-M05-34 | All-day Event có thể là Free/để nhớ; không mặc định chặn trọn ngày như timed Busy Event. | D17 |
| BR-M05-35 | Conflict detection không suy lộ nội dung/sự tồn tại lịch Private khi Busy/Free chưa cho phép. | D18 |
| BR-M05-36 | Cảnh báo lịch trùng không mặc định cấm người có quyền lưu Event. | D17 |
| BR-M05-37 | Thay thời gian hoặc recurring occurrence phải tính lại conflict và reminder liên quan. | D17/D13 |
| BR-M05-38 | Tạo link M03/M04 được retry phải idempotent theo source+purpose, không nhân Event trùng. | D19 |
| BR-M05-39 | Xung đột giờ sửa từ M05 và phân hệ nguồn phải được phát hiện/xử lý minh bạch. | D19 |
| BR-M05-40 | Đồng bộ thất bại không được báo cả hai phía Saved/Updated thành công. | D19 |
| BR-M05-41 | Xóa Event không tự động xóa Date Plan, Trip, Place, Diary hoặc Expense. | Cross-module |
| BR-M05-42 | Event permission và permission của content/link nguồn được kiểm tra độc lập. | Security |
| BR-M05-43 | Linked source bị xóa/hết quyền không làm Calendar lỗi hoặc lộ thông tin; có placeholder/hide. | Cross-module |
| BR-M05-44 | Source cần nhận biết đúng Event link/purpose hiện có để tránh duplicate. | D19 |
| BR-M05-45 | Event permission thi hành tại server/data access và UI, không chỉ ẩn action. | Security |
| BR-M05-46 | Private Event không lộ qua direct URL, notification, search hay cache không hợp lệ. | Security |
| BR-M05-47 | Thu hồi quyền có hiệu lực với mọi thao tác mới, kể cả từ tab đang mở. | Security |
| BR-M05-48 | Attendance được sửa bởi chính người tham gia, trừ luồng ủy quyền rõ ràng. | D06 |
| BR-M05-49 | Chia sẻ Event không tự nâng quyền media, file, Diary, linked documents. | M01/M02/M04 |
| BR-M05-50 | Event ở lịch chung vẫn có thể có quyền hạn chế; hiển thị theo Event permission thực tế. | D02 |
| BR-M05-51 | Event xóa mềm/hủy occurrence không tiếp tục phát sinh reminder cho phần không còn hoạt động. | Trash |
| BR-M05-52 | Restore Event không được tạo Event/Occurrence/Reminder duplicate. | Trash |
| BR-M05-53 | Xóa/khôi phục linked Event tuân thủ link policy, không tự xóa dữ liệu nguồn. | Cross-module |
| BR-M05-54 | Export chỉ gồm dữ liệu được phép xem/xuất, giữ timezone/recurrence cần thiết. | D21 |
| BR-M05-55 | Đổi display timezone/time format không làm đổi instant hoặc original date. | Time, CC-16 |
| BR-M05-56 | History, Trash, Export đều phải phân quyền, không tiết lộ dữ liệu Private. | Security |
| BR-M05-57 | Event identity ổn định qua các thao tác sửa/lịch/hiển thị. | Domain identity |
| BR-M05-58 | Link với một source+purpose chỉ tạo một Calendar Event chính thức, retry không nhân bản. | D19 |
| BR-M05-59 | Mỗi Occurrence có identity xác định dù được sinh động từ recurring rule. | Recurrence |
| BR-M05-60 | Sửa một Occurrence phải giữ quan hệ với Series và Exception gốc. | Recurrence |
| BR-M05-61 | Reminder delivery thuộc đúng recipient, Reminder Config và Event/Occurrence. | D13/D15 |
| BR-M05-62 | Dữ liệu thời gian phân biệt date-only, local time, timezone và absolute instant. | Time |
| BR-M05-63 | All-day Event giữ ngày lịch gốc khi chuyển múi giờ hiển thị. | D03 |
| BR-M05-64 | Linked content bị thu hồi quyền không được tiếp tục lộ trong Calendar/Reminder/Export. | D20, Security |

---

# 19. 45 trường hợp ngoại lệ

**Quy ước:** mỗi `EX-M05-NN` là trường hợp cần test tối thiểu; cột xử lý thể hiện hành vi không được bỏ qua.

| ID | Tình huống / điều kiện bất thường | Hành vi xử lý bắt buộc |
|---|---|---|
| EX-M05-01 | Title trống/whitespace | Form báo lỗi trường title; không tạo Event |
| EX-M05-02 | Event thiếu ngày | Không lưu; hướng dẫn lưu ý tưởng ở M03/M04 nếu phù hợp |
| EX-M05-03 | End instant trước Start instant | Báo lỗi, kiểm tra timezone, không tự đổi end |
| EX-M05-04 | Timed Event xuyên nửa đêm | Hiển thị đúng trên cả hai ngày mà không chia Event gốc |
| EX-M05-05 | All-day Event hiển thị ở timezone khác | Giữ ngày lịch, không lệch hôm trước/sau |
| EX-M05-06 | Đổi display timezone | Không thay đổi absolute instant nguồn |
| EX-M05-07 | Local hour không tồn tại do DST | Yêu cầu chọn thời gian hợp lệ |
| EX-M05-08 | Local hour lặp lại do DST | Xác định đúng instant được chọn, không gửi double reminder |
| EX-M05-09 | Hai Event overlap | Cảnh báo khi có quyền, cho xác nhận lưu nếu hợp lệ |
| EX-M05-10 | Event Private trùng lịch chung | Không báo/tín hiệu suy lộ nếu Busy/Free OFF |
| EX-M05-11 | Người được mời Not Going | Cập nhật riêng attendance, không tự xóa Event |
| EX-M05-12 | Người được mời chưa trả lời | Giữ No Response, không auto Going |
| EX-M05-13 | Private→Shared có ảnh/Diary Private | Yêu cầu xác nhận phần chia sẻ; không tự share tài nguyên gốc |
| EX-M05-14 | Thu hồi quyền khi form còn mở | Chặn lưu mới, hiển thị uncommitted status |
| EX-M05-15 | Người không có quyền mở URL Event | Không tiết lộ nội dung/metadata |
| EX-M05-16 | Search Event riêng của người khác | Kết quả, count, autocomplete không leak |
| EX-M05-17 | Recurring Series không có end | Generate occurrence có giới hạn theo view/date range |
| EX-M05-18 | Sửa một Occurrence | Chỉ lưu Exception/occurrence mục tiêu |
| EX-M05-19 | Sửa từ Occurrence hiện tại trở đi | Giữ những lần trước, tránh trùng tại boundary |
| EX-M05-20 | Xóa toàn bộ recurring Series | Kiểm tra scope, exceptions, reminders và links |
| EX-M05-21 | Monthly recurrence ngày 31 | Clamp vào cuối tháng, rule gốc vẫn ngày 31 |
| EX-M05-22 | Anniversary ngày 29/02 | Năm không nhuận 28/02 hoặc 01/03 theo option |
| EX-M05-23 | Occurrence đã sửa riêng khi cập nhật Series | Giữ/giải thích cách áp dụng exceptions; không âm thầm xóa |
| EX-M05-24 | Sửa Occurrence đã Cancelled | Yêu cầu khôi phục/đổi trạng thái có chủ đích |
| EX-M05-25 | Event dời sau khi tạo Reminder | Hủy/cập nhật nhắc pending, không gửi giờ cũ |
| EX-M05-26 | Reminder xử lý lại hoặc retry | Không tạo notification logic trùng |
| EX-M05-27 | Reminder đến hạn nhưng recipient hết quyền | Không gửi nội dung bị hạn chế |
| EX-M05-28 | Push không được thiết bị cho phép (P1) | Không báo đã hiện trên thiết bị; P0 in-app vẫn hoạt động |
| EX-M05-29 | Email/Push thất bại (P1) | Ghi failure, không coi delivered/read |
| EX-M05-30 | Reminder rơi vào quiet hours | Defer/skip theo policy, không gửi dồn thông báo cũ |
| EX-M05-31 | Time Capsule chưa reveal | Không lộ preview/title/attachment trước thời gian cho phép |
| EX-M05-32 | Date Plan M03 dời giờ | Update Event link hiện có, không nhân bản |
| EX-M05-33 | Date Plan M03 bị hủy | Cập nhật Event liên kết, không xóa Place/Visit |
| EX-M05-34 | Trip M04 đổi ngày | Kiểm tra tác động Event, Booking không tự thay đổi |
| EX-M05-35 | M04 Activity chưa có ngày/giờ | Không gán giờ giả để tạo Event timed |
| EX-M05-36 | M04 Booking đã confirmed | Đổi Event time không tuyên bố Booking đổi với provider |
| EX-M05-37 | Sync M03/M04 thất bại | Ghi pending/failure, hỗ trợ retry/idempotency |
| EX-M05-38 | Cùng một create-link request chạy lại | Dùng event link cũ, không duplicate |
| EX-M05-39 | A/B cùng sửa start time | Conflict rõ, không silent overwrite |
| EX-M05-40 | A/B sửa hai thuộc tính khác nhau | Giữ cả hai cập nhật hợp lệ |
| EX-M05-41 | Event xóa nhưng Diary liên kết còn | Không xóa Diary gốc |
| EX-M05-42 | Restore Event khi linked source đã mất | Restore hợp lệ, hiển thị placeholder/cảnh báo link hỏng |
| EX-M05-43 | Restore recurring Event | Không nhân đôi occurrence/reminder, không gửi quá hạn |
| EX-M05-44 | Export có tài nguyên/nhắc Private | Xuất chỉ dữ liệu được phép; không lộ attached secrets |
| EX-M05-45 | Mất mạng khi đang chỉnh Event | Không báo Saved khi chưa xác nhận, hỗ trợ giữ input khi khả thi |

---
# 20. 75 Acceptance Criteria

**Tiêu chuẩn đọc:** mỗi `AC-M05-NN` được diễn đạt theo **Given (bối cảnh) → When (thao tác) → Then (kết quả)**, dùng làm điểm khởi đầu cho automated/manual test. Test phải chạy cả mobile/desktop cho những luồng P0 liên quan, với account A/B thực sự tách biệt và kiểm tra permission tại nguồn dữ liệu. Những phần P1 được nhắc đến chỉ để xác nhận không bị mô tả sai phạm vi.

## 20.1. Calendar Views & Event Management — AC-01 đến AC-15

| ID | Given / When | Then (kết quả nghiệm thu) |
|---|---|---|
| AC-M05-01 | A có 3 Event hợp quyền, 1 Event Private của B; mở CC-01. | Hiển thị chỉ 3 Event của A và nội dung có quyền, không thấy metadata của B. |
| AC-M05-02 | A đang ở Month View; nhấn tháng sau/trước. | Ngày và occurrence thuộc tháng được chọn hiển thị chính xác theo timezone và quyền. |
| AC-M05-03 | A chuyển Week View tới tuần kế tiếp. | Các Event ngày/giờ của tuần phù hợp, overnight và overlap hiển thị đúng. |
| AC-M05-04 | A chọn một ngày trong Month. | Mở Day View/danh sách ngày chính xác, giữ bộ lọc quyền. |
| AC-M05-05 | A mở Agenda phạm vi 7 ngày chứa recurring event. | Các occurrence hợp lệ đúng thứ tự, không duplicate hoặc sinh toàn series vô hạn. |
| AC-M05-06 | A nhập title/ngày/timezone hợp lệ và Save. | Chỉ một Event ID được tạo và xuất hiện đúng Calendar. |
| AC-M05-07 | A bỏ trống title và Save. | Form chỉ ra title lỗi, không tạo Event, giữ input đã nhập. |
| AC-M05-08 | A chọn All-day và ngày cụ thể. | Lưu date-only, không bắt buộc giờ; đổi timezone hiển thị không đổi ngày. |
| AC-M05-09 | A tạo timed Event qua 2 múi giờ hợp lệ. | Lưu time/instant/timezone chính xác, hiển thị đúng local time. |
| AC-M05-10 | A đổi tên Event và Save. | Các reminder, participant, link còn hợp lệ, stable ID không đổi. |
| AC-M05-11 | A đổi Start Time của Event. | Không tạo Event mới, hệ thống kiểm tra conflict và cập nhật reminder liên quan. |
| AC-M05-12 | A Cancel Event đã có future reminder. | Event thành Cancelled, không tiếp tục gửi reminder chưa hợp lệ. |
| AC-M05-13 | Event đã quá thời gian kết thúc nhưng chưa xác nhận hoàn tất. | Không tự chuyển Completed. |
| AC-M05-14 | Event từ 23:00 ngày 1 đến 01:00 ngày 2. | Hiển thị ở các ngày tương ứng, chỉ một Event nguồn. |
| AC-M05-15 | A xem/tạo/sửa Event trên điện thoại. | Hoàn thành được luồng tạo và sửa, Month/Week/Day/Agenda usable. |

## 20.2. Personal, Shared & Participants — AC-16 đến AC-27

| ID | Given / When | Then (kết quả nghiệm thu) |
|---|---|---|
| AC-M05-16 | A tạo Event không chọn chia sẻ. | Event mặc định Private; B không thấy trong View/Search/URL. |
| AC-M05-17 | A xác nhận chia sẻ Event với B. | B nhìn thấy Event với đúng quyền; linked Private media vẫn được bảo vệ. |
| AC-M05-18 | A thu hồi quyền của B khi B đang mở Event. | Những lần truy cập/lưu mới của B bị chặn, reminder bất hợp lệ tương lai hủy. |
| AC-M05-19 | A tắt bộ lọc My Calendar. | Event A không bị xóa, chỉ bị ẩn trong View tương ứng. |
| AC-M05-20 | A có Event Private, B xem ngày/tháng đó. | B không thấy title, location, count hoặc preview Event A. |
| AC-M05-21 | A gửi lời mời cho B vào Event. | B nhận lời mời hợp lệ; RSVP bắt đầu No Response. |
| AC-M05-22 | B nhận lời mời và chọn Going. | Attendance của B thành Going, không tự sửa attendance A. |
| AC-M05-23 | B chọn Not Going. | Không tự xóa/cancel Event chung. |
| AC-M05-24 | B chưa trả lời invitation. | Hiển thị No Response, không mặc định Going. |
| AC-M05-25 | B nhập link Event Private của A. | Từ chối truy cập, không lộ dữ liệu trong lỗi. |
| AC-M05-26 | Event Shared liên kết ảnh Private M02. | Người không có quyền ảnh không xem được ảnh/thumbnail/file gốc. |
| AC-M05-27 | Busy/Free A OFF, B tạo Event trùng giờ private A. | B không nhận conflict signal về private A; bật quyền mới mới được xem busy info phù hợp. |

## 20.3. Anniversary & Recurrence — AC-28 đến AC-40

| ID | Given / When | Then (kết quả nghiệm thu) |
|---|---|---|
| AC-M05-28 | A tạo Anniversary với original date hợp lệ. | Original date được giữ và hiện ở CC-09, có thể link M08 sau. |
| AC-M05-29 | Anniversary đã qua một hoặc nhiều năm. | Năm kỷ niệm và upcoming occurrence tính đúng theo calendar. |
| AC-M05-30 | Original date là hôm nay / hôm qua theo timezone tham chiếu. | Days elapsed lần lượt 0 / 1, ordinal lần lượt 1 / 2. |
| AC-M05-31 | Original date 29/02, xem ở năm không nhuận. | Mặc định 28/02; nếu chọn 01/03 dùng 01/03; gốc vẫn 29/02. |
| AC-M05-32 | A tạo Weekly Saturday 10:00, view 4 tuần. | Bốn occurrence tuần hợp lệ hiện đúng rule và timezone. |
| AC-M05-33 | A tạo monthly recurrence on day 31. | Tháng ngắn dùng last day, tháng đủ trở về 31. |
| AC-M05-34 | A sửa riêng 1 weekly occurrence. | Chỉ occurrence đó đổi; những lần còn lại đúng rule gốc. |
| AC-M05-35 | A sửa từ occurrence hiện tại trở đi. | Các lần trước và lịch sử không bị sửa; future rule đúng. |
| AC-M05-36 | A sửa toàn Series sau xác nhận phạm vi. | Các occurrence thuộc phạm vi được cập nhật có kiểm soát, exceptions không mất âm thầm. |
| AC-M05-37 | A xóa một occurrence. | Series còn lại vẫn xuất hiện, occurrence mục tiêu không hiện ở view/reminder. |
| AC-M05-38 | Series không có end date được xem trong 1 tháng. | Chỉ tính/lấy những occurrence cần cho view, không tạo vô hạn. |
| AC-M05-39 | Occurrence đã dời ngày riêng, A tải lại view và cập nhật series. | Exception đã lưu vẫn được nhận biết; nếu bị ảnh hưởng phải có cảnh báo/phương án. |
| AC-M05-40 | Weekly timed event qua tuần đổi DST trong timezone áp dụng DST. | Giữ cùng wall-clock time hợp lệ; xử lý DST ambiguous/nonexistent minh bạch. |

## 20.4. Reminders & Conflict — AC-41 đến AC-52

| ID | Given / When | Then (kết quả nghiệm thu) |
|---|---|---|
| AC-M05-41 | A đặt reminder 1 day before cho Event. | Reminder Config được lưu đúng tài khoản và occurrence. |
| AC-M05-42 | A đặt 7d và 1d cho cùng Event. | Hai thời điểm hợp lệ được xử lý độc lập, không double cho cùng config. |
| AC-M05-43 | A reminder 1d, B reminder 1h cho Shared Event. | Mỗi người nhận theo cấu hình riêng, không ghi đè/gửi nhầm. |
| AC-M05-44 | A dời Event khi reminder 1h còn pending. | Reminder được dời/hủy theo giờ mới, không gửi thông báo sai giờ cũ. |
| AC-M05-45 | Event Cancelled/Trashed trước hạn reminder. | Không tiếp tục sinh reminder hoạt động của Event bị hủy/xóa. |
| AC-M05-46 | Cùng delivery được hệ thống xử lý 2 lần do retry. | Không xuất hiện 2 notification logic cho cùng occurrence/recipient/config. |
| AC-M05-47 | B mất quyền Event trước giờ reminder. | Không gửi Event title/content cho B hoặc tiết lộ qua Notification Center. |
| AC-M05-48 | Quiet hours của A trùng giờ nhắc. | Áp dụng đúng defer/skip policy đã cấu hình, không gửi trùng/hàng loạt quá hạn. |
| AC-M05-49 | Hai Timed Events được phép kiểm tra overlap. | Cảnh báo đúng khoảng giao nhau theo timezone. |
| AC-M05-50 | Người dùng thấy cảnh báo trùng và chọn Save Anyway. | Lưu thành công nếu đủ quyền và dữ liệu hợp lệ. |
| AC-M05-51 | Private Event A, Busy/Free OFF. | B không nhận tên/title/count hoặc tín hiệu bận liên quan Event A. |
| AC-M05-52 | A bật Busy/Free cho phạm vi được phép. | B chỉ thấy busy interval đủ quyền, không thấy chi tiết Event A. |

## 20.5. Cross-module Integration — AC-53 đến AC-65

| ID | Given / When | Then (kết quả nghiệm thu) |
|---|---|---|
| AC-M05-53 | M03 Date Plan có giờ, A chọn Add to Calendar. | Một Event M05 liên kết đúng Date Plan và source purpose. |
| AC-M05-54 | A đổi giờ Date Plan từ M03 sau khi link. | M05 hiển thị giờ đã xác nhận mới trên cùng Event. |
| AC-M05-55 | B sửa giờ Calendar Event được link M03. | M03 hiển thị thời gian mới hoặc trạng thái sync pending/conflict minh bạch. |
| AC-M05-56 | Yêu cầu create/link M03 được gửi lại. | Không tạo Event trùng theo source+purpose. |
| AC-M05-57 | M04 Activity được chọn đưa lên Calendar. | Event link đúng Activity; không tạo M04 Place mới hoặc bản ghi độc lập. |
| AC-M05-58 | M04 Activity Cancelled/Skipped. | Calendar link xử lý policy đúng, không xóa Trip/M03 Place. |
| AC-M05-59 | M04 Trip đổi lịch có Booking confirmed. | Calendar chỉ cập nhật phần được xác nhận, không báo Booking đã được provider đổi. |
| AC-M05-60 | Anniversary link Special Moment M08. | Thời gian đúng, quyền riêng nội dung M08 được bảo vệ. |
| AC-M05-61 | M08 Time Capsule chưa tới Scheduled Reveal. | M05 không lộ title/preview/content/time metadata vượt quyền qua view/reminder/search. |
| AC-M05-62 | Event gắn ảnh M02 và Diary M01. | Sử dụng reference, không copy dữ liệu gốc và không tự nâng quyền. |
| AC-M05-63 | Linked source bị xóa hoặc người xem hết quyền. | Event vẫn hợp lệ; source bị ẩn/placeholder, không leak thông tin. |
| AC-M05-64 | Đồng bộ M03↔M05 hoặc M04↔M05 lỗi. | Có trạng thái lỗi/pending và retry an toàn, không báo hai bên đồng bộ thành công. |
| AC-M05-65 | Người dùng xóa Event đã link Date Plan/Trip/Diary. | Không xóa dây chuyền dữ liệu nguồn, quan hệ link được xử lý minh bạch. |

## 20.6. History, Recovery, Reliability — AC-66 đến AC-75

| ID | Given / When | Then (kết quả nghiệm thu) |
|---|---|---|
| AC-M05-66 | A đổi Title và B đổi Time độc lập từ hai phiên. | Hai thay đổi hợp lệ cùng tồn tại sau đồng bộ, không mất dữ liệu. |
| AC-M05-67 | A và B đồng thời đổi chính Time từ phiên bản cũ. | Có conflict detection/handling minh bạch, không silent overwrite. |
| AC-M05-68 | A thu hồi quyền Editor khi B còn form mở. | B không thể lưu update mới, form báo trạng thái không hợp lệ. |
| AC-M05-69 | Owner Move Event to Trash. | Event ẩn khỏi active views, Trash có record và hạn giữ 30 ngày. |
| AC-M05-70 | Owner Restore Event trong 30 ngày. | Event, trạng thái, permission và link hợp lệ khôi phục đúng; không duplicate. |
| AC-M05-71 | Restore recurring Series có Exceptions/Reminder. | Không nhân Occurrence/Delivery hoặc gửi lời nhắc quá hạn. |
| AC-M05-72 | A export Calendar chứa Event của A và Private Event B. | Export gồm dữ liệu A được phép xem/xuất; không có nội dung Private B. |
| AC-M05-73 | A đổi display timezone/time format. | Timed Event giữ cùng instant, All-day giữ ngày lịch; đổi format chỉ ảnh hưởng UI. |
| AC-M05-74 | A mất mạng sau khi sửa trước xác nhận Save. | UI không báo Saved; giữ input khi có thể, người dùng biết trạng thái chưa đồng bộ. |
| AC-M05-75 | A mở Calendar trên mobile, sau đó desktop sau các thay đổi đã xác nhận. | Cùng trạng thái Calendar/Event/Occurrence/Reminder hợp lệ, không sai timezone hoặc quyền. |

---

# 21. Yêu cầu phi chức năng, responsive và khả năng tiếp cận

## 21.1. Data consistency & Reliability

- Một lần Save đã được xác nhận phải tồn tại sau reload/login lại; không trùng Event khi retry create/link/import logic.
- M03/M04 sync có trạng thái độc lập và idempotent; việc nhận event/update hai chiều không phát sinh vòng lặp cập nhật vô hạn.
- Reminder delivery có khóa nhận diện, chống duplication trong các tình huống retry/hàng đợi bị xử lý lại.
- Version/revision metadata đủ để phát hiện lost update, không tin hoàn toàn vào client timestamp.
- Sao lưu và phục hồi đủ Events, Series, Exceptions, Participants, Reminders, Permission, History và Cross-module Links; thực hiện diễn tập restore thực tế.
- Không đồng nhất autosave/input-state với backend confirmed Save, Version History, hoặc Backup.

## 21.2. Performance & Scale

- Lịch tháng/tuần/tìm kiếm chỉ tải phạm vi Event/Occurrence cần thiết, có cơ chế paginate/lazy load; không materialize tất cả tương lai của recurring forever.
- Khi có nhiều Event cùng ngày, giao diện vẫn thao tác được; có overflow panel và tải chi tiết theo nhu cầu.
- Các chỉ tiêu đáp ứng như thời gian render với 1.000/10.000 Event, trễ sync giữa M03/M04, sai lệch thời điểm nhắc, RTO/RPO backup... **chưa được duyệt con số**, phải xác định trong Non-functional Requirement/Technical Design về sau và đo trên môi trường thực tế.
- Không “giải quyết” vấn đề performance bằng cắt bớt dữ liệu có quyền hoặc bỏ occurrence/exception.

## 21.3. Mobile/desktop parity

| Nghiệp vụ P0 | Mobile | Desktop |
|---|---|---|
| Month/Week/Day/Agenda | Có view thích nghi màn hình, chọn ngày bằng chạm | Có lưới + keyboard navigation |
| Create/Edit Event | Form đầy đủ, bàn phím date/time hợp lý | Form/panel đầy đủ |
| RSVP / Share / Revoke | Thực hiện được theo quyền | Thực hiện được theo quyền |
| Anniversary / Days Together | Hiển thị/tạo/sửa | Hiển thị/tạo/sửa |
| Recurrence / Scope edit | Có đủ tùy chọn; không chỉ read-only | Có đủ tùy chọn |
| Reminder / Quiet Hours | Cấu hình được | Cấu hình được |
| Linked M03/M04 | Điều hướng/lưu liên kết | Điều hướng/lưu liên kết |
| Trash/Restore/Export | Hoàn thành được quy trình | Hoàn thành được quy trình |

Giao diện có thể khác bố cục, nhưng không được chuyển tác vụ P0 thành desktop-only. Kéo thả không là cách duy nhất để dời Event; mobile có thao tác form tương đương.

## 21.4. Accessibility & Localization

- Nội dung tiếng Việt Unicode, ngôn ngữ linh hoạt; không dùng màu làm tín hiệu duy nhất.
- Tên nút, label form, lỗi validation, thông báo xung đột và nhắc đều có text rõ, hỗ trợ keyboard/focus/screen reader hợp lý.
- Month View trên mobile không làm text quá nhỏ; Event có tooltip/detail được truy cập không cần hover.
- Thời gian hiển thị tùy 12/24h và đầu tuần thứ Hai/Chủ nhật; timezone hiển thị rõ ở sự kiện quốc tế.
- Phương án giảm chuyển động cho các hiệu ứng chuyển View nếu sử dụng animation.

## 21.5. Privacy, Security & Audit

- Kiểm soát truy cập phía server cho Event, occurrence, reminder, attachments, source links và export.
- Không được leak Private Event qua thống kê, ngày có dấu sự kiện, email/push (khi P1), Notification Center hoặc dữ liệu phân tích không cần thiết.
- Không dùng dữ liệu từ Calendar để suy ra danh tính hoặc hoạt động riêng tư của tài khoản còn lại khi quyền không cho phép.
- Ghi lịch sử thay đổi đáng kể mà không lộ dữ liệu Private cho người không có quyền.
- Khi xóa Event hoặc thay đổi quyền, cần có cơ chế cập nhật/bất hoạt notification tương lai và cache/preview phù hợp.
- Không lưu thẻ thanh toán, thông tin đặt vé hay file nhạy cảm trực tiếp vào Event nếu không có nghiệp vụ đã chốt và hệ thống file bảo mật chung.

---

# 22. Phạm vi, ranh giới P0/P1/P2 và phụ thuộc

## 22.1. P0 — bắt buộc nghiệm thu Our Space V1.0

1. 17 giao diện/khả năng CC-01–CC-17, có thể hợp nhất thành panel nhưng đủ hành vi.
2. Month/Week/Day/Agenda; calendar personal/shared, date selection, filtering.
3. Event create/edit/cancel/trash/restore với all-day/timed/timezone và trạng thái.
4. Participants/Attendance/Owner-Editor-Commenter-Viewer, permission theo Event.
5. Anniversaries, Original Date, Days Together, Feb 29 rule.
6. Daily/Weekly/Monthly/Yearly/Custom Recurrence; occurrence exceptions; scope edit/delete.
7. In-app Reminders, multiple offsets, per-account configs, quiet hours và chống trùng.
8. Conflict checking theo quyền, Busy/Free OFF mặc định, can override overlap.
9. M03 Date Plan & M04 Activity link/sync thật, M06/M08 contract dự trù an toàn.
10. Linked content M01/M02 tham chiếu, không sao chép file gốc.
11. History, Search/Filters, Preferences, Trash 30 ngày, structured export.
12. Cộng tác chống lost-update, trạng thái lưu rõ ràng, test cả mobile/desktop.

## 22.2. P1 — nâng cao, chưa bắt buộc V1.0

- Email Reminders, Browser/Device Push khi được hỗ trợ và người dùng đồng ý.
- iCalendar `.ics` export/import; đồng bộ một chiều qua file.
- Kéo thả Event trực tiếp trong Week/Day, widget lịch/Homepage nâng cao.
- Lịch ngày lễ theo khu vực, lịch tùy chỉnh nâng cao, tìm free slots nâng cao.
- Thông báo nhiều bước/phản hồi nâng cao; tùy chọn tích hợp tài khoản lịch ngoài theo phạm vi được phê duyệt.

## 22.3. P2 — tương lai

- Google Calendar/Outlook hai chiều, tài khoản ngoài và giải quyết xung đột đa nguồn.
- AI gợi ý ngày hẹn, kế hoạch cuối tuần, tạo event từ văn bản/ảnh.
- Tích hợp đặt bàn hoặc đặt chỗ ngoài, tự động nhận event từ dịch vụ bên ngoài.
- Phân tích lịch và sở thích chuyên sâu, automation ngoài phạm vi nhắc lịch đã chốt.

## 22.4. Dependencies

| Đơn vị/Phân hệ | Cần gì từ đó | Quy tắc tích hợp |
|---|---|---|
| M01 Diary/Photobook | Linked content, quyền truy cập | Calendar không sở hữu Diary/Photobook |
| M02 Media Library | Ảnh, cover, thumbnail | Không lưu file gốc ở M05 |
| M03 Food & Places | Date Plan, Place, Visit | Calendar Event chính thức tại M05, Visit xác nhận M03 |
| M04 Travel | Trip/Activity, timezone/Booking | Time sync nhưng không tự sửa booking/provider |
| M06 Goals | Deadline/milestone | Chỉ tạo Event khi người dùng chọn; cần BRD M06 |
| M08 Special Moments | Anniversary / reveal policy | Không lộ nội dung Time Capsule |
| M09 Interaction | Comment/reaction | Kế thừa Event permission |
| M10 Settings | Timezone, privacy, notification prefs | Quy ước dùng chung, không tạo bản tùy chọn trái nhau |
| Shared Authorization | User, owner, role, audit | Enforcement ở nguồn dữ liệu |
| Shared Notification | In-app center, state, scheduling | Idempotency, quyền và quiet hours |
| Shared Search/Timeline | Permission scoped query | Không leak Private event/content |
| Backup/Export | Data restore and portability | Rule + exceptions + links + rights được phục hồi |

---

# 23. Definition of Done và chiến lược kiểm thử

## 23.1. Checklist nghiệm thu tổng thể M05 P0

- [ ] Đăng nhập bằng hai tài khoản riêng; My Calendar Private không lộ cho người kia.
- [ ] Tạo/sửa/xem/hủy Event và bốn Calendar Views trên desktop/mobile.
- [ ] Event all-day giữ ngày khi đổi timezone; timed events qua nửa đêm/qua DST đúng.
- [ ] Shared Event chia sẻ có chủ đích, không tự share linked private media/documents.
- [ ] Mời người kia, RSVP Going/Maybe/Not Going/No Response độc lập.
- [ ] Anniversary giữ ngày gốc và tính Days Together/ordinal/năm nhuận chính xác.
- [ ] Recurrence cho ngày/tuần/tháng/năm/custom interval; ngày 31 và 29/02 nhất quán.
- [ ] Sửa/xóa một occurrence, từ occurrence trở đi và toàn Series; exception không mất.
- [ ] Reminder 2 người cấu hình khác nhau; không gửi trùng; xử lý cancel/reschedule/quiet hours/revoke permission.
- [ ] Busy/Free OFF không leak Private schedule qua conflict checker.
- [ ] Date Plan M03 đồng bộ theo Event chính thức, không nhân link sau retry.
- [ ] Activity M04 đồng bộ đúng Time, không tự Completed/Visit hoặc đổi Booking.
- [ ] Link M08 Scheduled Reveal được bảo vệ cho đến thời điểm được phép.
- [ ] Search/Views/Export/Notification tôn trọng Event + linked content permissions.
- [ ] Hai người cùng sửa Event; các thay đổi độc lập được giữ, thay đổi cùng trường có conflict handling.
- [ ] Trash 30 ngày, Restore Event/Series/Exceptions, không gửi Reminder quá hạn.
- [ ] Structured export có time/timezone/recurrence/permissions đúng phạm vi.
- [ ] Sao lưu và thử phục hồi dữ liệu M05 trong môi trường kiểm thử.
- [ ] Tất cả `AC-M05-01` đến `AC-M05-75` đạt hoặc có waiver được chủ dự án chấp thuận.
- [ ] Các tích hợp M06/M08/M09/M10 có contract/phân quyền đầy đủ khi BRD liên quan được duyệt, không được lấy giả định làm yêu cầu chính thức.

## 23.2. Bộ test dữ liệu đề xuất

- Tài khoản A/B, calendar My A, My B và Our Calendar; ít nhất một Event riêng tư mỗi người.
- Event all-day single-day/multi-day, timed single-day/overnight, nhiều timezone.
- Recurrence weekly không có end, monthly day 31, monthly nth weekday, yearly leap Feb 29; exception dời một lần, bỏ một lần, thay tương lai.
- Reminder multiple offsets cho cùng Event trên hai tài khoản; tạo retry 2 lần; reschedule/cancel/restore.
- Date Plan M03 tạo/lặp yêu cầu link, edit từ hai phía, sync failure và retry; Activity M04 có booking confirmed và trip đổi ngày.
- M08 capsule chưa reveal, sau reveal, quyền bị thu hồi.
- Concurrent Event edits: cùng field/khác field, permission revoke trong lúc form mở; xóa/restore khi tab cũ còn edit.
- Timezone test: Việt Nam (không DST) và ít nhất một timezone có DST, cùng một date-only Event mở ở nhiều timezone.
- Search/export với Event Private và attachment restricted để phát hiện dữ liệu bị tiết lộ qua count/preview.

## 23.3. Điều kiện nghiệm thu kỹ thuật trước go-live

- Automated tests hoặc manual test scripts chứng minh toàn bộ yêu cầu P0 cho các tình huống khó (recurrence+timezone+permission+sync) chứ không chỉ happy path.
- Kiểm thử hành trình end-to-end M03→M05 và M04→M05, đối chiếu dữ liệu nguồn/trạng thái.
- Kiểm thử bảo mật direct URL, search, notification, attachments, export và conflict/busy-free với tài khoản không đủ quyền.
- Kiểm thử backup–restore, dữ liệu sau reload, conflict edit, mất mạng, retry, delivery duplicate.
- Performance/accessibility/responsive đo theo tiêu chí phi chức năng **được phê duyệt sau này**; không tuyên bố đã đạt nếu chưa có ngưỡng và phép đo.
- Chỉ khi **10/10 mô-đun P0** đạt tiêu chí chính thức thì toàn bộ Our Space V1.0 mới được dùng chính thức, theo quyết định sản phẩm nền tảng.

---

# 24. Traceability D01–D22 và xử lý bất đồng tài liệu

| Quyết định | Màn hình / mục chính | BR liên quan | AC đối chiếu |
|---|---|---|---|
| D01 | CC-01–05 / mục 6 | BR-M05-09/10 | AC-M05-01–05,15 |
| D02 | CC-08/15 / mục 7,14 | BR-M05-05,09–12,45–50 | AC-M05-16–27 |
| D03 | CC-06 / mục 4,7 | BR-M05-01–03,62–63 | AC-M05-06–09,14,73 |
| D04 | CC-06 / mục 7 | BR-M05-01,06 | AC-M05-06,10 |
| D05 | CC-07 / mục 7,15 | BR-M05-06–07 | AC-M05-12–13 |
| D06 | CC-15 / mục 13–14 | BR-M05-48 | AC-M05-21–24 |
| D07 | CC-09 / mục 8 | BR-M05-13–15 | AC-M05-28–29 |
| D08 | CC-09 / mục 8 | BR-M05-16 | AC-M05-30 |
| D09 | CC-09 / mục 8 | BR-M05-17 | AC-M05-31 |
| D10 | CC-10 / mục 9 | BR-M05-19,22,24,59–60 | AC-M05-32–33,38,40 |
| D11 | CC-10 / mục 9 | BR-M05-20–21,60 | AC-M05-34–37,39 |
| D12 | CC-10 / mục 9 | BR-M05-24 | AC-M05-33 |
| D13 | CC-11 / mục 10 | BR-M05-27–28,61 | AC-M05-41–42,44–46 |
| D14 | CC-11 / mục 10 | BR-M05-25–26,31 | AC-M05-41,46–47 |
| D15 | CC-11 / mục 10 | BR-M05-30,61 | AC-M05-43 |
| D16 | CC-11/16 / mục 10,13 | BR-M05-28–31 | AC-M05-48 |
| D17 | CC-12 / mục 11 | BR-M05-33–34,36–37 | AC-M05-49–50 |
| D18 | CC-12/16 / mục 11,14 | BR-M05-35 | AC-M05-27,51–52 |
| D19 | CC-13 / mục 12 | BR-M05-08,38–44,58 | AC-M05-53–59,63–65 |
| D20 | CC-09/13 / mục 8,12 | BR-M05-18,32,64 | AC-M05-60–61 |
| D21 | CC-17 / mục 13 | BR-M05-54,56 | AC-M05-72 |
| D22 | Mục 1,22 | Ranh giới P2 | Không yêu cầu integration Google/Outlook trong P0 |

## 24.1. Khi có xung đột giữa BRD M05 và các BRD khác

1. Giữ nguyên các quyết định đã chốt và phân biệt miền dữ liệu gốc (M05 Event, M03 Place/Date Plan/Visit, M04 Activity/Trip/Booking, M02 Media, M01 Diary/Photobook).
2. Với thông tin còn mơ hồ hoặc BRD của M06/M08/M09/M10 chưa chốt, đánh dấu **`PENDING_CROSS_MODULE_APPROVAL`**, không tự gán giải pháp là đã duyệt.
3. Khi kỹ thuật thấy hai tiêu chí không thể cùng thoả mãn, lập issue có ID, hai trích dẫn BRD, tác động và các phương án; yêu cầu chủ dự án quyết định trước khi code phần xung đột.
4. Thay đổi nghiệp vụ phải cập nhật version/change log; không chỉnh lặng lẽ bản BRD đã duyệt.

---

# 25. Thông số kỹ thuật chưa chốt và Change Log

## 25.1. OPEN / NEEDS TECH DESIGN — không phải quyết định đã chốt

| ID | Chủ đề cần xác định | Lý do / ranh giới cần giữ |
|---|---|---|
| OPEN-M05-01 | Giới hạn số Calendar/Event/Series/Participants/Reminder | Chưa có giới hạn số cụ thể; không tự chọn làm business requirement |
| OPEN-M05-02 | Ngưỡng performance, thời gian trễ sync, SLO nhắc lịch | Cần non-functional test environment trước khi đặt cam kết số |
| OPEN-M05-03 | Kiểu lưu thời gian và thư viện timezone | Thiết kế kỹ thuật phải đảm bảo semantics tại mục 4/9, không tự giản lược date-only |
| OPEN-M05-04 | Định dạng structured export P0 | Phải giữ nội dung theo quyền và recurrence; iCalendar là P1 |
| OPEN-M05-05 | Cơ chế in-app notification center và lưu thông báo | Thuộc nền tảng dùng chung, không ép vào kiến trúc cụ thể |
| OPEN-M05-06 | Quiet hours policy chi tiết và ngưỡng “stale reminder” | Cần UX/policy, không tự gửi dồn khi hết giờ yên tĩnh |
| OPEN-M05-07 | Rules monthly nth weekday không tồn tại trong kỳ | Đề xuất skip kỳ đó; cần xác nhận chi tiết khi thiết kế recurrence nâng cao |
| OPEN-M05-08 | Định dạng Event timed chỉ có Start mà không có End | Nếu hỗ trợ, phải định nghĩa conflict/reminder/duration rõ; không đặt end time giả |
| OPEN-M05-09 | Ngày Birthday khi người dùng chỉ biết tháng/ngày nhưng không biết năm | M05 Anniversary hiện yêu cầu ngày gốc; không nhập năm giả |
| OPEN-M05-10 | Đồng bộ M06 Goal deadline/milestones | Chờ BRD M06 được duyệt |
| OPEN-M05-11 | Reveal policy và gói notification của M08 | Chờ BRD M08; mặc định không tiết lộ bí mật |
| OPEN-M05-12 | Comment/interaction trên Event của M09 | Chờ BRD M09; quyền kế thừa Event |
| OPEN-M05-13 | Tích hợp User Settings/notification service M10 | Chờ BRD M10; không tạo cấu hình trái nhau |
| OPEN-M05-14 | Xử lý ngoại lệ khi đổi toàn Series có các Occurrences linked với M03/M04 | Cần decision UX thể hiện rõ phạm vi, không phá dữ liệu nguồn |
| OPEN-M05-15 | Dung lượng, thời hạn giữ backup, RTO/RPO và cơ chế khôi phục | Theo chính sách nền tảng toàn Our Space |
| OPEN-M05-16 | Mô hình availability Free/Busy cho all-day, room for event privacy | Đã chốt nguyên tắc không leak; chi tiết UX/property cần technical refinement |

## 25.2. Tài liệu khác cần có khi chuyển sang coding

- Mô hình user/permission/link ownership **dùng chung** 10 phân hệ.
- Thiết kế UX/wireframe đầy đủ cho CC-01–CC-17 trên mobile/desktop, đặc biệt recurrence scope and permission confirmation.
- Technical data model/schema, event source mapping, timezone/date-only strategy và notification job behavior.
- Sequence diagrams cho M03↔M05, M04↔M05, recurrence edit, reminder dispatch, Permission revoke.
- Test fixtures cho DST, Feb 29, day 31, recurring exceptions, multi-actor conflicts và restore.
- Non-functional budgets và bảo mật/privacy test plan toàn nền tảng.
- Không bắt đầu code chỉ bằng cách hiểu một số section riêng lẻ khi những hợp đồng dùng chung còn xung đột.

## 25.3. Change Log

| Version | Ngày | Trạng thái | Ghi chú |
|---|---|---|---|
| 0.1 | 2026-10-22 | Draft proposed | Đề xuất M05 trong cuộc hội thoại, chưa chốt |
| 1.0 | 2026-10-22 | **Approved business requirements** | Chủ dự án chốt tất cả D01–D22; xuất tài liệu đầy đủ cho `Docs/` |

---

**KẾT THÚC BRD M05 V1.0.** Đã chốt nghiệp vụ, **chưa code**. Phân hệ tiếp theo để thảo luận là **M06 — Bucket List & Goals**. Chỉ sau khi chủ dự án chốt nghiệp vụ M06 mới xuất `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md`.
