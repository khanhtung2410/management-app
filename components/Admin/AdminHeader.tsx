"use client"
import { useLayout } from "@/components/LayoutProvider";

export default function AdminHeader() {
    const { openMobile } = useLayout();
    return (
        <header className="md:hidden flex items-center gap-3 border-b px-4 py-3 bg-[color:var(--surface)] text-[color:var(--foreground)">
            <button
                onClick={openMobile}
                aria-label="Mở menu"
                className='rounded-md p-2 hover:bg-[color:vả(--surface-hover)]'
            >☰</button>
            <span className='font-semibold'>Admin</span>
        </header>

    )
}