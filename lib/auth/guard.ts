import { getAuthFromRequest, type RequestLike } from "./session";
import { ForbiddenError } from "./errors";
import type { AuthPayload } from "./payload";
import { UserRoleType } from "@/constants/roles";

export async function requireAuth(req: RequestLike): Promise<AuthPayload> {
    return getAuthFromRequest(req);
}

export async function requireRole(
    req: RequestLike,
    roleId: UserRoleType
): Promise<AuthPayload> {
    const payload = await requireAuth(req);
    if (payload.roleId !== roleId) {
        throw new ForbiddenError();
    }
    return payload;
}