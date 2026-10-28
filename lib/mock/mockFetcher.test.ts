import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockUser } from "./data";
import { failingMockFetcher, mockFetcher } from "./mockFetcher";

const originalUsers = mockUser.map((user) => ({ ...user }));

beforeEach(() => {
    mockUser.splice(
        0,
        mockUser.length,
        ...originalUsers.map((user) => ({ ...user })),
    );
});

afterEach(() => {
    vi.useRealTimers();
});

describe("mockFetcher", () => {
    it("waits 500ms before returning the mock response", async () => {
        vi.useFakeTimers();
        let settled = false;
        const responsePromise = mockFetcher("/api/admin/users").then((response) => {
            settled = true;
            return response;
        });

        await vi.advanceTimersByTimeAsync(499);
        expect(settled).toBe(false);

        await vi.advanceTimersByTimeAsync(1);
        await expect(responsePromise).resolves.toMatchObject({ status: 200 });
    });

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

    it("rejects unknown API routes", async () => {
        const response = await mockFetcher("/api/unknown");

        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({ message: "Not mocked" });
    });

    // ─── Thêm: xác nhận 2 endpoint dashboard đã bị gỡ khỏi mockFetcher ───
    it.each([
        "/api/admin/dashboard/summary",
        "/api/admin/dashboard/tasks",
    ])("no longer mocks %s (404 as unknown route)", async (path) => {
        const response = await mockFetcher(path);
        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({ message: "Not mocked" });
    });

    it("rejects after the mock loading delay in failure mode", async () => {
        vi.useFakeTimers();
        let settled = false;
        const rejection = expect(
            failingMockFetcher("/api/admin/users").finally(() => {
                settled = true;
            }),
        ).rejects.toThrow("Lỗi giả lập từ mock API.");

        await vi.advanceTimersByTimeAsync(499);
        expect(settled).toBe(false);

        await vi.advanceTimersByTimeAsync(1);
        await rejection;
    });
});