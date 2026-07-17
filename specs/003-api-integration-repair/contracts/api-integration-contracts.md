# API Integration Contracts

These contracts document current compatibility expectations for the integration repair package. They are planning artifacts, not a runtime OpenAPI schema.

## Global Rules

- Public read routes remain unauthenticated where they are currently public.
- Dashboard create, update, delete, admin list, and admin status routes remain authenticated.
- Existing successful response bodies remain arrays or objects as currently consumed by clients; do not wrap them in a new envelope.
- Additive fields are allowed when clients can ignore them.
- Error responses should follow existing stabilized API error behavior where routes have been converted, and must not expose sensitive internals.

## Project Categories

### Public list

- **Request**: `GET /api/project-categories`
- **Auth**: None
- **Response**: Array of category objects.
- **Required fields**: `_id`, `name`, `slug`, `icon`, `order`, `isActive`
- **Compatibility consumers**:
  - `src/pages/ProjectsPage.tsx`
  - `apps/dashboard/src/pages/Projects.tsx`
  - `apps/dashboard/src/pages/ProjectCategories.tsx`

### Create category

- **Request**: `POST /api/project-categories`
- **Auth**: Dashboard token required
- **Body**: `name`, optional `slug`, optional `icon`, optional `order`, optional `isActive`
- **Response**: Created category object
- **Compatibility requirement**: Dashboard form payload in `ProjectCategories.tsx` remains valid.

### Update category

- **Request**: `PUT /api/project-categories/:id`
- **Auth**: Dashboard token required
- **Body**: Partial category fields
- **Response**: Updated category object
- **Compatibility requirement**: Renaming a category must keep existing projects findable by public project reads.

### Delete or disable category

- **Request**: `DELETE /api/project-categories/:id`
- **Auth**: Dashboard token required
- **Response**: Either `{ message: 'Category deleted' }` or `{ message, category }` when disabled because projects still reference it
- **Compatibility requirement**: Deletion must not leave projects with invalid public category display.

## Projects

- **Public list**: `GET /api/projects` returns array of project objects.
- **Public detail**: `GET /api/projects/:id` returns one project object.
- **Dashboard create**: `POST /api/projects` with current `ProjectFormData` payload.
- **Dashboard update**: `PUT /api/projects/:id` with current `ProjectFormData` payload.
- **Dashboard delete**: `DELETE /api/projects/:id` returns existing delete message shape.
- **Category compatibility**: `category` remains a string name for this repair package.

## Other Public/Dashboard Resources

| Resource | Public route(s) | Dashboard route(s) | Compatibility requirement |
|----------|-----------------|--------------------|---------------------------|
| Services | `GET /api/services` | `POST/PUT/DELETE /api/services` | Preserve array/object shapes used by service cards and dashboard form |
| Partners | `GET /api/partners` | `POST/PUT/DELETE /api/partners` | Preserve logo, name, abbreviation, website, description, order fields |
| Team | `GET /api/team` | `POST/PUT/DELETE /api/team` | Preserve name, role, bio, photo, social links |
| Jobs | `GET /api/jobs` | `GET /api/jobs/all`, `POST/PUT/DELETE /api/jobs` | Public reads active jobs; dashboard sees all jobs |
| Applications | `POST /api/applications/submit` | `GET /api/applications`, `PATCH /api/applications/:id/status`, `DELETE /api/applications/:id` | Preserve submit success and dashboard review shapes |
| Messages | `POST /api/messages/submit` | `GET /api/messages`, `PATCH /api/messages/:id/read`, `DELETE /api/messages/:id` | Preserve contact submit and dashboard message shapes |
| Settings | `GET /api/settings` | `PUT /api/settings` | Preserve singleton settings object |
| Page content | `GET /api/content/:page`, `GET /api/content/:page/:section` | `PUT /api/content/:page/:section` | Preserve page object mapping by section name |
| Success stories | Public UI reads `home.successStories` through `GET /api/content/home` | Managed through dashboard Page Content at `/content` using the `Success Stories` home section; standalone `GET/POST/PUT/DELETE /api/success-stories` exists in API | Page Content is the accepted management path for this package; do not claim a dedicated dashboard success stories page |

## Verification Contracts

- Project category route mount test must fail before wiring and pass after wiring.
- Dashboard route registration for `/project-categories` must be verifiable without changing the sidebar contract.
- Public project compatibility test must prove `GET /api/projects` still returns projects with string `category`.
- Dashboard CRUD compatibility tests must use current payload shapes from shared schemas where available.

## US3 Compatibility Verification

US3 adds scoped compatibility tests that exercise current public read and dashboard write contracts without introducing response envelopes or new required fields.

| Resource | Test file | Contract covered | Result |
|----------|-----------|------------------|--------|
| Projects | `apps/api/tests/projects-contract-compatibility.test.ts` | Public list/detail arrays and objects; dashboard create/update/delete; `Project.category` remains a string with no `categoryId` requirement | Pass |
| Project categories | `apps/api/tests/project-categories-crud.test.ts`, `apps/api/tests/project-category-contract.test.ts` | Public category list, dashboard create/update/delete, validation error shape, and project string category contract | Pass |
| Services | `apps/api/tests/services-contract-compatibility.test.ts` | Public list array, dashboard create/update object responses, delete message | Pass |
| Partners | `apps/api/tests/partners-contract-compatibility.test.ts` | Public list array, dashboard create/update object responses, delete message | Pass |
| Team | `apps/api/tests/team-contract-compatibility.test.ts` | Public list array, dashboard create/update object responses, delete message | Pass |
| Jobs | `apps/api/tests/jobs-contract-compatibility.test.ts` | Public active jobs list, dashboard all-jobs list, create/update object responses, delete message | Pass |
| Settings | `apps/api/tests/content-contract-compatibility.test.ts` | Public singleton settings object and dashboard singleton update object | Pass |
| Page content | `apps/api/tests/content-contract-compatibility.test.ts` | Public page section map, public section object, dashboard section document response | Pass |
| Messages | `apps/api/tests/submission-contract-compatibility.test.ts` | Public submit success message, dashboard list/read/delete contracts | Pass |
| Applications | `apps/api/tests/submission-contract-compatibility.test.ts` | Public submit success `{ message, id }`, dashboard list/status/delete contracts | Pass |

No US3 compatibility test proved a route contract mismatch, so no production route changes were made for T047-T053.
