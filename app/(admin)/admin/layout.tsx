// Bọc các route admin bằng điều hướng và state dùng chung; không dùng cho route công khai hoặc trang cần shell độc lập.
import Sidebar from "@/components/Admin/Sidebar";
import { LayoutProvider } from "@/components/LayoutProvider";
import AdminHeader from "@/components/Admin/AdminHeader"
import Navbar from "@/components/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <LayoutProvider>
            <Navbar />
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