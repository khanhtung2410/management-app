import { UserRoleType } from "@/constants/roles";
import { JWTPayload} from "jose";

export interface AuthPayload extends JWTPayload {
    userId: number,
    userName: string,
    roleId: UserRoleType
}

export function isAuthPayload(p: JWTPayload): p is AuthPayload {
    return (
        typeof p.userId === "number" &&
        typeof p.userName === "string" &&
        typeof p.roleId === "number"
    )
}