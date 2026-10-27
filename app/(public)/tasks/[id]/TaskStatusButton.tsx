// Cập nhật trạng thái cho một công việc từ trang chi tiết; không dùng để tạo công việc hoặc thao tác trạng thái hàng loạt.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { taskStatus, TaskStatusType } from "@/constants/statuses";
import { Button } from "@/components/UI/Button";

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
    const [success, setSuccess] = useState("");
    const isComplete = status === taskStatus.Complete;

    const handleToggleStatus = async () => {
        const nextStatus = isComplete
            ? taskStatus.Active
            : taskStatus.Complete;

        setSaving(true);
        setError(null);
        setSuccess("");

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
            setSuccess(
                `Đã ${nextStatus === taskStatus.Complete ? "hoàn thành" : "mở lại"} công việc.`
            );
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
            <Button
                variant={isComplete ? "muted" : "success"}
                type="button"
                onClick={handleToggleStatus}
                disabled={saving}
                loading={saving}
            >
                {saving
                    ? "Đang cập nhật..."
                    : isComplete
                        ? "Mở lại công việc"
                        : "Đánh dấu hoàn thành"}
            </Button>
            <p role="status" aria-live="polite" className="sr-only">
                {success}
            </p>
            {error && (
                <p role="alert" className="text-right text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
