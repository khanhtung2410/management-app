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

async function requireRolePage(requiredRole: UserRoleType): Promise<AuthPayload> {
    const token = (await cookies()).get("token")?.value;
    if (!token) redirect("/login");

    let payload: AuthPayload;
    try {
        payload = await verifyToken(token);
    } catch (error) {
        if (error instanceof UnauthorizedError) redirect("/login");
        throw error;
    }

    if (payload.roleId !== requiredRole) redirect("/403");
    return payload;
}

export function requireUserPage(): Promise<AuthPayload> {
    return requireRolePage(userRole.USER);
}

export function requireAdminPage(): Promise<AuthPayload> {
    return requireRolePage(userRole.ADMIN);
}