import { describe, it, expect } from "vitest";
import { parseSort } from "./pagination";

const allowed = { id: "ID", hetHan: "HetHan", ten: "Ten" } as const;

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