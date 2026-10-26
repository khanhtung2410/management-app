"use server"

import { userRole } from "@/constants/roles";
import { userStatus, UserStatusType } from "@/constants/statuses";
import { UnauthorizedError, verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import sql from "mssql";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function requireAdmin(): Promise<number> {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
        redirect("/login");
    }
    let userId: number
    let roleId: number;
    try {
        ({ roleId, userId } = await verifyToken(token));
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            redirect("/login");
        }
        throw error;
    }

    if (roleId !== userRole.ADMIN) {
        redirect("/403");
    }
    return userId;
}

//change user status
export async function updateUserStatusAction(
    userId: number,
    status: UserStatusType
): Promise<{ ok: true } | { ok: false; error: string }> {
    await requireAdmin();
    if (!Number.isInteger(userId) || userId <= 0) {
        return { ok: false, error: "ID người dùng không hợp lệ" }
    }
    if (status !== userStatus.Active && status !== userStatus.Inactive) {
        return { ok: false, error: "Trạng thái không hợp lệ" };
    }

    const pool = await getDb();
    const result = await pool.request()
        .input("ID", sql.Int, userId)
        .input("TrangThai", sql.Int, status)
        .query("UPDATE [dbo].[User] SET TrangThai = @TrangThai WHERE ID = @ID")

    if (result.rowsAffected[0] === 0) return { ok: false, error: "Không tìm thấy người dùng" }

    revalidatePath("/admin/users");
    return { ok: true };
}

//change user profile
export async function updateUserProfileAction(
    payload: { userId: number; HoTen: string; Email: string; SDT: string }
) {
    await requireAdmin();
    const { userId, HoTen, Email, SDT } = payload;
    const name = HoTen?.trim() ?? "";
    const email = Email?.trim().toLocaleLowerCase() ?? "";
    const sdt = SDT?.trim() ?? "";

    if (!Number.isInteger(userId) || userId <= 0) {
        return { ok: false, error: "ID người dùng không hợp lệ" }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { ok: false, error: "Email không hợp lệ" };
    }
    if (!/^0\d{9}$/.test(sdt)) {
        return { ok: false, error: "Sai định dạng số điện thoại" };
    }

    const pool = await getDb();

    const exists = await pool.request()
        .input("ID", sql.Int, userId)
        .query("SELECT 1 FROM [dbo].[User] WHERE ID = @ID");

    if (exists.recordset.length === 0) {
        return { ok: false, error: "Không tìm thấy người dùng" };
    }

    const dup = await pool.request()
        .input("Email", sql.NVarChar, email)
        .input("UserID", sql.Int, userId)
        .query("SELECT 1 FROM [dbo].[User] WHERE Email = @Email AND ID <> @UserID");

    if (dup.recordset.length > 0) {
        return { ok: false, error: "Email đã được sử dụng" };
    }

    const result = await pool.request()
        .input("ID", sql.Int, userId)
        .input("HoTen", sql.NVarChar, name)
        .input("Email", sql.NVarChar, email)
        .input("SDT", sql.NVarChar, sdt)
        .query(`
            UPDATE [dbo].[User]
            SET HoTen = @HoTen, Email = @Email, SDT = @SDT
            WHERE ID = @ID
        `);

    if (result.rowsAffected[0] === 0) {
        return { ok: false, error: "Không thể cập nhật — người dùng có thể đã bị xóa" };
    }

    revalidatePath("/admin/users");
    return { ok: true };
}