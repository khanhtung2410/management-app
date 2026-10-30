import { UserStatusType } from "@/constants/statuses";
import { withTimeout } from "@/lib/withTimeout";
import { readApiError } from "@/lib/api/client";

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

/** Đọc message lỗi từ response dạng `{ error: { code, message } }`. */
export async function readApiErrorFromFetch(res: Response, fallback: string): Promise<string> {
    try {
        const body = (await res.json()) as Partial<{ error: { message?: string } }> & {
            message?: string;
        };
        return body?.error?.message ?? body?.message ?? fallback;
    } catch {
        return fallback;
    }
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
    if (!res.ok) throw new Error(await readApiError(res) || "Không thể lấy dữ liệu");

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