import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TasksError from "./error";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("TasksError", () => {
    it("shows a recoverable error and retries when requested", () => {
        const retry = vi.fn();
        vi.spyOn(console, "error").mockImplementation(() => {});

        render(
            <TasksError
                error={Object.assign(new Error("Database unavailable"), {
                    digest: "tasks-error",
                })}
                retry={retry}
            />,
        );

        expect(screen.getByRole("alert").textContent).toContain(
            "Không thể tải danh sách công việc",
        );
        expect(screen.getByText("Mã lỗi: tasks-error")).toBeTruthy();

        fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
        expect(retry).toHaveBeenCalledOnce();
    });
});
