import { Card } from "@/components/UI/Card";

const TABLE_COLUMN_WIDTHS = ["w-12", "w-32", "w-40", "w-24", "w-24", "w-24"];

function SkeletonLine({ className }: { className: string }) {
    return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
}

export default function TasksLoading() {
    return (
        <main
            className="min-h-screen bg-gray-100 p-4 sm:p-8"
            role="status"
            aria-live="polite"
            aria-label="Đang tải danh sách công việc"
        >
            <div className="mx-auto max-w-6xl" aria-hidden="true">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <SkeletonLine className="h-9 w-64" />
                        <SkeletonLine className="h-4 w-48" />
                    </div>
                    <div className="flex gap-2">
                        <SkeletonLine className="h-10 w-full sm:w-64" />
                        <SkeletonLine className="h-10 w-36" />
                    </div>
                </div>

                <div className="space-y-3 md:hidden">
                    {Array.from({ length: 5 }, (_, index) => (
                        <Card key={index} className="p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 space-y-2">
                                    <SkeletonLine className="h-3 w-12" />
                                    <SkeletonLine className="h-5 w-2/3" />
                                </div>
                                <SkeletonLine className="h-6 w-20 rounded-full" />
                            </div>
                            <SkeletonLine className="mt-3 h-4 w-full" />
                            <div className="mt-4 flex justify-between">
                                <SkeletonLine className="h-4 w-24" />
                                <SkeletonLine className="h-8 w-32" />
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="hidden overflow-hidden md:block">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    {TABLE_COLUMN_WIDTHS.map((width, index) => (
                                        <th key={index} className="px-6 py-4">
                                            <SkeletonLine className={`h-4 ${width}`} />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 5 }, (_, index) => (
                                    <tr key={index} className="border-t">
                                        {TABLE_COLUMN_WIDTHS.map((width, cellIndex) => (
                                            <td key={cellIndex} className="px-6 py-5">
                                                <SkeletonLine className={`h-4 ${width}`} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </main>
    );
}
