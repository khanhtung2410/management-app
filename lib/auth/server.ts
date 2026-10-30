import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { userRole } from "@/constants/roles";
import type { UserRoleType } from "@/constants/roles";
import { AccountLockedError, UnauthorizedError } from "./errors";
import type { AuthPayload } from "./payload";
import { getAuthFromRequest } from "./session";

export async function getAuth(): Promise<AuthPayload | null> {
    const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
    try {
        return await getAuthFromRequest({
            cookies: cookieStore,
            headers: headerStore,
        });
    } catch (error) {
        // Tài khoản bị khoá cũng coi như không có phiên hợp lệ — tránh để
        // Navbar (Server Component) ném lỗi 500 khi token còn hạn.
        if (error instanceof UnauthorizedError || error instanceof AccountLockedError) {
            return null;
        }
        throw error;
    }
}

/**
 * Yêu cầu có phiên hợp lệ (kể cả tài khoản phải ở trạng thái Active).
 *
 * Dùng `getAuth()` — đã kiểm tra TrangThai qua `getAuthFromRequest` — thay
 * vì chỉ verifyToken. Nhờ vậy page tự bảo vệ mình, không phụ thuộc vào
 * proxy.ts để chặn tài khoản bị khoá.
 *
 * - Không có token / token hỏng → redirect /login.
 * - Tài khoản bị khoá → getAuth() trả null → redirect /login.
 */
async function getAuthOrRedirect(): Promise<AuthPayload> {
    const payload = await getAuth();
    if (!payload) redirect("/login");
    return payload;
}

async function requireRolePage(requiredRole: UserRoleType): Promise<AuthPayload> {
    const payload = await getAuthOrRedirect();
    if (payload.roleId !== requiredRole) redirect("/403");
    return payload;
}

/** Chỉ cần đăng nhập (tài khoản Active) — không ràng buộc role. */
export function requireAuthPage(): Promise<AuthPayload> {
    return getAuthOrRedirect();
}

export function requireUserPage(): Promise<AuthPayload> {
    return requireRolePage(userRole.USER);
}

export function requireAdminPage(): Promise<AuthPayload> {
    return requireRolePage(userRole.ADMIN);
}