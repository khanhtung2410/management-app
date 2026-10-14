import { NextResponse } from "next/server";
import sql from "mssql";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { userStatus } from "@/constants/statuses";
import { userRole } from "@/constants/roles";

const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);
        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { message: "Dữ liệu không hợp lệ" },
                { status: 400 }
            );
        }

        const { HoTen, Email, SDT, password } = body as {
            HoTen?: unknown;
            Email?: unknown;
            SDT?: unknown;
            password?: unknown;
        };

        // ✅ Validate kiểu
        if (
            typeof HoTen !== "string" ||
            typeof Email !== "string" ||
            typeof password !== "string"
        ) {
            return NextResponse.json(
                { message: "Dữ liệu không hợp lệ" },
                { status: 400 }
            );
        }

        const hoTen = HoTen.trim();
        const email = Email.trim().toLowerCase();
        const sdt = typeof SDT === "string" ? SDT.trim() : "";

        // ✅ Validate nội dung
        if (!hoTen || hoTen.length < 2) {
            return NextResponse.json(
                { message: "Họ tên phải có ít nhất 2 ký tự" },
                { status: 400 }
            );
        }

        if (!EMAIL_REGEX.test(email)) {
            return NextResponse.json(
                { message: "Email không hợp lệ" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Mật khẩu phải có ít nhất 6 ký tự" },
                { status: 400 }
            );
        }

        const pool = await getDb();

        // ✅ Kiểm tra email đã tồn tại chưa
        const exists = await pool
            .request()
            .input("Email", sql.NVarChar(255), email)
            .query(`SELECT 1 AS found FROM [User] WHERE Email = @Email`);

        if (exists.recordset.length > 0) {
            return NextResponse.json(
                { message: "Email đã được sử dụng" },
                { status: 409 }
            );
        }

        // ✅ Hash password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // ✅ Insert user
        const result = await pool
            .request()
            .input("HoTen", sql.NVarChar(255), hoTen)
            .input("Email", sql.NVarChar(255), email)
            .input("SDT", sql.NVarChar(10), sdt)
            .input("PasswordHash", sql.NVarChar(255), passwordHash)
            .input("RoleId", sql.Int, userRole.USER)
            .input("TrangThai", sql.Int, userStatus.Active)
            .query(`
                INSERT INTO [User] (HoTen, Email, SDT, PasswordHash, RoleId, TrangThai)
                OUTPUT INSERTED.ID, INSERTED.HoTen, INSERTED.Email
                VALUES (@HoTen, @Email, @SDT, @PasswordHash, @RoleId, @TrangThai)
            `);

        return NextResponse.json(
            {
                message: "Đăng ký thành công",
                user: result.recordset[0],
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return NextResponse.json(
            { message: "Có lỗi xảy ra, vui lòng thử lại" },
            { status: 500 }
        );
    }
}