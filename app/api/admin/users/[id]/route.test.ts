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

// ─────────────────────────── Helper cho test ném lỗi SQL ───────────────────────────
// mockPool hiện tại chỉ trả response; để test 2627/2601 ta cần một pool có thể
// ném lỗi giữa chuỗi query. Giữ shape giống mockPool để dễ đọc.
type PoolArg = Parameters<typeof asDb>[0];

type SqlStep =
  | { rowsAffected?: number[]; recordset?: unknown[] }
  | { throwNumber: number; throwMessage?: string };

function mockPoolThrowing(steps: SqlStep[]): PoolArg {
  let i = 0;
  const chain: {
    input: ReturnType<typeof vi.fn>;
    query: ReturnType<typeof vi.fn>;
  } = { input: vi.fn(), query: vi.fn() };
  chain.input.mockImplementation(() => chain);
  chain.query.mockImplementation(() => {
    const step = steps[i++] ?? { rowsAffected: [0], recordset: [] };
    if ("throwNumber" in step) {
      return Promise.reject(
        Object.assign(new Error(step.throwMessage ?? "SQL error"), {
          number: step.throwNumber,
        }),
      );
    }
    return Promise.resolve({
      rowsAffected: step.rowsAffected ?? [0],
      recordset: step.recordset ?? [],
    });
  });
  // Shape giả lập → shape thật của mssql Pool: cast 1 lần tại biên giới.
  return { request: vi.fn(() => chain) } as unknown as PoolArg;
}

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

  // ─── Cập nhật: email giờ có 2 query (pre-check + UPDATE) ───
  it("trả 404 khi không tìm thấy user", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(
        mockPool([
          { recordset: [] },          // pre-check: không trùng
          { rowsAffected: [0] },      // UPDATE: không tìm thấy
        ]),
      ),
    );
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
    vi.mocked(getDb).mockResolvedValue(
      asDb(
        mockPool([
          { recordset: [] },          // pre-check: không trùng
          { rowsAffected: [1] },      // UPDATE: ok
        ]),
      ),
    );
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

// ─────────────────────────── Email trùng — T13.1 ───────────────────────────
describe("PATCH /api/admin/users/[id] — Email trùng (T13.1)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireRole).mockResolvedValue(authAdmin);
  });

  it("trả 409 CONFLICT khi pre-check phát hiện email đã tồn tại", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(
        mockPool([
          { recordset: [{ ok: 1 }] }, // dup SELECT: có → trùng
        ]),
      ),
    );
    const res = await PATCH(
      jsonReq({ Email: "taken@example.com" }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({
      error: { code: "CONFLICT", message: "Email đã được sử dụng" },
    });
  });

  it("trả 409 CONFLICT khi UPDATE ném lỗi 2627 (race, UQ constraint)", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(
        mockPoolThrowing([
          { recordset: [] },                    // pre-check: không trùng
          { throwNumber: 2627 },                // UPDATE: race → vi phạm UQ
        ]),
      ),
    );
    const res = await PATCH(
      jsonReq({ Email: "new@example.com" }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({
      error: { code: "CONFLICT", message: "Email đã được sử dụng" },
    });
  });

  it("trả 409 CONFLICT khi UPDATE ném lỗi 2601 (unique index)", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(
        mockPoolThrowing([
          { recordset: [] },
          { throwNumber: 2601 },
        ]),
      ),
    );
    const res = await PATCH(
      jsonReq({ Email: "new@example.com" }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(409);
  });

  it("trả 500 khi UPDATE ném lỗi SQL khác 2627/2601 (không bị nhầm thành 409)", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(
        mockPoolThrowing([
          { recordset: [] },
          { throwNumber: 50000, throwMessage: "Other failure" },
        ]),
      ),
    );
    const res = await PATCH(
      jsonReq({ Email: "new@example.com" }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      error: { code: "INTERNAL_ERROR", message: expect.any(String) },
    });
  });
});

// ─────────────────────────── Email format & chuẩn hoá ───────────────────────────
describe("PATCH /api/admin/users/[id] — Email format & chuẩn hoá", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireRole).mockResolvedValue(authAdmin);
  });

  it.each([
    ["thiếu @", "abc.com"],
    ["thiếu domain", "abc@"],
    ["TLD 1 ký tự", "abc@x.c"],
    ["có khoảng trắng", "abc @x.com"],
    ["có hai @", "a@@b.com"],
  ])("trả 400 khi email %s và không chạm DB", async (_d, email) => {
    const res = await PATCH(
      jsonReq({ Email: email }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
    expect(getDb).not.toHaveBeenCalled();
  });

  it("chuẩn hoá email về chữ thường trước pre-check và UPDATE", async () => {
    const capturedEmails: unknown[] = [];
    const chain: {
      input: ReturnType<typeof vi.fn>;
      query: ReturnType<typeof vi.fn>;
    } = { input: vi.fn(), query: vi.fn() };
    chain.input.mockImplementation(
      (name: string, _type: unknown, value: unknown) => {
        if (name === "Email") capturedEmails.push(value);
        return chain;
      },
    );
    chain.query
      .mockResolvedValueOnce({ recordset: [] }) // pre-check: không trùng
      .mockResolvedValueOnce({ rowsAffected: [1] }); // UPDATE: ok

    vi.mocked(getDb).mockResolvedValue(
      asDb({ request: () => chain } as unknown as PoolArg));

    const res = await PATCH(
      jsonReq({ Email: "  USER@Example.COM  " }, "PATCH", URL_1),
      params("1"),
    );

    expect(res.status).toBe(200);
    // Pre-check truyền @Email, UPDATE cũng truyền @Email → cả hai đều lowercase.
    expect(capturedEmails.length).toBeGreaterThanOrEqual(2);
    expect(capturedEmails.every((v) => v === "user@example.com")).toBe(true);
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
    vi.mocked(getDb).mockResolvedValue(
      asDb(
        mockPool([
          { recordset: [] },          // pre-check: không trùng
          { rowsAffected: [1] },      // UPDATE: ok
        ]),
      ),
    );
    const res = await PATCH(
      jsonReq({ Email: "a@b.com" }, "PATCH", URL_1),
      params("1"),
    );
    expect(res.status).toBe(200);
  });

  it("trả 200 khi gửi cả profile + TrangThai", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(
        mockPool([
          { recordset: [] },          // pre-check: không trùng
          { rowsAffected: [1] },      // UPDATE: ok
        ]),
      ),
    );
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