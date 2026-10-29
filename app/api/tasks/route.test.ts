import { beforeEach, describe, expect, it, vi } from "vitest";
import { taskStatus } from "@/constants/statuses";
import { requireAuth, UnauthorizedError } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { GET, POST } from "./route";
import { asDb, authUser, jsonReq, mockPool, req } from "@/lib/test/helpers";

vi.mock("@/lib/auth", async () => {
  const { authMockFactory } = await import("@/lib/test/helpers");
  return authMockFactory();
});
vi.mock("@/lib/db", () => ({ getDb: vi.fn() }));

describe("GET /api/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(authUser);
  });

  it("trả 401 khi chưa đăng nhập", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError());
    const res = await GET(req("GET", "/api/tasks"));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      error: { code: "UNAUTHENTICATED", message: expect.any(String) },
    });
  });

  it("trả 200 danh sách task", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([
        { recordset: [{ ID: 1, Ten: "T" }] },
        { recordset: [{ total: 1 }] },
      ])),);
    const res = await GET(req("GET", "/api/tasks"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toEqual([{ ID: 1, Ten: "T" }]);
    expect(body.meta).toEqual({ page: 1, pageSize: 10, total: 1, totalPages: 1 });
  });

  it("trả 400 khi sortBy không hợp lệ", async () => {
    const res = await GET(req("GET", "/api/tasks?sortBy=foobar"));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("kẹp pageSize = 0 về 1", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([
        { recordset: [] },
        { recordset: [{ total: 0 }] },
      ])),
    );
    const res = await GET(req("GET", "/api/tasks?pageSize=0"));
    const body = await res.json();
    expect(body.meta.pageSize).toBe(1);
  });
});

describe("POST /api/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(authUser);
  });

  it("trả 401 khi chưa đăng nhập", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError());
    const res = await POST(jsonReq({}));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      error: { code: "UNAUTHENTICATED", message: expect.any(String) },
    });
  });

  it.each([
    ["body rỗng", ""],
    ["JSON hỏng", "{"],
  ])("trả 400 với %s", async (_d, body) => {
    const res = await POST(jsonReq(body));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "INVALID_JSON", message: expect.any(String) },
    });
  });

  it("trả 400 khi thiếu Ten", async () => {
    const res = await POST(jsonReq({ HetHan: "2026-01-01" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả 400 khi HetHan không hợp lệ", async () => {
    const res = await POST(jsonReq({ Ten: "T", HetHan: "abc" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả details[0].field = Ten khi thiếu Ten", async () => {
    const res = await POST(jsonReq({ HetHan: "2026-01-01" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.details[0].field).toBe("Ten");
  });

  it("trả details[0].field = HetHan khi HetHan sai", async () => {
    const res = await POST(jsonReq({ Ten: "T", HetHan: "abc" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.details[0].field).toBe("HetHan");
  });

  it("trả 201 khi tạo thành công", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([
        {
          recordset: [
            { ID: 1, Ten: "T", Mota: "", TrangThai: taskStatus.Active, HetHan: "2026-01-01" },
          ],
        },
      ])),
    );
    const res = await POST(
      jsonReq({ Ten: "T", Mota: "", HetHan: "2026-01-01" }),
    );
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(
      expect.objectContaining({ ID: 1, Ten: "T" }),
    );
  });
});