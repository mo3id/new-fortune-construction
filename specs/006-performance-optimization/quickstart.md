# Quickstart: Performance Optimization Verification

Use this guide during `$speckit implement` for `specs/006-performance-optimization`.

## 1. Baseline Static Checks

```bash
rg -n "React\\.lazy|lazy\\(|Suspense|import\\(|createBrowserRouter|Routes|Route" src apps/dashboard/src
rg -n "<img|<video|loading=|decoding=|preload=|poster=|srcSet|picture|Image" src apps/dashboard/src packages
rg -n "filter\\(|map\\(|sort\\(|reduce\\(|useMemo|useCallback|memo\\(" src apps/dashboard/src
```

Record findings in `performance-inventory.md` before editing code.

## 2. Build Baseline

```bash
npm run build
npm run build --workspace=apps/dashboard
```

Record largest chunks and warnings after each run. Keep the previous and new warning text when comparing.

## 3. Safe Implementation Order

1. Implement only fixes linked to `performance-inventory.md`.
2. Preserve API contracts, dashboard routes, SEO outputs, `Project.category` as string, and Success Stories through Page Content.
3. Prefer public route-level code splitting and media/image loading fixes before broader tuning.
4. Prefer dashboard route-level code splitting and small table/rendering improvements before broad table architecture changes.
5. Defer API pagination/cache and media pipeline changes unless a later task proves a narrow safe fix.

## 4. Required Verification After Fixes

```bash
npm run typecheck
npm run build
npm run build --workspace=apps/dashboard
```

Run `npm run test --workspace=apps/api` only if the implementation changes API request/response assumptions. Otherwise document why API tests were not needed.

## 5. Public Browser Checks

Use local dev server only when browser evidence is required:

```bash
npm run dev
```

Check representative public routes on desktop and mobile:

- `/`
- `/projects`
- `/projects/:id`
- `/services`
- `/about`
- `/hse`
- `/careers`
- `/contact`

For each route record console errors, failed network requests, horizontal scroll, clipped actions, visible media status, and SEO output status.

## 6. Dashboard Browser Checks

Dashboard checks may need API data. Start API only after confirming a local-safe environment according to the existing API guardrails.

```bash
npm run dev:dashboard
```

If API is confirmed local-safe:

```bash
npm run dev:api
```

Check dashboard routes without changing route names:

- `/login`
- `/`
- `/projects`
- `/project-categories`
- `/applications`
- `/messages`
- `/jobs`
- `/team`
- `/partners`
- `/services`
- `/settings`
- `/content`

Record console errors, failed network requests, horizontal scroll, table/list behavior, form/modal usability, and clipped actions. If API safety cannot be confirmed, mark API-dependent dashboard evidence as blocked and complete static/build verification only.

## 7. Final Documentation

Update:

- `performance-inventory.md`
- `performance-findings.md`
- `performance-browser-verification.md`
- `evidence/`
- `quickstart.md`
- `tasks.md`

Final notes must include remaining chunk warnings, deferred API pagination/cache work, deferred media pipeline work, and the reason API tests were or were not run.

## Phase 1/2/US1 Verification Log

**Scope**: T001-T025 only  
**Captured**: 2026-07-17 23:15 Africa/Cairo  
**Runtime policy**: No API runtime, dashboard runtime, public dev server, or browser runtime was started. No selected task required runtime browser evidence.

### Spec Kit Hooks

| Hook | Status | Notes |
|---|---|---|
| `before_implement` optional git commit hook | Not executed | User requested scoped implementation only; no commit requested. |
| `after_implement` optional git commit hook | Not executed | User requested scoped implementation only; no commit requested. |

### Checklist Gate

| Checklist | Total | Completed | Incomplete | Status |
|---|---:|---:|---:|---|
| `checklists/requirements.md` | 16 | 16 | 0 | PASS |

### Command Results

| Task | Command | Result | Evidence |
|---|---|---|---|
| T007/T015 | `npm run build` | Passed | Public build transformed 2196 modules; main JS `dist/assets/index-DdRhj52A.js` 777.57 kB / 228.64 kB gzip; Vite `>500 kB` chunk warning present. |
| T008/T016 | `npm run build --workspace=apps/dashboard` | Passed | Dashboard build transformed 2001 modules; main JS `apps/dashboard/dist/assets/index-BwtGy0ec.js` 604.25 kB / 178.34 kB gzip; Vite chunk warning and `apps/dashboard/src/lib/api.ts` dynamic import warning present. |
| T009/T021 | `npm run typecheck` | Passed | Root `tsc --noEmit` completed with exit code 0. |

### Static Scan Results

| Task | Scan | Result |
|---|---|---|
| T010 | Route import scan | Confirmed eager public routes in `src/router.tsx`, eager dashboard routes in `apps/dashboard/src/App.tsx`, and dynamic import usage in `apps/dashboard/src/pages/Services.tsx`. |
| T011 | Media/image scan | Confirmed hero `<video>` rendering in `src/components/hero/VideoBackground.tsx`, no default `loading`/`decoding` in `src/components/ui/Image.tsx` and `packages/shared-ui/src/components/ui/image.tsx`, and local video assets over 500 kB. |
| T012 | Render/filter scan | Confirmed `apps/dashboard/src/pages/Applications.tsx` filters during render and maps all filtered rows. |

### Guardrail Checklist

| Guardrail | Status | Evidence |
|---|---|---|
| API contracts unchanged | Passed | No application API files changed in T001-T025. |
| SEO outputs unchanged | Passed | No SEO files changed in T001-T025; public build still emits `dist/sitemap.xml` and `dist/robots.txt`. |
| Dashboard routes unchanged | Passed | `apps/dashboard/src/App.tsx` was read only. |
| Public routes unchanged | Passed | `src/router.tsx` was read only. |
| `Project.category` string contract preserved | Passed | No data contract files changed. |
| Success Stories via Page Content preserved | Passed | No dashboard/content routes changed. |
| Media re-encoding avoided | Passed | No media files changed. |
| API pagination/cache avoided | Passed | No API implementation changes made; documented as deferred. |

### Evidence Artifacts

- `specs/006-performance-optimization/performance-inventory.md`
- `specs/006-performance-optimization/performance-findings.md`
- `specs/006-performance-optimization/performance-browser-verification.md`
- `specs/006-performance-optimization/evidence/README.md`
- `specs/006-performance-optimization/evidence/static-scan-summary.md`

## US2/US3 Verification Log

**Scope**: T026-T052 only  
**Captured**: 2026-07-17 23:23 Africa/Cairo  
**Runtime policy**: No API runtime, dashboard dev server, public dev server, or browser runtime was started. US2/US3 were verified with typecheck, production builds, and static route preservation checks.

### Pre-Change Baselines

| Task | Command | Result | Evidence |
|---|---|---|---|
| T029 | `npm run build` | Passed | Before US2: public main JS `dist/assets/index-DdRhj52A.js` 777.57 kB / 228.64 kB gzip; Vite `>500 kB` warning present. |
| T042 | `npm run build --workspace=apps/dashboard` | Passed | Before US3: dashboard main JS `apps/dashboard/dist/assets/index-BwtGy0ec.js` 604.25 kB / 178.34 kB gzip; Vite chunk warning and `apps/dashboard/src/lib/api.ts` dynamic import warning present. |

### Implementation Notes

| Task | Result |
|---|---|
| T030-T032 | `src/router.tsx` is the selected T031 path. Public route pages are lazy-loaded with `React.lazy` and `Suspense`; route paths remain `/`, `/about`, `/projects`, `/projects/:id`, `/services`, `/hse`, `/careers`, and `/contact`. No layout file was needed. |
| T033-T034 | `src/components/ui/Image.tsx` and `packages/shared-ui/src/components/ui/image.tsx` now default to `loading="lazy"` and `decoding="async"` with caller override support. |
| T035 | Actual critical above-the-fold call sites identified before editing: `src/components/ui/PageHero.tsx` and `packages/shared-ui/src/components/ui/page-hero.tsx`. Both now set `loading="eager"`. |
| T036-T037 | `src/components/hero/VideoBackground.tsx` now renders the active source and warms the next local video only; no media files were changed or re-encoded. |
| T044-T046 | `apps/dashboard/src/App.tsx` lazy-loads dashboard route pages with existing route names preserved. |
| T047-T048 | The dynamic import warning was fixed at the actual call site, `apps/dashboard/src/pages/Services.tsx`, by using the existing `uploadImage` export from `apps/dashboard/src/lib/api.ts`. No API base URL, payload, response shape, or auth behavior changed. |

### Post-Change Results

| Task | Command | Result | Evidence |
|---|---|---|---|
| US2/US3 | `npm run typecheck` | Passed | Root `tsc --noEmit` completed successfully after changes. |
| T038 | `npm run build` | Passed | After US2: public main JS `dist/assets/index-BgUZ1HzS.js` 550.25 kB / 171.93 kB gzip. Residual Vite `>500 kB` warning remains. |
| T049 | `npm run build --workspace=apps/dashboard` | Passed | After US3: dashboard main JS `apps/dashboard/dist/assets/index-DJfP6XPu.js` 490.36 kB / 156.61 kB gzip. Dashboard chunk warning resolved; dynamic import warning resolved. |

### Guardrail Status

| Guardrail | Status |
|---|---|
| API contracts unchanged | Passed |
| SEO outputs unchanged | Passed |
| Public routes unchanged | Passed |
| Dashboard routes unchanged | Passed |
| Media re-encoding avoided | Passed |
| API pagination/cache avoided | Passed |
| Browser/API runtime not started | Passed |

## US4/Final Verification Log

**Scope**: T053-T072 only  
**Captured**: 2026-07-17 23:42 Africa/Cairo  
**Runtime policy**: No API runtime, dashboard dev server, public dev server, or browser runtime was started. US4 was verified with static review and production builds because the only implementation was pure client-side memoized filtering/search normalization.

### US4 Implementation Notes

| Task | Result |
|---|---|
| T053-T055 | Confirmed PERF-DASH-003 remained the only approved dashboard render/filtering target. Pre-change behavior used the existing applications query with optional `status` param, render-time text filtering, and existing status/delete mutations. |
| T056 | `apps/dashboard/src/pages/Applications.tsx` now memoizes normalized search text and the filtered application rows with `useMemo`. |
| T057 | Existing applications API query, `filterStatus` behavior, status update mutation, delete mutation, and row rendering contract were preserved. |
| T058 | Reviewed TanStack Query setup. `src/main.tsx` still uses default `new QueryClient()`. `apps/dashboard/src/main.tsx` still uses `retry: 1` and `staleTime: 30_000`. No changes were made because cache behavior could affect API/request assumptions. |
| T059 | API pagination/cache remains deferred because it needs explicit API contract and compatibility work. |
| T061 | Focused browser check was not run because runtime evidence was not needed for the pure memoization change; dashboard build passed. |

### Final Command Results

| Task | Command | Result | Evidence |
|---|---|---|---|
| T062 | `npm run typecheck` | Passed | Root `tsc --noEmit` completed with exit code 0. |
| T063 | `npm run build` | Passed | Public main JS `dist/assets/index-BgUZ1HzS.js` 550.25 kB / 171.93 kB gzip. Residual public Vite `>500 kB` warning remains. |
| T060/T064 | `npm run build --workspace=apps/dashboard` | Passed | Dashboard main JS `apps/dashboard/dist/assets/index-NxTvhuHw.js` 490.36 kB / 156.60 kB gzip; Applications chunk `Applications-0DRV4G1E.js` 9.58 kB / 2.74 kB gzip. No dashboard chunk warning or dynamic import warning. |

### Final Guardrail Status

| Guardrail | Status | Evidence |
|---|---|---|
| Public routes unchanged | Passed | `src/router.tsx` preserves `/`, `/about`, `/projects`, `/projects/:id`, `/services`, `/hse`, `/careers`, and `/contact`. |
| Dashboard routes unchanged | Passed | `apps/dashboard/src/App.tsx` preserves `/login`, `/`, `/projects`, `/project-categories`, `/applications`, `/messages`, `/jobs`, `/team`, `/partners`, `/services`, `/settings`, and `/content`. |
| SEO outputs unchanged | Passed | No SEO implementation files or static SEO output files were changed in T053-T072; public build still emits `dist/sitemap.xml` and `dist/robots.txt`. |
| API contracts unchanged | Passed | No API implementation files, API client files, request payloads, response shapes, auth behavior, or API base URL assumptions changed in T053-T072. |
| API tests | Not run | Not needed because no API request/response assumptions changed. |
| API pagination/cache avoided | Passed | Deferred for explicit API contract work. |
| Media re-encoding/pipeline avoided | Passed | Deferred; no media files changed. |
| Dashboard virtualization avoided | Passed | Deferred as broader table architecture work. |
