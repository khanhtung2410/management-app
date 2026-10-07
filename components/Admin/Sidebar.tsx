"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Người dùng", href: "/admin/users", icon: "📝" },
    { name: "Danh mục", href: "/admin/danh-muc", icon: "📁" },
    { name: "Thống kê", href: "/admin/stat", icon: "📈" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        // Sidebar participates in the page flow (not fixed) so it doesn't overlap with the top navbar
        <aside className="w-64 min-h-screen flex-shrink-0 bg-[color:var(--surface)] text-[color:var(--foreground)]">
            <div className="p-4 text-xl font-bold">Admin</div>

            <nav className="space-y-2 p-4">
                {menus.map((menu) => {
                    const active =
                        pathname === menu.href ||
                        (menu.href !== "/admin" && pathname.startsWith(menu.href));

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                                active
                                    ? "bg-blue-600 text-white"
                                    : "bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--surface-hover)]"
                            }`}
                        >
                            <span>{menu.icon}</span>
                            <span>{menu.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
