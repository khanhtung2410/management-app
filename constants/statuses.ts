export const taskStatus = {
    Active: 0,
    Complete: 1,
    Overdue:2
} as const;

export type TaskStatusType = typeof taskStatus[keyof typeof taskStatus];

export const userStatus = {
    Active:1,
    Inactive:0
}
export type UserStatusType = typeof userStatus[keyof typeof userStatus];
