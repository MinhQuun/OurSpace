# OUR SPACE — PROMPT MỞ CHAT MỚI (SAU KHI HOÀN TẤT 10/10 BRD)

**Từ khóa:** `OURSPACE-RESUME-REVIEW-10`

## Việc cần làm trước khi dán prompt

1. Mở chat mới trong cùng Project (nếu có thể).
2. Đính kèm file `OUR_SPACE_COMPLETE_HANDOFF_10_BRD_2026-10-23.zip` hoặc 11 file `.md` (handoff V2.0 + 10 BRD). Nếu muốn cả video tham chiếu, dùng ZIP kèm References.
3. Dán nguyên văn prompt dưới đây. Nếu assistant chưa truy cập được file, yêu cầu đọc từ file đính kèm, không suy diễn từ tên.

## Prompt để sao chép

```text
OURSPACE-RESUME-REVIEW-10

Tôi đang tiếp tục dự án Our Space, website riêng tư lâu dài cho hai người với hai tài khoản độc lập. Chúng ta ĐÃ HOÀN THÀNH VÀ PHÊ DUYỆT 10/10 bộ BRD M01–M10 (tổng 247 quyết định Dxx); chưa bắt đầu viết code, chưa chốt stack, kiến trúc kỹ thuật, database, API, cloud hoặc nhà cung cấp.

Tôi cung cấp bộ tài liệu ở tệp đính kèm/Project files. Hãy mở và đọc OUR_SPACE_PROJECT_HANDOFF_V2.0.md trước, sau đó đối chiếu đầy đủ mười file OUR_SPACE_M01...M10_*_BRD_V1.0.md. Hãy xác nhận chính xác các file bạn thật sự truy cập được; nếu file không có thì nói rõ, không giả vờ đã đọc.

QUY TẮC BẮT BUỘC:
- Toàn bộ P0 của cả 10 module phải hoàn thành trước Our Space V1.0; P1/P2 không tự thành P0.
- Mọi D01–Dnn trong mỗi BRD đã được duyệt; không tự đề xuất lại từ đầu, không lật quyết định, không sửa tài liệu đã duyệt nếu chưa có change approval.
- Private mặc định; permission theo item/resource, source-of-truth theo module, không cascade delete, Trash 30 ngày, idempotency/restore và parity mobile/desktop.
- M01 Photobook có real-time coediting hai người và Simple/Advanced; những module khác có conflict protection.
- M08 Sealed Capsule không được mở sớm hoặc sửa nội dung/unlock_at; M10 D35 tạm dừng trao nội dung chưa Reveal khi Disconnect, KHÔNG âm thầm đổi thời điểm đã Seal.
- M07 Expense/Settlement/Contribution/Withdrawal khác nhau, không double count; M05 sở hữu Event; M02 sở hữu Media; M09 là comments/reactions chứ không phải chat độc lập.

CÔNG VIỆC NGAY BÂY GIỜ: Bắt đầu CROSS-BRD CONSISTENCY REVIEW (kiểm tra tính nhất quán 10 BRD) thật chi tiết. Ưu tiên đối chiếu ownership và quan hệ M01–M10; privacy/role/conditional access; M07 expense vs budget vs settlement; M08 sealed/disconnect M10; lịch timezone/recurrence M05; M02 asset vs immutable snapshots; permission leaks/search/notification/export; delete/trash/backup/restore; UX/mobile parity; và P0 scope.

Hãy trả lời bằng tiếng Việt với: (1) sơ đồ/tổng hợp dependency và source-of-truth; (2) bảng Conflict/Gap Register đánh số CR-001... có dẫn nguồn file + mục/quy tắc, mức độ nghiêm trọng, tác động, hướng sửa và có cần tôi phê duyệt không; (3) những việc chắc chắn không mâu thuẫn; (4) bộ quyết định mới cần tôi chốt nếu có. Chưa code, chưa chọn công nghệ, chưa tạo Master BRD khi chưa audit và chốt các conflict quan trọng. Chủ động xử lý, hạn chế hỏi lại những câu đã có câu trả lời trong tài liệu.
```

## Lưu ý

Từ khóa không có tác dụng 'nhập trí nhớ' nếu không có file kèm theo. Bản `OUR_SPACE_PROJECT_HANDOFF_V1.0.md` và prompt cũ `OURSPACE-RESUME-M05` đã lỗi thời, không dùng cho chat mới.
