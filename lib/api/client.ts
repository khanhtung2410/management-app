/**
 * Helper đọc lỗi API phía CLIENT.
 * KHÔNG import file này từ server-side index (@/lib/api) —
 * `@/lib/api` kéo theo `next/server` làm hỏng client bundle.
 */

export interface ApiErrorBody {
  error: {
    code?: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}

/** Đọc message lỗi từ response dạng `{ error: { code, message } }`. */
export async function readApiError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as Partial<ApiErrorBody> & {
      message?: string;
    };
    return body?.error?.message ?? body?.message ?? "Đã có lỗi xảy ra";
  } catch {
    return "Đã có lỗi xảy ra";
  }
}

/** Đọc cả code + message — dùng khi cần phân nhánh theo code. */
export async function readApiErrorFull(res: Response): Promise<{
  code?: string;
  message: string;
}> {
  try {
    const body = (await res.json()) as Partial<ApiErrorBody> & {
      message?: string;
    };
    return {
      code: body?.error?.code,
      message: body?.error?.message ?? body?.message ?? "Đã có lỗi xảy ra",
    };
  } catch {
    return { message: "Đã có lỗi xảy ra" };
  }
}