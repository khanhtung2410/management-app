
"use client";

import { useState } from "react";

type Task = {
    id: number;
    ten: string;
    moTa: string;
    hetHan: string;
    trangThai: "Chưa hoàn thành" | "Đang thực hiện" | "Hoàn thành";
};

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            ten: "Học HTML",
            moTa: "Làm quen với HTML cơ bản",
            hetHan: "10/10/2026",
            trangThai: "Đang thực hiện"
        },
        {
            id: 2,
            ten: "Học CSS",
            moTa: "Học cách thiết kế giao diện",
            hetHan: "15/10/2026",
            trangThai: "Chưa hoàn thành"
        },
        {
            id: 3,
            ten: "Làm project",
            moTa: "Xây dựng ứng dụng quản lý công việc",
            hetHan: "20/10/2026",
            trangThai: "Hoàn thành"
        }
    ]);

    const doiTrangThai = (id: number) => {
        setTasks(current =>
            current.map(task => {
                if (task.id !== id) return task;

                const trangThaiMoi =
                    task.trangThai === "Chưa hoàn thành"
                        ? "Đang thực hiện"
                        : task.trangThai === "Đang thực hiện"
                            ? "Hoàn thành"
                            : "Chưa hoàn thành";

                return {
                    ...task,
                    trangThai: trangThaiMoi
                };
            })
        );
    };

    const getTrangThaiClass = (trangThai: Task["trangThai"]) => {
        switch (trangThai) {
            case "Hoàn thành":
                return "bg-green-100 text-green-700";
            case "Đang thực hiện":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Quản lý công việc
                    </h1>
                    <p className="mt-1 text-gray-500">
                        Danh sách công việc
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr className="border-b">
                                    <th className="px-6 py-4">Tên</th>
                                    <th className="px-6 py-4">Mô tả</th>
                                    <th className="px-6 py-4">Thời hạn</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4">Thao tác</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {tasks.map(task => (
                                    <tr
                                        key={task.id}
                                        className="transition hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {task.ten}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {task.moTa}
                                        </td>

                                        <td className="px-6 py-4 text-gray-600">
                                            {task.hetHan}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded - full px - 3 py - 1 text - sm font - medium ${ getTrangThaiClass(task.trangThai) } `}
                                            >
                                                {task.trangThai}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => doiTrangThai(task.id)}
                                                className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                                            >
                                                Đổi trạng thái
                                            </button>
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

