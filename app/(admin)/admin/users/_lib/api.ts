import { UserStatusType } from "@/constants/statuses";
import { withTimeout } from "@/lib/withTimeout";

export interface User {
    ID: number;
    HoTen: string;
    Email: string;
    SDT: string;
    TrangThai: UserStatusType;
}

export interface UsersMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface UsersPage {
    data: User[];
    meta: UsersMeta;
}

export interface FetchUsersParams {
    page: number;
    pageSize: number;
    sortBy?: "id"; // | "hoTen" | "email" | "sdt"
    order?: "asc" | "desc";
    search: string;
}

export type Fetcher = typeof fetch;

/** Payload cho server action updateUserProfileAction — giữ legacy `userId`. */
export interface UserUpdatePayload {
    userId: number;
    HoTen: string;
    Email: string;
    SDT: string;
}

/** Payload cho PATCH /api/admin/users/:id — field optional, không cần userId. */
export type UserPatchPayload = Partial<
    Pick<User, "HoTen" | "Email" | "SDT" | "TrangThai">
>;

export class UnauthorizedError extends Error {
    constructor() {
        super("Unauthorized");
        this.name = "UnauthorizedError";
    }
}

async function toError(res: Response, fallback: string): Promise<Error> {
    if (res.status === 401) return new UnauthorizedError();
    const body = (await res.json().catch(() => ({}))) as {
        error?: { message?: string };
    };
    return new Error(body.error?.message || fallback);
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

    const res = await fetchImpl(
        `/api/admin/users?${qs}`,
        withTimeout({ credentials: "include" }),
    );
    if (!res.ok) throw await toError(res, "Không thể lấy dữ liệu");

    const body = (await res.json()) as Partial<UsersPage>;
    return {
        data: body.data ?? [],
        meta: body.meta ?? {
            page,
            pageSize,
            total: 0,
            totalPages: 1,
        },
    };
}

/** Cập nhật 1 user qua PATCH /api/admin/users/:id — dùng cho trang admin. */
export async function updateUser(
    id: number,
    payload: UserPatchPayload,
    fetchImpl: Fetcher = fetch,
): Promise<void> {
    const res = await fetchImpl(
        `/api/admin/users/${id}`,
        withTimeout({
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }),
    );
    if (!res.ok) throw await toError(res, "Không thể cập nhật người dùng");
}