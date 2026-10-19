export const taskStatus = {
    Active: 0,
    Complete: 1,
    Overdue: 2
} as const;
export type TaskStatusType = typeof taskStatus[keyof typeof taskStatus];

export const userStatus = {
    Active: 1,
    Inactive: 0
} as const;
export type UserStatusType = typeof userStatus[keyof typeof userStatus];

export type StatusConfig = { label: string; bg: string; color: string };

export const UNKNOWN_STATUS_CONFIG: StatusConfig = {
    label: "Không rõ",
    bg: "#E5E7EB",
    color: "#374151"
}

export const TASK_STATUS_CONFIG_RAW: Record<
    TaskStatusType,
    { label: string; bg: string; color: string }
> = {
    [taskStatus.Active]: { label: "Đang thực hiện", bg: "#DBEAFE", color: "#1D4ED8" },
    [taskStatus.Complete]: { label: "Hoàn thành", bg: "#DCFCE7", color: "#15803D" },
    [taskStatus.Overdue]: { label: "Quá hạn", bg: "#FEE2E2", color: "#B91C1C" },
};

export const USER_STATUS_CONFIG_RAW: Record<
    UserStatusType,
    { label: string; bg: string; color: string }
> = {
    [userStatus.Active]: { label: "Đang hoạt động", bg: "#DCFCE7", color: "#15803D" },
    [userStatus.Inactive]: { label: "Ngừng hoạt động", bg: "#FEE2E2", color: "#B91C1C" },
};

function withFallback<K extends string | number>(
    config: Record<K, StatusConfig>,
): Record<K, StatusConfig> {
    return new Proxy(config, {
        get(target, prop, receiver) {
            if (typeof prop === "symbol") return Reflect.get(target, prop, receiver);

            // Không phải số → không phải status key, pass through
            // (bắt $$typeof, then, toJSON, constructor, hasOwnProperty, ...)
            if (!/^-?\d+$/.test(prop)) {
                return Reflect.get(target, prop, receiver);
            }
            const value = (target as Record<string, StatusConfig>)[prop];
            if (value === undefined) {
                if (process.env.NODE_ENV !== "production") {
                    // Giúp phát hiện dữ liệu bẩn sớm khi dev
                    console.warn(`[statuses] Unknown status key: ${String(prop)}`);
                }
                return UNKNOWN_STATUS_CONFIG;
            }
            return value;
        },
    });
}
export const STATUS_CONFIG = withFallback(TASK_STATUS_CONFIG_RAW);
export const USER_STATUS_CONFIG = withFallback(USER_STATUS_CONFIG_RAW);
