import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DashboardError from "./error";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("DashboardError", () => {
    it("shows an error message and retries when requested", () => {
        const reset = vi.fn();
        vi.spyOn(console, "error").mockImplementation(() => {});

        render(
            <DashboardError
                error={new Error("Mock fetch failed")}
                reset={reset}
            />,
        );

        expect(screen.getByRole("alert").textContent).toContain(
            "Không thể tải thống kê",
        );
        fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));

        expect(reset).toHaveBeenCalledOnce();
    });
});
