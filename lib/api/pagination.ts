import { badRequest } from "./errors";

/** Parse + clamp page về ≥ 1. */
export function parsePage(raw: string | null): number {
    const n = Number(raw);
    return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

/** Parse + clamp pageSize về [1, max]. Default khi không truyền/không phải số. */
export function parsePageSize(raw: string | null, def = 10, max = 100): number {
    if (raw === null || raw === "") return def;
    const n = Number(raw);
    if (!Number.isFinite(n)) return def;
    return Math.min(Math.max(Math.floor(n), 1), max);
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