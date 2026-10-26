import { userRole } from "@/constants/roles";
import {
    userStatus,
    type UserStatusType,
} from "@/constants/statuses";
import type { User as AdminUser } from "@/app/(admin)/admin/users/_lib/api";
import {
    getMockDashboardSummary,
    getMockRecentDashboardTasks,
} from "./dashboard";
import { mockUser } from "./data";

type MockUser = Pick<
    AdminUser,
    "ID" | "HoTen" | "Email" | "SDT" | "TrangThai"
>;

const MOCK_RESPONSE_DELAY_MS = 500;

function waitForMockResponse(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, MOCK_RESPONSE_DELAY_MS));
}

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

function getMockUsers(): MockUser[] {
    return mockUser
        .filter((user) => user.RoleId === userRole.USER)
        .map(({ ID, HoTen, Email, SDT, TrangThai }) => ({
            ID,
            HoTen,
            Email,
            SDT,
            TrangThai,
        }));
}

function parseBody(init?: RequestInit): Record<string, unknown> | null {
    if (typeof init?.body !== "string") return null;

    try {
        const body: unknown = JSON.parse(init.body);
        if (typeof body !== "object" || body === null || Array.isArray(body)) {
            return null;
        }
        return body as Record<string, unknown>;
    } catch {
        return null;
    }
}

export const mockFetcher: typeof fetch = async (input, init) => {
    await waitForMockResponse();

    const url =
        typeof input === "string"
            ? input
            : input instanceof URL
                ? input.toString()
                : input.url;
    const requestUrl = new URL(url, "http://localhost:3000");
    const method = (init?.method ?? (input instanceof Request ? input.method : "GET"))
        .toUpperCase();

    if (
        requestUrl.pathname === "/api/admin/dashboard/summary" &&
        method === "GET"
    ) {
        return jsonResponse(getMockDashboardSummary());
    }

    if (
        requestUrl.pathname === "/api/admin/dashboard/tasks" &&
        method === "GET"
    ) {
        return jsonResponse(getMockRecentDashboardTasks());
    }

    if (requestUrl.pathname === "/api/admin/users" && method === "GET") {
        const searchParams = requestUrl.searchParams;
        const page = Math.max(Number(searchParams.get("page")) || 1, 1);
        const pageSize = Math.max(Number(searchParams.get("pageSize")) || 10, 1);
        const order = searchParams.get("order") === "desc" ? "desc" : "asc";
        const search = (searchParams.get("search") ?? "").trim().toLowerCase();

        let users = getMockUsers();
        if (search) {
            users = users.filter(
                (user) =>
                    user.HoTen.toLowerCase().includes(search) ||
                    user.Email.toLowerCase().includes(search),
            );
        }

        users.sort((a, b) => {
            const comparison = a.ID - b.ID;
            return order === "asc" ? comparison : -comparison;
        });

        const total = users.length;
        const totalPages = Math.ceil(total / pageSize);
        const offset = (page - 1) * pageSize;

        return jsonResponse({
            data: users.slice(offset, offset + pageSize),
            total,
            page,
            pageSize,
            totalPages,
        });
    }

    if (requestUrl.pathname === "/api/admin/users/status" && method === "PUT") {
        const body = parseBody(init);
        const userId = Number(body?.userId);
        const status = body?.status;
        const user = mockUser.find(
            (candidate) =>
                candidate.ID === userId && candidate.RoleId === userRole.USER,
        );

        if (
            !body ||
            !Number.isInteger(userId) ||
            (status !== userStatus.Active && status !== userStatus.Inactive)
        ) {
            return jsonResponse({ message: "Dữ liệu không hợp lệ" }, 400);
        }
        if (!user) {
            return jsonResponse({ message: "Không tìm thấy người dùng" }, 404);
        }

        user.TrangThai = status as UserStatusType;
        return jsonResponse({ message: "Cập nhật trạng thái thành công" });
    }

    if (requestUrl.pathname === "/api/admin/users/profile" && method === "PUT") {
        const body = parseBody(init);
        const userId = Number(body?.userId);
        const { HoTen, Email, SDT } = body ?? {};
        const normalizedEmail =
            typeof Email === "string" ? Email.trim().toLowerCase() : "";
        const user = mockUser.find(
            (candidate) =>
                candidate.ID === userId && candidate.RoleId === userRole.USER,
        );

        if (
            !body ||
            !Number.isInteger(userId) ||
            typeof HoTen !== "string" ||
            HoTen.trim().length < 2 ||
            typeof Email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
            typeof SDT !== "string"
        ) {
            return jsonResponse({ message: "Dữ liệu không hợp lệ" }, 400);
        }
        if (!user) {
            return jsonResponse({ message: "Không tìm thấy người dùng" }, 404);
        }
        if (
            mockUser.some(
                (candidate) =>
                    candidate.ID !== userId &&
                    candidate.Email.toLowerCase() === normalizedEmail,
            )
        ) {
            return jsonResponse({ message: "Email đã được sử dụng" }, 409);
        }

        user.HoTen = HoTen.trim();
        user.Email = normalizedEmail;
        user.SDT = SDT.trim();
        return jsonResponse({ message: "Cập nhật người dùng thành công" });
    }

    return jsonResponse({ message: "Not mocked" }, 404);
};

export const failingMockFetcher: typeof fetch = async () => {
    await waitForMockResponse();
    throw new Error("Lỗi giả lập từ mock API.");
};
