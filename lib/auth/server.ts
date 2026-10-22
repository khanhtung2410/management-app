import "server-only";
import { cookies, headers } from "next/headers";
import { UnauthorizedError } from "./errors";
import type { AuthPayload } from "./payload";
import { getAuthFromRequest } from "./session";

export async function getAuth(): Promise<AuthPayload | null> {
    const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);

    try {
        return await getAuthFromRequest({
            cookies: cookieStore,
            headers: headerStore,
        });
    } catch (error) {
        if (error instanceof UnauthorizedError) return null;
        throw error;
    }
}
