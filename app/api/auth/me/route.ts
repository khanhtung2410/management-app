import { NextRequest, NextResponse } from "next/server";
import sql from "mssql";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/auth/errors";
import { userStatus } from "@/constants/statuses";

export async function GET(request: NextRequest) {
    try {
        const { userId, userName, roleId } = await requireAuth(request);

        // Check TrangThai để đá user bị khóa giữa phiên
        const pool = await getDb();
        const result = await pool
            .request()
            .input("ID", sql.Int, Number(userId))
            .query(`SELECT TrangThai FROM [dbo].[User] WHERE ID = @ID`);

        const user = result.recordset[0];
        if (!user || Number(user.TrangThai) !== userStatus.Active) {
            return NextResponse.json(
                { isLoggedIn: false },
                { status: 401 }
            );
        }

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