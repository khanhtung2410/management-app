import { NextRequest, NextResponse } from "next/server";
import * as sql from "mssql";
import { getDb } from "@/lib/db";
import { requireRole, ForbiddenError } from "@/lib/auth";
import { userRole } from "@/constants/roles";

export async function GET(request: NextRequest) {
    try {
        await requireRole(request, userRole.ADMIN);

        const db = await getDb();
        const { searchParams } = new URL(request.url);

        const order = searchParams.get("sortById") === "desc" ? "desc" : "asc";
        const search = searchParams.get("search") || "";
        const page = Math.max(Number(searchParams.get("page")) || 1, 1);
        const pageSize = Math.max(Number(searchParams.get("pageSize")) || 10, 1);
        const offset = (page - 1) * pageSize;

        const result = await db
            .request()
            .input("offset", sql.Int, offset)
            .input("search", sql.NVarChar(255), search)
            .input("pageSize", sql.Int, pageSize)
            .input("order", sql.NVarChar(4), order)
            .query(`
                SELECT ID, HoTen, Email, SDT, TrangThai
                FROM [User]
                WHERE RoleId = ${userRole.USER}
                  AND (
                    HoTen LIKE N'%' + @search + N'%'
                    OR Email LIKE N'%' + @search + N'%'
                  )
                ORDER BY
                    CASE WHEN @order = 'asc'  THEN ID END ASC,
                    CASE WHEN @order = 'desc' THEN ID END DESC
                OFFSET @offset ROWS
                FETCH NEXT @pageSize ROWS ONLY
            `);

        const countResult = await db
            .request()
            .input("search", sql.NVarChar(255), search)
            .query(`
                SELECT COUNT(*) AS total
                FROM [User]
                WHERE RoleId = ${userRole.USER}
                  AND (
                    HoTen LIKE N'%' + @search + N'%'
                    OR Email LIKE N'%' + @search + N'%'
                  )
            `);

        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / pageSize);

        return NextResponse.json({
            data: result.recordset,
            total,
            page,
            pageSize,
            totalPages,
        });
    } catch (error) {
        if (error instanceof ForbiddenError) {
            return NextResponse.json(
                { message: "Không có quyền truy cập" },
                { status: 403 }
            );
        }

        console.error("GET USERS ERROR:", error);
        return NextResponse.json(
            { message: "Không thể lấy danh sách người dùng" },
            { status: 500 }
        );
    }
}