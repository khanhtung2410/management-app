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
} from "@/lib/api";

const PHONE_REGEX = /^0\d{9}$/;

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
      if (typeof Email !== "string" || Email.trim() === "") {
        throw badRequest("Email không hợp lệ");
      }
      email = Email.trim();
      if (email.length > 255) {
        throw badRequest("Email không được vượt quá 255 ký tự");
      }
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

    // ─── Build SET động ───
    const sets: string[] = [];
    const db = await getDb();
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
      req.input("Email", sql.NVarChar(255), email);
    }
    if (sdt !== undefined) {
      sets.push("SDT = @SDT");
      req.input("SDT", sql.NVarChar(10), sdt);
    }

    const result = await req.query(`
      UPDATE [User]
      SET ${sets.join(", ")}
      WHERE ID = @userId
        AND RoleId = @userRole
    `);

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