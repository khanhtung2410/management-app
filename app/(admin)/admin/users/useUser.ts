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
    searchTerm?: string;
}

export type UsersState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: User[], totalPages: number, total: number }
    | { status: "error"; message: string };

export function useUsers({
    pageSize = DEFAULT_PAGE_SIZE,
    fetcher,
    searchTerm = "",
}: UseUsersOptions = {}) {

    const [state, setState] = useState<UsersState>({ status: "idle" })

    const [processingIds, setProcessingIds] = useState<Set<number>>(() => new Set());
    const [actionError, setActionError] = useState<string | null>(null);


    const [sort, setSort] = useState<"asc" | "desc">("asc");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(t);
    }, [searchTerm]);


    // Fetch data
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const page = await fetchUsers(
                    { page: currentPage, pageSize, sortBy: "id", order: sort, search: debouncedSearch },
                    fetcher,
                );
                if (cancelled) return;
                setState({
                    status: "success",
                    data: page.data,
                    totalPages: page.totalPages,
                    total: page.total
                })
            } catch (err) {
                if (cancelled) return
                console.error("Lỗi:", err);
                setState({
                    status: "error",
                    message: err instanceof Error ? err.message : "Lỗi không xác định",
                });
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

    const clearActionError = useCallback(() => setActionError(null), []);

    const toggleStatus = useCallback(
        async (id: number, current: number) => {
            const newStatus = current === userStatus.Active ? userStatus.Inactive : userStatus.Active;
            setProcessingIds((prev) => {
                const next = new Set(prev);
                next.add(id);
                return next
            });
            setActionError(null);
            try {
                await updateUserStatus(id, newStatus, fetcher);
                setState((prev) =>
                    prev.status === "success"
                        ? {
                            ...prev, data: prev.data.map((u) => (u.ID === id ? { ...u, TrangThai: newStatus } : u))
                        } : prev,
                );
            } catch (err) {
                console.error(err);
                setActionError("Không thể thay đổi trạng thái người dùng");
            } finally {
                setProcessingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next
                });
            }
        },
        [fetcher],
    );

    const saveUser = useCallback(
        async (payload: UserUpdatePayload) => {
            await updateUser(payload, fetcher);
            setState((prev) =>
                prev.status === "success" ? {
                    ...prev, data: prev.data.map((u) =>
                        u.ID === payload.userId
                            ? { ...u, HoTen: payload.HoTen, Email: payload.Email, SDT: payload.SDT }
                            : u,
                    ),
                } : prev
            );
        },
        [fetcher],
    );

    return {
        state,
        processingIds,
        actionError,
        clearActionError,
        sort,
        currentPage,
        setCurrentPage,
        toggleSort,
        toggleStatus,
        saveUser,
    };
}