export const DASH = "—";
export function fmt(v: number | null | undefined, digits = 1, unit = ""): string {
  if (v === null || v === undefined || Number.isNaN(v)) return DASH;
  return `${v.toFixed(digits)}${unit}`;
}
export function fmtTime(s: number | null | undefined): string {
  if (s === null || s === undefined) return "--:--";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
