"use server"

import { userRole } from "@/constants/roles";
import { userStatus, UserStatusType } from "@/constants/statuses";
import { UnauthorizedError, verifyToken } from "@/lib/auth";
import { getDb } from "@/lib/db";
import sql from "mssql";
import { revalidatePath, revalidateTag } from "next/cache";
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
    const currentUserId = await requireAdmin();
    if (!Number.isInteger(userId) || userId <= 0) {
        return { ok: false, error: "ID người dùng không hợp lệ" }
    }
    if (status !== userStatus.Active && status !== userStatus.Inactive) {
        return { ok: false, error: "Trạng thái không hợp lệ" };
    }
    if (userId === currentUserId) {
        return { ok: false, error: "Không thể đổi trạng thái của chính mình" };
    }

    const pool = await getDb();
    const result = await pool.request()
        .input("ID", sql.Int, userId)
        .input("TrangThai", sql.Int, status)
        .input("userRole", sql.Int, userRole.USER)
        .query("UPDATE [dbo].[User] SET TrangThai = @TrangThai WHERE ID = @ID AND RoleId = @userRole")

    if (result.rowsAffected[0] === 0) return { ok: false, error: "Không tìm thấy người dùng" }

    revalidatePath("/admin/users");
    revalidatePath("/admin/stat");
    revalidateTag("dashboard-summary", "max");
    return { ok: true };
}

//change user profile
export async function updateUserProfileAction(
    payload: { userId: number; HoTen: string; Email: string; SDT: string }
): Promise<{ ok: true } | {
    ok: false; error: string
}> {
    await requireAdmin();
    const { userId, HoTen, Email, SDT } = payload;
    const name = HoTen?.trim() ?? "";
    const email = Email?.trim().toLowerCase() ?? "";
    const sdt = SDT?.trim() ?? "";

    if (!Number.isInteger(userId) || userId <= 0) {
        return { ok: false, error: "ID người dùng không hợp lệ" }
    }
    if (email.length > 255 || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return { ok: false, error: "Email không hợp lệ" };
    }
    if (!name) return {
        ok: false, error: "Họ tên không được để trống"
    };
    if (name.length > 255) {
        return { ok: false, error: "Tên không hợp lệ" };
    }
    if (!/^0\d{9}$/.test(sdt)) {
        return { ok: false, error: "Sai định dạng số điện thoại" };
    }

    const pool = await getDb();

    const exists = await pool.request()
        .input("ID", sql.Int, userId)
        .input("userRole", sql.Int, userRole.USER)
        .query("SELECT 1 FROM [dbo].[User] WHERE ID = @ID AND RoleId = @userRole");

    if (exists.recordset.length === 0) {
        return { ok: false, error: "Không tìm thấy người dùng" };
    }

    const dup = await pool.request()
        .input("Email", sql.VarChar(255), email)
        .input("UserID", sql.Int, userId)
        .query("SELECT 1 FROM [dbo].[User] WHERE Email = @Email AND ID <> @UserID");

    if (dup.recordset.length > 0) {
        return { ok: false, error: "Email đã được sử dụng" };
    }

    const result = await pool.request()
        .input("ID", sql.Int, userId)
        .input("userRole", sql.Int, userRole.USER)
        .input("HoTen", sql.NVarChar(255), name)
        .input("Email", sql.VarChar(255), email)
        .input("SDT", sql.VarChar(10), sdt)
        .query(`
            UPDATE [dbo].[User]
            SET HoTen = @HoTen, Email = @Email, SDT = @SDT
            WHERE ID = @ID AND RoleId = @userRole
        `);

    if (result.rowsAffected[0] === 0) {
        return { ok: false, error: "Không thể cập nhật — người dùng có thể đã bị xóa" };
    }

    revalidatePath("/admin/users");
    return { ok: true };
}