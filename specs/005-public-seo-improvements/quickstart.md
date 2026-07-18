# Quickstart: Public SEO Improvements

This quickstart defines the verification workflow for implementation.

## Baseline Rules

- Do not change API endpoints, request payloads, response envelopes, auth behavior, or dashboard routes.
- Do not use localhost as a production canonical URL.
- Keep SEO changes focused on the public app and static crawler files.
- Add `/services` only as a thin public route that reuses existing services content; avoid broad redesign.
- Do not include dashboard, login, admin, API, or private management routes in sitemap or robots discovery.

## Static Inventory Checks

Run source inventory before implementation:

```bash
rg -n "createBrowserRouter|path:|<title>|meta name=\"description\"|canonical|og:|twitter:|robots|sitemap|json-ld|application/ld\\+json|document.title" src public index.html -g '*.tsx' -g '*.ts' -g '*.html' -g '*.xml' -g '*.txt'
```

Confirm:

- Public routes currently include `/`, `/about`, `/projects`, `/projects/:id`, `/hse`, `/careers`, and `/contact`.
- Services currently exists as a home-section component, not an indexable route.
- `index.html` has only global fallback title/description.
- `public/` currently contains no sitemap or robots file.

## Planned Verification Commands

Run during final verification:

```bash
npm run typecheck
npm run build
```

Run API tests only if implementation changes API request/response assumptions. Expected result for this package is no API test run because SEO work is public app/static-file only.

## US1 Verification Results

Completed for T001-T037:

```bash
node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=baseline
node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=us1-before
node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=us1-after
npm run dev
node specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs --base=http://localhost:5173
npm run typecheck
```

Results:

- Baseline static check failed as expected: 15/17 failures in `specs/005-public-seo-improvements/evidence/seo-static-baseline.json`.
- US1 pre-implementation static check failed as expected: 13/15 failures in `specs/005-public-seo-improvements/evidence/seo-static-us1-before.json`.
- US1 post-implementation static check passed: 15/15 in `specs/005-public-seo-improvements/evidence/seo-static-us1-after.json`.
- US1 browser metadata check passed: 16/16 route/viewport checks in `specs/005-public-seo-improvements/evidence/seo-browser-us1-results.json`.
- Browser screenshots were saved as `specs/005-public-seo-improvements/evidence/T037-*.png`.
- Additional TypeScript check passed: `npm run typecheck`.

US1 canonical note:

- `src/lib/seo.ts` uses `VITE_PUBLIC_SITE_URL` when it is a valid non-localhost URL.
- If the configured value is missing, invalid, or localhost/loopback, canonical output falls back to `https://fortuneconstruction.mw`.
- Browser evidence confirms no checked canonical URL used localhost.

US1 scope note:

- API and dashboard source were not changed.
- `public/sitemap.xml`, `public/robots.txt`, full social metadata profiles, and real JSON-LD structured data remain deferred to US3, US2, and US4 respectively.
- API was not started for US1 browser verification; existing `http://localhost:3001/api/*` fetch failures are recorded in browser evidence.

## US2 Verification Results

Completed for T038-T045:

```bash
node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=us2-before
node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=us2-after
npm run dev
node specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs --scope=us2 --base=http://localhost:5173
npm run typecheck
```

Results:

- US2 pre-implementation static check failed as expected: 11/26 failures in `specs/005-public-seo-improvements/evidence/seo-static-us2-before.json`.
- US2 post-implementation static check passed: 26/26 in `specs/005-public-seo-improvements/evidence/seo-static-us2-after.json`.
- US2 browser social metadata check passed: 16/16 route/viewport checks in `specs/005-public-seo-improvements/evidence/seo-browser-us2-results.json`.
- Browser screenshots were saved as `specs/005-public-seo-improvements/evidence/T045-*.png`.
- Additional TypeScript check passed: `npm run typecheck`.

US2 scope note:

- API and dashboard source were not changed.
- `public/sitemap.xml`, `public/robots.txt`, and real JSON-LD structured data remain deferred to US3 and US4.
- API was not started for US2 browser verification; existing `http://localhost:3001/api/*` fetch failures are recorded in browser evidence.
- Open Graph and Twitter social image URLs use `https://fortuneconstruction.mw/Logo-new-01.png` as the brand fallback, while project detail uses the available project cover image.

## US3 Verification Results

Completed for T046-T053:

```bash
node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=us3-before
node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=us3-after
rg -n "localhost|127\\.0\\.0\\.1|dashboard|login|admin|/api|private|management" public/sitemap.xml
```

Results:

- US3 pre-implementation static check failed as expected: 2/17 failures in `specs/005-public-seo-improvements/evidence/seo-static-us3-before.json`.
- US3 post-implementation static check passed: 35/35 in `specs/005-public-seo-improvements/evidence/seo-static-us3-after.json`.
- `public/sitemap.xml` contains no localhost, loopback, dashboard, login, admin, API, private, or management routes.
- `public/robots.txt` intentionally contains dashboard/login/admin/API/private/management only as `Disallow` rules.

US3 crawler file assumptions:

- Canonical crawler base URL is `https://fortuneconstruction.mw`.
- Sitemap is static for current core public routes: `/`, `/about`, `/projects`, `/services`, `/hse`, `/careers`, and `/contact`.
- Dynamic project detail sitemap expansion is deferred until production project slug/ID strategy is finalized.
- API and dashboard source were not changed.
- Structured data remains deferred to US4.

## US4 Verification Results

Completed for T054-T064:

```bash
node specs/005-public-seo-improvements/evidence/verify-structured-data.mjs --scope=us4-before
node specs/005-public-seo-improvements/evidence/verify-structured-data.mjs --scope=us4-after
npm run dev
node specs/005-public-seo-improvements/evidence/verify-structured-data.mjs --scope=us4-after --base=http://localhost:5173
npm run typecheck
```

Results:

- US4 pre-implementation structured data check failed as expected: 10/10 failures in `specs/005-public-seo-improvements/evidence/structured-data-us4-before.json`.
- US4 post-implementation source structured data check passed: 10/10 in `specs/005-public-seo-improvements/evidence/structured-data-us4-after.json`.
- US4 rendered JSON-LD parser check passed: 25/25 in `specs/005-public-seo-improvements/evidence/structured-data-us4-after.json`.
- Rendered JSON-LD raw evidence was saved in `specs/005-public-seo-improvements/evidence/structured-data-browser-results.json`.
- Additional TypeScript check passed: `npm run typecheck`.

US4 structured data assumptions:

- Structured data uses only known or visible business facts from `SITE`, visible contact page fallbacks, and visible Services content.
- Home emits organization/business context for Fortune Construction.
- Contact emits organization/business context plus `ContactPage`.
- Services emits organization/business context plus `Service` entries for Roads & Infrastructure, Building & Commercial Construction, and Bridges & Structural Works.
- API and dashboard source were not changed.
- `public/sitemap.xml` and `public/robots.txt` were not changed during US4.

## Browser SEO Checks

Start the public dev server when browser metadata verification is needed:

```bash
npm run dev
```

Recommended browser verification targets:

- `/`
- `/projects`
- `/projects/:id` using a representative local/fallback project
- `/services`
- `/contact`
- `/about`
- `/hse`
- `/careers`

Record for each checked route:

- Screenshot or equivalent route evidence.
- `document.title`.
- Meta description.
- Canonical URL.
- Robots/indexable meta.
- Open Graph and Twitter metadata.
- JSON-LD structured data summary where expected.
- Console errors.
- Failed network requests.
- Page-level horizontal scroll.
- Visible overlap or clipped primary action status.

## Sitemap and Robots Checks

Inspect generated/static files:

```bash
cat public/sitemap.xml
cat public/robots.txt
```

Confirm:

- Sitemap uses `https://fortuneconstruction.mw`, not localhost.
- Sitemap includes required public routes.
- Sitemap excludes dashboard, login, admin, API, private, and management routes.
- Robots references `https://fortuneconstruction.mw/sitemap.xml` and disallows private/dashboard/API surfaces.

## Final Verification Results

Completed for T065-T076:

```bash
node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=all
npm run dev
node specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs --scope=all --base=http://localhost:5173
node specs/005-public-seo-improvements/evidence/verify-structured-data.mjs --scope=all --base=http://localhost:5173
npm run typecheck
npm run build
```

Results:

- Full static SEO verification passed: 46/46 in `specs/005-public-seo-improvements/evidence/seo-static-results.json`.
- Final browser metadata/social/indexability verification passed: 16/16 in `specs/005-public-seo-improvements/evidence/seo-browser-results.json`.
- Final structured data parser verification passed: 25/25 in `specs/005-public-seo-improvements/evidence/structured-data-results.json`.
- `npm run typecheck` passed.
- `npm run build` passed.
- Build warning: Vite reported the main JS chunk is larger than 500 kB after minification. This is unchanged optimization guidance and not a functional build failure.

Final canonical/base URL note:

- Runtime canonical/social/structured data URL helpers use `VITE_PUBLIC_SITE_URL` only when it is valid and non-localhost.
- Missing, invalid, localhost, and loopback values fall back to `https://fortuneconstruction.mw`.
- Static sitemap and robots use `https://fortuneconstruction.mw`.

Final sitemap/robots note:

- `public/sitemap.xml` includes only `/`, `/about`, `/projects`, `/services`, `/hse`, `/careers`, and `/contact`.
- `public/sitemap.xml` contains no localhost, dashboard, login, admin, API, private, or management routes.
- `public/robots.txt` contains private/dashboard/API paths only as `Disallow` rules.

API/dashboard verification:

- API source under `apps/api/src` has no current git worktree changes from this SEO package.
- Dashboard source under `apps/dashboard/src` has pre-existing worktree changes in `Layout.tsx`, `Sidebar.tsx`, `Applications.tsx`, and `PageContent.tsx`; these were not part of this SEO package and were not modified during the final phase.
- API tests were not run because this SEO package did not change API endpoints, request payloads, response shapes, authentication behavior, API client contracts, or dashboard/API integration assumptions.

## Deferred Follow-Ups

- Dynamic project sitemap generation can be a later package if production project slugs/IDs need automatic sitemap expansion.
- SSR/prerendering can be a later SEO hardening package if static HTML crawler support becomes a requirement.
- Rich project-specific structured data can be expanded later after project content completeness is audited.
