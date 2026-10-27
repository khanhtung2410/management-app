import {
    failingMockFetcher,
    mockFetcher,
} from "@/lib/mock/mockFetcher";
import { currentMockMode, mockMode } from "./mock/config";


export const fetcher: typeof fetch =
    currentMockMode === mockMode.error
        ? failingMockFetcher
        : currentMockMode === mockMode.on
            ? mockFetcher
            : fetch;
