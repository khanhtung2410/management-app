import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TaskList } from "./taskRow";

const emptyTasks = {
    items: [],
    errorForItem: () => null,
    onToggle: vi.fn(),
};

describe("TaskList empty state", () => {
    it("shows the default empty state in table layout", () => {
        render(
            <table>
                <tbody>
                    <TaskList {...emptyTasks} variant="table" isFiltered={false} />
                </tbody>
            </table>,
        );

        const emptyMessage = screen.getByText("Chưa có công việc nào");
        expect(emptyMessage.closest("td")?.getAttribute("colspan")).toBe("6");
    });

    it("shows a no-results message after filtering", () => {
        render(
            <TaskList {...emptyTasks} variant="card" isFiltered />,
        );

        expect(screen.getByText("Không tìm thấy công việc phù hợp")).toBeTruthy();
    });
});
