# Feature Specification: API Integration Repair

**Feature Branch**: `003-api-integration-repair`  
**Created**: 2026-07-17  
**Status**: Draft  
**Input**: User description: "أريد تنفيذ حزمة إصلاحات ثانية تركز على تكامل الموقع والداشبورد مع الـ API. المطلوب مراجعة وإصلاح routes الناقصة أو غير المربوطة، خصوصًا project categories، والتأكد أن الداشبورد يستطيع إضافة وتعديل وحذف كل البيانات التي تظهر في الموقع بدون كسر API contracts الحالية، مع اختبارات تحقق للـ CRUD والتوافق بين public site وdashboard."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Project Categories Stay Connected (Priority: P1)

As a dashboard administrator, I need to create, edit, delete, and assign project categories so that the categories used to organize projects in the public site are managed from the dashboard and remain synchronized with project listings and detail pages.

**Why this priority**: Project categories were called out as a likely missing or disconnected integration point. If categories are not manageable and synchronized, the public project experience and dashboard content workflow cannot be trusted.

**Independent Test**: Manage project categories from the dashboard, assign them to projects, and verify the public project category filters, project cards, and project details reflect the current category state without client contract changes.

**Acceptance Scenarios**:

1. **Given** an authenticated dashboard user and an existing project, **When** the user creates a new project category and assigns it to that project, **Then** the public site can display and filter the project under the new category.
2. **Given** a category used by one or more projects, **When** the dashboard user updates the category name or display metadata, **Then** all dashboard and public project views show the updated category consistently.
3. **Given** a category that is safe to remove, **When** the dashboard user deletes it, **Then** the category no longer appears in dashboard selectors or public filters and no project is left in an invalid category state.

---

### User Story 2 - Dashboard Manages All Public Content (Priority: P1)

As a dashboard administrator, I need every data type visible on the public website to have a working dashboard management path so public content can be added, edited, and removed without direct data edits or broken API routes.

**Why this priority**: The dashboard should be the operational control surface for the website. Missing or unlinked routes create stale public content, partial CRUD workflows, and support risk.

**Independent Test**: Inventory every public website data dependency, then verify each managed data type has working dashboard create, read, update, and delete behavior or a documented read-only exception accepted for this feature.

**Acceptance Scenarios**:

1. **Given** a content type that appears on the public website, **When** an administrator opens the matching dashboard management area, **Then** the administrator can perform the supported lifecycle actions for that content type.
2. **Given** dashboard content is created or updated, **When** the public website reads that content, **Then** the public website displays the latest valid data using the existing public contract.
3. **Given** dashboard content is deleted or deactivated, **When** the public website refreshes its data, **Then** the public website no longer presents stale or orphaned content.

---

### User Story 3 - Existing API Contracts Remain Compatible (Priority: P1)

As a maintainer, I need route repairs to preserve existing public site and dashboard API contracts so the integration fix does not break valid current clients.

**Why this priority**: This package is a repair package, not a redesign. Compatibility is required so improvements can ship safely on top of the prior API stabilization work.

**Independent Test**: Run compatibility checks against representative public-site reads and dashboard CRUD requests before and after route repairs. The feature succeeds when valid existing payloads and response shapes still work, with only additive or documented compatible changes.

**Acceptance Scenarios**:

1. **Given** a valid public website request that works before this package, **When** the route repair is complete, **Then** the request still succeeds with the expected response shape.
2. **Given** a valid dashboard request that works before this package, **When** the route repair is complete, **Then** the request still succeeds without requiring a dashboard contract change.
3. **Given** a missing or disconnected route is repaired, **When** public and dashboard clients call it through their existing integration points, **Then** the route returns consistent success and error shapes aligned with current API conventions.

---

### User Story 4 - CRUD Verification Covers Integration Gaps (Priority: P2)

As a developer, I need verification coverage for dashboard CRUD and public-site compatibility so future changes do not reintroduce missing routes or disconnected data flows.

**Why this priority**: The value of this repair depends on preventing regressions across multiple clients and content resources.

**Independent Test**: Execute automated checks that exercise create, read, update, delete, and public-read compatibility for each repaired or newly connected resource.

**Acceptance Scenarios**:

1. **Given** a repaired resource, **When** CRUD verification runs, **Then** create, read, update, and delete behavior is covered for the dashboard-facing workflow.
2. **Given** a resource shown publicly, **When** compatibility verification runs, **Then** the public website can read the resource after dashboard mutations.
3. **Given** a resource is intentionally not dashboard-managed, **When** verification is reviewed, **Then** the exception is documented with owner, reason, and follow-up decision.

### Edge Cases

- Project categories may already exist as hard-coded values, derived values, or stored records; the repaired behavior must define one source of truth without breaking current public category displays.
- Deleting a project category that is still assigned to projects must be prevented or handled with a clear reassignment/deactivation outcome.
- Renaming a category must not break existing project references, URLs, filters, or dashboard selectors.
- Empty category lists, empty project lists, and unpublished or hidden items must display gracefully in both public and dashboard flows.
- Dashboard mutations must not leave orphaned public records, stale selectors, or content that is visible publicly but uneditable administratively.
- Public read routes must remain accessible according to current behavior, while dashboard write routes must retain current authorization expectations.
- Route repairs must not expose internal errors, raw validation details, or incompatible error shapes to public or dashboard clients.
- Uploaded media and CV links associated with managed content must remain stable when related content is edited through the dashboard.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST inventory every public website data dependency and map it to its dashboard management path, API route coverage, and ownership status.
- **FR-002**: The system MUST identify and repair missing, disconnected, or inconsistent routes required for dashboard-to-public content integration.
- **FR-003**: The system MUST provide dashboard management for project categories, including create, read, update, delete, listing, and project assignment behavior.
- **FR-004**: The system MUST define a single authoritative category state used by dashboard category controls and public project category displays.
- **FR-005**: The system MUST prevent category deletion or mutation from leaving projects with invalid, orphaned, or hidden category references.
- **FR-006**: The dashboard MUST be able to add, edit, and delete all public website data that is intended to be administratively managed.
- **FR-007**: Any public website data that remains outside dashboard management MUST be documented as an explicit read-only or deferred exception with a reason and follow-up owner.
- **FR-008**: The system MUST preserve existing API request and response contracts for valid public website requests.
- **FR-009**: The system MUST preserve existing API request and response contracts for valid dashboard requests.
- **FR-010**: The system MUST allow only backward-compatible additions to existing response data unless a breaking change is explicitly documented and approved outside this feature.
- **FR-011**: The system MUST keep public read behavior and dashboard write authorization behavior consistent with current product expectations.
- **FR-012**: The system MUST return consistent success and error shapes for repaired routes so public site and dashboard clients can handle results predictably.
- **FR-013**: The system MUST include CRUD verification for every repaired or newly connected dashboard-managed resource.
- **FR-014**: The system MUST include compatibility verification proving public website views can consume data after dashboard create, update, and delete operations.
- **FR-015**: The system MUST include regression verification for existing public-site reads and existing dashboard requests affected by the route repairs.
- **FR-016**: The system MUST document any deferred route conversions, content management gaps, or compatibility risks discovered during the repair package.

### Key Entities *(include if feature involves data)*

- **Project Category**: A classification used to organize projects in dashboard controls and public project filtering or display; includes identity, display name, ordering/status, and project relationships.
- **Project**: A public construction project shown on listing and detail views; includes category assignment, display metadata, media references, and publication state.
- **Public Content Resource**: Any data type displayed on the public website, such as projects, services, applications-facing content, media-backed records, or other site sections identified during inventory.
- **Dashboard Management Surface**: The administrative workflow used to create, read, update, or delete a public content resource.
- **API Contract**: The agreed request and response shape currently used by the public website or dashboard for a resource.
- **Integration Gap**: A missing route, unlinked client call, inconsistent data shape, or unmanaged public data dependency that prevents reliable dashboard-to-public synchronization.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of public website data dependencies are mapped to dashboard management, an existing API route, or a documented exception.
- **SC-002**: Project categories can be created, listed, updated, deleted when safe, and assigned to projects from the dashboard, then observed correctly on public project views.
- **SC-003**: 100% of repaired dashboard-managed resources have verification coverage for create, read, update, and delete behavior.
- **SC-004**: 100% of repaired resources shown on the public site have compatibility verification proving public reads still work after dashboard mutations.
- **SC-005**: Existing valid public website and dashboard API calls affected by this package continue to succeed without required client contract changes.
- **SC-006**: No public site content type intended for dashboard management remains without a working dashboard route path or documented deferred exception.
- **SC-007**: Category deletion, category rename, empty category, and stale-reference scenarios are verified without orphaning public project data.

## Assumptions

- This is the second repair package and builds on the prior API runtime and security stabilization work.
- The dashboard is intended to be the administrative source for content that appears on the public website unless a content type is explicitly documented as read-only or deferred.
- Current public site and dashboard behavior are the compatibility baseline for valid requests and responses.
- Project categories are in scope because they are a known or likely integration gap between public project browsing and dashboard project management.
- Exact resource names and route paths will be resolved during planning from the existing codebase and current API contract usage.
- This feature focuses on integration correctness and compatibility; broad UI redesign, SEO, and unrelated performance optimization are outside this package unless they directly block verified integration behavior.
