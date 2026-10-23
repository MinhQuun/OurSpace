---
document_id: OURSPACE-M09-BRD
project: Our Space
module_id: M09
module_name: Couple Interaction
version: 1.0
status: APPROVED_BUSINESS_REQUIREMENTS__IMPLEMENTATION_NOT_STARTED
language: vi-VN
approved_on: 2026-10-22
file_name: OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md
intended_audience: [Product Owner, UX Designer, Codex, Developer, QA]
related_documents:
  - OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md
  - OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md
  - OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md
  - OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md
  - OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md
  - OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md
  - OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md
  - OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md
next_module: M10 — Personalization, Accounts & Settings
---

# OUR SPACE — M09: COUPLE INTERACTION
## Business Requirements & Functional Specification — V1.0

> **ĐÃ DUYỆT NGHIỆP VỤ.** Chủ dự án phê duyệt *toàn bộ đề xuất M09* ngày 22/10/2026, đồng nghĩa **D01–D24 được chốt**. Tài liệu được lưu tại `OurSpace/Docs/OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md`. **Chưa viết code, chưa chọn framework, database, API, realtime protocol hoặc notification provider.** Không coi BRD là tuyên bố tính năng đã tồn tại.
>
> **PHẢI ĐỌC ĐỦ:** 24 quyết định; 15 giao diện `CI-01`–`CI-15`; 20 đối tượng `ENT-M09-01`–`20`; 55 Business Rules `BR-M09-01`–`55`; 18 Use Cases `UC-M09-01`–`18`; 40 ngoại lệ `EX-M09-01`–`40`; 65 Acceptance Criteria `AC-M09-01`–`65`; các hợp đồng M01–M10, state flows, negative security cases, audit, QA, Definition of Done.
>
> **Ranh giới quan trọng:** `Reaction ≠ business approval`; `Comment ≠ RSVP/Review/Goal completion/Settlement`; `View source ≠ permission to comment`; `Mention ≠ access grant`; `Notification read ≠ M08 Letter/Capsule opened`; `Media asset target ≠ Photobook page target`; `Deleted comment ≠ erase valid reply`; `Show in feed ≠ public sharing`. **P0 của cả 10 phân hệ phải hoàn thiện trước Our Space V1.0.**

---

# 1. Tầm nhìn, phạm vi, nguyên tắc

## 1.1. Sứ mệnh

M09 (**Our Interactions**) là lớp tương tác chung để A và B thể hiện cảm xúc, trao đổi ngắn gọn **ngay tại một đối tượng hợp lệ** của Our Space. Tương tác mang ý nghĩa gắn kết, không hướng tới mạng xã hội, follower, engagement farming hay trao đổi tin nhắn không có ngữ cảnh. UI chủ yếu xuất hiện trong M01–M08 dưới dạng component dùng chung; Activity Feed và Notification Center giúp theo dõi hoạt động hợp lệ.

Giá trị cốt lõi: (a) phản hồi ngay nơi kỷ niệm hoặc kế hoạch được lưu; (b) kiểm soát hoàn toàn quyền xem/được bình luận; (c) không biến bình luận thành phê duyệt nghiệp vụ; (d) không làm lộ Secret Surprise hoặc Time Capsule chưa được mở; (e) bảo vệ thread/reaction khi content được di chuyển, đổi tên, archive hoặc xóa.

## 1.2. P0 đã duyệt

- Sáu reaction `Love/Adore/Haha/Touched/Celebrate/Special`; tối đa **một reaction active mỗi tài khoản trên một target**; có thể đổi/gỡ, idempotent retry.
- Comment text an toàn, emoji, xuống dòng, link; reply tối đa hai cấp hiển thị, edited marker, comment soft delete, giữ các reply hợp lệ.
- Mention tài khoản còn lại nếu có quyền; feed riêng theo ACL; in-app notification loại comment/reply/mention/reaction và preferences từng tài khoản.
- Interaction Mode `Both`, `Reactions Only`, `Comments Only`, `Read Only` trên từng source; **chỉ giảm/quy định quyền tương tác, không tự tăng quyền vượt source**.
- Contracts M01–M08; search theo quyền; lịch sử, Trash 30 ngày và restore; bảo vệ đồng thời, retry, mất kết nối, desktop/mobile parity.

## 1.3. P1, P2 và ngoài phạm vi

**P1:** sticker/GIF, đính kèm media trong comment, reaction tùy chỉnh, ghim bình luận, bình luận tọa độ trên ảnh hoặc layer Photobook, lọc/tìm comment nâng cao, Email/Push nếu hạ tầng M10 cho phép. **P2:** AI gợi ý câu trả lời theo yêu cầu, AI tóm tắt thread, mini-games, tương tác trải nghiệm nâng cao, full chat nếu thay đổi scope sau này. **Không thuộc P0:** chat độc lập, video/voice call, tin nhắn với người ngoài, mạng xã hội công khai, feed thuật toán, AI tự comment.

## 1.4. Invariants liên phân hệ

1. Mỗi interaction có `source_module`, `target_type`, `target_id` ổn định; không dựa vào vị trí trang hoặc tên file.
2. Quyền hành động = intersection của quyền nguồn + trạng thái nguồn + interaction policy + quyền tác giả/recipient + trạng thái bản ghi; **cùng một kiểm tra trên read/write/search/feed/notification/export/URL**.
3. Mention không cấp quyền; tương tác cũng không thể khiến nội dung bí mật xuất hiện qua số lượng/counters.
4. Soft delete comment không xóa reply khác tác giả; edited/delete/history không được lộ body đã xóa qua preview mới.
5. Business action thuộc module chủ: M03 Review; M05 RSVP; M06 Completion; M07 financial approvals/settlements; M08 Reveal/Opened.
6. Khi source bị xóa/chuyển quyền, M09 phải xử lý hiển thị và hành động mới theo trạng thái nguồn, nhưng không tự cascade delete tài sản độc lập của module khác.
7. Reactions/Comments chỉ được báo thành công sau khi yêu cầu hợp lệ được ghi nhận; retry không nhân bản.
8. Các màn hình chính dùng được trên desktop/mobile ngang nhau; cấu hình UI và hạ tầng kỹ thuật sẽ được quyết định về sau.

## 1.5. Người sử dụng / actors

- **Person A, Person B:** hai danh tính riêng; mỗi người sở hữu các interaction của mình, không có bảng xếp hạng phổ biến.
- **Content Owner:** chủ nguồn; có thể cấu hình tương tác trong phạm vi quyền nguồn; không được tự sửa body bình luận của người khác.
- **Comment Author:** có quyền sửa/xóa bình luận của chính mình khi còn quyền tương ứng.
- **Reply Author:** sở hữu reply của mình ngay cả khi comment cha bị xóa mềm; không đồng nghĩa reply hiển thị nếu source không cho phép.
- **Mentioned User / Notification Recipient:** chỉ nhận thông tin được phép truy cập; không được tự cấp quyền nhờ mention.
- **Source Module Resolver (M01–M08):** xác nhận tồn tại, lifecycle, quyền và allowed operations của source.
- **Shared Notification System (M05/M08/M10):** tạo/đọc trạng thái notification, không sở hữu nội dung bình luận hoặc trạng thái đọc Letter/Capsule.
- **QA/Export/Restore Process:** chịu giới hạn quyền và trạng thái khóa, kể cả khôi phục nội dung lịch sử.

# 2. Hai mươi bốn quyết định nghiệp vụ đã chốt

**Nguồn phê duyệt:** người dùng xác nhận “Tôi chốt toàn bộ đề xuất M09”; không còn mã D01–D24 chờ duyệt. Những điều chưa chốt về kỹ thuật/thiết bị không được diễn giải thành thay đổi quyết định này.

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

## 2.1. Phân biệt điều đã chốt và còn mở

Đã chốt: phạm vi source tương tác, hành vi comment/reaction, hai cấp thread, kênh In-app, settings, ACL, 30 ngày Trash, mobile parity. Chưa chốt: DB/queue/websocket, retention log dài hạn, giới hạn độ dài Comment, throughput/SLA, cache invalidation strategy, notification delay interval, phương án content moderation nâng cao, khả năng feed realtime hay polling, thỏa thuận xóa dữ liệu vĩnh viễn tại M10. Ghi các yếu tố này thành open issue; không tự phát minh con số/chính sách làm thay đổi trải nghiệm.

## 2.2. Ma trận đối tượng nguồn P0

Mỗi module phải expose/đảm bảo resolver hoặc contract tương đương: `can_view(actor,target)`, `can_comment`, `can_react`, `target_state` (private/archive/trash/reveal), `target_label` đã lọc quyền, link nội bộ sau xác thực, flags từ policy tương tác. Đây là **trách nhiệm nghiệp vụ**, không bắt buộc tên API kỹ thuật như trên.

| Module | Target | Reaction | Comment | Nguồn và ràng buộc |
| --- | --- | --- | --- | --- |
| M01 | Photobook Book | Yes | Yes | Book ID; Published snapshot và comment trên book không sửa nội dung sách |
| M01 | Photobook Page | Yes | Yes | Stable Page ID dù reorder; no layer-specific comments P0 |
| M01 | Diary | Theo ACL | Theo ACL | Không làm lộ nội dung Diary Private |
| M02 | Photo/Video asset | Yes | Yes | Target là asset ID, không photo placement |
| M02 | Album | Yes | Yes | Album ACL + asset ACL không đồng nhất |
| M03 | Place | Yes | Yes | Place comments ≠ official Visit Review |
| M03 | Visit | Yes | Yes | Review của mỗi partner thuộc M03 |
| M03 | Date Plan | Yes | Yes | Comment ≠ plan execution/attendance |
| M04 | Trip | Yes | Yes | Không đổi Trip state |
| M04 | Trip Activity | Yes | Yes | Comment ≠ booking/task state |
| M05 | Calendar Event | Yes | Yes | Comment ≠ RSVP |
| M05 | Anniversary | Yes | Yes | M05 giữ ngày chính thức |
| M06 | Wish/Goal | Yes | Yes | Reaction ≠ progress or approval |
| M06 | Achievement | Yes | Yes | Chúc mừng không đổi completed status |
| M07 | Shared Expense | Optional per-target | Yes, if ACL | Có thể mặc định Comments Only; Comment ≠ Approval |
| M07 | Budget/Savings Goal | Optional per-target | Yes, if ACL | Không lộ số tiền/Transaction Private |
| M08 | Moment/Milestone | Yes | Yes | Theo privacy/perspective ACL |
| M08 | Delivered Love Letter | Yes to eligible recipient | Reply/comment theo quyền | No interaction before Delivered |
| M08 | Revealed Surprise | Yes | Yes | No existence leak before reveal |
| M08 | Unlocked Capsule | Yes | Yes | Only if eligible and access to opened content |

## 2.3. Các loại target không tự động mở M09

M01 private editor layers/cursors, M02 mọi version nội bộ, M04 booking/document transport riêng, M05 reminder delivery, M06 private tasks và assignments nếu chưa cấp quyền, M07 raw transaction/settlement approvals, M08 Capsule sealed item và Secret Surprise draft **không tự động** trở thành target M09. Muốn bổ sung sau phải có contract nghiệp vụ và ACL riêng. Đây không phải yêu cầu cấp quyền rộng trên cả module.

# 3. Miền nghiệp vụ, 20 đối tượng và quan hệ dữ liệu

| Mã | Entity | Trách nhiệm |
| --- | --- | --- |
| ENT-M09-01 | Interaction Target | ref tới source_module/target_type/target_id, lifecycle/access resolver |
| ENT-M09-02 | Reaction | actor,target,reaction_type,active/replaced metadata |
| ENT-M09-03 | Reaction Type | 6 enum values cố định, label và symbol UI |
| ENT-M09-04 | Comment | body, author, target, state, parent/root thread, timestamps |
| ENT-M09-05 | Comment Revision | immutable revision audit cho thay đổi văn bản |
| ENT-M09-06 | Comment Thread | root + children + display ordering, two-level rendering |
| ENT-M09-07 | Mention | recipient reference và trạng thái notify, không cấp quyền |
| ENT-M09-08 | Interaction Permission | effective capabilities intersect source grant |
| ENT-M09-09 | Interaction Setting | Both/ReactionOnly/CommentOnly/ReadOnly per target |
| ENT-M09-10 | Interaction Event | created/commented/replied/reacted/edited/deleted event semantics |
| ENT-M09-11 | Activity Feed Entry | materialized or derived feed item filtered by source ACL |
| ENT-M09-12 | Notification Reference | relates interaction action to shared notification item |
| ENT-M09-13 | Notification Preference | user-specific event subscription/suppression |
| ENT-M09-14 | Notification State | new/read/archived per recipient, not M08 opened |
| ENT-M09-15 | Comment Draft | unsubmitted text per target and author where supported |
| ENT-M09-16 | Content Moderation State | visibility/mute/hide reason if allowed by future M10 rules |
| ENT-M09-17 | Interaction History | revision and state transitions under permission |
| ENT-M09-18 | Trash Record | soft deletion + 30-day recovery metadata |
| ENT-M09-19 | Source Permission Snapshot | limited audit evidence of action-time grant |
| ENT-M09-20 | Interaction Audit Event | actor/action/target/version/result for trace |

## 3.1. Mô hình quan hệ

- `Target 1—N Reaction` theo lịch sử, nhưng **mỗi `(actor,target)` tối đa 1 active**. Các lần đổi/gỡ có thể có audit, không tính nhiều active.
- `Target 1—N RootComment`. `RootComment 1—N Replies`; Reply có `root_id` cố định và có thể tham chiếu `reply_to_comment_id` để nhắc ngữ cảnh, nhưng UI chỉ có 2 tầng.
- `Comment 1—N CommentRevision`. Revision không thay đổi tác giả hoặc target; không tự chia sẻ nội dung lịch sử với người không đủ quyền.
- `Comment 0—N Mention`; mention receiver là tài khoản đã có quyền trên source, không phải một quyền share mới.
- `InteractionEvent 0—N NotificationReferences` theo người nhận và loại event; notification chỉ là derived channel, không quyết định Comment saved.
- `InteractionSetting 0—1 per target` ở mức business; nếu chưa cấu hình, mặc định thuộc tính nguồn và chế độ Both **chỉ khi nguồn cho phép**. Source state luôn được kiểm tra lại lúc thực hiện.
- `TrashRecord` mô tả object soft deleted; valid Reply của B có thể tồn tại khi root body của A đã bị tombstone.

## 3.2. Business fields tối thiểu

| Item | Bắt buộc lúc tạo | Hệ thống tự ghi | Ghi chú |
| --- | --- | --- | --- |
| Reaction | target, reaction type, logged-in actor | stable ID, updated timestamp, active status | one active per actor/target |
| Comment | target, nonblank body, actor | ID, created timestamp, target type, state | optional reply reference and mentions |
| Reply | root/parent valid, body, author | root ID, parent context, timestamps | target same as parent; no cross-target reply |
| Mention | valid user token & target permission | recipient ID, dedup notify key | display name never replaces user ID |
| Interaction Settings | target and selected mode | editor identity, history | can only restrict source rights |
| Notification | derived target/action/recipient | delivery/read status | notification does not own source content |
| Activity Feed | authorized event ref | chronology, visibility state | only derived from current source permission |

## 3.3. Event model vs activity feed

Activity Feed Entry có thể lưu như projection để tối ưu hiệu năng, nhưng source object & effective ACL vẫn là nguồn sự thật tại thời điểm đọc. Không coi tồn tại của một feed row là bằng chứng người nhận vẫn có quyền. Khi content bị xóa/chuyển Private/Sealed, truy vấn feed phải kiểm tra lại hoặc projection được cập nhật theo cách không có cửa sổ lộ thông tin không được phép.

## 3.4. State machines

- **Reaction:** absent → active(type A) → active(type B) hoặc absent; retry trên cùng mutation không sinh bản trùng; rollback nếu source rights mất.
- **Comment:** Draft (nếu UI có) → Active → Edited (vẫn là active content) → Soft Deleted → Restored (nếu hợp lệ) → permanent deletion theo lifecycle M10 sau thời hạn/quyền. Không resurrection từ in-flight edit sau delete.
- **Notification:** created/pending → displayed/available → read/archived; failed channel không rollback Comment. Read của thông báo không tự cập nhật M08 Letter Opened.
- **Source lifecycle:** active/shared/private/archived/trashed/revealed là trạng thái do source sở hữu. M09 không tự đổi trạng thái nguồn; mỗi transition có tác động tới hiện diện/capability.

## 3.5. Invariant về idempotency và concurrency

Khi client gửi lại cùng hành động create comment hoặc set reaction vì mạng không rõ kết quả, M09 phải nhận diện yêu cầu trùng và phản hồi kết quả gốc nếu còn hợp lệ; không được tạo thêm Comment/Notification. Thao tác `edit` từ revision cũ không đè revision mới; thao tác `delete` đã xác nhận phải thắng thao tác `edit` lỗi thời, trừ khi có hành động `restore` độc lập được phép. Không khóa ứng dụng chỉ vì hai người cùng thêm Comment khác nhau vào một Thread: hai bản ghi độc lập phải cùng tồn tại.

# 4. Đặc tả 15 màn hình/thành phần CI-01–CI-15

**Trách nhiệm UX:** CI-01–07 chủ yếu là reusable component embedded trong các module nguồn; CI-08–15 có thể là full view/panel/setting. Số màn hình là số giao diện nghiệp vụ, không bắt buộc số URL.

## CI-01 — Interaction Panel

**Mục tiêu / người dùng:** Khối reaction/comment ngay tại Book/Page/Diary/Media/Place/Trip/Event/Goal/Expense/Moment được phép.

**Dữ liệu hiển thị và state:** target type+ID, permission state, interaction mode, reaction summary, recent comments, full thread link. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** load source → resolve ACL → fetch allowed counts & comments → show composer based on source+mode; scroll to context. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** No access: not-found/permission-safe; source deleted: contextual unavailable; pagination; zero-state invites comment without leaking counters. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D01,D02,D14,D15; BR-M09-01,05,10,44,45.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-02 — Reaction Picker

**Mục tiêu / người dùng:** Picker thống nhất sáu reaction, hỗ trợ chọn/đổi/bỏ.

**Dữ liệu hiển thị và state:** 6 type IDs, current actor active reaction, total count per allowed target. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** tap icon → optimistic pending → validate source/version → save single active reaction → update count; retry safe. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** Disabled nếu Read Only/no access/M08 Sealed; disabled state keyboard-accessible; revert pending icon on failure. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D03,D04,D20; BR-M09-01–10.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-03 — Comment Composer

**Mục tiêu / người dùng:** Soạn comment text/emoji/line breaks/link an toàn, không attachment P0.

**Dữ liệu hiển thị và state:** body input, valid target, send state, local draft, optional mentions. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** type → validate nonblank and permissions → send exactly once → append returned comment → clear draft only after confirmed. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** Network failure retains draft; double-click guarded; empty/whitespace error; URL sanitization; no script rendering. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D05,D15,D23; BR-M09-11,12,13,23,24.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-04 — Comment Thread

**Mục tiêu / người dùng:** Tập hợp các comment gốc và replies, 2 mức hiển thị.

**Dữ liệu hiển thị và state:** root comments, child replies, target, author, created/edited/tombstone markers. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** open thread → permission filter → paginate roots and replies → click author/reply/edit if allowed. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** Deleted root shows tombstone; valid replies stay; no duplicate after refresh; no accidental nested deep indentation. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D06,D08; BR-M09-15,16,20,21.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-05 — Reply Composer

**Mục tiêu / người dùng:** Gửi reply gắn đúng root/parent context.

**Dữ liệu hiển thị và state:** root id, reply-to id, source target, body, actor. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** reply → verify both root & source → save under root → notify root/recipient if eligible. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** Parent deleted soft: policy only if valid allowed; parent hard-deleted: block or restore fallback; no cross-target reply. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D06,D09; BR-M09-12,15,16.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-06 — Comment Actions

**Mục tiêu / người dùng:** Menu của comment: edit, delete soft, link/copy; chỉ author thực hiện quyền tác giả.

**Dữ liệu hiển thị và state:** comment ID, actor, revision, capabilities, delete confirmation. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** edit → validate author+source+version → create revision → label Edited; delete → tombstone and notify cleanup. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** Other author edit prohibited; already deleted editing denied; direct link ACL checked; restore if eligible within policy. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D07,D08,D15,D22; BR-M09-17–22.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-07 — Mentions

**Mục tiêu / người dùng:** Chọn duy nhất người còn lại khi gõ @ nếu người đó có quyền xem target.

**Dữ liệu hiển thị và state:** typed text, mentioned user ID, label, resolved recipient source ACL. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** type @ → show eligible partner → insert structured reference → send → dedup mention notify. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** If partner has no access show no selectable recipient or non-disclosing warning; revoked before send: no mention notify. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D09; BR-M09-26–30.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-08 — Activity Feed

**Mục tiêu / người dùng:** Dòng hoạt động tương tác gần đây chỉ trên target user được phép xem.

**Dữ liệu hiển thị và state:** actor, action, authorized source label, target link, timestamp. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** fetch chronological page → current ACL filter → show event cards → open target after revalidation. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** Empty state; source removed/hid means feed entry not shown; no count leakage; paging stable. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D10,D15,D20; BR-M09-31–35.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-09 — Notifications Center

**Mục tiêu / người dùng:** Một Notification Center chung của Our Space, view M09 types mà không nhân bản hub.

**Dữ liệu hiển thị và state:** comment/reply/mention/reaction types, recipient read state, safe preview, URL. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** deliver in-app → recipient opens → check current source ACL → navigate or safe unavailable state. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** Old notification target removed: no content preview after revocation; no mark M08 opened; retry failures visible as needed. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D11,D13,D20; BR-M09-36–43.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-10 — Notification Preferences

**Mục tiêu / người dùng:** Mỗi người cấu hình Reactions, Comments, Replies, Mentions và giảm spam.

**Dữ liệu hiển thị và state:** account ID, per-type toggle, inherited M10 quiet preference if implemented. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** toggle → save per-user → subsequent eligible events follow latest setting. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** No notification for blocked types, do not delete comment; security notifications unrelated are not controlled here. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D12,D13; BR-M09-39,40.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-11 — Comment Search

**Mục tiêu / người dùng:** Tìm Comment có quyền đọc dựa trên nguồn và status.

**Dữ liệu hiển thị và state:** text query, date, author, source type, target context, page. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** search → filter accessible sources, active comment bodies → show matching authorized snippets. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** Private/Deleted content absent even in count/suggestion; escaped/sanitized snippets; no historical deleted body in UI. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D21; BR-M09-22,44,53.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-12 — Interaction History

**Mục tiêu / người dùng:** Audit những lần tạo/sửa/xóa/restore và các sự kiện tương tác có liên quan.

**Dữ liệu hiển thị và state:** actor/action/version/timestamps, conditional old/new visibility. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** authorized reader opens history → see revision metadata/allowed details → verify no unauthorized body. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** No history as backdoor to private/Sealed; source ACL still required; admin exceptions deferred to M10. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D07,D22; BR-M09-18,22.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-13 — Interaction Permissions

**Mục tiêu / người dùng:** View effective rights, including source and custom mode restriction.

**Dữ liệu hiển thị và state:** source ACL, target mode, author ownership, reveal status. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** show current mode & rights → editor toggles → validate right to manage → update policy. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** Cannot elevate source Viewer to Commenter; source becomes private: panel hidden/disabled immediately upon requests. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D14,D15,D20; BR-M09-44–49.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-14 — Hidden/Deleted Interactions

**Mục tiêu / người dùng:** Quản lý soft deleted comments/reactions and restoration according to rights.

**Dữ liệu hiển thị và state:** deleted_at, author, target, restore availability, child replies. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** delete → tombstone → trash record → restore if within window and source still accessible. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** Do not restore into source no longer existing or accessible; do not leak deleted body through notification. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D08,D22; BR-M09-20–22,53.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

## CI-15 — Interaction Settings

**Mục tiêu / người dùng:** Cấu hình cấp đối tượng: Both, Reactions Only, Comments Only, Read Only.

**Dữ liệu hiển thị và state:** mode selector, source target, editor rights, explanatory permission warning. Mọi trường ở mức metadata cũng phải filtered theo permission hiện hành; không tin các tên/thumbnail đã lưu trong cache khi source bị chuyển sang Private.

**Happy path / thao tác chính:** owner opens source settings → select mode → preview effect → save → enforce on all clients. Kết quả lưu có `actor`, `target`, timestamp và trạng thái chính thức; UX phải phân biệt pending, confirmed và failed.

**Trạng thái trống, lỗi, mobile:** Previously active comments stay per policy; new sends blocked; if source deny action, mode cannot grant it. Trên mobile, control đủ lớn để chạm, focus rõ, nhập/đọc bằng bàn phím không che nội dung, không bắt buộc hover; trên desktop hỗ trợ keyboard và màn hình đọc. Cần hiển thị feedback cụ thể nhưng không xác nhận sự tồn tại của target bí mật cho người không đủ quyền.

**Liên kết truy vết:** D14,D15; BR-M09-44–48.

**Nghiệm thu tối thiểu của màn hình:** thành công khi có đủ quyền và dữ liệu; kiểm thử đối xứng người A/B; mất quyền giữa load và submit; retry network; thay đổi source lifecycle (rename, move, archive, trash, private, M08 reveal); bảo đảm interaction panel không ép module nguồn phải tái tạo dữ liệu tương tác.

# 5. Bảo mật, quyền theo nguồn và chống rò rỉ

## 5.1. Quyền hiệu lực là phép giao, không phải phép hợp

Khi A nhìn thấy `Reaction Picker`, cần đồng thời đúng: source tồn tại và chưa bị chặn bởi trạng thái M08/Trash; A có `view` và `react` theo source policy; Interaction Settings cho phép `react`; A có phiên đăng nhập phù hợp; và target không thuộc vùng private của B. Cho comment/edit/delete cũng áp các bước tương ứng. **Không dùng kết quả `can_view` tải lúc mở trang để thay quyền cho `can_comment` lúc ghi**. ACL phải tái xác thực ở thao tác mutating, link opening, search, feed và export.

## 5.2. Giao thức hiển thị thông tin kín

- **M01 Diary Private:** Không tìm Comment/snippet và không tự khai báo có bao nhiêu Reaction trên Diary.
- **M02 Private Asset:** Thêm ảnh vào Book không tự chuyển tất cả comment trên ảnh sang ACL của Book.
- **M03 Private Visit:** Không lộ nơi hai người từng đi qua mention/activity.
- **M04 Private Activity/Trip:** Không lộ việc lên lịch qua Feed.
- **M05 Event Private:** Không lộ chi tiết Event hoặc trạng thái bận/rảnh qua Notification M09.
- **M06 Goal Private:** Không lộ tiến độ bằng Count hay reaction.
- **M07 Money Private:** Không lộ số tiền, payer, receipt, approvals qua Comment preview, search hoặc analytics; comment cũng không tăng nợ.
- **M08 Secret Surprise:** Trước reveal, người không đủ quyền **không biết sự tồn tại** của target, comment, metadata hay counter.
- **M08 Sealed Capsule:** Không ai dùng M09 để xem Capsule items/comment contents trước unlock theo quy tắc M08, kể cả chủ Capsule qua UI thường.

## 5.3. Dữ liệu link, preview, snippet, counters

Preview của Notification và Activity Feed phải truy xuất *label đã lọc quyền hiện tại* hoặc hiển thị nhãn chung an toàn nếu source đã không thể truy cập. Không lưu nội dung secret dưới dạng text preview hiển thị độc lập. Số lượng unread/counters trên tab M09 không được phát sinh khác biệt có thể suy luận rằng người kia vừa tạo Secret Surprise. Search result count, autocomplete suggestion, URL slug, thumbnail, title và timestamp cũng là dữ liệu có thể làm lộ sự tồn tại.

## 5.4. Không thể 'thu hồi' thông tin đã thực sự xem

Khi user đã có quyền đọc và tự sao chép/chụp màn hình trước khi bị thu hồi, sản phẩm không thể bảo đảm xóa mọi bản ngoài hệ thống. UI cần diễn đạt quyền thu hồi là **ngăn yêu cầu truy cập mới từ hệ thống**, không hứa xóa thông tin khỏi trí nhớ, ảnh đã tải về hoặc thiết bị do người khác kiểm soát.

## 5.5. Input safety và abuso controls

Bình luận có thể chứa URL và ký tự đặc biệt. P0 yêu cầu render text/link an toàn, không chèn script/hành vi HTML, không tự động preview URL không đáng tin gây lộ metadata private. Nếu bật dán rich text, phải chuyển sang định dạng an toàn phù hợp. Spam/duplicate retry cần chặn, nhưng không biến product thành hệ thống kiểm duyệt công khai. Rate limit và độ dài comment cụ thể là NFR/technical decisions còn mở, phải cân bằng không mất comment hợp lệ.

## 5.6. A/B ownership và tài khoản thay đổi

Trong V1.0 có hai người A/B, nhưng các nội dung/Comment cần định danh tác giả ổn định khi đổi tên, avatar, hoặc cài đặt. Nếu một account vô hiệu hóa hoặc cặp đôi thay đổi membership (quy tắc M10), lịch sử phải giữ attribution phù hợp với deletion/privacy policy, không ngầm chuyển ownership sang người còn lại; các trường hợp này là Open Issue cho M10.

# 6. Business Rules — 55 quy tắc đã duyệt

Các quy tắc dưới đây cụ thể hóa **BR-M09-01–55**. Nếu module nguồn có chính sách nghiêm ngặt hơn, sử dụng điều kiện hạn chế hơn. Implementation có thể tổ chức rule helpers dùng chung, nhưng không được bỏ bất kỳ kiểm tra backend tương ứng nào.

**BR-M09-01 — Phải gắn Reaction với một target nguồn hợp lệ.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng duy nhất target identity `(source_module,target_type,target_id)` và actor; lưu reaction một cách idempotent, read counts lọc permission. QA kiểm tra chọn/đổi/gỡ, đổi source state đúng thời điểm, reply from two devices và tác vụ retry.

**BR-M09-02 — Mỗi người có tối đa một Reaction active trên một target ở V1.0.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng duy nhất target identity `(source_module,target_type,target_id)` và actor; lưu reaction một cách idempotent, read counts lọc permission. QA kiểm tra chọn/đổi/gỡ, đổi source state đúng thời điểm, reply from two devices và tác vụ retry.

**BR-M09-03 — Đổi Reaction thay thế Reaction active cũ, không tạo thêm active.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng duy nhất target identity `(source_module,target_type,target_id)` và actor; lưu reaction một cách idempotent, read counts lọc permission. QA kiểm tra chọn/đổi/gỡ, đổi source state đúng thời điểm, reply from two devices và tác vụ retry.

**BR-M09-04 — Người dùng được gỡ Reaction của chính mình.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng duy nhất target identity `(source_module,target_type,target_id)` và actor; lưu reaction một cách idempotent, read counts lọc permission. QA kiểm tra chọn/đổi/gỡ, đổi source state đúng thời điểm, reply from two devices và tác vụ retry.

**BR-M09-05 — Chặn Reaction khi thiếu quyền xem hoặc quyền tương tác nguồn.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng duy nhất target identity `(source_module,target_type,target_id)` và actor; lưu reaction một cách idempotent, read counts lọc permission. QA kiểm tra chọn/đổi/gỡ, đổi source state đúng thời điểm, reply from two devices và tác vụ retry.

**BR-M09-06 — Thu hồi quyền nguồn phải ngăn Reaction mới.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng duy nhất target identity `(source_module,target_type,target_id)` và actor; lưu reaction một cách idempotent, read counts lọc permission. QA kiểm tra chọn/đổi/gỡ, đổi source state đúng thời điểm, reply from two devices và tác vụ retry.

**BR-M09-07 — Đổi vị trí hoặc tên target không làm mất Reaction liên kết.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng duy nhất target identity `(source_module,target_type,target_id)` và actor; lưu reaction một cách idempotent, read counts lọc permission. QA kiểm tra chọn/đổi/gỡ, đổi source state đúng thời điểm, reply from two devices và tác vụ retry.

**BR-M09-08 — Retry Reaction không tạo bản trùng.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng duy nhất target identity `(source_module,target_type,target_id)` và actor; lưu reaction một cách idempotent, read counts lọc permission. QA kiểm tra chọn/đổi/gỡ, đổi source state đúng thời điểm, reply from two devices và tác vụ retry.

**BR-M09-09 — Không hiển thị Reaction trên nội dung bí mật trước Reveal.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng duy nhất target identity `(source_module,target_type,target_id)` và actor; lưu reaction một cách idempotent, read counts lọc permission. QA kiểm tra chọn/đổi/gỡ, đổi source state đúng thời điểm, reply from two devices và tác vụ retry.

**BR-M09-10 — Số lượng và người Reaction chỉ hiển thị theo quyền.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng duy nhất target identity `(source_module,target_type,target_id)` và actor; lưu reaction một cách idempotent, read counts lọc permission. QA kiểm tra chọn/đổi/gỡ, đổi source state đúng thời điểm, reply from two devices và tác vụ retry.

**BR-M09-11 — Comment gắn với target nguồn hợp lệ.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-12 — Tác giả phải có quyền tương tác tại thời điểm gửi.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-13 — Chặn bình luận trống hoặc chỉ khoảng trắng.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-14 — Comment có ID ổn định và author không bị thay.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-15 — Reply tham chiếu Comment cha còn hợp lệ theo policy.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-16 — UI giới hạn hai tầng Comment/Reply.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-17 — Sửa Comment phải có nhãn Edited.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-18 — Sửa Comment bảo tồn revision/audit khi cần.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-19 — Không sửa Comment của người khác trừ vai trò đặc biệt M10 đã chốt.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-20 — Xóa Comment không xóa target nguồn.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-21 — Xóa root có Reply giữ luồng hợp lệ, không lộ body đã xóa.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-22 — Comment đã xóa không xuất hiện trong Search/new previews.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-23 — Comment lỗi không được báo gửi thành công.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-24 — Retry cùng create request không tạo Comment trùng.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-25 — Comment M07 không được coi là Approval hoặc Settlement.**

*Ý nghĩa thực thi và kiểm chứng:* Áp dụng tại lúc ghi vào Comment/Reply/Revision/Trash; child reply giữ dưới root tombstone, audit không lộ body đã xóa. QA thử whitespace-only, stale version, already deleted, other author, retry, invalid parent và network uncertainty.

**BR-M09-26 — Mention chỉ tới tài khoản hợp lệ trong Our Space.**

*Ý nghĩa thực thi và kiểm chứng:* Mention resolution cần xác nhận recipient thuộc A/B và có quyền với source; dedup notification theo comment version + recipient. QA gồm recipient revoked trước submit và văn bản mention lặp.

**BR-M09-27 — Mention không cấp thêm quyền đọc nội dung nguồn.**

*Ý nghĩa thực thi và kiểm chứng:* Mention resolution cần xác nhận recipient thuộc A/B và có quyền với source; dedup notification theo comment version + recipient. QA gồm recipient revoked trước submit và văn bản mention lặp.

**BR-M09-28 — Người được mention thiếu quyền phải được chặn/cảnh báo không lộ.**

*Ý nghĩa thực thi và kiểm chứng:* Mention resolution cần xác nhận recipient thuộc A/B và có quyền với source; dedup notification theo comment version + recipient. QA gồm recipient revoked trước submit và văn bản mention lặp.

**BR-M09-29 — Mention notification chỉ mang dữ liệu recipient được phép đọc.**

*Ý nghĩa thực thi và kiểm chứng:* Mention resolution cần xác nhận recipient thuộc A/B và có quyền với source; dedup notification theo comment version + recipient. QA gồm recipient revoked trước submit và văn bản mention lặp.

**BR-M09-30 — Sửa Comment không gửi mention trùng khi không cần.**

*Ý nghĩa thực thi và kiểm chứng:* Mention resolution cần xác nhận recipient thuộc A/B và có quyền với source; dedup notification theo comment version + recipient. QA gồm recipient revoked trước submit và văn bản mention lặp.

**BR-M09-31 — Feed chỉ có nguồn người xem được truy cập.**

*Ý nghĩa thực thi và kiểm chứng:* Feed query luôn kiểm tra lại quyền nguồn và reveal state hiện tại; stable paging không làm lộ row metadata; private event không tạo badge unread có thể suy luận.

**BR-M09-32 — Feed không public hoặc có audience ngoài hai người.**

*Ý nghĩa thực thi và kiểm chứng:* Feed query luôn kiểm tra lại quyền nguồn và reveal state hiện tại; stable paging không làm lộ row metadata; private event không tạo badge unread có thể suy luận.

**BR-M09-33 — Feed không lộ Private qua title, count, timestamp.**

*Ý nghĩa thực thi và kiểm chứng:* Feed query luôn kiểm tra lại quyền nguồn và reveal state hiện tại; stable paging không làm lộ row metadata; private event không tạo badge unread có thể suy luận.

**BR-M09-34 — Xóa/revoke nguồn phải cập nhật hiện diện Feed theo quyền mới.**

*Ý nghĩa thực thi và kiểm chứng:* Feed query luôn kiểm tra lại quyền nguồn và reveal state hiện tại; stable paging không làm lộ row metadata; private event không tạo badge unread có thể suy luận.

**BR-M09-35 — Feed phân trang hoặc tải thêm.**

*Ý nghĩa thực thi và kiểm chứng:* Feed query luôn kiểm tra lại quyền nguồn và reveal state hiện tại; stable paging không làm lộ row metadata; private event không tạo badge unread có thể suy luận.

**BR-M09-36 — Notification tham chiếu action và source hợp lệ.**

*Ý nghĩa thực thi và kiểm chứng:* Notification phát sinh chỉ sau interaction commit và được hiển thị theo quyền người nhận tại thời điểm fetch/open. Trạng thái notification độc lập với read receipt của nguồn; retry channel không copy comment.

**BR-M09-37 — Ngừng gửi Notification tới người mất quyền.**

*Ý nghĩa thực thi và kiểm chứng:* Notification phát sinh chỉ sau interaction commit và được hiển thị theo quyền người nhận tại thời điểm fetch/open. Trạng thái notification độc lập với read receipt của nguồn; retry channel không copy comment.

**BR-M09-38 — Notification không lộ Secret Surprise hoặc Capsule Sealed.**

*Ý nghĩa thực thi và kiểm chứng:* Notification phát sinh chỉ sau interaction commit và được hiển thị theo quyền người nhận tại thời điểm fetch/open. Trạng thái notification độc lập với read receipt của nguồn; retry channel không copy comment.

**BR-M09-39 — Giảm spam khi Reaction được đổi nhanh.**

*Ý nghĩa thực thi và kiểm chứng:* Notification phát sinh chỉ sau interaction commit và được hiển thị theo quyền người nhận tại thời điểm fetch/open. Trạng thái notification độc lập với read receipt của nguồn; retry channel không copy comment.

**BR-M09-40 — Preferences cho phép mỗi user bật/tắt loại tương tác.**

*Ý nghĩa thực thi và kiểm chứng:* Notification phát sinh chỉ sau interaction commit và được hiển thị theo quyền người nhận tại thời điểm fetch/open. Trạng thái notification độc lập với read receipt của nguồn; retry channel không copy comment.

**BR-M09-41 — Mark Notification read không tự mark M08 Letter/Capsule opened.**

*Ý nghĩa thực thi và kiểm chứng:* Notification phát sinh chỉ sau interaction commit và được hiển thị theo quyền người nhận tại thời điểm fetch/open. Trạng thái notification độc lập với read receipt của nguồn; retry channel không copy comment.

**BR-M09-42 — Lỗi notification không làm mất interaction đã lưu.**

*Ý nghĩa thực thi và kiểm chứng:* Notification phát sinh chỉ sau interaction commit và được hiển thị theo quyền người nhận tại thời điểm fetch/open. Trạng thái notification độc lập với read receipt của nguồn; retry channel không copy comment.

**BR-M09-43 — Notification cũ không mở target đã xóa/revoked.**

*Ý nghĩa thực thi và kiểm chứng:* Notification phát sinh chỉ sau interaction commit và được hiển thị theo quyền người nhận tại thời điểm fetch/open. Trạng thái notification độc lập với read receipt của nguồn; retry channel không copy comment.

**BR-M09-44 — Quyền xem target là điều kiện tiên quyết để tương tác.**

*Ý nghĩa thực thi và kiểm chứng:* Phép giao source ACL + target mode + author scope + lifecycle. Không dùng comment làm hành động nghiệp vụ có confirm, đặc biệt M07. QA kiểm tra cả URL trực tiếp và UI.

**BR-M09-45 — Interaction Settings không nâng quyền vượt source.**

*Ý nghĩa thực thi và kiểm chứng:* Phép giao source ACL + target mode + author scope + lifecycle. Không dùng comment làm hành động nghiệp vụ có confirm, đặc biệt M07. QA kiểm tra cả URL trực tiếp và UI.

**BR-M09-46 — Owner có thể tắt tương tác mới khi source cho phép.**

*Ý nghĩa thực thi và kiểm chứng:* Phép giao source ACL + target mode + author scope + lifecycle. Không dùng comment làm hành động nghiệp vụ có confirm, đặc biệt M07. QA kiểm tra cả URL trực tiếp và UI.

**BR-M09-47 — Tắt bình luận mới không tự xóa bình luận cũ.**

*Ý nghĩa thực thi và kiểm chứng:* Phép giao source ACL + target mode + author scope + lifecycle. Không dùng comment làm hành động nghiệp vụ có confirm, đặc biệt M07. QA kiểm tra cả URL trực tiếp và UI.

**BR-M09-48 — Trạng thái M08 Sealed/Secret có quyền ưu tiên hơn setting.**

*Ý nghĩa thực thi và kiểm chứng:* Phép giao source ACL + target mode + author scope + lifecycle. Không dùng comment làm hành động nghiệp vụ có confirm, đặc biệt M07. QA kiểm tra cả URL trực tiếp và UI.

**BR-M09-49 — Comment/Reaction không thay RSVP, Review, Approval, Goal Completion.**

*Ý nghĩa thực thi và kiểm chứng:* Phép giao source ACL + target mode + author scope + lifecycle. Không dùng comment làm hành động nghiệp vụ có confirm, đặc biệt M07. QA kiểm tra cả URL trực tiếp và UI.

**BR-M09-50 — Mỗi Interaction có source module/type/id rõ ràng.**

*Ý nghĩa thực thi và kiểm chứng:* Source pointer bền vững theo ID bất biến; linked content không copy nghiệp vụ. Xóa/archive/revoke/reveal áp đúng nguồn và không dọn dây chuyền không được phép.

**BR-M09-51 — M09 không nhân bản dữ liệu chính của M01–M08.**

*Ý nghĩa thực thi và kiểm chứng:* Source pointer bền vững theo ID bất biến; linked content không copy nghiệp vụ. Xóa/archive/revoke/reveal áp đúng nguồn và không dọn dây chuyền không được phép.

**BR-M09-52 — Đổi tên/di chuyển source không đổi liên kết Interaction stable ID.**

*Ý nghĩa thực thi và kiểm chứng:* Source pointer bền vững theo ID bất biến; linked content không copy nghiệp vụ. Xóa/archive/revoke/reveal áp đúng nguồn và không dọn dây chuyền không được phép.

**BR-M09-53 — Xóa/revoke source áp hiệu lực lên comment/reaction liên quan.**

*Ý nghĩa thực thi và kiểm chứng:* Source pointer bền vững theo ID bất biến; linked content không copy nghiệp vụ. Xóa/archive/revoke/reveal áp đúng nguồn và không dọn dây chuyền không được phép.

**BR-M09-54 — M09 không thay trạng thái nghiệp vụ nguồn qua chữ bình luận/reaction.**

*Ý nghĩa thực thi và kiểm chứng:* Source pointer bền vững theo ID bất biến; linked content không copy nghiệp vụ. Xóa/archive/revoke/reveal áp đúng nguồn và không dọn dây chuyền không được phép.

**BR-M09-55 — Target tại những ngữ cảnh khác nhau có thread riêng khi IDs khác nhau.**

*Ý nghĩa thực thi và kiểm chứng:* Source pointer bền vững theo ID bất biến; linked content không copy nghiệp vụ. Xóa/archive/revoke/reveal áp đúng nguồn và không dọn dây chuyền không được phép.

# 7. Use Cases — 18 luồng nghiệp vụ có thể kiểm thử

Các luồng dưới đây mô tả nghiệp vụ độc lập công nghệ. Chúng là **kết quả bắt buộc**, không phải code hoặc đề xuất API bắt buộc. Mỗi UC phải có happy path, branch/permission failure và expected postcondition rõ ràng.

## UC-M09-01 — Add Reaction

**Actor:** A. **Tiền điều kiện:** Đăng nhập; source Shared với A can_view/can_react; setting Both/Reactions Only. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. A mở M08 Moment.
2. picker show six types.
3. chọn Love.
4. kiểm tra target source/current rights.
5. lưu một active reaction.
6. cập nhật counter đúng quyền.
7. tùy chọn tạo notification cho B.

**Rẽ nhánh / ngoại lệ:** A không đủ quyền/reveal chưa đến: từ chối, không lộ metadata. Gửi lặp cùng action: kết quả không nhân bản. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Một active Love của A đúng target, không đổi Moment. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-02 — Change/Remove Reaction

**Actor:** A. **Tiền điều kiện:** Đã có Love của A trên target hợp lệ. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. Chọn Haha.
2. hệ thống replace Love bằng Haha.
3. count Love giảm, Haha tăng hợp lệ.
4. A chọn Haha lần nữa.
5. inactive/remove.
6. tổng hiển thị cập nhật.

**Rẽ nhánh / ngoại lệ:** Trong lúc đổi, source bị Private hoặc target mất: mutation bị từ chối; local pending revert; A không xóa reaction B. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Không có hai active, audit đổi nếu quy định, feed không spam. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-03 — Create Comment

**Actor:** B. **Tiền điều kiện:** Page M01 Published/đúng quyền; can_comment; setting cho phép Comment. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. B mở Page ID.
2. compose multiline + emoji.
3. Send.
4. trim validation nonblank.
5. record với stable target/page ID và actor.
6. commit.
7. UI append.
8. notification tới recipient eligible.

**Rẽ nhánh / ngoại lệ:** Whitespace: validation. Retry: idempotency. Mạng không rõ: giữ draft, hỏi trạng thái hiện tại thay vì tạo bản trùng. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** 01 Comment, Page không đổi, B thấy đúng bản được lưu. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-04 — Reply to Comment

**Actor:** A. **Tiền điều kiện:** Comment cha trên target hợp lệ, A có quyền comment. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. A nhấn Reply dưới comment của B.
2. nhập body.
3. kiểm tra root/parent đúng target.
4. save reply with root context.
5. render tầng 2.
6. eligible notification tới B.

**Rẽ nhánh / ngoại lệ:** Root soft deleted: policy tombstone; hard-deleted/khác target: ngăn; reply-to-reply tiếp tục tầng 2. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Thread không lồng vô hạn; không mất attribution. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-05 — Edit Own Comment

**Actor:** A. **Tiền điều kiện:** A sở hữu Comment active, còn quyền source. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. A mở menu Edit.
2. lấy revision.
3. sửa body.
4. Submit.
5. backend kiểm tra author, source ACL, revision.
6. lưu revision, update active body.
7. show Edited.

**Rẽ nhánh / ngoại lệ:** B cố sửa: reject; Comment bị xóa từ tab khác: reject stale; edit chưa lưu: giữ draft. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Không copy Comment, lịch sử có tác giả/thời gian, no edit-caused duplicate new-comment notice. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-06 — Delete Own Comment

**Actor:** A. **Tiền điều kiện:** A là author của root Comment có Reply của B. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. A chọn Delete.
2. confirm nếu cần.
3. mark soft deleted with timestamp.
4. body hiển thị tombstone.
5. Reply B tồn tại theo quyền.
6. remove deleted body from new search/previews.

**Rẽ nhánh / ngoại lệ:** Source revoked before delete: xử lý theo deletion/data-rights policy M10, không lộ body; retry delete vẫn một tombstone. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Không xóa Reply B hoặc target, không lộ body A đã xóa. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-07 — Mention Partner

**Actor:** A. **Tiền điều kiện:** A có quyền comment; B có thể xem target. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. A gõ @.
2. chọn B từ suggestion eligible.
3. gửi body/structured mention.
4. source ACL của B được kiểm tra lại.
5. ghi Comment.
6. tạo tối đa một mention alert cho B.

**Rẽ nhánh / ngoại lệ:** B mất quyền trước gửi: không nhắc và không tiết lộ; lặp @B trong body: không spam; edit thêm mention có version mới: xử lý riêng. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Mention không cấp thêm quyền và không tiết lộ Private target. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-08 — View Thread

**Actor:** B. **Tiền điều kiện:** B can_view source và comment visible. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. B mở panel.
2. fetch comments/replies by target ID.
3. current permission filter.
4. load stable first page.
5. load more.
6. open one reply and its root.

**Rẽ nhánh / ngoại lệ:** Source archived/trashed/reveal false giữa chừng: invalidate displayed content/deny subsequent fetch; tombstone root giữ reply. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Thứ tự thread ổn định, tối đa hai cấp hiển thị, không lộ deleted body. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-09 — View Activity Feed

**Actor:** A. **Tiền điều kiện:** Có eligible interaction events trên nguồn A được phép. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. A mở Feed.
2. fetch eligible events chronologically.
3. show action/target safe labels.
4. chọn item.
5. recheck source and navigate.
6. paginate.

**Rẽ nhánh / ngoại lệ:** Private source từ Shared: item biến khỏi query; Secret Surprise counts không phản ánh existence; source deleted: card unavailable/hidden. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Feed chỉ có item đúng quyền hiện tại, không public. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-10 — Receive Interaction Notification

**Actor:** A. **Tiền điều kiện:** B Comment trên content A có quyền và A bật loại alert. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. B commit Comment.
2. notification generation validates eligibility/preferences.
3. in-app item cho A.
4. A mở.
5. recheck target.
6. render source Comment.
7. mark notification read.

**Rẽ nhánh / ngoại lệ:** Recipient bật off/sửa source thành Private: no new leak; push failure does not rollback comment; stale deep link cannot bypass. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Comment đã lưu độc lập notification; M08 opened state không thay khi đọc notification. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-11 — Configure Notifications

**Actor:** B. **Tiền điều kiện:** B đã đăng nhập. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. B mở preferences.
2. tắt Reactions, giữ Replies/Mentions.
3. Save.
4. A react rồi reply.
5. chỉ thông báo được bật xuất hiện cho B nếu ACL hợp lệ.

**Rẽ nhánh / ngoại lệ:** Network error: không giả đã lưu; settings trên hai thiết bị phải thống nhất; security/business alerts M05/M08 độc lập. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Notification types đúng user-config; reaction không ảnh hưởng reply alert. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-12 — Disable Interaction

**Actor:** A. **Tiền điều kiện:** A sở hữu Diary M01 và được quản lý mode. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. A chọn Reactions Only.
2. save target setting.
3. B can_view Diary, can_react.
4. B cố post Comment bị từ chối.
5. comment cũ vẫn tồn tại theo policy.

**Rẽ nhánh / ngoại lệ:** B thử API trực tiếp: reject. A bật Both nhưng nguồn read-only: nguồn vẫn thắng. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Không tạo Comment mới, không tự xóa comment cũ. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-13 — Comment on M01 Photobook

**Actor:** B. **Tiền điều kiện:** Book/Page published cho phép bình luận. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. B comment trên Page P-ID trong Book.
2. A reorder Page.
3. reload Book.
4. Comment vẫn ở Page P-ID đúng.
5. xem Book-level comments tách Page-level.

**Rẽ nhánh / ngoại lệ:** Page deleted/restored: hide/show theo ACL; unpublished page/private editorial content không lộ. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Comment không chuyển sang trang khác vì số thứ tự thay đổi. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-14 — Comment on M03 Visit

**Actor:** A. **Tiền điều kiện:** M03 Visit được chia sẻ và có quyền comment. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. A mở Visit.
2. Comment trải nghiệm.
3. save M09 Comment.
4. B có thể reply.
5. M03 Review theo Visit của A/B không tự đổi.

**Rẽ nhánh / ngoại lệ:** Visit bị xóa/Private: source resolver hide; comment “5 sao” không tự biến thành review/rating. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Review chính thức của M03 độc lập. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-15 — Comment on M07 Expense

**Actor:** B. **Tiền điều kiện:** M07 Shared Expense; B có thể xem và comment, approval pending. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. B Comment “Mình muốn xem lại”.
2. lưu Comment và alert theo quyền.
3. Expense Approval giữ Pending.
4. B có thể dùng Approve/Reject chính thức tại M07.

**Rẽ nhánh / ngoại lệ:** B viết “đồng ý” hoặc emoji không kích hoạt approval; Expense đổi thành Private thì không còn truy cập. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Không thay số tiền, payer, allocation, settlement, approval. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-16 — React to M08 Letter/Capsule

**Actor:** B. **Tiền điều kiện:** Love Letter Delivered tới B, hoặc Capsule đã unlock và B có quyền content. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. B mở Letter/Capsule.
2. source resolver cho can_react sau reveal.
3. B chọn Love.
4. M09 lưu reaction đúng Letter/Capsule target.
5. A được alert theo quyền và preferences.

**Rẽ nhánh / ngoại lệ:** Scheduled Letter chưa Delivered, Capsule Sealed, Secret Surprise chưa reveal: deny including counters; nhận mail not equivalent to opened. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Không làm thay đổi Delivered/Opened/Unlock status của M08. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-17 — Revoke Access to Source

**Actor:** A. **Tiền điều kiện:** A có quyền đổi visibility của Shared Moment. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. B từng Comment Moment.
2. A thu hồi quyền B ở M08.
3. B ở tab cũ thử Reply.
4. backend reject.
5. B mở Feed/Search/URL đều không thấy Moment/Comment.
6. A vẫn giữ dữ liệu theo policy.

**Rẽ nhánh / ngoại lệ:** Notification cũ của B không mở content; cached preview phải hidden/invalidated; rollback if revoke failed. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Không rò rỉ khi chuyển Shared→Private; data B không bị xóa trái policy. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

## UC-M09-18 — Concurrent Comment Actions

**Actor:** A. **Tiền điều kiện:** A có cùng Comment trên hai thiết bị. Trước thao tác phải xác định đúng định danh target và trạng thái quyền nguồn hiện tại.

**Luồng chính:**

1. Thiết bị 1 sửa body từ version V1.
2. Thiết bị 2 xóa cùng Comment.
3. backend thực thi có version checks.
4. state cuối Deleted hoặc xử lý rõ trước/sau.
5. edit cũ không resurrect Comment.

**Rẽ nhánh / ngoại lệ:** Hai user cùng thêm root Comments: cả hai giữ nguyên; reaction retries: single active; stale revision edit: conflict. Không được trả về nội dung source bí mật hoặc đã xóa trong lỗi xác thực. Nếu thao tác có side effect notification, chỉ kích hoạt thông báo hợp lệ sau khi bản ghi interaction đã được xác nhận.

**Hậu điều kiện thành công:** Không silently lose edits, không duplicate/reactivate deleted comment. **Hậu điều kiện thất bại:** không ghi thêm dữ liệu sai, không báo thành công giả; giữ dữ liệu có thể khôi phục theo policy; không xóa dây chuyền module nguồn.

**Kiểm thử bắt buộc:** A/B hoán vai; source chuyển Private/Trash ngay trước submit; mobile/desktop; retry/double-click; request từ tab cũ; target permalink; notification and feed privacy. Liên hệ `AC-M09-*` tại mục nghiệm thu và `BR-M09-*` tương ứng.

# 8. Exception Handling — 40 tình huống đã chốt

**Lưu ý trạng thái lỗi:** lỗi do không có quyền không được trả về title, avatar, thumbnail, comment count hay sự tồn tại của Secret targets. UI có thể dùng thông báo không tiết lộ như “Nội dung không khả dụng hoặc bạn không có quyền truy cập”.

**EX-M09-01 — Reaction target missing.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Reject safely; do not create dangling reaction; do not reveal target metadata.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-02 — Reaction trên private source B.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Deny as not found/permission-safe; count/author list inaccessible.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-03 — Tap reaction nhiều lần.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Idempotent intended last stable state; không có duplicate active row.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-04 — Đổi reaction nhanh.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Resolve ordering/version, show one active and no spam notifications.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-05 — Gỡ reaction.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Persist absent state, count correct, retry removal safe.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-06 — Comment body rỗng.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Disable/deny send; giữ input focus.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-07 — Comment whitespace-only.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Normalize validation, deny submit without empty record.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-08 — Mạng mất khi gửi.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Show pending/uncertain; preserve draft and reconcile before safe retry.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-09 — Gửi lại request.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Dedup same operation to one Comment and one logical notification.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-10 — Mất quyền đúng lúc ghi Comment.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Recheck source ACL during mutation; reject and no leakage.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-11 — Edit comment khác tác giả.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Reject even if editor of source; no unauthorized revision.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-12 — Delete comment khác tác giả.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Reject unless explicit governance policy M10, which is not granted P0.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-13 — Root comment deleted.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Render tombstone; retain authorized replies in thread.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-14 — Parent comment không tồn tại.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Reject invalid parent/root; no orphan invalid reply.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-15 — Reply vượt 2 tầng.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Flatten UI to root group retaining reply context, not deep nesting.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-16 — Comment deleted nhưng notification còn.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** No deleted body visible via old preview/deep link on new fetch.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-17 — Source moved/reordered.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Target ID stable, comment stays with actual object.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-18 — Source deleted.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Hide comments for inaccessible target, keep soft records as allowed for recovery.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-19 — Source restored.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Re-evaluate ACL, restore eligible comment display without fake recreation.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-20 — Private source becomes Shared.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Check asset/entry ACL individually, do not auto reveal prior private linked content.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-21 — Shared becomes Private.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Hide from ex-viewers across Feed, Search, counters, Notifications, direct links.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-22 — Mention unauthorized user.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** No notify and no access grant; warning must not reveal secrets.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-23 — Mention repeated in body.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Dedup recipients per Comment/action and prevent multiple alert spam.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-24 — Edited Comment introduces mention.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** New valid mention notifications only when justified; no duplicate old mention.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-25 — User turned off notification type.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Do not send that interaction type; keep saved interaction.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-26 — Rapid reaction changes.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Coalesce/suppress excessive notifications, ensure final actor/type accurate.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-27 — Old notification to deleted source.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Deep link returns safe unavailable state, no old snippet leak.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-28 — Old notification to revoked source.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Recheck ACL at click; no access to previously readable content.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-29 — M08 Secret Surprise interaction.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Hide existence, count, actor, preview until reveal according to M08.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-30 — M08 Sealed Capsule interaction.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Deny before eligible opening according to M08; no access via cached metadata.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-31 — Love Letter not Delivered.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Recipient cannot react/read before delivered; author draft policy distinct.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-32 — M07 financial Comment.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** “OK” remains text only; never updates Expense approval/Settlement.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-33 — Reaction on Goal.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Celebrate does not mark Completed or update progress.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-34 — Comment on Event.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** “Đi nhé” does not set RSVP Going.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-35 — Comment on Visit.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Text review-like message does not create M03 Review.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-36 — M01 Page reordered.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Comments stay bound to stable Page ID.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-37 — Private Comment search.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** No result, count, snippet or suggestion unauthorized.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-38 — Interaction export.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Only eligible target content and allowed history; no sealed/secret leakage.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-39 — Restore Comment without source rights.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Do not re-expose restored comment; honor current ACL/source existence.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

**EX-M09-40 — Edit/delete from two devices.**

- **Điều kiện tái hiện:** Thiết lập actor, target và trạng thái phù hợp để kích hoạt tình huống này; thử lại ở source ngay trước/lúc submit hoặc lúc mở link nếu là case quyền.
- **Xử lý bắt buộc:** Versioned conflict; never resurrect deleted via stale edit.
- **QA kiểm tra:** không ghi side effect trái quyền, không xóa dữ liệu nguồn, không hiển thị “thành công” giả; reload/session khác vẫn thấy cùng kết quả, notification/feed/search/export không hé lộ bản ghi bị chặn.

# 9. Acceptance Criteria — 65 tiêu chí Given–When–Then

Các tiêu chí AC-M09-01–65 là điều kiện bắt buộc để QA nghiệm thu P0. Một AC chỉ đạt khi cả trạng thái UI, dữ liệu nguồn, side effects notification và điều kiện quyền liên quan đều chính xác. Các câu trong cột Test được viết theo cấu trúc Given–When–Then có thể chuyển thành test case.

## 9.1. Reactions (01–10)

| Mã | Kịch bản | Given–When–Then / kết quả bắt buộc |
| --- | --- | --- |
| AC-M09-01 | Thả Love đúng quyền | Given shared target và can_react; when A chọn Love; then có đúng 1 active Love. |
| AC-M09-02 | Reaction trên Private nguồn người khác | Given B cannot view; when reaction; then deny without existence leakage. |
| AC-M09-03 | Đổi Love→Haha | Given one active Love; when choose Haha; then active set chỉ có Haha. |
| AC-M09-04 | Gỡ reaction | When click current active type; then target actor active reaction trở về absent và count đúng. |
| AC-M09-05 | Retry reaction | Given same mutation retried; then no duplicate active/action/notification. |
| AC-M09-06 | Source moved | Given target moved/reordered; then reaction remains linked by target ID. |
| AC-M09-07 | Source deleted | Given source trashed; then no unauthorized reaction/list display. |
| AC-M09-08 | Actor loses access | When permission revoked; then new reaction denied on both device and direct request. |
| AC-M09-09 | Reaction on Capsule Sealed | Given capsule not eligible; then no content/reaction access. |
| AC-M09-10 | Reaction counts ACL | Given hidden source; then neither counts nor actor labels leak. |

## 9.2. Comments & Replies (11–30)

| Mã | Kịch bản | Given–When–Then / kết quả bắt buộc |
| --- | --- | --- |
| AC-M09-11 | Create comment | Given valid body & permission; when send; then record bound to exact target. |
| AC-M09-12 | Empty body | When submit empty comment; then no record. |
| AC-M09-13 | Whitespace body | When submit whitespace-only; then no record. |
| AC-M09-14 | Create retry | When same request repeated; then one Comment and logical alert. |
| AC-M09-15 | Reply target | Given root comment; when reply; then linked to correct root/target. |
| AC-M09-16 | Reply-to-reply UI | When reply to child; then render in same second-level group. |
| AC-M09-17 | Edit own | When author edits current revision; then show Edited and preserve revision. |
| AC-M09-18 | Edit other | When nonauthor attempts edit; then denied. |
| AC-M09-19 | Delete own | When author deletes; then hide body via tombstone. |
| AC-M09-20 | Delete root with reply | Given B reply; when A removes root; then reply remains if source access valid. |
| AC-M09-21 | Deleted comment search | Given comment deleted; when query; then no visible deleted snippet. |
| AC-M09-22 | Comment on Page ID | When comment on M01 Page; then target Page stable ID. |
| AC-M09-23 | Photobook reorder | When Page moved; then comment stays original Page. |
| AC-M09-24 | Media target | When comment on M02 Asset; then attached to exact asset, not all placements. |
| AC-M09-25 | Visit Comment vs Review | When M03 Visit Comment; then no official M03 Review auto-created. |
| AC-M09-26 | Event Comment vs RSVP | When M05 Event Comment; then participant response unchanged. |
| AC-M09-27 | Goal Comment vs Complete | When M06 Goal Comment; then status/progress unchanged. |
| AC-M09-28 | Expense Comment vs Approve | When M07 Expense Comment; then approval/settlement unchanged. |
| AC-M09-29 | Letter pre-Delivered | When target not delivered; then recipient cannot comment/react. |
| AC-M09-30 | Concurrent comment edits/deletion | When stale edit arrives after delete; then no resurrection. |

## 9.3. Mentions & Notifications (31–40)

| Mã | Kịch bản | Given–When–Then / kết quả bắt buộc |
| --- | --- | --- |
| AC-M09-31 | Mention with authorized B | When valid mention; then structured mention saved and eligible notification. |
| AC-M09-32 | Mention unauthorized B | When B cannot view source; then no notification/information leak. |
| AC-M09-33 | Duplicate mentions | When @B appears several times; then not multiple alerts for same action. |
| AC-M09-34 | Reply notification on | Given enabled preference; when reply; then eligible in-app alert. |
| AC-M09-35 | Comments notification off | Given off; when other actor comments; then no corresponding alert. |
| AC-M09-36 | Reaction changes rapidly | When actor toggles types; then no alert spam. |
| AC-M09-37 | Notification read ≠ Letter Opened | When mark M09 alert read; then M08 recipient read state remains unchanged. |
| AC-M09-38 | Old notification deleted source | When click stale notice; then cannot view removed source content. |
| AC-M09-39 | Old notification revoked source | When click notice without access; then denied without leak. |
| AC-M09-40 | Notification M08 secret | Given not revealed; then no title/content secret in alert. |

## 9.4. Settings & Privacy (41–50)

| Mã | Kịch bản | Given–When–Then / kết quả bắt buộc |
| --- | --- | --- |
| AC-M09-41 | Reactions Only | When target mode Reactions Only; then comments blocked, reactions allowed if source grants. |
| AC-M09-42 | Comments Only | When mode Comments Only; then reaction blocked, comment allowed if grants. |
| AC-M09-43 | Read Only | When mode Read Only; then both mutating interactions blocked. |
| AC-M09-44 | Disable comments preserve old | When mode switched off; then old authorized comments remain per policy. |
| AC-M09-45 | Mode cannot elevate source | Given source denies Comment; when mode Both; then Comment still denied. |
| AC-M09-46 | Revoke while tab open | Given B loaded target; when A revokes B; then B subsequent mutation denied. |
| AC-M09-47 | Shared→Private Feed | Given source made Private; then B no longer sees interaction activity. |
| AC-M09-48 | Secret Surprise counts | Before reveal, recipient cannot infer interaction count. |
| AC-M09-49 | Search Private | Search excludes unauthorized comment and count. |
| AC-M09-50 | Shared Expense private receipt | Commenting Expense never exposes private receipt. |

## 9.5. Feed, Recovery & Devices (51–65)

| Mã | Kịch bản | Given–When–Then / kết quả bắt buộc |
| --- | --- | --- |
| AC-M09-51 | Activity Feed scope | Only interactions on currently accessible source appear. |
| AC-M09-52 | Feed pagination | Large events can load incrementally without duplicate/unauthorized items. |
| AC-M09-53 | Feed after revoke | After source rights revoked, feed stops disclosing target. |
| AC-M09-54 | Comment soft delete recovery | Delete creates eligible recoverable state under policy. |
| AC-M09-55 | Restore ACL | Restored comment not exposed when source unavailable/unauthorized. |
| AC-M09-56 | Export scoped | Only comments/reactions eligible under target rights exported. |
| AC-M09-57 | Backup/Restore consistency | Keep author/target/thread/revision identifiers consistent after restore. |
| AC-M09-58 | Source deleted no cascade | Deleting source does not delete unrelated module entities. |
| AC-M09-59 | Comment send network fail | Do not claim saved; preserve draft and reconcile retry. |
| AC-M09-60 | Reaction network fail | Pending UI reverts/refreshes to confirmed state. |
| AC-M09-61 | Mobile comment | Can create/edit/reply/delete on mobile. |
| AC-M09-62 | Desktop comment | Can create/edit/reply/delete on desktop. |
| AC-M09-63 | Mobile mention | Can select eligible partner and post mention by touch/keyboard. |
| AC-M09-64 | Cross-device feed | Source and actor state consistent mobile vs desktop. |
| AC-M09-65 | Concurrent interactions | Two users add independent comments without loss, duplicates or invalid ordering. |

# 10. Hợp đồng liên kết (Cross-module Contracts) M01–M10

## 10.1. Quy tắc giao diện giữa module nguồn và M09

Khi source cung cấp target tương tác, M09 cần biết tối thiểu: `source_module`, `target_type`, stable target ID, lifecycle hiện tại, current actor visibility, source-level capability (`react`, `comment`, `manage_settings`), reveal/access state, contextual title/route *chỉ khi có quyền*, optional authorized preview, và sự kiện domain khi source được đổi ACL/Archive/Trash/Restore/Delete/Unpublish. Không buộc bất kỳ module nào phải có bảng SQL như tên trên; cần đạt được **hành vi tương đương và có test contract**.

Phía M09 trả về/cho phép nhúng: danh sách Reaction và Comment được lọc, trạng thái khả dụng, tác giả và thời gian, deep link an toàn, in-app notification references, audit/restore theo quyền. Không đẩy toàn bộ comment sang module nguồn để dữ liệu không có hai phiên bản độc lập. Interaction count có thể được cache nhưng không được cache vượt phạm vi quyền hay trạng thái Reveal.

## 10.2. M01 — Photobook & Diary

- `Book`, `Page`, `Diary` có target IDs khác nhau. Reaction/Comment trên Book **không đồng nghĩa** với trên Page. Page có thể được reorder, move trong Book hoặc thay đổi style bằng Simple/Advanced Editor; comment gắn **ID trang ổn định**, không gắn số trang hiển thị hoặc layer index.
- Published snapshots M01 phải không bị sửa do M09 Comment; bình luận độc lập với layer edit và không tự tạo một revision văn bản của Photobook. Quy tắc comment trên bản đã publish/unpublished cần tuân thủ ACL M01; private editorial layers không thành target public của M09.
- M01 đã có true real-time co-edit text/layer/cursor. M09 **không** xây thêm live cursor hoặc per-character OT/CRDT trên Comment P0. Nếu comment được tạo đồng thời, những bản ghi riêng không ghi đè nhau; nếu cùng author chỉnh một comment từ hai thiết bị, version conflict.
- Diary private của A chỉ B xem/comment nếu A cấp quyền phù hợp. Search/Feed notifications không được leak Diary.

## 10.3. M02 — Memories & Media Library

- Media Asset và Album là hai target độc lập. Một ảnh xuất hiện trong nhiều Album, Page hoặc Moment **không** làm comment trên asset nhân lên tại tất cả placements.
- Nếu B thấy Page M01 chứa ảnh Private của A nhưng không có quyền đối với Media Asset, B có thể tương tác với Page theo quyền M01 nhưng không tự mở trực tiếp Comment/Details của Media Asset M02.
- Non-destructive variants M02 không tự tách comment thread trừ khi product owner về sau phê duyệt target variant; M02 vẫn sở hữu media originals, revisions, albums và trash.
- Khi media bị xóa/thu hồi quyền, mọi ảnh thumbnail/suggest/comment search phải tôn trọng trạng thái mới.

## 10.4. M03 — Food & Places

- Targets: Place, Visit, Date Plan. M03 quản lý Place/Wish/Plan/Visit/Review; M09 quản lý comments/reactions về các đối tượng này, **không** tạo Visit từ Comment và **không** coi Comment như Review của từng người theo Visit.
- Ví dụ B bình luận dưới Place “Đi tối thứ Bảy nhé”: M03 không tự biến thành Plan hoặc M05 Event. Người dùng cần hành động Plan Visit chính thức.
- Nếu Place gắn nhiều Visits, bình luận Visit phải gắn Visit ID; không trộn với bình luận Place. Visit có quyền Private của A thì B không thấy comment/counter của Visit.

## 10.5. M04 — Travel & Trip Planner

- Targets: Trip/Activity. Comment không thay đổi hoạt động từ `Planning` thành `Completed`, không tạo Booking/Transport/Stay hoặc xác nhận giấy tờ.
- Một Activity được copy/move khác ngày có thể giữ target ID hoặc tạo Activity ID mới tùy thao tác M04; M09 tuân thủ kết quả identity của M04, không suy đoán identity chỉ từ title/time.
- Trip canceled/archived/trash làm khả năng tương tác mới thay đổi theo M04 lifecycle, nhưng thread/audit hợp lệ không bị tự xóa dây chuyền. Media, Places, Expense links vẫn thuộc module nguồn.

## 10.6. M05 — Couple Calendar

- Targets: Calendar Event và Anniversary. Comment “Mình đi nhé” không tự đổi Attendance `Going`; reaction không tự thêm Participant.
- Event privacy và recurrence: với series/occurrence, M05 phải xác định target identity cụ thể và M09 không được tự gộp comment giữa một occurrence riêng được dời lịch với toàn series. **Đề xuất hợp đồng cần thống nhất tại thiết kế:** P0 có thể cho comment series-level/Event-level theo source ID được M05 expose; nếu comment per-occurrence, định danh occurrence phải ổn định và rõ, không dựa ngày hiển thị. Không tự bật per-occurrence comment nếu source không có contract.
- M05 sở hữu Reminder/RSVP/timezone. M09 notification reaction/comment không đồng nghĩa reminder đã gửi hay event được xem.

## 10.7. M06 — Bucket List & Goals

- Targets: Wish/Goal/Achievement. React Celebrate dưới Achievement không cập nhật Goal metric, task, milestone hoặc Both Confirmation.
- Comment có thể giúp thảo luận, nhưng không tự trở thành Task hay được coi là xác nhận hoàn thành, ngay cả khi có @mention.
- Goal Private không hiển thị trong Feed của B. Goal version changes không làm M09 ghi đè progress history.

## 10.8. M07 — Budget & Savings

- Targets: Shared Expense, Budget, Savings Goal **chỉ khi người đọc có quyền tương ứng**; có thể tắt reaction và giữ Comment để tránh không phù hợp ngữ cảnh.
- “Đã thanh toán rồi”, “Ok”, “Tớ đồng ý” hoặc emoji *không* phải M07 `Expense Approval`, `Settlement Confirmation`, `Savings Contribution`, `Withdrawal` hay phép sửa Payer/Split. Chỉ action chính thức trong M07 thay được status tài chính.
- Không đưa `amount`, Payer, receipt thumbnail, contribution split hoặc balances từ một giao dịch Private vào Comment preview trên Shared Goal/Activity. Một link M07 có thể được hiển thị như `nội dung liên kết không khả dụng` nếu người đọc thiếu quyền.
- A thu hồi quyền B với Expense: M09 xóa khả năng truy cập mới vào mọi Comment/Reaction/Feed liên quan, nhưng việc xóa Comment không tự làm thay đổi số dư ledger chính thức.

## 10.9. M08 — Special Moments

- Moment/Milestone cho phép tương tác khi quyền hợp lệ; Love Letter chỉ người đủ quyền có thể comment/react **sau Delivered**; Surprise chỉ sau **Revealed**; Capsule chỉ khi **Unlock Eligible và có quyền mở nội dung** theo chính sách M08.
- `Delivered ≠ Opened`, `Reveal ≠ Read`, `Unlock Eligible ≠ Opened`. Reaction hoặc Comment không tự đánh dấu Letter/Capsule là Opened; thao tác click Notification M09 không phải evidence của hành động mở trong M08.
- Secret target trước reveal: che *existence, title, count, snippet, actor, comment IDs, preview*. Những tác vụ nội bộ của creator không được lộ tới người nhận qua Feed hay Notification trước hạn.
- M08 quản lý sealed snapshots và reveal gate. M09 không được tạo comment trên Capsule Items chưa được mở, không export Comment vốn tiết lộ nội dung bị khóa, và không tự biến `owner` thành quyền bypass Seal.

## 10.10. M09 và M10 — shared capabilities

- M09 là **Interaction data owner**. M10 sẽ chốt account security, preference centralization, relationship membership changes, audit visibility, permanent deletion/right-to-remove, notification channel capabilities và policy cho administrator/support.
- Notification Center toàn hệ thống có thể dùng chung hệ thống với M05 Reminders và M08 Scheduled Content. M09 đóng vai trò **producer của event tương tác**, không xây Notification Center độc lập gây duplicate counters.
- Quyền source có hiệu lực tại thời điểm request; nếu M10 giải quyết permission inheritance/explicit overrides, M09 tuân thủ thực thể quyền được resolve cuối.

## 10.11. Ma trận chống đồng nhất sai chức năng

| Interaction text | Người dùng có thể hiểu | Điều tuyệt đối không tự động xảy ra | Nghiệp vụ đúng |
| --- | --- | --- | --- |
| Comment “5 sao” dưới M03 Visit | Đánh giá chuyến ghé | Không tạo Review hợp lệ | M03 Create/Update Visit Review |
| Comment “Tớ đi” dưới M05 Event | Xác nhận tham gia | Không set Going | M05 RSVP |
| Celebrate M06 Goal | Chúc mừng | Không set Completed | M06 Goal Completion Confirmation |
| “OK chia đôi” dưới M07 Expense | Chấp nhận chia | Không tạo Approved allocation | M07 Approve Allocation |
| “Đã chuyển tiền” dưới M07 Expense | Đã hoàn trả | Không tạo Settlement | M07 Record/Confirm Settlement |
| Comment dưới M04 Activity | Bàn việc đi | Không complete Activity/Booking | M04 explicit activity update |
| React M08 Letter | Thể hiện cảm xúc | Không phát sinh Letter Opened | M08 explicit recipient open behavior |
| Comment Capsule trước unlock | Muốn viết lời nhắn | Không bypass Seal | M08 unlock & permission workflow |

# 11. Notifications & Activity Feed — hành vi tích hợp

## 11.1. Ma trận loại thông báo

| Event nguồn M09 | Recipient hợp lệ | Mặc định P0 | Conditions | Không được làm |
| --- | --- | --- | --- | --- |
| New root Comment | Owner của target hoặc follower hợp lệ nếu source cho phép | On cho Comment trên own content | ACL và preferences còn hiệu lực | Không đính text private khi không được phép |
| Reply to Comment | Author của comment được trả lời hoặc recipient hợp lệ | On | Dedup actor/comment/version | Không gửi cho nguồn bị xóa/mất quyền |
| Mention | Người được mention | On | Recipient có view target | Không tự cấp quyền, không leak denied target |
| Reaction | Owner hoặc user liên quan theo nguồn | On, có gộp | Active reaction final valid | Không spam toggle nhanh |
| Edit Comment | Thường không notification mới | Off by design P0 | New mention có quy tắc khác | Không giả làm new Comment |
| Delete Comment | Không tự tạo notification mới | Off by design P0 | Old previews invalidated | Không trưng deleted body |

**Audience:** Chỉ hai account A/B trong Our Space và những recipient nằm trong nguồn; không gửi hàng loạt email ra ngoài. Self-action có thể xuất hiện trong activity history của chính actor nhưng không cần self-notification vô nghĩa. Nếu một account không được đọc source, event không được lộ ngay cả dưới dạng “có một thông báo mới”.

## 11.2. Tách trạng thái

Interaction commit, Activity Feed projection và Notification delivery là ba bước logic riêng. `Comment saved` không đồng nghĩa `Notification displayed`; `Notification read` không đồng nghĩa `Comment viewed` hoặc `M08 Letter Opened`. Nếu notification generation gặp lỗi, Comment vẫn có ID và tác giả, UI không được báo comment chưa lưu trừ khi ghi Comment thật sự thất bại. Hạ tầng retry notification cần có identity ổn định để không tạo hai thông báo cho một interaction logically identical.

## 11.3. Thứ tự và giảm spam

Feed có thứ tự thời gian ổn định, với tie-breaker ID nếu nhiều action cùng timestamp. Reaction thay đổi nhanh cần collapse/coalesce theo actor+target trong khoảng đủ ngắn được **định nghĩa lúc thiết kế notification**; không áp con số tùy tiện trong BRD. Mentions lặp lại trong một Comment không sinh nhiều notification cho cùng recipient. Khi chỉnh Comment, mention cũ không tự ping lại, chỉ mention mới hợp lệ có thể notify.

## 11.4. Read / Unread và liên kết sâu

Click Notification phải tra cứu nguồn tại thời điểm mở. Nếu source không tồn tại, bị private, revoked, deleted hoặc M08 đang Sealed/Secret, trả màn hình không khả dụng an toàn. Không lộ title, body, người đã reaction, ảnh hoặc số lượng từ payload cũ. State 'read notification' có thể được cập nhật sau thao tác của user nhưng **không** alter business state nguồn.

## 11.5. Quy tắc activity feed

Feed chỉ từ interactions hợp lệ, không phải full timeline tạo/sửa của toàn Our Space. Không tự phát từ hành vi chỉnh sửa kỹ thuật trong Photobook, thay số tiền M07, đổi date M05 hoặc xóa file M02. Reaction feed action có thể hiển thị event thay đổi hợp lệ, nhưng không spam nhiều card cho cùng một tap/toggle; mọi card cần resolver source và privacy. Không dùng ranking công khai hoặc gợi ý social ngoài hai account.

# 12. Interaction Settings, truy cập và trạng thái giao diện

## 12.1. Ma trận quyết định hiển thị khả năng

| Source grants | Interaction mode | Cho Reaction | Cho Comment | Kết quả |
| --- | --- | --- | --- | --- |
| view+react+comment | Both | Yes | Yes | Đầy đủ M09 |
| view+react+comment | Reactions Only | Yes | No | Chỉ biểu cảm |
| view+react+comment | Comments Only | No | Yes | Chỉ bình luận |
| view+react+comment | Read Only | No | No | Đọc comment cũ theo quyền |
| view+react, no comment | Both | Yes | No | Source permission giới hạn |
| view+comment, no react | Both | No | Yes | Source permission giới hạn |
| view only | Any | No | No | Không source capability |
| no view | Any | No | No | Không hiển thị panel/target |
| M08 Sealed/Secret | Any | No | No | Reveal gate ưu tiên cao nhất |

`Viewer` hoặc `Editor` là role của source **không tự ánh xạ** sang `comment`/`react` nếu module nguồn không cấp capability đó. M09 phải tránh assumptions rằng shared == all editable.

## 12.2. UX success / loading / offline

- Phản hồi rõ khi Comment đang gửi, đã lưu, có lỗi hoặc kết quả chưa chắc do mất mạng.
- Reaction có thể optimistic để mượt nhưng phải rollback/reconcile với kết quả chính thức khi API/permission check thất bại. Không hiển thị một reaction như đã lưu mãi khi mạng lỗi.
- Khi thay đổi quyền, panel đang hiển thị phải bị vô hiệu hóa/ẩn ở truy cập mới. Background tabs và link cũ không thay được quyền backend.
- Comment Draft có thể giữ ở thiết bị/phiên phù hợp để chống mất nội dung khi mạng lỗi; phạm vi lưu trữ cục bộ, mã hóa và retention cụ thể để M10/tech chọn. Không lưu draft secret vào vùng có thể đọc bởi partner khác.
- Empty state khác nhau: không có bình luận (thật sự 0 và có quyền), chưa hỗ trợ trên source, tắt tương tác, thiếu quyền, source không khả dụng. Với private target không được cho phép biết existence, ưu tiên thông báo chung không tiết lộ.

## 12.3. Accessibility / mobile / desktop

- Reaction dùng icon + label có thể đọc bằng screen reader, không dùng màu hoặc emoji đơn độc làm kênh trạng thái duy nhất. Tương tác có feedback đã chọn.
- Bàn phím desktop điều hướng được thread, reply, edit, delete, notification preferences; focus không bị mất sau thao tác.
- Trên mobile, composer tránh bị che bởi bàn phím, controls đủ vùng chạm, list 2-level scroll dễ dùng, không bắt hover để thấy Edit/Delete; có thông báo lỗi gần control.
- Hỗ trợ văn bản tiếng Việt với dấu, emoji nhiều mã Unicode, xuống dòng và link. Tránh cắt dấu hoặc parse @mention bằng hiển thị tên đơn giản; mention cần User ID.
- Số lượng bình luận dài cần tải thêm/infinite pagination có kiểm soát; không bắt tải mọi replies trước khi thấy target.

## 12.4. Search / ordering / pagination

- Sắp xếp Comment theo thời gian hoặc lựa chọn ổn định được UI thể hiện; P0 mặc định chronological trong Thread, newest/chronological cho Feed theo ngữ cảnh.
- Phân trang dựa trên cursor hoặc phương pháp tương đương tránh trùng và mất mục khi comment mới xuất hiện; vẫn phải lọc quyền hiện tại.
- Search chỉ trên comment body Active/Edited hiện hành có quyền, không tự đưa Deleted revisions vào index có thể truy cập. Mention suggestions không trả tên nguồn private.
- Unicode normalization, escaping output, quyền khi xem snippet cần kiểm thử cả tiếng Việt và emoji.

# 13. Xóa mềm, khôi phục, xuất dữ liệu và audit

## 13.1. Comment soft delete và child replies

Người viết A xóa Comment root; nội dung A trở thành tombstone đối với UI có quyền, reply của B vẫn có thể hiển thị nếu Reply và source còn hợp lệ. Tombstone không chứa nội dung gốc, chỉ có thông điệp chung “Bình luận đã được xóa” và dữ liệu tối thiểu cần giữ cấu trúc Thread. Nếu A yêu cầu xóa dữ liệu vĩnh viễn theo chính sách M10 sau này, việc giữ ID / placeholder không đồng nghĩa giữ body gốc vĩnh viễn; cần phân biệt preservation of thread structure với preservation of deleted personal text.

## 13.2. 30-day Trash và Restore

M09 theo chuẩn chung **Trash 30 ngày**. Restore trong cửa sổ hợp lệ cần điều kiện: actor được phép restore; source tồn tại và không bị xóa vĩnh viễn; người xem hiện tại có quyền theo nguồn; không có transition làm comment trở lại sai target; comment không vượt trạng thái `Secret/Sealed`; revision concurrency được giải quyết. Khôi phục không phát lại notification `New Comment` hoặc tăng số reaction như tương tác mới.

Đối với Reaction gỡ đi, action undo (nếu UI có) là tạo trạng thái active lại theo quyền hiện tại, không nhất thiết đưa Reaction vào Trash cùng cách Comment. Chính sách retention audit lâu dài là open issue; không tự coi mỗi click gỡ reaction như permanent delete ngay và ngược lại.

## 13.3. Audit trail và quyền tác giả

Bản audit tối thiểu cần `interaction target`, `actor`, `action`, `timestamp`, `previous/current revision or state`, `result`, và thông tin đủ để truy vết lỗi/double submit. Không chia sẻ body đã xóa hoặc sửa cũ cho bất kỳ người đọc nào chỉ vì họ có quyền đọc version hiện tại. Quy tắc về support/admin audit được chốt tại M10.

## 13.4. Export

Một cá nhân chỉ xuất Comment/Reaction/Activity mà mình có quyền xem và xuất theo policies liên quan. **Không xuất** bản Comment đã xóa vốn không được đọc ở current state, title secret targets, thông tin tài chính Private, ảnh/Media gốc ngoài quyền. Export giữ stable source references và thread structure cho dữ liệu hợp lệ, nhưng có thể biểu thị inaccessible link bằng placeholder mà không kèm private metadata. Tách export và backup: backup vận hành có mục đích phục hồi toàn vẹn, không là đường tải về bypass quyền cho từng user.

## 13.5. Quy trình phục hồi sau sự cố

Restore phải tái tạo association source IDs, parent/root references, stable author IDs, reaction uniqueness, per-target policy, notification preferences (nếu shared config), audit revision và soft deletion states. Khi target source đã bị xóa/đổi chủ thể, M09 không được âm thầm tự tạo một target giả hoặc gắn Comment vào source khác có trùng title. Khôi phục có thể có dangling reference được giữ cho audit nhưng không được hiển thị như đối tượng có quyền.

# 14. Yêu cầu phi chức năng và tiêu chuẩn an toàn

| NFR | Yêu cầu nghiệp vụ | Ghi chú khi kỹ thuật hóa |
| --- | --- | --- |
| NFR-01 Correctness | Reaction active uniqueness trên `(actor,target)` | Có test concurrent/retry |
| NFR-02 Reliability | Comment không mất khi hai người thêm đồng thời | Mutation atomic/consistent là mục tiêu, không chỉ UI |
| NFR-03 Idempotency | Retry create/react/notification không nhân bản | Correlation/idempotency design later |
| NFR-04 Authorization | Source policy là quyền tối đa | Revalidate every mutation/read and direct link |
| NFR-05 Privacy | Counters, previews, search, feed, export không leak | Negative tests M01–M08 |
| NFR-06 Latency | UI responsive ở mạng/thiết bị mục tiêu | SLA cụ thể chưa chốt; cần budget test trước build |
| NFR-07 Pagination | Nhiều comments/threads/feed không làm UI quá tải | Limit/cursor kỹ thuật chốt sau |
| NFR-08 Accessibility | Keyboard, screen reader, labels/contrast, touch | Equal mobile/desktop capability |
| NFR-09 Auditability | Truy được ai edit/delete khi được phép | Không expose deleted body trái quyền |
| NFR-10 Recovery | Backup/restore giữ referential integrity | Cross-module source may no longer exist |
| NFR-11 Notifications | Notify theo preferences/permission | Channel failure ≠ interaction failure |
| NFR-12 Input Safety | Sanitize links/text, no script injection | No arbitrary HTML execution |
| NFR-13 Locale | Tiếng Việt, Unicode, emoji và thời gian local | Timestamp source truth; labels localized |
| NFR-14 Security | Không tin cached ACL, client-only gate | Secret/capsule resolver trên trusted backend |
| NFR-15 Deletion | 30-day Trash, data-rights policy M10 | Restore đúng quyền, no resurrection |
| NFR-16 Maintainability | Single reusable component contract | Không tự copy M09 logic vào 8 modules |

**Đo hiệu năng:** Chưa tự cam kết một số ms/SLA, số lượng comment tối đa hoặc rate limit tùy tiện. Giai đoạn thiết kế kỹ thuật cần tạo các performance budgets dựa vào dữ liệu mục tiêu, kiểm thử trên mobile mạng yếu và desktop, cùng số lượng comment/reaction tăng nhiều. Test phải luôn gồm trường hợp đối tượng source bị đổi ACL trong lúc request/notification chờ.

# 15. Kịch bản QA tổng hợp — E2E và kiểm thử bảo mật

Mỗi kịch bản dưới đây kết hợp nhiều Acceptance Criteria. Không có dữ liệu thật; sử dụng fixture A/B với ACL được xác định rõ, dữ liệu ghi thật ở môi trường test hoặc tương đương. **Không giả định B có quyền chỉ vì cùng Project Private.**

| Case | Tên kiểm thử | Thao tác / mục tiêu | Trace AC/BR |
| --- | --- | --- | --- |
| QA-01 | Two-person reaction replacement | A reacts Love→Haha→remove to Shared M08 Moment; verify one active and counts. | AC-01–05,09–10; BR-01–10 |
| QA-02 | Concurrent reaction update | A on two devices toggles different emoji at nearly same time; ensure deterministic one active. | AC-03–05,65 |
| QA-03 | Private Diary blocked | A has Private M01 Diary, B guesses direct Comment URL; deny even metadata/count. | AC-02,45,49 |
| QA-04 | Photobook page reorder | B comments on Page P, A reorders; Comment remains P, not old page number. | AC-22–23 |
| QA-05 | Media re-use | Same M02 asset in album and M01 Book; threads distinct by target. | AC-24,57 |
| QA-06 | Empty/duplicate comment | Whitespace rejected, double send retried under flaky network; one Comment. | AC-11–14,59 |
| QA-07 | Two-level thread | A root, B reply, A reply-to-reply; render two levels. | AC-15–16 |
| QA-08 | Deleted root with reply | A delete root after B replied; tombstone remains, B content preserved. | AC-19–21 |
| QA-09 | Concurrent edit/delete | Two A devices send edit and delete; reject stale and no resurrection. | AC-17,30,65 |
| QA-10 | Partner mention blocked | @B in A Private Trip; do not notify; no access grant. | AC-31–33 |
| QA-11 | Reaction notification coalescing | A toggles Love/Haha repeatedly; B sees at most logically coalesced alert. | AC-35–36 |
| QA-12 | Notification read isolation | A reads mention notification about M08 Letter; Letter Opened remains unchanged. | AC-37 |
| QA-13 | Notification permission revoked | B has old notification, A makes target Private; B clicks and cannot view. | AC-38–39,46–47 |
| QA-14 | Interaction modes matrix | Test Both/ReactOnly/CommentOnly/ReadOnly under source allows and source denies. | AC-41–46 |
| QA-15 | Secret Surprise leak sweep | B visits Homepage, Feed, Search, notifications, counters, URL before reveal. | AC-40,48–49,51,53 |
| QA-16 | Sealed Capsule lock | Try reacting before unlock from list, link, search and direct request; deny. | AC-09,40 |
| QA-17 | Delivered Love Letter | B can react after Delivered; before Delivered cannot. Notification read not Letter Opened. | AC-29,37 |
| QA-18 | M03 Visit vs Review | B comments “5 sao”; M03 review count/state unchanged. | AC-25 |
| QA-19 | M05 RSVP isolation | Comment “tớ đi” on Event; RSVP remains No Response. | AC-26 |
| QA-20 | M06 Goal isolation | Celebrate Completed Goal without changing progress/confirmation. | AC-27 |
| QA-21 | M07 financial approval isolation | Comment “đồng ý” on Expense; Approval stays Pending, Settlement unaffected. | AC-28,50 |
| QA-22 | Feed revoked mid-pagination | B opens Feed page 1, A revokes source, B fetches next and opens link; no leak. | AC-51–53 |
| QA-23 | Trash/restore privileges | A deletes then restores Comment within 30 days; B without source access sees none. | AC-54–55 |
| QA-24 | Export/backup references | Export scoped comments only; restore holds ID, root, author, revision; no orphan visibility. | AC-56–58 |
| QA-25 | Mobile/desktop parity | Create/edit/delete comment, reaction, mention, search and feed on phone and desktop. | AC-61–65 |

## 15.1. Test data khuyến nghị

- A owner Shared Photobook Book có 3 pages; reorder giữa P1/P2; B được comment ở Page nhưng không có quyền với một Media Asset bên trong.
- A Private Diary, B không có ACL; B cố mở URL đã ghi nhớ, tìm Comment, xem notification cũ.
- M03 Place with 2 Visits; mỗi Visit có Review riêng; có Comment ở Place và Visit.
- M04 Trip với Activity đổi ngày/copy; cả source archived/cancelled/private permutations.
- M05 Event với RSVP No Response; Comment contains “Going” but source state unchanged.
- M06 Goal Active chưa Confirmed; Reaction Celebrate không được thay `GoalCompletion`.
- M07 Expense Pending Approval, có Private receipt, có comments; kiểm tra không xuất số tiền/receipt trái quyền.
- M08 Secret Surprise trước reveal; Sealed Capsule trước unlock; Delivered vs Scheduled Letter. Kiểm thử counters, autocomplete, notification, search, export.
- Comment thread với root có 10+ replies, một comment Edited 3 revisions, một tombstone, một orphaned source reference phục vụ audit.
- Mạng mất sau request đã lưu nhưng client chưa nhận response; duplicate retried; server must reconcile not double-count.

## 15.2. Audit of acceptance coverage

Mỗi test AC cần có chủ thể A/B, trạng thái nguồn và quyền, action, expected state, expected UI và expected negative. Không ghi “đã pass” khi mới có BRD. QA phải xác minh trên dữ liệu được kiểm tra, logs phù hợp quyền và hành vi trên cả mobile/desktop.

# 16. Traceability Matrix: D01–D24 đến tính năng, quy tắc, nghiệm thu

Một quyết định có thể ảnh hưởng nhiều rule/AC. Ma trận dưới ưu tiên link chính; triển khai QA cần tiếp tục kiểm thử tương tác liên module như mục 15.

| Decision | Affected UI | Business Rules | Acceptance Tests | Điểm nghiệm thu |
| --- | --- | --- | --- | --- |
| D01 | CI-01/CI-08 | BR-11/50/54 | AC-11/26–29 | Chỉ interaction có target; không chat |
| D02 | CI-01/CI-13 | BR-01/05/11/44 | AC-01/11/22–29 | Ma trận source M01–M08 |
| D03 | CI-02 | BR-01/03 | AC-01–05 | 6 reaction types P0 |
| D04 | CI-02 | BR-02–04/08 | AC-03–05 | 1 active per actor-target |
| D05 | CI-03 | BR-11–14 | AC-11–14 | Text/emoji/multiline/sanitized link |
| D06 | CI-04/CI-05 | BR-15/16/21 | AC-15/16/20 | 2-level thread |
| D07 | CI-06/CI-12 | BR-17–19 | AC-17/18 | Edited marker + revisions |
| D08 | CI-06/CI-14 | BR-20–22 | AC-19–21/54–55 | Soft delete + valid replies |
| D09 | CI-07 | BR-26–30 | AC-31–33 | Mention eligible user only |
| D10 | CI-08 | BR-31–35 | AC-51–53 | ACL-filtered activity feed |
| D11 | CI-09 | BR-36–43 | AC-34–40 | In-app P0 |
| D12 | CI-10 | BR-40 | AC-35 | User preferences |
| D13 | CI-09 | BR-39 | AC-36 | Reaction spam coalescing |
| D14 | CI-13/CI-15 | BR-44–47 | AC-41–45 | Interaction modes |
| D15 | CI-01/CI-13 | BR-05/12/44/45 | AC-02/45–50 | Source ACL is ceiling |
| D16 | CI-01 | BR-50–53 | AC-22/23 | Stable Book/Page/Diary IDs |
| D17 | CI-01 | BR-51/55 | AC-24 | Media vs Album separation |
| D18 | CI-01 | BR-49/54 | AC-25–27 | No Review/RSVP/Goal completion |
| D19 | CI-01 | BR-25/49/54 | AC-28/50 | No financial approvals |
| D20 | CI-01/CI-09 | BR-09/38/48 | AC-09/29/40/48 | M08 Reveal ACL |
| D21 | CI-11 | BR-22/31/53 | AC-21/49 | Search ACL |
| D22 | CI-06/CI-12/CI-14 | BR-18/20–22/53 | AC-54–58 | History/Trash/Restore/Export |
| D23 | CI-02/CI-03/CI-06 | BR-08/23/24 | AC-05/14/30/65 | Concurrency/no duplicate |
| D24 | CI-01–CI-15 | BR-11/23/44 | AC-61–65 | Mobile/desktop parity |

# 17. Phạm vi P0/P1/P2 và tiến trình triển khai

## 17.1. P0 — đủ dùng trong bản Our Space V1.0

1. Component Reaction/Comment/Reply/Mention gắn nguồn M01–M08, hỗ trợ A/B và quyền từng đối tượng.
2. Sáu Reaction, một active trên target, có đổi/gỡ, counters theo permission.
3. Comment text an toàn + emoji + multiline + sanitized link, Reply 2 tầng, edit with history, delete tombstone + valid replies.
4. Interaction Settings `Both`, `Reactions Only`, `Comments Only`, `Read Only`, intersection source capability.
5. Activity Feed, in-app notifications, per-type notification preferences và coalescing.
6. Security/privacy cho direct URL/search/feed/export/notifications/counters, đặc biệt M07 private financial data và M08 secret/sealed.
7. Cross-module target identity ổn định; không đồng nhất comment/reaction với business approval.
8. Version/duplicate protection, failures, Trash 30 ngày, restore, audit/export/backup theo quyền.
9. Desktop/mobile feature parity và bộ Acceptance Criteria `AC-M09-01–65`.

## 17.2. P1 — mở rộng sau V1.0

Sticker/GIF; đính kèm ảnh/video M02 vào Comment; emoji reaction tùy biến; pin Comment; vị trí bình luận cụ thể trong ảnh; vùng/layer Page M01; Search nâng cao và lọc feed nâng cao; Email/Push với hạ tầng M10; thống kê tương tác theo quyền nếu hai người thực sự cần. P1 không được chặn P0 core.

## 17.3. P2 — có điều kiện, không tự triển khai

AI suggestions/reply summarization theo chủ động của người dùng; mini-games/interactions đặc biệt; full chat chỉ nếu yêu cầu mới được phê duyệt, phải tách nghiệp vụ chat độc lập ra khỏi M09 object threads; không tự thêm giao tiếp bên ngoài hoặc mạng xã hội.

## 17.4. Thứ tự công việc Codex khuyến nghị ở mức logic

- Bước 1: xác định contract source identity + resolver của M01–M08, ACL test fixtures, các source lifecycle events.
- Bước 2: định nghĩa entities và những bất biến mutation (one-active-reaction, comment author, two-level reply, soft delete, idempotency/version checks).
- Bước 3: xây shared UX components embedded và responsive parity; không copy riêng vào từng module.
- Bước 4: dựng feed/search/read/notification theo source ACL hiện tại và preference.
- Bước 5: test security negative matrix, especially M08/M07; restore/export; concurrent edits, network retries.
- Bước 6: chỉ đánh dấu M09 P0 done khi tất cả AC P0 pass; giữ P1/P2 trong backlog.

Trình tự trên là **phụ thuộc nghiệp vụ để chia workstream**, không lựa chọn stack hay thiết kế API mang tính bắt buộc.

# 18. Definition of Done — M09

M09 được coi là hoàn thành P0 chỉ khi:

- [ ] D01–D24 được đối chiếu với chức năng và tests, không còn quyết định phê duyệt bị tự sửa.
- [ ] CI-01–CI-15 có UX states đủ happy, empty, denied, pending, failed, retry, revoked, mobile và desktop.
- [ ] ENT-M09-01–20 có conceptual mapping/contract data rõ, không có duplicate source of truth.
- [ ] BR-M09-01–55 được triển khai hoặc có bằng chứng thiết kế tương đương; đặc biệt source ACL ceiling, no accidental approval.
- [ ] UC-M09-01–18 chạy được trên fixture A/B, có error paths.
- [ ] EX-M09-01–40 có handling đo được, không rò rỉ source.
- [ ] AC-M09-01–65 có kết quả kiểm thử thực tế, không chỉ check UI screenshot.
- [ ] Reaction đúng 6 loại; tối đa 1 active mỗi actor/target; thay/gỡ/retry không tạo trùng.
- [ ] Comment/Reply 2 cấp hiển thị, edited marker, soft delete, tombstone giữ reply hợp lệ.
- [ ] Mention chỉ tới người có quyền, không cấp quyền, không gửi trùng.
- [ ] Activity Feed, Search, counters và Notification không tiết lộ Private/Secret/Sealed.
- [ ] Interaction mode không nâng quyền nguồn, và thu hồi quyền có hiệu lực trên request mới.
- [ ] M01 stable Page ID, M02 asset-vs-placement, M03 Review, M05 RSVP, M06 Goal, M07 Approval, M08 Reveal đều được kiểm chứng.
- [ ] Comment/Reaction không bị báo lưu thành công giả khi mạng lỗi và không mất bản ghi độc lập khi xử lý đồng thời.
- [ ] History, Trash 30 ngày, Restore/Export/Backup bảo toàn tác giả, nguồn, thread, quyền và deletion states.
- [ ] Notification read không thay M08 Letter/Capsule Opened; notification failure không rollback interaction chính thức.
- [ ] Mobile/desktop có cùng nghiệp vụ P0, gồm keyboard/touch/screen-reader relevant flows.
- [ ] Những vấn đề M10 hoặc kỹ thuật chưa chốt được ghi nhận rõ, không bị Codex âm thầm chọn chính sách rủi ro.
- [ ] P0 toàn bộ M01–M10 vẫn là tiêu chuẩn trước ngày phát hành chính thức Our Space V1.0.

## 18.1. Không chấp nhận hoàn thành giả

Không đánh dấu Done nếu chỉ có frontend icon mà source ACL không được bảo vệ; nếu reaction count hiển thị nhưng race tạo 2 records; nếu Delete chỉ ẩn CSS nhưng Search còn body; nếu Notification Center hiển thị tên Secret Surprise; nếu Comment “đồng ý” vô tình cập nhật nợ M07; hoặc nếu tests P0 chưa được chạy trên cả hai thiết bị/kích thước chính. BRD không tự thay thế triển khai hoặc nghiệm thu thực tế.

# 19. Open Issues / quyết định kỹ thuật không thuộc phạm vi duyệt M09

| Mã | Vấn đề còn mở | Vì sao chưa tự chốt | Đầu mối |
| --- | --- | --- | --- |
| OI-M09-01 | Framework, database, queue, source resolver implementation | BRD độc lập công nghệ | Architecture |
| OI-M09-02 | Notification coalescing time threshold | Chưa có ngưỡng đã duyệt; tránh spam mà không mất thông báo quan trọng | Architecture + M10 |
| OI-M09-03 | SLA gửi in-app alerts/latency budgets | Phụ thuộc hạ tầng; cần test thay vì đoán | NFR design |
| OI-M09-04 | Max Comment length, rate limit, page size | Chưa xác nhận giới hạn; không cắt text hợp lệ tùy tiện | NFR/UX |
| OI-M09-05 | Full-text indexing/search technology | Cần chống leak từ index | Architecture |
| OI-M09-06 | Local draft/offline strategy | Web storage/privacy/account sharing policy chưa duyệt | M10 + Architecture |
| OI-M09-07 | Source M05 recurring occurrence target granularity | Series ID vs occurrence ID cần M05 contract cụ thể | M05 ↔ M09 |
| OI-M09-08 | Deleted comment permanent erasure vs thread tombstone | Phải tuân thủ deletion policy M10; không giữ body vô thời hạn | M10 |
| OI-M09-09 | Audit log availability/support role | Product Owner chưa duyệt support/admin scope | M10 |
| OI-M09-10 | Account leaving/deactivation and author attribution | Ảnh hưởng comment lưu chung/khả năng xóa | M10 |
| OI-M09-11 | Push/Email notification providers | P1 và còn phụ thuộc thiết bị/quyền | M10/P1 |
| OI-M09-12 | Moderation of abusive interactions | Sản phẩm riêng 2 tài khoản, không phát minh policy public social | M10 |
| OI-M09-13 | Automated backups and exact retention for audit | 30-day Trash đã chốt, backup policy toàn hệ thống còn mở | M10/Architecture |
| OI-M09-14 | Data migration cross-module identities | Stable IDs là bắt buộc, kỹ thuật migration còn mở | Architecture |

**Quy tắc xử lý open issues:** Không biến OI thành giả định không ghi chú; không được thay đổi quyết định D01–D24 hoặc hạ mức bảo vệ của M08/M07 để đơn giản hóa triển khai. Khi thật sự cần đổi BRD sau duyệt, tạo version amendment có tác động/truy vết và cần duyệt theo quy trình dự án.

# 20. Checklist chuyển giao Codex & trạng thái dự án

## 20.1. Checklist files và phụ thuộc

- [x] BRD M01–M08 là nguồn contract của modules đã được duyệt trước M09.
- [x] M09 đã có **24 quyết định được chốt**, thiết kế 15 giao diện, 20 đối tượng, 55 rules, 18 UCs, 40 exceptions và 65 ACs.
- [ ] M10 — Personalization, Accounts & Settings chưa được đặc tả và phê duyệt; cần chốt trước khi thiết kế quyền chung/notifications/data deletion architecture cuối.
- [ ] V1.0 chưa được lập trình và nghiệm thu; BRD này không chứng minh ứng dụng đã chạy.

## 20.2. Vị trí trong `OurSpace/Docs/`

```text
OurSpace/
└── Docs/
    ├── OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md
    ├── OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md
    ├── OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md
    ├── OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md
    ├── OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md
    ├── OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md
    ├── OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md
    ├── OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md
    └── OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md
```

## 20.3. Chuyển tiếp

**Trạng thái: M09 APPROVED, M10 NEXT.** Chưa sinh code hoặc hoàn thiện sản phẩm. Bước tiếp theo là thảo luận **M10 — Personalization, Accounts & Settings**, bao gồm bảo mật đăng nhập, tài khoản cặp đôi, quyền theo nội dung, thông báo chung, tùy chọn cá nhân và dữ liệu khi đóng/chuyển trạng thái mối liên kết. Chỉ sau khi bạn duyệt M10 mới xuất BRD M10; sau đó tổng hợp các contract và xây architecture/implementation plan cho Codex theo nguyên tắc P0 của đủ 10 phân hệ.

---

**Kết thúc BRD M09 — V1.0 | Phê duyệt nghiệp vụ: 22/10/2026 | Implementation: NOT STARTED.**
