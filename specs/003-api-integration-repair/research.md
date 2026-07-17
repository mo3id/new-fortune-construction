# Research: API Integration Repair

**Planning method**: Static code inspection only. No runtime commands, dev servers, API servers, database connections, or test commands were executed.

## Decision: Treat project categories as the first integration repair

**Rationale**: The codebase already contains `apps/api/src/models/ProjectCategory.ts`, `apps/api/src/routes/projectCategories.ts`, `apps/dashboard/src/pages/ProjectCategories.tsx`, a sidebar link to `/project-categories`, and public category consumption in `src/pages/ProjectsPage.tsx`. Static inspection found that `apps/api/src/index.ts` does not mount `projectCategories`, and `apps/dashboard/src/App.tsx` does not register the `/project-categories` route. This makes project categories the smallest high-value integration fix.

**Alternatives considered**:

- Build a new categories feature from scratch: rejected because most of the feature already exists.
- Remove dashboard category UI: rejected because the public site already consumes categories and the dashboard sidebar already advertises management.
- Keep hard-coded public fallback categories only: rejected because the feature requires dashboard-to-public synchronization.

## Decision: Preserve category names as the compatibility contract for projects

**Rationale**: `Project.category` is currently a required string, dashboard project forms submit category names, and public filters compare `project.category === category`. Replacing this with a category id would be a breaking contract change. The near-term repair should keep string category names working while making the category route available and tested.

**Alternatives considered**:

- Replace project category with a foreign key immediately: rejected as a breaking change for current public and dashboard clients.
- Store both `categoryId` and `category` immediately: possible future improvement, but not required to repair the existing contract.

## Decision: Use dashboard/public compatibility tests as the main guardrail

**Rationale**: The risk is not only missing routes but disconnected flows between three surfaces. Tests should prove dashboard mutations are visible through public reads while existing valid clients keep their current shapes.

**Alternatives considered**:

- Only test individual routes: insufficient because the feature is about cross-surface integration.
- Only rely on browser/manual QA: insufficient for regression prevention and conflicts with the constitution's test-first principle.

## Decision: Keep route repairs incremental and inventory-driven

**Rationale**: Services, partners, team, jobs, settings, page content, applications, and messages already have corresponding API/dashboard/public paths. The plan should verify contracts first and only repair confirmed gaps. Success stories have an API route but no dedicated dashboard page found in static inventory, so this should be explicitly documented or connected based on product intent.

**Alternatives considered**:

- Rewrite all resource routes with new abstractions in one pass: rejected as too risky for compatibility.
- Ignore resources that appear to work: rejected because the spec requires proving dashboard CRUD and public/dashboard compatibility.

## Decision: Do not run runtime checks during planning

**Rationale**: The user explicitly requested no runtime in the planning phase. All findings are therefore static and must be verified during implementation with tests/builds.

**Alternatives considered**:

- Run API tests now for confidence: rejected because it violates the planning constraint.
