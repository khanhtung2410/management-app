import sql from "mssql";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { userStatus } from "@/constants/statuses";
import { userRole } from "@/constants/roles";
import {
  readJson,
  badRequest,
  conflict,
  created,
  handleApiError,
} from "@/lib/api";

const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await readJson(req);
    const { HoTen, Email, SDT, password } = body;

    if (
      typeof HoTen !== "string" ||
      typeof Email !== "string" ||
      typeof password !== "string"
    ) {
      throw badRequest("Dữ liệu không hợp lệ");
    }

    const hoTen = HoTen.trim();
    const email = Email.trim().toLowerCase();
    const sdt = typeof SDT === "string" ? SDT.trim() : "";

    if (!hoTen || hoTen.length < 2) {
      throw badRequest("Họ tên phải có ít nhất 2 ký tự");
    }
    if (!EMAIL_REGEX.test(email)) {
      throw badRequest("Email không hợp lệ");
    }
    if (password.length < 6) {
      throw badRequest("Mật khẩu phải có ít nhất 6 ký tự");
    }

    const pool = await getDb();

    const exists = await pool
      .request()
      .input("Email", sql.NVarChar(255), email)
      .query(`SELECT 1 AS found FROM [User] WHERE Email = @Email`);

    if (exists.recordset.length > 0) {
      throw conflict("Email đã được sử dụng");
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

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

    return created({
      message: "Đăng ký thành công",
      user: result.recordset[0],
    });
  } catch (error) {
    return handleApiError(error);
  }
}