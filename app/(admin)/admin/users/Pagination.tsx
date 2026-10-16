"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function getPageNumbers(
    currentPage: number,
    totalPages: number,
): (number | "...")[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 4) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages);
    return pages;
}

const navBtn =
    "rounded-md border px-3 py-2 text-sm text-[#334155] transition hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-50";

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    return (
        <div className="flex items-center justify-between border-t border-[#E2E8F0] px-4 py-3 sm:px-6 sm:py-4">
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={navBtn}
            >
                Trước
            </button>

            <div className="flex items-center gap-1">
                <span className="px-3 py-2 text-sm font-medium text-[#334155] sm:hidden">
                    {currentPage} / {totalPages}
                </span>
                <div className="hidden items-center gap-1 sm:flex">
                    {getPageNumbers(currentPage, totalPages).map((page, i) =>
                        page === "..." ? (
                            <span key={`dots-${i}`} className="px-2 py-2 text-sm text-[#64748B]">
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                type="button"
                                onClick={() => onPageChange(page)}
                                className={`min-w-9 rounded-md px-3 py-2 text-sm transition ${currentPage === page
                                        ? "bg-[#1E40AF] text-white"
                                        : "border text-[#334155] hover:bg-[#F1F5F9]"
                                    }`}
                            >
                                {page}
                            </button>
                        ),
                    )}
                </div>
            </div>

            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={navBtn}
            >
                Sau
            </button>
        </div>
    );
}