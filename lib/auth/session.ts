import { UnauthorizedError } from "./errors";
import { verifyToken } from "./token"
import { AuthPayload } from "./payload";

export interface RequestLike{
    headers: { get(name: string): string | null }; 
    cookies: { get(name: string): {value: string} |undefined}
}

export async function getAuthFromRequest(req: RequestLike): Promise<AuthPayload> {
    const cookieToken = req.cookies.get("token")?.value;

    const prefix="Bearer "
    const header = req.headers.get("authorization");
    const headerToken = header?.startsWith(prefix) ? header.slice(prefix.length) : undefined;

    const token = cookieToken ?? headerToken;
    if (!token) {
        throw new UnauthorizedError("Missing token");
    }
    return verifyToken(token);
}