"use client";

import { useCallback, useEffect, useState } from "react";
import {
    fetchUsers,
    updateUser,
    updateUserStatus,
    UnauthorizedError,
    type Fetcher,
    type User,
    type UserUpdatePayload,
} from "./api";

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
    const [loading, setLoading] = useState(true);
    const [processingIds, setProcessingIds] = useState<number[]>([]);

    const [sort, setSort] = useState<"asc" | "desc">("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(t);
    }, [searchTerm]);


    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        (async () => {
            try {
                const page = await fetchUsers(
                    { page: currentPage, pageSize, sortById: sort, search: debouncedSearch },
                    fetcher,
                );
                if (cancelled) return;
                setData(page.data);
                setTotalPages(page.totalPages);
                setTotalUsers(page.total);
            } catch (err) {
                if (err instanceof UnauthorizedError) {
                    window.location.href = "/login";
                    return;
                }
                console.error("Lỗi:", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [currentPage, pageSize, sort, debouncedSearch, fetcher]);

    const toggleSort = useCallback(() => {
        setSort((p) => (p === "asc" ? "desc" : "asc"));
        setCurrentPage(1);
    }, []);

    const toggleStatus = useCallback(
        async (id: number, current: number) => {
            const newStatus = current === 1 ? 0 : 1;
            setProcessingIds((prev) => [...prev, id]);
            try {
                await updateUserStatus(id, newStatus, fetcher);
                setData((prev) =>
                    prev.map((u) => (u.ID === id ? { ...u, TrangThai: newStatus } : u)),
                );
            } catch (err) {
                console.error(err);
                alert("Không thể thay đổi trạng thái người dùng");
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