---
document_id: OURSPACE-CHAT-HANDOFF-COMPLETE
project: Our Space
version: 2.0
status: CONTEXT_HANDOFF__ALL_10_BRD_APPROVED__NO_IMPLEMENTATION
as_of: 2026-10-23
language: vi-VN
resume_keyword: OURSPACE-RESUME-REVIEW-10
approved_module_count: 10
next_phase: Cross-BRD Consistency Review
scope: Context handoff, approved decision index, cross-module policy summary, and new chat restart instructions
---

# OUR SPACE — BỘ BÀN GIAO NGỮ CẢNH ĐẦY ĐỦ CHO CHAT MỚI (V2.0)

> **ĐỌC ĐẦU TIÊN KHI MỞ CHAT MỚI.** Tài liệu này tóm tắt tiến trình thảo luận, ý tưởng, 10 module và toàn bộ các quyết định đã duyệt trong dự án **Our Space**. Đã có **10/10 BRD V1.0 chính thức**. Chưa xây dựng app, chưa chọn stack hoặc thiết kế kỹ thuật chính thức. Công việc kế tiếp là **Cross-BRD Consistency Review**, không phải đề xuất lại M01–M10.
>
> **Từ khóa tiếp tục:** `OURSPACE-RESUME-REVIEW-10`.
>
> **Lưu ý độ tin cậy:** Đây là bản tóm tắt/bàn giao, **không phải transcript nguyên văn**. **10 BRD** là nguồn tham chiếu nghiệp vụ chi tiết. Trường hợp handoff rút gọn hoặc diễn đạt khác BRD, hãy mở BRD tương ứng. Nếu **hai BRD đã duyệt xung đột**, không âm thầm lấy bản mới ghi đè bản cũ: lập issue và xin chủ dự án quyết định.

## A. ĐỌC NHANH TRONG 90 GIÂY — NHỮNG ĐIỀU KHÔNG ĐƯỢC NHẦM

1. **Dự án:** Our Space, một web platform riêng tư, dài hạn dành cho **hai người / hai tài khoản độc lập**, có thể lưu kỷ niệm và quản lý những kế hoạch chung.
2. **Đã xong:** **Toàn bộ 10 BRD M01–M10 đã được người dùng lần lượt xác nhận “Tôi chốt toàn bộ đề xuất Mxx” và xuất Markdown V1.0**; 247 quyết định đánh mã Dxx đã duyệt. Các file BRD là tài liệu nghiệp vụ **chứ không phải mã nguồn đã chạy**.
3. **Chưa làm:** Chưa code, chưa chọn framework/database/cloud/storage/provider, chưa thiết kế API/schema, chưa kiểm thử sản phẩm, chưa phát hành. **Không giả định có repo/code hoặc tích hợp thật.**
4. **Ngay sau đây:** **Cross-BRD Consistency Review** toàn 10 tài liệu → Issue/Conflict Log → chốt những điều mâu thuẫn hoặc còn mơ hồ → Master BRD và hệ thống contract → thiết kế kiến trúc kỹ thuật và kế hoạch triển khai → Codex code khi được duyệt.
5. **V1.0:** **P0 của cả 10 module** phải đạt trước lần sử dụng/phát hành chính thức; P1/P2 không tự trở thành yêu cầu V1.0.
6. **Private by default**, quyền theo từng đối tượng và liên kết; không rò rỉ qua preview, thumbnail, search, count, feed, notification, export, direct URL hoặc backup.
7. **Source of truth:** M01 Diary/Photobook; M02 Media; M03 Place/Visit; M04 Trip; M05 Calendar Event/Anniversary; M06 Wish/Goal; M07 Expense/Budget/Savings; M08 Moments/Letters/Capsules; M09 Comments/Reactions; M10 Identity/Permission/Notification/Data Lifecycle.
8. **No cascade delete:** xóa nguồn không tự xóa dữ liệu của module khác; Trash 30 ngày, restore, lịch sử, export, backup/restore có kiểm thử.
9. **Thiết bị:** Desktop và mobile đều phải làm được đầy đủ nghiệp vụ P0. Phong cách scrapbook chuyên sâu chỉ thuộc **M01 Photobook**; giao diện phần còn lại hiện đại, dễ đọc.
10. **Quy ước làm việc:** Tiếng Việt, phân tích rất sâu và chủ động; không hỏi lại 247 quyết định đã duyệt; không tự ý code/chọn stack ở thời điểm review; nếu cần thay đổi phải ghi đề xuất change request/impact cho người dùng duyệt.

## B. MỤC TIÊU, TRẢI NGHIỆM, QUYẾT ĐỊNH TOÀN CỤC

### B1. Tầm nhìn

Our Space là “ngôi nhà số riêng cho hai người”: kể lại quá khứ (ảnh, Photobook, Diary), cùng tận hưởng hiện tại (địa điểm, chuyến đi, lịch, tương tác), và xây dựng tương lai (Bucket List, Goals, Budget/Savings, Time Capsules). Website không phải mạng xã hội công khai, CRM, mạng chat chung hay ứng dụng ngân hàng.

### B2. Nền tảng đã thống nhất

- Hai tài khoản riêng, có thể sử dụng cá nhân trước Pairing; chỉ khi hai người đồng ý thì tạo Couple Space. Ghép đôi không tự công khai dữ liệu cũ.
- Không có “Space super admin” được tự xem mọi Private của người còn lại. Quyền đối tượng độc lập với quyền thành viên Space.
- Giao diện homepage và các module khác hiện đại; **Photobook** có phong cách **vintage scrapbook/collage** với sticker, template và hiệu ứng lật trang. Đây là tách biệt có chủ đích.
- **M01 có Simple Editor và Advanced Editor**, chung dữ liệu/layers, chuyển qua lại không phá layout hay làm mất element. **Hai người co-edit Photobook realtime** (presence/cursors, đồng bộ text/object, conflict/undo/reconnect). Những module khác chỉ yêu cầu version/conflict protection trừ khi BRD quy định rõ hơn.
- Mỗi nghiệp vụ có đối tượng gốc và một nguồn sự thật. Link là **tham chiếu**, không tự nhân bản bản ghi gốc; cùng Expense gắn 5 module vẫn là một Expense.
- **P0 không được loại bỏ chỉ vì khó triển khai**, và **P1/P2 không bắt buộc** trước V1.0 nếu chưa có thay đổi phạm vi được chủ dự án duyệt.
- Có lịch sử, Trash 30 ngày, export, backup và **thử restore thực tế**, không chỉ “có backup”. Thời gian/giới hạn dung lượng, số lượng ảnh, cloud cost, các thông số hiệu năng, RPO/RTO... còn là việc của giai đoạn kiến trúc/NFR và không được bịa thành quyết định.
- UI phải có loading/empty/error/permission/partial failure/retry/sync conflict; không báo “saved”, “delivered”, “settled”, “opened” nếu trạng thái chính thức chưa xảy ra.
- Người dùng đã gửi **`photobook.mp4` (~29 giây)** làm tham chiếu hình ảnh/nhịp lật trang/collage; kèm contact sheet `photobook_contact_ourspace.jpg`. Đó là **tham chiếu thẩm mỹ**, không phải spec chức năng đầy đủ. Link trao đổi chia sẻ trước đây từng nêu: `https://chatgpt.com/share/6ad95094-1380-83ec-a37c-9ef617ce4627` — đừng tự giả định đã đọc mọi nội dung của link.

### B3. Cách làm việc mà chủ dự án mong muốn

- Khi một module chưa duyệt: chủ động trình bày từ đầu tới cuối mục tiêu, màn hình, dữ liệu, trạng thái, business rules, permissions, use cases, ngoại lệ, acceptance criteria, P0/P1/P2, và bảng quyết định D01–Dnn. Chỉ khi người dùng chốt toàn bộ thì tạo BRD Markdown độc lập trong `OurSpace/Docs/`.
- **Giai đoạn hiện tại khác:** M01–M10 đều đã chốt, không lặp lại phần proposal. Hãy **đọc và audit** 10 BRD rồi đưa ra phát hiện, mức độ ưu tiên, đề xuất giải pháp và những quyết định mới thực sự cần người dùng phê duyệt.
- Người dùng muốn tường minh, toàn diện, chủ động giải thích tình huống biên; ghét phải lặp lại thông tin từng chốt hoặc bị hỏi nhiều câu nhỏ.
- Không để Codex tự lựa chọn một chính sách có hậu quả về tiền, quyền riêng tư, xóa dữ liệu hoặc an toàn Time Capsule.

## C. TÌNH TRẠNG, DANH MỤC TÀI LIỆU ĐÃ DUYỆT

**10/10 BRD có thật, ở trạng thái APPROVED BUSINESS REQUIREMENTS; IMPLEMENTATION NOT STARTED.** File cần giữ nguyên tên trong `OurSpace/Docs/`.

| Mã | Module | Số giao diện theo đề xuất | Quyết định được duyệt | Tên BRD chính thức |
|---|---|---:|---:|---|
| M01 | Photobook & Diary | 17 | 15 | `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md` |
| M02 | Memories & Media Library | 13 | 20 | `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md` |
| M03 | Food & Places | 16 | 20 | `OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md` |
| M04 | Travel & Trip Planner | 18 | 22 | `OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md` |
| M05 | Couple Calendar | 17 | 22 | `OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md` |
| M06 | Bucket List & Goals | 18 | 24 | `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md` |
| M07 | Budget & Savings | 20 | 30 | `OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md` |
| M08 | Special Moments | 20 | 30 | `OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md` |
| M09 | Couple Interaction | 15 | 24 | `OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md` |
| M10 | Personalization, Accounts & Settings | 24 | 40 | `OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md` |

> Các bộ mã quy tắc/Use Cases/Acceptance Criteria có định dạng khác nhau ở các BRD đầu (đặc biệt M01/M02). **Không được suy diễn rằng M01/M02 thiếu BR/AC chỉ vì chúng không dùng mẫu mã BR-Mxx giống M03–M10.** Kiểm tra trực tiếp tài liệu nguồn.

## D. TÓM TẮT CHI TIẾT TỪNG MODULE (M01–M10)

### D1. M01 — PHOTOBOOK & DIARY [APPROVED]

**Trách nhiệm:** M01 là nơi giữ Diary và Photobook. Diary độc lập với Page; Photobook là sản phẩm biên tập/kể chuyện, không phải chỉ danh sách ảnh.

**Trải nghiệm & P0:**
- Portrait và landscape; Reader có lật trang, vuốt và hiệu ứng dự phòng cho reduced motion. Nhạc nền không P0, video nhúng trang không bắt buộc V1.0.
- Simple Editor theo template và Advanced Editor tự do layer/collage, text/sticker/ảnh; chuyển qua lại **không mất dữ liệu**. Ít nhất 8 mẫu template khác biệt trong 8–12 mẫu khởi đầu.
- Two-person **real-time** collaboration sâu, nhiều tab/thiết bị có session riêng; xem người đang chỉnh, đồng bộ text box/element/position, giải quyết xung đột và personal undo an toàn. **Không dùng last-write-wins cho toàn trang**.
- Photobook Library, Create, Overview, Reader, Page Manager, Simple/Advanced Editor, Template Library, Asset Picker, Collaboration Panel, Version History, Share & Permissions, Publish & PDF Export; Diary Timeline/Editor/Detail/Link to Photobook.
- Diary có thể private, chỉ cần conflict protection chứ không buộc realtime sâu. Diary → Photobook mặc định **Copy as Snapshot**; sửa bản sao không đổi Diary gốc.
- Draft/Revision khác Published. Bản **Published immutable**, chỉnh tiếp trên draft/revision. PDF Export P0. Owner Publish mặc định; Editor phải được cấp quyền Publish riêng. Page có thể kế thừa Book permission nhưng có ngoại lệ.
- Thùng rác 30 ngày; không public/guest share trong V1.0; nội dung M02 được tham chiếu không upload lại.

**Biên giới quan trọng:** M01 sở hữu Diary, Book, Page, Published version; M02 sở hữu ảnh/video; M09 sở hữu bình luận tương tác. Không tự sửa bản Published hoặc phá nguồn ảnh.

### D2. M02 — MEMORIES & MEDIA LIBRARY [APPROVED]

**Trách nhiệm:** Kho ảnh/video gốc và quyền tài nguyên. M01, M03, M04, M08 dùng asset bằng tham chiếu; không nhân bản file vì xuất hiện nhiều nơi.

**Trải nghiệm & P0:**
- Hỗ trợ mục tiêu JPEG/PNG/WebP/HEIC, MP4/MOV theo khả năng upload, preview/fallback; giữ original hợp lệ và metadata nguồn.
- Smart bulk Upload có queue theo file, tiến độ, retry, partial success, resumable/recovery theo tài liệu; phát hiện duplicate theo **content** chứ không chỉ filename. Không tuyên bố trang web tự đồng bộ toàn bộ camera roll chạy nền P0; mobile share sheet P1, automatic phone backup P2/định hướng tương lai.
- Manual Album, Smart Collections cơ bản, nhiều album cùng tham chiếu một asset; Favorites riêng từng người.
- Non-destructive image editing, lưu phiên bản; original không bị crop/chỉnh màu phá hủy.
- Phân biệt ngày chụp/ngày upload/ngày của kỷ niệm, GPS nhạy cảm có quyền riêng; search/filter, tag, metadata, storage overview và export.
- Private media/album mặc định, album Shared không tự công khai asset Private. Có share asset một cách rõ ràng và phương án copy phù hợp khi được chọn.
- Trash 30 ngày; backup/restore và test khôi phục. Không đặt quota/codec/capacity tùy tiện.

**Biên giới:** M02 sở hữu Media Asset/Album. Booking PDF có thể cần kho tài liệu dùng chung ngoài phạm vi ảnh/video M02; đây là vấn đề mở tại review/architecture.

### D3. M03 — FOOD & PLACES [APPROVED]

**Trách nhiệm:** Kho Place thống nhất cho **mọi loại địa điểm vui chơi và trải nghiệm**, không riêng nhà hàng: café, tiệm bánh, rạp phim, công viên, bảo tàng, du lịch, khu vui chơi v.v.

**Các đối tượng không được đồng nhất:** `Place ≠ Wish/Want-to-visit ≠ Date Plan ≠ Visit ≠ Per-person Review`. Một Place có nhiều Visits; đã Visit vẫn có thể trong Wishlist và được lên kế hoạch lại.

**Trải nghiệm & P0:**
- Tạo Place bằng tay/link, tự điền best-effort, lưu chi nhánh riêng, cảnh báo trùng. Place Detail, Wishlist, Collections, Date Planning, Visit History/Detail, Ratings, Dishes/Drinks khi phù hợp.
- Mỗi người có **rating/review riêng theo từng Visit**, Overall 1–5 bước 0,5, tiêu chí phụ tùy chọn; chưa đánh giá không đồng nghĩa 0.
- Dishes/Drinks/menus chỉ áp dụng địa điểm ăn uống, không buộc một bảo tàng/rạp phim có thực đơn.
- Favorites và Want Revisit **theo từng tài khoản**, không phải thuộc tính Shared mặc định.
- Place Random Picker có filter P0. External map/directions P0, embedded interactive map P1. Search/Insights P0, AI nâng cao P2.
- M03 Date Plan liên kết M05 Event; Visit cần xác nhận thực tế, **không tự sinh Visit** chỉ vì Date Plan đã đến ngày hoặc Trip Activity đã Completed.
- Chi phí đi chơi nếu nhập trong giao diện M03 vẫn phải tạo/link Expense **M07**. Ảnh tham chiếu M02.

**Biên giới:** Không tạo kho Place trong M04; không tạo ledger riêng trong M03; permission Private/Shared và Trash 30 ngày.

### D4. M04 — TRAVEL & TRIP PLANNER [APPROVED]

**Trách nhiệm:** Dream Trip, Trip, Itinerary/Activity, các chặng di chuyển, Accommodation, Booking/Documents, packing/preparation checklist.

**Trải nghiệm & P0:**
- Day Trip, nhiều ngày, trong/ngoài nước, multi-destination. **Dream Trip không cần ngày**, không tự tạo ngày giả; hoạt động có thể Unscheduled.
- Lifecycle: Dreaming, Planning, Ready, In Progress, Completed, Cancelled, Archived; không auto-Completed chỉ vì qua ngày về.
- Timeline/Planning View, reorder/move day/duplicate Activity với ý nghĩa dữ liệu rõ, tham chiếu Place từ M03, map links P0, embedded map/routes/optimization nâng cao P1/P2.
- Chặng di chuyển và múi giờ địa phương, nhiều nơi lưu trú, Booking và PDF/e-ticket tài liệu đi lại có quyền. Packing/preparation checklists có owner, không tự Ready chỉ vì tick hết checklist.
- Trip Budget hoặc số tiền dự kiến hiển thị trong M04, nhưng chi phí chính thức thuộc M07; nhiều đồng tiền không được cộng trực tiếp.
- Calendar Event chính thức thuộc M05. Activity hoặc Trip liên kết Event M05, phải xử lý đồng bộ, retry, idempotency và quyền.
- Trip Completed **không tự tạo M03 Visit**; cần xác nhận ghé thực tế. Trip Recap và tạo Photobook du lịch qua M01; album/media tham chiếu M02.
- Realtime cursor không P0 như M01; chống xung đột phiên bản. Network robustness P0, full offline P1. Structured export P0, pretty PDF itinerary P1, AI trip planning P2.

**Biên giới:** M04 sở hữu Trip/Itinerary/Booking, không sở hữu Place/Calendar Event/Expense/Photobook.

### D5. M05 — COUPLE CALENDAR [APPROVED]

**Trách nhiệm:** Calendar Events và Anniversary với My Calendar/Our Calendar; mọi liên kết lịch từ M03/M04/M06/M08 đều sử dụng M05 làm nguồn Event.

**Trải nghiệm & P0:**
- Month/Week/Day/Agenda; all-day hoặc timed event, có ngày bắt buộc; personal/shared permission theo Event.
- Event types Couple Date, Anniversary, Birthday, Trip, Personal, Appointment, Custom. Status Tentative/Confirmed/Completed/Cancelled. RSVP riêng từng người Going/Maybe/Not Going/No Response.
- Anniversary và Days Together; bộ đếm mặc định số ngày elapsed, tùy chọn ordinal Day N. **Feb 29** mặc định tính ngày kỷ niệm Feb 28 trong năm không nhuận, người dùng có thể đổi Mar 1.
- Recurrence Daily/Weekly/Monthly/Yearly/Custom. Edit một occurrence, this-and-future hoặc toàn series; **tháng có ngày 31** thì đến tháng ngắn hơn clamp vào ngày cuối tháng.
- Hỗ trợ thời gian, timezone, all-day, DST và edge cases. Multiple reminders mỗi Event, **cấu hình reminder riêng cho A và B**, Quiet Hours riêng. In-app reminder P0, email/push P1.
- Conflict Warning, **không ép cấm** tạo Event trùng. Personal Busy/Free sharing mặc định **OFF**.
- M03/M04 sync tạo/link Event M05 idempotent, tránh duplicate, xử lý fail/retry, không xóa dây chuyền. M08 scheduled reveal liên kết nhưng chính sách bí mật thuộc M08.
- Structured export P0, iCalendar P1, Google/Outlook two-way sync P2, Trash 30 ngày.

**Biên giới:** M05 là calendar source; không được làm lộ Event hoặc nội dung Private qua notification, các calendar view, Busy/Free hay sync.

### D6. M06 — BUCKET LIST & GOALS [APPROVED]

**Trách nhiệm:** Wish, Wish Collection, Goal, Milestone, Task, Progress/Confirmation/Achievement. Giữ tinh thần ước mơ, không buộc mọi mong muốn thành deadline.

**P0:**
- **Wish khác Goal:** Wish chỉ cần tên, không bắt buộc ngày/tiền/kế hoạch; được Private mặc định. Một Wish thuộc nhiều Collections, chuyển thành Goal phải giữ Wish gốc và quan hệ nguồn; Wish có thể Fulfilled mà không tạo Goal.
- Goal types: Checklist, Numeric, Outcome, Linked; Draft thiếu chi tiết được, Active cần criteria hợp lệ; deadline tùy chọn, quá hạn hiển thị Overdue chứ không tự Failed.
- Milestone, Task, owner/contributor, phân công A/B, trạng thái và tiến độ. Numeric > target giữ giá trị thực; không chia cho 0; **100% không tự Completed** nếu còn điều kiện xác nhận.
- Shared Goal có Owner Confirmation mặc định và Both Confirmation tùy chọn. Goal hoàn thành có Achievement và lịch sử; Reopen Goal giữ Achievement cũ, không âm thầm sửa định nghĩa cũ.
- Linked Goal đọc kết quả từ M03/M04/M07 với quy tắc đếm (Unique Place ≠ number of Visits), không tự viết Expense/Trip/Calendar Event. Savings Goal số dư thuộc M07; Deadline/Event thuộc M05; ảnh M02; kỷ niệm M08/M01.
- Inspiration Board, Personal/Shared, Search, Insights cơ bản, history, 30-day Trash, export, mobile/desktop.
- Habit streaks/recurring goals/templates nâng cao P1; AI P2.

**Biên giới:** M06 sở hữu aspirations/progress, M07 sở hữu tiền; không nhân bản nguồn kết quả liên kết.

### D7. M07 — BUDGET & SAVINGS [APPROVED]

**Trách nhiệm:** Ledger chi phí, Split Allocation, Shared Balance, Settlement, Refund, Budget, Savings Goal, Contribution/Withdrawal và FX snapshot.

**P0 và bất biến:**
- Private Money và Shared Money; Expense `payer (người thực trả)` **khác** `share/beneficiary (người chịu)`. Một hóa đơn có nhiều Payer.
- Split types: Equal/Fixed/Percentage/Weighted; mặc định Equal 50/50 khi A/B cùng chịu; tổng người trả và tổng phân bổ phải khớp với tổng Expense; xử lý rounding có quy tắc.
- Một người không thể đơn phương tạo **nợ đã được xác nhận** của người kia: đối tác phải approve phần nghĩa vụ, có Pending/Reject/Adjust.
- Shared Balance ròng + chi tiết; Settlement từng phần, người nhận xác nhận; **Settlement không phải Expense mới**. Refund/Adjustment liên kết Expense gốc, xử lý chuẩn trường hợp Refund sau Settlement mà không xóa lịch sử.
- Budgets: Monthly/Category/Trip/Custom; 80%/100%/>100% alerts, vượt budget cảnh báo chứ không chặn Expense hợp lệ; kỳ tháng lịch, chưa rollover P0. Dự toán không phải chi đã trả.
- Savings Goal cá nhân/chung, Contributions/Withdrawals/Adjustments, tiền ghi nhận chứ không khẳng định số dư ngân hàng thật. Quỹ đạt target không tự Completed. Tracking contribution **không tự xác định ownership share**.
- Recurring Expense tới kỳ chỉ tạo pending/suggested, không tự coi đã thực chi.
- Multi-currency P0; giữ amount + currency gốc, tỷ giá thủ công được xác nhận và lưu lịch sử, không cộng JPY và VND trực tiếp; tỷ giá tự động P1.
- M07 là source for all actual expenses & savings across M03, M04, M06; không nhân đôi hóa đơn hoặc Expense vì dùng nhiều module.
- Transaction audit, quyền tài chính chuyên biệt, private receipt, Trash 30 ngày, restore/structured export, test integrity.

**Các phép phân biệt bắt buộc:** Expense ≠ Settlement; Contribution ≠ Expense; Withdrawal ≠ Expense; Refund ≠ Expense âm; Planned Budget ≠ Actual Expense.

### D8. M08 — SPECIAL MOMENTS [APPROVED]

**Trách nhiệm:** Moment, Relationship Milestone, Love Letter, Surprise, Time Capsule.

**P0:**
- Moments có ngày xảy ra khác ngày tạo, Timeline/Collections, góc nhìn Personal Perspectives riêng A/B; Anniversary date/recurrence/reminder thuộc M05 chứ không nằm gốc M08.
- Love Letter Draft/Send Now/Scheduled; Delivered khác Opened; thư Delivered **immutable**, không sửa âm thầm; người gửi không mặc định nhận read receipt chi tiết. Gửi theo lịch phải có date/time/timezone, đúng người, idempotent.
- Surprise Secret hoặc Teaser, mặc định Secret. Không lộ qua home, search, counts, feed, event reminders, linked M06 Tasks, M07 Expense, M02 Media, notification hay direct URL.
- Time Capsule Builder → Ready → **Sealed** → Unlock Eligible → người nhận Opened; recipient state riêng; Secret hoặc Visible Countdown; snapshot media/text bất biến lúc Seal.
- Sau Seal, không sửa trực tiếp content/recipients/unlock_at; ngay cả người tạo không được xem trước qua UI thường; server trusted time quyết định unlock, không dùng đồng hồ thiết bị. Đến unlock mới **eligible**, không có nghĩa đã mở/đọc. Người nhận offline vẫn mở được khi quay lại.
- Collaborative Capsule cần A và B xác nhận đúng phiên bản cuối trước Seal; xung đột lúc Seal phải được xử lý.
- **'Sealed' là quy tắc bảo vệ quyền ở mức ứng dụng/backend, KHÔNG phải cam kết đã có end-to-end encryption.**
- Trash 30 ngày, bảo vệ snapshot và xóa có chủ đích; no cascade delete; Export đọc được không được vượt khóa; backup phải bảo toàn khóa.

**ĐIỂM GIAO D35 M10:** Khi Couple Space Disconnect, **mặc định tạm dừng các nội dung chưa được Delivered/Reveal**. Điều đó không có nghĩa đổi unlock_at, chỉnh snapshot hoặc tự coi người nhận đã Opened. Việc tiếp tục sau disconnect/reconnect cần policy được review; M10 D35 đã được duyệt, không tự đảo ngược.

### D9. M09 — COUPLE INTERACTION [APPROVED]

**Trách nhiệm:** comments/replies, reactions, mentions, feed và thông báo tương tác trên các đối tượng M01–M08; **không có chat tổng quát** trong V1.0.

**P0:**
- Sáu reactions Love/Adore/Haha/Touched/Celebrate/Special; mỗi tài khoản tối đa **một active reaction trên một target**, đổi = replace; gỡ = deactivate.
- Comment text + emoji + multiline + safe links; Reply hiển thị hai cấp, bản thân reply vẫn giữ tham chiếu ngữ cảnh. Comment edited có revision; tác giả được chỉnh/xóa mềm; xóa comment gốc không tự xóa reply hợp lệ.
- Mention người còn lại khi họ có quyền xem nguồn, **mention không tự cấp quyền**.
- Feed và in-app notifications tuân theo quyền nguồn; user prefs và grouping để không spam; notification read ≠ M08 Letter/Capsule Opened.
- Per-target interaction modes Both/Reactions Only/Comments Only/Read Only chỉ **thu hẹp** quyền so với quyền nguồn. M09 không thay Review M03, RSVP M05, Completion M06, Approval/Settlement M07.
- Media Asset comment M02 khác Photobook Page comment M01; target stable IDs, đổi tên/reorder page không làm comment gắn sai.
- Private/Secret/Sealed content không xuất hiện qua count/notification/feed/search/exports, soft delete/restore, concurrent edits, mobile/desktop.

### D10. M10 — PERSONALIZATION, ACCOUNTS & SETTINGS [APPROVED]

**Trách nhiệm:** Accounts/Pairing/Space, identity, credentials/sessions/MFA, permission, themes, locale, accessibility, notifications, storage/export/backup/trash, disconnect/reconnect/deletion.

**P0:**
- Tối đa **2 active members per Couple Space**, một User tối đa **1 Active Space**, có thể dùng cá nhân trước Pairing. Invite link/code **48 giờ**, thu hồi được, confirm cả A và B; không có superadmin có quyền đọc mọi Private.
- Display Name, Avatar, Nickname, Birthday, Bio; Couple Profile (tên/bìa/theme). Email/password/verified email P0, OAuth Google/Apple P1. Sessions, revoke all other sessions, reset credentials, MFA TOTP **tùy chọn P0** có recovery.
- Roles Owner/Editor/Contributor/Commenter/Viewer và source specific controls; linked private resources giữ riêng; Permission Inspector; không cho Owner Space duyệt hộ debt của B hoặc mở Capsule sớm.
- Light/Dark/System, Couple Theme cơ bản; scrapbook chỉ M01; Vietnamese P0, English P1; per-user timezone/format; keyboard/contrast/font/reduced-motion; home personalization đúng quyền.
- **One in-app Notification Center** all modules P0, Quiet Hours/prefs riêng A/B; email/push P1; quiet hours không làm trễ thực tế Letter Delivered/Capsule Unlock.
- Storage privacy, My/Shared export đúng quyền, system backup có test restore, Trash Center 30 ngày, secure audit/security events.
- Log Out ≠ Deactivate ≠ Disconnect ≠ Delete Account. **Mỗi người được Disconnect đơn phương** nhưng không xóa dây chuyền data của đối tác; chung chuyển trạng thái bảo vệ/read-only phù hợp, giai đoạn xử lý **30 ngày**; D35 mặc định **pause unsent/unrevealed scheduled content**. Reconnect cần consent hai người, không tự hồi sinh quyền cũ. Delete Account an toàn, không cho Partner chiếm tài khoản.
- Sealed M08 không tự được quảng bá là E2EE. Kích thước, thuật toán, nhà cung cấp dịch vụ và RPO/RTO sẽ chốt ở technical/security design.

## E. MA TRẬN NGUỒN SỰ THẬT, PHỤ THUỘC VÀ BIÊN GIỚI

| Nguồn sở hữu nghiệp vụ | Đối tượng gốc | Những nơi dùng/tham chiếu | Cạm bẫy phải tránh |
|---|---|---|---|
| M01 | Diary, Photobook, Book/Page/Published Revision | M04 Trip recap, M08 Moment, M09 Comment | Sửa Diary không tự sửa Snapshot trong Photobook, Published immutable |
| M02 | Original Media, Asset Variant, Album | M01, M03, M04, M08, profile M10 | Album Shared không công khai Media Private; không upload/copy gốc vô cớ |
| M03 | Place, Visit, Date Plan, Review per Visit | M04 Activity/Stop, M05 Event, M06 Wish/Goal, M07 expense link | Trip completed không auto Visit; no duplicate Place store |
| M04 | Trip, Itinerary, Activity, Transport, Booking, Docs | M05 Events, M06 Goals, M07 Trip Budget/Expense, M01 recap | Trip completed không auto Goal/Visit; giá Booking không mặc định Expense đã trả |
| M05 | Canonical Event, Anniversary, per-user Reminder | M03 Date Plan, M04 Activity, M06 Due Date, M08 Milestone | Không tạo Event thứ hai; không lộ Personal Event qua shared Calendar |
| M06 | Wish, Goal, Milestone, Task, Progress, Achievement | M03 Place / M04 Trip / M05 Event / M07 Savings / M08 Moment | Goal 100% chưa hẳn Completed; Savings tiền ở M07 |
| M07 | Expense, Payer/Allocation, Settlement, Refund, Budget, Savings Goal | M03 Visit, M04 Trip/Booking, M06 linked Goal, M08 private Surprise spending | Không double count; approval debt riêng; không cộng FX sai |
| M08 | Moments, Milestones, Love Letters, Surprises, Time Capsules, Snapshot | M05 anniversary, M02 photo, M09 reaction, M10 conditional access | Secret/Sealed không được rò; unlock eligible ≠ opened; D35 disconnect |
| M09 | Comment, Reply, Reaction, Mention, Interaction Event | M01–M08 mọi targets được phép | Comment không thay business action; target IDs ổn định |
| M10 | User, Pairing, Space, Auth, Permissions, Preferences, Notification, Export/Backup/Lifecycle | Toàn bộ M01–M09 | Không có admin master key, disconnect ≠ delete, không rò private |

### E1. Chín luồng nghiệp vụ hợp nhất phải nhớ

1. **Wish → Goal → Trip → Calendar → Savings → Achievement → Moment → Photobook:** M06 aspiration/goal, M04 trip, M05 event, M07 money, M08 achievement moment, M01 book. Tất cả là references tới đối tượng gốc chứ không clone vô cớ.
2. **Date Plan → Event → actual Visit:** M03 Date Plan có thể link Event M05; hoàn thành lịch chưa đủ chứng minh đã đi; Visit M03 cần người dùng xác nhận.
3. **Trip Booking → Payment → Expense:** Booking M04 có giá dự kiến nhưng khoản đã thanh toán vào M07; đặt cọc và thanh toán phần còn lại không tự tạo 2x Expense.
4. **Shared Expense → Approval → Balance → Settlement → Refund:** Không tự sinh nợ trước khi người phải chịu xác nhận; Settlement không thêm chi phí; Refund sau Settlement phải điều chỉnh nghĩa vụ mà giữ history.
5. **Savings Goal ↔ M06 Linked Goal:** M07 sở hữu Contributions/Withdrawals/Amount, M06 chỉ đọc progress phù hợp quyền.
6. **Anniversary M05 → Letter/Capsule M08:** M05 sở hữu ngày nhắc, M08 sở hữu nội dung trao, trạng thái/cửa sổ khóa độc lập; quiet hours không làm trễ quyền mở.
7. **Published Photobook/Sealed Capsule:** M01 Published cố định; M08 Seal snapshot cố định; thay đổi original M02 không âm thầm làm sửa các phiên bản bất biến.
8. **M09 Interaction:** Comment gắn stable target ID (Page ≠ Media Asset). Bỏ quyền nguồn khiến comment/reaction/feed không thể trở thành lối vượt quyền.
9. **M10 Disconnect:** Dừng hoạt động cộng tác mới, bảo toàn quyền riêng, ledger/letters đã trao; pending reveal pause theo D35; không cascade delete và không đổi nội dung Sealed.

### E2. Bất biến quyền và dữ liệu

- Mọi nội dung nhạy cảm phải check auth + Space membership + item permission + resource permission + conditional reveal state khi phù hợp.
- Cấm lộ existence qua count, preview, search suggestions, URL status khác biệt, thumbnails, push text, reports hoặc export.
- Không dùng trạng thái UI cũ để ghi dữ liệu sau khi permission đã bị thu hồi.
- Cộng tác realtime sâu chỉ M01 Photobook; các phần còn lại tối thiểu có concurrency/version/idempotency.
- Xóa mềm và xóa vĩnh viễn khác nhau; không tự xóa tài nguyên được nhiều đối tượng tham chiếu; người dùng phải được giải thích việc bản sao đã được tải xuống ngoài hệ thống không thể bị thu hồi.
- Backup system có quyền phục hồi dữ liệu Sealed nhưng một export cá nhân KHÔNG được làm lộ nội dung chưa mở.

## F. CÁC CHÍNH SÁCH TRẠNG THÁI VÀ CON SỐ DỄ BỊ QUÊN

- **V1.0:** 10/10 module P0 đạt nghiệm thu. P1/P2 không tự nâng cấp.
- **Trash:** 30 ngày; riêng sự kiện tài chính đã xác nhận, thư đã trao và Capsule đã khóa cần quy trình lịch sử/xóa phù hợp.
- **Invitation pairing:** 48 giờ; hai phía xác nhận; tối đa 1 Space active/user và 2 active members/Space.
- **Disconnect:** người dùng có thể đơn phương ngừng liên kết; giai đoạn dữ liệu chung 30 ngày; pending reveal/delivery default pause (M10 D35).
- **Calendar:** 4 views Month/Week/Day/Agenda; recurrence day 31 clamp; leap-day Anniversary Feb 28 mặc định hoặc Mar 1 tùy chọn; individual reminders, personal Busy/Free OFF mặc định.
- **M06:** Wish chỉ cần title; Goal có thể không deadline; 4 Goal types; tiến độ đạt 100% phải theo chính sách xác nhận.
- **M07:** 4 Split methods; Shared Expense Equal 50/50 default nếu chia hai; Budget alert thresholds 80/100/over; multi-currency giữ gốc; tỷ giá manual V1; no bank integration V1.
- **M08:** thư Delivered không sửa; Capsule Sealed không sửa content/recipient/unlock_at; unlock ≠ opened; snapshot sealed; no E2EE promise.
- **M09:** 6 reactions; 1 active reaction / user / target; comment 2-level; no general chat.
- **M10:** theme Light/Dark/System; Vietnamese P0, English P1; TOTP optional P0; in-app notification P0, email/push P1; Keyboard/reduced motion accessibility.

## G. VIỆC CHƯA LÀM / CHƯA ĐƯỢC QUYẾT ĐỊNH

**Tình trạng thực tế:** Có **BRD được phê duyệt**, **không có bằng chứng sản phẩm đã được xây dựng/triển khai/test**. Không suy ra công nghệ chỉ vì BRD đề cập 'backend', 'database', 'sync' hay 'server time'.

Các vấn đề còn mở nên được phân nhóm:

1. **Consistency/conflicts:** Chồng chéo Permission/Ownership/Role của M01–M10, đặc biệt per-item private child trong parent shared; ảnh gốc M02 vs snapshots M01/M08; policy khi Disconnect M10 ảnh hưởng scheduled M08 và lịch M05; shared expense visibility M07 trong shared budget/trip.
2. **Financial guarantees:** Split rounding, transaction adjustments, refund-after-settlement, negative/partial states, FX rate snapshots, multi-currency netting, ledger invariants, double count giữa M03/M04/M06/M07. Phần lớn business principles đã chốt, còn chi tiết kỹ thuật và test corpus cần kiểm tra.
3. **Time/calendar:** recurrence exceptions, DST, canonical timestamps, all-day semantics, reminder per-user, M08 unlock scheduler, quiet hours, cross-timezone, race between cancel vs deliver/unlock.
4. **Files:** M02 focus photos/videos; M04 booking PDFs/e-tickets, M07 receipts, M08 snapshots cần **capability tài liệu/file chung**, phân quyền, quota, retention. Chưa chọn storage tech.
5. **Privacy/export/retention:** phân biệt item Trash 30 ngày, disconnect cooling/settlement period 30 ngày, backup retention/purge, export scope, ownership của content đã trao và co-created items. Không đồng nhất những mốc 30 ngày này.
6. **Concurrent collaboration:** M01 realtime coedit protocol, M04/06/07/08/09/10 version conflicts and idempotent actions, pending scheduled tasks. Tech design sau review.
7. **Global infra:** Account/session/MFA, notifications, scheduler, search indexing permissions, audit, data model keys, authorization, architecture, backup validation, security threat model, NFRs.
8. **UX deliverables:** sitemap và design system tổng thể, responsive mobile/desktop, Wireframes, M01 scrapbook editor/reader, critical flow prototypes, localization.
9. **Specs for implementation:** DB schema/API contracts/cloud, file storage/cost, provider choices (maps, mail/push, auth), deployment, environment, tests, CI/CD, rate limits/file limits, RPO/RTO. **Không được tự ghi là đã chốt**.
10. **Review outcome:** Need **issue register** (critical/high/medium/low), cross-BRD mapping, proposed fix with source citations to filename/section/rule, owner decision if impacts Dxx, resolved/accepted/deferred status, clean approved baseline before code.

### G1. Không được thay đổi những quyết định đã duyệt khi audit

- Không chuyển một P1/P2 thành P0 hoặc xóa P0 vì muốn dễ code.
- Không sửa Dxx đã được người dùng duyệt; muốn thay đổi phải có Issue và Change Request với tác động.
- Khi M10 nói về chính sách chung mà M01–M09 chi tiết khác, cần **đối chiếu và đề nghị cách áp dụng**, không tự gán 'BRD mới hơn thắng mọi điểm'.
- Mô phỏng UI, giá trị tiền/địa điểm/trip trong bản đề xuất là **ví dụ**, không phải dữ liệu thật cần nhập vào app.

## H. BƯỚC TIẾP THEO — CROSS-BRD CONSISTENCY REVIEW

**Đầu việc ngay sau khi mở chat mới:**

1. **Đọc đủ 10 BRD trong `Docs/`.** Bắt đầu bằng phần Dxx/Scope/Models/Permissions/Cross-module/States/Acceptance, sau đó đi vào các mục xung đột. Đây là **review tài liệu**, không làm module thứ 11.
2. Lập **Master Source-of-Truth/Dependency Matrix**: entities và relation + quyền + read/write direction + actions.
3. Lập **Cross-BRD Conflict & Gap Register** từng vấn đề có ID `CR-001` trở đi: severity, BRD/source positions, business impact, suggested resolution, requires user decision?, owner/due? (không tự bịa owner/date).
4. Rà soát 8 nhóm critical: security/privacy; M08 vs M10 disconnection; M07 ledgers; M05 timezone/scheduler; media vs snapshot; shared/global permission; deletion/restore/export; notifications + activity feed.
5. Đưa ra **đề xuất nghiệp vụ cụ thể** cho mỗi conflict, bảo toàn Dxx đã chốt nếu có thể. Chỉ hỏi chủ dự án **một đợt quyết định** những điểm thực sự chưa rõ, dùng danh sách chốt rõ ràng.
6. Khi chủ dự án chốt chỉnh sửa mới, thực hiện **change control**: ghi mapping, cập nhật các BRD cần thiết bằng phiên bản/errata được phê duyệt, không âm thầm ghi đè V1.0.
7. Sau Review mới tạo **Master BRD/System Overview, Cross-module Contracts, Permission Matrix, Data Lifecycle, Unified Notification/Scheduler Contract, Master E2E Test Matrix**; tiếp theo **Technical Architecture** và Implementation Roadmap, rồi mới chuẩn bị giao Codex code.

**Deliverable review mong đợi:** Bản báo cáo đối chiếu chi tiết, ma trận ảnh hưởng toàn hệ thống, danh sách conflict/gap/risk, đề xuất chuẩn hóa với ID, nhóm P0 impact, tiêu chí nghiệm thu xuyên module, và phần 'quyết định cần chủ dự án duyệt'.

## I. BẢO ĐẢM CHUYỂN CHAT KHÔNG MẤT NGỮ CẢNH

1. Giữ chat cũ trong lịch sử; lý tưởng mở chat mới trong **cùng Project Private**. Đừng xóa nguồn cũ nếu cần kiểm chứng quyết định theo hội thoại.
2. Tải lên **ZIP mới chứa 10 BRD + handoff + prompt** hoặc đặt file nguyên vẹn vào `OurSpace/Docs/`. Có thể tải riêng file handoff đầu tiên để assistant biết danh mục.
3. Dán **prompt `OURSPACE-RESUME-REVIEW-10`** từ `OUR_SPACE_NEXT_CHAT_PROMPT_V2.0.md`. Từ khóa chỉ là nhãn để dễ nhận, **không tự chuyển toàn bộ ngữ cảnh** nếu các file không truy cập được.
4. Yêu cầu assistant chat mới **xác nhận nhìn thấy cả 10 tên file**, sau đó nêu lại: 10/10 approved, no code, next Cross-BRD review, P0 all 10, no automatic changes.
5. Không sử dụng `OUR_SPACE_PROJECT_HANDOFF_V1.0.md` hoặc `OUR_SPACE_DOCS_HANDOFF_2026-10-22.zip` cũ để khởi động: **hai tài liệu đó lỗi thời, dừng ở M04/M05**. Tài liệu V2.0 hiện tại thay thế phần context.
6. Nếu chat mới chưa thấy ZIP trong Project, hãy **đính kèm ZIP trực tiếp** hoặc giải nén, tải 11 file `.md` (handoff + M01–M10) lên. Nếu không có đường dẫn/khả năng truy xuất, assistant không nên tuyên bố đã đọc file chỉ từ tên.
7. Nếu Codex làm việc trong local repo, sao chép folder `Docs/` từ ZIP sang repo; Codex cần đọc nội dung, không chỉ tên file. Đừng tự chọn tech stack trước khi review.

### I1. Prompt ngắn dán vào chat mới

```text
OURSPACE-RESUME-REVIEW-10
Tôi tiếp tục dự án Our Space. Tôi đã duyệt ĐẦY ĐỦ 10 BRD M01–M10, có 247 quyết định Dxx đã chốt, và chưa viết code/chọn stack. Tôi đính kèm bộ bàn giao và 10 BRD. Hãy đọc OUR_SPACE_PROJECT_HANDOFF_V2.0.md và tất cả OUR_SPACE_M01–M10_*_BRD_V1.0.md trước khi làm việc; không hỏi lại các quyết định đã duyệt, không tự sửa BRD hay chọn công nghệ. Công việc kế tiếp: thực hiện Cross-BRD Consistency Review toàn bộ 10 module, nêu conflicts/gaps/invariants/source-of-truth, severity và phương án giải quyết; trình bày các quyết định mới cần tôi chốt. Trả lời bằng tiếng Việt và giữ nguyên nguyên tắc V1.0 phải có đủ P0 của cả 10 module.
```

## J. GHI CHÚ LỊCH SỬ VÀ TÀI LIỆU CŨ

- Trình tự chính: người dùng đã lần lượt duyệt M01 → M02 → ... → M10; sau mỗi lần duyệt, assistant đã tạo một BRD Markdown V1.0. Người dùng thường nói “tiếp tục” để chuyển sang đề xuất module kế tiếp, sau đó nói “Tôi chốt toàn bộ đề xuất Mxx”.
- M01–M04 bắt đầu từ giai đoạn thảo luận trước được ghi trong handoff V1.0, bao gồm video tham chiếu Photobook và các nguyên tắc nền tảng G-01..G-06. M05–M10 được thảo luận/duyệt lần lượt trong lịch sử chat hiện tại.
- **Một vài front-matter `approved_on` trong BRD cũ dùng ngày 2026-10-22 do phiên làm việc kéo dài qua ngày; M10 ghi 2026-10-23.** Cần phân biệt metadata tài liệu với audit thực tế; không âm thầm đổi mốc phê duyệt khi không có yêu cầu. Bản bàn giao này được tạo ngày 23/10/2026 và khẳng định **tất cả 10 đã duyệt**, không sửa những file nguồn.
- `OUR_SPACE_PROJECT_HANDOFF_V1.0.md`, `OUR_SPACE_NEXT_CHAT_PROMPT.md` và `OUR_SPACE_DOCS_HANDOFF_2026-10-22.zip` là **bản cũ**, chỉ có ngữ cảnh M01–M04 và hướng tới M05; không còn phản ánh tiến độ dự án.
- Tài liệu bàn giao **không phải bản transcript từng câu**. Giữ lại hội thoại gốc, file tham chiếu và 10 BRD để bảo toàn những chi tiết ngữ cảnh chưa thể thu hết vào một tóm tắt.

## K. FILE BÀN GIAO VÀ TÍNH TOÀN VẸN

ZIP cập nhật gồm `Docs/OUR_SPACE_PROJECT_HANDOFF_V2.0.md`, 10 file BRD V1.0 và `Docs/OUR_SPACE_NEXT_CHAT_PROMPT_V2.0.md`; phiên bản **có hình/video tham chiếu** có thêm `References/photobook.mp4` và `References/photobook_contact_ourspace.jpg`. Mọi file BRD được copy byte-for-byte, không chỉnh sửa các tài liệu đã duyệt. Xem `MANIFEST_SHA256.txt` trong ZIP để kiểm tra checksum.

## PHỤ LỤC A — TOÀN BỘ 247 QUYẾT ĐỊNH Dxx ĐÃ ĐƯỢC PHÊ DUYỆT

> Các bảng dưới đây được **trích nguyên dòng quyết định từ 10 BRD V1.0** để handoff tự đủ thông tin về quyết định. Đây là bản sao chỉ-đọc, không thay thế đặc tả chi tiết. Các bảng giữ nguyên cột theo từng module; số D01 là độc lập **theo module**.

### M01 — Photobook & Diary: D01–D15

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

### M02 — Memories & Media Library: D01–D20

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

### M03 — Food & Places: D01–D20

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

### M04 — Travel & Trip Planner: D01–D22

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

### M05 — Couple Calendar: D01–D22

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

### M06 — Bucket List & Goals: D01–D24

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

### M07 — Budget & Savings: D01–D30

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

### M08 — Special Moments: D01–D30

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

### M09 — Couple Interaction: D01–D24

| Mã | Vấn đề | Quyết định chính thức | Tác động kiểm thử |
| --- | --- | --- | --- |
| D01 | Vai trò M09 | Lớp tương tác gắn với nội dung M01–M08; không chat độc lập V1 | Từ chối comment không có target; không có inbox chat riêng |
| D02 | Nguồn hỗ trợ | Các content types được định nghĩa trong ma trận source | Mỗi loại phải có source policy; không mở tự động mọi entity |
| D03 | Reaction types | Love, Adore, Haha, Touched, Celebrate, Special | Danh mục cố định P0; type IDs ổn định |
| D04 | Multiplicity | Một active reaction / actor / target | Change là replace; remove là deactivate; unique active |
| D05 | Comment format | Text, emoji, multiline, sanitized links | Không HTML/script hoặc attachment P0 |
| D06 | Reply depth | Hai cấp hiển thị | Reply to reply đặt trong cùng nhóm; giữ reference |
| D07 | Edit | Tác giả chỉnh comment; Edited + revision history | Không tự tạo comment mới hoặc spam thông báo |
| D08 | Delete | Soft delete comment; giữ reply hợp lệ | Tombstone thay body; no leak via search/preview |
| D09 | Mention | Chỉ tài khoản còn lại và trong phạm vi quyền | Không cấp quyền mới bằng mention |
| D10 | Feed | Activity Feed đơn giản, phân trang, đúng quyền | Không public/algorithmic feed |
| D11 | Channels | In-app P0; Email/Push P1 | Không dựa delivery để quyết định dữ liệu đã ghi |
| D12 | Preferences | Cấu hình notification theo loại | User-specific; M10 sẽ hoàn thiện |
| D13 | Coalescing | Gộp hoặc hạn chế spam reaction nhanh | Idempotency, read state độc lập |
| D14 | Modes | Both, Reactions Only, Comments Only, Read Only | Per target; restrict never elevate |
| D15 | ACL | ACL nguồn và reveal state là trần quyền | Apply cả list/query/actions/notification/export |
| D16 | M01 | Book/Page/Diary theo stable target IDs | Page reorder không di dời thread sai |
| D17 | M02 | Media asset và Album có target riêng | Không copy comment theo chỗ media được tái sử dụng |
| D18 | M03–M06 | Không thay Review, Task, RSVP, Goal Completion | UI hướng đến thao tác của module nguồn |
| D19 | M07 | Comment không phải Approval/Settlement | Không tăng nghĩa vụ vì lời bình luận |
| D20 | M08 | Không tương tác trái quyền Secret/Sealed | Không inference leak từ count/mention/feed |
| D21 | Search | Comment search theo quyền hiện tại | Không search source inaccessible or deleted bodies |
| D22 | History/Trash | Edit history, soft delete, 30-day Trash, restore ACL-aware | Không phục hồi vượt quyền nguồn |
| D23 | Concurrency | Idempotent, optimistic conflict handling; no live cursor | Không silently resurrect deleted or duplicate |
| D24 | Device parity | Mobile/desktop đều có P0 | Không bỏ core function trên mobile |

### M10 — Personalization, Accounts & Settings: D01–D40

| Mã | Nội dung chốt | Ưu tiên | Nhóm |
|---|---|---|---|
| D01 | Hai User Accounts độc lập và một Couple Space; không chia sẻ mật khẩu. | P0 | Account/Pairing |
| D02 | Mỗi User tối đa một Couple Space Active trong V1.0. | P0 | Account/Pairing |
| D03 | Có thể dùng chức năng cá nhân trước khi Pairing; nội dung cũ vẫn Private sau Pairing. | P0 | Account/Pairing |
| D04 | Pairing Invitation bằng link/mã ngẫu nhiên; mặc định hết hạn sau 48 giờ; thu hồi được. | P0 | Account/Pairing |
| D05 | Pairing cần cả hai xác nhận và kiểm tra đúng danh tính người ghép đôi. | P0 | Account/Pairing |
| D06 | Hai thành viên bình đẳng; không có super-admin của Space được đọc toàn bộ Private. | P0 | Account/Pairing |
| D07 | My Profile: Display Name bắt buộc; Avatar, Nickname, Birthday, Bio tùy chọn. | P0 | Account/Pairing |
| D08 | Couple Profile: hai người chỉnh những trường chung được phép, có lịch sử và xử lý xung đột. | P0 | Account/Pairing |
| D09 | P0: email/mật khẩu/xác minh email; OAuth Google/Apple ở P1. | P0 với phần mở rộng P1 | Account/Pairing |
| D10 | MFA TOTP tùy chọn P0, có quy trình mã khôi phục an toàn. | P0 | Account/Pairing |
| D11 | Xem Sessions; thu hồi phiên hoặc đăng xuất các thiết bị khác. | P0 | Account/Pairing |
| D12 | Khôi phục tài khoản có xác thực; Partner không thể chiếm quyền tài khoản còn lại. | P0 | Account/Pairing |
| D13 | Private mặc định cho mọi phân hệ; Shared chỉ khi có hành động rõ ràng. | P0 | Permissions |
| D14 | Các năng lực Owner/Editor/Contributor/Commenter/Viewer theo từng nội dung và quy tắc phân hệ. | P0 | Permissions |
| D15 | Quyền tài nguyên liên kết độc lập; quyền cha không tự mở đối tượng Private. | P0 | Permissions |
| D16 | Có Permission Inspector hiển thị effective access ngay P0. | P0 | Permissions |
| D17 | Conditional Access phục vụ M08 Secret/Recipient/Scheduled Reveal và các trạng thái nguồn. | P0 | Permissions |
| D18 | RSVP, Approval, Seal, Completion... không tự suy ra từ Editor/Owner chung. | P0 | Permissions |
| D19 | Light, Dark và System Theme thuộc P0. | P0 | Personalization |
| D20 | Couple Theme có tên, ảnh bìa, màu nhấn và trang trí cơ bản. | P0 | Personalization |
| D21 | Scrapbook chuyên sâu giới hạn trong M01; không áp dụng mặc định toàn ứng dụng. | P0 | Personalization |
| D22 | Tiếng Việt P0, tiếng Anh P1; cấu trúc hỗ trợ quốc tế hóa. | P0 với phần mở rộng P1 | Personalization |
| D23 | Timezone và date/time format độc lập cho mỗi người; không đổi dữ liệu nguồn. | P0 | Personalization |
| D24 | Keyboard, labels, contrast, font scaling, reduced motion là yêu cầu P0. | P0 | Personalization |
| D25 | Homepage có các khối tùy chọn, chỉ hiển thị dữ liệu đúng quyền. | P0 | Personalization |
| D26 | Một Notification Center dùng chung cho các phân hệ M01–M10. | P0 | Notifications |
| D27 | In-app notification P0; email và push P1. | P0 với phần mở rộng P1 | Notifications |
| D28 | Preferences và Quiet Hours độc lập theo tài khoản. | P0 | Notifications |
| D29 | Trạng thái nghiệp vụ và quyền mở nội dung không phụ thuộc gửi notification thành công. | P0 | Notifications |
| D30 | My Data/Shared Data Export theo quyền; không đọc được Sealed Content trước unlock. | P0 | Data & Lifecycle |
| D31 | Backup tự động P0, System Restore có kiểm soát không thể một người đơn phương ghi đè chung. | P0 | Data & Lifecycle |
| D32 | Trash 30 ngày; ngoại lệ domain theo M01–M09 không bị xóa bỏ. | P0 | Data & Lifecycle |
| D33 | Một thành viên có thể Disconnect không cần thành viên kia đồng ý. | P0 | Data & Lifecycle |
| D34 | Sau Disconnect ngừng cộng tác chung mới; giai đoạn xử lý dữ liệu 30 ngày, read-only khi phù hợp. | P0 | Data & Lifecycle |
| D35 | Mặc định tạm dừng nội dung hẹn gửi/chưa reveal sau Disconnect, có chính sách ngoại lệ rõ ràng. | P0 | Data & Lifecycle |
| D36 | Delete Account yêu cầu xác thực tăng cường, không cascade xóa dữ liệu hợp lệ của Partner. | P0 | Data & Lifecycle |
| D37 | Reconnect cần cả hai đồng ý; không tự mở lại quyền/đường dẫn/notification cũ. | P0 | Data & Lifecycle |
| D38 | Capsule Sealed là product-level access control; không tự quảng cáo mã hóa đầu cuối. | P0 | Data & Lifecycle |
| D39 | Security Activity/Audit ghi sự kiện quan trọng, không lưu thông tin xác thực bí mật. | P0 | Data & Lifecycle |
| D40 | Mọi P0 đầy đủ trên desktop/mobile. | P0 | Data & Lifecycle |


---

**KẾT THÚC HANDOFF V2.0. NEXT: CROSS-BRD CONSISTENCY REVIEW. KHÔNG CODE TRƯỚC KHI DUYỆT KIẾN TRÚC.**
