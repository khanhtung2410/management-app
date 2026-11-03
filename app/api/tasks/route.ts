import { NextRequest } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { taskStatus } from "@/constants/statuses";
import { parseListQuery } from "@/lib/api/pagination";
import { readJson, badRequest, list, created, handleApiError } from "@/lib/api";
import { validateTaskFields } from "@/lib/validation/task";

const sortableColumn = { id: "ID", hetHan: "HetHan", ten: "Ten" } as const;

export async function GET(req: NextRequest) {
    try {
        const { userId } = await requireAuth(req);
        const { searchParams } = new URL(req.url);

        const { sortBy, page, pageSize } = parseListQuery(searchParams, sortableColumn);
        const sortDir = searchParams.get("order") === "desc" ? "DESC" : "ASC";

        const offset = (page - 1) * pageSize;

        const pool = await getDb();

        const [result, countResult] = await Promise.all([
            pool
                .request()
                .input("UserID", sql.Int, Number(userId))
                .input("offset", sql.Int, offset)
                .input("pageSize", sql.Int, pageSize).query(`
          SELECT ID, Ten, Mota, TrangThai, HetHan
          FROM [dbo].[CongViec]
          WHERE UserID = @UserID
          ORDER BY ${sortBy} ${sortDir}
          OFFSET @offset ROWS
          FETCH NEXT @pageSize ROWS ONLY
        `),
            pool.request().input("UserID", sql.Int, Number(userId)).query(`
          SELECT COUNT(*) AS total
          FROM [dbo].[CongViec]
          WHERE UserID = @UserID
        `),
        ]);

        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / pageSize);

        return list(result.recordset, { page, pageSize, total, totalPages });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await requireAuth(req);
        const body = await readJson(req);
        const validation = validateTaskFields(body);
        if (!validation.ok) {
            throw badRequest(validation.details[0].message, validation.details);
        }
        const { Ten, Mota, HetHan } = validation.data;

        const pool = await getDb();
        const result = await pool
            .request()
            .input("UserID", sql.Int, Number(userId))
            .input("Ten", sql.NVarChar(255), Ten)
            .input("Mota", sql.NVarChar(sql.MAX), Mota)
            .input("TrangThai", sql.Int, taskStatus.Active)
            .input("HetHan", sql.DateTime, new Date(HetHan)).query(`
        INSERT INTO [dbo].[CongViec]
          (UserID, Ten, Mota, TrangThai, HetHan)
        OUTPUT
          INSERTED.ID, INSERTED.Ten, INSERTED.Mota,
          INSERTED.TrangThai, INSERTED.HetHan
        VALUES
          (@UserID, @Ten, @Mota, @TrangThai, @HetHan)
      `);

        return created(result.recordset[0]);
    } catch (error) {
        return handleApiError(error);
    }
}
