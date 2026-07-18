# Quickstart: Production Deployment Readiness

Use this guide during `$speckit implement` for `specs/007-production-readiness`.

## Safety Rules

- Do not print `.env` values or secrets.
- Do not start production runtime.
- Do not start API runtime unless a task explicitly requires local-safe verification.
- Do not connect to remote MongoDB during local verification unless an explicit safe allow flag is documented.
- Treat Vercel, MongoDB Atlas, domain/DNS, and persistent upload storage setup as external unless a task only updates repository config/docs.

## Static Inventory Commands

List env variable names without values:

```bash
for f in .env apps/api/.env apps/dashboard/.env .vercel/.env.production.local; do
  if [ -f "$f" ]; then
    printf '%s\n' "[$f]"
    sed -n 's/^\([^#=][^=]*\)=.*/\1=<redacted>/p' "$f"
  fi
done
```

Scan production URL and localhost references:

```bash
rg -n --glob '!**/*.tsbuildinfo' --glob '!node_modules/**' --glob '!dist/**' --glob '!apps/api/uploads/**' \
  "localhost|127\.0\.0\.1|VITE_API_URL|VITE_PUBLIC_SITE_URL|PUBLIC_SITE_ORIGIN|DASHBOARD_ORIGIN|MONGODB_URI|JWT_SECRET|ALLOW_REMOTE_DB|fortuneconstruction\.mw" \
  src apps packages public vercel.json apps/dashboard/vercel.json apps/api/.env.example
```

Review deployment configs:

```bash
sed -n '1,220p' package.json
sed -n '1,220p' apps/api/package.json
sed -n '1,220p' apps/dashboard/package.json
sed -n '1,220p' vercel.json
sed -n '1,220p' apps/dashboard/vercel.json
```

## Verification Commands

Required after production readiness code changes:

```bash
npm run typecheck
npm run build
npm run build --workspace=apps/dashboard
```

Required if API config/runtime behavior changes:

```bash
npm run build --workspace=apps/api
npm run test --workspace=apps/api
```

Note: API tests may require approved local execution because existing tests bind an in-process server to `127.0.0.1`.

## Report Updates

Always update:

- `production-readiness-report.md`
- `quickstart.md`
- `tasks.md`

Update as needed:

- `research.md`
- `data-model.md`
- `contracts/production-readiness-contract.md`

## Command Results Log

| Scope | Command or Check | Result | Date | Notes |
|---|---|---|---|---|
| T001-T027 | `check-prerequisites.sh --json --require-tasks --include-tasks` | Passed | 2026-07-18 | Confirmed `specs/007-production-readiness` and available docs. |
| T001-T027 | Checklist scan | Passed | 2026-07-18 | `requirements.md` has 16/16 completed items. |
| T006 | Optional Spec Kit git hooks / commit workflow | Not run | 2026-07-18 | No git hook, commit, branch switch, or production workflow was executed for this documentation-only scope. |
| T007 | Redacted env-name inventory | Passed | 2026-07-18 | Listed variable names only; values replaced with `<redacted>`. |
| T008-T013 | Static URL/config/source scans | Passed | 2026-07-18 | Findings recorded in `production-readiness-report.md`. |
| T014/T020 | Secret disclosure review | Passed | 2026-07-18 | No local env values, DB URI values, JWT secrets, credentials, or Vercel tokens copied into report. |
| T016 | Runtime safety confirmation | Passed | 2026-07-18 | No production runtime, API runtime, or remote MongoDB connection was started. |
| T028-T031 | US2 static production URL scan | Passed | 2026-07-18 | Baseline failures found for public/dashboard localhost fallbacks and hardcoded dashboard links before implementation. |
| T032-T039 | US2 production URL/origin safety implementation | Passed | 2026-07-18 | Public/dashboard API base URL helpers now fail closed in production when env is missing; local development localhost fallbacks remain non-production only. |
| T040 | `npm run typecheck` | Passed | 2026-07-18 | Root TypeScript check completed after US2/US3 changes. |
| T041 | `npm run build` | Passed with warning | 2026-07-18 | Public build passed; Vite retained existing >500 kB chunk warning for `index` chunk. |
| T042 | `npm run build --workspace=apps/dashboard` | Passed | 2026-07-18 | Dashboard build passed. |
| T043/T057 | `npm run test --workspace=apps/api` | Passed | 2026-07-18 | First sandbox run failed with `listen EPERM 127.0.0.1`; approved rerun outside sandbox passed 80/80. |
| T044-T047 | API production readiness tests | Passed | 2026-07-18 | Added coverage for production CORS origins, JWT secret policy, MongoDB local-safe remote rules, and redaction. |
| T048-T055 | US3 API runtime security readiness implementation | Passed | 2026-07-18 | API env example aligned to runtime names; production CORS origins fail closed when missing; startup log avoids localhost wording in production. |
| T056 | `npm run build --workspace=apps/api` | Passed | 2026-07-18 | API TypeScript build completed after US3 changes. |
| T058 | US3 runtime safety confirmation | Passed | 2026-07-18 | No production runtime, `npm run dev:api`, or remote MongoDB connection was started. |
| T059-T066 | Upload storage readiness review | Passed | 2026-07-18 | Image/video/CV validation and local paths documented; persistence marked external setup. |
| T067-T076 | Deployment report finalization | Passed | 2026-07-18 | Vercel/build/domain/DNS/API/dashboard origin blockers documented as external setup. |
| T077 | `npm run typecheck` | Passed | 2026-07-18 | Final root typecheck completed. |
| T078 | `npm run build` | Passed with warning | 2026-07-18 | Public build completed; existing Vite >500 kB chunk warning remains. |
| T079 | `npm run build --workspace=apps/dashboard` | Passed | 2026-07-18 | Final dashboard build completed. |
| T080 | `npm run build --workspace=apps/api` | Passed | 2026-07-18 | API build run because prior package phases changed API config/tests. |
| T081 | `npm run test --workspace=apps/api` | Passed | 2026-07-18 | Approved non-sandbox run passed 80/80; required because prior package phases changed API config/tests. |
| T082 | Final static localhost/production URL scan | Passed with allowed local-only matches | 2026-07-18 | Remaining localhost matches are local examples/defaults/tests or non-production startup wording. |
| T083 | Final redaction/static secret scan | Passed with allowed local example | 2026-07-18 | No secret values found in report/quickstart/tasks; only local MongoDB example URI appears in `apps/api/.env.example`. |
| T084-T088 | Final compatibility guardrails | Passed | 2026-07-18 | Public routes, dashboard routes, SEO outputs, upload/application response shapes, `Project.category`, and Success Stories path verified. |
| T090 | Final runtime safety confirmation | Passed | 2026-07-18 | No production runtime, `npm run dev:api`, or remote MongoDB connection was started. |

## Planning Baseline

Planning static inventory found:

- API env example mismatch: `FRONTEND_URL`/`DASHBOARD_URL` are documented, while runtime reads `PUBLIC_SITE_ORIGIN`/`DASHBOARD_ORIGIN`.
- Public and dashboard API clients fall back to `http://localhost:3001` when `VITE_API_URL` is missing.
- Dashboard CV links and public site sidebar link contain hardcoded localhost values.
- SEO canonical and crawler files already use `https://fortuneconstruction.mw`.
- API CORS/JWT/MongoDB/redaction hardening exists but needs production readiness evidence and env docs alignment.
- Current upload storage is local filesystem and needs persistent production storage or durable hosting confirmation.
- Vercel config currently includes SPA rewrites only; build/env/domain/API hosting settings require external setup or future config.

## Phase 1/2/US1 Verification Log

**Scope**: T001-T027 only  
**Captured**: 2026-07-18 Africa/Cairo  
**Runtime policy**: No production runtime, API runtime, local dev server, browser runtime, build command, API test command, or MongoDB connection was started. This phase used static source/config review only.

### Static Inventory Results

| Area | Result |
|---|---|
| Env files | `.env`, `apps/api/.env`, `apps/dashboard/.env`, and `.vercel/.env.production.local` exist locally; only variable names were read and all values stayed redacted. |
| Public URLs | `src/lib/apiClient.ts` still falls back to local API URL when `VITE_API_URL` is missing; code fix deferred to US2. |
| Dashboard URLs | `apps/dashboard/src/lib/api.ts` still falls back to local API URL; `Applications.tsx` and `Sidebar.tsx` still contain hardcoded localhost links; code fixes deferred to US2. |
| API CORS/JWT/MongoDB | Runtime config, CORS allowlist, JWT fail-closed helpers, remote DB local-safe rules, and redaction helpers exist; env example alignment and production evidence deferred to US3. |
| Upload storage | Image, video, and CV validation exists, but storage is local filesystem under API uploads paths; persistent production storage is external setup. |
| Vercel/build | Root and dashboard `vercel.json` provide SPA rewrites only; build scripts exist, but Vercel env/domain/API hosting setup is external. |
| Domain | SEO/crawler outputs use `https://fortuneconstruction.mw`; DNS/domain binding remains external setup. |

### Guardrail Status

| Guardrail | Status |
|---|---|
| No application code changed | Passed |
| No secrets disclosed | Passed |
| No production runtime started | Passed |
| No API runtime started | Passed |
| No remote MongoDB connection attempted | Passed |
| Code fixes separated from external setup | Passed |
| US2/US3/US4/US5/Final Phase not started | Passed |

## Phase US2/US3 Verification Log

**Scope**: T028-T058 only  
**Captured**: 2026-07-18 Africa/Cairo  
**Runtime policy**: No production runtime, `npm run dev:api`, or remote MongoDB connection was started. API tests used in-process local test servers only; the full API suite required approved execution outside the sandbox because loopback binding was blocked inside the sandbox.

### Results

| Area | Result |
|---|---|
| Public API URL | `src/lib/apiClient.ts` now requires `VITE_API_URL` in production and keeps `http://localhost:3001` only for non-production local development. |
| Dashboard API/upload URL | `apps/dashboard/src/lib/api.ts` now requires `VITE_API_URL` in production, exposes `resolveUploadUrl`, and keeps local fallback only outside production. |
| Dashboard public-site URL | `apps/dashboard/src/lib/api.ts` exposes `PUBLIC_SITE_URL`; `Sidebar.tsx` no longer hardcodes `http://localhost:5173`. |
| Dashboard CV links | `Applications.tsx` now resolves CV paths through `resolveUploadUrl` instead of hardcoded localhost. |
| API CORS origins | `apps/api/src/config/runtime.ts` no longer falls back to localhost CORS origins in production; `PUBLIC_SITE_ORIGIN` and `DASHBOARD_ORIGIN` are required. |
| API env example | `apps/api/.env.example` now documents `PUBLIC_SITE_ORIGIN`, `DASHBOARD_ORIGIN`, `ADDITIONAL_ALLOWED_ORIGINS`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `MONGODB_URI`, `ALLOW_REMOTE_DB`, `PORT`, and `NODE_ENV` with placeholders only. |
| Startup logs | `apps/api/src/index.ts` uses production-aware startup wording and does not advertise localhost in production. |
| Tests | `apps/api/tests/production-readiness.test.ts` covers CORS production origins, JWT fail-closed policy, MongoDB local-safe remote rules, and redaction. |

### Commands

| Command | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm run build` | Passed with existing Vite chunk warning |
| `npm run build --workspace=apps/dashboard` | Passed |
| `npm run build --workspace=apps/api` | Passed |
| `npm run test --workspace=apps/api` | Passed 80/80 after approved non-sandbox rerun; sandbox attempt was blocked by loopback `EPERM`. |

## Upload Storage Verification

These checks do not require production runtime:

```bash
sed -n '1,220p' apps/api/src/config/uploadPolicy.ts
sed -n '1,220p' apps/api/src/routes/upload.ts
sed -n '1,260p' apps/api/src/routes/applications.ts
rg -n "express.static|/uploads|uploads/images|uploads/videos|uploads/cvs" apps/api/src
```

Final result:

- Images use `apps/api/uploads/images`, 10 MB max, image MIME/extension validation, and `/uploads/images/...` URL shape.
- Videos use `apps/api/uploads/videos`, 100 MB max, video MIME/extension validation, and `/uploads/videos/...` URL shape.
- CVs use `apps/api/uploads/cvs`, 5 MB max, PDF/DOC/DOCX MIME/extension validation, and `/uploads/cvs/...` URL shape.
- `/uploads` is served from API local filesystem by Express.
- Persistent object storage or a durable API-host filesystem is required before production launch.
- No media re-encoding, CDN migration, upload provider migration, route change, or response-shape change was made.

## Final Phase Verification Log

**Scope**: T059-T090  
**Captured**: 2026-07-18 Africa/Cairo  
**Runtime policy**: No production runtime, `npm run dev:api`, or remote MongoDB connection was started. API tests used local/in-process test servers and required approved non-sandbox execution for loopback access.

### Final Commands

| Command | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm run build` | Passed with existing Vite chunk warning |
| `npm run build --workspace=apps/dashboard` | Passed |
| `npm run build --workspace=apps/api` | Passed |
| `npm run test --workspace=apps/api` | Passed 80/80 |

### Final Static Checks

| Check | Result |
|---|---|
| Production URL scan | Passed with allowed local-only matches in local examples/defaults/tests and non-production startup wording. |
| Secret/redaction scan | Passed; no secret values found in docs. The local MongoDB example URI in `apps/api/.env.example` is not a secret. |
| Public route review | Passed; public routes preserved in `src/router.tsx`. |
| Dashboard route review | Passed; dashboard routes preserved in `apps/dashboard/src/App.tsx`. |
| SEO output review | Passed; `fortuneconstruction.mw`, sitemap, and robots outputs remain unchanged. |
| API contract review | Passed; upload and application response shapes preserved. |
| Compatibility review | Passed; `Project.category` remains string and Success Stories remain through Page Content. |
