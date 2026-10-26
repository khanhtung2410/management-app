// Cung cấp hàng bảng và thẻ responsive cho người dùng admin; không dùng để tải dữ liệu hoặc điều phối trạng thái trang.
import type { User } from "../_lib/api";
import { memo } from "react";
import { UNKNOWN_STATUS_CONFIG, USER_STATUS_CONFIG, userStatus, type UserStatusType } from "@/constants/statuses"
import { Button } from "@/components/UI/Button";
import { Badge } from "@/components/UI/Badge";

interface RowProps {
    user: User;
    processing: boolean;
    onEdit: (user: User) => void;
    onToggle: (id: number, current: UserStatusType) => void;
}

function Actions({
    user,
    processing,
    layout,
    onEdit,
    onToggle,
}: RowProps & { layout: "row" | "card" }) {
    const isActive = user.TrangThai === userStatus.Active;
    const grow = layout === "card" ? "flex-1" : "";

    return (
        <div className="flex gap-3">
            <Button
                variant="muted"
                type="button"
                onClick={() => onEdit(user)}
                className={grow}
            >
                Sửa
            </Button>
            <Button
                variant={isActive ? "danger" : "success"}
                type="button"
                aria-label={`${isActive ? "Ngừng" : "Kích hoạt"} người dùng ${user.HoTen}`}
                disabled={processing}
                loading={processing}
                onClick={() => onToggle(user.ID, user.TrangThai)}
                className={grow}
            >
                {processing ? "Đang..." : isActive ? "Ngừng" : "Kích hoạt"}
            </Button>
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
                <Badge config={USER_STATUS_CONFIG[user.TrangThai] ?? UNKNOWN_STATUS_CONFIG} />
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
                <Badge config={USER_STATUS_CONFIG[user.TrangThai] ?? UNKNOWN_STATUS_CONFIG} />
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