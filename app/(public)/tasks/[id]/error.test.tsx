import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TasksDetailError from "./error";

describe("TasksDetailError", () => {
    const retry = vi.fn();
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        retry.mockClear();
        consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("đặt nút thử lại và link danh sách trong cùng một nhóm điều khiển", () => {
        render(<TasksDetailError error={new Error("failed")} retry={retry} />);

        const button = screen.getByRole("button", { name: "Thử lại" });
        const link = screen.getByRole("link", { name: "Về danh sách" });

        expect(button.parentElement).toBe(link.parentElement);
        expect(link.getAttribute("href")).toBe("/tasks");
    });

    it("gọi retry khi click nút thử lại", () => {
        render(<TasksDetailError error={new Error("failed")} retry={retry} />);

        fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));

        expect(retry).toHaveBeenCalledTimes(1);
    });
});
