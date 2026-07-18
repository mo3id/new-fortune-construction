# UI Contract: Error Pages and Global Error Handling

## Public 404 Contract

**Trigger**

- Unknown public route.
- Entity route where the entity is confirmed missing and the API/network is available.

**User-visible behavior**

- Show a public-branded not-found page.
- Offer recovery actions to public home and relevant public navigation.
- Do not silently redirect.
- Include not-found metadata suitable for noindex behavior.

**Must not do**

- Do not change existing normal public routes.
- Do not change sitemap or normal SEO profiles.
- Do not show stack traces or raw route internals.

## Dashboard 404 Contract

**Trigger**

- Unknown authenticated dashboard route.

**User-visible behavior**

- Show a dashboard-native not-found page inside the expected dashboard experience when authenticated.
- Preserve unauthenticated redirect to login for protected dashboard areas.
- Offer recovery to dashboard overview or previous safe location.
- Do not silently redirect wildcard routes to `/`.

**Must not do**

- Do not expose protected data to unauthenticated users.
- Do not change existing dashboard route meanings.

## General Error Contract

**Trigger**

- Runtime render error.
- Route-level error.
- Lazy import/chunk/load failure.
- Unknown app failure that would otherwise blank the screen.

**Production behavior**

- Show safe title, safe explanation, and reload/navigation actions.
- Hide stack traces, source file paths, environment values, secrets, internal hostnames, raw payloads, and private request/response details.

**Development behavior**

- Show the same recovery actions.
- Add technical diagnostics sufficient to identify the error category and failing route/component where available.

## Data Unavailable Contract

**Trigger**

- Data-dependent public or dashboard page/section cannot reach the API.
- Network offline, fetch/Axios network failure, timeout, or API unavailable response classified as availability failure.

**User-visible behavior**

- Show a page-level or section-level unavailable state with retry/reload action.
- Use copy that describes service availability, not invalid user input.
- Public pages may show existing static fallback content only when the unavailability notice remains clear.
- Dashboard data management pages should avoid presenting stale empty lists as if the API returned no records.

**Must not do**

- Do not replace zod/react-hook-form inline validation messages.
- Do not treat invalid form submissions as network outages.
- Do not change API response shapes.

## Verification Contract

Implementation is not complete until evidence covers:

- Public 404 desktop and mobile.
- Dashboard 404 desktop and mobile.
- Public general error desktop and mobile.
- Dashboard general error desktop and mobile.
- Public network unavailable representative page/section.
- Dashboard network unavailable representative page/section.
- Production-safe UI redaction.
- DEV-only technical diagnostics.
- `npm run typecheck`.
- `npm run build`.
- `npm run build --workspace=apps/dashboard`.
