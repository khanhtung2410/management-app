import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminError from "./error";

describe("AdminError", () => {
    const mockError = new Error("Database connection failed");
    const retry = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders error message and retry button", () => {
        render(<AdminError error={mockError} retry={retry} />);

        expect(screen.getByText("Có lỗi xảy ra khi tải dữ liệu trang quản trị.")).toBeInTheDocument();
        expect(screen.getByText("Lỗi chưa xác định")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Thử lại" })).toBeInTheDocument();
    });

    it("calls retry on button click", async () => {
        render(<AdminError error={mockError} retry={retry} />);

        const button = screen.getByRole("button", { name: "Thử lại" });
        await userEvent.click(button);

        expect(retry).toHaveBeenCalledTimes(1);
    });

    it("shows default message when error is not a string", () => {
        render(<AdminError error={null} retry={retry} />);

        expect(screen.getByText("Vui lòng thử lại hoặc liên hệ quản trị viên.")).toBeInTheDocument();
    });

    it("renders home link", () => {
        render(<AdminError error={mockError} retry={retry} />);

        expect(screen.getByRole("link", { name: "Về trang quản trị" })).toBeInTheDocument();
    });
});