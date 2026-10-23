---
document_id: OURSPACE-M10-BRD
project: Our Space
module_id: M10
module_name: Personalization, Accounts & Settings
version: 1.0
status: APPROVED_BUSINESS_REQUIREMENTS__IMPLEMENTATION_NOT_STARTED
language: vi-VN
approved_on: 2026-10-23
file_name: OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md
intended_audience: [Product Owner, UX Designer, Security Reviewer, Codex, Developer, QA]
related_documents:
  - OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md
  - OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md
  - OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md
  - OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md
  - OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md
  - OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md
  - OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md
  - OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md
  - OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md
next_phase: Cross-BRD Consistency Review and System Architecture
---

# OUR SPACE — M10: PERSONALIZATION, ACCOUNTS & SETTINGS
## Business Requirements & Functional Specification — V1.0

> **ĐÃ DUYỆT NGHIỆP VỤ:** Chủ dự án phê duyệt toàn bộ đề xuất M10 ngày **23/10/2026**. D01–D40 là lựa chọn chính thức cho M10 V1.0. **Chưa viết code, chưa chốt công nghệ, database, API, nhà cung cấp đăng nhập/backup/notification hoặc kiến trúc mã hóa.**
>
> **Yêu cầu bao phủ:** 40 quyết định D01–D40; 24 màn hình ST-01–ST-24; 34 đối tượng ENT-M10-01–34; 95 Business Rules BR-M10-01–95; 24 Use Cases UC-M10-01–24; 50 ngoại lệ EX-M10-01–50; 90 Acceptance Criteria AC-M10-01–90; các hợp đồng liên phân hệ và kiểm thử end-to-end.
>
> **Các nguyên tắc không thể bỏ qua:** Hai tài khoản **độc lập**; tối đa hai active members/Space; Pairing có consent hai chiều; **Private by default**; role Space không phải master key truy cập dữ liệu riêng; quyền nguồn + quyền tài nguyên liên kết + điều kiện thời gian cùng quyết định quyền thực tế; notification không quyết định sự kiện nghiệp vụ; **Disconnect ≠ Delete**; user có thể Disconnect đơn phương nhưng không thể cascade-delete dữ liệu Partner; Time Capsule Sealed không bị sửa `unlock_at`/snapshot bởi Disconnect — **chỉ trạng thái reveal/delivery chưa trao bị tạm dừng theo D35**; backup khôi phục đầy đủ liên kết và quyền; toàn bộ P0 của M01–M10 cần hoạt động trước V1.0.

---

# 1. Tầm nhìn, phạm vi và nguyên tắc sản phẩm

## 1.1. Nhiệm vụ

M10 là nền tảng quản trị tài khoản, Couple Space, effective permission, hồ sơ, cá nhân hóa, notification, storage, export, backup, recovery và vòng đời tài khoản cho Our Space. Đây **không** phải tài khoản mạng xã hội công khai, cũng không phải hệ thống cho một Partner quản trị mọi dữ liệu của Partner còn lại. M10 cần làm rõ **ai được thực hiện hành động nào trên nguồn dữ liệu nào, trong trạng thái nào, tại thời điểm nào**, với kết quả kiểm chứng được.

## 1.2. Ranh giới nghiệp vụ

- **Trong phạm vi P0:** hai user accounts, pairing hai chiều, email/password + verification, session management, optional TOTP MFA, recovery, user/couple profile, global effective ACL & inspector, individual visual/a11y/locale settings, central in-app notifications, storage summaries đúng quyền, exports, backups và restore workflows, Trash Center, disconnect/deactivate/delete/reconnect, security activity và device parity.
- **P1:** OAuth Google/Apple, ngôn ngữ tiếng Anh, Email/Push, theme/import/observability mở rộng, phương thức MFA hoặc công cụ đối soát nâng cao.
- **P2:** không gian >2 thành viên, nhiều Space Active/tài khoản, AI và chia sẻ bên ngoài nếu đổi scope về sau.
- **Không thuộc nghiệp vụ đã duyệt:** mặc nhiên chia sẻ mật khẩu, admin Space đọc mọi Private, buộc Partner phải đồng ý mới được Disconnect, lập trình banking, giao tiếp công cộng, thay đổi chính sách dữ liệu đã Seal bằng tùy tiện kỹ thuật, cam kết E2EE khi chưa có thiết kế và kiểm chứng.

## 1.3. Quy ước thuật ngữ

| Khái niệm | Định nghĩa đã chốt |
|---|---|
| User Account | Danh tính độc lập, sở hữu xác thực và cài đặt cá nhân, không bị đồng nhất với Couple Space. |
| Couple Space | Không gian liên kết tối đa hai tài khoản active và những nguồn shared có quyền. |
| Pairing | Quy trình mời và xác nhận hai chiều để kích hoạt liên kết. |
| Owner / Editor / Contributor / Commenter / Viewer | Vai trò ở mức đối tượng, không tự cấp quyền domain-specific ngoài phạm vi. |
| Private | Mặc định chỉ chủ sở hữu và những tác nhân hệ thống có quyền vận hành tối thiểu theo chính sách; Partner không được quyền xem. |
| Shared | Nội dung được cấp quyền rõ ràng cho người còn lại trong một phạm vi cụ thể. |
| Effective Access | Kết quả kiểm tra tư cách tài khoản + session + Space + source ACL + linked resource ACL + capability + trạng thái + reveal/time. |
| Scheduled Reveal | Việc mở quyền truy cập có điều kiện, khác gửi Notification và khác việc người nhận đã mở nội dung. |
| System Restore | Phục hồi nhiều tài nguyên liên hệ sau sự cố, phải có ủy quyền và kiểm tra toàn vẹn. |
| Item Restore | Khôi phục một đối tượng đã xóa mềm trong thời hạn hợp lệ. |
| Disconnect | Kết thúc liên kết và cộng tác mới, không đồng nghĩa xóa tài khoản hay mọi dữ liệu chung. |
| Account Deletion | Quy trình riêng yêu cầu xác minh, đánh giá quyền, retention và bảo toàn dữ liệu Partner. |

## 1.4. Thứ tự ưu tiên khi quyền giao nhau

Đầu ra `allow` chỉ có khi **tất cả điều kiện bắt buộc cùng đạt**: (i) phiên và account hợp lệ; (ii) trạng thái Space hợp lệ đối với hành động; (iii) quyền target source; (iv) quyền linked media/document khi cần trình bày; (v) quyền theo loại thao tác; (vi) chủ thể phải xác nhận (RSVP/Settlement/Completion/Seal…); (vii) thời gian và trạng thái Sealed/Secret/Deleted. `Shared` không ghi đè một điều kiện `deny`. Quyền có thể bị thu hồi trong khi tab đang mở; request tiếp theo phải kiểm tra lại.

## 1.5. Không quyết định kỹ thuật thay Codex

Các thông số session TTL, rate limits, password policy chi tiết, secret rotation, encryption at rest, backup interval/RPO/RTO, API/event contracts và giới hạn lưu trữ cần được quyết định có kiểm chứng ở **Architecture & Security Review**. M10 đặt bất biến và kết quả nghiệm thu; không giả định một hệ thống bảo mật cụ thể đã tồn tại.

# 2. Quyết định nghiệp vụ đã chốt — D01–D40

Toàn bộ 40 quyết định bên dưới **đã được duyệt**, không đánh dấu Open/Optional trừ đúng khả năng tùy chọn mà quyết định nêu. Không đổi D35 thành cơ chế tự trao sau Disconnect mà không có change control.

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

## 2.1. Hệ quả triển khai của các nhóm quyết định

- **D01–D08 — quan hệ hai tài khoản:** không share credentials, không tạo Space thứ hai qua race condition, không retroactively expose Private. Việc thay Display Name/Couple Theme không thay quyền truy cập hoặc author attribution.
- **D09–D12 — xác thực:** có hard boundary giữa Account A và B; MFA là tùy chọn P0 với recovery, không được tạo master-partner override. Sessions revoked phải chặn request mới kể cả thiết bị chưa reload UI.
- **D13–D18 — quyền:** không dùng boolean `isShared` duy nhất thay server-side ACL; snapshot/cached permission không được quyết định quyền ở request mới; domain consents không nhập nhằng với role Editor.
- **D19–D25 — trải nghiệm:** M01 scrapbook không lan sang mọi màn; user-specific UI/locale và accessibility không đổi nguồn dữ liệu; homepage theo quyền.
- **D26–D29 — thông báo:** central inbox, in-app P0; quiet hours là delivery preference, không dời business timestamps; đọc notification không đồng nghĩa mở Letter/Capsule.
- **D30–D32 — lưu giữ:** Export đọc được bị giới hạn, Backup dùng để phục hồi nhưng không có quyền bypass Time Capsule; Item Restore 30 ngày theo domain policy; full System Restore phải có quy trình được ủy quyền.
- **D33–D39 — lifecycle:** Disconnect đơn phương nhưng không phá dữ liệu Partner; 30 ngày xử lý dữ liệu Shared, trạng thái read-only; nội dung chưa reveal bị tạm dừng, không thay sealed manifest/unlock timestamp; Delete/Reconnect có consent và audit; không tuyên bố E2EE.
- **D40:** không có P0 chức năng nào chỉ dành cho desktop; mobile phải thực hiện được với cùng quyền và kết quả.

# 3. Trạng thái tài khoản, Pairing và Couple Space

## 3.1. User Account và session states

`Pending Verification → Active → Deactivated → Active (sau phục hồi hợp lệ)`; `Active/Deactivated → Deletion Requested → Deletion Processing → Deleted` theo quy trình có kiểm chứng. `Deleted` chỉ được thông báo khi thực sự hoàn tất phạm vi đã duyệt, không chỉ vì request đã được xếp hàng. Account inactive không mặc nhiên mất quyền sở hữu dữ liệu hoặc trao quyền cho Partner.

Session gồm `Active`, `Expired`, `Revoked`. Trạng thái thay đổi do đăng xuất/thu hồi/timeout/security policy; những yêu cầu mới từ `Expired/Revoked` không được tiếp tục được ủy quyền.

## 3.2. Invitation state machine

`Created → Pending → Accepted by B → Awaiting A Confirmation → Consumed/Paired`, hoặc `Pending → Rejected / Revoked / Expired`. Quy tắc atomic: chỉ một transition cuối hợp lệ khi Accept và Revoke cùng xảy ra. Token đã Consumed/Revoked/Expired không thể tái sử dụng.

## 3.3. Couple Space lifecycle

`Unpaired → Pending Invitation → Active → Disconnecting → Frozen (read-only processing) → Archived/Closed`. Một người có thể bắt đầu Disconnect mà không có sự đồng thuận hoặc sự tham gia bắt buộc của Partner. `Frozen` cần chặn collaborative writes, nhưng cho phép những thao tác read/export/rectification đúng quyền đã được định nghĩa. Thời hạn xử lý sau Disconnect mặc định **30 ngày** theo D34; không phải thời gian chờ để quyền Disconnect có hiệu lực.

## 3.4. Reconnect

Reconnect yêu cầu **consent mới từ cả hai**, xác định rõ phục hồi quan hệ Space trước hay tạo Space mới theo chính sách xử lý dữ liệu. Không tự kích hoạt phiên/notification/permission/calendar share trước Disconnect. Nếu truy cập cũ đã mất, quyền sau Reconnect phải do quy trình xác nhận mới thiết lập; không hồi sinh token cũ.

## 3.5. Business invariants khi chạy đồng thời

- `active_members(space) <= 2`; `active_space_count(user) <= 1` tại mọi điểm giao dịch.
- Không bao giờ nhận hai kết quả `Paired` và `Revoked` cùng hiệu lực cho một lời mời.
- Quyền của người vừa Disconnect phải bị kiểm tra lại trước khi ghi Shared Goal, Comment, Settlement hoặc thay đổi Capsule.
- Tác vụ ở hàng đợi (notification, scheduler, export, restore) phải kiểm tra trạng thái chính thức mới nhất khi thực hiện; không dựa vào snapshot quyền cũ để mở dữ liệu.

## 3.6. Luồng tình huống Pairing có thể kiểm thử

1. A tạo lời mời mã ngẫu nhiên khó đoán, TTL mặc định 48 giờ; A có thể thu hồi.
2. B có account riêng và email verified; B xem đúng danh tính A trước khi Accept.
3. A xác nhận đúng tài khoản B, không chỉ xác nhận một click vào link bị rò rỉ.
4. Tại điểm commit, xác nhận cả A/B không có active membership nơi khác và token còn hiệu lực.
5. Chỉ tạo **một** active Space; mọi Private trước/sau Pairing vẫn Private nếu chủ thể chưa share.
6. Không chấp nhận cached invite link, token replay hoặc invitation bị revoke sau khi tab còn mở.

# 4. Mô hình dữ liệu khái niệm — 34 thực thể

Mô hình dưới đây mô tả trách nhiệm nghiệp vụ, không áp đặt số bảng hoặc lựa chọn ORM. `Permission Grant` và `Conditional Access` có thể nằm ở hạ tầng dùng chung, nhưng vẫn cần xuất hiện trong contract và QA trace. Dữ liệu xác thực bí mật chỉ tham chiếu qua kho/biện pháp bảo vệ được thiết kế kỹ thuật duyệt; không log giá trị đọc được.

| Mã | Đối tượng | Thuộc tính tối thiểu ở mức BRD | Bất biến/quyền |
|---|---|---|---|
| ENT-M10-01 | User Account | user_id, status, created_at | Danh tính bền vững, không phụ thuộc display name hoặc Space. |
| ENT-M10-02 | User Profile | user_id, display_name, avatar_ref, nickname, birthday, bio | Trường optional và field-level privacy. |
| ENT-M10-03 | Couple Space | space_id, state, created_at, closure_at | Một Space Active tối đa hai thành viên. |
| ENT-M10-04 | Couple Membership | space_id, user_id, state, joined_at, left_at | Một active membership/active Space mỗi tài khoản. |
| ENT-M10-05 | Pairing Invitation | invitation_id, creator_id, expires_at, state, token_ref | Không lưu token mời ở log đọc được. |
| ENT-M10-06 | Pairing Confirmation | invitation_id, actor_id, approval_state, timestamp | Cả hai đồng ý trước Active. |
| ENT-M10-07 | Couple Profile | space_id, title, cover_ref, theme_ref, version | Không trùng nguồn anniversary của M05. |
| ENT-M10-08 | Authentication Identity | user_id, email_norm, verified, auth_method | Tách profile công khai với định danh đăng nhập. |
| ENT-M10-09 | Email Verification | request_id, identity_id, expiry, consumed | Link 1 lần có thời hạn. |
| ENT-M10-10 | Password Reset Request | reset_id, user_id, expires_at, consumed | Không lưu plaintext secret. |
| ENT-M10-11 | MFA Enrollment | user_id, factor_type, status, enrolled_at | TOTP tùy chọn và step-up. |
| ENT-M10-12 | Recovery Credential | user_id, credential_ref, status | Không hiện lại plaintext recovery code. |
| ENT-M10-13 | User Session | session_id, user_id, created_at, last_seen, state | Revoked session không tiếp tục truy cập. |
| ENT-M10-14 | Session Revocation | session_id, actor_id, timestamp, reason | Có audit nhưng không lộ token. |
| ENT-M10-15 | Account Security Event | event_id, user_id, type, timestamp | Redacted and scoped to own user. |
| ENT-M10-16 | Permission Grant | resource_ref, principal_id, capability, expiry/state | Permission riêng theo đối tượng. |
| ENT-M10-17 | Role Definition | role_name, supported_actions, scope | Không đồng nhất role với business consent. |
| ENT-M10-18 | Resource Permission Context | resource_ref, domain, effective_policy | Cần kiểm tra source, related resource, state. |
| ENT-M10-19 | Conditional Access Rule | resource_ref, recipient, reveal_at, condition | Dùng cho Secret/Sealed and time-bound access. |
| ENT-M10-20 | User Preference | user_id, key, value, modified_at | Từng tài khoản độc lập. |
| ENT-M10-21 | Couple Theme Preference | space_id, accent, cover, preference_version | Không lấn accessibility. |
| ENT-M10-22 | Accessibility Preference | user_id, reduced_motion, font_scale, keyboard | No animation gate for critical action. |
| ENT-M10-23 | Locale Preference | user_id, language, timezone, date_format, hour_cycle | Display only, preserve canonical time. |
| ENT-M10-24 | Notification | notification_id, source_ref, recipient, category, state | No source content copy outside visibility. |
| ENT-M10-25 | Notification Preference | user_id, category, enabled, channels, quiet_hours | Account-scoped defaults. |
| ENT-M10-26 | Notification Delivery | notification_id, channel, attempt, result | Cannot claim device viewed based on send. |
| ENT-M10-27 | Notification Read State | notification_id, recipient, read_at, hidden | Distinct from Letter/Capsule read state. |
| ENT-M10-28 | Storage Summary | owner_scope, category, computed_at, count/size | Aggregate must not leak partner Private. |
| ENT-M10-29 | Data Export Request | request_id, user_id, scope, state, artifact_ref, expiry | Authorization and download expiry. |
| ENT-M10-30 | Backup Manifest | backup_id, coverage, integrity_status, checkpoint | Required resource links and snapshot states. |
| ENT-M10-31 | Restore Operation | operation_id, scope, actor, state, verification_result | No unauthorized shared overwrite. |
| ENT-M10-32 | Trash Reference | source_module, resource_id, deleted_at, purge_eligible_at | Domain policy + 30 day baseline. |
| ENT-M10-33 | Disconnect / Closure Request | space_id, initiator, state, effective_at, processing_until | Unpair without partner veto; data separation. |
| ENT-M10-34 | Account Deletion Request | user_id, verified_at, scope, state, completed_at | Respect shared ownership and retention. |

## 4.1. Quan hệ, khóa và lịch sử nghiệp vụ

- `User Account (1) — (0..1) active Couple Membership`; `Couple Space (1) — (0..2) active memberships`.
- `User Account (1) — (0..n) Sessions`, `Security Events`, `Preferences`, `Notifications`, `Export Requests`.
- `Resource Reference (M01–M09) — (0..n) Permission Grants/Conditional Access`; quyền thực tế phải tham chiếu resource đúng nguồn, không chỉ lưu tên hiển thị.
- `Invitation` thuộc A, có trạng thái/expiry, và có thể có xác nhận B sau đó A; mỗi kết quả `Active` phải kiểm chứng đôi bên đã consent.
- `Space (1) — (0..n) Shared Resources`; ownership của resource không biến thành ownership Space hay ngược lại.
- `Notification (1) — (0..n) Delivery Attempts`, nhưng chỉ một nguồn nghiệp vụ chính; `Read State` riêng cho người nhận, không đồng bộ `Letter Opened`.
- `Backup Manifest` có tham chiếu tài nguyên, trạng thái, checksum/integrity proofs theo thiết kế; `Restore Operation` không phá dữ liệu mới của Partner bằng rollback đơn phương.
- `Trash Reference` chứa deletion state của từng domain; M10 không tạo bản sao nghiệp vụ của dữ liệu bị xóa.
- `Account Deletion Request` phải theo dõi phạm vi, tiến độ và kết quả chứ không chỉ một cờ boolean `deleted`.

## 4.2. Chuẩn thông tin liên kết

Một liên kết tối thiểu cần `source_module`, `resource_type`, `resource_id`, `link_purpose`, `created_by`, `created_at`, `permission_context` (nếu có), version/tombstone state. Không sao chép toàn bộ payload Private sang Notification, Search Index hoặc Analytics materialized view. Client không được phép tự tính effective access như nguồn phán quyết cuối.

# 5. Đặc tả 24 màn hình ST-01–ST-24

Các màn hình dưới đây là **logical UI surfaces**, có thể là page, modal hoặc wizard. Mỗi màn hình phải có ít nhất trạng thái `loading`, `empty` (khi phù hợp), `success`, `validation error`, `permission denied`, `expired/revoked` (nếu có), `network failure` và `concurrent update` khi rủi ro có thật. Nút nguy hiểm cần xác nhận rõ; thao tác thành công chỉ xuất hiện sau phản hồi đáng tin cậy.

## 5.1. ST-01 — Settings Home

**Mục tiêu:** Xem các nhóm cài đặt và trạng thái account/space; điều hướng theo quyền.

**Phạm vi màn hình:** State overview, last settings, security prompt.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-01` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** State overview, last settings, security prompt. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Account & Pairing**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.2. ST-02 — My Profile

**Mục tiêu:** Xem/sửa Display Name, avatar, nickname, birthday, bio trong phạm vi của chính mình.

**Phạm vi màn hình:** Validation, field visibility, media permission.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-02` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Validation, field visibility, media permission. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Account & Pairing**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.3. ST-03 — Partner Profile

**Mục tiêu:** Chỉ xem các trường Partner được cho phép và trạng thái Pairing, không thấy account secrets.

**Phạm vi màn hình:** Empty/no permission/unpaired states.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-03` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Empty/no permission/unpaired states. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Account & Pairing**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.4. ST-04 — Couple Space Profile

**Mục tiêu:** Xem/sửa tên chung, ảnh bìa, màu nhấn; hiển thị provenance anniversary từ M05.

**Phạm vi màn hình:** Conflict warning, historical revisions.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-04` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Conflict warning, historical revisions. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Account & Pairing**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.5. ST-05 — Invite Partner

**Mục tiêu:** Tạo, sao chép, thu hồi link/mã mời và xem expiry 48 giờ.

**Phạm vi màn hình:** Expired/revoked/already paired states.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-05` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Expired/revoked/already paired states. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Account & Pairing**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.6. ST-06 — Pairing Confirmation

**Mục tiêu:** Người nhận kiểm tra danh tính và consent; người mời xác nhận đúng tài khoản.

**Phạm vi màn hình:** Dual consent, safe retry, single active space.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-06` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Dual consent, safe retry, single active space. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Account & Pairing**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.7. ST-07 — Account & Login

**Mục tiêu:** Đăng ký, xác minh email, đăng nhập/đăng xuất, đổi mật khẩu.

**Phạm vi màn hình:** Locked/unverified/error/success states.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-07` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Locked/unverified/error/success states. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Account & Pairing**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.8. ST-08 — Account Recovery

**Mục tiêu:** Gửi yêu cầu, kiểm tra link reset, đặt mật khẩu và xử lý thất bại.

**Phạm vi màn hình:** Expired/used token, non-enumerating feedback.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-08` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Expired/used token, non-enumerating feedback. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Account & Pairing**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.9. ST-09 — Active Sessions

**Mục tiêu:** Xem phiên hiện tại/khác và thu hồi phiên/đăng xuất thiết bị khác.

**Phạm vi màn hình:** Session stale/revoked and confirmation.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-09` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Session stale/revoked and confirmation. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Account & Pairing**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.10. ST-10 — MFA Settings

**Mục tiêu:** Tạo TOTP, xác minh, bảo vệ recovery codes, tắt/đặt lại có step-up.

**Phạm vi màn hình:** Pending enrollment, no recovery code leak.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-10` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Pending enrollment, no recovery code leak. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Account & Pairing**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.11. ST-11 — Privacy Center

**Mục tiêu:** Trình bày Private-first, truy cập nguồn liên kết, quyền và hành động bảo mật.

**Phạm vi màn hình:** Clarify limits of downloaded copies.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-11` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Clarify limits of downloaded copies. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Privacy**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.12. ST-12 — Permission Inspector

**Mục tiêu:** Hiển thị ai có quyền thực tế và vì sao, liên kết Private/Restricted/Sealed.

**Phạm vi màn hình:** Preview partner effective visibility, revoke impact.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-12` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Preview partner effective visibility, revoke impact. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Privacy**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.13. ST-13 — Appearance & Theme

**Mục tiêu:** Chọn Light/Dark/System và theme chung khi có quyền.

**Phạm vi màn hình:** System fallback, contrast accessible.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-13` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** System fallback, contrast accessible. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Personalization**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.14. ST-14 — Language & Regional

**Mục tiêu:** Ngôn ngữ vi-VN; format 12/24h, timezone, locale display.

**Phạm vi màn hình:** Preserve canonical event instant/all-day dates.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-14` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Preserve canonical event instant/all-day dates. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Personalization**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.15. ST-15 — Accessibility Preferences

**Mục tiêu:** Reduced motion, font scaling, keyboard/focus related preferences.

**Phạm vi màn hình:** Accessible critical actions and validation.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-15` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Accessible critical actions and validation. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Personalization**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.16. ST-16 — Notification Center

**Mục tiêu:** Xem/lọc/đánh dấu đọc/ẩn notification toàn hệ thống.

**Phạm vi màn hình:** Deep-link reauthorization, no stale secret preview.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-16` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Deep-link reauthorization, no stale secret preview. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Notifications**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.17. ST-17 — Notification Preferences

**Mục tiêu:** Bật/tắt theo loại và kênh, cấu hình Quiet Hours, preview privacy.

**Phạm vi màn hình:** In-app P0, push/email P1, independent settings.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-17` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** In-app P0, push/email P1, independent settings. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Notifications**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.18. ST-18 — Storage Overview

**Mục tiêu:** Phân loại storage và thống kê chỉ trong phạm vi quyền.

**Phạm vi màn hình:** Hide private count/size and masked spaces.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-18` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Hide private count/size and masked spaces. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Data & Lifecycle**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.19. ST-19 — Export My Data

**Mục tiêu:** Chọn My Data/Shared Data, hiển thị phạm vi và trạng thái export an toàn.

**Phạm vi màn hình:** Expire downloadable artifact, auth recheck.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-19` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Expire downloadable artifact, auth recheck. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Data & Lifecycle**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.20. ST-20 — Backup & Recovery Center

**Mục tiêu:** Hiển thị trạng thái backup, manifest health và quản lý yêu cầu restore có kiểm soát.

**Phạm vi màn hình:** No unilateral system-wide rollback.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-20` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** No unilateral system-wide rollback. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Data & Lifecycle**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.21. ST-21 — Trash Center

**Mục tiêu:** Xem item trash các domain, khôi phục theo quyền và thời hạn.

**Phạm vi màn hình:** Link integrity, expired, domain-specific protection.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-21` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Link integrity, expired, domain-specific protection. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Data & Lifecycle**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.22. ST-22 — Couple Space Disconnect

**Mục tiêu:** Giải thích tác động, step-up, xác nhận unpair, xem dữ liệu chung read-only sau đó.

**Phạm vi màn hình:** 30-day processing, pending scheduled content policy.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-22` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** 30-day processing, pending scheduled content policy. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Data & Lifecycle**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.23. ST-23 — Deactivate / Delete Account

**Mục tiêu:** Phân biệt deactivation/delete, quyền & tài sản chung, xác thực lại và trạng thái yêu cầu.

**Phạm vi màn hình:** No false completion, no partner cascade delete.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-23` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** No false completion, no partner cascade delete. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Data & Lifecycle**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

## 5.24. ST-24 — Security & Audit Activity

**Mục tiêu:** Xem account security actions và permitted permission change history.

**Phạm vi màn hình:** Redacted secrets, audit pagination.

**Quyền truy cập:** Người dùng phải có session hợp lệ cho dữ liệu được bảo vệ. Các thao tác account identity, MFA, session, data export, Disconnect/Delete chỉ chủ tài khoản được yêu cầu và có thể cần step-up. Với nội dung Couple Space, phải kiểm tra trạng thái membership và quyền của nguồn; không hiển thị đối tượng của Partner theo inference.

**Luồng chuẩn:** (1) xác định actor + current state, (2) tải dữ liệu đã qua kiểm tra quyền, (3) hiển thị trạng thái và hành động hợp lệ, (4) thu thập dữ liệu nhập/xác nhận rõ ràng, (5) kiểm tra ở nguồn xử lý, (6) ghi kết quả + audit khi cần, (7) cập nhật UI mà không nói đã thành công khi backend chưa chấp nhận.

**Đầu vào và validation:** Bảo vệ thiếu/không hợp lệ, stale session, linked resource mất quyền, payload sửa bởi client; dữ liệu cá nhân không được tự đưa vào field shared. Không có lý do để yêu cầu nhập thông tin xác thực của Partner. `ST-24` phải có thông báo lỗi hành động được, không tiết lộ secret/private resource qua thông báo lỗi.

**Trạng thái đặc biệt & thiết bị:** Redacted secrets, audit pagination. Trên mobile, tương tác, form, keyboard, viewport và cảnh báo thao tác nguy hiểm phải khả dụng ngang desktop; những trang có nguy cơ bị out-of-date phải kiểm tra lại quyền/trạng thái tại Submit. Bảo đảm thao tác Back/Refresh không gửi yêu cầu tạo/xóa/ghép đôi hai lần.

**Đầu ra/QA:** Đối chiếu với BR và AC liên quan nhóm **Data & Lifecycle**; lưu định danh/phiên bản/timestamp nguồn, không sinh bản ghi trùng và không thay đổi domain khác ngoài contract được phép.

# 6. Business Rules — BR-M10-01–95

Mọi Business Rule dưới đây **đã được chốt theo bản đề xuất M10**. Các rule là kết quả nghiệm thu độc lập; nếu domain implementation cần quy tắc cụ thể hơn thì phải thể hiện trong technical contracts, không âm thầm nới lỏng privacy hoặc nghĩa vụ consent.

## 6.Identity — Nhóm quy tắc Identity

**BR-M10-01 [Identity]** — Mỗi tài khoản có danh tính ổn định và độc lập với Couple Space.

**BR-M10-02 [Pairing]** — Một Couple Space Active có tối đa hai thành viên.

**BR-M10-03 [Pairing]** — Một tài khoản chỉ thuộc một Couple Space Active tại một thời điểm trong V1.0.

**BR-M10-04 [Pairing]** — Ghép đôi cần sự đồng ý rõ ràng của cả hai tài khoản.

**BR-M10-05 [Pairing]** — Lời mời có thời hạn, trạng thái và khả năng thu hồi.

**BR-M10-06 [Pairing]** — Link/mã mời không tự cấp quyền xem nội dung Private.

**BR-M10-07 [Pairing]** — Tạo tài khoản hoặc ghép đôi không tự chuyển dữ liệu cá nhân thành Shared.

**BR-M10-08 [Pairing]** — Xử lý lại thao tác Accept không được tạo hai Space trùng.

**BR-M10-09 [Pairing]** — Không có một thành viên mặc định có quyền quản trị vượt mọi nội dung Private của người kia.

**BR-M10-10 [Pairing]** — Mọi thay đổi trạng thái ghép đôi cần được ghi nhận trong lịch sử bảo mật phù hợp.

## 6.Profile — Nhóm quy tắc Profile

**BR-M10-11 [Profile]** — Profile cá nhân và Couple Profile có quyền sở hữu khác nhau.

**BR-M10-12 [Profile]** — Một tài khoản không thể chỉnh sửa email, mật khẩu hoặc cài đặt bảo mật của tài khoản kia.

**BR-M10-13 [Profile]** — Avatar và ảnh bìa phải tuân thủ quyền sử dụng tài nguyên Media khi có liên kết M02.

**BR-M10-14 [Profile]** — Chia sẻ Couple Profile không tự chia sẻ toàn bộ My Profile.

**BR-M10-15 [Profile]** — Thay đổi Display Name không làm thay đổi User ID và tác giả các bản ghi cũ.

**BR-M10-16 [Profile]** — Ngày bắt đầu mối quan hệ được lấy từ dữ liệu Anniversary được chọn trong M05, không duy trì bộ đếm riêng tại M10.

**BR-M10-17 [Profile]** — Thay đổi Couple Profile cần có lịch sử và khả năng xử lý xung đột chỉnh sửa.

**BR-M10-18 [Profile]** — Những trường hồ sơ không bắt buộc phải có thể để trống mà không làm hỏng giao diện.

## 6.Security — Nhóm quy tắc Security

**BR-M10-19 [Security]** — Người dùng phải xác thực hợp lệ trước khi truy cập dữ liệu tài khoản.

**BR-M10-20 [Security]** — Email dùng đăng nhập phải được xác minh theo quy trình đã định.

**BR-M10-21 [Security]** — Không lưu, xuất hoặc ghi log mật khẩu dạng đọc được.

**BR-M10-22 [Security]** — Quy trình đặt lại mật khẩu phải có thời hạn và khả năng vô hiệu hóa yêu cầu đã dùng.

**BR-M10-23 [Security]** — Mỗi phiên đăng nhập phải có định danh và trạng thái hợp lệ.

**BR-M10-24 [Security]** — Người dùng có thể thu hồi các phiên đăng nhập của mình.

**BR-M10-25 [Security]** — Phiên đã bị thu hồi không được tiếp tục thực hiện yêu cầu được bảo vệ.

**BR-M10-26 [Security]** — Một tài khoản không được quản lý mật khẩu, MFA hoặc Sessions của tài khoản còn lại.

**BR-M10-27 [Security]** — Các thao tác nhạy cảm cần xác thực lại hoặc kiểm tra tăng cường khi phù hợp.

**BR-M10-28 [Security]** — MFA có thể được bật bởi chủ tài khoản và phải có phương án khôi phục an toàn.

**BR-M10-29 [Security]** — Hệ thống phải hạn chế thử đăng nhập và mã xác thực bất thường, không tiết lộ thông tin tài khoản quá mức trong thông báo lỗi.

**BR-M10-30 [Security]** — Thông tin xác thực không được xuất hiện trong Audit, Notification hoặc các file Export thông thường.

**BR-M10-31 [Security]** — Thay đổi thông tin xác thực quan trọng phải tạo sự kiện bảo mật phù hợp.

**BR-M10-32 [Security]** — Khôi phục quyền truy cập tài khoản không được tự bỏ qua trạng thái khóa của Time Capsule hoặc quyền Private của nội dung.

**BR-M10-33 [Security]** — Người dùng không thể chiếm tài khoản đối tác chỉ dựa trên trạng thái Couple Space Active.

## 6.ACL — Nhóm quy tắc ACL

**BR-M10-34 [ACL]** — Tất cả đối tượng mới của M01–M09 phải áp dụng Private mặc định trừ trường hợp có hành động chia sẻ rõ ràng đã được xác nhận.

**BR-M10-35 [ACL]** — Quyền truy cập phải được kiểm tra tại nguồn xử lý nghiệp vụ, không chỉ bằng việc ẩn nút trên giao diện.

**BR-M10-36 [ACL]** — Role hoặc quyền ở Couple Space không tự cấp quyền với mọi nội dung Private.

**BR-M10-37 [ACL]** — Quyền của nội dung cha không tự mở quyền cho tài nguyên Private hoặc liên kết độc lập.

**BR-M10-38 [ACL]** — Chia sẻ nội dung có liên kết Private phải có quy tắc cảnh báo, bỏ liên kết hoặc cấp quyền có chủ đích.

**BR-M10-39 [ACL]** — Permission Inspector phải phản ánh quyền thực tế, không chỉ trạng thái của bộ lọc giao diện.

**BR-M10-40 [ACL]** — Thu hồi quyền phải ngăn những yêu cầu truy cập mới không hợp lệ.

**BR-M10-41 [ACL]** — Search, Feed, Notification, Export và Report phải áp dụng kiểm tra quyền tương đương với việc xem nội dung nguồn.

**BR-M10-42 [ACL]** — Không được dùng số lượng, gợi ý, thời gian hoạt động hoặc lỗi khác biệt để cố ý tiết lộ sự tồn tại của nội dung bí mật.

**BR-M10-43 [ACL]** — Quyền chuyên biệt của từng phân hệ phải tiếp tục được áp dụng sau khi kiểm tra quyền dùng chung.

**BR-M10-44 [ACL]** — Owner của Space không thể tự xác nhận thay một nghĩa vụ hoặc hành động yêu cầu chủ thể khác chấp thuận.

**BR-M10-45 [ACL]** — Nội dung Scheduled Reveal cần kiểm tra danh tính, thời điểm và trạng thái ở lúc truy cập.

**BR-M10-46 [ACL]** — Xóa hoặc thu hồi quyền đối tượng nguồn phải được phản ánh an toàn tại các liên kết liên phân hệ.

**BR-M10-47 [ACL]** — Thay đổi quyền phải được ghi lịch sử theo phạm vi hợp lệ, nhưng lịch sử không được trở thành đường truy cập nội dung Private.

**BR-M10-48 [ACL]** — Nội dung đã được xuất hoặc sao chép hợp lệ ra ngoài ứng dụng không thể được cam kết thu hồi bằng một thay đổi quyền trong Our Space.

## 6.Personalization — Nhóm quy tắc Personalization

**BR-M10-49 [Personalization]** — Có Light, Dark và System Theme trong P0.

**BR-M10-50 [Personalization]** — Tùy chọn Appearance cá nhân không tự thay đổi Appearance của đối tác.

**BR-M10-51 [Personalization]** — Couple Theme không ghi đè những tùy chọn hỗ trợ tiếp cận quan trọng của từng người.

**BR-M10-52 [Personalization]** — Phong cách scrapbook chuyên sâu chỉ áp dụng trong phạm vi M01 đã được phê duyệt.

**BR-M10-53 [Personalization]** — Thay đổi ngôn ngữ, múi giờ hoặc định dạng không được làm thay đổi dữ liệu ngày giờ gốc.

**BR-M10-54 [Personalization]** — Tùy chọn người dùng phải được lưu và đồng bộ hợp lý giữa các phiên đăng nhập.

**BR-M10-55 [Personalization]** — Giao diện phải hỗ trợ reduced motion và các thao tác quan trọng không phụ thuộc hiệu ứng hình ảnh.

**BR-M10-56 [Personalization]** — Theme phải bảo đảm các trạng thái quan trọng còn phân biệt được, không chỉ dựa vào màu sắc.

**BR-M10-57 [Personalization]** — Trang chủ cá nhân hóa chỉ hiển thị những dữ liệu được phép xem.

**BR-M10-58 [Personalization]** — Thay đổi cấu hình giao diện không được làm mất nội dung hoặc trạng thái nghiệp vụ của các phân hệ.

## 6.Notifications — Nhóm quy tắc Notifications

**BR-M10-59 [Notifications]** — Các phân hệ dùng chung một Notification Center.

**BR-M10-60 [Notifications]** — Mỗi thông báo phải có loại, người nhận và tham chiếu nguồn hợp lệ.

**BR-M10-61 [Notifications]** — Người dùng có quyền bật/tắt những loại thông báo không bắt buộc theo chính sách.

**BR-M10-62 [Notifications]** — Các thông báo bảo mật thiết yếu phải có chính sách riêng, không bị vô hiệu hóa thiếu an toàn chỉ vì người dùng tắt tương tác thông thường.

**BR-M10-63 [Notifications]** — In-app Notification thuộc P0; Email/Push là mở rộng theo khả năng và cấu hình được duyệt.

**BR-M10-64 [Notifications]** — Quiet Hours chỉ điều chỉnh việc thông báo, không tự hoãn trạng thái nghiệp vụ.

**BR-M10-65 [Notifications]** — Notification Preview không được vượt quyền nội dung nguồn hoặc trạng thái Reveal.

**BR-M10-66 [Notifications]** — Thu hồi quyền phải ngăn việc mở nội dung qua Notification cũ.

**BR-M10-67 [Notifications]** — Tác vụ thông báo được xử lý lại không được tạo những bản trùng không cần thiết.

**BR-M10-68 [Notifications]** — Đánh dấu Notification đã đọc không thay trạng thái đọc của Letter hoặc Capsule.

**BR-M10-69 [Notifications]** — Xóa Notification không được xóa đối tượng nguồn.

**BR-M10-70 [Notifications]** — Thông báo phải có cách xử lý trạng thái lỗi và không được tuyên bố đã hiển thị thành công khi chưa có căn cứ.

**BR-M10-71 [Notifications]** — Tùy chọn thông báo của A và B độc lập, không tự đồng bộ cho cả hai.

## 6.Data — Nhóm quy tắc Data

**BR-M10-72 [Data]** — M10 phải quản lý những quy trình Export, Backup, Restore và dữ liệu tài khoản ở cấp toàn hệ thống.

**BR-M10-73 [Data]** — Export cá nhân chỉ bao gồm dữ liệu được phép xuất.

**BR-M10-74 [Data]** — Export Shared không tự bao gồm Private của người còn lại.

**BR-M10-75 [Data]** — Export thông thường không được vượt quyền của Time Capsule Sealed hoặc Surprise Secret.

**BR-M10-76 [Data]** — Backup phải bảo toàn định danh, liên kết, quyền và trạng thái nghiệp vụ quan trọng.

**BR-M10-77 [Data]** — Khôi phục phải kiểm tra tính nhất quán xuyên phân hệ, không tự tạo bản ghi trùng.

**BR-M10-78 [Data]** — Người dùng có thể khôi phục nội dung hợp lệ trong Trash theo chính sách 30 ngày đã chốt.

**BR-M10-79 [Data]** — Khôi phục không được vượt qua khóa thời gian hoặc quyền truy cập đã bị thu hồi.

**BR-M10-80 [Data]** — Khôi phục toàn hệ thống không được cho một tài khoản đơn phương ghi đè dữ liệu của cả hai.

**BR-M10-81 [Data]** — Xóa tài khoản không được tự xóa toàn bộ nội dung hợp lệ thuộc quyền của tài khoản khác.

**BR-M10-82 [Data]** — Các bản sao backup phải có chính sách lưu giữ và xóa nhất quán với quy trình quản trị dữ liệu được duyệt.

**BR-M10-83 [Data]** — Thống kê Storage không được tiết lộ dung lượng hoặc sự tồn tại của dữ liệu Private của người khác.

**BR-M10-84 [Data]** — Những yêu cầu Export/Restore quan trọng phải có trạng thái, kết quả và lịch sử thực hiện rõ ràng.

## 6.Lifecycle — Nhóm quy tắc Lifecycle

**BR-M10-85 [Lifecycle]** — Log Out, Deactivate, Disconnect và Delete Account là bốn nghiệp vụ khác nhau.

**BR-M10-86 [Lifecycle]** — Một thành viên có thể chủ động Disconnect mà không bị người còn lại ngăn cản.

**BR-M10-87 [Lifecycle]** — Disconnect không được tự xóa dữ liệu Private hoặc Shared thuộc quyền hợp lệ của người khác.

**BR-M10-88 [Lifecycle]** — Sau Disconnect, các thao tác cộng tác mới phải bị ngăn theo trạng thái Space.

**BR-M10-89 [Lifecycle]** — Những nội dung đã Delivered, Confirmed hoặc Published phải có chính sách bảo toàn lịch sử riêng.

**BR-M10-90 [Lifecycle]** — Dữ liệu chưa được Reveal phải có quy tắc rõ khi Space không còn Active.

**BR-M10-91 [Lifecycle]** — Quy trình xử lý dữ liệu sau Disconnect không được tự mở quyền với nội dung Private.

**BR-M10-92 [Lifecycle]** — Ghép đôi lại phải cần sự đồng ý của cả hai, không tự kích hoạt chỉ từ trạng thái phiên đăng nhập.

**BR-M10-93 [Lifecycle]** — Xóa tài khoản không tự xóa nội dung hoặc lịch sử hợp lệ thuộc quyền của tài khoản khác.

**BR-M10-94 [Lifecycle]** — Tài khoản không hoạt động không bị tự coi đã xác nhận những hành động cần sự đồng ý.

**BR-M10-95 [Lifecycle]** — Mọi hành động Disconnect và Delete Account phải giải thích hậu quả, kiểm tra quyền và có lịch sử thực hiện an toàn.

## 6.1. Ghi chú diễn giải bắt buộc về nội dung đã khóa và quyền rời Space

- **D35 không ghi đè D16/D18 của M08:** sau Seal, nội dung, người nhận và thời điểm `unlock_at` vẫn bất biến theo M08. Disconnect làm **tạm dừng chính sách giao nhận/Reveal đối với những mục chưa trao** bằng một trạng thái riêng, không đổi ngày hẹn thành một thời điểm giả. Tác vụ mở đến hạn trong lúc paused không được tự trao; phải giữ đủ dấu vết để kiểm toán và xử lý sau này.
- **Không giữ nội dung vĩnh viễn bằng lý do immutability:** các quy trình xóa dữ liệu có quyền hợp lệ và retention/backup phải được thiết kế minh bạch, bảo toàn dữ liệu đối tác theo chính sách; M08 snapshot không tự được miễn trừ mọi yêu cầu xóa.
- **Không tự tiếp tục lịch sau Reconnect:** D37 cần cả hai xác nhận; các nhiệm vụ Scheduled đã paused/Cancelled phải qua policy review tương ứng, không tự khôi phục từ token/queue cũ.
- **Delivered vs Undelivered:** Letter đã Delivered, Capsule đã Opened/Reveal hợp lệ trước Disconnect được xử lý theo quyền bản đã trao; không áp dụng chính sách 'thu hồi mọi thứ' hàng loạt.
- **Partner cannot veto leaving:** trạng thái unpair có hiệu lực không phụ thuộc việc B đăng nhập/đồng ý, nhưng quyền truy cập và dữ liệu chung sau đó phải được bảo vệ và mô tả rõ.

# 7. Use Cases — UC-M10-01–24: luồng đầy đủ

Mỗi Use Case có preconditions, happy path, hậu điều kiện và failure/race handling. Thao tác security-sensitive phải có step-up khi cần, audit và chính sách retry phù hợp. Những hành vi mô tả ở đây chưa phải hợp đồng API hay thiết kế UI pixel-level.

## UC-M10-01 — Register Account

- **Tác nhân:** Người chưa đăng nhập.
- **Tiền điều kiện:** Email hợp lệ và chưa có tài khoản sử dụng email này.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Mở Sign Up.
2. Nhập email và mật khẩu.
3. Hệ thống tạo account chưa xác minh.
4. Gửi hướng dẫn xác minh.
5. Xác minh xong cho dùng phạm vi cá nhân.
6. Chưa tự ghép đôi.

- **Hậu điều kiện / Expected:** User ID độc lập, chưa có Shared Space, không mở quyền Partner.
- **Nhánh lỗi / xung đột:** Email không hợp lệ/trùng; request retry không tạo hai account. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-02 — Verify Email

- **Tác nhân:** Chủ tài khoản.
- **Tiền điều kiện:** Có yêu cầu xác minh còn hiệu lực.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Người dùng mở link.
2. Hệ thống kiểm tra expiry và token chưa tiêu thụ.
3. Ghi verified.
4. Vô hiệu token.
5. Quay lại account.

- **Hậu điều kiện / Expected:** Không sử dụng lại link, không công khai email cho Partner.
- **Nhánh lỗi / xung đột:** Link expired/used hoặc email identity thay đổi. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-03 — Invite Partner

- **Tác nhân:** A đã xác minh email.
- **Tiền điều kiện:** A không ở Space Active và chưa bị hạn chế ghép đôi.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Mở Invite.
2. Tạo token một lần với expiry 48h.
3. Sao chép link.
4. Xem trạng thái.
5. Có thể revoke.
6. B chưa thấy Private.

- **Hậu điều kiện / Expected:** Chưa tạo Space chỉ từ việc gửi lời mời.
- **Nhánh lỗi / xung đột:** Token guessed/revoked/expired, đồng thời nhiều invitations. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-04 — Accept Pairing

- **Tác nhân:** A và B.
- **Tiền điều kiện:** B đăng nhập/xác minh email; lời mời còn hiệu lực.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. B xem danh tính A.
2. B đồng ý.
3. A kiểm tra chính xác B và đồng ý.
4. Kiểm tra cả hai chỉ có tối đa một active space.
5. Kích hoạt space một lần.
6. Ghi audit.

- **Hậu điều kiện / Expected:** Couple Space Active đúng hai user, Private dữ liệu trước đó giữ nguyên.
- **Nhánh lỗi / xung đột:** B ở Space khác, lời mời hết hạn, cạnh tranh pairing. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-05 — Reject/Revoke Invitation

- **Tác nhân:** A hoặc B.
- **Tiền điều kiện:** Lời mời chưa thành Active.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. B từ chối hoặc A thu hồi.
2. Đổi trạng thái lời mời.
3. Vô hiệu link và mọi phiên thử Accept tiếp theo.
4. Ghi audit.

- **Hậu điều kiện / Expected:** Không tạo Couple Space, không lộ Private.
- **Nhánh lỗi / xung đột:** Request Accept đến cùng lúc, cần giải quyết thứ tự nguyên tử. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-06 — Edit My Profile

- **Tác nhân:** Chủ tài khoản.
- **Tiền điều kiện:** Session hợp lệ.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Mở My Profile.
2. Đổi Display Name, Avatar, Nickname hoặc Bio.
3. Kiểm tra field/Media.
4. Lưu theo version.
5. Làm mới nhãn hiển thị.

- **Hậu điều kiện / Expected:** User ID, tác giả quá khứ và partner security settings không đổi.
- **Nhánh lỗi / xung đột:** Avatar revoked/delete, conflict thiết bị. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-07 — Edit Couple Profile

- **Tác nhân:** Thành viên Active.
- **Tiền điều kiện:** Có quyền sửa shared profile.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Chỉnh tên/cover/theme.
2. Xem ảnh hưởng cho cả hai.
3. Kiểm tra media rights.
4. Lưu version.
5. Ghi lịch sử.
6. M05 cung cấp ngày gốc nếu hiển thị.

- **Hậu điều kiện / Expected:** Chỉ thay trường chung được phép; không tạo Anniversary thứ hai.
- **Nhánh lỗi / xung đột:** A/B cùng sửa; nguồn ảnh bị xoá. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-08 — Log In/Out

- **Tác nhân:** Người dùng.
- **Tiền điều kiện:** Có credentials/identity phù hợp.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Đăng nhập.
2. Xác minh và tạo session.
3. Xem account.
4. Log Out vô hiệu phiên đang dùng.
5. Kiểm tra request tiếp theo.

- **Hậu điều kiện / Expected:** Chỉ own account được truy cập, revoked session không hoạt động.
- **Nhánh lỗi / xung đột:** Failed attempts nhiều, unverified identity, session expiry. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-09 — Reset Password

- **Tác nhân:** Chủ tài khoản.
- **Tiền điều kiện:** Có email đã xác minh / kênh phục hồi được duyệt.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Yêu cầu reset bằng phản hồi không xác nhận account existence.
2. Nhận link.
3. Kiểm tra token/expiry.
4. Đổi password.
5. Thu hồi session cần thiết.
6. Ghi security event.

- **Hậu điều kiện / Expected:** Link một lần; credential cũ không tiếp tục sử dụng ngoài chính sách.
- **Nhánh lỗi / xung đột:** Expired/used/replayed token; mất email/MFA. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-10 — Enable MFA

- **Tác nhân:** Chủ tài khoản.
- **Tiền điều kiện:** Đã xác thực và thực hiện step-up nếu cần.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Khởi tạo TOTP.
2. Người dùng quét secret an toàn.
3. Nhập mã xác minh.
4. Cấp recovery codes.
5. Xác nhận lưu mã.
6. Kích hoạt MFA.

- **Hậu điều kiện / Expected:** Enrollment không tự bật trước khi verify; recovery protected.
- **Nhánh lỗi / xung đột:** Sai mã nhiều lần; mất thiết bị; request replay. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-11 — Revoke Session

- **Tác nhân:** Chủ tài khoản.
- **Tiền điều kiện:** Có ít nhất một active session.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Xem danh sách các phiên của mình.
2. Chọn phiên khác.
3. Xác thực step-up khi cần.
4. Revoke.
5. Thử request từ phiên cũ.

- **Hậu điều kiện / Expected:** Phiên bị revoke không còn quyền với request mới.
- **Nhánh lỗi / xung đột:** Phiên đã hết hạn hoặc bị revoke đồng thời. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-12 — Change Item Permission

- **Tác nhân:** Chủ sở hữu nội dung hợp lệ.
- **Tiền điều kiện:** Resource thuộc M01–M09 và có quyền share.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Mở Permission Inspector.
2. Chọn Viewer/Editor hợp lệ.
3. Kiểm tra link Private.
4. Cho preview.
5. Confirm.
6. Ghi policy version.
7. Recipient truy cập lại.

- **Hậu điều kiện / Expected:** Shared đúng trường đã chọn; attached Private không tự mở.
- **Nhánh lỗi / xung đột:** Resource archived/trash, stale ACL version, revoke khi đang sửa. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-13 — Inspect Linked Permissions

- **Tác nhân:** A hoặc B.
- **Tiền điều kiện:** Có quyền xem item cha.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Mở Shared Trip.
2. Hệ thống liệt kê link Expense có thể chia sẻ metadata phù hợp.
3. Kiểm tra ACL M07 khi mở link.
4. Từ chối nếu Private.

- **Hậu điều kiện / Expected:** Xem Trip không làm lộ số tiền/receipt Private.
- **Nhánh lỗi / xung đột:** Truy cập qua search/feed/report/cached preview. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-14 — Change Appearance

- **Tác nhân:** Chủ tài khoản.
- **Tiền điều kiện:** Đang đăng nhập.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Chọn Light/Dark/System.
2. Lưu preference riêng.
3. Render UI.
4. Kiểm tra contrast và session khác.

- **Hậu điều kiện / Expected:** Theme A không ép B đổi; task flow không đổi.
- **Nhánh lỗi / xung đột:** Browser system theme thay đổi; invalid custom theme. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-15 — Change Locale/Timezone

- **Tác nhân:** Chủ tài khoản.
- **Tiền điều kiện:** Có calendar and local preference hiện hành.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Chọn vi-VN, time format, timezone.
2. Lưu preference.
3. Mở Calendar/Anniversary.
4. Xác nhận canonical values không đổi.

- **Hậu điều kiện / Expected:** Event instant và all-day date không tự dịch.
- **Nhánh lỗi / xung đột:** DST ambiguous/gap, timezone khác nhau giữa A/B. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-16 — Configure Accessibility

- **Tác nhân:** Chủ tài khoản.
- **Tiền điều kiện:** Có UI hoạt động.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Bật reduced motion/scale.
2. Dùng keyboard focus.
3. Hoàn thành form và xác nhận quan trọng.

- **Hậu điều kiện / Expected:** Không yêu cầu animation để mở Capsule, truy cập menu, xác nhận giao dịch.
- **Nhánh lỗi / xung đột:** Font enlarged/low contrast/keyboard-only. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-17 — Configure Notifications

- **Tác nhân:** Chủ tài khoản.
- **Tiền điều kiện:** Có category preferences.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Tắt Reaction.
2. Bật Calendar.
3. Đặt Quiet Hours.
4. Tạo comment và Reminder.
5. Kiểm tra notification policy riêng người nhận.

- **Hậu điều kiện / Expected:** Notification bị tắt không xoá Comment; business action vẫn thực thi.
- **Nhánh lỗi / xung đột:** Security alert category protected, DST quiet hours. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-18 — Open Notification

- **Tác nhân:** Người nhận hợp lệ.
- **Tiền điều kiện:** Có notification source.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Mở Notification Center.
2. Chọn item.
3. Server kiểm tra trạng thái source+ACL.
4. Điều hướng hoặc hiển thị unavailable.
5. Mark read notification riêng.

- **Hậu điều kiện / Expected:** Không bypass ACL; không tự đánh dấu M08 Letter Opened.
- **Nhánh lỗi / xung đột:** Deep link stale; source deleted; reveal chưa đến. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-19 — Export My Data

- **Tác nhân:** Chủ tài khoản.
- **Tiền điều kiện:** Session và step-up hợp lệ.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Chọn My Data hoặc Shared Data.
2. Xem phạm vi.
3. Confirm.
4. Hệ thống quét ACL từng bản ghi.
5. Tạo artifact có thời hạn.
6. Kiểm tra tải.
7. Ghi security event.

- **Hậu điều kiện / Expected:** Không có Partner Private hoặc Sealed-readable content trước unlock.
- **Nhánh lỗi / xung đột:** ACL thay đổi lúc export, export failed/cancelled. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-20 — Restore Trashed Item

- **Tác nhân:** Chủ thể có quyền.
- **Tiền điều kiện:** Item trong Trash chưa purge theo chính sách.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Mở Trash Center.
2. Chọn Goal M06.
3. Xác minh quyền và expiry.
4. Kiểm tra linked resources.
5. Restore đúng một lần.
6. Ghi audit.

- **Hậu điều kiện / Expected:** Không sinh Event M05/Savings M07 trùng, không mở quyền cũ.
- **Nhánh lỗi / xung đột:** Link nguồn bị purge, no longer authorized. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-21 — Recover from Backup

- **Tác nhân:** Người vận hành được ủy quyền theo quy trình.
- **Tiền điều kiện:** Bản Backup qua integrity check.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Xem manifest.
2. Đánh giá consistency M01–M09.
3. Lên kế hoạch restore.
4. Thực thi trong phạm vi đã duyệt.
5. Đối soát identities, source links, permission, locks, balances.
6. Ghi kết quả.

- **Hậu điều kiện / Expected:** Không cho user A đơn phương rollback Shared; dữ liệu nhất quán.
- **Nhánh lỗi / xung đột:** Backup corrupt, partial restore, replay scheduling. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-22 — Disconnect Couple Space

- **Tác nhân:** A hoặc B.
- **Tiền điều kiện:** Couple Space Active và requester authenticated.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Mở Disconnect.
2. Xem tác động.
3. Step-up.
4. Xác nhận đơn phương.
5. Chuyển Space Frozen/Disconnecting.
6. Block shared writes.
7. Bảo vệ export/read-only trong 30 ngày.
8. Phân loại scheduled content.
9. Thông báo B có kiểm soát.

- **Hậu điều kiện / Expected:** A rời Space không cần veto; B không mất Private, M07 history còn, Sealed intact.
- **Nhánh lỗi / xung đột:** Concurrent writes/settlement/opening due cùng thời điểm. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-23 — Delete Account

- **Tác nhân:** Chủ tài khoản.
- **Tiền điều kiện:** Có account và đủ step-up.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Xem phạm vi Private/Shared/Delivered/Sealed.
2. Xác thực lại.
3. Gửi deletion request.
4. Theo dõi lifecycle.
5. Phân loại retention.
6. Xử lý safe purge.
7. Xác minh không cascade Partner records.

- **Hậu điều kiện / Expected:** Không báo Deleted nếu xử lý chưa xong; không tự xóa tài sản đối tác.
- **Nhánh lỗi / xung đột:** Account inactive, outstanding rights/financial records, backup retention. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

## UC-M10-24 — Reconnect Couple Accounts

- **Tác nhân:** A và B.
- **Tiền điều kiện:** Couple Space không Active, cả hai tài khoản hợp lệ.
- **Kích hoạt:** Người dùng chủ động chọn hành động tại giao diện M10 hoặc luồng xác minh hợp lệ tương ứng.
- **Luồng chính:**

1. Bắt đầu quy trình mới.
2. Cả hai xác nhận.
3. Kiểm tra account membership.
4. Định nghĩa dùng Space cũ hoặc Space mới theo chính sách.
5. Xác lập ACL mới.
6. Không tự bật lại quyền/schedule cũ.

- **Hậu điều kiện / Expected:** Không tự resurrect Private shares hay cancelled future content.
- **Nhánh lỗi / xung đột:** Một bên từ chối; hai yêu cầu đồng thời; old link replay. Không tuyên bố thành công trước khi lưu hợp lệ; request retry phải tuân thủ idempotency/valid transition; mọi dữ liệu trả về cho client đều được kiểm tra ACL hiện hành.
- **QA chứng minh:** Thực hiện ít nhất một happy path A, một happy path B khi áp dụng, một test denied/expired, một replay/concurrency test và một verification rằng đối tượng M01–M09 không bị thay đổi không chủ đích.

# 8. Exception Handling — EX-M10-01–50

Danh sách này bao phủ các nhánh nghiệp vụ bắt buộc; UI cần đưa thông báo có thể xử lý, còn backend phải ghi trạng thái cuối nhất quán và redacted audit. Chỉ ra nguyên nhân ở mức đủ giúp người có quyền khắc phục, không tiết lộ sự tồn tại của đối tượng Private qua lỗi khác biệt hoặc count.

| Mã | Tình huống | Xử lý bắt buộc | Nhóm |
|---|---|---|---|
| EX-M10-01 | Đăng ký với email không hợp lệ | Từ chối tạo account hoàn chỉnh, validation cụ thể. | Registration |
| EX-M10-02 | Email đã được dùng | Xử lý account safely, không tiết lộ quá mức qua reset/login endpoints. | Registration |
| EX-M10-03 | Email chưa xác minh | Không hoàn tất Pairing; giữ account state đúng. | Pairing |
| EX-M10-04 | Mã mời hết hạn | Không chấp nhận, hướng dẫn tạo lời mời mới. | Pairing |
| EX-M10-05 | Mã mời đã dùng | Không tạo Space thứ hai, phản hồi trạng thái đã xử lý. | Pairing |
| EX-M10-06 | Link mời bị thu hồi | Từ chối và không tái sử dụng token. | Pairing |
| EX-M10-07 | B đã liên kết Space khác | Không ghép đôi đồng thời. | Pairing |
| EX-M10-08 | Hai người gửi lời mời chéo | Chỉ tối đa một Active Space, giải quyết race. | Pairing |
| EX-M10-09 | A thu hồi lời mời trong lúc B chấp nhận | Có một transition cuối xác định, không bypass consent. | Pairing |
| EX-M10-10 | Tài khoản được tạo trước khi Pairing | Nội dung cũ giữ Private. | Privacy |
| EX-M10-11 | Thay Display Name | User ID và attribution cũ giữ nguyên. | Profile |
| EX-M10-12 | Avatar nguồn bị xóa | Placeholder, không hỏng profile hoặc tăng quyền. | Profile |
| EX-M10-13 | Hai người sửa Couple Profile đồng thời | Version check; không ghi đè âm thầm. | Profile |
| EX-M10-14 | Đăng nhập sai mật khẩu nhiều lần | Rate limit/throttle/challenge an toàn, không lộ thông tin account. | Security |
| EX-M10-15 | Link reset mật khẩu hết hạn | Không đổi credential. | Security |
| EX-M10-16 | Link reset được dùng lại | Từ chối replay. | Security |
| EX-M10-17 | Mất thiết bị MFA | Recovery đúng quy trình, không cho Partner bypass. | Security |
| EX-M10-18 | B cố reset tài khoản A | Không cấp quyền. | Security |
| EX-M10-19 | Session bị thu hồi nhưng tab còn mở | Chặn protected requests tiếp theo. | Security |
| EX-M10-20 | Đổi mật khẩu khi có nhiều thiết bị | Áp dụng chính sách session revocation và ghi audit. | Security |
| EX-M10-21 | Nguồn Shared chứa Media Private | Chia sẻ explicit/bỏ link/redact; không tự công khai. | ACL |
| EX-M10-22 | Shared Trip liên kết Private Expense | Không lộ Expense hoặc amount. | ACL |
| EX-M10-23 | Thu hồi quyền khi B đang mở Editor | Chặn lưu dựa trên ACL hiện hành. | ACL |
| EX-M10-24 | B mở URL Diary Private | Deny không tiết lộ sự tồn tại quá mức. | ACL |
| EX-M10-25 | B dùng Search đoán nội dung Private | Không trả kết quả/count/preview. | ACL |
| EX-M10-26 | B xem thống kê nội dung bí mật | Không tiết lộ số lượng. | ACL |
| EX-M10-27 | B dùng Notification cũ | Reauthorize deep link; không bypass ACL. | ACL |
| EX-M10-28 | B dùng Export để mở Capsule Sealed | Không đưa sealed content vào file readable. | ACL |
| EX-M10-29 | Owner Space cố Approve Expense của B | Từ chối vì M07 approval thuộc đúng chủ thể. | ACL |
| EX-M10-30 | M01 Content bị đổi quyền | M02/M09 link phải dựa trên ACL mới, không stale cache. | ACL |
| EX-M10-31 | Dark Mode có trạng thái khó đọc | Tương phản/focus/labels vẫn đáp ứng tiêu chí. | UI |
| EX-M10-32 | Reduced Motion được bật | Core action không phụ thuộc animation. | UI |
| EX-M10-33 | Đổi múi giờ | Không thay canonical event instant và anniversary calendar date. | UI |
| EX-M10-34 | Đổi ngôn ngữ | Không làm mất user-generated data. | UI |
| EX-M10-35 | Người dùng tắt Reaction Notifications | Comment/Reaction vẫn lưu; notification preference áp dụng. | Notifications |
| EX-M10-36 | Quiet Hours trùng giờ mở Capsule | Capsule đủ điều kiện unlock; chỉ điều chỉnh proactive alert. | Notifications |
| EX-M10-37 | Notification gửi thất bại | Không rollback business event. | Notifications |
| EX-M10-38 | Notification xử lý lại | Idempotency/dedup phù hợp. | Notifications |
| EX-M10-39 | Người nhận mất quyền trước khi mở thông báo | Deep link không mở nội dung trái quyền. | Notifications |
| EX-M10-40 | Storage có nội dung Private của B | A không thấy count/size của B. | Data |
| EX-M10-41 | Export chứa nhiều loại dữ liệu | Check ACL mỗi module/source và lúc tạo/tải. | Data |
| EX-M10-42 | Backup thiếu một liên kết quan trọng | Manifest fail integrity, không đánh dấu backup fully valid. | Data |
| EX-M10-43 | Restore Event/Expense trùng | Không nhân đôi canonical source records. | Data |
| EX-M10-44 | Restore Capsule Sealed | Không mở sớm, không sửa manifest/recipient/unlock. | Data |
| EX-M10-45 | Mục trong Trash hết hạn | Không khôi phục trái chính sách. | Data |
| EX-M10-46 | A Disconnect khi B đang chỉnh Shared Goal | Block/resolve pending write theo transition atomic. | Lifecycle |
| EX-M10-47 | Disconnect khi có Settlement chưa hoàn tất | Giữ nghĩa vụ và audit; không cho tạo nghĩa vụ mới. | Lifecycle |
| EX-M10-48 | Disconnect khi Capsule chưa mở | Áp dụng paused reveal policy, bảo vệ sealed snapshot. | Lifecycle |
| EX-M10-49 | Một tài khoản Delete nhưng người kia còn dữ liệu chung | Không cascade xóa Partner's entitled records. | Lifecycle |
| EX-M10-50 | Hai tài khoản thử Reconnect gần như đồng thời | Chỉ một relationship hợp lệ, không auto restore old permissions. | Lifecycle |

## 8.Pairing — Minh chứng kiểm thử tình huống bất thường

- **EX-M10-03 — Email chưa xác minh:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **không hoàn tất Pairing; giữ account state đúng.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

- **EX-M10-04 — Mã mời hết hạn:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **không chấp nhận, hướng dẫn tạo lời mời mới.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

- **EX-M10-05 — Mã mời đã dùng:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **không tạo Space thứ hai, phản hồi trạng thái đã xử lý.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

## 8.Security — Minh chứng kiểm thử tình huống bất thường

- **EX-M10-14 — Đăng nhập sai mật khẩu nhiều lần:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **rate limit/throttle/challenge an toàn, không lộ thông tin account.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

- **EX-M10-15 — Link reset mật khẩu hết hạn:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **không đổi credential.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

- **EX-M10-16 — Link reset được dùng lại:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **từ chối replay.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

## 8.ACL — Minh chứng kiểm thử tình huống bất thường

- **EX-M10-21 — Nguồn Shared chứa Media Private:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **chia sẻ explicit/bỏ link/redact; không tự công khai.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

- **EX-M10-22 — Shared Trip liên kết Private Expense:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **không lộ Expense hoặc amount.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

- **EX-M10-23 — Thu hồi quyền khi B đang mở Editor:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **chặn lưu dựa trên ACL hiện hành.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

## 8.Notifications — Minh chứng kiểm thử tình huống bất thường

- **EX-M10-35 — Người dùng tắt Reaction Notifications:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **comment/Reaction vẫn lưu; notification preference áp dụng.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

- **EX-M10-36 — Quiet Hours trùng giờ mở Capsule:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **capsule đủ điều kiện unlock; chỉ điều chỉnh proactive alert.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

- **EX-M10-37 — Notification gửi thất bại:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **không rollback business event.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

## 8.Data — Minh chứng kiểm thử tình huống bất thường

- **EX-M10-40 — Storage có nội dung Private của B:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **a không thấy count/size của B.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

- **EX-M10-41 — Export chứa nhiều loại dữ liệu:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **check ACL mỗi module/source và lúc tạo/tải.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

- **EX-M10-42 — Backup thiếu một liên kết quan trọng:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **manifest fail integrity, không đánh dấu backup fully valid.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

## 8.Lifecycle — Minh chứng kiểm thử tình huống bất thường

- **EX-M10-46 — A Disconnect khi B đang chỉnh Shared Goal:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **block/resolve pending write theo transition atomic.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

- **EX-M10-47 — Disconnect khi có Settlement chưa hoàn tất:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **giữ nghĩa vụ và audit; không cho tạo nghĩa vụ mới.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

- **EX-M10-48 — Disconnect khi Capsule chưa mở:** Dựng dữ liệu trạng thái trước lỗi; gửi request không hợp lệ hoặc race; xác nhận **áp dụng paused reveal policy, bảo vệ sealed snapshot.** Đồng thời kiểm tra không sinh bản ghi/phân quyền/thông báo trùng và không xuất hiện `success` giả.

# 9. Acceptance Criteria — AC-M10-01–90 (Given / When / Then)

Tất cả tiêu chí dưới đây áp dụng cho P0 trừ phần P1 được nêu rõ trong quyết định. Mỗi AC phải được kiểm chứng trên hai loại viewport mobile/desktop nếu có UI, và qua authorization test tại backend đối với dữ liệu nhạy cảm. Mẫu `Given–When–Then` mô tả hành vi yêu cầu, không yêu cầu áp dụng một framework test cụ thể.

## 9.Accounts — 12 tiêu chí

| AC ID | Given / When — Điều kiện & thao tác | Then — Kết quả bắt buộc |
|---|---|---|
| AC-M10-01 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đăng ký tài khoản mới. | **Then:** User ID độc lập, account trạng thái phù hợp. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-02 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** xác minh email hợp lệ. | **Then:** Verified state đúng; link consumed. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-03 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** email chưa xác minh. | **Then:** Không hoàn tất Pairing. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-04 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** tạo lời mời. | **Then:** Có mã/link và expiry 48 giờ. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-05 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** mã mời hết hạn. | **Then:** Không Accept. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-06 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** thu hồi lời mời. | **Then:** Token cũ vô hiệu. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-07 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** b chấp nhận lời mời. | **Then:** Chưa Active khi thiếu xác nhận cần thiết của A. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-08 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** cả A và B đồng ý. | **Then:** Tạo chính xác một Couple Space Active. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-09 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** b đã có Space Active. | **Then:** Không tham gia Space thứ hai. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-10 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** lệnh Pairing được gửi lại. | **Then:** Không tạo Space trùng. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-11 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** a có dữ liệu Private trước Pairing. | **Then:** B không tự xem được. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-12 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** chưa Pairing. | **Then:** Chức năng cá nhân hợp lệ vẫn sử dụng được. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |

## 9.Profile — 3 tiêu chí

| AC ID | Given / When — Điều kiện & thao tác | Then — Kết quả bắt buộc |
|---|---|---|
| AC-M10-13 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi Display Name. | **Then:** Không thay đổi User ID. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-14 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi Avatar. | **Then:** Xác minh quyền Media/asset và fallback. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-15 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi Couple Space Name. | **Then:** Cập nhật theo quyền; có history. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |

## 9.Security — 12 tiêu chí

| AC ID | Given / When — Điều kiện & thao tác | Then — Kết quả bắt buộc |
|---|---|---|
| AC-M10-16 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** b cố sửa email A. | **Then:** Từ chối. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-17 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** b cố đổi mật khẩu A. | **Then:** Từ chối. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-18 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đăng nhập hợp lệ. | **Then:** Tạo session hợp lệ. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-19 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đăng nhập sai liên tục. | **Then:** Có bảo vệ thử sai. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-20 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** reset Password hợp lệ. | **Then:** Đặt password mới an toàn. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-21 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** dùng lại link reset. | **Then:** Không chấp nhận. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-22 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** bật MFA thành công. | **Then:** Áp dụng second-factor cho flow được bảo vệ. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-23 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** dùng mã Recovery hợp lệ. | **Then:** Khôi phục bằng quy trình tăng cường. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-24 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** revoke Session. | **Then:** Thiết bị cũ không thể thực hiện request mới. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-25 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đăng xuất mọi thiết bị khác. | **Then:** Thu hồi đúng sessions liên quan. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-26 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** thay đổi thông tin xác thực quan trọng. | **Then:** Có Security Event phù hợp. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-27 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** xem Audit cá nhân. | **Then:** Không lộ account data của B. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |

## 9.ACL — 16 tiêu chí

| AC ID | Given / When — Điều kiện & thao tác | Then — Kết quả bắt buộc |
|---|---|---|
| AC-M10-28 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** tạo nội dung mới. | **Then:** Private mặc định. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-29 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** chia sẻ Diary. | **Then:** Chỉ mở đúng item được chọn. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-30 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** shared Trip chứa Private Expense. | **Then:** Không lộ Expense. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-31 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** shared Moment chứa ảnh Private. | **Then:** Không tự lộ M02 media. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-32 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** permission Inspector. | **Then:** Hiển thị effective permission. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-33 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** thu hồi Viewer. | **Then:** Các truy cập mới bị từ chối. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-34 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** thu hồi quyền khi tab mở. | **Then:** Không lưu trái quyền. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-35 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** truy cập URL Private. | **Then:** Từ chối. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-36 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** search nội dung Private. | **Then:** Không trả results/preview. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-37 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** report có dữ liệu Private của B. | **Then:** A không xem trái quyền. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-38 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** notification cũ tới nội dung mất quyền. | **Then:** Không truy cập được nguồn. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-39 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** capsule Sealed. | **Then:** Không mở sớm dù có Viewer role khác. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-40 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** space Owner cố xác nhận Expense thay B. | **Then:** Từ chối. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-41 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** interaction Settings cho phép nhưng nguồn cấm. | **Then:** Không Comment được. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-42 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** export nội dung Secret. | **Then:** Không xuất vượt quyền. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-43 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi quyền nội dung liên kết. | **Then:** Các module hiển thị nhất quán. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |

## 9.UI — 11 tiêu chí

| AC ID | Given / When — Điều kiện & thao tác | Then — Kết quả bắt buộc |
|---|---|---|
| AC-M10-44 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** chọn Light Theme. | **Then:** Hiển thị đúng mode. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-45 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** chọn Dark Theme. | **Then:** Hiển thị đúng mode. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-46 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** chọn System Theme. | **Then:** Tôn trọng lựa chọn thiết bị khi hỗ trợ. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-47 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** a đổi Theme. | **Then:** Không ép B đổi. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-48 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi Couple Theme. | **Then:** Không ghi đè trợ năng cá nhân. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-49 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** bật Reduced Motion. | **Then:** Core actions vẫn vận hành. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-50 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** dùng bàn phím. | **Then:** Điều hướng tương tác quan trọng. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-51 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** phóng to chữ. | **Then:** Nội dung quan trọng vẫn đọc được. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-52 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi 12h/24h. | **Then:** Không đổi canonical event instant. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-53 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi timezone hiển thị. | **Then:** Không làm sai anniversary/all-day date. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-54 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** cá nhân hóa Homepage. | **Then:** Chỉ dữ liệu đúng quyền. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |

## 9.Notifications — 12 tiêu chí

| AC ID | Given / When — Điều kiện & thao tác | Then — Kết quả bắt buộc |
|---|---|---|
| AC-M10-55 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** m05 tạo Reminder. | **Then:** Notification Center hiển thị đúng người. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-56 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** m09 tạo Mention. | **Then:** Notification đúng quyền. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-57 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** m08 Letter Delivered. | **Then:** Không alert trước delivery. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-58 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** capsule đến thời điểm mở. | **Then:** Unlock không phụ thuộc notification delivery. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-59 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** tắt category notification. | **Then:** Không tạo alert proactive theo category được tắt. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-60 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đặt Quiet Hours. | **Then:** Đúng channel và timezone policy. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-61 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** quiet Hours trùng giờ Capsule. | **Then:** Capsule mở đúng eligibility. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-62 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** notification xử lý lại. | **Then:** Không tạo duplicate không cần thiết. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-63 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đánh dấu Notification đọc. | **Then:** Không tự mark Letter Opened. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-64 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** xóa Notification. | **Then:** Không xóa nguồn. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-65 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** thu hồi quyền nội dung. | **Then:** Notification cũ không vượt quyền. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-66 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** thông báo bảo mật. | **Then:** Không tiết lộ secret credentials. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |

## 9.Data — 12 tiêu chí

| AC ID | Given / When — Điều kiện & thao tác | Then — Kết quả bắt buộc |
|---|---|---|
| AC-M10-67 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** a Export My Data. | **Then:** Không có B Private. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-68 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** export Shared Space. | **Then:** Chỉ Shared được phép. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-69 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** export Capsule trước Unlock. | **Then:** Không có content readable sealed. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-70 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** backup đa phân hệ. | **Then:** Giữ liên kết và ACL. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-71 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** restore Photobook Published. | **Then:** Giữ published immutable version. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-72 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** restore Expense và Settlement. | **Then:** Không tính sai obligations. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-73 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** restore Capsule Sealed. | **Then:** Không unlock sớm. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-74 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** item Restore từ Trash. | **Then:** Đúng quyền và thời hạn. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-75 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** restore có missing source. | **Then:** Không tạo phantom/trùng links. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-76 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** storage Overview. | **Then:** Không lộ B Private count/size. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-77 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** export Request thất bại. | **Then:** Không hiển thị Complete giả. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-78 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** system Restore. | **Then:** Không có unilateral shared rollback. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |

## 9.Lifecycle — 12 tiêu chí

| AC ID | Given / When — Điều kiện & thao tác | Then — Kết quả bắt buộc |
|---|---|---|
| AC-M10-79 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** a yêu cầu Disconnect. | **Then:** Không cần B chấp thuận để A rời. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-80 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** disconnect hoàn tất. | **Then:** Chặn shared writes mới. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-81 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** b còn dữ liệu Private. | **Then:** Không bị xóa bởi A Disconnect. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-82 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** shared Photobook. | **Then:** Giữ quyền và đóng góp của cả hai. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-83 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** settlement chưa hoàn tất. | **Then:** Giữ lịch sử nghĩa vụ. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-84 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** capsule chưa mở. | **Then:** D35 paused reveal policy áp dụng. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-85 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** export sau Disconnect. | **Then:** Chỉ phạm vi còn được phép. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-86 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** reconnect hai người. | **Then:** Cần consent cả hai. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-87 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** delete Account. | **Then:** Không cascade Partner data. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-88 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** b inactive. | **Then:** A không tự xem B Private. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-89 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** tạo lại tài khoản. | **Then:** Không chiếm dữ liệu Space cũ. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| AC-M10-90 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** mobile/Desktop. | **Then:** Mọi nghiệp vụ P0 dùng được ở cả hai. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |

# 10. Hợp đồng liên phân hệ M01–M09

| Module | Nguồn sự thật (owner) | Contract M10 phải bảo vệ | E2E bắt buộc |
|---|---|---|---|
| M01 — Photobook & Diary | Book/Page/Diary owner/permission; realtime collaboration; published immutable snapshots | Không tự cấp quyền cho Page/Diary Private khi Book Shared. Comments trên Page ID giữ ổn định khi reorder; snapshots sau publish giữ quyền/author phiên bản; unpair không hủy đóng góp Partner. | Shared Book gắn Diary A Private; thu hồi B khi đang edit; restore Book không mất page/source IDs. |
| M02 — Media Library | Media asset/album visibility, original, dedup, snapshot rights | Cover/Avatar/Moment được liên kết dùng asset được phép; chia sẻ cha không auto-share media; deleting original phải xử lý M08 sealed snapshot và full deletion workflow. | Shared Moment gắn asset A Private; A xóa asset đã dùng; B dùng metadata/count tìm ảnh Private. |
| M03 — Food & Places | Place, Wish, Visit, review theo người, Date Plan | M10 giữ author attribution của Visit/Review; linked Place visibility không tự mở Private review; unpair giữ reviews đúng người. | A tạo Visit Private linked Shared Plan; B search/Export không thấy review trái quyền. |
| M04 — Travel & Trip Planner | Trip, Activity, Booking docs, draft budget, transport/accommodations | Space membership + Trip ACL + linked documents/Expense ACL đều phải đạt; unpair đóng shared edit nhưng không xóa Trip đã có contributions. | Trip Shared liên kết Expense A Private; concurrent Activity edit vào thời điểm Disconnect. |
| M05 — Couple Calendar | Calendar Event, Anniversary, RSVP, recurrence, timezone, reminder | Timezone preference chỉ đổi format hiển thị; All-day date không shift UTC; RSVP actor-specific; private busy/free OFF trừ opt-in; Quiet Hours không dời Event. | B đổi timezone, ngày anniversary không đổi; A không RSVP thay B; reminder đến trong quiet hours. |
| M06 — Bucket List & Goals | Wish/Goal, milestone/task, confirmation, linked progress | Contributor/editor không tự xác nhận Both Confirmation; Private Wish linked Shared Goal không tự lộ; disconnect ngăn shared goal updates mới. | Goal Shared link Savings Private; Partner disconnected vẫn mở form submit Task. |
| M07 — Budget & Savings | Expense, payer allocation, settlement, refunds, savings contributions | Owner Space không approve nợ của B; Shared Trip không mở Private Expense; immutable financial audit giữ nguyên khi unpair/delete; không double count linked expense. | A ghi split debt B không duyệt; B vào link M07 qua M04; partially settled lúc disconnect. |
| M08 — Special Moments | Moment, Letter, Surprise, Sealed Capsule, snapshot, recipient/reveal states | Secret/Sealed chịu ACL/time/state trên read, previews, search, export, backup; D35 pause undelivered reveal on Disconnect mà không sửa original sealed manifest/unlock_at; notification independent. | Disconnect ngay trước unlock; restore Sealed sau unlock; queued letter send khi unpair; không tuyên bố E2EE. |
| M09 — Couple Interaction | Comment, Reaction, Mention, Feed, Activity, Notification | ACL nguồn và Interaction Mode cùng hiệu lực; revoke block new reactions/comments; no mention leak; notification read khác Letter/Capsule opened. | Diary access revoked while reply sending; A thả nhiều reactions; old notification direct link. |

## 10.1. Central source-of-truth matrix

| Dữ liệu / hành động | Chủ sở hữu chính | M10 chỉ cung cấp |
|---|---|---|
| Photobook Page Published Version | M01 | Identity, permission, export/delete policy, backup orchestration |
| Original Media Asset, Album Permissions | M02 | Federated effective ACL, storage overview and data rights |
| Place/Visit/Review | M03 | Resource permission and relationship security |
| Trip/Activity/Booking | M04 | Space membership, permission, conflict/lifecycle governance |
| Calendar Event/Anniversary/RSVP | M05 | Locale and notification infrastructure, no duplicate dates |
| Wish/Goal/Completion | M06 | User identity and access; no proxy confirmation |
| Expense/Split/Settlement/Savings | M07 | Actor-specific auth; no shadow financial balance |
| Love Letter/Surprise/Capsule/Seal | M08 | Conditional access, identity, retention, scheduled lifecycle policy |
| Comment/Reaction/Mention/Feed | M09 | Global ACL, central notification, account preferences |
| Account/Space/Session/Effective policy/Notification/Export | M10 | Direct domain ownership |

M10 **không** có quyền ghi đè dữ liệu chủ của domain khác chỉ vì nó là module cuối. Các hợp đồng này cần được chuyển thành contract test trước khi code tích hợp P0.

# 11. Access Control: effective permission, exceptions và chống rò rỉ

## 11.1. Ma trận role và quyền domain-specific

| Khả năng | Owner | Editor | Contributor | Commenter | Viewer |
|---|---|---|---|---|---|
| Xem resource hợp lệ | Có | Có | Có theo phạm vi | Có | Có |
| Chỉnh nội dung gốc | Có | Có theo scope | Phần được cấp | Không | Không |
| Thêm tài nguyên/Task | Theo domain | Theo domain | Theo domain | Không | Không |
| Comment/reaction | Theo nguồn & Interaction Mode | Theo nguồn & Interaction Mode | Theo nguồn & Interaction Mode | Theo nguồn & Interaction Mode | Không mặc định |
| Cấp/thu hồi quyền | Có theo ownership | Chỉ nếu ủy quyền rõ | Không mặc định | Không | Không |
| RSVP M05 thay B | **Không**, nếu A không phải B | Không | Không | Không | Không |
| Expense Approval M07 thay B | **Không**, nếu A không phải B | Không | Không | Không | Không |
| Both Confirmation M06 thay B | **Không**, nếu A không phải B | Không | Không | Không | Không |
| M08 Unlock trước lịch | Không | Không | Không | Không | Không |
| Xuất dữ liệu vượt nguồn | Không | Không | Không | Không | Không |

Việc hiển thị chữ 'Có' vẫn chịu mọi hạn chế do nguồn, tài khoản, trạng thái, membership và điều kiện thời gian quy định. Role không là bằng chứng đã đồng ý nhận một nghĩa vụ.

## 11.2. Chính sách nguồn–đích

1. Read resource cha Shared không tự read child Private.
2. `Share` một đối tượng kèm link tới Private resource phải chỉ rõ người nhận sẽ thấy gì; nếu chưa có quyền thì cho hide/remove link hoặc explicit grant.
3. Toàn bộ đường đọc (UI, API detail, thumbnails, search, autocomplete, activity, counts, report, export, backup download, deep-link, notification preview) dùng chính sách tương đương.
4. History không được để lộ body đã sửa/xóa hoặc các giá trị bí mật qua cột old/new; những quyền audit chuyên biệt cần kiểm soát.
5. Permission Inspector phản ánh effective permission ở trạng thái hiện hành; ghi rõ nguyên nhân deny khi actor hợp lệ, nhưng không tiết lộ tài nguyên Partner Private.
6. Khi quyền thay đổi, request mới revalidate; dữ liệu đã được tải hợp lệ từ trước ra bên ngoài app không thể cam kết thu hồi.

## 11.3. Negative authorization matrix

| Vector | Target | Kết quả |
|---|---|---|
| Direct URL / guessed ID | B → Diary A Private | Deny, không có nội dung/preview. |
| Shared Trip link | B → A Private Expense | Deny dù Trip Shared. |
| Shared Moment media thumbnail | B → A Private photo | Không leak thumbnail/title/count. |
| Search/Analytics | B → Secret Surprise A | Không hiện result hay thống kê suy đoán. |
| Old Notification | B → revoked Moment | Recheck rồi deny. |
| Export request | B → Sealed Capsule | Không có nội dung readable trước unlock. |
| Backup retrieval | User B → raw backup file | Không cung cấp bản sao backup không kiểm soát. |
| Revoke in active tab | B → vừa bị thu hồi quyền edit | Submit bị deny. |
| Modified role payload | A → Approve B Expense | Deny actor-specific approval. |
| Device clock tampering | B → M08 Sealed before due | Không unlock. |
| Unpair while scheduled | A/B → undelivered content | D35 pause reveal/delivery; không bypass sealed state. |

# 12. Notifications, Scheduling & Quiet Hours — contract chung

## 12.1. Phân loại

M01 changes/interactions; M02 media status; M03 date plans; M04 Trip updates; M05 Event/Anniversary reminders; M06 Task/Milestone/Goal; M07 Expense Approval/Settlement/Savings; M08 Letter/Suprise/Capsule; M09 Mention/Comment/Reply/Reaction; M10 pairing/security/export. Mọi event thông báo phải có `source_ref`, `recipient_user_id`, `type`, `dedupe_identity`, `visibility_policy`, `created_at`, `state` và delivery attempts nếu cần.

## 12.2. Notification State không phải Domain State

- M08 Letter `Delivered` xảy ra theo chính sách trao Letter; notification có thể pending/failed nhưng thư vẫn Delivered.
- M08 Capsule `Unlock Eligible` xảy ra theo điều kiện người nhận+time+Space state; notification không phải công tắc mở khóa.
- M07 Expense `Pending Approval` không tự `Approved` khi người dùng đọc notification.
- M05 Event `RSVP` không đổi vì đọc reminder.
- M09 Comment không bị xóa vì người dùng xóa notification.

## 12.3. Quiet Hours và timezone

Preferences từng tài khoản có `quiet_start`, `quiet_end`, timezone applicable và category policy. Với thông báo thông thường, hệ thống có thể gộp hoặc trì hoãn; nhưng domain transition không bị dời. Nếu timezone của user đổi, quiet hours display áp dụng preference hiện hành, không sửa lịch M05 hoặc Capsule đã Seal. Với tình huống DST gap/fold, phải xác định xử lý tại architecture design và cung cấp test.

## 12.4. Notification Preview

`Full`, `Private`, `Hidden` theo khả năng kênh; **chỉ được giảm độ lộ**, không nới quyền nguồn. Secret Surprise chưa reveal phải không có preview tiết lộ; Capsule Sealed chỉ được teaser metadata đã được M08 cho phép. Security Alerts phải được bảo vệ khỏi chứa tokens/password/recovery codes.

## 12.5. Retry and dedup

Thông báo xử lý lại cần tránh trùng do retry. Nếu đối tượng bị xóa/ACL bị thu hồi trong hàng đợi, phải revalidate trước khi hiển thị hoặc mở. Hành động 'mark read' chỉ thay Notification Read State, không thay trạng thái Domain Read/Open.

# 13. Data Governance: export, backup, Trash, restore, deletion

## 13.1. My Data Export và Shared Export

Hai phạm vi riêng biệt: **My Data** gồm nội dung owned/accessible-exportable cá nhân; **Shared Data** gồm nội dung Shared đã được phép xuất. Cả hai phải lọc resource-level và linked-resource level; không bao gồm secrets; không cung cấp readable Sealed data trước unlock; từng artifact xuất phải có chủ yêu cầu, thời hạn, trạng thái, mô tả phạm vi, đơn vị tiền/timestamp và cách từ chối khi quyền thay đổi. Không coi Shared Space Export là câu lệnh dump toàn bộ database.

## 13.2. Backup vs Export

Backup phục vụ hệ thống phục hồi sau sự cố: có thể phải giữ Sealed Capsule Snapshot, Published Photobook và audit/financial ledger trong phạm vi bảo vệ được duyệt. Nó không được cung cấp dạng tải mở cho Partner để tránh bypass reveal/Private. Export là bản dữ liệu mà người dùng được phép đọc. Mức lưu giữ, khóa mã hóa, nơi lưu, tần suất, RPO/RTO, vòng đời đối với dữ liệu đã bị yêu cầu xóa cần được đưa vào bản thiết kế vận hành được phê duyệt.

## 13.3. Restore

- **Item Restore:** đối tượng nằm trong Trash (baseline 30 ngày), actor đủ quyền, nguồn liên kết còn hợp lệ, idempotent restore. Không sinh duplicate event/expense/comment/media và không phục hồi ACL đã bị thu hồi.
- **System Restore:** quản trị theo quy trình có kiểm soát; phải kiểm tra manifest toàn vẹn, dependency order, phiên bản/timestamps, source relations, permission, money balance, recurrence, notification queues, Sealed states, deletion requests/tombstones; không có một nút cho A rollback tất cả dữ liệu Shared.
- **Sau khôi phục:** kiểm thử không phát lại Letter đã Delivered, không phát sinh Settlement trùng, không unlock Capsule sớm hoặc mở lại Secret Surprise; refresh derived aggregates/feeds theo effective permissions.

## 13.4. Trash và deletion

Mỗi domain lưu cách xóa mềm/retention riêng và M10 tổng hợp references; baseline 30 ngày không tự ép domain xóa ngay mọi ảnh Snapshot hoặc audit ledger, cũng không được dùng để giữ dữ liệu vĩnh viễn khi có yêu cầu xóa hợp lệ. Domain exceptions: M01 Published versions; M02 referenced originals; M07 Approved Expense/Settlement history; M08 Sealed content và Delivered Letters. Cần tách `soft_delete`, `archive`, `revoke_access`, `purge_after_eligibility` và `delete_account`.

## 13.5. Chính sách nguồn ảnh và snapshot

Một Avatar/Couple Cover có thể dùng M02 Media theo quyền. Nếu ảnh gốc bị xóa, hiển thị placeholder hoặc xử lý phiên bản được phép theo source; không để Storage Overview hoặc thumbnail reveal sự tồn tại Private. M08 Capsule Snapshot là bản ổn định **trong vòng đời hợp lệ**, nhưng phải có chính sách full deletion và backup retention được ghi nhận.

## 13.6. Export/restore example dataset

Tạo dữ liệu: A Diary Private, A Media Private, Trip Shared, Expense A Private linked Trip, Savings Goal Shared, A/B letters Delivered, Capsule Secret Sealed, A Comment trên Page Photobook, B RSVP và một Calendar recurrence. Export của B chỉ được chứa phần hợp quyền; Restore phải khớp source IDs, money balances và revealed states trước/sau, không tự tái diễn scheduled actions.

# 14. Disconnect & Account Deletion — chính sách được chốt chi tiết

## 14.1. Tách biệt bốn thao tác

| Hành động | Tác động | Consent cần thiết | Có xóa Partner Private? |
|---|---|---|---|
| Log Out | Revoke session hiện tại | Chủ tài khoản | Không |
| Deactivate | Tạm dừng account theo chính sách, có phục hồi | Chủ tài khoản + step-up | Không |
| Disconnect | Ngừng liên kết/cộng tác chung; xử lý shared 30 ngày | **Một bên được quyền làm** + step-up; không cần Partner veto | Không |
| Delete Account | Yêu cầu xóa account và dữ liệu đúng quyền | Chủ tài khoản + step-up, xử lý từng domain | Không tự cascade |

## 14.2. Luồng Disconnect chính thức

1. Actor mở ST-22, thấy danh sách nhóm dữ liệu chung có thể bị ảnh hưởng (không tiết lộ Private Partner).
2. Actor được giải thích rằng Disconnect khác Delete, những dữ liệu đã trao/đối soát/Published có policy riêng.
3. Actor xác thực lại và xác nhận. **Không yêu cầu Partner đang online hoặc chấp thuận**.
4. Space chuyển `Disconnecting/Frozen` ở nguồn có thẩm quyền; mọi new shared writes phải kiểm tra lại. Các request đang bay phải có kết quả atomic hợp lệ, không ghi tiếp như Space Active.
5. Vào cửa sổ xử lý **30 ngày**: ưu tiên read-only cho nội dung chung mà mỗi người còn quyền, cho phép export item/rectification theo quy trình, không cho tạo nghĩa vụ mới.
6. Invalidate pending invites, queued collaborative notifications/actions không còn đúng policy; bảo toàn audit và loại scheduled undelivered theo D35.
7. B nhận thông báo thích hợp về trạng thái Space, nhưng không được biết nguyên nhân/dữ liệu Private của A ngoài điều được chia sẻ hợp lệ.
8. Kết thúc processing theo chính sách đã duyệt, cập nhật Archived/Closed và các lối truy cập/phạm vi còn lại rõ.

## 14.3. Domain-specific disposition matrix

| Loại nội dung | Khi Space Frozen/Disconnecting | Không được làm |
|---|---|---|
| A/B Private Diary/Media/Expense | Giữ thuộc từng account, không self-share | Không cho Partner đọc/xóa/Export. |
| Shared Photobook do cả hai đóng góp | Khóa shared editing mới, bảo vệ provenance và published version; read/export đúng quyền | Không giao toàn bộ tài sản cho người rời hoặc xóa trang Partner. |
| M03 Place/Visit/Review | Giữ cá nhân/Shared ownership và tác giả; hạn chế cộng tác mới | Không đổi đánh giá hoặc Visit của Partner. |
| M04 Trip/Activity | Read-only trong phạm vi hợp lệ; giữ chứng từ tài chính theo M07 | Không tự delete Trip cascade. |
| M05 Event/Anniversary | Ngừng cộng tác/new invites/reminders không còn hợp lệ; giữ lịch sử đúng quyền | Không tự shift all-day date hoặc xóa Event Private. |
| M06 Shared Goal | Chặn shared edits và mutual completion mới; giữ historical progress | Không auto Complete/Cancel thay hai người. |
| M07 Expense/Settlement/Savings | Giữ confirmed balance, audit; cho phép xử lý hậu kỳ theo policy riêng nếu được định nghĩa | Không tạo nợ mới hay xóa lịch sử đã chấp thuận. |
| M08 Delivered Letter / Opened Capsule | Bảo toàn bản đã trao theo quyền và deletion process | Không biến Delivered thành Draft. |
| M08 Scheduled Letter / Unrevealed Surprise / Sealed Capsule chưa Reveal | **Pause delivery/reveal**; giữ original scheduled/unlock timestamp và sealed snapshot; không tự trao | Không tự reveal, không tự thay nội dung/receiver/unlock timestamp. |
| M09 Comments/Reactions | Không có tương tác chung mới; history theo nguồn và quyền hiện tại | Không lộ Private qua feed/notification. |

## 14.4. M08 D35 và M08 sealed contract — giải quyết chính thức

M08 đã chốt rằng Sealed Capsule giữ nguyên nội dung, recipient và `unlock_at`; M10 D35 chốt rằng nội dung **chưa được trao/Reveal** mặc định bị tạm dừng sau Disconnect. Cả hai cùng đúng nếu tách hai trục:

- `content_state`: `Sealed`, immutable manifest và snapshot; không bị rewrite bởi Disconnect.
- `time_eligibility`: `now >= original_unlock_at`, computed từ authoritative time; có thể true trong lúc Space frozen.
- `delivery_reveal_policy_state`: `Allowed / PausedDueToDisconnect / Cancelled / Revealed` theo trạng thái quan hệ và chính sách M08/M10.
- `recipient_open_state`: `Not Opened / Opened`; chỉ set khi người nhận thực sự mở hợp lệ.

Quyền mở = đúng recipient + source policy + Space/lifecycle policy phù hợp + time eligibility + nội dung không cancelled/deleted + không paused. Nếu tới `unlock_at` trong giai đoạn paused, **không tự reveal**; không cập nhật `unlock_at`. Nếu hai người Reconnect, **không tự nối lại** lịch; cần quy trình consent/authorization theo chính sách được duyệt. M10 không làm sai dữ liệu lịch đã Seal; nó thay điều kiện cấp quyền.

V1.0 không cố xử lý tranh chấp sở hữu bằng cách cấp quyền cho một bên đọc bí mật của bên kia. Những trường hợp đầy đủ như người tạo chết/mất khả năng truy cập, quyền lưu giữ sau nhiều năm hoặc hủy Sealed khi hai người bất đồng phải được ghi vào architecture/data governance review và hướng dẫn người dùng rõ giới hạn tính năng.

## 14.5. Delete Account

Phải hiển thị phạm vi: own Private, authored Shared, delivered recipient copies, financial confirmed history, published snapshots, sealed snapshots, audit, backup retention. Người dùng xác thực lại; hệ thống tạo request có trạng thái, xử lý phân loại theo domain. Không tự xóa một tài nguyên chung còn thuộc quyền hợp lệ của Partner; không cho một tài khoản sử dụng quyền xóa để lấy dữ liệu Partner. Không báo `Deleted` nếu chỉ mới Pending/Processing. Account re-registration không tự được gán ID/các quyền cũ.

## 14.6. UI copy bắt buộc cho destructive actions

- Disconnect: "Bạn có thể ngừng liên kết ngay. Dữ liệu cá nhân của người còn lại không bị xóa. Nội dung chung sẽ chuyển sang chế độ xử lý theo chính sách; thư và bất ngờ chưa được trao có thể tạm dừng."
- Delete Account: "Xóa tài khoản khác với ngừng ghép đôi. Một số bản ghi đã trao, nội dung chung hoặc lịch sử đối soát cần xử lý riêng."
- Reconnect: "Ghép đôi lại cần cả hai xác nhận. Quyền chia sẻ cũ và nội dung đã bị tạm dừng không tự khôi phục."
- Account recovery: "Người còn lại trong Couple Space không thể đặt lại mật khẩu hoặc MFA thay bạn."

Lời hiển thị phải cập nhật theo trạng thái và phạm vi thực tế của tài khoản hiện tại; không khẳng định đã xóa dữ liệu ngay nếu chưa hoàn tất.

# 15. Yêu cầu phi chức năng & mức bảo đảm

| Mã | Chủ đề | Kết quả bắt buộc |
|---|---|---|
| NFR-01 | Authentication | Phiên xác thực hết hạn/thu hồi phải được kiểm tra trên mọi protected request, không chỉ UI; không thiết lập mức timeout kỹ thuật trước architecture review. |
| NFR-02 | Authorization | Authorize ở server/source service, tránh IDOR, direct URL bypass, stale link/search/export/access leaks. |
| NFR-03 | Privacy by default | Private ban đầu; explicit sharing; kiểm tra quyền từng asset/item/domain. |
| NFR-04 | Secret management | Không log plaintext password/MFA seed/recovery code/session token/reset token; có cơ chế redaction. |
| NFR-05 | Rate limiting | Có hạn chế và phát hiện thử sai tại login, reset, pairing, MFA, export, delete; ngưỡng cụ thể cần threat model. |
| NFR-06 | Concurrency | Version checks hoặc conflict resolution rõ cho Couple Profile, Pairing, Disconnect, item permission, Restore. |
| NFR-07 | Idempotency | Accept/revoke pairing, revoke session, export, scheduled notifications, restore, disconnect cần idempotent semantics phù hợp. |
| NFR-08 | Durability | Backup phải bao gồm cả object blobs, metadata, tombstones, ACL, manifest, provenance, immutable snapshots. |
| NFR-09 | Recovery | RPO/RTO, retention policy, encryption, offsite, restore drills chốt tại architecture/operations design; không tự đặt con số giả. |
| NFR-10 | Accessibility | Bàn phím, focus, tương phản, reduced motion, zoom/font scale; ưu tiên tác vụ destructive hoặc consent. |
| NFR-11 | Responsiveness | Parity mobile/desktop; không cắt bớt P0 trên điện thoại; không đoán target pixel performance. |
| NFR-12 | Time semantics | Lưu canonical timestamp và timezone đúng; all-day date/anniversary không bị shift vì UTC. |
| NFR-13 | Internationalization | vi-VN P0; tách UI strings và locale display để mở rộng, giữ nội dung người dùng nguyên vẹn. |
| NFR-14 | Observability | Track success/failure/scheduled lifecycle, redacted audit, error reporting không chứa bí mật hoặc hidden content. |
| NFR-15 | Correctness of feedback | Không tuyên bố đã gửi, đã backup, đã export, đã hủy, đã xóa hoàn tất nếu chưa có kết quả xác nhận. |
| NFR-16 | Feature gates | P1/P2 không được làm P0 thiếu an toàn hoặc tự thay đổi quyền/consent đã duyệt. |

## 15.1. Không tự tuyên bố những bảo đảm chưa có

- **Không tự tuyên bố E2EE** chỉ vì ứng dụng chặn UI đọc Capsule khi Sealed. D38 bắt buộc nói chính xác về khả năng bảo mật đã được triển khai và kiểm chứng.
- **Không cam kết vị trí đăng nhập chính xác** khi chỉ có dữ liệu suy đoán. Device info là chỉ dấu tham khảo, không phải bằng chứng tuyệt đối.
- **Không bịa hạn mức dung lượng/tần suất backup/RPO/RTO**. Những giá trị cần đánh giá workload, chi phí, threat model và khả năng vận hành.
- **Không ghi nhận false success** cho login/logout, pairing, export, restore, security updates, scheduled delivery hoặc deletion.
- **Không giả định thu hồi được file đã tải từ thiết bị người dùng**. Có thể chặn truy cập mới qua Our Space, không thể xóa những bản sao bên ngoài nếu không được kiểm soát.

## 15.2. Negative security test suite tối thiểu

Các test sau phải được triển khai ở lớp xử lý có thẩm quyền, không chỉ bằng automation trình duyệt: IDOR/broken object-level authorization, source-child ACL mismatch, timestamp tampering, revoked sessions, stale invitation token, reset link replay, MFA misbinding, export of Private link metadata, secret counts/counters, offline cached request replay, backup restore of tombstoned data, paused scheduled job after Disconnect, approval impersonation. Audit phải redacted, QA fixtures phải tách biệt dữ liệu thật.

# 16. Bộ kịch bản QA end-to-end và dữ liệu mẫu

| QA ID | Kịch bản | Expected invariant | Quyết định liên quan |
|---|---|---|---|
| QA-01 | Hai tài khoản đăng ký và xác minh | Chỉ một active Space sau dual confirmation, không lộ Private trước pairing. | D01–D06 |
| QA-02 | Link mời bị đoán/revoked/expired | Không tạo Space, không tiết lộ Private. | D04–D05 |
| QA-03 | Race Accept vs Revoke | Chỉ một trạng thái cuối, không tạo couple song song. | D02,D04–D05 |
| QA-04 | A/B sửa Couple Profile đồng thời | Version/merge rõ ràng, không silently overwrite. | D08 |
| QA-05 | A đổi Name nhưng các M01–M09 records cũ | Attribution dựa user_id không thay đổi. | D07 |
| QA-06 | B cố đổi credential A | Deny theo account identity, audit an toàn. | D09–D12 |
| QA-07 | Reset expired/used token | Không reset; đã dùng không replay. | D09–D12 |
| QA-08 | MFA setup bị gián đoạn | Không tự chuyển enabled; recovery codes được bảo vệ. | D10 |
| QA-09 | Revoke session từ thiết bị A | Session khác bị revoke không truy cập request mới. | D11 |
| QA-10 | A share Diary kèm ảnh Private | B xem Diary, không thấy ảnh nếu không có quyền media. | D13–D17 |
| QA-11 | Shared Trip M04 có Expense Private M07 | B không xem amount/receipt qua UI, API, Search, Report, Export. | D15–D16 |
| QA-12 | M07 Owner A cố Approve debt của B | Không được chấp thuận theo M07 actor-specific policy. | D18 |
| QA-13 | M08 Capsule Secret Sealed | B không thấy title/count/content nếu Secret; Clock spoof không unlock. | D17,D38 |
| QA-14 | A revoke B đang mở Diary Editor | B submit Edit/Comment bị từ chối, không ghi phiên bản mới. | D13–D16 |
| QA-15 | B dùng notification cũ tới source revoked | Không bypass ACL; có thông báo không khả dụng. | D26–D29 |
| QA-16 | A Dark Mode, B Light Mode | Appearance độc lập, nội dung không đổi. | D19–D21 |
| QA-17 | Reduced Motion + keyboard navigation | Hoàn thành thao tác quan trọng mà không cần animation. | D24 |
| QA-18 | A timezone change, Anniversary all-day | Không shift date của M05; clock presentation đổi đúng. | D23 |
| QA-19 | Quiet Hours trùng Capsule unlock | Eligibility đúng, alert preference có thể hoãn. | D28–D29 |
| QA-20 | M09 Reply notification read | Không đánh dấu M08 Letter/Capsule đã mở. | D26–D29 |
| QA-21 | Export của B trong Space nhiều dữ liệu | Không xuất A Private, M08 Sealed readable, token/recovery code. | D30 |
| QA-22 | Backup với Published M01, Sealed M08 và M07 ledger | Manifest integrity và dependency closure có thể xác minh. | D31,D38 |
| QA-23 | Restore Expense/Settlement/Savings | Không nhân đôi money records, giữ balance/rights. | D31–D32 |
| QA-24 | Restore deleted Goal linked Calendar | Không tạo phantom Event hoặc restored previous ACL. | D31–D32 |
| QA-25 | Storage của B Private | A không thấy size/count trong dashboard. | D13,D30–D32 |
| QA-26 | Disconnect khi B đang sửa Shared Goal | Block shared write ngay sau state transition; không làm mất dữ liệu B cũ. | D33–D34 |
| QA-27 | Disconnect khi có Settlement Pending | Giữ ledger đã xác nhận; không tạo debt tự động mới. | D33–D34 |
| QA-28 | Disconnect trước capsule unlock | Reveal paused, original sealed manifest/unlock timestamp giữ nguyên. | D35,D38 |
| QA-29 | Reconnect sau Disconnect | Dual consent, không tự restore old shares/schedules. | D37 |
| QA-30 | Delete tài khoản A khi B có Shared Photobook | Không cascade delete B contributions; dữ liệu được phân loại. | D36 |
| QA-31 | Two mobile browsers vs desktop | Parity workflow cho account, security, permission, export, disconnect. | D40 |
| QA-32 | Resume pending scheduler/notification after restore | Không gửi Letter/notification hai lần, không reveal paused content. | D26–D31,D35 |

## 16.1. Fixtures QA chuẩn

- Accounts `A`, `B` đã verified, MFA theo test, A/B có session trên mobile và desktop; tài khoản `C` giả làm người ngoài Space dùng để kiểm tra invite/rate limit/authorization, **không phải thành viên thứ ba V1.0**.
- Một Private Diary/Photo/Expense/Goal của A; một Private Diary/Photo/Expense của B; một Shared Trip chứa link tới A Private Expense và một Shared Photobook do cả hai đóng góp.
- M05 Event timed xuyên timezone, Anniversary all-day 29/02, invitation RSVP actor-specific; một Event Private busy/free OFF.
- M07 Expense đã Confirmed chia hai, Partial Settlement, Refund, pending approval; Saving Goal Shared linked M06 Goal.
- M08 Love Letter Draft/Scheduled/Delivered, Secret Surprise/Teaser, Capsule Sealed before/after unlock, Collaborative Capsule chưa đủ confirmation và bản snapshot đã khóa.
- M09 Comment/Reply/Reaction/Mention trên nguồn Shared và Private; old notifications sau revoke.
- Trash items từ M01, M05, M06, M07, M08 ở thời điểm trước/sau expiry 30 ngày; backup manifest hợp lệ và intentionally corrupted/missing link.

## 16.2. Chiến lược kiểm thử

1. **State-machine tests:** invitation, couple lifecycle, account deletion, session revocation, export request, paused reveal; kiểm tra illegal transitions.
2. **Authorization matrix tests:** từng vai trò/actor trên từng nguồn và route đọc–ghi–export–notification, bao gồm resource child Private và source deleted.
3. **Concurrency/replay:** Accept+Revoke, concurrent profile edit, Revoke+Edit, Disconnect+Shared Write, token replay, retries của scheduled jobs.
4. **Cross-domain invariants:** M05 all-day dates, M06 completion confirmation, M07 money ledger, M08 immutability và M09 context target ID.
5. **Recovery/retention:** Item Restore, full restore permission/tombstone, Sealed state, audit integrity và không tự khôi phục unauthorized data.
6. **Accessibility/devices:** thực hiện thao tác nhạy cảm trên mobile/desktop, keyboard, reduced motion, error states và focus management.

## 16.3. Chặn phát hành khi

Không thể release Our Space V1.0 nếu còn lỗi cho phép: B đọc A Private; login reset/Pairing không có dual consent; truy cập bằng revoked session; Owner approve thay B; backup restore mở sớm Capsule; queued scheduled content Reveal sau Disconnect trái D35; Delete Account cascade xóa dữ liệu B; double count Expense; false-success Export/Delete; hoặc bất kỳ P0 M01–M10 chưa đạt nghiệm thu.

# 17. Traceability Matrix: D01–D40 → Screen/BR/UC/AC

| D | Quyết định | Screens | BR | UC | AC |
|---|---|---|---|---|---|
| D01 | Hai User Accounts độc lập và một Couple Space; không chia sẻ mật khẩu. | ST-05, ST-06 | BR-M10-01–10 | UC-M10-01–05 | AC-M10-01–12 |
| D02 | Mỗi User tối đa một Couple Space Active trong V1.0. | ST-05, ST-06 | BR-M10-01–10 | UC-M10-01–05 | AC-M10-01–12 |
| D03 | Có thể dùng chức năng cá nhân trước khi Pairing; nội dung cũ vẫn Private sau Pairing. | ST-05, ST-06 | BR-M10-01–10 | UC-M10-01–05 | AC-M10-01–12 |
| D04 | Pairing Invitation bằng link/mã ngẫu nhiên; mặc định hết hạn sau 48 giờ; thu hồi được. | ST-05, ST-06 | BR-M10-01–10 | UC-M10-01–05 | AC-M10-01–12 |
| D05 | Pairing cần cả hai xác nhận và kiểm tra đúng danh tính người ghép đôi. | ST-05, ST-06 | BR-M10-01–10 | UC-M10-01–05 | AC-M10-01–12 |
| D06 | Hai thành viên bình đẳng; không có super-admin của Space được đọc toàn bộ Private. | ST-05, ST-06 | BR-M10-01–10 | UC-M10-01–05 | AC-M10-01–12 |
| D07 | My Profile: Display Name bắt buộc; Avatar, Nickname, Birthday, Bio tùy chọn. | ST-02–04 | BR-M10-11–18 | UC-M10-06–07 | AC-M10-13–16 |
| D08 | Couple Profile: hai người chỉnh những trường chung được phép, có lịch sử và xử lý xung đột. | ST-02–04 | BR-M10-11–18 | UC-M10-06–07 | AC-M10-13–16 |
| D09 | P0: email/mật khẩu/xác minh email; OAuth Google/Apple ở P1. | ST-07–10, ST-24 | BR-M10-19–33 | UC-M10-08–11 | AC-M10-17–27 |
| D10 | MFA TOTP tùy chọn P0, có quy trình mã khôi phục an toàn. | ST-07–10, ST-24 | BR-M10-19–33 | UC-M10-08–11 | AC-M10-17–27 |
| D11 | Xem Sessions; thu hồi phiên hoặc đăng xuất các thiết bị khác. | ST-07–10, ST-24 | BR-M10-19–33 | UC-M10-08–11 | AC-M10-17–27 |
| D12 | Khôi phục tài khoản có xác thực; Partner không thể chiếm quyền tài khoản còn lại. | ST-07–10, ST-24 | BR-M10-19–33 | UC-M10-08–11 | AC-M10-17–27 |
| D13 | Private mặc định cho mọi phân hệ; Shared chỉ khi có hành động rõ ràng. | ST-11–12 | BR-M10-34–48 | UC-M10-12–13 | AC-M10-28–43 |
| D14 | Các năng lực Owner/Editor/Contributor/Commenter/Viewer theo từng nội dung và quy tắc phân hệ. | ST-11–12 | BR-M10-34–48 | UC-M10-12–13 | AC-M10-28–43 |
| D15 | Quyền tài nguyên liên kết độc lập; quyền cha không tự mở đối tượng Private. | ST-11–12 | BR-M10-34–48 | UC-M10-12–13 | AC-M10-28–43 |
| D16 | Có Permission Inspector hiển thị effective access ngay P0. | ST-11–12 | BR-M10-34–48 | UC-M10-12–13 | AC-M10-28–43 |
| D17 | Conditional Access phục vụ M08 Secret/Recipient/Scheduled Reveal và các trạng thái nguồn. | ST-11–12 | BR-M10-34–48 | UC-M10-12–13 | AC-M10-28–43 |
| D18 | RSVP, Approval, Seal, Completion... không tự suy ra từ Editor/Owner chung. | ST-11–12 | BR-M10-34–48 | UC-M10-12–13 | AC-M10-28–43 |
| D19 | Light, Dark và System Theme thuộc P0. | ST-13–15, ST-01 | BR-M10-49–58 | UC-M10-14–16 | AC-M10-44–54 |
| D20 | Couple Theme có tên, ảnh bìa, màu nhấn và trang trí cơ bản. | ST-13–15, ST-01 | BR-M10-49–58 | UC-M10-14–16 | AC-M10-44–54 |
| D21 | Scrapbook chuyên sâu giới hạn trong M01; không áp dụng mặc định toàn ứng dụng. | ST-13–15, ST-01 | BR-M10-49–58 | UC-M10-14–16 | AC-M10-44–54 |
| D22 | Tiếng Việt P0, tiếng Anh P1; cấu trúc hỗ trợ quốc tế hóa. | ST-13–15, ST-01 | BR-M10-49–58 | UC-M10-14–16 | AC-M10-44–54 |
| D23 | Timezone và date/time format độc lập cho mỗi người; không đổi dữ liệu nguồn. | ST-13–15, ST-01 | BR-M10-49–58 | UC-M10-14–16 | AC-M10-44–54 |
| D24 | Keyboard, labels, contrast, font scaling, reduced motion là yêu cầu P0. | ST-13–15, ST-01 | BR-M10-49–58 | UC-M10-14–16 | AC-M10-44–54 |
| D25 | Homepage có các khối tùy chọn, chỉ hiển thị dữ liệu đúng quyền. | ST-13–15, ST-01 | BR-M10-49–58 | UC-M10-14–16 | AC-M10-44–54 |
| D26 | Một Notification Center dùng chung cho các phân hệ M01–M10. | ST-16–17 | BR-M10-59–71 | UC-M10-17–18 | AC-M10-55–66 |
| D27 | In-app notification P0; email và push P1. | ST-16–17 | BR-M10-59–71 | UC-M10-17–18 | AC-M10-55–66 |
| D28 | Preferences và Quiet Hours độc lập theo tài khoản. | ST-16–17 | BR-M10-59–71 | UC-M10-17–18 | AC-M10-55–66 |
| D29 | Trạng thái nghiệp vụ và quyền mở nội dung không phụ thuộc gửi notification thành công. | ST-16–17 | BR-M10-59–71 | UC-M10-17–18 | AC-M10-55–66 |
| D30 | My Data/Shared Data Export theo quyền; không đọc được Sealed Content trước unlock. | ST-18–21 | BR-M10-72–84 | UC-M10-19–21 | AC-M10-67–78 |
| D31 | Backup tự động P0, System Restore có kiểm soát không thể một người đơn phương ghi đè chung. | ST-18–21 | BR-M10-72–84 | UC-M10-19–21 | AC-M10-67–78 |
| D32 | Trash 30 ngày; ngoại lệ domain theo M01–M09 không bị xóa bỏ. | ST-18–21 | BR-M10-72–84 | UC-M10-19–21 | AC-M10-67–78 |
| D33 | Một thành viên có thể Disconnect không cần thành viên kia đồng ý. | ST-22–23 | BR-M10-85–95 | UC-M10-22–24 | AC-M10-79–89 |
| D34 | Sau Disconnect ngừng cộng tác chung mới; giai đoạn xử lý dữ liệu 30 ngày, read-only khi phù hợp | ST-22–23 | BR-M10-85–95 | UC-M10-22–24 | AC-M10-79–89 |
| D35 | Mặc định tạm dừng nội dung hẹn gửi/chưa reveal sau Disconnect, có chính sách ngoại lệ rõ ràng. | ST-22–23 | BR-M10-85–95 | UC-M10-22–24 | AC-M10-79–89 |
| D36 | Delete Account yêu cầu xác thực tăng cường, không cascade xóa dữ liệu hợp lệ của Partner. | ST-22–23 | BR-M10-85–95 | UC-M10-22–24 | AC-M10-79–89 |
| D37 | Reconnect cần cả hai đồng ý; không tự mở lại quyền/đường dẫn/notification cũ. | ST-22–23 | BR-M10-85–95 | UC-M10-22–24 | AC-M10-79–89 |
| D38 | Capsule Sealed là product-level access control; không tự quảng cáo mã hóa đầu cuối. | ST-12, ST-19–23 | BR-M10-45, 75, 79, 90 | UC-M10-13, 19, 22 | AC-M10-39, 69, 73, 84 |
| D39 | Security Activity/Audit ghi sự kiện quan trọng, không lưu thông tin xác thực bí mật. | ST-24 | BR-M10-10, 30–31, 47, 95 | UC-M10-08–11, 23 | AC-M10-26–27 |
| D40 | Mọi P0 đầy đủ trên desktop/mobile. | ST-01–24 | All BR-M10 | All UC-M10 | AC-M10-90 |

## 17.1. Trace các chủ đề cắt ngang

| Chủ đề | Nguồn quyết định | Truy vết thêm |
|---|---|---|
| Private by default | D13, D15–18 | BR34–48; AC28–43; Security negative suite; M01–M09 access contracts |
| Couple Space lifecycle | D01–06, D33–37 | BR01–10, BR85–95; UC03–05,22–24; AC01–12,79–89 |
| Scheduled content sau Disconnect | D35, D38 | M08 D16–23; UC22; EX48; AC84; QA28–29 |
| Expense approval/ledger retention | D18, D31–36 | M07 D08, D11, D12, D26, D29; AC40,72,83; QA12,23,27 |
| Notification vs state | D26–29 | M05/M08/M09; BR59–71; AC55–66; QA19–20,32 |
| Export/restore lifecycle | D30–32 | M01 Published, M02 originals, M08 snapshots; BR72–84; AC67–78 |
| Device parity | D40 | ST01–24; UC01–24; AC90; QA31 |

# 18. Mức ưu tiên P0, P1, P2 và release gates

## 18.1. P0 — bắt buộc trước V1.0

**Accounts/Pairing:** user identity, email verify, login/reset/sessions, independent accounts, invite+consent, active membership invariants. **Security:** optional TOTP MFA with recovery, session revocation, audit, permission service, resource ACL, conditional reveal, linked-resource privacy. **UI:** profiles, couple theme, Light/Dark/System, vi-VN locale, user timezone/format, reduced motion, home customization. **Notifications:** one in-app center, categories, Preferences, Quiet Hours, deep-link reauthorization, domain independence. **Data:** storage access-scope, Export, automated backup & controlled restore, Trash Center, Item Restore, security events. **Lifecycle:** Disconnect without partner veto, 30-day shared processing, paused undelivered content, account deactivation/deletion/reconnect, partner data protection. **Device parity:** all listed P0 flows mobile+desktop.

## 18.2. P1 — chỉ triển khai sau P0 hoặc khi thay đổi phạm vi

OAuth provider login; en-US locale; email/push, advanced theme/home layout, import with dedup, additional MFA channels, advanced backup analysis, device activity reporting và operational audit tools. P1 không tự mở rộng quyền, retention hoặc giới hạn hai tài khoản.

## 18.3. P2 — future scope

Nhiều active Spaces, nhiều thành viên, external public sharing, AI organization/personalization, freeform theming; tất cả cần review kiến trúc và privacy mới, không phải phần của V1.0.

## 18.4. P0 release gate

Chỉ coi M10 đạt khi toàn bộ AC01–90 và các QA quan trọng đã pass hoặc có acceptance exception được Product Owner phê duyệt rõ nhưng **không được miễn các lỗi bảo mật/nghiệp vụ bất biến**; các P0 M01–M09 cũng đã nghiệm thu. Không dựa vào giao diện đẹp để bỏ qua authorization/restore tests.

# 19. Definition of Done — M10

- [ ] D01–D40 được phản ánh chính xác trong trạng thái, form, permission và workflow; không thêm lựa chọn trái chính sách.

- [ ] User Accounts độc lập; invitation 48 giờ và dual consent; không tạo nhiều active memberships.

- [ ] Có thể dùng dữ liệu cá nhân trước Pairing; dữ liệu cũ vẫn Private sau Pairing.

- [ ] Email verification, reset và session management an toàn, không có reset credential của Partner.

- [ ] TOTP MFA tùy chọn, recovery và step-up cho hành động nhạy cảm.

- [ ] Profile/Couple Profile có version conflict và Media rights; User ID/attribution không đổi.

- [ ] M01–M09 tạo nội dung Private mặc định; ACL được kiểm tra server-side ở mọi đường.

- [ ] Permission Inspector mô tả effective quyền trên resource và linked resources.

- [ ] Không dùng Space Owner để tự Approve M07 hoặc chấp thuận M06/M05 thay Partner.

- [ ] Secret Surprise và Sealed Capsule không rò rỉ qua URL, Search, Notification, Export, Count.

- [ ] Light/Dark/System, vi-VN, locale, timezone, a11y, reduced motion và Homepage cá nhân hoạt động.

- [ ] Một Notification Center thống nhất; Quiet Hours không làm trì hoãn unlock và state nghiệp vụ.

- [ ] Export My/Shared Data đúng quyền, không chứa credential hoặc readable Sealed content.

- [ ] Backup manifest có integrity check; controlled System Restore giữ domain states and tombstones.

- [ ] Trash ≥30 ngày, Item Restore đúng quyền, không resurrect revoked grants hoặc source phantom.

- [ ] Disconnect đơn phương có hiệu lực; shared writes bị chặn, 30 ngày xử lý data rights.

- [ ] Unrevealed scheduled content bị paused theo D35 nhưng Sealed manifest/unlock_at bất biến.

- [ ] Reconnect có dual consent, không tự mở lại old permissions/schedules.

- [ ] Deactivate/Delete khác Disconnect; không cascade xóa dữ liệu thuộc Partner.

- [ ] Audit redacted; không false-success, không dùng deleted/cached permissions làm bypass.

- [ ] AC-M10-01–90 có kết quả test; EX-M10-01–50 có xử lý rõ; QA-01–32 được bao phủ.

- [ ] P0 có device parity mobile và desktop, lỗi thao tác được xử lý, không phụ thuộc animation.

- [ ] Các conflict với BRD M01–M09 được ghi trong Cross-BRD Review và Product Owner duyệt change control.

- [ ] Toàn bộ P0 của M01–M10 đạt gate trước khi chốt Our Space V1.0.

# 20. Open Issues và bước chuyển giao Codex

| Mã | Vấn đề chưa chọn kỹ thuật/chi tiết bổ sung | Chủ trì | Ràng buộc |
|---|---|---|---|
| OPEN-M10-01 | Threat model, session TTL, token storage, rate-limit thresholds | Security design | Không bịa thông số trước khi kiểm chứng và lựa chọn hạ tầng. |
| OPEN-M10-02 | Password hashing/KDF, recovery proofing, TOTP secret lifecycle | Security design | Thỏa D09–D12 và BR19–33. |
| OPEN-M10-03 | Permission evaluation API, resource-ref schema, caching invalidation | Architecture | Tuân thủ effective ACL và source ownership M01–M09. |
| OPEN-M10-04 | Exact backup schedule, integrity checks, retention, RPO/RTO and restore drills | Operations/Security | Không hứa recovery objective chưa có khả năng thực hiện. |
| OPEN-M10-05 | Deletion and retention of immutable published/sealed snapshots and backups | Data governance | Immutable không có nghĩa vĩnh viễn ngoài quyền xóa hợp lệ. |
| OPEN-M10-06 | Shared export rights and handling of jointly authored artifacts after Disconnect | Data governance/Product | Không trao quyền đơn phương rộng hơn đã phê duyệt. |
| OPEN-M10-07 | Detailed resolution process for previously Sealed undelivered content after Reconnect | Product/Security | Không tự unpause; phải lưu original unlock timestamp. |
| OPEN-M10-08 | Dormant-account/death/incapacity and dispute handling | Product/Security | Không tự coi Partner có quyền chiếm account/Secret Capsule. |
| OPEN-M10-09 | Central notification platform implementation, scheduler idempotency, alert preview policy | Architecture | In-app P0 và domain independent delivery. |
| OPEN-M10-10 | Email provider, MFA recovery and abuse/spam protection | Security/Operations | Xác minh danh tính và tránh enumeration. |
| OPEN-M10-11 | Locale fallback, a11y test standard, theme tokens, mobile device matrix | UX/QA | Đồng bộ với M01 scrapbook ngoại lệ và 9 module còn lại. |
| OPEN-M10-12 | Cross-BRD consistency decisions with existing BRD versioning | Product Owner | Ghi change request, không sửa file cũ âm thầm. |

## 20.1. Tài liệu tiếp theo (chưa phải thay đổi quyết định)

1. **Master BRD / System Overview**: sơ đồ M01–M10, P0 release scope, navigation và ưu tiên.
2. **Cross-BRD Consistency Review**: rà soát các quy tắc trùng nhau, phân quyền dùng chung, thời điểm/backup, lifecycle và contradictory states. Mỗi thay đổi phải có impact + owner approval.
3. **Cross-module Data Contracts & Domain Model**: source of truth, references, domain events, resource ownership, idempotency, versioning.
4. **Global Authorization Matrix**: role capabilities, per-resource visibility, recipient access, Secret/Sealed and exception cases.
5. **Account Lifecycle & Data Retention Policy**: Pairing, Disconnect, export, backup, deletion, consent and snapshot lifecycle.
6. **Security Architecture, Notification/Scheduler & Backup/Restore Design**: công nghệ sẽ được đánh giá sau khi biết môi trường triển khai.
7. **Implementation/QA Plan for Codex**: work packages, dependencies, migrations, module tests và E2E security gates.

## 20.2. Checklist bàn giao

- [ ] Đưa file `OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md` vào `OurSpace/Docs/` cùng M01–M09.
- [ ] Không thay BRD M01–M09 bằng bản mô tả lại; dùng liên kết tham chiếu tới chính file được duyệt.
- [ ] Gắn D01–D40 vào thiết kế kiến trúc; các Open Issue phải được xử lý hoặc ghi rõ quyết định sau này.
- [ ] Chưa viết code chỉ dựa vào M10 mà bỏ contract/domain tests M01–M09.
- [ ] Bắt buộc chạy kiểm thử ACL/authorization, Pairing/Disconnect/Restore, notifications và P0 parity trước V1.0.

## 20.3. Trạng thái dự án khi phê duyệt M10

- **M01–M09:** Đã phê duyệt nghiệp vụ và có BRD V1.0.
- **M10:** Đã phê duyệt toàn bộ đề xuất D01–D40, BRD V1.0 này là tài liệu chính thức.
- **Tổng cộng:** **10/10 phân hệ đã chốt nghiệp vụ**. Chưa chọn công nghệ triển khai và chưa lập trình Our Space từ các BRD này.
- **Bước kế tiếp hợp lý:** Cross-BRD Consistency Review → kiến trúc dùng chung → kế hoạch triển khai với Codex → phát triển/test P0 trên cả 10 phân hệ.

---

**END OF OUR SPACE M10 BRD V1.0 — APPROVED BUSINESS REQUIREMENTS**
