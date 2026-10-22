import Link from "next/link";
import { getAuth } from "@/lib/auth/server";
import { HandleLogout } from "./Logout";

export default async function Navbar() {
    const user = await getAuth();

    return (
        <nav className="sticky top-0 z-50 px-6 py-4" style={{ background: "var(--surface)", color: "var(--foreground)" }}>
            <div className="flex justify-between">
                <div className="flex gap-6">
                    <Link href="/" className="hover:underline">
                        Trang chủ
                    </Link>

                    {user && (
                        <Link href="/tasks" className="hover:underline">
                            Công việc
                        </Link>
                    )}
                </div>

                <div className="flex gap-6">
                    {!user ? (
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
                            <span>Xin chào, {user.userName}</span>
                            <HandleLogout />
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}