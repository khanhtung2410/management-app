export const DEFAULT_TIMEOUT_MS = 10_000;

export function withTimeout(
    init: RequestInit = {},
    timeoutMs = DEFAULT_TIMEOUT_MS,
): RequestInit {
    return {
        ...init,
        signal: init.signal ?? AbortSignal.timeout(timeoutMs),
    };
}