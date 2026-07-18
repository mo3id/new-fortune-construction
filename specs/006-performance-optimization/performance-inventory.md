# Performance Inventory

**Feature**: `006-performance-optimization`  
**Captured**: 2026-07-17  
**Last Updated**: 2026-07-17 23:42 Africa/Cairo  
**Scope**: Phase 1, Phase 2, US1, US2, US3, US4, and Final Phase (`T001-T072`). Static/build verification plus scoped public/dashboard performance implementation. No API runtime, browser runtime, API contract changes, SEO output changes, dashboard route changes, media re-encoding, API pagination, API cache changes, pagination, or virtualization were performed.

## Evidence Helpers

- [performance-findings.md](./performance-findings.md): normalized finding register with status, evidence, implementation mapping, and deferrals.
- [performance-browser-verification.md](./performance-browser-verification.md): browser evidence template and current blocked/not-run runtime status.
- [evidence/README.md](./evidence/README.md): evidence helper index and command usage notes.
- [evidence/static-scan-summary.md](./evidence/static-scan-summary.md): static scan command summaries for route imports, media/image usage, rendering/filtering, and large local media.

## Build Baseline

### Public Site Before US2

- **Command**: `npm run build`
- **Result**: Passed
- **Captured For**: T007, T015, T029
- **Modules transformed**: 2196
- **Main JS**: `dist/assets/index-DdRhj52A.js` at 777.57 kB minified / 228.64 kB gzip
- **Main CSS**: `dist/assets/index-Dufde4rs.css` at 124.09 kB minified / 19.94 kB gzip
- **File-system size check**: `dist/assets/index-DdRhj52A.js` shows 759K via `ls -lh`
- **Warning**: Vite reported chunks larger than 500 kB after minification.
- **SEO static files present in build output**: `dist/sitemap.xml`, `dist/robots.txt`
- **Status**: Baseline verified before US2.

### Public Site After US2

- **Command**: `npm run build`
- **Result**: Passed
- **Captured For**: T038
- **Modules transformed**: 2197
- **Main JS**: `dist/assets/index-BgUZ1HzS.js` at 550.25 kB minified / 171.93 kB gzip
- **Main CSS**: `dist/assets/index-Dzr_K8tg.css` at 117.71 kB minified / 18.27 kB gzip
- **File-system size check**: `dist/assets/index-BgUZ1HzS.js` shows 537K via `ls -lh`
- **Split route chunks**: `App`, `AboutPage`, `ProjectsPage`, `ProjectDetailsPage`, `ServicesPage`, `HSEPage`, `CareersPage`, and `ContactPage` are emitted as separate chunks.
- **Warning**: Vite still reports one chunk larger than 500 kB after minification.
- **Delta**: Main JS reduced by 227.32 kB minified and 56.71 kB gzip compared with the baseline.
- **SEO static files present in build output**: `dist/sitemap.xml`, `dist/robots.txt`
- **Status**: US2 build verification passed with residual public chunk warning documented.

### Dashboard Before US3

- **Command**: `npm run build --workspace=apps/dashboard`
- **Result**: Passed
- **Captured For**: T008, T016, T042
- **Modules transformed**: 2001
- **Main JS**: `apps/dashboard/dist/assets/index-BwtGy0ec.js` at 604.25 kB minified / 178.34 kB gzip
- **Main CSS**: `apps/dashboard/dist/assets/index-Bz9vJYaH.css` at 71.25 kB minified / 11.62 kB gzip
- **File-system size check**: `apps/dashboard/dist/assets/index-BwtGy0ec.js` shows 590K via `ls -lh`
- **Chunk warning**: Vite reported chunks larger than 500 kB after minification.
- **Dynamic import warning**: `apps/dashboard/src/lib/api.ts` is dynamically imported by `apps/dashboard/src/pages/Services.tsx`, but is also statically imported by dashboard layout/pages, so the dynamic import will not move the module into another chunk.
- **Status**: Baseline verified before US3.

### Dashboard After US3

- **Command**: `npm run build --workspace=apps/dashboard`
- **Result**: Passed
- **Captured For**: T049
- **Modules transformed**: 2001
- **Main JS**: `apps/dashboard/dist/assets/index-DJfP6XPu.js` at 490.36 kB minified / 156.61 kB gzip
- **Main CSS**: `apps/dashboard/dist/assets/index-CUt3YZ4M.css` at 71.28 kB minified / 11.63 kB gzip
- **File-system size check**: `apps/dashboard/dist/assets/index-DJfP6XPu.js` shows 479K via `ls -lh`
- **Split dashboard chunks**: Login, Overview, Projects, ProjectCategories, Applications, Messages, Jobs, Team, Partners, Services, Settings, and PageContent are emitted as separate chunks.
- **Chunk warning**: Resolved. Vite did not report a `>500 kB` dashboard chunk warning after US3.
- **Dynamic import warning**: Resolved. The `apps/dashboard/src/lib/api.ts` dynamic import warning did not appear after replacing the Services upload call-site imports with a normal `uploadImage` import.
- **Delta**: Main JS reduced by 113.89 kB minified and 21.73 kB gzip compared with the baseline.
- **Status**: US3 build verification passed.

### Dashboard Final After US4

- **Command**: `npm run build --workspace=apps/dashboard`
- **Result**: Passed
- **Captured For**: T060, T064
- **Modules transformed**: 2001
- **Main JS**: `apps/dashboard/dist/assets/index-NxTvhuHw.js` at 490.36 kB minified / 156.60 kB gzip
- **Applications chunk**: `apps/dashboard/dist/assets/Applications-0DRV4G1E.js` at 9.58 kB minified / 2.74 kB gzip
- **Main CSS**: `apps/dashboard/dist/assets/index-CUt3YZ4M.css` at 71.28 kB minified / 11.63 kB gzip
- **Chunk warning**: Resolved. Vite did not report a `>500 kB` dashboard chunk warning.
- **Dynamic import warning**: Resolved. No dynamic import warning for `apps/dashboard/src/lib/api.ts` appeared.
- **Status**: US4 and final dashboard build verification passed.

### Typecheck Baseline

- **Command**: `npm run typecheck`
- **Result**: Passed
- **Captured For**: T009
- **Output summary**: `tsc --noEmit` completed with exit code 0.
- **Status**: Baseline verified.

### Typecheck After US2/US3

- **Command**: `npm run typecheck`
- **Result**: Passed
- **Captured For**: US2/US3 verification
- **Output summary**: `tsc --noEmit` completed with exit code 0 after public and dashboard changes.
- **Status**: Verification passed.

### Final Typecheck And Public Build

- **Typecheck command**: `npm run typecheck`
- **Typecheck result**: Passed; `tsc --noEmit` completed with exit code 0.
- **Public build command**: `npm run build`
- **Public build result**: Passed; main JS remains `dist/assets/index-BgUZ1HzS.js` at 550.25 kB minified / 171.93 kB gzip.
- **Public build warning**: Residual Vite `>500 kB` chunk warning remains for the public main chunk.
- **SEO static files**: Public build still emits `dist/sitemap.xml` and `dist/robots.txt`.
- **Captured For**: T062, T063

## Static Findings

### PERF-PUBLIC-001: Public pages are eagerly imported

- **Status**: Implemented and build-verified in US2
- **Priority**: P1
- **Evidence Type**: Static source + build warning
- **Evidence**: `src/router.tsx` imports `App`, `AboutPage`, `ProjectsPage`, `ProjectDetailsPage`, `ServicesPage`, `HSEPage`, `CareersPage`, and `ContactPage` at module top level.
- **Risk**: Home route can pull code for project detail, careers, HSE, services, and contact into the initial JS chunk.
- **Candidate fix**: Route-level `React.lazy`/`Suspense` with existing route paths preserved.
- **Implemented**: `src/router.tsx` now lazy-loads all public route pages and keeps the route path list unchanged.
- **Mapped tasks**: T026-T032, T038-T039
- **Verification**: Public build chunk comparison, public route checks only if runtime evidence is needed, deep-link/route preservation checks.

### PERF-PUBLIC-002: Project detail lightbox is included through eager routing

- **Status**: Implemented and build-verified in US2
- **Priority**: P1
- **Evidence Type**: Static source + build warning
- **Evidence**: `src/pages/ProjectDetailsPage.tsx` imports `react-18-image-lightbox` and its stylesheet; `src/router.tsx` eagerly imports the page.
- **Risk**: Gallery/lightbox code can contribute to the initial public bundle even when visitors land on the home page.
- **Candidate fix**: Route-level lazy loading first; consider lazy-loading lightbox only when opened if route chunk remains heavy in a later task.
- **Implemented**: `ProjectDetailsPage` is now emitted as a separate route chunk; lightbox-specific code is no longer part of the main public bundle.
- **Mapped tasks**: T026, T030-T032, T038-T039
- **Verification**: Public build output and `/projects/:id` check only if runtime evidence is needed.

### PERF-PUBLIC-003: Hero renders all local video sources

- **Status**: Implemented and build-verified in US2
- **Priority**: P1
- **Evidence Type**: Static source + local asset inventory
- **Evidence**: `src/components/hero/VideoBackground.tsx` maps all `srcs` and creates a video/iframe for each. `HERO_VIDEOS` references local MP4 files.
- **Local video assets**:
  - `public/assets/videos/vedio1.mp4`: 1.2 MB
  - `public/assets/videos/vedio2.mp4`: 6.4 MB
  - `public/assets/videos/vedio3.mp4`: 2.8 MB
- **Risk**: Avoidable network/media overhead on the home route.
- **Candidate fix**: Render/preload only active or near-active video sources while preserving current hero rotation behavior.
- **Implemented**: `src/components/hero/VideoBackground.tsx` now renders the active source and warms the next local video only; non-active YouTube iframes are not assigned an embed URL.
- **Mapped tasks**: T027, T036-T037, T039
- **Verification**: Home route visual continuity and console/network evidence only if runtime evidence is needed.

### PERF-PUBLIC-004: Shared image components do not default to lazy/async loading

- **Status**: Implemented and build-verified in US2
- **Priority**: P1
- **Evidence Type**: Static source
- **Evidence**: `src/components/ui/Image.tsx` and `packages/shared-ui/src/components/ui/image.tsx` pass image props directly without default `loading` or `decoding`.
- **Risk**: Below-the-fold image-heavy sections can compete with initial route work unless every caller opts in manually.
- **Candidate fix**: Add safe defaults with caller override support; keep critical/above-the-fold imagery explicit.
- **Implemented**: Public and shared `Image` components now default to `loading="lazy"` and `decoding="async"` with caller override support. The actual critical above-the-fold call sites identified for T035 were `src/components/ui/PageHero.tsx` and `packages/shared-ui/src/components/ui/page-hero.tsx`; both now set `loading="eager"`.
- **Mapped tasks**: T028, T033-T035, T038-T039
- **Verification**: Public build, representative route checks only if runtime evidence is needed, no missing images.

### PERF-DASH-001: Dashboard pages are eagerly imported

- **Status**: Implemented and build-verified in US3
- **Priority**: P2
- **Evidence Type**: Static source + build warning
- **Evidence**: `apps/dashboard/src/App.tsx` imports Login, Overview, Projects, Applications, Messages, Jobs, Team, Partners, Services, Settings, PageContent, and ProjectCategories at module top level.
- **Risk**: Dashboard initial chunk includes code for every management surface.
- **Candidate fix**: Dashboard route-level lazy loading with current route names and layout/auth behavior preserved.
- **Implemented**: `apps/dashboard/src/App.tsx` now lazy-loads dashboard route pages with the existing route names preserved.
- **Mapped tasks**: T040, T044-T046, T049-T052
- **Verification**: Dashboard build chunk comparison, route reachability checks only if runtime evidence is needed.

### PERF-DASH-002: Dashboard Services dynamic import is ineffective

- **Status**: Implemented and build-verified in US3
- **Priority**: P2
- **Evidence Type**: Dashboard build warning + static source
- **Evidence**: Dashboard build warning says `apps/dashboard/src/lib/api.ts` dynamic import in `apps/dashboard/src/pages/Services.tsx` cannot move the module into another chunk because the module is statically imported elsewhere.
- **Risk**: The dynamic import adds complexity without producing a chunking benefit.
- **Candidate fix**: Replace the ineffective dynamic import with normal existing API import if verified safe, or leave documented if no measurable effect.
- **Implemented**: `apps/dashboard/src/pages/Services.tsx` now imports `uploadImage` normally from `apps/dashboard/src/lib/api.ts`. No API base URL, request payload, response shape, or auth behavior changed.
- **Mapped tasks**: T041, T047-T049, T052
- **Verification**: Dashboard build warning comparison.

### PERF-DASH-003: Dashboard Applications filters and renders all rows

- **Status**: Implemented and build-verified in US4
- **Priority**: P2
- **Evidence Type**: Static source
- **Evidence**: `apps/dashboard/src/pages/Applications.tsx` computed `filtered = apps.filter(...)` during render and mapped all filtered rows.
- **Risk**: Interaction cost grows with application count.
- **Candidate fix**: Small local memoization/search normalization only if evidence remains valid; defer server pagination or virtualization.
- **Implemented**: `apps/dashboard/src/pages/Applications.tsx` now memoizes `search.trim().toLowerCase()` and the filtered application list with `useMemo`. The existing applications API query, filterStatus server query parameter, status update mutation, delete mutation, and row rendering contract were preserved.
- **Mapped tasks**: T053-T061
- **Verification**: Static review plus dashboard build. Focused browser runtime was not needed because the change is a pure client-side memoization and build/typecheck covered compilation.

## Browser Evidence Placeholders

Browser runtime was not started for T001-T072. US2, US3, US4, and Final Phase verification used static route preservation checks plus successful public/dashboard builds. Runtime browser checks remain available for a later pass if the user requests visual/browser evidence.

### Public Routes

| Route | Desktop Evidence | Mobile Evidence | Console Errors | Failed Requests | Horizontal Scroll | Clipped Actions | SEO Status | Status |
|---|---|---|---|---|---|---|---|---|
| `/` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build only | Route preserved in `src/router.tsx`; build passed. |
| `/projects` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build only | Route preserved in `src/router.tsx`; build passed. |
| `/projects/:id` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build only | Route preserved in `src/router.tsx`; build passed. |
| `/services` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build only | Route preserved in `src/router.tsx`; build passed. |
| `/about` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build only | Route preserved in `src/router.tsx`; build passed. |
| `/hse` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build only | Route preserved in `src/router.tsx`; build passed. |
| `/careers` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build only | Route preserved in `src/router.tsx`; build passed. |
| `/contact` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build only | Route preserved in `src/router.tsx`; build passed. |

### Dashboard Routes

| Route | Desktop Evidence | Mobile Evidence | Console Errors | Failed Requests | Horizontal Scroll | Clipped Actions | API Safety | Status |
|---|---|---|---|---|---|---|---|---|
| `/login` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved in `apps/dashboard/src/App.tsx`; build passed. |
| `/` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved in `apps/dashboard/src/App.tsx`; build passed. |
| `/projects` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved in `apps/dashboard/src/App.tsx`; build passed. |
| `/project-categories` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved in `apps/dashboard/src/App.tsx`; build passed. |
| `/applications` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved in `apps/dashboard/src/App.tsx`; build passed. |
| `/messages` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved in `apps/dashboard/src/App.tsx`; build passed. |
| `/jobs` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved in `apps/dashboard/src/App.tsx`; build passed. |
| `/team` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved in `apps/dashboard/src/App.tsx`; build passed. |
| `/partners` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved in `apps/dashboard/src/App.tsx`; build passed. |
| `/services` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved in `apps/dashboard/src/App.tsx`; build passed. |
| `/settings` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved in `apps/dashboard/src/App.tsx`; build passed. |
| `/content` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved in `apps/dashboard/src/App.tsx`; build passed. |

## Guardrails Confirmed For T001-T072

- Application code changes were limited to public/dashboard performance files mapped to US2/US3 findings.
- US4 application code changes were limited to PERF-DASH-003 memoized filtering/search normalization in `apps/dashboard/src/pages/Applications.tsx`.
- API runtime was not started.
- Browser runtime was not started.
- API contracts were not changed.
- SEO outputs were not changed.
- Dashboard routes were not changed.
- `Project.category` remains documented as a string contract.
- Success Stories remain documented as managed through Page Content.

## US4 And Final Verification

- **PERF-DASH-003 target confirmation**: Complete. It remained the only approved dashboard render/filtering implementation target.
- **Pre-change Applications behavior**: `Applications.tsx` fetched applications with `queryKey: ['applications', filterStatus]`, passed `{ status: filterStatus }` only when selected, filtered by full name/email/position, and patched status through `/applications/${id}/status`.
- **Implemented change**: Added `useMemo` for normalized search and filtered rows only.
- **Preserved behavior**: Existing applications API query, status update behavior, delete behavior, table/list contract, dashboard routes, and API base URL assumptions were preserved.
- **TanStack Query review**: `src/main.tsx` still uses `new QueryClient()` with default options. `apps/dashboard/src/main.tsx` still uses `retry: 1` and `staleTime: 30_000`. No changes were made because broader cache behavior can affect API/request assumptions.
- **API pagination/cache**: Deferred because it would require explicit API contract and compatibility tasks.
- **Media pipeline/re-encoding**: Deferred because it changes asset/content workflow outside this package.
- **Dashboard virtualization**: Deferred because it is a broader table architecture change.
- **API tests**: Not run. No API request/response assumptions, API routes, payloads, auth behavior, or server code changed.
- **Route guardrails**: `src/router.tsx` preserves `/`, `/about`, `/projects`, `/projects/:id`, `/services`, `/hse`, `/careers`, and `/contact`; `apps/dashboard/src/App.tsx` preserves `/login`, `/`, `/projects`, `/project-categories`, `/applications`, `/messages`, `/jobs`, `/team`, `/partners`, `/services`, `/settings`, and `/content`.
- **SEO guardrails**: No SEO implementation files or static SEO outputs were changed in T053-T072.
- **Final command status**: `npm run typecheck`, `npm run build`, and `npm run build --workspace=apps/dashboard` all passed.

## Deferred Opportunities

- **API pagination/caching for dashboard tables**: Deferred because it risks request/response contract changes.
- **Public API response caching strategy**: Deferred unless later evidence proves duplicate requests and a safe client-only cache option.
- **Media processing pipeline or video re-encoding**: Deferred because it changes asset/content workflow.
- **Dashboard-wide virtualization/table framework**: Deferred as a broad UI architecture change.
- **Manual Rollup `manualChunks`**: Secondary option after route-level code splitting evidence.
