# Feature Specification: Interactive Project Map

**Feature Branch**: `[009-interactive-project-map]`  
**Created**: 2026-07-18  
**Status**: Draft  
**Input**: User description: "أريد تحسين خريطة المشاريع في الموقع العام لتظهر كخريطة تفاعلية حقيقية بدل الرسم الحالي. المطلوب استبدال الخريطة الحالية في src/components/projects/MalawiProjectMap.tsx بخريطة Leaflet/OpenStreetMap تفاعلية تعرض مواقع المشاريع كـ markers مع popups وروابط للمشاريع، وتدعم zoom/pan، وتستخدم coordinates إن وجدت أو fallback آمن من أسماء المدن مثل Lilongwe وBlantyre وMzuzu، مع الحفاظ على API contracts وSEO والـ routes الحالية. يجب أن تكون متجاوبة على desktop/mobile، وتحتوي fallback واضح عند فشل تحميل الخريطة أو عدم وجود مواقع، مع typecheck/build/browser verification."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explore Projects on a Real Map (Priority: P1)

As a public site visitor, I can view project locations on an interactive map so that I understand where Fortune Construction projects are located in Malawi.

**Why this priority**: The current visual map does not provide real location exploration. This is the core user value of the feature.

**Independent Test**: Can be tested by opening the public projects page or section that contains the project map, confirming visible project markers, panning the map, and changing zoom level without leaving the current route.

**Acceptance Scenarios**:

1. **Given** the public site has projects with usable location data, **When** a visitor opens the project map, **Then** the map displays markers at the corresponding project locations.
2. **Given** the project map is visible, **When** a visitor pans or zooms the map, **Then** the map responds interactively and remains usable.
3. **Given** the visitor is on a mobile viewport, **When** the project map loads, **Then** the map is sized and controlled appropriately for touch interaction without breaking the surrounding page layout.

---

### User Story 2 - Open Project Details from Map Markers (Priority: P2)

As a public site visitor, I can select a project marker and follow a project link so that the map helps me navigate to relevant project details.

**Why this priority**: Marker popups turn the map from decorative context into a discovery and navigation tool.

**Independent Test**: Can be tested by selecting a marker, reviewing the popup content, and using its link to navigate to the existing project detail route.

**Acceptance Scenarios**:

1. **Given** a project marker is visible, **When** the visitor selects it, **Then** a popup displays the project name and a clear link to that project.
2. **Given** a marker popup contains a project link, **When** the visitor activates the link, **Then** the site navigates using the existing project route behavior.

---

### User Story 3 - Handle Missing or Unavailable Map Data Gracefully (Priority: P3)

As a public site visitor, I receive clear fallback messaging when map data or the map view cannot be shown so that the page remains understandable and useful.

**Why this priority**: The public page must not appear broken when location data is incomplete or the map service fails to load.

**Independent Test**: Can be tested by simulating no usable project locations and by simulating map load failure, confirming the page displays an understandable fallback without route or SEO regressions.

**Acceptance Scenarios**:

1. **Given** no projects have usable locations, **When** the map area renders, **Then** the page shows a clear empty-state fallback instead of a blank or misleading map.
2. **Given** the interactive map cannot load, **When** the map area renders, **Then** the page shows a clear failure fallback and preserves the rest of the page content.
3. **Given** a project has no coordinates but has a recognized Malawi city name, **When** the map prepares project locations, **Then** the project is placed using a safe city-level fallback location.

### Edge Cases

- Projects may include precise coordinates, city-only location data, both, or neither.
- Project location names may use known city names such as Lilongwe, Blantyre, or Mzuzu with minor casing differences.
- Multiple projects may resolve to the same city-level fallback location and still need distinguishable marker or popup access.
- The map provider assets or tiles may fail to load due to network, content blocking, or provider availability.
- The project list may be empty, filtered down to no mapped projects, or contain projects with unpublished or missing detail links.
- Desktop and mobile layouts must avoid scroll traps, clipped controls, and content overlap around the map.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The public project map MUST render as an interactive map that supports visitor panning and zooming.
- **FR-002**: The map MUST show one marker for each project with a usable location derived from project data.
- **FR-003**: The system MUST prefer explicit project coordinates when valid coordinates are available.
- **FR-004**: The system MUST provide safe city-level fallback coordinates for recognized Malawi city names, including Lilongwe, Blantyre, Mzuzu, and Nkhata Bay.
- **FR-005**: The system MUST exclude projects from the map when neither valid coordinates nor a recognized safe fallback location is available.
- **FR-006**: Each project marker MUST provide a popup containing the project name and a clear way to open the existing project detail view when a valid detail route is available.
- **FR-007**: The feature MUST preserve existing public routes, project detail URL behavior, API request/response contracts, and normal SEO output.
- **FR-008**: The map area MUST be responsive and usable on desktop and mobile viewports.
- **FR-009**: The map area MUST display a clear fallback when no usable project locations are available.
- **FR-010**: The map area MUST display a clear fallback when the interactive map cannot load or initialize.
- **FR-011**: The feature MUST avoid exposing internal errors, stack traces, raw API payloads, or implementation diagnostics to public visitors.
- **FR-012**: The project map MUST continue to work with the current project data shape and must not require backend changes for existing projects.
- **FR-013**: The implementation MUST pass type checking, production build validation, and browser verification for desktop and mobile map behavior before completion.

### Key Entities *(include if feature involves data)*

- **Project**: A public project shown on the site. Relevant attributes include display name, existing detail route identifier or link, optional coordinates, and optional location/city text.
- **Map Location**: A resolved display position for a project, based on explicit coordinates when available or a recognized safe city fallback.
- **City Fallback**: A maintained mapping from recognized Malawi city names to approximate city-level coordinates used only when project-level coordinates are missing.
- **Map Fallback State**: A user-facing state shown when no locations can be displayed or when the map cannot load.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of projects with valid explicit coordinates appear on the map at their provided locations during browser verification.
- **SC-002**: Projects whose location text matches supported fallback cities appear at safe city-level locations when explicit coordinates are absent.
- **SC-003**: Visitors can pan and zoom the map on both desktop and mobile verification viewports without layout breakage or content overlap.
- **SC-004**: At least one verified marker popup displays project information and navigates through the existing project detail route.
- **SC-005**: Empty-location and map-load-failure scenarios show clear fallback UI instead of a blank map area.
- **SC-006**: Existing public routes, SEO metadata for normal pages, and API request/response contracts remain unchanged after the feature is implemented.
- **SC-007**: Required validation commands and browser checks complete successfully before the feature is considered ready.

## Assumptions

- The interactive map appears wherever the current public project map component is already rendered.
- Existing project records may already contain coordinates, location text, city text, or a similar location field that can be read without backend contract changes.
- City fallback locations are approximate and are intended to place projects at city level only when precise coordinates are unavailable.
- The first supported fallback cities are Lilongwe, Blantyre, Mzuzu, and Nkhata Bay; additional Malawi cities may be added if already present in project data.
- Public visitors do not need to edit coordinates or project map locations from this feature.
- Map failure fallback should preserve the page content and navigation around it rather than redirecting visitors.
