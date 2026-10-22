// Cung cấp nút thao tác chuẩn hóa variant, kích thước và trạng thái tải; không dùng cho liên kết điều hướng.
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "success" | "muted" | "ghost";
    size?: "xs" | "sm" | "md";
    loading?: boolean;
}

const variantClasses = {
    primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
    danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    success:
        "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
    muted:
        "bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500",
    ghost:
        "bg-transparent text-current hover:bg-black/5 focus-visible:ring-gray-500 dark:hover:bg-white/10",
};

const sizeClasses = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
};

export function Button({
    variant = "primary",
    size = "md",
    loading = false,
    type = "button",
    disabled,
    className = "",
    children,
    ...buttonProps
}: ButtonProps) {
    return (
        <button
            {...buttonProps}
            type={type}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        >
            {loading && (
                <span
                    aria-hidden="true"
                    className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
                />
            )}
            {children}
        </button>
    );
}