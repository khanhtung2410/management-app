import type { TaskStatusType } from "@/constants/statuses";

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