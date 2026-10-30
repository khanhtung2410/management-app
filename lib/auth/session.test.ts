import { beforeEach, describe, expect, it, vi } from "vitest";
import { userRole } from "@/constants/roles";
import { userStatus } from "@/constants/statuses";
import { getDb } from "@/lib/db";
import { asDb, mockPool } from "@/lib/test/helpers";
import { AccountLockedError, UnauthorizedError } from "./errors";
import { getAuthFromRequest, type RequestLike } from "./session";
import { verifyToken } from "./token";

vi.mock("./token", () => ({ verifyToken: vi.fn() }));
vi.mock("@/lib/db", () => ({ getDb: vi.fn() }));

const payload = { userId: 7, userName: "User", roleId: userRole.USER };

function requestWith(token?: string): RequestLike {
    return {
        headers: { get: () => null },
        cookies: {
            get: (name: string) =>
                name === "token" && token ? { value: token } : undefined,
        },
    };
}

function dbReturning(recordset: Record<string, unknown>[]) {
    return asDb(mockPool([{ recordset }]));
}

describe("getAuthFromRequest", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(verifyToken).mockResolvedValue(payload);
    });

    it("ném UnauthorizedError khi không có token", async () => {
        await expect(getAuthFromRequest(requestWith())).rejects.toBeInstanceOf(
            UnauthorizedError,
        );
        expect(getDb).not.toHaveBeenCalled();
    });

    it("trả payload khi tài khoản đang hoạt động", async () => {
        vi.mocked(getDb).mockResolvedValue(
            dbReturning([{ TrangThai: userStatus.Active }]),
        );

        await expect(
            getAuthFromRequest(requestWith("valid-token")),
        ).resolves.toEqual(payload);
    });

    it("ném AccountLockedError (403) khi token hợp lệ nhưng tài khoản bị khoá", async () => {
        vi.mocked(getDb).mockResolvedValue(
            dbReturning([{ TrangThai: userStatus.Inactive }]),
        );

        const error = await getAuthFromRequest(requestWith("valid-token")).catch(
            (e: unknown) => e,
        );

        expect(error).toBeInstanceOf(AccountLockedError);
        expect((error as AccountLockedError).status).toBe(403);
    });

    it("ném UnauthorizedError khi user trong token không còn tồn tại", async () => {
        vi.mocked(getDb).mockResolvedValue(dbReturning([]));

        await expect(
            getAuthFromRequest(requestWith("valid-token")),
        ).rejects.toBeInstanceOf(UnauthorizedError);
    });
});
