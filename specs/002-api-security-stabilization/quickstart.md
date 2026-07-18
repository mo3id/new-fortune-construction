# Quickstart: API Security Stabilization

## Purpose

Verify the first API repair package without using production credentials and without changing public website or dashboard request contracts.

## Safety Rules

- Do not paste or commit secrets into specs, source files, logs, or command history.
- Use local-only configuration for verification.
- Revoke any exposed personal access token before pushing or sharing logs.
- Do not run the API against production database credentials for local tests.
- Inspect logs for redaction before copying them into reports.

## Local Configuration Expectations

Set local values only:

```text
PORT=3001
JWT_SECRET=<local-development-secret>
JWT_EXPIRES_IN=24h
PUBLIC_SITE_ORIGIN=http://localhost:5173
DASHBOARD_ORIGIN=http://localhost:5174
```

If a database URI is needed locally, use a local database URI only. Local health verification must not depend on a production database.

Remote database safety: when `MONGODB_URI` points to a remote host and `NODE_ENV` is not `production`, the API must not connect to it unless `ALLOW_REMOTE_DB=true` is explicitly set. Without that explicit allow flag, startup skips the remote URI and proceeds to local database fallbacks with non-sensitive logs.

## Verification Flow

1. Confirm dependencies are available:

```bash
npm install
```

If `node_modules` already exists and dependency installation is intentionally skipped, record that decision in implementation notes.

Implementation note for Phase 1/2/US1: `node_modules` is present, so dependency installation was skipped. API tests use the existing Node test runner with `ts-node/register`; no network install was attempted.

2. Run API tests:

```bash
npm run test --workspace=apps/api
```

If the test script does not exist yet, add it as part of implementation tasks.

3. Run type checking:

```bash
npm run typecheck
```

4. Start the API locally after confirming the environment is safe:

```bash
npm run dev:api
```

5. Verify health from a no-origin local probe:

```bash
curl -i http://localhost:3001/health
```

Expected result: `200` with non-sensitive `status`, `timestamp`, `services`, and `mode` fields.

Phase 1/2/US1 verification note: `npm run test --workspace=apps/api` failed inside the sandbox with `listen EPERM` because the test harness opens a temporary local port. The same command was rerun outside the sandbox with approval and passed 10/10 tests, including remote `MONGODB_URI` blocking for non-production without `ALLOW_REMOTE_DB=true`. `npm run build --workspace=apps/api` also passed. `npm run dev:api` was not run in this phase.

6. Verify JWT secret fails closed:

- Temporarily unset or blank the local signing secret in a controlled local shell.
- Start or exercise auth behavior.
- Expected result: auth behavior refuses unsafe configuration with no fallback signing.

7. Verify CORS:

```bash
curl -i -H "Origin: http://localhost:5173" http://localhost:3001/health
curl -i -H "Origin: http://localhost:5174" http://localhost:3001/health
curl -i -H "Origin: http://evil.localhost" http://localhost:3001/health
```

Expected result: configured website/dashboard origins are allowed; unapproved browser origin is rejected.

US2 verification note: `npm run test --workspace=apps/api` failed inside the sandbox with `listen EPERM` because the test harness opens a temporary local port. The same command was rerun outside the sandbox with approval and passed 19/19 tests, including JWT secret fail-closed checks, auth middleware protected-route config failure handling, auth login response compatibility, allowed website/dashboard origins, rejected unapproved origin, and no-origin `/health`. `npm run build --workspace=apps/api` also passed. Public site and dashboard API base URL source files were inspected and left unchanged.

8. Verify upload validation:

- Submit a valid image to `POST /api/upload`.
- Submit a valid video to `POST /api/upload/video`.
- Submit a valid CV to `POST /api/applications/submit`.
- Submit invalid extension/MIME combinations to each upload path.

Expected result: valid uploads preserve current success response shapes; invalid uploads return consistent validation errors.

US4 verification note: `npm run test --workspace=apps/api` failed inside the sandbox with `listen EPERM` because existing API tests open temporary local ports. The same command was rerun outside the sandbox with approval and passed 33/33 tests, including image/video/CV accept and reject cases, MIME plus extension mismatch rejection, image, video, and CV size-limit rejection, sanitized filenames, consistent `UPLOAD_VALIDATION_ERROR` responses, and compatibility for existing `url`, `type`, `message`, and `id` response shapes. `npm run build --workspace=apps/api` also passed. Dashboard CV links remain compatible because application CV paths are still stored as `/uploads/cvs/...` and the dashboard continues to prefix them with the API host.

9. Verify route validation and async error handling:

- Submit invalid login and application payloads.
- Trigger a controlled async route failure in tests.

Expected result: validation errors and unexpected failures return consistent non-sensitive shapes and the API process remains available.

US5 verification note: `npm run test --workspace=apps/api` failed inside the sandbox with `listen EPERM` because existing API tests open temporary local ports. The same command was rerun outside the sandbox with approval and passed 42/42 tests, including auth login validation, application submit validation, application status validation, valid website/dashboard payload compatibility, CV file cleanup after submit validation failure, CV file cleanup after async create failure, and async error handling for a representative application route failure. `npm run build --workspace=apps/api` also passed. Route validation and async wrappers were applied to auth routes and application routes for this package; remaining project, service, partner, team, jobs, messages, settings, content, stats, upload, and success-story route conversions are intentionally deferred outside US5.

US3 verification note: `npm run test --workspace=apps/api` failed inside the sandbox with `listen EPERM` because existing API tests open temporary local ports. The same command was rerun outside the sandbox with approval and passed 23/23 tests, including DB URI log redaction, DB credential redaction, JWT secret redaction, startup/seed log credential suppression, client error response redaction, and stack trace omission for unexpected errors. `npm run build --workspace=apps/api` also passed. Test logs were reviewed for the redaction scenarios and did not include raw remote DB URI, DB username/password, JWT secret value, default seed login credentials, or client-facing stack traces.

## Compatibility Checks

- Public site client still uses the existing API base URL behavior.
- Dashboard client still uses the existing API base URL behavior.
- Existing valid dashboard auth, reads, and upload flows do not require client payload changes.

## Final Phase Verification

- API test suite: `npm run test --workspace=apps/api` failed inside the sandbox with `listen EPERM` because the tests open temporary local ports. The same command was rerun outside the sandbox with approval and passed 42/42 tests.
- Type/build gates: `npm run typecheck` passed at the repository root, and `npm run build --workspace=apps/api` passed.
- Local-safe environment check: local verification classified the environment as non-production, with no configured `MONGODB_URI`, a configured non-placeholder JWT secret, and `safeToRun: true`.
- Local API health: `npm run dev --workspace=apps/api` was attempted after the safety check. A local Node process was already listening on port 3001, and the duplicate start could not bind the port. The active local API on port 3001 returned `200` for no-origin `GET /health` within 60 seconds with non-sensitive degraded health JSON: `status`, `timestamp`, `services`, `mode`, and `database.mode`.
- CORS manual probes: `Origin: http://localhost:5173` returned `200` with `Access-Control-Allow-Origin: http://localhost:5173`; `Origin: http://localhost:5174` returned `200` with `Access-Control-Allow-Origin: http://localhost:5174`; `Origin: http://evil.localhost` returned `403` with `code: CORS_ORIGIN_DENIED`; no-origin `/health` returned `200`.
- Sensitive output review: health and CORS client responses did not include DB URI, JWT secret, credentials, stack trace, or raw exception content. Automated redaction tests also cover DB URI, credentials, JWT secret, seed credential, and stack trace suppression. During duplicate local startup, `mongodb-memory-server` emitted a local filesystem path while reporting an existing `.mongodb-data` lock before the API could complete startup; this is recorded as a deferred hardening follow-up below.
- Public site API client contract: `src/lib/apiClient.ts` remains unchanged and still derives `API` from `VITE_API_URL ?? 'http://localhost:3001'` plus `/api`.
- Dashboard API client contract: `apps/dashboard/src/lib/api.ts` remains unchanged and still derives `BASE_URL` from `VITE_API_URL || 'http://localhost:3001'`, uses `${BASE_URL}/api`, preserves auth token interception, and preserves upload URL composition from API response `url` values.

Deferred follow-ups:

- Reduce duplicate-start noise from `mongodb-memory-server` when `.mongodb-data` is already locked, so local diagnostic logs do not include absolute filesystem paths from the dependency before the API reports degraded database status.
- Continue route validation and async wrapper conversion for project, service, partner, team, jobs, messages, settings, content, stats, upload, and success-story routes in a later package.
