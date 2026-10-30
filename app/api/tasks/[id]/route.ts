import { NextRequest } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { taskStatus } from "@/constants/statuses";
import { revalidatePath, revalidateTag } from "next/cache";
import { readJson, badRequest, notFound, ok, handleApiError } from "@/lib/api";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { userId } = await requireAuth(req);
        const { id } = await params;
        const taskId = Number(id);

        if (!Number.isInteger(taskId) || taskId <= 0) {
            throw badRequest("ID công việc không hợp lệ", [
                { field: "id", message: "ID công việc không hợp lệ" },
            ]);
        }

        const pool = await getDb();
        const result = await pool
            .request()
            .input("ID", sql.Int, taskId)
            .input("UserID", sql.Int, Number(userId)).query(`
        SELECT ID, Ten, Mota, TrangThai, HetHan
        FROM [dbo].[CongViec]
        WHERE ID = @ID AND UserID = @UserID
      `);

        if (result.recordset.length === 0) {
            throw notFound("Không tìm thấy công việc");
        }

        return ok(result.recordset[0]);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { userId } = await requireAuth(req);
        const { id } = await params;
        const taskId = Number(id);

        if (!Number.isInteger(taskId) || taskId <= 0) {
            throw badRequest("ID công việc không hợp lệ", [
                { field: "id", message: "ID công việc không hợp lệ" },
            ]);
        }

        const body = await readJson(req);

        // ── TrangThai: required, phải là number nguyên (không ép kiểu) ───
        const TrangThai = body.TrangThai;
        if (
            typeof TrangThai !== "number" ||
            !Number.isInteger(TrangThai) ||
            (TrangThai !== taskStatus.Active &&
                TrangThai !== taskStatus.Complete)
        ) {
            throw badRequest("Trạng thái không hợp lệ", [
                { field: "TrangThai", message: "Trạng thái không hợp lệ" },
            ]);
        }

        const pool = await getDb();
        const result = await pool
            .request()
            .input("ID", sql.Int, taskId)
            .input("UserID", sql.Int, Number(userId))
            .input("TrangThai", sql.Int, TrangThai).query(`
        UPDATE [dbo].[CongViec]
        SET TrangThai = @TrangThai
        OUTPUT
          INSERTED.ID, INSERTED.Ten, INSERTED.Mota,
          INSERTED.TrangThai, INSERTED.HetHan
        WHERE ID = @ID AND UserID = @UserID
      `);

        if (result.recordset.length === 0) {
            throw notFound("Không tìm thấy công việc");
        }

        revalidatePath("/tasks");
        revalidatePath(`/tasks/${taskId}`);
        revalidatePath("/admin/stat");
        revalidateTag("dashboard-summary", "max");

        return ok(result.recordset[0]);
    } catch (error) {
        return handleApiError(error);
    }
}
