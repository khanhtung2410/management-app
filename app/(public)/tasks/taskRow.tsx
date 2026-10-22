import { taskStatus, type TaskStatusType, STATUS_CONFIG } from "@/constants/statuses";
import Link from "next/link";
import { formatTaskDate, getTaskDisplayStatus } from "./taskUtils";
import { Button } from "@/components/UI/Button";

export interface CongViec {
    ID: number;
    Ten: string;
    Mota: string;
    TrangThai: TaskStatusType;
    HetHan: string | Date;
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
    const displayStatus = getTaskDisplayStatus(item.TrangThai, item.HetHan);
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
        <Button
            variant={isComplete ? "muted" : "success"}
            size="xs"
            type="button"
            onClick={() => onToggle(item)}
        >
            {isComplete ? "Mở lại" : "Hoàn thành"}
        </Button>
    );

    const detailLink = (
        <Link
            href={`/tasks/${item.ID}`}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-700"
        >
            Chi tiết
        </Link>
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

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-gray-500">
                        {formatTaskDate(item.HetHan)}
                    </span>
                    <div className="flex gap-2">
                        {toggleButton}
                        {detailLink}
                    </div>
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
            <td className="px-6 py-4 text-gray-600">{formatTaskDate(item.HetHan)}</td>
            <td className="px-6 py-4 flex gap-4">
                {toggleButton}
                {detailLink}
                {errorMessage && (
                    <p className="mt-1 text-xs text-red-600">{errorMessage}</p>
                )}
            </td>
        </tr>
    );
}

// ============================================================
// TaskList — xử lý empty/map Ở MỘT CHỖ DUY NHẤT
// ============================================================
interface TaskListProps {
    items: CongViec[];
    variant: "table" | "card";
    errorForItem: (item: CongViec) => string | null;
    onToggle: (item: CongViec) => void;
}

export function TaskList({
    items,
    variant,
    errorForItem,
    onToggle,
}: TaskListProps) {
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