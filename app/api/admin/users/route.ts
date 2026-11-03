import { NextRequest } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { userRole } from "@/constants/roles";
import { list, handleApiError } from "@/lib/api";
import { adminUserSortColumns, normalizeAdminUserSearch } from "@/lib/api/admin-users";
import { parseListQuery } from "@/lib/api/pagination";

export async function GET(request: NextRequest) {
    try {
        await requireRole(request, userRole.ADMIN);
        const { searchParams } = new URL(request.url);

        const { sortBy, page, pageSize } = parseListQuery(
            searchParams,
            adminUserSortColumns,
        );
        const sortDir = searchParams.get("order") === "desc" ? "DESC" : "ASC";

        const search = normalizeAdminUserSearch(searchParams.get("search"));
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
                        AND (HoTen LIKE N'%' + @search + N'%'
                             OR Email LIKE N'%' + @search + N'%')
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
                        AND (HoTen LIKE N'%' + @search + N'%'
                             OR Email LIKE N'%' + @search + N'%')
                `),
        ]);

        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / pageSize);

        return list(result.recordset, { page, pageSize, total, totalPages });
    } catch (error) {
        return handleApiError(error);
    }
}
