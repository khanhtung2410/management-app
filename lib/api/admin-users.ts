/**
 * Whitelist `sortBy` cho API admin users.
 *
 * Route thật và mock fetcher cùng import hằng số này để hai bên không thể
 * chấp nhận những cột sort khác nhau.
 */
export const adminUserSortColumns = { id: "ID" } as const;

/**
 * Chuẩn hoá `search` giống nhau ở route thật và mock.
 * Chỉ trim — không đổi hoa/thường; mock tự lowercase khi so khớp.
 */
export function normalizeAdminUserSearch(
    raw: string | null | undefined,
): string {
    return (raw ?? "").trim();
}
