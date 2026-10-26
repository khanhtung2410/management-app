// Hiển thị điều khiển chuyển trang cho danh sách; không dùng để sắp xếp, lọc hoặc tải dữ liệu.
import { Button } from "@/components/UI/Button";

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
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    return (
        <div className="flex items-center justify-between border-t border-[#E2E8F0] px-4 py-3 sm:px-6 sm:py-4">
            <Button
                variant="secondary"
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Trước
            </Button>

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
                            <Button
                                key={page}
                                variant={currentPage === page ? "primary" : "secondary"}
                                type="button"
                                onClick={() => onPageChange(page)}
                                aria-current={currentPage === page ? "page" : undefined}
                                className="min-w-9"
                            >
                                {page}
                            </Button>
                        ),
                    )}
                </div>
            </div>

            <Button
                variant="secondary"
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Sau
            </Button>
        </div>
    );
}