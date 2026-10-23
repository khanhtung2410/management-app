// Đăng xuất người dùng qua API và hiển thị trạng thái/lỗi; không dùng thay cho điều hướng hoặc xử lý phiên hết hạn.
"use client";

import { useState } from "react";

export function HandleLogout() {
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const handleLogout = async () => {
        setPending(true);
        setError(null);

        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Không thể đăng xuất");
            }
           
            window.location.replace("/");
        } catch (err) {
            console.error("Lỗi đăng xuất:", err);
            setError(
                err instanceof Error ? err.message : "Không thể đăng xuất",
            );
            setPending(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={handleLogout}
                disabled={pending}
                className="appearance-none border-0 bg-transparent p-0 font-[inherit] leading-[inherit] text-current hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
            {error && <span role="alert">{error}</span>}
        </>
    );
}
