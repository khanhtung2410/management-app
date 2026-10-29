// Xử lý đăng nhập và chuyển hướng theo vai trò; không dùng cho đăng ký, chỉnh sửa hồ sơ hoặc quản lý phiên.
"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { userRole } from "@/constants/roles";
import { readApiError } from "@/lib/api/client";
import { withTimeout } from "@/lib/withTimeout";
import { isAbortError } from "@/lib/isAbortError";
import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();

    const [showRegisterSuccess] = useState(
        () => searchParams.get("registered") === "1"
    );

    useEffect(() => {
        if (showRegisterSuccess) {
            window.history.replaceState(null, "", "/login");
        }
    }, [showRegisterSuccess]);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "/api/login",
                withTimeout({
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }),
            );

            if (!response.ok) {
                setError(await readApiError(response));
                return;
            }

            const meResponse = await fetch("/api/auth/me", withTimeout({}));

            if (!meResponse.ok) {
                setError("Không thể lấy thông tin người dùng");
                return;
            }

            const user = await meResponse.json();

            const destination =
                user.roleId === userRole.ADMIN ? "/admin" : "/";

            window.location.replace(destination);
        } catch (error) {
            console.error(error);
            setError(
                isAbortError(error)
                    ? "Yêu cầu quá lâu, vui lòng thử lại"
                    : "Có lỗi xảy ra khi đăng nhập",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans">
            <div className="flex min-h-screen flex-col items-center justify-center">
                <main className="flex w-full flex-col items-center justify-center px-20 text-center">
                    <h1 className="text-[54px] font-bold">Đăng nhập</h1>

                    {showRegisterSuccess && (
                        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                            Đăng ký thành công! Vui lòng đăng nhập.
                        </p>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 flex w-full max-w-md flex-col gap-4"
                    >
                        <Input
                            input={{
                                "aria-label": "Email",
                                type: "email",
                                placeholder: "Email",
                                value: email,
                                onChange: (e) => setEmail(e.target.value),
                                className: "rounded-lg px-4 py-3",
                                required: true,
                            }}
                        />

                        <Input
                            input={{
                                "aria-label": "Mật khẩu",
                                type: "password",
                                placeholder: "Mật khẩu",
                                value: password,
                                onChange: (e) => setPassword(e.target.value),
                                className: "rounded-lg px-4 py-3",
                                required: true,
                            }}
                        />

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <Button
                            variant="muted"
                            type="submit"
                            disabled={loading}
                            loading={loading}
                            className="w-full rounded-lg py-3"
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                    </form>
                </main>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    Đang tải...
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}