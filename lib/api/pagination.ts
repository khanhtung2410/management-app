/** Parse + clamp page về ≥ 1. */
export function parsePage(raw: string | null): number {
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

/** Parse + clamp pageSize về [1, max]. Default khi không truyền/không phải số. */
export function parsePageSize(raw: string | null, def = 10, max = 100): number {
  if (raw === null || raw === "") return def;
  const n = Number(raw);
  if (!Number.isFinite(n)) return def;
  return Math.min(Math.max(Math.floor(n), 1), max);
}