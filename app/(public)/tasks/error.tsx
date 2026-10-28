"use client";

import { useEffect } from "react";
import { Button } from "@/components/UI/Button";

export default function TasksError({
    error,
    retry,
}: {
    error: Error & { digest?: string };
    retry: () => void;
}) {
    useEffect(() => {
        console.error("Tasks page error:", error);
    }, [error]);

    return (
        <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-white p-6 shadow-sm">
                <div role="alert" className="space-y-4 text-center">
                    <h1 className="text-2xl font-bold text-red-800">
                        Không thể tải danh sách công việc
                    </h1>
                    <p className="text-gray-700">
                        Đã xảy ra lỗi khi tải công việc. Vui lòng thử lại.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-gray-500">
                            Mã lỗi: {error.digest}
                        </p>
                    )}
                    <Button type="button" onClick={retry}>
                        Thử lại
                    </Button>
                </div>
            </div>
        </main>
    );
}
