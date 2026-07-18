# Quickstart: Release Merge Readiness

Use this checklist after `$speckit tasks` creates executable tasks. Do not run commit, push, or merge steps until the verification gates are complete.

## T001-T045 Status

Release Readiness Gate was executed for T001-T045 only, with approved index-only cleanup for denied tracked files.

- No `git add`, commit, push, PR, or merge was performed.
- No release source files were staged. The only staged entries are deletion-only cleanup entries for denied files.
- `.env`, `apps/api/.env`, `apps/dashboard/.env`, `apps/api/uploads/**`, and `*.tsbuildinfo` were removed from the Git index only; local files remain present and ignored.
- `npm run typecheck`: passed.
- `npm run build`: passed with known public Vite chunk warning over 500 kB.
- `npm run build --workspace=apps/dashboard`: passed.
- `npm run build --workspace=apps/api`: passed.
- `npm run test --workspace=apps/api`: initial sandbox run failed with `listen EPERM 127.0.0.1`; approved rerun outside sandbox passed 80/80.
- `npm audit`: network-approved run completed and found 23 vulnerabilities, including critical/high issues.
- Current release readiness status after T001-T045: blocked.

## 1. Confirm Context

```bash
git branch --show-current
git remote -v
git status --short --branch
```

Expected:

- Branch is `009-interactive-project-map` unless the owner changes the release branch.
- `newrepo` points to `mo3id/new-fortune-construction`.
- Dirty tree is expected until release cleanup is performed.

## 2. Generate Release Tasks

```text
$speckit tasks
```

Tasks should cover:

- Inventory and classification.
- `.gitignore` release hygiene.
- Tracked env untracking without deleting local files.
- Staged-only secret scan.
- Verification commands.
- Commit/push/PR handoff.

## 3. Required Verification Before Commit

```bash
npm run typecheck
npm run build
npm run build --workspace=apps/dashboard
npm run build --workspace=apps/api
npm run test --workspace=apps/api
```

Notes:

- If API tests fail only because the sandbox cannot bind loopback, rerun with explicit approval outside the sandbox.
- `npm audit` ran with network approval and found vulnerabilities; do not run `npm audit fix` without a separate dependency-remediation approval.

## 4. Files That Must Not Be Staged

```text
.env
apps/api/.env
apps/dashboard/.env
.vercel/**
apps/api/uploads/**
*.tsbuildinfo
tmp/**
output/**
frontend-prod.zip
vite.config.ts.timestamp-*
```

## 5. Safe Publish Flow

After all checks pass and staged files are reviewed:

```bash
git commit -m "Prepare release-ready Fortune Construction updates"
git push newrepo 009-interactive-project-map
```

Then create a PR from `009-interactive-project-map` to `main` in `mo3id/new-fortune-construction`, or perform a merge only when explicitly approved.

## 6. Current Known Blockers

- Confirm the previously exposed GitHub token was revoked or rotated.
- Resolve or explicitly accept `npm audit` vulnerabilities before production merge.
- Confirm external production setup status if it is required for final launch readiness.

## 7. Cleanup Commands Already Approved And Run

These were executed as index-only cleanup and did not delete local files:

```bash
git rm --cached .env apps/api/.env apps/dashboard/.env
git rm --cached -r apps/api/uploads
git rm --cached apps/api/tsconfig.tsbuildinfo apps/dashboard/tsconfig.tsbuildinfo
```

After this cleanup, the no-stage denylist check showed denied files are staged only as deletions, with zero staged additions/modifications for denied paths.

## 8. Safe Publish Staging Review

Safe Publish T046-T057 was reviewed. Commit completed; push was attempted and blocked by GitHub HTTPS authentication; PR and merge were not executed.

- Release candidate is staged with explicit pathspecs only; `git add .` was not used.
- Staged summary: 314 paths total, with 189 added, 43 modified, and 82 deletion-only cleanup paths.
- Denied files are staged only as repository removals: `.env`, `apps/api/.env`, `apps/dashboard/.env`, `apps/api/uploads/**`, and `*.tsbuildinfo`.
- `.vercel/**`, `tmp/**`, `output/**`, `frontend-prod.zip`, and timestamped Vite files are not staged.
- Staged-only secret scan found no GitHub PAT pattern. Generic env/URI/JWT patterns returned only placeholder/test-fixture paths documented in `release-inventory.md`; no values were printed.
- Review-needed files left unstaged: `design-concepts/**`, screenshot PNG evidence under `specs/004-ui-ux-responsive/evidence/` and `specs/005-public-seo-improvements/evidence/`, duplicate spec copies, and `src/components/projects/MalawiProjectMap 2.tsx`.
- The previously exposed token is treated as resolved because the owner confirmed revoke/rotate.
- The remaining Vite high audit finding is treated as a deferred known risk documented in `specs/011-audit-vulnerability-fix`.

Commit completed:

```bash
git commit -m "Prepare release-ready Fortune Construction updates"
```

- Commit hash: `751d148c6406747e674ccb04e2f2ff52facaf153`
- Short hash: `751d148`

Push attempt:

```bash
git push newrepo 009-interactive-project-map
```

- Result: blocked by local GitHub HTTPS authentication (`could not read Username for 'https://github.com'`).
- No push, PR, or merge completed.

To continue, authenticate Git locally for `https://github.com/mo3id/new-fortune-construction.git` using a fresh authorized credential, then rerun the push-only step.

## 9. PR/Merge Handoff

Owner confirmed the branch `009-interactive-project-map` was pushed successfully to `newrepo`. Direct remote verification from this workspace was blocked by local GitHub HTTPS authentication, so the pushed-branch status is recorded as owner-confirmed.

PR target:

- Repository: `mo3id/new-fortune-construction`
- Source branch: `009-interactive-project-map`
- Target branch: `main`
- Direct merge: not approved; review the PR first.

Suggested PR title:

```text
Prepare Fortune Construction for release readiness
```

Suggested PR summary:

```markdown
## Summary
- Stabilizes API runtime/security readiness, upload validation, route validation, and async error handling.
- Repairs API/public/dashboard integration gaps, including project categories while preserving `Project.category` as a string contract.
- Improves public/dashboard UI responsiveness, SEO metadata/social/sitemap/robots/structured data, performance splitting/lazy loading, production readiness guards, error pages, and the interactive project map.
- Removes tracked env/runtime/generated artifacts from the repository and documents release safety gates.
- Applies targeted npm audit remediation; remaining Vite high finding is documented as a deferred known risk because the safe fix requires a major toolchain upgrade.

## Verification
- `npm run typecheck`: passed.
- `npm run build`: passed with known public Vite chunk warning.
- `npm run build --workspace=apps/dashboard`: passed.
- `npm run build --workspace=apps/api`: passed.
- `npm run test --workspace=apps/api`: passed after approved loopback-capable rerun.
- `npm audit`: improved to 8 total, 0 critical, 1 high, 6 moderate, 1 low; remaining high is the deferred Vite/esbuild item.

## Excluded From Release
- `.env`, `apps/api/.env`, `apps/dashboard/.env`, `.vercel/**`.
- `apps/api/uploads/**`, `*.tsbuildinfo`, `tmp/**`, `output/**`, `frontend-prod.zip`, timestamped Vite files.
- `design-concepts/**`, screenshot-heavy PNG evidence, duplicate spec copies, and `src/components/projects/MalawiProjectMap 2.tsx` remain review-needed/untracked.

## Deferred / External Setup
- Configure production env vars, CORS origins, JWT secret, MongoDB, durable upload storage, Vercel/build settings, DNS/domain `fortuneconstruction.mw`, and API/dashboard production URLs outside the repo.
- Revisit Vite major upgrade in a separate package to resolve the remaining high audit finding.
```

Manual PR URL:

```text
https://github.com/mo3id/new-fortune-construction/compare/main...009-interactive-project-map?expand=1
```

Next action: open/review the PR, confirm CI/deployment settings, then merge to `main` only after PR review approval.
