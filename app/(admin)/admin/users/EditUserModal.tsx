"use client";

import { useState } from "react";
import type { User, UserUpdatePayload } from "./api";

interface Props {
    user: User;
    onClose: () => void;
    onSave: (payload: UserUpdatePayload) => Promise<void>;
}

export function EditUserModal({ user, onClose, onSave }: Props) {
    // ✅ Khởi tạo 1 lần từ props — cha dùng key để reset khi user đổi
    const [name, setName] = useState(user.HoTen ?? "");
    const [email, setEmail] = useState(user.Email ?? "");
    const [phone, setPhone] = useState(user.SDT ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            setError("Vui lòng nhập họ tên và email");
            return;
        }

        setError(null);
        setSaving(true);
        try {
            await onSave({
                userId: user.ID,
                HoTen: name.trim(),
                Email: email.trim(),
                SDT: phone.trim(),
            });
            onClose();
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error ? err.message : "Lưu người dùng thất bại"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 text-[#0f172a] shadow-lg">
                <h2 className="mb-4 text-xl font-semibold">Sửa người dùng</h2>

                {error && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <FormField id="edit-user-name" label="Họ tên" value={name} onChange={setName} />
                <FormField id="edit-user-email" label="Email" type="email" value={email} onChange={setEmail} />
                <FormField id="edit-user-phone" label="SĐT" value={phone} onChange={setPhone} />

                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-md border px-4 py-2 text-sm hover:bg-[#F1F5F9] disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-md bg-[#1E40AF] px-4 py-2 text-sm text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function FormField({
    id,
    label,
    value,
    onChange,
    type = "text",
}: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
}) {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-md border px-3 py-2 outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]"
            />
        </div>
    );
}