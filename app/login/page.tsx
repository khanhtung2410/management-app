export default function Home() {
  return (
    <div className="font-sans">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <main className="flex w-full flex-col items-center justify-center px-20 text-center">
          <h1 className="text-[54px] font-bold">
            Đăng nhập
          </h1>

          <form className="mt-8 flex w-full max-w-md flex-col gap-4">
            <input
              type="emailnpmn"
              placeholder="Email"
                          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />

            <input
              type="password"
              placeholder="Mật khẩu"
                          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />

            <button
              type="submit"
              className="rounded-lg bg-gray-800 px-4 py-3 font-medium text-white hover:bg-gray-700"
            >
              Đăng nhập
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

