import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/auth/logout", () => {
  it("trả 200 và xóa cookie token", async () => {
    const res = await POST();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Đăng xuất thành công" });
    expect(res.cookies.get("token")?.value).toBe("");
  });
});