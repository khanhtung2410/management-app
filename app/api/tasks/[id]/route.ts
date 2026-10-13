import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { UnauthorizedError, ForbiddenError } from "@/lib/auth/errors";

function handleError(error: unknown, fallbackMessage: string) {
    if (error instanceof UnauthorizedError) {
        return NextResponse.json(
            { message: "Chưa đăng nhập" },
            { status: 401 }
        );
    }
    if (error instanceof ForbiddenError) {
        return NextResponse.json(
            { message: "Không có quyền truy cập" },
            { status: 403 }
        );
    }

    console.error(fallbackMessage, error);
    return NextResponse.json(
        { message: fallbackMessage },
        { status: 500 }
    );
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await requireAuth(req);

        // Next.js 15+: params là Promise
        const { id } = await params;
        const taskId = Number(id);

        if (!Number.isInteger(taskId) || taskId <= 0) {
            return NextResponse.json(
                { message: "ID công việc không hợp lệ" },
                { status: 400 }
            );
        }

        const body = await req.json().catch(() => null);
        if (!body) {
            return NextResponse.json(
                { message: "Dữ liệu không hợp lệ" },
                { status: 400 }
            );
        }

        const TrangThai = Number(body.TrangThai);

        // Chỉ cho phép 2 giá trị hợp lệ
        if (TrangThai !== 0 && TrangThai !== 1) {
            return NextResponse.json(
                { message: "Trạng thái không hợp lệ" },
                { status: 400 }
            );
        }

        const pool = await getDb();
        const result = await pool
            .request()
            .input("ID", sql.Int, taskId)
            .input("UserID", sql.Int, Number(userId))
            .input("TrangThai", sql.Int, TrangThai)
            .query(`
                UPDATE [dbo].[CongViec]
                SET TrangThai = @TrangThai
                OUTPUT
                    INSERTED.ID, INSERTED.Ten, INSERTED.Mota,
                    INSERTED.TrangThai, INSERTED.HetHan
                WHERE ID = @ID AND UserID = @UserID
            `);

        // Không tìm thấy hoặc không phải task của user này
        if (result.recordset.length === 0) {
            return NextResponse.json(
                { message: "Không tìm thấy công việc" },
                { status: 404 }
            );
        }

        return NextResponse.json(result.recordset[0]);
    } catch (error) {
        return handleError(error, "Lỗi khi cập nhật trạng thái");
    }
}