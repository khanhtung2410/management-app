import { Card } from "@/components/UI/Card";

export default function AdminDashboardLoading() {
    return (
        <div
            role="status"
            aria-label="Đang tải dashboard"
            className="-m-6 min-h-[calc(100vh-7rem)] animate-pulse space-y-8 bg-slate-100 p-6"
        >
            <header className="space-y-2">
                <div className="h-7 w-40 rounded bg-slate-300" />
                <div className="h-4 w-72 max-w-full rounded bg-slate-200" />
            </header>

            <section
                aria-hidden="true"
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5"
            >
                {Array.from({ length: 5 }, (_, index) => (
                    <Card key={index} className="!bg-slate-50 space-y-4 p-5">
                        <div className="h-4 w-28 rounded bg-slate-200" />
                        <div className="h-9 w-16 rounded bg-slate-300" />
                        <div className="h-4 w-36 max-w-full rounded bg-slate-200" />
                    </Card>
                ))}
            </section>

            <Card
                aria-hidden="true"
                className="!bg-slate-50 space-y-5 overflow-hidden p-5"
            >
                <div className="h-6 w-48 rounded bg-slate-300" />
                {Array.from({ length: 5 }, (_, index) => (
                    <div
                        key={index}
                        className="h-10 rounded bg-slate-200"
                    />
                ))}
            </Card>
            <span className="sr-only">Đang tải dữ liệu dashboard...</span>
        </div>
    );
}
