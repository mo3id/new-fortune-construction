# Implementation Plan: Website and Dashboard Performance Optimization

**Branch**: `[006-performance-optimization]` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/006-performance-optimization/spec.md`

## Summary

Create an evidence-first performance optimization package for the public Vite site and dashboard. The implementation will start with a static/build baseline for bundle size, Vite chunk warnings, local media assets, lazy-loading gaps, route-level code splitting opportunities, expensive rendering patterns, dashboard table/filtering risks, and network/asset overhead. Only small fixes backed by that baseline will be implemented later, while API pagination/cache work and media pipeline changes that require broader backend or content workflow changes will be deferred.

The plan preserves API contracts, SEO outputs, dashboard route names, `Project.category` as a string contract, and Success Stories management through Page Content. Browser checks during implementation will verify console errors, failed network requests, horizontal scroll, clipped actions, and SEO regression evidence for representative public and dashboard routes.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18, Vite 5, Node/npm workspaces  
**Primary Dependencies**: React Router (`react-router-dom` v7 public, v6 dashboard), TanStack Query, Framer Motion, lucide-react, shared UI package, axios in dashboard  
**Storage**: N/A for this package; existing API/MongoDB remains compatibility baseline only  
**Testing**: `npm run typecheck`, `npm run build`, `npm run build --workspace=apps/dashboard`, static source checks with `rg`, browser verification when implementation needs UI/runtime evidence; API tests only if API request/response assumptions change  
**Target Platform**: Public Vite SPA and dashboard Vite SPA served in modern browsers  
**Project Type**: Monorepo web application with public site, dashboard, API, and shared UI package  
**Performance Goals**: Reduce or defer avoidable initial JS/media work where verified; reduce Vite chunk warnings where safe; preserve route usability and SEO outputs  
**Constraints**: No API endpoint, payload, response shape, auth, base URL, SEO output, or dashboard route changes; no broad redesign; no dashboard API runtime before local-safe environment confirmation; no production canonical/SEO changes  
**Scale/Scope**: Public routes (`/`, `/about`, `/projects`, `/projects/:id`, `/services`, `/hse`, `/careers`, `/contact`) and dashboard routes (`/`, `/projects`, `/project-categories`, `/applications`, `/messages`, `/jobs`, `/team`, `/partners`, `/services`, `/settings`, `/content`)

## Current Performance Inventory

Baseline evidence is captured in [performance-inventory.md](./performance-inventory.md).

- Public build completed with one JS chunk: `dist/assets/index-DdRhj52A.js` at 777.57 kB minified / 228.64 kB gzip, triggering Vite `>500 kB` chunk warning.
- Dashboard build completed with one JS chunk: `apps/dashboard/dist/assets/index-BwtGy0ec.js` at 604.25 kB minified / 178.34 kB gzip, triggering Vite `>500 kB` chunk warning.
- Dashboard build also reports that `apps/dashboard/src/lib/api.ts` is dynamically imported by `Services.tsx` while statically imported by most dashboard pages, so the dynamic import does not create a split chunk.
- Public `src/router.tsx` eagerly imports every page, including project detail and lightbox-related code.
- Dashboard `apps/dashboard/src/App.tsx` eagerly imports every management page.
- Public hero currently renders all fallback hero videos from `HERO_VIDEOS`: 1.2 MB, 6.4 MB, and 2.8 MB local MP4 files.
- Shared image components currently do not provide default `loading` or `decoding` behavior; callers must opt in manually.
- Dashboard `Applications.tsx` filters data in render and maps all filtered rows; pagination/virtualization would be broader and is deferred unless later evidence proves a small local fix is enough.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Component-First UI**: PASS. Any later UI change must be scoped to reusable route/loading/media primitives or existing shared components; no redesign is planned.
- **API-Contract Driven**: PASS. API contracts are compatibility guardrails only; no endpoint, payload, response, auth, or base URL changes are planned.
- **Type Safety**: PASS. All planned code changes stay in TypeScript; no new `any` use is allowed without documented necessity.
- **Test-First**: PASS. The task phase must put static/build/browser verification before fixes, and API tests are required only if API request/response assumptions change.
- **Performance & UX Consistency**: PASS. This package directly targets lazy media, chunking, and interaction performance while preserving visible UX and SEO.
- **Monorepo Discipline**: PASS. Changes remain in `src/`, `apps/dashboard/src/`, `packages/shared-ui/`, or feature docs; no cross-app rewrites.

No constitution violations are introduced by the plan.

## Project Structure

### Documentation (this feature)

```text
specs/006-performance-optimization/
├── plan.md
├── spec.md
├── performance-inventory.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── performance-verification-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── router.tsx
├── components/
├── pages/
├── hooks/
└── lib/

apps/dashboard/src/
├── App.tsx
├── components/
├── pages/
└── lib/

packages/shared-ui/src/
├── components/
└── lib/

public/
├── assets/videos/
├── sitemap.xml
└── robots.txt
```

**Structure Decision**: Plan and evidence live under `specs/006-performance-optimization`. Future implementation should touch only the public app, dashboard app, or shared UI where the baseline finding proves the need. API source may be read for compatibility but should not be changed in this performance package unless a later task explicitly proves request/response assumptions were altered.

## Phase 0: Research

Research resolves the safe optimization approach:

1. Compare build output and static imports to identify first-pass chunking targets.
2. Identify media and image loading risks that can be reduced without changing content semantics.
3. Identify dashboard table/filtering/rendering risks that can be fixed locally without API pagination or broad table rewrites.
4. Define guardrails for SEO, API contracts, dashboard route names, Project category contract, and Success Stories management path.

**Output**: [research.md](./research.md)

## Phase 1: Design & Contracts

Design artifacts define the feature data records and verification interface:

1. [data-model.md](./data-model.md): performance findings, build baselines, rendering findings, asset findings, verification records, deferred work.
2. [contracts/performance-verification-contract.md](./contracts/performance-verification-contract.md): required evidence and pass/fail criteria for static, build, browser, SEO, API-contract, and dashboard-route checks.
3. [quickstart.md](./quickstart.md): commands and verification order for the later implementation phase.
4. `AGENTS.md`: updated to point to this active plan.

## Phase 2 Preview: Task Generation Scope

The later `$speckit tasks` phase should create tasks in this order:

1. Baseline inventory and verification files before any code edits.
2. Public P1 fixes backed by findings: route-level code splitting, lazy image defaults where safe, hero video loading adjustments, and public browser verification.
3. Dashboard P2 fixes backed by findings: route-level code splitting, remove ineffective dynamic import pattern, small rendering/filtering improvements, and dashboard browser verification.
4. Network/rendering overhead checks and deferred follow-up documentation for API pagination/cache and media pipeline work.
5. Final verification: typecheck, public build, dashboard build, browser evidence, SEO-output guardrails, API-contract review, and deferred follow-ups.

## Complexity Tracking

No constitution violations require complexity exceptions.
