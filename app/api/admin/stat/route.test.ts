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

describe("GET /api/admin/dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireRole).mockResolvedValue(authAdmin);
  });

  it("trả 401 khi không đăng nhập", async () => {
    vi.mocked(requireRole).mockRejectedValue(new UnauthorizedError());
    const res = await GET(req());
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      error: { code: "UNAUTHENTICATED", message: expect.any(String) },
    });
    expect(getDb).not.toHaveBeenCalled();
  });

  it("trả 403 khi sai role", async () => {
    vi.mocked(requireRole).mockRejectedValue(new ForbiddenError());
    const res = await GET(req());
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error: { code: "FORBIDDEN", message: expect.any(String) },
    });
  });

  it("trả 200 và tính toán đúng taskStats", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([
        { recordset: [{ totalUsers: 5 }] },
        { recordset: [{ totalTasks: 10, DangThucHien: 4, HoanThanh: 5, QuaHan: 1 }] },
      ])),
    );
    const res = await GET(req());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.totalUsers).toBe(5);
    expect(body.totalTasks).toBe(10);
    expect(body.taskStats).toEqual([
      expect.objectContaining({ total: 4, percent: 40 }),
      expect.objectContaining({ total: 5, percent: 50 }),
      expect.objectContaining({ total: 1, percent: 10 }),
    ]);
  });
});