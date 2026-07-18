# Feature Specification: Public SEO Improvements

**Feature Branch**: `[005-public-seo-improvements]`  
**Created**: 2026-07-17  
**Status**: Draft  
**Input**: User description: "أريد تنفيذ حزمة تحسين SEO للموقع العام. المطلوب تحسين قابلية الموقع للظهور في محركات البحث بدون كسر الواجهات أو الربط الحالي مع الـ API، مع التركيز على metadata لكل صفحة، canonical URLs، Open Graph/social metadata، sitemap.xml، robots.txt، structured data مناسب لشركة إنشاءات، تحسين عناوين الصفحات والوصف، والتأكد أن صفحات المشاريع والخدمات والتواصل قابلة للفهرسة بشكل صحيح، مع اختبارات أو فحوصات تحقق للـ SEO outputs وعدم وجود console/network regressions."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Page Metadata and Indexability (Priority: P1)

As a prospective client or partner discovering Fortune Construction through search, I need every important public page to expose clear titles, descriptions, canonical URLs, and indexable signals so search engines can understand and rank the site correctly.

**Why this priority**: Search discovery depends first on accurate page-level metadata and indexability. This is the MVP because it improves how all public pages appear in search results without changing the visible product experience.

**Independent Test**: Can be tested by checking each public route's rendered SEO output and verifying that page title, description, canonical URL, and indexability signals match the page purpose without console or network regressions.

**Acceptance Scenarios**:

1. **Given** a visitor or search crawler opens the home page, **When** the page is inspected, **Then** the page exposes a descriptive title, meta description, canonical URL, and indexable status for Fortune Construction.
2. **Given** a visitor or search crawler opens Projects, Services, Careers, About, HSE, or Contact, **When** each page is inspected, **Then** each page has distinct metadata aligned with that page's intent.
3. **Given** a project detail page is opened with a valid project, **When** the page is inspected, **Then** the project has a meaningful title, description, canonical URL, and indexable status based on the project content available to the site.

---

### User Story 2 - Social Sharing Metadata (Priority: P2)

As a marketing or business development user sharing site pages on social channels, I need public pages to produce clear social previews so shared links communicate the correct page, brand, and content context.

**Why this priority**: Social previews affect trust and click-through when the company shares project, service, and contact pages. This builds on page metadata but can be validated independently.

**Independent Test**: Can be tested by inspecting public page social metadata and confirming title, description, canonical share URL, and representative image/content fields are present and page-specific where needed.

**Acceptance Scenarios**:

1. **Given** a public page link is shared, **When** the page's social preview metadata is inspected, **Then** the preview contains a clear title, summary, URL, and appropriate brand or page image.
2. **Given** a project detail page link is shared, **When** social metadata is inspected, **Then** the preview reflects the project rather than only generic site content when project content is available.

---

### User Story 3 - Crawler Discovery Files (Priority: P2)

As a search crawler, I need discoverable sitemap and crawler policy files so important public pages can be found and crawl behavior is explicit.

**Why this priority**: Sitemap and crawler policy files improve discovery and reduce ambiguity for crawlers, especially for project and service pages.

**Independent Test**: Can be tested by requesting the crawler discovery files and verifying they list the expected public URLs, use the correct site base URL, and do not expose dashboard or private management routes.

**Acceptance Scenarios**:

1. **Given** a crawler requests the sitemap, **When** the file is inspected, **Then** it includes the home page and key public pages, including projects, services, and contact.
2. **Given** a crawler requests crawler policy information, **When** the file is inspected, **Then** it allows the public site to be indexed and prevents accidental exposure of dashboard or private routes.

---

### User Story 4 - Construction Business Structured Data (Priority: P3)

As a search engine interpreting the business, I need structured information about Fortune Construction so the site can be understood as a construction company with contact, organization, and service context.

**Why this priority**: Structured data can enhance eligibility for rich search understanding, but it depends on accurate metadata and discovery foundations first.

**Independent Test**: Can be tested by validating structured data output for the organization and key public pages, confirming required fields are present and no invalid or misleading data is emitted.

**Acceptance Scenarios**:

1. **Given** a crawler inspects the home page, **When** structured business data is parsed, **Then** it identifies Fortune Construction as a construction-related organization with appropriate contact and website information.
2. **Given** a crawler inspects a contact or services page, **When** structured data is parsed, **Then** it provides relevant contact or service context without contradicting visible page content.

### Edge Cases

- If API-backed public content is unavailable, SEO output must still provide safe fallback metadata and must not block page rendering.
- If a project does not have complete description or image content, the project page must still expose valid fallback metadata without misleading content.
- If a page includes media hosted externally, missing or blocked media must not break metadata, indexability checks, or page rendering.
- Sitemap and crawler policy files must not include dashboard, login, admin, or private management routes.
- Canonical URLs must remain stable and must not contain transient query parameters, local development hostnames in production-facing outputs, or duplicate path variants.
- SEO improvements must not introduce console errors, new failed network requests, visible UI regressions, or changes to existing API contracts.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The public site MUST expose a unique title and meta description for each core public page: home, projects, project detail, services coverage, about, HSE, careers, and contact.
- **FR-002**: The public site MUST expose canonical URLs for all indexable public pages using a consistent site base URL and stable path format.
- **FR-003**: The public site MUST expose social sharing metadata for public pages, including page title, description, URL, and image or brand fallback where appropriate.
- **FR-004**: Project detail pages MUST expose project-specific SEO metadata when project content is available and safe fallback metadata when it is not.
- **FR-005**: The public site MUST provide a sitemap that includes the home page and key indexable public routes, including projects, services, and contact.
- **FR-006**: The public site MUST provide crawler policy information that permits indexing of public marketing pages and excludes dashboard, login, admin, or other private management surfaces.
- **FR-007**: The public site MUST expose structured data appropriate for a construction company, including organization/business context and contact/service context where accurate.
- **FR-008**: SEO outputs MUST be verifiable through static or browser checks that record metadata, canonical URLs, social metadata, sitemap, crawler policy, structured data, console errors, and failed network requests.
- **FR-009**: SEO improvements MUST NOT change existing API endpoints, request payloads, response shapes, authentication behavior, dashboard behavior, or public API data consumption contracts.
- **FR-010**: SEO improvements MUST NOT remove or reduce existing visible page content, navigation, forms, project filtering, project detail viewing, contact submission, careers application behavior, or dashboard management behavior.
- **FR-011**: The implementation MUST document deferred SEO follow-ups when a desired SEO output depends on missing business content, missing media, or external deployment configuration.
- **FR-012**: Verification MUST confirm that public project, services, and contact pages remain indexable and do not produce new console or network regressions.

### Key Entities *(include if feature involves data)*

- **SEO Page Profile**: Represents the title, description, canonical URL, social preview information, and indexability status for a public page.
- **Canonical URL**: Represents the preferred stable URL for a public page and prevents duplicate indexing from alternate path or query variants.
- **Social Preview Profile**: Represents the metadata used when a page is shared on social platforms, including title, description, URL, and image fallback.
- **Crawler Discovery Files**: Represents sitemap and crawler policy outputs that guide search engine discovery and route inclusion/exclusion.
- **Structured Business Data**: Represents machine-readable business, contact, and service context that matches visible public site content.
- **SEO Verification Record**: Represents evidence captured for each checked route or file, including SEO fields and console/network status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of required public routes have a unique title, description, canonical URL, and indexable status in verification evidence.
- **SC-002**: 100% of required public routes have social metadata with title, description, URL, and image or brand fallback in verification evidence.
- **SC-003**: Sitemap verification includes all required public routes and excludes dashboard, login, admin, and private management routes.
- **SC-004**: Crawler policy verification confirms public marketing pages are allowed and private management routes are excluded or disallowed.
- **SC-005**: Structured data validation confirms required organization/business fields are present and no invalid structured data is emitted for checked pages.
- **SC-006**: SEO verification records zero new console errors and zero new UI-caused failed network requests compared with the existing public-site baseline.
- **SC-007**: Existing public page interactions for projects, project details, careers/application, contact, and navigation remain usable after SEO changes.
- **SC-008**: API contract review confirms no changes to API endpoints, request/response shapes, authentication behavior, or dashboard management flows.

## Assumptions

- The public website domain or production base URL will be configured from existing project settings or a documented deployment default; local development URLs must not be treated as production canonical URLs.
- The dashboard remains out of scope except for ensuring no dashboard or login route is accidentally listed in public SEO discovery files.
- Existing API-backed content remains the source for project and business content; SEO improvements must use safe fallbacks when API data is unavailable.
- Services coverage may be represented by the existing public services section or route structure available in the current site; the package should not create new public pages unless a later plan proves they already exist or are required.
- Structured data should describe only information that is visible, known, or safely configured for Fortune Construction.
- Verification can use static checks, browser checks, generated output inspection, and file inspection; it does not require a live production deployment.
