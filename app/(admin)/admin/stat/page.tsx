// Tổng hợp số liệu người dùng và công việc cho dashboard admin; không dùng cho người dùng thường hoặc danh sách chi tiết.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import sql from "mssql";
import { STATUS_CONFIG, taskStatus } from "@/constants/statuses";
import { Card } from "@/components/UI/Card";
import { userRole } from "@/constants/roles";
import { UnauthorizedError, verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getMockDashboardSummary } from "@/lib/mock/dashboard";
import { getPercent } from "@/lib/percent";
import TaskStatsChart from "./TaskStatsChart";
import type { TaskStat } from "./types";

export default async function DashboardPage() {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
        redirect("/login");
    }

    let roleId: number;
    try {
        ({ roleId } = await verifyToken(token));
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            redirect("/login");
        }
        throw error;
    }

    if (roleId !== userRole.ADMIN) {
        redirect("/403");
    }

    const isMockMode =
        process.env.NEXT_PUBLIC_MOCK_API_MODE === "error" ||
        process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

    let totalUsers: number;
    let totalTasks: number;
    let activeTasks: number;
    let completedTasks: number;
    let overdueTasks: number;

    if (isMockMode) {
        if (process.env.NEXT_PUBLIC_MOCK_API_MODE === "error") {
            throw new Error("Lỗi giả lập từ mock API.");
        }
        const summary = getMockDashboardSummary();
        totalUsers = summary.totalUsers;
        totalTasks = summary.totalTasks;
        activeTasks = summary.activeTasks;
        completedTasks = summary.completedTasks;
        overdueTasks = summary.overdueTasks;
    } else {
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
        totalUsers = Number(userResult.recordset[0]?.totalUsers ?? 0);
        totalTasks = Number(taskRow?.totalTasks ?? 0);
        activeTasks = Number(taskRow?.DangThucHien ?? 0);
        completedTasks = Number(taskRow?.HoanThanh ?? 0);
        overdueTasks = Number(taskRow?.QuaHan ?? 0);
    }

    const taskStats: TaskStat[] = [
        { status: taskStatus.Active, total: activeTasks },
        { status: taskStatus.Complete, total: completedTasks },
        { status: taskStatus.Overdue, total: overdueTasks },
    ].map(({ status, total }) => ({
        status,
        name: STATUS_CONFIG[status].label,
        total,
        percent: getPercent(total, totalTasks),
    }));

    return (
        <main className="min-h-screen bg-[#F3F6FA] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-1 text-xs text-[#475569] sm:text-sm">
                    Tổng quan hệ thống quản lý công việc
                </p>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card className="p-6 ring-1 ring-[#E2E8F0]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#475569]">
                                    Tổng số người dùng
                                </p>
                                <p className="mt-2 text-4xl font-bold text-[#1E40AF]">
                                    {totalUsers}
                                </p>
                                <p className="mt-2 text-sm text-[#64748B]">
                                    Người dùng trong hệ thống
                                </p>
                            </div>
                            <div
                                className="flex h-16 w-16 items-center justify-center rounded-full"
                                style={{ backgroundColor: "#DBEAFE" }}
                            >
                                <span className="text-3xl">👥</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 ring-1 ring-[#E2E8F0]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-[#475569]">
                                    Tổng số công việc
                                </p>
                                <p className="mt-2 text-4xl font-bold text-[#7C3AED]">
                                    {totalTasks}
                                </p>
                                <p className="mt-2 text-sm text-[#64748B]">
                                    Tất cả công việc
                                </p>
                            </div>
                            <div
                                className="flex h-16 w-16 items-center justify-center rounded-full"
                                style={{ backgroundColor: "#EDE9FE" }}
                            >
                                <span className="text-3xl">📋</span>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="mt-6 p-4 ring-1 ring-[#E2E8F0] sm:p-6">
                    <div className="mb-2">
                        <h2 className="text-lg font-semibold text-[#0F172A] sm:text-xl">
                            Thống kê công việc
                        </h2>
                        <p className="mt-1 text-xs text-[#475569] sm:text-sm">
                            Tỷ lệ công việc theo trạng thái
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4 2xl:grid 2xl:grid-cols-2 2xl:gap-8">
                        <TaskStatsChart taskStats={taskStats} />

                        <div className="w-full min-w-0 space-y-3 sm:space-y-4">
                            {taskStats.map(item => (
                                <div
                                    key={item.status}
                                    className="rounded-xl border border-[#E2E8F0] p-3 sm:p-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <span
                                                className="h-3 w-3 rounded-full sm:h-4 sm:w-4"
                                                style={{
                                                    backgroundColor:
                                                        STATUS_CONFIG[item.status].color,
                                                }}
                                            />
                                            <span className="text-sm font-medium text-[#334155] sm:text-base">
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="text-base font-bold text-[#0F172A] sm:text-lg">
                                            {item.total}
                                        </span>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between sm:mt-3">
                                        <span className="text-xs text-[#475569] sm:text-sm">
                                            Tỷ lệ
                                        </span>
                                        <span className="text-xs font-semibold text-[#334155] sm:text-sm">
                                            {item.percent}%
                                        </span>
                                    </div>

                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E2E8F0] sm:h-2">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${item.percent}%`,
                                                backgroundColor:
                                                    STATUS_CONFIG[item.status].color,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                    {taskStats.map(item => (
                        <Card
                            key={item.status}
                            shadow="sm"
                            className="p-4 ring-1 ring-[#E2E8F0] sm:p-5"
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{
                                        backgroundColor: STATUS_CONFIG[item.status].color,
                                    }}
                                />
                                <span className="text-xs text-[#475569] sm:text-sm">
                                    {item.name}
                                </span>
                            </div>

                            <div className="mt-2 flex items-end gap-2 sm:mt-3">
                                <span className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
                                    {item.total}
                                </span>
                                <span className="mb-1 text-xs text-[#475569] sm:text-sm">
                                    công việc
                                </span>
                            </div>

                            <p className="mt-1 text-xs text-[#475569] sm:text-sm">
                                Chiếm {item.percent}% tổng số
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}