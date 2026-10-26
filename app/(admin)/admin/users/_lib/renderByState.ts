import type { User } from "./api";
import { assertNever } from "@/lib/assertNever";

export type UsersState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: User[]; totalPages: number; total: number }
    | { status: "error"; message: string };

/**
 * Trả về thông báo hiển thị theo trạng thái, hoặc null nếu có dữ liệu để render.
 *
 * - idle / loading → "Đang tải dữ liệu..."
 * - error          → message lỗi
 * - success rỗng   → "Chưa có người dùng nào"
 * - success có data → null (component tự render list)
 *
 * switch + assertNever đảm bảo: thêm status mới vào UsersState mà quên
 * xử lý → lỗi compile ngay.
 */
export function renderByState(state: UsersState): string | null {
    switch (state.status) {
        case "idle":
        case "loading":
            return "Đang tải dữ liệu...";
        case "error":
            return state.message;
        case "success":
            return state.data.length === 0
                ? "Chưa có người dùng nào"
                : null;
        default:
            return assertNever(state);
    }
}