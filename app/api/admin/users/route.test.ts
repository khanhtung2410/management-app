import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireRole, ForbiddenError, UnauthorizedError } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { GET } from "./route";
import { asDb, authAdmin, mockPool, req } from "@/lib/test/helpers";

vi.mock("@/lib/auth", async () => {
  const { authMockFactory } = await import("@/lib/test/helpers");
  return authMockFactory();
});
vi.mock("@/lib/db", () => ({ getDb: vi.fn() }));

describe("GET /api/admin/users", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireRole).mockResolvedValue(authAdmin);
  });

  it("trả 401 khi không đăng nhập", async () => {
    vi.mocked(requireRole).mockRejectedValue(new UnauthorizedError());
    const res = await GET(req("GET", "/api/admin/users"));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      error: { code: "UNAUTHENTICATED", message: expect.any(String) },
    });
  });

  it("trả 403 khi sai role", async () => {
    vi.mocked(requireRole).mockRejectedValue(new ForbiddenError());
    const res = await GET(req("GET", "/api/admin/users"));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error: { code: "FORBIDDEN", message: expect.any(String) },
    });
  });

  it("trả 200 với meta phân trang", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([
        { recordset: [{ ID: 1, HoTen: "A", Email: "a@x.com", SDT: "", TrangThai: 1 }] },
        { recordset: [{ total: 1 }] },
      ])),
    );
    const res = await GET(req("GET", "/api/admin/users?page=1&pageSize=10"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveLength(1);
    expect(body.meta).toEqual({ page: 1, pageSize: 10, total: 1, totalPages: 1 });
  });

  it("kẹp pageSize = 0 về 1", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([
        { recordset: [] },
        { recordset: [{ total: 0 }] },
      ])),
    );
    const res = await GET(req("GET", "/api/admin/users?pageSize=0"));
    const body = await res.json();
    expect(body.meta.pageSize).toBe(1);
  });

  it("kẹp pageSize = 999 về 100", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([
        { recordset: [] },
        { recordset: [{ total: 0 }] },
      ])),
    );
    const res = await GET(req("GET", "/api/admin/users?pageSize=999"));
    const body = await res.json();
    expect(body.meta.pageSize).toBe(100);
  });

  // ─── sortBy validation ────────────────────────────────────────────────
  describe("sortBy", () => {
    it("trả 200 khi không truyền sortBy (mặc định id)", async () => {
      vi.mocked(getDb).mockResolvedValue(
        asDb(mockPool([
          { recordset: [] },
          { recordset: [{ total: 0 }] },
        ])),
      );
      const res = await GET(req("GET", "/api/admin/users"));
      expect(res.status).toBe(200);
    });

    it("trả 200 với sortBy=id", async () => {
      vi.mocked(getDb).mockResolvedValue(
        asDb(mockPool([
          { recordset: [] },
          { recordset: [{ total: 0 }] },
        ])),
      );
      const res = await GET(req("GET", "/api/admin/users?sortBy=id"));
      expect(res.status).toBe(200);
    });

    // Regression: trước đây sortableColumn["constructor"] trả Function (truthy)
    // → `?? "ID"` không chặn → ORDER BY <function> → SQL syntax error → 500
    it.each([
      "constructor",
      "toString",
      "hasOwnProperty",
      "valueOf",
      "__proto__",
      "isPrototypeOf",
      "__defineGetter__",
      "__lookupGetter__",
    ])("trả 400 (không phải 500) với sortBy prototype chain: %s", async (sortBy) => {
      const res = await GET(req("GET", `/api/admin/users?sortBy=${sortBy}`));
      expect(res.status).toBe(400);
      expect(await res.json()).toMatchObject({
        error: { code: "VALIDATION_ERROR", message: expect.any(String) },
      });
      // validate phải chạy trước khi chạm DB
      expect(getDb).not.toHaveBeenCalled();
    });

    // Behavior change: trước đây fallback im lặng về "ID" → 200
    // Giờ 400 để nhất quán với /api/tasks
    it.each(["foo", "createdAt", "email", "id2", ""])(
      "trả 400 với sortBy lạ (trước là 200 silent fallback): %j",
      async (sortBy) => {
        const res = await GET(
          req("GET", `/api/admin/users?sortBy=${sortBy}`),
        );
        expect(res.status).toBe(400);
        expect(await res.json()).toMatchObject({
          error: { code: "VALIDATION_ERROR", message: expect.any(String) },
        });
        expect(getDb).not.toHaveBeenCalled();
      },
    );

    it("trả details[0].field = 'sortBy' khi sortBy không hợp lệ", async () => {
      const res = await GET(req("GET", "/api/admin/users?sortBy=constructor"));
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "sortBy" }),
        ]),
      );
    });
  });
});