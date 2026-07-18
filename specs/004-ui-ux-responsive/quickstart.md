# Quickstart: UI/UX Responsive Improvements

This quickstart defines the verification workflow for implementation. Runtime browser checks are planned for implementation, not planning.

## Baseline Rules

- Do not change API endpoints, request payloads, response envelopes, auth behavior, or `Project.category` string compatibility.
- Keep Success stories on the accepted Page Content `home.successStories` path unless a separate approved package adds a dedicated page.
- Prefer focused fixes over broad redesign.
- Promote shared fixes only when multiple surfaces share the same issue.

## Static Checks

Run static/source inventory before changing UI:

```bash
rg -n "overflow|GlobalModal|table|isLoading|No |error|apiFetch|useQuery|useMutation" src apps/dashboard/src packages/shared-ui/src -g '*.tsx' -g '*.ts'
```

Confirm:

- Public route targets are represented in `src/router.tsx`.
- Dashboard route targets are represented in `apps/dashboard/src/App.tsx`.
- Forms, modals, tables/lists, loading/empty/error states, and upload controls have owners.
- Existing API consumers remain unchanged unless a backward-compatible UI-only adjustment is required.

## Runtime Browser Verification Plan

Start local services only during implementation when ready to verify:

```bash
npm run dev
npm run dev:dashboard
```

If API-backed states are needed:

```bash
npm run dev:api
```

Before starting API runtime, reuse the safety expectations from prior specs: local-safe environment only, no accidental remote/production database connection.

## Viewports

- Desktop: 1440 x 1000
- Mobile: 390 x 844

## Public Site Checks

Verify desktop and mobile for:

- `/`
- `/projects`
- `/projects/:id`
- `/about`
- `/careers`
- `/contact`
- `/hse`

Record:

- Screenshot or equivalent evidence.
- Console errors.
- Failed network requests.
- Page-level horizontal scrolling.
- Visible overlap or clipped primary actions.
- Loading/empty/error states where applicable.

### T001-T034 Verification Result

- Public browser verification was run against `http://127.0.0.1:5173` with `npm run dev`.
- API runtime was not started because US1 browser checks did not require API-backed states; API failures were recorded as expected network evidence.
- Screenshots and raw metrics are stored in `specs/004-ui-ux-responsive/evidence/`, including `public-browser-results.json`.
- Result: all public routes returned HTTP 200 at 1440x1000 and 390x844, with no page-level horizontal scrolling and no clipped primary actions. No P1 public UI fix was required in T026-T032.

### T035-T052 Verification Result

- Dashboard browser verification was run against `http://localhost:5174` with local API on `http://localhost:3001`.
- API local-safe check passed before use: no active remote `MONGODB_URI` was configured, `/health` returned local memory database status, and no secrets were printed.
- Screenshots and raw metrics are stored in `specs/004-ui-ux-responsive/evidence/`, including `dashboard-browser-results.json`.
- Initial mobile dashboard check proved a P1 sidebar/content clipping issue. The shell fix was limited to `apps/dashboard/src/components/Layout.tsx` and `apps/dashboard/src/components/Sidebar.tsx`.
- A second mobile check proved a clipped Page Content tab action; the fix was limited to `apps/dashboard/src/pages/PageContent.tsx`.
- Re-check result: all dashboard routes returned HTTP 200 at 1440x1000 and 390x844, with 0 console errors, no page-level horizontal scrolling, and no clipped primary actions. Remaining Applications table empty-state clipping is a P2 table/list follow-up.

### T053-T061 Verification Result

- US3 shared UI consistency audit found one evidence-backed P2 issue: Applications empty table text was clipped on mobile when no rows matched.
- The fix was limited to `apps/dashboard/src/pages/Applications.tsx`; no shared UI broad rewrite and no API contract changes were made.
- Representative browser verification was run with local-safe API and dashboard dev servers using `specs/004-ui-ux-responsive/evidence/verify-dashboard-us3-ui.mjs`.
- Raw metrics and screenshots are stored in `specs/004-ui-ux-responsive/evidence/`, including `dashboard-us3-browser-results.json` and `T060-us3-*.png`.
- Result: `/projects`, `/content`, `/messages`, and `/applications` returned HTTP 200 on desktop and mobile, with 0 console errors, no page-level horizontal scrolling, and 0 action overflow. `/applications` mobile forced an empty search state and the empty message now fits inside the 390px viewport with no overflow offenders.
- The only failed network requests were the previously documented external Unsplash ORB failures on `/projects`; API-backed dashboard requests succeeded.

### T062-T069 Verification Result

- US4 reviewed existing evidence only; no new runtime commands, builds, typechecks, or Final Phase tasks were run.
- Coverage passed for all public targets in `browser-verification.md`: `/`, `/projects`, `/projects/1`, `/careers`, `/contact`, `/about`, and `/hse` each have desktop and mobile rows, screenshots, console/network summaries, horizontal-scroll status, and overlap/clipped-action notes.
- Coverage passed for all dashboard targets in `browser-verification.md`: `/`, `/projects`, `/project-categories`, `/services`, `/partners`, `/team`, `/jobs`, `/settings`, `/content`, `/messages`, and `/applications` each have desktop and mobile rows, screenshots, console/network summaries, horizontal-scroll status, and table/list/form/modal or clipped-action notes.
- Raw evidence sanity check passed for `public-browser-results.json`, `dashboard-browser-results.json`, and `dashboard-us3-browser-results.json`: every row includes `consoleErrors`, `failedRequests`, `metrics.pageHorizontalScroll`, and `metrics.actionOverflow`; all rows returned HTTP 200 and no row records page-level horizontal scrolling or action overflow after fixes.
- `ui-findings.md` now records no unresolved P1 finding. `UI-011` and `UI-012` are fixed, and the earlier `UI-005` P1 candidate is closed as superseded by fixed browser-promoted findings.
- API guardrails remain documented: no API endpoints/payloads/responses/auth changed, `Project.category` remains a string contract, and Success Stories remain managed through Page Content `home.successStories`.

## Dashboard Checks

Verify desktop and mobile for:

- `/`
- `/projects`
- `/project-categories`
- `/services`
- `/partners`
- `/team`
- `/jobs`
- `/settings`
- `/content`
- `/messages`
- `/applications`

Record:

- Sidebar/header behavior.
- Table/list behavior.
- Form label and validation readability.
- Modal scroll and action reachability.
- Upload/media control usability.
- Console and network evidence.

## Final Verification Commands

```bash
npm run typecheck
npm run build
npm run build --workspace=apps/dashboard
```

Run API or contract checks only if touched UI code changes API request/response assumptions:

```bash
npm run test --workspace=apps/api
```

### T070-T077 Final Verification Result

- `npm run typecheck`: Pass. TypeScript completed with `tsc --noEmit` and no reported errors.
- `npm run build`: Pass. Public Vite build completed successfully. Vite reported the existing non-blocking warning that the main JS chunk is larger than 500 kB after minification.
- `npm run build --workspace=apps/dashboard`: Pass. Dashboard `tsc && vite build` completed successfully. Vite reported two non-blocking warnings: `apps/dashboard/src/lib/api.ts` is both dynamically and statically imported so it will not move to a separate chunk, and the dashboard JS chunk is larger than 500 kB after minification.
- `npm run test --workspace=apps/api`: Not run. The UI work only changed presentation and evidence documents; it did not change API endpoints, request payloads, response shapes, auth behavior, or API client request/response assumptions.
- `Project.category` guardrail: Pass. `apps/api/src/models/Project.ts` still declares `category: string` and stores it as `String`; `apps/dashboard/src/pages/Projects.tsx` still writes category names as strings; `src/pages/ProjectsPage.tsx` still filters with `project.category === category`.
- Success Stories guardrail: Pass. Public Success Stories still read `home.successStories` in `src/components/Partners.tsx`, and dashboard editing remains in `apps/dashboard/src/pages/PageContent.tsx` under the `Success Stories` section mapped to `successStories`.
- Broad redesign guardrail: Pass. Dashboard routing and sidebar navigation still have no dedicated Success Stories dashboard page, and the UI changes remain limited to documented responsive fixes.

## Deferred Follow-Ups

- Dedicated Success stories dashboard page remains out of scope unless explicitly requested.
- Deep bundle splitting remains a performance follow-up unless UI work worsens build warnings.
- Full formal accessibility audit can be a later package; this package covers practical labels, focus visibility, modal usability, and responsive interaction.
- External Unsplash ORB failures in headless browser checks remain an environment/media-source follow-up, not a blocking UI regression.
- Public and dashboard bundle/chunk splitting remains a deferred performance follow-up because both production builds pass and the warnings predate any broad performance package.
