# Tasks: UI/UX Responsive Improvements

**Input**: Design documents from `specs/004-ui-ux-responsive/`
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/ui-verification-contract.md`, `quickstart.md`, `ui-surface-inventory.md`

**Tests**: This feature explicitly requires static checks, browser checks, screenshots/equivalent visual evidence, and console/network evidence on desktop and mobile.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing. Use the explicit path `specs/004-ui-ux-responsive`; do not infer scope from the current git branch.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel when different files are involved and no dependency exists
- **[Story]**: Maps to User Stories in `specs/004-ui-ux-responsive/spec.md`
- Every task includes exact file paths or explicit verification artifact paths

---

## Phase 1: Setup (Shared Documentation & Evidence Structure)

**Purpose**: Prepare the UI/UX package for safe inventory, evidence capture, and scoped fixes.

- [X] T001 Create initial UI findings log in `specs/004-ui-ux-responsive/ui-findings.md` with columns for id, surface, viewport, severity, evidence, API risk, fix scope, and status
- [X] T002 Create browser verification log in `specs/004-ui-ux-responsive/browser-verification.md` with desktop/mobile rows from `specs/004-ui-ux-responsive/contracts/ui-verification-contract.md`
- [X] T003 Create screenshot/evidence directory notes in `specs/004-ui-ux-responsive/browser-verification.md` for storing or linking screenshots/equivalent visual evidence
- [X] T004 [P] Add static public route checklist in `specs/004-ui-ux-responsive/ui-findings.md` covering `src/router.tsx`, `src/App.tsx`, `src/pages/ProjectsPage.tsx`, `src/pages/ProjectDetailsPage.tsx`, `src/pages/CareersPage.tsx`, `src/pages/ContactPage.tsx`, `src/pages/AboutPage.tsx`, and `src/pages/HSEPage.tsx`
- [X] T005 [P] Add static dashboard route checklist in `specs/004-ui-ux-responsive/ui-findings.md` covering `apps/dashboard/src/App.tsx`, `apps/dashboard/src/components/Layout.tsx`, `apps/dashboard/src/components/Sidebar.tsx`, and all files in `apps/dashboard/src/pages/`
- [X] T006 [P] Add shared UI pattern checklist in `specs/004-ui-ux-responsive/ui-findings.md` covering `packages/shared-ui/src/components/modals/GlobalModal.tsx`, `packages/shared-ui/src/components/forms/FormInput.tsx`, `packages/shared-ui/src/components/MediaUploadField.tsx`, `packages/shared-ui/src/components/EmptyState.tsx`, and `packages/shared-ui/src/components/ui/table.tsx`

---

## Phase 2: Foundational (Blocking Static & Runtime Preconditions)

**Purpose**: Establish baseline evidence and guardrails before any UI changes.

**CRITICAL**: No UI fix tasks should begin until static inventory and browser target setup are complete.

- [X] T007 Run static source inventory command from `specs/004-ui-ux-responsive/quickstart.md` and record findings in `specs/004-ui-ux-responsive/ui-findings.md`
- [X] T008 Verify no planned task changes API endpoints, request payloads, response shapes, auth behavior, or `Project.category` string compatibility; record guardrail in `specs/004-ui-ux-responsive/ui-findings.md`
- [X] T009 Verify Success stories remain documented as Page Content `home.successStories` in `specs/004-ui-ux-responsive/ui-findings.md` and do not plan a dedicated dashboard page
- [X] T010 [P] Inventory public loading, empty, and error states in `src/components/projects/ProjectPortfolioGrid.tsx`, `src/pages/ProjectDetailsPage.tsx`, `src/pages/CareersPage.tsx`, `src/components/contact/ContactForm.tsx`, and `src/components/ApplicationForm.tsx`
- [X] T011 [P] Inventory dashboard loading, empty, and error states in `apps/dashboard/src/pages/Projects.tsx`, `apps/dashboard/src/pages/ProjectCategories.tsx`, `apps/dashboard/src/pages/Services.tsx`, `apps/dashboard/src/pages/Partners.tsx`, `apps/dashboard/src/pages/Team.tsx`, `apps/dashboard/src/pages/Jobs.tsx`, `apps/dashboard/src/pages/Settings.tsx`, `apps/dashboard/src/pages/PageContent.tsx`, `apps/dashboard/src/pages/Messages.tsx`, and `apps/dashboard/src/pages/Applications.tsx`
- [X] T012 [P] Inventory dashboard table/list risks in `apps/dashboard/src/pages/Applications.tsx`, `apps/dashboard/src/pages/Messages.tsx`, `apps/dashboard/src/pages/Jobs.tsx`, and `apps/dashboard/src/pages/PageContent.tsx`
- [X] T013 [P] Inventory modal and sticky action risks in `packages/shared-ui/src/components/modals/GlobalModal.tsx`, `apps/dashboard/src/pages/Projects.tsx`, `apps/dashboard/src/pages/Partners.tsx`, `apps/dashboard/src/pages/Team.tsx`, `apps/dashboard/src/pages/Services.tsx`, `apps/dashboard/src/pages/Jobs.tsx`, `apps/dashboard/src/pages/Applications.tsx`, and `apps/dashboard/src/pages/Messages.tsx`
- [X] T014 [P] Inventory public navigation and page-level horizontal scroll risks in `src/components/Navbar.tsx`, `src/layouts/MainLayout.tsx`, `src/pages/ProjectsPage.tsx`, `src/components/projects/ProjectPortfolioFilters.tsx`, and `src/components/projects/MalawiProjectMap.tsx`
- [X] T015 Mark P1/P2/P3 severity for each static finding in `specs/004-ui-ux-responsive/ui-findings.md`
- [X] T016 Prepare browser verification targets for desktop 1440x1000 and mobile 390x844 in `specs/004-ui-ux-responsive/browser-verification.md`
- [X] T017 Document dev server requirements in `specs/004-ui-ux-responsive/browser-verification.md`, including `npm run dev`, `npm run dev:dashboard`, and API runtime only if local-safe API-backed states are needed
- [X] T018 If API runtime is needed for browser checks, verify local-safe API environment before `npm run dev:api` and record the decision in `specs/004-ui-ux-responsive/browser-verification.md`

**Checkpoint**: Static inventory and browser target matrix are ready. P1 fixes can begin only for findings recorded in `ui-findings.md`.

---

## Phase 3: User Story 1 - Public Site Responsive Clarity (Priority: P1) MVP

**Goal**: Public website pages remain readable, navigable, and visually stable on desktop and mobile without breaking API data contracts.

**Independent Test**: Verify public route targets at desktop and mobile with screenshots/evidence, console/network logs, horizontal scroll checks, and overlap notes.

### Tests and Checks for User Story 1

- [X] T019 [P] [US1] Run browser check for `/` on desktop and mobile with screenshots, console errors, failed network requests, horizontal scroll status, and overlap notes in `specs/004-ui-ux-responsive/browser-verification.md`
- [X] T020 [P] [US1] Run browser check for `/projects` on desktop and mobile with screenshots, console errors, failed network requests, filter usability, map/grid behavior, and horizontal scroll status in `specs/004-ui-ux-responsive/browser-verification.md`
- [X] T021 [P] [US1] Run browser check for `/projects/:id` on desktop and mobile with screenshots, console errors, failed network requests, gallery/sidebar behavior, and fallback state notes in `specs/004-ui-ux-responsive/browser-verification.md`
- [X] T022 [P] [US1] Run browser check for `/careers` on desktop and mobile with screenshots, console errors, failed network requests, jobs list behavior, application form usability, and upload control notes in `specs/004-ui-ux-responsive/browser-verification.md`
- [X] T023 [P] [US1] Run browser check for `/contact` on desktop and mobile with screenshots, console errors, failed network requests, contact form usability, info cards, and footer/map behavior in `specs/004-ui-ux-responsive/browser-verification.md`
- [X] T024 [P] [US1] Run browser check for `/about` and `/hse` on desktop and mobile with screenshots, console errors, failed network requests, media/card behavior, and page-level horizontal scroll status in `specs/004-ui-ux-responsive/browser-verification.md`
- [X] T025 [US1] Promote browser findings from T019-T024 into P1/P2/P3 entries in `specs/004-ui-ux-responsive/ui-findings.md`

### Implementation for User Story 1

- [X] T026 [US1] Fix only P1 mobile navigation findings proven for `src/components/Navbar.tsx`
- [X] T027 [US1] Fix only P1 public hero or full-screen section overlap findings proven for `src/components/Hero.tsx` and `src/App.tsx`
- [X] T028 [US1] Fix only P1 project filter, map, stats, grid, or page-level horizontal scroll findings proven for `src/pages/ProjectsPage.tsx`, `src/components/projects/ProjectPortfolioFilters.tsx`, `src/components/projects/ProjectPortfolioGrid.tsx`, `src/components/projects/ProjectPortfolioStats.tsx`, and `src/components/projects/MalawiProjectMap.tsx`
- [X] T029 [US1] Fix only P1 project detail layout, sticky sidebar, gallery, or fallback findings proven for `src/pages/ProjectDetailsPage.tsx`
- [X] T030 [US1] Fix only P1 careers job list, application form, or upload control findings proven for `src/pages/CareersPage.tsx` and `src/components/ApplicationForm.tsx`
- [X] T031 [US1] Fix only P1 contact form, contact info, footer, or map findings proven for `src/pages/ContactPage.tsx`, `src/components/contact/ContactForm.tsx`, `src/components/contact/ContactInfo.tsx`, `src/components/Footer.tsx`, and `src/components/footer/FooterMap.tsx`
- [X] T032 [US1] Fix only P1 public loading, empty, or error state findings proven for `src/components/projects/ProjectPortfolioGrid.tsx`, `src/pages/ProjectDetailsPage.tsx`, `src/pages/CareersPage.tsx`, `src/components/contact/ContactForm.tsx`, and `src/components/ApplicationForm.tsx`
- [X] T033 [US1] Re-run browser checks for all public targets touched by T026-T032 and update `specs/004-ui-ux-responsive/browser-verification.md` with screenshots, console/network evidence, horizontal scroll status, and pass/fail results
- [X] T034 [US1] Record public-site changed surfaces, remaining P2/P3 findings, and API contract risk status in `specs/004-ui-ux-responsive/ui-findings.md`

**Checkpoint**: Public site P1 responsive blockers are fixed or explicitly documented as blocked/deferred with evidence.

---

## Phase 4: User Story 2 - Dashboard Content Management Usability (Priority: P1)

**Goal**: Dashboard lists, forms, modals, content editors, and management flows are usable on desktop and mobile without API contract changes.

**Independent Test**: Verify dashboard management routes at desktop and mobile with screenshots/evidence, console/network logs, horizontal scroll checks, table/list behavior, form clarity, and modal usability notes.

### Tests and Checks for User Story 2

- [X] T035 [P] [US2] Run browser check for dashboard `/` shell and overview on desktop and mobile with screenshots, console errors, failed network requests, sidebar/header behavior, and horizontal scroll status in `specs/004-ui-ux-responsive/browser-verification.md`
- [X] T036 [P] [US2] Run browser check for dashboard `/projects` and `/project-categories` on desktop and mobile with screenshots, console/network evidence, card/list behavior, modals, forms, upload controls, category selector, and action reachability in `specs/004-ui-ux-responsive/browser-verification.md`
- [X] T037 [P] [US2] Run browser check for dashboard `/services`, `/partners`, and `/team` on desktop and mobile with screenshots, console/network evidence, card/list behavior, image controls, modal scrolling, and sticky footer action notes in `specs/004-ui-ux-responsive/browser-verification.md`
- [X] T038 [P] [US2] Run browser check for dashboard `/jobs`, `/settings`, and `/content` on desktop and mobile with screenshots, console/network evidence, long form behavior, tabs, dynamic fields, sticky actions, and horizontal scroll status in `specs/004-ui-ux-responsive/browser-verification.md`
- [X] T039 [P] [US2] Run browser check for dashboard `/messages` and `/applications` on desktop and mobile with screenshots, console/network evidence, table/list behavior, filters/status controls, detail modals, CV link visibility, and empty states in `specs/004-ui-ux-responsive/browser-verification.md`
- [X] T040 [US2] Promote dashboard browser findings from T035-T039 into P1/P2/P3 entries in `specs/004-ui-ux-responsive/ui-findings.md`

### Implementation for User Story 2

- [X] T041 [US2] Fix only P1 dashboard shell, sidebar, header, or mobile viewport findings proven for `apps/dashboard/src/components/Layout.tsx` and `apps/dashboard/src/components/Sidebar.tsx`
- [X] T042 [US2] Fix only P1 dashboard Projects and Project Categories card/list/form/modal findings proven for `apps/dashboard/src/pages/Projects.tsx` and `apps/dashboard/src/pages/ProjectCategories.tsx`
- [X] T043 [US2] Fix only P1 dashboard Services, Partners, and Team card/list/form/modal/upload findings proven for `apps/dashboard/src/pages/Services.tsx`, `apps/dashboard/src/pages/Partners.tsx`, and `apps/dashboard/src/pages/Team.tsx`
- [X] T044 [US2] Fix only P1 dashboard Jobs form/list/status findings proven for `apps/dashboard/src/pages/Jobs.tsx`
- [X] T045 [US2] Fix only P1 dashboard Settings long-form grouping, action reachability, or responsive spacing findings proven for `apps/dashboard/src/pages/Settings.tsx`
- [X] T046 [US2] Fix only P1 dashboard Page Content tabs, dynamic fields, array controls, media fields, or sticky action findings proven for `apps/dashboard/src/pages/PageContent.tsx`
- [X] T047 [US2] Fix only P1 dashboard Messages list/detail modal/filter findings proven for `apps/dashboard/src/pages/Messages.tsx`
- [X] T048 [US2] Fix only P1 dashboard Applications table/list/status/CV/modal findings proven for `apps/dashboard/src/pages/Applications.tsx`
- [X] T049 [US2] Fix only P1 shared modal scroll/action reachability findings proven across dashboard pages in `packages/shared-ui/src/components/modals/GlobalModal.tsx`
- [X] T050 [US2] Fix only P1 form label, validation, select, file input, or long placeholder findings proven across dashboard forms in `packages/shared-ui/src/components/forms/FormInput.tsx`
- [X] T051 [US2] Re-run browser checks for all dashboard targets touched by T041-T050 and update `specs/004-ui-ux-responsive/browser-verification.md` with screenshots, console/network evidence, horizontal scroll status, table/list notes, modal notes, and pass/fail results
- [X] T052 [US2] Record dashboard changed surfaces, remaining P2/P3 findings, and API contract risk status in `specs/004-ui-ux-responsive/ui-findings.md`

**Checkpoint**: Dashboard P1 responsive and management blockers are fixed or explicitly documented as blocked/deferred with evidence.

---

## Phase 5: User Story 3 - Visual Consistency Across Shared UI (Priority: P2)

**Goal**: Repeated UI components feel consistent across public and dashboard surfaces after P1 blockers are handled.

**Independent Test**: Compare representative shared patterns across checked routes and confirm consistent spacing, labels, button hierarchy, state clarity, focus/hover behavior, and media dimensions without broad redesign.

### Tests and Checks for User Story 3

- [X] T053 [P] [US3] Audit button hierarchy and action clarity across `src/components/Navbar.tsx`, `src/components/ApplicationForm.tsx`, `apps/dashboard/src/pages/Projects.tsx`, `apps/dashboard/src/pages/PageContent.tsx`, and `packages/shared-ui/src/components/ui/button.tsx`; record P2 findings in `specs/004-ui-ux-responsive/ui-findings.md`
- [X] T054 [P] [US3] Audit empty/loading/error state consistency across public and dashboard surfaces listed in T010-T011; record P2 findings in `specs/004-ui-ux-responsive/ui-findings.md`
- [X] T055 [P] [US3] Audit shared card, badge, table, and media placeholder consistency in `packages/shared-ui/src/components/EmptyState.tsx`, `packages/shared-ui/src/components/MediaUploadField.tsx`, `packages/shared-ui/src/components/ui/card.tsx`, `packages/shared-ui/src/components/ui/badge.tsx`, `packages/shared-ui/src/components/ui/table.tsx`, `src/components/projects/ProjectPortfolioGrid.tsx`, and `apps/dashboard/src/pages/Applications.tsx`; record P2 findings in `specs/004-ui-ux-responsive/ui-findings.md`

### Implementation for User Story 3

- [X] T056 [US3] Fix only P2 shared button hierarchy or action clarity findings proven for `packages/shared-ui/src/components/ui/button.tsx`, `src/components/Navbar.tsx`, `src/components/ApplicationForm.tsx`, `apps/dashboard/src/pages/Projects.tsx`, and `apps/dashboard/src/pages/PageContent.tsx`
- [X] T057 [US3] Fix only P2 empty/loading/error state consistency findings proven for `packages/shared-ui/src/components/EmptyState.tsx`, `src/components/projects/ProjectPortfolioGrid.tsx`, `src/pages/ProjectDetailsPage.tsx`, `apps/dashboard/src/pages/Messages.tsx`, and `apps/dashboard/src/pages/Applications.tsx`
- [X] T058 [US3] Fix only P2 shared media upload and placeholder stability findings proven for `packages/shared-ui/src/components/MediaUploadField.tsx`, `src/components/ui/Image.tsx`, and `packages/shared-ui/src/components/ui/image.tsx`
- [X] T059 [US3] Fix only P2 card, badge, and table consistency findings proven for `packages/shared-ui/src/components/ui/card.tsx`, `packages/shared-ui/src/components/ui/badge.tsx`, and `packages/shared-ui/src/components/ui/table.tsx`
- [X] T060 [US3] Re-run representative browser checks for shared UI changes and update `specs/004-ui-ux-responsive/browser-verification.md` with screenshots, console/network evidence, and pass/fail results
- [X] T061 [US3] Document remaining P3 polish-only follow-ups in `specs/004-ui-ux-responsive/ui-findings.md`

**Checkpoint**: P2 consistency issues are fixed where scoped and evidence-backed; P3 polish is documented.

---

## Phase 6: User Story 4 - Verification Evidence for Desktop and Mobile (Priority: P2)

**Goal**: Produce reviewable evidence that UI/UX improvements did not break responsive behavior or API-connected workflows.

**Independent Test**: Execute final browser/static/build verification and confirm evidence exists for required desktop/mobile targets.

### Tests and Checks for User Story 4

- [X] T062 [US4] Verify `specs/004-ui-ux-responsive/browser-verification.md` has desktop and mobile entries for all required public targets from `specs/004-ui-ux-responsive/contracts/ui-verification-contract.md`
- [X] T063 [US4] Verify `specs/004-ui-ux-responsive/browser-verification.md` has desktop and mobile entries for all required dashboard targets from `specs/004-ui-ux-responsive/contracts/ui-verification-contract.md`
- [X] T064 [US4] Verify all browser evidence entries in `specs/004-ui-ux-responsive/browser-verification.md` include console error summary and failed network request summary
- [X] T065 [US4] Verify all browser evidence entries in `specs/004-ui-ux-responsive/browser-verification.md` include page-level horizontal scroll status and visible overlap/clipped primary action status
- [X] T066 [US4] Verify `specs/004-ui-ux-responsive/ui-findings.md` has no unresolved P1 finding without fixed, blocked, or deferred status
- [X] T067 [US4] Verify API contract guardrails remain documented in `specs/004-ui-ux-responsive/ui-findings.md`, including `Project.category` string and Success stories Page Content path

### Implementation for User Story 4

- [X] T068 [US4] Update `specs/004-ui-ux-responsive/quickstart.md` with final browser command notes, screenshots/evidence locations, console/network results, and any blocked browser checks
- [X] T069 [US4] Update `specs/004-ui-ux-responsive/ui-surface-inventory.md` with final changed surfaces, fixed findings, deferred follow-ups, and remaining P2/P3 priorities

**Checkpoint**: Verification evidence is complete and reviewable.

---

## Final Phase: Build, Contract Guardrails & Documentation

**Purpose**: Run final verification commands and document outcomes without adding features.

- [X] T070 Run `npm run typecheck` and record result in `specs/004-ui-ux-responsive/quickstart.md`
- [X] T071 Run `npm run build` for the public site and record result plus any Vite warnings in `specs/004-ui-ux-responsive/quickstart.md`
- [X] T072 Run `npm run build --workspace=apps/dashboard` and record result plus any Vite warnings in `specs/004-ui-ux-responsive/quickstart.md`
- [X] T073 Run `npm run test --workspace=apps/api` only if UI changes touched API request/response assumptions; otherwise document why it was not needed in `specs/004-ui-ux-responsive/quickstart.md`
- [X] T074 Verify no implementation changed `Project.category` away from string contract in `apps/api/src/models/Project.ts`, `apps/dashboard/src/pages/Projects.tsx`, and `src/pages/ProjectsPage.tsx`
- [X] T075 Verify Success stories remain managed through Page Content `home.successStories` in `src/components/Partners.tsx`, `apps/dashboard/src/pages/PageContent.tsx`, and `specs/004-ui-ux-responsive/ui-findings.md`
- [X] T076 Verify no broad redesign or unapproved dedicated Success stories dashboard page was introduced by reviewing `apps/dashboard/src/App.tsx`, `apps/dashboard/src/components/Sidebar.tsx`, and `specs/004-ui-ux-responsive/ui-findings.md`
- [X] T077 Update `specs/004-ui-ux-responsive/quickstart.md` with final summary, changed surfaces, verification results, and deferred follow-ups

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies; must create evidence/log structure first.
- **Phase 2 Foundational**: Depends on Phase 1; blocks all fixes.
- **Phase 3 US1 Public P1**: Depends on Phase 2 and should be completed before P2 polish work.
- **Phase 4 US2 Dashboard P1**: Depends on Phase 2 and can run alongside US1 only if browser/dev-server evidence is coordinated.
- **Phase 5 US3 Shared P2**: Depends on US1/US2 P1 findings so shared fixes do not mask blockers.
- **Phase 6 US4 Evidence**: Depends on selected US1/US2/US3 implementation phases.
- **Final Phase**: Depends on selected implementation phases and browser evidence completion.

### User Story Dependencies

- **US1 Public Site Responsive Clarity**: Can start after Foundational. MVP for visitor-facing value.
- **US2 Dashboard Content Management Usability**: Can start after Foundational. Independent from US1 but shares browser/dev-server setup.
- **US3 Visual Consistency Across Shared UI**: Starts after P1 blockers are handled to avoid polish-driven churn.
- **US4 Verification Evidence**: Runs after implemented fixes to prove desktop/mobile behavior and evidence completeness.

### Within Each User Story

- Checks and evidence tasks MUST run before fixes.
- Fix tasks MUST target only findings recorded in `specs/004-ui-ux-responsive/ui-findings.md`.
- Browser re-checks MUST run after each implemented story scope.
- API contract guardrails MUST be re-verified when a changed UI surface uses API data.

### Parallel Opportunities

- T004-T006 can run in parallel after T001-T003.
- T010-T014 can run in parallel during foundational static inventory.
- T019-T024 can run in parallel if browser sessions/dev servers are coordinated.
- T035-T039 can run in parallel if dashboard auth/data setup is available and browser sessions are coordinated.
- T053-T055 can run in parallel after P1 fixes are recorded.

---

## Parallel Example: Public Site US1

```text
Task: T019 browser check `/`
Task: T020 browser check `/projects`
Task: T021 browser check `/projects/:id`
Task: T022 browser check `/careers`
Task: T023 browser check `/contact`
Task: T024 browser check `/about` and `/hse`
```

---

## Parallel Example: Dashboard US2

```text
Task: T035 browser check dashboard shell
Task: T036 browser check projects/categories
Task: T037 browser check services/partners/team
Task: T038 browser check jobs/settings/content
Task: T039 browser check messages/applications
```

---

## Implementation Strategy

### MVP First (US1 Public P1)

1. Complete Phase 1 setup and Phase 2 foundational inventory.
2. Run public browser checks T019-T024.
3. Fix only P1 public findings T026-T032.
4. Re-run public browser checks T033 and document results T034.

### Next Increment (US2 Dashboard P1)

1. Run dashboard browser checks T035-T039.
2. Fix only P1 dashboard findings T041-T050.
3. Re-run dashboard browser checks T051 and document results T052.

### P2 Consistency Increment

1. Audit shared patterns T053-T055.
2. Fix scoped P2 shared issues T056-T059.
3. Re-run representative checks T060 and document P3 follow-ups T061.

### Final Verification

1. Complete evidence completeness checks T062-T067.
2. Update docs T068-T069.
3. Run final commands T070-T073.
4. Re-verify contract guardrails T074-T076.
5. Close with final summary T077.

---

## Notes

- Browser verification tasks require dev servers and screenshots or equivalent visual evidence.
- Console/network evidence is mandatory for browser verification entries.
- Do not start `npm run dev:api` unless API-backed states are needed and the environment is verified local-safe.
- Do not implement broad redesigns; each fix must map to a recorded finding.
- Do not change API contracts, `Project.category` string behavior, or the accepted Success stories Page Content path.
