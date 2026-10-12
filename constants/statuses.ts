export const taskStatus = {
    Active: 0,
    Complete: 1,
    Overdue:2
} as const;

export type TaskStatusType = typeof taskStatus[keyof typeof taskStatus];

export const userStatus = {
    Active:0,
    Inactive:1
}
export type UserStatusType = typeof userStatus[keyof typeof userStatus];
