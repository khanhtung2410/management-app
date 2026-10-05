# Website quản lý công việc cá nhân

## 1. Giới thiệu

**Website quản lý công việc cá nhân** là hệ thống hỗ trợ người dùng quản lý các công việc cá nhân một cách đơn giản và hiệu quả.

Hệ thống cho phép người dùng đăng ký, đăng nhập, quản lý thông tin cá nhân, thêm và chỉnh sửa công việc, tìm kiếm/lọc công việc và theo dõi thống kê tình trạng công việc.

## 2. Tác nhân

### Người dùng

Người dùng có quyền:

* Đăng ký tài khoản.
* Đăng nhập/đăng xuất.
* Chỉnh sửa thông tin cá nhân.
* Thêm công việc.
* Chỉnh sửa công việc.
* Tìm kiếm và lọc công việc.
* Xem thống kê công việc.

## 3. Chức năng

### 3.1. Quản lý tài khoản

* **Đăng ký:** Tạo tài khoản mới.
* **Đăng nhập:** Đăng nhập vào hệ thống.
* **Sửa hồ sơ:** Cập nhật họ tên, email, số điện thoại và thông tin cá nhân.

### 3.2. Quản lý công việc

* **Thêm công việc:** Tạo công việc mới.
* **Sửa công việc:** Chỉnh sửa tên, mô tả, trạng thái và thời hạn.
* **Tìm kiếm:** Tìm công việc theo tên.
* **Lọc:** Lọc công việc theo trạng thái hoặc thời hạn.

### 3.3. Thống kê

Hệ thống cung cấp thống kê giúp người dùng theo dõi:

* Tổng số công việc.
* Số công việc chưa hoàn thành.
* Số công việc đang thực hiện.
* Số công việc đã hoàn thành.
* Số công việc quá hạn.
* Tỷ lệ hoàn thành công việc.

## 4. Cơ sở dữ liệu

### Bảng `User`

| Trường  | Mô tả         |
| ------- | ------------- |
| `ID`    | Mã người dùng |
| `HoTen` | Họ và tên     |
| `Email` | Email         |
| `SDT`   | Số điện thoại |
| `MK`    | Mật khẩu      |

### Bảng `CongViec`

| Trường      | Mô tả                          |
| ----------- | ------------------------------ |
| `ID`        | Mã công việc                   |
| `UserID`    | Mã người dùng sở hữu công việc |
| `Ten`       | Tên công việc                  |
| `Mota`      | Mô tả công việc                |
| `TrangThai` | Trạng thái công việc           |
| `HetHan`    | Thời hạn hoàn thành            |

### Quan hệ

```text
User
  │
  │ 1 - N
  ▼
CongViec
```

`CongViec.UserID` là khóa ngoại tham chiếu đến `User.ID`.
