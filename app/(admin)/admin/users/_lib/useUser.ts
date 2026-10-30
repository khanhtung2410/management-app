"use client";

import { useCallback, useEffect, useState } from "react";
import {
    fetchUsers,
    type Fetcher,
    type UserUpdatePayload,
} from "./api";
import { userStatus, UserStatusType } from "@/constants/statuses";
import { fetcher as defaultFetcher } from "@/lib/fetcher";
import { isAbortError } from "@/lib/isAbortError";
import { UsersState } from "./renderByState";
import {
    updateUserStatusAction,
    updateUserProfileAction,
} from "./actions";

const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 500;

export interface UseUsersOptions {
    pageSize?: number;
    fetcher?: Fetcher;
    searchTerm?: string;
}

export function useUsers({
    pageSize = DEFAULT_PAGE_SIZE,
    fetcher = defaultFetcher,
    searchTerm = "",
}: UseUsersOptions = {}) {

    const [state, setState] = useState<UsersState>({ status: "idle" })

    const [processingIds, setProcessingIds] = useState<Set<number>>(() => new Set());
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionSuccess, setActionSuccess] = useState("");


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
                setState((previous) =>
                    previous.status === "success"
                        ? previous
                        : { status: "loading" },
                );
                const page = await fetchUsers(
                    { page: currentPage, pageSize, sortBy: "id", order: sort, search: debouncedSearch },
                    fetcher,
                );
                if (cancelled) return;
                setState({
                    status: "success",
                    data: page.data,
                    totalPages: page.meta.totalPages,
                    total: page.meta.total,
                });
            } catch (err) {
                if (cancelled) return
                console.error("Lỗi:", err);
                setState({
                    status: "error",
                    message: isAbortError(err) ?
                        "Yêu cầu quá lâu, vui lòng thử lại"
                        : err instanceof Error ? err.message : "Lỗi không xác định",
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
        async (id: number, current: UserStatusType) => {
            const newStatus = current === userStatus.Active ? userStatus.Inactive : userStatus.Active;
            setProcessingIds((prev) => {
                const next = new Set(prev);
                next.add(id);
                return next
            });
            setActionError(null);
            setActionSuccess("");
            try {
                const result = await updateUserStatusAction(id, newStatus);
                if (!result.ok) {
                    setActionError(result.error);
                    return;
                }
                setState((prev) =>
                    prev.status === "success"
                        ? {
                            ...prev, data: prev.data.map((u) => (u.ID === id ? { ...u, TrangThai: newStatus } : u))
                        } : prev,
                );
                setActionSuccess(
                    `Đã ${newStatus === userStatus.Active ? "kích hoạt" : "ngừng"} người dùng ${id}.`
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
        [],
    );

    const saveUser = useCallback(
        async (payload: UserUpdatePayload) => {
            const result = await updateUserProfileAction(payload);

            if (!result.ok) {
                throw new Error(result.error);
            }
            setState((prev) =>
                prev.status === "success" ? {
                    ...prev, data: prev.data.map((u) =>
                        u.ID === payload.userId
                            ? { ...u, ...result.data }
                            : u,
                    ),
                } : prev
            );
        },
        [],
    );

    return {
        state,
        processingIds,
        actionError,
        actionSuccess,
        clearActionError,
        sort,
        currentPage,
        setCurrentPage,
        toggleSort,
        toggleStatus,
        saveUser,
    };
}