# Implementation Plan: API Integration Repair

**Branch**: `003-api-integration-repair` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/003-api-integration-repair/spec.md`

**Planning Scope Note**: This plan was created from static code inspection only. No application runtime, dev server, API server, database connection, or test command was executed during planning.

## Summary

Repair the integration path between the public website, dashboard, and API so dashboard-managed content reliably appears on the public site without breaking existing API contracts. The first implementation priority is project categories because the code already contains a category model, route file, dashboard page, sidebar entry, and public category consumer, but the API route is not mounted and the dashboard route is not registered. The plan then broadens to a static inventory-driven pass over public content resources, dashboard CRUD screens, API routes, validation schemas, and compatibility tests.

## Public Site Data Dependency Inventory

| Public dependency | Public usage | API route expected by public site | Dashboard surface | Current planning finding | Priority |
|-------------------|--------------|-----------------------------------|-------------------|--------------------------|----------|
| Projects | Home featured projects, portfolio listing, project details, map, filters | `GET /api/projects`, `GET /api/projects/:id` | `apps/dashboard/src/pages/Projects.tsx` | API route and dashboard CRUD exist; project category selector depends on category route | P1 |
| Project categories | Portfolio filters and category metadata | `GET /api/project-categories` | `apps/dashboard/src/pages/ProjectCategories.tsx` | Route file and dashboard page exist, but route is not mounted in `apps/api/src/index.ts` and dashboard path is not registered in `apps/dashboard/src/App.tsx` | P1 |
| Services | Home services section | `GET /api/services` | `apps/dashboard/src/pages/Services.tsx` | API CRUD and dashboard CRUD exist; needs contract regression tests | P2 |
| Partners | Home/client partner sections | `GET /api/partners` | `apps/dashboard/src/pages/Partners.tsx` | API CRUD and dashboard CRUD exist; needs contract regression tests | P2 |
| Team | About leadership/team section | `GET /api/team` | `apps/dashboard/src/pages/Team.tsx` | API CRUD and dashboard CRUD exist; needs contract regression tests | P2 |
| Jobs | Careers page active jobs | `GET /api/jobs`; dashboard uses `GET /api/jobs/all` | `apps/dashboard/src/pages/Jobs.tsx` | API public/admin split exists; needs dashboard/public compatibility tests | P2 |
| Applications | Public career application submit; dashboard application review | `POST /api/applications/submit`; dashboard list/status/delete | `apps/dashboard/src/pages/Applications.tsx` | Existing stabilized upload/validation flow; include compatibility regression only | P2 |
| Messages | Public contact submit; dashboard message review | `POST /api/messages/submit`; dashboard list/read/delete | `apps/dashboard/src/pages/Messages.tsx` | API/dashboard paths exist; route validation may be deferred or scoped | P2 |
| Site settings | Hero/contact/footer/map details | `GET /api/settings` | `apps/dashboard/src/pages/Settings.tsx` | API read/update and dashboard page exist; needs contract regression tests | P2 |
| Page content | About, careers, contact page sections | `GET /api/content/:page` | `apps/dashboard/src/pages/PageContent.tsx` | Section upsert route exists; needs inventory of required page/section keys | P2 |
| Success stories/testimonials | Partner/testimonial content area or page content fallback | `GET /api/success-stories` or `GET /api/content/:page` depending usage | No dedicated dashboard page found in static inventory | API CRUD exists but no dashboard navigation/page found; document as integration gap or wire existing content management deliberately | P3 |

## Technical Context

**Language/Version**: TypeScript with React 18/Vite frontends and Express API; API package uses CommonJS TypeScript build  
**Primary Dependencies**: React Router, TanStack Query, axios/fetch clients, Express, Mongoose, Zod, multer, shared `@fortune/shared-ui` schemas/components  
**Storage**: MongoDB via Mongoose models; local test strategy should continue using existing API test harness and memory database patterns  
**Testing**: API uses Node test runner with `ts-node/register` and Supertest-style harness in `apps/api/tests`; root verification uses `npm run typecheck` and `npm run build`  
**Target Platform**: Monorepo web application with public Vite site, dashboard Vite app, and Express API  
**Project Type**: Website + dashboard + API monorepo  
**Performance Goals**: Preserve existing public read performance characteristics; avoid additional client fetch waterfalls beyond existing data dependencies  
**Constraints**: No breaking changes to valid public site or dashboard API contracts; public read routes stay public; dashboard writes stay protected; do not weaken prior API security stabilization  
**Scale/Scope**: Repair and verify integration for current public content resources and dashboard CRUD surfaces, with project categories as the first deliverable

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Component-First UI**: PASS. Dashboard changes should reuse existing pages/components and only register or adjust surfaces needed for integration.
- **API-Contract Driven**: PASS. Plan includes contracts before implementation and requires compatibility checks for current request/response shapes.
- **Type Safety**: PASS. All planned changes stay TypeScript-first and should extend shared or API Zod schemas instead of untyped request bodies.
- **Test-First**: PASS. Implementation tasks must add API/dashboard integration tests before route wiring or behavior changes.
- **Performance & UX Consistency**: PASS. Category integration should avoid new public-site fetch waterfalls and preserve existing filter UX/fallback behavior.
- **Monorepo Discipline**: PASS. Work remains inside existing `src/`, `apps/dashboard`, `apps/api`, and shared package boundaries.

## Project Structure

### Documentation (this feature)

```text
specs/003-api-integration-repair/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api-integration-contracts.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/src/
├── index.ts
├── models/
│   ├── Project.ts
│   ├── ProjectCategory.ts
│   ├── Service.ts
│   ├── Partner.ts
│   ├── TeamMember.ts
│   ├── JobPosition.ts
│   ├── PageContent.ts
│   ├── SiteSettings.ts
│   └── SuccessStory.ts
├── routes/
│   ├── projectCategories.ts
│   ├── projects.ts
│   ├── services.ts
│   ├── partners.ts
│   ├── team.ts
│   ├── jobs.ts
│   ├── pageContent.ts
│   ├── settings.ts
│   └── successStories.ts
└── validation/
    └── schemas.ts

apps/api/tests/
├── helpers/
├── *integration*.test.ts
└── *compatibility*.test.ts

apps/dashboard/src/
├── App.tsx
├── components/Sidebar.tsx
├── lib/api.ts
└── pages/
    ├── ProjectCategories.tsx
    ├── Projects.tsx
    ├── Services.tsx
    ├── Partners.tsx
    ├── Team.tsx
    ├── Jobs.tsx
    ├── PageContent.tsx
    └── Settings.tsx

src/
├── App.tsx
├── pages/
│   ├── ProjectsPage.tsx
│   ├── ProjectDetailsPage.tsx
│   ├── CareersPage.tsx
│   ├── AboutPage.tsx
│   └── ContactPage.tsx
├── components/
│   ├── Services.tsx
│   ├── Partners.tsx
│   ├── Hero.tsx
│   ├── Footer.tsx
│   └── projects/
└── lib/
    ├── apiClient.ts
    └── projectPresentation.ts

packages/shared-ui/src/lib/validations/
└── schemas.ts
```

**Structure Decision**: Keep the existing three-surface monorepo structure. API contracts and server-side behavior live in `apps/api`; dashboard CRUD behavior lives in `apps/dashboard`; public consumption stays in root `src`; shared validation/types should be extended in `packages/shared-ui` only when both clients need the shape.

## Phase 0: Research Decisions

Research output is captured in [research.md](./research.md). Key decisions:

- Mount and verify the existing project category API route before expanding category behavior.
- Register the existing dashboard `ProjectCategories` page before adding any new UI.
- Preserve category identity as current public contract string values while planning a safer category record relationship as a deferred/backward-compatible enhancement.
- Use inventory-driven tests to verify every dashboard-managed public resource rather than rewriting all routes at once.

## Phase 1: Design And Contracts

- Data model: [data-model.md](./data-model.md)
- API/client contracts: [contracts/api-integration-contracts.md](./contracts/api-integration-contracts.md)
- Verification guide: [quickstart.md](./quickstart.md)
- Agent context updated in `AGENTS.md` to point at this plan.

## Planned Implementation Order

1. Add failing API tests proving `GET /api/project-categories` exists publicly and dashboard-protected category CRUD works.
2. Add failing dashboard/static route test or build-level verification proving `/project-categories` is registered, because the sidebar already links to it.
3. Mount `projectCategories` in `apps/api/src/index.ts` and register `ProjectCategories` in `apps/dashboard/src/App.tsx`.
4. Add category/project compatibility tests for create category, assign project category, public project read, rename category, and delete/disable category in use.
5. Add inventory/contract tests for projects, services, partners, team, jobs, settings, page content, messages, applications, and success stories or document explicit dashboard gaps.
6. Repair only confirmed route/client gaps while preserving existing public and dashboard request/response shapes.
7. Run API tests, root typecheck, and builds as final verification during implementation, not during planning.

## Complexity Tracking

No constitution violations are planned. No extra application, persistence layer, or broad architectural rewrite is required.
