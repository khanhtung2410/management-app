"use server"

import { userRole } from "@/constants/roles";
import { userStatus, UserStatusType } from "@/constants/statuses";
import { requireAdminPage } from "@/lib/auth/server";
import { getDb } from "@/lib/db";
import { currentMockMode, mockMode, mockDelay } from "@/lib/mock/config";
import sql from "mssql";
import { revalidatePath, updateTag } from "next/cache";

//change user status
export async function updateUserStatusAction(
    userId: number,
    status: UserStatusType
): Promise<{ ok: true } | { ok: false; error: string }> {
    const { userId: currentUserId } = await requireAdminPage();
    if (!Number.isInteger(userId) || userId <= 0) {
        return { ok: false, error: "ID người dùng không hợp lệ" }
    }
    if (status !== userStatus.Active && status !== userStatus.Inactive) {
        return { ok: false, error: "Trạng thái không hợp lệ" };
    }
    if (userId === currentUserId) {
        return { ok: false, error: "Không thể đổi trạng thái của chính mình" };
    }

    if (currentMockMode === mockMode.error) {
        return { ok: false, error: "Lỗi giả lập từ mock API." };
    }
    if (currentMockMode === mockMode.on) {
        await mockDelay();
        return { ok: true };
    }

    const pool = await getDb();
    const result = await pool.request()
        .input("ID", sql.Int, userId)
        .input("TrangThai", sql.Int, status)
        .input("userRole", sql.Int, userRole.USER)
        .query("UPDATE [dbo].[User] SET TrangThai = @TrangThai WHERE ID = @ID AND RoleId = @userRole")

    if (result.rowsAffected[0] === 0) return { ok: false, error: "Không tìm thấy người dùng" }

    revalidatePath("/admin/stat");
    updateTag("dashboard-summary");
    return { ok: true };
}

//change user profile
export type UserProfileData = {
    userId: number;
    HoTen: string;
    Email: string;
    SDT: string;
};

export type UpdateUserProfileResult =
    | { ok: true; data: UserProfileData }
    | { ok: false; error: string };

export async function updateUserProfileAction(
    payload: unknown,
): Promise<UpdateUserProfileResult> {
    await requireAdminPage();

    if (typeof payload !== "object" || payload === null) {
        return { ok: false, error: "Payload không hợp lệ" };
    }
    const { userId, HoTen, Email, SDT } = payload as Record<string, unknown>;

    if (typeof userId !== "number" || !Number.isInteger(userId) || userId <= 0) {
        return { ok: false, error: "ID người dùng không hợp lệ" };
    }
    if (typeof HoTen !== "string") {
        return { ok: false, error: "Họ tên không hợp lệ" };
    }
    if (typeof Email !== "string") {
        return { ok: false, error: "Email không hợp lệ" };
    }
    if (typeof SDT !== "string") {
        return { ok: false, error: "Số điện thoại không hợp lệ" };
    }

    const name = HoTen.trim();
    const email = Email.trim().toLowerCase();
    const sdt = SDT.trim();

    if (!name) {
        return { ok: false, error: "Họ tên không được để trống" };
    }
    if (name.length > 255) {
        return { ok: false, error: "Tên không hợp lệ" };
    }
    if (email.length > 255 || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return { ok: false, error: "Email không hợp lệ" };
    }
    if (!/^0\d{9}$/.test(sdt)) {
        return { ok: false, error: "Sai định dạng số điện thoại" };
    }

    if (currentMockMode === mockMode.error) {
        return { ok: false, error: "Lỗi giả lập từ mock API." };
    }
    if (currentMockMode === mockMode.on) {
        await mockDelay();
        return { ok: true, data: { userId, HoTen: name, Email: email, SDT: sdt } };
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

    return { ok: true, data: { userId, HoTen: name, Email: email, SDT: sdt } };
}