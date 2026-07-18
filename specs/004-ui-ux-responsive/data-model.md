# Data Model: UI/UX Responsive Improvements

This package does not introduce persistent application data. These entities describe planning and verification records used to guide implementation.

## Public Page Surface

- **Purpose**: Represents a public website route or major section that visitors use.
- **Fields**:
  - `route`: Public route or section path.
  - `primaryUserGoal`: What the visitor needs to accomplish.
  - `apiDependencies`: Existing public API reads or page content dependencies.
  - `responsiveRisks`: Potential overlap, scroll, media, or interaction risks.
  - `priority`: P1, P2, or P3.
- **Relationships**:
  - Has many Responsive Verification Targets.
  - May use UI Component Patterns.

## Dashboard Management Surface

- **Purpose**: Represents an admin dashboard page used to manage public or operational content.
- **Fields**:
  - `route`: Dashboard route.
  - `managedResource`: Resource or workflow managed by the page.
  - `apiDependencies`: Existing dashboard API reads/writes.
  - `uiPatterns`: Tables, forms, modals, upload controls, filters, actions.
  - `responsiveRisks`: Mobile/sidebar/table/modal/form risks.
  - `priority`: P1, P2, or P3.
- **Relationships**:
  - Has many Responsive Verification Targets.
  - Uses shared UI components where possible.

## Responsive Verification Target

- **Purpose**: A route and viewport pairing used for browser validation.
- **Fields**:
  - `surfaceType`: Public or dashboard.
  - `route`: Route to verify.
  - `viewport`: Desktop or mobile baseline.
  - `expectedState`: Loaded, empty, error, modal open, form editing, or table/list view.
  - `evidenceRequired`: Screenshot, console log summary, network failure summary, scroll/overlap notes.
  - `passFailStatus`: Pending, pass, fail, blocked.
- **Relationships**:
  - Belongs to one Public Page Surface or Dashboard Management Surface.
  - Produces UI Findings.

## UI Component Pattern

- **Purpose**: A reusable UI pattern that may need shared fixes.
- **Fields**:
  - `name`: Button, form input, table, modal, card, upload field, empty state, loading state, media placeholder, navigation.
  - `ownerPath`: Existing source area likely to own the pattern.
  - `usageSurfaces`: Public and dashboard surfaces using it.
  - `riskType`: Responsive, accessibility, hierarchy, state clarity, visual consistency, media stability.
  - `sharedFixCandidate`: Yes or no.

## UI Finding

- **Purpose**: A verified issue or improvement candidate from static/browser checks.
- **Fields**:
  - `id`: Stable finding identifier.
  - `surface`: Route or component.
  - `viewport`: Desktop, mobile, or both.
  - `severity`: P1 blocking, P2 important, P3 polish.
  - `evidence`: Source reference, screenshot reference, console/network note, or reproduction steps.
  - `apiContractRisk`: None, low, medium, high.
  - `recommendedFixScope`: Page, component, shared UI, or deferred.
  - `status`: Open, fixed, deferred, blocked.

## Deferred UI Follow-Up

- **Purpose**: A useful improvement intentionally left out of the first package.
- **Fields**:
  - `description`: What should be done later.
  - `reasonDeferred`: Why it is outside current scope.
  - `trigger`: What would justify future work.
  - `ownerArea`: Public site, dashboard, shared UI, API integration, performance.
