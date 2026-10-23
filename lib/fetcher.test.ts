import { afterEach, describe, expect, it, vi } from "vitest";
import { mockFetcher } from "@/lib/mock/mockFetcher";

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.resetModules();
});

describe("fetcher", () => {
    it("uses mockFetcher when mock API mode is enabled", async () => {
        vi.stubEnv("NEXT_PUBLIC_MOCK_API_MODE", "");
        vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "true");

        const { fetcher } = await import("./fetcher");

        expect(fetcher).toBe(mockFetcher);
    });

    it("uses the rejecting mock when error mode is enabled", async () => {
        vi.useFakeTimers();
        vi.stubEnv("NEXT_PUBLIC_MOCK_API_MODE", "error");
        vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "true");

        const { fetcher } = await import("./fetcher");
        const rejection = expect(fetcher("/api/admin/users")).rejects.toThrow(
            "Lỗi giả lập từ mock API.",
        );

        expect(fetcher).not.toBe(fetch);
        await vi.advanceTimersByTimeAsync(500);
        await rejection;
    });

    it("uses the real fetch implementation when mock API mode is disabled", async () => {
        vi.stubEnv("NEXT_PUBLIC_MOCK_API_MODE", "");
        vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");

        const { fetcher } = await import("./fetcher");

        expect(fetcher).toBe(fetch);
    });
});
