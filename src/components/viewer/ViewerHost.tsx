import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { RendererAdapter, ViewerObject } from "@/lib/viewer/types";
import { PreviewScene } from "./PreviewScene";

export interface ViewerHostHandle { mountElement: HTMLDivElement | null }

interface Props {
  objects: ViewerObject[];
  /** Pass the existing browser 3DGS renderer adapter. When absent, preview art is shown. */
  renderer?: RendererAdapter | null;
  onFitScene: () => void;
  children?: React.ReactNode; // overlays (timeline)
}

/** Embeddable host. The existing renderer mounts its WebGL canvas into `mountRef`. */
export const ViewerHost = forwardRef<ViewerHostHandle, Props>(function ViewerHost(
  { objects, renderer, onFitScene, children },
  ref,
) {
  const mountRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => ({ mountElement: mountRef.current }), []);

  useEffect(() => {
    if (!renderer || !mountRef.current) return;
    renderer.mount(mountRef.current);
    return () => renderer.unmount();
  }, [renderer]);

  const connected = !!renderer;

  return (
    <section aria-label="3D viewport" className="relative h-full w-full overflow-hidden bg-viewport">
      <div ref={mountRef} data-renderer-mount className="absolute inset-0" />
      {!connected && <PreviewScene objects={objects} />}

      {!connected && (
        <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2">
          <div className="glass flex items-center gap-2 rounded-full px-3 py-1 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-warning" />
            Design preview • renderer not connected
          </div>
        </div>
      )}

      {/* Axis locator */}
      <div className="pointer-events-none absolute left-4 top-4">
        <svg width="56" height="56" viewBox="0 0 56 56" aria-label="Axis orientation">
          <line x1="16" y1="40" x2="44" y2="40" stroke="var(--chart-5)" strokeWidth="1.5" />
          <line x1="16" y1="40" x2="16" y2="12" stroke="var(--chart-2)" strokeWidth="1.5" />
          <line x1="16" y1="40" x2="30" y2="28" stroke="var(--chart-1)" strokeWidth="1.5" />
          <circle cx="16" cy="40" r="2" fill="var(--foreground)" />
          <text x="47" y="43" fontSize="8" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">X</text>
          <text x="13" y="9" fontSize="8" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">Y</text>
          <text x="32" y="27" fontSize="8" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">Z</text>
        </svg>
      </div>

      {/* Fit scene */}
      <div className="absolute right-4 top-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="glass" size="sm" onClick={onFitScene} className="gap-1.5">
              <Maximize2 className="h-3.5 w-3.5" /> Fit Scene
            </Button>
          </TooltipTrigger>
          <TooltipContent>{connected ? "Frame all objects" : "Forwarded to renderer adapter once connected"}</TooltipContent>
        </Tooltip>
      </div>

      {/* Camera hints */}
      <div className="pointer-events-none absolute bottom-[76px] left-4">
        <div className="glass flex items-center gap-3 rounded-md px-3 py-2 text-[11px] text-muted-foreground">
          <span className="flex gap-0.5">
            {["W", "A", "S", "D"].map((k) => (
              <kbd key={k} className="tnum rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-foreground">{k}</kbd>
            ))}
          </span>
          <span>Move</span>
          <span className="h-3 w-px bg-hairline" />
          <span>Drag to orbit · Scroll to zoom</span>
          {!connected && <span className="text-muted-foreground/70">(inactive)</span>}
        </div>
      </div>

      {children}
    </section>
  );
});
