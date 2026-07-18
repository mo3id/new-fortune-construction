# UI Verification Contract

This contract defines what implementation tasks must prove before the UI/UX responsive package is considered complete.

## Viewport Baseline

| Viewport | Size | Purpose |
|----------|------|---------|
| Desktop | 1440 x 1000 | Typical laptop/desktop layout, dashboard tables, public hero/portfolio presentation |
| Mobile | 390 x 844 | Narrow phone layout, mobile navigation, stacked forms, modals, tables/lists |

## Public Site Targets

| Target | Required checks |
|--------|-----------------|
| `/` | Navigation, hero, services, projects preview, partners/testimonials, footer, no page-level horizontal scroll |
| `/projects` | Filters, stats, map/portfolio grid, empty/loading state, long project/category labels |
| `/projects/:id` | Detail hero, sidebar/meta panel, gallery, long text, fallback state |
| `/about` | Page hero, timeline/values/team sections, media dimensions |
| `/careers` | Jobs list, application form, upload control, empty jobs state |
| `/contact` | Contact form, contact info cards, map/footer settings data |

## Dashboard Targets

| Target | Required checks |
|--------|-----------------|
| `/` | Dashboard shell, sidebar/header, stat cards, recent activity cards |
| `/projects` | Project cards/list, project form modal, media/gallery controls, category selector |
| `/project-categories` | Category list/cards, create/edit modal, enable/disable actions |
| `/services` | Service list/cards, create/edit modal, long descriptions |
| `/partners` | Partner cards, logo/media controls, modal footer actions |
| `/team` | Team cards, photo upload, social fields, modal scrolling |
| `/jobs` | Job list, active/inactive controls, form modal |
| `/settings` | Settings form groups, business/contact/social fields |
| `/content` | Page tabs, dynamic section editor, array fields, media fields, sticky actions |
| `/messages` | Message list/detail modal, read/delete actions, empty state |
| `/applications` | Applications table/list, status actions, CV link, cover-letter modal |

## Required Evidence Per Checked Target

- Screenshot or equivalent visual record for desktop.
- Screenshot or equivalent visual record for mobile.
- Console error summary.
- Failed network request summary.
- Page-level horizontal scroll status.
- Visible overlap/clipped primary action status.
- Notes for tables/lists/forms/modals where present.
- API contract risk note if the page uses API data or dashboard writes.

## Pass Criteria

A target passes when:

1. No blocking overlap hides primary content or actions.
2. No unintended page-level horizontal scrolling exists.
3. Primary navigation and actions are reachable.
4. Forms show labels, validation state, and submit/cancel controls clearly.
5. Tables or list equivalents remain usable on mobile.
6. Modals remain scrollable and controls remain reachable.
7. Console/network evidence contains no new UI-caused errors.
8. Existing API request/response contracts remain unchanged.

## Failure Handling

- P1 failures must be fixed before final verification.
- P2 failures may be fixed in the package or documented with a clear follow-up if they do not block primary workflows.
- P3 polish items can be deferred when they do not affect usability, responsiveness, or API-connected workflows.
