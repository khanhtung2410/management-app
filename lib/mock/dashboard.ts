import { userRole } from "@/constants/roles";
import {
    taskStatus,
    userStatus,
    type TaskStatusType,
} from "@/constants/statuses";
import { mockTasks, mockUser } from "./data";
import type { DashboardSummary } from "@/lib/dashboard/types";

export type { DashboardSummary };


export interface DashboardTask {
    ID: number;
    Ten: string;
    HoTen: string | null;
    HetHan: string;
    TrangThai: TaskStatusType;
}

export function getMockDashboardSummary(): DashboardSummary {
    const regularUsers = mockUser.filter(
        (user) => user.RoleId === userRole.USER,
    );

    const now = new Date();

    // Active + còn hạn  (SQL: TrangThai=Active AND HetHan >= GETDATE())
    const activeTasks = mockTasks.filter(
        (t) =>
            t.TrangThai === taskStatus.Active &&
            new Date(t.HetHan) >= now,
    ).length;

    // Active + quá hạn  (SQL: TrangThai=Active AND HetHan < GETDATE())
    const overdueTasks = mockTasks.filter(
        (t) =>
            t.TrangThai === taskStatus.Active &&
            new Date(t.HetHan) < now,
    ).length;

    return {
        totalUsers: regularUsers.length,
        activeUsers: regularUsers.filter(
            (u) => u.TrangThai === userStatus.Active,
        ).length,
        totalTasks: mockTasks.length,
        activeTasks,
        completedTasks: mockTasks.filter(
            (t) => t.TrangThai === taskStatus.Complete,
        ).length,
        overdueTasks,
    };
}

export function getMockRecentDashboardTasks(): DashboardTask[] {
    return [...mockTasks]
        .sort((a, b) => b.ID - a.ID)
        .slice(0, 5)
        .map((task) => ({
            ID: task.ID,
            Ten: task.Ten,
            HoTen:
                mockUser.find((user) => user.ID === task.UserID)?.HoTen ?? null,
            HetHan: task.HetHan,
            TrangThai: task.TrangThai,
        }));
}
