import type { ComponentProps } from "react";

type CardProps = ComponentProps<"div"> & {
    shadow?: "sm" | "md";
};

export function Card({
    className = "",
    shadow = "md",
    ...props
}: CardProps) {
    const shadowClassName = shadow === "sm" ? "shadow-sm" : "shadow-md";

    return (
        <div
            {...props}
            className={`rounded-xl bg-white ${shadowClassName} ${className}`}
        />
    );
}
