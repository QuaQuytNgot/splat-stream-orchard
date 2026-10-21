import { Activity, PanelRight, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ViewerConnectionStatus } from "@/lib/viewer/types";
import { fmt } from "@/lib/viewer/format";
import { cn } from "@/lib/utils";

const STATUS: Record<ViewerConnectionStatus, { label: string; dot: string }> = {
  disconnected: { label: "Not connected", dot: "bg-muted-foreground" },
  connecting: { label: "Connecting…", dot: "bg-warning animate-breathe" },
  connected: { label: "Streaming", dot: "bg-success" },
  error: { label: "Connection error", dot: "bg-destructive" },
};

interface Props {
  status: ViewerConnectionStatus;
  objectCount: number;
  renderFps: number | null;
  diagnosticsOpen: boolean;
  onToggleDiagnostics: () => void;
  objectsOpen: boolean;
  onToggleObjects: () => void;
}

export function TopBar(p: Props) {
  const s = STATUS[p.status];
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-hairline bg-background px-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid h-6 w-6 place-items-center rounded border border-primary/40 bg-primary/10">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[13px] font-medium">Multi-Object 3DGS Streaming</div>
          <div className="hidden truncate text-[10px] text-muted-foreground md:block">
            Multi-Object 3D Gaussian Splatting Streaming · research viewer
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs">
        <Stat label="Stream">
          <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
          <span>{s.label}</span>
        </Stat>
        <Divider />
        <Stat label="Objects"><span className="tnum">{p.objectCount}</span></Stat>
        <Divider />
        <Tooltip>
          <TooltipTrigger asChild>
            <div><Stat label="Render FPS"><span className="tnum">{fmt(p.renderFps, 0)}</span></Stat></div>
          </TooltipTrigger>
          <TooltipContent>Measured by the renderer. “—” until it is connected.</TooltipContent>
        </Tooltip>
        <Divider />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className={cn("h-8 w-8", p.diagnosticsOpen && "text-primary")} onClick={p.onToggleDiagnostics} aria-label="Research diagnostics" aria-pressed={p.diagnosticsOpen}>
              <Activity />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Research diagnostics</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className={cn("h-8 w-8", p.objectsOpen && "text-primary")} onClick={p.onToggleObjects} aria-label="Toggle objects panel" aria-pressed={p.objectsOpen}>
              <PanelRight />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Objects panel</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={p.onToggleDiagnostics} aria-label="Settings">
              <SlidersHorizontal />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings & connection</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-2">
      <span className="label-caps hidden lg:inline">{label}</span>
      <span className="flex items-center gap-1.5 text-foreground">{children}</span>
    </div>
  );
}
const Divider = () => <span className="h-4 w-px bg-hairline" />;
