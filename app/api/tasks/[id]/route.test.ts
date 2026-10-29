import { beforeEach, describe, expect, it, vi } from "vitest";
import { taskStatus } from "@/constants/statuses";
import { requireAuth, UnauthorizedError } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { GET, PATCH } from "./route";
import { asDb, authUser, jsonReq, mockPool, req } from "@/lib/test/helpers";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }));
vi.mock("@/lib/auth", async () => {
  const { authMockFactory } = await import("@/lib/test/helpers");
  return authMockFactory();
});
vi.mock("@/lib/db", () => ({ getDb: vi.fn() }));

const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe("GET /api/tasks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(authUser);
  });

  it("trả 401 khi chưa đăng nhập", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError());
    const res = await GET(req("GET", "/api/tasks/1"), params("1"));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      error: { code: "UNAUTHENTICATED", message: expect.any(String) },
    });
  });

  it("trả 400 khi id không hợp lệ", async () => {
    const res = await GET(req("GET", "/api/tasks/x"), params("x"));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả 404 khi không tìm thấy", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ recordset: [] }])));
    const res = await GET(req("GET", "/api/tasks/99"), params("99"));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      error: { code: "NOT_FOUND", message: expect.any(String) },
    });
  });

  it("trả 200 chi tiết task", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([{ recordset: [{ ID: 1, Ten: "T" }] }])),
    );
    const res = await GET(req("GET", "/api/tasks/1"), params("1"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ID: 1, Ten: "T" });
  });
});

describe("PATCH /api/tasks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireAuth).mockResolvedValue(authUser);
  });

  it("trả 401 khi chưa đăng nhập", async () => {
    vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError());
    const res = await PATCH(
      jsonReq({ TrangThai: taskStatus.Complete }, "PATCH", "/api/tasks/1"),
      params("1"),
    );
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      error: { code: "UNAUTHENTICATED", message: expect.any(String) },
    });
  });

  it("trả 400 khi id không hợp lệ", async () => {
    const res = await PATCH(
      jsonReq({ TrangThai: taskStatus.Complete }, "PATCH", "/api/tasks/x"),
      params("x"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it.each([
    ["body rỗng", ""],
    ["JSON hỏng", "{"],
  ])("trả 400 với %s", async (_d, body) => {
    const res = await PATCH(
      jsonReq(body, "PATCH", "/api/tasks/1"),
      params("1"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "INVALID_JSON", message: expect.any(String) },
    });
  });

  it("trả 400 khi TrangThai không hợp lệ", async () => {
    const res = await PATCH(
      jsonReq({ TrangThai: 99 }, "PATCH", "/api/tasks/1"),
      params("1"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả 404 khi không tìm thấy task", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ recordset: [] }])));
    const res = await PATCH(
      jsonReq({ TrangThai: taskStatus.Complete }, "PATCH", "/api/tasks/99"),
      params("99"),
    );
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      error: { code: "NOT_FOUND", message: expect.any(String) },
    });
  });

  it("trả 200 khi cập nhật thành công", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([
        {
          recordset: [
            { ID: 1, Ten: "T", TrangThai: taskStatus.Complete },
          ],
        },
      ])),
    );
    const res = await PATCH(
      jsonReq({ TrangThai: taskStatus.Complete }, "PATCH", "/api/tasks/1"),
      params("1"),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(
      expect.objectContaining({ ID: 1, TrangThai: taskStatus.Complete }),
    );
  });
});