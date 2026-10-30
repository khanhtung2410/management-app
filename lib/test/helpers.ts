import { vi } from "vitest";
import { NextRequest } from "next/server";
import type { getDb } from "@/lib/db";
import { userRole } from "@/constants/roles";
import {
    AccountLockedError,
    AuthError,
    ForbiddenError,
    UnauthorizedError,
} from "@/lib/auth/errors";

// ─────────── Types ───────────
type Db = Awaited<ReturnType<typeof getDb>>;

interface QueryResult {
    recordset?: Record<string, unknown>[];
    rowsAffected?: number[];
}

interface QueryBuilder {
    input: (...args: unknown[]) => QueryBuilder;
    query: (sql?: string) => Promise<QueryResult>;
}

export interface PoolMock {
    request: () => QueryBuilder;
}

// ─────────── Auth mock factory ───────────
// Dùng lại class lỗi thật để `instanceof` trong handleApiError/proxy vẫn khớp
// khi module `@/lib/auth` bị mock.
export function authMockFactory() {
    return {
        AuthError,
        UnauthorizedError,
        ForbiddenError,
        AccountLockedError,
        requireAuth: vi.fn(),
        requireRole: vi.fn(),
        createToken: vi.fn(),
    };
}

// ─────────── mssql pool mock ───────────
export function mockPool(responses: QueryResult[]): PoolMock {
    let i = 0;
    const builder: QueryBuilder = {
        input: vi.fn(() => builder),
        query: vi.fn(() =>
            Promise.resolve(responses[i++] ?? { recordset: [], rowsAffected: [0] }),
        ),
    };
    return { request: vi.fn(() => builder) };
}

/** Ép `PoolMock` về kiểu mà `vi.mocked(getDb).mockResolvedValue` chấp nhận. */
export function asDb(mock: PoolMock): Db {
    return mock as unknown as Db;
}

// ─────────── Request builders ───────────
export function jsonReq(body: unknown, method = "POST", path = "/api") {
    return new NextRequest(`http://localhost${path}`, {
        method,
        headers: { "content-type": "application/json" },
        body: typeof body === "string" ? body : JSON.stringify(body),
    });
}

export function req(method = "GET", path = "/api") {
    return new NextRequest(`http://localhost${path}`, { method });
}

// ─────────── Auth context ───────────
export const authAdmin = { userId: 1, userName: "Admin", roleId: userRole.ADMIN };
export const authUser  = { userId: 2, userName: "User",  roleId: userRole.USER };

// ─────────── Body helpers ───────────
export interface ApiErrorBody {
    error: { code: string; message: string; details?: unknown };
}

export async function errorBody(res: Response): Promise<ApiErrorBody> {
    return (await res.json()) as ApiErrorBody;
}

export async function jsonBody<T>(res: Response): Promise<T> {
    return (await res.json()) as T;
}
