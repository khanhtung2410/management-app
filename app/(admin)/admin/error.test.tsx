import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminError from "./error";

describe("AdminError (P1.5)", () => {
    const mockError = new Error("Database connection failed");
    const retry = vi.fn();

    beforeEach(() => {
        retry.mockClear();
    });

    it("hiển thị thông báo lỗi và nút thử lại", () => {
        render(<AdminError error={mockError} retry={retry} />);

        // getByText / getByRole throw nếu không tìm thấy → không cần
        // matcher "toBeInTheDocument", chỉ cần gọi không throw là đủ.
        expect(
            screen.getByText("Có lỗi xảy ra khi tải dữ liệu trang quản trị."),
        ).toBeTruthy();
        expect(
            screen.getByRole("button", { name: "Thử lại" }),
        ).toBeTruthy();
    });

    it("gọi retry khi click nút thử lại", () => {
        render(<AdminError error={mockError} retry={retry} />);

        fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));

        expect(retry).toHaveBeenCalledTimes(1);
    });

    it("không leak Error.message ra UI", () => {
        render(<AdminError error={new Error("boom secret db creds")} retry={retry} />);

        expect(
            screen.getByText("Vui lòng thử lại hoặc liên hệ quản trị viên."),
        ).toBeTruthy();
        expect(screen.queryByText(/boom secret db creds/)).toBeNull();
    });

    it("hiển thị link về trang quản trị, trỏ đúng /admin/users", () => {
        render(<AdminError error={mockError} retry={retry} />);

        const link = screen.getByRole("link", { name: "Về trang quản trị" });
        expect(link.getAttribute("href")).toBe("/admin/users");
    });

    it("accessibility: nút là <button>, link là <a>", () => {
        render(<AdminError error={mockError} retry={retry} />);

        expect(screen.getByRole("button", { name: "Thử lại" }).tagName).toBe("BUTTON");
        expect(screen.getByRole("link", { name: "Về trang quản trị" }).tagName).toBe("A");
    });

});
