import { userRole } from "@/constants/roles";
import {
    taskStatus,
    userStatus,
    type TaskStatusType,
} from "@/constants/statuses";
import { mockTasks, mockUser } from "./data";

export interface DashboardSummary {
    totalUsers: number;
    activeUsers: number;
    totalTasks: number;
    activeTasks: number;
    completedTasks: number;
    overdueTasks: number;
}

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

    return {
        totalUsers: regularUsers.length,
        activeUsers: regularUsers.filter(
            (user) => user.TrangThai === userStatus.Active,
        ).length,
        totalTasks: mockTasks.length,
        activeTasks: mockTasks.filter(
            (task) => task.TrangThai === taskStatus.Active,
        ).length,
        completedTasks: mockTasks.filter(
            (task) => task.TrangThai === taskStatus.Complete,
        ).length,
        overdueTasks: mockTasks.filter(
            (task) => task.TrangThai === taskStatus.Overdue,
        ).length,
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
