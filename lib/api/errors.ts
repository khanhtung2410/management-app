export type ErrorCode =
  | "INVALID_JSON"
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "ACCOUNT_LOCKED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export interface ErrorDetail {
  field: string;
  message: string;
}

/**
 * Lỗi có ngữ nghĩa HTTP + code nghiệp vụ. Chỉ nên throw class này từ handler.
 * `handleApiError` sẽ render ra JSON `{ error: { code, message, details? } }`.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly details?: ErrorDetail[];

  constructor(
    status: number,
    code: ErrorCode,
    message: string,
    details?: ErrorDetail[],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const DEFAULT_MESSAGES = {
  INVALID_JSON: "Dữ liệu gửi lên không phải JSON hợp lệ",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ",
  UNAUTHENTICATED: "Bạn cần đăng nhập",
  FORBIDDEN: "Bạn không có quyền truy cập",
  ACCOUNT_LOCKED: "Tài khoản đã bị khoá",
  NOT_FOUND: "Không tìm thấy tài nguyên",
  CONFLICT: "Dữ liệu đã tồn tại",
  INTERNAL_ERROR: "Đã có lỗi xảy ra, vui lòng thử lại sau",
} satisfies Record<ErrorCode, string>;

export function invalidJson(message = DEFAULT_MESSAGES.INVALID_JSON): ApiError {
  return new ApiError(400, "INVALID_JSON", message);
}

/** 400 VALIDATION_ERROR — body JSON parse được nhưng thiếu/sai trường, query param sai, … */
export function badRequest(
  message = DEFAULT_MESSAGES.VALIDATION_ERROR,
  details?: ErrorDetail[],
): ApiError {
  return new ApiError(400, "VALIDATION_ERROR", message, details);
}

export function unauthenticated(message = DEFAULT_MESSAGES.UNAUTHENTICATED): ApiError {
  return new ApiError(401, "UNAUTHENTICATED", message);
}

export function forbidden(message = DEFAULT_MESSAGES.FORBIDDEN): ApiError {
  return new ApiError(403, "FORBIDDEN", message);
}

export function accountLocked(message = DEFAULT_MESSAGES.ACCOUNT_LOCKED): ApiError {
  return new ApiError(403, "ACCOUNT_LOCKED", message);
}

export function notFound(message = DEFAULT_MESSAGES.NOT_FOUND): ApiError {
  return new ApiError(404, "NOT_FOUND", message);
}

export function conflict(
  message = DEFAULT_MESSAGES.CONFLICT,
  details?: ErrorDetail[],
): ApiError {
  return new ApiError(409, "CONFLICT", message, details);
}

/** 500 INTERNAL_ERROR — message luôn chung chung, chi tiết log bằng `console.error`. */
export function internalError(message = DEFAULT_MESSAGES.INTERNAL_ERROR): ApiError {
  return new ApiError(500, "INTERNAL_ERROR", message);
}