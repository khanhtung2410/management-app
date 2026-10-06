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
        <nav className="bg-gray-800 px-6 py-4 text-white">
            <div className="flex justify-between">
                <div className="flex gap-6">
                    <Link
                        href="/"
                        className="text-gray-300 hover:text-white"
                    >
                        Trang chủ
                    </Link>

                    {isLoggedIn && (
                        <Link
                            href="/tasks"
                            className="text-gray-300 hover:text-white"
                        >
                            Công việc
                        </Link>
                    )}
                </div>

                <div className="flex gap-6">
                    {!isLoggedIn ? (
                        <>
                            <Link
                                href="/login"
                                className="text-gray-300 hover:text-white"
                            >
                                Đăng nhập
                            </Link>

                            <Link
                                href="/register"
                                className="text-gray-300 hover:text-white"
                            >
                                Đăng ký
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="text-gray-300">
                                Xin chào, {userName}
                            </span>

                            <button
                                onClick={handleLogout}
                                className="text-gray-300 hover:text-white"
                            >
                                Đăng xuất
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}