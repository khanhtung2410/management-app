import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import sql from "mssql";
import { requireRole } from "@/lib/auth";
import { userRole } from "@/constants/roles";
import { taskStatus } from "@/constants/statuses";

export async function GET(req: NextRequest) {
    try {
        await requireRole(req, userRole.ADMIN);

        const pool = await getDb();

        // Tổng người dùng thường
        const [userResult,taskResult] = await Promise.all([
            pool
            .request()
            .input("userRole", sql.Int,userRole.USER)
            .query(`
                SELECT COUNT(*) AS totalUsers
                FROM [dbo].[User]
                WHERE RoleId = @userRole
            `),
            // Thống kê công việc — tính động 3 trạng thái
            // Active   = TrangThai 0 + còn hạn
            // Complete = TrangThai 1
            // Overdue  = TrangThai 0 + đã quá hạn
            pool
            .request()
            .input("statusActive",sql.TinyInt,taskStatus.Active)
            .input("statusComplete",sql.TinyInt,taskStatus.Complete)
            .query(`
                SELECT
                    COUNT(*) AS totalTasks,

                    SUM(CASE 
                        WHEN TrangThai = @statusActive AND HetHan >= GETDATE() 
                        THEN 1 ELSE 0 
                    END) AS DangThucHien,

                    SUM(CASE 
                        WHEN TrangThai = @statusComplete
                        THEN 1 ELSE 0 
                    END) AS HoanThanh,

                    SUM(CASE 
                        WHEN TrangThai = @statusActive AND HetHan < GETDATE() 
                        THEN 1 ELSE 0 
                    END) AS QuaHan

                FROM [dbo].[CongViec]
            `),
        ])

        const totalUsers = Number(userResult.recordset[0]?.totalUsers || 0);

        const row = taskResult.recordset[0];
        const totalTasks = Number(row?.totalTasks || 0);
        const dangThucHien = Number(row?.DangThucHien || 0);
        const hoanThanh = Number(row?.HoanThanh || 0);
        const quaHan = Number(row?.QuaHan || 0);

        const getPercent = (value: number) => {
            if (totalTasks === 0) return 0;
            return Math.round((value / totalTasks) * 10000) / 100;
        };

        return NextResponse.json({
            totalUsers,
            totalTasks,
            taskStats: [
                {
                    status: taskStatus.Active,
                    name: "Đang thực hiện",
                    total: dangThucHien,
                    percent: getPercent(dangThucHien),
                },
                {
                    status: taskStatus.Complete,
                    name: "Hoàn thành",
                    total: hoanThanh,
                    percent: getPercent(hoanThanh),
                },
                {
                    status: taskStatus.Overdue,
                    name: "Quá hạn",
                    total: quaHan,
                    percent: getPercent(quaHan),
                },
            ],
        });
    } catch (error) {
        console.error("GET DASHBOARD ERROR:", error);
        return NextResponse.json(
            { message: "Lỗi khi lấy dữ liệu Dashboard" },
            { status: 500 }
        );
    }
}