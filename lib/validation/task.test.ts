import { describe, expect, it } from "vitest";
import { validateTaskFields } from "./task";

describe("validateTaskFields", () => {
    it("gộp lỗi từ mọi trường task", () => {
        const result = validateTaskFields({ Ten: "", Mota: 123, HetHan: "abc" });

        expect(result.ok).toBe(false);
        if (result.ok) return;
        expect(result.details).toHaveLength(3);
        expect(result.details.map((detail) => detail.field)).toEqual([
            "Ten",
            "Mota",
            "HetHan",
        ]);
    });

    it("chuẩn hoá các trường hợp lệ", () => {
        expect(validateTaskFields({
            Ten: "  Task  ",
            Mota: "  Description  ",
            HetHan: "2026-12-01",
        })).toEqual({
            ok: true,
            data: {
                Ten: "Task",
                Mota: "Description",
                HetHan: "2026-12-01",
            },
        });
    });
});
