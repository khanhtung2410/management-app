"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { withTimeout } from "@/lib/withTimeout";

type StatusCode = "403" | "404";
type AuthenticationStatus =
    | "checking"
    | "authenticated"
    | "unauthenticated"
    | "error";

export default function StatusPage({ code }: { code: StatusCode }) {
    const [authenticationStatus, setAuthenticationStatus] =
        useState<AuthenticationStatus>("checking");
    const [retryCount, setRetryCount] = useState(0);
    const isNotFound = code === "404";

    useEffect(() => {
        let isCurrent = true;

        fetch("/api/auth/me", withTimeout({ credentials: "include" }))
            .then(async (response) => {
                if (response.status === 401) {
                    return false;
                }

                if (!response.ok) {
                    throw new Error(
                        `Authentication check failed with status ${response.status}`,
                    );
                }

                const data: unknown = await response.json();
                if (
                    typeof data !== "object" ||
                    data === null ||
                    !("isLoggedIn" in data) ||
                    typeof data.isLoggedIn !== "boolean"
                ) {
                    throw new Error(
                        "Authentication check returned an invalid response",
                    );
                }

                return data.isLoggedIn;
            })
            .then((isLoggedIn) => {
                if (isCurrent) {
                    setAuthenticationStatus(
                        isLoggedIn ? "authenticated" : "unauthenticated",
                    );
                }
            })
            .catch((error: unknown) => {
                if (isCurrent) {
                    console.error("Lỗi kiểm tra trạng thái đăng nhập:", error);
                    setAuthenticationStatus("error");
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [retryCount]);

    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-12">
            <section className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:px-12">
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-400">
                    Lỗi {code}
                </p>

                <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                    {isNotFound
                        ? "Không tìm thấy trang"
                        : "Không có quyền truy cập"}
                </h1>

                <p className="mx-auto mb-8 max-w-md text-base leading-7 text-gray-600 dark:text-gray-300">
                    {isNotFound
                        ? "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển."
                        : "Tài khoản hiện tại không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn."}
                </p>

                {authenticationStatus === "error" && (
                    <div
                        className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-200"
                        role="status"
                    >
                        Không thể kiểm tra trạng thái đăng nhập. Vui lòng thử
                        lại.
                    </div>
                )}

                <div className="flex flex-wrap justify-center gap-3">
                    <Link
                        href="/"
                        className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                        Về trang chủ
                    </Link>

                    {authenticationStatus === "unauthenticated" && (
                        <Link
                            href="/login"
                            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            Đăng nhập
                        </Link>
                    )}

                    {authenticationStatus === "error" && (
                        <button
                            type="button"
                            onClick={() => {
                                setAuthenticationStatus("checking");
                                setRetryCount((count) => count + 1);
                            }}
                            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            Thử lại
                        </button>
                    )}
                </div>

                {authenticationStatus === "checking" && (
                    <p className="mt-5 text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
                        Đang kiểm tra trạng thái đăng nhập...
                    </p>
                )}
            </section>
        </main>
    );
}
