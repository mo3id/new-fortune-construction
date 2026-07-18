# Static Scan Summary

**Captured**: 2026-07-17 23:15 Africa/Cairo  
**Updated**: 2026-07-17 23:23 Africa/Cairo  
**Scope**: T010-T012 baseline static checks plus US2/US3 post-change static checks.

## Route Import Scan

Command:

```bash
rg -n "React\\.lazy|lazy\\(|Suspense|import\\(|createBrowserRouter|Routes|Route" src apps/dashboard/src
```

Key findings:

- `src/router.tsx` uses `createBrowserRouter` and top-level imports for all public pages.
- `apps/dashboard/src/App.tsx` uses `Routes`/`Route` and top-level imports for all dashboard pages.
- `apps/dashboard/src/pages/Services.tsx` dynamically imports `../lib/api`, matching the dashboard build warning that this import does not produce a split chunk because the module is statically imported elsewhere.

Post-change findings:

- `src/router.tsx` uses `React.lazy`/`Suspense` for all public route pages while preserving the route path list.
- `apps/dashboard/src/App.tsx` uses `React.lazy`/`Suspense` for all dashboard page routes while preserving the route path list.
- `apps/dashboard/src/pages/Services.tsx` no longer dynamically imports `../lib/api`; it uses the existing `uploadImage` export through a normal import.

## Media/Image Scan

Command:

```bash
rg -n "<img|<video|loading=|decoding=|preload=|poster=|srcSet|picture|Image" src apps/dashboard/src packages
```

Key findings:

- `src/components/hero/VideoBackground.tsx` renders `<video>` for each configured local video source.
- `src/components/ui/Image.tsx` and `packages/shared-ui/src/components/ui/image.tsx` render `<img>` without default `loading` or `decoding`.
- Multiple public and dashboard surfaces use image-heavy cards/previews; optimization should start with shared image defaults, not broad call-site rewrites.

Post-change findings:

- `src/components/ui/Image.tsx` and `packages/shared-ui/src/components/ui/image.tsx` set default `loading="lazy"` and `decoding="async"`.
- The actual critical above-the-fold call sites identified for T035 are `src/components/ui/PageHero.tsx` and `packages/shared-ui/src/components/ui/page-hero.tsx`; both explicitly use `loading="eager"`.
- `src/components/hero/VideoBackground.tsx` now renders the active source plus the next local video only and sets video `preload` based on active/warm state.

## Render/Filtering Scan

Command:

```bash
rg -n "filter\\(|map\\(|sort\\(|reduce\\(|useMemo|useCallback|memo\\(" src apps/dashboard/src
```

Key findings:

- `apps/dashboard/src/pages/Applications.tsx` computes `filtered = apps.filter(...)` during render and maps all filtered rows.
- Public `ProjectsPage` already uses `useMemo` for project and category derivations, so it is not a Phase 1/2/US1 implementation target.
- Broad pagination/cache work remains deferred because it could change API contracts.

## Large Local Media

Command:

```bash
find public -type f -size +500k -exec ls -lh {} +
```

Results:

- `public/assets/videos/vedio1.mp4`: 1.2 MB
- `public/assets/videos/vedio2.mp4`: 6.4 MB
- `public/assets/videos/vedio3.mp4`: 2.8 MB

No media re-encoding or replacement was performed.
