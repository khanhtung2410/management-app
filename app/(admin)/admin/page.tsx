import Link from "next/link";
import { connection } from "next/server";
import sql from "mssql";
import { Suspense } from "react";
import { Badge } from "@/components/UI/Badge";
import { Card } from "@/components/UI/Card";
import { userRole } from "@/constants/roles";
import {
    STATUS_CONFIG,
    taskStatus,
    userStatus,
} from "@/constants/statuses";
import { getDb } from "@/lib/db";
import { currentMockMode, mockMode, mockDelay } from "@/lib/mock/config";
import {
    getMockDashboardSummary,
    getMockRecentDashboardTasks,
    type DashboardSummary,
    type DashboardTask,
} from "@/lib/mock/dashboard";
import { requireAdminPage } from "@/lib/auth/server";
import { InlineEmptyState } from "@/components/UI/InlineEmptyState";
import { unstable_rethrow } from "next/navigation";

interface DashboardData {
    summary: DashboardSummary | null;
    summaryError: string | null;
    recentTasks: DashboardTask[] | null;
    tasksError: string | null;
}

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

function getErrorMessage(reason: unknown, fallback: string): string {
    // Ném lại lỗi nội bộ của Next.js (NEXT_PRERENDER_INTERRUPTED, redirect,
    // notFound, …) để runtime xử lý đúng: dừng prerender và đánh dấu route
    // là dynamic. Chỉ lỗi thường mới rơi xuống log + fallback bên dưới.
    unstable_rethrow(reason);

    console.error(fallback, reason);
    return fallback;
}

async function getDashboardData(): Promise<DashboardData> {
    const isMockMode = currentMockMode !== mockMode.off;
    const isMockErrorMode = currentMockMode === mockMode.error;

    const summaryRequest: Promise<DashboardSummary> = isMockMode
        ? (async () => {
            if (isMockErrorMode) {
                throw new Error("Lỗi giả lập từ mock API.");
            }
            await mockDelay();
            return getMockDashboardSummary();
        })()
        : (async () => {
            const pool = await getDb();
            const result = await pool
                .request()
                .input("userRole", sql.Int, userRole.USER)
                .input("activeUserStatus", sql.Int, userStatus.Active)
                .input("activeTaskStatus", sql.Int, taskStatus.Active)
                .input("completedTaskStatus", sql.Int, taskStatus.Complete)
                .query<DashboardSummary>(`
                    SELECT
                        (SELECT COUNT(*) FROM [dbo].[User] WHERE RoleId = @userRole) AS totalUsers,
                        (SELECT COUNT(*) FROM [dbo].[User]
                            WHERE RoleId = @userRole AND TrangThai = @activeUserStatus) AS activeUsers,
                        COUNT(*) AS totalTasks,
                        ISNULL(SUM(CASE
                            WHEN TrangThai = @activeTaskStatus AND HetHan >= GETDATE()
                            THEN 1 ELSE 0
                        END), 0) AS activeTasks,
                        ISNULL(SUM(CASE
                            WHEN TrangThai = @completedTaskStatus
                            THEN 1 ELSE 0
                        END), 0) AS completedTasks,
                        ISNULL(SUM(CASE
                            WHEN TrangThai = @activeTaskStatus AND HetHan < GETDATE()
                            THEN 1 ELSE 0
                        END), 0) AS overdueTasks
                    FROM [dbo].[CongViec]
                `);

            const summary = result.recordset[0];
            if (!summary) {
                throw new Error("Không thể lấy dữ liệu tổng quan từ cơ sở dữ liệu.");
            }
            return summary;
        })();

    const tasksRequest: Promise<DashboardTask[]> = isMockMode
        ? (async () => {
            if (isMockErrorMode) {
                throw new Error("Lỗi giả lập từ mock API.");
            }
            await mockDelay();
            return getMockRecentDashboardTasks();
        })()
        : (async () => {
            const pool = await getDb();
            const result = await pool
                .request()
                .input("activeTaskStatus", sql.Int, taskStatus.Active)
                .input("completedTaskStatus", sql.Int, taskStatus.Complete)
                .input("overdueTaskStatus", sql.Int, taskStatus.Overdue)
                .query<DashboardTask>(`
                    SELECT TOP (5)
                        task.ID,
                        task.Ten,
                        assignedUser.HoTen,
                        task.HetHan,
                        CASE
                            WHEN task.TrangThai = @completedTaskStatus THEN @completedTaskStatus
                            WHEN task.TrangThai = @activeTaskStatus AND task.HetHan < GETDATE()
                            THEN @overdueTaskStatus
                            ELSE task.TrangThai
                        END AS TrangThai
                    FROM [dbo].[CongViec] AS task
                    LEFT JOIN [dbo].[User] AS assignedUser ON assignedUser.ID = task.UserID
                    ORDER BY task.ID DESC
                `);

            return result.recordset;
        })();

    const [summaryResult, tasksResult] = await Promise.allSettled([
        summaryRequest,
        tasksRequest,
    ]);

    return {
        summary:
            summaryResult.status === "fulfilled" ? summaryResult.value : null,
        summaryError:
            summaryResult.status === "rejected"
                ? getErrorMessage(
                    summaryResult.reason,
                    "Không thể tải thống kê dashboard.",
                )
                : null,
        recentTasks:
            tasksResult.status === "fulfilled" ? tasksResult.value : null,
        tasksError:
            tasksResult.status === "rejected"
                ? getErrorMessage(
                    tasksResult.reason,
                    "Không thể tải danh sách công việc gần đây.",
                )
                : null,
    };
}

export default function AdminPage() {
    return (
        <div className="-m-6 min-h-[calc(100vh-7rem)] space-y-8 bg-slate-100 p-6 text-slate-900">
            <header>
                <h1 className="text-2xl font-bold">Tổng quan</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Theo dõi tình hình người dùng và công việc trong hệ thống.
                </p>
            </header>
            <Suspense fallback={<DashboardSkeleton />}>
                <DashboardContent />
            </Suspense>
        </div>
    );
}

async function DashboardContent() {
    await connection();
    await requireAdminPage();
    const { summary, summaryError, recentTasks, tasksError } =
        await getDashboardData();

    const summaryCards = summary
        ? [
            {
                label: "Người dùng",
                value: summary.totalUsers,
                note: `${summary.activeUsers} đang hoạt động`,
                icon: "👥",
                href: "/admin/users",
                color: "text-blue-700",
            },
            {
                label: "Tổng công việc",
                value: summary.totalTasks,
                note: "Tất cả trạng thái",
                icon: "📋",
                href: "/admin/stat",
                color: "text-violet-700",
            },
            {
                label: "Đang thực hiện",
                value: summary.activeTasks,
                note: "Công việc còn hạn",
                icon: "⏳",
                href: "/admin/stat",
                color: "text-sky-700",
            },
            {
                label: "Đã hoàn thành",
                value: summary.completedTasks,
                note: "Đã xử lý xong",
                icon: "✅",
                href: "/admin/stat",
                color: "text-green-700",
            },
            {
                label: "Quá hạn",
                value: summary.overdueTasks,
                note: "Cần được theo dõi",
                icon: "⚠️",
                href: "/admin/stat",
                color: "text-red-700",
            },
        ]
        : [];

    return (
        <>
            <section
                aria-label="Thống kê tổng quan"
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5"
            >
                {summaryError ? (
                    <p
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:col-span-2 xl:col-span-3 2xl:col-span-5"
                    >
                        {summaryError}
                    </p>
                ) : (
                    summaryCards.map((card) => (
                        <Link
                            key={card.label}
                            href={card.href}
                            className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        >
                            <Card className="!bg-slate-50 h-full p-5 transition-shadow hover:shadow-lg">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            {card.label}
                                        </p>
                                        <p className={`mt-2 text-3xl font-bold ${card.color}`}>
                                            {card.value}
                                        </p>
                                    </div>
                                    <span aria-hidden="true" className="text-2xl">
                                        {card.icon}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm text-gray-500">{card.note}</p>
                            </Card>
                        </Link>
                    ))
                )}
            </section>

            <section aria-labelledby="recent-tasks-heading">
                <Card className="!bg-slate-50 overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
                        <div>
                            <h2
                                id="recent-tasks-heading"
                                className="text-lg font-semibold text-gray-900"
                            >
                                Công việc gần đây
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Danh sách 5 công việc mới nhất.
                            </p>
                        </div>
                        <Link
                            href="/admin/stat"
                            className="text-sm font-medium text-blue-700 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                            Xem thống kê
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                <tr>
                                    <th scope="col" className="px-5 py-3 font-medium">Công việc</th>
                                    <th scope="col" className="px-5 py-3 font-medium">Người phụ trách</th>
                                    <th scope="col" className="px-5 py-3 font-medium">Hạn hoàn thành</th>
                                    <th scope="col" className="px-5 py-3 font-medium">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tasksError ? (
                                    <tr>
                                        <td colSpan={4} role="alert" className="px-5 py-8 text-center text-red-700">
                                            {tasksError}
                                        </td>
                                    </tr>
                                ) : recentTasks?.length ? (
                                    recentTasks.map((task) => (
                                        <tr key={task.ID} className="text-gray-700">
                                            <td className="px-5 py-4 font-medium text-gray-900">
                                                {task.Ten}
                                            </td>
                                            <td className="px-5 py-4">
                                                {task.HoTen ?? "Chưa phân công"}
                                            </td>
                                            <td className="px-5 py-4">
                                                {dateFormatter.format(new Date(task.HetHan))}
                                            </td>
                                            <td className="px-5 py-4">
                                                <Badge config={STATUS_CONFIG[task.TrangThai]} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <InlineEmptyState
                                        variant="table"
                                        colSpan={4}
                                        size="sm"
                                        message="Chưa có công việc nào."
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>
        </>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8" aria-busy="true" aria-label="Đang tải dữ liệu tổng quan">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-32 rounded-xl bg-slate-200 animate-pulse"
                    />
                ))}
            </section>
            <div className="h-64 rounded-xl bg-slate-200 animate-pulse" />
        </div>
    );
}