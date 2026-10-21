import type { User } from "./api";
import { memo } from "react";
import { UNKNOWN_STATUS_CONFIG, USER_STATUS_CONFIG, userStatus, UserStatusType } from "@/constants/statuses"

interface RowProps {
    user: User;
    processing: boolean;
    onEdit: (user: User) => void;
    onToggle: (id: number, current: UserStatusType) => void;
}

export const StatusBadge = memo(function StatusBadge({ trangThai }: { trangThai: UserStatusType }) {
    const cfg = USER_STATUS_CONFIG[trangThai] ?? UNKNOWN_STATUS_CONFIG;
    return (
        <span
            className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium"
            style={{
                backgroundColor: cfg.bg,
                color: cfg.color,
            }}
        >
            {cfg.label}
        </span>
    );
})


function Actions({
    user,
    processing,
    layout,
    onEdit,
    onToggle,
}: RowProps & { layout: "row" | "card" }) {
    const isActive = user.TrangThai === userStatus.Active;
    const base = "rounded-md px-4 py-2 text-sm font-medium text-white transition";
    const grow = layout === "card" ? "flex-1" : "";
    const toggleCls = processing
        ? "bg-[#9CA3AF] cursor-not-allowed"
        : isActive
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-700 hover:bg-green-800";

    return (
        <div className="flex gap-3">
            <button
                type="button"
                onClick={() => onEdit(user)}
                className={`${base} bg-[#6B7280] hover:bg-[#4B5563] ${grow}`}
            >
                Sửa
            </button>
            <button
                type="button"
                disabled={processing}
                onClick={() => onToggle(user.ID, user.TrangThai)}
                className={`${base} ${grow} ${toggleCls}`}
            >
                {processing ? "Đang..." : isActive ? "Ngừng" : "Kích hoạt"}
            </button>
        </div>
    );
}

export const UserTableRow = memo(function UserTableRow(props: RowProps) {
    const { user } = props;
    return (
        <tr className="transition hover:bg-[#F8FAFC]">
            <td className="px-6 py-4 text-sm text-[#334155]">#{user.ID}</td>
            <td className="px-6 py-4 font-medium text-[#0f172a]">{user.HoTen}</td>
            <td className="px-6 py-4 text-sm text-[#334155]">{user.Email}</td>
            <td className="px-6 py-4 text-sm text-[#334155]">{user.SDT}</td>
            <td className="px-6 py-4 text-sm">
                <StatusBadge trangThai={user.TrangThai} />
            </td>
            <td className="px-6 py-4">
                <Actions {...props} layout="row" />
            </td>
        </tr>
    );
})

export const UserCard = memo(function UserCard(props: RowProps) {
    const { user } = props;
    return (
        <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#64748B]">#{user.ID}</span>
                <StatusBadge trangThai={user.TrangThai} />
            </div>
            <Field label="Họ tên" value={user.HoTen} />
            <Field label="Email" value={user.Email} />
            <Field label="Điện thoại" value={user.SDT} />
            <Actions {...props} layout="card" />
        </div>
    );
})

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-xs text-[#64748B]">{label}</div>
            <span className="text-xs text-[#64748B]">{value}</span>
        </div>
    );
}