# Data Model: Comprehensive Project Audit

## AuditReport

- `title`: Human-readable report title.
- `createdAt`: Date the report was produced.
- `scope`: Surfaces and categories included in the audit.
- `executiveSummary`: Short stakeholder summary with top risks.
- `topPriorities`: Ordered list of the highest-impact remediation items.
- `surfaceSummaries`: Summary results for website, dashboard, API, configuration, deployment, and shared code.
- `findings`: Detailed list of findings.
- `blockedChecks`: Checks that could not be completed and why.
- `verificationLog`: Commands, browser checks, API checks, and their outcomes.
- `appendix`: Supporting route inventory, configuration inventory, and notes.

## AuditSurface

- `id`: Stable identifier, such as `website`, `dashboard`, `api`, `config`, `deployment`, or `shared-code`.
- `name`: Display name.
- `paths`: Relevant source/configuration paths.
- `routesOrEntrypoints`: Discoverable routes, API endpoints, or entry files.
- `status`: `passed`, `issues-found`, `blocked`, or `not-applicable`.

## Finding

- `id`: Stable finding identifier.
- `title`: Concise problem statement.
- `surface`: Linked audit surface.
- `category`: `integration`, `runtime`, `code-quality`, `performance`, `seo`, `security`, `ux`, `accessibility`, `configuration`, or `deployment`.
- `severity`: `critical`, `high`, `medium`, or `low`.
- `priority`: Ordered remediation priority.
- `confidence`: `confirmed`, `likely`, or `needs-verification`.
- `evidence`: File references, route names, command results, screenshots, or reproduction steps.
- `impact`: User, business, operational, SEO, or security impact.
- `recommendation`: Suggested fix or next investigation step.
- `verificationMethod`: How to confirm the fix later.
- `blockedBy`: Optional missing prerequisite.

## VerificationResult

- `check`: Name of the check.
- `surface`: Related surface.
- `commandOrMethod`: Command, manual browser step, or API request.
- `status`: `passed`, `failed`, `blocked`, or `not-applicable`.
- `evidence`: Relevant output summary or references.
- `notes`: Additional context.

## BlockedCheck

- `check`: Blocked verification item.
- `reason`: Missing credential, unavailable service, network restriction, invalid Git state, missing script, or other blocker.
- `neededToUnblock`: Concrete prerequisite.
- `impact`: What confidence is reduced by the block.

## Priority Matrix

- `critical`: Security exposure, production-breaking runtime failure, data-loss risk, or complete user journey failure.
- `high`: Major integration breakage, broken admin/public workflow, severe SEO/performance issue, or auth/validation weakness.
- `medium`: Degraded experience, maintainability risk, incomplete state handling, or localized performance/SEO issue.
- `low`: Polish, minor consistency issue, documentation gap, or low-impact cleanup.
