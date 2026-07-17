# Integration Inventory: API Integration Repair

**Scope**: Phase 1, Phase 2, US1, US2 resource inventory, US3 API contract compatibility, US4 dashboard/public CRUD visibility, and Final Phase verification.

## Active Inputs

- Spec: `specs/003-api-integration-repair/spec.md`
- Plan: `specs/003-api-integration-repair/plan.md`
- Contracts: `specs/003-api-integration-repair/contracts/api-integration-contracts.md`
- Tasks: `specs/003-api-integration-repair/tasks.md`

## Helper Baseline

- API tests use `apps/api/tests/helpers/appTestHarness.ts` to create an in-process Express server with `NODE_ENV=test`.
- Test auth tokens are generated with the current `JWT_SECRET` and exercise `protect` without requiring an admin database lookup.
- Static dashboard/public route assertions read source files directly and do not start Vite or a browser.

## Project Category MVP Gap

| Area | Current finding | Task coverage | Status |
|------|-----------------|---------------|--------|
| API route mount | `apps/api/src/routes/projectCategories.ts` exists; `/api/project-categories` must be mounted in `apps/api/src/index.ts` | T010, T019 | Complete |
| Dashboard route registration | `apps/dashboard/src/pages/ProjectCategories.tsx` exists and sidebar links `/project-categories`; `apps/dashboard/src/App.tsx` must register it | T011, T020-T022 | Complete |
| Public category consumer | `src/pages/ProjectsPage.tsx` consumes `/project-categories` and filters by string category name | T017 | Complete |
| Dashboard project selector | `apps/dashboard/src/pages/Projects.tsx` consumes `/project-categories` and submits category name strings | T018, T028 | Complete |

## Contract Guardrails

- `Project.category` remains a string compatibility contract in `apps/api/src/models/Project.ts`.
- This package must not require `categoryId` in public site payloads, dashboard form payloads, or API responses.
- Category route repairs must preserve successful response shapes: list returns an array, create/update return category objects, delete returns the existing message shape or disabled category message.
- Final all-suite verification completed in T067-T074.

## US2 Public Resource Inventory

| Resource | Public consumer(s) | API route coverage | Dashboard management surface | CRUD / management support | Status |
|----------|--------------------|--------------------|------------------------------|---------------------------|--------|
| Projects | `src/App.tsx`, `src/pages/ProjectsPage.tsx`, `src/pages/ProjectDetailsPage.tsx` | `apps/api/src/index.ts` mounts `projectRoutes` at `/api/projects` | `apps/dashboard/src/App.tsx` registers `Projects` at `/projects`; sidebar links `/projects` | Dashboard uses `GET /projects`, `POST /projects`, `PUT /projects/:id`, `DELETE /projects/:id` | Covered; deeper contract checks deferred to US3 |
| Project categories | `src/pages/ProjectsPage.tsx` fetches `/project-categories`; project filters compare string category names | `apps/api/src/index.ts` mounts `projectCategoryRoutes` at `/api/project-categories` | `ProjectCategories` is registered at `/project-categories`; dashboard project form reads `/project-categories` | Dashboard category page supports create, update, delete/restore; project form preserves `Project.category` string | Covered by US1 and inventory checks |
| Services | `src/components/Services.tsx` fetches `/services` | `apps/api/src/index.ts` mounts `serviceRoutes` at `/api/services` | `Services` is registered at `/services`; sidebar links `/services` | Dashboard uses `GET /services`, `POST /services`, `PUT /services/:id`, `DELETE /services/:id` | Covered; deeper contract checks deferred to US3 |
| Partners | `src/components/Partners.tsx` and `src/components/PartnersSection.tsx` fetch `/partners` | `apps/api/src/index.ts` mounts `partnerRoutes` at `/api/partners` | `Partners` is registered at `/partners`; sidebar links `/partners` | Dashboard uses `GET /partners`, `POST /partners`, `PUT /partners/:id`, `DELETE /partners/:id` | Covered; deeper contract checks deferred to US3 |
| Team | `src/pages/AboutPage.tsx` fetches `/team` | `apps/api/src/index.ts` mounts `teamRoutes` at `/api/team` | `Team` is registered at `/team`; sidebar links `/team` | Dashboard uses `GET /team`, `POST /team`, `PUT /team/:id`, `DELETE /team/:id` | Covered; deeper contract checks deferred to US3 |
| Jobs | `src/pages/CareersPage.tsx` fetches `/jobs` | `apps/api/src/index.ts` mounts `jobRoutes` at `/api/jobs` | `Jobs` is registered at `/jobs`; sidebar links `/jobs` | Dashboard uses `GET /jobs/all`, `POST /jobs`, `PUT /jobs/:id`, `DELETE /jobs/:id`; public site uses active jobs | Covered; deeper contract checks deferred to US3 |
| Settings | `src/components/Hero.tsx`, `src/components/Footer.tsx`, `src/pages/ContactPage.tsx`, `src/components/contact/ContactInfo.tsx`, `src/components/footer/FooterMap.tsx` fetch `/settings` | `apps/api/src/index.ts` mounts `settingsRoutes` at `/api/settings` | `Settings` is registered at `/settings`; sidebar links `/settings` | Dashboard uses `GET /settings` and singleton `PUT /settings` | Covered; deeper contract checks deferred to US3 |
| Page content | `src/hooks/usePageContent.ts` fetches `/content/${page}` for home, about, projects, hse, careers, contact content | `apps/api/src/index.ts` mounts `pageContentRoutes` at `/api/content` | `PageContent` is registered at `/content`; sidebar links `/content` | Dashboard uses `GET /content/:page` and `PUT /content/:page/:section`; public content is section-based | Covered; deeper contract checks deferred to US3 |
| Messages | `src/components/contact/ContactForm.tsx` submits `/messages/submit` | `apps/api/src/index.ts` mounts `messageRoutes` at `/api/messages` | `Messages` is registered at `/messages`; sidebar links `/messages` | Public submit plus dashboard list, mark read, and delete | Covered; deeper contract checks deferred to US3 |
| Applications | `src/components/ApplicationForm.tsx` submits `/applications/submit` | `apps/api/src/index.ts` mounts `applicationRoutes` at `/api/applications` | `Applications` is registered at `/applications`; sidebar links `/applications` | Public CV/application submit plus dashboard list, status update, and delete | Covered; deeper contract checks deferred to US3 |
| Success stories | `src/components/Partners.tsx` reads `home.successStories` through `usePageContent('home')`; it does not call `/success-stories` | `apps/api/src/index.ts` mounts `successStoryRoutes` at `/api/success-stories` | Accepted management path: `PageContent` exposes the `Success Stories` section on the `home` page and maps it to `successStories` | Existing public display is managed through page content; the standalone `/api/success-stories` route has no dedicated dashboard page registered | Accepted management path documented; no broad dashboard rewrite in US2 |

## US2 Repair Decisions

| Check | Finding | Decision |
|-------|---------|----------|
| API route mounts | Static inventory test confirms all existing resource route files are mounted, including `/api/success-stories` and `/api/project-categories` | No API mount repair required for T036 |
| Dashboard route registrations | Static inventory test confirms existing dashboard pages are imported, routed, and linked in the sidebar for public resource management surfaces | No dashboard route registration repair required for T037 |
| Success stories | Public UI consumes success stories from `home.successStories`, and dashboard Page Content exposes `Success Stories` fields for the `home` page | Treat Page Content as the accepted management path; do not add a new dashboard page in US2 |
| Broad CRUD rewrites | No failing inventory test proves a broad CRUD gap in this phase | No broad CRUD rewrite under T038 |

## US1 Evidence

| Check | Evidence | Result |
|-------|----------|--------|
| Red tests before implementation | Scoped US1 test run failed before code changes because `/api/project-categories` was unmounted and `/project-categories` was not registered in dashboard `App.tsx` | Confirmed |
| API route mount | `apps/api/src/index.ts` imports `projectCategoryRoutes` and mounts `/api/project-categories` | Complete |
| Dashboard route registration | `apps/dashboard/src/App.tsx` imports `ProjectCategories` and registers `path="project-categories"` | Complete |
| Category validation | `apps/api/src/validation/schemas.ts` defines project category Zod schemas and `apps/api/src/routes/projectCategories.ts` uses `validateRequest` | Complete |
| Project string category contract | `apps/api/src/models/Project.ts` still defines `category: string`; public/dashboard consumers still submit/compare category names | Preserved |
| Scoped tests | `node --test -r ts-node/register tests/project-categories-route.test.ts tests/dashboard-project-categories-route.test.ts tests/project-categories-crud.test.ts tests/project-categories-project-link.test.ts tests/project-category-contract.test.ts tests/public-project-categories-consumer.test.ts tests/dashboard-project-category-selector.test.ts` | Pass: 10/10 |
| Scoped builds | `npm run build --workspace=apps/api`; `npm run build --workspace=apps/dashboard` | Pass |

## US2 Evidence

| Check | Evidence | Result |
|-------|----------|--------|
| Red static checks before inventory update | `node --test -r ts-node/register tests/public-resource-inventory.test.ts tests/dashboard-resource-inventory.test.ts tests/public-consumer-inventory.test.ts` failed because the US2 inventory table and Success stories status were not documented yet | Confirmed |
| API route inventory | `apps/api/src/index.ts` imports and mounts projects, project categories, services, partners, team, jobs, settings, page content, messages, applications, and success stories routes | Pass |
| Dashboard surface inventory | `apps/dashboard/src/App.tsx` and `apps/dashboard/src/components/Sidebar.tsx` register existing dashboard management pages and links for public resources | Pass |
| Public consumer inventory | Static checks prove public consumers call the expected public routes and forms submit to the existing message/application endpoints | Pass |
| Success stories management path | `apps/dashboard/src/pages/PageContent.tsx` exposes `Success Stories` on `home`; `src/components/Partners.tsx` reads `home.successStories` | Accepted management path |
| Scoped tests | `node --test -r ts-node/register tests/public-resource-inventory.test.ts tests/dashboard-resource-inventory.test.ts tests/public-consumer-inventory.test.ts` | Pass: 8/8 |

## US3 Contract Compatibility Evidence

| Resource | Public read contract | Dashboard write/admin contract | Result |
|----------|----------------------|--------------------------------|--------|
| Projects | `GET /api/projects` returns an array and `GET /api/projects/:id` returns a project object with string `category` | `POST/PUT /api/projects` return project objects; `DELETE /api/projects/:id` returns `{ message: 'Project deleted' }` | Pass |
| Project categories | `GET /api/project-categories` returns an array of category objects | Protected create/update/delete preserve existing category object and delete/disable message shapes | Pass |
| Services | `GET /api/services` returns an array | Protected create/update return service objects; delete returns `{ message: 'Deleted' }` | Pass |
| Partners | `GET /api/partners` returns an array | Protected create/update return partner objects; delete returns `{ message: 'Deleted' }` | Pass |
| Team | `GET /api/team` returns an array | Protected create/update return team member objects; delete returns `{ message: 'Deleted' }` | Pass |
| Jobs | `GET /api/jobs` filters active jobs and returns an array | `GET /api/jobs/all` returns an array; protected create/update return job objects; delete returns `{ message: 'Deleted' }` | Pass |
| Settings | `GET /api/settings` returns a singleton object | Protected `PUT /api/settings` returns the updated singleton object | Pass |
| Page content | `GET /api/content/:page` returns a section map; `GET /api/content/:page/:section` returns section content | Protected `PUT /api/content/:page/:section` returns the page content document | Pass |
| Messages | `POST /api/messages/submit` returns `{ message: 'Message sent successfully' }` | Protected list returns an array; mark-read returns a message object; delete returns `{ message: 'Deleted' }` | Pass |
| Applications | `POST /api/applications/submit` returns `{ message: 'Application submitted successfully', id }` | Protected list returns an array; status update returns application object; delete returns `{ message: 'Deleted' }` | Pass |

## US3 Repair Decisions

| Task range | Finding | Decision |
|------------|---------|----------|
| T047-T053 | Scoped compatibility tests passed for projects, services, partners, team, jobs, settings, page content, messages, applications, and project categories | No production route changes required |
| Response shapes | Tests confirm current arrays, objects, and message payloads are still used; no envelopes were introduced | Preserve existing contracts |
| Build | `npm run build --workspace=apps/api` completed successfully after US3 tests | Pass |

## US4 CRUD/Public Visibility Evidence

| Resource | Dashboard action verified | Public read / workflow verified | Result |
|----------|---------------------------|---------------------------------|--------|
| Projects | Dashboard creates a project with a dashboard-created category | `GET /api/projects` includes the new project and keeps `category` as a string | Pass |
| Project categories | Dashboard creates a category and later renames it | `GET /api/project-categories` includes the new category; public project reads reflect renamed category strings through the existing project update behavior | Pass |
| Services | Dashboard create, update, and delete | `GET /api/services` shows created/updated service and no longer shows deleted service | Pass |
| Partners | Dashboard create, update, and delete | `GET /api/partners` shows created/updated partner and no longer shows deleted partner | Pass |
| Team | Dashboard create, update, and delete | `GET /api/team` shows created/updated team member and no longer shows deleted member | Pass |
| Jobs | Dashboard create, deactivate, reactivate/update | `GET /api/jobs` shows active jobs, hides inactive jobs, and shows reactivated updated jobs | Pass |
| Settings | Dashboard singleton update | `GET /api/settings` returns the updated singleton settings object | Pass |
| Page content | Dashboard section upsert | `GET /api/content/home` includes the updated section map, and `GET /api/content/home/hero` returns the updated section content | Pass |
| Messages | Public submit plus dashboard read/read-status/delete is the correct workflow; not public CRUD content after dashboard writes | Documented exception in `apps/api/tests/dashboard-public-crud-matrix.test.ts` | Deferred from public CRUD matrix |
| Applications | Public submit plus dashboard review-status/delete is the correct workflow; not public CRUD content after dashboard writes | Documented exception in `apps/api/tests/dashboard-public-crud-matrix.test.ts` | Deferred from public CRUD matrix |
| Success stories | Managed through Page Content `home.successStories`, not a dedicated dashboard page | Documented exception in `apps/api/tests/dashboard-public-crud-matrix.test.ts` | Accepted management path |

## US4 Repair Decisions

| Task range | Finding | Decision |
|------------|---------|----------|
| T060-T065 | CRUD/public-read matrix passed for projects, project categories, services, partners, team, jobs, settings, and page content | No production route changes required |
| Messages and applications | They are public-submission/dashboard-review workflows, not public content after dashboard writes | Keep as documented exceptions; no CRUD rewrite |
| Success stories | Existing public display is backed by Page Content `home.successStories` | Keep accepted Page Content management path; no dedicated dashboard rewrite |
| Build | `npm run build --workspace=apps/api` completed successfully after US4 matrix tests | Pass |

## Final Verification Evidence

| Task | Check | Result |
|------|-------|--------|
| T067 | `npm run test --workspace=apps/api` | Pass: 74/74 API tests |
| T068 | `npm run typecheck` | Pass |
| T069 | `npm run build` | Pass; Vite emitted existing chunk-size warning for the public site bundle |
| T070 | `npm run build --workspace=apps/dashboard` | Pass; Vite emitted existing chunk-size and dynamic/static import warnings |
| Additional API build | `npm run build --workspace=apps/api` | Pass |
| T071 | `apps/api/src/models/Project.ts`, `apps/dashboard/src/pages/Projects.tsx`, and `src/pages/ProjectsPage.tsx` reviewed for the category contract | Pass: `Project.category` remains a string name contract; no `categoryId` requirement introduced |
| T072 | `integration-inventory.md` reviewed for resources without status, evidence, or deferred owner | Pass: each listed resource has a status, evidence, or documented exception |
| T073 | `contracts/api-integration-contracts.md` reviewed against implemented route behavior | Pass: contracts document current implemented routes and accepted Success stories Page Content path |
| T074 | `quickstart.md` reviewed for final commands, results, and deferred follow-ups | Pass |

## Final Deferred Follow-Ups

| Follow-up | Reason | Owner / Trigger |
|-----------|--------|-----------------|
| Dedicated Success stories dashboard page | Not needed for this package because public stories are managed through Page Content `home.successStories`; revisit only if the business wants standalone success story CRUD in the dashboard | Future feature request |
| Project category uniqueness by display name | Current package enforces slug uniqueness and preserves string category compatibility; name-level uniqueness can be added later if editorial workflow needs it | Future validation enhancement |
| Optional `categoryId` migration | Current public site and dashboard depend on `Project.category` as a string; any future migration must be additive/backward-compatible | Future data-model migration |
| Bundle size/code splitting | Public and dashboard builds pass but Vite reports chunks over 500 kB; not part of API integration repair | Future performance pass |
