import { badRequest } from "./errors";

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
    allowed: T
): T[keyof T] {
    const key = raw ?? "id";

    if (!Object.hasOwn(allowed, key)) {
        throw badRequest("sortBy không hợp lệ", [
            { field: "sortBy", message: "sortBy không hợp lệ" },
        ]);
    }

    return allowed[key as keyof T];
}
