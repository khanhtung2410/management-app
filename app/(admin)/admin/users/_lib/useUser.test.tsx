import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetcher as defaultFetcher } from "@/lib/fetcher";
import type { UsersPage } from "./api";

const { fetchUsersMock } = vi.hoisted(() => ({
    fetchUsersMock: vi.fn(),
}));

vi.mock("./api", () => ({
    fetchUsers: fetchUsersMock,
    updateUser: vi.fn(),
    updateUserStatus: vi.fn(),
}));

vi.mock("./actions", () => ({
    updateUserStatusAction: vi.fn(),
    updateUserProfileAction: vi.fn(),
}));

import { useUsers } from "./useUser";

const ascendingPage: UsersPage = {
    data: [
        { ID: 1, HoTen: "Người dùng 1", Email: "one@example.com", SDT: "0900000001", TrangThai: 1 },
        { ID: 2, HoTen: "Người dùng 2", Email: "two@example.com", SDT: "0900000002", TrangThai: 1 },
    ],
    meta: { page: 1, pageSize: 10, total: 2, totalPages: 1 },
};

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