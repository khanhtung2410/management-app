import { invalidJson } from "./errors";

/**
 * Đọc JSON body:
 *  - Content-Type không phải `application/json` → INVALID_JSON
 *  - Body rỗng / sai cú pháp → INVALID_JSON
 *  - Body parse được nhưng không phải object (array, null, primitive) → INVALID_JSON
 *
 * Chỉ đảm bảo "có một object". Việc validate từng field (kiểu, regex, range)
 * là trách nhiệm của từng route (throw `badRequest(msg, details)`).
 */
export async function readJson(req: Request): Promise<Record<string, unknown>> {
  const contentType = req.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    throw invalidJson();
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw invalidJson();
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw invalidJson();
  }

  return body as Record<string, unknown>;
}