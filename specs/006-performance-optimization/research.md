# Research: Website and Dashboard Performance Optimization

## Decision: Use build/static evidence as the optimization gate

**Rationale**: The current public and dashboard builds both produce a single large JavaScript chunk with Vite warnings. Static source review also identifies eager route imports and media loading risks. Using these facts as the gate prevents broad rewrites and keeps fixes traceable.

**Alternatives considered**: Running full production performance audits first. Rejected for this package because the requested scope is local build/static/browser evidence and no production deployment metrics are required.

## Decision: Prefer route-level code splitting before manual chunk tuning

**Rationale**: Public `src/router.tsx` and dashboard `apps/dashboard/src/App.tsx` eagerly import all route pages. Route-level lazy loading is a low-risk way to defer page-specific code while preserving route names and UI contracts. Manual Rollup chunk configuration can remain a secondary option if route splitting does not address warnings.

**Alternatives considered**: `manualChunks` as the first fix. Rejected as a first move because it may hide the warning without reducing route-level initial work and can produce brittle vendor chunks.

## Decision: Treat hero video loading as a public P1 candidate

**Rationale**: The fallback hero videos are local MP4 files sized 1.2 MB, 6.4 MB, and 2.8 MB, and `VideoBackground` renders all sources at once. Adjusting preload/active video behavior is a small, evidence-backed fix if browser checks confirm no visual regression.

**Alternatives considered**: Re-encoding/compressing videos or introducing a media pipeline. Deferred because it changes asset production workflow and may require design/content approval.

## Decision: Add safe default lazy image behavior through existing image primitives when verified

**Rationale**: Shared public image components currently pass caller props directly and do not set default `loading` or `decoding`. A scoped default can reduce below-the-fold image pressure while allowing explicit eager loading for hero/critical images.

**Alternatives considered**: Editing every image call site manually. Rejected as higher churn and easier to miss future images.

## Decision: Dashboard optimization should start with route chunks and proven table/rendering hotspots

**Rationale**: Dashboard build emits a large single JS chunk and an ineffective dynamic import warning for `apps/dashboard/src/lib/api.ts`. App-level lazy routes and removing ineffective import patterns are safer than broad CRUD/table rewrites. Table filtering/rendering fixes should be limited to pages where static or browser evidence identifies avoidable work.

**Alternatives considered**: Server pagination, virtualization, or query cache redesign. Deferred unless later evidence proves a small local implementation is insufficient.

## Decision: Preserve SEO outputs as a contract

**Rationale**: SEO work was added in the previous package. Performance changes must not change titles, canonical URLs, social metadata, sitemap, robots, structured data, or public route indexability.

**Alternatives considered**: Combining SEO and performance changes. Rejected to keep this feature focused and regression-safe.

## Decision: Defer API pagination/cache and media pipeline work unless narrowly proven

**Rationale**: API pagination/cache behavior and image/video processing can improve performance, but they risk API contract changes, data migration, deployment configuration, or content workflow changes. The feature asks for small, evidence-backed fixes without API contract changes.

**Alternatives considered**: Adding pagination endpoints or CDN/media transforms now. Deferred as a broader performance roadmap item.
