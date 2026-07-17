# Tasks: API Integration Repair

**Input**: Design documents from `specs/003-api-integration-repair/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/api-integration-contracts.md`, `quickstart.md`  
**Runtime During Task Generation**: Not run. These tasks were generated from static docs/code inspection only.

**Tests**: Required by the specification, plan, and constitution. Test tasks come before implementation tasks in each story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files or depends only on completed prior tasks
- **[Story]**: User story label from `spec.md`
- Every task includes exact file paths

## Phase 1: Setup (Shared Context)

**Purpose**: Establish the implementation baseline and avoid accidental broad rewrites.

- [x] T001 Confirm `specs/003-api-integration-repair/plan.md`, `specs/003-api-integration-repair/contracts/api-integration-contracts.md`, and `specs/003-api-integration-repair/quickstart.md` are the active inputs before editing
- [x] T002 [P] Create static integration inventory tracker in `specs/003-api-integration-repair/integration-inventory.md` using the resource table from `specs/003-api-integration-repair/plan.md`
- [x] T003 [P] Inspect existing API test helpers in `apps/api/tests/helpers/appTestHarness.ts` and record reusable auth/database patterns in `specs/003-api-integration-repair/integration-inventory.md`
- [x] T004 [P] Inspect current dashboard route/sidebar files `apps/dashboard/src/App.tsx` and `apps/dashboard/src/components/Sidebar.tsx` and record the `/project-categories` gap in `specs/003-api-integration-repair/integration-inventory.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add minimal shared test scaffolding and contract notes required before user-story work.

**CRITICAL**: No user story implementation should start before this phase is complete.

- [x] T005 Add project category test data helpers in `apps/api/tests/helpers/projectCategoryTestHelpers.ts`
- [x] T006 Add project test data helpers that preserve `Project.category` as a string in `apps/api/tests/helpers/projectIntegrationTestHelpers.ts`
- [x] T007 [P] Add dashboard static file assertion helper in `apps/api/tests/helpers/staticFileAssertions.ts`
- [x] T008 [P] Document the non-breaking `Project.category` string contract in `specs/003-api-integration-repair/integration-inventory.md`
- [x] T009 [P] Document implementation guardrails prohibiting broad unverified resource rewrites in `specs/003-api-integration-repair/integration-inventory.md`

**Checkpoint**: Foundation ready. Project category route and dashboard route tests can now be written first.

---

## Phase 3: User Story 1 - Project Categories Stay Connected (Priority: P1) MVP

**Goal**: Project categories are mounted in the API, reachable by public/dashboard clients, manageable from the dashboard, assignable to projects, and visible through public project reads while `Project.category` remains a string.

**Independent Test**: Manage a category through API/dashboard-compatible contracts, assign it to a project, and verify public category and project reads expose the expected string category values.

### Tests for User Story 1

> Write these tests first and confirm they fail before the implementation tasks that satisfy them.

- [x] T010 [P] [US1] Add API route mount test for `GET /api/project-categories` in `apps/api/tests/project-categories-route.test.ts`
- [x] T011 [P] [US1] Add dashboard route registration static test for `/project-categories` in `apps/api/tests/dashboard-project-categories-route.test.ts`
- [x] T012 [P] [US1] Add API auth contract tests for protected category create/update/delete in `apps/api/tests/project-categories-crud.test.ts`
- [x] T013 [US1] Add category CRUD acceptance tests for create/list/update/delete unused category in `apps/api/tests/project-categories-crud.test.ts`
- [x] T014 [US1] Add category-in-use delete/disable test in `apps/api/tests/project-categories-project-link.test.ts`
- [x] T015 [US1] Add category rename propagation test proving linked projects keep public display compatibility in `apps/api/tests/project-categories-project-link.test.ts`
- [x] T016 [US1] Add project assignment compatibility test proving `Project.category` remains a string in `apps/api/tests/project-category-contract.test.ts`
- [x] T017 [P] [US1] Add public project categories consumer static test for `src/pages/ProjectsPage.tsx` using `GET /api/project-categories` in `apps/api/tests/public-project-categories-consumer.test.ts`
- [x] T018 [P] [US1] Add dashboard project category selector static test for `apps/dashboard/src/pages/Projects.tsx` using `/project-categories` in `apps/api/tests/dashboard-project-category-selector.test.ts`

### Implementation for User Story 1

- [x] T019 [US1] Mount `projectCategories` route at `/api/project-categories` in `apps/api/src/index.ts`
- [x] T020 [US1] Import `ProjectCategories` page in `apps/dashboard/src/App.tsx`
- [x] T021 [US1] Register dashboard route `<Route path="project-categories" ...>` in `apps/dashboard/src/App.tsx`
- [x] T022 [US1] Ensure `apps/dashboard/src/components/Sidebar.tsx` `/project-categories` link remains aligned with the registered dashboard route
- [x] T023 [US1] Preserve `Project.category` as a string name in `apps/api/src/models/Project.ts` and avoid introducing `categoryId` in this package
- [x] T024 [US1] Tighten category create/update input validation without changing successful response shape in `apps/api/src/routes/projectCategories.ts`
- [x] T025 [US1] Ensure category slug generation and duplicate slug errors return consistent non-sensitive API errors in `apps/api/src/routes/projectCategories.ts`
- [x] T026 [US1] Ensure deleting a category used by projects disables it or blocks orphaning without deleting project category strings in `apps/api/src/routes/projectCategories.ts`
- [x] T027 [US1] Ensure renaming a category updates existing `Project.category` string values in `apps/api/src/routes/projectCategories.ts`
- [x] T028 [US1] Ensure active-only dashboard category selector behavior remains in `apps/dashboard/src/pages/Projects.tsx`
- [x] T029 [US1] Update category acceptance evidence notes in `specs/003-api-integration-repair/integration-inventory.md`

**Checkpoint**: User Story 1 is complete when category route mount, dashboard route registration, category CRUD, project assignment, public category reads, and string category contract tests pass.

---

## Phase 4: User Story 2 - Dashboard Manages All Public Content (Priority: P1)

**Goal**: Every public website data dependency is mapped to dashboard management and API route coverage, with only documented exceptions for resources that are intentionally not dashboard-managed.

**Independent Test**: Review the inventory and execute resource checks proving each public content type has dashboard/API coverage or an explicit deferred exception.

### Tests and Checks for User Story 2

- [X] T030 [P] [US2] Add public resource inventory static test for API route mounts in `apps/api/tests/public-resource-inventory.test.ts`
- [X] T031 [P] [US2] Add dashboard management surface static test for registered dashboard pages in `apps/api/tests/dashboard-resource-inventory.test.ts`
- [X] T032 [P] [US2] Add public consumer inventory static test for public data calls in `apps/api/tests/public-consumer-inventory.test.ts`
- [X] T033 [US2] Add integration inventory assertions for projects, services, partners, team, jobs, settings, page content, messages, applications, and success stories in `apps/api/tests/public-resource-inventory.test.ts`

### Implementation for User Story 2

- [X] T034 [US2] Update `specs/003-api-integration-repair/integration-inventory.md` with public consumer, dashboard surface, API route, CRUD support, and status for each resource
- [X] T035 [US2] Document success stories dashboard gap or accepted management path in `specs/003-api-integration-repair/integration-inventory.md`
- [X] T036 [US2] Repair only confirmed missing route mounts for existing resource route files in `apps/api/src/index.ts`
- [X] T037 [US2] Repair only confirmed missing dashboard route registrations for existing dashboard pages in `apps/dashboard/src/App.tsx`
- [X] T038 [US2] Do not add new dashboards or broad CRUD rewrites unless a failing inventory test proves the gap in `specs/003-api-integration-repair/integration-inventory.md`
- [X] T039 [US2] Update `specs/003-api-integration-repair/quickstart.md` with the final public resource inventory verification checklist

**Checkpoint**: User Story 2 is complete when all public resources are mapped and only proven gaps are repaired or explicitly deferred.

---

## Phase 5: User Story 3 - Existing API Contracts Remain Compatible (Priority: P1)

**Goal**: Valid public website and dashboard API requests keep their current request/response shapes while integration gaps are repaired.

**Independent Test**: Compatibility tests prove valid existing public reads and dashboard CRUD payloads still succeed without response envelope changes or `Project.category` type changes.

### Tests for User Story 3

- [X] T040 [P] [US3] Add project public read compatibility tests in `apps/api/tests/projects-contract-compatibility.test.ts`
- [X] T041 [P] [US3] Add services public/dashboard compatibility tests in `apps/api/tests/services-contract-compatibility.test.ts`
- [X] T042 [P] [US3] Add partners public/dashboard compatibility tests in `apps/api/tests/partners-contract-compatibility.test.ts`
- [X] T043 [P] [US3] Add team public/dashboard compatibility tests in `apps/api/tests/team-contract-compatibility.test.ts`
- [X] T044 [P] [US3] Add jobs public/admin compatibility tests in `apps/api/tests/jobs-contract-compatibility.test.ts`
- [X] T045 [P] [US3] Add settings and page content compatibility tests in `apps/api/tests/content-contract-compatibility.test.ts`
- [X] T046 [P] [US3] Add messages and applications compatibility regression tests in `apps/api/tests/submission-contract-compatibility.test.ts`

### Implementation for User Story 3

- [X] T047 [US3] Fix only contract mismatches proven by compatibility tests in `apps/api/src/routes/projects.ts`
- [X] T048 [US3] Fix only contract mismatches proven by compatibility tests in `apps/api/src/routes/services.ts`
- [X] T049 [US3] Fix only contract mismatches proven by compatibility tests in `apps/api/src/routes/partners.ts`
- [X] T050 [US3] Fix only contract mismatches proven by compatibility tests in `apps/api/src/routes/team.ts`
- [X] T051 [US3] Fix only contract mismatches proven by compatibility tests in `apps/api/src/routes/jobs.ts`
- [X] T052 [US3] Fix only contract mismatches proven by compatibility tests in `apps/api/src/routes/settings.ts` and `apps/api/src/routes/pageContent.ts`
- [X] T053 [US3] Fix only contract mismatches proven by compatibility tests in `apps/api/src/routes/messages.ts` and `apps/api/src/routes/applications.ts`
- [X] T054 [US3] Update `specs/003-api-integration-repair/contracts/api-integration-contracts.md` with any additive fields or deferred compatibility notes

**Checkpoint**: User Story 3 is complete when valid existing public and dashboard contracts pass compatibility checks without broad route rewrites.

---

## Phase 6: User Story 4 - CRUD Verification Covers Integration Gaps (Priority: P2)

**Goal**: Repaired and dashboard-managed resources have CRUD and public-read verification so route gaps do not return later.

**Independent Test**: Resource-specific CRUD checks prove dashboard mutations are visible through public reads where the resource is publicly displayed.

### Tests for User Story 4

- [X] T055 [P] [US4] Add cross-resource CRUD matrix test scaffold in `apps/api/tests/dashboard-public-crud-matrix.test.ts`
- [X] T056 [US4] Add projects and project categories CRUD/public-read matrix cases in `apps/api/tests/dashboard-public-crud-matrix.test.ts`
- [X] T057 [US4] Add services, partners, and team CRUD/public-read matrix cases in `apps/api/tests/dashboard-public-crud-matrix.test.ts`
- [X] T058 [US4] Add jobs, settings, and page content CRUD/public-read matrix cases in `apps/api/tests/dashboard-public-crud-matrix.test.ts`
- [X] T059 [US4] Add documented skip/deferred cases for messages, applications, and success stories where full public CRUD is not the correct workflow in `apps/api/tests/dashboard-public-crud-matrix.test.ts`

### Implementation for User Story 4

- [X] T060 [US4] Repair only matrix-proven CRUD/public-read integration defects in `apps/api/src/routes/projects.ts`
- [X] T061 [US4] Repair only matrix-proven CRUD/public-read integration defects in `apps/api/src/routes/services.ts`
- [X] T062 [US4] Repair only matrix-proven CRUD/public-read integration defects in `apps/api/src/routes/partners.ts`
- [X] T063 [US4] Repair only matrix-proven CRUD/public-read integration defects in `apps/api/src/routes/team.ts`
- [X] T064 [US4] Repair only matrix-proven CRUD/public-read integration defects in `apps/api/src/routes/jobs.ts`
- [X] T065 [US4] Repair only matrix-proven CRUD/public-read integration defects in `apps/api/src/routes/settings.ts` and `apps/api/src/routes/pageContent.ts`
- [X] T066 [US4] Update `specs/003-api-integration-repair/integration-inventory.md` with CRUD matrix evidence and deferred follow-ups

**Checkpoint**: User Story 4 is complete when dashboard-managed public resources have CRUD/public-read evidence or documented exceptions.

---

## Phase 7: Final Verification & Documentation

**Purpose**: Run verification only after implementation tasks are complete and record outcomes without adding new features.

- [X] T067 Run API test suite with `npm run test --workspace=apps/api` and record result in `specs/003-api-integration-repair/quickstart.md`
- [X] T068 Run root typecheck with `npm run typecheck` and record result in `specs/003-api-integration-repair/quickstart.md`
- [X] T069 Run public site build with `npm run build` and record result in `specs/003-api-integration-repair/quickstart.md`
- [X] T070 Run dashboard build with `npm run build --workspace=apps/dashboard` and record result in `specs/003-api-integration-repair/quickstart.md`
- [X] T071 Verify no implementation changed `Project.category` away from string contract in `apps/api/src/models/Project.ts`, `apps/dashboard/src/pages/Projects.tsx`, and `src/pages/ProjectsPage.tsx`
- [X] T072 Verify `specs/003-api-integration-repair/integration-inventory.md` has no unresolved resource without status, evidence, or deferred owner
- [X] T073 Verify `specs/003-api-integration-repair/contracts/api-integration-contracts.md` reflects final implemented route behavior without documenting unimplemented features
- [X] T074 Verify `specs/003-api-integration-repair/quickstart.md` lists final commands, results, and deferred follow-ups

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies
- **Phase 2 Foundational**: Depends on Phase 1
- **Phase 3 US1**: Depends on Phase 2 and is the MVP
- **Phase 4 US2**: Depends on Phase 2; should start after US1 route registration is understood
- **Phase 5 US3**: Depends on Phase 2; can run after or alongside US2 once inventory paths are known
- **Phase 6 US4**: Depends on US1 and the relevant US2/US3 inventory and compatibility findings
- **Phase 7 Final Verification**: Depends on selected implementation phases being complete

### User Story Dependencies

- **US1 Project Categories Stay Connected**: MVP; no dependency on other user stories after foundational setup
- **US2 Dashboard Manages All Public Content**: Depends on foundational inventory structure; should not perform broad repairs without failing checks
- **US3 Existing API Contracts Remain Compatible**: Depends on foundational helpers; can be tested resource by resource
- **US4 CRUD Verification Covers Integration Gaps**: Depends on US1 for category/project behavior and on US2/US3 for resource inventory

### Within Each User Story

- Tests/checks first
- Minimal route/client wiring second
- Contract preservation before behavior expansion
- Documentation evidence last

## Parallel Opportunities

- T002, T003, and T004 can run in parallel.
- T005, T006, and T007 can be prepared in parallel after setup.
- T010, T011, T012, T017, and T018 can be written in parallel because they touch different test files.
- T030, T031, and T032 can be written in parallel.
- T040 through T046 can be written in parallel by resource.
- T060 through T065 can be split by route file after matrix tests identify defects.

## Parallel Example: User Story 1

```text
Task: "T010 Add API route mount test for GET /api/project-categories in apps/api/tests/project-categories-route.test.ts"
Task: "T011 Add dashboard route registration static test for /project-categories in apps/api/tests/dashboard-project-categories-route.test.ts"
Task: "T017 Add public project categories consumer static test for src/pages/ProjectsPage.tsx in apps/api/tests/public-project-categories-consumer.test.ts"
Task: "T018 Add dashboard project category selector static test for apps/dashboard/src/pages/Projects.tsx in apps/api/tests/dashboard-project-category-selector.test.ts"
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 only.
3. Verify project categories route mount, dashboard route registration, category CRUD, project assignment, and public filters.
4. Stop before wider resource repairs unless US1 is stable.

### Incremental Delivery

1. US1 repairs known project category gaps.
2. US2 inventories every public resource and repairs only proven missing mounts/routes.
3. US3 protects existing API contracts from accidental breaking changes.
4. US4 adds CRUD/public-read regression coverage for repaired resources.
5. Final verification runs documented commands and records results.

### Safety Rules

- Keep `Project.category` as a string throughout this package.
- Do not introduce `categoryId` as a required public or dashboard contract.
- Do not perform broad route validation conversions unless a compatibility test requires a focused fix.
- Do not add new dashboard resource areas unless inventory checks prove no existing management path can satisfy the spec.
- Do not run runtime verification until implementation reaches Phase 7 or a user explicitly requests it.
