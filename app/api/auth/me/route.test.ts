import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireAuth, AccountLockedError, UnauthorizedError } from "@/lib/auth";
import { GET } from "./route";
import { authUser, req } from "@/lib/test/helpers";

vi.mock("@/lib/auth", async () => {
    const { authMockFactory } = await import("@/lib/test/helpers");
    return authMockFactory();
});

describe("GET /api/auth/me", () => {
    beforeEach(() => vi.clearAllMocks());

    it("trả 401 với isLoggedIn=false khi chưa đăng nhập", async () => {
        vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError());
        const res = await GET(req("GET", "/api/auth/me"));
        expect(res.status).toBe(401);
        expect(await res.json()).toEqual({
            error: { code: "UNAUTHENTICATED", message: expect.any(String) },
        });
    });

    it("trả 403 ACCOUNT_LOCKED khi tài khoản bị khoá", async () => {
        vi.mocked(requireAuth).mockRejectedValue(new AccountLockedError());
        const res = await GET(req("GET", "/api/auth/me"));
        expect(res.status).toBe(403);
        expect(await res.json()).toEqual({
            error: { code: "ACCOUNT_LOCKED", message: expect.any(String) },
        });
    });

    it("trả 200 với thông tin user", async () => {
        vi.mocked(requireAuth).mockResolvedValue(authUser);
        const res = await GET(req("GET", "/api/auth/me"));
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            isLoggedIn: true,
            userId: authUser.userId,
            userName: authUser.userName,
            roleId: authUser.roleId,
        });
    });
});
