# Research: Comprehensive Project Audit

## Decisions

### Decision: Treat the audit as documentation-first

**Rationale**: The feature request asks for identifying issues and producing a prioritized report, not applying fixes. Keeping the first phase read-only prevents accidental behavior changes and lets remediation be planned from verified findings.

**Alternatives considered**:
- Fix issues during audit: rejected because it mixes discovery with remediation and can hide the original evidence.
- Create automated tooling first: rejected because the fastest value is a human-readable priority report; automation can follow once recurring checks are known.

### Decision: Use local commands before external services

**Rationale**: The repository already exposes root, dashboard, and API commands. Local verification provides reproducible evidence and avoids requiring production access.

**Alternatives considered**:
- Start with deployed URLs: useful if available, but not required and may hide source/build problems.
- Use only static review: insufficient for runtime, routing, console, and API integration findings.

### Decision: Redact sensitive values and report only locations

**Rationale**: `.env` files and local database data are present. The report must identify risky configuration without leaking credentials, tokens, personal data, or database content.

**Alternatives considered**:
- Include full environment dumps: rejected for security.
- Ignore environment files: rejected because missing or mismatched configuration is central to integration failures.

### Decision: Classify findings by surface, category, severity, confidence, and priority

**Rationale**: The user asked for a clear priority report across many domains. A consistent taxonomy prevents a long flat bug list from becoming hard to act on.

**Alternatives considered**:
- Group only by file path: useful for engineering but weak for stakeholder prioritization.
- Group only by severity: hides which surface owns the fix.

## Verification Commands to Consider

- `npm run typecheck`
- `npm run build`
- `npm run build --workspace=apps/dashboard`
- `npm run build --workspace=apps/api`
- `npm run dev`
- `npm run dev:dashboard`
- `npm run dev:api`
- `npm run dev:all`

Commands that start services should be run only during implementation of audit tasks, with logs captured and sessions stopped cleanly.

## Project Observations

- Public site uses root `src/` with React, Vite, route/page components, and `src/lib/apiClient.ts`.
- Dashboard uses `apps/dashboard` with React, Vite, Axios API client, auth helper, and admin pages.
- API uses `apps/api` with Express, Helmet, CORS, rate limiting, Mongoose models, auth middleware, upload handling, and route groups under `/api/*`.
- Root package uses npm workspaces for `apps/*` and `packages/*`.
- Local generated artifacts and database data are present and should be reviewed as deployment/security risks without modifying or exposing content.
- Git metadata is present on disk, but `git` currently reports the workspace as not a valid repository. Treat Git-dependent checks as blocked until repaired.

## Open Risks

- Runtime API checks may require MongoDB startup, existing `.env` configuration, or fallback in-memory database behavior.
- Dashboard authentication flows may require known credentials or seeded admin data.
- Browser verification may reveal issues not visible from static review.
- Network-restricted dependency or vulnerability checks may be blocked.
