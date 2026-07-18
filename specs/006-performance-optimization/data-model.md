# Data Model: Performance Optimization Evidence

## Performance Finding

- `id`: Stable task-facing identifier, for example `PERF-PUBLIC-001`.
- `surface`: `public-site`, `dashboard`, `shared-ui`, or `documentation`.
- `priority`: `P1`, `P2`, or `Deferred`.
- `evidenceType`: `build-output`, `static-source`, `browser-observation`, or `regression-check`.
- `evidence`: Command output, source path, browser route, or screenshot reference.
- `risk`: Bundle size, media loading, rendering work, network overhead, SEO regression risk, API contract risk, or dashboard route risk.
- `proposedFix`: Small scoped fix or explicit deferral.
- `verification`: Build, typecheck, browser target, SEO check, or API contract review required.
- `status`: `open`, `implemented`, `blocked`, `deferred`, or `verified`.

## Build Output Baseline

- `app`: `public` or `dashboard`.
- `command`: Build command used.
- `result`: `passed`, `failed`, or `blocked`.
- `mainJsChunk`: Largest JS chunk path and size.
- `cssChunk`: Main CSS output and size.
- `warnings`: Vite warnings, chunk warnings, or dynamic import warnings.
- `timestamp`: Date/time captured.

## Asset Loading Finding

- `asset`: File path or URL pattern.
- `size`: Local file size when available.
- `owner`: Component/page responsible for loading the asset.
- `loadingBehavior`: Current eager/lazy/preload behavior.
- `safeOptimization`: Candidate fix that preserves visible content.
- `deferredReason`: Required when optimization is broader than this package.

## Rendering Finding

- `owner`: Component/page with repeated render, filtering, mapping, or interaction work.
- `pattern`: Description of the potentially expensive work.
- `dataScaleAssumption`: Known or unknown data size.
- `smallFixCandidate`: Memoization, route split, query option, or local rendering cleanup.
- `broadFixDeferred`: Pagination, virtualization, cache architecture, or API changes.

## Verification Record

- `target`: Route, build, static check, or browser viewport.
- `commandOrMethod`: Exact command or manual/browser method.
- `expectedEvidence`: Chunk sizes, console/network summary, horizontal scroll status, clipped action status, SEO output status.
- `result`: `passed`, `failed`, `blocked`, or `not-needed`.
- `notes`: Residual risks and follow-ups.

## Deferred Performance Work

- `item`: Future optimization opportunity.
- `reasonDeferred`: Why it is too broad or risky for this package.
- `requiredValidation`: Evidence needed before implementation.
- `contractRisk`: API, SEO, route, data, or UI risk that must be managed later.
