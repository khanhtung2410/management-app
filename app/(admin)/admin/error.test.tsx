import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminError from "./error";

describe("AdminError (P1.5)", () => {
    const mockError = new Error("Database connection failed");
    const retry = vi.fn();
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        retry.mockClear();
        // Swallow expected console.error from the component's useEffect
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("hiển thị thông báo lỗi và nút thử lại", () => {
        render(<AdminError error={mockError} retry={retry} />);

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

    it("log lỗi ra console để debug", () => {
        render(<AdminError error={mockError} retry={retry} />);

        expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
    });

    it("không leak Error.message ra UI", () => {
        render(
            <AdminError
                error={new Error("boom secret db creds")}
                retry={retry}
            />,
        );

        expect(
            screen.getByText("Vui lòng thử lại hoặc liên hệ quản trị viên."),
        ).toBeTruthy();
        expect(screen.queryByText(/boom secret db creds/)).toBeNull();
    });

    it("không hiển thị mã lỗi khi digest rỗng", () => {
        render(<AdminError error={mockError} retry={retry} />);

        expect(screen.queryByText(/Mã lỗi:/)).toBeNull();
    });

    it("hiển thị digest khi có (dùng để đối chiếu server log)", () => {
        const errWithDigest = Object.assign(new Error("x"), {
            digest: "abc123",
        });

        render(<AdminError error={errWithDigest} retry={retry} />);

        expect(screen.getByText(/Mã lỗi:/)).toBeTruthy();
        expect(screen.getByText("abc123")).toBeTruthy();
    });

    it("hiển thị link về trang quản trị, trỏ đúng /admin/users", () => {
        render(<AdminError error={mockError} retry={retry} />);

        const link = screen.getByRole("link", { name: "Về trang quản trị" });
        expect(link.getAttribute("href")).toBe("/admin/users");
    });

    it("accessibility: nút là <button>, link là <a>", () => {
        render(<AdminError error={mockError} retry={retry} />);

        expect(
            screen.getByRole("button", { name: "Thử lại" }).tagName,
        ).toBe("BUTTON");
        expect(
            screen.getByRole("link", { name: "Về trang quản trị" }).tagName,
        ).toBe("A");
    });
});
