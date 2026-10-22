"use client"
import { useLayout } from "@/components/LayoutProvider";
import { Button } from "@/components/UI/Button";

export default function AdminHeader() {
    const { openMobile } = useLayout();
    return (
        <header className="md:hidden flex items-center gap-3 border-b px-4 py-3 bg-[color:var(--surface)] text-[color:var(--foreground)]">
            <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={openMobile}
                aria-label="Mở menu"
                className='hover:bg-[color:var(--surface-hover)]'
            >☰</Button>
            <span className='font-semibold'>Admin</span>
        </header>

    )
}