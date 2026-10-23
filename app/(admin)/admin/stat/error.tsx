"use client";

import { useEffect } from "react";
import { Button } from "@/components/UI/Button";

export default function DashboardError({
    error,
    retry,
}: {
    error: Error & { digest?: string };
    retry: () => void;
}) {
    useEffect(() => {
        console.error("Admin statistics error:", error);
    }, [error]);

    return (
        <main className="min-h-screen bg-[#F3F6FA] p-4 sm:p-8">
            <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-white p-6 shadow-sm">
                <div role="alert" className="space-y-4 text-center">
                    <h1 className="text-2xl font-bold text-red-800">
                        Không thể tải thống kê
                    </h1>
                    <p className="text-[#475569]">
                        Đã xảy ra lỗi khi tải dữ liệu thống kê. Vui lòng thử lại.
                    </p>
                    <Button type="button" onClick={retry}>
                        Thử lại
                    </Button>
                </div>
            </div>
        </main>
    );
}