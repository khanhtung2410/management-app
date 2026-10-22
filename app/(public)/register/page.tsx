// Thu thập thông tin để tạo tài khoản mới; không dùng cho đăng nhập, sửa hồ sơ hoặc tạo người dùng admin.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";

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

                        <Input
                            input={{
                                "aria-label": "Họ tên",
                                type: "text",
                                placeholder: "Họ tên",
                                value: hoTen,
                                onChange: (e) => setHoTen(e.target.value),
                                className: "rounded-lg px-4 py-3",
                                required: true,
                            }}
                        />

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
                                "aria-label": "Số điện thoại (tùy chọn)",
                                type: "tel",
                                placeholder: "Số điện thoại (tùy chọn)",
                                value: sdt,
                                onChange: (e) => setSdt(e.target.value),
                                className: "rounded-lg px-4 py-3",
                            }}
                        />

                        <Input
                            input={{
                                "aria-label": "Mật khẩu",
                                type: "password",
                                placeholder: "Mật khẩu (ít nhất 6 ký tự)",
                                value: password,
                                onChange: (e) => setPassword(e.target.value),
                                className: "rounded-lg px-4 py-3",
                                required: true,
                            }}
                        />

                        <Input
                            input={{
                                "aria-label": "Nhập lại mật khẩu",
                                type: "password",
                                placeholder: "Nhập lại mật khẩu",
                                value: confirm,
                                onChange: (e) => setConfirm(e.target.value),
                                className: "rounded-lg px-4 py-3",
                                required: true,
                            }}
                        />

                        <Button
                            variant="muted"
                            type="submit"
                            disabled={submitting}
                            loading={submitting}
                            className="w-full rounded-lg py-3"
                        >
                            {submitting ? "Đang đăng ký..." : "Đăng ký"}
                        </Button>

                        <p className="text-sm text-gray-600">
                            Đã có tài khoản?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-blue-600 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
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