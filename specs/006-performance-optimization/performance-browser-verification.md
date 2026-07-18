# Performance Browser Verification

**Feature**: `006-performance-optimization`  
**Current Scope**: T001-T072  
**Status**: Browser runtime not started. US2/US3/US4/Final Phase were verified with typecheck, production builds, and static route preservation checks. Runtime browser checks remain deferred because API/dashboard runtime was not needed for build-level performance verification or the focused pure client-side Applications memoization.

## Runtime Guardrail

- `npm run dev`: Not run.
- `npm run dev:dashboard`: Not run.
- `npm run dev:api`: Not run.
- API local-safe environment: Not evaluated because API runtime was not needed.

## Public Browser Targets

| Route | Desktop | Mobile | Console Errors | Failed Requests | Horizontal Scroll | Clipped Actions | SEO Output | Notes |
|---|---|---|---|---|---|---|---|---|
| `/` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build verified | Route preserved; public build passed. |
| `/projects` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build verified | Route preserved; public build passed. |
| `/projects/:id` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build verified | Route preserved; public build passed. |
| `/services` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build verified | Route preserved; public build passed. |
| `/about` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build verified | Route preserved; public build passed. |
| `/hse` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build verified | Route preserved; public build passed. |
| `/careers` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build verified | Route preserved; public build passed. |
| `/contact` | Not run | Not run | Not run | Not run | Not run | Not run | Static/build verified | Route preserved; public build passed. |

## Dashboard Browser Targets

| Route | Desktop | Mobile | Console Errors | Failed Requests | Horizontal Scroll | Clipped Actions | API Safety | Notes |
|---|---|---|---|---|---|---|---|---|
| `/login` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved; dashboard build passed. |
| `/` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved; dashboard build passed. |
| `/projects` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved; dashboard build passed. |
| `/project-categories` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved; dashboard build passed. |
| `/applications` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved; dashboard build passed after memoized filtering/search normalization. |
| `/messages` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved; dashboard build passed. |
| `/jobs` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved; dashboard build passed. |
| `/team` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved; dashboard build passed. |
| `/partners` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved; dashboard build passed. |
| `/services` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved; dashboard build passed. |
| `/settings` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved; dashboard build passed. |
| `/content` | Not run | Not run | Not run | Not run | Not run | Not run | Not needed | Route preserved; dashboard build passed. |

## Evidence Rules For Later Phases

- Public checks must record metadata/canonical/social/sitemap/robots/structured-data status when route/media changes touch public routing.
- Dashboard checks must preserve route names and must not start API before local-safe API environment confirmation.
- Console errors, failed network requests, horizontal scroll, and clipped actions must be recorded for every checked route.

## US4/Final Runtime Decision

- Focused Applications browser check was not run because T056 changed only local memoization/search normalization in `apps/dashboard/src/pages/Applications.tsx`.
- API runtime was not started because the existing applications query, status update mutation, response assumptions, and API contracts were unchanged.
- Final evidence is static/build based: `npm run typecheck`, `npm run build`, and `npm run build --workspace=apps/dashboard` all passed.
- Console/network/horizontal-scroll/clipped-action evidence remains `Not run` for this package's final pass because no dev server/browser session was required by the completed changes.
