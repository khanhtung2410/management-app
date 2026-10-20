import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/auth/errors";

export async function GET(request: NextRequest) {
    try {
        const { userId, userName, roleId } = await requireAuth(request);

        return NextResponse.json({
            isLoggedIn: true,
            userId,
            userName,
            roleId,
        });
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { isLoggedIn: false },
                { status: 401 }
            );
        }

        console.error("GET ME ERROR:", error);
        return NextResponse.json(
            { isLoggedIn: false },
            { status: 500 }
        );
    }
}