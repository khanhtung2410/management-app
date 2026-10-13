"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
    return useSyncExternalStore(
        // subscribe
        (callback) => {
            const mql = window.matchMedia(query);
            mql.addEventListener("change", callback);
            return () => mql.removeEventListener("change", callback);
        },
        // getSnapshot (client)
        () => window.matchMedia(query).matches,
        // getServerSnapshot (SSR)
        () => false,
    );
}