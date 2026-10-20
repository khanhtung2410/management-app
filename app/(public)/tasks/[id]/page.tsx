import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import sql from "mssql";
import { STATUS_CONFIG, taskStatus, TaskStatusType } from "@/constants/statuses";
import { UnauthorizedError, verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { TaskStatusButton } from "./TaskStatusButton";

interface TaskDetail {
    ID: number;
    Ten: string;
    Mota: string;
    TrangThai: TaskStatusType;
    HetHan: Date;
}

function formatDate(value: Date) {
    return value.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getDisplayStatus(task: TaskDetail) {
    if (task.TrangThai === taskStatus.Complete) return taskStatus.Complete;
    if (task.HetHan < new Date()) return taskStatus.Overdue;
    return taskStatus.Active;
}

export default async function TaskDetailPage({
    params,
}: PageProps<"/tasks/[id]">) {
    const { id } = await params;
    const taskId = Number(id);

    if (!Number.isInteger(taskId) || taskId <= 0) {
        notFound();
    }

    const token = (await cookies()).get("token")?.value;
    if (!token) {
        redirect("/login");
    }

    let userId: number;
    try {
        ({ userId } = await verifyToken(token));
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            redirect("/login");
        }
        throw error;
    }

    const pool = await getDb();
    const result = await pool
        .request()
        .input("ID", sql.Int, taskId)
        .input("UserID", sql.Int, userId)
        .query<TaskDetail>(`
            SELECT ID, Ten, Mota, TrangThai, HetHan
            FROM [dbo].[CongViec]
            WHERE ID = @ID AND UserID = @UserID
        `);

    const task = result.recordset[0];
    if (!task) {
        notFound();
    }

    const displayStatus = getDisplayStatus(task);
    const statusConfig = STATUS_CONFIG[displayStatus];

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <Link
                        href="/tasks"
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        ← Quay lại
                    </Link>
                    <TaskStatusButton
                        taskId={task.ID}
                        status={task.TrangThai}
                    />
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-md">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                                    Công việc #{task.ID}
                                </p>
                                <h1 className="mt-1 text-3xl font-bold text-gray-800">
                                    {task.Ten}
                                </h1>
                            </div>

                            <span
                                className="inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-medium"
                                style={{
                                    backgroundColor: statusConfig.bg,
                                    color: statusConfig.color,
                                }}
                            >
                                {statusConfig.label}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6 p-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <h2 className="mb-2 text-lg font-semibold text-gray-800">
                                Mô tả
                            </h2>
                            <div className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
                                {task.Mota || "Không có mô tả"}
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-2 text-lg font-semibold text-gray-800">
                                Hạn hoàn thành
                            </h2>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
                                {formatDate(task.HetHan)}
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-2 text-lg font-semibold text-gray-800">
                                Trạng thái hiện tại
                            </h2>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
                                <span
                                    className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                                    style={{
                                        backgroundColor: statusConfig.bg,
                                        color: statusConfig.color,
                                    }}
                                >
                                    {statusConfig.label}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
