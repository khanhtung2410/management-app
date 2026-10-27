import { NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { createToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { userStatus } from "@/constants/statuses";


export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);
        if (!body) {
            return NextResponse.json(
                { message: "Dữ liệu không hợp lệ" },
                { status: 400 }
            );
        }

        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { message: "Vui lòng nhập email và mật khẩu" },
                { status: 400 }
            );
        }

        const pool = await getDb();

        const result = await pool
            .request()
            .input("Email", sql.NVarChar(255), email)
            .query(`
                SELECT ID, HoTen, Email, SDT, RoleId, PasswordHash, TrangThai
                FROM [User]
                WHERE Email = @Email
            `);

        if (result.recordset.length === 0) {
            return NextResponse.json(
                { message: "Email hoặc mật khẩu không đúng" },
                { status: 401 }
            );
        }

        const user = result.recordset[0];

        const ok = await bcrypt.compare(password, user.PasswordHash)
        if (!ok) {
            return NextResponse.json(
                { message: "Email hoặc mật khẩu không đúng" },
                { status: 401 }
            )
        }

        if (Number(user.TrangThai) !== userStatus.Active) {
            return NextResponse.json(
                { message: "Tài khoản của bạn đã bị khóa" },
                { status: 401 }
            )
        }

        const token = await createToken({
            userId: user.ID,
            userName: user.HoTen,
            roleId: user.RoleId,
        });

        const response = NextResponse.json({
            message: "Đăng nhập thành công",
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
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