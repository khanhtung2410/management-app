import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quản lý công việc cá nhân",
  description: "Website quản lý công việc cá nhân",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
          <body className="min-h-full flex flex-col">
              <nav className="mx-3 mt-3 bg-gray-800 text-white rounded-lg">
                  <div className="flex justify-between">
                      <div className="flex gap-6">
                          <a href="/" className="text-gray-300 hover:text-white">
                              Trang chủ
                          </a>
                          <a href="/tasks" className="text-gray-300 hover:text-white">
                              Công việc
                          </a>
                      </div>

                      <div className="flex gap-6">
                          <a href="/login" className="text-gray-300 hover:text-white">
                              Đăng nhập
                          </a>
                          <a href="/register" className="text-gray-300 hover:text-white">
                              Đăng ký
                          </a>
                      </div>
                  </div>
              </nav>

              {children}
          </body>
    </html>
  );
}
