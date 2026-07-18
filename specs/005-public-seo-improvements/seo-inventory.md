# SEO Inventory: Public SEO Improvements

Final status: Phase 1, Phase 2, US1, US2, US3, US4, and Final Phase are complete for `specs/005-public-seo-improvements`.

## Public Routes

| Route | Source | SEO Output | Final Status |
|-------|--------|------------|--------------|
| `/` | `src/App.tsx` | Title, description, canonical, robots/indexable meta, OG/Twitter metadata, organization/business JSON-LD | Complete |
| `/about` | `src/pages/AboutPage.tsx` | Title, description, canonical, robots/indexable meta, OG/Twitter metadata | Complete |
| `/projects` | `src/pages/ProjectsPage.tsx` | Portfolio title, description, canonical, robots/indexable meta, OG/Twitter metadata | Complete |
| `/projects/:id` | `src/pages/ProjectDetailsPage.tsx` | Project-aware title, description, canonical, robots/indexable meta, OG/Twitter metadata with image fallback | Complete |
| `/services` | `src/pages/ServicesPage.tsx` | Thin services route reusing `src/components/Services.tsx`, title, description, canonical, robots/indexable meta, OG/Twitter metadata, service JSON-LD | Complete |
| `/hse` | `src/pages/HSEPage.tsx` | Title, description, canonical, robots/indexable meta, OG/Twitter metadata | Complete |
| `/careers` | `src/pages/CareersPage.tsx` | Title, description, canonical, robots/indexable meta, OG/Twitter metadata | Complete |
| `/contact` | `src/pages/ContactPage.tsx` | Title, description, canonical, robots/indexable meta, OG/Twitter metadata, contact JSON-LD | Complete |

## Static SEO Files

| File | Output | Final Status |
|------|--------|--------------|
| `index.html` | Safe fallback title and description | Kept |
| `public/sitemap.xml` | Static public route sitemap using `https://fortuneconstruction.mw` | Complete |
| `public/robots.txt` | Allows public site, references sitemap, disallows dashboard/login/admin/API/private/management routes | Complete |

## Verification Evidence

| Artifact | Result |
|---|---|
| `specs/005-public-seo-improvements/evidence/seo-static-results.json` | Pass: 46/46 |
| `specs/005-public-seo-improvements/evidence/seo-browser-results.json` | Pass: 16/16 |
| `specs/005-public-seo-improvements/evidence/structured-data-results.json` | Pass: 25/25 |
| `npm run typecheck` | Pass |
| `npm run build` | Pass with Vite chunk-size warning |

## Guardrails

- API source and contracts were not changed by this SEO package.
- Dashboard source was not changed by this SEO package. The repository already contains unrelated dashboard worktree changes, documented in `quickstart.md`.
- `Project.category` remains a string contract.
- Success Stories management remains outside this SEO package.
- No sitemap or robots output includes private/dashboard/API routes as public sitemap locations.

## Deferred Follow-Ups

- Dynamic project detail URLs in sitemap can be added later after production project slug/ID strategy is confirmed.
- SSR or prerendering can be evaluated later if crawler support for client-rendered metadata becomes insufficient.
- Rich project-specific structured data can be added after project content completeness and schema strategy are audited.
