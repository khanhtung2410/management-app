import "server-only";
import sql from "mssql";
import { cacheLife, cacheTag } from "next/cache";
import { taskStatus } from "@/constants/statuses";
import { userRole } from "@/constants/roles";
import { getDb } from "@/lib/db";
import { getMockDashboardSummary } from "@/lib/mock/dashboard";

export interface DashboardSummary {
    totalUsers: number;
    totalTasks: number;
    activeTasks: number;
    completedTasks: number;
    overdueTasks: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
    "use cache";
    cacheLife("minutes");          // dữ liệu trễ vài phút chấp nhận được
    cacheTag("dashboard-summary"); // để revalidateTag khi có biến động

    const isMockMode =
        process.env.NEXT_PUBLIC_MOCK_API_MODE === "error" ||
        process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

    if (isMockMode) {
        if (process.env.NEXT_PUBLIC_MOCK_API_MODE === "error") {
            throw new Error("Lỗi giả lập từ mock API.");
        }
        return getMockDashboardSummary();
    }

    const pool = await getDb();
    const [userResult, taskResult] = await Promise.all([
        pool
            .request()
            .input("userRole", sql.Int, userRole.USER)
            .query<{ totalUsers: number }>(`
                SELECT COUNT(*) AS totalUsers
                FROM [dbo].[User]
                WHERE RoleId = @userRole
            `),
        pool
            .request()
            .input("statusActive", sql.Int, taskStatus.Active)
            .input("statusComplete", sql.Int, taskStatus.Complete)
            .query<{
                totalTasks: number;
                DangThucHien: number;
                HoanThanh: number;
                QuaHan: number;
            }>(`
                SELECT
                    COUNT(*) AS totalTasks,
                    SUM(CASE
                        WHEN TrangThai = @statusActive AND HetHan >= GETDATE()
                        THEN 1 ELSE 0
                    END) AS DangThucHien,
                    SUM(CASE
                        WHEN TrangThai = @statusComplete
                        THEN 1 ELSE 0
                    END) AS HoanThanh,
                    SUM(CASE
                        WHEN TrangThai = @statusActive AND HetHan < GETDATE()
                        THEN 1 ELSE 0
                    END) AS QuaHan
                FROM [dbo].[CongViec]
            `),
    ]);

    const taskRow = taskResult.recordset[0];
    return {
        totalUsers: Number(userResult.recordset[0]?.totalUsers ?? 0),
        totalTasks: Number(taskRow?.totalTasks ?? 0),
        activeTasks: Number(taskRow?.DangThucHien ?? 0),
        completedTasks: Number(taskRow?.HoanThanh ?? 0),
        overdueTasks: Number(taskRow?.QuaHan ?? 0),
    };
}