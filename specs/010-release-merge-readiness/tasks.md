# Tasks: Release Merge Readiness

**Input**: Design documents from `specs/010-release-merge-readiness/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/release-readiness-contract.md](./contracts/release-readiness-contract.md), [quickstart.md](./quickstart.md)

**Tests**: This release workflow requires verification tasks rather than new product tests. Commands must be run only in the verification phase and recorded without exposing secrets.

**Organization**: Tasks are grouped by user story so release readiness, publish, and merge handoff can be executed safely and independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Every task includes an exact file path where evidence, decisions, or changes are recorded

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare release-readiness documentation surfaces without changing product behavior.

- [x] T001 Confirm `.specify/feature.json` points to `specs/010-release-merge-readiness` and record the active feature path in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T002 [P] Confirm current branch and remotes with `git branch --show-current` and `git remote -v`, then record target remote/branch in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T003 [P] Confirm all package task files `specs/001-*` through `specs/009-*` remain complete and record counts in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T004 [P] Review `specs/010-release-merge-readiness/contracts/release-readiness-contract.md` and add any missing gate names to `specs/010-release-merge-readiness/release-inventory.md`
- [x] T005 Verify `AGENTS.md` references `specs/010-release-merge-readiness/plan.md` and record the check in `specs/010-release-merge-readiness/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Classify the working tree before any staging, cleanup, commit, push, or merge.

**CRITICAL**: Do not delete files, revert changes, stage files, commit, push, or merge during this phase.

- [x] T006 Generate a fresh `git status --short --branch` inventory and summarize totals in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T007 Classify modified tracked product source paths under `src/`, `apps/`, and `packages/` as include/review-needed in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T008 [P] Classify Spec Kit/tooling paths under `.agents/`, `.specify/`, and `specs/` as include/review-needed in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T009 [P] Classify root config and manifest paths including `.gitignore`, `AGENTS.md`, `package.json`, and `package-lock.json` in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T010 [P] Classify public SEO/static paths including `public/robots.txt` and `public/sitemap.xml` in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T011 Classify all env paths `.env`, `apps/api/.env`, `apps/dashboard/.env`, `.vercel/.env.production.local`, and `apps/api/.env.example` without printing values in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T012 Classify runtime upload paths under `apps/api/uploads/**` as excluded by default in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T013 [P] Classify build/typecheck artifacts `apps/api/tsconfig.tsbuildinfo`, `apps/dashboard/tsconfig.tsbuildinfo`, `dist/**`, and `dist-ssr/**` as excluded by default in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T014 [P] Classify temporary/export artifacts `tmp/**`, `output/**`, `frontend-prod.zip`, and `vite.config.ts.timestamp-*` as excluded by default in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T015 Classify large generated/design files under `design-concepts/**` as review-needed or excluded in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T016 Review `.gitignore` coverage for `.env`, `.vercel`, `apps/api/uploads/**`, `*.tsbuildinfo`, `tmp/**`, `output/**`, `frontend-prod.zip`, and timestamped Vite files, then record gaps in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T017 Record a proposed `.gitignore` hygiene change list in `specs/010-release-merge-readiness/release-inventory.md` without editing `.gitignore` yet
- [x] T018 Record the tracked-env blocker for `.env`, `apps/api/.env`, and `apps/dashboard/.env` in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T019 Record that removing tracked env files from the Git index requires separate owner approval and must preserve local copies in `specs/010-release-merge-readiness/quickstart.md`
- [x] T020 Record the exposed GitHub token blocker and the requirement to revoke/rotate it before merge readiness in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T021 Define the staged-only secret scan patterns and non-sensitive reporting format in `specs/010-release-merge-readiness/contracts/release-readiness-contract.md`
- [x] T022 Define the final no-stage denylist for `.env`, `.vercel/**`, `apps/api/uploads/**`, `*.tsbuildinfo`, `tmp/**`, `output/**`, `frontend-prod.zip`, and `vite.config.ts.timestamp-*` in `specs/010-release-merge-readiness/contracts/release-readiness-contract.md`
- [x] T023 Confirm no runtime/API server is required for release planning and record this in `specs/010-release-merge-readiness/quickstart.md`

**Checkpoint**: The working tree is classified, blockers are visible, and no cleanup/staging has happened.

---

## Phase 3: User Story 1 - Release Readiness Gate (Priority: P1) MVP

**Goal**: Produce a verified release candidate classification and cleanup plan before commit.

**Independent Test**: A reviewer can inspect `release-inventory.md` and see every changed category classified, all blockers listed, and all verification gates prepared.

### Verification Tasks for User Story 1

- [x] T024 [P] [US1] Run `npm run typecheck` and record pass/fail output summary in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T025 [P] [US1] Run `npm run build` and record pass/fail plus Vite warnings in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T026 [P] [US1] Run `npm run build --workspace=apps/dashboard` and record pass/fail plus dashboard chunk warnings in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T027 [P] [US1] Run `npm run build --workspace=apps/api` and record pass/fail in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T028 [US1] Run `npm run test --workspace=apps/api` and record pass/fail in `specs/010-release-merge-readiness/release-inventory.md`; if sandbox loopback fails, rerun only with explicit approval and record the approval/result
- [x] T029 [US1] Run `npm audit` only if network is available or approved, then record pass/fail/blocked without treating network unavailability as an automatic merge blocker in `specs/010-release-merge-readiness/release-inventory.md`

### Implementation Tasks for User Story 1

- [x] T030 [US1] Apply approved `.gitignore` hygiene changes for uploads, tsbuildinfo, tmp/output exports, zip artifacts, and timestamped Vite files in `.gitignore`
- [x] T031 [US1] After separate owner approval, remove `.env` from the Git index without deleting the local file and record the result in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T032 [US1] After separate owner approval, remove `apps/api/.env` from the Git index without deleting the local file and record the result in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T033 [US1] After separate owner approval, remove `apps/dashboard/.env` from the Git index without deleting the local file and record the result in `specs/010-release-merge-readiness/release-inventory.md`

> Completed after explicit owner request: T031-T033 used `git rm --cached` only, preserving local files. Additional documented exclude cleanup removed tracked `apps/api/uploads/**` and `*.tsbuildinfo` from the Git index only.
- [x] T034 [US1] Verify `apps/api/.env.example` contains placeholders only and record the non-sensitive result in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T035 [US1] Verify `.vercel/.env.production.local` remains untracked and ignored without printing values, then record the result in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T036 [US1] Confirm `apps/api/uploads/**` paths are not staged and record the count/status in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T037 [US1] Confirm `*.tsbuildinfo`, `tmp/**`, `output/**`, `frontend-prod.zip`, and `vite.config.ts.timestamp-*` are not staged and record the status in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T038 [US1] Create an explicit include candidate list for source/spec/config files to stage in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T039 [US1] Create an explicit review-needed list for large design/export evidence and screenshot-heavy spec evidence in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T040 [US1] Create an explicit exclude list for env, uploads, generated artifacts, temp files, and build artifacts in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T041 [US1] Verify staged-only secret scan command/method is documented and redacts values in `specs/010-release-merge-readiness/contracts/release-readiness-contract.md`
- [x] T042 [US1] Record whether the owner confirmed the exposed GitHub token was revoked/rotated in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T043 [US1] If token revocation is not confirmed, mark merge readiness blocked in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T044 [US1] Confirm external production setup status is documented as confirmed, external-setup, deferred, or blocked without inventing evidence in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T045 [US1] Update `specs/010-release-merge-readiness/quickstart.md` with the final cleanup and verification commands actually used

**Checkpoint**: User Story 1 is complete when release readiness is classified, verification is recorded, and merge blockers are explicit.

---

## Phase 4: User Story 2 - Safe Publish to Repository (Priority: P2)

**Goal**: Prepare an intentional commit and push path to `newrepo` after release gates pass.

**Independent Test**: The staged file list contains only approved release files, staged-only secret scan passes, and push steps require separate approval before execution.

### Verification Tasks for User Story 2

- [x] T046 [US2] Stage only the explicit include candidate files approved in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T047 [US2] Generate `git diff --cached --name-status` and record the staged file summary in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T048 [US2] Verify no staged path matches `.env`, `.vercel/**`, `apps/api/uploads/**`, `*.tsbuildinfo`, `tmp/**`, `output/**`, `frontend-prod.zip`, or `vite.config.ts.timestamp-*`, then record the result in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T049 [US2] Run the staged-only secret scan and record only file paths/risk categories, never secret values, in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T050 [US2] Review `git diff --cached --stat` for unexpected large/generated additions and record the result in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T051 [US2] Re-run `git status --short --branch` and record remaining untracked/excluded files separately from staged release files in `specs/010-release-merge-readiness/release-inventory.md`

### Implementation Tasks for User Story 2

- [x] T052 [US2] Prepare the commit message `Prepare Fortune Construction for production release` in `specs/010-release-merge-readiness/quickstart.md`
- [x] T053 [US2] Request separate owner approval for `git commit` and record approval status in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T054 [US2] After separate approval only, run `git commit` and record the resulting commit hash in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T055 [US2] Verify `newrepo` still points to `mo3id/new-fortune-construction` and record the remote check in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T056 [US2] Request separate owner approval for `git push newrepo 009-interactive-project-map` and record approval status in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T057 [US2] After separate approval only, push `009-interactive-project-map` to `newrepo` and record the push result in `specs/010-release-merge-readiness/release-inventory.md`

> Safe Publish commit completed after explicit owner approval: `751d148c6406747e674ccb04e2f2ff52facaf153`; documentation status commit completed as `f767fb8b96f1a59c336ae9a2182db760e3613c5e`. T057 is owner-confirmed successful after the branch was pushed to `newrepo`; local direct verification remains blocked by GitHub HTTPS authentication. No PR or merge was executed from this workspace.

**Checkpoint**: User Story 2 is complete when the approved release commit is pushed to `newrepo` or the push blocker is documented.

---

## Phase 5: User Story 3 - Main Branch Merge Handoff (Priority: P3)

**Goal**: Prepare a clear PR/merge path from the pushed release branch into `main`.

**Independent Test**: The owner can complete or approve merge using the handoff in under 10 minutes, and no unresolved blocker is hidden.

### Verification Tasks for User Story 3

- [x] T058 [US3] Verify the pushed branch exists on `newrepo` and record the non-sensitive result in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T059 [US3] Confirm target merge branch is `main` for `mo3id/new-fortune-construction` and record the result in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T060 [US3] Verify no release blocker remains for env files, generated artifacts, staged secrets, failed verification, or token revocation in `specs/010-release-merge-readiness/release-inventory.md`

### Implementation Tasks for User Story 3

- [x] T061 [US3] Draft a PR title and summary covering packages `001` through `010` in `specs/010-release-merge-readiness/quickstart.md`
- [x] T062 [US3] Draft a verification summary covering typecheck, builds, API tests, audit status, and known warnings in `specs/010-release-merge-readiness/quickstart.md`
- [x] T063 [US3] Draft deferred follow-ups for external production setup, durable upload storage, npm audit/network status, and any accepted warnings in `specs/010-release-merge-readiness/quickstart.md`
- [x] T064 [US3] Request separate owner approval to open a PR or perform a merge to `main`, and record approval status in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T065 [US3] After separate approval only, open a PR from `009-interactive-project-map` to `main` or record manual PR instructions in `specs/010-release-merge-readiness/quickstart.md`
- [x] T066 [US3] If merge is approved and safe, record the merge method and final merge status in `specs/010-release-merge-readiness/release-inventory.md`

> PR handoff prepared without direct merge. Manual PR URL and PR body are recorded in `quickstart.md`; merge is pending PR review approval.

**Checkpoint**: User Story 3 is complete when the owner has a PR/merge handoff or the remaining blocker is documented.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency checks after selected release phases.

- [x] T067 Confirm all tasks completed in `specs/010-release-merge-readiness/tasks.md` match recorded evidence in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T068 Confirm `specs/010-release-merge-readiness/quickstart.md` includes final safe commands and does not instruct `git add .`, force push, destructive reset, or secret disclosure
- [x] T069 Confirm `specs/010-release-merge-readiness/release-inventory.md` contains no secret values, tokens, DB URIs, or env values
- [x] T070 Confirm `specs/010-release-merge-readiness/contracts/release-readiness-contract.md` matches the final staged-only review process
- [x] T071 Produce the final merge readiness status as `ready`, `blocked`, or `deferred` in `specs/010-release-merge-readiness/release-inventory.md`
- [x] T072 Report final status to the owner with included files, excluded files, verification results, blockers, and next action from `specs/010-release-merge-readiness/release-inventory.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Setup**: No dependencies; can start immediately.
- **Phase 2 Foundational**: Depends on Phase 1; blocks all user stories.
- **US1 Release Readiness Gate**: Depends on Phase 2; MVP scope.
- **US2 Safe Publish**: Depends on US1 complete with no release blockers, plus separate approval for commit/push.
- **US3 Merge Handoff**: Depends on US2 push complete or documented push blocker, plus separate approval for PR/merge.
- **Final Phase**: Depends on whichever user stories were executed.

### User Story Dependencies

- **US1 (P1)**: Required before any commit/push.
- **US2 (P2)**: Requires US1 to pass or explicitly document blockers.
- **US3 (P3)**: Requires US2 push or documented manual handoff path.

### Parallel Opportunities

- T002-T004 can run in parallel during setup.
- T008-T010 and T013-T014 can run in parallel during classification.
- T024-T027 can run in parallel if system resources allow.
- T061-T063 can run in parallel after pushed branch verification.

---

## Parallel Example: User Story 1

```text
Task: "Run npm run typecheck and record pass/fail output summary in specs/010-release-merge-readiness/release-inventory.md"
Task: "Run npm run build and record pass/fail plus Vite warnings in specs/010-release-merge-readiness/release-inventory.md"
Task: "Run npm run build --workspace=apps/dashboard and record pass/fail plus dashboard chunk warnings in specs/010-release-merge-readiness/release-inventory.md"
Task: "Run npm run build --workspace=apps/api and record pass/fail in specs/010-release-merge-readiness/release-inventory.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 working-tree classification.
3. Complete US1 verification, cleanup planning, `.gitignore` hygiene, staged-safety preparation, and blocker documentation.
4. Stop if the token revocation, tracked env files, or verification gates remain blocked.

### Incremental Delivery

1. US1: make the release candidate safe and verified.
2. US2: stage explicit files, scan staged content, commit, and push only after separate approval.
3. US3: prepare PR/merge handoff only after push succeeds and blockers are gone.

### Safety Rules

- Do not run `git add .`.
- Do not print env values or secrets.
- Do not delete local files without explicit approval.
- Do not commit, push, open PR, or merge without separate owner approval.
- Do not force push, reset, checkout over changes, or rewrite history without explicit approval.
