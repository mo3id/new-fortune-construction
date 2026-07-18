# Browser Verification: UI/UX Responsive Improvements

Scope covered so far:

- US1 public site: `/`, `/projects`, `/projects/:id`, `/careers`, `/contact`, `/about`, `/hse`
- US2 dashboard: `/`, `/projects`, `/project-categories`, `/services`, `/partners`, `/team`, `/jobs`, `/settings`, `/content`, `/messages`, `/applications`

All checks use desktop 1440x1000 and mobile 390x844.

## Evidence Directory

Screenshots or equivalent visual evidence for this pass are stored under:

`specs/004-ui-ux-responsive/evidence/`

If screenshots cannot be captured by the available local tooling, each row must include equivalent evidence: loaded URL, viewport, console errors, failed network requests, page-level scroll dimensions, and overlap/clipping notes.

## Dev Server Requirements

| Service | Needed For | Command | Decision |
|---|---|---|---|
| Public site | US1 browser checks | `npm run dev` | Required for T019-T024. |
| Dashboard | US2 checks only | `npm run dev:dashboard` | Not run in T001-T034. |
| API | API-backed browser states only | `npm run dev:api` | Not needed for US1 baseline. Do not run unless local-safe environment is verified first. |

## API Runtime Safety Decision

API runtime is not needed for this pass. Public pages have fallback/local presentation paths and browser verification can record failed API requests as network evidence. `npm run dev:api` was not run.

For US2, API runtime was needed for real dashboard data. `apps/api/.env` was checked without exposing secret values: no active remote `MONGODB_URI` was configured, `JWT_SECRET` was set, and `/health` returned `status: ok`, `database: ok`, `mode: local`, `database.mode: memory`. API was therefore considered local-safe for dashboard browser verification.

## Browser Targets

| Task | Route | Viewport | Screenshot / Evidence | Console Errors | Failed Network Requests | Horizontal Scroll | Overlap / Clipping | Result |
|---|---|---|---|---|---|---|---|---|
| T019 | `/` | 1440x1000 | `evidence/T019-home-desktop.png`, HTTP 200 | 40, expected API/image failures while API is intentionally off | 23 | No | Decorative absolute elements only; no action overflow | Pass |
| T019 | `/` | 390x844 | `evidence/T019-home-mobile.png`, HTTP 200 | 40, expected API/image failures while API is intentionally off | 23 | No | Decorative absolute elements only; no action overflow | Pass |
| T020 | `/projects` | 1440x1000 | `evidence/T020-projects-desktop.png`, HTTP 200 | 12, expected API/image failures while API is intentionally off | 7 | No | None detected | Pass |
| T020 | `/projects` | 390x844 | `evidence/T020-projects-mobile.png`, HTTP 200 | 18, expected API/image failures while API is intentionally off | 10 | No | Internal category filter scroll only; no page/action overflow | Pass |
| T021 | `/projects/1` | 1440x1000 | `evidence/T021-projects-1-desktop.png`, HTTP 200 | 4, expected API/image failures while API is intentionally off | 5 | No | None detected | Pass |
| T021 | `/projects/1` | 390x844 | `evidence/T021-projects-1-mobile.png`, HTTP 200 | 6, expected API/image failures while API is intentionally off | 6 | No | None detected | Pass |
| T022 | `/careers` | 1440x1000 | `evidence/T022-careers-desktop.png`, HTTP 200 | 18, expected API/image failures while API is intentionally off | 10 | No | None detected | Pass |
| T022 | `/careers` | 390x844 | `evidence/T022-careers-mobile.png`, HTTP 200 | 18, expected API/image failures while API is intentionally off | 10 | No | Jobs empty state and application form reachable; no action overflow | Pass |
| T023 | `/contact` | 1440x1000 | `evidence/T023-contact-desktop.png`, HTTP 200 | 12, expected API/image failures while API is intentionally off | 7 | No | Map image scale extends inside clipped section; no action overflow | Pass |
| T023 | `/contact` | 390x844 | `evidence/T023-contact-mobile.png`, HTTP 200 | 12, expected API/image failures while API is intentionally off | 7 | No | Contact cards/form/footer reachable; no action overflow | Pass |
| T024 | `/about` | 1440x1000 | `evidence/T024-about-desktop.png`, HTTP 200 | 18, expected API/image failures while API is intentionally off | 10 | No | None detected | Pass |
| T024 | `/about` | 390x844 | `evidence/T024-about-mobile.png`, HTTP 200 | 18, expected API/image failures while API is intentionally off | 10 | No | Timeline/cards/team empty state readable | Pass |
| T024 | `/hse` | 1440x1000 | `evidence/T024-hse-desktop.png`, HTTP 200 | 18, expected API/image failures while API is intentionally off | 10 | No | Decorative background scale only; no action overflow | Pass |
| T024 | `/hse` | 390x844 | `evidence/T024-hse-mobile.png`, HTTP 200 | 18, expected API/image failures while API is intentionally off | 10 | No | Policy cards, stats, partners, download action readable | Pass |

## Console / Network Evidence Notes

- Browser checks were run with `npm run dev` only. API runtime was intentionally not started, so requests to `http://localhost:3001/api/*` failed with CORS/resource errors and are recorded as expected baseline evidence rather than UI regressions.
- Several Unsplash images failed with `net::ERR_BLOCKED_BY_ORB` in headless Chrome. Layout fallbacks remained readable and no page-level horizontal scrolling was detected.
- Full raw evidence is stored in `specs/004-ui-ux-responsive/evidence/public-browser-results.json`.
- Verification helper used: `specs/004-ui-ux-responsive/evidence/verify-public-ui.mjs`, which runs local Chrome headless, scrolls each route to activate `whileInView` content, captures screenshots, and records DOM metrics.

## Re-Run Log

- Initial full-page screenshots exposed an animation-capture artifact where below-fold `whileInView` sections had not entered the viewport. The helper was updated to auto-scroll before screenshot capture.
- No public UI files were changed because no P1 public findings were proven. T033 is therefore not applicable for changed targets; the second browser pass above serves as verification evidence for T019-T024.

## Dashboard Browser Targets

| Task | Route | Viewport | Screenshot / Evidence | Console Errors | Failed Network Requests | Horizontal Scroll | Table/List/Form/Modal Notes | Result |
|---|---|---|---|---|---|---|---|---|
| T035 | `/` | 1440x1000 | `evidence/T035-dashboard-home-desktop.png`, HTTP 200 | 0 | 0 | No | Shell/header readable | Pass |
| T035 | `/` | 390x844 | `evidence/T035-dashboard-home-mobile.png`, HTTP 200 | 0 | 0 | No | Sidebar P1 fixed to off-canvas; content fully visible | Pass |
| T036 | `/projects` | 1440x1000 | `evidence/T036-projects-desktop.png`, HTTP 200 | 0 | 2 external image ORB failures | No | Add Project modal fits; Project.category remains string selector | Pass |
| T036 | `/projects` | 390x844 | `evidence/T036-projects-mobile.png`, HTTP 200 | 0 | 2 external image ORB failures | No | Add Project modal fits mobile viewport | Pass |
| T036 | `/project-categories` | 1440x1000 | `evidence/T036-project-categories-desktop.png`, HTTP 200 | 0 | 0 | No | Category card/list and Add Category modal usable | Pass |
| T036 | `/project-categories` | 390x844 | `evidence/T036-project-categories-mobile.png`, HTTP 200 | 0 | 0 | No | Add Category modal fits and actions reachable | Pass |
| T037 | `/services` | 1440x1000 | `evidence/T037-services-desktop.png`, HTTP 200 | 0 | 0 | No | Service cards/actions visible | Pass |
| T037 | `/services` | 390x844 | `evidence/T037-services-mobile.png`, HTTP 200 | 0 | 0 | No | Cards/actions visible after sidebar fix | Pass |
| T037 | `/partners` | 1440x1000 | `evidence/T037-partners-desktop.png`, HTTP 200 | 0 | 0 | No | Partner cards/actions visible | Pass |
| T037 | `/partners` | 390x844 | `evidence/T037-partners-mobile.png`, HTTP 200 | 0 | 0 | No | Cards/actions visible after sidebar fix | Pass |
| T037 | `/team` | 1440x1000 | `evidence/T037-team-desktop.png`, HTTP 200 | 0 | 0 | No | Team cards/actions visible | Pass |
| T037 | `/team` | 390x844 | `evidence/T037-team-mobile.png`, HTTP 200 | 0 | 0 | No | Cards/actions visible after sidebar fix | Pass |
| T038 | `/jobs` | 1440x1000 | `evidence/T038-jobs-desktop.png`, HTTP 200 | 0 | 0 | No | Job cards/actions visible | Pass |
| T038 | `/jobs` | 390x844 | `evidence/T038-jobs-mobile.png`, HTTP 200 | 0 | 0 | No | Job actions visible after sidebar fix | Pass |
| T038 | `/settings` | 1440x1000 | `evidence/T038-settings-desktop.png`, HTTP 200 | 0 | 0 | No | Settings form detected and readable | Pass |
| T038 | `/settings` | 390x844 | `evidence/T038-settings-mobile.png`, HTTP 200 | 0 | 0 | No | Settings form and save action reachable | Pass |
| T038 | `/content` | 1440x1000 | `evidence/T038-content-desktop.png`, HTTP 200 | 0 | 0 | No | Page Content sections visible | Pass |
| T038 | `/content` | 390x844 | `evidence/T038-content-mobile.png`, HTTP 200 | 0 | 0 | No | Tabs wrap on mobile; no clipped primary action | Pass |
| T039 | `/messages` | 1440x1000 | `evidence/T039-messages-desktop.png`, HTTP 200 | 0 | 0 | No | Empty/list state visible | Pass |
| T039 | `/messages` | 390x844 | `evidence/T039-messages-mobile.png`, HTTP 200 | 0 | 0 | No | Filters/list state visible after sidebar fix | Pass |
| T039 | `/applications` | 1440x1000 | `evidence/T039-applications-desktop.png`, HTTP 200 | 0 | 0 | No | Table detected with responsive wrapper | Pass |
| T039 | `/applications` | 390x844 | `evidence/T039-applications-mobile.png`, HTTP 200 | 0 | 0 | No | Table overflows inside card/wrapper; no clipped actions; documented P2 | Pass with P2 follow-up |

## Dashboard Re-Run Log

- Initial US2 mobile screenshots proved a P1 dashboard shell issue: the fixed sidebar occupied most of the 390px viewport and pushed management content off-screen.
- Fixed `apps/dashboard/src/components/Layout.tsx` and `apps/dashboard/src/components/Sidebar.tsx` by making the sidebar off-canvas on mobile with an explicit menu button, overlay, close button, and mobile header spacing.
- Fixed `apps/dashboard/src/pages/PageContent.tsx` by allowing Page Content tabs to wrap on mobile instead of clipping a tab at the viewport edge.
- Re-ran all dashboard targets after the fixes. Final `dashboard-browser-results.json` shows HTTP 200 for all 22 route/viewport rows, 0 console errors, no page-level horizontal scroll, and no clipped primary actions. The Applications table still reports non-action table width inside its responsive table/card area and is tracked as a P2 table-list refinement.
- Projects route still records two external Unsplash `net::ERR_BLOCKED_BY_ORB` image failures in headless Chrome; API requests succeeded and layout remained usable.

## US3 Representative Shared UI Re-Run

US3 representative browser verification was run with local-safe API and dashboard dev servers. The helper `specs/004-ui-ux-responsive/evidence/verify-dashboard-us3-ui.mjs` checks `/projects`, `/content`, `/messages`, and `/applications` on desktop 1440x1000 and mobile 390x844, including screenshots, console errors, failed network requests, page-level horizontal scroll, action overflow, and Applications empty-state fit.

| Task | Route | Viewport | Screenshot / Evidence | Console Errors | Failed Network Requests | Horizontal Scroll | Shared UI Notes | Result |
|---|---|---|---|---|---|---|---|---|
| T060 | `/projects` | 1440x1000 | `evidence/T060-us3-projects-desktop.png`, HTTP 200 | 0 | 2 external image ORB failures | No | Button/card/badge actions remain reachable | Pass |
| T060 | `/projects` | 390x844 | `evidence/T060-us3-projects-mobile.png`, HTTP 200 | 0 | 2 external image ORB failures | No | Card actions remain reachable; no action overflow | Pass |
| T060 | `/content` | 1440x1000 | `evidence/T060-us3-content-desktop.png`, HTTP 200 | 0 | 0 | No | Page Content tabs/section actions remain readable | Pass |
| T060 | `/content` | 390x844 | `evidence/T060-us3-content-mobile.png`, HTTP 200 | 0 | 0 | No | Wrapped tabs remain readable; no action overflow | Pass |
| T060 | `/messages` | 1440x1000 | `evidence/T060-us3-messages-desktop.png`, HTTP 200 | 0 | 0 | No | Empty/list state remains readable | Pass |
| T060 | `/messages` | 390x844 | `evidence/T060-us3-messages-mobile.png`, HTTP 200 | 0 | 0 | No | Mobile list and filters remain readable | Pass |
| T060 | `/applications` | 1440x1000 | `evidence/T060-us3-applications-desktop.png`, HTTP 200 | 0 | 0 | No | Empty search state forced; message fits viewport | Pass |
| T060 | `/applications` | 390x844 | `evidence/T060-us3-applications-mobile.png`, HTTP 200 | 0 | 0 | No | Empty search state forced; fixed message is 308px wide inside 390px viewport with no overflow offenders | Pass |

Raw evidence is stored in `specs/004-ui-ux-responsive/evidence/dashboard-us3-browser-results.json`.

Note: an attempted full dashboard helper re-run hit a transient Playwright navigation-context error on `/jobs` mobile while auto-scrolling. US3 then used the representative helper above, which is scoped to the changed/shared UI surfaces and completed successfully.

## US4 Evidence Coverage Verification

US4 did not run new browser sessions. It verified the existing evidence files and this document against `contracts/ui-verification-contract.md`.

| Area | Required Targets | Evidence Rows | Console/Network Summary | Horizontal Scroll Status | Overlap / Clipped Action Status | Result |
|---|---|---:|---|---|---|---|
| Public site | `/`, `/projects`, `/projects/:id`, `/about`, `/careers`, `/contact`; `/hse` included as planned package target | 14 rows in `public-browser-results.json` | Present in every Browser Targets row and raw JSON arrays | Present in every Browser Targets row and raw JSON metrics | Present in every Browser Targets row as overlap/clipping notes and raw `actionOverflow` metrics | Pass |
| Dashboard | `/`, `/projects`, `/project-categories`, `/services`, `/partners`, `/team`, `/jobs`, `/settings`, `/content`, `/messages`, `/applications` | 22 rows in `dashboard-browser-results.json` | Present in every Dashboard Browser Targets row and raw JSON arrays | Present in every Dashboard Browser Targets row and raw JSON metrics | Present in every Dashboard Browser Targets row as table/list/form/modal notes and raw `actionOverflow` metrics | Pass |
| US3 representative re-check | `/projects`, `/content`, `/messages`, `/applications` | 8 rows in `dashboard-us3-browser-results.json` | Present in every US3 row and raw JSON arrays | Present in every US3 row and raw JSON metrics | Present in every US3 row through shared UI notes and raw `actionOverflow` metrics | Pass |

Raw evidence sanity check:

- `public-browser-results.json`: 14 rows, all HTTP 200, all rows include `consoleErrors`, `failedRequests`, `metrics.pageHorizontalScroll`, and `metrics.actionOverflow`.
- `dashboard-browser-results.json`: 22 rows, all HTTP 200, all rows include `consoleErrors`, `failedRequests`, `metrics.pageHorizontalScroll`, and `metrics.actionOverflow`.
- `dashboard-us3-browser-results.json`: 8 rows, all HTTP 200, all rows include `consoleErrors`, `failedRequests`, `metrics.pageHorizontalScroll`, and `metrics.actionOverflow`.
- No row records page-level horizontal scrolling or primary action overflow after the scoped fixes.
- Known non-blocking network evidence remains limited to expected API-off public baseline requests and external image ORB failures; neither represents a UI regression.
