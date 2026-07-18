# Performance Verification Contract

This contract defines the evidence required before and after implementing performance fixes for `specs/006-performance-optimization`.

## Static and Build Evidence

Each implementation phase must record:

- Public build command: `npm run build`
- Dashboard build command when dashboard work is touched: `npm run build --workspace=apps/dashboard`
- Root typecheck command: `npm run typecheck`
- Largest JS/CSS chunks and any Vite warnings
- Static source locations for every implemented fix
- Whether the finding came from `performance-inventory.md`

Passing criteria:

- Required commands complete successfully or are marked blocked with the exact non-sensitive reason.
- Every implemented change maps to a baseline finding.
- Remaining chunk warnings are documented with rationale and deferred follow-up when not fixed.

## Public Browser Evidence

Representative routes:

- `/`
- `/projects`
- `/projects/:id`
- `/services`
- `/about`
- `/hse`
- `/careers`
- `/contact`

Each checked route must record:

- Desktop and mobile viewport status where applicable.
- Console error summary.
- Failed network request summary.
- Page-level horizontal scroll status.
- Clipped or overflowed primary action status.
- SEO output status for metadata, canonical URL, social metadata, sitemap/robots assumptions, and structured data where relevant.

Passing criteria:

- No new console errors caused by performance changes.
- No new UI-caused failed requests.
- No page-level horizontal scroll or clipped primary actions.
- Current SEO outputs remain semantically unchanged.

## Dashboard Browser Evidence

Representative routes:

- `/login`
- `/`
- `/projects`
- `/project-categories`
- `/applications`
- `/messages`
- `/jobs`
- `/team`
- `/partners`
- `/services`
- `/settings`
- `/content`

Each checked route must record:

- Desktop and mobile viewport status where applicable.
- Console error summary.
- Failed network request summary.
- Horizontal scroll status.
- Table/list behavior status.
- Form/modal usability status when the route has forms or modals.
- Route registration and navigation reachability.

Passing criteria:

- Dashboard route names and navigation remain unchanged.
- Existing management actions remain visible and usable.
- No API request payload/response assumptions change.
- API runtime is started only after local-safe environment confirmation; otherwise API-dependent browser evidence is marked blocked or limited.

## API and SEO Guardrails

The feature must document:

- `Project.category` remains a string contract.
- Success Stories remain managed through Page Content.
- No dashboard routes are renamed or removed.
- No API endpoint, payload, response shape, auth, or base URL assumptions change.
- No sitemap, robots, canonical, social metadata, structured data, or page title/description contract changes are introduced.

API tests are required only if request/response assumptions are changed. Otherwise the final verification log must document why API tests were not necessary.

## Deferred Work Contract

The following work must be deferred unless a later task provides narrow, failing evidence and a compatibility-safe fix:

- API pagination or caching changes.
- CDN/media processing pipeline.
- Video re-encoding or design/content replacement.
- Dashboard-wide table virtualization.
- Broad visual redesign or route restructuring.
