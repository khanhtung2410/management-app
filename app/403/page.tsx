// Hiển thị trang từ chối truy cập 403; không dùng cho URL không tồn tại hoặc lỗi đăng nhập thông thường.
import type { Metadata } from "next";
import StatusPage from "@/components/StatusPage";

export const metadata: Metadata = {
    title: "403 — Không có quyền truy cập",
};

export default function ForbiddenPage() {
    return <StatusPage code="403" />;
}