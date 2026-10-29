import { NextRequest } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { taskStatus } from "@/constants/statuses";
import { parsePage, parsePageSize } from "@/lib/api/pagination";
import {
  readJson,
  badRequest,
  list,
  created,
  handleApiError,
} from "@/lib/api";

const sortableColumn = { id: "ID", hetHan: "HetHan", ten: "Ten" } as const;
type SortKey = keyof typeof sortableColumn;

export async function GET(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req);
    const { searchParams } = new URL(req.url);

    const sortByKey = (searchParams.get("sortBy") ?? "id") as SortKey;
    if (!(sortByKey in sortableColumn)) {
      throw badRequest("sortBy không hợp lệ", [
        { field: "sortBy", message: "sortBy không hợp lệ" },
      ]);
    }
    const sortBy = sortableColumn[sortByKey];
    const sortDir = searchParams.get("order") === "desc" ? "DESC" : "ASC";

    const page = parsePage(searchParams.get("page"));
    const pageSize = parsePageSize(searchParams.get("pageSize"));
    const offset = (page - 1) * pageSize;

    const pool = await getDb();

    const [result, countResult] = await Promise.all([
      pool
        .request()
        .input("UserID", sql.Int, Number(userId))
        .input("offset", sql.Int, offset)
        .input("pageSize", sql.Int, pageSize)
        .query(`
          SELECT ID, Ten, Mota, TrangThai, HetHan
          FROM [dbo].[CongViec]
          WHERE UserID = @UserID
          ORDER BY ${sortBy} ${sortDir}
          OFFSET @offset ROWS
          FETCH NEXT @pageSize ROWS ONLY
        `),
      pool
        .request()
        .input("UserID", sql.Int, Number(userId))
        .query(`
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

    const Ten = String(body.Ten ?? "").trim();
    const Mota = String(body.Mota ?? "").trim();
    const HetHan = body.HetHan;

    if (!Ten) {
      throw badRequest("Vui lòng nhập tên công việc", [
        { field: "Ten", message: "Vui lòng nhập tên công việc" },
      ]);
    }
    if (Ten.length > 255) {
      throw badRequest("Tên công việc không được vượt quá 255 ký tự", [
        { field: "Ten", message: "Tên công việc không được vượt quá 255 ký tự" },
      ]);
    }
    if (typeof HetHan !== "string" || isNaN(Date.parse(HetHan))) {
      throw badRequest("Ngày hết hạn không hợp lệ", [
        { field: "HetHan", message: "Ngày hết hạn không hợp lệ" },
      ]);
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

    return created(result.recordset[0]);
  } catch (error) {
    return handleApiError(error);
  }
}