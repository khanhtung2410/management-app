# Contributing Guide

Cảm ơn bạn đã quan tâm đóng góp cho **Website quản lý công việc cá nhân**.
Tài liệu này mô tả quy trình làm việc, quy tắc code, commit và pull request.

> Đọc `README.md` trước để hiểu project làm gì và cách chạy local.

---

## 1. Quy trình làm việc

Mô hình: **GitHub Flow** — làm việc trên nhánh riêng rồi mở Pull Request về nhánh chính.

```
master      ← nhánh chính của repository
feature/*   ← nhánh tính năng
fix/*       ← nhánh sửa bug
chore/*     ← cấu hình, dependency, CI
docs/*      ← chỉ sửa tài liệu
```

**Các bước:**

1. Cập nhật `master` mới nhất:

   ```bash
   git switch master
   git pull --ff-only origin master
   ```

2. Tạo nhánh mới từ `master`:

   ```bash
   git switch -c feature/task-12-tao-cong-viec
   ```

3. Code, chạy các lệnh kiểm tra phù hợp ở mục Testing, rồi commit theo quy tắc bên dưới.

4. Push và mở Pull Request vào `master`:

   ```bash
   git push -u origin feature/task-12-tao-cong-viec
   ```

5. Đảm bảo các kiểm tra bắt buộc và review theo yêu cầu của repository đã hoàn tất trước khi merge. Sau khi merge, xóa nhánh đã hoàn thành.

**Quy tắc đặt tên nhánh:**

```
<type>/<ticket-id>-<kebab-case-mô-tả-ngắn>
```

Ví dụ:

- `feature/task-12-create-task`
- `fix/task-34-search-page-reset`
- `chore/task-40-upgrade-next`

Chỉ dùng chữ ASCII, chữ số và dấu gạch ngang trong tên nhánh. Không có ticket ID thì dùng mô tả ngắn, ví dụ `feature/add-register-page`.

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

```
app/          ← route, page, layout, API route handler
components/   ← component giao diện dùng chung
constants/    ← hằng số và cấu hình domain
lib/          ← tiện ích và logic dùng chung (auth, database)
```

Đặt code gần route hoặc domain đang sử dụng; chỉ tạo thư mục dùng chung khi có nhiều nơi thực sự cần dùng.

### Server vs Client Component

- **Mặc định là Server Component** — không thêm `"use client"` trừ khi cần.
- Chỉ thêm `"use client"` khi dùng `useState`, `useEffect`, event handler, hoặc browser API.
- Trang có thể là Client Component nếu cần tương tác phía trình duyệt; nếu chỉ một phần cần tương tác, cân nhắc tách riêng phần đó.

### Tầng gọi API

- Không gọi database trực tiếp từ component phía trình duyệt; database chỉ được truy cập trong server-side code/API route.
- Một số trang hiện gọi API bằng `fetch`, một số luồng dùng API client/hook riêng. Khi mở rộng, ưu tiên tái sử dụng hoặc trích xuất API client/hook nếu logic cần dùng ở nhiều nơi hoặc cần kiểm thử độc lập.

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

- Không viết SQL trong component; đặt truy vấn trong API route hoặc server-side module phù hợp.
- Mọi thay đổi schema phải có file migration, không sửa DB thủ công.

### Validation

- Validate dữ liệu không đáng tin cậy ở server, gồm body, query param và dữ liệu từ bên ngoài.
- Dùng kiểu và helper đã có trong dự án; nếu thêm thư viện validation mới, cần cập nhật dependency và tài liệu tương ứng.

### Testing

- **Tính năng mới phải có test đi kèm.**
- Bug fix phải có test tái hiện lỗi trước khi fix.
- Dùng Vitest và các test hiện có làm mẫu; ưu tiên kiểm thử hàm thuần và hành vi có thể tái hiện một cách ổn định.
- Với thay đổi giao diện, kiểm tra thủ công các luồng bị ảnh hưởng; repository hiện chưa có script E2E.

```bash
npm run test:run   # chạy Vitest một lần, trước khi commit
```

### Format & Lint

- Repository cấu hình ESLint; hiện chưa cấu hình Prettier hoặc Husky pre-commit hook.

```bash
npm run lint             # kiểm tra
npm run lint -- --fix    # yêu cầu ESLint tự sửa lỗi có thể tự động sửa
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
feat(tasks): add task creation form

fix cause: fetch effect depends on raw searchTerm without resetting
currentPage. Narrowing the search can leave currentPage beyond totalPages.

Refs TASK-34
```

```
refactor(users): extract useUsers hook from user list

chore: upgrade Next.js to 16.3.8
```

### Quy tắc viết

- Dòng tiêu đề **≤ 72 ký tự**, không viết hoa đầu câu, không dấu chấm cuối.
- Dùng chữ ASCII trong commit message để thống nhất với tên nhánh và tránh lỗi encoding ở công cụ.
- Dùng **thể mệnh lệnh** bằng tiếng Anh: `add` thay vì `added`, `fix` thay vì `fixing`.
- Mỗi commit là một thay đổi logic hoàn chỉnh — build được, test pass.
- Body giải thích **tại sao**, không phải **cái gì** (cái gì thì diff đã thể hiện).
- Breaking change: thêm `!` sau type và ghi rõ trong footer:

  ```
  feat(api)!: change tasks api response format

  BREAKING CHANGE: rename the items field to data; this affects all clients.
  ```

---

## 4. Quy trình Pull Request

### Trước khi mở PR

- [ ] Đã cập nhật từ `master` mới nhất và giải quyết conflict nếu có.
- [ ] `npm run check:bom` pass.
- [ ] `npm run lint` pass.
- [ ] `npx tsc --noEmit` pass.
- [ ] `npm run test:run` pass.
- [ ] `npm run build` thành công.
- [ ] Đã tự review diff trên GitHub.
- [ ] Đã cập nhật README / docs nếu thay đổi hành vi hoặc cấu hình.

### Tiêu đề PR

Theo cùng format Conventional Commits:

```
feat(tasks): add task creation form
fix(tasks): reset page when search changes
```

### Mô tả PR

Có thể dùng mẫu sau để mô tả PR:

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
Liệt kê các kiểm tra đã chạy và kết quả.

- [ ] Unit test liên quan
- [ ] Lint, type-check và build
- [ ] Kiểm tra thủ công (nếu cần), nêu môi trường và kết quả

## Screenshots (nếu là UI)
| Trước | Sau |
|---|---|
| <ảnh> | <ảnh> |

## Checklist
- [ ] Test pass
- [ ] Lint pass
- [ ] Type-check pass
- [ ] Không có breaking change (hoặc đã ghi rõ ở footer commit)
- [ ] Đã cập nhật docs nếu cần
```

### Kích thước PR

- **Lý tưởng: < 400 dòng thay đổi.**
- PR > 800 dòng nên tách — reviewer sẽ bỏ sót bug.
- Nếu buộc phải to (VD: migration schema), ghi rõ trong mô tả để reviewer biết chỗ nào cần soi kỹ.

### Review

- Tuân theo yêu cầu review và kiểm tra bắt buộc được cấu hình cho repository.
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

- Dùng phương thức merge được repository cho phép; ưu tiên **Squash and merge** để lịch sử nhánh chính gọn.
- Xóa nhánh sau khi merge nếu không còn cần dùng.

### Sau khi merge

- Kiểm tra môi trường triển khai nếu repository có cấu hình deploy; không mặc định CI hoặc staging đã được thiết lập.
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