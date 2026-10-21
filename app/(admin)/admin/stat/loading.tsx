export default function DashboardLoading() {
    return (
        <main
            className="min-h-screen bg-[#F3F6FA] p-8"
            role="status"
            aria-live="polite"
            aria-label="Đang tải dữ liệu thống kê"
        >
            <div className="mx-auto max-w-7xl">
                <div className="rounded-xl bg-white p-8 text-center shadow-md">
                    <p className="text-[#647488]">Đang tải dữ liệu...</p>
                </div>
            </div>
        </main>
    );
}
