import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { requireRole, ForbiddenError } from "@/lib/auth";
import { userRole } from "@/constants/roles";
import { userStatus } from "@/constants/statuses";

export async function PUT(request: NextRequest) {
    try {
        await requireRole(request, userRole.ADMIN);

        const body: unknown = await request.json().catch(() => null);
        if (typeof body !== "object" || body === null) {
            return NextResponse.json(
                { message: "Body không hợp lệ" },
                { status: 400 },
            );
        }
        const { userId: rawUserId, status: rawStatus } = body as Record<string, unknown>;

        const userId = Number(rawUserId);
        if (!Number.isInteger(userId) || userId <= 0) {
            return NextResponse.json(
                { message: "ID người dùng không hợp lệ" },
                { status: 400 },
            );
        }

        if (
            rawStatus !== userStatus.Active &&
            rawStatus !== userStatus.Inactive
        ) {
            return NextResponse.json(
                { message: "Trạng thái không hợp lệ" },
                { status: 400 },
            );
        }


        // Danh sách user trong UI chỉ hiển thị user thường (RoleId = USER).
        // Filter thêm RoleId ở đây để chặn trường hợp client bị sửa gửi ID admin.
        const db = await getDb();
        const result = await db
            .request()
            .input("userId", sql.Int, userId)
            .input("userStatus", sql.Int, rawStatus)
            .input("userRole", sql.Int, userRole.USER)
            .query(`
                UPDATE [User]
                SET TrangThai = @userStatus
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