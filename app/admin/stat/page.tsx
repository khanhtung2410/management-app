"use client";

import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

interface TaskStat {
    status: string;
    name: string;
    total: number;
    percent: number;
}

interface DashboardData {
    totalUsers: number;
    totalTasks: number;
    taskStats: TaskStat[];
}

const COLORS = [
    "#F59E0B",
    "#3B82F6",
    "#22C55E"
];

export default function DashboardPage() {
    const [data, setData] =
        useState<DashboardData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "/api/stat",
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store"
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
                console.error(
                    "DASHBOARD ERROR:",
                    error
                );

                setError(
                    error instanceof Error
                        ? error.message
                        : "Không thể tải Dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#F3F6FA] p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-xl bg-white p-8 text-center shadow-md">
                        <p className="text-[#64748B]">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-[#F3F6FA] p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-xl bg-white p-8 text-center shadow-md">
                        <p className="text-red-600">
                            {error}
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <main className="min-h-screen bg-[#F3F6FA] p-8">
            <div className="mx-auto max-w-7xl">

                {/* ================= HEADER ================= */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-[#0F172A]">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-[#64748B]">
                        Tổng quan hệ thống quản lý công việc
                    </p>
                </div>

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
                <div className="mt-6 rounded-xl bg-white p-6 shadow-md ring-1 ring-[#E2E8F0]">

                    <div className="mb-2">
                        <h2 className="text-xl font-semibold text-[#0F172A]">
                            Thống kê công việc
                        </h2>

                        <p className="mt-1 text-sm text-[#64748B]">
                            Tỷ lệ công việc theo trạng thái
                        </p>
                    </div>

                    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">

                        {/* ================= PIE ================= */}
                        <div className="h-[380px] w-full">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>

                                    <Pie
                                        data={data.taskStats}
                                        dataKey="total"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={125}
                                        innerRadius={65}
                                        paddingAngle={3}
                                        labelLine={true}
                                        label={({
                                            percent
                                        }) =>
                                            `${Math.round(
                                                (percent || 0) * 100
                                            )}%`
                                        }
                                    >
                                        {data.taskStats.map(
                                            (_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                        index %
                                                        COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip
                                        formatter={(
                                            value,
                                            name
                                        ) => [
                                                `${value} công việc`,
                                                name
                                            ]}
                                    />

                                    <Legend />

                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* ================= DETAIL ================= */}
                        <div className="space-y-4">

                            {data.taskStats.map(
                                (item, index) => (
                                    <div
                                        key={item.status}
                                        className="rounded-xl border border-[#E2E8F0] p-5"
                                    >
                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-3">

                                                <span
                                                    className="h-4 w-4 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            COLORS[
                                                            index %
                                                            COLORS.length
                                                            ]
                                                    }}
                                                />

                                                <span className="font-medium text-[#334155]">
                                                    {item.name}
                                                </span>

                                            </div>

                                            <span className="text-lg font-bold text-[#0F172A]">
                                                {item.total}
                                            </span>
                                        </div>

                                        {/* Percentage */}
                                        <div className="mt-3 flex items-center justify-between">

                                            <span className="text-sm text-[#64748B]">
                                                Tỷ lệ
                                            </span>

                                            <span className="text-sm font-semibold text-[#334155]">
                                                {item.percent}%
                                            </span>

                                        </div>

                                        {/* Progress */}
                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">

                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${item.percent}%`,
                                                    backgroundColor:
                                                        COLORS[
                                                        index %
                                                        COLORS.length
                                                        ]
                                                }}
                                            />

                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    </div>
                </div>

                {/* ================= SUMMARY ================= */}
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                    {data.taskStats.map(
                        (item, index) => (
                            <div
                                key={item.status}
                                className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-[#E2E8F0]"
                            >
                                <div className="flex items-center gap-3">

                                    <span
                                        className="h-3 w-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                COLORS[
                                                index %
                                                COLORS.length
                                                ]
                                        }}
                                    />

                                    <span className="text-sm text-[#64748B]">
                                        {item.name}
                                    </span>
                                </div>

                                <div className="mt-3 flex items-end gap-2">

                                    <span className="text-3xl font-bold text-[#0F172A]">
                                        {item.total}
                                    </span>

                                    <span className="mb-1 text-sm text-[#64748B]">
                                        công việc
                                    </span>

                                </div>

                                <p className="mt-1 text-sm text-[#64748B]">
                                    Chiếm {item.percent}% tổng số
                                </p>
                            </div>
                        )
                    )}

                </div>
            </div>
        </main>
    );
}