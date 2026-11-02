import { describe, it, expect } from "vitest";
import { ApiError } from "./errors";
import { parsePage, parsePageSize, parseSort } from "./pagination";

const allowed = { id: "ID", hetHan: "HetHan", ten: "Ten" } as const;

function captureError(fn: () => unknown): unknown {
    try {
        fn();
    } catch (error) {
        return error;
    }
    throw new Error("Mong đợi hàm ném lỗi nhưng không có lỗi nào");
}

describe("parsePage", () => {
    it("mặc định 1 khi không truyền hoặc rỗng", () => {
        expect(parsePage(null)).toBe(1);
        expect(parsePage(undefined)).toBe(1);
        expect(parsePage("")).toBe(1);
    });

    it("parse số nguyên dương", () => {
        expect(parsePage("1")).toBe(1);
        expect(parsePage("42")).toBe(42);
        expect(parsePage("007")).toBe(7);
    });

    it.each(["0", "-1", "1.5", "abc", "1abc", " 1", "1e2"])(
        "ném 400 VALIDATION_ERROR cho page=%j",
        (raw) => {
            const error = captureError(() => parsePage(raw));
            expect(error).toBeInstanceOf(ApiError);
            expect(error).toMatchObject({
                status: 400,
                code: "VALIDATION_ERROR",
                message: "page phải là số nguyên dương",
                details: [{ field: "page", message: "page phải là số nguyên dương" }],
            });
        },
    );
});

describe("parsePageSize", () => {
    it("mặc định 10 khi không truyền hoặc rỗng", () => {
        expect(parsePageSize(null)).toBe(10);
        expect(parsePageSize(undefined)).toBe(10);
        expect(parsePageSize("")).toBe(10);
    });

    it("dùng default tuỳ chỉnh", () => {
        expect(parsePageSize(null, 20)).toBe(20);
    });

    it("chấp nhận biên 1 và 100", () => {
        expect(parsePageSize("1")).toBe(1);
        expect(parsePageSize("100")).toBe(100);
    });

    it.each(["0", "-1", "101", "999", "1000000", "1.5", "abc", " 10"])(
        "ném 400 VALIDATION_ERROR cho pageSize=%j",
        (raw) => {
            const error = captureError(() => parsePageSize(raw));
            expect(error).toBeInstanceOf(ApiError);
            expect(error).toMatchObject({
                status: 400,
                code: "VALIDATION_ERROR",
                message: "pageSize phải nằm trong khoảng 1..100",
                details: [
                    {
                        field: "pageSize",
                        message: "pageSize phải nằm trong khoảng 1..100",
                    },
                ],
            });
        },
    );
});

describe("parseSort", () => {
    describe("valid keys", () => {
        it.each([
            ["id", "ID"],
            ["hetHan", "HetHan"],
            ["ten", "Ten"],
        ] as const)("maps %s → %s", (raw, expected) => {
            expect(parseSort(raw, allowed)).toBe(expected);
        });
    });

    describe("default when raw is null/undefined", () => {
        it("returns ID for null", () => {
            expect(parseSort(null, allowed)).toBe("ID");
        });

        it("returns ID for undefined", () => {
            expect(parseSort(undefined, allowed)).toBe("ID");
        });
    });

    // Regression cho bug: dùng toán tử `in` → prototype chain → 500
    describe("rejects prototype-chain keys", () => {
        it.each([
            "toString",
            "constructor",
            "hasOwnProperty",
            "isPrototypeOf",
            "valueOf",
            "__proto__",
            "__defineGetter__",
            "__lookupGetter__",
        ])("throws for %s", (raw) => {
            expect(() => parseSort(raw, allowed)).toThrow();
        });
    });

    describe("rejects invalid input", () => {
        it("throws for unknown own key", () => {
            expect(() => parseSort("createdAt", allowed)).toThrow();
        });

        it("throws for empty string (not treated as default)", () => {
            expect(() => parseSort("", allowed)).toThrow();
        });

        it("throws for SQL injection attempts", () => {
            expect(() => parseSort("ID; DROP TABLE Users", allowed)).toThrow();
            expect(() => parseSort("ID' OR '1'='1", allowed)).toThrow();
        });

        it("throws for whitespace", () => {
            expect(() => parseSort(" ", allowed)).toThrow();
            expect(() => parseSort(" id", allowed)).toThrow();
        });
    });
});