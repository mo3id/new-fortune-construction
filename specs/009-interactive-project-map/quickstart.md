# Quickstart: Interactive Project Map Verification

## Prerequisites

- Dependencies are installed after adding Leaflet packages.
- Public app can run from the repository root.
- Map-location resolution is implemented in `src/lib/projectMapLocations.ts` with tests in `src/lib/projectMapLocations.test.ts`.

## Static Validation

1. Run type checking:

   ```bash
   npm run typecheck
   ```

2. Run production build:

   ```bash
   npm run build
   ```

## Browser Verification

1. Start the public dev server:

   ```bash
   npm run dev
   ```

2. Open `/projects` in a desktop viewport.

3. Verify:

   - The map area is not blank.
   - OpenStreetMap tiles are visible, or a clear map-unavailable fallback appears if tiles cannot load.
   - Markers are visible for projects with explicit coordinates or supported city fallbacks.
   - Pan works.
   - Zoom controls work.
   - Selecting a marker opens a popup.
   - Popup text includes project title and location.
   - Popup link navigates to the existing `/projects/:id` route.

4. Repeat `/projects` in a mobile viewport.

5. Verify:

   - Map container keeps a stable usable height.
   - Markers and controls remain tappable.
   - Popup content fits and does not hide the project link.
   - Page scroll remains usable around the map.

## Fallback Verification

1. In development, open `/projects?mapState=empty` to simulate a project list with no usable coordinates or supported city names.
2. Confirm the empty-location fallback appears instead of a blank map or static placeholder markers.
3. In development, open `/projects?mapState=fail` to simulate map load/init failure.
4. Confirm the map-unavailable fallback appears and does not expose internal errors.

## Regression Checks

- Confirm `/projects` still renders the same SEO profile metadata.
- Confirm `/projects/:id` links still work.
- Confirm no API endpoint, payload shape, or `Project.category` behavior changed.

## Verification Results

- Baseline before implementation: `npm run typecheck` passed.
- Baseline before implementation: `npm run build` passed.
- Dependencies added at the root only: `leaflet`, `react-leaflet@4`, `@types/leaflet`, and `vitest`.
- Resolver location: `src/lib/projectMapLocations.ts`; tests: `src/lib/projectMapLocations.test.ts`.
- Resolver verification: `npx vitest run src/lib/projectMapLocations.test.ts` passed with 7 tests.
- Final static validation: `npm run typecheck` passed.
- Final production validation: `npm run build` passed.
- Desktop browser verification on `/projects`: map rendered nonblank, 3 markers rendered, OSM tiles rendered, popup opened, and popup link navigated to `/projects/1`.
- Mobile browser verification on `/projects`: map rendered nonblank at 293x420, 3 markers rendered, OSM tiles rendered, popup opened, and popup link remained visible.
- Post-fallback-trigger browser verification on `/projects`: desktop and mobile normal map states still rendered nonblank with 3 markers, OSM tiles, and no fallback visible.
- Fallback verification: `/projects?mapState=empty` showed the no-location fallback with no markers.
- Fallback verification: `/projects?mapState=fail` showed the map-unavailable fallback without exposing stack traces or raw errors.
- Route/SEO/API safety: map implementation did not edit `src/router.tsx`, `src/lib/seo.ts`, `src/components/SeoHead.tsx`, API models/routes, shared validation schemas, or `Project.category` normalization.
- Behavior note: `MalawiProjectMap` displays the project list passed to it as-is; it does not apply project page filters internally.
