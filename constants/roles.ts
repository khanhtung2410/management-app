export const userRole = {
    ADMIN: 2,
    USER: 1,
} as const;

export type UserRoleType = typeof userRole[keyof typeof userRole];
