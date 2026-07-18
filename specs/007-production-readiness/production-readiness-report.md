# Production Readiness Report

**Feature**: `007-production-readiness`  
**Created**: 2026-07-17  
**Last Updated**: 2026-07-18  
**Scope Completed**: Full package (`T001-T090`)  
**Status**: Production readiness package complete; production launch is `not-ready` until external setup is finished  
**Secret Handling**: No local env values or secrets are included. Local env files were inspected by variable name only.

## Summary

Current launch status: `not-ready`

Highest priority blockers:
- Production deployments still require externally configured public, dashboard, and API origins.
- API uploads use local filesystem storage, which is not production-durable for serverless or ephemeral hosting.
- Vercel/domain/API/MongoDB/upload storage settings require external setup that cannot be proven from the repository.
- Production MongoDB, `JWT_SECRET`, DNS/domain binding, API hosting, dashboard origin, and persistent upload storage remain external setup.

Code readiness summary:
- Repository production URL/origin guards are complete.
- API runtime security readiness checks are complete.
- Upload validation is implemented, but upload persistence is not production-ready without external durable storage.
- Public/dashboard/API builds and API tests pass.

## Status Legend

| Status | Meaning |
|---|---|
| `ready` | Verified by static review as ready in repository or safe as documented. |
| `needs-code-fix` | Requires repository changes in a later task. |
| `external-setup` | Requires Vercel, MongoDB, DNS/domain, API hosting, storage, or deployment-owner action outside the repo. |
| `blocked` | Cannot be verified safely with current local information or without external access. |
| `deferred` | Valid follow-up outside this package or later phase. |
| `not-applicable` | Not relevant to this surface. |

## Task Progress

| Scope | Tasks | Status | Notes |
|---|---|---|---|
| Phase 1 Setup | T001-T006 | Complete | Documentation structure and report scaffolding checked. |
| Phase 2 Foundational | T007-T016 | Complete | Static baseline captured; no production/API runtime started. |
| US1 Inventory MVP | T017-T027 | Complete | Readiness matrices expanded; no code changes made. |
| US2 URL/Origin Safety | T028-T043 | Complete | Production URL helpers and CORS origin guards implemented; local dev fallbacks remain non-production only. |
| US3 API Runtime Security | T044-T058 | Complete | API production readiness tests, env example alignment, production CORS fail-closed behavior, and startup log wording completed. |
| US4 Upload Storage Strategy | T059-T066 | Complete | Local filesystem upload storage risk documented; durable storage marked external setup. |
| US5 Deployment Report | T067-T076 | Complete | Hosting/domain/env/DNS/API/dashboard external setup blockers finalized. |
| Final Verification | T077-T090 | Complete | Typecheck/build/API tests/static scans and compatibility guardrails recorded. |

## Redacted Env File Inventory

Only variable names were read; values were not copied.

| File | Variable Names Seen | Status | Notes |
|---|---|---|---|
| `.env` | `VITE_API_URL` | ready | Public env name exists locally; production value must be configured externally. |
| `apps/api/.env` | `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `DASHBOARD_URL` | needs-code-fix | Local file uses obsolete CORS names; values remain redacted. |
| `apps/dashboard/.env` | `VITE_API_URL` | ready | Public env name exists locally; production value must be configured externally. |
| `.vercel/.env.production.local` | Vercel-generated metadata variables including repo/build/OIDC related names | external-setup | Values were not read; Vercel project env readiness cannot be verified from repo. |

## Environment Variable Matrix

| Variable | Surface | Required In Production | Secret/Public | Expected Validation | Source Evidence | Status | Owner |
|---|---|---:|---|---|---|---|---|
| `VITE_API_URL` | Public site | Yes | Public | HTTPS API origin; no localhost in production | `src/lib/apiClient.ts` | ready + external-setup | Repo + hosting |
| `VITE_PUBLIC_SITE_URL` | Public SEO | Recommended | Public | Non-localhost public URL; invalid/localhost falls back to `https://fortuneconstruction.mw` | `src/lib/seo.ts` | ready | Repo + hosting |
| `VITE_API_URL` | Dashboard | Yes | Public | HTTPS API origin; no localhost in production | `apps/dashboard/src/lib/api.ts` | ready + external-setup | Repo + hosting |
| `VITE_PUBLIC_SITE_URL` | Dashboard outbound link | Yes | Public | HTTPS public site origin | `apps/dashboard/src/lib/api.ts`, `apps/dashboard/src/components/Sidebar.tsx` | ready + external-setup | Repo + hosting |
| `PUBLIC_SITE_ORIGIN` | API CORS | Yes | Public | Approved production public site origin; required in production | `apps/api/src/config/runtime.ts` | ready + external-setup | Hosting |
| `DASHBOARD_ORIGIN` | API CORS | Yes | Public | Approved production dashboard origin; required in production | `apps/api/src/config/runtime.ts` | ready + external-setup | Hosting |
| `ADDITIONAL_ALLOWED_ORIGINS` | API CORS | Optional | Public | Comma-separated approved origins only | `apps/api/src/config/runtime.ts` | external-setup | Hosting |
| `JWT_SECRET` | API auth | Yes | Secret | Present, non-blank, non-placeholder, strong | `apps/api/src/config/runtime.ts` | external-setup | Hosting |
| `JWT_EXPIRES_IN` | API auth | Optional | Public | Valid JWT expiry string; defaults to `24h` when absent | `apps/api/src/config/runtime.ts` | ready | Repo + hosting |
| `MONGODB_URI` | API database | Yes | Secret | Production MongoDB URI; redacted in logs | `apps/api/src/config/db.ts` | external-setup | MongoDB + hosting |
| `ALLOW_REMOTE_DB` | API local safety | No in production | Public | Only `true` for explicit local remote access approval | `apps/api/src/config/runtime.ts` | ready | Repo/local operator |
| `PORT` | API runtime | Platform-dependent | Public | Positive integer or platform-provided port | `apps/api/src/config/runtime.ts` | ready | Hosting |
| `NODE_ENV` | API runtime | Yes | Public | `production` in production API runtime | `apps/api/src/config/runtime.ts` | external-setup | Hosting |
| `FRONTEND_URL` | API legacy/local env | No | Public | Obsolete for current runtime CORS config | local `apps/api/.env` only | ready for repo docs; local cleanup optional | Local operator |
| `DASHBOARD_URL` | API legacy/local env | No | Public | Obsolete for current runtime CORS config | local `apps/api/.env` only | ready for repo docs; local cleanup optional | Local operator |

## Production URL and Origin Matrix

| Role | Expected Production Value | Current Evidence | Status |
|---|---|---|---|
| Public canonical URL | `https://fortuneconstruction.mw` | `src/lib/seo.ts`, `public/sitemap.xml`, `public/robots.txt` | ready |
| Public sitemap URL | `https://fortuneconstruction.mw/sitemap.xml` | `public/robots.txt` | ready |
| Public API base URL | Approved HTTPS API origin | `src/lib/apiClient.ts` requires `VITE_API_URL` in production and keeps localhost fallback only outside production | ready + external-setup |
| Dashboard app origin | Approved dashboard HTTPS origin or protected deployment URL | Not defined in repo | external-setup |
| Dashboard API base URL | Approved HTTPS API origin | `apps/dashboard/src/lib/api.ts` requires `VITE_API_URL` in production and keeps localhost fallback only outside production | ready + external-setup |
| Dashboard CV link base | Approved HTTPS API/upload origin | `apps/dashboard/src/pages/Applications.tsx` uses `resolveUploadUrl` from dashboard API config | ready + external-setup |
| Dashboard public preview link | `https://fortuneconstruction.mw` or configured public origin | `apps/dashboard/src/components/Sidebar.tsx` uses configured `PUBLIC_SITE_URL` helper | ready + external-setup |
| API public origin | Approved HTTPS API origin | No API hosting config in repo | external-setup |
| API CORS public site origin | `https://fortuneconstruction.mw` or approved public origin | Runtime requires `PUBLIC_SITE_ORIGIN` in production; example uses current name | ready + external-setup |
| API CORS dashboard origin | Approved dashboard origin | Runtime requires `DASHBOARD_ORIGIN` in production; actual origin remains external | ready + external-setup |
| Upload asset URL strategy | Durable API or object storage URL | API returns `/uploads/...`; dashboard resolves relative upload paths through API base URL | ready + external-setup |

Final static scan result: production-facing hardcoded localhost references were removed from public/dashboard URL code. Remaining localhost references are local-only fallbacks, local examples, local MongoDB defaults, local startup wording guarded to non-production, or tests.

## Code-Fix Backlog

| ID | Item | Evidence | Target Phase | Status |
|---|---|---|---|---|
| PRD-CODE-001 | Guard public API base URL so production does not silently use localhost fallback. | `src/lib/apiClient.ts` | US2 | fixed |
| PRD-CODE-002 | Guard dashboard API/upload base URL so production does not silently use localhost fallback. | `apps/dashboard/src/lib/api.ts` | US2 | fixed |
| PRD-CODE-003 | Replace dashboard CV hardcoded localhost link. | `apps/dashboard/src/pages/Applications.tsx` | US2 | fixed |
| PRD-CODE-004 | Replace dashboard public preview hardcoded localhost link. | `apps/dashboard/src/components/Sidebar.tsx` | US2 | fixed |
| PRD-CODE-005 | Align API env example with runtime CORS names and remove misleading obsolete names. | `apps/api/.env.example`, `apps/api/src/config/runtime.ts` | US3 | fixed |
| PRD-CODE-006 | Make API startup log production-aware so production logs do not advertise localhost. | `apps/api/src/index.ts` | US3 | fixed |
| PRD-CODE-007 | Add production readiness API tests for CORS/JWT/MongoDB/redaction if runtime config changes. | `apps/api/tests/production-readiness.test.ts` | US2/US3 | fixed |

## External Setup Backlog

| ID | Item | Owner | Status | Notes |
|---|---|---|---|---|
| PRD-EXT-001 | Configure public site domain `fortuneconstruction.mw` and optional `www` policy. | DNS/hosting owner | external-setup | Code confirms SEO target but cannot verify DNS binding. |
| PRD-EXT-002 | Decide and configure dashboard production origin. | Deployment owner | external-setup | Needed for CORS and dashboard links. |
| PRD-EXT-003 | Decide and configure API production origin. | Deployment owner | external-setup | Required for `VITE_API_URL` and API hosting. |
| PRD-EXT-004 | Configure Vercel public/dashboard production env vars. | Vercel owner | external-setup | Values must not be committed. |
| PRD-EXT-005 | Provision production MongoDB and configure `MONGODB_URI`. | MongoDB/hosting owner | external-setup | URI must remain secret and redacted. |
| PRD-EXT-006 | Configure strong production `JWT_SECRET`. | Hosting owner | external-setup | Must be non-placeholder and not committed. |
| PRD-EXT-007 | Choose persistent upload storage or durable API host filesystem. | Deployment/storage owner | external-setup | Required for image/video/CV persistence. |
| PRD-EXT-008 | Confirm API hosting target supports Node/Express runtime. | Deployment owner | external-setup | Repository has no API Vercel/serverless config. |
| PRD-EXT-009 | Configure persistent object storage or a durable API host filesystem for `/uploads`. | Deployment/storage owner | external-setup | Required because API currently stores files on local disk. |

## Security Readiness

### JWT

- `apps/api/src/config/runtime.ts` classifies missing, blank, and simple unsafe secrets.
- `getRequiredJwtSecret()` throws a non-sensitive error if the secret is not safely configured.
- `apps/api/src/routes/auth.ts` and `apps/api/src/middleware/auth.ts` return non-sensitive `AUTH_CONFIG_ERROR` when JWT signing config is unsafe.
- Production readiness still requires externally configured `JWT_SECRET`.
- **Status**: `ready` for code foundation; `external-setup` for production secret.

### CORS

- `apps/api/src/config/cors.ts` uses an allowlist from runtime config and permits no-origin probes.
- `apps/api/src/index.ts` adds an explicit browser-origin rejection with `CORS_ORIGIN_DENIED`.
- `apps/api/src/config/runtime.ts` keeps local origin fallbacks for non-production but requires `PUBLIC_SITE_ORIGIN` and `DASHBOARD_ORIGIN` in production.
- `apps/api/.env.example` documents current CORS env names and safe placeholders only.
- **Status**: `ready` for code foundation; `external-setup` for production origins.

### Redaction

- `apps/api/src/utils/redaction.ts` redacts MongoDB URIs, standalone credentials, and configured JWT secret values.
- `apps/api/src/utils/safeLogger.ts` wraps console output through redaction.
- Existing API tests include redaction scenarios and production readiness tests cover DB URI, credentials, JWT secret, and client response redaction.
- **Status**: `ready` for current code foundation.

## MongoDB Readiness

| Item | Evidence | Status | Notes |
|---|---|---|---|
| Remote DB detection | `apps/api/src/config/runtime.ts` | ready | Remote URI is detected when not local loopback. |
| Local-safe remote blocking | `apps/api/src/config/runtime.ts`, `apps/api/src/config/db.ts` | ready | Remote DB is blocked in non-production unless `ALLOW_REMOTE_DB=true`. |
| Production DB provisioning | External MongoDB service | external-setup | Repository cannot provision or verify production DB. |
| Local fallback | `apps/api/src/config/db.ts` | ready for development | Local MongoDB and file-backed memory fallback are not production DB readiness. |
| DB URI redaction | `apps/api/src/utils/redaction.ts` | ready | URI patterns are redacted in safe logger. |

No production MongoDB connection was opened during this package. API tests used local/in-process test behavior only.

## Upload Storage Readiness

| Category | Current Local Path | Limit | Extensions | MIME Types | Current URL Shape | Status |
|---|---|---:|---|---|---|---|
| Images | `apps/api/uploads/images` | 10 MB | `.jpeg`, `.jpg`, `.png`, `.webp`, `.gif` | JPEG, PNG, WebP, GIF | `/uploads/images/...` | external-setup |
| Videos | `apps/api/uploads/videos` | 100 MB | `.mp4`, `.webm`, `.mov`, `.avi` | MP4, WebM, QuickTime, AVI | `/uploads/videos/...` | external-setup |
| CVs | `apps/api/uploads/cvs` | 5 MB | `.pdf`, `.doc`, `.docx` | PDF, Word, DOCX | `/uploads/cvs/...` | external-setup |

Notes:
- Validation and sanitized filenames are implemented in `apps/api/src/config/uploadPolicy.ts` and `apps/api/src/utils/uploadValidation.ts`.
- Files are stored on the API local filesystem and served from `/uploads` by `apps/api/src/index.ts`.
- This is not production-complete for serverless/ephemeral hosting unless a durable writable filesystem is guaranteed.
- Persistent object storage or a durable API host filesystem is required before production launch.
- Dashboard CV links remain compatible with stored `/uploads/cvs/...` paths by resolving them through the configured API base URL.
- No media re-encoding, CDN migration, object-storage provider migration, or upload response-shape change was performed in this package.

## Hosting and Domain Readiness

| Surface | Evidence | Status | Notes |
|---|---|---|---|
| Public site build | `package.json` has `npm run build`; root `vercel.json` rewrites all routes to `/` | ready for static SPA build; external-setup for Vercel project/domain | No explicit output/domain/env config in repo. |
| Dashboard build | `apps/dashboard/package.json` has `npm run build`; `apps/dashboard/vercel.json` rewrites all routes to `/` | ready for SPA build; external-setup for Vercel project/domain | Dashboard origin not defined in repo. |
| API build/runtime | `apps/api/package.json` has `build`, `start`, `test` | external-setup | Node/Express hosting target is not defined in repo. |
| `fortuneconstruction.mw` domain | `src/lib/seo.ts`, `public/sitemap.xml`, `public/robots.txt` | ready in code; external-setup for DNS/domain binding | Code uses production domain; external DNS cannot be verified locally. |
| Upload persistence | local API filesystem | external-setup | Needs durable storage/hosting decision. |

Deployment note: root and dashboard `vercel.json` files only define SPA rewrites. Vercel project linking, build/output settings, environment variables, domain binding, dashboard origin, API origin, DNS, and any API hosting target remain external setup.

## Verification Log

| Check Or Command | Surface | Result | Date | Evidence Summary | Notes |
|---|---|---|---|---|---|
| Spec Kit prerequisites | Docs | passed | 2026-07-18 | `check-prerequisites.sh --json --require-tasks --include-tasks` returned the 007 feature directory and docs. | No code/runtime. |
| Explicit 007 path guard | Docs | passed with note | 2026-07-18 | Later prerequisite script detected active `008-error-pages-handling`; this run used the user-specified `specs/007-production-readiness` path directly. | No branch switch or new feature created. |
| Checklist gate | Docs | passed | 2026-07-18 | `requirements.md` has 16/16 completed checklist items. | No code/runtime. |
| Static env-name scan | Cross-cutting | passed | 2026-07-18 | Env variable names listed with `<redacted>` values only. | No secret values recorded. |
| Static URL/config scan | Cross-cutting | passed | 2026-07-18 | Found localhost fallbacks and hardcoded dashboard links; production SEO domain present. | Static only. |
| API config static review | API | passed | 2026-07-18 | CORS/JWT/MongoDB/redaction/upload files reviewed without running API. | No API runtime. |
| Vercel/build static review | Hosting | passed | 2026-07-18 | Root and dashboard rewrites plus package scripts reviewed. | No build run in T001-T027. |
| US2 static production URL scan | Public/Dashboard/API | passed | 2026-07-18 | Initial scan found localhost fallbacks and hardcoded dashboard links; post-change scan shows production-facing fixes with local-only fallbacks remaining. | Static only. |
| Production readiness API tests added | API | passed | 2026-07-18 | `apps/api/tests/production-readiness.test.ts` covers production CORS origins, JWT policy, MongoDB local-safe rules, and redaction. | No secrets included. |
| `npm run typecheck` | Cross-cutting | passed | 2026-07-18 | TypeScript check completed successfully. | No production runtime. |
| `npm run build` | Public site | passed with warning | 2026-07-18 | Public Vite build completed; existing `index` chunk warning remains above 500 kB. | SEO outputs not changed. |
| `npm run build --workspace=apps/dashboard` | Dashboard | passed | 2026-07-18 | Dashboard TypeScript/Vite build completed successfully. | Dashboard routes preserved. |
| `npm run build --workspace=apps/api` | API | passed | 2026-07-18 | API TypeScript build completed successfully. | No production runtime. |
| `npm run test --workspace=apps/api` | API | passed | 2026-07-18 | Sandbox run was blocked by loopback `EPERM`; approved non-sandbox rerun passed 80/80. | In-process local test servers only; no production runtime or remote DB connection. |
| Upload storage static review | API/uploads | passed | 2026-07-18 | Image/video/CV policies, local paths, `/uploads` static serving, and response URL shapes reviewed. | Persistence remains external setup. |
| Vercel/build/domain static review | Hosting/domain | passed | 2026-07-18 | Root/dashboard rewrites, package build scripts, and `fortuneconstruction.mw` SEO/crawler outputs reviewed. | DNS/domain/API/dashboard origins remain external setup. |
| Final static URL scan | Cross-cutting | passed with allowed local-only references | 2026-07-18 | No production-facing hardcoded localhost blockers remain; remaining matches are local dev defaults/examples/tests. | No secrets printed. |
| Final secret/redaction scan | Docs/env example | passed with allowed local example | 2026-07-18 | No PATs, OIDC token values, credentials, or remote DB URI values found; only local MongoDB example URI appears in `apps/api/.env.example`. | No `.env` values copied. |
| Final compatibility review | Public/Dashboard/API | passed | 2026-07-18 | Public routes, dashboard routes, SEO outputs, API upload/application response shapes, `Project.category` string, and Success Stories via Page Content verified. | No response shape or route changes in final phase. |

## US2/US3 Completion Evidence

| Item | Evidence | Status |
|---|---|---|
| Public API production fallback removed | `src/lib/apiClient.ts` requires `VITE_API_URL` in production and only uses localhost in non-production. | fixed |
| Dashboard API/upload production fallback removed | `apps/dashboard/src/lib/api.ts` requires `VITE_API_URL` in production and resolves upload URLs through `resolveUploadUrl`. | fixed |
| Dashboard hardcoded localhost links removed | `apps/dashboard/src/pages/Applications.tsx` and `apps/dashboard/src/components/Sidebar.tsx` use URL helpers. | fixed |
| Dashboard public site URL configured | `apps/dashboard/src/lib/api.ts` uses `VITE_PUBLIC_SITE_URL` in production and local fallback outside production. | fixed + external-setup |
| API production CORS origins required | `apps/api/src/config/runtime.ts` requires `PUBLIC_SITE_ORIGIN` and `DASHBOARD_ORIGIN` in production. | fixed + external-setup |
| API env example aligned | `apps/api/.env.example` uses current runtime env names with safe placeholders only. | fixed |
| JWT fail-closed policy verified | Production readiness tests and existing auth config tests cover missing, blank, and unsafe secrets. | ready + external-setup |
| MongoDB local-safe rule verified | Production readiness tests and runtime config preserve remote DB blocking outside production unless `ALLOW_REMOTE_DB=true`. | ready + external-setup |
| Redaction verified | Production readiness tests cover DB URI, credentials, JWT secret, and client response redaction. | ready |
| Production startup log avoids localhost | `apps/api/src/index.ts` logs localhost only for non-production runtime. | fixed |

## Final Compatibility Guardrails

| Guardrail | Evidence | Status |
|---|---|---|
| Public routes preserved | `src/router.tsx` still defines `/`, `/about`, `/projects`, `/projects/:id`, `/services`, `/hse`, `/careers`, and `/contact`. | passed |
| Dashboard routes preserved | `apps/dashboard/src/App.tsx` still defines login and management routes including projects, project categories, applications, messages, jobs, team, partners, services, settings, and content. | passed |
| SEO outputs preserved | `src/lib/seo.ts`, `public/sitemap.xml`, and `public/robots.txt` still use `https://fortuneconstruction.mw` and exclude private routes from crawler files. | passed |
| API upload response shapes preserved | `apps/api/src/routes/upload.ts` still returns `{ url, type }`; application submit still returns success message and id. | passed |
| Dashboard CV compatibility preserved | Stored `/uploads/cvs/...` paths remain supported through dashboard API base URL resolution. | passed |
| `Project.category` string contract preserved | `apps/api/src/models/Project.ts` keeps `category: string` and a string schema field. | passed |
| Success Stories management path preserved | `apps/dashboard/src/pages/PageContent.tsx` still maps `Success Stories` to `successStories`; no dedicated dashboard page was added. | passed |

## Blocked External Setup

- Vercel production env vars for public site and dashboard.
- API production hosting target and API production origin.
- Dashboard production origin and any access/protection policy.
- Production MongoDB database provisioning and `MONGODB_URI`.
- Production `JWT_SECRET`.
- Persistent upload storage or a durable API host with writable storage.
- DNS/domain binding for `fortuneconstruction.mw`, optional `www` policy, dashboard origin, and API origin.
- Vercel project/domain/env configuration for public and dashboard deployments.

## Deferred Follow-ups

- Full CDN/media pipeline for uploads.
- Production observability/log drain setup.
- Backup and restore procedure for MongoDB and uploads.
- Admin/dashboard access policy hardening beyond origin configuration.
- Optional cleanup of local-only `.env` files that still contain legacy variable names; values were not read or copied.

## Final Launch Status

Final launch status: `not-ready`.

The repository is production-readiness prepared from a code/config guardrail perspective: production-safe URL/origin behavior, API runtime security checks, redaction coverage, current env examples, public/dashboard/API builds, and API tests are complete. It is not launch-ready because required production infrastructure is external and unverified: Vercel env/domain setup, API hosting/origin, dashboard origin, production MongoDB, strong `JWT_SECRET`, DNS binding for `fortuneconstruction.mw`, and persistent upload storage.
