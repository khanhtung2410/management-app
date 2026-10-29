import { describe, it, expect } from "vitest";
import { validateUserFields } from "./user";

describe("validateUserFields — input không phải object", () => {
  it.each([null, undefined, "abc", 42, true, []])(
    "input %s → ok:false, có 1 detail",
    (input) => {
      const r = validateUserFields(input, { partial: true });
      expect(r.ok).toBe(false);
      if (r.ok) return;
      expect(r.details).toHaveLength(1);
      expect(r.details[0].message).toBeTruthy();
    },
  );
});

describe("validateUserFields — full mode (register)", () => {
  const valid = { HoTen: "Nguyễn Văn A", Email: "user@example.com", SDT: "0912345678" };

  it("ok:true với dữ liệu hợp lệ", () => {
    expect(validateUserFields(valid, { partial: false })).toEqual({ ok: true, data: valid });
  });

  it.each([
    ["thiếu HoTen", { ...valid, HoTen: undefined }, "HoTen"],
    ["thiếu Email", { ...valid, Email: undefined }, "Email"],
    ["thiếu SDT", { ...valid, SDT: undefined }, "SDT"],
    ["HoTen rỗng", { ...valid, HoTen: "   " }, "HoTen"],
    ["Email rỗng", { ...valid, Email: "   " }, "Email"],
    ["SDT rỗng (full mode không cho phép)", { ...valid, SDT: "   " }, "SDT"],
  ])("%s", (_d, input, field) => {
    const r = validateUserFields(input, { partial: false });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.details.some((d) => d.field === field)).toBe(true);
  });

  it.each([
    ["thiếu @", "abc.com"],
    ["TLD 1 ký tự", "abc@x.c"],
    ["hai @", "a@@b.com"],
    ["có khoảng trắng", "abc @x.com"],
  ])("Email sai định dạng (%s) → lỗi", (_d, email) => {
    expect(validateUserFields({ ...valid, Email: email }, { partial: false }).ok).toBe(false);
  });

  it.each([["090123"], ["09012345678"], ["1901234567"], ["090123456a"], ["+84901234567"]])(
    "SDT sai định dạng (%s) → lỗi",
    (sdt) => {
      expect(validateUserFields({ ...valid, SDT: sdt }, { partial: false }).ok).toBe(false);
    },
  );
});

describe("validateUserFields — partial mode (PATCH/update)", () => {
  it("input {} → ok:true, data:{}", () => {
    expect(validateUserFields({}, { partial: true })).toEqual({ ok: true, data: {} });
  });

  it("chỉ gửi HoTen → data chỉ có HoTen", () => {
    expect(validateUserFields({ HoTen: "A" }, { partial: true })).toEqual({
      ok: true, data: { HoTen: "A" },
    });
  });

  it("SDT = '' → ok, data.SDT = null (xoá SĐT, khớp schema NULL)", () => {
    expect(validateUserFields({ SDT: "" }, { partial: true })).toEqual({
      ok: true, data: { SDT: null },
    });
  });

  it("SDT chỉ khoảng trắng → ok, data.SDT = null", () => {
    expect(validateUserFields({ SDT: "   " }, { partial: true })).toEqual({
      ok: true, data: { SDT: null },
    });
  });

  it.each([["090123"], ["1901234567"], ["090123456a"]])(
    "SDT không rỗng, sai định dạng (%s) → lỗi",
    (sdt) => {
      expect(validateUserFields({ SDT: sdt }, { partial: true }).ok).toBe(false);
    },
  );
});

describe("validateUserFields — chuẩn hoá", () => {
  it("trim HoTen", () => {
    expect(validateUserFields({ HoTen: "  A  " }, { partial: true })).toEqual({
      ok: true, data: { HoTen: "A" },
    });
  });

  it("trim + lowercase Email", () => {
    expect(validateUserFields({ Email: "  USER@Example.COM  " }, { partial: true })).toEqual({
      ok: true, data: { Email: "user@example.com" },
    });
  });

  it("trim SDT", () => {
    expect(validateUserFields({ SDT: "  0912345678  " }, { partial: true })).toEqual({
      ok: true, data: { SDT: "0912345678" },
    });
  });
});

describe("validateUserFields — biên độ dài & kiểu", () => {
  it("HoTen 255 ký tự → ok; 256 → lỗi", () => {
    expect(validateUserFields({ HoTen: "a".repeat(255) }, { partial: true }).ok).toBe(true);
    expect(validateUserFields({ HoTen: "a".repeat(256) }, { partial: true }).ok).toBe(false);
  });

  it.each([
    ["HoTen number", { HoTen: 123 }, "HoTen"],
    ["Email null", { Email: null }, "Email"],
    ["SDT object", { SDT: { x: 1 } }, "SDT"],
  ])("%s → lỗi, không ném exception", (_d, input, field) => {
    const r = validateUserFields(input, { partial: true });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.details.some((d) => d.field === field)).toBe(true);
  });
});

describe("validateUserFields — gộp lỗi", () => {
  it("full mode 3 trường sai → 3 detail", () => {
    const r = validateUserFields({ HoTen: "   ", Email: "bad", SDT: "xyz" }, { partial: false });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.details).toHaveLength(3);
  });
});