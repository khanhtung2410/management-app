"use client";

import { useEffect, useState } from "react";

interface CongViec {
    ID: number;
    Ten: string;
    Mota: string;
    TrangThai: string;
    HetHan: string;
}

export default function Home() {
    const [data, setData] = useState<CongViec[]>([]);

    const [addTask, setAddTask] = useState(false);
    const [addTen, setAddTen] = useState("");
    const [addMota, setAddMota] = useState("");
    const [addNgayHetHan, setAddNgayHetHan] = useState("");

    useEffect(() => {
        fetch("/api/tasks", {
            credentials: "include",
        })
            .then(async response => {
                const result = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = "/login";
                        return null;
                    }

                    throw new Error(
                        result.message || "Không thể lấy dữ liệu"
                    );
                }

                return result;
            })
            .then(result => {
                if (result) {
                    setData(result);
                }
            })
            .catch(error => {
                console.error("Lỗi:", error);
            });
    }, []);

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
                headers: {
                    "Content-Type": "application/json",
                },
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

                throw new Error(
                    result.message || "Không thể thêm công việc"
                );
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
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {data.map(item => (
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
                                                    backgroundColor:
                                                        item.TrangThai === "Hoàn thành"
                                                            ? "#DCFCE7"
                                                            : item.TrangThai === "Đang thực hiện"
                                                                ? "#DBEAFE"
                                                                : "#FEF3C7",
                                                    color:
                                                        item.TrangThai === "Hoàn thành"
                                                            ? "#15803D"
                                                            : item.TrangThai === "Đang thực hiện"
                                                                ? "#1D4ED8"
                                                                : "#B45309"
                                                }}
                                            >
                                                {item.TrangThai}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {item.HetHan}
                                        </td>
                                    </tr>
                                ))}
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
                                    onChange={e =>
                                        setAddTen(e.target.value)
                                    }
                                    placeholder="Nhập tên công việc"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium ">
                                    Mô tả công việc
                                </label>

                                <textarea
                                    value={addMota}
                                    onChange={e =>
                                        setAddMota(e.target.value)
                                    }
                                    placeholder="Nhập mô tả công việc"
                                    rows={4}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium ">
                                    Ngày hết hạn
                                </label>

                                <input
                                    type="datetime-local"
                                    value={addNgayHetHan}
                                    onChange={e =>
                                        setAddNgayHetHan(e.target.value)
                                    }
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