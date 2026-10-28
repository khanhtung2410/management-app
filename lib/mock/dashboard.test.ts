import { beforeEach, describe, expect, it } from "vitest";
import { userRole } from "@/constants/roles";
import { taskStatus, userStatus } from "@/constants/statuses";
import { mockTasks, mockUser } from "./data";
import {
    getMockDashboardSummary,
    getMockRecentDashboardTasks,
} from "./dashboard";
import type { DashboardSummary } from "@/lib/dashboard/types";

let summary: DashboardSummary;
beforeEach(() => { summary = getMockDashboardSummary(); });

describe("getMockDashboardSummary — giá trị chính xác", () => {
    it("khớp với seed data hiện tại", () => {
        const now = new Date();
        const regularUsers = mockUser.filter(u => u.RoleId === userRole.USER);

        expect(summary).toEqual({
            totalUsers: regularUsers.length,
            activeUsers: regularUsers.filter(u => u.TrangThai === userStatus.Active).length,
            totalTasks: mockTasks.length,
            activeTasks: mockTasks.filter(
                t => t.TrangThai === taskStatus.Active && new Date(t.HetHan) >= now,
            ).length,
            completedTasks: mockTasks.filter(t => t.TrangThai === taskStatus.Complete).length,
            overdueTasks: mockTasks.filter(
                t => t.TrangThai === taskStatus.Active && new Date(t.HetHan) < now,
            ).length,
        });
    });
});

describe("getMockDashboardSummary — invariants", () => {
    it("active + completed + overdue = total (không task nào bị bỏ sót)", () => {
        // Fail → có task mang TrangThai lạ (Overdue lưu tường minh, Pending, ...)
        expect(
            summary.activeTasks + summary.completedTasks + summary.overdueTasks,
        ).toBe(summary.totalTasks);
    });

    it("activeUsers nằm trong [0, totalUsers]", () => {
        expect(summary.activeUsers).toBeGreaterThanOrEqual(0);
        expect(summary.activeUsers).toBeLessThanOrEqual(summary.totalUsers);
    });

    it("mọi trường đếm đều không âm", () => {
        for (const [k, v] of Object.entries(summary)) {
            expect(v, `${k} phải >= 0`).toBeGreaterThanOrEqual(0);
        }
    });
});

describe("getMockRecentDashboardTasks", () => {
    it("trả tối đa 5 task, ID giảm dần", () => {
        const tasks = getMockRecentDashboardTasks();
        expect(tasks.length).toBeLessThanOrEqual(5);
        const ids = tasks.map(t => t.ID);
        expect([...ids].sort((a, b) => b - a)).toEqual(ids);
    });

    it("HoTen là string không rỗng hoặc null", () => {
        for (const task of getMockRecentDashboardTasks()) {
            if (task.HoTen !== null) {
                expect(task.HoTen.length).toBeGreaterThan(0);
            }
        }
    });
});