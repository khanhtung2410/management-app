"use client";

import { taskStatus, type TaskStatusType, STATUS_CONFIG } from "@/constants/statuses";

export interface CongViec {
    ID: number;
    Ten: string;
    Mota: string;
    TrangThai: number;
    HetHan: string;
}



function getDisplayStatus(item: CongViec): TaskStatusType {
    if (item.TrangThai === taskStatus.Complete) return taskStatus.Complete;
    if (new Date(item.HetHan) < new Date()) return taskStatus.Overdue;
    return taskStatus.Active;
}

function formatDate(value: string): string {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

// ============================================================
// TaskRow — 1 dòng table HOẶC 1 card
// ============================================================
interface TaskRowProps {
    item: CongViec;
    variant: "table" | "card";
    errorMessage?: string | null;
    onToggle: (item: CongViec) => void;
}

export function TaskRow({ item, variant, errorMessage, onToggle }: TaskRowProps) {
    const displayStatus = getDisplayStatus(item);
    const config = STATUS_CONFIG[displayStatus];
    const isComplete = item.TrangThai === taskStatus.Complete;

    const statusBadge = (
        <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: config.bg, color: config.color }}
        >
            {config.label}
        </span>
    );

    const toggleButton = (
        <button
            type="button"
            onClick={() => onToggle(item)}
            className={
                isComplete
                    ? "rounded-md bg-gray-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-600"
                    : "rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700"
            }
        >
            {isComplete ? "Mở lại" : "Hoàn thành"}
        </button>
    );

    // ----- Card (mobile) -----
    if (variant === "card") {
        return (
            <div className="rounded-xl bg-white p-4 shadow-md">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="text-xs text-gray-500">#{item.ID}</div>
                        <div className="font-medium text-gray-800">{item.Ten}</div>
                    </div>
                    {statusBadge}
                </div>

                {item.Mota && (
                    <p className="mt-2 text-sm text-gray-600">{item.Mota}</p>
                )}

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        {formatDate(item.HetHan)}
                    </span>
                    {toggleButton}
                </div>

                {errorMessage && (
                    <p className="mt-2 text-xs text-red-600">{errorMessage}</p>
                )}
            </div>
        );
    }

    // ----- Table row (desktop) -----
    return (
        <tr className="transition hover:bg-gray-50">
            <td className="px-6 py-4 text-gray-600">{item.ID}</td>
            <td className="px-6 py-4 font-medium text-gray-800">{item.Ten}</td>
            <td className="px-6 py-4 text-gray-600">{item.Mota}</td>
            <td className="px-6 py-4">{statusBadge}</td>
            <td className="px-6 py-4 text-gray-600">{formatDate(item.HetHan)}</td>
            <td className="px-6 py-4">
                {toggleButton}
                {errorMessage && (
                    <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
                )}
            </td>
        </tr>
    );
}

// ============================================================
// TaskList — xử lý loading/empty/map Ở MỘT CHỖ DUY NHẤT
// ============================================================
interface TaskListProps {
    items: CongViec[];
    variant: "table" | "card";
    loading: boolean;
    errorForItem: (item: CongViec) => string | null;
    onToggle: (item: CongViec) => void;
}

export function TaskList({
    items,
    variant,
    loading,
    errorForItem,
    onToggle,
}: TaskListProps) {
    // Trạng thái loading — render khác nhau theo variant
    if (loading) {
        return variant === "table" ? (
            <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Đang tải...
                </td>
            </tr>
        ) : (
            <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-md">
                Đang tải...
            </div>
        );
    }

    // Trạng thái rỗng
    if (items.length === 0) {
        return variant === "table" ? (
            <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Chưa có công việc nào
                </td>
            </tr>
        ) : (
            <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-md">
                Chưa có công việc nào
            </div>
        );
    }

    // MỘT chỗ duyệt duy nhất
    return (
        <>
            {items.map(item => (
                <TaskRow
                    key={item.ID}
                    item={item}
                    variant={variant}
                    errorMessage={errorForItem(item)}
                    onToggle={onToggle}
                />
            ))}
        </>
    );
}