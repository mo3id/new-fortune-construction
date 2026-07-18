# Implementation Plan: Release Merge Readiness

**Branch**: `009-interactive-project-map` | **Date**: 2026-07-18 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/010-release-merge-readiness/spec.md`

## Summary

Prepare the accumulated Fortune Construction work for a safe GitHub publish and merge into `main`. The plan is release hygiene only: inventory the current dirty working tree, classify release-worthy files versus local/generated/sensitive artifacts, verify all prior Spec Kit packages, run final quality gates, then prepare a deliberate commit/push/PR flow to `newrepo` without changing product behavior during planning.

Current evidence gathered during planning:

- Current branch: `009-interactive-project-map`.
- Target remote: `newrepo` -> `https://github.com/mo3id/new-fortune-construction.git`.
- Upstream remote also exists: `origin` -> `https://github.com/AbdelrahmanYosry2022/fortune-construction.git`.
- Working tree status: 158 changed paths observed, including 43 modified tracked paths and 115 untracked paths.
- Category counts from current status: specs/tooling 3, API 6, dashboard 17, public site 33, shared UI 2, root config 4, uploads 86, generated artifacts 6, other 1.
- Specs `001` through `009` each have all tasks checked complete; `010` is the active release-readiness package and has no tasks yet.
- `.env`, `apps/api/.env`, and `apps/dashboard/.env` are currently tracked files. They must be handled before release without printing values.
- `.vercel/.env.production.local` exists locally and is ignored/untracked. It must remain untracked and must not be disclosed.
- `apps/api/uploads/*`, `*.tsbuildinfo`, `tmp/`, `output/`, `frontend-prod.zip`, timestamped Vite temp files, and local design/export artifacts must be classified before staging and are excluded by default.
- A previously exposed GitHub personal access token is a release blocker until the owner confirms it has been revoked or rotated.

## Technical Context

**Language/Version**: TypeScript project with React/Vite frontends and Express API.  
**Primary Dependencies**: npm workspaces, Vite, React, Express, Mongoose, Vitest/Jest-style API tests, Spec Kit local tooling.  
**Storage**: MongoDB for API data; local filesystem uploads currently exist in `apps/api/uploads/` and are not durable production storage.  
**Testing**: `npm run typecheck`, `npm run build`, `npm run build --workspace=apps/dashboard`, `npm run build --workspace=apps/api`, `npm run test --workspace=apps/api`; `npm audit` requires network and may be blocked in the sandbox.  
**Target Platform**: GitHub repository release branch, main branch merge, and production deployment handoff for public site, dashboard, and API.  
**Project Type**: Monorepo web application with public site, dashboard app, shared UI package, and API workspace.  
**Performance Goals**: No new performance targets; preserve previous performance improvements and document known Vite chunk warnings.  
**Constraints**: No code behavior changes during planning; no commit or push during planning; no secret values printed; no destructive cleanup without owner approval; no production/API runtime unless a later task explicitly requires safe local verification.  
**Scale/Scope**: Release preparation for all completed packages `001` through `009`, plus the new `010` release-readiness workflow.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Component-First UI**: Pass. This package does not change UI; it only plans release readiness.
- **API-Contract Driven**: Pass. This package does not alter API contracts; verification must confirm contracts remain stable.
- **Type Safety (NON-NEGOTIABLE)**: Pass with required gate. Final verification must run `npm run typecheck` before commit.
- **Test-First**: Pass for release workflow. No product feature is added; release tasks must run existing test suites and record any blocked checks.
- **Performance & UX Consistency**: Pass with required gate. Final build output and existing browser evidence must be reviewed; no redesign or performance rewrite is in scope.
- **Monorepo Discipline**: Pass. Release artifacts must respect workspace boundaries and avoid committing local runtime artifacts.

No constitution violations are introduced by this plan.

## Project Structure

### Documentation (this feature)

```text
specs/010-release-merge-readiness/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── release-inventory.md
├── quickstart.md
├── contracts/
│   └── release-readiness-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
.
├── .agents/                         # Spec Kit Codex skill; release docs/tooling candidate
├── .specify/                        # Spec Kit configuration/templates/scripts; release docs/tooling candidate
├── specs/                           # Completed package documentation and evidence
├── src/                             # Public site source changes from prior packages
├── apps/
│   ├── api/                         # API source/tests/config examples from prior packages
│   └── dashboard/                   # Dashboard source changes from prior packages
├── packages/shared-ui/              # Shared UI source changes from prior packages
├── public/                          # SEO public artifacts such as robots/sitemap
├── package.json
├── package-lock.json
├── AGENTS.md
└── .gitignore
```

**Structure Decision**: Use the existing monorepo structure. This release package will add planning and verification documents only. It will not move product files or rewrite source organization.

## Release Classification Plan

### Include by Default After Verification

- Product source changes under `src/`, `apps/api/src/`, `apps/api/tests/`, `apps/dashboard/src/`, and `packages/shared-ui/`.
- Public SEO files under `public/robots.txt` and `public/sitemap.xml`.
- Dependency manifest changes in `package.json` and `package-lock.json`.
- Safe environment examples such as `apps/api/.env.example`.
- Spec Kit project assets under `.agents/`, `.specify/`, and `specs/` when they document completed work or are needed for reproducible Spec Kit workflows.
- `AGENTS.md` update pointing to this release-readiness plan.

### Exclude by Default Unless Explicitly Approved

- Real environment files: `.env`, `apps/api/.env`, `apps/dashboard/.env`, `.vercel/.env.production.local`.
- Runtime uploads: `apps/api/uploads/cvs/*`, `apps/api/uploads/images/*`, `apps/api/uploads/videos/*`.
- Build/typecheck artifacts: `apps/api/tsconfig.tsbuildinfo`, `apps/dashboard/tsconfig.tsbuildinfo`, `dist/`, `dist-ssr/`.
- Temporary/generated files: `tmp/`, `output/`, `frontend-prod.zip`, `vite.config.ts.timestamp-*`.
- Large design/export artifacts under `design-concepts/` unless the owner explicitly wants them versioned as source documentation.
- Any file flagged by staged-only secret scanning.

### Required Git Hygiene Before Commit

- Update `.gitignore` to cover uploads, tsbuildinfo, tmp/output/export artifacts, and local design exports if not intentionally versioned.
- Remove real env files and tracked upload/build artifacts from the Git index without deleting local copies, after owner approval.
- Stage explicit release files rather than `git add .`.
- Inspect staged file list and staged diff before commit.

## Verification Plan

1. **Static release inventory**
   - Confirm current branch and remotes.
   - Confirm all Spec Kit task files for packages `001` through `009` are complete.
   - Confirm package `010` tasks are generated and completed before release commit.
   - Confirm changed files are classified as include/exclude/deferred.

2. **Secret and sensitive artifact checks**
   - Verify no real `.env` or `.vercel` files are staged.
   - Verify no `apps/api/uploads/*`, `tmp/`, `output/`, `frontend-prod.zip`, `*.tsbuildinfo`, or timestamped temp files are staged.
   - Run a staged-only secret scan that reports file paths and risk categories only, never values.
   - Treat the previously exposed GitHub personal access token as blocked until the owner confirms revocation/rotation.

3. **Quality gates**
   - Run `npm run typecheck`.
   - Run `npm run build`.
   - Run `npm run build --workspace=apps/dashboard`.
   - Run `npm run build --workspace=apps/api`.
   - Run `npm run test --workspace=apps/api`; if sandbox loopback fails with `EPERM 127.0.0.1`, rerun with explicit approval outside the sandbox.
   - Run `npm audit` only if network is available/approved; otherwise record as blocked/deferred and do not block merge solely on unavailable network.

4. **Release notes and handoff**
   - Summarize included packages: audit, API security, integration repair, UI/UX responsive, SEO, performance, production readiness, error pages, interactive map.
   - Record known non-blocking warnings such as Vite chunk-size warnings if builds pass.
   - Record external production setup confirmation status without inventing evidence.
   - Prepare commit message and PR/merge summary.

5. **Publish and merge path**
   - Commit only after all release gates are acceptable.
   - Push current release branch to `newrepo`.
   - Open a PR from `009-interactive-project-map` into `main` on `mo3id/new-fortune-construction`, or merge locally only if explicitly requested and safe.
   - Do not force push, reset, or rewrite history without explicit owner approval.

## Phase 0: Research

See [research.md](./research.md).

## Phase 1: Design & Contracts

See [data-model.md](./data-model.md), [release-inventory.md](./release-inventory.md), [quickstart.md](./quickstart.md), and [release-readiness-contract.md](./contracts/release-readiness-contract.md).

## Post-Design Constitution Check

- **Component-First UI**: Pass. No UI implementation changes planned.
- **API-Contract Driven**: Pass. Contract stability is a verification gate, not a change target.
- **Type Safety**: Pass. `npm run typecheck` is mandatory before commit.
- **Test-First**: Pass. Existing test suites and release checks are required before publish.
- **Performance & UX Consistency**: Pass. Prior evidence and final build outputs are reviewed; broad redesign is out of scope.
- **Monorepo Discipline**: Pass. Stage by workspace/category; exclude local runtime/generated artifacts.

## Complexity Tracking

No constitution violations or additional architectural complexity are required.
