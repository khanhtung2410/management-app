import { ok } from "@/lib/api";

export async function POST() {
  const response = ok({ message: "Đăng xuất thành công" });
  response.cookies.delete("token");
  return response;
}