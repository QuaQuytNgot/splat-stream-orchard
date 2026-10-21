/**
 * Integration contract between this UI and the existing Python DASH 3DGS framework
 * + browser Gaussian Splatting renderer. Nothing here decodes, plans, or renders.
 * All metric fields are optional/nullable: `null` means "not provided" and must be
 * displayed as "—" / "Not connected", never estimated.
 */

export type QualityLevel = "Q0" | "Q1" | "Q2" | "Q3";
export type ObjectLoadState = "loading" | "ready" | "error";
export type ViewerConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export interface ViewerObject {
  id: string; // short stable id, e.g. "obj-01"
  assetName: string; // e.g. "Longdress"
  instance: number;
  color: string; // css color for marker
  position: { x: number; z: number }; // preview placement only; backend owns real placement
  state: ObjectLoadState;
  /** Read-only, decided by the framework's Planner/ABR. */
  quality: QualityLevel | null;
  requestedQuality?: QualityLevel | null;
  decodedFps?: number | null;
  bufferSeconds?: number | null;
  decodeLatencyMs?: number | null;
  visibility?: number | null; // 0..1
  occlusion?: number | null; // 0..1
  frameId?: number | null;
  frameTime?: number | null;
  plannerStatus?: string | null;
  deadlineMisses?: number | null;
  warnings?: string[];
  isDemo?: boolean;
  errorMessage?: string;
}

export interface ViewerTelemetry {
  renderFps: number | null;
  decodedVideoFps: number | null;
  networkMbps: number | null;
  workerUtilization: number | null; // 0..1
  readyBufferSeconds: number | null;
  droppedPresentations: number | null;
  repeatedPresentations: number | null;
  schedulingPolicy: string | null;
  mediaTime: number | null; // seconds
  loopCount: number | null;
  streamStatus: string | null;
}

export const EMPTY_TELEMETRY: ViewerTelemetry = {
  renderFps: null,
  decodedVideoFps: null,
  networkMbps: null,
  workerUtilization: null,
  readyBufferSeconds: null,
  droppedPresentations: null,
  repeatedPresentations: null,
  schedulingPolicy: null,
  mediaTime: null,
  loopCount: null,
  streamStatus: null,
};

/** Adapter the existing renderer implements to attach to the viewport mount. */
export interface RendererAdapter {
  mount(el: HTMLElement): void | Promise<void>;
  unmount(): void;
  fitScene?(): void;
}

export interface ViewerCallbacks {
  onAddObject: () => void;
  onRemoveObject: (id: string) => void;
  onFitScene: () => void;
}
