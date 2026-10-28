# API audit

Khảo sát các Route Handler hiện có trong `app/api`. Có 10 route file với tổng
cộng 12 tổ hợp method/URL được hỗ trợ. Các status dưới đây mô tả response do
handler hiện tại tạo ra cho method được liệt kê; lỗi hạ tầng/framework ngoài
handler không được tính.

## Danh mục route

| Method + URL | Ai được gọi | Input | Response thành công | Status hiện tại có thể trả | UI caller |
|---|---|---|---|---|---|
| `GET /api/admin/users` | Admin | Query: `page` (mặc định 1), `pageSize` (mặc định 10), `sortBy` (chỉ ánh xạ `id`), `order` (`desc` hoặc mặc định `asc`), `search` (mặc định rỗng). Không có body. | `200 { data: User[], total, page, pageSize, totalPages }`; chỉ liệt kê user thường. | `200`, `403` (không phải admin), `500` (lỗi khác; chưa đăng nhập hiện cũng thành `500`, **sai: cần 401**). | Có — `app/(admin)/admin/users/_lib/api.ts` |
| `PUT /api/admin/users/status` | Admin | JSON `{ userId, status }`; status chỉ nhận `0` (inactive) hoặc `1` (active). | `200 { message }` | `200`, `400` (body/ID/status sai), `403` (sai role), `404` (không có user thường tương ứng), `500` (lỗi khác; chưa đăng nhập hiện thành `500`, **sai: cần 401**). | Không — UI dùng Server Action |
| `PUT /api/admin/users/profile` | Admin | JSON `{ userId, HoTen, Email, SDT? }`; họ tên và email chỉ cần là chuỗi không rỗng; SDT nếu truyền phải là chuỗi. | `200 { message }` | `200`, `400` (body/ID/field không hợp lệ), `403`, `404`, `500` (gồm email trùng do constraint; **sai: email trùng cần 409**; chưa đăng nhập hiện thành `500`, **sai: cần 401**). | Không — UI dùng Server Action |
| `GET /api/admin/stat` | Admin | Không có body. | `200 { totalUsers, totalTasks, taskStats: [{ status, name, total, percent }] }` | `200`, `500` (catch mọi lỗi, bao gồm chưa đăng nhập và sai role; **sai: cần phân biệt 401/403**). | Không — không tìm thấy UI caller |
| `POST /api/login` | Công khai | JSON `{ email, password }` | `200 { message }` và đặt cookie `token` HttpOnly. | `200`, `400` (body/thiếu thông tin), `401` (credential sai hoặc tài khoản bị khóa; **sai: tài khoản đã xác thực nhưng bị khóa nên cần 403**), `500` (mọi lỗi trong handler hiện đều trả thông báo “Lỗi kết nối database”, **sai: không phải lỗi nào cũng là DB**). | Có — `app/(public)/login/page.tsx` |
| `POST /api/register` | Công khai | JSON `{ HoTen, Email, SDT?, password }`; tên tối thiểu 2 ký tự, email theo regex, mật khẩu tối thiểu 6 ký tự; SDT không phải chuỗi được đổi thành rỗng. | `201 { message, user: { ID, HoTen, Email } }` | `201`, `400` (body/validation), `409` (email đã dùng), `500` (lỗi khác). | Có — `app/(public)/register/page.tsx` |
| `POST /api/logout` | Công khai | Không có body. | `200 { message }`; xóa cookie `token`. | `200` | Có — `components/Logout.tsx` |
| `GET /api/auth/me` | Người có phiên hợp lệ | Không có body; token từ cookie hoặc Bearer token. | `200 { isLoggedIn: true, userId, userName, roleId }` | `200`, `401 { isLoggedIn: false }`, `500 { isLoggedIn: false }`. Body lỗi khác format `{ message }` của phần lớn route. | Có — `app/(public)/login/page.tsx` |
| `GET /api/tasks` | Người dùng đã đăng nhập | Không có body. | `200` với mảng công việc của chính user: `[{ ID, Ten, Mota, TrangThai, HetHan }]`. | `200`, `401` (chưa đăng nhập/tài khoản không hoạt động), `500` (lỗi khác). | Không gọi API trực tiếp; danh sách được tải ở server |
| `POST /api/tasks` | Người dùng đã đăng nhập | JSON `{ Ten, Mota?, HetHan }`. Tên và hạn không rỗng; hiện không kiểm tra ngày hợp lệ hoặc độ dài tên. | `201` với bản ghi mới `{ ID, Ten, Mota, TrangThai, HetHan }`. | `201`, `400` (body/tên/hạn thiếu), `401`, `500` (ngày không hợp lệ hoặc tên vượt giới hạn DB có thể gây lỗi driver; **sai: input không hợp lệ cần 400**). | Có — `app/(public)/tasks/_components/TaskFormModal.tsx` |
| `GET /api/tasks/[id]` | Người dùng đã đăng nhập; chỉ xem công việc của chính mình | Path param `id`; không có body. | `200` với một bản ghi `{ ID, Ten, Mota, TrangThai, HetHan }`. | `200`, `400` (ID không hợp lệ), `401`, `404` (không tồn tại hoặc không thuộc user), `500` (lỗi khác). | Không tìm thấy UI caller cho API; trang chi tiết tải dữ liệu phía server |
| `PATCH /api/tasks/[id]` | Người dùng đã đăng nhập; chỉ cập nhật công việc của chính mình | Path param `id`; JSON `{ TrangThai }`, nhận `0` (active) hoặc `1` (complete). | `200` với bản ghi sau cập nhật `{ ID, Ten, Mota, TrangThai, HetHan }`. | `200`, `400` (ID/body/status không hợp lệ), `401`, `404` (không tồn tại hoặc không thuộc user), `500` (lỗi khác). | Có — `app/(public)/tasks/_components/TasksClient.tsx` và `app/(public)/tasks/[id]/TaskStatusButton.tsx` |

`requireAuth` có thể trả `401` khi thiếu token, token không hợp lệ hoặc user đã
bị khóa; `requireRole` tiếp tục trả `403` khi role không đúng. Các API route không
được bảo vệ bởi `proxy.ts` (matcher chỉ gồm `/admin`, `/tasks`, `/login`), vì vậy
Route Handler phải tự ánh xạ lỗi xác thực sang status HTTP đúng.

## Đối chiếu các vấn đề cần xử lý

| Tình huống | Hiện tại | Kết quả đúng | Đánh giá |
|---|---:|---:|---|
| Chưa đăng nhập gọi `GET /api/admin/users` | `500` | `401` | Catch chỉ xử lý `ForbiddenError`, không xử lý `UnauthorizedError`. |
| Chưa đăng nhập gọi `PUT /api/admin/users/status` hoặc `PUT /api/admin/users/profile` | `500` | `401` | Cùng lỗi catch như trên. |
| Chưa đăng nhập gọi `GET /api/admin/stat` | `500` | `401` | Catch không phân loại lỗi xác thực. |
| User thường gọi API admin | Tùy endpoint: `403` ở users/status/profile; `500` ở stat | `403` | Route stat biến `ForbiddenError` thành `500`. |
| Cập nhật profile bằng email đã có | `500` khi DB constraint bị vi phạm | `409` | Route chưa kiểm tra email trùng trước khi update. |
| Cập nhật profile với email `abc` | `200` nếu DB chấp nhận | `400` | Route chỉ kiểm tra chuỗi không rỗng; Server Action kiểm tra regex chặt hơn. |
| Tạo task với `HetHan: "abc"` hoặc `Ten` vượt giới hạn cột | Có thể `500` ở driver/DB | `400` | Chưa validate ngày thực và độ dài trước khi ghi. |
| Login bằng tài khoản bị khóa | `401` | `403` | Xác thực credential thành công nhưng tài khoản không được phép đăng nhập. |
| Lỗi không phải DB trong `POST /api/login` | `500` với nội dung “Lỗi kết nối database” | `500` với thông báo lỗi chung phù hợp | Catch hiện gắn nhãn mọi lỗi thành lỗi DB. |
| `GET /api/admin/users?pageSize=1000000` | Không giới hạn trên; có thể trả `200` với lượng dữ liệu rất lớn | `400` hoặc giới hạn tối đa (ví dụ 100) | `pageSize` chỉ được ép tối thiểu là 1. |
| Error response | Hầu hết trả `{ message }`; `/api/auth/me` trả `{ isLoggedIn: false }` | Một format lỗi chung | Cấu trúc hiện không nhất quán. |
| Danh sách task và user | Tasks trả mảng trần; users trả object phân trang | Một response convention chung | Hai hình dạng response khác nhau. |
| Cập nhật user admin | `PUT /api/admin/users/status`, `PUT /api/admin/users/profile`; ID ở body | `PATCH /api/admin/users/[id]` | URL/method chưa theo thiết kế cập nhật từng phần đã nêu. |

Các API cập nhật profile và đăng ký cũng không nhất quán về validation: Server
Action chuẩn hóa email về chữ thường, kiểm tra định dạng email, độ dài tên và
định dạng SDT; endpoint profile hiện chỉ kiểm tra kiểu và chuỗi rỗng, không có
kiểm tra email trùng. UI hiện dùng Server Action cho cập nhật profile/trạng thái,
nên các endpoint `PUT` này không phải đường đi đang được giao diện sử dụng.

## Route không được UI gọi và các bản tổng quan

Không tìm thấy UI caller cho `GET /api/admin/stat`, `PUT /api/admin/users/status`,
`PUT /api/admin/users/profile`, `GET /api/tasks`, hoặc `GET /api/tasks/[id]`.
API admin stat là route không được sử dụng: trang `/admin/stat` lấy số liệu qua
`getDashboardSummary()`, còn trang `/admin` chạy một truy vấn tổng quan trực tiếp.
Như vậy `/api/admin/stat` là một đường triển khai tổng quan thứ ba, song song với
hai đường đang được dùng trong server-rendered pages.
