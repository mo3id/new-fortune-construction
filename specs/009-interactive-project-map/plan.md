# Implementation Plan: Interactive Project Map

**Branch**: `[009-interactive-project-map]` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-interactive-project-map/spec.md`

## Summary

Replace the current decorative SVG-based Malawi project map in the public projects page with a real Leaflet/OpenStreetMap map. The implementation will keep the existing `ProjectsPage` route, project detail links, SEO profiles, API contracts, and `Project.category` behavior unchanged while adding map-specific location resolution, markers, popups, responsive sizing, and explicit empty/error fallback states.

## Technical Context

**Language/Version**: TypeScript 5.2, React 18, Vite 5, React Router 7-style data router  
**Primary Dependencies**: Existing React, React Router, TanStack Query, Tailwind CSS, lucide-react, `@fortune/shared-ui`; add `leaflet`, `react-leaflet`, and Leaflet TypeScript support if not bundled by installed package versions  
**Storage**: N/A; frontend rendering only. Existing project data continues to come from `/projects` or local `src/data/projects.ts` fallback  
**Testing**: `npm run typecheck`; `npm run build`; browser verification against local public dev server on desktop and mobile viewports  
**Target Platform**: Public Vite SPA rendered in modern desktop/mobile browsers  
**Project Type**: Monorepo web application with public frontend in root `src/` and API/dashboard workspaces unchanged  
**Performance Goals**: Keep initial projects page usable with map assets loading without blank layout; avoid broad route/SEO regressions; keep map container dimensions stable during tile loading  
**Constraints**: Preserve public API request/response contracts, current routes, project detail URL behavior, normal SEO output, and `Project.category` normalization. Do not require backend changes. Do not expose stack traces or raw errors in public fallback UI.  
**Scale/Scope**: One public component replacement, one map-location resolver/helper, one projects page integration point, Leaflet CSS/dependency setup, and desktop/mobile browser verification

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Component-First UI**: Pass. The interactive map remains a self-contained `MalawiProjectMap` component with map fallback states and marker popup rendering inside the component boundary.
- **API-Contract Driven**: Pass. The feature reads the existing normalized `ProjectRecord` shape and does not change backend endpoints, payload schemas, or project category contracts.
- **Type Safety (NON-NEGOTIABLE)**: Pass. Map point resolution, coordinate validation, and popup props must be typed. No `any` is planned.
- **Test-First**: Pass with scope note. This is a public frontend behavior change; required validation is typecheck, production build, and browser checks. Utility-level tests are recommended if location resolution is extracted into a pure helper.
- **Performance & UX Consistency**: Pass. Leaflet is added only for the project map, the map container gets stable responsive dimensions, and styling follows the existing slate/teal public project page language.
- **Monorepo Discipline**: Pass. Changes stay in root public app files and root package dependencies. API and dashboard workspaces remain untouched.

## Static Inventory

### Current Map Component

- `src/components/projects/MalawiProjectMap.tsx` currently renders an `<aside>` with a custom SVG outline of Malawi, Lake Malawi shape, static path decorations, and absolute-positioned `<button>` markers.
- The component accepts `projects: ProjectRecord[]`, computes `locatedProjects` with `getMarkerPosition`, and stores local `selectedId` state to render a separate selected-project panel below the SVG.
- Current coordinate handling projects real `lat/lng` values into hand-tuned SVG percentage positions using Malawi bounds, then clamps to the drawing area.
- Current fallback handling uses `LOCATION_POSITIONS` with city names: Chitipa, Mzuzu, Kasungu, Lilongwe, Salima, Mangochi, Zomba, Blantyre.
- If no projects resolve to locations, the component silently renders static `MAP_MARKERS`, which creates a visually full map but does not reflect actual project availability.
- Current marker links use `Link to={`/projects/${selectedProject._id}`}`, matching the existing `projects/:id` route.

### Project Model and Normalization

- `src/lib/projectPresentation.ts` defines `ProjectRecord` with `_id`, `title`, `category`, `status`, `location`, project detail fields, and optional `coordinates?: { lat: number; lng: number }`.
- `RawProject` accepts either nested `coordinates.lat/lng` or top-level `latitude` and `longitude`, each as number or string.
- `normalizeProject` calls `inferCategory(project.category, project.title)`. The implementation plan must not change this behavior or mutate `Project.category` as part of map location work.
- `getCoordinates` already prefers explicit coordinates and falls back by scanning `project.location`.
- Existing fallback coordinates include `lilongwe`, `blantyre`, `mzuzu`, `nkhata`, `salima`, `zomba`, and `kasungu`. The new plan should make the fallback set explicit for map use and support `Nkhata Bay` by name, not only the substring `nkhata`.
- `src/data/projects.ts` contains three local fallback projects. None define explicit coordinates, but their locations resolve through Lilongwe, Blantyre, Mzuzu, and Nkhata Bay text.
- `apps/api/src/models/Project.ts` already includes optional `coordinates.lat/lng`; no schema or endpoint change is required.
- `packages/shared-ui/src/lib/validations/schemas.ts` already accepts optional project coordinates in dashboard forms; no category or backend validation change is required.

### Projects Page, Routes, and SEO

- `src/pages/ProjectsPage.tsx` fetches `/projects`, normalizes API records, falls back to `fallbackProjects`, filters the grid by category/status/search, and passes the full `projects` array to `<MalawiProjectMap projects={projects} />`.
- The map currently shows all projects, not the filtered grid subset. Keep this behavior unless implementation discovers an existing UX decision that clearly expects filtered markers.
- Public route definitions in `src/router.tsx` include `/projects` and `/projects/:id`; these routes must remain unchanged.
- `src/lib/seo.ts` and `src/components/SeoHead.tsx` manage the projects SEO profile. The map replacement must not change normal page title, canonical, robots, social tags, or structured data behavior.

### Leaflet Dependency State

- `package.json` and `package-lock.json` do not currently list `leaflet`, `react-leaflet`, or `@types/leaflet`.
- The plan requires adding these dependencies at the root app level, then importing Leaflet CSS once in the public app entry or map component path.
- Because network access may be required to install packages, implementation should run dependency installation only when approved/available and keep package-lock changes scoped.

## Project Structure

### Documentation (this feature)

```text
specs/009-interactive-project-map/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── interactive-map-ui-contract.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
package.json                         # add leaflet/react-leaflet dependencies
package-lock.json                    # lock dependency additions
src/
├── components/
│   └── projects/
│       └── MalawiProjectMap.tsx      # replace SVG map with Leaflet map and fallback states
├── lib/
│   └── projectPresentation.ts        # keep Project.category behavior; refine coordinate/fallback resolution if shared
├── pages/
│   └── ProjectsPage.tsx              # preserve route/SEO; pass existing projects into map
└── styles or entrypoint              # import Leaflet CSS once if implementation pattern needs it
```

**Structure Decision**: Implement the feature in the public frontend boundary. Keep API models, dashboard pages, route definitions, and SEO profiles unchanged unless type integration requires a strictly additive frontend type refinement.

## Phase 0: Research Decisions

See [research.md](./research.md) for decisions and alternatives. Key decisions:

- Use Leaflet through `react-leaflet` for React integration and OpenStreetMap tiles.
- Resolve map positions from existing `ProjectRecord.coordinates` first, then a typed safe Malawi city fallback table.
- Keep city fallback logic category-independent and do not alter `Project.category`.
- Replace the static map filler markers with clear empty/error fallback states.
- Verify map rendering with real browser checks that inspect nonblank tiles, marker presence, popup content, and project links on desktop/mobile.

## Phase 1: Design & Contracts

- Define state/data entities in [data-model.md](./data-model.md).
- Define the public map UI behavior contract in [contracts/interactive-map-ui-contract.md](./contracts/interactive-map-ui-contract.md).
- Define the verification workflow in [quickstart.md](./quickstart.md).
- Update `AGENTS.md` to point to this plan as the active project context.

## Planned Verification

- `npm run typecheck`
- `npm run build`
- Start the public dev server with `npm run dev`.
- Browser check `/projects` desktop viewport:
  - Map container is nonblank after load.
  - OSM tiles are visible or the map failure fallback is visible when tiles cannot load.
  - Markers are visible for resolved projects.
  - Pan and zoom controls work.
  - Marker popup opens and includes project title/location plus a project detail link.
  - Project detail link navigates to the existing `/projects/:id` route.
- Browser check `/projects` mobile viewport:
  - Map has usable height and width.
  - Touch/drag pan and zoom controls do not trap the page or overlap neighboring content.
  - Popup content fits without clipping essential link text.
- Browser check fallback scenarios:
  - No usable locations displays a clear empty state.
  - Map initialization/load failure displays a clear fallback and does not break the rest of the projects page.
- Confirm normal `/projects` SEO metadata remains unchanged.
- Confirm no API endpoint, response shape, route path, or `Project.category` behavior changed.

## Post-Design Constitution Check

- **Component-First UI**: Pass. `MalawiProjectMap` remains the primary component, with helper extraction only if it improves testability and clarity.
- **API-Contract Driven**: Pass. The plan uses existing project fields and explicitly avoids endpoint/schema changes.
- **Type Safety**: Pass. Location resolution and marker rendering are represented as typed entities in the data model.
- **Test-First**: Pass. Browser and build checks are documented before implementation; pure resolver tests are included as a recommended implementation task if the helper is extracted.
- **Performance & UX Consistency**: Pass. Leaflet integration is constrained to one feature and uses stable responsive map dimensions.
- **Monorepo Discipline**: Pass. Source changes stay in the root public app and root dependency manifest.

## Complexity Tracking

No constitution violations require justification.
