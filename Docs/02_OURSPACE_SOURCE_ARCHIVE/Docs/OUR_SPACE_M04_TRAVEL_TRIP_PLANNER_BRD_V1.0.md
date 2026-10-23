---
document_id: OURSPACE-M04-BRD
project: Our Space
module_id: M04
module_name: Travel & Trip Planner
version: 1.0
status: Business requirements approved, implementation pending
language: vi-VN
approved_on: 2026-10-22
file_name: OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md
intended_audience: [Product Owner, Designer, Codex, Developer, QA]
related_documents:
  - OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md
  - OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md
  - OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md
---

# OUR SPACE — M04: TRAVEL & TRIP PLANNER
## Business Requirements & Functional Specification — V1.0

> **TÀI LIỆU NGHIỆP VỤ ĐÃ ĐƯỢC DUYỆT.** Chủ dự án đã xác nhận **toàn bộ D01–D22** trong phiên trao đổi ngày 22/10/2026. Tài liệu là nguồn yêu cầu nghiệp vụ để đặt tại `Docs/` và để Codex lập kế hoạch triển khai, thiết kế UI, kỹ thuật và test sau này. **Không chứa mã nguồn và không tự chỉ định framework, database, API, dịch vụ bản đồ hay hosting.**
>
> **Quy ước ưu tiên:** P0 là bắt buộc để nghiệm thu Our Space V1.0; P1 là ưu tiên cao nhưng không bắt buộc V1.0; P2 dành cho tương lai. Our Space chỉ sử dụng chính thức khi **10/10 phân hệ có P0 hoàn chỉnh**, không có nghĩa mọi tính năng P1/P2 đều phải hoàn tất.
>
> **ĐỌC TRƯỚC KHI TRIỂN KHAI (Codex):** Các mục 2, 4, 5–13, 14–18, 19–21; các mã `BR-M04-*`, `UC-M04-*`, `EX-M04-*`, `AC-M04-*`. Giữ nhất quán với M01–M03. Không lập bản sao độc lập cho Place (M03), Media (M02), Diary/Photobook (M01), Event (M05) hoặc Expense (M07). Nếu xuất hiện xung đột giữa tài liệu đã chốt, lập danh sách vấn đề cần quyết định trước khi viết thay vì ngầm chọn một hành vi.
>
> **NGỮ CẢNH THỐNG NHẤT:** M03 V1.0 đã được chốt **hỗ trợ mọi loại địa điểm vui chơi**, không chỉ đồ ăn/cafe. M04 sử dụng Place có sẵn của M03 cho địa điểm tham quan, rạp phim, công viên, nhà hàng và nhiều loại khác. M04 không được tự tạo một danh mục địa điểm song song không liên kết.

---

## MỤC LỤC

1. [Tầm nhìn, mục tiêu, phạm vi và giới hạn](#1-tầm-nhìn-mục-tiêu-phạm-vi-và-giới-hạn)
2. [22 quyết định đã chốt, P0/P1/P2](#2-22-quyết-định-đã-chốt-p0p1p2)
3. [Người dùng, thuật ngữ và hành trình](#3-người-dùng-thuật-ngữ-và-hành-trình)
4. [Mô hình dữ liệu nghiệp vụ, trạng thái, bất biến](#4-mô-hình-dữ-liệu-nghiệp-vụ-trạng-thái-bất-biến)
5. [Sitemap, 18 màn hình, trạng thái giao diện](#5-sitemap-18-màn-hình-trạng-thái-giao-diện)
6. [Trip Management và quy trình tạo nhanh/đầy đủ](#6-trip-management-và-quy-trình-tạo-nhanhđầy-đủ)
7. [Itinerary Planner, hoạt động và Place Picker](#7-itinerary-planner-hoạt-động-và-place-picker)
8. [Transport, Accommodation, Booking, Documents](#8-transport-accommodation-booking-documents)
9. [Packing, Preparation và Trip Budget](#9-packing-preparation-và-trip-budget)
10. [Trip Calendar, bản đồ, múi giờ và tiền tệ](#10-trip-calendar-bản-đồ-múi-giờ-và-tiền-tệ)
11. [Collaboration, quyền riêng tư và lịch sử](#11-collaboration-quyền-riêng-tư-và-lịch-sử)
12. [Trip Memories, Recap, Archive, Trash, Export](#12-trip-memories-recap-archive-trash-export)
13. [Hợp đồng nghiệp vụ giữa các phân hệ](#13-hợp-đồng-nghiệp-vụ-giữa-các-phân-hệ)
14. [20 Use Cases và những luồng end-to-end](#14-20-use-cases-và-những-luồng-end-to-end)
15. [Business Rules có mã định danh](#15-business-rules-có-mã-định-danh)
16. [45 trường hợp ngoại lệ và xử lý](#16-45-trường-hợp-ngoại-lệ-và-xử-lý)
17. [70 Acceptance Criteria và ma trận kiểm thử](#17-70-acceptance-criteria-và-ma-trận-kiểm-thử)
18. [Non-functional requirements và mobile/desktop](#18-non-functional-requirements-và-mobiledesktop)
19. [Ranh giới triển khai, phụ thuộc, Definition of Done](#19-ranh-giới-triển-khai-phụ-thuộc-definition-of-done)
20. [Ví dụ hành trình xuyên phân hệ](#20-ví-dụ-hành-trình-xuyên-phân-hệ)
21. [Traceability, vấn đề chưa định lượng và change log](#21-traceability-vấn-đề-chưa-định-lượng-và-change-log)

---

# 1. Tầm nhìn, mục tiêu, phạm vi và giới hạn

## 1.1. Bối cảnh sản phẩm

**Our Space** là website riêng tư cho hai người, gồm 10 phân hệ chính, Homepage hiện đại, Photobook dạng scrapbook, có khả năng mở rộng lâu dài và trải nghiệm desktop/mobile tương đương về khả năng hoàn thành nghiệp vụ. M01 đã chốt Editor Simple/Advanced và cộng tác thời gian thực. M02 là nguồn media, M03 là nguồn Place và Visit của mọi loại địa điểm vui chơi. M04 tiếp tục kế thừa các quyết định này.

M04 — **Travel & Trip Planner** là môi trường quản lý hành trình **từ ước mơ đến kỷ niệm**. M04 không chỉ lập lịch rồi bỏ quên dữ liệu khi chuyến đi kết thúc. Những địa điểm đã đến, ảnh đã chụp, nhật ký đã viết và chi phí đã ghi phải được tái sử dụng qua các phân hệ liên quan.

## 1.2. Sáu mục tiêu nghiệp vụ

1. **Dream:** lưu mong muốn du lịch dù chưa biết ngày hoặc ngân sách.
2. **Plan:** lập lịch trình nhiều ngày hoặc trong ngày; quản lý điểm đến, hoạt động, chỗ ở, phương tiện và booking.
3. **Prepare:** quản lý checklist, packing, phân công, tài liệu, ngân sách dự kiến.
4. **Experience:** sử dụng lịch trình dễ dàng khi đi du lịch; cho phép đổi kế hoạch linh hoạt và ghi nhận thực tế khác dự kiến.
5. **Remember:** gắn ảnh, Visit, Diary, milestone; tổng kết và tạo Travel Photobook sau chuyến đi.
6. **Reuse & Protect:** không tạo trùng đối tượng phân hệ khác, không âm thầm tiết lộ dữ liệu Private hoặc xóa dây chuyền.

## 1.3. Các loại Trip bắt buộc hỗ trợ

| Loại | Ví dụ minh họa | Đặc thù |
|---|---|---|
| Day Trip | Đi Vũng Tàu về trong ngày | 0 đêm, một hoặc nhiều hoạt động |
| Weekend | Đà Lạt 2 ngày 1 đêm | Itinerary ngày, chỗ ở tùy chọn |
| Domestic | Phú Quốc 4 ngày 3 đêm | Di chuyển, ngân sách, booking |
| International | Nhật Bản 7 ngày 6 đêm | Múi giờ, nhiều đơn vị tiền |
| Multi-destination | Hà Nội – Ninh Bình – Hạ Long | Nhiều destination và transport leg |
| Dream Trip | Muốn đến Thụy Sĩ | Không cần ngày/booking |
| Flexible Trip | Đi trong tháng 4 năm sau | Mức chính xác thời gian là dự kiến, không phải ngày giả |
| Custom | Hành trình bất kỳ | Không bị gò vào template thời gian cố định |

Một chuyến đi **không bắt buộc** phải có Booking, Accommodation, Transport hoặc Budget. M04 phải sử dụng được cho Quick Trip đơn giản lẫn Full Trip Planning phức tạp.

## 1.4. Nguyên tắc cốt lõi

- **Trip ≠ Itinerary:** chuyến đi tồn tại dù chưa lập lịch trình.
- **Itinerary Item ≠ Place:** hoạt động nghỉ ngơi, vận chuyển, check-in hoặc ghi chú không nhất thiết có địa điểm M03.
- **Planned ≠ Actual:** hoạt động đã lên kế hoạch hoặc đã đến giờ không chứng minh đã thực hiện; hoàn tất Activity không mặc định phát sinh Visit M03.
- **Booking ≠ Confirmed Service Change:** đổi ngày Trip không làm vé hoặc phòng tự đổi ngày với nhà cung cấp.
- **Trip Budget ≠ Expense Source:** M07 giữ khoản chi thực tế chính thức; M04 chỉ tạo/hiển thị/liên kết theo quyền.
- **One source of truth:** M03 sở hữu Place/Visit; M02 sở hữu ảnh/video; M01 sở hữu Diary/Photobook; M05 sở hữu Calendar Event; M07 sở hữu Expense.
- **Permission first:** Trip Shared không làm mọi Booking Document, ảnh Private, Review hoặc Expense tự được chia sẻ.
- **No invented external facts:** không bịa tọa độ, thời gian di chuyển, giá, thông tin đặt chỗ, thời tiết, tỷ giá hoặc giờ hoạt động.
- **No destructive cascade:** xóa Trip không tự xóa media, Visit, Diary, Event/Expense độc lập.
- **Mobile is functional:** cả hai thiết bị hoàn thành các quy trình P0, không chỉ mobile read-only.

## 1.5. Ngoài phạm vi nghiệp vụ M04 V1.0

Không đặt vé/đặt phòng qua bên thứ ba, không kết nối hãng bay thời gian thực, không tự đồng bộ email xác nhận, không có AI sinh lịch trình, không bắt buộc bản đồ hành trình tương tác, không tự tối ưu route, không bắt buộc offline toàn bộ và không bắt buộc xuất PDF lịch trình trình bày đẹp. Các nội dung này được xếp P1/P2 theo mục 2, không âm thầm kéo vào P0.

---

# 2. 22 quyết định đã chốt, P0/P1/P2

**Chủ dự án xác nhận toàn bộ đề xuất D01–D22**. Các quyết định dưới đây mang tính ràng buộc trong M04 V1.0.

| ID | Quyết định chính thức | Hệ quả nghiệm thu |
|---|---|---|
| D01 | Hỗ trợ Day Trip, nhiều ngày, nội địa, quốc tế, Dream Trip | Không ép người dùng nhập Booking/ngày ở Dream |
| D02 | Tạo chuyến đi khi chưa xác định ngày | Lưu date precision thay vì ngày giả |
| D03 | Một Trip có nhiều thành phố/quốc gia | Có danh sách nhiều destinations |
| D04 | Dreaming, Planning, Ready, In Progress, Completed, Cancelled; Archive | Lifecycle rõ, Archive không đồng nghĩa Completed |
| D05 | Có Timeline View và Planning View | Hai cách xem cùng dữ liệu itinerary |
| D06 | Có khu vực Unscheduled | Activity không bắt buộc có ngày/giờ |
| D07 | Thêm/sửa/nhân bản/đổi thứ tự/chuyển ngày Activity | Không mất đối tượng và liên kết |
| D08 | Đổi ngày Trip có kiểm tra tác động và lựa chọn cách cập nhật | Không tự đổi Booking đã xác nhận |
| D09 | Place Picker chọn trực tiếp Place M03 | Không tạo Place trùng thuộc M04 |
| D10 | V1.0 lưu/mở địa chỉ và chỉ đường; bản đồ tương tác P1 | Bản đồ nhúng không phải điều kiện nghiệm thu |
| D11 | Quản lý nhiều loại phương tiện/chặng di chuyển | Có Transport Leg, times/timezones |
| D12 | Nhiều Accommodation trong một Trip | Lưu từng giai đoạn lưu trú |
| D13 | Bookings & Documents trong V1.0, quyền riêng | Có quản lý file tài liệu dùng chung an toàn |
| D14 | Packing List và Preparation Checklist, gán người | Tiến độ và cộng tác đúng |
| D15 | Trip Budget liên kết M07, không tạo ledger độc lập | Không cộng trùng khoản chi |
| D16 | Ghi nhiều đồng tiền; quy đổi theo quy tắc rõ | Không cộng sai khi chưa có tỷ giá hợp lệ |
| D17 | Liên kết và đồng bộ sự kiện phù hợp với M05 | Event nguồn thuộc M05, có xử lý sync failure |
| D18 | Hai người cùng quản lý, phát hiện xung đột; không live cursor | Không ghi đè thay đổi độc lập |
| D19 | Completed Activity không tự tạo Visit | Chỉ ghi Visit sau khi xác nhận/liên kết |
| D20 | Recap cơ bản và tạo Travel Photobook từ M01 trong V1.0 | Dữ liệu hợp lệ được tái sử dụng, không nhân bản bừa bãi |
| D21 | Cảnh báo mạng/bảo vệ thay đổi P0; full offline P1 | Không hứa offline hoàn chỉnh trong V1.0 |
| D22 | Xuất dữ liệu chuyến đi cơ bản P0; PDF đẹp P1 | Có export máy đọc/tra cứu được, không bắt buộc layout in |

## 2.1. Quy ước ưu tiên

### P0 — Bắt buộc trong Our Space V1.0

- Trip lifecycle, Dreaming/Quick Trip/Full Trip Planning, danh sách Trip, lọc và tìm kiếm.
- Itinerary theo ngày và Unscheduled, Timeline/Planning View, Activity/Place Picker, thời gian, trạng thái, điều chỉnh thứ tự/ngày.
- Transport, Accommodation, Booking, tài liệu đính kèm có phân quyền.
- Packing List, Preparation Checklist, giao nhiệm vụ, lưu tiến độ.
- Budget tham chiếu M07, Calendar tham chiếu M05, Place và Visit từ M03, ảnh từ M02.
- Địa chỉ và mở hướng dẫn đường; không yêu cầu map nhúng.
- Quản lý đồng thời có chống xung đột, quyền theo Trip và tài liệu nhạy cảm.
- Trip Recap cơ bản, kết nối tạo Diary/Photobook từ M01.
- Archive, Trash 30 ngày, Restore, Search, basic export, kiểm soát lỗi và sao lưu dùng chung.
- Các luồng chính có thể hoàn thành trên điện thoại lẫn desktop.

### P1 — Ưu tiên cao, **không mặc định thuộc V1.0**

- Map tương tác hiển thị hành trình, tuyến đường, ước tính di chuyển và tối ưu địa điểm bằng nguồn hợp lệ.
- Drag-and-drop lịch trình nâng cao, tải chuyến đi để hoạt động offline có chủ đích, template du lịch phong phú.
- Nhập thông tin đặt dịch vụ bán tự động, thông báo nâng cao, xuất PDF lịch trình được dàn trang đẹp.

### P2 — Sau V1.0

- AI đề xuất lịch trình, AI tối ưu tuyến, nhận dữ liệu booking từ email/ảnh, tích hợp đặt dịch vụ và trạng thái chuyến bay, dữ liệu thời tiết tự động, video recap/AI photobook.

## 2.2. Các giới hạn chưa được định lượng

Chưa có số lượng tối đa Trip/Activity/Booking/file, định dạng tài liệu cuối cùng, dung lượng, giới hạn thời lượng, SLA đồng bộ, nhà cung cấp bản đồ, quy tắc tỷ giá, giá hosting, chính sách offline nâng cao. **Không diễn giải việc chưa xác định số thành “vô hạn kỹ thuật”**. Các giới hạn thực tế phải được cấu hình và thông báo trước ở thiết kế kỹ thuật; nếu ảnh hưởng sản phẩm, đưa chủ dự án duyệt.

---

# 3. Người dùng, thuật ngữ và hành trình

## 3.1. Actors

| Actor | Hành vi |
|---|---|
| Trip Owner | Tạo, chia sẻ, điều chỉnh trạng thái và quản lý vòng đời Trip |
| Trip Editor | Tạo/sửa Activity, chỗ ở, checklist theo quyền |
| Trip Commenter | Xem và bình luận nội dung được phép |
| Trip Viewer | Xem nội dung được phép, không tự chỉnh |
| Booking Document Viewer | Chỉ xem tài liệu nếu có quyền đặc thù |
| M01/M02/M03/M05/M06/M07 | Nguồn/đích dữ liệu liên kết, không phải người dùng |

Một tài khoản có thể có quyền khác nhau ở những Trip khác nhau. Hai người là **hai tài khoản độc lập**. Các quyền được kiểm soát ở nguồn dữ liệu, không chỉ ẩn nút UI.

## 3.2. Thuật ngữ

| Thuật ngữ | Định nghĩa chính thức |
|---|---|
| Trip | Đơn vị hành trình từ ý tưởng đến tổng kết |
| Destination | Vùng/thành phố/quốc gia đích; một Trip có nhiều Destination |
| Date Certainty | Mức chắc chắn của thời gian: chưa biết/dự kiến/đã xác nhận |
| Trip Day | Ngày logic trong lịch trình, có thể chưa được gắn ngày lịch khi Trip chưa có ngày |
| Itinerary Item / Activity | Đối tượng hành động cụ thể trong Trip, có thể chưa được xếp lịch |
| Unscheduled | Tập Activity chưa được xếp vào ngày/giờ cụ thể |
| Place | Địa điểm duy nhất theo mô hình M03, có thể là nơi vui chơi bất kỳ |
| Transport Leg | Một chặng đi từ điểm đi tới điểm đến, có mốc giờ và nhà cung cấp tùy chọn |
| Accommodation Stay | Một giai đoạn lưu trú tại một nơi ở |
| Booking | Thông tin dịch vụ đặt chỗ, độc lập với Activity và tài liệu |
| Trip Document | Tài liệu của Trip/Booking, có ACL riêng khi cần |
| Packing List | Danh sách đồ cần mang và trạng thái chuẩn bị |
| Preparation Checklist | Danh sách việc cần làm, có thể gán người/hạn |
| Calendar Event | Sự kiện do M05 sở hữu, liên kết Activity nếu phù hợp |
| Expense | Khoản chi do M07 sở hữu |
| Visit | Lần ghé thực tế do M03 sở hữu, không suy ra từ itinerary |
| Trip Recap | Tổng hợp dữ liệu Trip được phép xem, không tự sinh sự thật mới |
| Travel Photobook | Photobook do M01 sở hữu, có thể bắt đầu bằng nội dung từ M04 |
| Archive | Lưu trữ (không xóa) |
| Trash | Trạng thái xóa mềm có thời gian khôi phục |
| Basic Export | Bản xuất dữ liệu chuyến đi/quan hệ ở định dạng thông dụng, đúng quyền |

## 3.3. Hành trình tổng quát

`Dream Trip → Chốt điểm đến/thời gian → Lập Itinerary → Chuẩn bị Checklist/Booking → In Progress → Xác nhận những trải nghiệm thực tế → Completed → Recap → Travel Photobook → Archive nếu muốn`

Một Trip có thể ngừng hoặc chuyển hướng ở bất kỳ bước phù hợp; không cần mọi Trip bắt buộc có đặt vé hoặc ngân sách.

---

# 4. Mô hình dữ liệu nghiệp vụ, trạng thái, bất biến

## 4.1. 22 đối tượng nghiệp vụ

| ID | Đối tượng | Quan hệ/ý nghĩa |
|---|---|---|
| ENT-M04-01 | Trip | Root entity, owner, privacy, lifecycle |
| ENT-M04-02 | Trip Destination | Nhiều điểm đến có thứ tự và mô tả |
| ENT-M04-03 | Trip Participant | Hai người và các quyền/tham gia |
| ENT-M04-04 | Trip Day | Các ngày trong lịch trình, có thứ tự |
| ENT-M04-05 | Itinerary Item | Activity có ID riêng, ngày/giờ/trạng thái |
| ENT-M04-06 | Activity Place Link | Ref tới Place M03, có thêm ghi chú Trip |
| ENT-M04-07 | Transport Leg | Phương tiện/chặng đi |
| ENT-M04-08 | Accommodation Stay | Kế hoạch và trạng thái lưu trú |
| ENT-M04-09 | Booking | Thông tin đặt dịch vụ và xác nhận |
| ENT-M04-10 | Trip Document | Tài liệu, quan hệ Booking, ACL |
| ENT-M04-11 | Checklist | Nhóm packing/preparation |
| ENT-M04-12 | Checklist Item | Task/đồ dùng, người phụ trách, trạng thái |
| ENT-M04-13 | Budget Reference | Ref ngân sách M07 |
| ENT-M04-14 | Expense Reference | Ref khoản chi M07, ngăn trùng tổng |
| ENT-M04-15 | Calendar Reference | Ref Event M05 |
| ENT-M04-16 | Trip Media Link | Ref ảnh/video M02 |
| ENT-M04-17 | Trip Diary Link | Ref nhật ký M01 |
| ENT-M04-18 | Trip Memory / Recap | View/tổng hợp theo dữ liệu đủ quyền |
| ENT-M04-19 | Permission | ACL Trip và phần con |
| ENT-M04-20 | Change History | Ghi thay đổi quan trọng |
| ENT-M04-21 | Trash Record | Soft-delete, restore window |
| ENT-M04-22 | Trip Template | Mẫu checklist/lịch trình, không là booking thật |

## 4.2. Trường nghiệp vụ Trip

| Trường | Bắt buộc | Quy tắc |
|---|---|---|
| ID | Hệ thống | Ổn định, không phụ thuộc tên |
| Name | Có | Không rỗng sau chuẩn hóa; cho phép trùng tên giữa Trip |
| Description | Không | Nội dung văn bản, không thực thi mã lạ |
| Cover Media | Không | Tham chiếu M02 theo quyền |
| Destinations | Không ở Dreaming | Nhiều điểm đến, có thể bổ sung dần |
| Date Certainty | Có | Unknown / Tentative / Confirmed |
| Start Date / End Date | Không | Nếu đều có thì End >= Start |
| Tentative Period | Không | Lưu tháng/khoảng dự kiến riêng, không bịa ngày |
| Timezone | Khi có giờ cụ thể | Lưu đúng ngữ cảnh địa điểm/hoạt động |
| Main Currency | Khi lập budget | Tiền tệ chính phục vụ hiển thị |
| Status | Có | Mặc định phù hợp cách tạo |
| Owner | Có | Tài khoản tạo/chủ sở hữu |
| Participants | Có owner | Thành viên và quyền tương ứng |
| Visibility | Có | Private mặc định |
| Related Goal | Không | Ref M06 |
| Created At / Updated At | Hệ thống | Có lịch sử và tác nhân thay đổi |

## 4.3. Trường Itinerary Item

- `Activity Name` bắt buộc; `Activity Type` thuộc taxonomy mở (Place Visit, Food, Transport, Accommodation, Entertainment, Shopping, Free Time, Custom).
- Liên kết Trip bắt buộc, Trip Day/Date/Start/End/Duration tùy chọn; `Unscheduled` là trạng thái xếp lịch, **không phải trạng thái hoàn tất Activity**.
- `Place Reference`, `Booking Reference`, `Transport Reference`, `Accommodation Reference`, `Calendar Reference`, `Participants`, `Estimated Cost`, `Attachments`, `Notes`, `Actual Time`, `Completion Note` đều có thể thiếu khi chưa có thông tin.
- `Activity Status`: Idea, Planned, Confirmed, In Progress, Completed, Skipped, Cancelled. Trạng thái không tự động đổi theo đồng hồ.
- `Order`: vị trí trong một ngày/danh sách, phải nhất quán sau thao tác đồng thời.
- Giá dự kiến/ghi chú chi phí tại Activity **không phải bản ghi chi thực tế M07**.

## 4.4. Vòng đời Trip

`Dreaming → Planning → Ready → In Progress → Completed`

Có thể Cancelled hoặc Archived khi phù hợp, và có khả năng hoàn nguyên theo quyền/chính sách. Đây là **lưu đồ điển hình, không phải bộ luật buộc phải đi đủ từng bước**. Ví dụ Trip tạo sát ngày có thể từ Planning sang In Progress; người dùng xác nhận Completed thủ công. Archived là hành vi cất dữ liệu, không thay đổi sự thật chuyến đi.

| Trạng thái | Ý nghĩa | Khả năng chính |
|---|---|---|
| Dreaming | Ý tưởng chưa cam kết | Thêm gợi ý điểm đến, ghi chú, goal |
| Planning | Đang tổ chức | Itinerary, bookings, budget, checklists |
| Ready | Người dùng chủ động xác nhận sẵn sàng | Vẫn có thể chỉnh nếu quyền cho phép |
| In Progress | Hành trình đang diễn ra | Xem ngày hiện tại, đánh dấu activity |
| Completed | Người dùng xác nhận kết thúc | Recap, kỷ niệm, vẫn bổ sung dữ liệu muộn |
| Cancelled | Không thực hiện | Giữ lịch sử, có thể tái sử dụng kế hoạch |
| Archived | Cất khỏi danh sách hoạt động | Không xóa dữ liệu gốc hoặc ref |
| Trashed | Đang chờ xóa theo quy trình | Restore theo chính sách 30 ngày |

**Không đồng nhất Cancelled/Archived/Trashed với nhau**. Một Trip Completed có thể Archived; Archive là thuộc tính lưu trữ riêng với lifecycle khi cần. Một Trip Trashed không được hiển thị như Trip đang hoạt động.

## 4.5. Cardinality và các bất biến quan hệ

1. Một Trip có 0..n Destinations, 0..n Trip Days, 0..n Activities, 0..n Transport Legs, 0..n Accommodation Stays, 0..n Bookings, 0..n Checklists.
2. Một Trip Day có 0..n Activity; Activity có thể chưa có ngày hoặc giờ. ID Activity không thay đổi khi đổi ngày/thứ tự.
3. Một Place thuộc M03 có thể dùng cho nhiều Trip và Activities; M04 không sở hữu Place trùng.
4. Một Booking có thể dùng cho nhiều Activity và nhiều người, không buộc nhân bản Booking theo người.
5. Một Activity có thể gắn Place hoặc không, có thể gắn Booking/Transport/Accommodation khi phù hợp.
6. Một Checklist có nhiều Items, trạng thái từng Item độc lập; quyền thao tác theo Trip và đối tượng nếu có ngoại lệ.
7. Một Trip liên kết 0..n Media, Diary, Visit, Calendar Events và Expenses của phân hệ khác; các đối tượng gốc không bị xóa dây chuyền.
8. Một Expense liên kết nhiều đối tượng trong cùng Trip được **tính một lần** khi tổng hợp theo Expense ID, theo quy tắc M07.
9. Quyền theo nội dung con có thể **hạn chế** so với Trip; Shared Trip không tự công khai Booking Document, ảnh Private, Expense Private.
10. Mọi trường thời gian có giờ cụ thể phải có timezone/offset hoặc ngữ cảnh múi giờ đúng; không biến lịch trình quốc tế thành giờ Việt Nam giả định.

---

# 5. Sitemap, 18 màn hình, trạng thái giao diện

## 5.1. Sitemap logic

```text
Our Space / Travel
  TP-01 Travel Home
  TP-02 Trips Library
  TP-03 Create/Edit Trip
  TP-04 Trip Overview
    TP-05 Itinerary Planner
      TP-06 Day Detail
      TP-07 Activity/Stop Editor
      TP-08 Place Picker (M03)
    TP-09 Transport Planner
    TP-10 Accommodation Manager
    TP-11 Bookings & Documents
    TP-12 Packing & Checklists
    TP-13 Trip Budget (M07)
    TP-14 Trip Calendar (M05)
    TP-15 Trip Map & Route
    TP-16 Collaboration & Permissions
    TP-17 Trip Memories & Recap (M01/M02/M03)
  TP-18 Search, History & Archive
```

Một `TP-xx` có thể là trang, tab, dialog hoặc panel. Đây là mã giao diện nghiệp vụ, **không phải bắt buộc 18 route độc lập**.

## 5.2. Bảng 18 màn hình và năng lực

| Mã | Tên | Dữ liệu hiển thị bắt buộc | Thao tác chính | Quyền |
|---|---|---|---|---|
| TP-01 | Travel Home | Next Trip, Dreams, Planning, Completed, checklist attention | Create/Open/Search | Chỉ dữ liệu đủ quyền |
| TP-02 | Trips Library | Card/list tên, bìa, ngày hoặc tentative, status, participant | Filter/Sort/Duplicate/Archive | Theo ACL |
| TP-03 | Create/Edit Trip | Name, description, destinations, dates/precision, cover, roles | Save/Create/Share | Create/Owner/Editor |
| TP-04 | Trip Overview | Header, progress, itinerary, booking, checklist, budget | Open sections/change status | Read/Edit theo vai trò |
| TP-05 | Itinerary Planner | Timeline, Planning View, days, Unscheduled | Add/reorder/move/duplicate | Editor |
| TP-06 | Day Detail | Day activities, hours, travel notes, conflicts | Add/edit/reorder | Editor |
| TP-07 | Activity Editor | Type, time, place, participants, notes, status | Save/Complete/Link | Editor |
| TP-08 | Place Picker | Search M03, preview, collections, access rights | Select/Create linked Place | Theo M03 + M04 |
| TP-09 | Transport Planner | Legs, providers, times, status, cost link | Add/edit/cancel | Editor |
| TP-10 | Accommodation | Stays, check-in/out, status, attachments | Add/edit/cancel | Editor |
| TP-11 | Bookings & Documents | Booking ref, provider, documents, status | Add/upload/view/download | Theo quyền con |
| TP-12 | Packing & Checklists | Groups, assignee, quantity, done, due | Add/assign/check/copy | Editor |
| TP-13 | Trip Budget | Planned vs actual, breakdown, currency | Link/create expense via M07 | Theo M07 |
| TP-14 | Trip Calendar | Activity events, local dates/timezones, sync state | Create/link/update event | Theo M05 |
| TP-15 | Trip Map & Route | Saved addresses/list ordered stops | Open directions/external map | Theo M03 |
| TP-16 | Collaboration & Permissions | Members, roles, changes, document access | Share/revoke/change roles | Owner/delegated |
| TP-17 | Trip Memories & Recap | Actual activities, visited places, photos, diary, basic recap | Link/create Diary/Photobook | Theo nguồn |
| TP-18 | Search, History & Archive | Search/status/year/owner, audit summary, Trash | Find/archive/restore/export | Theo quyền |

## 5.3. Trạng thái UI dùng chung

Mỗi màn hình dữ liệu phải xử lý: `Loading`, `Empty`, `Success`, `Validation Error`, `Forbidden`, `Network Error`, `Partial Sync`, `Conflict`, `Archived/Trashed`. Nội dung chưa có không được hiển thị là đã hoàn tất; thao tác thay đổi chưa lưu không được hiển thị 'Saved'. Nút không phù hợp quyền phải ẩn/vô hiệu hóa nhưng **server/data access** vẫn là tầng kiểm soát chính.

## 5.4. Navigation và khả năng truy cập

Desktop có sidebar/tab điều hướng đầy đủ, lịch trình theo nhiều cột khi phù hợp. Mobile có thanh điều hướng gọn, day tabs hoặc danh sách dọc, bottom sheets cho thêm Activity/Place; vẫn hỗ trợ thao tác tạo/sửa/xóa/chia sẻ theo quyền. Hỗ trợ cỡ chữ, focus/keyboard và thao tác cảm ứng đủ lớn; không dựa độc quyền vào kéo thả hoặc màu sắc.

---
# 6. Trip Management và quy trình tạo nhanh/đầy đủ

## 6.1. TP-01 — Travel Home

**Mục đích:** Điểm vào tự nhiên của Travel, tập trung những hành động sắp xảy ra và kỷ niệm đã lưu, không phải bảng dữ liệu công việc thuần túy.

**Thành phần:** `Our Next Adventure` (Trip sắp tới nếu có), Dreams, Planning, Completed, checklist cần chú ý, Trip gần cập nhật, nút `Create Trip`, ô tìm kiếm và lối vào Library. Dữ liệu minh họa chỉ dùng khi trình bày demo, **không được dùng tên/ngày/chi phí giả làm dữ liệu thực của hai người**.

**Nghiệp vụ:** Click Trip card → TP-04; click create → TP-03; click checklist cần xử lý → TP-12 trong Trip; click Dream → mở hoặc chuyển sang lên kế hoạch. Không hiển thị nhắc việc hoặc booking thuộc nội dung bị hạn chế. Nếu không có Trip, hướng dẫn tạo lần đầu. Trên mobile, nhóm Upcoming/Dreams/Recently Completed thành thẻ cuộn dễ chạm.

## 6.2. TP-02 — Trips Library

**Danh sách:** Card hoặc List: cover M02, name, destination(s), status, chủ sở hữu, collaborators được phép hiển thị, thời gian chính xác hoặc tentative, update timestamp. Có các nhóm `All`, `Dreaming`, `Planning`, `Upcoming`, `In Progress`, `Completed`, `Archived` và `Trash` theo quyền; nhóm Upcoming được xác định từ ngày có thực, không gán cho Dream chưa có ngày.

**Hành động:** Search/Filter by destination, year, participant, status; sort by updated, created, confirmed start; open detail; duplicate; archive; restore. Tùy quyền, không tạo cơ chế xem lén tên Trip Private trong thống kê hoặc search. Với Trip thiếu ngày, sắp xếp theo ngày cập nhật và hiển thị “Chưa chốt ngày”, không tự gán ngày 01/01.

**Duplicate Trip:** Cho chọn sao chép itinerary, destination, checklist template, notes. Mặc định **không** sao chép trạng thái Completed của task, actual expenses M07, actual visits, confirmed bookings, private documents, mã vé hoặc lịch M05. Nếu tác giả muốn nhân bản booking/ảnh/tài liệu, phải có thao tác riêng và kiểm tra quyền, tránh hứa đặt dịch vụ thật.

## 6.3. TP-03 — Create/Edit Trip

### Quick Trip (P0)

Mục đích tạo trong ít thao tác:

1. Nhập tên Trip (bắt buộc); tùy chọn điểm đến, ngày, cover.
2. Chọn `Dreaming` hoặc `Planning`, hoặc để hệ thống đề xuất dựa trên **lựa chọn hiển thị rõ**; không đoán việc đã sẵn sàng.
3. Mặc định `Private`. Nếu muốn chia sẻ, chọn quyền cho người còn lại.
4. Lưu; nếu thành công đến TP-04; cho thêm Activity/Place ngay.

Kết quả: Trip hợp lệ tồn tại dù chưa có itinerary, accommodation, booking hay expense.

### Full Trip Planning (P0)

Trên cùng một Trip, mở các tab và bổ sung lần lượt `Destinations → Dates → Participants → Itinerary → Transport/Stay/Bookings → Checklist → Budget`. Không yêu cầu hoàn thành đầy đủ mới được Save. Người dùng có thể quay lại thay đổi mỗi phần theo quyền.

### Form Create/Edit

- **Name:** bắt buộc, cảnh báo khi chỉ khoảng trắng; có thể trùng tên với Trip khác vì ID riêng.
- **Description:** tùy chọn; không bắt buộc format học thuật hay lịch trình chi tiết.
- **Cover:** chọn media M02 đủ quyền; nếu chưa có, dùng placeholder.
- **Destination(s):** nhập mô tả vùng/thành phố/quốc gia, có thể link Place M03 khi đúng bản chất. Một Trip nhiều destination; cho reorder.
- **Date Certainty:** `Unknown`, `Tentative Period`, `Confirmed Dates`; không tạo ngày giả từ kỳ vọng tháng.
- **Dates:** nếu đầy đủ, `end >= start`; day trip cho phép cùng ngày. Khi thay đổi cần hiển thị impact preview.
- **Timezone:** chọn/ngữ cảnh địa phương khi dùng giờ hoạt động. Không mặc định giờ server/giờ trình duyệt cho mọi Activity.
- **Main Currency:** dành cho budget theo M07. Nếu chưa lập ngân sách, có thể chưa chọn.
- **Participants:** Owner mặc định; người còn lại có thể được cấp quyền nếu chủ sở hữu chia sẻ.
- **Visibility:** Private mặc định, dùng lại quy tắc ACL của toàn hệ thống.

### Form behavior

`Save` thể hiện rõ `Saving / Saved / Failed`; lưu thất bại thì không điều hướng như đã thành công. Nếu rời màn hình khi có thay đổi chưa được xác nhận, cảnh báo. Khi cùng sửa cùng field, có xử lý xung đột, không lấy bản cuối im lặng. Duplicate name không phải validation error; ngày end < start là validation error. Nội dung cover riêng tư được kiểm tra quyền trước khi Trip shared.

## 6.4. TP-04 — Trip Overview

**Thông tin:** header bìa, tên, destination(s), status, date certainty, dates hoặc tentative, participants, progress, planned activities, upcoming tasks, booking summary (theo quyền), budget view (M07), recent changes.

**Tabs:** `Overview | Itinerary | Places | Transport | Stay | Bookings | Checklist | Budget | Memories` và liên kết Calendar, Map, Share/Settings theo quyền.

**Hành động:** Edit Trip, add Activity, open relevant section, update lifecycle, share, archive, create Diary/Photobook when appropriate. Không bắt người dùng phải hoàn thành 100% checklist mới chuyển Ready; Ready do người có quyền **xác nhận**. Nếu Trip Cancelled, vẫn xem lại nội dung, but edit/resume behavior theo quyền/quy trình xác nhận. Nếu Completed, vẫn thêm actual expense/media/diary ghi nhận muộn.

## 6.5. Đổi ngày và di chuyển Trip

Đây là nghiệp vụ bắt buộc, không chỉ sửa hai ô ngày:

1. Người dùng sửa start/end hoặc tentative period.
2. Hệ thống xác định Trip Day/Activity có ngày cố định, Calendar Event M05 đã liên kết, Booking đã xác nhận, Transport Leg, Accommodation Stay, checklist due date, những giờ có timezone khác nhau.
3. Hiển thị **impact preview** theo nhóm: có thể chuyển tự động với sự đồng ý, không được tự chuyển, cần cập nhật thủ công.
4. Cho các lựa chọn **Dời theo độ lệch ngày** đối với Activity chưa bị cố định hoặc **Giữ lịch chi tiết như cũ** để người dùng chỉnh riêng (có thể chọn nhóm nếu UX cho phép).
5. **Không đổi bất kỳ xác nhận dịch vụ bên ngoài** chỉ vì người dùng đổi Trip. Booking/flight/hotel phải hiển thị “cần kiểm tra/đổi với nhà cung cấp” nếu liên quan.
6. Áp dụng có kiểm soát, cập nhật liên kết M05 trong phạm vi được phép; nếu một phần thất bại, hiển thị trạng thái từng phần và cách sửa lại, không thông báo cả thao tác đã hoàn tất nếu chưa nhất quán.
7. Ghi thay đổi vào lịch sử.

Không tự xóa Activity nằm ngoài khoảng ngày mới: đưa vào `Unscheduled` hoặc cảnh báo theo lựa chọn đã xác nhận. Bất kỳ lựa chọn nào có nguy cơ mất ngày/giờ gốc phải có khả năng khôi phục/historical record.

---

# 7. Itinerary Planner, hoạt động và Place Picker

## 7.1. TP-05 — Itinerary Planner (P0)

**Hai chế độ dùng chung một mô hình Activity:**

- **Timeline View:** nhóm theo từng ngày và giờ tại địa điểm, có hoạt động chưa có giờ ở vùng phù hợp, thuận tiện lúc đang đi.
- **Planning View:** bảng/thẻ theo Day 1, Day 2... và `Unscheduled`; thuận tiện sắp xếp khi lên kế hoạch.

**Chức năng `IT-01..IT-14`:** Add Day, Add Activity, Add Place M03, Reorder, Move to Day, Duplicate, Set Time, Set Duration, Notes, Change Status, Unscheduled, Add Media M02, Calendar Link M05, Change History.

**Itinerary không phụ thuộc ngày xác nhận:** Một Trip Dreaming có thể có danh sách ý tưởng và Day 1/Day 2 dạng logic, khi chốt lịch người dùng mới gán ngày. Nếu hoạt động thiếu giờ, hiển thị “Chưa chọn giờ”; không tạo 08:00 mặc định như dữ liệu thật.

### Quy tắc thao tác

- Add Day và Add Activity có quyền Editor; các thêm mới độc lập của A/B không ghi đè nhau.
- Reorder thay `order` trong Day/Unscheduled, không thay ID hay các ref.
- Move Activity sang ngày khác giữ toàn bộ notes, attachments, Place/Booking links, participants, status; nếu giờ không còn phù hợp, cảnh báo hoặc cho người dùng chọn giữ/đặt lại giờ.
- Duplicate Activity tạo ID mới, không tự sao chép Booking đã xác nhận, Visit thực tế, expense thực tế hay tài liệu riêng; trình bày rõ tùy chọn nguồn.
- Overlap không cấm tuyệt đối; có cảnh báo nếu thời gian của **cùng người tham gia** hoặc hoạt động chắc chắn xung đột, không tính toán bằng route giả.
- Start/End/Duration: validate end >= start theo **ngữ cảnh ngày/múi giờ**, hỗ trợ qua nửa đêm khi xác định ngày kết thúc đúng.
- `Unscheduled` không đồng nghĩa Cancelled và không xóa ngày hoạt động trước đó khỏi audit khi chuyển sang Unscheduled.
- Status không tự Completed theo thời gian. Chỉ người được phép mới xác nhận.

## 7.2. TP-06 — Day Detail

Hiển thị tiêu đề ngày theo trip day index, ngày lịch nếu có, local timezone nếu cần, danh sách Activity theo giờ hoặc thứ tự, cảnh báo trùng lịch, ghi chú ngày, shortcut Add Activity/Add Place. Có liên kết Transport/Accommodation hợp lệ, nhưng không tự thêm dữ liệu từ Booking thành Activity nếu chưa xác nhận.

**Màn hình hoạt động trong chuyến đi:** dễ xem trên điện thoại; scroll từng ngày, hiển thị địa chỉ/giờ/ghi chú được phép, mở Directions. Không tự đòi quyền GPS; nếu offline P0, cảnh báo rõ và chỉ hiện những dữ liệu đã tải và được phép, không cam kết mọi chức năng offline.

## 7.3. TP-07 — Activity / Stop Editor

**Trường:** `Name` bắt buộc, `Type` bắt buộc, `Trip` bắt buộc, `Day/Date`, `Start/End`, `Place Ref`, `Notes`, `Participants`, `Estimated Cost`, `Booking/Transport/Stay Ref`, `Attachments`, `Status`, `Actual Time`, `Completion Note` tùy chọn.

**Activity Types:** Place Visit, Food/Drink, Transport, Accommodation, Entertainment, Shopping, Free Time, Custom; danh mục mở để không cần tạo Place cho hoạt động trừu tượng.

**Actions:** Create, edit, duplicate, move, reorder, mark status, unlink Place, link/unlink Calendar Event, attach media/doc theo quyền, delete to Trash/quy trình bảo vệ liên kết. Edit trên mobile phải có form/bottom sheet có thể sử dụng bằng cảm ứng và không lệ thuộc drag-and-drop.

**Completion:** Khi mark Completed, hiển thị gợi ý `Record Visit` chỉ nếu Activity liên kết Place M03. Có thể bỏ qua. Nếu đã có Visit phù hợp thì cho chọn link; không tự tạo Visit hoặc định nghĩa tham gia thực tế của người kia. Việc hoàn tất Activity không tự đánh dấu Booking used, Expense paid, Trip Completed hoặc Goal M06 achieved.

## 7.4. TP-08 — Place Picker (M03)

**Nguồn:** Tìm Place từ M03 (mọi loại địa điểm vui chơi, không chỉ quán ăn), lọc theo nhóm, khu vực, wishlist/collection mà người dùng có quyền xem. Có preview địa chỉ, cover, note phù hợp; nếu chưa có Place, hỗ trợ gọi luồng tạo M03 và quay lại sau khi Save hợp lệ.

**Quyền:** Chỉ cho chọn Place mà người dùng có quyền **sử dụng**. Place Private đưa vào Trip Shared cần xác nhận rõ cách chia sẻ hoặc tạo bản sao có quyền phù hợp theo quy tắc M03. Không cho người khác suy đoán tên/vị trí Private thông qua itinerary, search, preview, thống kê hoặc calendar.

**Liên kết:** Lưu `Place Ref` ổn định và dữ liệu ghi chú riêng cho Activity. Đổi tên Place có thể cập nhật thông tin tham chiếu tùy chế độ hiển thị; không ghi đè note của chuyến đi. Place xóa mềm hoặc mất quyền: Activity giữ ID/ngữ cảnh, hiển thị “Địa điểm không còn khả dụng” phù hợp, không lộ dữ liệu bị thu hồi và không biến mất.

---

# 8. Transport, Accommodation, Booking, Documents

## 8.1. TP-09 — Transport Planner

**Transport Types:** máy bay, tàu hỏa, xe khách, ô tô, xe máy, taxi/ride-hailing, tàu/phà, đi bộ và Custom. Loại phương tiện không quyết định thay thời gian thực tế nếu không có dữ liệu.

**Transport Leg fields:** ID, Trip, type, departure point/place, arrival point/place, departure local datetime/timezone, arrival local datetime/timezone, provider, booking reference, status, estimated cost, expense reference M07, note, linked Activity(s).

**Rules:**

1. Một Trip có nhiều Legs, có thể qua nhiều địa điểm quốc gia.
2. Arrival phải hợp lệ về trình tự thời gian thực, kể cả khi giờ địa phương trông nhỏ hơn departure do khác timezone; không so sánh chuỗi giờ thô.
3. Booking/Transport Leg/Activity là **ba đối tượng khác nhau có thể liên kết**, không tạo hai vé giả cho một chặng.
4. Cancel Transport không xóa Booking gốc hoặc Activity, trừ thao tác có chủ đích và theo quyền.
5. Chưa có Booking vẫn được lên kế hoạch chặng.
6. Nếu thay ngày Trip, cảnh báo Legs/Booking đã được xác nhận và không tuyên bố lịch của hãng vận chuyển thay đổi.
7. Không có kết nối hãng bay trong P0, vì vậy mọi trạng thái bay hiển thị là dữ liệu người dùng ghi nhận hoặc nguồn được xác thực sau này; không tuyên bố live availability.

## 8.2. TP-10 — Accommodation Manager

**Một Accommodation Stay:** tên nơi ở, Place Ref/địa chỉ, start check-in, end check-out, reservation status, Booking Ref, contact, planned cost/expense M07, notes, documents link. Có thể sử dụng nhiều stays, chuyển khách sạn giữa hành trình, chỗ ở dự kiến chưa đặt.

**Status:** Considering/Planned, Booked, Confirmed, Cancelled hoặc tương đương được quy chuẩn hóa trong technical design; khác với lifecycle Trip. Không suy ra đã đặt phòng khi người dùng chỉ thêm vào kế hoạch.

**Validation:** check-out >= check-in theo địa phương, có thể cùng ngày nếu loại stay cho phép và có xác nhận rõ. Nếu check-in/out chưa biết chính xác, cho lưu ngày dự kiến hoặc chưa có giờ; không bịa giờ khách sạn thực tế. Khi đổi chỗ ở, giữ những Activity/Booking đã link cho đến khi được xử lý rõ.

**Privacy:** Liên hệ/mã phòng/địa chỉ và tài liệu có thể là nội dung hạn chế hơn Trip. Không xuất dữ liệu bị hạn chế cho Viewer không đủ quyền.

## 8.3. TP-11 — Bookings & Documents

### Booking

Các loại: vé máy bay, tàu/xe, phòng, vé tham quan, vé sự kiện, tour, dịch vụ khác. Thông tin gồm Booking ID, service type, provider, reference code tùy chọn, status, ngày giờ, người liên quan, expected/actual cost link M07, Activity/Transport/Accommodation link, notes và tài liệu.

**Vòng đời đề xuất:** Idea/To Book → Booked → Confirmed → Used/Completed hoặc Cancelled. Không tự suy ra đã đặt/hủy/đổi vé từ thay đổi itinerary. `Booked` khác với `Confirmed` khi có nhà cung cấp yêu cầu xác nhận. Không tạo booking thực tế bên ngoài từ thao tác Save trong M04.

**Điểm chú ý:** một Booking có thể áp dụng nhiều người/Activity; người dùng chọn liên kết, không phải sao chép mã đặt chỗ thành nhiều bản độc lập. Thông tin actual price M07 chỉ là một ref nếu đã phát sinh Expense.

### Trip Documents (P0)

Tài liệu: vé điện tử, PDF/ảnh xác nhận, hướng dẫn check-in, bản lịch trình, tài liệu cần cho hành trình. **M02 V1.0 tập trung ảnh/video**, vì vậy file PDF/tài liệu cần **năng lực quản lý file/tài liệu dùng chung** hoặc phần hạ tầng được thiết kế riêng trong giai đoạn kỹ thuật; **không ép PDF vào Media Asset ảnh/video của M02**.

**Upload/attach:** chọn file → validate loại/kích thước dựa trên cấu hình được duyệt → chọn Booking/Trip liên quan → xác nhận quyền → upload → hiển thị trạng thái. File nhạy cảm mặc định không công khai theo quyền chung của Trip nếu cài ACL hạn chế. Chưa chốt tập định dạng và dung lượng chính thức; kỹ thuật phải nêu rõ trước triển khai, không bỏ tính năng Document P0 chỉ vì M02 chưa có PDF.

**Privacy/Security:** không yêu cầu lưu số thẻ ngân hàng, hộ chiếu đầy đủ chỉ để quản lý trip. Mã đặt chỗ/QR, thông tin liên hệ, tên trên vé và tài liệu được kiểm soát quyền và redaction preview khi cần. Không đưa mã booking/QR vào notification, search snippet, feed hoặc recap không đúng quyền. Viewer không đủ quyền không xem được file qua URL trực tiếp hoặc thông tin tên tài liệu nếu metadata cũng hạn chế. Khi gỡ tài liệu khỏi Booking không tự xóa file gốc nếu còn nơi sử dụng hợp lệ.

**Không cam kết:** đồng bộ email, thay đổi booking tại hãng, kiểm tra vé thật, đọc OCR/AI, tự đổi lịch đặt phòng ở P0.

---

# 9. Packing, Preparation và Trip Budget

## 9.1. TP-12 — Packing & Checklists

**Phân biệt hai nhóm:**

- `Packing List`: đồ cần mang, ví dụ quần áo, sạc, máy ảnh, giấy tờ; trường `Name`, `Category`, `Quantity`, `Assigned To`, `Packed/Status`, `Notes`.
- `Preparation Checklist`: việc cần làm, ví dụ mua vé, kiểm tra thời tiết, chuẩn bị giấy tờ; trường `Name`, `Assigned To`, `Due Date`, `Status`, `Notes`, `Related Booking/Activity`.

**UI:** nhóm theo loại/assignee, thêm/sửa/xóa, tick hoàn thành, hoàn tác khi có quyền, progress numerators/denominators, highlight quá hạn theo local day; không tự coi Trip Ready khi checklist hoàn thành.

**Cộng tác:** hai người có thể thêm/tick mục khác nhau, không ghi đè; cùng tick một mục phải đưa ra trạng thái cuối nhất quán, cập nhật của bên kia có thể được thông báo. Một Item có ID ổn định. Nếu assign B, đây là giao nhiệm vụ, không tự chứng minh B đã xác nhận nhận việc; có thể hiển thị người tạo giao.

**Copy checklist:** cho sao chép từ mẫu hoặc Trip trước; mặc định reset `Completed/Packed` và không sao chép dữ liệu riêng tư không có quyền. Người dùng được chọn những mục muốn giữ, không tự sao chép mọi mã đặt chỗ hay thông tin đã cũ.

## 9.2. TP-13 — Trip Budget (M07 là nguồn chính thức)

**Mục đích:** hiển thị planned/actual, theo danh mục: Transport, Accommodation, Food & Drinks, Attractions, Shopping, Activities, Misc, Contingency. Có thể thêm loại danh mục nhưng không tạo ledger riêng.

**Các số liệu:** `Planned Budget`, `Committed/Booked Cost` nếu M07 hỗ trợ, `Actual Expenses`, `Remaining/Variance` theo quy tắc định nghĩa và phạm vi quyền. Không hiển thị `0` khi chưa có dữ liệu tương đương "chưa chi", phải phân biệt `không có dữ liệu` với `chi phí bằng 0`.

**Hành vi:** click Add Expense chuyển qua nghiệp vụ M07 hoặc form dùng chung tạo M07 expense; liên kết Trip/Booking/Activity/Visit theo ID. Khi nhiều ref trỏ tới một Expense, tổng theo Trip **chỉ đếm một lần**. Nếu expense được sửa/xóa/ẩn ở M07, M04 cập nhật hoặc hiển thị placeholder theo quyền.

### Đa tiền tệ

M04 hỗ trợ lưu khoản dự toán/giao dịch nhiều currency, chọn main currency để xem tổng. **Không cộng số lượng khác đơn vị nếu chưa xác định tỷ giá và thời điểm quy đổi.** Cần một trong hai hành vi: hiển thị tổng từng currency độc lập hoặc hiển thị giá trị quy đổi theo nguồn/quy tắc M07 đã được xác nhận; không tự phát minh tỷ giá hoặc mặc định mọi khoản là VND.

Một khoản chi Private không được làm lộ số tiền thực tế qua `Total Spending` cho người không có quyền. Nếu tổng chỉ trên khoản đủ quyền, ghi rõ phạm vi như “Chi phí bạn được phép xem”.

---

# 10. Trip Calendar, bản đồ, múi giờ và tiền tệ

## 10.1. TP-14 — Trip Calendar (liên kết M05)

M04 quản lý Activity trong Trip. M05 quản lý Calendar Event. Với Activity cần xuất hiện ở lịch chung, người dùng tạo hoặc liên kết **một** Event M05; không tạo bản sao theo ngày mỗi lần cập nhật.

**Sync rules:**

- Activity có thể chưa có Calendar Event; không bắt buộc đưa tất cả hoạt động lên lịch chung.
- Nếu Activity đã link Event M05, sửa giờ có quyền tại M04 → yêu cầu đồng bộ M05. Sửa tại M05 → phản ánh hợp lệ tại M04.
- Cần quy định rõ **trường nào có chủ quyền dữ liệu**: Activity notes/status thuộc M04, Event reminder và dữ liệu lịch thuộc M05. Trường thời gian được chia sẻ phải có quy trình đồng bộ/xung đột thay vì hai bản lưu song song độc lập.
- Đồng bộ thất bại → hiển thị `Sync Pending/Failed`, dữ liệu nào đã lưu và dữ liệu nào chưa; hỗ trợ retry, không tạo event duplicate.
- Concurrent edits hai chiều → so sánh thay đổi và đưa ra cơ chế xử lý nếu không thể hợp nhất an toàn.
- Huỷ/xoá Activity phải hỏi rõ xử lý Event: unlink, huỷ Event theo quyền hoặc giữ Event; không xoá tự động mù quáng.

## 10.2. TP-15 — Trip Map & Route

**P0:** hiển thị địa chỉ và các stop theo thứ tự, chỉ khi Place có địa chỉ/toạ độ hợp lệ; nút Directions mở app/site bản đồ bên ngoài theo đường dẫn hợp lệ. Nếu link hỏng hoặc không có ứng dụng phù hợp, hiện địa chỉ và phương án sao chép/mở trong trình duyệt khi có thể. Xin quyền vị trí chỉ khi chức năng cụ thể cần và người dùng đồng ý.

**Không thuộc P0:** hiển thị tất cả pins trên bản đồ nhúng trong website, tối ưu thứ tự tuyến đường, ETA real-time, phân tích giao thông, live directions. Không tự suy ra thời gian từ khoảng cách đường chim bay hoặc dữ liệu thiếu.

## 10.3. Quy tắc ngày giờ, timezone, DST

1. Phân biệt `Trip.Date Certainty = Unknown/Tentative/Confirmed` và thời gian sự kiện cụ thể.
2. Mỗi datetime sự kiện cụ thể mang ngữ cảnh timezone địa phương. Với transport quốc tế, departure/arrival có thể ở các timezone khác nhau; thời lượng xác định theo mốc thời gian thực, không trừ đồng hồ local thô.
3. `Trip Day 1/Day 2` có thể tồn tại ở chuyến Dreaming; không tự gán mốc ngày tuyệt đối.
4. Activity kéo qua đêm hoặc băng qua đường đổi ngày quốc tế không bị ép end timestamp cùng một local date.
5. Khi timezone thiết bị thay đổi, người dùng vẫn xem đúng ngày/giờ tại điểm đến, có nhãn timezone khi cần.
6. Nếu người dùng chọn một giờ không tồn tại/trùng lặp do DST, UX phải hỏi/cảnh báo thay vì tự chỉnh ngầm. Các quy tắc kỹ thuật normalize thời gian sẽ được xác định ở thiết kế kỹ thuật phù hợp dữ liệu người dùng.
7. `Completed` chỉ thay khi người dùng xác nhận, không tự theo mốc đồng hồ.

## 10.4. Quy tắc tiền tệ và số liệu

Tất cả số tiền hiển thị kèm currency; giá dự kiến và chi phí thực tế là hai nhóm riêng; tránh biến tiền tệ thành text trang trí gây sai tổng. Nếu mức tỷ giá thay đổi, lịch sử quy đổi/nguồn M07 phải minh bạch. M04 không tự gán tỷ giá thị trường hiện hành trong giai đoạn P0.

---

# 11. Collaboration, quyền riêng tư và lịch sử

## 11.1. TP-16 — Ma trận quyền đề xuất được thông qua theo toàn bộ đề xuất M04

| Hành động | Owner | Editor | Commenter | Viewer |
|---|---|---|---|---|
| Xem Trip và nội dung Trip được phép | Có | Có | Có | Có |
| Tạo/sửa Itinerary, Place Link | Có | Có | Không | Không |
| Thêm/sửa checklist và tick mục | Có | Có | Không | Không |
| Quản lý Transport/Stay/Booking | Có | Có, theo ACL con | Không | Không |
| Xem Booking Documents hạn chế | Theo ACL riêng | Theo ACL riêng | Theo ACL riêng | Theo ACL riêng |
| Bình luận vào Trip | Có | Có | Có | Không |
| Đổi lifecycle Trip | Có | Nếu được cấp | Không | Không |
| Chia sẻ hoặc cấp quyền | Có | Chỉ nếu được ủy quyền | Không | Không |
| Archive/Restore | Có | Nếu được cấp | Không | Không |
| Xóa vĩnh viễn | Theo quy trình Owner | Không mặc định | Không | Không |
| Xem/tạo Expense/Diary/Media liên kết | Theo quyền nguồn | Theo quyền nguồn | Theo quyền nguồn | Theo quyền nguồn |

Không xem quyền Owner/Editor Trip là quyền toàn năng với mọi nguồn liên kết. Media của M02, Place/Visit M03, Diary M01 và Expense M07 vẫn có ACL nguồn; Booking Document cũng có thể hạn chế hơn Trip.

## 11.2. Quy tắc Privacy

- New Trip mặc định **Private**. Chia sẻ phải là thao tác có chủ đích, có preview phạm vi.
- Search, notifications, thumbnails, thống kê, activity feed, recap, export đều kiểm tra quyền như trang chi tiết.
- Trip Shared không tự chia sẻ file PDF/QR/mã đặt chỗ hoặc chi phí Private.
- Revoke Editor trong khi phiên edit còn mở: chặn những write requests tiếp theo và xử lý thay đổi chưa lưu. Không được chỉ ẩn nút.
- Nếu mất quyền đọc một nội dung con, trong Trip có thể giữ mối liên kết/trạng thái trung tính nhưng không cho xem dữ liệu nhạy cảm; không có leak qua tooltip/URL hoặc số lượng kết quả.
- Không đảm bảo thu hồi bản tải xuống/chụp màn hình đã tồn tại trên máy người khác; chỉ có thể quản lý truy cập trong hệ thống.

## 11.3. Cộng tác không live cursor (D18)

**V1.0 P0:** hai tài khoản có thể cùng xem/sửa lịch trình, Trip, checklist, các phần theo quyền. Thêm độc lập không ghi đè; cập nhật cùng thuộc tính có kiểm tra xung đột; mọi phiên thấy trạng thái đã lưu nhất quán sau đồng bộ. Không bắt buộc live cursor, co-edit text character-by-character hoặc thấy người kia kéo thả trên canvas như M01.

### Ma trận cạnh tranh dữ liệu

| Tình huống | Kết quả nghiệp vụ |
|---|---|
| A tạo Activity ngày 1, B tạo Activity ngày 2 | Cả hai tồn tại |
| A và B tạo Activity cùng ngày | Cả hai tồn tại; thứ tự nhất quán |
| A sửa thời gian, B sửa ghi chú khác thuộc tính | Giữ cả hai nếu hợp lệ |
| A và B sửa cùng giờ của một Activity | Phát hiện xung đột, xử lý minh bạch |
| A reorder, B reorder đồng thời | Trật tự cuối phải thống nhất và không mất item |
| A tick checklist X, B tick checklist Y | Giữ cả hai cập nhật |
| A huỷ Trip, B đang sửa | B nhận trạng thái mới; không gửi thay đổi không hợp lệ |
| A thu hồi quyền B đang editing | Các thao tác mới của B không được chấp nhận |
| A sửa Event tại M05, B sửa Activity tương ứng tại M04 | Có quy trình conflict/sync, không sinh event trùng |
| Một phiên offline/bị trễ gửi bản Trip cũ lên | Không ghi đè toàn bộ Trip đã được sửa ở phiên khác |

**Trạng thái UI:** `Saving`, `Saved` (chỉ sau xác nhận), `Sync Pending`, `Network Error`, `Conflict`, `Permission Changed`. Nếu không hợp nhất an toàn, người dùng thấy bản cũ/mới phù hợp để chọn hoặc khôi phục; không xóa dữ liệu âm thầm. Ghi ai sửa, khi nào, nội dung quan trọng nào đổi; lịch sử phục vụ khôi phục và giải quyết tranh chấp chứ không cần log từng ký tự.

## 11.4. Thao tác có rủi ro cao

Đổi ngày toàn chuyến, xóa Activity/Booking, hủy chuyến, archive, xóa Trip, đổi người tham gia và đổi quyền trên tài liệu phải có xác nhận/tác động rõ. Không xóa nhiều phân hệ theo dây chuyền. Undo/Restore chỉ thực hiện nếu không ghi đè bất hợp lệ các thay đổi của người còn lại.

---

# 12. Trip Memories, Recap, Archive, Trash, Export

## 12.1. TP-17 — Trip Memories & Recap

Sau khi Trip Completed, hiển thị **recap cơ bản** từ dữ liệu thực tế được xác nhận và đủ quyền:

- Số ngày thực tế theo dates hợp lệ, không tính bừa khi Trip chưa có ngày.
- Số Activity Completed và số Activity Skipped/Cancelled theo trạng thái đã xác nhận.
- Số Place **khác nhau** có Visit M03 liên kết (tách với tổng lượt Visit).
- Media M02 đã gắn với Trip/Activity/Visit theo ACL.
- Diary M01, milestone M08 khi có ref và đủ quyền.
- Chi phí M07 theo phạm vi/tỷ giá hợp lệ.
- Ghi chú cảm nghĩ người dùng chủ động tạo, không tự viết cảm xúc được coi là sự thật.

**Create Travel Photobook P0:** từ Trip Recap, chọn ảnh/Diary/Place thực tế có quyền; mở luồng tạo cuốn sách nháp M01 (Simple hoặc Advanced Editor tùy chọn). Hai người cùng chỉnh sửa theo quyền M01; không sao chép toàn bộ media gốc. Nếu bản gốc Private được dùng vào sách Shared, phải xác nhận chia sẻ/snapshot theo quy tắc M01/M02. Thay đổi Trip về sau không làm nội dung Published của photobook đổi âm thầm.

**Late changes:** Trip Completed vẫn có thể bổ sung media, Visit, Diary/Expense ghi nhận muộn. Archived Trip vẫn giữ liên kết và có thể đọc theo quyền; không tự kéo media của Trip sang Trash.

## 12.2. TP-18 — Search, History & Archive

**Filter:** Trip Name, Destination, Status, Year (có mốc năm hợp lệ), Participant, Created By, Related Goal, Has Memories, Archived. Search chỉ chứa Trip đủ quyền và không đưa metadata của Booking Document hạn chế vào snippet.

**Change History:** log những thay đổi nghiệp vụ đáng kể: ngày Trip, lifecycle, activity time/move/delete, booking status/ref, accommodation changes, permissions, conflict resolution, restore. Cho xem theo quyền, không cần hiển thị bí mật tài liệu. Lịch sử không thay thế backup hệ thống.

**Archive:** chỉ cất khỏi danh sách đang hoạt động; không xóa Trip/Media/Diary/Event/Expense. Có thể restore/unarchive khi đủ quyền.

**Trash 30 ngày:** khi Delete Trip, chuyển trạng thái deleted tại M04, có thời gian khôi phục; không xoá nguồn của M01/M02/M03/M05/M07. Trước khi permanent delete, nêu liên kết sẽ trở thành mồ côi và có chiến lược detach/retain; quyền xóa dữ liệu cá nhân thực sự vẫn được hỗ trợ bằng quy trình phù hợp, không khóa vĩnh viễn chỉ vì có liên kết.

**Restore:** khôi phục Trip và những đối tượng con còn hợp lệ, không tự hồi sinh đối tượng phân hệ khác đã xóa vĩnh viễn. Nếu thiếu ref, hiển thị placeholder/cảnh báo; khôi phục không tạo bản Expense/Visit mới.

## 12.3. Basic Export (D22, P0)

Người có quyền được xuất **dữ liệu chuyến đi cơ bản**: thông tin Trip, danh sách ngày, Activity, chặng, chỗ ở, checklist, booking metadata được phép xuất và **refs/metadata** được phép tới Place, Media, Event, Expense, Diary. File tài liệu hoặc media gốc được đưa vào gói xuất **chỉ khi có quyền Download/Export tại phân hệ nguồn**; không coi quyền xem Trip = quyền tải file Private.

Kết quả phải có cấu trúc dễ đọc/sử dụng độc lập và không cần phải truy cập ứng dụng mới hiểu được tên, thời gian, trạng thái và mối liên hệ cơ bản. Định dạng tệp chính xác ở thiết kế kỹ thuật. **PDF lịch trình có thiết kế đẹp thuộc P1**, không được đánh đồng với Basic Export để ép làm ngay V1.0.

## 12.4. Backup / Disaster Recovery

M04 kế thừa năng lực sao lưu toàn hệ thống: backup Trip data, ACL, versions cần thiết và refs; đồng thời các phân hệ nguồn có backup chính của chúng. Phải kiểm tra restore đồng bộ mối quan hệ, không phải chỉ restore được bảng Trip mà mất Media/Booking Document/Calendar ref. Không công khai nội dung Private sau restore. Chính sách retain backup, encryption và recovery targets chốt trong non-functional/system design; đừng tự coi Trash là backup.

---

# 13. Hợp đồng nghiệp vụ giữa các phân hệ

| Phân hệ | Nguồn sự thật | M04 được phép | Không được làm |
|---|---|---|---|
| M01 Photobook & Diary | Diary Entry, Photobook, Published Version | Tạo/link Diary; khởi tạo Travel Photobook nháp; xem recap theo quyền | Không đổi Diary gốc khi sửa Trip; không ghi đè sách Published |
| M02 Media | Original, variants, albums, media ACL | Chọn ảnh, gắn media references vào Trip/Activity/Recap | Không tạo file ảnh mới không cần thiết; không lộ Media Private |
| M03 Food & Places | Place, Visit, Reviews | Chọn mọi loại Place, xem/ghi Visit sau xác nhận | Không tạo Place song song; không tự tạo Visit từ Activity Completed |
| M05 Couple Calendar | Calendar Event, reminders | Tạo/link/sync Event khi Activity cần lịch | Không lưu Event độc lập trùng; không tự xóa Event bên ngoài khi xoá Activity |
| M06 Bucket List | Goal, Wish | Link Trip với Goal; hiển thị tiến độ từ nguồn | Không tự coi Goal Completed vì Trip Completed |
| M07 Budget & Savings | Expense, budget, exchange policy | Tạo/link/hiển thị budget và expense theo quyền | Không tạo ledger chi phí riêng, không tính tổng trùng hoặc bịa tỷ giá |
| M08 Special Moments | Milestone, special memory | Liên kết cột mốc với Trip Recap | Không sửa/chia sẻ Milestone Private tự động |
| M09 Interaction | Comments, reactions | Bình luận Trip/Activity theo ACL | Không cho Commenter sửa dữ liệu hoặc xem file hạn chế |
| M10 Settings | Hồ sơ, theme, account policy | Dùng danh tính, quyền và tùy chọn hiển thị toàn cục | Không bỏ qua tùy chọn bảo mật/notification |
| Our Timeline | Projection từ các phân hệ | Đóng góp event hợp lệ như Trip Completed/Visit liên quan | Không xem Timeline là nguồn sự thật mới hoặc tiết lộ Private |

## 13.1. Contract: Place/Visit từ M03

- `Select Place`: input ID Place được quyền truy cập, output Activity Place Link + note tùy chọn, không copy dữ liệu địa điểm thành Place M04.
- `Record Visit`: từ Activity Completed liên kết Place, yêu cầu người dùng xác nhận/nhập thông tin thực tế; gửi/create qua nghiệp vụ M03; nếu có Visit gần tương ứng, gợi ý liên kết; kết quả là Visit ID dùng trong recap.
- `Place Revocation`: M04 ngừng tiết lộ nội dung Place, giữ liên kết an toàn và placeholder khi cần.

## 13.2. Contract: Event M05

- `Create/Link Event`: Activity đủ ngày giờ, quyền phù hợp; tránh tạo trùng từ retry/double submit.
- `Update Time`: cập nhật Activity/Event theo rules chủ quyền, có sync status và conflict handling.
- `Unlink/Cancel`: rõ ý người dùng; không xóa vô điều kiện sự kiện M05.

## 13.3. Contract: Expense M07

- M07 xác nhận Expense ID sau khi tạo; M04 giữ ref thay vì local Expense riêng.
- Một Expense ref xuất hiện ở nhiều Activity/Booking/Visit trong cùng Trip chỉ tính **một lần** trong summary.
- Multi-currency do M07 cung cấp quy tắc tỷ giá, không có thì hiển thị theo từng currency.

## 13.4. Contract: M01/M02 content

- Chọn Media dùng M02 Asset Picker và ACL; Trip Recap không tự nhân bản Media.
- Tạo Diary/Photobook dùng giao diện/nghiệp vụ M01, có quyền content source và destination.
- Nếu dùng Diary Private/Media Private vào Photobook Shared cần đồng ý có chủ đích theo các tài liệu M01/M02.
- Published photobook là phiên bản ổn định, cập nhật Trip không thay tự động nội dung đã xuất bản.

## 13.5. Contract: Trip Documents

- V1.0 cần file/document storage an toàn vượt ảnh/video M02; cần đưa vào **năng lực dùng chung của dự án** hoặc giải pháp riêng có ACL, backup, export; đây là phụ thuộc sản phẩm, **không phải cho phép bỏ yêu cầu**.
- Không tự đồng bộ tài liệu từ Gmail/cloud nếu chủ dự án chưa chốt tích hợp; không tự lưu passport/card payment đầy đủ.

---
# 14. 20 Use Cases và những luồng end-to-end

**Quy ước:** Mỗi Use Case xác định actor, điều kiện trước, thao tác chính, kết quả và cách xử lý lỗi. Các hoạt động xuyên phân hệ không tự hoàn tất khi dịch vụ khác chưa xác nhận. **Danh sách UC-M04-01..20 là P0** ở phạm vi nghiệp vụ tương ứng, ngoại trừ bước gọi những chức năng P1/P2 được nói rõ là tùy chọn.

| Mã | Use Case | Giá trị sử dụng |
|---|---|---|
| UC-M04-01 | Create Dream Trip | Lưu giấc mơ chưa biết ngày |
| UC-M04-02 | Convert Dream to Plan | Bổ sung lịch trình từng bước |
| UC-M04-03 | Create Scheduled Trip | Tạo chuyến có lịch cụ thể |
| UC-M04-04 | Share Trip | Cấp quyền an toàn |
| UC-M04-05 | Add Itinerary Day | Tạo nhiều ngày |
| UC-M04-06 | Add Place to Day | Dùng lại Place M03 |
| UC-M04-07 | Reorder Activities | Đổi thứ tự không mất dữ liệu |
| UC-M04-08 | Move Activity | Chuyển ngày/Unscheduled |
| UC-M04-09 | Reschedule Trip | Dời hành trình có impact review |
| UC-M04-10 | Add Transport | Quản lý chặng di chuyển |
| UC-M04-11 | Add Accommodation | Quản lý lưu trú |
| UC-M04-12 | Manage Booking | Theo dõi đặt chỗ và tài liệu |
| UC-M04-13 | Prepare Packing List | Phân công, đánh dấu, đồng bộ |
| UC-M04-14 | Track Trip Budget | Tổng hợp M07 không tính trùng |
| UC-M04-15 | Confirm Activity Completion | Đánh dấu hoạt động thực tế |
| UC-M04-16 | Record Actual Visit | Liên kết Visit M03 sau xác nhận |
| UC-M04-17 | Attach Trip Memories | Gắn M02 Media, M01 Diary |
| UC-M04-18 | Create Travel Photobook | Tái sử dụng nội dung trong M01 |
| UC-M04-19 | Archive / Restore Trip | Bảo tồn, Trash 30 ngày |
| UC-M04-20 | Collaborative Planning | Đồng biên tập chống ghi đè |

## UC-M04-01 — Tạo Dream Trip

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** User đăng nhập, có quyền tạo Trip.
- **Luồng chuẩn:** Mở TP-01 → Create Trip → nhập tên → chọn Dreaming → giữ trống start/end → thêm ý tưởng điểm đến/ghi chú → để Private hoặc Share có chủ đích → Save.
- **Kết quả bắt buộc:** Trip Draft/Dreaming hợp lệ tồn tại; xuất hiện Library, có thể bổ sung lịch sau.
- **Luồng lỗi/ngoại lệ:** Tên rỗng bị từ chối; save failure không hiển thị trạng thái thành công; thời gian không bị điền giả.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-02 — Chuyển Dream sang Planning

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** User có Edit trên Trip Dreaming.
- **Luồng chuẩn:** Mở TP-04 → chọn Plan This Trip → bổ sung destinations, dates với certainty, itinerary theo ngày → đổi status Planning sau xác nhận.
- **Kết quả bắt buộc:** Giữ tất cả ghi chú và refs trước đó; chưa bắt buộc có booking hoặc budget.
- **Luồng lỗi/ngoại lệ:** Ngày sai báo lỗi; thay tentative bằng confirmed phải lưu khác biệt mức chính xác.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-03 — Tạo Trip đã chốt lịch

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** User có quyền tạo.
- **Luồng chuẩn:** Create Trip → tên, địa điểm, start/end hợp lệ, timezone ngữ cảnh → chọn người tham gia và Private/Shared → Save → mở Itinerary.
- **Kết quả bắt buộc:** Trip có lịch chính xác, ngày hợp lệ, thành viên đúng quyền.
- **Luồng lỗi/ngoại lệ:** End trước Start bị từ chối; không tự chọn rate hoặc currency nếu chưa có budget.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-04 — Chia sẻ Trip

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Owner đăng nhập, Trip đang Private.
- **Luồng chuẩn:** Open Permissions → chọn người còn lại → chọn role → preview phạm vi nội dung con, booking docs riêng → Confirm.
- **Kết quả bắt buộc:** Người nhận chỉ xem/sửa dữ liệu đúng vai trò; file hạn chế vẫn kín.
- **Luồng lỗi/ngoại lệ:** Nếu chia sẻ media/Place Private, phải xác nhận phạm vi hoặc dùng placeholder; không leak metadata.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-05 — Thêm ngày lịch trình

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Editor trong Trip.
- **Luồng chuẩn:** Open TP-05 → Add Day → chọn Day Index hoặc ngày lịch → Save.
- **Kết quả bắt buộc:** Day mới có ID và thứ tự, cho phép thêm Activity sau.
- **Luồng lỗi/ngoại lệ:** Trip Dreaming được thêm Day logic; ngày vượt khoảng nếu hiện có phải cảnh báo.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-06 — Thêm địa điểm vào một ngày

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Editor có quyền xem Place M03.
- **Luồng chuẩn:** Open Day Detail → Add Activity → Select Place → tìm M03 Place (cafe/bảo tàng/rạp phim/khác) → chọn → thêm giờ/notes → Save.
- **Kết quả bắt buộc:** Activity giữ Place Ref; không tạo Place riêng, notes M04 độc lập.
- **Luồng lỗi/ngoại lệ:** Place Private đưa vào Shared Trip cần xác nhận quyền; Place không có tọa độ vẫn chọn được.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-07 — Đổi thứ tự Activities

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Editor có nhiều activities.
- **Luồng chuẩn:** Ở Planning View, chọn Move Up/Down hoặc reorder; hệ thống cập nhật thứ tự duy nhất cho ngày.
- **Kết quả bắt buộc:** Không mất Activity ID, Place ref, notes, booking.
- **Luồng lỗi/ngoại lệ:** A/B reorder cùng lúc phải hội tụ; không tạo thứ tự mâu thuẫn.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-08 — Chuyển Activity qua ngày khác

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Editor có Activity.
- **Luồng chuẩn:** Chọn Move → Day khác hoặc Unscheduled → xác nhận xử lý giờ xung đột → Save.
- **Kết quả bắt buộc:** Giữ tất cả content, refs và status, chỉ đổi lịch đúng lựa chọn.
- **Luồng lỗi/ngoại lệ:** Nếu Activity đã đồng bộ M05 thì phải cập nhật hoặc cảnh báo lỗi sync, không tạo event trùng.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-09 — Dời toàn chuyến

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Owner/Editor được cấp quyền đổi lịch.
- **Luồng chuẩn:** Sửa ngày Trip → hệ thống liệt kê Activities, Calendars, Bookings, Transport, Stay, deadlines bị tác động → chọn shift hoặc keep → xác nhận.
- **Kết quả bắt buộc:** Dữ liệu được đổi có kiểm soát, những Booking đã xác nhận đánh dấu cần kiểm tra ngoài hệ thống, có audit.
- **Luồng lỗi/ngoại lệ:** Nếu đồng bộ M05 một phần lỗi thì hiển thị trạng thái; không tuyên bố nhà cung cấp đã dời vé/phòng.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-10 — Thêm Transport Leg

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Editor trên Trip.
- **Luồng chuẩn:** Open Transport → Add → chọn type, departure/arrival, local datetime/timezone, provider/cost nếu có → Save/Link Activity.
- **Kết quả bắt buộc:** Một leg thuộc Trip, hiển thị lịch tương ứng; các mốc thời gian hợp lệ.
- **Luồng lỗi/ngoại lệ:** Giờ địa phương của hai nơi khác nhau phải được xử lý đúng; Booking chưa có vẫn lập leg được.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-11 — Thêm Accommodation

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Editor trên Trip.
- **Luồng chuẩn:** Open Stay → Add → tên nơi ở, check-in/out dates, status Planned/Booked, Booking link/notes → Save.
- **Kết quả bắt buộc:** Có thể có nhiều stays trong Trip và giữ thông tin theo từng khoảng.
- **Luồng lỗi/ngoại lệ:** Checkout trước checkin bị từ chối; đổi Trip date không biến reservation đã xác nhận thành đã đổi.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-12 — Quản lý Booking

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Editor được cấp quyền Booking/Docs.
- **Luồng chuẩn:** Open Bookings → Create with provider/status/ref/time → attach tài liệu qua file capability → kiểm tra quyền → Save.
- **Kết quả bắt buộc:** Booking lưu độc lập, docs chỉ người được cấp quyền xem; có thể link Activities.
- **Luồng lỗi/ngoại lệ:** Upload lỗi/unsupported: giữ Booking hợp lệ và hiển thị document failed; không expose mã/QR qua search.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-13 — Cùng chuẩn bị Packing List

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** A và B có Editor trên Trip.
- **Luồng chuẩn:** A tạo packing list, thêm 6 items; B thêm 4; A/B tick các mục khác nhau, phân công theo người.
- **Kết quả bắt buộc:** Tất cả items và trạng thái được giữ, tiến độ đúng; không tự đưa Trip Ready.
- **Luồng lỗi/ngoại lệ:** Nếu cùng sửa một trường Item gây conflict thì có xử lý, không overwrite list cũ.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-14 — Theo dõi Budget

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Editor có quyền tạo expense M07, Viewer tùy quyền.
- **Luồng chuẩn:** Open Trip Budget → xem planned/actual → Add Expense trong M07 hoặc link expense đã có → lọc theo quyền/currency.
- **Kết quả bắt buộc:** M04 tổng hợp theo Expense ID duy nhất, không cộng trùng; planned tách actual.
- **Luồng lỗi/ngoại lệ:** Không có rate: trình bày từng currency; không gộp số tiền sai đơn vị; Expense Private không leak tổng.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-15 — Xác nhận hoàn thành Activity

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Editor có Activity đang Planned/In Progress.
- **Luồng chuẩn:** Open Activity → Mark Completed → nhập actual time/note nếu muốn → Save.
- **Kết quả bắt buộc:** Activity chuyển Completed và cập nhật recap khi phù hợp, không tự tạo Visit/Expense.
- **Luồng lỗi/ngoại lệ:** Nếu activity đã Completed bởi người khác, không tạo thêm bản; mất quyền chặn write.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-16 — Ghi nhận Visit thực tế

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Editor có Activity liên kết Place.
- **Luồng chuẩn:** Mark Activity Completed → chọn Record Visit → xem gợi ý Visit có sẵn → Link existing hoặc Create Visit qua M03 → xác nhận ngày/người tham gia → Save.
- **Kết quả bắt buộc:** Có Visit Ref hợp lệ, không tạo Visit giả; M03 sở hữu dữ liệu và reviews.
- **Luồng lỗi/ngoại lệ:** Nếu M03 unavailable, Activity Completion vẫn có thể lưu, Visit chờ thao tác lại; không báo tạo Visit thành công.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-17 — Gắn Memories vào Trip

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** User có quyền thích hợp ở Trip và media/Diary.
- **Luồng chuẩn:** Open Trip Memories → chọn Media M02 hoặc Diary M01 → attach references → xem preview theo ACL.
- **Kết quả bắt buộc:** Recap hiển thị nội dung được phép, không upload lại ảnh/nhân bản Diary.
- **Luồng lỗi/ngoại lệ:** Private media/diary không tự shared; thiếu ref hiển thị phù hợp không làm hỏng Trip.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-18 — Tạo Travel Photobook

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Trip có nội dung hợp lệ và user có quyền tạo M01.
- **Luồng chuẩn:** Open Memories → Create Travel Photobook → hệ thống liệt kê ảnh/Diary/Place Visit thực tế đủ quyền → người dùng chọn → M01 tạo Photobook Draft → mở Editor.
- **Kết quả bắt buộc:** Cuốn sách thuộc M01; có thể Simple/Advanced, realtime theo M01; Published ổn định.
- **Luồng lỗi/ngoại lệ:** Nếu item Private đưa vào sách Shared, yêu cầu đồng ý; việc thay Trip không sửa sách Published.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-19 — Archive, Delete, Restore

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** Owner hoặc role có quyền tương ứng.
- **Luồng chuẩn:** Open TP-18 → Archive hoặc Delete to Trash (cảnh báo links) → trong 30 ngày Restore.
- **Kết quả bắt buộc:** Archive chỉ ẩn khỏi active; Trash khôi phục dữ liệu Trip còn hợp lệ, không xóa xuyên phân hệ.
- **Luồng lỗi/ngoại lệ:** Ref đã xóa vĩnh viễn hiển thị cảnh báo; không tạo lại Expense/Media/Visit mới.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

## UC-M04-20 — Hai người cùng lên lịch trình

- **Actor:** Người dùng có quyền phù hợp (Owner/Editor hoặc người tham gia nêu trong trường hợp).
- **Điều kiện trước:** A/B là Editor trên cùng Trip.
- **Luồng chuẩn:** A thêm Activity morning, B thêm evening; cả hai cùng sửa khác thuộc tính, rồi thử cùng sửa giờ; một người reorder.
- **Kết quả bắt buộc:** Tất cả thay đổi độc lập được giữ, conflict đồng thuộc tính được giải quyết rõ, thứ tự nhất quán.
- **Luồng lỗi/ngoại lệ:** Mất mạng/lùi phiên/revoked role không được overwrite state; chỉ hiển thị Saved sau xác nhận lưu.
- **Kiểm thử liên quan:** tham chiếu `BR-M04-*`, `EX-M04-*`, `AC-M04-*` cùng lĩnh vực.

---

# 15. Business Rules có mã định danh

Mỗi quy tắc là yêu cầu nghiệp vụ ràng buộc, **không** phải gợi ý công nghệ. Các mã được giữ tương ứng với bản đề xuất M04 đã được duyệt, mở rộng câu chữ khi cần để kiểm thử rõ hơn.

| Mã | Quy tắc nghiệp vụ bắt buộc | Phạm vi |
|---|---|---|

| BR-M04-01 | Cho tạo Trip Dreaming không cần start/end date hoặc booking. | Trip |
| BR-M04-02 | Không tự chuyển Trip sang Completed do đã qua ngày end. | Trip |
| BR-M04-03 | Cancelled giữ lịch trình, notes, bookings và lịch sử để xem lại theo quyền. | Trip |
| BR-M04-04 | Đổi ngày Trip cần impact preview, không tự dời mọi Activity/Booking. | Trip |
| BR-M04-05 | Trip Completed vẫn nhận media/diary/expense ghi nhận muộn khi có quyền. | Trip |
| BR-M04-06 | Completed Activity không tự tạo M03 Visit. | Integration M03 |
| BR-M04-07 | Archive không xóa hay vô hiệu refs của các phân hệ khác. | Trip |
| BR-M04-08 | End Date >= Start Date khi có đủ ngày, day trip cho cùng một ngày. | Validation |
| BR-M04-09 | Tentative month/period lưu riêng độ chính xác, không tự gán ngày giả. | Date |
| BR-M04-10 | Trip có nhiều Destinations có thứ tự tùy chọn. | Trip |
| BR-M04-11 | Đổi Destination không tự xóa Itinerary/Places cũ. | Trip |
| BR-M04-12 | Activity có thể không có giờ. | Itinerary |
| BR-M04-13 | Activity có thể Unscheduled không có ngày. | Itinerary |
| BR-M04-14 | Move Activity giữ ID, notes, media, links, status trừ thay đổi được xác nhận. | Itinerary |
| BR-M04-15 | Không bịa ETA hoặc travel duration khi không có nguồn phù hợp. | Map |
| BR-M04-16 | Thay đổi một hoạt động không tự đổi cả lịch trình. | Itinerary |
| BR-M04-17 | Overlapping Activities được lưu với cảnh báo phù hợp, không tự xóa. | Itinerary |
| BR-M04-18 | Reorder không đổi ID hay làm mất links của Activity. | Itinerary |
| BR-M04-19 | Giờ Activity cụ thể mang timezone địa phương phù hợp. | Date |
| BR-M04-20 | Hỗ trợ Activity qua nửa đêm với date/time chính xác. | Date |
| BR-M04-21 | Một Trip có nhiều Accommodation Stays. | Stay |
| BR-M04-22 | Check-out không được trước Check-in; nếu chưa có giờ thì không giả định giờ. | Stay |
| BR-M04-23 | Cancel Booking/Stay không tự xóa Accommodation record/history. | Stay |
| BR-M04-24 | Đổi nơi ở không tự xóa các Activity liên kết. | Stay |
| BR-M04-25 | Thêm Accommodation dự kiến không có nghĩa đã Booked. | Stay |
| BR-M04-26 | Booking Confirmed chỉ từ xác nhận người dùng/nguồn đáng tin cậy, không tự suy từ ngày. | Booking |
| BR-M04-27 | Trip Document chỉ có thể xem/tải đúng ACL con và quyền file gốc. | Documents |
| BR-M04-28 | Xóa Booking không tự xóa file tài liệu gốc dùng hợp lệ ở nơi khác. | Documents |
| BR-M04-29 | Thiết bị không mở được tài liệu thì có phương án tải theo quyền hoặc thông báo. | Documents |
| BR-M04-30 | Hai người cập nhật checklist độc lập không ghi đè. | Checklist |
| BR-M04-31 | Checklist status sau Save được đồng bộ nhất quán giữa phiên. | Checklist |
| BR-M04-32 | Checklist Item có lịch sử quan trọng để khôi phục/kiểm toán. | Checklist |
| BR-M04-33 | Checklist hoàn tất không tự chuyển Trip sang Ready. | Checklist |
| BR-M04-34 | Copy checklist reset done/packed mặc định, trừ lựa chọn rõ. | Checklist |
| BR-M04-35 | Checklist Items có thể assigned một người hoặc để shared. | Checklist |
| BR-M04-36 | Actual Expense thuộc M07, không tạo sổ chi phí song song trong M04. | Budget |
| BR-M04-37 | Expense link Trip, Activity, Booking hoặc Visit phải lưu ref ổn định. | Budget |
| BR-M04-38 | Một Expense liên kết nhiều mục trong cùng Trip được tổng hợp một lần. | Budget |
| BR-M04-39 | Planned Budget tách biệt Actual Expenses. | Budget |
| BR-M04-40 | Multi-currency chỉ quy đổi bằng quy tắc/tỷ giá có nguồn hoặc hiển thị riêng. | Budget |
| BR-M04-41 | Tổng tiền tuân theo quyền riêng của Expenses, không leak qua aggregate. | Budget |
| BR-M04-42 | Trip Media Recap liên kết M02, không nhân bản file gốc không cần thiết. | Recap |
| BR-M04-43 | Planned stop không tự được coi là đã ghé. | Recap |
| BR-M04-44 | Có thể bổ sung Diary sau khi Trip Completed. | Recap |
| BR-M04-45 | Travel Photobook do M01 sở hữu; M04 chỉ khởi tạo/link. | Recap |
| BR-M04-46 | Recap chỉ dùng nội dung người xem có quyền, không lấy từ Private ngoài phạm vi. | Recap |
| BR-M04-47 | Chỉnh Trip không tự thay bố cục Photobook Published. | Recap |
| BR-M04-48 | Archived Trip không xóa media/diary gốc. | Recap |
| BR-M04-49 | Trip có nhiều Destination refs. | Data |
| BR-M04-50 | Trip có nhiều Days và mỗi Day có nhiều Activities. | Data |
| BR-M04-51 | Unscheduled Activity không bắt buộc có Day ID. | Data |
| BR-M04-52 | Một Place M03 có thể dùng ở nhiều Trip/Activity. | Data |
| BR-M04-53 | Transport/Stay/Booking có thể link Activity nhưng vẫn có thông tin riêng. | Data |
| BR-M04-54 | Checklist Item có ID riêng, không phụ thuộc thứ tự hiển thị. | Data |
| BR-M04-55 | Một Booking có thể link nhiều Activities mà không duplicate booking reference. | Data |
| BR-M04-56 | Media/Diary có thể link nhiều Trip nếu quyền cho phép. | Data |
| BR-M04-57 | M04 chỉ giữ refs tới actual expenses M07, không copy ledger. | Data |
| BR-M04-58 | Trip Shared không tự cấp quyền file nhạy cảm hoặc Expense Private. | Privacy |

## 15.1. Bất biến bổ sung xuyên suốt

- Các quy tắc trên không thay thế những nguyên tắc chi tiết về ACL, timezone, date precision, conflict sync, deletion hoặc M05/M07 được ghi trong mục 4–13.
- Thay đổi một đối tượng liên kết phải báo rõ nội dung giữ nguyên, nội dung được cập nhật và nội dung không thể đồng bộ, nhất là Booking, Event, Expense.
- Retry/double-click không được làm phát sinh bản trùng Trip Day, Activity, Booking/Calendar Event/Visit/Expense ngoài ý định.
- Số liệu tổng hợp và search projection phải lọc quyền trước khi hiển thị, không tự cho thấy thông tin Private qua số lượng hoặc tổng tiền.

---

# 16. 45 trường hợp ngoại lệ và xử lý

Mỗi tình huống cần có thông báo và hành vi có thể kiểm thử. Trường hợp ngoài mạng/thiết bị dùng lời nhắn thực tế, không hứa được quyền truy cập hoặc dữ liệu mà hệ thống không đảm bảo.

| Mã | Tình huống | Kết quả xử lý bắt buộc |
|---|---|---|

| EX-M04-01 | Trip chưa có ngày | Cho lưu Dreaming với date certainty Unknown; không tạo ngày mặc định. |
| EX-M04-02 | End Date trước Start Date | Từ chối lưu ngày sai, chỉ rõ lỗi. |
| EX-M04-03 | Chỉ dự kiến tháng/khoảng thời gian | Giữ period/tentative, không ép ngày cụ thể. |
| EX-M04-04 | Trip nhiều điểm đến | Giữ toàn bộ, có thể sắp xếp, không gộp sai. |
| EX-M04-05 | Đổi ngày Trip | Hiển thị impact Activity, Booking, Event, Stay, Transport, checklist; chọn phương án. |
| EX-M04-06 | Trip Cancelled | Giữ dữ liệu lịch sử và links, không xóa. |
| EX-M04-07 | Đã qua end date | Không auto Completed. |
| EX-M04-08 | Activity thiếu ngày hoặc giờ | Hiển thị ở Unscheduled hoặc ngày chưa có giờ, không tạo timestamp giả. |
| EX-M04-09 | Hai Activity trùng giờ | Cảnh báo phù hợp, không tự xóa hoặc cấm toàn bộ. |
| EX-M04-10 | Hoạt động kéo qua nửa đêm | Dùng end date/time đúng. |
| EX-M04-11 | Chặng có múi giờ khác | Không trừ local clock thô; tính thời gian theo timezone. |
| EX-M04-12 | Move/Reorder Activity | Giữ ID, notes, refs, status, không mất nội dung. |
| EX-M04-13 | A/B thêm Activity đồng thời | Giữ cả hai; thứ tự nhất quán. |
| EX-M04-14 | A/B sửa cùng giờ Activity | Phát hiện conflict; không overwrite yên lặng. |
| EX-M04-15 | Place M03 bị xóa mềm | Giữ Activity ref, placeholder và quyền; không mất lịch trình. |
| EX-M04-16 | Mất quyền xem Place | Không lộ metadata Private qua Trip, map, search, recap. |
| EX-M04-17 | Activity Completed nhưng không thực sự ghé | Không auto tạo Visit. |
| EX-M04-18 | Đã tồn tại Visit phù hợp | Gợi ý link thay vì duplicate. |
| EX-M04-19 | Booking đã xác nhận khi dời Trip | Cảnh báo phải liên hệ nhà cung cấp; không auto đổi dịch vụ. |
| EX-M04-20 | Thiết bị không đọc được tài liệu | Cho tải theo ACL hoặc thông báo, không xóa file. |
| EX-M04-21 | Booking Document có dữ liệu nhạy cảm | Kiểm tra ACL ở preview, URL, download, export, notification. |
| EX-M04-22 | Thay Accommodation | Giữ lịch sử/Activity links, cảnh báo tác động. |
| EX-M04-23 | Checklist cập nhật đồng thời | Không ghi đè các item độc lập. |
| EX-M04-24 | Xóa Checklist Item | Cho phục hồi theo chính sách/thao tác có kiểm soát. |
| EX-M04-25 | Expense ref nhiều Activity | Chỉ tính một lần trong summary Trip. |
| EX-M04-26 | Expense dùng nhiều currency | Không cộng nếu chưa có quy tắc conversion hợp lệ. |
| EX-M04-27 | Đồng bộ Event M05 lỗi | Phân biệt nguồn đã lưu và nguồn chưa đồng bộ, có retry. |
| EX-M04-28 | Chưa có ảnh từ M02 | Trip vẫn dùng bình thường, hiển thị empty state. |
| EX-M04-29 | Ảnh M02 liên kết bị xóa | Giữ ref an toàn, placeholder đúng quyền. |
| EX-M04-30 | Tạo Photobook với nguồn Private | Kiểm tra quyền/chia sẻ trước khi đưa vào sách Shared. |
| EX-M04-31 | Viewer thiếu quyền Booking Document | Không xem/tải được qua giao diện và link trực tiếp. |
| EX-M04-32 | Thu hồi Editor khi đang sửa | Chặn các write mới; cảnh báo chưa lưu, không bypass ACL. |
| EX-M04-33 | Delete Trip có links | Không cascade-delete Media, Diary, Place, Event, Expense. |
| EX-M04-34 | Restore Trip thiếu link | Khôi phục phần còn và báo những tham chiếu đã mất. |
| EX-M04-35 | Mobile mất kết nối | Cảnh báo, chỉ đọc dữ liệu đã tải nếu có; không tuyên bố full offline. |
| EX-M04-36 | Không có app bản đồ phù hợp | Hiển thị địa chỉ và phương án thay thế hợp lệ. |
| EX-M04-37 | Đổi timezone gây thay đổi local date | Cho kiểm tra và không dịch âm thầm các Activity. |
| EX-M04-38 | A/B reorder cùng lúc | Thứ tự cuối hội tụ, không mất Activity. |
| EX-M04-39 | Trip bị Cancelled khi B đang sửa | Thông báo status mới, không cho lưu thao tác không hợp lệ. |
| EX-M04-40 | Booking áp dụng nhiều người | Một Booking, nhiều participant refs, không nhân bản. |
| EX-M04-41 | Activity không có Place | Vẫn thêm/sửa/hoàn thành được. |
| EX-M04-42 | Duplicate Trip | Không copy actual expense/Visit/confirmed booking hoặc private docs mặc định. |
| EX-M04-43 | Một Trip có nhiều Accommodation | Giữ từng stay, thời gian, booking liên kết. |
| EX-M04-44 | Timezone thiết bị khác timezone đích | Hiển thị thời gian local tại địa điểm và nhãn phù hợp. |
| EX-M04-45 | Export gặp file thiếu quyền | Loại trừ dữ liệu bị hạn chế và thông báo phạm vi export. |

## 16.1. Trường hợp đặc biệt cần test kết hợp

**EX-M04-05 + EX-M04-19 + EX-M04-27:** đổi ngày Trip có Booking đã xác nhận và Calendar Event liên kết. Test việc Trip update một phần thành công, Event sync lỗi, Booking không được đổi. UI phải giải thích chính xác phần nào thành công/thất bại.

**EX-M04-14 + EX-M04-38:** đồng thời sửa giờ và reorder ở hai thiết bị. Không được rơi mất Activity hoặc thay một ngày khác của người kia bằng phiên cũ.

**EX-M04-30 + EX-M04-31 + EX-M04-45:** người không có quyền không được xem metadata/file tài liệu hoặc nguồn Private qua Photobook/Export, kể cả họ có quyền xem Trip.

---

# 17. 70 Acceptance Criteria và ma trận kiểm thử

**Cú pháp rút gọn:** `Given` người dùng/Trip ở điều kiện, `When` hành động tương ứng, `Then` kết quả bắt buộc. Dữ liệu dùng trong test chỉ là fixture giả. Các mã thuộc P0 trừ khi ghi rõ giới hạn chức năng nâng cao.

| Mã | Given / When | Then — yêu cầu kiểm chứng |
|---|---|---|

| AC-M04-01 | Create Dream Trip không ngày | Lưu và mở lại được không có ngày giả |
| AC-M04-02 | Create Trip có ngày hợp lệ | Lưu đúng start/end và date certainty |
| AC-M04-03 | Nhập end trước start | Bị từ chối và có validation |
| AC-M04-04 | Dreaming chuyển Planning | Giữ notes, destinations và refs cũ |
| AC-M04-05 | Thêm nhiều Destinations | Lưu đủ danh sách, thứ tự khi cần |
| AC-M04-06 | Đổi ngày Trip | Giữ dữ liệu, có impact preview và xác nhận |
| AC-M04-07 | Cancel Trip | Không xóa lịch sử và liên kết |
| AC-M04-08 | Qua ngày end | Không tự thành Completed |
| AC-M04-09 | Archive Trip | Không xóa ảnh/nhật ký gốc |
| AC-M04-10 | Duplicate Trip | Không sao chép actual expense/confirmed booking ngoài ý định |
| AC-M04-11 | Add Activity | Xuất hiện đúng Trip, có ID riêng |
| AC-M04-12 | Add Activity không có giờ | Lưu và hiển thị chưa xếp giờ |
| AC-M04-13 | Add Activity chưa có ngày | Xuất hiện Unscheduled |
| AC-M04-14 | Move Activity sang ngày khác | Giữ notes, refs, trạng thái |
| AC-M04-15 | Reorder Activities | Thứ tự nhất quán, không đổi ID |
| AC-M04-16 | Add Place từ M03 | Tái sử dụng đúng Place ID, không duplicate |
| AC-M04-17 | Place gốc đổi/xóa | Activity giữ ref và notes, không leak private data |
| AC-M04-18 | Activity qua nửa đêm | Thời gian chính xác theo ngày/timezone |
| AC-M04-19 | Activities trùng giờ | Cảnh báo nhưng vẫn quản lý được |
| AC-M04-20 | Delete Activity | Không tự xóa Place/Media/Booking độc lập |
| AC-M04-21 | Mark Activity Completed | Không tự tạo Visit |
| AC-M04-22 | Link Visit có sẵn | Không tạo Visit trùng |
| AC-M04-23 | Hai người thêm Activity cùng lúc | Giữ cả hai |
| AC-M04-24 | Hai người sửa xung đột cùng field | Có cơ chế xử lý, không silent overwrite |
| AC-M04-25 | Add Transport Leg | Hiển thị đúng Trip và liên kết |
| AC-M04-26 | Transport qua timezone | Hiển thị đúng local times và chronology |
| AC-M04-27 | Add Accommodation | Lưu nơi ở, thời gian và status |
| AC-M04-28 | Check-out trước check-in | Validation từ chối |
| AC-M04-29 | Trip nhiều stays | Hiển thị/lưu đủ |
| AC-M04-30 | Add Booking | Lưu Booking ID/status/ref và liên kết |
| AC-M04-31 | Đổi ngày Trip có Booking | Không tự tuyên bố đổi dịch vụ bên ngoài |
| AC-M04-32 | Attach Trip Document | Lưu đúng loại/quyền, báo lỗi khi không hợp lệ |
| AC-M04-33 | Viewer thiếu quyền tài liệu | Không xem/tải được qua URL trực tiếp |
| AC-M04-34 | Cancel Booking | Lưu history, không xóa Trip |
| AC-M04-35 | Tạo Packing List | Danh sách được tạo |
| AC-M04-36 | Add/Edit Checklist Item | Lưu đúng item |
| AC-M04-37 | Hai người tick item khác nhau | Giữ cả hai trạng thái |
| AC-M04-38 | Assign checklist item | Hiển thị đúng assignee |
| AC-M04-39 | All checklist Completed | Không tự chuyển Ready |
| AC-M04-40 | Copy checklist từ Trip cũ | Mặc định reset Done/Packed |
| AC-M04-41 | Add actual Expense qua Trip | Bản ghi chính thức ở M07 |
| AC-M04-42 | Expense nhiều refs trong cùng Trip | Không bị tính trùng |
| AC-M04-43 | Planned vs actual budget | Hiển thị tách bạch, không gộp sai |
| AC-M04-44 | Expenses nhiều currency | Không cộng số khác đơn vị khi thiếu tỷ giá |
| AC-M04-45 | Link Activity với M05 | Có ref Event hợp lệ, không tạo event trùng |
| AC-M04-46 | Sửa giờ ở Activity đã link Event | Áp dụng sync/cảnh báo đúng quyền |
| AC-M04-47 | Sync Calendar lỗi | Có pending/failed/retry |
| AC-M04-48 | Activity có địa chỉ hợp lệ | Có thể mở đường dẫn chỉ đường |
| AC-M04-49 | Activity không có tọa độ | Không sinh pin/ETA giả |
| AC-M04-50 | Tạo Diary từ Trip | Diary thuộc M01 và liên kết đúng |
| AC-M04-51 | Attach media M02 | Không upload lại file gốc |
| AC-M04-52 | Trip Completed | Xem Recap cơ bản từ actual, không bịa Visit |
| AC-M04-53 | Create Travel Photobook | Tạo M01 Draft và chọn nội dung đúng quyền |
| AC-M04-54 | Edit Photo trong M01 photobook | Không thay đổi ảnh gốc hoặc Trip cũ ngoài ý muốn |
| AC-M04-55 | Trip Archived | Dữ liệu liên kết từ nguồn vẫn còn |
| AC-M04-56 | Create new Trip | Private mặc định |
| AC-M04-57 | Share Trip | Roles được áp dụng đúng |
| AC-M04-58 | Revoke Editor | Chặn write mới ngay theo ACL |
| AC-M04-59 | Open Private Trip URL trái quyền | Từ chối, không leak metadata |
| AC-M04-60 | Shared Trip có private document | Không xem được tài liệu hạn chế |
| AC-M04-61 | A/B cùng sửa | Không mất thay đổi độc lập |
| AC-M04-62 | Delete Trip | Chuyển vào Trash |
| AC-M04-63 | Restore Trip trong 30 ngày | Khôi phục thông tin/links hợp lệ |
| AC-M04-64 | Delete Trip có links xuyên hệ | Không cascade-delete nguồn M01/M02/M03/M05/M07 |
| AC-M04-65 | Thực hiện luồng P0 trên mobile | Tạo/edit/itinerary/checklist/booking/recap sử dụng được |
| AC-M04-66 | Thực hiện luồng P0 trên desktop | Hoàn thành các luồng chính |
| AC-M04-67 | Network failure lúc Save | Không hiển thị Saved sai, xử lý retry/conflict |
| AC-M04-68 | Export Trip basic | Chỉ có dữ liệu được phép export |
| AC-M04-69 | Reload Trip đã Save | Giữ nội dung đã được xác nhận lưu |
| AC-M04-70 | Search theo người thiếu quyền | Không lộ Private hoặc file nhạy cảm |

## 17.1. Các bộ test end-to-end bắt buộc

1. **Quick Dream → Full Plan:** tạo Trip chưa có ngày → bổ sung destinations/day → chốt ngày → lịch trình sắp xếp → reopen đúng dữ liệu.
2. **International Timezone:** transport chặng có departure/arrival ở timezone khác nhau; Activity local dates và check-in/out; không lệch ngày khi thay timezone thiết bị.
3. **Cross-module sequence:** M03 Place → M04 Activity → M05 Event → Confirmed Activity → (opt-in) M03 Visit → M02 photos → M01 Diary → M01 Travel Photobook, kiểm tra ownership/ACL xuyên suốt.
4. **Reschedule Trip có Booking:** dời Trip và Activity, cảnh báo Booking, M05 sync failure partial, kiểm tra retry không tạo trùng.
5. **Concurrent plan:** A/B tạo Item khác nhau, reorder đồng thời, edit cùng field, checklist tick, revoke permission trong phiên.
6. **Private + Shared:** Trip Shared với Booking Document Private và Expense Private, search/export/recap chỉ hiển thị phạm vi hợp lệ.
7. **Delete & restore:** archive, Trash 30 ngày, restore Trip, kiểm tra giữ Place/Media/Diary/Expense nguồn và xử lý ref mất.
8. **Mobile/Poor Network:** tạo/update lịch trình từ điện thoại mạng yếu, trạng thái lưu rõ, không hứa full offline; reconnect không overwrite bằng bản cũ.

## 17.2. Điều kiện để một tiêu chí được đánh dấu Pass

- Có kịch bản test tái hiện được, input fixture, bước thực hiện, kết quả quan sát và expected result tương ứng.
- Test cả quyền được phép lẫn quyền bị từ chối; test link trực tiếp, search, thumbnail, preview, export và nội dung tổng hợp.
- Không chấp nhận “UI trông đúng” nếu dữ liệu phía sau trùng lặp, sai timezone, bị xóa dây chuyền hoặc không được ghi nhận lưu thành công.
- Không chấp nhận xem P1/P2 hoàn thành để bù cho P0 bị thiếu.

---

# 18. Non-functional requirements và mobile/desktop

## 18.1. Bảo mật và tính riêng tư

| Mã | Yêu cầu | Điều kiện kiểm tra |
|---|---|---|
| NFR-M04-01 | Kiểm tra ACL trên mọi thao tác read/write/export/download | URL trực tiếp và truy xuất dữ liệu trái quyền bị từ chối |
| NFR-M04-02 | Quyền trên Trip không nâng quyền tài liệu, media, diary, expense từ nguồn | Người không đủ quyền không xem được preview hay metadata nhạy cảm |
| NFR-M04-03 | Dữ liệu booking/tài liệu được bảo vệ khi lưu và truy cập | Không phát tán mã đặt chỗ/QR ngoài phạm vi đã cho phép |
| NFR-M04-04 | Có lịch sử các thao tác rủi ro cao | Có tác nhân, đối tượng, thời điểm và loại hành động |
| NFR-M04-05 | Export có scope rõ ràng | Không xuất tài liệu/file hạn chế hoặc Expense Private |
| NFR-M04-06 | Backup không làm thay đổi quyền sau restore | Test phục hồi và truy cập bằng tài khoản không có quyền |

### Điều cần tránh

- Dùng tên tài liệu hay filename làm nguồn quyết định quyền.
- Lấy thumbnail/download URL lưu cứng trong Trip làm quyền truy cập lâu dài.
- Gộp toàn bộ dữ liệu Trip vào bản cache/search mà không lọc quyền nội dung con.
- Cho người có quyền Trip mặc định xem giấy tờ cá nhân hoặc expense riêng tư.
- Copy vé, mã đặt chỗ hoặc các dữ liệu nhạy cảm vào message/email/notification không cần thiết.

## 18.2. Tính toàn vẹn dữ liệu

| Mã | Yêu cầu | Ví dụ kiểm thử |
|---|---|---|
| NFR-M04-07 | Không mất cập nhật độc lập khi cùng sửa | A thêm activity, B tick checklist, cả hai vẫn giữ |
| NFR-M04-08 | Xử lý đồng bộ một phần xuyên phân hệ | M04 save thành công, M05 sync lỗi phải hiển thị trạng thái |
| NFR-M04-09 | Retry an toàn, tránh duplicate ngoài ý định | Retry create/link không nhân bản Calendar Event hoặc Visit |
| NFR-M04-10 | Xóa mềm và khôi phục rõ ràng | Restore Trip còn IDs hợp lệ, không clone Expense |
| NFR-M04-11 | Không “Saved” giả | UI chỉ hiện xác nhận thành công sau khi storage/service xác nhận |
| NFR-M04-12 | Metadata lịch trình không bị trôi timezone | Device timezone khác timezone destination không đổi giờ sự kiện |

## 18.3. Trải nghiệm, phản hồi và accessibility

- **Quick Trip:** người dùng có thể tạo chuyến đi đơn giản khi chỉ có tên và một ý tưởng; những trường khác không chặn Save.
- **Full Trip:** các tab chuyên sâu hiện dần theo nhu cầu, không ép người dùng hoàn thành tất cả để truy cập phần khác.
- **Mobile:** tất cả P0 đều thực hiện được từ điện thoại, có add/edit/move activity, packing, viewing Booking (theo quyền), link Place, check budget, recap; không chỉ có Reader.
- **Desktop:** Itinerary Planning View có thể tổ chức nhiều cột, thao tác bằng chuột/bàn phím; các tính năng chính không đòi cảm ứng.
- **Không phụ thuộc drag-and-drop:** luôn có thao tác thay thế qua menu, ví dụ Move to Day/Move Up/Down.
- **Lỗi dễ hiểu:** thể hiện trường nhập nào sai, việc lưu nào thất bại, liên kết nào không đủ quyền hoặc chưa thể đồng bộ.
- **Không tự quyết định hộ người dùng:** không tự hủy Booking, không tự Completed, không tự tạo Visit hoặc nhắc lại như sự thật.
- **Accessibility:** focus rõ khi thao tác bàn phím, label, độ tương phản đủ đọc, vùng chạm hợp lý, hỗ trợ giảm chuyển động, không dùng màu là chỉ báo duy nhất.

## 18.4. Performance và quy mô

Cần hỗ trợ tăng dần số lượng Trip, Activity, Checklist, Booking, file theo thời gian. Danh sách Trip và recap không bắt tải toàn bộ nội dung media trong một lần; sử dụng thumbnail/preview theo quyền. Khi Trip nhiều Activity, thao tác cuộn/tìm kiếm/lọc không bị thiết kế bắt tải mọi file gốc.

**Chưa chốt định lượng:** thời gian phản hồi tối đa, số Activity trên Trip, số người đồng thời, số MB file PDF, thời gian chuẩn bị export, thông lượng download, chi phí lưu trữ, RPO/RTO backup, số lượng retry. Các số này phải được xác nhận trong tài liệu system design hoặc QA performance plan thay vì Codex tự đặt thành điều khoản nghiệp vụ đã chốt.

## 18.5. Mất kết nối và offline

**P0:** nhận biết mất mạng, hiển thị dữ liệu đã tải an toàn nếu còn trên thiết bị, bảo vệ trạng thái đang thao tác trong phạm vi khả thi, báo rõ khi chưa đồng bộ, cho retry/hồi phục, không overwrite bằng state cũ. Không hứa mọi trip documents và bản đồ đều hoạt động khi thiết bị hoàn toàn offline.

**P1:** chức năng **Download Trip for Offline** có chủ đích, quyền lưu cục bộ theo loại dữ liệu, đồng bộ xung đột khi kết nối lại, cơ chế xóa cache khi thu hồi quyền trong giới hạn kỹ thuật thực tế. Chỉ đưa vào P0 khi có yêu cầu/phê duyệt phạm vi mới.

---

# 19. Ranh giới triển khai, phụ thuộc, Definition of Done

## 19.1. Ranh giới hệ thống

**M04 sở hữu:** Trip, Trip Days, Activities, Trip-specific Notes/Checklist, Transport Legs, Accommodation Stays, Bookings, Trip-specific content links, Trip lifecycle/audit và view Recap.

**M04 không sở hữu:** Place M03, Visit M03, Media M02, Diary/Photobook M01, Calendar Event M05, Expense M07, Goal M06. M04 không trở thành source of truth cho dữ liệu gốc chỉ vì hiển thị những dữ liệu đó.

**Năng lực nền tảng cần có:** Users & Permissions, file/document storage ACL có hỗ trợ PDF/tài liệu an toàn, upload state, cross-module linking, audit, Trash/Restore, backups và import/export. Chức năng Docs là P0 của M04, trong khi M02 V1.0 trước đó tập trung ảnh/video; đây là **phụ thuộc shared capability bắt buộc lên kế hoạch trước code**.

## 19.2. Thứ tự phụ thuộc và chiến lược bàn giao kỹ thuật (không phải code)

1. Xác nhận dữ liệu và quyền nguồn của M01/M02/M03, nhất là Place Picker (M03), media picker (M02) và tạo Travel Photobook (M01).
2. Chốt model chung cho Date Precision, timezone và multi-currency trước khi phát triển form Trip, Itinerary, Transport, Accommodation và Budget.
3. Xác định khả năng quản lý Trip Documents dùng chung (file, ACL, backup, export) không được lẫn với ảnh/video M02.
4. Thiết kế contracts M05 Event sync và M07 Expenses theo ID/ref để tránh tạo bảng sự kiện/ledger thứ hai trong M04.
5. Triển khai/kiểm thử riêng flow P0 mỗi phần, sau đó kiểm thử end-to-end và quyền của hai tài khoản.
6. Chốt Definition of Done trên bộ Acceptance Criteria, không dựa vào việc giao diện đã xuất hiện đầy đủ.

## 19.3. Definition of Done — M04 V1.0

M04 chỉ đạt “Done” khi **đồng thời** đáp ứng:

- [ ] D01–D22 được áp dụng đúng phạm vi P0/P1/P2.
- [ ] Người dùng tạo được Quick Dream, Full Plan, Day Trip, Multi-destination và Trip quốc tế có múi giờ phù hợp.
- [ ] TP-01..TP-18 có các trạng thái UI và thao tác phù hợp (không bắt buộc 18 route độc lập).
- [ ] Itinerary có Timeline/Planning, Unscheduled, Move/Reorder, hỗ trợ thay đổi ngày không làm mất dữ liệu.
- [ ] Booking, Documents, Transport, Accommodation và Checklist hoạt động đúng với quyền và trạng thái.
- [ ] M03 Place/Visit liên kết theo ID, không có dữ liệu Place/Visit giả và không phát sinh trùng do retry.
- [ ] M02 media, M01 Diary/Photobook được sử dụng lại hợp lệ; sách Published không bị thay đổi âm thầm.
- [ ] M05 Calendar Event sync có xử lý conflict/partial failure; M07 Expenses không tính trùng và multi-currency không tính sai.
- [ ] Hai người cùng cập nhật không mất những thay đổi độc lập, xung đột đồng thuộc tính được xử lý minh bạch.
- [ ] Quyền Private mặc định, Booking Documents hạn chế, search/export/recap lọc quyền và chặn link trực tiếp trái phép.
- [ ] Archive, Trash 30 ngày, Restore, basic Export, backup/restore được kiểm chứng theo phạm vi.
- [ ] Mobile và desktop hoàn thành end-to-end các luồng P0, không có critical blocker về thao tác.
- [ ] Bộ `UC-M04-01..20` và `AC-M04-01..70` đã có test case kết quả và không còn lỗi nghiêm trọng chưa được duyệt.
- [ ] Những giới hạn/chính sách kỹ thuật còn mở đã được ghi lại và duyệt nơi phù hợp, không dùng giá trị tùy tiện làm yêu cầu đã chốt.

## 19.4. Điều không được coi là Done

- Trang Home đẹp nhưng chưa thể Save Trip/Activity hoặc chưa kiểm soát quyền.
- Trip Planner thao tác được nhưng mọi lần ghi chi phí lại tạo bản sao ở M04 thay vì M07.
- Có chức năng link Place nhưng tạo Place riêng không liên kết dữ liệu M03.
- Có nút Create Visit nhưng cứ Activity Completed là tự ghi nhận đã đến.
- Có Booking PDF UI nhưng tải file qua link công khai không kiểm tra ACL.
- Có trạng thái Saved khi write thực tế bị lỗi hoặc chưa đồng bộ.
- Có một bộ demo itinerary nhưng không hỗ trợ Trip không ngày, quốc tế/múi giờ, nhiều chặng/chỗ ở.
- Có Map tương tác P1/P2 nhưng thiếu checklist/document/export P0.

---

# 20. Ví dụ hành trình xuyên phân hệ

## 20.1. Ví dụ A — Quick Trip đi chơi một ngày

> Dữ liệu **hoàn toàn minh họa**, không phải kế hoạch thực tế của hai bạn.

1. A tạo `Weekend Escape` bằng Quick Trip, chưa có Booking/Budget.
2. B được share role Editor.
3. A chọn một Place trong M03 vào Activity `Cafe buổi sáng`.
4. B thêm Activity `Đi dạo` không có Place, để trống giờ.
5. Hai người chọn ngày phù hợp, link M05 cho hoạt động cần nhắc lịch.
6. Trong chuyến đi, A mark Cafe Completed, xác nhận ghi Visit M03. B thêm ảnh vào M02 và liên kết Trip.
7. Sau chuyến đi, cả hai viết Diary M01 về trải nghiệm và tạo Photobook nháp qua M01 khi muốn.

**Kết quả dữ liệu:** một Trip M04, hai Activities, một Place gốc M03, một Visit M03 nếu xác nhận, media gốc M02, Diary/Photobook M01 độc lập; không có Booking/Expense giả.

## 20.2. Ví dụ B — Đà Lạt 3 ngày 2 đêm

1. Tạo Trip Đà Lạt, xác định date certainty Confirmed và địa điểm.
2. Tạo Day 1, Day 2, Day 3; thêm activity ăn sáng, tham quan, check-in, cafe, nghỉ ngơi.
3. Chọn các điểm tham quan, quán cafe từ M03 theo quyền; một số activities Unscheduled.
4. Lưu Transport Leg, một Accommodation Stay, Booking và tài liệu xác nhận được chia sẻ theo ACL thích hợp.
5. Tạo Packing List và Preparation Checklist; phân công đồ dùng/việc cần làm cho từng người.
6. Gắn ngân sách dự kiến và các khoản chi M07 theo Trip; cùng một hóa đơn gắn Booking/Activity chỉ tính một lần.
7. Nếu chuyến bị dời lịch, hệ thống hiển thị impacts và không tự coi Booking đã được dời.
8. Trong chuyến đi, đánh dấu activity thực tế; nếu tới Place thì tự **chọn xác nhận** Visit M03, không ghi nhận tự động.
9. Sau chuyến đi, Recap tổng hợp ảnh M02, Visit M03, Diary M01 và chi phí M07 trong phạm vi ACL; mở M01 tạo Travel Photobook, chỉnh đồng thời thời gian thực theo đặc tả M01.

## 20.3. Ví dụ C — Nhật Bản nhiều thành phố, nhiều timezone/currency

1. Tạo Dream Trip `Our Japan Dream` chưa ngày; thêm những Place M03 muốn ghé.
2. Khi có dự định, nhập tentative period; khi chốt mới nhập start/end confirmed.
3. Lập activities tại Kyoto, Osaka, Tokyo; tạo Transport Legs với giờ local và timezone phù hợp.
4. Ghi chi phí vé bằng đồng tiền thực tế, ngân sách bằng main currency đã chọn; nếu M07 chưa có exchange rate được chốt, hiển thị tổng theo từng currency.
5. Lưu Booking Document PDF vé/phòng trong năng lực tài liệu dùng chung có ACL; không yêu cầu nhập số thẻ hay hộ chiếu đầy đủ.
6. Khi điện thoại đổi timezone, itinerary vẫn thể hiện ngày giờ địa phương của điểm đến, không tự đổi lịch do giờ thiết bị.
7. Khi thay đổi Booking, cập nhật trong ứng dụng chỉ mang nghĩa **thông tin do người dùng ghi nhận**, không đồng nghĩa thay đổi nhà cung cấp.

## 20.4. Ví dụ D — Shared Trip và tài liệu Private

1. A tạo Trip Shared cho B với vai trò Editor.
2. A thêm Booking có tài liệu riêng tư hạn chế A.
3. B nhìn thấy Activity có Booking reference trung tính nếu quy tắc cho phép, nhưng không xem file/QR/mã đặt phòng riêng tư.
4. B tìm trong search, xem recap hoặc export: không xuất hiện metadata/file vượt quyền.
5. A thu hồi Editor B giữa phiên: các thao tác write tiếp theo từ B bị từ chối, trạng thái được thông báo.

---

# 21. Traceability, vấn đề chưa định lượng và change log

## 21.1. Traceability D01–D22

| Quyết định | Mục đặc tả chính | Kiểm thử trọng tâm |
|---|---|---|
| D01 | 1.3, 6 | AC-M04-01, AC-M04-02, AC-M04-05 |
| D02 | 4.2, 6.3, 10.3 | AC-M04-01, AC-M04-11, AC-M04-13 |
| D03 | 4.5, 6.3 | AC-M04-05 |
| D04 | 4.4, 6.4, 12 | AC-M04-04, AC-M04-07, AC-M04-08 |
| D05 | 7.1 | AC-M04-11..20, mobile tests |
| D06 | 7.1 | AC-M04-12, AC-M04-13 |
| D07 | 7.1–7.3 | AC-M04-14, AC-M04-15, AC-M04-20 |
| D08 | 6.5 | AC-M04-06, AC-M04-31, AC-M04-46 |
| D09 | 7.4, 13.1 | AC-M04-16, AC-M04-17 |
| D10 | 10.2 | AC-M04-48, AC-M04-49 |
| D11 | 8.1 | AC-M04-25, AC-M04-26 |
| D12 | 8.2 | AC-M04-27–29 |
| D13 | 8.3, 11 | AC-M04-30, AC-M04-32, AC-M04-33 |
| D14 | 9.1 | AC-M04-35–40 |
| D15 | 9.2, 13.3 | AC-M04-41–43 |
| D16 | 9.2, 10.4 | AC-M04-44 |
| D17 | 10.1, 13.2 | AC-M04-45–47 |
| D18 | 11.3 | AC-M04-23, AC-M04-24, AC-M04-61 |
| D19 | 7.3, 13.1 | AC-M04-21, AC-M04-22 |
| D20 | 12.1, 13.4 | AC-M04-50–55 |
| D21 | 18.5 | AC-M04-67 |
| D22 | 12.3 | AC-M04-68 |

## 21.2. Phụ thuộc cần được xác định ở giai đoạn kiến trúc kỹ thuật

| Mã | Vấn đề chưa định lượng/chưa thiết kế kỹ thuật | Nguyên tắc đã cố định | Hành động tiếp theo |
|---|---|---|---|
| OPEN-M04-01 | File/document storage dùng chung cho PDF, vé, tài liệu | Booking Documents P0, ACL và backup bắt buộc | Thiết kế trong shared capabilities, không bỏ tính năng |
| OPEN-M04-02 | Định dạng, dung lượng file và quotas | Không mất file gốc, không lộ Private | Đề xuất và duyệt policy upload |
| OPEN-M04-03 | Date Precision và timezone/DST representation | Không ngày giả, không lệch giờ | Thiết kế data model/test quốc tế |
| OPEN-M04-04 | Contract M05 Calendar Event synchronization | Một Event nguồn, không duplicate | Chốt API/transaction/outbox behavior khi M05 có BRD |
| OPEN-M04-05 | Policy M07 multi-currency/rate source | Không cộng sai currency | Chốt với BRD M07 |
| OPEN-M04-06 | Trip Summary và aggregates ACL | Không leak Private tổng | Thiết kế permissions + test |
| OPEN-M04-07 | Conflict resolution & reconciliation | Không silent overwrite, retries an toàn | Chốt kỹ thuật đồng bộ và UX conflict |
| OPEN-M04-08 | Dịch vụ địa chỉ/route | Mở Directions P0, interactive map P1 | Lựa chọn ở giai đoạn kỹ thuật |
| OPEN-M04-09 | Backup/export format, retention beyond Trash | Trash 30 ngày, basic export P0 | Thiết kế policy hệ thống và DR test |
| OPEN-M04-10 | Giới hạn số Trip/Activity, SLA, tải trọng lớn | Chức năng P0 không suy giảm không kiểm soát | Thử tải và duyệt cấu hình |
| OPEN-M04-11 | Offline nâng cao | P0 cảnh báo mạng, P1 offline đầy đủ | Không tự mở rộng phạm vi P0 |
| OPEN-M04-12 | Quyền kế thừa theo booking file/expense/private media | Quyền nguồn luôn thắng nếu hạn chế hơn | Thiết kế shared ACL strategy |

**Các OPEN-M04 trên không phải các quyết định nghiệp vụ bị bỏ ngỏ D01–D22.** Đây là nội dung kỹ thuật/phi chức năng cần chi tiết hóa khi chuẩn bị code và khi M05/M07 được chốt. Không yêu cầu hỏi lại chủ dự án những quyết định họ đã xác nhận.

## 21.3. Danh sách dữ liệu mẫu phục vụ thiết kế và QA

Tạo fixture giả, không sử dụng dữ liệu cá nhân thực của hai bạn:

1. Trip Dreaming chưa có ngày, chưa có destinations, chưa có Booking.
2. Trip day trip cùng một start/end date, Activity chưa có giờ.
3. Trip 3 ngày có 12 Activities, 3 Unscheduled, 2 participants.
4. Trip nhiều destinations, Transport Leg chuyển timezone.
5. Trip có Accommodation Booked + Booking Document Private + một Viewer không có quyền file.
6. Trip có 5 Expenses M07, trong đó một khoản được link 3 Activities và một khoản là foreign currency.
7. Trip có 2 Places M03, 2 Visits được xác nhận, 1 Activity Completed nhưng không ghé thực tế.
8. Trip có Media M02 Private được Owner đưa vào Recap nhưng chưa đồng ý share.
9. Trip Cancelled, Trip Archived, Trip Trashed, Trip Restore với một ref đã bị xóa.
10. Trip A/B đang đồng thời sửa cùng thời gian Activity và status checklist.

## 21.4. Nhật ký thay đổi tài liệu

| Version | Date | Trạng thái | Nội dung |
|---|---|---|---|
| 0.1 (bản thảo trao đổi) | 2026-10-22 | Đã trình bày | Tầm nhìn, 18 màn hình, 58 quy tắc, 20 UC, 45 ngoại lệ, 70 AC, D01–D22 đề xuất |
| 1.0 | 2026-10-22 | **Đã duyệt nghiệp vụ** | Chủ dự án xác nhận toàn bộ D01–D22; chuẩn hóa thành tài liệu Markdown độc lập, thêm contract, ACL, Definition of Done, traceability và các điểm cần thiết kế kỹ thuật |

## 21.5. Hướng dẫn sử dụng tài liệu cho Codex

1. Đọc cùng `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md`, `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md`, `OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md` trong `Docs/`.
2. Trước khi implement, lập **technical design và implementation plan** dựa trên P0; không triển khai P1/P2 nếu chưa được yêu cầu.
3. Khi làm M04, kiểm tra các dependencies còn chưa chốt của M05/M07 và shared file management; xây hợp đồng tích hợp rõ ràng, không tự sao chép nghiệp vụ nguồn.
4. Lập checklist mapping từng `TP-xx`, `UC-M04-xx`, `BR-M04-xx`, `EX-M04-xx`, `AC-M04-xx` đến phần implement/test.
5. Nếu một nội dung mâu thuẫn với tài liệu BRD đã duyệt khác, lập issue kèm phương án và tác động, không âm thầm chọn lựa.
6. Tách hoàn toàn **business requirement** khỏi quyết định công nghệ: schema, endpoints, thư viện, hosting và runtime sẽ được thiết kế sau khi đồng bộ các phân hệ.
7. Định nghĩa “Done” phải có bằng chứng kiểm thử từng P0 trọng yếu, bao gồm ACL, không duplicate, timezone và phục hồi dữ liệu.

---

**KẾT THÚC TÀI LIỆU — OURSPACE-M04-BRD V1.0**

**Trạng thái:** đã chốt nghiệp vụ, chưa bắt đầu code. **Chuyển tiếp dự án:** đặc tả M05 — Couple Calendar trước khi chốt contract đồng bộ lịch cuối cùng; sau đó M06/M07 để hoàn thiện goal và budget. Các giới hạn/định dạng kỹ thuật được xác định ở giai đoạn kiến trúc hệ thống.
