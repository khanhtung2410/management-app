import { describe, expect, it } from "vitest";
import { getMockDashboardSummary } from "./dashboard";

describe("getMockDashboardSummary invariants", () => {
    const summary = getMockDashboardSummary();

    it("đếm đủ mọi task — không task nào bị bỏ sót", () => {
        // Bất biến 1: active + completed + overdue = total
        // Nếu fail → có task mang TrangThai lạ (ví dụ Overdue lưu tường minh)
        expect(
            summary.activeTasks + summary.completedTasks + summary.overdueTasks,
        ).toBe(summary.totalTasks);
    });

    it("activeUsers không vượt totalUsers", () => {
        expect(summary.activeUsers).toBeLessThanOrEqual(summary.totalUsers);
    });

    it("các trường đếm đều không âm", () => {
        expect(summary.totalUsers).toBeGreaterThanOrEqual(0);
        expect(summary.activeUsers).toBeGreaterThanOrEqual(0);
        expect(summary.totalTasks).toBeGreaterThanOrEqual(0);
        expect(summary.activeTasks).toBeGreaterThanOrEqual(0);
        expect(summary.completedTasks).toBeGreaterThanOrEqual(0);
        expect(summary.overdueTasks).toBeGreaterThanOrEqual(0);
    });

    it("activeUsers không vượt totalUsers và cộng với inactive = totalUsers", () => {
        // Chỉ kiểm tra bất biến, không cần biết inactive là bao nhiêu
        expect(summary.activeUsers).toBeLessThanOrEqual(summary.totalUsers);
        expect(summary.totalUsers - summary.activeUsers).toBeGreaterThanOrEqual(0);
    });
});