import { userRole } from "@/constants/roles";
import type { User as AdminUser } from "@/app/(admin)/admin/users/_lib/api";
import { mockUser } from "./data";
import { mockDelay } from "./config";
import { parsePage, parsePageSize } from "../api/pagination";

// ─────────────────────────── Types ───────────────────────────
type MockUser = Pick<AdminUser, "ID" | "HoTen" | "Email" | "SDT" | "TrangThai">;

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

  // ───────── Unknown route ─────────
  return jsonError("NOT_FOUND", "Not mocked", 404);
};

// ─────────────────────────── Failing fetcher ───────────────────────────
export const failingMockFetcher: typeof fetch = async () => {
  await mockDelay();
  throw new Error("Lỗi giả lập từ mock API.");
};