// Hiển thị trang lỗi 403 hoặc 404 dùng chung; không dùng cho lỗi nghiệp vụ hay trạng thái tải dữ liệu.
import Link from "next/link";

type StatusCode = "403" | "404";

export default function StatusPage({ code }: { code: StatusCode }) {
    const isNotFound = code === "404";

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

                <div className="flex flex-wrap justify-center gap-3">
                    <Link
                        href="/"
                        className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                        Về trang chủ
                    </Link>

                    {!isNotFound && (
                        <Link
                            href="/login"
                            className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            Đăng nhập bằng tài khoản khác
                        </Link>
                    )}
                </div>
            </section>
        </main>
    );
}
