# Audit Report Contract

The final audit report should follow this structure so findings are easy to prioritize and convert into tasks.

## Required Sections

1. `Executive Summary`
   - Overall health
   - Top risks
   - Top five fixes
2. `Scope`
   - Included surfaces
   - Excluded or unavailable surfaces
   - Assumptions
3. `Priority Matrix`
   - Critical
   - High
   - Medium
   - Low
4. `Surface Summaries`
   - Public website
   - Dashboard
   - API
   - Configuration/deployment
   - Shared code/assets
5. `Detailed Findings`
   - One subsection per finding
6. `Blocked Checks`
   - Blocker
   - Needed prerequisite
   - Impact on confidence
7. `Verification Log`
   - Commands run
   - Browser checks
   - API checks
   - Static review checks

## Finding Fields

Each finding must include:

| Field | Required | Notes |
| --- | --- | --- |
| ID | Yes | Stable identifier such as `AUD-001` |
| Title | Yes | Short problem statement |
| Surface | Yes | Website, dashboard, API, config, deployment, shared code |
| Category | Yes | Integration, runtime, code quality, performance, SEO, security, UX, accessibility, configuration, deployment |
| Severity | Yes | Critical, high, medium, low |
| Priority | Yes | Numeric order or priority group |
| Confidence | Yes | Confirmed, likely, needs verification |
| Evidence | Yes | File links, command summary, route, screenshot, or reproduction |
| Impact | Yes | Why this matters |
| Recommendation | Yes | What to do next |
| Verification Method | Yes | How to confirm the fix |
| Blocked By | Optional | Missing credential, network, service, or environment dependency |

## Severity Rules

- `Critical`: Active secret/data exposure, production-breaking failure, complete primary journey failure, or data-loss risk.
- `High`: Broken integration, failed build/runtime path, admin auth weakness, severe SEO/performance regression, or major UX blocker.
- `Medium`: Important but localized issue, maintainability risk, incomplete error handling, accessibility defect, or moderate performance issue.
- `Low`: Minor polish, documentation gap, small consistency issue, or cleanup.

## Evidence Rules

- Prefer direct file references, command summaries, route names, HTTP status codes, and reproduction steps.
- Screenshots may be referenced when browser verification is used.
- Secret values must be redacted.
- If evidence is incomplete, mark confidence as `needs verification`.
