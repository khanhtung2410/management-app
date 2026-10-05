import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
    try {
        const db = await getDb();

        const result = await db
            .request()
            .query("SELECT ID, HoTen, Email, SDT FROM [User]");

        return NextResponse.json(result.recordset);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Không thể kết nối SQL Server" },
            { status: 500 }
        );
    }
}
