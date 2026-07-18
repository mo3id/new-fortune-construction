# Research: Interactive Project Map

## Decision: Use Leaflet with React Integration

**Decision**: Add `leaflet` and `react-leaflet` to the root public app and render OpenStreetMap tiles through React components.

**Rationale**: The user explicitly requested a Leaflet/OpenStreetMap interactive map. The current project is a React/Vite public app, so `react-leaflet` provides an idiomatic wrapper around Leaflet lifecycle, markers, popups, and map container behavior.

**Alternatives considered**:

- Keep the custom SVG and add pan/zoom behavior: rejected because it would still not be a true map and would require hand-built interactions.
- Use Mapbox/Google Maps: rejected because the request specified OpenStreetMap and Leaflet and these options introduce API keys or provider contracts.
- Use raw Leaflet without React integration: rejected because React component lifecycle integration would be more error-prone in the existing codebase.

## Decision: Preserve Existing API and Project Normalization Contracts

**Decision**: Continue using `ProjectRecord` from `src/lib/projectPresentation.ts` and do not change `/projects` API contracts, API model fields, public routes, SEO profiles, or `Project.category` normalization.

**Rationale**: The API model already supports optional `coordinates`, the shared validation schema already accepts optional coordinates, and public project normalization already accepts nested or top-level coordinate inputs. The map can be implemented using current data.

**Alternatives considered**:

- Add backend geocoding or new coordinate fields: rejected because the feature can work with existing fields and the spec requires API contract preservation.
- Change category inference to improve map grouping: rejected because the user explicitly said not to change `Project.category`.

## Decision: Resolve Coordinates in a Typed Safe Fallback Layer

**Decision**: Resolve each marker from valid explicit `lat/lng` first. If missing, use a typed safe city fallback table for known Malawi locations including Lilongwe, Blantyre, Mzuzu, and Nkhata Bay, plus existing city fallbacks already used by project presentation where appropriate.

**Rationale**: Explicit coordinates are the highest quality data. City-level fallbacks keep local fallback projects visible without pretending to provide precise site coordinates. A typed resolver makes edge cases testable and keeps map-specific behavior isolated.

**Alternatives considered**:

- Geocode arbitrary location strings at runtime: rejected because it adds network dependency, rate limiting, privacy, and failure modes.
- Use only explicit coordinates: rejected because current local project data has no explicit coordinates and would make the map empty in normal fallback mode.
- Keep SVG percentage fallback positions: rejected because Leaflet expects geographic coordinates and the new map should represent real map space.

## Decision: Use Explicit Empty and Error Fallback States

**Decision**: Replace static filler markers with clear empty-location and map-load-failure fallback UI.

**Rationale**: The current fallback creates an inaccurate visual when no project locations are available. The spec requires clear fallback behavior and no blank map area. Public visitors should understand whether the map has no usable locations or the map failed to load.

**Alternatives considered**:

- Always show city placeholder markers: rejected because it could misrepresent project data.
- Hide the map entirely: rejected because it makes the page feel broken and removes context for the user.

## Decision: Browser Verification Must Inspect the Real Rendered Map

**Decision**: Verify the map in a browser on desktop and mobile viewports, checking that the map is nonblank, tiles or failure fallback are visible, markers render, popups open, project links work, and panning/zooming responds.

**Rationale**: Leaflet rendering depends on CSS, container dimensions, tile loading, and browser events. Typecheck/build alone will not prove the map is actually usable.

**Alternatives considered**:

- Unit tests only: rejected because they cannot validate tile rendering, container sizing, or pointer interaction.
- Manual visual review without checks: rejected because this feature is primarily visual and interactive and needs repeatable verification steps.
