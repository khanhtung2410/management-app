import { mockFetcher } from "@/lib/mock/mockFetcher";

export const fetcher: typeof fetch =
    process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
        ? mockFetcher
        : fetch;
