# Implementation Plan: Production Deployment Readiness

**Branch**: `[007-production-readiness]` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-production-readiness/spec.md`

## Summary

Prepare Fortune Construction for production deployment by auditing and hardening deployment configuration across the public Vite site, dashboard Vite app, and Express API without starting production or API runtime during planning. The plan starts with static inventory of env vars, production base URLs, CORS origins, JWT/MongoDB safety, upload storage persistence, Vercel/build settings, and `fortuneconstruction.mw` domain assumptions, then separates code-fix work from external setup in Vercel, MongoDB, persistent storage, domain, and DNS. The final implementation must produce `production-readiness-report.md` with ready/fixed/blocked/deferred status and verification evidence.

## Technical Context

**Language/Version**: TypeScript with React 18/Vite public site, React 18/Vite dashboard, Express API on Node.js  
**Primary Dependencies**: Vite, React Router, TanStack Query, Axios/fetch, Express, Mongoose, JWT, Helmet, CORS, multer, Zod, Vercel SPA rewrites  
**Storage**: MongoDB via Mongoose; current upload storage is API local filesystem under `apps/api/uploads/*`; local MongoDB fallback and file-backed `mongodb-memory-server` exist for development  
**Testing**: Root `npm run typecheck`; public `npm run build`; dashboard `npm run build --workspace=apps/dashboard`; API `npm run build --workspace=apps/api`; API tests with `npm run test --workspace=apps/api` when API config/runtime behavior changes  
**Target Platform**: Public site and dashboard as Vite SPA deployments; API as a Node/Express runtime; production domain target `fortuneconstruction.mw` with possible dashboard/API subdomains or separate deployment origins  
**Project Type**: Monorepo web application with public frontend, dashboard frontend, shared UI package, and API service  
**Performance Goals**: Preserve existing build success and prior performance improvements; production readiness work must not add broad bundle/runtime regressions  
**Constraints**: Do not reveal secrets; do not run production or API runtime in planning; do not use localhost as production default; do not change API contracts, SEO outputs, dashboard routes, `Project.category` string contract, or Success Stories through Page Content  
**Scale/Scope**: One production readiness package covering public site, dashboard, API, deployment configuration, and launch-readiness reporting

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Component-First UI**: Pass. Planning avoids UI redesign; any later UI-visible deployment fixes must preserve existing components and routes.
- **API-Contract Driven**: Pass. API base URL, CORS, JWT, MongoDB, and upload changes must preserve endpoint paths and request/response shapes or include compatibility tests.
- **Type Safety (NON-NEGOTIABLE)**: Pass. All code changes in later implementation must remain TypeScript-safe and pass root/API/dashboard builds.
- **Test-First**: Pass with scope note. API runtime/config hardening needs tests first; static deployment documentation and report updates can be verified by static checks.
- **Performance & UX Consistency**: Pass. No broad UI changes; builds and prior SEO/performance outputs must be preserved.
- **Monorepo Discipline**: Pass. Public, dashboard, API, and shared UI boundaries remain intact.

## Project Structure

### Documentation (this feature)

```text
specs/007-production-readiness/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── production-readiness-report.md
├── contracts/
│   └── production-readiness-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── lib/apiClient.ts               # public API base URL behavior
├── lib/seo.ts                     # production canonical base URL behavior
└── vite-env.d.ts                  # public env typing

apps/dashboard/
├── src/lib/api.ts                 # dashboard API/upload URL behavior
├── src/components/Sidebar.tsx     # public-site link behavior
├── src/pages/Applications.tsx     # CV link behavior
├── vite.config.ts                 # dashboard Vite settings
└── vercel.json                    # dashboard SPA rewrite

apps/api/
├── src/config/runtime.ts          # env, CORS origins, JWT, DB remote policy
├── src/config/cors.ts             # CORS allowlist behavior
├── src/config/db.ts               # MongoDB/local fallback behavior
├── src/config/uploadPolicy.ts     # upload size/MIME/extension limits
├── src/routes/upload.ts           # image/video local upload paths
├── src/routes/applications.ts     # CV local upload path
├── src/index.ts                   # static uploads, startup log, health
├── src/utils/redaction.ts         # sensitive value redaction
├── .env.example                   # documented API env vars
└── package.json                   # API build/test/start scripts

vercel.json                        # public site SPA rewrite
package.json                       # root scripts
public/sitemap.xml                 # production public URLs
public/robots.txt                  # production sitemap URL
```

**Structure Decision**: Use existing monorepo boundaries. Planning artifacts live entirely under `specs/007-production-readiness/`; later implementation should touch only the specific public/dashboard/API configuration files needed by verified readiness findings.

## Phase 0: Static Inventory & Research Decisions

### Static inventory findings from current code

- **Env files**: `.env`, `apps/api/.env`, `apps/dashboard/.env`, and `.vercel/.env.production.local` exist locally. Their values were not read or copied; only variable names were inspected. `.env.example` exists only for the API at `apps/api/.env.example`.
- **API env example mismatch**: `apps/api/.env.example` documents `FRONTEND_URL` and `DASHBOARD_URL`, but `apps/api/src/config/runtime.ts` reads `PUBLIC_SITE_ORIGIN` and `DASHBOARD_ORIGIN`.
- **Public API base URL**: `src/lib/apiClient.ts` falls back to `http://localhost:3001` when `VITE_API_URL` is missing.
- **Dashboard API base URL**: `apps/dashboard/src/lib/api.ts` falls back to `http://localhost:3001` when `VITE_API_URL` is missing and prefixes upload URLs with that base.
- **Dashboard hardcoded localhost links**: `apps/dashboard/src/pages/Applications.tsx` hardcodes CV links with `http://localhost:3001`; `apps/dashboard/src/components/Sidebar.tsx` links to `http://localhost:5173`.
- **SEO production base URL**: `src/lib/seo.ts`, `public/sitemap.xml`, and `public/robots.txt` already use `https://fortuneconstruction.mw` and protect canonical URL generation from localhost values.
- **API CORS**: `apps/api/src/config/runtime.ts` defaults allowed origins to localhost for local/dev and allows `ADDITIONAL_ALLOWED_ORIGINS`; production origins need explicit configuration through `PUBLIC_SITE_ORIGIN` and `DASHBOARD_ORIGIN`.
- **JWT policy**: `apps/api/src/config/runtime.ts` rejects missing/blank/simple unsafe secrets through `getRequiredJwtSecret`; auth route and middleware fail closed with `AUTH_CONFIG_ERROR`.
- **MongoDB safety**: `apps/api/src/config/runtime.ts` detects remote MongoDB URIs and only permits them in production or with `ALLOW_REMOTE_DB=true`; `apps/api/src/config/db.ts` skips remote connection when not allowed and falls back to local options.
- **Sensitive output redaction**: `apps/api/src/utils/redaction.ts` and `safeLogger` redact MongoDB URIs, standalone credentials, and configured JWT secret values.
- **Upload storage**: API stores images, videos, and CVs on local filesystem under `apps/api/uploads/*`, serves `/uploads` statically, and validates MIME, extension, size, and sanitized filenames. This is not production-persistent on ephemeral/serverless hosting without external storage.
- **Upload limits**: image 10 MB, video 100 MB, CV 5 MB.
- **Vercel settings**: root `vercel.json` and `apps/dashboard/vercel.json` contain SPA rewrites only. No explicit build/output settings, domain bindings, API service deployment, or upload storage settings are present in code.

### Code-fix candidates

- Add production-safe API base URL resolution for public and dashboard clients so missing production `VITE_API_URL` fails clearly or uses an approved production API URL, while local dev keeps localhost fallback.
- Replace dashboard hardcoded localhost CV/public-site links with configured base URLs.
- Align `apps/api/.env.example` with actual runtime env vars and production placeholders without secret values.
- Consider production-aware API startup log wording that does not advertise localhost as the runtime URL in production.
- Add/adjust static checks/tests that prove production builds do not embed localhost as production API/upload/dashboard links.

### External setup requirements

- Configure public domain `fortuneconstruction.mw` and any `www` redirect/canonical behavior in DNS/hosting.
- Decide and configure dashboard production origin, such as a dashboard subdomain or protected deployment URL.
- Decide and configure API production origin, such as an API subdomain or separate Node hosting URL.
- Configure `VITE_API_URL` for public and dashboard production deployments.
- Configure API `PUBLIC_SITE_ORIGIN`, `DASHBOARD_ORIGIN`, optional `ADDITIONAL_ALLOWED_ORIGINS`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `MONGODB_URI`, and production `NODE_ENV`.
- Provision MongoDB production database and network access outside the repo.
- Provision persistent upload storage or choose a hosting target with durable writable storage; local filesystem uploads are not sufficient for serverless/ephemeral hosting.
- Configure Vercel/build projects and domain bindings outside the repo unless deployment config is later added.

## Phase 1: Design & Contracts

- Create `production-readiness-report.md` as the single launch-readiness artifact with matrices for environment variables, URLs/origins, security, database, uploads, hosting, verification, blocked external setup, and deferred follow-ups.
- Create `data-model.md` defining readiness entities and allowed statuses.
- Create `contracts/production-readiness-contract.md` defining the report sections, redaction requirements, and verification evidence shape.
- Create `quickstart.md` with static inventory commands and verification commands; explicitly prohibit production/API runtime during planning.
- Keep local development behavior available while preventing localhost from being treated as production-safe.

## Planned Verification

- Static URL/secret scans with redacted env handling.
- `npm run typecheck`.
- `npm run build`.
- `npm run build --workspace=apps/dashboard`.
- `npm run build --workspace=apps/api` when API configuration files are changed.
- `npm run test --workspace=apps/api` when API runtime/config, CORS, JWT, MongoDB, upload, or redaction behavior changes. These tests may need approved local execution because existing API tests bind a loopback port.
- No production runtime and no API runtime unless a later implementation task explicitly requires local-safe verification.

## Post-Design Constitution Check

- **Component-First UI**: Pass; no UI redesign planned.
- **API-Contract Driven**: Pass; API contract preservation is a first-class guardrail and API tests are planned for API config changes.
- **Type Safety**: Pass; TypeScript build/typecheck gates are planned.
- **Test-First**: Pass; API-affecting work will start with tests.
- **Performance & UX Consistency**: Pass; no broad visual/performance redesign planned.
- **Monorepo Discipline**: Pass; changes stay in existing app/package boundaries.

## Complexity Tracking

No constitution violations require justification.
