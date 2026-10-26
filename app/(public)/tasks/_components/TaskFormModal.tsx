// Tạo công việc mới trong modal và trả kết quả cho danh sách; không dùng để sửa công việc hiện có hoặc hiển thị chi tiết.
"use client";

import { useState } from "react";
import type { CongViec } from "./taskRow";
import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";

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
                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={onClose}
                        aria-label="Đóng biểu mẫu"
                        className="text-2xl text-gray-600 hover:text-gray-700"
                    >
                        ×
                    </Button>
                </div>

                {errors.general && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                        {errors.general}
                    </div>
                )}

                <div className="space-y-4 text-gray-800">
                    <div>
                        <Input
                            label="Tên công việc"
                            error={errors.Ten}
                            input={{
                                id: "task-name",
                                type: "text",
                                value: ten,
                                onChange: e => {
                                    setTen(e.target.value);
                                    if (errors.Ten) {
                                        setErrors(prev => ({ ...prev, Ten: undefined }));
                                    }
                                },
                                placeholder: "Nhập tên công việc",
                                className: "rounded-lg px-4 py-2.5",
                            }}
                        />
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        />
                    </div>

                    <div>
                        <Input
                            label="Ngày hết hạn"
                            error={errors.HetHan}
                            input={{
                                id: "task-due-date",
                                type: "datetime-local",
                                value: ngayHetHan,
                                onChange: e => {
                                    setNgayHetHan(e.target.value);
                                    if (errors.HetHan) {
                                        setErrors(prev => ({ ...prev, HetHan: undefined }));
                                    }
                                },
                                className: "rounded-lg px-4 py-2.5",
                            }}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="muted"
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        loading={submitting}
                    >
                        {submitting ? "Đang thêm..." : "Thêm công việc"}
                    </Button>
                </div>
            </div>
        </div>
    );
}