"use client";

import { TaskStatusType, STATUS_CONFIG } from "@/constants/statuses";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { TaskSector } from "./TaskSector";
import { isAbortError } from "@/lib/isAbortError";
import { DEFAULT_TIMEOUT_MS } from "@/lib/withTimeout";

interface TaskStat {
    status: TaskStatusType;
    name: string;
    total: number;
    percent: number;
}

interface DashboardData {
    totalUsers: number;
    totalTasks: number;
    taskStats: TaskStat[];
}

function StatusShell({ children }: { children: ReactNode }) {
    return (
        <main className="min-h-screen bg-[#F3F6FA] p-8">
            <div className="mx-auto max-w-7xl">
                <div className="rounded-xl bg-white p-8 text-center shadow-md">
                    {children}
                </div>
            </div>
        </main>
    );
}

function useIsMobile(breakpoint = 768) {
    const query = `(max-width: ${breakpoint - 1}px)`;

    const subscribe = (callback: () => void) => {
        const mq = window.matchMedia(query);
        mq.addEventListener("change", callback);
        return () => mq.removeEventListener("change", callback);
    };

    const getSnapshot = () => window.matchMedia(query).matches;
    const getServerSnapshot = () => false; // SSR mặc định desktop

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function DashboardPage() {
    const [data, setData] =
        useState<DashboardData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const isMobile = useIsMobile(768);

    useEffect(() => {
        const controller = new AbortController();

        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const timeoutSignal = AbortSignal.timeout(DEFAULT_TIMEOUT_MS);
                const signal = AbortSignal.any([controller.signal, timeoutSignal]);
                const response = await fetch(
                    "/api/admin/stat",
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                        signal,
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "Không thể lấy dữ liệu Dashboard"
                    );
                }

                setData(result);
            } catch (error) {
                if (controller.signal.aborted) return;

                console.error(
                    "DASHBOARD ERROR:",
                    error
                );

                setError(
                    isAbortError(error)
                        ? "Yêu cầu quá lâu, vui lòng thử lại"
                        : error instanceof Error
                            ? error.message
                            : "Không thể tải Dashboard"
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <StatusShell>
                <p className="text-[#647488]">Đang tải dữ liệu...</p>
            </StatusShell>
        );
    }

    if (error) {
        return (
            <StatusShell>
                <p className="text-red-600">{error}</p>
            </StatusShell>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <main className="min-h-screen bg-[#F3F6FA] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">

                {/* ================= HEADER ================= */}
                <h1 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-1 text-xs text-[#64748B] sm:text-sm">
                    Tổng quan hệ thống quản lý công việc
                </p>

                {/* ================= CARDS ================= */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* Tổng người dùng */}
                    <div className="rounded-xl bg-white p-6 shadow-md ring-1 ring-[#E2E8F0]">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-[#64748B]">
                                    Tổng số người dùng
                                </p>

                                <p className="mt-2 text-4xl font-bold text-[#1E40AF]">
                                    {data.totalUsers}
                                </p>

                                <p className="mt-2 text-sm text-[#94A3B8]">
                                    Người dùng trong hệ thống
                                </p>
                            </div>

                            <div
                                className="flex h-16 w-16 items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: "#DBEAFE"
                                }}
                            >
                                <span className="text-3xl">
                                    👥
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Tổng công việc */}
                    <div className="rounded-xl bg-white p-6 shadow-md ring-1 ring-[#E2E8F0]">
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-[#64748B]">
                                    Tổng số công việc
                                </p>

                                <p className="mt-2 text-4xl font-bold text-[#7C3AED]">
                                    {data.totalTasks}
                                </p>

                                <p className="mt-2 text-sm text-[#94A3B8]">
                                    Tất cả công việc
                                </p>
                            </div>

                            <div
                                className="flex h-16 w-16 items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: "#EDE9FE"
                                }}
                            >
                                <span className="text-3xl">
                                    📋
                                </span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* ================= PIE CHART ================= */}
                <div className="mt-6 rounded-xl bg-white p-4 shadow-md ring-1 ring-[#E2E8F0] sm:p-6">

                    <div className="mb-2">
                        <h2 className="text-lg font-semibold text-[#0F172A] sm:text-xl">
                            Thống kê công việc
                        </h2>
                        <p className="mt-1 text-xs text-[#64748B] sm:text-sm">
                            Tỷ lệ công việc theo trạng thái
                        </p>
                    </div>

                    {/* Grid responsive: mobile 1 cột, desktop 2 cột */}
                    <div className="flex flex-col items-center gap-4 lg:grid lg:grid-cols-2 lg:gap-8">

                        {/* ===== PIE ===== */}
                        <div
                            className="w-full min-w-0"
                            style={{ height: isMobile ? 260 : 380 }}
                        >
                            <ResponsiveContainer width="100%" height="100%" debounce={50}>
                                <PieChart>

                                    <Pie
                                        data={data.taskStats}
                                        dataKey="total"
                                        nameKey="name"
                                        shape={TaskSector}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={isMobile ? 80 : 125}
                                        innerRadius={isMobile ? 45 : 65}
                                        paddingAngle={3}
                                        labelLine={!isMobile}
                                        label={({ percent }) =>
                                            isMobile ? "" : `${(percent || 0).toFixed(2)}%`
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value, name, props) => {
                                            const percent = props?.payload?.percent ?? 0;
                                            return [`${value} công việc (${percent}%)`, name];
                                        }}
                                    />

                                    <Legend
                                        verticalAlign={isMobile ? "bottom" : "middle"}
                                        align={isMobile ? "center" : "right"}
                                        layout={isMobile ? "horizontal" : "vertical"}
                                        iconType="circle"
                                        wrapperStyle={{
                                            fontSize: isMobile ? 12 : 14,
                                            paddingTop: isMobile ? 8 : 0,
                                        }}
                                    />

                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* ===== DETAIL ===== */}
                        <div className="w-full min-w-0 space-y-3 sm:space-y-4">
                            {data.taskStats.map((item) => (
                                <div
                                    key={item.status}
                                    className="rounded-xl border border-[#E2E8F0] p-3 sm:p-5"
                                >
                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-2 sm:gap-3">

                                            <span
                                                className="h-3 w-3 rounded-full sm:h-4 sm:w-4"
                                                style={{
                                                    backgroundColor: STATUS_CONFIG[item.status].color
                                                }}
                                            />

                                            <span className="text-sm font-medium text-[#334155] sm:text-base">
                                                {item.name}
                                            </span>

                                        </div>

                                        <span className="text-base font-bold text-[#0F172A] sm:text-lg">
                                            {item.total}
                                        </span>
                                    </div>

                                    {/* Percentage */}
                                    <div className="mt-2 flex items-center justify-between sm:mt-3">

                                        <span className="text-xs text-[#64748B] sm:text-sm">
                                            Tỷ lệ
                                        </span>

                                        <span className="text-xs font-semibold text-[#334155] sm:text-sm">
                                            {item.percent}%
                                        </span>

                                    </div>

                                    {/* Progress */}
                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E2E8F0] sm:h-2">

                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${item.percent}%`,
                                                backgroundColor: STATUS_CONFIG[item.status].color
                                            }}
                                        />

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* ================= SUMMARY ================= */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">

                    {data.taskStats.map((item) => (
                        <div
                            key={item.status}
                            className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#E2E8F0] sm:p-5"
                        >
                            <div className="flex items-center gap-2 sm:gap-3">

                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: STATUS_CONFIG[item.status].color }}
                                />

                                <span className="text-xs text-[#64748B] sm:text-sm">
                                    {item.name}
                                </span>
                            </div>

                            <div className="mt-2 flex items-end gap-2 sm:mt-3">

                                <span className="text-2xl font-bold text-[#0F172A] sm:text-3xl">
                                    {item.total}
                                </span>

                                <span className="mb-1 text-xs text-[#64748B] sm:text-sm">
                                    công việc
                                </span>

                            </div>

                            <p className="mt-1 text-xs text-[#64748B] sm:text-sm">
                                Chiếm {item.percent}% tổng số
                            </p>
                        </div>
                    ))}

                </div>
            </div>
        </main>
    );
}