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
export async function POST(req: NextRequest) {
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

        const body = await req.json();

        const Ten = String(body.Ten || "").trim();
        const Mota = String(body.Mota || "").trim();
        const HetHan = body.HetHan;

        if (!Ten) {
            return NextResponse.json(
                { message: "Vui lòng nhập tên công việc" },
                { status: 400 }
            );
        }

        if (!HetHan) {
            return NextResponse.json(
                { message: "Vui lòng chọn ngày hết hạn" },
                { status: 400 }
            );
        }

        const pool = await getDb();

        const result = await pool
            .request()
            .input("UserID", sql.Int, Number(userId))
            .input("Ten", sql.NVarChar(255), Ten)
            .input("Mota", sql.NVarChar(sql.MAX), Mota)
            .input("TrangThai", sql.NVarChar(100), "Chưa hoàn thành")
            .input("HetHan", sql.DateTime, new Date(HetHan))
            .query(`
                INSERT INTO [dbo].[CongViec]
                (
                    UserID,
                    Ten,
                    Mota,
                    TrangThai,
                    HetHan
                )
                OUTPUT
                    INSERTED.ID,
                    INSERTED.Ten,
                    INSERTED.Mota,
                    INSERTED.TrangThai,
                    INSERTED.HetHan
                VALUES
                (
                    @UserID,
                    @Ten,
                    @Mota,
                    @TrangThai,
                    @HetHan
                )
            `);

        return NextResponse.json(
            result.recordset[0],
            { status: 201 }
        );
    } catch (error) {
        console.error("POST CONG VIEC ERROR:", error);

        return NextResponse.json(
            { message: "Lỗi khi tạo công việc" },
            { status: 500 }
        );
    }
}