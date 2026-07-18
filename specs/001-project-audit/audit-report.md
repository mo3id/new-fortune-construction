# Comprehensive Project Audit Report

## Executive Summary

Status: Final audit complete. Phase 1, Phase 2, US1, US2, US3, US4, US5, US6, and Final Phase are complete.

Overall health: the project has a usable multi-surface structure, but the audit found high-priority risks in API startup/runtime reliability, server-side validation, security configuration, dependency health, dashboard responsiveness, and missing automated tests. The most important pattern is that several user-facing and admin flows depend on an API that could not reach `/health` locally, while the API and dashboard also lack enough validation, test, and security guardrails to make remediation low-risk.

Runtime commands were only started after the relevant gates. The API was not started until T030 confirmed no production/sensitive database indicator in the checked local environment. API health remained blocked by local MongoMemoryServer startup failures.

Top risks:

1. API runtime cannot reach `/health`, blocking end-to-end confidence for website/dashboard/API flows.
2. API validation and error handling are sparse, especially for public forms and admin CRUD.
3. Credentialed CORS allows any origin and JWT has a static fallback secret.
4. Production dependency audit reports 19 vulnerabilities, including 8 high severity.
5. Dashboard has desktop-first responsive risks and no project-owned automated tests.

Top five fixes:

1. Stabilize local API startup and `/health`: configure a reliable local MongoDB path or MongoMemoryServer binding, then rerun API/browser checks.
2. Harden API security and validation: restrict CORS, require a strong JWT secret, redact DB URI logs, add route validation, and add shared async error handling.
3. Fix upload and dependency risk: validate upload MIME/signatures, normalize filenames, and resolve high-severity `npm audit` findings with post-update smoke tests.
4. Add automated quality gates: introduce API route tests, form/schema tests, dashboard smoke tests, plus `test`, `lint`, and combined `check` scripts.
5. Improve user-facing quality: add SEO metadata/sitemap/robots/structured data, reduce hero media cost, add API caching/pagination, and make dashboard layouts/actions mobile and keyboard friendly.

## Scope

- Feature directory: `/Users/mohamedeidali/Desktop/fortune-construction/specs/001-project-audit`
- Active feature source: `.specify/feature.json` points to `specs/001-project-audit`
- Implemented task ranges: T001 through T065
- Explicitly excluded for this pass: None
- Redaction rule: environment variable names and sensitive artifact locations may be documented; secret values must not be copied into this report
- Blocked-check policy: if a check cannot be safely verified, record it as blocked with the reason and do not substitute assumptions for evidence

## Priority Matrix

| Priority | Items |
| --- | --- |
| Critical | None confirmed in this pass |
| High | AUD-RUN-002 API dev runtime cannot reach `/health`; AUD-RUN-003 server-side validation/error handling gaps; AUD-SEC-001 permissive credentialed CORS; AUD-SEC-002 JWT fallback secret; AUD-SEC-004 public upload controls; AUD-SEC-007 dependency vulnerabilities; AUD-CQ-003 no project-owned automated tests; AUD-UX-004 dashboard responsive layout risk |
| Medium | AUD-INV-001 Git status unavailable; AUD-INV-002 API route file appears unmounted; AUD-INV-003 dashboard page appears unrouted; AUD-RUN-001 root production build did not complete; AUD-RUN-004 dashboard bundle/chunking warnings; AUD-SEC-003 remote DB URI log exposure; AUD-SEC-005 client token storage; AUD-SEC-006 ignore/deploy exposure gaps; AUD-CQ-001 duplicated shared UI adapters; AUD-CQ-002 repeated dashboard CRUD patterns; AUD-CQ-004 generated/stale artifacts in working tree; AUD-SEO-001 incomplete crawl/social metadata; AUD-PERF-001 heavy hero media; AUD-PERF-002 API caching and payload risks; AUD-PERF-003 expensive client rendering patterns; AUD-A11Y-001 keyboard and semantic gaps |
| Low | AUD-CQ-005 weak local typing and script gaps; AUD-UX-001 contact-form failure feedback gap |
| Pending | None |

## Finding Scoring Matrix

| ID | Surface | Priority | Severity | Confidence | Verification Method |
| --- | --- | --- | --- | --- | --- |
| AUD-RUN-002 | API/runtime | 1 | High | Confirmed | Start API locally and confirm `/health` returns 200 |
| AUD-SEC-001 | API/security | 2 | High | Confirmed | Send CORS requests from allowed and disallowed origins and verify rejection |
| AUD-SEC-002 | API/auth | 3 | High | Confirmed | Start API without `JWT_SECRET` and verify startup fails safely |
| AUD-RUN-003 | API/integration | 4 | High | Confirmed | Submit invalid API payloads and verify consistent 4xx responses |
| AUD-SEC-004 | API/uploads | 5 | High | Confirmed | Upload invalid file types and verify rejection before storage/static serving |
| AUD-SEC-007 | Dependencies | 6 | High | Confirmed | Rerun `npm audit --omit=dev` after updates and confirm high findings are resolved |
| AUD-CQ-003 | Repository/testing | 7 | High | Confirmed | Run new project-owned unit/API/browser tests in CI |
| AUD-UX-004 | Dashboard/UX | 8 | High | Likely | Browser-test dashboard workflows at mobile/tablet/desktop widths |
| AUD-RUN-001 | Public website/build | 9 | Medium | Confirmed | Rerun `npm run build` and confirm successful artifact generation |
| AUD-RUN-004 | Dashboard/build | 10 | Medium | Confirmed | Rebuild dashboard and compare chunk sizes/import warnings |
| AUD-INV-002 | API/integration | 11 | Medium | Confirmed | Confirm `/api/project-categories` is mounted and consumed successfully |
| AUD-INV-003 | Dashboard/routing | 12 | Medium | Confirmed | Navigate to `/project-categories` through dashboard routing and sidebar |
| AUD-SEC-003 | API/configuration | 13 | Medium | Confirmed | Force remote DB connection failure and verify logs redact URI values |
| AUD-SEC-005 | Dashboard/auth | 14 | Medium | Confirmed | Trigger 401 and verify all auth state is cleared; evaluate storage strategy |
| AUD-SEC-006 | Configuration/deployment | 15 | Medium | Confirmed | Run Git status after adding ignore patterns and verify sensitive artifacts are ignored |
| AUD-CQ-001 | Shared code | 16 | Medium | Confirmed | Consolidate shared UI and verify public/dashboard imports still build |
| AUD-CQ-002 | Dashboard/code quality | 17 | Medium | Confirmed | Replace repeated CRUD patterns and verify all admin pages still pass smoke tests |
| AUD-CQ-004 | Repository/cleanup | 18 | Medium | Confirmed | Remove or quarantine stale/generated artifacts and verify build ignores remain intact |
| AUD-SEO-001 | Public website/SEO | 19 | Medium | Confirmed | Inspect built HTML/metadata, sitemap, robots, and social previews |
| AUD-PERF-001 | Public website/media | 20 | Medium | Confirmed | Measure initial network/media load before and after video/image changes |
| AUD-PERF-002 | API/performance | 21 | Medium | Confirmed | Load-test representative list endpoints with pagination/cache headers |
| AUD-PERF-003 | Website/dashboard/rendering | 22 | Medium | Likely | Profile render work and dataset filtering in browser performance tools |
| AUD-A11Y-001 | Website/dashboard/accessibility | 23 | Medium | Likely | Run keyboard, screen-reader, and reduced-motion checks |
| AUD-INV-001 | Repository/configuration | 24 | Medium | Confirmed | Restore Git metadata and rerun `git status --short --branch` |
| AUD-CQ-005 | Repository/code quality | 25 | Low | Confirmed | Run stricter TypeScript/lint checks after type cleanup |
| AUD-UX-001 | Public website/UX | 26 | Low | Confirmed | Simulate contact API failure and confirm visible retry/error state |

## Surface Summaries

### Repository And Commands

Status: issues-found

- Root package declares workspaces: `apps/*`, `packages/*`
- Root scripts discovered: `dev`, `build`, `typecheck`, `preview`, `dev:api`, `dev:dashboard`, `dev:all`
- Dashboard scripts discovered: `dev`, `build`, `preview`
- API scripts discovered: `dev`, `build`, `start`, `seed`
- Dependency state: root `node_modules/` and `package-lock.json` are present; `apps/api/node_modules/`, `apps/dashboard/node_modules/`, and `packages/shared-ui/node_modules/` are also present
- Install action: `npm install` was not run; current inventory relies on existing installed dependencies
- Lint command: no `lint` script found in root, dashboard, or API package manifests; no lint command was run
- Git state: blocked because `git -C /Users/mohamedeidali/Desktop/fortune-construction status --short --branch` returned `fatal: not a git repository (or any of the parent directories): .git`

### Public Website

Status: issues-found

- Router source: `/Users/mohamedeidali/Desktop/fortune-construction/src/router.tsx`
- App entry source: `/Users/mohamedeidali/Desktop/fortune-construction/src/App.tsx`
- Public routes discovered: `/`, `/about`, `/projects`, `/projects/:id`, `/hse`, `/careers`, `/contact`
- Page modules discovered: `AboutPage.tsx`, `CareersPage.tsx`, `ContactPage.tsx`, `HSEPage.tsx`, `ProjectDetailsPage.tsx`, `ProjectsPage.tsx`
- API client source: `/Users/mohamedeidali/Desktop/fortune-construction/src/lib/apiClient.ts`
- Public API base behavior: `VITE_API_URL` with fallback to `http://localhost:3001`, then `/api`
- Component coverage includes layout, hero, project, services, partners, contact, forms, footer, UI primitives, maps, timeline, and error boundary modules under `src/components/`
- Key issues: root production build did not complete; contact form failure is not visible; SEO metadata is incomplete; hero media strategy is heavy; accessibility and reduced-motion behavior need deeper verification.

### Dashboard

Status: issues-found

- App route source: `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/App.tsx`
- Routes discovered: `/login`, `/`, `/projects`, `/applications`, `/messages`, `/jobs`, `/team`, `/partners`, `/services`, `/settings`, `/content`, wildcard redirect
- Page modules discovered: `Applications.tsx`, `Jobs.tsx`, `Login.tsx`, `Messages.tsx`, `Overview.tsx`, `PageContent.tsx`, `Partners.tsx`, `ProjectCategories.tsx`, `Projects.tsx`, `Services.tsx`, `Settings.tsx`, `Team.tsx`
- Dashboard API source: `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/lib/api.ts`
- Dashboard auth source: `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/lib/auth.ts`
- Dashboard API base behavior: `VITE_API_URL` with fallback to `http://localhost:3001`, then `/api`
- Auth storage behavior: token and user data are stored in `localStorage`; axios request interceptor attaches bearer token; 401 responses clear auth state and redirect to `/login`
- Coverage note: `ProjectCategories.tsx` exists but no matching route was found in `apps/dashboard/src/App.tsx`
- Key issues: `/project-categories` sidebar/page/API usage is present but route/API mount coverage is inconsistent; desktop-first layout risks small-screen workflows; bundle output is large; token storage and repeated CRUD patterns need remediation.

### API

Status: issues-found

- API entry source: `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/src/index.ts`
- Middleware/configuration discovered: Helmet with cross-origin resource policy override, dynamic CORS origin callback with credentials, Express rate limit, JSON and URL-encoded body limits, static `/uploads`, health endpoint
- Mounted route groups discovered: `/api/auth`, `/api/projects`, `/api/services`, `/api/partners`, `/api/team`, `/api/jobs`, `/api/applications`, `/api/messages`, `/api/settings`, `/api/upload`, `/api/stats`, `/api/content`, `/api/success-stories`
- Health route discovered: `/health`
- Route files discovered: `applications.ts`, `auth.ts`, `jobs.ts`, `messages.ts`, `pageContent.ts`, `partners.ts`, `projectCategories.ts`, `projects.ts`, `services.ts`, `settings.ts`, `stats.ts`, `successStories.ts`, `team.ts`, `upload.ts`
- Model files discovered: `Admin.ts`, `ContactMessage.ts`, `JobApplication.ts`, `JobPosition.ts`, `PageContent.ts`, `Partner.ts`, `Project.ts`, `ProjectCategory.ts`, `Service.ts`, `SiteSettings.ts`, `SuccessStory.ts`, `TeamMember.ts`
- Coverage note: `projectCategories.ts` exists under API routes, but no matching mounted `/api/project-categories` route was found in `apps/api/src/index.ts`
- Key issues: API runtime failed before `/health`; CORS/JWT/upload/security gaps exist; routes use raw request bodies and direct model coupling; list endpoints lack pagination, lean reads, projections, and cache headers.

### Deployment And Build Configuration

Status: issues-found

- Public website Vite config: `/Users/mohamedeidali/Desktop/fortune-construction/vite.config.ts`
- Dashboard Vite config: `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/vite.config.ts`
- Public website aliases include `@fortune/shared-ui` to `src/lib/frontendSharedUi.tsx` and `@` to `src`
- Dashboard aliases include `@fortune/shared-ui` to `apps/dashboard/src/lib/dashboardSharedUi.tsx` and `@` to dashboard `src`
- Dashboard dev server port configured as `5174`
- `vercel.json` rewrites all routes to `/`
- `.vercelignore` excludes environment files, node_modules, API local database data, uploads, build outputs, archives, logs, and temp artifacts
- Key issues: `.gitignore` does not fully mirror deployment-sensitive ignore coverage; Git state and Spec Kit branch validation are blocked; root `dist/` looks incomplete.

### Sensitive And Runtime Artifacts

Status: issues-found

- Root `.env` exists; key discovered: `VITE_API_URL`
- API `.env` exists; keys discovered: `PORT`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `DASHBOARD_URL`
- Dashboard `.env` exists; no values were copied into this report
- API `.env.example` exists
- API local database artifact directory exists: `/Users/mohamedeidali/Desktop/fortune-construction/apps/api/.mongodb-data/`
- Build/archive artifacts discovered for later review: root `dist/`, `apps/dashboard/dist/`, `apps/api/dist/`, `frontend-prod.zip`, `frontend_deploy.zip`
- Key issues: local runtime artifacts, generated build outputs, archives, and stale spec copies should be quarantined or ignored before remediation and source-control work.

### Shared UI And Aliases

Status: issues-found

- Public website shared UI adapter: `/Users/mohamedeidali/Desktop/fortune-construction/src/lib/frontendSharedUi.tsx`
- Dashboard shared UI adapter: `/Users/mohamedeidali/Desktop/fortune-construction/apps/dashboard/src/lib/dashboardSharedUi.tsx`
- Package directory discovered: `/Users/mohamedeidali/Desktop/fortune-construction/packages/shared-ui/`
- Shared package visible artifact: `packages/shared-ui/components.json`
- Key issues: public and dashboard shared UI adapters duplicate form/schema/UI logic while `packages/shared-ui/` is not the effective implementation source.

## Detailed Findings

### AUD-INV-001: Git State Cannot Be Verified

- Category: configuration
- Severity: medium
- Status: blocked
- Evidence: `git -C /Users/mohamedeidali/Desktop/fortune-construction status --short --branch` returned `fatal: not a git repository (or any of the parent directories): .git`
- Impact: Audit cannot currently distinguish committed baseline from local changes using Git evidence.
- Recommendation: Restore or provide repository metadata before relying on Git-based change tracking.

### AUD-INV-002: API Project Categories Route Appears Unmounted

- Category: integration
- Severity: medium
- Status: issues-found
- Evidence: `apps/api/src/routes/projectCategories.ts` exists, but `apps/api/src/index.ts` did not show a corresponding mounted `/api/project-categories` route.
- Impact: Dashboard or public flows that expect project category APIs may fail or require a different endpoint.
- Recommendation: Confirm intended endpoint coverage during US2 before changing behavior.

### AUD-INV-003: Dashboard Project Categories Page Appears Unrouted

- Category: UI/UX
- Severity: medium
- Status: issues-found
- Evidence: `apps/dashboard/src/pages/ProjectCategories.tsx` exists, but `apps/dashboard/src/App.tsx` did not show a route pointing to it.
- Impact: Admin category management may be inaccessible through dashboard routing.
- Recommendation: Confirm whether this page is intentionally hidden or should be added to dashboard navigation/routing in a later implementation phase.

### AUD-RUN-001: Root Production Build Did Not Complete

- Category: runtime/build
- Severity: medium
- Status: blocked
- Evidence: `npm run build` started Vite, reached `✓ 2193 modules transformed`, then produced no further output within the practical execution window and was stopped with Ctrl-C.
- Impact: The public website production build could not be confirmed, so T032 website browser checks were not started.
- Recommendation: Re-run the root build with verbose diagnostics or inspect Vite/Rollup output generation for hangs.

### AUD-RUN-002: API Dev Runtime Cannot Reach Health Check

- Category: runtime/integration
- Severity: high
- Status: issues-found
- Evidence: T030 confirmed no `MONGODB_URI` or `DATABASE_URL` in the current shell and no `MONGODB_URI` key in `apps/api/.env`; `apps/api/src/config/db.ts` falls back to local MongoDB and then `.mongodb-data`. Starting `npm run dev:api` then failed in sandbox with `listen EPERM: operation not permitted 0.0.0.0`; outside sandbox it failed with `GenericMMSError: Instance failed to start within 10000ms`.
- Impact: `/health` could not be checked, and API-dependent website/dashboard flows cannot be verified end to end.
- Recommendation: Ensure a local MongoDB is available or configure MongoMemoryServer to bind to an allowed local interface/port before repeating T031.

### AUD-RUN-003: API Routes Rely On Raw Request Bodies And Sparse Error Handling

- Category: integration
- Severity: high
- Status: issues-found
- Evidence: Route handlers across `apps/api/src/routes/` create/update models from `req.body` directly. `messages.ts` and `applications.ts` accept public submissions without server-side required-field checks in the route. Several async Express 4 route handlers do not wrap database operations in `try/catch` or a shared async error middleware.
- Impact: Invalid requests may become database validation errors or unhandled async failures instead of consistent 4xx responses, making public forms and dashboard workflows harder to debug.
- Recommendation: Add route-level validation schemas and a shared async error handler before relying on runtime tests.

### AUD-RUN-004: Dashboard Build Warns About Chunking And Mixed Imports

- Category: performance/build
- Severity: medium
- Status: issues-found
- Evidence: `npm run build --workspace=apps/dashboard` completed, but Vite warned that `apps/dashboard/src/lib/api.ts` is both dynamically and statically imported, preventing it from moving into another chunk. The generated JS chunk was about `596.98 kB` minified and triggered the `500 kB` warning.
- Impact: Dashboard load performance may degrade, and intended code-splitting for services/API code is not effective.
- Recommendation: Normalize API imports and consider route-level or vendor chunk splitting for dashboard pages.

### AUD-RUN-005: Public Form UX Does Not Surface Contact Submission Failure

- Category: integration/UX
- Severity: medium
- Status: issues-found
- Evidence: `src/components/contact/ContactForm.tsx` catches submission failures and logs `Contact form submission failed`, but does not set a visible error state for the user. `src/components/ApplicationForm.tsx` does show a file/submission error message.
- Impact: Users submitting the contact form may receive no visible feedback when the API request fails.
- Recommendation: Add a visible failure state and retry path for the contact form.

### AUD-RUN-006: Browser Console/Network Evidence Is Partially Blocked

- Category: runtime/browser
- Severity: medium
- Status: blocked
- Evidence: Dashboard dev server started outside sandbox and returned HTTP 200 for `/login`, `/`, `/projects`, `/applications`, `/messages`, `/jobs`, `/team`, `/partners`, `/services`, `/settings`, and `/content`. Browser automation could not run because Playwright's browser executable was not installed locally. Console errors and failed browser network requests were therefore not collected.
- Impact: Dashboard route availability is smoke-tested, but client-side runtime errors remain unverified.
- Recommendation: Install or provide a browser runtime for Playwright, then repeat T033 with console and network listeners enabled.

### AUD-SEC-001: Credentialed CORS Allows Any Origin

- Category: security/configuration
- Severity: high
- Status: issues-found
- Evidence: `apps/api/src/index.ts` configures `cors({ origin: (origin, cb) => cb(null, true), credentials: true })`. Helmet is enabled, but `crossOriginResourcePolicy` is set to `cross-origin`.
- Impact: Any origin can make credentialed cross-origin requests to the API. If an admin token is available in a browser context, this increases exposure to malicious origins and cross-site data access patterns.
- Recommendation: Restrict CORS origins to the known public site and dashboard origins from environment configuration, reject unknown origins, and keep credentials enabled only where required.

### AUD-SEC-002: JWT Verification Falls Back To A Static Secret

- Category: security/authentication
- Severity: high
- Status: issues-found
- Evidence: `apps/api/src/routes/auth.ts` and `apps/api/src/middleware/auth.ts` both use `process.env.JWT_SECRET || 'secret'` for signing/verifying JWTs.
- Impact: If `JWT_SECRET` is missing in any environment, tokens are protected by a predictable fallback value.
- Recommendation: Fail startup when `JWT_SECRET` is absent or below a minimum strength threshold. Do not use a default signing secret.

### AUD-SEC-003: Remote Database URI May Be Logged On Connection Failure

- Category: security/configuration
- Severity: medium
- Status: issues-found
- Evidence: `apps/api/src/config/db.ts` logs the configured `MONGODB_URI` value when remote connection fails. The value itself was not copied into this report.
- Impact: A database URI often contains hostnames, usernames, or passwords and can leak into terminal logs, CI logs, or deployment logs.
- Recommendation: Redact database URI output and log only a safe label such as `remote MongoDB connection failed`.

### AUD-SEC-004: Upload Controls Are Incomplete For Public And Admin Uploads

- Category: security/file-handling
- Severity: high
- Status: issues-found
- Evidence: `apps/api/src/routes/upload.ts` protects admin image/video upload routes and applies size limits, but file type checks are based on filename extension only. `apps/api/src/routes/applications.ts` accepts public CV uploads with a 5 MB size limit but no route-level file type filter, and filenames include the original filename.
- Impact: Malicious or unexpected file content can be stored under statically served `/uploads`. Public uploads are particularly exposed because they do not require authentication.
- Recommendation: Validate MIME type and file signatures, normalize filenames, restrict served content types, and add explicit file filters for public CV uploads.

### AUD-SEC-005: Client-Side Auth State Uses LocalStorage

- Category: security/authentication
- Severity: medium
- Status: issues-found
- Evidence: `apps/dashboard/src/lib/auth.ts` stores `fc_token` and `fc_user` in `localStorage`; `apps/dashboard/src/lib/api.ts` reads the token from `localStorage` and attaches it as a bearer token. The 401 interceptor removes `fc_token` but does not remove `fc_user`.
- Impact: Tokens stored in `localStorage` are exposed to any successful XSS in the dashboard. Stale user state may remain after an API 401.
- Recommendation: Prefer secure, HttpOnly cookie sessions where possible, or harden dashboard XSS defenses and clear all auth state consistently on 401.

### AUD-SEC-006: Ignore Rules Do Not Fully Cover Local Sensitive Artifacts

- Category: security/configuration
- Severity: medium
- Status: issues-found
- Evidence: `.vercelignore` excludes `.env`, workspace `.env`, node_modules, API `.mongodb-data`, API uploads, zips, logs, and build outputs. `.gitignore` excludes `.mongodb-data`, `.vercel`, logs, node_modules, and dist, but does not explicitly exclude `.env`, `.env.*`, `apps/*/.env`, `*.zip`, or `apps/api/uploads`. Local sensitive/runtime artifacts exist at redacted paths including `.env` files, API uploads, local database data, and zip archives.
- Impact: Deployment ignore rules are stronger than source-control ignore rules. If the project is used as a Git repository, environment files, upload data, or archive artifacts could be accidentally staged unless protected elsewhere.
- Recommendation: Add explicit Git ignore patterns for environment files, uploads, and deployment archives before restoring or relying on Git metadata.

### AUD-SEC-007: npm Audit Reports High-Severity Dependency Vulnerabilities

- Category: security/dependencies
- Severity: high
- Status: issues-found
- Evidence: `npm audit --omit=dev` failed inside sandbox due DNS/network, then succeeded outside sandbox. It reported 19 total vulnerabilities: 1 low, 10 moderate, and 8 high. High-severity affected packages include `axios`, `fast-uri`, `form-data`, `hono`, `path-to-regexp`, `picomatch`, and `react-router`/`react-router-dom`. Moderate dependency chains include `express-rate-limit` via `ip-address`, and `express`/`body-parser` via `qs`.
- Impact: The project currently has production dependency advisories affecting HTTP clients, routing, parsing, upload/form handling, and frontend routing.
- Recommendation: Run dependency updates in a dedicated remediation pass, review breaking changes, and rerun builds plus runtime smoke tests after `npm audit fix` or manual version bumps.

### AUD-CQ-001: Shared UI Logic Is Duplicated Across App-Specific Adapters

- Category: code-quality
- Severity: medium
- Status: issues-found
- Evidence: `src/lib/frontendSharedUi.tsx` and `apps/dashboard/src/lib/dashboardSharedUi.tsx` both implement similar `useFormSchema`, validation helpers, `FormInput`, and UI primitive exports. Vite aliases `@fortune/shared-ui` to different local adapter files for the public site and dashboard, while `packages/shared-ui/` is not the actual shared implementation.
- Impact: Shared form behavior, validation messages, and UI primitives can drift between the public site and dashboard. Fixes must be duplicated and are easy to miss.
- Recommendation: Consolidate shared UI/form utilities into a real package or a single source module, then keep app-specific styling or schema differences as thin wrappers.

### AUD-CQ-002: Dashboard CRUD Pages Repeat Data Fetching And Mutation Patterns

- Category: code-quality
- Severity: medium
- Status: issues-found
- Evidence: `apps/dashboard/src/pages/Projects.tsx`, `Services.tsx`, `Jobs.tsx`, `Team.tsx`, `Partners.tsx`, `Applications.tsx`, `Messages.tsx`, `Settings.tsx`, and `ProjectCategories.tsx` each define local `useQueryClient`, `useQuery`, `useMutation`, `invalidateQueries`, toast handling, modal state, edit IDs, and delete/toggle logic directly in page components.
- Impact: The dashboard is harder to maintain because loading, error, invalidation, optimistic behavior, and delete confirmation patterns are implemented many times with small variations.
- Recommendation: Introduce focused hooks such as `useCrudResource`, resource-specific API modules, and reusable list/modal primitives after the audit phase.

### AUD-CQ-003: Project-Owned Automated Tests Are Missing

- Category: code-quality/testing
- Severity: high
- Status: issues-found
- Evidence: Searching outside `node_modules` found no project-owned `*.test.*`, `*.spec.*`, `vitest.config.*`, `jest.config.*`, or `playwright.config.*` files. Root scripts expose `dev`, `build`, `typecheck`, and previews; dashboard exposes `dev`, `build`, `preview`; API exposes `dev`, `build`, `start`, `seed`.
- Impact: Critical flows such as auth, public form submission, API validation, dashboard CRUD, and build/runtime regressions are not protected by automated tests.
- Recommendation: Add API route tests, form/schema unit tests, dashboard smoke tests, and a CI-oriented script set before remediation work becomes larger.

### AUD-CQ-004: Generated And Stale Artifacts Obscure The Source Tree

- Category: code-quality
- Severity: medium
- Status: issues-found
- Evidence: Generated artifacts are present under root `dist/`, `apps/dashboard/dist/`, `apps/api/dist/`, deployment zip archives, and API `.mongodb-data/`. A stale duplicate task file exists at `specs/001-project-audit/tasks 2.md`.
- Impact: Source review is noisier, stale documentation can confuse task status, and generated/server data artifacts raise the risk of accidental review, packaging, or source-control mistakes.
- Recommendation: Keep generated artifacts outside normal review scope, clean stale spec copies after confirming they are not needed, and strengthen ignore patterns as tracked in security findings.

### AUD-CQ-005: Weak Local Typing And Missing Script Coverage Reduce Maintainability

- Category: code-quality
- Severity: low
- Status: issues-found
- Evidence: Several UI paths use broad `any` types, including `Record<string, any>` icon maps, `any` page item maps, `control: any` in `apps/dashboard/src/pages/Projects.tsx`, and `z.ZodType<any, any>`/`reduce<any>` in shared form utilities. No `lint`, `test`, `format`, or workspace-level `check` script is declared in the reviewed package manifests.
- Impact: TypeScript catches less drift around form fields, icon maps, and shared UI helpers. Missing scripts make local and CI quality gates inconsistent.
- Recommendation: Replace broad `any` with typed form/resource models and add explicit `lint`, `test`, and combined `check` scripts once tooling choices are confirmed.

### AUD-SEO-001: Public SEO Metadata Is Incomplete For Crawl And Sharing

- Category: seo
- Severity: medium
- Status: issues-found
- Evidence: `index.html` includes a global title, viewport, favicon, and description only. No canonical URL, Open Graph tags, Twitter/social metadata, structured data, `robots.txt`, or `sitemap.xml` were found in `index.html` or `public/`. Route pages under `src/pages/` do not set per-route document metadata.
- Impact: Search engines and social platforms receive one generic SPA document for all routes, reducing route-level discoverability and share previews for projects, careers, HSE, and contact pages.
- Recommendation: Add route-aware metadata handling, canonical URLs, OG/Twitter tags, organization/local-business structured data, sitemap generation, and robots rules.

### AUD-PERF-001: Hero Video Strategy Loads Multiple Large Media Candidates

- Category: performance
- Severity: medium
- Status: issues-found
- Evidence: `src/components/hero/VideoBackground.tsx` maps every hero video into a `<video>` or YouTube `<iframe>` and toggles opacity. Public assets include three MP4 files of about 1.2 MB, 2.8 MB, and 6.4 MB. The shared `Image` component does not add default lazy loading, dimensions, decoding, or fetch priority hints.
- Impact: Multiple video elements/iframes can increase initial network, memory, and decode work on the home page. Images may contribute to layout shift or unnecessary eager loading when callers omit loading attributes.
- Recommendation: Render only the active/next video, add poster images and preload strategy, compress/transcode videos, and set image dimensions/lazy/decoding defaults where appropriate.

### AUD-PERF-002: API Responses Lack Pagination, Lean Reads, And Cache Headers

- Category: performance
- Severity: medium
- Status: issues-found
- Evidence: API list endpoints such as projects, services, partners, team, messages, applications, jobs, content, and success stories call Mongoose `find()` and return full JSON arrays. No `lean()`, pagination/limits for most public lists, response projection, `Cache-Control`, ETag, or API-level caching headers were found in `apps/api/src/routes/` or `apps/api/src/index.ts`.
- Impact: Public and dashboard pages can become slower as data grows, and frequently reused content must be fetched and serialized repeatedly.
- Recommendation: Add pagination/limits for admin tables, projection/lean reads for read-only endpoints, and cache headers or server-side caching for public content, settings, categories, projects, services, team, partners, and success stories.

### AUD-PERF-003: Client Rendering Uses Many Animations And Repeated Derived Lists

- Category: performance
- Severity: medium
- Status: issues-found
- Evidence: Public pages and components use many `framer-motion` `whileInView` blocks, `AnimatePresence`, intervals, and repeated `.map()` transforms. Dashboard pages filter/search client-side after fetching arrays, including applications and messages. Some dashboard lists and public sections derive arrays inline rather than through memoized selectors.
- Impact: Large datasets and animation-heavy pages can increase main-thread work, especially on mobile devices and admin tables.
- Recommendation: Prefer lighter CSS transitions for simple reveals, memoize expensive derived data, paginate/filter server-side for admin lists, and audit motion usage for reduced-motion support.

### AUD-UX-001: Public Form Failure States Are Inconsistent

- Category: ux
- Severity: low
- Status: issues-found
- Evidence: `src/components/contact/ContactForm.tsx` logs submission failure without a visible error state, while `src/components/ApplicationForm.tsx` shows a user-facing submission/file error.
- Impact: Contact users may not understand that their inquiry failed or what to do next.
- Recommendation: Add visible error messaging and retry affordances to the contact form.

### AUD-UX-004: Dashboard Layout Has Desktop-First Responsive Risks

- Category: ux
- Severity: high
- Status: issues-found
- Evidence: `apps/dashboard/src/components/Layout.tsx` uses `h-screen` with a persistent flex layout; `Sidebar.tsx` uses a fixed `w-64` sidebar and no mobile collapse route. Admin tables such as `Applications.tsx` use horizontal overflow for table content, and row actions in `Messages.tsx` become visible on hover via `opacity-0 group-hover:opacity-100`.
- Impact: Dashboard workflows may be difficult on small screens and touch devices, where fixed sidebars, wide tables, and hover-only controls reduce discoverability and ergonomics.
- Recommendation: Add responsive dashboard navigation, persistent or touch-visible row actions, mobile table/card layouts, and viewport-specific QA.

### AUD-A11Y-001: Accessibility Basics Are Inconsistent Across Interactive UI

- Category: accessibility
- Severity: medium
- Status: issues-found
- Evidence: Some controls have accessible labels, such as the public mobile nav toggle and map SVG. Other icon-only dashboard buttons rely on `title` or no explicit `aria-label`, hover-only controls hide actions until pointer hover, decorative icon images often use empty alt text, and motion-heavy content does not show an explicit reduced-motion branch in reviewed components.
- Impact: Keyboard, screen-reader, and reduced-motion users may have inconsistent access to dashboard actions, animated content, and visual-only controls.
- Recommendation: Add explicit labels for icon buttons, ensure all hover actions are keyboard/touch reachable, define decorative vs meaningful image alt consistently, and respect `prefers-reduced-motion`.

### AUD-PERF-004: Existing Build Outputs Show Dashboard Bundle And Incomplete Public Build Signals

- Category: performance/build
- Severity: medium
- Status: issues-found
- Evidence: Existing dashboard build output contains `apps/dashboard/dist/assets/index-Bx-ACtix.js` at about 584 KB and `index-DF1gK6uz.css` at about 72 KB. Existing root `dist/` contains only `Logo-new-01.png` and a zero-byte copied video artifact in `dist/assets/videos/`, consistent with the earlier blocked root build.
- Impact: Dashboard initial load is likely heavy for an admin app, while the public build output cannot be trusted as a complete artifact.
- Recommendation: Split dashboard routes/vendor bundles, verify public build completion before deployment, and add build artifact size tracking after remediation.

## Blocked Checks

| Blocker | Needed To Unblock | Confidence Impact |
| --- | --- | --- |
| Git status check failed because the workspace did not behave as a valid Git repository during early audit work. | Restore/repair Git metadata or run from the actual repository root, then rerun `git status --short --branch`. | Reduces confidence in change-baseline and dirty-worktree attribution. |
| Spec Kit prerequisite script repeatedly rejected current branch `codex-security-hardening-stage-0` because it does not match the expected feature branch pattern. | Switch to/create a Spec Kit-compatible branch name or adjust workflow branch validation. | Does not affect source findings, but blocks clean Spec Kit prerequisite completion. |
| Root public website build did not complete after Vite transformed modules. | Rerun with verbose build diagnostics and fix the hang before browser-checking public routes. | Public production artifact and public browser route verification remain incomplete. |
| API runtime failed before `/health` despite T030 passing as local/safe. | Provide working local MongoDB or fix MongoMemoryServer startup/binding. | End-to-end API, website API calls, and dashboard API flows remain partially unverified. |
| Dashboard browser console/network evidence could not be collected because Playwright browser executable was unavailable. | Install/provide a browser runtime and repeat route checks with console and network listeners. | Dashboard HTTP smoke checks passed, but client-side console/network failures remain unknown. |
| `npm audit --omit=dev` failed inside sandbox due DNS/network, then succeeded outside sandbox with approval. | Keep network access available for dependency audit in CI/local verification. | Dependency risk is known, but repeatability inside sandbox is blocked. |

## Verification Log

| Task Range | Method | Runtime Started | Result |
| --- | --- | --- | --- |
| T001-T003 | Read Spec Kit feature metadata and report contract | No | Report skeleton, metadata, scope, redaction, and blocked policy recorded |
| T004 | Ran Git status command only | No | Blocked: workspace did not report as Git repository |
| T005-T007 | Read package manifests and dependency artifacts | No | Scripts, install state, and lint absence recorded |
| T008-T015 | Read route, API, model, config, and environment artifact locations | No | Foundational inventory recorded with secret values redacted |
| T016-T021 | Read website, dashboard, API, shared UI, and generated/runtime artifact surfaces | No | Surface coverage summarized and missing/unmounted candidates recorded |
| T022 | Ran `npm run typecheck` | No | Passed with no TypeScript output |
| T023 | Ran `npm run build` | No | Blocked: Vite reached module transformation then did not complete; stopped manually |
| T024 | Ran `npm run build --workspace=apps/dashboard` | No | Passed with chunking/import warnings |
| T025 | Ran `npm run build --workspace=apps/api` | No | Passed with no TypeScript output |
| T026-T029 | Static code review of API clients, auth integration, routes, forms, and content hooks | No | Integration and validation risks recorded |
| T030 | Redacted API environment and DB safety check | No | Passed as local/safe: no `MONGODB_URI`/`DATABASE_URL`; DB code falls back to local MongoDB then `.mongodb-data` |
| T031 | Started `npm run dev:api`, then stopped failed watcher | Yes | Failed before `/health`: MongoMemoryServer EPERM in sandbox and startup timeout outside sandbox |
| T032 | Website browser check | No | Blocked because root production build did not complete |
| T033 | Started `npm run dev:dashboard`, HTTP-smoke-checked admin routes, then stopped server | Yes | Dashboard routes returned 200 outside sandbox; console/network browser evidence blocked by missing Playwright browser executable |
| T034 | Static review of public website hooks, store, and utility modules | No | Public state/API utilities reviewed; weak typing and shared UI duplication risks recorded |
| T035 | Static review of dashboard pages and API/auth/data-fetching libs | No | Repeated CRUD/query/mutation/page state patterns recorded |
| T036 | Static review of API routes, middleware, model coupling, and error handling | No | Route-model coupling, raw body usage, and sparse shared error handling recorded |
| T037 | Static search for dead code, duplicates, generated artifacts, and stale reports | No | Generated artifacts, stale `tasks 2.md`, duplicate shared adapters, and local database artifacts recorded |
| T038 | Static review of package scripts and test assets | No | No project-owned tests found; no lint/test/format scripts declared |
| T039 | Static review of public metadata, crawlability, canonical, social, sitemap, robots, and structured content | No | Incomplete SEO/crawl/social metadata recorded |
| T040 | Static review of video/image/media handling and existing public media assets | No | Heavy hero video and missing image loading defaults recorded |
| T041 | Static review of API latency, caching, payload, and endpoint patterns | No | Missing pagination, lean reads, projections, and cache headers recorded |
| T042 | Static review of client rendering, animations, filtering, and transformations | No | Animation-heavy and client-side filtering risks recorded |
| T043 | Static review of public website responsive UX, forms, states, and visual consistency | No | Contact-form failure feedback and public UX risks recorded |
| T044 | Static review of dashboard workflows, forms, list states, and responsive behavior | No | Fixed desktop dashboard layout and touch/hover action risks recorded |
| T045 | Static review of semantic labels, focus/keyboard indicators, and accessibility basics | No | Inconsistent icon labels, hover-only actions, and reduced-motion gaps recorded |
| T046 | Reviewed existing `dist/` and `apps/dashboard/dist/` outputs only | No | Dashboard bundle size and incomplete public build artifact signals recorded |
| T047 | Static review of API middleware and startup security settings | No | Permissive credentialed CORS and broad cross-origin resource policy recorded |
| T048 | Static review of API auth, JWT, and DB config | No | Static JWT fallback and remote URI logging risk recorded |
| T049 | Static review of upload route controls | No | Extension-only admin upload filtering and public CV upload gaps recorded |
| T050 | Static review of input validation and authorization assumptions | No | Raw body usage and sparse validation/error handling risks recorded |
| T051 | Static review of dashboard token storage and API redirect handling | No | LocalStorage token risk and partial 401 cleanup recorded |
| T052 | Static review of `.gitignore`, `.vercelignore`, `vercel.json`, and local sensitive artifacts | No | Deployment ignore coverage passed; Git ignore exposure gaps recorded |
| T053 | Ran `npm audit --omit=dev` | No | Sandbox network blocked; outside sandbox completed with 19 vulnerabilities, including 8 high |
| T054 | Assigned priority, surface, confidence, and verification methods across findings | No | Finding scoring matrix completed |
| T055 | Built final Critical/High/Medium/Low matrix | No | Priority matrix completed with no pending bucket |
| T056 | Wrote final executive summary and top five fixes | No | Stakeholder summary completed |
| T057 | Completed surface summaries across website, dashboard, API, config/deployment, artifacts, and shared code | No | Surface summaries updated to reflect issues-found state |
| T058 | Completed blocked checks with prerequisites and confidence impact | No | Blocked checks table completed |
| T059 | Completed verification log for commands, browser/API/static checks | No | Verification log updated through T065 |
| T060 | Validated report against audit report contract | No | Required sections and finding fields represented |
| T061 | Re-read spec and mapped FR-001 through FR-015 to report coverage | No | Requirement coverage table completed |
| T062 | Re-read quickstart and verified safety rules | No | Safety compliance recorded |
| T063 | Checked report for secret-value patterns | No | No secret-value matches found in final validation |
| T064 | Checked report for unresolved placeholders, empty required sections, and evidence gaps | No | No unresolved placeholders or evidence-empty findings found |
| T065 | Prepared final implementation handoff summary | No | Handoff summary completed |

## Requirement Coverage

| Requirement | Coverage |
| --- | --- |
| FR-001 | Website, dashboard, and API surfaces inventoried and summarized. |
| FR-002 | Routes, API groups, config files, environment dependencies, deployment settings, and shared modules inventoried. |
| FR-003 | Install state, lint absence, typecheck, build, dashboard build, API build, and runtime commands recorded. |
| FR-004 | Runtime, route, build, API health, browser, network/console blockers, and configuration mismatch findings recorded. |
| FR-005 | API clients, auth, CORS, env behavior, response/error handling, loading/error states, and integration risks reviewed. |
| FR-006 | Duplication, generated artifacts, weak typing, missing tests, repeated patterns, and maintainability risks reviewed. |
| FR-007 | Bundle output, media handling, expensive rendering, API caching/latency, and client work risks reviewed. |
| FR-008 | Title/description, semantic/crawl, canonical/social, sitemap/robots, and structured data gaps reviewed. |
| FR-009 | Secrets redaction, CORS, JWT, uploads, dependency audit, localStorage token storage, validation, and leakage risks reviewed. |
| FR-010 | Navigation, responsiveness, forms, error states, keyboard/touch access, and accessibility risks reviewed. |
| FR-011 | Findings include severity, evidence, impact, recommendation, and are assigned surface/priority/confidence/verification in the scoring matrix. |
| FR-012 | Confirmed defects, risks, and blocked checks are separated through status, confidence, and blocked-check sections. |
| FR-013 | Priority matrix is complete for Critical, High, Medium, Low, and Pending. |
| FR-014 | No application code, production settings, deployments, seed/migration actions, or live data were changed. |
| FR-015 | Executive summary, top five fixes, detailed findings, and handoff summary are complete. |

## Report Validation

- Contract sections present: Executive Summary, Scope, Priority Matrix, Surface Summaries, Detailed Findings, Blocked Checks, Verification Log.
- Finding fields present: every finding has an ID/title, category, severity, status, evidence, impact, recommendation; surface, priority, confidence, and verification method are assigned in the Finding Scoring Matrix.
- Evidence check: every detailed finding includes an `Evidence:` line with file paths, command outcomes, route names, artifact observations, or audit output summaries.
- Secret check: final validation searched for obvious `.env` value patterns and known secret-value fragments; no secret values were found in this report.
- Unresolved marker check: no empty required sections or reviewer markers remain.
- Safety check: no code files were modified during audit reporting; runtime servers started during US2 were stopped; secrets and database contents were not copied.

## Handoff Summary

The audit is ready for remediation planning. Start with API/runtime and security hardening because they block confidence in the rest of the system: fix API local startup, validation/error handling, CORS/JWT/upload controls, and dependency advisories. Next add tests and scripts so subsequent fixes can be verified. Then address dashboard routing/responsiveness, public build/SEO/media performance, shared UI consolidation, and cleanup of generated/stale artifacts.
