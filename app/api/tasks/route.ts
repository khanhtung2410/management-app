import { NextRequest,NextResponse } from "next/server";
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
        if (!userId) {
            return NextResponse.json(
                { message: "Người dùng không hợp lệ" },
                { status: 401 }
            );
        }
        const pool = await getDb();

        const result = await pool
            .request()
            .input("UserID", sql.Int, Number(userId))
            .query(`
                SELECT
                    ID,
                    Ten,
                    Mota,
                    TrangThai,
                    HetHan
                FROM [dbo].[CongViec]
                WHERE UserID = @UserID
                ORDER BY ID DESC
            `);

        return NextResponse.json(result.recordset);
    } catch (error) {
        console.error("GET CONG VIEC ERROR:", error);

        return NextResponse.json(
            { message: "Lỗi khi lấy danh sách công việc" },
            { status: 500 }
        );
    }
}