// Điều hướng các mục admin với trạng thái thu gọn và menu mobile; không dùng cho điều hướng công khai hay tab trong trang.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayout } from "./LayoutProvider";
import { Button } from "@/components/UI/Button";

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
                <button
                    type="button"
                    aria-label="Đóng menu"
                    className="fixed inset-0 z-40 bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                    onClick={closeMobile}
                />
            )}

            {/* Sidebar - off-canvas on mobile, inline on md+ */}
            <aside
                id="admin-sidebar"
                className={`fixed z-50 inset-y-0 left-0 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:self-start md:flex-shrink-0 bg-[color:var(--surface)] text-[color:var(--foreground)] overflow-hidden ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}
            >
                <div className={`p-4 text-xl font-bold flex ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
                    {sidebarOpen && <p>Admin</p>}
                    {/* collapse button visible on md+ */}
                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={toggleSidebar}
                        className="hidden text-2xl md:inline-block"
                        aria-label={sidebarOpen ? "Thu gọn menu" : "Mở rộng menu"}
                    >
                        ☰
                    </Button>
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
                                aria-label={menu.name}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${active ? 'bg-[#1E40AF] text-white' : 'bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--surface-hover)]'}`}
                            >
                                <span aria-hidden="true" className="text-lg">{menu.icon}</span>
                                {sidebarOpen ? <span>{menu.name}</span> : ''}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}