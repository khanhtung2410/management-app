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

## Cách chạy dự án từ đầu

### Yêu cầu

- Node.js `20.9.0` trở lên và npm.
- SQL Server 2022 trở lên đang chạy (script đặt compatibility level 160), cùng SQL Server Management Studio (SSMS) để tạo database.

### 1. Cài dependencies

Mở terminal tại thư mục dự án và chạy:

```bash
npm ci
```

### 2. Tạo database

1. Trong SQL Server, tạo SQL Server login `management_app` và đặt mật khẩu. `db.sql` tạo database user ánh xạ tới login này nhưng **không** tạo login.
2. Mở `db.sql` trong SSMS. Script tạo database `ManagementDb`, các bảng và quyền cho `management_app`.
3. Trước khi chạy, kiểm tra hai đường dẫn file `.mdf` và `.ldf` trong phần `CREATE DATABASE` đầu script. Chúng đang trỏ tới thư mục SQL Server trên máy đã tạo script (`...\MSSQL16.TUNG\MSSQL\DATA\`); sửa thành thư mục dữ liệu tồn tại và có quyền ghi của SQL Server service trên máy bạn.
4. Kết nối SSMS bằng tài khoản có quyền tạo database, chọn **Execute** để chạy toàn bộ script một lần.

`db.sql` không phải migration có thể chạy lặp lại: chỉ chạy trên instance chưa có `ManagementDb`. Không dùng nguyên các quyền mẫu trong script cho môi trường production; hãy rà soát lại quyền database theo nguyên tắc tối thiểu.

### 3. Cấu hình biến môi trường

Tạo file `.env.local` ở thư mục gốc dự án (không commit file này; `.gitignore` đã loại trừ các file `.env*`):

```dotenv
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=ManagementDb
DB_USER=management_app
DB_PASSWORD=thay-bang-mat-khau-login-da-tao
JWT_SECRET=thay-bang-chuoi-bi-mat-ngau-nhien
```

| Biến | Bắt buộc | Ý nghĩa |
| --- | --- | --- |
| `DB_SERVER` | Có | Tên máy chủ SQL Server hoặc địa chỉ host |
| `DB_PORT` | Không | Cổng SQL Server; mặc định `1433` |
| `DB_DATABASE` | Có | Tên database đã tạo bằng script; ví dụ `ManagementDb` |
| `DB_USER` | Có | SQL login đã tạo; ví dụ `management_app` |
| `DB_PASSWORD` | Có | Mật khẩu của SQL login |
| `JWT_SECRET` | Có | Khóa bí mật để ký và xác minh JWT |

Tạo giá trị ngẫu nhiên cho `JWT_SECRET` bằng Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Không dùng giá trị ví dụ hoặc chia sẻ `JWT_SECRET`/`DB_PASSWORD`. Ứng dụng hiện cấu hình kết nối SQL với `encrypt: false` và `trustServerCertificate: true` trong `lib/db.ts`; hãy đánh giá lại cấu hình kết nối trước khi đưa lên production.

### 4. Chạy ứng dụng

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Có thể đăng ký tài khoản tại `/register`, sau đó đăng nhập tại `/login`.

### 5. Kiểm tra trước khi bàn giao

Chạy tại thư mục gốc:

```bash
npm run check:bom
npm run lint
npx tsc --noEmit
npm run test:run
npm run build
```

`check:bom` kiểm tra BOM trong mã nguồn; `lint` chạy ESLint; `tsc` kiểm tra kiểu TypeScript; `test:run` chạy Vitest một lần; `build` xác nhận ứng dụng build được cho production. Đảm bảo `.env.local` hợp lệ và SQL Server/database truy cập được trước khi chạy build.
