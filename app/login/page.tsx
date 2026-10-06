"use client";

import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Đăng nhập thất bại");
                return;
            }

            console.log(data);

            const meResponse = await fetch("/api/auth/me");

            if (!meResponse.ok) {
                setError("Không thể lấy thông tin người dùng");
                return;
            }

            const user = await meResponse.json();

            if (user.roleId === 2) {
                location.href = "/admin";
            } else {
                location.href = "/";
            }
        } catch (error) {
            console.error(error);
            setError("Có lỗi xảy ra khi đăng nhập");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans">
            <div className="flex min-h-screen flex-col items-center justify-center">
                <main className="flex w-full flex-col items-center justify-center px-20 text-center">
                    <h1 className="text-[54px] font-bold">
                        Đăng nhập
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 flex w-full max-w-md flex-col gap-4"
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                            required
                        />

                        {error && (
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-gray-800 px-4 py-3 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}