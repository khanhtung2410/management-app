import { SignJWT, jwtVerify } from "jose";
import { isAuthPayload, type AuthPayload } from "./payload"
import { UnauthorizedError } from "./errors";

const raw = process.env.JWT_SECRET;
if (!raw) throw new Error("JWT_SECRET is not set");
const secret = new TextEncoder().encode(raw);

type TokenInput = Pick<AuthPayload, "userId" | "userName" | "roleId">

export async function createToken(input: TokenInput): Promise<string> {
    return await new SignJWT({ ...input })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(secret);
}

export async function verifyToken(token: string): Promise<AuthPayload> {
    try {
        const { payload } = await jwtVerify(token, secret);

        if (!isAuthPayload(payload)) {
            throw new UnauthorizedError("Invalid payload");
        }

        return payload;
    } catch (err) {
        if (err instanceof UnauthorizedError) throw err;
        throw new UnauthorizedError("Invalid token");
    }
}

