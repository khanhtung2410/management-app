// Hiển thị trang 404 mặc định của ứng dụng; không dùng cho lỗi phân quyền hoặc lỗi nghiệp vụ.
import type { Metadata } from "next";
import StatusPage from "@/components/StatusPage";

export const metadata: Metadata = {
    title: "404 — Không tìm thấy trang",
};

export default function NotFound() {
    return <StatusPage code="404" />;
}
