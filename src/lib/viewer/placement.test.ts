import { describe, it, expect } from "vitest";
import { mulberry32, scatterPosition } from "./placement";

describe("scatterPosition", () => {
  it("keeps instances inside radius with minimum separation", () => {
    const rand = mulberry32(7);
    const pts: { x: number; z: number }[] = [];
    for (let i = 0; i < 6; i++) pts.push(scatterPosition(pts, rand, 3, 1.1));
    for (const p of pts) expect(Math.hypot(p.x, p.z)).toBeLessThanOrEqual(3);
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++)
        expect(Math.hypot(pts[i].x - pts[j].x, pts[i].z - pts[j].z)).toBeGreaterThanOrEqual(1.1);
  });
});
