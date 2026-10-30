import { beforeEach, describe, expect, it, vi } from "vitest";

const { cookiesMock, headersMock, getAuthFromRequestMock, redirectMock } = vi.hoisted(() => ({
    cookiesMock: vi.fn(),
    headersMock: vi.fn(),
    getAuthFromRequestMock: vi.fn(),
    redirectMock: vi.fn((url: string) => {
        throw new Error(`NEXT_REDIRECT:${url}`);
    }),
}));

vi.mock("next/headers", () => ({
    cookies: cookiesMock,
    headers: headersMock,
}));

vi.mock("next/navigation", () => ({
    redirect: redirectMock,
}));

vi.mock("./session", () => ({
    getAuthFromRequest: getAuthFromRequestMock,
}));

vi.mock("./errors", async () => {
    const actual = await vi.importActual<typeof import("./errors")>("./errors");
    return actual;
});

import { AccountLockedError, UnauthorizedError } from "./errors";
import { userRole } from "@/constants/roles";
import {
    getAuth,
    requireAdminPage,
    requireAuthPage,
    requireUserPage,
} from "./server";

const validPayload = {
    userId: 1,
    email: "admin@example.com",
    roleId: userRole.ADMIN,
};

beforeEach(() => {
    vi.clearAllMocks();
    cookiesMock.mockResolvedValue({ get: () => ({ value: "token" }) });
    headersMock.mockResolvedValue(new Headers());
});

describe("getAuth", () => {
    it("trả payload khi session hợp lệ", async () => {
        getAuthFromRequestMock.mockResolvedValue(validPayload);
        await expect(getAuth()).resolves.toEqual(validPayload);
    });

    it("trả null khi UnauthorizedError", async () => {
        getAuthFromRequestMock.mockRejectedValue(new UnauthorizedError());
        await expect(getAuth()).resolves.toBeNull();
    });

    it("trả null khi AccountLockedError (không ném 500)", async () => {
        getAuthFromRequestMock.mockRejectedValue(new AccountLockedError());
        await expect(getAuth()).resolves.toBeNull();
    });

    it("ném lại lỗi khác (không nuốt DB error)", async () => {
        getAuthFromRequestMock.mockRejectedValue(new Error("DB down"));
        await expect(getAuth()).rejects.toThrow("DB down");
    });
});

describe("requireAuthPage (P1.6)", () => {
    it("redirect /login khi không có session", async () => {
        getAuthFromRequestMock.mockRejectedValue(new UnauthorizedError());
        await expect(requireAuthPage()).rejects.toThrow("NEXT_REDIRECT:/login");
        expect(redirectMock).toHaveBeenCalledWith("/login");
    });

    it("redirect /login khi tài khoản bị khoá (trước đây page vẫn render)", async () => {
        getAuthFromRequestMock.mockRejectedValue(new AccountLockedError());
        await expect(requireAuthPage()).rejects.toThrow("NEXT_REDIRECT:/login");
        expect(redirectMock).toHaveBeenCalledWith("/login");
    });

    it("trả payload khi Active + role USER", async () => {
        getAuthFromRequestMock.mockResolvedValue({
            ...validPayload,
            roleId: userRole.USER,
        });
        await expect(requireAuthPage()).resolves.toMatchObject({
            roleId: userRole.USER,
        });
    });
});

describe("requireAdminPage (P1.6)", () => {
    it("redirect /login khi tài khoản bị khoá (defense-in-depth)", async () => {
        getAuthFromRequestMock.mockRejectedValue(new AccountLockedError());
        await expect(requireAdminPage()).rejects.toThrow("NEXT_REDIRECT:/login");
    });

    it("redirect /login khi token hỏng", async () => {
        getAuthFromRequestMock.mockRejectedValue(new UnauthorizedError());
        await expect(requireAdminPage()).rejects.toThrow("NEXT_REDIRECT:/login");
    });

    it("redirect /403 khi role không phải ADMIN", async () => {
        getAuthFromRequestMock.mockResolvedValue({
            ...validPayload,
            roleId: userRole.USER,
        });
        await expect(requireAdminPage()).rejects.toThrow("NEXT_REDIRECT:/403");
        expect(redirectMock).toHaveBeenCalledWith("/403");
    });

    it("trả payload khi ADMIN + Active", async () => {
        getAuthFromRequestMock.mockResolvedValue(validPayload);
        await expect(requireAdminPage()).resolves.toEqual(validPayload);
    });
});

describe("requireUserPage (P1.6)", () => {
    it("redirect /login khi tài khoản bị khoá", async () => {
        getAuthFromRequestMock.mockRejectedValue(new AccountLockedError());
        await expect(requireUserPage()).rejects.toThrow("NEXT_REDIRECT:/login");
    });

    it("redirect /403 khi role ADMIN", async () => {
        getAuthFromRequestMock.mockResolvedValue(validPayload);
        await expect(requireUserPage()).rejects.toThrow("NEXT_REDIRECT:/403");
    });

    it("trả payload khi USER + Active", async () => {
        getAuthFromRequestMock.mockResolvedValue({
            ...validPayload,
            roleId: userRole.USER,
        });
        await expect(requireUserPage()).resolves.toMatchObject({
            roleId: userRole.USER,
        });
    });
});
