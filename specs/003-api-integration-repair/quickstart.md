# Quickstart: API Integration Repair

This quickstart is for the implementation phase. It records planned verification commands and manual checks. Runtime commands were intentionally not run during planning.

## Static Planning Findings To Address First

1. `apps/api/src/routes/projectCategories.ts` exists but is not mounted in `apps/api/src/index.ts`.
2. `apps/dashboard/src/pages/ProjectCategories.tsx` exists and the sidebar links to `/project-categories`, but `apps/dashboard/src/App.tsx` does not register that route.
3. Public `src/pages/ProjectsPage.tsx` already calls `GET /api/project-categories` and falls back to default categories when unavailable.
4. Dashboard `apps/dashboard/src/pages/Projects.tsx` already calls `GET /api/project-categories` to populate the project category select.
5. Success stories have an API route but no dedicated dashboard page found in static inventory; either document as a deferred exception or connect an existing dashboard management path.

## Implementation Verification Plan

Do not run these during planning. Run during implementation after tests are written.

```bash
npm run test --workspace=apps/api
npm run typecheck
npm run build
npm run build --workspace=apps/dashboard
```

If root build already covers the public site only, keep dashboard build as an explicit separate verification.

## Category Acceptance Checks

- `GET /api/project-categories` returns a public array of categories.
- Dashboard token can create a category.
- Dashboard token can update a category.
- Dashboard token can delete an unused category.
- Dashboard token deleting a category used by projects disables it or otherwise prevents orphaned project category state.
- Dashboard project form can read active categories.
- Public project filters can read active categories.
- A project created with a dashboard-selected category appears in public project reads with the same string `category`.
- Renaming a category keeps existing project/category display compatible.

## Resource Compatibility Checks

For each resource in the plan inventory:

- Public read still works with the existing response shape.
- Dashboard create/update/delete still accepts the current dashboard payload shape.
- Dashboard mutation is visible through the public read path when the resource is publicly displayed.
- Any intentionally unmanaged public content is documented with reason and owner.

## Deferred Follow-Ups To Decide During Tasks

- Success stories are managed through `PageContent` on the `home` page for this package. A dedicated success stories dashboard page remains out of scope unless a later task proves it is required.
- Whether project category uniqueness should be enforced by name in addition to slug.
- Whether future work should introduce `categoryId` while preserving string `category` for public compatibility.

## Phase 1 + Phase 2 + US1 Verification Results

**Scope completed**: T001-T029 only. US2 and later phases were not started.

### Test-First Evidence

- Initial scoped US1 test run after writing tests failed as expected:
  - Dashboard `/project-categories` route was not registered in `apps/dashboard/src/App.tsx`.
  - API `/api/project-categories` was not mounted and returned the default HTML 404 response.
- The sandbox blocks local test server port binding, so in-process API tests were run with approved escalated execution.

### Passing Checks

```bash
node --test -r ts-node/register tests/project-categories-route.test.ts tests/dashboard-project-categories-route.test.ts tests/project-categories-crud.test.ts tests/project-categories-project-link.test.ts tests/project-category-contract.test.ts tests/public-project-categories-consumer.test.ts tests/dashboard-project-category-selector.test.ts
```

Result: passed 10/10 scoped US1 tests.

```bash
npm run build --workspace=apps/api
```

Result: passed.

```bash
npm run build --workspace=apps/dashboard
```

Result: passed. Vite emitted existing chunk-size/dynamic-import warnings, but the build completed successfully.

### Confirmed US1 Behavior

- `GET /api/project-categories` is mounted.
- Dashboard `/project-categories` is registered and matches the sidebar link.
- Category create/update validation uses Zod through `validateRequest`.
- Successful category response shapes remain unchanged.
- Duplicate slug errors are converted to a non-sensitive `CATEGORY_CONFLICT` API error.
- Deleting a category used by projects disables it instead of orphaning project category strings.
- Renaming a category updates existing `Project.category` string values.
- `Project.category` remains a string contract; no `categoryId` requirement was introduced.

## US2 Public Resource Inventory Verification Results

**Scope completed**: T030-T039 only. US3 and US4 were not started.

### Test-First Evidence

- Initial scoped US2 static test run failed as expected because `integration-inventory.md` did not yet include the full public resource table or explicit Success stories management status.
- No failing static check proved a missing API route mount or dashboard route registration, so no app code was changed for T036 or T037.

### Passing Checks

```bash
node --test -r ts-node/register tests/public-resource-inventory.test.ts tests/dashboard-resource-inventory.test.ts tests/public-consumer-inventory.test.ts
```

Result: passed 8/8 scoped US2 static tests.

### Final Inventory Checklist

- Projects: public consumers, `/api/projects`, dashboard `/projects`, and dashboard CRUD surface documented.
- Project categories: public project filters, `/api/project-categories`, dashboard `/project-categories`, and string `Project.category` compatibility documented.
- Services: public consumer, `/api/services`, dashboard `/services`, and dashboard CRUD surface documented.
- Partners: public consumers, `/api/partners`, dashboard `/partners`, and dashboard CRUD surface documented.
- Team: public consumer, `/api/team`, dashboard `/team`, and dashboard CRUD surface documented.
- Jobs: public consumer, `/api/jobs`, dashboard `/jobs`, and public/admin route split documented.
- Settings: public consumers, `/api/settings`, dashboard `/settings`, and singleton update path documented.
- Page content: `usePageContent`, `/api/content`, dashboard `/content`, and section update path documented.
- Messages: public submit path, `/api/messages`, dashboard `/messages`, mark-read/delete path documented.
- Applications: public CV submit path, `/api/applications`, dashboard `/applications`, status/delete path documented.
- Success stories: accepted management path documented through `PageContent` home `Success Stories`; no broad dashboard rewrite was added.

### Build Scope

No production code changed during US2, and the scoped static tests exercise route registrations and consumers directly. App builds were not rerun for this documentation/static-test-only pass.

## US3 API Contract Compatibility Verification Results

**Scope completed**: T040-T054 only. US4 and Final Phase were not started.

### Test-First Evidence

- Added scoped compatibility tests for projects, services, partners, team, jobs, settings, page content, messages, and applications.
- Included the existing project category CRUD and string category contract tests in the US3 run.
- Initial sandboxed run failed only with `listen EPERM` while binding the in-process Express test server to `127.0.0.1`; the same command passed with approved local API test execution.

### Passing Checks

```bash
node --test -r ts-node/register tests/projects-contract-compatibility.test.ts tests/services-contract-compatibility.test.ts tests/partners-contract-compatibility.test.ts tests/team-contract-compatibility.test.ts tests/jobs-contract-compatibility.test.ts tests/content-contract-compatibility.test.ts tests/submission-contract-compatibility.test.ts tests/project-categories-crud.test.ts tests/project-category-contract.test.ts
```

Result: passed 13/13 scoped US3 API contract tests.

```bash
npm run build --workspace=apps/api
```

Result: passed.

### Confirmed US3 Behavior

- Public reads keep existing array/object response shapes.
- Dashboard create/update routes keep object response shapes.
- Dashboard delete routes keep existing message response shapes.
- Public submit routes for messages and applications keep existing success response shapes.
- Jobs still split public active jobs from dashboard all-jobs reads.
- Page content still returns page-level section maps and section-level content objects.
- `Project.category` remains a string compatibility contract; no `categoryId` requirement was introduced.
- No compatibility test proved a contract mismatch, so no production route code was changed for T047-T053.

## US4 Dashboard/Public CRUD Matrix Verification Results

**Scope completed**: T055-T066 only. Final Phase was not started.

### Test-First Evidence

- Added a cross-resource CRUD/public-read matrix in `apps/api/tests/dashboard-public-crud-matrix.test.ts`.
- Initial sandboxed run failed only with `listen EPERM` while binding the in-process Express test server to `127.0.0.1`.
- First approved local run exposed a test-double gap for `JobPosition.isActive` defaults; the test fixture was corrected to match the model default without changing application routes.

### Passing Checks

```bash
node --test -r ts-node/register tests/dashboard-public-crud-matrix.test.ts
```

Result: passed 4/4 scoped US4 matrix tests.

```bash
npm run build --workspace=apps/api
```

Result: passed.

### Confirmed US4 Behavior

- Dashboard-created project categories are visible through `GET /api/project-categories`.
- Dashboard-created projects using those category strings are visible through `GET /api/projects`.
- Renaming a category keeps public project reads aligned with the updated string category.
- Services, partners, and team create/update/delete operations are reflected in their public list reads.
- Jobs created by dashboard appear in public active jobs, are hidden when inactive, and reappear after reactivation/update.
- Settings dashboard updates are visible through public settings reads.
- Page content section updates are visible through page-level and section-level public reads.
- Messages and applications remain documented public-submit/dashboard-review workflows, not public CRUD content.
- Success stories remain documented through Page Content `home.successStories`.
- No matrix test proved a production route gap, so no application route code was changed for T060-T065.

## Final Verification Results

**Scope completed**: T067-T074 only. No new features were added during Final Phase.

### Final Commands

```bash
npm run test --workspace=apps/api
```

Result: passed 74/74 API tests. The command required approved local execution because the API tests bind an in-process Express server to `127.0.0.1`. Test output included intentional redaction/fallback log lines from negative-path tests; all assertions passed.

```bash
npm run typecheck
```

Result: passed.

```bash
npm run build
```

Result: passed. Vite emitted an existing chunk-size warning for the public site bundle.

```bash
npm run build --workspace=apps/api
```

Result: passed.

```bash
npm run build --workspace=apps/dashboard
```

Result: passed. Vite emitted existing chunk-size and mixed dynamic/static import warnings for the dashboard bundle.

### Final Contract Checks

- `apps/api/src/models/Project.ts` still defines `category: string` and stores it as a required string.
- `apps/dashboard/src/pages/Projects.tsx` still submits category name strings from the project category selector.
- `src/pages/ProjectsPage.tsx` still filters projects by string category names.
- `contracts/api-integration-contracts.md` documents the implemented route behavior and does not claim a dedicated Success stories dashboard page.
- `integration-inventory.md` has evidence or documented exceptions for all resources.

### Deferred Follow-Ups

- Success stories remain managed through Page Content `home.successStories`; a dedicated dashboard page is a future feature only if explicitly needed.
- Project category display-name uniqueness can be considered later; this package preserves current slug uniqueness and string category behavior.
- Any future `categoryId` migration must be additive and keep `Project.category` string compatibility for public and dashboard clients.
- Public/dashboard chunk-size warnings are build-performance follow-ups, not API integration blockers.
