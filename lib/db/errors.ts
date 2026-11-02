export function isUniqueViolation(error: unknown): boolean {
    if (typeof error !== "object" || error === null || !("number" in error)) {
        return false;
    }

    return error.number === 2627 || error.number === 2601;
}
