# So sánh cây layout

Hai cây dưới đây tập trung vào route, layout và quyền truy cập trong `app/`; các API route và file giao diện không quyết định layout được rút gọn. Nhãn quyền được xác định từ `proxy.ts` và kiểm tra quyền tại trang, không phải từ tên route group.

**Chú giải quyền**

- `[Public]`: không yêu cầu đăng nhập.
- `[Đăng nhập]`: cần tài khoản đã đăng nhập; dữ liệu công việc chỉ truy cập được nếu thuộc về người dùng đó.
- `[Role ADMIN]`: cần đăng nhập với role `ADMIN`; người dùng không có role này bị chuyển tới `/403`.
- `[Khách]`: trang đăng nhập; người đã đăng nhập được chuyển về `/`.

## Hiện tại

Snapshot: `94564cd` — 20/10/2026 10:31 (+07:00).

```text
app/
├── layout.tsx                         # Root layout: bọc toàn bộ ứng dụng
├── (admin)/                           # Route group, không xuất hiện trên URL
│   └── admin/                         # [Role ADMIN] proxy bảo vệ /admin/*
│       ├── layout.tsx                 # Khung admin: Navbar, Sidebar, AdminHeader, LayoutProvider
│       ├── page.tsx                   # /admin [Role ADMIN]
│       ├── stat/
│       │   └── page.tsx               # /admin/stat [Role ADMIN]
│       └── users/
│           └── page.tsx               # /admin/users [Role ADMIN]
├── (public)/                          # Route group, không xuất hiện trên URL
│   ├── layout.tsx                     # Navbar và khung nội dung cho các trang public
│   ├── page.tsx                       # / [Public]
│   ├── login/
│   │   └── page.tsx                   # /login [Khách]
│   ├── register/
│   │   └── page.tsx                   # /register [Public]
│   └── tasks/
│       ├── page.tsx                   # /tasks [Đăng nhập]
│       └── [id]/
│           └── page.tsx               # /tasks/[id] [Đăng nhập; chỉ xem công việc của mình]
├── 403/
│   └── page.tsx                       # /403 [Public; trang báo không đủ quyền]
└── not-found.tsx                      # Trang 404
```

Thứ tự layout khi render:

```text
app/layout.tsx
├── app/(admin)/admin/layout.tsx
│   └── các trang /admin/*
└── app/(public)/layout.tsx
    └── các trang public
```

## Cuối ngày 17/10/2026 (sau 18:00)


```text
app/
├── layout.tsx                         # Root layout: bọc toàn bộ ứng dụng
├── (admin)/                           # Route group, không xuất hiện trên URL
│   └── admin/                         # [Role ADMIN] proxy bảo vệ /admin/*
│       ├── layout.tsx                 # Khung admin: Sidebar, AdminHeader, LayoutProvider
│       ├── page.tsx                   # /admin [Role ADMIN]
│       ├── stat/
│       │   └── page.tsx               # /admin/stat [Role ADMIN]
│       └── users/
│           └── page.tsx               # /admin/users [Role ADMIN]
├── (public)/                          # Route group, không xuất hiện trên URL
│   ├── layout.tsx                     # Navbar và khung nội dung cho các trang public
│   ├── page.tsx                       # / [Public]
│   ├── login/
│   │   └── page.tsx                   # /login [Khách]
│   ├── register/
│   │   └── page.tsx                   # /register [Public]
│   └── tasks/
│       └── page.tsx                   # /tasks [Đăng nhập]
└── 403/
    └── page.tsx                       # /403 [Public; trang báo không đủ quyền]
```

Thứ tự layout tại snapshot lịch sử:

```text
app/layout.tsx
├── app/(admin)/admin/layout.tsx
│   └── các trang /admin/*
└── app/(public)/layout.tsx
    └── các trang public
```

## Khác biệt chính

- Cấu trúc lồng layout admin không đổi: các trang admin cùng nằm dưới `app/(admin)/admin/layout.tsx`; không có layout `(content)` riêng.
- Layout admin hiện tại thêm `Navbar`; tại snapshot `64eed67`, navbar chỉ được render trong layout public.
- Hiện tại có thêm trang chi tiết công việc `/tasks/[id]` và `app/not-found.tsx`.
- Quyền truy cập không suy ra từ `(admin)` hay `(public)`: proxy yêu cầu role `ADMIN` cho `/admin/*`, đăng nhập cho `/tasks/*`, còn `/`, `/register` và `/403` không yêu cầu đăng nhập. Quy tắc tương ứng cũng có trong snapshot lịch sử.
