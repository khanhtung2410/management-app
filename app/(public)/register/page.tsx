"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();

    const [hoTen, setHoTen] = useState("");
    const [email, setEmail] = useState("");
    const [sdt, setSdt] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate
        if (!hoTen.trim()) {
            setError("Vui lòng nhập họ tên");
            return;
        }
        if (!email.trim()) {
            setError("Vui lòng nhập email");
            return;
        }
        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }
        if (password !== confirm) {
            setError("Mật khẩu nhập lại không khớp");
            return;
        }

        setError(null);
        setSubmitting(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    HoTen: hoTen.trim(),
                    Email: email.trim(),
                    SDT: sdt.trim(),
                    password,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Đăng ký thất bại");
            }

            // Đăng ký thành công → chuyển sang trang login
            router.push("/login?registered=1");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Đăng ký thất bại"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="font-sans">
            <div className="flex min-h-screen flex-col items-center justify-center px-4">
                <main className="flex w-full max-w-md flex-col items-center justify-center text-center">
                    <h1 className="text-[54px] font-bold">Đăng ký</h1>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 flex w-full flex-col gap-4"
                    >
                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-left text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <input
                            type="text"
                            aria-label="Họ tên"
                            placeholder="Họ tên"
                            value={hoTen}
                            onChange={(e) => setHoTen(e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                            required
                        />

                        <input
                            type="email"
                            aria-label="Email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                            required
                        />

                        <input
                            type="tel"
                            aria-label="Số điện thoại (tùy chọn)"
                            placeholder="Số điện thoại (tùy chọn)"
                            value={sdt}
                            onChange={(e) => setSdt(e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                        />

                        <input
                            type="password"
                            aria-label="Mật khẩu"
                            placeholder="Mật khẩu (ít nhất 6 ký tự)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                            required
                        />

                        <input
                            type="password"
                            aria-label="Nhập lại mật khẩu"
                            placeholder="Nhập lại mật khẩu"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                            required
                        />

                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-gray-800 px-4 py-3 font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting ? "Đang đăng ký..." : "Đăng ký"}
                        </button>

                        <p className="text-sm text-gray-600">
                            Đã có tài khoản?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-blue-600 hover:underline"
                            >
                                Đăng nhập
                            </Link>
                        </p>
                    </form>
                </main>
            </div>
        </div>
    );
}