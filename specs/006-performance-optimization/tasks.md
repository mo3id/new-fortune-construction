# Tasks: Website and Dashboard Performance Optimization

**Input**: Design documents from `specs/006-performance-optimization/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/performance-verification-contract.md`, `quickstart.md`, `performance-inventory.md`  
**Tests**: Verification is required through build outputs, typecheck, static checks, and browser checks only where runtime/UI evidence is needed. API tests are only required if API request/response assumptions change.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks in the same phase when files do not conflict
- **[Story]**: User story label from `spec.md`
- Every task includes an exact file path or command-output documentation target

## Guardrails

- Do not change API endpoints, payloads, response shapes, auth behavior, API base URL assumptions, or public/dashboard API contracts.
- Do not change SEO outputs: metadata, canonical URLs, Open Graph/Twitter metadata, sitemap, robots, structured data, or route indexability.
- Do not rename, remove, or add dashboard routes.
- Preserve `Project.category` as a string contract.
- Preserve Success Stories management through Page Content.
- Do not perform media re-encoding, CDN/media pipeline work, API pagination, or API cache changes in this package; document those as deferred.
- Start API runtime only after confirming a local-safe environment; if not needed, do not start API.

---

## Phase 1: Setup (Shared Documentation and Verification Structure)

**Purpose**: Prepare tracking files and confirm the current plan artifacts before any implementation work.

- [X] T001 Confirm `specs/006-performance-optimization/plan.md` references the current performance scope and guardrails.
- [X] T002 Confirm `specs/006-performance-optimization/performance-inventory.md` includes the current public and dashboard build baseline.
- [X] T003 [P] Create or update a verification log section in `specs/006-performance-optimization/quickstart.md` for future command results.
- [X] T004 [P] Create or update a browser evidence checklist section in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T005 [P] Confirm `specs/006-performance-optimization/contracts/performance-verification-contract.md` covers build, browser, SEO, API-contract, and dashboard-route guardrails.
- [X] T006 Record that optional Spec Kit git hooks were not executed in `specs/006-performance-optimization/quickstart.md`.

---

## Phase 2: Foundational (Blocking Verification Baseline)

**Purpose**: Capture evidence that all later fixes must reference. No user-story implementation begins until this phase is complete.

- [X] T007 Run `npm run build` and record public chunk sizes and warnings in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T008 Run `npm run build --workspace=apps/dashboard` and record dashboard chunk sizes and warnings in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T009 Run `npm run typecheck` and record result in `specs/006-performance-optimization/quickstart.md`.
- [X] T010 [P] Re-run static route import scan for `src/router.tsx` and `apps/dashboard/src/App.tsx`, then update `specs/006-performance-optimization/performance-inventory.md`.
- [X] T011 [P] Re-run static media/image scan for `src/components/hero/VideoBackground.tsx`, `src/components/ui/Image.tsx`, and `packages/shared-ui/src/components/ui/image.tsx`, then update `specs/006-performance-optimization/performance-inventory.md`.
- [X] T012 [P] Re-run static render/filter scan for `apps/dashboard/src/pages/Applications.tsx`, then update `specs/006-performance-optimization/performance-inventory.md`.
- [X] T013 Confirm no implementation task starts unless its finding is listed in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T014 Confirm deferred exclusions for media re-encoding, API pagination, and API cache changes in `specs/006-performance-optimization/performance-inventory.md`.

**Checkpoint**: Baseline ready. User-story implementation can now begin in priority order.

---

## Phase 3: User Story 1 - Baseline Performance Inventory (Priority: P1) 🎯 MVP

**Goal**: Provide a complete evidence-based inventory of performance risks and safe fix candidates.

**Independent Test**: Review `performance-inventory.md` and `quickstart.md` to confirm each finding has source/build evidence, priority, proposed verification, and clear deferral status.

### Verification for User Story 1

- [X] T015 [P] [US1] Verify public build baseline includes main JS, CSS, gzip sizes, and Vite warning in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T016 [P] [US1] Verify dashboard build baseline includes main JS, CSS, gzip sizes, Vite chunk warning, and dynamic import warning in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T017 [P] [US1] Verify public findings PERF-PUBLIC-001 through PERF-PUBLIC-004 include source paths and candidate fixes in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T018 [P] [US1] Verify dashboard findings PERF-DASH-001 through PERF-DASH-003 include source paths and candidate fixes in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T019 [US1] Verify every candidate fix in `specs/006-performance-optimization/performance-inventory.md` maps to a later task ID in `specs/006-performance-optimization/tasks.md`.

### Implementation for User Story 1

- [X] T020 [US1] Add status fields for all performance findings in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T021 [US1] Add a command-results table for `npm run build`, `npm run build --workspace=apps/dashboard`, and `npm run typecheck` in `specs/006-performance-optimization/quickstart.md`.
- [X] T022 [US1] Add browser evidence placeholders for public routes in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T023 [US1] Add browser evidence placeholders for dashboard routes in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T024 [US1] Add a guardrail checklist for API contracts, SEO outputs, dashboard routes, `Project.category`, and Success Stories in `specs/006-performance-optimization/quickstart.md`.
- [X] T025 [US1] Mark US1 complete only after `specs/006-performance-optimization/performance-inventory.md` has no finding without evidence.

**Checkpoint**: US1 is complete when the inventory can be used to reject unsupported optimizations.

---

## Phase 4: User Story 2 - Public Site Loading and Asset Performance (Priority: P1)

**Goal**: Reduce avoidable public-site initial bundle and media/image loading work while preserving current UI, routes, API behavior, and SEO outputs.

**Independent Test**: Compare before/after public build output, then run public browser checks only if route splitting or media behavior changes require runtime evidence.

### Verification for User Story 2

- [X] T026 [P] [US2] Record pre-change public route list and SEO guardrails for `src/router.tsx` and `src/components/SeoHead.tsx` in `specs/006-performance-optimization/quickstart.md`.
- [X] T027 [P] [US2] Record pre-change public media behavior for `src/components/hero/VideoBackground.tsx` in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T028 [P] [US2] Record pre-change image component behavior for `src/components/ui/Image.tsx` and `packages/shared-ui/src/components/ui/image.tsx` in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T029 [US2] Run `npm run build` before public changes and record public chunk baseline in `specs/006-performance-optimization/performance-inventory.md`.

### Implementation for User Story 2

- [X] T030 [US2] Implement route-level lazy loading for public pages in `src/router.tsx` without changing route paths.
- [X] T031 [US2] Add a stable public route loading fallback in `src/router.tsx` or an existing public layout file without changing visible page content.
- [X] T032 [US2] Preserve `/`, `/about`, `/projects`, `/projects/:id`, `/services`, `/hse`, `/careers`, and `/contact` route registration in `src/router.tsx`.
- [X] T033 [US2] Add safe default `loading` and `decoding` behavior with caller override support in `src/components/ui/Image.tsx`.
- [X] T034 [US2] Add safe default `loading` and `decoding` behavior with caller override support in `packages/shared-ui/src/components/ui/image.tsx`.
- [X] T035 [US2] Update critical above-the-fold image call sites, if any, to explicitly opt out of lazy defaults in `src/components/` or `src/pages/`.
- [X] T036 [US2] Adjust hero video rendering/preload behavior in `src/components/hero/VideoBackground.tsx` to avoid mounting all non-critical videos at once while preserving rotation behavior.
- [X] T037 [US2] Preserve hero video source contract from `src/lib/constants.ts` without re-encoding or replacing media files.
- [X] T038 [US2] Run `npm run build` and record public chunk results, remaining warnings, and SEO static file presence in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T039 [US2] Run public browser checks for `/`, `/projects`, `/projects/:id`, `/services`, `/about`, `/hse`, `/careers`, and `/contact` only if runtime evidence is needed, then record console/network/horizontal-scroll/clipped-action/SEO status in `specs/006-performance-optimization/performance-inventory.md`.

**Checkpoint**: US2 is complete when public build passes, route paths remain unchanged, SEO outputs are documented as preserved, and any browser evidence has no new regressions.

---

## Phase 5: User Story 3 - Dashboard Bundle and Interaction Performance (Priority: P2)

**Goal**: Reduce dashboard initial bundle pressure and remove confirmed chunking inefficiency while preserving all dashboard routes and management workflows.

**Independent Test**: Compare dashboard build output and verify dashboard routes remain registered; run browser checks only when route splitting or UI behavior needs runtime evidence.

### Verification for User Story 3

- [X] T040 [P] [US3] Record pre-change dashboard route list from `apps/dashboard/src/App.tsx` in `specs/006-performance-optimization/quickstart.md`.
- [X] T041 [P] [US3] Record pre-change dashboard dynamic import warning from `apps/dashboard/src/pages/Services.tsx` and `apps/dashboard/src/lib/api.ts` in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T042 [US3] Run `npm run build --workspace=apps/dashboard` before dashboard changes and record chunk baseline in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T043 [US3] Confirm dashboard browser checks that need real API data will not start API until local-safe API environment is confirmed, and document status in `specs/006-performance-optimization/quickstart.md`.

### Implementation for User Story 3

- [X] T044 [US3] Implement dashboard route-level lazy loading in `apps/dashboard/src/App.tsx` without changing dashboard route paths.
- [X] T045 [US3] Add a stable dashboard route loading fallback in `apps/dashboard/src/App.tsx` without changing layout or auth behavior.
- [X] T046 [US3] Preserve `/login`, `/`, `/projects`, `/project-categories`, `/applications`, `/messages`, `/jobs`, `/team`, `/partners`, `/services`, `/settings`, and `/content` route registration in `apps/dashboard/src/App.tsx`.
- [X] T047 [US3] Replace the ineffective dynamic import of `apps/dashboard/src/lib/api.ts` in `apps/dashboard/src/pages/Services.tsx` with a normal import only if the dashboard build warning proves it remains relevant.
- [X] T048 [US3] Confirm no dashboard API base URL, request payload, response shape, or auth behavior changed in `apps/dashboard/src/lib/api.ts`.
- [X] T049 [US3] Run `npm run build --workspace=apps/dashboard` and record dashboard chunk results and remaining warnings in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T050 [US3] Run dashboard browser checks for route reachability only if runtime evidence is needed, then record console/network/horizontal-scroll/clipped-action status in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T051 [US3] If API is needed for dashboard browser checks, confirm local-safe environment before running `npm run dev:api` and record the decision in `specs/006-performance-optimization/quickstart.md`.
- [X] T052 [US3] Document any remaining dashboard chunk warning or route check limitation in `specs/006-performance-optimization/performance-inventory.md`.

**Checkpoint**: US3 is complete when dashboard build passes, all existing dashboard route names remain intact, and the dynamic import warning is fixed or explicitly justified.

---

## Phase 6: User Story 4 - Rendering and Network Overhead Reduction (Priority: P2)

**Goal**: Apply only small rendering/network-overhead improvements backed by `performance-inventory.md`, and defer broad API/cache/media work.

**Independent Test**: Static review and representative browser evidence show no new duplicate work or regressions, while API contracts remain unchanged.

### Verification for User Story 4

- [X] T053 [P] [US4] Confirm PERF-DASH-003 remains the only approved dashboard render/filtering implementation target in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T054 [P] [US4] Confirm API pagination/cache and media pipeline work remain deferred in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T055 [P] [US4] Record pre-change filtering behavior for `apps/dashboard/src/pages/Applications.tsx` in `specs/006-performance-optimization/performance-inventory.md`.

### Implementation for User Story 4

- [X] T056 [US4] Apply a small memoized filtering/search normalization improvement in `apps/dashboard/src/pages/Applications.tsx` only if PERF-DASH-003 evidence remains valid.
- [X] T057 [US4] Preserve existing applications API query and status update behavior in `apps/dashboard/src/pages/Applications.tsx`.
- [X] T058 [US4] Review TanStack Query options in `src/main.tsx` and `apps/dashboard/src/main.tsx` without changing API contracts, and document whether changes are deferred in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T059 [US4] Document why API pagination/cache is deferred instead of implemented in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T060 [US4] Run `npm run build --workspace=apps/dashboard` if `apps/dashboard/src/pages/Applications.tsx` changed, and record result in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T061 [US4] Run focused dashboard Applications browser check only if runtime evidence is needed, then record console/network/table behavior status in `specs/006-performance-optimization/performance-inventory.md`.

**Checkpoint**: US4 is complete when only documented low-risk rendering work was changed and broad API/cache/media pipeline work remains deferred.

---

## Phase 7: Final Verification & Documentation

**Purpose**: Validate the full package, update documentation, and prove guardrails were preserved.

- [X] T062 Run `npm run typecheck` and record final result in `specs/006-performance-optimization/quickstart.md`.
- [X] T063 Run `npm run build` and record final public chunk results and remaining warnings in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T064 Run `npm run build --workspace=apps/dashboard` and record final dashboard chunk results and remaining warnings in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T065 Verify `src/router.tsx` still preserves public routes and record result in `specs/006-performance-optimization/quickstart.md`.
- [X] T066 Verify `apps/dashboard/src/App.tsx` still preserves dashboard routes and record result in `specs/006-performance-optimization/quickstart.md`.
- [X] T067 Verify SEO outputs remain unchanged by checking `src/components/SeoHead.tsx`, `src/lib/seo.ts`, `public/sitemap.xml`, and `public/robots.txt`, then record result in `specs/006-performance-optimization/quickstart.md`.
- [X] T068 Verify API contracts were not changed by reviewing touched files against `apps/dashboard/src/lib/api.ts` and `src/lib/apiClient.ts`, then record result in `specs/006-performance-optimization/quickstart.md`.
- [X] T069 Document why `npm run test --workspace=apps/api` was not needed, or run it if API request/response assumptions changed, in `specs/006-performance-optimization/quickstart.md`.
- [X] T070 Update all task statuses in `specs/006-performance-optimization/tasks.md`.
- [X] T071 Update deferred follow-ups for media re-encoding, media pipeline, API pagination/cache, and dashboard virtualization in `specs/006-performance-optimization/performance-inventory.md`.
- [X] T072 Confirm every implemented fix is linked to a baseline finding in `specs/006-performance-optimization/performance-inventory.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on Phase 1 and blocks all user stories.
- **US1 Baseline Inventory**: Depends on Phase 2 and is the MVP.
- **US2 Public Site Performance**: Depends on US1.
- **US3 Dashboard Performance**: Depends on US1 and can run after or alongside US2 if files do not overlap.
- **US4 Rendering/Network Overhead**: Depends on US1 and should run after US3 if it touches dashboard files.
- **Final Verification**: Depends on all selected user stories.

### User Story Dependencies

- **US1 (P1)**: No dependencies after foundational baseline; independently testable through documentation and command evidence.
- **US2 (P1)**: Depends on US1 inventory; independently testable through public build and optional public browser checks.
- **US3 (P2)**: Depends on US1 inventory; independently testable through dashboard build and optional dashboard browser checks.
- **US4 (P2)**: Depends on US1 inventory and should respect US3 dashboard changes; independently testable through static/build evidence and focused browser checks only if needed.

### Parallel Opportunities

- T003, T004, and T005 can run in parallel.
- T010, T011, and T012 can run in parallel.
- T015 through T018 can run in parallel.
- T026, T027, and T028 can run in parallel.
- T040 and T041 can run in parallel.
- T053, T054, and T055 can run in parallel.

---

## Parallel Example: User Story 2

```text
Task: "Record pre-change public route list and SEO guardrails for src/router.tsx and src/components/SeoHead.tsx in specs/006-performance-optimization/quickstart.md"
Task: "Record pre-change public media behavior for src/components/hero/VideoBackground.tsx in specs/006-performance-optimization/performance-inventory.md"
Task: "Record pre-change image component behavior for src/components/ui/Image.tsx and packages/shared-ui/src/components/ui/image.tsx in specs/006-performance-optimization/performance-inventory.md"
```

## Parallel Example: User Story 3

```text
Task: "Record pre-change dashboard route list from apps/dashboard/src/App.tsx in specs/006-performance-optimization/quickstart.md"
Task: "Record pre-change dashboard dynamic import warning from apps/dashboard/src/pages/Services.tsx and apps/dashboard/src/lib/api.ts in specs/006-performance-optimization/performance-inventory.md"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete US1 only.
3. Stop and validate that every candidate fix has evidence and unsupported work is deferred.

### Incremental Delivery

1. US1 creates the evidence gate.
2. US2 improves public route/media/image loading and validates public build/browser behavior.
3. US3 improves dashboard route chunking and validates dashboard build/routes.
4. US4 applies only documented low-risk rendering/network cleanup.
5. Final phase proves typecheck/build/guardrails and documents remaining deferred work.

### Safe Stop Points

- Stop after US1 for inventory-only delivery.
- Stop after US2 for public-site-only performance improvements.
- Stop after US3 for dashboard bundle improvements.
- Stop after US4 before final verification only if final commands are blocked; document blockers in `quickstart.md`.

## Notes

- [P] tasks touch different files or documentation sections and can be parallelized.
- Browser checks are included only where route splitting, media behavior, or dashboard interaction changes need runtime evidence.
- API runtime is not required for static/build verification and must not be started before local-safe environment confirmation.
- Remaining Vite chunk warnings are acceptable only when documented with rationale and deferred follow-up.
