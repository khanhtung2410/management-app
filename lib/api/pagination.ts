import { ApiError, badRequest, type ErrorDetail } from "./errors";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

/**
 * Đọc một query param dạng số nguyên không âm.
 * Trả `null` khi raw không khớp `^\d+$` hoặc vượt giới hạn an toàn của number.
 */
function parseInteger(raw: string): number | null {
    if (!/^\d+$/.test(raw)) return null;

    const n = Number(raw);
    return Number.isSafeInteger(n) ? n : null;
}

/**
 * Chạy parser và gom lỗi `ApiError.details` vào mảng chung.
 * Lỗi không phải `ApiError` được ném lại ngay — đó là bug lập trình, không phải
 * lỗi validation.
 */
function parseOrCollect<T>(
    parse: () => T,
    field: string,
    details: ErrorDetail[],
): T | undefined {
    try {
        return parse();
    } catch (error) {
        if (!(error instanceof ApiError)) throw error;

        if (error.details && error.details.length > 0) {
            details.push(...error.details);
        } else {
            details.push({ field, message: error.message });
        }

        return undefined;
    }
}

/**
 * Parse `page`. Không truyền → mặc định `1`.
 * Không phải số nguyên dương → `400 VALIDATION_ERROR`.
 */
export function parsePage(raw: string | null | undefined): number {
    if (raw === null || raw === undefined || raw === "") return DEFAULT_PAGE;

    const page = parseInteger(raw);
    if (page === null || page < 1) {
        throw badRequest("page phải là số nguyên dương", [
            { field: "page", message: "page phải là số nguyên dương" },
        ]);
    }

    return page;
}

/**
 * Parse `pageSize`. Không truyền → `def` (mặc định `10`).
 * Không phải số nguyên trong khoảng `1..max` → `400 VALIDATION_ERROR`.
 */
export function parsePageSize(
    raw: string | null | undefined,
    def = DEFAULT_PAGE_SIZE,
    max = MAX_PAGE_SIZE,
): number {
    if (raw === null || raw === undefined || raw === "") return def;

    const pageSize = parseInteger(raw);
    if (pageSize === null || pageSize < 1 || pageSize > max) {
        const message = `pageSize phải nằm trong khoảng 1..${max}`;
        throw badRequest(message, [{ field: "pageSize", message }]);
    }

    return pageSize;
}

/**
 * Validate `sortBy` query param against a whitelist.
 *
 * - `raw` null/undefined → dùng key mặc định `"id"`.
 * - Không phải own property của `allowed` → throw 400 VALIDATION_ERROR.
 * - Dùng `Object.hasOwn` để không bị prototype chain (`toString`,
 *   `constructor`, `__proto__`...). Toán tử `in` KHÔNG dùng được — nó
 *   trả true cho key kế thừa từ Object.prototype, khiến giá trị trả về là
 *   một function và bị nội suy vào `ORDER BY ...` → SQL syntax error → 500.
 */
export function parseSort<T extends Record<string, string>>(
    raw: string | null | undefined,
    allowed: T,
): T[keyof T] {
    const key = raw ?? "id";

    if (!Object.hasOwn(allowed, key)) {
        throw badRequest("sortBy không hợp lệ", [
            { field: "sortBy", message: "sortBy không hợp lệ" },
        ]);
    }

    return allowed[key as keyof T];
}

export type ListQuery<T extends Record<string, string>> = {
    sortBy: T[keyof T];
    page: number;
    pageSize: number;
};

/**
 * Parse toàn bộ query param của endpoint danh sách (`sortBy`, `page`,
 * `pageSize`) và gom lỗi của cả ba parser vào một mảng `details` duy nhất.
 *
 * Hợp đồng API mục 4.1/6.2: khi nhiều query param cùng sai, response phải
 * liệt kê đủ mọi lỗi thay vì dừng ở lỗi đầu tiên.
 */
export function parseListQuery<T extends Record<string, string>>(
    searchParams: URLSearchParams,
    allowed: T,
): ListQuery<T> {
    const details: ErrorDetail[] = [];

    const sortBy = parseOrCollect(
        () => parseSort(searchParams.get("sortBy"), allowed),
        "sortBy",
        details,
    );
    const page = parseOrCollect(
        () => parsePage(searchParams.get("page")),
        "page",
        details,
    );
    const pageSize = parseOrCollect(
        () => parsePageSize(searchParams.get("pageSize")),
        "pageSize",
        details,
    );

    if (details.length > 0) {
        throw badRequest(details[0].message, details);
    }

    return {
        sortBy: sortBy as T[keyof T],
        page: page as number,
        pageSize: pageSize as number,
    };
}
