"use client";

import { useState } from "react";
import type { User } from "./api";
import { useUsers } from "./useUsers";
import { UserTableRow, UserCard } from "./UserRow";
import { Pagination } from "./Pagination";
import { EditUserModal } from "./EditUserModal";

export default function UserList() {
    const {
        data,
        loading,
        processingIds,
        sort,
        searchTerm,
        setSearchTerm,
        currentPage,
        totalPages,
        totalUsers,
        setCurrentPage,
        toggleSort,
        toggleStatus,
        saveUser,
    } = useUsers();

    const [editingUser, setEditingUser] = useState<User | null>(null);

    return (
        <main className="min-h-screen bg-[#F3F6FA] p-4 sm:p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold text-[#0f172a] sm:text-3xl">
                        Danh sách người dùng
                    </h1>
                    <div className="flex items-center gap-4">
                        <label htmlFor="search" className="text-sm font-medium text-[#334155]">
                            Tìm kiếm
                        </label>
                        <input
                            id="search"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#334155] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]"
                        />
                    </div>
                    <span className="inline-flex w-fit items-center rounded-full bg-[#DBEAFE] px-3 py-1 text-sm font-medium text-[#1E40AF]">
                        {totalUsers} người dùng
                    </span>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-[#E2E8F0]">
                    {/* Desktop */}
                    <div className="hidden md:block">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-left">
                                <thead className="bg-[#F1F5F9] text-[#0f172a]">
                                    <tr className="border-b border-[#E2E8F0]">
                                        <th className="w-40 px-6 py-4 text-sm font-semibold uppercase tracking-wide">
                                            <button onClick={toggleSort}>
                                                ID {sort === "asc" ? "🔺" : "🔻"}
                                            </button>
                                        </th>
                                        <Th>Họ tên</Th>
                                        <Th>Email</Th>
                                        <Th>SĐT</Th>
                                        <Th>Trạng thái</Th>
                                        <th className="w-64 px-6 py-4 text-sm font-semibold uppercase tracking-wide">
                                            Hành động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E8F0]">
                                    {loading ? (
                                        <PlaceholderRow colSpan={6}>Đang tải dữ liệu...</PlaceholderRow>
                                    ) : data.length === 0 ? (
                                        <PlaceholderRow colSpan={6}>Chưa có người dùng nào.</PlaceholderRow>
                                    ) : (
                                        data.map((item) => (
                                            <UserTableRow
                                                key={item.ID}
                                                user={item}
                                                processing={processingIds.includes(item.ID)}
                                                onEdit={setEditingUser}
                                                onToggle={toggleStatus}
                                            />
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden">
                        {loading ? (
                            <Placeholder>Đang tải dữ liệu...</Placeholder>
                        ) : data.length === 0 ? (
                            <Placeholder>Chưa có người dùng nào.</Placeholder>
                        ) : (
                            <div className="divide-y divide-[#E2E8F0]">
                                {data.map((item) => (
                                    <UserCard
                                        key={item.ID}
                                        user={item}
                                        processing={processingIds.includes(item.ID)}
                                        onEdit={setEditingUser}
                                        onToggle={toggleStatus}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={saveUser}
                />
            )}
        </main>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">
            {children}
        </th>
    );
}

function PlaceholderRow({
    colSpan,
    children,
}: {
    colSpan: number;
    children: React.ReactNode;
}) {
    return (
        <tr>
            <td colSpan={colSpan} className="px-6 py-12 text-center text-[#64748B]">
                {children}
            </td>
        </tr>
    );
}

function Placeholder({ children }: { children: React.ReactNode }) {
    return <div className="px-6 py-12 text-center text-[#64748B]">{children}</div>;
}