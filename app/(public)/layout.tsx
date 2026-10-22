// Chia sẻ Navbar và vùng nội dung cho các route công khai; không dùng bọc route admin cần sidebar và state riêng.
import Navbar from "@/components/Navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </>
  );
}