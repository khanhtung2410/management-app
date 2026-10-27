export const mockMode = {
    off: "off",
    on: "on",
    error: "error",
} as const;

export type MockModeType = (typeof mockMode)[keyof typeof mockMode];

/**
 * Đọc env đúng 1 lần ở module scope.
 * NEXT_PUBLIC_* được Next.js thay thế static ở build time — an toàn cho cả client và server.
 */
export const currentMockMode: MockModeType = (() => {
    const apiMode = process.env.NEXT_PUBLIC_MOCK_API_MODE;
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API;

    if (apiMode === "error") return mockMode.error;
    if (apiMode === "on" || apiMode === "true" || useMock === "true") {
        return mockMode.on;
    }
    return mockMode.off;
})();

export function isMockEnabled(): boolean {
    return currentMockMode !== mockMode.off;
}

export function isMockError(): boolean {
    return currentMockMode === mockMode.error;
}

const MOCK_RESPONSE_DELAY_MS = 500;

export function mockDelay(ms: number = MOCK_RESPONSE_DELAY_MS): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}