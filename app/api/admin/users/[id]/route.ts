import { NextRequest } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { userRole } from "@/constants/roles";
import { userStatus } from "@/constants/statuses";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  readJson,
  badRequest,
  notFound,
  forbidden,
  ok,
  handleApiError,
  conflict,
} from "@/lib/api";

const PHONE_REGEX = /^0\d{9}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Vi phạm UNIQUE constraint / UNIQUE index của SQL Server:
 *   - 2627: UNIQUE constraint (UQ_User_Email)
 *   - 2601: UNIQUE index
 * Phải bắt vì giữa SELECT kiểm tra trùng và UPDATE vẫn có race condition (P2.3c).
 */
function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const n = (error as { number?: unknown }).number;
  return n === 2627 || n === 2601;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId: currentUserId } = await requireRole(request, userRole.ADMIN);

    const { id } = await params;
    const targetId = Number(id);
    if (!Number.isInteger(targetId) || targetId <= 0) {
      throw badRequest("ID người dùng không hợp lệ");
    }

    const body = await readJson(request);
    const { TrangThai, HoTen, Email, SDT } = body;

    const hasStatus = TrangThai !== undefined;
    const hasProfile =
      HoTen !== undefined || Email !== undefined || SDT !== undefined;

    if (!hasStatus && !hasProfile) {
      throw badRequest("Không có trường nào để cập nhật");
    }

    // ─── Validate status ───
    if (hasStatus) {
      if (
        TrangThai !== userStatus.Active &&
        TrangThai !== userStatus.Inactive
      ) {
        throw badRequest("Trạng thái không hợp lệ");
      }
      if (targetId === currentUserId) {
        throw forbidden("Không thể đổi trạng thái của chính mình");
      }
    }

    // ─── Validate profile ───
    let hoTen: string | undefined;
    let email: string | undefined;
    let sdt: string | undefined;

    if (HoTen !== undefined) {
      if (typeof HoTen !== "string" || HoTen.trim() === "") {
        throw badRequest("Họ tên không hợp lệ");
      }
      hoTen = HoTen.trim();
      if (hoTen.length > 255) {
        throw badRequest("Họ tên không được vượt quá 255 ký tự");
      }
    }

    if (Email !== undefined) {
      if (typeof Email !== "string") {
        throw badRequest("Email không hợp lệ");
      }
      // Chuẩn hoá lowercase trước khi so trùng / UPDATE để tránh
      // hai bản ghi chỉ khác case (collation CI che giấu việc này ở WHERE).
      const normalized = Email.trim().toLowerCase();
      if (
        normalized === "" ||
        normalized.length > 255 ||
        !EMAIL_REGEX.test(normalized)
      ) {
        throw badRequest("Email không hợp lệ");
      }
      email = normalized;
    }

    if (SDT !== undefined) {
      if (typeof SDT !== "string") {
        throw badRequest("Số điện thoại không hợp lệ");
      }
      sdt = SDT.trim();
      // Cho phép rỗng để xoá SĐT; nếu có giá trị phải đúng định dạng
      if (sdt !== "" && !PHONE_REGEX.test(sdt)) {
        throw badRequest("Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0");
      }
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
    if (hoTen !== undefined) {
      sets.push("HoTen = @HoTen");
      req.input("HoTen", sql.NVarChar(255), hoTen);
    }
    if (email !== undefined) {
      sets.push("Email = @Email");
      req.input("Email", sql.VarChar(255), email);
    }
    if (sdt !== undefined) {
      sets.push("SDT = @SDT");
      req.input("SDT", sql.VarChar(10), sdt);
    }

    const updateQuery = `
      UPDATE [User]
      SET ${sets.join(", ")}
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

    if (result.rowsAffected[0] === 0) {
      throw notFound("Không tìm thấy người dùng");
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin/stat");
    revalidateTag("dashboard-summary", "max");

    return ok({ message: "Cập nhật người dùng thành công" });
  } catch (error) {
    return handleApiError(error);
  }
}