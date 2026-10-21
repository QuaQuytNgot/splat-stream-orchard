/** Preview-only scattered XZ placement. Real placement is owned by the Python scene backend. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function scatterPosition(
  existing: { x: number; z: number }[],
  rand: () => number,
  radius = 3,
  minSeparation = 1.1,
): { x: number; z: number } {
  let best = { x: 0, z: 0 };
  let bestDist = -1;
  for (let i = 0; i < 60; i++) {
    const r = radius * Math.sqrt(rand());
    const a = rand() * Math.PI * 2;
    const p = { x: r * Math.cos(a), z: r * Math.sin(a) };
    const d = existing.length
      ? Math.min(...existing.map((e) => Math.hypot(e.x - p.x, e.z - p.z)))
      : Infinity;
    if (d >= minSeparation) return p;
    if (d > bestDist) { bestDist = d; best = p; }
  }
  return best;
}
