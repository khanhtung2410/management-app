"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { taskStatus, TaskStatusType } from "@/constants/statuses";

interface TaskStatusButtonProps {
    taskId: number;
    status: TaskStatusType;
}

export function TaskStatusButton({
    taskId,
    status,
}: TaskStatusButtonProps) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isComplete = status === taskStatus.Complete;

    const handleToggleStatus = async () => {
        const nextStatus = isComplete
            ? taskStatus.Active
            : taskStatus.Complete;

        setSaving(true);
        setError(null);

        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ TrangThai: nextStatus }),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Không thể cập nhật trạng thái"
                );
            }

            router.refresh();
        } catch (toggleError) {
            console.error("Lỗi cập nhật trạng thái:", toggleError);
            setError(
                toggleError instanceof Error
                    ? toggleError.message
                    : "Không thể cập nhật trạng thái"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                type="button"
                onClick={handleToggleStatus}
                disabled={saving}
                className={
                    isComplete
                        ? "rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-60"
                        : "rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-60"
                }
            >
                {saving
                    ? "Đang cập nhật..."
                    : isComplete
                      ? "Mở lại công việc"
                      : "Đánh dấu hoàn thành"}
            </button>
            {error && (
                <p role="alert" className="text-right text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
