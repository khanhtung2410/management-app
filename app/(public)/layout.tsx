// Chia sẻ Navbar và vùng nội dung cho các route công khai; không dùng bọc route admin cần sidebar và state riêng.
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>
      <main className="min-h-screen">{children}</main>
    </>
  );
}

function NavbarSkeleton() {
  return (
    <div className="h-16 bg-gray-100 animate-pulse" />
  );
}