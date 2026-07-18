# UI Surface Inventory

This inventory is based on static code review during planning. Browser screenshots and runtime console/network evidence are expected during implementation.

## Public Site Surfaces

| Surface | Source | API/content dependencies | Current UI patterns | Initial risk priority |
|---------|--------|--------------------------|---------------------|-----------------------|
| Home | `src/App.tsx`, `src/components/Hero.tsx`, `Services.tsx`, `Projects.tsx`, `Partners.tsx`, `Impact.tsx`, `Footer.tsx` | `/settings`, `/content/home`, `/services`, `/projects`, `/partners` | Fixed nav, full-screen hero, media background, cards, section grids, testimonials, footer | P1 |
| Projects | `src/pages/ProjectsPage.tsx`, `src/components/projects/*` | `/projects`, `/project-categories` | Filters, stats, map/sidebar, portfolio grid, empty/loading states | P1 |
| Project Details | `src/pages/ProjectDetailsPage.tsx` | `/projects/:id` | Detail hero, sticky side panel, gallery grid, fallback/loading/error state | P1 |
| About | `src/pages/AboutPage.tsx`, `Timeline.tsx` | `/team`, `/content/about` | Page hero, values/timeline/team sections | P2 |
| Careers | `src/pages/CareersPage.tsx`, `ApplicationForm.tsx` | `/jobs`, `/content/careers`, `/applications/submit` | Jobs list, sticky side content, application form, upload control | P1 |
| Contact | `src/pages/ContactPage.tsx`, `contact/*`, `footer/FooterMap.tsx` | `/settings`, `/content/contact`, `/messages/submit` | Contact form, info cards, map/footer settings | P1 |
| HSE | `src/pages/HSEPage.tsx` | `/content/hse` | Page hero, cards, certificates/policies | P2 |

## Dashboard Surfaces

| Surface | Source | API dependencies | Current UI patterns | Initial risk priority |
|---------|--------|------------------|---------------------|-----------------------|
| Shell / Overview | `apps/dashboard/src/components/Layout.tsx`, `Sidebar.tsx`, `pages/Overview.tsx` | `/stats` | Fixed sidebar, top header, stat cards, recent lists | P1 |
| Projects | `pages/Projects.tsx` | `/projects`, `/project-categories`, uploads | Cards, large custom modal, media/gallery upload, sticky footer actions | P1 |
| Project Categories | `pages/ProjectCategories.tsx` | `/project-categories` | Category cards, create/edit modal, enable/disable actions | P1 |
| Services | `pages/Services.tsx` | `/services`, uploads | Cards/list, modal, media field | P1 |
| Partners | `pages/Partners.tsx` | `/partners`, uploads | Partner cards, image upload, custom modal | P1 |
| Team | `pages/Team.tsx` | `/team`, uploads | Team cards, photo upload, custom modal | P1 |
| Jobs | `pages/Jobs.tsx` | `/jobs/all`, `/jobs` writes | Job list/cards, form modal, active controls | P1 |
| Settings | `pages/Settings.tsx` | `/settings` | Long grouped settings form, save action | P1 |
| Page Content | `pages/PageContent.tsx` | `/content/:page`, `/content/:page/:section`, uploads | Tabs, dynamic section forms, array fields, media fields | P1 |
| Messages | `pages/Messages.tsx` | `/messages` | Filter controls, message list/detail modal, read/delete actions | P2 |
| Applications | `pages/Applications.tsx` | `/applications`, status update, CV links | Table, status select, cover-letter modal, delete action | P1 |

## Shared UI Pattern Candidates

| Pattern | Source | Planning note |
|---------|--------|---------------|
| Global modal | `packages/shared-ui/src/components/modals/GlobalModal.tsx` | Uses large rounded container and padding; verify mobile max-height, scroll behavior, sticky action areas, and custom modal child content. |
| Form input | `packages/shared-ui/src/components/forms/FormInput.tsx` | Labels are compact uppercase; verify readability, long placeholders, validation messages, select width, number fields, and file inputs. |
| Media upload | `packages/shared-ui/src/components/MediaUploadField.tsx` | Verify stable dimensions, file-name wrapping, loading states, and mobile control reachability. |
| Empty state | `packages/shared-ui/src/components/EmptyState.tsx` | Candidate for consistent empty states across dashboard and public lists. |
| Tables | `packages/shared-ui/src/components/ui/table.tsx`, dashboard page tables | Verify mobile overflow is constrained to data regions and actions remain visible. |
| Navigation | `src/components/Navbar.tsx`, `apps/dashboard/src/components/Sidebar.tsx` | Public mobile menu and dashboard fixed sidebar are high-priority responsive checks. |

## Browser Inventory Plan

Implementation must run browser checks after any UI changes against the targets in `contracts/ui-verification-contract.md`. Each checked route must record desktop/mobile evidence, console errors, failed network requests, horizontal scrolling, visible overlap, and notes for forms/tables/modals.

## Final US4 Inventory Status

| Category | Changed Surfaces | Fixed Findings | Remaining Follow-Ups |
|----------|------------------|----------------|----------------------|
| Public site | None | No P1 public findings were proven by browser verification. | Public API-backed content can be re-checked with API enabled in a later integration pass if needed; public fallback content stayed readable during API-off checks. |
| Dashboard shell | `apps/dashboard/src/components/Layout.tsx`, `apps/dashboard/src/components/Sidebar.tsx` | `UI-011` fixed mobile sidebar/content clipping with off-canvas sidebar behavior and reachable mobile menu controls. | None blocking. |
| Dashboard Page Content | `apps/dashboard/src/pages/PageContent.tsx` | `UI-012` fixed clipped mobile Page Content tabs by allowing tab wrapping. | Dedicated Success Stories dashboard page remains out of scope; Success Stories continue through Page Content `home.successStories`. |
| Dashboard Applications | `apps/dashboard/src/pages/Applications.tsx` | `UI-013` fixed mobile empty-state clipping by rendering the no-results message outside the scrollable table. | A broad migration from local dashboard tables to shared `Table` components is a polish-only follow-up, not required by current evidence. |
| Shared UI patterns | Documentation/evidence only | Button hierarchy, empty/loading/error states, card/badge/table consistency, and media placeholders were audited for US3. No shared component code change was required. | External Unsplash ORB failures in headless Chrome remain a media-source/environment follow-up. |

## Evidence Coverage Summary

- Public evidence: `specs/004-ui-ux-responsive/evidence/public-browser-results.json` plus `T019`-`T024` screenshots cover all public targets at desktop and mobile sizes.
- Dashboard evidence: `specs/004-ui-ux-responsive/evidence/dashboard-browser-results.json` plus `T035`-`T039` screenshots cover all dashboard targets at desktop and mobile sizes.
- US3 representative evidence: `specs/004-ui-ux-responsive/evidence/dashboard-us3-browser-results.json` plus `T060-us3-*` screenshots verify the shared UI changes and Applications empty-state fix.
- No unresolved P1 finding remains in `ui-findings.md`; API contract guardrails remain documented for unchanged API contracts, `Project.category` string compatibility, and Success Stories via Page Content.
