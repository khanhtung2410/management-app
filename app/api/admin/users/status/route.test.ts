import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { userRole } from "@/constants/roles";
import { requireRole } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { PUT } from "./route";

vi.mock("@/lib/auth", () => ({
    ForbiddenError: class ForbiddenError extends Error {},
    requireRole: vi.fn(),
}));
vi.mock("@/lib/db", () => ({ getDb: vi.fn() }));

describe("PUT /api/admin/users/status", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(requireRole).mockResolvedValue({
            userId: 1,
            userName: "Admin",
            roleId: userRole.ADMIN,
        });
    });

    it.each([
        ["body rỗng", ""],
        ["JSON không hợp lệ", "{"],
    ])("trả 400 với %s và không truy cập database", async (_description, body) => {
        const request = new NextRequest(
            "http://localhost/api/admin/users/status",
            { method: "PUT", body },
        );

        const response = await PUT(request);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ message: "Body không hợp lệ" });
        expect(getDb).not.toHaveBeenCalled();
    });
});
