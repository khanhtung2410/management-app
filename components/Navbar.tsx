"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        fetch("/api/auth/me", {
            credentials: "include",
        })
            .then(async (res) => {
                if (!res.ok) {
                    setIsLoggedIn(false);
                    setUserName("");
                    return;
                }

                const data = await res.json();

                setIsLoggedIn(data.isLoggedIn);
                setUserName(data.userName || "");
            })
            .catch((error) => {
                console.error("Lỗi kiểm tra đăng nhập:", error);
                setIsLoggedIn(false);
                setUserName("");
            });
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                setIsLoggedIn(false);
                setUserName("");
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        }
    };

    return (
        <nav className="px-6 py-4" style={{ background: "var(--surface)", color: "var(--foreground)" }}>
            <div className="flex justify-between">
                <div className="flex gap-6">
                    <Link href="/" className="hover:underline">
                        Trang chủ
                    </Link>

                    {isLoggedIn && (
                            <Link href="/tasks" className="hover:underline">
                                Công việc
                            </Link>
                    )}
                </div>

                <div className="flex gap-6">
                    {!isLoggedIn ? (
                        <>
                            <Link href="/login" className="hover:underline">
                                Đăng nhập
                            </Link>

                            <Link href="/register" className="hover:underline">
                                Đăng ký
                            </Link>
                        </>
                    ) : (
                        <>
                            <span>Xin chào, {userName}</span>

                            <button onClick={handleLogout} className="hover:underline">
                                Đăng xuất
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}