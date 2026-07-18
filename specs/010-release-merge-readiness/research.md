# Research: Release Merge Readiness

## Decision: Treat this package as release hygiene, not product implementation

**Rationale**: The user wants the accumulated work uploaded to GitHub and merged into `main`. The main risks are repository hygiene, verification, secrets, and publication flow. No product behavior change is needed in the planning phase.

**Alternatives considered**:

- Create another product hardening package: rejected because the user is asking for release readiness after prior packages.
- Commit immediately: rejected because the working tree contains local uploads, artifacts, tracked env files, and untracked generated files.

## Decision: Keep the current branch as the release candidate

**Rationale**: The active branch is `009-interactive-project-map`, and the user asked to prepare the existing work. Creating or switching to a new feature branch before classification could strand or hide dirty-tree changes.

**Alternatives considered**:

- Run the Spec Kit git feature hook: rejected for this request because it creates/switches branches.
- Merge directly into main first: rejected because verification and staging hygiene must happen before merge.

## Decision: Push to `newrepo`, not `origin`

**Rationale**: The configured remotes show `newrepo` points to `mo3id/new-fortune-construction`, matching the user's target repository. `origin` points to a different owner.

**Alternatives considered**:

- Push to `origin`: rejected unless the owner changes the target because it is not the requested repository.

## Decision: Stage explicit file sets instead of `git add .`

**Rationale**: Current status includes 158 changed paths, including runtime uploads, generated artifacts, local temp files, and tracked env files. Explicit staging reduces the chance of leaking secrets or publishing local artifacts.

**Alternatives considered**:

- Stage everything automatically: rejected because the working tree contains excluded categories.
- Delete generated files during planning: rejected because planning must not delete or revert.

## Decision: Remove real env files from tracking before merge, preserving local copies

**Rationale**: `.env`, `apps/api/.env`, and `apps/dashboard/.env` are tracked. Even if their current values are local, real env files should not remain in a public release branch. Safe examples such as `.env.example` can remain.

**Alternatives considered**:

- Leave tracked env files in place: rejected because release requirement SC-003 requires zero known environment values in release commit.
- Print and audit values manually: rejected because secret values must not be disclosed.

## Decision: Treat exposed GitHub token revocation as an external blocker

**Rationale**: A personal access token was pasted in chat. The repository cannot revoke it. The owner must revoke/rotate it in GitHub before the branch is considered merge-ready.

**Alternatives considered**:

- Ignore because it is not in code: rejected because release readiness includes collaboration-exposed credentials.

## Decision: Use staged-only secret scanning for final verification

**Rationale**: Scanning the whole workspace can traverse ignored local env/deployment files and risk exposing values in logs. A staged-only scan focuses on what would actually be committed.

**Alternatives considered**:

- Whole-worktree scans with raw output: rejected because they can disclose ignored local secrets.
- No scan: rejected because secrets are a primary release blocker.

## Decision: Record npm audit as network-dependent

**Rationale**: `npm audit` may require network. It is useful before release but should be recorded as blocked/deferred if network access is unavailable during implementation.

**Alternatives considered**:

- Make audit mandatory regardless of network: rejected because sandbox/network limitations could create a false blocker.
- Skip audit entirely: rejected because dependency vulnerability status is part of release readiness.
