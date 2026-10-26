// Quản lý tìm kiếm, hiển thị và cập nhật trạng thái danh sách công việc phía client; không dùng để tải dữ liệu hoặc xem chi tiết.
"use client";

import {
    useDeferredValue,
    useMemo,
    useState,
} from "react";
import { taskStatus } from "@/constants/statuses";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TaskList, type CongViec } from "./taskRow";
import { TaskFormModal } from "./TaskFormModal";
import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";
import { Card } from "@/components/UI/Card";

export function TasksClient({ initialTasks }: { initialTasks: CongViec[] }) {
    const [data, setData] = useState(initialTasks);
    const [searchTerm, setSearchTerm] = useState("");
    const deferredSearch = useDeferredValue(searchTerm);
    const [addTask, setAddTask] = useState(false);
    const [toggleError, setToggleError] = useState<{
        id: number;
        message: string;
    } | null>(null);
    const [toggleSuccess, setToggleSuccess] = useState("");

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const filtered = useMemo(() => {
        const q = deferredSearch.trim().toLowerCase();
        if (!q) return data;
        return data.filter(
            task =>
                task.Ten.toLowerCase().includes(q) ||
                task.Mota.toLowerCase().includes(q)
        );
    }, [data, deferredSearch]);

    const handleToggleStatus = async (item: CongViec) => {
        const newStatus =
            item.TrangThai === taskStatus.Complete
                ? taskStatus.Active
                : taskStatus.Complete;

        setToggleError(null);
        setToggleSuccess("");

        try {
            const res = await fetch(`/api/tasks/${item.ID}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ TrangThai: newStatus }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(
                    result.message || "Không thể cập nhật trạng thái"
                );
            }

            setData(prev =>
                prev.map(task =>
                    task.ID === item.ID
                        ? { ...task, TrangThai: newStatus }
                        : task
                )
            );
            setToggleSuccess(
                `Đã ${newStatus === taskStatus.Complete ? "hoàn thành" : "mở lại"} công việc ${item.Ten}.`
            );
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            setToggleError({
                id: item.ID,
                message:
                    error instanceof Error
                        ? error.message
                        : "Không thể cập nhật trạng thái",
            });
        }
    };

    const errorForItem = (item: CongViec): string | null =>
        toggleError?.id === item.ID ? toggleError.message : null;

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Danh sách công việc
                        </h1>
                        <p className="mt-1 text-sm text-gray-800">
                            Quản lý các công việc của bạn
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            input={{
                                "aria-label": "Tìm kiếm công việc",
                                type: "search",
                                value: searchTerm,
                                onChange: event => setSearchTerm(event.target.value),
                                placeholder: "Tìm kiếm...",
                                className: "text-gray-800 text-sm sm:w-64",
                            }}
                        />

                        <Button
                            variant="muted"
                            type="button"
                            onClick={() => setAddTask(true)}
                            className="whitespace-nowrap"
                        >
                            + Thêm công việc
                        </Button>
                    </div>
                </div>

                <p role="status" aria-live="polite" className="sr-only">
                    {deferredSearch.trim() && filtered.length === 0
                        ? "Không tìm thấy công việc phù hợp."
                        : ""}
                    {toggleSuccess}
                </p>

                {isDesktop ? (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-800">
                                    <tr className="border-b">
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Tên công việc</th>
                                        <th className="px-6 py-4">Mô tả</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4">Hết hạn</th>
                                        <th className="px-6 py-4">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <TaskList
                                        items={filtered}
                                        variant="table"
                                        isFiltered={deferredSearch.trim().length > 0}
                                        errorForItem={errorForItem}
                                        onToggle={handleToggleStatus}
                                    />
                                </tbody>
                            </table>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        <TaskList
                            items={filtered}
                            variant="card"
                            isFiltered={deferredSearch.trim().length > 0}
                            errorForItem={errorForItem}
                            onToggle={handleToggleStatus}
                        />
                    </div>
                )}
            </div>

            {addTask && (
                <TaskFormModal
                    onClose={() => setAddTask(false)}
                    onCreated={task => setData(prev => [task, ...prev])}
                />
            )}
        </main>
    );
}
