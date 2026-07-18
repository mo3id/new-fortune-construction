# Tasks: Public SEO Improvements

**Input**: Design documents from `specs/005-public-seo-improvements/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/seo-verification-contract.md`, `quickstart.md`, `seo-inventory.md`

**Tests**: This feature explicitly requires static verification, browser metadata checks, sitemap/robots checks, structured data parsing, console/network evidence, `npm run typecheck`, and `npm run build`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing. Use the explicit path `specs/005-public-seo-improvements`; do not infer scope from the current git branch.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel when different files are involved and no dependency exists
- **[Story]**: Maps to User Stories in `specs/005-public-seo-improvements/spec.md`
- Every task includes exact file paths or explicit verification artifact paths

---

## Phase 1: Setup (SEO Evidence & Baseline Inventory)

**Purpose**: Prepare documentation and evidence locations before implementation.

- [x] T001 Create SEO implementation findings log in `specs/005-public-seo-improvements/seo-findings.md` with columns for id, target, route/file, severity, evidence, API risk, fix scope, and status
- [x] T002 Create SEO browser verification log in `specs/005-public-seo-improvements/seo-browser-verification.md` based on `specs/005-public-seo-improvements/contracts/seo-verification-contract.md`
- [x] T003 Create SEO evidence directory notes in `specs/005-public-seo-improvements/seo-browser-verification.md` for screenshots, raw metadata JSON, sitemap/robots checks, and structured data parse results
- [x] T004 [P] Add static route inventory to `specs/005-public-seo-improvements/seo-findings.md` covering `src/router.tsx`, `src/App.tsx`, and all files in `src/pages/`
- [x] T005 [P] Add current head/static SEO inventory to `specs/005-public-seo-improvements/seo-findings.md` covering `index.html`, `public/`, `src/lib/constants.ts`, and any existing metadata-related code
- [x] T006 [P] Add API/dashboard guardrail checklist to `specs/005-public-seo-improvements/seo-findings.md` covering unchanged API contracts, unchanged dashboard source, and no private routes in SEO outputs

---

## Phase 2: Foundational (Blocking Static Checks & Verification Harness)

**Purpose**: Prove current SEO gaps and prepare safe verification before any public SEO implementation.

**CRITICAL**: No SEO implementation tasks should begin until static inventory, metadata gap checks, base URL checks, and verification harness tasks are complete.

- [x] T007 Run static SEO inventory command from `specs/005-public-seo-improvements/quickstart.md` and record results in `specs/005-public-seo-improvements/seo-findings.md`
- [x] T008 Verify current public routes and services indexability gap in `specs/005-public-seo-improvements/seo-findings.md` using `src/router.tsx`, `src/components/Services.tsx`, and `src/components/footer/FooterLinks.tsx`
- [x] T009 Verify current `index.html` fallback metadata and absence/presence of route-specific metadata in `specs/005-public-seo-improvements/seo-findings.md`
- [x] T010 Verify current `public/sitemap.xml` and `public/robots.txt` absence/presence and record crawler-file baseline in `specs/005-public-seo-improvements/seo-findings.md`
- [x] T011 Verify no implementation plan changes API endpoints, payloads, response shapes, auth behavior, dashboard routes, or dashboard management flows; record guardrail in `specs/005-public-seo-improvements/seo-findings.md`
- [x] T012 [P] Create static metadata verification helper skeleton in `specs/005-public-seo-improvements/evidence/verify-seo-static.mjs`
- [x] T013 [P] Create browser metadata verification helper skeleton in `specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs`
- [x] T014 [P] Create structured data parse verification helper skeleton in `specs/005-public-seo-improvements/evidence/verify-structured-data.mjs`
- [x] T015 Add failing/static baseline assertions to `specs/005-public-seo-improvements/evidence/verify-seo-static.mjs` for missing route profiles, missing `/services`, missing sitemap/robots, and localhost production canonical prevention
- [x] T016 Add browser metadata assertion targets to `specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs` for `/`, `/projects`, `/projects/1`, `/services`, `/contact`, `/about`, `/hse`, and `/careers`
- [x] T017 Add crawler-file assertion targets to `specs/005-public-seo-improvements/evidence/verify-seo-static.mjs` for sitemap inclusion/exclusion and robots sitemap/private-route rules
- [x] T018 Add structured data assertion targets to `specs/005-public-seo-improvements/evidence/verify-structured-data.mjs` for organization, contact, and services JSON-LD outputs
- [x] T019 Run static verification helper before implementation and record expected failing metadata/crawler gaps in `specs/005-public-seo-improvements/seo-findings.md`

**Checkpoint**: SEO gaps are documented, verification helpers exist, and implementation can begin.

---

## Phase 3: User Story 1 - Page Metadata and Indexability (Priority: P1) MVP

**Goal**: Every core public page exposes unique page metadata, canonical URLs, and indexable signals without breaking API or UI behavior.

**Independent Test**: Static and browser checks verify each required public route has title, description, canonical URL, robots/indexability signal, no localhost production canonical URL, and no console/network regressions.

### Tests and Checks for User Story 1

- [x] T020 [P] [US1] Add static assertions for typed SEO page profiles in `specs/005-public-seo-improvements/evidence/verify-seo-static.mjs`
- [x] T021 [P] [US1] Add static assertions for canonical base URL normalization and localhost rejection in `specs/005-public-seo-improvements/evidence/verify-seo-static.mjs`
- [x] T022 [P] [US1] Add browser assertions for route title, description, canonical, robots/indexable meta, console errors, failed network requests, horizontal scroll, and action overflow in `specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs`
- [x] T023 [US1] Run US1 verification before implementation and record expected metadata failures in `specs/005-public-seo-improvements/seo-findings.md`

### Implementation for User Story 1

- [x] T024 [US1] Implement typed SEO config, route profile types, production base URL helper, canonical URL builder, and metadata profile registry in `src/lib/seo.ts`
- [x] T025 [US1] Implement reusable head updater component for title, description, canonical, robots/indexable, Open Graph placeholders, Twitter placeholders, and JSON-LD placeholders in `src/components/SeoHead.tsx`
- [x] T026 [US1] Apply home page SEO profile and organization structured data placeholder in `src/App.tsx`
- [x] T027 [US1] Apply about page SEO profile in `src/pages/AboutPage.tsx`
- [x] T028 [US1] Apply projects list SEO profile in `src/pages/ProjectsPage.tsx`
- [x] T029 [US1] Apply project detail SEO profile using available project data and safe fallbacks in `src/pages/ProjectDetailsPage.tsx`
- [x] T030 [US1] Apply HSE page SEO profile in `src/pages/HSEPage.tsx`
- [x] T031 [US1] Apply careers page SEO profile in `src/pages/CareersPage.tsx`
- [x] T032 [US1] Apply contact page SEO profile in `src/pages/ContactPage.tsx`
- [x] T033 [US1] Create thin Services page that reuses existing services content without redesign in `src/pages/ServicesPage.tsx`
- [x] T034 [US1] Register `/services` public route in `src/router.tsx`
- [x] T035 [US1] Update service navigation links only where needed for indexability in `src/lib/constants.ts` and `src/components/footer/FooterLinks.tsx`
- [x] T036 [US1] Re-run US1 static metadata checks and record pass/fail evidence in `specs/005-public-seo-improvements/seo-findings.md`
- [x] T037 [US1] Run US1 browser metadata checks for public route targets and update `specs/005-public-seo-improvements/seo-browser-verification.md`

**Checkpoint**: Public page metadata and canonical/indexability MVP is functional and independently verifiable.

---

## Phase 4: User Story 2 - Social Sharing Metadata (Priority: P2)

**Goal**: Public pages expose correct social sharing metadata for Open Graph and Twitter-compatible previews.

**Independent Test**: Browser metadata checks verify OG/Twitter title, description, URL, image, and type for required public routes, including project detail fallback behavior.

### Tests and Checks for User Story 2

- [x] T038 [P] [US2] Add static assertions for social metadata fields in each SEO Page Profile in `specs/005-public-seo-improvements/evidence/verify-seo-static.mjs`
- [x] T039 [P] [US2] Add browser assertions for `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image` in `specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs`
- [x] T040 [US2] Run US2 verification before implementation and record expected social metadata gaps in `specs/005-public-seo-improvements/seo-findings.md`

### Implementation for User Story 2

- [x] T041 [US2] Extend `src/lib/seo.ts` with typed social preview profiles and brand image fallback behavior
- [x] T042 [US2] Extend `src/components/SeoHead.tsx` to emit Open Graph metadata and Twitter metadata without duplicating stale tags
- [x] T043 [US2] Add page-specific social preview metadata for home, about, projects, services, HSE, careers, and contact in `src/lib/seo.ts`
- [x] T044 [US2] Add project detail social preview generation using project title, overview/category/location, canonical URL, and image fallback in `src/pages/ProjectDetailsPage.tsx`
- [x] T045 [US2] Re-run US2 static and browser social metadata checks and update `specs/005-public-seo-improvements/seo-browser-verification.md`

**Checkpoint**: Social metadata is complete for required public routes and remains independently testable.

---

## Phase 5: User Story 3 - Crawler Discovery Files (Priority: P2)

**Goal**: Search crawlers can discover public pages through sitemap and robots files while private/dashboard/API routes remain excluded.

**Independent Test**: Static file checks verify sitemap includes required public URLs with non-localhost canonical base URL and robots allows public pages while excluding private/dashboard routes.

### Tests and Checks for User Story 3

- [x] T046 [P] [US3] Add sitemap XML assertions to `specs/005-public-seo-improvements/evidence/verify-seo-static.mjs` for required public routes and non-localhost production base URL
- [x] T047 [P] [US3] Add sitemap exclusion assertions to `specs/005-public-seo-improvements/evidence/verify-seo-static.mjs` for dashboard, login, admin, API, and private management routes
- [x] T048 [P] [US3] Add robots assertions to `specs/005-public-seo-improvements/evidence/verify-seo-static.mjs` for sitemap reference, public allow behavior, and private/dashboard disallow rules
- [x] T049 [US3] Run US3 verification before implementation and record expected sitemap/robots gaps in `specs/005-public-seo-improvements/seo-findings.md`

### Implementation for User Story 3

- [x] T050 [US3] Add static sitemap with required public routes and non-localhost canonical base URL in `public/sitemap.xml`
- [x] T051 [US3] Add crawler policy referencing sitemap and excluding private/dashboard/API routes in `public/robots.txt`
- [x] T052 [US3] Document configured SEO base URL and sitemap/robots assumptions in `specs/005-public-seo-improvements/quickstart.md`
- [x] T053 [US3] Re-run sitemap and robots static checks and update `specs/005-public-seo-improvements/seo-findings.md`

**Checkpoint**: Sitemap and robots are present, safe, and independently verifiable.

---

## Phase 6: User Story 4 - Construction Business Structured Data (Priority: P3)

**Goal**: Search engines can parse accurate construction-company, contact, and services context without invented or misleading business facts.

**Independent Test**: Structured data parser verifies JSON-LD is valid, uses known/visible business facts, and appears on appropriate public routes.

### Tests and Checks for User Story 4

- [x] T054 [P] [US4] Add structured data parser assertions for home organization/business JSON-LD in `specs/005-public-seo-improvements/evidence/verify-structured-data.mjs`
- [x] T055 [P] [US4] Add structured data parser assertions for contact page contact/business JSON-LD in `specs/005-public-seo-improvements/evidence/verify-structured-data.mjs`
- [x] T056 [P] [US4] Add structured data parser assertions for services page service/business context in `specs/005-public-seo-improvements/evidence/verify-structured-data.mjs`
- [x] T057 [US4] Run US4 verification before implementation and record expected structured data gaps in `specs/005-public-seo-improvements/seo-findings.md`

### Implementation for User Story 4

- [x] T058 [US4] Add typed organization and construction business structured data builders in `src/lib/seo.ts`
- [x] T059 [US4] Add contact structured data builder using known/fallback contact fields in `src/lib/seo.ts`
- [x] T060 [US4] Add services structured data builder using known service categories and visible services content in `src/lib/seo.ts`
- [x] T061 [US4] Emit organization JSON-LD on the home page through `src/App.tsx`
- [x] T062 [US4] Emit contact/business JSON-LD on the contact page through `src/pages/ContactPage.tsx`
- [x] T063 [US4] Emit services/business JSON-LD on the services page through `src/pages/ServicesPage.tsx`
- [x] T064 [US4] Re-run structured data parser checks and update `specs/005-public-seo-improvements/seo-browser-verification.md`

**Checkpoint**: Structured data is valid, accurate, and limited to known/visible business facts.

---

## Phase 7: Final Verification & Documentation

**Purpose**: Confirm SEO outputs, no regressions, and no API/dashboard contract changes.

- [x] T065 Run full static SEO verification helper and save raw results to `specs/005-public-seo-improvements/evidence/seo-static-results.json`
- [x] T066 Run public browser metadata verification on desktop and mobile targets and save raw results to `specs/005-public-seo-improvements/evidence/seo-browser-results.json`
- [x] T067 Run structured data parse verification and save raw results to `specs/005-public-seo-improvements/evidence/structured-data-results.json`
- [x] T068 Verify `specs/005-public-seo-improvements/seo-browser-verification.md` includes title, description, canonical, robots/indexable, social metadata, structured data, console errors, failed network requests, horizontal scroll, and clipped action status for checked routes
- [x] T069 Verify `public/sitemap.xml` and `public/robots.txt` exclude dashboard, login, admin, API, and private management routes; record result in `specs/005-public-seo-improvements/seo-findings.md`
- [x] T070 Verify API contracts and dashboard source were not changed by reviewing `apps/api/src/`, `apps/dashboard/src/`, and `specs/005-public-seo-improvements/seo-findings.md`
- [x] T071 Run `npm run typecheck` and record result in `specs/005-public-seo-improvements/quickstart.md`
- [x] T072 Run `npm run build` and record result plus any Vite warnings in `specs/005-public-seo-improvements/quickstart.md`
- [x] T073 Document why `npm run test --workspace=apps/api` was not needed, or run it only if implementation changed API request/response assumptions, in `specs/005-public-seo-improvements/quickstart.md`
- [x] T074 Update `specs/005-public-seo-improvements/seo-inventory.md` with final SEO outputs, changed files, and deferred follow-ups
- [x] T075 Update `specs/005-public-seo-improvements/quickstart.md` with final summary, verification results, canonical base URL notes, and deferred follow-ups
- [x] T076 Verify every task T001-T076 is completed or explicitly blocked in `specs/005-public-seo-improvements/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies; creates evidence and inventory structure.
- **Phase 2 Foundational**: Depends on Phase 1 and blocks all implementation.
- **Phase 3 US1 Metadata MVP**: Depends on Phase 2; should be completed first because later stories use `src/lib/seo.ts` and `src/components/SeoHead.tsx`.
- **Phase 4 US2 Social Metadata**: Depends on US1 metadata infrastructure.
- **Phase 5 US3 Crawler Discovery Files**: Depends on US1 canonical route decisions but can proceed alongside US2 after US1.
- **Phase 6 US4 Structured Data**: Depends on US1 `SeoHead` JSON-LD support and page profile decisions.
- **Phase 7 Final Verification**: Depends on selected user story phases being complete.

### User Story Dependencies

- **US1 Page Metadata and Indexability**: MVP; required before social, crawler, and structured data integration.
- **US2 Social Sharing Metadata**: Builds on US1 profile/canonical helpers; independently verified through social metadata checks.
- **US3 Crawler Discovery Files**: Builds on US1 canonical base URL and route list; independently verified through static file checks.
- **US4 Structured Data**: Builds on US1 head/JSON-LD support; independently verified through parser checks.

### Within Each User Story

- Verification tasks MUST run before implementation tasks and record expected gaps.
- Implementation MUST avoid API and dashboard source changes unless a task explicitly states verification-only review.
- `/services` MUST remain a thin route reusing existing `Services` content, not a broad redesign.
- Browser verification MUST record console and failed network request summaries.
- Canonical URLs and sitemap URLs MUST NOT use localhost for production-facing output.

### Parallel Opportunities

- T004-T006 can run in parallel after T001-T003.
- T012-T014 can run in parallel during foundational verification setup.
- T020-T022 can run in parallel for US1 verification.
- T038-T039 can run in parallel for US2 verification.
- T046-T048 can run in parallel for US3 verification.
- T054-T056 can run in parallel for US4 verification.

---

## Parallel Example: US1 Metadata MVP

```text
Task: T020 static SEO page profile assertions in specs/005-public-seo-improvements/evidence/verify-seo-static.mjs
Task: T021 canonical base URL assertions in specs/005-public-seo-improvements/evidence/verify-seo-static.mjs
Task: T022 browser metadata assertions in specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs
```

---

## Parallel Example: US3 Crawler Files

```text
Task: T046 sitemap public route assertions in specs/005-public-seo-improvements/evidence/verify-seo-static.mjs
Task: T047 sitemap private route exclusion assertions in specs/005-public-seo-improvements/evidence/verify-seo-static.mjs
Task: T048 robots policy assertions in specs/005-public-seo-improvements/evidence/verify-seo-static.mjs
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 setup and Phase 2 foundational verification.
2. Complete US1 tests/checks T020-T023.
3. Implement typed SEO config, `SeoHead`, page profiles, and `/services` thin route T024-T035.
4. Re-run US1 static/browser checks T036-T037.
5. Stop and validate metadata/indexability before social, crawler, or structured data work.

### Incremental Delivery

1. US1: Page metadata, canonical URLs, indexability, `/services`.
2. US2: Social metadata using the same profiles.
3. US3: Sitemap and robots based on verified route/canonical list.
4. US4: Structured data after basic head/JSON-LD support exists.
5. Final verification: static checks, browser checks, structured data checks, typecheck, build, and documentation.

### Safety Notes

- Do not change `apps/api/src/` or `apps/dashboard/src/` during implementation.
- Do not use localhost in production-facing canonical, sitemap, or robots sitemap URLs.
- Do not include `/dashboard`, `/login`, `/admin`, `/api`, or private management paths in sitemap.
- Keep external media/API network failures classified against the existing public baseline; only new SEO-caused failures are blockers.
