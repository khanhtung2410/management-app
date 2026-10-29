import { beforeEach, describe, expect, it, vi } from "vitest";
import { userStatus } from "@/constants/statuses";
import { requireRole, ForbiddenError, UnauthorizedError } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { PATCH } from "./route";
import { asDb, authAdmin, jsonReq, mockPool } from "@/lib/test/helpers";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));
vi.mock("@/lib/auth", async () => {
  const { authMockFactory } = await import("@/lib/test/helpers");
  return authMockFactory();
});
vi.mock("@/lib/db", () => ({ getDb: vi.fn() }));

const params = (id: string) => ({ params: Promise.resolve({ id }) });
const URL_1 = "/api/admin/users/1";
const URL_2 = "/api/admin/users/2";

// ─────────────────────────── Auth / role ───────────────────────────
describe("PATCH /api/admin/users/[id] — auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireRole).mockResolvedValue(authAdmin);
  });

  it("trả 401 khi không đăng nhập", async () => {
    vi.mocked(requireRole).mockRejectedValue(new UnauthorizedError());
    const res = await PATCH(jsonReq({}, "PATCH", URL_1), params("1"));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      error: { code: "UNAUTHENTICATED", message: expect.any(String) },
    });
  });

  it("trả 403 khi sai role", async () => {
    vi.mocked(requireRole).mockRejectedValue(new ForbiddenError());
    const res = await PATCH(jsonReq({}, "PATCH", URL_1), params("1"));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error: { code: "FORBIDDEN", message: expect.any(String) },
    });
  });
});

// ─────────────────────────── Body / id ───────────────────────────
describe("PATCH /api/admin/users/[id] — body/id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireRole).mockResolvedValue(authAdmin);
  });

  it.each([
    ["body rỗng", ""],
    ["JSON hỏng", "{"],
    ["không phải object", "[]"],
  ])("trả 400 với %s", async (_d, body) => {
    const res = await PATCH(jsonReq(body, "PATCH", URL_1), params("1"));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "INVALID_JSON", message: expect.any(String) },
    });
    expect(getDb).not.toHaveBeenCalled();
  });

  it("trả 400 khi id không hợp lệ", async () => {
    const res = await PATCH(jsonReq({}, "PATCH", "/api/x"), params("x"));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả 400 khi không có trường nào", async () => {
    const res = await PATCH(jsonReq({}, "PATCH", URL_1), params("1"));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });
});

// ─────────────────────────── Trạng thái ───────────────────────────
describe("PATCH /api/admin/users/[id] — TrangThai", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireRole).mockResolvedValue(authAdmin);
  });

  it("trả 400 khi TrangThai không hợp lệ", async () => {
    const res = await PATCH(
      jsonReq({ TrangThai: 99 }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả 403 khi tự đổi trạng thái chính mình", async () => {
    // authAdmin.userId = 1; URL id = 1 → trùng
    const res = await PATCH(
      jsonReq({ TrangThai: userStatus.Inactive }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error: { code: "FORBIDDEN", message: expect.any(String) },
    });
  });

  it("trả 200 khi cập nhật status (target khác admin)", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ rowsAffected: [1] }])));
    const res = await PATCH(
      jsonReq({ TrangThai: userStatus.Inactive }, "PATCH", URL_2),
      params("2"),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "Cập nhật người dùng thành công",
    });
  });

  it("trả 404 khi target status không tồn tại", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ rowsAffected: [0] }])));
    const res = await PATCH(
      jsonReq({ TrangThai: userStatus.Inactive }, "PATCH", URL_2),
      params("2"),
    );
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      error: { code: "NOT_FOUND", message: expect.any(String) },
    });
  });
});

// ─────────────────────────── HoTen / Email ───────────────────────────
describe("PATCH /api/admin/users/[id] — HoTen/Email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireRole).mockResolvedValue(authAdmin);
  });

  it("trả 400 khi HoTen rỗng", async () => {
    const res = await PATCH(
      jsonReq({ HoTen: "  " }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả 400 khi HoTen > 255 ký tự", async () => {
    const res = await PATCH(
      jsonReq({ HoTen: "a".repeat(256) }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả 400 khi Email rỗng và không truy cập database", async () => {
    const res = await PATCH(
      jsonReq({ Email: "  " }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
    expect(getDb).not.toHaveBeenCalled();
  });

  it("trả 400 khi Email > 255 ký tự", async () => {
    const res = await PATCH(
      jsonReq({ Email: "a".repeat(250) + "@b.com" }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả 404 khi không tìm thấy user", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ rowsAffected: [0] }])));
    const res = await PATCH(
      jsonReq({ HoTen: "A", Email: "a@b.com" }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      error: { code: "NOT_FOUND", message: expect.any(String) },
    });
  });

  it("trả 200 khi cập nhật profile", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ rowsAffected: [1] }])));
    const res = await PATCH(
      jsonReq(
        { HoTen: "A", Email: "a@b.com", SDT: "0901234567" },
        "PATCH",
        URL_1,
      ),
      params("1"),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "Cập nhật người dùng thành công",
    });
  });
});

// ─────────────────────────── SDT ───────────────────────────
describe("PATCH /api/admin/users/[id] — validate SDT", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireRole).mockResolvedValue(authAdmin);
  });

  it.each([
    ["chứa chữ", "abc123"],
    ["thiếu số", "090123"],
    ["thừa số", "09012345678"],
    ["có dấu gạch", "090-123-456"],
    ["bắt đầu +84", "+84901234567"],
    ["bắt đầu bằng 84", "84901234567"],
    ["bắt đầu bằng 1", "1901234567"],
    ["có khoảng trắng giữa", "090 123 456"],
  ])("trả 400 khi SDT %s", async (_d, sdt) => {
    const res = await PATCH(
      jsonReq({ SDT: sdt }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
    expect(getDb).not.toHaveBeenCalled();
  });

  it.each([
    ["number", 123],
    ["null", null],
    ["object", { x: 1 }],
    ["array", []],
    ["boolean", true],
  ])("trả 400 khi SDT là %s", async (_d, sdt) => {
    const res = await PATCH(
      jsonReq({ SDT: sdt }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
    expect(getDb).not.toHaveBeenCalled();
  });

  it("cho phép SDT rỗng (để xoá số)", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ rowsAffected: [1] }])));
    const res = await PATCH(
      jsonReq({ SDT: "" }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "Cập nhật người dùng thành công",
    });
  });

  it("cho phép SDT chỉ chứa khoảng trắng (trim → rỗng → xoá)", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ rowsAffected: [1] }])));
    const res = await PATCH(
      jsonReq({ SDT: "   " }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(200);
  });

  it("cho phép SDT hợp lệ 10 số", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ rowsAffected: [1] }])));
    const res = await PATCH(
      jsonReq({ SDT: "0901234567" }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(200);
  });

  it("chuẩn hoá SDT có khoảng trắng đầu/cuối", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ rowsAffected: [1] }])));
    const res = await PATCH(
      jsonReq({ SDT: "  0901234567  " }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(200);
  });
});

// ─────────────────────────── Partial update ───────────────────────────
describe("PATCH /api/admin/users/[id] — partial update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireRole).mockResolvedValue(authAdmin);
  });

  it("trả 200 khi chỉ gửi HoTen", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ rowsAffected: [1] }])));
    const res = await PATCH(
      jsonReq({ HoTen: "Nguyễn A" }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(200);
  });

  it("trả 200 khi chỉ gửi Email", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ rowsAffected: [1] }])));
    const res = await PATCH(
      jsonReq({ Email: "a@b.com" }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(200);
  });

  it("trả 200 khi gửi cả profile + TrangThai", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ rowsAffected: [1] }])));
    const res = await PATCH(
      jsonReq(
        {
          HoTen: "A",
          Email: "a@b.com",
          SDT: "0901234567",
          TrangThai: userStatus.Inactive,
        },
        "PATCH",
        URL_2,
      ),
      params("2"),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "Cập nhật người dùng thành công",
    });
  });

  it("trả 400 khi gửi TrangThai + SDT sai (validate fail trước khi chạm DB)", async () => {
    const res = await PATCH(
      jsonReq(
        { TrangThai: userStatus.Inactive, SDT: "abc" },
        "PATCH",
        URL_2,
      ),
      params("2"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
    expect(getDb).not.toHaveBeenCalled();
  });
});