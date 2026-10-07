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

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Danh sách công việc
                    </h1>
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
                                        <td className="px-6 py-4 text-gray-600">
                                            {item.TrangThai}
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
        </main>
    );
}