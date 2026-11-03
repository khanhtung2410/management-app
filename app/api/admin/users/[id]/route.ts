import { NextRequest } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { userRole } from "@/constants/roles";
import { userStatus } from "@/constants/statuses";
import { isUniqueViolation } from "@/lib/db/errors";
import { revalidatePath, revalidateTag } from "next/cache";
import {
    readJson,
    badRequest,
    notFound,
    ok,
    handleApiError,
    conflict,
    type ErrorDetail,
} from "@/lib/api";
import { validateUserFields } from "@/lib/validation/user";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { userId: currentUserId } = await requireRole(request, userRole.ADMIN);

        const { id } = await params;
        const targetId = Number(id);
        if (!Number.isInteger(targetId) || targetId <= 0) {
            throw badRequest("ID người dùng không hợp lệ", [
                { field: "id", message: "ID người dùng không hợp lệ" },
            ]);
        }

        const body = await readJson(request);
        const { TrangThai, HoTen, Email, SDT } = body;

        const hasStatus = TrangThai !== undefined;
        const hasProfile = HoTen !== undefined || Email !== undefined || SDT !== undefined;

        if (!hasStatus && !hasProfile) {
            throw badRequest("Không có trường nào để cập nhật");
        }

        // ─── Gom lỗi TrangThai và profile vào cùng một mảng ───
        // Hợp đồng API mục 4.1/6.2: details phải liệt kê mọi trường sai,
        // không dừng ở lỗi đầu tiên.
        const details: ErrorDetail[] = [];

        // ─── Validate status ───
        if (hasStatus) {
            if (TrangThai !== userStatus.Active && TrangThai !== userStatus.Inactive) {
                details.push({ field: "TrangThai", message: "Trạng thái không hợp lệ" });
            } else if (targetId === currentUserId) {
                // Không phải lỗi phân quyền (403 chỉ dùng cho vai trò) — đây là
                // quy tắc nghiệp vụ: admin không tự đổi trạng thái tài khoản của mình.
                details.push({
                    field: "TrangThai",
                    message: "Không thể đổi trạng thái của chính mình",
                });
            }
        }

        // ─── Validate profile (chỉ khi có ít nhất 1 trường profile) ───
        let hoTen: string | undefined;
        let email: string | undefined;
        let sdt: string | null | undefined;

        if (hasProfile) {
            const v = validateUserFields({ HoTen, Email, SDT }, { partial: true });
            if (!v.ok) {
                details.push(...v.details);
            } else {
                hoTen = v.data.HoTen;
                email = v.data.Email;
                sdt = v.data.SDT;
            }
        }

        if (details.length > 0) {
            throw badRequest(details[0].message, details);
        }

        const db = await getDb();

        // ─── Pre-check email trùng ───
        if (email !== undefined) {
            const dup = await db
                .request()
                .input("Email", sql.VarChar(255), email)
                .input("ID", sql.Int, targetId)
                .query("SELECT 1 FROM [User] WHERE Email = @Email AND ID <> @ID");
            if (dup.recordset.length > 0) {
                throw conflict("Email đã được sử dụng");
            }
        }

        // ─── Build SET động ───
        const sets: string[] = [];
        const req = db
            .request()
            .input("userId", sql.Int, targetId)
            .input("userRole", sql.Int, userRole.USER);

        if (hasStatus) {
            sets.push("TrangThai = @TrangThai");
            req.input("TrangThai", sql.Int, TrangThai as number);
        }
        if (hoTen !== undefined) { sets.push("HoTen = @HoTen"); req.input("HoTen", sql.NVarChar(255), hoTen); }
        if (email !== undefined) { sets.push("Email = @Email"); req.input("Email", sql.VarChar(255), email); }
        if (sdt  !== undefined) { sets.push("SDT = @SDT");   req.input("SDT",  sql.NVarChar(10), sdt);   }

        const updateQuery = `
      UPDATE [User]
      SET ${sets.join(", ")}
      OUTPUT
        INSERTED.ID, INSERTED.HoTen, INSERTED.Email, INSERTED.SDT, INSERTED.TrangThai
      WHERE ID = @userId
        AND RoleId = @userRole
    `;

        // ─── UPDATE + bắt race condition 2627/2601 ───
        let result: sql.IResult<unknown>;
        try {
            result = await req.query(updateQuery);
        } catch (error) {
            if (isUniqueViolation(error)) {
                throw conflict("Email đã được sử dụng");
            }
            throw error;
        }

        if (result.recordset.length === 0) {
            throw notFound("Không tìm thấy người dùng");
        }

        revalidatePath("/admin/users");
        revalidatePath("/admin/stat");
        revalidateTag("dashboard-summary", "max");

        return ok(result.recordset[0]);
    } catch (error) {
        return handleApiError(error);
    }
}
