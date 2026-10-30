import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetcher as defaultFetcher } from "@/lib/fetcher";
import type { UsersPage } from "./api";

const { fetchUsersMock, updateUserProfileActionMock } = vi.hoisted(() => ({
    fetchUsersMock: vi.fn(),
    updateUserProfileActionMock: vi.fn(),
}));

vi.mock("./api", () => ({
    fetchUsers: fetchUsersMock,
    updateUser: vi.fn(),
    updateUserStatus: vi.fn(),
}));

vi.mock("./actions", () => ({
    updateUserStatusAction: vi.fn(),
    updateUserProfileAction: updateUserProfileActionMock,
}));

import { useUsers } from "./useUser";

const ascendingPage: UsersPage = {
    data: [
        { ID: 1, HoTen: "Người dùng 1", Email: "one@example.com", SDT: "0900000001", TrangThai: 1 },
        { ID: 2, HoTen: "Người dùng 2", Email: "two@example.com", SDT: "0900000002", TrangThai: 1 },
    ],
    meta: { page: 1, pageSize: 10, total: 2, totalPages: 1 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Sorting (giữ nguyên)
// ─────────────────────────────────────────────────────────────────────────────

describe("useUsers sorting", () => {
    beforeEach(() => {
        fetchUsersMock.mockReset();
    });

    it("keeps the current list visible until the sorted list is ready", async () => {
        let resolveSortedPage!: (page: UsersPage) => void;
        fetchUsersMock
            .mockResolvedValueOnce(ascendingPage)
            .mockImplementationOnce(
                () =>
                    new Promise<UsersPage>((resolve) => {
                        resolveSortedPage = resolve;
                    }),
            );

        const { result } = renderHook(() => useUsers());

        await waitFor(() => {
            expect(result.current.state.status).toBe("success");
        });
        expect(fetchUsersMock).toHaveBeenLastCalledWith(
            expect.any(Object),
            defaultFetcher,
        );

        const originalState = result.current.state;
        if (originalState.status !== "success") {
            throw new Error("Expected users to load successfully");
        }

        act(() => {
            result.current.toggleSort();
        });

        expect(result.current.state).toBe(originalState);

        await act(async () => {
            resolveSortedPage({ ...ascendingPage, data: [...ascendingPage.data].reverse() });
        });

        await waitFor(() => {
            expect(result.current.state).toMatchObject({
                status: "success",
                data: [...ascendingPage.data].reverse(),
            });
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// saveUser (P1.2) — state phải dùng result.data, không dùng payload gốc
// ─────────────────────────────────────────────────────────────────────────────

describe("useUsers — saveUser state update (P1.2)", () => {
    beforeEach(() => {
        fetchUsersMock.mockReset();
        updateUserProfileActionMock.mockReset();
    });

    async function setupLoaded() {
        fetchUsersMock.mockResolvedValueOnce(ascendingPage);
        const hook = renderHook(() => useUsers());
        await waitFor(() => {
            expect(hook.result.current.state.status).toBe("success");
        });
        return hook.result;
    }

    function findUser(state: typeof ascendingPage.data, id: number) {
        return state.find((u) => u.ID === id);
    }

    it("cập nhật state bằng data đã chuẩn hoá từ server, không dùng payload gốc", async () => {
        const result = await setupLoaded();
        if (result.current.state.status !== "success") {
            throw new Error("Expected state to be success");
        }

        // Server trả data đã trim + lowercase email
        updateUserProfileActionMock.mockResolvedValue({
            ok: true,
            data: {
                ID: 1,
                HoTen: "Nguyễn Văn A",  // đã trim
                Email: "a@b.com",        // đã lowercase
                SDT: "0901234567",       // đã trim
                TrangThai: 1,
            },
        });

        await act(async () => {
            await result.current.saveUser({
                userId: 1,
                HoTen: "  Nguyễn Văn A  ",
                Email: " A@B.COM ",
                SDT: " 0901234567 ",
            });
        });

        // Action được gọi với payload raw (đúng như client gửi)
        expect(updateUserProfileActionMock).toHaveBeenCalledWith({
            userId: 1,
            HoTen: "  Nguyễn Văn A  ",
            Email: " A@B.COM ",
            SDT: " 0901234567 ",
        });

        // NHƯNG state phải là data đã chuẩn hoá từ server
        if (result.current.state.status !== "success") {
            throw new Error("Expected state to remain success");
        }
        const updated = findUser(result.current.state.data, 1);

        expect(updated).toBeDefined();
        expect(updated?.Email).toBe("a@b.com");       // ← không phải " A@B.COM "
        expect(updated?.HoTen).toBe("Nguyễn Văn A");   // ← không phải "  Nguyễn Văn A  "
        expect(updated?.SDT).toBe("0901234567");       // ← không phải " 0901234567 "
    });

    it("giữ nguyên field khác của user khi merge data từ server", async () => {
        const result = await setupLoaded();
        if (result.current.state.status !== "success") {
            throw new Error("Expected state to be success");
        }

        // Server chỉ trả 3 field vừa update — không có TrangThai
        updateUserProfileActionMock.mockResolvedValue({
            ok: true,
            data: {
                ID: 1,
                HoTen: "A",
                Email: "a@b.com",
                SDT: "0901234567",
            },
        });

        await act(async () => {
            await result.current.saveUser({
                userId: 1,
                HoTen: "A",
                Email: "a@b.com",
                SDT: "0901234567",
            });
        });

        if (result.current.state.status !== "success") {
            throw new Error("Expected state to remain success");
        }
        const updated = findUser(result.current.state.data, 1);

        // TrangThai vẫn phải còn từ lần load đầu (merge, không replace)
        expect(updated?.TrangThai).toBe(1);
    });

    it("throw Error khi action trả lỗi, không đổi state", async () => {
        const result = await setupLoaded();
        if (result.current.state.status !== "success") {
            throw new Error("Expected state to be success");
        }
        const beforeState = result.current.state;

        updateUserProfileActionMock.mockResolvedValue({
            ok: false,
            error: "Email đã tồn tại",
        });

        let caughtError: Error | undefined;
        try {
            await act(async () => {
                await result.current.saveUser({
                    userId: 1,
                    HoTen: "A",
                    Email: "a@b.com",
                    SDT: "0901234567",
                });
            });
        } catch (e) {
            caughtError = e as Error;
        }

        expect(caughtError?.message).toBe("Email đã tồn tại");
        // State không được đổi khi action fail
        expect(result.current.state).toBe(beforeState);
    });
});
