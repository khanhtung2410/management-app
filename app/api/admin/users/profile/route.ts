import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { requireRole, ForbiddenError } from "@/lib/auth";
import { userRole } from "@/constants/roles";

export async function PUT(request: NextRequest) {
    try {
        await requireRole(request, userRole.ADMIN);

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { message: "Body không phải JSON hợp lệ" },
                { status: 400 },
            );
        }

        if (typeof body !== "object" || body === null) {
            return NextResponse.json(
                { message: "Body không hợp lệ" },
                { status: 400 },
            );
        }
        const {
            userId: rawUserId,
            HoTen: rawHoTen,
            Email: rawEmail,
            SDT: rawSDT,
        } = body as Record<string, unknown>;

        const userId = Number(rawUserId);
        if (!Number.isInteger(userId) || userId <= 0) {
            return NextResponse.json(
                { message: "ID người dùng không hợp lệ" },
                { status: 400 },
            );
        }

        if (typeof rawHoTen !== "string" || rawHoTen.trim() === "") {
            return NextResponse.json(
                { message: "Họ tên không hợp lệ" },
                { status: 400 },
            );
        }

        if (typeof rawEmail !== "string" || rawEmail.trim() === "") {
            return NextResponse.json(
                { message: "Email không hợp lệ" },
                { status: 400 },
            );
        }
        if (rawSDT !== undefined && typeof rawSDT !== "string") {
            return NextResponse.json(
                { message: "Số điện thoại không hợp lệ" },
                { status: 400 },
            );
        }

        const HoTen = rawHoTen.trim();
        const Email = rawEmail.trim();
        const SDT = (rawSDT as string | undefined)?.trim() ?? "";

        const db = await getDb();
        const result = await db
            .request()
            .input("userId", sql.Int, userId)
            .input("HoTen", sql.NVarChar(255), HoTen)
            .input("Email", sql.NVarChar(255), Email)
            .input("SDT", sql.NVarChar(10), SDT)
            .input("userRole", sql.Int, userRole.USER)
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