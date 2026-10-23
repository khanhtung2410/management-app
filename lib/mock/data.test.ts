import { describe, expect, it } from "vitest";
import { userRole } from "@/constants/roles";
import { STATUS_CONFIG, taskStatus } from "@/constants/statuses";
import { mockTasks, mockUser } from "./data";

describe("mock dashboard data", () => {
    it("contains enough regular users for two pages at the default page size", () => {
        const regularUsers = mockUser.filter((user) => user.RoleId === userRole.USER);

        expect(regularUsers).toHaveLength(20);
    });

    it("includes every task status supported by the status configuration", () => {
        const statuses = new Set(mockTasks.map((task) => task.TrangThai));

        expect(statuses).toEqual(new Set(Object.values(taskStatus)));
        for (const status of statuses) {
            expect(STATUS_CONFIG[status].label).toBeTruthy();
            expect(STATUS_CONFIG[status].bg).toMatch(/^#[\da-f]{6}$/i);
            expect(STATUS_CONFIG[status].color).toMatch(/^#[\da-f]{6}$/i);
        }
    });
});
