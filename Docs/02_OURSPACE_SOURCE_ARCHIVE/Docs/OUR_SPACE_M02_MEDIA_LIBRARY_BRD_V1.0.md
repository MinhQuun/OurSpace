---
document_id: OURSPACE-M02-BRD
project: Our Space
module_id: M02
module_name: Memories & Media Library
version: 1.0
status: Business requirements approved, implementation pending
language: vi-VN
approved_on: 2026-10-22
file_name: OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md
intended_audience: [Product Owner, Designer, Codex, Developer, QA]
related_documents:
  - OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md
---

# OUR SPACE — M02: MEMORIES & MEDIA LIBRARY
## Business Requirements & Functional Specification — V1.0

> **TÀI LIỆU NGHIỆP VỤ ĐÃ CHỐT — DÀNH CHO CODEX.** Chủ dự án đã xác nhận toàn bộ đề xuất D01–D20 cho M02 ngày 22/10/2026. Tệp này là baseline nghiệp vụ cho phân hệ, đặt trực tiếp vào `Docs/`. Không coi đây là mã nguồn, schema SQL, API contract hay chỉ định stack kỹ thuật. Không tùy tiện nâng P1/P2 thành P0, bỏ qua kiểm tra quyền, thay thế quy tắc bằng giả định hoặc đặt con số giới hạn chưa được chốt.
>
> **ĐỌC TRƯỚC KHI TRIỂN KHAI:** Ưu tiên các mục 2 (quyết định chốt), 4 (mô hình dữ liệu), 7 (upload), 10 (phân quyền), 11 (liên kết và vòng đời), 12 (xóa và khôi phục), 15 (business rules), 17 (acceptance criteria), 19 (Definition of Done). Đối chiếu M01 trước khi quyết định cách M01 tham chiếu ảnh, xuất PDF và snapshot. Nếu có điểm trùng lặp hoặc mâu thuẫn giữa tài liệu, báo cáo để chủ dự án xác nhận, không tự sửa âm thầm.
>
> **Ý nghĩa P0/P1/P2:** P0 bắt buộc trước khi Our Space V1.0 sử dụng chính thức. P1 là ưu tiên cao nhưng không mặc định bắt buộc ở lần phát hành đầu. P2 là dự trù tương lai. Website V1.0 vẫn phải có 10/10 phân hệ cốt lõi hoạt động và được tích hợp, không phải 100% tính năng nâng cao của từng phân hệ.

---

## MỤC LỤC

1. [Bối cảnh, mục tiêu, nguyên tắc](#1-bối-cảnh-mục-tiêu-nguyên-tắc)
2. [Quyết định D01–D20 đã chốt và phạm vi](#2-quyết-định-d01d20-đã-chốt-và-phạm-vi)
3. [Vai trò, thuật ngữ và định nghĩa nghiệp vụ](#3-vai-trò-thuật-ngữ-và-định-nghĩa-nghiệp-vụ)
4. [Mô hình đối tượng, quan hệ và trạng thái](#4-mô-hình-đối-tượng-quan-hệ-và-trạng-thái)
5. [Sitemap và tổng quan 13 màn hình](#5-sitemap-và-tổng-quan-13-màn-hình)
6. [Đặc tả chi tiết ML-01 đến ML-03](#6-đặc-tả-chi-tiết-ml-01-đến-ml-03)
7. [Upload Center, kiểm tra file và đồng bộ ảnh](#7-upload-center-kiểm-tra-file-và-đồng-bộ-ảnh)
8. [Albums, Smart Collections và tổ chức nội dung](#8-albums-smart-collections-và-tổ-chức-nội-dung)
9. [Media Viewer, Editor, Search, Favorites](#9-media-viewer-editor-search-favorites)
10. [Chia sẻ, phân quyền và bảo vệ riêng tư](#10-chia-sẻ-phân-quyền-và-bảo-vệ-riêng-tư)
11. [Hợp đồng nghiệp vụ với các phân hệ](#11-hợp-đồng-nghiệp-vụ-với-các-phân-hệ)
12. [Trash, xóa vĩnh viễn, khôi phục](#12-trash-xóa-vĩnh-viễn-khôi-phục)
13. [Storage Dashboard, Export, Backup](#13-storage-dashboard-export-backup)
14. [Use Cases và main flows](#14-use-cases-và-main-flows)
15. [Business Rules và các bất biến](#15-business-rules-và-các-bất-biến)
16. [Ngoại lệ, xung đột và xử lý lỗi](#16-ngoại-lệ-xung-đột-và-xử-lý-lỗi)
17. [Acceptance Criteria và test matrix](#17-acceptance-criteria-và-test-matrix)
18. [Desktop/mobile, hiệu năng, chất lượng và an toàn](#18-desktopmobile-hiệu-năng-chất-lượng-và-an-toàn)
19. [Ranh giới triển khai, DoD và Codex handoff](#19-ranh-giới-triển-khai-dod-và-codex-handoff)
20. [Ví dụ nghiệp vụ, traceability và change log](#20-ví-dụ-nghiệp-vụ-traceability-và-change-log)

---

# 1. Bối cảnh, mục tiêu, nguyên tắc

## 1.1. Bối cảnh dự án

Our Space là website riêng tư, lâu dài của **hai người dùng với hai tài khoản độc lập**. Homepage có phong cách hiện đại, các phân hệ mang trải nghiệm phù hợp nghiệp vụ, đặc biệt M01 Photobook & Diary cho phép thiết kế scrapbook, cùng chỉnh sửa photobook thời gian thực. M02 cung cấp **nguồn ảnh/video tập trung** cho M01, các địa điểm, chuyến đi, sự kiện và những phân hệ ra đời sau này.

M02 không được triển khai như một gallery cô lập hoặc một folder ảnh phụ thuộc vào photobook. Ảnh/video phải có định danh, chủ sở hữu, metadata, quyền, lịch sử sử dụng, album, phiên bản, vòng đời và khả năng xuất/khôi phục.

## 1.2. Mục tiêu kinh doanh/sản phẩm

1. **Lưu trữ tập trung** ảnh và video, có thể dùng lại trong nhiều phân hệ mà không upload lại.
2. **Upload tiện dụng:** một/nhiều file, theo dõi tiến độ, retry, chống thao tác lặp, điều kiện mạng yếu.
3. **Tổ chức lâu dài:** album thủ công, bộ sưu tập thông minh cơ bản, tags, metadata, tìm kiếm, favorites.
4. **Bảo vệ nội dung:** private by default, quyền riêng theo tài nguyên và album, kiểm soát GPS và tải về.
5. **Chỉnh sửa an toàn:** không phá hủy file gốc; phiên bản ảnh được tham chiếu có chủ đích.
6. **Bảo tồn:** thùng rác 30 ngày, xuất được nội dung, backup và test restore, không cascade-delete gây mất ký ức.
7. **Thiết bị ngang nhau:** mobile và desktop làm được các luồng chính.
8. **Mở rộng:** thuận tiện bổ sung nguồn import, PWA share target, smart AI trong tương lai mà không phá hợp đồng dữ liệu hiện có.

## 1.3. Nguyên tắc kiến trúc NGHIỆP VỤ

- **One logical source, many uses:** cùng một Media Asset xuất hiện ở nhiều album và mô-đun thông qua tham chiếu, không mặc định nhân bản file.
- **Original preservation:** ảnh/video gốc giữ nguyên. Preview, thumbnail và bản sửa là các biến thể độc lập về mặt nghiệp vụ.
- **Explicit sharing:** thêm vào album Shared hoặc photobook Shared không được vô tình lộ asset Private.
- **Privacy everywhere:** quyền ở Viewer, Search, Thumbnail, Export, URL file, Asset Picker, Timeline, metadata và các nơi nhúng phải thống nhất.
- **Safe deletion:** xóa album không xóa asset; xóa asset được kiểm tra tác động, tuân thủ quy trình Trash, chính sách retention, quyền xóa có chủ đích.
- **Observable reliability:** một file được thông báo Completed chỉ khi file đã được lưu và đủ điều kiện sử dụng theo cam kết UI; lỗi preview phải phản ánh đúng trạng thái phụ.
- **Data portability:** có thể lấy file gốc và metadata được cấp phép ra khỏi hệ thống.
- **No impossible background guarantee:** website không tự khẳng định đồng bộ toàn bộ camera roll khi trình duyệt đã đóng.

## 1.4. Ranh giới M02

**M02 chịu trách nhiệm**: nhập media, xác thực file, quản lý asset/file/variant, thumbnail/preview, album/collection, metadata/tag, favorite, quyền của asset/album, tìm kiếm media, usage links, trash, export media, storage dashboard, hợp đồng backup.

**M02 không chịu trách nhiệm**: dàn trang photobook và editor thời gian thực của M01; quản lý nội dung Diary; kế hoạch du lịch M04; bản đồ doanh nghiệp của M03; chi tiêu M07; trò chuyện M09; bảo mật đăng nhập toàn hệ thống M10. M02 phối hợp qua hợp đồng nghiệp vụ, không trực tiếp sửa dữ liệu nguồn của mô-đun khác.

---

# 2. Quyết định D01–D20 đã chốt và phạm vi

> Chủ dự án: **"Tôi chốt toàn bộ đề xuất M02"**. Bảng này là nguồn xác nhận chính thức ở cấp business requirements.

| Mã | Nội dung đã chốt | Kết quả chuẩn hóa | Ưu tiên |
|---|---|---|---|
| D01 | Ảnh và video | Ưu tiên JPEG, PNG, WebP, HEIC, MP4, MOV. Lưu bản gốc hợp lệ, xem bằng preview tương thích khi cần; fallback khi không giải mã được | P0 |
| D02 | Quyền mặc định | Media/album mới mặc định **Private**; chỉ Shared khi chủ động chọn/xác nhận | P0 |
| D03 | Upload hàng loạt | Bắt buộc upload nhiều ảnh/video, queue từng file | P0 |
| D04 | Upload tự động | A Smart Upload và B Recovery P0; C Quick Share P1 tùy thiết bị; D tự đồng bộ mọi ảnh mới là nghiên cứu tương lai, không cam kết chỉ bằng web | P0/P1/P2 |
| D05 | Duplicate | Phát hiện **file giống hệt nội dung**, không dựa vào tên; không phát lộ tài nguyên người khác | P0 |
| D06 | Album | Manual Album và Smart Collection cơ bản | P0 |
| D07 | Một ảnh nhiều album | Quan hệ nhiều-nhiều, không tự sao chép bản gốc | P0 |
| D08 | Chỉnh ảnh | Không phá hủy ảnh gốc; lưu các phiên bản có định danh | P0 |
| D09 | Metadata | Bảo toàn thông tin hữu ích, bổ sung/điều chỉnh thông tin hiển thị, quản lý GPS riêng | P0 |
| D10 | Search | Theo tên, ngày, album, tag, người upload, liên kết và các bộ lọc cơ bản | P0 |
| D11 | Favorites | Đánh dấu yêu thích theo từng tài khoản | P0 |
| D12 | Chia sẻ | Hỗ trợ Share Existing Asset hoặc Create Shared Copy có xác nhận | P0 |
| D13 | Delete | Trash 30 ngày; kiểm tra tham chiếu trước xóa vĩnh viễn | P0 |
| D14 | Export | File gốc, nhiều file, album, metadata theo quyền | P0 |
| D15 | Storage Dashboard | Có trong V1.0 | P0 |
| D16 | Quản lý album chung | Hai người cùng quản lý theo quyền, tránh silent overwrite | P0 |
| D17 | Liên kết | M01, M03, M04, M05 và Our Timeline, có thể mở rộng | P0 |
| D18 | Smart AI Features | Ngoài V1.0 | P2 |
| D19 | Data Protection | Backup, restore và kiểm thử khôi phục | P0 |
| D20 | Mobile/Desktop | Các nghiệp vụ trọng tâm trên cả hai thiết bị | P0 |

## 2.1. Phân chia P0/P1/P2

**P0 — Bắt buộc:** 13 giao diện chức năng (có thể gộp một số dưới dạng tab/panel), upload hàng loạt+retry+duplicate, gallery ảnh/video, manual album, smart collection cơ bản, viewer, media editor ảnh cơ bản, search/filter, tags/metadata, favorites, sharing, per-asset permissions, content reuse, trash 30 ngày, export, storage dashboard, backup/restore tested, desktop/mobile.

**P1 — Ưu tiên cao, chưa bắt buộc V1.0:** nhận ảnh từ menu chia sẻ hệ điều hành khi được hỗ trợ, smart collections phức tạp, bulk album import nâng cao, photo map, workflow tuyển ảnh chuyên biệt cho photobook, liên kết/đồng bộ từ nguồn bên ngoài.

**P2 — Tương lai:** sao lưu toàn bộ ảnh mới tự động trong nền (có thể cần native app), nhận diện khuôn mặt/ảnh tương tự/AI semantic search, tự tạo phim kỷ niệm, gợi ý photobook tự động, media editor chuyên sâu.

## 2.2. Các giá trị tuyệt đối KHÔNG được tự đoán

Chưa có số liệu phê duyệt cho: **max file size**, max video duration, max batch count, lưu trữ quota/cost, kích thước preview, chiến lược video transcoding, loại định dạng con/codec chính xác, tần suất backup, thời hạn giữ backup, SLO upload, mục tiêu thời gian render thư viện và chính sách CDN/cache. Đó là **tham số triển khai/cấu hình phải được chốt trong tài liệu kỹ thuật**, không được âm thầm xem các giá trị ngẫu nhiên là quyết định nghiệp vụ.

**Riêng thời gian Trash: 30 ngày đã được chốt.** Phải đồng bộ chính sách này với M01 (có yêu cầu ít nhất 30 ngày).

---

# 3. Vai trò, thuật ngữ và định nghĩa nghiệp vụ

| Thuật ngữ | Định nghĩa |
|---|---|
| User | Một trong hai tài khoản đăng nhập chính |
| Owner | Chủ sở hữu nghiệp vụ của Media Asset/Album |
| Editor | Người được cấp quyền chỉnh sửa thuộc tính/quản lý đối tượng theo phạm vi |
| Viewer | Người có quyền đọc/xem nhưng không sửa |
| Media Asset | Đối tượng ảnh/video logic trong Our Space, có định danh riêng |
| Original File | Tệp gốc đã upload/import thành công, giữ nguyên tính toàn vẹn |
| Media Variant | Phiên bản tạo thêm: crop, chỉnh sáng, thumbnail, preview ... |
| Media Metadata | Thuộc tính kỹ thuật gốc và trường do người dùng quản lý |
| Manual Album | Bộ sưu tập do user chủ động thêm/bớt media |
| Smart Collection | Bộ sưu tập động được sinh từ các quy tắc lọc có sẵn |
| Album Membership | Quan hệ asset thuộc một album, không phải ownership của asset |
| Upload Session / Item | Đợt upload / từng file trong một đợt |
| Content Usage | Tham chiếu từ Photobook, Diary, Place, Trip, Event ... tới asset hoặc variant |
| Share Existing | Cấp thêm quyền vào cùng một asset logic |
| Shared Copy | Tạo đối tượng/bản sao chia sẻ có vòng đời quyền độc lập; nguồn gốc được ghi nhận |
| Trash | Trạng thái xóa mềm có thể khôi phục trong thời hạn |
| Export | Trích xuất nội dung theo yêu cầu của user đã kiểm quyền |
| Backup | Sao lưu phục vụ phục hồi hệ thống, khác export/download |

## 3.1. Quyền và người dùng

- Hai tài khoản chính có danh tính riêng. **Sở hữu không đồng nghĩa quản trị tuyệt đối mọi nội dung người kia**.
- Media có thể Private hoặc được chia sẻ cho người còn lại; album có quyền riêng.
- Một ảnh xuất hiện ở chỗ nào không tự động thay đổi Owner của ảnh.
- Mọi kết quả quyền phải dựa trên tài khoản hiện hành và thời điểm thao tác; không tin trạng thái UI cũ.

---

# 4. Mô hình đối tượng, quan hệ và trạng thái

> Mô hình này nêu **ý nghĩa và invariant**, không chỉ định tên bảng hoặc ORM. Codex có thể thiết kế schema kỹ thuật sau khi đối chiếu tài liệu chung.

## 4.1. Danh mục thực thể nghiệp vụ

| ID | Đối tượng | Thuộc tính nghiệp vụ tối thiểu | Quan hệ |
|---|---|---|---|
| ENT-M02-01 | Media Asset | Id, owner, mediaType, title, description, visibility, status, createdAt, updatedAt | 1-n variants/files, n-n albums/tags/usages |
| ENT-M02-02 | Media File | Id, assetId, original name, file type, size, integrity indicator, storage identity, state | Một asset có bản gốc/những file liên quan |
| ENT-M02-03 | Media Variant | Id, assetId, variantKind, sourceVariant, edit description, createdAt, state | Bản xem nhanh, bản chỉnh sửa, bản tương thích |
| ENT-M02-04 | Album | Id, owner, name, description, coverRef, visibility, state, timestamps | n-n media |
| ENT-M02-05 | Album Membership | AlbumId, AssetId, order/addedAt, addedBy | N-n không nhân bản file |
| ENT-M02-06 | Tag | Id, value, scope/owner | Có thể tái dùng trong thư viện |
| ENT-M02-07 | Media Tag | MediaId, TagId | N-n |
| ENT-M02-08 | Media Metadata | originalName, capturedAt, uploadedAt, memoryDate, resolution, duration, location detail nếu có, provenance | Phân biệt metadata gốc và user-managed |
| ENT-M02-09 | Upload Session | Id, owner, targetAlbum, chosenVisibility, startedAt, status | 1-n upload items |
| ENT-M02-10 | Upload Item | Id, sessionId, file fingerprint, progress, state, error, optionalAssetId | Retry/idempotency per item |
| ENT-M02-11 | Media Permission | ResourceId, subject, role, canDownload, scope, timestamps | Asset và album, kiểm tra kế thừa/chia sẻ |
| ENT-M02-12 | Media Usage | SourceMedia/Variant, consumerModule, consumerItem, usage type, source status | Dùng cho cảnh báo, điều phối xóa |
| ENT-M02-13 | Favorite | UserId, MediaId, createdAt | Cá nhân, không tự chia sẻ |
| ENT-M02-14 | Trash Record | ResourceId, resourceType, deletedBy, deletedAt, scheduledPurgeAt, dependencies | 30 ngày |
| ENT-M02-15 | Export Job | Id, requestedBy, selected scope, state, result, error, createdAt | Kiểm quyền tại thời điểm thực thi và giao file |

## 4.2. Cardinality và quan hệ

- `Media Asset 1 — N Media File/Variant`: một asset logic có thể có file gốc và nhiều biến thể, không cần sao chép gốc cho từng album.
- `Album N — N Media Asset` qua Membership. Một ảnh thuộc 0, 1 hoặc nhiều album.
- `User N — N Media Asset` qua Favorite theo từng tài khoản, nhưng mỗi cặp tài khoản–asset chỉ có một trạng thái Favorite.
- `Media Asset N — N Tag` qua Media Tag.
- `Media Asset/Variant 1 — N Media Usage` liên kết tới M01/M03/M04/M05/timeline, chỉ có ý nghĩa tham chiếu, không gộp toàn bộ dữ liệu khác phân hệ vào M02.
- `Album 1 — N Membership`: xóa Membership không được xóa Media Asset.
- `Media Asset 1 — N Media Variant`: sử dụng phiên bản B không làm đổi phiên bản A và ngược lại.

## 4.3. Metadata — ba loại mốc thời gian

| Trường | Ý nghĩa | Nguyên tắc |
|---|---|---|
| capturedAt | Dấu thời gian ghi trong file/thiết bị | Có thể thiếu, có offset/timezone hoặc độ tin cậy thấp |
| uploadedAt | Khi upload được ghi nhận trong hệ thống | Độc lập với ngày chụp |
| memoryDate | Ngày kỷ niệm do user gắn cho ảnh | Có thể khác hoàn toàn ngày chụp và upload |

Không tự coi `uploadedAt` là `capturedAt` nếu file không có metadata. Cho user chọn **ngày dùng để nhóm/sắp xếp** và hiển thị lý do khi ngày không xác định. Phải lưu nguồn gốc các thông tin đã điều chỉnh và xử lý lệch múi giờ nhất quán. Hiển thị GPS chính xác là quyền riêng, không mặc định theo quyền xem ảnh.

## 4.4. Trạng thái asset, variant, album

**Media Asset:** `Processing` → `Ready` → `Trashed` → `Purged` (ngoài ra `Failed/Unsupported` khi không thể xác minh nội dung hợp lệ). Không coi một bản ghi upload chưa hoàn tất là asset Ready.

**Media Variant:** `Pending` → `Processing` → `Ready` hoặc `Failed`. Variant lỗi không làm tự xóa original.

**Album:** `Active` → `Trashed` → `Purged` hoặc `Active` qua Restore.

**Smart Collection:** định nghĩa bộ lọc và scope quyền. Kết quả được tính động, không lưu thành bản sao file. Nếu cho pin thủ công sau này phải định nghĩa nghiệp vụ riêng.

## 4.5. Trạng thái upload item

`Queued → Validating → Uploading → Processing → Completed`.

Nhánh đặc biệt: `Paused`, `Failed`, `Cancelled`, `DuplicateResolutionRequired`. Các nhánh có thể Retry/Resume khi đủ điều kiện.

- `Completed` = file đã được chấp nhận, lưu và có thể sử dụng theo contract. Nếu preview phụ thất bại nhưng original hợp lệ, ghi rõ trạng thái preview và fallback, không ghi nhãn hoàn tất việc xử lý preview.
- Lỗi file X không khiến file Y mất kết quả thành công.
- Khi Retry hoặc submit lại cùng operation không sinh lặp asset ngoài ý muốn.
- Client hiển thị tiến độ chỉ mang tính giao diện; kết quả cuối phải căn cứ trạng thái hệ thống xác nhận.

## 4.6. Ví dụ liên kết

Một ảnh `IMG_2045.HEIC` có thể ở album `Our First Year` và `Dalat Trip`, được đánh dấu Favorite bởi A, xuất hiện trong Diary `Ngày đi Đà Lạt`, phiên bản crop của nó được dùng trong Photobook `Our Dalat Memories`, và cũng liên kết tới Trip M04. Cả các quan hệ này **không yêu cầu upload lại file gốc**. Nếu xóa album `Dalat Trip`, ảnh gốc và các liên kết còn lại vẫn tồn tại.

---

# 5. Sitemap và tổng quan 13 màn hình

| Mã | Tên | Nơi truy cập | Mục đích |
|---|---|---|---|
| ML-01 | Media Library Home | Menu Memories/Media | Tổng quan, gần đây, album, entry actions |
| ML-02 | All Photos | Home > Photos | Gallery ảnh theo timeline, lọc/chọn hàng loạt |
| ML-03 | All Videos | Home > Videos | Video grid/list, play, thông tin duration |
| ML-04 | Upload Center | Upload từ mọi điểm hỗ trợ | Queue, validate, retry, rights, album |
| ML-05 | Albums Library | Home > Albums | Liệt kê manual album và smart collections |
| ML-06 | Album Detail | Chọn album | Media thành viên, cover, edit, share, manage |
| ML-07 | Media Viewer | Chọn ảnh/video | Xem lớn, thông tin, liên kết, actions |
| ML-08 | Media Editor | Viewer > Edit | Crop/rotate/flip/basic adjust, save variant |
| ML-09 | Search & Filters | Search | Tìm kiếm/kết hợp bộ lọc |
| ML-10 | Favorites | Home > Favorites | Danh sách ảnh/video user đánh dấu |
| ML-11 | Shared With Me | Home > Shared | Nội dung được chia sẻ cho tài khoản |
| ML-12 | Trash | Library menu | Xem, restore, xóa vĩnh viễn theo quyền |
| ML-13 | Storage & Export | Library settings | Storage dashboard, export jobs, quyền và backup status phù hợp |

### Navigation và điều kiện quyền

- Header chính: Back/Breadcrumb, Search, Upload, menu xem nhanh.
- Trên desktop: sidebar hoặc tabs; ảnh dạng grid thích ứng; panel metadata khi xem chi tiết.
- Trên mobile: tabs/drawer, nút Upload rõ ràng, lưới ảnh cuộn dọc, trình xem toàn màn hình, lựa chọn nhiều bằng chạm giữ hoặc chế độ Select.
- Thay đổi tab/filter phải giữ quyền theo tài khoản. Không render nội dung Private ở phần đệm, thumbnail, counter hay tooltip của tài khoản khác.
- Các chức năng cần xác nhận phá hủy hoặc chia sẻ phải có cảnh báo tường minh.

---

# 6. Đặc tả chi tiết ML-01 đến ML-03

## 6.1. ML-01 — Media Library Home

**Mục đích:** lối vào toàn bộ thư viện; thống kê và hiển thị kỷ niệm gần đây được phép xem.

**Thành phần:** (1) tiêu đề `Our Memories`; (2) thanh tìm kiếm; (3) hành động Upload; (4) shortcuts Photos / Videos / Albums / Favorites / Shared / Trash; (5) Recently Added; (6) Recently Captured hoặc Memory Timeline; (7) Albums nổi bật; (8) số lượng và dung lượng thuộc phạm vi user có quyền xem.

**Hành vi:**

- Chọn Upload mở ML-04, có thể nhận ngữ cảnh album nếu bắt đầu tại album.
- Chọn media mở ML-07 với ngữ cảnh danh sách hiện thời; quay lại giữ filter/scroll khi khả thi.
- `Recently Added` sắp theo thời điểm được đưa vào thư viện, **khác** `Memory Timeline` có ngày chụp/kỷ niệm.
- Empty state: khi chưa có ảnh, hiển thị hướng dẫn upload đầu tiên hoặc tạo album, không hiện thống kê giả.
- Thumbnail đang lỗi xử lý: placeholder + trạng thái, không hiển thị file người dùng khác.
- Mọi card và thống kê đều scoped theo quyền hiện tại.

**Acceptance link:** AC-M02-11, AC-M02-31, AC-M02-48, AC-M02-49.

## 6.2. ML-02 — All Photos

**Bố cục:** grid ảnh, grouping Day/Month/Year, bộ chọn cách sắp `Memory Date / Captured Date / Uploaded Date`, filter, chọn nhiều file, menu hàng loạt.

**Actions:** View, Favorite/Unfavorite, Add to Album, Add to Photobook (qua hợp đồng M01), Edit metadata, Share, Download (khi có quyền), Trash, Select All trong phạm vi kết quả phù hợp và quyền hiện tại.

**Quy tắc:**

- Không tải toàn bộ thư viện nhiều năm để render trang đầu; hỗ trợ phân trang/tải theo nhu cầu.
- Ảnh thiếu ngày chụp được đưa vào nhóm `Unknown Capture Date` hoặc phân loại theo trường user chọn, không gán ngày giả.
- Batch action có kiểm tra quyền **cho từng ảnh**; một ảnh lỗi không nên làm mất cập nhật thành công ở những ảnh khác. Hiển thị báo cáo kết quả từng loại.
- Nếu đang tìm kiếm/filter, Viewer chỉ chuyển ảnh trong kết quả đó.
- Lựa chọn nhiều ảnh trên mobile phải có cách thoát và xem số ảnh đã chọn.

**Acceptance link:** AC-M02-11, 12, 29, 30, 47.

## 6.3. ML-03 — All Videos

**Bố cục:** thumbnail, duration, file format, upload date/capture date, play/view, tags và quyền. Có filter video tách riêng với ảnh.

**Actions:** Play, View Details, Add to Album, Download Original (nếu đủ quyền), Favorite, Share, Trash, Search.

**Quy tắc:**

- Video có thể có bản xem tương thích riêng nhưng bản gốc phải được giữ.
- Nếu codec/container được chấp nhận để lưu nhưng không phát được trên thiết bị, phải thông báo và cung cấp phương án hỗ trợ tương thích hoặc Download khi có quyền.
- Video Processing và preview lỗi hiển thị đúng trạng thái; không khẳng định play được nếu chưa kiểm chứng.
- Không mặc định video trong M02 sẽ được nhúng/chạy trong photobook M01, vì yêu cầu đó ở M01 không nằm trong phạm vi P0 đã chốt.
- Tránh tự phát video hàng loạt, tránh tải file gốc lớn chỉ để hiển thị danh sách.

**Acceptance link:** AC-M02-23, 28, 47, 48.

---
# 7. Upload Center, kiểm tra file và đồng bộ ảnh

## 7.1. ML-04 — Upload Center: bố cục và thành phần

**Entrypoints:** nút Upload tại ML-01/02/03/06, thao tác chọn file trong M01 Asset Picker, hoặc ngữ cảnh share/import được hỗ trợ trong tương lai.

**UI bắt buộc:**

1. `Choose Files` chọn một hoặc nhiều ảnh/video trên desktop/mobile.
2. `Drag & Drop Zone` trên desktop.
3. Danh sách thumbnail/tên/định dạng/dung lượng, đánh dấu file không hợp lệ.
4. Thiết lập `Target Album` (tùy chọn), `Visibility` (mặc định Private) và các quyền chia sẻ nếu có.
5. Cảnh báo tổng số file, tổng dung lượng ước lượng và giới hạn theo cấu hình.
6. Các trạng thái `Queued`, `Validating`, `Uploading`, `Processing`, `Completed`, `Paused`, `Failed`, `Cancelled`, `DuplicateResolutionRequired`.
7. Progress từng item và tiến trình toàn batch, không đánh tráo số file Completed với số file đã chọn.
8. Actions phù hợp: `Start`, `Pause` (nếu hỗ trợ), `Retry Failed`, `Cancel Pending`, `Open Completed`, `Close With Warning`.
9. Báo cáo tổng kết batch: số thành công/thất bại/bỏ qua/được xử lý như duplicate; liên kết mở media vừa upload.

**Quy tắc:** Upload khởi tạo ở phạm vi tài khoản hiện tại, không tự Shared. Nếu được bắt đầu từ album Shared, UI phải hiển thị lựa chọn rõ về việc thêm asset Private, đồng thời yêu cầu xác nhận khi cần mở quyền cho người khác.

## 7.2. Dòng xử lý mỗi upload item

`Selected → Queued → Validating → [Duplicate Check] → Uploading → Processing → Completed`.

**Validate:** kiểm tra MIME/định dạng thực tế, phần mở rộng như thông tin bổ trợ, giới hạn cấu hình, file rỗng/hỏng, chỉ ảnh/video được phép; reject an toàn với file ngụy trang hoặc nguy hiểm. Không tin tên file hoặc Content-Type do client tự khai là đủ.

**Duplicate Check:** nhận diện file trùng **nội dung** trong phạm vi user có quyền quản lý/tái sử dụng. Không công khai một file Private của B cho A bằng thông điệp "file đã tồn tại" nếu A không được biết. Hai file trùng tên nhưng byte khác nhau không là duplicate xác định.

**Kết quả duplicate:**
- `Use Existing`: dùng lại asset hiện có, có thể thêm vào album mới (nếu đủ quyền).
- `Keep Separate`: tạo media logic mới khi chính sách cho phép, ghi nhận đây là bản riêng.
- `Cancel`: hủy item; không tác động file cũ.

Cần phân biệt **deduplicate storage vật lý** (quyết định kỹ thuật nội bộ) với **deduplicate tài nguyên logic** (quyết định người dùng). Hai người có thể sở hữu các media logic khác nhau và quyền khác nhau dù file byte giống hệt; không được gộp quyền truy cập chỉ vì storage dùng chung bản blob.

## 7.3. Tính nguyên tử theo file, idempotency và retry

- Mỗi upload item độc lập: nếu 20 ảnh có 2 lỗi, 18 ảnh Ready/Completed không bị rollback.
- Thao tác retry do sự cố mạng hoặc người dùng bấm hai lần không được tạo hai tài nguyên logic vô ý cho **cùng một upload operation**.
- Nếu upload đã gửi thành công nhưng client chưa nhận xác nhận, truy vấn kết quả từ hệ thống trước khi khởi tạo một upload mới.
- Nếu lỗi có thể khắc phục, chỉ retry các item chưa thành công; hiển thị số lần/lý do khi phù hợp.
- Cancel khi đã Completed không tự xóa asset; muốn xóa phải qua nghiệp vụ Delete/Trash.
- Xóa item thất bại trong hàng đợi không được xóa asset đã tồn tại trong Library.
- Từng file lưu owner, quyền, metadata và dấu thời gian chính xác sau khi hoàn tất.

## 7.4. Smart Upload / Recovery / Quick Share / Automatic Backup

| Cấp | Yêu cầu nghiệp vụ | V1.0 |
|---|---|---|
| A — Smart Upload | Chọn nhiều file, xử lý queue có progress, metadata, album, quyền, duplicate, thông báo kết quả | **P0** |
| B — Upload Recovery | Retry; resume từng phần trong phạm vi thiết bị/giao thức được hỗ trợ; không upload lại file đã xác nhận thành công | **P0**, không cam kết phục hồi byte ở mọi trình duyệt |
| C — Quick Share | Người dùng chọn ảnh từ Share menu hệ điều hành, chuyển vào Our Space khi môi trường cho phép, fallback chọn file | **P1** |
| D — Automatic Phone Backup | Mọi ảnh mới tự đồng bộ kể cả khi không mở web | **P2 / nghiên cứu bổ sung** |

**M02 V1.0 KHÔNG được tuyên bố "tự đồng bộ mọi ảnh mới".** Ứng dụng web không thể luôn đọc Camera Roll hoặc âm thầm tải file khi đóng trên mọi nền tảng. Tính năng về sau cần người dùng chủ động đồng ý, nguồn dữ liệu rõ ràng, quyền riêng theo tài nguyên, quyền tắt đồng bộ và chính sách tiêu thụ mạng/pin.

**Khi đóng tab/mất mạng:** tối thiểu phải cảnh báo các item chưa Completed, bảo toàn dữ liệu đã lưu và hỗ trợ khởi tạo retry an toàn. Giữ queue qua reload là mục tiêu P0 ở mức khả thi. Nếu trình duyệt không còn quyền truy cập file cục bộ, có thể yêu cầu chọn lại file; không được cam kết khôi phục tuyệt đối.

## 7.5. Định dạng cần xét nghiệm thu

- Ảnh **JPEG, PNG, WebP, HEIC**.
- Video **MP4, MOV**.
- `Accepted to store` khác `Playable/previewable on current browser`. Nếu asset được nhận lưu nhưng không hỗ trợ decode tại client, có thể cung cấp bản preview tương thích hoặc thông báo có thể tải original khi đủ quyền.
- Hỗ trợ chuyển hướng ảnh theo orientation metadata, không làm sai preview.
- Bản gốc không được âm thầm thay thế bằng bản nén/transcode mà người dùng không hay biết.
- `HEIC`, `MOV` có sự đa dạng về codec; không được tuyên bố hỗ trợ tuyệt đối mọi biến thể mà không kiểm thử. Cần có danh sách codec và cơ chế fallback trong đặc tả kỹ thuật.
- `Live Photo` đầy đủ chưa là P0. Nếu nhận file thành phần, phải nói rõ cách hiển thị/nhập; không quảng cáo là Live Photo hoàn chỉnh.

## 7.6. Các tình huống UI cụ thể

**Ví dụ batch 20 ảnh:** 18 Completed, 2 Failed. Batch banner phải ghi "18 thành công, 2 lỗi", nút Retry chỉ xử lý 2 file; khi thành công tổng 20, không nhân đôi 18 file cũ.

**Người dùng upload vào Shared Album:** nếu media Private mới upload, cần phân biệt `lưu Private và chỉ chủ sở hữu xem` với `chia sẻ để thành viên album xem`. Không tự nâng visibility theo album mà không có xác nhận.

**Quota gần đầy:** cảnh báo trước Start khi có đủ thông tin; nếu quota bị vượt giữa chừng, đánh dấu rõ các file không nhận thêm, các file Completed giữ nguyên. Không tự xóa bản cũ để lấy chỗ trống.

**Ngắt mạng lúc Processing:** hệ thống vẫn phân biệt upload bytes đã hoàn tất với preview đang xử lý; khi user quay lại phải kiểm tra trạng thái thực, không tự tạo asset thứ hai.

## 7.7. Biên bản hoàn tất upload

Sau mỗi batch, cung cấp: thời điểm, tổng file, thành công, thất bại, skipped/cancelled, duplicate resolved, album nhận, phạm vi quyền và links tới media đã tạo. Nếu có file lỗi, có cách lọc danh sách lỗi và retry. Không được hiển thị dữ liệu private của người khác để giải thích duplicate.

---

# 8. Albums, Smart Collections và tổ chức nội dung

## 8.1. ML-05 — Albums Library

**Màn hình gồm:** `All Albums`, `My Albums`, `Shared Albums`, `Smart Collections`, ô tìm tên album, sắp xếp tên/ngày tạo/ngày cập nhật, nút Create Album, cover card, badge Private/Shared.

**Actions theo quyền:** Create, Open, Rename, Change Cover, Share, Change Visibility, Archive/Trash, Duplicate Collection Definition nếu sau này được hỗ trợ.

**Trường của album:** Id, tên, mô tả, cover, owner, visibility, collaborators/roles, trạng thái, createdAt/updatedAt, các membership; có thể có liên kết sang Trip/Diary/Place.

**Empty states:** chưa có album → tạo album đầu tiên. Không có shared albums → gợi ý chủ động chia sẻ. Không có media → album rỗng là trạng thái hợp lệ.

**Tạo album:** nhập tên bắt buộc, mô tả tùy chọn, cover tùy chọn, visibility mặc định Private, cấp quyền nếu Shared; hoàn tất tạo album rỗng và thêm media sau. Tên trùng nhau được chấp nhận nếu định danh riêng và không gây nhầm lẫn hệ thống.

## 8.2. ML-06 — Album Detail

**Thông tin:** cover, tên/mô tả, owner, thành viên được chia sẻ, số media hiển thị theo quyền, ngày cập nhật, badge quyền, danh sách ảnh/video và thứ tự, liên kết nguồn nếu album gắn Trip/Diary.

**Actions:** `Add Existing Media`, `Upload Into Album`, `Select Multiple`, `Remove From Album`, `Set Cover`, `Edit Album`, `Share`, `Export Album`, `Trash Album`, `Sort/Reorder` (manual album).

**Quy tắc:**
- `Remove From Album` xóa membership, không xóa original, variant hay usage trong phân hệ khác.
- `Delete Album` tác động album/quan hệ, không cascade-delete asset.
- Tên, cover, thứ tự membership là thuộc tính album, có thể chỉnh theo quyền album.
- Hai người cùng thêm ảnh vào album Shared: cả hai cập nhật được giữ. Nếu cùng sửa metadata như tên/cover, hệ thống phát hiện bản cập nhật cũ và thông báo/giải quyết, không silently overwrite.
- Quyền xem album **không tự bảo đảm quyền xem media thành viên**. Nếu ảnh Private chưa được chia sẻ, người còn lại không thấy nội dung đó.
- Không để số lượng ảnh hoặc icon đặc biệt tiết lộ sự tồn tại media Private thuộc tài khoản khác.

## 8.3. Manual Album

- User chủ động thêm/bớt 0..N asset.
- Một media có thể có ở nhiều album, kể cả album riêng và album chung với điều kiện quyền đúng.
- Cần cho xem album trống, có cover mặc định, sắp xếp tùy chọn.
- Nếu có thứ tự thủ công, hai người cùng reorder phải có thứ tự cuối nhất quán và tránh mất membership.
- Đổi tên album không làm đổi asset, usage hay metadata gốc.

## 8.4. Smart Collection (cơ bản, P0)

**Định nghĩa:** danh sách được tính lại từ tập hợp điều kiện lọc, không cần user thêm membership cố định và không tạo bản copy media.

**Bộ điều kiện cơ bản:** loại ảnh/video, album (được phép), khoảng ngày chụp/ngày kỷ niệm/ngày upload, Favorite cá nhân, tags, chủ sở hữu/uploader, liên kết Trip/Diary, quyền truy cập.

**Bộ sưu tập mặc định đề xuất:** `Recently Added`, `By Year`, `Favorites`, `Shared With Me`, `By Trip/Event (when available)`.

**Quy tắc:**
- Smart Collection không được tạo ảnh mới hoặc thay quyền ảnh gốc.
- Khi file/tag/quyền thay đổi, kết quả sẽ thay đổi theo.
- Điều kiện lọc thuộc phạm vi quyền user, không trả về media không được xem.
- Nếu hai người chia sẻ một Smart Collection, việc chia sẻ bộ lọc không đồng nghĩa chia sẻ quyền của các asset kết quả.
- Các quy tắc tìm khuôn mặt, AI phân loại theo nội dung nằm ngoài P0.

## 8.5. Album share vs Asset share — tình huống chuẩn

**Given:** A tạo ảnh X ở Private, album Y là Shared với B. **When:** A thêm X vào Y. **Then:** hệ thống hỏi rõ A muốn:

1. `Keep Private` — X vẫn Private, B không thể xem X trong Y.
2. `Share Existing` — cấp quyền B xem X, đồng thời hiển thị phạm vi ảnh có thể được sử dụng ở nơi khác.
3. `Create Shared Copy` — tạo asset logic độc lập được chia sẻ, ghi nguồn gốc và giữ bản gốc của A Private.

Không tự chọn 2 hoặc 3 mà không có xác nhận. Nếu user không quyết định, giữ quyền Private an toàn.

---

# 9. Media Viewer, Editor, Search, Favorites

## 9.1. ML-07 — Media Viewer

**Input:** MediaId và context hiện tại (album, filter, favorites, results). **Điều kiện:** đủ quyền View.

**UI:** ảnh lớn/video player, prev/next trong context, zoom, fullscreen, file title/description, capturedAt/uploadedAt/memoryDate, metadata được phép, tags, albums được phép xem, owner/uploader khi được phép, related memories, Favorite, Edit, Add to Album, Add to Photobook, Share, Download Original, Trash theo quyền.

**Hành vi:**
- Prev/Next chỉ duyệt kết quả trong context ban đầu và các file còn đủ quyền.
- Nếu asset biến mất/đã trashed/bị thu hồi quyền, hiển thị màn hình trạng thái, không tiếp tục trả file private từ endpoint/bản cache không phù hợp.
- Không hiển thị tên album Private của người khác, ngay cả khi asset đang được họ sử dụng.
- Vị trí GPS chi tiết cần quyền riêng/option riêng, không tự mở cùng toàn bộ metadata.
- Video không phát được: giải thích và cho Download Original khi có quyền.
- Viewer đang mở trên điện thoại: hỗ trợ pinch zoom, vuốt chuyển, nút Back, info mở dưới dạng panel.
- Phân biệt Preview Variant với Original. Nếu xem preview thì tên file và dung lượng original không bị sửa theo preview.

## 9.2. ML-08 — Media Editor (ảnh, P0)

**Tính năng:** `Crop`, `Rotate`, `Flip Horizontal`, `Flip Vertical`, `Aspect Ratio`, `Brightness`, `Contrast`, `Saturation`, `Reset`, `Preview`, `Save Version`.

**Không thuộc P0:** object removal, face correction, background erase, AI upscaling, hiệu ứng đặc biệt, dựng video.

**Luồng:**

1. Mở Media Viewer của một ảnh có quyền Edit.
2. Chọn Edit → hiển thị working preview và công cụ tương ứng.
3. Thao tác crop/rotate/flip/color, có reset trước khi lưu.
4. Chọn Save Version → lưu một variant mới kèm nguồn gốc.
5. Sau lưu, user có thể chọn original hay variant làm asset dùng trong Album, Diary hoặc Photobook.
6. Mọi nơi đã tham chiếu một variant cố định phải tiếp tục hiển thị cùng kết quả cho đến khi user chủ động thay đổi tham chiếu.

**Nguyên tắc bảo toàn:**
- Original file bất biến. `Reset` đưa bản xem đang chỉnh về giá trị gốc/điểm khởi đầu, không xóa original.
- Nếu Save Version thất bại, original và variant hợp lệ trước đó không hỏng.
- Chỉnh A không được tự đổi B đang nằm trong sách Published.
- Có thể mở bản gốc để tạo một phiên bản khác mà không cần biến đổi nối tiếp tất cả variant cũ.
- Quyền tạo variant không tự cấp quyền download original cho người xem khác.

## 9.3. ML-09 — Search & Filters

**Searchable fields P0:** tên file, tiêu đề, mô tả, tags, manual albums, dates captured/uploaded/memory, người upload, media type, Favorite, related Trip/Event/Diary/Photobook theo quan hệ được phép, địa điểm gắn thủ công.

**Filters:** nhiều điều kiện có thể áp đồng thời, mô tả rõ kết quả là giao của các điều kiện AND (trừ khi UI nói khác). Người dùng có thể xóa một filter hoặc Clear All.

**Sort:** theo ngày chụp, ngày upload, ngày kỷ niệm, ngày cập nhật, tên (có quy tắc ổn định khi trùng giá trị).

**Permission-first:**
- Không index/search preview media private cho người không có quyền.
- Suggestion/autocomplete, counters, album names, tags, places, owner summary, liên kết sử dụng đều không được gián tiếp tiết lộ media private.
- Nếu mốc `capturedAt` không có, không bịa ngày; lọc theo ngày chụp không trả sai kết quả.
- Hỗ trợ kết quả rỗng rõ ràng, không báo lỗi giả.
- Với kho ảnh lớn, sử dụng phân trang/lazy-load và trạng thái loading.

**Ví dụ:** tìm `photos`, `year 2027`, `Trip: Đà Lạt`, `favorites of me` → chỉ trả các media có đủ quyền và thỏa mọi điều kiện.

## 9.4. ML-10 — Favorites

- Favorite là thuộc tính mối quan hệ User × Media. A favorite không khiến B tự favorite.
- Favorite không tự share asset, không tự thêm vào Shared Album.
- Favorites có thể lọc ảnh/video và sắp theo ngày đánh dấu/ngày kỷ niệm.
- Xóa Favorite chỉ xóa đánh dấu, không xóa asset hoặc album.
- Nếu user mất quyền xem asset đã Favorite, asset không còn hiện trong Favorites; khi quyền được phục hồi có thể khôi phục trạng thái favorite theo chính sách dữ liệu nếu asset vẫn còn.

## 9.5. ML-11 — Shared With Me

- Danh sách asset và album được cấp quyền trực tiếp hoặc qua phạm vi chia sẻ hợp lệ.
- Có thể nhóm theo người chia sẻ, thời điểm chia sẻ, loại nội dung.
- Hiển thị role hiện tại, quyền download hiện tại và các thao tác được phép.
- Không xem được asset Private chưa được share, kể cả khi nó xuất hiện trong danh sách membership của album mà user được xem.
- Quyền thay đổi phải áp dụng cho truy cập tiếp theo, cả đường dẫn trực tiếp và các nơi liên kết khác.

---

# 10. Chia sẻ, phân quyền và bảo vệ riêng tư

## 10.1. Mô hình quyền đề xuất đã chốt theo định hướng

| Role trên tài nguyên | View | Edit metadata/variants | Share/Change Rights | Trash | Download Original |
|---|---:|---:|---:|---:|---:|
| Owner | Có | Có | Có | Có | Có |
| Editor | Có | Có | Theo ủy quyền riêng | Theo ủy quyền riêng | Theo quyền Download |
| Viewer | Có | Không | Không | Không | Theo quyền Download |
| No Access | Không | Không | Không | Không | Không |

**Download là quyền riêng** so với View. Chủ sở hữu có quyền download file hợp lệ. Editor/Viewer chỉ tải file bằng chức năng chính thức nếu canDownload được cấp. Không hứa ngăn tuyệt đối chụp màn hình hoặc lấy ảnh đã render ngoài ứng dụng.

**Default:** asset Private, album Private. Mọi đường dẫn chia sẻ ra ngoài cho khách **không thuộc P0 của V1.0** (đồng nhất với M01), trừ khi sau này được duyệt.

## 10.2. Các nguyên tắc đánh giá quyền

1. Mọi thao tác đọc/ghi phải kiểm quyền tại nguồn dữ liệu/file; ẩn nút chỉ là UX.
2. Quyền có thể thay đổi sau khi UI đã tải xong; không coi session cũ là giấy phép vĩnh viễn.
3. Tài nguyên Private không được xuất hiện qua URL original/preview/thumbnail/cache/search/export/metadata/Asset Picker của tài khoản khác.
4. Quyền album và quyền asset là **hai lớp**: được nhìn thấy album không tự cấp quyền vào asset Private.
5. Khi asset được chia sẻ vào album, quyết định chia sẻ phải rõ; người tạo có thể để asset Private và thành viên khác chỉ thấy phần được phép.
6. Album Membership riêng tư không tiết lộ vị trí hoặc số lượng media Private.
7. Khi share copy, phải có owner/quyền/vòng đời của copy riêng biệt. Xóa/quyền trên original không tự xóa/thu hồi bản copy đã chia sẻ hợp lệ, trừ yêu cầu pháp lý/chính sách đã chốt và được thực thi rõ.
8. Một asset liên kết sang M01/M03/M04/M05 vẫn chịu kiểm quyền. Không tin rằng "đã được dùng trong photobook" là được phép phát original vĩnh viễn.
9. Việc hiển thị thumbnail hoặc preview là đọc nội dung, phải kiểm quyền như file gốc.
10. Quản trị/phục hồi backup không tự cho tài khoản cá nhân quyền vượt cấp trong UI.

## 10.3. Share Existing Asset

**Tiền điều kiện:** người thao tác có quyền Share. **Hành vi:** chọn người nhận (người còn lại), role và canDownload nếu có, xác nhận phạm vi. Không thay owner. Ghi lại nguồn gốc chia sẻ theo khả năng cần audit. Người nhận nhìn thấy asset trong `Shared With Me`, Asset Picker và nơi được phép sử dụng.

**Thu hồi:** cập nhật Viewer/Asset Picker/Search/Export/URLs; không cam kết thu hồi dữ liệu người nhận đã tải xuống hợp lệ ở thời điểm trước.

## 10.4. Create Shared Copy

**Tiền điều kiện:** có quyền tạo bản sao/cho phép share theo chính sách nguồn. **Hành vi:** tạo asset logic độc lập có tên/metadata/quyền tương ứng, ghi nguồn gốc provenance và chọn người được chia sẻ. Có thể dùng chung blob vật lý nếu bảo đảm isolation, nhưng không được dùng chung ownership.

**Khác biệt bắt buộc:** quyền, vòng đời và thay đổi metadata/variant của copy độc lập so với original. Nếu copy được dùng trong photobook thì thao tác thay đổi original không tự đổi nội dung đã gắn.

## 10.5. GPS, EXIF và dữ liệu cá nhân

- File có GPS không mặc định công khai vị trí chính xác khi chia sẻ.
- Chia trường `hasLocation`, `approximate/manual place`, `exactGPS` khi cần; `exactGPS` mặc định Private.
- Khi Export Original, thông báo nếu original có thể chứa EXIF/GPS nhạy cảm. Nếu xuất qua định dạng chia sẻ đã loại metadata, phải nói rõ khác original.
- Không tự suy diễn địa điểm từ GPS rồi tự gắn nhãn chia sẻ với người kia khi chưa có hành động/đồng ý.
- Việc sao lưu cũng phải bảo vệ GPS/EXIF như mọi dữ liệu nhạy cảm khác.

## 10.6. Phân quyền album trong cộng tác

- Owner có quyền thay đổi album, Editor theo ủy quyền được thêm/bớt media, sửa tên/cover; Viewer chỉ xem nội dung được phép.
- Hai Editor đồng thời thêm asset khác nhau: giữ cả hai membership hợp lệ.
- Nếu cùng đổi tên/cover/order: dùng cơ chế phát hiện xung đột và phản hồi có thể hiểu; không ghi đè im lặng.
- Chuyển từ Shared sang Private phải cập nhật kết quả xem album của người còn lại. Quyền asset được chia sẻ riêng phải được hiển thị/phân biệt, tránh giả định mọi quyền asset bị thu hồi tự động khi thu quyền album.

---

# 11. Hợp đồng nghiệp vụ với các phân hệ

## 11.1. M01 — Photobook & Diary

**M02 cung cấp:** danh sách media khả dụng theo quyền, metadata cho picker, preview/thumbnail đúng quyền, định danh asset và variant, trạng thái Processing/Ready/Trashed, kiểm quyền đọc/nhúng/tải, đăng ký usage, báo trạng thái invalidation khi bị xóa hoặc thu hồi quyền.

**M01 chịu trách nhiệm:** layout Page, element transform/crop riêng trên canvas, quyền Book/Page/Diary, Published snapshot, realtime collaboration, PDF xuất bản.

**Hợp đồng bắt buộc:**
- Chọn ảnh từ M01 không tạo asset bản gốc mới nếu chỉ đang tham chiếu media hiện hữu.
- Một element ảnh phải biết đang tham chiếu **original**, **variant cố định**, hay một **published-safe copy/snapshot** có quyền phù hợp.
- Crop ảnh trong photobook thường là hiệu ứng trang sách, không sửa original ở M02.
- Chỉnh ảnh ở M02 không tự chỉnh hình ảnh đã ghim trong bản photobook Published.
- Nếu original bị thu hồi, xóa mềm, xóa cứng hoặc variant lỗi, M01 phải dùng quy tắc placeholder/cảnh báo/quyền và quy trình published snapshots đã được xác định, không bỏ qua bảo mật.
- Khi đưa nguồn Private vào Book/Page Shared, cần xác nhận chia sẻ hoặc tạo copy có phạm vi rõ, như M01 yêu cầu.
- **Bản xuất PDF** và các bản phát hành không được tiếp tục sử dụng nguồn đã bị cấm truy cập để tạo export mới.

## 11.2. M03 — Food & Places

- Place/Visit có thể tham chiếu asset và album theo quyền.
- Thêm ảnh khi đi ăn có thể dùng Media Picker/Upload Center; một ảnh được liên kết với nhiều lần ghé thăm nếu hợp lệ.
- Xóa Place/Visit không tự xóa original M02.
- Nếu mất quyền ảnh, Place/Visit dùng placeholder/ẩn ảnh theo chính sách, không bị xóa bản ghi trải nghiệm.

## 11.3. M04 — Travel & Trips

- Trip có thể gắn album và nhiều asset; có thể tạo smart collection theo Trip khi metadata/link tồn tại.
- Xóa Trip không cascade-delete album/asset gốc.
- Ảnh từ chuyến đi có thể dùng lại cho Diary và Photobook.
- Các trường thời gian/địa điểm từ Trip không tự ghi đè capturedAt của ảnh.

## 11.4. M05 — Couple Calendar & Timeline

- Calendar Event/Timeline có thể dùng thumbnail và Media Usage để xem ảnh liên quan.
- Timeline nhóm theo `memoryDate` hoặc ngày sự kiện có chủ đích, không mặc định lấy ngày upload.
- Nếu album/asset Private, chỉ người có quyền được thấy preview và liên kết.

## 11.5. M09 — Interaction và M10 — Settings

- Bình luận/reaction vào ảnh/video, nếu có triển khai, phải theo hợp đồng M09 và quyền M02; M02 không tự phát triển full messaging.
- Account, toàn cục permissions, tùy chọn notification và security là thuộc nền tảng/M10. M02 cung cấp các chính sách tài nguyên riêng.

## 11.6. Nguyên tắc reference integrity

1. Xóa nội dung consumer không xóa file gốc.
2. Xóa asset cần kiểm usage và áp dụng policy bảo tồn/quyền xóa.
3. Đổi tên ảnh/album không làm đứt link ID.
4. Thay variant không tự viết lại liên kết đã ghim.
5. Media usages không được lộ tên Photobook/Diary Private của người kia; kiểm quyền khi hiển thị danh sách ảnh được dùng ở đâu.
6. Hệ thống có thể phát hiện reference hỏng và hiển thị repair task/placeholder thay vì làm crash Reader/Viewer.

---

# 12. Trash, xóa vĩnh viễn, khôi phục

## 12.1. ML-12 — Trash

**Danh sách:** ảnh/video/album đã xóa, người thực hiện, ngày xóa, ngày dự kiến xử lý, trạng thái dependencies (nếu được xem), bộ lọc Photos/Videos/Albums, `Restore`, `Delete Permanently` theo quyền.

**Thời hạn đã chốt:** **30 ngày** trong Trash đối với xóa thông thường. Mốc 30 ngày được tính từ thời điểm chuyển vào Trash và được hiển thị. Sau mốc này mới xem xét purge theo chính sách áp dụng, đặc biệt khi có reference/retention liên quan. Không tuyên bố xóa sạch lập tức mọi bản backup khi purge khỏi thư viện, vì backup có vòng đời riêng được định nghĩa minh bạch.

## 12.2. Delete asset

1. Kiểm quyền Delete/Trash.
2. Thu thập thông tin usage: album, diary, photobook, published book, trip, place và các variant.
3. Hiển thị cảnh báo dựa trên nội dung/metadata mà user có quyền biết. **Không tiết lộ tên nội dung Private** của người khác.
4. Nếu user xác nhận, chuyển asset sang Trashed, ghi actor/time/deadline và cập nhật kết quả xem/Picker/Search phù hợp.
5. Không cascade xóa các Diary, Book, Place, Trip đang liên kết.
6. Trong 30 ngày, owner hoặc người được ủy quyền có thể Restore, khôi phục các quan hệ còn hợp lệ.
7. Purge sau hạn phải tái kiểm reference, policy, quyền, trạng thái bản xuất bản và yêu cầu xóa dữ liệu có chủ đích.

**Quan trọng:** khuyến nghị tránh physical purge gây hỏng photobook Published mà không có bước xử lý; tuy nhiên **không giam dữ liệu vô thời hạn trái yêu cầu xóa hợp lệ của chủ sở hữu**. Nếu người dùng có quyền yêu cầu xóa vĩnh viễn theo chính sách, hệ thống phải xử lý và cập nhật consumer bằng placeholder/repair flow hoặc xóa snapshot tương ứng, không để một tham chiếu ngầm tiếp tục công khai nội dung đã bị thu hồi.

## 12.3. Delete album

- Chuyển Album sang Trash, membership có thể lưu để Restore.
- Original assets không bị chuyển Trash chỉ vì album bị xóa.
- Các album khác và các consumer khác vẫn tham chiếu bình thường.
- Nếu album là nguồn gắn với Trip, cập nhật/hiển thị liên kết không khả dụng theo policy, không tự xóa Trip.

## 12.4. Restore asset

- Nếu chưa purge và đủ quyền, khôi phục asset cùng metadata, tags, variants hợp lệ, quyền và album membership còn tồn tại theo snapshot/phạm vi cam kết.
- Nếu album gốc đã bị xóa, không tự tạo một album trùng tên bất ngờ; cho user biết link nào không thể phục hồi.
- Nếu có identifier bị sử dụng lại (không nên), phục hồi phải giữ định danh logic phù hợp hoặc có migration mapping an toàn.
- Restore không tự cấp lại quyền đã bị owner chủ động thu hồi sau khi xóa.

## 12.5. Preview/thumbnail và cache sau revoke/delete

- Dừng cấp quyền mới ngay khi revoke/Trash.
- Link/media token phải có policy hạn chế truy cập phù hợp. Không để một URL đoán được hoặc cache công khai vĩnh viễn phá quyền.
- Nội dung từng tải về hợp lệ nằm ngoài khả năng thu hồi tuyệt đối; mô tả trung thực hạn chế này.
- Không tuyên bố xóa hoàn toàn khỏi backup cho tới khi vòng đời xóa backup được thực hiện.

## 12.6. Tính nhất quán xóa M01/M02

M01 đã chốt Trash tối thiểu 30 ngày, không xóa cascading nguồn ảnh. M02 có Trash 30 ngày. Chúng phải thống nhất policy nhưng không đồng nhất vòng đời Book/Page với vòng đời Media Asset. Trường hợp asset trong bản photobook Published cần quy tắc published-safe usage có thể audit. Nếu không thể giữ ảnh vì quyền xóa, Reader/Export không được tiết lộ asset, thay bằng trạng thái phù hợp.

---

# 13. Storage Dashboard, Export, Backup

## 13.1. ML-13 — Storage & Export

**Dashboard dữ liệu:** Total Photos, Total Videos, Total logical assets, Original Storage, Preview/Variant Storage, Trash Storage, total storage used, limit/quota nếu có, gần đây đã upload, trạng thái export gần đây. Các số liệu phải ghi rõ phạm vi (`của tôi`, `nội dung tôi quản lý`, `được chia sẻ`), không vô tình lộ dung lượng private của người kia.

**Không tự áp quota:** product owner chưa chốt số GB/GB per user, số file batch hay giá lưu trữ. Khi cấu hình có giới hạn, UI và validation phải dùng cùng một nguồn giá trị.

## 13.2. Export — chức năng P0

**Các lựa chọn:**

1. Download Original của một asset khi `canDownload` hợp lệ.
2. Download Variant được tạo nếu có quyền tương ứng.
3. Export nhiều media đang chọn.
4. Export một album.
5. Export metadata kèm media hoặc chỉ metadata theo quyền.
6. Export toàn bộ phạm vi thư viện mà tài khoản có quyền xuất.

**Export Job states:** `Requested → Validating Rights → Preparing → Ready/Failed/Cancelled/Expired` (tên trạng thái có thể đổi ở thiết kế kỹ thuật, nghĩa nghiệp vụ giữ nguyên).

**Export package tối thiểu:** file gốc được phép, file đã chọn/variant nếu user yêu cầu, danh sách file/manifest, metadata có nguồn gốc, thông tin album/tags/ngày liên quan được phép tiết lộ; cấu trúc kết quả có thể dùng độc lập với Our Space. Không bao gồm file private người khác không có quyền download.

**Quy tắc:**
- Kiểm quyền khi chọn, khi tạo gói và khi giao link/tải. Nếu quyền bị thu hồi giữa chừng, export không được phát tệp trái quyền.
- Báo tổng item requested, item exported, item skipped (không đủ quyền/đã xóa/lỗi), không tiết lộ danh tính file người khác không được phép biết.
- Không dùng tên file người dùng nhập làm đường dẫn đầu ra thiếu kiểm soát; tránh đụng tên giữa nhiều file.
- Thông báo original có thể chứa EXIF/GPS; nếu chọn một bản đã giảm metadata, phân biệt rõ với Download Original.
- Không giới hạn khả năng export album nhỏ bởi việc tạo một gói tất cả thư viện quá lớn; hỗ trợ job bất đồng bộ khi cần (thời gian hoàn thành phụ thuộc quy mô, không có cam kết cứng đã duyệt).
- Export khác backup và không tự xóa asset gốc.

## 13.3. Backup — chức năng nền tảng bắt buộc

**Dữ liệu backup cần bao quát:** original files, variants cần thiết, metadata, tags, album/membership, permissions, usages/links cần cho restore, trạng thái trash, dữ liệu liên quan để khôi phục. Cần có policy rõ về backup của file đã bị xóa, thời hạn giữ, tần suất, kiểm tra, bảo vệ truy cập và xử lý backup bị hỏng.

**Restore test tối thiểu:**

1. Tạo nhiều album Private/Shared với media/variant và liên kết Diary/Photobook.
2. Backup theo phạm vi đã cấu hình.
3. Thử restore trong môi trường kiểm thử tách biệt.
4. Xác minh original file đọc được và tương ứng metadata.
5. Xác minh album membership, quyền truy cập và usage links.
6. Kiểm tra một account không được tự xem media Private của account kia sau restore.
7. Kiểm tra có thể mở một Photobook có ảnh từ M02 sau restore, theo quyền.
8. Ghi kết quả, sai lệch và quy trình xử lý.

**Không coi backup thành công chỉ vì có file nén được tạo.** Cần test restore. Chính sách về RPO/RTO, tần suất, retain backup là quyết định vận hành chung chưa chốt.

## 13.4. Xuất dữ liệu cá nhân và quyền riêng tư

- Chủ thể chỉ có thể xuất các tài nguyên mình sở hữu hoặc được cấp quyền tương ứng.
- Một file đã tải khỏi hệ thống có thể chứa dữ liệu vị trí/thiết bị, cần thông báo.
- Export không tự cấp lại quyền media gốc.
- Khi tài nguyên có Shared Copy, bản copy có vòng đời riêng và không thể mặc định loại ra nếu tài khoản là owner của copy.

---
# 14. Use Cases và main flows

> Các UC là testable business flows. UI labels là nhãn đề xuất, không bắt buộc đúng từng chữ nếu vẫn rõ nghĩa. Với mọi UC, việc đọc/ghi phải kiểm quyền ở nguồn.

## UC-M02-01 — Upload nhiều ảnh từ điện thoại

**Actors:** User A. **Preconditions:** đăng nhập, thiết bị chọn được file, quota cho phép.

**Main flow:**
1. A mở Media Library > Upload Center.
2. A chọn 20 ảnh từ thư viện điện thoại.
3. UI liệt kê thumbnail, định dạng/dung lượng ước lượng; A kiểm tra hoặc bỏ file không muốn nhập.
4. A chọn album đích nếu có, visibility `Private` mặc định; xác nhận chia sẻ nếu muốn.
5. A bắt đầu upload. Mỗi file đi qua validate, duplicate check, upload, processing.
6. 18 file Completed, 2 file Failed: UI báo chính xác kết quả và lý do lỗi có thể đọc được.
7. A nhấn `Retry Failed`; hệ thống chỉ thử lại 2 file.
8. Sau khi cả hai thành công, A chọn `View Uploaded` để mở tập ảnh mới.

**Expected:** 20 media hợp lệ ở thư viện, không nhân đôi 18 file cũ, quyền đúng như đã chọn.

**Alternates:** hết quota → đánh dấu file bị từ chối, không rollback thành công; rời trang → cảnh báo chưa hoàn tất; file HEIC không preview → fallback hoặc báo trạng thái; file trùng → yêu cầu chọn Use Existing/Separate/Cancel.

## UC-M02-02 — Upload trùng file

**Actor:** A. **Given:** A có một media X Ready. **When:** A chọn lại file byte trùng X. **Then:** UI cảnh báo trùng trong phạm vi asset A có quyền dùng, đề xuất Use Existing; sau xác nhận có thể gắn X vào album mới mà không tạo file duplicate ngoài ý muốn.

**Alternates:**
- Cùng tên nhưng byte khác → không báo trùng hoàn toàn chỉ vì tên.
- B có file Private trùng mà A không có quyền → không được tiết lộ B sở hữu file đó.
- A chủ động chọn Keep Separate → tạo asset logic khác có quyền riêng theo quy tắc.

## UC-M02-03 — Tạo và chia sẻ album

**Actors:** A Owner, B nhận quyền.
1. A mở Albums > Create Album.
2. Nhập `Our Little Dates`, mô tả, chọn cover tùy chọn.
3. Chọn Shared, cấp B role phù hợp; xác nhận.
4. Thêm các asset đã được phép chia sẻ; nếu Private được đưa vào Shared Album, UI yêu cầu xử lý quyền từng media.
5. B mở `Shared With Me`, nhìn thấy album và chỉ các ảnh B đủ quyền xem.
6. A/B (nếu là Editor) bổ sung ảnh khác nhau trong cùng album.

**Expected:** album dùng chung không tự mở quyền asset Private; updates membership không ghi đè nhau.

## UC-M02-04 — Dùng ảnh trong Photobook M01

**Actors:** A là Editor của sách; M01 gọi M02 picker.
1. A mở M01 Advanced Editor > Photos.
2. Picker liệt kê asset/variant A có quyền sử dụng.
3. A chọn ảnh trong M02, crop/resize trên canvas.
4. M01 tạo Page Element tham chiếu media/variant theo hợp đồng.
5. M02 ghi nhận usage để phục vụ cảnh báo xóa/thay đổi quyền.
6. A/B cùng sửa sách thời gian thực theo quy tắc M01, ảnh gốc M02 không bị thay đổi.

**Expected:** dùng ảnh không upload lại, không đổi original, không bypass quyền. Nếu Book Shared sử dụng source Private, yêu cầu chủ sở hữu quyết định share/copy/snapshot phù hợp.

## UC-M02-05 — Chỉnh ảnh không phá hủy

**Actor:** A có quyền Edit asset.
1. A mở Media Viewer > Edit.
2. Crop, rotate, chỉnh Brightness/Contrast/Saturation.
3. Xem preview, chọn `Save Version`.
4. Hệ thống tạo variant mới và giữ nguyên original.
5. A dùng variant mới trong một Diary hoặc Photobook; variant cũ được dùng trước đó tiếp tục ổn định.

**Expected:** original intact, variant mới có metadata phiên bản, các consumer hiện tại không tự đổi.

## UC-M02-06 — Chia sẻ và thu hồi quyền

**Actors:** A Owner, B Viewer.
1. A mở asset X Private > Share.
2. Chọn B, role Viewer, canDownload=false; xác nhận.
3. B xem X qua Shared With Me/Viewer hoặc Picker khi phạm vi cho phép, nhưng không tải original bằng tính năng download.
4. A chọn Revoke Share.
5. B không tiếp tục xem X trên những yêu cầu mới tại Search/Viewer/thumbnail/direct link/export/picker.

**Expected:** quyền thống nhất; không thể đảo ngược file B đã chủ động lưu trước khi thu hồi, UI không hứa làm được điều đó.

## UC-M02-07 — Đưa ảnh Private vào album Shared

**Given:** A sở hữu Private asset X, album Y Shared với B. **When:** A thêm X vào Y. **Then:** hệ thống đưa ra ba lựa chọn rõ ràng: Keep Private, Share Existing, Create Shared Copy. Nếu A chọn Keep Private, B không thấy X hoặc metadata Private. Nếu chọn Share Existing, B thấy X theo quyền. Nếu chọn Shared Copy, B chỉ được xem copy hợp lệ, quyền original vẫn Private.

## UC-M02-08 — Xóa và khôi phục ảnh

**Actor:** A Owner.
1. A mở asset được dùng ở Album + Diary + Published Photobook.
2. A chọn Delete, hệ thống kiểm usage và hiển thị cảnh báo không lộ dữ liệu Private người khác.
3. A xác nhận đưa vào Trash, thời hạn 30 ngày hiển thị.
4. Tại ngày còn trong retention, A vào ML-12 và Restore.
5. Asset và các liên kết còn hợp lệ trở lại theo quyền hiện tại. Nếu một album đã bị purge, hệ thống thông báo link không khôi phục được.

**Expected:** không cascade-delete Diary/Book; không âm thầm phá published book; vẫn tôn trọng quy trình xóa có chủ đích.

## UC-M02-09 — Xóa album nhưng giữ ảnh

**Actor:** Album Owner.
1. A mở Album > Delete.
2. UI nói rõ "Chỉ xóa album, không xóa ảnh/video gốc".
3. A xác nhận.
4. Album vào Trash; asset vẫn xem được ở All Photos hoặc các album khác nếu đủ quyền.
5. Có thể Restore album theo chính sách Trash.

**Expected:** không xóa originals hoặc variants do membership bị xóa.

## UC-M02-10 — Tìm ảnh theo kỷ niệm

**Actor:** A.
1. A mở Search, nhập từ khóa hoặc đặt Media Type=Photo, Year=2027, Trip=Đà Lạt, Favorites=My Favorites.
2. Hệ thống áp dụng filter kết hợp và permission.
3. A mở một ảnh, xem metadata và `Related Memories`.
4. Chỉ các Diary, Trip, Photobook mà A có quyền được hiển thị; album Private của B không lộ tên.

**Expected:** kết quả tìm kiếm chính xác, không tiết lộ dữ liệu qua counts/suggestions.

## UC-M02-11 — Export album

**Actor:** A có quyền Export phù hợp.
1. A chọn album > Export.
2. Hệ thống xác định danh sách file có quyền Download, ghi phạm vi job, cảnh báo các file bị loại trừ mà không lộ dữ liệu private trái quyền.
3. A xác nhận và chọn export originals/variants cùng metadata trong phạm vi cho phép.
4. Hệ thống chuẩn bị gói; user tải qua đường dẫn hợp lệ.
5. Nếu quyền bị thu hồi trước thời điểm giao file, hệ thống chặn dữ liệu không còn quyền.

**Expected:** gói dùng độc lập, không chứa media không được phép, metadata khớp file.

## UC-M02-12 — Upload Recovery sau mất kết nối

**Actor:** A.
1. A đang upload 10 file, 6 Completed, 2 Uploading, 2 Queued.
2. A mất mạng/đóng tab.
3. Trạng thái chưa xong được thông báo trước khi rời khi khả thi; asset Completed vẫn an toàn.
4. Khi quay lại, hệ thống xác định những item đã hoàn thành thực tế.
5. Nếu thiết bị cần cấp quyền đọc file lại, A được yêu cầu chọn lại file.
6. A retry phần chưa thành công; hệ thống không tạo duplicate của 6 file trước.

**Expected:** dữ liệu đã lưu không bị mất, không khẳng định upload nền vẫn chạy nếu thiết bị không hỗ trợ.

## UC-M02-13 — Một asset sử dụng ở nhiều phân hệ

1. A upload ảnh X một lần vào M02.
2. X tham gia album `Our First Year`, album `Dalat`, một Diary M01, Trip M04 và một trang photobook M01.
3. A mở Media Viewer → Related Memories, chỉ thấy nội dung hợp quyền.
4. A xóa membership khỏi album `Dalat`.
5. X vẫn tồn tại, Diary/Book/Trip vẫn có reference hợp lệ.

**Expected:** tính thống nhất định danh, quan hệ không cascade-delete.

## UC-M02-14 — Favorite của hai tài khoản độc lập

1. A Favorite asset X Shared.
2. B không Favorite X.
3. A xem Favorites thấy X, B xem Favorites không thấy X.
4. A bỏ Favorite; X vẫn còn trong Album và Media Library.

**Expected:** Favorite per-user, không tự động chia sẻ/xóa asset.

## UC-M02-15 — Backup/Restore có media Private và Book Reference

1. Bộ dữ liệu mẫu có Private asset A, Shared album, multiple variants, usage trong photobook và tags.
2. Sao lưu tạo thành công.
3. Khôi phục trong môi trường cô lập.
4. Verify original readable, membership, variants, metadata, rights, diary/book usages.
5. B không nhìn thấy asset Private của A khi thử sau Restore.

**Expected:** có biên bản restore test. Backup file tồn tại nhưng không thể restore không được đánh dấu pass.

---

# 15. Business Rules và các bất biến

> P0 mặc định trừ khi ghi khác. Các mã BR-M02 là định danh để truy vết tài liệu, giao diện, test và implementation.

| Mã | Business Rule | Priority |
|---|---|---|
| BR-M02-001 | Media Asset có định danh bền vững, không dùng filename làm identity | P0 |
| BR-M02-002 | Một asset có thể ở nhiều manual albums qua membership | P0 |
| BR-M02-003 | Xóa membership/album không xóa file gốc hoặc consumer references khác | P0 |
| BR-M02-004 | Original file không bị ghi đè bởi thao tác edit | P0 |
| BR-M02-005 | Preview và edited variant có danh tính/trạng thái riêng; không tự thay bản đã ghim | P0 |
| BR-M02-006 | Quyền media/album mặc định Private, share yêu cầu hành động chủ động | P0 |
| BR-M02-007 | Album Shared không tự công khai media Private thành viên | P0 |
| BR-M02-008 | Share Existing và Create Shared Copy có semantics và quyền khác nhau | P0 |
| BR-M02-009 | Download là quyền riêng với View (chủ sở hữu mặc định được Download) | P0 |
| BR-M02-010 | Read/write/export/thumb/search/picker/direct URL đều kiểm quyền | P0 |
| BR-M02-011 | Không tiết lộ metadata, names, GPS, counts, usages riêng tư | P0 |
| BR-M02-012 | Favorites riêng theo User × Media, không mở quyền asset | P0 |
| BR-M02-013 | Upload nhiều file độc lập, một file lỗi không rollback các file hợp lệ | P0 |
| BR-M02-014 | Retry/double submit cùng operation không tạo duplicate logic ngoài ý muốn | P0 |
| BR-M02-015 | Duplicate dựa vào nội dung file; tên trùng không đủ | P0 |
| BR-M02-016 | Duplicate detection không tiết lộ file Private của người khác | P0 |
| BR-M02-017 | Phân biệt UploadedAt, CapturedAt, MemoryDate, không tự tạo ngày chụp giả | P0 |
| BR-M02-018 | GPS chính xác không tự share theo quyền View ảnh | P0 |
| BR-M02-019 | Trạng thái Completed phải dựa trên xác nhận lưu và hợp đồng Ready | P0 |
| BR-M02-020 | Mọi batch cần kết quả per-item, Retry Failed, lỗi đọc được | P0 |
| BR-M02-021 | Không cam kết full background Camera Roll sync ở V1.0 | Scope |
| BR-M02-022 | Xem video/HEIC tùy tương thích, original được giữ, có fallback | P0 |
| BR-M02-023 | Smart Collections cơ bản là kết quả lọc động, không nhân bản file | P0 |
| BR-M02-024 | Search/filter/suggestion chỉ dựa trên tài nguyên có quyền | P0 |
| BR-M02-025 | Related Memories chỉ liệt kê các consumer user có quyền xem | P0 |
| BR-M02-026 | M01 dùng asset/variant bằng reference, không tự reupload khi chỉ tái sử dụng | P0 |
| BR-M02-027 | Chỉnh ảnh M02 không tự đổi Photobook Published của M01 | P0 |
| BR-M02-028 | Mỗi media reference trong M01/khác phải có chính sách khi source bị thu hồi/xóa | P0 |
| BR-M02-029 | Asset/Album bị xóa thông thường vào Trash 30 ngày | P0 |
| BR-M02-030 | Trước purge phải kiểm consumer usage và quyền xóa hợp lệ | P0 |
| BR-M02-031 | Purge không được âm thầm xóa Book/Diary/Place/Trip liên quan | P0 |
| BR-M02-032 | Restore giữ metadata/quyền/membership hợp lệ, báo những liên kết không phục hồi được | P0 |
| BR-M02-033 | Không giữ ảnh vĩnh viễn trái yêu cầu xóa hợp lệ chỉ vì consumer reference | P0 |
| BR-M02-034 | Export chỉ bao gồm file/metadata trong quyền Export/Download tại thời điểm giao | P0 |
| BR-M02-035 | Export original phải cảnh báo khả năng chứa EXIF/GPS | P0 |
| BR-M02-036 | Backup và Export là hai nghiệp vụ độc lập | P0 |
| BR-M02-037 | Restore test phải bao gồm dữ liệu file thật, quyền và liên kết | P0 |
| BR-M02-038 | Màn hình desktop/mobile đều hoàn tất nghiệp vụ trọng tâm | P0 |
| BR-M02-039 | Cộng tác album không silently overwrite membership/metadata | P0 |
| BR-M02-040 | No file bytes/metadata from other account leak via duplicate/permission errors | P0 |
| BR-M02-041 | Storage Dashboard chỉ tổng hợp phạm vi quyền rõ ràng | P0 |
| BR-M02-042 | Không đặt giới hạn dung lượng/quota tùy tiện khi chưa được duyệt | Scope |
| BR-M02-043 | Định dạng accepted storage và preview/playback phải được thông báo phân biệt | P0 |
| BR-M02-044 | Đồng bộ/revoke quyền được áp dụng cả ở các phiên và đường dẫn còn mở | P0 |
| BR-M02-045 | Khi không thể giữ bản preview/variant, không được đánh mất original nếu original vẫn hợp lệ | P0 |

## 15.1. Bất biến quan trọng nhất (Data Invariants)

1. `DELETE AlbumMembership ≠ DELETE MediaAsset`.
2. `Edit Variant ≠ Mutate Original File`.
3. `Show Album ≠ Can View All Album Assets`.
4. `Upload Status Completed ≠ merely received click or bytes started`.
5. `Shared With Me ≠ unconditional original download`.
6. `Media Usage ≠ independent permission grant`.
7. `Favorite(A, X) ≠ Favorite(B, X)`.
8. `Trash / Purge Media ≠ cascade delete Diary or Photobook`.
9. `Revoke Access ≠ magically revoke already downloaded copies`.
10. `Export ≠ Backup`.

---

# 16. Ngoại lệ, xung đột và xử lý lỗi

| Mã | Tình huống | Hệ thống phải làm gì |
|---|---|---|
| EX-M02-01 | File không hỗ trợ | Reject item riêng, báo định dạng, không dừng batch |
| EX-M02-02 | Quá giới hạn kích thước cấu hình | Báo giới hạn thực, từ chối item, không xóa file khác |
| EX-M02-03 | Mất mạng khi upload | Cảnh báo, giữ file Completed, retry/resume phù hợp |
| EX-M02-04 | Đóng trình duyệt | Không nói dối upload nền; khôi phục hàng đợi khi khả thi |
| EX-M02-05 | Cùng upload operation bị gửi hai lần | Idempotent, không tự nhân đôi asset |
| EX-M02-06 | Cùng tên khác nội dung | Không xác định duplicate chỉ dựa tên |
| EX-M02-07 | Thiếu capturedAt | Gắn `Unknown` hoặc dùng trường ngày được user chọn, không bịa |
| EX-M02-08 | Date/Timezone sai | Giữ provenance, cho sửa ngày hiển thị, không ghi sai thông tin gốc |
| EX-M02-09 | Có EXIF/GPS | Giữ dữ liệu theo chính sách, không tự công khai GPS |
| EX-M02-10 | File hỏng hoặc giả MIME | Không đánh dấu Ready/Completed sai; báo lỗi |
| EX-M02-11 | Video không phát trên trình duyệt | Preview tương thích hoặc fallback Download theo quyền |
| EX-M02-12 | Một ảnh trong nhiều album | Xóa khỏi một album không xóa ở album khác |
| EX-M02-13 | Xóa album có nhiều ảnh | Không cascade xóa original |
| EX-M02-14 | Xóa asset đang dùng trong Published Book | Cảnh báo, xử lý quyền/snapshot/placeholder, không âm thầm phá sách |
| EX-M02-15 | Revoke quyền lúc người kia đang xem | Chặn truy cập mới, invalidation phù hợp, không hứa thu hồi bản đã tải |
| EX-M02-16 | Open direct original/thumbnail URL không quyền | Từ chối không lộ bytes/metadata |
| EX-M02-17 | Edit variant thất bại | Giữ original và variants hợp lệ |
| EX-M02-18 | Hết quota trong batch | Giữ success, báo failed đúng, không tự xóa dữ liệu |
| EX-M02-19 | Export đang chuẩn bị bị ngắt kết nối | Job còn trạng thái đúng, hỗ trợ kiểm tra/tải lại nếu còn quyền |
| EX-M02-20 | Shared Album chứa Private photo | Không lộ photo; hỏi Keep Private / Share / Copy |
| EX-M02-21 | Các mốc thời gian khác timezone | Hiển thị/nhóm nhất quán, giữ offset/nguồn |
| EX-M02-22 | Upload file xong nhưng preview lỗi | Original có trạng thái riêng, preview failed, fallback |
| EX-M02-23 | Cùng sửa album metadata | Phát hiện xung đột, tránh silent overwrite |
| EX-M02-24 | Album share bị thu hồi giữa khi xem | Áp dụng quyền mới, không lộ listing private |
| EX-M02-25 | Restore asset nhưng album gốc đã purge | Restore ảnh, thông báo membership mất |
| EX-M02-26 | Purge trong khi backup còn giữ file | Minh bạch retention và quy trình xóa backup, không cam kết xóa tức thì |
| EX-M02-27 | Export album chứa items không đủ quyền | Bỏ item trái quyền, báo tổng hợp không lộ thông tin private |
| EX-M02-28 | Upload Private ảnh vào Shared Album | Xác nhận sharing, không auto elevate |
| EX-M02-29 | Tên file có ký tự đặc biệt/nguy hiểm | Hiển thị/đặt tên xuất an toàn, không thực thi mã |
| EX-M02-30 | Thư viện rất lớn | Lazy loading/pagination, không tải tất cả |
| EX-M02-31 | HEIC được lưu nhưng client không decode | Fallback/preview tương thích, giữ original |
| EX-M02-32 | File trùng của B chỉ có Private | Không xác nhận B có file đó cho A |
| EX-M02-33 | Người dùng tải file từ album nhưng mất quyền download | Từ chối ở bước giao file |
| EX-M02-34 | Album cover trỏ ảnh bị Trashed | Placeholder/chọn cover hợp lệ, không hỏng album |
| EX-M02-35 | File variant A ở book được sửa thành B | Book vẫn dùng A cho đến khi thay tham chiếu có chủ ý |
| EX-M02-36 | Metadata thiếu/không hợp lệ | Không khiến toàn batch thất bại; đánh dấu field không xác định |
| EX-M02-37 | User bấm Cancel sau Completed | Không tự xóa media, sử dụng Delete flow |
| EX-M02-38 | Shared Copy gốc bị xóa | Copy tiếp tục theo quyền/vòng đời riêng, trừ chính sách xóa được áp dụng |
| EX-M02-39 | Viewer không quyền Download vẫn bấm link cũ | Không thể tải original qua hành động chính thức |
| EX-M02-40 | Search gợi ý tag của Private người khác | Không hiển thị tag/count/name vượt quyền |

## 16.1. Quy tắc xử lý lỗi trên UI

- Dùng thông báo cụ thể: `Định dạng không hỗ trợ`, `Không đủ quyền`, `Mất kết nối`, `Hết dung lượng`, `Không tạo được preview`, `File đã bị xóa`, `Liên kết đã thay đổi`.
- Không hiện raw stack trace, storage path, token, exception chứa dữ liệu private.
- Nói rõ thao tác nào đã thành công và thao tác nào cần thử lại.
- Không đánh lừa bằng trạng thái `Saved` nếu chưa lưu xong.
- Cho Retry khi sự cố tạm thời, nhưng các lỗi quyền/invalid format không nên retry vô hạn.
- Khi tác động nhiều file, báo partial success theo item; có thể export danh sách lỗi phù hợp.

---

# 17. Acceptance Criteria và test matrix

> Mỗi AC có thể chuyển thành test case Given–When–Then. Các tiêu chí về giới hạn cấu hình kiểm tra theo giá trị trong hệ thống khi được chốt, không giả định con số.

## 17.1. Upload / Import

| AC ID | Given / When | Then — điều kiện đạt |
|---|---|---|
| AC-M02-01 | Chọn một ảnh hợp lệ và upload | Asset Ready xuất hiện trong Library đúng quyền |
| AC-M02-02 | Upload nhiều ảnh/video | Mỗi file có progress/state riêng, kết quả tổng hợp chính xác |
| AC-M02-03 | Có 2 file lỗi trong batch 20 | 18 file hợp lệ vẫn được lưu và truy cập |
| AC-M02-04 | Retry Failed sau batch partial success | Chỉ item lỗi cần thử lại, không tạo duplicate của success |
| AC-M02-05 | Upload file trùng nội dung có quyền | Phát hiện và cho giải quyết Use Existing/Separate/Cancel |
| AC-M02-06 | Chọn ảnh từ điện thoại | Upload được qua mobile UI được hỗ trợ |
| AC-M02-07 | Mất mạng upload | Có báo lỗi/trạng thái phục hồi, không mất item Completed |
| AC-M02-08 | File quá giới hạn cấu hình | Nói rõ giới hạn, reject đúng file |
| AC-M02-09 | File có metadata hợp lệ | Lưu metadata hữu ích theo policy, không lộ GPS ngoài quyền |
| AC-M02-10 | File không đọc được, giả MIME | Không đánh dấu Completed/Ready sai |
| AC-M02-11 | Hai file trùng tên nhưng khác bytes | Không tự gộp thành một asset |
| AC-M02-12 | Hai lần gửi lại cùng operation upload | Không tạo hai asset ngoài chủ ý |
| AC-M02-13 | Ảnh trùng của tài khoản khác Private | Không tiết lộ sự tồn tại ảnh đó trong duplicate UX |
| AC-M02-14 | File HEIC hoặc MOV thuộc tập định dạng hỗ trợ lưu | Bảo tồn original; nếu preview/playback không tương thích, có fallback minh bạch |

## 17.2. Gallery / Album / Smart Collection

| AC ID | Given / When | Then — điều kiện đạt |
|---|---|---|
| AC-M02-15 | Mở All Photos | Chỉ hiện ảnh có quyền, hỗ trợ pagination/lazy load |
| AC-M02-16 | Lọc theo ngày chụp, ngày upload, ngày kỷ niệm | Đúng từng trường; ảnh thiếu ngày không bị gán giả |
| AC-M02-17 | Tạo album có tên hợp lệ | Album xuất hiện đúng visibility, có ID độc lập |
| AC-M02-18 | Thêm một asset vào hai album | Hai membership, một logical original asset |
| AC-M02-19 | Remove From Album | Không mất asset tại Library/album khác |
| AC-M02-20 | Delete Album | Album vào Trash, media gốc không bị trash theo |
| AC-M02-21 | Rename Album | Tên cập nhật theo quyền, không phá liên kết |
| AC-M02-22 | Set Album Cover | Cover cập nhật, file gốc không đổi |
| AC-M02-23 | Shared Album với B | B thấy album và media đúng quyền |
| AC-M02-24 | Shared Album chứa A Private asset | B không thấy preview/nội dung/metadata asset đó |
| AC-M02-25 | Smart Collection lọc Favorite, Year hoặc Type | Kết quả động phản ánh filter và quyền |
| AC-M02-26 | Hai Editor cùng thêm ảnh album | Không mất membership nào do silent overwrite |
| AC-M02-27 | Hai Editor xung đột đổi tên/cover | Có giải quyết/cảnh báo, không im lặng mất cập nhật |

## 17.3. Media Viewer / Editor

| AC ID | Given / When | Then — điều kiện đạt |
|---|---|---|
| AC-M02-28 | Mở ảnh có quyền | Ảnh và metadata được phép hiển thị |
| AC-M02-29 | Next/Previous trong album/filter | Đúng danh sách hiện tại, bỏ qua item không có quyền |
| AC-M02-30 | Phát video có codec được hỗ trợ | Phát trong Viewer, không ép tải original cả thư viện |
| AC-M02-31 | Crop/Rotate/Adjust ảnh rồi Save Version | Variant mới tạo, original không đổi |
| AC-M02-32 | Reset trong Media Editor | Trở về trạng thái chọn trước, original giữ nguyên |
| AC-M02-33 | Variant đã nằm trong Published Book | Save Variant mới không tự đổi nội dung book |
| AC-M02-34 | Preview không tương thích | Fallback có giải thích, vẫn có original hợp lệ |
| AC-M02-35 | Bị revoke khi Viewer đang mở | Yêu cầu truy cập tiếp theo bị chặn, không lộ file |

## 17.4. Search / Favorites / Privacy / Linking

| AC ID | Given / When | Then — điều kiện đạt |
|---|---|---|
| AC-M02-36 | Search theo tags, album, tên, ngày, uploader | Kết quả đúng điều kiện |
| AC-M02-37 | Kết hợp nhiều filters | Đúng phép kết hợp đã mô tả, xóa filter phản ánh ngay |
| AC-M02-38 | A search Private content của B | Không lộ media, name, tag, count hay metadata |
| AC-M02-39 | A Favorite asset X | Chỉ Favorite của A thay đổi, không auto-share |
| AC-M02-40 | B chưa favorite X | X không tự xuất hiện trong Favorites của B |
| AC-M02-41 | M01 Asset Picker mở từ Editor | Chỉ cung cấp asset/variant hợp quyền của user |
| AC-M02-42 | Một asset dùng nhiều modules | Không phải reupload, usage links đúng |
| AC-M02-43 | Owner revoke Share | Viewer, Search, Picker, export, direct link cùng áp dụng quyền mới |
| AC-M02-44 | Related Memories có private content người khác | Không tiết lộ tên hoặc link vượt quyền |
| AC-M02-45 | A thêm Private photo vào Shared Album | Có xác nhận Keep Private/Share/Copy, không lộ tự động |
| AC-M02-46 | Viewer không có canDownload | Không tải original bằng tính năng chính thức |
| AC-M02-47 | User không quyền mở original/thumbnail trực tiếp | Từ chối bytes, không lộ metadata |
| AC-M02-48 | Ảnh có EXIF/GPS | Vị trí chính xác không tự hiện cho account chỉ có View |
| AC-M02-49 | Share Existing và Create Shared Copy | Hai lựa chọn cho quyền/vòng đời khác nhau đúng hợp đồng |

## 17.5. Trash / Export / Backup / Devices

| AC ID | Given / When | Then — điều kiện đạt |
|---|---|---|
| AC-M02-50 | Trash asset | Trạng thái Trashed, deadline 30 ngày |
| AC-M02-51 | Restore trước hạn | Asset/metadata/quyền/relations còn hợp lệ được khôi phục |
| AC-M02-52 | Delete asset đang được sử dụng | Cảnh báo theo quyền, không cascade-delete Diary/Photobook |
| AC-M02-53 | Qua 30 ngày | Chỉ thực hiện purge theo chính sách phụ thuộc/quyền, không purge vô điều kiện |
| AC-M02-54 | Export Album | Chỉ xuất item đủ quyền Download/Export |
| AC-M02-55 | Export metadata | Manifest/metadata khớp file và không lộ dữ liệu riêng |
| AC-M02-56 | Revoke quyền khi Export đang xử lý | Không giao file vừa bị thu hồi quyền |
| AC-M02-57 | Backup/Restore dữ liệu thật | File gốc, variant cần thiết, album, rights, usage khôi phục phù hợp |
| AC-M02-58 | Restore data Private | B không xem được media Private của A sau restore |
| AC-M02-59 | Thư viện nhiều media | Chỉ tải phần cần hiển thị, không load all originals |
| AC-M02-60 | Upload, Viewer, Albums trên mobile | Hoàn thành các luồng trọng tâm bằng cảm ứng |
| AC-M02-61 | Upload, Viewer, Albums trên desktop | Hỗ trợ kéo thả, multi-select, keyboard/mouse |
| AC-M02-62 | Trash asset tham chiếu Book Published | Không âm thầm làm hỏng quyền nội dung hoặc vẫn công khai nội dung đã bị thu hồi |
| AC-M02-63 | Gói export chứa original có GPS | UI cảnh báo về metadata nhạy cảm |
| AC-M02-64 | Storage Dashboard | Hiển thị số liệu có scope quyền rõ ràng, không tiết lộ quota private khác |
| AC-M02-65 | Cancel upload item đã Completed | Không tự xóa asset, cần nghiệp vụ Delete |
| AC-M02-66 | Truy cập album/share sau khi owner đổi quyền | Quyền mới được áp dụng, không dựa vào tab cũ |

## 17.6. Ma trận kiểm thử mẫu theo quyền

| Kịch bản | Owner | Editor được cấp | Viewer có Download | Viewer không Download | No Access |
|---|---|---|---|---|---|
| Xem preview hợp lệ | Allow | Allow | Allow | Allow | Deny |
| Sửa metadata | Allow | Allow | Deny | Deny | Deny |
| Tạo variant ảnh | Allow | Allow | Deny | Deny | Deny |
| Tải original qua UI | Allow | Theo canDownload | Allow | Deny | Deny |
| Share/Revoke | Allow | Khi có ủy quyền | Deny | Deny | Deny |
| Trash | Allow | Khi có ủy quyền | Deny | Deny | Deny |
| Xem GPS chính xác | Theo lựa chọn chính sách | Theo quyền GPS | Theo quyền GPS | Theo quyền GPS | Deny |

## 17.7. Nguyên tắc chứng minh nghiệm thu

- Các AC liên quan quyền phải kiểm tra **UI và truy cập trực tiếp tới nguồn file**.
- Các AC backup phải kiểm bằng **restore thực tế**, không chỉ kiểm log tạo backup.
- Các AC original immutability cần so sánh tính toàn vẹn trước/sau chỉnh sửa.
- Các AC retry cần kiểm thử lost acknowledgement và double-click, không chỉ retry với lỗi mô phỏng.
- Các AC mobile phải thử trên thiết bị/mô phỏng cảm ứng, bao gồm file chooser và thao tác chọn nhiều.
- Các AC M01 linking phải dùng ít nhất một photobook đã Published và một ảnh bị revoke/xóa để kiểm soát quyền nhất quán.

---
# 18. Desktop/mobile, hiệu năng, chất lượng và an toàn

## 18.1. Hai thiết bị ngang nhau là yêu cầu nghiệm thu

| User job | Desktop | Mobile | Điều kiện bắt buộc |
|---|---|---|---|
| Tải nhiều ảnh/video | File picker + drag/drop | Native file picker + multi-select nếu thiết bị hỗ trợ | Cả hai có tiến độ/trạng thái/retry |
| Duyệt Gallery | Grid rộng, sidebar filter | Grid cuộn dọc, filter panel | Không mất chức năng cơ bản |
| Xem Media | Viewer lớn + info panel | Fullscreen, pinch zoom/swipe | Nội dung đọc/xem được |
| Chỉnh ảnh | Canvas và thanh công cụ | Công cụ gọn theo ngữ cảnh, cảm ứng | Crop/rotate/color/save variant |
| Tạo/quản lý Album | Grid/detail, bulk actions | Thẻ album, chọn nhiều, menu | Cùng semantics và quyền |
| Search/Filters | Sidebar/toolbars | Filter sheet | Kết quả thống nhất |
| Share/Revoke | Dialog chi tiết | Dialog mobile | Không rò dữ liệu, xác nhận trước share |
| Trash/Restore | Bảng/list | List/card | Đủ quyền mới thao tác |
| Export | Chọn phạm vi, download job | Chọn phạm vi, download/share file theo thiết bị | Quyền như nhau |
| Storage | Dashboard dạng bảng | Dashboard thẻ | Số liệu đúng phạm vi |

**Bố cục không cần pixel-identical.** Chức năng trọng tâm phải làm được trên điện thoại mà không bắt buộc mở máy tính.

## 18.2. Khả năng tiếp cận và sử dụng

- Nút có tên rõ ràng, có trạng thái disable/loading/error; không chỉ dựa vào màu sắc.
- Các ô chọn nhiều file và hành động xóa/share cần có xác nhận dễ hiểu.
- Cho dùng bàn phím trên desktop, có focus state và label cho form.
- Có alternative text phù hợp cho các biểu tượng chức năng và thông báo trạng thái.
- Với thumbnail, người dùng không phải đoán file là ảnh hay video; video hiển thị indicator/duration.
- Không phát video có âm thanh tự động trong grid.
- Cảnh báo upload nhiều file phải hiển thị cho người dùng ở cả mobile, kể cả khi cuộn màn hình.
- Không yêu cầu thao tác kéo thả như cách duy nhất để quản lý album hoặc ảnh.

## 18.3. Phi chức năng — yêu cầu và giá trị cần hiệu chỉnh

| Lĩnh vực | Yêu cầu không thương lượng | Phần cần thiết kế kỹ thuật xác nhận |
|---|---|---|
| Privacy | Quyền bắt buộc ở server/storage, thumbnails, search, export | Token/URL lifetime/cache invalidation |
| Integrity | Original không biến đổi; retry không nhân đôi logic | Checksum/hash, storage durability |
| Availability | Lỗi preview không mặc định mất original | Worker/job retries, fallback rules |
| Performance | Không tải toàn library originals trong một lần | Page size, image variants, indexing, perf SLO |
| Upload | Batch per-item state, retry, user-facing progress | Chunking, concurrency, max file size |
| Large gallery | Pagination/lazy load/virtualization thích hợp | Threshold benchmark, queries |
| Devices | Mobile+desktop tương đương nghiệp vụ | Browser/device support matrix |
| Observability | Có đủ trạng thái và log để điều tra upload/export/lỗi quyền | Log fields, metrics, alerts |
| Backup | Có backup và restore test thực tế | Frequency, retention, recovery objectives |
| Security | Không chấp nhận file nguy hiểm/ngụy trang; không leak URLs | Malware scan strategy, content sniffing |
| Portability | Export originals và metadata được phép | Archive format, manifest schema |
| Long-term evolution | Có thể thêm album/tags/source providers về sau | API versioning, migration strategy |

**SLO đề xuất chưa duyệt:** đo thời gian load gallery 100/1.000/10.000 assets, thời gian render preview, success rate/resume upload theo mạng/thiết bị, thời gian export album lớn. **Không tự đặt số cứng rồi coi đã được chủ dự án duyệt**.

## 18.4. Ma trận trạng thái quan trọng

| Hệ thống | UI được phép hiển thị | UI không được hiển thị |
|---|---|---|
| Upload bytes chưa confirmed | `Đang upload` | `Hoàn tất` |
| Original stored, preview processing | `Đã lưu file, đang xử lý bản xem` | `Xem trước đã sẵn sàng` |
| Preview thất bại, original hợp lệ | `Bản xem lỗi, thử lại/tải gốc nếu có quyền` | `File bị mất` |
| Permission revoked | `Không còn quyền truy cập` | Preview mới được cấp ngoài quyền |
| File Trashed | `Trong thùng rác`, deadline | File hoạt động bình thường trong Search/Picker |
| Export job chưa xong | `Đang chuẩn bị` | Download link giả/đã sẵn sàng |
| Restore test chưa thực hiện | `Chưa kiểm chứng restore` | `Đã sao lưu và khôi phục an toàn` |

## 18.5. Rủi ro bảo mật và riêng tư nên đưa vào test plan

- File upload giả extension/MIME, tên file có ký tự nguy hiểm, file quá lớn, zip-bomb-like content nếu nhận định dạng không phù hợp.
- Đường dẫn tĩnh đến original có thể bị đoán, URL token hết hạn, quyền thu hồi nhưng vẫn nhận thumbnail mới.
- Rò EXIF/GPS qua Viewer/export, caption, search suggestion.
- Cross-account duplicate detection và global counts khiến A biết B có ảnh gì.
- Cache/prefetch giữ nội dung mà tài khoản đã mất quyền xem; phân biệt cache đã tồn tại trên máy user và server cấp dữ liệu mới.
- Export job chuẩn bị lúc có quyền, hoàn tất sau khi quyền bị thu hồi.
- Shared Copy có chung storage vật lý nhưng phải có permission/vòng đời logic riêng.
- Backup/restore có thể vô tình reset privacy về Shared; phải kiểm kiểm tra độc lập.

---

# 19. Ranh giới triển khai, DoD và Codex handoff

## 19.1. Codex cần làm gì với tài liệu này

1. Đọc toàn bộ M02 BRD, **không chỉ đọc phần danh mục tính năng**.
2. Đọc M01 BRD, đặc biệt contracts sử dụng asset/variant, quyền Book/Page và Photobook Published.
3. Trước khi code, tạo một bản **technical design** nêu: domain boundaries, data schema, API/commands, storage design, upload state machine, permission enforcement, deduplication, export jobs, backup and restore plan, test strategy, UI architecture.
4. Với các giới hạn chưa chốt, tạo danh sách `Configuration/TBD` và đề xuất giá trị kèm hệ quả, không tự khẳng định là product decision.
5. Truy vết mã `BR-M02-*`, `UC-M02-*`, `EX-M02-*`, `AC-M02-*` tới feature branch/module/tests.
6. Triển khai nền tảng quyền/storage/asset trước những màn hình phụ thuộc; tạo integration contracts rõ ràng cho M01/other modules.
7. Bảo đảm test các trường hợp private data leak, upload duplicate, revoke và xóa file đang được Photobook sử dụng.
8. Không triển khai AI search, recognition, background camera backup hay full third-party sync như yêu cầu P0.
9. Không tự gán stack kỹ thuật, schema/tên endpoint cố định chỉ từ BRD — đó là quyết định kỹ thuật sau khi được duyệt.
10. Chỉ báo hoàn tất M02 khi cả functional AC, privacy AC, media integrity, backup/restore và device tests đã qua.

## 19.2. Thứ tự triển khai gợi ý (không phải timeline)

1. **Foundation:** domain entities, asset lifecycle, identity/roles, permissions, file storage policy và trạng thái upload.
2. **Upload:** validate, batch queue, per-item state, idempotency, duplicate + preview processing.
3. **Library:** gallery photos/videos, viewer, metadata, tags, search/filter, favorites.
4. **Albums:** manual album, shared album, memberships, smart collections cơ bản.
5. **Media Edit:** non-destructive variants, reference-stability.
6. **Integration:** M01 Asset Picker, usages, permissions, published-safe behavior; M03/M04/M05 links.
7. **Data lifecycle:** trash/restore/deletion dependency checks, revoke behavior.
8. **Storage & portability:** export jobs, dashboard, backup/restore verification.
9. **UX/test hardening:** desktop/mobile, failure paths, large library performance, privacy regression.

## 19.3. Definition of Done — kiểm tra ở mức phân hệ

- [ ] 13 giao diện/chức năng ML-01..ML-13 đầy đủ trong phạm vi P0, dù có thể gộp UI khi hợp lý.
- [ ] Ảnh/video ưu tiên JPEG/PNG/WebP/HEIC/MP4/MOV có quy trình nhận file, trạng thái hỗ trợ và fallback đúng như chính sách.
- [ ] Upload hàng loạt, queue per-item, validate, duplicate, retry, partial success và trạng thái rõ ràng.
- [ ] Không tạo duplicate logic ngoài ý muốn do retry/lost response/double-click.
- [ ] Quyền Private mặc định, album và media permissions rõ, canDownload độc lập.
- [ ] Shared Album không tự share Private asset; Share Existing vs Shared Copy kiểm thử đúng.
- [ ] Manual Albums n-n, Smart Collections cơ bản, tags, metadata, search/filter, favorites theo user.
- [ ] Media Viewer và Media Editor ảnh cơ bản hoạt động, giữ original bất biến, variants tách biệt.
- [ ] M01 dùng ảnh bằng tham chiếu; Photobook Published không tự đổi khi ảnh/variant được edit.
- [ ] Xóa album không xóa media; xóa asset cảnh báo consumer links; Trash 30 ngày; Restore hoạt động.
- [ ] Revoke quyền có hiệu lực ở Search, Viewer, thumbnails, Picker, export và direct file URL.
- [ ] GPS/EXIF không lộ theo quyền View mặc định, export originals có cảnh báo.
- [ ] Storage Dashboard đúng phạm vi, Export media+metadata trong quyền.
- [ ] Backup/Restore chạy thật với original + quyền + liên kết; có kết quả kiểm chứng.
- [ ] Test trên mobile/desktop hoàn tất các luồng thiết yếu.
- [ ] AC-M02-01..66 pass hoặc có ngoại lệ hợp lệ được chủ dự án duyệt bằng văn bản.
- [ ] Không có bug nghiêm trọng gây mất original, rò ảnh riêng tư, hoặc xóa dây chuyền nội dung khác.

## 19.4. Điều kiện phát hành Our Space V1.0 toàn hệ thống

M02 hoàn thành không đồng nghĩa website đã sẵn sàng phát hành. Chủ dự án đã chốt **10/10 phân hệ cốt lõi phải hiện diện và hoạt động** trước khi Our Space V1.0 đi vào sử dụng chính thức. Cần tích hợp, kiểm thử chức năng xuyên phân hệ và nghiệm thu quyền + dữ liệu lưu trữ toàn hệ thống.

## 19.5. Những phần chưa xác định cần chốt ở giai đoạn kỹ thuật, không phải thay đổi D01–D20

- Công nghệ frontend/backend/database/storage/CDN/queue và môi trường deploy.
- File size limit, duration limit, maximum batch, quota và ngân sách.
- Codec support matrix và chính sách tạo preview/transcode cho HEIC/MOV/video.
- RTO/RPO và tần suất/retention backup, thời hạn cache, link expiry.
- Cấu trúc package export (định dạng manifest, phương thức download archive), versioning.
- Benchmark SLO/thiết bị/trình duyệt phải đáp ứng.
- Chính sách bảo quản bản sao đã xuất bản khi nguồn media bị xóa vĩnh viễn hoặc quyền bị thu hồi, nhất quán với M01 và quyền xóa dữ liệu.

> Các mục này **không phải chức năng chưa được duyệt**; chúng là cấu hình hoặc thiết kế triển khai phải có quyết định riêng để kiểm thử có số liệu và không đưa ra cam kết sai.

---

# 20. Ví dụ nghiệp vụ, traceability và change log

## 20.1. Bộ dữ liệu mẫu đề nghị dùng khi test

| ID ví dụ | Tài nguyên | Quyền | Thuộc tính/quan hệ |
|---|---|---|---|
| PHOTO-A | Ảnh buổi hẹn, JPEG | A Private | Album A Private, capturedAt trước uploadedAt |
| PHOTO-B | Ảnh Đà Lạt, HEIC | A Shared to B Viewer | 2 manual albums, Trip Đà Lạt, M01 Diary |
| PHOTO-C | Ảnh cafe đã crop | A Shared | Original + Variant C1, Published Photobook đang ghim C1 |
| VIDEO-D | Video chuyến đi MOV | B Private | Không phát native trên một trình duyệt giả lập, fallback |
| PHOTO-E | Ảnh giống hệt PHOTO-A | B Private | Thử global duplicate không được leak thông tin B |
| ALBUM-1 | Our First Year | Shared A/B | Chứa PHOTO-B và PHOTO-C |
| ALBUM-2 | Private Diary Photos | A Private | Chứa PHOTO-A |
| BOOK-1 | Our Dalat Memories | Shared Published | Tham chiếu PHOTO-B, Variant C1 |
| TRIP-1 | Dalat Weekend | Shared | Tham chiếu PHOTO-B và VIDEO-D theo quyền |

## 20.2. Các kịch bản tích hợp quan trọng nhất

### Kịch bản A — Chia sẻ một ảnh vào sách chung

A upload PHOTO-A dưới quyền Private. M01 tạo photobook Shared. A chọn PHOTO-A vào trang chung. Hệ thống yêu cầu xác nhận quyền sử dụng. A có thể share existing hoặc tạo bản sao shared. B chỉ được thấy nội dung mà quyền cho phép, không tự động được mở toàn bộ Private Album của A.

### Kịch bản B — Ảnh crop không làm đổi sách đã xuất bản

A dùng Variant C1 trong BOOK-1 Published. Một tuần sau A chỉnh original thành Variant C2. B mở Published BOOK-1 vẫn thấy C1, trừ khi phiên bản xuất bản được cập nhật có chủ đích, đúng quyền.

### Kịch bản C — Một ảnh trong nhiều album bị xóa khỏi album

PHOTO-B ở ALBUM-1 và album Trip. A remove PHOTO-B khỏi ALBUM-1. Ảnh vẫn còn ở All Photos, ở album Trip, ở M01 Diary và trong các liên kết hợp lệ.

### Kịch bản D — Quyền thu hồi sau khi Export được yêu cầu

B là Viewer có canDownload, yêu cầu export album. Trước khi hệ thống giao file, A thu hồi quyền B trên PHOTO-C. Export không được chứa PHOTO-C nếu quyền đã mất, dù job được gửi khi còn quyền. UI giải thích file không khả dụng mà không tiết lộ dữ liệu ngoài quyền.

### Kịch bản E — Restore sau xóa nhầm

A xóa PHOTO-B và nhìn thấy cảnh báo có Book/Trip liên quan. Trong vòng 30 ngày A Restore; original, variants còn hợp lệ, metadata và quan hệ có thể phục hồi. Nếu Trip bị xóa độc lập, hệ thống không bịa Trip mới; người dùng được cảnh báo về link bị mất.

## 20.3. Bảng truy vết theo lĩnh vực

| Nhóm nghiệp vụ | Screens | Business Rules | Main Use Cases | Acceptance |
|---|---|---|---|---|
| Upload/duplicate/recovery | ML-04 | 013–022, 040, 043 | UC-01/02/12 | AC-01..14 |
| Gallery/video/viewer | ML-01/02/03/07 | 001, 017–018, 022, 045 | UC-10/13 | AC-15/16/28..35 |
| Albums/smart collections | ML-05/06 | 002/003/007/023/039 | UC-03/07/09 | AC-17..27 |
| Image Editor | ML-08 | 004/005/027/045 | UC-05 | AC-31..34 |
| Search/Favorites | ML-09/10 | 011/012/024/025 | UC-10/14 | AC-36..40/44 |
| Sharing/Privacy | ML-11 + các màn hình | 006–011, 016, 018, 040/044 | UC-06/07 | AC-38/43..49 |
| Cross-module linking | ML-07 + M01 Picker | 026–028, 031 | UC-04/13 | AC-33/41/42/52/62 |
| Trash/Restore | ML-12 | 029–033 | UC-08/09 | AC-50..53 |
| Export/Backup/Storage | ML-13 | 034–037/041/042 | UC-11/15 | AC-54..59/63/64 |
| Mobile/Desktop | ML-01..13 | 038 | UC-01/10/12 | AC-60/61 |

> Trong các hàng traceability, mã rút gọn như `UC-01` có nghĩa `UC-M02-01`; `BR 013` là `BR-M02-013`; `AC-01` là `AC-M02-01`.

## 20.4. Nhật ký quyết định

| Ngày | Mốc | Nội dung | Trạng thái |
|---|---|---|---|
| 2026-10-22 | Product Scope | M02 là thư viện media trung tâm, kết nối M01–M05/timeline | Approved |
| 2026-10-22 | D01–D20 | Chủ dự án chốt toàn bộ 20 đề xuất, gồm upload cấp A/B, P1 Quick Share, backup, privacy, variants, Trash 30 ngày | Approved |
| 2026-10-22 | BRD V1.0 | Chuẩn hóa 13 screens, 15 entities, 15 use cases, 45 business rules, 40 exceptions, 66 acceptance criteria, DoD | Approved business baseline, implementation pending |

## 20.5. Quy tắc quản lý thay đổi trong tương lai

- Mọi thay đổi nghiệp vụ làm khác D01–D20, quyền, vòng đời asset, retention, published snapshot hoặc ưu tiên P0 cần cập nhật BRD với version mới và lý do.
- Thay đổi chỉ thuộc công nghệ/API/schema có thể nằm trong technical design nếu không đổi business contract.
- Khi điều chỉnh M01/M02 cross-module contracts, cập nhật **cả hai** tài liệu hoặc viết compatibility note có trích mã rule để Codex không đọc hai phiên bản mâu thuẫn.
- Nếu chủ dự án yêu cầu mở rộng Auto Photo Backup, AI search, facial grouping, cần bổ sung consent/privacy, nguồn media, chi phí và tính tương thích trước khi coi là phạm vi phát hành.

---

**KẾT THÚC ĐẶC TẢ M02 — MEMORIES & MEDIA LIBRARY V1.0**

**Hướng dẫn ngắn cho Codex:** Giữ nguyên dữ liệu gốc, kiểm quyền tại mọi điểm truy cập, đảm bảo upload idempotent và album membership không xóa media, tích hợp nhất quán với Photobook M01, rồi mới tối ưu trải nghiệm Gallery. Không tự cam kết đồng bộ ảnh điện thoại trong nền, không triển khai P1/P2 khi chưa có yêu cầu riêng, không thay đổi 20 quyết định nghiệp vụ đã chốt.
