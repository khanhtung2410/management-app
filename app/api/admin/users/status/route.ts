import { NextRequest, NextResponse } from "next/server";
import * as sql from "mssql";
import { getDb } from "@/lib/db";
import { requireRole ,ForbiddenError} from "@/lib/auth";
import { userRole } from "@/constants/roles";

export async function PUT(request: NextRequest) {
    try {
        await requireRole(request, userRole.ADMIN);

        const body = await request.json();
        const userId = Number(body.userId);
        const status = Number(body.status);

        if (!userId) {
            return NextResponse.json(
                { message: "ID người dùng không hợp lệ" },
                { status: 400 }
            );
        }

        if (status !== 0 && status !== 1) {
            return NextResponse.json(
                { message: "Trạng thái không hợp lệ" },
                { status: 400 }
            );
        }

        const db = await getDb();
        const result = await db
            .request()
            .input("userId", sql.Int, userId)
            .input("status", sql.TinyInt, status)
            .input("userRole",sql.TinyInt,userRole.USER)
            .query(`
                UPDATE [User]
                SET TrangThai = @status
                WHERE ID = @userId
                  AND RoleId = @userRole
                `)

        if (result.rowsAffected[0] === 0) {
            return NextResponse.json(
                { message: "Không tìm thấy người dùng" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Cập nhật trạng thái thành công",
        });
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return NextResponse.json(
                { message: "Không có quyền truy cập" },
                { status: 403 }
            );
        }

        console.error("UPDATE USER STATUS ERROR:", error);
        return NextResponse.json(
            { message: "Không thể cập nhật trạng thái" },
            { status: 500 }
        );
    }
}