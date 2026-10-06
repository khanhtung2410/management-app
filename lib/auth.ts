import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET
);

export async function createToken(userId: number, userName: string, roleId: number) {
    return await new SignJWT({
        userId,
        userName,
        roleId,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(secret);
}

export async function verifyToken(token: string) {
    const { payload } = await jwtVerify(token, secret);
    return payload;
}