import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { POST } from "./route";
import { asDb, jsonReq, mockPool } from "@/lib/test/helpers";

vi.mock("@/lib/db", () => ({ getDb: vi.fn() }));
vi.mock("bcryptjs", () => ({ default: { hash: vi.fn() } }));

describe("POST /api/auth/register", () => {
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

  it("trả 400 khi thiếu field bắt buộc", async () => {
    const res = await POST(jsonReq({ HoTen: "A" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả 400 khi HoTen < 2 ký tự", async () => {
    const res = await POST(
      jsonReq({ HoTen: "A", Email: "a@b.com", password: "123456" }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả 400 khi Email sai format", async () => {
    const res = await POST(
      jsonReq({ HoTen: "An", Email: "not-email", password: "123456" }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả 400 khi password < 6", async () => {
    const res = await POST(
      jsonReq({ HoTen: "An", Email: "a@b.com", password: "123" }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
  });

  it("trả 409 khi email đã tồn tại", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([{ recordset: [{ found: 1 }] }])),
    );
    const res = await POST(
      jsonReq({ HoTen: "An", Email: "a@b.com", password: "123456" }),
    );
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({
      error: { code: "CONFLICT", message: expect.any(String) },
    });
  });

  it("trả 201 khi đăng ký thành công", async () => {
    vi.mocked(getDb).mockResolvedValue(
      asDb(mockPool([
        { recordset: [] }, // check exists
        { recordset: [{ ID: 1, HoTen: "An", Email: "a@b.com" }] },
      ])),
    );
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed" as never);

    const res = await POST(
      jsonReq({ HoTen: "An", Email: "a@b.com", SDT: "090", password: "123456" }),
    );
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({
      message: "Đăng ký thành công",
      user: { ID: 1, HoTen: "An", Email: "a@b.com" },
    });
  });
});