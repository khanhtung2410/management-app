// Bọc các route admin bằng điều hướng và state dùng chung; không dùng cho route công khai hoặc trang cần shell độc lập.
import Sidebar from "./_components/Sidebar";
import { LayoutProvider } from "./_components/LayoutProvider";
import AdminHeader from "./_components/AdminHeader"
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <LayoutProvider>
            <Suspense fallback={<NavbarSkeleton />}>
                <Navbar />
            </Suspense>
            <div className="flex min-h-[calc(100vh-4rem)]">
                <Sidebar />
                <div className='flex-1 min-w-0'>
                    <AdminHeader />
                    <div className='p-6'>{children}</div>
                </div>
            </div>
        </LayoutProvider>
    );
}

function NavbarSkeleton() {
    return (
        <div className="h-16 bg-gray-100 animate-pulse" />
    );
}