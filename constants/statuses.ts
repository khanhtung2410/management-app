export const taskStatus = {
    Active: 0,
    Complete: 1,
    Overdue: 2
} as const;
export type TaskStatusType = typeof taskStatus[keyof typeof taskStatus];

export const STATUS_CONFIG: Record<
    TaskStatusType,
    { label: string; bg: string; color: string }
> = {
    [taskStatus.Active]: { label: "Đang thực hiện", bg: "#DBEAFE", color: "#1D4ED8" },
    [taskStatus.Complete]: { label: "Hoàn thành", bg: "#DCFCE7", color: "#15803D" },
    [taskStatus.Overdue]: { label: "Quá hạn", bg: "#FEE2E2", color: "#B91C1C" },
};

export const userStatus = {
    Active: 1,
    Inactive: 0
} as const;
export type UserStatusType = typeof userStatus[keyof typeof userStatus];

export const USER_STATUS_CONFIG: Record<
    UserStatusType,
    { label: string; bg: string; color: string }
> = {
    [userStatus.Active]: { label: "Đang hoạt động", bg: "#DCFCE7", color: "#15803D" },
    [userStatus.Inactive]: { label: "Ngừng hoạt động", bg: "#FEE2E2", color: "#B91C1C" },
};

