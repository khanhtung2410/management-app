import { NextRequest, NextResponse } from "next/server";
import * as sql from "mssql";
import { getDb } from "@/lib/db";
import { requireRole, ForbiddenError } from "@/lib/auth";
import { userRole } from "@/constants/roles";

export async function PUT(request: NextRequest) {
    try {
        await requireRole(request, userRole.ADMIN);

        const body = await request.json();
        const userId = Number(body.userId);
        const HoTen = String(body.HoTen || "").trim();
        const Email = String(body.Email || "").trim();
        const SDT = String(body.SDT || "").trim();

        if (!userId) {
            return NextResponse.json(
                { message: "ID người dùng không hợp lệ" },
                { status: 400 }
            );
        }

        if (!HoTen || !Email) {
            return NextResponse.json(
                { message: "Dữ liệu không hợp lệ" },
                { status: 400 }
            );
        }

        const db = await getDb();
        const result = await db
            .request()
            .input("userId", sql.Int, userId)
            .input("HoTen", sql.NVarChar(255), HoTen)
            .input("Email", sql.NVarChar(255), Email)
            .input("SDT", sql.NVarChar(50), SDT)
            .input("userRole",sql.TinyInt,userRole.USER)
            .query(`
                UPDATE [User]
                SET
                    HoTen = @HoTen,
                    Email = @Email,
                    SDT   = @SDT
                WHERE ID = @userId
                  AND RoleId = @userRole
            `);

        if (result.rowsAffected[0] === 0) {
            return NextResponse.json(
                { message: "Không tìm thấy người dùng" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Cập nhật người dùng thành công",
        });
    } catch (error) {
        // requireRole throw ForbiddenError khi sai role
        if (error instanceof ForbiddenError) {
            return NextResponse.json(
                { message: "Không có quyền truy cập" },
                { status: 403 }
            );
        }

        console.error("UPDATE USER PROFILE ERROR:", error);
        return NextResponse.json(
            { message: "Không thể cập nhật người dùng" },
            { status: 500 }
        );
    }
}