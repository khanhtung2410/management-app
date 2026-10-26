// Vẽ biểu đồ tròn thống kê công việc theo trạng thái với bố cục đáp ứng; không dùng để truy vấn hoặc tổng hợp dữ liệu.
"use client";

import { useCallback, useMemo } from "react";
import {
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    type DefaultTooltipContentProps,
    type PieLabelRenderProps,
} from "recharts";
import { STATUS_CONFIG } from "@/constants/statuses";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TaskSector } from "./TaskSector";
import type { TaskStat } from "../_lib/types";

type TooltipFormatter = NonNullable<DefaultTooltipContentProps["formatter"]>;

export default function TaskStatsChart({ taskStats }: { taskStats: TaskStat[] }) {
    const isMobile = useMediaQuery("(max-width: 767px)");
    const isCompactLayout = useMediaQuery("(max-width: 1535px)");

    const chartData = useMemo(
        () =>
            taskStats.map((item) => ({
                ...item,
                fill: STATUS_CONFIG[item.status].color,
            })),
        [taskStats],
    );

    const renderLabel = useCallback(
        ({ percent }: PieLabelRenderProps) =>
            isCompactLayout ? "" : `${(percent || 0).toFixed(2)}%`,
        [isCompactLayout],
    );

    const formatTooltip = useCallback<TooltipFormatter>((value, name, item) => {
        const percent = item.payload?.percent ?? 0;
        return [`${value} công việc (${percent}%)`, name ?? ""];
    }, []);

    return (
        <div
            className="w-full min-w-0"
            style={{ height: isMobile ? 260 : 380 }}
        >
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="total"
                        nameKey="name"
                        shape={TaskSector}
                        cx="50%"
                        cy="50%"
                        outerRadius={isMobile ? 80 : 125}
                        innerRadius={isMobile ? 45 : 65}
                        paddingAngle={3}
                        labelLine={!isCompactLayout}
                        label={renderLabel}
                    />
                    <Tooltip formatter={formatTooltip} />
                    <Legend
                        verticalAlign={isCompactLayout ? "bottom" : "middle"}
                        align={isCompactLayout ? "center" : "right"}
                        layout={isCompactLayout ? "horizontal" : "vertical"}
                        iconType="circle"
                        wrapperStyle={{
                            fontSize: isMobile ? 12 : 14,
                            paddingTop: isMobile ? 8 : 0,
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
