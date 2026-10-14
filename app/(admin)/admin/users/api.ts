import { UserStatusType } from "@/constants/statuses";

export interface User {
    ID: number;
    HoTen: string;
    Email: string;
    SDT: string;
    TrangThai: UserStatusType;
}

export interface UsersPage {
    data: User[];
    totalPages: number;
    total: number;
}

export interface FetchUsersParams {
    page: number;
    pageSize: number;
    sortBy?: "id" 
    // | "hoTen" | "email" | "sdt";
    order?: "asc" | "desc";
    search: string;
}

export type Fetcher = typeof fetch;

export class UnauthorizedError extends Error {
    constructor() {
        super("Unauthorized");
        this.name = "UnauthorizedError";
    }
}

async function toError(res: Response, fallback: string): Promise<Error> {
    if (res.status === 401) return new UnauthorizedError();
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    return new Error(body.message || fallback);
}

export async function fetchUsers(
    params: FetchUsersParams,
    fetchImpl: Fetcher = fetch,
): Promise<UsersPage> {
    const {
        page,
        pageSize,
        sortBy = "id",
        order = "asc",
        search,
    } = params;

    const qs = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        sortBy,        
        order,      
        search,
    });

    const res = await fetchImpl(`/api/admin/users?${qs}`, {
        credentials: "include",
    });
    if (!res.ok) throw await toError(res, "Không thể lấy dữ liệu");

    const body = await res.json();
    return {
        data: body.data ?? [],
        totalPages: body.totalPages ?? 1,
        total: body.total ?? 0,
    };
}

export async function updateUserStatus(
    userId: number,
    status: number,
    fetchImpl: Fetcher = fetch,
): Promise<void> {
    const res = await fetchImpl("/api/admin/users/status", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status }),
    });
    if (!res.ok) throw await toError(res, "Không thể cập nhật trạng thái");
}

export interface UserUpdatePayload {
    userId: number;
    HoTen: string;
    Email: string;
    SDT: string;
}

export async function updateUser(
    payload: UserUpdatePayload,
    fetchImpl: Fetcher = fetch,
): Promise<void> {
    const res = await fetchImpl("/api/admin/users/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw await toError(res, "Không thể lưu người dùng");
}