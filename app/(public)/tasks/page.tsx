// Tải danh sách công việc của người dùng đã xác thực ở server; không dùng cho danh sách admin hoặc chi tiết một công việc.
import sql from "mssql";
import type { TaskStatusType } from "@/constants/statuses";
import { requireUserPage } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import type { CongViec } from "./_components/taskRow";
import { TasksClient } from "./_components/TasksClient";
import { Suspense } from "react";

interface TaskRecord {
    ID: number;
    Ten: string;
    Mota: string;
    TrangThai: TaskStatusType;
    HetHan: Date;
}

export default function TasksPage() {
    return (
        <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:text-3xl">
                    Công việc của tôi
                </h1>
                <Suspense fallback={<TasksSkeleton />}>
                    <TasksContent />
                </Suspense>
            </div>
        </main>
    );
}

async function TasksContent() {
    const { userId } = await requireUserPage();

    const pool = await getDb();
    const result = await pool
        .request()
        .input("UserID", sql.Int, userId)
        .query<TaskRecord>(`
            SELECT ID, Ten, Mota, TrangThai, HetHan
            FROM [dbo].[CongViec]
            WHERE UserID = @UserID
            ORDER BY ID DESC
        `);

    const tasks: CongViec[] = result.recordset.map(task => ({
        ...task,
        HetHan: task.HetHan.toISOString(),
    }));

    return <TasksClient initialTasks={tasks} />;
}

function TasksSkeleton() {
    return (
        <div className="space-y-3" aria-busy="true" aria-label="Đang tải danh sách công việc">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 rounded-lg bg-gray-200 animate-pulse" />
            ))}
        </div>
    );
}