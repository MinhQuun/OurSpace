# OURSPACE — MULTI-AGENT CONTINUOUS DEVELOPMENT

## Mục tiêu

Dự án OurSpace được phát triển luân phiên bởi hai AI coding agents:

- Codex: AI chính, chạy Goal dài hạn.
- OpenCode: AI dự phòng, tiếp tục khi Codex hết hạn mức.
- Khi cả hai hết hạn mức: dừng an toàn, chờ hạn mức được làm mới.
- Khi một AI khả dụng trở lại: tiếp tục từ checkpoint mới nhất.

Mục tiêu cuối cùng vẫn là hoàn thành STAGE 00–15, toàn bộ P0 của M01–M10 và các Acceptance Criteria đã phê duyệt.

## Nguồn dữ liệu dùng chung

Cả hai AI phải sử dụng cùng một workspace và tham chiếu:

1. Git và code hiện tại — nguồn xác minh trạng thái triển khai.
2. BRD, Approved Policies và Goal — nguồn yêu cầu chính thức.
3. `Docs/03_OURSPACE_BUILD_REPORT.md` — bằng chứng tiến độ và checkpoint.
4. Knowns MCP — quản lý task, trạng thái, quyết định kỹ thuật và ngữ cảnh.

Không được coi lịch sử chat riêng của một AI là nguồn tiến độ duy nhất.

## Quy tắc luân phiên

- Chỉ một AI được phép chỉnh sửa workspace tại một thời điểm.
- Trước khi tiếp quản, phải xác minh Git status, commit gần nhất, Build Report và Knowns.
- Không viết lại những chức năng đã hoàn thành và được kiểm chứng.
- Không xóa hoặc ghi đè công việc chưa commit của AI trước.
- Không tự tạo nhánh mới; tuân thủ quy trình phát triển trên master đã được duyệt.
- Không force push hoặc tự sửa lịch sử Git.
- Không tự triển khai production hoặc phát sinh chi phí.
- Không thay đổi nghiệp vụ đã được phê duyệt.

## Checkpoint bắt buộc

Sau mỗi task nhỏ hoặc checkpoint hợp lý:

1. Cập nhật task tương ứng trong Knowns.
2. Ghi các kết quả kiểm thử thực tế.
3. Commit và push khi đủ điều kiện.
4. Cập nhật Build Report tại checkpoint phù hợp.
5. Ghi công việc đang dở, các file chưa commit, blocker và bước tiếp theo.

Không tạo commit vô nghĩa chỉ để ghi checkpoint.

Nếu hết token đột ngột, AI kế tiếp phải kiểm tra code và Git thực tế để khôi phục phần công việc chưa được ghi lại.

## Quy trình nhận bàn giao

Khi Codex hết hạn mức, OpenCode tiếp nhận công việc từ trạng thái đã lưu.

Khi OpenCode hết hạn mức và Codex khả dụng trở lại, Codex phải kiểm tra mọi thay đổi của OpenCode trước khi tiếp tục Goal.

Không được giả định AI trước đã hoàn thành task nếu không có bằng chứng.

Nếu cả hai hết hạn mức, không tiếp tục chạy tác vụ lập trình bằng AI cho đến khi có hạn mức.

## Tiết kiệm token

- Chỉ đọc những tài liệu liên quan đến task hiện tại.
- Không nạp lại toàn bộ BRD khi không cần thiết.
- Ưu tiên task nhỏ, có Acceptance Criteria rõ ràng.
- Không tạo trùng task hoặc tài liệu trong Knowns.
- Không dành toàn bộ phiên chỉ để lập báo cáo.
- Ưu tiên thực hiện code và kiểm thử.

## Tiếp tục Goal

Không khởi tạo lại STAGE 00.

Không tạo Goal mới chỉ vì chuyển AI.

Tiếp tục theo đúng checkpoint thực tế, tự chuyển sang task hoặc Stage tiếp theo khi đủ điều kiện nghiệm thu.

Duy trì quy trình luân phiên cho đến khi hoàn thành mục tiêu phát triển OurSpace V1.0.
