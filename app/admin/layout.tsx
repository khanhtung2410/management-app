import Sidebar from "../../components/Admin/Sidebar";

export default function AdminLayout({
    children,
}: LayoutProps<"/admin">) {
    return (
        <div className="min-h-screen flex">
            <Sidebar />

            <main className="flex-1 min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] p-6">
                {children}
            </main>
        </div>
    );
}