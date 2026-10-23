---
document_id: OURSPACE-M03-BRD
project: Our Space
module_id: M03
module_name: Food & Places
version: 1.0
status: Business requirements approved, implementation pending
language: vi-VN
approved_on: 2026-10-22
file_name: OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md
intended_audience: [Product Owner, Designer, Codex, Developer, QA]
related_documents:
  - OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md
  - OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md
---

# OUR SPACE — M03: FOOD & PLACES
## Business Requirements & Functional Specification — V1.0

> **TÀI LIỆU NGHIỆP VỤ ĐÃ CHỐT — DÀNH CHO CODEX.** Chủ dự án đã xác nhận riêng từng quyết định **D01–D20**, ngày 22/10/2026. Đặt nguyên tệp trong thư mục `Docs/`. Đây là baseline về **sản phẩm và hành vi nghiệp vụ**, không phải mã nguồn, thiết kế database, hợp đồng API, lựa chọn framework hay yêu cầu triển khai một dịch vụ bản đồ cụ thể. Khi lập kế hoạch code phải tuân thủ ranh giới P0/P1/P2, đối chiếu tài liệu M01 và M02 và bảo vệ dữ liệu cá nhân.
>
> **CHÚ Ý D01:** M03 V1.0 **không chỉ lưu quán ăn/cafe**. Phạm vi gồm **mọi loại địa điểm vui chơi/trải nghiệm** mà hai người muốn lưu, ghé thăm, đánh giá hoặc lên kế hoạch: nhà hàng, cafe, tiệm bánh, rạp phim, công viên, bảo tàng, khu vui chơi, điểm ngắm cảnh, trung tâm mua sắm, không gian hoạt động, v.v. M03 là **kho Place thống nhất**; món ăn/đồ uống chỉ là dữ liệu chuyên biệt khi phù hợp với loại Place. Không bắt các địa điểm không phục vụ đồ ăn phải có thực đơn, đánh giá món hay trường ẩm thực.
>
> **ĐỊNH NGHĨA P0/P1/P2:** P0 = bắt buộc để nghiệm thu Our Space V1.0, P1 = ưu tiên cao nhưng không mặc định thuộc V1.0, P2 = phát triển sau. Our Space chỉ phát hành chính thức khi cả 10 phân hệ cốt lõi hoạt động, không phải khi toàn bộ P1/P2 của mỗi phân hệ hoàn tất.
>
> **QUY TẮC ĐỌC CHO CODEX:** Đọc tối thiểu mục 2 (D01–D20), 4 (đối tượng và bất biến), 5–10 (màn hình), 11 (quyền), 12 (hợp đồng tích hợp), 13 (xóa/khôi phục), 15–17 (business rules, exceptions, acceptance criteria) và 19 (Definition of Done). Nếu tài liệu khác quy định mâu thuẫn, ghi issue chờ quyết định; **không âm thầm tự suy đoán**. Các ví dụ tên quán, giá, ngày, điểm số chỉ là dữ liệu minh họa, không phải seed data thực tế hoặc giới hạn cố định.

---

## MỤC LỤC

1. [Tổng quan, mục tiêu và phạm vi](#1-tổng-quan-mục-tiêu-và-phạm-vi)
2. [20 quyết định D01–D20 đã chốt, P0/P1/P2](#2-20-quyết-định-d01d20-đã-chốt-p0p1p2)
3. [Người dùng, khái niệm, hành trình và ranh giới](#3-người-dùng-khái-niệm-hành-trình-và-ranh-giới)
4. [Mô hình đối tượng, trạng thái và ràng buộc dữ liệu](#4-mô-hình-đối-tượng-trạng-thái-và-ràng-buộc-dữ-liệu)
5. [Sitemap và 16 màn hình](#5-sitemap-và-16-màn-hình)
6. [Đặc tả Place, Wishlist, Collections, Map](#6-đặc-tả-place-wishlist-collections-map)
7. [Date Planning, Calendar và Trips](#7-date-planning-calendar-và-trips)
8. [Visit History, đánh giá, món ăn và đồ uống](#8-visit-history-đánh-giá-món-ăn-và-đồ-uống)
9. [Favorites, Revisit, tìm kiếm, Random Picker và Insights](#9-favorites-revisit-tìm-kiếm-random-picker-và-insights)
10. [Bố cục chi tiết desktop/mobile và trạng thái UI](#10-bố-cục-chi-tiết-desktopmobile-và-trạng-thái-ui)
11. [Quyền riêng tư, chia sẻ, cộng tác và xung đột](#11-quyền-riêng-tư-chia-sẻ-cộng-tác-và-xung-đột)
12. [Hợp đồng nghiệp vụ với M01, M02 và các mô-đun khác](#12-hợp-đồng-nghiệp-vụ-với-m01-m02-và-các-mô-đun-khác)
13. [Trash, Archive, Restore, Export và an toàn dữ liệu](#13-trash-archive-restore-export-và-an-toàn-dữ-liệu)
14. [Use Cases và luồng thao tác từ đầu đến cuối](#14-use-cases-và-luồng-thao-tác-từ-đầu-đến-cuối)
15. [Quy tắc nghiệp vụ và các bất biến](#15-quy-tắc-nghiệp-vụ-và-các-bất-biến)
16. [Ngoại lệ, cạnh tranh dữ liệu và xử lý lỗi](#16-ngoại-lệ-cạnh-tranh-dữ-liệu-và-xử-lý-lỗi)
17. [Acceptance Criteria và ma trận kiểm thử](#17-acceptance-criteria-và-ma-trận-kiểm-thử)
18. [Non-functional requirements và chất lượng trải nghiệm](#18-non-functional-requirements-và-chất-lượng-trải-nghiệm)
19. [Ranh giới triển khai, phụ thuộc và Definition of Done](#19-ranh-giới-triển-khai-phụ-thuộc-và-definition-of-done)
20. [Ví dụ thực tế, traceability, change log](#20-ví-dụ-thực-tế-traceability-change-log)

---

# 1. Tổng quan, mục tiêu và phạm vi

## 1.1. Bối cảnh

Our Space là không gian số riêng tư dài hạn của hai người với **hai tài khoản độc lập**. M01 lưu nhật ký và photobook scrapbook, có chỉnh sửa đồng thời; M02 là thư viện ảnh/video trung tâm. **M03 — Food & Places** lưu những địa điểm muốn khám phá, lịch sử các lần trải nghiệm và việc hai người cùng lên kế hoạch. M03 cung cấp đầu vào nghiệp vụ cho M04 Travel, M05 Calendar, M06 Goals, M07 Budget, M08 Moments, M09 Interaction và Our Timeline.

Tên "Food & Places" là tên sản phẩm/điều hướng, **không giới hạn dữ liệu Place vào quán ăn**. Không tạo phân hệ lưu địa điểm giải trí thứ hai: điểm tham quan, rạp phim, công viên, bảo tàng và địa điểm trải nghiệm vẫn dùng thực thể Place của M03. Một chuyến đi ở M04 chỉ **tham chiếu** những Place này.

## 1.2. Mục tiêu

1. **Save for later:** lưu nhanh bất kỳ nơi vui chơi/ăn uống muốn đến từ ý tưởng, đường dẫn hoặc nhập thủ công.
2. **Discover our own list:** tìm, lọc và tổ chức các địa điểm đã lưu bằng Wishlist và Collections cá nhân/chung.
3. **Plan together:** lập kế hoạch một buổi đi chơi/ăn uống có liên kết lịch M05; dễ hoãn, hủy, chuyển thành trải nghiệm đã diễn ra.
4. **Remember visits:** một địa điểm có nhiều Visit độc lập, ảnh, ghi chú, món, chi phí, đánh giá và cảm xúc tương ứng từng lần.
5. **Two voices:** hai tài khoản có đánh giá, Favorite và Revisit Preference riêng; không ghi đè hoặc tự suy diễn cảm nhận của người kia.
6. **Integrated memories:** dùng lại media của M02 và liên kết M01/M04/M05/M07, không nhập lại hoặc tạo bản sao không cần thiết.
7. **Private, durable:** Private mặc định, quyền theo từng nội dung, Trash 30 ngày, không xóa dây chuyền các ký ức liên quan.
8. **Useful in the moment:** giao diện di động nhanh khi đang đi chơi; desktop thuận tiện tổ chức và xem lại lịch sử.

## 1.3. Phạm vi Place trong V1.0 (D01 đã chốt)

**Các nhóm ví dụ, không phải danh sách đóng:**

| Nhóm nghiệp vụ | Ví dụ | Dữ liệu cốt lõi | Dữ liệu đặc thù (tùy chọn) |
|---|---|---|---|
| Food / Restaurant | Quán ăn, nhà hàng, buffet, ẩm thực đường phố | Tên, vị trí, mô tả, Visit | Món ăn, đồ uống, hóa đơn |
| Café / Drinks / Dessert | Cafe, trà sữa, tiệm bánh, kem | Tên, vị trí, ảnh, Visit | Danh sách thức uống/món |
| Entertainment | Rạp phim, karaoke, game center, bowling | Tên, địa điểm, Visit | Hoạt động, giá vé tham khảo |
| Culture / Art | Bảo tàng, triển lãm, nhà hát | Tên, địa điểm, Visit | Loại triển lãm/sự kiện đã trải nghiệm trong ghi chú |
| Outdoor / Nature | Công viên, hồ, bãi biển, điểm ngắm cảnh | Tên, vị trí, Visit | Hoạt động ngoài trời, ghi chú thời tiết tự nhập |
| Shopping / Leisure | Trung tâm mua sắm, khu phố đi bộ, chợ | Tên, vị trí, Visit | Trải nghiệm, địa điểm con nếu cần |
| Activity / Experiences | Workshop, khu vui chơi, điểm trải nghiệm | Tên, vị trí, Visit | Nội dung hoạt động/phiên tham gia |
| Other | Bất kỳ địa điểm phù hợp khác | Cùng mô hình Place | Tag/tùy biến ghi chú |

Không bắt người dùng tìm thấy category chính xác mới lưu được Place. Có `Other` và tag tự do. Danh mục category có thể phát triển về sau. **Event có ngày giờ** được M05 quản lý, **Trip** do M04 quản lý, **ảnh/video** do M02 quản lý; Place lưu địa điểm, không tự trở thành một trong các đối tượng đó.

## 1.4. Nguyên tắc xuyên suốt

- **One Place, many contexts:** một Place có nhiều Wishlist Entry/Collection Membership/Plan/Visit và được M04 dùng lại.
- **A Place is not a Visit:** lưu quán hoặc hoàn thành lịch hẹn không có nghĩa đã ghé.
- **A Visit is not a Review:** một lần đi có thể chưa đánh giá hoặc có hai đánh giá cá nhân khác nhau.
- **A Place can be visited and wishlisted simultaneously:** trạng thái "visited" được suy ra từ Visit hợp lệ; wishlist/revisit là ý định có thể tồn tại tiếp.
- **Actual costs belong to M07:** giao diện Visit có thể nhập chi phí, nhưng tránh hai nguồn tổng tiền thực tế không đồng bộ.
- **No automatic disclosure:** cấp quyền Place không tự cấp quyền các Visit, Review, ảnh, Diary riêng tư.
- **No made-up facts:** không tự tạo giờ mở cửa, rating công khai, khoảng cách, tuyến đường, giá hiện tại, hoặc tọa độ từ dữ liệu thiếu.
- **Change without loss:** xóa Collection không xóa Place; xóa Visit không xóa Place; xóa Place không xóa ảnh/nhật ký/sự kiện liên quan.
- **Mobile = first-class:** hai thiết bị làm được tác vụ cốt lõi, không chỉ responsive theo chiều rộng.

## 1.5. Không thuộc M03 V1.0

Không bắt buộc bản đồ tương tác nhúng trong website, đồng bộ trạng thái mở cửa theo thời gian thực, tối ưu hành trình, tìm quán công khai từ mạng Internet, đặt bàn/vé, tự đặt chỗ, thanh toán, lấy menu bên ngoài liên tục, AI phân tích sở thích, AI đọc menu/ảnh. Có thể mở đường dẫn Maps và nhập liên kết; tính năng tự điền từ link là **best-effort có fallback nhập tay**, không cam kết mọi URL đều trích xuất được.

---

# 2. 20 quyết định D01–D20 đã chốt, P0/P1/P2

> Bảng dưới đây chép **đúng ý nghĩa quyết định của chủ dự án**. Nếu đoạn khác mâu thuẫn với D01–D20, ưu tiên D01–D20 và báo cáo vấn đề trước khi triển khai.

| Mã | Quyết định đã duyệt | Chuẩn hóa thành yêu cầu | Ưu tiên |
|---|---|---|---|
| D01 | **Hỗ trợ mọi loại địa điểm vui chơi ngay V1.0** | Place dùng chung cho địa điểm ăn uống, vui chơi, tham quan, giải trí, hoạt động; giao diện linh hoạt theo category | P0 |
| D02 | **Private, chia sẻ có chủ đích** | Place/Collection/Plan/Visit mới Private mặc định trừ khi được tạo trong ngữ cảnh chia sẻ có xác nhận rõ | P0 |
| D03 | **Dán link + nhập tay; tự điền khi nguồn hợp lệ hỗ trợ** | Cho lưu URL nguồn và nhập thủ công; best-effort điền thông tin nếu có nguồn/khả năng hợp lệ; phải cho người dùng kiểm duyệt | P0 |
| D04 | **Mỗi chi nhánh là một Place riêng** | Tên thương hiệu trùng không khiến gộp chi nhánh; định danh theo vị trí/chi nhánh xác nhận | P0 |
| D05 | **Wishlist/Collections cá nhân & chung; một Place ở nhiều list** | Nhiều-nhiều, không nhân bản Place; quyền list độc lập | P0 |
| D06 | **V1.0 mở chỉ đường; bản đồ tương tác P1** | P0 lưu link, tọa độ tùy chọn và mở bản đồ bên ngoài; không bắt làm bản đồ nhúng | P0/P1 |
| D07 | **Date Planning liên kết M05** | Plan ở M03 tham chiếu Event của M05 khi có lịch cụ thể; không có hai lịch cạnh tranh | P0 |
| D08 | **Mỗi lần ghé là một Visit độc lập** | Một Place nhiều Visit; giữ riêng ngày, người tham gia, ảnh, món, chi phí, đánh giá | P0 |
| D09 | **Hai người đánh giá riêng theo Visit; 1–5, bước 0,5** | Không đè review; không tạo 0 khi bỏ trống | P0 |
| D10 | **Điểm tổng thể + tiêu chí phụ tùy chọn** | Overall bắt buộc nếu gửi rating; Food/Drinks, Service, Atmosphere, Value chỉ khi phù hợp | P0 |
| D11 | **Wishlist món, món đã thử, theo Visit** | Dishes/Drinks dùng cho các địa điểm phù hợp; không bắt tất cả Place có món | P0 |
| D12 | **Favorite và Revisit độc lập theo tài khoản** | Hai loại đánh dấu, không phải trạng thái Place toàn cục | P0 |
| D13 | **Random Picker có lọc trong V1.0** | Chọn ngẫu nhiên hợp lệ từ tập Place có quyền; có chế độ cho ăn uống hoặc mọi loại địa điểm | P0 |
| D14 | **Tìm kiếm đa điều kiện + thống kê cơ bản V1.0** | Lọc theo tên, nhóm, khu vực, wishlist/visit, tags, người thêm, favorite; phân biệt Places và Visits | P0 |
| D15 | **Media liên kết trực tiếp M02, không lưu trùng** | Dùng Media Asset IDs/reference; không duy trì kho ảnh riêng M03 | P0 |
| D16 | **Chi phí ghi ở Visit và liên kết M07** | UX ghi khoản chi ngay từ Visit; M07 là chủ nghiệp vụ khoản chi thực tế | P0 |
| D17 | **Cùng quản lý, chống xung đột, không live cursor** | Đồng thời thêm độc lập, kiểm tra version khi cùng sửa; không mất cập nhật âm thầm | P0 |
| D18 | **Trash 30 ngày, bảo vệ liên kết** | Soft delete, Restore, không cascade delete media/Diary/Event/Expense | P0 |
| D19 | **AI và nhập liệu nâng cao P2** | Không bắt AI, nhận dạng ảnh/menu/gợi ý cá nhân hóa trong V1.0; D03 best-effort thông thường vẫn có | P2 |
| D20 | **Mobile và desktop đủ nghiệp vụ chính** | Tạo/sửa/xem Place, list, Plan, Visit, Review, Search, Random Picker, quyền trên cả hai | P0 |

## 2.1. P0 — chức năng phải nghiệm thu

1. Mọi loại Place vui chơi và ăn uống, tạo bằng tay hoặc dán link, quản lý chi nhánh, kiểm tra khả năng trùng.
2. Trang chủ M03, danh sách Place, Place Detail, phân loại, lọc, tags, ảnh bìa từ M02.
3. Wishlist và Collections riêng/chung, Place nằm trong nhiều list.
4. Lưu URL/địa chỉ và mở chỉ đường bằng dịch vụ bên ngoài khi có dữ liệu hợp lệ.
5. Date Plan: Idea/Scheduled/Postponed/Completed/Cancelled, liên kết lịch M05.
6. Visit theo từng lần ghé, ngày thực tế, người tham gia, media M02, hoạt động/món khi phù hợp.
7. Personal Review 1–5 bước 0,5 và tiêu chí phụ tùy chọn; tổng hợp đúng phạm vi quyền.
8. Các mục Dish/Drink đã và muốn thử cho nơi phù hợp, liên kết món với Visit.
9. Favorite và Want to Revisit theo từng tài khoản, Random Picker có lọc.
10. Search, filters, insights cơ bản phân biệt Place/Visit, không lộ private data.
11. Quyền riêng, chống ghi đè, 30-day Trash, Restore, bảo vệ liên kết, mobile và desktop.
12. Tích hợp nghiệp vụ thực tế với M01, M02, M04, M05, M07, M09, Timeline theo phạm vi dữ liệu khả dụng.

## 2.2. P1 — không mặc định bắt buộc V1.0

- Bản đồ tương tác ngay trong Our Space, clustering pin, lọc theo khoảng cách thực tế, hiển thị tuyến đường trên bản đồ.
- Nhập thông tin phong phú từ những nhà cung cấp bên ngoài; làm giàu dữ liệu, đồng bộ thay đổi địa chỉ/giờ mở cửa.
- Công cụ lập food tour nhiều điểm hoặc bộ lọc di chuyển nâng cao.
- Random Picker với vòng quay hoạt họa, lịch sử bốc thăm nâng cao, trọng số dựa trên sở thích.
- Phân tích nâng cao theo category, địa lý, chi phí, đồ thị lịch sử.
- Hợp nhất nhiều Place trùng một cách bán tự động có hỗ trợ người dùng.

## 2.3. P2 — định hướng tương lai

AI đề xuất địa điểm theo sở thích, trích xuất từ ảnh/menu hoặc video, gợi ý hoạt động từ social URL, tự nhận diện món, xây food tour tối ưu tự động, đánh giá cảm xúc và các tích hợp thông minh cần đồng ý riêng.

## 2.4. Thông số chưa được chủ dự án ấn định

Không tự đặt cứng trong nghiệp vụ: số lượng Place/Collection/Visit tối đa; độ dài tên/mô tả chi tiết; mức giá chuẩn; tập taxonomy cuối; nguồn và phí bản đồ; ngưỡng duplicate fuzzy; thời gian phản hồi chuẩn; số item mỗi trang; thời gian nhắc lịch; mức ngân sách; danh sách loại tiền hỗ trợ ngoài cấu hình hệ thống. Có thể lựa chọn giá trị kỹ thuật cấu hình được ở giai đoạn thiết kế kỹ thuật, tài liệu hóa và kiểm thử; không tuyên bố chúng là quyết định đã được chủ dự án chốt.

---

# 3. Người dùng, khái niệm, hành trình và ranh giới

## 3.1. Actors

| Actor | Định nghĩa | Quyền tổng quát |
|---|---|---|
| User A | Một trong hai tài khoản chính | Quyền theo từng tài nguyên; có thể là Owner |
| User B | Tài khoản còn lại | Quyền theo từng tài nguyên; có thể là Owner |
| Owner | Người sở hữu đối tượng | Đọc/sửa/quản lý chia sẻ/xóa theo chính sách |
| Editor | Người được cấp quyền chỉnh sửa | Đọc và sửa các đối tượng được cấp; không mặc nhiên xóa vĩnh viễn |
| Viewer | Người được cấp quyền xem | Không sửa, không cấp quyền |
| System | Thực thi quy tắc, đồng bộ và tích hợp | Không tự thực hiện hành vi người dùng chưa đồng ý |

Không mặc định mọi dữ liệu của hai người đều Shared chỉ vì họ thuộc cùng không gian. Cả hai đều có thể tạo nội dung riêng tư.

## 3.2. Thuật ngữ và định nghĩa chính thức

| Thuật ngữ | Định nghĩa | Không được nhầm với |
|---|---|---|
| Place | Một cơ sở/điểm đến/địa điểm cụ thể được lưu trong Our Space | Brand, Visit, Plan |
| Brand/Chain | Tên thương hiệu có thể có nhiều chi nhánh | Một Place duy nhất |
| Category | Nhóm đặc điểm Place (cafe, entertainment, nature, etc.) | Tên Collection |
| Wishlist Entry | Ý định muốn tới Place của một người hoặc trong danh sách được chia sẻ | Trạng thái chưa từng ghé |
| Collection | Danh sách các Place được chọn bởi người dùng | Một bản sao Place |
| Date Plan | Kế hoạch đi chơi/ăn uống, có thể chưa có ngày | Visit đã xảy ra, Calendar Event |
| Calendar Event | Nguồn sự thật về lịch đặt cụ thể trong M05 | Bản sao lịch riêng ở M03 |
| Visit | Một lần ghé thực tế, độc lập với lần khác | Place, Completed Plan |
| Participant | Tài khoản được liệt kê là người tham gia Visit | Người tự động xác nhận tham gia |
| Review | Nhận xét và điểm cá nhân của một người cho Visit | Đánh giá chung của quán trên Internet |
| Dish | Món ăn/đồ uống gắn với Place hỗ trợ phục vụ | Bất kỳ hoạt động ở mọi Place |
| Visit Item | Món đã gọi/thử trong một Visit | Món nằm trong wishlist |
| Favorite | Đánh dấu yêu thích riêng của tài khoản | Revisit |
| Revisit Preference | Đánh dấu muốn quay lại, riêng từng tài khoản | Visit tiếp theo đã lên lịch |
| Media Link | Tham chiếu đến asset trong M02 | Một ảnh gốc được upload riêng M03 |
| Trash | Trạng thái xóa mềm có thể phục hồi trong 30 ngày | Xóa vĩnh viễn |

## 3.3. Hành trình mẫu xuyên phân hệ

1. A thấy một địa điểm trên mạng, dán link hoặc nhập tên Place; Private mặc định.
2. A xác nhận muốn chia sẻ Place với B, thêm vào Shared Collection.
3. B thêm ghi chú ưu tiên và đánh dấu muốn đến.
4. A tạo Date Plan từ Place, chọn ngày giờ; M05 quản lý Event khi lập lịch cụ thể.
5. Nếu dời buổi hẹn, ngày trên cả M03 và M05 nhất quán; chưa có Visit.
6. Khi đã thực sự đến, một người xác nhận và tạo Visit với ngày thực tế.
7. A và B đánh giá riêng cùng Visit; media liên kết M02; món/hoạt động được ghi nhận nếu phù hợp.
8. Ghi khoản chi trong giao diện Visit, liên kết đến nguồn M07; người có quyền xem được thông tin phù hợp.
9. Tạo Diary từ Visit, đưa ảnh/chuyện vào Photobook của M01 theo quy trình cấp quyền.
10. Our Timeline hiển thị Visit/Diary khi quyền truy cập cho phép; Place có thể được chọn vào M04 Trip sau này.

## 3.4. Quyền sở hữu thông tin giữa các mô-đun

- M03 sở hữu Place, Collection, Wishlist Entry, Date Plan *không phải sự kiện lịch*, Visit, Review, Dish, Favorite, Revisit.
- M02 sở hữu file gốc, asset, media variants, album media, metadata ảnh, quyền media.
- M01 sở hữu bài Diary, Photobook và trang sách.
- M04 sở hữu Trip, Trip Stop, itinerary.
- M05 sở hữu Calendar Event và thời gian/hủy/dời của lịch hẹn đã liên kết.
- M07 sở hữu khoản chi thực tế, record chi tiêu và thống kê tiền tệ chuẩn.
- M08 sở hữu cột mốc/Time Capsule; M09 sở hữu bình luận/tương tác theo đối tượng; M10 và shared foundation quản lý tài khoản/chính sách.

---

# 4. Mô hình đối tượng, trạng thái và ràng buộc dữ liệu

## 4.1. Danh mục thực thể nghiệp vụ

| ID | Entity | Thông tin cốt lõi | Quan hệ |
|---|---|---|---|
| ENT-M03-01 | Place | id, name, categories, address, map link, coordinates optional, owner, visibility, timestamps | Nhiều Visit, Plan, Collections |
| ENT-M03-02 | Place Category | key, display name, applicability | Nhiều Place; có Other |
| ENT-M03-03 | Place Tag | tag text, scope/owner | Nhiều Place |
| ENT-M03-04 | Collection | id, name, description, cover reference, owner, visibility | Nhiều Place |
| ENT-M03-05 | Collection Membership | collection_id, place_id, order, note, created_by | N–N, không chứa bản sao Place |
| ENT-M03-06 | Wishlist Entry | person/list context, place_id, note, priority, timestamps | Nhiều ý định; độc lập Visit |
| ENT-M03-07 | Date Plan | id, name, primary place, status, proposed time, calendar ref, notes, participants | Place 1–N Plan |
| ENT-M03-08 | Visit | id, place_id, visited_at/local date, participants, notes, visibility | Place 1–N Visit |
| ENT-M03-09 | Visit Participant | visit_id, user_id, confirmation status | Visit N–N với hai người |
| ENT-M03-10 | Visit Review | visit_id, reviewer_id, overall, optional aspects, text | Tối đa một review hiện hành / reviewer / Visit |
| ENT-M03-11 | Dish / Drink | id, place_id, name, type, notes, reference price | Áp dụng theo category |
| ENT-M03-12 | Visit Item | visit_id, dish_id optional, label snapshot, quantity optional, amount optional | Lưu chính xác món từng lần |
| ENT-M03-13 | Dish Review | visit item/dish, reviewer, optional rating/notes | Có thể khác giữa lần thử |
| ENT-M03-14 | Favorite | user_id + place_id | Riêng từng tài khoản |
| ENT-M03-15 | Revisit Preference | user_id + place_id, optional note | Riêng từng tài khoản |
| ENT-M03-16 | Place Media Link | asset_id M02, target Place hoặc Visit, usage role | Không chứa blob media |
| ENT-M03-17 | Place Permission | target type/id, subject, role, policy | Cấp object, quyền không suy diễn quá mức |
| ENT-M03-18 | Related Content Link | target M01/M04/M05/M07/M08/M09 | Theo hợp đồng cross-module |
| ENT-M03-19 | Change History | actor, object, before/after scope, timestamp | Audit, khôi phục giải quyết xung đột |
| ENT-M03-20 | Trash Record | target, deleted_by, deleted_at, purge eligibility, restore state | 30-day retention |

**Quan trọng:** Tên thuộc tính là **ngôn ngữ mô hình khái niệm**, không bắt buộc dùng y nguyên làm tên cột. M03 phải có ID bền vững; chỉnh tên, địa chỉ, thứ tự Collection hoặc đổi ảnh không được làm mất tham chiếu.

## 4.2. Bất biến quan hệ (cardinality)

- **Place 1:N Visit.** Mỗi Visit gắn một Place thực sự, Place có thể chưa có Visit nào.
- **Place 1:N Date Plan.** Hoãn hoặc hủy Plan không chuyển sang Visit; cùng Place có nhiều Plan khác nhau.
- **Place N:M Collection** qua Membership. Không copy Place khi thêm vào danh sách thứ hai.
- **Visit N:M Participant.** Với hai tài khoản chính, người tham gia là quan hệ có trạng thái xác nhận.
- **Visit 1:N Review** theo người; khóa logic (Visit, reviewer) với một bản hiện hành, không ngăn ghi lịch sử thay đổi.
- **Place 1:N Dish/Drink** khi category phù hợp; Place không phục vụ đồ ăn có 0 Dish.
- **Visit N:M Dish** thông qua Visit Item, lưu tên/giá quan sát lúc gọi để đổi menu tương lai không làm sai lịch sử.
- **Place 1:N Wishlist Entry** theo danh sách/người/ý định hợp lệ; Visit không tự xóa Entry.
- **Place N:M Media**, Visit N:M Media qua tham chiếu asset M02 với quyền.
- **Place/Visit N:M Content Links** đến Diary/Trip/Event/Expense/Moments theo mô-đun sở hữu.

## 4.3. Place vs Brand/Branch vs Venue event

- `brand_name` (nếu có) là thuộc tính gợi ý/tổ chức; **không** hợp nhất hai chi nhánh cùng tên.
- Tọa độ/địa chỉ có thể thiếu khi lưu sơ bộ; người dùng được bổ sung sau.
- Nếu venue chuyển địa chỉ, cần lựa chọn sửa địa điểm hiện có hay tạo Place mới khi bản chất trải nghiệm/chi nhánh khác nhau; không tự động làm lệch lịch sử Visit.
- Sự kiện tạm thời như triển lãm có thời gian cụ thể: Place là địa điểm tổ chức; **thời gian, vé, lịch** gắn M05/M04/Visit theo nghiệp vụ tương ứng. Không cần tạo một Place riêng cho mỗi suất diễn nếu venue vẫn là một nơi.

## 4.4. Dữ liệu gợi ý cho Place

| Nhóm | Trường | Bắt buộc | Ghi chú |
|---|---|---|---|
| Nhận diện | Place name | Có | Trim; không chỉ whitespace |
| Nhận diện | Category | Có | Ít nhất một nhóm hoặc Other; có thể sửa |
| Vị trí | Address text | Không | Không tạo giả nếu trống |
| Vị trí | Map URL | Không | Link điều hướng, cần kiểm tra tính an toàn |
| Vị trí | Coordinates | Không | Có nguồn và mức tin cậy nếu lưu |
| Nội dung | Description/notes | Không | Text của người dùng |
| Nội dung | Tags | Không | Một hoặc nhiều |
| Nội dung | Cover media asset | Không | Ref M02, tuân thủ quyền media |
| Tham khảo | Source URL | Không | Link nơi biết đến Place; không phải map URL bắt buộc |
| Tham khảo | Estimated price band | Không | Nhập tay và ghi rõ thời điểm tham khảo nếu cần |
| Tham khảo | Recommended by | Không | Ghi chú người đề xuất, không tự suy diễn |
| Quyền | Owner, visibility | Có | Owner từ phiên xác thực, Private mặc định |
| Vòng đời | Status, created/updated | Có | Active/Archived/Trashed theo nghiệp vụ |

Không buộc quán cafe có `menu`, không buộc rạp phim có `dish`, không bắt công viên có `opening_hours` hay `price` khi chưa biết. Có thể bổ sung thông tin chuyên biệt từng category về sau mà không thay đổi định danh Place.

## 4.5. Trạng thái Place, Plan, Visit, Review, Collection

| Đối tượng | Trạng thái | Quy tắc |
|---|---|---|
| Place | Active | Có thể xem, dùng trong list, kế hoạch, Visit theo quyền |
| Place | Archived | Không hiện danh sách chính theo mặc định; vẫn giữ lịch sử |
| Place | Trashed | Xóa mềm, không thể chọn làm kế hoạch mới nếu chưa restore |
| Date Plan | Idea | Có thể chưa có ngày, chỉ là dự định |
| Date Plan | Scheduled | Đã có ngày giờ cụ thể và link M05 tương ứng nếu tạo lịch |
| Date Plan | Postponed | Hoãn, có thể đặt lịch mới; không đồng nghĩa Cancelled |
| Date Plan | Completed | Người dùng xác nhận kế hoạch đã diễn ra, **không tự sinh Visit** |
| Date Plan | Cancelled | Dừng kế hoạch; Place và Wishlist không mất |
| Visit | Active | Có ghi nhận một lần ghé thực tế |
| Visit | Trashed | Không tính vào thống kê, có thể Restore trong thời hạn |
| Review | Draft/Submitted/Trashed (nếu sử dụng bản nháp) | Không tính bản nháp vào điểm công khai; một review hiện hành/người/Visit |
| Collection | Active/Archived/Trashed | Xóa Collection không xóa Place/Visit |

**Derived labels:** `Visited` = Place có ≥1 Visit hợp lệ mà người xem có quyền biết; `Favorite` và `Revisit` = trạng thái đánh dấu riêng của tài khoản; `Wishlisted` = có quan hệ wishlist phù hợp. Không ép chúng thành một trường trạng thái loại trừ nhau.

## 4.6. Trạng thái xác nhận người tham gia

`Proposed` (được người tạo Visit ghi nhận), `Confirmed` (chính tài khoản xác nhận), `Declined/NotParticipated` (nếu người được gắn xác nhận không tham gia). Không dùng một người tự ghi tên người kia để làm bằng chứng người kia đã tham gia. Việc xác nhận có thể chưa hoàn thành khi Visit được lưu.

## 4.7. Thời gian, địa điểm và tiền

- Phân biệt ngày **Visit diễn ra** với `created_at` và `updated_at`; hỗ trợ nhập bù kỷ niệm cũ.
- Plan có thời gian địa phương và múi giờ của sự kiện theo M05; không thay Date Plan bằng thời gian máy người sử dụng.
- Khi thời gian không chắc chắn, không bắt buộc điền giờ; Visit vẫn có ngày thực tế.
- `estimated_budget` của Plan là dự toán, `actual_expense` được M07 sở hữu và tham chiếu về Visit. Không cộng cả hai như cùng một khoản.
- Có tiền tệ và đơn vị hiển thị theo cấu hình chung M10/M07; không hardcode một ký hiệu tiền tệ vào bản ghi.

---
# 5. Sitemap và 16 màn hình

## 5.1. Sitemap chức năng

```text
Our Space
  └── Food & Places (M03)
       ├── FP-01  Home / Overview
       ├── FP-02  All Places
       │    ├── FP-03  Add / Edit Place
       │    └── FP-04  Place Detail
       │         ├── FP-07  Date Planning
       │         ├── FP-08  Visit History
       │         │    ├── FP-09  Add / Edit Visit
       │         │    └── FP-10  Visit Detail
       │         │         └── FP-11 Ratings & Reviews
       │         └── FP-12  Dishes & Drinks (nếu phù hợp)
       ├── FP-05  Wishlist & Collections
       ├── FP-06  Places Map / Directions entry (P0 external link; interactive P1)
       ├── FP-13  Favorites & Revisit
       ├── FP-14  Search & Filters
       ├── FP-15  Random Picker
       └── FP-16  Insights & Settings
```

Đây là **16 giao diện chức năng**, không có nghĩa 16 route tuyệt đối: form Edit, Review hoặc Dishes có thể là tab, drawer hoặc modal. Mục tiêu là mỗi hành vi có điểm vào, điểm kết thúc và kiểm tra quyền rõ ràng.

## 5.2. Danh sách màn hình và yêu cầu nghiệm thu sơ bộ

| ID | Màn hình | Mục đích / hành động chính | Desktop | Mobile |
|---|---|---|---|---|
| FP-01 | Home | Tổng quan, quick add, wishlist, upcoming plan, recent visits | Dashboard nhiều vùng | Thẻ xếp dọc, quick action nổi bật |
| FP-02 | All Places | Card/list, filter, batch collection action | Grid/list + sidebar | List/card + filter drawer |
| FP-03 | Add/Edit Place | Nhập tay/link, xác nhận dữ liệu, cấp quyền | Form/panel rộng | Form từng nhóm |
| FP-04 | Place Detail | Hồ sơ Place, plan, visits, reviews, items, links | Các tab/panel | Các section/tab cuộn dọc |
| FP-05 | Wishlist & Collections | Danh sách riêng/chung, ưu tiên, reorder | Bảng/card + organizer | Danh sách + hành động ngữ cảnh |
| FP-06 | Places Map | Deep link chỉ đường P0, contextual map P1 | Link / Map P1 | Mở ứng dụng bản đồ |
| FP-07 | Date Planning | Idea, schedule, postpone, cancel, complete | Form và thông tin M05 | Form nhanh, chọn ngày giờ |
| FP-08 | Visit History | Danh sách nhiều Visit theo thời gian | Timeline/list | Cards/timeline |
| FP-09 | Add/Edit Visit | Ngày, người, ảnh, hoạt động/món, chi phí | Form đầy đủ | Quy trình từng bước |
| FP-10 | Visit Detail | Xem lần ghé, media, participants, reviews | Nội dung + sidebar | Dọc, ảnh gallery |
| FP-11 | Ratings & Reviews | Đánh giá riêng, tiêu chí tùy chọn, tổng hợp | Rating form/panel | Form theo tiêu chí |
| FP-12 | Dishes & Drinks | Wishlist món, đã thử, đánh giá từng lần | Tab/menu list | Tab/list, thêm nhanh |
| FP-13 | Favorites & Revisit | Danh sách yêu thích/muốn quay lại | Card/list filters | Quick toggles + cards |
| FP-14 | Search & Filters | Search kết hợp category/area/date/score | Form filter lớn | Drawer/chips |
| FP-15 | Random Picker | Chọn ngẫu nhiên Place thỏa bộ lọc | Panel riêng | Full-height picker |
| FP-16 | Insights & Settings | Thống kê theo quyền, cài category/tag hiển thị | Dashboard đơn giản | Summary cards |

## 5.3. Điều hướng và hành động chung

- Entry từ Homepage tới M03 Home; từ Media/Diary/Travel/Calendar có thể mở Place Detail bằng tham chiếu id.
- Nút `Add Place` có trên FP-01 và FP-02; tùy màn hình có `Add Visit`, `Add to Wishlist`, `Plan`, `Open Directions`, `Edit`.
- Breadcrumb/back luôn có thể quay lại bộ lọc, collection hoặc visit đang mở khi phù hợp.
- Không có Place vẫn thấy empty state kèm tạo mới; không có Review không hiển thị điểm 0; thiếu tọa độ không hiển thị pin giả.
- Thao tác nguy cơ cao (`Delete`, `Revoke Sharing`, `Replace Location`, `Merge` nếu P1) có confirmation và mô tả tác động.
- Các action vượt quyền không thực thi dù người dùng nhập thẳng URL hoặc dùng request cũ.

---

# 6. Đặc tả Place, Wishlist, Collections, Map

## 6.1. FP-01 — Food & Places Home

### Mục tiêu và thành phần

- Header: tên phân hệ, search, Add Place, quyền truy cập tới All Places.
- Quick navigation: Wishlist / Visited / Favorites / Collections / Random Picker.
- Upcoming Plans: sự kiện hẹn sắp tới có quyền xem, thời gian lấy từ M05.
- Places To Try: các wishlist ưu tiên hoặc mới được lưu, có quyền.
- Recent Visits: Visit theo ngày diễn ra (có khả năng khác ngày upload).
- Shared Highlights: các Place cả hai đã chia sẻ, không được suy ra nội dung Private.
- Empty states: chưa có Place, chưa có Visit, chưa có lịch hẹn; CTA phù hợp.

### Tương tác

| Action | Kết quả |
|---|---|
| Quick Add Place | Mở FP-03, Private được chọn mặc định |
| Chạm card Place | FP-04 đúng Place và quyền |
| Chạm Visit | FP-10 theo đúng Visit và quyền |
| Chạm Plan | FP-07 hoặc event M05 được liên kết |
| Search | FP-14 với bộ lọc được giữ |
| Random | FP-15, mặc định chọn từ nhóm có thể sử dụng được |

**Quy tắc Home:** các thống kê/preview tổng hợp chỉ tính dữ liệu hiện có quyền; nếu không có sự kiện sắp tới, không tự tạo lịch giả. Không đưa thông tin nhạy cảm từ visit riêng vào ảnh đại diện/chú thích nơi khác.

## 6.2. FP-02 — All Places

### Danh sách / Card

Tối thiểu: ảnh cover nếu được phép; tên; category; địa chỉ/khu vực nếu có; tags; dấu wishlist/visited/favorite tương ứng với dữ liệu được phép; người tạo (khi được xem); cập nhật gần nhất. Không thể sử dụng *public rating* tự động trừ khi có nguồn hợp lệ, và không coi personal Visit rating là điểm công khai của quán.

### Hành động

- Toggle grid/list; filter theo tên, category, wishlist/visited, collections, favorite/revisit, created by, area, rating được phép.
- Sort: thời gian thêm/sửa, tên, ngày Visit gần nhất được phép, mức ưu tiên wishlist (khi có).
- Chọn nhiều card để thêm vào Collection; không cho batch-delete tài nguyên người khác vượt quyền.
- Place Archived/Trashed có khu vực riêng; không đưa vào Random mặc định.
- Search/filter giữ được khi back từ Place Detail.

### Empty/edge states

Chưa có Place, bộ lọc không ra kết quả, dữ liệu đang tải, lỗi tải, Place riêng tư bị thu hồi. CTA phải phản ánh đúng nguyên nhân: `Add Place`, `Clear Filters` hoặc `Retry`.

## 6.3. FP-03 — Add / Edit Place

### Hai luồng tạo

**Manual**
1. Chọn Add Place.
2. Nhập Name, ít nhất một Category hoặc Other.
3. Bổ sung địa chỉ, map URL, mô tả, tags, giá tham khảo, cover từ M02 khi cần.
4. Quyền mặc định Private; hiển thị người được chia sẻ nếu thay đổi.
5. Kiểm tra Place có thể trùng và chỉ cho xác nhận khi hiểu đề xuất.
6. Save; được mở FP-04.

**Paste link**
1. Dán URL nguồn hoặc Maps vào trường link.
2. Kiểm tra cú pháp và tính an toàn URL; thử đọc/tự điền **chỉ nếu nguồn được phép và khả năng hỗ trợ có thật**.
3. Cho người dùng xem các trường gợi ý với nguồn/độ chắc chắn nếu có; không tự ghi đè field đã nhập.
4. Nếu không thể trích xuất: giữ URL và cho nhập tay, không báo "link lỗi" chỉ vì không đọc được metadata.
5. Kiểm tra trùng; xác nhận; save.

### Form chi tiết

| Nhóm UI | Trường/điều khiển | Ràng buộc |
|---|---|---|
| Identity | Name | Required, không chỉ whitespace |
| Categories | Một/nhiều category, Other | Required; không dùng danh mục đóng |
| Location | Address, area, coordinates optional | Nhập tay hợp lệ; không tự bịa tọa độ |
| Links | Map URL, source URL | URL an toàn, không nhúng mã không tin cậy |
| Content | Description, tags, reference price | Optional; text theo giới hạn cấu hình |
| Media | Cover asset picker M02 | Chỉ chọn ảnh hợp lệ theo quyền |
| Privacy | Private/Shared, role | Private mặc định, chia sẻ phải xác nhận |
| Confirmation | Save/Cancel | Chống lưu trùng nếu nhấn liên tục |

### Hành vi kiểm tra trùng

- So sánh những Place mà người dùng có quyền biết/được phép hợp nhất; cân nhắc tên, map URL, địa chỉ, tọa độ hợp lệ.
- Phải phân biệt **chi nhánh khác nhau** ngay cả khi tên thương hiệu giống nhau.
- Chỉ là **cảnh báo/gợi ý**, không tự hợp nhất hai Place khác bản chất.
- Không tiết lộ Place Private của người kia qua thông báo "trùng với địa điểm bí mật".
- Với hai người cùng tạo một Place song song, cần idempotency của thao tác create và cảnh báo duplicate có thể phát hiện; chức năng merge phức tạp thuộc P1.

### Edit Place

Giữ ID. Sửa tên, ảnh bìa, địa chỉ, tags không xóa Plan/Visit/Review cũ. Nếu sửa địa chỉ có nguy cơ làm sai lịch sử, thông báo rằng các Visit cũ vẫn tham chiếu Place và dùng thông tin lịch sử nếu được ghi riêng. Với thay đổi quan trọng, ghi lịch sử người sửa và thời gian.

## 6.4. FP-04 — Place Detail

### Nội dung

- Header: cover (M02), name, categories, address/map link nếu có, trạng thái Active/Archived.
- Quick actions: Add Wishlist, Plan Date, Add Visit, Favorite, Revisit, Edit, Directions, Share.
- Tabs/sections: Overview; Plans; Visit History; Reviews summary; Dishes & Drinks nếu áp dụng; Photos/Media; Related Memories; Permissions.
- Facts: notes/tags/price tham khảo, source URLs; không khẳng định giờ mở cửa/giá mới nhất nếu chưa xác minh.
- Related content chỉ hiển thị nếu người dùng có quyền truy cập từng Visit/Diary/media liên quan.

### Phân biệt tổng hợp

- `Total visits (visible)` = số Visit không bị xóa mà người xem được phép biết.
- `Last visited` = ngày của Visit hợp lệ gần nhất trong phạm vi người xem.
- `My rating` = review của chính tài khoản cho Visit được chọn hoặc cách tổng hợp được ghi rõ.
- `Our rating` = thống kê từ review hợp lệ mà người xem có quyền, phải ghi số lượng nguồn và mức tổng hợp.
- Không sử dụng điểm thiếu như điểm 0, không lộ Visit riêng tư qua counter.

### Actions và quyền

Viewer chỉ xem phần được chia sẻ, không tự có quyền sửa. Owner/Editor theo ACL mới sửa được. Một Place Shared không làm public mọi Review, Visit, Plan, Diary liên quan.

## 6.5. FP-05 — Wishlist & Collections

### Phân biệt dữ liệu

- **Personal Wishlist:** lựa chọn/ý định theo tài khoản, riêng tư theo mặc định.
- **Shared Wishlist/Collection:** cùng tuyển chọn Place, yêu cầu quyền list và quyền Place.
- **Collection:** tập Place có thể không phải wishlist (ví dụ đã ghé, địa điểm dành cho sinh nhật).
- Place đã từng ghé vẫn có thể ở trong wishlist/collection muốn quay lại.

### Hành vi chi tiết

1. Create Collection: tên không rỗng, description/cover optional, Private mặc định.
2. Add Place: chọn từ các Place hợp lệ; nếu Place Private chưa được Shared với người xem list, phải xác nhận Share Existing Place hoặc giữ thành viên ẩn với người không có quyền.
3. Một Place xuất hiện nhiều Collection, không duplicate bản ghi.
4. Remove Membership: chỉ tháo khỏi Collection, không xóa Place, Visit, media hay rating.
5. Reorder: thứ tự tùy chỉnh trong Collection, không thay thứ tự các Collection khác.
6. Set Priority/Note trên wishlist entry: ghi nhận ý định, không sửa thông tin chung của Place.
7. Shared edits: hai người cùng thêm Place, giữ cả hai; cùng sửa thứ tự thì kiểm tra phiên bản/chống silent overwrite.
8. Delete/Archive Collection: giữ Place nguyên vẹn, phục hồi membership còn hợp lệ nếu Restore trong thời gian cho phép.
9. Export/list-sharing bên ngoài không phải yêu cầu công khai URL V1.0; chia sẻ chính thức trong hai tài khoản.

### Trạng thái trống

Collection rỗng vẫn tồn tại và có CTA `Add Places`. Nếu danh sách có Place bị thu hồi quyền, không hiện thông tin riêng tư; có thể hiển thị số phần tử có quyền thực sự hoặc placeholder trung tính, không tiết lộ title/thumbnails.

## 6.6. FP-06 — Places Map / Directions

**P0 đã chốt:** có thể lưu Map URL, địa chỉ và tọa độ khi biết. Từ Place Detail, List hoặc Plan, có `Open Directions` để mở bản đồ/dẫn đường bên ngoài khi có đủ dữ liệu hợp lệ.

| Trường hợp | Hành vi P0 |
|---|---|
| Có map URL hợp lệ | Mở URL của địa điểm người dùng đã lưu (sau kiểm tra an toàn) |
| Có tọa độ tin cậy nhưng thiếu map URL | Có thể tạo thao tác mở bản đồ bên ngoài theo thiết kế kỹ thuật, nhưng không tự tuyên bố quãng đường |
| Chỉ có địa chỉ text | Hiển thị/copy địa chỉ; hỗ trợ tìm kiếm ngoài bản đồ khi có khả năng |
| Không có địa chỉ, URL, tọa độ | Disable Directions và gợi ý bổ sung thông tin |
| Người dùng không chia sẻ vị trí hiện tại | Vẫn xem Place được; không yêu cầu quyền GPS |
| Place Private của tài khoản khác | Không tạo pin/directions/card leak |

**P1:** Bản đồ nhúng, pin list, map filters, khoảng cách và định tuyến. Không coi hình ảnh bản đồ tĩnh hoặc screenshot là đã hoàn thành P1. Không yêu cầu route metric trong P0.

---

# 7. Date Planning, Calendar và Trips

## 7.1. FP-07 — Date Planning (P0)

### Form

| Trường | Bắt buộc | Quy tắc |
|---|---|---|
| Plan Name | Có | Có thể gợi ý từ Place nhưng sửa được |
| Primary Place | Có khi Plan tạo từ M03 Place | Tham chiếu Place, không clone Place |
| Planned Date/Time | Chỉ với `Scheduled` | Có thể trống nếu `Idea` |
| Time Zone | Khi có lịch cụ thể | Theo M05/địa điểm, không phụ thuộc giờ máy |
| Participants | Có thông tin người tạo; người còn lại optional | Không tự coi xác nhận tham gia |
| Notes | Không | Ý định, dress code, lời nhắc cá nhân |
| Estimated Budget | Không | Ước lượng không phải chi phí thực tế |
| Related Collection | Không | Liên kết danh sách gốc |
| Related Trip | Không | M04 nếu nằm trong itinerary |
| Calendar Event Ref | Theo trạng thái và thao tác tạo lịch | M05 sở hữu thời gian event |
| Visibility | Có | Private mặc định |

### Vòng đời và chuyển trạng thái

| Từ | Sang | Điều kiện / tác động |
|---|---|---|
| New | Idea | Tạo dự định chưa có giờ |
| Idea | Scheduled | Chọn lịch hợp lệ, tạo/link Event M05 |
| Idea/Scheduled | Postponed | Ghi hoãn; không tạo Visit; phối hợp Event M05 nếu có |
| Postponed | Scheduled | Đặt ngày mới, đảm bảo một Event hiện hành liên kết |
| Idea/Scheduled/Postponed | Cancelled | Hủy theo xác nhận; không xóa Place/Wishlist/Visit |
| Scheduled | Completed | Người có quyền xác nhận buổi hẹn đã diễn ra; **Visit độc lập, không tự sinh** |
| Completed | New Visit (action separate) | Người dùng chọn ghi nhận Visit; chống tạo trùng theo idempotency |

Có thể sửa/hủy kế hoạch đã tạo theo quyền và chính sách, lịch sử chuyển trạng thái vẫn được giữ ở mức cần thiết. Không đánh dấu Completed chỉ vì ngày đã qua.

### Nguồn sự thật với M05

- M03 sở hữu `Plan status`, `primary Place`, `plan notes`, `estimated budget`.
- M05 sở hữu ngày giờ cụ thể của `Calendar Event`, lịch lặp nếu có, nhắc lịch và trạng thái lịch.
- Khi thay đổi giờ ở M05, FP-07 hiển thị ngày mới; khi dời từ FP-07, yêu cầu M05 cập nhật event liên quan, không tạo lịch thứ hai ngoài ý muốn.
- Nếu cập nhật M05 thất bại, FP-07 không được tuyên bố đã dời lịch thành công; có thông báo + retry hoặc trạng thái đồng bộ lỗi.
- Cancel/Complete Plan **không tự tạo Visit**, không mặc định xóa Calendar Event trừ quy tắc phối hợp được xác định trong thiết kế tích hợp.
- Nếu Plan nằm trong M04 Trip, link itinerary tồn tại ở M04; tránh song song hai nguồn tự sửa kế hoạch ngày giờ.

## 7.2. Hành vi khi Date Plan có nhiều điểm

P0 M03 có **một primary Place** mỗi Date Plan. Nếu hai người muốn nhiều địa điểm trong một ngày, có thể tạo nhiều Plan liên quan hoặc dùng M04 quản lý itinerary nhiều điểm. Không mở rộng Date Plan thành engine route optimization vì D06 chỉ cam kết external Directions trong V1.0.

## 7.3. Chức năng buổi hẹn từ Place / Collection / Random Picker

- Place Detail `Plan Date` → FP-07 với Place được điền sẵn.
- Collection chọn Place → Plan tương tự; giữ liên kết tới Collection nếu phù hợp.
- Random Picker chọn được Place → `Create Plan`; **kết quả bốc thăm không tự tạo Plan**.
- Place từ M04 Trip có thể được lên lịch ở M05, tham chiếu tới Place M03; không duplicate.

---

# 8. Visit History, đánh giá, món ăn và đồ uống

## 8.1. FP-08 — Visit History

- Hiển thị từng Visit riêng biệt, mặc định theo `visited_at` gần nhất, không theo ngày record được tạo.
- Lọc theo Place, ngày/năm, người tham gia đã xác nhận, category, có media, có review, linked trip/diary.
- Phân biệt **Distinct Places Visited** và **Total Visits**.
- Trong Place Detail hiển thị Visits của Place đó; ở M03 Home có Recent Visits trên toàn bộ Place hợp lệ.
- Visit Private không lộ ngày đi, ảnh, rating, tên người tham gia hoặc số đếm ngoài quyền.
- Có CTA Add Visit kể cả Place trước đó chưa có Plan.

## 8.2. FP-09 — Add / Edit Visit

### Luồng nhập

1. Chọn Place từ FP-04 hoặc chọn Place trong form Visit.
2. Chọn ngày thực tế đã ghé, giờ là optional; có thể ghi lại kỷ niệm cũ.
3. Chọn những tài khoản được ghi nhận tham gia; người khác được đề xuất chứ không tự được xác nhận.
4. Viết notes / activities / memory highlights; phù hợp **mọi loại địa điểm**, không chỉ ăn uống.
5. Chọn ảnh/video từ M02, nếu cần có nút upload dẫn tới M02; không tạo storage riêng M03.
6. Nếu Place có dịch vụ ăn uống: thêm món đã gọi, số lượng/giá tham khảo của lần đi nếu biết, món muốn thử lần sau.
7. Ghi chi phí qua luồng M07 khi cần; nếu chưa có khoản chi, không tự lấy giá menu ước lượng làm thực chi.
8. Chọn Private hoặc Shared có xác nhận; Save Visit.
9. Gợi ý `Write Diary`, `Review Visit`, `Add Photos`, `Mark Revisit`.

### Trường dữ liệu

| Trường | Quy tắc |
|---|---|
| Visit Place | Required, Place có quyền truy cập và đang hợp lệ |
| Date | Required (ngày thực tế), không suy luận theo ngày tạo |
| Time | Optional, ngày có thể đủ cho kỷ niệm |
| Participants | Tạo relation, theo status xác nhận |
| Notes | Optional; ghi được trải nghiệm không có món ăn |
| Activity summary | Optional; phù hợp rạp, bảo tàng, công viên, workshop |
| Media Links | Optional; asset có quyền từ M02 |
| Ordered Items | Optional; không có nghĩa mọi Place cần menu |
| Actual Expenses | Optional; nhập ở Visit UI, lưu tại M07 và liên kết |
| Related Plan / Trip / Diary | Optional, ref, có quyền |
| Visibility | Private mặc định, có thể chia sẻ |

### Chống ghi Visit trùng ngoài ý muốn

- Hai người có thể độc lập ghi lại cùng trải nghiệm. Khi nhập Place, ngày và người tham gia, có thể gợi ý Visit hiện có **mà người tạo có quyền xem**.
- Không ép gộp các Visit cùng ngày nếu đó thực sự là hai lần ghé riêng (sáng/tối).
- Khi tạo Visit từ một Plan đã có Visit liên quan, ưu tiên mở Visit hiện có/gợi ý liên kết; không clone do double-click.
- Một Visit có thể có hai Review cá nhân, không cần mỗi người tạo Visit riêng.

## 8.3. FP-10 — Visit Detail

Hiển thị: Place, ngày giờ thực tế, người tham gia và trạng thái xác nhận, ảnh/video, hoạt động hoặc món đã thử, notes, danh sách Review được phép xem, khoản chi theo quyền M07, linked Plan/Trip/Diary, quick action `Add Review`, `Edit Visit`, `Write Diary`, `Add to Photobook` thông qua M01/M02.

Khi mở ảnh, dùng Media Viewer M02, không tạo file riêng. Khi mở Diary hoặc Trip, kiểm tra quyền đích. Nếu M02 asset đã bị thu hồi/quản lý Trash, hiển thị placeholder phù hợp, không vượt quyền để phục hồi thumbnail.

## 8.4. FP-11 — Ratings & Reviews

### Thang điểm và ràng buộc

- `overall` là điểm 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5 hoặc 5; **không phải 0**.
- Overall **bắt buộc khi Submit Review**, không bắt buộc lúc người dùng chỉ lưu Visit.
- Tiêu chí phụ: Food/Drinks, Service, Atmosphere, Value tùy loại Place; có thể mở rộng thành Experience/Activities cho địa điểm không phải quán ăn qua cấu hình category. **Không bắt đánh giá thức ăn ở công viên/rạp phim.**
- Notes có thể bổ sung. `Would Revisit?` là cảm nhận của Visit, phân biệt với Revisit Preference hiện hành theo user/Place.
- Một Review hiện hành trên cặp `(Visit, Reviewer)`, có lịch sử sửa; không được viết thay người còn lại.
- Không đánh giá = `unrated`, không phải 0; không làm mất Visit.

### Tổng hợp điểm

1. Visit rating = trung bình số học của những overall rating **Submitted** và **được phép hiển thị** trong Visit, ghi số reviewer.
2. Place rating nếu có = mức tổng hợp của các **review hợp lệ trong tập Visit được phép xem**, ghi rõ phạm vi (các lần ghé và số đánh giá). Không ngầm coi đây là rating công khai ngoài Our Space.
3. Tiêu chí phụ không được tự cho 0 khi bỏ trống; nếu tổng hợp phải tính riêng mẫu đã được chấm.
4. Không cộng review Private của người khác vào số liệu hiển thị để tránh suy luận nội dung bị khóa.
5. Một người được quyền thay đổi review của chính mình; việc sửa review của người khác là ngoại lệ cần đặc quyền rõ ràng (mặc định **không**).

### Khả năng xem hai góc nhìn

Place/Visit Detail hiển thị nhãn "A đánh giá ...", "B đánh giá ..." nếu có quyền; không ép thành một điểm chung duy nhất. Ghi chú cá nhân và điểm cảm xúc vẫn tồn tại kể cả điểm trung bình đã được hiển thị.

## 8.5. FP-12 — Dishes & Drinks (conditional module within M03)

### Nguyên tắc category-aware

- Có trên Place liên quan đến đồ ăn/đồ uống, hoặc khi người dùng chủ động bật tính năng món cho một địa điểm có phục vụ đồ ăn.
- Với địa điểm thuần giải trí, hiển thị `Activities/Highlights/Visit Notes`, không bắt menu.
- Nếu cùng Place vừa vui chơi vừa có dịch vụ ăn uống, có thể sử dụng cả hai nhóm thông tin.

### Hành vi

| Action | Yêu cầu |
|---|---|
| Add Dish | Tên món, type, mô tả/ảnh/giá tham khảo optional |
| Add to Want-to-Try | Gắn ý định theo user/list, không coi là đã thử |
| Add to Visit | Tạo Visit Item, có thể chọn dish có sẵn hoặc nhập nhanh tên món |
| Edit Visit Item | Điều chỉnh số lượng, tên snapshot/giá quan sát không sửa lịch sử lần khác |
| Rate Dish | Review món do chính tài khoản từng thử, gắn lần thử nếu có |
| Favorite Dish | Có thể đánh dấu món thích mà không tự Favorite toàn Place |
| Remove Dish | Kiểm tra Visit Items đang tham chiếu; giữ snapshot lịch sử |

**Giá tham khảo trên Dish** khác **giá đã trả của Visit Item** và khác **Actual Expense** ở M07. Không tổng hợp tất cả các trường này thành chi tiêu thực tế để tránh double-count.

## 8.6. Tích hợp chi phí D16 ngay trong Visit

- Người dùng nhìn thấy ô `Record Expense` ngay khi lập Visit hoặc xem Visit Detail.
- Thao tác đó tạo/chọn/cập nhật một Expense thuộc M07; M03 giữ `expense_ref`, hiển thị số tiền theo quyền M07.
- Dữ liệu dự toán Plan không tự trở thành khoản thực chi; nhiều mục chi có thể thuộc cùng Visit nếu M07 hỗ trợ.
- Khi xóa Visit, Expense **không bị xóa dây chuyền**; liên kết được xử lý hoặc hiển thị ghi chú nguồn đã mất.
- Khi xóa Expense ở M07, Visit không được hiển thị số tiền cũ như khoản đã xác nhận còn tồn tại.
- Không lưu song song hai bản ghi `actual_spent` có quyền sửa độc lập ở M03 và M07.

---

# 9. Favorites, Revisit, tìm kiếm, Random Picker và Insights

## 9.1. FP-13 — Favorites & Revisit

- Favorite là trạng thái theo `(user, place)`, không phải điểm rating của Visit.
- Revisit Preference cũng theo `(user, place)` nhưng độc lập Favorite; một người có thể yêu thích nhưng chưa muốn quay lại, hoặc ngược lại.
- Bộ lọc `Both of Us Love It` chỉ xét dữ liệu đã được hai người đánh dấu và người xem được phép biết; không suy đoán từ tổng review.
- Toggle của A không đổi toggle của B; bỏ Favorite/Revisit không xóa Visit, Wishlists hoặc Plan.
- Địa điểm đã từng ghé và đã Favorite vẫn được phép thêm vào kế hoạch mới.

## 9.2. FP-14 — Search & Filters

| Bộ lọc | Quy tắc |
|---|---|
| Text | Name, notes/tags trong phạm vi xem; tìm không lộ hidden metadata |
| Category | Bất kỳ nhóm địa điểm, hỗ trợ Other |
| Area / City | Từ dữ liệu địa chỉ/khu vực đã nhập; không tự gắn GPS |
| Wishlist / Planned / Visited | Bộ lọc độc lập; Place có thể thuộc nhiều nhóm |
| Favorite / Revisit | Theo chính user hoặc cả hai khi có quyền |
| Rating | Theo điểm tổng hợp và phạm vi được xem, không phải public star |
| Tags / Collection | Nhiều điều kiện, quyền Collection riêng |
| Added By | User creator khi được phép hiện |
| Last Visited | Dựa trên Visit được phép, có thể trống |
| Price Range | Chỉ theo dữ liệu tham khảo thực có; thiếu giá không tự suy diễn |

### Logic kết hợp

- Kết hợp các bộ lọc để ra **giao tập** theo điều kiện được chọn; nếu group có semantics OR phải hiển thị rõ.
- Có `Clear Filters`, hiển thị count trong phạm vi quyền, không cộng số Private của người khác.
- Kết quả theo Place ID, không lặp Place chỉ vì nó có nhiều Visit hoặc nằm nhiều Collection.
- Mất quyền trong khi đang mở kết quả: lần đọc tiếp theo áp dụng quyền mới.

## 9.3. FP-15 — Random Picker (P0)

### Mục đích

Giải quyết tình huống "hôm nay ăn gì/đi đâu" bằng cách chọn ngẫu nhiên từ những địa điểm hợp lệ **đã lưu**, không tự tìm hoặc bịa ra một quán mới.

### Đầu vào

- Pool: wishlist cá nhân/chung, favorites, revisit, collection cụ thể, tất cả Places được phép.
- Category: mọi loại Place hoặc chọn chỉ ăn uống/cafe/giải trí/... theo D01.
- Additional filters: area, range giá nếu có, visited/unvisited, tags, người đề xuất.
- Optional excludes: bỏ qua Place đã Archived/Trashed hoặc bị thu hồi quyền; với Place không có dữ liệu đủ cho điều kiện bộ lọc thì loại theo điều kiện đó một cách minh bạch.

### Luồng

1. Chọn pool và bộ lọc.
2. Xem số lượng ứng viên hợp lệ; nếu bằng 0 hiển thị `No Matching Places`, cho đổi filter.
3. Nhấn `Pick For Us`.
4. Hệ thống chọn **một Place trong chính tập ứng viên**; không cần AI.
5. Hiển thị tên/ảnh/category, thông tin và nút `Pick Again`, `View Place`, `Create Plan`.
6. `Create Plan` cần thao tác xác nhận; không tự tạo lịch/Visit.

**Không đưa rating, giờ mở cửa, giá hiện tại hoặc khoảng cách vào kết quả như sự thật khi không có dữ liệu đáng tin.** V1.0 không yêu cầu random weighted by preferences hoặc animation vòng quay (P1).

## 9.4. FP-16 — Insights & Settings

### Các chỉ số P0

| Metric | Công thức nghiệp vụ khái quát | Lưu ý privacy |
|---|---|---|
| Places Saved | Số Place duy nhất mà người xem có quyền truy cập trong phạm vi chọn | Không cộng Place riêng tư khác |
| Distinct Places Visited | Số Place duy nhất có ≥1 Visit hợp lệ/được phép | Một Place ghé 5 lần vẫn là 1 |
| Total Visits | Số Visit hợp lệ/được phép | Có thể nhiều hơn số Place |
| Wishlist Entries | Số ý định/danh sách theo scope đã chọn | Một Place ở hai list có thể cần metric khác |
| Favorite Places | Số Place được user đánh dấu Favorite | Không tự đếm của người kia |
| Revisited Places | Số Place có ≥2 Visit hợp lệ trong phạm vi được xem | Không đếm double duplicate Visit |
| Most Visited | Xếp Place theo số Visit hợp lệ | Không lộ Visit riêng tư qua rank |
| Category Mix | Nhóm Place/Visit theo category đã ghi nhận | Multiple category cần quy tắc không double count tổng |
| Monthly Visits | Đếm Visit theo tháng của ngày thực tế | Không theo created_at |
| Spending | Tổng hợp dữ liệu được cấp quyền từ M07 | Không cộng trùng budget, dish price, expense |

### Settings phạm vi M03

Tùy chọn thứ tự hiển thị, bộ lọc mặc định, category/tags ưu tiên, đơn vị tiền tệ **từ M10/M07**, layout list/grid. Không tạo hệ thống xác thực, cấu hình bảo mật hoặc đơn vị tiền độc lập M10.

---

# 10. Bố cục chi tiết desktop/mobile và trạng thái UI

## 10.1. Nguyên tắc hai thiết bị ngang nhau

- **Mobile:** có khả năng tạo Place từ đường link/nhập tay; thêm vào Wishlist; lập Plan; thêm Visit, ảnh, Review/món; tìm; chọn ngẫu nhiên; thay quyền theo phân hệ; xem history và trash.
- **Desktop:** cùng chức năng trên, tối ưu thao tác nhiều nội dung, xem bảng, grid, filters và chi tiết song song.
- Form không chỉ cho xem trên màn hình nhỏ; tất cả trường P0 có cách nhập khả dụng bằng cảm ứng.
- Tương tác không dựa hoàn toàn vào hover; nút, toggle, tooltip, modal dùng được bằng touch và keyboard.

## 10.2. Bố cục theo màn hình

| Screen group | Desktop | Mobile |
|---|---|---|
| FP-01/02 | Sidebar, grid 2–4 cột tùy chiều rộng | Card 1 cột hoặc grid thích ứng, thanh quick action |
| FP-03 | Form nhóm field và preview thumbnail | Form từng section, keyboard phù hợp loại input |
| FP-04 | Main content + side summary/tabs | Header + horizontal tabs/accordion, sticky CTA có kiểm soát |
| FP-05 | List/collection organizer, drag reorder tùy thiết kế | Menu move/up/down hoặc tương tác chạm thay thế drag |
| FP-07 | Plan detail + liên kết Calendar | Date/time picker mobile-friendly |
| FP-08/10 | Timeline + media + side notes | Card timeline, media carousel |
| FP-09 | Form đầy đủ theo nhóm | Wizard từng bước hoặc accordion, lưu draft |
| FP-11 | Rating panel theo tiêu chí | Score control lớn, nhãn rõ |
| FP-12 | Dish table/list | Từng dish card |
| FP-14 | Search với filters sidebar | Search + filter drawer/chips |
| FP-15 | Modal/panel picker | Picker toàn màn hình/stacked |
| FP-16 | KPI tiles & tables | KPI tiles cuộn dọc |

## 10.3. Các trạng thái UI bắt buộc

Mỗi màn hình có dữ liệu tải về cần xem xét: Loading, Loaded, Empty, No Search Results, Error with Retry, Forbidden, Archived/Trashed target, Pending Save, Saved, Conflict, Partial Integration Failure. Không lạm dụng thông báo "Saved" khi thao tác chưa được xác nhận thành công. Không hiển thị cached private thumbnail sau khi server đã từ chối quyền.

## 10.4. Accessibility và ngôn ngữ

- Tên nút rõ ràng: `Add to Wishlist` khác `Mark Visited` và `Plan a Date`.
- Không dùng chỉ màu sắc để phân biệt trạng thái; có nhãn/icon/text.
- Các field bắt buộc có nhãn, lỗi xuất hiện gần field và dễ hiểu.
- Review sao phải có biểu diễn số để người dùng biết 3.5/5, không chỉ hình ngôi sao mơ hồ.
- Các thao tác delete/permission thay đổi dùng confirmation rõ ràng, focus phù hợp.
- Hỗ trợ nhập tiếng Việt có dấu, địa chỉ tự do và tên Place đặc thù.

---
# 11. Quyền riêng tư, chia sẻ, cộng tác và xung đột

## 11.1. Quyền mặc định và đối tượng bảo vệ

**D02 đã chốt: Private by default.** Được áp dụng tới: Place, Collection, Date Plan, Visit, Review, media links được chủ động thêm, ghi chú riêng và các thông tin người tham gia nếu có quyền. Khi một đối tượng được tạo trong ngữ cảnh Shared, UI phải cho biết và được người tạo chấp nhận rõ trạng thái Shared, không ngầm định tất cả nội dung mới là chung.

**Các cấp quyền có thể khác nhau:**

1. **Place:** thông tin chung về địa điểm và quyền ai được mở/sửa Place.
2. **Collection/Wishlist:** ai được xem/tổ chức danh sách.
3. **Date Plan:** ai được thấy/người tham gia và ai có thể sửa kế hoạch.
4. **Visit:** ai có thể xem một lần đi, ảnh/ngày/notes/người tham gia.
5. **Review:** chủ thể đánh giá là tài khoản nào; quyền đọc riêng; quyền sửa của reviewer, không tự chuyển cho Editor của Place.
6. **Media:** quyền riêng tại M02; một Place Shared không cho xem ảnh M02 Private trái quyền.
7. **Diary/Calendar/Expenses:** quyền gốc tại M01/M05/M07, không suy từ việc Place đã được Shared.

## 11.2. Ma trận quyền nền tảng

| Hành động | Owner | Editor được cấp trên đối tượng | Viewer | Không có quyền |
|---|---|---|---|---|
| Xem Place | Có | Có | Có | Không |
| Sửa thông tin Place | Có | Có | Không | Không |
| Thêm Place vào Collection có quyền sửa | Có | Có | Không | Không |
| Tạo Visit gắn Place được xem | Có, theo quyền Visit/create | Theo quyền create Visit | Không mặc định | Không |
| Chỉnh sửa Visit | Owner Visit | Khi được cấp trên Visit | Không | Không |
| Xem Visit | Khi được phép | Khi được phép | Khi được phép | Không |
| Đánh giá cá nhân | Tài khoản đó, khi được phép review Visit | Tài khoản đó, khi được phép review Visit | Không mặc định | Không |
| Sửa Review người khác | Không mặc định | Không mặc định | Không | Không |
| Sửa Date Plan | Owner Plan | Editor Plan | Không | Không |
| Thay quyền đối tượng | Owner | Chỉ nếu ủy quyền riêng | Không | Không |
| Archive/Delete Place | Owner theo quy trình | Nếu được ủy quyền cụ thể | Không | Không |
| Xóa vĩnh viễn | Owner theo quy trình và quyền dữ liệu | Không mặc định | Không | Không |

**Giải thích:** quyền của Place không tự là quyền Create/Edit cho *mọi* Visit. UI có thể có nút `Add Visit` cho người có quyền tạo Visit hợp lệ, nhưng Visit mới được sở hữu và cấp quyền riêng. Viewer của Place không mặc định là Reviewer của bất kỳ Visit nào.

## 11.3. Các tình huống chia sẻ cụ thể

### Place Private → Shared Collection

- A sở hữu Place X Private, thêm vào Collection Shared cùng B.
- Phải chọn `Share Existing Place` với B hoặc giữ Place không thể xem đối với B cho đến khi chia sẻ.
- Không auto nâng quyền Place chỉ vì thao tác thêm Membership.
- Nếu tạo bản sao chia sẻ riêng của Place trong tương lai, phải mô tả nguồn và không coi Visit/Review/media gốc tự động chuyển sang bản sao. Trong P0 ưu tiên chia sẻ cùng Place có ACL, không cần clone Place trừ nhu cầu đã được duyệt.

### Place Shared, Visit Private

- B mở Place Detail và được xem thông tin địa điểm.
- Visit Private của A không hiện trong list, count, last visited, review tổng hợp, ảnh, người tham gia hoặc tìm kiếm của B.
- Các Visit Shared khác vẫn hiện. M03 không được đoán hoặc hiển thị số Visit ẩn.

### Media Private trong Visit/Place Shared

- Chọn ảnh từ M02 bắt buộc đi qua quyền asset. Khi đưa ảnh Private vào Visit Shared, phải xác nhận cách chia sẻ theo hợp đồng M02.
- Nếu chỉ Place/Visit được Shared mà ảnh chưa chia sẻ, người kia không được xem thumb/full size của ảnh.
- Nếu người dùng muốn chia sẻ bản sao, tham chiếu asset copy được tạo hợp lệ tại M02; M03 không tạo bản blob ảnh riêng.

### Review riêng của B

- Owner Place A không mặc nhiên được sửa bài review thuộc B.
- Quyền đọc một review phụ thuộc cả quyền Visit và chính review khi có riêng tư; không đưa review vượt quyền vào trung bình.
- Khi B thu hồi quyền một review riêng, summary dành cho A phải cập nhật lại để không tiết lộ nội dung.

## 11.4. Phân quyền khi mở qua URL, filter hoặc module khác

- Kiểm tra quyền phía nguồn dữ liệu ở mỗi thao tác đọc, sửa, chia sẻ, export, delete; ẩn action UI chỉ là trải nghiệm.
- ID/đường dẫn tự đoán không phải quyền truy cập.
- M03 Search, Random Picker, Insights, Calendar linking, M01 Diary linking, M02 Asset Picker, M04 Trip không được lộ đối tượng bị khóa qua title, thumbnail, count, preview, activity log hoặc metadata.
- Khi quyền thay đổi trong phiên đang mở, thao tác sau phải áp dụng quyền mới. Các bản sao/export đã tải trước khi thu hồi không thể được bảo đảm thu hồi vật lý.

## 11.5. Cộng tác và xung đột (D17)

M03 **không** yêu cầu con trỏ realtime hay chỉnh một field đồng thời từng ký tự như M01. Tuy nhiên, phải cho hai tài khoản cùng làm việc trong phạm vi quyền mà không ghi đè dữ liệu âm thầm.

| Trường hợp | Hành vi yêu cầu |
|---|---|
| A thêm Place X, B thêm Place Y | Giữ cả hai |
| A và B thêm hai Visit cho cùng Place | Giữ cả hai nếu là hai lần đi, cảnh báo nếu có vẻ cùng Visit |
| A và B cùng thêm Place vào Shared Collection | Giữ Membership hợp lệ, không nhân đôi cùng quan hệ ngoài ý muốn |
| A sửa tên, B sửa mô tả của cùng Place | Có thể hợp nhất hai thuộc tính độc lập nếu an toàn |
| A và B cùng sửa một trường địa chỉ | Không silently last-write-wins; phát hiện conflict, cho xem giá trị hiện tại và quyết định |
| A xóa Place, B đang thêm Visit | Kiểm tra tình trạng ở lúc commit; không tạo Visit mồ côi |
| A hạ quyền B từ Editor → Viewer | B không tiếp tục lưu thay đổi mới, kể cả tab cũ |
| A thay đổi Plan trong M03, B sửa Event ở M05 | M05 là nguồn sự thật ngày giờ; phải giải quyết revision conflict, không tạo event thứ hai |
| A sửa Review của A, B sửa Review của B | Hai review độc lập, không ảnh hưởng nhau |
| A/B cùng đổi thứ tự Shared Collection | Bảo toàn toàn bộ Membership, xác định xung đột thứ tự rõ ràng |

### UX xử lý xung đột

1. Thao tác save cho biết nếu dữ liệu đã thay đổi kể từ lúc người dùng mở bản sửa.
2. Giao diện trình bày `Giá trị đang lưu` và `Giá trị bạn vừa nhập` khi có xung đột cùng trường.
3. Có hành động `Review changes`, `Reload current`, `Apply mine where permitted` (theo thiết kế), không tự bỏ nội dung người dùng đang nhập.
4. Chỉ hiển thị `Saved` sau khi nguồn dữ liệu xác nhận thành công.
5. Nếu xung đột liên quan permission hoặc delete, người dùng không được ghi đè để vượt quyền.

**Ranh giới với M01:** đồng bộ realtime cấp canvas/text box của Photobook không được tự áp dụng như yêu cầu M03. M03 ưu tiên dữ liệu chính xác, không mất cập nhật, người dùng nhận trạng thái nhất quán.

---

# 12. Hợp đồng nghiệp vụ với M01, M02 và các mô-đun khác

## 12.1. M01 — Photobook & Diary

### Từ Visit → Diary

1. Từ Visit Detail người dùng chọn `Write Diary`.
2. M03 cung cấp (theo quyền) thông tin ngày Visit, Place reference, note nháp và media references đã được chọn.
3. M01 tạo Diary Entry hoặc mở editor với dữ liệu gợi ý; không tự publish nếu người dùng chưa xác nhận.
4. Diary có quyền và thời gian riêng; không tự kế thừa toàn bộ quyền của Visit/Place nếu chưa được người dùng đồng ý.
5. M03 chỉ lưu reference từ Visit tới Diary, không lưu nội dung gốc của Diary.

### Từ Visit/Place/Media → Photobook

- M01 có thể chèn tên Place/ngày Visit hoặc ảnh từ M02 theo quyền truy cập và cơ chế copy/snapshot/asset reference của M01/M02.
- Photobook đã Published ổn định theo phiên bản của M01; sửa tên Place hoặc rating M03 **không âm thầm rewrite** ấn bản đã xuất bản.
- Asset media được chia sẻ qua M02, không upload lại vào M03.
- Xóa Place/Visit không cascade xóa Diary hoặc Photobook.

## 12.2. M02 — Media Library (phụ thuộc cứng P0)

- M02 là owner của asset, original, variant, viewer, trash của file, quyền media.
- M03 chỉ tạo `Place Media Link` / `Visit Media Link` có role `cover`, `gallery`, `visit evidence`, `dish photo`... tùy use case.
- Asset Picker chỉ cho chọn media mà tài khoản được sử dụng theo chính sách M02.
- Một asset có thể có nhiều media links M03 và ở nơi khác; M03 xóa link không xóa asset.
- M02 đổi variant/thu hồi quyền/xóa mềm file thì M03 phản ánh trạng thái hợp lệ, không đọc lén file gốc.
- Nếu ảnh Private được chọn vào Visit Shared, phải xác nhận quyền/copy theo cách mà M02 quy định.
- Thống kê media của M03 không được đồng nhất với storage count, không tạo thumbnail file riêng vượt cơ chế của M02.

## 12.3. M04 — Travel & Trips

- Trip ở M04 có nhiều stops/địa điểm, mỗi stop **tham chiếu Place ID M03** (không clone Place).
- Một Place có thể thuộc nhiều Trip/itinerary; M04 sở hữu order, arrival times, trip-specific notes.
- Xóa Place cần đánh giá tác động các Trip đang dùng; không xóa Travel itinerary dây chuyền.
- Visit thực tế có thể liên kết với Trip Stop sau chuyến đi.
- Các địa điểm thuộc mọi loại vui chơi của D01 đều dùng được trong itinerary, không chỉ quán ăn.
- Nếu địa điểm Trip chưa có trong M03, có thể tạo Place mới qua quy trình M03 với quyền riêng hợp lệ.

## 12.4. M05 — Couple Calendar (phụ thuộc cứng cho scheduled plans)

- M03 `Date Plan` có thể tồn tại không có giờ ở trạng thái Idea.
- Khi scheduled, M05 tạo/liên kết Calendar Event, là nguồn về giờ, ngày, recurrence/reminder và event status.
- Đổi giờ ở M03 là một action cập nhật sự kiện M05; response lỗi phải được thể hiện rõ.
- Event bị hủy/dời ở M05 phải phản ánh thông tin liên kết ở M03; trạng thái Plan cần được xác định không ngầm suy đoán đã đi.
- Không để một Date Plan tạo hai Calendar Event active chỉ vì retry/double click.

## 12.5. M06 — Bucket List & Goals

- Goal (ví dụ "Thử 30 quán cafe") thuộc M06 và có thể tham chiếu danh sách Place, category, Visit M03.
- Tính tiến độ từ Visit hợp lệ/theo quyền và điều kiện Goal do M06 xác định; M03 không tự định nghĩa Goal hay hoàn thành thay M06.
- Place/Visit bị xóa/khôi phục sẽ được đánh giá lại tiến độ Goal, không tự xóa Goal.

## 12.6. M07 — Budget & Savings (D16)

- M03 UX có thể nhập khoản chi trong Add/Edit Visit.
- M07 sở hữu Expense ID, amount, currency, payer, category, split, timestamp nếu có.
- M03 lưu tham chiếu (`expense_ref` hoặc equivalent contract), không có bản actual money độc lập có thể sửa khác M07.
- Chi phí ước lượng của Place/Dish/Plan **không** phải Expense thực tế.
- Insights tổng chi phí đọc những Expenses M07 cho phép đọc, loại trừ khoản hoàn/hủy theo quy tắc M07.
- Nếu M07 update/delete expense, UI M03 phản ánh dữ liệu mới; xóa Visit không âm thầm xóa financial records.

## 12.7. M08 — Special Moments

- Có thể tạo milestone dựa trên Visit đáng nhớ (ví dụ "Lần đầu đến nơi này").
- M08 sở hữu nội dung kỷ niệm và ngày mở; M03 chỉ liên kết Place/Visit/ảnh với quyền phù hợp.
- Không suy đoán kỷ niệm riêng là chia sẻ chỉ vì Place Shared.

## 12.8. M09 — Couple Interaction

- Bình luận/emoji/interaction trên Place, Plan hoặc Visit nếu đủ quyền đối tượng.
- M09 sở hữu dữ liệu bình luận. Xóa/thu hồi quyền đối tượng phải khiến bình luận riêng không truy cập được qua direct link.
- Không được coi câu trả lời/emoji là Review rating chính thức.

## 12.9. M10 — Settings và shared foundation

- Tài khoản, đăng nhập, quyền trong không gian chung, định dạng ngày, locale, currency preference, thông báo chung sử dụng hạ tầng đã được xác định cho dự án.
- M03 không xây hệ thống auth riêng, không tự ép mọi Place thành Shared khi hai người cùng dùng app.

## 12.10. Our Timeline

- Timeline có thể tổng hợp Visit/Diary/Milestone theo ngày thực tế và quyền.
- `Place created at` không mặc định là một kỷ niệm đã ghé.
- Một Visit có thể xuất hiện cùng ảnh/Diary liên quan nhưng hệ thống tổng hợp tránh hiển thị ba sự kiện trùng nhau nếu là cùng câu chuyện; quy tắc trình bày timeline là trách nhiệm lớp tổng hợp.

## 12.11. Nguyên tắc hợp đồng tích hợp

1. **Ownership rõ ràng:** thao tác cập nhật dữ liệu nguồn phải đi qua mô-đun sở hữu.
2. **Reference by stable ID:** không tham chiếu bằng tên quán, ngày hoặc URL tự tạo.
3. **Permission at source:** có quyền mở Place không đồng nghĩa có quyền mở ảnh/Diary/Expense.
4. **Idempotency:** tạo Plan/Event hoặc Visit từ action có thể retry mà không sinh bản trùng.
5. **Graceful missing references:** nếu đích bị xóa/ẩn, hiển thị placeholder hoặc unlink có kiểm soát; không phá dữ liệu gốc.
6. **No duplicated storage:** media tại M02, actual spending tại M07, event tại M05, diary tại M01.
7. **Traceability:** ghi nguồn tạo từ Place/Plan/Visit nếu cần để khôi phục, kiểm thử và chẩn đoán.
8. **Integration failure is visible:** không báo "Đã lưu lịch/chi phí" khi M05/M07 chưa xác nhận.

---

# 13. Trash, Archive, Restore, Export và an toàn dữ liệu

## 13.1. Phân biệt Remove, Archive, Delete

| Hành động | Thay đổi | Không được làm |
|---|---|---|
| Remove from Collection | Xóa quan hệ membership | Không xóa Place, Visit, Media |
| Remove from Wishlist | Xóa entry ý định | Không đổi Visit/Favorite hoặc xóa Place |
| Unfavorite | Xóa flag theo user | Không đổi rating người khác |
| Mark Not Revisit | Xóa flag Revisit | Không xóa kế hoạch cũ |
| Archive Place | Ẩn Place khỏi danh sách hoạt động theo mặc định | Không xóa Visit/Diary/Trip |
| Trash Visit | Xóa mềm Visit | Không xóa Place/Media/Diary/Expense |
| Trash Place | Xóa mềm Place sau cảnh báo | Không cascade delete mô-đun khác |
| Trash Collection | Xóa mềm danh sách | Không xóa Place gốc |
| Trash Review | Xóa/ẩn review theo quyền | Không xóa Visit |

## 13.2. Retention và Restore

- D18: thùng rác **30 ngày** tính từ khi đối tượng được đưa vào Trash, theo chính sách chung và timezone hiển thị rõ.
- Trong thời hạn đó, Owner có quyền có thể Restore nếu không vi phạm quyền/trạng thái mới.
- Restore phải giữ ID và liên kết có thể phục hồi, không tạo Place/Visit hoàn toàn mới gây duplication; báo những liên kết không còn tồn tại hoặc không còn quyền.
- Các đối tượng đang Trashed không xuất hiện trong Search, Random, Insights, lựa chọn Plan mới, trừ màn Trash và các context phù hợp.
- Hết hạn không đồng nghĩa tự xóa vật lý ngay khi còn phụ thuộc dữ liệu hoặc chính sách bảo tồn/sao lưu phải xử lý; cần job/quy trình dọn dẹp có kiểm tra dependency.
- Xóa có chủ đích để xóa dữ liệu cá nhân phải được hỗ trợ qua quy trình xác nhận/giải quyết liên kết, không dùng lý do "đang tham chiếu" để giữ mãi dữ liệu mà không giải thích.

## 13.3. Tác động trước xóa Place/Visit

Trước khi xóa, hiển thị tóm tắt các liên kết mà người thao tác có quyền biết: số Visit/Plan/Collection/Trip/Diary/Media links... theo phạm vi có quyền. Hệ thống kiểm tra đầy đủ quan hệ ở phía dữ liệu **mà không lộ tên nội dung riêng tư của tài khoản khác**. Cho người dùng biết hậu quả và chọn thao tác phù hợp; không thực hiện cascade sang M01/M02/M04/M05/M07.

Ví dụ Place X đang có 3 Visit (trong đó một private khác), một Trip và một Diary. A chỉ thấy các liên kết được phép xem, nhưng thao tác xóa vẫn được kiểm tra đầy đủ để không phá dữ liệu mà A không có quyền biết.

## 13.4. Khôi phục kịch bản phức tạp

- Restore Place có Visit đang Active nhưng linked Place trước đó ở Trash: kiểm tra định danh và restore visibility hợp lệ.
- Restore Visit có media M02 đã xóa vĩnh viễn: giữ Visit và ghi chú placeholder, không tự dựng ảnh giả.
- Restore Collection có vài Place đã xóa: khôi phục membership còn hợp lệ hoặc báo mất liên kết.
- Restore Place có Calendar Event đã hủy: không tự mở lại event; người dùng phải lên lịch lại.
- Restore Review của người dùng đã bị thu hồi quyền: không tự cấp quyền cũ bất hợp lệ.

## 13.5. Export và sao lưu chung

- M03 cần hỗ trợ **xuất dữ liệu nghiệp vụ do tài khoản sở hữu/được quyền xuất** qua cơ chế portability chung của Our Space: Place, Collection/Membership, Wishlist, Plan, Visit, Review, Dish/Visit Item, Favorite/Revisit, tags, references trong định dạng có thể đọc bằng công cụ khác.
- Không xuất media blob M03: ảnh/video được cung cấp qua cơ chế export M02 theo quyền hiện hành; gói dữ liệu có thể đính kèm reference hoặc file khi pipeline chung hỗ trợ.
- Không đưa private reviews/visits người khác vào export hoặc báo cáo tổng hợp của người không có quyền.
- Backup chung phải bao gồm quan hệ liên kết/ACL/trạng thái trash và được thử restore. Có backup record mà chưa test khả năng phục hồi không được coi là đủ.
- Không cần tự phát triển hệ thống backup riêng cho M03 nếu shared foundation đảm nhận, nhưng M03 phải cung cấp dữ liệu đủ để khôi phục tính nhất quán.

---

# 14. Use Cases và luồng thao tác từ đầu đến cuối

> Các Use Case UC-M03-01…UC-M03-18 dùng cùng mô hình: **Actor / Tiền điều kiện / Luồng chính / Ngoại lệ / Hậu điều kiện**. Người dùng có thể thực hiện bằng mobile hoặc desktop. Tất cả truy cập đều phải qua kiểm tra quyền và tính hợp lệ trạng thái của đối tượng.

## UC-M03-01 — Tạo Place bằng cách nhập tay

- **Actor:** A; **Pre:** đăng nhập, có quyền create Place.
- **Main:** mở FP-03 → nhập Name/Category → thêm địa chỉ/map link/notes/cover nếu muốn → Private mặc định → hệ thống kiểm tra khả năng trùng → Save → mở Place Detail.
- **Alternate:** Name rỗng thì báo lỗi; Place tương tự thì đề xuất mở bản ghi cũ hoặc tiếp tục có xác nhận; lỗi save thì giữ bản nháp trong phạm vi khả năng.
- **Post:** một Place Active có stable ID/owner, không mặc định sinh Wishlist/Visit/Plan ngoài hành động người dùng.

## UC-M03-02 — Dán link và lưu Place

- **Actor:** B; **Pre:** đăng nhập.
- **Main:** paste source/map URL → hệ thống kiểm tra link và thử lấy metadata hợp lệ nếu hỗ trợ → B kiểm tra/gỡ thông tin không đúng, nhập còn thiếu → Save.
- **Alternate:** link không đọc được thì cho nhập tay và vẫn giữ link nguồn; URL nguy hiểm thì từ chối URL, không chặn người dùng nhập Place bằng tay.
- **Post:** Place lưu thông tin đã xác nhận, không có giá/giờ mở cửa giả.

## UC-M03-03 — Chia sẻ một Place Private

- **Actor:** Owner A; **Pre:** Place X Private.
- **Main:** mở Sharing → chọn B và vai trò Viewer/Editor → xác nhận → B thấy Place X theo quyền.
- **Alternate:** chia sẻ không thành công thì vẫn Private; B không được xem các Visit/Review/Media riêng nếu không được cấp riêng.
- **Post:** ACL Place cập nhật, audit actor/time.

## UC-M03-04 — Tạo Shared Collection và thêm Place

- **Actor:** A; **Pre:** có Place X/Y hoặc tạo mới.
- **Main:** tạo Collection → chọn Shared, cấp quyền B → chọn Place X/Y → kiểm tra quyền khi thêm → xác nhận quyền đối với Place Private nếu cần → B xem được các Place đủ quyền.
- **Alternate:** không được phép share một asset/Place thì membership không làm lộ data; trùng membership không nhân đôi.
- **Post:** Collection và memberships hợp lệ, Place gốc không nhân bản.

## UC-M03-05 — Xóa Place khỏi Collection hoặc xóa Collection

- **Actor:** Editor Collection; **Pre:** Collection active, đủ quyền.
- **Main:** Remove X hoặc Delete Collection → xác nhận nếu xóa list → membership bị tháo/xóa mềm theo loại thao tác.
- **Alternate:** xóa bị tranh chấp/không còn quyền thì từ chối và thông báo.
- **Post:** Place X, Visit, Media giữ nguyên; Collection có thể Restore nếu đã Trash.

## UC-M03-06 — Lập kế hoạch đi chơi và tạo lịch M05

- **Actor:** A; **Pre:** Place X Active, có quyền dùng; M05 khả dụng.
- **Main:** Place Detail → Plan → đặt tên, ngày giờ, participants, notes → xác nhận → M03 tạo Date Plan, M05 tạo/link Event → thông báo thành công khi liên kết được xác nhận.
- **Alternate:** chưa biết ngày thì lưu Idea không tạo Event; M05 lỗi thì không tuyên bố Scheduled thành công, cho retry bảo toàn dữ liệu.
- **Post:** Plan hợp lệ, ngày giờ lịch thuộc M05, không có Visit tự tạo.

## UC-M03-07 — Hoãn hoặc hủy kế hoạch

- **Actor:** Editor Plan; **Pre:** Plan Idea/Scheduled/Postponed.
- **Main:** chọn Postpone/Cancel → xác nhận → nếu Event đã liên kết, phối hợp cập nhật M05 → phản ánh trạng thái Plan.
- **Alternate:** M05 lỗi thì hiển thị conflict/retry, không tạo Plan hoặc Event mới khi retry.
- **Post:** Place và Wishlist không bị xóa; Visit không tự sinh.

## UC-M03-08 — Ghi nhận một Visit sau khi đã đến

- **Actor:** A; **Pre:** Place Active, đã thực sự tới.
- **Main:** Add Visit → chọn ngày thực tế, participant, ghi chú hoạt động, ảnh M02, món nếu có → quyền Private/Shared → Save → mở Visit Detail.
- **Alternate:** nếu có Visit có vẻ trùng thì gợi ý liên kết/mở lại, không ép gộp; thiếu ngày thì báo lỗi; lỗi upload M02 hiển thị trạng thái riêng.
- **Post:** Visit mới độc lập, không tự thay đổi rating hoặc wishlist của người còn lại.

## UC-M03-09 — Hai người cùng đánh giá một Visit

- **Actor:** A & B; **Pre:** Visit Shared và cả hai có quyền review.
- **Main:** A chấm Overall 4.5, notes; B chấm Overall 4.0, notes; hệ thống lưu hai Review với reviewer tương ứng, Visit summary nếu được xem phản ánh hai điểm.
- **Alternate:** chỉ A đánh giá thì summary n=1, B unrated; B cố sửa Review A bị từ chối; rating 0 hoặc 5.3 bị từ chối.
- **Post:** hai review độc lập, một review hiện hành mỗi người/Visit.

## UC-M03-10 — Ghi món muốn thử và món đã gọi

- **Actor:** Editor phù hợp; **Pre:** Place phục vụ món/đồ uống (hoặc user bật dish features).
- **Main:** tạo Dish "Matcha Latte" → thêm Want-to-Try → mở Visit → ghi Visit Item đã gọi với snapshot giá nếu biết → thêm ghi chú/đánh giá món.
- **Alternate:** menu đổi giá thì Visit Item cũ không đổi; người dùng đang ở công viên không bị bắt chọn món.
- **Post:** Dish wishlist và lịch sử lần thử phân biệt rõ.

## UC-M03-11 — Favorite và Want to Revisit

- **Actor:** B; **Pre:** B có quyền xem Place.
- **Main:** B toggle Favorite và Revisit; A không bị tác động; B có thể tạo Plan tiếp theo.
- **Alternate:** bỏ flag không xóa Plan/Visit/review; B bị thu hồi quyền thì không tiếp tục xem Place qua Favorites.
- **Post:** preferences lưu theo tài khoản.

## UC-M03-12 — Tìm kiếm địa điểm có nhiều điều kiện

- **Actor:** A; **Pre:** có các Place được phép.
- **Main:** chọn category Cafe + area + Favorite + chưa từng ghé theo phạm vi được xem → hệ thống trả tập Place duy nhất hợp lệ.
- **Alternate:** không có kết quả thì Empty + Clear Filters; không lộ Place Private của B trong count/title.
- **Post:** chỉ thay đổi filter state, không sửa dữ liệu Place.

## UC-M03-13 — Random Picker

- **Actor:** A/B; **Pre:** có danh sách Place hợp lệ.
- **Main:** chọn pool Wishlist chung, category bất kỳ → hệ thống lọc theo quyền/active → chọn một Place ngẫu nhiên → View Place hoặc Create Plan.
- **Alternate:** danh sách trống thì giải thích, không tự đặt kết quả; picked Place mất quyền trước action tiếp theo thì chặn và yêu cầu chọn lại.
- **Post:** không tạo Plan/Visit nếu chưa xác nhận.

## UC-M03-14 — Tạo Diary từ Visit

- **Actor:** A; **Pre:** Visit và media phù hợp quyền.
- **Main:** Visit Detail → Write Diary → M01 nhận ngày/Place/ảnh được phép → A soạn và lưu Diary → Visit lưu link nếu hợp lệ.
- **Alternate:** ảnh Private chưa được phép dùng tại Diary Shared thì yêu cầu xác nhận theo M02/M01; lỗi M01 không tạo Diary giả.
- **Post:** Diary nguồn thuộc M01, Visit thuộc M03, tham chiếu có quyền.

## UC-M03-15 — Dùng Place trong Travel Trip

- **Actor:** B; **Pre:** có Trip M04 mà B được sửa.
- **Main:** mở M04, chọn Add Stop → search Place M03 → chọn Place → M04 lưu Trip Stop tham chiếu Place ID.
- **Alternate:** Place bị Trash/không đủ quyền thì không tạo stop hợp lệ; Trip vẫn có thể lưu các stop khác.
- **Post:** một Place dùng ở nhiều Trip, không clone record.

## UC-M03-16 — Ghi chi phí buổi hẹn từ Visit

- **Actor:** A; **Pre:** Visit có quyền, M07 khả dụng.
- **Main:** Visit Detail → Add Expense → nhập amount/payer/currency/notes theo quyền M07 → M07 xác nhận → M03 hiển thị expense link/summary được phép.
- **Alternate:** lỗi M07: Visit vẫn tồn tại, nhưng không báo Expense đã lưu; retry không nhân đôi khoản chi.
- **Post:** actual expense ở M07, estimated plan budget giữ riêng.

## UC-M03-17 — Xóa và khôi phục Place/Visit

- **Actor:** Owner; **Pre:** có đối tượng active.
- **Main:** Delete → review impact links → xác nhận → Trash 30 ngày → Restore trong thời hạn → kiểm tra liên kết có thể phục hồi.
- **Alternate:** không được phép thì từ chối; linked object đã xóa vĩnh viễn thì placeholder/cảnh báo, không tự tái tạo giả; không cascade sang M01/M02/M07.
- **Post:** đối tượng chính có trạng thái hợp lệ, audit delete/restore.

## UC-M03-18 — Hai người sửa cùng Place, tránh mất cập nhật

- **Actor:** A & B; **Pre:** cả hai có Editor Place; mở cùng phiên bản.
- **Main:** A sửa địa chỉ, B cũng sửa địa chỉ → A Save thành công → B Save bị báo dữ liệu đã thay đổi → B xem current vs draft, chọn xử lý hợp lệ.
- **Alternate:** A sửa tên và B sửa mô tả, hệ thống được phép hợp nhất thuộc tính độc lập khi an toàn; A thu hồi quyền của B thì B không thể force overwrite.
- **Post:** dữ liệu Place nhất quán, không có silent last-write-wins.

---
# 15. Quy tắc nghiệp vụ và các bất biến

> **Mã BR-M03-xx là normative**: mọi tính năng, test, kế hoạch triển khai phải viện dẫn những quy tắc phù hợp. Trường hợp khái niệm có vẻ xung đột giữa module, ưu tiên quyền sở hữu dữ liệu được ghi trong mục 12 và báo cáo thay vì tự đảo luật.

## 15.1. Place và phạm vi loại địa điểm

| ID | Business Rule |
|---|---|
| BR-M03-01 | Place V1.0 hỗ trợ mọi loại địa điểm vui chơi/trải nghiệm; category Other hợp lệ; không bắt field ẩm thực ở địa điểm khác. |
| BR-M03-02 | Một chi nhánh/địa điểm cụ thể là một Place riêng; Brand/Chain không phải định danh Place duy nhất. |
| BR-M03-03 | Name và Category/Other là dữ liệu tối thiểu để tạo; address, GPS, map URL là tùy chọn. |
| BR-M03-04 | Hệ thống không được tự tạo giờ mở cửa, giá mới nhất, tọa độ, đánh giá bên ngoài hoặc thời gian di chuyển nếu thiếu dữ liệu được kiểm chứng. |
| BR-M03-05 | Add Place hỗ trợ link + nhập tay; trích xuất link chỉ best-effort từ nguồn hợp lệ, người dùng duyệt thông tin. |
| BR-M03-06 | Phát hiện Place có thể trùng là cảnh báo, không tự gộp chi nhánh hoặc tiết lộ Place Private. |
| BR-M03-07 | Stable Place ID không đổi khi đổi tên/địa chỉ/cover/category; các liên kết tồn tại phải còn đúng. |
| BR-M03-08 | Một Place có nhiều Visit và nhiều Date Plan; không dùng một trường status duy nhất để thay thế tất cả quan hệ. |
| BR-M03-09 | Place Archive khác Trash; Archive chỉ ẩn trong ngữ cảnh hoạt động theo mặc định, giữ lịch sử hợp lệ. |
| BR-M03-10 | Địa điểm tạm thời theo sự kiện vẫn có Place làm địa điểm, còn ngày giờ/suất diễn thuộc Event/Visit khi phù hợp. |

## 15.2. Wishlist, Collections, Date Plans

| ID | Business Rule |
|---|---|
| BR-M03-11 | Một Place có thể nằm nhiều Collection mà không nhân bản Place. |
| BR-M03-12 | Remove Place khỏi Collection/Wishlist không xóa Place hoặc Visit. |
| BR-M03-13 | Wishlist có thể tồn tại cùng trạng thái đã ghé, Favorite và Revisit. |
| BR-M03-14 | Collection Shared không tự cấp quyền Place Private chưa được chủ sở hữu xác nhận. |
| BR-M03-15 | Personal Wishlist/Shared Collection có scope và ACL riêng; không tự cộng dữ liệu Private vào Shared UI. |
| BR-M03-16 | Date Plan Idea không cần ngày cụ thể; Scheduled phải có liên kết thời gian hợp lệ từ M05. |
| BR-M03-17 | Date Plan Completed không tự tạo Visit; chỉ người dùng xác nhận mới sinh Visit. |
| BR-M03-18 | Date Plan Cancelled/Postponed không xóa Place/Wishlist; chuyển trạng thái không tạo thêm sự kiện lịch trùng. |
| BR-M03-19 | M05 là nguồn thời gian/event/reminder; M03 là nguồn ý định/Place/status Plan; cập nhật phải nhất quán qua hợp đồng tích hợp. |
| BR-M03-20 | Ngẫu nhiên chọn Place không tự tạo Plan hoặc Visit; yêu cầu hành động xác nhận riêng. |

## 15.3. Visit, người tham gia và review

| ID | Business Rule |
|---|---|
| BR-M03-21 | Visit đại diện một lần đã tới thực tế, có ngày ghé riêng; có thể nhập hồi tố. |
| BR-M03-22 | Nhiều Visit tại một Place là hợp lệ kể cả cùng một ngày nếu thực tế khác nhau; không ép gộp. |
| BR-M03-23 | Ghi người kia tham gia không tương đương chính người đó xác nhận tham gia. |
| BR-M03-24 | Visit có thể không có Review, media hoặc món; vẫn hợp lệ khi có Place, ngày và quyền/owner đúng. |
| BR-M03-25 | Hai người đánh giá độc lập theo một Visit, không cần hai Visit cho một lần chung. |
| BR-M03-26 | Một người có tối đa một Review hiện hành mỗi Visit; ghi lịch sử sửa mà không xóa review người khác. |
| BR-M03-27 | Submitted Overall rating chỉ nhận 1–5 bước 0,5; không đánh giá là missing, **không phải 0**. |
| BR-M03-28 | Tiêu chí phụ chỉ áp dụng khi phù hợp; không bắt chấm món/đồ uống tại địa điểm khác loại. |
| BR-M03-29 | Tổng hợp rating chỉ từ review hợp lệ có quyền và ghi rõ cấp Visit/Place, số nguồn. |
| BR-M03-30 | Review tác giả B không được A sửa theo quyền Place thông thường; việc xem có thể giới hạn theo ACL. |

## 15.4. Món, Favorite, Preferences và thống kê

| ID | Business Rule |
|---|---|
| BR-M03-31 | Dish/Drink là tính năng theo category, không áp dụng bắt buộc cho mọi Place. |
| BR-M03-32 | Món muốn thử và món đã gọi là hai quan hệ khác; một Dish có thể xuất hiện trong nhiều Visit. |
| BR-M03-33 | Visit Item lưu dữ liệu theo lần (như tên/giá quan sát) để không bị ảnh hưởng khi menu hiện tại đổi. |
| BR-M03-34 | Favorite và Revisit Preference là hai đánh dấu độc lập theo từng tài khoản. |
| BR-M03-35 | Favorite/Revisit của một người không tự thay đổi đánh dấu của người kia, review, Visit hay Plan. |
| BR-M03-36 | Random Picker P0 chọn chỉ từ tập ứng viên hợp lệ sau filter/ACL; rỗng thì không tạo kết quả giả. |
| BR-M03-37 | Search/filters kết hợp đúng ngữ nghĩa và chỉ hiển thị Place duy nhất, không nhân lên vì nhiều Visit/Collection. |
| BR-M03-38 | Places Visited là Place ID duy nhất có Visit được phép; Total Visits là số lần ghé, không trộn hai khái niệm. |
| BR-M03-39 | Thống kê người xem không được suy ra dữ liệu riêng tư của người khác qua counter, rating, last visited hoặc top place. |
| BR-M03-40 | Tổng chi thực tế lấy từ M07, tránh cộng trùng estimated budget, giá món tham khảo và expense thật. |

## 15.5. Quyền, media, tích hợp và độ bền

| ID | Business Rule |
|---|---|
| BR-M03-41 | Private mặc định. Chia sẻ phải có hành động xác nhận, theo quyền của từng đối tượng. |
| BR-M03-42 | Quyền Place không tự là quyền xem Visit/Review/Plan/media/Diary/Expense liên quan. |
| BR-M03-43 | Permission được thực thi tại nguồn đọc/sửa/xóa/export, không chỉ ẩn nút giao diện. |
| BR-M03-44 | Ảnh/video M03 tham chiếu M02, không tạo file storage M03 riêng; chọn asset kiểm tra quyền. |
| BR-M03-45 | Thêm media Private vào nội dung Shared phải qua quy trình chia sẻ/copy của M02 có xác nhận. |
| BR-M03-46 | M04 dùng Place ID cho Trip Stop, M01 giữ Diary/Photobook, M05 giữ Event, M07 giữ Expense; không nhân bản nguồn dữ liệu. |
| BR-M03-47 | Hai người cùng cập nhật dữ liệu M03 không được âm thầm mất thay đổi; không bắt live cursor. |
| BR-M03-48 | Retry/double click các thao tác tạo/link quan trọng không được sinh trùng Plan/Event, Visit hoặc Expense ngoài ý muốn. |
| BR-M03-49 | Trạng thái Saved chỉ được hiển thị sau khi thao tác đã được xác nhận thành công. |
| BR-M03-50 | Search, thumbnail, maps, picker, timeline, insights và link trực tiếp phải đều tuân thủ quyền. |

## 15.6. Trash, Restore và thiết bị

| ID | Business Rule |
|---|---|
| BR-M03-51 | Trash giữ nội dung xóa mềm 30 ngày theo D18 và chính sách chung; bản ghi đã Trash không có trong các nguồn hành động active. |
| BR-M03-52 | Xóa Collection không xóa Place; xóa Visit không xóa Place; xóa Place không cascade xóa Media M02, Diary M01, Event M05, Trip M04 hoặc Expense M07. |
| BR-M03-53 | Xóa Place/Visit có phụ thuộc phải có cảnh báo và kiểm tra toàn bộ quan hệ ở phía dữ liệu, không lộ tên mục Private vượt quyền. |
| BR-M03-54 | Restore giữ định danh và các liên kết có thể phục hồi; liên kết không còn phải được báo rõ, không tái tạo giả. |
| BR-M03-55 | Người dùng có quyền phải hoàn thành tác vụ P0 trên cả mobile và desktop; không yêu cầu chuyển thiết bị để nhập Visit/Review/Place. |
| BR-M03-56 | Không mặc định bắt buộc bản đồ nhúng P1, AI P2 hoặc hệ thống đặt bàn/vé trong M03 V1.0. |
| BR-M03-57 | Chuyển quyền trong khi chỉnh sửa phải có hiệu lực đối với thao tác lưu kế tiếp; không force overwrite qua tab cũ. |
| BR-M03-58 | Các ngày giờ sự kiện phải phân biệt giờ lịch (M05), ngày Visit thực tế và ngày tạo record. |
| BR-M03-59 | Nội dung xuất/backup/restore phải tôn trọng quyền, bảo đảm tài nguyên liên kết/metadata không bị khôi phục sai chủ sở hữu. |
| BR-M03-60 | Khi phụ thuộc một mô-đun bị lỗi, M03 không được báo thành công thao tác liên kết chưa hoàn thành. |

---

# 16. Ngoại lệ, cạnh tranh dữ liệu và xử lý lỗi

> Quy ước: `EX-M03-xx` là trường hợp ngoại lệ phải được đưa vào kiểm thử hoặc mô tả xử lý. Mỗi phương án xử lý có thể cần thiết kế UI cụ thể sau này, nhưng **không được bỏ qua hành vi bảo vệ dữ liệu**.

| ID | Tình huống | Hành vi bắt buộc |
|---|---|---|
| EX-M03-01 | Tên Place rỗng hoặc toàn khoảng trắng | Báo lỗi tại Name, không tạo Place |
| EX-M03-02 | Thiếu tọa độ hoặc địa chỉ | Vẫn lưu Place khi Name/Category hợp lệ; directions không hiển thị sai |
| EX-M03-03 | URL Map/source sai cú pháp, nguy hiểm | Từ chối URL không hợp lệ; giữ khả năng nhập tay |
| EX-M03-04 | URL hợp lệ nhưng nguồn không thể trích xuất | Lưu link và cho nhập tay; không invent fields |
| EX-M03-05 | Metadata từ link sai/đã cũ | Yêu cầu người dùng rà soát trước Save; không tự ghi đè note của user |
| EX-M03-06 | Hai địa điểm cùng thương hiệu nhưng chi nhánh khác | Cho tạo hai Place riêng, không gộp sai |
| EX-M03-07 | Hai người lưu trùng cùng chi nhánh | Gợi ý duplicate trong phạm vi quyền; không auto merge hay leak private Place |
| EX-M03-08 | Place đổi tên | ID và Visit history giữ nguyên |
| EX-M03-09 | Place chuyển địa chỉ | Cảnh báo ảnh hưởng lịch sử; cập nhật có kiểm soát, không giả rằng mọi Visit ở địa chỉ mới |
| EX-M03-10 | Place đóng cửa | Cho ghi trạng thái/ghi chú nếu biết; không xóa lịch sử hoặc tự kết luận open-now |
| EX-M03-11 | Một Place nằm nhiều Collection | Thêm không nhân bản Place, xóa một membership không ảnh hưởng membership khác |
| EX-M03-12 | Xóa một Collection | Không xóa Place, media, Visit |
| EX-M03-13 | Shared Collection chứa Place Private | Không hiển thị Place Private cho người không có quyền; yêu cầu chia sẻ có chủ đích |
| EX-M03-14 | Place đã Visited vẫn ở Wishlist | Cho phép, không tự chuyển trạng thái/ẩn khỏi wishlist |
| EX-M03-15 | Date Plan Idea chưa có ngày | Lưu được Idea, không tạo Calendar Event lỗi |
| EX-M03-16 | Date Plan bị hoãn | Bảo tồn notes/Place, phối hợp M05 khi cần |
| EX-M03-17 | Date Plan bị hủy | Không tạo Visit, không xóa Place/Collection |
| EX-M03-18 | Đến ngày Plan nhưng không đi | Không auto Completed/Visited; chỉ gợi ý xác nhận nếu phù hợp |
| EX-M03-19 | Hai người đồng thời tạo Plan/Event | Chống tạo Event trùng do retry/double click; xử lý liên kết M05 |
| EX-M03-20 | M05 lỗi lúc Scheduled/Rescheduled | Hiển thị lỗi, không khẳng định đã đồng bộ lịch |
| EX-M03-21 | Hai Visit cùng Place và cùng ngày | Cho phép nếu thực tế là hai lần khác nhau; chống duplicate ngoài ý muốn |
| EX-M03-22 | Người A tự khai B đã tham gia | Lưu trạng thái Proposed, không ghi Confirmed thay B |
| EX-M03-23 | Visit không có ảnh/món/Review | Vẫn hợp lệ nếu đủ Place/date/owner |
| EX-M03-24 | Rạp phim/công viên không có menu | Không ép người dùng chọn Dish, dùng ghi chú hoạt động |
| EX-M03-25 | Một món thay giá | Giá trong Visit Item cũ không tự đổi |
| EX-M03-26 | Review Overall bỏ trống | Không Submit rating; Visit không bị lỗi |
| EX-M03-27 | Review Overall ngoài 1–5 hoặc không đúng bước 0,5 | Từ chối điểm sai, chỉ cách sửa |
| EX-M03-28 | Chỉ A đánh giá Visit | B unrated, không tính B là 0 |
| EX-M03-29 | A cố sửa Review B | Từ chối nếu không có đặc quyền/ủy quyền hợp lệ; mặc định không được |
| EX-M03-30 | Review Private nằm trong thống kê | Không tính/hiển thị khi không có quyền xem |
| EX-M03-31 | A/B chỉnh Place cùng trường khác giá trị | Phát hiện conflict, giữ nháp, không silent overwrite |
| EX-M03-32 | A/B thêm Visit khác nhau đồng thời | Giữ cả hai Visit khi hợp lệ, không last-write-wins trên collection |
| EX-M03-33 | A xóa Place lúc B thêm Visit | Không tạo Visit mồ côi, xử lý retry hoặc từ chối rõ |
| EX-M03-34 | B mất quyền trong phiên đang mở | Chặn lưu tiếp theo, không để UI cũ vượt quyền |
| EX-M03-35 | Random Picker không có Place hợp lệ | Empty state + cho đổi filter, không tạo quán giả |
| EX-M03-36 | Picker ra Place sau đó Place mất quyền | Chặn View/Plan không có quyền, gợi ý pick lại |
| EX-M03-37 | Map URL không mở được | Cung cấp địa chỉ text/copy hoặc chỉ báo link không hợp lệ |
| EX-M03-38 | Người dùng không cấp quyền vị trí | Vẫn dùng M03, không tính khoảng cách giả |
| EX-M03-39 | Một Place có năm Visits | Distinct Places=1, Total Visits=5 nếu đều hợp lệ/được xem |
| EX-M03-40 | M07 lưu Expense thất bại | Visit có thể lưu riêng, Expense chưa được báo thành công hoặc cộng vào tổng |
| EX-M03-41 | Xóa Visit có Expense M07 | Không cascade delete Expense, unlink/trace impact |
| EX-M03-42 | Xóa Place có Trip/Diary/Media links | Cảnh báo và bảo toàn dữ liệu nguồn của module khác |
| EX-M03-43 | Restore Place nhưng linked Media bị xóa vĩnh viễn | Giữ Place, placeholder, báo thiếu ảnh |
| EX-M03-44 | Restore Collection nhưng một vài Place không hợp lệ | Phục hồi phần hợp lệ, giải thích phần không thể phục hồi |
| EX-M03-45 | Tìm kiếm Place Private bằng URL/direct API | Bị từ chối, không tiết lộ tên/metadata/count |
| EX-M03-46 | Thay quyền Place trong lúc Plan đang mở | Kiểm tra quyền thao tác kế tiếp, không dùng quyền cũ |
| EX-M03-47 | Thiếu/mơ hồ timezone ngày Visit | Giữ ngày thực tế user chọn, không ép sai do UTC convert |
| EX-M03-48 | Place có category/tags khác ngôn ngữ | Cho nhập/hiển thị unicode tiếng Việt và tag tự do |
| EX-M03-49 | Tài khoản chưa thấy nội dung của người kia | Không biểu lộ metadata qua autocomplete/count/insights |
| EX-M03-50 | Tạo Place/Visit/Expense bị gửi lặp vì double click | Hạn chế tạo bản trùng không mong muốn, không hủy bản đã lưu hợp lệ |

---

# 17. Acceptance Criteria và ma trận kiểm thử

> Các tiêu chí `AC-M03-xx` phải chuyển được thành test case. Cách đọc: **Given** (điều kiện đầu vào) → **When** (thao tác) → **Then** (kết quả). Khi điều kiện đầu vào yêu cầu quyền, chạy tối thiểu cho Owner, Editor, Viewer và tài khoản không có quyền. Chạy luồng P0 trên desktop và mobile phù hợp.

## 17.1. Place Creation và Place Detail

| ID | Given / When | Then — kết quả nghiệm thu |
|---|---|---|
| AC-M03-01 | Đăng nhập, nhập Name + Category hợp lệ và Save | Place Active được lưu với Owner và Private mặc định |
| AC-M03-02 | Name trống và Save | Form báo lỗi, không tạo record |
| AC-M03-03 | Place không có tọa độ/địa chỉ nhưng dữ liệu tối thiểu hợp lệ | Tạo được Place, không có directions giả |
| AC-M03-04 | Tạo rạp phim/công viên/bảo tàng | Không yêu cầu menu/food rating, có thể dùng Visit/Plan như Place khác |
| AC-M03-05 | Tạo hai chi nhánh cùng thương hiệu | Hai Place ID riêng, không tự gộp |
| AC-M03-06 | Dán URL hỗ trợ import hợp lệ | Hệ thống gợi ý thông tin có thể duyệt, không tự thay note đã nhập |
| AC-M03-07 | Dán URL không parse được | Vẫn nhập tay/lưu source URL hợp lệ |
| AC-M03-08 | URL không an toàn/không hợp lệ | Không mở/trích xuất nguy hiểm, báo lỗi chính xác |
| AC-M03-09 | Tạo Place có vẻ trùng | Gợi ý trong phạm vi quyền, cho lựa chọn hợp lệ |
| AC-M03-10 | Sửa tên/category/cover của Place | Stable ID, Visits và links không bị mất |
| AC-M03-11 | Mở Place Detail | Thấy thông tin được phép, quick actions theo quyền |
| AC-M03-12 | Mở Place có link bản đồ hợp lệ | Có thể Open Directions bằng liên kết ngoài |
| AC-M03-13 | Mở Place thiếu map info | Không hiện pin/tuyến đường giả, có hướng dẫn nhập bổ sung |
| AC-M03-14 | Archive Place | Không còn trong active list mặc định, vẫn khôi phục/xem history theo quyền |

## 17.2. Wishlist & Collections

| ID | Given / When | Then — kết quả nghiệm thu |
|---|---|---|
| AC-M03-15 | Tạo Collection cá nhân | Collection Private được lưu |
| AC-M03-16 | Tạo Shared Collection và cấp quyền B | B mở/sửa theo role được cấp |
| AC-M03-17 | Thêm Place X vào hai Collection | Một Place ID gốc, hai membership |
| AC-M03-18 | Remove Place khỏi Collection A | Place vẫn ở B và All Places |
| AC-M03-19 | Xóa Collection chứa Place | Place/Visits/media gốc còn nguyên |
| AC-M03-20 | Place đã Visited thêm vào Wishlist | Hành động được phép, Visit không đổi |
| AC-M03-21 | Shared Collection chứa Place Private | B không nhìn thấy Place trước khi được chia sẻ hợp lệ |
| AC-M03-22 | Hai Editor cùng thêm hai Place vào Collection | Cả hai membership hợp lệ được giữ |
| AC-M03-23 | Đổi thứ tự Collection | Thứ tự cập nhật, không xóa member hoặc đổi thứ tự list khác |
| AC-M03-24 | Xem collection rỗng | Empty state hữu ích và nút Add Place |

## 17.3. Date Planning và Calendar

| ID | Given / When | Then — kết quả nghiệm thu |
|---|---|---|
| AC-M03-25 | Chọn Plan từ Place X, chưa có ngày | Có thể lưu trạng thái Idea không tạo Event sai |
| AC-M03-26 | Chọn ngày giờ Plan hợp lệ | Tạo/liên kết Event ở M05, Plan Scheduled nhất quán |
| AC-M03-27 | Dời lịch Plan từ M03 | M05 cập nhật thời gian, UI M03 hiển thị mới |
| AC-M03-28 | Dời lịch trực tiếp M05 | M03 hiển thị giờ mới từ Event nguồn |
| AC-M03-29 | M05 lỗi khi tạo/chỉnh lịch | Không báo Plan scheduled/rescheduled thành công sai |
| AC-M03-30 | Cancel Plan | Không tự sinh Visit, không xóa Place/Wishlist |
| AC-M03-31 | Postpone Plan | Giữ Place/notes/participants, có thể lên lịch lại |
| AC-M03-32 | Thời gian hẹn đã qua, chưa xác nhận đã đi | Không tự tạo Visit hoặc mặc định Completed |
| AC-M03-33 | Mark Plan Completed | Không tự tạo Visit, có CTA thêm Visit riêng |
| AC-M03-34 | Retry Create Event/link vì lỗi mạng | Không tạo nhiều active Event cho cùng ý định ngoài ý muốn |

## 17.4. Visits, Participants, Reviews, Dishes

| ID | Given / When | Then — kết quả nghiệm thu |
|---|---|---|
| AC-M03-35 | Tạo Visit có Place/ngày hợp lệ | Visit Active được lưu, không đòi ảnh/Review/món |
| AC-M03-36 | Tạo Visit cho cùng Place lần khác | Giữ nhiều Visit độc lập |
| AC-M03-37 | Có hai Visit tại cùng Place trong một ngày (khác lần) | Không tự gộp hai Visit hợp lệ |
| AC-M03-38 | Gắn B là participant từ tài khoản A | Trạng thái của B là Proposed, không auto Confirmed |
| AC-M03-39 | B tự xác nhận tham gia | Trạng thái participant cập nhật theo người xác nhận |
| AC-M03-40 | Gắn ảnh từ M02 trong Visit | Tái sử dụng asset, không upload riêng M03 |
| AC-M03-41 | Chọn asset M02 mà không đủ quyền | Không hiển thị/truy cập asset trái phép |
| AC-M03-42 | A Submit rating 4.5/5 | Review của A được lưu với reviewer A |
| AC-M03-43 | B Submit rating 4.0/5 cùng Visit | Review B riêng, không ghi đè A |
| AC-M03-44 | Submit rating 0 hoặc 5.3 hoặc 2.3 | Bị từ chối theo thang 1–5 bước 0,5 |
| AC-M03-45 | Chỉ A có Review | B unrated, trung bình Visit = rating A, n=1 |
| AC-M03-46 | A/B bỏ trống tiêu chí phụ | Review vẫn hợp lệ nếu Overall đủ |
| AC-M03-47 | Place loại Outdoor không có food | Không yêu cầu Dish, vẫn Add Visit/Review được |
| AC-M03-48 | Thêm Dish want-to-try | Chưa ghi nhận đã thử nếu chưa có Visit Item |
| AC-M03-49 | Thêm Dish vào hai Visit có giá khác | Mỗi Visit Item lưu snapshot giá riêng, không bị thay đổi khi giá tham khảo mới cập nhật |
| AC-M03-50 | Người A sửa Review của B qua URL trực tiếp | Hệ thống từ chối theo quyền |
| AC-M03-51 | Xóa Visit | Không xóa Place/ảnh/Diary/Expense |

## 17.5. Favorites, Search, Random, Insights

| ID | Given / When | Then — kết quả nghiệm thu |
|---|---|---|
| AC-M03-52 | A Favorite Place X | B không tự Favorite X |
| AC-M03-53 | A đánh dấu Revisit | Favorite/Review/Visit của A và B giữ nguyên |
| AC-M03-54 | Filter Both of Us Love It | Chỉ trả Place cả hai có dấu Favorite hợp lệ và được phép hiển thị |
| AC-M03-55 | Kết hợp Category + Area + Collection + Favorite | Kết quả đúng điều kiện lọc, không có Place duplicate |
| AC-M03-56 | Search Place Private của B từ A | Không có title/thumbnail/count/metadata lộ ra |
| AC-M03-57 | Random Picker có các Place hợp lệ | Kết quả thuộc đúng tập ứng viên được phép |
| AC-M03-58 | Random Picker pool rỗng | Hiển thị Empty + Clear/Change Filters, không fake result |
| AC-M03-59 | Pick xong bấm Create Plan | Yêu cầu xác nhận mới tạo Plan, chưa tạo Visit |
| AC-M03-60 | Một Place có 5 Visit hợp lệ | Distinct Places Visited=1, Total Visits=5 |
| AC-M03-61 | Có Review Private của B không được A xem | Rating/Insight A không tính/tiết lộ Review đó |
| AC-M03-62 | Tạo Visit cũ từ năm trước hôm nay | Monthly Visits thống kê theo ngày Visit thực tế, không theo created_at |
| AC-M03-63 | Tổng hợp Expenses Visit | M07 là nguồn số liệu, không cộng trùng dự toán/gía món |

## 17.6. Permissions, Integrations, Recovery, Cross-device

| ID | Given / When | Then — kết quả nghiệm thu |
|---|---|---|
| AC-M03-64 | Place Shared, Visit Private | Viewer Place không thấy Visit Private, ảnh, notes hoặc count riêng |
| AC-M03-65 | Thêm M02 Private asset vào Shared Visit | Yêu cầu cấp quyền/copy hợp lệ, không leak ảnh |
| AC-M03-66 | A thu hồi quyền Editor của B khi B đang sửa | Save mới của B bị từ chối, B nhận thông báo phù hợp |
| AC-M03-67 | A và B sửa cùng trường trên Place | Phát hiện conflict, không silently overwrite |
| AC-M03-68 | A sửa tên, B sửa tag khác | Có thể giữ hai thay đổi độc lập hợp lệ, không mất dữ liệu |
| AC-M03-69 | A tạo Diary từ Visit | M01 sở hữu Diary, M03 giữ link, dữ liệu người dùng được phép |
| AC-M03-70 | Thêm Place vào Trip | M04 dùng cùng Place ID, không clone |
| AC-M03-71 | Ghi Expense qua Visit | M07 xác nhận Expense; M03 không duplicate money record |
| AC-M03-72 | M07 save Expense lỗi | Visit không mất, không báo expense success sai |
| AC-M03-73 | Trash Place | Có kiểm tra links, không cascade delete module khác |
| AC-M03-74 | Restore Place trong 30 ngày | Khôi phục ID và quan hệ còn hợp lệ |
| AC-M03-75 | Restore Visit có asset đã bị xóa vĩnh viễn | Visit khôi phục với thông báo thiếu asset, không bịa ảnh |
| AC-M03-76 | Search trực tiếp bằng URL ID private | Từ chối truy cập phía nguồn |
| AC-M03-77 | Mobile: tạo Place từ link/nhập tay | Hoàn thành được, không cần desktop |
| AC-M03-78 | Mobile: tạo Plan/Visit/Review và dùng Random | Hoàn thành được bằng cảm ứng |
| AC-M03-79 | Desktop: lọc nhiều điều kiện, quản lý Collections/Visit | Hoàn thành, điều hướng nhất quán |
| AC-M03-80 | Export/backup restore dữ liệu M03 qua shared foundation | Phục hồi Place/Visit/ACL/links trong phạm vi được phép; không mất dữ liệu đã cam kết |

## 17.7. Test matrix bắt buộc

Các bộ AC phía trên phải được chạy tối thiểu qua các chiều sau khi phù hợp:

| Chiều | Các trường hợp |
|---|---|
| Role | Owner, Editor, Viewer, no access; creator/reviewer riêng |
| Visibility | Private, Shared, resource linked nhưng không đủ quyền |
| Device | Mobile màn hình nhỏ, desktop, màn cảm ứng nếu có |
| Category | Food/Cafe, Entertainment/Cinema, Nature/Park, Other |
| Lifecycle | Active, Archived, Trashed, Restored; Plan Idea→Scheduled→Postponed→Completed/Cancelled |
| Concurrency | Cùng create, cùng edit field, quyền thay đổi giữa phiên, retry |
| Integration | M01/M02/M04/M05/M07 thành công, timeout, partial failure, missing target |
| Temporal | Visit quá khứ, lịch hoãn, timezone chênh lệch, ngày tạo khác ngày ghé |
| Empty/error | Không có Place, filter rỗng, thiếu map, review missing, asset unavailable |
| Data integrity | Nhiều Visit, nhiều Collection, nhiều reviewer, delete/restore, export/backup |

**Quy tắc nghiệm thu:** Một AC kiểm thử chỉ thông qua giao diện chưa đủ cho các trường hợp quyền/xung đột: cần xác minh hành vi phía nguồn dữ liệu và trạng thái tồn tại cuối. Tỷ lệ pass, mức bao phủ và cấu hình môi trường do kế hoạch kiểm thử kỹ thuật chi tiết quyết định, không tự xem là hoàn tất vì có UI.

---
# 18. Non-functional requirements và chất lượng trải nghiệm

## 18.1. Bảo mật và quyền riêng tư

- Mọi request đọc/sửa/xóa/ảnh/bình luận/tổng hợp phải kiểm tra quyền đối tượng gốc. Không được dùng biến ẩn UI làm biện pháp duy nhất.
- Không tiết lộ dữ liệu Private qua search suggestions, counters, autocomplete, duplicate hints, dashboards, thumbnails, source URL preview, maps hoặc links cross-module.
- Source/map URL là dữ liệu không tin cậy; người dùng có thể lưu link nhưng ứng dụng không tự thực thi nội dung của trang đích. Việc tải metadata tự động, nếu có, phải áp dụng các biện pháp kỹ thuật ngăn truy cập nội bộ trái phép, redirect nguy hiểm và nội dung nhúng độc hại ở giai đoạn thiết kế kỹ thuật.
- Nội dung ghi chú do người dùng nhập không được hiển thị theo cách thực thi code nhúng; định dạng an toàn do thiết kế kỹ thuật quyết định.
- Quyền được kiểm tra lại sau khi mở từ link M01, M04, M05, M09, không tin tưởng quyền đã xác nhận trước đó mãi mãi.
- Đối với thông tin vị trí cá nhân của người dùng, không yêu cầu quyền GPS nếu không có tính năng cần nó; D06 P0 là mở Directions từ Place, không phải theo dõi hai người.

## 18.2. Độ bền và tính toàn vẹn dữ liệu

- Các thao tác create/update phải hạn chế ghi trùng do retry/double-click, nhất là Date Plan–Event M05 và Visit–Expense M07.
- Không để Place bị xóa mềm nhưng Visit mới được tạo vào Place đó trong trạng thái active mà không có quy tắc rõ.
- Khi tích hợp bên ngoài một mô-đun thành công/một mô-đun thất bại, có trạng thái lỗi quan sát được và phương án retry/reconcile, không giả báo mọi phần đã hoàn tất.
- Backup/restore phải xác minh quan hệ Place–Visit–Review–Collection–Media reference–ACL; dữ liệu phục hồi không làm lộ mục Private.
- Bảo toàn lịch sử những lần đi, kể cả khi món, địa chỉ hoặc tên Place hiện tại thay đổi.

## 18.3. Hiệu năng và khả năng mở rộng

- Thiết kế nghiệp vụ phải chấp nhận số lượng Place, Visit, ảnh liên kết và Collections tăng theo nhiều năm.
- Danh sách/lịch sử/filter/tổng hợp không yêu cầu tải toàn bộ cơ sở dữ liệu vào trình duyệt. Hỗ trợ pagination/partial loading khi dữ liệu lớn, với thứ tự ổn định.
- Search và Random Picker không được lấy dữ liệu vượt quyền chỉ để lọc ở UI; lọc quyền là một phần nghiệp vụ nguồn.
- Mỗi card Place sử dụng ảnh xem trước do M02 cung cấp trong phạm vi quyền, không cần tải mọi original asset khi lướt danh sách.
- Số đo cụ thể như p95 search latency, p95 navigation latency, kích thước data set kiểm thử, số lượng Place tối đa **chưa được chủ dự án ấn định**. Sẽ được đề xuất và kiểm chứng ở NFR/technical plan toàn dự án.

## 18.4. Offline/weak network

- Không cam kết thao tác offline đầy đủ trong M03 V1.0.
- Khi mạng yếu, giao diện cho biết trạng thái yêu cầu, giữ form chưa gửi trong phạm vi có thể, cho retry khi an toàn và tránh duplicate.
- Không báo một Visit/Review/Plan đã Saved nếu lưu chưa được xác nhận.
- Khi một thao tác liên kết M05/M07 thất bại, không mất Place/Visit đã lưu hợp lệ.

## 18.5. Khả dụng, accessibility và tính dễ hiểu

- Ngôn ngữ giao diện chính phù hợp với hai người dùng tiếng Việt; thuật ngữ tiếng Anh như Wishlist/Visit có thể kèm giải thích rõ.
- Các button `Favorite`, `Revisit`, `Plan`, `Visited` không được dùng cùng biểu tượng/trạng thái khiến người dùng nhầm lẫn.
- Việc nhập thang điểm 0,5 dùng được với touch, chuột và bàn phím, có nhãn numeric.
- Dialog confirmation thể hiện đúng đối tượng và phạm vi (xóa Membership ≠ xóa Place).
- Với `Other` category, Form vẫn sử dụng được và không có field chuyên ngành bắt buộc bất hợp lý.
- Lịch và ngày thăm phải phù hợp locale và timezone; màn hình mobile không cắt mất thông tin ngày/giờ.

## 18.6. Observability và hỗ trợ khắc phục lỗi

- Những thao tác nhạy cảm như share/revoke, delete/restore, edit Place conflict, link Event, link Expense cần có audit thông tin actor, target, action, timestamp và trạng thái kết quả trong phạm vi bảo mật.
- Các lỗi cần phân biệt user validation, permission denied, not found/trashed, conflict, network timeout và integration failure. Không dồn tất cả thành "Something went wrong".
- Không log thông tin nhạy cảm nguyên văn hoặc token truy cập từ đường dẫn nguồn vào nơi không được kiểm soát.
- Không đưa tracking/analytics công khai hoặc quảng cáo vào phân hệ riêng tư nếu chưa được chủ dự án duyệt.

---

# 19. Ranh giới triển khai, phụ thuộc và Definition of Done

## 19.1. Mục tiêu bàn giao cho Codex

Codex cần chuyển BRD này thành **kế hoạch kỹ thuật và backlog công việc**, không đọc BRD như hướng dẫn viết code ngay lập tức. Trước khi thực hiện, cần đọc tài liệu M01, M02 và các quyết định chung của Our Space, kiểm tra trạng thái hệ thống thực tế (nếu đã có), lập bảng mapping quyền, thực thể, màn hình, use cases, acceptance criteria.

**Các quyết định chưa nằm trong BRD** như stack, database, API, storage, auth provider, indexing, map vendor, deployment, error monitoring và giao thức liên kết sẽ được thiết kế trong tài liệu kỹ thuật/ADR riêng. Không chèn một công nghệ bắt buộc vào bản nghiệp vụ chỉ vì một ví dụ triển khai.

## 19.2. Phụ thuộc cần xử lý theo thứ tự hợp lý

1. Shared foundation: hai tài khoản, quyền per-object, audit, trash, settings, backup.
2. M02: asset/media picker và quyền media.
3. M03 Core Place/Category/Collections/Share/Search.
4. M03 Visits, participants, reviews, preferences và dish conditional.
5. M05 event contract để Date Plan Scheduled thật sự đồng bộ lịch.
6. M07 expense contract để input trong Visit không tạo chi phí hai nguồn.
7. M01 Diary/Photobook links, M04 Trip, M06 Goals và Timeline hooks.
8. Test end-to-end quyền, xung đột, recovery, mobile/desktop, dữ liệu lớn, toàn vẹn cross-module.

**Lưu ý về phát hành:** Có thể phát triển và kiểm thử các phần theo giai đoạn nội bộ, nhưng theo quyết định phạm vi chung của chủ dự án, phiên bản sử dụng chính thức chỉ đạt khi 10 phân hệ P0 đã sẵn sàng. Dependency chưa triển khai không được âm thầm thay bằng một bản tính năng giả rồi đánh dấu M03 Completed.

## 19.3. Definition of Ready trước khi code M03

- [ ] Đọc và đối chiếu đủ D01–D20 cùng tài liệu M01/M02.
- [ ] Danh mục màn hình FP-01…FP-16 được ánh xạ vào wireframes/routes/panels ở thiết kế UX.
- [ ] Permission matrix phân biệt Place/Collection/Plan/Visit/Review/Media/Diary/Expense được đồng thuận.
- [ ] State transitions của Date Plan và cách link M05 được định nghĩa không sinh event trùng.
- [ ] Chủ sở hữu dữ liệu khoản chi thực tế tại M07 được xác định.
- [ ] Contract Media M02 và Diary M01 cho Create/View/Link/Unlink được xác định.
- [ ] Phương án xử lý conflict và idempotency cho các thao tác create/update đã được đưa vào thiết kế kỹ thuật.
- [ ] Các thông số kỹ thuật chưa chốt được liệt kê minh bạch và cấu hình được khi thích hợp.
- [ ] Bộ test AC/EX được chuyển thành kế hoạch kiểm thử và dữ liệu test.

## 19.4. Definition of Done — nghiệm thu M03 P0

- [ ] **All categories:** tạo/sửa/xem Place cho restaurant, cafe, cinema, park, museum, entertainment và Other mà không có field menu bắt buộc sai.
- [ ] **Place data:** chi nhánh tách riêng, kiểm tra duplicate không tự merge và không lộ Private.
- [ ] **Link + manual entry:** tự điền khi hợp lệ hỗ trợ; fallback nhập tay hoàn chỉnh, không làm người dùng bị kẹt.
- [ ] **Wishlist/Collections:** cá nhân/chung, một Place ở nhiều list, xóa list không xóa Place.
- [ ] **Directions:** mở bản đồ ngoài từ dữ liệu hợp lệ, thiếu dữ liệu không tạo kết quả giả; không phụ thuộc map nhúng P1.
- [ ] **Plans:** Idea/Scheduled/Postponed/Completed/Cancelled hoạt động, liên kết M05 đúng giờ, không tạo Visit tự động.
- [ ] **Visits:** tạo nhiều lần ghé trên một Place, nhập lại ngày cũ, người tham gia có xác nhận đúng, ảnh M02 link hợp lệ.
- [ ] **Reviews:** A/B review riêng, overall 1–5 bước 0,5, optional aspects theo category; không tính missing là 0.
- [ ] **Dishes:** want-to-try, tried, repeat visits, giá snapshot, không bắt cho nơi không có menu.
- [ ] **Favorites/Revisit:** flags độc lập theo user, Both of Us Love It đúng quyền.
- [ ] **Search/Random:** bộ lọc kết hợp đúng, không leak Private, Random trả về chỉ Place hợp lệ.
- [ ] **Insights:** Places vs Visits phân biệt, rating đúng mẫu quyền, spending lấy từ M07.
- [ ] **Cross-module:** M01 Diary, M02 Media, M04 Trip, M05 Calendar, M07 Expenses liên kết, không duplicate nguồn.
- [ ] **Privacy:** per-object ACL đúng ở UI, URL, result sets, thumbnails, summaries, integration flows.
- [ ] **Collaboration:** cập nhật đồng thời không silent overwrite; không cần live cursor.
- [ ] **Delete/Restore:** Trash 30 ngày, Archive riêng, không cascade, restore giữ ID và links còn hợp lệ.
- [ ] **Mobile/Desktop:** toàn bộ hành trình P0 hoàn thành được trên mỗi thiết bị.
- [ ] **Testing:** toàn bộ AC-M03-01…AC-M03-80 đã được phân tích/kiểm thử; mọi ngoại lệ nghiêm trọng EX được xử lý.
- [ ] **Documentation:** hướng dẫn sử dụng ngắn, quy tắc và liên kết M01/M02 được cập nhật nếu có thay đổi được duyệt; P1/P2 không âm thầm đẩy vào scope.

## 19.5. Các trường hợp không được đánh dấu là Done

- Có giao diện map nhúng đẹp nhưng chưa có nhiều Visit hoặc privacy đúng.
- Lưu Location theo tên quán chung làm hai chi nhánh lẫn vào nhau.
- Có một rating duy nhất trên Place thay thế hai đánh giá theo Visit.
- Tự chuyển Plan thành Visit khi đã qua ngày lịch.
- Coi chỉ ẩn action là đủ phân quyền trong khi URL trực tiếp vẫn xem được.
- Khi gắn media vào Visit, lưu lại file gốc trong storage M03.
- M03 lưu actual amount riêng trong khi M07 cũng lưu một Expense khác.
- Thực hiện xóa dây chuyền ảnh/Diary/Trip khi xóa Place.
- Chỉ làm được thao tác Add Visit/Review trên desktop.
- Dùng AI gợi ý Place nhưng các chức năng P0 chưa hoàn thành.

---

# 20. Ví dụ thực tế, traceability, change log

## 20.1. Ví dụ A — Một Place, nhiều Visit và đánh giá riêng

**Dữ liệu minh họa, không phải seed data:**

- Place `Cafe A`, category Cafe, branch tại địa điểm cụ thể.
- Wishlist chung thêm tháng 10/2026.
- Plan ban đầu 25/10/2026, dời lịch, sau đó hoàn thành theo xác nhận của người dùng.
- Visit #1 tháng 11/2026: A chấm 4.5, B chấm 4.0. Điểm chung của **Visit #1** với hai đánh giá hợp lệ là 4.25/5.
- Visit #2 tháng 12/2026: cảm nhận mới được lưu độc lập, không thay Visit #1.
- A Favorite quán, B chưa; B muốn Revisit.
- Một ảnh của Visit #1 thuộc M02 và được đưa vào Diary M01 bằng quy trình chia sẻ hợp lệ.

**Assertions:** Place count = 1, Visit count = 2, review mỗi Visit theo tác giả; Favorite và Revisit không đồng nhất; ngày Plan không bắt buộc bằng ngày Visit; nếu sửa Place name thì mọi liên kết giữ ID.

## 20.2. Ví dụ B — Địa điểm không có thực đơn

- Place `Museum B`, category Museum, không có Dish nào.
- B lưu Place qua source URL; URL không cho tự điền, B nhập tay tên và loại địa điểm.
- A và B Shared Collection "Weekend Ideas"; tạo Plan, link M05.
- Khi ghé, tạo Visit, ghi chú triển lãm, thêm ảnh M02, đánh giá Atmosphere/Overall; **không bắt điểm Food/Drinks hoặc tạo món**.
- B tạo Diary trong M01, liên kết Visit.

**Assertions:** Đáp ứng D01; mọi luồng P0 còn áp dụng; không coi rạp phim, bảo tàng, công viên là dữ liệu "ngoại lệ" không thể lưu.

## 20.3. Ví dụ C — Place được dùng trong chuyến đi

- A lưu Place `Viewpoint C` Private rồi chủ động chia sẻ B.
- M04 thêm Place C vào Trip Đà Lạt, lưu ghi chú và thời gian riêng của Trip Stop.
- M03 vẫn chỉ có một Place C, M04 có một Trip Stop tham chiếu Place C.
- Khi đi xong, M03 có Visit, M02 có ảnh, M01 có Diary, M04 liên kết chuyến đi.
- Nếu Place C Archived, lịch sử Trip/Visit vẫn có thể xem theo quyền; nếu Place Trashed, UI báo trạng thái theo chính sách, không tự xóa Trip.

## 20.4. Ví dụ D — Xung đột và quyền riêng tư

- A và B cùng là Editor Place X.
- A sửa địa chỉ, B sửa địa chỉ từ bản cũ. Save thứ hai phải được thông báo conflict, không ghi đè âm thầm.
- Sau đó A tạo Visit Private, B vẫn chỉ được xem Place X Shared.
- B tìm kiếm, xem Insights, mở URL guessed: không thể suy ra Visit Private.
- A thu hồi quyền Editor của B. Tab cũ của B không thể lưu thay đổi mới.

## 20.5. Ma trận truy vết quyết định → quy tắc/kiểm thử

| Quyết định | Business Rules nổi bật | Acceptance Criteria tiêu biểu | Màn hình liên quan |
|---|---|---|---|
| D01 | BR-M03-01, 10, 28, 31 | AC-M03-04, 47 | FP-02/03/04/09/11/12 |
| D02 | BR-M03-41, 42, 43 | AC-M03-01, 64, 76 | FP-03/04/05/10 |
| D03 | BR-M03-05, 06 | AC-M03-06, 07, 08 | FP-03 |
| D04 | BR-M03-02, 07 | AC-M03-05, 10 | FP-03/04 |
| D05 | BR-M03-11, 12, 14, 15 | AC-M03-15–24 | FP-05 |
| D06 | BR-M03-03, 04, 56 | AC-M03-12, 13 | FP-04/06 |
| D07 | BR-M03-16, 17, 18, 19 | AC-M03-25–34 | FP-07 |
| D08 | BR-M03-08, 21, 22 | AC-M03-35–37, 60 | FP-08/09/10 |
| D09 | BR-M03-25, 26, 27 | AC-M03-42–45 | FP-11 |
| D10 | BR-M03-28, 29 | AC-M03-46, 47 | FP-11 |
| D11 | BR-M03-31, 32, 33 | AC-M03-48, 49 | FP-12/09 |
| D12 | BR-M03-34, 35 | AC-M03-52–54 | FP-13 |
| D13 | BR-M03-20, 36 | AC-M03-57–59 | FP-15 |
| D14 | BR-M03-37, 38, 39, 40 | AC-M03-55, 56, 60–63 | FP-14/16 |
| D15 | BR-M03-44, 45, 46 | AC-M03-40, 41, 65 | FP-03/09/10 |
| D16 | BR-M03-40, 46, 60 | AC-M03-63, 71, 72 | FP-09/10/16 |
| D17 | BR-M03-47, 48, 49, 57 | AC-M03-66–68 | FP-03/05/07/09 |
| D18 | BR-M03-51–54 | AC-M03-73–75 | FP-02/04/08/16 |
| D19 | BR-M03-56 | AC-M03-04, 57 | Toàn M03 (P2 excluded) |
| D20 | BR-M03-55 | AC-M03-77–79 | FP-01–16 |

## 20.6. Open Technical Decisions — không tự biến thành yêu cầu đã chốt

Đây là **việc của giai đoạn technical design**, không chặn việc BRD đã được duyệt:

| Mã | Vấn đề kỹ thuật cần thiết kế | Giới hạn được bảo toàn |
|---|---|---|
| TD-M03-01 | Store/query Place, spatial fields, Category model | D01 nhiều loại Place, D04 branch separate |
| TD-M03-02 | URL parsing/optional provider import | D03 manual fallback; không bắt nguồn bên ngoài hoạt động mọi lúc |
| TD-M03-03 | Conflict strategy và revision tracking | D17 không silent overwrite |
| TD-M03-04 | M05 event reference/cancel/retry contract | D07 đúng nguồn thời gian, no duplicated event |
| TD-M03-05 | M07 expense reference/transactional orchestration | D16 actual expense nguồn M07 |
| TD-M03-06 | ACL implementation, share target and visibility evaluation | D02 Private mặc định, no leak |
| TD-M03-07 | Media link access, image/variant strategy | D15 không lưu media trùng |
| TD-M03-08 | Garbage collection và restore | D18 Trash 30 ngày, no cascade |
| TD-M03-09 | Search pagination, sorting, stats querying | D14 multi-filter, privacy-safe counters |
| TD-M03-10 | External maps deep link và link validation | D06 không yêu cầu embedded map P0 |
| TD-M03-11 | Plan timezone và Visit date-only storage semantics | Không thay ngày kỷ niệm do convert sai |
| TD-M03-12 | Export/backup schema và permissions | Khôi phục associations/ACL đầy đủ |

## 20.7. Các điểm đã hoàn toàn được chủ dự án duyệt

- D01–D20 theo đúng bảng ở mục 2.
- M03 sử dụng mọi loại địa điểm vui chơi V1.0.
- Mỗi lần ghé là một Visit độc lập, hai tài khoản có review riêng theo Visit.
- Quyền Private mặc định, chia sẻ có chủ đích.
- Bản đồ tương tác P1, AI P2; không nâng chúng lên P0.
- Media từ M02, Calendar từ M05 và thực chi từ M07.
- Mobile và desktop ngang nhau cho nghiệp vụ chính.
- Trash 30 ngày; bảo vệ nội dung liên kết.

Các chi tiết như giao diện cuối, hệ quản trị danh mục Category, giới hạn độ dài, số lượng kết quả mỗi trang, ngưỡng hiệu năng và schema cụ thể **chưa phải quyết định đã chốt**. Chúng phải được quản lý bằng tài liệu thiết kế kỹ thuật/UX và được rà soát theo các quy tắc nêu trên.

## 20.8. Change Log

| Phiên bản | Ngày | Mô tả | Trạng thái |
|---|---|---|---|
| V0.1 | 2026-10-22 | Đề xuất M03, 16 màn hình, Place/Wishlist/Plan/Visit/Review/Search/Random, các lựa chọn D01–D20 | Draft discussion |
| V1.0 | 2026-10-22 | Chủ dự án chốt riêng D01–D20; **mở rộng D01 ra mọi loại địa điểm**, chuẩn hóa business rules, Use Cases, exceptions, acceptance criteria, tích hợp M01/M02 và phụ thuộc M04/M05/M07 | Approved business baseline, implementation pending |

---

## TÓM TẮT HANDOFF CHO CODEX

1. Đọc tệp này và hai tài liệu `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md`, `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md`.
2. Lấy **D01–D20** và **BR-M03-01…BR-M03-60** làm baseline nghiệp vụ, áp dụng trên cả 16 màn hình FP-01…FP-16.
3. Thiết kế kỹ thuật theo mô hình `Place → (Wishlist/Collection, Plan, Visit)`, `Visit → (Participant, Review, Dish/Activity, Media ref, Diary ref, Expense ref)`; mọi loại Place được hỗ trợ và data ownership rõ ràng.
4. Đối chiếu các Use Cases UC-M03-01…UC-M03-18, 50 ngoại lệ EX-M03-01…EX-M03-50 và 80 tiêu chí AC-M03-01…AC-M03-80.
5. Không đổi scope P1/P2, không tự công khai dữ liệu, không đặt công nghệ mặc định thay cho quyết định kỹ thuật của dự án, không viết chức năng trùng media M02/lịch M05/chi phí M07.
6. Chỉ báo đã hoàn thành khi đáp ứng Definition of Done tại mục 19.4, có test tích hợp và chứng cứ thử trên mobile/desktop.

**Trạng thái tài liệu:** `APPROVED BUSINESS REQUIREMENTS — READY FOR TECHNICAL DESIGN`, **không có nghĩa tính năng đã được code hoặc kiểm thử.**
