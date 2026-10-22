import type { StatusConfig } from "@/constants/statuses";

interface BadgeProps {
    config: StatusConfig;
    size?: "sm" | "md";
    className?: string;
}

export function Badge({ config, size = "sm", className = "" }: BadgeProps) {
    const sizeClassName =
        size === "md" ? "px-3 py-1.5 text-sm" : "px-3 py-1 text-xs";

    return (
        <span
            className={`inline-flex w-fit rounded-full font-medium ${sizeClassName} ${className}`}
            style={{ backgroundColor: config.bg, color: config.color }}
        >
            {config.label}
        </span>
    );
}
