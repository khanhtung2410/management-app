export function isAbortError(err: unknown): boolean {
    if (!(err instanceof DOMException)) return false;
    return err.name === "AbortError" || err.name === "TimeoutError";
}