# docs/api-conventions.md

> Tài liệu này là **hợp đồng API** bắt buộc cho toàn bộ Route Handler trong `app/api`. Mọi PR thêm/sửa endpoint phải tuân theo đây; reviewer dùng mục 10 làm checklist. Đọc kèm `# API audit.txt` để biết hiện trạng từng route.

---

## 1. Mục đích & phạm vi

- Chuẩn hoá **URL, method, response thành công, error format, status code** cho tất cả API.
- Làm cơ sở để client (UI, mobile sau này) rẽ nhánh ổn định theo `error.code` thay vì so khớp chuỗi message.
- Là điều kiện review: PR vi phạm hợp đồng này không được merge.
- Áp dụng cho mọi route dưới `app/api/**`. Các Server Action không thuộc phạm vi tài liệu này.

---

## 2. URL & HTTP method

### 2.1 Nguyên tắc

- **Danh từ số nhiều**, không động từ trong path: `/api/tasks`, `/api/users`, `/api/admin/users`.
- **ID nằm trên path**, không nằm trong body: `/api/tasks/[id]`, `/api/admin/users/[id]`.
- Ghép method theo ngữ nghĩa CRUD:

| Method | Ý nghĩa | Ví dụ trong app |
|---|---|---|
| `GET` | Đọc (một bản ghi hoặc danh sách) | `GET /api/tasks`, `GET /api/tasks/[id]` |
| `POST` | Tạo mới (collection) | `POST /api/tasks` |
| `PATCH` | Sửa **một phần** bản ghi | `PATCH /api/tasks/[id]` body `{ "TrangThai": 1 }` |
| `DELETE` | Xoá bản ghi | `DELETE /api/tasks/[id]` (chưa triển khai — ngoài MVP) |

- `PUT` **không dùng** cho cập nhật từng phần. Nếu cần thay thế toàn bộ tài nguyên mới cân nhắc `PUT`, nhưng mặc định dự án dùng `PATCH`.

### 2.2 Ngoại lệ được phép (hành động, không phải tài nguyên)

Các endpoint mang tính **hành động** được phép dùng động từ trong path và phải được liệt kê ở đây:

| Endpoint | Lý do ngoại lệ | Ghi chú |
|---|---|---|
| `POST /api/login` | Tạo phiên đăng nhập, không tạo tài nguyên có ID | Trả `200` + `Set-Cookie: token` (HttpOnly) |
| `POST /api/logout` | Kết thúc phiên | Trả `200`, xoá cookie `token` |
| `POST /api/register` | Tạo tài khoản nhưng là luồng công khai đặc thù | Vẫn trả `201` + object user như tạo mới chuẩn |
| `GET /api/auth/me` | Truy vấn phiên hiện tại | Xem mục 6.3 về format đặc biệt |

Mọi ngoại lệ khác phải được bổ sung vào bảng này trong PR tương ứng, kèm lý do.

### 2.3 Quy ước đặt tên field

- Field domain giữ nguyên tên tiếng Việt đang dùng trong DB/UI: `HoTen`, `Email`, `SDT`, `Ten`, `Mota`, `TrangThai`, `HetHan`, `ID`.
- Field meta/hạ tầng dùng tiếng Anh: `data`, `meta`, `page`, `pageSize`, `total`, `totalPages`, `error`, `code`, `message`, `details`, `field`.

---

## 3. Response thành công

### 3.1 Một bản ghi → trả thẳng object (không bọc `data`)

```json
// GET /api/tasks/42 → 200
{
  "ID": 42,
  "Ten": "Nộp báo cáo",
  "Mota": "Báo cáo tuần",
  "TrangThai": 0,
  "HetHan": "2026-11-01T17:00:00.000Z"
}
```

### 3.2 Danh sách → `{ data, meta }`, `meta` bắt buộc có đủ 4 khoá

```json
// GET /api/tasks?page=1&pageSize=10 → 200
{
  "data": [
    { "ID": 42, "Ten": "Nộp báo cáo", "Mota": "Báo cáo tuần", "TrangThai": 0, "HetHan": "2026-11-01T17:00:00.000Z" },
    { "ID": 43, "Ten": "Họp nhóm", "Mota": "", "TrangThai": 1, "HetHan": "2026-10-30T09:00:00.000Z" }
  ],
  "meta": { "page": 1, "pageSize": 10, "total": 2, "totalPages": 1 }
}
```

- `page` mặc định `1`, tối thiểu `1`.
- `pageSize` mặc định `10`, **tối thiểu `1`, tối đa `100`**. Vượt cận trên → `400 VALIDATION_ERROR` (khắc phục lỗi `?pageSize=1000000` ở audit).
- `totalPages = Math.ceil(total / pageSize)`; khi `total = 0` thì `totalPages = 0`.
- Danh sách **không phân trang** vẫn phải trả `meta` với `page = 1`, `pageSize = total`, `totalPages = 1` (hoặc `0` nếu rỗng) — thống nhất một hình dạng.

> **Ảnh hưởng hiện trạng:** `GET /api/tasks` đang trả **mảng trần** — phải đổi sang `{ data, meta }`. `GET /api/admin/users` đã đúng hình dạng, chỉ cần thêm chặn `pageSize > 100`.

### 3.3 Tạo mới → `201` + bản ghi vừa tạo

```json
// POST /api/tasks → 201
{
  "ID": 42,
  "Ten": "Nộp báo cáo",
  "Mota": "Báo cáo tuần",
  "TrangThai": 0,
  "HetHan": "2026-11-01T17:00:00.000Z"
}
```

Ngoại lệ: `POST /api/register` trả `201` + object user rút gọn `{ message, user: { ID, HoTen, Email } }` (giữ theo hành vi hiện tại; nếu sau này cần chuẩn hoá, tách PR riêng).

### 3.4 Hành động không tạo tài nguyên (`login`, `logout`, `me`)

- `POST /api/login` → `200 { "message": "Đăng nhập thành công" }` + `Set-Cookie`.
- `POST /api/logout` → `200 { "message": "Đã đăng xuất" }`.
- `GET /api/auth/me` → `200 { "isLoggedIn": true, "userId": 7, "userName": "Nguyễn Văn A", "roleId": 2 }` (giữ hình dạng đặc biệt vì đây là endpoint kiểm tra phiên, client dùng như feature-flag; nhưng **lỗi phải theo format chung ở mục 4**, xem 6.3).

---

## 4. Error format chung

### 4.1 Cấu trúc

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email không hợp lệ",
    "details": [
      { "field": "Email", "message": "Email không đúng định dạng" }
    ]
  }
}
```

Quy ước từng khoá:

| Khoá | Kiểu | Bắt buộc | Ngôn ngữ | Mục đích |
|---|---|---|---|---|
| `error.code` | string hằng số tiếng Anh, SCREAMING_SNAKE_CASE | ✅ | Tiếng Anh | **Client rẽ nhánh** — không bao giờ đổi giá trị đã phát hành |
| `error.message` | string | ✅ | **Tiếng Việt** | Hiển thị trực tiếp cho người dùng |
| `error.details` | array `{ field, message }` | tuỳ chọn | `field` tiếng Anh/khớp tên field request, `message` tiếng Việt | Chỉ dùng cho lỗi theo từng trường (`VALIDATION_ERROR`) |

Quy tắc bắt buộc:

- Mọi response lỗi (`>= 400`) **phải** có `error.code` và `error.message`. Không trả `{ message }` trần, không trả `{ isLoggedIn: false }` trần.
- `error.code` chỉ nhận các hằng số trong bảng mục 5 — thêm code mới phải cập nhật tài liệu này trong cùng PR.
- `error.message` **không được** chứa chi tiết hạ tầng: không lộ tên bảng, câu SQL, stack, tên driver, `constraint 'UQ_Users_Email'`. Chi tiết kỹ thuật chỉ ghi bằng `console.error` phía server.
- `error.details` nếu có thì mỗi phần tử phải có đủ `field` và `message`; không trả mảng chuỗi.

### 4.2 Hằng số `code` được phép

```
INVALID_JSON
VALIDATION_ERROR
UNAUTHENTICATED
FORBIDDEN
ACCOUNT_LOCKED
NOT_FOUND
CONFLICT
INTERNAL_ERROR
```

---

## 5. Bảng status code chuẩn (kèm ví dụ cụ thể trong app)

| Status | `error.code` | Khi nào dùng | Ví dụ cụ thể trong app |
|---|---|---|---|
| `200` | — | Đọc thành công, cập nhật một phần thành công, hành động thành công | `GET /api/tasks/[id]` trả bản ghi; `PATCH /api/tasks/[id]` body `{ "TrangThai": 1 }` trả bản ghi sau cập nhật; `POST /api/login` thành công |
| `201` | — | Tạo mới thành công | `POST /api/tasks` body `{ "Ten": "Nộp báo cáo", "HetHan": "2026-11-01" }` trả bản ghi có `ID` mới |
| `400` | `INVALID_JSON` | Body không parse được JSON (sai cú pháp, rỗng, `Content-Type` không phải JSON) | `POST /api/login` với body `{"email":` (thiếu đóng ngoặc) |
| `400` | `VALIDATION_ERROR` | Body parse được nhưng sai kiểu/thiếu trường/vi phạm rule; query param sai | `POST /api/register` với `{ "Email": "abc", ... }` → `details: [{ "field": "Email", "message": "Email không đúng định dạng" }]`; `GET /api/admin/users?pageSize=1000000`; `POST /api/tasks` với `HetHan: "abc"` |
| `401` | `UNAUTHENTICATED` | Không có token, token hết hạn/không hợp lệ, hoặc thiếu phiên | `GET /api/admin/users` không kèm cookie/Bearer; `PATCH /api/tasks/[id]` không đăng nhập (hiện trả 500 — phải sửa) |
| `403` | `FORBIDDEN` | Đã xác thực nhưng **không đủ quyền** | User thường gọi `GET /api/admin/users`; user A gọi `PATCH /api/tasks/[id]` của user B **nếu** chọn phương án 403 (xem mục 6.1) |
| `403` | `ACCOUNT_LOCKED` | Credential đúng nhưng tài khoản bị khoá, **không được phép đăng nhập / dùng phiên** | `POST /api/login` với tài khoản `TrangThai = 0` (hiện trả 401 — phải sửa); `GET /api/tasks` với token hợp lệ nhưng tài khoản bị khoá giữa phiên |
| `404` | `NOT_FOUND` | Không tìm thấy tài nguyên **trong phạm vi người gọi được phép thấy** | `GET /api/tasks/999999` (không tồn tại); `GET /api/tasks/42` khi task 42 thuộc user khác (xem 6.1); `PATCH /api/admin/users/[id]` với `id` không tồn tại |
| `409` | `CONFLICT` | Vi phạm ràng buộc duy nhất / trạng thái xung đột | `POST /api/register` với email đã tồn tại; `PATCH /api/admin/users/[id]` đổi sang email đã có user khác dùng (hiện trả 500 — phải sửa) |
| `500` | `INTERNAL_ERROR` | Lỗi không lường trước ở server (DB, driver, bug) | `POST /api/tasks` khi driver báo lỗi cột `Ten` vượt độ dài (sau khi đã thêm validate thì không còn rơi vào đây); `GET /api/admin/stat` khi truy vấn DB ném lỗi |

Quy tắc bổ sung:

- `500` **luôn** dùng `message` chung, ví dụ `"Đã có lỗi xảy ra, vui lòng thử lại sau"`. Không dùng `"Lỗi kết nối database"` cho mọi lỗi (khắc phục lỗi audit ở `POST /api/login`). Chi tiết gốc ghi bằng `console.error(err)`.
- Không trả `200` cho trường hợp lỗi; không trả `500` cho lỗi xác thực (`401`) hay phân quyền (`403`) — đây là hai lỗi audit phải sửa ở `GET /api/admin/users`, `PUT /api/admin/users/*` và `GET /api/admin/stat`.
- Các cặp `(status, code)` trong bảng là **duy nhất**: không dùng `400` với `code = "UNAUTHENTICATED"`, không dùng `401` với `code = "ACCOUNT_LOCKED"`.

---

## 6. Các quyết định thiết kế phải chốt

### 6.1 Task của người khác: trả `403` hay `404`?

**Quyết định: giữ `404 NOT_FOUND`** cho `GET /api/tasks/[id]`, `PATCH /api/tasks/[id]` (và `DELETE` sau này) khi task không tồn tại **hoặc** không thuộc user đang đăng nhập.

Lý do:

1. **Chống enumeration / rò rỉ sự tồn tại tài nguyên.** Nếu trả `403` cho task của người khác và `404` cho ID không tồn tại, kẻ tấn công dò được task nào tồn tại trên hệ thống bằng cách so sánh hai status. `404` cho cả hai trường hợp không lộ gì.
2. **Khớp với cách truy vấn hiện tại.** Route đang chạy `WHERE ID = @id AND UserID = @userId` — kết quả rỗng không phân biệt được "không có" và "không phải của mình", nên `404` là ánh xạ tự nhiên, không phải thêm nhánh logic.
3. **Nhất quán với audit hiện trạng.** Audit ghi nhận `tasks/[id]` đang trả `404`; đổi sang `403` sẽ là breaking change không mang lại giá trị cho client (client chỉ cần biết "không thao tác được").

Hệ quả cần ghi rõ trong code và test:

- `403 FORBIDDEN` **chỉ** dùng cho lỗi **phân quyền theo vai trò** (user thường gọi API admin), không dùng cho lỗi sở hữu tài nguyên.
- `403 ACCOUNT_LOCKED` chỉ dùng cho tài khoản bị khoá.
- Viết test: user B gọi `GET/PATCH /api/tasks/{id của A}` phải nhận `404 NOT_FOUND`.

### 6.2 Body sai JSON và body đúng JSON nhưng sai trường: cùng status hay khác?

**Quyết định: cùng `400`, khác `error.code`.**

- Sai cú pháp JSON → `400` + `code = "INVALID_JSON"`, `message = "Dữ liệu gửi lên không phải JSON hợp lệ"`, **không** có `details` (không có field nào để chỉ).
- JSON hợp lệ nhưng thiếu/sai trường → `400` + `code = "VALIDATION_ERROR"`, `message` câu tiếng Việt mô tả lỗi đầu tiên hoặc lỗi tổng quát, `details` liệt kê **tất cả** field lỗi.

Lý do:

- Cả hai đều là lỗi phía client (4xx) và client thường xử lý giống nhau ở tầng UI ("gửi lại với dữ liệu đúng"), nên cùng `400` là hợp lý — không cần tạo status mới.
- Nhưng **nguyên nhân khác nhau** (lỗi giao thức so với lỗi nghiệp vụ), nên `code` phải khác để client/logging rẽ nhánh: `INVALID_JSON` thường là bug client/build, `VALIDATION_ERROR` thường cần hiển thị lỗi từng trường lên form.
- Không dùng `422` để tránh phân mảnh status trong dự án nhỏ.

### 6.3 `GET /api/auth/me` — format đặc biệt

- Success giữ `{ isLoggedIn: true, userId, userName, roleId }` vì UI login dùng để kiểm tra phiên.
- **Lỗi phải theo format chung ở mục 4**: `401 UNAUTHENTICATED` → `{ "error": { "code": "UNAUTHENTICATED", "message": "Bạn cần đăng nhập" } }`. Bỏ hình dạng `{ isLoggedIn: false }` cho nhánh lỗi. Client phân biệt "chưa đăng nhập" bằng status `401` + `code`, không dựa vào `isLoggedIn: false` nữa.
- Nếu cần giữ tương thích ngược trong 1 sprint, có thể trả kèm `isLoggedIn: false` **bên cạnh** `error`, nhưng phải có ticket xoá sau sprint đó.

---

## 7. Validation

- Validate **ở server** cho mọi input không tin cậy: body, query param, path param.
- Trả `VALIDATION_ERROR` với `details` đầy đủ, không dừng ở lỗi đầu tiên (trừ khi lỗi đầu tiên chặn việc kiểm tra tiếp — ví dụ JSON hỏng).
- Rule tối thiểu phải khớp với Server Action đang dùng (audit ghi nhận Server Action validate chặt hơn API):

| Trường | Rule | Ví dụ lỗi |
|---|---|---|
| `HoTen` | chuỗi, trim, độ dài `2..100` | `"Họ tên phải có ít nhất 2 ký tự"` |
| `Email` | chuỗi, trim, lowercase, regex email, ≤ 254 ký tự | `"Email không đúng định dạng"` |
| `SDT` | tuỳ chọn; nếu có phải là chuỗi khớp regex số điện thoại VN | `"Số điện thoại không hợp lệ"` |
| `password` | chuỗi, ≥ 6 ký tự | `"Mật khẩu phải có ít nhất 6 ký tự"` |
| `Ten` (task) | chuỗi, không rỗng, ≤ 200 ký tự (khớp cột DB) | `"Tên công việc không được để trống"` / `"Tên công việc tối đa 200 ký tự"` |
| `HetHan` | chuỗi parse được thành ngày hợp lệ | `"Hạn hoàn thành không hợp lệ"` |
| `TrangThai` (task) | `0` hoặc `1` | `"Trạng thái không hợp lệ"` |
| `status` (user admin) | `0` hoặc `1` | `"Trạng thái không hợp lệ"` |
| `id` (path) | số nguyên dương | `"ID không hợp lệ"` |
| `page` | số nguyên ≥ 1 | `"page phải là số nguyên dương"` |
| `pageSize` | số nguyên `1..100` | `"pageSize phải nằm trong khoảng 1..100"` |

- Trùng email khi đăng ký hoặc cập nhật profile → `409 CONFLICT` (không phải `400`, không phải `500`).
- Không dựa vào DB constraint để trả `409` bằng cách bắt lỗi driver — **kiểm tra trước khi ghi**; nếu vẫn để constraint ném (race condition), map sang `409` nếu driver báo lỗi unique, ngược lại `500`.

---

## 8. Xác thực & phân quyền

- API route **không** được bảo vệ bởi `proxy.ts` (matcher chỉ gồm `/admin`, `/tasks`, `/login`), nên **Route Handler phải tự map lỗi**:
  - `requireAuth` ném `UnauthorizedError` (thiếu/sai token) → handler bắt và trả `401 UNAUTHENTICATED`.
  - `requireAuth` gặp tài khoản bị khoá → `403 ACCOUNT_LOCKED` (không phải `401`).
  - `requireRole` ném `ForbiddenError` → `403 FORBIDDEN`.
- Không được để lọt `UnauthorizedError`/`ForbiddenError` vào nhánh `catch` chung trả `500`.
- `POST /api/login`: credential sai → `401 UNAUTHENTICATED`; credential đúng nhưng tài khoản khoá → `403 ACCOUNT_LOCKED`.
- Token đặt trong cookie `token` HttpOnly, hoặc `Authorization: Bearer`. Không trả token trong body.

---

## 9. Bảng đối chiếu endpoint hiện tại → chuẩn mới

| Hiện tại | Chuẩn mới | Việc cần làm |
|---|---|---|
| `GET /api/admin/users` | Giữ | Thêm chặn `pageSize > 100`; map `UnauthorizedError` → `401` |
| `PUT /api/admin/users/status` | `PATCH /api/admin/users/[id]` body `{ "status": 0\|1 }` | Đổi route/method, ID lên path; map `401` |
| `PUT /api/admin/users/profile` | `PATCH /api/admin/users/[id]` body `{ HoTen?, Email?, SDT? }` | Đổi route/method; thêm validate email/SDT/tên; trùng email → `409` |
| `GET /api/admin/stat` | Giữ (hoặc xoá nếu xác nhận không dùng) | Map lỗi xác thực → `401`/`403`; quyết định xoá route thừa trong PR riêng |
| `POST /api/login` | Giữ (ngoại lệ) | Tài khoản khoá → `403 ACCOUNT_LOCKED`; bỏ message "Lỗi kết nối database" chung |
| `POST /api/register` | Giữ | Giữ `409` khi email trùng; `details` cho lỗi validation |
| `POST /api/logout` | Giữ (ngoại lệ) | — |
| `GET /api/auth/me` | Giữ URL | Đổi **lỗi** sang format chung `{ error: {...} }` |
| `GET /api/tasks` | Giữ URL, đổi response | Trả `{ data, meta }`, thêm phân trang `page/pageSize` |
| `POST /api/tasks` | Giữ | Validate `Ten`/`HetHan`; trả `400 VALIDATION_ERROR` thay vì `500` |
| `GET /api/tasks/[id]` | Giữ | Giữ `404` khi không thuộc user (mục 6.1) |
| `PATCH /api/tasks/[id]` | Giữ | — |

Thay đổi nào là breaking đối với UI đang gọi (`app/(public)/login/page.tsx`, `TaskFormModal.tsx`, `TasksClient.tsx`, `TaskStatusButton.tsx`, `app/(admin)/admin/users/_lib/api.ts`) phải sửa UI trong cùng PR hoặc tách PR trước, ghi rõ `BREAKING CHANGE` trong commit footer.

---

## 10. Checklist review API (dùng cho PR)

- [ ] URL danh từ số nhiều, ID trên path; method đúng ngữ nghĩa (`GET`/`POST`/`PATCH`/`DELETE`); ngoại lệ hành động có trong mục 2.2.
- [ ] Một bản ghi trả object trần; danh sách trả `{ data, meta }` đủ 4 khoá; tạo mới trả `201` + bản ghi.
- [ ] Mọi nhánh lỗi trả đúng cấu trúc `{ error: { code, message, details? } }`; `message` tiếng Việt; `code` thuộc danh sách mục 4.2.
- [ ] Status khớp bảng mục 5; không có `500` cho lỗi auth/role; không có `401` cho tài khoản khoá; trùng email trả `409`.
- [ ] `error.message` của `500` là câu chung; chi tiết ghi `console.error`, không trả ra response.
- [ ] `pageSize` bị chặn `1..100`; `id` path được validate là số nguyên dương.
- [ ] Có test cho: task của user khác → `404`; body sai JSON → `INVALID_JSON`; body đúng JSON sai trường → `VALIDATION_ERROR` + `details`; login tài khoản khoá → `403 ACCOUNT_LOCKED`; gọi API admin chưa đăng nhập → `401`.
- [ ] Nếu đổi hình dạng response/route đang được UI gọi, UI đã được cập nhật trong cùng PR hoặc có kế hoạch rõ ràng.