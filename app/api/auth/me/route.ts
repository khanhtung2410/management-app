import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
   
    if (!token) {
        return NextResponse.json(
            { isLoggedIn: false },
            { status: 401 }
        );
    }

    try {
        const payload = await verifyToken(token);
        return NextResponse.json({
            isLoggedIn: true,
            userId: payload.userId,
            userName: payload.userName,
            roleId: payload.roleId,
        });
    } catch {
        return NextResponse.json(
            { isLoggedIn: false }),
            { status: 401 }
    }
}