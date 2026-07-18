# Tasks: Production Deployment Readiness

**Input**: Design documents from `specs/007-production-readiness/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/production-readiness-contract.md`, `quickstart.md`, `production-readiness-report.md`  
**Tests**: Verification is required through static checks, typecheck, public/dashboard builds, API build/tests when API runtime/config behavior changes, and report evidence. Do not run production runtime. Do not start API runtime unless a later implementation task explicitly requires local-safe verification.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks in the same phase when files do not conflict
- **[Story]**: User story label from `spec.md`
- Every task includes an exact file path or command-output documentation target

## Guardrails

- Do not reveal values from `.env`, `apps/api/.env`, `apps/dashboard/.env`, `.vercel/.env.production.local`, database URIs, JWT secrets, tokens, credentials, or passwords.
- Do not run production runtime.
- Do not run `npm run dev:api` or any API runtime unless a task explicitly requires local-safe verification and confirms remote MongoDB will not be touched.
- Do not connect to remote/production MongoDB during local verification unless an explicit safe allow flag is documented.
- Preserve public routes, dashboard routes, API endpoint paths, request/response shapes, auth behavior except fail-closed production config errors, SEO outputs, `Project.category` as a string contract, and Success Stories through Page Content.
- Separate repository code fixes from external setup required in Vercel, MongoDB, DNS/domain, API hosting, and persistent upload storage.
- Localhost may remain in local development examples/tests, but must not be accepted as a production default, production CORS origin, production API base URL, production upload URL, or production deployment URL.

---

## Phase 1: Setup (Shared Documentation and Evidence Structure)

**Purpose**: Prepare tracking files and confirm the current planning artifacts before implementation.

- [X] T001 Confirm `specs/007-production-readiness/plan.md` references production readiness scope, static inventory, code-fix candidates, and external setup boundaries.
- [X] T002 Confirm `specs/007-production-readiness/contracts/production-readiness-contract.md` includes redaction rules and required report sections.
- [X] T003 [P] Add a command-results table for future verification to `specs/007-production-readiness/quickstart.md`.
- [X] T004 [P] Add a task progress section to `specs/007-production-readiness/production-readiness-report.md`.
- [X] T005 [P] Add a code-fix vs external-setup legend to `specs/007-production-readiness/production-readiness-report.md`.
- [X] T006 Record that optional Spec Kit git commit hooks were not executed in `specs/007-production-readiness/quickstart.md`.

---

## Phase 2: Foundational (Static Baseline and Safety Gates)

**Purpose**: Capture evidence and safety rules that block all user-story implementation.

**CRITICAL**: No user story implementation starts until this phase is complete.

- [X] T007 Run the redacted env-name inventory from `specs/007-production-readiness/quickstart.md` and record variable names only in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T008 [P] Run the static localhost/production URL scan from `specs/007-production-readiness/quickstart.md` and record findings in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T009 [P] Review `src/lib/apiClient.ts`, `apps/dashboard/src/lib/api.ts`, `apps/dashboard/src/pages/Applications.tsx`, and `apps/dashboard/src/components/Sidebar.tsx` for production URL risks, then record findings in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T010 [P] Review `apps/api/src/config/runtime.ts`, `apps/api/src/config/cors.ts`, `apps/api/src/config/db.ts`, and `apps/api/src/index.ts` for CORS/JWT/MongoDB/startup-log readiness, then record findings in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T011 [P] Review `apps/api/src/config/uploadPolicy.ts`, `apps/api/src/routes/upload.ts`, and `apps/api/src/routes/applications.ts` for upload validation and local filesystem storage, then record findings in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T012 [P] Review `vercel.json`, `apps/dashboard/vercel.json`, `package.json`, `apps/api/package.json`, and `apps/dashboard/package.json` for build/deployment settings, then record findings in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T013 [P] Review `src/lib/seo.ts`, `public/sitemap.xml`, and `public/robots.txt` for `fortuneconstruction.mw` domain readiness, then record findings in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T014 Confirm no `.env` values, secret values, DB URI values, JWT secrets, credentials, or Vercel tokens were copied into `specs/007-production-readiness/production-readiness-report.md`.
- [X] T015 Classify all baseline findings as `ready`, `needs-code-fix`, `needs-external-setup`, `blocked`, `deferred`, or `not-applicable` in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T016 Confirm no production runtime, API runtime, or remote MongoDB connection was started during baseline capture in `specs/007-production-readiness/quickstart.md`.

**Checkpoint**: Baseline ready. User-story implementation can now proceed in priority order.

---

## Phase 3: User Story 1 - Production Configuration Inventory (Priority: P1) MVP

**Goal**: Produce a complete redacted inventory of required production configuration with clear ready/code-fix/external-setup status.

**Independent Test**: Review `production-readiness-report.md` to confirm every required public, dashboard, API, database, upload, domain, and hosting setting is listed with status and no secret values.

### Verification for User Story 1

- [X] T017 [P] [US1] Verify the environment variable matrix in `specs/007-production-readiness/production-readiness-report.md` includes public site, dashboard, API, hosting, MongoDB, JWT, CORS, and upload-related variables.
- [X] T018 [P] [US1] Verify the production origin matrix in `specs/007-production-readiness/production-readiness-report.md` includes public canonical URL, public API base URL, dashboard origin, dashboard API base URL, API origin, CORS origins, and upload asset URL strategy.
- [X] T019 [P] [US1] Verify the report contract sections from `specs/007-production-readiness/contracts/production-readiness-contract.md` are all present in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T020 [US1] Verify `specs/007-production-readiness/production-readiness-report.md` contains no copied local env values, DB URI values, JWT secret values, credentials, API tokens, or Vercel OIDC tokens.

### Implementation for User Story 1

- [X] T021 [US1] Expand the environment variable matrix in `specs/007-production-readiness/production-readiness-report.md` with required production names from `src/vite-env.d.ts`, `src/lib/seo.ts`, `src/lib/apiClient.ts`, `apps/dashboard/src/lib/api.ts`, and `apps/api/src/config/runtime.ts`.
- [X] T022 [US1] Expand the deployment target matrix in `specs/007-production-readiness/production-readiness-report.md` for public site, dashboard, API service, MongoDB, upload storage, and domain/DNS.
- [X] T023 [US1] Add a redacted current-state summary to `specs/007-production-readiness/production-readiness-report.md` that lists env file paths by name only.
- [X] T024 [US1] Add code-fix backlog rows to `specs/007-production-readiness/production-readiness-report.md` for public API base URL, dashboard API/upload URL, dashboard hardcoded links, API env example mismatch, and API production startup log wording.
- [X] T025 [US1] Add external setup rows to `specs/007-production-readiness/production-readiness-report.md` for Vercel env vars, production MongoDB, API hosting, persistent upload storage, `fortuneconstruction.mw` DNS/domain, dashboard origin, and API origin.
- [X] T026 [US1] Update `specs/007-production-readiness/quickstart.md` with the exact static inventory commands used for US1 and a note that values must remain redacted.
- [X] T027 [US1] Confirm the US1 MVP can be reviewed without code changes by updating the launch status and highest blockers in `specs/007-production-readiness/production-readiness-report.md`.

**Checkpoint**: US1 is complete when the report is a usable, secret-free launch-readiness inventory.

---

## Phase 4: User Story 2 - Production URL and Origin Safety (Priority: P1)

**Goal**: Prevent localhost or development-only URLs from being used as production API/base/upload/dashboard URLs while preserving local development behavior.

**Independent Test**: Static checks and builds confirm production-facing public/dashboard/API URL behavior requires approved production origins and no production build path relies on localhost fallbacks.

### Tests and Verification for User Story 2

- [X] T028 [P] [US2] Add or update production URL static check documentation in `specs/007-production-readiness/quickstart.md` for `src/lib/apiClient.ts`, `apps/dashboard/src/lib/api.ts`, `apps/dashboard/src/pages/Applications.tsx`, and `apps/dashboard/src/components/Sidebar.tsx`.
- [X] T029 [P] [US2] Add API CORS production-origin test coverage in `apps/api/tests/production-readiness.test.ts` for `PUBLIC_SITE_ORIGIN`, `DASHBOARD_ORIGIN`, and disallowed production origin behavior before changing CORS/runtime code.
- [X] T030 [P] [US2] Add static verification notes in `specs/007-production-readiness/production-readiness-report.md` for current localhost references in public/dashboard/API URL code.
- [X] T031 [US2] Run the US2 static production URL scan from `specs/007-production-readiness/quickstart.md` before implementation and record current failures in `specs/007-production-readiness/production-readiness-report.md`.

### Implementation for User Story 2

- [X] T032 [US2] Implement production-safe public API base URL resolution in `src/lib/apiClient.ts` so production builds do not silently fall back to `http://localhost:3001`.
- [X] T033 [US2] Update public env typing in `src/vite-env.d.ts` for any added public production URL variables without exposing secrets.
- [X] T034 [US2] Implement production-safe dashboard API base URL and upload URL resolution in `apps/dashboard/src/lib/api.ts` without changing API paths or upload response shapes.
- [X] T035 [US2] Replace the hardcoded CV localhost link in `apps/dashboard/src/pages/Applications.tsx` with the dashboard API base URL helper while preserving existing CV path behavior.
- [X] T036 [US2] Replace the hardcoded public-site localhost link in `apps/dashboard/src/components/Sidebar.tsx` with a configured public-site URL that keeps local development behavior.
- [X] T037 [US2] Ensure `apps/api/src/config/runtime.ts` keeps local origins for non-production but requires configured production origins for production readiness documentation.
- [X] T038 [US2] Update `specs/007-production-readiness/production-readiness-report.md` to mark production URL code fixes as fixed or still blocked with evidence.
- [X] T039 [US2] Re-run the US2 static production URL scan from `specs/007-production-readiness/quickstart.md` and record remaining allowed local-only references in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T040 [US2] Run `npm run typecheck` and record the result in `specs/007-production-readiness/quickstart.md`.
- [X] T041 [US2] Run `npm run build` and record public build result plus any production URL warnings in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T042 [US2] Run `npm run build --workspace=apps/dashboard` and record dashboard build result plus any production URL warnings in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T043 [US2] Run `npm run test --workspace=apps/api` if CORS/runtime code changed, or document why it was not needed in `specs/007-production-readiness/quickstart.md`.

**Checkpoint**: US2 is complete when production URL behavior is guarded, local dev remains supported, and no production-facing localhost fallback remains undocumented.

---

## Phase 5: User Story 3 - API Runtime Security Readiness (Priority: P1)

**Goal**: Verify and harden JWT, CORS, MongoDB remote-safety, redaction, env examples, and startup readiness without exposing secrets.

**Independent Test**: API tests/static checks prove JWT fail-closed behavior, CORS production origin handling, MongoDB local-safe remote rules, and redaction behavior without printing secrets.

### Tests and Verification for User Story 3

- [X] T044 [P] [US3] Add API test coverage in `apps/api/tests/production-readiness.test.ts` for missing/blank/unsafe `JWT_SECRET` production readiness failure before changing runtime code.
- [X] T045 [P] [US3] Add API test coverage in `apps/api/tests/production-readiness.test.ts` for remote `MONGODB_URI` local-safe blocking without `ALLOW_REMOTE_DB=true` before changing runtime/db code.
- [X] T046 [P] [US3] Add API test coverage in `apps/api/tests/production-readiness.test.ts` for redacting DB URI, credentials, JWT secret, and stack traces from logs/client responses before changing redaction code.
- [X] T047 [P] [US3] Add API test coverage in `apps/api/tests/production-readiness.test.ts` for production CORS allowlist behavior before changing CORS/runtime code.
- [X] T048 [US3] Review `apps/api/.env.example` against `apps/api/src/config/runtime.ts` and record mismatch findings in `specs/007-production-readiness/production-readiness-report.md`.

### Implementation for User Story 3

- [X] T049 [US3] Update `apps/api/.env.example` to use current runtime env names `PUBLIC_SITE_ORIGIN`, `DASHBOARD_ORIGIN`, `ADDITIONAL_ALLOWED_ORIGINS`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `MONGODB_URI`, `ALLOW_REMOTE_DB`, and `PORT` with safe placeholders only.
- [X] T050 [US3] Remove or clearly mark obsolete `FRONTEND_URL` and `DASHBOARD_URL` entries in `apps/api/.env.example` so they are not mistaken for active CORS configuration.
- [X] T051 [US3] Add production-safe startup log wording in `apps/api/src/index.ts` so production logs do not advertise a localhost URL while preserving local startup information.
- [X] T052 [US3] Confirm `apps/api/src/config/runtime.ts` treats `JWT_SECRET` as required and unsafe secrets as fail-closed without adding any fallback secret.
- [X] T053 [US3] Confirm `apps/api/src/config/runtime.ts` and `apps/api/src/config/db.ts` preserve remote MongoDB local-safe blocking unless `NODE_ENV=production` or `ALLOW_REMOTE_DB=true`.
- [X] T054 [US3] Confirm `apps/api/src/utils/redaction.ts` and `apps/api/src/utils/safeLogger.ts` redact DB URIs, credentials, and configured JWT secret values without exposing raw secrets in tests or reports.
- [X] T055 [US3] Update security and MongoDB sections in `specs/007-production-readiness/production-readiness-report.md` with code-ready status, external setup status, and non-secret evidence.
- [X] T056 [US3] Run `npm run build --workspace=apps/api` and record result in `specs/007-production-readiness/quickstart.md`.
- [X] T057 [US3] Run `npm run test --workspace=apps/api` and record result in `specs/007-production-readiness/quickstart.md`, requesting approved local execution if sandbox loopback binding blocks the test harness.
- [X] T058 [US3] Confirm no production runtime, `npm run dev:api`, or remote MongoDB connection was used for US3 in `specs/007-production-readiness/quickstart.md`.

**Checkpoint**: US3 is complete when API security readiness is test-backed and all env example guidance matches runtime behavior.

---

## Phase 6: User Story 4 - Upload Storage and Persistence Strategy (Priority: P2)

**Goal**: Document current upload validation/storage behavior and mark persistent storage as external setup when local filesystem is not durable.

**Independent Test**: Review `production-readiness-report.md` to confirm images, videos, and CVs have validation limits, URL behavior, storage persistence status, and external setup requirements.

### Verification for User Story 4

- [X] T059 [P] [US4] Verify image/video upload limits, MIME types, extensions, and local paths from `apps/api/src/config/uploadPolicy.ts` and `apps/api/src/routes/upload.ts`, then record them in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T060 [P] [US4] Verify CV upload limits, MIME types, extensions, local path, and URL shape from `apps/api/src/config/uploadPolicy.ts` and `apps/api/src/routes/applications.ts`, then record them in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T061 [P] [US4] Verify `/uploads` static serving behavior from `apps/api/src/index.ts`, then record production persistence risk in `specs/007-production-readiness/production-readiness-report.md`.

### Implementation for User Story 4

- [X] T062 [US4] Update upload storage readiness rows in `specs/007-production-readiness/production-readiness-report.md` for images, videos, and CVs with validation limits and local filesystem persistence risk.
- [X] T063 [US4] Document persistent object storage or durable API-host filesystem as external setup in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T064 [US4] Document that no media re-encoding, CDN migration, upload provider migration, or API upload response-shape change is included in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T065 [US4] Update `specs/007-production-readiness/quickstart.md` with upload-storage verification instructions that do not require production runtime.
- [X] T066 [US4] Confirm dashboard CV link compatibility remains based on stored `/uploads/cvs/...` paths in `specs/007-production-readiness/production-readiness-report.md`.

**Checkpoint**: US4 is complete when upload readiness is accurate and external storage work is explicit.

---

## Phase 7: User Story 5 - Deployment Verification Report (Priority: P2)

**Goal**: Finalize a clear go/no-go readiness report with verification evidence, external setup blockers, and compatibility guardrails.

**Independent Test**: Read `production-readiness-report.md` and verify it separates ready/fixed/blocked/deferred items and includes command evidence with no secret values.

### Verification for User Story 5

- [X] T067 [P] [US5] Verify root public Vercel rewrite settings in `vercel.json` and record build/output/domain limitations in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T068 [P] [US5] Verify dashboard Vercel rewrite settings in `apps/dashboard/vercel.json` and record build/output/domain limitations in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T069 [P] [US5] Verify package build scripts in `package.json`, `apps/api/package.json`, and `apps/dashboard/package.json`, then record deployment command expectations in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T070 [P] [US5] Verify `fortuneconstruction.mw` usage in `src/lib/seo.ts`, `public/sitemap.xml`, and `public/robots.txt`, then record domain readiness and DNS external setup in `specs/007-production-readiness/production-readiness-report.md`.

### Implementation for User Story 5

- [X] T071 [US5] Finalize the summary and launch status in `specs/007-production-readiness/production-readiness-report.md` as `ready`, `not-ready`, or `blocked` based on completed checks.
- [X] T072 [US5] Finalize blocked external setup in `specs/007-production-readiness/production-readiness-report.md` for Vercel env vars, MongoDB production database, API hosting, persistent upload storage, dashboard/API origins, and DNS/domain binding.
- [X] T073 [US5] Finalize deferred follow-ups in `specs/007-production-readiness/production-readiness-report.md` for CDN/media pipeline, observability/log drains, backups, and dashboard access policy.
- [X] T074 [US5] Confirm `specs/007-production-readiness/production-readiness-report.md` satisfies every section of `specs/007-production-readiness/contracts/production-readiness-contract.md`.
- [X] T075 [US5] Confirm all command results and blocked command reasons are recorded in `specs/007-production-readiness/quickstart.md` and `specs/007-production-readiness/production-readiness-report.md`.
- [X] T076 [US5] Confirm no secret values or local `.env` values appear in `specs/007-production-readiness/production-readiness-report.md`, `specs/007-production-readiness/quickstart.md`, or `specs/007-production-readiness/tasks.md`.

**Checkpoint**: US5 is complete when the launch decision report is complete, non-secret, and evidence-backed.

---

## Final Phase: Cross-Cutting Verification and Documentation

**Purpose**: Validate the selected implementation scope and close the production readiness package.

- [X] T077 Run `npm run typecheck` and record final result in `specs/007-production-readiness/quickstart.md`.
- [X] T078 Run `npm run build` and record final public build result in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T079 Run `npm run build --workspace=apps/dashboard` and record final dashboard build result in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T080 Run `npm run build --workspace=apps/api` if API files changed, or document why it was not needed in `specs/007-production-readiness/quickstart.md`.
- [X] T081 Run `npm run test --workspace=apps/api` if API config/runtime behavior changed, or document why it was not needed in `specs/007-production-readiness/quickstart.md`.
- [X] T082 Run final static localhost/production URL scan from `specs/007-production-readiness/quickstart.md` and record allowed local-only references plus production blockers in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T083 Run final redaction/static secret scan against `specs/007-production-readiness/production-readiness-report.md`, `specs/007-production-readiness/quickstart.md`, and `specs/007-production-readiness/tasks.md`, then record result in `specs/007-production-readiness/quickstart.md`.
- [X] T084 Verify public routes are preserved in `src/router.tsx` and record result in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T085 Verify dashboard routes are preserved in `apps/dashboard/src/App.tsx` and record result in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T086 Verify SEO outputs remain unchanged in `src/lib/seo.ts`, `public/sitemap.xml`, and `public/robots.txt`, then record result in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T087 Verify API contracts and upload response shapes are unchanged by reviewing `apps/api/src/routes/upload.ts`, `apps/api/src/routes/applications.ts`, `apps/dashboard/src/lib/api.ts`, and `src/lib/apiClient.ts`, then record result in `specs/007-production-readiness/production-readiness-report.md`.
- [X] T088 Confirm `Project.category` remains a string contract and Success Stories remain through Page Content by reviewing `apps/api/src/models/Project.ts`, `apps/dashboard/src/App.tsx`, and `specs/007-production-readiness/production-readiness-report.md`.
- [X] T089 Update all completed task statuses in `specs/007-production-readiness/tasks.md`.
- [X] T090 Confirm no production runtime, API runtime, or remote MongoDB connection was started unless a task explicitly required local-safe verification in `specs/007-production-readiness/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies.
- **Phase 2 Foundational**: Depends on Phase 1 and blocks all user stories.
- **US1 Production Configuration Inventory**: Depends on Phase 2 and is the MVP.
- **US2 Production URL and Origin Safety**: Depends on Phase 2; should preferably follow US1 so report rows already exist.
- **US3 API Runtime Security Readiness**: Depends on Phase 2; can run after US1 and in parallel with US2 if files do not conflict.
- **US4 Upload Storage and Persistence Strategy**: Depends on Phase 2; can run after US1 because it is mostly documentation/static verification.
- **US5 Deployment Verification Report**: Depends on selected US1-US4 scope.
- **Final Phase**: Depends on all selected user stories.

### User Story Dependencies

- **US1 (P1)**: MVP; provides the readiness inventory and report structure.
- **US2 (P1)**: Can be independently tested through static URL scans and public/dashboard builds.
- **US3 (P1)**: Can be independently tested through API build/tests and static redaction checks.
- **US4 (P2)**: Can be independently tested through static upload storage review and report completeness.
- **US5 (P2)**: Consolidates all selected story evidence into final launch status.

### Parallel Opportunities

- T003, T004, and T005 can run in parallel.
- T008 through T013 can run in parallel because they inspect different files and write separate report sections.
- T017 through T019 can run in parallel.
- T028 through T030 can run in parallel.
- T044 through T047 can run in parallel before US3 implementation.
- T059 through T061 can run in parallel.
- T067 through T070 can run in parallel.

---

## Parallel Example: User Story 2

```text
Task: "Add or update production URL static check documentation in specs/007-production-readiness/quickstart.md for src/lib/apiClient.ts, apps/dashboard/src/lib/api.ts, apps/dashboard/src/pages/Applications.tsx, and apps/dashboard/src/components/Sidebar.tsx"
Task: "Add API CORS production-origin test coverage in apps/api/tests/production-readiness.test.ts for PUBLIC_SITE_ORIGIN, DASHBOARD_ORIGIN, and disallowed production origin behavior before changing CORS/runtime code"
Task: "Add static verification notes in specs/007-production-readiness/production-readiness-report.md for current localhost references in public/dashboard/API URL code"
```

## Parallel Example: User Story 3

```text
Task: "Add API test coverage in apps/api/tests/production-readiness.test.ts for missing/blank/unsafe JWT_SECRET production readiness failure before changing runtime code"
Task: "Add API test coverage in apps/api/tests/production-readiness.test.ts for remote MONGODB_URI local-safe blocking without ALLOW_REMOTE_DB=true before changing runtime/db code"
Task: "Add API test coverage in apps/api/tests/production-readiness.test.ts for redacting DB URI, credentials, JWT secret, and stack traces from logs/client responses before changing redaction code"
Task: "Add API test coverage in apps/api/tests/production-readiness.test.ts for production CORS allowlist behavior before changing CORS/runtime code"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 static baseline and safety gates.
3. Complete US1 production configuration inventory.
4. Stop and validate `production-readiness-report.md` as the first launch-readiness artifact.

### Incremental Delivery

1. Deliver US2 to fix production URL/base origin risks in public and dashboard clients.
2. Deliver US3 to verify API CORS/JWT/MongoDB/redaction readiness and align env examples.
3. Deliver US4 to document upload storage production blockers and external persistence requirements.
4. Deliver US5 and Final Phase to consolidate report evidence and build/test results.

### External Setup Boundary

Repository tasks may document expected Vercel, MongoDB, DNS, domain, API hosting, and persistent storage requirements, but they must not claim those external systems are ready unless verified through non-secret evidence.
