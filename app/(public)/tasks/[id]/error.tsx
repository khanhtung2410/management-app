"use client";

import { useEffect } from "react";
import { Button } from "@/components/UI/Button";
import Link from "next/link";

export default function TasksDetailError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("loi chi tiet cong viec:", error);
    }, [error]);

    return (
        <main className="min-h-screen bg-[#F3F6FA] p-4 sm:p-8">
            <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-white p-6 shadow-sm">
                <div role="alert" className="space-y-4 text-center">
                    <h1 className="text-2xl font-bold text-red-800">
                        Không thể tải công việc
                    </h1>
                    <p className="text-[#475569]">
                        Đã xảy ra lỗi không mong muốn.
                    </p>
                    {error.digest && (
                        <p className="mt-1 text-xs text-gray-400">
                            Mã lỗi: {error.digest}
                        </p>
                    )}
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center"></div>
                    <Button type="button" onClick={reset}>
                        Thử lại
                    </Button>
                    <Link
                        href="/tasks"
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Về danh sách
                    </Link>
                </div>
            </div>
        </main >
    );
}