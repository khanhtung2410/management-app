// Đăng xuất người dùng qua API và hiển thị trạng thái/lỗi; không dùng thay cho điều hướng hoặc xử lý phiên hết hạn.
"use client";

import { useState } from "react";
import { Button } from "@/components/UI/Button";

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
            <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={handleLogout}
                disabled={pending}
                loading={pending}
                className="hover:underline"
            >
                {pending ? "Đang đăng xuất..." : "Đăng xuất"}
            </Button>
            {error && <span role="alert">{error}</span>}
        </>
    );
}
