import { useState } from "react";
import { AlertTriangle, ChevronDown, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ViewerObject } from "@/lib/viewer/types";
import { DASH, fmt } from "@/lib/viewer/format";
import { cn } from "@/lib/utils";

interface Props {
  objects: ViewerObject[];
  onAddObject: () => void;
  onRemoveObject: (id: string) => void;
}

export function ObjectManager({ objects, onAddObject, onRemoveObject }: Props) {
  return (
    <aside aria-label="Objects" className="flex h-full w-full flex-col border-l border-hairline bg-background">
      <div className="flex items-center justify-between px-4 pb-3 pt-4">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-medium">Objects</h2>
          <span className="tnum text-xs text-muted-foreground">{objects.length}</span>
        </div>
        <Button variant="accent" size="sm" className="h-7 gap-1 px-2.5" onClick={onAddObject}>
          <Plus className="h-3.5 w-3.5" /> Add Object
        </Button>
      </div>
      {objects.some((o) => o.isDemo) && (
        <div className="mx-4 mb-2 rounded border border-warning/30 bg-warning/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-warning">
          Demo data · not measured
        </div>
      )}
      <ul className="flex-1 space-y-1.5 overflow-y-auto px-3 pb-4">
        {objects.length === 0 && (
          <li className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
            No active objects. Add one to request it from the scene backend.
          </li>
        )}
        {objects.map((o) => <ObjectRow key={o.id} o={o} onRemove={() => onRemoveObject(o.id)} />)}
      </ul>
      <p className="border-t border-hairline px-4 py-2.5 text-[10px] leading-relaxed text-muted-foreground">
        Quality is selected automatically by the framework's Planner. It is shown read-only.
      </p>
    </aside>
  );
}

function ObjectRow({ o, onRemove }: { o: ViewerObject; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={cn("group rounded-md border border-transparent bg-card/60 transition-colors hover:border-border", open && "border-border bg-card")}>
      <div className="flex items-center gap-2.5 px-2.5 py-2">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: o.color }} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px]">
              {o.assetName} <span className="text-muted-foreground">· Instance {String(o.instance).padStart(2, "0")}</span>
            </span>
            <span className="tnum flex items-center gap-1.5 text-[10px] text-muted-foreground">
              {o.id}
              <StateBadge state={o.state} />
            </span>
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="tnum rounded border border-border px-1.5 py-0.5 text-[10px] text-foreground/80">{o.quality ?? "Q–"}</span>
            </TooltipTrigger>
            <TooltipContent>Current quality (read-only, chosen by Planner)</TooltipContent>
          </Tooltip>
          <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={onRemove} aria-label={`Remove ${o.assetName} instance ${o.instance}`} className="grid h-6 w-6 place-items-center rounded text-muted-foreground opacity-60 transition hover:bg-destructive/15 hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <X className="h-3.5 w-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Remove object</TooltipContent>
        </Tooltip>
      </div>
      {open && (
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-hairline px-3 py-2.5 text-[11px] animate-in fade-in-0 slide-in-from-top-1">
          <Metric k="Decoded FPS" v={fmt(o.decodedFps, 1)} />
          <Metric k="Buffer" v={fmt(o.bufferSeconds, 2, " s")} />
          <Metric k="Decode latency" v={fmt(o.decodeLatencyMs, 0, " ms")} />
          <Metric k="Visibility" v={o.visibility == null ? DASH : `${Math.round(o.visibility * 100)}%`} />
          <Metric k="Position (XZ)" v={`${o.position.x.toFixed(1)}, ${o.position.z.toFixed(1)}`} />
          <Metric k="Source" v={o.isDemo ? "Demo" : "Backend"} />
          {o.errorMessage && <p className="col-span-2 text-destructive">{o.errorMessage}</p>}
        </dl>
      )}
    </li>
  );
}

function StateBadge({ state }: { state: ViewerObject["state"] }) {
  if (state === "loading") return <span className="flex items-center gap-1 text-warning"><Loader2 className="h-2.5 w-2.5 animate-spin" />loading</span>;
  if (state === "error") return <span className="flex items-center gap-1 text-destructive"><AlertTriangle className="h-2.5 w-2.5" />error</span>;
  return <span className="flex items-center gap-1 text-success"><span className="h-1 w-1 rounded-full bg-success" />ready</span>;
}

function Metric({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="tnum text-right">{v}</dd>
    </>
  );
}
