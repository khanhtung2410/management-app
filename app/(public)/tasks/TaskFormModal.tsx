"use client";

import { useState } from "react";
import type { CongViec } from "./taskRow";

interface TaskFormModalProps {
    onClose: () => void;
    onCreated: (task: CongViec) => void;
}

interface FormErrors {
    Ten?: string;
    HetHan?: string;
    general?: string;
}

export function TaskFormModal({ onClose, onCreated }: TaskFormModalProps) {
    // 4 state của form — sống trong modal.
    // Modal unmount → state hủy tự động, không cần reset tay.
    const [ten, setTen] = useState("");
    const [mota, setMota] = useState("");
    const [ngayHetHan, setNgayHetHan] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        const nextErrors: FormErrors = {};
        if (!ten.trim()) nextErrors.Ten = "Vui lòng nhập tên công việc";
        if (!ngayHetHan) nextErrors.HetHan = "Vui lòng chọn ngày hết hạn";

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        setSubmitting(true);

        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Ten: ten,
                    Mota: mota,
                    HetHan: ngayHetHan,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Không thể thêm công việc");
            }

            // Báo cho page biết đã tạo thành công — page cập nhật danh sách
            onCreated(result);
            // Đóng modal → unmount → state tự reset
            onClose();
        } catch (error) {
            console.error("Lỗi thêm công việc:", error);
            setErrors({
                general:
                    error instanceof Error
                        ? error.message
                        : "Không thể thêm công việc",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
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
                        onClick={onClose}
                        className="text-2xl text-gray-400 hover:text-gray-600"
                    >
                        ×
                    </button>
                </div>

                {errors.general && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                        {errors.general}
                    </div>
                )}

                <div className="space-y-4 text-gray-800">
                    <div>
                        <label htmlFor="task-name" className="mb-1 block text-sm font-medium">
                            Tên công việc
                        </label>
                        <input
                            id="task-name"
                            type="text"
                            value={ten}
                            onChange={e => {
                                setTen(e.target.value);
                                if (errors.Ten) {
                                    setErrors(prev => ({ ...prev, Ten: undefined }));
                                }
                            }}
                            placeholder="Nhập tên công việc"
                            className={
                                errors.Ten
                                    ? "w-full rounded-lg border border-red-400 px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    : "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            }
                        />
                        {errors.Ten && (
                            <p className="mt-1 text-xs text-red-600">{errors.Ten}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="task-description" className="mb-1 block text-sm font-medium">
                            Mô tả công việc
                        </label>
                        <textarea
                            id="task-description"
                            value={mota}
                            onChange={e => setMota(e.target.value)}
                            placeholder="Nhập mô tả công việc"
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label htmlFor="task-due-date" className="mb-1 block text-sm font-medium">
                            Ngày hết hạn
                        </label>
                        <input
                            id="task-due-date"
                            type="datetime-local"
                            value={ngayHetHan}
                            onChange={e => {
                                setNgayHetHan(e.target.value);
                                if (errors.HetHan) {
                                    setErrors(prev => ({ ...prev, HetHan: undefined }));
                                }
                            }}
                            className={
                                errors.HetHan
                                    ? "w-full rounded-lg border border-red-400 px-4 py-2.5 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    : "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            }
                        />
                        {errors.HetHan && (
                            <p className="mt-1 text-xs text-red-600">{errors.HetHan}</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="rounded-md bg-[#6B7280] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4B5563] disabled:opacity-60"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1D4ED8] disabled:opacity-60"
                    >
                        {submitting ? "Đang thêm..." : "Thêm công việc"}
                    </button>
                </div>
            </div>
        </div>
    );
}