# Performance Findings

**Feature**: `006-performance-optimization`  
**Scope Captured**: T001-T072  
**Runtime Policy**: No API runtime or browser runtime was started for US2/US3/US4/Final Phase. Verification used static checks, typecheck, and production builds.

## Command Evidence

| Command | Result | Evidence Summary | Related Tasks |
|---|---|---|---|
| `npm run build` | Passed | Public build generated `index-DdRhj52A.js` at 777.57 kB / 228.64 kB gzip and retained Vite `>500 kB` chunk warning. | T007, T015 |
| `npm run build --workspace=apps/dashboard` | Passed | Dashboard build generated `index-BwtGy0ec.js` at 604.25 kB / 178.34 kB gzip, retained Vite chunk warning, and emitted dynamic import warning for `apps/dashboard/src/lib/api.ts`. | T008, T016 |
| `npm run typecheck` | Passed | Root `tsc --noEmit` completed successfully. | T009, T021 |
| `npm run build` | Passed | After US2, public build generated `index-BgUZ1HzS.js` at 550.25 kB / 171.93 kB gzip; residual Vite `>500 kB` warning remains documented. | T029, T038 |
| `npm run build --workspace=apps/dashboard` | Passed | After US3, dashboard build generated `index-DJfP6XPu.js` at 490.36 kB / 156.61 kB gzip; dashboard chunk warning and dynamic import warning were resolved. | T042, T049 |
| `npm run typecheck` | Passed | Root `tsc --noEmit` completed successfully after US2/US3 changes. | US2/US3 verification |
| `npm run build --workspace=apps/dashboard` | Passed | After US4, dashboard build generated `index-NxTvhuHw.js` at 490.36 kB / 156.60 kB gzip and `Applications-0DRV4G1E.js` at 9.58 kB / 2.74 kB gzip; no dashboard chunk or dynamic import warnings. | T060, T064 |
| `npm run typecheck` | Passed | Final root `tsc --noEmit` completed successfully. | T062 |
| `npm run build` | Passed | Final public build generated `index-BgUZ1HzS.js` at 550.25 kB / 171.93 kB gzip; residual public Vite `>500 kB` warning remains. | T063 |

## Finding Register

| ID | Surface | Priority | Status | Evidence | Candidate Fix | Mapped Tasks |
|---|---|---|---|---|---|---|
| PERF-PUBLIC-001 | Public site | P1 | Implemented | `src/router.tsx` eagerly imported all public pages; public build had one 777.57 kB JS chunk. | Implemented route-level code splitting in `src/router.tsx` without changing route paths. | T026-T032, T038-T039 |
| PERF-PUBLIC-002 | Public site | P1 | Implemented | `ProjectDetailsPage` lightbox code was included through eager route import. | `ProjectDetailsPage` is now a separate route chunk; no extra lightbox change was needed in US2. | T026, T030-T032, T038-T039 |
| PERF-PUBLIC-003 | Public site | P1 | Implemented | `VideoBackground` mapped all hero video sources; local videos are 1.2 MB, 6.4 MB, and 2.8 MB. | `VideoBackground` now renders the active source and warms the next local video only. | T027, T036-T037, T039 |
| PERF-PUBLIC-004 | Public/shared UI | P1 | Implemented | Public and shared `Image` components did not set default `loading` or `decoding`. | `Image` defaults to lazy/async with caller overrides; PageHero call sites are explicitly eager. | T028, T033-T035, T038-T039 |
| PERF-DASH-001 | Dashboard | P2 | Implemented | `apps/dashboard/src/App.tsx` eagerly imported every dashboard page; dashboard build had one 604.25 kB JS chunk. | Implemented dashboard route-level code splitting without route changes. | T040, T044-T046, T049-T052 |
| PERF-DASH-002 | Dashboard | P2 | Implemented | Dashboard build warned `apps/dashboard/src/lib/api.ts` dynamic import could not create a split chunk due static imports elsewhere. | Replaced ineffective Services upload dynamic imports with normal `uploadImage` import. | T041, T047-T049, T052 |
| PERF-DASH-003 | Dashboard | P2 | Implemented | `Applications.tsx` filtered in render and mapped all filtered rows. | Implemented memoized search normalization and filtered row calculation only; no pagination/cache/virtualization change. | T053-T061 |

## Deferred Items

| Item | Status | Reason | Future Validation |
|---|---|---|---|
| API pagination/cache | Deferred | Would alter or expand API request/response assumptions. | Revisit with explicit API contract tasks and compatibility tests. |
| Media processing pipeline | Deferred | Requires asset/content workflow changes beyond this package. | Revisit with content pipeline plan and media acceptance criteria. |
| Video re-encoding/replacement | Deferred | Changes actual media assets and may need design/content approval. | Revisit after browser/network evidence proves current optimized loading is insufficient. |
| Dashboard-wide virtualization | Deferred | Broad UI architecture change. | Revisit only with large dataset evidence and dashboard UX acceptance criteria. |
| Manual Rollup chunks | Deferred | Route-level lazy loading is the first safer optimization path. | Revisit after route splitting build evidence. |

## US1 Completion Criteria

- Every finding has evidence: Complete.
- Every candidate fix maps to later tasks: Complete.
- Unsupported broad work is deferred: Complete.
- No code/app behavior changed in baseline phase: Complete.

## US2/US3 Completion Criteria

- Public route-level splitting implemented in `src/router.tsx`: Complete.
- Public route paths preserved: Complete.
- Lazy image defaults implemented with critical PageHero eager call sites identified and handled: Complete.
- Hero video loading mounts fewer non-critical sources without re-encoding media: Complete.
- Dashboard route-level splitting implemented in `apps/dashboard/src/App.tsx`: Complete.
- Dashboard route paths preserved: Complete.
- Dashboard dynamic import warning resolved at the Services upload call site: Complete.
- API contracts, SEO outputs, dashboard routes, media files, API pagination, and API cache behavior unchanged: Complete.

## US4/Final Completion Criteria

- PERF-DASH-003 remained the only approved render/filtering implementation target: Complete.
- `apps/dashboard/src/pages/Applications.tsx` uses memoized `search.trim().toLowerCase()` and memoized filtered rows: Complete.
- Existing applications API query and status update behavior preserved: Complete.
- TanStack Query options reviewed in `src/main.tsx` and `apps/dashboard/src/main.tsx`: Complete; cache behavior changes deferred because they may affect API/request assumptions.
- API pagination/cache, media pipeline/re-encoding, and dashboard virtualization remain deferred: Complete.
- Public and dashboard route guardrails preserved: Complete.
- SEO outputs and API contracts unchanged in T053-T072: Complete.
- API tests not run because no API request/response assumptions changed: Complete.
