"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Công việc", href: "/admin/cong-viec", icon: "📝" },
    { name: "Danh mục", href: "/admin/danh-muc", icon: "📁" },
    { name: "Thống kê", href: "/admin/thong-ke", icon: "📈" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside
            className="fixed left-0 top-0 z-50 min-h-screen w-64 bg-gray-700 text-white">
            <div className="p-4 text-xl font-bold">
                Admin
            </div>

            <nav className="space-y-2 p-4">
                {menus.map((menu) => {
                    const active =
                        pathname === menu.href ||
                        (menu.href !== "/admin" &&
                            pathname.startsWith(menu.href));

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                                active
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-800"
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