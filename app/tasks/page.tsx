"use client";

import {
    useDeferredValue,
    useEffect,
    useMemo,
    useState,
} from "react";
import { taskStatus } from "@/constants/statuses";
import { useMediaQuery } from "@/app/api/tasks/useMediaQuery";
import { TaskList, type CongViec } from "./taskRow";

export default function Home() {
    const [data, setData] = useState<CongViec[]>([]);
    const [loading, setLoading] = useState(true);
    const [listError, setListError] = useState<string | null>(null);

    // 🔍 Search: state ngay (input) + giá trị trì hoãn (bảng)
    const [searchTerm, setSearchTerm] = useState("");
    const deferredSearch = useDeferredValue(searchTerm);

    const [addTask, setAddTask] = useState(false);
    const [addTen, setAddTen] = useState("");
    const [addMota, setAddMota] = useState("");
    const [addNgayHetHan, setAddNgayHetHan] = useState("");

    const [formErrors, setFormErrors] = useState<{
        Ten?: string;
        HetHan?: string;
        general?: string;
    }>({});

    const [toggleError, setToggleError] = useState<{
        id: number;
        message: string;
    } | null>(null);

    // 📱 Chọn layout theo màn hình
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
    // Lọc theo search (dùng deferred)
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
    // Modal thêm
    // ==============================
    const openAdd = () => {
        setAddTen("");
        setAddMota("");
        setAddNgayHetHan("");
        setFormErrors({});
        setAddTask(true);
    };

    const closeAdd = () => {
        setAddTask(false);
        setFormErrors({});
    };

    const handleAddTask = async () => {
        const errors: typeof formErrors = {};
        if (!addTen.trim()) errors.Ten = "Vui lòng nhập tên công việc";
        if (!addNgayHetHan) errors.HetHan = "Vui lòng chọn ngày hết hạn";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});

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
                throw new Error(result.message || "Không thể thêm công việc");
            }

            setData(prev => [result, ...prev]);
            setAddTen("");
            setAddMota("");
            setAddNgayHetHan("");
            setAddTask(false);
        } catch (error) {
            console.error("Lỗi thêm công việc:", error);
            setFormErrors({
                general:
                    error instanceof Error
                        ? error.message
                        : "Không thể thêm công việc",
            });
        }
    };

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
                            onClick={openAdd}
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

                {/* 🖥 Desktop: table | 📱 Mobile: card */}
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

            {/* Modal thêm công việc */}
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

                        {formErrors.general && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                                {formErrors.general}
                            </div>
                        )}

                        <div className="space-y-4 text-gray-800">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Tên công việc
                                </label>
                                <input
                                    type="text"
                                    value={addTen}
                                    onChange={e => {
                                        setAddTen(e.target.value);
                                        if (formErrors.Ten) {
                                            setFormErrors(prev => ({ ...prev, Ten: undefined }));
                                        }
                                    }}
                                    placeholder="Nhập tên công việc"
                                    className={
                                        formErrors.Ten
                                            ? "w-full rounded-lg border border-red-400 px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                            : "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    }
                                />
                                {formErrors.Ten && (
                                    <p className="mt-1 text-xs text-red-600">{formErrors.Ten}</p>
                                )}
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
                                    onChange={e => {
                                        setAddNgayHetHan(e.target.value);
                                        if (formErrors.HetHan) {
                                            setFormErrors(prev => ({ ...prev, HetHan: undefined }));
                                        }
                                    }}
                                    className={
                                        formErrors.HetHan
                                            ? "w-full rounded-lg border border-red-400 px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                            : "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    }
                                />
                                {formErrors.HetHan && (
                                    <p className="mt-1 text-xs text-red-600">{formErrors.HetHan}</p>
                                )}
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