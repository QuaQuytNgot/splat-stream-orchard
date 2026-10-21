import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { TopBar } from "@/components/viewer/TopBar";
import { ViewerHost } from "@/components/viewer/ViewerHost";
import { ObjectManager } from "@/components/viewer/ObjectManager";
import { TimelineOverlay } from "@/components/viewer/TimelineOverlay";
import { DiagnosticsPanel } from "@/components/viewer/DiagnosticsPanel";
import { DEMO_DURATION, usePreviewState } from "@/lib/viewer/usePreviewState";
import type { ViewerConnectionStatus } from "@/lib/viewer/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Multi-Object 3DGS Streaming — Research Viewer" },
      { name: "description", content: "Research viewer UI for multi-object 3D Gaussian Splatting volumetric video streaming." },
      { property: "og:title", content: "Multi-Object 3DGS Streaming" },
      { property: "og:description", content: "Research viewer UI for multi-object 3D Gaussian Splatting volumetric video streaming." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { objects, telemetry, onAddObject, onRemoveObject } = usePreviewState();
  const [objectsOpen, setObjectsOpen] = useState(true);
  const [diagOpen, setDiagOpen] = useState(false);
  const status: ViewerConnectionStatus = "disconnected";
  const connected = false;

  const onFitScene = () => toast("Fit Scene", { description: "Will be forwarded to the renderer adapter once connected." });

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar
        status={status}
        objectCount={objects.length}
        renderFps={telemetry.renderFps}
        diagnosticsOpen={diagOpen}
        onToggleDiagnostics={() => setDiagOpen((v) => !v)}
        objectsOpen={objectsOpen}
        onToggleObjects={() => setObjectsOpen((v) => !v)}
      />
      <div className="relative flex min-h-0 flex-1">
        <main className="relative min-w-0 flex-1">
          <ViewerHost objects={objects} renderer={null} onFitScene={onFitScene}>
            <TimelineOverlay
              mediaTime={telemetry.mediaTime}
              duration={DEMO_DURATION}
              loopCount={telemetry.loopCount}
              streamStatus={telemetry.streamStatus}
              bufferSeconds={telemetry.readyBufferSeconds}
              isDemo
            />
            {diagOpen && (
              <DiagnosticsPanel telemetry={telemetry} objects={objects} connected={connected} onClose={() => setDiagOpen(false)} />
            )}
          </ViewerHost>
        </main>
        <div
          className={cn(
            "overflow-hidden transition-[width] duration-300 ease-out max-md:absolute max-md:inset-y-0 max-md:right-0 max-md:z-30",
            objectsOpen ? "w-[300px] max-md:w-[85vw] max-md:max-w-[320px]" : "w-0",
          )}
        >
          <div className="h-full w-[300px] max-md:w-[85vw] max-md:max-w-[320px]">
            <ObjectManager objects={objects} onAddObject={onAddObject} onRemoveObject={onRemoveObject} />
          </div>
        </div>
      </div>
    </div>
  );
}
