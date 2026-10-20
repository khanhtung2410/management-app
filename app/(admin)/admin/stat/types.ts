import type { TaskStatusType } from "@/constants/statuses";

export interface TaskStat {
    status: TaskStatusType;
    name: string;
    total: number;
    percent: number;
}
