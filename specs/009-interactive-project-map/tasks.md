# Tasks: Interactive Project Map

**Input**: Design documents from `/specs/009-interactive-project-map/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: The feature explicitly requires typecheck, build, and desktop/mobile browser verification. Utility tests are included for the map-location resolver because the feature depends on deterministic coordinate/fallback behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel when assigned to different files or independent verification work
- **[Story]**: User story label for story-scoped tasks only
- Every task includes the file path or route/file surface it operates on

## Phase 1: Static Inventory and Baseline Verification

**Purpose**: Capture the current map, data, dependency, route, and SEO state before implementation.

- [x] T001 Inspect the current SVG/button map behavior in `src/components/projects/MalawiProjectMap.tsx` and document the static markers, selected-project panel, existing `/projects/${id}` link pattern, and missing empty-state behavior in `specs/009-interactive-project-map/tasks.md`
- [x] T002 [P] Inspect `ProjectRecord`, `RawProject`, `getCoordinates`, `inferCategory`, and `normalizeProject` in `src/lib/projectPresentation.ts` and confirm `Project.category` must remain unchanged in `specs/009-interactive-project-map/tasks.md`
- [x] T003 [P] Inspect current project coordinate sources in `src/data/projects.ts`, `apps/api/src/models/Project.ts`, and `packages/shared-ui/src/lib/validations/schemas.ts` and record whether explicit coordinates or city fallback data exist in `specs/009-interactive-project-map/tasks.md`
- [x] T004 [P] Inspect Leaflet dependency state in `package.json` and `package-lock.json` and confirm whether `leaflet`, `react-leaflet`, and `@types/leaflet` are already present in `specs/009-interactive-project-map/tasks.md`
- [x] T005 Run baseline `npm run typecheck` from `package.json` before implementation and record any pre-existing failures in `specs/009-interactive-project-map/quickstart.md`
- [x] T006 Run baseline `npm run build` from `package.json` before implementation and record any pre-existing failures in `specs/009-interactive-project-map/quickstart.md`
- [x] T007 Start the public app with `npm run dev` from `package.json` and capture baseline desktop `/projects` behavior for the current SVG map in `specs/009-interactive-project-map/quickstart.md`
- [x] T008 Capture baseline mobile `/projects` behavior for the current SVG map and document expected new verification points for nonblank map, tiles, markers, popups, links, pan, and zoom in `specs/009-interactive-project-map/quickstart.md`

---

## Phase 2: Foundational Setup

**Purpose**: Add map dependencies and shared typed location-resolution groundwork that blocks all stories.

**Critical**: No story implementation should begin until Leaflet dependencies and typed map-location behavior are ready.

- [x] T009 Add or confirm React 18-compatible `leaflet`, `react-leaflet`, and Leaflet TypeScript support in `package.json` and `package-lock.json`
- [x] T010 Import Leaflet CSS exactly once through the public app entry/style path in `src/main.tsx` or the chosen root stylesheet under `src/styles/`
- [x] T011 Create typed map-location resolver helpers for `ResolvedMapProject`, `SupportedMapCity`, coordinate validation, and city fallback matching in `src/lib/projectMapLocations.ts`
- [x] T012 Add safe fallback coordinates for Lilongwe, Blantyre, Mzuzu, and Nkhata Bay in `src/lib/projectMapLocations.ts`
- [x] T013 Add utility coverage for coordinate-first resolution, city fallback resolution, invalid-coordinate exclusion, and category preservation in `src/lib/projectMapLocations.test.ts`
- [x] T014 Confirm `src/router.tsx`, `src/lib/seo.ts`, `src/components/SeoHead.tsx`, `apps/api/src/models/Project.ts`, and `src/lib/projectPresentation.ts` do not receive API contract, SEO output, route, or `Project.category` behavior changes outside the planned map-location fallback work

**Checkpoint**: Dependencies are available, Leaflet CSS is reachable, and map-ready project resolution is deterministic.

---

## Phase 3: User Story 1 - Explore Projects on a Real Map (Priority: P1)

**Goal**: Visitors can view real project markers on an interactive Leaflet/OpenStreetMap map and pan/zoom it on desktop and mobile.

**Independent Test**: Open `/projects`, confirm the map is nonblank, OpenStreetMap tiles or a clear tile-failure fallback are visible, markers render for resolved projects, and pan/zoom works without changing route.

### Tests and Verification for User Story 1

- [x] T015 [P] [US1] Add or update resolver tests for explicit coordinates, Lilongwe fallback, Blantyre fallback, Mzuzu fallback, and Nkhata Bay fallback in `src/lib/projectMapLocations.test.ts`
- [x] T016 [US1] Run the User Story 1 resolver tests from `src/lib/projectMapLocations.test.ts` and confirm they fail before implementation if the resolver is new

### Implementation for User Story 1

- [x] T017 [US1] Replace the SVG outline and absolute button marker layer with a Leaflet `MapContainer` and OpenStreetMap `TileLayer` in `src/components/projects/MalawiProjectMap.tsx`
- [x] T018 [US1] Render a marker for every resolved project from typed map-location data in `src/components/projects/MalawiProjectMap.tsx`
- [x] T019 [US1] Configure initial center, zoom, min/max zoom, scroll behavior, and stable responsive dimensions for desktop/mobile in `src/components/projects/MalawiProjectMap.tsx`
- [x] T020 [US1] Preserve the existing project count/header/legend visual language while adapting it around the Leaflet map in `src/components/projects/MalawiProjectMap.tsx`
- [x] T021 [US1] Verify desktop `/projects` pan/zoom, nonblank map rendering, visible tiles, and visible markers against `src/components/projects/MalawiProjectMap.tsx`
- [x] T022 [US1] Verify mobile `/projects` map height, marker visibility, touch pan, zoom controls, and surrounding page scroll against `src/components/projects/MalawiProjectMap.tsx`

**Checkpoint**: User Story 1 is independently functional and testable as a real interactive map.

---

## Phase 4: User Story 2 - Open Project Details from Map Markers (Priority: P2)

**Goal**: Visitors can open marker popups and navigate from a popup to the existing project detail route.

**Independent Test**: Select a marker on `/projects`, confirm popup content includes project title/location and a link that navigates to `/projects/:id`.

### Implementation for User Story 2

- [x] T023 [US2] Add Leaflet popup content with project title, location, status, and category display in `src/components/projects/MalawiProjectMap.tsx`
- [x] T024 [US2] Add a project detail link in each popup using the existing `/projects/${project._id}` route in `src/components/projects/MalawiProjectMap.tsx`
- [x] T025 [US2] Ensure popup link styling is visible, tappable, and not clipped on desktop/mobile in `src/components/projects/MalawiProjectMap.tsx`
- [x] T026 [US2] Verify marker popup open/close behavior and `/projects/:id` navigation from `/projects` without changing `src/router.tsx`
- [x] T027 [US2] Confirm popup work did not modify `seoProfiles.projects`, `projectSeoProfile`, or route metadata in `src/lib/seo.ts` and `src/components/SeoHead.tsx`

**Checkpoint**: User Story 2 works independently after User Story 1 and preserves existing route/SEO behavior.

---

## Phase 5: User Story 3 - Handle Missing or Unavailable Map Data Gracefully (Priority: P3)

**Goal**: Visitors see clear fallback UI when no project locations exist or when the map/tiles cannot load.

**Independent Test**: Simulate no usable project locations and map/tile failure; confirm clear fallback UI appears without blank map space, raw errors, redirects, or broken project grid behavior.

### Implementation for User Story 3

- [x] T028 [US3] Add an empty-location fallback state when no projects resolve to markers in `src/components/projects/MalawiProjectMap.tsx`
- [x] T029 [US3] Add a map-unavailable fallback state for Leaflet initialization or tile load failure in `src/components/projects/MalawiProjectMap.tsx`
- [x] T030 [US3] Remove the misleading static `MAP_MARKERS` fallback behavior from `src/components/projects/MalawiProjectMap.tsx`
- [x] T031 [US3] Ensure fallback UI avoids stack traces, raw exceptions, internal hostnames, and raw API payloads in `src/components/projects/MalawiProjectMap.tsx`
- [x] T032 [US3] Verify no-location fallback by temporarily providing projects without coordinates or supported city names through `src/pages/ProjectsPage.tsx` or a local browser test override, then restore the file
- [x] T033 [US3] Verify map/tile failure fallback by blocking tile requests or using a local failure trigger against `src/components/projects/MalawiProjectMap.tsx`

**Checkpoint**: User Story 3 works independently as a graceful fallback layer on top of the map feature.

---

## Phase 6: Final Verification and Regression Checks

**Purpose**: Confirm the complete feature is safe, typed, buildable, visually usable, and does not break contracts.

- [x] T034 Run `npm run typecheck` from `package.json` and resolve only errors introduced by the interactive map work
- [x] T035 Run `npm run build` from `package.json` and resolve only build failures introduced by the interactive map work
- [x] T036 Perform final desktop browser verification on `/projects` for nonblank map, visible tiles, visible markers, working zoom, working pan, popup content, and project detail links in `src/components/projects/MalawiProjectMap.tsx`
- [x] T037 Perform final mobile browser verification on `/projects` for stable layout, visible markers, usable controls, tappable popups/links, and no content overlap in `src/components/projects/MalawiProjectMap.tsx`
- [x] T038 Confirm `/projects` and `/projects/:id` route behavior remains unchanged in `src/router.tsx` and `src/pages/ProjectsPage.tsx`
- [x] T039 Confirm normal `/projects` SEO output remains unchanged in `src/lib/seo.ts` and `src/components/SeoHead.tsx`
- [x] T040 Confirm no backend API contract or dashboard project category validation changed in `apps/api/src/models/Project.ts`, `apps/api/src/routes/`, and `packages/shared-ui/src/lib/validations/schemas.ts`
- [x] T041 Update verification notes with typecheck, build, desktop browser, mobile browser, fallback, route, SEO, and API contract results in `specs/009-interactive-project-map/quickstart.md`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1: Static Inventory and Baseline Verification** has no dependencies and should run first.
- **Phase 2: Foundational Setup** depends on Phase 1 and blocks all user stories.
- **Phase 3: User Story 1** depends on Phase 2 and is the MVP.
- **Phase 4: User Story 2** depends on marker rendering from User Story 1.
- **Phase 5: User Story 3** depends on the map component shape from User Story 1 but can be implemented before or after popup details once the map exists.
- **Phase 6: Final Verification and Regression Checks** depends on all selected user stories.

### User Story Dependencies

- **US1 (P1)**: Start after Phase 2. No dependency on US2 or US3.
- **US2 (P2)**: Requires US1 marker rendering but does not require US3 fallback work.
- **US3 (P3)**: Requires the resolved-location flow from Phase 2 and the map component shell from US1.

### Parallel Opportunities

- T002, T003, and T004 can run in parallel during inventory.
- T015 can run while T017-T020 are being prepared if the resolver API is agreed.
- T023 and T024 can be prepared together inside `MalawiProjectMap.tsx`, then integrated in order.
- T038, T039, and T040 can run in parallel after final build verification.

## Parallel Example: User Story 1

```text
Task: "T011 Create typed map-location resolver helpers for ResolvedMapProject, SupportedMapCity, coordinate validation, and city fallback matching in src/lib/projectMapLocations.ts"
Task: "T015 [P] [US1] Add or update resolver tests for explicit coordinates, Lilongwe fallback, Blantyre fallback, Mzuzu fallback, and Nkhata Bay fallback in src/lib/projectMapLocations.test.ts"
```

## Parallel Example: User Story 2

```text
Task: "T023 [US2] Add Leaflet popup content with project title, location, status, and category display in src/components/projects/MalawiProjectMap.tsx"
Task: "T027 [US2] Confirm popup work did not modify seoProfiles.projects, projectSeoProfile, or route metadata in src/lib/seo.ts and src/components/SeoHead.tsx"
```

## Parallel Example: User Story 3

```text
Task: "T028 [US3] Add an empty-location fallback state when no projects resolve to markers in src/components/projects/MalawiProjectMap.tsx"
Task: "T033 [US3] Verify map/tile failure fallback by blocking tile requests or using a local failure trigger against src/components/projects/MalawiProjectMap.tsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 inventory and baseline verification.
2. Complete Phase 2 dependencies, CSS import, and typed location resolver.
3. Complete Phase 3 and verify the interactive map, markers, pan, and zoom.
4. Stop and validate with `npm run typecheck`, `npm run build`, and desktop/mobile browser checks before adding popup navigation or failure-state refinements.

### Incremental Delivery

1. Deliver US1 as the first usable interactive map.
2. Add US2 popup navigation without changing routes or SEO.
3. Add US3 fallback states and failure handling.
4. Run Phase 6 checks before considering implementation complete.

### Safety Rules

- Do not change API endpoints, request/response payload shapes, route paths, normal SEO profiles, or `Project.category` behavior.
- Do not keep static placeholder markers when no real project locations resolve.
- Do not expose raw errors or stack traces in public fallback UI.
- Keep dependency changes scoped to root public app needs in `package.json` and `package-lock.json`.
