# Implementation Plan: Comprehensive Project Audit

**Branch**: `001-project-audit` | **Date**: 2026-07-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-project-audit/spec.md`

## Summary

Produce a comprehensive, evidence-backed audit report for the Fortune Construction project covering the public website, dashboard, and API. The plan is to inventory the real project surfaces, verify local build/runtime behavior, review integrations and API contracts, assess code quality/performance/SEO/security/UX, and publish a prioritized remediation report with confirmed defects, risks, blocked checks, and recommended next actions.

## Technical Context

**Language/Version**: TypeScript with React 18 frontend apps; Node.js/Express API  
**Primary Dependencies**: Vite, React Router, TanStack Query, Axios/fetch clients, Express, Mongoose, Helmet, CORS, rate limiting, Zod, Tailwind CSS  
**Storage**: MongoDB/Mongoose models in `apps/api/src/models`; local `.mongodb-data` is present and must be treated as sensitive/runtime data  
**Testing**: Existing scripts expose build/typecheck commands; no dedicated test script is currently declared at the root  
**Target Platform**: Browser-based public website and dashboard plus Node.js API, with Vercel configuration present  
**Project Type**: Multi-app web project with root public site, dashboard workspace, API workspace, and shared UI aliases  
**Performance Goals**: Identify user-facing bottlenecks affecting initial load, route transitions, media rendering, API responsiveness, and admin workflow responsiveness  
**Constraints**: Do not change production behavior during audit; redact secret values; distinguish confirmed failures from blocked checks; avoid destructive database or deployment actions  
**Scale/Scope**: Root public website routes, dashboard routes/pages, Express API route groups, shared components, build/deployment configuration, environment variables, generated artifacts, and existing report files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The local constitution file exists but is unreadable in this environment because it appears as an empty sparse file. In absence of explicit constitutional gates, apply these project safety gates:

- **No production mutation**: Pass. The audit will only read source/configuration and run local verification commands.
- **Evidence-first findings**: Pass. All findings must include file references, command output, route names, screenshots, or reproduction steps where possible.
- **Sensitive data redaction**: Pass. `.env`, tokens, credentials, database contents, and uploaded user data must be referenced by location only, never copied into reports.
- **Scope discipline**: Pass. Remediation implementation is out of scope until tasks are generated and approved.
- **Blocked-check transparency**: Pass. Missing credentials, network restrictions, broken Git metadata, or unavailable services are recorded as blocked checks.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-audit/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── audit-report.schema.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── src/                         # Public website app
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── router.tsx
│   └── styles/
├── apps/
│   ├── api/                     # Express/Mongoose API workspace
│   │   ├── src/config/
│   │   ├── src/middleware/
│   │   ├── src/models/
│   │   ├── src/routes/
│   │   └── src/index.ts
│   └── dashboard/               # Admin dashboard Vite app
│       ├── src/components/
│       ├── src/lib/
│       ├── src/pages/
│       └── src/App.tsx
├── packages/
│   └── shared-ui/
├── public/
├── dist/
├── package.json
├── vite.config.ts
├── vercel.json
└── .vercel/
```

**Structure Decision**: Use the existing multi-app workspace structure. The audit report will be documentation-only under `specs/001-project-audit/`; source changes are not part of this plan.

## Phase 0: Research & Inventory

1. Inventory routes and entry points:
   - Public site: `src/router.tsx`, `src/pages/*`, `src/components/*`, `src/lib/apiClient.ts`
   - Dashboard: `apps/dashboard/src/App.tsx`, `apps/dashboard/src/pages/*`, `apps/dashboard/src/lib/api.ts`, `apps/dashboard/src/lib/auth.ts`
   - API: `apps/api/src/index.ts`, `apps/api/src/routes/*`, `apps/api/src/models/*`, `apps/api/src/middleware/*`
2. Inventory configuration:
   - Root and workspace `package.json` scripts
   - `vite.config.ts`, dashboard `vite.config.ts`, `tsconfig*.json`, `tailwind.config.js`, `postcss.config.js`
   - `vercel.json`, `.vercelignore`, `.gitignore`
   - `.env` files by path only, with values redacted
3. Inventory generated/runtime artifacts:
   - `dist/`, `apps/dashboard/dist/`, `apps/api/dist/`
   - zip deploy artifacts
   - local MongoDB data directory
4. Decide exact verification commands and blocked checks.

## Phase 1: Audit Design

1. Define report format using `contracts/audit-report.schema.md`.
2. Define audit entities and fields in `data-model.md`.
3. Define verification workflow in `quickstart.md`.
4. Re-check safety gates before running runtime/browser/API checks.

## Phase 2: Execution Approach

The following activities become tasks in `/speckit.tasks`:

- Run static inventory and dependency/configuration checks.
- Run root, dashboard, and API build/typecheck commands where available.
- Start local services only when required for runtime/browser verification.
- Exercise public routes, dashboard routes, and API health/CRUD endpoints.
- Review code quality, error handling, loading states, and state management.
- Review performance and bundle risks from build output and runtime observation.
- Review SEO and accessibility for public pages.
- Review security controls and risky configuration without exposing secrets.
- Produce final audit report with top-priority fixes and evidence.

## Complexity Tracking

No constitution violations identified. The feature is intentionally documentation/audit-first and does not introduce new app code, services, or storage.
