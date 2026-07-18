# Evidence Helpers

This directory stores compact helper notes for evidence collected during `006-performance-optimization`.

## Current Files

- `static-scan-summary.md`: Static scan summaries for T010-T012 and media asset inventory.

## Commands Used

```bash
npm run build
npm run build --workspace=apps/dashboard
npm run typecheck
rg -n "React\\.lazy|lazy\\(|Suspense|import\\(|createBrowserRouter|Routes|Route" src apps/dashboard/src
rg -n "<img|<video|loading=|decoding=|preload=|poster=|srcSet|picture|Image" src apps/dashboard/src packages
rg -n "filter\\(|map\\(|sort\\(|reduce\\(|useMemo|useCallback|memo\\(" src apps/dashboard/src
find public -type f -size +500k -exec ls -lh {} +
```

## Runtime Status

No dev server, browser runtime, or API runtime was started for T001-T025.
