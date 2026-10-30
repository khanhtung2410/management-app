import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
    AccountLockedError,
    UnauthorizedError,
    requireAuth,
} from "@/lib/auth";
import { authAdmin, authUser } from "@/lib/test/helpers";
import { proxy } from "./proxy";

vi.mock("@/lib/auth", async () => {
    const { authMockFactory } = await import("@/lib/test/helpers");
    return authMockFactory();
});

function request(path: string) {
    return new NextRequest(`http://localhost${path}`, {
        headers: { cookie: "token=stale" },
    });
}

function setsTokenCookie(res: Response): boolean {
    return res.headers.getSetCookie().some((c) => c.startsWith("token="));
}

describe("proxy", () => {
    beforeEach(() => vi.clearAllMocks());

    it("chưa đăng nhập → /login và xoá cookie", async () => {
        vi.mocked(requireAuth).mockRejectedValue(new UnauthorizedError());

        const res = await proxy(request("/tasks"));

        expect(res.status).toBe(307);
        expect(res.headers.get("location")).toBe("http://localhost/login");
        expect(setsTokenCookie(res)).toBe(true);
    });

    it("tài khoản bị khoá → /login và xoá cookie (không phải /403)", async () => {
        vi.mocked(requireAuth).mockRejectedValue(new AccountLockedError());

        const res = await proxy(request("/tasks"));

        expect(res.status).toBe(307);
        expect(res.headers.get("location")).toBe("http://localhost/login");
        expect(setsTokenCookie(res)).toBe(true);
    });

    it("sai role ở khu vực admin → /403 và giữ cookie", async () => {
        vi.mocked(requireAuth).mockResolvedValue(authUser);

        const res = await proxy(request("/admin"));

        expect(res.status).toBe(307);
        expect(res.headers.get("location")).toBe("http://localhost/403");
        expect(setsTokenCookie(res)).toBe(false);
    });

    it("tài khoản bị khoá ở /login → cho vào trang login và xoá cookie", async () => {
        vi.mocked(requireAuth).mockRejectedValue(new AccountLockedError());

        const res = await proxy(request("/login"));

        expect(res.status).toBe(200);
        expect(setsTokenCookie(res)).toBe(true);
    });

    it("đã đăng nhập ở /login → chuyển về trang chủ", async () => {
        vi.mocked(requireAuth).mockResolvedValue(authAdmin);

        const res = await proxy(request("/login"));

        expect(res.status).toBe(307);
        expect(res.headers.get("location")).toBe("http://localhost/");
    });
});
