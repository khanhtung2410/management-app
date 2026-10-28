// Tải và hiển thị chi tiết một công việc thuộc người dùng hiện tại; không dùng cho danh sách hoặc trang quản trị công việc.
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import sql from "mssql";
import { cache } from "react";
import { STATUS_CONFIG, type TaskStatusType } from "@/constants/statuses";
import { requireUserPage } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { TaskStatusButton } from "./TaskStatusButton";
import { formatTaskDate, getTaskDisplayStatus } from "../_lib/taskUtils";
import { Badge } from "@/components/UI/Badge";
import { Card } from "@/components/UI/Card";

interface TaskDetail {
    ID: number;
    Ten: string;
    Mota: string;
    TrangThai: TaskStatusType;
    HetHan: Date;
}

const getTask = cache(async (id: string): Promise<TaskDetail> => {
    const taskId = Number(id);
    const { userId } = await requireUserPage();

    if (!Number.isInteger(taskId) || taskId <= 0) {
        notFound();
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

    return task;
});

export async function generateMetadata({
    params,
}: PageProps<"/tasks/[id]">): Promise<Metadata> {
    const { id } = await params;
    const task = await getTask(id);
    const description = task.Mota?.trim() ?? "";

    return {
        title: `${task.Ten} | Chi tiết công việc`,
        description: description
            ? description.slice(0, 160)
            : `Chi tiết công việc: ${task.Ten}`,
    };
}

export default async function TaskDetailPage({
    params,
}: PageProps<"/tasks/[id]">) {
    const { id } = await params;
    const task = await getTask(id);

    const displayStatus = getTaskDisplayStatus(task.TrangThai, task.HetHan);
    const statusConfig = STATUS_CONFIG[displayStatus];

    return (
        <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href="/tasks"
                        className="inline-flex w-fit items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    >
                        ← Quay lại
                    </Link>
                    <TaskStatusButton
                        taskId={task.ID}
                        status={task.TrangThai}
                    />
                </div>

                <Card className="overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                                    Công việc #{task.ID}
                                </p>
                                <h1 className="mt-1 break-words text-2xl font-bold text-gray-800 sm:text-3xl">
                                    {task.Ten}
                                </h1>
                            </div>

                            <Badge config={statusConfig} size="md" />
                        </div>
                    </div>

                    <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-2">
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
                                {formatTaskDate(task.HetHan)}
                            </div>
                        </div>

                        <div>
                            <h2 className="mb-2 text-lg font-semibold text-gray-800">
                                Trạng thái hiện tại
                            </h2>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-700">
                                <Badge config={statusConfig} />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </main>
    );
}
