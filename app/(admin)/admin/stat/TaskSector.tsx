import { Sector, type PieSectorDataItem } from "recharts";
import { STATUS_CONFIG, type TaskStatusType } from "@/constants/statuses";

// Kiểu data mà TaskSector cần — chỉ cần `status`
interface TaskStatPayload {
    status: TaskStatusType;
}

export function TaskSector(props: PieSectorDataItem) {
    const payload = props.payload as TaskStatPayload;
    return <Sector {...props} fill={STATUS_CONFIG[payload.status].color} />;
}