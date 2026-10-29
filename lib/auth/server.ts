import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { userRole } from "@/constants/roles";
import type { UserRoleType } from "@/constants/roles";
import { UnauthorizedError } from "./errors";
import type { AuthPayload } from "./payload";
import { getAuthFromRequest } from "./session";
import { verifyToken } from "./token";

export async function getAuth(): Promise<AuthPayload | null> {
    const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
    try {
        return await getAuthFromRequest({
            cookies: cookieStore,
            headers: headerStore,
        });
    } catch (error) {
        if (error instanceof UnauthorizedError) return null;
        throw error;
    }
}

/**
 * Lấy payload từ cookie "token", hoặc redirect("/login") nếu thiếu/hỏng.
 * Dùng chung cho mọi guard "phải đăng nhập".
 */
async function getAuthPayloadOrRedirect(): Promise<AuthPayload> {
    const token = (await cookies()).get("token")?.value;
    if (!token) redirect("/login");

    try {
        return await verifyToken(token);
    } catch (error) {
        if (error instanceof UnauthorizedError) redirect("/login");
        throw error;
    }
}

async function requireRolePage(requiredRole: UserRoleType): Promise<AuthPayload> {
    const payload = await getAuthPayloadOrRedirect();
    if (payload.roleId !== requiredRole) redirect("/403");
    return payload;
}

/** Chỉ cần đăng nhập — không ràng buộc role. */
export function requireAuthPage(): Promise<AuthPayload> {
    return getAuthPayloadOrRedirect();
}

export function requireUserPage(): Promise<AuthPayload> {
    return requireRolePage(userRole.USER);
}

export function requireAdminPage(): Promise<AuthPayload> {
    return requireRolePage(userRole.ADMIN);
}