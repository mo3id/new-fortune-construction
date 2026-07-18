# Research: UI/UX Responsive Improvements

## Decision: Begin With Static Inventory, Then Browser Evidence

**Rationale**: The repository already has clear public routes, dashboard routes, shared UI components, and API integration tests. Static inventory can identify likely responsive risk areas without starting runtime services during planning. Browser evidence should run during implementation after dev servers are intentionally started.

**Alternatives considered**:
- Runtime-only audit: rejected because it can miss source-level shared component risks and requires server setup before planning is complete.
- Static-only audit: rejected because layout overlap, scroll behavior, and console/network issues require browser evidence.

## Decision: Use Focused Responsive Fixes Instead of Broad Redesign

**Rationale**: The current UI is already styled and API-connected. The requested package is about clarity, responsiveness, and usability, so fixes should target confirmed issues in layout constraints, tables/lists, forms, modals, states, and media handling.

**Alternatives considered**:
- Full redesign: rejected because it increases risk to API-connected workflows and violates the user's no broad redesign constraint.
- Page-by-page visual rewrite: rejected because shared component fixes are safer when issues repeat.

## Decision: Preserve API Contracts and Existing Content Paths

**Rationale**: `specs/003-api-integration-repair` completed API integration repair and verified `Project.category` as a string contract. UI improvements must not change endpoints, payloads, response shapes, or the accepted Success stories Page Content path.

**Alternatives considered**:
- Introduce new dashboard success stories management: rejected as out of scope for this UI/UX responsive package.
- Add new API view models for UI convenience: rejected unless later tests prove a backward-compatible need.

## Decision: Dashboard Tables Can Become Responsive Lists Where Appropriate

**Rationale**: Several dashboard pages use tables or dense list regions. On mobile, constrained table scrolling or card/list alternatives are acceptable as long as dashboard actions remain clear and contracts do not change.

**Alternatives considered**:
- Force every dashboard table into horizontal scroll: rejected because it can hide actions and reduce mobile usability.
- Replace all tables with cards: rejected as a broad rewrite; use only where static/browser evidence proves table usability issues.

## Decision: Browser Verification Must Include Console and Network Evidence

**Rationale**: Responsive visual success is not enough if API-driven pages fail silently. The verification contract records console errors and failed requests so UI fixes do not mask broken API clients or state handling.

**Alternatives considered**:
- Screenshot-only verification: rejected because screenshots do not capture console/network failures.
- Build-only verification: rejected because builds do not prove desktop/mobile layout behavior.
