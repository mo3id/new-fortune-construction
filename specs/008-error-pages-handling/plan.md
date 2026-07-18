# Implementation Plan: Error Pages and Global Error Handling

**Branch**: `[008-error-pages-handling]` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-error-pages-handling/spec.md`

## Summary

Implement production-ready error pages and global error handling across the Fortune Construction public site and dashboard without changing API contracts, core public/dashboard route meanings, or normal-page SEO output. The implementation adds public and dashboard `NotFoundPage` and `AppErrorPage` experiences, mounts app-level `ErrorBoundary` components in both entrypoints, replaces dashboard silent wildcard redirect with explicit not-found handling, adds route-level public error/not-found handling, classifies runtime/chunk/load failures, and separates network/API unavailable states from inline validation errors. Verification covers typecheck, public build, dashboard build, and browser checks for 404, runtime/chunk errors, and network unavailable states on desktop and mobile.

## Technical Context

**Language/Version**: TypeScript with React 18 and Vite 5  
**Primary Dependencies**: React Router (`createBrowserRouter` public app, `BrowserRouter`/`Routes` dashboard), TanStack Query, fetch, Axios, sonner/react-hot-toast, lucide-react, framer-motion, shared UI package, existing SEO helpers  
**Storage**: N/A; this is frontend error-state behavior only  
**Testing**: `npm run typecheck`; `npm run build`; `npm run build --workspace=apps/dashboard`; browser checks against local public and dashboard dev/preview targets for desktop/mobile 404, runtime/chunk error, and network/API unavailable states  
**Target Platform**: Public Vite SPA and dashboard Vite SPA in browser environments  
**Project Type**: Monorepo web application with public frontend under `src/`, dashboard frontend under `apps/dashboard/src/`, shared UI package, and unchanged Express API  
**Performance Goals**: Preserve lazy route loading; avoid broad bundle/runtime regressions; render fallback/error UI immediately when failure states occur; preserve normal page FCP expectations  
**Constraints**: Do not change API endpoints, request/response shapes, auth behavior, public route meanings, dashboard route meanings, or normal-page SEO outputs. Only add safe metadata for 404/error pages. Production error UI must not reveal stack traces, secrets, raw payloads, environment values, internal hostnames, or private route details. DEV diagnostics must be gated to development mode only. Runtime/API services must not be started during planning.  
**Scale/Scope**: Public app shell, public route tree, public data-dependent pages, dashboard app shell, dashboard route tree, dashboard data-dependent pages, frontend API client classification, and verification documentation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Component-First UI**: Pass. `NotFoundPage`, `AppErrorPage`, `ErrorBoundary`, and data-unavailable states are planned as reusable, self-contained components per surface.
- **API-Contract Driven**: Pass. The package is frontend-only and explicitly preserves API endpoints, payloads, auth behavior, and backend routes.
- **Type Safety (NON-NEGOTIABLE)**: Pass. Error classification helpers and component props must be typed; avoid `any` unless documented for third-party error interop.
- **Test-First**: Pass with frontend scope note. Browser verification targets and command checks are defined before implementation. API endpoint tests are not required because backend contracts are unchanged.
- **Performance & UX Consistency**: Pass. Lazy route loading remains, fallback states use existing visual language, and mobile/desktop layout checks are required.
- **Monorepo Discipline**: Pass. Public work stays under `src/`, dashboard work under `apps/dashboard/src/`, and shared package changes are avoided unless a reusable primitive is clearly warranted.

## Static Inventory

### Public app

- `src/main.tsx` currently creates a `QueryClient`, wraps `RouterProvider` with `QueryClientProvider`, and does not mount `ErrorBoundary`.
- `src/router.tsx` currently uses `createBrowserRouter` with lazy route elements under `MainLayout`, but has no route-level `errorElement`, no catch-all not-found child, and no explicit chunk/load error recovery beyond `Suspense` loading UI.
- `src/components/ErrorBoundary.tsx` exists and gates `error.message` behind `import.meta.env.DEV`, but it is not mounted globally and does not yet delegate to a surface-specific `AppErrorPage`.
- `src/lib/apiClient.ts` wraps fetch, converts fetch network `TypeError` into a user-facing connection error, and can toast errors. Query consumers need a clearer classification path for network/API unavailable UI.
- Public data-dependent pages/components include `src/pages/ProjectsPage.tsx`, `src/pages/ProjectDetailsPage.tsx`, `src/pages/AboutPage.tsx`, `src/pages/CareersPage.tsx`, `src/pages/ContactPage.tsx`, `src/App.tsx`, and multiple content/footer sections. Some pages use static fallback content; `ProjectDetailsPage` currently risks treating API failure and true not-found similarly.
- SEO is managed by `src/components/SeoHead.tsx` and `src/lib/seo.ts`. Existing normal-page profiles must remain unchanged; add only safe 404/error profiles or metadata.

### Dashboard app

- `apps/dashboard/src/main.tsx` currently mounts `QueryClientProvider`, `BrowserRouter`, `App`, and `Toaster`; it does not mount a dashboard `ErrorBoundary`.
- `apps/dashboard/src/App.tsx` currently uses `Routes`/`Route` with lazy route elements. `PrivateRoute` correctly redirects unauthenticated users to `/login`, but the final `path="*"` silently redirects to `/` and must become explicit not-found handling.
- Dashboard has no existing `ErrorBoundary` component.
- `apps/dashboard/src/lib/api.ts` uses Axios with auth token injection and 401 redirect behavior. This must remain unchanged while adding network/API unavailable classification.
- Dashboard data-dependent pages include `Overview`, `Projects`, `ProjectCategories`, `Applications`, `Messages`, `Jobs`, `Team`, `Partners`, `Services`, `Settings`, and `PageContent`. These generally handle loading and mutation toasts, but page-level network unavailable states are inconsistent.
- `apps/dashboard/src/components/Layout.tsx` fetches stats for layout/sidebar context and should degrade safely when the API is unavailable without blocking navigation.

### Current gaps

- Public unknown routes do not have an explicit 404 page.
- Dashboard unknown routes are silently redirected to `/`.
- Public `ErrorBoundary` exists but is not mounted; dashboard has none.
- Runtime, route, and lazy chunk/load failures need safe recovery states.
- Network/API unavailable errors need classification and page/section UI separate from validation errors.
- Production-safe messaging and DEV-only diagnostics need a clear, cross-surface contract.

## Project Structure

### Documentation (this feature)

```text
specs/008-error-pages-handling/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── tasks.md
├── contracts/
│   └── error-handling-ui-contract.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
src/
├── main.tsx                         # mount public ErrorBoundary around RouterProvider
├── router.tsx                       # add public route error/not-found handling
├── components/
│   ├── ErrorBoundary.tsx            # adapt to render public AppErrorPage safely
│   ├── SeoHead.tsx                  # reuse for error-page metadata
│   └── errors/
│       └── DataUnavailableState.tsx # planned public API unavailable state
├── pages/
│   ├── NotFoundPage.tsx             # planned public 404 page
│   ├── AppErrorPage.tsx             # planned public runtime/route/chunk fallback
│   ├── ProjectsPage.tsx             # representative network unavailable handling
│   └── ProjectDetailsPage.tsx       # separate not-found from network/API unavailable
└── lib/
    ├── apiClient.ts                 # preserve API contract, classify unavailable errors
    ├── errorHandling.ts             # planned public error classifier helpers
    └── seo.ts                       # add safe 404/error metadata only

apps/dashboard/src/
├── main.tsx                         # mount dashboard ErrorBoundary
├── App.tsx                          # replace wildcard redirect, wrap lazy route errors
├── components/
│   ├── ErrorBoundary.tsx            # planned dashboard global boundary
│   ├── Layout.tsx                   # safe layout stats degradation
│   └── errors/
│       └── DataUnavailableState.tsx # planned dashboard API unavailable state
├── pages/
│   ├── NotFoundPage.tsx             # planned dashboard 404 page
│   ├── AppErrorPage.tsx             # planned dashboard runtime/route/chunk fallback
│   ├── Overview.tsx                 # representative network unavailable handling
│   └── Projects.tsx                 # representative network unavailable handling
└── lib/
    ├── api.ts                       # preserve auth/API behavior, classify unavailable errors
    └── errorHandling.ts             # planned dashboard error classifier helpers
```

**Structure Decision**: Keep implementation inside existing frontend app boundaries. Public and dashboard receive surface-specific UI because copy, layout, and auth behavior differ. API source is reviewed only to ensure it remains unchanged.

## Phase 0: Research Decisions

See [research.md](./research.md). The implementation follows these decisions:

- Use layered error handling: app-level `ErrorBoundary` plus route-level error/not-found handling where supported.
- Preserve dashboard auth redirect to `/login`, but replace wildcard redirect to `/` with dashboard `NotFoundPage`.
- Classify network/API unavailable errors separately from validation errors.
- Treat runtime, route, and chunk/load failures as general app errors with reload/retry recovery.
- Add only safe 404/error metadata; preserve normal-page SEO outputs.
- Use safe simulation/browser verification targets rather than production-visible crash routes.

## Phase 1: Design and Contracts

- [data-model.md](./data-model.md) defines frontend state concepts: Error Surface, Not Found State, General Error State, Data Unavailable State, Validation Error State, and Verification Evidence.
- [contracts/error-handling-ui-contract.md](./contracts/error-handling-ui-contract.md) defines the public 404, dashboard 404, general error, data-unavailable, and verification contracts.
- [quickstart.md](./quickstart.md) defines static inventory commands, planned implementation order, required build/typecheck commands, and browser verification scenarios.
- [tasks.md](./tasks.md) breaks implementation into 63 tasks with inventory, foundational primitives, five user-story phases, and final safety review.

## Planned Implementation Order

1. Re-run static inventory for public router, dashboard router, existing ErrorBoundary, and network/API error states.
2. Confirm browser verification targets for 404, runtime/chunk error, network/API unavailable, validation separation, production redaction, and DEV diagnostics.
3. Add typed error classifiers and data-unavailable UI primitives for public and dashboard.
4. Add public safe 404/error metadata without changing normal SEO profiles.
5. Add public `NotFoundPage`, `AppErrorPage`, route-level error/not-found handling, and mount public `ErrorBoundary` in `src/main.tsx`.
6. Add dashboard `NotFoundPage`, `AppErrorPage`, dashboard `ErrorBoundary`, mount it in `apps/dashboard/src/main.tsx`, and replace the silent wildcard redirect in `apps/dashboard/src/App.tsx`.
7. Add representative network/API unavailable handling to public projects/project detail and dashboard overview/projects while preserving inline validation behavior.
8. Add DEV-only technical details and production-safe redaction checks.
9. Run typecheck, public build, dashboard build, and desktop/mobile browser checks.

## Planned Verification

- `npm run typecheck`
- `npm run build`
- `npm run build --workspace=apps/dashboard`
- Browser check public unknown route 404 on desktop and mobile.
- Browser check dashboard unknown route 404 on desktop and mobile.
- Browser check public runtime/chunk/load error fallback on desktop and mobile using safe simulation.
- Browser check dashboard runtime/chunk/load error fallback on desktop and mobile using safe simulation.
- Browser check representative public network/API unavailable page or section.
- Browser check representative dashboard network/API unavailable page or section.
- Browser check public and dashboard invalid forms to confirm validation errors remain inline.
- Inspect production-mode error UI for absence of stack traces, secrets, raw payloads, internal hostnames, private route details, and environment values.
- Inspect DEV-mode error UI for useful technical diagnostics.

## Post-Design Constitution Check

- **Component-First UI**: Pass. Planned pages/components are self-contained and surface-specific.
- **API-Contract Driven**: Pass. API contracts and backend routes are preserved; changes are frontend presentation/classification only.
- **Type Safety**: Pass. New helpers and components are typed and verified by `npm run typecheck`.
- **Test-First**: Pass. Browser verification targets and command checks are defined before implementation completion.
- **Performance & UX Consistency**: Pass. Lazy loading is preserved; error UI is checked on desktop/mobile and uses existing visual patterns.
- **Monorepo Discipline**: Pass. Work stays in `src/`, `apps/dashboard/src/`, and feature docs; API is not modified except final no-change review.

## Complexity Tracking

No constitution violations require justification.
