# SEO Findings: Public SEO Improvements

Scope completed: Phase 1, Phase 2, US1 tasks T001-T037, US2 tasks T038-T045, US3 tasks T046-T053, US4 tasks T054-T064, and Final Phase tasks T065-T076. Implementation is limited to static inventory, verification helpers, page metadata/canonical/indexability, a thin `/services` public route, typed/page-specific Open Graph/Twitter social metadata, static sitemap/robots crawler discovery files, and structured data for home/contact/services using known visible business facts. API changes and dashboard changes are out of scope.

## Guardrails

| Guardrail | Status | Evidence |
|---|---|---|
| Do not change API endpoints, request payloads, response shapes, or auth behavior | Active | SEO work is public-app head metadata and static verification only for T001-T037. |
| Do not change dashboard source or routes | Active | `apps/dashboard/src/` is out of scope for this phase. |
| Do not use localhost as production canonical URL | Active | `src/lib/seo.ts` must use a configured public site URL or a documented non-localhost fallback. |
| Do not implement sitemap/robots before US3 | Complete | `public/sitemap.xml` and `public/robots.txt` were added only during US3. |
| Do not implement structured data before US4 | Complete | JSON-LD was added only during US4 for home, contact, and services. |

## Static Route Inventory

| Target | Source | Current / Planned Status | SEO Gap | Status |
|---|---|---|---|---|
| Home | `src/App.tsx`, `src/router.tsx` | Current route `/` exists. | Route-specific title, description, canonical, robots/indexable signal applied. | Completed in US1 |
| About | `src/pages/AboutPage.tsx`, `src/router.tsx` | Current route `/about` exists. | Route-specific title, description, canonical, robots/indexable signal applied. | Completed in US1 |
| Projects | `src/pages/ProjectsPage.tsx`, `src/router.tsx` | Current route `/projects` exists. | Route-specific title, description, canonical, robots/indexable signal applied. | Completed in US1 |
| Project detail | `src/pages/ProjectDetailsPage.tsx`, `src/router.tsx` | Current route `/projects/:id` exists. | Project-aware metadata with safe fallback applied. | Completed in US1 |
| Services | `src/pages/ServicesPage.tsx`, `src/router.tsx`, `src/components/Services.tsx`, `src/components/footer/FooterLinks.tsx` | Thin `/services` route added and reuses existing Services content. | Route is now indexable with metadata/canonical. | Completed in US1 |
| HSE | `src/pages/HSEPage.tsx`, `src/router.tsx` | Current route `/hse` exists. | Route-specific title, description, canonical, robots/indexable signal applied. | Completed in US1 |
| Careers | `src/pages/CareersPage.tsx`, `src/router.tsx` | Current route `/careers` exists. | Route-specific title, description, canonical, robots/indexable signal applied. | Completed in US1 |
| Contact | `src/pages/ContactPage.tsx`, `src/router.tsx` | Current route `/contact` exists. | Route-specific title, description, canonical, robots/indexable signal applied. | Completed in US1 |

## Current Head / Static SEO Inventory

| Target | Evidence | Status |
|---|---|---|
| `index.html` | Contains global fallback `<title>` and meta description only. | Baseline fallback only |
| Route-specific metadata | No current `canonical`, route-level `document.title`, `SeoHead`, OG/Twitter, robots meta, or JSON-LD detected. | Gap |
| `public/sitemap.xml` | Static sitemap now exists with required public routes and production canonical base URL. | Fixed in US3 |
| `public/robots.txt` | Static crawler policy now exists with public allow and private/dashboard/API disallow rules. | Fixed in US3 |

## Findings

| ID | Target | Route/File | Severity | Evidence | API Risk | Fix Scope | Status |
|---|---|---|---|---|---|---|---|
| SEO-001 | Route metadata | Public routes | P1 | `seo-static-us1-after.json` passed 15/15; `seo-browser-us1-results.json` passed 16/16. | None | `src/lib/seo.ts`, `src/components/SeoHead.tsx`, public pages only. | Fixed in US1 |
| SEO-002 | Services indexability | `/services` | P1 | `/services` registered in `src/router.tsx`, browser status 200 on desktop/mobile, canonical `https://fortuneconstruction.mw/services`. | None | Thin `src/pages/ServicesPage.tsx`, `src/router.tsx`, service links only. | Fixed in US1 |
| SEO-003 | Production canonical base URL | Canonical URL helper | P1 | Browser evidence shows all checked canonicals use `https://fortuneconstruction.mw`, not localhost. | None | `src/lib/seo.ts`. | Fixed in US1 |
| SEO-004 | Crawler discovery | `public/sitemap.xml`, `public/robots.txt` | P2 | `seo-static-us3-after.json` passed 35/35. Sitemap includes required public routes with `https://fortuneconstruction.mw` and excludes dashboard/login/admin/API/private routes. Robots references production sitemap and disallows private/dashboard/API routes. | None | `public/sitemap.xml`, `public/robots.txt`, static verification only. | Fixed in US3 |
| SEO-005 | Full social metadata | Public routes | P2 | `seo-static-us2-after.json` passed 26/26; `seo-browser-us2-results.json` passed 16/16 with page-specific OG/Twitter title, description, URL, image, and type/card. | None | `src/lib/seo.ts`, `src/components/SeoHead.tsx`, public project detail fallback only. | Fixed in US2 |
| SEO-006 | Structured data | Home, contact, services | P3 | `structured-data-us4-after.json` passed 25/25 with parsed JSON-LD on `/`, `/contact`, and `/services`. | None | `src/lib/seo.ts`, `src/App.tsx`, `src/pages/ContactPage.tsx`, `src/pages/ServicesPage.tsx`, structured-data verification only. | Fixed in US4 |

## Baseline Verification Log

| Check | Command / Evidence | Result |
|---|---|---|
| Static SEO baseline | `node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=baseline` | Expected fail: 15/17 failed. Evidence: `specs/005-public-seo-improvements/evidence/seo-static-baseline.json`. |
| US1 pre-implementation metadata check | `node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=us1-before` | Expected fail: 13/15 failed. Evidence: `specs/005-public-seo-improvements/evidence/seo-static-us1-before.json`. |
| US1 post-implementation static check | `node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=us1-after` | Pass: 15/15. Evidence: `specs/005-public-seo-improvements/evidence/seo-static-us1-after.json`. |
| US1 browser metadata check | `node specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs --base=http://localhost:5173` | Pass: 16/16 desktop/mobile route checks. Evidence: `specs/005-public-seo-improvements/evidence/seo-browser-us1-results.json` and `T037-*.png`. |
| US2 pre-implementation social static check | `node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=us2-before` | Expected fail: 11/26 failed for missing typed social profile coverage. Evidence: `specs/005-public-seo-improvements/evidence/seo-static-us2-before.json`. |
| US2 post-implementation social static check | `node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=us2-after` | Pass: 26/26. Evidence: `specs/005-public-seo-improvements/evidence/seo-static-us2-after.json`. |
| US2 browser social metadata check | `node specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs --scope=us2 --base=http://localhost:5173` | Pass: 16/16 desktop/mobile route checks. Evidence: `specs/005-public-seo-improvements/evidence/seo-browser-us2-results.json` and `T045-*.png`. |
| US3 pre-implementation crawler static check | `node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=us3-before` | Expected fail: 2/17 failed for missing sitemap and robots files. Evidence: `specs/005-public-seo-improvements/evidence/seo-static-us3-before.json`. |
| US3 post-implementation crawler static check | `node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=us3-after` | Pass: 35/35. Evidence: `specs/005-public-seo-improvements/evidence/seo-static-us3-after.json`. |
| US4 pre-implementation structured data check | `node specs/005-public-seo-improvements/evidence/verify-structured-data.mjs --scope=us4-before` | Expected fail: 10/10 failed for missing typed builders and page wiring. Evidence: `specs/005-public-seo-improvements/evidence/structured-data-us4-before.json`. |
| US4 post-implementation source structured data check | `node specs/005-public-seo-improvements/evidence/verify-structured-data.mjs --scope=us4-after` | Pass: 10/10. Evidence: `specs/005-public-seo-improvements/evidence/structured-data-us4-after.json`. |
| US4 browser JSON-LD parser check | `node specs/005-public-seo-improvements/evidence/verify-structured-data.mjs --scope=us4-after --base=http://localhost:5173` | Pass: 25/25. Evidence: `specs/005-public-seo-improvements/evidence/structured-data-us4-after.json` and `structured-data-browser-results.json`. |
| Final full static SEO verification | `node specs/005-public-seo-improvements/evidence/verify-seo-static.mjs --scope=all` | Pass: 46/46. Evidence: `specs/005-public-seo-improvements/evidence/seo-static-results.json`. |
| Final public browser metadata verification | `node specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs --scope=all --base=http://localhost:5173` | Pass: 16/16. Evidence: `specs/005-public-seo-improvements/evidence/seo-browser-results.json`. |
| Final structured data parser verification | `node specs/005-public-seo-improvements/evidence/verify-structured-data.mjs --scope=all --base=http://localhost:5173` | Pass: 25/25. Evidence: `specs/005-public-seo-improvements/evidence/structured-data-results.json`. |
| Final typecheck | `npm run typecheck` | Pass. |
| Final public build | `npm run build` | Pass with Vite chunk-size warning for main JS bundle. |

## US1 Verification Notes

- Public dev server used: `npm run dev` on `http://localhost:5173`.
- API was not started for US1. Console and failed network entries in browser evidence are existing API fetch attempts to `http://localhost:3001/api/*` plus blocked external image requests in the local browser environment; route metadata, canonical, robots/indexability, page horizontal scroll, and clipped action checks all passed.
- Sitemap/robots files remain absent by design and are deferred to US3.
- JSON-LD output remains empty by design and is deferred to US4.

## US2 Verification Notes

- Public dev server used: `npm run dev` on `http://localhost:5173`.
- `src/lib/seo.ts` now defines `SocialPreviewProfile` and page-specific social previews for home, about, projects, services, HSE, careers, and contact.
- Project detail social metadata is generated by `projectSocialPreview(project)` using project title, overview, canonical route, and project image when available, with a brand fallback when content is missing.
- Browser evidence confirms Open Graph and Twitter title/description/url/image/type/card fields exist for all checked routes and that social URLs match canonical URLs.
- API was not started for US2. Existing `http://localhost:3001/api/*` fetch failures and external image blocks are recorded in raw evidence and are not caused by social metadata changes.

## US3 Verification Notes

- Sitemap uses the production canonical base URL `https://fortuneconstruction.mw` and does not include localhost or loopback hostnames.
- Sitemap includes only `/`, `/about`, `/projects`, `/services`, `/hse`, `/careers`, and `/contact`.
- Sitemap intentionally does not include dashboard, login, admin, API, private, or management routes.
- Robots allows the public site, references `https://fortuneconstruction.mw/sitemap.xml`, and disallows `/dashboard`, `/login`, `/admin`, `/api`, `/private`, and `/management`.
- No API, dashboard, structured data, or runtime/browser work was changed for US3.

## US4 Verification Notes

- Structured data builders are typed in `src/lib/seo.ts` through `StructuredDataItem`.
- Home emits `Organization` and `HomeAndConstructionBusiness` JSON-LD for `Fortune Construction`.
- Contact emits business JSON-LD plus `ContactPage` using the visible/fallback phone, email, and address shown on the page.
- Services emits business JSON-LD plus three visible `Service` entries: `Roads & Infrastructure`, `Building & Commercial Construction`, and `Bridges & Structural Works`.
- JSON-LD parser checks confirmed `@context: https://schema.org`, expected types, successful JSON parsing, and no localhost URLs.
- API and dashboard source were not changed. Sitemap and robots were not changed during US4.

## Final Verification Notes

- `seo-browser-verification.md` covers metadata, canonical, robots/indexable meta, social metadata, structured data, console/network evidence, horizontal scroll, and action overflow/clipped action status.
- `public/sitemap.xml` contains no dashboard, login, admin, API, private, management, localhost, or loopback entries.
- `public/robots.txt` contains dashboard, login, admin, API, private, and management only as `Disallow` rules.
- `apps/api/src` has no worktree changes from this SEO package.
- `apps/dashboard/src` has pre-existing worktree changes unrelated to this SEO package; they were reviewed as out-of-scope and not modified during Final Phase.
- API tests were not run because no API contracts, request/response assumptions, authentication behavior, or dashboard/API integration contracts changed.
