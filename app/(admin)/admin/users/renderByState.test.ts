import { describe, it, expect } from "vitest";
import { renderByState, type UsersState } from "./renderByState";
import type { User } from "./api";

const fakeUser: User = {
    ID: 1,
    HoTen: "Nguyễn Văn A",
    Email: "a@example.com",
    SDT: "0901234567",
    TrangThai: 1,
} as User;

describe("renderByState — idle", () => {
    it("trả 'Đang tải dữ liệu...'", () => {
        expect(renderByState({ status: "idle" })).toBe("Đang tải dữ liệu...");
    });
});

describe("renderByState — loading", () => {
    it("trả 'Đang tải dữ liệu...' (giống idle)", () => {
        expect(renderByState({ status: "loading" })).toBe("Đang tải dữ liệu...");
    });

    it("idle và loading cho cùng kết quả", () => {
        expect(renderByState({ status: "idle" }))
            .toBe(renderByState({ status: "loading" }));
    });
});

describe("renderByState — error", () => {
    it("trả đúng message lỗi", () => {
        const state: UsersState = { status: "error", message: "Mất kết nối" };
        expect(renderByState(state)).toBe("Mất kết nối");
    });

    it("message rỗng vẫn trả chuỗi rỗng, không fallback", () => {
        expect(renderByState({ status: "error", message: "" })).toBe("");
    });

    it("message dài giữ nguyên, không cắt", () => {
        const long = "A".repeat(500);
        expect(renderByState({ status: "error", message: long })).toBe(long);
    });
});

describe("renderByState — success rỗng", () => {
    it("data rỗng → 'Chưa có người dùng nào'", () => {
        const state: UsersState = {
            status: "success",
            data: [],
            totalPages: 0,
            total: 0,
        };
        expect(renderByState(state)).toBe("Chưa có người dùng nào");
    });
});

describe("renderByState — success có dữ liệu", () => {
    it("data có 1 phần tử → null", () => {
        const state: UsersState = {
            status: "success",
            data: [fakeUser],
            totalPages: 1,
            total: 1,
        };
        expect(renderByState(state)).toBeNull();
    });

    it("data nhiều phần tử → null", () => {
        const state: UsersState = {
            status: "success",
            data: [fakeUser, { ...fakeUser, ID: 2 }],
            totalPages: 2,
            total: 15,
        };
        expect(renderByState(state)).toBeNull();
    });
});

describe("renderByState — trạng thái không hợp lệ (assertNever)", () => {
    it("status lạ → assertNever ném lỗi", () => {
        const invalid = { status: "unknown-status" } as unknown as UsersState;
        expect(() => renderByState(invalid)).toThrow();
    });

    it("status undefined → assertNever ném lỗi", () => {
        const invalid = { status: undefined } as unknown as UsersState;
        expect(() => renderByState(invalid)).toThrow();
    });

    it("object rỗng → assertNever ném lỗi", () => {
        const invalid = {} as unknown as UsersState;
        expect(() => renderByState(invalid)).toThrow();
    });

    it("message lỗi từ assertNever có chứa giá trị nhận được", () => {
        const invalid = { status: "hacked" } as unknown as UsersState;
        expect(() => renderByState(invalid)).toThrow(/hacked/);
    });
});

describe("renderByState — tính thuần (pure)", () => {
    it("cùng input → cùng output", () => {
        const state: UsersState = { status: "error", message: "X" };
        expect(renderByState(state)).toBe(renderByState(state));
    });

    it("không đột biến input", () => {
        const state: UsersState = {
            status: "success",
            data: [fakeUser],
            totalPages: 1,
            total: 1,
        };
        const snapshot = JSON.stringify(state);
        renderByState(state);
        expect(JSON.stringify(state)).toBe(snapshot);
    });
});