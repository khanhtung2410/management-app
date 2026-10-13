import Link from "next/link";

export const metadata = {
    title: "403 — Không có quyền truy cập",
};

export default function ForbiddenPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
                <div className="mb-4 text-6xl">🚫</div>

                <h1 className="mb-2 text-3xl font-bold text-gray-800">
                    403
                </h1>

                <p className="mb-1 text-lg font-medium text-gray-700">
                    Không có quyền truy cập
                </p>

                <p className="mb-6 text-sm text-gray-500">
                    Bạn không có quyền truy cập trang này. Vui lòng liên hệ
                    quản trị viên nếu bạn cho rằng đây là nhầm lẫn.
                </p>

                <div className="flex justify-center gap-3">
                    <Link
                        href="/"
                        className="rounded-md bg-[#1E40AF] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1D4ED8]"
                    >
                        Về trang chủ
                    </Link>

                    <Link
                        href="/login"
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </main>
    );
}