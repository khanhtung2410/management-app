import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDashboardSummary } from "@/lib/dashboard/get-summary";
import DashboardPage from "./page";

vi.mock("@/lib/auth/server", () => ({
    requireAdminPage: vi.fn(),
}));

vi.mock("@/lib/dashboard/get-summary", () => ({
    getDashboardSummary: vi.fn(),
}));

vi.mock("./_components/TaskStatsChart", () => ({
    default: () => <div data-testid="task-stats-chart" />,
}));

const emptySummary = {
    totalUsers: 2,
    activeUsers: 2,
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
};

describe("admin statistics empty state", () => {
    beforeEach(() => {
        vi.mocked(getDashboardSummary).mockResolvedValue(emptySummary);
    });

    it("shows an empty state instead of an empty chart and status summaries", async () => {
        render(await DashboardPage());

        expect(screen.getByText("Chưa có công việc để thống kê.")).toBeTruthy();
        expect(screen.queryByTestId("task-stats-chart")).toBeNull();
        expect(screen.queryByText("Chiếm 0% tổng số")).toBeNull();
        expect(screen.getByText("Tổng số người dùng")).toBeTruthy();
    });
});
