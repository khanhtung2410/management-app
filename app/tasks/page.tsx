"use client";

import { useEffect, useState } from "react";
import { taskStatus, type TaskStatusType } from "@/constants/statuses";

interface CongViec {
    ID: number;
    Ten: string;
    Mota: string;
    TrangThai: number;
    HetHan: string;
}

const STATUS_CONFIG: Record<
    TaskStatusType,
    { label: string; bg: string; color: string }
> = {
    [taskStatus.Active]: {
        label: "Đang thực hiện",
        bg: "#DBEAFE",
        color: "#1D4ED8",
    },
    [taskStatus.Complete]: {
        label: "Hoàn thành",
        bg: "#DCFCE7",
        color: "#15803D",
    },
    [taskStatus.Overdue]: {
        label: "Quá hạn",
        bg: "#FEE2E2",
        color: "#B91C1C",
    },
};

function getDisplayStatus(item: CongViec): TaskStatusType {
    if (item.TrangThai === taskStatus.Complete) return taskStatus.Complete;
    if (new Date(item.HetHan) < new Date()) return taskStatus.Overdue;
    return taskStatus.Active;
}

function formatDate(value: string): string {
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function Home() {
    const [data, setData] = useState<CongViec[]>([]);
    const [loading, setLoading] = useState(true);

    const [addTask, setAddTask] = useState(false);
    const [addTen, setAddTen] = useState("");
    const [addMota, setAddMota] = useState("");
    const [addNgayHetHan, setAddNgayHetHan] = useState("");

    // ==============================
    // Fetch danh sách khi mount
    // ==============================
    useEffect(() => {
        fetch("/api/tasks", { credentials: "include" })
            .then(async response => {
                const result = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = "/login";
                        return null;
                    }
                    if (response.status === 403) {
                        window.location.href = "/";
                        return null;
                    }
                    throw new Error(result.message || "Không thể lấy dữ liệu");
                }

                return result;
            })
            .then(result => {
                if (result) setData(result);
            })
            .catch(error => {
                console.error("Lỗi:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    // ==============================
    // Modal thêm công việc
    // ==============================
    const openadd = () => {
        setAddTen("");
        setAddMota("");
        setAddNgayHetHan("");
        setAddTask(true);
    };

    const closeAdd = () => {
        setAddTask(false);
    };

    const handleAddTask = async () => {
        if (!addTen.trim()) {
            alert("Vui lòng nhập tên công việc");
            return;
        }

        if (!addNgayHetHan) {
            alert("Vui lòng chọn ngày hết hạn");
            return;
        }

        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Ten: addTen,
                    Mota: addMota,
                    HetHan: addNgayHetHan,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    window.location.href = "/login";
                    return;
                }
                throw new Error(result.message || "Không thể thêm công việc");
            }

            setData(prev => [result, ...prev]);
            setAddTen("");
            setAddMota("");
            setAddNgayHetHan("");
            setAddTask(false);
        } catch (error) {
            console.error("Lỗi thêm công việc:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Không thể thêm công việc"
            );
        }
    };

    // ==============================
    // Đổi trạng thái (0 ↔ 1)
    // ==============================
    const handleToggleStatus = async (item: CongViec) => {
        const newStatus =
            item.TrangThai === taskStatus.Complete
                ? taskStatus.Active
                : taskStatus.Complete;

        try {
            const res = await fetch(`/api/tasks/${item.ID}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ TrangThai: newStatus }),
            });

            const result = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    window.location.href = "/login";
                    return;
                }
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
            alert(
                error instanceof Error
                    ? error.message
                    : "Không thể cập nhật trạng thái"
            );
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Danh sách công việc
                        </h1>
                        <p className="mt-1 text-sm text-gray-800">
                            Quản lý các công việc của bạn
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openadd}
                        className="rounded-md bg-[#6B7280] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4B5563]"
                    >
                        + Thêm công việc
                    </button>
                </div>

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
                                {loading && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                            Đang tải...
                                        </td>
                                    </tr>
                                )}

                                {!loading && data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                            Chưa có công việc nào
                                        </td>
                                    </tr>
                                )}

                                {!loading && data.map(item => {
                                    const displayStatus = getDisplayStatus(item);
                                    const config = STATUS_CONFIG[displayStatus];
                                    const isComplete = item.TrangThai === taskStatus.Complete;

                                    return (
                                        <tr
                                            key={item.ID}
                                            className="transition hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 text-gray-600">
                                                {item.ID}
                                            </td>

                                            <td className="px-6 py-4 font-medium text-gray-800">
                                                {item.Ten}
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">
                                                {item.Mota}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                                                    style={{
                                                        backgroundColor: config.bg,
                                                        color: config.color,
                                                    }}
                                                >
                                                    {config.label}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">
                                                {formatDate(item.HetHan)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(item)}
                                                    className={
                                                        isComplete
                                                            ? "rounded-md bg-gray-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-600"
                                                            : "rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700"
                                                    }
                                                >
                                                    {isComplete ? "Mở lại" : "Hoàn thành"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {addTask && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={closeAdd}
                >
                    <div
                        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">
                                Thêm công việc
                            </h2>

                            <button
                                type="button"
                                onClick={closeAdd}
                                className="text-2xl text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4 text-gray-800">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Tên công việc
                                </label>

                                <input
                                    type="text"
                                    value={addTen}
                                    onChange={e => setAddTen(e.target.value)}
                                    placeholder="Nhập tên công việc"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Mô tả công việc
                                </label>

                                <textarea
                                    value={addMota}
                                    onChange={e => setAddMota(e.target.value)}
                                    placeholder="Nhập mô tả công việc"
                                    rows={4}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Ngày hết hạn
                                </label>

                                <input
                                    type="datetime-local"
                                    value={addNgayHetHan}
                                    onChange={e => setAddNgayHetHan(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeAdd}
                                className="rounded-md bg-[#6B7280] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4B5563]"
                            >
                                Hủy
                            </button>

                            <button
                                type="button"
                                onClick={handleAddTask}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
                            >
                                Thêm công việc
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}