// Hiển thị trạng thái tải cho trang thống kê admin; không dùng thay trang dữ liệu hoặc thông báo lỗi.
import { Card } from "@/components/UI/Card";

export default function DashboardLoading() {
    return (
        <main
            className="min-h-screen bg-[#F3F6FA] p-8"
            role="status"
            aria-live="polite"
            aria-label="Đang tải dữ liệu thống kê"
        >
            <div className="mx-auto max-w-7xl">
                <Card className="p-8 text-center">
                    <p className="text-[#647488]">Đang tải dữ liệu...</p>
                </Card>
            </div>
        </main>
    );
}
