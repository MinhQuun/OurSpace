---
document_id: OURSPACE-PRE-ARCHITECTURE-READINESS-REVIEW
version: 1.0
date: 2026-10-23
status: REVIEW_COMPLETED__ARCHITECTURE_BASELINE_NOT_YET_FROZEN
source: M01–M10 BRD V1.0 + Approved Policy Supplement V1.0 + CT and P0 Drafts
---

# OUR SPACE — PRE-ARCHITECTURE READINESS REVIEW V1.0

**Loại:** Báo cáo kiểm soát đầu vào trước thiết kế kỹ thuật; **không phải** kiến trúc, tech stack, API, database schema hoặc code.

**Phạm vi:** Our Space, 2 tài khoản độc lập, 10 phân hệ M01–M10, 247 Dxx đã duyệt, 7 DEC phương án A đã duyệt, 24 Cross-BRD CR, 8 Contract draft, Master P0 Acceptance Matrix draft.

**Kết luận điều hành:** **CONDITIONAL GO để nghiên cứu/đánh giá các phương án kiến trúc ở mức yêu cầu, NO-GO để khóa thiết kế, triển khai hoặc công bố P0 release-ready.** Lý do: còn 7 OP cần phân định, 60 Dxx chưa có bảng Dxx→AC trực tiếp, 187 mapping nguồn đã khai triển nhưng chưa kiểm tra ý nghĩa, 763 AC chưa được phân loại P0/P1/P2 chính thức, toàn bộ QA chưa chạy.

## 1. Kết quả kiểm tra nguồn và mức tin cậy

| Phép kiểm | Kết quả | Ghi chú |
|---|---:|---|
| BRD + Handoff/Prompt có manifest trong gói bàn giao | 12/12 khớp SHA-256 | Kiểm tra bytes trong ZIP đã nhận, **không** kiểm tra trực tiếp ổ D: của người dùng |
| Mã quyết định Dxx | 247/247 duy nhất | Theo CSV và BRD gốc |
| Mã AC | 763/763 duy nhất | Tổng toàn bộ AC, **chưa** suy diễn tất cả là P0 |
| Locator Dxx + AC khớp đúng dòng/ID trong BRD | 1010/1010 | Đã kiểm tra toàn bộ line marker |
| 7 DEC/A1–A5 | Đã phê duyệt | Supplement ghi nhận lời phê duyệt của PO ngày 23/10/2026 |
| CT-01–CT-08 / P0 Matrix | Draft | Chưa có QA evidence hoặc sign-off mới |
| Hệ thống chạy / phục hồi dữ liệu thật | Chưa có | Chưa bắt đầu code/tech/architecture |

**Source precedence:** Dxx trong 10 BRD approved là baseline; Supplement approved chỉ bổ sung các khoảng trống DEC-01–DEC-07; các bản Review, CT, P0 là tài liệu dẫn xuất. Nếu mâu thuẫn thực, lập Change Request; không tự sửa BRD hoặc viết quy tắc mới thành điều khoản đã duyệt.

## 2. Audit truy vết Dxx → AC (đã thực hiện trong lượt này)

Bảng `OUR_SPACE_DXX_AC_EXPLICIT_REFERENCE_EXPANSION_V1.0.csv` được tạo từ **bảng tham chiếu AC nguyên văn trong BRD**, hỗ trợ cú pháp `AC-M03-15–24`, `AC-01–05`, `AC-11/26–29`, `AC-M04-11..20`, `AC-70–AC-72` và nhắc mã rút gọn sau dấu phẩy/gạch chéo. Các mã AC xuất ra đều được xác nhận **tồn tại trong cùng module**; đây không phải phép chứng minh nội dung AC bao phủ quyết định.

| Module | Dxx | Tham chiếu AC từ BRD, đã khai triển | Không có mapping trực tiếp | AC gốc |
|---|---:|---:|---:|---:|
| M01 | 15 | 0 | 15 | 72 |
| M02 | 20 | 0 | 20 | 66 |
| M03 | 20 | 20 | 0 | 80 |
| M04 | 22 | 22 | 0 | 70 |
| M05 | 22 | 21 | 1 | 75 |
| M06 | 24 | 0 | 24 | 75 |
| M07 | 30 | 30 | 0 | 85 |
| M08 | 30 | 30 | 0 | 85 |
| M09 | 24 | 24 | 0 | 65 |
| M10 | 40 | 40 | 0 | 90 |
| **Tổng** | **247** | **187** | **60** | **763** |

- Tham chiếu trực tiếp: **187/187** đã khai triển thành mã AC có tồn tại, nhưng `semantic_coverage_status=NOT_REVIEWED`. Tổng AC unique xuất hiện trong mapping: **495** trên **763** AC, phần còn lại **268** AC không được nguồn Dxx→AC nhắc tới trực tiếp; **không kết luận** 268 AC đó không có nghiệp vụ P0 hoặc không có test.

- Không có tham chiếu trực tiếp: **60 Dxx = M01 15 + M02 20 + M05 1 + M06 24**. Đây là **khoảng trống evidence linkage**, không phải mất 60 quyết định hay thiếu tính năng. M05 D22 là quyết định không bắt buộc Google/Outlook V1.0, cần giữ ở phạm vi **not-P0 integration** nếu đối chiếu AC.

- M04 D05 có thêm văn bản `mobile tests` ngoài AC tham chiếu; được giữ nguyên thành ghi chú, không chuyển thành ID AC giả.

**Việc cần làm để khóa traceability:** (i) mỗi Dxx phải có liên kết AC có bằng chứng từ section AC hoặc một **supplemental test** được đánh dấu rõ, (ii) kiểm tra độ phủ về ý nghĩa cho 187 mapping tự khai triển, (iii) phân loại P0/P1/P2 cho 763 AC theo scope BRD, (iv) thêm negative/security và desktop/mobile evidence. Không giả tạo bảng Dxx→AC thành câu chữ của BRD gốc.

### 2.1. Danh sách 60 Dxx không có bảng Dxx→AC trực tiếp

Đây là **inventory để người rà soát xử lý**, không phải yêu cầu phê duyệt lại Dxx. Văn bản rút gọn chỉ giúp định vị; toàn bộ `decision_text` có trong CSV.

| Decision | Locator BRD | Nội dung ngắn |
|---|---|---|
| M01 D01 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:104` | Khởi đầu với hai định hướng khổ sách: dọc (portrait) và ngang (landscape) / Bắt buộc, kích thước thực tế sẽ được định... |
| M01 D02 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:105` | Reader có lật trang, vuốt chuyển trang và kiểu chuyển đơn giản dự phòng / Bắt buộc, tôn trọng giảm chuyển động |
| M01 D03 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:106` | Nhạc nền không bắt buộc trong V1.0, nhưng dự trù mở rộng nội dung / Không được tự bổ sung chức năng nhạc như P0 |
| M01 D04 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:107` | Chèn/phát video chỉ đưa vào V1.0 nếu phát sinh nhu cầu thiết yếu đã xác nhận / Mặc định ngoài P0, Media Library vẫn c... |
| M01 D05 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:108` | Có xuất PDF trong V1.0 để lưu giữ, chia sẻ bản sao hoặc chuẩn bị in / P0, không đồng nghĩa cam kết file đạt mọi chuẩn... |
| M01 D06 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:109` | Sách tạo mới mặc định Private, người tạo chủ động chia sẻ / P0, thay thế đề xuất Shared mặc định ở bản sơ bộ |
| M01 D07 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:110` | Owner có quyền Publish, Editor muốn Publish phải được cấp riêng / P0 |
| M01 D08 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:111` | Trang kế thừa quyền từ sách, nhưng cho phép cấu hình ngoại lệ theo trang / P0 |
| M01 D09 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:112` | Diary V1.0 ưu tiên chỉnh sửa thông thường có bảo vệ xung đột, không bắt buộc cùng gõ real-time / P0 của Diary không g... |
| M01 D10 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:113` | Đưa Diary vào sách mặc định bằng Copy as Snapshot / P0, không đồng bộ sửa hai chiều |
| M01 D11 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:114` | Có thư viện sticker và đồ trang trí cơ bản / P0 |
| M01 D12 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:115` | Có 8–12 template chất lượng tốt khởi đầu / P0, kiểm thử tối thiểu 8 mẫu phân biệt rõ |
| M01 D13 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:116` | Thùng rác có thời gian giữ tối thiểu 30 ngày trước khi xóa vĩnh viễn theo chính sách / P0, cần hiển thị thời điểm dự... |
| M01 D14 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:117` | Không mở quyền khách/public share trong V1.0 / P0, chỉ hai tài khoản được cấp quyền |
| M01 D15 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:118` | Cho phép cùng tài khoản đăng nhập ở nhiều thiết bị, mỗi tab/thiết bị là một phiên cộng tác / P0, xử lý trùng danh tín... |
| M02 D01 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:96` | Ảnh và video / Ưu tiên JPEG, PNG, WebP, HEIC, MP4, MOV. Lưu bản gốc hợp lệ, xem bằng preview tương thích khi cần; fal... |
| M02 D02 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:97` | Quyền mặc định / Media/album mới mặc định Private; chỉ Shared khi chủ động chọn/xác nhận / P0 |
| M02 D03 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:98` | Upload hàng loạt / Bắt buộc upload nhiều ảnh/video, queue từng file / P0 |
| M02 D04 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:99` | Upload tự động / A Smart Upload và B Recovery P0; C Quick Share P1 tùy thiết bị; D tự đồng bộ mọi ảnh mới là nghiên c... |
| M02 D05 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:100` | Duplicate / Phát hiện file giống hệt nội dung, không dựa vào tên; không phát lộ tài nguyên người khác / P0 |
| M02 D06 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:101` | Album / Manual Album và Smart Collection cơ bản / P0 |
| M02 D07 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:102` | Một ảnh nhiều album / Quan hệ nhiều-nhiều, không tự sao chép bản gốc / P0 |
| M02 D08 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:103` | Chỉnh ảnh / Không phá hủy ảnh gốc; lưu các phiên bản có định danh / P0 |
| M02 D09 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:104` | Metadata / Bảo toàn thông tin hữu ích, bổ sung/điều chỉnh thông tin hiển thị, quản lý GPS riêng / P0 |
| M02 D10 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:105` | Search / Theo tên, ngày, album, tag, người upload, liên kết và các bộ lọc cơ bản / P0 |
| M02 D11 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:106` | Favorites / Đánh dấu yêu thích theo từng tài khoản / P0 |
| M02 D12 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:107` | Chia sẻ / Hỗ trợ Share Existing Asset hoặc Create Shared Copy có xác nhận / P0 |
| M02 D13 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:108` | Delete / Trash 30 ngày; kiểm tra tham chiếu trước xóa vĩnh viễn / P0 |
| M02 D14 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:109` | Export / File gốc, nhiều file, album, metadata theo quyền / P0 |
| M02 D15 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:110` | Storage Dashboard / Có trong V1.0 / P0 |
| M02 D16 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:111` | Quản lý album chung / Hai người cùng quản lý theo quyền, tránh silent overwrite / P0 |
| M02 D17 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:112` | Liên kết / M01, M03, M04, M05 và Our Timeline, có thể mở rộng / P0 |
| M02 D18 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:113` | Smart AI Features / Ngoài V1.0 / P2 |
| M02 D19 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:114` | Data Protection / Backup, restore và kiểm thử khôi phục / P0 |
| M02 D20 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:115` | Mobile/Desktop / Các nghiệp vụ trọng tâm trên cả hai thiết bị / P0 |
| M05 D22 | `OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:138` | Không bắt buộc đồng bộ Google/Outlook V1.0 / Không lệ thuộc tài khoản lịch ngoài |
| M06 D01 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:82` | Wish và Goal / Hai đối tượng nghiệp vụ riêng, liên kết được / Tách trạng thái, màn hình, quyền và phép đo. |
| M06 D02 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:83` | Tạo Wish / Chỉ yêu cầu tên; không bắt buộc ngày/ngân sách / Add Wish có thể lưu ngay. |
| M06 D03 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:84` | Quyền mặc định / Private; hỗ trợ Personal và Shared / Không được tự chia sẻ. |
| M06 D04 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:85` | Wish Collections / Một Wish ở nhiều Collection / Gỡ membership không xóa Wish. |
| M06 D05 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:86` | Phân loại / Category và Tag tùy chỉnh / Không khóa nội dung vào danh mục cứng. |
| M06 D06 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:87` | Wish → Goal / Giữ Wish gốc và liên kết nguồn / Không thay thế hay xóa Wish khi chuyển. |
| M06 D07 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:88` | Loại Goal / Checklist, Numeric, Outcome, Linked trong V1.0 / Một phương pháp đo tiến độ chính/Goal. |
| M06 D08 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:89` | Deadline / Tùy chọn; quá hạn không auto Failed / Overdue là nhãn tính toán cho Active. |
| M06 D09 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:90` | Goal Draft / Được lưu thiếu cấu hình; validate trước Active / Draft vẫn Private theo mặc định. |
| M06 D10 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:91` | Milestones & Tasks / Cả hai và phân công từng người / Milestone khác Task, không auto hoàn thành Goal. |
| M06 D11 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:92` | Progress / Tự nhập hoặc từ nguồn liên kết / Có lịch sử và quy tắc nguồn/đếm. |
| M06 D12 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:93` | Đạt 100% / Không auto chốt khi phải xác nhận / Cho phép kiểm tra đủ điều kiện. |
| M06 D13 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:94` | Goal chung / Owner Confirmation mặc định, Both Confirmation tùy chọn / Ghi nhận xác nhận đúng tài khoản và phiên bản. |
| M06 D14 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:95` | Mở lại Goal / Được mở lại, giữ lịch sử/Achievement / Không xóa vết mục tiêu cũ. |
| M06 D15 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:96` | Achievement / Ngày, ghi chú, ảnh, liên kết kỷ niệm / Không tự công khai minh chứng. |
| M06 D16 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:97` | Inspiration / Inspiration Board P0, dùng M02 / Không copy original media. |
| M06 D17 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:98` | Goal Calendar / Deadline/Milestone liên kết M05 / Không duy trì Event riêng. |
| M06 D18 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:99` | Savings Goal / M07 là chủ dữ liệu tài chính / M06 không có ledger hoặc balance thứ hai. |
| M06 D19 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:100` | Linked Goal / Phép đo rõ, chống trùng / Không suy diễn đếm Place = Visit. |
| M06 D20 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:101` | Search & Insights / Tìm đa điều kiện/thống kê cơ bản P0 / Bắt buộc áp quyền tìm và tổng hợp. |
| M06 D21 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:102` | Collaboration / Hai tài khoản, chống xung đột; không live cursor / Bảo vệ update đồng thời. |
| M06 D22 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:103` | Archive & Trash / Trash ≥30 ngày; không xóa dây chuyền / Restore giữ quan hệ hợp lệ. |
| M06 D23 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:104` | Repeat/Habit / Habit tracking và Goals lặp P1 / Không buộc vào V1.0. |
| M06 D24 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:105` | Export & Device / Export cơ bản; mobile/desktop đầy đủ P0 / Không có luồng core chỉ chạy desktop. |

## 3. Open Controls OP-01–OP-07: phân loại mức chặn

| OP | Vấn đề còn mở sau khi duyệt DEC | Phân loại | Quy tắc không được vi phạm | Gate trước khi... |
|---|---|---|---|---|
| OP-01 | Căn cứ/thời hạn retention, purge original/variant/backup, ngoại lệ pháp lý | POLICY + LEGAL + OPERATIONS | DEC-01 không cho giữ bytes vô hạn hay purge ngoài quyền | đóng vòng đời dữ liệu/backup/restore và triển khai |
| OP-02 | Thẩm quyền Cancel/Delete Sealed Capsule đồng sở hữu khi bất đồng/offline | PRODUCT POLICY + CONSENT | Không mở sớm, không phá Seal, tôn trọng cả hai người | khóa M08 lifecycle/consent flows |
| OP-03 | Hậu 30 ngày: xác thực, quyền xuất và đối soát confirmed debt | PRODUCT POLICY + LIFECYCLE | Không tạo nợ mới, không hồi sinh quyền hay tự xác nhận | khóa hậu Disconnect/Delete/Export M07/M10 |
| OP-04 | Minor unit FX, tỷ lệ, phân bổ remainder và rounding | FINANCIAL BUSINESS RULE | Đủ 2 bên đồng thuận, không cộng số khác currency | khóa tính toán M07 và test oracle |
| OP-05 | Series/Occurrence mapping, Pending Sync conflict, relink UX | BUSINESS CONTRACT + UX | Không nhân Event, không chuyển comments/RSVP sai occurrence | khóa M05/M03/M04 integration design |
| OP-06 | DST gap/fold, birthday month/day, date-only UX | UX VALIDATION | Không giả ngày/tuổi hoặc đổi ngày vì timezone | khóa calendar UX/test fixture |
| OP-07 | Notification group window, stale threshold, lockscreen preview/channels | UX + NOTIFICATION CONTRACT | Không lộ Private; Quiet Hours không dời domain state | khóa Notification Center UX; không thêm push/email P0 |

**Chú ý:** DEC-03.A3 đã được chấp thuận là **lối xử lý giới hạn đối với khoản nợ cũ**, nhưng OP-03 chưa chốt chi tiết chứng thực/quyền/vòng đời. Đối với DEC-01, không được tự đặt thời hạn backup, purge hay retention chỉ để lấp bảng.

## 4. Gate quyết định giai đoạn kế tiếp

| Gate | Điều kiện kiểm soát | Kết luận hiện tại |
|---|---|---|
| G-01 Baseline integrity | Đủ BRD M01–M10; 247 Dxx; 7 DEC; không có thay đổi trái nguồn | **PASS** (theo bytes ZIP đã nhận) |
| G-02 Traceability | Mỗi Dxx→AC/test có chứng cứ; 763 AC được phân loại scope; 86 P0 feature family được kiểm chéo | **OPEN** (60 thiếu link trực tiếp; 187 cần semantic review) |
| G-03 Cross-module contract | 8 CT đủ rule/negative/state/ownership và owner validation | **DRAFT — CHƯA SIGN-OFF** |
| G-04 Product/operational controls | OP-01..07 được chốt đúng thẩm quyền hoặc quy định rõ assumptions chưa khóa | **OPEN** |
| G-05 Readiness for architecture comparison | Ràng buộc privacy, realtime, 2 accounts, restore, finance, Capsule và P0 desktop/mobile rõ | **CONDITIONAL GO** (được nghiên cứu phương án, không lựa chọn stack) |
| G-06 Architecture baseline/freeze | G-02..04 pass, owner approves design constraints, unresolved CR có exception hợp lệ | **NO-GO** |
| G-07 Implementation/QA | Thiết kế được duyệt, test oracles finalized, P0 release gates | **NOT STARTED** |

## 5. Thứ tự hoàn thiện không làm thay đổi quyết định đã duyệt

**Ưu tiên A — bảo vệ bất biến (Policy Review cần sign-off):** OP-01, OP-02, OP-03, OP-04. Đây là ranh giới deletion/retention, Seal, disconnect/old debt và rounding tiền. Không nên chốt cơ chế triển khai khi chưa có lựa chọn hợp lệ.

**Ưu tiên B — hợp đồng trải nghiệm và tích hợp:** OP-05, OP-06, OP-07. Viết examples đầy đủ (series split, DST, dedupe) rồi kiểm chứng với BRD/DEC; nếu có ảnh hưởng chính sách/Dxx thì lập Change Request, nếu chỉ là lựa chọn UX thì ghi Design Decision Log và owner review.

**Ưu tiên C — khóa truy vết:** bổ sung evidence cho 60 Dxx (không tự ghi là BRD explicit mapping), xác nhận semantic mapping của 187 Dxx, kiểm P0 scope từng AC, liên kết 40 E2E vào CT/Feature family/AC, kiểm thử negative cases và mobile parity.

**Ưu tiên D — so sánh kiến trúc (chưa lựa chọn):** chỉ được lập danh sách yêu cầu và tiêu chí đo: co-edit đồng thời M01, data ACL hai chiều, state machine M08/M07, audit, export, backup + restore drill, điều kiện hạ tầng/chi phí. Không vội đưa tech stack vào tệp này.

## 6. Decision Readiness Register (không tự phê duyệt)

| Nhóm | Hiện được quyết định gì? | Ai phải xác nhận tiếp? | Khi chưa xác nhận |
|---|---|---|---|
| Dxx 247 | Khóa nguyên văn BRD V1.0 | Không yêu cầu PO duyệt lại | Vẫn hiệu lực |
| DEC-01..07 A1..A5 | Approved Supplement V1.0 | Không yêu cầu PO duyệt lại | Vẫn hiệu lực |
| OP-01..03 | Chỉ có nguyên tắc ràng buộc | PO, privacy/legal/operations theo ngữ cảnh | Không đặc tả retention/consent/closed lifecycle thành final |
| OP-04 | Nguyên tắc hai bên xác nhận và rounding minh bạch | PO/business finance validation | Không cố định rounding làm phát sinh nợ |
| OP-05..07 | Behavior guards đã khóa, UX chi tiết chưa | Domain owners/PO nếu UX đổi nghiệp vụ | Giữ trạng thái draft; test oracle cần thêm |
| CT-01..08 | Working draft | Cross-module business review | Chưa sign-off; chưa tạo API/schema |
| Master P0 | Draft với 86 families, 40 E2E, 763 AC | QA/product scope review | Không coi 763=763 P0 hoặc QA PASS |

## 7. Kịch bản architecture-readiness cần cung cấp cho nhóm thiết kế (phi công nghệ)

| Case | Stress scenario | Oracle tối thiểu |
|---|---|---|
| AR-01 | A revoke media khi B đang xem Shared Book/PDF | B không lấy bytes mới, Publication history không bị sửa |
| AR-02 | A/B đồng sửa cùng Page M01, một người offline/reconnect | Không mất acknowledged edit, không undo thay đổi của B |
| AR-03 | M02 full purge sau khi Book Published hoặc Capsule Sealed | Không phục vụ bytes trái quyền, Seal/version không bị rewrite |
| AR-04 | M08 Time Capsule đến unlock_at trong lúc Space Frozen/Disconnected | Không Reveal khi Paused, không sửa thời điểm Seal |
| AR-05 | Reconnect nhưng recipient chưa đồng ý lại | Không tái phát Letter/Capsule/notification queue cũ |
| AR-06 | Expense nhiều payer có phần confirmed và pending | Không tạo debt từ pending, tổng không bị nhân |
| AR-07 | Refund sau confirmed settlement và FX nhiều tiền tệ | Có history correction, thiếu consent thì Pending/Disputed |
| AR-08 | Một Expense link Visit+Trip+Goal, retry nhiều lần | Một canonical Expense, mọi projection chống nhân số |
| AR-09 | Series recurrence split và comment vào occurrence cũ | Comment/RSVP giữ đúng occurrence, không tự di chuyển |
| AR-10 | M05 date-only qua timezone/DST và Birthday thiếu năm | Không tự đổi ngày hoặc tạo tuổi/năm giả |
| AR-11 | Secret Surprise qua M09 mention/Notification/Search | Không lộ nội dung hoặc sự tồn tại trái quyền |
| AR-12 | Delete→Trash 30d→Restore, sau đó revoke/quyền đổi | Không cascade và không hồi sinh grants đã thu hồi |
| AR-13 | Restore backup chứa giao dịch confirmed và notification đã gửi | Không double-settle, không replay Reveal, không tạo nợ |
| AR-14 | Hai account A/B trên desktop và mobile cùng thao tác P0 | Quyền/trạng thái/nghiệp vụ tương đương, không mobile read-only |

Các kịch bản trên là **scenario brief** cho thiết kế/QA, không báo đã chạy. Kết quả chạy mặc định `NOT_RUN`.

## 8. Bàn giao và quản trị thay đổi

1. Để trong `OurSpace/Reviews/Readiness/`, **không** đưa vào `Docs/Policies` vì chưa có phê duyệt mới.
2. Các file được sinh trong lượt này: Readiness Review và CSV khai triển explicit Dxx→AC. CSV **không sửa** 2 CSV baseline đã bàn giao.
3. Bước làm việc kế tiếp hợp lý nhất: soạn bộ **OP Closure Proposal V1.0** (đi kèm chính sách đề xuất, ngoại lệ, ví dụ tính/consent và tiêu chí duyệt), sau đó mới chuyển các bản contract sang bản được review và đánh dấu traceability mức độ đủ.
4. Dù bước phân tích xong, **CT draft ≠ contract approved; AC catalog ≠ P0 classification; QA NOT_RUN ≠ PASS; Review complete ≠ implementation ready**.

## 9. Fingerprints nguồn đang dùng

| Tệp | SHA-256 hiện tại |
|---|---|
| `OUR_SPACE_APPROVED_POLICY_SUPPLEMENT_V1.0.md` | `fc365c1b00e6d9e1b472de43a92171c74ec0d7ae03ac7960c8ebdef3ceb1ea09` |
| `OUR_SPACE_POLICY_DECISION_DOCKET_V1.0.md` | `d01da207d80a926f91c43a616e2183325b553d87ebd18c67ee6ce28a3b428b41` |
| `OUR_SPACE_CROSS_BRD_CONSISTENCY_REVIEW_FINAL_V1.0.md` | `d2cf9ed84d359938ccd837e29ed05d75050efb30ad6a55d8c02a93456cb26a12` |
| `OUR_SPACE_CROSS_MODULE_CONTRACTS_CT01_CT08_DRAFT_V1.0.md` | `fb792e674450d653595e896d343ae1f4dbed91e42ec315d2258cfa990bf3eb22` |
| `OUR_SPACE_MASTER_P0_ACCEPTANCE_MATRIX_DRAFT_V1.0.md` | `916d4c95c2931fe084c36f1eab688a83a4b3dd8a5ebe2a1b6b8db02b4e1bfb56` |
| `OUR_SPACE_DXX_TRACEABILITY_247_DRAFT_V1.0.csv` | `15eba8f67f37415b0378291fa0edd0e2b1b0e3e7b0cf034cdf3a137d4375e743` |
| `OUR_SPACE_BRD_AC_TRACEABILITY_763_DRAFT_V1.0.csv` | `1c67e2e86d3c3d19cf32826bc114c346c7da3cc3a6ec2a2b6080798e53339724` |
