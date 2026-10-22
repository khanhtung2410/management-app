// Bọc toàn bộ ứng dụng bằng cấu trúc HTML, font và metadata gốc; không dùng cho bố cục riêng của từng nhóm route.
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Quản lý công việc cá nhân",
    description: "Website quản lý công việc cá nhân",
};

export default function RootLayout({
    children,
}: LayoutProps<"/">) {
    return (
        <html
            lang="vi"
            className={`${geistSans.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                {children}
            </body>
        </html>
    );
}