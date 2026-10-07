import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Chưa đăng nhập" },
                { status: 401 }
            );
        }

        const payload = await verifyToken(token);
        const userId = payload.userId;
        const roleId = payload.roleId;
        if (!userId) {
            return NextResponse.json(
                { message: "Người dùng không hợp lệ" },
                { status: 401 }
            );
        }
        if (roleId !== 2) {
            return NextResponse.json(
                { message: "Bạn không có quyền truy cập" }, 
                { status: 403 } 
            );
        }

        const pool = await getDb();

        // Tổng người dùng
        const userResult = await pool
            .request()
            .query(`
                SELECT COUNT(*) AS totalUsers
                FROM [dbo].[User]
                WHERE RoleId = 1
            `);

        // Thống kê toàn bộ công việc
        const taskResult = await pool
            .request()
            .query(`
                SELECT
                    COUNT(*) AS totalTasks,

                    SUM(
                        CASE
                            WHEN TrangThai = N'Chưa hoàn thành'
                            THEN 1
                            ELSE 0
                        END
                    ) AS ChuaHoanThanh,

                    SUM(
                        CASE
                            WHEN TrangThai = N'Đang thực hiện'
                            THEN 1
                            ELSE 0
                        END
                    ) AS DangThucHien,

                    SUM(
                        CASE
                            WHEN TrangThai = N'Hoàn thành'
                            THEN 1
                            ELSE 0
                        END
                    ) AS HoanThanh

                FROM [dbo].[CongViec]
            `);

        const totalUsers = Number(
            userResult.recordset[0]?.totalUsers || 0
        );

        const row = taskResult.recordset[0];

        const totalTasks = Number(
            row?.totalTasks || 0
        );

        const chuaHoanThanh = Number(
            row?.ChuaHoanThanh || 0
        );

        const dangThucHien = Number(
            row?.DangThucHien || 0
        );

        const hoanThanh = Number(
            row?.HoanThanh || 0
        );

        const getPercent = (value: number) => {
            if (totalTasks === 0) {
                return 0;
            }

            return Math.round(
                (value / totalTasks) * 10000
            ) / 100;
        };

        return NextResponse.json({
            totalUsers,
            totalTasks,

            taskStats: [
                {
                    status: "Chưa hoàn thành",
                    name: "Chưa hoàn thành",
                    total: chuaHoanThanh,
                    percent: getPercent(chuaHoanThanh)
                },
                {
                    status: "Đang thực hiện",
                    name: "Đang thực hiện",
                    total: dangThucHien,
                    percent: getPercent(dangThucHien)
                },
                {
                    status: "Hoàn thành",
                    name: "Hoàn thành",
                    total: hoanThanh,
                    percent: getPercent(hoanThanh)
                }
            ]
        });
    } catch (error) {
        console.error("GET DASHBOARD ERROR:", error);

        return NextResponse.json(
            {
                message: "Lỗi khi lấy dữ liệu Dashboard"
            },
            {
                status: 500
            }
        );
    }
}