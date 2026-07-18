# Implementation Plan: Public SEO Improvements

**Branch**: `[003-api-integration-repair]` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/005-public-seo-improvements/spec.md`

**Note**: The current git branch does not match this feature directory. Per project Spec Kit practice, the explicit feature directory `specs/005-public-seo-improvements` and `.specify/feature.json` are authoritative.

## Summary

Improve search and social discoverability for the public Fortune Construction Vite app without changing API contracts, dashboard behavior, or visible UI flows. The plan starts with a static inventory of existing public routes and current SEO output, then adds a safe page metadata layer, configurable canonical base URL, Open Graph/social metadata, static `sitemap.xml` and `robots.txt`, and construction-company structured data. Verification combines static file inspection, browser metadata checks, structured data parsing, public route smoke checks, and console/network regression evidence.

## Technical Context

**Language/Version**: TypeScript with React 18 and Vite  
**Primary Dependencies**: React Router v7, TanStack Query, existing shared UI alias, browser DOM APIs for document head management; no new runtime SEO dependency planned  
**Storage**: Static public files in `public/`; route metadata definitions in public app source; no database or API schema changes  
**Testing**: Static source checks, metadata/browser verification script, sitemap/robots inspection, structured data JSON parsing, `npm run typecheck`, `npm run build`  
**Target Platform**: Public Vite website in modern browsers and search/social crawlers capable of reading static files and rendered head metadata  
**Project Type**: Monorepo web application with public Vite app, dashboard app, shared UI, and existing Express API  
**Performance Goals**: Metadata updates must not add visible UI work, extra network requests, or measurable route interaction delay; production build must still pass with only pre-existing chunk warnings documented if unchanged  
**Constraints**: Do not change API endpoints, request/response shapes, auth behavior, dashboard routes, dashboard management flows, or public UI contracts; do not use localhost as production canonical URL; do not include private/dashboard routes in sitemap or robots discovery  
**Scale/Scope**: Public routes `/`, `/about`, `/projects`, `/projects/:id`, `/services`, `/hse`, `/careers`, `/contact`; static discovery files; browser checks on representative desktop/mobile routes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| Component-First UI | SEO head management must be a reusable public-app utility/component rather than duplicated `document` manipulation in every page. | Pass |
| API-Contract Driven | SEO work must not change API endpoints, payloads, response shapes, dashboard contracts, auth, or `Project.category` behavior. | Pass |
| Type Safety | Metadata profiles, canonical URL helpers, and structured data builders must be typed; no new `any` without documented justification. | Pass |
| Test-First | Static/browser SEO verification artifacts are planned before implementation tasks and must run before final acceptance. | Pass |
| Performance & UX Consistency | SEO changes must not add UI layout shifts, new network calls, or visual redesign; build warnings are documented if unchanged. | Pass |
| Monorepo Discipline | Public SEO source belongs under `src/` and static crawler files under `public/`; dashboard and API remain untouched except for verification. | Pass |

No constitution violations are required.

## Project Structure

### Documentation (this feature)

```text
specs/005-public-seo-improvements/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── seo-inventory.md
├── contracts/
│   └── seo-verification-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
public/
├── Logo-new-01.png
├── robots.txt                 # planned static crawler policy
└── sitemap.xml                # planned static public route discovery

src/
├── router.tsx                 # public route registration, including planned /services
├── App.tsx                    # home page metadata usage
├── layouts/MainLayout.tsx     # shared public layout; no SEO side effects planned here unless route-safe
├── lib/
│   ├── constants.ts           # existing site constants
│   ├── seo.ts                 # planned metadata profiles, base URL helper, structured data builders
│   └── apiClient.ts           # verification only; no contract change planned
├── components/
│   ├── SeoHead.tsx            # planned reusable head/canonical/social/JSON-LD updater
│   └── Services.tsx           # existing services content reused for /services
└── pages/
    ├── AboutPage.tsx
    ├── CareersPage.tsx
    ├── ContactPage.tsx
    ├── HSEPage.tsx
    ├── ProjectDetailsPage.tsx
    ├── ProjectsPage.tsx
    └── ServicesPage.tsx       # planned thin route page reusing existing services content
```

**Structure Decision**: Keep SEO behavior inside the public Vite app. Add a typed metadata utility and a reusable `SeoHead` component rather than a new dependency. Add `/services` only as a thin, indexable public route because the current services content exists only as a home-section anchor and the specification requires services page indexability. Keep dashboard and API source out of scope.

## Current Route & SEO Inventory

| Surface | Current Route / File | Current SEO State | Planned SEO Need |
|---------|----------------------|-------------------|------------------|
| Home | `/`, `src/App.tsx` | Static `index.html` title/description only; no route-specific canonical/social/JSON-LD | Page-specific metadata, canonical, social preview, organization structured data |
| About | `/about`, `src/pages/AboutPage.tsx` | No route-specific metadata detected | Page-specific title/description/canonical/social |
| Projects list | `/projects`, `src/pages/ProjectsPage.tsx` | No route-specific metadata detected | Indexable portfolio metadata and project collection social preview |
| Project detail | `/projects/:id`, `src/pages/ProjectDetailsPage.tsx` | No project-specific metadata detected | Project-specific title/description/canonical/social using API/local project data with fallbacks |
| Services | Existing `src/components/Services.tsx`, footer links to `/#services`; no `/services` route | No standalone indexable page | Add `/services` route that reuses existing services content and emits page metadata |
| HSE | `/hse`, `src/pages/HSEPage.tsx` | No route-specific metadata detected | HSE-specific metadata and structured context if appropriate |
| Careers | `/careers`, `src/pages/CareersPage.tsx` | No route-specific metadata detected | Careers-specific metadata and indexability |
| Contact | `/contact`, `src/pages/ContactPage.tsx` | No route-specific metadata detected | Contact metadata and contact/business structured data |
| Discovery files | `public/` | No `sitemap.xml` or `robots.txt` found | Add static sitemap and crawler policy excluding private routes |

## Phase 0: Research & Decisions

1. Document current public SEO baseline and route inventory in `seo-inventory.md`.
2. Choose head management pattern that works with current Vite SPA without adding a dependency.
3. Choose configurable canonical base URL strategy that never emits localhost for production-facing canonical URLs.
4. Choose sitemap and robots strategy suitable for a Vite static public app.
5. Choose structured data shape for a construction business using only known/visible content.
6. Define verification approach for metadata, social metadata, canonical URLs, sitemap/robots, structured data, and console/network regression checks.

## Phase 1: Design & Contracts

1. Define data entities in `data-model.md`: SEO Page Profile, Canonical URL, Social Preview Profile, Crawler Discovery Files, Structured Business Data, SEO Verification Record.
2. Define `contracts/seo-verification-contract.md` for required route/file outputs and pass/fail evidence.
3. Define `quickstart.md` with static checks, browser checks, build/typecheck commands, and expected evidence locations.
4. Update `AGENTS.md` so future Spec Kit work reads this plan as the current plan.

## Implementation Strategy Preview

1. Start with static inventory and tests/checks for current metadata gaps.
2. Add typed SEO config and base URL helper under `src/lib/seo.ts`.
3. Add `SeoHead` and apply it to public pages with safe fallback metadata.
4. Add a thin `/services` public page if tasks confirm no broad redesign is needed; update existing service links only if necessary for indexability.
5. Add `public/sitemap.xml` and `public/robots.txt` using a configurable production base URL documented in quickstart.
6. Add JSON-LD structured data for organization/business on home and contact/service context where accurate.
7. Run metadata/browser verification, typecheck, public build, and document any unchanged warnings.

## Verification Strategy

- Static source checks:
  - Confirm all public routes have an SEO Page Profile.
  - Confirm canonical base URL helper rejects localhost for production canonical output.
  - Confirm sitemap includes public routes and excludes dashboard/login/admin/private routes.
  - Confirm robots points to sitemap and excludes private/dashboard surfaces.
- Browser checks:
  - Inspect rendered `document.title`, meta description, canonical link, OG/Twitter metadata, robots meta, and JSON-LD on `/`, `/projects`, `/projects/:id`, `/services`, `/contact`, and representative secondary pages.
  - Record console errors and failed network requests for checked routes.
  - Confirm no visible UI regression, no page-level horizontal scroll, and no clipped primary action on checked routes.
- Build checks:
  - `npm run typecheck`
  - `npm run build`
  - API tests only if implementation unexpectedly changes API assumptions; expected result is "not needed" because SEO work is public presentation/static-file only.

## Post-Design Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Component-First UI | Pass | Planned `SeoHead` and typed SEO config centralize route metadata. |
| API-Contract Driven | Pass | Plan explicitly avoids API and dashboard contract changes. |
| Type Safety | Pass | SEO profiles and structured data builders are typed. |
| Test-First | Pass | Verification contract and quickstart precede tasks/implementation. |
| Performance & UX Consistency | Pass | SEO changes avoid added network requests and broad UI redesign. |
| Monorepo Discipline | Pass | Source and static files stay in public app boundaries. |

## Complexity Tracking

No constitution violations or complexity exceptions are required.
