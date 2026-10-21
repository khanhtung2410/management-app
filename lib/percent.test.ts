import { describe, it, expect } from "vitest";
import { getPercent } from "./percent";

describe("getPercent — trường hợp thường", () => {
    it("50/100 → 50", () => {
        expect(getPercent(50, 100)).toBe(50);
    });

    it("1/4 → 25", () => {
        expect(getPercent(1, 4)).toBe(25);
    });

    it("0/100 → 0", () => {
        expect(getPercent(0, 100)).toBe(0);
    });

    it("100/100 → 100", () => {
        expect(getPercent(100, 100)).toBe(100);
    });
});

describe("getPercent — làm tròn 2 chữ số", () => {
    it("1/3 → 33.33 (không phải 33.3333...)", () => {
        expect(getPercent(1, 3)).toBe(33.33);
    });

    it("2/3 → 66.67 (làm tròn lên)", () => {
        expect(getPercent(2, 3)).toBe(66.67);
    });

    it("1/8 → 12.5", () => {
        expect(getPercent(1, 8)).toBe(12.5);
    });

    it("1/7 → 14.29", () => {
        expect(getPercent(1, 7)).toBe(14.29);
    });

    it("không trả về nhiều hơn 2 chữ số thập phân", () => {
        const result = getPercent(1, 3);
        // 33.33 có tối đa 2 chữ số thập phân
        expect(result.toString()).toMatch(/^\d+(\.\d{1,2})?$/);
    });
});

describe("getPercent — total = 0 (chia cho 0)", () => {
    it("0/0 → 0 (không phải NaN)", () => {
        const result = getPercent(0, 0);
        expect(result).toBe(0);
        expect(Number.isNaN(result)).toBe(false);
    });

    it("5/0 → 0 (không phải Infinity)", () => {
        const result = getPercent(5, 0);
        expect(result).toBe(0);
        expect(Number.isFinite(result)).toBe(true);
    });

    it("100/0 → 0 (không crash)", () => {
        expect(() => getPercent(100, 0)).not.toThrow();
        expect(getPercent(100, 0)).toBe(0);
    });
});

describe("getPercent — total âm (dữ liệu bẩn)", () => {
    it("-5/0 → 0", () => {
        expect(getPercent(-5, 0)).toBe(0);
    });

    it("5/-10 → 0 (không trả số âm)", () => {
        expect(getPercent(5, -10)).toBe(0);
    });
});

describe("getPercent — value vượt total", () => {
    it("150/100 → 150 (không cap ở 100)", () => {
        // Hàm không cap — tầng UI quyết định cap hay không
        expect(getPercent(150, 100)).toBe(150);
    });

    it("giá trị vượt xa total vẫn được tính chính xác", () => {
        expect(getPercent(1_000_000_000, 1)).toBe(100_000_000_000);
    });

    it("value bằng total → chính xác 100", () => {
        expect(getPercent(123_456, 123_456)).toBe(100);
    });
});

describe("getPercent — tính thuần (pure)", () => {
    it("cùng input → cùng output, gọi nhiều lần không đổi", () => {
        const a = getPercent(1, 3);
        const b = getPercent(1, 3);
        const c = getPercent(1, 3);
        expect(a).toBe(b);
        expect(b).toBe(c);
    });

    it("không phụ thuộc thứ tự gọi", () => {
        const x = getPercent(1, 3);
        getPercent(5, 10);            // gọi hàm khác xen vào
        const y = getPercent(1, 3);
        expect(x).toBe(y);
    });
});