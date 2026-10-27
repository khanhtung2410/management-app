import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { userRole } from "@/constants/roles";
import { taskStatus, userStatus } from "@/constants/statuses";
import { mockTasks, mockUser } from "./data";
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

    // ─── SỬA: dùng derived Overdue thay vì TrangThai === Overdue ───
    it("returns dashboard counts based on the typed mock data", async () => {
        const response = await mockFetcher("/api/admin/dashboard/summary");
        const summary = await response.json();

        const now = new Date();
        const regularUsers = mockUser.filter(
            (user) => user.RoleId === userRole.USER,
        );

        expect(summary).toEqual({
            totalUsers: regularUsers.length,
            activeUsers: regularUsers.filter(
                (user) => user.TrangThai === userStatus.Active,
            ).length,
            totalTasks: mockTasks.length,
            // Active + còn hạn (khớp SQL: TrangThai=Active AND HetHan >= GETDATE())
            activeTasks: mockTasks.filter(
                (task) =>
                    task.TrangThai === taskStatus.Active &&
                    new Date(task.HetHan) >= now,
            ).length,
            completedTasks: mockTasks.filter(
                (task) => task.TrangThai === taskStatus.Complete,
            ).length,
            // Derived Overdue: Active + quá hạn (khớp SQL: TrangThai=Active AND HetHan < GETDATE())
            overdueTasks: mockTasks.filter(
                (task) =>
                    task.TrangThai === taskStatus.Active &&
                    new Date(task.HetHan) < now,
            ).length,
        });
    });

    // ─── SỬA: bỏ check TrangThai === Overdue trực tiếp ─────────────
    it("returns the five latest dashboard tasks with their owners", async () => {
        const response = await mockFetcher("/api/admin/dashboard/tasks");
        const tasks = await response.json();

        expect(tasks).toHaveLength(5);
        expect(tasks[0]).toMatchObject({
            ID: 24,
            HoTen: "Lý Minh Khang",
            TrangThai: taskStatus.Active,
        });

        // Có ít nhất 1 task Complete (ID 22)
        expect(
            tasks.some(
                (task: { TrangThai: number }) =>
                    task.TrangThai === taskStatus.Complete,
            ),
        ).toBe(true);

        // Có ít nhất 1 task "sẽ hiển thị Overdue" (Active + quá hạn)
        // Task 20 (HetHan 2026-10-17) và 23 (HetHan 2026-10-16) đều quá hạn
        const now = new Date();
        const derivedOverdue = tasks.filter(
            (task: { TrangThai: number; HetHan: string }) =>
                task.TrangThai === taskStatus.Active &&
                new Date(task.HetHan) < now,
        );
        expect(derivedOverdue.length).toBeGreaterThan(0);
    });

    it("rejects unknown API routes", async () => {
        const response = await mockFetcher("/api/unknown");

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