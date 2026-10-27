import "server-only";
import sql from "mssql";
import { cacheLife, cacheTag } from "next/cache";
import { taskStatus, userStatus } from "@/constants/statuses";
import { userRole } from "@/constants/roles";
import { getDb } from "@/lib/db";
import { getMockDashboardSummary } from "@/lib/mock/dashboard";
import { currentMockMode, mockMode, mockDelay } from "@/lib/mock/config";
import type { DashboardSummary } from "./types";

export type { DashboardSummary } from "./types"

// ─── Cached: chỉ chạy ở real mode ──────────────────────────────────
async function getRealDashboardSummary(): Promise<DashboardSummary> {
    "use cache";
    cacheLife("minutes");
    cacheTag("dashboard-summary");

    const pool = await getDb();
    const [userResult, taskResult] = await Promise.all([
        pool
            .request()
            .input("userRole", sql.Int, userRole.USER)
            .input("activeUserStatus", sql.Int, userStatus.Active)
            .query<{ totalUsers: number; activeUsers: number }>(`
                SELECT
                    COUNT(*) AS totalUsers,
                    ISNULL(SUM(CASE WHEN TrangThai = @activeUserStatus THEN 1 ELSE 0 END), 0) AS activeUsers
                FROM [dbo].[User]
                WHERE RoleId = @userRole
            `),
        pool
            .request()
            .input("activeTaskStatus", sql.Int, taskStatus.Active)
            .input("completedTaskStatus", sql.Int, taskStatus.Complete)
            .query<{
                totalTasks: number;
                activeTasks: number;
                completedTasks: number;
                overdueTasks: number;
            }>(`
                SELECT
                    COUNT(*) AS totalTasks,
                    ISNULL(SUM(CASE WHEN TrangThai = @activeTaskStatus AND HetHan >= GETDATE() THEN 1 ELSE 0 END), 0) AS activeTasks,
                    ISNULL(SUM(CASE WHEN TrangThai = @completedTaskStatus THEN 1 ELSE 0 END), 0) AS completedTasks,
                    ISNULL(SUM(CASE WHEN TrangThai = @activeTaskStatus AND HetHan < GETDATE() THEN 1 ELSE 0 END), 0) AS overdueTasks
                FROM [dbo].[CongViec]
            `),
    ]);

    const userRow = userResult.recordset[0];
    const taskRow = taskResult.recordset[0];
    return {
        totalUsers: Number(userRow?.totalUsers ?? 0),
        activeUsers: Number(userRow?.activeUsers ?? 0),
        totalTasks: Number(taskRow?.totalTasks ?? 0),
        activeTasks: Number(taskRow?.activeTasks ?? 0),
        completedTasks: Number(taskRow?.completedTasks ?? 0),
        overdueTasks: Number(taskRow?.overdueTasks ?? 0),
    };
}

// ─── Public: điều phối mock / error / real ─────────────────────────
export async function getDashboardSummary(): Promise<DashboardSummary> {
    if (currentMockMode === mockMode.error) {
        throw new Error("Lỗi giả lập từ mock API.");
    }
    if (currentMockMode === mockMode.on) {
        await mockDelay();
        return getMockDashboardSummary();
    }
    return getRealDashboardSummary();
}