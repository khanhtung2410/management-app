import {
    failingMockFetcher,
    mockFetcher,
} from "@/lib/mock/mockFetcher";

const mockMode = process.env.NEXT_PUBLIC_MOCK_API_MODE;

export const fetcher: typeof fetch = mockMode === "error"
    ? failingMockFetcher
    : process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
        ? mockFetcher
        : fetch;
