import type { ErrorDetail } from "@/lib/api/errors";

export type TaskFields = {
    Ten: string;
    Mota: string;
    HetHan: string;
};

export type TaskFieldsResult =
    | { ok: true; data: TaskFields }
    | { ok: false; details: ErrorDetail[] };

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateTaskFields(input: unknown): TaskFieldsResult {
    if (!isPlainObject(input)) {
        return { ok: false, details: [{ field: "_root", message: "Payload không hợp lệ" }] };
    }

    const details: ErrorDetail[] = [];

    const rawName = input.Ten;
    const name = typeof rawName === "string" ? rawName.trim() : "";
    if (typeof rawName !== "string") {
        details.push({ field: "Ten", message: "Tên công việc không hợp lệ" });
    } else if (name === "") {
        details.push({ field: "Ten", message: "Vui lòng nhập tên công việc" });
    } else if (name.length > 255) {
        details.push({ field: "Ten", message: "Tên công việc không được vượt quá 255 ký tự" });
    }

    const rawDescription = input.Mota;
    if (rawDescription != null && typeof rawDescription !== "string") {
        details.push({ field: "Mota", message: "Mô tả không hợp lệ" });
    }
    const description = typeof rawDescription === "string" ? rawDescription.trim() : "";

    const rawDeadline = input.HetHan;
    if (typeof rawDeadline !== "string" || Number.isNaN(Date.parse(rawDeadline))) {
        details.push({ field: "HetHan", message: "Ngày hết hạn không hợp lệ" });
    }
    const deadline = typeof rawDeadline === "string" ? rawDeadline : "";

    if (details.length > 0) return { ok: false, details };

    return {
        ok: true,
        data: {
            Ten: name,
            Mota: description,
            HetHan: deadline,
        },
    };
}
