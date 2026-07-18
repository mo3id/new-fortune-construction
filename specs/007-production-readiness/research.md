# Research: Production Deployment Readiness

## Decision 1: Treat `fortuneconstruction.mw` as the public production canonical domain

- **Decision**: Use `https://fortuneconstruction.mw` as the public site production base URL in readiness checks and documentation.
- **Rationale**: The existing SEO package already emits sitemap, robots, and canonical fallback values for `https://fortuneconstruction.mw`.
- **Alternatives considered**: Using localhost or Vercel preview URLs as production defaults was rejected because production-facing outputs must not rely on development or transient hosts.

## Decision 2: Require explicit production API and dashboard origins

- **Decision**: Production readiness must require explicit values for public API base URL, dashboard API base URL, API `PUBLIC_SITE_ORIGIN`, and API `DASHBOARD_ORIGIN`.
- **Rationale**: Current clients fall back to `http://localhost:3001`, which is convenient for development but unsafe as a production fallback.
- **Alternatives considered**: Keeping localhost fallback for all environments was rejected for production because it can silently produce broken deployed builds.

## Decision 3: Preserve local development fallbacks while adding production guards

- **Decision**: Later implementation should preserve local development localhost behavior only for non-production environments.
- **Rationale**: Existing dev workflows rely on ports 5173, 5174, and 3001. Production safety can be improved without breaking local work by gating fallback behavior by environment or build mode.
- **Alternatives considered**: Removing all localhost defaults was rejected because it would make local setup more brittle.

## Decision 4: Keep JWT fail-closed policy and extend production readiness evidence

- **Decision**: Keep existing `getRequiredJwtSecret` fail-closed behavior and include production readiness tests/evidence that missing, blank, placeholder-like, or unsafe secrets fail without sensitive output.
- **Rationale**: API auth route and middleware already distinguish auth configuration errors from invalid tokens.
- **Alternatives considered**: Adding a fallback secret was rejected because previous security work intentionally removed fallback signing secrets.

## Decision 5: Keep remote MongoDB local-safe rules

- **Decision**: Production readiness should document and test the existing rule: remote MongoDB is allowed in `production` or with explicit `ALLOW_REMOTE_DB=true`, but skipped in local/test/development otherwise.
- **Rationale**: This avoids accidental local verification against production data.
- **Alternatives considered**: Always connecting to configured `MONGODB_URI` was rejected because it risks touching production/remote databases from local development.

## Decision 6: Mark local filesystem uploads as not production-complete for ephemeral hosting

- **Decision**: Current local filesystem upload storage should be marked as needing external persistent storage or a durable hosting target before production launch.
- **Rationale**: API uploads currently write to `apps/api/uploads/*` and are served through `/uploads`; this can be lost or unsupported on serverless/ephemeral deployments.
- **Alternatives considered**: Treating local filesystem as production-ready was rejected unless the selected API host guarantees persistent writable storage.

## Decision 7: Vercel config is sufficient for SPA rewrites but not full production readiness

- **Decision**: Existing `vercel.json` files cover SPA route rewrites only. Production readiness must document external Vercel project settings, env vars, domain binding, and API hosting separately.
- **Rationale**: Code contains no explicit Vercel build/output/env/domain config beyond rewrites.
- **Alternatives considered**: Assuming Vercel dashboard settings are already complete was rejected because the repository cannot verify them.

## Decision 8: Redact env values and secrets in all reports

- **Decision**: Reports may list env variable names and readiness state, but must never include actual local `.env` values, tokens, database URIs, JWT secrets, or credentials.
- **Rationale**: User explicitly requires no secret disclosure; local `.env` and `.vercel/.env.production.local` may contain sensitive values.
- **Alternatives considered**: Copying sanitized example values into the report is acceptable only for placeholders and non-secret expected formats.
