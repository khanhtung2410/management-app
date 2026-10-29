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
});