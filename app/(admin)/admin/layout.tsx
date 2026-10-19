import Sidebar from "@/components/Admin/Sidebar";
import { LayoutProvider } from "@/components/LayoutProvider";
import AdminHeader from "@/components/Admin/AdminHeader"
import Navbar from "@/components/Navbar";

// Wraps admin pages with their shared shell; public routes should not inherit admin navigation or state.
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