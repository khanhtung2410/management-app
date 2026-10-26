import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { setCurrentPage, mockState, mockViewport } = vi.hoisted(() => ({
    setCurrentPage: vi.fn(),
    mockState: {
        status: "error" as string,
        message: "Lỗi tải dữ liệu",
        data: [] as never[],
        total: 0,
        totalPages: 0,
    },
    mockViewport: { isDesktop: false },
}));

vi.mock("./_lib/useUser", () => ({
    useUsers: () => ({
        state: mockState,
        processingIds: new Set<number>(),
        sort: "asc",
        currentPage: 3,
        setCurrentPage,
        toggleSort: vi.fn(),
        toggleStatus: vi.fn(),
        saveUser: vi.fn(),
        actionError: null,
        clearActionError: vi.fn(),
    }),
}));

vi.mock("@/hooks/useMediaQuery", () => ({
    useMediaQuery: () => mockViewport.isDesktop,
}));

import UserList from "./page";

describe("UserList search pagination", () => {
    beforeEach(() => {
        setCurrentPage.mockClear();
        Object.assign(mockState, {
            status: "error",
            message: "Lỗi tải dữ liệu",
            data: [],
            total: 0,
            totalPages: 0,
        });
        mockViewport.isDesktop = false;
    });

    it("returns to page 1 when typing a search term from page 3", () => {
        render(<UserList />);

        fireEvent.change(screen.getByLabelText("Tìm kiếm"), {
            target: { value: "keyword" },
        });

        expect(setCurrentPage).toHaveBeenCalledWith(1);
    });

    it("shows a visible empty row when a search has no matching users", () => {
        Object.assign(mockState, {
            status: "success",
            data: [],
            total: 0,
            totalPages: 0,
        });
        mockViewport.isDesktop = true;

        render(<UserList />);
        fireEvent.change(screen.getByLabelText("Tìm kiếm"), {
            target: { value: "missing-user" },
        });

        const emptyMessage = screen.getByText(
            "Không tìm thấy người dùng phù hợp",
        );
        expect(emptyMessage.closest("tr")).toBeTruthy();
        expect(emptyMessage.closest("td")?.getAttribute("colspan")).toBe("6");
    });

    it("shows an empty state when there are no users and no search term", () => {
        Object.assign(mockState, {
            status: "success",
            data: [],
            total: 0,
            totalPages: 0,
        });

        render(<UserList />);

        expect(screen.getByText("Chưa có người dùng nào")).toBeTruthy();
    });
});
