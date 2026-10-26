// Tải danh sách công việc của người dùng đã xác thực ở server; không dùng cho danh sách admin hoặc chi tiết một công việc.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import sql from "mssql";
import type { TaskStatusType } from "@/constants/statuses";
import { UnauthorizedError, verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import type { CongViec } from "./_components/taskRow";
import { TasksClient } from "./_components/TasksClient";

interface TaskRecord {
    ID: number;
    Ten: string;
    Mota: string;
    TrangThai: TaskStatusType;
    HetHan: Date;
}

export default async function TasksPage() {
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
