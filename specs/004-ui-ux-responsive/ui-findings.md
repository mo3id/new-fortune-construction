# UI Findings: UI/UX Responsive Improvements

Scope completed so far: T001-T069 complete. Public site US1, dashboard US2 P1 responsive clarity, US3 shared UI consistency, and US4 verification evidence are complete. Final Phase, API contract changes, and broad redesign are out of scope.

## Guardrails

| Guardrail | Status | Evidence |
|---|---|---|
| Do not change API endpoints, request payloads, response shapes, or auth behavior | Active | This pass is documentation/browser verification first. UI fixes, if any, must be scoped to public presentation only. |
| Keep `Project.category` as a string contract | Active | `src/lib/projectPresentation.ts` normalizes `category` to a string and `src/pages/ProjectsPage.tsx` filters with `project.category === category`. |
| Keep Success Stories via Page Content | Active | Success Stories remain accepted through Page Content, specifically `home.successStories`; no dedicated dashboard page is planned in this package. |
| Do not run API unless local-safe API-backed states are required | Active | US1 browser checks can use public fallback states and record API network failures without starting `npm run dev:api`. |

## Static Public Route Checklist

| Route / Surface | Files Reviewed | Static Notes | Status |
|---|---|---|---|
| Public router | `src/router.tsx`, `src/App.tsx` | Routes exist for `/`, `/about`, `/projects`, `/projects/:id`, `/hse`, `/careers`, `/contact`. | Ready for browser check |
| Home | `src/App.tsx`, `src/components/Hero.tsx`, `src/components/Navbar.tsx` | Full-screen hero and fixed navbar are responsive candidates. | Ready for browser check |
| Projects | `src/pages/ProjectsPage.tsx`, `src/components/projects/ProjectPortfolioFilters.tsx`, `src/components/projects/ProjectPortfolioGrid.tsx`, `src/components/projects/ProjectPortfolioStats.tsx`, `src/components/projects/MalawiProjectMap.tsx` | Filters intentionally use internal horizontal scrolling; map uses sticky 700px panel and absolute labels. | Ready for browser check |
| Project details | `src/pages/ProjectDetailsPage.tsx` | Uses local fallback project IDs and sticky snapshot sidebar on large screens. | Ready for browser check |
| Careers | `src/pages/CareersPage.tsx`, `src/components/ApplicationForm.tsx` | Form is sticky on desktop; CV selected filename truncates at 200px. | Ready for browser check |
| Contact | `src/pages/ContactPage.tsx`, `src/components/contact/ContactForm.tsx`, `src/components/Footer.tsx`, `src/components/footer/FooterMap.tsx` | Contact cards and footer legal links need mobile overflow verification. | Ready for browser check |
| About and HSE | `src/pages/AboutPage.tsx`, `src/pages/HSEPage.tsx` | Timeline, certification cards, and large statistic text need mobile visual verification. | Ready for browser check |

## Static Dashboard Route Checklist

| Surface | Files Reviewed | Static Notes | Status |
|---|---|---|---|
| Dashboard router | `apps/dashboard/src/App.tsx` | Routes exist for `/`, `/projects`, `/project-categories`, `/applications`, `/messages`, `/jobs`, `/team`, `/partners`, `/services`, `/settings`, `/content`. | Inventory only, US2 not started |
| Dashboard shell | `apps/dashboard/src/components/Layout.tsx`, `apps/dashboard/src/components/Sidebar.tsx` | Layout uses `h-screen` and nested overflow regions; mobile sidebar verification is US2. | Inventory only |
| Dashboard pages | `apps/dashboard/src/pages/*` | Lists, cards, modals, uploads, and tables are present across management surfaces. | Inventory only |

## Shared UI Pattern Checklist

| Pattern | Files Reviewed | Static Notes | Status |
|---|---|---|---|
| Global modal | `packages/shared-ui/src/components/modals/GlobalModal.tsx` | Dialog body is rounded and centered; custom modal scroll/action reachability is dashboard US2. | Inventory only |
| Form input | `packages/shared-ui/src/components/forms/FormInput.tsx` | Shared labels, selects, file input, and validation messages exist. | Inventory only |
| Media upload | `packages/shared-ui/src/components/MediaUploadField.tsx` | Dashboard upload control patterns exist. | Inventory only |
| Empty state | `packages/shared-ui/src/components/EmptyState.tsx` | Shared empty state exists, but public pages also have local empty state variants. | Inventory only |
| Table | `packages/shared-ui/src/components/ui/table.tsx` | Table wrapper provides `overflow-x-auto`; dashboard table verification is US2. | Inventory only |

## Loading, Empty, and Error State Inventory

| Surface | State Coverage | Evidence |
|---|---|---|
| Projects grid | Loading spinner and empty filtered state present. | `src/components/projects/ProjectPortfolioGrid.tsx` |
| Project details | Loading spinner and "Project Not Found" fallback present. | `src/pages/ProjectDetailsPage.tsx` |
| Careers jobs | Empty state for no active jobs present; application submit has success/error file message states. | `src/pages/CareersPage.tsx`, `src/components/ApplicationForm.tsx` |
| Contact form | Success state and console-only submit failure path present. | `src/components/contact/ContactForm.tsx` |
| Dashboard pages | Loading spinners and empty states appear across inventory; detailed browser checks are US2. | `apps/dashboard/src/pages/*` |

## Static Findings

| ID | Surface | Viewport | Severity | Evidence | API Risk | Fix Scope | Status |
|---|---|---:|---|---|---|---|---|
| UI-001 | Projects map | Mobile/Desktop | P3 acceptable after browser | `MalawiProjectMap` uses `sticky top-24`, `min-h-[700px]`, absolute marker labels, and a 500px map. Browser check showed no page-level horizontal scroll and no action overflow. | None | No P1 fix required in US1. | Closed |
| UI-002 | Projects filters | Mobile | P3 acceptable after browser | Category filters intentionally use `.portfolio-filter-scroll` with `overflow-x-auto`; browser check showed internal filter scrolling only, with page-level horizontal scroll false. | None | No P1 fix required in US1. | Closed |
| UI-003 | Application CV file row | Mobile | P3 acceptable after browser | Selected filename truncates with `max-w-[200px]`; browser check showed form/upload/submit controls reachable. | None | No P1 fix required in US1. | Closed |
| UI-004 | Contact/footer links | Mobile | P3 acceptable after browser | Footer legal links use a horizontal flex row with 8-gap text buttons; browser check showed no page-level horizontal scroll and footer links visible. | None | No P1 fix required in US1. | Closed |
| UI-005 | Dashboard shell and tables | Mobile | P1 candidate resolved in US2 | Initial dashboard layout/table risks were promoted into browser findings `UI-011`, `UI-012`, and `UI-013`. P1 shell/sidebar and Page Content tab issues were fixed in US2; the remaining Applications empty-state P2 issue was fixed in US3. | None | Covered by `UI-011`, `UI-012`, and `UI-013`. | Closed |

## Browser-Promoted Findings

| ID | Surface | Viewport | Severity | Evidence | API Risk | Fix Scope | Status |
|---|---|---:|---|---|---|---|---|
| UI-006 | Public browser checks | Desktop/Mobile | P3 evidence note | All public targets returned HTTP 200. `public-browser-results.json` shows `pageHorizontalScroll: false` and `actionOverflow: 0` for every route/viewport. | None | No UI fix required. | Closed, no P1 |
| UI-007 | API-backed public data during UI verification | Desktop/Mobile | P2 deferred runtime note | Console/network evidence records expected `http://localhost:3001/api/*` failures because API was intentionally not started. Public fallback content remained readable. | None; no contract changed | Re-check with local-safe API in a later full integration pass if needed. | Deferred |
| UI-008 | External Unsplash media in headless Chrome | Desktop/Mobile | P3 environment note | Some external images failed with `net::ERR_BLOCKED_BY_ORB` in headless verification. Page layouts remained readable with image fallbacks/containers. | None | No UI fix in this scope. | Closed |
| UI-009 | Projects category filter internal overflow | Mobile | P3 acceptable pattern | `/projects` mobile records overflow offenders inside `.portfolio-filter-scroll`, but page-level horizontal scroll is false and action overflow is zero. | None | No UI fix required. | Closed |
| UI-010 | Decorative absolute backgrounds/image scale | Desktop/Mobile | P3 acceptable pattern | Home/contact/HSE record decorative overflow offenders, but section clipping prevents page scroll and no primary actions are clipped. | None | No UI fix required. | Closed |

## Dashboard Browser-Promoted Findings

| ID | Surface | Viewport | Severity | Evidence | API Risk | Fix Scope | Status |
|---|---|---:|---|---|---|---|---|
| UI-011 | Dashboard shell/sidebar | Mobile 390x844 | P1 | Initial US2 screenshot showed the fixed sidebar occupying most of the mobile viewport and pushing dashboard content partially off-screen. | None | `apps/dashboard/src/components/Layout.tsx`, `apps/dashboard/src/components/Sidebar.tsx` only. | Fixed |
| UI-012 | Page Content tabs | Mobile 390x844 | P1 | Browser check showed the `HSE & Quality` tab clipped at the viewport edge on mobile. | None | `apps/dashboard/src/pages/PageContent.tsx` tabs only. | Fixed |
| UI-013 | Applications table empty state | Mobile 390x844 | P2 | Original `/applications` mobile check showed the empty-state `td` at 466px inside a 390px viewport, visually clipping the empty text. US3 re-check forces an empty search state and records the fixed empty message at 308px inside the 390px viewport, with no overflow offenders. | None | `apps/dashboard/src/pages/Applications.tsx` empty table empty-state branch only. | Fixed |
| UI-014 | Project card external media in headless dashboard check | Desktop/Mobile | P3 environment note | `/projects` dashboard records two Unsplash `net::ERR_BLOCKED_BY_ORB` failures in headless Chrome. API data loads and cards/actions remain usable. | None | No UI fix in this scope. | Closed |

## US3 Shared UI Consistency Audit

| Task | Surface / Pattern | Result | Evidence | Status |
|---|---|---|---|---|
| T053 | Button hierarchy and action clarity | No P2 fix required. Public navbar CTA, application submit button, dashboard Projects primary/add/edit/delete actions, and Page Content section save actions are distinguishable and remain reachable in prior browser evidence. | `src/components/Navbar.tsx`, `src/components/ApplicationForm.tsx`, `apps/dashboard/src/pages/Projects.tsx`, `apps/dashboard/src/pages/PageContent.tsx`, `packages/shared-ui/src/components/ui/button.tsx` | Closed, no code change |
| T054 | Empty/loading/error states | One P2 fix was required for Applications empty table text; other audited public/dashboard loading and empty states remain readable or already documented as P3/deferred runtime notes. | `UI-013`, `specs/004-ui-ux-responsive/evidence/dashboard-us3-browser-results.json` mobile `/applications` metrics | Fixed in T057 |
| T055 | Card, badge, table, and media placeholder consistency | Shared `Table` already uses an `overflow-x-auto` wrapper, `Card`/`Badge` patterns are consistent enough for this package, and media placeholders remain stable. The Applications page uses a local table, so the P2 fix belongs to the page empty state rather than a shared table rewrite. | `packages/shared-ui/src/components/ui/table.tsx`, `packages/shared-ui/src/components/ui/card.tsx`, `packages/shared-ui/src/components/ui/badge.tsx`, `packages/shared-ui/src/components/MediaUploadField.tsx`, `apps/dashboard/src/pages/Applications.tsx` | Closed |

## US3 Change Log

- Changed `apps/dashboard/src/pages/Applications.tsx` only: when filters/search produce zero applications, the page now renders the empty message outside the scrollable table so the message fits the mobile card viewport.
- Added `specs/004-ui-ux-responsive/evidence/verify-dashboard-us3-ui.mjs` for representative US3 browser checks on `/projects`, `/content`, `/messages`, and `/applications` at desktop/mobile sizes.
- Re-ran US3 representative browser checks with local-safe API and dashboard dev servers. `dashboard-us3-browser-results.json` shows all checked routes returned HTTP 200, 0 console errors, no page-level horizontal scroll, and 0 action overflow. The `/applications` mobile empty state was forced via search and now has no overflow offenders.
- API contract risk remains none: no endpoints, payloads, response shapes, auth behavior, `Project.category`, or Success Stories Page Content path were changed.

## Remaining P3 Polish Follow-Ups

- External Unsplash `net::ERR_BLOCKED_BY_ORB` failures on dashboard `/projects` remain an environment/media-source note from headless Chrome; the project cards and actions remain usable.
- A broader visual system pass for replacing local dashboard tables with shared `Table` components remains out of scope because US3 did not prove a cross-surface blocker after the Applications empty-state fix.
- Dedicated Success stories dashboard page remains out of scope; Success Stories continue through Page Content `home.successStories`.

## US4 Evidence Completeness Check

| Check | Result | Evidence |
|---|---|---|
| Public desktop/mobile route coverage | Pass | `public-browser-results.json` contains 14 rows covering `/`, `/projects`, `/projects/1`, `/careers`, `/contact`, `/about`, and `/hse` at desktop and mobile sizes. |
| Dashboard desktop/mobile route coverage | Pass | `dashboard-browser-results.json` contains 22 rows covering `/`, `/projects`, `/project-categories`, `/services`, `/partners`, `/team`, `/jobs`, `/settings`, `/content`, `/messages`, and `/applications` at desktop and mobile sizes. |
| Console/network summaries | Pass | `browser-verification.md` includes console error and failed network request columns for every public, dashboard, and US3 representative entry. Raw JSON stores `consoleErrors` and `failedRequests` arrays for each row. |
| Horizontal scroll and clipped action status | Pass | `browser-verification.md` includes horizontal scroll and overlap/table/action notes for every checked entry. Raw JSON stores `metrics.pageHorizontalScroll` and `metrics.actionOverflow` for each row. |
| Unresolved P1 findings | Pass | No P1 finding remains open; `UI-011` and `UI-012` are fixed, and `UI-005` is closed as superseded by resolved browser-promoted findings. |
| API guardrails | Pass | Guardrails remain active for unchanged API endpoints/payloads/responses/auth, `Project.category` string compatibility, and Success Stories through Page Content `home.successStories`. |

## Dashboard Change Log

- Changed `apps/dashboard/src/components/Layout.tsx` to add mobile menu state, a mobile navigation button, safer header spacing, and smaller mobile content padding.
- Changed `apps/dashboard/src/components/Sidebar.tsx` to make the sidebar off-canvas on mobile, with overlay, close button, route-close behavior, and unchanged desktop behavior.
- Changed `apps/dashboard/src/pages/PageContent.tsx` to wrap page tabs on mobile so all Page Content sections remain directly reachable without clipped tab actions.
- Re-ran all dashboard routes on desktop/mobile with API local-safe runtime. Final evidence is in `specs/004-ui-ux-responsive/evidence/dashboard-browser-results.json`.
- API contract risk remains none: no endpoints, payloads, response shapes, auth behavior, `Project.category`, or Success Stories Page Content path were changed.

## Public-Site Change Log

- No public UI code was changed. Browser verification did not prove any P1 findings for T026-T032.
- T033 is not applicable because there were no touched public targets requiring a post-fix re-run; the second auto-scroll browser pass is recorded in `browser-verification.md`.
- API contract risk remains none: no endpoints, payloads, response shapes, auth behavior, `Project.category`, or Success Stories management path were changed.
