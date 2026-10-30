import { NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import {
    AccountLockedError,
    ForbiddenError,
    UnauthorizedError,
} from "@/lib/auth/errors";
import { ApiError, type ErrorCode, type ErrorDetail } from "./errors";

export interface ListMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

/** 200 + object trần (một bản ghi, hoặc body đặc biệt như login/me). */
export function ok<T>(data: T): NextResponse<T> {
    return NextResponse.json(data, { status: 200 });
}

/** 201 + bản ghi vừa tạo. */
export function created<T>(data: T): NextResponse<T> {
    return NextResponse.json(data, { status: 201 });
}

/** 200 + `{ data, meta }` cho danh sách — meta bắt buộc đủ 4 khoá. */
export function list<T>(data: T[], meta: ListMeta): NextResponse<{ data: T[]; meta: ListMeta }> {
    return NextResponse.json({ data, meta }, { status: 200 });
}

function errorResponse(
    status: number,
    code: ErrorCode,
    message: string,
    details?: ErrorDetail[],
): NextResponse {
    const body =
        details && details.length > 0
            ? { error: { code, message, details } }
            : { error: { code, message } };
    return NextResponse.json(body, { status });
}

/**
 * Chuẩn hoá MỌI lỗi thành response lỗi theo mục 4:
 *   - lỗi nội bộ của Next.js         → unstable_rethrow NÉM LẠI (redirect,
 *                                       notFound, NEXT_PRERENDER_INTERRUPTED, …)
 *   - ApiError                         → đúng status/code/message/details
 *   - UnauthorizedError                → 401 UNAUTHENTICATED
 *   - AccountLockedError               → 403 ACCOUNT_LOCKED
 *   - ForbiddenError                   → 403 FORBIDDEN
 *   - còn lại                          → 500 INTERNAL_ERROR + console.error
 */
export function handleApiError(error: unknown): NextResponse {
    // Cho Next.js xử lý lại các lỗi nội bộ của nó.
    // `unstable_rethrow` NÉM nếu là lỗi nội bộ (redirect/notFound/prerender
    // abort/…), và trả về bình thường nếu không phải. Không có bước này, các
    // lỗi như NEXT_PRERENDER_INTERRUPTED sẽ rơi vào nhánh 500 bên dưới và bị
    // log thành "[api] unhandled error" trong lúc build.
    unstable_rethrow(error);

    if (error instanceof ApiError) {
        return errorResponse(error.status, error.code, error.message, error.details);
    }

    if (error instanceof UnauthorizedError) {
        return errorResponse(401, "UNAUTHENTICATED", "Bạn cần đăng nhập");
    }
    if (error instanceof AccountLockedError) {
        return errorResponse(403, "ACCOUNT_LOCKED", "Tài khoản đã bị khoá");
    }
    if (error instanceof ForbiddenError) {
        return errorResponse(403, "FORBIDDEN", "Bạn không có quyền truy cập");
    }

    console.error("[api] unhandled error:", error);
    return errorResponse(
        500,
        "INTERNAL_ERROR",
        "Đã có lỗi xảy ra, vui lòng thử lại sau",
    );
}
