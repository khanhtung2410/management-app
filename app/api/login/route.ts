import { NextResponse } from "next/server";
import sql from "mssql";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { createToken } from "@/lib/auth";
import { userStatus } from "@/constants/statuses";
import {
  readJson,
  badRequest,
  unauthenticated,
  accountLocked,
  handleApiError,
} from "@/lib/api";

export async function POST(req: Request) {
  try {
    const body = await readJson(req);
    const { email, password } = body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password
    ) {
      throw badRequest("Vui lòng nhập email và mật khẩu");
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
      throw unauthenticated("Email hoặc mật khẩu không đúng");
    }

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      throw unauthenticated("Email hoặc mật khẩu không đúng");
    }

    if (Number(user.TrangThai) !== userStatus.Active) {
      throw accountLocked("Tài khoản của bạn đã bị khóa");
    }

    const token = await createToken({
      userId: user.ID,
      userName: user.HoTen,
      roleId: user.RoleId,
    });

    const response = NextResponse.json({ message: "Đăng nhập thành công" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}