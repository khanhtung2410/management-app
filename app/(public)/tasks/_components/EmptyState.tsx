import { Card } from "@/components/UI/Card";

interface TaskListEmptyStateProps {
    isFiltered: boolean;
    variant: "table" | "card";
}

export default function TaskListEmptyState({
    isFiltered,
    variant,
}: TaskListEmptyStateProps) {
    const message = isFiltered
        ? "Không tìm thấy công việc phù hợp"
        : "Chưa có công việc nào";

    if (variant === "table") {
        return (
            <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    {message}
                </td>
            </tr>
        );
    }

    return (
        <Card className="p-10 text-center text-gray-500">
            {message}
        </Card>
    );
}
