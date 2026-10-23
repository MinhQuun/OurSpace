---
document_id: OURSPACE-M01-BRD
project: Our Space
module_id: M01
module_name: Photobook & Diary
version: 1.0
status: Business requirements approved, implementation pending
language: vi-VN
approved_on: 2026-10-22
file_name: OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md
intended_audience: [Product Owner, Designer, Codex, Developer, QA]
---

# OUR SPACE — M01: PHOTOBOOK & DIARY
## Business Requirements & Functional Specification — V1.0

> **Tài liệu nguồn để triển khai M01.** Đặt tệp này trong thư mục `Docs/` của dự án. Đây là **đặc tả nghiệp vụ đã được chủ dự án xác nhận về định hướng và toàn bộ các đề xuất D01–D15**, không phải mã nguồn, thiết kế database hay chỉ định công nghệ. Các chi tiết quy chuẩn hóa trong tài liệu giúp đội phát triển/Codex chuyển yêu cầu thành thiết kế kỹ thuật và kiểm thử. Không tự mở rộng chức năng P1/P2 thành bắt buộc của V1.0.
>
> **Quan trọng với Codex:** Trước khi code, đọc mục **1, 2, 4, 8, 10, 12, 13 và 16**. Mọi thao tác sửa nội dung phải tuân thủ quyền, cộng tác và cơ chế lưu. Không dùng cách "lưu toàn bộ trang, bản đến sau ghi đè bản đến trước". Nếu yêu cầu có khoảng trống kỹ thuật, đưa ra quyết định ở tài liệu kỹ thuật riêng, không tự đổi quy tắc nghiệp vụ. M01 phụ thuộc các năng lực dùng chung của dự án và M02, M09, M10 như mô tả trong mục 11 và 16.

---

## Mục lục

1. [Tổng quan và nguyên tắc sản phẩm](#1-tổng-quan-và-nguyên-tắc-sản-phẩm)
2. [Quyết định đã chốt và phạm vi V1.0](#2-quyết-định-đã-chốt-và-phạm-vi-v10)
3. [Người dùng, vai trò và thuật ngữ](#3-người-dùng-vai-trò-và-thuật-ngữ)
4. [Mô hình đối tượng nghiệp vụ và trạng thái](#4-mô-hình-đối-tượng-nghiệp-vụ-và-trạng-thái)
5. [Sitemap và đặc tả 17 màn hình](#5-sitemap-và-đặc-tả-17-màn-hình)
6. [Chi tiết Photobook, Simple và Advanced Editor](#6-chi-tiết-photobook-simple-và-advanced-editor)
7. [Chi tiết Diary và gắn nội dung vào Photobook](#7-chi-tiết-diary-và-gắn-nội-dung-vào-photobook)
8. [Cộng tác thời gian thực, lưu và phiên bản](#8-cộng-tác-thời-gian-thực-lưu-và-phiên-bản)
9. [Quyền truy cập và riêng tư](#9-quyền-truy-cập-và-riêng-tư)
10. [Use Cases và các luồng chính](#10-use-cases-và-các-luồng-chính)
11. [Liên kết với các phân hệ khác](#11-liên-kết-với-các-phân-hệ-khác)
12. [Quy tắc nghiệp vụ, ngoại lệ và tính phi chức năng](#12-quy-tắc-nghiệp-vụ-ngoại-lệ-và-tính-phi-chức-năng)
13. [Acceptance Criteria và ma trận kiểm thử](#13-acceptance-criteria-và-ma-trận-kiểm-thử)
14. [Giao diện desktop/mobile và accessibility](#14-giao-diện-desktopmobile-và-accessibility)
15. [Dữ liệu mẫu, template và ví dụ minh họa](#15-dữ-liệu-mẫu-template-và-ví-dụ-minh-họa)
16. [Ranh giới triển khai và Definition of Done](#16-ranh-giới-triển-khai-và-definition-of-done)
17. [Nhật ký quyết định và thay đổi](#17-nhật-ký-quyết-định-và-thay-đổi)

---

# 1. Tổng quan và nguyên tắc sản phẩm

## 1.1. Bối cảnh

**Our Space** là website riêng tư, sử dụng lâu dài cho hai người. Website có Homepage hiện đại cùng nhiều phân hệ liên kết, trong đó **M01 — Photobook & Diary** là phân hệ chủ đạo lưu giữ, kể lại và sáng tạo kỷ niệm.

Nguồn tham khảo trải nghiệm: video `photobook.mp4` do chủ dự án gửi. Định hướng thị giác là photobook/scrapbook có ảnh, văn bản, sticker, giấy note, bố cục tự do và trải nghiệm lật trang. Video là **tham khảo về cảm giác sử dụng**, không ràng buộc việc sao chép từng chi tiết, đồng thời không chứng minh sẵn các chức năng Editor.

## 1.2. Mục tiêu nghiệp vụ

- **Lưu giữ:** lưu câu chuyện, cảm xúc, ảnh theo ngày hoặc sự kiện, kể cả kỷ niệm được ghi lại muộn.
- **Sáng tạo:** tạo nhiều cuốn photobook và tự thiết kế từng trang trực tiếp trên website.
- **Đơn giản và chuyên sâu:** chuyển đổi giữa Simple Editor và Advanced Editor mà không mất dữ liệu.
- **Đồng sáng tạo:** hai người có thể cùng chỉnh sửa một cuốn sách, cùng trang, thậm chí cùng vùng văn bản theo thời gian thực.
- **Tái sử dụng:** dùng ảnh, nhật ký và dữ liệu liên quan từ các phân hệ khác theo quyền truy cập.
- **Bảo tồn:** tự lưu, lịch sử phiên bản, khôi phục, lưu trữ, thùng rác, xuất PDF và sao lưu dữ liệu.
- **Truy cập đa thiết bị:** tạo, chỉnh và đọc sách được trên desktop lẫn điện thoại.

## 1.3. Nguyên tắc bắt buộc

1. Nội dung và dữ liệu của hai người được kiểm soát quyền riêng tư tại nguồn truy cập, không chỉ bằng việc ẩn nút UI.
2. Sách ở trạng thái Published có phiên bản ổn định. Chỉnh sửa tiếp tạo bản nháp mới, không thay đổi âm thầm ấn bản đã công bố.
3. Diary là bản ghi nội dung độc lập. Photobook là hình thức dàn trang và kể chuyện, có thể dùng bản sao từ Diary.
4. Một nội dung gốc không bị xóa dây chuyền chỉ vì photobook liên kết tới nó bị xóa.
5. Hai người có quyền Editor không phải lần lượt chờ nhau hoàn thành trang. Hệ thống phải xử lý xung đột mà không làm mất cập nhật hợp lệ.
6. Sự kiện **hiển thị đã lưu** phải dựa trên xác nhận lưu thành công, không dựa vào việc người dùng vừa thao tác.
7. Mobile không phải phiên bản chỉ xem. Các luồng tạo/chỉnh sửa chính phải hoàn thành được trên mobile.
8. Có khả năng mở rộng M01 theo thời gian mà không làm mất khả năng đọc và chỉnh các sách hiện có.

## 1.4. Giới hạn phạm vi tài liệu

Tài liệu **không** quyết định framework, thư viện editor, mô hình đồng bộ thuật toán, API endpoints, schema database, dịch vụ lưu file, cấu trúc thư mục code hoặc nhà cung cấp hosting. Đây là các đầu việc cho giai đoạn kiến trúc kỹ thuật, phải tuân thủ các bất biến nghiệp vụ đã mô tả.

---

# 2. Quyết định đã chốt và phạm vi V1.0

## 2.1. Năm quyết định nền tảng của Our Space

| ID | Quyết định chính thức | Hệ quả đối với M01 |
|---|---|---|
| G-01 | Homepage hiện đại, Photobook phong cách scrapbook | Giao diện quản lý sạch, Reader/Editor hỗ trợ trình bày sáng tạo |
| G-02 | Có Simple và Advanced Editor | Cả hai thao tác trên cùng mô hình trang, không mất thành phần khi chuyển đổi |
| G-03 | Phân quyền theo cuốn sách và nội dung | Có quyền cấp cuốn, cấp trang, cấp Diary |
| G-04 | Desktop và mobile ngang nhau | Cả hai hoàn thành luồng nghiệp vụ chính, bố cục UI có thể khác |
| G-05 | Có đủ 10 phân hệ chính trước khi sử dụng chính thức | M01 được phát triển tích hợp với các năng lực dùng chung, không đứng riêng thành sản phẩm khác |

## 2.2. Quyết định bổ sung đã xác nhận

| ID | Quyết định chính thức | Ghi chú thực hiện |
|---|---|---|
| G-06 | Hai người cùng sửa Photobook **thời gian thực** | Bao gồm concurrent text, đồng bộ object/page, presence, undo an toàn |

## 2.3. Chốt toàn bộ D01–D15 (22/10/2026)

**Người dùng đã xác nhận toàn bộ các phương án đề xuất D01–D15** trong cuộc hội thoại. Bảng dưới đây là kết quả đã chốt, thay cho trạng thái “chờ duyệt” trong bản thảo trước.

| ID | Nội dung đã chốt | Áp dụng V1.0 |
|---|---|---|
| D01 | Khởi đầu với **hai định hướng khổ sách**: dọc (portrait) và ngang (landscape) | Bắt buộc, kích thước thực tế sẽ được định nghĩa trong thiết kế UI/in ấn |
| D02 | Reader có **lật trang, vuốt chuyển trang và kiểu chuyển đơn giản dự phòng** | Bắt buộc, tôn trọng giảm chuyển động |
| D03 | Nhạc nền **không bắt buộc trong V1.0**, nhưng dự trù mở rộng nội dung | Không được tự bổ sung chức năng nhạc như P0 |
| D04 | Chèn/phát video **chỉ đưa vào V1.0 nếu phát sinh nhu cầu thiết yếu đã xác nhận** | Mặc định ngoài P0, Media Library vẫn có thể lưu video |
| D05 | Có **xuất PDF trong V1.0** để lưu giữ, chia sẻ bản sao hoặc chuẩn bị in | P0, không đồng nghĩa cam kết file đạt mọi chuẩn in thương mại |
| D06 | Sách tạo mới mặc định **Private**, người tạo chủ động chia sẻ | P0, thay thế đề xuất Shared mặc định ở bản sơ bộ |
| D07 | Owner có quyền Publish, Editor muốn Publish phải được **cấp riêng** | P0 |
| D08 | Trang kế thừa quyền từ sách, nhưng **cho phép cấu hình ngoại lệ theo trang** | P0 |
| D09 | Diary V1.0 ưu tiên chỉnh sửa thông thường có bảo vệ xung đột, **không bắt buộc cùng gõ real-time** | P0 của Diary không gồm RT co-authoring |
| D10 | Đưa Diary vào sách mặc định bằng **Copy as Snapshot** | P0, không đồng bộ sửa hai chiều |
| D11 | Có **thư viện sticker và đồ trang trí cơ bản** | P0 |
| D12 | Có **8–12 template chất lượng tốt** khởi đầu | P0, kiểm thử tối thiểu 8 mẫu phân biệt rõ |
| D13 | Thùng rác có thời gian giữ **tối thiểu 30 ngày** trước khi xóa vĩnh viễn theo chính sách | P0, cần hiển thị thời điểm dự kiến xóa |
| D14 | **Không mở quyền khách/public share** trong V1.0 | P0, chỉ hai tài khoản được cấp quyền |
| D15 | Cho phép cùng tài khoản đăng nhập ở nhiều thiết bị, mỗi tab/thiết bị là **một phiên cộng tác** | P0, xử lý trùng danh tính phiên và xung đột |

> **Làm rõ quyết định mang tính điều kiện:** D03 và D04 *không* biến nhạc/video trong trang thành yêu cầu xây dựng bắt buộc. Mặc định scope V1.0 **không có trình phát media nhúng trong trang**. Khi chủ dự án muốn bổ sung, cần cập nhật file này và điều kiện nghiệm thu.

## 2.4. Phạm vi chức năng ưu tiên

### P0 — Bắt buộc để M01 được nghiệm thu trong Our Space V1.0

- Photobook Library, Create Photobook, Book Overview, Photobook Reader, Page Manager.
- Simple Editor theo template và Advanced Editor với công cụ chỉnh sửa cốt lõi.
- 8–12 template được chuẩn bị, thư viện sticker cơ bản, khổ dọc/ngang.
- Cộng tác real-time hai chiều: hiện diện, sửa nội dung, cùng gõ chữ, phối hợp object và trang, lưu, kết nối lại, quyền, undo an toàn.
- Draft, Publication bất biến, Revision Draft, Archive, Trash, Version History, Restore.
- Share & Permissions: quyền theo sách, ngoại lệ theo trang, chia sẻ an toàn các nội dung nguồn.
- Diary Timeline, Diary Editor, Diary Detail, đưa Diary vào Photobook bằng snapshot.
- Chọn ảnh từ M02, upload theo khả năng hợp đồng M02, liên kết nội dung khác khi nguồn sẵn sàng.
- PDF Export từ nội dung hợp lệ, với cảnh báo và bố cục phù hợp khổ sách.
- Desktop/mobile có các luồng tạo và chỉnh chính, quyền riêng tư và điều kiện nghiệm thu.

### P1 — Nâng cao sau V1.0 hoặc chỉ đưa vào trước phát hành khi chủ dự án bổ sung

- Video được phát ngay trong từng trang; nhạc nền; các hiệu ứng animation tinh vi hơn ba kiểu Reader đã chốt.
- Nhiều khổ sách/chuẩn in/bleed chuyên nghiệp, xuất file chuẩn nhà in.
- Thư viện template/sticker lớn, bộ template tự tạo và chia sẻ nội bộ.
- Linked Content trực tiếp từ Diary cập nhật hai chiều hoặc một chiều.
- Cộng tác real-time trong Diary (khác với Photobook).

### P2 — Tầm nhìn tương lai

- AI tự thiết kế trang, AI chọn ảnh, AI gợi ý câu chữ.
- Hệ thống marketplace template, chia sẻ công khai, mời người thứ ba.
- Âm thanh thuyết minh, tính năng kể chuyện tương tác phức tạp.

### Ngoài phạm vi M01

- M02 chịu trách nhiệm thư viện ảnh/video nền tảng và các chính sách upload/tự đồng bộ.
- M03 quản lý địa điểm, M04 chuyến đi, M05 sự kiện, M08 cột mốc, M09 bình luận/cảm xúc, M10 hồ sơ/cài đặt.
- M01 chỉ tiêu thụ/liên kết các đối tượng từ các phân hệ khác, không tạo bản quản lý trùng chức năng.

---

# 3. Người dùng, vai trò và thuật ngữ

## 3.1. Actors

| Actor | Ý nghĩa |
|---|---|
| User A / User B | Hai tài khoản riêng trong một Our Space |
| Owner | Người sở hữu một photobook/diary cụ thể |
| Editor | Người có quyền thay đổi nội dung được chia sẻ |
| Commenter | Người có quyền đọc Published và bình luận khi tích hợp M09 |
| Viewer | Người có quyền đọc Published |
| System | Kiểm soát quyền, lưu trạng thái, đồng bộ, lịch sử, PDF, cảnh báo |

Một người có thể là Owner sách X và Viewer sách Y. **Vai trò được xác định theo từng nội dung, không gán cứng quyền toàn hệ thống**. Tài khoản quản trị kỹ thuật không được mặc định bỏ qua chính sách xem nhật ký riêng tư ở trải nghiệm ứng dụng thông thường.

## 3.2. Thuật ngữ

| Thuật ngữ | Định nghĩa |
|---|---|
| Photobook | Cuốn sách nhiều trang có cấu trúc, layout và phiên bản |
| Page | Một mặt trang có định danh ổn định, thứ tự và kích cỡ thiết kế |
| Page Element | Đối tượng hiển thị trên trang, gồm ảnh, chữ, sticker, shape, background |
| Simple Editor | Chỉnh theo template/slot và thuộc tính an toàn |
| Advanced Editor | Chỉnh tự do vị trí, kích thước, xoay, layer và bố cục |
| Draft | Nội dung đang được chỉnh sửa, chưa đưa lên bản Published mới |
| Publication | Ấn bản được chốt tại một thời điểm, không đổi ngầm |
| Revision Draft | Bản nháp tiếp theo của sách đã Published |
| Diary Entry | Bài nhật ký độc lập với photobook |
| Snapshot | Bản sao nội dung tại thời điểm chèn, sau đó có thể sửa độc lập |
| Collaboration Session | Một tab/thiết bị tham gia chỉnh sửa của một tài khoản |
| Presence | Thông tin những phiên hiện đang tham gia theo quyền |
| Confirmed Save | Thay đổi đã được hệ thống xác nhận lưu thành công |
| Conflict | Những chỉnh sửa không thể hợp nhất an toàn mà không chọn phương án xử lý |
| Trash | Khu vực giữ nội dung xóa mềm trước xóa vĩnh viễn |

---

# 4. Mô hình đối tượng nghiệp vụ và trạng thái

> Đây là **mô hình khái niệm**, không phải tên bảng, cột hoặc kiểu dữ liệu bắt buộc. Khi làm thiết kế kỹ thuật, có thể bổ sung metadata phục vụ đồng bộ mà không được làm mất bất biến nghiệp vụ.

## 4.1. Danh mục thực thể

| ID | Đối tượng | Trường/thuộc tính nghiệp vụ cần có |
|---|---|---|
| ENT-01 | Photobook | định danh, title, description, cover, orientation, theme, owner, visibility, collaborators, trạng thái, thời điểm tạo/sửa, active draft, published revision |
| ENT-02 | Page | định danh, book, thứ tự, tên nội bộ, loại trang, layout metadata, quyền kế thừa/ngoại lệ, các phần tử, trạng thái |
| ENT-03 | Page Element | định danh, page, loại, vị trí, kích thước, góc xoay, thứ tự lớp, thuộc tính, nội dung hoặc media ref, trạng thái khóa/ẩn |
| ENT-04 | Template | định danh, tên, loại, orientation hỗ trợ, số vùng nội dung, hình preview, template version |
| ENT-05 | Diary Entry | định danh, title, body, event date, authored date, author, mood, tags, media, location ref, visibility, trạng thái, lịch sử |
| ENT-06 | Media Reference | định danh tài nguyên gốc, loại, tên/metadata cần hiển thị, cách sử dụng trong trang, quyền sử dụng hiện tại |
| ENT-07 | Permission Grant | nội dung đích, người nhận, vai trò, các quyền bổ sung, nguồn quyền, thời điểm thay đổi |
| ENT-08 | Collaboration Session | user, device/tab session, book/page hiện tại, trạng thái kết nối, presence metadata |
| ENT-09 | Change Record | tác nhân, phiên, thời điểm ghi nhận, đích thao tác, loại thao tác, liên kết tới trạng thái sau thay đổi |
| ENT-10 | Version | mốc khôi phục, nội dung nhất quán, tác nhân/tác vụ tạo mốc, thời gian, ghi chú |
| ENT-11 | Content Link | loại đối tượng nguồn/đích, ID nguồn/đích, vai trò liên kết, quyền liên quan |
| ENT-12 | Publication | mã ấn bản, photobook, nội dung chốt, ngày công bố, người công bố, metadata xuất bản |
| ENT-13 | Export Job/Record | nội dung xuất, phạm vi quyền, định dạng, trạng thái, thời điểm, người yêu cầu, file kết quả |
| ENT-14 | Trash Record | nội dung, người xóa, thời điểm, hạn phục hồi, phụ thuộc dữ liệu |

## 4.2. Trường, validation và quy tắc của Photobook

| Trường | Bắt buộc | Validation nghiệp vụ |
|---|---|---|
| Title | Có | Không rỗng hoặc chỉ khoảng trắng, hiển thị an toàn, cho phép trùng tên |
| Description | Không | Văn bản được làm sạch để không thực thi nội dung nguy hiểm |
| Orientation | Có | Portrait hoặc Landscape trong V1.0 |
| Cover | Không | Có bìa mặc định nếu chưa chọn ảnh |
| Theme | Có | Có theme mặc định nếu người dùng bỏ qua |
| Owner | Có | Tài khoản hợp lệ, không tự đổi vì chuyển quyền Editor |
| Visibility | Có | Mặc định Private |
| Collaborator grants | Không | Chỉ user hợp lệ trong Our Space, không có khách |
| Status | Có | Một trong các trạng thái hợp lệ |

Giới hạn cụ thể về độ dài chữ, số trang và kích thước file sẽ được chuẩn hóa trong tài liệu thiết kế UX/vận hành chung, **không âm thầm đặt giới hạn thấp** khiến nội dung hợp lệ bị loại. Ứng dụng phải có chính sách và thông báo rõ trước khi chặn dữ liệu.

## 4.3. Trường, validation và quy tắc của Diary

| Trường | Bắt buộc | Ghi chú |
|---|---|---|
| Title | Không | Có thể dùng tiêu đề thay thế từ ngày hoặc đoạn đầu |
| Body | Có điều kiện | Nhật ký phải có ít nhất văn bản có nghĩa **hoặc** một media hợp lệ |
| Event Date | Có | Ngày thực sự của kỷ niệm, khác ngày tạo bản ghi |
| Authored/Updated | Tự ghi nhận | Không lấy ngày trên máy khách làm nguồn duy nhất cho lịch sử |
| Author/Owner | Có | Người tạo ban đầu |
| Media | Không | Có thể có nhiều ảnh, video của Diary theo chính sách media chung |
| Mood | Không | Tùy chọn, không áp đặt thang cảm xúc |
| Place/Trip/Event Link | Không | Chỉ được liên kết nếu nguồn tồn tại và người dùng có quyền |
| Tags | Không | Phục vụ lọc/tìm kiếm |
| Visibility | Có | Mặc định Private, chia sẻ theo chính sách chung |

**Quy tắc:** Diary được tạo hôm nay nhưng nói về một sự kiện năm trước sẽ xuất hiện trên timeline kỷ niệm theo **Event Date**, đồng thời vẫn có metadata ngày tạo và ngày chỉnh sửa.

## 4.4. Mô hình Page và Element

- Một sách có nhiều Page. Mỗi Page có ID riêng, việc thay đổi thứ tự không thay đổi ID.
- Một Page có nhiều Page Element. Các loại P0: text, image, sticker, basic shape, background.
- Một element lưu các thuộc tính có thể sửa như vị trí, kích thước, xoay, layer, font và style phù hợp loại.
- Mỗi phần tử duy trì thứ tự lớp nhất quán. Xóa phần tử không làm biến mất dữ liệu ảnh gốc thuộc M02.
- Thumbnail và bản xem trước phải phản ánh nội dung người dùng **được phép** xem, không chứa dữ liệu riêng tư bị ẩn.
- Kích thước thiết kế cần giữ nhất quán cho từng định hướng khổ sách, không tự làm méo bố cục khi đổi kích thước màn hình.

## 4.5. Trạng thái Photobook

```text
Create → Draft ──Publish──> Published
             ↑                 │
             └──Revision Draft─┘
Draft/Published ──Archive──> Archived ──Restore──> trạng thái phù hợp
Draft/Published/Archived ──Delete──> Trashed ──Restore──> trạng thái trước đó
Trashed ──Permanent Delete theo chính sách──> Deleted
```

- `Draft`: sách chưa có bản công bố. Có thể edit/preview/publish theo quyền.
- `Published`: sách đã có ít nhất một Publication bất biến.
- `Revision Draft`: khu vực chỉnh sửa tiếp theo, không làm thay đổi bản đã Published.
- `Archived`: lưu trữ không đồng nghĩa xóa. Có thể đọc/khôi phục theo quyền.
- `Trashed`: xóa mềm. Còn thời hạn hồi phục tối thiểu 30 ngày.
- `Deleted`: đã xóa vĩnh viễn sau xác nhận/chính sách, không hứa khôi phục từ thùng rác.

**Một sách Published có thể đồng thời có Revision Draft.** Không xem Published và Draft là hai cuốn sách khác nhau.

## 4.6. Trạng thái Diary

`Draft → Published → Archived → Trashed`, hỗ trợ sửa bài đã công bố với lịch sử thay đổi. Việc đổi trạng thái hoặc xóa Diary không tự sửa bản Snapshot đã chèn vào Photobook.

## 4.7. Các bất biến dữ liệu

- Không xóa ảnh gốc chỉ vì xóa trang hoặc photobook.
- Không tự sửa nhật ký gốc khi người dùng sửa snapshot trong photobook.
- Không sửa Publication đã chốt chỉ vì Draft thay đổi.
- Không đưa nội dung không được phép vào xuất bản, PDF, thumbnail, tìm kiếm hoặc lịch sử mà người đang truy cập không có quyền.
- Sau khi các thao tác concurrent được xác nhận, các phiên phải hội tụ cùng kết quả hợp lệ của nội dung được phép nhìn thấy.
- Thứ tự trang không làm thay đổi danh tính trang, comment hoặc liên kết.

---
# 5. Sitemap và đặc tả 17 màn hình

## 5.1. Sơ đồ điều hướng

```text
Our Space / Home
└── Photobook & Diary
    ├── Photobooks [PB-01 Library]
    │   ├── Create [PB-02]
    │   │   └── Book Overview [PB-03]
    │   └── Book Overview [PB-03]
    │       ├── Reader [PB-04]
    │       ├── Pages [PB-05]
    │       ├── Simple Editor [PB-06]
    │       ├── Advanced Editor [PB-07]
    │       ├── Template Library [PB-08]
    │       ├── Asset Picker [PB-09]
    │       ├── Collaboration Panel [PB-10]
    │       ├── Version History [PB-11]
    │       ├── Share & Permissions [PB-12]
    │       └── Publish & Export [PB-13]
    └── Diary [DI-01 Timeline]
        ├── New / Edit [DI-02]
        └── Detail [DI-03]
            └── Add to Photobook [DI-04]
```

Một số mục (PB-08 đến PB-13, DI-04) có thể là modal/drawer/panel. **Mã màn hình biểu thị trách nhiệm chức năng**, không yêu cầu route URL riêng.

## 5.2. Các trạng thái UI dùng chung cho mọi màn hình

- **Loading:** biểu thị tải dữ liệu, không hiển thị nhầm trạng thái rỗng.
- **Empty:** giải thích vì sao chưa có dữ liệu, hướng dẫn hành động đầu tiên nếu có quyền.
- **Error:** thông báo dễ hiểu, có Retry nếu lỗi tạm thời.
- **Forbidden:** không lộ nội dung hoặc metadata nhạy cảm.
- **Offline/Unsynced:** rõ trạng thái kết nối và dữ liệu chưa được xác nhận.
- **Success:** hiển thị phản hồi thao tác tạo/chỉnh/xóa/phân quyền.
- **Confirmation:** các thao tác xóa, thay layout nguy hiểm, restore và publish phải có xác nhận khi rủi ro mất/thay nội dung lớn.
- **Responsive:** cùng nghiệp vụ trên desktop/mobile, có thể dùng panel/drawer và thu gọn toolbar.

## 5.3. PB-01 — Photobook Library

**Mục tiêu:** khám phá, tìm, tạo và quản lý tất cả sách mà người dùng có quyền.

**Đầu vào:** danh sách sách được phép đọc, quyền người dùng, trạng thái sách.

**Vùng hiển thị:** heading, nút `Create New`, search, bộ lọc `All / My Books / Shared With Me / Draft / Published / Archived`, sắp xếp theo lần sửa/tạo/tên, danh sách cards.

**Book card:** bìa, title, mô tả ngắn, chủ sở hữu, số trang được phép đọc, trạng thái, thời điểm cập nhật, dấu hiệu có người cộng tác (nếu được xem), menu ngữ cảnh.

**Hành động:** mở Overview/Reader, Edit nếu đủ quyền, Duplicate, Share, Archive, Move to Trash. Duplicate tạo sách mới, không sao chép quyền của sách gốc một cách âm thầm, mặc định Private.

**Quy tắc:**

- Không hiển thị sách ngoài phạm vi quyền.
- Tìm kiếm chỉ trên danh mục mà người dùng được phép truy cập.
- Các thao tác chỉ có Owner hoặc quyền tương ứng mới được hiện và thực thi.
- Sách có Draft và Published phải thể hiện rõ người dùng đang mở bản nào.
- Không có sách: CTA `Create your first Photobook`.

**Desktop:** grid cards, filter/search đồng thời. **Mobile:** cards một hoặc hai cột tùy màn hình, bộ lọc dạng panel, nút tạo dễ chạm.

## 5.4. PB-02 — Create Photobook

**Mục tiêu:** hoàn thành việc tạo cuốn mới qua tối đa ba nhóm nhập liệu dễ hiểu.

1. **Thông tin:** title bắt buộc, description tùy chọn, cover ảnh từ M02 hoặc bìa mặc định.
2. **Thiết kế:** orientation `Portrait/Landscape`, theme, template hoặc blank page.
3. **Riêng tư:** mặc định `Private`; nếu chủ động chia sẻ thì chọn tài khoản còn lại và vai trò.

**Nút:** Back, Next, Create Book, Cancel.

**Validation:** title không rỗng, orientation hợp lệ, media hợp lệ và có quyền, permission chỉ nhận account được phép, không chấp nhận thao tác tạo trùng do gửi yêu cầu lặp.

**Kết quả:** tạo book `Draft`, owner là tài khoản tạo, có trang khởi đầu theo lựa chọn, hiển thị trạng thái lưu thành công, chuyển Book Overview hoặc Editor theo thiết kế UX nhất quán.

**Ngoại lệ:** lỗi tạo sách không để lại bản ghi hỏng hiển thị như sách hợp lệ. Khi thao tác có thể khôi phục, bảo toàn thông tin form đã nhập.

## 5.5. PB-03 — Book Overview

**Mục tiêu:** màn hình trung tâm của một cuốn sách.

**Thông tin:** cover, title, description, orientation, theme, owner/collaborators, trạng thái Published/Draft/Archived, ngày tạo và cập nhật, số trang, phiên bản công bố hiện tại, hoạt động gần đây khi có quyền.

**Hành động:** Read Published, Preview Draft, Edit, Manage Pages, Share, Version History, Publish, Export PDF, Archive, Restore hoặc Trash tùy trạng thái/quyền.

**Quy tắc:**

- Viewer/Commenter không nhìn thấy Draft qua Overview.
- Khi chỉ có Draft, người có quyền xem Published nhưng sách chưa Published sẽ được thông báo phù hợp, không lộ nội dung bản nháp.
- Không tự động mở các trang private có ngoại lệ đối với tài khoản thiếu quyền.
- Thao tác Publish và Delete phải xác nhận.

## 5.6. PB-04 — Photobook Reader

**Mục tiêu:** đọc sách như một photobook thực, ưu tiên cảm xúc và độ trung thực của bố cục.

**Vùng chính:** bìa và trang, Previous/Next, lựa chọn page-flip hoặc chuyển đơn giản, page indicator, thumbnail navigation, fullscreen, zoom, nút về Overview, nút mở Editor nếu đủ quyền.

**Chế độ:**

- `Published Reader`: mặc định cho người có quyền xem bản công bố.
- `Draft Preview`: chỉ Editor/Owner hoặc người được cấp quyền xem bản nháp theo chính sách.
- `Two-page spread`: khi đủ diện tích desktop/tablet.
- `Single-page`: mặc định cho màn hình nhỏ, có thể thu phóng mà vẫn giữ tỉ lệ thiết kế.

**Hành vi:** click/ấn Next, Previous, keyboard navigation thích hợp, swipe trên cảm ứng, lật trang với animation được bật, fallback transition đơn giản khi không phù hợp, hỗ trợ giảm chuyển động. Nội dung văn bản dài không được cắt mất không thông báo. Nếu trang thiếu ảnh vì quyền hoặc tài nguyên lỗi, hiển thị placeholder được kiểm soát thay vì lỗi trắng.

**Quy tắc privacy:** Nếu Page có ngoại lệ chỉ cho A xem, Reader của B **không** hiển thị nội dung, preview, thumbnail, PDF của trang đó. Chính sách đánh số và chỉ báo số trang phải nhất quán với tập trang được phép xem. Không suy đoán nội dung ẩn thông qua tìm kiếm hoặc menu.

**Bình luận:** hiển thị/tạo theo quyền qua chức năng M09. Nếu M09 chưa được tích hợp, Reader vẫn hoạt động và không hỏng trải nghiệm.

## 5.7. PB-05 — Page Manager

**Mục tiêu:** quản lý cấu trúc trang, không phụ thuộc thứ tự vật lý để định danh.

**Chức năng:** add blank/from template, duplicate page, delete page, reorder (drag-drop hoặc nút Move Up/Down trên mobile), page thumbnail, page title nội bộ, page permission override, open page in Editor, undo thao tác phù hợp.

**Quy tắc:**

- Mỗi trang có stable ID. Đổi thứ tự không làm sai comment, link hoặc content ID.
- Hai người cùng thêm trang phải giữ cả hai. Hệ thống giải quyết thứ tự một cách nhất quán.
- Nếu một người xóa trang đang được người kia sửa, cảnh báo và cho khả năng khôi phục.
- Duplicate page không tự cho phép xem các asset riêng tư ngoài quyền hợp lệ.
- Trang mới kế thừa quyền book trừ khi người có quyền chủ động đặt override.
- Không dùng thao tác kéo thả là cách duy nhất, cần điều khiển truy cập được bằng bàn phím/cảm ứng.

## 5.8. PB-06 — Simple Editor

**Mục tiêu:** sửa nhanh theo bố cục template, ít phải thao tác thiết kế.

**Giao diện:** thumbnail/page navigator, vùng xem trang, các slot ảnh/chữ, panel đổi template/theme, các công cụ Replace Photo, Edit Text, Change Style, Add Page, Preview, Undo/Redo, status save, presence, chuyển Advanced.

**Chức năng:**

- Chọn template, thay ảnh bằng Asset Picker, sửa văn bản slot.
- Chỉnh font/màu theo giới hạn hợp lý của template.
- Thêm trang, đổi thứ tự trang, xem trước, Auto-save, Live Collaboration.
- Chuyển sang Advanced không mất nội dung.

**An toàn khi chuyển từ Advanced về Simple:** mọi sticker, lớp ảnh, shape ngoài slot và bố cục nâng cao phải **được giữ nguyên và hiển thị**. Thành phần không thể chỉnh bằng Simple thì hiện trạng thái chỉ-đọc hoặc đề nghị chuyển Advanced. Không tự đưa các element lạ về vị trí mặc định.

**Thay template trang đã có nội dung:** mở preview, chỉ rõ nguy cơ overflow hoặc mất vị trí, cho phép Cancel. Không xóa element ngoài slot nếu chưa có xác nhận rõ ràng và cơ chế phục hồi.

## 5.9. PB-07 — Advanced Editor

**Mục tiêu:** công cụ sáng tạo tự do trên canvas.

**Các vùng UI:**

1. Top toolbar: title, back, undo/redo, trạng thái lưu, active collaborators, preview, Publish nếu có quyền.
2. Left tools: templates, photos, text, stickers, shapes, backgrounds.
3. Canvas: trang đang sửa, đường viền trang, zoom/pan, selection, resize/rotate handles, snap guides tùy chọn.
4. Right properties: thuộc tính theo object, vị trí/kích thước, typography, color, layer, lock, delete.
5. Bottom pages: thumbnail, add/duplicate/reorder, current page.

**Thao tác cốt lõi:** add/select/move/resize/rotate, edit/crop ảnh, text formatting, background, sticker, basic shape, copy/paste/duplicate/delete, bring front/back, lock/unlock, hide/show, zoom, undo/redo, collaboration, preview và chuyển Simple.

**Tương tác:** chỉ thao tác hợp lệ mới được cập nhật vào bản nháp. Tất cả điều khiển gây thay đổi phải có phản hồi. Lỗi đồng bộ được hiện rõ. Không tạo ghost element hoặc duplicate do retry.

**Mobile:** canvas pinch zoom và pan, chạm chọn, handle đủ lớn, panel công cụ dạng drawer/bottom sheet, thay vì buộc hiển thị đầy đủ sidebar desktop. Tương tác pan/move đối tượng phải phân biệt được.

## 5.10. PB-08 — Template Library

**Mục tiêu:** chọn mẫu trang/bìa và preview trước khi áp dụng.

**Thông tin:** thumbnail, tên, orientation, nhóm phong cách, các slot, preview cỡ lớn, tùy chọn Blank.

**Hành động:** chọn, áp dụng trang mới, xem trước việc đổi template trang hiện tại.

**Quy tắc:** tối thiểu 8 template dùng được, mục tiêu 8–12. Mẫu không tương thích orientation phải hiển thị hạn chế hoặc hướng dẫn chuyển cách dùng. Không xóa nội dung đang có âm thầm. Đảm bảo thay template không phá Shared Page đang được người kia sửa mà không phối hợp.

## 5.11. PB-09 — Asset Picker

**Mục tiêu:** chọn nội dung được quyền truy cập và sử dụng để chèn vào trang.

**Nguồn P0:** Media Library M02, các ảnh đã chọn trong Diary nếu người dùng có quyền, nguồn media đã gắn với sách/trang. Nguồn từ Place/Trip/Event được thêm nếu các module đó cung cấp hợp đồng dữ liệu tương thích.

**Chức năng:** browse album, tìm/lọc ảnh, chọn một/nhiều, preview, thêm vào trang, upload qua chức năng M02 nếu được hỗ trợ.

**Quy tắc:**

- Không liệt kê nội dung private của người còn lại nếu thiếu quyền.
- Khi nguồn private được đưa vào sách shared, hiển thị cảnh báo rõ phạm vi người khác sẽ xem được phần **đã đưa vào sách**, yêu cầu xác nhận.
- Phân biệt `tham chiếu nguồn` với `bản sử dụng trong sách` về quyền và vòng đời. Phải có cách duy trì hoặc báo lỗi có kiểm soát nếu asset gốc bị xóa/thu hồi.
- Không tải bản gốc lặp lại chỉ để hiển thị nhiều nơi nếu cùng một nguồn, trừ khi việc bảo vệ quyền/đóng gói xuất bản yêu cầu một bản có vòng đời độc lập.

## 5.12. PB-10 — Collaboration Panel

**Mục tiêu:** cung cấp nhận biết và điều khiển phiên cộng tác.

**Hiển thị:** hai tài khoản/phiên đang online, vai trò, trang đang xem, trạng thái kết nối, đối tượng đang chọn nếu phù hợp, thay đổi gần đây và cảnh báo xung đột. Một tài khoản có thể có nhiều session.

**Quy tắc:**

- Một session là một tab/thiết bị, không nhất thiết là người dùng duy nhất.
- Presence có thể mất chính xác trong chốc lát khi mất mạng và phải được dọn trạng thái theo phiên.
- Presence không làm lộ thumbnail hay hoạt động của trang private.
- Không coi "online" là bằng chứng thay đổi đã lưu.

## 5.13. PB-11 — Version History

**Mục tiêu:** xem lại các mốc phiên bản và phục hồi có kiểm soát.

**Thông tin:** thời điểm, người tạo, lý do (tự động/khôi phục/xuất bản), mô tả thay đổi, preview nội dung theo quyền.

**Hành động:** view revision, compare khả thi, restore có xác nhận, quay lại Editor.

**Quy tắc:** restore tạo revision mới, không xóa lịch sử. Nếu có phiên cộng tác đang hoạt động, cảnh báo tác động và phối hợp tránh ghi đè. Version History là lớp bổ sung cho Auto-save chứ không thay thế backup.

## 5.14. PB-12 — Share & Permissions

**Mục tiêu:** phân quyền đọc/sửa/xuất bản theo sách, trang và Diary.

**Vùng chính:** trạng thái Private/Shared, owner, danh sách account được cấp quyền, lựa chọn Viewer/Commenter/Editor, quyền Publish riêng, các ngoại lệ cấp trang, lịch sử thay đổi quyền.

**Hành động:** grant, revoke, đổi vai trò, cấp/thu quyền Publish, xem effective access.

**Quy tắc:**

- Sách mới luôn Private, không tự cấp share dù hai user cùng Our Space.
- Chỉ định người dùng trong Our Space, không tạo public URL hay guest token V1.0.
- Permission enforcement phải có hiệu lực trên request và phiên đang mở, không chỉ khi reload.
- Page override kế thừa book mặc định. Owner được truy cập và quản lý mọi trang trong cuốn của mình.
- Khi thu hồi quyền, tác vụ chưa đồng bộ của người bị thu hồi không tự động được áp dụng sau đó.

## 5.15. PB-13 — Publish & Export

**Mục tiêu:** công bố phiên bản ổn định và tạo PDF.

**Vùng chính:** preview, xác nhận tên/phiên bản, trạng thái đồng bộ, cảnh báo font/ảnh/overflow, nút Publish, chọn Export PDF từ Published hoặc Draft nếu người dùng có quyền.

**Publish:** kiểm tra quyền, chờ tất cả thao tác liên quan được xác nhận/giải quyết, chốt một snapshot nhất quán, tạo Publication bất biến, thông báo người đang cộng tác. Không công bố tự động vì nhấn nút khi dữ liệu còn lỗi.

**PDF Export P0:**

- Chọn ấn bản Published hoặc Draft hợp lệ theo quyền.
- Giữ khổ dọc/ngang, thứ tự trang, background, ảnh, chữ và đồ trang trí ở mức nhất quán với Reader.
- Có cảnh báo ảnh chất lượng thấp, font không tương thích, nội dung tràn khung.
- PDF chỉ gồm nội dung người yêu cầu được phép xuất. Phải xác định rõ chính sách bỏ qua trang có override Private.
- Trạng thái export: preparing/processing/completed/failed, có retry phù hợp và tải kết quả khi thành công.
- Không coi PDF đã tải về là còn chịu cơ chế thu hồi quyền. Phải nhắc người dùng về bản sao đã xuất.
- Yêu cầu V1.0: PDF có thể lưu/đọc/in thông thường. Không cam kết bleed/CMYK/chuẩn prepress của nhà in thương mại.

## 5.16. DI-01 — Diary Timeline

**Mục tiêu:** xem các bài nhật ký theo ngày sự kiện.

**Chức năng:** search, lọc theo ngày/tháng/năm, tác giả, mood, tag, place, trạng thái và quyền; danh sách card tiêu đề/ngày/ảnh/preview; tạo nhật ký mới.

**Quy tắc:** sắp xếp theo Event Date (có tùy chọn Created Date). Một bài được viết hôm nay về năm cũ hiển thị tại năm cũ. Nội dung Private không xuất hiện trong kết quả người không có quyền.

## 5.17. DI-02 — Diary Editor

**Mục tiêu:** ghi nhanh hoặc viết dài một câu chuyện, độc lập với canvas Photobook.

**Thông tin:** event date bắt buộc, title tùy chọn, body, media, mood, tags, place/event/trip link, visibility mặc định Private.

**Chức năng:** rich text cơ bản, thêm/xóa ảnh, lưu bản nháp, xuất bản, xem trước, sửa bài, auto-save, cảnh báo dữ liệu chưa lưu, bảo vệ xung đột khi nhiều phiên cùng sửa.

**Quy tắc:** Diary **không cần** real-time cùng gõ V1.0. Khi hai phiên sửa trùng bài, hệ thống không tự lưu đè mà phải cảnh báo hoặc cho giải quyết xung đột. Bài phải có ít nhất body hợp lệ hoặc media, không cho xuất bản rỗng.

**Mobile:** ưu tiên thao tác viết nhanh, date picker, chọn ảnh từ điện thoại qua M02, lưu bản nháp ít bước.

## 5.18. DI-03 — Diary Detail

**Mục tiêu:** đọc, chia sẻ và tái sử dụng nhật ký.

**Thông tin:** nội dung, event date, authored/updated, media gallery, tác giả, địa điểm, liên kết, comment (M09).

**Hành động:** Edit, Add to Photobook, Share, Archive, Move to Trash, mở media lớn.

**Quy tắc:** thao tác tùy quyền, trang cá nhân Private không xuất hiện khi truy cập link trực tiếp trái phép. Chỉ thông tin cho phép mới hiển thị qua search/preview.

## 5.19. DI-04 — Link to Photobook

**Mục tiêu:** đưa nội dung Diary vào sách một cách có kiểm soát.

**Luồng:** từ Diary Detail chọn `Add to Photobook` → chọn sách có quyền Editor → chọn trang hiện tại/tạo trang mới → preview cách chèn → xác nhận snapshot → mở Editor.

**P0:** `Copy as Snapshot` mặc định. Sao chép phần nội dung người dùng chọn theo thời điểm chèn. Nội dung trong sách có thể sửa riêng. Giữ provenance link tới Diary nếu còn quyền để hiển thị nguồn phù hợp.

**Quy tắc:** khi Diary Private đưa vào book Shared phải có xác nhận rằng **nội dung được chèn** sẽ nhìn thấy theo quyền book/page, không tự chia sẻ toàn bộ Diary gốc. Nếu người dùng không có quyền dùng nội dung hoặc sửa sách đích, từ chối thao tác. Nếu Diary gốc sau đó bị sửa/xóa, snapshot trong sách không bị chỉnh/xóa dây chuyền.

---

# 6. Chi tiết Photobook, Simple và Advanced Editor

## 6.1. Vòng đời từ tạo đến đọc

`Create Draft → Design/Edit → Save/Sync → Preview → Publish Snapshot → Read → Create Revision Draft → Publish New Snapshot`

Một cuốn sách có thể tiếp tục phát triển trong nhiều năm. Các ấn bản cũ cần được nhận diện rõ ràng và có khả năng xem lại tùy quyền.

## 6.2. Thiết kế trang và orientation

- Hai orientation: **Portrait** và **Landscape**.
- Khi tạo sách, chọn orientation cho bố cục sách. Hệ thống chọn giá trị mặc định rõ ràng và cho phép thay đổi theo một quy trình xác nhận khi việc đổi khổ ảnh hưởng layout.
- Tỉ lệ thiết kế của trang không thay đổi do kích thước viewport. Reader/Editor scale viewport, không tính lại vị trí ảnh/chữ theo màn hình làm đổi ý đồ thiết kế.
- Khi xuất PDF, tỉ lệ trang tương ứng với thiết kế.
- Vùng biên an toàn và cảnh báo khi text/ảnh nằm quá sát mép phục vụ PDF/đọc, nhưng không cưỡng ép layout của Advanced Editor nếu người dùng cố ý thiết kế tràn khung.
- Nếu thay khổ sau khi có nhiều trang, phải preview tác động và xác nhận, không auto-crop mất nội dung.

## 6.3. Template khởi đầu (8–12 mẫu)

Danh mục gợi ý để đảm bảo sự đa dạng, không bắt buộc giữ đúng tên marketing:

1. Blank Canvas — trang trắng.
2. One Hero Photo — một ảnh lớn và caption.
3. Two Polaroids — hai ảnh dạng film.
4. Memory Collage — nhiều ảnh không đều.
5. Diary & Photo — văn bản dài kèm ảnh.
6. Minimal Magazine — ảnh + typography hiện đại.
7. Travel Memory — ảnh, địa điểm và ghi chú chuyến đi.
8. Letter to You — thư tay/giấy note.
9. Four-Photo Grid — lưới bốn ảnh.
10. Celebration — sự kiện/cột mốc.

**Mức nghiệm thu P0:** tối thiểu 8 template thực sự dùng được, có preview, có ít nhất các hướng bố cục ảnh nổi bật, ảnh ghép, nhật ký và trang trí. Định hướng 10 mẫu như danh sách trên. Tất cả template phải tuân thủ quyền, lưu, undo, Reader và export PDF.

## 6.4. Loại thành phần cần hỗ trợ

| Loại | Thêm | Sửa nội dung | Di chuyển/resize/rotate | Properties | Ghi chú |
|---|---|---|---|---|---|
| Image | Có | Replace/crop | Có | opacity cơ bản, border/frame | tham chiếu quyền asset |
| Text | Có | Gõ, style | Có | font, size, color, alignment | bảo vệ concurrent text |
| Sticker | Có | Thay chọn | Có | size, rotation, layer | thư viện cơ bản |
| Shape | Có | Kiểu/hình | Có | fill, border, opacity | hình cơ bản |
| Background | Có | Thay màu/ảnh/mẫu | Theo thuộc tính nền | background style | không che nút điều khiển |
| Video player | Không P0 | — | — | — | P1 theo D04 |
| Background music | Không P0 | — | — | — | P1 theo D03 |

## 6.5. Advanced Editor: bộ công cụ cốt lõi

- **Selection:** chọn một phần tử, bỏ chọn, thấy bounding box và toolbar ngữ cảnh.
- **Move:** kéo thả bằng chuột/chạm, có phản hồi về vị trí. Không kéo khi element Locked.
- **Resize/Rotate:** đổi kích thước, xoay. Image có thể crop trong khung theo thao tác riêng.
- **Typography:** nhập chữ, đổi font/size/color, căn lề, xử lý overflow.
- **Shapes & decoration:** thêm sticker, shape, background, border/frame cơ bản.
- **Layer order:** bring to front/back, forward/backward, hide/show, lock/unlock.
- **Edit actions:** copy/paste, duplicate, delete, undo/redo.
- **Canvas navigation:** zoom, pan, fit page, chọn trang, page thumbnails.
- **Feedback:** trạng thái saving/saved/conflict, presence/cursors/selections, quyền hiện tại.

## 6.6. Simple Editor: nguyên tắc không phá hủy nội dung

1. Trang được xây theo template với những slot ảnh/chữ định nghĩa trước.
2. Người dùng chọn slot để replace/edit, không phải canh toàn bộ lớp bằng tay.
3. Nếu trang có element từ Advanced mà Simple không hỗ trợ, Simple hiển thị element đó ở đúng nơi, chỉ-đọc với thành phần ấy.
4. Chuyển lại Advanced không tạo bản sao, không đổi ID element và không xóa thành phần.
5. Chuyển template với trang đã có nội dung là hành động có nguy cơ, phải preview, xác nhận, có undo/version recover.

## 6.7. Reader và xuất PDF

- Trang bìa được đọc đầu tiên, trang sau theo thứ tự xác nhận.
- Dùng lật trang làm lựa chọn trải nghiệm chính khi thiết bị phù hợp, có swipe và chuyển đơn giản.
- Trên mobile ưu tiên single page, hỗ trợ pinch/zoom hoặc hành vi tương đương để đọc chữ nhỏ.
- Đảm bảo PDF không bỏ qua text/ảnh/sticker do khác cơ chế hiển thị, trừ phần bị cấm xem bởi permission.
- PDF có thể là file nhiều trang, phản ánh đúng thứ tự, orientation và độ rõ ảnh trong giới hạn chất lượng asset.
- Các tài nguyên ngoài quyền không được âm thầm đưa vào file export.

---

# 7. Chi tiết Diary và gắn nội dung vào Photobook

## 7.1. Diary là bài viết gốc

Diary ưu tiên nhập thông tin nhanh, gồm ngày sự kiện, văn bản, ảnh, mood, tag và liên kết. Diary không yêu cầu người dùng dàn trang bằng canvas. Diary có thể chỉ có ảnh và ngày, hoặc chỉ có văn bản và ngày, miễn dữ liệu hợp lệ.

## 7.2. Hai loại thời gian

- `Event Date`: ngày xảy ra kỷ niệm, là cơ sở hiển thị trên Diary Timeline và sau này Our Timeline/On This Day.
- `Created/Updated At`: thời điểm hệ thống ghi nhận tạo và sửa bài, dùng cho lịch sử và sắp xếp theo sửa gần nhất.

Người dùng có thể tạo hôm nay bài kể lại kỷ niệm năm trước. Không âm thầm tự đổi Event Date khi chỉnh sửa bài.

## 7.3. Tạo và chỉnh nhật ký

- Tạo Draft với dữ liệu tối thiểu hợp lệ.
- Thêm ảnh qua M02, viết nội dung, gắn tag/mood/place nếu muốn.
- Auto-save theo phiên bản có xác nhận.
- Publish Diary để hiển thị theo quyền đã cấp.
- Khi nhiều thiết bị cùng sửa cùng một Diary, phát hiện tình huống version cũ và không ghi đè im lặng. Realtime co-typing Diary nằm ngoài P0.

## 7.4. Quy tắc Snapshot mặc định

- Người dùng chọn một Diary hợp lệ và cuốn sách có quyền Editor.
- Hiển thị rõ những phần nội dung chuẩn bị chèn và quyền xem ở trang đích.
- Tạo các element mới trong book dựa trên snapshot tại thời điểm chèn.
- Sau khi chèn, sửa chữ/crop ảnh trong book không thay đổi Diary gốc.
- Sửa hoặc xóa Diary gốc không tự xóa các element đã chèn.
- Có thể giữ liên kết nguồn để điều hướng nếu người xem vẫn có quyền vào Diary gốc.
- Nếu nguồn Private chèn vào đích Shared, xác nhận quyền cụ thể. Không tự mở quyền vào Diary gốc.

## 7.5. Khi chèn nội dung khác quyền

Nội dung sao chép vào một trang dùng quyền của trang/sách đích. UI phải hiển thị người nào có thể xem nó **trước khi người dùng xác nhận**. Một liên kết tham khảo tới nội dung Private không được trở thành đường vòng để Viewer xem nguyên bản nguồn.

---
# 8. Cộng tác thời gian thực, lưu và phiên bản

## 8.1. Định nghĩa thành công của realtime trong M01

Hai tài khoản có quyền Editor được phép đồng thời mở cùng photobook, cùng trang và các thành phần khác nhau. Hệ thống phát thay đổi cho các phiên còn lại gần như tức thời, hợp nhất thay đổi hợp lệ, xử lý cạnh tranh trên cùng đối tượng, lưu bền vững và không để một phiên ghi đè toàn bộ bản mới của phiên khác.

**Yêu cầu tối thiểu:** presence, trang đang xem, live selection/cursor theo tính phù hợp, live object changes, collaborative text, page operations, trạng thái lưu, reconnect, undo an toàn, permission revocation và version recovery.

## 8.2. Phạm vi cộng tác

| Loại thao tác | Cộng tác trong V1.0 | Yêu cầu |
|---|---|---|
| Hai người ở hai trang khác nhau | Có | Đồng bộ cả danh sách trang và thay đổi tương ứng |
| Hai người cùng một trang, đối tượng khác nhau | Có | Cả hai thay đổi được giữ |
| Hai người cùng một text box | Có | Cùng nhập, không mất ký tự hợp lệ |
| Hai người đổi thuộc tính khác nhau của một ảnh | Có | Hợp nhất khi thuộc tính tương thích |
| Hai người cùng kéo cùng một ảnh | Có điều phối | Một phiên thao tác chủ động trên đối tượng, tránh tranh giành vị trí |
| Hai người thêm/sắp xếp trang đồng thời | Có | Cả hai trang và thứ tự hợp lệ được giữ |
| Hai người xem cùng sách trên nhiều thiết bị | Có | Mỗi phiên được định danh độc lập |
| Cộng tác gõ cùng một Diary | Không P0 | Bảo vệ xung đột thay vì realtime typing |

## 8.3. Presence và session

- Nhận diện phiên theo **tài khoản + phiên tab/thiết bị**, không chỉ tài khoản.
- Hiển thị avatar/tên người đang tham gia và trang hiện tại theo quyền.
- Nếu cùng người mở hai tab, phân biệt được hai phiên đang chỉnh sửa.
- Presence không đồng nghĩa người dùng đang gõ, trạng thái online có thể trễ khi mất mạng.
- Không hiển thị nội dung, hình thumbnail, vị trí con trỏ của các trang mà viewer không được phép xem.
- Mất kết nối: hiển thị trạng thái bị gián đoạn và cập nhật presence khi kết nối lại.

## 8.4. Đồng bộ thao tác và quy tắc hội tụ

**Bất biến RT-INV-01:** Thay đổi trên các đối tượng độc lập không được bị ghi đè chỉ vì thứ tự đến khác nhau.

**RT-INV-02:** Cùng chỉnh sửa text box không được mất đoạn chữ đã được chấp nhận do cập nhật toàn chuỗi đến sau.

**RT-INV-03:** Không sử dụng **last-write-wins của toàn bộ Page** như cách duy nhất xử lý concurrency.

**RT-INV-04:** Khi hai cập nhật không thể hợp nhất mà vẫn đúng ý nghĩa, hệ thống phải dùng cơ chế điều phối hoặc yêu cầu xử lý xung đột, không chọn một cách âm thầm mà gây mất nội dung.

**RT-INV-05:** Khi tất cả thay đổi hợp lệ đã xác nhận và đồng bộ, những phiên có cùng quyền phải thấy cùng trạng thái trang và thứ tự trang.

**RT-INV-06:** Mọi thay đổi được áp dụng phải gắn được với người/phiên tạo và thông tin cần thiết phục vụ lịch sử/Undo.

**RT-INV-07:** Retry do mạng không tạo object/page trùng ngoài ý muốn.

## 8.5. Ma trận xung đột

| Kịch bản | Kết quả cần đạt | Cách tương tác đề xuất |
|---|---|---|
| A thêm ảnh X, B thêm text Y | Giữ X và Y | Đồng bộ độc lập |
| A sửa caption X, B sửa caption Y | Giữ hai đoạn | Đồng bộ độc lập |
| A và B cùng gõ vào một text box | Giữ các ký tự hợp lệ và thứ tự phù hợp | Hiển thị dấu vị trí soạn thảo của hai người |
| A kéo ảnh X, B kéo ảnh X | Không giật liên tục hoặc ghi đè lén | Điều phối quyền thao tác tạm thời ở object |
| A đổi màu X, B resize X | Giữ cả hai khi tương thích | Hợp nhất theo thuộc tính |
| A xóa X, B đang edit X | Không mất yên lặng công việc B | Cảnh báo, xử lý thao tác đang diễn ra, có khôi phục |
| A thay template, B đang edit trang | Không reset dữ liệu B | Preview, điều phối thay đổi lớn, xác nhận |
| A thêm page P, B thêm page Q | Giữ P, Q | Sắp thứ tự xác định và đồng bộ |
| A reorder P, B sửa P | P giữ nội dung của mình | ID độc lập với vị trí |
| A restore revision, B đang sửa | Không ghi đè thay đổi chưa xác nhận | Cảnh báo và phối hợp reset/revision |
| A bị thu hồi Editor, vẫn còn thao tác local | Không cho áp dụng thao tác trái quyền | Xóa khả năng edit, giữ cảnh báo/bản nháp cục bộ an toàn theo chính sách |

## 8.6. Auto-save và trạng thái lưu

| Trạng thái UI | Ý nghĩa nghiệp vụ | UI/điều kiện |
|---|---|---|
| `Editing/Unsaved` | Có thay đổi cục bộ chưa gửi/được xác nhận | Thể hiện đang chờ lưu |
| `Saving/Syncing` | Đang gửi hoặc đồng bộ thay đổi | Có chỉ báo tiến trình nhẹ |
| `Saved` | Tất cả thay đổi liên quan đã được hệ thống xác nhận lưu | Checkmark/trạng thái rõ |
| `Offline` | Không thể đồng bộ, có thể có thay đổi cục bộ | Cảnh báo mất mạng và không hứa đã lưu |
| `Conflict` | Có thao tác không thể hợp nhất an toàn | Giải thích và hướng dẫn chọn phương án |
| `Save Error` | Lưu thất bại không do offline đơn thuần | Retry/giữ bản thay đổi ở khả năng hỗ trợ |

**Quy tắc:** nút Publish và các thao tác tạo ấn bản không được sử dụng bản có pending changes mà người dùng không biết. Nếu trạng thái là Offline/Conflict/Save Error, phải chặn hoặc hoãn thao tác phụ thuộc và giải thích lý do.

## 8.7. Mất mạng, đóng tab và reconnect

1. Nếu kết nối mất, thông báo ngay khi hệ thống xác định sự cố.
2. Bảo vệ thao tác chưa gửi ở mức thiết bị cho phép, tuyệt đối không hiện "Saved" khi chưa xác nhận.
3. Không đóng băng phiên của người còn lại chỉ vì một bên mất mạng.
4. Khi reconnect, lấy trạng thái cập nhật từ phiên hợp lệ khác và hợp nhất pending changes.
5. Nếu không thể hợp nhất, cung cấp UI giải quyết xung đột hoặc giữ bản sao cần khôi phục, không hủy nội dung âm thầm.
6. Thao tác gửi lại phải kiểm tra quyền hiện tại.
7. Nếu người dùng định đóng tab khi vẫn có dữ liệu chưa được xác nhận an toàn, cảnh báo theo khả năng trình duyệt. Nếu đã lưu, không làm phiền không cần thiết.
8. Không cam kết chỉnh sửa ngoại tuyến hoàn chỉnh trên mọi trình duyệt trong V1.0. Cam kết bảo vệ/giải thích trạng thái trong các tình huống được hỗ trợ.

## 8.8. Undo/Redo cộng tác

- Undo trong phiên A áp dụng với thao tác của A, không phải undo gần nhất trên toàn hệ thống.
- Nếu thao tác của A đã được B chỉnh tiếp khiến việc đảo ngược không còn an toàn, hệ thống từ chối Undo trực tiếp và giải thích hoặc cung cấp cách giải quyết.
- Undo/Redo không được âm thầm xóa thay đổi hợp lệ của người kia.
- Việc A Undo phải được đồng bộ sang B và được ghi nhận như thay đổi hợp lệ.
- Version History là cơ chế khôi phục mốc, **không thay thế** personal undo thao tác ngắn hạn.

## 8.9. Version History

**Các loại mốc:** phiên bản được tạo tự động theo chính sách, khi Publish, trước/sau restore, hoặc mốc do người có quyền chủ động lưu (nếu UI có tùy chọn).

**Metadata tối thiểu:** định danh, sách, thời điểm, người/tác nhân, trạng thái nội dung, ghi chú loại mốc.

**Restore:** preview → cảnh báo ảnh hưởng → kiểm tra quyền và active collaborators → xác nhận → tạo revision mới từ mốc đã chọn → broadcast thay đổi → người dùng có thể khôi phục tiếp nếu cần.

Không cho thao tác restore xóa vĩnh viễn lịch sử cũ hoặc vượt qua quyền cấp trang.

## 8.10. Publish đồng thời

1. Người có quyền Publish chọn Preview/Publish.
2. Kiểm tra quyền ngay tại thời điểm hành động.
3. Xác định trạng thái đã lưu đồng bộ của phạm vi nội dung xuất bản.
4. Nếu còn pending/conflict, thông báo và không tạo snapshot không nhất quán.
5. Khi đã sẵn sàng, tạo Publication từ một trạng thái xác định, chốt metadata và thứ tự trang.
6. Thông báo tới các phiên Editor khác.
7. Người kia được phép sửa Draft/Revision Draft tiếp theo, không tự đổi Publication vừa tạo.
8. Viewer tiếp tục xem bản Published ổn định, không thấy thao tác bản nháp.

**Không bắt buộc ngừng toàn bộ Editor trong suốt quá trình xuất bản**, nhưng thao tác publish phải có snapshot nhất quán và quy tắc rõ về các thay đổi đến ngay trước/sau mốc chốt.

## 8.11. Hiệu năng đồng bộ mục tiêu

- **Mục tiêu nghiệm thu ban đầu:** với thao tác thông thường, ít nhất 95% thay đổi được bên kia nhìn thấy trong vòng **2 giây** khi hai thiết bị có kết nối ổn định trên môi trường thử nghiệm đã xác định.
- Mục tiêu này cần được đo thực tế trong kế hoạch QA với mạng/thiết bị/tải rõ ràng. Không áp dụng máy móc cho upload file dung lượng lớn hoặc thiết bị mất mạng.
- Tiêu chí **không mất cập nhật đã xác nhận** và **hội tụ trạng thái cuối** là bắt buộc, không thể thay bằng việc hiển thị nhanh nhưng dữ liệu sai.

---

# 9. Quyền truy cập và riêng tư

## 9.1. Ma trận quyền đề xuất đã được chốt làm cơ sở V1.0

| Thao tác | Owner | Editor | Commenter | Viewer |
|---|---|---|---|---|
| Xem Published theo phạm vi được chia sẻ | ✓ | ✓ | ✓ | ✓ |
| Xem Draft của sách được cộng tác | ✓ | ✓ | — | — |
| Thêm/sửa object và Page | ✓ | ✓ | — | — |
| Realtime collaboration trong Editor | ✓ | ✓ | — | — |
| Bình luận qua M09 | ✓ | ✓ | ✓ | — |
| Publish | ✓ | Chỉ khi có grant riêng | — | — |
| Đổi quyền/cấp quyền | ✓ | Chỉ khi được ủy quyền cụ thể | — | — |
| Archive | ✓ | Theo grant riêng | — | — |
| Xóa mềm sách | ✓ | Theo grant riêng nếu đã thiết kế | — | — |
| Xóa vĩnh viễn | ✓, xác nhận riêng | — | — | — |

Nếu một Page có override quyền riêng, việc được xem sách không tự động đồng nghĩa được xem Page đó. `Owner` vẫn là người quản lý mọi trang của sách do mình sở hữu. Quyền Publish riêng không mặc định được gán cho Editor khi trao quyền sửa.

## 9.2. Kế thừa quyền

- Book mới: Private, Owner là người tạo.
- Khi chia sẻ Book: quyền mặc định có hiệu lực trên các trang **không có override**.
- Page override: xác định người được xem/sửa trang và có hiệu lực cao hơn grant kế thừa đối với trang đó, trừ quyền Owner.
- Diary: quyền riêng cấp bài, không mặc định phụ thuộc Photobook.
- Những thành phần nhỏ như sticker/text box không có quyền truy cập độc lập V1.0.

## 9.3. Trạng thái quyền trong phiên đang mở

- Người dùng thay đổi quyền: mọi thao tác sau thời điểm cập nhật quyền phải được kiểm tra bằng quyền hiện tại.
- Editor bị hạ xuống Viewer đang mở tab Edit: không thể tiếp tục lưu cập nhật hoặc xem Draft mới nếu không còn quyền.
- Nếu người dùng mất mạng rồi reconnect, pending changes vẫn cần kiểm tra lại quyền trước khi chấp nhận.
- Không để URL riêng, cache hiển thị, PDF, thumbnail, full-text search hoặc version history lộ nội dung vượt quyền.

## 9.4. Nội dung Private chèn vào sách Shared

Khi A chọn media/Diary nguồn Private để đưa vào Book Shared, UI hiển thị rõ:

- Nội dung gì sẽ được chèn.
- Sau khi chèn, những người có quyền của trang/sách đích sẽ xem được bản dùng trong sách.
- Nội dung gốc **không** tự động chuyển từ Private sang Shared.
- Người dùng phải xác nhận thao tác vượt ranh giới riêng tư.

**Quy tắc xuất bản:** Publication/PDF phải bảo đảm quyền sử dụng nội dung được chèn, tránh việc một tham chiếu ngầm làm lộ nguồn Private. Nếu quyền hoặc asset không còn hợp lệ trước khi xuất, chặn và yêu cầu khắc phục hoặc loại phần tử theo xác nhận, không xuất nội dung trái quyền.

## 9.5. Trang private trong sách shared

Ví dụ: Book có 10 Page, trang 5 chỉ Owner xem. Khi B (Viewer) mở sách, B chỉ thấy các Page hợp lệ, không có thumbnail hoặc nội dung của trang 5. Việc Reader sắp lại số trang hiển thị để trải nghiệm liền mạch là chấp nhận được. Bản PDF xuất bởi B cũng phải áp dụng cùng tập trang hợp lệ. Không hứa giữ số trang tuyệt đối giữa hai phiên có quyền khác nhau.

## 9.6. Không hỗ trợ guest/public V1.0

Không có public link, guest account, không tìm kiếm sách qua Internet, không chia sẻ với người thứ ba ngoài phạm vi hai tài khoản chính. PDF đã chủ động tải về là bản sao ngoài hệ thống, không thể thu hồi truy cập sau khi phát tán.

---

# 10. Use Cases và các luồng chính

Mỗi Use Case mô tả **tác nhân → điều kiện trước → luồng chính → ngoại lệ → kết quả**. Dùng cùng ID trong QA.

## UC-M01-01 — Tạo cuốn sách đầu tiên

**Actor:** Owner tương lai. **Precondition:** đăng nhập, có quyền tạo sách.

1. Mở PB-01 → Create New.
2. Nhập title, description, chọn cover hoặc để mặc định.
3. Chọn Portrait/Landscape và theme/template hoặc Blank.
4. Nhìn thấy visibility `Private` mặc định, có thể chủ động thay và cấp vai trò cho user còn lại.
5. Nhấn Create Book.
6. Hệ thống kiểm tra trường hợp lệ, tạo sách Draft và page khởi đầu.
7. Chuyển đến Overview/Editor, cho chỉnh sửa ngay.

**Ngoại lệ:** tên rỗng, asset không có quyền, mất kết nối, submit trùng, không có quyền tạo. UI giải thích đúng lỗi và không sinh hai bản sách do double click.

**Postcondition:** một book Draft hợp lệ xuất hiện trong Library, có thể mở lại.

## UC-M01-02 — Chỉnh sửa nhanh theo template

**Actor:** Owner/Editor. **Precondition:** có quyền edit Book/Page.

1. Mở PB-06 của một trang.
2. Chọn template hợp lệ.
3. Thay ảnh vào slot từ PB-09.
4. Gõ và định dạng đoạn text.
5. Chuyển Preview, trở lại Editor.
6. Thấy Saved sau khi thay đổi được xác nhận.

**Ngoại lệ:** media không tồn tại, sai quyền, template gây mất bố cục, save lỗi. Không xóa nguyên tố ngoài slot trong chế độ Simple.

**Postcondition:** trang có nội dung mới đã lưu, Reader/Preview thể hiện đúng.

## UC-M01-03 — Chỉnh sửa nâng cao

**Actor:** Owner/Editor.

1. Mở PB-07, chọn Page.
2. Thêm ảnh, text, sticker và shape.
3. Di chuyển, resize, rotate, crop, thay thuộc tính, layer.
4. Thực hiện undo/redo, zoom và chuyển Page.
5. Xem trước kết quả.
6. Đợi trạng thái Saved, thoát và mở lại.

**Ngoại lệ:** object locked, text overflow, quyền thay đổi, save thất bại, thiếu font, ảnh không load. Phải hiển thị trạng thái rõ và giữ nội dung hợp lệ.

**Postcondition:** layout và ID element vẫn nhất quán, nội dung còn sau reload.

## UC-M01-04 — Hai người cùng chỉnh hai đối tượng khác nhau

**Actors:** A/B có Edit.

1. A và B mở cùng Page 3.
2. Thấy presence của nhau.
3. A thêm image, B thêm text.
4. Hai client cập nhật và xác nhận trạng thái lưu.
5. A đóng tab, B tiếp tục edit.
6. A mở lại, thấy kết quả đã lưu của cả hai.

**Postcondition:** không mất text hoặc image.

## UC-M01-05 — Hai người cùng gõ trên một text box

**Actors:** A/B có Edit.

1. Cùng chọn một text box.
2. Cả hai nhập nội dung gần như đồng thời, ví dụ A gõ đầu câu, B gõ cuối câu.
3. Hệ thống đồng bộ ký tự/thao tác một cách hợp lệ.
4. A và B nhìn thấy một đoạn văn bản kết quả thống nhất.

**Ngoại lệ:** mất kết nối một bên, thao tác Undo, một bên xóa toàn bộ box. Không dùng ghi đè toàn chuỗi theo người lưu sau.

**Postcondition:** các ký tự đã được nhận hợp lệ không bị mất do cạnh tranh.

## UC-M01-06 — Cạnh tranh cùng object

**Actors:** A/B có Edit.

1. A kéo ảnh X.
2. B bắt đầu thao tác kéo ảnh X trong lúc A đang thao tác.
3. Hệ thống điều phối phiên thao tác đang hoạt động, tránh ảnh liên tục nhảy vị trí.
4. B nhận phản hồi về object đang được thao tác, có thể edit object khác.
5. Khi kết thúc, trạng thái mới đồng bộ.

**Ngoại lệ:** A ngắt kết nối giữa lúc thao tác, cơ chế điều phối phải được giải phóng/khôi phục hợp lý, không khóa vô hạn.

## UC-M01-07 — Mất mạng và kết nối lại

1. A/B đang cùng sửa Page 5.
2. A mất mạng giữa thao tác.
3. A thấy Offline, B tiếp tục làm việc.
4. A tiếp tục thao tác trong phạm vi cho phép, không được thông báo sai là Saved.
5. A reconnect, hệ thống lấy thay đổi mới từ B và cố hợp nhất thay đổi hợp lệ của A.
6. Nếu xung đột không thể giải quyết an toàn, UI đưa ra lựa chọn hoặc bản nháp có thể phục hồi.
7. Sau xác nhận, hai client hội tụ một kết quả.

**Postcondition:** không ghi đè toàn trang bằng dữ liệu offline cũ của A.

## UC-M01-08 — Chuyển Simple ⇄ Advanced

1. A mở trang từ Simple, tạo photo slot và text.
2. Chuyển Advanced, thêm sticker và thay layer.
3. Chuyển lại Simple.
4. Sticker vẫn đúng vị trí nhưng có thể chỉ-đọc.
5. Chuyển Advanced lần nữa, sticker vẫn chỉnh được.

**Postcondition:** không mất element, không tự thay đổi ID, thứ tự lớp hoặc bố cục do chuyển chế độ.

## UC-M01-09 — Viết Diary và đưa vào sách

1. A vào Diary Timeline → New.
2. Chọn Event Date, viết body, gắn media và lưu/publish.
3. Mở Diary Detail → Add to Photobook.
4. Chọn Book/Page có quyền, chọn snapshot.
5. Nếu Diary Private mà đích Shared, hiển thị cảnh báo và xác nhận phạm vi chia sẻ.
6. Tạo page elements từ snapshot, mở Editor.
7. A sửa chữ và crop ảnh trong sách.

**Postcondition:** Diary gốc không đổi. Snapshot tồn tại độc lập, chỉ người đủ quyền mới xem được.

## UC-M01-10 — Publish khi người kia đang edit

1. A Owner và B Editor đang mở Book.
2. A mở PB-13 → Publish.
3. Hệ thống kiểm tra quyền và tình trạng pending changes.
4. Nếu còn thao tác chưa lưu, không chốt bản thiếu dữ liệu, hiển thị thông báo.
5. Khi sẵn sàng, A xem trước và xác nhận.
6. Hệ thống chốt Publication nhất quán và thông báo B.
7. B tiếp tục sửa Revision Draft.
8. Viewer mở Reader và thấy bản Published ổn định.

**Postcondition:** ấn bản bất biến, không lộ Draft.

## UC-M01-11 — Thu hồi quyền giữa phiên

1. A Owner, B Editor đang mở Advanced.
2. A giảm quyền B thành Viewer.
3. B nhận trạng thái quyền mới.
4. B không thể tiếp tục edit/save, kể cả sau reconnect hoặc reload.
5. B chỉ đọc nội dung Published được phép.

**Postcondition:** mọi ghi mới trái quyền bị từ chối tại điểm tiếp nhận dữ liệu, không chỉ ẩn toolbar.

## UC-M01-12 — Version History và Restore

1. A mở PB-11, chọn mốc trước.
2. Preview, xem khác biệt và cảnh báo tác động tới Draft/current collaborators.
3. A xác nhận restore.
4. Hệ thống tạo revision mới từ snapshot cũ.
5. Các phiên cập nhật và người cộng tác được thông báo.
6. A có thể xem lại lịch sử trước khi restore.

**Postcondition:** không ghi đè phá hủy toàn bộ lịch sử, quyền được kiểm tra.

## UC-M01-13 — Export PDF

1. Người đủ quyền chọn PB-13 → Export PDF.
2. Chọn Published hoặc Draft được phép.
3. Hệ thống kiểm tra quyền theo Page và tình trạng nội dung.
4. Preview, cảnh báo ảnh độ phân giải thấp, font và overflow.
5. Xác nhận, hệ thống tạo PDF theo khổ Portrait/Landscape.
6. Xuất thành công → tải PDF, lỗi → thông báo/retry.

**Postcondition:** PDF thể hiện đúng những Page người đó được phép xuất, thứ tự ổn định, không chứa trang private trái quyền.

## UC-M01-14 — Xóa mềm và khôi phục

1. Owner chọn Move to Trash.
2. UI cảnh báo tác động và thời gian giữ tối thiểu 30 ngày.
3. Xác nhận. Book biến mất khỏi danh sách hoạt động, xuất hiện tại khu vực thùng rác tương ứng.
4. Khi còn thời hạn, Owner chọn Restore.
5. Book khôi phục trạng thái phù hợp, tham chiếu dữ liệu còn hợp lệ.

**Ngoại lệ:** nguồn asset đã bị xóa vĩnh viễn, không được khẳng định khôi phục hoàn hảo, phải hiển thị cảnh báo cụ thể.

## UC-M01-15 — Trang riêng tư trong sách chung

1. A tạo Book Shared với B là Viewer.
2. A đặt Page 5 chỉ A được xem.
3. B mở Reader, Page Manager và tìm kiếm.
4. B không thấy nội dung, thumbnail hoặc kết quả riêng tư của Page 5.
5. B export PDF khi được cấp quyền xuất: PDF chỉ có các trang được phép.

**Postcondition:** không bị lộ trang qua URL trực tiếp, thumbnail, PDF hoặc history.

## UC-M01-16 — Một tài khoản, nhiều phiên

1. A mở Book trên máy tính và điện thoại bằng cùng account.
2. Mỗi tab/thiết bị có session ID độc lập.
3. A sửa trên PC và ngay sau đó thao tác trên mobile.
4. Cả hai phiên đồng bộ như các tác nhân cộng tác, giữ nội dung hợp lệ.

**Postcondition:** không mất dữ liệu do hai tab có cùng tài khoản, không đếm nhầm session là hai người khác nhau trong giao diện.

---

# 11. Liên kết với các phân hệ khác

## 11.1. Bản đồ phụ thuộc

| Phân hệ | Vai trò | M01 sử dụng gì? |
|---|---|---|
| M02 Media Library | Nguồn ảnh/video và upload | ảnh, album, asset metadata, quyền dùng media, thông tin lỗi/xóa |
| M03 Food & Places | Nguồn địa điểm | link điểm đến/lần ghé thăm trong Diary hoặc Photobook |
| M04 Travel & Trips | Nguồn chuyến đi | liên kết nhật ký/chuyến đi, tập ảnh đã gắn với Trip |
| M05 Calendar | Nguồn sự kiện | ngày kỷ niệm, sự kiện liên quan, mở link tới Event |
| M08 Special Moments | Cột mốc | liên kết một trang sách hoặc Diary với milestone |
| M09 Couple Interaction | Bình luận/cảm xúc | comment theo Book/Page/Diary phù hợp quyền |
| M10 Personalization & Settings | Account/theme/quyền/cài đặt | chủ sở hữu, danh tính cộng tác, setting & permission chung |
| Core Search/Timeline | Tìm kiếm và tổng hợp | dùng metadata và nội dung được quyền, theo Event Date |

## 11.2. Hợp đồng nghiệp vụ tối thiểu

M01 kỳ vọng các phân hệ nguồn cung cấp được: định danh ổn định, metadata hiển thị hợp lệ, quyền truy cập của user hiện tại, trạng thái đối tượng (còn tồn tại/đã xóa/chưa thể truy cập), và khả năng điều hướng tới nguồn theo quyền.

Các liên kết không được cho phép M01 sửa trực tiếp dữ liệu M03/M04/M05 nếu phân hệ nguồn không cấp nghiệp vụ đó. Xóa Book/Page không làm xóa Place/Trip/Event/Diary/media gốc.

## 11.3. Khi phân hệ nguồn chưa có dữ liệu

- M01 vẫn cho phép tạo và chỉnh sách từ blank/template, gõ text, chọn ảnh đã có.
- UI các nguồn liên kết hiển thị `No items yet` hoặc `Unavailable`, không làm hỏng Editor.
- M01 không tự tạo bảng/quy trình quản lý du lịch, quán ăn hoặc sự kiện thay các phân hệ chuyên trách.

---
# 12. Quy tắc nghiệp vụ, ngoại lệ và tính phi chức năng

## 12.1. Business Rules — Registry

Các quy tắc dưới đây là **bất biến nghiệp vụ của M01**. Nếu một tính năng thay đổi, cần cập nhật rule và acceptance tương ứng trước khi sửa code.

| ID | Quy tắc | Ưu tiên |
|---|---|---|
| BR-PB-001 | Một Book có Owner, ID ổn định, title hợp lệ | P0 |
| BR-PB-002 | Book mới mặc định Private | P0 |
| BR-PB-003 | Cho phép nhiều Book trùng title | P0 |
| BR-PB-004 | Book hỗ trợ hai orientation: Portrait/Landscape | P0 |
| BR-PB-005 | Có tối thiểu 8, mục tiêu 8–12 template chất lượng tốt | P0 |
| BR-PB-006 | Có thư viện sticker/decor cơ bản | P0 |
| BR-PB-007 | Mỗi Page có ID ổn định, reorder không thay ID | P0 |
| BR-PB-008 | Simple và Advanced cùng mô hình nội dung, chuyển mode không xóa element | P0 |
| BR-PB-009 | Thay template nguy cơ mất bố cục cần preview/xác nhận và undo/restore | P0 |
| BR-PB-010 | Reader hỗ trợ page flip, swipe và fallback chuyển đơn giản | P0 |
| BR-PB-011 | Reader mobile hỗ trợ đọc một trang, zoom, không bỏ mất nội dung | P0 |
| BR-PB-012 | Publication là snapshot bất biến | P0 |
| BR-PB-013 | Edit sau Publish tạo Revision Draft, không sửa Published ngay | P0 |
| BR-PB-014 | Không Publish khi nội dung liên quan chưa lưu hoặc có xung đột chưa giải quyết | P0 |
| BR-PB-015 | Version Restore tạo revision mới, giữ lịch sử | P0 |
| BR-PB-016 | Xóa Book/Page không xóa media/Diary gốc | P0 |
| BR-PB-017 | Trash giữ tối thiểu 30 ngày trước xóa vĩnh viễn theo chính sách | P0 |
| BR-PB-018 | Có xuất PDF theo nội dung, thứ tự, orientation và quyền | P0 |
| BR-PB-019 | Nhạc nền/video nhúng không là P0 | P0 scope boundary |
| BR-DI-001 | Diary độc lập với Book | P0 |
| BR-DI-002 | Diary có Event Date khác Created/Updated time | P0 |
| BR-DI-003 | Diary phải có body hoặc media hợp lệ trước khi Publish | P0 |
| BR-DI-004 | Diary mặc định Private | P0 |
| BR-DI-005 | Diary không bắt buộc co-typing real-time V1.0, nhưng không được overwrite câm | P0 |
| BR-DI-006 | Chèn Diary vào Book mặc định Copy as Snapshot | P0 |
| BR-DI-007 | Sửa/xóa Diary gốc không tự sửa/xóa snapshot đã đưa vào Book | P0 |
| BR-DI-008 | Diary Private chèn Book Shared phải xác nhận rõ phạm vi chia sẻ | P0 |
| BR-RT-001 | Có thể cùng sửa một Book và một Page theo thời gian thực | P0 |
| BR-RT-002 | Có thể cùng gõ trong một text box mà không mất dữ liệu hợp lệ | P0 |
| BR-RT-003 | Thay đổi object độc lập phải được giữ khi đồng bộ | P0 |
| BR-RT-004 | Không dùng ghi đè nguyên Page đến sau làm cơ chế concurrency duy nhất | P0 |
| BR-RT-005 | Thao tác cạnh tranh cùng object phải được điều phối hoặc giải quyết an toàn | P0 |
| BR-RT-006 | Retry không tạo Page/Element trùng không chủ ý | P0 |
| BR-RT-007 | Presence quản lý theo session, hỗ trợ nhiều thiết bị cùng account | P0 |
| BR-RT-008 | Auto-save phải hiển thị Saving/Saved/Offline/Conflict/Error trung thực | P0 |
| BR-RT-009 | Mất mạng không làm chặn người đang online và không làm mất cập nhật đã xác nhận | P0 |
| BR-RT-010 | Reconnect không ghi đè toàn Page bằng bản client cũ | P0 |
| BR-RT-011 | Personal Undo không đảo ngược nhầm thay đổi độc lập của người khác | P0 |
| BR-RT-012 | Publish chốt một trạng thái nội dung nhất quán dù đang cộng tác | P0 |
| BR-PERM-001 | Mỗi Book/Page/Diary thực thi quyền tại thao tác đọc và ghi | P0 |
| BR-PERM-002 | Page kế thừa Book, có thể override theo trang | P0 |
| BR-PERM-003 | Owner quản lý quyền; Editor Publish chỉ khi có grant riêng | P0 |
| BR-PERM-004 | Thu hồi quyền có hiệu lực cả với phiên đang mở và thao tác reconnect | P0 |
| BR-PERM-005 | Không hỗ trợ guest/public share trong V1.0 | P0 |
| BR-PERM-006 | Thumbnail/search/export/history không lộ nội dung ngoài quyền | P0 |
| BR-PERM-007 | Chèn nguồn Private vào đích Shared cần xác nhận, không tự chia sẻ nguồn gốc | P0 |
| BR-X-001 | Desktop và mobile đều phải thực hiện được luồng tạo/chỉnh/xem cốt lõi | P0 |
| BR-X-002 | Có khả năng sao lưu, kiểm thử khôi phục và xuất dữ liệu theo chính sách chung | P0 |
| BR-X-003 | Không cam kết tự đồng bộ ảnh nền từ mọi điện thoại, đó là nghiệp vụ M02 phụ thuộc quyền thiết bị | Scope boundary |

## 12.2. Exception Catalogue

| ID | Tình huống | Kết quả mong muốn / không được phép xảy ra |
|---|---|---|
| EX-01 | Mất mạng khi đang nhập chữ | Offline hiện rõ, không thông báo Saved sai, có phương án giữ/khôi phục thao tác chưa gửi |
| EX-02 | A reconnect sau khi B đã thay đổi | Không dùng bản của A ghi đè toàn trang, đồng bộ/hợp nhất hoặc giải quyết conflict |
| EX-03 | Hai người cùng tạo Page | Giữ cả hai, thứ tự hội tụ |
| EX-04 | Một người xóa Page người kia đang sửa | Cảnh báo/phối hợp, có khôi phục, không mất câm dữ liệu |
| EX-05 | Đổi template lúc người kia đang sửa | Không reset toàn trang không xác nhận |
| EX-06 | Upload ảnh lỗi | Retry, trạng thái lỗi rõ, không đặt ảnh giả hợp lệ vào Publication |
| EX-07 | Media gốc bị xóa hoặc thu hồi quyền | Không lộ media, placeholder/cảnh báo có kiểm soát, không tự xóa mọi nơi |
| EX-08 | Thu hồi quyền khi tab Editor đang mở | Từ chối ghi mới, thông báo quyền đã đổi |
| EX-09 | Cùng account mở hai tab | Hai session riêng, giữ thay đổi hợp lệ |
| EX-10 | Browser đóng/crash bất ngờ | Dữ liệu đã xác nhận còn nguyên, pending xử lý theo khả năng đã công bố |
| EX-11 | Text tràn vùng | Cảnh báo overflow, không tự cắt chữ mà không biết |
| EX-12 | Font/sticker không tải được | Fallback/placeholder, không xóa element |
| EX-13 | Publish khi pending save | Chặn/hẹn lại đến trạng thái nhất quán, không công bố nửa vời |
| EX-14 | Diary Private được copy vào Book Shared | Cho biết người sẽ xem được snapshot và yêu cầu confirm |
| EX-15 | Truy cập URL Page không quyền | Không lộ nội dung, thumbnail hay dữ liệu tìm kiếm |
| EX-16 | Reader trên màn hình nhỏ | Có single-page/zoom, không sửa sai layout |
| EX-17 | Restore Book nhưng thiếu resource đã bị xóa vĩnh viễn | Nêu rõ phần thiếu, không báo hoàn tất hoàn hảo giả |
| EX-18 | Đồng hồ thiết bị sai lệch | Không quyết định thứ tự đồng bộ/phiên bản chỉ theo đồng hồ máy khách |
| EX-19 | Undo thao tác đã có người khác sửa tiếp | Không phá sửa của người kia, giải thích nếu không Undo được |
| EX-20 | Xóa Page có comment/link | Tuân thủ chính sách soft delete và xử lý nguồn phụ thuộc, không mất link dữ liệu gốc |
| EX-21 | Double click Create/Publish/Upload retry | Không tạo trùng không mong muốn |
| EX-22 | PDF export thất bại giữa chừng | Không trả file lỗi như thành công, có retry và thông báo |
| EX-23 | Quyền Page khác Book khi export | Chỉ xuất Page được phép, không lộ nội dung cấm |
| EX-24 | A restore revision trong khi B đang làm việc | B được cảnh báo, thao tác B chưa xác nhận không bị mất âm thầm |
| EX-25 | Đổi Portrait ↔ Landscape của sách nhiều trang | Preview cảnh báo, không tự crop/cắt chữ, có confirm và restore |
| EX-26 | Hai người cùng sửa Diary trên các tab | Chống overwrite câm, báo conflict hoặc bảo toàn version |
| EX-27 | Chỉnh sửa Book chưa từng có Published | Viewer không nhìn thấy Draft |
| EX-28 | Thiết bị yêu cầu giảm chuyển động | Không bắt buộc hiệu ứng page flip gây khó chịu, dùng chuyển đơn giản |
| EX-29 | Xóa mềm rồi restore trong 30 ngày | Book có thể phục hồi theo chính sách, không mất lịch sử hợp lệ |
| EX-30 | PDF đã xuất rồi quyền bị thu hồi | Không hứa có thể thu hồi file đã tải, cảnh báo khi xuất/chia sẻ |

## 12.3. Yêu cầu bảo mật và quyền riêng tư

- Kiểm tra xác thực và quyền khi đọc/ghi Book, Page, Diary, revision, export, asset và thao tác collaboration.
- Không đưa dữ liệu nhạy cảm vào log, thông báo hay search snippet khi không cần thiết.
- Nội dung rich text phải an toàn khi hiển thị, không được thực thi mã độc đính kèm trong văn bản/metadata.
- File upload phải được quản lý theo quy tắc kiểm tra loại/kích thước và quyền của M02, không chỉ dựa vào tên file.
- Tính năng share không tạo link công khai. Người không có quyền không được suy ra nội dung private từ thumbnail hoặc tên nguồn.
- Export PDF luôn kiểm tra quyền tại thời điểm yêu cầu tạo file.

## 12.4. Lưu trữ, sao lưu, phục hồi

Phân biệt ba cấp:

1. **Auto-save:** lưu thay đổi đang thực hiện, có xác nhận.
2. **Version History:** khôi phục mốc nội dung, quản lý lịch sử.
3. **Backup:** bản sao độc lập phục vụ sự cố dữ liệu/hạ tầng, có kiểm thử phục hồi.

M01 cần các hợp đồng backup/restore từ phần nền tảng chung. Ít nhất một kịch bản phục hồi Book có trang, sticker, chữ, ảnh và permission phải được chạy kiểm thử. Trash giữ tối thiểu 30 ngày trước khi xóa vĩnh viễn theo chính sách chung. Phải có cách export dữ liệu và asset cần thiết để chủ sở hữu không bị khóa tuyệt đối vào hệ thống.

## 12.5. Phi chức năng: hiệu năng, khả dụng và tính bền vững

| Nhóm | Yêu cầu |
|---|---|
| Realtime | Mục tiêu 95% thay đổi thông thường xuất hiện ở phiên bên kia trong ≤2 giây, đo trong môi trường thử nghiệm xác định |
| Consistency | Không mất cập nhật được xác nhận, hai phiên hội tụ sau đồng bộ |
| Responsiveness | UI có phản hồi nhập và kéo thả, không đợi round-trip để mới thể hiện phản hồi cục bộ |
| Media loading | Ảnh lớn nên được tải/hiển thị có trạng thái tiến trình, lỗi có thể retry |
| Mobile | Các tác vụ P0 thực hiện được bằng cảm ứng và viewport nhỏ |
| Accessibility | Nhãn nút, trạng thái focus, điều hướng bàn phím cho thao tác có thể hỗ trợ, giảm chuyển động cho Reader |
| Portability | Export PDF và dữ liệu theo chính sách chung, không chỉ phụ thuộc giao diện hiện tại |
| Recovery | Khôi phục dữ liệu từ version và backup được xác minh qua kiểm thử |
| Observability | Các lỗi save, collaboration và export đủ thông tin chẩn đoán, không làm lộ nội dung riêng tư |
| Long-term | Thiết kế dữ liệu cho phép đọc các ấn bản cũ sau khi thêm template/tính năng mới |

Chưa chốt giới hạn dung lượng, số lượng trang, thời gian bảo quản version và tỷ lệ lỗi upload. Các giá trị này thuộc tài liệu NFR/vận hành chung và phải công bố rõ cho người dùng trước khi áp dụng.

---

# 13. Acceptance Criteria và ma trận kiểm thử

## 13.1. Cách dùng tiêu chí

Các mã `AC-*` là điều kiện nghiệp vụ **Given–When–Then** ở dạng gọn. Trong quá trình QA, mỗi mã có thể có nhiều test case chi tiết. Mọi P0 phải đạt, không đánh dấu đạt chỉ vì giao diện có nút tương ứng.

## 13.2. Photobook Management

| ID | Given / When | Then |
|---|---|---|
| AC-01 | User tạo Book hợp lệ | Tạo một Draft với owner và default Private |
| AC-02 | User để title chỉ có khoảng trắng | Không tạo Book, hiện validation rõ |
| AC-03 | User tạo hai sách cùng tên | Cả hai được phép với ID khác nhau |
| AC-04 | User mở Book đã lưu | Nội dung đã xác nhận vẫn còn |
| AC-05 | User thêm Page và reload | Page giữ ID và thứ tự hợp lệ |
| AC-06 | User reorder Page | Comment/link còn gắn đúng Page, không theo index cũ |
| AC-07 | User chọn Portrait/Landscape | Layout/Reader/PDF tương ứng định hướng |
| AC-08 | User mở thư viện template | Có ít nhất 8 mẫu dùng được, preview hoạt động |
| AC-09 | User chọn sticker | Có thư viện sticker cơ bản, thêm được vào trang |
| AC-10 | User chuyển Simple → Advanced → Simple | Không mất element/layout/style hoặc ID |
| AC-11 | User đổi template trang chứa nội dung | Có preview, cảnh báo/confirm, không tự xóa dữ liệu |
| AC-12 | User xem Published | Chỉ thấy Publication đã chốt, không phải Draft mới |
| AC-13 | User tiếp tục Edit sau Publish | Có Revision Draft tách khỏi Publication |
| AC-14 | User xóa Book | Chuyển vào Trash và giữ được ít nhất 30 ngày theo chính sách |
| AC-15 | User restore trong thời hạn | Book hoạt động trở lại, thông báo các resource thiếu nếu có |

## 13.3. Editor tools

| ID | Given / When | Then |
|---|---|---|
| AC-16 | User thêm ảnh/text/sticker/shape trong Advanced | Element xuất hiện, có thể chọn và chỉnh thuộc tính phù hợp |
| AC-17 | User di chuyển/resize/rotate image | Layout hiển thị và lưu đúng |
| AC-18 | User thao tác layer/lock | Thứ tự/khóa được giữ khi reload |
| AC-19 | User gõ quá dài trong một text box | Cảnh báo overflow, không tự bỏ chữ |
| AC-20 | User dùng Simple Edit Text/Replace Photo | Chỉ slot hợp lệ thay đổi, element nâng cao không mất |
| AC-21 | User Undo/Redo thao tác cá nhân an toàn | Kết quả đúng và được đồng bộ |
| AC-22 | User đóng tab sau Saved rồi mở lại | Tất cả thay đổi đã xác nhận còn nguyên |

## 13.4. Realtime Collaboration

| ID | Given / When | Then |
|---|---|---|
| AC-23 | A/B mở cùng Book | Presence cập nhật phù hợp cho cả hai |
| AC-24 | A/B ở cùng Page | Hiển thị vị trí/lựa chọn cộng tác theo khả năng và quyền |
| AC-25 | A thêm image, B thêm text đồng thời | Cả hai thay đổi được giữ |
| AC-26 | A/B cùng nhập một text box | Không mất ký tự hợp lệ do overwrite toàn chuỗi |
| AC-27 | A kéo image, B cùng kéo image | Có điều phối, không liên tục nhảy vị trí |
| AC-28 | A đổi màu, B resize cùng element | Giữ cả hai nếu thuộc tính tương thích |
| AC-29 | A xóa element B đang sửa | Có cảnh báo/khôi phục, không mất câm công việc B |
| AC-30 | A/B đồng thời tạo Page | Hai Page tồn tại với thứ tự nhất quán |
| AC-31 | A reorder Page, B sửa Page đó | B sửa đúng Page với ID không đổi |
| AC-32 | A Undo trong lúc B đã sửa độc lập | Không Undo nhầm nội dung của B |
| AC-33 | A mất mạng, B edit | B tiếp tục bình thường, A thấy Offline |
| AC-34 | A reconnect với pending changes | Không ghi đè toàn trang bản mới từ B |
| AC-35 | A có Conflict không hợp nhất an toàn | UI báo và cho xử lý/khôi phục, không giả vờ Saved |
| AC-36 | Hai tab của cùng A cùng edit | Chúng là session riêng, đồng bộ hợp lệ |
| AC-37 | Có thao tác đang Saving | Không hiển thị Saved trước khi được xác nhận |
| AC-38 | Retry change sau timeout | Không sinh duplicate page/element ngoài ý muốn |
| AC-39 | Hai phiên ổn định sau sync | Nội dung được phép xem hội tụ cùng trạng thái |
| AC-40 | Thao tác phổ biến trên môi trường QA ổn định | Đo kiểm mục tiêu p95 ≤2 giây theo kịch bản đã định |

## 13.5. Privacy & permissions

| ID | Given / When | Then |
|---|---|---|
| AC-41 | Book mới được tạo | Private dù Our Space có 2 người |
| AC-42 | Owner chia sẻ Book với Editor | Editor sửa trong phạm vi Page được quyền |
| AC-43 | Editor không có Publish grant bấm Publish | Từ chối xuất bản |
| AC-44 | Owner thu hồi Editor khi người kia đang sửa | Session không được áp dụng cập nhật mới trái quyền |
| AC-45 | Viewer truy cập Draft trực tiếp | Không có nội dung nháp |
| AC-46 | Page private override trong Book Shared | Người không quyền không xem Page qua Reader/thumbnail/search |
| AC-47 | Viewer export PDF của Book có Page riêng tư | PDF không chứa Page private |
| AC-48 | Diary private đưa vào Book shared | Phải xác nhận trước khi chia sẻ snapshot, Diary nguồn vẫn Private |
| AC-49 | Tài khoản không quyền mở trực tiếp asset/revision | Truy cập bị từ chối không lộ nội dung |
| AC-50 | User tìm public/guest sharing trong V1 | Không có luồng chia sẻ công khai |

## 13.6. Diary and Linking

| ID | Given / When | Then |
|---|---|---|
| AC-51 | User tạo Diary hợp lệ | Lưu được với Event Date và owner |
| AC-52 | Diary thiếu body và media | Không cho Publish bài rỗng |
| AC-53 | User viết hôm nay về kỷ niệm năm cũ | Timeline hiển thị theo Event Date được chọn |
| AC-54 | Diary được chèn snapshot vào Book | Thay nội dung trong Book không sửa Diary gốc |
| AC-55 | Diary gốc bị xóa/sửa sau khi chèn | Snapshot không tự biến mất/thay đổi |
| AC-56 | Hai tab cùng sửa Diary | Không bị overwrite câm, có bảo vệ version/conflict |
| AC-57 | User thiếu quyền sửa Book đích | Không chèn snapshot được |

## 13.7. Reader, Publish & Export

| ID | Given / When | Then |
|---|---|---|
| AC-58 | User đọc sách trên desktop | Có Reader phù hợp, page flip hoặc transition thay thế |
| AC-59 | User đọc sách trên điện thoại | Có single-page, vuốt và zoom |
| AC-60 | User bật giảm chuyển động | Reader không ép page-flip animation mạnh |
| AC-61 | Owner Publish khi có pending save | Không tạo Publication không nhất quán |
| AC-62 | Publication được tạo | Nội dung của phiên bản không tự đổi khi Draft tiếp tục sửa |
| AC-63 | Owner restore Version | Tạo revision mới và giữ lịch sử trước đó |
| AC-64 | User xuất PDF từ nội dung hợp lệ | PDF giữ Page order, orientation, ảnh, chữ, sticker trong quyền |
| AC-65 | Asset độ phân giải thấp/overflow khi export | Có cảnh báo phù hợp trước khi xuất |
| AC-66 | Export thất bại | Không trả file hỏng như file thành công, có thông báo/retry |
| AC-67 | PDF đã tải sau đó bị revoke quyền hệ thống | UI không hứa thu hồi file PDF ngoài hệ thống |

## 13.8. Recovery & Integration

| ID | Given / When | Then |
|---|---|---|
| AC-68 | M02 chưa có ảnh hoặc nội dung liên kết | M01 vẫn tạo sách với text/template/blank được |
| AC-69 | User xóa Book đã dùng ảnh/Diary gốc | Ảnh/Diary gốc còn nguyên |
| AC-70 | Backup có dữ liệu Book/Page/asset/quyền | Kiểm thử restore đưa dữ liệu về trạng thái đọc/sửa được theo phạm vi cam kết |
| AC-71 | Search/Timeline đọc Diary theo quyền | Không lộ Diary Private, ngày kỷ niệm đúng Event Date |
| AC-72 | User chỉnh/đọc M01 trên mobile và desktop | Hoàn thành đủ kịch bản P0 trên cả hai nền tảng |

## 13.9. Ma trận kiểm thử bắt buộc

| Trục kiểm thử | Bộ kịch bản tối thiểu |
|---|---|
| Role | Owner, Editor, Editor không có Publish, Commenter, Viewer, không quyền |
| Visibility | Private Book, Shared Book, Page override, Private Diary → Shared Book |
| Device | desktop + điện thoại, màn hình nhỏ và màn hình lớn |
| Session | một phiên, hai người, hai tab cùng account, mất kết nối từng phiên |
| Content | text, image, sticker, shape, background, nhiều Page, nội dung tràn |
| Lifecycle | Draft, Published, Revision Draft, Archived, Trashed, Restore |
| Media | asset hợp lệ, bị thu hồi, lỗi upload, ảnh thấp độ phân giải |
| Sync | song song độc lập, chung text, chung object, Undo, reconnect, retry |
| Output | Reader, Draft Preview, PDF của Owner và Viewer có quyền khác nhau |

**Điều kiện pass:** Không có lỗi P0 gây mất nội dung đã xác nhận, vi phạm quyền riêng tư, xuất bản sai version hoặc ghi đè đồng thời im lặng. Các kịch bản khác phải đáp ứng tiêu chí ở bảng AC.

---

# 14. Giao diện desktop/mobile và accessibility

## 14.1. Định hướng thị giác

- Homepage và màn hình quản lý theo phong cách hiện đại, gọn, dễ tìm kiếm.
- Photobook Reader/Editor thiên về scrapbook, nhiều template phong phú.
- Theme của từng Book độc lập với theme toàn website.
- Mọi nút cốt lõi phải có nhãn/biểu tượng dễ hiểu, tránh chỉ dùng icon mơ hồ.

## 14.2. Phân bố chức năng theo thiết bị

| Trải nghiệm | Desktop | Mobile |
|---|---|---|
| Library | cards nhiều cột và filter/search | cards một/hai cột và bộ lọc thu gọn |
| Reader | two-page spread khi phù hợp | single-page/zoom/swipe |
| Simple Editor | slot editor, panel template | chọn slot bằng chạm, panel gọn |
| Advanced Editor | canvas rộng, toolbar, sidebar, property inspector | canvas zoom/pan, bottom sheet/drawer, công cụ theo selection |
| Page Manager | thumbnail strip/grid, drag-drop | danh sách trang, nút reorder dễ chạm |
| Collaboration | cursor/selection và avatar | avatar/page presence, marker gọn không che canvas |
| Diary | rich text toàn màn hình | quick writing, ảnh và ngày dễ nhập |
| Export | preview và tải PDF | preview trạng thái và mở/tải file theo hỗ trợ thiết bị |

## 14.3. Accessibility / usability

- Có keyboard interaction thích hợp cho thao tác chính: Reader Next/Prev, đóng modal, focus, chọn công cụ. Những thao tác kéo thả nên có phương án điều khiển thay thế nơi phù hợp.
- Reader hỗ trợ giảm chuyển động và không buộc phải xem animation.
- Màu sắc trạng thái Save/Conflict không chỉ dùng màu, kèm chữ/icon.
- Kích thước target cảm ứng đủ dễ thao tác.
- Không đặt modal/drawer che mất trạng thái lưu quan trọng.
- Có thông báo rõ khi đối tượng bị khóa hoặc đang được người khác thao tác.

---

# 15. Dữ liệu mẫu, template và ví dụ minh họa

## 15.1. Kịch bản minh họa xuyên suốt

**Book:** `Our First Year`, khổ Landscape, Private lúc tạo, sau đó Shared cho tài khoản còn lại quyền Editor.

**Diary:** `Buổi hẹn ở quán cafe`, Event Date là ngày diễn ra kỷ niệm, có một đoạn văn và 5 ảnh từ M02.

**Pages:**

1. Cover — bìa sách.
2. One Hero Photo — bức ảnh chủ đạo và caption.
3. Memory Collage — các ảnh ghép và sticker.
4. Diary & Photo — snapshot từ Diary được biên tập lại.
5. Letter to You — trang thư tay.
6. Four-Photo Grid — lưới ảnh.

**Collaboration:** A chọn ảnh trên Page 3 trong khi B viết caption trên Page 3. Khi cả hai Saved, Reader hiển thị thống nhất. A Publish, B tiếp tục sửa Revision Draft. A export PDF Published, kết quả không tự thay khi B đang sửa Draft.

## 15.2. Test dữ liệu riêng tư

- Book A được Shared cho B là Viewer.
- Page 5 có override chỉ Owner A xem.
- Diary `Private Letter` chỉ A có quyền, A chọn một đoạn đưa vào Book Shared bằng snapshot sau khi xác nhận.
- B chỉ thấy snapshot trên trang được share, không được mở `Private Letter` gốc và không thấy Page 5 qua PDF/search/thumbnail.

## 15.3. Test xung đột

- A/B cùng nhập trong text box. Cả hai đoạn được giữ.
- A kéo ảnh X, B cũng cố kéo X. Không có vòng giật không kiểm soát.
- A mất mạng, B thêm sticker. A reconnect, sticker B còn lại.
- A Undo text change của chính mình, không xóa sticker B.
- Owner giảm quyền B khi B đang edit. Không có thao tác mới từ B vượt quyền.

---

# 16. Ranh giới triển khai và Definition of Done

## 16.1. Hướng dẫn bàn giao cho Codex

Tài liệu này là **source of truth nghiệp vụ** của M01. Khi triển khai sau này:

1. **Đọc yêu cầu xuyên suốt, không chỉ đọc tên tính năng.** Đặc biệt là concurrency, permissions, data invariants.
2. **Đối chiếu nền tảng chung**: account, permission, Media Library M02, comments M09, settings M10, storage, backup.
3. **Tạo thiết kế kỹ thuật riêng** trước khi code phần real-time và editor. Thiết kế phải chứng minh được các invariant và tình huống xung đột.
4. **Ưu tiên implementation theo phụ thuộc**, ví dụ quyền/Book/Page/Element/asset → Editor → real-time → Publication/Export → Diary/link → QA, nhưng không tự ý bỏ các P0 khác.
5. **Mọi xử lý quyền phải ở ranh giới dữ liệu**, không chỉ disabled/hidden trên UI.
6. **Viết test theo các mã AC và EX**, kiểm thử ít nhất hai client thật cho các kịch bản realtime.
7. **Không tự chọn default Shared, không tự bật public share, không tự cho Editor Publish** vì trái những quyết định đã chốt.
8. **Không tự thêm video/music/AI như một điều kiện hoàn thành V1.0**. Các tính năng đó là P1/P2 hoặc cần thay đổi quyết định.
9. **Không tự ngầm giới hạn số trang/ảnh hoặc làm hỏng sách cũ khi nâng cấp template**. Mọi giới hạn cần được mô tả trong NFR/vận hành.
10. **Nếu phát hiện xung đột giữa yêu cầu nghiệp vụ và khả năng nền tảng**, ghi rõ blocker/đề xuất, không âm thầm hạ cấp realtime thành lượt sửa hoặc bỏ mobile advanced.

## 16.2. Danh sách đầu ra kỹ thuật cần có sau giai đoạn nghiệp vụ

> Các mục dưới đây là **đầu việc tương lai** cho giai đoạn coding, không phải yêu cầu người dùng cung cấp ngay bây giờ.

- Sơ đồ kiến trúc M01 và hợp đồng tích hợp các module dùng chung.
- Thiết kế mô hình dữ liệu chi tiết và migration strategy, bao gồm versioning và publication snapshot.
- Thiết kế đồng bộ real-time, logic xử lý concurrent text/object/page, reconnect và personal undo.
- Thiết kế permission evaluation, page inheritance/override và chính sách source asset.
- Thiết kế PDF export và kiểm thử rendering.
- Wireframe/prototype thực tế cho 17 giao diện chức năng trên desktop/mobile.
- Bộ test unit/integration/e2e, đặc biệt các kịch bản hai phiên chỉnh sửa đồng thời.
- Runbook sao lưu, phục hồi và xử lý sự cố liên quan M01.

## 16.3. Definition of Done của M01 V1.0

M01 chỉ được coi là **đạt mức sẵn sàng tích hợp/phát hành** khi:

- [ ] Hoàn thành PB-01 đến PB-13 và DI-01 đến DI-04 trong phạm vi đã mô tả.
- [ ] Có ít nhất 8 template usable, portrait/landscape, thư viện sticker cơ bản.
- [ ] Simple và Advanced Editor hoạt động, chuyển qua lại không làm mất dữ liệu.
- [ ] Reader có page flip, swipe, fallback và hỗ trợ mobile.
- [ ] Hai người cùng sửa Page và text box real-time, không mất cập nhật đã xác nhận.
- [ ] Hỗ trợ presence, trạng thái Save chính xác, reconnect, undo an toàn, version restore.
- [ ] Quyền Private/Shared, Viewer/Commenter/Editor/Owner, Page override và Publish grant hoạt động thực chất.
- [ ] Chèn Diary vào Photobook bằng Snapshot và bảo vệ nguồn Private.
- [ ] Publication chốt phiên bản bất biến, Revision Draft tiếp tục chỉnh độc lập.
- [ ] Xuất PDF giữ thứ tự, orientation, nội dung hợp lệ và không lộ Page ngoài quyền.
- [ ] Archive, Trash ≥30 ngày, Restore và không xóa dữ liệu gốc dây chuyền.
- [ ] Test hoàn thành các mã AC-01 đến AC-72 và xử lý EX-01 đến EX-30 phù hợp.
- [ ] Các luồng P0 thực hiện được trên desktop lẫn điện thoại.
- [ ] Kiểm thử backup/restore dữ liệu M01 theo hợp đồng nền tảng.
- [ ] Không còn lỗi nghiêm trọng về mất dữ liệu đã lưu, concurrency và privacy.
- [ ] Có tài liệu giới hạn/giả định kỹ thuật, hướng dẫn vận hành và kết quả QA.

## 16.4. Điều kiện tích hợp toàn Our Space

Chủ dự án muốn **10/10 phân hệ chính đều có bộ chức năng cốt lõi trước khi sử dụng chính thức**. Vì vậy đạt DoD của M01 **chưa** đồng nghĩa website Our Space V1.0 sẵn sàng phát hành. Cần thêm kiểm thử tích hợp cùng M02–M10 và các năng lực dùng chung.

## 16.5. Những thông số kỹ thuật chưa bị chốt cứng bởi nghiệp vụ

Không tự hiểu là “thiếu nghiệp vụ” khi các chi tiết sau chưa có trong BRD:

- Kích thước vật lý chính xác từng khổ trang, mật độ điểm ảnh.
- Giới hạn số trang, dung lượng file, số phiên đồng thời nhiều hơn hai.
- Công nghệ collaborative editing, message protocol, persistence layout.
- Thời hạn giữ từng mốc History khác với Trash ≥30 ngày.
- Nhà cung cấp font/icon/sticker, storage provider, PDF engine.
- Quy tắc RPO/RTO cụ thể của backup toàn hệ thống.

Các mục này phải được định nghĩa trong thiết kế hệ thống/NFR chung và đối chiếu với yêu cầu đã chốt trước khi triển khai.

---

# 17. Nhật ký quyết định và thay đổi

| Ngày | Phiên bản | Thay đổi | Tình trạng |
|---|---|---|---|
| 2026-10-22 | 1.0 | Hợp nhất đề xuất M01 chi tiết, xác nhận cộng tác thời gian thực phương án A và toàn bộ D01–D15 | Đã chốt ở cấp nghiệp vụ |
| 2026-10-22 | 1.0 | Chuẩn hóa 17 giao diện, domain conceptual model, permission matrix, realtime rules, 16 UC, 30 EX, 72 AC | Baseline để thiết kế/triển khai sau |

## 17.1. Thứ tự ưu tiên khi có mâu thuẫn giữa tài liệu

1. Những quyết định **người dùng trực tiếp xác nhận** trong hội thoại mới nhất, gồm real-time phương án A và D01–D15.
2. Quy tắc nghiệp vụ P0 và bất biến về dữ liệu, quyền, phiên bản trong tài liệu này.
3. Tiêu chí nghiệm thu AC và kịch bản EX.
4. Mockup/wireframe, mô tả minh họa, giả định kỹ thuật và ý tưởng P1/P2.

Nếu có thay đổi yêu cầu, cần nâng phiên bản tệp và ghi changelog. Không sửa một quy tắc P0 mà không cập nhật điều kiện nghiệm thu tương ứng.

## 17.2. Tình trạng cuối của tài liệu

- **Đã chốt:** tầm nhìn M01, 5 quyết định Our Space chung, cộng tác real-time, các đề xuất D01–D15, ranh giới P0/P1/P2.
- **Đã mô tả thành baseline thực thi:** 17 màn hình/giao diện, quyền, lifecycle, tính năng Editor, Diary, collaboration, offline/conflict, PDF, data linking, exception và acceptance.
- **Chưa phải code:** thiết kế UX cụ thể, giải pháp kỹ thuật, API, database, công nghệ, giới hạn vận hành chi tiết.

**Kết luận:** M01 là công cụ tạo photobook/scrapbook cộng tác thời gian thực cho hai người, có hai cấp độ chỉnh sửa và nhật ký độc lập, chú trọng quyền riêng tư, giữ dữ liệu lâu dài và làm việc trọn vẹn trên điện thoại lẫn máy tính. Đây là đặc tả nghiệp vụ chính thức được dùng để chuẩn bị triển khai, nhưng việc code chỉ bắt đầu khi chủ dự án chủ động chuyển sang giai đoạn kỹ thuật.
