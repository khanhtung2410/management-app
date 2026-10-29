import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import { userStatus } from "@/constants/statuses";
import { createToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { POST } from "./route";
import { asDb, jsonReq, mockPool } from "@/lib/test/helpers";

vi.mock("@/lib/auth", async () => {
  const { authMockFactory } = await import("@/lib/test/helpers");
  return authMockFactory();
});
vi.mock("@/lib/db", () => ({ getDb: vi.fn() }));
vi.mock("bcryptjs", () => ({ default: { compare: vi.fn() } }));

describe("POST /api/auth/login", () => {
  beforeEach(() => vi.clearAllMocks());

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

  it("trả 400 khi thiếu email/password", async () => {
    const res = await POST(jsonReq({ email: "a@b.com" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả details cho từng field thiếu", async () => {
    const res = await POST(jsonReq({ email: "a@b.com" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.details).toHaveLength(1);
    expect(body.error.details[0].field).toBe("password");
  });

  it("trả 401 khi email không tồn tại", async () => {
    vi.mocked(getDb).mockResolvedValue(asDb(mockPool([{ recordset: [] }])));
    const res = await POST(jsonReq({ email: "x@y.com", password: "123456" }));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      error: { code: "UNAUTHENTICATED", message: expect.any(String) },
    });
  });

  it("trả 401 khi sai mật khẩu", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([
        {
          recordset: [
            { ID: 1, HoTen: "A", RoleId: 2, PasswordHash: "h", TrangThai: userStatus.Active },
          ],
        },
      ])),
    );
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
    const res = await POST(jsonReq({ email: "a@b.com", password: "wrong" }));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({
      error: { code: "UNAUTHENTICATED", message: expect.any(String) },
    });
  });

  it("trả 403 khi tài khoản bị khóa", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([
        {
          recordset: [
            { ID: 1, HoTen: "A", RoleId: 2, PasswordHash: "h", TrangThai: userStatus.Inactive },
          ],
        },
      ])),
    );
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    const res = await POST(jsonReq({ email: "a@b.com", password: "123456" }));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({
      error: { code: "ACCOUNT_LOCKED", message: expect.any(String) },
    });
  });

  it("trả 200 và set cookie khi đăng nhập thành công", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([
        {
          recordset: [
            { ID: 1, HoTen: "A", RoleId: 2, PasswordHash: "h", TrangThai: userStatus.Active },
          ],
        },
      ])),
    );
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(createToken).mockResolvedValue("jwt-token" as never);

    const res = await POST(jsonReq({ email: "a@b.com", password: "123456" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Đăng nhập thành công" });
    expect(res.cookies.get("token")?.value).toBe("jwt-token");
  });
});