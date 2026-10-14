import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { requireRole, ForbiddenError } from "@/lib/auth";
import { userRole } from "@/constants/roles";

const sortableColumn: Record<string, string> = {
    id: "ID"
}

export async function GET(request: NextRequest) {
    try {
        await requireRole(request, userRole.ADMIN);
        const { searchParams } = new URL(request.url);

        const sortBy =
            sortableColumn[searchParams.get("sortBy") ?? "id"] ?? "ID";
        const sortDir =
            searchParams.get("order") === "desc" ? "DESC" : "ASC";

        const search = searchParams.get("search") || "";
        const page = Math.max(Number(searchParams.get("page")) || 1, 1);
        const pageSize = Math.max(Number(searchParams.get("pageSize")) || 10, 1);
        const offset = (page - 1) * pageSize;

        const db = await getDb();

        const [result, countResult] = await Promise.all([
            db
                .request()
                .input("offset", sql.Int, offset)
                .input("roleId", sql.Int, userRole.USER)
                .input("search", sql.NVarChar(255), search)
                .input("pageSize", sql.Int, pageSize)
                .query(`
                SELECT ID, HoTen, Email, SDT, TrangThai
                FROM [User]
                WHERE RoleId = @roleId
                  AND (
                    HoTen LIKE N'%' + @search + N'%'
                    OR Email LIKE N'%' + @search + N'%'
                  )
                ORDER BY ${sortBy} ${sortDir}
                OFFSET @offset ROWS
                FETCH NEXT @pageSize ROWS ONLY
            `),

            db
                .request()
                .input("search", sql.NVarChar(255), search)
                .input("roleId", sql.Int, userRole.USER)
                .query(`
                SELECT COUNT(*) AS total
                FROM [User]
                WHERE RoleId = @roleId
                  AND (
                    HoTen LIKE N'%' + @search + N'%'
                    OR Email LIKE N'%' + @search + N'%'
                  )
            `),
        ]);

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