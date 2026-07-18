# SEO Verification Contract

This contract defines the outputs that implementation must prove for the public SEO package.

## Public Route Targets

| Target | Required SEO Checks |
|--------|---------------------|
| `/` | Title, description, canonical URL, robots/indexable meta, social metadata, organization structured data |
| `/about` | Page-specific title, description, canonical URL, social metadata |
| `/projects` | Portfolio title, description, canonical URL, social metadata, indexable status |
| `/projects/:id` | Project-specific or safe fallback title, description, canonical URL, social metadata |
| `/services` | Services title, description, canonical URL, social metadata, service/business structured context |
| `/hse` | HSE title, description, canonical URL, social metadata |
| `/careers` | Careers title, description, canonical URL, social metadata |
| `/contact` | Contact title, description, canonical URL, social metadata, contact/business structured context |

## Crawler File Targets

| Target | Required Checks |
|--------|-----------------|
| `/sitemap.xml` | Includes required public routes; excludes dashboard, login, admin, API, and private management routes; uses configured non-localhost base URL |
| `/robots.txt` | References sitemap; allows public site; disallows dashboard/login/admin/private management surfaces |

## Required Evidence Per Browser-Checked Route

- Loaded URL and HTTP status.
- Viewport for desktop and mobile checks.
- `document.title`.
- Meta description.
- Canonical link.
- Robots/indexability signal.
- Open Graph title, description, URL, image, and type.
- Twitter card, title, description, and image.
- Parsed JSON-LD summary when expected.
- Console error summary.
- Failed network request summary.
- Page-level horizontal scroll status.
- Visible overlap or clipped primary action status.

## Pass Criteria

1. Every required public route has unique page-appropriate title and description.
2. Every indexable public route has exactly one canonical URL and it does not use localhost for production-facing output.
3. Social metadata exists and matches the route purpose.
4. Sitemap and robots files include public discovery and exclude private/dashboard surfaces.
5. Structured data parses as JSON and contains only known/visible business facts.
6. Browser checks show no new console errors, no new UI-caused failed network requests, no page-level horizontal scroll, and no clipped primary actions.
7. API endpoints, request payloads, response shapes, auth behavior, and dashboard routes remain unchanged.

## Failure Handling

- Missing title, description, canonical URL, or sitemap/robots output is P1 and blocks final acceptance.
- Missing social image fallback or incomplete structured data is P2 unless it makes output invalid.
- External image/API failures that match an existing documented public baseline can be deferred if page content and SEO output remain valid.
