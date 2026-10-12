import { JWTPayload} from "jose";

export interface AuthPayload extends JWTPayload {
    userId: number,
    userName: string,
    roleId: number
}

export function isAuthPayload(p: JWTPayload): p is AuthPayload {
    return (
        typeof p.userId === "number" &&
        typeof p.userName === "string" &&
        typeof p.roleId === "number"
    )
}