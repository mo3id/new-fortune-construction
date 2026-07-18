# Tasks: API Security Stabilization

**Input**: Design documents from `/Users/mohamedeidali/Desktop/fortune-construction/specs/002-api-security-stabilization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-security-contract.md, quickstart.md

**Tests**: Required by the feature specification, quickstart, and constitution. Test tasks appear before implementation tasks in each user story and should fail before the related implementation is completed.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing while preserving this safety order: API runtime and `/health`, mandatory JWT secret, CORS allowlist, DB URI log redaction, upload validation, then route validation and async error handling.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks in the same phase because it touches different files or only reads documentation
- **[Story]**: Maps to user stories from `spec.md`
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the API workspace and test harness without changing runtime behavior yet.

- [x] T001 Inspect current API package scripts and dependency gaps for API tests in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/package.json`
- [x] T002 Add API test script and required API test dependencies for Jest/Supertest or equivalent in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/package.json`
- [x] T003 [P] Create API test bootstrap for safe local environment variables in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/setup.ts`
- [x] T004 [P] Create API test utilities for loading the Express app without binding a port in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/helpers/appTestHarness.ts`
- [x] T005 [P] Create fixture helpers for multipart upload tests in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/fixtures/uploadFixtures.ts`
- [x] T006 Document local-only verification assumptions and dependency install status in `/Users/mohamedeidali/Desktop/fortune-construction/specs/002-api-security-stabilization/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create shared configuration, app composition, error, and validation foundations required before user story work.

**CRITICAL**: No user story implementation should begin until this phase is complete.

- [x] T007 Extract Express app creation from server startup in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/index.ts`
- [x] T008 Create typed runtime configuration loader for port, environment, JWT, origins, and upload limits in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/config/runtime.ts`
- [x] T009 Create safe logging utilities with redaction helpers in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/utils/safeLogger.ts`
- [x] T010 Create shared API error types and response helpers in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/middleware/errors.ts`
- [x] T011 Create async route wrapper middleware in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/middleware/asyncHandler.ts`
- [x] T012 Create reusable Zod request validation middleware in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/middleware/validateRequest.ts`
- [x] T013 Create upload category policy definitions for image, video, and CV files in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/config/uploadPolicy.ts`
- [x] T014 Wire shared error middleware after all API routes without changing existing route paths in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/index.ts`
- [x] T015 Verify root and API typecheck commands are known before runtime testing in `/Users/mohamedeidali/Desktop/fortune-construction/package.json`

**Checkpoint**: App composition, config, logging, validation, and error foundations are ready.

---

## Phase 3: User Story 1 - Reliable Local API Startup (Priority: P1) MVP

**Goal**: API starts in a safe local environment and `/health` reports readiness without requiring production credentials or leaking sensitive details.

**Independent Test**: Run API health tests and, after confirming local-safe config, start `npm run dev:api` and request `GET /health`.

### Tests for User Story 1

- [x] T016 [P] [US1] Add health contract tests for `GET /health` ok/degraded response shape in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/health.test.ts`
- [x] T017 [P] [US1] Add local startup safety tests for no production DB requirement in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/runtime-config.test.ts`
- [x] T018 [P] [US1] Add DB readiness mode tests for local, memory, and unavailable outcomes in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/db-health.test.ts`

### Implementation for User Story 1

- [x] T019 [US1] Update DB connection result to expose non-sensitive database readiness status in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/config/db.ts`
- [x] T020 [US1] Implement structured `/health` response with `status`, `timestamp`, `services`, and `mode` in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/index.ts`
- [x] T021 [US1] Ensure server startup can be imported by tests without binding `PORT` in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/index.ts`
- [x] T022 [US1] Confirm local development startup does not require production DB credentials in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/config/runtime.ts`
- [x] T023 [US1] Run API health tests and record verification notes in `/Users/mohamedeidali/Desktop/fortune-construction/specs/002-api-security-stabilization/quickstart.md`

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Baseline Authentication And Origin Protection (Priority: P1)

**Goal**: Authentication fails closed without an explicit safe signing secret, and browser access is limited to approved website/dashboard origins.

**Independent Test**: Run auth secret and CORS tests for missing/blank/unsafe JWT secret, allowed origins, disallowed origins, and no-origin health probes.

### Tests for User Story 2

- [x] T024 [P] [US2] Add JWT secret fail-closed tests for missing, blank, and unsafe fallback values in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/security-config.test.ts`
- [x] T025 [P] [US2] Add auth login compatibility tests preserving valid success shape in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/auth.test.ts`
- [x] T026 [P] [US2] Add CORS allowlist tests for public site, dashboard, unapproved origin, and no-origin health probe in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/cors.test.ts`

### Implementation for User Story 2

- [x] T027 [US2] Implement mandatory JWT signing configuration helper in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/config/runtime.ts`
- [x] T028 [US2] Replace JWT fallback signing in auth login route in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/routes/auth.ts`
- [x] T029 [US2] Replace JWT fallback verification in auth middleware in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/middleware/auth.ts`
- [x] T030 [US2] Implement CORS allowlist policy for website and dashboard origins in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/config/cors.ts`
- [x] T031 [US2] Wire safe CORS policy while preserving no-origin local health checks in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/index.ts`
- [x] T032 [US2] Verify dashboard and public API base URL compatibility remains unchanged in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/lib/api.ts`
- [x] T033 [US2] Verify public site API base URL compatibility remains unchanged in `/Users/mohamedeidali/Desktop/fortune-construction/src/lib/apiClient.ts`

**Checkpoint**: User Story 2 is fully functional and testable independently.

---

## Phase 5: User Story 3 - Safe Error And Log Disclosure (Priority: P1)

**Goal**: DB connection failures, startup failures, validation failures, and unexpected errors remain diagnosable without exposing DB URIs, credentials, token secrets, or stack traces to clients.

**Independent Test**: Trigger controlled DB/config/error paths and verify logs and responses are non-sensitive.

### Tests for User Story 3

- [x] T034 [P] [US3] Add DB URI redaction tests for remote connection failure logging in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/log-redaction.test.ts`
- [x] T035 [P] [US3] Add client error response redaction tests for validation and unexpected errors in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/error-redaction.test.ts`

### Implementation for User Story 3

- [x] T036 [US3] Replace raw DB URI logging with safe failure category logs in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/config/db.ts`
- [x] T037 [US3] Apply safe logger to startup and configuration error paths in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/index.ts`
- [x] T038 [US3] Ensure shared error middleware strips stack traces and sensitive values from client responses in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/middleware/errors.ts`
- [x] T039 [US3] Add verification note that DB URI and secret patterns are absent from test logs in `/Users/mohamedeidali/Desktop/fortune-construction/specs/002-api-security-stabilization/quickstart.md`

**Checkpoint**: User Story 3 is fully functional and testable independently.

---

## Phase 6: User Story 4 - Safer Upload Intake (Priority: P2)

**Goal**: Image, video, and CV uploads accept valid existing flows and reject unsupported, mismatched, oversized, or malformed files with consistent non-sensitive errors.

**Independent Test**: Run upload tests for valid and invalid image/video/CV submissions and confirm existing success response shapes are preserved.

### Tests for User Story 4

- [x] T040 [P] [US4] Add image upload acceptance and rejection tests in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/uploads-image.test.ts`
- [x] T041 [P] [US4] Add video upload acceptance and rejection tests in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/uploads-video.test.ts`
- [x] T042 [P] [US4] Add CV upload acceptance and rejection tests for application submit in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/uploads-cv.test.ts`
- [x] T043 [P] [US4] Add upload response compatibility tests for current `url`, `type`, `message`, and `id` shapes in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/upload-compatibility.test.ts`

### Implementation for User Story 4

- [x] T044 [US4] Implement shared multer file filter helpers using MIME and extension policy in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/utils/uploadValidation.ts`
- [x] T045 [US4] Apply image and video validation policies to authenticated upload routes in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/routes/upload.ts`
- [x] T046 [US4] Apply CV validation and sanitized generated filenames to application submit route in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/routes/applications.ts`
- [x] T047 [US4] Convert multer and upload validation errors into consistent API error responses in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/middleware/errors.ts`
- [x] T048 [US4] Confirm upload storage paths and public URLs remain compatible with dashboard CV links in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/pages/Applications.tsx`

**Checkpoint**: User Story 4 is fully functional and testable independently.

---

## Phase 7: User Story 5 - Consistent Route Validation And Async Failures (Priority: P2)

**Goal**: Representative routes use reusable request validation and async error handling while valid website/dashboard payloads continue to work.

**Independent Test**: Submit invalid and valid representative payloads, trigger controlled async failures in tests, and verify consistent non-sensitive responses.

### Tests for User Story 5

- [x] T049 [P] [US5] Add validation tests for invalid and valid auth login payloads in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/validation-auth.test.ts`
- [x] T050 [P] [US5] Add validation tests for invalid and valid application submit payloads in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/validation-applications.test.ts`
- [x] T051 [P] [US5] Add validation tests for application status update payloads in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/validation-application-status.test.ts`
- [x] T052 [P] [US5] Add async error handling tests for representative route failure in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/async-errors.test.ts`

### Implementation for User Story 5

- [x] T053 [US5] Define Zod schemas for auth login, application submit, and application status update in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/validation/schemas.ts`
- [x] T054 [US5] Apply request validation and async wrapper to auth routes in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/routes/auth.ts`
- [x] T055 [US5] Apply request validation and async wrapper to application routes in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/routes/applications.ts`
- [x] T056 [US5] Ensure validation errors match the contract shape in `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/middleware/errors.ts`
- [x] T057 [US5] Document intentionally deferred route conversions in `/Users/mohamedeidali/Desktop/fortune-construction/specs/002-api-security-stabilization/quickstart.md`

**Checkpoint**: User Story 5 is fully functional and testable independently.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Verify the full repair package, preserve compatibility, and prepare for implementation handoff.

- [x] T058 Run API test suite and record command/result in `/Users/mohamedeidali/Desktop/fortune-construction/specs/002-api-security-stabilization/quickstart.md`
- [x] T059 Run root typecheck and API build and record command/result in `/Users/mohamedeidali/Desktop/fortune-construction/specs/002-api-security-stabilization/quickstart.md`
- [x] T060 After confirming local-safe environment, run API locally and verify `/health` within 60 seconds in `/Users/mohamedeidali/Desktop/fortune-construction/specs/002-api-security-stabilization/quickstart.md`
- [x] T061 Verify CORS manually for website origin, dashboard origin, disallowed origin, and no-origin health probe in `/Users/mohamedeidali/Desktop/fortune-construction/specs/002-api-security-stabilization/quickstart.md`
- [x] T062 Verify no DB URI, JWT secret, credentials, stack trace, or sensitive path appears in logs or client responses in `/Users/mohamedeidali/Desktop/fortune-construction/specs/002-api-security-stabilization/quickstart.md`
- [x] T063 Verify public site API client contract remains unchanged in `/Users/mohamedeidali/Desktop/fortune-construction/src/lib/apiClient.ts`
- [x] T064 Verify dashboard API client contract remains unchanged in `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/lib/api.ts`
- [x] T065 Update implementation handoff notes and any deferred follow-up list in `/Users/mohamedeidali/Desktop/fortune-construction/specs/002-api-security-stabilization/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **US1 Runtime/Health (Phase 3)**: Must complete before runtime manual checks and before treating security checks as reliable.
- **US2 JWT/CORS (Phase 4)**: Depends on foundational config and app composition; should follow US1 because no-origin health behavior must stay intact.
- **US3 Logs/Redaction (Phase 5)**: Depends on safe logger/error foundation; should follow US2 so auth/config errors are covered.
- **US4 Upload Validation (Phase 6)**: Depends on shared error middleware and upload policy.
- **US5 Route Validation/Async Errors (Phase 7)**: Depends on validation middleware and error middleware; should follow upload and earlier security baselines.
- **Final Phase**: Depends on all selected user stories.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2; no dependency on other stories.
- **User Story 2 (P1)**: Can start after Phase 2 but should be implemented after US1 to preserve `/health` behavior under CORS.
- **User Story 3 (P1)**: Can start after Phase 2 but should be validated after US1 and US2 error paths exist.
- **User Story 4 (P2)**: Can start after Phase 2; relies on shared upload policy and error response foundation.
- **User Story 5 (P2)**: Can start after Phase 2; sequencing after US4 reduces route and error middleware churn.

### Within Each User Story

- Write tests first and verify they fail before implementation.
- Implement shared helpers before modifying routes.
- Preserve current success response shapes before tightening invalid request behavior.
- Run the story-specific tests before moving to the next story.
- Do not run `npm run dev:api` until local-safe configuration is confirmed.

### Parallel Opportunities

- T003, T004, and T005 can run in parallel.
- T009, T010, T011, T012, and T013 can run in parallel after T008.
- Test files within each user story can be created in parallel.
- Manual verification tasks T061 through T064 can be performed in parallel after T058 through T060.

---

## Parallel Example: User Story 4

```text
Task: "Add image upload acceptance and rejection tests in /Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/uploads-image.test.ts"
Task: "Add video upload acceptance and rejection tests in /Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/uploads-video.test.ts"
Task: "Add CV upload acceptance and rejection tests for application submit in /Users/mohamedeidali/Desktop/fortune-construction/apps/api/tests/uploads-cv.test.ts"
```

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for local API runtime and `/health`.
3. Stop and validate `GET /health` before touching the rest of the security changes.

### Secure Incremental Delivery

1. Add runtime/health stability.
2. Add mandatory JWT secret.
3. Add CORS allowlist while keeping no-origin health checks.
4. Add DB URI and error redaction.
5. Add upload validation for image, video, and CV flows.
6. Add route validation and async error handling to representative routes.
7. Run full tests, typecheck, build, and quickstart verification.

### Compatibility Guardrails

- Preserve valid response shapes documented in `/Users/mohamedeidali/Desktop/fortune-construction/specs/002-api-security-stabilization/contracts/api-security-contract.md`.
- Avoid frontend/dashboard code changes unless a verification task proves compatibility documentation needs an update.
- Treat any valid current website or dashboard request that starts failing as a regression unless the request is explicitly invalid or unsafe.
