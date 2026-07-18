# Implementation Plan: UI/UX Responsive Improvements

**Branch**: `[003-api-integration-repair]` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/004-ui-ux-responsive/spec.md`

**Note**: The current git branch does not match the spec directory name. Per project Spec Kit practice, the explicit feature directory `specs/004-ui-ux-responsive` is authoritative for this plan.

## Summary

Deliver a focused UI/UX and responsive improvement package for the public website and dashboard without changing API contracts or adding broad redesigns. The implementation starts with static and browser-based inventory of high-value public and dashboard routes at desktop and mobile sizes, then fixes only confirmed layout, usability, overlap, horizontal scrolling, table/form/modal, and state clarity issues. Verification records screenshots or browser evidence, console errors, failed network requests, and API contract risk findings.

## Technical Context

**Language/Version**: TypeScript with React 18 and Vite  
**Primary Dependencies**: React Router, TanStack Query, react-hook-form, zod validation, Tailwind CSS, shadcn/Radix-style shared UI, framer-motion, lucide icons  
**Storage**: Existing API-backed data only; no new storage planned  
**Testing**: Static source checks, browser visual checks on desktop/mobile viewports, `npm run typecheck`, public site build, dashboard build, API contract regression checks where touched surfaces need proof  
**Target Platform**: Public website and admin dashboard in modern desktop and mobile browsers  
**Project Type**: Monorepo web application with public Vite app, dashboard Vite app, shared UI package, and existing Express API  
**Performance Goals**: Preserve responsive interaction and avoid visible layout shifts; do not worsen existing build warnings; document chunk-size warnings as deferred if unchanged  
**Constraints**: No broad redesign; no API endpoint, request, response, auth, or `Project.category` contract changes; keep Success stories on the accepted Page Content path; avoid page-level horizontal scrolling and visible overlap on checked viewports  
**Scale/Scope**: Representative public routes plus dashboard management routes for projects, categories, services, partners, team, jobs, settings, page content, messages, and applications

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| Component-First UI | Improvements must prefer shared/reusable UI patterns and avoid one-off duplicated fixes where a shared pattern exists. | Pass |
| API-Contract Driven | UI changes must preserve the API contracts stabilized by `specs/003-api-integration-repair`; any touched API-connected workflow needs compatibility verification. | Pass |
| Type Safety | All changes remain TypeScript-safe; no new `any` without documented justification. | Pass |
| Test-First | Visual/static checks and browser verification targets are planned before implementation tasks. | Pass |
| Performance & UX Consistency | Plan focuses on responsive constraints, stable media dimensions, consistent states, and documented chunk warnings. | Pass |
| Monorepo Discipline | Work is scoped to `src/`, `apps/dashboard/src/`, and shared UI under `packages/shared-ui/src/` when shared patterns are appropriate. | Pass |

No constitution violations are required for this package.

## Project Structure

### Documentation (this feature)

```text
specs/004-ui-ux-responsive/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── ui-surface-inventory.md
├── contracts/
│   └── ui-verification-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── router.tsx
├── layouts/MainLayout.tsx
├── pages/
│   ├── AboutPage.tsx
│   ├── CareersPage.tsx
│   ├── ContactPage.tsx
│   ├── HSEPage.tsx
│   ├── ProjectDetailsPage.tsx
│   └── ProjectsPage.tsx
├── components/
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Services.tsx
│   ├── Projects.tsx
│   ├── Partners.tsx
│   ├── ApplicationForm.tsx
│   ├── contact/
│   └── projects/
└── lib/
    ├── apiClient.ts
    └── projectPresentation.ts

apps/dashboard/src/
├── App.tsx
├── components/
│   ├── Layout.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── api.ts
│   └── dashboardSharedUi.tsx
└── pages/
    ├── Applications.tsx
    ├── Jobs.tsx
    ├── Messages.tsx
    ├── PageContent.tsx
    ├── Partners.tsx
    ├── ProjectCategories.tsx
    ├── Projects.tsx
    ├── Services.tsx
    ├── Settings.tsx
    └── Team.tsx

packages/shared-ui/src/
├── components/
│   ├── EmptyState.tsx
│   ├── MediaUploadField.tsx
│   ├── forms/FormInput.tsx
│   ├── modals/GlobalModal.tsx
│   └── ui/
└── lib/
```

**Structure Decision**: Use the existing monorepo surfaces. Start with page-level and shared-component inventory, then implement small responsive and clarity fixes in the closest owning component. Promote fixes to `packages/shared-ui` only when the same issue affects multiple dashboard/public surfaces.

## Phase 0: Research & Inventory

1. Produce a static UI surface inventory for public routes, dashboard routes, and shared UI components.
2. Identify likely high-risk responsive areas from source: fixed dashboard sidebar/header layout, mobile nav, large rounded modals, table overflow regions, sticky action footers, large media grids, upload controls, long text fields, loading/empty/error states.
3. Define desktop and mobile browser verification targets before implementation.
4. Prioritize fixes:
   - P1: blocking overlap, clipped primary controls, page-level horizontal scrolling, unusable forms/modals, dashboard management blockers.
   - P2: inconsistent empty/loading/error states, weak button hierarchy, cramped cards/tables, unstable media placeholders.
   - P3: polish-only visual consistency improvements that do not block usage.

## Phase 1: Design & Contracts

1. Define `Responsive Verification Target`, `UI Finding`, `UI Fix Scope`, and `Deferred UI Follow-Up` entities in `data-model.md`.
2. Define a browser verification contract in `contracts/ui-verification-contract.md` covering routes, viewport sizes, console/network evidence, screenshots, horizontal scrolling, overlap checks, and API contract risk notes.
3. Define `quickstart.md` for expected implementation verification, including dev server startup, browser checks, build/type commands, and evidence capture.
4. Re-check constitution gates after design.

## Browser Verification Targets

Public desktop/mobile targets:
- `/`
- `/projects`
- `/projects/:id` with a representative project
- `/services` coverage through home services section
- `/careers`
- `/contact`
- `/about`

Dashboard desktop/mobile targets:
- `/`
- `/projects`
- `/project-categories`
- `/services`
- `/partners`
- `/team`
- `/jobs`
- `/settings`
- `/content`
- `/messages`
- `/applications`

Viewport baseline:
- Desktop: 1440 x 1000
- Mobile: 390 x 844

## Verification Strategy

- Static source checks first: route coverage, existing API consumers, forms, modals, tables/lists, loading/empty/error states.
- Browser checks after implementation begins: screenshots or equivalent evidence for each target viewport.
- Evidence must record:
  - Console errors
  - Failed network requests
  - Page-level horizontal scrolling
  - Visible overlap or clipped primary controls
  - Modal/table/form usability notes
  - API contract risk, if a changed surface uses API data
- Final commands:
  - `npm run typecheck`
  - `npm run build`
  - `npm run build --workspace=apps/dashboard`
  - API contract test subset only if a UI change touches request/response assumptions

## Post-Design Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Component-First UI | Pass | Shared UI candidates are identified before implementation. |
| API-Contract Driven | Pass | Plan explicitly preserves API contracts and uses 003 integration behavior as baseline. |
| Type Safety | Pass | Verification includes typecheck and scoped changes only. |
| Test-First | Pass | Visual/static/browser checks are planned before fixes. |
| Performance & UX Consistency | Pass | Layout stability, media dimensions, and chunk warnings are covered. |
| Monorepo Discipline | Pass | Source layout follows existing app/package boundaries. |

## Complexity Tracking

No constitution violations or complexity exceptions are required.
