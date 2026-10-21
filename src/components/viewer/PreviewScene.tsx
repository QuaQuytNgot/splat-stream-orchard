import { useMemo } from "react";
import type { ViewerObject } from "@/lib/viewer/types";
import { mulberry32 } from "@/lib/viewer/placement";

/** Decorative placeholder artwork ONLY. Not a renderer, not a splat decoder. */
const W = 1600, H = 1000, CX = 800, CY = 380, F = 1250, D = 6.5, CAM_H = 1.7;

function project(x: number, y: number, z: number) {
  const zc = z + D;
  return { x: CX + (F * x) / zc, y: CY - (F * (y - CAM_H)) / zc, s: F / zc };
}

const PARTS: [number, number, number, number, number][] = [
  // cx, cy, rx, ry, weight
  [0, 1.62, 0.1, 0.12, 40],
  [0, 1.25, 0.2, 0.28, 140],
  [-0.1, 0.5, 0.08, 0.45, 80],
  [0.1, 0.5, 0.08, 0.45, 80],
  [-0.28, 1.15, 0.05, 0.3, 40],
  [0.28, 1.15, 0.05, 0.3, 40],
  [0, 0.95, 0.22, 0.12, 50],
];

function silhouette(seed: number, variant: number) {
  const r = mulberry32(seed);
  const pts: { x: number; y: number; o: number }[] = [];
  const widen = variant === 1 ? 1.35 : 1; // e.g. dress
  PARTS.forEach(([cx, cy, rx, ry, n], i) => {
    for (let k = 0; k < n; k++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r());
      let w = rx;
      if (variant === 1 && (i === 2 || i === 3 || i === 6)) w *= widen;
      const sway = variant === 2 && i >= 4 && i <= 5 ? (i === 4 ? -0.08 : 0.08) : 0;
      pts.push({ x: cx + sway + Math.cos(a) * w * d, y: cy + Math.sin(a) * ry * d, o: 0.25 + r() * 0.6 });
    }
  });
  return pts;
}

export function PreviewScene({ objects }: { objects: ViewerObject[] }) {
  const grid = useMemo(() => {
    const lines: string[] = [];
    for (let x = -8; x <= 8; x++) {
      const a = project(x, 0, -4), b = project(x, 0, 14);
      lines.push(`M${a.x},${a.y}L${b.x},${b.y}`);
    }
    for (let z = -4; z <= 14; z++) {
      const a = project(-8, 0, z), b = project(8, 0, z);
      lines.push(`M${a.x},${a.y}L${b.x},${b.y}`);
    }
    return lines.join("");
  }, []);

  const sorted = [...objects].sort((a, b) => b.position.z - a.position.z);
  const radius = Array.from({ length: 65 }, (_, i) => {
    const t = (i / 64) * Math.PI * 2;
    const p = project(Math.cos(t) * 3.2, 0, Math.sin(t) * 3.2);
    return `${i ? "L" : "M"}${p.x},${p.y}`;
  }).join("") + "Z";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="floor" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="var(--viewport)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--viewport)" stopOpacity="1" />
          <stop offset="45%" stopColor="var(--viewport)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#floor)" />
      <path d={grid} stroke="var(--foreground)" strokeOpacity="0.07" strokeWidth="1" fill="none" />
      <path d={radius} stroke="var(--primary)" strokeOpacity="0.18" strokeDasharray="4 6" fill="none" />
      <rect width={W} height={H} fill="url(#fade)" />
      {sorted.map((o) => {
        const variant = o.assetName === "Longdress" ? 1 : o.assetName === "Soldier" ? 2 : 0;
        const pts = silhouette(o.instance * 97 + variant * 13, variant);
        const base = project(o.position.x, 0, o.position.z);
        const dim = o.state === "loading" ? 0.35 : o.state === "error" ? 0.18 : 1;
        return (
          <g key={o.id} opacity={dim} className="transition-opacity duration-500">
            <ellipse cx={base.x} cy={base.y} rx={base.s * 0.35} ry={base.s * 0.08} fill={o.color} opacity={0.12} />
            {pts.map((p, i) => {
              const s = project(o.position.x + p.x, p.y, o.position.z);
              return <circle key={i} cx={s.x} cy={s.y} r={Math.max(0.8, s.s * 0.009)} fill={o.color} opacity={p.o * 0.75} />;
            })}
          </g>
        );
      })}
    </svg>
  );
}
