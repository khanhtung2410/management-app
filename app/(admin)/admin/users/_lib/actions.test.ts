import { describe, it, expect, vi, beforeEach } from "vitest";

// -----------------------------------------------------------------------------
// Mock các module phụ thuộc (phải đứng TRƯỚC import file cần test)
// -----------------------------------------------------------------------------
vi.mock("@/lib/mock/config", () => ({
    currentMockMode: "off",
    mockMode: { off: "off", on: "on", error: "error" } as const,
    mockDelay: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/auth/server", () => ({ requireAdminPage: vi.fn() }));
vi.mock("@/lib/db", () => ({ getDb: vi.fn() }));
vi.mock("next/cache", () => ({
    revalidatePath: vi.fn(),
    updateTag: vi.fn(),
}));
vi.mock("@/constants/roles", () => ({ userRole: { USER: 1 } }));
vi.mock("@/constants/statuses", () => ({
    userStatus: { Active: 1, Inactive: 0 },
}));
vi.mock("mssql", () => ({
    default: {
        Int: {}, // được truyền nguyên, không gọi
        VarChar: vi.fn((len: number) => ({ len })),
        NVarChar: vi.fn((len: number) => ({ len })),
    },
}));

// -----------------------------------------------------------------------------
// Import sau khi mock
// -----------------------------------------------------------------------------
import { updateUserStatusAction, updateUserProfileAction } from "./actions";
import { requireAdminPage } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { userStatus } from "@/constants/statuses";

const requireAdminPageMock = vi.mocked(requireAdminPage);
const getDbMock = vi.mocked(getDb);

// -----------------------------------------------------------------------------
// Helper: mock pool có GHI LẠI câu SQL để assert
// -----------------------------------------------------------------------------
type QueryResponse = { rowsAffected?: number[]; recordset?: any[] };

function createMockPool(responses: QueryResponse[] = []) {
    let i = 0;
    const queries: string[] = [];
    const chain: any = { input: vi.fn(), query: vi.fn() };
    chain.input.mockReturnValue(chain);
    chain.query.mockImplementation((q: string) => {
        queries.push(q);
        const resp = responses[i++] ?? { rowsAffected: [0], recordset: [] };
        return Promise.resolve({
            rowsAffected: resp.rowsAffected ?? [0],
            recordset: resp.recordset ?? [],
        });
    });
    const request = vi.fn().mockReturnValue(chain);
    return { pool: { request }, chain, request, queries };
}

const AUTH_USER_ID = 999;
const validProfilePayload = {
    userId: 5,
    HoTen: "Nguyễn Văn A",
    Email: "user@example.com",
    SDT: "0912345678",
};

beforeEach(() => {
    vi.clearAllMocks();
    requireAdminPageMock.mockResolvedValue({ userId: AUTH_USER_ID } as any);
});

// =============================================================================
// (1) UPDATE phải giữ điều kiện RoleId = @userRole  ← hồi quy đã từng xảy ra
// =============================================================================
describe("updateUserStatusAction – bảo vệ điều kiện RoleId", () => {
    it("câu UPDATE chứa RoleId = @userRole (và ID = @ID)", async () => {
        const { pool, queries } = createMockPool([{ rowsAffected: [1] }]);
        getDbMock.mockResolvedValue(pool as any);

        await updateUserStatusAction(5, userStatus.Active);

        expect(queries).toHaveLength(1);
        const q = queries[0];
        expect(q).toMatch(/UPDATE\s+\[dbo\]\.\[User\]/i);
        expect(q).toMatch(/ID\s*=\s*@ID/i);
        // Đây là dòng sẽ đỏ nếu ai đó xoá RoleId khỏi WHERE:
        expect(q).toMatch(/RoleId\s*=\s*@userRole/i);
    });

    it("câu UPDATE vẫn còn RoleId khi trạng thái là Inactive", async () => {
        const { pool, queries } = createMockPool([{ rowsAffected: [1] }]);
        getDbMock.mockResolvedValue(pool as any);

        await updateUserStatusAction(5, userStatus.Inactive);

        expect(queries[0]).toMatch(/RoleId\s*=\s*@userRole/i);
    });
});

// =============================================================================
// (2) Tự đổi trạng thái của chính mình → { ok:false } và KHÔNG chạm DB
// =============================================================================
describe("updateUserStatusAction – chặn tự đổi trạng thái", () => {
    it("trả { ok: false } và không truy vấn DB", async () => {
        // Dù có sẵn pool, getDb vẫn không được gọi.
        const { pool, chain } = createMockPool([{ rowsAffected: [1] }]);
        getDbMock.mockResolvedValue(pool as any);

        const r = await updateUserStatusAction(
            AUTH_USER_ID,
            userStatus.Active
        );

        expect(r).toEqual({
            ok: false,
            error: "Không thể đổi trạng thái của chính mình",
        });
        expect(getDbMock).not.toHaveBeenCalled();
        expect(chain.query).not.toHaveBeenCalled();
    });
});

// =============================================================================
// (3) HoTen sai kiểu → { ok:false }, KHÔNG ném exception
// =============================================================================
describe("updateUserProfileAction – validate không ném exception", () => {
    it("HoTen: 123 trả { ok: false } và không chạm DB", async () => {
        // Gọi trực tiếp: nếu hàm ném, await sẽ propagate và test đỏ.
        const r = await updateUserProfileAction({
            ...validProfilePayload,
            HoTen: 123,
        });

        expect(r).toEqual({ ok: false, error: "Họ tên không hợp lệ" });
        expect(getDbMock).not.toHaveBeenCalled();
    });
});

// =============================================================================
// (4) Email trùng → { ok:false, error: "Email đã được sử dụng" }
// =============================================================================
describe("updateUserProfileAction – email trùng", () => {
    it("trả { ok: false, error: 'Email đã được sử dụng' } và dừng trước UPDATE", async () => {
        const { pool, chain } = createMockPool([
            { recordset: [{ ok: 1 }] }, // exists  → có user
            { recordset: [{ ok: 1 }] }, // dup     → email đã bị chiếm
        ]);
        getDbMock.mockResolvedValue(pool as any);

        const r = await updateUserProfileAction(validProfilePayload);

        expect(r).toEqual({ ok: false, error: "Email đã được sử dụng" });
        // Không được chạm tới câu UPDATE thứ 3:
        expect(chain.query).toHaveBeenCalledTimes(2);
    });
});

// =============================================================================
// (1') UPDATE profile cũng phải giữ RoleId = @userRole
// =============================================================================
describe("updateUserProfileAction – bảo vệ điều kiện RoleId", () => {
    it("câu UPDATE profile có RoleId = @userRole", async () => {
        const { pool, queries } = createMockPool([
            { recordset: [{ ok: 1 }] }, // exists
            { recordset: [] },          // no dup
            { rowsAffected: [1] },      // update ok
        ]);
        getDbMock.mockResolvedValue(pool as any);

        await updateUserProfileAction(validProfilePayload);

        const updateQuery = queries.find((q) =>
            /UPDATE\s+\[dbo\]\.\[User\]/i.test(q)
        );
        expect(updateQuery).toBeDefined();
        expect(updateQuery!).toMatch(/ID\s*=\s*@ID/i);
        expect(updateQuery!).toMatch(/RoleId\s*=\s*@userRole/i);
    });
});