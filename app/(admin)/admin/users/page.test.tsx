import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { setCurrentPage } = vi.hoisted(() => ({
    setCurrentPage: vi.fn(),
}));

vi.mock("./useUser", () => ({
    useUsers: () => ({
        state: { status: "error", message: "Lỗi tải dữ liệu" },
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
    useMediaQuery: () => false,
}));

import UserList from "./page";

describe("UserList search pagination", () => {
    beforeEach(() => {
        setCurrentPage.mockClear();
    });

    it("returns to page 1 when typing a search term from page 3", () => {
        render(<UserList />);

        fireEvent.change(screen.getByLabelText("Tìm kiếm"), {
            target: { value: "keyword" },
        });

        expect(setCurrentPage).toHaveBeenCalledWith(1);
    });
});
