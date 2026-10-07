import { NextResponse } from "next/server";
import * as sql from "mssql";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
    try {
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
                WHERE RoleId = 1 
                And (
                    HoTen LIKE N'%' + @search + N'%' 
                    OR Email LIKE N'%' + @search + N'%')
                ORDER BY 
                    case when @order = 'asc' then ID end ASC,
                    case when @order = 'desc' then ID end DESC
                OFFSET @offset ROWS
                FETCH NEXT @pageSize ROWS ONLY
            `);

        const countResult = await db
            .request()
            .query(`
                SELECT COUNT(*) AS total
                FROM [User]
                WHERE RoleId = 1
            `);

        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / pageSize);

        return NextResponse.json({
            data: result.recordset,
            total,
            page,
            pageSize,
            totalPages
        });
    } catch (error) {
        console.error("GET USERS ERROR:", error);

        return NextResponse.json(
            { message: "Không thể lấy danh sách người dùng" },
            { status: 500 }
        );
    }
}
export async function PUT(request: Request) {
    try {
        const db = await getDb();
        const body = await request.json();

        const userId = Number(body.userId);

        if (!userId) {
            return NextResponse.json(
                { message: "ID người dùng không hợp lệ" },
                { status: 400 }
            );
        }

        // =========================
        // Đổi trạng thái
        // =========================
        if (body.status !== undefined) {
            const status = Number(body.status);

            if (status !== 0 && status !== 1) {
                return NextResponse.json(
                    { message: "Trạng thái không hợp lệ" },
                    { status: 400 }
                );
            }

            const result = await db
                .request()
                .input("userId", sql.Int, userId)
                .input("status", sql.TinyInt, status)
                .query(`
                    UPDATE [User]
                    SET TrangThai = @status
                    WHERE ID = @userId
                      AND RoleId = 1
                `);

            if (result.rowsAffected[0] === 0) {
                return NextResponse.json(
                    { message: "Không tìm thấy người dùng" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                message: "Cập nhật trạng thái thành công"
            });
        }

        // =========================
        // Sửa thông tin
        // =========================
        const HoTen = String(body.HoTen || "");
        const Email = String(body.Email || "");
        const SDT = String(body.SDT || "");

        if (!HoTen || !Email) {
            return NextResponse.json(
                { message: "Dữ liệu không hợp lệ" },
                { status: 400 }
            );
        }

        const result = await db
            .request()
            .input("userId", sql.Int, userId)
            .input("HoTen", sql.NVarChar(255), HoTen)
            .input("Email", sql.NVarChar(255), Email)
            .input("SDT", sql.NVarChar(50), SDT)
            .query(`
                UPDATE [User]
                SET
                    HoTen = @HoTen,
                    Email = @Email,
                    SDT = @SDT
                WHERE ID = @userId
                  AND RoleId = 1
            `);

        if (result.rowsAffected[0] === 0) {
            return NextResponse.json(
                { message: "Không tìm thấy người dùng" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Cập nhật người dùng thành công"
        });
    } catch (error) {
        console.error("UPDATE USER ERROR:", error);

        return NextResponse.json(
            { message: "Không thể cập nhật người dùng" },
            { status: 500 }
        );
    }
}
