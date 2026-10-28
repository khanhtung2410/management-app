import { Card } from "./Card";

type InlineEmptyStateProps =
    | {
          message: string;
          variant: "table";
          colSpan: number;
          size?: "sm" | "md" | "lg";
      }
    | {
          message: string;
          variant: "card" | "plain";
          colSpan?: never;
          size?: "sm" | "md" | "lg";
      };

const SIZE_CLASS = {
    sm: "py-8",
    md: "py-10",
    lg: "py-12",
} as const;

export function InlineEmptyState(props: InlineEmptyStateProps) {
    const { message, size = "md" } = props;
    const contentClass = `px-6 ${SIZE_CLASS[size]} text-center text-[#64748B]`;

    if (props.variant === "table") {
        return (
            <tr>
                <td colSpan={props.colSpan} className={contentClass}>
                    {message}
                </td>
            </tr>
        );
    }

    if (props.variant === "card") {
        return <Card className={contentClass}>{message}</Card>;
    }

    return <div className={contentClass}>{message}</div>;
}
