"use client";

import { useCallback, useEffect, useState } from "react";
import {
    fetchUsers,
    updateUser,
    updateUserStatus,
    type Fetcher,
    type User,
    type UserUpdatePayload,
} from "./api";
import { userStatus } from "@/constants/statuses";

const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 500;

export interface UseUsersOptions {
    pageSize?: number;
    fetcher?: Fetcher;
}

export function useUsers({
    pageSize = DEFAULT_PAGE_SIZE,
    fetcher,
}: UseUsersOptions = {}) {
    const [data, setData] = useState<User[]>([]);
    const [processingIds, setProcessingIds] = useState<number[]>([]);
    const [actionError, setActionError] = useState<string | null>(null);

    const [sort, setSort] = useState<"asc" | "desc">("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // 🔑 Key dẫn xuất loading — không cần setLoading(true) trong effect
    const requestKey = `${currentPage}-${sort}-${debouncedSearch}-${pageSize}`;
    const [loadedKey, setLoadedKey] = useState<string | null>(null);
    const loading = loadedKey !== requestKey;

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // Fetch data
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const page = await fetchUsers(
                    { page: currentPage, pageSize,  sortBy: "id", order: sort , search: debouncedSearch },
                    fetcher,
                );
                if (cancelled) return;
                setData(page.data);
                setTotalPages(page.totalPages);
                setTotalUsers(page.total);
                setLoadedKey(requestKey);   // ✅ callback — không bị flag
            } catch (err) {
                console.error("Lỗi:", err);
                if (!cancelled) setLoadedKey(requestKey);   // thoát loading
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [currentPage, pageSize, sort, debouncedSearch, fetcher, requestKey]);

    const toggleSort = useCallback(() => {
        setSort((p) => (p === "asc" ? "desc" : "asc"));
        setCurrentPage(1);
    }, []);

    const toggleStatus = useCallback(
        async (id: number, current: number) => {
            const newStatus = current === userStatus.Active ? userStatus.Inactive : userStatus.Active;
            setProcessingIds((prev) => [...prev, id]);
            setActionError(null);
            try {
                await updateUserStatus(id, newStatus, fetcher);
                setData((prev) =>
                    prev.map((u) => (u.ID === id ? { ...u, TrangThai: newStatus } : u))
                );
            } catch (err) {
                console.error(err);
                setActionError("Không thể thay đổi trạng thái người dùng");
            } finally {
                setProcessingIds((prev) => prev.filter((x) => x !== id));
            }
        },
        [fetcher],
    );

    const saveUser = useCallback(
        async (payload: UserUpdatePayload) => {
            await updateUser(payload, fetcher);
            setData((prev) =>
                prev.map((u) =>
                    u.ID === payload.userId
                        ? { ...u, HoTen: payload.HoTen, Email: payload.Email, SDT: payload.SDT }
                        : u,
                ),
            );
        },
        [fetcher],
    );

    return {
        data,
        loading,
        processingIds,
        actionError,
        clearActionError: () => setActionError(null),
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
    };
}