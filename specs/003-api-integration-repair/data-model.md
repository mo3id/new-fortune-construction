# Data Model: API Integration Repair

## Project Category

**Purpose**: Dashboard-managed taxonomy used by public project filters and dashboard project forms.

**Current fields observed**:

- `_id`: category identifier
- `name`: display name and current project category compatibility value
- `slug`: URL/filter-friendly string
- `icon`: icon key used by public/dashboard presentation
- `order`: display order
- `isActive`: controls whether the category should be selectable/displayed
- `createdAt` / `updatedAt`: timestamps from Mongoose

**Relationships**:

- Referenced by `Project.category` as a string name in the current compatibility contract.
- Consumed by public `ProjectsPage` as category filter options.
- Consumed by dashboard `Projects` as category select options.

**Validation rules**:

- `name` is required and should be unique enough to avoid ambiguous project assignment.
- `slug` is required and unique; empty slugs should be generated from `name`.
- `order` should be numeric and stable.
- `isActive` defaults to true.

**State transitions**:

- Created -> Active.
- Active -> Updated.
- Active -> Disabled when deletion is requested while projects still use the category.
- Active/Disabled -> Deleted only when no project references remain.
- Disabled -> Active when restored from dashboard.

## Project

**Purpose**: Public portfolio record managed from the dashboard and shown on home, listing, detail, and map views.

**Current fields observed**:

- `_id`, `title`, `category`, `status`, `location`, `clientName`
- `projectValue`, `budget`, `duration`, `yearCompleted`
- `overview`, `scopeOfWork`, `technologies`, `challenge`, `solution`, `result`
- `coverImage`, `galleryImages`
- `startDate`, `endDate`, `coordinates`
- `createdAt`, `updatedAt`

**Relationships**:

- Uses `category` string to align with `ProjectCategory.name`.
- Public project details and cards depend on `_id`, `title`, `category`, `status`, location/value/year/media fields.

**Validation rules**:

- Required public fields must remain compatible with existing dashboard schema.
- Category assignment should be one of the active category names when category data is available.
- Media URLs must preserve existing uploaded URL format.

## Public Content Resource

**Purpose**: Any API-backed data shown on the public website and expected to be dashboard-managed.

**Observed resources**:

- Projects
- Project categories
- Services
- Partners
- Team members
- Job positions
- Site settings
- Page content sections
- Contact messages
- Job applications
- Success stories/testimonials

**Required metadata for planning/implementation**:

- Public consumer file(s)
- Dashboard management file(s)
- API route(s)
- CRUD support level
- Public read contract
- Dashboard write contract
- Verification status
- Deferred exception status, if any

## Dashboard Management Surface

**Purpose**: Administrative UI and client calls used to manage a public content resource.

**Observed fields/behavior**:

- Route path in `apps/dashboard/src/App.tsx`
- Sidebar visibility in `apps/dashboard/src/components/Sidebar.tsx`
- Query keys and mutation calls using `apps/dashboard/src/lib/api.ts`
- Form schema imported from `@fortune/shared-ui` or local schema

**Validation rules**:

- Sidebar links must correspond to registered dashboard routes.
- Dashboard API calls must point to mounted API routes.
- Successful mutations must invalidate relevant query keys.

## API Contract

**Purpose**: Existing request and response shape used by public site and dashboard.

**Contract rules**:

- Existing successful public read shapes must remain valid.
- Existing dashboard CRUD request payloads must remain valid.
- Additive response fields are allowed.
- Renamed fields, removed fields, or changed success envelopes are breaking and out of scope unless separately approved.

## Integration Gap

**Purpose**: A tracked mismatch between public usage, dashboard usage, and API support.

**Fields**:

- Resource name
- Public dependency
- Dashboard dependency
- API route/model dependency
- Gap type: missing mount, missing dashboard route, missing CRUD, contract mismatch, missing validation, or missing tests
- Priority
- Resolution plan
- Verification evidence
