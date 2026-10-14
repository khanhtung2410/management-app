import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { taskStatus } from "@/constants/statuses";
import { UnauthorizedError, ForbiddenError } from "@/lib/auth/errors";

// Helper xử lý lỗi chung cho cả 2 handler
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

export async function GET(req: NextRequest) {
    try {
        const { userId } = await requireAuth(req);

        const pool = await getDb();
        const result = await pool
            .request()
            .input("UserID", sql.Int, Number(userId))
            .query(`
                SELECT ID, Ten, Mota, TrangThai, HetHan
                FROM [dbo].[CongViec]
                WHERE UserID = @UserID
                ORDER BY ID DESC
            `);

        return NextResponse.json(result.recordset);
    } catch (error) {
        return handleError(error, "Lỗi khi lấy danh sách công việc");
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await requireAuth(req);

        const body = await req.json().catch(() => null);
        if (!body) {
            return NextResponse.json(
                { message: "Dữ liệu không hợp lệ" },
                { status: 400 }
            );
        }

        const Ten = String(body.Ten || "").trim();
        const Mota = String(body.Mota || "").trim();
        const HetHan = body.HetHan;

        if (!Ten) {
            return NextResponse.json(
                { message: "Vui lòng nhập tên công việc" },
                { status: 400 }
            );
        }
        if (!HetHan) {
            return NextResponse.json(
                { message: "Vui lòng chọn ngày hết hạn" },
                { status: 400 }
            );
        }

        const pool = await getDb();
        const result = await pool
            .request()
            .input("UserID", sql.Int, Number(userId))
            .input("Ten", sql.NVarChar(255), Ten)
            .input("Mota", sql.NVarChar(sql.MAX), Mota)
            .input("TrangThai", sql.Int, taskStatus.Active)
            .input("HetHan", sql.DateTime, new Date(HetHan))
            .query(`
                INSERT INTO [dbo].[CongViec]
                    (UserID, Ten, Mota, TrangThai, HetHan)
                OUTPUT
                    INSERTED.ID, INSERTED.Ten, INSERTED.Mota,
                    INSERTED.TrangThai, INSERTED.HetHan
                VALUES
                    (@UserID, @Ten, @Mota, @TrangThai, @HetHan)
            `);

        return NextResponse.json(result.recordset[0], { status: 201 });
    } catch (error) {
        return handleError(error, "Lỗi khi tạo công việc");
    }
}