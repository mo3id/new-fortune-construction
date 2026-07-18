# Research: Error Pages and Global Error Handling

## Decision: Use layered error handling

**Decision**: Combine app-level ErrorBoundary mounting in `src/main.tsx` and `apps/dashboard/src/main.tsx` with route-level error/not-found handling in the public router and dashboard route tree.

**Rationale**: App-level boundaries catch render/runtime failures outside route resolution, while route-level fallbacks give better context for 404 and route errors. This covers blank-screen failures without forcing all errors through one generic component.

**Alternatives considered**:

- Only app-level ErrorBoundary: simpler, but does not express route-specific 404 behavior and cannot replace dashboard silent wildcard redirect cleanly.
- Only route-level handling: misses failures above the router/provider shell and does not work the same way across the public data router and dashboard component router.

## Decision: Preserve dashboard auth redirect but replace wildcard redirect

**Decision**: Keep `PrivateRoute` unauthenticated redirect to `/login`, but replace the final `path="*"` redirect to `/` with explicit dashboard `NotFoundPage` handling.

**Rationale**: Login redirect is auth flow, not not-found handling. The wildcard redirect hides broken links and conflicts with the spec requirement for clear 404 handling.

**Alternatives considered**:

- Remove all redirects: would break expected protected-route behavior.
- Show 404 before auth checks for every dashboard route: risks exposing dashboard structure and confusing unauthenticated users.

## Decision: Classify network/API unavailable separately from validation

**Decision**: Introduce frontend-side error classification for fetch and Axios failures so query loading failures can render a data-unavailable page/section. Keep zod/react-hook-form validation messages inline and mutation validation errors in their current workflow.

**Rationale**: Availability failures are service conditions and should offer retry/reload/navigation. Validation errors are user-correctable and should remain attached to fields or actions.

**Alternatives considered**:

- Use existing toast errors for all failures: insufficient for pages that cannot render useful data and too easy to miss.
- Convert all API errors into page-level failures: would wrongly treat validation or permission failures as outages.

## Decision: Treat chunk/load failures as safe general app errors

**Decision**: Detect common dynamic import/chunk load failure shapes and route them to the general `AppErrorPage` with reload/retry action and DEV-only technical details.

**Rationale**: Vite deployments can produce stale chunk references in active browsers. Users need a clear reload path, while production must not expose raw stack traces.

**Alternatives considered**:

- Let Suspense loading remain indefinitely: creates blank/stuck experiences.
- Force full reload for every error automatically: may loop and hides useful DEV diagnostics.

## Decision: Add only 404/error metadata

**Decision**: Add public SEO profiles only for not-found/general error states, likely noindex-oriented, and do not modify existing normal-page SEO profiles or sitemap/robots outputs.

**Rationale**: Error pages need appropriate metadata, but the spec explicitly protects normal SEO output.

**Alternatives considered**:

- Reuse home metadata on errors: misleading for crawlers and users.
- Broad SEO refactor: outside scope and higher regression risk.

## Decision: Browser verification uses safe simulation hooks/routes

**Decision**: Implementation should include development/test-only ways to simulate runtime/load/network unavailable states for browser verification, without exposing production routes that intentionally crash.

**Rationale**: Error states must be testable, but production should not carry public crash triggers.

**Alternatives considered**:

- Manually edit code to throw during verification: brittle and hard to reproduce.
- Use production-visible crash routes: unacceptable operational risk.
