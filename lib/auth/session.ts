import sql from "mssql";
import { userStatus } from "@/constants/statuses";
import { getDb } from "@/lib/db";
import { UnauthorizedError } from "./errors";
import { verifyToken } from "./token"
import type { AuthPayload } from "./payload";

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

    const payload = await verifyToken(token);
    const pool = await getDb();
    const result = await pool
        .request()
        .input("ID", sql.Int, payload.userId)
        .query(`SELECT TrangThai FROM [dbo].[User] WHERE ID = @ID`);

    if (
        !result.recordset[0] ||
        Number(result.recordset[0].TrangThai) !== userStatus.Active
    ) {
        throw new UnauthorizedError("Account is inactive");
    }

    return payload;
}