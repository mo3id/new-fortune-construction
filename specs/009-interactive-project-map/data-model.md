# Data Model: Interactive Project Map

## ProjectRecord

**Source**: `src/lib/projectPresentation.ts`

Represents the normalized public project data consumed by the projects page and map.

**Relevant fields**:

- `_id: string` - Existing identifier used by `/projects/:id` links.
- `title: string` - Displayed in marker popups.
- `category: string` - Existing project category. Must be preserved and not changed by map work.
- `status: 'Ongoing' | 'Completed'` - Used for marker status styling or popup context.
- `location: string` - Displayed in popups and scanned for safe fallback city names.
- `coordinates?: { lat: number; lng: number }` - Preferred source for marker position.

**Validation rules**:

- Coordinates are usable only when both latitude and longitude are finite numbers.
- Malawi map display should reject invalid or empty coordinate pairs before marker rendering.
- Project category is read-only for this feature.

## RawProject

**Source**: API response or local fallback input before normalization.

**Relevant fields**:

- `coordinates?.lat`, `coordinates?.lng`
- `latitude`, `longitude`
- `location`
- `category`
- `title`

**Validation rules**:

- Existing normalization may coerce number-like strings to numbers.
- No new required fields are introduced.
- Existing API payload shape remains valid.

## ResolvedMapProject

**Purpose**: Internal map-ready representation derived from a `ProjectRecord`.

**Fields**:

- `project: ProjectRecord`
- `position: { lat: number; lng: number }`
- `source: 'coordinates' | 'city-fallback'`
- `fallbackCity?: SupportedMapCity`

**Relationships**:

- One `ProjectRecord` may produce zero or one `ResolvedMapProject`.
- A project produces no resolved marker when it has neither valid coordinates nor a supported city fallback.
- Multiple projects may share the same city fallback position.

**Validation rules**:

- Explicit project coordinates win over city fallback.
- City fallback matching is case-insensitive and should tolerate location strings that contain a supported city name inside a longer phrase.
- `Nkhata Bay` should be supported as a named fallback; matching the substring `nkhata` is acceptable only if documented and deterministic.

## SupportedMapCity

**Purpose**: Maintained safe fallback coordinate table for Malawi cities.

**Initial values**:

- `Lilongwe`
- `Blantyre`
- `Mzuzu`
- `Nkhata Bay`

**Additional existing candidates**:

- `Salima`
- `Zomba`
- `Kasungu`
- `Chitipa`
- `Mangochi`

**Validation rules**:

- Coordinates are approximate city-level positions, not precise project sites.
- Adding a city fallback must not change project category or API data.

## MapRenderState

**Purpose**: User-facing rendering state for the map area.

**States**:

- `ready` - Map is initialized and has one or more resolved markers.
- `empty` - No projects have usable coordinates or supported fallback locations.
- `failed` - Map initialization or tile/component loading fails.

**Validation rules**:

- `empty` and `failed` states render clear fallback UI.
- Fallback UI must not expose raw errors or stack traces to public visitors.
- The rest of the projects page remains usable in all states.
