---
document_id: OURSPACE-MASTER-P0-ACCEPTANCE-MATRIX
version: 1.0
status: DRAFT_BASELINE_QA_NOT_RUN
created: 2026-10-23
modules: M01..M10
baseline_ac_count: 763
tech_stack: NOT_SELECTED
---

# OUR SPACE — MASTER P0 ACCEPTANCE MATRIX DRAFT V1.0

**Mục đích:** Release gate P0 xuyên 10 phân hệ, có cột test trên **desktop** và **mobile**, nguồn từng BRD AC và ca kiểm thử liên phân hệ. Đây là **ma trận trước triển khai**, chưa có chứng cứ QA; `NOT_RUN` là trạng thái trung thực, không phải lỗi hay pass.

**Nguồn đã duyệt:** BRD V1.0 M01–M10, 247 Dxx; Approved Policy Supplement DEC-01–DEC-07/A1–A5. CT-01–CT-08 chỉ là contract draft phụ trợ, **không tự thay BRD**. Không thêm P1/P2 vào P0.

## 1. Điều kiện release: tất cả phải đồng thời đúng

1. Mọi P0 feature family của **cả 10 module** đều hoàn thành nghiệm thu, không cho release 9/10.
2. Desktop và mobile **cùng hoàn thành nghiệp vụ**: tạo/sửa/xem/xác nhận/chia sẻ/xuất/xóa/khôi phục khi được phép; không chấp nhận mobile chỉ read-only đối với nghiệp vụ P0.
3. Mỗi mã AC gốc được truy vết, đánh giá scope theo BRD và ghi kết quả desktop/mobile (hoặc lý do áp dụng môi trường chung được QA duyệt); các kịch bản tiêu cực Private/Secret/Sealed/Finance phải pass.
4. E2E cross-module, 2 tài khoản độc lập, thao tác đồng thời, network retry, revoke, export và **restore drill bằng dữ liệu thật** có chứng cứ.
5. Khi lỗi xâm phạm quyền Private/Secret, early Reveal, duplicate confirmed finance, sai nguồn dữ liệu, không khôi phục hợp lệ, mất acknowledged content hoặc vi phạm mobile P0 → `BLOCKED` bất kể điểm UI khác.
6. Exceptions phải được phê duyệt bởi PO nếu ảnh hưởng tính năng P0; không chấp nhận ngoại lệ an ninh phá các bất biến đã duyệt.

**Scope discipline:** Danh mục **763 AC** là tổng số acceptance records của 10 BRD, chưa được tự động coi tất cả là độc lập P0. Mỗi dòng CSV có `scope=BRD_AC_BASELINE__CHECK_P0_SCOPE` để bước QA đối chiếu phân loại gốc; không nâng trường hợp P1/P2 thành P0. Nếu một AC nguyên gốc kiểm thử chung mọi thiết bị, vẫn phải chứng minh tác động tới P0 mobile/desktop.

## 2. Bản đồ nguồn và số lượng Acceptance Criteria

| Module | BRD AC | Coverage family | QA desktop | QA mobile | QA E2E |
|---|---:|---:|---|---|---|
| M01 | 72 | 10 | NOT_RUN | NOT_RUN | NOT_RUN |
| M02 | 66 | 8 | NOT_RUN | NOT_RUN | NOT_RUN |
| M03 | 80 | 8 | NOT_RUN | NOT_RUN | NOT_RUN |
| M04 | 70 | 8 | NOT_RUN | NOT_RUN | NOT_RUN |
| M05 | 75 | 8 | NOT_RUN | NOT_RUN | NOT_RUN |
| M06 | 75 | 8 | NOT_RUN | NOT_RUN | NOT_RUN |
| M07 | 85 | 10 | NOT_RUN | NOT_RUN | NOT_RUN |
| M08 | 85 | 8 | NOT_RUN | NOT_RUN | NOT_RUN |
| M09 | 65 | 8 | NOT_RUN | NOT_RUN | NOT_RUN |
| M10 | 90 | 10 | NOT_RUN | NOT_RUN | NOT_RUN |
| **Tổng** | **763** | **86** | **NOT_RUN** | **NOT_RUN** | **NOT_RUN** |

## 3. P0 Feature Family Gate — phải kiểm thử trên cả hai nền tảng

Các dòng `P0-Mxx-nn` là **nhóm nghiệm thu** được rút từ mục P0 gốc, không thay thế từng AC chi tiết. Cột Desktop/Mobile đang `NOT_RUN`. Nếu nghiệp vụ có cách biểu diễn khác trên thiết bị, QA phải chứng minh cùng khả năng hoàn thành theo quyền.

| Gate ID | P0 feature family | Expected / Negative bắt buộc | Nguồn | Desktop | Mobile |
|---|---|---|---|---|---|
| P0-M01-01 | Photobook Library / Create / Overview / Reader | Tạo Book Private mặc định; danh sách, tạo, xem, lật trang; quyền khác nhau giữa A và B | M01 §2.4; D01–D02/D06 | NOT_RUN | NOT_RUN |
| P0-M01-02 | Page Manager / layouts | Thêm/xóa/sắp Page, orientation Portrait/Landscape; không phá Page identity | M01 §2.4, §6–8 | NOT_RUN | NOT_RUN |
| P0-M01-03 | Simple Editor / templates | Chọn template, sửa slot text/photo/sticker, chuyển Advanced không mất layer; 8–12 template | M01 §2.4, §7 | NOT_RUN | NOT_RUN |
| P0-M01-04 | Advanced Editor | Text/sticker/shape/media/background; canvas zoom/pan và chỉnh object trên mobile | M01 §2.4, §8 | NOT_RUN | NOT_RUN |
| P0-M01-05 | Realtime 2 accounts | Cùng gõ/di chuyển/undo/reconnect, không mất acknowledged edits | M01 D08–D10, §9 | NOT_RUN | NOT_RUN |
| P0-M01-06 | Permissions Page/Book | Private, Viewer/Editor, Page override, direct-link revocation | M01 D06–D08, M10 §11 | NOT_RUN | NOT_RUN |
| P0-M01-07 | Diary & Snapshot | Diary event date/timeline, editor/detail, copy snapshot có quyền | M01 §10–11 | NOT_RUN | NOT_RUN |
| P0-M01-08 | Publish/Version/History | Only authorized publish; immutable Publication + Revision Draft + Restore | M01 D07, §4.5–4.7 | NOT_RUN | NOT_RUN |
| P0-M01-09 | PDF Export | PDF đúng quyền Page/Media; thất bại không trả file hỏng | M01 D05, §12–13 | NOT_RUN | NOT_RUN |
| P0-M01-10 | Archive/Trash 30d/Restore | Không cascade asset nguồn; history/links hợp lệ | M01 §13, M10 §13 | NOT_RUN | NOT_RUN |
| P0-M02-01 | Upload batch/retry/dedup | Upload ảnh/video, per-file states, không bỏ cả batch khi một file lỗi | M02 §2.1, §4 | NOT_RUN | NOT_RUN |
| P0-M02-02 | Gallery / Viewer / Search | List/grid viewer, filters tags metadata, favorites, video fallback | M02 §2.1, §5 | NOT_RUN | NOT_RUN |
| P0-M02-03 | Manual Album / Smart basic | Một asset nhiều album không clone original | M02 D06–D07 | NOT_RUN | NOT_RUN |
| P0-M02-04 | Photo Edit variants | Crop/rotate/color variant; original giữ nguyên | M02 ML-08 | NOT_RUN | NOT_RUN |
| P0-M02-05 | Asset sharing/permissions | Keep Private/Share Existing/Shared Copy, revoke và preview đúng quyền | M02 §8.5, §10 | NOT_RUN | NOT_RUN |
| P0-M02-06 | Cross-module Asset reuse | M01/M03/M04/M08 liên kết đúng media ID và usage khi xóa | M02 §10–12 | NOT_RUN | NOT_RUN |
| P0-M02-07 | Trash/Restore/Export | 30d Trash, chỉ export data đủ quyền | M02 §12–13 | NOT_RUN | NOT_RUN |
| P0-M02-08 | Storage dashboard/Backup | Storage visible scope và restore từ bản backup thực | M02 §13; §18–19 | NOT_RUN | NOT_RUN |
| P0-M03-01 | Place categories & branches | Tạo đủ loại Place, không bắt buộc menu; source URL không tự bịa dữ liệu | M03 D01–D04, §2.1 | NOT_RUN | NOT_RUN |
| P0-M03-02 | Place search/details/tags | List, details, filters, media cover, tọa độ/đường đi hợp lệ | M03 §2.1 | NOT_RUN | NOT_RUN |
| P0-M03-03 | Wishlist Entry / Collections | Personal/shared; nhiều collection; khác M06 Wish | M03 D05–D06, CR-016 | NOT_RUN | NOT_RUN |
| P0-M03-04 | Date Plan lifecycle | Idea→Scheduled→Completed/Cancelled etc; linked M05 Event đúng quyền | M03 D07, DEC-05 | NOT_RUN | NOT_RUN |
| P0-M03-05 | Visit & Review | Mỗi lần ghé một Visit; rating 1–5 bước .5, scope đúng | M03 D08–D10 | NOT_RUN | NOT_RUN |
| P0-M03-06 | Dish/Drink/Favorites/Revisit | Only when relevant; trạng thái mỗi user không trộn | M03 D09–D12 | NOT_RUN | NOT_RUN |
| P0-M03-07 | Random Picker & Insights | Candidate filter, counts/insights theo actor-visible scope | M03 D13–D14 | NOT_RUN | NOT_RUN |
| P0-M03-08 | Link & Export/Trash | M02/M04/M05/M07/M09 liên kết đúng; không cascade; 30d restore | M03 §12; §2.1 | NOT_RUN | NOT_RUN |
| P0-M04-01 | Trip lifecycle | Dreaming/Quick/Full trip, no fake dates; search | M04 §2 P0 | NOT_RUN | NOT_RUN |
| P0-M04-02 | Itinerary Activities | Ngày, unscheduled, reorder/timezone, conflicts đúng quyền | M04 §7, §2 P0 | NOT_RUN | NOT_RUN |
| P0-M04-03 | Transport/Accommodation/Booking | Chi tiết và tài liệu riêng từng object, file ACL | M04 §8, §11 | NOT_RUN | NOT_RUN |
| P0-M04-04 | Packing/Preparation | Checklist, assign, save progress | M04 §9 | NOT_RUN | NOT_RUN |
| P0-M04-05 | Cross-source link | M03 Place/Visit, M05 Event, M07 Expense/Budget, M02 Media, M01 Diary | M04 §13, DEC-05 | NOT_RUN | NOT_RUN |
| P0-M04-06 | Privacy/collaboration | No private booking/receipt inference, conflict detection | M04 §11–13 | NOT_RUN | NOT_RUN |
| P0-M04-07 | Trip Recap & Export | Basic Recap; structured export P0, **không** ép pretty PDF P1 | M04 D22, §12.3 | NOT_RUN | NOT_RUN |
| P0-M04-08 | Archive/Trash/Restore | Không xóa Place/Expense/Event khi Trip xóa | M04 §12–13 | NOT_RUN | NOT_RUN |
| P0-M05-01 | Month/Week/Day/Agenda | 4 views, correct timezone/ACL | M05 §1.2, AC-M05-01..15 | NOT_RUN | NOT_RUN |
| P0-M05-02 | Event/RSVP | Private/Shared, create/edit/cancel, Going/Maybe/No Response | M05 §1.2, AC-M05-16..27 | NOT_RUN | NOT_RUN |
| P0-M05-03 | Anniversary/date precision | Original date, Feb-29, month/day no birth year without age | M05 §1.2, DEC-06 | NOT_RUN | NOT_RUN |
| P0-M05-04 | Recurrence/Exception | Series/Occurrence/This&following, nth weekday and day31 | M05 §9, DEC-05/06 | NOT_RUN | NOT_RUN |
| P0-M05-05 | Reminders/Quiet Hours | In-app reminder P0, dedupe and user prefs; no push/email P0 | M05 §10, M10 §12 | NOT_RUN | NOT_RUN |
| P0-M05-06 | Conflict & Busy/Free | Scoped conflict, Busy/Free default OFF | M05 §11 | NOT_RUN | NOT_RUN |
| P0-M05-07 | M03/M04 sync links | Canonical Event time, cancel/unlink explicit, no duplicates | M05 §12, DEC-05 | NOT_RUN | NOT_RUN |
| P0-M05-08 | Search/history/Trash/Export | Structured export, 30d Trash, restore current ACL | M05 §13–14 | NOT_RUN | NOT_RUN |
| P0-M06-01 | Wish & Collections | Create with name; no artificial deadline; personal/shared | M06 §1.2 | NOT_RUN | NOT_RUN |
| P0-M06-02 | Wish-to-Goal conversion | Không xóa Wish gốc, explicit link | M06 §5 | NOT_RUN | NOT_RUN |
| P0-M06-03 | Goal four types | Checklist/Numeric/Outcome/Linked, Draft before Active | M06 §6–7 | NOT_RUN | NOT_RUN |
| P0-M06-04 | Task/Milestone/Progress | Status, assignee, history, no auto completion | M06 §8 | NOT_RUN | NOT_RUN |
| P0-M06-05 | Confirmation/Achievement | Owner/Both confirmation valid before Completed | M06 §9 | NOT_RUN | NOT_RUN |
| P0-M06-06 | Linked Goal privacy | M07 balances protected, stale not zero, actor visible metric | M06 §11, CT-01/04 | NOT_RUN | NOT_RUN |
| P0-M06-07 | Inspiration Board | M02 asset reuse with original permissions | M06 §10 | NOT_RUN | NOT_RUN |
| P0-M06-08 | Search/Export/Trash/Restore | Per object ACL; 30d Trash, no cascade | M06 §12–14 | NOT_RUN | NOT_RUN |
| P0-M07-01 | Money Spaces & ACL | Private/Shared, not infer hidden amounts via reports | M07 D01–D03/D27 | NOT_RUN | NOT_RUN |
| P0-M07-02 | Expense & Payers | Create/edit/receipt, multi-payer, actual vs estimates | M07 D04–D05 | NOT_RUN | NOT_RUN |
| P0-M07-03 | Split & Approval | Equal/Fixed/Percentage/Weighted; partial approval no forced debt | M07 D06–D10 | NOT_RUN | NOT_RUN |
| P0-M07-04 | Settlement partial | Recipient confirmation; pending not reduce debt | M07 D11–D13 | NOT_RUN | NOT_RUN |
| P0-M07-05 | Refund/Adjustment | Post settlement new events, no overwriting | M07 DEC-04.A1–A2 | NOT_RUN | NOT_RUN |
| P0-M07-06 | Budgets & alerts | Monthly/category/trip/custom, thresholds 80/100/>100 | M07 D18–D23 | NOT_RUN | NOT_RUN |
| P0-M07-07 | Savings Goals | Contributions/withdrawal, not bank balance | M07 §7.4 | NOT_RUN | NOT_RUN |
| P0-M07-08 | Recurring expenses | Occurrence pending, not automatically paid | M07 §7.5 | NOT_RUN | NOT_RUN |
| P0-M07-09 | Multi-FX | Manual approved FX, currencies not mixed | M07 D24–D25, DEC-04 | NOT_RUN | NOT_RUN |
| P0-M07-10 | Reports/export/recovery | Actor-visible and idempotent restore, 30d Trash | M07 §8, §13–15 | NOT_RUN | NOT_RUN |
| P0-M08-01 | Moments/collections | Timeline, personal perspectives; occurred date vs created date | M08 §1.2 | NOT_RUN | NOT_RUN |
| P0-M08-02 | Milestone ↔ Anniversary | M05 owns anniversary, M08 consumes | M08 §4 | NOT_RUN | NOT_RUN |
| P0-M08-03 | Love Letters | Draft/send/schedule, Delivered vs each recipient Opened | M08 D08–D12 | NOT_RUN | NOT_RUN |
| P0-M08-04 | Secret Surprise | Default Secret, optional Teaser, no leaks | M08 D13–D15 | NOT_RUN | NOT_RUN |
| P0-M08-05 | Capsule build/seal | Ready, contribution/consent, immutable snapshot | M08 D16–D21 | NOT_RUN | NOT_RUN |
| P0-M08-06 | Unlock & recipient state | Trusted time, per recipient, cannot open early | M08 D20–D23 | NOT_RUN | NOT_RUN |
| P0-M08-07 | Disconnect/Reconnect | Pause unrevealed D35, no auto unpause | M10 D35, DEC-02 | NOT_RUN | NOT_RUN |
| P0-M08-08 | History/Trash/Export/Backup | Source ACL, deletion exceptions, no replay | M08 §13–15, DEC-01 | NOT_RUN | NOT_RUN |
| P0-M09-01 | Reactions six types | At most one active reaction per actor/target, retry safe | M09 §1.2 | NOT_RUN | NOT_RUN |
| P0-M09-02 | Comments/replies | Text/link/emoji, max 2 display levels, edit marker | M09 §1.2 | NOT_RUN | NOT_RUN |
| P0-M09-03 | Mentions/feed | Only authorized targets, no existence leak | M09 §1.2/§5 | NOT_RUN | NOT_RUN |
| P0-M09-04 | Interaction modes | Both/Reactions Only/Comments Only/Read Only; cannot raise ACL | M09 §1.2 | NOT_RUN | NOT_RUN |
| P0-M09-05 | Domain integrations | Comment not review/RSVP/approval/Goal completion; no independent chat | M09 D16–D20 | NOT_RUN | NOT_RUN |
| P0-M09-06 | Notifications | M10 one notification center, M09 producer | M09 CI-09, M10 §12 | NOT_RUN | NOT_RUN |
| P0-M09-07 | Trash/Export/Restore | Comments soft delete/restore 30d; no orphan leak | M09 §13 | NOT_RUN | NOT_RUN |
| P0-M09-08 | Concurrency/mobile parity | Retry, no duplicates, same P0 device flows | M09 D23–D24 | NOT_RUN | NOT_RUN |
| P0-M10-01 | 2 Accounts & Pairing | Independent accounts, verification, invite 48h, mutual consent | M10 D01–D06 | NOT_RUN | NOT_RUN |
| P0-M10-02 | Security sessions/MFA | Optional TOTP + recovery, session revoke, audit; no super-admin | M10 D19–D25 | NOT_RUN | NOT_RUN |
| P0-M10-03 | Permissions/Inspector | Private per object, linked ACL/conditional reveal; tests 2 accounts | M10 D13–D18 | NOT_RUN | NOT_RUN |
| P0-M10-04 | Profile/theme/locale | Profiles, Light/Dark/System, vi-VN, TZ/reduced motion | M10 D07–D12 | NOT_RUN | NOT_RUN |
| P0-M10-05 | Home customization | Personal/shared Home projection respects ACL | M10 §7–8 | NOT_RUN | NOT_RUN |
| P0-M10-06 | Notification Center | In-app one center, prefs/Quiet Hours/category, stale links | M10 D26–D29, DEC-07 | NOT_RUN | NOT_RUN |
| P0-M10-07 | Export & Trash Center | Per-authority export, 30d Trash, restore no ACL revival | M10 D30–D32 | NOT_RUN | NOT_RUN |
| P0-M10-08 | Automated backup & recovery | Protected backup, actual restore no replay | M10 D30–D32, CT-07 | NOT_RUN | NOT_RUN |
| P0-M10-09 | Disconnect/Space lifecycle | Frozen→Closed, 30d shared processing, no premature Capsule Reveal | M10 D33–D38 | NOT_RUN | NOT_RUN |
| P0-M10-10 | Mobile + Desktop parity | All 10 modules P0 flows, including writing/approval | M10 D40 | NOT_RUN | NOT_RUN |

## 4. Cross-BRD E2E Gate — kiểm thử tích hợp và nguy cơ nghiêm trọng

Mọi E2E dưới đây phải được thực hiện với hai account độc lập và các quyền khác nhau, trên mobile và desktop khi luồng tương ứng là P0. Các expected chứa chính sách DEC đã duyệt (không dùng kết luận `POLICY_PENDING` của Review cũ).

| E2E ID | Tình huống | Expected invariant | CT / DEC | Desktop | Mobile | Evidence |
|---|---|---|---|---|---|---|
| E2E-01 | Pairing với dữ liệu có trước | Pairing không tự chia sẻ Diary/Media Private | CT-01; M10 D03 | NOT_RUN | NOT_RUN | — |
| E2E-02 | Shared Album chứa private assets | B không thấy preview, metadata, count hay direct URL | CT-01 | NOT_RUN | NOT_RUN | — |
| E2E-03 | Create Shared Copy rồi revoke original | B thấy copy theo grant, original vẫn Private | CT-01; DEC-01 | NOT_RUN | NOT_RUN | — |
| E2E-04 | Shared Book có Page Private | Reader, search, export PDF đều lọc Page | CT-01, CT-08 | NOT_RUN | NOT_RUN | — |
| E2E-05 | Diary private → Page snapshot | Snapshot grant riêng, không mở Diary gốc | CT-01, CT-08 | NOT_RUN | NOT_RUN | — |
| E2E-06 | Original thay đổi / revoke / Trash sau Publish | Publication immutable; media bytes mới theo ACL; không cascade | CT-07/08; DEC-01 | NOT_RUN | NOT_RUN | — |
| E2E-07 | A/B đồng thời edit text, object, undo | No lost acknowledged data; convergence; safe undo | CT-08 | NOT_RUN | NOT_RUN | — |
| E2E-08 | Revoke editor giữa lúc offline/reconnect | Mutation tiếp theo denied; no false Saved | CT-01/08 | NOT_RUN | NOT_RUN | — |
| E2E-09 | Trip Shared → Booking document Private | Không leak file/ticket/cover/notification | CT-01/02 | NOT_RUN | NOT_RUN | — |
| E2E-10 | M03 Date Plan → M05 Event retry | 1 Event ID canonical, không tạo Visit tự động | CT-02; DEC-05 | NOT_RUN | NOT_RUN | — |
| E2E-11 | M04 Activity ↔ M05 Event cancel/unlink/restore | Người dùng chọn scope rõ; không cascade; Pending Sync nếu lỗi | CT-02/03; DEC-05 | NOT_RUN | NOT_RUN | — |
| E2E-12 | Split recurrence this-and-following có RSVP/comment | Comment/RSVP giữ đúng occurrence, audit mapping | CT-02/03; DEC-05 | NOT_RUN | NOT_RUN | — |
| E2E-13 | Feb-29 / day31 / DST / all-day | Không tạo ngày/instant sai; xử lý theo DEC-06 | CT-03; DEC-06 | NOT_RUN | NOT_RUN | — |
| E2E-14 | Birthday chỉ MM/DD | Không tạo năm sinh/age/anniversary counter | CT-03; DEC-06 | NOT_RUN | NOT_RUN | — |
| E2E-15 | Một booking deposit nhiều consumer | Expense không bị tính 2 lần | CT-02/04 | NOT_RUN | NOT_RUN | — |
| E2E-16 | 101001 VND Equal 2 người | Sum allocations 101001, remainder explicit | CT-04; OP-04 | NOT_RUN | NOT_RUN | — |
| E2E-17 | A 700k/B 300k, share 500k/người | B trả A 200k, 1 Expense | CT-04 | NOT_RUN | NOT_RUN | — |
| E2E-18 | Partial Split consent | Only confirmed allocations create confirmed debt | CT-04 | NOT_RUN | NOT_RUN | — |
| E2E-19 | Refund sau confirmed Settlement | Không overwrite original; refund adjustment new consent | CT-04; DEC-04 | NOT_RUN | NOT_RUN | — |
| E2E-20 | Nợ JPY trả VND không có agreed FX | Không Confirmed until complete agreement | CT-04; DEC-04 | NOT_RUN | NOT_RUN | — |
| E2E-21 | Private Expense trong Shared Trip reports | Visible total không leak khoản của B | CT-01/04 | NOT_RUN | NOT_RUN | — |
| E2E-22 | Goal linked Savings bị mất quyền | Progress stale, không bằng 0, không auto Completed | CT-01/04 | NOT_RUN | NOT_RUN | — |
| E2E-23 | Secret Surprise link Expense/Media | Không leak existence, amount qua home/search/feed | CT-01/05/06 | NOT_RUN | NOT_RUN | — |
| E2E-24 | Capsule trước unlock dùng fake device clock | Không early open; trusted time; seal unchanged | CT-03/05 | NOT_RUN | NOT_RUN | — |
| E2E-25 | Frozen rồi Reconnect sau unlock | Không tự Reveal/unpause, original unlock_at giữ nguyên | CT-05; DEC-02 | NOT_RUN | NOT_RUN | — |
| E2E-26 | A Opened, B chưa Opened có mention | B không nhận preview/comment/count tiết lộ | CT-05/06; DEC-02 | NOT_RUN | NOT_RUN | — |
| E2E-27 | Quiet Hours có Scheduled Letter | Letter state đúng; notice có thể trì hoãn; Read≠Opened | CT-05/06; DEC-07 | NOT_RUN | NOT_RUN | — |
| E2E-28 | Delete/Restore linked Media/Book/Comment | Không cascade, không hồi sinh ACL, reference ổn định | CT-07; DEC-01 | NOT_RUN | NOT_RUN | — |
| E2E-29 | Disconnect với confirmed debt, pending Capsule | Chỉ xử lý debt cũ trong quyền; Capsule pause; không new shared debt | CT-04/05/07; DEC-02/03 | NOT_RUN | NOT_RUN | — |
| E2E-30 | Real system restore after revoke, send, settle | No permission resurrection, double-settle, resend, early open | CT-07 | NOT_RUN | NOT_RUN | — |
| E2E-31 | 10/10 module desktop/mobile user journey | All P0 not just read-only mobile | CT-08; M10 D40 | NOT_RUN | NOT_RUN | — |
| E2E-32 | Notification cancelled Event và retry | Dedup & stale CTA; không tự thay Calendar Event | CT-06; DEC-07 | NOT_RUN | NOT_RUN | — |
| E2E-33 | M09 comment trên object Private | Source ACL ceiling; comment không thay financial approval/RSVP | CT-01/02 | NOT_RUN | NOT_RUN | — |
| E2E-34 | Full Purge co-owned capsule component | Scope/consent/delete review; do not alter seal timestamps | CT-05/07; DEC-01 | NOT_RUN | NOT_RUN | — |
| E2E-35 | Partial Settlement FX rồi restore | Balance/remainder and audit preserved, no duplicates | CT-04/07; DEC-04 | NOT_RUN | NOT_RUN | — |
| E2E-36 | Timed Event thiếu End và DST fold | Không tự bịa duration/instant; user resolves | CT-03; DEC-06 | NOT_RUN | NOT_RUN | — |
| E2E-37 | Re-link Event sau Restore | Không duplicate, không hồi grant hay reminders lỗi thời | CT-02/03/06/07; DEC-05 | NOT_RUN | NOT_RUN | — |
| E2E-38 | Export after Disconnect collaborative Book | Actor-scope export/redaction, partner private media withheld | CT-01/07; DEC-03 | NOT_RUN | NOT_RUN | — |
| E2E-39 | Media original vs independent Shared Copy deletion | Tôn trọng riêng vòng đời/rights của từng object | CT-01/07; DEC-01 | NOT_RUN | NOT_RUN | — |
| E2E-40 | Restore recurring Expense/notification jobs | Không phát paid item hay alert duplicate | CT-04/06/07 | NOT_RUN | NOT_RUN | — |

## 5. AC Source Ledger đầy đủ: 763 mã gốc (không lược bỏ)

Dữ liệu gốc và line locator được đưa vào **`OUR_SPACE_BRD_AC_TRACEABILITY_763_DRAFT_V1.0.csv`** để lọc/sắp xếp/đánh dấu QA và điền evidence. Để dễ đối chiếu ngay trong Markdown, bên dưới là index từng AC giữ đúng wording nguồn. Cột trạng thái QA chưa chạy trong CSV: `desktop`, `mobile`, `security_negative`, `e2e` = `NOT_RUN`.

| Module | AC canonical | Nguồn line | Given / When / case từ BRD | Then / expected từ BRD |
|---|---|---|---|---|
| M01 | AC-M01-01 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1241 | User tạo Book hợp lệ | Tạo một Draft với owner và default Private |
| M01 | AC-M01-02 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1242 | User để title chỉ có khoảng trắng | Không tạo Book, hiện validation rõ |
| M01 | AC-M01-03 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1243 | User tạo hai sách cùng tên | Cả hai được phép với ID khác nhau |
| M01 | AC-M01-04 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1244 | User mở Book đã lưu | Nội dung đã xác nhận vẫn còn |
| M01 | AC-M01-05 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1245 | User thêm Page và reload | Page giữ ID và thứ tự hợp lệ |
| M01 | AC-M01-06 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1246 | User reorder Page | Comment/link còn gắn đúng Page, không theo index cũ |
| M01 | AC-M01-07 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1247 | User chọn Portrait/Landscape | Layout/Reader/PDF tương ứng định hướng |
| M01 | AC-M01-08 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1248 | User mở thư viện template | Có ít nhất 8 mẫu dùng được, preview hoạt động |
| M01 | AC-M01-09 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1249 | User chọn sticker | Có thư viện sticker cơ bản, thêm được vào trang |
| M01 | AC-M01-10 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1250 | User chuyển Simple → Advanced → Simple | Không mất element/layout/style hoặc ID |
| M01 | AC-M01-11 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1251 | User đổi template trang chứa nội dung | Có preview, cảnh báo/confirm, không tự xóa dữ liệu |
| M01 | AC-M01-12 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1252 | User xem Published | Chỉ thấy Publication đã chốt, không phải Draft mới |
| M01 | AC-M01-13 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1253 | User tiếp tục Edit sau Publish | Có Revision Draft tách khỏi Publication |
| M01 | AC-M01-14 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1254 | User xóa Book | Chuyển vào Trash và giữ được ít nhất 30 ngày theo chính sách |
| M01 | AC-M01-15 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1255 | User restore trong thời hạn | Book hoạt động trở lại, thông báo các resource thiếu nếu có |
| M01 | AC-M01-16 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1261 | User thêm ảnh/text/sticker/shape trong Advanced | Element xuất hiện, có thể chọn và chỉnh thuộc tính phù hợp |
| M01 | AC-M01-17 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1262 | User di chuyển/resize/rotate image | Layout hiển thị và lưu đúng |
| M01 | AC-M01-18 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1263 | User thao tác layer/lock | Thứ tự/khóa được giữ khi reload |
| M01 | AC-M01-19 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1264 | User gõ quá dài trong một text box | Cảnh báo overflow, không tự bỏ chữ |
| M01 | AC-M01-20 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1265 | User dùng Simple Edit Text/Replace Photo | Chỉ slot hợp lệ thay đổi, element nâng cao không mất |
| M01 | AC-M01-21 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1266 | User Undo/Redo thao tác cá nhân an toàn | Kết quả đúng và được đồng bộ |
| M01 | AC-M01-22 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1267 | User đóng tab sau Saved rồi mở lại | Tất cả thay đổi đã xác nhận còn nguyên |
| M01 | AC-M01-23 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1273 | A/B mở cùng Book | Presence cập nhật phù hợp cho cả hai |
| M01 | AC-M01-24 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1274 | A/B ở cùng Page | Hiển thị vị trí/lựa chọn cộng tác theo khả năng và quyền |
| M01 | AC-M01-25 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1275 | A thêm image, B thêm text đồng thời | Cả hai thay đổi được giữ |
| M01 | AC-M01-26 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1276 | A/B cùng nhập một text box | Không mất ký tự hợp lệ do overwrite toàn chuỗi |
| M01 | AC-M01-27 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1277 | A kéo image, B cùng kéo image | Có điều phối, không liên tục nhảy vị trí |
| M01 | AC-M01-28 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1278 | A đổi màu, B resize cùng element | Giữ cả hai nếu thuộc tính tương thích |
| M01 | AC-M01-29 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1279 | A xóa element B đang sửa | Có cảnh báo/khôi phục, không mất câm công việc B |
| M01 | AC-M01-30 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1280 | A/B đồng thời tạo Page | Hai Page tồn tại với thứ tự nhất quán |
| M01 | AC-M01-31 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1281 | A reorder Page, B sửa Page đó | B sửa đúng Page với ID không đổi |
| M01 | AC-M01-32 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1282 | A Undo trong lúc B đã sửa độc lập | Không Undo nhầm nội dung của B |
| M01 | AC-M01-33 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1283 | A mất mạng, B edit | B tiếp tục bình thường, A thấy Offline |
| M01 | AC-M01-34 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1284 | A reconnect với pending changes | Không ghi đè toàn trang bản mới từ B |
| M01 | AC-M01-35 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1285 | A có Conflict không hợp nhất an toàn | UI báo và cho xử lý/khôi phục, không giả vờ Saved |
| M01 | AC-M01-36 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1286 | Hai tab của cùng A cùng edit | Chúng là session riêng, đồng bộ hợp lệ |
| M01 | AC-M01-37 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1287 | Có thao tác đang Saving | Không hiển thị Saved trước khi được xác nhận |
| M01 | AC-M01-38 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1288 | Retry change sau timeout | Không sinh duplicate page/element ngoài ý muốn |
| M01 | AC-M01-39 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1289 | Hai phiên ổn định sau sync | Nội dung được phép xem hội tụ cùng trạng thái |
| M01 | AC-M01-40 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1290 | Thao tác phổ biến trên môi trường QA ổn định | Đo kiểm mục tiêu p95 ≤2 giây theo kịch bản đã định |
| M01 | AC-M01-41 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1296 | Book mới được tạo | Private dù Our Space có 2 người |
| M01 | AC-M01-42 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1297 | Owner chia sẻ Book với Editor | Editor sửa trong phạm vi Page được quyền |
| M01 | AC-M01-43 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1298 | Editor không có Publish grant bấm Publish | Từ chối xuất bản |
| M01 | AC-M01-44 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1299 | Owner thu hồi Editor khi người kia đang sửa | Session không được áp dụng cập nhật mới trái quyền |
| M01 | AC-M01-45 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1300 | Viewer truy cập Draft trực tiếp | Không có nội dung nháp |
| M01 | AC-M01-46 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1301 | Page private override trong Book Shared | Người không quyền không xem Page qua Reader/thumbnail/search |
| M01 | AC-M01-47 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1302 | Viewer export PDF của Book có Page riêng tư | PDF không chứa Page private |
| M01 | AC-M01-48 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1303 | Diary private đưa vào Book shared | Phải xác nhận trước khi chia sẻ snapshot, Diary nguồn vẫn Private |
| M01 | AC-M01-49 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1304 | Tài khoản không quyền mở trực tiếp asset/revision | Truy cập bị từ chối không lộ nội dung |
| M01 | AC-M01-50 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1305 | User tìm public/guest sharing trong V1 | Không có luồng chia sẻ công khai |
| M01 | AC-M01-51 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1311 | User tạo Diary hợp lệ | Lưu được với Event Date và owner |
| M01 | AC-M01-52 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1312 | Diary thiếu body và media | Không cho Publish bài rỗng |
| M01 | AC-M01-53 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1313 | User viết hôm nay về kỷ niệm năm cũ | Timeline hiển thị theo Event Date được chọn |
| M01 | AC-M01-54 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1314 | Diary được chèn snapshot vào Book | Thay nội dung trong Book không sửa Diary gốc |
| M01 | AC-M01-55 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1315 | Diary gốc bị xóa/sửa sau khi chèn | Snapshot không tự biến mất/thay đổi |
| M01 | AC-M01-56 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1316 | Hai tab cùng sửa Diary | Không bị overwrite câm, có bảo vệ version/conflict |
| M01 | AC-M01-57 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1317 | User thiếu quyền sửa Book đích | Không chèn snapshot được |
| M01 | AC-M01-58 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1323 | User đọc sách trên desktop | Có Reader phù hợp, page flip hoặc transition thay thế |
| M01 | AC-M01-59 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1324 | User đọc sách trên điện thoại | Có single-page, vuốt và zoom |
| M01 | AC-M01-60 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1325 | User bật giảm chuyển động | Reader không ép page-flip animation mạnh |
| M01 | AC-M01-61 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1326 | Owner Publish khi có pending save | Không tạo Publication không nhất quán |
| M01 | AC-M01-62 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1327 | Publication được tạo | Nội dung của phiên bản không tự đổi khi Draft tiếp tục sửa |
| M01 | AC-M01-63 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1328 | Owner restore Version | Tạo revision mới và giữ lịch sử trước đó |
| M01 | AC-M01-64 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1329 | User xuất PDF từ nội dung hợp lệ | PDF giữ Page order, orientation, ảnh, chữ, sticker trong quyền |
| M01 | AC-M01-65 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1330 | Asset độ phân giải thấp/overflow khi export | Có cảnh báo phù hợp trước khi xuất |
| M01 | AC-M01-66 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1331 | Export thất bại | Không trả file hỏng như file thành công, có thông báo/retry |
| M01 | AC-M01-67 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1332 | PDF đã tải sau đó bị revoke quyền hệ thống | UI không hứa thu hồi file PDF ngoài hệ thống |
| M01 | AC-M01-68 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1338 | M02 chưa có ảnh hoặc nội dung liên kết | M01 vẫn tạo sách với text/template/blank được |
| M01 | AC-M01-69 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1339 | User xóa Book đã dùng ảnh/Diary gốc | Ảnh/Diary gốc còn nguyên |
| M01 | AC-M01-70 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1340 | Backup có dữ liệu Book/Page/asset/quyền | Kiểm thử restore đưa dữ liệu về trạng thái đọc/sửa được theo phạm vi cam kết |
| M01 | AC-M01-71 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1341 | Search/Timeline đọc Diary theo quyền | Không lộ Diary Private, ngày kỷ niệm đúng Event Date |
| M01 | AC-M01-72 | OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md:1342 | User chỉnh/đọc M01 trên mobile và desktop | Hoàn thành đủ kịch bản P0 trên cả hai nền tảng |
| M02 | AC-M02-01 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1048 | Chọn một ảnh hợp lệ và upload | Asset Ready xuất hiện trong Library đúng quyền |
| M02 | AC-M02-02 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1049 | Upload nhiều ảnh/video | Mỗi file có progress/state riêng, kết quả tổng hợp chính xác |
| M02 | AC-M02-03 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1050 | Có 2 file lỗi trong batch 20 | 18 file hợp lệ vẫn được lưu và truy cập |
| M02 | AC-M02-04 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1051 | Retry Failed sau batch partial success | Chỉ item lỗi cần thử lại, không tạo duplicate của success |
| M02 | AC-M02-05 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1052 | Upload file trùng nội dung có quyền | Phát hiện và cho giải quyết Use Existing/Separate/Cancel |
| M02 | AC-M02-06 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1053 | Chọn ảnh từ điện thoại | Upload được qua mobile UI được hỗ trợ |
| M02 | AC-M02-07 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1054 | Mất mạng upload | Có báo lỗi/trạng thái phục hồi, không mất item Completed |
| M02 | AC-M02-08 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1055 | File quá giới hạn cấu hình | Nói rõ giới hạn, reject đúng file |
| M02 | AC-M02-09 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1056 | File có metadata hợp lệ | Lưu metadata hữu ích theo policy, không lộ GPS ngoài quyền |
| M02 | AC-M02-10 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1057 | File không đọc được, giả MIME | Không đánh dấu Completed/Ready sai |
| M02 | AC-M02-11 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1058 | Hai file trùng tên nhưng khác bytes | Không tự gộp thành một asset |
| M02 | AC-M02-12 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1059 | Hai lần gửi lại cùng operation upload | Không tạo hai asset ngoài chủ ý |
| M02 | AC-M02-13 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1060 | Ảnh trùng của tài khoản khác Private | Không tiết lộ sự tồn tại ảnh đó trong duplicate UX |
| M02 | AC-M02-14 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1061 | File HEIC hoặc MOV thuộc tập định dạng hỗ trợ lưu | Bảo tồn original; nếu preview/playback không tương thích, có fallback minh bạch |
| M02 | AC-M02-15 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1067 | Mở All Photos | Chỉ hiện ảnh có quyền, hỗ trợ pagination/lazy load |
| M02 | AC-M02-16 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1068 | Lọc theo ngày chụp, ngày upload, ngày kỷ niệm | Đúng từng trường; ảnh thiếu ngày không bị gán giả |
| M02 | AC-M02-17 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1069 | Tạo album có tên hợp lệ | Album xuất hiện đúng visibility, có ID độc lập |
| M02 | AC-M02-18 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1070 | Thêm một asset vào hai album | Hai membership, một logical original asset |
| M02 | AC-M02-19 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1071 | Remove From Album | Không mất asset tại Library/album khác |
| M02 | AC-M02-20 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1072 | Delete Album | Album vào Trash, media gốc không bị trash theo |
| M02 | AC-M02-21 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1073 | Rename Album | Tên cập nhật theo quyền, không phá liên kết |
| M02 | AC-M02-22 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1074 | Set Album Cover | Cover cập nhật, file gốc không đổi |
| M02 | AC-M02-23 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1075 | Shared Album với B | B thấy album và media đúng quyền |
| M02 | AC-M02-24 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1076 | Shared Album chứa A Private asset | B không thấy preview/nội dung/metadata asset đó |
| M02 | AC-M02-25 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1077 | Smart Collection lọc Favorite, Year hoặc Type | Kết quả động phản ánh filter và quyền |
| M02 | AC-M02-26 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1078 | Hai Editor cùng thêm ảnh album | Không mất membership nào do silent overwrite |
| M02 | AC-M02-27 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1079 | Hai Editor xung đột đổi tên/cover | Có giải quyết/cảnh báo, không im lặng mất cập nhật |
| M02 | AC-M02-28 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1085 | Mở ảnh có quyền | Ảnh và metadata được phép hiển thị |
| M02 | AC-M02-29 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1086 | Next/Previous trong album/filter | Đúng danh sách hiện tại, bỏ qua item không có quyền |
| M02 | AC-M02-30 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1087 | Phát video có codec được hỗ trợ | Phát trong Viewer, không ép tải original cả thư viện |
| M02 | AC-M02-31 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1088 | Crop/Rotate/Adjust ảnh rồi Save Version | Variant mới tạo, original không đổi |
| M02 | AC-M02-32 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1089 | Reset trong Media Editor | Trở về trạng thái chọn trước, original giữ nguyên |
| M02 | AC-M02-33 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1090 | Variant đã nằm trong Published Book | Save Variant mới không tự đổi nội dung book |
| M02 | AC-M02-34 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1091 | Preview không tương thích | Fallback có giải thích, vẫn có original hợp lệ |
| M02 | AC-M02-35 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1092 | Bị revoke khi Viewer đang mở | Yêu cầu truy cập tiếp theo bị chặn, không lộ file |
| M02 | AC-M02-36 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1098 | Search theo tags, album, tên, ngày, uploader | Kết quả đúng điều kiện |
| M02 | AC-M02-37 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1099 | Kết hợp nhiều filters | Đúng phép kết hợp đã mô tả, xóa filter phản ánh ngay |
| M02 | AC-M02-38 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1100 | A search Private content của B | Không lộ media, name, tag, count hay metadata |
| M02 | AC-M02-39 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1101 | A Favorite asset X | Chỉ Favorite của A thay đổi, không auto-share |
| M02 | AC-M02-40 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1102 | B chưa favorite X | X không tự xuất hiện trong Favorites của B |
| M02 | AC-M02-41 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1103 | M01 Asset Picker mở từ Editor | Chỉ cung cấp asset/variant hợp quyền của user |
| M02 | AC-M02-42 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1104 | Một asset dùng nhiều modules | Không phải reupload, usage links đúng |
| M02 | AC-M02-43 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1105 | Owner revoke Share | Viewer, Search, Picker, export, direct link cùng áp dụng quyền mới |
| M02 | AC-M02-44 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1106 | Related Memories có private content người khác | Không tiết lộ tên hoặc link vượt quyền |
| M02 | AC-M02-45 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1107 | A thêm Private photo vào Shared Album | Có xác nhận Keep Private/Share/Copy, không lộ tự động |
| M02 | AC-M02-46 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1108 | Viewer không có canDownload | Không tải original bằng tính năng chính thức |
| M02 | AC-M02-47 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1109 | User không quyền mở original/thumbnail trực tiếp | Từ chối bytes, không lộ metadata |
| M02 | AC-M02-48 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1110 | Ảnh có EXIF/GPS | Vị trí chính xác không tự hiện cho account chỉ có View |
| M02 | AC-M02-49 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1111 | Share Existing và Create Shared Copy | Hai lựa chọn cho quyền/vòng đời khác nhau đúng hợp đồng |
| M02 | AC-M02-50 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1117 | Trash asset | Trạng thái Trashed, deadline 30 ngày |
| M02 | AC-M02-51 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1118 | Restore trước hạn | Asset/metadata/quyền/relations còn hợp lệ được khôi phục |
| M02 | AC-M02-52 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1119 | Delete asset đang được sử dụng | Cảnh báo theo quyền, không cascade-delete Diary/Photobook |
| M02 | AC-M02-53 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1120 | Qua 30 ngày | Chỉ thực hiện purge theo chính sách phụ thuộc/quyền, không purge vô điều kiện |
| M02 | AC-M02-54 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1121 | Export Album | Chỉ xuất item đủ quyền Download/Export |
| M02 | AC-M02-55 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1122 | Export metadata | Manifest/metadata khớp file và không lộ dữ liệu riêng |
| M02 | AC-M02-56 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1123 | Revoke quyền khi Export đang xử lý | Không giao file vừa bị thu hồi quyền |
| M02 | AC-M02-57 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1124 | Backup/Restore dữ liệu thật | File gốc, variant cần thiết, album, rights, usage khôi phục phù hợp |
| M02 | AC-M02-58 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1125 | Restore data Private | B không xem được media Private của A sau restore |
| M02 | AC-M02-59 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1126 | Thư viện nhiều media | Chỉ tải phần cần hiển thị, không load all originals |
| M02 | AC-M02-60 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1127 | Upload, Viewer, Albums trên mobile | Hoàn thành các luồng trọng tâm bằng cảm ứng |
| M02 | AC-M02-61 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1128 | Upload, Viewer, Albums trên desktop | Hỗ trợ kéo thả, multi-select, keyboard/mouse |
| M02 | AC-M02-62 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1129 | Trash asset tham chiếu Book Published | Không âm thầm làm hỏng quyền nội dung hoặc vẫn công khai nội dung đã bị thu hồi |
| M02 | AC-M02-63 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1130 | Gói export chứa original có GPS | UI cảnh báo về metadata nhạy cảm |
| M02 | AC-M02-64 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1131 | Storage Dashboard | Hiển thị số liệu có scope quyền rõ ràng, không tiết lộ quota private khác |
| M02 | AC-M02-65 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1132 | Cancel upload item đã Completed | Không tự xóa asset, cần nghiệp vụ Delete |
| M02 | AC-M02-66 | OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md:1133 | Truy cập album/share sau khi owner đổi quyền | Quyền mới được áp dụng, không dựa vào tab cũ |
| M03 | AC-M03-01 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1367 | Đăng nhập, nhập Name + Category hợp lệ và Save | Place Active được lưu với Owner và Private mặc định |
| M03 | AC-M03-02 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1368 | Name trống và Save | Form báo lỗi, không tạo record |
| M03 | AC-M03-03 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1369 | Place không có tọa độ/địa chỉ nhưng dữ liệu tối thiểu hợp lệ | Tạo được Place, không có directions giả |
| M03 | AC-M03-04 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1370 | Tạo rạp phim/công viên/bảo tàng | Không yêu cầu menu/food rating, có thể dùng Visit/Plan như Place khác |
| M03 | AC-M03-05 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1371 | Tạo hai chi nhánh cùng thương hiệu | Hai Place ID riêng, không tự gộp |
| M03 | AC-M03-06 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1372 | Dán URL hỗ trợ import hợp lệ | Hệ thống gợi ý thông tin có thể duyệt, không tự thay note đã nhập |
| M03 | AC-M03-07 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1373 | Dán URL không parse được | Vẫn nhập tay/lưu source URL hợp lệ |
| M03 | AC-M03-08 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1374 | URL không an toàn/không hợp lệ | Không mở/trích xuất nguy hiểm, báo lỗi chính xác |
| M03 | AC-M03-09 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1375 | Tạo Place có vẻ trùng | Gợi ý trong phạm vi quyền, cho lựa chọn hợp lệ |
| M03 | AC-M03-10 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1376 | Sửa tên/category/cover của Place | Stable ID, Visits và links không bị mất |
| M03 | AC-M03-11 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1377 | Mở Place Detail | Thấy thông tin được phép, quick actions theo quyền |
| M03 | AC-M03-12 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1378 | Mở Place có link bản đồ hợp lệ | Có thể Open Directions bằng liên kết ngoài |
| M03 | AC-M03-13 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1379 | Mở Place thiếu map info | Không hiện pin/tuyến đường giả, có hướng dẫn nhập bổ sung |
| M03 | AC-M03-14 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1380 | Archive Place | Không còn trong active list mặc định, vẫn khôi phục/xem history theo quyền |
| M03 | AC-M03-15 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1386 | Tạo Collection cá nhân | Collection Private được lưu |
| M03 | AC-M03-16 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1387 | Tạo Shared Collection và cấp quyền B | B mở/sửa theo role được cấp |
| M03 | AC-M03-17 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1388 | Thêm Place X vào hai Collection | Một Place ID gốc, hai membership |
| M03 | AC-M03-18 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1389 | Remove Place khỏi Collection A | Place vẫn ở B và All Places |
| M03 | AC-M03-19 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1390 | Xóa Collection chứa Place | Place/Visits/media gốc còn nguyên |
| M03 | AC-M03-20 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1391 | Place đã Visited thêm vào Wishlist | Hành động được phép, Visit không đổi |
| M03 | AC-M03-21 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1392 | Shared Collection chứa Place Private | B không nhìn thấy Place trước khi được chia sẻ hợp lệ |
| M03 | AC-M03-22 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1393 | Hai Editor cùng thêm hai Place vào Collection | Cả hai membership hợp lệ được giữ |
| M03 | AC-M03-23 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1394 | Đổi thứ tự Collection | Thứ tự cập nhật, không xóa member hoặc đổi thứ tự list khác |
| M03 | AC-M03-24 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1395 | Xem collection rỗng | Empty state hữu ích và nút Add Place |
| M03 | AC-M03-25 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1401 | Chọn Plan từ Place X, chưa có ngày | Có thể lưu trạng thái Idea không tạo Event sai |
| M03 | AC-M03-26 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1402 | Chọn ngày giờ Plan hợp lệ | Tạo/liên kết Event ở M05, Plan Scheduled nhất quán |
| M03 | AC-M03-27 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1403 | Dời lịch Plan từ M03 | M05 cập nhật thời gian, UI M03 hiển thị mới |
| M03 | AC-M03-28 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1404 | Dời lịch trực tiếp M05 | M03 hiển thị giờ mới từ Event nguồn |
| M03 | AC-M03-29 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1405 | M05 lỗi khi tạo/chỉnh lịch | Không báo Plan scheduled/rescheduled thành công sai |
| M03 | AC-M03-30 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1406 | Cancel Plan | Không tự sinh Visit, không xóa Place/Wishlist |
| M03 | AC-M03-31 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1407 | Postpone Plan | Giữ Place/notes/participants, có thể lên lịch lại |
| M03 | AC-M03-32 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1408 | Thời gian hẹn đã qua, chưa xác nhận đã đi | Không tự tạo Visit hoặc mặc định Completed |
| M03 | AC-M03-33 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1409 | Mark Plan Completed | Không tự tạo Visit, có CTA thêm Visit riêng |
| M03 | AC-M03-34 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1410 | Retry Create Event/link vì lỗi mạng | Không tạo nhiều active Event cho cùng ý định ngoài ý muốn |
| M03 | AC-M03-35 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1416 | Tạo Visit có Place/ngày hợp lệ | Visit Active được lưu, không đòi ảnh/Review/món |
| M03 | AC-M03-36 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1417 | Tạo Visit cho cùng Place lần khác | Giữ nhiều Visit độc lập |
| M03 | AC-M03-37 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1418 | Có hai Visit tại cùng Place trong một ngày (khác lần) | Không tự gộp hai Visit hợp lệ |
| M03 | AC-M03-38 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1419 | Gắn B là participant từ tài khoản A | Trạng thái của B là Proposed, không auto Confirmed |
| M03 | AC-M03-39 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1420 | B tự xác nhận tham gia | Trạng thái participant cập nhật theo người xác nhận |
| M03 | AC-M03-40 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1421 | Gắn ảnh từ M02 trong Visit | Tái sử dụng asset, không upload riêng M03 |
| M03 | AC-M03-41 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1422 | Chọn asset M02 mà không đủ quyền | Không hiển thị/truy cập asset trái phép |
| M03 | AC-M03-42 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1423 | A Submit rating 4.5/5 | Review của A được lưu với reviewer A |
| M03 | AC-M03-43 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1424 | B Submit rating 4.0/5 cùng Visit | Review B riêng, không ghi đè A |
| M03 | AC-M03-44 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1425 | Submit rating 0 hoặc 5.3 hoặc 2.3 | Bị từ chối theo thang 1–5 bước 0,5 |
| M03 | AC-M03-45 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1426 | Chỉ A có Review | B unrated, trung bình Visit = rating A, n=1 |
| M03 | AC-M03-46 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1427 | A/B bỏ trống tiêu chí phụ | Review vẫn hợp lệ nếu Overall đủ |
| M03 | AC-M03-47 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1428 | Place loại Outdoor không có food | Không yêu cầu Dish, vẫn Add Visit/Review được |
| M03 | AC-M03-48 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1429 | Thêm Dish want-to-try | Chưa ghi nhận đã thử nếu chưa có Visit Item |
| M03 | AC-M03-49 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1430 | Thêm Dish vào hai Visit có giá khác | Mỗi Visit Item lưu snapshot giá riêng, không bị thay đổi khi giá tham khảo mới cập nhật |
| M03 | AC-M03-50 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1431 | Người A sửa Review của B qua URL trực tiếp | Hệ thống từ chối theo quyền |
| M03 | AC-M03-51 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1432 | Xóa Visit | Không xóa Place/ảnh/Diary/Expense |
| M03 | AC-M03-52 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1438 | A Favorite Place X | B không tự Favorite X |
| M03 | AC-M03-53 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1439 | A đánh dấu Revisit | Favorite/Review/Visit của A và B giữ nguyên |
| M03 | AC-M03-54 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1440 | Filter Both of Us Love It | Chỉ trả Place cả hai có dấu Favorite hợp lệ và được phép hiển thị |
| M03 | AC-M03-55 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1441 | Kết hợp Category + Area + Collection + Favorite | Kết quả đúng điều kiện lọc, không có Place duplicate |
| M03 | AC-M03-56 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1442 | Search Place Private của B từ A | Không có title/thumbnail/count/metadata lộ ra |
| M03 | AC-M03-57 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1443 | Random Picker có các Place hợp lệ | Kết quả thuộc đúng tập ứng viên được phép |
| M03 | AC-M03-58 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1444 | Random Picker pool rỗng | Hiển thị Empty + Clear/Change Filters, không fake result |
| M03 | AC-M03-59 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1445 | Pick xong bấm Create Plan | Yêu cầu xác nhận mới tạo Plan, chưa tạo Visit |
| M03 | AC-M03-60 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1446 | Một Place có 5 Visit hợp lệ | Distinct Places Visited=1, Total Visits=5 |
| M03 | AC-M03-61 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1447 | Có Review Private của B không được A xem | Rating/Insight A không tính/tiết lộ Review đó |
| M03 | AC-M03-62 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1448 | Tạo Visit cũ từ năm trước hôm nay | Monthly Visits thống kê theo ngày Visit thực tế, không theo created_at |
| M03 | AC-M03-63 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1449 | Tổng hợp Expenses Visit | M07 là nguồn số liệu, không cộng trùng dự toán/gía món |
| M03 | AC-M03-64 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1455 | Place Shared, Visit Private | Viewer Place không thấy Visit Private, ảnh, notes hoặc count riêng |
| M03 | AC-M03-65 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1456 | Thêm M02 Private asset vào Shared Visit | Yêu cầu cấp quyền/copy hợp lệ, không leak ảnh |
| M03 | AC-M03-66 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1457 | A thu hồi quyền Editor của B khi B đang sửa | Save mới của B bị từ chối, B nhận thông báo phù hợp |
| M03 | AC-M03-67 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1458 | A và B sửa cùng trường trên Place | Phát hiện conflict, không silently overwrite |
| M03 | AC-M03-68 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1459 | A sửa tên, B sửa tag khác | Có thể giữ hai thay đổi độc lập hợp lệ, không mất dữ liệu |
| M03 | AC-M03-69 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1460 | A tạo Diary từ Visit | M01 sở hữu Diary, M03 giữ link, dữ liệu người dùng được phép |
| M03 | AC-M03-70 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1461 | Thêm Place vào Trip | M04 dùng cùng Place ID, không clone |
| M03 | AC-M03-71 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1462 | Ghi Expense qua Visit | M07 xác nhận Expense; M03 không duplicate money record |
| M03 | AC-M03-72 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1463 | M07 save Expense lỗi | Visit không mất, không báo expense success sai |
| M03 | AC-M03-73 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1464 | Trash Place | Có kiểm tra links, không cascade delete module khác |
| M03 | AC-M03-74 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1465 | Restore Place trong 30 ngày | Khôi phục ID và quan hệ còn hợp lệ |
| M03 | AC-M03-75 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1466 | Restore Visit có asset đã bị xóa vĩnh viễn | Visit khôi phục với thông báo thiếu asset, không bịa ảnh |
| M03 | AC-M03-76 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1467 | Search trực tiếp bằng URL ID private | Từ chối truy cập phía nguồn |
| M03 | AC-M03-77 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1468 | Mobile: tạo Place từ link/nhập tay | Hoàn thành được, không cần desktop |
| M03 | AC-M03-78 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1469 | Mobile: tạo Plan/Visit/Review và dùng Random | Hoàn thành được bằng cảm ứng |
| M03 | AC-M03-79 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1470 | Desktop: lọc nhiều điều kiện, quản lý Collections/Visit | Hoàn thành, điều hướng nhất quán |
| M03 | AC-M03-80 | OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md:1471 | Export/backup restore dữ liệu M03 qua shared foundation | Phục hồi Place/Visit/ACL/links trong phạm vi được phép; không mất dữ liệu đã cam kết |
| M04 | AC-M04-01 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1112 | Create Dream Trip không ngày | Lưu và mở lại được không có ngày giả |
| M04 | AC-M04-02 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1113 | Create Trip có ngày hợp lệ | Lưu đúng start/end và date certainty |
| M04 | AC-M04-03 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1114 | Nhập end trước start | Bị từ chối và có validation |
| M04 | AC-M04-04 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1115 | Dreaming chuyển Planning | Giữ notes, destinations và refs cũ |
| M04 | AC-M04-05 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1116 | Thêm nhiều Destinations | Lưu đủ danh sách, thứ tự khi cần |
| M04 | AC-M04-06 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1117 | Đổi ngày Trip | Giữ dữ liệu, có impact preview và xác nhận |
| M04 | AC-M04-07 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1118 | Cancel Trip | Không xóa lịch sử và liên kết |
| M04 | AC-M04-08 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1119 | Qua ngày end | Không tự thành Completed |
| M04 | AC-M04-09 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1120 | Archive Trip | Không xóa ảnh/nhật ký gốc |
| M04 | AC-M04-10 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1121 | Duplicate Trip | Không sao chép actual expense/confirmed booking ngoài ý định |
| M04 | AC-M04-11 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1122 | Add Activity | Xuất hiện đúng Trip, có ID riêng |
| M04 | AC-M04-12 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1123 | Add Activity không có giờ | Lưu và hiển thị chưa xếp giờ |
| M04 | AC-M04-13 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1124 | Add Activity chưa có ngày | Xuất hiện Unscheduled |
| M04 | AC-M04-14 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1125 | Move Activity sang ngày khác | Giữ notes, refs, trạng thái |
| M04 | AC-M04-15 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1126 | Reorder Activities | Thứ tự nhất quán, không đổi ID |
| M04 | AC-M04-16 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1127 | Add Place từ M03 | Tái sử dụng đúng Place ID, không duplicate |
| M04 | AC-M04-17 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1128 | Place gốc đổi/xóa | Activity giữ ref và notes, không leak private data |
| M04 | AC-M04-18 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1129 | Activity qua nửa đêm | Thời gian chính xác theo ngày/timezone |
| M04 | AC-M04-19 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1130 | Activities trùng giờ | Cảnh báo nhưng vẫn quản lý được |
| M04 | AC-M04-20 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1131 | Delete Activity | Không tự xóa Place/Media/Booking độc lập |
| M04 | AC-M04-21 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1132 | Mark Activity Completed | Không tự tạo Visit |
| M04 | AC-M04-22 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1133 | Link Visit có sẵn | Không tạo Visit trùng |
| M04 | AC-M04-23 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1134 | Hai người thêm Activity cùng lúc | Giữ cả hai |
| M04 | AC-M04-24 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1135 | Hai người sửa xung đột cùng field | Có cơ chế xử lý, không silent overwrite |
| M04 | AC-M04-25 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1136 | Add Transport Leg | Hiển thị đúng Trip và liên kết |
| M04 | AC-M04-26 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1137 | Transport qua timezone | Hiển thị đúng local times và chronology |
| M04 | AC-M04-27 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1138 | Add Accommodation | Lưu nơi ở, thời gian và status |
| M04 | AC-M04-28 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1139 | Check-out trước check-in | Validation từ chối |
| M04 | AC-M04-29 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1140 | Trip nhiều stays | Hiển thị/lưu đủ |
| M04 | AC-M04-30 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1141 | Add Booking | Lưu Booking ID/status/ref và liên kết |
| M04 | AC-M04-31 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1142 | Đổi ngày Trip có Booking | Không tự tuyên bố đổi dịch vụ bên ngoài |
| M04 | AC-M04-32 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1143 | Attach Trip Document | Lưu đúng loại/quyền, báo lỗi khi không hợp lệ |
| M04 | AC-M04-33 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1144 | Viewer thiếu quyền tài liệu | Không xem/tải được qua URL trực tiếp |
| M04 | AC-M04-34 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1145 | Cancel Booking | Lưu history, không xóa Trip |
| M04 | AC-M04-35 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1146 | Tạo Packing List | Danh sách được tạo |
| M04 | AC-M04-36 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1147 | Add/Edit Checklist Item | Lưu đúng item |
| M04 | AC-M04-37 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1148 | Hai người tick item khác nhau | Giữ cả hai trạng thái |
| M04 | AC-M04-38 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1149 | Assign checklist item | Hiển thị đúng assignee |
| M04 | AC-M04-39 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1150 | All checklist Completed | Không tự chuyển Ready |
| M04 | AC-M04-40 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1151 | Copy checklist từ Trip cũ | Mặc định reset Done/Packed |
| M04 | AC-M04-41 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1152 | Add actual Expense qua Trip | Bản ghi chính thức ở M07 |
| M04 | AC-M04-42 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1153 | Expense nhiều refs trong cùng Trip | Không bị tính trùng |
| M04 | AC-M04-43 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1154 | Planned vs actual budget | Hiển thị tách bạch, không gộp sai |
| M04 | AC-M04-44 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1155 | Expenses nhiều currency | Không cộng số khác đơn vị khi thiếu tỷ giá |
| M04 | AC-M04-45 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1156 | Link Activity với M05 | Có ref Event hợp lệ, không tạo event trùng |
| M04 | AC-M04-46 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1157 | Sửa giờ ở Activity đã link Event | Áp dụng sync/cảnh báo đúng quyền |
| M04 | AC-M04-47 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1158 | Sync Calendar lỗi | Có pending/failed/retry |
| M04 | AC-M04-48 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1159 | Activity có địa chỉ hợp lệ | Có thể mở đường dẫn chỉ đường |
| M04 | AC-M04-49 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1160 | Activity không có tọa độ | Không sinh pin/ETA giả |
| M04 | AC-M04-50 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1161 | Tạo Diary từ Trip | Diary thuộc M01 và liên kết đúng |
| M04 | AC-M04-51 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1162 | Attach media M02 | Không upload lại file gốc |
| M04 | AC-M04-52 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1163 | Trip Completed | Xem Recap cơ bản từ actual, không bịa Visit |
| M04 | AC-M04-53 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1164 | Create Travel Photobook | Tạo M01 Draft và chọn nội dung đúng quyền |
| M04 | AC-M04-54 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1165 | Edit Photo trong M01 photobook | Không thay đổi ảnh gốc hoặc Trip cũ ngoài ý muốn |
| M04 | AC-M04-55 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1166 | Trip Archived | Dữ liệu liên kết từ nguồn vẫn còn |
| M04 | AC-M04-56 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1167 | Create new Trip | Private mặc định |
| M04 | AC-M04-57 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1168 | Share Trip | Roles được áp dụng đúng |
| M04 | AC-M04-58 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1169 | Revoke Editor | Chặn write mới ngay theo ACL |
| M04 | AC-M04-59 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1170 | Open Private Trip URL trái quyền | Từ chối, không leak metadata |
| M04 | AC-M04-60 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1171 | Shared Trip có private document | Không xem được tài liệu hạn chế |
| M04 | AC-M04-61 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1172 | A/B cùng sửa | Không mất thay đổi độc lập |
| M04 | AC-M04-62 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1173 | Delete Trip | Chuyển vào Trash |
| M04 | AC-M04-63 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1174 | Restore Trip trong 30 ngày | Khôi phục thông tin/links hợp lệ |
| M04 | AC-M04-64 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1175 | Delete Trip có links xuyên hệ | Không cascade-delete nguồn M01/M02/M03/M05/M07 |
| M04 | AC-M04-65 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1176 | Thực hiện luồng P0 trên mobile | Tạo/edit/itinerary/checklist/booking/recap sử dụng được |
| M04 | AC-M04-66 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1177 | Thực hiện luồng P0 trên desktop | Hoàn thành các luồng chính |
| M04 | AC-M04-67 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1178 | Network failure lúc Save | Không hiển thị Saved sai, xử lý retry/conflict |
| M04 | AC-M04-68 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1179 | Export Trip basic | Chỉ có dữ liệu được phép export |
| M04 | AC-M04-69 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1180 | Reload Trip đã Save | Giữ nội dung đã được xác nhận lưu |
| M04 | AC-M04-70 | OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md:1181 | Search theo người thiếu quyền | Không lộ Private hoặc file nhạy cảm |
| M05 | AC-M05-01 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1146 | A có 3 Event hợp quyền, 1 Event Private của B; mở CC-01. | Hiển thị chỉ 3 Event của A và nội dung có quyền, không thấy metadata của B. |
| M05 | AC-M05-02 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1147 | A đang ở Month View; nhấn tháng sau/trước. | Ngày và occurrence thuộc tháng được chọn hiển thị chính xác theo timezone và quyền. |
| M05 | AC-M05-03 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1148 | A chuyển Week View tới tuần kế tiếp. | Các Event ngày/giờ của tuần phù hợp, overnight và overlap hiển thị đúng. |
| M05 | AC-M05-04 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1149 | A chọn một ngày trong Month. | Mở Day View/danh sách ngày chính xác, giữ bộ lọc quyền. |
| M05 | AC-M05-05 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1150 | A mở Agenda phạm vi 7 ngày chứa recurring event. | Các occurrence hợp lệ đúng thứ tự, không duplicate hoặc sinh toàn series vô hạn. |
| M05 | AC-M05-06 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1151 | A nhập title/ngày/timezone hợp lệ và Save. | Chỉ một Event ID được tạo và xuất hiện đúng Calendar. |
| M05 | AC-M05-07 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1152 | A bỏ trống title và Save. | Form chỉ ra title lỗi, không tạo Event, giữ input đã nhập. |
| M05 | AC-M05-08 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1153 | A chọn All-day và ngày cụ thể. | Lưu date-only, không bắt buộc giờ; đổi timezone hiển thị không đổi ngày. |
| M05 | AC-M05-09 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1154 | A tạo timed Event qua 2 múi giờ hợp lệ. | Lưu time/instant/timezone chính xác, hiển thị đúng local time. |
| M05 | AC-M05-10 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1155 | A đổi tên Event và Save. | Các reminder, participant, link còn hợp lệ, stable ID không đổi. |
| M05 | AC-M05-11 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1156 | A đổi Start Time của Event. | Không tạo Event mới, hệ thống kiểm tra conflict và cập nhật reminder liên quan. |
| M05 | AC-M05-12 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1157 | A Cancel Event đã có future reminder. | Event thành Cancelled, không tiếp tục gửi reminder chưa hợp lệ. |
| M05 | AC-M05-13 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1158 | Event đã quá thời gian kết thúc nhưng chưa xác nhận hoàn tất. | Không tự chuyển Completed. |
| M05 | AC-M05-14 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1159 | Event từ 23:00 ngày 1 đến 01:00 ngày 2. | Hiển thị ở các ngày tương ứng, chỉ một Event nguồn. |
| M05 | AC-M05-15 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1160 | A xem/tạo/sửa Event trên điện thoại. | Hoàn thành được luồng tạo và sửa, Month/Week/Day/Agenda usable. |
| M05 | AC-M05-16 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1166 | A tạo Event không chọn chia sẻ. | Event mặc định Private; B không thấy trong View/Search/URL. |
| M05 | AC-M05-17 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1167 | A xác nhận chia sẻ Event với B. | B nhìn thấy Event với đúng quyền; linked Private media vẫn được bảo vệ. |
| M05 | AC-M05-18 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1168 | A thu hồi quyền của B khi B đang mở Event. | Những lần truy cập/lưu mới của B bị chặn, reminder bất hợp lệ tương lai hủy. |
| M05 | AC-M05-19 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1169 | A tắt bộ lọc My Calendar. | Event A không bị xóa, chỉ bị ẩn trong View tương ứng. |
| M05 | AC-M05-20 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1170 | A có Event Private, B xem ngày/tháng đó. | B không thấy title, location, count hoặc preview Event A. |
| M05 | AC-M05-21 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1171 | A gửi lời mời cho B vào Event. | B nhận lời mời hợp lệ; RSVP bắt đầu No Response. |
| M05 | AC-M05-22 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1172 | B nhận lời mời và chọn Going. | Attendance của B thành Going, không tự sửa attendance A. |
| M05 | AC-M05-23 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1173 | B chọn Not Going. | Không tự xóa/cancel Event chung. |
| M05 | AC-M05-24 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1174 | B chưa trả lời invitation. | Hiển thị No Response, không mặc định Going. |
| M05 | AC-M05-25 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1175 | B nhập link Event Private của A. | Từ chối truy cập, không lộ dữ liệu trong lỗi. |
| M05 | AC-M05-26 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1176 | Event Shared liên kết ảnh Private M02. | Người không có quyền ảnh không xem được ảnh/thumbnail/file gốc. |
| M05 | AC-M05-27 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1177 | Busy/Free A OFF, B tạo Event trùng giờ private A. | B không nhận conflict signal về private A; bật quyền mới mới được xem busy info phù hợp. |
| M05 | AC-M05-28 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1183 | A tạo Anniversary với original date hợp lệ. | Original date được giữ và hiện ở CC-09, có thể link M08 sau. |
| M05 | AC-M05-29 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1184 | Anniversary đã qua một hoặc nhiều năm. | Năm kỷ niệm và upcoming occurrence tính đúng theo calendar. |
| M05 | AC-M05-30 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1185 | Original date là hôm nay / hôm qua theo timezone tham chiếu. | Days elapsed lần lượt 0 / 1, ordinal lần lượt 1 / 2. |
| M05 | AC-M05-31 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1186 | Original date 29/02, xem ở năm không nhuận. | Mặc định 28/02; nếu chọn 01/03 dùng 01/03; gốc vẫn 29/02. |
| M05 | AC-M05-32 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1187 | A tạo Weekly Saturday 10:00, view 4 tuần. | Bốn occurrence tuần hợp lệ hiện đúng rule và timezone. |
| M05 | AC-M05-33 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1188 | A tạo monthly recurrence on day 31. | Tháng ngắn dùng last day, tháng đủ trở về 31. |
| M05 | AC-M05-34 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1189 | A sửa riêng 1 weekly occurrence. | Chỉ occurrence đó đổi; những lần còn lại đúng rule gốc. |
| M05 | AC-M05-35 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1190 | A sửa từ occurrence hiện tại trở đi. | Các lần trước và lịch sử không bị sửa; future rule đúng. |
| M05 | AC-M05-36 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1191 | A sửa toàn Series sau xác nhận phạm vi. | Các occurrence thuộc phạm vi được cập nhật có kiểm soát, exceptions không mất âm thầm. |
| M05 | AC-M05-37 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1192 | A xóa một occurrence. | Series còn lại vẫn xuất hiện, occurrence mục tiêu không hiện ở view/reminder. |
| M05 | AC-M05-38 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1193 | Series không có end date được xem trong 1 tháng. | Chỉ tính/lấy những occurrence cần cho view, không tạo vô hạn. |
| M05 | AC-M05-39 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1194 | Occurrence đã dời ngày riêng, A tải lại view và cập nhật series. | Exception đã lưu vẫn được nhận biết; nếu bị ảnh hưởng phải có cảnh báo/phương án. |
| M05 | AC-M05-40 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1195 | Weekly timed event qua tuần đổi DST trong timezone áp dụng DST. | Giữ cùng wall-clock time hợp lệ; xử lý DST ambiguous/nonexistent minh bạch. |
| M05 | AC-M05-41 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1201 | A đặt reminder 1 day before cho Event. | Reminder Config được lưu đúng tài khoản và occurrence. |
| M05 | AC-M05-42 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1202 | A đặt 7d và 1d cho cùng Event. | Hai thời điểm hợp lệ được xử lý độc lập, không double cho cùng config. |
| M05 | AC-M05-43 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1203 | A reminder 1d, B reminder 1h cho Shared Event. | Mỗi người nhận theo cấu hình riêng, không ghi đè/gửi nhầm. |
| M05 | AC-M05-44 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1204 | A dời Event khi reminder 1h còn pending. | Reminder được dời/hủy theo giờ mới, không gửi thông báo sai giờ cũ. |
| M05 | AC-M05-45 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1205 | Event Cancelled/Trashed trước hạn reminder. | Không tiếp tục sinh reminder hoạt động của Event bị hủy/xóa. |
| M05 | AC-M05-46 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1206 | Cùng delivery được hệ thống xử lý 2 lần do retry. | Không xuất hiện 2 notification logic cho cùng occurrence/recipient/config. |
| M05 | AC-M05-47 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1207 | B mất quyền Event trước giờ reminder. | Không gửi Event title/content cho B hoặc tiết lộ qua Notification Center. |
| M05 | AC-M05-48 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1208 | Quiet hours của A trùng giờ nhắc. | Áp dụng đúng defer/skip policy đã cấu hình, không gửi trùng/hàng loạt quá hạn. |
| M05 | AC-M05-49 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1209 | Hai Timed Events được phép kiểm tra overlap. | Cảnh báo đúng khoảng giao nhau theo timezone. |
| M05 | AC-M05-50 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1210 | Người dùng thấy cảnh báo trùng và chọn Save Anyway. | Lưu thành công nếu đủ quyền và dữ liệu hợp lệ. |
| M05 | AC-M05-51 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1211 | Private Event A, Busy/Free OFF. | B không nhận tên/title/count hoặc tín hiệu bận liên quan Event A. |
| M05 | AC-M05-52 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1212 | A bật Busy/Free cho phạm vi được phép. | B chỉ thấy busy interval đủ quyền, không thấy chi tiết Event A. |
| M05 | AC-M05-53 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1218 | M03 Date Plan có giờ, A chọn Add to Calendar. | Một Event M05 liên kết đúng Date Plan và source purpose. |
| M05 | AC-M05-54 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1219 | A đổi giờ Date Plan từ M03 sau khi link. | M05 hiển thị giờ đã xác nhận mới trên cùng Event. |
| M05 | AC-M05-55 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1220 | B sửa giờ Calendar Event được link M03. | M03 hiển thị thời gian mới hoặc trạng thái sync pending/conflict minh bạch. |
| M05 | AC-M05-56 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1221 | Yêu cầu create/link M03 được gửi lại. | Không tạo Event trùng theo source+purpose. |
| M05 | AC-M05-57 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1222 | M04 Activity được chọn đưa lên Calendar. | Event link đúng Activity; không tạo M04 Place mới hoặc bản ghi độc lập. |
| M05 | AC-M05-58 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1223 | M04 Activity Cancelled/Skipped. | Calendar link xử lý policy đúng, không xóa Trip/M03 Place. |
| M05 | AC-M05-59 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1224 | M04 Trip đổi lịch có Booking confirmed. | Calendar chỉ cập nhật phần được xác nhận, không báo Booking đã được provider đổi. |
| M05 | AC-M05-60 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1225 | Anniversary link Special Moment M08. | Thời gian đúng, quyền riêng nội dung M08 được bảo vệ. |
| M05 | AC-M05-61 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1226 | M08 Time Capsule chưa tới Scheduled Reveal. | M05 không lộ title/preview/content/time metadata vượt quyền qua view/reminder/search. |
| M05 | AC-M05-62 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1227 | Event gắn ảnh M02 và Diary M01. | Sử dụng reference, không copy dữ liệu gốc và không tự nâng quyền. |
| M05 | AC-M05-63 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1228 | Linked source bị xóa hoặc người xem hết quyền. | Event vẫn hợp lệ; source bị ẩn/placeholder, không leak thông tin. |
| M05 | AC-M05-64 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1229 | Đồng bộ M03↔M05 hoặc M04↔M05 lỗi. | Có trạng thái lỗi/pending và retry an toàn, không báo hai bên đồng bộ thành công. |
| M05 | AC-M05-65 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1230 | Người dùng xóa Event đã link Date Plan/Trip/Diary. | Không xóa dây chuyền dữ liệu nguồn, quan hệ link được xử lý minh bạch. |
| M05 | AC-M05-66 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1236 | A đổi Title và B đổi Time độc lập từ hai phiên. | Hai thay đổi hợp lệ cùng tồn tại sau đồng bộ, không mất dữ liệu. |
| M05 | AC-M05-67 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1237 | A và B đồng thời đổi chính Time từ phiên bản cũ. | Có conflict detection/handling minh bạch, không silent overwrite. |
| M05 | AC-M05-68 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1238 | A thu hồi quyền Editor khi B còn form mở. | B không thể lưu update mới, form báo trạng thái không hợp lệ. |
| M05 | AC-M05-69 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1239 | Owner Move Event to Trash. | Event ẩn khỏi active views, Trash có record và hạn giữ 30 ngày. |
| M05 | AC-M05-70 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1240 | Owner Restore Event trong 30 ngày. | Event, trạng thái, permission và link hợp lệ khôi phục đúng; không duplicate. |
| M05 | AC-M05-71 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1241 | Restore recurring Series có Exceptions/Reminder. | Không nhân Occurrence/Delivery hoặc gửi lời nhắc quá hạn. |
| M05 | AC-M05-72 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1242 | A export Calendar chứa Event của A và Private Event B. | Export gồm dữ liệu A được phép xem/xuất; không có nội dung Private B. |
| M05 | AC-M05-73 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1243 | A đổi display timezone/time format. | Timed Event giữ cùng instant, All-day giữ ngày lịch; đổi format chỉ ảnh hưởng UI. |
| M05 | AC-M05-74 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1244 | A mất mạng sau khi sửa trước xác nhận Save. | UI không báo Saved; giữ input khi có thể, người dùng biết trạng thái chưa đồng bộ. |
| M05 | AC-M05-75 | OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md:1245 | A mở Calendar trên mobile, sau đó desktop sau các thay đổi đã xác nhận. | Cùng trạng thái Calendar/Event/Occurrence/Reminder hợp lệ, không sai timezone hoặc quyền. |
| M06 | AC-M06-01 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1158 | Tạo Wish chỉ có tên | Wish được tạo; Private và Wishlisted mặc định. |
| M06 | AC-M06-02 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1159 | Tạo Wish không có tên | Bị chặn lưu, báo lỗi trường bắt buộc. |
| M06 | AC-M06-03 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1160 | Tạo Wish không có ngày | Thành công; không phát sinh ngày giả. |
| M06 | AC-M06-04 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1161 | Wish mới | Private mặc định, chỉ owner xem. |
| M06 | AC-M06-05 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1162 | Share Wish | B được quyền xem/chỉnh đúng vai trò được cấp. |
| M06 | AC-M06-06 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1163 | Một Wish ở nhiều Collection | Không có bản Wish trùng. |
| M06 | AC-M06-07 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1164 | Gỡ Wish khỏi Collection | Wish vẫn tồn tại và ở những Collection khác. |
| M06 | AC-M06-08 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1165 | Xóa Collection | Không xóa Wish hoặc media. |
| M06 | AC-M06-09 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1166 | Wish Private trong Collection Shared | Không lộ title, cover, counts suy ra riêng tư. |
| M06 | AC-M06-10 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1167 | Convert Wish→Goal | Wish giữ nguyên, có Goal mới và provenance link. |
| M06 | AC-M06-11 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1168 | Wish Fulfilled trực tiếp | Không phải tạo Goal trung gian. |
| M06 | AC-M06-12 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1169 | Archive Wish | Có thể tìm trong archive/khôi phục theo quyền. |
| M06 | AC-M06-13 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1170 | Save Goal Draft chưa đủ thông tin | Draft được lưu mà chưa cần metric hợp lệ. |
| M06 | AC-M06-14 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1171 | Activate Goal thiếu dữ liệu bắt buộc | Chặn Active; chỉ rõ lỗi theo Goal Type. |
| M06 | AC-M06-15 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1172 | Numeric Goal hợp lệ | Current/target/unit và tỷ lệ hiển thị chính xác. |
| M06 | AC-M06-16 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1173 | Numeric target = 0 | Không chia 0; không Active khi không hợp lệ. |
| M06 | AC-M06-17 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1174 | Checklist Goal | Task eligible/Done và progress được tính đúng. |
| M06 | AC-M06-18 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1175 | Outcome Goal | Điều kiện đạt rõ; không tự % outcome từ task. |
| M06 | AC-M06-19 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1176 | Linked Goal | Có nguồn/filter và cảnh báo nếu stale/inaccessible. |
| M06 | AC-M06-20 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1177 | Goal không có deadline | Active hợp lệ; không xuất date giả. |
| M06 | AC-M06-21 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1178 | Active Goal quá hạn | Overdue nhưng không auto Failed. |
| M06 | AC-M06-22 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1179 | Pause Goal | Giữ metric/history/Task khi Resume. |
| M06 | AC-M06-23 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1180 | Đổi target | History và definition version được giữ. |
| M06 | AC-M06-24 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1181 | Xóa Goal | Không xóa linked sources. |
| M06 | AC-M06-25 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1182 | Thêm Milestone | Gắn đúng Goal, state hợp lệ. |
| M06 | AC-M06-26 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1183 | Thêm Task trực tiếp | Gắn đúng Goal, không cần Milestone. |
| M06 | AC-M06-27 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1184 | Thêm Task vào Milestone | Quan hệ Milestone-Task hợp lệ. |
| M06 | AC-M06-28 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1185 | Gán Task cho B | Đúng assignee; chưa tự chấp nhận hoặc Done. |
| M06 | AC-M06-29 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1186 | B hoàn thành Task được phép | Status lưu, người cập nhật được ghi nhận. |
| M06 | AC-M06-30 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1187 | A/B thêm Task cùng lúc | Cả hai Tasks còn nguyên, không duplicate. |
| M06 | AC-M06-31 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1188 | Sắp xếp Task | Thứ tự thay đổi, ID/data giữ nguyên. |
| M06 | AC-M06-32 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1189 | Xóa Milestone còn Task | Hiện lựa chọn an toàn, không mất Task âm thầm. |
| M06 | AC-M06-33 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1190 | Cancelled Task | Được loại mẫu số theo quy tắc. |
| M06 | AC-M06-34 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1191 | Skipped Task | Vẫn trong mẫu số cho tới khi xác nhận loại. |
| M06 | AC-M06-35 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1192 | Current > Target | Giữ current thật, thanh progress tối đa 100%. |
| M06 | AC-M06-36 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1193 | Cập nhật Progress | Có old/new, nguồn/actor/timestamp hợp lệ. |
| M06 | AC-M06-37 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1194 | Giảm Progress hợp lệ | Lưu giá trị mới, ghi history rõ. |
| M06 | AC-M06-38 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1195 | Outcome all Tasks Done | Không tự Completed nếu chưa đạt/confirm. |
| M06 | AC-M06-39 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1196 | Nguồn Linked Goal inaccessible | Không hiển thị số giả hoặc dữ liệu vượt quyền. |
| M06 | AC-M06-40 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1197 | Link Place M03 | Dùng Place hiện có, không clone. |
| M06 | AC-M06-41 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1198 | Đếm số Place duy nhất | Một Place nhiều Visits chỉ đếm một. |
| M06 | AC-M06-42 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1199 | Đếm số Visit | Nhiều Visits được đếm theo metric Visit count. |
| M06 | AC-M06-43 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1200 | Link Trip M04 | Tham chiếu đúng Trip, không clone. |
| M06 | AC-M06-44 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1201 | Trip Completed | Goal còn điều kiện thì chưa tự Completed. |
| M06 | AC-M06-45 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1202 | Link Savings Goal M07 | M06 không tạo balance thứ hai. |
| M06 | AC-M06-46 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1203 | M07 thay đổi số tiết kiệm | M06 hiển thị dữ liệu cập nhật/trạng thái sync đúng. |
| M06 | AC-M06-47 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1204 | M07 có giao dịch Private | Không lộ transaction/amount không được phép. |
| M06 | AC-M06-48 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1205 | Link deadline M05 | Tạo/link đúng Event khi chọn. |
| M06 | AC-M06-49 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1206 | Đổi deadline đã link | Không sinh Event trùng. |
| M06 | AC-M06-50 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1207 | Xóa Calendar Event | Goal vẫn tồn tại. |
| M06 | AC-M06-51 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1208 | Attach media M02 | Không upload bản sao original nếu asset có sẵn. |
| M06 | AC-M06-52 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1209 | Link Diary M01 | Giữ Diary gốc và quyền riêng. |
| M06 | AC-M06-53 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1210 | Link Achievement M08 | Không tự reveal/public nội dung. |
| M06 | AC-M06-54 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1211 | Linked source deleted | Goal vẫn tồn tại, reference cảnh báo đúng. |
| M06 | AC-M06-55 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1212 | Goal đạt target | Chờ confirmation theo mode; không tự chốt. |
| M06 | AC-M06-56 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1213 | Owner Confirmation | Người đủ quyền xác nhận hợp lệ và lưu dấu vết. |
| M06 | AC-M06-57 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1214 | Both Confirmation thiếu B | Không Completed và không giả xác nhận. |
| M06 | AC-M06-58 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1215 | Both Confirmation đủ A/B | Completed khi đủ criteria và quyền. |
| M06 | AC-M06-59 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1216 | Tạo Achievement | Có ngày, nguồn và condition version. |
| M06 | AC-M06-60 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1217 | Evidence photo | Chỉ đính tài nguyên có quyền, không công khai riêng tư. |
| M06 | AC-M06-61 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1218 | Reopen Completed Goal | Giữ history/Achievement đã đạt cũ. |
| M06 | AC-M06-62 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1219 | Sửa bản chất Goal | Thông báo và xử lý version/Goal mới đúng. |
| M06 | AC-M06-63 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1220 | Xóa Achievement | Không xóa Goal/Wish/Media. |
| M06 | AC-M06-64 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1221 | Shared Goal chứa Private Wish | Không lộ Wish Private qua UI/links/search. |
| M06 | AC-M06-65 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1222 | Contributor sửa ngoài quyền | Bị chặn tại nguồn dữ liệu. |
| M06 | AC-M06-66 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1223 | A/B sửa cùng target | Phát hiện conflict, không blind overwrite. |
| M06 | AC-M06-67 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1224 | Thu hồi quyền khi đang chỉnh | Mutation mới trái quyền bị chặn. |
| M06 | AC-M06-68 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1225 | Search Private content | Không lộ tên, metadata, kết quả hoặc count. |
| M06 | AC-M06-69 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1226 | Insight Private content | Không tính nội dung của người không có quyền. |
| M06 | AC-M06-70 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1227 | Delete Goal | Đưa vào Trash, không cascade. |
| M06 | AC-M06-71 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1228 | Restore trong 30 ngày | Khôi phục bản ghi/link còn hợp lệ. |
| M06 | AC-M06-72 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1229 | Export Goal/Wish | Chỉ dữ liệu đủ quyền, giữ type/progress/source link phù hợp. |
| M06 | AC-M06-73 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1230 | Tạo và sửa Wish trên mobile | Hoàn thành flow core với giao diện phù hợp. |
| M06 | AC-M06-74 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1231 | Quản lý Goal trên desktop | Hoàn thành flow core và không mất dữ liệu. |
| M06 | AC-M06-75 | OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md:1232 | Mất mạng lúc cập nhật | Không báo sai đã lưu; hiển thị chưa sync/retry. |
| M07 | AC-M07-01 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1306 | Create Private Expense | Khi A tạo Expense đủ dữ liệu, record lưu Private; B không thấy ở Ledger/Search/Reports. |
| M07 | AC-M07-02 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1307 | Expense thiếu tên | Không xác nhận; chỉ ra title cần nhập. |
| M07 | AC-M07-03 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1308 | Expense amount 0/âm | Từ chối Expense thường; không coi đó là Refund. |
| M07 | AC-M07-04 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1309 | Original Currency | Giữ đúng mã tiền gốc ở ledger, detail, report/export. |
| M07 | AC-M07-05 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1310 | Một Payer | Payment phản ánh đúng A hoặc B trả toàn bộ, không đồng nhất với beneficiary. |
| M07 | AC-M07-06 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1311 | Hai Payer | Cho nhập A/B, tổng payment khớp Expense, không nhân bản. |
| M07 | AC-M07-07 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1312 | Receipt M02 | Liên kết đúng media asset; không upload original lần nữa; có ACL file. |
| M07 | AC-M07-08 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1313 | M03 Visit link | Expense ID hiện đúng ở Visit Detail theo quyền; delete link không xóa Expense. |
| M07 | AC-M07-09 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1314 | M04 Trip link | Trip đọc summary cùng Expense ID; không tạo ledger M04. |
| M07 | AC-M07-10 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1315 | Nhiều nguồn link | Một Expense dù liên kết nhiều Activity/Visit/Trip vẫn chỉ count một lần ở tổng. |
| M07 | AC-M07-11 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1316 | Shared Expense B chưa approve | Không xuất hiện như confirmed debt của B. |
| M07 | AC-M07-12 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1317 | B Reject | Pending/Rejected có dấu vết, không ghi nợ accepted. |
| M07 | AC-M07-13 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1318 | Edit Confirmed Expense | Hiển thị before/after và lấy lại approvals bị ảnh hưởng; settlement lịch sử nguyên vẹn. |
| M07 | AC-M07-14 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1319 | Void Expense | Không nằm ở actual spend hiện hành nhưng có audit; không cascade Place/Visit. |
| M07 | AC-M07-15 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1325 | Equal Split | Allocation tổng chính xác theo minor units, 50/50 với residue có rule. |
| M07 | AC-M07-16 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1326 | Fixed Amount | Chặn nếu tổng từng phần không bằng Expense; khi hợp lệ giữ đúng số đã phân bổ. |
| M07 | AC-M07-17 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1327 | Percentage Split | Tính % đúng; tổng phải 100%; rounding minh bạch. |
| M07 | AC-M07-18 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1328 | Weighted Split | Tính tỷ lệ theo shares dương, tổng bằng Expense. |
| M07 | AC-M07-19 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1329 | Rounding residue | Ví dụ 101.001 VND chia đôi không mất 1 VND; có preview. |
| M07 | AC-M07-20 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1330 | A trả hộ B | Sau approval, nghĩa vụ đúng chiều và đúng tổng. |
| M07 | AC-M07-21 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1331 | A/B cùng trả | 700.000/300.000 paid và 500.000/500.000 allocations dẫn tới B→A 200.000. |
| M07 | AC-M07-22 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1332 | Netting ngược chiều | Hai nghĩa vụ cùng currency đối chiều được net chính xác, vẫn drill down khoản gốc. |
| M07 | AC-M07-23 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1333 | Partial Settlement | Receiver confirm 200.000 của debt 500.000 → còn 300.000. |
| M07 | AC-M07-24 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1334 | Pending Settlement | Không làm giảm confirmed debt cho tới khi receiver confirm. |
| M07 | AC-M07-25 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1335 | Receiver confirmation | Chỉ tài khoản người nhận hợp lệ được xác nhận đã nhận. |
| M07 | AC-M07-26 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1336 | Settlement idempotency | Gửi lại cùng settlement/confirmation không trừ debt hai lần. |
| M07 | AC-M07-27 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1337 | Correct Confirmed Settlement | Correction có audit, balance tính lại; không xóa lịch sử. |
| M07 | AC-M07-28 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1338 | Partial Refund | Net expense giảm theo refund đã confirmed; allocation effect đúng theo đồng thuận. |
| M07 | AC-M07-29 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1339 | Refund after Settlement | Giữ settlement gốc, tính nghĩa vụ hoàn ngược nếu phù hợp. |
| M07 | AC-M07-30 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1340 | Cancellation fee | Phần không hoàn là net cost; không sinh fee expense trùng. |
| M07 | AC-M07-31 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1346 | Monthly Budget | Lưu kỳ tháng lịch/amount/currency và scope, usage từ Expense confirmed. |
| M07 | AC-M07-32 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1347 | Category Budget | Chọn đúng category; không kéo expense ngoài scope. |
| M07 | AC-M07-33 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1348 | Trip Budget | Liên kết Trip M04, số hiển thị cùng nguồn M07. |
| M07 | AC-M07-34 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1349 | One Expense in many Budgets | Trong tổng hợp riêng một scope chỉ count Expense một lần. |
| M07 | AC-M07-35 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1350 | 80% budget alert | Khi vượt ngưỡng tùy chọn, hiển thị cảnh báo đúng (không chặn ghi chi). |
| M07 | AC-M07-36 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1351 | 100%/>100% alert | Hiển thị đã tới/vượt giới hạn và giá trị còn lại/vượt chính xác. |
| M07 | AC-M07-37 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1352 | Expense over Budget | Nếu Expense hợp lệ vẫn ghi nhận, chỉ cảnh báo. |
| M07 | AC-M07-38 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1353 | Estimate vs Expense | M04 estimate hoặc Budget không tự biến thành khoản đã thanh toán. |
| M07 | AC-M07-39 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1354 | Close Budget period | Giữ lịch sử kỳ, corrections được kiểm soát, không rollover mặc định. |
| M07 | AC-M07-40 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1355 | Refund affects Budget | Budget dùng net expense phù hợp, giảm sử dụng khi refund confirmed. |
| M07 | AC-M07-41 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1356 | Category Spending report | Tổng từng category khớp unique confirmed net expenses theo quyền. |
| M07 | AC-M07-42 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1357 | Trip Spending report | Một Expense liên kết Booking+Activity cùng Trip chỉ count một lần. |
| M07 | AC-M07-43 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1358 | Missing FX report | Báo tổng currency converted chưa đầy đủ, không cộng lẫn currency gốc. |
| M07 | AC-M07-44 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1359 | B reporting vs A Private | Không tiết lộ Expense Private của A bằng số/đếm/search/aggregate. |
| M07 | AC-M07-45 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1365 | Create Personal Savings | Quỹ mới Private, target/currency hợp lệ và không bank-verified. |
| M07 | AC-M07-46 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1366 | Create Shared Savings | A/B được cấp đúng quyền với quỹ chung, không lộ quỹ cá nhân khác. |
| M07 | AC-M07-47 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1367 | Invalid Target | Target 0/âm không Active, không chia cho 0 khi tính progress. |
| M07 | AC-M07-48 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1368 | Confirmed Contribution | Balance tăng đúng amount sau confirmation policy. |
| M07 | AC-M07-49 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1369 | Pending Contribution | Balance confirmed chưa tăng; trạng thái pending tách riêng. |
| M07 | AC-M07-50 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1370 | Idempotent Contribution | Submit/confirm retry chỉ tăng balance một lần. |
| M07 | AC-M07-51 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1371 | Confirmed Withdrawal | Balance giảm chính xác theo amount/currency. |
| M07 | AC-M07-52 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1372 | Excess Withdrawal | Chặn vượt available balance theo rule đã duyệt. |
| M07 | AC-M07-53 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1373 | Withdrawal funds Expense | Có link và hai nghiệp vụ; total spending chỉ tính Expense thực. |
| M07 | AC-M07-54 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1374 | Savings over target | Hiển thị >100% giá trị thực, thanh progress có thể đầy. |
| M07 | AC-M07-55 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1375 | Target Reached | Không tự Completed nếu chưa xác nhận hoàn thành. |
| M07 | AC-M07-56 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1376 | Change Target | Giữ target trước đó trong history, không sửa movement. |
| M07 | AC-M07-57 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1377 | Track A/B contributions | Contributions gắn đúng contributor; không tự suy ownership. |
| M07 | AC-M07-58 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1378 | Link M06 Goal | M06 hiển thị balance từ M07 mà không duy trì số dư riêng. |
| M07 | AC-M07-59 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1379 | Link M04 Trip | Không tạo quỹ trùng khi link vào Trip. |
| M07 | AC-M07-60 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1380 | Archive Savings | Lịch sử Contribution/Withdrawal và balance còn truy vết đúng. |
| M07 | AC-M07-61 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1386 | Expense by JPY | Ghi 10.000 JPY gốc, không lẫn VND. |
| M07 | AC-M07-62 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1387 | JPY→VND conversion | Có rate snapshot source/date/confirmer và phương pháp rõ. |
| M07 | AC-M07-63 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1388 | No FX rate | Không cộng JPY vào VND; báo thiếu tỷ giá. |
| M07 | AC-M07-64 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1389 | Multiple currencies report | Giữ số gốc lẫn converted, nhãn unit và completeness. |
| M07 | AC-M07-65 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1390 | Cross-currency settlement | Không reconcile nếu chưa đủ tỷ giá/số nhận/đồng thuận. |
| M07 | AC-M07-66 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1391 | Create Recurring Rule | Lưu cycle, due date, amount, payer/split template. |
| M07 | AC-M07-67 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1392 | Recurring due candidate | Kỳ đến hạn vẫn pending, không tăng actual spending tự động. |
| M07 | AC-M07-68 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1393 | Recurring retry | Một candidate/period; xử lý lại không tạo Expense trùng. |
| M07 | AC-M07-69 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1394 | Stop recurring | Không sinh candidate future ngoài policy sau pause/end. |
| M07 | AC-M07-70 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1400 | Create Private Money Space | B không xem được expenses/balances của A Private. |
| M07 | AC-M07-71 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1401 | Share one Expense | Chỉ các field/rights được chấp thuận; không mở toàn bộ Space. |
| M07 | AC-M07-72 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1402 | Private Receipt in Shared Expense | B không mở được Receipt Private nếu chưa share asset độc lập. |
| M07 | AC-M07-73 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1403 | Revoke Access | URL/tab/form đã mở cũng không cho write/read mới vượt quyền. |
| M07 | AC-M07-74 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1404 | Concurrent Expense Edit | Không silent overwrite, nhất là amount/split/payment; approval invalidated khi cần. |
| M07 | AC-M07-75 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1405 | No forged confirmation | A không thay B approve obligation; B không giả A receiver confirmation. |
| M07 | AC-M07-76 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1406 | Audit of Money Adjustment | Có who/when/before/after/reason và related approvals. |
| M07 | AC-M07-77 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1407 | Trash Expense | Delete đưa Trash đúng quyền, không làm sai reconciliation current view. |
| M07 | AC-M07-78 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1408 | Cannot erase settled debt | Không xóa âm thầm Expense đã được đối soát/đã settle. |
| M07 | AC-M07-79 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1409 | Restore within 30 days | Restore không làm duplicate Expense/Settlement/Contribution. |
| M07 | AC-M07-80 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1410 | Personal export | A chỉ xuất dữ liệu có quyền, metadata currency/status đầy đủ. |
| M07 | AC-M07-81 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1411 | Shared export | Export theo quyền hiện hành, không xuất partner Private/chứng từ hạn chế. |
| M07 | AC-M07-82 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1412 | Backup/restore consistency | Balances, allocations, approvals, settlements và cross-links trước/sau đối chiếu được. |
| M07 | AC-M07-83 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1413 | Mobile Expense CRUD | Trên mobile tạo/sửa/approve/split, gắn chứng từ và xem đối soát thực hiện được. |
| M07 | AC-M07-84 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1414 | Desktop Budget/Savings | Trên desktop thực hiện đầy đủ tạo, chỉnh, góp/rút/confirm/export. |
| M07 | AC-M07-85 | OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md:1415 | Save under network failure | Khi mất mạng không hiện false success; retry an toàn không tạo giao dịch trùng. |
| M08 | AC-M08-01 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1014 | Tạo Moment hợp lệ | Lưu được ID ổn định, ngày xảy ra và ACL |
| M08 | AC-M08-02 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1015 | Tạo Moment thiếu tên | Không lưu Published; chỉ rõ field invalid |
| M08 | AC-M08-03 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1016 | Moment ngày quá khứ | Timeline sắp theo occurred_on |
| M08 | AC-M08-04 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1017 | Moment mới không share | Private mặc định |
| M08 | AC-M08-05 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1018 | Share Moment với B | B xem phần được phép, audit quyền |
| M08 | AC-M08-06 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1019 | B không được share | Không xem được Moment, link, preview |
| M08 | AC-M08-07 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1020 | Hai Personal Perspectives | Tác giả riêng, không ghi đè |
| M08 | AC-M08-08 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1021 | Tạo Collection | Gắn được nhiều Moment |
| M08 | AC-M08-09 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1022 | Một Moment thuộc nhiều Collection | Không tạo bản sao Moment |
| M08 | AC-M08-10 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1023 | Xóa Collection | Moment nguồn tồn tại |
| M08 | AC-M08-11 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1024 | Liên kết M02 | Tái sử dụng media permitted và kiểm quyền |
| M08 | AC-M08-12 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1025 | Liên kết Diary M01 | Không tạo Diary trùng |
| M08 | AC-M08-13 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1026 | Liên kết Trip M04 | Tham chiếu đúng Trip và quyền |
| M08 | AC-M08-14 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1027 | Milestone gắn M05 | Dùng ngày Anniversary nguồn |
| M08 | AC-M08-15 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1028 | Timeline nhiều Moment | Sort/filter/pagination ổn định và theo ACL |
| M08 | AC-M08-16 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1034 | Tạo Draft Letter | Private author-only |
| M08 | AC-M08-17 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1035 | Draft chưa chọn recipient | Lưu draft hợp lệ, chưa deliver |
| M08 | AC-M08-18 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1036 | Send Letter body trống | Báo lỗi; không tạo Delivered |
| M08 | AC-M08-19 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1037 | Send Now | Đúng người nhận, frozen delivered revision |
| M08 | AC-M08-20 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1038 | Retry Send | Không tạo Delivered trùng |
| M08 | AC-M08-21 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1039 | Scheduled Letter | Lưu đúng date/time/timezone và future timestamp |
| M08 | AC-M08-22 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1040 | B truy cập trước giờ gửi | Không thấy Letter body/metadata ngoài quyền |
| M08 | AC-M08-23 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1041 | A offline khi đến giờ gửi | Được xử lý không cần author online |
| M08 | AC-M08-24 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1042 | Cancel Scheduled | Không giao từ action cũ khi cancel hợp lệ |
| M08 | AC-M08-25 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1043 | Author sửa Delivered | Không đổi nội dung đã trao |
| M08 | AC-M08-26 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1044 | B chưa đọc | Không auto Opened |
| M08 | AC-M08-27 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1045 | B mở Letter | Recipient state riêng thành Opened |
| M08 | AC-M08-28 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1046 | B Archive | Không xóa sender retained letter |
| M08 | AC-M08-29 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1047 | Letter link Anniversary | Không tạo Anniversary mới |
| M08 | AC-M08-30 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1048 | Thông báo thư Scheduled | Không leak trước khi Delivered |
| M08 | AC-M08-31 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1054 | Tạo Surprise | Private+Secret mặc định |
| M08 | AC-M08-32 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1055 | B vào Home trước reveal | Không có Secret Surprise |
| M08 | AC-M08-33 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1056 | B Search | Không tìm được Secret |
| M08 | AC-M08-34 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1057 | B truy cập direct URL | Không leak metadata/exists |
| M08 | AC-M08-35 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1058 | B xem Activity Feed | Không leak preparing actions |
| M08 | AC-M08-36 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1059 | B xem counters | Không suy ra Secret counts |
| M08 | AC-M08-37 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1060 | Teaser chosen | Chỉ hiện sanctioned teaser fields |
| M08 | AC-M08-38 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1061 | Linked M06 Private Task | Không expose Task |
| M08 | AC-M08-39 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1062 | Linked M07 Private Expense | Không expose Expense |
| M08 | AC-M08-40 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1063 | Linked M02 Private asset | Không expose asset |
| M08 | AC-M08-41 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1064 | Surprise reveal time reached | Đúng recipient quyền Revealed |
| M08 | AC-M08-42 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1065 | Surprise Revealed chưa xem | Không auto marked Opened |
| M08 | AC-M08-43 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1066 | Cancel Surprise | Không reveal sau cancel từ action cũ |
| M08 | AC-M08-44 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1067 | Xóa Surprise | Không cascade delete Expense/Letter/Capsule |
| M08 | AC-M08-45 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1068 | Thay đổi quyền Surprise | Notification cũ/future không leak |
| M08 | AC-M08-46 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1074 | Tạo Capsule Draft | Lưu được nội dung chưa hoàn thiện |
| M08 | AC-M08-47 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1075 | Capsule không item | Không Seal |
| M08 | AC-M08-48 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1076 | Capsule không recipient | Không Seal |
| M08 | AC-M08-49 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1077 | Thiếu date/time/timezone | Không Seal |
| M08 | AC-M08-50 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1078 | Seal hợp lệ | Snapshot, manifest, status, actions nhất quán |
| M08 | AC-M08-51 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1079 | Seal thất bại | Không báo Sealed success, retry an toàn |
| M08 | AC-M08-52 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1080 | Creator xem Sealed trước giờ | Bị deny content qua app |
| M08 | AC-M08-53 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1081 | Recipient xem Sealed trước giờ | Bị deny content qua app |
| M08 | AC-M08-54 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1082 | Recipient đổi device clock | Không mở trước system trusted time |
| M08 | AC-M08-55 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1083 | Secret capsule direct URL | Không leak even metadata/count |
| M08 | AC-M08-56 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1084 | Media nguồn sửa sau Seal | Sealed content không thay đổi |
| M08 | AC-M08-57 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1085 | Concurrent draft edits | Không mất nội dung hợp lệ |
| M08 | AC-M08-58 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1086 | Collab Seal thiếu B approval | Không Seal |
| M08 | AC-M08-59 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1087 | Draft đổi giữa verify/Seal | Conflict/version mismatch |
| M08 | AC-M08-60 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1088 | Đến unlock time | Eligible đúng recipient, chưa auto opened |
| M08 | AC-M08-61 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1089 | Offline at unlock | Recipient mở được sau này |
| M08 | AC-M08-62 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1090 | A Opened, B not opened | Trạng thái mỗi người riêng |
| M08 | AC-M08-63 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1091 | Retry unlock action | Không tạo duplicate/change state sai |
| M08 | AC-M08-64 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1092 | Cancel Capsule | Không unlock từ action cũ |
| M08 | AC-M08-65 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1093 | After capsule opened | Không tự xóa nội dung |
| M08 | AC-M08-66 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1099 | M05 Anniversary date changes | M08 liên kết hiển thị ngày updated |
| M08 | AC-M08-67 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1100 | M05 date changes after Seal | Không đổi unlock_at đã khóa |
| M08 | AC-M08-68 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1101 | M04 Trip Completed | Không tự tạo Moment công khai |
| M08 | AC-M08-69 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1102 | M06 Goal Completed | Không tự tạo Moment public |
| M08 | AC-M08-70 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1103 | M02 media revoked | Không leak asset ngoài quyền |
| M08 | AC-M08-71 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1104 | M01 Diary Private linked | Không tự share Diary |
| M08 | AC-M08-72 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1105 | M09 reaction before capsule reveal | Không vượt state/ACL |
| M08 | AC-M08-73 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1106 | Notification failed at unlock | Eligible access vẫn đúng |
| M08 | AC-M08-74 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1107 | Secret Surprise notification | Không leak title/preview/cover |
| M08 | AC-M08-75 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1108 | Cross-module source multi-link | Không duplicate Moment/Letter records |
| M08 | AC-M08-76 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1114 | Editor revoked while open | Server deny new saves |
| M08 | AC-M08-77 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1115 | Concurrent edit Moment | Không silently overwrite |
| M08 | AC-M08-78 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1116 | Audit read | Không lộ Sealed content |
| M08 | AC-M08-79 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1117 | Soft-delete Moment | Vào Trash ≥30 ngày |
| M08 | AC-M08-80 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1118 | Restore within 30 days | Dữ liệu hợp lệ không cascade sai |
| M08 | AC-M08-81 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1119 | Restore Sealed Capsule | Giữ unlock_at, manifest, snapshot, status |
| M08 | AC-M08-82 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1120 | Export before unlock | Không chứa sealed readable contents |
| M08 | AC-M08-83 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1121 | Backup/Restore | Giữ lock, ACL, recipient opening state |
| M08 | AC-M08-84 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1122 | P0 on mobile & desktop | Cả hai hoàn thành luồng chính |
| M08 | AC-M08-85 | OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md:1123 | Network loss save/open | Không false Saved/Sealed/Delivered/Opened |
| M09 | AC-M09-01 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1272 | Thả Love đúng quyền | Given shared target và can_react; when A chọn Love; then có đúng 1 active Love. |
| M09 | AC-M09-02 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1273 | Reaction trên Private nguồn người khác | Given B cannot view; when reaction; then deny without existence leakage. |
| M09 | AC-M09-03 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1274 | Đổi Love→Haha | Given one active Love; when choose Haha; then active set chỉ có Haha. |
| M09 | AC-M09-04 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1275 | Gỡ reaction | When click current active type; then target actor active reaction trở về absent và count đúng. |
| M09 | AC-M09-05 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1276 | Retry reaction | Given same mutation retried; then no duplicate active/action/notification. |
| M09 | AC-M09-06 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1277 | Source moved | Given target moved/reordered; then reaction remains linked by target ID. |
| M09 | AC-M09-07 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1278 | Source deleted | Given source trashed; then no unauthorized reaction/list display. |
| M09 | AC-M09-08 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1279 | Actor loses access | When permission revoked; then new reaction denied on both device and direct request. |
| M09 | AC-M09-09 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1280 | Reaction on Capsule Sealed | Given capsule not eligible; then no content/reaction access. |
| M09 | AC-M09-10 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1281 | Reaction counts ACL | Given hidden source; then neither counts nor actor labels leak. |
| M09 | AC-M09-11 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1287 | Create comment | Given valid body & permission; when send; then record bound to exact target. |
| M09 | AC-M09-12 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1288 | Empty body | When submit empty comment; then no record. |
| M09 | AC-M09-13 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1289 | Whitespace body | When submit whitespace-only; then no record. |
| M09 | AC-M09-14 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1290 | Create retry | When same request repeated; then one Comment and logical alert. |
| M09 | AC-M09-15 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1291 | Reply target | Given root comment; when reply; then linked to correct root/target. |
| M09 | AC-M09-16 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1292 | Reply-to-reply UI | When reply to child; then render in same second-level group. |
| M09 | AC-M09-17 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1293 | Edit own | When author edits current revision; then show Edited and preserve revision. |
| M09 | AC-M09-18 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1294 | Edit other | When nonauthor attempts edit; then denied. |
| M09 | AC-M09-19 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1295 | Delete own | When author deletes; then hide body via tombstone. |
| M09 | AC-M09-20 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1296 | Delete root with reply | Given B reply; when A removes root; then reply remains if source access valid. |
| M09 | AC-M09-21 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1297 | Deleted comment search | Given comment deleted; when query; then no visible deleted snippet. |
| M09 | AC-M09-22 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1298 | Comment on Page ID | When comment on M01 Page; then target Page stable ID. |
| M09 | AC-M09-23 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1299 | Photobook reorder | When Page moved; then comment stays original Page. |
| M09 | AC-M09-24 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1300 | Media target | When comment on M02 Asset; then attached to exact asset, not all placements. |
| M09 | AC-M09-25 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1301 | Visit Comment vs Review | When M03 Visit Comment; then no official M03 Review auto-created. |
| M09 | AC-M09-26 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1302 | Event Comment vs RSVP | When M05 Event Comment; then participant response unchanged. |
| M09 | AC-M09-27 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1303 | Goal Comment vs Complete | When M06 Goal Comment; then status/progress unchanged. |
| M09 | AC-M09-28 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1304 | Expense Comment vs Approve | When M07 Expense Comment; then approval/settlement unchanged. |
| M09 | AC-M09-29 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1305 | Letter pre-Delivered | When target not delivered; then recipient cannot comment/react. |
| M09 | AC-M09-30 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1306 | Concurrent comment edits/deletion | When stale edit arrives after delete; then no resurrection. |
| M09 | AC-M09-31 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1312 | Mention with authorized B | When valid mention; then structured mention saved and eligible notification. |
| M09 | AC-M09-32 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1313 | Mention unauthorized B | When B cannot view source; then no notification/information leak. |
| M09 | AC-M09-33 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1314 | Duplicate mentions | When @B appears several times; then not multiple alerts for same action. |
| M09 | AC-M09-34 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1315 | Reply notification on | Given enabled preference; when reply; then eligible in-app alert. |
| M09 | AC-M09-35 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1316 | Comments notification off | Given off; when other actor comments; then no corresponding alert. |
| M09 | AC-M09-36 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1317 | Reaction changes rapidly | When actor toggles types; then no alert spam. |
| M09 | AC-M09-37 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1318 | Notification read ≠ Letter Opened | When mark M09 alert read; then M08 recipient read state remains unchanged. |
| M09 | AC-M09-38 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1319 | Old notification deleted source | When click stale notice; then cannot view removed source content. |
| M09 | AC-M09-39 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1320 | Old notification revoked source | When click notice without access; then denied without leak. |
| M09 | AC-M09-40 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1321 | Notification M08 secret | Given not revealed; then no title/content secret in alert. |
| M09 | AC-M09-41 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1327 | Reactions Only | When target mode Reactions Only; then comments blocked, reactions allowed if source grants. |
| M09 | AC-M09-42 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1328 | Comments Only | When mode Comments Only; then reaction blocked, comment allowed if grants. |
| M09 | AC-M09-43 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1329 | Read Only | When mode Read Only; then both mutating interactions blocked. |
| M09 | AC-M09-44 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1330 | Disable comments preserve old | When mode switched off; then old authorized comments remain per policy. |
| M09 | AC-M09-45 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1331 | Mode cannot elevate source | Given source denies Comment; when mode Both; then Comment still denied. |
| M09 | AC-M09-46 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1332 | Revoke while tab open | Given B loaded target; when A revokes B; then B subsequent mutation denied. |
| M09 | AC-M09-47 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1333 | Shared→Private Feed | Given source made Private; then B no longer sees interaction activity. |
| M09 | AC-M09-48 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1334 | Secret Surprise counts | Before reveal, recipient cannot infer interaction count. |
| M09 | AC-M09-49 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1335 | Search Private | Search excludes unauthorized comment and count. |
| M09 | AC-M09-50 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1336 | Shared Expense private receipt | Commenting Expense never exposes private receipt. |
| M09 | AC-M09-51 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1342 | Activity Feed scope | Only interactions on currently accessible source appear. |
| M09 | AC-M09-52 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1343 | Feed pagination | Large events can load incrementally without duplicate/unauthorized items. |
| M09 | AC-M09-53 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1344 | Feed after revoke | After source rights revoked, feed stops disclosing target. |
| M09 | AC-M09-54 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1345 | Comment soft delete recovery | Delete creates eligible recoverable state under policy. |
| M09 | AC-M09-55 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1346 | Restore ACL | Restored comment not exposed when source unavailable/unauthorized. |
| M09 | AC-M09-56 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1347 | Export scoped | Only comments/reactions eligible under target rights exported. |
| M09 | AC-M09-57 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1348 | Backup/Restore consistency | Keep author/target/thread/revision identifiers consistent after restore. |
| M09 | AC-M09-58 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1349 | Source deleted no cascade | Deleting source does not delete unrelated module entities. |
| M09 | AC-M09-59 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1350 | Comment send network fail | Do not claim saved; preserve draft and reconcile retry. |
| M09 | AC-M09-60 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1351 | Reaction network fail | Pending UI reverts/refreshes to confirmed state. |
| M09 | AC-M09-61 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1352 | Mobile comment | Can create/edit/reply/delete on mobile. |
| M09 | AC-M09-62 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1353 | Desktop comment | Can create/edit/reply/delete on desktop. |
| M09 | AC-M09-63 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1354 | Mobile mention | Can select eligible partner and post mention by touch/keyboard. |
| M09 | AC-M09-64 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1355 | Cross-device feed | Source and actor state consistent mobile vs desktop. |
| M09 | AC-M09-65 | OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md:1356 | Concurrent interactions | Two users add independent comments without loss, duplicates or invalid ordering. |
| M10 | AC-M10-01 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1369 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đăng ký tài khoản mới. | **Then:** User ID độc lập, account trạng thái phù hợp. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-02 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1370 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** xác minh email hợp lệ. | **Then:** Verified state đúng; link consumed. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-03 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1371 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** email chưa xác minh. | **Then:** Không hoàn tất Pairing. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-04 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1372 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** tạo lời mời. | **Then:** Có mã/link và expiry 48 giờ. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-05 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1373 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** mã mời hết hạn. | **Then:** Không Accept. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-06 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1374 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** thu hồi lời mời. | **Then:** Token cũ vô hiệu. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-07 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1375 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** b chấp nhận lời mời. | **Then:** Chưa Active khi thiếu xác nhận cần thiết của A. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-08 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1376 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** cả A và B đồng ý. | **Then:** Tạo chính xác một Couple Space Active. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-09 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1377 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** b đã có Space Active. | **Then:** Không tham gia Space thứ hai. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-10 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1378 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** lệnh Pairing được gửi lại. | **Then:** Không tạo Space trùng. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-11 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1379 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** a có dữ liệu Private trước Pairing. | **Then:** B không tự xem được. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-12 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1380 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** chưa Pairing. | **Then:** Chức năng cá nhân hợp lệ vẫn sử dụng được. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-13 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1386 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi Display Name. | **Then:** Không thay đổi User ID. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-14 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1387 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi Avatar. | **Then:** Xác minh quyền Media/asset và fallback. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-15 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1388 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi Couple Space Name. | **Then:** Cập nhật theo quyền; có history. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-16 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1394 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** b cố sửa email A. | **Then:** Từ chối. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-17 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1395 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** b cố đổi mật khẩu A. | **Then:** Từ chối. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-18 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1396 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đăng nhập hợp lệ. | **Then:** Tạo session hợp lệ. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-19 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1397 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đăng nhập sai liên tục. | **Then:** Có bảo vệ thử sai. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-20 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1398 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** reset Password hợp lệ. | **Then:** Đặt password mới an toàn. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-21 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1399 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** dùng lại link reset. | **Then:** Không chấp nhận. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-22 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1400 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** bật MFA thành công. | **Then:** Áp dụng second-factor cho flow được bảo vệ. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-23 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1401 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** dùng mã Recovery hợp lệ. | **Then:** Khôi phục bằng quy trình tăng cường. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-24 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1402 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** revoke Session. | **Then:** Thiết bị cũ không thể thực hiện request mới. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-25 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1403 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đăng xuất mọi thiết bị khác. | **Then:** Thu hồi đúng sessions liên quan. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-26 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1404 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** thay đổi thông tin xác thực quan trọng. | **Then:** Có Security Event phù hợp. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-27 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1405 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** xem Audit cá nhân. | **Then:** Không lộ account data của B. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-28 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1411 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** tạo nội dung mới. | **Then:** Private mặc định. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-29 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1412 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** chia sẻ Diary. | **Then:** Chỉ mở đúng item được chọn. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-30 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1413 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** shared Trip chứa Private Expense. | **Then:** Không lộ Expense. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-31 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1414 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** shared Moment chứa ảnh Private. | **Then:** Không tự lộ M02 media. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-32 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1415 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** permission Inspector. | **Then:** Hiển thị effective permission. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-33 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1416 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** thu hồi Viewer. | **Then:** Các truy cập mới bị từ chối. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-34 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1417 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** thu hồi quyền khi tab mở. | **Then:** Không lưu trái quyền. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-35 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1418 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** truy cập URL Private. | **Then:** Từ chối. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-36 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1419 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** search nội dung Private. | **Then:** Không trả results/preview. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-37 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1420 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** report có dữ liệu Private của B. | **Then:** A không xem trái quyền. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-38 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1421 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** notification cũ tới nội dung mất quyền. | **Then:** Không truy cập được nguồn. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-39 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1422 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** capsule Sealed. | **Then:** Không mở sớm dù có Viewer role khác. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-40 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1423 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** space Owner cố xác nhận Expense thay B. | **Then:** Từ chối. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-41 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1424 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** interaction Settings cho phép nhưng nguồn cấm. | **Then:** Không Comment được. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-42 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1425 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** export nội dung Secret. | **Then:** Không xuất vượt quyền. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-43 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1426 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi quyền nội dung liên kết. | **Then:** Các module hiển thị nhất quán. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-44 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1432 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** chọn Light Theme. | **Then:** Hiển thị đúng mode. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-45 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1433 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** chọn Dark Theme. | **Then:** Hiển thị đúng mode. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-46 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1434 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** chọn System Theme. | **Then:** Tôn trọng lựa chọn thiết bị khi hỗ trợ. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-47 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1435 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** a đổi Theme. | **Then:** Không ép B đổi. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-48 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1436 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi Couple Theme. | **Then:** Không ghi đè trợ năng cá nhân. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-49 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1437 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** bật Reduced Motion. | **Then:** Core actions vẫn vận hành. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-50 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1438 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** dùng bàn phím. | **Then:** Điều hướng tương tác quan trọng. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-51 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1439 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** phóng to chữ. | **Then:** Nội dung quan trọng vẫn đọc được. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-52 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1440 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi 12h/24h. | **Then:** Không đổi canonical event instant. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-53 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1441 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đổi timezone hiển thị. | **Then:** Không làm sai anniversary/all-day date. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-54 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1442 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** cá nhân hóa Homepage. | **Then:** Chỉ dữ liệu đúng quyền. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-55 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1448 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** m05 tạo Reminder. | **Then:** Notification Center hiển thị đúng người. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-56 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1449 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** m09 tạo Mention. | **Then:** Notification đúng quyền. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-57 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1450 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** m08 Letter Delivered. | **Then:** Không alert trước delivery. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-58 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1451 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** capsule đến thời điểm mở. | **Then:** Unlock không phụ thuộc notification delivery. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-59 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1452 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** tắt category notification. | **Then:** Không tạo alert proactive theo category được tắt. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-60 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1453 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đặt Quiet Hours. | **Then:** Đúng channel và timezone policy. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-61 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1454 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** quiet Hours trùng giờ Capsule. | **Then:** Capsule mở đúng eligibility. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-62 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1455 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** notification xử lý lại. | **Then:** Không tạo duplicate không cần thiết. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-63 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1456 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** đánh dấu Notification đọc. | **Then:** Không tự mark Letter Opened. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-64 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1457 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** xóa Notification. | **Then:** Không xóa nguồn. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-65 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1458 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** thu hồi quyền nội dung. | **Then:** Notification cũ không vượt quyền. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-66 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1459 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** thông báo bảo mật. | **Then:** Không tiết lộ secret credentials. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-67 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1465 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** a Export My Data. | **Then:** Không có B Private. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-68 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1466 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** export Shared Space. | **Then:** Chỉ Shared được phép. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-69 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1467 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** export Capsule trước Unlock. | **Then:** Không có content readable sealed. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-70 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1468 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** backup đa phân hệ. | **Then:** Giữ liên kết và ACL. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-71 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1469 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** restore Photobook Published. | **Then:** Giữ published immutable version. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-72 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1470 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** restore Expense và Settlement. | **Then:** Không tính sai obligations. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-73 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1471 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** restore Capsule Sealed. | **Then:** Không unlock sớm. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-74 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1472 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** item Restore từ Trash. | **Then:** Đúng quyền và thời hạn. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-75 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1473 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** restore có missing source. | **Then:** Không tạo phantom/trùng links. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-76 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1474 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** storage Overview. | **Then:** Không lộ B Private count/size. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-77 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1475 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** export Request thất bại. | **Then:** Không hiển thị Complete giả. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-78 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1476 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** system Restore. | **Then:** Không có unilateral shared rollback. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-79 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1482 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** a yêu cầu Disconnect. | **Then:** Không cần B chấp thuận để A rời. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-80 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1483 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** disconnect hoàn tất. | **Then:** Chặn shared writes mới. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-81 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1484 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** b còn dữ liệu Private. | **Then:** Không bị xóa bởi A Disconnect. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-82 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1485 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** shared Photobook. | **Then:** Giữ quyền và đóng góp của cả hai. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-83 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1486 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** settlement chưa hoàn tất. | **Then:** Giữ lịch sử nghĩa vụ. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-84 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1487 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** capsule chưa mở. | **Then:** D35 paused reveal policy áp dụng. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-85 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1488 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** export sau Disconnect. | **Then:** Chỉ phạm vi còn được phép. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-86 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1489 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** reconnect hai người. | **Then:** Cần consent cả hai. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-87 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1490 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** delete Account. | **Then:** Không cascade Partner data. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-88 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1491 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** b inactive. | **Then:** A không tự xem B Private. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-89 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1492 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** tạo lại tài khoản. | **Then:** Không chiếm dữ liệu Space cũ. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |
| M10 | AC-M10-90 | OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md:1493 | **Given:** tài khoản A/B, nguồn và trạng thái liên quan đã chuẩn bị hợp lệ hoặc cố ý trái quyền; **When:** mobile/Desktop. | **Then:** Mọi nghiệp vụ P0 dùng được ở cả hai. Không phát sinh side effect không được phép; giao diện phản ánh đúng trạng thái trả về. |

## 6. Master Dxx Decision Index — 247 quyết định đã khóa

**247/247 Dxx** có mặt ở bảng dưới; giữ nguyên wording từ quyết định nguồn qua tệp CSV. Cột AC ghi **nguyên chuỗi tham chiếu từ bảng truy vết của BRD**, nếu có; không tự suy diễn hoặc mở rộng khoảng AC có ký hiệu viết tắt. `—` nghĩa là **BRD không có bảng Dxx→AC trực tiếp trong những dòng quyết định đã kiểm**, không có nghĩa quyết định thiếu Acceptance Criteria. Khi thiết kế test detail phải nối các dòng này bằng chứng cứ cụ thể, không hạ quyết định khỏi scope.

| Dxx canonical | BRD Dxx dòng | AC reference (nguyên văn nếu có) | Trạng thái link | Desktop | Mobile |
|---|---:|---|---|---|---|
| M01-D01 | 104 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D02 | 105 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D03 | 106 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D04 | 107 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D05 | 108 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D06 | 109 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D07 | 110 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D08 | 111 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D09 | 112 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D10 | 113 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D11 | 114 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D12 | 115 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D13 | 116 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D14 | 117 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M01-D15 | 118 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D01 | 96 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D02 | 97 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D03 | 98 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D04 | 99 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D05 | 100 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D06 | 101 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D07 | 102 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D08 | 103 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D09 | 104 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D10 | 105 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D11 | 106 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D12 | 107 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D13 | 108 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D14 | 109 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D15 | 110 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D16 | 111 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D17 | 112 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D18 | 113 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D19 | 114 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M02-D20 | 115 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M03-D01 | 115 | AC-M03-04, 47 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D02 | 116 | AC-M03-01, 64, 76 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D03 | 117 | AC-M03-06, 07, 08 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D04 | 118 | AC-M03-05, 10 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D05 | 119 | AC-M03-15–24 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D06 | 120 | AC-M03-12, 13 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D07 | 121 | AC-M03-25–34 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D08 | 122 | AC-M03-35–37, 60 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D09 | 123 | AC-M03-42–45 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D10 | 124 | AC-M03-46, 47 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D11 | 125 | AC-M03-48, 49 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D12 | 126 | AC-M03-52–54 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D13 | 127 | AC-M03-57–59 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D14 | 128 | AC-M03-55, 56, 60–63 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D15 | 129 | AC-M03-40, 41, 65 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D16 | 130 | AC-M03-63, 71, 72 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D17 | 131 | AC-M03-66–68 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D18 | 132 | AC-M03-73–75 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D19 | 133 | AC-M03-04, 57 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M03-D20 | 134 | AC-M03-77–79 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D01 | 114 | AC-M04-01, AC-M04-02, AC-M04-05 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D02 | 115 | AC-M04-01, AC-M04-11, AC-M04-13 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D03 | 116 | AC-M04-05 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D04 | 117 | AC-M04-04, AC-M04-07, AC-M04-08 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D05 | 118 | AC-M04-11..20, mobile tests | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D06 | 119 | AC-M04-12, AC-M04-13 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D07 | 120 | AC-M04-14, AC-M04-15, AC-M04-20 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D08 | 121 | AC-M04-06, AC-M04-31, AC-M04-46 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D09 | 122 | AC-M04-16, AC-M04-17 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D10 | 123 | AC-M04-48, AC-M04-49 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D11 | 124 | AC-M04-25, AC-M04-26 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D12 | 125 | AC-M04-27–29 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D13 | 126 | AC-M04-30, AC-M04-32, AC-M04-33 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D14 | 127 | AC-M04-35–40 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D15 | 128 | AC-M04-41–43 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D16 | 129 | AC-M04-44 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D17 | 130 | AC-M04-45–47 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D18 | 131 | AC-M04-23, AC-M04-24, AC-M04-61 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D19 | 132 | AC-M04-21, AC-M04-22 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D20 | 133 | AC-M04-50–55 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D21 | 134 | AC-M04-67 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M04-D22 | 135 | AC-M04-68 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D01 | 117 | AC-M05-01–05,15 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D02 | 118 | AC-M05-16–27 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D03 | 119 | AC-M05-06–09,14,73 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D04 | 120 | AC-M05-06,10 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D05 | 121 | AC-M05-12–13 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D06 | 122 | AC-M05-21–24 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D07 | 123 | AC-M05-28–29 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D08 | 124 | AC-M05-30 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D09 | 125 | AC-M05-31 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D10 | 126 | AC-M05-32–33,38,40 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D11 | 127 | AC-M05-34–37,39 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D12 | 128 | AC-M05-33 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D13 | 129 | AC-M05-41–42,44–46 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D14 | 130 | AC-M05-41,46–47 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D15 | 131 | AC-M05-43 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D16 | 132 | AC-M05-48 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D17 | 133 | AC-M05-49–50 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D18 | 134 | AC-M05-27,51–52 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D19 | 135 | AC-M05-53–59,63–65 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D20 | 136 | AC-M05-60–61 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D21 | 137 | AC-M05-72 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M05-D22 | 138 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D01 | 82 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D02 | 83 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D03 | 84 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D04 | 85 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D05 | 86 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D06 | 87 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D07 | 88 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D08 | 89 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D09 | 90 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D10 | 91 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D11 | 92 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D12 | 93 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D13 | 94 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D14 | 95 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D15 | 96 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D16 | 97 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D17 | 98 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D18 | 99 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D19 | 100 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D20 | 101 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D21 | 102 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D22 | 103 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D23 | 104 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M06-D24 | 105 | — | LINK_MAPPING_TODO | NOT_RUN | NOT_RUN |
| M07-D01 | 87 | AC-70–AC-72 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D02 | 88 | AC-01, AC-45 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D03 | 89 | AC-01–AC-14 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D04 | 90 | AC-05–AC-06, AC-20–AC-21 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D05 | 91 | AC-06, AC-21 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D06 | 92 | AC-15–AC-18 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D07 | 93 | AC-15 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D08 | 94 | AC-11–AC-12 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D09 | 95 | AC-11–AC-14 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D10 | 96 | AC-21–AC-22 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D11 | 97 | AC-23–AC-26 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D12 | 98 | AC-27 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D13 | 99 | AC-28–AC-30 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D14 | 100 | AC-31–AC-34 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D15 | 101 | AC-35–AC-36 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D16 | 102 | AC-39 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D17 | 103 | AC-37 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D18 | 104 | AC-45–AC-46 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D19 | 105 | AC-48–AC-53 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D20 | 106 | AC-55 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D21 | 107 | AC-57 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D22 | 108 | AC-45–AC-46 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D23 | 109 | AC-66–AC-69 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D24 | 110 | AC-61–AC-65 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D25 | 111 | AC-62–AC-65 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D26 | 112 | AC-08–AC-10, AC-42–AC-43, AC-58–AC-59 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D27 | 113 | AC-72 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D28 | 114 | AC-80–AC-81 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D29 | 115 | AC-76–AC-82 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M07-D30 | 116 | AC-74, AC-83–AC-85 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D01 | 76 | AC-01–85 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D02 | 77 | AC-04–06,31,70 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D03 | 78 | AC-01–04 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D04 | 79 | AC-07,77 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D05 | 80 | AC-08–10 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D06 | 81 | AC-14,66–67 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D07 | 82 | AC-16–24 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D08 | 83 | AC-25 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D09 | 84 | AC-26–28 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D10 | 85 | AC-31–37 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D11 | 86 | AC-38–40,74 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D12 | 87 | AC-46–50 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D13 | 88 | AC-49,60 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D14 | 89 | AC-48,62 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D15 | 90 | AC-31,55 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D16 | 91 | AC-50–59 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D17 | 92 | AC-52–54 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D18 | 93 | AC-50,56,81–83 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D19 | 94 | AC-64,81 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D20 | 95 | AC-52–55 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D21 | 96 | AC-57–59 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D22 | 97 | AC-54,60–61 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D23 | 98 | AC-60–65 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D24 | 99 | AC-23,73–74 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D25 | 100 | AC-11,40,70–71 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D26 | 101 | AC-31–45,82 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D27 | 102 | AC-79–83 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D28 | 103 | AC-81–83 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D29 | 104 | AC-57–59,76–77 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M08-D30 | 105 | AC-84–85 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D01 | 83 | AC-11/26–29 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D02 | 84 | AC-01/11/22–29 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D03 | 85 | AC-01–05 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D04 | 86 | AC-03–05 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D05 | 87 | AC-11–14 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D06 | 88 | AC-15/16/20 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D07 | 89 | AC-17/18 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D08 | 90 | AC-19–21/54–55 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D09 | 91 | AC-31–33 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D10 | 92 | AC-51–53 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D11 | 93 | AC-34–40 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D12 | 94 | AC-35 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D13 | 95 | AC-36 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D14 | 96 | AC-41–45 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D15 | 97 | AC-02/45–50 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D16 | 98 | AC-22/23 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D17 | 99 | AC-24 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D18 | 100 | AC-25–27 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D19 | 101 | AC-28/50 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D20 | 102 | AC-09/29/40/48 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D21 | 103 | AC-21/49 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D22 | 104 | AC-54–58 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D23 | 105 | AC-05/14/30/65 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M09-D24 | 106 | AC-61–65 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D01 | 80 | AC-M10-01–12 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D02 | 81 | AC-M10-01–12 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D03 | 82 | AC-M10-01–12 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D04 | 83 | AC-M10-01–12 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D05 | 84 | AC-M10-01–12 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D06 | 85 | AC-M10-01–12 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D07 | 86 | AC-M10-13–16 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D08 | 87 | AC-M10-13–16 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D09 | 88 | AC-M10-17–27 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D10 | 89 | AC-M10-17–27 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D11 | 90 | AC-M10-17–27 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D12 | 91 | AC-M10-17–27 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D13 | 92 | AC-M10-28–43 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D14 | 93 | AC-M10-28–43 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D15 | 94 | AC-M10-28–43 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D16 | 95 | AC-M10-28–43 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D17 | 96 | AC-M10-28–43 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D18 | 97 | AC-M10-28–43 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D19 | 98 | AC-M10-44–54 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D20 | 99 | AC-M10-44–54 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D21 | 100 | AC-M10-44–54 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D22 | 101 | AC-M10-44–54 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D23 | 102 | AC-M10-44–54 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D24 | 103 | AC-M10-44–54 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D25 | 104 | AC-M10-44–54 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D26 | 105 | AC-M10-55–66 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D27 | 106 | AC-M10-55–66 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D28 | 107 | AC-M10-55–66 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D29 | 108 | AC-M10-55–66 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D30 | 109 | AC-M10-67–78 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D31 | 110 | AC-M10-67–78 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D32 | 111 | AC-M10-67–78 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D33 | 112 | AC-M10-79–89 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D34 | 113 | AC-M10-79–89 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D35 | 114 | AC-M10-79–89 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D36 | 115 | AC-M10-79–89 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D37 | 116 | AC-M10-79–89 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D38 | 117 | AC-M10-39, 69, 73, 84 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D39 | 118 | AC-M10-26–27 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |
| M10-D40 | 119 | AC-M10-90 | BRD_EXPLICIT | NOT_RUN | NOT_RUN |

**Tệp index có cả quyết định nguyên văn:** `OUR_SPACE_DXX_TRACEABILITY_247_DRAFT_V1.0.csv`. Với các mô-đun thiếu bảng Dxx→AC trực tiếp, hoàn thiện liên kết có bằng chứng là một việc riêng của QA mapping, **không được đánh dấu tất cả đã fully mapped**.

## 7. Cách điền kết quả QA và quyết định RELEASE

- `NOT_RUN` = chưa chạy; `PASS` = có bằng chứng đạt đúng expected; `FAIL` = sai; `BLOCKED` = không chạy do dependency/OP; `NOT_APPLICABLE_WITH_REASON` = không áp dụng với lý do được review, không được dùng để miễn P0 bừa bãi.
- QA cập nhật **CSV** theo từng AC (`qa_evidence`, desktop/mobile); P0 Feature Family và E2E cập nhật hai cột Desktop/Mobile trong bản quản lý kiểm thử sau khi có implementation.
- Mỗi evidence gồm thiết bị/browser, build, account A/B, source state, expected/actual, screenshot/log khi thích hợp, phiên bản data migration/restore nếu có. Không chứa mật khẩu, token, Secret message hay dữ liệu cá nhân nhạy cảm trong bằng chứng.
- Nếu scope AC cần xác minh P0/P1/P2, so với mục Scope chính thức của BRD; **không** dựa duy nhất vào tên AC để hạ hoặc nâng mức.
- Bất kỳ module P0 nào hoặc negative critical nào chưa PASS → **NOT RELEASE READY**. Hiện tại toàn bộ là `NOT_RUN` vì dự án chưa lập trình.
- Bảng này không phải lời xác nhận đã nghiệm thu; chỉ là khung kiểm thử/traceability. Các OPEN CONTROL OP-01–OP-07 từ Policy Supplement vẫn phải được xử lý đúng gate, không mặc nhiên đã được duyệt bằng việc lập ma trận.

## 8. Source manifest

| Tài liệu | SHA-256 |
|---|---|
| M01 `OUR_SPACE_M01_PHOTOBOOK_DIARY_BRD_V1.0.md` | `746eb5ec8c9ea4ba1e9dc07da5ffc67153882585aad291d55ed923ba51fb0428` |
| M02 `OUR_SPACE_M02_MEDIA_LIBRARY_BRD_V1.0.md` | `d5c92c0ab60e05e4cc36d84beaef315327460c28c3de0c5885aaa318e5c17530` |
| M03 `OUR_SPACE_M03_FOOD_PLACES_BRD_V1.0.md` | `fc8805ed7c082f66d2356edb0c6ed7087762637666909cb8887b837a198bc620` |
| M04 `OUR_SPACE_M04_TRAVEL_TRIP_PLANNER_BRD_V1.0.md` | `94531050bcaaf84467360b7f4617c73dfa13e9f7db38cc4bde7264686c3d5f7d` |
| M05 `OUR_SPACE_M05_COUPLE_CALENDAR_BRD_V1.0.md` | `10a991b293b5a200d8d3cb7b14b02fa673d8b44f6300f90aa3ccb289a260e819` |
| M06 `OUR_SPACE_M06_BUCKET_LIST_GOALS_BRD_V1.0.md` | `75771d5d129ef9c7fae9cfd8902b69718675219945d5c05a365ae7880a8ce823` |
| M07 `OUR_SPACE_M07_BUDGET_SAVINGS_BRD_V1.0.md` | `c687d52817ae253fac44bd21abdf20eaab55bb370be762c61446b4f5d75773fa` |
| M08 `OUR_SPACE_M08_SPECIAL_MOMENTS_BRD_V1.0.md` | `cbacbad47ddab5d7f878a67b15860853c28d4e28e63add4417c0ae6df5365b23` |
| M09 `OUR_SPACE_M09_COUPLE_INTERACTION_BRD_V1.0.md` | `c7804a3a8c3e089b02cdd41c98cc1a91934abbdf26c0adc308a55e16a650bbfd` |
| M10 `OUR_SPACE_M10_PERSONALIZATION_ACCOUNTS_SETTINGS_BRD_V1.0.md` | `3209bc0b2c4821e145e34847bf117845e4f300357691823efa5b163e6a108706` |
| `OUR_SPACE_APPROVED_POLICY_SUPPLEMENT_V1.0.md` | `fc365c1b00e6d9e1b472de43a92171c74ec0d7ae03ac7960c8ebdef3ceb1ea09` |
| `OUR_SPACE_CROSS_BRD_CONSISTENCY_REVIEW_FINAL_V1.0.md` | `d2cf9ed84d359938ccd837e29ed05d75050efb30ad6a55d8c02a93456cb26a12` |
| `OUR_SPACE_CROSS_MODULE_CONTRACTS_CT01_CT08_DRAFT_V1.0.md` | `fb792e674450d653595e896d343ae1f4dbed91e42ec315d2258cfa990bf3eb22` |

**END — DRAFT / QA NOT RUN — NO CODE / NO TECH STACK SELECTED**
