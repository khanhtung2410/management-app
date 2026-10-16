/**
 * Tính phần trăm của `value` so với `total`, làm tròn 2 chữ số thập phân.
 *
 * Hàm thuần: không đọc/ghi state ngoài, cùng input → cùng output.
 *
 * @param value  Tử số (số lượng cần tính)
 * @param total  Mẫu số (tổng)
 * @returns Phần trăm trong [0, ...], làm tròn 2 chữ số. Trả 0 khi total <= 0.
 */
export function getPercent(value: number, total: number): number {
    if (total <= 0) return 0;
    return Math.round((value / total) * 10000) / 100;
}