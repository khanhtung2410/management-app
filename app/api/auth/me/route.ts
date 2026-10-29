import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { ok, handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { userId, userName, roleId } = await requireAuth(request);
    return ok({ isLoggedIn: true, userId, userName, roleId });
  } catch (error) {
    return handleApiError(error);
  }
}