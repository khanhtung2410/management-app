import { describe, it, expect } from "vitest";
import { getPageNumbers } from "./Pagination";

describe("getPageNumbers — totalPages <= 7 (hiển thị hết)", () => {
    it("totalPages=1 → [1]", () => {
        expect(getPageNumbers(1, 1)).toEqual([1]);
    });

    it("totalPages=5 → trả đủ 5 trang, không có dấu ...", () => {
        expect(getPageNumbers(3, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it("totalPages=7 → trả đủ 7 trang", () => {
        expect(getPageNumbers(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it("bỏ qua currentPage khi totalPages <= 7", () => {
        expect(getPageNumbers(99, 5)).toEqual([1, 2, 3, 4, 5]);
    });
});

describe("getPageNumbers — totalPages > 7 (rút gọn)", () => {
    it("currentPage=1 (đầu): [1, 2, '...', 10]", () => {
        expect(getPageNumbers(1, 10)).toEqual([1, 2, "...", 10]);
    });

    it("currentPage=3: chưa cần dấu ... đầu", () => {
        expect(getPageNumbers(3, 10)).toEqual([1, 2, 3, 4, "...", 10]);
    });

    it("currentPage=4: có '...' giữa 1 và 3 (regression)", () => {
        expect(getPageNumbers(4, 10)).toEqual([1, "...", 3, 4, 5, "...", 10]);
    });

    it("currentPage=5 (giữa): có cả 2 dấu ...", () => {
        expect(getPageNumbers(5, 10)).toEqual([1, "...", 4, 5, 6, "...", 10]);
    });

    it("currentPage=7: có '...' giữa 8 và 10 (regression)", () => {
        expect(getPageNumbers(7, 10)).toEqual([1, "...", 6, 7, 8, "...", 10]);
    });

    it("currentPage=5, totalPages=8: có '...' giữa 6 và 8 (regression)", () => {
        expect(getPageNumbers(5, 8)).toEqual([1, "...", 4, 5, 6, "...", 8]);
    });

    it("currentPage=9 (gần cuối)", () => {
        expect(getPageNumbers(9, 10)).toEqual([1, "...", 8, 9, 10]);
    });

    it("currentPage=10 (cuối cùng)", () => {
        expect(getPageNumbers(10, 10)).toEqual([1, "...", 9, 10]);
    });

    it("luôn có trang 1 và trang cuối", () => {
        const result = getPageNumbers(5, 20);
        expect(result[0]).toBe(1);
        expect(result[result.length - 1]).toBe(20);
    });

    it("currentPage luôn nằm trong kết quả", () => {
        for (const p of [1, 2, 5, 10, 15, 19, 20]) {
            expect(getPageNumbers(p, 20)).toContain(p);
        }
    });
});

describe("getPageNumbers — edge case", () => {
    it("totalPages=0 → []", () => {
        expect(getPageNumbers(1, 0)).toEqual([]);
    });

    it("totalPages âm → []", () => {
        expect(getPageNumbers(1, -3)).toEqual([]);
    });

    it("currentPage=0, totalPages=10 → không crash", () => {
        expect(() => getPageNumbers(0, 10)).not.toThrow();
    });

    it("currentPage > totalPages → không crash", () => {
        expect(() => getPageNumbers(99, 10)).not.toThrow();
    });

    it("đang ở trang 5 nhưng chỉ còn 2 trang → chỉ hiển thị [1, 2]", () => {
        expect(getPageNumbers(5, 2)).toEqual([1, 2]);
    });

    it("số trang rất lớn → chỉ tạo các trang lân cận và trang đầu/cuối", () => {
        expect(getPageNumbers(500_000_000, 1_000_000_000)).toEqual([
            1,
            "...",
            499_999_999,
            500_000_000,
            500_000_001,
            "...",
            1_000_000_000,
        ]);
    });
});

describe("getPageNumbers — tính thuần", () => {
    it("trả kết quả độc lập khi sửa mảng của lần gọi trước", () => {
        const firstResult = getPageNumbers(5, 10);
        firstResult[0] = 99;
        firstResult.push(11);

        expect(getPageNumbers(5, 10)).toEqual([
            1,
            "...",
            4,
            5,
            6,
            "...",
            10,
        ]);
    });

    it("trả mảng rỗng mới cho mỗi lần gọi khi không có trang", () => {
        const firstResult = getPageNumbers(1, 0);
        firstResult.push(1);

        expect(getPageNumbers(1, 0)).toEqual([]);
    });
});