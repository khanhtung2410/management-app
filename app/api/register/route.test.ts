import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { POST } from "./route";
import { asDb, jsonReq, mockPool } from "@/lib/test/helpers";

vi.mock("@/lib/db", () => ({ getDb: vi.fn() }));
vi.mock("bcryptjs", () => ({ default: { hash: vi.fn() } }));

const getDbMock = vi.mocked(getDb);
const bcryptHashMock = vi.mocked(bcrypt.hash);

// Payload hợp lệ theo validator BT13.2:
//   - HoTen: 1–255 ký tự
//   - Email: regex chặt, TLD ≥ 2
//   - SDT: ^0\d{9}$ (10 số, bắt đầu 0) — KHÔNG phải "090"
const valid = {
  HoTen: "An",
  Email: "a@b.com",
  SDT: "0912345678",
  password: "123456",
};

// Mock pool có khả năng ném lỗi SQL (mã 2627/2601) để test race condition.
type Step =
  | { recordset?: unknown[]; rowsAffected?: number[] }
  | { throwNumber: number };

function mockPoolThrowing(steps: Step[]) {
  let i = 0;
  const chain: {
    input: ReturnType<typeof vi.fn>;
    query: ReturnType<typeof vi.fn>;
  } = { input: vi.fn(), query: vi.fn() };
  chain.input.mockReturnValue(chain);
  chain.query.mockImplementation(() => {
    const s = steps[i++] ?? { rowsAffected: [0], recordset: [] };
    if ("throwNumber" in s) {
      return Promise.reject(
        Object.assign(new Error("SQL error"), { number: s.throwNumber }),
      );
    }
    return Promise.resolve({
      rowsAffected: s.rowsAffected ?? [0],
      recordset: s.recordset ?? [],
    });
  });
  return { request: vi.fn().mockReturnValue(chain) };
}

describe("POST /api/auth/register", () => {
  beforeEach(() => vi.clearAllMocks());

  // ─── JSON / body ───
  // badRequest/INVALID_JSON không có details → toEqual vẫn khớp.
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

  // ─── Validation (validator trả kèm details[]) ───
  // Dùng toMatchObject để không phụ thuộc số lượng details cụ thể.
  it.each([
    ["thiếu HoTen", { ...valid, HoTen: undefined }],
    ["thiếu Email", { ...valid, Email: undefined }],
    ["thiếu SDT (full mode bắt buộc)", { ...valid, SDT: undefined }],
    ["HoTen rỗng", { ...valid, HoTen: "   " }],
    ["Email rỗng", { ...valid, Email: "" }],
    ["SDT rỗng (full mode bắt buộc)", { ...valid, SDT: "" }],
  ])("trả 400 khi %s", async (_d, body) => {
    const res = await POST(jsonReq(body));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({
      error: {
        code: "VALIDATION_ERROR",
        message: "Dữ liệu không hợp lệ",
        details: expect.any(Array),
      },
    });
    expect(getDbMock).not.toHaveBeenCalled();
  });

  it.each([
    ["TLD 1 ký tự", "a@b.c"],
    ["thiếu @", "not-email"],
    ["có khoảng trắng", "a @b.com"],
    ["hai @", "a@@b.com"],
  ])("trả 400 khi Email sai format (%s)", async (_d, email) => {
    const res = await POST(jsonReq({ ...valid, Email: email }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({
      error: { code: "VALIDATION_ERROR" },
    });
    expect(getDbMock).not.toHaveBeenCalled();
  });

  it.each([
    ["thiếu số", "091234567"],
    ["thừa số", "09123456789"],
    ["không bắt đầu 0", "1912345678"],
    ["có chữ", "091234567a"],
  ])("trả 400 khi SDT sai format (%s)", async (_d, sdt) => {
    const res = await POST(jsonReq({ ...valid, SDT: sdt }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({
      error: { code: "VALIDATION_ERROR" },
    });
    expect(getDbMock).not.toHaveBeenCalled();
  });

  it("trả 400 khi password < 6 (sau khi user fields hợp lệ)", async () => {
    const res = await POST(jsonReq({ ...valid, password: "123" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({
      error: { code: "VALIDATION_ERROR", message: expect.any(String) },
    });
    expect(getDbMock).not.toHaveBeenCalled();
  });

  // ─── Conflict từ pre-check ───
  // conflict() không kèm details → toEqual vẫn khớp.
  it("trả 409 khi email đã tồn tại (pre-check)", async () => {
    getDbMock.mockResolvedValue(
      asDb(mockPool([{ recordset: [{ found: 1 }] }])),
    );
    const res = await POST(jsonReq(valid));
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({
      error: { code: "CONFLICT", message: expect.any(String) },
    });
  });

  // ─── Conflict từ race condition (T13.1 / BT13.2 mở rộng) ───
  it("trả 409 khi INSERT vi phạm UQ_User_Email (2627)", async () => {
    getDbMock.mockResolvedValue(
      asDb(
        mockPoolThrowing([
          { recordset: [] },       // exists: rỗng (pass pre-check)
          { throwNumber: 2627 },   // INSERT: race → vi phạm unique
        ]),
      ),
    );
    bcryptHashMock.mockResolvedValue("hashed" as never);

    const res = await POST(jsonReq(valid));
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({
      error: { code: "CONFLICT", message: expect.any(String) },
    });
  });

  it("trả 409 khi INSERT vi phạm unique index (2601)", async () => {
    getDbMock.mockResolvedValue(
      asDb(
        mockPoolThrowing([
          { recordset: [] },
          { throwNumber: 2601 },
        ]),
      ),
    );
    bcryptHashMock.mockResolvedValue("hashed" as never);

    const res = await POST(jsonReq(valid));
    expect(res.status).toBe(409);
  });

  it("lỗi SQL khác 2627/2601 → 500 (không nhầm thành 409)", async () => {
    getDbMock.mockResolvedValue(
      asDb(
        mockPoolThrowing([
          { recordset: [] },
          { throwNumber: 50000 },
        ]),
      ),
    );
    bcryptHashMock.mockResolvedValue("hashed" as never);

    const res = await POST(jsonReq(valid));
    expect(res.status).toBe(500);
  });

  // ─── Thành công ───
  it("trả 201 khi đăng ký thành công", async () => {
    getDbMock.mockResolvedValue(
      asDb(
        mockPool([
          { recordset: [] }, // exists: rỗng
          { recordset: [{ ID: 1, HoTen: "An", Email: "a@b.com" }] }, // INSERT OUTPUT
        ]),
      ),
    );
    bcryptHashMock.mockResolvedValue("hashed" as never);

    const res = await POST(jsonReq(valid));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({
      message: "Đăng ký thành công",
      user: { ID: 1, HoTen: "An", Email: "a@b.com" },
    });
  });

  it("HoTen 1 ký tự vẫn 201 (min 1, đồng bộ với PATCH/action)", async () => {
    getDbMock.mockResolvedValue(
      asDb(
        mockPool([
          { recordset: [] },
          { recordset: [{ ID: 1, HoTen: "A", Email: "a@b.com" }] },
        ]),
      ),
    );
    bcryptHashMock.mockResolvedValue("hashed" as never);

    const res = await POST(jsonReq({ ...valid, HoTen: "A" }));
    expect(res.status).toBe(201);
  });

  it("email được lowercase trước pre-check và INSERT", async () => {
    const capturedEmails: unknown[] = [];
    const chain: {
      input: ReturnType<typeof vi.fn>;
      query: ReturnType<typeof vi.fn>;
    } = { input: vi.fn(), query: vi.fn() };
    chain.input.mockImplementation(
      (name: string, _t: unknown, value: unknown) => {
        if (name === "Email") capturedEmails.push(value);
        return chain;
      },
    );
    chain.query
      .mockResolvedValueOnce({ recordset: [] })
      .mockResolvedValueOnce({
        recordset: [{ ID: 1, HoTen: "An", Email: "user@example.com" }],
      });
    getDbMock.mockResolvedValue(
      asDb({ request: vi.fn().mockReturnValue(chain) }),
    );
    bcryptHashMock.mockResolvedValue("hashed" as never);

    const res = await POST(
      jsonReq({ ...valid, Email: "  USER@Example.COM  " }),
    );
    expect(res.status).toBe(201);
    expect(capturedEmails.length).toBeGreaterThanOrEqual(2);
    expect(capturedEmails.every((v) => v === "user@example.com")).toBe(true);
  });
});