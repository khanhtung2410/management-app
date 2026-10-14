# Contributing Guide

Cảm ơn bạn đã quan tâm đóng góp cho **Website quản lý công việc cá nhân**.
Tài liệu này mô tả quy trình làm việc, quy tắc code, commit và pull request.

> Đọc `README.md` trước để hiểu project làm gì và cách chạy local.

---

## 1. Quy trình làm việc

Mô hình: **GitHub Flow** (đơn giản, phù hợp team nhỏ, deploy liên tục).

```
main        ← production, luôn stable, mọi commit đều deploy được
feature/*   ← nhánh tính năng
fix/*       ← nhánh sửa bug
chore/*     ← cấu hình, dependency, CI
docs/*      ← chỉ sửa tài liệu
```

**Các bước:**

1. Cập nhật `main` mới nhất:

   ```bash
   git checkout main
   git pull origin main
   ```

2. Tạo nhánh mới từ `main`:

   ```bash
   git checkout -b feature/TASK-12-tao-cong-viec
   ```

3. Code, chạy test, commit theo quy tắc bên dưới.

4. Push và mở Pull Request vào `main`:

   ```bash
   git push -u origin feature/TASK-12-tao-cong-viec
   ```

5. Chờ CI pass + ít nhất 1 approval → squash merge → xóa nhánh.

**Quy tắc đặt tên nhánh:**

```
<type>/<ticket-id>-<kebab-case-mô-tả-ngắn>
```

Ví dụ:

- `feature/TASK-12-tao-cong-viec`
- `fix/TASK-34-search-khong-reset-page`
- `chore/TASK-40-nang-cap-next-15`

Không có ticket ID? Dùng mô tả ngắn: `feature/them-trang-dang-ky`.

---

## 2. Quy tắc code

### Nguyên tắc chung

- **TypeScript strict** — không dùng `any`, không `// @ts-ignore` trừ khi có comment giải thích.
- **Không commit code chết** — không `console.log`, không code comment-out, không file `.bak`.
- **Không commit secret** — API key, mật khẩu, JWT secret để trong `.env` (đã có trong `.gitignore`).
- **Một hàm làm một việc** — hàm > 50 dòng nên tách.
- **Tên biến/hàm mô tả đúng ý nghĩa** — `getUserById` tốt hơn `getData`.
- **Ưu tiên dễ đọc hơn thông minh** — code được đọc nhiều lần hơn viết.

### Cấu trúc file

Tuân theo cấu trúc trong README:

```
app/         ← route, page, layout, API route handler
features/    ← logic theo domain (auth, tasks, users)
lib/         ← tiện ích dùng chung (db, jwt, validation)
```

**Quy tắc đặt file:**

| Loại | Vị trí | Ví dụ |
|---|---|---|
| Route / page | `app/` | `app/tasks/page.tsx` |
| API handler | `app/api/` | `app/api/tasks/route.ts` |
| Component theo domain | `features/<domain>/components/` | `features/tasks/components/TaskList.tsx` |
| Hook theo domain | `features/<domain>/hooks/` | `features/tasks/hooks/useTasks.ts` |
| API client | `features/<domain>/api/` | `features/tasks/api/tasksApi.ts` |
| Tiện ích chung | `lib/` | `lib/db.ts` |

### Server vs Client Component

- **Mặc định là Server Component** — không thêm `"use client"` trừ khi cần.
- Chỉ thêm `"use client"` khi dùng `useState`, `useEffect`, event handler, hoặc browser API.
- **`page.tsx` không có `"use client"`** — để giữ metadata và auth check ở server.
- Component có state đặt `"use client"` ở **component lá**, không phải `page.tsx`.

### Tầng gọi API

- Component **không** gọi `fetch` trực tiếp.
- Luôn đi qua `features/<domain>/api/<domain>Api.ts` — đây là seam để test.
- Logic state + fetch gói trong hook (`useTasks`, `useUsers`).

```tsx
// ❌ Sai
useEffect(() => {
  fetch("/api/tasks").then(...)
}, []);

// ✅ Đúng
const { data, loading } = useTasks();
```

### Database (MSSQL)

- Mọi query dùng **parameterized query**, không nối chuỗi:

  ```ts
  // ❌ Sai — SQL injection
  db.query(`SELECT * FROM Users WHERE Email = '${email}'`);

  // ✅ Đúng
  db.request()
    .input("email", email)
    .query("SELECT * FROM Users WHERE Email = @email");
  ```

- Không viết SQL trong component — đặt trong `features/<domain>/` hoặc `lib/db/`.
- Mọi thay đổi schema phải có file migration, không sửa DB thủ công.

### Validation

- Dùng **Zod** cho mọi input từ client (form, query param, body).
- Schema đặt cạnh API handler hoặc trong `features/<domain>/schemas.ts`.
- Validate ở **server**, không tin client.

### Testing

- **Tính năng mới phải có test đi kèm.**
- Bug fix phải có test tái hiện lỗi trước khi fix.
- Hook test bằng `renderHook` + mock `usersApi` (không mock `fetch`).
- API route test bằng cách gọi handler trực tiếp với `Request` giả.
- Coverage tối thiểu: **70%** cho `features/` và `lib/`.

```bash
pnpm test          # chạy trước khi commit
pnpm test:e2e      # trước khi mở PR nếu đụng UI
```

### Format & Lint

- Đã cấu hình **ESLint + Prettier** qua Husky pre-commit hook.
- Không bypass hook (`--no-verify`) trừ trường hợp khẩn cấp, phải báo trong PR.

```bash
pnpm lint          # kiểm tra
pnpm lint --fix    # tự sửa
```

---

## 3. Quy tắc commit

Áp dụng **Conventional Commits**.

### Format

```
<type>(<scope>): <mô tả ngắn ở thể mệnh lệnh>

[body tùy chọn — giải thích WHY, không phải WHAT]

[footer — ticket, breaking change]
```

### Type

| Type | Ý nghĩa |
|---|---|
| `feat` | Tính năng mới |
| `fix` | Sửa bug |
| `docs` | Chỉ sửa tài liệu |
| `style` | Format, dấu chấm phẩy (không đổi logic) |
| `refactor` | Tái cấu trúc, không đổi hành vi |
| `perf` | Cải thiện hiệu năng |
| `test` | Thêm/sửa test |
| `chore` | Build, CI, dependency |

### Scope (tùy chọn)

Dùng tên domain: `auth`, `tasks`, `users`, `admin`, `db`, `ui`.

### Ví dụ

```
feat(tasks): thêm form tạo công việc

fix(tasks): reset trang khi đổi từ khóa tìm kiếm

Nguyên nhân: useEffect fetch phụ thuộc searchTerm thô, không reset
currentPage. Khi search thu hẹp kết quả, currentPage cũ vượt totalPages
gây hiển thị rỗng.

Closes TASK-34
```

```
refactor(users): tách useUsers hook khỏi UserList

chore: nâng Next.js lên 15.0.3
```

### Quy tắc viết

- Dòng tiêu đề **≤ 72 ký tự**, không viết hoa đầu câu, không dấu chấm cuối.
- Dùng **thể mệnh lệnh**: "thêm" không phải "đã thêm", "sửa" không phải "đang sửa".
- Mỗi commit là một thay đổi logic hoàn chỉnh — build được, test pass.
- Body giải thích **tại sao**, không phải **cái gì** (cái gì thì diff đã thể hiện).
- Breaking change: thêm `!` sau type và ghi rõ trong footer:

  ```
  feat(api)!: đổi response format của /api/tasks

  BREAKING CHANGE: trường `items` đổi thành `data`, ảnh hưởng mọi client.
  ```

---

## 4. Quy trình Pull Request

### Trước khi mở PR

- [ ] Đã rebase lên `main` mới nhất (`git rebase main`).
- [ ] `pnpm lint` pass.
- [ ] `pnpm test` pass.
- [ ] `pnpm build` thành công.
- [ ] Đã tự review diff trên GitHub.
- [ ] Đã cập nhật README / docs nếu thay đổi hành vi hoặc cấu hình.

### Tiêu đề PR

Theo cùng format Conventional Commits:

```
feat(tasks): thêm form tạo công việc
fix(tasks): reset trang khi đổi từ khóa tìm kiếm
```

### Mô tả PR

Dùng template sau (đã có sẵn khi tạo PR):

```markdown
## What
Tóm tắt ngắn gọn thay đổi. 1–2 câu.

## Why
Lý do / ticket liên quan. Link tới issue nếu có.

Closes TASK-12

## How
Cách tiếp cận chính. Điểm cần lưu ý khi review.
Ví dụ: "Tách logic fetch ra hook useUsers để test được không cần DOM."

## Testing
Đã test những gì, bằng cách nào.

- [x] Unit test cho useUsers (5 case)
- [x] Thủ công: tạo 20 user, kiểm tra phân trang
- [ ] Chưa test trên Safari

## Screenshots (nếu là UI)
| Trước | Sau |
|---|---|
| <ảnh> | <ảnh> |

## Checklist
- [ ] Test pass
- [ ] Lint pass
- [ ] Không có breaking change (hoặc đã ghi rõ ở footer commit)
- [ ] Đã cập nhật docs nếu cần
```

### Kích thước PR

- **Lý tưởng: < 400 dòng thay đổi.**
- PR > 800 dòng nên tách — reviewer sẽ bỏ sót bug.
- Nếu buộc phải to (VD: migration schema), ghi rõ trong mô tả để reviewer biết chỗ nào cần soi kỹ.

### Review

- Cần tối thiểu **1 approval** trước khi merge.
- Reviewer phản hồi trong vòng **24 giờ làm việc**.
- Tác giả không tự merge PR của mình (trừ hotfix khẩn cấp, phải báo team).

**Cách để lại comment:**

| Prefix | Ý nghĩa | Bắt buộc sửa? |
|---|---|---|
| `[blocking]` | Phải sửa trước khi merge | ✅ |
| `[question]` | Cần giải thích, có thể không sửa | ⚠️ Trả lời |
| `[nit]` | Nhỏ, tùy, không bắt buộc | ❌ |
| `[suggestion]` | Đề xuất cải thiện | ❌ |

Ví dụ:

```
[blocking] Query này nối chuỗi trực tiếp → SQL injection.
Dùng parameterized query.

[nit] Tên biến `d` nên đổi thành `debouncedSearch` cho rõ.

[question] Tại sao debounce 350ms mà không phải 500ms?
```

### Merge

- Dùng **Squash and merge** — giữ `main` sạch, mỗi PR = 1 commit.
- Xóa nhánh sau khi merge.
- Nếu PR có nhiều commit có ý nghĩa riêng, có thể dùng **Rebase and merge** — nhưng phải đảm bảo mỗi commit build được.

### Sau khi merge

- CI tự động deploy lên staging.
- Kiểm tra staging chạy đúng trước khi báo "done".
- Nếu phát hiện lỗi → mở PR `fix/...` mới, không revert trừ khi nghiêm trọng.

---

## 5. Báo cáo bug / đề xuất tính năng

### Bug

Mở issue với template:

```markdown
**Môi trường:** Chrome 120, Windows 11 / local dev
**Bước tái hiện:**
1. Đăng nhập
2. Vào /tasks
3. Gõ "abc" vào ô tìm kiếm

**Kết quả mong đợi:** Danh sách lọc theo "abc"
**Kết quả thực tế:** Danh sách rỗng dù có công việc khớp
**Ảnh / log:** <đính kèm>
```

### Feature request

Mô tả **vấn đề cần giải quyết** trước, giải pháp đề xuất sau:

```markdown
**Vấn đề:** Tôi không biết công việc nào sắp tới hạn.
**Đề xuất:** Thêm trường deadline và sắp xếp theo deadline.
**Ưu tiên:** Cao / Trung bình / Thấp
```

### Bảo mật

**Không** mở issue công khai. Gửi email tới `<security@example.com>` kèm:

- Mô tả lỗ hổng
- Cách tái hiện
- Mức độ ảnh hưởng

Sẽ phản hồi trong vòng 48 giờ.

---

## 6. Câu hỏi?

- Mở discussion trên GitHub
- Slack/Discord: `<#channel>`
- Maintainer: `<@handle>`