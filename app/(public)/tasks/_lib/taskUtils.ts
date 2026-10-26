import { taskStatus, type TaskStatusType } from "@/constants/statuses";

export function getTaskDisplayStatus(
    status: TaskStatusType,
    dueDate: string | Date,
    now = new Date(),
): TaskStatusType {
    if (status === taskStatus.Complete) return taskStatus.Complete;
    const dueDateValue = dueDate instanceof Date ? dueDate : new Date(dueDate);
    if (dueDateValue < now) return taskStatus.Overdue;
    return taskStatus.Active;
}

export function formatTaskDate(value: string | Date): string {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime()) && typeof value === "string") return value;

    return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
