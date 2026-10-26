interface UsersEmptyStateProps {
    message: string;
    isDesktop?: boolean;
    mode?: "default" | "search";
}

export default function UsersEmptyState({
    message,
    isDesktop = false,
    mode = "default",
}: UsersEmptyStateProps) {
    if (mode === "search" && isDesktop) {
        return (
            <tr>
                <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-[#64748B]"
                >
                    {message}
                </td>
            </tr>
        );
    }

    if (mode === "search") {
        return (
            <p className="px-6 py-12 text-center text-[#64748B]">
                {message}
            </p>
        );
    }

    return (
        <div className="px-6 py-12 text-center text-[#64748B]">
            {message}
        </div>
    );
}
