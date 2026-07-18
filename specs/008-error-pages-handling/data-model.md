# Data Model: Error Pages and Global Error Handling

This feature does not add persisted database entities. The model describes frontend state contracts and classification values used by UI components.

## Error Surface

Represents the app area where an error state is rendered.

**Fields**

- `surface`: `public` or `dashboard`
- `scope`: `app`, `route`, `page`, or `section`
- `recoveryTarget`: safe route or action available to the user
- `supportsTechnicalDetails`: true only in development mode

**Validation rules**

- Dashboard recovery targets must not bypass authentication rules.
- Public recovery targets must remain public routes.
- Production rendering must ignore technical details even if present.

## Not Found State

Represents an unknown route or missing entity that is not caused by network/API unavailability.

**Fields**

- `surface`: `public` or `dashboard`
- `requestedPath`: current path, shown only if safe and useful
- `title`: safe user-facing title
- `message`: safe user-facing explanation
- `metadata`: not-found metadata for public pages
- `actions`: navigation actions such as home, projects, dashboard overview, or back

**State transitions**

- Unknown route -> Not Found State
- Missing project/entity after a successful 404 response -> Not Found State
- Network/API unavailable while resolving entity -> Data Unavailable State, not Not Found State

## General Error State

Represents runtime, route, render, or chunk/load failure.

**Fields**

- `surface`: `public` or `dashboard`
- `category`: `runtime`, `route`, `chunk-load`, or `unknown`
- `safeMessage`: production-safe explanation
- `technicalDetails`: DEV-only error message/stack/category
- `actions`: reload, retry, home/dashboard navigation

**Validation rules**

- `safeMessage` must not include stack traces, secrets, env values, raw payloads, internal hostnames, or private route details.
- `technicalDetails` may render only when `import.meta.env.DEV` or equivalent development guard is true.

## Data Unavailable State

Represents network/API unavailable failures on data-dependent pages or sections.

**Fields**

- `surface`: `public` or `dashboard`
- `scope`: `page` or `section`
- `resourceLabel`: safe label such as `projects`, `dashboard stats`, or `messages`
- `reason`: `offline`, `api-unavailable`, `timeout`, or `unknown-network`
- `retryAction`: query retry/refetch or page reload
- `fallbackContentAllowed`: whether static fallback content may be shown with an availability notice

**State transitions**

- Query loading -> Data loaded
- Query loading -> Data Unavailable State when network/API unavailable
- Query loading -> Not Found State only when a successful API response establishes the entity is missing
- Mutation validation failure -> Validation Error State

## Validation Error State

Represents user-correctable invalid input or action errors.

**Fields**

- `source`: form, field, upload, or action
- `fieldName`: optional field path
- `message`: validation-safe message
- `displayMode`: inline, form summary, or existing toast for mutations

**Validation rules**

- Must remain scoped to the relevant form/field/action.
- Must not be replaced by data-unavailable or app-level error messaging.

## Verification Evidence

Represents proof collected during implementation verification.

**Fields**

- `commandOrCheck`: command name or browser scenario
- `surface`: public, dashboard, or shared
- `viewport`: desktop, mobile, or N/A
- `scenario`: 404, runtime error, chunk/load error, network unavailable, typecheck, build
- `status`: passed, failed, or blocked
- `notes`: non-sensitive evidence and failure reason

**Validation rules**

- Notes must not include secrets, stack traces from production-mode UI, or raw private config.
