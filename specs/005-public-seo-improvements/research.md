# Research: Public SEO Improvements

## Decision: Use a local typed SEO head component instead of adding a dependency

**Rationale**: The public app is a Vite SPA with React Router and no current head-management library. A small typed `SeoHead` component plus helpers can update `document.title`, meta tags, canonical links, social metadata, and JSON-LD without adding dependency risk or changing routing architecture.

**Alternatives considered**:

- Add `react-helmet-async`: viable, but unnecessary dependency churn for a focused package.
- Server-side rendering or prerendering: better crawler support long term, but too broad for this package and not required by the requested scope.

## Decision: Use configurable canonical base URL with a non-localhost production fallback

**Rationale**: Canonical URLs must not emit localhost as production URLs. Use a public site URL configuration value when provided, and document a stable production fallback such as `https://fortuneconstruction.mw` until deployment configuration provides the final domain.

**Alternatives considered**:

- Use `window.location.origin`: unsafe because local checks would emit localhost canonical values.
- Hardcode every canonical URL: harder to maintain and more error-prone when routes are added.

## Decision: Add an indexable `/services` route as a thin public page

**Rationale**: The current app exposes services only as a home section and footer anchor (`/#services`), but the feature requires services page indexability. A thin page can reuse existing `Services` content and avoid API or UI contract changes.

**Alternatives considered**:

- Keep only `/#services`: not ideal for independent page metadata, canonical URLs, sitemap inclusion, or service-specific social previews.
- Build a broad new services experience: unnecessary redesign and outside the package scope.

## Decision: Use static `public/sitemap.xml` and `public/robots.txt`

**Rationale**: Vite serves `public/` files directly and the current route set is small enough for static discovery files. Static files are easy to inspect in verification and do not require runtime services.

**Alternatives considered**:

- Generate sitemap at build time: useful later for dynamic project URLs, but requires extra scripts and configuration.
- Fetch projects from API to build sitemap: risks network/environment coupling and is unnecessary for this first SEO package.

## Decision: Structured data should describe known business facts only

**Rationale**: Structured data must not invent unavailable facts. Use organization/local business construction context, public URL, logo, contact details from known site constants or visible fallback content, and page-specific service/contact context where accurate.

**Alternatives considered**:

- Emit detailed project structured data for every project: useful later, but depends on API data quality and stable canonical project URLs.
- Emit broad rich-result markup with inferred ratings/offers: rejected because not visible or verified in current content.

## Decision: Verification uses static and browser-rendered evidence

**Rationale**: This is a SPA, so browser-rendered head output is the meaningful acceptance target. Static checks still catch sitemap/robots and source coverage. Browser checks also prove no console/network regressions and no visible UI breakage.

**Alternatives considered**:

- Static HTML-only validation: insufficient because route metadata is rendered client-side.
- Production-only validation: unnecessary and slower; local browser verification is enough for implementation acceptance.
