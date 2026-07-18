# Feature Specification: Production Deployment Readiness

**Feature Branch**: `[007-production-readiness]`  
**Created**: 2026-07-17  
**Status**: Draft  
**Input**: User description: "أريد تنفيذ حزمة جاهزية النشر والإنتاج للمشروع. المطلوب مراجعة وإصلاح إعدادات deployment وproduction readiness بدون كسر الموقع أو الداشبورد أو الـ API، مع التركيز على env vars المطلوبة، production base URLs، CORS production origins، JWT_SECRET، MongoDB connection، upload storage strategy، Vercel/build settings، domain fortuneconstruction.mw، وعدم تسريب secrets أو استخدام localhost في production. المطلوب تقرير واضح بما هو جاهز وما يحتاج إعداد خارجي، مع فحوصات build/typecheck/tests المناسبة."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Production Configuration Inventory (Priority: P1)

As a project owner preparing Fortune Construction for production, I need a complete inventory of required deployment configuration so that website, dashboard, and API environments can be configured without guessing or leaking sensitive values.

**Why this priority**: Production readiness depends first on knowing every required environment variable, domain, secret, database setting, upload/storage requirement, and hosting setting. This is the MVP because later fixes must be based on a verified deployment checklist.

**Independent Test**: Can be tested by reviewing a production readiness report that lists all required public, dashboard, and API configuration items, marks each item as ready, missing, unsafe, or externally required, and contains no secret values.

**Acceptance Scenarios**:

1. **Given** the current repository configuration, **When** the production readiness inventory is completed, **Then** it lists required environment variables for the public site, dashboard, API, authentication, database, uploads, and production base URLs.
2. **Given** a configuration value is sensitive, **When** it appears in documentation or logs, **Then** the value is redacted and only the variable name, required status, and validation expectation are shown.
3. **Given** a production-only setting depends on external hosting or infrastructure, **When** it is reviewed, **Then** the report clearly marks it as an external setup requirement rather than pretending it is complete in code.

---

### User Story 2 - Production URL and Origin Safety (Priority: P1)

As a site visitor or dashboard user on the production domain, I need public, dashboard, and API URLs to use production-safe origins so the deployed apps do not point to localhost or unapproved origins.

**Why this priority**: Production base URLs and CORS origins are frequent deployment breakpoints. Incorrect values can break API communication, expose services to unwanted origins, or leak local development assumptions into production.

**Independent Test**: Can be tested by inspecting configuration, generated build output where applicable, and readiness documentation to confirm production URLs use `fortuneconstruction.mw` or approved deployment origins and do not use localhost as a production value.

**Acceptance Scenarios**:

1. **Given** production configuration is reviewed, **When** public site and dashboard API base URL settings are checked, **Then** production-facing values do not use `localhost`, `127.0.0.1`, or development-only hosts.
2. **Given** API CORS configuration is reviewed, **When** production origins are evaluated, **Then** only approved website and dashboard origins are allowed and unapproved origins are rejected or documented as unsafe.
3. **Given** local development remains supported, **When** development configuration is checked, **Then** local origins are allowed only for non-production environments and are not documented as production defaults.

---

### User Story 3 - API Runtime Security Readiness (Priority: P1)

As a maintainer deploying the API, I need authentication, database, logging, and startup safety checks to fail closed in production so the API cannot run with weak secrets, unsafe database targets, or sensitive output.

**Why this priority**: The API controls protected dashboard operations, uploads, and data access. Production readiness is not acceptable unless JWT, MongoDB, and sensitive logging behavior are safe before deployment.

**Independent Test**: Can be tested with API configuration/static checks and API tests that verify required secrets, MongoDB connection behavior, sensitive-value redaction, and safe startup failure modes without exposing secret values.

**Acceptance Scenarios**:

1. **Given** `JWT_SECRET` is missing, blank, placeholder-like, or unsafe in a production-like environment, **When** the API configuration is validated, **Then** startup or protected auth behavior fails closed with a non-sensitive error.
2. **Given** MongoDB connection settings are reviewed, **When** production readiness is assessed, **Then** required database configuration is documented and remote/production database usage is never assumed safe for local checks without explicit approval.
3. **Given** API logs or client error responses are inspected, **When** startup, auth, database, or upload errors occur, **Then** no DB URI, credentials, JWT secret, stack trace, or default login credentials are exposed.

---

### User Story 4 - Upload Storage and Persistence Strategy (Priority: P2)

As a deployment owner, I need a clear upload storage strategy for images, videos, and CV files so uploaded content remains available after production deployments and server restarts.

**Why this priority**: Local filesystem uploads may work in development but can be unsafe or non-persistent in serverless or ephemeral production hosting. The strategy must be clear before production launch.

**Independent Test**: Can be tested by reviewing upload configuration, deployment hosting assumptions, and a readiness report that marks current upload behavior as ready only if persistence, size limits, file type validation, and access URLs are safe for production.

**Acceptance Scenarios**:

1. **Given** the current upload system is reviewed, **When** deployment readiness is assessed, **Then** images, videos, and CV uploads have documented validation, storage, public access, retention, and cleanup expectations.
2. **Given** production hosting uses ephemeral or serverless storage, **When** upload readiness is evaluated, **Then** the report marks persistent object storage or equivalent external setup as required before production use.
3. **Given** dashboard CV links and public media URLs are checked, **When** production URL behavior is reviewed, **Then** generated URLs do not rely on localhost or development-only API origins.

---

### User Story 5 - Deployment Verification Report (Priority: P2)

As a project owner deciding whether to launch, I need a clear final readiness report showing what is ready, what was fixed, what remains blocked by external setup, and which verification commands passed.

**Why this priority**: Production launch decisions need an explicit go/no-go picture. The report prevents hidden assumptions and makes external setup work visible.

**Independent Test**: Can be tested by reading the final deployment readiness report and verifying it includes build/typecheck/test results, local/runtime limits, external setup requirements, production domain readiness, and deferred follow-ups.

**Acceptance Scenarios**:

1. **Given** the package is complete, **When** the readiness report is reviewed, **Then** it separates ready items, fixed items, blocked external items, deferred follow-ups, and verification evidence.
2. **Given** build and test commands are run, **When** results are recorded, **Then** each command has status, date, scope, and failure/blocking notes where applicable.
3. **Given** a production deployment cannot be fully verified locally, **When** the report is finalized, **Then** it clearly states the missing external inputs or hosting actions required before launch.

### Edge Cases

- Production env vars may be absent locally; checks must report missing names and expected properties without printing real values.
- Existing local development workflows must keep working unless a setting is explicitly production-only.
- `localhost`, `127.0.0.1`, and development ports may appear in development docs or local examples, but must not be production defaults, production canonical URLs, production CORS origins, or production API base URLs.
- MongoDB checks must not connect to a production or remote database during local verification unless an explicit safe approval flag is present.
- Vercel or hosting settings may require dashboard-side configuration that cannot be completed in code; these must be marked as external setup requirements.
- File uploads may pass validation locally but still be production-unsafe if persistence, cleanup, or public URL strategy is not production-ready.
- Build artifacts may contain generated hashes or route chunks; verification should focus on production URL safety, successful builds, and absence of secret leakage rather than exact hash stability.
- Secrets or credentials found in local files, logs, or examples must be redacted in all reports.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST produce a production readiness inventory covering public site, dashboard, API, environment variables, domains, CORS origins, authentication secrets, database connection, uploads, build settings, and hosting requirements.
- **FR-002**: The inventory MUST classify each production readiness item as ready, needs code fix, needs external setup, blocked, deferred, or not applicable.
- **FR-003**: Production-facing configuration MUST NOT use `localhost`, `127.0.0.1`, development-only ports, or placeholder domains as production base URLs, API URLs, canonical URLs, CORS origins, upload URLs, or deployment references.
- **FR-004**: The production domain `fortuneconstruction.mw` and any required website/dashboard/API subdomains or deployment origins MUST be documented with expected purpose and setup status.
- **FR-005**: Required environment variables MUST be documented by name, owner surface, required environments, safe validation rule, and whether they are public or secret.
- **FR-006**: Secret values MUST NOT be printed, committed, copied into reports, included in screenshots, or exposed in build/test logs; reports may include only redacted presence/absence and validation status.
- **FR-007**: API authentication readiness MUST require a safe `JWT_SECRET` in production and MUST fail closed for missing, blank, placeholder-like, or unsafe secrets.
- **FR-008**: API CORS readiness MUST allow only approved production website and dashboard origins in production while keeping local development origins scoped to non-production environments.
- **FR-009**: MongoDB readiness MUST document required connection settings and MUST prevent accidental local verification against remote/production databases unless explicitly approved by a safe environment flag.
- **FR-010**: API logs and client responses MUST avoid exposing DB URIs, credentials, JWT secrets, default login credentials, stack traces, or raw internal configuration values.
- **FR-011**: Upload readiness MUST cover image, video, and CV storage persistence, validation limits, sanitized filenames, public/private access expectations, cleanup behavior, and production URL generation.
- **FR-012**: If current upload storage is local filesystem or otherwise ephemeral for production hosting, the package MUST mark persistent storage as an external setup requirement or deferred production blocker.
- **FR-013**: Vercel or hosting readiness MUST document required build commands, output directories, environment variables, domain bindings, rewrite/proxy expectations, and any API hosting limitations.
- **FR-014**: The implementation MUST preserve existing public site, dashboard, and API contracts, including routes, API endpoints, request/response shapes, dashboard management flows, SEO outputs, `Project.category` as a string contract, and Success Stories through Page Content.
- **FR-015**: Verification MUST include root typecheck, public build, dashboard build when dashboard deployment assumptions are touched, API build/tests when API configuration or runtime behavior is touched, and static checks for production URL/secret leakage.
- **FR-016**: The final report MUST include command results, readiness matrix, blocked external setup, deferred follow-ups, production domain status, and evidence that secrets are not disclosed.

### Key Entities *(include if feature involves data)*

- **Environment Variable Requirement**: A named configuration item with owner surface, environment scope, public/secret classification, validation rule, default policy, and readiness status.
- **Production Origin**: An approved website, dashboard, or API origin used for production routing, CORS, canonical URLs, upload URLs, or deployment settings.
- **Deployment Target**: A deployable surface such as public site, dashboard, API service, database, upload storage, or domain binding with build and runtime requirements.
- **Secret Readiness Check**: A validation record proving a sensitive setting is present, safe, and redacted without exposing its value.
- **Database Readiness Check**: A validation record for MongoDB configuration, safe startup behavior, local/remote restrictions, and connection risk status.
- **Upload Storage Strategy**: A documented plan for storing, serving, validating, and retaining uploaded images, videos, and CV files in production.
- **Readiness Report**: A launch decision artifact containing ready/fixed/blocked/deferred status, verification evidence, and external setup actions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of required production environment variables are documented with readiness status and no secret values exposed.
- **SC-002**: Static production URL checks find zero production-facing `localhost`, `127.0.0.1`, development-port, or placeholder-domain values.
- **SC-003**: CORS readiness evidence confirms only approved production website and dashboard origins are allowed in production.
- **SC-004**: JWT readiness evidence confirms unsafe missing, blank, or placeholder secrets fail closed without sensitive output.
- **SC-005**: MongoDB readiness evidence confirms production/remote database access cannot happen accidentally during local verification.
- **SC-006**: Upload readiness evidence covers images, videos, and CV files and clearly identifies whether current storage is production-ready or requires external persistent storage.
- **SC-007**: Build/typecheck/test verification completes for every touched surface, or blocked commands are documented with exact non-secret reason.
- **SC-008**: Final readiness report contains a clear launch status for public site, dashboard, API, database, uploads, domain, and hosting settings.
- **SC-009**: Compatibility review confirms no public route, dashboard route, API contract, SEO output, `Project.category` contract, or Success Stories management path was broken.

## Assumptions

- `fortuneconstruction.mw` is the intended production domain for the public website unless later deployment planning explicitly defines subdomains or alternate origins.
- Production dashboard and API origins may require external hosting/domain configuration; the spec should document expected values and setup status rather than inventing secrets or managed-service details.
- Existing local development URLs remain valid for development only and must be separated from production defaults.
- Vercel/build settings may cover the public site and dashboard, while API hosting may require a compatible server/runtime target or external service if serverless limitations apply.
- Upload files may currently be stored locally; production readiness must treat non-persistent hosting storage as a risk until an external persistent storage strategy is confirmed.
- Verification can use local static checks, tests, typecheck, and builds; live production deployment verification is not required in this spec.
