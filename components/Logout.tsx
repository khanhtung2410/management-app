"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HandleLogout() {
    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const router = useRouter();

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
                className="hover:underline disabled:opacity-50"
            >
                {pending ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
            {error && <span role="alert">{error}</span>}
        </>
    );
}
