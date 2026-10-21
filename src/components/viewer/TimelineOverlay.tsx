import { fmtTime } from "@/lib/viewer/format";

interface Props {
  mediaTime: number | null;
  duration: number;
  loopCount: number | null;
  streamStatus: string | null;
  bufferSeconds: number | null;
  isDemo: boolean;
}

/** Read-only timeline. No play/pause, seek, rate, or quality controls by design. */
export function TimelineOverlay({ mediaTime, duration, loopCount, streamStatus, bufferSeconds, isDemo }: Props) {
  const pct = mediaTime == null ? 0 : (mediaTime / duration) * 100;
  const bufPct = bufferSeconds == null || mediaTime == null ? 0 : Math.min(100, ((mediaTime + bufferSeconds) / duration) * 100);
  return (
    <div className="absolute inset-x-4 bottom-4">
      <div className="glass flex items-center gap-4 rounded-md px-3 py-2.5 text-[11px]">
        <span className="tnum text-foreground">{fmtTime(mediaTime)}</span>
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Media timeline (read-only)">
          <div className="absolute inset-y-0 left-0 bg-foreground/15" style={{ width: `${bufPct}%` }} />
          <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-100 ease-linear" style={{ width: `${pct}%` }} />
        </div>
        <span className="tnum text-muted-foreground">{fmtTime(duration)}</span>
        <span className="h-3 w-px bg-hairline" />
        <span className="text-muted-foreground">Loop <span className="tnum text-foreground">{loopCount ?? "—"}</span></span>
        <span className="hidden text-muted-foreground md:inline">Stream <span className="text-foreground">{streamStatus ?? "Not connected"}</span></span>
        {isDemo && <span className="rounded border border-warning/30 bg-warning/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-warning">Demo animation</span>}
      </div>
    </div>
  );
}
