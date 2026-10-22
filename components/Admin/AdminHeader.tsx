// Hiển thị thanh tiêu đề admin trên màn hình nhỏ và nút mở menu; không dùng làm header công khai hoặc điều hướng desktop.
"use client"
import { useLayout } from "@/components/LayoutProvider";
import { Button } from "@/components/UI/Button";

export default function AdminHeader() {
    const { openMobile, closeMobile, mobileOpen } = useLayout();
    return (
        <header className="md:hidden flex items-center gap-3 border-b px-4 py-3 bg-[color:var(--surface)] text-[color:var(--foreground)]">
            <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={mobileOpen ? closeMobile : openMobile}
                aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
                aria-expanded={mobileOpen}
                aria-controls="admin-sidebar"
                className='hover:bg-[color:var(--surface-hover)]'
            >☰</Button>
            <span className='font-semibold'>Admin</span>
        </header>

    )
}