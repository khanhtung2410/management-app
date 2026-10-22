// Tô màu từng lát biểu đồ tròn theo trạng thái công việc; không dùng độc lập thay cho biểu đồ hoặc thành phần dữ liệu khác.
import { Sector, type PieSectorDataItem } from "recharts";
import { STATUS_CONFIG, type TaskStatusType, UNKNOWN_STATUS_CONFIG } from "@/constants/statuses";

interface TaskStatPayload {
    status: TaskStatusType;
}

export function TaskSector(props: PieSectorDataItem) {
    const payload = props.payload as TaskStatPayload;
    return <Sector {...props} fill={(STATUS_CONFIG[payload.status] ?? UNKNOWN_STATUS_CONFIG).color} />;
}