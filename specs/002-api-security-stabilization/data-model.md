# Data Model: API Security Stabilization

## Local Runtime Configuration

Represents the safe settings required to start the API and verify health locally.

**Fields**

- `port`: API port, defaulting to the existing local API port.
- `nodeEnv`: Runtime environment label.
- `databaseMode`: One of `remote`, `local`, `memory`, or `unavailable`.
- `databaseConfigured`: Whether an explicit database setting exists.
- `jwtSecretStatus`: One of `configured`, `missing`, `blank`, or `unsafe`.
- `allowedOrigins`: Public site and dashboard browser origins.
- `uploadLimits`: Per-category file size limits.

**Validation Rules**

- `jwtSecretStatus` must be `configured` before signing or verifying tokens.
- Remote database settings must never be required for local health verification.
- Complete sensitive values must not be exposed in logs, health responses, or errors.

## Health Status

Represents the local readiness result exposed to maintainers.

**Fields**

- `status`: `ok`, `degraded`, or `unavailable`.
- `timestamp`: Current server timestamp.
- `services.api`: Process readiness.
- `services.database`: Database readiness category.
- `mode`: Non-sensitive runtime mode summary.

**Validation Rules**

- Health response must not include DB URI, credentials, token secrets, or filesystem internals.
- Health should remain reachable without a browser origin.

## Approved Origin Policy

Represents the browser-origin allowlist for credentialed API access.

**Fields**

- `origin`: Exact allowed browser origin.
- `label`: `public-site`, `dashboard`, or `local-tooling`.
- `source`: `environment`, `default-local`, or `documented-production`.

**Validation Rules**

- Browser requests with an unapproved `Origin` must be rejected.
- Requests without `Origin` are allowed only as intentional non-browser checks, not as implicit wildcard browser access.

## Authentication Signing Policy

Represents the rule for token signing and verification safety.

**Fields**

- `secretPresent`: Boolean.
- `secretUnsafe`: Boolean.
- `expiresIn`: Token lifetime value.
- `failureMessage`: Non-sensitive operator guidance.

**Validation Rules**

- Missing, blank, or known unsafe fallback secret values fail closed.
- Client-facing errors must not reveal the expected secret value or configuration source.

## Upload Submission

Represents a file submitted through public application or authenticated media upload flows.

**Fields**

- `category`: `image`, `video`, or `cv`.
- `fieldName`: Existing multipart field name.
- `originalName`: Original client filename.
- `storedName`: Sanitized generated filename.
- `mimeType`: Client-provided MIME type.
- `extension`: Normalized filename extension.
- `sizeBytes`: Uploaded file size.
- `status`: `accepted` or `rejected`.

**Validation Rules**

- Image uploads allow only approved image MIME/extension pairs.
- Video uploads allow only approved video MIME/extension pairs.
- CV uploads allow only approved document MIME/extension pairs.
- Invalid uploads return consistent non-sensitive validation errors.
- Valid upload success response shapes remain compatible with current clients.

## Validation Error

Represents client-facing invalid-input feedback.

**Fields**

- `message`: Stable user-understandable summary.
- `code`: Stable machine-readable validation code.
- `details`: Optional field-level issue summaries safe for clients.

**Validation Rules**

- Must not include stack traces, raw schema internals, database details, or secrets.
- Must use appropriate client error status for invalid input.

## Operational Error

Represents internal failure handling for logs and async route failures.

**Fields**

- `category`: `configuration`, `database`, `validation`, `upload`, `auth`, or `unexpected`.
- `safeMessage`: Non-sensitive log/response message.
- `correlationHint`: Optional request/time hint without secrets.

**Validation Rules**

- Logs may include failure category and remediation direction.
- Logs must not include full DB URI, token secret, credentials, or uploaded file contents.
