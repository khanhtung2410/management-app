"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayout } from "@/components/LayoutProvider";

const menus = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Người dùng", href: "/admin/users", icon: "📝" },
    { name: "Thống kê", href: "/admin/stat", icon: "📈" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { sidebarOpen, mobileOpen, toggleSidebar, closeMobile } = useLayout();

    return (
        <>

            {mobileOpen && (
                <div className="fixed inset-0 z-40 bg-black/40" onClick={closeMobile} />
            )}

            {/* Sidebar - off-canvas on mobile, inline on md+ */}
            <aside
                className={`fixed z-50 inset-y-0 left-0 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:inset-auto md:flex-shrink-0 bg-[color:var(--surface)] text-[color:var(--foreground)] overflow-hidden ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}
            >
                <div className={`p-4 text-xl font-bold flex ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
                    {sidebarOpen && <p>Admin</p>}
                    {/* collapse button visible on md+ */}
                    <button
                        onClick={toggleSidebar}
                        className="hidden md:inline-block text-2xl"
                        aria-label="Thu gọn menu"
                    >
                        ☰
                    </button>
                </div>

                <nav className="space-y-2 p-4">
                    {menus.map((menu) => {
                        const active =
                            pathname === menu.href ||
                            (menu.href !== "/admin" && pathname.startsWith(menu.href));

                        return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${active ? 'bg-[#1E40AF] text-white' : 'bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--surface-hover)]'}`}
                            >
                                <span className="text-lg">{menu.icon}</span>
                                {sidebarOpen ? <span>{menu.name}</span> : ''}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}