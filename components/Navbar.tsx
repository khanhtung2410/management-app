// Hiển thị điều hướng chung và trạng thái đăng nhập; không dùng cho menu điều hướng riêng của khu vực admin.
import Link from "next/link";
import { getAuth } from "@/lib/auth/server";
import { HandleLogout } from "./Logout";

export default async function Navbar() {
    const user = await getAuth();

    return (
        <nav className="sticky top-0 z-50 px-6 py-4" style={{ background: "var(--surface)", color: "var(--foreground)" }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                        Trang chủ
                    </Link>

                    {user && (
                        <Link href="/tasks" className="hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                            Công việc
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    {!user ? (
                        <>
                            <Link href="/login" className="hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                                Đăng nhập
                            </Link>

                            <Link href="/register" className="hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                                Đăng ký
                            </Link>
                        </>
                    ) : (
                        <>
                            <span>Xin chào, {user.userName}</span>
                            <HandleLogout />
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}