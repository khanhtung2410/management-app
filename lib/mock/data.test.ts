import { describe, expect, it } from "vitest";
import { userRole } from "@/constants/roles";
import { STATUS_CONFIG, taskStatus } from "@/constants/statuses";
import { mockTasks, mockUser } from "./data";

describe("mock dashboard data", () => {
    it("contains enough regular users for two pages at the default page size", () => {
        const regularUsers = mockUser.filter((user) => user.RoleId === userRole.USER);
        expect(regularUsers).toHaveLength(20);
    });

    // ─── Trạng thái lưu trữ: chỉ Active / Complete ───────────────────
    it("only stores persistable task statuses (Active, Complete)", () => {
        const storedStatuses = new Set(mockTasks.map((task) => task.TrangThai));
        const persistable = new Set([taskStatus.Active, taskStatus.Complete]);

        expect(storedStatuses).not.toContain(taskStatus.Overdue);
        for (const status of storedStatuses) {
            expect(persistable).toContain(status);
        }
    });

    // ─── STATUS_CONFIG: đủ 3 entry cho UI ───────────────────────────
    it("provides UI config for every displayable status (including derived Overdue)", () => {
        const displayable = [
            taskStatus.Active,
            taskStatus.Complete,
            taskStatus.Overdue,
        ];

        for (const status of displayable) {
            const config = STATUS_CONFIG[status];
            expect(config).toBeDefined();
            expect(config.label).toBeTruthy();
            expect(config.bg).toMatch(/^#[\da-f]{6}$/i);
            expect(config.color).toMatch(/^#[\da-f]{6}$/i);
        }
    });

    // ─── Có task "nên hiển thị Overdue" — qua suy luận ──────────────
    it("contains at least one task that derives to Overdue", () => {
        const now = new Date();
        const derivedOverdue = mockTasks.filter(
            (t) => t.TrangThai === taskStatus.Active && new Date(t.HetHan) < now,
        );
        expect(derivedOverdue.length).toBeGreaterThan(0);
    });

    // ─── Bất biến: mọi task đều được đếm trong summary ──────────────
    it("has no tasks that would be missed by the summary calculation", () => {
        const now = new Date();
        const counted = mockTasks.filter(
            (t) =>
                t.TrangThai === taskStatus.Active ||
                t.TrangThai === taskStatus.Complete,
        );
        expect(counted.length).toBe(mockTasks.length);
    });
});