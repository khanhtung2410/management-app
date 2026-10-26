export default function TaskDetailLoading() {
    return (
        <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="mx-auto max-w-4xl">
                {/* Hàng nút: Quay lại + TaskStatusButton */}
                <div className="mb-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="h-9 w-28 animate-pulse rounded-md bg-gray-200" />
                    <div className="h-9 w-36 animate-pulse rounded-md bg-gray-200" />
                </div>

                {/* Card chính */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    {/* Header card */}
                    <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-2">
                                <div className="h-3 w-24 animate-pulse rounded bg-gray-300" />
                                <div className="h-7 w-2/3 animate-pulse rounded bg-gray-300" />
                            </div>
                            <div className="h-6 w-24 animate-pulse rounded-full bg-gray-300" />
                        </div>
                    </div>

                    {/* Body: grid 2 cột */}
                    <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-2">
                        {/* Mô tả (col-span-2) */}
                        <div className="md:col-span-2">
                            <div className="mb-2 h-5 w-20 animate-pulse rounded bg-gray-300" />
                            <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                                <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
                                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                            </div>
                        </div>

                        {/* Hạn hoàn thành */}
                        <div>
                            <div className="mb-2 h-5 w-32 animate-pulse rounded bg-gray-300" />
                            <div className="h-12 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                            </div>
                        </div>

                        {/* Trạng thái */}
                        <div>
                            <div className="mb-2 h-5 w-36 animate-pulse rounded bg-gray-300" />
                            <div className="h-12 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <div className="h-4 w-20 animate-pulse rounded-full bg-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}