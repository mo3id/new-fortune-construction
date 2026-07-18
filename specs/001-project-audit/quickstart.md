# Quickstart: Comprehensive Project Audit

## Goal

Run a structured audit and produce a prioritized report without changing production behavior or exposing secrets.

## Preconditions

- Work from repository root: `/Users/mohamedeidali/Desktop/fortune-construction`
- Treat `.env` values, database files, uploads, and tokens as sensitive.
- Record command outputs as summaries; do not paste secrets.
- Stop any dev servers started during verification.

## Suggested Audit Flow

1. Confirm active spec:
   - Read `.specify/feature.json`
   - Confirm it points to `specs/001-project-audit`
2. Inventory surfaces:
   - Public site routes and API calls
   - Dashboard routes and authenticated flows
   - API route groups and models
   - Environment and deployment configuration
3. Run static checks:
   - `npm run typecheck`
   - `npm run build`
   - `npm run build --workspace=apps/dashboard`
   - `npm run build --workspace=apps/api`
4. Run runtime checks if builds permit:
   - `npm run dev:api`
   - `npm run dev`
   - `npm run dev:dashboard`
   - Browser-check important public and dashboard routes
   - Check `/health` and representative `/api/*` endpoints
5. Review quality categories:
   - Integration and API behavior
   - Runtime errors and console logs
   - Code quality and maintainability
   - Performance and bundle/media risks
   - SEO and public-page metadata
   - Security and sensitive configuration
   - UX and accessibility
6. Produce final report:
   - Executive summary
   - Top five fixes
   - Priority matrix
   - Detailed findings with evidence
   - Blocked checks and prerequisites
   - Verification log

## Report Location

Recommended final audit report path:

```text
specs/001-project-audit/audit-report.md
```

## Safety Rules

- Do not commit, deploy, seed, migrate, delete, or modify live data during audit.
- Do not reveal `.env` values or database records.
- Do not run destructive commands.
- If a check requires network or credentials, mark it blocked unless explicit access is provided.
