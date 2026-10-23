import { beforeEach, describe, expect, it } from "vitest";
import { userStatus } from "@/constants/statuses";
import { mockUser } from "./data";
import { mockFetcher } from "./mockFetcher";

const originalUsers = mockUser.map((user) => ({ ...user }));

beforeEach(() => {
    mockUser.splice(
        0,
        mockUser.length,
        ...originalUsers.map((user) => ({ ...user })),
    );
});

describe("mockFetcher", () => {
    it("returns paginated regular users without password hashes", async () => {
        const response = await mockFetcher("/api/admin/users?page=2&pageSize=10");
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toMatchObject({
            total: 20,
            page: 2,
            pageSize: 10,
            totalPages: 2,
        });
        expect(result.data).toHaveLength(10);
        expect(result.data[0].ID).toBe(12);
        expect(result.data[0]).not.toHaveProperty("PasswordHash");
    });

    it("updates a user's status", async () => {
        const response = await mockFetcher("/api/admin/users/status", {
            method: "PUT",
            body: JSON.stringify({ userId: 2, status: userStatus.Inactive }),
        });

        expect(response.status).toBe(200);
        expect(mockUser.find((user) => user.ID === 2)?.TrangThai).toBe(
            userStatus.Inactive,
        );
    });

    it("updates user profile fields", async () => {
        const response = await mockFetcher("/api/admin/users/profile", {
            method: "PUT",
            body: JSON.stringify({
                userId: 2,
                HoTen: "Nguyễn Minh Anh mới",
                Email: "MINHANH.NEW@example.com",
                SDT: "0912345678",
            }),
        });

        expect(response.status).toBe(200);
        expect(mockUser.find((user) => user.ID === 2)).toMatchObject({
            HoTen: "Nguyễn Minh Anh mới",
            Email: "minhanh.new@example.com",
            SDT: "0912345678",
        });
    });

    it("rejects unknown API routes", async () => {
        const response = await mockFetcher("/api/unknown");

        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({ message: "Not mocked" });
    });
});
