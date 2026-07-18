# Data Model: Public SEO Improvements

## SEO Page Profile

Represents the metadata expected for an indexable public route.

| Field | Description | Validation |
|-------|-------------|------------|
| `routePattern` | Public route or route pattern covered by the profile | Must be one of the supported public routes; no dashboard/private paths |
| `title` | Human-readable browser/search title | Required; unique per page; concise and page-specific |
| `description` | Search/social summary | Required; meaningful page summary; no empty fallback |
| `canonicalPath` | Stable path used to build canonical URL | Required; starts with `/`; excludes query/hash |
| `indexable` | Whether crawlers should index the page | Required; true for public marketing pages |
| `imagePathOrUrl` | Social preview image or brand fallback | Required for social metadata; can use logo fallback |
| `structuredDataTypes` | Structured data categories emitted for the page | Optional; must match visible/known page content |

## Canonical URL

Represents a fully resolved preferred URL.

| Field | Description | Validation |
|-------|-------------|------------|
| `baseUrl` | Configured public site origin | Required; must be HTTPS for production; must not be localhost for production output |
| `path` | Public path | Required; no query/hash; normalized trailing slash policy |
| `href` | Full canonical URL | Required; `baseUrl + path`; unique per indexable route |

## Social Preview Profile

Represents metadata used by social sharing platforms.

| Field | Description | Validation |
|-------|-------------|------------|
| `title` | Social preview title | Required; aligned with page title |
| `description` | Social preview description | Required; aligned with page content |
| `url` | Canonical social URL | Required; matches canonical URL |
| `image` | Social preview image URL | Required; absolute URL or safely resolvable public asset |
| `type` | Social content type | Required; website for general pages, article-like only if later justified |

## Crawler Discovery Files

Represents sitemap and robots outputs.

| Field | Description | Validation |
|-------|-------------|------------|
| `sitemapUrls` | Public URLs exposed to crawlers | Must include required public routes; must exclude dashboard/login/admin/private paths |
| `robotsPolicy` | Crawl allow/disallow rules | Must allow public marketing pages and disallow private/dashboard paths |
| `sitemapReference` | Sitemap URL referenced by robots | Must use configured production base URL |

## Structured Business Data

Represents JSON-LD emitted for construction-company context.

| Field | Description | Validation |
|-------|-------------|------------|
| `type` | Schema category | Organization/local business/construction-related context only |
| `name` | Business name | Required; Fortune Construction |
| `url` | Website canonical URL | Required; matches configured base URL |
| `logo` | Logo URL | Required; resolves to public logo asset |
| `contactPoint` | Phone/email/address context | Optional but must match visible/known site content if present |
| `areaServed` | Geographic service area | Optional; should match visible business positioning |
| `sameAs` | Social profile links | Optional; only include configured non-empty links |

## SEO Verification Record

Represents evidence captured for a checked route or file.

| Field | Description | Validation |
|-------|-------------|------------|
| `target` | Route or file checked | Required |
| `viewport` | Desktop/mobile/static/file check | Required for browser checks; file for sitemap/robots |
| `title` | Observed document title | Required for route checks |
| `description` | Observed meta description | Required for route checks |
| `canonical` | Observed canonical URL | Required for indexable route checks |
| `socialMetadata` | Observed OG/Twitter fields | Required for social checks |
| `structuredData` | Parsed JSON-LD summary | Required when expected for route |
| `consoleErrors` | Browser console errors | Required array |
| `failedNetworkRequests` | Failed network requests | Required array |
| `result` | Pass/fail/deferred | Required with notes |
