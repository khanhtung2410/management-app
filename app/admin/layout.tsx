import Sidebar from "../../components/Admin/Sidebar";

export default function AdminLayout({
    children,
}: LayoutProps<"/admin">) {
    return (
        <div className="min-h-screen flex">
            <Sidebar />

            <main className="ml-64 flex-1 min-h-screen bg-gray-100 p-6">
                {children}
            </main>
        </div>
    );
}