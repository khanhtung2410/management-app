// Hiển thị trạng thái tải cho trang thống kê admin; không dùng thay trang dữ liệu hoặc thông báo lỗi.
import { Card } from "@/components/UI/Card";

function Bone({ className }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded bg-[#E2E8F0] ${className ?? ""}`}
        />
    );
}

export default function DashboardLoading() {
    return (
        <main
            className="min-h-screen bg-[#F3F6FA] p-4 sm:p-6 lg:p-8"
            role="status"
            aria-live="polite"
            aria-label="Đang tải dữ liệu thống kê"
        >
            <div className="mx-auto max-w-7xl" aria-hidden="true">
                {/* Header */}
                <Bone className="h-8 w-40 sm:h-9 sm:w-48" />
                <Bone className="mt-2 h-4 w-64 sm:w-72" />

                {/* 2 card lớn: Tổng người dùng + Tổng công việc */}
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {[0, 1].map((i) => (
                        <Card key={i} className="p-6 ring-1 ring-[#E2E8F0]">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <Bone className="h-4 w-32" />
                                    <Bone className="mt-3 h-10 w-20" />
                                    <Bone className="mt-3 h-3 w-40" />
                                </div>
                                <Bone className="h-16 w-16 rounded-full" />
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Card biểu đồ + danh sách trạng thái */}
                <Card className="mt-6 p-4 ring-1 ring-[#E2E8F0] sm:p-6">
                    <Bone className="h-6 w-48 sm:h-7 sm:w-56" />
                    <Bone className="mt-2 h-3 w-56" />

                    <div className="mt-4 flex flex-col items-center gap-4 2xl:grid 2xl:grid-cols-2 2xl:gap-8">
                        {/* Placeholder biểu đồ tròn */}
                        <Bone className="aspect-square w-full max-w-[280px] rounded-full" />

                        {/* Danh sách 3 trạng thái */}
                        <div className="w-full min-w-0 space-y-3 sm:space-y-4">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="rounded-xl border border-[#E2E8F0] p-3 sm:p-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Bone className="h-3 w-3 rounded-full sm:h-4 sm:w-4" />
                                            <Bone className="h-4 w-24" />
                                        </div>
                                        <Bone className="h-5 w-10" />
                                    </div>
                                    <div className="mt-2 flex items-center justify-between sm:mt-3">
                                        <Bone className="h-3 w-12" />
                                        <Bone className="h-3 w-10" />
                                    </div>
                                    <Bone className="mt-2 h-1.5 w-full rounded-full sm:h-2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* 3 card nhỏ cuối trang */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                        <Card
                            key={i}
                            shadow="sm"
                            className="p-4 ring-1 ring-[#E2E8F0] sm:p-5"
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Bone className="h-3 w-3 rounded-full" />
                                <Bone className="h-3 w-20" />
                            </div>
                            <div className="mt-2 flex items-end gap-2 sm:mt-3">
                                <Bone className="h-8 w-12" />
                                <Bone className="mb-1 h-3 w-16" />
                            </div>
                            <Bone className="mt-2 h-3 w-32" />
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}