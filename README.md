# Splat Stream Orchard

Build a polished, interactive FRONTEND PROTOTYPE for an academic research system titled “Multi-Object 3D Gaussian Splatting Streaming” (short identity “Multi-Object 3DGS Streaming”). This is a real-time volumetric-video research tool UI, NOT a conventional video player, marketing landing page, or business dashboard.

Create a working web project using React, TypeScript, Tailwind CSS, and shadcn/ui. PRIORITIZE exceptionally refined visual design and realistic interaction states.

DESIGN: Desktop-first sophisticated scientific visualization application. Matte charcoal/slate background (#0b1015-ish), restrained cyan/teal accents, understated translucent glass panels, hairline dividers, crisp typography with an optional subtle mono font for measurements, excellent contrast. No excessive neon, gradients, marketing hero cards or gaming HUD clutter. Keep 75–80% of width for a large central 3D viewport.

LAYOUT:
1) Slim fixed top bar (48–56px): research identity on left, streaming connection state, active object count, measured rendering FPS (or “—” when unavailable), small icon to open diagnostics/settings on right.
2) Central expansive full-height viewport: it must be architected as an EMBEDDABLE HOST / DOM mount for the EXISTING browser Gaussian Splatting renderer; DO NOT create another splat decoder or replace the renderer. For preview, show a tasteful explicitly labeled “Design preview • renderer not connected” environmental illustration: dark 3D-feeling reference grid and a few differentiated translucent/point-cloud-like human silhouettes positioned non-collinearly; this is visual placeholder artwork only. Keep the overlay minimal, with bottom-left camera interaction guidance (WASD + mouse), a floating “Fit Scene” control, and a subtle origin/axis locator.
3) Right-side object manager, approx 280–320px, collapsible: “Objects” title, count, prominent but compact “+ Add Object”, scrollable list of active objects with short stable IDs (e.g. Longdress · Instance 01), colored identification marker, Q0/Q1/Q2/Q3 *read-only* chip, loading/ready/error state, remove button, expandable row showing *when provided* decoded media FPS, decoded-buffer duration and decode latency, and visibility contribution. Use “— / unavailable” when disconnected. Preview may have three distinct example entries with prominent “Demo data” labeling; do not represent anything as actual measured values. Add/removal must visibly update mock preview list and count. When adding an instance, create a seeded or random scattered XZ position within a conceptual circular radius with minimum separation; do not align them in a row. This is for the UI preview only: actual instance placement will be handled by the existing Python scene backend.
4) Bottom narrow timeline overlay: automatic 00:00–00:10 repeat-cycle progress (as clearly labeled demo animation in preview), media timestamp, loop count and buffer/stream status. Do not include play/pause, seeking, playback-rate, or quality override controls.
5) Collapsible “Research Diagnostics” drawer/panel, hidden by default, with compact grouped global metrics: rendering FPS vs NEW decoded volumetric-video FPS, network Mbps, decoding worker utilization, ready-buffer seconds, dropped/repeated presentations; per-object requested/actual quality, frame ID and time, decoded FPS, predicted visibility + occlusion, Planner result/status, decode scheduling policy, deadline misses, warnings/fallback reasons. Unavailable metrics must show “Not connected” or “—”, NEVER fabricate performance measurements, ABR decisions or visibility estimates. Include a small info banner explaining the preview is UI-only and that real streaming + ABR requires connecting the existing framework.

BEHAVIOR: Responsive panel toggles and object-card expansion. Meaningful hover/focus states and micro-interactions, tooltips, accessible contrast, scroll without blocking the central canvas, screen sizes 1440x900 and 1920x1080 prioritized with a narrow-screen responsive fallback. Keyboard camera hints are descriptive only until renderer adapter is connected. Do not fake a working camera or real streaming playback.

INTEGRATION BOUNDARY: The production implementation is a Python DASH/HTTP 3DGS framework with its own MPD, Q0–Q3 progressive decoding, shared worker pool, buffering, visibility analyzer, Planner, scheduler, and existing browser renderer. NONE of these should be reimplemented in this Lovable design project. Isolate the viewport in a reusable React component with a mount element/ref and typed interfaces such as ViewerObject, ViewerTelemetry, ViewerConnectionStatus, onAddObject/onRemoveObject/onFitScene. Prefer reusable frontend modules, no database, no auth, no external service. The production framework automatically chooses quality; never provide controls to override it.

DELIVER A beautiful, working UX prototype with preview link, reusable components and a clear next-step to attach real websocket/backend state and the existing WebGL canvas. Do not claim performance or ABR functionality from a design-only prototype.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b8ea8f52-c60a-4959-89ba-7e73149c675a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
