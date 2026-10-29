import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import sql from "mssql";
import { requireRole } from "@/lib/auth";
import { userRole } from "@/constants/roles";
import { STATUS_CONFIG, taskStatus } from "@/constants/statuses";
import { getPercent } from "@/lib/percent";
import { ok, handleApiError } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, userRole.ADMIN);

    const pool = await getDb();

    const [userResult, taskResult] = await Promise.all([
      pool
        .request()
        .input("userRole", sql.Int, userRole.USER)
        .query(`
          SELECT COUNT(*) AS totalUsers
          FROM [dbo].[User]
          WHERE RoleId = @userRole
        `),
      pool
        .request()
        .input("statusActive", sql.Int, taskStatus.Active)
        .input("statusComplete", sql.Int, taskStatus.Complete)
        .query(`
          SELECT
            COUNT(*) AS totalTasks,
            SUM(CASE WHEN TrangThai = @statusActive AND HetHan >= GETDATE()
                     THEN 1 ELSE 0 END) AS DangThucHien,
            SUM(CASE WHEN TrangThai = @statusComplete
                     THEN 1 ELSE 0 END) AS HoanThanh,
            SUM(CASE WHEN TrangThai = @statusActive AND HetHan < GETDATE()
                     THEN 1 ELSE 0 END) AS QuaHan
          FROM [dbo].[CongViec]
        `),
    ]);

    const totalUsers = Number(userResult.recordset[0]?.totalUsers || 0);
    const row = taskResult.recordset[0];
    const totalTasks = Number(row?.totalTasks || 0);

    const taskStats = [
      { status: taskStatus.Active,   total: Number(row?.DangThucHien || 0) },
      { status: taskStatus.Complete, total: Number(row?.HoanThanh  || 0) },
      { status: taskStatus.Overdue,  total: Number(row?.QuaHan     || 0) },
    ].map(({ status, total }) => ({
      status,
      name: STATUS_CONFIG[status].label,
      total,
      percent: getPercent(total, totalTasks),
    }));

    return ok({ totalUsers, totalTasks, taskStats });
  } catch (error) {
    return handleApiError(error);
  }
}