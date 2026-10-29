import type { ErrorDetail } from "@/lib/api/errors";

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^0\d{9}$/;
export const NAME_MAX = 255;
export const EMAIL_MAX = 255;

export type FullUserFields = { HoTen: string; Email: string; SDT: string };
export type PartialUserFields = { HoTen?: string; Email?: string; SDT?: string | null };

export type FullResult = { ok: true; data: FullUserFields } | { ok: false; details: ErrorDetail[] };
export type PartialResult = { ok: true; data: PartialUserFields } | { ok: false; details: ErrorDetail[] };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Overload: literal `partial` cho caller biết chính xác shape `data`.
export function validateUserFields(input: unknown, opts: { partial: false }): FullResult;
export function validateUserFields(input: unknown, opts: { partial: true }): PartialResult;
export function validateUserFields(input: unknown, opts: { partial: boolean }): FullResult | PartialResult;
export function validateUserFields(
  input: unknown,
  { partial }: { partial: boolean },
): FullResult | PartialResult {
  if (!isPlainObject(input)) {
    return { ok: false, details: [{ field: "_root", message: "Payload không hợp lệ" }] };
  }

  const details: ErrorDetail[] = [];
  const data: PartialUserFields = {};

  // ─── HoTen ───
  const rawName = input.HoTen;
  if (rawName !== undefined) {
    if (typeof rawName !== "string") {
      details.push({ field: "HoTen", message: "Họ tên không hợp lệ" });
    } else {
      const name = rawName.trim();
      if (name === "") {
        details.push({ field: "HoTen", message: "Họ tên không được để trống" });
      } else if (name.length > NAME_MAX) {
        details.push({ field: "HoTen", message: `Họ tên không được vượt quá ${NAME_MAX} ký tự` });
      } else {
        data.HoTen = name;
      }
    }
  } else if (!partial) {
    details.push({ field: "HoTen", message: "Họ tên không được để trống" });
  }

  // ─── Email ───
  const rawEmail = input.Email;
  if (rawEmail !== undefined) {
    if (typeof rawEmail !== "string") {
      details.push({ field: "Email", message: "Email không hợp lệ" });
    } else {
      const email = rawEmail.trim().toLowerCase();
      if (email === "") {
        details.push({ field: "Email", message: "Email không được để trống" });
      } else if (email.length > EMAIL_MAX) {
        details.push({ field: "Email", message: `Email không được vượt quá ${EMAIL_MAX} ký tự` });
      } else if (!EMAIL_REGEX.test(email)) {
        details.push({ field: "Email", message: "Email không hợp lệ" });
      } else {
        data.Email = email;
      }
    }
  } else if (!partial) {
    details.push({ field: "Email", message: "Email không được để trống" });
  }

  // ─── SDT ───
  // Rule: partial="" → null (xoá SĐT, khớp schema NULL); full → bắt buộc.
  const rawPhone = input.SDT;
  if (rawPhone !== undefined) {
    if (typeof rawPhone !== "string") {
      details.push({ field: "SDT", message: "Số điện thoại không hợp lệ" });
    } else {
      const sdt = rawPhone.trim();
      if (sdt === "") {
        if (partial) data.SDT = null;
        else details.push({ field: "SDT", message: "Số điện thoại không được để trống" });
      } else if (!PHONE_REGEX.test(sdt)) {
        details.push({ field: "SDT", message: "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0" });
      } else {
        data.SDT = sdt;
      }
    }
  } else if (!partial) {
    details.push({ field: "SDT", message: "Số điện thoại không được để trống" });
  }

  if (details.length > 0) return { ok: false, details };

  // Full mode: `data` chắc chắn đủ 3 trường (thiếu → đã return ở trên).
  return { ok: true, data } as FullResult | PartialResult;
}