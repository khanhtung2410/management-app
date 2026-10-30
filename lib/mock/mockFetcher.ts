import { userRole } from "@/constants/roles";
import { userStatus, UserStatusType } from "@/constants/statuses";
import type { User as AdminUser } from "@/app/(admin)/admin/users/_lib/api";
import { mockUser } from "./data";
import { mockDelay } from "./config";
import { parsePage, parsePageSize } from "../api/pagination";

// ─────────────────────────── Types ───────────────────────────
type MockUser = Pick<AdminUser, "ID" | "HoTen" | "Email" | "SDT" | "TrangThai">;

const PHONE_REGEX = /^0\d{9}$/;

const sortableColumn = { id: "ID", hoTen: "HoTen", email: "Email" } as const;
type SortKey = keyof typeof sortableColumn;

// ─────────────────────────── Mutable store ───────────────────────────

export function updateMockUser(
  id: number,
  updates: Partial<MockUser>
): MockUser | null {
  const idx = store.findIndex((u) => u.ID === id);
  if (idx === -1) return null;
  const cur = store[idx];
  const next = { ...cur, ...updates } as MockUser;
  store[idx] = next;
  return next;
}

// ─────────────────────────── Response helpers ───────────────────────────
function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function jsonError(code: string, message: string, status = 400): Response {
  return jsonResponse({ error: { code, message } }, status);
}

// ─────────────────────────── In-memory store ───────────────────────────
function seedUsers(): MockUser[] {
  return mockUser
    .filter((user) => user.RoleId === userRole.USER)
    .map(({ ID, HoTen, Email, SDT, TrangThai }) => ({
      ID,
      HoTen,
      Email,
      SDT,
      TrangThai,
    }));
}

let store: MockUser[] = seedUsers();

/** Reset store về dữ liệu gốc — gọi trong beforeEach của test. */
export function resetMockUsers(): void {
  store = seedUsers();
}

// ─────────────────────────── Read body ───────────────────────────
function readJsonBody(init?: RequestInit): Record<string, unknown> | null {
  if (!init?.body) return {};
  if (typeof init.body !== "string") return null;
  try {
    const parsed: unknown = JSON.parse(init.body);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ─────────────────────────── Fetcher ───────────────────────────
export const mockFetcher: typeof fetch = async (input, init) => {
  await mockDelay();

  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;
  const requestUrl = new URL(url, "http://localhost:3000");
  const method = (
    init?.method ?? (input instanceof Request ? input.method : "GET")
  ).toUpperCase();

  // ───────── GET /api/admin/users ─────────
  if (requestUrl.pathname === "/api/admin/users" && method === "GET") {
    const searchParams = requestUrl.searchParams;

    const sortByKey = (searchParams.get("sortBy") ?? "id") as SortKey;
    if (!(sortByKey in sortableColumn)) {
      return jsonError("VALIDATION_ERROR", "sortBy không hợp lệ", 400);
    }

    const page = parsePage(searchParams.get("page"));
    const pageSize = parsePageSize(searchParams.get("pageSize"));
    const order = searchParams.get("order") === "desc" ? "desc" : "asc";
    const search = (searchParams.get("search") ?? "").trim().toLowerCase();

    let users = [...store];
    if (search) {
      users = users.filter(
        (user) =>
          user.HoTen.toLowerCase().includes(search) ||
          user.Email.toLowerCase().includes(search),
      );
    }

    const key = sortableColumn[sortByKey] as keyof MockUser;
    users.sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va).localeCompare(String(vb));
      return order === "asc" ? cmp : -cmp;
    });

    const total = users.length;
    const totalPages = Math.max(Math.ceil(total / pageSize), 1);
    const offset = (page - 1) * pageSize;

    return jsonResponse({
      data: users.slice(offset, offset + pageSize),
      meta: { page, pageSize, total, totalPages },
    });
  }

  // ───────── PATCH /api/admin/users/:id ─────────
  const patchMatch = requestUrl.pathname.match(/^\/api\/admin\/users\/(\d+)$/);
  if (patchMatch && method === "PATCH") {
    const id = Number(patchMatch[1]);
    if (!Number.isInteger(id) || id <= 0) {
      return jsonError("VALIDATION_ERROR", "ID người dùng không hợp lệ", 400);
    }

    const idx = store.findIndex((u) => u.ID === id);
    if (idx === -1) {
      return jsonError("NOT_FOUND", "Không tìm thấy người dùng", 404);
    }

    const body = readJsonBody(init);
    if (body === null) {
      return jsonError(
        "INVALID_JSON",
        "Dữ liệu gửi lên không phải JSON hợp lệ",
        400,
      );
    }

    const { TrangThai, HoTen, Email, SDT } = body;

    const hasStatus = TrangThai !== undefined;
    const hasProfile =
      HoTen !== undefined || Email !== undefined || SDT !== undefined;

    if (!hasStatus && !hasProfile) {
      return jsonError(
        "VALIDATION_ERROR",
        "Không có trường nào để cập nhật",
        400,
      );
    }

    // Validate TrangThai
    if (hasStatus) {
      if (
        TrangThai !== userStatus.Active &&
        TrangThai !== userStatus.Inactive
      ) {
        return jsonError("VALIDATION_ERROR", "Trạng thái không hợp lệ", 400);
      }
    }

    // Validate HoTen
    if (HoTen !== undefined) {
      if (typeof HoTen !== "string" || HoTen.trim() === "") {
        return jsonError("VALIDATION_ERROR", "Họ tên không hợp lệ", 400);
      }
      if (HoTen.trim().length > 255) {
        return jsonError(
          "VALIDATION_ERROR",
          "Họ tên không được vượt quá 255 ký tự",
          400,
        );
      }
    }

    // Validate Email
    if (Email !== undefined) {
      if (typeof Email !== "string" || Email.trim() === "") {
        return jsonError("VALIDATION_ERROR", "Email không hợp lệ", 400);
      }
      if (Email.trim().length > 255) {
        return jsonError(
          "VALIDATION_ERROR",
          "Email không được vượt quá 255 ký tự",
          400,
        );
      }
    }

    // Validate SDT
    let sdtTrim: string | undefined;
    if (SDT !== undefined) {
      if (typeof SDT !== "string") {
        return jsonError("VALIDATION_ERROR", "Số điện thoại không hợp lệ", 400);
      }
      sdtTrim = SDT.trim();
      if (sdtTrim !== "" && !PHONE_REGEX.test(sdtTrim)) {
        return jsonError(
          "VALIDATION_ERROR",
          "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0",
          400,
        );
      }
    }

    // Apply
    const cur = store[idx];
    store[idx] = {
      ...cur,
      TrangThai: hasStatus ? (TrangThai as UserStatusType) : cur.TrangThai,
      HoTen: HoTen !== undefined ? (HoTen as string).trim() : cur.HoTen,
      Email: Email !== undefined ? (Email as string).trim() : cur.Email,
      SDT: sdtTrim !== undefined ? sdtTrim : cur.SDT,
    };

    return jsonResponse({ message: "Cập nhật người dùng thành công" });
  }

  // ───────── Unknown route ─────────
  return jsonError("NOT_FOUND", "Not mocked", 404);
};

// ─────────────────────────── Failing fetcher ───────────────────────────
export const failingMockFetcher: typeof fetch = async () => {
  await mockDelay();
  throw new Error("Lỗi giả lập từ mock API.");
};