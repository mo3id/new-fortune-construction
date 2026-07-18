# Tasks: Error Pages and Global Error Handling

**Input**: Design documents from `/specs/008-error-pages-handling/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/error-handling-ui-contract.md](./contracts/error-handling-ui-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Browser verification targets are required by the spec. No API contract tests are added because API routes and payloads must remain unchanged.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently after the foundational phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other marked tasks in the same phase when file paths do not overlap
- **[Story]**: User story label from `spec.md`
- Every task includes an exact file path or command target

## Phase 1: Setup and Static Inventory

**Purpose**: Reconfirm the live code state before implementation and define browser verification targets up front.

- [X] T001 Run static inventory for public routing and existing public ErrorBoundary using `rg -n "ErrorBoundary|errorElement|useRouteError|path=\"\\*\"|createBrowserRouter|RouterProvider|Suspense" src` and record any drift in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/tasks.md`
- [X] T002 Run static inventory for dashboard routing and silent redirect behavior using `rg -n "ErrorBoundary|Routes|Route|Navigate|path=\"\\*\"|BrowserRouter|Suspense" apps/dashboard/src` and record any drift in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/tasks.md`
- [X] T003 Run static inventory for public and dashboard network/API error states using `rg -n "useQuery|isError|error\\b|toast\\.error|apiFetch|axios|setError|errors\\." src apps/dashboard/src` and record validation-vs-network touchpoints in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/tasks.md`
- [X] T004 [P] Confirm public browser verification targets for 404, runtime/chunk error, and network unavailable desktop/mobile in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`
- [X] T005 [P] Confirm dashboard browser verification targets for 404, runtime/chunk error, and network unavailable desktop/mobile in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`
- [X] T006 [P] Confirm production safety checks for hidden stack traces, secrets, raw payloads, internal hostnames, and DEV-only diagnostics in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`

---

## Phase 2: Foundational Error State Primitives

**Purpose**: Shared frontend-only helpers and primitives that block all user story work.

- [X] T007 Create typed public error classification helpers for runtime, route, chunk/load, network/API unavailable, and not-found states in `/Users/mohamedeidali/Desktop/fortune-construction/src/lib/errorHandling.ts`
- [X] T008 [P] Create typed dashboard error classification helpers for Axios/network/API unavailable and runtime/chunk states in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/lib/errorHandling.ts`
- [X] T009 [P] Add public reusable data-unavailable UI component with retry/navigation props in `/Users/mohamedeidali/Desktop/fortune-construction/src/components/errors/DataUnavailableState.tsx`
- [X] T010 [P] Add dashboard reusable data-unavailable UI component with retry/navigation props in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/components/errors/DataUnavailableState.tsx`
- [X] T011 Update public API client error throwing to preserve network/API unavailable classification without changing API routes or response contracts in `/Users/mohamedeidali/Desktop/fortune-construction/src/lib/apiClient.ts`
- [X] T012 Update dashboard Axios helpers/interceptors to preserve network/API unavailable classification while keeping 401 auth behavior unchanged in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/lib/api.ts`

**Checkpoint**: Public and dashboard code can classify errors consistently without changing API contracts or validation behavior.

---

## Phase 3: User Story 1 - Clear Not Found Experience (Priority: P1) MVP

**Goal**: Unknown public and dashboard routes show explicit 404 states instead of blank screens or silent redirects.

**Independent Test**: Open unknown public and dashboard paths on desktop and mobile; each surface shows a 404 state with safe messaging, recovery actions, and no silent redirect.

### Browser Verification Targets for User Story 1

- [X] T013 [P] [US1] Add public 404 browser check target for desktop and mobile unknown routes in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`
- [X] T014 [P] [US1] Add dashboard 404 browser check target for desktop and mobile unknown routes in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`

### Implementation for User Story 1

- [X] T015 [P] [US1] Add safe public not-found SEO profile without changing existing normal-page SEO profiles in `/Users/mohamedeidali/Desktop/fortune-construction/src/lib/seo.ts`
- [X] T016 [P] [US1] Create public NotFoundPage with safe copy, recovery actions, and not-found metadata in `/Users/mohamedeidali/Desktop/fortune-construction/src/pages/NotFoundPage.tsx`
- [X] T017 [US1] Add public catch-all not-found route under MainLayout without changing existing public route paths in `/Users/mohamedeidali/Desktop/fortune-construction/src/router.tsx`
- [X] T018 [P] [US1] Create dashboard NotFoundPage with dashboard-native copy and safe recovery actions in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/pages/NotFoundPage.tsx`
- [X] T019 [US1] Replace dashboard wildcard redirect with explicit NotFoundPage while preserving login redirect behavior in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/App.tsx`
- [X] T020 [US1] Verify ProjectDetailsPage separates confirmed missing project from network/API unavailable before rendering not-found messaging in `/Users/mohamedeidali/Desktop/fortune-construction/src/pages/ProjectDetailsPage.tsx`

**Checkpoint**: User Story 1 is complete when public and dashboard unknown routes show explicit 404 pages and existing route meanings are preserved.

---

## Phase 4: User Story 2 - Safe General Error Recovery (Priority: P1)

**Goal**: Runtime, route, and chunk/load failures show safe general error pages with recovery actions instead of blank screens.

**Independent Test**: Trigger representative public and dashboard runtime/chunk failures; each surface shows a safe general error state with reload/navigation actions and no production stack trace.

### Browser Verification Targets for User Story 2

- [X] T021 [P] [US2] Add public runtime/chunk error browser check target for desktop and mobile in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`
- [X] T022 [P] [US2] Add dashboard runtime/chunk error browser check target for desktop and mobile in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`

### Implementation for User Story 2

- [X] T023 [P] [US2] Create public AppErrorPage for runtime, route, and chunk/load failures with production-safe copy in `/Users/mohamedeidali/Desktop/fortune-construction/src/pages/AppErrorPage.tsx`
- [X] T024 [US2] Update public ErrorBoundary to render AppErrorPage, classify chunk/load errors, and show technical details only in DEV in `/Users/mohamedeidali/Desktop/fortune-construction/src/components/ErrorBoundary.tsx`
- [X] T025 [US2] Mount public ErrorBoundary around RouterProvider without changing QueryClient behavior in `/Users/mohamedeidali/Desktop/fortune-construction/src/main.tsx`
- [X] T026 [US2] Add public route-level error handling for route errors while preserving existing lazy route loading in `/Users/mohamedeidali/Desktop/fortune-construction/src/router.tsx`
- [X] T027 [P] [US2] Create dashboard AppErrorPage for runtime, route, and chunk/load failures with production-safe copy in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/pages/AppErrorPage.tsx`
- [X] T028 [P] [US2] Create dashboard ErrorBoundary that renders AppErrorPage and gates technical details to DEV in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/components/ErrorBoundary.tsx`
- [X] T029 [US2] Mount dashboard ErrorBoundary around App without changing BrowserRouter, QueryClientProvider, or Toaster behavior in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/main.tsx`
- [X] T030 [US2] Wrap dashboard lazy route elements or route shell with safe error fallback behavior while preserving protected route behavior in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/App.tsx`

**Checkpoint**: User Story 2 is complete when public and dashboard runtime/chunk failures show safe recoverable error states.

---

## Phase 5: User Story 3 - Data Unavailable States Without Validation Confusion (Priority: P1)

**Goal**: Network/API unavailable failures render availability states, while validation errors remain inline in their forms/actions.

**Independent Test**: Simulate API/network unavailable states on representative public and dashboard data pages, then submit invalid forms and confirm validation remains inline.

### Browser Verification Targets for User Story 3

- [X] T031 [P] [US3] Add public network/API unavailable browser check target for projects or project detail desktop/mobile in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`
- [X] T032 [P] [US3] Add dashboard network/API unavailable browser check target for overview or projects desktop/mobile in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`
- [X] T033 [P] [US3] Add validation separation browser check target for public and dashboard invalid form submissions in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`

### Implementation for User Story 3

- [X] T034 [US3] Render public data-unavailable state for projects list API failure without hiding allowed fallback content in `/Users/mohamedeidali/Desktop/fortune-construction/src/pages/ProjectsPage.tsx`
- [X] T035 [US3] Render public data-unavailable state for project detail API/network failure separately from true not-found in `/Users/mohamedeidali/Desktop/fortune-construction/src/pages/ProjectDetailsPage.tsx`
- [X] T036 [P] [US3] Audit public form validation remains inline and unchanged in `/Users/mohamedeidali/Desktop/fortune-construction/src/components/contact/ContactForm.tsx`
- [X] T037 [P] [US3] Audit public application form validation remains inline and unchanged in `/Users/mohamedeidali/Desktop/fortune-construction/src/components/ApplicationForm.tsx`
- [X] T038 [US3] Render dashboard data-unavailable state for overview stats API failure instead of stale empty dashboard content in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/pages/Overview.tsx`
- [X] T039 [US3] Render dashboard data-unavailable state for projects API failure while preserving form validation and mutation toasts in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/pages/Projects.tsx`
- [X] T040 [P] [US3] Ensure dashboard shared form field validation rendering remains inline and unchanged in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/lib/dashboardSharedUi.tsx`
- [X] T041 [US3] Degrade dashboard layout stats safely when the API is unavailable without blocking page navigation in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/components/Layout.tsx`

**Checkpoint**: User Story 3 is complete when availability failures are visibly distinct from validation errors across representative public and dashboard pages.

---

## Phase 6: User Story 4 - Developer Diagnostics Without Production Leakage (Priority: P2)

**Goal**: Development mode provides useful diagnostics, while production mode never displays stack traces, secrets, raw payloads, internal hostnames, or private config.

**Independent Test**: Compare development and production-like error states for the same simulated failures and confirm only DEV renders technical details.

### Browser Verification Targets for User Story 4

- [X] T042 [P] [US4] Add DEV diagnostics browser check target for public and dashboard general error states in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`
- [X] T043 [P] [US4] Add production redaction browser check target for public and dashboard general error states in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`

### Implementation for User Story 4

- [X] T044 [US4] Ensure public AppErrorPage renders technical details only behind `import.meta.env.DEV` in `/Users/mohamedeidali/Desktop/fortune-construction/src/pages/AppErrorPage.tsx`
- [X] T045 [US4] Ensure dashboard AppErrorPage renders technical details only behind `import.meta.env.DEV` in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/pages/AppErrorPage.tsx`
- [X] T046 [US4] Review public and dashboard error classifiers to sanitize production-safe messages in `/Users/mohamedeidali/Desktop/fortune-construction/src/lib/errorHandling.ts`
- [X] T047 [US4] Review dashboard error classifiers to sanitize production-safe messages in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/lib/errorHandling.ts`

**Checkpoint**: User Story 4 is complete when DEV-only diagnostics work and production UI remains redacted.

---

## Phase 7: User Story 5 - Cross-Surface Verification (Priority: P2)

**Goal**: Prove type safety, production builds, and desktop/mobile browser behavior for public and dashboard error states.

**Independent Test**: Run the required commands and browser checks, then record non-sensitive verification evidence.

### Verification for User Story 5

- [X] T048 [US5] Run `npm run typecheck` from `/Users/mohamedeidali/Desktop/fortune-construction` and record the result in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`
- [X] T049 [US5] Run `npm run build` from `/Users/mohamedeidali/Desktop/fortune-construction` and record the result in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`
- [X] T050 [US5] Run `npm run build --workspace=apps/dashboard` from `/Users/mohamedeidali/Desktop/fortune-construction` and record the result in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`
- [X] T051 [US5] Start public dev server with `npm run dev` and browser-check public 404 desktop/mobile in `/Users/mohamedeidali/Desktop/fortune-construction`
- [X] T052 [US5] Browser-check public runtime/chunk error desktop/mobile against the safe simulation target in `/Users/mohamedeidali/Desktop/fortune-construction`
- [X] T053 [US5] Browser-check public network/API unavailable desktop/mobile against representative data page in `/Users/mohamedeidali/Desktop/fortune-construction`
- [X] T054 [US5] Start dashboard dev server with `npm run dev --workspace=apps/dashboard` and browser-check dashboard 404 desktop/mobile in `/Users/mohamedeidali/Desktop/fortune-construction`
- [X] T055 [US5] Browser-check dashboard runtime/chunk error desktop/mobile against the safe simulation target in `/Users/mohamedeidali/Desktop/fortune-construction`
- [X] T056 [US5] Browser-check dashboard network/API unavailable desktop/mobile against representative data page in `/Users/mohamedeidali/Desktop/fortune-construction`
- [X] T057 [US5] Browser-check public and dashboard invalid form submissions to confirm validation errors remain inline in `/Users/mohamedeidali/Desktop/fortune-construction`
- [X] T058 [US5] Inspect production-mode public and dashboard error UI for absence of stack traces, secrets, raw payloads, internal hostnames, and environment values in `/Users/mohamedeidali/Desktop/fortune-construction`

**Checkpoint**: User Story 5 is complete when command and browser evidence covers all required scenarios.

---

## Final Phase: Polish and Cross-Cutting Safety

**Purpose**: Ensure the package is coherent, scoped, and ready for implementation review.

- [X] T059 [P] Review public routes remain unchanged except 404/error handling in `/Users/mohamedeidali/Desktop/fortune-construction/src/router.tsx`
- [X] T060 [P] Review dashboard routes remain unchanged except wildcard not-found handling in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/App.tsx`
- [X] T061 [P] Review normal-page SEO profiles remain unchanged except safe 404/error metadata additions in `/Users/mohamedeidali/Desktop/fortune-construction/src/lib/seo.ts`
- [X] T062 [P] Review API contracts and routes were not modified for this frontend-only feature in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src`
- [X] T063 Update implementation notes and final verification evidence in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 Setup and Static Inventory**: No dependencies; must run first.
- **Phase 2 Foundational**: Depends on Phase 1; blocks all user stories.
- **User Story Phases**: Depend on Phase 2. Recommended order is US1, US2, US3, US4, US5 because route foundations and error components support later verification.
- **Final Phase**: Depends on all implemented user stories.

### User Story Dependencies

- **US1 Clear Not Found Experience**: Depends on foundational classification/primitive decisions; can be tested independently after public/dashboard route changes.
- **US2 Safe General Error Recovery**: Depends on foundational helpers; can proceed in parallel with US1 after Phase 2, but touches `src/router.tsx` and `apps/dashboard/src/App.tsx`, so coordinate edits.
- **US3 Data Unavailable States**: Depends on foundational error classification; independent from US1/US2 except for shared components.
- **US4 Developer Diagnostics Without Production Leakage**: Depends on US2 AppErrorPage implementations.
- **US5 Cross-Surface Verification**: Depends on whichever user stories are in scope for verification; full completion depends on US1-US4.

### Parallel Opportunities

- T004, T005, and T006 can run in parallel after inventory commands are understood.
- T008, T009, and T010 can run in parallel because they touch dashboard helpers and separate public/dashboard UI components.
- T015, T016, and T018 can run in parallel before route integration.
- T023, T027, and T028 can run in parallel before entrypoint mounting.
- T036, T037, and T040 can run in parallel as validation audits.
- T042 and T043 can run in parallel as verification target documentation.
- T059 through T062 can run in parallel during final review.

---

## Parallel Example: User Story 1

```text
Task: "Add safe public not-found SEO profile without changing existing normal-page SEO profiles in src/lib/seo.ts"
Task: "Create public NotFoundPage with safe copy, recovery actions, and not-found metadata in src/pages/NotFoundPage.tsx"
Task: "Create dashboard NotFoundPage with dashboard-native copy and safe recovery actions in apps/dashboard/src/pages/NotFoundPage.tsx"
```

## Parallel Example: User Story 2

```text
Task: "Create public AppErrorPage for runtime, route, and chunk/load failures with production-safe copy in src/pages/AppErrorPage.tsx"
Task: "Create dashboard AppErrorPage for runtime, route, and chunk/load failures with production-safe copy in apps/dashboard/src/pages/AppErrorPage.tsx"
Task: "Create dashboard ErrorBoundary that renders AppErrorPage and gates technical details to DEV in apps/dashboard/src/components/ErrorBoundary.tsx"
```

## Parallel Example: User Story 3

```text
Task: "Audit public form validation remains inline and unchanged in src/components/contact/ContactForm.tsx"
Task: "Audit public application form validation remains inline and unchanged in src/components/ApplicationForm.tsx"
Task: "Ensure dashboard shared form field validation rendering remains inline and unchanged in apps/dashboard/src/lib/dashboardSharedUi.tsx"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 static inventory and verification target setup.
2. Complete Phase 2 foundational helpers and reusable unavailable-state components.
3. Complete Phase 3 User Story 1 for public and dashboard 404 handling.
4. Stop and validate unknown public/dashboard routes on desktop and mobile.

### Incremental Delivery

1. Add US1 404 handling and verify route behavior.
2. Add US2 runtime/chunk fallback handling and verify safe recovery.
3. Add US3 network/API unavailable handling and verify validation separation.
4. Add US4 DEV/production diagnostic separation.
5. Complete US5 command and browser verification evidence.

### Safety Rules

- Do not change API endpoints, request/response shapes, auth behavior, or backend route contracts.
- Do not change existing public or dashboard route meanings except replacing silent wildcard redirects with explicit 404 handling.
- Do not change normal-page SEO outputs except adding safe metadata for 404/error pages.
- Do not display production stack traces, secrets, raw payloads, internal hostnames, environment values, or private route details.
- Keep validation errors inline and scoped to forms/fields/actions.

## Implementation Notes

- Static inventory reconfirmed that the public app needed `ErrorBoundary` mounting, route `errorElement`, and catch-all not-found handling.
- Static inventory reconfirmed that the dashboard wildcard route used a silent redirect and now renders an explicit authenticated not-found state while preserving unauthenticated `/login` redirects.
- Public and dashboard error helpers classify runtime, route, chunk/load, network/API unavailable, and not-found errors without changing backend API routes or payload contracts.
- Public and dashboard runtime/chunk browser checks use DEV-only `?fortune_error=runtime` and `?fortune_error=chunk` probes; production bundles do not include those probe strings.
- Public and dashboard unavailable states are separate from form validation. Public contact and dashboard login invalid submissions were checked as inline validation states.
- Verification evidence is recorded in `/Users/mohamedeidali/Desktop/fortune-construction/specs/008-error-pages-handling/quickstart.md`.
