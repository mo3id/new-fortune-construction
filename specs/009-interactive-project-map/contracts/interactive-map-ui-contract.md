# UI Contract: Interactive Project Map

## Scope

This contract describes the public behavior of the interactive project map on the existing `/projects` route. It does not define or change backend API endpoints.

## Inputs

The map receives the existing `projects: ProjectRecord[]` prop.

Each project may include:

- `_id`
- `title`
- `location`
- `status`
- `category`
- optional `coordinates.lat`
- optional `coordinates.lng`

## Location Resolution Contract

1. For each project, use explicit `coordinates.lat/lng` when both values are valid finite numbers.
2. If explicit coordinates are unavailable, scan `project.location` against supported Malawi city fallback names.
3. Supported fallback names must include Lilongwe, Blantyre, Mzuzu, and Nkhata Bay.
4. Projects with no valid coordinates and no supported fallback are omitted from marker rendering.
5. Location resolution must not change `project.category`, project route identifiers, or API data.

## Ready State Contract

When at least one project resolves to a map location:

- The component renders an interactive map using OpenStreetMap tiles.
- The map supports pan and zoom controls.
- A marker appears for each resolved project.
- Selecting a marker opens a popup.
- Each popup includes the project title and location.
- Each popup includes a link to the existing project detail route when `_id` is available.
- The link target remains `/projects/{project._id}`.

## Empty State Contract

When no projects resolve to usable map locations:

- The component renders a clear empty-location fallback.
- The fallback explains that no mapped project locations are currently available.
- The component does not show misleading static placeholder project markers.
- The rest of the `/projects` page remains usable.

## Failure State Contract

When the map library, map container, or map tiles fail to load or initialize:

- The component renders a clear map-unavailable fallback.
- The fallback avoids stack traces, raw exceptions, internal hostnames, and raw API payloads.
- The page remains on the existing route and does not redirect.
- Project grid and filters remain usable.

## Responsiveness Contract

- Desktop map layout fits the existing projects page sidebar column without overflowing.
- Mobile map layout has stable height and width and remains usable with touch interactions.
- Popup content and project link text must not be clipped or overlap neighboring UI.
- Map controls must not cover essential popup link content.

## SEO and Route Contract

- `/projects` route remains unchanged.
- `/projects/:id` route remains unchanged.
- Existing `seoProfiles.projects` output remains unchanged.
- No new public API endpoint is introduced.
- No existing API request or response shape is changed.
