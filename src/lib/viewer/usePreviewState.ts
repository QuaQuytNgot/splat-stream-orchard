import { useCallback, useEffect, useRef, useState } from "react";
import type { ViewerObject } from "./types";
import { EMPTY_TELEMETRY, type ViewerTelemetry } from "./types";
import { mulberry32, scatterPosition } from "./placement";

/**
 * PREVIEW-ONLY state. Replace with a hook fed by the framework's websocket/backend
 * (objects + telemetry). Nothing here measures or estimates performance.
 */
const ASSETS = ["Longdress", "Loot", "Redandblack", "Soldier"];
const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
export const DEMO_DURATION = 10;

function makeObject(n: number, existing: ViewerObject[], rand: () => number): ViewerObject {
  const asset = ASSETS[Math.floor(rand() * ASSETS.length)];
  const instance = existing.filter((o) => o.assetName === asset).length + 1;
  return {
    id: `obj-${String(n).padStart(2, "0")}`,
    assetName: asset,
    instance,
    color: COLORS[(n - 1) % COLORS.length],
    position: scatterPosition(existing.map((o) => o.position), rand),
    state: "loading",
    quality: null,
    isDemo: true,
  };
}

export function usePreviewState() {
  const rand = useRef(mulberry32(20261021)).current;
  const counter = useRef(0);
  const [objects, setObjects] = useState<ViewerObject[]>(() => {
    const list: ViewerObject[] = [];
    for (let i = 0; i < 3; i++) list.push(makeObject(i + 1, list, rand));
    list[0] = { ...list[0], state: "ready", quality: "Q2" };
    list[1] = { ...list[1], state: "ready", quality: "Q1" };
    list[2] = { ...list[2], state: "loading", quality: null };
    return list;
  });
  if (counter.current < 3) counter.current = 3;
  const [mediaTime, setMediaTime] = useState(0);
  const [loop, setLoop] = useState(0);

  // Demo animation clock (00:00–00:10 repeat). Not media playback.
  useEffect(() => {
    const start = performance.now();
    const id = setInterval(() => {
      const t = (performance.now() - start) / 1000;
      setMediaTime(t % DEMO_DURATION);
      setLoop(Math.floor(t / DEMO_DURATION));
    }, 100);
    return () => clearInterval(id);
  }, []);

  const objectsRef = useRef(objects);
  objectsRef.current = objects;

  const onAddObject = useCallback(() => {
    counter.current++;
    const obj = makeObject(counter.current, objectsRef.current, rand);
    objectsRef.current = [...objectsRef.current, obj];
    setObjects(objectsRef.current);
    setTimeout(() => {
      setObjects((p) => p.map((o) => (o.id === obj.id ? { ...o, state: "ready", quality: "Q0" } : o)));
    }, 1400);
  }, [rand]);

  const onRemoveObject = useCallback((id: string) => {
    setObjects((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const telemetry: ViewerTelemetry = { ...EMPTY_TELEMETRY, mediaTime, loopCount: loop };

  return { objects, telemetry, onAddObject, onRemoveObject };
}
