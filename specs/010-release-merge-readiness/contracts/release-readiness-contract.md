# Release Readiness Contract

This contract defines the observable release gates for publishing the current release candidate to GitHub and preparing a merge into `main`.

## Gate: Working Tree Inventory

**Input**: Current Git working tree.  
**Output**: Non-sensitive classification of all changed paths.

Acceptance:

- Every changed path is classified as include, exclude, defer, owner-confirm, or blocked.
- Real env files, local deployment env files, runtime uploads, temp files, and build artifacts are not classified as include.
- Previous user changes are not reverted.

## Gate: Secret Safety

**Input**: Candidate staged files.  
**Output**: Pass/fail/blocked result with file paths and risk categories only.

Acceptance:

- No `.env`, `.vercel`, local secret, upload, or generated temp path is staged.
- Staged scan does not identify private tokens, database credentials, JWT secrets, private keys, or production env values.
- Reports never include raw secret values.
- Previously exposed collaboration token is confirmed revoked/rotated before merge readiness is declared.

Required no-stage denylist:

- `.env`
- `apps/api/.env`
- `apps/dashboard/.env`
- `.vercel/**`
- `apps/api/uploads/**`
- `*.tsbuildinfo`
- `tmp/**`
- `output/**`
- `frontend-prod.zip`
- `vite.config.ts.timestamp-*`

Required staged-only secret scan risk categories:

- GitHub or platform access tokens
- MongoDB or database connection strings with credentials
- JWT secrets or unsafe fallback secrets
- Private keys/certificates
- Deployment/OIDC/provider tokens
- Real env values in non-example files

Reporting rule:

- Report only path and category, for example `apps/example.ts: database-uri-fixture`.
- Do not print matched values, env values, token text, DB credentials, JWT secrets, or private key material.

## Gate: Verification

**Input**: Release candidate after hygiene staging.  
**Output**: Command results and known warnings.

Required checks:

- `npm run typecheck`
- `npm run build`
- `npm run build --workspace=apps/dashboard`
- `npm run build --workspace=apps/api`
- `npm run test --workspace=apps/api`
- `npm audit`, if network/approval is available

Acceptance:

- Required checks pass, or blocked/deferred checks are documented with owner-visible rationale.
- Existing Vite chunk warnings may be non-blocking if builds pass and the warning was previously documented.

## Gate: Publish

**Input**: Verified commit on the current release branch.  
**Output**: Branch pushed to `newrepo`.

Acceptance:

- Target remote is confirmed as `mo3id/new-fortune-construction`.
- Push does not use force unless explicitly approved.
- Authentication failures are reported without exposing tokens.

## Gate: Merge Handoff

**Input**: Pushed release branch.  
**Output**: PR or merge instructions for `main`.

Acceptance:

- Handoff names the source branch, target repository, and target branch.
- Handoff summarizes included packages and verification results.
- Handoff lists unresolved blockers and deferred follow-ups.
- Release is not described as merge-ready while a blocker remains.
