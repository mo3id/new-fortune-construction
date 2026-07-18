# Implementation Plan: API Security Stabilization

**Branch**: `codex-security-hardening-stage-0` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/002-api-security-stabilization/spec.md`

## Summary

Stabilize the API so maintainers can start it locally and verify `/health`, while closing the first security gaps found by the audit: mandatory JWT signing configuration, allowlisted CORS for the public site and dashboard, redacted database connection logging, stricter image/video/CV upload validation, and a reusable route validation plus async error handling foundation. The implementation must preserve current public website and dashboard request/response contracts for valid calls.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js, Express API workspace under `apps/api`  
**Primary Dependencies**: Express 4, Mongoose 8, jsonwebtoken 9, cors, helmet, express-rate-limit, multer, zod, mongodb-memory-server for local development fallback  
**Storage**: MongoDB via Mongoose; local development may use local MongoDB or persistent mongodb-memory-server data under API-local runtime storage  
**Testing**: Add API tests with Jest and Supertest or the smallest equivalent API test harness compatible with the current workspace; keep `npm run typecheck` as the required type gate  
**Target Platform**: Local developer machine and Node-hosted API runtime on port 3001 by default  
**Project Type**: Monorepo web application with separate public site, dashboard, API, and shared packages  
**Performance Goals**: `/health` responds within 500 ms locally when the process is running; validation and security middleware add no noticeable latency to normal dashboard/public requests  
**Constraints**: Do not break existing valid website or dashboard API contracts; do not log secrets; fail closed for missing authentication secret; avoid requiring production credentials for local health verification  
**Scale/Scope**: First security repair package focused on API startup, security configuration, upload intake, representative route validation, and async error handling baseline

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Plan Response |
|-----------|--------|---------------|
| Component-First UI | Pass | No UI component changes are planned. Existing website and dashboard behavior is preserved. |
| API-Contract Driven | Pass | Contracts are defined in `contracts/api-security-contract.md` before implementation, including request/response compatibility rules. |
| Type Safety | Pass | Implementation will use TypeScript and typed helpers; no new `any` should be introduced. |
| Test-First | Pass with required action | Tasks must add API tests for health, auth secret behavior, CORS, upload validation, validation errors, and async errors before or alongside implementation. |
| Performance & UX Consistency | Pass | User-facing behavior is limited to clearer upload/validation errors and stable API availability. |
| Monorepo Discipline | Pass | API changes remain under `apps/api`; reusable validation/security helpers should live under API-local middleware/lib unless shared client contracts are needed. |

## Project Structure

### Documentation (this feature)

```text
specs/002-api-security-stabilization/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── api-security-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── package.json
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── routes/
│   │   ├── applications.ts
│   │   ├── auth.ts
│   │   └── upload.ts
│   └── index.ts
└── tests/
    ├── health.test.ts
    ├── security-config.test.ts
    ├── cors.test.ts
    ├── uploads.test.ts
    └── validation-errors.test.ts

src/
└── lib/apiClient.ts

apps/dashboard/src/
└── lib/api.ts
```

**Structure Decision**: Use the existing monorepo layout. The repair package is API-centered under `apps/api`, with compatibility checks against the existing public site API client and dashboard API client. New helper modules should be local to `apps/api/src` unless a later plan explicitly requires shared package extraction.

## Phase 0 Research Decisions

Research output is captured in [research.md](./research.md). All planning unknowns are resolved with project-local defaults:

- Local API startup should prefer explicit safe configuration and tolerate local MongoDB or mongodb-memory-server fallback, but must not silently use production credentials for local verification.
- JWT signing secret validation should be centralized and fail closed before signing or verifying tokens.
- CORS should be allowlist-based with explicit local and configured production origins, while intentionally allowing non-browser health probes with no `Origin`.
- Database logging should describe connection mode and failure category without printing full URIs.
- Upload validation should check MIME type and extension together, preserve current response shapes for valid files, sanitize filenames, and return consistent errors for invalid files.
- Route validation and async error handling should be introduced as reusable middleware and applied first to high-risk representative routes.

## Phase 1 Design

Design output is captured in:

- [data-model.md](./data-model.md)
- [contracts/api-security-contract.md](./contracts/api-security-contract.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

| Principle | Status | Evidence |
|-----------|--------|----------|
| Component-First UI | Pass | Contracts preserve existing client behavior; no new UI components are planned. |
| API-Contract Driven | Pass | API behavior contracts are documented before tasks. |
| Type Safety | Pass | Data model calls for typed config, typed validation results, and typed upload categories. |
| Test-First | Pass with task requirement | Quickstart defines required verification; tasks must include API tests before implementation work. |
| Performance & UX Consistency | Pass | `/health` has a local response target and upload errors stay user-understandable. |
| Monorepo Discipline | Pass | Files remain in the existing API workspace and docs stay inside the feature directory. |

## Complexity Tracking

No constitution violations require complexity justification.
