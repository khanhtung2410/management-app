"use client";

import {
    useDeferredValue,
    useEffect,
    useMemo,
    useState,
} from "react";
import { taskStatus } from "@/constants/statuses";  
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TaskList, type CongViec } from "./taskRow";
import { TaskFormModal } from "./TaskFormModal";

export default function Home() {
    const [data, setData] = useState<CongViec[]>([]);
    const [loading, setLoading] = useState(true);
    const [listError, setListError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const deferredSearch = useDeferredValue(searchTerm);

    const [addTask, setAddTask] = useState(false);

    const [toggleError, setToggleError] = useState<{    
        id: number;
        message: string;
    } | null>(null);

    const isDesktop = useMediaQuery("(min-width: 768px)");

    // ==============================
    // Fetch danh sách
    // ==============================
    useEffect(() => {
        fetch("/api/tasks", { credentials: "include" })
            .then(async response => {
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || "Không thể lấy dữ liệu");
                }
                return result;
            })
            .then(result => {
                if (result) setData(result);
            })
            .catch(error => {
                console.error("Lỗi:", error);
                setListError(
                    error instanceof Error
                        ? error.message
                        : "Không thể lấy dữ liệu"
                );
            })
            .finally(() => setLoading(false));
    }, []);

    // ==============================
    // Lọc theo search
    // ==============================
    const filtered = useMemo(() => {
        const q = deferredSearch.trim().toLowerCase();
        if (!q) return data;
        return data.filter(
            t =>
                t.Ten.toLowerCase().includes(q) ||
                t.Mota.toLowerCase().includes(q)
        );
    }, [data, deferredSearch]);

    // ==============================
    // Đổi trạng thái
    // ==============================
    const handleToggleStatus = async (item: CongViec) => {
        const newStatus =
            item.TrangThai === taskStatus.Complete
                ? taskStatus.Active
                : taskStatus.Complete;

        setToggleError(null);

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
                prev.map(t =>
                    t.ID === item.ID ? { ...t, TrangThai: newStatus } : t
                )
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

    // ==============================
    // Render
    // ==============================
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
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm..."
                            className="w-full text-gray-800 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                        />

                        <button
                            type="button"
                            onClick={() => setAddTask(true)}
                            className="whitespace-nowrap rounded-md bg-[#6B7280] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4B5563]"
                        >
                            + Thêm công việc
                        </button>
                    </div>
                </div>

                {listError && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {listError}
                    </div>
                )}

                {isDesktop ? (
                    <div className="overflow-hidden rounded-xl bg-white shadow-md">
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
                                        loading={loading}
                                        errorForItem={errorForItem}
                                        onToggle={handleToggleStatus}
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <TaskList
                            items={filtered}
                            variant="card"
                            loading={loading}
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