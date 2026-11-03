import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    failingMockFetcher,
    mockFetcher,
    resetMockUsers,
} from "./mockFetcher";

beforeEach(() => {
    resetMockUsers();
});

afterEach(() => {
    vi.useRealTimers();
});

// ─────────────────────────── Delay ───────────────────────────
describe("mockFetcher — delay", () => {
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

// ─────────────────────────── GET list ───────────────────────────
describe("mockFetcher — GET /api/admin/users", () => {
    it("trả paginated với meta shape mới", async () => {
        const response = await mockFetcher("/api/admin/users?page=2&pageSize=10");
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.meta).toEqual({
            page: 2,
            pageSize: 10,
            total: 20,
            totalPages: 2,
        });
        expect(result.data).toHaveLength(10);
        expect(result.data[0].ID).toBe(12);
        expect(result.data[0]).not.toHaveProperty("PasswordHash");
        // Không còn field flat
        expect(result).not.toHaveProperty("total");
        expect(result).not.toHaveProperty("page");
    });

    it("trả 400 khi pageSize = 0", async () => {
        const response = await mockFetcher("/api/admin/users?pageSize=0");
        expect(response.status).toBe(400);
        const result = await response.json();
        expect(result.error).toMatchObject({ code: "VALIDATION_ERROR" });
        expect(result.error.details?.[0]?.field).toBe("pageSize");
    });

    it("trả 400 khi pageSize = 999", async () => {
        const response = await mockFetcher("/api/admin/users?pageSize=999");
        expect(response.status).toBe(400);
        const result = await response.json();
        expect(result.error).toMatchObject({ code: "VALIDATION_ERROR" });
        expect(result.error.details?.[0]?.field).toBe("pageSize");
    });

    it("trả 400 khi sortBy không hợp lệ", async () => {
        const response = await mockFetcher("/api/admin/users?sortBy=foobar");
        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({
            error: {
                code: "VALIDATION_ERROR",
                message: "sortBy không hợp lệ",
                details: [{ field: "sortBy", message: "sortBy không hợp lệ" }],
            },
        });
    });

    it("gom lỗi sortBy và page vào cùng một details", async () => {
        const response = await mockFetcher(
            "/api/admin/users?sortBy=foobar&page=0",
        );
        expect(response.status).toBe(400);

        const result = await response.json();
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.details).toHaveLength(2);
        expect(
            result.error.details.map((detail: { field: string }) => detail.field),
        ).toEqual(["sortBy", "page"]);
        expect(result.error.message).toBe(result.error.details[0].message);
    });

    it("trả meta.totalPages = 0 khi danh sách rỗng", async () => {
        const response = await mockFetcher("/api/admin/users?search=zzz-no-match-zzz");
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.meta).toEqual({
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 0,
        });
        expect(result.data).toEqual([]);
    });

    it("lọc theo search", async () => {
        // Lấy 1 user từ danh sách đầy đủ để tìm
        const all = await (await mockFetcher("/api/admin/users?pageSize=100")).json();
        const first = all.data[0];
        const search = first.HoTen.split(" ")[0];

        const filtered = await (
            await mockFetcher(`/api/admin/users?search=${encodeURIComponent(search)}`)
        ).json();

        expect(filtered.data.length).toBeGreaterThan(0);
        expect(
            filtered.data.every(
                (u: { HoTen: string; Email: string }) =>
                    u.HoTen.includes(search) || u.Email.includes(search),
            ),
        ).toBe(true);
    });
});

// ─────────────────────────── Unknown routes ───────────────────────────
describe("mockFetcher — unknown routes", () => {
    it("trả 404 cho route lạ với error shape mới", async () => {
        const response = await mockFetcher("/api/unknown");
        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({
            error: { code: "NOT_FOUND", message: "Not mocked" },
        });
    });

    it.each([
        "/api/admin/dashboard/summary",
        "/api/admin/dashboard/tasks",
    ])("không còn mock %s (404)", async (path) => {
        const response = await mockFetcher(path);
        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({
            error: { code: "NOT_FOUND", message: "Not mocked" },
        });
    });
});
