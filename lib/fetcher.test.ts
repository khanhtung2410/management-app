import { afterEach, describe, expect, it, vi } from "vitest";
import { mockFetcher } from "@/lib/mock/mockFetcher";

afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
});

describe("fetcher", () => {
    it("uses mockFetcher when mock API mode is enabled", async () => {
        vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "true");

        const { fetcher } = await import("./fetcher");

        expect(fetcher).toBe(mockFetcher);
    });

    it("uses the real fetch implementation when mock API mode is disabled", async () => {
        vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "false");

        const { fetcher } = await import("./fetcher");

        expect(fetcher).toBe(fetch);
    });
});
