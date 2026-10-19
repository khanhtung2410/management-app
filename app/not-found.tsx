import type { Metadata } from "next";
import StatusPage from "@/components/StatusPage";

export const metadata: Metadata = {
    title: "404 — Không tìm thấy trang",
};

export default function NotFound() {
    return <StatusPage code="404" />;
}
