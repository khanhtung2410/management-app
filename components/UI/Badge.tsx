// Hiển thị nhãn trạng thái theo cấu hình màu; không dùng cho hành động tương tác hoặc nội dung cần điều hướng.
import type { StatusConfig } from "@/constants/statuses";

interface BadgeProps {
    config: StatusConfig;
    size?: "sm" | "md";
    className?: string;
}

const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
};

export function Badge({
    config,
    size = "sm",
    className = "",
}: BadgeProps) {
    return (
        <span
            className={`inline-flex w-fit items-center rounded-full font-medium ${sizeClasses[size]} ${className}`.trim()}
            style={{ backgroundColor: config.bg, color: config.color }}
        >
            {config.label}
        </span>
    );
}