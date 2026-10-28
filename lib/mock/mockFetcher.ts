import { userRole } from "@/constants/roles";
import type { User as AdminUser } from "@/app/(admin)/admin/users/_lib/api";
import { mockUser } from "./data";
import { mockDelay } from "./config";

type MockUser = Pick<
    AdminUser,
    "ID" | "HoTen" | "Email" | "SDT" | "TrangThai"
>;


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

export const mockFetcher: typeof fetch = async (input, init) => {
    await mockDelay();

    const url =
        typeof input === "string"
            ? input
            : input instanceof URL
                ? input.toString()
                : input.url;
    const requestUrl = new URL(url, "http://localhost:3000");
    const method = (init?.method ?? (input instanceof Request ? input.method : "GET"))
        .toUpperCase();

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

    return jsonResponse({ message: "Not mocked" }, 404);
};

export const failingMockFetcher: typeof fetch = async () => {
    await mockDelay();
    throw new Error("Lỗi giả lập từ mock API.");
};
