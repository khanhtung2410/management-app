# Website quản lý công việc cá nhân
**Website quản lý công việc cá nhân** là hệ thống hỗ trợ người dùng quản lý các công việc cá nhân một cách đơn giản và hiệu quả.


## Problem

Người dùng hiện nay ghi chú công việc rải rác ở nhiều nơi (giấy, app ghi chú, tin nhắn tự gửi),
dẫn đến:

- **Quên việc** — không có nơi tập trung để xem toàn bộ công việc cần làm.
- **Khó theo dõi tiến độ** — không biết việc nào đã xong, việc nào còn tồn.
- **Không có thống kê** — không biết mình đang dành thời gian cho việc gì.
- **Các app hiện có quá phức tạp** — Notion, Jira... nhiều tính năng thừa cho nhu cầu cá nhân.

Giải pháp: một web app tối giản, tập trung vào **tạo – xem – hoàn thành** công việc.

## Users

| Nhóm người dùng | Nhu cầu chính | Bối cảnh sử dụng |
|---|---|---|
| **Users** | Quản lý công việc cá nhân | Dùng hàng ngày trên điện thoại (buổi sáng lên kế hoạch) và trên laptop (khi làm việc) |
| **Admin** | Quản lý người dùng, thống kê dữ liệu | Truy cập trang quản trị trên desktop, vài lần mỗi tuần để kiểm tra hoạt động hệ thống |

## MVP Scope

Mục tiêu: Người dùng tạo công việc trên ứng dụng

**Trong phạm vi:**

- [ ] **Đăng ký** — Tạo tài khoản mới bằng email + mật khẩu
- [ ] **Đăng nhập** — Đăng nhập vào tài khoản đã có, nhận JWT
- [ ] **Xem danh sách công việc** — Hiển thị các công việc của chính người dùng đang đăng nhập
- [ ] **Tạo công việc** — Thêm mới công việc với tiêu đề và mô tả

**Tiêu chí hoàn thành (Definition of Done):**

- Có thể tạo tài khoản mới và đăng nhập thành công
- Sau khi đăng nhập, thấy được danh sách công việc của mình (ban đầu rỗng)
- Có thể tạo công việc mới và thấy nó xuất hiện trong danh sách
- Mỗi người dùng chỉ thấy công việc của chính mình (không rò rỉ dữ liệu giữa các user)
- Deploy được lên môi trường staging và có URL truy cập


## Out of Scope

Những thứ **không** làm trong bản MVP (xem xét ở phiên bản sau):

**Tính năng công việc:**
- Sửa / xóa công việc — MVP chỉ cần tạo và xem để kiểm chứng nhu cầu
- Đánh dấu hoàn thành, deadline, độ ưu tiên — thêm sau khi user thực sự dùng
- Nhắc nhở / thông báo (email, push) — cần hạ tầng scheduler, tốn công
- Gắn thẻ, phân loại, tìm kiếm, lọc — chỉ có ý nghĩa khi số lượng việc đủ lớn

**Tài khoản:**
- Đăng nhập bằng Google / Facebook — chỉ cần email + mật khẩu
- Quên mật khẩu, đổi mật khẩu — MVP chưa cần
- Xác thực email — thêm sau để tránh phức tạp khi test

**Admin:**
- Dashboard thống kê biểu đồ — MVP chỉ cần trang danh sách user cơ bản
- Phân quyền chi tiết (role, permission) — chỉ có 2 role: user và admin

## Tech Stack

| Layer | Công nghệ | Ghi chú |
|---|---|---|
| Frontend | <React / Next.js / ...> | |
| Backend | <Node.js / NestJS / ...> | |
| Database | MSSQLSERVER | |
| Auth | JWT | |
| CI/CD | GitHub Actions | |
