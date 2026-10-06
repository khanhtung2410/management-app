import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { createToken } from "@/lib/auth";


export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Vui lòng nhập email và mật khẩu" },
                { status: 400 }
            );
        }

        const pool = await getDb();

        const result = await pool
            .request()
            .input("Email", sql.VarChar(255), email)
            .input("MK", sql.VarChar(255), password)
            .query(`
                SELECT ID, HoTen, Email, SDT, RoleId
                FROM [User]
                WHERE Email = @Email
                  AND MK = @MK
            `);

        if (result.recordset.length === 0) {
            return NextResponse.json(
                { message: "Email hoặc mật khẩu không đúng" },
                { status: 401 }
            );
        }

        const user = result.recordset[0];

        const token = await createToken(
            user.ID,
            user.HoTen,
            user.RoleId
        );

        const response = NextResponse.json({
            message: "Đăng nhập thành công",
        });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });
        return response;
    } catch (error) {
        console.error("LOGIN ERROR:", error);

        return NextResponse.json(
            { message: "Lỗi kết nối database" },
            { status: 500 }
        );
    }
}