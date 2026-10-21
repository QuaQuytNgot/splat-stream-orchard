import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ViewerObject, ViewerTelemetry } from "@/lib/viewer/types";
import { DASH, fmt } from "@/lib/viewer/format";

interface Props {
  telemetry: ViewerTelemetry;
  objects: ViewerObject[];
  connected: boolean;
  onClose: () => void;
}

const NC = "Not connected";

export function DiagnosticsPanel({ telemetry: t, objects, connected, onClose }: Props) {
  const v = (s: string) => (connected ? s : NC);
  return (
    <div className="glass absolute bottom-[76px] left-4 top-4 z-20 flex w-[380px] max-w-[calc(100%-2rem)] flex-col rounded-lg animate-in fade-in-0 slide-in-from-left-2">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <h2 className="text-sm font-medium">Research Diagnostics</h2>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose} aria-label="Close diagnostics"><X /></Button>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3">
        <div className="flex gap-2 rounded-md border border-primary/25 bg-primary/5 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <p>This preview is UI-only. Real streaming, Q0–Q3 decoding, visibility analysis and ABR planning require connecting the existing Python DASH framework and browser renderer. No values below are estimated.</p>
        </div>

        <Group title="Presentation">
          <Row k="Rendering FPS" v={v(fmt(t.renderFps, 1))} />
          <Row k="New decoded video FPS" v={v(fmt(t.decodedVideoFps, 1))} />
          <Row k="Dropped presentations" v={v(fmt(t.droppedPresentations, 0))} />
          <Row k="Repeated presentations" v={v(fmt(t.repeatedPresentations, 0))} />
        </Group>
        <Group title="Network & decode">
          <Row k="Network throughput" v={v(fmt(t.networkMbps, 2, " Mbps"))} />
          <Row k="Worker utilization" v={v(t.workerUtilization == null ? DASH : `${Math.round(t.workerUtilization * 100)}%`)} />
          <Row k="Ready buffer" v={v(fmt(t.readyBufferSeconds, 2, " s"))} />
          <Row k="Scheduling policy" v={v(t.schedulingPolicy ?? DASH)} />
        </Group>

        <Group title={`Per object · ${objects.length}`}>
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full text-[10.5px]">
              <thead>
                <tr className="label-caps text-left">
                  <th className="px-1 py-1 font-normal">Obj</th>
                  <th className="px-1 font-normal">Req/Act</th>
                  <th className="px-1 font-normal">Frame</th>
                  <th className="px-1 font-normal">FPS</th>
                  <th className="px-1 font-normal">Vis/Occ</th>
                  <th className="px-1 font-normal">Miss</th>
                </tr>
              </thead>
              <tbody className="tnum">
                {objects.map((o) => (
                  <tr key={o.id} className="border-t border-hairline">
                    <td className="px-1 py-1.5"><span className="mr-1 inline-block h-2 w-2 rounded-sm align-middle" style={{ background: o.color }} />{o.id}</td>
                    <td className="px-1">{connected ? `${o.requestedQuality ?? "–"}/${o.quality ?? "–"}` : DASH}</td>
                    <td className="px-1">{connected && o.frameId != null ? `#${o.frameId} @${fmt(o.frameTime, 2)}` : DASH}</td>
                    <td className="px-1">{connected ? fmt(o.decodedFps, 0) : DASH}</td>
                    <td className="px-1">{connected && o.visibility != null ? `${Math.round(o.visibility * 100)}/${Math.round((o.occlusion ?? 0) * 100)}` : DASH}</td>
                    <td className="px-1">{connected ? fmt(o.deadlineMisses, 0) : DASH}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Group>
        <Group title="Planner">
          <Row k="Result / status" v={NC} />
          <Row k="Warnings / fallbacks" v={connected ? "None reported" : NC} />
        </Group>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="label-caps mb-1.5">{title}</h3>
      <dl className="divide-y divide-hairline">{children}</dl>
    </section>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  const nc = v === NC || v === DASH;
  return (
    <div className="flex items-center justify-between py-1.5 text-xs">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={nc ? "tnum text-muted-foreground/70" : "tnum"}>{v}</dd>
    </div>
  );
}
