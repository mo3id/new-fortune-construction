# Data Model: Release Merge Readiness

## Release Candidate

Represents the current branch and working tree intended for publication.

Fields:

- `branch`: current local branch name.
- `targetRemote`: intended Git remote.
- `targetMainBranch`: intended merge branch.
- `changedPathCount`: number of modified/untracked paths.
- `includedPackages`: completed Spec Kit package list.
- `status`: `draft`, `verifying`, `blocked`, `ready-to-push`, `pushed`, `ready-to-merge`, or `merged`.

Validation rules:

- Must identify `targetRemote` before push.
- Must not become `ready-to-push` while any release-blocking secret or artifact remains staged.
- Must not become `ready-to-merge` until verification gates pass or are owner-accepted as deferred.

## Change Classification

Represents a changed file or file group.

Fields:

- `pathPattern`: file path or grouped path pattern.
- `category`: `source`, `spec-docs`, `config-example`, `dependency-manifest`, `public-asset`, `generated-artifact`, `runtime-upload`, `env-secret`, `external-doc`, or `unknown`.
- `releaseDecision`: `include`, `exclude`, `defer`, `owner-confirm`, or `blocked`.
- `evidence`: status, diff, size, or documented reason.

Validation rules:

- `env-secret` must be `exclude` or `blocked`.
- `runtime-upload` must be `exclude` unless owner explicitly approves a fixture.
- `generated-artifact` must be `exclude` unless required as release evidence.
- `unknown` categories must be resolved before commit.

## Verification Gate

Represents a check required before commit, push, or merge.

Fields:

- `name`: human-readable check name.
- `commandOrMethod`: command or manual review method.
- `requiredBefore`: `commit`, `push`, or `merge`.
- `status`: `pending`, `passed`, `failed`, `blocked`, or `deferred`.
- `evidence`: non-sensitive summary.

Validation rules:

- Failed required gates block release unless owner explicitly accepts a deferment.
- Blocked network-dependent gates must describe the rerun path.
- Evidence must not contain secret values.

## Excluded Artifact

Represents a local file or file class that should not enter the release commit.

Fields:

- `pathPattern`: excluded file path/pattern.
- `reason`: `secret`, `local-runtime`, `generated`, `large-export`, `temporary`, or `non-durable-storage`.
- `localAction`: `leave-untracked`, `git-rm-cached`, `ignore-pattern`, or `owner-review`.

Validation rules:

- Exclusion must not delete local files unless owner approves.
- Exclusion must be enforced in staging review.

## Merge Handoff

Represents the final owner-facing release summary.

Fields:

- `commitMessage`: proposed commit message.
- `branchPushed`: boolean.
- `prUrl`: optional pull request URL.
- `includedSummary`: concise package/source summary.
- `verificationSummary`: gate statuses and known warnings.
- `blockedItems`: unresolved blockers.
- `deferredFollowUps`: non-blocking follow-ups.

Validation rules:

- Must include target repository and merge branch.
- Must include any unresolved external setup state.
- Must not claim merge readiness if blockers remain.
