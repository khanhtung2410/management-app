"use client";

import { useCallback, useState } from "react";
import type { User } from "./api";
import { useUsers } from "./useUser";
import { UserTableRow, UserCard } from "./UserRow";
import { Pagination } from "./Pagination";
import { EditUserModal } from "./EditUserModal";
import { useDeferredValue } from "react";
import { useMediaQuery } from "@/app/api/tasks/useMediaQuery";
import { renderByState } from "./renderByState";

export default function UserList() {

    const [inputValue, setInputValue] = useState("");
    const deferredSearch = useDeferredValue(inputValue);

    const isStale = inputValue !== deferredSearch;
    const isDesktop = useMediaQuery("(min-width: 760px)")

    const {
        state,
        processingIds,
        sort,
        currentPage,
        setCurrentPage,
        toggleSort,
        toggleStatus,
        saveUser,
        actionError,
        clearActionError,
    } = useUsers({ searchTerm: deferredSearch });

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const closeEditModal = useCallback(() => { setEditingUser(null); }, [])

    const placeholder = renderByState(state)
    const users = state.status === "success" ? state.data : [];

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
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setCurrentPage(1);
                            }
                            }
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#334155] outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]"
                        />
                    </div>
                    <span className="inline-flex w-fit items-center rounded-full bg-[#DBEAFE] px-3 py-1 text-sm font-medium text-[#1E40AF]">
                        {state.status === "success" ? `${state.total} người dùng` : "-"}
                    </span>
                </div>
                {actionError && (
                    <div role="alert"
                        className="mb-4 flex items-start justify-between gap-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                        <div className="flex items-start gap-2">
                            <span aria-hidden>⚠️</span>
                            <span>{actionError}</span>
                        </div>
                        <button
                            type="button"
                            onClick={clearActionError}
                            className="shrink-0 rounded px-2 py-0.5 text-red-700 hover:bg-red-100"
                            aria-label="Đóng thông báo lỗi"
                        >
                            ✕
                        </button>
                    </div>
                )}
                <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-[#E2E8F0]">
                    <div className={
                        isStale
                            ? "opacity-60 transition-opacity duration-150"
                            : "opacity-100 transition-opacity duration-150"

                    }>
                        {placeholder ? (
                            <Placeholder>{placeholder}</Placeholder>
                        ) : (
                            <UsersLayout
                                isDesktop={isDesktop}
                                headers={
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
                                }
                            >
                                {users.map((item) =>
                                    isDesktop ? (
                                        <UserTableRow
                                            key={item.ID}
                                            user={item}
                                            processing={processingIds.has(item.ID)}
                                            onEdit={setEditingUser}
                                            onToggle={toggleStatus}
                                        />
                                    ) : (<UserCard
                                        key={item.ID}
                                        user={item}
                                        processing={processingIds.has(item.ID)}
                                        onEdit={setEditingUser}
                                        onToggle={toggleStatus}
                                    />
                                    )
                                )}
                            </UsersLayout>
                        )}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={state.status === "success" ? state.totalPages : 1}
                        onPageChange={setCurrentPage}
                    />
                </div >
            </div >

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={closeEditModal}
                    onSave={saveUser}
                />
            )
            }
        </main >
    );
}
function UsersLayout({
    isDesktop,
    headers,
    children,
}: {
    isDesktop: boolean;
    headers: React.ReactNode;
    children: React.ReactNode;
}) {
    if (isDesktop) {
        return (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                    <thead className="bg-[#F1F5F9] text-[#0f172a]">
                        {headers}
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                        {children}
                    </tbody>
                </table>
            </div>
        );
    }
    return <div className="divide-y divide-[#E2E8F0]">{children}</div>
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="px-6 py-4 text-sm font-semibold uppercase tracking-wide">
            {children}
        </th>
    );
}

function Placeholder({ children }: { children: React.ReactNode }) {
    return <div className="px-6 py-12 text-center text-[#64748B]">{children}</div>;
}