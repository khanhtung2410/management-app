import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireRole, ForbiddenError, UnauthorizedError } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { GET } from "./route";
import { asDb, authAdmin, mockPool, req } from "@/lib/test/helpers";

vi.mock("@/lib/auth", async () => {
    const { authMockFactory } = await import("@/lib/test/helpers");
    return authMockFactory();
});
vi.mock("@/lib/db", () => ({ getDb: vi.fn() }));

describe("GET /api/admin/users", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(requireRole).mockResolvedValue(authAdmin);
    });

    it("trả 401 khi không đăng nhập", async () => {
        vi.mocked(requireRole).mockRejectedValue(new UnauthorizedError());
        const res = await GET(req("GET", "/api/admin/users"));
        expect(res.status).toBe(401);
        expect(await res.json()).toEqual({
            error: { code: "UNAUTHENTICATED", message: expect.any(String) },
        });
    });

    it("trả 403 khi sai role", async () => {
        vi.mocked(requireRole).mockRejectedValue(new ForbiddenError());
        const res = await GET(req("GET", "/api/admin/users"));
        expect(res.status).toBe(403);
        expect(await res.json()).toEqual({
            error: { code: "FORBIDDEN", message: expect.any(String) },
        });
    });

    it("trả 200 với meta phân trang", async () => {
        vi.mocked(getDb).mockResolvedValue(
            asDb(mockPool([
                { recordset: [{ ID: 1, HoTen: "A", Email: "a@x.com", SDT: "", TrangThai: 1 }] },
                { recordset: [{ total: 1 }] },
            ])),
        );
        const res = await GET(req("GET", "/api/admin/users?page=1&pageSize=10"));
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.data).toHaveLength(1);
        expect(body.meta).toEqual({ page: 1, pageSize: 10, total: 1, totalPages: 1 });
    });

    it("trim search trước khi truyền vào database", async () => {
        const capturedSearch: unknown[] = [];
        const chain = {
            input: vi.fn(),
            query: vi.fn(),
        };
        chain.input.mockImplementation(
            (name: string, _type: unknown, value: unknown) => {
                if (name === "search") capturedSearch.push(value);
                return chain;
            },
        );
        chain.query
            .mockResolvedValueOnce({ recordset: [] })
            .mockResolvedValueOnce({ recordset: [{ total: 0 }] });

        vi.mocked(getDb).mockResolvedValue(
            asDb(
                { request: () => chain } as unknown as Parameters<typeof asDb>[0],
            ),
        );

        const res = await GET(
            req("GET", "/api/admin/users?search=%20%20A%20%20"),
        );

        expect(res.status).toBe(200);
        expect(capturedSearch).toEqual(["A", "A"]);
    });

    // ─── page/pageSize validation ────────────────────────────────────────
    // Hợp đồng API mục 3.2/7: ngoài khoảng 1..100 (pageSize) và page < 1
    // phải trả 400 VALIDATION_ERROR, không được kẹp im lặng.
    describe("page/pageSize", () => {
        it.each([
            ["pageSize=0", "pageSize"],
            ["pageSize=999", "pageSize"],
            ["pageSize=1000000", "pageSize"],
            ["pageSize=abc", "pageSize"],
            ["pageSize=1.5", "pageSize"],
            ["page=0", "page"],
            ["page=abc", "page"],
            ["page=1.5", "page"],
        ])("trả 400 VALIDATION_ERROR cho ?%s (field %s)", async (query, field) => {
            const res = await GET(req("GET", `/api/admin/users?${query}`));
            expect(res.status).toBe(400);

            const body = await res.json();
            expect(body.error).toMatchObject({ code: "VALIDATION_ERROR" });
            expect(body.error.details).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ field }),
                ]),
            );
            // validate phải chạy trước khi chạm DB
            expect(getDb).not.toHaveBeenCalled();
        });

        it("chấp nhận pageSize = 100 (biên trên)", async () => {
            vi.mocked(getDb).mockResolvedValue(
                asDb(mockPool([
                    { recordset: [] },
                    { recordset: [{ total: 0 }] },
                ])),
            );
            const res = await GET(req("GET", "/api/admin/users?pageSize=100"));
            expect(res.status).toBe(200);
            expect((await res.json()).meta.pageSize).toBe(100);
        });
    });

    it("gom lỗi sortBy và page vào cùng một details", async () => {
        const res = await GET(
            req("GET", "/api/admin/users?sortBy=foobar&page=0"),
        );
        expect(res.status).toBe(400);

        const body = await res.json();
        expect(body.error.code).toBe("VALIDATION_ERROR");
        expect(body.error.details).toHaveLength(2);
        expect(
            body.error.details.map((detail: { field: string }) => detail.field),
        ).toEqual(["sortBy", "page"]);
        expect(body.error.message).toBe(body.error.details[0].message);
        expect(getDb).not.toHaveBeenCalled();
    });

    // ─── sortBy validation ────────────────────────────────────────────────
    describe("sortBy", () => {
        it("trả 200 khi không truyền sortBy (mặc định id)", async () => {
            vi.mocked(getDb).mockResolvedValue(
                asDb(mockPool([
                    { recordset: [] },
                    { recordset: [{ total: 0 }] },
                ])),
            );
            const res = await GET(req("GET", "/api/admin/users"));
            expect(res.status).toBe(200);
        });

        it("trả 200 với sortBy=id", async () => {
            vi.mocked(getDb).mockResolvedValue(
                asDb(mockPool([
                    { recordset: [] },
                    { recordset: [{ total: 0 }] },
                ])),
            );
            const res = await GET(req("GET", "/api/admin/users?sortBy=id"));
            expect(res.status).toBe(200);
        });

        it("trả 400 với sortBy=hoTen để khớp mock API", async () => {
            const res = await GET(
                req("GET", "/api/admin/users?sortBy=hoTen"),
            );
            expect(res.status).toBe(400);
            expect(await res.json()).toMatchObject({
                error: { code: "VALIDATION_ERROR" },
            });
            expect(getDb).not.toHaveBeenCalled();
        });

        // Regression: trước đây sortableColumn["constructor"] trả Function (truthy)
        // → `?? "ID"` không chặn → ORDER BY <function> → SQL syntax error → 500
        it.each([
            "constructor",
            "toString",
            "hasOwnProperty",
            "valueOf",
            "__proto__",
            "isPrototypeOf",
            "__defineGetter__",
            "__lookupGetter__",
        ])("trả 400 (không phải 500) với sortBy prototype chain: %s", async (sortBy) => {
            const res = await GET(req("GET", `/api/admin/users?sortBy=${sortBy}`));
            expect(res.status).toBe(400);
            expect(await res.json()).toMatchObject({
                error: { code: "VALIDATION_ERROR", message: expect.any(String) },
            });
            // validate phải chạy trước khi chạm DB
            expect(getDb).not.toHaveBeenCalled();
        });

        // Behavior change: trước đây fallback im lặng về "ID" → 200
        // Giờ 400 để nhất quán với /api/tasks
        it.each(["foo", "createdAt", "email", "id2", ""])(
            "trả 400 với sortBy lạ (trước là 200 silent fallback): %j",
            async (sortBy) => {
                const res = await GET(
                    req("GET", `/api/admin/users?sortBy=${sortBy}`),
                );
                expect(res.status).toBe(400);
                expect(await res.json()).toMatchObject({
                    error: { code: "VALIDATION_ERROR", message: expect.any(String) },
                });
                expect(getDb).not.toHaveBeenCalled();
            },
        );

        it("trả details[0].field = 'sortBy' khi sortBy không hợp lệ", async () => {
            const res = await GET(req("GET", "/api/admin/users?sortBy=constructor"));
            expect(res.status).toBe(400);
            const body = await res.json();
            expect(body.error.details).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ field: "sortBy" }),
                ]),
            );
        });
    });
});
