# Contract: Production Readiness Report

`production-readiness-report.md` is the required launch decision artifact for this package.

## Redaction Contract

- MUST NOT contain actual values from `.env`, `apps/api/.env`, `apps/dashboard/.env`, `.vercel/.env.production.local`, database URIs, JWT secrets, API tokens, OIDC tokens, credentials, or passwords.
- MAY contain variable names and expected non-secret examples.
- MUST redact any discovered sensitive value as `<redacted>`, `<redacted-secret>`, or `<redacted-uri>`.
- MUST avoid screenshots or logs that include secret values.

## Required Sections

### 1. Summary

Fields:
- Current launch status: `ready`, `not-ready`, or `blocked`.
- Highest priority blockers.
- Code fixes planned or completed.
- External setup required.

### 2. Environment Variable Matrix

Required columns:
- Variable
- Surface
- Required in production
- Secret/public
- Expected validation
- Source evidence
- Status
- Owner

### 3. Production URL and Origin Matrix

Required rows:
- Public site canonical URL.
- Public site API base URL.
- Dashboard app origin.
- Dashboard API base URL.
- API public origin.
- API CORS public site origin.
- API CORS dashboard origin.
- Upload asset URL strategy.

### 4. Security Readiness

Must cover:
- JWT secret policy.
- CORS allowlist.
- Sensitive log/client response redaction.
- No localhost production default evidence.
- No secret exposure evidence.

### 5. MongoDB Readiness

Must cover:
- Required production `MONGODB_URI`.
- Local-safe remote database rule.
- Production database external setup status.
- Redaction evidence.

### 6. Upload Storage Readiness

Must cover:
- Images.
- Videos.
- CV files.
- Current validation limits.
- Current storage path.
- Persistence risk.
- External storage requirement or durable hosting requirement.

### 7. Hosting and Domain Readiness

Must cover:
- Root public site Vercel/build settings.
- Dashboard Vercel/build settings.
- API hosting target status.
- Domain `fortuneconstruction.mw`.
- Any dashboard/API subdomain or deployment origin.
- DNS/domain tasks that must happen outside the repository.

### 8. Verification Log

Required columns:
- Check or command.
- Surface.
- Result.
- Date.
- Evidence summary.
- Notes.

### 9. Blocked External Setup

Must list every item that cannot be completed in code, including:
- Vercel project env vars.
- Domain/DNS binding.
- MongoDB production database.
- Persistent upload storage.
- API production hosting.

### 10. Deferred Follow-ups

Must list non-blocking improvements with rationale.

## Compatibility Contract

The package must preserve:
- Public routes.
- Dashboard routes.
- API endpoint paths.
- API request/response shapes.
- Auth behavior except production-safe config failures.
- SEO outputs.
- `Project.category` as a string contract.
- Success Stories through Page Content.
