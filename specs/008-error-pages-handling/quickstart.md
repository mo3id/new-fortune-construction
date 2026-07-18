# Quickstart: Error Pages and Global Error Handling

## Static inventory commands

```bash
rg -n "ErrorBoundary|errorElement|useRouteError|Navigate|path=\"\\*\"|useQuery|isError|toast\\.error|setError|errors\\." src apps/dashboard/src
sed -n '1,220p' src/main.tsx
sed -n '1,260p' src/router.tsx
sed -n '1,220p' apps/dashboard/src/main.tsx
sed -n '1,260p' apps/dashboard/src/App.tsx
sed -n '1,220p' src/lib/apiClient.ts
sed -n '1,260p' apps/dashboard/src/lib/api.ts
```

## Planned implementation order

1. Add or adapt public `AppErrorPage`, `NotFoundPage`, and data-unavailable components.
2. Mount public app-level `ErrorBoundary` in `src/main.tsx`.
3. Add public route-level error/not-found handling in `src/router.tsx`.
4. Add 404/error SEO profiles only, preserving existing normal-page profiles.
5. Add or adapt dashboard `AppErrorPage`, `NotFoundPage`, `ErrorBoundary`, and data-unavailable components.
6. Mount dashboard app-level `ErrorBoundary` in `apps/dashboard/src/main.tsx`.
7. Replace dashboard wildcard redirect with explicit not-found handling in `apps/dashboard/src/App.tsx`.
8. Add network/API unavailable classification and apply it to representative public and dashboard data pages.
9. Confirm validation errors remain inline and mutation/action errors keep their current context.
10. Run build/typecheck/browser verification.

## Verification commands

```bash
npm run typecheck
npm run build
npm run build --workspace=apps/dashboard
```

## Implementation verification evidence

Last run: 2026-07-18.

- `npm run typecheck`: passed.
- `npm run build`: passed. Vite reported a non-blocking large chunk warning for the public app.
- `npm run build --workspace=apps/dashboard`: passed.
- Public dev browser checks used `http://localhost:5176/` after Vite selected the next available port.
- Dashboard dev browser checks used `http://localhost:5177/` after Vite selected the next available port.
- Public production preview checks used `http://localhost:5180/` for 404 and unavailable states.
- Dashboard production redaction was also checked against the built bundle for DEV-only probe strings.

## Browser verification scenarios

Use local dev servers or preview builds as appropriate.

Public desktop and mobile:

- Open an unknown path such as `/definitely-not-a-real-page`.
- Confirmed a 404 page appears and the URL is not silently redirected on desktop and mobile.
- Triggered safe runtime/load error simulations with `?fortune_error=runtime` and `?fortune_error=chunk` in DEV on desktop and mobile.
- Confirmed DEV mode shows diagnostics only in DEV-rendered error states.
- Confirmed production public 404/unavailable UI renders without `<pre>`, stack traces, probe strings, raw payloads, or environment values.
- Simulated API/network unavailable by leaving the local API unavailable on `/projects`; the page showed a safe unavailable section while preserving fallback portfolio content.

Dashboard desktop and mobile:

- Open an unknown authenticated dashboard path such as `/definitely-not-a-dashboard-page`.
- Confirmed a dashboard 404 appears instead of redirecting to `/` on desktop and mobile.
- Confirmed unauthenticated protected routes still redirect to `/login`.
- Triggered safe runtime/load error simulations with `?fortune_error=runtime` and `?fortune_error=chunk` in DEV on desktop and mobile.
- Simulated API/network unavailable on `/`; the dashboard showed an overview unavailable state with retry.
- Confirmed the production dashboard bundle does not contain DEV probe strings or DEV-only verification messages.

Validation separation:

- Submit invalid public and dashboard forms.
- Confirmed invalid public contact form submission shows inline field validation and not a general error.
- Confirmed invalid dashboard login submission shows inline field validation and not a general error.

Production safety:

- Build production bundles and inspect rendered error states.
- Confirmed public production-rendered 404/unavailable states do not expose stack traces, secrets, environment values, raw payloads, internal hostnames, or private route details.
- Confirmed production bundles exclude DEV-only runtime/chunk probe strings and verification diagnostics.
