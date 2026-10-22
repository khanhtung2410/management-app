import Link from "next/link";
import type { Metadata } from "next";
import { Card } from "@/components/UI/Card";

export const metadata: Metadata = {
  title: "Quản lý công việc",
  description:
    "Tạo, theo dõi và hoàn thành công việc của bạn trong một nơi.",
};

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-20 text-white sm:py-28">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Quản lý công việc đơn giản hơn
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Biến danh sách việc cần làm thành những việc đã hoàn thành.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Tạo công việc, theo dõi thời hạn và cập nhật tiến độ trong một nơi.
            Bắt đầu với danh sách của riêng bạn và dễ dàng biết việc nào cần
            được ưu tiên.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
            >
              Tạo tài khoản miễn phí
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-white/25 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              Mọi thứ ở đúng chỗ
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Tập trung vào việc quan trọng tiếp theo
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              Không cần ghi nhớ mọi thứ. Lưu công việc, xem thời hạn và cập
              nhật trạng thái để bạn luôn nắm được tiến độ của mình.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Card as="article" rounded="2xl" shadow="sm" className="border border-gray-200 p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                01
              </span>
              <h3 className="mt-5 text-lg font-semibold">Ghi lại công việc</h3>
              <p className="mt-2 leading-7 text-gray-600">
                Tạo công việc kèm mô tả và hạn hoàn thành để kế hoạch của bạn
                luôn rõ ràng.
              </p>
            </Card>

            <Card as="article" rounded="2xl" shadow="sm" className="border border-gray-200 p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 font-bold text-amber-700">
                02
              </span>
              <h3 className="mt-5 text-lg font-semibold">Theo dõi tiến độ</h3>
              <p className="mt-2 leading-7 text-gray-600">
                Xem trạng thái và thời hạn để biết việc nào đang chờ xử lý,
                sắp đến hạn hoặc đã hoàn thành.
              </p>
            </Card>

            <Card as="article" rounded="2xl" shadow="sm" className="border border-gray-200 p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-700">
                03
              </span>
              <h3 className="mt-5 text-lg font-semibold">Hoàn thành từng bước</h3>
              <p className="mt-2 leading-7 text-gray-600">
                Cập nhật công việc khi hoàn tất và dành sự tập trung cho mục
                tiêu tiếp theo.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white px-6 py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Sẵn sàng sắp xếp công việc của bạn?
            </h2>
            <p className="mt-2 text-gray-600">
              Tạo tài khoản và bắt đầu xây dựng danh sách công việc ngay hôm nay.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
          >
            Bắt đầu ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
