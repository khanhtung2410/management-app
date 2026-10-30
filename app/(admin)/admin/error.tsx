import Link from "next/link";

type AdminErrorProps = {
    error: unknown;
    retry: () => void;
};

export default function AdminError({ error, retry }: AdminErrorProps) {
    return (
        <section
            aria-label="Lỗi server"
            className="min-h-[calc(100vh-7rem)] flex items-center justify-center p-6 bg-slate-100 text-slate-900"
        >
            <div className="max-w-md w-full rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                <p className="mb-4 text-sm text-red-700">
                   Có lỗi xảy ra khi tải dữ liệu trang quản trị.
                </p>

                <h2 className="mb-4 text-2xl font-bold text-red-800">
                    Lỗi chưa xác định
                </h2>

                <p className="mb-6 text-base text-slate-600">
                    {typeof error === "string"
                        ? error
                        : "Vui lòng thử lại hoặc liên hệ quản trị viên."}
                </p>

                <button
                    onClick={retry}
                    className="w-full rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-600 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {retry ? "Thử lại" : "Đang tải..."}
                </button>

                <p className="mt-4 text-xs text-slate-500">
                    <Link href="/admin/users" className="underline text-slate-400 hover:text-slate-300">
                        Về trang quản trị
                    </Link>
                </p>
            </div>
        </section>
    );
}