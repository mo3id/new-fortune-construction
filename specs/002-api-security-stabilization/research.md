# Research: API Security Stabilization

## Decision: Safe Local Startup And Health

**Decision**: Keep local startup independent from production credentials. The API should use an explicit local mode and report `/health` with operational, degraded, or unavailable readiness. Local health probes must work without a browser `Origin` header.

**Rationale**: The previous audit showed API runtime instability and the need to avoid accidental production DB usage. A health endpoint that reports readiness without leaking internals lets maintainers verify the backend before checking website or dashboard flows.

**Alternatives considered**:

- Require remote database access for local verification. Rejected because it couples developer safety checks to production-like secrets.
- Return only a static health response. Rejected because it hides DB readiness failures that affect real API behavior.

## Decision: Mandatory JWT Secret

**Decision**: Centralize authentication signing configuration and reject missing, blank, or known unsafe fallback values before token signing or verification.

**Rationale**: The current auth route and middleware sign/verify with an unsafe fallback. Centralizing this rule prevents drift and supports deterministic tests.

**Alternatives considered**:

- Keep fallback only in development. Rejected because it normalizes weak local tokens and can leak into deployed environments.
- Validate only at login. Rejected because token verification paths must fail closed too.

## Decision: Allowlist CORS

**Decision**: Replace permissive origin reflection with an allowlist that includes local and configured public site/dashboard origins. Requests with no `Origin` should be intentionally allowed only for non-browser probes such as local health checks or server-to-server tools.

**Rationale**: Credentialed CORS with arbitrary origins is a high-risk exposure. The public site and dashboard are the intended browser clients, so the policy should be explicit and testable.

**Alternatives considered**:

- Disable CORS entirely. Rejected because browser clients need API access.
- Allow every localhost port. Rejected because it weakens local testing and can hide origin mistakes.

## Decision: Redacted DB Logging

**Decision**: Log connection mode and failure category, not complete database URIs or credentials. If a host label is useful, use a sanitized descriptor rather than the raw URI.

**Rationale**: DB URIs often contain usernames, passwords, hosts, and database names. Logs are copied into support channels and CI output, so redaction must be automatic.

**Alternatives considered**:

- Print full URI only in development. Rejected because local logs can still be shared or committed accidentally.
- Suppress all DB errors. Rejected because maintainers still need actionable troubleshooting signals.

## Decision: Upload Validation

**Decision**: Validate uploads by category using both MIME type and filename extension, enforce existing size limits unless a route-specific limit is already stricter, sanitize stored filenames, and preserve current success response shapes.

**Rationale**: Existing image/video upload checks rely on extension only, and CV upload lacks file type filtering. Stronger validation reduces risk while keeping website and dashboard clients compatible.

**Alternatives considered**:

- Add deep binary signature inspection in the first package. Deferred because it may add dependencies and broader compatibility testing; MIME plus extension is the first baseline.
- Change upload response shape. Rejected because dashboard and public clients may already depend on current `url`, `type`, `message`, and `id` shapes.

## Decision: Route Validation Baseline

**Decision**: Introduce reusable request validation helpers with Zod schemas and apply them first to authentication login, public application submit, application status updates, and upload-adjacent validation paths. Document deferred route conversions.

**Rationale**: The constitution requires contract-driven API validation. Converting representative high-risk routes first provides immediate value without expanding the initial repair package too far.

**Alternatives considered**:

- Convert every API route in one package. Rejected because it increases regression risk and task size.
- Keep inline manual checks only. Rejected because it perpetuates inconsistent validation behavior.

## Decision: Async Error Handling

**Decision**: Add a reusable async route wrapper and centralized error response middleware. Unexpected failures should return consistent non-sensitive responses and keep the process available.

**Rationale**: Several route handlers currently rely on implicit promise rejection behavior. A shared wrapper makes future route work safer and makes error behavior testable.

**Alternatives considered**:

- Wrap each route manually with repeated try/catch. Rejected because it is noisy and easy to apply inconsistently.
- Replace the framework. Rejected as far outside this first repair package.
