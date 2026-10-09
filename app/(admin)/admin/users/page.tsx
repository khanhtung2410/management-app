"use client";

import { useEffect, useState } from "react";

interface User {
    ID: number;
    HoTen: string;
    Email: string;
    SDT: string;
    TrangThai: number;
}

export default function UserList() {
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [processingIds, setProcessingIds] = useState<number[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editSDT, setEditSDT] = useState("");
    const [saving, setSaving] = useState(false);

    const [sort, setSort] = useState<"asc" | "desc">("asc");
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const pageSize = 10;

    // =========================
    // Lấy danh sách người dùng
    // =========================
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `/api/users?page=${currentPage}&pageSize=${pageSize}&sortById=${sort}&search=${searchTerm}`,
                    {
                        credentials: "include"
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        window.location.href = "/login";
                        return;
                    }

                    throw new Error(
                        result.message || "Không thể lấy dữ liệu"
                    );
                }

                setData(result.data || []);
                setTotalPages(result.totalPages || 1);
                setTotalUsers(result.total || 0);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [currentPage, sort, searchTerm]);

    // =========================
    // Đổi trạng thái
    // =========================
    const toggleStatus = async (id: number, current: number) => {
        const newStatus = current === 1 ? 0 : 1;

        try {
            setProcessingIds(prev => [...prev, id]);

            const res = await fetch("/api/users", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: id,
                    status: newStatus
                })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));

                throw new Error(
                    err.message || "Không thể cập nhật trạng thái"
                );
            }

            setData(prev =>
                prev.map(user =>
                    user.ID === id
                        ? {
                            ...user,
                            TrangThai: newStatus
                        }
                        : user
                )
            );
        } catch (error) {
            console.error(error);
            alert("Không thể thay đổi trạng thái người dùng");
        } finally {
            setProcessingIds(prev =>
                prev.filter(x => x !== id)
            );
        }
    };

    // =========================
    // Mở form sửa
    // =========================
    const openEdit = (user: User) => {
        setEditingUser(user);
        setEditName(user.HoTen || "");
        setEditEmail(user.Email || "");
        setEditSDT(user.SDT || "");
    };

    // =========================
    // Đóng form sửa
    // =========================
    const closeEdit = () => {
        setEditingUser(null);
        setEditName("");
        setEditEmail("");
        setEditSDT("");
    };

    // =========================
    // Lưu người dùng
    // =========================
    const saveEdit = async () => {
        if (!editingUser) return;

        if (!editName.trim() || !editEmail.trim()) {
            alert("Vui lòng nhập họ tên và email");
            return;
        }

        setSaving(true);

        try {
            const res = await fetch("/api/users", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: editingUser.ID,
                    HoTen: editName.trim(),
                    Email: editEmail.trim(),
                    SDT: editSDT.trim()
                })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));

                throw new Error(
                    err.message || "Không thể lưu người dùng"
                );
            }

            setData(prev =>
                prev.map(user =>
                    user.ID === editingUser.ID
                        ? {
                            ...user,
                            HoTen: editName.trim(),
                            Email: editEmail.trim(),
                            SDT: editSDT.trim()
                        }
                        : user
                )
            );

            closeEdit();
        } catch (error) {
            console.error(error);
            alert("Lưu người dùng thất bại");
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // Danh sách số trang
    // =========================
    const getPageNumbers = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }

            return pages;
        }

        pages.push(1);

        if (currentPage > 4) {
            pages.push("...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(
            totalPages - 1,
            currentPage + 1
        );

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 3) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    };

    const sortById = () => {
        setSort(prev => prev === "asc" ? "desc" : "asc");
        setCurrentPage(1); 
    }

    const renderStatusBadge = (trangThai: number) => (
        <span
            className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium"
            style={{
                backgroundColor: trangThai === 1 ? "#DCFCE7" : "#FEE2E2",
                color: trangThai === 1 ? "#15803D" : "#B91C1C"
            }}
        >
            {trangThai === 1 ? "Đang hoạt động" : "Ngừng hoạt động"}
        </span>
    )
    const renderAction = (item: User, layout: "row" | "col" = "row") => {
        const isActive = item.TrangThai === 1;
        const isProcessing = processingIds.includes(item.ID);

        const baseBtn = "rounded-md px-4 py-2 text-sm font-medium text-white transition";
        const widthClass = layout === "col" ? "flex-1" : "";

        return (
            <div className={layout === "row" ? "flex gap-3" : "flex gap-2"}>
                {/* Nút Sửa */}
                <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className={`${baseBtn} bg-[#6B7280] hover:bg-[#4B5563] ${widthClass}`}
                >
                    Sửa
                </button>

                {/* Nút Toggle trạng thái */}
                <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => toggleStatus(item.ID, item.TrangThai)}
                    className={`${baseBtn} ${widthClass} ${isProcessing
                            ? "bg-[#9CA3AF] cursor-not-allowed"
                            : isActive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-700 hover:bg-green-800"
                        }`}
                >
                    {isProcessing
                        ? "Đang..."
                        : isActive
                            ? "Ngừng"
                            : "Kích hoạt"}
                </button>
            </div>
        );
    };
    return (
        <main className="min-h-screen bg-[#F3F6FA] p-4 sm:p-8">
            <div className="mx-auto max-w-6xl">

                {/* =========================
                    Header
                ========================= */}
                <div className="mb-6 flex gap-4 flex-col md:items-center md:justify-between md:flex-row">
                    <h1 className="text-2xl font-bold text-[#0f172a] sm:text-3xl">
                        Danh sách người dùng
                    </h1>
                    <div className='flex gap-4 items-center'>
                        <label htmlFor="search" className="mr-2 text-sm font-medium text-[#334155]">Tìm kiếm</label>
                        <input id='search' type='text' name='search'
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#334155] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]"
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}>
                        </input>
                    </div>
                    <span className="inline-flex w-fit items-center rounded-full bg-[#DBEAFE] px-3 py-1 text-sm font-medium text-[#1E40AF]">
                        {totalUsers} người dùng
                    </span>
                </div>

                {/* =========================
                    Table Card
                ========================= */}
                <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-[#E2E8F0] ">

                    {/* Chỉ table scroll ngang */}
                    <div className="hidden md:block">
                        <div className="overflow-x-auto ">
                            <table className="w-full min-w-[900px] text-left">
                                <thead className="bg-[#F1F5F9] text-[#0f172a]">
                                    <tr className="border-b border-[#E2E8F0]">
                                        <th className="w-40 px-6 py-4 text-sm font-semibold uppercase tracking-wide">
                                            <button
                                                onClick={() => { sortById() }}
                                            >
                                                ID {sort === "asc" ? "🔺" : "🔻"}
                                            </button>
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">
                                            Họ tên
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">
                                            Email
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">
                                            SĐT
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">
                                            Trạng thái
                                        </th>

                                        <th className="w-64 px-6 py-4 text-sm font-semibold uppercase tracking-wide">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[#E2E8F0]">
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-12 text-center text-[#64748B]"
                                            >
                                                Đang tải dữ liệu...
                                            </td>
                                        </tr>
                                    ) : data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-12 text-center text-[#64748B]"
                                            >
                                                Chưa có người dùng nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map(item => (
                                            <tr
                                                key={item.ID}
                                                className="transition hover:bg-[#F8FAFC]"
                                            >
                                                <td className="px-6 py-4 text-sm text-[#334155]">
                                                    #{item.ID}
                                                </td>

                                                <td className="px-6 py-4 font-medium text-[#0f172a]">
                                                    {item.HoTen}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-[#334155]">
                                                    {item.Email}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-[#334155]">
                                                    {item.SDT}
                                                </td>

                                                <td className="px-6 py-4 text-sm">
                                                    {renderStatusBadge(item.TrangThai)}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {renderAction(item,"row") }
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            </div>
                    </div>
               
                    <div className="md:hidden">
                        {loading ? (
                            <div className="px-6 py-12 text-center text-[#64748B]">
                                Đang tải dữ liệu...
                            </div>
                        ) : data.length === 0 ? (
                                    <div className="px-6 py-12 text-center text-[#64748B]">
                                    Chưa có người dùng nào.
                                </div>
                        ) : (
                                    <div className="divide-y divide-[#E2E8F0]">
                                        {data.map(item => (
                                            <div key={item.ID} className="space-y-3 p-4">
                                                {/* ID + Trạng thái */}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-medium text-[#64748B]">
                                                        #{item.ID}
                                                    </span>
                                                    {renderStatusBadge(item.TrangThai)}
                                                </div>
                                                <div>
                                                    <div className="text-xs text-[#64748B]">Họ tên</div>
                                                    <span className="text-xs text-[#64748B]">
                                                        {item.HoTen}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-[#64748B]">Email</div>
                                                    <span className="text-xs text-[#64748B]">
                                                        {item.Email}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-[#64748B]">Điện thoại</div>
                                                    <span className="text-xs text-[#64748B]">
                                                        {item.SDT}
                                                    </span>
                                                </div>
                                                <div>
                                                    {renderAction(item,"col") }
                                                </div>
                                            </div>
                                        ))}
                            </div>
                        )}
                    </div>
                           
                    {/* =========================
                        Pagination
                    ========================= */}
                    <div className="flex items-center justify-between border-t border-[#E2E8F0] px-4 py-3 sm:px-6 sm:py-4">
                        {/* Trước */}
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="rounded-md border px-3 py-2 text-sm text-[#334155] transition hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Trước
                        </button>

                        {/* Giữa: số trang hiện tại trên mobile, dãy số trên desktop */}
                        <div className="flex items-center gap-1">
                            {/* Mobile: chỉ X / Y */}
                            <span className="px-3 py-2 text-sm font-medium text-[#334155] sm:hidden">
                                {currentPage} / {totalPages}
                            </span>

                            {/* Desktop: dãy số đầy đủ */}
                            <div className="hidden items-center gap-1 sm:flex">
                                {getPageNumbers().map((page, index) =>
                                    page === "..." ? (
                                        <span
                                            key={`dots-${index}`}
                                            className="px-2 py-2 text-sm text-[#64748B]"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => {
                                                if (typeof page === "number") {
                                                    setCurrentPage(page);
                                                }
                                            }}
                                            className={`min-w-9 rounded-md px-3 py-2 text-sm transition ${currentPage === page
                                                    ? "bg-[#1E40AF] text-white"
                                                    : "border text-[#334155] hover:bg-[#F1F5F9]"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Sau */}
                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="rounded-md border px-3 py-2 text-sm text-[#334155] transition hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>
                </div>

            </div>

            {/* =========================
                Edit Modal
            ========================= */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-lg bg-white p-6 text-[#0f172a] shadow-lg">

                        <h2 className="mb-4 text-xl font-semibold">
                            Sửa người dùng
                        </h2>

                        <div className="mb-3">
                            <label className="mb-1 block text-sm font-medium">
                                Họ tên
                            </label>

                            <input
                                value={editName}
                                onChange={e =>
                                    setEditName(e.target.value)
                                }
                                className="w-full rounded-md border px-3 py-2 outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-1 block text-sm font-medium">
                                Email
                            </label>

                            <input
                                type="email"
                                value={editEmail}
                                onChange={e =>
                                    setEditEmail(e.target.value)
                                }
                                className="w-full rounded-md border px-3 py-2 outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-1 block text-sm font-medium">
                                SĐT
                            </label>

                            <input
                                value={editSDT}
                                onChange={e =>
                                    setEditSDT(e.target.value)
                                }
                                className="w-full rounded-md border px-3 py-2 outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]"
                            />
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeEdit}
                                disabled={saving}
                                className="rounded-md border px-4 py-2 text-sm hover:bg-[#F1F5F9] disabled:opacity-50"
                            >
                                Hủy
                            </button>

                            <button
                                type="button"
                                onClick={saveEdit}
                                disabled={saving}
                                className="rounded-md bg-[#1E40AF] px-4 py-2 text-sm text-white hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? "Đang lưu..."
                                    : "Lưu"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}