# SEO Browser Verification: Public SEO Improvements

Scope covered: verification scaffolding and final evidence through T076. Browser checks target metadata/canonical/indexability, Open Graph/Twitter social metadata, rendered JSON-LD structured data, console/network evidence, horizontal scroll, and clipped action status. US3 sitemap/robots are static-file verified.

## Evidence Directory

SEO verification evidence is stored under:

`specs/005-public-seo-improvements/evidence/`

Expected artifacts:

- `seo-static-baseline.json`
- `seo-static-us1-before.json`
- `seo-static-us1-after.json`
- `seo-static-us2-before.json`
- `seo-static-us2-after.json`
- `seo-browser-us1-results.json`
- `seo-browser-us2-results.json`
- `structured-data-us4-before.json`
- `structured-data-us4-after.json`
- `structured-data-browser-results.json`
- `seo-static-results.json`
- `seo-browser-results.json`
- `structured-data-results.json`
- `T037-*.png` screenshots or equivalent browser evidence
- `T045-*.png` screenshots or equivalent browser evidence

## Browser Targets

| Route | Viewports | Required US1 Evidence | Status |
|---|---|---|---|
| `/` | Desktop 1440x1000, Mobile 390x844 | Title, description, canonical, robots/indexable meta, console errors, failed network requests, horizontal scroll, action overflow | Pass |
| `/projects` | Desktop 1440x1000, Mobile 390x844 | Title, description, canonical, robots/indexable meta, console errors, failed network requests, horizontal scroll, action overflow | Pass |
| `/projects/1` | Desktop 1440x1000, Mobile 390x844 | Project-aware title/description/canonical fallback, robots/indexable meta, console/network evidence | Pass |
| `/services` | Desktop 1440x1000, Mobile 390x844 | Title, description, canonical, robots/indexable meta, console/network evidence | Pass |
| `/contact` | Desktop 1440x1000, Mobile 390x844 | Title, description, canonical, robots/indexable meta, console/network evidence | Pass |
| `/about` | Desktop 1440x1000, Mobile 390x844 | Title, description, canonical, robots/indexable meta, console/network evidence | Pass |
| `/hse` | Desktop 1440x1000, Mobile 390x844 | Title, description, canonical, robots/indexable meta, console/network evidence | Pass |
| `/careers` | Desktop 1440x1000, Mobile 390x844 | Title, description, canonical, robots/indexable meta, console/network evidence | Pass |

## Dev Server Requirements

| Service | Needed For | Command | Decision |
|---|---|---|---|
| Public site | US1/US2 browser metadata checks and US4 rendered JSON-LD parser | `npm run dev` | Required for T037, T045, and T064 only. |
| API | Optional public content data | `npm run dev:api` | Not required for US1/US2/US4 metadata verification; fallback project/content data is acceptable. |
| Dashboard | Not applicable | `npm run dev:dashboard` | Must not be run for T001-T064. |

## US1 Browser Results

Command:

```bash
node specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs --base=http://localhost:5173
```

Result: pass, 16/16 route and viewport checks.

Raw evidence:

- `specs/005-public-seo-improvements/evidence/seo-browser-us1-results.json`
- `specs/005-public-seo-improvements/evidence/T037-home-desktop.png`
- `specs/005-public-seo-improvements/evidence/T037-home-mobile.png`
- `specs/005-public-seo-improvements/evidence/T037-projects-desktop.png`
- `specs/005-public-seo-improvements/evidence/T037-projects-mobile.png`
- `specs/005-public-seo-improvements/evidence/T037-projects-1-desktop.png`
- `specs/005-public-seo-improvements/evidence/T037-projects-1-mobile.png`
- `specs/005-public-seo-improvements/evidence/T037-services-desktop.png`
- `specs/005-public-seo-improvements/evidence/T037-services-mobile.png`
- `specs/005-public-seo-improvements/evidence/T037-contact-desktop.png`
- `specs/005-public-seo-improvements/evidence/T037-contact-mobile.png`
- `specs/005-public-seo-improvements/evidence/T037-about-desktop.png`
- `specs/005-public-seo-improvements/evidence/T037-about-mobile.png`
- `specs/005-public-seo-improvements/evidence/T037-hse-desktop.png`
- `specs/005-public-seo-improvements/evidence/T037-hse-mobile.png`
- `specs/005-public-seo-improvements/evidence/T037-careers-desktop.png`
- `specs/005-public-seo-improvements/evidence/T037-careers-mobile.png`

Summary:

| Route | Desktop canonical | Mobile canonical | Metadata | Horizontal scroll | Action overflow | Console/network evidence |
|---|---|---|---|---|---|---|
| `/` | `https://fortuneconstruction.mw/` | `https://fortuneconstruction.mw/` | Pass | No | No | Existing API/offline image failures recorded |
| `/projects` | `https://fortuneconstruction.mw/projects` | `https://fortuneconstruction.mw/projects` | Pass | No | No | Existing API/offline image failures recorded |
| `/projects/1` | `https://fortuneconstruction.mw/projects/1` | `https://fortuneconstruction.mw/projects/1` | Pass | No | No | Existing API/offline image failures recorded |
| `/services` | `https://fortuneconstruction.mw/services` | `https://fortuneconstruction.mw/services` | Pass | No | No | Existing API/offline image failures recorded |
| `/contact` | `https://fortuneconstruction.mw/contact` | `https://fortuneconstruction.mw/contact` | Pass | No | No | Existing API/offline image failures recorded |
| `/about` | `https://fortuneconstruction.mw/about` | `https://fortuneconstruction.mw/about` | Pass | No | No | Existing API/offline image failures recorded |
| `/hse` | `https://fortuneconstruction.mw/hse` | `https://fortuneconstruction.mw/hse` | Pass | No | No | Existing API/offline image failures recorded |
| `/careers` | `https://fortuneconstruction.mw/careers` | `https://fortuneconstruction.mw/careers` | Pass | No | No | Existing API/offline image failures recorded |

Notes:

- The API was not started because T001-T037 only require public SEO metadata verification. Existing public pages still attempt API fetches to `http://localhost:3001/api/*`; those failures are captured in raw evidence and are not caused by SEO metadata changes.
- The helper treats intentionally horizontally scrollable controls as valid when they are inside an accessible horizontal scroll container; page-level horizontal scroll still fails the check.

## US2 Browser Results

Command:

```bash
node specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs --scope=us2 --base=http://localhost:5173
```

Result: pass, 16/16 route and viewport checks.

Raw evidence:

- `specs/005-public-seo-improvements/evidence/seo-browser-us2-results.json`
- `specs/005-public-seo-improvements/evidence/T045-home-desktop.png`
- `specs/005-public-seo-improvements/evidence/T045-home-mobile.png`
- `specs/005-public-seo-improvements/evidence/T045-projects-desktop.png`
- `specs/005-public-seo-improvements/evidence/T045-projects-mobile.png`
- `specs/005-public-seo-improvements/evidence/T045-projects-1-desktop.png`
- `specs/005-public-seo-improvements/evidence/T045-projects-1-mobile.png`
- `specs/005-public-seo-improvements/evidence/T045-services-desktop.png`
- `specs/005-public-seo-improvements/evidence/T045-services-mobile.png`
- `specs/005-public-seo-improvements/evidence/T045-contact-desktop.png`
- `specs/005-public-seo-improvements/evidence/T045-contact-mobile.png`
- `specs/005-public-seo-improvements/evidence/T045-about-desktop.png`
- `specs/005-public-seo-improvements/evidence/T045-about-mobile.png`
- `specs/005-public-seo-improvements/evidence/T045-hse-desktop.png`
- `specs/005-public-seo-improvements/evidence/T045-hse-mobile.png`
- `specs/005-public-seo-improvements/evidence/T045-careers-desktop.png`
- `specs/005-public-seo-improvements/evidence/T045-careers-mobile.png`

Summary:

| Route | OG/Twitter title | OG URL | OG/Twitter image | Result |
|---|---|---|---|---|
| `/` | `Fortune Construction | Malawi Construction & Civil Engineering` | `https://fortuneconstruction.mw/` | `https://fortuneconstruction.mw/Logo-new-01.png` | Pass |
| `/projects` | `Project Portfolio | Fortune Construction Malawi` | `https://fortuneconstruction.mw/projects` | `https://fortuneconstruction.mw/Logo-new-01.png` | Pass |
| `/projects/1` | `Lilongwe Grand Bridge | Fortune Construction Case Study` | `https://fortuneconstruction.mw/projects/1` | Project cover image | Pass |
| `/services` | `Construction Services | Fortune Construction Malawi` | `https://fortuneconstruction.mw/services` | `https://fortuneconstruction.mw/Logo-new-01.png` | Pass |
| `/contact` | `Contact Fortune Construction | Project Consultation in Malawi` | `https://fortuneconstruction.mw/contact` | `https://fortuneconstruction.mw/Logo-new-01.png` | Pass |
| `/about` | `About Fortune Construction | Building Malawi Since 2006` | `https://fortuneconstruction.mw/about` | `https://fortuneconstruction.mw/Logo-new-01.png` | Pass |
| `/hse` | `Health, Safety & Quality | Fortune Construction` | `https://fortuneconstruction.mw/hse` | `https://fortuneconstruction.mw/Logo-new-01.png` | Pass |
| `/careers` | `Careers | Join Fortune Construction Malawi` | `https://fortuneconstruction.mw/careers` | `https://fortuneconstruction.mw/Logo-new-01.png` | Pass |

Notes:

- US2 checks require `og:title`, `og:description`, `og:url`, `og:image`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image`.
- All checked social URLs match canonical URLs and no social image URL uses localhost.
- API was not started for US2; existing API/offline image failures are captured in raw evidence and are not caused by SEO social metadata changes.

## US4 Structured Data Results

Commands:

```bash
node specs/005-public-seo-improvements/evidence/verify-structured-data.mjs --scope=us4-before
node specs/005-public-seo-improvements/evidence/verify-structured-data.mjs --scope=us4-after
node specs/005-public-seo-improvements/evidence/verify-structured-data.mjs --scope=us4-after --base=http://localhost:5173
```

Result: pass after implementation, 25/25 source and rendered JSON-LD parser checks.

Raw evidence:

- `specs/005-public-seo-improvements/evidence/structured-data-us4-before.json`
- `specs/005-public-seo-improvements/evidence/structured-data-us4-after.json`
- `specs/005-public-seo-improvements/evidence/structured-data-browser-results.json`

Summary:

| Route | JSON-LD types | Known/visible facts used | Result |
|---|---|---|---|
| `/` | `Organization`, `HomeAndConstructionBusiness` | `SITE` name, tagline, URL, logo, phone, email, address, founding year, Malawi service area | Pass |
| `/contact` | `Organization`, `HomeAndConstructionBusiness`, `ContactPage` | Visible/fallback phone, email, address, contact page URL | Pass |
| `/services` | `Organization`, `HomeAndConstructionBusiness`, `Service` | Visible service names and descriptions from the public Services content | Pass |

Notes:

- All JSON-LD scripts parse with `JSON.parse` and use `@context: https://schema.org`.
- No JSON-LD output uses localhost or loopback URLs.
- API was not started for US4; existing API/offline image failures are captured in raw evidence and are not caused by structured data changes.

## Final Browser Results

Commands:

```bash
node specs/005-public-seo-improvements/evidence/verify-seo-browser.mjs --scope=all --base=http://localhost:5173
node specs/005-public-seo-improvements/evidence/verify-structured-data.mjs --scope=all --base=http://localhost:5173
```

Results:

- Browser metadata/social/indexability verification passed: 16/16 route and viewport checks.
- Structured data parser verification passed: 25/25 source and rendered JSON-LD checks.
- Raw evidence:
  - `specs/005-public-seo-improvements/evidence/seo-browser-results.json`
  - `specs/005-public-seo-improvements/evidence/structured-data-results.json`
  - `specs/005-public-seo-improvements/evidence/structured-data-browser-results.json`
  - `specs/005-public-seo-improvements/evidence/T066-*.png`

Final coverage:

| Evidence area | Status | Notes |
|---|---|---|
| Title and meta description | Pass | Present for all checked public routes. |
| Canonical URLs | Pass | Use `https://fortuneconstruction.mw`, no localhost. |
| Robots/indexable meta | Pass | `index,follow` present for checked public routes. |
| Open Graph/Twitter | Pass | Required OG/Twitter title, description, URL, image, type/card present. |
| Structured data | Pass | Home, contact, and services JSON-LD parse successfully. |
| Console errors | Recorded | Existing API-off/external media failures captured in raw evidence. |
| Failed network requests | Recorded | Existing API-off/external media failures captured in raw evidence. |
| Horizontal scroll | Pass | No page-level horizontal scroll in final browser checks. |
| Clipped action status | Pass | No action overflow in final browser checks. |
