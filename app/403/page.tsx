import type { Metadata } from "next";
import StatusPage from "@/components/StatusPage";

export const metadata: Metadata = {
    title: "403 — Không có quyền truy cập",
};

export default function ForbiddenPage() {
    return <StatusPage code="403" />;
}